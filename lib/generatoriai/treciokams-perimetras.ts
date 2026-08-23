import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { liniuote } from './pirmoku-vaizdai'
import {
  laiptuotaFigura,
  staciakampisSuMatais,
  taisyklingasSuMatais,
  tinklelisSuStaciakampiu,
  trikampisSuMatais,
} from './treciokams-matai-vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 3 klasės tema „Daugiakampio perimetras“ — devynios potemės.
 *
 * Anksčiau jos rėmėsi `matavimo-vienetai`, `figuros` ir `perimetras`
 * generatoriais, skirtais vyresnėms klasėms: pasitaikydavo kvadratinių metrų,
 * daugiakampio įstrižainių ir plotų, kurių trečioje klasėje dar nėra.
 *
 * Potemės čia skiriasi ne skaičiais, o klausimo kryptimi: viena moko iš
 * kraštinių rasti perimetrą, kita — atvirkščiai, iš perimetro rasti kraštinę.
 * Todėl kiekviena turi savo generatorių, o figūros braižomos tiksliai:
 * užrašytas 6 cm brėžinyje ir yra dvigubai ilgesnis už 3 cm.
 */

const KRASTINIU = { vns: 'kraštinė', dgs: 'kraštinės', kilm: 'kraštinių' }

function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 1000, 1000)
}

const TAISYKLINGI = [
  { n: 3, vardas: 'lygiakraštis trikampis', kilm: 'lygiakraščio trikampio' },
  { n: 4, vardas: 'kvadratas', kilm: 'kvadrato' },
  { n: 5, vardas: 'taisyklingasis penkiakampis', kilm: 'taisyklingojo penkiakampio' },
  { n: 6, vardas: 'taisyklingasis šešiakampis', kilm: 'taisyklingojo šešiakampio' },
  { n: 8, vardas: 'taisyklingasis aštuonkampis', kilm: 'taisyklingojo aštuonkampio' },
] as const

// ── 4.1 Kas yra decimetras? ─────────────────────────────────────────────────

const A_DECIMETRAS = [
  {
    klausimas: 'Kiek centimetrų sudaro 1 dm?',
    atsakymas: '10',
    atsakymasRodymui: '$10$ cm',
    sprendimas: 'Viename decimetre yra 10 centimetrų.',
  },
] as const

export const decimetras: Generatorius = () => suBandymais(kurkDecimetra, A_DECIMETRAS, 'decimetras')

