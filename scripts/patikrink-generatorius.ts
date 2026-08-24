/**
 * Generatorių auditas — Fazės 3 priėmimo kriterijus.
 *
 * Sugeneruoja po N uždavinių iš kiekvieno generatoriaus kiekvienam lygiui ir
 * tikrina, ar nėra bjaurių atsakymų, sugedusio KaTeX ar nesuderinamumų grafe.
 *
 * Paleidimas:  npm run patikra
 */

import katex from 'katex'
import { generatoriai, generuokRinkini, generuokTemosRinkini } from '../lib/generatoriai/index'
import { sablonas } from '../lib/generatoriai/bendra'
import { sritisKlasei, uzRibos, type Sritis } from '../lib/generatoriai/sritis'
import type { Lygis, Uzdavinys } from '../lib/generatoriai/tipai'
import { normalizuok } from '../lib/matematika'
import { potemes, programa, temosGeneratoriai } from '../lib/programa'
import { temos } from '../lib/diagnostikos-temos'
import { TEMU_SRITYS } from '../lib/temu-sritys'

const KIEK = Number(process.argv[2] ?? 100)
const RODYTI_PAVYZDZIUS = process.argv.includes('--pavyzdziai')

/** Generatoriai, iš kurių sudaromi visos temos lapai — visų potemių sąrašas. */
const POTEMIU_GENERATORIAI = new Set(
  programa.flatMap((k) => k.temos.flatMap((t) => temosGeneratoriai(t))),
)

const klaidos: string[] = []
const perspejimai: string[] = []
/** Žinoma įvairovės skola — rodoma atskirai, patikros nestabdo. */
const skola: string[] = []

// ---------------------------------------------------------------------------
// Grafo vientisumas
// ---------------------------------------------------------------------------

