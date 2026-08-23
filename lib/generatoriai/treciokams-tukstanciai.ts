import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import {
  apvalinimoTiese,
  kainorastis,
  skyriuLentele4,
  stulpelis4,
  type Preke,
} from './treciokams-tukstanciai-vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 3 klasės tema „Sudėtis ir atimtis iki 10 000“ — vienuolika potemių.
 *
 * Anksčiau visos jos rėmėsi trimis bendraisiais generatoriais: `skaitmenys`
 * duodavo romėniškus skaitmenis, `apvalinimas` — apvalinimą iki dešimtųjų
 * dalių, o šešios atimties potemės dalijosi vienu `sudetis-atimtis`.
 *
 * Temos esmė yra ne didesni skaičiai, o skyriai. Todėl potemės čia skiriasi
 * ne skaičių dydžiu, o tuo, kas su skyriais vyksta: ar susidaro naujas
 * tūkstantis, ar reikia išardyti dešimtį, šimtą, tūkstantį. Kiekvienoje
 * potemėje veiksmo skaičiai parenkami taip, kad tas — ir tik tas — atvejis
 * ir pasitaikytų.
 */

const VARDAI = ['Matas', 'Ieva', 'Emilis', 'Luknė', 'Greta', 'Tauras', 'Kotryna'] as const

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

/** „du tūkstančiai trys šimtai keturiasdešimt penki“ — kaip skaitoma pamokoje. */
function zodziais(n: number): string {
  const t = Math.floor(n / 1000)
  const s = Math.floor((n % 1000) / 100)
  const likutis = n % 100
  const dalys: string[] = []
  // 1000 lietuviškai skaitomas „tūkstantis“, be „vienas“.
  if (t === 1) dalys.push('tūkstantis')
  else if (t > 1) dalys.push(`${VIENETAI[t]} tūkstančiai`)
  if (s === 1) dalys.push('šimtas')
  else if (s > 1) dalys.push(`${VIENETAI[s]} šimtai`)
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

/** Skaitmenys nuo tūkstančių iki vienetų. */
function skyriai(n: number): { t: number; s: number; d: number; v: number } {
  return {
    t: Math.floor(n / 1000),
    s: Math.floor((n % 1000) / 100),
    d: Math.floor((n % 100) / 10),
    v: n % 10,
  }
}

const TUKSTANCIU = { vns: 'tūkstantis', dgs: 'tūkstančiai', kilm: 'tūkstančių' }
const SIMTU = { vns: 'šimtas', dgs: 'šimtai', kilm: 'šimtų' }
const DESIMCIU = { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' }
const VIENETU = { vns: 'vienetas', dgs: 'vienetai', kilm: 'vienetų' }

/** „3 tūkstančiai, 0 šimtų, 7 dešimtys ir 2 vienetai“ — su suderintomis galūnėmis. */
function skyriaiZodziais(n: number): string {
  const { t, s, d, v } = skyriai(n)
  return `${t} ${derink(t, TUKSTANCIU)}, ${s} ${derink(s, SIMTU)}, ${d} ${derink(
    d,
    DESIMCIU,
  )} ir ${v} ${derink(v, VIENETU)}`
}

function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 10000, 10000)
}

/** „turi 6348 eurus“, bet „turi 2490 eurų“. */
function eurusGal(n: number): string {
  return derink(n, { vns: 'eurą', dgs: 'eurus', kilm: 'eurų' })
}

/** „kainuoja 4126 eurai“, bet „kainuoja 1500 eurų“. */
function eurai(n: number): string {
  return derink(n, { vns: 'euras', dgs: 'eurai', kilm: 'eurų' })
}

/** Keturženklis skaičius, kurio skaitmenis nurodo pati funkcija. */
function isSkyriu(t: number, s: number, d: number, v: number): number {
  return t * 1000 + s * 100 + d * 10 + v
}

// ── 2.1 Kaip perskaityti ir užrašyti skaičius iki 10 000? ───────────────────

const A_SKAITYMAS = [
  {
    klausimas: 'Užrašyk skaitmenimis: du tūkstančiai trys šimtai keturiasdešimt penki.',
    atsakymas: '2345',
    atsakymasRodymui: '$2345$',
    sprendimas: '$2000 + 300 + 40 + 5 = 2345$.',
  },
] as const

export const skaiciai10000: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSkaitymas(sritis), A_SKAITYMAS, 'skaiciai-10000')

