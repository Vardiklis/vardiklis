import {
  funkcijos,
  greitosiosFormules,
  lygciuSistemos,
  nelygybes,
  raidiniaiReiskiniai,
  saknys,
} from './algebra'
import {
  algoritmai,
  diagramos,
  erdvinesFiguros,
  figuros,
  konstravimas,
  koordinates,
  lauzes,
  ornamentai,
  simetrija,
  vektoriai,
} from './braizymas'
import { dalumas } from './dalumas'
import {
  apskritimas,
  kampai,
  perimetras,
  pitagoras,
  plotasTuris,
  trigonometrija,
} from './geometrija'
import { kvadratinesLygtys, tiesinesLygtys } from './lygtys'
import { laipsniai } from './laipsniai'
import { neigiami } from './neigiami'
import {
  dalumoPozymiai,
  logika,
  misiniai,
  rekurenciosSekos,
  saknuIvertinimas,
  skaitmenys,
  sklaida,
  vijeto,
} from './papildomi'
import {
  apvalinimas,
  dalisIrVisuma,
  desimtaines,
  laikas,
  matavimoVienetai,
  pinigai,
  sekos,
  skaiciuPalyginimas,
  sudetisAtimtis,
  veiksmuTvarka,
} from './pradinukams'
import { procentai } from './procentai'
import { proporcijos } from './proporcijos'
import { sveikieji } from './sveikieji'
import {
  atvirkstinis,
  greitis,
  kombinatorika,
  palukanos,
  tikimybe,
  vidurkis,
} from './taikomieji'
import { bendravardiklinimas, trupmenuDaugyba, trupmenuSudetis } from './trupmenos'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

export type { Generatorius, Lygis, Uzdavinys }

/**
 * Generatorių registras. Raktas naudojamas `lib/temos.ts` (diagnostikos grafe)
 * ir `lib/programa.ts` (uždavinių bibliotekoje).
 *
 * Pridedant naują generatorių pakanka įrašyti jį čia ir nurodyti raktą temoje.
 */
export const generatoriai: Record<string, Generatorius> = {
  // Aritmetika ir pradinės klasės
  'sudetis-atimtis': sudetisAtimtis,
  'skaiciu-palyginimas': skaiciuPalyginimas,
  sekos,
  'dalies-radimas': dalisIrVisuma,
  pinigai,
  laikas,
  'matavimo-vienetai': matavimoVienetai,
  apvalinimas,
  'veiksmu-tvarka': veiksmuTvarka,
  desimtaines,
  sveikieji,

  // Trupmenos ir skaičiai
  dalumas,
  bendravardiklinimas,
  'trupmenu-sudetis': trupmenuSudetis,
  'trupmenu-daugyba': trupmenuDaugyba,
  neigiami,
  procentai,

  // Algebra
  'raidiniai-reiskiniai': raidiniaiReiskiniai,
  'tiesines-lygtys': tiesinesLygtys,
  nelygybes,
  laipsniai,
  saknys,
  'greitosios-formules': greitosiosFormules,
  'lygciu-sistemos': lygciuSistemos,
  'kvadratines-lygtys': kvadratinesLygtys,
  funkcijos,

  // Proporcingumas ir taikymai
  proporcijos,
  atvirkstinis,
  greitis,
  palukanos,

  // Geometrija
  perimetras,
  'plotas-turis': plotasTuris,
  kampai,
  pitagoras,
  apskritimas,
  trigonometrija,

  // Braižymas, transformacijos ir figūros — su savais SVG brėžiniais
  koordinates,
  simetrija,
  figuros,
  lauzes,
  'erdvines-figuros': erdvinesFiguros,
  vektoriai,
  konstravimas,
  ornamentai,
  algoritmai,

  // 5–10 klasių turinio aprašo reikalaujami gebėjimai
  'dalumo-pozymiai': dalumoPozymiai,
  skaitmenys,
  'saknu-ivertinimas': saknuIvertinimas,
  sklaida,
  vijeto,
  misiniai,
  'rekurencios-sekos': rekurenciosSekos,
  logika,

  // Duomenys ir tikimybės
  vidurkis,
  tikimybe,
  kombinatorika,
  diagramos,
}

/**
 * Temos, iš kurių sudaromas mišrus pasiruošimo PUPP rinkinys.
 * Tai ne NŠA užduotis, o mūsų uždaviniai iš tų pačių turinio sričių.
 */
const PUPP_TEMOS = [
  'trupmenu-sudetis',
  'procentai',
  'neigiami',
  'tiesines-lygtys',
  'proporcijos',
  'laipsniai',
  'saknys',
  'greitosios-formules',
  'lygciu-sistemos',
  'kvadratines-lygtys',
  'funkcijos',
  'pitagoras',
  'plotas-turis',
  'trigonometrija',
  'vidurkis',
  'tikimybe',
] as const

generatoriai.pupp = (lygis, klase) => {
  const vardas = PUPP_TEMOS[Math.floor(Math.random() * PUPP_TEMOS.length)]
  return generatoriai[vardas](lygis, klase ?? 10)
}

/** Ar toks generatorius egzistuoja. */
export function arYraGeneratorius(vardas: string): boolean {
  return vardas in generatoriai
}

/** Vienas uždavinys iš nurodyto generatoriaus. */
export function generuok(vardas: string, lygis: Lygis, klase?: number): Uzdavinys {
  const g = generatoriai[vardas]
  if (!g) throw new Error(`Nežinomas generatorius: ${vardas}`)
  return g(lygis, klase)
}

/**
 * Kelių uždavinių rinkinys iš to paties generatoriaus.
 * Vienodi uždaviniai atmetami — tas pats klausimas du kartus iš eilės atrodo
 * kaip klaida, net jei matematiškai viskas gerai.
 */
export function generuokRinkini(
  vardas: string,
  lygis: Lygis,
  kiek: number,
  klase?: number,
): Uzdavinys[] {
  const rinkinys: Uzdavinys[] = []
  const matyti = new Set<string>()
  let bandymai = 0

  while (rinkinys.length < kiek && bandymai < kiek * 20) {
    bandymai += 1
    const u = generuok(vardas, lygis, klase)
    // Brėžininiuose uždaviniuose klausimo tekstas dažnai vienodas („Kokia taško A
    // abscisė?"), o skiriasi tik piešinys — tad tapatybė yra abu kartu.
    const raktas = u.klausimas + (u.brezinys ?? '')
    if (matyti.has(raktas)) continue
    matyti.add(raktas)
    rinkinys.push(u)
  }

  // Jei generatorius neturi tiek skirtingų variantų, papildom kartojimais.
  while (rinkinys.length < kiek) {
    rinkinys.push(generuok(vardas, lygis, klase))
  }

  return rinkinys
}
