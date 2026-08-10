import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, normalizuok, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys } from './formatai'
import { DAIKTU_ZODYNAS, daiktuEile, scena, suEtiketemis, zodis, type Daiktas } from './ikonos'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * 1 klasė, 1 tema „Žingsnis į pirmąją klasę“.
 *
 * Perrašyta pagal uždavinių sąlygų banką. Iš jo paimtos ne tik sąlygos, bet ir
 * kalbos taisyklės:
 *
 * - žodis „atžvilgiu“ mokinio tekste nevartojamas;
 * - sakinys trumpas ir tiesioginis, be „kuris turėtų būti“ ar „jei rikiuojame“;
 * - pirmenybė „Kiek…?“, „Kur…?“, „Kas…?“, „Pasirink…“, „Įrašyk…“, „Sudėk…“;
 * - paveikslo aprašymas skirtas generatoriui, mokiniui rodomas tik piešinys.
 *
 * Anksčiau keturios šios temos potemės (skaičių rašymas 0–4 ir 5–9, „Lygu ar
 * nelygu?“, „Daugiau ar mažiau?“) dalijosi vienu `skaiciu-palyginimas`
 * generatoriumi, tad nė viena negaudavo savo turinio. Dabar kiekviena turi savo.
 */

// ── 1.1 Kur yra daiktas? ────────────────────────────────────────────────────

const A_VIETA = [
  {
    klausimas: 'Kur yra kamuolys?',
    atsakymas: 'b',
    atsakymasRodymui: 'B — po stalu',
    sprendimas: 'Kamuolys nupieštas žemiau stalo, tad jis yra po stalu.',
  },
] as const

export const vieta: Generatorius = (lygis) => suBandymais(() => kurkVieta(lygis), A_VIETA, 'vieta')

/** Smulkūs daiktai, kuriuos galima padėti į sceną. */
const SMULKUS: Daiktas[] = ['kamuolys', 'obuolys', 'knyga', 'piestukas', 'gele', 'kate']

/**
 * Erdvinis santykis: kur daiktas padedamas ir kaip tai vadinama.
 *
 * Anksčiau buvo tik keturios padėtys ir dažniausiai išeidavo „per vidurį".
 * Bankas ir vadovėlis reikalauja viso rinkinio: dešinėje, kairėje, virš, po,
 * prieš, už, tarp, šalia, viduje, išorėje.
 */
type Santykis = {
  vardas: string
  /** Daikto vieta atramos daikto (x=90, y=52, dydis=68) atžvilgiu. */
  x: number
  y: number
}

/**
 * Erdvinės padėtys. Kiekvienam uždaviniui imamos trys — teisinga ir dvi kitos,
 * tad atspėti pusę kartų nebeišeina.
 */
const SANTYKIAI: readonly Santykis[] = [
  { vardas: 'dešinėje', x: 176, y: 62 },
  { vardas: 'kairėje', x: 22, y: 62 },
  { vardas: 'virš', x: 100, y: 6 },
  { vardas: 'po', x: 100, y: 118 },
  { vardas: 'šalia', x: 166, y: 66 },
]

