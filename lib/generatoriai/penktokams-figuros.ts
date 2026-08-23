import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { daugiakampis } from './antroku-figuru-vaizdai'
import { vienasBrezinys } from './treciokams-geometrija-vaizdai'
import { trikampisPagalKampus } from './ketvirtokams-ploto-vaizdai'
import { figuraSuUzrasais, staciakampisSuMatais, trikampisSuMatais } from './treciokams-matai-vaizdai'
import { kampasSuRaidemis } from './penktokams-kampu-vaizdai'
import { sk4 } from './ketvirtokams-bendra'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 5 klasės tema „Trikampiai ir keturkampiai“ — devynios potemės.
 *
 * Matavimo vienetų potemės (9.2.1 ir 9.3.1) yra apie vertimą, ne apie
 * skaičiavimą, tad jos gauna savo generatorius: ilgio — mm, cm, dm, m, km;
 * ploto — mm², cm², dm², m², a, ha, km². Ploto vienetų kaimynai skiriasi
 * 100 kartų, ne 10 — tai ir yra tos potemės esmė.
 */

const ILGIO = [
  { vardas: 'mm', mm: 1 },
  { vardas: 'cm', mm: 10 },
  { vardas: 'dm', mm: 100 },
  { vardas: 'm', mm: 1000 },
  { vardas: 'km', mm: 1000000 },
] as const

const PLOTO = [
  { vardas: 'mm²', mm2: 1 },
  { vardas: 'cm²', mm2: 100 },
  { vardas: 'dm²', mm2: 10000 },
  { vardas: 'm²', mm2: 1000000 },
] as const

const DAUGIAKAMPIU_VARDAI: Record<number, string> = {
  3: 'trikampis',
  4: 'keturkampis',
  5: 'penkiakampis',
  6: 'šešiakampis',
  7: 'septynkampis',
  8: 'aštuonkampis',
}

// ── 9.1.1. Daugiakampis ─────────────────────────────────────────────────────

const T1 = 'daugiakampis-5'

const A_DAUGIAKAMPIS = [
  {
    klausimas: 'Kiek kraštinių turi penkiakampis?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Daugiakampio pavadinimas rodo kampų, o kartu ir kraštinių skaičių.',
  },
] as const

export const daugiakampis5: Generatorius = () => suBandymais(kurkDaugiakampi, A_DAUGIAKAMPIS, T1)

function kurkDaugiakampi(): Uzdavinys | null {
  const n = atsitiktinis(3, 8)

  return variacija([
    // 1. Kiek kraštinių
    () =>
      uzdavinys(T1, {
        klausimas: `Kiek kraštinių turi ${DAUGIAKAMPIU_VARDAI[n]}?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: 'Daugiakampyje kraštinių tiek pat, kiek ir kampų.',
      }),

    // 2. Pavadinimas iš brėžinio
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek kraštinių turi pavaizduota figūra?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Tai ${DAUGIAKAMPIU_VARDAI[n]}.`,
        brezinys: vienasBrezinys(daugiakampis(n, atsitiktinis(0, 1) === 1, atsitiktinis(1, 40))),
      }),

    // 3. Kiek viršūnių
    () =>
      uzdavinys(T1, {
        klausimas: `Kiek viršūnių turi ${DAUGIAKAMPIU_VARDAI[n]}?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: 'Viršūnių tiek pat, kiek kraštinių — kiekvienoje jų susieina dvi kraštinės.',
      }),

    // 4. Kas yra daugiakampis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuri figūra yra daugiakampis?',
        variantai: [
          'uždara laužtė ir jos vidus',
          'apskritimas',
          'laužtė, kurios galai nesusieina',
          'bet kokia kreivė',
        ],
        teisingas: 0,
        sprendimas: 'Daugiakampio kraštinės yra atkarpos, o laužtė turi būti uždara.',
      }),

    // 5. Taisyklingas daugiakampis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuris daugiakampis vadinamas taisyklinguoju?',
        variantai: [
          'kurio visos kraštinės ir visi kampai lygūs',
          'kurio visos kraštinės lygios',
          'kuris turi lyginį kraštinių skaičių',
          'kuris nubrėžtas tiksliai',
        ],
        teisingas: 0,
        sprendimas: 'Kvadratas yra taisyklingasis keturkampis, o lygiakraštis trikampis — taisyklingasis trikampis.',
        brezinys: vienasBrezinys(daugiakampis(n, true, atsitiktinis(1, 40))),
      }),

    // 6. Kiek įstrižainių
    () => {
      if (n < 4) return null
      return uzdavinys(T1, {
        klausimas: `Kiek įstrižainių galima nubrėžti iš vienos ${DAUGIAKAMPIU_VARDAI[n]} viršūnės?`,
        atsakymas: String(n - 3),
        atsakymasRodymui: `$${n - 3}$`,
        sprendimas: `Į save ir į dvi gretimas viršūnes įstrižainės nebrėžiamos: $${n} - 3 = ${n - 3}$.`,
      })
    },

    // 7. Pavadinimas pagal kraštinių skaičių
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Kaip vadinamas daugiakampis, turintis ${n} kraštines?`,
        variantai: [
          DAUGIAKAMPIU_VARDAI[n],
          DAUGIAKAMPIU_VARDAI[n === 8 ? 3 : n + 1],
          DAUGIAKAMPIU_VARDAI[n === 3 ? 8 : n - 1],
          'apskritimas',
        ],
        teisingas: 0,
        sprendimas: 'Pavadinimas sudaromas iš kampų skaičiaus.',
      }),

    // 8. Kraštinių ilgių suma
    () => {
      const krastine = atsitiktinis(3, 12)
      return uzdavinys(T1, {
        klausimas: `Taisyklingojo ${DAUGIAKAMPIU_VARDAI[n]} kraštinė yra ${krastine} cm. Kokia visų jo kraštinių ilgių suma?`,
        atsakymas: String(n * krastine),
        atsakymasRodymui: `$${n * krastine}$ cm`,
        sprendimas: `Visos kraštinės lygios: $${krastine} \\cdot ${n} = ${n * krastine}$.`,
      })
    },
  ])
}

