import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { sk4 } from './ketvirtokams-bendra'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 5 klasės tema „Veiksmai su dešimtainiais skaičiais“ — septynios potemės.
 *
 * Anksčiau jos rėmėsi `apvalinimas`, `skaiciu-palyginimas`, `sudetis-atimtis`
 * ir `desimtaines` generatoriais, kurie apie kablelį neklausė nieko: apvalinimo
 * potemė gaudavo sveikuosius skaičius, o sudėties — irgi sveikuosius.
 *
 * Visi šios temos skaičiavimai atliekami šimtosiomis dalimis (sveikaisiais),
 * o kablelis įrašomas tik rodant — antraip slankaus kablelio paklaidos
 * duotų atsakymus tipo $0{,}30000000000000004$.
 */

/** Dešimtainis skaičius su lietuvišku kableliu. */
function des(x: number): string {
  return String(x).replace('.', '{,}')
}

/** Šimtosios → dešimtainis skaičius rodymui: 345 → „3{,}45“. */
function sim(simtosios: number) {
  const zenklas = simtosios < 0 ? '-' : ''
  const a = Math.abs(simtosios)
  return `${zenklas}${Math.floor(a / 100)}{,}${String(a % 100).padStart(2, '0')}`
}

/** Šimtosios → atsakymo eilutė: 345 → „3.45“. */
function simAts(simtosios: number): string {
  return (simtosios / 100).toFixed(2)
}

/**
 * Sveikąjį skaičių, išreikštą $10^{-n}$ dalimis, paverčia tiksliu dešimtainiu
 * užrašu.
 *
 * Dalyba slankiuoju kableliu čia netinka: $8{,}13 : 10$ duotų
 * $0{,}8130000000000001$, ir toks atsakymas patektų mokiniui.
 */
function tikslus(sk: number, n: number): string {
  const zenklas = sk < 0 ? '-' : ''
  const a = String(Math.abs(sk)).padStart(n + 1, '0')
  const sveika = a.slice(0, a.length - n)
  const trupmena = n === 0 ? '' : a.slice(a.length - n).replace(/0+$/, '')
  return zenklas + sveika + (trupmena ? `.${trupmena}` : '')
}

/** Tikslų dešimtainį užrašą paruošia rodymui su lietuvišku kableliu. */
function desT(s: string): string {
  return s.replace('.', '{,}')
}

// ── 6.1.1. Palyginame ───────────────────────────────────────────────────────

const T1 = 'desimtainiu-palyginimas'

const A_PALYGINIMAS = [
  {
    klausimas: 'Kuris skaičius didesnis: $3{,}07$ ar $3{,}7$?',
    atsakymas: '3.7',
    atsakymasRodymui: '$3{,}7$',
    sprendimas: 'Sveikosios dalys lygios, o dešimtųjų skiltyje 7 daugiau už 0.',
  },
] as const

export const desimtainiuPalyginimas: Generatorius = () =>
  suBandymais(kurkPalyginima, A_PALYGINIMAS, T1)

