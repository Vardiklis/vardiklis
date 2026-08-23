import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { brezinuEile, daugiakampis, planas, type Taskas } from './antroku-figuru-vaizdai'
import {
  dviSvarstykles,
  liniuoteMm,
  matavimoIndas,
  stulpeliai,
  svarstykliuCiferblatas,
} from './pirmoku-vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 2 klasės temos „Ilgio matavimas“ ir „Masės ir talpos matavimas. Algoritmai“.
 *
 * Potemės rėmėsi bendraisiais generatoriais: `matavimo-vienetai` duodavo
 * hektarus ir tonas kartu su kilometrais, `plotas-turis` — plotų formules,
 * `erdvines-figuros` — briaunų ir sienų skaičiavimą, `algoritmai` — ciklus,
 * `diagramos` — vienodus stulpelinės diagramos klausimus.
 *
 * Antroje klasėje čia mokoma tik to, ką galima parodyti: kuo matuoti (mm, cm,
 * m, km; g, kg, t; l), kaip smulkinti ir stambinti vienetus, plotą skaičiuoti
 * langeliais, o programavime — sąlyginę komandą „jei… tada…“.
 */

const VARDAI = ['Matas', 'Ieva', 'Emilis', 'Luknė', 'Greta', 'Tauras'] as const

function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 1000, 1000)
}

// ═══ Ilgio matavimas ════════════════════════════════════════════════════════

// ── Kas matuojama metrais, centimetrais? ────────────────────────────────────

const METRINIAI = ['kambario ilgį', 'durų plotį', 'kiemo ilgį', 'klasės ilgį'] as const
const CENTIMETRINIAI = ['pieštuko ilgį', 'knygos plotį', 'trintuko ilgį', 'delno plotį'] as const

const A_M_CM = [
  {
    klausimas: 'Ką matuotum metrais?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — kambario ilgį',
    sprendimas: 'Ilgus atstumus matuojame metrais, o mažus daiktus — centimetrais.',
  },
] as const

export const metraiCentimetrai: Generatorius = () =>
  suBandymais(kurkMCm, A_M_CM, 'metrai-centimetrai')

function kurkMCm(): Uzdavinys | null {
  return variacija([
    // 1. Ką matuoti metrais
    () =>
      pasirinkimoUzdavinys(naujasId('metrai-centimetrai'), 'metrai-centimetrai', {
        klausimas: `Ką patogiau matuoti metrais?`,
        variantai: [pasirink(METRINIAI), pasirink(CENTIMETRINIAI), 'monetos storį'],
        teisingas: 0,
        sprendimas: 'Ilgus atstumus matuojame metrais — kitaip centimetrų būtų labai daug.',
      }),

    // 2. Ką matuoti centimetrais
    () =>
      pasirinkimoUzdavinys(naujasId('metrai-centimetrai'), 'metrai-centimetrai', {
        klausimas: `Ką patogiau matuoti centimetrais?`,
        variantai: [pasirink(CENTIMETRINIAI), pasirink(METRINIAI), 'atstumą tarp miestų'],
        teisingas: 0,
        sprendimas: 'Mažus daiktus matuojame centimetrais.',
      }),

    // 3. Koks vienetas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('metrai-centimetrai'), 'metrai-centimetrai', {
        klausimas: 'Kokiu vienetu užrašysi durų plotį?',
        variantai: ['m', 'cm', 'kg'],
        teisingas: 0,
        sprendimas: 'Durų plotis yra apie metro, tad patogiau rašyti metrais.',
      }),

    // 4. Kuris vienetas didesnis
    () =>
      pasirinkimoUzdavinys(naujasId('metrai-centimetrai'), 'metrai-centimetrai', {
        klausimas: 'Kuris ilgio vienetas didesnis?',
        variantai: ['metras', 'centimetras', 'jie vienodi'],
        teisingas: 0,
        sprendimas: 'Viename metre telpa 100 centimetrų.',
      }),

    // 5. Ką reiškia santrumpos
    () =>
      pasirinkimoUzdavinys(naujasId('metrai-centimetrai'), 'metrai-centimetrai', {
        klausimas: 'Ką reiškia santrumpa cm?',
        variantai: ['centimetras', 'kilogramas', 'kilometras'],
        teisingas: 0,
        sprendimas: 'cm yra centimetras, m — metras, km — kilometras.',
      }),
  ])
}

// ── Kas matuojama milimetrais? ──────────────────────────────────────────────

const A_MM = [
  {
    klausimas: 'Ką patogu matuoti milimetrais?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — monetos storį',
    sprendimas: 'Milimetrais matuojami labai maži ilgiai.',
  },
] as const

export const milimetrai: Generatorius = () => suBandymais(kurkMm, A_MM, 'milimetrai')

function kurkMm(): Uzdavinys | null {
  return variacija([
    // 1. Ką matuoti milimetrais
    () =>
      pasirinkimoUzdavinys(naujasId('milimetrai'), 'milimetrai', {
        klausimas: 'Ką patogu matuoti milimetrais?',
        variantai: ['monetos storį', 'klasės ilgį', 'atstumą tarp miestų'],
        teisingas: 0,
        sprendimas: 'Milimetrais matuojami labai maži ilgiai — storis, plonos detalės.',
      }),

    // 2. Koks vienetas tinka varžteliui
    () =>
      pasirinkimoUzdavinys(naujasId('milimetrai'), 'milimetrai', {
        klausimas: 'Kokiu vienetu užrašysi varžtelio ilgį?',
        variantai: ['mm', 'm', 'km'],
        teisingas: 0,
        sprendimas: 'Varžtelis yra kelių milimetrų ilgio.',
      }),

    // 3. Kuris vienetas mažiausias
    () =>
      pasirinkimoUzdavinys(naujasId('milimetrai'), 'milimetrai', {
        klausimas: 'Kuris ilgio vienetas mažiausias?',
        variantai: ['milimetras', 'centimetras', 'metras'],
        teisingas: 0,
        sprendimas: 'Viename centimetre telpa 10 milimetrų, o metre — 1000.',
        brezinys: liniuoteMm(5),
      }),

    // 3b. Kiek smulkių brūkšnelių tarp dviejų centimetrų
    () =>
      uzdavinys('milimetrai', {
        klausimas: 'Į kiek dalių liniuotėje padalytas vienas centimetras?',
        atsakymas: '10',
        atsakymasRodymui: '$10$',
        sprendimas: 'Tarp dviejų gretimų centimetro padalų yra 10 milimetrų.',
        brezinys: liniuoteMm(4),
      }),

    // 3c. Kokio ilgio juostelė milimetrais
    () => {
      const cm = atsitiktinis(2, 5)
      return uzdavinys('milimetrai', {
        klausimas: 'Kiek milimetrų ilgio yra juostelė?',
        atsakymas: String(cm * 10),
        atsakymasRodymui: `$${cm * 10}$ mm`,
        sprendimas: `Juostelė tęsiasi iki ${cm} cm padalos, o ${cm} cm yra ${cm * 10} mm.`,
        brezinys: liniuoteMm(6, { nuo: 0, iki: cm }),
      })
    },

    // 4. Užbaik sakinį
    () =>
      pasirinkimoUzdavinys(naujasId('milimetrai'), 'milimetrai', {
        klausimas: 'Užbaik: labai mažą ilgį patogiausia matuoti …',
        variantai: ['milimetrais', 'metrais', 'kilometrais'],
        teisingas: 0,
        sprendimas: 'Kuo mažesnis daiktas, tuo mažesnio vieneto reikia.',
      }),

    // 5. Surikiuoti vienetus
    () =>
      eiliskumoUzdavinys(naujasId('milimetrai'), 'milimetrai', {
        klausimas: 'Surikiuok ilgio vienetus nuo mažiausio iki didžiausio.',
        teisingaEile: ['mm', 'cm', 'm', 'km'],
        sprendimas: '1 cm = 10 mm, 1 m = 100 cm, 1 km = 1000 m.',
      }),
  ])
}

// ── Kaip smulkinti ir stambinti ilgio matavimo vienetus? ────────────────────

const A_VIENETAI = [
  {
    klausimas: 'Užbaik: $1$ cm $=\\square$ mm.',
    atsakymas: '10',
    atsakymasRodymui: '$10$ mm',
    sprendimas: 'Viename centimetre yra 10 milimetrų.',
  },
] as const

export const ilgioVienetai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkVienetus(sritis), A_VIENETAI, 'ilgio-vienetai')