// ── 9.1.2. Trikampio kampai ─────────────────────────────────────────────────

const T2 = 'trikampio-kampai'

const A_TRIKAMPIO_KAMPAI = [
  {
    klausimas: 'Kiek laipsnių turi trikampio kampų suma?',
    atsakymas: '180',
    atsakymasRodymui: '$180°$',
    sprendimas: 'Bet kurio trikampio kampų suma lygi ištiestiniam kampui.',
  },
] as const

export const trikampioKampai: Generatorius = () => suBandymais(kurkTrikampioKampus, A_TRIKAMPIO_KAMPAI, T2)

function kurkTrikampioKampus(): Uzdavinys | null {
  const a = atsitiktinis(25, 90)
  const b = atsitiktinis(25, 175 - a)
  const c = 180 - a - b
  if (c < 15) return null

  return variacija([
    // 1. Kampų suma
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek laipsnių turi trikampio kampų suma?',
        atsakymas: '180',
        atsakymasRodymui: '$180°$',
        sprendimas: 'Ši savybė galioja bet kuriam trikampiui.',
      }),

    // 2. Trečiasis kampas
    () =>
      uzdavinys(T2, {
        klausimas: `Du trikampio kampai yra ${a}° ir ${b}°. Kiek laipsnių turi trečiasis?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}°$`,
        sprendimas: `$180 - ${a} - ${b} = ${c}$.`,
      }),

    // 3. Stačiajame trikampyje
    () => {
      const smailus = atsitiktinis(20, 70)
      return uzdavinys(T2, {
        klausimas: `Stačiojo trikampio vienas smailusis kampas yra ${smailus}°. Kiek laipsnių turi kitas smailusis kampas?`,
        atsakymas: String(90 - smailus),
        atsakymasRodymui: `$${90 - smailus}°$`,
        sprendimas: `Statusis kampas jau užima 90°, tad smailiesiems lieka 90°: $90 - ${smailus} = ${90 - smailus}$.`,
        brezinys: trikampisPagalKampus('statusis'),
      })
    },

    // 4. Lygiakraštis
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek laipsnių turi kiekvienas lygiakraščio trikampio kampas?',
        atsakymas: '60',
        atsakymasRodymui: `$60°$`,
        sprendimas: '$180 : 3 = 60$.',
      }),

    // 5. Lygiašonis
    () => {
      const pagrindo = atsitiktinis(30, 75)
      return uzdavinys(T2, {
        klausimas: `Lygiašonio trikampio kampai prie pagrindo yra po ${pagrindo}°. Kiek laipsnių turi trečiasis kampas?`,
        atsakymas: String(180 - 2 * pagrindo),
        atsakymasRodymui: `$${180 - 2 * pagrindo}°$`,
        sprendimas: `$180 - ${pagrindo} \\cdot 2 = ${180 - 2 * pagrindo}$.`,
      })
    },

    // 6. Ar toks trikampis egzistuoja
    () => {
      const x = atsitiktinis(95, 130)
      const y = atsitiktinis(95, 130)
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar gali trikampio kampai būti ${x}° ir ${y}°?`,
        variantai: [
          `ne, nes jų suma jau viršija 180°`,
          'taip, jei trečiasis kampas mažas',
          'taip, jei trikampis bukasis',
        ],
        teisingas: 0,
        sprendimas: `$${x} + ${y} = ${x + y}$, o visų trijų kampų suma turi būti lygiai 180°.`,
      })
    },

    // 7. Kiek bukųjų kampų
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kiek bukųjų kampų daugiausia gali turėti trikampis?',
        variantai: ['vieną', 'du', 'tris', 'nė vieno'],
        teisingas: 0,
        sprendimas: 'Du bukieji kampai jau viršytų 180°, o tiek gali būti visų trijų suma.',
        brezinys: trikampisPagalKampus('bukasis'),
      }),

    // 8. Kampų santykis
    () => {
      const dalis = pasirink([2, 3, 4, 5])
      if (180 % (1 + dalis + dalis) !== 0) return null
      const maziausias = 180 / (1 + 2 * dalis)
      return uzdavinys(T2, {
        klausimas: `Trikampio du kampai lygūs, o kiekvienas jų ${dalis} kartus didesnis už trečiąjį. Kiek laipsnių turi mažiausias kampas?`,
        atsakymas: String(maziausias),
        atsakymasRodymui: `$${maziausias}°$`,
        sprendimas: `Kampai sudaro $1 + ${dalis} + ${dalis} = ${1 + 2 * dalis}$ vienodas dalis: $180 : ${1 + 2 * dalis} = ${maziausias}$.`,
      })
    },
  ])
}

// ── 9.1.3. Daugiakampio kampai ──────────────────────────────────────────────

const T3 = 'daugiakampio-kampai'

const A_DAUGIAKAMPIO_KAMPAI = [
  {
    klausimas: 'Kiek laipsnių turi keturkampio kampų suma?',
    atsakymas: '360',
    atsakymasRodymui: '$360°$',
    sprendimas: 'Keturkampį įstrižainė dalija į du trikampius: $180 \\cdot 2 = 360$.',
  },
] as const

export const daugiakampioKampai: Generatorius = () => suBandymais(kurkDaugiakampioKampus, A_DAUGIAKAMPIO_KAMPAI, T3)

function kurkDaugiakampioKampus(): Uzdavinys | null {
  const n = atsitiktinis(4, 8)
  const suma = (n - 2) * 180
  const a = atsitiktinis(60, 120)
  const b = atsitiktinis(60, 120)
  const c = atsitiktinis(60, 120)

  return variacija([
    // 1. Keturkampio kampų suma
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek laipsnių turi keturkampio kampų suma?',
        atsakymas: '360',
        atsakymasRodymui: `$360°$`,
        sprendimas: 'Įstrižainė dalija keturkampį į du trikampius: $180 \\cdot 2 = 360$.',
      }),

    // 2. Ketvirtasis kampas
    () => {
      const d = 360 - a - b - c
      if (d < 20 || d > 170) return null
      return uzdavinys(T3, {
        klausimas: `Trys keturkampio kampai yra ${a}°, ${b}° ir ${c}°. Kiek laipsnių turi ketvirtasis?`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}°$`,
        sprendimas: `$360 - ${a} - ${b} - ${c} = ${d}$.`,
      })
    },

    // 3. Į kiek trikampių dalijasi
    () =>
      uzdavinys(T3, {
        klausimas: `Į kiek trikampių įstrižainėmis iš vienos viršūnės dalijamas ${DAUGIAKAMPIU_VARDAI[n]}?`,
        atsakymas: String(n - 2),
        atsakymasRodymui: `$${n - 2}$`,
        sprendimas: `Trikampių visada dviem mažiau nei kraštinių: $${n} - 2 = ${n - 2}$.`,
      }),

    // 4. Kampų suma
    () =>
      uzdavinys(T3, {
        klausimas: `Kiek laipsnių turi ${DAUGIAKAMPIU_VARDAI[n]} kampų suma?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}°$`,
        sprendimas: `Jis dalijasi į ${n - 2} trikampius: $180 \\cdot ${n - 2} = ${suma}$.`,
        brezinys: vienasBrezinys(daugiakampis(n, true, atsitiktinis(1, 40))),
      }),

    // 5. Taisyklingojo kampas
    () => {
      if (suma % n !== 0) return null
      return uzdavinys(T3, {
        klausimas: `Kiek laipsnių turi kiekvienas taisyklingojo ${DAUGIAKAMPIU_VARDAI[n]} kampas?`,
        atsakymas: String(suma / n),
        atsakymasRodymui: `$${suma / n}°$`,
        sprendimas: `Kampų suma ${suma}°, o visi kampai lygūs: $${suma} : ${n} = ${suma / n}$.`,
      })
    },

    // 6. Kvadrato kampas
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek laipsnių turi kiekvienas kvadrato kampas?',
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: '$360 : 4 = 90$ — visi kampai statieji.',
      }),

    // 7. Kiek kraštinių
    () => {
      const kiek = atsitiktinis(4, 8)
      return uzdavinys(T3, {
        klausimas: `Daugiakampio kampų suma yra ${(kiek - 2) * 180}°. Kiek jis turi kraštinių?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `$${(kiek - 2) * 180} : 180 = ${kiek - 2}$ trikampiai, tad kraštinių $${kiek - 2} + 2 = ${kiek}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: 'Mokinys teigia, kad keturkampio kampų suma, kaip ir trikampio, yra 180°. Kiek laipsnių ji yra iš tikrųjų?',
        atsakymas: '360',
        atsakymasRodymui: `$360°$`,
        sprendimas: 'Keturkampis dalijasi į du trikampius, tad jo kampų suma dvigubai didesnė.',
      }),
  ])
}