function kurkPalyginima(): Uzdavinys | null {
  const sveikas = atsitiktinis(1, 24)
  const a = atsitiktinis(1, 99)
  const b = atsitiktinis(1, 99)
  if (a === b) return null

  return variacija([
    // 1. Vienodos sveikosios dalys
    () =>
      uzdavinys(T1, {
        klausimas: `Kuris skaičius didesnis: $${sim(sveikas * 100 + a)}$ ar $${sim(sveikas * 100 + b)}$?`,
        atsakymas: simAts(sveikas * 100 + Math.max(a, b)),
        atsakymasRodymui: `$${sim(sveikas * 100 + Math.max(a, b))}$`,
        sprendimas: 'Sveikosios dalys lygios, tad lyginamos dešimtosios, o joms sutapus — šimtosios.',
      }),

    // 2. Skirtingas skaitmenų skaičius po kablelio
    () => {
      const d = atsitiktinis(1, 9)
      const s = atsitiktinis(1, 9)
      const pirmas = sveikas * 100 + d * 10
      const antras = sveikas * 100 + s
      if (pirmas === antras) return null
      return uzdavinys(T1, {
        klausimas: `Kuris skaičius didesnis: $${des(sveikas + d / 10)}$ ar $${sim(antras)}$?`,
        atsakymas: simAts(Math.max(pirmas, antras)),
        atsakymasRodymui: `$${sim(Math.max(pirmas, antras))}$`,
        sprendimas: `$${des(sveikas + d / 10)}$ yra ${d * 10} šimtųjų, o $${sim(antras)}$ — ${s}. Prieš lyginant patogu prirašyti nulį.`,
      })
    },

    // 3. Skirtingos sveikosios dalys
    () => {
      const kitas = sveikas + atsitiktinis(1, 5)
      return uzdavinys(T1, {
        klausimas: `Kuris skaičius didesnis: $${sim(sveikas * 100 + 99)}$ ar $${sim(kitas * 100 + 1)}$?`,
        atsakymas: simAts(kitas * 100 + 1),
        atsakymasRodymui: `$${sim(kitas * 100 + 1)}$`,
        sprendimas: 'Pirmiausia lyginamos sveikosios dalys — tik joms sutapus žiūrima po kablelio.',
      })
    },

    // 4. Rikiavimas
    () => {
      const keturi = sumaisyk([
        sveikas * 100 + 7,
        sveikas * 100 + 70,
        sveikas * 100 + 50,
        sveikas * 100 + 75,
      ])
      const eile = [...keturi].sort((x, y) => x - y)
      return eiliskumoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Surikiuok dešimtainius skaičius didėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${sim(x)}$`),
        sprendimas: 'Patogiausia visus užrašyti šimtosiomis — tada lyginami sveikieji skaičiai.',
      })
    },

    // 5. Kaip lyginama
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kaip lyginami dešimtainiai skaičiai?',
        variantai: [
          'pirma sveikosios dalys, paskui dešimtosios, šimtosios ir taip toliau',
          'pagal skaitmenų skaičių po kablelio',
          'pagal paskutinį skaitmenį',
          'pagal skaitmenų sumą',
        ],
        teisingas: 0,
        sprendimas: 'Ilgesnis užrašas nereiškia didesnio skaičiaus: $3{,}5 > 3{,}49$.',
      }),

    // 6. Klaidingas palyginimas
    () => {
      const d = atsitiktinis(2, 9)
      return uzdavinys(T1, {
        klausimas: `Mokinys teigia, kad $${des(sveikas + d / 100)} > ${des(sveikas + d / 10)}$, nes pirmasis turi daugiau skaitmenų. Kuris skaičius iš tikrųjų didesnis?`,
        atsakymas: String(sveikas + d / 10),
        atsakymasRodymui: `$${des(sveikas + d / 10)}$`,
        sprendimas: `${d} dešimtosios yra dešimt kartų daugiau nei ${d} šimtosios.`,
      })
    },

    // 7. Skaičius tarp dviejų
    () => {
      const d = atsitiktinis(1, 8)
      return uzdavinys(T1, {
        klausimas: `Užrašyk mažiausią šimtosiomis išreikštą skaičių, didesnį už $${des(sveikas + d / 10)}$, bet mažesnį už $${des(sveikas + (d + 1) / 10)}$.`,
        atsakymas: simAts(sveikas * 100 + d * 10 + 1),
        atsakymasRodymui: `$${sim(sveikas * 100 + d * 10 + 1)}$`,
        sprendimas: `Tarp jų telpa šimtosios nuo $${sim(sveikas * 100 + d * 10 + 1)}$ iki $${sim(sveikas * 100 + d * 10 + 9)}$.`,
      })
    },
  ])
}

// ── 6.1.2. Apvaliname iki vienetų ───────────────────────────────────────────

const T2 = 'desimtainiu-apvalinimas-vienetais'

const A_VIENETAI = [
  {
    klausimas: 'Suapvalink $7{,}43$ iki vienetų.',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: 'Dešimtųjų skaitmuo 4, tad apvalinama į apačią.',
  },
] as const

export const desimtainiuApvalinimasVienetais: Generatorius = () =>
  suBandymais(kurkVienetus, A_VIENETAI, T2)

function kurkVienetus(): Uzdavinys | null {
  const sveikas = atsitiktinis(1, 48)
  const trupmena = atsitiktinis(1, 99)
  const visas = sveikas * 100 + trupmena
  const apvalintas = Math.round(visas / 100)

  return variacija([
    // 1. Apvalinimas
    () =>
      uzdavinys(T2, {
        klausimas: `Suapvalink $${sim(visas)}$ iki vienetų.`,
        atsakymas: String(apvalintas),
        atsakymasRodymui: `$${apvalintas}$`,
        sprendimas: `Dešimtųjų skaitmuo ${Math.floor(trupmena / 10)}, tad apvalinama ${trupmena >= 50 ? 'į viršų' : 'į apačią'}.`,
      }),

    // 2. Kuris skaitmuo lemia
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuris skaitmuo lemia, kaip $${sim(visas)}$ apvalinamas iki vienetų?`,
        variantai: ['dešimtųjų', 'šimtųjų', 'vienetų', 'paskutinis'],
        teisingas: 0,
        sprendimas: 'Apvalinant iki vienetų žiūrima į pirmąjį skaitmenį po kablelio.',
      }),

    // 3. Lygiai pusė
    () =>
      uzdavinys(T2, {
        klausimas: `Suapvalink $${sim(sveikas * 100 + 50)}$ iki vienetų.`,
        atsakymas: String(sveikas + 1),
        atsakymasRodymui: `$${sveikas + 1}$`,
        sprendimas: 'Kai po kablelio lygiai pusė, sutarta apvalinti į viršų.',
      }),

    // 4. Mažiausias ir didžiausias
    () =>
      uzdavinys(T2, {
        klausimas: `Koks yra mažiausias šimtosiomis išreikštas skaičius, kuris apvalinant iki vienetų tampa ${sveikas}?`,
        atsakymas: simAts(sveikas * 100 - 50),
        atsakymasRodymui: `$${sim(sveikas * 100 - 50)}$`,
        sprendimas: `Tinka visi nuo $${sim(sveikas * 100 - 50)}$ iki $${sim(sveikas * 100 + 49)}$.`,
      }),

    // 5. Klaidos radimas
    () => {
      if (trupmena >= 50) return null
      return uzdavinys(T2, {
        klausimas: `Mokinys $${sim(visas)}$ suapvalino iki vienetų ir gavo ${sveikas + 1}. Užrašyk teisingą atsakymą.`,
        atsakymas: String(sveikas),
        atsakymasRodymui: `$${sveikas}$`,
        sprendimas: `Dešimtųjų skaitmuo ${Math.floor(trupmena / 10)} yra mažesnis už 5, tad sveikoji dalis nesikeičia.`,
      })
    },

    // 6. Taikymas
    () =>
      uzdavinys(T2, {
        klausimas: `Prekė kainuoja $${sim(visas)}$ Eur. Apytiksliai kiek eurų reikės, apvalinant iki vienetų?`,
        atsakymas: String(apvalintas),
        atsakymasRodymui: `$${apvalintas}$ Eur`,
        sprendimas: `$${sim(visas)} \\approx ${apvalintas}$.`,
      }),

    // 7. Per sveikojo ribą
    () =>
      uzdavinys(T2, {
        klausimas: `Suapvalink $${sim(sveikas * 100 + 96)}$ iki vienetų.`,
        atsakymas: String(sveikas + 1),
        atsakymasRodymui: `$${sveikas + 1}$`,
        sprendimas: 'Dešimtųjų skaitmuo 9, tad apvalinama į viršų iki artimiausio sveikojo.',
      }),
  ])
}

