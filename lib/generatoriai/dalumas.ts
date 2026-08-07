import { atsitiktinis, mbk, nsd, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { didink, vyresne } from './mastas'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Dalumas: dalikliai, NSD ir MBK (5 klasė).
 *
 * Specifikacijos 7.3 lentelėje šio failo nėra, bet grafe `dalumas` yra
 * `bendravardiklinimo` prielaida — ir turinio prasme tai tiesa: kas nemoka
 * rasti MBK, tas negali suvesti trupmenų į bendrą vardiklį.
 */

const ATSARGINIAI = [
  {
    klausimas: 'Koks didžiausias bendrasis daliklis skaičių 12 ir 18?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: '12 dalikliai: 1, 2, 3, 4, 6, 12. 18 dalikliai: 1, 2, 3, 6, 9, 18. Didžiausias bendras — 6.',
  },
  {
    klausimas: 'Koks mažiausias bendrasis kartotinis skaičių 4 ir 6?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '4 kartotiniai: 4, 8, 12… 6 kartotiniai: 6, 12… Pirmas bendras — 12.',
  },
] as const

export const dalumas: Generatorius = (lygis, klase) =>
  suBandymais(() => kurk(lygis, klase), ATSARGINIAI, 'dalumas')

/** Visi skaičiaus dalikliai — naudojama paaiškinime. */
function dalikliai(n: number): number[] {
  const rez: number[] = []
  for (let d = 1; d <= n; d += 1) {
    if (n % d === 0) rez.push(d)
  }
  return rez
}

/** Vienodo dydžio pakuočių kontekstai — MBK ir NSD tekstiniams uždaviniams. */
const PAKUOTES = [
  { a: 'saldainiai', b: 'sausainiai', kur: 'dovanų maišelius' },
  { a: 'obuoliai', b: 'kriaušės', kur: 'krepšelius' },
  { a: 'pieštukai', b: 'trintukai', kur: 'penalus' },
  { a: 'raudoni balionai', b: 'mėlyni balionai', kur: 'puokštes' },
] as const

function kurk(lygis: Lygis, klase?: number): Uzdavinys | null {
  const a = atsitiktinis(6, didink(24, klase))
  const b = atsitiktinis(6, didink(24, klase))
  const d = nsd(a, b)

  const platus = [2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24] as const
  const siauras = [2, 3, 4, 5, 6, 8, 9, 10, 12] as const
  const rinkinys = vyresne(klase) ? platus : siauras
  const p = pasirink(rinkinys)
  const q = pasirink(rinkinys)
  const m = mbk(p, q)

  return variacija([
    // 1. Didžiausias bendrasis daliklis
    () => {
      if (a === b || d === 1) return null // atsakymas 1 nieko nepatikrina
      return uzdavinys('dalumas', {
        klausimas: `Koks didžiausias bendrasis daliklis skaičių ${a} ir ${b}?`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}$`,
        sprendimas: `${a} dalikliai: ${dalikliai(a).join(', ')}. ${b} dalikliai: ${dalikliai(
          b,
        ).join(', ')}. Didžiausias bendras — ${d}.`,
      })
    },

    // 2. Mažiausias bendrasis kartotinis — tai, ko reikia bendravardikliniant
    () => {
      if (p === q || m > 60) return null
      return uzdavinys('dalumas', {
        klausimas: `Koks mažiausias bendrasis kartotinis skaičių ${p} ir ${q}?`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$`,
        sprendimas: `${m} dalijasi ir iš ${p} ($${m} : ${p} = ${m / p}$), ir iš ${q} ($${m} : ${q} = ${
          m / q
        }$). Mažesnio tokio skaičiaus nėra.`,
      })
    },

    // 3. Kiek daliklių turi skaičius
    () =>
      uzdavinys('dalumas', {
        klausimas: `Kiek daliklių turi skaičius ${a}?`,
        atsakymas: String(dalikliai(a).length),
        atsakymasRodymui: `$${dalikliai(a).length}$`,
        sprendimas: `${a} dalikliai: ${dalikliai(a).join(', ')} — iš viso ${dalikliai(a).length}.`,
      }),

    // 4. Antras pagal dydį daliklis
    () => {
      const visi = dalikliai(a)
      if (visi.length < 3) return null
      const antras = visi[visi.length - 2]
      return uzdavinys('dalumas', {
        klausimas: `Koks didžiausias skaičiaus ${a} daliklis, mažesnis už patį ${a}?`,
        atsakymas: String(antras),
        atsakymasRodymui: `$${antras}$`,
        sprendimas: `${a} dalikliai: ${visi.join(', ')}. Didžiausias, mažesnis už ${a}, yra ${antras}.`,
      })
    },

    // 5. Ar skaičius yra bendras kartotinis
    () => {
      if (lygis === 1 || p === q || m > 60) return null
      return uzdavinys('dalumas', {
        klausimas: `Koks mažiausias skaičius, didesnis už 0, dalijasi ir iš ${p}, ir iš ${q}?`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$`,
        sprendimas: `Tai mažiausias bendrasis kartotinis: $${m} : ${p} = ${m / p}$, $${m} : ${q} = ${m / q}$.`,
      })
    },

    // 6. Tekstinis NSD uždavinys — kiek vienodų rinkinių galima sudaryti
    () => {
      if (lygis === 1 || a === b || d === 1) return null
      const k = pasirink(PAKUOTES)
      return uzdavinys('dalumas', {
        klausimas: `Turime ${a} ${k.a} ir ${b} ${k.b}. Norime sudėti juos į vienodus ${k.kur} nieko nepalikdami. Kiek daugiausiai jų galima sudaryti?`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}$`,
        sprendimas: `Reikia didžiausio bendrojo daliklio: $${a}$ ir $${b}$ didžiausias bendrasis daliklis yra ${d}.`,
      })
    },

    // 7. Tekstinis MBK uždavinys — kada sutaps du ciklai
    () => {
      if (lygis === 1 || p === q || m > 60) return null
      return uzdavinys('dalumas', {
        klausimas: `Vienas autobusas išvažiuoja kas ${p} minutes, kitas — kas ${q} minutes. Abu kartu ką tik išvažiavo. Po kiek minučių jie vėl išvažiuos kartu?`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$ min`,
        sprendimas: `Reikia mažiausio bendrojo kartotinio: $${m} : ${p} = ${m / p}$ ir $${m} : ${q} = ${m / q}$.`,
      })
    },
  ])
}