function kurkVieta(lygis: Lygis): Uzdavinys | null {
  return variacija([
    // 1. Kryptis atramos daikto atžvilgiu — visas santykių rinkinys
    () => {
      const atrama = pasirink<Daiktas>(['stalasBaldas', 'suoliukasBaldas', 'namas', 'medis'])
      const za = zodis(atrama)
      const d = pasirink(SMULKUS)
      const z = zodis(d)
      const trysSantykiai = sumaisyk([...SANTYKIAI]).slice(0, 3)
      const santykis = trysSantykiai[0]
      // Lietuvių kalboje vieta rašoma skirtinga tvarka: „medžio dešinėje“,
      // bet „virš medžio“ ir „po medžiu“. „Dešinėje medžio“ būtų klaida.
      const kaip = (v: string) => {
        if (v === 'po') return `po ${za.i}`
        if (v === 'toli') return `toli nuo ${za.k}`
        if (v === 'dešinėje' || v === 'kairėje') return `${za.k} ${v}`
        return `${v} ${za.k}`
      }

      return pasirinkimoUzdavinys(naujasId('vieta'), 'vieta', {
        klausimas: `Kur yra ${z.v}?`,
        variantai: trysSantykiai.map((r) => kaip(r.vardas)),
        teisingas: 0,
        sprendimas: `${z.v[0].toUpperCase()}${z.v.slice(1)} nupieštas ${kaip(santykis.vardas)}.`,
        brezinys: scena(
          [
            { daiktas: atrama, x: 90, y: 52, dydis: 68 },
            { daiktas: d, x: santykis.x, y: santykis.y, dydis: 36, akcentas: true },
          ],
          252,
          166,
        ),
      })
    },

    // 2. Kas yra tarp dviejų daiktų
    () => {
      const trys = sumaisyk(DAIKTU_ZODYNAS.filter((z) => SMULKUS.includes(z.daiktas))).slice(0, 3)
      if (trys.length < 3) return null
      return uzdavinys('vieta', {
        klausimas: `Kas yra tarp ${trys[0].k} ir ${trys[2].k}?`,
        atsakymas: trys[1].v,
        atsakymasRodymui: trys[1].v,
        sprendimas: `Viduryje nupiešta ${trys[1].v}.`,
        brezinys: suEtiketemis(
          trys.map((z, i) => ({ daiktas: z.daiktas, x: 18 + i * 84, y: 18, dydis: 44 })),
          258,
          104,
        ),
      })
    },

    // 3. Viduje ar išorėje
    () => {
      const d = pasirink(SMULKUS.filter((x) => x !== 'knyga'))
      const z = zodis(d)
      // Trys padėtys: viduje, šalia ir ant dėžės — visos atskiriamos iš piešinio.
      const kur = atsitiktinis(0, 2)
      const vietos = [
        { x: 56, y: 74, zodis: 'dėžės viduje', kaip: 'dėžės viduje' },
        { x: 150, y: 78, zodis: 'dėžės išorėje', kaip: 'šalia dėžės, jos išorėje' },
        // Dėžės kraštas nupieštas ties y ≈ 71, tad daiktas dedamas tiesiai ant jo.
        { x: 54, y: 38, zodis: 'ant dėžės', kaip: 'ant dėžės krašto' },
      ]
      return pasirinkimoUzdavinys(naujasId('vieta'), 'vieta', {
        klausimas: `Kur yra ${z.v}?`,
        variantai: vietos.map((v) => v.zodis),
        teisingas: kur,
        sprendimas: `${z.v[0].toUpperCase()}${z.v.slice(1)} nupieštas ${vietos[kur].kaip}.`,
        brezinys: scena(
          [
            { daiktas: 'dezeAtvira', x: 26, y: 44, dydis: 92 },
            { daiktas: d, x: vietos[kur].x, y: vietos[kur].y, dydis: 34 },
          ],
          228,
          150,
        ),
      })
    },

    // 4. Prieš ar už — gylio santykis, sunkesnis nei kairė ir dešinė
    () => {
      if (lygis === 1) return null
      const atrama = pasirink<Daiktas>(['suoliukasBaldas', 'namas', 'medis'])
      const za = zodis(atrama)
      const d = pasirink<Daiktas>(['dviratis', 'gele', 'kamuolys'])
      const z = zodis(d)
      const kur = atsitiktinis(0, 2)
      const vietos = [
        { x: 28, y: 84, dydis: 46, zodis: `prieš ${za.g}`, kaip: 'priekyje, arčiau žiūrovo' },
        { x: 172, y: 16, dydis: 38, zodis: `už ${za.k}`, kaip: `toliau, už ${za.k}` },
        { x: 176, y: 74, dydis: 44, zodis: `šalia ${za.k}`, kaip: `greta, šalia ${za.k}` },
      ]
      return pasirinkimoUzdavinys(naujasId('vieta'), 'vieta', {
        klausimas: `Kur yra ${z.v}?`,
        variantai: vietos.map((v) => v.zodis),
        teisingas: kur,
        sprendimas: `${z.v[0].toUpperCase()}${z.v.slice(1)} nupieštas ${vietos[kur].kaip}.`,
        brezinys: scena(
          [
            { daiktas: atrama, x: 92, y: 52, dydis: 68 },
            { daiktas: d, x: vietos[kur].x, y: vietos[kur].y, dydis: vietos[kur].dydis },
          ],
          250,
          150,
        ),
      })
    },
  ])
}

// ── 1.2 Kaip surikiuoti daiktai? ────────────────────────────────────────────

