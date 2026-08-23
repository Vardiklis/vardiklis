import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import {
  brezinuEile,
  daugiakampis,
  kampas,
  lauztes,
  lauztesTaskai,
  neDaugiakampis,
  planas,
  suAsimi,
  type Taskas,
} from './antroku-figuru-vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 2 klasės 4 tema „Plokščiosios figūros“.
 *
 * Potemės rėmėsi vyresnių klasių generatoriais: `figuros` duodavo įstrižaines
 * ir perimetrus, `kampai` — laipsnius ir pusiaukampines, `simetrija` — taškų
 * atvaizdavimą koordinačių plokštumoje, `logika` — 5–10 klasių teiginius,
 * `koordinates` — koordinačių ašis. Antrokui šioje temoje nieko skaičiuoti
 * nereikia: viskas remiasi atpažinimu.
 *
 * Vadovėlio apibrėžimai, kurių laikomasi visur:
 *   laužtė — figūra iš įvairiomis kryptimis sujungtų atkarpų;
 *   uždaroji laužtė — pradžios ir pabaigos taškai sutampa, ir ji vadinama
 *   daugiakampiu;
 *   kampas — du bendrą pradžią turintys spinduliai; bendra pradžia yra
 *   viršūnė, o patys spinduliai — kraštinės;
 *   taisyklingasis daugiakampis — visos kraštinės ir visi kampai lygūs.
 */

const KAMPU_VARDAI: Record<number, string> = {
  3: 'trikampis',
  4: 'keturkampis',
  5: 'penkiakampis',
  6: 'šešiakampis',
}

/** Tie patys pavadinimai kilmininku („taisyklingojo keturkampio kraštinė“). */
const KAMPU_KILM: Record<number, string> = {
  3: 'trikampio',
  4: 'keturkampio',
  5: 'penkiakampio',
  6: 'šešiakampio',
}

/** Ir galininku („teiginys apie keturkampį“). */
const KAMPU_GAL: Record<number, string> = {
  3: 'trikampį',
  4: 'keturkampį',
  5: 'penkiakampį',
  6: 'šešiakampį',
}

const KRASTINIU = { vns: 'kraštinę', dgs: 'kraštines', kilm: 'kraštinių' }
const KAMPU = { vns: 'kampą', dgs: 'kampus', kilm: 'kampų' }

// ── 4.1 Kas yra laužtė? ─────────────────────────────────────────────────────

const A_LAUZTE = [
  {
    klausimas: 'Iš kelių atkarpų sudaryta laužtė?',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Suskaičiuojamos atkarpos tarp gretimų taškų.',
  },
] as const

export const kasYraLauzte: Generatorius = () => suBandymais(kurkLauzte, A_LAUZTE, 'kas-yra-lauzte')

function kurkLauzte(): Uzdavinys | null {
  const atkarpu = atsitiktinis(3, 5)
  const uzdara = atsitiktinis(0, 1) === 1
  const taskai = lauztesTaskai(atkarpu, uzdara, atsitiktinis(0, 5))

  return variacija([
    // 1. Iš kelių atkarpų sudaryta
    () =>
      uzdavinys('kas-yra-lauzte', {
        klausimas: 'Iš kelių atkarpų sudaryta pavaizduota laužtė?',
        atsakymas: String(atkarpu),
        atsakymasRodymui: `$${atkarpu}$`,
        sprendimas: `Atkarpos skaičiuojamos tarp gretimų taškų — jų yra ${atkarpu}.`,
        brezinys: lauztes([{ taskai, uzdara }]),
      }),

    // 2. Uždaroji ar atviroji
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-lauzte'), 'kas-yra-lauzte', {
        klausimas: 'Kokia pavaizduota laužtė?',
        variantai: uzdara
          ? ['uždaroji', 'atviroji', 'tai ne laužtė']
          : ['atviroji', 'uždaroji', 'tai ne laužtė'],
        teisingas: 0,
        sprendimas: uzdara
          ? 'Laužtės pradžios ir pabaigos taškai sutampa, tad ji uždaroji.'
          : 'Laužtės pradžios ir pabaigos taškai nesutampa, tad ji atviroji.',
        brezinys: lauztes([{ taskai, uzdara }]),
      }),

    // 3. Kelinta laužtė uždaroji
    () => {
      const eile = sumaisyk([
        { taskai: lauztesTaskai(4, true, 1), uzdara: true },
        { taskai: lauztesTaskai(3, false, 2), uzdara: false },
        { taskai: lauztesTaskai(4, false, 4), uzdara: false },
      ])
      const nr = eile.findIndex((v) => v.uzdara) + 1
      return uzdavinys('kas-yra-lauzte', {
        klausimas: 'Kelinta laužtė yra uždaroji? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: 'Uždarosios laužtės pradžios ir pabaigos taškai sutampa.',
        brezinys: lauztes(eile),
      })
    },

    // 4. Kuri turi daugiau atkarpų
    () => {
      const a = atsitiktinis(3, 4)
      const b = atsitiktinis(5, 6)
      const eile = sumaisyk([
        { taskai: lauztesTaskai(a, false, 1), uzdara: false, kiek: a },
        { taskai: lauztesTaskai(b, false, 3), uzdara: false, kiek: b },
      ])
      const nr = eile.findIndex((v) => v.kiek === b) + 1
      return uzdavinys('kas-yra-lauzte', {
        klausimas: 'Kelinta laužtė turi daugiau atkarpų? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: `Viena laužtė sudaryta iš ${Math.min(a, b)} atkarpų, kita — iš ${Math.max(a, b)}.`,
        brezinys: lauztes(eile),
      })
    },

    // 5. Kas yra laužtė
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-lauzte'), 'kas-yra-lauzte', {
        klausimas: 'Kas vadinama laužte?',
        variantai: [
          'figūra iš įvairiomis kryptimis sujungtų atkarpų',
          'bet kokia išlenkta linija',
          'figūra, sudaryta tik iš apskritimų',
        ],
        teisingas: 0,
        sprendimas:
          'Laužtę sudaro atkarpos: prie vienos atkarpos pabaigos jungiama kitos atkarpos pradžia.',
      }),

    // 6. Kiek viršūnių turi laužtė
    () => {
      if (uzdara) return null
      return uzdavinys('kas-yra-lauzte', {
        klausimas: 'Kiek taškų pažymėta ant pavaizduotos laužtės?',
        atsakymas: String(atkarpu + 1),
        atsakymasRodymui: `$${atkarpu + 1}$`,
        sprendimas: `Atvirojoje laužtėje taškų yra vienu daugiau nei atkarpų: $${atkarpu} + 1 = ${atkarpu + 1}$.`,
        brezinys: lauztes([{ taskai, uzdara }]),
      })
    },
  ])
}

