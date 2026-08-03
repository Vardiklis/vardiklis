import { atsitiktinis, pasirink } from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Tiesioginis proporcingumas.
 * Koeficientas visada sveikas — kitaip atsakymas gaunasi tipo 13,67 €,
 * ir uždavinys nustoja tikrinti proporcingumą, o pradeda tikrinti dalybą.
 */

/**
 * Daiktavardžio forma pagal skaitvardį:
 *   1, 21, 31…            → vienaskaita   (1 sąsiuvinis)
 *   2–9, 22–29…           → daugiskaita   (6 sąsiuviniai)
 *   0, 10, 11–19, 20, 30… → kilmininkas   (12 sąsiuvinių)
 */
type Forma = 'vns' | 'dgs' | 'kilm'

function forma(n: number): Forma {
  const desimtys = n % 100
  if (desimtys >= 11 && desimtys <= 19) return 'kilm'
  const paskutinis = n % 10
  if (paskutinis === 0) return 'kilm'
  if (paskutinis === 1) return 'vns'
  return 'dgs'
}

// Visi kontekstų daiktavardžiai vyriškosios giminės, tad įvardžiai bendri.
const TOKS = {
  vardininkas: { vns: 'toks', dgs: 'tokie', kilm: 'tokių' },
  galininkas: { vns: 'tokį', dgs: 'tokius', kilm: 'tokių' },
} as const

const PATS = {
  galininkas: { vns: 'patį', dgs: 'pačius', kilm: 'pačių' },
} as const

type Kontekstas = {
  vns: string
  dgs: string
  kilm: string
  galVns: string
  galDgs: string
  matas: string
  /** Vieneto kainos ribos — kad uždavinys neatrodytų kaip iš kito pasaulio. */
  kainaNuo: number
  kainaIki: number
}

const KONTEKSTAI: readonly Kontekstas[] = [
  {
    vns: 'sąsiuvinis',
    dgs: 'sąsiuviniai',
    kilm: 'sąsiuvinių',
    galVns: 'sąsiuvinį',
    galDgs: 'sąsiuvinius',
    matas: '€',
    kainaNuo: 2,
    kainaIki: 5,
  },
  {
    vns: 'kilogramas obuolių',
    dgs: 'kilogramai obuolių',
    kilm: 'kilogramų obuolių',
    galVns: 'kilogramą obuolių',
    galDgs: 'kilogramus obuolių',
    matas: '€',
    kainaNuo: 2,
    kainaIki: 4,
  },
  {
    vns: 'pieštukas',
    dgs: 'pieštukai',
    kilm: 'pieštukų',
    galVns: 'pieštuką',
    galDgs: 'pieštukus',
    matas: '€',
    kainaNuo: 2,
    kainaIki: 3,
  },
  {
    vns: 'bilietas',
    dgs: 'bilietai',
    kilm: 'bilietų',
    galVns: 'bilietą',
    galDgs: 'bilietus',
    matas: '€',
    kainaNuo: 6,
    kainaIki: 15,
  },
]

/** Daiktavardis vardininku pagal skaičių. */
function vard(k: Kontekstas, n: number): string {
  const f = forma(n)
  return f === 'vns' ? k.vns : f === 'dgs' ? k.dgs : k.kilm
}

/** Daiktavardis galininku pagal skaičių („už 6 bilietus"). */
function gal(k: Kontekstas, n: number): string {
  const f = forma(n)
  return f === 'vns' ? k.galVns : f === 'dgs' ? k.galDgs : k.kilm
}

const ATSARGINIAI = [
  {
    klausimas: '5 sąsiuviniai kainuoja 15 €. Kiek kainuoja 8 tokie sąsiuviniai?',
    atsakymas: '24',
    atsakymasRodymui: '$24$ €',
    sprendimas: 'Vienas sąsiuvinis kainuoja $15 : 5 = 3$ €, tad aštuoni — $3 \\cdot 8 = 24$ €.',
  },
  {
    klausimas:
      'Automobilis per 3 valandas nuvažiuoja 240 km. Kiek kilometrų jis nuvažiuos per 5 valandas tokiu pačiu greičiu?',
    atsakymas: '400',
    atsakymasRodymui: '$400$ km',
    sprendimas: 'Per valandą — $240 : 3 = 80$ km, tad per 5 valandas $80 \\cdot 5 = 400$ km.',
  },
] as const

export const proporcijos: Generatorius = (lygis) =>
  suBandymais(() => kurk(lygis), ATSARGINIAI, 'proporcijos')

function kurk(lygis: Lygis): Uzdavinys | null {
  const k = pasirink(KONTEKSTAI)
  const vienetoKaina = atsitiktinis(k.kainaNuo, k.kainaIki)
  const kiekis1 = atsitiktinis(2, 9)
  const kiekis2 = atsitiktinis(2, 12)
  if (kiekis1 === kiekis2) return null

  const kaina1 = vienetoKaina * kiekis1
  const kaina2 = vienetoKaina * kiekis2
  if (kaina2 > 300) return null

  if (lygis === 1 || (lygis === 2 && Math.random() < 0.6)) {
    return uzdavinys('proporcijos', {
      klausimas: `${kiekis1} ${vard(k, kiekis1)} kainuoja ${kaina1} ${k.matas}. Kiek kainuoja ${kiekis2} ${
        TOKS.vardininkas[forma(kiekis2)]
      } ${vard(k, kiekis2)}?`,
      atsakymas: String(kaina2),
      atsakymasRodymui: `$${kaina2}$ ${k.matas}`,
      sprendimas: `Vienas kainuoja $${kaina1} : ${kiekis1} = ${vienetoKaina}$ ${k.matas}, tad ${kiekis2} — $${vienetoKaina} \\cdot ${kiekis2} = ${kaina2}$ ${k.matas}.`,
    })
  }

  if (lygis === 2) {
    // Atvirkštinis klausimas: žinoma kaina, ieškomas kiekis.
    // Po „kiek" visada eina kilmininkas, tad derinti nereikia.
    return uzdavinys('proporcijos', {
      klausimas: `${kiekis1} ${vard(k, kiekis1)} kainuoja ${kaina1} ${k.matas}. Kiek tokių ${
        k.kilm
      } nupirksi už ${kaina2} ${k.matas}?`,
      atsakymas: String(kiekis2),
      atsakymasRodymui: `$${kiekis2}$`,
      sprendimas: `Vienas kainuoja $${kaina1} : ${kiekis1} = ${vienetoKaina}$ ${k.matas}, tad už ${kaina2} ${k.matas} gausi $${kaina2} : ${vienetoKaina} = ${kiekis2}$.`,
    })
  }

  // 3 lygis — proporcija be akivaizdaus vieneto, per santykį.
  const daugiklis = atsitiktinis(2, 5)
  const kiekis3 = kiekis1 * daugiklis
  const kaina3 = kaina1 * daugiklis
  if (kaina3 > 400) return null

  const f3 = forma(kiekis3)

  return uzdavinys('proporcijos', {
    klausimas: `Už ${kiekis1} ${gal(k, kiekis1)} sumokėta ${kaina1} ${
      k.matas
    }. Kiek reikės sumokėti už ${kiekis3} ${TOKS.galininkas[f3]} ${PATS.galininkas[f3]} ${gal(
      k,
      kiekis3,
    )}?`,
    atsakymas: String(kaina3),
    atsakymasRodymui: `$${kaina3}$ ${k.matas}`,
    sprendimas: `Kiekis padidėjo ${daugiklis} kartus, tad ir kaina: $${kaina1} \\cdot ${daugiklis} = ${kaina3}$ ${k.matas}.`,
  })
}