function kurkDecimetra(): Uzdavinys | null {
  const dm = atsitiktinis(2, 9)

  return variacija([
    // 1. Iš decimetrų į centimetrus
    () =>
      uzdavinys('decimetras', {
        klausimas: `Paversk: ${dm} dm = $\\square$ cm.`,
        atsakymas: String(dm * 10),
        atsakymasRodymui: `$${dm * 10}$ cm`,
        sprendimas: `Viename decimetre 10 cm, tad $${dm} \\cdot 10 = ${dm * 10}$.`,
      }),

    // 2. Iš centimetrų į decimetrus
    () =>
      uzdavinys('decimetras', {
        klausimas: `Paversk: ${dm * 10} cm = $\\square$ dm.`,
        atsakymas: String(dm),
        atsakymasRodymui: `$${dm}$ dm`,
        sprendimas: `$${dm * 10} : 10 = ${dm}$.`,
      }),

    // 3. Kuris ilgesnis
    () => {
      const cm = dm * 10 + pasirink([-7, -5, -3, 3, 5, 7])
      const dmIlgesnis = dm * 10 > cm
      return pasirinkimoUzdavinys(naujasId('decimetras'), 'decimetras', {
        klausimas: `Kuris ilgesnis: ${dm} dm ar ${cm} cm?`,
        variantai: dmIlgesnis
          ? [`${dm} dm`, `${cm} cm`, 'ilgiai vienodi']
          : [`${cm} cm`, `${dm} dm`, 'ilgiai vienodi'],
        teisingas: 0,
        sprendimas: `${dm} dm yra ${dm * 10} cm, tad lyginami ${dm * 10} cm ir ${cm} cm.`,
      })
    },

    // 4. Sudėtinis ilgis
    () => {
      const likutis = atsitiktinis(1, 9)
      const kitas = dm * 10 + likutis + pasirink([-6, -4, 4, 6])
      return pasirinkimoUzdavinys(naujasId('decimetras'), 'decimetras', {
        klausimas: `Paversk ir palygink: ${dm} dm ${likutis} cm ir ${kitas} cm.`,
        variantai:
          dm * 10 + likutis > kitas
            ? [`${dm} dm ${likutis} cm ilgesnis`, `${kitas} cm ilgesnis`, 'ilgiai vienodi']
            : [`${kitas} cm ilgesnis`, `${dm} dm ${likutis} cm ilgesnis`, 'ilgiai vienodi'],
        teisingas: 0,
        sprendimas: `${dm} dm ${likutis} cm yra ${dm * 10 + likutis} cm.`,
      })
    },

    // 5. Nukirpta nuo metro
    () => {
      const nukirpo = atsitiktinis(2, 7)
      return uzdavinys('decimetras', {
        klausimas: `Iš 1 metro juostos nukirpo ${nukirpo} dm. Kiek centimetrų liko?`,
        atsakymas: String(100 - nukirpo * 10),
        atsakymasRodymui: `$${100 - nukirpo * 10}$ cm`,
        sprendimas: `${nukirpo} dm yra ${nukirpo * 10} cm, tad liko $100 - ${nukirpo * 10} = ${
          100 - nukirpo * 10
        }$.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('decimetras'), 'decimetras', {
        klausimas: 'Mokinys sako, kad 1 dm = 100 cm. Kur klaida?',
        variantai: [
          '1 dm yra 10 cm, o 100 cm sudaro metrą',
          '1 dm iš tikrųjų yra 1000 cm',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Šimtas centimetrų yra metras, o decimetre jų dešimt.',
      }),

    // 7. Kiek ilgesnis daiktas
    () => {
      const lentele = atsitiktinis(5, 9)
      const pries = atsitiktinis(15, 40)
      if (lentele * 10 <= pries) return null
      return uzdavinys('decimetras', {
        klausimas: `Lentelė yra ${lentele} dm ilgio, o pieštukas — ${pries} cm. Kiek centimetrų ilgesnė lentelė?`,
        atsakymas: String(lentele * 10 - pries),
        atsakymasRodymui: `$${lentele * 10 - pries}$ cm`,
        sprendimas: `${lentele} dm yra ${lentele * 10} cm, tad $${lentele * 10} - ${pries} = ${
          lentele * 10 - pries
        }$.`,
      })
    },

    // 8. Iš liniuotės
    () => {
      const cm = atsitiktinis(3, 9)
      return uzdavinys('decimetras', {
        klausimas: 'Kokio ilgio centimetrais yra ant liniuotės pažymėta atkarpa?',
        atsakymas: String(cm),
        atsakymasRodymui: `$${cm}$ cm`,
        sprendimas: `Atkarpa eina nuo 0 iki ${cm}, tad jos ilgis ${cm} cm — tai mažiau nei visas decimetras.`,
        brezinys: liniuote(10, { nuo: 0, iki: cm }),
      })
    },
  ])
}

// ── 4.2 Ilgio vienetų smulkinimas ir stambinimas ────────────────────────────

const A_ILGIO_VIENETAI = [
  {
    klausimas: 'Paversk: 3 m = $\\square$ cm.',
    atsakymas: '300',
    atsakymasRodymui: '$300$ cm',
    sprendimas: 'Metre yra 100 cm, tad $3 \\cdot 100 = 300$.',
  },
] as const

export const ilgioVienetai3: Generatorius = () =>
  suBandymais(kurkIlgioVienetus, A_ILGIO_VIENETAI, 'ilgio-vienetai-3')

function kurkIlgioVienetus(): Uzdavinys | null {
  const m = atsitiktinis(2, 8)
  const dm = atsitiktinis(1, 9)
  const cm = atsitiktinis(1, 9)

  return variacija([
    // 1. Metrai į centimetrus
    () =>
      uzdavinys('ilgio-vienetai-3', {
        klausimas: `Paversk: ${m} m = $\\square$ cm.`,
        atsakymas: String(m * 100),
        atsakymasRodymui: `$${m * 100}$ cm`,
        sprendimas: `Metre 100 cm: $${m} \\cdot 100 = ${m * 100}$.`,
      }),

    // 2. Centimetrai į metrus
    () =>
      uzdavinys('ilgio-vienetai-3', {
        klausimas: `Paversk: ${m * 100} cm = $\\square$ m.`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$ m`,
        sprendimas: `$${m * 100} : 100 = ${m}$.`,
      }),

    // 3. Sudėtinis matmuo į centimetrus
    () =>
      uzdavinys('ilgio-vienetai-3', {
        klausimas: `Užrašyk kitaip: ${m} m ${dm} dm = $\\square$ cm.`,
        atsakymas: String(m * 100 + dm * 10),
        atsakymasRodymui: `$${m * 100 + dm * 10}$ cm`,
        sprendimas: `$${m} \\cdot 100 + ${dm} \\cdot 10 = ${m * 100 + dm * 10}$.`,
      }),

    // 4. Centimetrai į m, dm ir cm
    () => {
      const viso = m * 100 + dm * 10 + cm
      return uzdavinys('ilgio-vienetai-3', {
        klausimas: `Kiek pilnų metrų yra ${viso} cm?`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$ m`,
        sprendimas: `${viso} cm yra ${m} m ${dm} dm ${cm} cm, tad pilnų metrų ${m}.`,
      })
    },

    // 5. Palyginimas
    () => {
      const kitas = m * 100 + dm * 10 + pasirink([-8, -5, 5, 8])
      const pirmas = m * 100 + dm * 10
      if (pirmas === kitas) return null
      return pasirinkimoUzdavinys(naujasId('ilgio-vienetai-3'), 'ilgio-vienetai-3', {
        klausimas: `Palygink: ${m} m ${dm} dm ir ${kitas} cm.`,
        variantai:
          pirmas > kitas
            ? [`${m} m ${dm} dm ilgesnis`, `${kitas} cm ilgesnis`, 'ilgiai vienodi']
            : [`${kitas} cm ilgesnis`, `${m} m ${dm} dm ilgesnis`, 'ilgiai vienodi'],
        teisingas: 0,
        sprendimas: `${m} m ${dm} dm yra ${pirmas} cm.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('ilgio-vienetai-3'), 'ilgio-vienetai-3', {
        klausimas: `Mokinys ${dm} dm pavertė į ${dm} m. Kur klaida?`,
        variantai: [
          `decimetras mažesnis už metrą — turi būti ${dm * 10} cm`,
          'decimetras ir metras yra tas pats',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `${dm} dm yra ${dm * 10} cm, o ${dm} m — ${dm * 100} cm.`,
      }),

    // 7. Nukirpta juosta
    () => {
      const juosta = atsitiktinis(4, 9)
      const nukirpo = atsitiktinis(1, juosta - 1) * 100 + atsitiktinis(1, 4) * 10
      const liko = juosta * 100 - nukirpo
      if (liko % 10 !== 0) return null
      return uzdavinys('ilgio-vienetai-3', {
        klausimas: `Iš ${juosta} m juostos nukirpo ${nukirpo} cm. Kiek decimetrų liko?`,
        atsakymas: String(liko / 10),
        atsakymasRodymui: `$${liko / 10}$ dm`,
        sprendimas: `$${juosta * 100} - ${nukirpo} = ${liko}$ cm, o tai $${liko} : 10 = ${
          liko / 10
        }$ dm.`,
      })
    },

    // 8. Rikiavimas
    () => {
      const ilgiai = [
        { rodomas: `${m} m`, cm: m * 100 },
        { rodomas: `${m * 100 + 40} cm`, cm: m * 100 + 40 },
        { rodomas: `${m * 10 - 3} dm`, cm: (m * 10 - 3) * 10 },
      ]
      if (new Set(ilgiai.map((x) => x.cm)).size < 3) return null
      return eiliskumoUzdavinys(naujasId('ilgio-vienetai-3'), 'ilgio-vienetai-3', {
        klausimas: 'Surikiuok ilgius nuo trumpiausio iki ilgiausio.',
        teisingaEile: [...ilgiai].sort((a, b) => a.cm - b.cm).map((x) => x.rodomas),
        sprendimas: 'Pirmiausia visi ilgiai paverčiami centimetrais.',
      })
    },
  ])
}

// ── 4.3 Kas yra daugiakampio perimetras? ────────────────────────────────────

const A_PERIMETRO_SAVOKA = [
  {
    klausimas: 'Trikampio kraštinės yra 4 cm, 5 cm ir 6 cm. Koks jo perimetras?',
    atsakymas: '15',
    atsakymasRodymui: '$15$ cm',
    sprendimas: '$4 + 5 + 6 = 15$.',
  },
] as const

export const perimetroSavoka: Generatorius = () =>
  suBandymais(kurkPerimetroSavoka, A_PERIMETRO_SAVOKA, 'perimetro-savoka')

function kurkPerimetroSavoka(): Uzdavinys | null {
  return variacija([
    // 1. Trikampio perimetras iš brėžinio
    () => {
      const a = atsitiktinis(4, 8)
      const b = atsitiktinis(4, 8)
      const c = atsitiktinis(Math.abs(a - b) + 2, a + b - 2)
      if (c < 3 || c > 9) return null
      return uzdavinys('perimetro-savoka', {
        // Kraštinių ilgiai užrašyti tik brėžinyje — juos reikia nuskaityti.
        klausimas: 'Rask brėžinyje pavaizduoto trikampio perimetrą.',
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$ cm`,
        sprendimas: `Perimetras — visų kraštinių ilgių suma: $${a} + ${b} + ${c} = ${a + b + c}$.`,
        brezinys: trikampisSuMatais(a, b, c),
      })
    },

    // 2. Keturkampio perimetras iš brėžinio
    () => {
      const a = atsitiktinis(3, 8)
      const b = atsitiktinis(2, 7)
      if (a === b) return null
      return uzdavinys('perimetro-savoka', {
        klausimas: 'Rask brėžinyje pavaizduoto keturkampio perimetrą.',
        atsakymas: String(2 * (a + b)),
        atsakymasRodymui: `$${2 * (a + b)}$ cm`,
        sprendimas: `Priešingos kraštinės lygios: $${a} + ${b} + ${a} + ${b} = ${2 * (a + b)}$.`,
        brezinys: staciakampisSuMatais(a, b, 'visos'),
      })
    },

    // 3. Ką reiškia perimetras
    () =>
      pasirinkimoUzdavinys(naujasId('perimetro-savoka'), 'perimetro-savoka', {
        klausimas: 'Kas yra daugiakampio perimetras?',
        variantai: [
          'visų kraštinių ilgių suma',
          'visų kampų suma',
          'ilgiausios kraštinės ilgis',
        ],
        teisingas: 0,
        sprendimas: 'Perimetras yra kelias aplink figūrą — visų jos kraštinių ilgių suma.',
      }),

    // 4. Laiptuotos figūros perimetras
    () => {
      const a = atsitiktinis(3, 6)
      // Įdubos kraštinės — bent 3 cm: prie trumpesnių jų ilgių užrašai
      // brėžinyje atsiduria vienas ant kito.
      const b = atsitiktinis(3, 5)
      const c = atsitiktinis(3, 5)
      const d = atsitiktinis(3, 5)
      return uzdavinys('perimetro-savoka', {
        klausimas: 'Rask brėžinyje pavaizduotos figūros perimetrą.',
        atsakymas: String(2 * (a + c) + 2 * (b + d)),
        atsakymasRodymui: `$${2 * (a + c) + 2 * (b + d)}$ cm`,
        sprendimas: `Sudedami visų šešių kraštinių ilgiai: $${a} + ${b} + ${c} + ${d} + ${
          a + c
        } + ${b + d} = ${2 * (a + c) + 2 * (b + d)}$.`,
        brezinys: laiptuotaFigura(a, b, c, d),
      })
    },

    // 5. Kurie duomenys reikalingi
    () =>
      pasirinkimoUzdavinys(naujasId('perimetro-savoka'), 'perimetro-savoka', {
        klausimas: 'Kurių duomenų reikia daugiakampio perimetrui apskaičiuoti?',
        variantai: ['kraštinių ilgių', 'figūros spalvos', 'kampų dydžių'],
        teisingas: 0,
        sprendimas: 'Perimetras skaičiuojamas iš kraštinių ilgių; spalva ir kampai jo nekeičia.',
      }),

    // 6. Klaidingas apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId('perimetro-savoka'), 'perimetro-savoka', {
        klausimas: 'Mokinys sako, kad daugiakampio perimetras yra visų jo kampų suma. Kur klaida?',
        variantai: [
          'perimetras skaičiuojamas iš kraštinių, o ne iš kampų',
          'kampų suma visada lygi perimetrui',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Perimetras matuojamas ilgio vienetais, tad jį sudaro kraštinių ilgiai.',
      }),

    // 7. Kuri figūra turi didesnį perimetrą
    () => {
      const a = atsitiktinis(3, 6)
      const b = atsitiktinis(4, 7)
      const c = atsitiktinis(Math.abs(a - b) + 2, a + b - 2)
      const krastine = atsitiktinis(3, 6)
      const trikampio = a + b + c
      const kvadrato = 4 * krastine
      if (trikampio === kvadrato || c < 3 || c > 9) return null
      return pasirinkimoUzdavinys(naujasId('perimetro-savoka'), 'perimetro-savoka', {
        klausimas: `Kuris turi didesnį perimetrą: trikampis su kraštinėmis ${a} cm, ${b} cm ir ${c} cm ar kvadratas, kurio kraštinė ${krastine} cm?`,
        variantai:
          trikampio > kvadrato
            ? ['trikampis', 'kvadratas', 'perimetrai vienodi']
            : ['kvadratas', 'trikampis', 'perimetrai vienodi'],
        teisingas: 0,
        sprendimas: `Trikampio perimetras ${trikampio} cm, kvadrato — $4 \\cdot ${krastine} = ${kvadrato}$ cm.`,
      })
    },
  ])
}

// ── 4.4 Taisyklingojo daugiakampio perimetras ───────────────────────────────

const A_TAISYKLINGO_P = [
  {
    klausimas: 'Rask kvadrato, kurio kraštinė 5 cm, perimetrą.',
    atsakymas: '20',
    atsakymasRodymui: '$20$ cm',
    sprendimas: '$4 \\cdot 5 = 20$.',
  },
] as const

export const taisyklingoPerimetras: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTaisyklingoP(sritis), A_TAISYKLINGO_P, 'taisyklingo-perimetras')

function kurkTaisyklingoP(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const figura = pasirink(TAISYKLINGI)
  const krastine = atsitiktinis(2, 9)
  const perimetras = figura.n * krastine
  if (perimetras > maks) return null

  return variacija([
    // 1. Perimetras iš kraštinės
    () =>
      uzdavinys('taisyklingo-perimetras', {
        klausimas: `Rask ${figura.kilm}, kurio kraštinė ${krastine} cm, perimetrą.`,
        atsakymas: String(perimetras),
        atsakymasRodymui: `$${perimetras}$ cm`,
        sprendimas: `Visos ${figura.n} kraštinės lygios: $${figura.n} \\cdot ${krastine} = ${perimetras}$.`,
      }),

    // 2. Perimetras iš brėžinio
    () => {
      if (figura.n === 8) return null
      return uzdavinys('taisyklingo-perimetras', {
        // Kraštinių skaičių reikia suskaičiuoti brėžinyje, o ilgį — nuskaityti.
        klausimas: 'Rask brėžinyje pavaizduoto taisyklingojo daugiakampio perimetrą.',
        atsakymas: String(perimetras),
        atsakymasRodymui: `$${perimetras}$ cm`,
        sprendimas: `Kraštinių ${figura.n}, kiekviena ${krastine} cm: $${figura.n} \\cdot ${krastine} = ${perimetras}$.`,
        brezinys: taisyklingasSuMatais(figura.n, krastine),
      })
    },

    // 3. Koks veiksmas patogesnis
    () =>
      pasirinkimoUzdavinys(naujasId('taisyklingo-perimetras'), 'taisyklingo-perimetras', {
        klausimas: 'Kokį veiksmą patogiausia atlikti, kai visos daugiakampio kraštinės lygios?',
        variantai: [
          'kraštinę padauginti iš kraštinių skaičiaus',
          'kraštinę padalyti iš kraštinių skaičiaus',
          'prie kraštinės pridėti kraštinių skaičių',
        ],
        teisingas: 0,
        sprendimas: 'Vienodų dėmenų suma trumpiau užrašoma daugyba.',
      }),

    // 4. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('taisyklingo-perimetras'), 'taisyklingo-perimetras', {
        klausimas: `Mokinys kvadrato, kurio kraštinė ${krastine} cm, perimetrą apskaičiavo $${krastine} + 4$. Kur klaida?`,
        variantai: [
          'kraštinę reikia dauginti iš 4, o ne pridėti 4',
          'reikia buvo pridėti 2, o ne 4',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Kvadratas turi keturias ${krastine} cm kraštines: $4 \\cdot ${krastine} = ${
          4 * krastine
        }$.`,
      }),

    // 5. Dviejų figūrų palyginimas
    () => {
      const kita = pasirink(TAISYKLINGI)
      const kitaKrastine = atsitiktinis(2, 9)
      if (kita.n === figura.n) return null
      const kitasP = kita.n * kitaKrastine
      if (kitasP === perimetras || kitasP > maks) return null
      return pasirinkimoUzdavinys(naujasId('taisyklingo-perimetras'), 'taisyklingo-perimetras', {
        klausimas: `Kurio perimetras didesnis: ${figura.kilm} su ${krastine} cm kraštine ar ${kita.kilm} su ${kitaKrastine} cm kraštine?`,
        variantai:
          perimetras > kitasP
            ? [figura.vardas, kita.vardas, 'perimetrai vienodi']
            : [kita.vardas, figura.vardas, 'perimetrai vienodi'],
        teisingas: 0,
        sprendimas: `Perimetrai yra ${perimetras} cm ir ${kitasP} cm.`,
      })
    },

    // 6. Kiek kraštinių turi figūra
    () =>
      uzdavinys('taisyklingo-perimetras', {
        klausimas: `Kiek kraštinių turi ${figura.vardas}?`,
        atsakymas: String(figura.n),
        atsakymasRodymui: `$${figura.n}$`,
        sprendimas: `${figura.vardas} turi ${figura.n} lygias ${derink(figura.n, KRASTINIU)}.`,
      }),

    // 7. Perimetras dvigubinant kraštinę
    () => {
      if (2 * perimetras > maks) return null
      return uzdavinys('taisyklingo-perimetras', {
        klausimas: `${figura.vardas.charAt(0).toUpperCase()}${figura.vardas.slice(
          1,
        )} turi ${krastine} cm kraštinę. Koks būtų perimetras, jei kiekviena kraštinė pailgėtų dvigubai?`,
        atsakymas: String(2 * perimetras),
        atsakymasRodymui: `$${2 * perimetras}$ cm`,
        sprendimas: `Nauja kraštinė $${krastine} \\cdot 2 = ${
          2 * krastine
        }$ cm, tad perimetras $${figura.n} \\cdot ${2 * krastine} = ${2 * perimetras}$.`,
      })
    },
  ])
}

// ── 4.5 Stačiakampio perimetras skirtingais būdais ──────────────────────────

const A_STACIAKAMPIO_P = [
  {
    klausimas: 'Stačiakampio kraštinės 6 cm ir 3 cm. Koks jo perimetras?',
    atsakymas: '18',
    atsakymasRodymui: '$18$ cm',
    sprendimas: '$2 \\cdot (6 + 3) = 18$.',
  },
] as const

export const staciakampioPerimetras: Generatorius = () =>
  suBandymais(kurkStaciakampioP, A_STACIAKAMPIO_P, 'staciakampio-perimetras')

function kurkStaciakampioP(): Uzdavinys | null {
  const a = atsitiktinis(3, 9)
  const b = atsitiktinis(2, 8)
  if (a === b) return null
  const p = 2 * (a + b)

  return variacija([
    // 1. Sudedant visas kraštines
    () =>
      uzdavinys('staciakampio-perimetras', {
        klausimas: `Rask stačiakampio, kurio ilgis ${a} cm, o plotis ${b} cm, perimetrą sudėdamas visas kraštines.`,
        atsakymas: String(p),
        atsakymasRodymui: `$${p}$ cm`,
        sprendimas: `$${a} + ${b} + ${a} + ${b} = ${p}$.`,
      }),

    // 2. Per sumos dvigubinimą
    () =>
      uzdavinys('staciakampio-perimetras', {
        klausimas: `Rask to paties stačiakampio perimetrą veiksmu $2 \\cdot (${a} + ${b})$.`,
        atsakymas: String(p),
        atsakymasRodymui: `$${p}$ cm`,
        sprendimas: `$${a} + ${b} = ${a + b}$, tada $2 \\cdot ${a + b} = ${p}$.`,
      }),

    // 3. Iš brėžinio
    () =>
      uzdavinys('staciakampio-perimetras', {
        klausimas: 'Rask brėžinyje pavaizduoto stačiakampio perimetrą.',
        atsakymas: String(p),
        atsakymasRodymui: `$${p}$ cm`,
        sprendimas: `Priešingos kraštinės lygios, tad $2 \\cdot (${a} + ${b}) = ${p}$.`,
        brezinys: staciakampisSuMatais(a, b),
      }),

    // 4. Kodėl priešingos kraštinės lygios
    () =>
      pasirinkimoUzdavinys(naujasId('staciakampio-perimetras'), 'staciakampio-perimetras', {
        klausimas: 'Kodėl stačiakampio perimetrui pakanka žinoti tik dvi kraštines?',
        variantai: [
          'priešingos stačiakampio kraštinės yra lygios',
          'stačiakampis turi tik dvi kraštines',
          'kitos dvi kraštinės yra dvigubai ilgesnės',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienas ilgis stačiakampyje pasikartoja du kartus.',
      }),

    // 5. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('staciakampio-perimetras'), 'staciakampio-perimetras', {
        klausimas: `Mokinys stačiakampio, kurio kraštinės ${a} cm ir ${b} cm, perimetrą apskaičiavo $${a} + ${b} = ${
          a + b
        }$. Kur klaida?`,
        variantai: [
          'sudėtos tik dvi kraštinės iš keturių',
          'kraštines reikėjo dauginti',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Kiekviena kraštinė yra po dvi, tad $2 \\cdot ${a + b} = ${p}$.`,
      }),

    // 6. Kuris perimetras didesnis
    () => {
      const c = atsitiktinis(3, 10)
      const d = atsitiktinis(2, 9)
      const kitasP = 2 * (c + d)
      if (kitasP === p) return null
      return pasirinkimoUzdavinys(naujasId('staciakampio-perimetras'), 'staciakampio-perimetras', {
        klausimas: `Kurio stačiakampio perimetras didesnis: ${a} cm × ${b} cm ar ${c} cm × ${d} cm?`,
        variantai:
          p > kitasP
            ? [`${a} cm × ${b} cm`, `${c} cm × ${d} cm`, 'perimetrai vienodi']
            : [`${c} cm × ${d} cm`, `${a} cm × ${b} cm`, 'perimetrai vienodi'],
        teisingas: 0,
        sprendimas: `Perimetrai yra ${p} cm ir ${kitasP} cm.`,
      })
    },

    // 7. Kraštinė kartais trumpesnė
    () => {
      const ilgis = atsitiktinis(2, 8) * 2
      const plotis = ilgis / 2
      return uzdavinys('staciakampio-perimetras', {
        klausimas: `Stačiakampio viena kraštinė ${ilgis} cm, kita — 2 kartus trumpesnė. Koks perimetras?`,
        atsakymas: String(2 * (ilgis + plotis)),
        atsakymasRodymui: `$${2 * (ilgis + plotis)}$ cm`,
        sprendimas: `Antroji kraštinė $${ilgis} : 2 = ${plotis}$ cm, tad $2 \\cdot (${ilgis} + ${plotis}) = ${
          2 * (ilgis + plotis)
        }$.`,
      })
    },
  ])
}

// ── 4.6 Braižymas ir perimetras ─────────────────────────────────────────────

const A_BRAIZYMAS = [
  {
    klausimas: 'Nubraižyto kvadrato kraštinė 4 cm. Koks jo perimetras?',
    atsakymas: '16',
    atsakymasRodymui: '$16$ cm',
    sprendimas: '$4 \\cdot 4 = 16$.',
  },
] as const

export const braizymasPerimetras: Generatorius = () =>
  suBandymais(kurkBraizyma, A_BRAIZYMAS, 'braizymas-perimetras')

function kurkBraizyma(): Uzdavinys | null {
  return variacija([
    // 1. Tinklelyje nubraižytas stačiakampis
    () => {
      const plotis = atsitiktinis(2, 6)
      const aukstis = atsitiktinis(2, 4)
      if (plotis === aukstis) return null
      return uzdavinys('braizymas-perimetras', {
        // Matmenys yra tik brėžinyje: langelius reikia suskaičiuoti.
        klausimas: 'Vienas tinklelio langelis yra 1 cm. Koks nubraižyto stačiakampio perimetras?',
        atsakymas: String(2 * (plotis + aukstis)),
        atsakymasRodymui: `$${2 * (plotis + aukstis)}$ cm`,
        sprendimas: `Stačiakampis yra ${plotis} langelių ilgio ir ${aukstis} langelių pločio: $2 \\cdot (${plotis} + ${aukstis}) = ${
          2 * (plotis + aukstis)
        }$.`,
        brezinys: tinklelisSuStaciakampiu(plotis + 2, aukstis + 2, plotis, aukstis),
      })
    },

    // 2. Kvadrato braižymas
    () => {
      const k = atsitiktinis(3, 8)
      return uzdavinys('braizymas-perimetras', {
        klausimas: `Nubraižyk kvadratą, kurio kraštinė ${k} cm. Koks jo perimetras?`,
        atsakymas: String(4 * k),
        atsakymasRodymui: `$${4 * k}$ cm`,
        sprendimas: `$4 \\cdot ${k} = ${4 * k}$.`,
      })
    },

    // 3. Lygiakraščio trikampio braižymas
    () => {
      const k = atsitiktinis(3, 9)
      return uzdavinys('braizymas-perimetras', {
        klausimas: `Nubraižyk lygiakraštį trikampį, kurio kraštinė ${k} cm. Koks jo perimetras?`,
        atsakymas: String(3 * k),
        atsakymasRodymui: `$${3 * k}$ cm`,
        sprendimas: `$3 \\cdot ${k} = ${3 * k}$.`,
      })
    },

    // 4. Penkiakampio braižymas su nurodytomis kraštinėmis
    () => {
      const k = [
        atsitiktinis(2, 5),
        atsitiktinis(2, 5),
        atsitiktinis(2, 5),
        atsitiktinis(2, 5),
        atsitiktinis(2, 5),
      ]
      return uzdavinys('braizymas-perimetras', {
        klausimas: `Nubraižyk penkiakampį su kraštinėmis ${k.join(' cm, ')} cm. Koks jo perimetras?`,
        atsakymas: String(k.reduce((s, x) => s + x, 0)),
        atsakymasRodymui: `$${k.reduce((s, x) => s + x, 0)}$ cm`,
        sprendimas: `$${k.join(' + ')} = ${k.reduce((s, x) => s + x, 0)}$.`,
      })
    },

    // 5. Kokia turi būti kita kraštinė
    () => {
      const p = atsitiktinis(6, 15) * 2
      const viena = atsitiktinis(2, p / 2 - 2)
      return uzdavinys('braizymas-perimetras', {
        klausimas: `Nori nubraižyti stačiakampį, kurio perimetras ${p} cm, o viena kraštinė ${viena} cm. Kokio ilgio turi būti kita kraštinė?`,
        atsakymas: String(p / 2 - viena),
        atsakymasRodymui: `$${p / 2 - viena}$ cm`,
        sprendimas: `Dviejų gretimų kraštinių suma yra $${p} : 2 = ${p / 2}$, tad kita kraštinė $${
          p / 2
        } - ${viena} = ${p / 2 - viena}$.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const k = atsitiktinis(3, 7)
      return pasirinkimoUzdavinys(naujasId('braizymas-perimetras'), 'braizymas-perimetras', {
        klausimas: `Mokinys nubraižė kvadratą su ${k} cm kraštinėmis, bet perimetrą užrašė ${
          k + 4
        } cm. Kur klaida?`,
        variantai: [
          `prie kraštinės pridėta 4, o reikėjo dauginti: $4 \\cdot ${k} = ${4 * k}$`,
          `reikėjo sudėti tik dvi kraštines: ${2 * k} cm`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Kvadrato perimetras yra $4 \\cdot ${k} = ${4 * k}$ cm.`,
      })
    },

    // 7. Šešiakampis su nurodytu perimetru
    () => {
      const dalis = atsitiktinis(2, 4)
      return uzdavinys('braizymas-perimetras', {
        klausimas: `Nori nubraižyti šešiakampį, kurio visos kraštinės po ${dalis} cm. Koks bus jo perimetras?`,
        atsakymas: String(6 * dalis),
        atsakymasRodymui: `$${6 * dalis}$ cm`,
        sprendimas: `$6 \\cdot ${dalis} = ${6 * dalis}$.`,
      })
    },
  ])
}

// ── 4.7 Taisyklingojo daugiakampio kraštinė iš perimetro ────────────────────

const A_TAISYKLINGO_K = [
  {
    klausimas: 'Kvadrato perimetras 20 cm. Koks vienos kraštinės ilgis?',
    atsakymas: '5',
    atsakymasRodymui: '$5$ cm',
    sprendimas: '$20 : 4 = 5$.',
  },
] as const

export const taisyklingoKrastine: Generatorius = () =>
  suBandymais(kurkTaisyklingoK, A_TAISYKLINGO_K, 'taisyklingo-krastine')

function kurkTaisyklingoK(): Uzdavinys | null {
  const figura = pasirink(TAISYKLINGI)
  const krastine = atsitiktinis(2, 9)
  const perimetras = figura.n * krastine

  return variacija([
    // 1. Kraštinė iš perimetro
    () =>
      uzdavinys('taisyklingo-krastine', {
        klausimas: `${figura.kilm.charAt(0).toUpperCase()}${figura.kilm.slice(
          1,
        )} perimetras yra ${perimetras} cm. Koks vienos kraštinės ilgis?`,
        atsakymas: String(krastine),
        atsakymasRodymui: `$${krastine}$ cm`,
        sprendimas: `Kraštinių ${figura.n}, tad $${perimetras} : ${figura.n} = ${krastine}$.`,
      }),

    // 2. Kokį veiksmą atlikti
    () =>
      pasirinkimoUzdavinys(naujasId('taisyklingo-krastine'), 'taisyklingo-krastine', {
        klausimas: 'Kokį veiksmą reikia atlikti, norint iš perimetro rasti taisyklingojo daugiakampio kraštinę?',
        variantai: [
          'perimetrą padalyti iš kraštinių skaičiaus',
          'perimetrą padauginti iš kraštinių skaičiaus',
          'iš perimetro atimti kraštinių skaičių',
        ],
        teisingas: 0,
        sprendimas: 'Perimetras sudarytas iš vienodų kraštinių, tad jį reikia padalyti po lygiai.',
      }),

    // 3. Klaidos radimas
    () => {
      const blogas = krastine + atsitiktinis(1, 3)
      return pasirinkimoUzdavinys(naujasId('taisyklingo-krastine'), 'taisyklingo-krastine', {
        klausimas: `${figura.kilm.charAt(0).toUpperCase()}${figura.kilm.slice(
          1,
        )} perimetras ${perimetras} cm. Mokinys kraštinę užrašė ${blogas} cm. Ar teisingai?`,
        variantai: [`ne, kraštinė yra ${krastine} cm`, 'taip, teisingai', 'negalima apskaičiuoti'],
        teisingas: 0,
        sprendimas: `$${perimetras} : ${figura.n} = ${krastine}$.`,
      })
    },

    // 4. Dviejų figūrų kraštinių palyginimas
    () => {
      const kita = pasirink(TAISYKLINGI)
      if (kita.n === figura.n) return null
      const kitaKrastine = atsitiktinis(2, 9)
      const kitasP = kita.n * kitaKrastine
      if (kitaKrastine === krastine) return null
      return pasirinkimoUzdavinys(naujasId('taisyklingo-krastine'), 'taisyklingo-krastine', {
        klausimas: `Kurio kraštinė ilgesnė: ${figura.kilm} su ${perimetras} cm perimetru ar ${kita.kilm} su ${kitasP} cm perimetru?`,
        variantai:
          krastine > kitaKrastine
            ? [figura.vardas, kita.vardas, 'kraštinės vienodos']
            : [kita.vardas, figura.vardas, 'kraštinės vienodos'],
        teisingas: 0,
        sprendimas: `Kraštinės yra $${perimetras} : ${figura.n} = ${krastine}$ cm ir $${kitasP} : ${kita.n} = ${kitaKrastine}$ cm.`,
      })
    },

    // 5. Perimetras iš kraštinės ir atgal
    () =>
      uzdavinys('taisyklingo-krastine', {
        klausimas: `Taisyklingojo trikampio kraštinė yra 3 kartus trumpesnė už jo perimetrą. Koks perimetras, jei kraštinė ${krastine} cm?`,
        atsakymas: String(3 * krastine),
        atsakymasRodymui: `$${3 * krastine}$ cm`,
        sprendimas: `$3 \\cdot ${krastine} = ${3 * krastine}$.`,
      }),

    // 6. Kiek kraštinių, jei žinomas perimetras ir kraštinė
    () =>
      uzdavinys('taisyklingo-krastine', {
        klausimas: `Taisyklingojo daugiakampio perimetras ${perimetras} cm, o viena kraštinė ${krastine} cm. Kiek kraštinių turi ši figūra?`,
        atsakymas: String(figura.n),
        atsakymasRodymui: `$${figura.n}$`,
        sprendimas: `$${perimetras} : ${krastine} = ${figura.n}$.`,
      }),

    // 7. Iš brėžinio
    () => {
      if (figura.n === 8) return null
      return uzdavinys('taisyklingo-krastine', {
        klausimas: `Brėžinyje pavaizduoto taisyklingojo daugiakampio perimetras yra ${perimetras} cm. Koks vienos kraštinės ilgis?`,
        atsakymas: String(krastine),
        atsakymasRodymui: `$${krastine}$ cm`,
        sprendimas: `Brėžinyje ${figura.n} kraštinės, tad $${perimetras} : ${figura.n} = ${krastine}$.`,
        brezinys: taisyklingasSuMatais(figura.n, krastine),
      })
    },
  ])
}

// ── 4.8 Nežinoma stačiakampio kraštinė iš perimetro ─────────────────────────

const A_STACIAKAMPIO_K = [
  {
    klausimas: 'Stačiakampio perimetras 18 cm, viena kraštinė 5 cm. Kokia kita kraštinė?',
    atsakymas: '4',
    atsakymasRodymui: '$4$ cm',
    sprendimas: '$18 : 2 = 9$, tada $9 - 5 = 4$.',
  },
] as const

export const staciakampioKrastine: Generatorius = () =>
  suBandymais(kurkStaciakampioK, A_STACIAKAMPIO_K, 'staciakampio-krastine')

function kurkStaciakampioK(): Uzdavinys | null {
  const a = atsitiktinis(3, 12)
  const b = atsitiktinis(2, 10)
  if (a === b) return null
  const p = 2 * (a + b)

  return variacija([
    // 1. Kita kraštinė
    () =>
      uzdavinys('staciakampio-krastine', {
        klausimas: `Stačiakampio perimetras yra ${p} cm, o viena kraštinė ${a} cm. Kokia kita kraštinė?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `Gretimų kraštinių suma $${p} : 2 = ${a + b}$, tad $${a + b} - ${a} = ${b}$.`,
      }),

    // 2. Plotis iš ilgio
    () =>
      uzdavinys('staciakampio-krastine', {
        klausimas: `Stačiakampio perimetras ${p} cm, ilgis ${Math.max(a, b)} cm. Rask plotį.`,
        atsakymas: String(Math.min(a, b)),
        atsakymasRodymui: `$${Math.min(a, b)}$ cm`,
        sprendimas: `$${p} : 2 = ${a + b}$, tada $${a + b} - ${Math.max(a, b)} = ${Math.min(a, b)}$.`,
      }),

    // 3. Iš brėžinio su nežinomąja
    () =>
      uzdavinys('staciakampio-krastine', {
        klausimas: `Brėžinyje pavaizduoto stačiakampio perimetras yra ${p} cm. Kokio ilgio yra nepažymėta kraštinė?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `Iš perimetro atimame dvi žinomas kraštines: $${p} - ${2 * a} = ${
          2 * b
        }$, tada $${2 * b} : 2 = ${b}$.`,
        brezinys: staciakampisSuMatais(a, b, 'viena'),
      }),

    // 4. Kodėl reikia atimti dvi kraštines
    () =>
      pasirinkimoUzdavinys(naujasId('staciakampio-krastine'), 'staciakampio-krastine', {
        klausimas: 'Kodėl ieškant nežinomos stačiakampio kraštinės iš perimetro atimamos dvi žinomos kraštinės?',
        variantai: [
          'nes žinoma kraštinė stačiakampyje yra du kartus',
          'nes stačiakampis turi tik dvi kraštines',
          'nes perimetras visada dvigubai didesnis už kraštinę',
        ],
        teisingas: 0,
        sprendimas: 'Perimetre kiekvienas ilgis pasikartoja du kartus.',
      }),

    // 5. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('staciakampio-krastine'), 'staciakampio-krastine', {
        klausimas: `Kai perimetras ${p} cm ir viena kraštinė ${a} cm, mokinys kitą kraštinę apskaičiavo $${p} - ${a} = ${
          p - a
        }$. Kur klaida?`,
        variantai: [
          'pirmiausia reikėjo perimetrą padalyti iš 2',
          'reikėjo perimetrą padauginti iš 2',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `$${p} : 2 = ${a + b}$, tada $${a + b} - ${a} = ${b}$.`,
      }),

    // 6. Viena kraštinė ilgesnė už kitą
    () => {
      const skirtumas = atsitiktinis(2, 5)
      const plotis = atsitiktinis(2, 9)
      const ilgis = plotis + skirtumas
      const perimetras = 2 * (ilgis + plotis)
      return uzdavinys('staciakampio-krastine', {
        klausimas: `Stačiakampio ilgis ${skirtumas} cm ilgesnis už plotį, o perimetras ${perimetras} cm. Koks plotis?`,
        atsakymas: String(plotis),
        atsakymasRodymui: `$${plotis}$ cm`,
        sprendimas: `Gretimų kraštinių suma $${perimetras} : 2 = ${
          ilgis + plotis
        }$. Atėmus skirtumą: $${ilgis + plotis} - ${skirtumas} = ${
          2 * plotis
        }$, tada $${2 * plotis} : 2 = ${plotis}$.`,
      })
    },

    // 7. Dviejų stačiakampių palyginimas
    () => {
      const c = atsitiktinis(3, 12)
      const d = atsitiktinis(2, 10)
      const kitasP = 2 * (c + d)
      if (d === b) return null
      return pasirinkimoUzdavinys(naujasId('staciakampio-krastine'), 'staciakampio-krastine', {
        klausimas: `Pirmojo stačiakampio perimetras ${p} cm ir viena kraštinė ${a} cm, antrojo — ${kitasP} cm ir ${c} cm. Kurio nežinoma kraštinė ilgesnė?`,
        variantai:
          b > d ? ['pirmojo', 'antrojo', 'kraštinės vienodos'] : ['antrojo', 'pirmojo', 'kraštinės vienodos'],
        teisingas: 0,
        sprendimas: `Nežinomos kraštinės yra ${b} cm ir ${d} cm.`,
      })
    },
  ])
}

// ── 4.9 Matematinis stalo žaidimas ──────────────────────────────────────────

const A_ZAIDIMAS = [
  {
    klausimas: 'Žaidimo lentoje 20 langelių. Žaidėjas kaskart pajuda po 4. Per kiek ėjimų pasieks pabaigą?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: '$20 : 4 = 5$.',
  },
] as const

export const stalozaidimas: Generatorius = () =>
  suBandymais(kurkZaidima, A_ZAIDIMAS, 'stalo-zaidimas')

/**
 * Potemė prašo sugalvoti žaidimą, o tokio atsakymo patikrinti neįmanoma.
 * Todėl klausiama to, ką pačiame žaidime reikia suskaičiuoti: langelių,
 * ėjimų, taškų ir kortelių — matematika lieka ta pati, o atsakymas tampa
 * vienareikšmis.
 */
function kurkZaidima(): Uzdavinys | null {
  return variacija([
    // 1. Per kiek ėjimų
    () => {
      const zingsnis = atsitiktinis(2, 6)
      const langeliu = zingsnis * atsitiktinis(3, 8)
      return uzdavinys('stalo-zaidimas', {
        klausimas: `Žaidimo lentoje ${langeliu} langeliai. Žaidėjas kaskart pajuda po ${zingsnis} langelius. Per kiek ėjimų jis pasieks pabaigą?`,
        atsakymas: String(langeliu / zingsnis),
        atsakymasRodymui: `$${langeliu / zingsnis}$`,
        sprendimas: `$${langeliu} : ${zingsnis} = ${langeliu / zingsnis}$.`,
      })
    },

    // 2. Taškų skaičiavimas
    () => {
      const teisingi = atsitiktinis(4, 9)
      const uz = atsitiktinis(2, 5)
      const neteisingi = atsitiktinis(1, 3)
      return uzdavinys('stalo-zaidimas', {
        klausimas: `Žaidime už teisingą atsakymą duodama ${uz} taškai, o už neteisingą atimamas 1 taškas. Žaidėjas atsakė teisingai ${teisingi} kartus ir neteisingai ${neteisingi} kartus. Kiek taškų jis surinko?`,
        atsakymas: String(teisingi * uz - neteisingi),
        atsakymasRodymui: `$${teisingi * uz - neteisingi}$`,
        sprendimas: `$${teisingi} \\cdot ${uz} = ${
          teisingi * uz
        }$, tada $${teisingi * uz} - ${neteisingi} = ${teisingi * uz - neteisingi}$.`,
      })
    },

    // 3. Kortelių dalybos
    () => {
      const zaideju = atsitiktinis(3, 6)
      const korteliu = zaideju * atsitiktinis(4, 9)
      return uzdavinys('stalo-zaidimas', {
        klausimas: `Žaidimui paruoštos ${korteliu} užduočių kortelės. Jos padalijamos po lygiai ${zaideju} žaidėjams. Kiek kortelių gaus kiekvienas?`,
        atsakymas: String(korteliu / zaideju),
        atsakymasRodymui: `$${korteliu / zaideju}$`,
        sprendimas: `$${korteliu} : ${zaideju} = ${korteliu / zaideju}$.`,
      })
    },

    // 4. Kiek dar liko langelių
    () => {
      const langeliu = atsitiktinis(20, 40)
      const nueita = atsitiktinis(5, langeliu - 5)
      return uzdavinys('stalo-zaidimas', {
        klausimas: `Žaidimo lentoje ${langeliu} langeliai. Žaidėjas jau nuėjo ${nueita}. Kiek langelių jam liko?`,
        atsakymas: String(langeliu - nueita),
        atsakymasRodymui: `$${langeliu - nueita}$`,
        sprendimas: `$${langeliu} - ${nueita} = ${langeliu - nueita}$.`,
      })
    },

    // 5. Kortelės pagal sunkumą
    () => {
      const lengvos = atsitiktinis(2, 5)
      const vidutines = atsitiktinis(2, 5)
      const sunkios = atsitiktinis(1, 3)
      return uzdavinys('stalo-zaidimas', {
        klausimas: `Žaidimui paruošta ${lengvos} lengvos, ${vidutines} vidutinės ir ${sunkios} sunkios kortelės. Kiek iš viso kortelių?`,
        atsakymas: String(lengvos + vidutines + sunkios),
        atsakymasRodymui: `$${lengvos + vidutines + sunkios}$`,
        sprendimas: `$${lengvos} + ${vidutines} + ${sunkios} = ${lengvos + vidutines + sunkios}$.`,
      })
    },

    // 6. Kokia taisyklė sąžininga
    () =>
      pasirinkimoUzdavinys(naujasId('stalo-zaidimas'), 'stalo-zaidimas', {
        klausimas: 'Kuri žaidimo taisyklė visiems žaidėjams vienodai sąžininga?',
        variantai: [
          'visi gauna po tiek pat kortelių ir eina paeiliui',
          'pirmasis žaidėjas gauna dviem kortelėmis daugiau',
          'kortelės dalijamos atsitiktinai, kiek kam pakliūva',
        ],
        teisingas: 0,
        sprendimas: 'Sąžiningame žaidime visų žaidėjų sąlygos vienodos.',
      }),

    // 7. Žaidimo lentos perimetras
    () => {
      const kraštine = atsitiktinis(4, 9)
      return uzdavinys('stalo-zaidimas', {
        klausimas: `Kvadratinės žaidimo lentos kraštinė yra ${kraštine} dm. Kiek decimetrų juostelės reikės apvedžioti visą jos kraštą?`,
        atsakymas: String(4 * kraštine),
        atsakymasRodymui: `$${4 * kraštine}$ dm`,
        sprendimas: `Reikia lentos perimetro: $4 \\cdot ${kraštine} = ${4 * kraštine}$.`,
      })
    },
  ])
}
