import { atsitiktinis, nsd, pasirink, suprastink, trupmenaTeX } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { didink, vyresne } from './mastas'
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

export const greitis: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkGreiti(lygis, klase), A_GREITIS, 'greitis')

function kurkGreiti(lygis: Lygis, klase?: number): Uzdavinys | null {
  const v = pasirink([40, 50, 60, 70, 80, 90, 100, 110, 120] as const)
  const t = atsitiktinis(2, vyresne(klase) ? 12 : 6)
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
  if (isViso > 2000) return null

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

export const palukanos: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkPalukanas(lygis, klase), A_PALUKANOS, 'palukanos')

function kurkPalukanas(lygis: Lygis, klase?: number): Uzdavinys | null {
  const norma = vyresne(klase)
    ? pasirink([2, 3, 4, 5, 6, 8, 10, 12, 15, 20] as const)
    : pasirink([2, 4, 5, 10, 20] as const)
  const suma = atsitiktinis(1, didink(20, klase)) * 100
  const palukanu = (suma * norma) / 100
  if (!Number.isInteger(palukanu)) return null

  const visos = [
    // 1. Metinės palūkanos
    () =>
      uzdavinys('palukanos', {
        klausimas: `Indėlis ${suma} €, metinės palūkanos ${norma} %. Kiek palūkanų priskaičiuojama per metus?`,
        atsakymas: String(palukanu),
        atsakymasRodymui: `$${palukanu}$ €`,
        sprendimas: `$${suma} \\cdot ${norma} : 100 = ${palukanu}$ €.`,
      }),

    // 2. Suma po metų
    () =>
      uzdavinys('palukanos', {
        klausimas: `Indėlis ${suma} €, metinės palūkanos ${norma} %. Kiek pinigų bus sąskaitoje po metų?`,
        atsakymas: String(suma + palukanu),
        atsakymasRodymui: `$${suma + palukanu}$ €`,
        sprendimas: `Palūkanos $${palukanu}$ €, tad iš viso $${suma} + ${palukanu} = ${
          suma + palukanu
        }$ €.`,
      }),

    // 3. Kokia buvo pradinė suma
    () =>
      uzdavinys('palukanos', {
        klausimas: `Po metų prie indėlio priskaičiuota ${palukanu} € palūkanų, o metinė norma ${norma} %. Koks buvo indėlis?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$ €`,
        sprendimas: `$${palukanu} : ${norma} \\cdot 100 = ${suma}$ €.`,
      }),

    // 4. Kokia palūkanų norma
    () =>
      uzdavinys('palukanos', {
        klausimas: `Indėlis ${suma} €, po metų priskaičiuota ${palukanu} € palūkanų. Kokia metinė palūkanų norma procentais?`,
        atsakymas: String(norma),
        atsakymasRodymui: `$${norma}$ %`,
        sprendimas: `$${palukanu} : ${suma} \\cdot 100 = ${norma}$ %.`,
      }),

    // 5. Paskolos permoka
    () => {
      const metai = atsitiktinis(2, 5)
      const permoka = palukanu * metai
      return uzdavinys('palukanos', {
        klausimas: `Paskola ${suma} €, metinės palūkanos ${norma} %, mokamos kasmet nuo pradinės sumos. Kiek palūkanų bus sumokėta per ${metai} metus?`,
        atsakymas: String(permoka),
        atsakymasRodymui: `$${permoka}$ €`,
        sprendimas: `Kasmet $${palukanu}$ €, tad $${palukanu} \\cdot ${metai} = ${permoka}$ €.`,
      })
    },

    // 6. Sudėtinės palūkanos už dvejus metus
    () => {
      if (lygis === 1) return null
      const poPirmu = suma + palukanu
      const antruMetu = (poPirmu * norma) / 100
      if (!Number.isInteger(antruMetu)) return null
      return uzdavinys('palukanos', {
        klausimas: `Indėlis ${suma} €, metinės palūkanos ${norma} %, priskaičiuojamos kasmet prie sumos. Kiek pinigų bus po dvejų metų?`,
        atsakymas: String(poPirmu + antruMetu),
        atsakymasRodymui: `$${poPirmu + antruMetu}$ €`,
        sprendimas: `Po pirmų metų $${poPirmu}$ €. Antrų metų palūkanos $${poPirmu} \\cdot ${norma} : 100 = ${antruMetu}$ €, tad iš viso $${
          poPirmu + antruMetu
        }$ €.`,
      })
    },

    // 7. Kiek uždirbo sudėtinės palūkanos papildomai
    () => {
      if (!vyresne(klase)) return null
      const poPirmu = suma + palukanu
      const antruMetu = (poPirmu * norma) / 100
      if (!Number.isInteger(antruMetu)) return null
      const skirtumas = antruMetu - palukanu
      if (skirtumas <= 0) return null
      return uzdavinys('palukanos', {
        klausimas: `Indėlis ${suma} €, metinės palūkanos ${norma} %. Kiek daugiau uždirbama per antruosius metus, kai palūkanos priskaičiuojamos prie sumos, palyginti su pirmaisiais metais?`,
        atsakymas: String(skirtumas),
        atsakymasRodymui: `$${skirtumas}$ €`,
        sprendimas: `Pirmais metais $${palukanu}$ €, antrais $${antruMetu}$ €, tad skirtumas $${antruMetu} - ${palukanu} = ${skirtumas}$ €.`,
      })
    },

    // 8. Nuolaida ir PVM viename uždavinyje
    () => {
      if (!vyresne(klase)) return null
      const poNuolaidos = suma - palukanu
      const pvm = (poNuolaidos * 21) / 100
      if (!Number.isInteger(pvm)) return null
      return uzdavinys('palukanos', {
        klausimas: `Prekė be PVM kainuoja ${suma} €. Jai pritaikoma ${norma} % nuolaida, o tada pridedamas 21 % PVM. Kiek prekė kainuos?`,
        atsakymas: String(poNuolaidos + pvm),
        atsakymasRodymui: `$${poNuolaidos + pvm}$ €`,
        sprendimas: `Po nuolaidos $${suma} - ${palukanu} = ${poNuolaidos}$ €. PVM $${poNuolaidos} \\cdot 21 : 100 = ${pvm}$ €, tad iš viso $${
          poNuolaidos + pvm
        }$ €.`,
      })
    },
  ]

  if (lygis === 1) return variacija(visos.slice(0, 4))
  if (lygis === 2) return variacija(visos.slice(0, 6))
  return variacija(visos)
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

export const atvirkstinis: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkAtvirkstini(lygis, klase), A_ATVIRKSTINIS, 'atvirkstinis')

