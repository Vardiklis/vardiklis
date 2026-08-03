import { atsitiktinis, atsitiktinisBe, skliaustuoseJeiNeigiamas } from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Neigiami skaičiai: sudėtis, atimtis, daugyba.
 * Rezultatai laikomi intervale −50..50 — didesni skaičiai nieko naujo
 * nepatikrina, tik apsunkina skaičiavimą mintinai.
 */

const ATSARGINIAI = [
  {
    klausimas: 'Apskaičiuok: $-7 + 12$',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Nuo $-7$ pakylame 12 vienetų ir atsiduriame ties 5.',
  },
  {
    klausimas: 'Apskaičiuok: $-6 \\cdot (-4)$',
    atsakymas: '24',
    atsakymasRodymui: '$24$',
    sprendimas: 'Dviejų neigiamų skaičių sandauga teigiama: $6 \\cdot 4 = 24$.',
  },
] as const

export const neigiami: Generatorius = (lygis) =>
  suBandymais(() => kurk(lygis), ATSARGINIAI, 'neigiami-skaiciai')

function kurk(lygis: Lygis): Uzdavinys | null {
  if (lygis === 3 && Math.random() < 0.5) return kurkDaugyba()
  if (lygis === 3) return kurkTrisNarius()
  return kurkSudeti(lygis)
}

function kurkSudeti(lygis: Lygis): Uzdavinys | null {
  const riba = lygis === 1 ? 20 : 50
  const a = atsitiktinisBe(-riba, riba, [0])
  const b = atsitiktinisBe(-riba, riba, [0])
  const atimtis = Math.random() < 0.5
  const rez = atimtis ? a - b : a + b

  if (rez === 0) return null
  if (Math.abs(rez) > 50) return null
  // Bent vienas skaičius turi būti neigiamas — kitaip tema netikrinama.
  if (a > 0 && b > 0 && !atimtis) return null
  // 1 lygyje vengiam dviejų neigiamų iš karto.
  if (lygis === 1 && a < 0 && b < 0) return null

  const zenklas = atimtis ? '-' : '+'
  const israiska = `${a} ${zenklas} ${skliaustuoseJeiNeigiamas(b)}`

  return uzdavinys('neigiami-skaiciai', {
    klausimas: `Apskaičiuok: $${israiska}$`,
    atsakymas: String(rez),
    atsakymasRodymui: `$${rez}$`,
    sprendimas:
      atimtis && b < 0
        ? `Atimti neigiamą skaičių — tas pats, kas pridėti teigiamą: $${a} + ${Math.abs(
            b,
          )} = ${rez}$.`
        : `Skaičių tiesėje nuo $${a}$ pajudame ${
            atimtis || b < 0 ? 'žemyn' : 'aukštyn'
          } per ${Math.abs(b)} ir atsiduriame ties $${rez}$.`,
  })
}

function kurkDaugyba(): Uzdavinys | null {
  const a = atsitiktinisBe(-9, 9, [0, 1, -1])
  const b = atsitiktinisBe(-9, 9, [0, 1, -1])
  if (a > 0 && b > 0) return null
  const rez = a * b
  if (Math.abs(rez) > 50) return null

  return uzdavinys('neigiami-skaiciai', {
    klausimas: `Apskaičiuok: $${a} \\cdot ${skliaustuoseJeiNeigiamas(b)}$`,
    atsakymas: String(rez),
    atsakymasRodymui: `$${rez}$`,
    sprendimas:
      rez > 0
        ? `Ženklai vienodi, tad sandauga teigiama: $${Math.abs(a)} \\cdot ${Math.abs(
            b,
          )} = ${rez}$.`
        : `Ženklai skirtingi, tad sandauga neigiama: $${Math.abs(a)} \\cdot ${Math.abs(
            b,
          )} = ${Math.abs(rez)}$.`,
  })
}

function kurkTrisNarius(): Uzdavinys | null {
  const a = atsitiktinisBe(-25, 25, [0])
  const b = atsitiktinis(2, 20)
  const c = atsitiktinis(2, 20)
  const rez = a - b + c
  if (rez === 0 || Math.abs(rez) > 50) return null
  if (a > 0 && rez > 0 && a - b > 0) return null // niekur neperėjom per nulį

  return uzdavinys('neigiami-skaiciai', {
    klausimas: `Apskaičiuok: $${a} - ${b} + ${c}$`,
    atsakymas: String(rez),
    atsakymasRodymui: `$${rez}$`,
    sprendimas: `Iš eilės: $${a} - ${b} = ${a - b}$, tada $${a - b} + ${c} = ${rez}$.`,
  })
}