// ── 4.2 Kas yra kampas? ─────────────────────────────────────────────────────

const A_KAMPAS = [
  {
    klausimas: 'Kelintame brėžinyje pažymėtas kampas?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: 'Kampą sudaro du bendrą pradžią turintys spinduliai.',
  },
] as const

export const kasYraKampas: Generatorius = () => suBandymais(kurkKampa, A_KAMPAS, 'kas-yra-kampas')

function kurkKampa(): Uzdavinys | null {
  const laipsniai = pasirink([35, 55, 90, 120])
  const kitas = pasirink([35, 55, 90, 120].filter((x) => x !== laipsniai))

  return variacija([
    // 1. Kur pažymėtas kampas
    () => {
      const eile = sumaisyk([
        { br: kampas(laipsniai, 'A'), kampas: true },
        { br: kampas(0, 'B', false), kampas: false },
        { br: neDaugiakampis('apskritimas'), kampas: false },
      ])
      const nr = eile.findIndex((v) => v.kampas) + 1
      return uzdavinys('kas-yra-kampas', {
        klausimas: 'Kelintame brėžinyje pažymėtas kampas? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: 'Kampą sudaro du bendrą pradžią turintys spinduliai, o kampas žymimas lankeliu.',
        brezinys: brezinuEile(eile.map((v) => v.br)),
      })
    },

    // 2. Kaip vadinama bendra spindulių pradžia
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-kampas'), 'kas-yra-kampas', {
        klausimas: 'Kaip vadinama bendra kampo spindulių pradžia?',
        variantai: ['viršūnė', 'kraštinė', 'atkarpa'],
        teisingas: 0,
        sprendimas: 'Bendra pradžia yra kampo viršūnė, o patys spinduliai — kampo kraštinės.',
        brezinys: brezinuEile([kampas(laipsniai, 'A')]),
      }),

    // 3. Kaip vadinami kampo spinduliai
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-kampas'), 'kas-yra-kampas', {
        klausimas: 'Kaip vadinami kampą sudarantys spinduliai?',
        variantai: ['kraštinės', 'viršūnės', 'įstrižainės'],
        teisingas: 0,
        sprendimas: 'Spinduliai yra kampo kraštinės, o jų bendra pradžia — viršūnė.',
        brezinys: brezinuEile([kampas(laipsniai, 'A')]),
      }),

    // 4. Kuris kampas didesnis
    () => {
      const eile = sumaisyk([
        { br: kampas(laipsniai, 'A'), dydis: laipsniai },
        { br: kampas(kitas, 'B'), dydis: kitas },
      ])
      const nr = eile.findIndex((v) => v.dydis === Math.max(laipsniai, kitas)) + 1
      return uzdavinys('kas-yra-kampas', {
        klausimas: 'Kelintas kampas didesnis? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: 'Didesnis tas kampas, kurio kraštinės labiau prasiskleidusios.',
        brezinys: brezinuEile(eile.map((v) => v.br)),
      })
    },

    // 5. Kiek kampų turi daugiakampis
    () => {
      const n = atsitiktinis(3, 6)
      return uzdavinys('kas-yra-kampas', {
        klausimas: `Kiek kampų turi pavaizduota figūra?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Kampų tiek pat, kiek viršūnių — ${n}.`,
        brezinys: brezinuEile([daugiakampis(n, true)]),
      })
    },
  ])
}

// ── 4.3 Kokias figūras vadiname daugiakampiais? ─────────────────────────────

const A_DAUGIAKAMPIS = [
  {
    klausimas: 'Kiek kraštinių turi pavaizduotas daugiakampis?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Kraštinių tiek pat, kiek kampų.',
  },
] as const

export const daugiakampiai: Generatorius = () =>
  suBandymais(kurkDaugiakampi, A_DAUGIAKAMPIS, 'daugiakampiai')

