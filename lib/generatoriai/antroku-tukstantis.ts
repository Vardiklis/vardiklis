import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys } from './formatai'
import { juostineSchema, monetos, stulpeliuVeiksmas, type Moneta } from './pirmoku-vaizdai'
import { langeliuEile } from './vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 2 klasės tema „Skaičiai iki 1000“.
 *
 * Trylika potemių rėmėsi bendraisiais generatoriais: `sudetis-atimtis` duodavo
 * tuos pačius kelis veiksmus visose devyniose skaičiavimo potemėse, `skaitmenys`
 * — romėniškus skaitmenis, `pinigai` — kainas su kableliu.
 *
 * Šioje temoje esminis dalykas yra **šimtų skyrius**: trijų skaitmenų skaičius
 * skaidomas į šimtus, dešimtis ir vienetus, o sudedant ar atimant nauja
 * dešimtis arba šimtas gali susidaryti ar būti išardomas. Todėl atskiros
 * potemės yra „be peržengimo“, „sudarant apvalią dešimtį ar šimtą“ ir
 * „peržengiant“ — jos skiriasi ne skaičiais, o tuo, kas vyksta su skyriais.
 */

const VARDAI = ['Matas', 'Ieva', 'Emilis', 'Luknė', 'Greta', 'Tauras'] as const

/** Skaičiaus pavadinimas žodžiais — iki tūkstančio. */
const VIENETAI = [
  '', 'vienas', 'du', 'trys', 'keturi', 'penki', 'šeši', 'septyni', 'aštuoni', 'devyni',
]
const PAAUGLIAI = [
  'dešimt', 'vienuolika', 'dvylika', 'trylika', 'keturiolika', 'penkiolika',
  'šešiolika', 'septyniolika', 'aštuoniolika', 'devyniolika',
]
const DESIMTYS = [
  '', '', 'dvidešimt', 'trisdešimt', 'keturiasdešimt', 'penkiasdešimt',
  'šešiasdešimt', 'septyniasdešimt', 'aštuoniasdešimt', 'devyniasdešimt',
]

/** „trys šimtai keturiasdešimt du“ — kaip skaitoma pamokoje. */
function zodziais(n: number): string {
  const s = Math.floor(n / 100)
  const likutis = n % 100
  const dalys: string[] = []
  if (s > 0) dalys.push(`${VIENETAI[s]} ${s === 1 ? 'šimtas' : 'šimtai'}`)
  if (likutis >= 10 && likutis < 20) {
    dalys.push(PAAUGLIAI[likutis - 10])
  } else {
    const d = Math.floor(likutis / 10)
    const v = likutis % 10
    if (d > 0) dalys.push(DESIMTYS[d])
    if (v > 0) dalys.push(VIENETAI[v])
  }
  return dalys.join(' ')
}

function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 1000, 1000)
}

const SIMTU = { vns: 'šimtas', dgs: 'šimtai', kilm: 'šimtų' }
const DESIMCIU = { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' }
const VIENETU = { vns: 'vienetas', dgs: 'vienetai', kilm: 'vienetų' }

/**
 * „8 šimtai, 1 dešimtis ir 1 vienetas“.
 *
 * Kiekvienas skyrius derinamas atskirai: vienetas gali būti vienas, o šimtų —
 * aštuoni, tad viena bendra forma visiems trims netinka.
 */
function skyriaiZodziais(s: number, d: number, v: number): string {
  return `${s} ${derink(s, SIMTU)}, ${d} ${derink(d, DESIMCIU)} ir ${v} ${derink(v, VIENETU)}`
}

const KNYGU = { vns: 'knyga', dgs: 'knygos', kilm: 'knygų' }
const DEZIU = { vns: 'dėžė', dgs: 'dėžės', kilm: 'dėžių' }

// ── Kaip skaityti ir užrašyti skaičius iki 1000? ────────────────────────────

const A_SKAITYMAS = [
  {
    klausimas: 'Užrašyk skaitmenimis: trys šimtai keturiasdešimt du.',
    atsakymas: '342',
    atsakymasRodymui: '$342$',
    sprendimas: '3 šimtai, 4 dešimtys ir 2 vienetai — tai 342.',
  },
] as const

export const skaiciuSkaitymas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSkaityma(sritis), A_SKAITYMAS, 'skaiciu-skaitymas')

