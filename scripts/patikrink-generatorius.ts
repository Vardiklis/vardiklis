/**
 * Generatorių auditas — Fazės 3 priėmimo kriterijus.
 *
 * Sugeneruoja po N uždavinių iš kiekvieno generatoriaus kiekvienam lygiui ir
 * tikrina, ar nėra bjaurių atsakymų, sugedusio KaTeX ar nesuderinamumų grafe.
 *
 * Paleidimas:  npm run patikra
 */

import katex from 'katex'
import { generatoriai } from '../lib/generatoriai/index'
import type { Lygis, Uzdavinys } from '../lib/generatoriai/tipai'
import { normalizuok } from '../lib/matematika'
import { temos } from '../lib/temos'

const KIEK = Number(process.argv[2] ?? 100)
const RODYTI_PAVYZDZIUS = process.argv.includes('--pavyzdziai')

const klaidos: string[] = []
const perspejimai: string[] = []

// ---------------------------------------------------------------------------
// Grafo vientisumas
// ---------------------------------------------------------------------------

function patikrinkGrafa(): void {
  const id = new Set(temos.map((t) => t.id))

  for (const t of temos) {
    if (!(t.generatorius in generatoriai)) {
      klaidos.push(`Tema "${t.id}" nurodo neegzistuojantį generatorių "${t.generatorius}"`)
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

  const nenaudojami = Object.keys(generatoriai).filter(
    (g) => !temos.some((t) => t.generatorius === g),
  )
  if (nenaudojami.length > 0) {
    perspejimai.push(`Generatoriai be temos: ${nenaudojami.join(', ')}`)
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

  for (const [laukas, reiksme] of [
    ['klausimas', u.klausimas],
    ['atsakymasRodymui', u.atsakymasRodymui],
    ['sprendimas', u.sprendimas ?? ''],
  ] as const) {
    if (/undefined|NaN|Infinity/.test(reiksme)) {
      klaidos.push(`${kur}: ${laukas} turi šiukšlių — "${reiksme}"`)
    }
    // „- -", „+ -" be skliaustų skaitosi kaip klaida rinkinyje.
    if (/[+\-]\s+-\d/.test(reiksme)) {
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
    if (skaicius.vd > 20) {
      klaidos.push(`${kur}: bjaurus vardiklis ${skaicius.vd} atsakyme "${u.atsakymas}"`)
    }
    if (Math.abs(skaicius.sk) > 5000) {
      klaidos.push(`${kur}: per didelis skaičius atsakyme "${u.atsakymas}"`)
    }
  } else {
    perspejimai.push(`${kur}: atsakymas nėra skaičius — "${u.atsakymas}"`)
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

patikrinkGrafa()

const suvestine: string[] = []

for (const [vardas, generatorius] of Object.entries(generatoriai)) {
  for (const lygis of [1, 2, 3] as const) {
    const uzdaviniai: Uzdavinys[] = []
    for (let i = 0; i < KIEK; i += 1) uzdaviniai.push(generatorius(lygis))
    for (const u of uzdaviniai) patikrinkUzdavini(u, vardas, lygis)

    const unikalus = new Set(uzdaviniai.map((u) => u.klausimas)).size
    const dalis = Math.round((unikalus / KIEK) * 100)
    if (dalis < 25) {
      perspejimai.push(
        `${vardas} (lygis ${lygis}): tik ${unikalus} skirtingi klausimai iš ${KIEK}`,
      )
    }
    suvestine.push(
      `${vardas.padEnd(20)} lygis ${lygis}   ${String(unikalus).padStart(3)}/${KIEK} skirtingų (${dalis} %)`,
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

console.log('\n=== Įvairovė ===')
console.log(suvestine.join('\n'))

if (perspejimai.length > 0) {
  console.log(`\n=== Perspėjimai (${perspejimai.length}) ===`)
  console.log([...new Set(perspejimai)].slice(0, 20).join('\n'))
}

if (klaidos.length > 0) {
  console.log(`\n=== KLAIDOS (${klaidos.length}) ===`)
  console.log([...new Set(klaidos)].slice(0, 40).join('\n'))
  process.exit(1)
}

console.log(`\n✓ Visi generatoriai praėjo patikrą (po ${KIEK} uždavinių × 3 lygiai).`)