// ── 6.1.3. Apvaliname iki nurodyto skyriaus ─────────────────────────────────

const T3 = 'desimtainiu-apvalinimas-skyriumi'

const A_SKYRIUS = [
  {
    klausimas: 'Suapvalink $4{,}273$ iki dešimtųjų.',
    atsakymas: '4.3',
    atsakymasRodymui: '$4{,}3$',
    sprendimas: 'Šimtųjų skaitmuo 7, tad apvalinama į viršų.',
  },
] as const

export const desimtainiuApvalinimasSkyriumi: Generatorius = () =>
  suBandymais(kurkSkyriu, A_SKYRIUS, T3)

function kurkSkyriu(): Uzdavinys | null {
  const sveikas = atsitiktinis(1, 48)
  const tukstantosios = atsitiktinis(101, 989)
  const skaicius = Number(`${sveikas}.${tukstantosios}`)
  const ikiDesimtuju = Math.round(skaicius * 10) / 10
  const ikiSimtuju = Math.round(skaicius * 100) / 100

  return variacija([
    // 1. Iki dešimtųjų
    () =>
      uzdavinys(T3, {
        klausimas: `Suapvalink $${des(skaicius)}$ iki dešimtųjų.`,
        atsakymas: String(ikiDesimtuju),
        atsakymasRodymui: `$${des(ikiDesimtuju)}$`,
        sprendimas: `Šimtųjų skaitmuo ${String(tukstantosios)[1]}, tad apvalinama ${Number(String(tukstantosios)[1]) >= 5 ? 'į viršų' : 'į apačią'}.`,
      }),

    // 2. Iki šimtųjų
    () =>
      uzdavinys(T3, {
        klausimas: `Suapvalink $${des(skaicius)}$ iki šimtųjų.`,
        atsakymas: String(ikiSimtuju),
        atsakymasRodymui: `$${des(ikiSimtuju)}$`,
        sprendimas: `Tūkstantųjų skaitmuo ${String(tukstantosios)[2]}, tad apvalinama ${Number(String(tukstantosios)[2]) >= 5 ? 'į viršų' : 'į apačią'}.`,
      }),

    // 3. Kurį skaitmenį tikriname
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kurį skaitmenį reikia patikrinti apvalinant $${des(skaicius)}$ iki dešimtųjų?`,
        variantai: ['šimtųjų', 'dešimtųjų', 'tūkstantųjų', 'sveikųjų'],
        teisingas: 0,
        sprendimas: 'Apvalinama pagal artimiausią žemesnę skiltį.',
      }),

    // 4. Kiek skaitmenų liks
    () =>
      uzdavinys(T3, {
        klausimas: `Kiek skaitmenų po kablelio liks suapvalinus $${des(skaicius)}$ iki šimtųjų?`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Šimtosios yra antroji skiltis po kablelio.',
      }),

    // 5. Du apvalinimai
    () => {
      if (ikiDesimtuju === ikiSimtuju) return null
      return uzdavinys(T3, {
        klausimas: `Skaičių $${des(skaicius)}$ suapvalink iki dešimtųjų ir iki šimtųjų. Kuris rezultatas didesnis?`,
        atsakymas: String(Math.max(ikiDesimtuju, ikiSimtuju)),
        atsakymasRodymui: `$${des(Math.max(ikiDesimtuju, ikiSimtuju))}$`,
        sprendimas: `Iki dešimtųjų — $${des(ikiDesimtuju)}$, iki šimtųjų — $${des(ikiSimtuju)}$.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const paskutinis = Number(String(tukstantosios)[2])
      if (paskutinis >= 5) return null
      const klaidingas = Math.round((skaicius + 0.001) * 100) / 100
      if (klaidingas === ikiSimtuju) return null
      return uzdavinys(T3, {
        klausimas: `Mokinys $${des(skaicius)}$ iki šimtųjų suapvalino $${des(klaidingas)}$. Užrašyk teisingą atsakymą.`,
        atsakymas: String(ikiSimtuju),
        atsakymasRodymui: `$${des(ikiSimtuju)}$`,
        sprendimas: `Tūkstantųjų skaitmuo ${paskutinis} mažesnis už 5, tad šimtosios nekeičiamos.`,
      })
    },

    // 7. Taikymas
    () => {
      const kaina = Number(`${atsitiktinis(2, 40)}.${atsitiktinis(101, 989)}`)
      const apvalinta = Math.round(kaina * 100) / 100
      return uzdavinys(T3, {
        klausimas: `Apskaičiuota, kad vieno vieneto kaina yra $${des(kaina)}$ Eur. Kiek tai bus suapvalinus iki centų (šimtųjų)?`,
        atsakymas: String(apvalinta),
        atsakymasRodymui: `$${des(apvalinta)}$ Eur`,
        sprendimas: 'Centas yra euro šimtoji dalis, tad apvalinama iki dviejų skaitmenų po kablelio.',
      })
    },
  ])
}