function kurkVienetus(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const cm = atsitiktinis(2, 9)
  const m = atsitiktinis(2, 9)

  return variacija([
    // 1. Kiek mm viename cm
    () =>
      uzdavinys('ilgio-vienetai', {
        klausimas: 'Užbaik: $1$ cm $=\\square$ mm.',
        atsakymas: '10',
        atsakymasRodymui: '$10$ mm',
        sprendimas: 'Viename centimetre yra 10 milimetrų.',
      }),

    // 2. Kiek cm viename m
    () =>
      uzdavinys('ilgio-vienetai', {
        klausimas: 'Užbaik: $1$ m $=\\square$ cm.',
        atsakymas: '100',
        atsakymasRodymui: '$100$ cm',
        sprendimas: 'Viename metre yra 100 centimetrų.',
      }),

    // 3. cm į mm
    () =>
      uzdavinys('ilgio-vienetai', {
        klausimas: `Užbaik: $${cm}$ cm $=\\square$ mm.`,
        atsakymas: String(cm * 10),
        atsakymasRodymui: `$${cm * 10}$ mm`,
        sprendimas: `Kiekviename centimetre po 10 mm: $${cm} \\cdot 10 = ${cm * 10}$ mm.`,
        brezinys: liniuoteMm(Math.max(cm, 4), { nuo: 0, iki: cm }),
      }),

    // 4. mm į cm
    () =>
      uzdavinys('ilgio-vienetai', {
        klausimas: `Užbaik: $${cm * 10}$ mm $=\\square$ cm.`,
        atsakymas: String(cm),
        atsakymasRodymui: `$${cm}$ cm`,
        sprendimas: `$${cm * 10} : 10 = ${cm}$ cm.`,
        brezinys: liniuoteMm(Math.max(cm, 4), { nuo: 0, iki: cm }),
      }),

    // 5. cm į m
    () => {
      if (m * 100 > maks) return null
      return uzdavinys('ilgio-vienetai', {
        klausimas: `Užbaik: $${m * 100}$ cm $=\\square$ m.`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$ m`,
        sprendimas: `$${m * 100} : 100 = ${m}$ m.`,
      })
    },

    // 6. Kuris ilgis didesnis
    () => {
      const mm = atsitiktinis(11, 99)
      const kitasCm = atsitiktinis(1, 9)
      if (mm === kitasCm * 10) return null
      return pasirinkimoUzdavinys(naujasId('ilgio-vienetai'), 'ilgio-vienetai', {
        klausimas: `Kuris ilgis didesnis: ${mm} mm ar ${kitasCm} cm?`,
        variantai:
          mm > kitasCm * 10
            ? [`${mm} mm`, `${kitasCm} cm`, 'vienodi']
            : [`${kitasCm} cm`, `${mm} mm`, 'vienodi'],
        teisingas: 0,
        sprendimas: `${kitasCm} cm yra ${kitasCm * 10} mm, tad lyginame ${mm} ir ${kitasCm * 10}.`,
      })
    },
  ])
}

// ── Kaip nubraižyti figūrą? ─────────────────────────────────────────────────

const A_BRAIZYMAS = [
  {
    klausimas: 'Kelinta figūra yra stačiakampis?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: 'Stačiakampis turi keturis kampus ir lygiagrečias priešingas kraštines.',
  },
] as const

export const figurosBraizymas: Generatorius = () =>
  suBandymais(kurkBraizyma, A_BRAIZYMAS, 'figuros-braizymas')

function kurkBraizyma(): Uzdavinys | null {
  const kr = atsitiktinis(3, 8)
  const kitas = atsitiktinis(3, 8)

  return variacija([
    // 1. Kvadrato kraštinių suma
    () =>
      uzdavinys('figuros-braizymas', {
        klausimas: `Nubraižytas kvadratas, kurio kraštinė ${kr} cm. Kam lygi visų jo kraštinių ilgių suma?`,
        atsakymas: String(kr * 4),
        atsakymasRodymui: `$${kr * 4}$ cm`,
        sprendimas: `Kvadratas turi 4 vienodas kraštines: $${kr} \\cdot 4 = ${kr * 4}$ cm.`,
        brezinys: brezinuEile([daugiakampis(4, true)]),
      }),

    // 2. Stačiakampio kraštinių suma
    () => {
      if (kr === kitas) return null
      return uzdavinys('figuros-braizymas', {
        klausimas: `Nubraižytas stačiakampis, kurio ilgis ${kr} cm, o plotis ${kitas} cm. Kam lygi visų kraštinių ilgių suma?`,
        atsakymas: String((kr + kitas) * 2),
        atsakymasRodymui: `$${(kr + kitas) * 2}$ cm`,
        sprendimas: `Priešingos kraštinės lygios: $(${kr} + ${kitas}) \\cdot 2 = ${(kr + kitas) * 2}$ cm.`,
      })
    },

    // 3. Kiek kraštinių reikia nubrėžti
    () => {
      const n = atsitiktinis(3, 6)
      const vardai: Record<number, string> = {
        3: 'trikampį',
        4: 'keturkampį',
        5: 'penkiakampį',
        6: 'šešiakampį',
      }
      return uzdavinys('figuros-braizymas', {
        klausimas: `Kiek kraštinių reikia nubrėžti, kad gautum ${vardai[n]}?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Kraštinių tiek pat, kiek kampų — ${n}.`,
        brezinys: brezinuEile([daugiakampis(n, true)]),
      })
    },

    // 4. Kuo skiriasi kvadratas nuo stačiakampio
    () =>
      pasirinkimoUzdavinys(naujasId('figuros-braizymas'), 'figuros-braizymas', {
        klausimas: 'Kuo kvadratas skiriasi nuo bet kurio stačiakampio?',
        variantai: [
          'kvadrato visos kraštinės lygios',
          'kvadratas turi daugiau kampų',
          'kvadratas neturi kampų',
        ],
        teisingas: 0,
        sprendimas: 'Abu turi keturis kampus, bet kvadrato visos keturios kraštinės vienodo ilgio.',
      }),

    // 5. Kokio ilgio kraštinė
    () =>
      uzdavinys('figuros-braizymas', {
        klausimas: `Kvadrato visų kraštinių ilgių suma ${kr * 4} cm. Koks vienos kraštinės ilgis?`,
        atsakymas: String(kr),
        atsakymasRodymui: `$${kr}$ cm`,
        sprendimas: `$${kr * 4} : 4 = ${kr}$ cm.`,
      }),
  ])
}

// ── Kaip išmatuoti plotą langeliais? ────────────────────────────────────────

const A_PLOTAS = [
  {
    klausimas: 'Stačiakampis užima 12 langelių. Koks jo plotas langeliais?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: 'Plotas langeliais yra tiek, kiek langelių figūra uždengia.',
  },
] as const

export const plotasLangeliais: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkPlota(sritis), A_PLOTAS, 'plotas-langeliais')

function kurkPlota(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const ilgis = atsitiktinis(2, 8)
  const plotis = atsitiktinis(2, 6)
  const plotas = ilgis * plotis
  if (plotas > maks) return null

  return variacija([
    // 1. Koks plotas
    () =>
      uzdavinys('plotas-langeliais', {
        klausimas: `Stačiakampis užima ${ilgis} langelių eilutes po ${plotis} langelius. Koks jo plotas langeliais?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$`,
        sprendimas: `$${ilgis} \\cdot ${plotis} = ${plotas}$ langeliai.`,
      }),

    // 2. Kiek langelių eilutėje
    () =>
      uzdavinys('plotas-langeliais', {
        klausimas: `Stačiakampio plotas ${plotas} langeliai, o eilučių yra ${ilgis}. Po kiek langelių vienoje eilutėje?`,
        atsakymas: String(plotis),
        atsakymasRodymui: `$${plotis}$`,
        sprendimas: `$${plotas} : ${ilgis} = ${plotis}$.`,
      }),

    // 3. Kuri figūra užima daugiau
    () => {
      const kitasPlotas = atsitiktinis(2, 8) * atsitiktinis(2, 6)
      if (kitasPlotas === plotas || kitasPlotas > maks) return null
      return pasirinkimoUzdavinys(naujasId('plotas-langeliais'), 'plotas-langeliais', {
        klausimas: `Viena figūra užima ${plotas} langelius, kita — ${kitasPlotas}. Kuri užima daugiau?`,
        variantai:
          plotas > kitasPlotas
            ? [`${plotas} langelių figūra`, `${kitasPlotas} langelių figūra`, 'abi vienodos']
            : [`${kitasPlotas} langelių figūra`, `${plotas} langelių figūra`, 'abi vienodos'],
        teisingas: 0,
        sprendimas: `${Math.max(plotas, kitasPlotas)} yra daugiau nei ${Math.min(plotas, kitasPlotas)}.`,
      })
    },

    // 4. Kas yra plotas langeliais
    () =>
      pasirinkimoUzdavinys(naujasId('plotas-langeliais'), 'plotas-langeliais', {
        klausimas: 'Ką rodo figūros plotas langeliais?',
        variantai: [
          'kiek langelių figūra uždengia',
          'kiek kraštinių ji turi',
          'koks jos kraštinių ilgis',
        ],
        teisingas: 0,
        sprendimas: 'Plotas matuojamas tuo, kiek vietos figūra užima — čia skaičiuojami langeliai.',
      }),

    // 5. Kiek langelių trūksta
    () => {
      const tikslas = plotas + atsitiktinis(2, 8)
      if (tikslas > maks) return null
      return uzdavinys('plotas-langeliais', {
        klausimas: `Figūra užima ${plotas} langelius. Kiek langelių trūksta iki ${tikslas}?`,
        atsakymas: String(tikslas - plotas),
        atsakymasRodymui: `$${tikslas - plotas}$`,
        sprendimas: `$${tikslas} - ${plotas} = ${tikslas - plotas}$.`,
      })
    },
  ])
}

// ── Kaip apskaičiuoti figūros dalį? ─────────────────────────────────────────

const A_FIGUROS_DALIS = [
  {
    klausimas: 'Figūra padalyta į 8 vienodus langelius, nuspalvinti 4. Kiek langelių nuspalvinta?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Nuspalvinta pusė — 4 iš 8.',
  },
] as const

export const figurosDalis: Generatorius = () =>
  suBandymais(kurkFiguresDali, A_FIGUROS_DALIS, 'figuros-dalis')

function kurkFiguresDali(): Uzdavinys | null {
  const daliu = pasirink([4, 6, 8, 12])
  const nuspalvinta = atsitiktinis(1, daliu - 1)

  return variacija([
    // 1. Kiek dalių nuspalvinta
    () =>
      uzdavinys('figuros-dalis', {
        klausimas: `Figūra padalyta į ${daliu} vienodas dalis, nuspalvintos ${nuspalvinta}. Kiek dalių nuspalvinta?`,
        atsakymas: String(nuspalvinta),
        atsakymasRodymui: `$${nuspalvinta}$`,
        sprendimas: `Iš ${daliu} dalių nuspalvintos ${nuspalvinta}.`,
      }),

    // 2. Kiek dalių sudaro pusę
    () =>
      uzdavinys('figuros-dalis', {
        klausimas: `Figūra padalyta į ${daliu} vienodas dalis. Kiek dalių sudaro pusę?`,
        atsakymas: String(daliu / 2),
        atsakymasRodymui: `$${daliu / 2}$`,
        sprendimas: `$${daliu} : 2 = ${daliu / 2}$.`,
      }),

    // 3. Kiek dalių sudaro ketvirtadalį
    () => {
      if (daliu % 4 !== 0) return null
      return uzdavinys('figuros-dalis', {
        klausimas: `Figūra padalyta į ${daliu} vienodas dalis. Kiek dalių sudaro ketvirtadalį?`,
        atsakymas: String(daliu / 4),
        atsakymasRodymui: `$${daliu / 4}$`,
        sprendimas: `$${daliu} : 4 = ${daliu / 4}$.`,
      })
    },

    // 4. Kiek dalių liko nenuspalvintų
    () =>
      uzdavinys('figuros-dalis', {
        klausimas: `Figūra padalyta į ${daliu} dalis, nuspalvintos ${nuspalvinta}. Kiek dalių liko nenuspalvintų?`,
        atsakymas: String(daliu - nuspalvinta),
        atsakymasRodymui: `$${daliu - nuspalvinta}$`,
        sprendimas: `$${daliu} - ${nuspalvinta} = ${daliu - nuspalvinta}$.`,
      }),

    // 5. Ar nuspalvinta pusė
    () => {
      const puse = nuspalvinta === daliu / 2
      return pasirinkimoUzdavinys(naujasId('figuros-dalis'), 'figuros-dalis', {
        klausimas: `Iš ${daliu} dalių nuspalvintos ${nuspalvinta}. Ar tai pusė figūros?`,
        variantai: puse
          ? ['taip, tai lygiai pusė', 'ne, mažiau nei pusė', 'ne, daugiau nei pusė']
          : nuspalvinta < daliu / 2
            ? ['ne, mažiau nei pusė', 'taip, tai lygiai pusė', 'ne, daugiau nei pusė']
            : ['ne, daugiau nei pusė', 'taip, tai lygiai pusė', 'ne, mažiau nei pusė'],
        teisingas: 0,
        sprendimas: `Pusę sudarytų ${daliu / 2} dalys, o nuspalvintos ${nuspalvinta}.`,
      })
    },
  ])
}

// ── Kas yra erdvės figūros? ─────────────────────────────────────────────────

const A_ERDVES = [
  {
    klausimas: 'Kuri figūra yra erdvės figūra?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — kubas',
    sprendimas: 'Erdvės figūrą galima paimti į ranką — ji turi ilgį, plotį ir aukštį.',
  },
] as const

export const erdvesFiguros: Generatorius = () => suBandymais(kurkErdves, A_ERDVES, 'erdves-figuros')

function kurkErdves(): Uzdavinys | null {
  const poros = [
    { erdve: 'kubas', plokstuma: 'kvadratas', daiktas: 'kaladėlė' },
    { erdve: 'rutulys', plokstuma: 'apskritimas', daiktas: 'kamuolys' },
    { erdve: 'stačiakampis gretasienis', plokstuma: 'stačiakampis', daiktas: 'dėžė' },
  ]
  const p = pasirink(poros)
  const kitas = pasirink(poros.filter((x) => x.erdve !== p.erdve))

  return variacija([
    // 1. Kuri figūra erdvinė
    () =>
      pasirinkimoUzdavinys(naujasId('erdves-figuros'), 'erdves-figuros', {
        klausimas: 'Kuri figūra yra erdvės figūra?',
        variantai: [p.erdve, p.plokstuma, 'trikampis'],
        teisingas: 0,
        sprendimas: 'Erdvės figūra turi ilgį, plotį ir aukštį — ją galima paimti į ranką.',
      }),

    // 2. Kokios formos daiktas
    () =>
      pasirinkimoUzdavinys(naujasId('erdves-figuros'), 'erdves-figuros', {
        klausimas: `Kokios formos yra ${p.daiktas}?`,
        variantai: [p.erdve, kitas.erdve, p.plokstuma],
        teisingas: 0,
        sprendimas: `${p.daiktas[0].toUpperCase()}${p.daiktas.slice(1)} yra ${p.erdve}.`,
      }),

    // 3. Kuo skiriasi plokščioji ir erdvinė
    () =>
      pasirinkimoUzdavinys(naujasId('erdves-figuros'), 'erdves-figuros', {
        klausimas: 'Kuo erdvės figūra skiriasi nuo plokščiosios?',
        variantai: [
          'erdvės figūra turi ir aukštį',
          'erdvės figūra visada didesnė',
          'erdvės figūra neturi kampų',
        ],
        teisingas: 0,
        sprendimas: 'Plokščioji figūra telpa lape, o erdvinė užima vietos ir į aukštį.',
      }),

    // 4. Kuri iš jų plokščioji
    () =>
      pasirinkimoUzdavinys(naujasId('erdves-figuros'), 'erdves-figuros', {
        klausimas: 'Kuri figūra yra plokščioji?',
        variantai: [p.plokstuma, p.erdve, kitas.erdve],
        teisingas: 0,
        sprendimas: `${p.plokstuma[0].toUpperCase()}${p.plokstuma.slice(1)} yra plokščioji figūra — ją galima nubraižyti lape.`,
      }),

    // 5. Kiek sienų turi kubas
    () =>
      uzdavinys('erdves-figuros', {
        klausimas: 'Kiek sienų turi kubas?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Kubas turi 6 vienodas kvadratines sienas.',
      }),
  ])
}

// ── Kas matuojama kilometrais? ──────────────────────────────────────────────

const A_KM = [
  {
    klausimas: 'Ką matuotum kilometrais?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — atstumą tarp miestų',
    sprendimas: 'Kilometrais matuojami dideli atstumai.',
  },
] as const

export const kilometrai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkKm(sritis), A_KM, 'kilometrai')

function kurkKm(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const km = atsitiktinis(2, 9)

  return variacija([
    // 1. Ką matuoti kilometrais
    () =>
      pasirinkimoUzdavinys(naujasId('kilometrai'), 'kilometrai', {
        klausimas: 'Ką patogiau matuoti kilometrais?',
        variantai: ['atstumą tarp miestų', 'pieštuko ilgį', 'monetos storį'],
        teisingas: 0,
        sprendimas: 'Kilometrais matuojami dideli atstumai, kurių metrais būtų labai daug.',
      }),

    // 2. Koks vienetas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('kilometrai'), 'kilometrai', {
        klausimas: `Kelias tarp dviejų miestų yra ${atsitiktinis(20, 60)} … Įrašyk tinkamą vienetą.`,
        variantai: ['km', 'cm', 'mm'],
        teisingas: 0,
        sprendimas: 'Tokie atstumai matuojami kilometrais.',
      }),

    // 3. Kiek metrų viename kilometre
    () => {
      if (maks < 1000) return null
      return uzdavinys('kilometrai', {
        klausimas: 'Užbaik: $1$ km $=\\square$ m.',
        atsakymas: '1000',
        atsakymasRodymui: '$1000$ m',
        sprendimas: 'Viename kilometre yra 1000 metrų.',
      })
    },

    // 4. Kuris vienetas didžiausias
    () =>
      pasirinkimoUzdavinys(naujasId('kilometrai'), 'kilometrai', {
        klausimas: 'Kuris ilgio vienetas didžiausias?',
        variantai: ['kilometras', 'metras', 'centimetras'],
        teisingas: 0,
        sprendimas: '1 km = 1000 m, o 1 m = 100 cm.',
      }),

    // 5. Kiek kilometrų liko
    () => {
      const nuejo = atsitiktinis(1, km - 1)
      return uzdavinys('kilometrai', {
        klausimas: `Kelias yra ${km} km. Nuėjo ${nuejo} km. Kiek kilometrų liko?`,
        atsakymas: String(km - nuejo),
        atsakymasRodymui: `$${km - nuejo}$ km`,
        sprendimas: `$${km} - ${nuejo} = ${km - nuejo}$ km.`,
      })
    },
  ])
}

// ── Uždaviniai su ilgio matavimo vienetais ──────────────────────────────────

const A_ILGIO_UZD = [
  {
    klausimas: 'Juostelė 45 cm, kita 30 cm. Kiek centimetrų jos kartu?',
    atsakymas: '75',
    atsakymasRodymui: '$75$ cm',
    sprendimas: '$45 + 30 = 75$ cm.',
  },
] as const

export const ilgioUzdaviniai2: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkIlgioUzd(sritis), A_ILGIO_UZD, 'ilgio-uzdaviniai-2')

function kurkIlgioUzd(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(20, 90)
  const b = atsitiktinis(10, a - 5)
  if (a + b > maks) return null

  return variacija([
    // 1. Bendras ilgis centimetrais
    () =>
      uzdavinys('ilgio-uzdaviniai-2', {
        klausimas: `Viena juostelė ${a} cm, kita — ${b} cm. Kiek centimetrų jos kartu?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ cm`,
        sprendimas: `$${a} + ${b} = ${a + b}$ cm.`,
      }),

    // 2. Kiek liko nukirpus
    () =>
      uzdavinys('ilgio-uzdaviniai-2', {
        klausimas: `Virvė buvo ${a} cm. Nukirpo ${b} cm. Kiek centimetrų liko?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ cm`,
        sprendimas: `$${a} - ${b} = ${a - b}$ cm.`,
      }),

    // 3. Keliais centimetrais ilgesnis
    () =>
      uzdavinys('ilgio-uzdaviniai-2', {
        klausimas: `Pieštukas ${a} mm, trintukas — ${b} mm. Keliais milimetrais pieštukas ilgesnis?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ mm`,
        sprendimas: `$${a} - ${b} = ${a - b}$ mm.`,
      }),

    // 4. Metrais
    () => {
      const m = atsitiktinis(4, 12)
      const nukirpo = atsitiktinis(1, m - 1)
      return uzdavinys('ilgio-uzdaviniai-2', {
        klausimas: `Kelias ${m} km. Nuėjo ${nukirpo} km. Kiek kilometrų liko?`,
        atsakymas: String(m - nukirpo),
        atsakymasRodymui: `$${m - nukirpo}$ km`,
        sprendimas: `$${m} - ${nukirpo} = ${m - nukirpo}$ km.`,
      })
    },

    // 5. Su vienetų keitimu
    () => {
      const cm = atsitiktinis(3, 9)
      const mm = atsitiktinis(10, 80)
      return uzdavinys('ilgio-uzdaviniai-2', {
        klausimas: `Viena juostelė ${cm} cm, kita — ${mm} mm. Kiek milimetrų jos kartu?`,
        atsakymas: String(cm * 10 + mm),
        atsakymasRodymui: `$${cm * 10 + mm}$ mm`,
        sprendimas: `${cm} cm yra ${cm * 10} mm: $${cm * 10} + ${mm} = ${cm * 10 + mm}$ mm.`,
      })
    },
  ])
}

// ── Tyrimas su ilgio matavimo vienetais ─────────────────────────────────────

const A_ILGIO_TYRIMAS = [
  {
    klausimas: 'Kuris pieštukas ilgiausias?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — 17 cm',
    sprendimas: 'Ilgiausias tas, kurio skaičius didžiausias.',
  },
] as const

export const ilgioTyrimas: Generatorius = () =>
  suBandymais(kurkIlgioTyrima, A_ILGIO_TYRIMAS, 'ilgio-tyrimas')

function kurkIlgioTyrima(): Uzdavinys | null {
  const vardai = sumaisyk([...VARDAI]).slice(0, 3)
  const ilgiai = sumaisyk([...Array(15).keys()].map((i) => i + 8)).slice(0, 3)
  if (new Set(ilgiai).size < 3) return null
  const duom = vardai.map((v, i) => ({ vardas: v, cm: ilgiai[i] }))
  const ilgiausias = duom.reduce((a, b) => (b.cm > a.cm ? b : a))
  const trumpiausias = duom.reduce((a, b) => (b.cm < a.cm ? b : a))
  const sarasas = duom.map((d) => `${d.vardas} — ${d.cm} cm`).join(', ')

  return variacija([
    // 1. Kuris ilgiausias
    () =>
      pasirinkimoUzdavinys(naujasId('ilgio-tyrimas'), 'ilgio-tyrimas', {
        klausimas: `Vaikų žingsnių ilgiai: ${sarasas}. Kas turi ilgiausią žingsnį?`,
        variantai: [
          ilgiausias.vardas,
          ...duom.filter((d) => d.vardas !== ilgiausias.vardas).map((d) => d.vardas),
        ],
        teisingas: 0,
        sprendimas: `Didžiausias ilgis yra ${ilgiausias.cm} cm.`,
        brezinys: stulpeliai(duom.map((d) => ({ vardas: d.vardas, kiek: d.cm }))),
      }),

    // 2. Kuris trumpiausias
    () =>
      pasirinkimoUzdavinys(naujasId('ilgio-tyrimas'), 'ilgio-tyrimas', {
        klausimas: `Pieštukų ilgiai: ${sarasas}. Kuris trumpiausias?`,
        variantai: [
          trumpiausias.vardas,
          ...duom.filter((d) => d.vardas !== trumpiausias.vardas).map((d) => d.vardas),
        ],
        teisingas: 0,
        sprendimas: `Mažiausias ilgis yra ${trumpiausias.cm} cm.`,
        brezinys: stulpeliai(duom.map((d) => ({ vardas: d.vardas, kiek: d.cm }))),
      }),

    // 3. Koks skirtumas
    () =>
      uzdavinys('ilgio-tyrimas', {
        klausimas: `Matavimai: ${sarasas}. Keliais centimetrais ilgiausias skiriasi nuo trumpiausio?`,
        atsakymas: String(ilgiausias.cm - trumpiausias.cm),
        atsakymasRodymui: `$${ilgiausias.cm - trumpiausias.cm}$ cm`,
        sprendimas: `$${ilgiausias.cm} - ${trumpiausias.cm} = ${ilgiausias.cm - trumpiausias.cm}$ cm.`,
      }),

    // 4. Koks tyrimo klausimas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('ilgio-tyrimas'), 'ilgio-tyrimas', {
        klausimas: 'Koks klausimas tinka ilgio tyrimui?',
        variantai: [
          'Kuris klasės daiktas ilgiausias?',
          'Kokios spalvos yra daiktai?',
          'Kiek daiktų yra klasėje?',
        ],
        teisingas: 0,
        sprendimas: 'Ilgio tyrimo klausimas turi klausti apie ilgį.',
      }),

    // 5. Surikiuoti matavimus
    () =>
      eiliskumoUzdavinys(naujasId('ilgio-tyrimas'), 'ilgio-tyrimas', {
        klausimas: 'Surikiuok išmatuotus ilgius nuo trumpiausio iki ilgiausio.',
        teisingaEile: duom
          .map((d) => d.cm)
          .sort((a, b) => a - b)
          .map((c) => `${c} cm`),
        sprendimas: 'Ilgiai rikiuojami pagal skaičių dydį.',
      }),
  ])
}

// ── Kokį atstumą nuskrieja skraidyklė? ──────────────────────────────────────

const A_SKRAIDYKLE = [
  {
    klausimas: 'Kuris bandymas tolimiausias?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — 6 m',
    sprendimas: 'Toliausiai nuskriejo tas, kurio skaičius didžiausias.',
  },
] as const

export const skraidykle: Generatorius = () => suBandymais(kurkSkraidykle, A_SKRAIDYKLE, 'skraidykle')

function kurkSkraidykle(): Uzdavinys | null {
  const bandymai = sumaisyk([...Array(12).keys()].map((i) => i + 2)).slice(0, 4)
  if (new Set(bandymai).size < 4) return null
  const daugiausia = Math.max(...bandymai)
  const maziausia = Math.min(...bandymai)
  const sarasas = bandymai.map((m, i) => `${i + 1} bandymas — ${m} m`).join(', ')

  return variacija([
    // 1. Kuris bandymas tolimiausias
    () =>
      uzdavinys('skraidykle', {
        klausimas: `Skraidyklės bandymai: ${sarasas}. Kelintas bandymas tolimiausias? Parašyk skaičių.`,
        atsakymas: String(bandymai.indexOf(daugiausia) + 1),
        atsakymasRodymui: `$${bandymai.indexOf(daugiausia) + 1}$`,
        sprendimas: `Didžiausias atstumas yra ${daugiausia} m.`,
        brezinys: stulpeliai(bandymai.map((m, i) => ({ vardas: `${i + 1}`, kiek: m }))),
      }),

    // 2. Kuri nuskrido toliau
    () => {
      const [a, b] = bandymai
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId('skraidykle'), 'skraidykle', {
        klausimas: `Viena skraidyklė nuskrido ${a} m, kita — ${b} m. Kuri nuskrido toliau?`,
        variantai:
          a > b ? [`${a} m`, `${b} m`, 'vienodai'] : [`${b} m`, `${a} m`, 'vienodai'],
        teisingas: 0,
        sprendimas: `${Math.max(a, b)} m yra daugiau nei ${Math.min(a, b)} m.`,
      })
    },

    // 3. Keliais metrais daugiau
    () =>
      uzdavinys('skraidykle', {
        klausimas: `Skraidyklė pirmą kartą nuskrido ${bandymai[0]} m, antrą — ${bandymai[1]} m. Keliais metrais skiriasi?`,
        atsakymas: String(Math.abs(bandymai[0] - bandymai[1])),
        atsakymasRodymui: `$${Math.abs(bandymai[0] - bandymai[1])}$ m`,
        sprendimas: `$${Math.max(bandymai[0], bandymai[1])} - ${Math.min(bandymai[0], bandymai[1])} = ${Math.abs(bandymai[0] - bandymai[1])}$ m.`,
      }),

    // 4. Kiek iš viso
    () => {
      const suma = bandymai.reduce((s, m) => s + m, 0)
      return uzdavinys('skraidykle', {
        klausimas: `Skraidyklės bandymai: ${sarasas}. Kiek metrų ji nuskrido iš viso?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$ m`,
        sprendimas: `${bandymai.join(' + ')} = ${suma} m.`,
      })
    },

    // 5. Kuri išvada teisinga
    () =>
      pasirinkimoUzdavinys(naujasId('skraidykle'), 'skraidykle', {
        klausimas: `Bandymai: ${sarasas}. Kuri išvada teisinga?`,
        variantai: [
          `tolimiausias skrydis buvo ${daugiausia} m`,
          `tolimiausias skrydis buvo ${maziausia} m`,
          'visi skrydžiai buvo vienodi',
        ],
        teisingas: 0,
        sprendimas: `${daugiausia} m yra didžiausias iš visų bandymų.`,
      }),
  ])
}

// ═══ Masės ir talpos matavimas ══════════════════════════════════════════════

// ── Kas matuojama gramais? ──────────────────────────────────────────────────

const A_GRAMAI = [
  {
    klausimas: 'Ką patogu sverti gramais?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — obuolį',
    sprendimas: 'Gramais sveriami lengvi daiktai.',
  },
] as const

export const gramai: Generatorius = () => suBandymais(kurkGramus, A_GRAMAI, 'gramai')

function kurkGramus(): Uzdavinys | null {
  return variacija([
    // 1. Ką sverti gramais
    () =>
      pasirinkimoUzdavinys(naujasId('gramai'), 'gramai', {
        klausimas: 'Ką patogu sverti gramais?',
        variantai: ['obuolį', 'automobilį', 'sunkvežimį'],
        teisingas: 0,
        sprendimas: 'Gramais sveriami lengvi daiktai, o sunkius — kilogramais ar tonomis.',
      }),

    // 2. Koks vienetas tinka šokoladui
    () =>
      pasirinkimoUzdavinys(naujasId('gramai'), 'gramai', {
        klausimas: 'Šokolado plytelė sveria 100 … Įrašyk tinkamą vienetą.',
        variantai: ['g', 't', 'cm'],
        teisingas: 0,
        sprendimas: 'Šokolado plytelė yra apie 100 gramų.',
      }),

    // 3. Kiek gramų kilograme
    () =>
      uzdavinys('gramai', {
        klausimas: 'Užbaik: $1$ kg $=\\square$ g.',
        atsakymas: '1000',
        atsakymasRodymui: '$1000$ g',
        sprendimas: 'Viename kilograme yra 1000 gramų.',
      }),

    // 4. Kuris vienetas mažesnis
    () =>
      pasirinkimoUzdavinys(naujasId('gramai'), 'gramai', {
        klausimas: 'Kuris masės vienetas mažesnis?',
        variantai: ['gramas', 'kilogramas', 'tona'],
        teisingas: 0,
        sprendimas: '1 kg = 1000 g, o 1 t = 1000 kg.',
      }),

    // 5. Ką matuoja gramai
    () =>
      pasirinkimoUzdavinys(naujasId('gramai'), 'gramai', {
        klausimas: 'Ką matuojame gramais?',
        variantai: ['masę', 'ilgį', 'laiką'],
        teisingas: 0,
        sprendimas: 'Gramas ir kilogramas yra masės matavimo vienetai.',
        brezinys: svarstykliuCiferblatas(400),
      }),
  ])
}

// ── Kokią masę rodo svarstyklės? ────────────────────────────────────────────

const A_SVARSTYKLES = [
  {
    klausimas: 'Svarstyklės rodo 450 g. Kokia daikto masė?',
    atsakymas: '450',
    atsakymasRodymui: '$450$ g',
    sprendimas: 'Rodyklė sustojo ties 450 g padala.',
  },
] as const

export const svarstykliuRodmuo: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSvarstykles(sritis), A_SVARSTYKLES, 'svarstykliu-rodmuo')

/**
 * Sveriami vaisiai ir daržovės.
 *
 * Vadovėlio užduotis lygina būtent juos, o ne abstrakčius „daiktus“: mokinys
 * mato, kad bananas ir obuolys sveria skirtingai, ir tai jam suprantama.
 */
const SVERIAMI = [
  { kas: 'obuolys' as const, v: 'obuolys', k: 'obuolio' },
  { kas: 'kriause' as const, v: 'kriaušė', k: 'kriaušės' },
  { kas: 'bananas' as const, v: 'bananas', k: 'banano' },
  { kas: 'morka' as const, v: 'morka', k: 'morkos' },
  { kas: 'vysnia' as const, v: 'vyšnia', k: 'vyšnios' },
] as const

function kurkSvarstykles(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  // Visa skalė, o ne tik pirmasis puslankis: jei rodmenys neviršytų 450 g,
  // rodyklė niekada neatsidurtų kairėje ciferblato pusėje ir mokinys
  // nepamatytų, kaip atrodo 700 ar 900 gramų. Sumos pavidalai patys tikrina,
  // ar bendra masė telpa į sritį.
  const a = atsitiktinis(1, 18) * 50
  const b = atsitiktinis(1, 18) * 50
  const [kaire, desine] = sumaisyk([...SVERIAMI]).slice(0, 2)

  return variacija([
    // 0a. Nustatyk, kiek sveria kiekvienas, ir palygink
    () => {
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId('svarstykliu-rodmuo'), 'svarstykliu-rodmuo', {
        klausimas: `Nustatyk, kiek kas sveria. Koks ženklas tinka langelyje: $\\square$?`,
        variantai: ['<', '>', '='],
        teisingas: a < b ? 0 : 1,
        sprendimas: `Kairėje ${kaire.v} — ${a} g, dešinėje ${desine.v} — ${b} g, tad ${Math.max(a, b)} didesnis.`,
        brezinys: dviSvarstykles({ kas: kaire.kas, gramai: a }, { kas: desine.kas, gramai: b }),
      })
    },

    // 0b. Kas sveria daugiau
    () => {
      if (a === b) return null
      const sunkesnis = a > b ? kaire : desine
      const lengvesnis = a > b ? desine : kaire
      return pasirinkimoUzdavinys(naujasId('svarstykliu-rodmuo'), 'svarstykliu-rodmuo', {
        klausimas: `Kas sveria daugiau — ${kaire.v} ar ${desine.v}?`,
        variantai: [sunkesnis.v, lengvesnis.v, 'abu vienodai'],
        teisingas: 0,
        sprendimas: `${sunkesnis.v[0].toUpperCase()}${sunkesnis.v.slice(1)} sveria ${Math.max(a, b)} g, o ${lengvesnis.v} — ${Math.min(a, b)} g.`,
        brezinys: dviSvarstykles({ kas: kaire.kas, gramai: a }, { kas: desine.kas, gramai: b }),
      })
    },

    // 0c. Kiek sveria kairysis daiktas
    () =>
      uzdavinys('svarstykliu-rodmuo', {
        klausimas: `Kiek gramų sveria ${kaire.v}?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ g`,
        sprendimas: `Kairiųjų svarstyklių rodyklė sustojo ties ${a} g padala.`,
        brezinys: dviSvarstykles({ kas: kaire.kas, gramai: a }, { kas: desine.kas, gramai: b }),
      }),

    // 0d. Keliais gramais skiriasi
    () => {
      if (a === b) return null
      return uzdavinys('svarstykliu-rodmuo', {
        klausimas: `Keliais gramais skiriasi ${kaire.k} ir ${desine.k} masės?`,
        atsakymas: String(Math.abs(a - b)),
        atsakymasRodymui: `$${Math.abs(a - b)}$ g`,
        sprendimas: `$${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(a - b)}$ g.`,
        brezinys: dviSvarstykles({ kas: kaire.kas, gramai: a }, { kas: desine.kas, gramai: b }),
      })
    },

    // 0e. Kokia bendra masė
    () => {
      if (a + b > maks) return null
      return uzdavinys('svarstykliu-rodmuo', {
        klausimas: `Kokia bendra ${kaire.k} ir ${desine.k} masė?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ g`,
        sprendimas: `$${a} + ${b} = ${a + b}$ g.`,
        brezinys: dviSvarstykles({ kas: kaire.kas, gramai: a }, { kas: desine.kas, gramai: b }),
      })
    },

    // 1. Kokia masė
    () =>
      uzdavinys('svarstykliu-rodmuo', {
        klausimas: `Svarstyklės rodo ${a} g. Kokia daikto masė?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ g`,
        sprendimas: `Rodyklė sustojo ties ${a} g padala.`,
        brezinys: svarstykliuCiferblatas(a),
      }),

    // 2. Kuris rodmuo didesnis
    () => {
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId('svarstykliu-rodmuo'), 'svarstykliu-rodmuo', {
        klausimas: `Vienos svarstyklės rodo ${a} g, kitos — ${b} g. Kuris rodmuo didesnis?`,
        variantai:
          a > b ? [`${a} g`, `${b} g`, 'vienodi'] : [`${b} g`, `${a} g`, 'vienodi'],
        teisingas: 0,
        sprendimas: `${Math.max(a, b)} g yra daugiau nei ${Math.min(a, b)} g.`,
      })
    },

    // 3. Bendra masė
    () => {
      if (a + b > maks) return null
      return uzdavinys('svarstykliu-rodmuo', {
        klausimas: `Vienas paketas sveria ${a} g, kitas — ${b} g. Kokia jų bendra masė?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ g`,
        sprendimas: `$${a} + ${b} = ${a + b}$ g.`,
      })
    },

    // 4. Trečiojo daikto masė
    () => {
      const bendra = a + b
      if (bendra > maks) return null
      return uzdavinys('svarstykliu-rodmuo', {
        klausimas: `Citrina sveria ${a} g, o citrina ir slyva kartu — ${bendra} g. Kokia slyvos masė?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ g`,
        sprendimas: `$${bendra} - ${a} = ${b}$ g.`,
        brezinys: svarstykliuCiferblatas(bendra),
      })
    },

    // 5. Keliais gramais sunkesnis
    () => {
      if (a === b) return null
      return uzdavinys('svarstykliu-rodmuo', {
        klausimas: `Vienas vaisius sveria ${a} g, kitas — ${b} g. Keliais gramais skiriasi jų masės?`,
        atsakymas: String(Math.abs(a - b)),
        atsakymasRodymui: `$${Math.abs(a - b)}$ g`,
        sprendimas: `$${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(a - b)}$ g.`,
      })
    },
  ])
}

// ── Kas matuojama tonomis? ──────────────────────────────────────────────────

const A_TONOS = [
  {
    klausimas: 'Ką svertum tonomis?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — sunkvežimį',
    sprendimas: 'Tonomis sveriami labai sunkūs daiktai.',
  },
] as const

export const tonos: Generatorius = () => suBandymais(kurkTonas, A_TONOS, 'tonos')

function kurkTonas(): Uzdavinys | null {
  const t = atsitiktinis(2, 9)

  return variacija([
    // 1. Ką sverti tonomis
    () =>
      pasirinkimoUzdavinys(naujasId('tonos'), 'tonos', {
        klausimas: 'Ką patogu sverti tonomis?',
        variantai: ['sunkvežimį', 'obuolį', 'pieštuką'],
        teisingas: 0,
        sprendimas: 'Tonomis sveriami labai sunkūs daiktai — mašinos, kroviniai.',
      }),

    // 2. Dramblio masė
    () =>
      pasirinkimoUzdavinys(naujasId('tonos'), 'tonos', {
        klausimas: `Dramblys sveria apie ${t} … Įrašyk tinkamą vienetą.`,
        variantai: ['t', 'g', 'cm'],
        teisingas: 0,
        sprendimas: 'Dramblys sveria kelias tonas.',
      }),

    // 3. Kiek kilogramų tonoje
    () =>
      uzdavinys('tonos', {
        klausimas: 'Užbaik: $1$ t $=\\square$ kg.',
        atsakymas: '1000',
        atsakymasRodymui: '$1000$ kg',
        sprendimas: 'Vienoje tonoje yra 1000 kilogramų.',
      }),

    // 4. Kuris vienetas didžiausias
    () =>
      pasirinkimoUzdavinys(naujasId('tonos'), 'tonos', {
        klausimas: 'Kuris masės vienetas didžiausias?',
        variantai: ['tona', 'kilogramas', 'gramas'],
        teisingas: 0,
        sprendimas: '1 t = 1000 kg, o 1 kg = 1000 g.',
      }),

    // 5. Surikiuoti vienetus
    () =>
      eiliskumoUzdavinys(naujasId('tonos'), 'tonos', {
        klausimas: 'Surikiuok masės vienetus nuo mažiausio iki didžiausio.',
        teisingaEile: ['g', 'kg', 't'],
        sprendimas: '1 kg = 1000 g, 1 t = 1000 kg.',
      }),
  ])
}

// ── Uždaviniai su masės matavimo vienetais ──────────────────────────────────

const A_MASES_UZD = [
  {
    klausimas: 'Maišas sveria 8 kg, kitas 5 kg. Kiek kilogramų jie sveria kartu?',
    atsakymas: '13',
    atsakymasRodymui: '$13$ kg',
    sprendimas: '$8 + 5 = 13$ kg.',
  },
] as const

export const masesUzdaviniai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkMasesUzd(sritis), A_MASES_UZD, 'mases-uzdaviniai')

function kurkMasesUzd(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(5, 15)
  const b = atsitiktinis(2, a - 1)
  const g1 = atsitiktinis(1, 9) * 50
  const g2 = atsitiktinis(1, 9) * 50
  if (g1 + g2 > maks) return null

  return variacija([
    // 1. Bendra masė kilogramais
    () =>
      uzdavinys('mases-uzdaviniai', {
        klausimas: `Vienas maišas sveria ${a} kg, kitas — ${b} kg. Kiek kilogramų jie sveria kartu?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ kg`,
        sprendimas: `$${a} + ${b} = ${a + b}$ kg.`,
      }),

    // 1b. Kiek rodo svarstyklės gramais
    () =>
      uzdavinys('mases-uzdaviniai', {
        klausimas: 'Kiek gramų rodo svarstyklės?',
        atsakymas: String(g1),
        atsakymasRodymui: `$${g1}$ g`,
        sprendimas: `Rodyklė sustojo ties ${g1} g padala.`,
        brezinys: svarstykliuCiferblatas(g1),
      }),

    // 2. Keliais kilogramais sunkesnis
    () =>
      uzdavinys('mases-uzdaviniai', {
        klausimas: `Arbūzas sveria ${a} kg, melionas — ${b} kg. Keliais kilogramais arbūzas sunkesnis?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ kg`,
        sprendimas: `$${a} - ${b} = ${a - b}$ kg.`,
      }),

    // 3. Kiek liko
    () =>
      uzdavinys('mases-uzdaviniai', {
        klausimas: `Buvo ${a} kg obuolių, pardavė ${b} kg. Kiek kilogramų liko?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ kg`,
        sprendimas: `$${a} - ${b} = ${a - b}$ kg.`,
      }),

    // 4. Bendra masė gramais
    () =>
      uzdavinys('mases-uzdaviniai', {
        klausimas: `Du paketai sveria ${g1} g ir ${g2} g. Kokia jų bendra masė?`,
        atsakymas: String(g1 + g2),
        atsakymasRodymui: `$${g1 + g2}$ g`,
        sprendimas: `$${g1} + ${g2} = ${g1 + g2}$ g.`,
      }),

    // 5. Kelių maišų masė
    () => {
      const kiek = atsitiktinis(2, 5)
      if (a * kiek > maks) return null
      return uzdavinys('mases-uzdaviniai', {
        klausimas: `Vienas maišas sveria ${a} kg. Kiek sveria ${kiek} tokie maišai?`,
        atsakymas: String(a * kiek),
        atsakymasRodymui: `$${a * kiek}$ kg`,
        sprendimas: `$${kiek} \\cdot ${a} = ${a * kiek}$ kg.`,
      })
    },
  ])
}

// ── Tyrimas su masės matavimo vienetais ─────────────────────────────────────

const A_MASES_TYRIMAS = [
  {
    klausimas: 'Kuris daiktas sunkiausias?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — 980 g',
    sprendimas: 'Sunkiausias tas, kurio masė didžiausia.',
  },
] as const

export const masesTyrimas: Generatorius = () =>
  suBandymais(kurkMasesTyrima, A_MASES_TYRIMAS, 'mases-tyrimas')

const DARZOVES = ['brokolis', 'agurkas', 'morka', 'pomidoras', 'cukinija'] as const

function kurkMasesTyrima(): Uzdavinys | null {
  const vardai = sumaisyk([...DARZOVES]).slice(0, 3)
  const mases = sumaisyk([...Array(9).keys()].map((i) => (i + 1) * 100)).slice(0, 3)
  if (new Set(mases).size < 3) return null
  const duom = vardai.map((v, i) => ({ vardas: v, g: mases[i] }))
  const sunkiausias = duom.reduce((a, b) => (b.g > a.g ? b : a))
  const lengviausias = duom.reduce((a, b) => (b.g < a.g ? b : a))
  const sarasas = duom.map((d) => `${d.vardas} — ${d.g} g`).join(', ')

  return variacija([
    // 1. Kuris sunkiausias
    () =>
      pasirinkimoUzdavinys(naujasId('mases-tyrimas'), 'mases-tyrimas', {
        klausimas: `Pasverta: ${sarasas}. Kuris daiktas sunkiausias?`,
        variantai: [
          sunkiausias.vardas,
          ...duom.filter((d) => d.vardas !== sunkiausias.vardas).map((d) => d.vardas),
        ],
        teisingas: 0,
        sprendimas: `Didžiausia masė yra ${sunkiausias.g} g.`,
        brezinys: stulpeliai(duom.map((d) => ({ vardas: d.vardas, kiek: d.g / 100 }))),
      }),

    // 2. Kuris lengviausias
    () =>
      pasirinkimoUzdavinys(naujasId('mases-tyrimas'), 'mases-tyrimas', {
        klausimas: `Pasverta: ${sarasas}. Kuris daiktas lengviausias?`,
        variantai: [
          lengviausias.vardas,
          ...duom.filter((d) => d.vardas !== lengviausias.vardas).map((d) => d.vardas),
        ],
        teisingas: 0,
        sprendimas: `Mažiausia masė yra ${lengviausias.g} g.`,
        brezinys: stulpeliai(duom.map((d) => ({ vardas: d.vardas, kiek: d.g / 100 }))),
      }),

    // 3. Koks skirtumas
    () =>
      uzdavinys('mases-tyrimas', {
        klausimas: `Pasverta: ${sarasas}. Keliais gramais sunkiausias skiriasi nuo lengviausio?`,
        atsakymas: String(sunkiausias.g - lengviausias.g),
        atsakymasRodymui: `$${sunkiausias.g - lengviausias.g}$ g`,
        sprendimas: `$${sunkiausias.g} - ${lengviausias.g} = ${sunkiausias.g - lengviausias.g}$ g.`,
      }),

    // 4. Koks tyrimo klausimas
    () =>
      pasirinkimoUzdavinys(naujasId('mases-tyrimas'), 'mases-tyrimas', {
        klausimas: 'Koks klausimas tinka masės tyrimui?',
        variantai: [
          'Kuris klasės daiktas sunkiausias?',
          'Kokios spalvos yra daiktai?',
          'Kiek daiktų telpa į dėžę?',
        ],
        teisingas: 0,
        sprendimas: 'Masės tyrimo klausimas turi klausti apie svorį.',
      }),

    // 5. Surikiuoti mažėjimo tvarka
    () =>
      eiliskumoUzdavinys(naujasId('mases-tyrimas'), 'mases-tyrimas', {
        klausimas: 'Surašyk mases mažėjimo tvarka.',
        teisingaEile: duom
          .map((d) => d.g)
          .sort((a, b) => b - a)
          .map((g) => `${g} g`),
        sprendimas: 'Mažėjimo tvarka reiškia nuo didžiausios masės iki mažiausios.',
      }),
  ])
}

// ── Talpos matavimo vienetai ────────────────────────────────────────────────

const A_TALPA = [
  {
    klausimas: 'Kuo matuojame vandens kiekį butelyje?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — litrais',
    sprendimas: 'Skysčio kiekis matuojamas litrais.',
  },
] as const

export const talposVienetai: Generatorius = () =>
  suBandymais(kurkTalpa, A_TALPA, 'talpos-vienetai')

function kurkTalpa(): Uzdavinys | null {
  return variacija([
    // 1. Kuo matuojame skystį
    () =>
      pasirinkimoUzdavinys(naujasId('talpos-vienetai'), 'talpos-vienetai', {
        klausimas: 'Kuo matuojame vandens kiekį butelyje?',
        variantai: ['litrais', 'kilogramais', 'centimetrais'],
        teisingas: 0,
        sprendimas: 'Skysčio kiekis matuojamas litrais, o labai maži kiekiai — mililitrais.',
        brezinys: matavimoIndas(3, 5),
      }),

    // 2. Pieno pakelis
    () =>
      pasirinkimoUzdavinys(naujasId('talpos-vienetai'), 'talpos-vienetai', {
        klausimas: 'Pieno pakelis gali būti 1 … Įrašyk tinkamą vienetą.',
        variantai: ['l', 'kg', 'cm'],
        teisingas: 0,
        sprendimas: 'Pieno kiekis matuojamas litrais.',
      }),

    // 3. Kiek mililitrų litre
    () =>
      uzdavinys('talpos-vienetai', {
        klausimas: 'Užbaik: $1$ l $=\\square$ ml.',
        atsakymas: '1000',
        atsakymasRodymui: '$1000$ ml',
        sprendimas: 'Viename litre yra 1000 mililitrų.',
      }),

    // 4. Koks vienetas tinka kibirui
    () =>
      pasirinkimoUzdavinys(naujasId('talpos-vienetai'), 'talpos-vienetai', {
        klausimas: 'Kokiu vienetu užrašysi kibiro talpą?',
        variantai: ['l', 'cm', 'g'],
        teisingas: 0,
        sprendimas: 'Kibiras talpina kelis litrus.',
      }),

    // 5. Ką matuoja litras
    () =>
      pasirinkimoUzdavinys(naujasId('talpos-vienetai'), 'talpos-vienetai', {
        klausimas: 'Ką matuojame litrais?',
        variantai: ['skysčio kiekį', 'daikto ilgį', 'daikto masę'],
        teisingas: 0,
        sprendimas: 'Litras yra talpos matavimo vienetas.',
      }),
  ])
}

// ── Uždaviniai su talpos matavimo vienetais ─────────────────────────────────

const A_TALPOS_UZD = [
  {
    klausimas: 'Ąsotyje buvo 5 l vandens. Išpylė 2 l. Kiek liko?',
    atsakymas: '3',
    atsakymasRodymui: '$3$ l',
    sprendimas: '$5 - 2 = 3$ l.',
  },
] as const

export const talposUzdaviniai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTalposUzd(sritis), A_TALPOS_UZD, 'talpos-uzdaviniai')

function kurkTalposUzd(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(4, 12)
  const b = atsitiktinis(1, a - 1)
  const ml = atsitiktinis(1, 9) * 100
  if (ml * 2 > maks) return null

  return variacija([
    // 1. Kiek liko išpylus
    () =>
      uzdavinys('talpos-uzdaviniai', {
        klausimas: `Ąsotyje buvo ${a} l vandens. Išpylė ${b} l. Kiek litrų liko?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ l`,
        sprendimas: `$${a} - ${b} = ${a - b}$ l.`,
        brezinys: matavimoIndas(a - b, a),
      }),

    // 2. Kiek iš viso
    () =>
      uzdavinys('talpos-uzdaviniai', {
        klausimas: `Viename inde ${b} l, kitame — ${a} l. Kiek litrų iš viso?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ l`,
        sprendimas: `$${a} + ${b} = ${a + b}$ l.`,
      }),

    // 3. Kiek dar telpa
    () =>
      uzdavinys('talpos-uzdaviniai', {
        klausimas: `Indo talpa ${a} l. Įpilta ${b} l. Kiek litrų dar telpa?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ l`,
        sprendimas: `$${a} - ${b} = ${a - b}$ l.`,
      }),

    // 4. Keli vienodi buteliai
    () => {
      const kiek = atsitiktinis(2, 5)
      const vieno = atsitiktinis(1, 3)
      return uzdavinys('talpos-uzdaviniai', {
        klausimas: `${kiek} buteliai po ${vieno} l. Kiek litrų juose kartu?`,
        atsakymas: String(kiek * vieno),
        atsakymasRodymui: `$${kiek * vieno}$ l`,
        sprendimas: `$${kiek} \\cdot ${vieno} = ${kiek * vieno}$ l.`,
      })
    },

    // 5. Mililitrais
    () =>
      uzdavinys('talpos-uzdaviniai', {
        klausimas: `Stiklinėje ${ml} ml vandens, kitoje — tiek pat. Kiek mililitrų abiejose?`,
        atsakymas: String(ml * 2),
        atsakymasRodymui: `$${ml * 2}$ ml`,
        sprendimas: `$${ml} + ${ml} = ${ml * 2}$ ml.`,
      }),
  ])
}

// ═══ Algoritmai ═════════════════════════════════════════════════════════════

const PLOTIS = 5
const AUKSTIS = 4

const KOMANDOS = [
  { zenklas: '↑', dx: 0, dy: -1, vardas: 'aukštyn' },
  { zenklas: '↓', dx: 0, dy: 1, vardas: 'žemyn' },
  { zenklas: '→', dx: 1, dy: 0, vardas: 'į dešinę' },
  { zenklas: '←', dx: -1, dy: 0, vardas: 'į kairę' },
] as const

/** Kelias tinklelyje be grįžimų atgal. */
function kurkKelia(pradzia: Taskas, zingsniu: number) {
  const takas = [pradzia]
  const zenklai: string[] = []
  let dabar = pradzia
  let ankstesnis: (typeof KOMANDOS)[number] | null = null
  for (let i = 0; i < zingsniu; i += 1) {
    const galimi = KOMANDOS.filter((k) => {
      const x = dabar.x + k.dx
      const y = dabar.y + k.dy
      if (x < 0 || x >= PLOTIS || y < 0 || y >= AUKSTIS) return false
      return !ankstesnis || k.dx !== -ankstesnis.dx || k.dy !== -ankstesnis.dy
    })
    if (galimi.length === 0) return null
    const k = pasirink(galimi)
    ankstesnis = k
    dabar = { x: dabar.x + k.dx, y: dabar.y + k.dy }
    takas.push(dabar)
    zenklai.push(k.zenklas)
  }
  if (dabar.x === pradzia.x && dabar.y === pradzia.y) return null
  return { takas, zenklai, galas: dabar }
}

// ── Ką vadiname pasirinkimo komanda? ────────────────────────────────────────

const A_PASIRINKIMAS = [
  {
    klausimas: 'Kuri komanda yra pasirinkimo komanda?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — jei… tada…',
    sprendimas: 'Pasirinkimo komanda tikrina sąlygą ir tik tada veikia.',
  },
] as const

export const pasirinkimoKomanda: Generatorius = () =>
  suBandymais(kurkPasirinkima, A_PASIRINKIMAS, 'pasirinkimo-komanda')

function kurkPasirinkima(): Uzdavinys | null {
  return variacija([
    // 1. Kuri komanda yra pasirinkimo
    () =>
      pasirinkimoUzdavinys(naujasId('pasirinkimo-komanda'), 'pasirinkimo-komanda', {
        klausimas: 'Kuri komanda yra pasirinkimo komanda?',
        variantai: ['jei… tada…', 'eik pirmyn', 'pasuk į dešinę'],
        teisingas: 0,
        sprendimas: 'Pasirinkimo komanda pirmiausia patikrina sąlygą ir tik tada nusprendžia, ką daryti.',
      }),

    // 2. Ką darys robotas prie raudono langelio
    () =>
      pasirinkimoUzdavinys(naujasId('pasirinkimo-komanda'), 'pasirinkimo-komanda', {
        klausimas:
          'Taisyklė: „Jei langelis raudonas, eik į dešinę, jei ne — eik pirmyn.“ Ką robotas darys prie raudono langelio?',
        variantai: ['eis į dešinę', 'eis pirmyn', 'sustos'],
        teisingas: 0,
        sprendimas: 'Sąlyga tenkinama, tad vykdoma pirmoji nurodyta komanda.',
      }),

    // 3. Ką darys, kai sąlyga netenkinama
    () =>
      pasirinkimoUzdavinys(naujasId('pasirinkimo-komanda'), 'pasirinkimo-komanda', {
        klausimas:
          'Taisyklė: „Jei langelis raudonas, eik į dešinę, jei ne — eik pirmyn.“ Ką robotas darys prie mėlyno langelio?',
        variantai: ['eis pirmyn', 'eis į dešinę', 'sustos'],
        teisingas: 0,
        sprendimas: 'Sąlyga netenkinama, tad vykdoma antroji dalis — „jei ne“.',
      }),

    // 4. Ką darys pamatęs žvaigždę
    () =>
      pasirinkimoUzdavinys(naujasId('pasirinkimo-komanda'), 'pasirinkimo-komanda', {
        klausimas: 'Taisyklė: „Jei matai žvaigždę — sustok.“ Ką robotas darys pamatęs žvaigždę?',
        variantai: ['sustos', 'eis toliau', 'pasuks atgal'],
        teisingas: 0,
        sprendimas: 'Sąlyga įvykdyta, tad atliekamas nurodytas veiksmas.',
      }),

    // 5. Kam reikia pasirinkimo komandos
    () =>
      pasirinkimoUzdavinys(naujasId('pasirinkimo-komanda'), 'pasirinkimo-komanda', {
        klausimas: 'Kam programoje reikalinga pasirinkimo komanda?',
        variantai: [
          'kad robotas elgtųsi skirtingai skirtingose situacijose',
          'kad programa būtų ilgesnė',
          'kad robotas judėtų greičiau',
        ],
        teisingas: 0,
        sprendimas: 'Be sąlygos robotas visada darytų tą patį, nesvarbu, ką sutiktų kelyje.',
      }),
  ])
}

// ── Kaip sukurti ir vykdyti nuorodų algoritmą? ──────────────────────────────

const A_NUORODOS = [
  {
    klausimas: 'Kiek komandų yra nubrėžtame kelyje?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Kiekvienas žingsnis per langelį yra viena komanda.',
  },
] as const

export const nuoroduAlgoritmas: Generatorius = () =>
  suBandymais(kurkNuorodas, A_NUORODOS, 'nuorodu-algoritmas')

function kurkNuorodas(): Uzdavinys | null {
  const pradzia = { x: 0, y: AUKSTIS - 1 }
  const kelias = kurkKelia(pradzia, atsitiktinis(3, 5))
  if (!kelias) return null
  const langeliai = [
    { x: pradzia.x, y: pradzia.y, zyme: 'P' },
    { x: kelias.galas.x, y: kelias.galas.y, zyme: 'N' },
  ]
  const komandos = kelias.zenklai.join(' ')

  return variacija([
    // 1. Kiek komandų
    () =>
      uzdavinys('nuorodu-algoritmas', {
        klausimas: 'Kiek komandų yra nubrėžtame kelyje nuo P iki N?',
        atsakymas: String(kelias.zenklai.length),
        atsakymasRodymui: `$${kelias.zenklai.length}$`,
        sprendimas: `Kelias eina per ${kelias.zenklai.length} langelius, tad komandų tiek pat.`,
        brezinys: planas(PLOTIS, AUKSTIS, langeliai, kelias.takas),
      }),

    // 2. Sudėlioti komandas
    () => {
      // Rikiavimo uždavinys turi prasmę tik tada, kai visos komandos skirtingos.
      // Kelyje „→ → →“ mokiniui būtų pateiktos trys vienodos rodyklės, ir bet
      // kokia tvarka būtų teisinga — uždavinys nieko nebetikrintų.
      if (new Set(kelias.zenklai).size !== kelias.zenklai.length) return null
      return eiliskumoUzdavinys(naujasId('nuorodu-algoritmas'), 'nuorodu-algoritmas', {
        klausimas: 'Sudėk komandas tokia tvarka, kad robotas nueitų nuo P iki N.',
        teisingaEile: kelias.zenklai,
        sprendimas: `Teisinga tvarka: ${komandos}.`,
        brezinys: planas(PLOTIS, AUKSTIS, langeliai, kelias.takas),
      })
    },

    // 3. Kuri seka teisinga
    () => {
      const kita = sumaisyk(kelias.zenklai).join(' ')
      if (kita === komandos) return null
      const trecia = [...kelias.zenklai.slice(0, -1), pasirink(KOMANDOS).zenklas].join(' ')
      if (trecia === komandos || trecia === kita) return null
      return pasirinkimoUzdavinys(naujasId('nuorodu-algoritmas'), 'nuorodu-algoritmas', {
        klausimas: 'Kuri komandų seka nuveda nuo P iki N?',
        variantai: [komandos, kita, trecia],
        teisingas: 0,
        sprendimas: `Nubrėžtas kelias eina taip: ${komandos}.`,
        brezinys: planas(PLOTIS, AUKSTIS, langeliai, kelias.takas),
      })
    },

    // 4. Kokia pirmoji komanda
    () => {
      const pirma = kelias.zenklai[0]
      const kiti = KOMANDOS.filter((k) => k.zenklas !== pirma).slice(0, 2)
      return pasirinkimoUzdavinys(naujasId('nuorodu-algoritmas'), 'nuorodu-algoritmas', {
        klausimas: 'Kokia yra pirmoji nubrėžto kelio komanda?',
        variantai: [pirma, ...kiti.map((k) => k.zenklas)],
        teisingas: 0,
        sprendimas: `Kelias prasideda žingsniu ${pirma}.`,
        brezinys: planas(PLOTIS, AUKSTIS, langeliai, kelias.takas),
      })
    },

    // 5. Netinkamos komandos keitimas
    () => {
      if (kelias.zenklai.length < 3) return null
      const vieta = atsitiktinis(1, kelias.zenklai.length - 1)
      const teisinga = kelias.zenklai[vieta]
      const bloga = pasirink(KOMANDOS.filter((k) => k.zenklas !== teisinga)).zenklas
      const su = kelias.zenklai.map((z, i) => (i === vieta ? bloga : z)).join(' ')
      const kiti = KOMANDOS.filter((k) => k.zenklas !== teisinga).slice(0, 2)
      return pasirinkimoUzdavinys(naujasId('nuorodu-algoritmas'), 'nuorodu-algoritmas', {
        klausimas: `Sekoje ${su} viena komanda netinka. Kuo ją pakeisti?`,
        variantai: [teisinga, ...kiti.map((k) => k.zenklas)],
        teisingas: 0,
        sprendimas: `Pagal nubrėžtą kelią toje vietoje turi būti ${teisinga}.`,
        brezinys: planas(PLOTIS, AUKSTIS, langeliai, kelias.takas),
      })
    },
  ])
}

// ── Kaip kurti programą su „ScratchJr“? ─────────────────────────────────────

const A_SCRATCH2 = [
  {
    klausimas: 'Kiek blokų reikia, kad veikėjas paeitų 2 žingsnius į dešinę?',
    atsakymas: '2',
    atsakymasRodymui: '$2$',
    sprendimas: 'Vienas blokas — vienas žingsnis.',
  },
] as const

export const scratchJr2: Generatorius = () => suBandymais(kurkScratch2, A_SCRATCH2, 'scratch-jr-2')

function kurkScratch2(): Uzdavinys | null {
  const k = pasirink(KOMANDOS)
  const antra = pasirink(KOMANDOS.filter((x) => x.zenklas !== k.zenklas))
  const zingsniai = atsitiktinis(2, 5)

  return variacija([
    // 1. Kiek blokų reikia
    () =>
      uzdavinys('scratch-jr-2', {
        klausimas: `Kiek blokų ${k.zenklas} reikia, kad veikėjas paeitų ${zingsniai} žingsnius ${k.vardas}?`,
        atsakymas: String(zingsniai),
        atsakymasRodymui: `$${zingsniai}$`,
        sprendimas: `Vienas blokas — vienas žingsnis, tad reikia ${zingsniai} blokų.`,
      }),

    // 2. Kuri blokų seka tinka
    () => {
      const teisinga = `${k.zenklas} ${antra.zenklas}`
      const atvirkscia = `${antra.zenklas} ${k.zenklas}`
      if (teisinga === atvirkscia) return null
      return pasirinkimoUzdavinys(naujasId('scratch-jr-2'), 'scratch-jr-2', {
        klausimas: `Veikėjas turi pajudėti ${k.vardas}, o paskui ${antra.vardas}. Kuri blokų seka tinka?`,
        variantai: [teisinga, atvirkscia, `${antra.zenklas} ${antra.zenklas}`],
        teisingas: 0,
        sprendimas: `Blokai vykdomi iš eilės, tad pirmas turi būti ${k.zenklas}.`,
      })
    },

    // 3. Kas paleidžia programą
    () =>
      pasirinkimoUzdavinys(naujasId('scratch-jr-2'), 'scratch-jr-2', {
        klausimas: 'Kas paleidžia „ScratchJr“ programą?',
        variantai: ['žalia vėliavėlė', 'raudonas mygtukas', 'veikėjo spustelėjimas'],
        teisingas: 0,
        sprendimas: 'Paspaudus žalią vėliavėlę veikėjas pradeda vykdyti blokus.',
      }),

    // 4. Ko trūksta programoje
    () =>
      pasirinkimoUzdavinys(naujasId('scratch-jr-2'), 'scratch-jr-2', {
        klausimas: `Veikėjas turi pakilti aukštyn ir pasakyti „Labas“. Kokio bloko trūksta, jei jau yra ↑?`,
        variantai: ['kalbėjimo bloko', 'dar vieno ↑', 'žalios vėliavėlės'],
        teisingas: 0,
        sprendimas: 'Judėjimo blokas veikėjo neprakalbina — reikia atskiro kalbėjimo bloko.',
      }),

    // 5. Kokia tvarka vykdomi blokai
    () =>
      pasirinkimoUzdavinys(naujasId('scratch-jr-2'), 'scratch-jr-2', {
        klausimas: 'Kokia tvarka veikėjas vykdo blokus?',
        variantai: ['iš eilės, nuo kairės į dešinę', 'atsitiktine tvarka', 'nuo paskutinio'],
        teisingas: 0,
        sprendimas: 'Blokai vykdomi taip, kaip jie sudėti — vienas po kito.',
      }),
  ])
}
