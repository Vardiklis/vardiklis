import { derink } from '../lietuviu'
import { atsitiktinis, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
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

/** Galininko formos: „po 1 obuolį", „po 5 obuolius", „po 20 obuolių". */
const DAIKTAI = [
  { vns: 'obuolį', dgs: 'obuolius', kilm: 'obuolių' },
  { vns: 'sąsiuvinį', dgs: 'sąsiuvinius', kilm: 'sąsiuvinių' },
  { vns: 'pieštuką', dgs: 'pieštukus', kilm: 'pieštukų' },
  { vns: 'saldainį', dgs: 'saldainius', kilm: 'saldainių' },
] as const

export const sveikieji: Generatorius = (lygis) =>
  suBandymais(() => kurk(lygis), ATSARGINIAI, 'daugyba-dalyba')

/** Septynios skirtingo pavidalo variacijos — ne vien kiti skaičiai. */
function kurk(lygis: Lygis): Uzdavinys | null {
  const a = () => (lygis === 1 ? atsitiktinis(2, 9) : atsitiktinis(11, lygis === 2 ? 40 : 99))
  const b = () => atsitiktinis(2, 9)

  return variacija([
    // 1. Daugyba
    () => {
      const x = a()
      const y = b()
      if (x * y > (lygis === 1 ? 81 : 900)) return null
      return uzdavinys('daugyba-dalyba', {
        klausimas: `Apskaičiuok: $${x} \\cdot ${y}$`,
        atsakymas: String(x * y),
        atsakymasRodymui: `$${x * y}$`,
        sprendimas: `$${x} \\cdot ${y} = ${x * y}$.`,
      })
    },

    // 2. Dalyba be liekanos
    () => {
      const x = a()
      const y = b()
      const sandauga = x * y
      if (sandauga > 900) return null
      return uzdavinys('daugyba-dalyba', {
        klausimas: `Apskaičiuok: $${sandauga} : ${y}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `$${y} \\cdot ${x} = ${sandauga}$, tad $${sandauga} : ${y} = ${x}$.`,
      })
    },

    // 3. Trūkstamas daugiklis
    () => {
      const x = a()
      const y = b()
      if (x * y > 900) return null
      return uzdavinys('daugyba-dalyba', {
        klausimas: `Koks skaičius turi būti vietoj langelio? $${y} \\cdot \\square = ${x * y}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `$${x * y} : ${y} = ${x}$.`,
      })
    },

    // 4. Tekstinis: vienodos dėžės
    () => {
      const dezes = atsitiktinis(3, 9)
      const kiekvienoje = lygis === 1 ? atsitiktinis(2, 9) : atsitiktinis(6, 25)
      // „po 24 saldainius", bet „po 20 saldainių" — galininkas derinamas su skaičiumi.
      const daiktas = pasirink(DAIKTAI)
      return uzdavinys('daugyba-dalyba', {
        klausimas: `${dezes} dėžėse yra po ${kiekvienoje} ${derink(kiekvienoje, daiktas)}. Kiek ${daiktas.kilm} iš viso?`,
        atsakymas: String(dezes * kiekvienoje),
        atsakymasRodymui: `$${dezes * kiekvienoje}$`,
        sprendimas: `$${dezes} \\cdot ${kiekvienoje} = ${dezes * kiekvienoje}$.`,
      })
    },

    // 5. Dalyba su liekana
    () => {
      if (lygis === 1) return null
      const daliklis = atsitiktinis(3, 9)
      const dalmuo = atsitiktinis(4, 20)
      const liekana = atsitiktinis(1, daliklis - 1)
      const dalinys = daliklis * dalmuo + liekana
      return uzdavinys('daugyba-dalyba', {
        klausimas: `Kokia liekana gaunama dalijant ${dalinys} iš ${daliklis}?`,
        atsakymas: String(liekana),
        atsakymasRodymui: `$${liekana}$`,
        sprendimas: `$${daliklis} \\cdot ${dalmuo} = ${daliklis * dalmuo}$, o $${dalinys} - ${daliklis * dalmuo} = ${liekana}$.`,
      })
    },

    // 6. Du veiksmai
    () => {
      const x = atsitiktinis(3, 12)
      const y = b()
      const z = atsitiktinis(2, 9)
      const w = b()
      const rez = x * y + z * w
      if (rez > 400) return null
      return uzdavinys('daugyba-dalyba', {
        klausimas: `Apskaičiuok: $${x} \\cdot ${y} + ${z} \\cdot ${w}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Pirma daugyba: $${x * y}$ ir $${z * w}$. Tada $${x * y} + ${z * w} = ${rez}$.`,
      })
    },

    // 7. Kiek kartų didesnis
    () => {
      const kartai = atsitiktinis(2, 9)
      const mazas = lygis === 1 ? atsitiktinis(2, 9) : atsitiktinis(6, 30)
      const didelis = mazas * kartai
      if (didelis > 900) return null
      return uzdavinys('daugyba-dalyba', {
        klausimas: `Kiek kartų ${didelis} didesnis už ${mazas}?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `$${didelis} : ${mazas} = ${kartai}$.`,
      })
    },
  ])
}
