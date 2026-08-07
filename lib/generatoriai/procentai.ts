import { atsitiktinis, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { didink, vyresne } from './mastas'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Procentai: dalies radimas ir visumos radimas.
 * Procentai imami tik iš mokykloje įprasto rinkinio, o visuma parenkama taip,
 * kad rezultatas visada būtų sveikas.
 */

const PROCENTAI = [5, 10, 20, 25, 50, 75] as const

/**
 * Kiekvienas kontekstas neša ir savo veiksmą — kitaip sakinys išeina
 * „Bibliotekoje yra 520 knygų. 5 % iš jų nuvyko į ekskursiją“.
 */
const KONTEKSTAI = [
  { kur: 'Klasėje yra', ko: 'mokinių', veiksmas: 'nuvyko į ekskursiją', klausia: 'nuvyko' },
  { kur: 'Bibliotekoje yra', ko: 'knygų', veiksmas: 'yra išduota skaitytojams', klausia: 'išduota' },
  { kur: 'Stovykloje yra', ko: 'vaikų', veiksmas: 'moka plaukti', klausia: 'moka plaukti' },
  { kur: 'Sode auga', ko: 'medžių', veiksmas: 'yra obelys', klausia: 'yra obelų' },
  { kur: 'Parduotuvėje yra', ko: 'prekių', veiksmas: 'parduota per dieną', klausia: 'parduota' },
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

export const procentai: Generatorius = (lygis, klase) =>
  suBandymais(() => kurk(lygis, klase), ATSARGINIAI, 'procentai')

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
function kurk(lygis: Lygis, klase?: number): Uzdavinys | null {
  // Vyresnėse klasėse ir procentai netaisyklingesni, ir sumos didesnės.
  const p = vyresne(klase) ? pasirink([...PROCENTAI, 15, 30, 35, 60, 80] as const) : pasirink(PROCENTAI)
  const visuma = atsitiktinis(1, didink(20, klase)) * 20
  if ((visuma * p) % 100 !== 0) return null
  const dalis = (visuma * p) / 100
  if (dalis < 2) return null

  const visos = [
    // 1. Dalies radimas
    () => {
      if (vyresne(klase)) return null
      return uzdavinys('procentai', {
        klausimas: `Kiek yra ${p} % nuo ${visuma}?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `${p} % yra ${dalimis(p)}: $${visuma} \\cdot ${p} : 100 = ${dalis}$.`,
      })
    },

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
        klausimas: `${k.kur} ${visuma} ${k.ko}. ${p} % iš jų ${k.veiksmas}. Kiek ${k.klausia}?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `${p} % yra ${dalimis(p)}: $${visuma} \\cdot ${p} : 100 = ${dalis}$.`,
      })
    },

    // 7. Dviguba nuolaida — tik vyresnėms klasėms
    () => {
      if (!vyresne(klase)) return null
      const poPirmos = visuma - dalis
      const antra = (poPirmos * 10) / 100
      if (!Number.isInteger(antra)) return null
      return uzdavinys('procentai', {
        klausimas: `Prekė kainavo ${visuma} €. Iš pradžių jai pritaikyta ${p} % nuolaida, po to dar 10 % nuolaida nuo naujos kainos. Kiek prekė kainuoja dabar?`,
        atsakymas: String(poPirmos - antra),
        atsakymasRodymui: `$${poPirmos - antra}$ €`,
        sprendimas: `Po pirmos nuolaidos $${visuma} - ${dalis} = ${poPirmos}$ €. Antroji nuolaida $${poPirmos} \\cdot 10 : 100 = ${antra}$ €, tad $${poPirmos} - ${antra} = ${
          poPirmos - antra
        }$ €.`,
      })
    },

    // 8. Kiek liko procentais
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

  return variacija(lygis === 1 ? visos.slice(0, 5) : visos)
}
