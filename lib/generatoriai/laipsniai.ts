import { atsitiktinis, pasirink } from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
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

export const laipsniai: Generatorius = (lygis) =>
  suBandymais(() => kurk(lygis), ATSARGINIAI, 'laipsniai')

function kurk(lygis: Lygis): Uzdavinys | null {
  const a = pasirink(PAGRINDAI)

  if (lygis === 1) {
    // Kas trečias — kvadratas ar kubas su platesniu pagrindu, kad rinkinys
    // iš 20 uždavinių nesikartotų.
    if (Math.random() < 0.45) {
      const n = pasirink([2, 3] as const)
      const p = n === 2 ? atsitiktinis(2, 12) : atsitiktinis(2, 6)
      const rez = p ** n

      return uzdavinys('laipsniai', {
        klausimas: `Apskaičiuok: $${p}^${n}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${Array(n).fill(p).join(' \\cdot ')} = ${rez}$.`,
      })
    }

    const n = atsitiktinis(2, 4)
    const rez = a ** n
    if (rez > 625) return null

    return uzdavinys('laipsniai', {
      klausimas: `Apskaičiuok: $${a}^${n}$`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$`,
      sprendimas: `$${Array(n).fill(a).join(' \\cdot ')} = ${rez}$.`,
    })
  }

  if (lygis === 2) {
    // Laipsnių daugyba arba dalyba — rodikliai sudedami / atimami.
    const m = atsitiktinis(2, 4)
    const n = atsitiktinis(2, 4)

    if (Math.random() < 0.5) {
      const rodiklis = m + n
      const rez = a ** rodiklis
      if (rez > MAKS_REIKSME) return null

      return uzdavinys('laipsniai', {
        klausimas: `Apskaičiuok: $${a}^${m} \\cdot ${a}^${n}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Dauginant vienodų pagrindų laipsnius rodikliai sudedami: $${a}^{${m}+${n}} = ${a}^{${rodiklis}} = ${rez}$.`,
      })
    }

    const didesnis = Math.max(m, n) + atsitiktinis(1, 3)
    const mazesnis = Math.min(m, n)
    const rodiklis = didesnis - mazesnis
    const rez = a ** rodiklis
    if (rez > MAKS_REIKSME || rodiklis < 2) return null
    if (a ** didesnis > 100000) return null

    return uzdavinys('laipsniai', {
      klausimas: `Apskaičiuok: $${a}^${didesnis} : ${a}^${mazesnis}$`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$`,
      sprendimas: `Dalijant vienodų pagrindų laipsnius rodikliai atimami: $${a}^{${didesnis}-${mazesnis}} = ${a}^{${rodiklis}} = ${rez}$.`,
    })
  }

  // 3 lygis — laipsnio kėlimas laipsniu ir dalyba viename uždavinyje.
  const m = atsitiktinis(2, 3)
  const n = atsitiktinis(2, 3)
  const k = atsitiktinis(1, m * n - 2)
  const rodiklis = m * n - k
  const rez = a ** rodiklis
  if (rodiklis < 2 || rez > MAKS_REIKSME) return null

  return uzdavinys('laipsniai', {
    klausimas: `Apskaičiuok: $\\left(${a}^${m}\\right)^${n} : ${a}^${k}$`,
    atsakymas: String(rez),
    atsakymasRodymui: `$${rez}$`,
    sprendimas: `Keliant laipsnį laipsniu rodikliai sudauginami: $${a}^{${m} \\cdot ${n}} = ${a}^{${
      m * n
    }}$. Padalijus: $${a}^{${m * n}-${k}} = ${a}^{${rodiklis}} = ${rez}$.`,
  })
}