function kurkDaugiakampi(): Uzdavinys | null {
  const n = atsitiktinis(3, 6)
  const sekla = atsitiktinis(0, 5)

  return variacija([
    // 1. Kiek kraštinių
    () =>
      uzdavinys('daugiakampiai', {
        klausimas: 'Kiek kraštinių turi pavaizduotas daugiakampis?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Tai ${KAMPU_VARDAI[n]} — jis turi ${n} ${derink(n, KRASTINIU)}, tiek pat kampų ir viršūnių.`,
        brezinys: brezinuEile([daugiakampis(n, false, sekla)]),
      }),

    // 2. Kaip vadinamas
    () => {
      const kiti = [3, 4, 5, 6].filter((x) => x !== n).slice(0, 2)
      return pasirinkimoUzdavinys(naujasId('daugiakampiai'), 'daugiakampiai', {
        klausimas: 'Kaip vadinamas pavaizduotas daugiakampis?',
        variantai: [KAMPU_VARDAI[n], ...kiti.map((x) => KAMPU_VARDAI[x])],
        teisingas: 0,
        sprendimas: `Figūra turi ${n} ${derink(n, KAMPU)}, tad tai ${KAMPU_VARDAI[n]}.`,
        brezinys: brezinuEile([daugiakampis(n, false, sekla)]),
      })
    },

    // 3. Kuri figūra nėra daugiakampis
    () => {
      const eile = sumaisyk([
        { br: neDaugiakampis('apskritimas'), daug: false },
        { br: daugiakampis(4, false, 1), daug: true },
        { br: daugiakampis(5, true), daug: true },
      ])
      const nr = eile.findIndex((v) => !v.daug) + 1
      return uzdavinys('daugiakampiai', {
        klausimas: 'Kelinta figūra nėra daugiakampis? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: 'Daugiakampis yra uždaroji laužtė iš atkarpų, o apskritimas atkarpų neturi.',
        brezinys: brezinuEile(eile.map((v) => v.br)),
      })
    },

    // 4. Kodėl uždaroji laužtė yra daugiakampis
    () =>
      pasirinkimoUzdavinys(naujasId('daugiakampiai'), 'daugiakampiai', {
        klausimas: 'Kokia laužtė dar vadinama daugiakampiu?',
        variantai: ['uždaroji', 'atviroji', 'bet kokia'],
        teisingas: 0,
        sprendimas: 'Uždaroji laužtė turi kampus ir viršūnes, tad ji vadinama daugiakampiu.',
      }),

    // 5. Surikiuoti pagal kraštinių skaičių
    () =>
      eiliskumoUzdavinys(naujasId('daugiakampiai'), 'daugiakampiai', {
        klausimas: 'Surikiuok figūras pagal kraštinių skaičių — nuo mažiausio iki didžiausio.',
        teisingaEile: ['trikampis', 'keturkampis', 'penkiakampis', 'šešiakampis'],
        sprendimas: 'Trikampis turi 3 kraštines, keturkampis 4, penkiakampis 5, šešiakampis 6.',
      }),

    // 6. Kiek viršūnių
    () =>
      uzdavinys('daugiakampiai', {
        klausimas: 'Kiek viršūnių turi pavaizduotas daugiakampis?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Viršūnių tiek pat, kiek kraštinių ir kampų — ${n}.`,
        brezinys: brezinuEile([daugiakampis(n, false, sekla)]),
      }),
  ])
}

// ── 4.4 Ką vadiname taisyklinguoju daugiakampiu? ────────────────────────────

const A_TAISYKLINGAS = [
  {
    klausimas: 'Kelinta figūra yra taisyklingasis daugiakampis?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: 'Taisyklingojo daugiakampio visos kraštinės ir visi kampai lygūs.',
  },
] as const

export const taisyklingasDaugiakampis: Generatorius = () =>
  suBandymais(kurkTaisyklinga, A_TAISYKLINGAS, 'taisyklingas-daugiakampis')