function kurkAtvirkstini(lygis: Lygis, klase?: number): Uzdavinys | null {
  // Sandauga parenkama pirma, iš jos imami abu dalikliai — taip abu
  // atsakymai garantuotai sveiki.
  const sandauga = vyresne(klase)
    ? pasirink([48, 60, 72, 90, 120, 144, 180, 240, 360] as const)
    : pasirink([24, 36, 48, 60, 72, 120] as const)
  const dalikliai: number[] = []
  const virsus = didink(20, klase)
  for (let d = 2; d <= virsus; d += 1) if (sandauga % d === 0) dalikliai.push(d)
  if (dalikliai.length < 2) return null

  const a = pasirink(dalikliai)
  const b = pasirink(dalikliai.filter((d) => d !== a))
  if (b === undefined) return null

  const t1 = sandauga / a
  const t2 = sandauga / b
  if (t1 > didink(60, klase) || t2 > didink(60, klase)) return null

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

export const vidurkis: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkVidurki(lygis, klase), A_VIDURKIS, 'vidurkis')

function kurkVidurki(lygis: Lygis, klase?: number): Uzdavinys | null {
  const kiek = lygis === 1 ? 4 : vyresne(klase) ? 7 : 5
  // Vidurkis parenkamas pirma, nariai išdėliojami aplink jį.
  const v = atsitiktinis(4, didink(12, klase))
  const nuokrypiai: number[] = []
  let suma = 0
  const sklaida = vyresne(klase) ? 6 : 3
  for (let i = 0; i < kiek - 1; i += 1) {
    const n = atsitiktinis(-sklaida, sklaida)
    nuokrypiai.push(n)
    suma += n
  }
  nuokrypiai.push(-suma) // paskutinis narys išlygina vidurkį

  const nariai = nuokrypiai.map((n) => v + n)
  if (nariai.some((n) => n <= 0 || n > didink(20, klase))) return null
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

export const tikimybe: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkTikimybe(lygis, klase), A_TIKIMYBE, 'tikimybe')

function kurkTikimybe(lygis: Lygis, klase?: number): Uzdavinys | null {
  const virsus = didink(8, klase)
  const raudoni = atsitiktinis(2, virsus)
  const melyni = atsitiktinis(2, virsus)
  const isViso = raudoni + melyni
  if (isViso > didink(20, klase)) return null

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

export const kombinatorika: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkKombinatorika(lygis, klase), A_KOMBINATORIKA, 'kombinatorika')