// ── 9.2.1. Ilgio matavimo vienetai ──────────────────────────────────────────

const T4 = 'ilgio-vienetai-5'

const A_ILGIO = [
  {
    klausimas: 'Kiek centimetrų yra 3 m?',
    atsakymas: '300',
    atsakymasRodymui: '$300$ cm',
    sprendimas: '$1$ m $= 100$ cm.',
  },
] as const

export const ilgioVienetai5: Generatorius = () => suBandymais(kurkIlgi, A_ILGIO, T4)

function kurkIlgi(): Uzdavinys | null {
  const i = atsitiktinis(0, ILGIO.length - 2)
  const didesnis = ILGIO[i + 1]
  const mazesnis = ILGIO[i]
  const kartai = didesnis.mm / mazesnis.mm
  const n = atsitiktinis(2, 40)

  return variacija([
    // 1. Iš didesnio į mažesnį
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek ${mazesnis.vardas} yra ${n} ${didesnis.vardas}?`,
        atsakymas: String(n * kartai),
        atsakymasRodymui: `$${sk4(n * kartai)}$ ${mazesnis.vardas}`,
        sprendimas: `$1$ ${didesnis.vardas} $= ${sk4(kartai)}$ ${mazesnis.vardas}, tad $${n} \\cdot ${sk4(kartai)} = ${sk4(n * kartai)}$.`,
      }),

    // 2. Iš mažesnio į didesnį
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek ${didesnis.vardas} yra $${sk4(n * kartai)}$ ${mazesnis.vardas}?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$ ${didesnis.vardas}`,
        sprendimas: `$${sk4(n * kartai)} : ${sk4(kartai)} = ${n}$.`,
      }),

    // 3. Kiek kartų skiriasi
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek kartų $1$ ${didesnis.vardas} didesnis už $1$ ${mazesnis.vardas}?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${sk4(kartai)}$`,
        sprendimas: `$1$ ${didesnis.vardas} $= ${sk4(kartai)}$ ${mazesnis.vardas}.`,
      }),

    // 4. Palyginimas
    () => {
      const kitas = atsitiktinis(2, 40)
      if (kitas * mazesnis.mm === n * didesnis.mm) return null
      const pirmas = n * didesnis.mm
      const antras = kitas * mazesnis.mm
      return uzdavinys(T4, {
        klausimas: `Kuris ilgis didesnis: ${n} ${didesnis.vardas} ar ${kitas} ${mazesnis.vardas}? Užrašyk jį su vienetu.`,
        atsakymas: pirmas > antras ? `${n}${didesnis.vardas}` : `${kitas}${mazesnis.vardas}`,
        atsakymasRodymui: pirmas > antras ? `$${n}$ ${didesnis.vardas}` : `$${kitas}$ ${mazesnis.vardas}`,
        sprendimas: `Suvedus į ${mazesnis.vardas}: $${sk4(pirmas / mazesnis.mm)}$ ir $${sk4(antras / mazesnis.mm)}$.`,
      })
    },

    // 5. Sudėtinis matas
    () => {
      const sveikas = atsitiktinis(1, 9)
      const likutis = atsitiktinis(1, kartai - 1)
      if (kartai > 1000) return null
      return uzdavinys(T4, {
        klausimas: `Kiek ${mazesnis.vardas} yra ${sveikas} ${didesnis.vardas} ${likutis} ${mazesnis.vardas}?`,
        atsakymas: String(sveikas * kartai + likutis),
        atsakymasRodymui: `$${sk4(sveikas * kartai + likutis)}$ ${mazesnis.vardas}`,
        sprendimas: `$${sveikas} \\cdot ${sk4(kartai)} + ${likutis} = ${sk4(sveikas * kartai + likutis)}$.`,
      })
    },

    // 6. Rikiavimas
    () => {
      const matai = sumaisyk([
        { t: '5 dm', mm: 500 },
        { t: '30 cm', mm: 300 },
        { t: '1 m', mm: 1000 },
        { t: '450 mm', mm: 450 },
      ])
      const eile = [...matai].sort((x, y) => x.mm - y.mm)
      return eiliskumoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Surikiuok ilgius didėjimo tvarka.',
        teisingaEile: eile.map((x) => x.t),
        sprendimas: 'Patogiausia visus paversti milimetrais.',
      })
    },

    // 7. Sudėtis su skirtingais vienetais
    () => {
      const kitas = atsitiktinis(2, 30)
      const suma = n * didesnis.mm + kitas * mazesnis.mm
      if (suma / mazesnis.mm > 1000000) return null
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok: ${n} ${didesnis.vardas} $+$ ${kitas} ${mazesnis.vardas}. Atsakymą užrašyk ${mazesnis.vardas}.`,
        atsakymas: String(suma / mazesnis.mm),
        atsakymasRodymui: `$${sk4(suma / mazesnis.mm)}$ ${mazesnis.vardas}`,
        sprendimas: `$${n}$ ${didesnis.vardas} $= ${sk4((n * didesnis.mm) / mazesnis.mm)}$ ${mazesnis.vardas}; $${sk4((n * didesnis.mm) / mazesnis.mm)} + ${kitas} = ${sk4(suma / mazesnis.mm)}$.`,
      })
    },

    // 8. Tinkamas vienetas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuriuo vienetu patogiausia matuoti atstumą tarp dviejų miestų?',
        variantai: ['km', 'mm', 'cm', 'dm'],
        teisingas: 0,
        sprendimas: 'Dideliems atstumams renkamasi didelis vienetas, kad skaičius nebūtų per didelis.',
      }),
  ])
}

