import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { keliosKreives } from './devintokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 9 klasės temos „Trupmeniniai racionalieji reiškiniai“ ir „Lygčių sistemos“ —
 * septynios potemės.
 *
 * Kiekviename reiškinyje su kintamuoju vardiklyje klausiama arba apribojimų,
 * arba supaprastinto pavidalo dalies — taip, kaip reikalauja turinio aprašas:
 * apibrėžimo sritis niekada nepamirštama.
 */

/** Nario su kintamuoju užrašas. */
function narys(k: number, r = 'x'): string {
  if (k === 1) return r
  if (k === -1) return `-${r}`
  return `${k}${r}`
}

/** Tvarkingas ženklas prieš skaičių. */
function plius(b: number): string {
  return b < 0 ? ` - ${-b}` : ` + ${b}`
}

/** Dvinaris $(x + a)$ su tvarkingu ženklu. */
function dv(a: number): string {
  return a < 0 ? `(x - ${-a})` : `(x + ${a})`
}

/** Trupmena. */
function tr(virsus: string, apacia: string): string {
  return `\\dfrac{${virsus}}{${apacia}}`
}

// ── 5.1. Trupmeninio racionaliojo reiškinio samprata ────────────────────────

const T1 = 'trupmeninio-reiskinio-samprata'

const A1 = [
  {
    klausimas: 'Kuriai $x$ reikšmei reiškinys $\\dfrac{x+1}{x-3}$ neapibrėžtas?',
    atsakymas: '3',
    atsakymasRodymui: '$x = 3$',
    sprendimas: 'Vardiklis lygus nuliui, kai $x = 3$.',
  },
] as const

export const trupmeninioReiskinioSamprata: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  const a = atsitiktinis(1, 9)
  const b = atsitiktinis(1, 9)
  const x = a + atsitiktinis(1, 5)

  return variacija([
    // 1. Draudžiama reikšmė
    () =>
      uzdavinys(T1, {
        klausimas: `Kuriai $x$ reikšmei reiškinys $${tr(`x + ${b}`, `x - ${a}`)}$ neapibrėžtas?`,
        atsakymas: String(a),
        atsakymasRodymui: `$x = ${a}$`,
        sprendimas: `Vardiklis lygus nuliui, kai $x = ${a}$.`,
      }),

    // 2. Reikšmė su konkrečiu x
    () => {
      const virsus = x + b
      const apacia = x - a
      if (apacia === 0 || virsus % apacia !== 0) return null
      return uzdavinys(T1, {
        klausimas: `Rask reiškinio $${tr(`x + ${b}`, `x - ${a}`)}$ reikšmę, kai $x = ${x}$.`,
        atsakymas: String(virsus / apacia),
        atsakymasRodymui: `$${virsus / apacia}$`,
        sprendimas: `$\\dfrac{${virsus}}{${apacia}} = ${virsus / apacia}$.`,
      })
    },

    // 3. Kuris reiškinys trupmeninis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuris reiškinys yra trupmeninis racionalusis?',
        variantai: [
          `$${tr('5', 'x')}$`,
          `$${tr(`x + ${b}`, '3')}$`,
          `$${a}x + ${b}$`,
          '$x^2$',
        ],
        teisingas: 0,
        sprendimas: 'Trupmeniniame racionaliajame reiškinyje kintamasis yra vardiklyje.',
      }),

    // 4. Apibrėžimo sritis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Kokia yra reiškinio $${tr(`${2}x - ${b}`, `x + ${a}`)}$ apibrėžimo sritis?`,
        variantai: [
          `visi $x$, išskyrus $-${a}$`,
          `visi $x$, išskyrus $${a}$`,
          `tik $x > 0$`,
          'visi realieji skaičiai',
        ],
        teisingas: 0,
        sprendimas: `Vardiklis nulinis, kai $x = -${a}$.`,
      }),

    // 5. Dvi draudžiamos reikšmės
    () => {
      const c = a + atsitiktinis(1, 6)
      return uzdavinys(T1, {
        klausimas: `Kiek yra $x$ reikšmių, su kuriomis reiškinys $${tr('x - 1', `${dv(-a)}${dv(-c)}`)}$ neapibrėžtas?`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: `Vardiklis nulinis, kai $x = ${a}$ arba $x = ${c}$.`,
      })
    },

    // 6. Neteisingas trumpinimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Kodėl negalima trupmenos $${tr(`x + ${a}`, `x + ${b + 10}`)}$ sutrumpinti iki $${tr(String(a), String(b + 10))}$?`,
        variantai: [
          'nes trumpinti galima tik dauginamuosius, o ne dėmenis',
          'nes skaičiai per dideli',
          'nes vardiklis neigiamas',
          'iš tikrųjų galima',
        ],
        teisingas: 0,
        sprendimas: 'Skaitiklyje ir vardiklyje yra sumos, o ne sandaugos.',
      }),

    // 7. Kada trupmena lygi nuliui
    () =>
      uzdavinys(T1, {
        klausimas: `Su kuria $x$ reikšme reiškinys $${tr(`x - ${a}`, `x + ${b}`)}$ lygus nuliui?`,
        atsakymas: String(a),
        atsakymasRodymui: `$x = ${a}$`,
        sprendimas: 'Trupmena lygi nuliui, kai skaitiklis nulinis, o vardiklis — ne.',
      }),
  ])
}

