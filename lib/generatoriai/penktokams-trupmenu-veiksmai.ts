import { mbk, nsd, atsitiktinis, naujasId, pasirink, suprastink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { VARDAI } from './ketvirtokams-bendra'
import { dviJuostos, trupmenosJuosta } from './treciokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 5 klasės tema „Veiksmai su paprastosiomis trupmenomis ir mišriaisiais
 * skaičiais“ — dvylika potemių.
 *
 * Programoje trys potemių poros vadinasi vienodai — „Palyginame“, „Sudedame“,
 * „Atimame“ — ir anksčiau abi poros gaudavo tą patį generatorių. Bet pirmoji
 * pora yra apie vienodus vardiklius, o antroji — apie skirtingus, kur pirma
 * reikia bendravardiklinti. Tai du skirtingi gebėjimai, tad ir generatoriai
 * atskiri: pirmieji niekada neduoda skirtingų vardiklių, antrieji — visada.
 */

function tr(sk: number, vd: number): string {
  return `\\dfrac{${sk}}{${vd}}`
}

function mis(sveikas: number, sk: number, vd: number): string {
  return sk === 0 ? String(sveikas) : `${sveikas}${tr(sk, vd)}`
}

/** Atsakymas normalizavimui: mišrusis arba paprastoji trupmena. */
function ats(sveikas: number, sk: number, vd: number): string {
  if (sk === 0) return String(sveikas)
  return sveikas === 0 ? `${sk}/${vd}` : `${sveikas} ${sk}/${vd}`
}

/** Trupmena iš dalių skaičiaus. */
function isDaliu(daliu: number, vd: number): { s: number; k: number } {
  return { s: Math.floor(daliu / vd), k: daliu % vd }
}

// ── 5.1.1. Palyginame (vienodi vardikliai) ──────────────────────────────────

const T1 = 'trupmenu-palyginimas-vienodi'

const A_PALYGINIMAS = [
  {
    klausimas: 'Kuri trupmena didesnė: $\\dfrac{3}{8}$ ar $\\dfrac{5}{8}$?',
    atsakymas: '5/8',
    atsakymasRodymui: '$\\dfrac{5}{8}$',
    sprendimas: 'Vardikliai vienodi, tad didesnė ta, kurios skaitiklis didesnis.',
  },
] as const

export const trupmenuPalyginimasVienodi: Generatorius = () =>
  suBandymais(kurkPalyginima, A_PALYGINIMAS, T1)

function kurkPalyginima(): Uzdavinys | null {
  const vd = atsitiktinis(5, 16)
  const a = atsitiktinis(1, vd - 1)
  const b = atsitiktinis(1, vd - 1)
  if (a === b) return null

  return variacija([
    // 1. Kuri didesnė
    () =>
      uzdavinys(T1, {
        klausimas: `Kuri trupmena didesnė: $${tr(a, vd)}$ ar $${tr(b, vd)}$?`,
        atsakymas: `${Math.max(a, b)}/${vd}`,
        atsakymasRodymui: `$${tr(Math.max(a, b), vd)}$`,
        sprendimas: 'Vardikliai vienodi, tad dalys vienodo dydžio — didesnė ta trupmena, kurios dalių daugiau.',
      }),

    // 2. Palyginimas su vienetu
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Palygink $${tr(a, vd)}$ su vienetu.`,
        variantai: ['mažesnė už 1', 'didesnė už 1', 'lygi 1'],
        teisingas: 0,
        sprendimas: `Skaitiklis ${a} mažesnis už vardiklį ${vd}, tad trupmena mažesnė už vienetą.`,
      }),

    // 3. Iš juostų
    () =>
      uzdavinys(T1, {
        klausimas: 'Kuri iš pavaizduotų trupmenų didesnė? Užrašyk ją.',
        atsakymas: `${Math.max(a, b)}/${vd}`,
        atsakymasRodymui: `$${tr(Math.max(a, b), vd)}$`,
        sprendimas: 'Juostos vienodo ilgio ir padalytos į vienodas dalis, tad matyti, kurios nuspalvinta daugiau.',
        brezinys: dviJuostos({ daliu: vd, nuspalvinta: a }, { daliu: vd, nuspalvinta: b }),
      }),

    // 4. Rikiavimas
    () => {
      const trys = sumaisyk(Array.from({ length: vd - 1 }, (_, i) => i + 1)).slice(0, 3)
      if (trys.length < 3) return null
      const eile = [...trys].sort((x, y) => x - y)
      return eiliskumoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Surikiuok trupmenas didėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${tr(x, vd)}$`),
        sprendimas: 'Vardikliai vienodi, tad rikiuojama pagal skaitiklius.',
      })
    },

    // 5. Kiek trupmenų tarp dviejų
    () => {
      const maz = Math.min(a, b)
      const did = Math.max(a, b)
      if (did - maz < 2) return null
      return uzdavinys(T1, {
        klausimas: `Kiek trupmenų su vardikliu ${vd} yra tarp $${tr(maz, vd)}$ ir $${tr(did, vd)}$?`,
        atsakymas: String(did - maz - 1),
        atsakymasRodymui: `$${did - maz - 1}$`,
        sprendimas: `Skaitikliai nuo ${maz + 1} iki ${did - 1} — jų ${did - maz - 1}.`,
      })
    },

    // 6. Kaip lyginamos
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kaip lyginamos trupmenos, kurių vardikliai vienodi?',
        variantai: [
          'didesnė ta, kurios skaitiklis didesnis',
          'didesnė ta, kurios skaitiklis mažesnis',
          'reikia jas bendravardiklinti',
          'jos visada lygios',
        ],
        teisingas: 0,
        sprendimas: 'Vienodi vardikliai reiškia vienodo dydžio dalis, tad lemia jų skaičius.',
      }),

    // 7. Trūkstamas skaitiklis
    () => {
      if (a >= vd - 1) return null
      return uzdavinys(T1, {
        klausimas: `Koks mažiausias skaitiklis turi būti, kad būtų teisinga: $${tr(a, vd)} < \\dfrac{\\square}{${vd}}$?`,
        atsakymas: String(a + 1),
        atsakymasRodymui: `$${a + 1}$`,
        sprendimas: `Skaitiklis turi būti didesnis už ${a}, tad mažiausias tinkamas — ${a + 1}.`,
      })
    },
  ])
}

// ── 5.1.2. Sudedame paprastąsias trupmenas ──────────────────────────────────

const T2 = 'trupmenu-sudetis-vienodi'

const A_SUDETIS = [
  {
    klausimas: 'Apskaičiuok: $\\dfrac{2}{9} + \\dfrac{4}{9}$.',
    atsakymas: '2/3',
    atsakymasRodymui: '$\\dfrac{6}{9} = \\dfrac{2}{3}$',
    sprendimas: 'Vardiklis nesikeičia, sudedami skaitikliai.',
  },
] as const

export const trupmenuSudetisVienodi: Generatorius = () =>
  suBandymais(kurkSudeti, A_SUDETIS, T2)