function kurkTaisyklinga(): Uzdavinys | null {
  const n = atsitiktinis(3, 6)

  return variacija([
    // 1. Kuri figūra taisyklinga
    () => {
      const eile = sumaisyk([
        { br: daugiakampis(n, true), taisyklinga: true },
        { br: daugiakampis(n, false, 1), taisyklinga: false },
        { br: daugiakampis(n, false, 3), taisyklinga: false },
      ])
      const nr = eile.findIndex((v) => v.taisyklinga) + 1
      return uzdavinys('taisyklingas-daugiakampis', {
        klausimas: 'Kelinta figūra yra taisyklingasis daugiakampis? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: 'Taisyklingojo daugiakampio visos kraštinės ir visi kampai lygūs.',
        brezinys: brezinuEile(eile.map((v) => v.br)),
      })
    },

    // 2. Kas yra taisyklingasis daugiakampis
    () =>
      pasirinkimoUzdavinys(naujasId('taisyklingas-daugiakampis'), 'taisyklingas-daugiakampis', {
        klausimas: 'Koks daugiakampis vadinamas taisyklinguoju?',
        variantai: [
          'kurio visos kraštinės ir visi kampai lygūs',
          'kurio visos kraštinės skirtingos',
          'kuris turi daugiausia kampų',
        ],
        teisingas: 0,
        sprendimas: 'Turi sutapti abu dalykai — ir kraštinių ilgiai, ir kampų dydžiai.',
      }),

    // 3. Kaip vadinamas taisyklingasis keturkampis
    () =>
      pasirinkimoUzdavinys(naujasId('taisyklingas-daugiakampis'), 'taisyklingas-daugiakampis', {
        klausimas: 'Kaip dar vadinamas taisyklingasis keturkampis?',
        variantai: ['kvadratas', 'stačiakampis', 'trikampis'],
        teisingas: 0,
        sprendimas: 'Kvadrato visos keturios kraštinės lygios ir visi kampai vienodi.',
        brezinys: brezinuEile([daugiakampis(4, true)]),
      }),

    // 4. Kraštinių ilgių suma
    () => {
      const kiek = atsitiktinis(3, 6)
      const ilgis = atsitiktinis(3, 9)
      if (kiek * ilgis > 100) return null
      return uzdavinys('taisyklingas-daugiakampis', {
        klausimas: `Taisyklingojo ${KAMPU_KILM[kiek]} kraštinės ilgis — ${ilgis} cm. Kam lygi visų kraštinių ilgių suma?`,
        atsakymas: String(kiek * ilgis),
        atsakymasRodymui: `$${kiek * ilgis}$ cm`,
        sprendimas: `Visos ${kiek} kraštinės vienodos: $${kiek} \\cdot ${ilgis} = ${kiek * ilgis}$ cm.`,
        brezinys: brezinuEile([daugiakampis(kiek, true)]),
      })
    },

    // 5. Vienos kraštinės ilgis iš sumos
    () => {
      const kiek = atsitiktinis(3, 5)
      const ilgis = atsitiktinis(3, 9)
      const suma = kiek * ilgis
      if (suma > 100) return null
      return uzdavinys('taisyklingas-daugiakampis', {
        klausimas: `Iš ${suma} cm vielos sulankstytas taisyklingasis ${KAMPU_VARDAI[kiek]}. Koks vienos kraštinės ilgis?`,
        atsakymas: String(ilgis),
        atsakymasRodymui: `$${ilgis}$ cm`,
        sprendimas: `Visos kraštinės vienodos: $${suma} : ${kiek} = ${ilgis}$ cm.`,
      })
    },
  ])
}

// ── 4.5 Kas yra simetrija ir simetrijos ašis? ───────────────────────────────

const A_SIMETRIJA = [
  {
    klausimas: 'Kelinta figūra yra simetriška?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: 'Simetrišką figūrą galima padalyti į dvi veidrodines dalis.',
  },
] as const

export const simetrijosAsis: Generatorius = () =>
  suBandymais(kurkSimetrija, A_SIMETRIJA, 'simetrijos-asis')

function kurkSimetrija(): Uzdavinys | null {
  return variacija([
    // 1. Kuri figūra simetriška
    () => {
      const eile = sumaisyk([
        { br: suAsimi('kvadratas', 'nera'), sim: true },
        { br: suAsimi('sirdis', 'nera'), sim: false },
      ])
      const nr = eile.findIndex((v) => v.sim) + 1
      return uzdavinys('simetrijos-asis', {
        klausimas: 'Kelinta figūra yra simetriška? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: 'Simetrišką figūrą galima padalyti taip, kad abi dalys viena kitą atspindėtų.',
        brezinys: brezinuEile(eile.map((v) => v.br)),
      })
    },

    // 2. Kas yra simetrijos ašis
    () =>
      pasirinkimoUzdavinys(naujasId('simetrijos-asis'), 'simetrijos-asis', {
        klausimas: 'Kas vadinama simetrijos ašimi?',
        variantai: [
          'tiesė, dalijanti figūrą į dvi veidrodines dalis',
          'ilgiausia figūros kraštinė',
          'figūros viršūnė',
        ],
        teisingas: 0,
        sprendimas: 'Simetrijos ašis padalija figūrą taip, kad viena pusė atspindėtų kitą.',
        brezinys: brezinuEile([suAsimi('kvadratas', 'vertikali')]),
      }),

    // 3. Kelinta ašis nubrėžta teisingai
    () => {
      const eile = sumaisyk([
        { br: suAsimi('staciakampis', 'vertikali', true), gerai: true },
        { br: suAsimi('staciakampis', 'vertikali', false), gerai: false },
      ])
      const nr = eile.findIndex((v) => v.gerai) + 1
      return uzdavinys('simetrijos-asis', {
        klausimas: 'Kelintame brėžinyje simetrijos ašis nubrėžta teisingai? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: 'Ašis turi eiti per figūros vidurį — tik tada abi dalys vienodos.',
        brezinys: brezinuEile(eile.map((v) => v.br)),
      })
    },

    // 4. Kaip vadinamos nesimetriškos figūros
    () =>
      pasirinkimoUzdavinys(naujasId('simetrijos-asis'), 'simetrijos-asis', {
        klausimas: 'Kaip vadinami daiktai, kurie nėra simetriški?',
        variantai: ['asimetriški', 'taisyklingi', 'uždarieji'],
        teisingas: 0,
        sprendimas: 'Daiktai, kurių negalima padalyti į dvi veidrodines dalis, vadinami asimetriškais.',
      }),

    // 5. Kiek simetrijos ašių turi kvadratas
    () =>
      pasirinkimoUzdavinys(naujasId('simetrijos-asis'), 'simetrijos-asis', {
        klausimas: 'Kiek simetrijos ašių turi kvadratas?',
        variantai: ['4', '1', '2'],
        teisingas: 0,
        sprendimas: 'Kvadratą per vidurį dalija dvi tiesės ir dar dvi įstrižainės — iš viso 4 ašys.',
        brezinys: brezinuEile([suAsimi('kvadratas', 'vertikali')]),
      }),
  ])
}

