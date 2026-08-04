import { atsitiktinis, nsd, pasirink, suprastink, trupmenaTeX } from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Taikomieji uždaviniai: greitis, palūkanos, atvirkštinis proporcingumas,
 * vidurkis, tikimybė, kombinatorika.
 *
 * Visose sąlygose skaičiai parenkami taip, kad atsakymas būtų sveikas arba
 * tvarkinga trupmena — kitaip uždavinys nustoja tikrinti temą ir pradeda
 * tikrinti dalybą kableliais.
 */

// ── Kelias, laikas, greitis ─────────────────────────────────────────────────

const A_GREITIS = [
  {
    klausimas: 'Automobilis važiavo 3 valandas 80 km/h greičiu. Kokį kelią jis nuvažiavo?',
    atsakymas: '240',
    atsakymasRodymui: '$240$ km',
    sprendimas: '$s = v \\cdot t = 80 \\cdot 3 = 240$ km.',
  },
] as const

export const greitis: Generatorius = (lygis) =>
  suBandymais(() => kurkGreiti(lygis), A_GREITIS, 'greitis')

function kurkGreiti(lygis: Lygis): Uzdavinys | null {
  const v = pasirink([40, 50, 60, 70, 80, 90, 100] as const)
  const t = atsitiktinis(2, 6)
  const s = v * t

  if (lygis === 1) {
    return uzdavinys('greitis', {
      klausimas: `Automobilis važiavo ${t} valandas ${v} km/h greičiu. Kokį kelią jis nuvažiavo?`,
      atsakymas: String(s),
      atsakymasRodymui: `$${s}$ km`,
      sprendimas: `$s = v \\cdot t = ${v} \\cdot ${t} = ${s}$ km.`,
    })
  }

  if (lygis === 2) {
    return uzdavinys('greitis', {
      klausimas: `Automobilis nuvažiavo ${s} km per ${t} valandas. Koks buvo jo greitis?`,
      atsakymas: String(v),
      atsakymasRodymui: `$${v}$ km/h`,
      sprendimas: `$v = \\dfrac{s}{t} = \\dfrac{${s}}{${t}} = ${v}$ km/h.`,
    })
  }

  // 3 lygis — kelionė iš dviejų atkarpų.
  const v2 = pasirink([40, 50, 60, 80] as const)
  const t2 = atsitiktinis(1, 4)
  const isViso = s + v2 * t2
  if (isViso > 900) return null

  return uzdavinys('greitis', {
    klausimas: `Automobilis ${t} valandas važiavo ${v} km/h greičiu, o paskui dar ${t2} valandas ${v2} km/h greičiu. Kokį kelią jis nuvažiavo iš viso?`,
    atsakymas: String(isViso),
    atsakymasRodymui: `$${isViso}$ km`,
    sprendimas: `Pirma dalis: $${v} \\cdot ${t} = ${s}$ km. Antra dalis: $${v2} \\cdot ${t2} = ${
      v2 * t2
    }$ km. Iš viso $${s} + ${v2 * t2} = ${isViso}$ km.`,
  })
}

// ── Palūkanos ───────────────────────────────────────────────────────────────

const A_PALUKANOS = [
  {
    klausimas: 'Indėlis 500 €, metinės palūkanos 4 %. Kiek palūkanų priskaičiuojama per metus?',
    atsakymas: '20',
    atsakymasRodymui: '$20$ €',
    sprendimas: '$500 \\cdot 4 : 100 = 20$ €.',
  },
] as const

export const palukanos: Generatorius = (lygis) =>
  suBandymais(() => kurkPalukanas(lygis), A_PALUKANOS, 'palukanos')