function kurkSudeti(): Uzdavinys | null {
  const vd = atsitiktinis(5, 16)
  const a = atsitiktinis(1, vd - 2)
  const b = atsitiktinis(1, vd - a - 1)

  return variacija([
    // 1. Suma
    () => {
      const t = suprastink(a + b, vd)
      return uzdavinys(T2, {
        klausimas: `Apskaičiuok: $${tr(a, vd)} + ${tr(b, vd)}$.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui:
          t.vardiklis === vd ? `$${tr(a + b, vd)}$` : `$${tr(a + b, vd)} = ${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `Dalys vienodo dydžio, tad sudedami skaitikliai: $${a} + ${b} = ${a + b}$.`,
      })
    },

    // 2. Trūkstamas dėmuo
    () =>
      uzdavinys(T2, {
        klausimas: `Rask trūkstamą skaitiklį: $${tr(a, vd)} + \\dfrac{\\square}{${vd}} = ${tr(a + b, vd)}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${a + b} - ${a} = ${b}$.`,
      }),

    // 3. Iki vieneto
    () =>
      uzdavinys(T2, {
        klausimas: `Kiek trūksta iki vieneto: $${tr(a, vd)} + \\dfrac{\\square}{${vd}} = 1$?`,
        atsakymas: String(vd - a),
        atsakymasRodymui: `$${vd - a}$`,
        sprendimas: `Vienetas yra $${tr(vd, vd)}$, tad trūksta $${vd} - ${a} = ${vd - a}$ dalių.`,
      }),

    // 4. Suma, didesnė už vienetą
    () => {
      const x = atsitiktinis(Math.ceil(vd / 2), vd - 1)
      const y = atsitiktinis(vd - x + 1, vd - 1)
      if (x + y <= vd) return null
      const r = isDaliu(x + y, vd)
      return uzdavinys(T2, {
        klausimas: `Apskaičiuok: $${tr(x, vd)} + ${tr(y, vd)}$. Atsakymą užrašyk mišriuoju skaičiumi.`,
        atsakymas: ats(r.s, r.k, vd),
        atsakymasRodymui: `$${tr(x + y, vd)} = ${mis(r.s, r.k, vd)}$`,
        sprendimas: `Suma $${tr(x + y, vd)}$ didesnė už vienetą, tad iš jos išskiriamas sveikasis.`,
      })
    },

    // 5. Trys dėmenys
    () => {
      const c = atsitiktinis(1, Math.max(1, vd - a - b))
      if (a + b + c > vd) return null
      const t = suprastink(a + b + c, vd)
      return uzdavinys(T2, {
        klausimas: `Apskaičiuok: $${tr(a, vd)} + ${tr(b, vd)} + ${tr(c, vd)}$.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `$${a} + ${b} + ${c} = ${a + b + c}$.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Rask klaidą: $${tr(a, vd)} + ${tr(b, vd)} = ${tr(a + b, vd * 2)}$. Užrašyk teisingą sumą.`,
        atsakymas: `${suprastink(a + b, vd).skaitiklis}/${suprastink(a + b, vd).vardiklis}`,
        atsakymasRodymui: `$${tr(a + b, vd)}$`,
        sprendimas: 'Vardikliai nesudedami — jie rodo dalies dydį, o dalys nuo sudėties nesumažėja.',
      }),

    // 7. Tekstinis
    () => {
      const vardas = pasirink(VARDAI)
      const t = suprastink(vd - a - b, vd)
      if (vd - a - b <= 0) return null
      return uzdavinys(T2, {
        klausimas: `${vardas} suvalgė $${tr(a, vd)}$ picos, o brolis — $${tr(b, vd)}$. Kokia picos dalis liko?`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `Suvalgyta $${tr(a + b, vd)}$, liko $${tr(vd - a - b, vd)}$.`,
        brezinys: trupmenosJuosta(vd, a + b),
      })
    },
  ])
}

// ── 5.1.3. Sudedame mišriuosius skaičius ────────────────────────────────────

const T3 = 'misriuju-sudetis-5'

const A_MISRIUJU_SUDETIS = [
  {
    klausimas: 'Apskaičiuok: $2\\dfrac{1}{5} + 3\\dfrac{2}{5}$.',
    atsakymas: '5 3/5',
    atsakymasRodymui: '$5\\dfrac{3}{5}$',
    sprendimas: 'Sveikieji su sveikaisiais, trupmenos su trupmenomis.',
  },
] as const

export const misriujuSudetis5: Generatorius = () =>
  suBandymais(kurkMisriujuSudeti, A_MISRIUJU_SUDETIS, T3)

function kurkMisriujuSudeti(): Uzdavinys | null {
  const vd = atsitiktinis(4, 12)
  const s1 = atsitiktinis(1, 8)
  const s2 = atsitiktinis(1, 6)
  const k1 = atsitiktinis(1, vd - 1)
  const k2 = atsitiktinis(1, vd - 1)

  return variacija([
    // 1. Be perėjimo
    () => {
      if (k1 + k2 >= vd) return null
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${mis(s1, k1, vd)} + ${mis(s2, k2, vd)}$.`,
        atsakymas: ats(s1 + s2, k1 + k2, vd),
        atsakymasRodymui: `$${mis(s1 + s2, k1 + k2, vd)}$`,
        sprendimas: `Sveikieji: $${s1} + ${s2} = ${s1 + s2}$; trupmenos: $${tr(k1, vd)} + ${tr(k2, vd)} = ${tr(k1 + k2, vd)}$.`,
      })
    },

    // 2. Su perėjimu per sveikąjį
    () => {
      if (k1 + k2 <= vd) return null
      const r = isDaliu((s1 + s2) * vd + k1 + k2, vd)
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${mis(s1, k1, vd)} + ${mis(s2, k2, vd)}$.`,
        atsakymas: ats(r.s, r.k, vd),
        atsakymasRodymui: `$${mis(r.s, r.k, vd)}$`,
        sprendimas: `Trupmenų suma $${tr(k1 + k2, vd)}$ didesnė už vienetą: $${tr(k1 + k2, vd)} = 1${tr(k1 + k2 - vd, vd)}$. Tad iš viso $${mis(r.s, r.k, vd)}$.`,
      })
    },

    // 3. Mišrusis ir natūralusis
    () => {
      const n = atsitiktinis(2, 9)
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${mis(s1, k1, vd)} + ${n}$.`,
        atsakymas: ats(s1 + n, k1, vd),
        atsakymasRodymui: `$${mis(s1 + n, k1, vd)}$`,
        sprendimas: 'Natūralusis skaičius pridedamas prie sveikosios dalies; trupmeninė nesikeičia.',
      })
    },

    // 4. Mišrusis ir trupmena
    () => {
      if (k1 + k2 >= vd) return null
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${mis(s1, k1, vd)} + ${tr(k2, vd)}$.`,
        atsakymas: ats(s1, k1 + k2, vd),
        atsakymasRodymui: `$${mis(s1, k1 + k2, vd)}$`,
        sprendimas: `Sveikoji dalis nesikeičia, o trupmenos sudedamos: $${tr(k1, vd)} + ${tr(k2, vd)} = ${tr(k1 + k2, vd)}$.`,
      })
    },

    // 5. Trūkstamas dėmuo
    () => {
      if (k1 + k2 >= vd) return null
      return uzdavinys(T3, {
        klausimas: `Rask trūkstamą dėmenį: $${mis(s1, k1, vd)} + \\square = ${mis(s1 + s2, k1 + k2, vd)}$.`,
        atsakymas: ats(s2, k2, vd),
        atsakymasRodymui: `$${mis(s2, k2, vd)}$`,
        sprendimas: 'Iš sumos atimamas žinomas dėmuo: atskirai sveikosios ir atskirai trupmeninės dalys.',
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: `Rask klaidą: $${mis(2, 3, 4)} + ${mis(1, 2, 4)} = ${mis(3, 5, 8)}$. Užrašyk teisingą sumą.`,
        atsakymas: '4 1/4',
        atsakymasRodymui: `$${mis(4, 1, 4)}$`,
        sprendimas: `Vardikliai nesudedami: $${tr(3, 4)} + ${tr(2, 4)} = ${tr(5, 4)} = 1${tr(1, 4)}$, tad suma $${mis(4, 1, 4)}$.`,
      }),

    // 7. Tekstinis
    () => {
      if (k1 + k2 >= vd) return null
      const vardas = pasirink(VARDAI)
      return uzdavinys(T3, {
        klausimas: `${vardas} nubėgo $${mis(s1, k1, vd)}$ km, o kitą dieną — $${mis(s2, k2, vd)}$ km. Kiek kilometrų nubėgta iš viso?`,
        atsakymas: ats(s1 + s2, k1 + k2, vd),
        atsakymasRodymui: `$${mis(s1 + s2, k1 + k2, vd)}$ km`,
        sprendimas: `$${mis(s1, k1, vd)} + ${mis(s2, k2, vd)} = ${mis(s1 + s2, k1 + k2, vd)}$.`,
      })
    },
  ])
}

// ── 5.1.4. Atimame paprastąją trupmeną ──────────────────────────────────────

const T4 = 'trupmenu-atimtis-vienodi'

const A_ATIMTIS = [
  {
    klausimas: 'Apskaičiuok: $\\dfrac{7}{9} - \\dfrac{2}{9}$.',
    atsakymas: '5/9',
    atsakymasRodymui: '$\\dfrac{5}{9}$',
    sprendimas: 'Vardiklis nesikeičia, atimami skaitikliai.',
  },
] as const

export const trupmenuAtimtisVienodi: Generatorius = () =>
  suBandymais(kurkAtimti, A_ATIMTIS, T4)

function kurkAtimti(): Uzdavinys | null {
  const vd = atsitiktinis(5, 16)
  const a = atsitiktinis(2, vd - 1)
  const b = atsitiktinis(1, a - 1)

  return variacija([
    // 1. Skirtumas
    () => {
      const t = suprastink(a - b, vd)
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${tr(a, vd)} - ${tr(b, vd)}$.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui:
          t.vardiklis === vd ? `$${tr(a - b, vd)}$` : `$${tr(a - b, vd)} = ${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `$${a} - ${b} = ${a - b}$, vardiklis nesikeičia.`,
      })
    },

    // 2. Iš vieneto
    () =>
      uzdavinys(T4, {
        klausimas: `Apskaičiuok: $1 - ${tr(b, vd)}$.`,
        atsakymas: `${suprastink(vd - b, vd).skaitiklis}/${suprastink(vd - b, vd).vardiklis}`,
        atsakymasRodymui: `$${tr(vd - b, vd)}$`,
        sprendimas: `Vienetą užrašome kaip $${tr(vd, vd)}$, tad $${tr(vd, vd)} - ${tr(b, vd)} = ${tr(vd - b, vd)}$.`,
      }),

    // 3. Trūkstamas atėminys
    () =>
      uzdavinys(T4, {
        klausimas: `Rask trūkstamą skaitiklį: $${tr(a, vd)} - \\dfrac{\\square}{${vd}} = ${tr(a - b, vd)}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${a} - ${a - b} = ${b}$.`,
      }),

    // 4. Trūkstamas turinys
    () =>
      uzdavinys(T4, {
        klausimas: `Rask trūkstamą skaitiklį: $\\dfrac{\\square}{${vd}} - ${tr(b, vd)} = ${tr(a - b, vd)}$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${a - b} + ${b} = ${a}$.`,
      }),

    // 5. Du atėmimai
    () => {
      const c = atsitiktinis(1, Math.max(1, a - b - 1))
      if (a - b - c <= 0) return null
      const t = suprastink(a - b - c, vd)
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${tr(a, vd)} - ${tr(b, vd)} - ${tr(c, vd)}$.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `$${a} - ${b} - ${c} = ${a - b - c}$.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Rask klaidą: $${tr(a, vd)} - ${tr(b, vd)} = ${tr(a - b, 0 + vd - b)}$. Užrašyk teisingą skirtumą.`,
        atsakymas: `${suprastink(a - b, vd).skaitiklis}/${suprastink(a - b, vd).vardiklis}`,
        atsakymasRodymui: `$${tr(a - b, vd)}$`,
        sprendimas: 'Vardikliai neatimami — atimami tik skaitikliai.',
      }),

    // 7. Tekstinis
    () => {
      const t = suprastink(a - b, vd)
      return uzdavinys(T4, {
        klausimas: `Iš juostos, kurios $${tr(a, vd)}$ buvo nudažyta, nuvalyta $${tr(b, vd)}$. Kokia dalis liko nudažyta?`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `$${tr(a, vd)} - ${tr(b, vd)} = ${tr(a - b, vd)}$.`,
        brezinys: trupmenosJuosta(vd, a - b),
      })
    },
  ])
}