// ── 4.6 Horizontalioji ir vertikalioji simetrijos ašys ──────────────────────

const A_ASYS = [
  {
    klausimas: 'Kokia simetrijos ašis nubrėžta?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — vertikalioji',
    sprendimas: 'Vertikalioji ašis eina iš viršaus į apačią.',
  },
] as const

export const asiuRusys: Generatorius = () => suBandymais(kurkAsis, A_ASYS, 'asiu-rusys')

function kurkAsis(): Uzdavinys | null {
  const vertikali = atsitiktinis(0, 1) === 1

  return variacija([
    // 1. Kokia ašis nubrėžta
    () =>
      pasirinkimoUzdavinys(naujasId('asiu-rusys'), 'asiu-rusys', {
        klausimas: 'Kokia simetrijos ašis nubrėžta?',
        variantai: vertikali
          ? ['vertikalioji', 'horizontalioji', 'įstrižoji']
          : ['horizontalioji', 'vertikalioji', 'įstrižoji'],
        teisingas: 0,
        sprendimas: vertikali
          ? 'Ašis eina iš viršaus į apačią, tad ji vertikalioji.'
          : 'Ašis eina iš kairės į dešinę, tad ji horizontalioji.',
        brezinys: brezinuEile([
          suAsimi('staciakampis', vertikali ? 'vertikali' : 'horizontali'),
        ]),
      }),

    // 2. Kelintame brėžinyje vertikalioji ašis
    () => {
      const eile = sumaisyk([
        { br: suAsimi('staciakampis', 'vertikali'), v: true },
        { br: suAsimi('staciakampis', 'horizontali'), v: false },
      ])
      const nr = eile.findIndex((x) => x.v) + 1
      return uzdavinys('asiu-rusys', {
        klausimas: 'Kelintame brėžinyje nubrėžta vertikalioji simetrijos ašis? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: 'Vertikalioji ašis eina iš viršaus į apačią.',
        brezinys: brezinuEile(eile.map((x) => x.br)),
      })
    },

    // 3. Kelintame brėžinyje horizontalioji ašis
    () => {
      const eile = sumaisyk([
        { br: suAsimi('staciakampis', 'horizontali'), h: true },
        { br: suAsimi('staciakampis', 'vertikali'), h: false },
      ])
      const nr = eile.findIndex((x) => x.h) + 1
      return uzdavinys('asiu-rusys', {
        klausimas: 'Kelintame brėžinyje nubrėžta horizontalioji simetrijos ašis? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: 'Horizontalioji ašis eina iš kairės į dešinę.',
        brezinys: brezinuEile(eile.map((x) => x.br)),
      })
    },

    // 4. Kiek ašių turi stačiakampis
    () =>
      pasirinkimoUzdavinys(naujasId('asiu-rusys'), 'asiu-rusys', {
        klausimas: 'Kiek simetrijos ašių turi stačiakampis?',
        variantai: ['2 — vertikalioji ir horizontalioji', 'tik 1', 'nė vienos'],
        teisingas: 0,
        sprendimas: 'Stačiakampį per vidurį galima padalyti ir vertikaliai, ir horizontaliai.',
        brezinys: brezinuEile([suAsimi('staciakampis', 'vertikali')]),
      }),

    // 5. Kokia ašis turi raidė
    () =>
      pasirinkimoUzdavinys(naujasId('asiu-rusys'), 'asiu-rusys', {
        klausimas: 'Kokią simetrijos ašį turi spausdintinė raidė A?',
        variantai: ['tik vertikaliąją', 'tik horizontaliąją', 'nė vienos'],
        teisingas: 0,
        sprendimas: 'Raidę A per vidurį galima padalyti iš viršaus į apačią, ir abi pusės sutaps.',
      }),
  ])
}

// ── 4.7 Kaip atpažinti ir nubraižyti simetriškas figūras? ───────────────────

const A_SIM_FIGUROS = [
  {
    klausimas: 'Kiek simetrijos ašių turi kvadratas?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Dvi ašys eina per kraštinių vidurius ir dvi — per įstrižaines.',
  },
] as const

export const simetriskosFiguros: Generatorius = () =>
  suBandymais(kurkSimFiguras, A_SIM_FIGUROS, 'simetriskos-figuros')

/** Kiek simetrijos ašių turi taisyklingoji figūra. */
const ASIU_SKAICIUS: Record<string, number> = {
  kvadratas: 4,
  staciakampis: 2,
  trikampis: 3,
}

