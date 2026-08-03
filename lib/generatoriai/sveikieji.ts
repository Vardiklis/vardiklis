import { atsitiktinis } from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Sveikųjų skaičių daugyba ir dalyba (3 klasė).
 *
 * Specifikacijos 7.3 lentelėje šio failo nėra, bet prielaidų grafe tema
 * `daugyba-dalyba` yra trijų kitų temų šaknis — be generatoriaus diagnostika
 * negalėtų jos patikrinti ir niekada nerastų giliausios spragos.
 *
 * Dalyba visada be liekanos: dalinys sudauginamas pirma, tik tada užrašomas
 * uždavinys (7.1).
 */

const ATSARGINIAI = [
  {
    klausimas: 'Apskaičiuok: $7 \\cdot 8$',
    atsakymas: '56',
    atsakymasRodymui: '$56$',
    sprendimas: 'Septyni aštuonetai — 56.',
  },
  {
    klausimas: 'Apskaičiuok: $72 : 9$',
    atsakymas: '8',
    atsakymasRodymui: '$8$',
    sprendimas: '$9 \\cdot 8 = 72$, tad $72 : 9 = 8$.',
  },
] as const

export const sveikieji: Generatorius = (lygis) =>
  suBandymais(() => kurk(lygis), ATSARGINIAI, 'daugyba-dalyba')

function kurk(lygis: Lygis): Uzdavinys | null {
  const dalyba = Math.random() < 0.5

  if (lygis === 1) {
    const a = atsitiktinis(2, 9)
    const b = atsitiktinis(2, 9)
    const sandauga = a * b
    if (a === b && a === 2) return null

    if (dalyba) {
      return uzdavinys('daugyba-dalyba', {
        klausimas: `Apskaičiuok: $${sandauga} : ${a}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${a} \\cdot ${b} = ${sandauga}$, tad $${sandauga} : ${a} = ${b}$.`,
      })
    }

    return uzdavinys('daugyba-dalyba', {
      klausimas: `Apskaičiuok: $${a} \\cdot ${b}$`,
      atsakymas: String(sandauga),
      atsakymasRodymui: `$${sandauga}$`,
      sprendimas: `${a} kartus po ${b} — ${sandauga}.`,
    })
  }

  if (lygis === 2) {
    // Dviženklis kart vienženklis.
    const a = atsitiktinis(12, 40)
    const b = atsitiktinis(3, 9)
    const sandauga = a * b
    if (sandauga > 360) return null

    if (dalyba) {
      return uzdavinys('daugyba-dalyba', {
        klausimas: `Apskaičiuok: $${sandauga} : ${b}$`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${b} \\cdot ${a} = ${sandauga}$, tad $${sandauga} : ${b} = ${a}$.`,
      })
    }

    return uzdavinys('daugyba-dalyba', {
      klausimas: `Apskaičiuok: $${a} \\cdot ${b}$`,
      atsakymas: String(sandauga),
      atsakymasRodymui: `$${sandauga}$`,
      sprendimas: `$${a} \\cdot ${b} = ${Math.floor(a / 10) * 10} \\cdot ${b} + ${
        a % 10
      } \\cdot ${b} = ${Math.floor(a / 10) * 10 * b} + ${(a % 10) * b} = ${sandauga}$.`,
    })
  }

  // 3 lygis — du veiksmai, veiksmų eiliškumas.
  const a = atsitiktinis(3, 12)
  const b = atsitiktinis(2, 9)
  const c = atsitiktinis(2, 9)
  const d = atsitiktinis(2, 9)
  const rez = a * b + c * d
  if (rez > 200) return null

  return uzdavinys('daugyba-dalyba', {
    klausimas: `Apskaičiuok: $${a} \\cdot ${b} + ${c} \\cdot ${d}$`,
    atsakymas: String(rez),
    atsakymasRodymui: `$${rez}$`,
    sprendimas: `Pirma daugyba: $${a * b}$ ir $${c * d}$. Tada suma: $${a * b} + ${
      c * d
    } = ${rez}$.`,
  })
}