const A_RIKIAVIMAS = [
  {
    klausimas: 'Kas stovi trečias iš kairės?',
    atsakymas: 'obuolys',
    atsakymasRodymui: 'obuolys',
    sprendimas: 'Skaičiuojame iš kairės: pirmas, antras, trečias.',
  },
] as const

export const daiktuRikiavimas: Generatorius = (lygis) =>
  suBandymais(() => kurkRikiavima(lygis), A_RIKIAVIMAS, 'daiktu-rikiavimas')

const KELINTAS = ['pirmas', 'antras', 'trečias', 'ketvirtas', 'penktas'] as const

function kurkRikiavima(lygis: Lygis): Uzdavinys | null {
  return variacija([
    // 1. Surikiuoti nuo mažiausio iki didžiausio
    () => {
      const d = pasirink<Daiktas>(['kamuolys', 'obuolys', 'zvaigzde'])
      const z = zodis(d)
      const kiek = lygis === 1 ? 4 : 5
      const dydziai = sumaisyk([22, 30, 38, 46, 54].slice(0, kiek))
      const raides = ['A', 'B', 'C', 'D', 'E']

      // Raidės jau yra brėžinyje, tad `eiliskumoUzdavinys` čia netinka: jis
      // elementus dar kartą sumaišytų ir priskirtų naujas raides, o atsakymas
      // nebeatitiktų piešinio. Todėl uždavinys sudedamas tiesiogiai.
      const teisinga = [...dydziai]
        .sort((x, y) => x - y)
        .map((dy) => raides[dydziai.indexOf(dy)])
        .join(' ')

      return {
        id: naujasId('daiktu-rikiavimas'),
        temaId: 'daiktu-rikiavimas',
        klausimas: `Sudėk ${z.dgsG} nuo mažiausio iki didžiausio. Įrašyk raides iš eilės.`,
        atsakymas: normalizuok(teisinga),
        atsakymasRodymui: teisinga,
        sprendimas: 'Mažiausias yra žemiausias piešinys, didžiausias — aukščiausias.',
        formatas: 'eiliskumas' as const,
        elementai: dydziai.map((_, i) => raides[i]),
        brezinys: suEtiketemis(
          dydziai.map((dy, i) => ({
            daiktas: d,
            x: 16 + i * 62,
            y: 62 - dy,
            dydis: dy,
            etikete: raides[i],
          })),
          16 + kiek * 62,
          96,
        ),
      }
    },

    // 2. Kelintas iš kairės
    () => {
      const kiek = lygis === 1 ? 4 : 5
      const daiktai = sumaisyk(DAIKTU_ZODYNAS.filter((z) => SMULKUS.includes(z.daiktas))).slice(
        0,
        kiek,
      )
      if (daiktai.length < kiek) return null
      const vieta = atsitiktinis(1, kiek)
      const brezinys = suEtiketemis(
        daiktai.map((z, i) => ({ daiktas: z.daiktas, x: 14 + i * 60, y: 14, dydis: 42 })),
        14 + kiek * 60,
        76,
      )
      return uzdavinys('daiktu-rikiavimas', {
        klausimas: `Kas stovi ${KELINTAS[vieta - 1]} iš kairės?`,
        atsakymas: daiktai[vieta - 1].v,
        atsakymasRodymui: daiktai[vieta - 1].v,
        sprendimas: `Skaičiuojame iš kairės: ${daiktai
          .slice(0, vieta)
          .map((z, i) => `${KELINTAS[i]} — ${z.v}`)
          .join(', ')}.`,
        brezinys,
      })
    },

    // 3. Kuris per vidurį
    () => {
      const d = pasirink<Daiktas>(['knyga', 'kubelis', 'deze'])
      const z = zodis(d)
      const dydziai = sumaisyk([26, 38, 50])
      const brezinys = scena(
        dydziai.map((dy, i) => ({ daiktas: d, x: 20 + i * 66, y: 58 - dy / 2, dydis: dy })),
        218,
        84,
      )
      const vidurinis = [...dydziai].sort((a, b) => a - b)[1]
      return uzdavinys('daiktu-rikiavimas', {
        klausimas: `Kelinta ${z.v} iš kairės yra vidutinio dydžio?`,
        atsakymas: String(dydziai.indexOf(vidurinis) + 1),
        atsakymasRodymui: `$${dydziai.indexOf(vidurinis) + 1}$`,
        sprendimas: `Nei didžiausia, nei mažiausia — ji stovi ${KELINTAS[dydziai.indexOf(vidurinis)]} iš kairės.`,
        brezinys,
      })
    },

    // 4. Kuris didžiausias
    () => {
      const d = pasirink<Daiktas>(['kamuolys', 'zvaigzde', 'gele'])
      const z = zodis(d)
      const dydziai = sumaisyk([24, 34, 44, 54])
      const didziausias = Math.max(...dydziai)
      const brezinys = scena(
        dydziai.map((dy, i) => ({ daiktas: d, x: 16 + i * 62, y: 62 - dy / 2, dydis: dy })),
        260,
        88,
      )
      return uzdavinys('daiktu-rikiavimas', {
        klausimas: `Kelinta ${z.v} iš kairės yra didžiausia?`,
        atsakymas: String(dydziai.indexOf(didziausias) + 1),
        atsakymasRodymui: `$${dydziai.indexOf(didziausias) + 1}$`,
        sprendimas: `Didžiausia stovi ${KELINTAS[dydziai.indexOf(didziausias)]} iš kairės.`,
        brezinys,
      })
    },
  ])
}