function kurkSkaityma(sritis?: Sritis | null): Uzdavinys | null {
  // Tūkstantis į žodžius neverčiamas: `zodziais` skirtas triženkliams.
  const maks = Math.min(riba(sritis), 999)
  if (maks < 200) return null
  const n = atsitiktinis(101, maks)

  return variacija([
    // 1. Užrašyk skaitmenimis
    () =>
      uzdavinys('skaiciu-skaitymas', {
        klausimas: `Užrašyk skaitmenimis: ${zodziais(n)}.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `${skyriaiZodziais(Math.floor(n / 100), Math.floor((n % 100) / 10), n % 10)} — tai ${n}.`,
      }),

    // 2. Kuris užrašas teisingas
    () => {
      const kitas = Math.floor(n / 10)
      if (kitas === n) return null
      return pasirinkimoUzdavinys(naujasId('skaiciu-skaitymas'), 'skaiciu-skaitymas', {
        klausimas: `Kaip skaitmenimis užrašomas skaičius „${zodziais(n)}“?`,
        variantai: [String(n), String(kitas), String(n + 100 > maks ? n - 100 : n + 100)],
        teisingas: 0,
        sprendimas: `Šimtų skaitmuo ${Math.floor(n / 100)}, dešimčių ${Math.floor((n % 100) / 10)}, vienetų ${n % 10}.`,
      })
    },

    // 3. Koks skaitmuo šimtų skyriuje
    () =>
      uzdavinys('skaiciu-skaitymas', {
        klausimas: `Koks skaitmuo yra skaičiaus ${n} šimtų skyriuje?`,
        atsakymas: String(Math.floor(n / 100)),
        atsakymasRodymui: `$${Math.floor(n / 100)}$`,
        sprendimas: `Skaičiuje ${n} pirmasis skaitmuo rodo šimtus — jų yra ${Math.floor(n / 100)}.`,
      }),

    // 4. Kuriame skaičiuje nulis viduryje
    () => {
      const s = atsitiktinis(1, Math.min(9, Math.floor(maks / 100)))
      const v = atsitiktinis(1, 9)
      const suNuliu = s * 100 + v
      if (suNuliu > maks) return null
      return uzdavinys('skaiciu-skaitymas', {
        klausimas: `Užrašyk skaitmenimis: ${zodziais(suNuliu)}.`,
        atsakymas: String(suNuliu),
        atsakymasRodymui: `$${suNuliu}$`,
        sprendimas: `Dešimčių nėra, tad jų vietoje rašomas nulis: ${suNuliu}.`,
      })
    },

    // 5. Kuris skaičius didesnis
    () => {
      const kitas = atsitiktinis(101, maks)
      if (kitas === n) return null
      return uzdavinys('skaiciu-skaitymas', {
        klausimas: `Kuris skaičius didesnis: ${n} ar ${kitas}?`,
        atsakymas: String(Math.max(n, kitas)),
        atsakymasRodymui: `$${Math.max(n, kitas)}$`,
        sprendimas:
          Math.floor(n / 100) !== Math.floor(kitas / 100)
            ? `Pirmiausia lyginame šimtus: ${Math.floor(Math.max(n, kitas) / 100)} šimtai daugiau nei ${Math.floor(Math.min(n, kitas) / 100)}.`
            : `Šimtų po lygiai, tad lyginame toliau: ${Math.max(n, kitas)} didesnis.`,
      })
    },
  ])
}

// ── Kokia yra triženklių skaičių sandara? ───────────────────────────────────

const A_SANDARA = [
  {
    klausimas: 'Kiek šimtų yra skaičiuje 572?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Skaičių 572 sudaro 5 šimtai, 7 dešimtys ir 2 vienetai.',
  },
] as const

export const trizenkliuSandara: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSandara(sritis), A_SANDARA, 'trizenkliu-sandara')

function kurkSandara(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  if (maks < 200) return null
  const s = atsitiktinis(1, Math.min(9, Math.floor(maks / 100)))
  const d = atsitiktinis(1, 9)
  const v = atsitiktinis(1, 9)
  const n = s * 100 + d * 10 + v
  if (n > maks) return null

  return variacija([
    // 1. Kiek šimtų
    () =>
      uzdavinys('trizenkliu-sandara', {
        klausimas: `Kiek šimtų yra skaičiuje ${n}?`,
        atsakymas: String(s),
        atsakymasRodymui: `$${s}$`,
        sprendimas: `Skaičių ${n} sudaro ${skyriaiZodziais(s, d, v)}.`,
      }),

    // 2. Kiek dešimčių
    () =>
      uzdavinys('trizenkliu-sandara', {
        klausimas: `Kiek dešimčių yra skaičiaus ${n} dešimčių skyriuje?`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}$`,
        sprendimas: `Vidurinis skaitmuo rodo dešimtis — jų ${d}.`,
      }),

    // 3. Skaičius iš skyrių
    () =>
      uzdavinys('trizenkliu-sandara', {
        klausimas: `Užrašyk skaičių: ${skyriaiZodziais(s, d, v)}.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${s * 100} + ${d * 10} + ${v} = ${n}$.`,
      }),

    // 4. Išskaidymas
    () =>
      uzdavinys('trizenkliu-sandara', {
        klausimas: `Išskaidyk: $${n} = ${s * 100} + ${d * 10} + \\square$`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$`,
        sprendimas: `Liko vienetai: $${n} - ${s * 100} - ${d * 10} = ${v}$.`,
      }),

    // 5. Kiek iš viso dešimčių
    () =>
      uzdavinys('trizenkliu-sandara', {
        klausimas: `Kiek iš viso pilnų dešimčių yra skaičiuje ${n}?`,
        atsakymas: String(Math.floor(n / 10)),
        atsakymasRodymui: `$${Math.floor(n / 10)}$`,
        sprendimas: `Kiekvienas šimtas turi 10 dešimčių: $${s} \\cdot 10 + ${d} = ${Math.floor(n / 10)}$.`,
      }),
  ])
}

// ── Kaip stambinti ir smulkinti pinigus? ────────────────────────────────────

const A_PINIGAI = [
  {
    klausimas: 'Užbaik: $1$ Eur $=\\square$ ct.',
    atsakymas: '100',
    atsakymasRodymui: '$100$ ct',
    sprendimas: 'Viename eure yra 100 centų.',
  },
] as const

export const piniguStambinimas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkPinigus(sritis), A_PINIGAI, 'pinigu-stambinimas')

function kurkPinigus(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const eurai = atsitiktinis(2, Math.min(9, Math.floor(maks / 100)))
  const centai = atsitiktinis(1, 9) * 10
  const isViso = eurai * 100 + centai

  return variacija([
    // 1. Kiek centų viename eure
    () =>
      uzdavinys('pinigu-stambinimas', {
        klausimas: 'Užbaik: $1$ Eur $=\\square$ ct.',
        atsakymas: '100',
        atsakymasRodymui: '$100$ ct',
        sprendimas: 'Viename eure yra 100 centų.',
        brezinys: monetos([100] as Moneta[]),
      }),

    // 2. Kiek centų keliuose euruose
    () =>
      uzdavinys('pinigu-stambinimas', {
        klausimas: `Kiek centų yra ${eurai} Eur?`,
        atsakymas: String(eurai * 100),
        atsakymasRodymui: `$${eurai * 100}$ ct`,
        sprendimas: `Kiekviename eure po 100 ct: $${eurai} \\cdot 100 = ${eurai * 100}$ ct.`,
      }),

    // 3. Centus paversti eurais ir centais
    () =>
      uzdavinys('pinigu-stambinimas', {
        klausimas: `${isViso} ct paversk eurais ir centais. Kiek gausi eurų?`,
        atsakymas: String(eurai),
        atsakymasRodymui: `$${eurai}$ Eur`,
        sprendimas: `${isViso} ct yra ${eurai} Eur ir ${centai} ct.`,
      }),

    // 4. Kiek centų lieka
    () =>
      uzdavinys('pinigu-stambinimas', {
        klausimas: `${isViso} ct yra ${eurai} Eur ir dar kiek centų?`,
        atsakymas: String(centai),
        atsakymasRodymui: `$${centai}$ ct`,
        sprendimas: `$${isViso} - ${eurai * 100} = ${centai}$ ct.`,
      }),

    // 5. Kuri suma lygi
    () =>
      pasirinkimoUzdavinys(naujasId('pinigu-stambinimas'), 'pinigu-stambinimas', {
        klausimas: `Kuri suma lygi ${eurai} Eur ${centai} ct?`,
        variantai: [`${isViso} ct`, `${eurai * 100 + centai / 10} ct`, `${eurai + centai} ct`],
        teisingas: 0,
        sprendimas: `$${eurai} \\cdot 100 + ${centai} = ${isViso}$ ct.`,
      }),
  ])
}

// ── Triženklių skaičių seka ─────────────────────────────────────────────────

const A_SEKA = [
  {
    klausimas: 'Tęsk: 120, 140, 160, $\\square$.',
    atsakymas: '180',
    atsakymasRodymui: '$180$',
    sprendimas: 'Kiekvienas kitas skaičius 20 didesnis.',
  },
] as const

export const trizenkliuSekos: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSeka(sritis), A_SEKA, 'trizenkliu-sekos')

function kurkSeka(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const zingsnis = pasirink([10, 20, 50, 100])
  const didejanti = atsitiktinis(0, 1) === 1
  const pradzia = didejanti
    ? atsitiktinis(1, Math.max(1, Math.floor((maks - 4 * zingsnis) / 10))) * 10
    : atsitiktinis(Math.floor((4 * zingsnis) / 10) + 1, Math.floor(maks / 10)) * 10
  const nariai = [0, 1, 2, 3].map((i) => pradzia + (didejanti ? 1 : -1) * i * zingsnis)
  if (nariai.some((n) => n < 0 || n > maks)) return null
  const kitas = pradzia + (didejanti ? 1 : -1) * 4 * zingsnis
  if (kitas < 0 || kitas > maks) return null

  return variacija([
    // 1. Koks skaičius eina toliau
    () =>
      uzdavinys('trizenkliu-sekos', {
        klausimas: `Tęsk: ${nariai.join(', ')}, $\\square$.`,
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        sprendimas: `Kiekvienas kitas skaičius ${zingsnis} ${didejanti ? 'didesnis' : 'mažesnis'}: $${nariai[3]} ${didejanti ? '+' : '-'} ${zingsnis} = ${kitas}$.`,
        brezinys: langeliuEile([...nariai, null], true),
      }),

    // 2. Trūkstamas vidurinis narys
    () =>
      uzdavinys('trizenkliu-sekos', {
        klausimas: `Rask trūkstamą: ${nariai[0]}, ${nariai[1]}, $\\square$, ${nariai[3]}.`,
        atsakymas: String(nariai[2]),
        atsakymasRodymui: `$${nariai[2]}$`,
        sprendimas: `Seka keičiasi po ${zingsnis}: $${nariai[1]} ${didejanti ? '+' : '-'} ${zingsnis} = ${nariai[2]}$.`,
        brezinys: langeliuEile([nariai[0], nariai[1], null, nariai[3]], true),
      }),

    // 3. Kokia taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId('trizenkliu-sekos'), 'trizenkliu-sekos', {
        klausimas: `Pasirink sekos ${nariai.join(', ')} taisyklę.`,
        variantai: [
          `${didejanti ? '+' : '−'}${zingsnis}`,
          `${didejanti ? '−' : '+'}${zingsnis}`,
          `${didejanti ? '+' : '−'}${zingsnis === 100 ? 10 : zingsnis * 2}`,
        ],
        teisingas: 0,
        sprendimas: `Nuo ${nariai[0]} iki ${nariai[1]} skirtumas yra ${zingsnis}.`,
      }),

    // 4. Kiek keičiasi kiekvienas narys
    () =>
      uzdavinys('trizenkliu-sekos', {
        klausimas: `Keliais vienetais keičiasi kiekvienas sekos ${nariai.join(', ')} narys?`,
        atsakymas: String(zingsnis),
        atsakymasRodymui: `$${zingsnis}$`,
        sprendimas: `$${Math.abs(nariai[1] - nariai[0])}$ — tiek pat ir tarp kitų gretimų narių.`,
      }),

    // 5. Koks buvo narys prieš pirmąjį
    () => {
      const pries = pradzia - (didejanti ? 1 : -1) * zingsnis
      if (pries < 0 || pries > maks) return null
      return uzdavinys('trizenkliu-sekos', {
        klausimas: `Koks skaičius buvo prieš sekos pradžią: $\\square$, ${nariai.join(', ')}?`,
        atsakymas: String(pries),
        atsakymasRodymui: `$${pries}$`,
        sprendimas: `Einant atgal veiksmas atvirkščias: $${pradzia} ${didejanti ? '-' : '+'} ${zingsnis} = ${pries}$.`,
      })
    },
  ])
}

// ── Sudėtis iki 1000 ────────────────────────────────────────────────────────

/** Pora be jokio peržengimo: nė viename skyriuje suma neviršija 9. */
function poraBePerejimo(maks: number): { a: number; b: number } | null {
  const aS = atsitiktinis(1, 7)
  const aD = atsitiktinis(0, 4)
  const aV = atsitiktinis(0, 4)
  const bS = atsitiktinis(1, Math.min(2, 9 - aS))
  const bD = atsitiktinis(0, 9 - aD)
  const bV = atsitiktinis(0, 9 - aV)
  const a = aS * 100 + aD * 10 + aV
  const b = bS * 100 + bD * 10 + bV
  if (a + b > maks || b < 10) return null
  return { a, b }
}

const A_SUDETIS = [
  {
    klausimas: 'Apskaičiuok: $320 + 145$',
    atsakymas: '465',
    atsakymasRodymui: '$465$',
    sprendimas: 'Šimtai: $300 + 100 = 400$. Dešimtys: $20 + 40 = 60$. Vienetai: $0 + 5 = 5$.',
  },
] as const

export const sudetisIki1000: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSudeti(sritis), A_SUDETIS, 'sudetis-iki-1000')

function kurkSudeti(sritis?: Sritis | null): Uzdavinys | null {
  const pora = poraBePerejimo(riba(sritis))
  if (!pora) return null
  const { a, b } = pora
  const suma = a + b

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('sudetis-iki-1000', {
        klausimas: `Apskaičiuok: $${a} + ${b}$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Šimtai: $${Math.floor(a / 100) * 100} + ${Math.floor(b / 100) * 100} = ${(Math.floor(a / 100) + Math.floor(b / 100)) * 100}$. Vienetų ir dešimčių sudėjus gaunama ${suma}.`,
      }),

    // 2. Kiek šimtų sumoje
    () =>
      uzdavinys('sudetis-iki-1000', {
        klausimas: `Sudedame $${a} + ${b}$. Kiek gausi sudėjęs šimtus?`,
        atsakymas: String((Math.floor(a / 100) + Math.floor(b / 100)) * 100),
        atsakymasRodymui: `$${(Math.floor(a / 100) + Math.floor(b / 100)) * 100}$`,
        sprendimas: `$${Math.floor(a / 100) * 100} + ${Math.floor(b / 100) * 100} = ${(Math.floor(a / 100) + Math.floor(b / 100)) * 100}$.`,
      }),

    // 3. Tekstinis — biblioteka
    () =>
      uzdavinys('sudetis-iki-1000', {
        klausimas: `Bibliotekoje buvo ${a} ${derink(a, KNYGU)}, atvežė dar ${b}. Kiek knygų dabar?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      }),

    // 4. Užbaigimas
    () =>
      uzdavinys('sudetis-iki-1000', {
        klausimas: `Užbaik: $${a} + ${b} = \\square$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      }),

    // 5. Pasirinkimas
    () => {
      const netiesos = [...new Set([suma + 100, suma - 100, suma + 10])].filter(
        (x) => x > 0 && x !== suma && x <= 1000,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('sudetis-iki-1000'), 'sudetis-iki-1000', {
        klausimas: `Pasirink teisingą atsakymą: $${a} + ${b}$`,
        variantai: [String(suma), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      })
    },
  ])
}

// ── Sudėtis sudarant apvalią dešimtį ar šimtą ───────────────────────────────

const A_APVALI = [
  {
    klausimas: 'Apskaičiuok: $268 + 32$',
    atsakymas: '300',
    atsakymasRodymui: '$300$',
    sprendimas: 'Susidaro apvalus šimtas: $268 + 32 = 300$.',
  },
] as const

export const sudetisIkiApvalaus: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkApvalu(sritis), A_APVALI, 'sudetis-iki-apvalaus')

function kurkApvalu(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const apvalus = atsitiktinis(2, Math.floor(maks / 100)) * 100
  const b = atsitiktinis(2, 9) * atsitiktinis(2, 9)
  const a = apvalus - b
  if (a < 100 || b > 99) return null

  return variacija([
    // 1. Iki apvalaus šimto
    () =>
      uzdavinys('sudetis-iki-apvalaus', {
        klausimas: `Apskaičiuok: $${a} + ${b}$`,
        atsakymas: String(apvalus),
        atsakymasRodymui: `$${apvalus}$`,
        sprendimas: `Vienetai ir dešimtys papildo iki apvalaus šimto: $${a} + ${b} = ${apvalus}$.`,
      }),

    // 2. Kiek trūksta iki apvalaus šimto
    () =>
      uzdavinys('sudetis-iki-apvalaus', {
        klausimas: `Kiek trūksta skaičiui ${a} iki ${apvalus}?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${apvalus} - ${a} = ${b}$.`,
      }),

    // 3. Užbaik lygybę
    () =>
      uzdavinys('sudetis-iki-apvalaus', {
        klausimas: `Užbaik: $${a} + \\square = ${apvalus}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${apvalus} - ${a} = ${b}$.`,
      }),

    // 4. Kuri apvali dešimtis eina po
    () => {
      const v = a % 10
      if (v === 0) return null
      const desimtis = a + (10 - v)
      return uzdavinys('sudetis-iki-apvalaus', {
        klausimas: `Kuri apvali dešimtis eina tuoj po ${a}?`,
        atsakymas: String(desimtis),
        atsakymasRodymui: `$${desimtis}$`,
        sprendimas: `Iki jos trūksta ${10 - v}: $${a} + ${10 - v} = ${desimtis}$.`,
      })
    },

    // 5. Pasirinkimas
    () =>
      pasirinkimoUzdavinys(naujasId('sudetis-iki-apvalaus'), 'sudetis-iki-apvalaus', {
        klausimas: `Pasirink teisingą atsakymą: $${a} + ${b}$`,
        variantai: [String(apvalus), String(apvalus - 10), String(apvalus + 10)],
        teisingas: 0,
        sprendimas: `Susidaro apvalus šimtas: $${a} + ${b} = ${apvalus}$.`,
      }),
  ])
}

// ── Sudėtis peržengiant dešimtį ir šimtą ────────────────────────────────────

/** Pora, kurioje peržengiami ir vienetai, ir dešimtys. */
function poraSuPerejimu(maks: number): { a: number; b: number } | null {
  const aV = atsitiktinis(5, 9)
  const bV = atsitiktinis(11 - aV, 9)
  const aD = atsitiktinis(5, 9)
  const bD = atsitiktinis(10 - aD, 9)
  const aS = atsitiktinis(1, 5)
  const bS = atsitiktinis(1, Math.max(1, 8 - aS))
  const a = aS * 100 + aD * 10 + aV
  const b = bS * 100 + bD * 10 + bV
  if (a + b > maks) return null
  return { a, b }
}

const A_PERZENGIANT = [
  {
    klausimas: 'Apskaičiuok: $378 + 246$',
    atsakymas: '624',
    atsakymasRodymui: '$624$',
    sprendimas: 'Vienetai duoda naują dešimtį, dešimtys — naują šimtą.',
  },
] as const

export const sudetisPerzengiant: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkPerzengiant(sritis), A_PERZENGIANT, 'sudetis-perzengiant')

function kurkPerzengiant(sritis?: Sritis | null): Uzdavinys | null {
  const pora = poraSuPerejimu(riba(sritis))
  if (!pora) return null
  const { a, b } = pora
  const suma = a + b
  const aV = a % 10
  const bV = b % 10

  return variacija([
    // 1. Stulpeliu
    () =>
      uzdavinys('sudetis-perzengiant', {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Vienetai: $${aV} + ${bV} = ${aV + bV}$ — susidaro dešimtis. Sudėjus dešimtis susidaro ir naujas šimtas.`,
        brezinys: stulpeliuVeiksmas(a, b, '+'),
      }),

    // 2. Grynas veiksmas
    () =>
      uzdavinys('sudetis-perzengiant', {
        klausimas: `Apskaičiuok: $${a} + ${b}$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      }),

    // 3. Koks skaitmuo vienetų skyriuje
    () =>
      uzdavinys('sudetis-perzengiant', {
        klausimas: 'Koks skaitmuo rašomas vienetų skyriuje?',
        atsakymas: String((aV + bV) % 10),
        atsakymasRodymui: `$${(aV + bV) % 10}$`,
        sprendimas: `$${aV} + ${bV} = ${aV + bV}$, tad rašome ${(aV + bV) % 10}, o dešimtį perkeliame.`,
        brezinys: stulpeliuVeiksmas(a, b, '+'),
      }),

    // 4. Rask klaidą
    () => {
      const klaida = suma - 100
      if (klaida <= 0) return null
      return pasirinkimoUzdavinys(naujasId('sudetis-perzengiant'), 'sudetis-perzengiant', {
        klausimas: 'Veiksmas atliktas su klaida. Kur suklysta?',
        variantai: [
          'pamirštas iš dešimčių susidaręs šimtas',
          'sudėti ne tie vienetai',
          'skaičiai užrašyti ne vienas po kitu',
        ],
        teisingas: 0,
        sprendimas: `Teisingas atsakymas yra ${suma}, o ne ${klaida}.`,
        brezinys: stulpeliuVeiksmas(a, b, '+', klaida),
      })
    },

    // 5. Ar susidaro naujas šimtas
    () =>
      pasirinkimoUzdavinys(naujasId('sudetis-perzengiant'), 'sudetis-perzengiant', {
        klausimas: `Sudedant $${a} + ${b}$, ar iš dešimčių susidaro naujas šimtas?`,
        variantai: ['taip, jį reikia pasižymėti', 'ne, nesusidaro', 'susidaro du šimtai'],
        teisingas: 0,
        sprendimas: `Dešimčių suma peržengia 10, tad į šimtų skyrių perkeliamas vienetas.`,
      }),
  ])
}

// ── Atimtis iki 1000 ────────────────────────────────────────────────────────

const A_ATIMTIS = [
  {
    klausimas: 'Apskaičiuok: $685 - 243$',
    atsakymas: '442',
    atsakymasRodymui: '$442$',
    sprendimas: 'Šimtai: $600 - 200 = 400$. Dešimtys: $80 - 40 = 40$. Vienetai: $5 - 3 = 2$.',
  },
] as const

export const atimtisIki1000: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkAtimti(sritis), A_ATIMTIS, 'atimtis-iki-1000')

function kurkAtimti(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const aS = atsitiktinis(4, Math.min(9, Math.floor(maks / 100)))
  const aD = atsitiktinis(2, 9)
  const aV = atsitiktinis(2, 9)
  const a = aS * 100 + aD * 10 + aV
  const b = atsitiktinis(1, aS - 1) * 100 + atsitiktinis(0, aD) * 10 + atsitiktinis(0, aV)
  if (a > maks || b < 100) return null
  const sk = a - b

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('atimtis-iki-1000', {
        klausimas: `Apskaičiuok: $${a} - ${b}$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Šimtai: $${aS * 100} - ${Math.floor(b / 100) * 100} = ${(aS - Math.floor(b / 100)) * 100}$. Atėmus dešimtis ir vienetus gaunama ${sk}.`,
      }),

    // 2. Kiek šimtų liks
    () =>
      uzdavinys('atimtis-iki-1000', {
        klausimas: `Atimame $${a} - ${b}$. Kiek šimtų liks?`,
        atsakymas: String(aS - Math.floor(b / 100)),
        atsakymasRodymui: `$${aS - Math.floor(b / 100)}$`,
        sprendimas: `$${aS} - ${Math.floor(b / 100)} = ${aS - Math.floor(b / 100)}$ šimtai.`,
      }),

    // 3. Tekstinis
    () =>
      uzdavinys('atimtis-iki-1000', {
        klausimas: `Buvo ${a} Eur, išleido ${b} Eur. Kiek liko?`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$ Eur`,
        sprendimas: `$${a} - ${b} = ${sk}$ Eur.`,
      }),

    // 4. Užbaigimas
    () =>
      uzdavinys('atimtis-iki-1000', {
        klausimas: `Užbaik: $${a} - ${b} = \\square$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      }),

    // 5. Pasirinkimas
    () => {
      const netiesos = [...new Set([sk + 100, sk - 100, sk + 10])].filter(
        (x) => x > 0 && x !== sk,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('atimtis-iki-1000'), 'atimtis-iki-1000', {
        klausimas: `Pasirink teisingą atsakymą: $${a} - ${b}$`,
        variantai: [String(sk), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      })
    },
  ])
}

// ── Atimtis iš apvalių dešimčių ir šimtų ────────────────────────────────────

const A_IS_APVALAUS = [
  {
    klausimas: 'Apskaičiuok: $500 - 170$',
    atsakymas: '330',
    atsakymasRodymui: '$330$',
    sprendimas: 'Iš apvalaus šimto tenka išardyti vieną šimtą.',
  },
] as const

export const atimtisIsApvalaus: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkIsApvalaus(sritis), A_IS_APVALAUS, 'atimtis-is-apvalaus')

function kurkIsApvalaus(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(4, Math.floor(maks / 100)) * 100
  const b = atsitiktinis(1, a / 100 - 1) * 100 + atsitiktinis(1, 9) * 10
  if (b >= a) return null
  const sk = a - b

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('atimtis-is-apvalaus', {
        klausimas: `Apskaičiuok: $${a} - ${b}$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Iš apvalaus skaičiaus ${a} tenka išardyti vieną šimtą: $${a} - ${b} = ${sk}$.`,
      }),

    // 2. Kiek dešimčių turi apvalus šimtas
    () =>
      uzdavinys('atimtis-is-apvalaus', {
        klausimas: `Kiek dešimčių yra skaičiuje ${a}?`,
        atsakymas: String(a / 10),
        atsakymasRodymui: `$${a / 10}$`,
        sprendimas: `Kiekvienas šimtas turi 10 dešimčių: $${a / 100} \\cdot 10 = ${a / 10}$.`,
      }),

    // 3. Užbaigimas
    () =>
      uzdavinys('atimtis-is-apvalaus', {
        klausimas: `Užbaik: $${a} - ${b} = \\square$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      }),

    // 4. Kodėl reikia išardyti
    () =>
      pasirinkimoUzdavinys(naujasId('atimtis-is-apvalaus'), 'atimtis-is-apvalaus', {
        klausimas: `Kodėl skaičiuojant $${a} - ${b}$ tenka išardyti šimtą?`,
        variantai: [
          `${a} neturi nė vienos dešimties`,
          `${b} yra per didelis`,
          'šimtai visada ardomi',
        ],
        teisingas: 0,
        sprendimas: `Apvalus skaičius ${a} dešimčių skyriuje turi 0, o atimti reikia ${Math.floor((b % 100) / 10)} dešimtis.`,
      }),

    // 5. Pasirinkimas
    () => {
      const netiesos = [...new Set([sk + 100, sk - 100])].filter((x) => x > 0 && x !== sk)
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('atimtis-is-apvalaus'), 'atimtis-is-apvalaus', {
        klausimas: `Pasirink teisingą atsakymą: $${a} - ${b}$`,
        variantai: [String(sk), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      })
    },
  ])
}