function faktorialas(n: number): number {
  let rez = 1
  for (let i = 2; i <= n; i += 1) rez *= i
  return rez
}

function kurkKombinatorika(lygis: Lygis, klase?: number): Uzdavinys | null {
  const a = atsitiktinis(2, didink(6, klase))
  const b = atsitiktinis(2, didink(6, klase))
  const n = atsitiktinis(4, didink(15, klase))

  const visos = [
    // 1. Daugybos taisyklė
    () =>
      uzdavinys('kombinatorika', {
        klausimas: `Mokinys turi ${a} marškinėlius ir ${b} kelnes. Keliais būdais jis gali apsirengti?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: `Pagal daugybos taisyklę $${a} \\cdot ${b} = ${a * b}$ būdai.`,
      }),

    // 2. Deriniai po du
    () => {
      const rez = (n * (n - 1)) / 2
      return uzdavinys('kombinatorika', {
        klausimas: `Keliais būdais iš ${n} knygų galima pasirinkti 2?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$\\dfrac{${n} \\cdot ${n - 1}}{2} = ${rez}$ būdai.`,
      })
    },

    // 3. Kėliniai
    () => {
      const k = atsitiktinis(3, vyresne(klase) ? 9 : 6)
      return uzdavinys('kombinatorika', {
        klausimas: `Keliais būdais galima sustatyti ${k} skirtingas knygas į eilę?`,
        atsakymas: String(faktorialas(k)),
        atsakymasRodymui: `$${faktorialas(k)}$`,
        sprendimas: `$${Array.from({ length: k }, (_, i) => k - i).join(' \\cdot ')} = ${faktorialas(
          k,
        )}$ būdai.`,
      })
    },

    // 4. Trijų nepriklausomų pasirinkimų daugyba
    () => {
      const c = atsitiktinis(2, didink(5, klase))
      return uzdavinys('kombinatorika', {
        klausimas: `Pusryčiams galima rinktis iš ${a} gėrimų, ${b} sumuštinių ir ${c} vaisių. Kiek skirtingų pusryčių derinių galima sudaryti?`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$`,
        sprendimas: `$${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$ deriniai.`,
      })
    },

    // 5. Rankos paspaudimai
    () => {
      const rez = (n * (n - 1)) / 2
      return uzdavinys('kombinatorika', {
        klausimas: `Susitiko ${n} draugai ir kiekvienas su kiekvienu pasisveikino ranka. Kiek buvo rankos paspaudimų?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Kiekvienas paspaudimas jungia du žmones: $\\dfrac{${n} \\cdot ${
          n - 1
        }}{2} = ${rez}$.`,
      })
    },

    // 6. Gretiniai (svarbi tvarka)
    () => {
      if (lygis === 1) return null
      const rez = n * (n - 1)
      return uzdavinys('kombinatorika', {
        klausimas: `Varžybose dalyvauja ${n} sportininkai. Keliais būdais gali pasiskirstyti pirmoji ir antroji vietos?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Pirmą vietą gali užimti ${n}, antrą — likę ${
          n - 1
        }: $${n} \\cdot ${n - 1} = ${rez}$.`,
      })
    },

    // 7. Kiek skirtingų kodų
    () => {
      if (lygis === 1) return null
      const ilgis = atsitiktinis(2, vyresne(klase) ? 5 : 3)
      const rez = 10 ** ilgis
      return uzdavinys('kombinatorika', {
        klausimas: `Kiek skirtingų ${ilgis} skaitmenų kodų galima sudaryti, jei skaitmenys gali kartotis?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Kiekvienoje pozicijoje po 10 galimybių: $10^${ilgis} = ${rez}$.`,
      })
    },

    // 8. Deriniai po tris
    () => {
      if (!vyresne(klase)) return null
      const k = atsitiktinis(5, 12)
      const rez = (k * (k - 1) * (k - 2)) / 6
      return uzdavinys('kombinatorika', {
        klausimas: `Keliais būdais iš ${k} mokinių galima išrinkti 3 narių komandą?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$\\dfrac{${k} \\cdot ${k - 1} \\cdot ${k - 2}}{6} = ${rez}$ būdai.`,
      })
    },
  ]

  if (lygis === 1) return variacija(visos.slice(0, 5))
  if (lygis === 2) return variacija(visos.slice(0, 7))
  return variacija(visos)
}