// ── 1.4 ir 1.5 Kaip rašyti skaičius? ────────────────────────────────────────

const A_RASYMAS = [
  {
    klausimas: 'Kiek obuolių?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Suskaičiavus obuolius gaunami 4.',
  },
] as const

/**
 * Skaičių rašymas. `lygis` čia reiškia sritį: 1 — skaičiai iki 4, 2 — iki 9.
 * Taip viena funkcija aptarnauja abi banko potemes.
 */
export const skaiciuRasymas: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkRasyma(lygis, sritis?.max ?? 9), A_RASYMAS, 'skaiciu-rasymas')

function kurkRasyma(lygis: Lygis, virsus: number): Uzdavinys | null {
  const maks = Math.min(virsus, lygis === 1 ? 4 : 9)
  if (maks < 2) return null
  const d = pasirink<Daiktas>(['obuolys', 'balionas', 'zvaigzde', 'piestukas', 'kamuolys', 'gele'])
  const z = zodis(d)

  return variacija([
    // 1. Suskaičiuok ir parašyk
    () => {
      const n = atsitiktinis(1, maks)
      return uzdavinys('skaiciu-rasymas', {
        klausimas: `Kiek ${z.dgsK}? Parašyk skaičių.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Suskaičiavus gaunama ${n}.`,
        brezinys: daiktuEile([{ daiktas: d, kiek: n }], 38),
      })
    },

    // 2. Suskaičiuok ir pasirink
    () => {
      const n = atsitiktinis(2, maks)
      const netiesos = [n - 1, n + 1, n + 2].filter((x) => x > 0 && x !== n).slice(0, 2)
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('skaiciu-rasymas'), 'skaiciu-rasymas', {
        klausimas: `Kiek ${z.dgsK}?`,
        variantai: [String(n), ...netiesos.map(String)],
        teisingas: 0,
        sprendimas: `Suskaičiavus gaunama ${n}.`,
        brezinys: daiktuEile([{ daiktas: d, kiek: n }], 38),
      })
    },

    // 3. Nulis — tuščia dėžė
    () => {
      if (lygis !== 1) return null
      return uzdavinys('skaiciu-rasymas', {
        klausimas: `Kiek ${z.dgsK} dėžėje? Parašyk skaičių.`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Dėžė tuščia, tad daiktų yra 0.',
        brezinys: scena([{ daiktas: 'deze', x: 40, y: 20, dydis: 76 }], 156, 116),
      })
    },

    // 4. Kuriame paveikslėlyje tiek, kiek parašyta
    () => {
      const n = atsitiktinis(2, Math.max(2, maks - 1))
      const kiti = [n - 1, n + 1, n + 2].filter((x) => x > 0 && x !== n).slice(0, 2)
      if (kiti.length < 2) return null
      const trys = sumaisyk([
        { kiek: n, teisingas: true },
        ...kiti.map((k) => ({ kiek: k, teisingas: false })),
      ])
      return pasirinkimoUzdavinys(naujasId('skaiciu-rasymas'), 'skaiciu-rasymas', {
        klausimas: `Kurioje grupėje yra ${n} ${derink(n, { vns: z.v, dgs: z.dgs, kilm: z.dgsK })}?`,
        variantai: ['pirmoje', 'antroje', 'trečioje'],
        teisingas: trys.findIndex((a) => a.teisingas),
        sprendimas: `Reikia grupės, kurioje daiktų yra ${n}.`,
        brezinys: daiktuEile(
          trys.map((a) => ({ daiktas: d, kiek: a.kiek })),
          30,
        ),
      })
    },
  ])
}

