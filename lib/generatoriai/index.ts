import { atsitiktinumas } from '../sekla'
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
  piramide,
  prizme,
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
import { medzioAmzius, medzioAukstis, miskoSekla } from './miskas'
import { laipsniai } from './laipsniai'
import { neigiami } from './neigiami'
import {
  daiktuRikiavimas,
  daugiauMaziau,
  lyguNelygu,
  skaiciuRasymas,
  vieta,
} from './pirmokams'
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
import { pavidaluEile, sablonas } from './bendra'
import { gretimiSkaiciai, simtalange, skaiciuTiese } from './simtalange'
import { sritisKlasei, uzRibos, type Sritis } from './sritis'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

export type { Generatorius, Lygis, Sritis, Uzdavinys }

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
  piramide,
  prizme,
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

  // 1 klasės erdviniai santykiai ir skaičių išdėstymas
  vieta,
  'daiktu-rikiavimas': daiktuRikiavimas,
  'skaiciu-rasymas': skaiciuRasymas,
  'lygu-nelygu': lyguNelygu,
  'daugiau-maziau': daugiauMaziau,
  simtalange,
  'skaiciu-tiese': skaiciuTiese,
  'gretimi-skaiciai': gretimiSkaiciai,

  // Tyrinėju reiškinį „Miškas“ — sėklos, medžių aukštis, kelmo rievės
  'misko-sekla': miskoSekla,
  'medzio-aukstis': medzioAukstis,
  'medzio-amzius': medzioAmzius,

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
  const vardas = PUPP_TEMOS[Math.floor(atsitiktinumas() * PUPP_TEMOS.length)]
  return generatoriai[vardas](lygis, klase ?? 10)
}

/** Ar toks generatorius egzistuoja. */
export function arYraGeneratorius(vardas: string): boolean {
  return vardas in generatoriai
}

/** Kiek kartų persukama, kol pasitaiko į sritį telpantis uždavinys. */
const MAKS_SRITIES_BANDYMU = 40

/**
 * Vienas uždavinys iš nurodyto generatoriaus.
 *
 * Sritis tikrinama čia, o ne kiekviename generatoriuje, dėl dviejų priežasčių:
 * ji galioja ir tiems generatoriams, kurie apie ją nieko nežino, ir tikrinimas
 * lieka vienoje vietoje. Neradus tinkamo per `MAKS_SRITIES_BANDYMU` kartų
 * grąžinamas paskutinis bandymas — svetainė nelūžta, o `npm run patikra`
 * tokį atvejį paverčia klaida, todėl nepastebėtas jis neišeina.
 */
export function generuok(
  vardas: string,
  lygis: Lygis,
  klase?: number,
  sritis?: Sritis | null,
): Uzdavinys {
  const g = generatoriai[vardas]
  if (!g) throw new Error(`Nežinomas generatorius: ${vardas}`)

  const riba = sritis === undefined ? sritisKlasei(klase) : sritis
  if (!riba) return g(lygis, klase, null)

  let paskutinis = g(lygis, klase, riba)
  for (let i = 0; i < MAKS_SRITIES_BANDYMU; i += 1) {
    if (uzRibos(paskutinis, riba).length === 0) return paskutinis
    paskutinis = g(lygis, klase, riba)
  }
  return paskutinis
}

/**
 * Kelių uždavinių rinkinys iš to paties generatoriaus.
 *
 * Du dalykai, kurių anksčiau trūko:
 *
 * 1. Pavidalų eilė. Be jos generatorius su septyniais pavidalais dešimties
 *    uždavinių rinkinyje realiai panaudodavo tris.
 * 2. Tapatybė pagal šabloną, ne pagal eilutę. „Koks skaičius eina prieš pat
 *    2028?“ ir „…4385?“ yra tas pats uždavinys; `Set` su tikslia eilute jų
 *    neatskirdavo ir praleisdavo abu.
 *
 * Šablonų kartojimas leidžiamas tik tada, kai generatorius skirtingų
 * paprasčiausiai nebeturi — kitaip rinkinys būtų trumpesnis nei prašyta.
 */
export function generuokRinkini(
  vardas: string,
  lygis: Lygis,
  kiek: number,
  klase?: number,
  sritis?: Sritis | null,
): Uzdavinys[] {
  const rinkinys: Uzdavinys[] = []
  const sablonai = new Set<string>()
  const tikslus = new Set<string>()

  pavidaluEile(Math.floor(atsitiktinumas() * 7))
  try {
    // 1 ratas — tik nauji šablonai.
    for (let i = 0; i < kiek * 12 && rinkinys.length < kiek; i += 1) {
      const u = generuok(vardas, lygis, klase, sritis)
      const s = sablonas(u.klausimas)
      if (sablonai.has(s)) continue
      sablonai.add(s)
      tikslus.add(u.klausimas + (u.brezinys ?? ''))
      rinkinys.push(u)
    }

    // 2 ratas — šablonai jau išsemti, tad užtenka, kad skirtųsi pats uždavinys.
    // Brėžininiuose uždaviniuose klausimo tekstas dažnai vienodas („Kokia taško A
    // abscisė?"), o skiriasi tik piešinys — tad tapatybė yra abu kartu.
    for (let i = 0; i < kiek * 20 && rinkinys.length < kiek; i += 1) {
      const u = generuok(vardas, lygis, klase, sritis)
      const raktas = u.klausimas + (u.brezinys ?? '')
      if (tikslus.has(raktas)) continue
      tikslus.add(raktas)
      rinkinys.push(u)
    }

    // Jei generatorius neturi tiek skirtingų variantų, papildom kartojimais.
    while (rinkinys.length < kiek) {
      rinkinys.push(generuok(vardas, lygis, klase, sritis))
    }
  } finally {
    pavidaluEile(null)
  }

  return rinkinys
}