// ── 5.2. Daugyba, dalyba ir kėlimas laipsniu ────────────────────────────────

const T2 = 'trupmenu-daugyba-dalyba'

const A2 = [
  {
    klausimas: 'Supaprastink: $\\dfrac{2x}{3} \\cdot \\dfrac{9}{4x}$, kai $x \\ne 0$.',
    atsakymas: '1.5',
    atsakymasRodymui: '$\\dfrac{3}{2}$',
    sprendimas: 'Sutrumpinus $x$ ir skaičius.',
  },
] as const

export const trupmenuDaugybaDalyba: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  const a = atsitiktinis(2, 6)
  const b = atsitiktinis(2, 6)
  const n = atsitiktinis(2, 9)

  return variacija([
    // 1. Daugyba su sutrumpinimu
    () =>
      uzdavinys(T2, {
        klausimas: `Supaprastink: $${tr(`${a}x`, String(b))} \\cdot ${tr(String(b * n), `${a}x`)}$, kai $x \\ne 0$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Sutrumpinus $${a}x$ ir $${b}$ lieka $${n}$.`,
      }),

    // 2. Kėlimas kvadratu
    () =>
      uzdavinys(T2, {
        klausimas: `Pakelk kvadratu: $\\left(${tr(`${a}x`, String(b))}\\right)^2$. Koks bus vardiklis?`,
        atsakymas: String(b * b),
        atsakymasRodymui: `$${tr(`${a * a}x^2`, String(b * b))}$`,
        sprendimas: 'Kvadratu keliami ir skaitiklis, ir vardiklis.',
      }),

    // 3. Dalyba
    () =>
      uzdavinys(T2, {
        klausimas: `Apskaičiuok: $${tr('x', String(a))} : ${tr('x', String(b))}$, kai $x \\ne 0$. Koks bus skaitiklis?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${tr(String(b), String(a))}$`,
        sprendimas: 'Dalijant dauginama iš atvirkštinės trupmenos.',
      }),

    // 4. Su skaidymu dauginamaisiais
    () =>
      uzdavinys(T2, {
        klausimas: `Supaprastink: $${tr(`x^2 - ${n * n}`, `x - ${n}`)} \\cdot ${tr('1', `x + ${n}`)}$, kai $x \\ne ${n}$ ir $x \\ne -${n}$.`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: `$x^2 - ${n * n} = (x - ${n})(x + ${n})$, tad viskas sutrumpėja.`,
      }),

    // 5. Dviejų raidžių reiškinys
    () =>
      uzdavinys(T2, {
        klausimas: `Supaprastink: $${tr(`${a}a`, `${b}b`)} \\cdot ${tr(`${2 * b}b`, `${a}a`)}$, kai $a \\ne 0$ ir $b \\ne 0$.`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: `Sutrumpinus $a$, $b$ ir skaičius lieka $2$.`,
      }),

    // 6. Dalybos taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kaip dalijamos trupmenos?',
        variantai: [
          'pirmoji dauginama iš antrosios atvirkštinės trupmenos',
          'skaitikliai ir vardikliai dalijami atskirai',
          'trupmenos bendravardiklinamos',
          'sudauginami skaitikliai',
        ],
        teisingas: 0,
        sprendimas: 'Atvirkštinė trupmena gaunama sukeitus skaitiklį ir vardiklį.',
      }),

    // 7. Apribojimų nurodymas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kokie apribojimai galioja reiškiniui $${tr('x - 1', `x - ${a}`)} : ${tr('x + 2', `x + ${b}`)}$?`,
        variantai: [
          `$x \\ne ${a}$, $x \\ne -${b}$ ir $x \\ne -2$`,
          `tik $x \\ne ${a}$`,
          `tik $x \\ne -${b}$`,
          'apribojimų nėra',
        ],
        teisingas: 0,
        sprendimas: 'Nuliui negali būti lygūs nei vardikliai, nei tas reiškinys, iš kurio dalijama.',
      }),
  ])
}