function kurkSimFiguras(): Uzdavinys | null {
  const figura = pasirink(['kvadratas', 'staciakampis', 'trikampis'] as const)
  const asiu = ASIU_SKAICIUS[figura]

  return variacija([
    // 1. Kiek ašių turi figūra
    () =>
      uzdavinys('simetriskos-figuros', {
        klausimas: `Kiek simetrijos ašių turi ${figura === 'staciakampis' ? 'stačiakampis' : figura === 'trikampis' ? 'taisyklingasis trikampis' : 'kvadratas'}?`,
        atsakymas: String(asiu),
        atsakymasRodymui: `$${asiu}$`,
        sprendimas:
          figura === 'kvadratas'
            ? 'Dvi ašys eina per kraštinių vidurius ir dvi — per įstrižaines.'
            : figura === 'staciakampis'
              ? 'Stačiakampį galima padalyti vertikaliai ir horizontaliai — dvi ašys.'
              : 'Taisyklingasis trikampis turi po ašį prie kiekvienos kraštinės.',
        brezinys: brezinuEile([suAsimi(figura, 'vertikali')]),
      }),

    // 2. Kuri figūra turi daugiau ašių
    () =>
      pasirinkimoUzdavinys(naujasId('simetriskos-figuros'), 'simetriskos-figuros', {
        klausimas: 'Kuri figūra turi daugiau simetrijos ašių?',
        variantai: ['kvadratas', 'stačiakampis', 'abi po tiek pat'],
        teisingas: 0,
        sprendimas: 'Kvadratas turi 4 ašis, o stačiakampis — 2.',
      }),

    // 3. Kuri figūra asimetriška
    () => {
      const eile = sumaisyk([
        { br: suAsimi('sirdis', 'nera'), sim: false },
        { br: suAsimi('kvadratas', 'nera'), sim: true },
        { br: suAsimi('trikampis', 'nera'), sim: true },
      ])
      const nr = eile.findIndex((v) => !v.sim) + 1
      return uzdavinys('simetriskos-figuros', {
        klausimas: 'Kelinta figūra yra asimetriška? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: 'Asimetriškos figūros negalima padalyti į dvi veidrodines dalis.',
        brezinys: brezinuEile(eile.map((v) => v.br)),
      })
    },

    // 4. Ar figūra turi įstrižą ašį
    () =>
      pasirinkimoUzdavinys(naujasId('simetriskos-figuros'), 'simetriskos-figuros', {
        klausimas: 'Ar kvadratas turi įstrižų simetrijos ašių?',
        variantai: ['taip, dvi įstrižaines', 'ne, nė vienos', 'taip, keturias'],
        teisingas: 0,
        sprendimas: 'Kvadratą į dvi vienodas dalis dalija ir abi jo įstrižainės.',
        brezinys: brezinuEile([suAsimi('kvadratas', 'istriza')]),
      }),

    // 5. Kiek ašių turi apskritimas
    () =>
      pasirinkimoUzdavinys(naujasId('simetriskos-figuros'), 'simetriskos-figuros', {
        klausimas: 'Kiek simetrijos ašių turi apskritimas?',
        variantai: ['nesuskaičiuojamai daug', 'tik vieną', 'nė vienos'],
        teisingas: 0,
        sprendimas: 'Bet kuri tiesė per apskritimo centrą dalija jį į dvi vienodas dalis.',
        brezinys: brezinuEile([neDaugiakampis('apskritimas')]),
      }),
  ])
}

// ── 4.8 Kaip atpažinti ir formuluoti teiginius? ─────────────────────────────

const A_TEIGINIAI = [
  {
    klausimas: 'Kuris teiginys apie trikampį teisingas?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — trikampis turi tris kraštines',
    sprendimas: 'Teiginys yra sakinys, kuris būna arba teisingas, arba klaidingas.',
  },
] as const

export const figuruTeiginiai: Generatorius = () =>
  suBandymais(kurkTeiginius, A_TEIGINIAI, 'figuru-teiginiai')

function kurkTeiginius(): Uzdavinys | null {
  const n = atsitiktinis(3, 6)
  const vardas = KAMPU_VARDAI[n]

  return variacija([
    // 1. Kuris teiginys teisingas
    () =>
      pasirinkimoUzdavinys(naujasId('figuru-teiginiai'), 'figuru-teiginiai', {
        klausimas: 'Kuris teiginys apie pavaizduotą figūrą teisingas?',
        variantai: [
          `ji turi ${n} ${derink(n, KRASTINIU)}`,
          `ji turi ${n + 1} ${derink(n + 1, KRASTINIU)}`,
          'ji neturi kampų',
        ],
        teisingas: 0,
        sprendimas: `Suskaičiavus kraštines gaunama ${n}.`,
        brezinys: brezinuEile([daugiakampis(n, false, 2)]),
      }),

    // 2. Kuris teiginys klaidingas
    () =>
      pasirinkimoUzdavinys(naujasId('figuru-teiginiai'), 'figuru-teiginiai', {
        klausimas: `Kuris teiginys apie ${KAMPU_GAL[n]} klaidingas?`,
        variantai: [
          `${vardas} yra atviroji laužtė`,
          `${vardas} turi ${n} ${derink(n, KAMPU)}`,
          `${vardas} yra daugiakampis`,
        ],
        teisingas: 0,
        sprendimas: `${vardas[0].toUpperCase()}${vardas.slice(1)} yra UŽDAROJI laužtė — todėl jis ir vadinamas daugiakampiu.`,
      }),

    // 3. Kas yra teiginys
    () =>
      pasirinkimoUzdavinys(naujasId('figuru-teiginiai'), 'figuru-teiginiai', {
        klausimas: 'Kuris sakinys yra teiginys?',
        variantai: [
          'Trikampis turi tris kraštines.',
          'Kvadratas yra gražesnis negu trikampis.',
          'Oho, koks didelis trikampis!',
        ],
        teisingas: 0,
        sprendimas:
          'Teiginys yra sakinys, apie kurį galima pasakyti, ar jis teisingas, ar klaidingas. Nuomonė teiginiu nėra.',
      }),

    // 4. Priešingas teiginys
    () =>
      pasirinkimoUzdavinys(naujasId('figuru-teiginiai'), 'figuru-teiginiai', {
        klausimas: 'Kaip suformuluoti priešingą teiginį sakiniui „Kvadratas yra uždaroji laužtė“?',
        variantai: [
          'Netiesa, kad kvadratas yra uždaroji laužtė.',
          'Kvadratas yra gražus.',
          'Kvadratas turi keturias kraštines.',
        ],
        teisingas: 0,
        sprendimas: 'Priešingas teiginys sudaromas pridedant „Netiesa, kad…“ ir pakartojant pradinį teiginį.',
      }),

    // 5. Ar teiginys apie stačiakampį teisingas
    () =>
      pasirinkimoUzdavinys(naujasId('figuru-teiginiai'), 'figuru-teiginiai', {
        klausimas: 'Ar teiginys „Stačiakampis yra taisyklingasis daugiakampis“ teisingas?',
        variantai: [
          'klaidingas — jo kraštinės ne visos lygios',
          'teisingas — visi jo kampai lygūs',
          'teisingas — jis turi keturias kraštines',
        ],
        teisingas: 0,
        sprendimas:
          'Taisyklingajam daugiakampiui reikia ir lygių kampų, ir lygių kraštinių. Stačiakampio kampai lygūs, bet kraštinės — ne.',
        brezinys: brezinuEile([suAsimi('staciakampis', 'nera')]),
      }),
  ])
}