// ── 9.2.2. Trikampio perimetras ─────────────────────────────────────────────

const T5 = 'trikampio-perimetras'

const A_TRIK_PERIMETRAS = [
  {
    klausimas: 'Trikampio kraštinės yra 5 cm, 7 cm ir 9 cm. Koks jo perimetras?',
    atsakymas: '21',
    atsakymasRodymui: '$21$ cm',
    sprendimas: '$5 + 7 + 9 = 21$.',
  },
] as const

export const trikampioPerimetras: Generatorius = () => suBandymais(kurkTrikPerimetra, A_TRIK_PERIMETRAS, T5)

function kurkTrikPerimetra(): Uzdavinys | null {
  const a = atsitiktinis(4, 15)
  const b = atsitiktinis(4, 15)
  const c = atsitiktinis(Math.abs(a - b) + 1, a + b - 1)
  if (c < 3 || c > 20) return null

  return variacija([
    // 1. Perimetras
    () =>
      uzdavinys(T5, {
        klausimas: `Trikampio kraštinės yra ${a} cm, ${b} cm ir ${c} cm. Koks jo perimetras?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$ cm`,
        sprendimas: `$${a} + ${b} + ${c} = ${a + b + c}$.`,
        brezinys: trikampisSuMatais(a, b, c),
      }),

    // 2. Iš brėžinio
    () =>
      uzdavinys(T5, {
        klausimas: 'Koks pavaizduoto trikampio perimetras? Atsakymą užrašyk centimetrais.',
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$ cm`,
        sprendimas: `Perimetras yra visų kraštinių suma: $${a} + ${b} + ${c} = ${a + b + c}$.`,
        brezinys: trikampisSuMatais(a, b, c),
      }),

    // 3. Trūkstama kraštinė
    () =>
      uzdavinys(T5, {
        klausimas: `Trikampio perimetras ${a + b + c} cm, dvi kraštinės — ${a} cm ir ${b} cm. Kokia trečioji kraštinė?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$ cm`,
        sprendimas: `$${a + b + c} - ${a} - ${b} = ${c}$.`,
      }),

    // 4. Lygiakraštis
    () => {
      const k = atsitiktinis(4, 20)
      return uzdavinys(T5, {
        klausimas: `Lygiakraščio trikampio kraštinė yra ${k} cm. Koks jo perimetras?`,
        atsakymas: String(3 * k),
        atsakymasRodymui: `$${3 * k}$ cm`,
        sprendimas: `$${k} \\cdot 3 = ${3 * k}$.`,
      })
    },

    // 5. Lygiakraščio kraštinė iš perimetro
    () => {
      const k = atsitiktinis(4, 20)
      return uzdavinys(T5, {
        klausimas: `Lygiakraščio trikampio perimetras ${3 * k} cm. Kokia jo kraštinė?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$ cm`,
        sprendimas: `$${3 * k} : 3 = ${k}$.`,
      })
    },

    // 6. Lygiašonis
    () => {
      const šonas = atsitiktinis(6, 15)
      const pagrindas = atsitiktinis(3, 2 * šonas - 1)
      return uzdavinys(T5, {
        klausimas: `Lygiašonio trikampio šoninė kraštinė ${šonas} cm, pagrindas ${pagrindas} cm. Koks jo perimetras?`,
        atsakymas: String(2 * šonas + pagrindas),
        atsakymasRodymui: `$${2 * šonas + pagrindas}$ cm`,
        sprendimas: `Šoninės kraštinės lygios: $${šonas} \\cdot 2 + ${pagrindas} = ${2 * šonas + pagrindas}$.`,
      })
    },

    // 7. Ar toks trikampis egzistuoja
    () => {
      const x = atsitiktinis(2, 5)
      const y = atsitiktinis(2, 5)
      const z = x + y + atsitiktinis(1, 4)
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Ar galimas trikampis, kurio kraštinės ${x} cm, ${y} cm ir ${z} cm?`,
        variantai: [
          `ne, nes $${x} + ${y} = ${x + y}$ yra mažiau nei ${z}`,
          'taip',
          'taip, jei jis bukasis',
        ],
        teisingas: 0,
        sprendimas: 'Bet kurių dviejų kraštinių suma turi būti didesnė už trečiąją.',
      })
    },

    // 8. Skirtingi vienetai
    () =>
      uzdavinys(T5, {
        klausimas: `Trikampio kraštinės yra ${a} cm, ${b} cm ir ${c * 10} mm. Koks jo perimetras centimetrais?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$ cm`,
        sprendimas: `$${c * 10}$ mm $= ${c}$ cm, tad $${a} + ${b} + ${c} = ${a + b + c}$.`,
      }),
  ])
}