// ── 5.1.5. Natūraliųjų ir mišriųjų skaičių atimtis ──────────────────────────

const T5 = 'naturaliuju-ir-misriuju-atimtis'

const A_NAT_ATIMTIS = [
  {
    klausimas: 'Apskaičiuok: $5 - 2\\dfrac{3}{7}$.',
    atsakymas: '2 4/7',
    atsakymasRodymui: '$2\\dfrac{4}{7}$',
    sprendimas: 'Iš 5 pasiskolinamas vienetas: $5 = 4\\dfrac{7}{7}$.',
  },
] as const

export const naturaliujuIrMisriujuAtimtis: Generatorius = () =>
  suBandymais(kurkNatAtimti, A_NAT_ATIMTIS, T5)

function kurkNatAtimti(): Uzdavinys | null {
  const vd = atsitiktinis(4, 12)
  const n = atsitiktinis(3, 12)
  const s = atsitiktinis(1, n - 2)
  const k = atsitiktinis(1, vd - 1)

  return variacija([
    // 1. Natūralusis minus mišrusis
    () => {
      const r = isDaliu((n - s) * vd - k, vd)
      return uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${n} - ${mis(s, k, vd)}$.`,
        atsakymas: ats(r.s, r.k, vd),
        atsakymasRodymui: `$${mis(r.s, r.k, vd)}$`,
        sprendimas: `Iš ${n} pasiskolinamas vienetas: $${n} = ${n - 1}${tr(vd, vd)}$. Tada $${n - 1}${tr(vd, vd)} - ${mis(s, k, vd)} = ${mis(r.s, r.k, vd)}$.`,
      })
    },

    // 2. Natūralusis minus trupmena
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${n} - ${tr(k, vd)}$.`,
        atsakymas: ats(n - 1, vd - k, vd),
        atsakymasRodymui: `$${mis(n - 1, vd - k, vd)}$`,
        sprendimas: `$${n} = ${n - 1}${tr(vd, vd)}$, tad $${n - 1}${tr(vd, vd)} - ${tr(k, vd)} = ${mis(n - 1, vd - k, vd)}$.`,
      }),

    // 3. Kaip ardomas vienetas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kaip užrašomas skaičius ${n}, kad iš jo būtų galima atimti trupmeną su vardikliu ${vd}?`,
        variantai: [
          `$${n - 1}${tr(vd, vd)}$`,
          `$${n}${tr(vd, vd)}$`,
          `$${n - 1}${tr(1, vd)}$`,
          `$${n}${tr(1, vd)}$`,
        ],
        teisingas: 0,
        sprendimas: `Vienas sveikasis pakeičiamas $${tr(vd, vd)}$, tad sveikųjų lieka ${n - 1}.`,
      }),

    // 4. Iš vieneto
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $1 - ${tr(k, vd)}$.`,
        atsakymas: `${suprastink(vd - k, vd).skaitiklis}/${suprastink(vd - k, vd).vardiklis}`,
        atsakymasRodymui: `$${tr(vd - k, vd)}$`,
        sprendimas: `$1 = ${tr(vd, vd)}$.`,
      }),

    // 5. Trūkstamas atėminys
    () => {
      const r = isDaliu((n - s) * vd - k, vd)
      return uzdavinys(T5, {
        klausimas: `Rask trūkstamą atėminį: $${n} - \\square = ${mis(r.s, r.k, vd)}$.`,
        atsakymas: ats(s, k, vd),
        atsakymasRodymui: `$${mis(s, k, vd)}$`,
        sprendimas: `$${n} - ${mis(r.s, r.k, vd)} = ${mis(s, k, vd)}$.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Mokinys apskaičiavo $${n} - ${tr(k, vd)} = ${mis(n, vd - k, vd)}$. Užrašyk teisingą skirtumą.`,
        atsakymas: ats(n - 1, vd - k, vd),
        atsakymasRodymui: `$${mis(n - 1, vd - k, vd)}$`,
        sprendimas: 'Ardant vienetą sveikųjų sumažėja vienetu — mokinys to nepadarė.',
      }),

    // 7. Tekstinis
    () => {
      const r = isDaliu((n - s) * vd - k, vd)
      return uzdavinys(T5, {
        klausimas: `Buvo ${n} kg miltų, sunaudota $${mis(s, k, vd)}$ kg. Kiek kilogramų liko?`,
        atsakymas: ats(r.s, r.k, vd),
        atsakymasRodymui: `$${mis(r.s, r.k, vd)}$ kg`,
        sprendimas: `$${n} - ${mis(s, k, vd)} = ${mis(r.s, r.k, vd)}$.`,
      })
    },
  ])
}

// ── 5.1.6. Mišriųjų skaičių atimtis ─────────────────────────────────────────

const T6 = 'misriuju-atimtis-5'

const A_MISRIUJU_ATIMTIS = [
  {
    klausimas: 'Apskaičiuok: $5\\dfrac{1}{6} - 2\\dfrac{5}{6}$.',
    atsakymas: '2 1/3',
    atsakymasRodymui: '$2\\dfrac{2}{6} = 2\\dfrac{1}{3}$',
    sprendimas: 'Ardomas vienas sveikasis.',
  },
] as const

export const misriujuAtimtis5: Generatorius = () =>
  suBandymais(kurkMisriujuAtimti, A_MISRIUJU_ATIMTIS, T6)

function kurkMisriujuAtimti(): Uzdavinys | null {
  const vd = atsitiktinis(4, 12)
  const s1 = atsitiktinis(3, 9)
  const s2 = atsitiktinis(1, s1 - 1)
  const k1 = atsitiktinis(1, vd - 1)
  const k2 = atsitiktinis(1, vd - 1)

  return variacija([
    // 1. Be ardymo
    () => {
      if (k1 <= k2) return null
      return uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${mis(s1, k1, vd)} - ${mis(s2, k2, vd)}$.`,
        atsakymas: ats(s1 - s2, k1 - k2, vd),
        atsakymasRodymui: `$${mis(s1 - s2, k1 - k2, vd)}$`,
        sprendimas: `Sveikieji: $${s1} - ${s2} = ${s1 - s2}$; trupmenos: $${tr(k1, vd)} - ${tr(k2, vd)} = ${tr(k1 - k2, vd)}$.`,
      })
    },

    // 2. Su ardymu
    () => {
      if (k1 >= k2) return null
      const r = isDaliu((s1 - s2 - 1) * vd + (k1 + vd - k2), vd)
      return uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${mis(s1, k1, vd)} - ${mis(s2, k2, vd)}$.`,
        atsakymas: ats(r.s, r.k, vd),
        atsakymasRodymui: `$${mis(r.s, r.k, vd)}$`,
        sprendimas: `Trupmenos atimti negalima, tad ardomas vienas sveikasis: $${mis(s1, k1, vd)} = ${s1 - 1}${tr(k1 + vd, vd)}$. Tada $${mis(r.s, r.k, vd)}$.`,
      })
    },

    // 3. Kada reikia ardyti
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kada atimant mišriuosius skaičius reikia ardyti sveikąjį?',
        variantai: [
          'kai turinio trupmeninė dalis mažesnė už atėminio',
          'visada',
          'kai sveikosios dalys vienodos',
          'kai vardikliai skirtingi',
        ],
        teisingas: 0,
        sprendimas: 'Tada iš sveikojo pasiskolinama viena visuma ir pridedama prie trupmeninės dalies.',
      }),

    // 4. Kaip užrašomas išardytas skaičius
    () => {
      if (k1 >= k2) return null
      return uzdavinys(T6, {
        klausimas: `Skaičių $${mis(s1, k1, vd)}$ užrašyk taip, kad sveikoji dalis būtų ${s1 - 1}. Koks bus trupmeninės dalies skaitiklis?`,
        atsakymas: String(k1 + vd),
        atsakymasRodymui: `$${k1 + vd}$`,
        sprendimas: `Vienas sveikasis yra $${tr(vd, vd)}$, tad $${k1} + ${vd} = ${k1 + vd}$.`,
      })
    },

    // 5. Trūkstamas atėminys
    () => {
      if (k1 <= k2) return null
      return uzdavinys(T6, {
        klausimas: `Rask trūkstamą atėminį: $${mis(s1, k1, vd)} - \\square = ${mis(s1 - s2, k1 - k2, vd)}$.`,
        atsakymas: ats(s2, k2, vd),
        atsakymasRodymui: `$${mis(s2, k2, vd)}$`,
        sprendimas: 'Atskirai atimamos sveikosios ir trupmeninės dalys.',
      })
    },

    // 6. Klaidos radimas
    () => {
      if (k1 >= k2) return null
      return uzdavinys(T6, {
        klausimas: `Mokinys apskaičiavo $${mis(s1, k1, vd)} - ${mis(s2, k2, vd)} = ${mis(s1 - s2, k2 - k1, vd)}$ — trupmeninėje dalyje jis atėmė mažesnį skaitiklį iš didesnio. Užrašyk teisingą skirtumą.`,
        atsakymas: ats(
          isDaliu((s1 - s2 - 1) * vd + (k1 + vd - k2), vd).s,
          isDaliu((s1 - s2 - 1) * vd + (k1 + vd - k2), vd).k,
          vd,
        ),
        atsakymasRodymui: `$${mis(isDaliu((s1 - s2 - 1) * vd + (k1 + vd - k2), vd).s, isDaliu((s1 - s2 - 1) * vd + (k1 + vd - k2), vd).k, vd)}$`,
        sprendimas: 'Skaitiklių sukeisti negalima — vietoj to ardomas vienas sveikasis.',
      })
    },

    // 7. Tekstinis
    () => {
      if (k1 <= k2) return null
      return uzdavinys(T6, {
        klausimas: `Vienoje statinėje $${mis(s1, k1, vd)}$ l vandens, kitoje — $${mis(s2, k2, vd)}$ l. Keliais litrais pirmoje daugiau?`,
        atsakymas: ats(s1 - s2, k1 - k2, vd),
        atsakymasRodymui: `$${mis(s1 - s2, k1 - k2, vd)}$ l`,
        sprendimas: `$${mis(s1, k1, vd)} - ${mis(s2, k2, vd)} = ${mis(s1 - s2, k1 - k2, vd)}$.`,
      })
    },
  ])
}

// ── 5.2.1. Bendravardikliname ───────────────────────────────────────────────

const T7 = 'bendravardiklinimas-5'

const A_BENDRAS = [
  {
    klausimas: 'Koks yra mažiausias bendrasis trupmenų $\\dfrac{1}{4}$ ir $\\dfrac{1}{6}$ vardiklis?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: 'Mažiausiasis bendrasis 4 ir 6 kartotinis yra 12.',
  },
] as const

export const bendravardiklinimas5: Generatorius = () =>
  suBandymais(kurkBendravardiklinti, A_BENDRAS, T7)

function kurkBendravardiklinti(): Uzdavinys | null {
  const vd1 = atsitiktinis(2, 12)
  const vd2 = atsitiktinis(2, 12)
  if (vd1 === vd2) return null
  const bendras = mbk(vd1, vd2)
  const sk1 = atsitiktinis(1, vd1 - 1)
  const sk2 = atsitiktinis(1, vd2 - 1)

  return variacija([
    // 1. Bendrasis vardiklis
    () =>
      uzdavinys(T7, {
        klausimas: `Koks yra mažiausias bendrasis trupmenų $${tr(sk1, vd1)}$ ir $${tr(sk2, vd2)}$ vardiklis?`,
        atsakymas: String(bendras),
        atsakymasRodymui: `$${bendras}$`,
        sprendimas: `Ieškomas mažiausiasis bendrasis ${vd1} ir ${vd2} kartotinis: ${bendras}.`,
      }),

    // 2. Papildomas daugiklis
    () =>
      uzdavinys(T7, {
        klausimas: `Trupmeną $${tr(sk1, vd1)}$ suveskime į vardiklį ${bendras}. Iš kokio skaičiaus reikia padauginti jos narius?`,
        atsakymas: String(bendras / vd1),
        atsakymasRodymui: `$${bendras / vd1}$`,
        sprendimas: `$${bendras} : ${vd1} = ${bendras / vd1}$.`,
      }),

    // 3. Naujas skaitiklis
    () =>
      uzdavinys(T7, {
        klausimas: `Suvesk $${tr(sk1, vd1)}$ į vardiklį ${bendras}. Koks bus skaitiklis?`,
        atsakymas: String((sk1 * bendras) / vd1),
        atsakymasRodymui: `$${(sk1 * bendras) / vd1}$`,
        sprendimas: `Papildomas daugiklis $${bendras} : ${vd1} = ${bendras / vd1}$, tad $${sk1} \\cdot ${bendras / vd1} = ${(sk1 * bendras) / vd1}$.`,
      }),

    // 4. Abi trupmenos
    () =>
      uzdavinys(T7, {
        klausimas: `Bendravardiklink $${tr(sk1, vd1)}$ ir $${tr(sk2, vd2)}$. Koks bus antrosios trupmenos skaitiklis?`,
        atsakymas: String((sk2 * bendras) / vd2),
        atsakymasRodymui: `$${(sk2 * bendras) / vd2}$`,
        sprendimas: `Bendrasis vardiklis ${bendras}; $${sk2} \\cdot ${bendras / vd2} = ${(sk2 * bendras) / vd2}$.`,
      }),

    // 5. Kai vienas vardiklis dalus iš kito
    () => {
      const maz = atsitiktinis(2, 6)
      const did = maz * atsitiktinis(2, 4)
      const sk = atsitiktinis(1, maz - 1)
      return uzdavinys(T7, {
        klausimas: `Koks yra mažiausias bendrasis trupmenų $${tr(sk, maz)}$ ir $${tr(1, did)}$ vardiklis?`,
        atsakymas: String(did),
        atsakymasRodymui: `$${did}$`,
        sprendimas: `${did} dalus iš ${maz}, tad jis pats ir yra bendrasis vardiklis.`,
      })
    },

    // 6. Kai vardikliai tarpusavyje pirminiai
    () => {
      if (nsd(vd1, vd2) !== 1) return null
      return pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Kodėl trupmenų su vardikliais ${vd1} ir ${vd2} bendrasis vardiklis yra ${vd1 * vd2}?`,
        variantai: [
          `nes ${vd1} ir ${vd2} bendrų daliklių, didesnių už 1, neturi`,
          'nes abu vardikliai lyginiai',
          'nes taip visada daroma',
          'nes jie abu mažesni už 13',
        ],
        teisingas: 0,
        sprendimas: 'Kai vardikliai tarpusavyje pirminiai, mažiausiasis bendrasis kartotinis yra jų sandauga.',
      })
    },

    // 7. Klaidos radimas
    () => {
      if (vd1 * vd2 === bendras) return null
      return uzdavinys(T7, {
        klausimas: `Mokinys trupmenoms su vardikliais ${vd1} ir ${vd2} pasirinko bendrąjį vardiklį ${vd1 * vd2}. Koks yra mažiausias galimas bendrasis vardiklis?`,
        atsakymas: String(bendras),
        atsakymasRodymui: `$${bendras}$`,
        sprendimas: `Sandauga tinka, bet nėra mažiausia: ${bendras} dalus ir iš ${vd1}, ir iš ${vd2}.`,
      })
    },
  ])
}