// ── 6.2.1. Sudedame ─────────────────────────────────────────────────────────

const T4 = 'desimtainiu-sudetis'

const A_SUDETIS = [
  {
    klausimas: 'Apskaičiuok: $3{,}45 + 2{,}80$.',
    atsakymas: '6.25',
    atsakymasRodymui: '$6{,}25$',
    sprendimas: 'Kablelis rašomas po kableliu.',
  },
] as const

export const desimtainiuSudetis: Generatorius = () => suBandymais(kurkSudeti, A_SUDETIS, T4)

function kurkSudeti(): Uzdavinys | null {
  const a = atsitiktinis(105, 4890)
  const b = atsitiktinis(105, 3890)

  return variacija([
    // 1. Suma
    () =>
      uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${sim(a)} + ${sim(b)}$.`,
        atsakymas: simAts(a + b),
        atsakymasRodymui: `$${sim(a + b)}$`,
        sprendimas: `Rašant stulpeliu kablelis rašomas po kableliu: $${sim(a + b)}$.`,
      }),

    // 2. Skirtingas skaitmenų skaičius
    () => {
      const d = atsitiktinis(1, 9)
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${sim(a)} + ${des(d / 10)}$.`,
        atsakymas: simAts(a + d * 10),
        atsakymasRodymui: `$${sim(a + d * 10)}$`,
        sprendimas: `$${des(d / 10)}$ yra ${d * 10} šimtųjų, tad prieš sudedant patogu prirašyti nulį: $${des(d / 10)}0$.`,
      })
    },

    // 3. Su natūraliuoju
    () => {
      const n = atsitiktinis(2, 40)
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${sim(a)} + ${n}$.`,
        atsakymas: simAts(a + n * 100),
        atsakymasRodymui: `$${sim(a + n * 100)}$`,
        sprendimas: 'Natūralusis skaičius pridedamas prie sveikosios dalies.',
      })
    },

    // 4. Trūkstamas dėmuo
    () =>
      uzdavinys(T4, {
        klausimas: `Rask trūkstamą dėmenį: $\\square + ${sim(b)} = ${sim(a + b)}$.`,
        atsakymas: simAts(a),
        atsakymasRodymui: `$${sim(a)}$`,
        sprendimas: `$${sim(a + b)} - ${sim(b)} = ${sim(a)}$.`,
      }),

    // 5. Trys dėmenys
    () => {
      const c = atsitiktinis(105, 1890)
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${sim(a)} + ${sim(b)} + ${sim(c)}$.`,
        atsakymas: simAts(a + b + c),
        atsakymasRodymui: `$${sim(a + b + c)}$`,
        sprendimas: `$${sim(a + b)} + ${sim(c)} = ${sim(a + b + c)}$.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const d = atsitiktinis(1, 9)
      const klaidingas = a + d
      return uzdavinys(T4, {
        klausimas: `Mokinys apskaičiavo $${sim(a)} + ${des(d / 10)} = ${sim(klaidingas)}$ — kablelio nepastatė vieną po kitu. Užrašyk teisingą sumą.`,
        atsakymas: simAts(a + d * 10),
        atsakymasRodymui: `$${sim(a + d * 10)}$`,
        sprendimas: `$${des(d / 10)}$ yra dešimtosios, o ne šimtosios: $${sim(a)} + ${des(d / 10)}0 = ${sim(a + d * 10)}$.`,
      })
    },

    // 7. Tekstinis
    () =>
      uzdavinys(T4, {
        klausimas: `Vienos prekės masė $${sim(a)}$ kg, kitos — $${sim(b)}$ kg. Kokia jų bendra masė?`,
        atsakymas: simAts(a + b),
        atsakymasRodymui: `$${sim(a + b)}$ kg`,
        sprendimas: `$${sim(a)} + ${sim(b)} = ${sim(a + b)}$.`,
      }),
  ])
}

// ── 6.2.2. Atimame ──────────────────────────────────────────────────────────

const T5 = 'desimtainiu-atimtis'

const A_ATIMTIS = [
  {
    klausimas: 'Apskaičiuok: $8{,}40 - 3{,}65$.',
    atsakymas: '4.75',
    atsakymasRodymui: '$4{,}75$',
    sprendimas: 'Kablelis rašomas po kableliu.',
  },
] as const

export const desimtainiuAtimtis: Generatorius = () => suBandymais(kurkAtimti, A_ATIMTIS, T5)

function kurkAtimti(): Uzdavinys | null {
  const a = atsitiktinis(2050, 8900)
  const b = atsitiktinis(105, 1990)

  return variacija([
    // 1. Skirtumas
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${sim(a)} - ${sim(b)}$.`,
        atsakymas: simAts(a - b),
        atsakymasRodymui: `$${sim(a - b)}$`,
        sprendimas: `Rašant stulpeliu kablelis rašomas po kableliu: $${sim(a - b)}$.`,
      }),

    // 2. Iš natūraliojo
    () => {
      const n = Math.ceil(a / 100) + atsitiktinis(1, 5)
      return uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${n} - ${sim(a)}$.`,
        atsakymas: simAts(n * 100 - a),
        atsakymasRodymui: `$${sim(n * 100 - a)}$`,
        sprendimas: `Natūralusis skaičius užrašomas kaip $${n}{,}00$, tad $${n}{,}00 - ${sim(a)} = ${sim(n * 100 - a)}$.`,
      })
    },

    // 3. Trūkstamas atėminys
    () =>
      uzdavinys(T5, {
        klausimas: `Rask trūkstamą atėminį: $${sim(a)} - \\square = ${sim(a - b)}$.`,
        atsakymas: simAts(b),
        atsakymasRodymui: `$${sim(b)}$`,
        sprendimas: `$${sim(a)} - ${sim(a - b)} = ${sim(b)}$.`,
      }),

    // 4. Skirtingas skaitmenų skaičius
    () => {
      const d = atsitiktinis(1, 9)
      return uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${sim(a)} - ${des(d / 10)}$.`,
        atsakymas: simAts(a - d * 10),
        atsakymasRodymui: `$${sim(a - d * 10)}$`,
        sprendimas: `$${des(d / 10)}$ yra ${d * 10} šimtųjų.`,
      })
    },

    // 5. Du atėmimai
    () => {
      const c = atsitiktinis(105, 990)
      if (a - b - c <= 0) return null
      return uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${sim(a)} - ${sim(b)} - ${sim(c)}$.`,
        atsakymas: simAts(a - b - c),
        atsakymasRodymui: `$${sim(a - b - c)}$`,
        sprendimas: `$${sim(a - b)} - ${sim(c)} = ${sim(a - b - c)}$.`,
      })
    },

    // 6. Patikra sudėtimi
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuota $${sim(a)} - ${sim(b)} = ${sim(a - b)}$. Patikrink: prie skirtumo pridėk atėminį ir užrašyk rezultatą.`,
        atsakymas: simAts(a),
        atsakymasRodymui: `$${sim(a)}$`,
        sprendimas: `$${sim(a - b)} + ${sim(b)} = ${sim(a)}$ — gautas turinys, tad atimtis teisinga.`,
      }),

    // 7. Tekstinis
    () =>
      uzdavinys(T5, {
        klausimas: `Turėta $${sim(a)}$ Eur, išleista $${sim(b)}$ Eur. Kiek pinigų liko?`,
        atsakymas: simAts(a - b),
        atsakymasRodymui: `$${sim(a - b)}$ Eur`,
        sprendimas: `$${sim(a)} - ${sim(b)} = ${sim(a - b)}$.`,
      }),
  ])
}