function kurkSkaitymas(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  if (maks < 10000) return null
  const n = atsitiktinis(1000, 9999)
  const { t, s, d, v } = skyriai(n)

  return variacija([
    // 1. Iš žodžių į skaitmenis
    () =>
      uzdavinys('skaiciai-10000', {
        klausimas: `Užrašyk skaitmenimis: ${zodziais(n)}.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${t * 1000} + ${s * 100} + ${d * 10} + ${v} = ${n}$.`,
      }),

    // 2. Skaičius iš skyrių lentelės
    () =>
      uzdavinys('skaiciai-10000', {
        // Skaitmenys yra tik lentelėje: klausime jų nėra, tad lentelę tenka
        // perskaityti.
        klausimas: 'Koks skaičius užrašytas skyrių lentelėje?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `${skyriaiZodziais(n)} — tai ${n}.`,
        brezinys: skyriuLentele4({ tukstanciai: t, simtai: s, desimtys: d, vienetai: v }),
      }),

    // 3. Kuris skaitmuo kuriame skyriuje
    () => {
      const kuris = pasirink([
        { vardas: 'tūkstančių', reiksme: t },
        { vardas: 'šimtų', reiksme: s },
        { vardas: 'dešimčių', reiksme: d },
      ])
      const blogi = [t, s, d, v].filter((x) => x !== kuris.reiksme)
      if (blogi.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('skaiciai-10000'), 'skaiciai-10000', {
        klausimas: `Kuris skaitmuo skaičiuje ${n} yra ${kuris.vardas} skyriuje?`,
        variantai: [String(kuris.reiksme), String(blogi[0]), String(blogi[1])],
        teisingas: 0,
        sprendimas: `Skaičius ${n} yra ${skyriaiZodziais(n)}.`,
      })
    },

    // 4. Rikiavimas
    () => {
      const keturi = [
        isSkyriu(t, s, d, v),
        isSkyriu(t, d, s, v),
        isSkyriu(s === 0 ? 1 : s, t, v, d),
        isSkyriu(t, s, v, d),
      ]
      if (new Set(keturi).size < 4 || keturi.some((x) => x < 1000)) return null
      return eiliskumoUzdavinys(naujasId('skaiciai-10000'), 'skaiciai-10000', {
        klausimas: 'Surikiuok skaičius nuo didžiausio iki mažiausio.',
        teisingaEile: [...keturi].sort((x, y) => y - x).map(String),
        sprendimas: 'Pirmiausia lyginami tūkstančiai, tada šimtai, dešimtys, vienetai.',
      })
    },

    // 5. Palyginimo ženklas
    () => {
      const kitas = isSkyriu(t, s, v, d)
      if (kitas === n || kitas < 1000) return null
      return pasirinkimoUzdavinys(naujasId('skaiciai-10000'), 'skaiciai-10000', {
        klausimas: `Įrašyk tinkamą ženklą: $${n} \\square ${kitas}$`,
        variantai: n > kitas ? ['>', '<', '='] : ['<', '>', '='],
        teisingas: 0,
        sprendimas: `Tūkstančiai ir šimtai vienodi, tad lyginamos dešimtys: ${d} ir ${v}.`,
      })
    },

    // 6. Kiek iš viso šimtų
    () =>
      uzdavinys('skaiciai-10000', {
        klausimas: `Kiek iš viso šimtų yra skaičiuje ${n}?`,
        atsakymas: String(Math.floor(n / 100)),
        atsakymasRodymui: `$${Math.floor(n / 100)}$`,
        sprendimas: `Kiekvienas tūkstantis — 10 šimtų, tad iš viso $${t} \\cdot 10 + ${s} = ${Math.floor(
          n / 100,
        )}$ šimtai.`,
      }),

    // 7. Skaičius su nuliu skyriuje
    () => {
      const suNuliu = isSkyriu(t, 0, d, v)
      if (d === 0 && v === 0) return null
      return uzdavinys('skaiciai-10000', {
        klausimas: `Užrašyk skaitmenimis: ${zodziais(suNuliu)}.`,
        atsakymas: String(suNuliu),
        atsakymasRodymui: `$${suNuliu}$`,
        sprendimas: 'Šimtų nėra, tad šimtų skyriuje rašomas nulis.',
      })
    },
  ])
}

// ── 2.2 Kaip sudaryti skaičiai iki 10 000? ──────────────────────────────────

const A_SUDARYMAS = [
  {
    klausimas: 'Apskaičiuok: $3000 + 400 + 60 + 2$',
    atsakymas: '3462',
    atsakymasRodymui: '$3462$',
    sprendimas: 'Sudedami skyriai: $3462$.',
  },
] as const

export const skaiciuSudarymas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSudaryma(sritis), A_SUDARYMAS, 'skaiciu-sudarymas')