// ── 4.9 Kaip rasti kelią plane pagal komandas? ──────────────────────────────

const PLOTIS = 5
const AUKSTIS = 4

const KOMANDOS = [
  { zenklas: '↑', dx: 0, dy: -1 },
  { zenklas: '↓', dx: 0, dy: 1 },
  { zenklas: '→', dx: 1, dy: 0 },
  { zenklas: '←', dx: -1, dy: 0 },
] as const

/** Objektai plane žymimi raidėmis — plane svarbi vieta, ne išvaizda. */
const OBJEKTAI = [
  { zyme: 'M', vardas: 'medis' },
  { zyme: 'S', vardas: 'skulptūra' },
  { zyme: 'K', vardas: 'kavinė' },
  { zyme: 'T', vardas: 'tiltas' },
] as const

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

const A_PLANO_KELIAS = [
  {
    klausimas: 'Prie kurio objekto nuveda komandos → → ↑?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — medis',
    sprendimas: 'Du langeliai į dešinę ir vienas aukštyn.',
  },
] as const

export const planoKelias: Generatorius = () =>
  suBandymais(kurkPlanoKelia, A_PLANO_KELIAS, 'plano-kelias')

function kurkPlanoKelia(): Uzdavinys | null {
  const pradzia = { x: 0, y: AUKSTIS - 1 }
  const kelias = kurkKelia(pradzia, atsitiktinis(3, 5))
  if (!kelias) return null

  const laisvi: Taskas[] = []
  for (let x = 0; x < PLOTIS; x += 1) {
    for (let y = 0; y < AUKSTIS; y += 1) {
      const uzimtas =
        (x === pradzia.x && y === pradzia.y) ||
        (x === kelias.galas.x && y === kelias.galas.y)
      if (!uzimtas) laisvi.push({ x, y })
    }
  }
  const kiti = sumaisyk(laisvi).slice(0, 2)
  if (kiti.length < 2) return null
  const [tikslas, ...netikslai] = sumaisyk([...OBJEKTAI]).slice(0, 3)
  const langeliai = [
    { x: pradzia.x, y: pradzia.y, zyme: 'P' },
    { x: kelias.galas.x, y: kelias.galas.y, zyme: tikslas.zyme },
    { x: kiti[0].x, y: kiti[0].y, zyme: netikslai[0].zyme },
    { x: kiti[1].x, y: kiti[1].y, zyme: netikslai[1].zyme },
  ]
  const komandos = kelias.zenklai.join(' ')

  return variacija([
    // 1. Prie kurio objekto nuveda komandos
    () =>
      pasirinkimoUzdavinys(naujasId('plano-kelias'), 'plano-kelias', {
        klausimas: `Nuo pradžios P vykdomos komandos: ${komandos}. Prie kurio objekto atsidursi?`,
        variantai: [
          `${tikslas.vardas} (${tikslas.zyme})`,
          `${netikslai[0].vardas} (${netikslai[0].zyme})`,
          `${netikslai[1].vardas} (${netikslai[1].zyme})`,
        ],
        teisingas: 0,
        sprendimas: `Vykdant ${komandos} kelias baigiasi ties ${tikslas.zyme}.`,
        brezinys: planas(PLOTIS, AUKSTIS, langeliai),
      }),

    // 2. Kiek komandų reikia
    () =>
      uzdavinys('plano-kelias', {
        klausimas: 'Kiek komandų reikia, kad nueitum nubrėžtu keliu?',
        atsakymas: String(kelias.zenklai.length),
        atsakymasRodymui: `$${kelias.zenklai.length}$`,
        sprendimas: `Kelias eina per ${kelias.zenklai.length} langelius, tad reikia tiek pat komandų.`,
        brezinys: planas(PLOTIS, AUKSTIS, langeliai, kelias.takas),
      }),

    // 3. Kuri komandų seka teisinga
    () => {
      const kita = sumaisyk(kelias.zenklai).join(' ')
      if (kita === komandos) return null
      const trecia = [...kelias.zenklai.slice(0, -1), pasirink(KOMANDOS).zenklas].join(' ')
      if (trecia === komandos || trecia === kita) return null
      return pasirinkimoUzdavinys(naujasId('plano-kelias'), 'plano-kelias', {
        klausimas: `Kuri komandų seka nuveda nuo P iki ${tikslas.zyme}?`,
        variantai: [komandos, kita, trecia],
        teisingas: 0,
        sprendimas: `Nubrėžtas kelias eina taip: ${komandos}.`,
        brezinys: planas(PLOTIS, AUKSTIS, langeliai, kelias.takas),
      })
    },

    // 4. Kiek žingsnių į vieną pusę
    () => {
      const k = pasirink(KOMANDOS)
      const kiek = kelias.zenklai.filter((z) => z === k.zenklas).length
      if (kiek === 0) return null
      return uzdavinys('plano-kelias', {
        klausimas: `Komandos: ${komandos}. Kiek kartų einama ${k.zenklas} kryptimi?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `Rodyklė ${k.zenklas} sekoje pasitaiko ${kiek} ${kiek === 1 ? 'kartą' : 'kartus'}.`,
      })
    },

    // 5. Kelinta komanda klaidinga
    () => {
      const vieta = atsitiktinis(1, kelias.zenklai.length)
      return uzdavinys('plano-kelias', {
        klausimas: `Kelinta komanda sekoje ${komandos} yra paskutinė? Parašyk skaičių.`,
        atsakymas: String(kelias.zenklai.length),
        atsakymasRodymui: `$${kelias.zenklai.length}$`,
        sprendimas: `Sekoje yra ${kelias.zenklai.length} komandos, tad paskutinė yra ${kelias.zenklai.length}-oji. Pavyzdžiui, ${vieta}-oji yra ${kelias.zenklai[vieta - 1]}.`,
      })
    },
  ])
}

// ── 4.10 Kaip sukurti planą? ────────────────────────────────────────────────

const A_PLANAS = [
  {
    klausimas: 'Kas yra planas?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — vaizdas iš viršaus',
    sprendimas: 'Plane daiktai piešiami taip, kaip matomi iš viršaus.',
  },
] as const

export const planoKurimas: Generatorius = () => suBandymais(kurkPlana, A_PLANAS, 'plano-kurimas')

function kurkPlana(): Uzdavinys | null {
  const objektai = sumaisyk([...OBJEKTAI]).slice(0, 3)
  const vietos = sumaisyk(
    Array.from({ length: PLOTIS * AUKSTIS }, (_, i) => ({
      x: i % PLOTIS,
      y: Math.floor(i / PLOTIS),
    })),
  ).slice(0, 3)
  const langeliai = objektai.map((o, i) => ({ x: vietos[i].x, y: vietos[i].y, zyme: o.zyme }))
  const kas = objektai[0]
  const vieta = vietos[0]

  return variacija([
    // 1. Kas yra planas
    () =>
      pasirinkimoUzdavinys(naujasId('plano-kurimas'), 'plano-kurimas', {
        klausimas: 'Kas yra planas?',
        variantai: ['vaizdas iš viršaus', 'vaizdas iš šono', 'daikto nuotrauka'],
        teisingas: 0,
        sprendimas: 'Plane daiktai piešiami taip, kaip juos matytume žiūrėdami iš viršaus.',
      }),

    // 2. Kelintoje eilutėje yra objektas
    () =>
      uzdavinys('plano-kurimas', {
        klausimas: `Kelintoje plano eilutėje (skaičiuojant iš viršaus) yra ${kas.vardas} (${kas.zyme})?`,
        atsakymas: String(vieta.y + 1),
        atsakymasRodymui: `$${vieta.y + 1}$`,
        sprendimas: `Objektas ${kas.zyme} stovi ${vieta.y + 1} eilutėje.`,
        brezinys: planas(PLOTIS, AUKSTIS, langeliai),
      }),

    // 3. Kelintame stulpelyje yra objektas
    () =>
      uzdavinys('plano-kurimas', {
        klausimas: `Kelintame plano stulpelyje yra ${kas.vardas} (${kas.zyme})?`,
        atsakymas: String(vieta.x + 1),
        atsakymasRodymui: `$${vieta.x + 1}$`,
        sprendimas: `Objektas ${kas.zyme} stovi ${vieta.x + 1} stulpelyje.`,
        brezinys: planas(PLOTIS, AUKSTIS, langeliai),
      }),

    // 4. Kiek objektų plane
    () =>
      uzdavinys('plano-kurimas', {
        klausimas: 'Kiek objektų pažymėta plane?',
        atsakymas: String(langeliai.length),
        atsakymasRodymui: `$${langeliai.length}$`,
        sprendimas: `Plane pažymėti ${langeliai.length} objektai: ${objektai.map((o) => o.zyme).join(', ')}.`,
        brezinys: planas(PLOTIS, AUKSTIS, langeliai),
      }),

    // 5. Ką rodo plano langelis
    () =>
      pasirinkimoUzdavinys(naujasId('plano-kurimas'), 'plano-kurimas', {
        klausimas: 'Kam plane reikalingas tinklelis?',
        variantai: [
          'kad būtų galima tiksliai nusakyti vietą',
          'kad planas atrodytų gražiau',
          'kad tilptų daugiau spalvų',
        ],
        teisingas: 0,
        sprendimas: 'Pagal tinklelio eilutę ir stulpelį galima pasakyti, kur tiksliai stovi objektas.',
        brezinys: planas(PLOTIS, AUKSTIS, langeliai),
      }),
  ])
}

/** Sritis šioje temoje nieko neriboja — čia beveik nieko neskaičiuojama. */
export type { Sritis }