// ── 5.3. Sudėtis ir atimtis ─────────────────────────────────────────────────

const T3 = 'trupmenu-sudetis-atimtis'

const A3 = [
  {
    klausimas: 'Sudėk: $\\dfrac{3}{x} + \\dfrac{5}{x}$, kai $x \\ne 0$. Koks bus skaitiklis?',
    atsakymas: '8',
    atsakymasRodymui: '$\\dfrac{8}{x}$',
    sprendimas: 'Vienodų vardiklių trupmenų skaitikliai sudedami.',
  },
] as const

export const trupmenuSudetisAtimtis: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(2, 9)
  const c = atsitiktinis(1, 6)

  return variacija([
    // 1. Vienodi vardikliai
    () =>
      uzdavinys(T3, {
        klausimas: `Sudėk: $${tr(String(a), 'x')} + ${tr(String(b), 'x')}$, kai $x \\ne 0$. Koks bus skaitiklis?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${tr(String(a + b), 'x')}$`,
        sprendimas: 'Vienodų vardiklių trupmenų skaitikliai sudedami.',
      }),

    // 2. Atimtis
    () => {
      if (a <= b) return null
      return uzdavinys(T3, {
        klausimas: `Atimk: $${tr(String(a), `x + ${c}`)} - ${tr(String(b), `x + ${c}`)}$, kai $x \\ne -${c}$. Koks bus skaitiklis?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${tr(String(a - b), `x + ${c}`)}$`,
        sprendimas: 'Vardiklis lieka tas pats, atimami tik skaitikliai.',
      })
    },

    // 3. Skirtingi vardikliai
    () =>
      uzdavinys(T3, {
        klausimas: `Sudėk: $${tr('1', 'x')} + ${tr('1', String(a))}$, kai $x \\ne 0$. Koks bus bendrasis vardiklis?`,
        atsakymas: `${a}x`,
        atsakymasRodymui: `$${tr(`${a} + x`, `${a}x`)}$`,
        sprendimas: `Bendrasis vardiklis — $${a}x$.`,
      }),

    // 4. Sutrumpėjimas
    () =>
      uzdavinys(T3, {
        klausimas: `Supaprastink: $${tr('x', `x + ${c}`)} + ${tr(String(c), `x + ${c}`)}$, kai $x \\ne -${c}$.`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: `Skaitiklyje gaunama $x + ${c}$, tad trupmena lygi 1.`,
      }),

    // 5. Bendrasis vardiklis su dvinariais
    () => {
      const d = c + atsitiktinis(1, 5)
      return uzdavinys(T3, {
        klausimas: `Supaprastink: $${tr('1', `x - ${c}`)} - ${tr('1', `x - ${d}`)}$. Koks bus skaitiklis?`,
        atsakymas: String(c - d),
        atsakymasRodymui: `$${tr(String(c - d), `${dv(-c)}${dv(-d)}`)}$`,
        sprendimas: `$(x - ${d}) - (x - ${c}) = ${c - d}$.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Mokinys sudėjo $${tr('1', 'x')} + ${tr('1', 'y')}$ ir gavo $${tr('2', 'x + y')}$. Kodėl tai klaida?`,
        variantai: [
          `nes trupmenos pirma bendravardiklinamos: $${tr('x + y', 'xy')}$`,
          'nes vardikliai negali būti raidiniai',
          'nes reikėjo atimti',
          'iš tikrųjų tai teisinga',
        ],
        teisingas: 0,
        sprendimas: 'Sudedant vardikliai nesudedami.',
      }),

    // 7. Apibrėžimo sritis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kokia yra reiškinio $${tr('2', `x - ${c}`)} - ${tr('1', 'x')}$ apibrėžimo sritis?`,
        variantai: [
          `visi $x$, išskyrus $0$ ir $${c}$`,
          `visi $x$, išskyrus $${c}$`,
          `visi $x$, išskyrus $0$`,
          'visi realieji skaičiai',
        ],
        teisingas: 0,
        sprendimas: 'Nė vienas vardiklis negali būti nulis.',
      }),
  ])
}