function kurkSudaryma(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  if (maks < 10000) return null
  const t = atsitiktinis(1, 9)
  const s = atsitiktinis(0, 9)
  const d = atsitiktinis(0, 9)
  const v = atsitiktinis(1, 9)
  const n = isSkyriu(t, s, d, v)

  return variacija([
    // 1. Skyrių suma
    () =>
      uzdavinys('skaiciu-sudarymas', {
        klausimas: `Apskaičiuok: $${t * 1000} + ${s * 100} + ${d * 10} + ${v}$`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Kiekvienas dėmuo įrašomas į savo skyrių: ${n}.`,
      }),

    // 2. Trūkstamas dėmuo skaidinyje
    () => {
      if (s === 0) return null
      return uzdavinys('skaiciu-sudarymas', {
        klausimas: `Užpildyk skaidinį: $${n} = ${t * 1000} + \\square + ${d * 10} + ${v}$`,
        atsakymas: String(s * 100),
        atsakymasRodymui: `$${s * 100}$`,
        sprendimas: `Trūksta šimtų: skaičiuje ${n} jų ${s}, tad $${s * 100}$.`,
      })
    },

    // 3. Užpildyti skyrių lentelę
    () =>
      uzdavinys('skaiciu-sudarymas', {
        // Klausime skaičius yra, o lentelėje trūksta vieno langelio — mokinys
        // turi suprasti, kuris skyrius yra kuris.
        klausimas: `Kokį skaitmenį reikia įrašyti į tuščią lentelės langelį, kad būtų užrašytas skaičius ${n}?`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}$`,
        sprendimas: `Dešimčių skyriuje turi būti ${d}.`,
        brezinys: skyriuLentele4({ tukstanciai: t, simtai: s, desimtys: null, vienetai: v }),
      }),

    // 4. Didžiausias ir mažiausias iš skaitmenų
    () => {
      const rinkinys = sumaisyk([t, s, d, v])
      if (new Set(rinkinys).size < 4 || rinkinys.includes(0)) return null
      const didziausias = Number([...rinkinys].sort((a, b) => b - a).join(''))
      return uzdavinys('skaiciu-sudarymas', {
        klausimas: `Iš skaitmenų ${rinkinys.join(', ')} sudaryk didžiausią keturženklį skaičių. Kiekvienas skaitmuo naudojamas po vieną kartą.`,
        atsakymas: String(didziausias),
        atsakymasRodymui: `$${didziausias}$`,
        sprendimas: 'Didžiausias skaitmuo rašomas į tūkstančių skyrių, mažiausias — į vienetų.',
      })
    },

    // 5. Kiek iš viso dešimčių
    () =>
      uzdavinys('skaiciu-sudarymas', {
        klausimas: `Kiek iš viso dešimčių yra skaičiuje ${isSkyriu(t, s, d, 0)}?`,
        atsakymas: String(t * 100 + s * 10 + d),
        atsakymasRodymui: `$${t * 100 + s * 10 + d}$`,
        sprendimas: `Vienetų nėra, tad dešimčių tiek, kiek rodo pirmieji trys skaitmenys: ${
          t * 100 + s * 10 + d
        }.`,
      }),

    // 6. Klaidos radimas užraše
    () => {
      if (s !== 0) return null
      const blogas = isSkyriu(0, t, d, v)
      return pasirinkimoUzdavinys(naujasId('skaiciu-sudarymas'), 'skaiciu-sudarymas', {
        klausimas: `Skaičių „${skyriaiZodziais(n)}“ mokinys užrašė ${blogas}. Kur klaida?`,
        variantai: [
          'praleistas nulis šimtų skyriuje',
          'sukeisti dešimtys ir vienetai',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Šimtų nėra, bet jų skyrius negali dingti — teisingai yra ${n}.`,
      })
    },

    // 7. Skaičius, padidėjęs vienu skyriaus vienetu
    () => {
      const kiek = pasirink([10, 100, 1000])
      if (n + kiek > maks) return null
      const vardas = kiek === 10 ? 'dešimtimi' : kiek === 100 ? 'šimtu' : 'tūkstančiu'
      return uzdavinys('skaiciu-sudarymas', {
        klausimas: `Skaičių ${n} padidink viena ${vardas}. Kokį skaičių gavai?`,
        atsakymas: String(n + kiek),
        atsakymasRodymui: `$${n + kiek}$`,
        sprendimas: `$${n} + ${kiek} = ${n + kiek}$.`,
      })
    },
  ])
}

// ── 2.3 Kaip apvalinti skaičius? ────────────────────────────────────────────

const A_APVALINIMAS = [
  {
    klausimas: 'Suapvalink 3470 iki šimtų.',
    atsakymas: '3500',
    atsakymasRodymui: '$3500$',
    sprendimas: '70 yra daugiau už 50, tad apvalinama į viršų: 3500.',
  },
] as const

export const apvalinimas10000: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkApvalinima(sritis), A_APVALINIMAS, 'apvalinimas-10000')

/** Apvalinimas nurodytu tikslumu. */
function apvalink(n: number, tikslumas: number): number {
  return Math.round(n / tikslumas) * tikslumas
}

function kurkApvalinima(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  if (maks < 10000) return null
  const n = atsitiktinis(1200, 8900)

  return variacija([
    // 1. Iki šimtų su brėžiniu
    () => {
      const sk = atsitiktinis(12, 88) * 100 + atsitiktinis(1, 99)
      if (sk % 100 === 50 || sk % 100 < 8 || sk % 100 > 92) return null
      return uzdavinys('apvalinimas-10000', {
        klausimas: `Suapvalink ${sk} iki šimtų.`,
        atsakymas: String(apvalink(sk, 100)),
        atsakymasRodymui: `$${apvalink(sk, 100)}$`,
        sprendimas: `${sk} yra arčiau ${apvalink(sk, 100)} negu kito apvalaus šimto.`,
        brezinys: apvalinimoTiese(sk, 100),
      })
    },

    // 2. Iki tūkstančių su brėžiniu
    () => {
      const sk = atsitiktinis(1, 8) * 1000 + atsitiktinis(1, 999)
      // Vidurys būtų dviprasmis, o prie pat galo esantis taškas brėžinyje
      // atsiremia į patį apvalų skaičių ir atsakymą nurodo pats.
      if (sk % 1000 === 500 || sk % 1000 < 80 || sk % 1000 > 920) return null
      return uzdavinys('apvalinimas-10000', {
        klausimas: `Suapvalink ${sk} iki tūkstančių.`,
        atsakymas: String(apvalink(sk, 1000)),
        atsakymasRodymui: `$${apvalink(sk, 1000)}$`,
        sprendimas: `Šimtų skaitmuo rodo, prie kurio tūkstančio arčiau: gaunama ${apvalink(sk, 1000)}.`,
        brezinys: apvalinimoTiese(sk, 1000),
      })
    },

    // 3. Iki dešimčių
    () => {
      const sk = atsitiktinis(1000, 9989)
      if (sk % 10 === 5 || sk % 10 === 0) return null
      return uzdavinys('apvalinimas-10000', {
        klausimas: `Suapvalink ${sk} iki dešimčių.`,
        atsakymas: String(apvalink(sk, 10)),
        atsakymasRodymui: `$${apvalink(sk, 10)}$`,
        sprendimas: `Vienetų skaitmuo ${sk % 10}, tad gaunama ${apvalink(sk, 10)}.`,
      })
    },

    // 4. Atvirkštinis klausimas
    () => {
      const apvalus = atsitiktinis(13, 88) * 100
      const teisingas = apvalus + atsitiktinis(1, 4) * 10
      const blogas1 = apvalus + atsitiktinis(6, 9) * 10
      const blogas2 = apvalus - atsitiktinis(6, 9) * 10
      if (blogas2 < 1000) return null
      return pasirinkimoUzdavinys(naujasId('apvalinimas-10000'), 'apvalinimas-10000', {
        klausimas: `Kurį skaičių apvalinant iki šimtų gaunama ${apvalus}?`,
        variantai: [String(teisingas), String(blogas1), String(blogas2)],
        teisingas: 0,
        sprendimas: `${teisingas} yra arčiau ${apvalus} negu bet kurio kito apvalaus šimto.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const sk = atsitiktinis(12, 88) * 100 + atsitiktinis(6, 9) * 10
      const blogas = Math.floor(sk / 100) * 100
      return pasirinkimoUzdavinys(naujasId('apvalinimas-10000'), 'apvalinimas-10000', {
        klausimas: `Apvalinant ${sk} iki šimtų gauta ${blogas}. Ar teisingai?`,
        variantai: [
          `ne, turi būti ${apvalink(sk, 100)}`,
          'taip, teisingai',
          `ne, turi būti ${blogas - 100}`,
        ],
        teisingas: 0,
        sprendimas: `Dešimčių skaitmuo yra ${Math.floor((sk % 100) / 10)}, tad apvalinama į viršų.`,
        brezinys: apvalinimoTiese(sk, 100),
      })
    },

    // 6. Apytikslis skaičiavimas
    () => {
      const a = atsitiktinis(11, 40) * 100 + atsitiktinis(1, 9) * 10
      const b = atsitiktinis(11, 40) * 100 + atsitiktinis(1, 9) * 10
      if (a + b > maks) return null
      return uzdavinys('apvalinimas-10000', {
        klausimas: `Suapvalink abu skaičius iki šimtų ir apskaičiuok apytikslę sumą: $${a} + ${b}$`,
        atsakymas: String(apvalink(a, 100) + apvalink(b, 100)),
        atsakymasRodymui: `$${apvalink(a, 100) + apvalink(b, 100)}$`,
        sprendimas: `$${apvalink(a, 100)} + ${apvalink(b, 100)} = ${
          apvalink(a, 100) + apvalink(b, 100)
        }$.`,
      })
    },

    // 7. Kuris apvalinimas tikslesnis
    () =>
      pasirinkimoUzdavinys(naujasId('apvalinimas-10000'), 'apvalinimas-10000', {
        klausimas: `Skaičius ${n} apvalinamas iki šimtų ir iki tūkstančių. Kuris rezultatas mažiau skiriasi nuo tikrojo skaičiaus?`,
        variantai: [
          `apvalinant iki šimtų — ${apvalink(n, 100)}`,
          `apvalinant iki tūkstančių — ${apvalink(n, 1000)}`,
          'abu skiriasi vienodai',
        ],
        teisingas: 0,
        sprendimas: 'Kuo smulkesnis skyrius, tuo apvalinimas tikslesnis.',
      }),
  ])
}

// ── 2.4 ir 2.5 Sudėtis iki 10 000 ───────────────────────────────────────────

/** Sudėties pora, kurios nė viename skyriuje nesusidaro perteklius. */
function poraBePerkelimo(): { a: number; b: number } | null {
  const t = [atsitiktinis(1, 4), atsitiktinis(1, 4)]
  const s = [atsitiktinis(1, 4), atsitiktinis(1, 4)]
  const d = [atsitiktinis(1, 4), atsitiktinis(1, 4)]
  const v = [atsitiktinis(1, 4), atsitiktinis(1, 4)]
  if (t[0] + t[1] > 9 || s[0] + s[1] > 9 || d[0] + d[1] > 9 || v[0] + v[1] > 9) return null
  return { a: isSkyriu(t[0], s[0], d[0], v[0]), b: isSkyriu(t[1], s[1], d[1], v[1]) }
}

/** Sudėties pora, kurios šimtai peržengia tūkstantį. */
function poraSuTukstanciu(): { a: number; b: number } | null {
  const s = [atsitiktinis(5, 9), atsitiktinis(5, 9)]
  if (s[0] + s[1] < 10) return null
  const t = [atsitiktinis(1, 3), atsitiktinis(1, 3)]
  const d = [atsitiktinis(1, 4), atsitiktinis(1, 4)]
  const v = [atsitiktinis(1, 4), atsitiktinis(1, 4)]
  return { a: isSkyriu(t[0], s[0], d[0], v[0]), b: isSkyriu(t[1], s[1], d[1], v[1]) }
}

function kurkSudeti(
  temaId: string,
  pora: { a: number; b: number },
  susidaroTukstantis: boolean,
): Uzdavinys | null {
  const { a, b } = pora
  const suma = a + b
  const vardas = pasirink(VARDAI)

  return variacija([
    // 1. Stulpeliu
    () =>
      uzdavinys(temaId, {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: susidaroTukstantis
          ? `Iš šimtų susidaro naujas tūkstantis, tad jis perkeliamas į tūkstančių skyrių: $${a} + ${b} = ${suma}$.`
          : `Sudedami skyriai iš dešinės: $${a} + ${b} = ${suma}$.`,
        brezinys: stulpelis4(a, b, '+', null),
      }),

    // 2. Skaidant į skyrius
    () =>
      uzdavinys(temaId, {
        klausimas: `Apskaičiuok išskaidydamas antrą dėmenį į skyrius: $${a} + ${b}$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${Math.floor(b / 1000) * 1000} = ${
          a + Math.floor(b / 1000) * 1000
        }$, tada $${a + Math.floor(b / 1000) * 1000} + ${b % 1000} = ${suma}$.`,
      }),

    // 3. Trūkstamas skaitmuo stulpelyje
    () => {
      const skyrius = atsitiktinis(0, 2)
      const paslepta = Math.floor(b / 10 ** skyrius) % 10
      return uzdavinys(temaId, {
        klausimas: 'Kokio skaitmens trūksta stulpelyje?',
        atsakymas: String(paslepta),
        atsakymasRodymui: `$${paslepta}$`,
        sprendimas: `Tame skyriuje suma turi būti tokia, kokia parašyta po brūkšniu: trūksta ${paslepta}.`,
        brezinys: stulpelis4(a, b, '+', suma, [{ eilute: 'antra', skyrius }]),
      })
    },

    // 4. Trūkstamas dėmuo
    () =>
      uzdavinys(temaId, {
        klausimas: `Užpildyk: $${a} + \\square = ${suma}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Iš sumos atimame žinomą dėmenį: $${suma} - ${a} = ${b}$.`,
      }),

    // 5. Tekstinis
    () =>
      uzdavinys(temaId, {
        klausimas: `Bibliotekoje buvo ${a} ${derink(a, {
          vns: 'knyga',
          dgs: 'knygos',
          kilm: 'knygų',
        })}, o metų pabaigoje nupirkta dar ${b}. Kiek knygų dabar bibliotekoje?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      }),

    // 6. Klaidos radimas
    () => {
      const klaida = susidaroTukstantis ? suma - 1000 : suma + 1000
      if (klaida < 0) return null
      return pasirinkimoUzdavinys(naujasId(temaId), temaId, {
        klausimas: `${vardas} apskaičiavo $${a} + ${b} = ${klaida}$. Kur klaida?`,
        variantai: susidaroTukstantis
          ? [
              'pamiršta perkelti iš šimtų susidariusį tūkstantį',
              'sudėti tik vienetai',
              'klaidos nėra',
            ]
          : ['pridėtas tūkstantis, kurio nėra', 'sudėti tik vienetai', 'klaidos nėra'],
        teisingas: 0,
        sprendimas: `Teisingas atsakymas yra ${suma}.`,
      })
    },

    // 7. Patikrinimas atimtimi
    () =>
      uzdavinys(temaId, {
        klausimas: `${vardas} apskaičiavo $${a} + ${b} = ${suma}$. Kiek gausi patikrindamas veiksmu $${suma} - ${b}$?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Turi gautis pirmasis dėmuo: $${suma} - ${b} = ${a}$.`,
      }),
  ])
}

const A_SUDETIS = [
  {
    klausimas: 'Apskaičiuok: $2314 + 1425$',
    atsakymas: '3739',
    atsakymasRodymui: '$3739$',
    sprendimas: 'Sudedami skyriai iš dešinės: $3739$.',
  },
] as const

export const sudetisBeTukstancio: Generatorius = () =>
  suBandymais(() => {
    const pora = poraBePerkelimo()
    return pora === null ? null : kurkSudeti('sudetis-be-tukstancio', pora, false)
  }, A_SUDETIS, 'sudetis-be-tukstancio')

export const sudetisSuTukstanciu: Generatorius = () =>
  suBandymais(() => {
    const pora = poraSuTukstanciu()
    return pora === null ? null : kurkSudeti('sudetis-su-tukstanciu', pora, true)
  }, A_SUDETIS, 'sudetis-su-tukstanciu')

// ── 2.6–2.9 Atimtis iki 10 000 ──────────────────────────────────────────────

/** Kurį skyrių tenka išardyti. */
type Ardymas = 'nieko' | 'desimti' | 'simta' | 'tukstanti'

/**
 * Atimties pora, kurioje ardomas būtent nurodytas skyrius.
 *
 * Kiekvienoje potemėje mokomas vienas atvejis, tad kiti turi būti išjungti:
 * ardant šimtą vienetai privalo atsiimti be skolinimosi, kitaip uždavinys
 * pasidaro apie viską iš karto.
 */
function atimtiesPora(ardymas: Ardymas): { a: number; b: number } | null {
  const aT = atsitiktinis(4, 9)
  const aS = atsitiktinis(1, 8)
  const aD = atsitiktinis(1, 8)
  const aV = atsitiktinis(1, 8)

  let bV: number
  let bD: number
  let bS: number
  if (ardymas === 'desimti') {
    bV = atsitiktinis(aV + 1, 9)
    bD = atsitiktinis(0, aD - 1)
    bS = atsitiktinis(0, aS)
  } else if (ardymas === 'simta') {
    bV = atsitiktinis(0, aV)
    bD = atsitiktinis(aD + 1, 9)
    bS = atsitiktinis(0, aS - 1)
  } else if (ardymas === 'tukstanti') {
    bV = atsitiktinis(0, aV)
    bD = atsitiktinis(0, aD)
    bS = atsitiktinis(aS + 1, 9)
  } else {
    bV = atsitiktinis(0, aV)
    bD = atsitiktinis(0, aD)
    bS = atsitiktinis(0, aS)
  }
  if (bD < 0 || bS < 0) return null

  const bT = atsitiktinis(1, aT - 2)
  const a = isSkyriu(aT, aS, aD, aV)
  const b = isSkyriu(bT, bS, bD, bV)
  if (b < 1000 || a - b < 1000) return null
  return { a, b }
}

const ARDYMO_ZODIS: Record<Ardymas, string> = {
  nieko: '',
  desimti: 'dešimtį',
  simta: 'šimtą',
  tukstanti: 'tūkstantį',
}

function kurkAtimti(temaId: string, pora: { a: number; b: number }, ardymas: Ardymas): Uzdavinys | null {
  const { a, b } = pora
  const sk = a - b
  const vardas = pasirink(VARDAI)
  const zodis = ARDYMO_ZODIS[ardymas]

  return variacija([
    // 1. Stulpeliu
    () =>
      uzdavinys(temaId, {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas:
          ardymas === 'nieko'
            ? `Kiekviename skyriuje atimama be skolinimosi: $${a} - ${b} = ${sk}$.`
            : `Tame skyriuje trūksta, tad išardoma viena ${zodis}: $${a} - ${b} = ${sk}$.`,
        brezinys: stulpelis4(a, b, '−', null),
      }),

    // 2. Skaidant atėminį
    () =>
      uzdavinys(temaId, {
        klausimas: `Apskaičiuok išskaidydamas atėminį į skyrius: $${a} - ${b}$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${Math.floor(b / 1000) * 1000} = ${
          a - Math.floor(b / 1000) * 1000
        }$, tada $${a - Math.floor(b / 1000) * 1000} - ${b % 1000} = ${sk}$.`,
      }),

    // 3. Kurį skyrių reikia išardyti
    () =>
      pasirinkimoUzdavinys(naujasId(temaId), temaId, {
        klausimas: `Ar skaičiuojant $${a} - ${b}$ tenka ką nors išardyti?`,
        variantai:
          ardymas === 'nieko'
            ? ['ne, nieko ardyti nereikia', 'reikia išardyti dešimtį', 'reikia išardyti šimtą']
            : [
                `reikia išardyti ${zodis}`,
                'ne, nieko ardyti nereikia',
                ardymas === 'tukstanti' ? 'reikia išardyti dešimtį' : 'reikia išardyti tūkstantį',
              ],
        teisingas: 0,
        sprendimas:
          ardymas === 'nieko'
            ? 'Kiekvienas atėminio skaitmuo ne didesnis už turinio skaitmenį.'
            : `Tame skyriuje atėminio skaitmuo didesnis, tad viena ${zodis} išardoma.`,
      }),

    // 4. Trūkstamas skaitmuo stulpelyje
    () => {
      const skyrius = atsitiktinis(0, 2)
      const paslepta = Math.floor(b / 10 ** skyrius) % 10
      return uzdavinys(temaId, {
        klausimas: 'Kokio skaitmens trūksta stulpelyje?',
        atsakymas: String(paslepta),
        atsakymasRodymui: `$${paslepta}$`,
        sprendimas: `Kad gautųsi parašytas skirtumas, tame skyriuje turi būti ${paslepta}.`,
        brezinys: stulpelis4(a, b, '−', sk, [{ eilute: 'antra', skyrius }]),
      })
    },

    // 5. Trūkstamas atėminys
    () =>
      uzdavinys(temaId, {
        klausimas: `Užpildyk: $${a} - \\square = ${sk}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Iš turinio atimame skirtumą: $${a} - ${sk} = ${b}$.`,
      }),

    // 6. Tekstinis
    () =>
      uzdavinys(temaId, {
        klausimas: `Sandėlyje buvo ${a} ${derink(a, {
          vns: 'plyta',
          dgs: 'plytos',
          kilm: 'plytų',
        })}. Statyboms išvežta ${b}. Kiek plytų liko?`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      }),

    // 7. Patikrinimas sudėtimi
    () =>
      uzdavinys(temaId, {
        klausimas: `${vardas} apskaičiavo $${a} - ${b} = ${sk}$. Kiek gausi patikrindamas veiksmu $${sk} + ${b}$?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Turi gautis turinys: $${sk} + ${b} = ${a}$.`,
      }),

    // 8. Klaidos radimas
    () => {
      if (ardymas === 'nieko') return null
      const kiek = ardymas === 'desimti' ? 10 : ardymas === 'simta' ? 100 : 1000
      return pasirinkimoUzdavinys(naujasId(temaId), temaId, {
        klausimas: `${vardas} apskaičiavo $${a} - ${b} = ${sk + kiek}$. Kur klaida?`,
        variantai: [
          `pamiršta, kad buvo išardyta ${zodis}`,
          'sukeisti turinys ir atėminys',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Teisingas atsakymas yra ${sk}.`,
      })
    },
  ])
}

const A_ATIMTIS = [
  {
    klausimas: 'Apskaičiuok: $5847 - 2314$',
    atsakymas: '3533',
    atsakymasRodymui: '$3533$',
    sprendimas: 'Atimami skyriai iš dešinės: $3533$.',
  },
] as const

function atimtiesGeneratorius(temaId: string, ardymas: Ardymas): Generatorius {
  return () =>
    suBandymais(() => {
      const pora = atimtiesPora(ardymas)
      return pora === null ? null : kurkAtimti(temaId, pora, ardymas)
    }, A_ATIMTIS, temaId)
}

export const atimtisBeArdymo = atimtiesGeneratorius('atimtis-be-ardymo', 'nieko')
export const atimtisArdantDesimti = atimtiesGeneratorius('atimtis-ardant-desimti', 'desimti')
export const atimtisArdantSimta = atimtiesGeneratorius('atimtis-ardant-simta', 'simta')
export const atimtisArdantTukstanti = atimtiesGeneratorius('atimtis-ardant-tukstanti', 'tukstanti')

// ── 2.10 Tekstiniai uždaviniai iki 10 000 ───────────────────────────────────

const A_TEKSTINIAI = [
  {
    klausimas: 'Muziejuje per dvi dienas apsilankė 4500 žmonių. Pirmą dieną — 2100. Kiek antrą?',
    atsakymas: '2400',
    atsakymasRodymui: '$2400$',
    sprendimas: '$4500 - 2100 = 2400$.',
  },
] as const

export const tekstiniai10000: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTekstinius(sritis), A_TEKSTINIAI, 'tekstiniai-10000')

function kurkTekstinius(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  if (maks < 10000) return null
  const a = atsitiktinis(1200, 3800)
  const b = atsitiktinis(1100, 3500)
  const vardas = pasirink(VARDAI)

  return variacija([
    // 1. Dvi dienos, ieškoma antroji
    () => {
      const visi = a + b
      return uzdavinys('tekstiniai-10000', {
        klausimas: `Per dvi dienas muziejuje apsilankė ${visi} lankytojai. Pirmą dieną — ${a}. Kiek lankytojų apsilankė antrą dieną?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${visi} - ${a} = ${b}$.`,
      })
    },

    // 2. Padidėjimas nurodytu dydžiu
    () => {
      const daugiau = atsitiktinis(300, 900)
      if (a + a + daugiau > maks) return null
      return uzdavinys('tekstiniai-10000', {
        klausimas: `Pirmoje gamykloje pagaminta ${a} ${derink(a, {
          vns: 'detalė',
          dgs: 'detalės',
          kilm: 'detalių',
        })}, antroje — ${daugiau} daugiau. Kiek detalių pagaminta abiejose?`,
        atsakymas: String(a + a + daugiau),
        atsakymasRodymui: `$${a + a + daugiau}$`,
        sprendimas: `Antroje: $${a} + ${daugiau} = ${a + daugiau}$. Iš viso: $${a} + ${
          a + daugiau
        } = ${a + a + daugiau}$.`,
      })
    },

    // 3. Trys žingsniai
    () => {
      const pradzia = atsitiktinis(4000, 8000)
      const isvezta = atsitiktinis(1000, 2000)
      const atvezta = atsitiktinis(500, 1500)
      return uzdavinys('tekstiniai-10000', {
        klausimas: `Sandėlyje buvo ${pradzia} kilogramai grūdų. Išvežta ${isvezta}, vėliau atvežta ${atvezta}. Kiek kilogramų dabar sandėlyje?`,
        atsakymas: String(pradzia - isvezta + atvezta),
        atsakymasRodymui: `$${pradzia - isvezta + atvezta}$`,
        sprendimas: `$${pradzia} - ${isvezta} = ${pradzia - isvezta}$, tada $${
          pradzia - isvezta
        } + ${atvezta} = ${pradzia - isvezta + atvezta}$.`,
      })
    },

    // 4. Klausimas be skaičiavimo — ar užteks
    () => {
      const turi = atsitiktinis(5000, 7000)
      const reikia1 = atsitiktinis(2000, 3000)
      const reikia2 = atsitiktinis(2000, 3000)
      const uztenka = turi >= reikia1 + reikia2
      return pasirinkimoUzdavinys(naujasId('tekstiniai-10000'), 'tekstiniai-10000', {
        klausimas: `Mokykla turi ${turi} ${eurusGal(
          turi,
        )}. Kompiuteriams reikia ${reikia1} eurų, baldams — ${reikia2}. Ar užteks pinigų abiem pirkiniams?`,
        variantai: uztenka
          ? ['taip, užteks', 'ne, neužteks', 'negalima pasakyti']
          : ['ne, neužteks', 'taip, užteks', 'negalima pasakyti'],
        teisingas: 0,
        sprendimas: `Kartu reikia $${reikia1} + ${reikia2} = ${reikia1 + reikia2}$ eurų.`,
      })
    },

    // 5. Kiek trūksta
    () => {
      const kaina = atsitiktinis(3000, 6000)
      const surinkta = atsitiktinis(1000, kaina - 500)
      return uzdavinys('tekstiniai-10000', {
        klausimas: `${vardas} taupo dviračiui, kuris kainuoja ${kaina} ${eurai(
          kaina,
        )}. Jau surinkta ${surinkta} eurų. Kiek dar trūksta?`,
        atsakymas: String(kaina - surinkta),
        atsakymasRodymui: `$${kaina - surinkta}$`,
        sprendimas: `$${kaina} - ${surinkta} = ${kaina - surinkta}$.`,
      })
    },

    // 6. Uždavinio klausimo parinkimas
    () =>
      pasirinkimoUzdavinys(naujasId('tekstiniai-10000'), 'tekstiniai-10000', {
        klausimas: `Uždavinyje žinoma: pirmoje dėžėje ${a} obuoliai, antroje — ${b}. Kurį klausimą galima atsakyti vienu atimties veiksmu?`,
        variantai: [
          'Keliais obuoliais pirmoje dėžėje daugiau negu antroje?',
          'Kiek obuolių yra abiejose dėžėse?',
          'Kiek obuolių būtų trijose tokiose dėžėse?',
        ],
        teisingas: 0,
        sprendimas: `Skirtumas randamas atimtimi: $${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(
          a - b,
        )}$.`,
      }),

    // 7. Atvirkštinis uždavinys
    () => {
      const liko = atsitiktinis(1500, 3000)
      const isleista = atsitiktinis(1000, 2500)
      if (liko + isleista > maks) return null
      return uzdavinys('tekstiniai-10000', {
        klausimas: `Išleidus ${isleista} ${eurusGal(isleista)} liko ${liko} ${eurai(
          liko,
        )}. Kiek pinigų buvo iš pradžių?`,
        atsakymas: String(liko + isleista),
        atsakymasRodymui: `$${liko + isleista}$`,
        sprendimas: `Atvirkštinis veiksmas: $${liko} + ${isleista} = ${liko + isleista}$.`,
      })
    },
  ])
}

// ── 2.11 Uždavinys pagal elektroninės parduotuvės duomenis ──────────────────

const PREKES = [
  { pavadinimas: 'Dviratis', min: 1200, max: 2600 },
  { pavadinimas: 'Paspirtukas', min: 300, max: 900 },
  { pavadinimas: 'Šalmas', min: 40, max: 120 },
  { pavadinimas: 'Palapinė', min: 200, max: 600 },
  { pavadinimas: 'Miegmaišis', min: 60, max: 180 },
  { pavadinimas: 'Kuprinė', min: 50, max: 150 },
  { pavadinimas: 'Planšetė', min: 400, max: 1100 },
  { pavadinimas: 'Ausinės', min: 30, max: 140 },
] as const

const A_PARDUOTUVE = [
  {
    klausimas: 'Dviratis kainuoja 1450 eurų, šalmas — 60 eurų. Kiek kainuoja abu?',
    atsakymas: '1510',
    atsakymasRodymui: '$1510$',
    sprendimas: '$1450 + 60 = 1510$.',
  },
] as const

export const parduotuvesUzdavinys: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkParduotuve(sritis), A_PARDUOTUVE, 'parduotuves-uzdavinys')

