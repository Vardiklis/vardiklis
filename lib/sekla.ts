/**
 * Sėklinis atsitiktinumas.
 *
 * Iki šiol viskas rėmėsi `Math.random()`, tad tas pats rinkinys niekada
 * nepasikartodavo. Svetainėje to ir reikia, bet PDF bibliotekai — ne: nuoroda
 * į „variantą Nr. 7" turi visada duoti tą patį lapą, kitaip nei mokytojas,
 * nei mokinys negali prie jo grįžti.
 *
 * Sprendimas — vienas perjungiamas srautas. `matematika.ts` funkcijos kviečia
 * `atsitiktinumas()`, o ne `Math.random` tiesiogiai; pagal nutylėjimą tai ir
 * yra `Math.random`, bet `suSekla` laikinai pakeičia jį deterministiniu.
 *
 * Sąmoningai nenaudojama jokia biblioteka: mulberry32 telpa į penkias eilutes,
 * o kriptografinės kokybės čia nereikia — reikia atkartojamumo.
 */

type Srautas = () => number

/** Numatytasis srautas — tikras atsitiktinumas svetainėje. */
const NUMATYTASIS: Srautas = Math.random

let dabartinis: Srautas = NUMATYTASIS

/** Vienas atsitiktinis skaičius [0, 1). Visi generatoriai eina per čia. */
export function atsitiktinumas(): number {
  return dabartinis()
}

/** Ar šiuo metu sukamas deterministinis srautas. */
export function arSeklinis(): boolean {
  return dabartinis !== NUMATYTASIS
}

/** Eilutę paverčia 32 bitų sėkla — kad sėkla galėtų būti ir žodis. */
export function seklaIsTeksto(tekstas: string): number {
  let h = 2166136261
  for (let i = 0; i < tekstas.length; i += 1) {
    h ^= tekstas.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** mulberry32 — mažas, greitas ir pakankamai tolygus generatorius. */
function mulberry32(sekla: number): Srautas {
  let a = sekla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Įvykdo `veiksmas` su deterministiniu srautu ir grąžina jo rezultatą.
 *
 * Srautas atstatomas net tada, kai `veiksmas` meta klaidą — antraip viena
 * nepavykusi generacija paliktų visą svetainę sėkliniame režime ir kiekvienas
 * mokinys matytų tuos pačius uždavinius.
 */
export function suSekla<T>(sekla: number | string, veiksmas: () => T): T {
  const buves = dabartinis
  dabartinis = mulberry32(typeof sekla === 'string' ? seklaIsTeksto(sekla) : sekla >>> 0)
  try {
    return veiksmas()
  } finally {
    dabartinis = buves
  }
}