// ── 5.4. Sudėtingesnių uždavinių sprendimas ─────────────────────────────────

const T4 = 'trupmeniniai-sudetingesni'

const A4 = [
  {
    klausimas: 'Išspręsk lygtį $\\dfrac{1}{x} = \\dfrac{1}{4}$, kai $x \\ne 0$.',
    atsakymas: '4',
    atsakymasRodymui: '$x = 4$',
    sprendimas: 'Lygios trupmenos su vienodais skaitikliais turi lygius vardiklius.',
  },
] as const

export const trupmeniniaiSudetingesni: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  const a = atsitiktinis(2, 12)
  const b = atsitiktinis(2, 9)
  const n = atsitiktinis(2, 9)

  return variacija([
    // 1. Paprasta lygtis su vardikliu
    () =>
      uzdavinys(T4, {
        klausimas: `Išspręsk lygtį $${tr('1', 'x')} = ${tr('1', String(a))}$, kai $x \\ne 0$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$x = ${a}$`,
        sprendimas: 'Vienodų skaitiklių trupmenos lygios, kai lygūs vardikliai.',
      }),

    // 2. Lygtis su dėmeniu
    () => {
      const k = atsitiktinis(2, 6)
      const dalis = k - 1
      if (dalis === 0 || b % dalis !== 0) return null
      return uzdavinys(T4, {
        klausimas: `Išspręsk lygtį $${tr(String(b), 'x')} + 1 = ${k}$, kai $x \\ne 0$.`,
        atsakymas: String(b / dalis),
        atsakymasRodymui: `$x = ${b / dalis}$`,
        sprendimas: `$${tr(String(b), 'x')} = ${dalis}$, tad $x = ${b / dalis}$.`,
      })
    },

    // 3. Supaprastinimas su skaidymu
    () =>
      uzdavinys(T4, {
        klausimas: `Supaprastink reiškinį $${tr(`x^2 - ${n * n}`, `x - ${n}`)} - x$, kai $x \\ne ${n}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${tr(`x^2 - ${n * n}`, `x - ${n}`)} = x + ${n}$; atėmus $x$ lieka $${n}$.`,
      }),

    // 4. Reikšmės apskaičiavimas
    () => {
      const x = atsitiktinis(3, 12)
      const virsus = x + 1
      const apacia = x - 1
      if (virsus % apacia !== 0) return null
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok reiškinio $${tr('x + 1', 'x - 1')}$ reikšmę, kai $x = ${x}$.`,
        atsakymas: String(virsus / apacia),
        atsakymasRodymui: `$${virsus / apacia}$`,
        sprendimas: `$\\dfrac{${virsus}}{${apacia}} = ${virsus / apacia}$.`,
      })
    },

    // 5. Kodėl reikia tikrinti sritį
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl išsprendus lygtį su kintamuoju vardiklyje būtina patikrinti gautus sprendinius?',
        variantai: [
          'nes panaikinus vardiklius gali atsirasti pašalinis sprendinys, draudžiamas apibrėžimo srityje',
          'nes skaičiavimai visada netikslūs',
          'nes lygtis gali neturėti sprendinių',
          'tikrinti nebūtina',
        ],
        teisingas: 0,
        sprendimas: 'Sprendinys, su kuriuo vardiklis lygus nuliui, netinka.',
      }),

    // 6. Pašalinis sprendinys
    () =>
      uzdavinys(T4, {
        klausimas: `Sprendžiant lygtį $${tr('x^2', `x - ${n}`)} = ${tr(String(n * n), `x - ${n}`)}$ gauta $x = ${n}$ ir $x = -${n}$. Kuris sprendinys netinka?`,
        atsakymas: String(n),
        atsakymasRodymui: `$x = ${n}$`,
        sprendimas: `Su $x = ${n}$ vardiklis lygus nuliui.`,
      }),

    // 7. Stačiakampio plotas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Stačiakampio ilgis $x + ${n}$, plotis $x - ${n}$, o plotas $x^2 - ${n * n}$. Kurios $x$ reikšmės prasmingos?`,
        variantai: [
          `tik $x > ${n}$, nes kraštinės turi būti teigiamos`,
          'visi realieji skaičiai',
          `tik $x < ${n}$`,
          `tik $x = ${n}$`,
        ],
        teisingas: 0,
        sprendimas: `Kai $x \\le ${n}$, plotis nebūtų teigiamas.`,
      }),
  ])
}