// ── 9.2.3. Keturkampio perimetras ───────────────────────────────────────────

const T6 = 'keturkampio-perimetras'

const A_KETUR_PERIMETRAS = [
  {
    klausimas: 'Stačiakampio kraštinės yra 6 cm ir 4 cm. Koks jo perimetras?',
    atsakymas: '20',
    atsakymasRodymui: '$20$ cm',
    sprendimas: '$2 \\cdot (6 + 4) = 20$.',
  },
] as const

export const keturkampioPerimetras: Generatorius = () => suBandymais(kurkKeturPerimetra, A_KETUR_PERIMETRAS, T6)

function kurkKeturPerimetra(): Uzdavinys | null {
  const a = atsitiktinis(3, 18)
  const b = atsitiktinis(3, 18)
  if (a === b) return null

  return variacija([
    // 1. Stačiakampio perimetras
    () =>
      uzdavinys(T6, {
        klausimas: `Stačiakampio kraštinės yra ${a} cm ir ${b} cm. Koks jo perimetras?`,
        atsakymas: String(2 * (a + b)),
        atsakymasRodymui: `$${2 * (a + b)}$ cm`,
        sprendimas: `$2 \\cdot (${a} + ${b}) = ${2 * (a + b)}$.`,
        brezinys: staciakampisSuMatais(a, b),
      }),

    // 2. Kvadrato perimetras
    () =>
      uzdavinys(T6, {
        klausimas: `Kvadrato kraštinė yra ${a} cm. Koks jo perimetras?`,
        atsakymas: String(4 * a),
        atsakymasRodymui: `$${4 * a}$ cm`,
        sprendimas: `$${a} \\cdot 4 = ${4 * a}$.`,
      }),

    // 3. Kvadrato kraštinė iš perimetro
    () =>
      uzdavinys(T6, {
        klausimas: `Kvadrato perimetras ${4 * a} cm. Kokia jo kraštinė?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ cm`,
        sprendimas: `$${4 * a} : 4 = ${a}$.`,
      }),

    // 4. Trūkstama stačiakampio kraštinė
    () =>
      uzdavinys(T6, {
        klausimas: `Stačiakampio perimetras ${2 * (a + b)} cm, viena kraštinė ${a} cm. Kokia kita kraštinė?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `$${2 * (a + b)} : 2 = ${a + b}$, tada $${a + b} - ${a} = ${b}$.`,
      }),

    // 5. Nelygiakraštis keturkampis
    () => {
      const c = atsitiktinis(3, 15)
      const d = atsitiktinis(3, 15)
      return uzdavinys(T6, {
        klausimas: `Keturkampio kraštinės yra ${a} cm, ${b} cm, ${c} cm ir ${d} cm. Koks jo perimetras?`,
        atsakymas: String(a + b + c + d),
        atsakymasRodymui: `$${a + b + c + d}$ cm`,
        sprendimas: `$${a} + ${b} + ${c} + ${d} = ${a + b + c + d}$.`,
        brezinys: figuraSuUzrasais(
          [
            { x: 0, y: 0 },
            { x: 14 * a, y: 0 },
            { x: 14 * a - 10, y: 12 * b },
            { x: 12, y: 11 * b },
          ],
          [`${a} cm`, `${b} cm`, `${c} cm`, `${d} cm`],
        ),
      })
    },

    // 6. Kaip keičiasi perimetras
    () =>
      uzdavinys(T6, {
        klausimas: `Kvadrato kraštinė ${a} cm padidinama 2 cm. Keliais centimetrais padidėja perimetras?`,
        atsakymas: '8',
        atsakymasRodymui: `$8$ cm`,
        sprendimas: 'Kiekviena iš keturių kraštinių pailgėja 2 cm: $2 \\cdot 4 = 8$.',
      }),

    // 7. Iš dviejų kvadratų
    () =>
      uzdavinys(T6, {
        klausimas: `Du ${a} cm kraštinės kvadratai sudedami greta ir sudaro stačiakampį. Koks to stačiakampio perimetras?`,
        atsakymas: String(6 * a),
        atsakymasRodymui: `$${6 * a}$ cm`,
        sprendimas: `Stačiakampio kraštinės ${2 * a} cm ir ${a} cm: $2 \\cdot (${2 * a} + ${a}) = ${6 * a}$.`,
      }),

    // 8. Praktinis
    () => {
      const kaina = atsitiktinis(2, 8)
      return uzdavinys(T6, {
        klausimas: `Stačiakampį ${a} m ir ${b} m sklypą reikia aptverti tvora. Vienas tvoros metras kainuoja ${kaina} Eur. Kiek kainuos visa tvora?`,
        atsakymas: String(2 * (a + b) * kaina),
        atsakymasRodymui: `$${2 * (a + b) * kaina}$ Eur`,
        sprendimas: `Perimetras $2 \\cdot (${a} + ${b}) = ${2 * (a + b)}$ m; $${2 * (a + b)} \\cdot ${kaina} = ${2 * (a + b) * kaina}$.`,
      })
    },
  ])
}

// ── 9.3.1. Ploto matavimo vienetai ──────────────────────────────────────────

const T7 = 'ploto-vienetai-5'

const A_PLOTO = [
  {
    klausimas: 'Kiek cm² yra 3 dm²?',
    atsakymas: '300',
    atsakymasRodymui: '$300$ cm²',
    sprendimas: '$1$ dm² $= 100$ cm².',
  },
] as const

export const plotoVienetai5: Generatorius = () => suBandymais(kurkPloto, A_PLOTO, T7)

function kurkPloto(): Uzdavinys | null {
  const i = atsitiktinis(0, PLOTO.length - 2)
  const didesnis = PLOTO[i + 1]
  const mazesnis = PLOTO[i]
  const n = atsitiktinis(2, 40)

  return variacija([
    // 1. Iš didesnio į mažesnį
    () =>
      uzdavinys(T7, {
        klausimas: `Kiek ${mazesnis.vardas} yra ${n} ${didesnis.vardas}?`,
        atsakymas: String(n * 100),
        atsakymasRodymui: `$${sk4(n * 100)}$ ${mazesnis.vardas}`,
        sprendimas: `$1$ ${didesnis.vardas} $= 100$ ${mazesnis.vardas}, tad $${n} \\cdot 100 = ${sk4(n * 100)}$.`,
      }),

    // 2. Iš mažesnio į didesnį
    () =>
      uzdavinys(T7, {
        klausimas: `Kiek ${didesnis.vardas} yra $${sk4(n * 100)}$ ${mazesnis.vardas}?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$ ${didesnis.vardas}`,
        sprendimas: `$${sk4(n * 100)} : 100 = ${n}$.`,
      }),

    // 3. Kodėl 100, o ne 10
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kodėl gretimi ploto vienetai skiriasi 100, o ne 10 kartų?',
        variantai: [
          'nes kvadrato abi kraštinės padidėja 10 kartų, o plotas — $10 \\cdot 10$ kartų',
          'nes taip sutarta',
          'nes plotas visada didesnis už ilgį',
          'nes plotas matuojamas kvadratais',
        ],
        teisingas: 0,
        sprendimas: '$1$ dm² kvadratas yra $10 \\times 10 = 100$ cm² kvadratėlių.',
      }),

    // 4. Aras ir hektaras
    () => {
      const arai = atsitiktinis(2, 50)
      return uzdavinys(T7, {
        klausimas: `Kiek kvadratinių metrų yra ${arai} arai?`,
        atsakymas: String(arai * 100),
        atsakymasRodymui: `$${sk4(arai * 100)}$ m²`,
        sprendimas: `$1$ aras $= 100$ m², tad $${arai} \\cdot 100 = ${sk4(arai * 100)}$.`,
      })
    },

    // 5. Hektaras
    () => {
      const ha = atsitiktinis(2, 12)
      return uzdavinys(T7, {
        klausimas: `Kiek arų yra ${ha} hektarai?`,
        atsakymas: String(ha * 100),
        atsakymasRodymui: `$${sk4(ha * 100)}$ arai`,
        sprendimas: `$1$ ha $= 100$ arų, tad $${ha} \\cdot 100 = ${sk4(ha * 100)}$.`,
      })
    },

    // 6. Palyginimas
    () => {
      const kitas = atsitiktinis(50, 900)
      const pirmas = n * 100
      if (pirmas === kitas) return null
      return uzdavinys(T7, {
        klausimas: `Kuris plotas didesnis: ${n} ${didesnis.vardas} ar ${kitas} ${mazesnis.vardas}? Užrašyk jį ${mazesnis.vardas}.`,
        atsakymas: String(Math.max(pirmas, kitas)),
        atsakymasRodymui: `$${sk4(Math.max(pirmas, kitas))}$ ${mazesnis.vardas}`,
        sprendimas: `$${n}$ ${didesnis.vardas} $= ${sk4(pirmas)}$ ${mazesnis.vardas}.`,
      })
    },

    // 7. Tinkamas vienetas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kuriuo vienetu patogiausia matuoti miško plotą?',
        variantai: ['ha', 'cm²', 'mm²', 'dm²'],
        teisingas: 0,
        sprendimas: 'Dideliems plotams renkamasi didelis vienetas.',
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Mokinys teigia, kad ${n} ${didesnis.vardas} yra ${n * 10} ${mazesnis.vardas}. Kiek jų yra iš tikrųjų?`,
        atsakymas: String(n * 100),
        atsakymasRodymui: `$${sk4(n * 100)}$ ${mazesnis.vardas}`,
        sprendimas: 'Ploto vienetai skiriasi 100, o ne 10 kartų.',
      }),
  ])
}

