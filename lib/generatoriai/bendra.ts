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
 * Kurį pavidalą imti kitą kartą. `null` — rinktis atsitiktinai.
 *
 * Vieno uždavinio generavimui pakanka atsitiktinumo, bet rinkiniui — ne:
 * renkant su grąžinimu iš septynių pavidalų dešimt kartų, vienas pavidalas
 * vidutiniškai pasikartoja keturis kartus, ir rinkinys atrodo monotoniškas.
 * Todėl `generuokRinkini` įjungia eiliškumą, o `variacija` jį suka.
 */
let siulomasPavidalas: number | null = null

/** Įjungia arba išjungia pavidalų eiliškumą. Kviečia tik `generuokRinkini`. */
export function pavidaluEile(nuo: number | null): void {
  siulomasPavidalas = nuo
}

/**
 * Viena variacija iš sąrašo.
 *
 * Vien keisti skaičius neužtenka: dešimt uždavinių pavidalu `a + b` atrodo
 * kaip vienas uždavinys, perrašytas dešimt kartų. Todėl kiekvienas lygis turi
 * po kelias skirtingo pavidalo variacijas — trūkstamą dėmenį, tekstinį
 * uždavinį, kelis veiksmus — o skaičiai keičiami jau jų viduje.
 *
 * Kai eiliškumas įjungtas, pavidalai imami paeiliui ir skaitliukas sukamas
 * net tada, kai variantas grąžina `null`. Taip nepavykęs pavidalas nestabdo
 * eilės, o rinkinys padengia visus pavidalus, kol jų neišsemia.
 */
export function variacija(
  variantai: readonly (() => Uzdavinys | null)[],
): Uzdavinys | null {
  if (siulomasPavidalas === null) {
    return variantai[Math.floor(Math.random() * variantai.length)]()
  }
  const i = siulomasPavidalas % variantai.length
  siulomasPavidalas += 1
  return variantai[i]()
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

/**
 * Skaičius sprendimo tekstui: neigiamas rašomas skliaustuose, kad neatsirastų
 * poros tipo „5 - -3“, kurios mokykloje niekada nerašomos.
 */
export function sk(n: number): string {
  return n < 0 ? `(${n})` : String(n)
}

/**
 * Uždavinio šablonas — klausimas be konkrečių reikšmių.
 *
 * Du uždaviniai, kurių šablonai sutampa, mokiniui yra tas pats uždavinys,
 * nors eilutės ir skiriasi: „Koks skaičius eina prieš pat 2028?“ ir
 * „…4385?“ abu virsta „koks skaičius eina prieš pat #?“. Tikslus eilučių
 * lyginimas to nemato, todėl `generuokRinkini` ir auditas remiasi šituo.
 */
export function sablonas(klausimas: string): string {
  return (
    klausimas
      .toLowerCase()
      .replace(/\{,\}/g, ',')
      // Komandos paliekamos vardu, o ne nurašomos: be `cdot` reiškiniai
      // `# + # cdot #` ir `( # + # ) cdot #` atrodytų vienodi.
      .replace(/\\([a-zA-Z]+)/g, ' $1 ')
      // Minusas nelaikomas skaičiaus dalimi — jis yra struktūra.
      .replace(/\d+(?:[.,]\d+)?/g, '#')
      .replace(/[^a-ząčęėįšųūž#+\-:()=<>]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )
}