// ── 6.3.1. Dešimtainio ir natūraliojo skaičių daugyba ───────────────────────

const T6 = 'desimtainio-daugyba'

const A_DAUGYBA = [
  {
    klausimas: 'Apskaičiuok: $2{,}35 \\cdot 4$.',
    atsakymas: '9.40',
    atsakymasRodymui: '$9{,}40$',
    sprendimas: '$235 \\cdot 4 = 940$ šimtųjų.',
  },
] as const

export const desimtainioDaugyba: Generatorius = () => suBandymais(kurkDaugyba, A_DAUGYBA, T6)

function kurkDaugyba(): Uzdavinys | null {
  const a = atsitiktinis(105, 890)
  const n = atsitiktinis(2, 9)

  return variacija([
    // 1. Sandauga
    () =>
      uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${sim(a)} \\cdot ${n}$.`,
        atsakymas: simAts(a * n),
        atsakymasRodymui: `$${sim(a * n)}$`,
        sprendimas: `Dauginama neatsižvelgiant į kablelį: $${a} \\cdot ${n} = ${a * n}$, o rezultate atskiriami du skaitmenys po kablelio.`,
      }),

    // 2. Kiek skaitmenų po kablelio
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Kiek skaitmenų po kablelio turės sandauga $${sim(a)} \\cdot ${n}$?`,
        variantai: ['du — tiek pat, kiek dauginamajame', 'nė vieno', 'keturis', 'vieną'],
        teisingas: 0,
        sprendimas: 'Natūralusis daugiklis skaitmenų po kablelio neprideda.',
      }),

    // 3. Su dešimtosiomis
    () => {
      const d = atsitiktinis(11, 89)
      return uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${des(d / 10)} \\cdot ${n}$.`,
        atsakymas: String((d * n) / 10),
        atsakymasRodymui: `$${des((d * n) / 10)}$`,
        sprendimas: `$${d} \\cdot ${n} = ${d * n}$, o rezultate atskiriamas vienas skaitmuo po kablelio.`,
      })
    },

    // 4. Trūkstamas daugiklis
    () =>
      uzdavinys(T6, {
        klausimas: `Rask trūkstamą daugiklį: $${sim(a)} \\cdot \\square = ${sim(a * n)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${sim(a * n)} : ${sim(a)} = ${n}$.`,
      }),

    // 5. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: `Mokinys apskaičiavo $${sim(a)} \\cdot ${n} = ${sim(Math.round((a * n) / 10))}$ — netinkamai atskyrė skaitmenis po kablelio. Užrašyk teisingą sandaugą.`,
        atsakymas: simAts(a * n),
        atsakymasRodymui: `$${sim(a * n)}$`,
        sprendimas: 'Sandaugoje po kablelio atskiriama tiek skaitmenų, kiek jų buvo dešimtainiame dauginamajame.',
      }),

    // 6. Kaip kartotinė sudėtis
    () => {
      const k = atsitiktinis(2, 4)
      return uzdavinys(T6, {
        klausimas: `Užrašyk sandauga ir apskaičiuok: $${Array(k).fill(sim(a)).join(' + ')}$.`,
        atsakymas: simAts(a * k),
        atsakymasRodymui: `$${sim(a * k)}$`,
        sprendimas: `Tai $${sim(a)} \\cdot ${k} = ${sim(a * k)}$.`,
      })
    },

    // 7. Tekstinis
    () =>
      uzdavinys(T6, {
        klausimas: `Vienas sąsiuvinis kainuoja $${sim(a)}$ Eur. Kiek kainuos ${n} tokie sąsiuviniai?`,
        atsakymas: simAts(a * n),
        atsakymasRodymui: `$${sim(a * n)}$ Eur`,
        sprendimas: `$${sim(a)} \\cdot ${n} = ${sim(a * n)}$.`,
      }),
  ])
}

// ── 6.3.2. Dauginame iš 10, 100, 1000 ───────────────────────────────────────

const T7 = 'daugyba-is-10-100-1000'

const A_DEsIMT = [
  {
    klausimas: 'Apskaičiuok: $3{,}45 \\cdot 10$.',
    atsakymas: '34.5',
    atsakymasRodymui: '$34{,}5$',
    sprendimas: 'Kablelis perkeliamas viena skiltimi į dešinę.',
  },
] as const

export const daugybaIs101001000: Generatorius = () => suBandymais(kurkDesimt, A_DEsIMT, T7)

function kurkDesimt(): Uzdavinys | null {
  const a = atsitiktinis(105, 990)
  const kartai = pasirink([10, 100, 1000])
  const nuliu = String(kartai).length - 1

  return variacija([
    // 1. Daugyba
    () => {
      const rez = tikslus(a * kartai, 2)
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${sim(a)} \\cdot ${kartai}$.`,
        atsakymas: rez,
        atsakymasRodymui: `$${desT(rez)}$`,
        sprendimas: `Dauginant iš ${kartai} kablelis perkeliamas ${nuliu} ${nuliu === 1 ? 'skiltimi' : 'skiltimis'} į dešinę.`,
      })
    },

    // 2. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Kas atsitinka dešimtainiam skaičiui padauginus jį iš ${kartai}?`,
        variantai: [
          `kablelis perkeliamas ${nuliu} ${nuliu === 1 ? 'skiltimi' : 'skiltimis'} į dešinę`,
          `kablelis perkeliamas ${nuliu} ${nuliu === 1 ? 'skiltimi' : 'skiltimis'} į kairę`,
          `prie skaičiaus pridedama ${kartai}`,
          'kablelis nesikeičia',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienas nulis daugiklyje pastumia kablelį per vieną skiltį.',
      }),

    // 3. Dalyba iš 10
    () => {
      const rez = tikslus(a, 3)
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${sim(a)} : 10$.`,
        atsakymas: rez,
        atsakymasRodymui: `$${desT(rez)}$`,
        sprendimas: 'Dalijant iš 10 kablelis perkeliamas viena skiltimi į kairę.',
      })
    },

    // 4. Iš kiek padauginta
    () => {
      const rez = tikslus(a * kartai, 2)
      return uzdavinys(T7, {
        klausimas: `Iš kokio skaičiaus padaugintas $${sim(a)}$, jei gauta $${desT(rez)}$?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `Kablelis pasislinko ${nuliu} ${nuliu === 1 ? 'skiltimi' : 'skiltimis'} į dešinę, tad dauginta iš ${kartai}.`,
      })
    },

    // 5. Kada gaunamas sveikasis
    () =>
      uzdavinys(T7, {
        klausimas: `Iš kokio mažiausio skaičiaus (10, 100 ar 1000) reikia padauginti $${sim(a)}$, kad gautųsi sveikasis skaičius?`,
        atsakymas: '100',
        atsakymasRodymui: '$100$',
        sprendimas: `Po kablelio yra du skaitmenys, tad kablelį reikia pastumti dviem skiltimis: $${sim(a)} \\cdot 100 = ${a}$.`,
      }),

    // 6. Klaidos radimas
    () => {
      const rez = tikslus(a * kartai, 2)
      return uzdavinys(T7, {
        klausimas: `Mokinys apskaičiavo $${sim(a)} \\cdot ${kartai} = ${sk4(a * kartai)}$ — kablelio išvis nepaisė. Užrašyk teisingą sandaugą.`,
        atsakymas: rez,
        atsakymasRodymui: `$${desT(rez)}$`,
        sprendimas: `Kablelis perkeliamas ${nuliu} ${nuliu === 1 ? 'skiltimi' : 'skiltimis'}, o ne panaikinamas.`,
      })
    },

    // 7. Tekstinis
    () => {
      const kaina = atsitiktinis(105, 890)
      return uzdavinys(T7, {
        klausimas: `Vienas vienetas kainuoja $${sim(kaina)}$ Eur. Kiek kainuos 100 vienetų?`,
        atsakymas: String(kaina),
        atsakymasRodymui: `$${sk4(kaina)}$ Eur`,
        sprendimas: `Dauginant iš 100 kablelis perkeliamas dviem skiltimis: $${sim(kaina)} \\cdot 100 = ${sk4(kaina)}$.`,
      })
    },
  ])
}
