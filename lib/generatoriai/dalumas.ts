import { atsitiktinis, mbk, nsd, pasirink } from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
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

function kurk(lygis: Lygis, klase?: number): Uzdavinys | null {
  if (lygis === 1) {
    // Didžiausias bendrasis daliklis, maži skaičiai.
    const a = atsitiktinis(6, didink(24, klase))
    const b = atsitiktinis(6, didink(24, klase))
    if (a === b) return null
    const d = nsd(a, b)
    if (d === 1) return null // atsakymas 1 nieko nepatikrina

    return uzdavinys('dalumas', {
      klausimas: `Koks didžiausias bendrasis daliklis skaičių ${a} ir ${b}?`,
      atsakymas: String(d),
      atsakymasRodymui: `$${d}$`,
      sprendimas: `${a} dalikliai: ${dalikliai(a).join(', ')}. ${b} dalikliai: ${dalikliai(
        b,
      ).join(', ')}. Didžiausias bendras — ${d}.`,
    })
  }

  if (lygis === 2) {
    // Mažiausias bendrasis kartotinis — tai, ko reikia bendravardikliniant.
    const platus = [2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24] as const
    const siauras = [2, 3, 4, 5, 6, 8, 9, 10, 12] as const
    const a = pasirink(vyresne(klase) ? platus : siauras)
    const b = pasirink(vyresne(klase) ? platus : siauras)
    if (a === b) return null
    const m = mbk(a, b)
    if (m > 60) return null

    return uzdavinys('dalumas', {
      klausimas: `Koks mažiausias bendrasis kartotinis skaičių ${a} ir ${b}?`,
      atsakymas: String(m),
      atsakymasRodymui: `$${m}$`,
      sprendimas: `${m} dalijasi ir iš ${a} ($${m} : ${a} = ${m / a}$), ir iš ${b} ($${m} : ${b} = ${
        m / b
      }$). Mažesnio tokio skaičiaus nėra.`,
    })
  }

  // 3 lygis — MBK trims skaičiams arba didesniems dviem.
  const a = atsitiktinis(8, didink(30, klase))
  const b = atsitiktinis(8, didink(30, klase))
  if (a === b) return null
  const m = mbk(a, b)
  if (m > 120 || m === a * b) return null

  return uzdavinys('dalumas', {
    klausimas: `Koks mažiausias bendrasis kartotinis skaičių ${a} ir ${b}?`,
    atsakymas: String(m),
    atsakymasRodymui: `$${m}$`,
    sprendimas: `$${a} \\cdot ${b} : ${nsd(a, b)} = ${m}$, nes didžiausias bendrasis daliklis yra ${nsd(
      a,
      b,
    )}.`,
  })
}