// ── 5.2.2. Palyginame (skirtingi vardikliai) ────────────────────────────────

const T8 = 'trupmenu-palyginimas-skirtingi'

const A_PAL_SKIRT = [
  {
    klausimas: 'Kuri trupmena didesnė: $\\dfrac{2}{3}$ ar $\\dfrac{3}{5}$?',
    atsakymas: '2/3',
    atsakymasRodymui: '$\\dfrac{2}{3}$',
    sprendimas: 'Bendravardiklinus: $\\dfrac{10}{15}$ ir $\\dfrac{9}{15}$.',
  },
] as const

export const trupmenuPalyginimasSkirtingi: Generatorius = () =>
  suBandymais(kurkPalSkirt, A_PAL_SKIRT, T8)

function kurkPalSkirt(): Uzdavinys | null {
  const vd1 = atsitiktinis(2, 12)
  const vd2 = atsitiktinis(2, 12)
  if (vd1 === vd2) return null
  const sk1 = atsitiktinis(1, vd1 - 1)
  const sk2 = atsitiktinis(1, vd2 - 1)
  const bendras = mbk(vd1, vd2)
  const n1 = (sk1 * bendras) / vd1
  const n2 = (sk2 * bendras) / vd2
  if (n1 === n2) return null

  return variacija([
    // 1. Kuri didesnė
    () =>
      uzdavinys(T8, {
        klausimas: `Kuri trupmena didesnė: $${tr(sk1, vd1)}$ ar $${tr(sk2, vd2)}$?`,
        atsakymas: n1 > n2 ? `${sk1}/${vd1}` : `${sk2}/${vd2}`,
        atsakymasRodymui: n1 > n2 ? `$${tr(sk1, vd1)}$` : `$${tr(sk2, vd2)}$`,
        sprendimas: `Bendravardiklinus: $${tr(n1, bendras)}$ ir $${tr(n2, bendras)}$.`,
      }),

    // 2. Iš juostų
    () =>
      uzdavinys(T8, {
        klausimas: 'Kuri iš pavaizduotų trupmenų didesnė? Užrašyk ją.',
        atsakymas: n1 > n2 ? `${sk1}/${vd1}` : `${sk2}/${vd2}`,
        atsakymasRodymui: n1 > n2 ? `$${tr(sk1, vd1)}$` : `$${tr(sk2, vd2)}$`,
        sprendimas: 'Juostos vienodo ilgio, tad palyginti galima iš nuspalvintos dalies ilgio.',
        brezinys: dviJuostos({ daliu: vd1, nuspalvinta: sk1 }, { daliu: vd2, nuspalvinta: sk2 }),
      }),

    // 3. Kaip lyginamos
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kaip lyginamos trupmenos, kurių vardikliai skirtingi?',
        variantai: [
          'jos suvedamos į bendrąjį vardiklį, o tada lyginami skaitikliai',
          'lyginami tik skaitikliai',
          'lyginami tik vardikliai',
          'didesnė ta, kurios vardiklis didesnis',
        ],
        teisingas: 0,
        sprendimas: `$${tr(sk1, vd1)} = ${tr(n1, bendras)}$, $${tr(sk2, vd2)} = ${tr(n2, bendras)}$.`,
      }),

    // 4. Palyginimas su puse
    () => {
      const puse = vd1 % 2 === 0 ? vd1 / 2 : null
      if (puse === null || sk1 === puse) return null
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Palygink $${tr(sk1, vd1)}$ su puse.`,
        variantai:
          sk1 > puse
            ? ['didesnė už pusę', 'mažesnė už pusę', 'lygi pusei']
            : ['mažesnė už pusę', 'didesnė už pusę', 'lygi pusei'],
        teisingas: 0,
        sprendimas: `Pusė yra $${tr(puse, vd1)}$, tad lyginami skaitikliai ${sk1} ir ${puse}.`,
      })
    },

    // 5. Su vienodais skaitikliais
    () => {
      const sk = atsitiktinis(1, Math.min(vd1, vd2) - 1)
      if (sk < 1) return null
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Kuri trupmena didesnė: $${tr(sk, vd1)}$ ar $${tr(sk, vd2)}$?`,
        variantai:
          vd1 < vd2
            ? [`$${tr(sk, vd1)}$`, `$${tr(sk, vd2)}$`, 'jos lygios']
            : [`$${tr(sk, vd2)}$`, `$${tr(sk, vd1)}$`, 'jos lygios'],
        teisingas: 0,
        sprendimas: 'Kai skaitikliai vienodi, didesnė ta trupmena, kurios vardiklis mažesnis — jos dalys stambesnės.',
      })
    },

    // 6. Rikiavimas
    () => {
      const trys = [
        { sk: 1, vd: 2 },
        { sk: 2, vd: 3 },
        { sk: 3, vd: 4 },
      ]
      const eile = [...trys].sort((x, y) => x.sk / x.vd - y.sk / y.vd)
      return eiliskumoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Surikiuok trupmenas didėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${tr(x.sk, x.vd)}$`),
        sprendimas: 'Bendrasis vardiklis 12: $\\dfrac{6}{12}$, $\\dfrac{8}{12}$, $\\dfrac{9}{12}$.',
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T8, {
        klausimas: `Mokinys teigia, kad $${tr(1, 3)} > ${tr(1, 2)}$, nes $3 > 2$. Kuri iš šių trupmenų iš tikrųjų didesnė?`,
        atsakymas: '1/2',
        atsakymasRodymui: `$${tr(1, 2)}$`,
        sprendimas: 'Kuo vardiklis didesnis, tuo dalys smulkesnės: pusė yra didesnė už trečdalį.',
        brezinys: dviJuostos({ daliu: 3, nuspalvinta: 1 }, { daliu: 2, nuspalvinta: 1 }),
      }),
  ])
}

// ── 5.2.3. Sudedame (skirtingi vardikliai) ──────────────────────────────────

const T9 = 'trupmenu-sudetis-skirtingi'

const A_SUD_SKIRT = [
  {
    klausimas: 'Apskaičiuok: $\\dfrac{1}{4} + \\dfrac{1}{6}$.',
    atsakymas: '5/12',
    atsakymasRodymui: '$\\dfrac{5}{12}$',
    sprendimas: 'Bendrasis vardiklis 12: $\\dfrac{3}{12} + \\dfrac{2}{12}$.',
  },
] as const

export const trupmenuSudetisSkirtingi: Generatorius = () =>
  suBandymais(kurkSudSkirt, A_SUD_SKIRT, T9)

function kurkSudSkirt(): Uzdavinys | null {
  const vd1 = atsitiktinis(2, 10)
  const vd2 = atsitiktinis(2, 10)
  if (vd1 === vd2) return null
  const bendras = mbk(vd1, vd2)
  // Bendrasis vardiklis turi likti gražus: iki 20 arba dalijantis 1000
  // (25, 40, 50, 100) — kitaip atsakymo trupmena penktokui nebeįskaitoma.
  if (bendras > 20 && 1000 % bendras !== 0) return null
  const sk1 = atsitiktinis(1, vd1 - 1)
  const sk2 = atsitiktinis(1, vd2 - 1)
  const n1 = (sk1 * bendras) / vd1
  const n2 = (sk2 * bendras) / vd2

  return variacija([
    // 1. Suma
    () => {
      if (n1 + n2 > bendras) return null
      const t = suprastink(n1 + n2, bendras)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${tr(sk1, vd1)} + ${tr(sk2, vd2)}$.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `Bendrasis vardiklis ${bendras}: $${tr(n1, bendras)} + ${tr(n2, bendras)} = ${tr(n1 + n2, bendras)}$.`,
      })
    },

    // 2. Suma, didesnė už vienetą
    () => {
      if (n1 + n2 <= bendras) return null
      const r = isDaliu(n1 + n2, bendras)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${tr(sk1, vd1)} + ${tr(sk2, vd2)}$. Atsakymą užrašyk mišriuoju skaičiumi.`,
        atsakymas: ats(r.s, r.k, bendras),
        atsakymasRodymui: `$${mis(r.s, r.k, bendras)}$`,
        sprendimas: `Bendrasis vardiklis ${bendras}: $${tr(n1, bendras)} + ${tr(n2, bendras)} = ${tr(n1 + n2, bendras)} = ${mis(r.s, r.k, bendras)}$.`,
      })
    },

    // 3. Pirmasis žingsnis
    () =>
      uzdavinys(T9, {
        klausimas: `Kokį bendrąjį vardiklį reikia parinkti sudedant $${tr(sk1, vd1)}$ ir $${tr(sk2, vd2)}$?`,
        atsakymas: String(bendras),
        atsakymasRodymui: `$${bendras}$`,
        sprendimas: `Mažiausiasis bendrasis ${vd1} ir ${vd2} kartotinis yra ${bendras}.`,
      }),

    // 4. Su natūraliuoju skaičiumi
    () => {
      const n = atsitiktinis(2, 6)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${n} + ${tr(sk1, vd1)}$.`,
        atsakymas: ats(n, sk1, vd1),
        atsakymasRodymui: `$${mis(n, sk1, vd1)}$`,
        sprendimas: 'Natūralusis skaičius tampa sveikąja mišriojo skaičiaus dalimi.',
      })
    },

    // 5. Kai vienas vardiklis dalus iš kito
    () => {
      const maz = atsitiktinis(2, 6)
      const did = maz * atsitiktinis(2, 3)
      const a = atsitiktinis(1, maz - 1)
      const b = atsitiktinis(1, did - 1)
      const suma = (a * did) / maz + b
      if (suma > did) return null
      const t = suprastink(suma, did)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${tr(a, maz)} + ${tr(b, did)}$.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `${did} dalus iš ${maz}, tad bendrasis vardiklis yra ${did}: $${tr((a * did) / maz, did)} + ${tr(b, did)} = ${tr(suma, did)}$.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Mokinys apskaičiavo $${tr(sk1, vd1)} + ${tr(sk2, vd2)} = ${tr(sk1 + sk2, vd1 + vd2)}$. Kokį bendrąjį vardiklį reikėjo parinkti?`,
        atsakymas: String(bendras),
        atsakymasRodymui: `$${bendras}$`,
        sprendimas: 'Nei skaitiklių, nei vardiklių tiesiog sudėti negalima — pirma reikia bendravardiklinti.',
      }),

    // 7. Tekstinis
    () => {
      if (n1 + n2 > bendras) return null
      const t = suprastink(bendras - n1 - n2, bendras)
      if (bendras - n1 - n2 <= 0) return null
      return uzdavinys(T9, {
        klausimas: `Pirmą dieną nudažyta $${tr(sk1, vd1)}$ tvoros, antrą — $${tr(sk2, vd2)}$. Kokia tvoros dalis liko nenudažyta?`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `Nudažyta $${tr(n1 + n2, bendras)}$, liko $${tr(bendras - n1 - n2, bendras)}$.`,
      })
    },
  ])
}

// ── 5.2.4. Atimame (skirtingi vardikliai) ───────────────────────────────────

const T10 = 'trupmenu-atimtis-skirtingi'

const A_ATIM_SKIRT = [
  {
    klausimas: 'Apskaičiuok: $\\dfrac{3}{4} - \\dfrac{1}{6}$.',
    atsakymas: '7/12',
    atsakymasRodymui: '$\\dfrac{7}{12}$',
    sprendimas: 'Bendrasis vardiklis 12: $\\dfrac{9}{12} - \\dfrac{2}{12}$.',
  },
] as const

export const trupmenuAtimtisSkirtingi: Generatorius = () =>
  suBandymais(kurkAtimSkirt, A_ATIM_SKIRT, T10)

function kurkAtimSkirt(): Uzdavinys | null {
  const vd1 = atsitiktinis(2, 10)
  const vd2 = atsitiktinis(2, 10)
  if (vd1 === vd2) return null
  const bendras = mbk(vd1, vd2)
  // Bendrasis vardiklis turi likti gražus: iki 20 arba dalijantis 1000
  // (25, 40, 50, 100) — kitaip atsakymo trupmena penktokui nebeįskaitoma.
  if (bendras > 20 && 1000 % bendras !== 0) return null
  const sk1 = atsitiktinis(1, vd1 - 1)
  const sk2 = atsitiktinis(1, vd2 - 1)
  const n1 = (sk1 * bendras) / vd1
  const n2 = (sk2 * bendras) / vd2
  if (n1 <= n2) return null

  return variacija([
    // 1. Skirtumas
    () => {
      const t = suprastink(n1 - n2, bendras)
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok: $${tr(sk1, vd1)} - ${tr(sk2, vd2)}$.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `Bendrasis vardiklis ${bendras}: $${tr(n1, bendras)} - ${tr(n2, bendras)} = ${tr(n1 - n2, bendras)}$.`,
      })
    },

    // 2. Iš vieneto
    () => {
      const t = suprastink(vd1 - sk1, vd1)
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok: $1 - ${tr(sk1, vd1)}$.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `$1 = ${tr(vd1, vd1)}$, tad $${tr(vd1, vd1)} - ${tr(sk1, vd1)} = ${tr(vd1 - sk1, vd1)}$.`,
      })
    },

    // 3. Pirmasis žingsnis
    () =>
      uzdavinys(T10, {
        klausimas: `Kokį bendrąjį vardiklį reikia parinkti atimant $${tr(sk2, vd2)}$ iš $${tr(sk1, vd1)}$?`,
        atsakymas: String(bendras),
        atsakymasRodymui: `$${bendras}$`,
        sprendimas: `Mažiausiasis bendrasis ${vd1} ir ${vd2} kartotinis yra ${bendras}.`,
      }),

    // 4. Iš natūraliojo
    () => {
      const n = atsitiktinis(2, 6)
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok: $${n} - ${tr(sk1, vd1)}$.`,
        atsakymas: ats(n - 1, vd1 - sk1, vd1),
        atsakymasRodymui: `$${mis(n - 1, vd1 - sk1, vd1)}$`,
        sprendimas: `$${n} = ${n - 1}${tr(vd1, vd1)}$, tad lieka $${mis(n - 1, vd1 - sk1, vd1)}$.`,
      })
    },

    // 5. Trūkstamas atėminys
    () => {
      const t = suprastink(n1 - n2, bendras)
      return uzdavinys(T10, {
        klausimas: `Rask trūkstamą atėminį: $${tr(sk1, vd1)} - \\square = ${tr(t.skaitiklis, t.vardiklis)}$.`,
        atsakymas: `${sk2}/${vd2}`,
        atsakymasRodymui: `$${tr(sk2, vd2)}$`,
        sprendimas: `$${tr(n1, bendras)} - ${tr(n1 - n2, bendras)} = ${tr(n2, bendras)} = ${tr(sk2, vd2)}$.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T10, {
        klausimas: `Mokinys apskaičiavo $${tr(sk1, vd1)} - ${tr(sk2, vd2)} = ${tr(Math.abs(sk1 - sk2), Math.abs(vd1 - vd2) || 1)}$. Kokį bendrąjį vardiklį reikėjo parinkti?`,
        atsakymas: String(bendras),
        atsakymasRodymui: `$${bendras}$`,
        sprendimas: 'Vardikliai neatimami — trupmenos pirma suvedamos į bendrąjį vardiklį.',
      }),

    // 7. Tekstinis
    () => {
      const t = suprastink(n1 - n2, bendras)
      return uzdavinys(T10, {
        klausimas: `Bake buvo $${tr(sk1, vd1)}$ kuro, sunaudota $${tr(sk2, vd2)}$. Kokia bako dalis liko pilna?`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `$${tr(n1, bendras)} - ${tr(n2, bendras)} = ${tr(n1 - n2, bendras)}$.`,
      })
    },
  ])
}

// ── 5.3.1. Trupmenos ir natūraliojo skaičiaus daugyba ───────────────────────

const T11 = 'trupmenos-daugyba-is-naturaliojo'

const A_TRUP_DAUGYBA = [
  {
    klausimas: 'Apskaičiuok: $\\dfrac{2}{7} \\cdot 3$.',
    atsakymas: '6/7',
    atsakymasRodymui: '$\\dfrac{6}{7}$',
    sprendimas: 'Skaitiklis dauginamas, vardiklis nesikeičia.',
  },
] as const

export const trupmenosDaugybaIsNaturaliojo: Generatorius = () =>
  suBandymais(kurkTrupDaugyba, A_TRUP_DAUGYBA, T11)

function kurkTrupDaugyba(): Uzdavinys | null {
  const vd = atsitiktinis(3, 12)
  const sk = atsitiktinis(1, vd - 1)
  const n = atsitiktinis(2, 9)

  return variacija([
    // 1. Sandauga
    () => {
      const r = isDaliu(sk * n, vd)
      const t = suprastink(sk * n, vd)
      return uzdavinys(T11, {
        klausimas: `Apskaičiuok: $${tr(sk, vd)} \\cdot ${n}$.`,
        atsakymas: sk * n >= vd ? ats(r.s, r.k, vd) : `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: sk * n >= vd ? `$${mis(r.s, r.k, vd)}$` : `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `$${sk} \\cdot ${n} = ${sk * n}$, vardiklis nesikeičia: $${tr(sk * n, vd)}$.`,
      })
    },

    // 2. Kaip dauginama
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kaip dauginama paprastoji trupmena iš natūraliojo skaičiaus?',
        variantai: [
          'skaitiklis dauginamas iš to skaičiaus, vardiklis nesikeičia',
          'vardiklis dauginamas, skaitiklis nesikeičia',
          'dauginami ir skaitiklis, ir vardiklis',
          'trupmena verčiama dešimtaine',
        ],
        teisingas: 0,
        sprendimas: `Paimti $${tr(sk, vd)}$ ${n} kartus — tas pat, kas paimti $${sk * n}$ dalis po $${tr(1, vd)}$.`,
      }),

    // 3. Daugyba kaip kartotinė sudėtis
    () => {
      const k = atsitiktinis(2, 4)
      const t = suprastink(sk * k, vd)
      return uzdavinys(T11, {
        klausimas: `Užrašyk sandauga ir apskaičiuok: $${Array(k).fill(tr(sk, vd)).join(' + ')}$.`,
        atsakymas: sk * k >= vd ? ats(isDaliu(sk * k, vd).s, isDaliu(sk * k, vd).k, vd) : `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: sk * k >= vd
          ? `$${mis(isDaliu(sk * k, vd).s, isDaliu(sk * k, vd).k, vd)}$`
          : `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `Tai $${tr(sk, vd)} \\cdot ${k} = ${tr(sk * k, vd)}$.`,
      })
    },

    // 4. Kai gaunamas sveikasis
    () => {
      if (vd % sk !== 0) return null
      const k = vd / sk
      return uzdavinys(T11, {
        klausimas: `Apskaičiuok: $${tr(sk, vd)} \\cdot ${k}$.`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: `$${sk} \\cdot ${k} = ${vd}$, tad gaunama $${tr(vd, vd)} = 1$.`,
      })
    },

    // 5. Trūkstamas daugiklis
    () => {
      const t = suprastink(sk * n, vd)
      return uzdavinys(T11, {
        klausimas: `Rask trūkstamą daugiklį: $${tr(sk, vd)} \\cdot \\square = ${tr(t.skaitiklis, t.vardiklis)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Skaitiklis padidėjo nuo ${sk} iki ${sk * n}, tad daugiklis yra ${n}.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T11, {
        klausimas: `Mokinys apskaičiavo $${tr(sk, vd)} \\cdot ${n} = ${tr(sk * n, vd * n)}$. Užrašyk teisingą sandaugą.`,
        atsakymas: sk * n >= vd
          ? ats(isDaliu(sk * n, vd).s, isDaliu(sk * n, vd).k, vd)
          : `${suprastink(sk * n, vd).skaitiklis}/${suprastink(sk * n, vd).vardiklis}`,
        atsakymasRodymui: `$${tr(sk * n, vd)}$`,
        sprendimas: 'Dauginant iš natūraliojo skaičiaus vardiklis nesikeičia — mokinys padaugino ir jį.',
      }),

    // 7. Tekstinis
    () => {
      const t = suprastink(sk * n, vd)
      return uzdavinys(T11, {
        klausimas: `Vienam pyragui reikia $${tr(sk, vd)}$ kg miltų. Kiek miltų reikės ${n} pyragams?`,
        atsakymas: sk * n >= vd
          ? ats(isDaliu(sk * n, vd).s, isDaliu(sk * n, vd).k, vd)
          : `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: sk * n >= vd
          ? `$${mis(isDaliu(sk * n, vd).s, isDaliu(sk * n, vd).k, vd)}$ kg`
          : `$${tr(t.skaitiklis, t.vardiklis)}$ kg`,
        sprendimas: `$${tr(sk, vd)} \\cdot ${n} = ${tr(sk * n, vd)}$.`,
      })
    },
  ])
}

// ── 5.3.2. Mišriojo ir natūraliojo skaičių daugyba ──────────────────────────

const T12 = 'misriojo-daugyba-is-naturaliojo'

const A_MIS_DAUGYBA = [
  {
    klausimas: 'Apskaičiuok: $1\\dfrac{1}{4} \\cdot 3$.',
    atsakymas: '3 3/4',
    atsakymasRodymui: '$3\\dfrac{3}{4}$',
    sprendimas: 'Mišrusis paverčiamas netaisyklingąja trupmena: $\\dfrac{5}{4} \\cdot 3 = \\dfrac{15}{4}$.',
  },
] as const

export const misriojoDaugybaIsNaturaliojo: Generatorius = () =>
  suBandymais(kurkMisDaugyba, A_MIS_DAUGYBA, T12)

function kurkMisDaugyba(): Uzdavinys | null {
  const vd = atsitiktinis(3, 10)
  const sveikas = atsitiktinis(1, 5)
  const k = atsitiktinis(1, vd - 1)
  const n = atsitiktinis(2, 7)
  const netaisyklinga = sveikas * vd + k
  const sandauga = netaisyklinga * n

  return variacija([
    // 1. Sandauga
    () => {
      const r = isDaliu(sandauga, vd)
      return uzdavinys(T12, {
        klausimas: `Apskaičiuok: $${mis(sveikas, k, vd)} \\cdot ${n}$.`,
        atsakymas: ats(r.s, r.k, vd),
        atsakymasRodymui: `$${mis(r.s, r.k, vd)}$`,
        sprendimas: `$${mis(sveikas, k, vd)} = ${tr(netaisyklinga, vd)}$, tad $${tr(netaisyklinga, vd)} \\cdot ${n} = ${tr(sandauga, vd)} = ${mis(r.s, r.k, vd)}$.`,
      })
    },

    // 2. Pirmasis žingsnis
    () =>
      uzdavinys(T12, {
        klausimas: `Dauginant $${mis(sveikas, k, vd)} \\cdot ${n}$ pirmiausia mišrusis skaičius paverčiamas netaisyklingąja trupmena. Koks bus jos skaitiklis?`,
        atsakymas: String(netaisyklinga),
        atsakymasRodymui: `$${netaisyklinga}$`,
        sprendimas: `$${sveikas} \\cdot ${vd} + ${k} = ${netaisyklinga}$.`,
      }),

    // 3. Kitas būdas — atskirai
    () =>
      uzdavinys(T12, {
        klausimas: `Apskaičiuok $${mis(sveikas, k, vd)} \\cdot ${n}$ dauginant atskirai sveikąją ir trupmeninę dalis. Kiek gaunama padauginus sveikąją dalį?`,
        atsakymas: String(sveikas * n),
        atsakymasRodymui: `$${sveikas * n}$`,
        sprendimas: `$${sveikas} \\cdot ${n} = ${sveikas * n}$; prie to dar pridedama $${tr(k, vd)} \\cdot ${n} = ${tr(k * n, vd)}$.`,
      }),

    // 4. Trūkstamas daugiklis
    () => {
      const r = isDaliu(sandauga, vd)
      return uzdavinys(T12, {
        klausimas: `Rask trūkstamą daugiklį: $${mis(sveikas, k, vd)} \\cdot \\square = ${mis(r.s, r.k, vd)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${tr(sandauga, vd)} : ${tr(netaisyklinga, vd)} = ${n}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const r = isDaliu(sandauga, vd)
      return uzdavinys(T12, {
        klausimas: `Mokinys apskaičiavo $${mis(sveikas, k, vd)} \\cdot ${n} = ${mis(sveikas * n, k, vd)}$ — padaugino tik sveikąją dalį. Užrašyk teisingą sandaugą.`,
        atsakymas: ats(r.s, r.k, vd),
        atsakymasRodymui: `$${mis(r.s, r.k, vd)}$`,
        sprendimas: 'Padauginti reikia ir trupmeninę dalį, arba pirma paversti mišrųjį netaisyklingąja trupmena.',
      })
    },

    // 6. Palyginimas su sveikuoju
    () => {
      const r = isDaliu(sandauga, vd)
      return pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Kuris skaičius didesnis: $${mis(sveikas, k, vd)} \\cdot ${n}$ ar $${sveikas * n}$?`,
        variantai: [`$${mis(sveikas, k, vd)} \\cdot ${n}$`, `$${sveikas * n}$`, 'jie lygūs'],
        teisingas: 0,
        sprendimas: `Sandauga yra $${mis(r.s, r.k, vd)}$ — daugiau nei ${sveikas * n}, nes dauginama ir trupmeninė dalis.`,
      })
    },

    // 7. Tekstinis
    () => {
      const r = isDaliu(sandauga, vd)
      return uzdavinys(T12, {
        klausimas: `Vienos lentos ilgis $${mis(sveikas, k, vd)}$ m. Koks bendras ${n} tokių lentų ilgis?`,
        atsakymas: ats(r.s, r.k, vd),
        atsakymasRodymui: `$${mis(r.s, r.k, vd)}$ m`,
        sprendimas: `$${mis(sveikas, k, vd)} \\cdot ${n} = ${mis(r.s, r.k, vd)}$.`,
      })
    },
  ])
}
