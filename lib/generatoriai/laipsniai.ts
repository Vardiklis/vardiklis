import { atsitiktinis, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { didink, vyresne } from './mastas'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Laipsniai ir jų savybės.
 * Pagrindai 2..5, rodikliai 2..4 — reikšmės lieka tokios, kurias mokinys
 * dar gali patikrinti mintinai.
 */

const PAGRINDAI = [2, 3, 4, 5] as const
const MAKS_REIKSME = 4096

const ATSARGINIAI = [
  {
    klausimas: 'Apskaičiuok: $3^4$',
    atsakymas: '81',
    atsakymasRodymui: '$81$',
    sprendimas: '$3 \\cdot 3 \\cdot 3 \\cdot 3 = 81$.',
  },
  {
    klausimas: 'Apskaičiuok: $2^3 \\cdot 2^4$',
    atsakymas: '128',
    atsakymasRodymui: '$128$',
    sprendimas: 'Dauginant laipsnius rodikliai sudedami: $2^{3+4} = 2^7 = 128$.',
  },
] as const

export const laipsniai: Generatorius = (lygis, klase) =>
  suBandymais(() => kurk(lygis, klase), ATSARGINIAI, 'laipsniai')

function kurk(lygis: Lygis, klase?: number): Uzdavinys | null {
  const a = pasirink(PAGRINDAI)
  const riba = vyresne(klase) ? 1_000_000 : MAKS_REIKSME
  const m = atsitiktinis(2, 4)
  const n = atsitiktinis(2, 4)

  const visos = [
    // 1. Kvadratas arba kubas
    () => {
      const laipsnis = pasirink([2, 3] as const)
      const p =
        laipsnis === 2 ? atsitiktinis(2, didink(12, klase)) : atsitiktinis(2, didink(6, klase))
      const rez = p ** laipsnis
      if (rez > riba) return null
      return uzdavinys('laipsniai', {
        klausimas: `Apskaičiuok: $${p}^${laipsnis}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${Array(laipsnis).fill(p).join(' \\cdot ')} = ${rez}$.`,
      })
    },

    // 2. Laipsnių daugyba
    () => {
      const rodiklis = m + n
      const rez = a ** rodiklis
      if (rez > riba) return null
      return uzdavinys('laipsniai', {
        klausimas: `Apskaičiuok: $${a}^${m} \\cdot ${a}^${n}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Dauginant vienodų pagrindų laipsnius rodikliai sudedami: $${a}^{${m}+${n}} = ${a}^{${rodiklis}} = ${rez}$.`,
      })
    },

    // 3. Laipsnių dalyba
    () => {
      const didesnis = Math.max(m, n) + atsitiktinis(1, 3)
      const mazesnis = Math.min(m, n)
      const rodiklis = didesnis - mazesnis
      const rez = a ** rodiklis
      if (rez > riba || rodiklis < 2) return null
      if (a ** didesnis > riba * 100) return null
      return uzdavinys('laipsniai', {
        klausimas: `Apskaičiuok: $${a}^${didesnis} : ${a}^${mazesnis}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Dalijant vienodų pagrindų laipsnius rodikliai atimami: $${a}^{${didesnis}-${mazesnis}} = ${a}^{${rodiklis}} = ${rez}$.`,
      })
    },

    // 4. Laipsnio kėlimas laipsniu
    () => {
      const rodiklis = m * n
      const rez = a ** rodiklis
      if (rez > riba) return null
      return uzdavinys('laipsniai', {
        klausimas: `Apskaičiuok: $\\left(${a}^${m}\\right)^${n}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Keliant laipsnį laipsniu rodikliai sudauginami: $${a}^{${m} \\cdot ${n}} = ${a}^{${rodiklis}} = ${rez}$.`,
      })
    },

    // 5. Trūkstamas rodiklis
    () => {
      const rez = a ** m
      if (rez > riba) return null
      return uzdavinys('laipsniai', {
        klausimas: `Koks rodiklis turi būti? $${a}^{\\square} = ${rez}$`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$`,
        sprendimas: `$${a}^{${m}} = ${rez}$, tad rodiklis lygus ${m}.`,
      })
    },

    // 6. Kėlimas laipsniu ir dalyba viename uždavinyje
    () => {
      if (lygis === 1) return null
      const k = atsitiktinis(1, m * n - 2)
      const rodiklis = m * n - k
      const rez = a ** rodiklis
      if (rodiklis < 2 || rez > riba) return null
      return uzdavinys('laipsniai', {
        klausimas: `Apskaičiuok: $\\left(${a}^${m}\\right)^${n} : ${a}^${k}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Keliant laipsnį laipsniu rodikliai sudauginami: $${a}^{${m} \\cdot ${n}} = ${a}^{${
          m * n
        }}$. Padalijus: $${a}^{${m * n}-${k}} = ${a}^{${rodiklis}} = ${rez}$.`,
      })
    },

    // 7. Neigiamo skaičiaus laipsnis
    () => {
      if (lygis === 1) return null
      const p = atsitiktinis(2, didink(7, klase))
      const laipsnis = pasirink([2, 3] as const)
      const rez = (-p) ** laipsnis
      if (Math.abs(rez) > riba) return null
      return uzdavinys('laipsniai', {
        klausimas: `Apskaičiuok: $(-${p})^${laipsnis}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas:
          laipsnis === 2
            ? `Lyginis rodiklis — rezultatas teigiamas: $${p}^2 = ${rez}$.`
            : `Nelyginis rodiklis — rezultatas neigiamas: $-${p}^3 = ${rez}$.`,
      })
    },

    // 8. Dešimties laipsniai
    () => {
      if (lygis === 1) return null
      const rodiklis = atsitiktinis(2, vyresne(klase) ? 8 : 5)
      return uzdavinys('laipsniai', {
        klausimas: `Kiek nulių turi skaičius $10^{${rodiklis}}$?`,
        atsakymas: String(rodiklis),
        atsakymasRodymui: `$${rodiklis}$`,
        sprendimas: `$10^{${rodiklis}}$ yra vienetas su ${rodiklis} nuliais.`,
      })
    },

    // 9. Neigiamas rodiklis
    () => {
      if (!vyresne(klase)) return null
      const rodiklis = atsitiktinis(1, 3)
      const rez = a ** rodiklis
      return uzdavinys('laipsniai', {
        klausimas: `Užrašyk paprastąja trupmena: $${a}^{-${rodiklis}} = \\dfrac{1}{\\square}$. Koks skaičius vardiklyje?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${a}^{-${rodiklis}} = \\dfrac{1}{${a}^{${rodiklis}}} = \\dfrac{1}{${rez}}$.`,
      })
    },

    // 10. Sudėtinis reiškinys
    () => {
      if (!vyresne(klase)) return null
      const p = atsitiktinis(2, 5)
      const rez = p ** 2 + p ** 3
      return uzdavinys('laipsniai', {
        klausimas: `Apskaičiuok: $${p}^2 + ${p}^3$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${p ** 2} + ${p ** 3} = ${rez}$.`,
      })
    },
  ]

  // Lengvesniam lygiui — tik pirmieji 5 pavidalai; sunkesniam visi.
  return variacija(lygis === 1 ? visos.slice(0, 5) : visos)
}