// ── 1.6 Lygu ar nelygu? ─────────────────────────────────────────────────────

const A_LYGU = [
  {
    klausimas: 'Ar daiktų yra po lygiai?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — taip',
    sprendimas: 'Abiejose grupėse po 4 daiktus, tad po lygiai.',
  },
] as const

export const lyguNelygu: Generatorius = (lygis) =>
  suBandymais(() => kurkLygu(lygis), A_LYGU, 'lygu-nelygu')

function kurkLygu(lygis: Lygis): Uzdavinys | null {
  const [a, b] = [
    pasirink<Daiktas>(['obuolys', 'zvaigzde', 'kamuolys']),
    pasirink<Daiktas>(['kriause', 'sausainis', 'gele']),
  ]

  return variacija([
    // 1. Ar po lygiai
    () => {
      const n = atsitiktinis(2, 6)
      const lygu = atsitiktinis(0, 1) === 1
      const m = lygu ? n : atsitiktinis(2, 6)
      if (!lygu && m === n) return null
      // Trys atsakymai vietoj „taip/ne": vaikas turi ne tik pastebėti skirtumą,
      // bet ir pasakyti, kurioje grupėje daugiau.
      return pasirinkimoUzdavinys(naujasId('lygu-nelygu'), 'lygu-nelygu', {
        klausimas: 'Ar daiktų yra po lygiai?',
        variantai: ['taip, po lygiai', 'ne, pirmoje daugiau', 'ne, antroje daugiau'],
        teisingas: lygu ? 0 : n > m ? 1 : 2,
        sprendimas: lygu
          ? `Abiejose grupėse po ${n}, tad po lygiai.`
          : `Pirmoje ${n}, antroje ${m}.`,
        brezinys: daiktuEile(
          [
            { daiktas: a, kiek: n },
            { daiktas: b, kiek: m },
          ],
          34,
        ),
      })
    },

    // 2. Ženklas = arba ≠
    () => {
      const x = atsitiktinis(1, 9)
      const lygu = atsitiktinis(0, 1) === 1
      const y = lygu ? x : atsitiktinis(1, 9)
      if (!lygu && y === x) return null
      // Trys ženklai: „=" ir „≠" duotų spėjimą pusę kartų, o „<" ir „>"
      // atsakymą padaro vienareikšmį ir tada, kai skaičiai skiriasi.
      return pasirinkimoUzdavinys(naujasId('lygu-nelygu'), 'lygu-nelygu', {
        klausimas: `Įrašyk tinkamą ženklą: $${x} \\;\\square\\; ${y}$`,
        variantai: ['=', '<', '>'],
        teisingas: lygu ? 0 : x < y ? 1 : 2,
        sprendimas: lygu
          ? `${x} ir ${y} yra tas pats skaičius, tad lygu.`
          : `${x} yra ${x < y ? 'mažesnis' : 'didesnis'} už ${y}.`,
      })
    },

    // 3. Lygu ar nelygu iš paveikslėlio
    () => {
      const n = atsitiktinis(2, 6)
      const m = atsitiktinis(2, 6)
      if (n === m) return null
      return pasirinkimoUzdavinys(naujasId('lygu-nelygu'), 'lygu-nelygu', {
        klausimas: 'Pasirink tinkamą žodį.',
        variantai: ['lygu', 'nelygu, pirmoje daugiau', 'nelygu, antroje daugiau'],
        teisingas: n > m ? 1 : 2,
        sprendimas: `Pirmoje ${n}, antroje ${m}.`,
        brezinys: daiktuEile(
          [
            { daiktas: a, kiek: n },
            { daiktas: a, kiek: m },
          ],
          34,
        ),
      })
    },

    // 4. Kiek reikia pridėti, kad būtų po lygiai
    () => {
      if (lygis === 1) return null
      const n = atsitiktinis(3, 7)
      const m = atsitiktinis(1, n - 1)
      return uzdavinys('lygu-nelygu', {
        klausimas: 'Kiek daiktų reikia pridėti į antrą grupę, kad būtų po lygiai?',
        atsakymas: String(n - m),
        atsakymasRodymui: `$${n - m}$`,
        sprendimas: `Pirmoje grupėje ${n}, antroje ${m}: $${n} - ${m} = ${n - m}$.`,
        brezinys: daiktuEile(
          [
            { daiktas: a, kiek: n },
            { daiktas: a, kiek: m, akcentas: true },
          ],
          34,
        ),
      })
    },
  ])
}