function kurkPalukanas(lygis: Lygis): Uzdavinys | null {
  const norma = pasirink([2, 4, 5, 10, 20] as const)
  const suma = atsitiktinis(1, 20) * 100
  const palukanu = (suma * norma) / 100
  if (!Number.isInteger(palukanu)) return null

  if (lygis === 1) {
    return uzdavinys('palukanos', {
      klausimas: `Indėlis ${suma} €, metinės palūkanos ${norma} %. Kiek palūkanų priskaičiuojama per metus?`,
      atsakymas: String(palukanu),
      atsakymasRodymui: `$${palukanu}$ €`,
      sprendimas: `$${suma} \\cdot ${norma} : 100 = ${palukanu}$ €.`,
    })
  }

  if (lygis === 2) {
    return uzdavinys('palukanos', {
      klausimas: `Indėlis ${suma} €, metinės palūkanos ${norma} %. Kiek pinigų bus sąskaitoje po metų?`,
      atsakymas: String(suma + palukanu),
      atsakymasRodymui: `$${suma + palukanu}$ €`,
      sprendimas: `Palūkanos $${palukanu}$ €, tad iš viso $${suma} + ${palukanu} = ${
        suma + palukanu
      }$ €.`,
    })
  }

  // 3 lygis — sudėtinės palūkanos už dvejus metus.
  const poPirmu = suma + palukanu
  const antruMetu = (poPirmu * norma) / 100
  if (!Number.isInteger(antruMetu)) return null
  const galutine = poPirmu + antruMetu

  return uzdavinys('palukanos', {
    klausimas: `Indėlis ${suma} €, metinės palūkanos ${norma} %, priskaičiuojamos kasmet prie sumos. Kiek pinigų bus po dvejų metų?`,
    atsakymas: String(galutine),
    atsakymasRodymui: `$${galutine}$ €`,
    sprendimas: `Po pirmų metų $${poPirmu}$ €. Antrų metų palūkanos $${poPirmu} \\cdot ${norma} : 100 = ${antruMetu}$ €, tad iš viso $${galutine}$ €.`,
  })
}

// ── Atvirkštinis proporcingumas ─────────────────────────────────────────────

const A_ATVIRKSTINIS = [
  {
    klausimas: '6 darbininkai darbą atlieka per 10 dienų. Per kiek dienų tą patį darbą atliktų 4 darbininkai?',
    atsakymas: '15',
    atsakymasRodymui: '$15$ d.',
    sprendimas: 'Darbo apimtis $6 \\cdot 10 = 60$, tad $60 : 4 = 15$ dienų.',
  },
] as const

export const atvirkstinis: Generatorius = (lygis) =>
  suBandymais(() => kurkAtvirkstini(lygis), A_ATVIRKSTINIS, 'atvirkstinis')

function kurkAtvirkstini(lygis: Lygis): Uzdavinys | null {
  // Sandauga parenkama pirma, iš jos imami abu dalikliai — taip abu
  // atsakymai garantuotai sveiki.
  const sandauga = pasirink([24, 36, 48, 60, 72, 120] as const)
  const dalikliai: number[] = []
  for (let d = 2; d <= 20; d += 1) if (sandauga % d === 0) dalikliai.push(d)
  if (dalikliai.length < 2) return null

  const a = pasirink(dalikliai)
  const b = pasirink(dalikliai.filter((d) => d !== a))
  if (b === undefined) return null

  const t1 = sandauga / a
  const t2 = sandauga / b
  if (t1 > 60 || t2 > 60) return null

  if (lygis === 1) {
    return uzdavinys('atvirkstinis', {
      klausimas: `${a} darbininkai darbą atlieka per ${t1} dienas. Per kiek dienų tą patį darbą atliktų ${b} darbininkai?`,
      atsakymas: String(t2),
      atsakymasRodymui: `$${t2}$ d.`,
      sprendimas: `Darbo apimtis $${a} \\cdot ${t1} = ${sandauga}$, tad $${sandauga} : ${b} = ${t2}$ dienos.`,
    })
  }

  if (lygis === 2) {
    return uzdavinys('atvirkstinis', {
      klausimas: `Kai greitis ${a} km/h, kelionė trunka ${t1} valandas. Kiek valandų truks kelionė, jei greitis bus ${b} km/h?`,
      atsakymas: String(t2),
      atsakymasRodymui: `$${t2}$ val.`,
      sprendimas: `Kelias yra $${a} \\cdot ${t1} = ${sandauga}$ km, tad $${sandauga} : ${b} = ${t2}$ valandos.`,
    })
  }

  return uzdavinys('atvirkstinis', {
    klausimas: `${a} vienodų siurblių baseiną pripildo per ${t1} valandas. Kiek siurblių reikia, kad baseinas būtų pripildytas per ${t2} valandas?`,
    atsakymas: String(b),
    atsakymasRodymui: `$${b}$`,
    sprendimas: `Bendras darbas $${a} \\cdot ${t1} = ${sandauga}$, tad $${sandauga} : ${t2} = ${b}$ siurbliai.`,
  })
}

