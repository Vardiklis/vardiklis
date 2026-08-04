import { atsitiktinis, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Procentai: dalies radimas ir visumos radimas.
 * Procentai imami tik iš mokykloje įprasto rinkinio, o visuma parenkama taip,
 * kad rezultatas visada būtų sveikas.
 */

const PROCENTAI = [5, 10, 20, 25, 50, 75] as const

const KONTEKSTAI = [
  { daiktas: 'Klasėje yra', vienetas: 'mokinių', dalis: 'mokinių' },
  { daiktas: 'Bibliotekoje yra', vienetas: 'knygų', dalis: 'knygų' },
  { daiktas: 'Stovykloje yra', vienetas: 'vaikų', dalis: 'vaikų' },
] as const

const ATSARGINIAI = [
  {
    klausimas: 'Kiek yra 25 % nuo 80?',
    atsakymas: '20',
    atsakymasRodymui: '$20$',
    sprendimas: '25 % yra ketvirtadalis: $80 : 4 = 20$.',
  },
  {
    klausimas: '20 % skaičiaus yra 14. Koks tas skaičius?',
    atsakymas: '70',
    atsakymasRodymui: '$70$',
    sprendimas: '20 % yra penktadalis, tad visas skaičius $14 \\cdot 5 = 70$.',
  },
] as const

export const procentai: Generatorius = (lygis) =>
  suBandymais(() => kurk(lygis), ATSARGINIAI, 'procentai')

/** Trumpas paaiškinimas, kas yra tas procentas dalimis. */
function dalimis(p: number): string {
  switch (p) {
    case 5:
      return 'dvidešimtoji dalis'
    case 10:
      return 'dešimtoji dalis'
    case 20:
      return 'penktoji dalis'
    case 25:
      return 'ketvirtoji dalis'
    case 50:
      return 'pusė'
    default:
      return 'trys ketvirtadaliai'
  }
}

/**
 * Septynios skirtingo pavidalo variacijos. Lygis lemia, kiek jų prieinama:
 * pirmame lygyje tik tiesioginiai klausimai, trečiame — ir atvirkštiniai.
 */
function kurk(lygis: Lygis): Uzdavinys | null {
  const p = pasirink(PROCENTAI)
  const visuma = atsitiktinis(1, 20) * 20
  if ((visuma * p) % 100 !== 0) return null
  const dalis = (visuma * p) / 100
  if (dalis < 2) return null

  const visos = [
    // 1. Dalies radimas
    () =>
      uzdavinys('procentai', {
        klausimas: `Kiek yra ${p} % nuo ${visuma}?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `${p} % yra ${dalimis(p)}: $${visuma} \\cdot ${p} : 100 = ${dalis}$.`,
      }),

    // 2. Visumos radimas
    () =>
      uzdavinys('procentai', {
        klausimas: `${p} % skaičiaus yra ${dalis}. Koks tas skaičius?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `${p} % yra ${dalimis(p)}. Visas skaičius: $${dalis} : ${p} \\cdot 100 = ${visuma}$.`,
      }),

    // 3. Kiek procentų sudaro
    () =>
      uzdavinys('procentai', {
        klausimas: `Kiek procentų skaičius ${dalis} sudaro nuo ${visuma}?`,
        atsakymas: String(p),
        atsakymasRodymui: `$${p}$ %`,
        sprendimas: `$${dalis} : ${visuma} \\cdot 100 = ${p}$ %.`,
      }),

    // 4. Nuolaida
    () => {
      const liko = visuma - dalis
      if (liko <= 0) return null
      return uzdavinys('procentai', {
        klausimas: `Prekė kainavo ${visuma} €. Jai taikoma ${p} % nuolaida. Kiek ji kainuoja dabar?`,
        atsakymas: String(liko),
        atsakymasRodymui: `$${liko}$ €`,
        sprendimas: `${p} % nuo ${visuma} yra ${dalis}, tad $${visuma} - ${dalis} = ${liko}$ €.`,
      })
    },

    // 5. Pabrangimas
    () =>
      uzdavinys('procentai', {
        klausimas: `Prekė kainavo ${visuma} €. Ji pabrango ${p} %. Kiek ji kainuoja dabar?`,
        atsakymas: String(visuma + dalis),
        atsakymasRodymui: `$${visuma + dalis}$ €`,
        sprendimas: `${p} % nuo ${visuma} yra ${dalis}, tad $${visuma} + ${dalis} = ${visuma + dalis}$ €.`,
      }),

    // 6. Tekstinis su kontekstu
    () => {
      const k = pasirink(KONTEKSTAI)
      return uzdavinys('procentai', {
        klausimas: `${k.daiktas} ${visuma} ${k.vienetas}. ${p} % iš jų nuvyko į ekskursiją. Kiek ${k.dalis} nuvyko?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `${p} % yra ${dalimis(p)}: $${visuma} \\cdot ${p} : 100 = ${dalis}$.`,
      })
    },

    // 7. Kiek liko procentais
    () => {
      if (p >= 100) return null
      return uzdavinys('procentai', {
        klausimas: `Iš ${visuma} mokinių ${p} % išvyko. Kiek mokinių liko?`,
        atsakymas: String(visuma - dalis),
        atsakymasRodymui: `$${visuma - dalis}$`,
        sprendimas: `Išvyko ${dalis}, tad liko $${visuma} - ${dalis} = ${visuma - dalis}$.`,
      })
    },
  ]

  return variacija(lygis === 1 ? visos.slice(0, 3) : lygis === 2 ? visos.slice(0, 5) : visos)
}