// ── Atimtis išardant dešimtį ir šimtą ───────────────────────────────────────

const A_ISARDANT = [
  {
    klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
    atsakymas: '254',
    atsakymasRodymui: '$254$',
    sprendimas: 'Vienetų neužtenka — išardoma dešimtis, o dešimčių — šimtas.',
  },
] as const

export const atimtisIsardant: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkIsardant(sritis), A_ISARDANT, 'atimtis-isardant')

function kurkIsardant(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const aV = atsitiktinis(0, 6)
  const bV = atsitiktinis(aV + 1, 9)
  const aD = atsitiktinis(0, 6)
  const bD = atsitiktinis(aD + 1, 9)
  const aS = atsitiktinis(5, Math.min(9, Math.floor(maks / 100)))
  const bS = atsitiktinis(1, aS - 2)
  const a = aS * 100 + aD * 10 + aV
  const b = bS * 100 + bD * 10 + bV
  if (a > maks || b >= a) return null
  const sk = a - b

  return variacija([
    // 1. Stulpeliu
    () =>
      uzdavinys('atimtis-isardant', {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Iš ${aV} vienetų ${bV} atimti negalime — išardome dešimtį: $${aV + 10} - ${bV} = ${aV + 10 - bV}$. Paskui tenka išardyti ir šimtą.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),

    // 2. Grynas veiksmas
    () =>
      uzdavinys('atimtis-isardant', {
        klausimas: `Apskaičiuok: $${a} - ${b}$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      }),

    // 3. Kiek vienetų po išardymo
    () =>
      uzdavinys('atimtis-isardant', {
        klausimas: 'Kiek vienetų gaunasi išardžius vieną dešimtį?',
        atsakymas: String(aV + 10 - bV),
        atsakymasRodymui: `$${aV + 10 - bV}$`,
        sprendimas: `Išardę dešimtį turime ${aV + 10} vienetų: $${aV + 10} - ${bV} = ${aV + 10 - bV}$.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),

    // 4. Ar reikia ardyti šimtą
    () =>
      pasirinkimoUzdavinys(naujasId('atimtis-isardant'), 'atimtis-isardant', {
        klausimas: 'Ar atimant dešimtis prireiks išardyti šimtą?',
        variantai: ['taip, dešimčių neužtenka', 'ne, dešimčių užtenka', 'šimto ardyti niekada nereikia'],
        teisingas: 0,
        sprendimas: `Po pirmojo išardymo dešimčių lieka ${aD - 1 < 0 ? 9 : aD - 1}, o atimti reikia ${bD}.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),

    // 5. Rask klaidą
    () => {
      const klaida = sk + 100
      return pasirinkimoUzdavinys(naujasId('atimtis-isardant'), 'atimtis-isardant', {
        klausimas: 'Veiksmas atliktas su klaida. Kur suklysta?',
        variantai: [
          'pamiršta, kad buvo išardytas šimtas',
          'sumaišyti vienetų skaitmenys',
          'skaičiai užrašyti ne vienas po kitu',
        ],
        teisingas: 0,
        sprendimas: `Teisingas atsakymas ${sk}, o ne ${klaida}.`,
        brezinys: stulpeliuVeiksmas(a, b, '−', klaida),
      })
    },
  ])
}

// ── Dviejų žingsnių uždavinio schema ir sprendimas ──────────────────────────

/** Trys skaičiai dviejų žingsnių uždaviniui: buvo, pridėta, atimta. */
function trysZingsniai(maks: number) {
  const buvo = atsitiktinis(100, Math.min(600, maks - 200))
  const pridejo = atsitiktinis(30, 200)
  const paeme = atsitiktinis(20, buvo + pridejo - 10)
  return { buvo, pridejo, paeme, rez: buvo + pridejo - paeme }
}

const A_SCHEMA = [
  {
    klausimas: 'Kuri schema tinka uždaviniui?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — pirma sudėtis, paskui atimtis',
    sprendimas: 'Uždavinyje kiekis pirma padidėja, paskui sumažėja.',
  },
] as const

export const dviejuZingsniuSchema: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSchema(sritis), A_SCHEMA, 'dvieju-zingsniu-schema')

function kurkSchema(sritis?: Sritis | null): Uzdavinys | null {
  const { buvo, pridejo, paeme, rez } = trysZingsniai(riba(sritis))
  if (rez < 0 || buvo + pridejo > riba(sritis)) return null

  return variacija([
    // 1. Kuri schema tinka
    () =>
      pasirinkimoUzdavinys(naujasId('dvieju-zingsniu-schema'), 'dvieju-zingsniu-schema', {
        klausimas: `Buvo ${buvo} obuoliai. Atvežė dar ${pridejo}, tada pardavė ${paeme}. Kuri veiksmų eilė tinka?`,
        variantai: [
          `$${buvo} + ${pridejo} - ${paeme}$`,
          `$${buvo} - ${pridejo} + ${paeme}$`,
          `$${buvo} + ${pridejo} + ${paeme}$`,
        ],
        teisingas: 0,
        sprendimas: 'Pirma kiekis padidėja (atvežė), paskui sumažėja (pardavė).',
        brezinys: juostineSchema(buvo + pridejo, paeme, null),
      }),

    // 2. Kuris tekstas tinka schemai
    () =>
      pasirinkimoUzdavinys(naujasId('dvieju-zingsniu-schema'), 'dvieju-zingsniu-schema', {
        klausimas: `Pateikta veiksmų eilė $${buvo} + ${pridejo} - ${paeme}$. Kuris tekstas jai tinka?`,
        variantai: [
          `Buvo ${buvo}, atvežė ${pridejo}, išvežė ${paeme}.`,
          `Buvo ${buvo}, išvežė ${pridejo}, atvežė ${paeme}.`,
          `Buvo ${buvo}, atvežė ${pridejo} ir dar ${paeme}.`,
        ],
        teisingas: 0,
        sprendimas: 'Pliusas atitinka atvežimą, minusas — išvežimą.',
      }),

    // 3. Kiek gausis po pirmo veiksmo
    () =>
      uzdavinys('dvieju-zingsniu-schema', {
        klausimas: `Buvo ${buvo}, atvežė ${pridejo}, išvežė ${paeme}. Kiek buvo po atvežimo?`,
        atsakymas: String(buvo + pridejo),
        atsakymasRodymui: `$${buvo + pridejo}$`,
        sprendimas: `Pirmas veiksmas: $${buvo} + ${pridejo} = ${buvo + pridejo}$.`,
        brezinys: juostineSchema(null, buvo, pridejo),
      }),

    // 4. Kiek veiksmų reikia
    () =>
      uzdavinys('dvieju-zingsniu-schema', {
        klausimas: `Buvo ${buvo} ${derink(buvo, DEZIU)}. Atvežė ${pridejo}, išvežė ${paeme}. Iš kiek veiksmų susideda sprendimas?`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Pirma sudedame, paskui atimame — du veiksmai.',
      }),

    // 5. Kuris klausimas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('dvieju-zingsniu-schema'), 'dvieju-zingsniu-schema', {
        klausimas: `Sandėlyje buvo ${buvo} ${derink(buvo, DEZIU)}. Atvežė ${pridejo}, išvežė ${paeme}. Kuris klausimas reikalauja dviejų veiksmų?`,
        variantai: [
          'Kiek dėžių liko sandėlyje?',
          'Kiek dėžių atvežė?',
          'Kiek dėžių buvo iš pradžių?',
        ],
        teisingas: 0,
        sprendimas: 'Atvežimą ir išvežimą reikia suskaičiuoti abu — tai du veiksmai.',
      }),
  ])
}

const A_SPRENDIMAS = [
  {
    klausimas: 'Buvo 150 lipdukų. Gavo 70, atidavė 40. Kiek liko?',
    atsakymas: '180',
    atsakymasRodymui: '$180$',
    sprendimas: '$150 + 70 = 220$, tada $220 - 40 = 180$.',
  },
] as const

export const dviejuZingsniuSprendimas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSprendima(sritis), A_SPRENDIMAS, 'dvieju-zingsniu-sprendimas')

function kurkSprendima(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const { buvo, pridejo, paeme, rez } = trysZingsniai(maks)
  if (rez < 0 || buvo + pridejo > maks) return null
  const v = pasirink(VARDAI)

  return variacija([
    // 1. Lipdukai
    () =>
      uzdavinys('dvieju-zingsniu-sprendimas', {
        klausimas: `${v} turėjo ${buvo} lipdukus. Gavo dar ${pridejo}, o ${paeme} atidavė. Kiek lipdukų liko?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${buvo} + ${pridejo} = ${buvo + pridejo}$, tada $${buvo + pridejo} - ${paeme} = ${rez}$. Ats.: ${rez}.`,
      }),

    // 2. Sandėlis
    () =>
      uzdavinys('dvieju-zingsniu-sprendimas', {
        klausimas: `Sandėlyje buvo ${buvo} ${derink(buvo, DEZIU)}. Atvežė ${pridejo}, išvežė ${paeme}. Kiek dėžių liko?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${buvo} + ${pridejo} = ${buvo + pridejo}$, tada $${buvo + pridejo} - ${paeme} = ${rez}$. Ats.: ${rez}.`,
      }),

    // 3. Koks pirmasis veiksmas
    () =>
      pasirinkimoUzdavinys(naujasId('dvieju-zingsniu-sprendimas'), 'dvieju-zingsniu-sprendimas', {
        klausimas: `Buvo ${buvo}, gavo ${pridejo}, atidavė ${paeme}. Koks pirmasis sprendimo veiksmas?`,
        variantai: [
          `$${buvo} + ${pridejo} = ${buvo + pridejo}$`,
          `$${buvo} - ${paeme} = ${buvo - paeme}$`,
          `$${pridejo} + ${paeme} = ${pridejo + paeme}$`,
        ],
        teisingas: 0,
        sprendimas: 'Veiksmai atliekami ta tvarka, kuria vyko įvykiai: pirma gavo, paskui atidavė.',
      }),

    // 4. Tarpinis rezultatas
    () =>
      uzdavinys('dvieju-zingsniu-sprendimas', {
        klausimas: `Autobuse buvo ${buvo} keleiviai. Įlipo ${pridejo}, išlipo ${paeme}. Kiek keleivių buvo po įlipimo?`,
        atsakymas: String(buvo + pridejo),
        atsakymasRodymui: `$${buvo + pridejo}$`,
        sprendimas: `Pirmasis veiksmas: $${buvo} + ${pridejo} = ${buvo + pridejo}$.`,
      }),

    // 5. Kuris sprendimas teisingas
    () =>
      pasirinkimoUzdavinys(naujasId('dvieju-zingsniu-sprendimas'), 'dvieju-zingsniu-sprendimas', {
        klausimas: `Buvo ${buvo}, atvežė ${pridejo}, išvežė ${paeme}. Kuris sprendimas teisingas?`,
        variantai: [
          `$${buvo} + ${pridejo} = ${buvo + pridejo}$; $${buvo + pridejo} - ${paeme} = ${rez}$`,
          `$${buvo} - ${paeme} = ${buvo - paeme}$; $${buvo - paeme} - ${pridejo} = ${buvo - paeme - pridejo}$`,
          `$${buvo} + ${pridejo} + ${paeme} = ${buvo + pridejo + paeme}$`,
        ],
        teisingas: 0,
        sprendimas: 'Pirma pridedama tai, kas atvežta, paskui atimama tai, kas išvežta.',
      }),
  ])
}

// ── Kaip sukurti dviejų žingsnių tekstinį uždavinį? ─────────────────────────

const A_KURIMAS = [
  {
    klausimas: 'Kuriai istorijai reikia dviejų veiksmų?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — kiekis pirma padidėjo, paskui sumažėjo',
    sprendimas: 'Vienas pokytis — vienas veiksmas, du pokyčiai — du veiksmai.',
  },
] as const

export const uzdavinioKurimas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkUzdavini(sritis), A_KURIMAS, 'uzdavinio-kurimas')

function kurkUzdavini(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const { buvo, pridejo, paeme, rez } = trysZingsniai(maks)
  if (rez < 0 || buvo + pridejo > maks) return null

  return variacija([
    // 1. Kuriai istorijai reikia dviejų veiksmų
    () =>
      pasirinkimoUzdavinys(naujasId('uzdavinio-kurimas'), 'uzdavinio-kurimas', {
        klausimas: 'Kuriai istorijai išspręsti reikia dviejų veiksmų?',
        variantai: [
          `Buvo ${buvo}, atvežė ${pridejo}, išvežė ${paeme}.`,
          `Buvo ${buvo}, atvežė ${pridejo}.`,
          `Buvo ${buvo}, išvežė ${paeme}.`,
        ],
        teisingas: 0,
        sprendimas: 'Du pokyčiai reikalauja dviejų veiksmų, vienas pokytis — vieno.',
      }),

    // 2. Kuri sąlyga tinka sprendimui
    () =>
      pasirinkimoUzdavinys(naujasId('uzdavinio-kurimas'), 'uzdavinio-kurimas', {
        klausimas: `Sprendimas: $${buvo} + ${pridejo} = ${buvo + pridejo}$; $${buvo + pridejo} - ${paeme} = ${rez}$. Kuri sąlyga jam tinka?`,
        variantai: [
          `Buvo ${buvo}, gavo ${pridejo}, atidavė ${paeme}.`,
          `Buvo ${buvo}, atidavė ${pridejo}, gavo ${paeme}.`,
          `Buvo ${buvo} ir dar ${pridejo}, o ${paeme} nieko nereiškia.`,
        ],
        teisingas: 0,
        sprendimas: 'Pirmas veiksmas su pliusu atitinka gavimą, antras su minusu — atidavimą.',
      }),

    // 3. Koks klausimas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('uzdavinio-kurimas'), 'uzdavinio-kurimas', {
        klausimas: `Sąlyga: „Buvo ${buvo}, atvežė ${pridejo}, išvežė ${paeme}.“ Kuris klausimas tinka?`,
        variantai: ['Kiek liko?', 'Kiek atvežė?', 'Kiek kainuoja viena dėžė?'],
        teisingas: 0,
        sprendimas: 'Klausimas turi reikalauti abiejų duomenų — tada uždavinys sprendžiamas dviem veiksmais.',
      }),

    // 4. Ko trūksta uždaviniui
    () =>
      pasirinkimoUzdavinys(naujasId('uzdavinio-kurimas'), 'uzdavinio-kurimas', {
        klausimas: `Sąlyga: „Buvo ${buvo}, atvežė ${pridejo}, išvežė ${paeme}.“ Ko trūksta, kad tai būtų uždavinys?`,
        variantai: ['klausimo', 'dar vieno skaičiaus', 'paveikslėlio'],
        teisingas: 0,
        sprendimas: 'Duomenų pakanka, tad trūksta tik klausimo.',
      }),

    // 5. Koks atsakymas
    () =>
      uzdavinys('uzdavinio-kurimas', {
        klausimas: `Sukurtas uždavinys: „Buvo ${buvo}, atvežė ${pridejo}, išvežė ${paeme}. Kiek liko?“ Koks atsakymas?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${buvo} + ${pridejo} = ${buvo + pridejo}$, tada $${buvo + pridejo} - ${paeme} = ${rez}$.`,
      }),
  ])
}