function kurkParduotuve(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  if (maks < 10000) return null
  const trys = sumaisyk([...PREKES]).slice(0, 3)
  const prekes: Preke[] = trys.map((p) => ({
    pavadinimas: p.pavadinimas,
    kaina: atsitiktinis(p.min, p.max),
  }))
  const [x, y, z] = prekes

  return variacija([
    // 1. Dviejų prekių kaina
    () =>
      uzdavinys('parduotuves-uzdavinys', {
        // Kainos rašomos tik kainoraštyje: jas reikia susirasti, o tai jau
        // pirmasis uždavinio žingsnis.
        klausimas: `Kiek kartu kainuoja prekės „${x.pavadinimas}“ ir „${y.pavadinimas}“?`,
        atsakymas: String(x.kaina + y.kaina),
        atsakymasRodymui: `$${x.kaina + y.kaina}$ eur`,
        sprendimas: `$${x.kaina} + ${y.kaina} = ${x.kaina + y.kaina}$.`,
        brezinys: kainorastis(prekes),
      }),

    // 2. Kainų skirtumas
    () => {
      const didesne = Math.max(x.kaina, y.kaina)
      const mazesne = Math.min(x.kaina, y.kaina)
      if (didesne === mazesne) return null
      return uzdavinys('parduotuves-uzdavinys', {
        // Prekių pavadinimai paliekami kabutėse ir vardininku — taip klausimo
        // nereikia derinti prie kiekvieno pavadinimo linksnio ir giminės.
        klausimas: `Kiek eurų skiriasi prekių „${x.pavadinimas}“ ir „${y.pavadinimas}“ kainos?`,
        atsakymas: String(didesne - mazesne),
        atsakymasRodymui: `$${didesne - mazesne}$ eur`,
        sprendimas: `$${didesne} - ${mazesne} = ${didesne - mazesne}$.`,
        brezinys: kainorastis(prekes),
      })
    },

    // 3. Kiek liks grąžos
    () => {
      const visos = x.kaina + y.kaina + z.kaina
      const turi = Math.ceil((visos + atsitiktinis(100, 800)) / 100) * 100
      if (turi > maks) return null
      return uzdavinys('parduotuves-uzdavinys', {
        klausimas: `Perkamos visos trys kainoraštyje esančios prekės. Kiek eurų liks iš ${turi} eurų?`,
        atsakymas: String(turi - visos),
        atsakymasRodymui: `$${turi - visos}$ eur`,
        sprendimas: `Visos prekės kainuoja $${x.kaina} + ${y.kaina} + ${z.kaina} = ${visos}$, tad liks $${turi} - ${visos} = ${
          turi - visos
        }$.`,
        brezinys: kainorastis(prekes),
      })
    },

    // 4. Ar užteks pinigų
    () => {
      const visos = x.kaina + y.kaina
      const turi = Math.round((visos + atsitiktinis(-300, 300)) / 10) * 10
      if (turi === visos || turi < 50) return null
      return pasirinkimoUzdavinys(naujasId('parduotuves-uzdavinys'), 'parduotuves-uzdavinys', {
        klausimas: `Ar ${turi} eurų užteks prekėms „${x.pavadinimas}“ ir „${y.pavadinimas}“?`,
        variantai:
          turi >= visos
            ? ['taip, užteks', 'ne, neužteks', 'negalima pasakyti']
            : ['ne, neužteks', 'taip, užteks', 'negalima pasakyti'],
        teisingas: 0,
        sprendimas: `Kartu jos kainuoja $${x.kaina} + ${y.kaina} = ${visos}$ eurus.`,
        brezinys: kainorastis(prekes),
      })
    },

    // 5. Brangiausia ir pigiausia
    () => {
      const kainos = prekes.map((p) => p.kaina)
      if (new Set(kainos).size < 3) return null
      return uzdavinys('parduotuves-uzdavinys', {
        klausimas: 'Kiek eurų brangiausia kainoraščio prekė brangesnė už pigiausią?',
        atsakymas: String(Math.max(...kainos) - Math.min(...kainos)),
        atsakymasRodymui: `$${Math.max(...kainos) - Math.min(...kainos)}$ eur`,
        sprendimas: `$${Math.max(...kainos)} - ${Math.min(...kainos)} = ${
          Math.max(...kainos) - Math.min(...kainos)
        }$.`,
        brezinys: kainorastis(prekes),
      })
    },

    // 6. Kurį klausimą galima sudaryti
    () =>
      pasirinkimoUzdavinys(naujasId('parduotuves-uzdavinys'), 'parduotuves-uzdavinys', {
        klausimas: 'Kurį uždavinio klausimą galima atsakyti tik iš kainoraščio duomenų?',
        variantai: [
          'Kiek kainuoja visos trys prekės kartu?',
          'Kiek prekių yra parduotuvės sandėlyje?',
          'Po kelių dienų prekė bus pristatyta?',
        ],
        teisingas: 0,
        sprendimas: 'Kainoraštyje yra tik prekių pavadinimai ir kainos.',
        brezinys: kainorastis(prekes),
      }),

    // 7. Dvi vienodos prekės
    () => {
      const dvi = z.kaina * 2
      if (dvi > maks) return null
      return uzdavinys('parduotuves-uzdavinys', {
        klausimas: `Perkamos dvi prekės „${z.pavadinimas}“. Kiek jos kainuos?`,
        atsakymas: String(dvi),
        atsakymasRodymui: `$${dvi}$ eur`,
        sprendimas: `$${z.kaina} + ${z.kaina} = ${dvi}$.`,
        brezinys: kainorastis(prekes),
      })
    },
  ])
}
