import { naujasId, normalizuok } from '../matematika'
import type { Uzdavinys } from './tipai'

const MAKS_BANDYMU = 50

type Juodrastis = {
  klausimas: string
  /** Neapdorotas atsakymas — normalizavimas atliekamas čia. */
  atsakymas: string
  atsakymasRodymui: string
  sprendimas?: string
  /** SVG brėžinys, jei uždavinys be jo neaiškus. */
  brezinys?: string
}

/**
 * Sudeda uždavinį iš juodraščio: prideda id ir normalizuoja atsakymą.
 * Generatoriai niekada nekonstruoja `Uzdavinys` patys.
 */
export function uzdavinys(temaId: string, j: Juodrastis): Uzdavinys {
  return {
    id: naujasId(temaId),
    temaId,
    klausimas: j.klausimas,
    atsakymas: normalizuok(j.atsakymas),
    atsakymasRodymui: j.atsakymasRodymui,
    sprendimas: j.sprendimas,
    brezinys: j.brezinys,
  }
}

/**
 * Viena atsitiktinė variacija iš sąrašo.
 *
 * Vien keisti skaičius neužtenka: dešimt uždavinių pavidalu `a + b` atrodo
 * kaip vienas uždavinys, perrašytas dešimt kartų. Todėl kiekvienas lygis turi
 * po kelias skirtingo pavidalo variacijas — trūkstamą dėmenį, tekstinį
 * uždavinį, kelis veiksmus — o skaičiai keičiami jau jų viduje.
 */
export function variacija(
  variantai: readonly (() => Uzdavinys | null)[],
): Uzdavinys | null {
  return variantai[Math.floor(Math.random() * variantai.length)]()
}

/**
 * Bando kurti uždavinį, kol pavyksta. `kurk` grąžina `null`, jei rezultatas
 * bjaurus — tada bandoma iš naujo. Po 50 bandymų grąžinamas atsarginis
 * uždavinys iš fiksuoto sąrašo (7.1).
 */
export function suBandymais(
  kurk: () => Uzdavinys | null,
  atsarginiai: readonly Juodrastis[],
  temaId: string,
): Uzdavinys {
  for (let i = 0; i < MAKS_BANDYMU; i += 1) {
    const u = kurk()
    if (u) return u
  }
  const atsarginis = atsarginiai[Math.floor(Math.random() * atsarginiai.length)]
  return uzdavinys(temaId, atsarginis)
}