// ── 6.1. Lygčių sistemų sprendimas algebriniais būdais ──────────────────────

const T5 = 'sistemos-algebriskai'

const A5 = [
  {
    klausimas: 'Išspręsk sistemą $x + y = 7$ ir $x - y = 1$. Koks $x$?',
    atsakymas: '4',
    atsakymasRodymui: '$x = 4$',
    sprendimas: 'Sudėjus lygtis: $2x = 8$.',
  },
] as const

export const sistemosAlgebriskai: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const x = atsitiktinis(-5, 8)
  const y = atsitiktinis(-5, 8)
  const a1 = atsitiktinis(1, 5)
  const b1 = atsitiktinis(1, 5)
  const a2 = atsitiktinis(1, 5)
  const b2 = atsitiktinis(1, 5)
  if (a1 * b2 === a2 * b1) return null
  const c1 = a1 * x + b1 * y
  const c2 = a2 * x - b2 * y

  return variacija([
    // 1. Sudėties būdas
    () =>
      uzdavinys(T5, {
        klausimas: `Išspręsk sistemą $x + y = ${x + y}$ ir $x - y = ${x - y}$. Koks $x$?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Sudėjus lygtis: $2x = ${2 * x}$.`,
      }),

    // 2. Antrasis nežinomasis
    () =>
      uzdavinys(T5, {
        klausimas: `Išspręsk sistemą $x + y = ${x + y}$ ir $x - y = ${x - y}$. Koks $y$?`,
        atsakymas: String(y),
        atsakymasRodymui: `$y = ${y}$`,
        sprendimas: `Atėmus lygtis: $2y = ${2 * y}$.`,
      }),

    // 3. Keitimo būdas
    () => {
      const k = atsitiktinis(2, 4)
      const c = x
      return uzdavinys(T5, {
        klausimas: `Išspręsk sistemą $x = ${narys(k, 'y')}${plius(x - k * y)}$ ir $x + y = ${x + y}$. Koks $y$?`,
        atsakymas: String(y),
        atsakymasRodymui: `$y = ${y}$`,
        sprendimas: `Įrašius pirmąją lygtį į antrąją: $${k + 1}y${plius(c - k * y)} = ${x + y}$, tad $y = ${y}$.`,
      })
    },

    // 4. Patikra
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Ar pora $(${x}; ${y})$ tenkina sistemą $${narys(a1)} + ${narys(b1, 'y')} = ${c1}$ ir $${narys(a2)} - ${narys(b2, 'y')} = ${c2}$?`,
        variantai: ['taip, nes tenkina abi lygtis', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `Įrašius gaunama $${c1}$ ir $${c2}$.`,
      }),

    // 5. Kada patogus kuris būdas
    () =>
      poruUzdavinys(naujasId(T5), T5, {
        klausimas: 'Sujunk sistemos pavidalą su patogiausiu sprendimo būdu.',
        poros: [
          { kaire: 'vienas nežinomasis jau išreikštas', desine: 'keitimo būdas' },
          { kaire: 'koeficientai prie $y$ priešingi', desine: 'sudėties būdas' },
          { kaire: 'abiejose lygtyse išreikštas $y$', desine: 'sulyginimo būdas' },
          { kaire: 'reikia įvertinti sprendinių skaičių', desine: 'grafinis būdas' },
        ],
        sprendimas: 'Visi būdai duoda tą patį sprendinį — skiriasi tik darbo kiekis.',
      }),

    // 6. Parametras
    () => {
      const m = atsitiktinis(2, 6)
      const c = m * x - y
      return uzdavinys(T5, {
        klausimas: `Rask $m$, su kuria pora $(${x}; ${y})$ tenkintų lygtį $mx - y = ${c}$.`,
        atsakymas: String(m),
        atsakymasRodymui: `$m = ${m}$`,
        sprendimas: `$m \\cdot (${x}) - (${y}) = ${c}$, tad $m = ${m}$.`,
      })
    },

    // 7. Sistemos sudarymas
    () =>
      uzdavinys(T5, {
        klausimas: `Dviejų skaičių suma ${x + y}, o skirtumas ${x - y}. Koks didesnysis skaičius?`,
        atsakymas: String(Math.max(x, y)),
        atsakymasRodymui: `$${Math.max(x, y)}$`,
        sprendimas: `Sudėjus abi sąlygas gaunama dvigubas didesnysis skaičius.`,
      }),
  ])
}

// ── 6.2. Lygčių sistemų sprendimas grafiniu būdu ────────────────────────────

const T6 = 'sistemos-grafiskai'

const A6 = [
  {
    klausimas: 'Kiek sprendinių turi sistema, kurios grafikai yra lygiagrečios tiesės?',
    atsakymas: '0',
    atsakymasRodymui: '$0$',
    sprendimas: 'Lygiagrečios tiesės bendrų taškų neturi.',
  },
] as const

export const sistemosGrafiskai: Generatorius = () => suBandymais(kurk6, A6, T6)

function kurk6(): Uzdavinys | null {
  const x = atsitiktinis(-3, 3)
  const k1 = pasirink([1, 2, -1, -2])
  const k2 = pasirink([1, 2, -1, -2])
  if (k1 === k2) return null
  const y = k1 * x + atsitiktinis(-2, 2)
  const b1 = y - k1 * x
  const b2 = y - k2 * x
  if (Math.abs(b1) > 4 || Math.abs(b2) > 4 || Math.abs(y) > 5) return null

  return variacija([
    // 1. Sprendinys iš grafiko
    () =>
      uzdavinys(T6, {
        klausimas: 'Grafiškai nustatyk sistemos sprendinio abscisę.',
        atsakymas: String(x),
        atsakymasRodymui: `$(${x}; ${y})$`,
        sprendimas: 'Sprendinys — tiesių susikirtimo taškas.',
        brezinys: keliosKreives(
          [
            { f: (t) => k1 * t + b1 },
            { f: (t) => k2 * t + b2 },
          ],
          { taskai: [{ x, y }] },
        ),
      }),

    // 2. Ordinatė iš grafiko
    () =>
      uzdavinys(T6, {
        klausimas: 'Grafiškai nustatyk sistemos sprendinio ordinatę.',
        atsakymas: String(y),
        atsakymasRodymui: `$(${x}; ${y})$`,
        sprendimas: 'Ordinatė nuskaitoma nuo susikirtimo taško iki $y$ ašies.',
        brezinys: keliosKreives(
          [
            { f: (t) => k1 * t + b1 },
            { f: (t) => k2 * t + b2 },
          ],
          { taskai: [{ x, y, punktyrai: true }] },
        ),
      }),

    // 3. Lygiagrečios tiesės
    () =>
      uzdavinys(T6, {
        klausimas: 'Kiek sprendinių turi sistema, kurios grafikai yra lygiagrečios tiesės?',
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Lygiagrečios tiesės bendrų taškų neturi.',
      }),

    // 4. Sutampančios tiesės
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kiek sprendinių turi sistema, jei abi lygtys vaizduoja tą pačią tiesę?',
        variantai: ['be galo daug', 'vieną', 'nė vieno', 'du'],
        teisingas: 0,
        sprendimas: 'Kiekvienas tiesės taškas tenkina abi lygtis.',
      }),

    // 5. Ką reiškia susikirtimo taškas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Ką grafiniame sprendimo būde reiškia tiesių susikirtimo taškas?',
        variantai: [
          'porą, tenkinančią abi lygtis',
          'lygčių koeficientus',
          'sprendinių skaičių',
          'tiesių nuolydį',
        ],
        teisingas: 0,
        sprendimas: 'Tas taškas priklauso abiem tiesėms.',
      }),

    // 6. Nuskaitymo klaida
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Iš grafiko susikirtimo tašką $(2; 3)$ mokinys nuskaitė kaip $x = 3$, $y = 2$. Kodėl tai klaida?',
        variantai: [
          'nes poroje pirma rašoma abscisė $x$, o paskui ordinatė $y$',
          'nes taškas neteisingas',
          'nes grafikas netikslus',
          'iš tikrųjų tai tiesa',
        ],
        teisingas: 0,
        sprendimas: 'Koordinačių tvarka visada $(x; y)$.',
      }),

    // 7. Grafinio būdo tikslumas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kodėl grafinis būdas gali duoti tik apytikslį sprendinį?',
        variantai: [
          'nes susikirtimo taško koordinatės ne visada sveikosios ir jas sunku tiksliai nuskaityti',
          'nes tiesės braižomos neteisingai',
          'nes sprendinių visada daug',
          'jis visada tikslus',
        ],
        teisingas: 0,
        sprendimas: 'Tada rezultatą verta patikslinti algebriškai.',
      }),
  ])
}

// ── 6.3. Sudėtingesnių lygčių sistemų sprendimas ────────────────────────────

const T7 = 'sistemos-sudetingesnes'

const A7 = [
  {
    klausimas: 'Išspręsk sistemą $2(x + y) = 10$ ir $x - y = 1$. Koks $x$?',
    atsakymas: '3',
    atsakymasRodymui: '$x = 3$',
    sprendimas: 'Pirmoji lygtis supaprastėja iki $x + y = 5$.',
  },
] as const

export const sistemosSudetingesnes: Generatorius = () => suBandymais(kurk7, A7, T7)

function kurk7(): Uzdavinys | null {
  const x = atsitiktinis(1, 9)
  const y = atsitiktinis(1, 9)

  return variacija([
    // 1. Su skliaustais
    () =>
      uzdavinys(T7, {
        klausimas: `Išspręsk sistemą $2(x + y) = ${2 * (x + y)}$ ir $x - y = ${x - y}$. Koks $x$?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Pirmoji lygtis supaprastėja iki $x + y = ${x + y}$.`,
      }),

    // 2. Su trupmena
    () => {
      if (x % 2 !== 0) return null
      return uzdavinys(T7, {
        klausimas: `Išspręsk sistemą $${tr('x', '2')} + y = ${x / 2 + y}$ ir $x - y = ${x - y}$. Koks $y$?`,
        atsakymas: String(y),
        atsakymasRodymui: `$y = ${y}$`,
        sprendimas: `Pirmąją padauginus iš 2: $x + 2y = ${x + 2 * y}$.`,
      })
    },

    // 3. Su dešimtainėmis
    () => {
      if ((x * 2) % 10 !== 0) return null
      return uzdavinys(T7, {
        klausimas: `Išspręsk sistemą $0{,}2x + 0{,}5y = ${(0.2 * x + 0.5 * y).toFixed(1).replace('.', '{,}')}$ ir $x - y = ${x - y}$. Koks $x$?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: 'Pirmąją lygtį patogu padauginti iš 10.',
      })
    },

    // 4. Pirma supaprastinti
    () =>
      uzdavinys(T7, {
        klausimas: `Pirmiausia supaprastink, tada išspręsk: $2(x - 1) + y = ${2 * (x - 1) + y}$ ir $x + y = ${x + y}$. Koks $x$?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Pirmoji tampa $2x + y = ${2 * x + y}$.`,
      }),

    // 5. Be galo daug sprendinių
    () => {
      const s = x + y
      return uzdavinys(T7, {
        klausimas: `Su kuria $m$ reikšme sistema $x + y = ${s}$ ir $2x + 2y = m$ turėtų be galo daug sprendinių?`,
        atsakymas: String(2 * s),
        atsakymasRodymui: `$m = ${2 * s}$`,
        sprendimas: 'Antroji lygtis turi būti pirmosios kartotinė.',
      })
    },

    // 6. Kodėl galima dauginti
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kodėl galima vieną sistemos lygtį padauginti iš skaičiaus, o kitos nekeisti?',
        variantai: [
          'nes dauginant iš nenulinio skaičiaus tos lygties sprendiniai nesikeičia',
          'nes lygtys nesusijusios',
          'nes taip patogiau rašyti',
          'iš tikrųjų taip daryti negalima',
        ],
        teisingas: 0,
        sprendimas: 'Gaunama lygiavertė lygtis, tad ir sistemos sprendinys tas pats.',
      }),

    // 7. Patikra abiejose lygtyse
    () =>
      uzdavinys(T7, {
        klausimas: `Patikrink porą $(${x}; ${y})$ lygtyje $3x + 2y = ${3 * x + 2 * y}$. Kokia reikšmė gaunama kairėje pusėje?`,
        atsakymas: String(3 * x + 2 * y),
        atsakymasRodymui: `$${3 * x + 2 * y}$`,
        sprendimas: `$3 \\cdot ${x} + 2 \\cdot ${y} = ${3 * x + 2 * y}$.`,
      }),
  ])
}