// ── 9.3.2. Stačiakampio ir kvadrato plotai ──────────────────────────────────

const T8 = 'staciakampio-plotas-5'

const A_STAC_PLOTAS = [
  {
    klausimas: 'Stačiakampio kraštinės yra 6 cm ir 4 cm. Koks jo plotas?',
    atsakymas: '24',
    atsakymasRodymui: '$24$ cm²',
    sprendimas: '$6 \\cdot 4 = 24$.',
  },
] as const

export const staciakampioPlotas5: Generatorius = () => suBandymais(kurkStacPlota, A_STAC_PLOTAS, T8)

function kurkStacPlota(): Uzdavinys | null {
  const a = atsitiktinis(3, 20)
  const b = atsitiktinis(3, 20)

  return variacija([
    // 1. Stačiakampio plotas
    () =>
      uzdavinys(T8, {
        klausimas: `Stačiakampio kraštinės yra ${a} cm ir ${b} cm. Koks jo plotas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
        brezinys: staciakampisSuMatais(a, b),
      }),

    // 2. Kvadrato plotas
    () =>
      uzdavinys(T8, {
        klausimas: `Kvadrato kraštinė yra ${a} cm. Koks jo plotas?`,
        atsakymas: String(a * a),
        atsakymasRodymui: `$${a * a}$ cm²`,
        sprendimas: `$${a} \\cdot ${a} = ${a * a}$.`,
      }),

    // 3. Trūkstama kraštinė
    () =>
      uzdavinys(T8, {
        klausimas: `Stačiakampio plotas ${a * b} cm², viena kraštinė ${a} cm. Kokia kita kraštinė?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `$${a * b} : ${a} = ${b}$.`,
      }),

    // 4. Plotas ir perimetras
    () => {
      if (a === b) return null
      return uzdavinys(T8, {
        klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Kiek skiriasi jo ploto ir perimetro skaitinės reikšmės? Užrašyk didesnę iš jų.`,
        atsakymas: String(Math.max(a * b, 2 * (a + b))),
        atsakymasRodymui: `$${Math.max(a * b, 2 * (a + b))}$`,
        sprendimas: `Plotas $${a * b}$ cm², perimetras $${2 * (a + b)}$ cm.`,
      })
    },

    // 5. Sudėtinė figūra
    () => {
      const c = atsitiktinis(2, 8)
      const d = atsitiktinis(2, 8)
      return uzdavinys(T8, {
        klausimas: `Figūra sudaryta iš dviejų stačiakampių: ${a} cm $\\times$ ${b} cm ir ${c} cm $\\times$ ${d} cm. Koks jos plotas?`,
        atsakymas: String(a * b + c * d),
        atsakymasRodymui: `$${a * b + c * d}$ cm²`,
        sprendimas: `$${a} \\cdot ${b} + ${c} \\cdot ${d} = ${a * b} + ${c * d} = ${a * b + c * d}$.`,
      })
    },

    // 6. Kaip keičiasi plotas
    () =>
      uzdavinys(T8, {
        klausimas: `Kvadrato kraštinė ${a} cm padvigubinama. Kiek kartų padidėja jo plotas?`,
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: `Nauja kraštinė ${2 * a} cm, plotas $${4 * a * a}$ cm² vietoj $${a * a}$ cm² — keturis kartus daugiau.`,
      }),

    // 7. Skirtingi vienetai
    () =>
      uzdavinys(T8, {
        klausimas: `Stačiakampio kraštinės yra ${a} dm ir ${b * 10} cm. Koks jo plotas kvadratiniais decimetrais?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ dm²`,
        sprendimas: `$${b * 10}$ cm $= ${b}$ dm, tad $${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 8. Praktinis
    () => {
      const kaina = atsitiktinis(3, 15)
      return uzdavinys(T8, {
        klausimas: `Kambario grindys yra ${a} m ir ${b} m stačiakampis. Vieno kvadratinio metro dangos kaina ${kaina} Eur. Kiek kainuos visa danga?`,
        atsakymas: String(a * b * kaina),
        atsakymasRodymui: `$${sk4(a * b * kaina)}$ Eur`,
        sprendimas: `Plotas $${a} \\cdot ${b} = ${a * b}$ m²; $${a * b} \\cdot ${kaina} = ${sk4(a * b * kaina)}$.`,
      })
    },
  ])
}

// ── 9.3.3. Stačiojo trikampio plotas ────────────────────────────────────────

const T9 = 'staciojo-trikampio-plotas'

const A_TRIK_PLOTAS = [
  {
    klausimas: 'Stačiojo trikampio statiniai yra 6 cm ir 4 cm. Koks jo plotas?',
    atsakymas: '12',
    atsakymasRodymui: '$12$ cm²',
    sprendimas: '$6 \\cdot 4 : 2 = 12$.',
  },
] as const

export const staciojoTrikampioPlotas: Generatorius = () => suBandymais(kurkTrikPlota, A_TRIK_PLOTAS, T9)

function kurkTrikPlota(): Uzdavinys | null {
  const a = atsitiktinis(3, 20)
  const b = atsitiktinis(3, 20)
  if ((a * b) % 2 !== 0) return null

  return variacija([
    // 1. Plotas
    () =>
      uzdavinys(T9, {
        klausimas: `Stačiojo trikampio statiniai yra ${a} cm ir ${b} cm. Koks jo plotas?`,
        atsakymas: String((a * b) / 2),
        atsakymasRodymui: `$${(a * b) / 2}$ cm²`,
        sprendimas: `$${a} \\cdot ${b} : 2 = ${(a * b) / 2}$.`,
        brezinys: trikampisPagalKampus('statusis'),
      }),

    // 2. Kodėl dalijama iš dviejų
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kodėl stačiojo trikampio plotas skaičiuojamas statinių sandaugą dalijant iš 2?',
        variantai: [
          'nes du tokie trikampiai sudaro stačiakampį',
          'nes trikampis turi tris kraštines',
          'nes taip sutarta',
          'nes viena kraštinė visada dvigubai ilgesnė',
        ],
        teisingas: 0,
        sprendimas: 'Stačiakampį įstrižainė dalija į du lygius stačiuosius trikampius.',
      }),

    // 3. Trūkstamas statinis
    () =>
      uzdavinys(T9, {
        klausimas: `Stačiojo trikampio plotas ${(a * b) / 2} cm², vienas statinis ${a} cm. Koks kitas statinis?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `$${(a * b) / 2} \\cdot 2 = ${a * b}$, tada $${a * b} : ${a} = ${b}$.`,
      }),

    // 4. Iš stačiakampio
    () =>
      uzdavinys(T9, {
        klausimas: `Stačiakampis ${a} cm $\\times$ ${b} cm perkirptas per įstrižainę. Koks vienos gautos dalies plotas?`,
        atsakymas: String((a * b) / 2),
        atsakymasRodymui: `$${(a * b) / 2}$ cm²`,
        sprendimas: `Stačiakampio plotas $${a * b}$ cm², o dalys lygios: $${a * b} : 2 = ${(a * b) / 2}$.`,
        brezinys: staciakampisSuMatais(a, b),
      }),

    // 5. Lygiašonis statusis
    () => {
      const k = atsitiktinis(4, 16)
      if ((k * k) % 2 !== 0) return null
      return uzdavinys(T9, {
        klausimas: `Stačiojo trikampio abu statiniai lygūs ${k} cm. Koks jo plotas?`,
        atsakymas: String((k * k) / 2),
        atsakymasRodymui: `$${(k * k) / 2}$ cm²`,
        sprendimas: `$${k} \\cdot ${k} : 2 = ${(k * k) / 2}$.`,
      })
    },

    // 6. Kampai
    () =>
      uzdavinys(T9, {
        klausimas: 'Kiek laipsnių turi kampas tarp stačiojo trikampio statinių?',
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: 'Statiniai yra kraštinės, sudarančios statųjį kampą.',
        brezinys: kampasSuRaidemis(90, { virsune: 'C', kraštines: ['A', 'B'] }),
      }),

    // 7. Du trikampiai
    () =>
      uzdavinys(T9, {
        klausimas: `Iš dviejų vienodų stačiųjų trikampių, kurių statiniai ${a} cm ir ${b} cm, sudėliojamas stačiakampis. Koks jo plotas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `Vieno trikampio plotas $${(a * b) / 2}$ cm², dviejų — $${a * b}$ cm².`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Mokinys stačiojo trikampio su statiniais ${a} cm ir ${b} cm plotą apskaičiavo ${a * b} cm². Koks plotas iš tikrųjų?`,
        atsakymas: String((a * b) / 2),
        atsakymasRodymui: `$${(a * b) / 2}$ cm²`,
        sprendimas: 'Mokinys pamiršo padalyti iš 2 — taip apskaičiuotas stačiakampio, o ne trikampio plotas.',
      }),
  ])
}