// ── Vidurkis ir duomenys ────────────────────────────────────────────────────

const A_VIDURKIS = [
  {
    klausimas: 'Apskaičiuok skaičių $4, 7, 9, 8$ aritmetinį vidurkį.',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: '$(4 + 7 + 9 + 8) : 4 = 28 : 4 = 7$.',
  },
] as const

export const vidurkis: Generatorius = (lygis) =>
  suBandymais(() => kurkVidurki(lygis), A_VIDURKIS, 'vidurkis')

function kurkVidurki(lygis: Lygis): Uzdavinys | null {
  const kiek = lygis === 1 ? 4 : 5
  // Vidurkis parenkamas pirma, nariai išdėliojami aplink jį.
  const v = atsitiktinis(4, 12)
  const nuokrypiai: number[] = []
  let suma = 0
  for (let i = 0; i < kiek - 1; i += 1) {
    const n = atsitiktinis(-3, 3)
    nuokrypiai.push(n)
    suma += n
  }
  nuokrypiai.push(-suma) // paskutinis narys išlygina vidurkį

  const nariai = nuokrypiai.map((n) => v + n)
  if (nariai.some((n) => n <= 0 || n > 20)) return null
  if (new Set(nariai).size < 3) return null

  if (lygis === 3) {
    // Trūkstamas narys pagal žinomą vidurkį.
    const trukstamas = nariai[nariai.length - 1]
    const matomi = nariai.slice(0, -1)
    return uzdavinys('vidurkis', {
      klausimas: `Skaičių $${matomi.join(', ')}$ ir dar vieno skaičiaus aritmetinis vidurkis yra ${v}. Koks tas skaičius?`,
      atsakymas: String(trukstamas),
      atsakymasRodymui: `$${trukstamas}$`,
      sprendimas: `Visų ${kiek} skaičių suma turi būti $${v} \\cdot ${kiek} = ${
        v * kiek
      }$. Matomų suma $${matomi.reduce((a, b) => a + b, 0)}$, tad trūksta ${trukstamas}.`,
    })
  }

  if (lygis === 2) {
    const surikiuoti = [...nariai].sort((a, b) => a - b)
    const mediana = surikiuoti[Math.floor(surikiuoti.length / 2)]
    return uzdavinys('vidurkis', {
      klausimas: `Kokia yra skaičių $${nariai.join(', ')}$ mediana?`,
      atsakymas: String(mediana),
      atsakymasRodymui: `$${mediana}$`,
      sprendimas: `Surikiavus: $${surikiuoti.join(', ')}$. Viduryje stovi ${mediana}.`,
    })
  }

  return uzdavinys('vidurkis', {
    klausimas: `Apskaičiuok skaičių $${nariai.join(', ')}$ aritmetinį vidurkį.`,
    atsakymas: String(v),
    atsakymasRodymui: `$${v}$`,
    sprendimas: `$(${nariai.join(' + ')}) : ${kiek} = ${v * kiek} : ${kiek} = ${v}$.`,
  })
}

// ── Tikimybė ────────────────────────────────────────────────────────────────

const A_TIKIMYBE = [
  {
    klausimas:
      'Dėžėje 3 raudoni ir 5 mėlyni rutuliai. Kokia tikimybė ištraukti raudoną? Įrašyk trupmena.',
    atsakymas: '3/8',
    atsakymasRodymui: '$\\dfrac{3}{8}$',
    sprendimas: 'Palankių baigčių 3, visų — 8, tad tikimybė $\\dfrac{3}{8}$.',
  },
] as const

