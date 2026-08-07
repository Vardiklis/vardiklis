import { derink } from '../lietuviu'
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

  const visos = [
    // 1. Kelias iš greičio ir laiko
    () =>
      uzdavinys('greitis', {
        klausimas: `Automobilis važiavo ${t} valandas ${v} km/h greičiu. Kokį kelią jis nuvažiavo?`,
        atsakymas: String(s),
        atsakymasRodymui: `$${s}$ km`,
        sprendimas: `$s = v \\cdot t = ${v} \\cdot ${t} = ${s}$ km.`,
      }),

    // 2. Greitis iš kelio ir laiko
    () =>
      uzdavinys('greitis', {
        klausimas: `Automobilis nuvažiavo ${s} km per ${t} valandas. Koks buvo jo greitis?`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$ km/h`,
        sprendimas: `$v = \\dfrac{s}{t} = \\dfrac{${s}}{${t}} = ${v}$ km/h.`,
      }),

    // 3. Laikas iš kelio ir greičio
    () =>
      uzdavinys('greitis', {
        klausimas: `Automobilis nuvažiavo ${s} km ${v} km/h greičiu. Kiek valandų truko kelionė?`,
        atsakymas: String(t),
        atsakymasRodymui: `$${t}$ val.`,
        sprendimas: `$t = \\dfrac{s}{v} = \\dfrac{${s}}{${v}} = ${t}$ val.`,
      }),

    // 4. Kelionė iš dviejų atkarpų — bendras kelias
    () => {
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
    },

    // 5. Vidutinis greitis
    () => {
      const v2 = pasirink([40, 50, 60, 80, 100] as const)
      const t2 = atsitiktinis(1, 5)
      const kelias = s + v2 * t2
      const laikas = t + t2
      if (kelias % laikas !== 0) return null
      const vidutinis = kelias / laikas
      if (vidutinis === v || vidutinis === v2) return null
      return uzdavinys('greitis', {
        klausimas: `Automobilis ${t} valandas važiavo ${v} km/h greičiu, o paskui ${t2} valandas — ${v2} km/h greičiu. Koks buvo jo vidutinis greitis?`,
        atsakymas: String(vidutinis),
        atsakymasRodymui: `$${vidutinis}$ km/h`,
        sprendimas: `Visas kelias $${s} + ${
          v2 * t2
        } = ${kelias}$ km, visas laikas $${t} + ${t2} = ${laikas}$ val. Vidutinis greitis $\\dfrac{${kelias}}{${laikas}} = ${vidutinis}$ km/h.`,
      })
    },

    // 6. Pėsčiojo greitis metrais per minutę
    () => {
      const metrai = pasirink([60, 70, 80, 90, 100] as const)
      const minutes = atsitiktinis(5, 40)
      return uzdavinys('greitis', {
        klausimas: `Pėsčiasis eina ${metrai} m/min greičiu. Kokį kelią jis nueis per ${minutes} minutes?`,
        atsakymas: String(metrai * minutes),
        atsakymasRodymui: `$${metrai * minutes}$ m`,
        sprendimas: `$${metrai} \\cdot ${minutes} = ${metrai * minutes}$ m.`,
      })
    },

    // 7. Susitikimas — du objektai juda vienas priešais kitą
    () => {
      if (lygis === 1) return null
      const v2 = pasirink([40, 50, 60, 70] as const)
      const atstumas = (v + v2) * t
      if (atstumas > 2000) return null
      return uzdavinys('greitis', {
        klausimas: `Iš dviejų miestų vienas priešais kitą išvažiavo du automobiliai: vieno greitis ${v} km/h, kito — ${v2} km/h. Jie susitiko po ${t} valandų. Koks atstumas tarp miestų?`,
        atsakymas: String(atstumas),
        atsakymasRodymui: `$${atstumas}$ km`,
        sprendimas: `Suartėjimo greitis $${v} + ${v2} = ${
          v + v2
        }$ km/h, tad atstumas $${v + v2} \\cdot ${t} = ${atstumas}$ km.`,
      })
    },

    // 8. Ar greitis tikroviškas
    () => {
      if (lygis === 1) return null
      const nerealu = Math.random() < 0.5
      const greitisKmH = nerealu ? atsitiktinis(300, 900) : atsitiktinis(40, 120)
      return uzdavinys('greitis', {
        klausimas: `Mokinys apskaičiavo, kad automobilis mieste važiavo ${greitisKmH} km/h greičiu. Ar toks greitis tikroviškas? Rašyk „taip" arba „ne".`,
        atsakymas: nerealu ? 'ne' : 'taip',
        atsakymasRodymui: nerealu ? 'ne' : 'taip',
        sprendimas: nerealu
          ? `Ne. Automobiliai taip greitai nevažiuoja — greičiausiai skaičiuojant padaryta klaida.`
          : `Taip. ${greitisKmH} km/h yra įprastas automobilio greitis.`,
      })
    },

    // 9. Vienetų keitimas
    () => {
      if (lygis === 1) return null
      const kmH = pasirink([36, 54, 72, 90, 108] as const)
      return uzdavinys('greitis', {
        klausimas: `Greitis ${kmH} km/h. Kiek tai metrų per sekundę?`,
        atsakymas: String(kmH / 3.6),
        atsakymasRodymui: `$${kmH / 3.6}$ m/s`,
        sprendimas: `Vienoje valandoje 3600 s, viename kilometre 1000 m, tad $${kmH} : 3{,}6 = ${
          kmH / 3.6
        }$ m/s.`,
      })
    },

    // 10. Vejasi — skirtuminis greitis
    () => {
      if (lygis === 1) return null
      const v2 = v - pasirink([10, 20, 30] as const)
      if (v2 < 20) return null
      const atsilikimas = (v - v2) * t
      return uzdavinys('greitis', {
        klausimas: `Dviratininkas važiuoja ${v2} km/h greičiu, o motociklininkas jį veja ${v} km/h greičiu. Per kiek valandų motociklininkas panaikins ${atsilikimas} km atsilikimą?`,
        atsakymas: String(t),
        atsakymasRodymui: `$${t}$ val.`,
        sprendimas: `Suartėjimo greitis $${v} - ${v2} = ${
          v - v2
        }$ km/h, tad $${atsilikimas} : ${v - v2} = ${t}$ val.`,
      })
    },
  ]

  // Lengvesniam lygiui — tik pirmieji 6 pavidalai; sunkesniam visi.
  return variacija(lygis === 1 ? visos.slice(0, 6) : visos)
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

  // Lengvesniam lygiui — tik pirmieji 4 pavidalai; sunkesniam visi.
  return variacija(lygis === 1 ? visos.slice(0, 4) : visos)
}

/** Skaitvardžių derinimas atvirkštinio proporcingumo sąlygose. */
const DARBININKAI = { vns: 'darbininkas', dgs: 'darbininkai', kilm: 'darbininkų' }
const SIURBLIAI = { vns: 'siurblys', dgs: 'siurbliai', kilm: 'siurblių' }
const DIENOS = { vns: 'dieną', dgs: 'dienas', kilm: 'dienų' }
const DIENOS_V = { vns: 'diena', dgs: 'dienos', kilm: 'dienų' }
const VALANDOS_G = { vns: 'valandą', dgs: 'valandas', kilm: 'valandų' }
const VALANDOS_V = { vns: 'valanda', dgs: 'valandos', kilm: 'valandų' }
const PAKUOTES_V = { vns: 'pakuotė', dgs: 'pakuotės', kilm: 'pakuočių' }

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

  return variacija([
    // 1. Darbininkai ir dienos
    () =>
      uzdavinys('atvirkstinis', {
        klausimas: `${a} ${derink(a, DARBININKAI)} darbą atlieka per ${t1} ${derink(t1, DIENOS)}. Per kiek dienų tą patį darbą atliktų ${b} ${derink(b, DARBININKAI)}?`,
        atsakymas: String(t2),
        atsakymasRodymui: `$${t2}$ d.`,
        sprendimas: `Darbo apimtis $${a} \\cdot ${t1} = ${sandauga}$, tad $${sandauga} : ${b} = ${t2}$ ${derink(t2, DIENOS_V)}.`,
      }),

    // 2. Greitis ir kelionės trukmė
    () =>
      uzdavinys('atvirkstinis', {
        klausimas: `Kai greitis ${a} km/h, kelionė trunka ${t1} ${derink(t1, VALANDOS_G)}. Kiek valandų truks kelionė, jei greitis bus ${b} km/h?`,
        atsakymas: String(t2),
        atsakymasRodymui: `$${t2}$ val.`,
        sprendimas: `Kelias yra $${a} \\cdot ${t1} = ${sandauga}$ km, tad $${sandauga} : ${b} = ${t2}$ ${derink(t2, VALANDOS_V)}.`,
      }),

    // 3. Atvirkštinis klausimas — ieškomas ne laikas, o kiekis
    () =>
      uzdavinys('atvirkstinis', {
        klausimas: `${a} vienodi siurbliai baseiną pripildo per ${t1} ${derink(t1, VALANDOS_G)}. Kiek siurblių reikia, kad baseinas būtų pripildytas per ${t2} ${derink(t2, VALANDOS_G)}?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Bendras darbas $${a} \\cdot ${t1} = ${sandauga}$, tad $${sandauga} : ${t2} = ${b}$ ${derink(b, SIURBLIAI)}.`,
      }),

    // 4. Pastovioji sandauga — pati atvirkštinio proporcingumo esmė
    () => {
      if (lygis === 1) return null
      return uzdavinys('atvirkstinis', {
        klausimas: `Dydžiai atvirkščiai proporcingi: kai vienas lygus ${a}, kitas lygus ${t1}. Kokia jų sandauga?`,
        atsakymas: String(sandauga),
        atsakymasRodymui: `$${sandauga}$`,
        sprendimas: `Atvirkščiai proporcingų dydžių sandauga pastovi: $${a} \\cdot ${t1} = ${sandauga}$.`,
      })
    },

    // 5. Pakuočių dydis ir kiekis
    () =>
      uzdavinys('atvirkstinis', {
        klausimas: `${sandauga} saldainių sudėta į pakuotes po ${a}. Kiek gausis pakuočių, jei į kiekvieną dėsime po ${b}?`,
        atsakymas: String(t2),
        atsakymasRodymui: `$${t2}$`,
        sprendimas: `$${sandauga} : ${b} = ${t2}$ ${derink(t2, PAKUOTES_V)}.`,
      }),

    // 6. Kiek kartų pasikeis antrasis dydis
    () => {
      if (lygis === 1 || t2 === 0 || t1 % t2 !== 0) return null
      return uzdavinys('atvirkstinis', {
        klausimas: `Dydžiai atvirkščiai proporcingi. Pirmasis padidėjo nuo ${a} iki ${b}. Kiek kartų sumažėjo antrasis?`,
        atsakymas: String(t1 / t2),
        atsakymasRodymui: `$${t1 / t2}$`,
        sprendimas: `Antrasis krito nuo ${t1} iki ${t2}: $${t1} : ${t2} = ${t1 / t2}$ kartus.`,
      })
    },
  ])
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

  const nariuSuma = nariai.reduce((a, b) => a + b, 0)
  const surikiuoti = [...nariai].sort((a, b) => a - b)

  return variacija([
    // 1. Aritmetinis vidurkis
    () =>
      uzdavinys('vidurkis', {
        klausimas: `Apskaičiuok skaičių $${nariai.join(', ')}$ aritmetinį vidurkį.`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$`,
        sprendimas: `Suma $${nariuSuma}$, narių ${kiek}, tad $${nariuSuma} : ${kiek} = ${v}$.`,
      }),

    // 2. Mediana
    () => {
      if (lygis === 1) return null
      const mediana = surikiuoti[Math.floor(surikiuoti.length / 2)]
      return uzdavinys('vidurkis', {
        klausimas: `Kokia yra skaičių $${nariai.join(', ')}$ mediana?`,
        atsakymas: String(mediana),
        atsakymasRodymui: `$${mediana}$`,
        sprendimas: `Surikiavus: $${surikiuoti.join(', ')}$. Viduryje stovi ${mediana}.`,
      })
    },

    // 3. Trūkstamas narys pagal žinomą vidurkį — atvirkštinis veiksmas
    () => {
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
    },

    // 4. Skaičių suma pagal vidurkį
    () =>
      uzdavinys('vidurkis', {
        klausimas: `${kiek} skaičių aritmetinis vidurkis yra ${v}. Kokia visų šių skaičių suma?`,
        atsakymas: String(v * kiek),
        atsakymasRodymui: `$${v * kiek}$`,
        sprendimas: `Suma yra vidurkis, padaugintas iš narių skaičiaus: $${v} \\cdot ${kiek} = ${v * kiek}$.`,
      }),

    // 5. Sklaidos plotis
    () => {
      if (lygis === 1) return null
      const plotis = surikiuoti[surikiuoti.length - 1] - surikiuoti[0]
      if (plotis === 0) return null
      return uzdavinys('vidurkis', {
        klausimas: `Kuo skiriasi didžiausias ir mažiausias iš skaičių $${nariai.join(', ')}$?`,
        atsakymas: String(plotis),
        atsakymasRodymui: `$${plotis}$`,
        sprendimas: `$${surikiuoti[surikiuoti.length - 1]} - ${surikiuoti[0]} = ${plotis}$.`,
      })
    },

    // 6. Kiek narių viršija vidurkį
    () => {
      const virs = nariai.filter((n) => n > v).length
      if (virs === 0) return null
      return uzdavinys('vidurkis', {
        klausimas: `Skaičių $${nariai.join(', ')}$ vidurkis yra ${v}. Kiek iš jų yra didesni už vidurkį?`,
        atsakymas: String(virs),
        atsakymasRodymui: `$${virs}$`,
        sprendimas: `Už ${v} didesni yra ${nariai.filter((n) => n > v).join(', ')} — iš viso ${virs}.`,
      })
    },
  ])
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

  const tR = suprastink(raudoni, isViso)
  const tM = suprastink(melyni, isViso)
  if (tR.vardiklis > 20 || tM.vardiklis > 20) return null
  const deze = `Dėžėje ${raudoni} raudoni ir ${melyni} mėlyni rutuliai.`

  return variacija([
    // 1. Palanki baigtis
    () => {
      // Lengvesniame lygyje trupmenos prastinti nereikia.
      if (lygis === 1 && nsd(raudoni, isViso) !== 1) return null
      return uzdavinys('tikimybe', {
        klausimas: `${deze} Kokia tikimybė ištraukti raudoną? Įrašyk trupmena.`,
        atsakymas: `${tR.skaitiklis}/${tR.vardiklis}`,
        atsakymasRodymui: `$${trupmenaTeX(tR)}$`,
        sprendimas: `Palankių baigčių ${raudoni}, visų — ${isViso}, tad tikimybė $${trupmenaTeX(tR)}$.`,
      })
    },

    // 2. Priešingas įvykis
    () =>
      uzdavinys('tikimybe', {
        klausimas: `${deze} Kokia tikimybė ištraukti NE raudoną? Įrašyk trupmena.`,
        atsakymas: `${tM.skaitiklis}/${tM.vardiklis}`,
        atsakymasRodymui: `$${trupmenaTeX(tM)}$`,
        sprendimas: `Ne raudonų yra ${melyni} iš ${isViso}, tad tikimybė $${trupmenaTeX(tM)}$.`,
      }),

    // 3. Visų baigčių skaičius — be jo tikimybės vardiklis lieka nesuprastas
    () =>
      uzdavinys('tikimybe', {
        klausimas: `${deze} Kiek iš viso yra galimų baigčių traukiant vieną rutulį?`,
        atsakymas: String(isViso),
        atsakymasRodymui: `$${isViso}$`,
        sprendimas: `$${raudoni} + ${melyni} = ${isViso}$ — tiek rutulių, tiek ir baigčių.`,
      }),

    // 4. Kiek rutulių reikia pridėti, kad tikimybė taptų 1/2
    () => {
      if (lygis === 1 || raudoni === melyni) return null
      const [maziau, daugiau] = raudoni < melyni ? [raudoni, melyni] : [melyni, raudoni]
      return uzdavinys('tikimybe', {
        klausimas: `${deze} Kiek rutulių reikia pridėti, kad abiejų spalvų būtų po lygiai?`,
        atsakymas: String(daugiau - maziau),
        atsakymasRodymui: `$${daugiau - maziau}$`,
        sprendimas: `$${daugiau} - ${maziau} = ${daugiau - maziau}$.`,
      })
    },

    // 5. Negalimas įvykis
    () => {
      if (lygis === 1) return null
      return uzdavinys('tikimybe', {
        klausimas: `${deze} Kokia tikimybė ištraukti žalią rutulį? Įrašyk skaičių.`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Žalių rutulių dėžėje nėra, tad įvykis negalimas — tikimybė 0.',
      })
    },

    // 6. Būtinas įvykis
    () => {
      if (lygis === 1) return null
      return uzdavinys('tikimybe', {
        klausimas: `${deze} Kokia tikimybė ištraukti raudoną arba mėlyną rutulį? Įrašyk skaičių.`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Kitokių rutulių dėžėje nėra, tad įvykis būtinas — tikimybė 1.',
      })
    },
  ])
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

  // Lengvesniam lygiui — tik pirmieji 5 pavidalai; sunkesniam visi.
  return variacija(lygis === 1 ? visos.slice(0, 5) : visos)
}