// ── 1.7 Daugiau ar mažiau? ──────────────────────────────────────────────────

const A_DAUGIAU = [
  {
    klausimas: 'Pasirink didesnį skaičių.',
    atsakymas: 'b',
    atsakymasRodymui: 'B — 8',
    sprendimas: '8 yra didesnis už 5.',
  },
] as const

export const daugiauMaziau: Generatorius = (lygis) =>
  suBandymais(() => kurkDaugiau(lygis), A_DAUGIAU, 'daugiau-maziau')

function kurkDaugiau(lygis: Lygis): Uzdavinys | null {
  return variacija([
    // 1. Kurioje grupėje daugiau
    () => {
      const d = pasirink<Daiktas>(['zvaigzde', 'obuolys', 'kamuolys'])
      const z = zodis(d)
      const n = atsitiktinis(2, 7)
      const m = atsitiktinis(2, 7)
      if (n === m) return null
      return pasirinkimoUzdavinys(naujasId('daugiau-maziau'), 'daugiau-maziau', {
        klausimas: `Kurioje grupėje ${z.dgsK} daugiau?`,
        variantai: ['pirmoje', 'antroje', 'abiejose po lygiai'],
        teisingas: n > m ? 0 : 1,
        sprendimas: `Pirmoje ${n}, antroje ${m}.`,
        brezinys: daiktuEile(
          [
            { daiktas: d, kiek: n },
            { daiktas: d, kiek: m },
          ],
          34,
        ),
      })
    },

    // 2. Ženklas < arba >
    () => {
      const x = atsitiktinis(1, 9)
      const y = atsitiktinis(1, 9)
      if (x === y) return null
      return pasirinkimoUzdavinys(naujasId('daugiau-maziau'), 'daugiau-maziau', {
        klausimas: `Įrašyk tinkamą ženklą: $${x} \\;\\square\\; ${y}$`,
        variantai: ['<', '>', '='],
        teisingas: x < y ? 0 : 1,
        sprendimas: `${x} yra ${x < y ? 'mažesnis' : 'didesnis'} už ${y}.`,
      })
    },

    // 3. Ko mažiau
    () => {
      const a = pasirink<Daiktas>(['kriause', 'obuolys'])
      const b = pasirink<Daiktas>(['sausainis', 'gele', 'zvaigzde'])
      const za = zodis(a)
      const zb = zodis(b)
      const n = atsitiktinis(2, 7)
      const m = atsitiktinis(2, 7)
      if (n === m) return null
      return pasirinkimoUzdavinys(naujasId('daugiau-maziau'), 'daugiau-maziau', {
        klausimas: 'Ko mažiau?',
        variantai: [za.dgsK, zb.dgsK, 'po lygiai'],
        teisingas: n < m ? 0 : 1,
        sprendimas: `${za.dgs[0].toUpperCase()}${za.dgs.slice(1)} — ${n}, ${zb.dgs} — ${m}.`,
        brezinys: daiktuEile(
          [
            { daiktas: a, kiek: n },
            { daiktas: b, kiek: m },
          ],
          34,
        ),
      })
    },

    // 4. Pasirink didesnį skaičių
    () => {
      if (lygis === 1) return null
      const trys = sumaisyk([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3)
      const maks = Math.max(...trys)
      return pasirinkimoUzdavinys(naujasId('daugiau-maziau'), 'daugiau-maziau', {
        klausimas: 'Pasirink didžiausią skaičių.',
        variantai: trys.map(String),
        teisingas: trys.indexOf(maks),
        sprendimas: `Iš ${trys.join(', ')} didžiausias yra ${maks}.`,
      })
    },
  ])
}