export const tikimybe: Generatorius = (lygis) =>
  suBandymais(() => kurkTikimybe(lygis), A_TIKIMYBE, 'tikimybe')

function kurkTikimybe(lygis: Lygis): Uzdavinys | null {
  const raudoni = atsitiktinis(2, 8)
  const melyni = atsitiktinis(2, 8)
  const isViso = raudoni + melyni
  if (isViso > 20) return null

  if (lygis === 3) {
    // Priešingas įvykis.
    const t = suprastink(melyni, isViso)
    if (t.vardiklis > 20) return null
    return uzdavinys('tikimybe', {
      klausimas: `Dėžėje ${raudoni} raudoni ir ${melyni} mėlyni rutuliai. Kokia tikimybė ištraukti NE raudoną? Įrašyk trupmena.`,
      atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
      atsakymasRodymui: `$${trupmenaTeX(t)}$`,
      sprendimas: `Ne raudonų yra ${melyni} iš ${isViso}, tad tikimybė $${trupmenaTeX(t)}$.`,
    })
  }

  const t = suprastink(raudoni, isViso)
  if (t.vardiklis > 20) return null
  if (lygis === 1 && nsd(raudoni, isViso) !== 1) return null // 1 lygyje be prastinimo

  return uzdavinys('tikimybe', {
    klausimas: `Dėžėje ${raudoni} raudoni ir ${melyni} mėlyni rutuliai. Kokia tikimybė ištraukti raudoną? Įrašyk trupmena.`,
    atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
    atsakymasRodymui: `$${trupmenaTeX(t)}$`,
    sprendimas: `Palankių baigčių ${raudoni}, visų — ${isViso}, tad tikimybė $${trupmenaTeX(t)}$.`,
  })
}

// ── Kombinatorika ───────────────────────────────────────────────────────────

const A_KOMBINATORIKA = [
  {
    klausimas: 'Keliais būdais iš 5 knygų galima pasirinkti 2?',
    atsakymas: '10',
    atsakymasRodymui: '$10$',
    sprendimas: '$\\dfrac{5 \\cdot 4}{2} = 10$ būdai.',
  },
] as const

export const kombinatorika: Generatorius = (lygis) =>
  suBandymais(() => kurkKombinatorika(lygis), A_KOMBINATORIKA, 'kombinatorika')

function kurkKombinatorika(lygis: Lygis): Uzdavinys | null {
  if (lygis === 1) {
    // Daugybos taisyklė.
    const a = atsitiktinis(2, 6)
    const b = atsitiktinis(2, 6)
    return uzdavinys('kombinatorika', {
      klausimas: `Mokinys turi ${a} marškinėlius ir ${b} kelnes. Keliais būdais jis gali apsirengti?`,
      atsakymas: String(a * b),
      atsakymasRodymui: `$${a * b}$`,
      sprendimas: `Pagal daugybos taisyklę $${a} \\cdot ${b} = ${a * b}$ būdai.`,
    })
  }

  if (lygis === 2) {
    // Deriniai po du.
    const n = atsitiktinis(4, 15)
    const rez = (n * (n - 1)) / 2
    return uzdavinys('kombinatorika', {
      klausimas: `Keliais būdais iš ${n} knygų galima pasirinkti 2?`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$`,
      sprendimas: `$\\dfrac{${n} \\cdot ${n - 1}}{2} = ${rez}$ būdai.`,
    })
  }

  // 3 lygis — kėliniai.
  const n = atsitiktinis(3, 8)
  let rez = 1
  for (let i = 2; i <= n; i += 1) rez *= i

  return uzdavinys('kombinatorika', {
    klausimas: `Keliais būdais galima sustatyti ${n} skirtingas knygas į eilę?`,
    atsakymas: String(rez),
    atsakymasRodymui: `$${rez}$`,
    sprendimas: `$${Array.from({ length: n }, (_, i) => n - i).join(' \\cdot ')} = ${rez}$ būdai.`,
  })
}