function patikrinkGrafa(): void {
  const id = new Set(temos.map((t) => t.id))

  // Sričių lentelė turi dengti visą programą ir neturėti likučių: be srities
  // tema iškrenta iš grandinės, o likutis rodo, kad tema buvo pervadinta.
  for (const k of programa) {
    for (const t of k.temos) {
      if (!TEMU_SRITYS[`${k.klase}.${t.numeris}`]) {
        klaidos.push(
          `Sričių lentelėje trūksta temos "${k.klase}.${t.numeris}" — ${k.klase} kl. „${t.pavadinimas}"`,
        )
      }
    }
  }
  for (const raktas of Object.keys(TEMU_SRITYS)) {
    if (!id.has(raktas)) klaidos.push(`Sričių lentelėje yra nebeegzistuojanti tema "${raktas}"`)
  }

  for (const t of temos) {
    if (t.generatoriai.length === 0) {
      klaidos.push(`Tema "${t.id}" neturi nė vieno potemės generatoriaus`)
    }
    for (const g of t.generatoriai) {
      if (!(g in generatoriai)) {
        klaidos.push(`Tema "${t.id}" nurodo neegzistuojantį generatorių "${g}"`)
      }
    }
    for (const p of t.priklausoNuo) {
      if (!id.has(p)) klaidos.push(`Tema "${t.id}" priklauso nuo nežinomos temos "${p}"`)
    }
    const prielaidos = temos.filter((x) => t.priklausoNuo.includes(x.id))
    for (const p of prielaidos) {
      if (p.klase > t.klase) {
        klaidos.push(
          `Tema "${t.id}" (${t.klase} kl.) priklauso nuo vėlesnės temos "${p.id}" (${p.klase} kl.)`,
        )
      }
    }
  }

  // Ciklai
  const busena = new Map<string, 'tikrinama' | 'baigta'>()
  const zemyn = (temaId: string, kelias: string[]): void => {
    if (busena.get(temaId) === 'baigta') return
    if (busena.get(temaId) === 'tikrinama') {
      klaidos.push(`Ciklas grafe: ${[...kelias, temaId].join(' → ')}`)
      return
    }
    busena.set(temaId, 'tikrinama')
    const t = temos.find((x) => x.id === temaId)
    for (const p of t?.priklausoNuo ?? []) zemyn(p, [...kelias, temaId])
    busena.set(temaId, 'baigta')
  }
  for (const t of temos) zemyn(t.id, [])

  // Diagnostikos grafas dabar išvedamas iš programos, tad naudojimą lemia tik
  // ji. Generatorius gali būti naudojamas ir tik potemėje — tada jis naudojamas.
  const programosGeneratoriai = new Set(
    programa.flatMap((k) =>
      k.temos.flatMap((t) => [
        t.generatorius,
        ...potemes(t).map((p) => p.generatorius),
      ]),
    ),
  )
  const nenaudojami = Object.keys(generatoriai).filter((g) => !programosGeneratoriai.has(g))
  if (nenaudojami.length > 0) {
    perspejimai.push(`Generatoriai be temos: ${nenaudojami.join(', ')}`)
  }

  // Programa negali rodyti temos su neegzistuojančiu generatoriumi.
  for (const k of programa) {
    for (const t of k.temos) {
      for (const g of [t.generatorius, ...potemes(t).map((p) => p.generatorius)]) {
        if (g && !(g in generatoriai)) {
          klaidos.push(
            `Programa: ${k.klase} kl. tema „${t.pavadinimas}" nurodo nežinomą generatorių "${g}"`,
          )
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Vieno uždavinio patikra
// ---------------------------------------------------------------------------

/** Racionalusis skaičius iš normalizuoto atsakymo, jei tai skaičius. */
function kaipTrupmena(normalizuotas: string): { sk: number; vd: number } | null {
  const t = normalizuotas.match(/^(-?\d+)\/(\d+)$/)
  if (t) return { sk: Number(t[1]), vd: Number(t[2]) }
  if (/^-?\d+$/.test(normalizuotas)) return { sk: Number(normalizuotas), vd: 1 }
  return null
}

function patikrinkUzdavini(u: Uzdavinys, vardas: string, lygis: Lygis): void {
  const kur = `${vardas} (lygis ${lygis})`

  // Visos temos rinkinys nustato, iš kurios potemės uždavinys, būtent pagal
  // `temaId`. Jei jis nesutampa su registro raktu, potemė lape atrodytų
  // nepadengta, nors uždavinys ten yra.
  //
  // Tikrinami tik programos potemių generatoriai. Keli seni bendrieji
  // generatoriai (`sveikieji`, `pupp`) tyčia deleguoja kitiems ir grąžina jų
  // `temaId`; jie temų lapuose nebenaudojami, tad jiems taisyklė netaikoma.
  if (POTEMIU_GENERATORIAI.has(vardas) && u.temaId !== vardas) {
    klaidos.push(`${kur}: temaId "${u.temaId}" nesutampa su generatoriaus raktu`)
  }

  for (const [laukas, reiksme] of [
    ['klausimas', u.klausimas],
    ['atsakymasRodymui', u.atsakymasRodymui],
    ['sprendimas', u.sprendimas ?? ''],
    ['brezinys', u.brezinys ?? ''],
  ] as const) {
    if (/undefined|NaN|Infinity/.test(reiksme)) {
      klaidos.push(`${kur}: ${laukas} turi šiukšlių — "${reiksme}"`)
    }
    // „- -", „+ -" be skliaustų skaitosi kaip klaida rinkinyje.
    // Brėžinyje neigiami skaičiai yra ašių padalos — jiems ši taisyklė netaikoma.
    if (laukas !== 'brezinys' && /[+\-]\s+-\d/.test(reiksme)) {
      klaidos.push(`${kur}: ${laukas} turi nesutvarkytą ženklų porą — "${reiksme}"`)
    }
  }

  if (u.atsakymas === '') {
    klaidos.push(`${kur}: tuščias atsakymas`)
    return
  }

  if (normalizuok(u.atsakymas) !== u.atsakymas) {
    klaidos.push(`${kur}: atsakymas "${u.atsakymas}" nėra normalizuotas`)
  }

  const skaicius = kaipTrupmena(u.atsakymas)
  if (skaicius) {
    // Vardiklis, kuris dalija 1000, reiškia dešimtainę trupmeną (0,39 → 39/100).
    // Tokie atsakymai tvarkingi; bjaurūs yra tik nedalūs vardikliai.
    const desimtaine = 1000 % skaicius.vd === 0
    if (!desimtaine && skaicius.vd > 20) {
      klaidos.push(`${kur}: bjaurus vardiklis ${skaicius.vd} atsakyme "${u.atsakymas}"`)
    }
    // Riba plati sąmoningai: 4 klasės programoje yra skaičiai iki 1 000 000,
    // o kombinatorikoje — kėliniai. Tikroji bjaurumo riba yra vardiklis.
    if (Math.abs(skaicius.sk) > 1_000_000) {
      klaidos.push(`${kur}: per didelis skaičius atsakyme "${u.atsakymas}"`)
    }
  } else {
    perspejimai.push(`${kur}: atsakymas nėra skaičius — "${u.atsakymas}"`)
  }

  if (u.brezinys && !(u.brezinys.startsWith('<svg') && u.brezinys.endsWith('</svg>'))) {
    klaidos.push(`${kur}: brėžinys nėra pilnas SVG`)
  }

  // KaTeX turi surinkti visus $...$ fragmentus be klaidų.
  for (const tekstas of [u.klausimas, u.atsakymasRodymui, u.sprendimas ?? '']) {
    const dalys = tekstas.split('$')
    for (let i = 1; i < dalys.length; i += 2) {
      try {
        katex.renderToString(dalys[i], { throwOnError: true, displayMode: false })
      } catch (e) {
        klaidos.push(`${kur}: KaTeX nesurenka "${dalys[i]}" — ${(e as Error).message}`)
      }
    }
    if (dalys.length % 2 === 0) {
      klaidos.push(`${kur}: neporinis $ tekste "${tekstas}"`)
    }
  }
}

// ---------------------------------------------------------------------------
// Programos patikra: sritis ir rinkinio įvairovė
//
// Ankstesnis auditas tikrino generatorius atskirai, be klasės ir be temos.
// Todėl jam „Koks skaičius eina prieš pat 6523?“ pirmokui atrodė tvarkinga:
// atsakymas teisingas, KaTeX švarus, eilutės nesikartoja. Šios dvi patikros
// žiūri būtent to, kas lūžo — kokį rinkinį gauna konkrečios klasės mokinys.
// ---------------------------------------------------------------------------

/** Kiek uždavinių rinkinyje tikrinama — tiek pat, kiek rodo svetainė. */
const RINKINYJE = 10

/**
 * Įvairovės ribos dešimties uždavinių rinkiniui.
 *
 * Du atskiri slenksčiai, nes tai du skirtingi dalykai. Vienas ar du šablonai
 * dešimčiai uždavinių yra broko riba — būtent tokį rinkinį („Koks skaičius
 * eina prieš pat …?“ ×10) ir buvo skųstasi, tad tai klaida. Keturi ar penki
 * šablonai yra plonoka, bet naudojama — tai matomas darbų sąrašas.
 */
const IVAIROVE_KLAIDA = 3
const IVAIROVE_PERSPEJIMAS = 6

/**
 * Generatoriai, kurie kol kas turi tik vieną ar du uždavinio pavidalus.
 *
 * Šiuo metu sąrašas tuščias — visi generatoriai duoda bent tris skirtingus
 * šablonus dešimčiai uždavinių. Sąrašas gali tik trumpėti: auditas rėkia ir
 * tada, kai į jį patenka kas nors naujo, ir tada, kai įrašas nebereikalingas,
 * tad pamiršti jo išbraukti nepavyks.
 */
const SKOLA = new Set<string>([])

/** Generatoriai iš `SKOLA`, kurie per šį paleidimą nė karto nenukrito. */
const skolaPasitaise = new Set(SKOLA)

function patikrinkPrograma(): void {
  for (const k of programa) {
    for (const tema of k.temos) {
      const vienetai: { kur: string; generatorius: string; lygis: Lygis; sritis?: Sritis }[] = []

      if (tema.generatorius) {
        vienetai.push({
          kur: `${k.klase} kl. ${tema.numeris}. ${tema.pavadinimas}`,
          generatorius: tema.generatorius,
          lygis: tema.lygis ?? 2,
          sritis: tema.sritis,
        })
      }
      for (const p of potemes(tema)) {
        if (!p.generatorius) continue
        vienetai.push({
          kur: `${k.klase} kl. ${p.numeris}. ${p.pavadinimas}`,
          generatorius: p.generatorius,
          lygis: p.lygis,
          sritis: p.sritis,
        })
      }

      for (const v of vienetai) {
        // Mokinys gali paspausti bet kurį sunkumą, o ne tik numatytąjį — būtent
        // taip ir atsirasdavo keturženkliai skaičiai pirmokui.
        for (const lygis of [1, 2] as const) {
          const riba = v.sritis ?? sritisKlasei(k.klase)
          const rinkinys = generuokRinkini(v.generatorius, lygis, RINKINYJE, k.klase, v.sritis)

          if (riba) {
            const blogi = rinkinys.flatMap((u) => uzRibos(u, riba))
            if (blogi.length > 0) {
              klaidos.push(
                `${v.kur} (${v.generatorius}, sunkumas ${lygis}): skaičiai ${[
                  ...new Set(blogi),
                ]
                  .slice(0, 4)
                  .join(', ')} nepatenka į [${riba.min}, ${riba.max}]`,
              )
            }
          }

          const skirtingi = new Set(rinkinys.map((u) => sablonas(u.klausimas))).size
          const zinute = `${v.kur} (${v.generatorius}, sunkumas ${lygis}): tik ${skirtingi} skirtingi šablonai iš ${RINKINYJE}`
          if (skirtingi < IVAIROVE_KLAIDA) {
            skolaPasitaise.delete(v.generatorius)
            if (SKOLA.has(v.generatorius)) skola.push(zinute)
            else klaidos.push(zinute)
          } else if (skirtingi < IVAIROVE_PERSPEJIMAS) {
            perspejimai.push(zinute)
          }
        }
      }
    }
  }
}

/**
 * Visos temos rinkinys turi paliesti kiekvieną potemę.
 *
 * Temos antraštė anksčiau turėjo vieną bendrąjį generatorių, tad „visos temos“
 * lapas rodydavo tik vieno pavidalo uždavinius. Dabar jis sudaromas iš potemių
 * sąrašo, ir šis patikrinimas saugo, kad nė viena potemė iš lapo neiškristų —
 * nei pridėjus naują potemę, nei pakeitus kvotų dalybą.
 */
function patikrinkTemuRinkinius(): void {
  for (const k of programa) {
    for (const tema of k.temos) {
      const saltiniai = temosGeneratoriai(tema)
      if (saltiniai.length === 0) {
        klaidos.push(`${k.klase} kl. ${tema.numeris}. „${tema.pavadinimas}" neturi nė vieno generatoriaus`)
        continue
      }

      // Tikrinami abu sąsajoje siūlomi kiekiai: po vieną iš potemės ir po du.
      for (const kiekis of [saltiniai.length, saltiniai.length * 2]) {
        for (const lygis of [1, 2] as const) {
          const rinkinys = generuokTemosRinkini(saltiniai, lygis, kiekis, k.klase, tema.sritis)
          const kur = `${k.klase} kl. ${tema.numeris}. ${tema.pavadinimas} (visa tema, ${kiekis} uždaviniai, sunkumas ${lygis})`

          if (rinkinys.length !== kiekis) {
            klaidos.push(`${kur}: gauta ${rinkinys.length} uždavinių vietoj ${kiekis}`)
          }

          const padengta = new Set(rinkinys.map((u) => u.temaId))
          const truksta = saltiniai.filter((g) => !padengta.has(g))
          if (truksta.length > 0) {
            klaidos.push(`${kur}: nė vieno uždavinio iš potemių ${truksta.join(', ')}`)
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------

patikrinkGrafa()
patikrinkPrograma()
patikrinkTemuRinkinius()

const suvestine: string[] = []

for (const [vardas, generatorius] of Object.entries(generatoriai)) {
  for (const lygis of [1, 2] as const) {
    const uzdaviniai: Uzdavinys[] = []
    for (let i = 0; i < KIEK; i += 1) uzdaviniai.push(generatorius(lygis))
    for (const u of uzdaviniai) patikrinkUzdavini(u, vardas, lygis)

    // Šablonas, ne tiksli eilutė: „…prieš pat 2028?“ ir „…prieš pat 4385?“
    // yra tas pats uždavinys, o eilučių aibė jų neatskirdavo.
    const unikalus = new Set(uzdaviniai.map((u) => sablonas(u.klausimas))).size
    if (unikalus < 3) {
      perspejimai.push(
        `${vardas} (lygis ${lygis}): tik ${unikalus} skirtingi šablonai iš ${KIEK} uždavinių`,
      )
    }
    suvestine.push(
      `${vardas.padEnd(20)} lygis ${lygis}   ${String(unikalus).padStart(3)} šablonai`,
    )

    if (RODYTI_PAVYZDZIUS) {
      console.log(`\n── ${vardas}, lygis ${lygis} ──`)
      for (const u of uzdaviniai.slice(0, 6)) {
        console.log(`   ${u.klausimas}`)
        console.log(`   → ${u.atsakymas}   ${u.sprendimas ?? ''}`)
      }
    }
  }
}

console.log('\n=== Įvairovė (skirtingų šablonų) ===')
console.log(suvestine.join('\n'))

for (const g of skolaPasitaise) {
  klaidos.push(
    `Generatorius "${g}" jau praeina įvairovės ribą — išbrauk jį iš SKOLOS sąrašo`,
  )
}

if (skola.length > 0) {
  const generatoriai = [...new Set(skola.map((z) => z.match(/\(([a-z-]+),/)?.[1] ?? '?'))]
  console.log(`\n=== Įvairovės skola (${skola.length} rinkiniai, ${generatoriai.length} generatoriai) ===`)
  console.log(`Šie generatoriai turi 1–2 uždavinio pavidalus: ${generatoriai.join(', ')}.`)
  console.log('Kol jie tokie, dešimties uždavinių rinkinys kartoja tą patį klausimą.')
}

if (perspejimai.length > 0) {
  console.log(`\n=== Perspėjimai (${perspejimai.length}) ===`)
  console.log([...new Set(perspejimai)].slice(0, 20).join('\n'))
}

if (klaidos.length > 0) {
  console.log(`\n=== KLAIDOS (${klaidos.length}) ===`)
  console.log([...new Set(klaidos)].slice(0, 40).join('\n'))
  process.exit(1)
}

console.log(`\n✓ Visi generatoriai praėjo patikrą (po ${KIEK} uždavinių × 2 sunkumo lygiai).`)
