import { atsitiktinis, pasirink } from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Tiesioginis proporcingumas.
 * Koeficientas visada sveikas — kitaip atsakymas gaunasi tipo 13,67 €,
 * ir uždavinys nustoja tikrinti proporcingumą, o pradeda tikrinti dalybą.
 */

type Kontekstas = {
  daiktas: string
  daiktoKilm: string
  matas: string
}

const KONTEKSTAI: readonly Kontekstas[] = [
  { daiktas: 'sąsiuviniai', daiktoKilm: 'sąsiuvinių', matas: '€' },
  { daiktas: 'obuoliai', daiktoKilm: 'obuolių', matas: '€' },
  { daiktas: 'pieštukai', daiktoKilm: 'pieštukų', matas: '€' },
  { daiktas: 'bilietai', daiktoKilm: 'bilietų', matas: '€' },
]

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
  const vienetoKaina = lygis === 1 ? atsitiktinis(2, 9) : atsitiktinis(3, 15)
  const kiekis1 = atsitiktinis(2, 9)
  const kiekis2 = atsitiktinis(2, 12)
  if (kiekis1 === kiekis2) return null

  const kaina1 = vienetoKaina * kiekis1
  const kaina2 = vienetoKaina * kiekis2
  if (kaina2 > 300) return null

  if (lygis === 1 || (lygis === 2 && Math.random() < 0.6)) {
    return uzdavinys('proporcijos', {
      klausimas: `${kiekis1} ${k.daiktas} kainuoja ${kaina1} ${k.matas}. Kiek kainuoja ${kiekis2} tokie ${k.daiktas}?`,
      atsakymas: String(kaina2),
      atsakymasRodymui: `$${kaina2}$ ${k.matas}`,
      sprendimas: `Vienas kainuoja $${kaina1} : ${kiekis1} = ${vienetoKaina}$ ${k.matas}, tad ${kiekis2} — $${vienetoKaina} \\cdot ${kiekis2} = ${kaina2}$ ${k.matas}.`,
    })
  }

  if (lygis === 2) {
    // Atvirkštinis klausimas: žinoma kaina, ieškomas kiekis.
    return uzdavinys('proporcijos', {
      klausimas: `${kiekis1} ${k.daiktas} kainuoja ${kaina1} ${k.matas}. Kiek tokių ${k.daiktoKilm} nupirksi už ${kaina2} ${k.matas}?`,
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

  return uzdavinys('proporcijos', {
    klausimas: `Už ${kiekis1} ${k.daiktoKilm} sumokėta ${kaina1} ${k.matas}. Kiek reikės sumokėti už ${kiekis3} tokius pačius?`,
    atsakymas: String(kaina3),
    atsakymasRodymui: `$${kaina3}$ ${k.matas}`,
    sprendimas: `Kiekis padidėjo ${daugiklis} kartus, tad ir kaina: $${kaina1} \\cdot ${daugiklis} = ${kaina3}$ ${k.matas}.`,
  })
}
