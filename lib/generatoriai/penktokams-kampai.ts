import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import {
  didelisKampas,
  gretutiniai,
  kampasSuRaidemis,
  kampuEile,
  keliSpinduliai,
  kryzminiai,
  matlankis,
  pusiaukampine,
} from './penktokams-kampu-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 5 klasės tema „Kampai“ — trylika potemių.
 *
 * Kampų dydžiai brėžiniuose visada tikri. Kai uždavinys prašo kampą atpažinti
 * ar palyginti, jo dydis brėžinyje neužrašomas — antraip skaityti brėžinį
 * nebereikėtų.
 *
 * Kelios turinio aprašo užduotys prašo mokinio ką nors nubraižyti popieriuje
 * („nubrėžk kampą“, „nubraižyk pusiaukampinę“). Ekrane to patikrinti
 * neįmanoma, tad generuojama tai, ką braižymas reikalauja žinoti: koks bus
 * gautų kampų dydis, kiek laipsnių atidėti, kur bus pusiaukampinė.
 */

/** Kampo rūšis pagal dydį. */
function rusis(l: number): string {
  if (l < 90) return 'smailusis'
  if (l === 90) return 'statusis'
  if (l < 180) return 'bukasis'
  if (l === 180) return 'ištiestinis'
  if (l < 360) return 'priešpilnis'
  return 'pilnasis'
}

const SMAILUS = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85]
const BUKI = [95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170]

// ── 8.1.1. Kampas ir jo elementai ───────────────────────────────────────────

const T1 = 'kampas-ir-elementai'

const A_ELEMENTAI = [
  {
    klausimas: 'Kuri raidė kampo $ABC$ pavadinime žymi viršūnę?',
    atsakymas: 'B',
    atsakymasRodymui: '$B$',
    sprendimas: 'Viršūnė visada rašoma vidurine raide.',
  },
] as const

export const kampasIrElementai: Generatorius = () => suBandymais(kurkElementus, A_ELEMENTAI, T1)

function kurkElementus(): Uzdavinys | null {
  const [a, b, c] = sumaisyk(['A', 'C', 'D', 'E', 'K', 'M', 'P']).slice(0, 3)
  const l = pasirink([...SMAILUS, ...BUKI])

  return variacija([
    // 1. Viršūnė iš pavadinimo
    () =>
      uzdavinys(T1, {
        klausimas: `Kuri raidė kampo $${a}${b}${c}$ pavadinime žymi viršūnę?`,
        atsakymas: b,
        atsakymasRodymui: `$${b}$`,
        sprendimas: 'Viršūnė kampo pavadinime visada rašoma viduryje.',
      }),

    // 2. Viršūnė iš brėžinio
    () =>
      uzdavinys(T1, {
        klausimas: 'Įvardyk pavaizduoto kampo viršūnę.',
        atsakymas: b,
        atsakymasRodymui: `$${b}$`,
        sprendimas: 'Viršūnė — taškas, iš kurio išeina abi kampo kraštinės.',
        brezinys: kampasSuRaidemis(l, { virsune: b, kraštines: [a, c] }),
      }),

    // 3. Kraštinės
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Kurie spinduliai yra kampo $${a}${b}${c}$ kraštinės?`,
        variantai: [`$${b}${a}$ ir $${b}${c}$`, `$${a}${b}$ ir $${a}${c}$`, `$${a}${c}$ ir $${c}${a}$`, `tik $${b}${a}$`],
        teisingas: 0,
        sprendimas: 'Kraštinės yra spinduliai, kurie prasideda viršūnėje.',
      }),

    // 4. Antras pavadinimas
    () =>
      uzdavinys(T1, {
        klausimas: `Kampą galima pavadinti $${a}${b}${c}$. Užrašyk antrą galimą to paties kampo pavadinimą.`,
        atsakymas: `${c}${b}${a}`,
        atsakymasRodymui: `$${c}${b}${a}$`,
        sprendimas: 'Kraštines galima išvardyti bet kuria tvarka, svarbu, kad viršūnė liktų viduryje.',
      }),

    // 5. Iš kokių elementų
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Iš kokių elementų sudarytas kampas?',
        variantai: [
          'iš viršūnės ir dviejų spindulių, išeinančių iš jos',
          'iš dviejų atkarpų, kurios nesusiliečia',
          'iš trijų taškų',
          'iš tiesės ir taško',
        ],
        teisingas: 0,
        sprendimas: 'Spinduliai vadinami kampo kraštinėmis, o jų bendra pradžia — viršūne.',
      }),

    // 6. Kiek kampų sudaro trys spinduliai
    () => {
      const kampai = [0, atsitiktinis(30, 55), atsitiktinis(85, 125)]
      return uzdavinys(T1, {
        klausimas: 'Kiek skirtingų kampų sudaro pavaizduoti spinduliai?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Kampą sudaro kiekviena spindulių pora: $AOB$, $BOC$ ir $AOC$ — iš viso trys.',
        brezinys: keliSpinduliai(kampai, ['A', 'B', 'C']),
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: `Mokinys kampą $${a}${b}${c}$ pavadino kampu $${a}$. Kuria raide reikėjo jį pavadinti?`,
        atsakymas: b,
        atsakymasRodymui: `$${b}$`,
        sprendimas: 'Viena raide kampas vadinamas pagal viršūnę, o ji yra vidurinė.',
      }),

    // 8. Kiek kampų su keturiais spinduliais
    () => {
      const kampai = [0, atsitiktinis(25, 45), atsitiktinis(70, 95), atsitiktinis(120, 155)]
      return uzdavinys(T1, {
        klausimas: 'Kiek skirtingų kampų sudaro keturi pavaizduoti spinduliai?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Kiekviena spindulių pora duoda kampą, o iš keturių spindulių tokių porų yra 6.',
        brezinys: keliSpinduliai(kampai, ['A', 'B', 'C', 'D']),
      })
    },
  ])
}

// ── 8.1.2. Kuris kampas didesnis? ───────────────────────────────────────────

const T2 = 'kuris-kampas-didesnis'

const A_DIDESNIS = [
  {
    klausimas: 'Ar kampo dydis priklauso nuo jo kraštinių ilgio?',
    atsakymas: 'ne',
    atsakymasRodymui: 'Ne',
    sprendimas: 'Kampo dydį lemia tik kraštinių posvyris viena kitos atžvilgiu.',
  },
] as const

export const kurisKampasDidesnis: Generatorius = () => suBandymais(kurkDidesni, A_DIDESNIS, T2)

function kurkDidesni(): Uzdavinys | null {
  const a = pasirink(SMAILUS)
  const b = pasirink(BUKI)

  return variacija([
    // 1. Kuris didesnis
    () =>
      uzdavinys(T2, {
        klausimas: 'Kuris pavaizduotas kampas didesnis? Užrašyk jo numerį.',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Didesnis tas kampas, kurio kraštinės labiau prasiskėtusios.',
        brezinys: kampuEile([
          { laipsniai: a, ilgis: 60 },
          { laipsniai: b, ilgis: 44 },
        ]),
      }),

    // 2. Ar priklauso nuo kraštinių
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ar kampo dydis priklauso nuo jo kraštinių ilgio?',
        variantai: [
          'ne, kraštines galima pratęsti, o kampas nepasikeis',
          'taip, ilgesnės kraštinės duoda didesnį kampą',
          'taip, trumpesnės kraštinės duoda didesnį kampą',
        ],
        teisingas: 0,
        sprendimas: 'Kampo dydį lemia tik kraštinių prasiskėtimas, ne jų ilgis.',
      }),

    // 3. Statusis ar smailusis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuris kampas didesnis — statusis ar smailusis?',
        variantai: ['statusis', 'smailusis', 'jie vienodi'],
        teisingas: 0,
        sprendimas: 'Smailusis kampas mažesnis už statųjį, kuris yra 90°.',
      }),

    // 4. Vienodi pasukti kampai
    () => {
      const l = pasirink(SMAILUS)
      const kitas = pasirink(BUKI)
      return uzdavinys(T2, {
        klausimas: 'Kuris iš pavaizduotų kampų yra tokio pat dydžio kaip pirmasis? Užrašyk jo numerį.',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Pasukus kampą jo dydis nesikeičia — svarbu tik kraštinių prasiskėtimas.',
        brezinys: kampuEile([
          { laipsniai: l, ilgis: 56 },
          { laipsniai: kitas, ilgis: 50 },
          { laipsniai: l, posukis: 40, ilgis: 42 },
        ]),
      })
    },

    // 5. Ką reiškia didesnis kampas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ką reiškia, kad vienas kampas didesnis už kitą?',
        variantai: [
          'jo kraštinės labiau prasiskėtusios',
          'jo kraštinės ilgesnės',
          'jis nubrėžtas didesniame lape',
          'jo viršūnė aukščiau',
        ],
        teisingas: 0,
        sprendimas: 'Uždėjus vieną kampą ant kito, didesniojo kraštinė lieka už mažesniojo.',
      }),

    // 6. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Mokinys teigia, kad ${a}° kampas su 8 cm kraštinėmis didesnis už ${b}° kampą su 3 cm kraštinėmis. Kuris kampas iš tikrųjų didesnis? Užrašyk jo dydį laipsniais.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}°$`,
        sprendimas: `Kraštinių ilgis kampo dydžio nekeičia, o ${b} > ${a}.`,
      }),

    // 7. Rikiavimas
    () => {
      const keturi = sumaisyk([25, 60, 95, 150])
      const eile = [...keturi].sort((x, y) => x - y)
      return eiliskumoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Surikiuok kampų dydžius nuo mažiausio iki didžiausio.',
        teisingaEile: eile.map((x) => `${x}°`),
        sprendimas: 'Kuo daugiau laipsnių, tuo kampas didesnis.',
      })
    },

    // 8. Kiek kartų didesnis
    () => {
      const maz = pasirink([15, 20, 25, 30, 40])
      const kartai = atsitiktinis(2, 4)
      if (maz * kartai > 180) return null
      return uzdavinys(T2, {
        klausimas: `Vienas kampas yra ${maz}°, kitas — ${maz * kartai}°. Kiek kartų antrasis kampas didesnis?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `$${maz * kartai} : ${maz} = ${kartai}$.`,
      })
    },
  ])
}

// ── 8.2.1. Ištiestinis ir statusis kampai ───────────────────────────────────

const T3 = 'istiestinis-ir-statusis'

const A_ISTIESTINIS = [
  {
    klausimas: 'Kiek laipsnių turi ištiestinis kampas?',
    atsakymas: '180',
    atsakymasRodymui: '$180°$',
    sprendimas: 'Ištiestinio kampo kraštinės sudaro tiesę.',
  },
] as const

export const istiestinisIrStatusis: Generatorius = () => suBandymais(kurkIstiestini, A_ISTIESTINIS, T3)

function kurkIstiestini(): Uzdavinys | null {
  return variacija([
    // 1. Ištiestinio dydis
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek laipsnių turi ištiestinis kampas?',
        atsakymas: '180',
        atsakymasRodymui: '$180°$',
        sprendimas: 'Jo kraštinės sudaro tiesę.',
        brezinys: kampasSuRaidemis(180, { virsune: 'O', kraštines: ['A', 'B'] }),
      }),

    // 2. Stačiojo dydis
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek laipsnių turi statusis kampas?',
        atsakymas: '90',
        atsakymasRodymui: '$90°$',
        sprendimas: 'Statusis kampas yra ištiestinio pusė.',
        brezinys: kampasSuRaidemis(90, { virsune: 'O', kraštines: ['A', 'B'] }),
      }),

    // 3. Kiek stačiųjų telpa
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek stačiųjų kampų sudaro ištiestinį kampą?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: '$180 : 90 = 2$.',
      }),

    // 4. Kaip atrodo ištiestinis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip išsidėsčiusios ištiestinio kampo kraštinės?',
        variantai: [
          'jos sudaro tiesę',
          'jos statmenos viena kitai',
          'jos sutampa',
          'jos sudaro smailų kampą',
        ],
        teisingas: 0,
        sprendimas: 'Todėl ištiestinis kampas ir yra 180°.',
      }),

    // 5. Kaip žymimas statusis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip brėžinyje žymimas statusis kampas?',
        variantai: ['kvadratėliu prie viršūnės', 'dviem lankeliais', 'stora linija', 'niekaip'],
        teisingas: 0,
        sprendimas: 'Kvadratėlis rodo, kad kraštinės statmenos.',
        brezinys: kampasSuRaidemis(90, { virsune: 'O', kraštines: ['A', 'B'] }),
      }),

    // 6. Atpažinimas iš brėžinio
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek laipsnių turi pavaizduotas kampas?',
        atsakymas: '90',
        atsakymasRodymui: '$90°$',
        sprendimas: 'Kvadratėlis prie viršūnės rodo, kad kampas statusis.',
        brezinys: kampasSuRaidemis(90, { virsune: 'O', kraštines: ['A', 'B'], posukis: 25 }),
      }),

    // 7. Pusė stačiojo
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek laipsnių turi kampas, dvigubai mažesnis už statųjį?',
        atsakymas: '45',
        atsakymasRodymui: '$45°$',
        sprendimas: '$90 : 2 = 45$.',
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: 'Mokinys teigia, kad ištiestinis kampas yra 360°. Kiek laipsnių jis iš tikrųjų turi?',
        atsakymas: '180',
        atsakymasRodymui: '$180°$',
        sprendimas: '360° yra pilnasis kampas, o ištiestinis yra jo pusė.',
      }),
  ])
}

// ── 8.2.2. Smailusis ir bukasis kampai ──────────────────────────────────────

const T4 = 'smailusis-ir-bukasis'

const A_SMAILUS = [
  {
    klausimas: 'Koks kampas vadinamas smailiuoju?',
    atsakymas: 'mazesnis uz 90',
    atsakymasRodymui: 'Mažesnis už $90°$',
    sprendimas: 'Smailusis kampas mažesnis už statųjį.',
  },
] as const

export const smailusisIrBukasis: Generatorius = () => suBandymais(kurkSmailu, A_SMAILUS, T4)

function kurkSmailu(): Uzdavinys | null {
  const s = pasirink(SMAILUS)
  const b = pasirink(BUKI)

  return variacija([
    // 1. Atpažinimas iš brėžinio
    () => {
      const l = pasirink([s, b])
      return uzdavinys(T4, {
        klausimas: 'Koks kampas pavaizduotas — smailusis ar bukasis?',
        atsakymas: rusis(l),
        atsakymasRodymui: rusis(l) === 'smailusis' ? 'Smailusis' : 'Bukasis',
        sprendimas:
          l < 90
            ? 'Kampas mažesnis už statųjį, tad smailusis.'
            : 'Kampas didesnis už statųjį, bet mažesnis už ištiestinį, tad bukasis.',
        brezinys: kampasSuRaidemis(l, { virsune: 'O', kraštines: ['A', 'B'] }),
      })
    },

    // 2. Atpažinimas iš dydžio
    () => {
      const l = pasirink([s, b, 90, 180])
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Koks yra ${l}° kampas?`,
        variantai: [
          rusis(l),
          ...['smailusis', 'statusis', 'bukasis', 'ištiestinis'].filter((x) => x !== rusis(l)).slice(0, 3),
        ],
        teisingas: 0,
        sprendimas: `Smailusis yra mažesnis už 90°, statusis lygus 90°, bukasis — nuo 90° iki 180°, o ištiestinis lygus 180°.`,
      })
    },

    // 3. Ribos
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Tarp kokių dydžių yra bukasis kampas?',
        variantai: ['tarp 90° ir 180°', 'tarp 0° ir 90°', 'tarp 180° ir 360°', 'didesnis už 360°'],
        teisingas: 0,
        sprendimas: 'Bukasis kampas didesnis už statųjį, bet mažesnis už ištiestinį.',
      }),

    // 4. Didžiausias smailusis sveikas
    () =>
      uzdavinys(T4, {
        klausimas: 'Koks yra didžiausias smailusis kampas, kurio dydis išreiškiamas sveikuoju laipsnių skaičiumi?',
        atsakymas: '89',
        atsakymasRodymui: `$89°$`,
        sprendimas: 'Smailusis kampas turi būti mažesnis už 90°, tad didžiausias sveikasis — 89°.',
      }),

    // 5. Rūšis pagal palyginimą su stačiuoju
    () =>
      uzdavinys(T4, {
        klausimas: `Kampas ${90 - s}° mažesnis už statųjį. Kiek jis turi laipsnių?`,
        atsakymas: String(s),
        atsakymasRodymui: `$${s}°$`,
        sprendimas: `$90 - ${90 - s} = ${s}$.`,
      }),

    // 6. Rūšis pagal palyginimą su ištiestiniu
    () =>
      uzdavinys(T4, {
        klausimas: `Kampas ${180 - b}° mažesnis už ištiestinį. Kiek jis turi laipsnių ir koks jis?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}°$, bukasis`,
        sprendimas: `$180 - ${180 - b} = ${b}$; kampas didesnis už 90°, tad bukasis.`,
      }),

    // 7. Rikiavimas pagal rūšis
    () =>
      eiliskumoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Surikiuok kampų rūšis nuo mažiausios iki didžiausios.',
        teisingaEile: ['smailusis', 'statusis', 'bukasis', 'ištiestinis'],
        sprendimas: 'Smailusis < 90°, statusis = 90°, bukasis tarp 90° ir 180°, ištiestinis = 180°.',
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Mokinys ${b}° kampą pavadino smailiuoju. Koks jis iš tikrųjų?`,
        atsakymas: 'bukasis',
        atsakymasRodymui: 'Bukasis',
        sprendimas: `${b}° didesnis už 90°, tad kampas bukasis.`,
        brezinys: kampasSuRaidemis(b, { virsune: 'O', kraštines: ['A', 'B'] }),
      }),
  ])
}

// ── 8.2.3. Pilnasis ir priešpilnis kampai ───────────────────────────────────

const T5 = 'pilnasis-ir-priespilnis'

const A_PILNASIS = [
  {
    klausimas: 'Kiek laipsnių turi pilnasis kampas?',
    atsakymas: '360',
    atsakymasRodymui: '$360°$',
    sprendimas: 'Pilnasis kampas — visas apsisukimas.',
  },
] as const

export const pilnasisIrPriespilnis: Generatorius = () => suBandymais(kurkPilna, A_PILNASIS, T5)

function kurkPilna(): Uzdavinys | null {
  const p = pasirink([200, 210, 225, 240, 250, 270, 280, 300, 315, 330])

  return variacija([
    // 1. Pilnojo dydis
    () =>
      uzdavinys(T5, {
        klausimas: 'Kiek laipsnių turi pilnasis kampas?',
        atsakymas: '360',
        atsakymasRodymui: '$360°$',
        sprendimas: 'Pilnasis kampas atitinka visą apsisukimą aplink viršūnę.',
        brezinys: didelisKampas(360, 'pilnasis kampas'),
      }),

    // 2. Priešpilnio ribos
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Tarp kokių dydžių yra priešpilnis kampas?',
        variantai: ['tarp 180° ir 360°', 'tarp 90° ir 180°', 'tarp 0° ir 90°', 'didesnis už 360°'],
        teisingas: 0,
        sprendimas: 'Priešpilnis kampas didesnis už ištiestinį, bet mažesnis už pilnąjį.',
      }),

    // 3. Atpažinimas
    () =>
      uzdavinys(T5, {
        klausimas: `Koks kampas yra ${p}° — bukasis, priešpilnis ar pilnasis?`,
        atsakymas: 'priespilnis',
        atsakymasRodymui: 'Priešpilnis',
        sprendimas: `${p}° yra tarp 180° ir 360°.`,
      }),

    // 4. Kiek trūksta iki pilnojo
    () =>
      uzdavinys(T5, {
        klausimas: `Kiek laipsnių trūksta ${p}° kampui iki pilnojo?`,
        atsakymas: String(360 - p),
        atsakymasRodymui: `$${360 - p}°$`,
        sprendimas: `$360 - ${p} = ${360 - p}$.`,
      }),

    // 5. Iš ištiestinių
    () =>
      uzdavinys(T5, {
        klausimas: 'Kiek ištiestinių kampų sudaro pilnąjį kampą?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: '$360 : 180 = 2$.',
      }),

    // 6. Iš stačiųjų
    () =>
      uzdavinys(T5, {
        klausimas: 'Kiek stačiųjų kampų sudaro pilnąjį kampą?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: '$360 : 90 = 4$.',
      }),

    // 7. Iš brėžinio
    () =>
      uzdavinys(T5, {
        klausimas: 'Koks yra pavaizduoto kampo dydis, jei žinoma, kad jis lygus trims stačiesiems kampams?',
        atsakymas: '270',
        atsakymasRodymui: `$270°$`,
        sprendimas: '$90 \\cdot 3 = 270$.',
        brezinys: didelisKampas(270),
      }),

    // 8. Laikrodžio rodyklė
    () => {
      const kartai = pasirink([2, 3, 4, 6])
      return uzdavinys(T5, {
        klausimas: `Rodyklė apsuko ${360 / kartai}° ${kartai === 2 ? 'du' : kartai === 3 ? 'tris' : kartai === 4 ? 'keturis' : 'šešis'} kartus. Kiek laipsnių ji apsuko iš viso?`,
        atsakymas: '360',
        atsakymasRodymui: '$360°$',
        sprendimas: `$${360 / kartai} \\cdot ${kartai} = 360$ — vienas pilnas apsisukimas.`,
      })
    },
  ])
}

// ── 8.3.1. Laipsnis ───────────────────────────────────────────────────────────

const T6 = 'laipsnis'

const A_LAIPSNIS = [
  {
    klausimas: 'Į kiek lygių dalių padalytas pilnasis kampas, kai matuojama laipsniais?',
    atsakymas: '360',
    atsakymasRodymui: '$360$',
    sprendimas: 'Vienas laipsnis yra pilnojo kampo trys šimtai šešiasdešimtoji dalis.',
  },
] as const

export const laipsnis: Generatorius = () => suBandymais(kurkLaipsni, A_LAIPSNIS, T6)

function kurkLaipsni(): Uzdavinys | null {
  const l = pasirink([...SMAILUS, ...BUKI])

  return variacija([
    // 1. Kas yra laipsnis
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kas yra vienas laipsnis?',
        variantai: [
          'pilnojo kampo 360-oji dalis',
          'stačiojo kampo 90-oji dalis',
          'ištiestinio kampo šimtoji dalis',
          'vienas centimetras lanko',
        ],
        teisingas: 0,
        sprendimas: 'Pilnasis kampas padalytas į 360 lygių dalių — kiekviena jų ir yra laipsnis.',
      }),

    // 2. Kaip žymimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kaip užrašomas kampo dydis, lygus keturiasdešimt penkiems laipsniams?',
        variantai: ['$45°$', '$45$ cm', '$45$ %', '$45$ l'],
        teisingas: 0,
        sprendimas: 'Laipsniai žymimi mažu apskritimu skaičiaus viršuje.',
      }),

    // 3. Kiek laipsnių dalyje
    () => {
      const daliu = pasirink([2, 3, 4, 5, 6, 8, 9, 10, 12])
      return uzdavinys(T6, {
        klausimas: `Pilnasis kampas padalytas į ${daliu} lygias dalis. Kiek laipsnių turi viena dalis?`,
        atsakymas: String(360 / daliu),
        atsakymasRodymui: `$${360 / daliu}°$`,
        sprendimas: `$360 : ${daliu} = ${360 / daliu}$.`,
      })
    },

    // 4. Kiek dalių
    () => {
      const dalis = pasirink([30, 36, 40, 45, 60, 72, 90, 120])
      return uzdavinys(T6, {
        klausimas: `Į kiek lygių dalių padalytas pilnasis kampas, jei kiekviena dalis yra ${dalis}°?`,
        atsakymas: String(360 / dalis),
        atsakymasRodymui: `$${360 / dalis}$`,
        sprendimas: `$360 : ${dalis} = ${360 / dalis}$.`,
      })
    },

    // 5. Stačiojo dalis
    () =>
      uzdavinys(T6, {
        klausimas: 'Kiek laipsnių turi trečdalis stačiojo kampo?',
        atsakymas: '30',
        atsakymasRodymui: `$30°$`,
        sprendimas: '$90 : 3 = 30$.',
      }),

    // 6. Suma
    () => {
      const kitas = atsitiktinis(10, 180 - l)
      return uzdavinys(T6, {
        klausimas: `Vienas kampas ${l}°, kitas — ${kitas}°. Kiek laipsnių turi jų suma?`,
        atsakymas: String(l + kitas),
        atsakymasRodymui: `$${l + kitas}°$`,
        sprendimas: `$${l} + ${kitas} = ${l + kitas}$.`,
      })
    },

    // 7. Laikrodžio rodyklė per valandą
    () =>
      uzdavinys(T6, {
        klausimas: 'Kiek laipsnių apsuka laikrodžio minutinė rodyklė per 15 minučių?',
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: 'Per valandą rodyklė apsuka 360°, o 15 minučių yra valandos ketvirtis: $360 : 4 = 90$.',
      }),

    // 8. Iš laipsnių į dalį
    () =>
      uzdavinys(T6, {
        klausimas: 'Kokią pilnojo kampo dalį sudaro 90°? Užrašyk trupmena.',
        atsakymas: '1/4',
        atsakymasRodymui: '$\\dfrac{1}{4}$',
        sprendimas: '$90 : 360 = \\dfrac{1}{4}$.',
      }),
  ])
}

// ── 8.3.2. Kampų palyginimas ────────────────────────────────────────────────

const T7 = 'kampu-palyginimas'

const A_PALYGINIMAS = [
  {
    klausimas: 'Kuris kampas didesnis: $65°$ ar $85°$?',
    atsakymas: '85',
    atsakymasRodymui: '$85°$',
    sprendimas: 'Didesnis tas kampas, kurio laipsnių daugiau.',
  },
] as const

export const kampuPalyginimas: Generatorius = () => suBandymais(kurkPalyginima, A_PALYGINIMAS, T7)

function kurkPalyginima(): Uzdavinys | null {
  const a = atsitiktinis(15, 170)
  const b = atsitiktinis(15, 170)
  if (a === b) return null

  return variacija([
    // 1. Kuris didesnis
    () =>
      uzdavinys(T7, {
        klausimas: `Kuris kampas didesnis: $${a}°$ ar $${b}°$?`,
        atsakymas: String(Math.max(a, b)),
        atsakymasRodymui: `$${Math.max(a, b)}°$`,
        sprendimas: 'Kampai lyginami pagal laipsnių skaičių.',
      }),

    // 2. Keliais laipsniais
    () =>
      uzdavinys(T7, {
        klausimas: `Keliais laipsniais $${Math.max(a, b)}°$ kampas didesnis už $${Math.min(a, b)}°$ kampą?`,
        atsakymas: String(Math.abs(a - b)),
        atsakymasRodymui: `$${Math.abs(a - b)}°$`,
        sprendimas: `$${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(a - b)}$.`,
      }),

    // 3. Palyginimas su stačiuoju
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Palygink $${a}°$ kampą su stačiuoju.`,
        variantai:
          a < 90
            ? ['mažesnis už statųjį', 'didesnis už statųjį', 'lygus stačiajam']
            : a > 90
              ? ['didesnis už statųjį', 'mažesnis už statųjį', 'lygus stačiajam']
              : ['lygus stačiajam', 'mažesnis už statųjį', 'didesnis už statųjį'],
        teisingas: 0,
        sprendimas: `Statusis kampas yra 90°, o duotasis — ${a}°.`,
      }),

    // 4. Palyginimas iš brėžinio
    () => {
      const s = pasirink(SMAILUS)
      const bk = pasirink(BUKI)
      return uzdavinys(T7, {
        klausimas: 'Kuris iš pavaizduotų kampų didesnis? Užrašyk jo numerį.',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Pirmojo kampo kraštinės prasiskėtusios labiau.',
        brezinys: kampuEile([
          { laipsniai: bk, ilgis: 46 },
          { laipsniai: s, ilgis: 60 },
        ]),
      })
    },

    // 5. Rikiavimas
    () => {
      const keturi = sumaisyk([atsitiktinis(15, 40), atsitiktinis(50, 85), atsitiktinis(95, 130), atsitiktinis(140, 175)])
      const eile = [...keturi].sort((x, y) => x - y)
      return eiliskumoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Surikiuok kampus didėjimo tvarka.',
        teisingaEile: eile.map((x) => `${x}°`),
        sprendimas: 'Lyginami laipsnių skaičiai.',
      })
    },

    // 6. Kiek kartų
    () => {
      const maz = pasirink([15, 20, 25, 30, 40, 45])
      const kartai = atsitiktinis(2, 4)
      if (maz * kartai > 180) return null
      return uzdavinys(T7, {
        klausimas: `Kiek kartų $${maz * kartai}°$ kampas didesnis už $${maz}°$ kampą?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `$${maz * kartai} : ${maz} = ${kartai}$.`,
      })
    },

    // 7. Kampas tarp dviejų
    () => {
      const maz = Math.min(a, b)
      const did = Math.max(a, b)
      if (did - maz < 2) return null
      return uzdavinys(T7, {
        klausimas: `Užrašyk mažiausią sveikąjį kampo dydį, didesnį už $${maz}°$, bet mažesnį už $${did}°$.`,
        atsakymas: String(maz + 1),
        atsakymasRodymui: `$${maz + 1}°$`,
        sprendimas: `Tinka visi nuo ${maz + 1}° iki ${did - 1}°.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Mokinys teigia, kad $${Math.min(a, b)}°$ kampas didesnis už $${Math.max(a, b)}°$, nes jo kraštinės nubrėžtos ilgesnės. Kuris kampas iš tikrųjų didesnis?`,
        atsakymas: String(Math.max(a, b)),
        atsakymasRodymui: `$${Math.max(a, b)}°$`,
        sprendimas: 'Kampo dydis nuo kraštinių ilgio nepriklauso.',
      }),
  ])
}

// ── 8.3.3. Ištiestinio, stačiojo ir smailiojo kampų dydžiai ─────────────────

const T8 = 'kampu-dydziai-smailus'

const A_DYDZIAI1 = [
  {
    klausimas: 'Kiek laipsnių turi statusis kampas?',
    atsakymas: '90',
    atsakymasRodymui: '$90°$',
    sprendimas: 'Statusis kampas yra ištiestinio pusė.',
  },
] as const

export const kampuDydziaiSmailus: Generatorius = () => suBandymais(kurkDydzius1, A_DYDZIAI1, T8)

function kurkDydzius1(): Uzdavinys | null {
  const s = pasirink(SMAILUS)

  return variacija([
    // 1. Smailiojo ribos
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Koks gali būti smailiojo kampo dydis?',
        variantai: ['nuo 0° iki 90°', 'nuo 90° iki 180°', 'lygiai 90°', 'nuo 180° iki 360°'],
        teisingas: 0,
        sprendimas: 'Smailusis kampas visada mažesnis už statųjį.',
      }),

    // 2. Ar gali būti smailusis
    () => {
      const l = pasirink([...SMAILUS, 90, ...BUKI])
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Ar ${l}° kampas yra smailusis?`,
        variantai: l < 90 ? ['taip', 'ne', 'to nustatyti neįmanoma'] : ['ne', 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: l < 90 ? `${l}° mažesnis už 90°.` : `${l}° nėra mažesnis už 90°.`,
      })
    },

    // 3. Iki stačiojo
    () =>
      uzdavinys(T8, {
        klausimas: `Kiek laipsnių trūksta ${s}° kampui iki stačiojo?`,
        atsakymas: String(90 - s),
        atsakymasRodymui: `$${90 - s}°$`,
        sprendimas: `$90 - ${s} = ${90 - s}$.`,
      }),

    // 4. Iki ištiestinio
    () =>
      uzdavinys(T8, {
        klausimas: `Kiek laipsnių trūksta ${s}° kampui iki ištiestinio?`,
        atsakymas: String(180 - s),
        atsakymasRodymui: `$${180 - s}°$`,
        sprendimas: `$180 - ${s} = ${180 - s}$.`,
      }),

    // 5. Dviejų smailiųjų suma
    () => {
      const kitas = pasirink(SMAILUS)
      return uzdavinys(T8, {
        klausimas: `Du smailieji kampai yra ${s}° ir ${kitas}°. Kiek laipsnių turi jų suma ir koks tai kampas?`,
        atsakymas: String(s + kitas),
        atsakymasRodymui: `$${s + kitas}°$, ${rusis(s + kitas)}`,
        sprendimas: `$${s} + ${kitas} = ${s + kitas}$, tad kampas ${rusis(s + kitas)}.`,
      })
    },

    // 6. Trikampio kampas
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek laipsnių turi kiekvienas lygiakraščio trikampio kampas?',
        atsakymas: '60',
        atsakymasRodymui: `$60°$`,
        sprendimas: 'Trikampio kampų suma 180°, o visi trys kampai lygūs: $180 : 3 = 60$.',
      }),

    // 7. Iš brėžinio
    () =>
      uzdavinys(T8, {
        klausimas: 'Kampas brėžinyje pažymėtas kvadratėliu. Kiek jis turi laipsnių?',
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: 'Kvadratėlis žymi statųjį kampą.',
        brezinys: kampasSuRaidemis(90, { virsune: 'O', kraštines: ['A', 'B'], posukis: atsitiktinis(0, 40) }),
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T8, {
        klausimas: `Mokinys teigia, kad statusis kampas yra ${s}°. Kiek laipsnių jis iš tikrųjų turi?`,
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: `${s}° yra smailusis kampas, o statusis visada 90°.`,
      }),
  ])
}

// ── 8.3.4. Bukojo, pilnojo ir priešpilnio kampų dydžiai ─────────────────────

const T9 = 'kampu-dydziai-buki'

const A_DYDZIAI2 = [
  {
    klausimas: 'Koks gali būti bukojo kampo dydis?',
    atsakymas: '120',
    atsakymasRodymui: 'Pavyzdžiui, $120°$',
    sprendimas: 'Bukasis kampas yra tarp 90° ir 180°.',
  },
] as const

export const kampuDydziaiBuki: Generatorius = () => suBandymais(kurkDydzius2, A_DYDZIAI2, T9)

function kurkDydzius2(): Uzdavinys | null {
  const b = pasirink(BUKI)
  const p = pasirink([200, 210, 225, 240, 270, 300, 315, 330])

  return variacija([
    // 1. Bukojo ribos
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Koks gali būti bukojo kampo dydis?',
        variantai: ['nuo 90° iki 180°', 'nuo 0° iki 90°', 'nuo 180° iki 360°', 'lygiai 180°'],
        teisingas: 0,
        sprendimas: 'Bukasis kampas didesnis už statųjį, bet mažesnis už ištiestinį.',
      }),

    // 2. Ar bukasis
    () => {
      const l = pasirink([...SMAILUS, 90, ...BUKI, 180, p])
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Ar ${l}° kampas yra bukasis?`,
        variantai:
          l > 90 && l < 180 ? ['taip', 'ne', 'to nustatyti neįmanoma'] : ['ne', 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `Bukasis kampas yra tarp 90° ir 180°, o duotasis — ${l}°.`,
      })
    },

    // 3. Iki ištiestinio
    () =>
      uzdavinys(T9, {
        klausimas: `Kiek laipsnių trūksta ${b}° kampui iki ištiestinio?`,
        atsakymas: String(180 - b),
        atsakymasRodymui: `$${180 - b}°$`,
        sprendimas: `$180 - ${b} = ${180 - b}$.`,
      }),

    // 4. Priešpilnio dydis iš pilnojo
    () =>
      uzdavinys(T9, {
        klausimas: `Kampas ${360 - p}° mažesnis už pilnąjį. Kiek jis turi laipsnių?`,
        atsakymas: String(p),
        atsakymasRodymui: `$${p}°$`,
        sprendimas: `$360 - ${360 - p} = ${p}$.`,
      }),

    // 5. Rūšis pagal dydį
    () => {
      const l = pasirink([b, p, 180, 360])
      return uzdavinys(T9, {
        klausimas: `Koks kampas yra ${l}°?`,
        atsakymas: rusis(l),
        atsakymasRodymui: rusis(l).charAt(0).toUpperCase() + rusis(l).slice(1),
        sprendimas:
          'Smailusis < 90°, statusis = 90°, bukasis tarp 90° ir 180°, ištiestinis = 180°, priešpilnis tarp 180° ir 360°, pilnasis = 360°.',
      })
    },

    // 6. Bukojo ir smailiojo suma
    () => {
      const s = pasirink(SMAILUS)
      if (b + s > 360) return null
      return uzdavinys(T9, {
        klausimas: `Kampai ${b}° ir ${s}° sudedami. Kiek laipsnių turi jų suma ir koks tai kampas?`,
        atsakymas: String(b + s),
        atsakymasRodymui: `$${b + s}°$, ${rusis(b + s)}`,
        sprendimas: `$${b} + ${s} = ${b + s}$.`,
      })
    },

    // 7. Iš brėžinio
    () =>
      uzdavinys(T9, {
        klausimas: 'Koks kampas pažymėtas brėžinyje — bukasis ar priešpilnis?',
        atsakymas: 'priespilnis',
        atsakymasRodymui: 'Priešpilnis',
        sprendimas: 'Pažymėtoji dalis didesnė už pusę apskritimo, tad kampas didesnis už 180°.',
        brezinys: didelisKampas(p),
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Mokinys ${p}° kampą pavadino bukuoju. Koks jis iš tikrųjų?`,
        atsakymas: 'priespilnis',
        atsakymasRodymui: 'Priešpilnis',
        sprendimas: `Bukasis kampas mažesnis už 180°, o ${p}° didesnis.`,
      }),
  ])
}

// ── 8.3.5. Matlankis. Matuojame kampus ──────────────────────────────────────

const T10 = 'matlankis-matuojame'

const A_MATLANKIS = [
  {
    klausimas: 'Kur dedamas matlankio centras, matuojant kampą?',
    atsakymas: 'ant virsunes',
    atsakymasRodymui: 'Ant kampo viršūnės',
    sprendimas: 'O nulinis brūkšnelis sutapatinamas su viena kraštine.',
  },
] as const

export const matlankisMatuojame: Generatorius = () => suBandymais(kurkMatlanki, A_MATLANKIS, T10)

function kurkMatlanki(): Uzdavinys | null {
  const l = pasirink([...SMAILUS, ...BUKI].filter((x) => x % 5 === 0))

  return variacija([
    // 1. Kampo dydis iš matlankio
    () =>
      uzdavinys(T10, {
        klausimas: 'Kiek laipsnių turi ant matlankio uždėtas kampas?',
        atsakymas: String(l),
        atsakymasRodymui: `$${l}°$`,
        sprendimas: 'Kraštinė, einanti nuo nulinio brūkšnelio, rodo kampo dydį toje pačioje skalėje.',
        brezinys: matlankis(l),
      }),

    // 2. Kur dedamas centras
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kur dedamas matlankio centras, matuojant kampą?',
        variantai: [
          'ant kampo viršūnės',
          'ant vienos kraštinės galo',
          'kampo viduryje',
          'bet kur ant kraštinės',
        ],
        teisingas: 0,
        sprendimas: 'Centrą uždėjus ant viršūnės, nulinis brūkšnelis sutapatinamas su viena kraštine.',
      }),

    // 3. Kodėl dvi skalės
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kodėl matlankyje yra dvi skaičių eilės?',
        variantai: [
          'kad kampą būtų galima matuoti ir iš kairės, ir iš dešinės',
          'kad būtų galima matuoti ilgį',
          'viena eilė skirta smailiesiems, kita — bukiesiems kampams',
          'kad matlankis atrodytų tikslesnis',
        ],
        teisingas: 0,
        sprendimas: 'Skaičiuojama nuo tos skalės, kurios nulis sutampa su kampo kraštine.',
        brezinys: matlankis(l, false),
      }),

    // 4. Klaidinga skalė
    () =>
      uzdavinys(T10, {
        klausimas: `Mokinys pamatavo kampą ir perskaitė ${180 - l}°, nors skaičiavo ne nuo tos skalės, kurios nulis sutapo su kraštine. Koks tikrasis kampo dydis?`,
        atsakymas: String(l),
        atsakymasRodymui: `$${l}°$`,
        sprendimas: `Skalės viena kitą papildo iki 180°: $180 - ${180 - l} = ${l}$.`,
        brezinys: matlankis(l),
      }),

    // 5. Patikrinimas pagal rūšį
    () =>
      uzdavinys(T10, {
        klausimas: `Kampas pamatuotas matlankiu ir gauta ${l}°. Koks tai kampas?`,
        atsakymas: rusis(l),
        atsakymasRodymui: rusis(l).charAt(0).toUpperCase() + rusis(l).slice(1),
        sprendimas: `${l}° ${l < 90 ? 'mažesnis' : 'didesnis'} už 90°.`,
      }),

    // 6. Kiek brūkšnelių
    () =>
      uzdavinys(T10, {
        klausimas: 'Matlankio skalė padalyta laipsniais nuo 0° iki 180°. Kiek laipsnių yra tarp dviejų gretimų dešimčių brūkšnelių?',
        atsakymas: '10',
        atsakymasRodymui: `$10°$`,
        sprendimas: 'Dešimčių brūkšneliai eina kas 10°.',
      }),

    // 7. Ar galima pamatuoti priešpilnį
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kaip matlankiu, kurio skalė siekia 180°, pamatuoti 250° kampą?',
        variantai: [
          'pamatuoti likusį 110° kampą ir iš 360° jį atimti',
          'to padaryti neįmanoma',
          'pamatuoti bet kurią dalį ir padauginti iš dviejų',
          'pridėti 180° prie pamatuoto dydžio',
        ],
        teisingas: 0,
        sprendimas: '$360 - 110 = 250$.',
      }),

    // 8. Matavimas su papildymu
    () => {
      const kitas = pasirink(SMAILUS)
      if (l + kitas > 180) return null
      return uzdavinys(T10, {
        klausimas: `Iš vienos viršūnės nubrėžti trys spinduliai. Pirmasis ir antrasis sudaro ${l}° kampą, antrasis ir trečiasis — ${kitas}°. Kiek laipsnių turi kampas tarp pirmojo ir trečiojo spindulio?`,
        atsakymas: String(l + kitas),
        atsakymasRodymui: `$${l + kitas}°$`,
        sprendimas: `Kampai sudedami: $${l} + ${kitas} = ${l + kitas}$.`,
      })
    },
  ])
}

// ── 8.3.6. Braižome kampą. Kampo pusiaukampinė ──────────────────────────────

const T11 = 'braizome-pusiaukampine'

const A_PUSIAUKAMPINE = [
  {
    klausimas: 'Į kiek dalių pusiaukampinė dalija kampą?',
    atsakymas: '2',
    atsakymasRodymui: '$2$ lygias dalis',
    sprendimas: 'Pusiaukampinė dalija kampą pusiau.',
  },
] as const

export const braizomePusiaukampine: Generatorius = () => suBandymais(kurkPusiaukampine, A_PUSIAUKAMPINE, T11)

function kurkPusiaukampine(): Uzdavinys | null {
  const l = pasirink([...SMAILUS, ...BUKI].filter((x) => x % 2 === 0))

  return variacija([
    // 1. Kas yra pusiaukampinė
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kas yra kampo pusiaukampinė?',
        variantai: [
          'spindulys iš viršūnės, dalijantis kampą į du lygius kampus',
          'atkarpa, jungianti kraštinių galus',
          'tiesė, statmena kampo kraštinei',
          'kampo kraštinių vidurio taškas',
        ],
        teisingas: 0,
        sprendimas: 'Pusiaukampinė visada išeina iš viršūnės.',
        brezinys: pusiaukampine(l),
      }),

    // 2. Pusės dydis
    () =>
      uzdavinys(T11, {
        klausimas: `Nubrėžta ${l}° kampo pusiaukampinė. Kiek laipsnių turi kiekvienas gautas kampas?`,
        atsakymas: String(l / 2),
        atsakymasRodymui: `$${l / 2}°$`,
        sprendimas: `$${l} : 2 = ${l / 2}$.`,
        brezinys: pusiaukampine(l),
      }),

    // 3. Atvirkštinis
    () =>
      uzdavinys(T11, {
        klausimas: `Pusiaukampinė padalijo kampą į du ${l / 2}° kampus. Kiek laipsnių turėjo pradinis kampas?`,
        atsakymas: String(l),
        atsakymasRodymui: `$${l}°$`,
        sprendimas: `$${l / 2} \\cdot 2 = ${l}$.`,
      }),

    // 4. Stačiojo pusiaukampinė
    () =>
      uzdavinys(T11, {
        klausimas: 'Kiek laipsnių turi kiekvienas kampas, gautas nubrėžus stačiojo kampo pusiaukampinę?',
        atsakymas: '45',
        atsakymasRodymui: `$45°$`,
        sprendimas: '$90 : 2 = 45$.',
      }),

    // 5. Ištiestinio pusiaukampinė
    () =>
      uzdavinys(T11, {
        klausimas: 'Koks kampas gaunamas nubrėžus ištiestinio kampo pusiaukampinę? Užrašyk jo dydį.',
        atsakymas: '90',
        atsakymasRodymui: `$90°$ — statusis`,
        sprendimas: '$180 : 2 = 90$, tad pusiaukampinė statmena tiesei.',
      }),

    // 6. Braižymas — kiek atidėti
    () => {
      const kampas = pasirink([...SMAILUS, ...BUKI])
      return uzdavinys(T11, {
        klausimas: `Braižant ${kampas}° kampą matlankiu, nuo nulinio brūkšnelio atidedamas taškas. Ties kuriuo skalės skaičiumi jį reikia pažymėti?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}$`,
        sprendimas: 'Taškas dedamas ties tuo skaičiumi, kiek laipsnių turi brėžiamas kampas.',
        brezinys: matlankis(kampas, false),
      })
    },

    // 7. Dvi pusiaukampinės
    () => {
      if (l % 4 !== 0) return null
      return uzdavinys(T11, {
        klausimas: `${l}° kampo pusiaukampinė nubrėžta, o paskui nubrėžta ir vienos gautos dalies pusiaukampinė. Kiek laipsnių turi mažiausias gautas kampas?`,
        atsakymas: String(l / 4),
        atsakymasRodymui: `$${l / 4}°$`,
        sprendimas: `$${l} : 2 = ${l / 2}$, tada $${l / 2} : 2 = ${l / 4}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T11, {
        klausimas: `Mokinys teigia, kad ${l}° kampo pusiaukampinė sudaro su kraštine ${l}° kampą. Kiek laipsnių ji su ja sudaro iš tikrųjų?`,
        atsakymas: String(l / 2),
        atsakymasRodymui: `$${l / 2}°$`,
        sprendimas: 'Pusiaukampinė dalija kampą pusiau, tad su kiekviena kraštine sudaro pusę pradinio kampo.',
      }),
  ])
}

// ── 8.4.1. Gretutiniai kampai ───────────────────────────────────────────────

const T12 = 'gretutiniai-kampai'

const A_GRETUTINIAI = [
  {
    klausimas: 'Kiek laipsnių turi dviejų gretutinių kampų suma?',
    atsakymas: '180',
    atsakymasRodymui: '$180°$',
    sprendimas: 'Jų nebendros kraštinės sudaro tiesę.',
  },
] as const

export const gretutiniaiKampai: Generatorius = () => suBandymais(kurkGretutinius, A_GRETUTINIAI, T12)

function kurkGretutinius(): Uzdavinys | null {
  const l = pasirink([...SMAILUS, ...BUKI])

  return variacija([
    // 1. Suma
    () =>
      uzdavinys(T12, {
        klausimas: 'Kiek laipsnių turi dviejų gretutinių kampų suma?',
        atsakymas: '180',
        atsakymasRodymui: '$180°$',
        sprendimas: 'Gretutinių kampų nebendros kraštinės sudaro tiesę, tad kartu jie sudaro ištiestinį kampą.',
        brezinys: gretutiniai(l, 'desinysis'),
      }),

    // 2. Rask gretutinį
    () =>
      uzdavinys(T12, {
        klausimas: `Vienas gretutinis kampas yra ${l}°. Kiek laipsnių turi kitas?`,
        atsakymas: String(180 - l),
        atsakymasRodymui: `$${180 - l}°$`,
        sprendimas: `$180 - ${l} = ${180 - l}$.`,
        brezinys: gretutiniai(l, 'desinysis'),
      }),

    // 3. Iš brėžinio
    () =>
      uzdavinys(T12, {
        klausimas: 'Kiek laipsnių turi brėžinyje klaustuku pažymėtas kampas?',
        atsakymas: String(l),
        atsakymasRodymui: `$${l}°$`,
        sprendimas: `Kampai gretutiniai: $180 - ${180 - l} = ${l}$.`,
        brezinys: gretutiniai(l, 'kairysis'),
      }),

    // 4. Kokie kampai vadinami gretutiniais
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kokie du kampai vadinami gretutiniais?',
        variantai: [
          'turintys bendrą kraštinę, o kitos dvi kraštinės sudaro tiesę',
          'bet kurie du kampai, kurių suma 180°',
          'kampai, esantys vienas prieš kitą',
          'kampai, kurių kraštinės lygiagrečios',
        ],
        teisingas: 0,
        sprendimas: 'Iš to ir seka, kad jų suma visada 180°.',
      }),

    // 5. Kai abu lygūs
    () =>
      uzdavinys(T12, {
        klausimas: 'Du gretutiniai kampai lygūs. Kiek laipsnių turi kiekvienas?',
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: '$180 : 2 = 90$ — abu statieji.',
      }),

    // 6. Kai vienas kartų didesnis
    () => {
      const kartai = pasirink([2, 3, 5])
      if (180 % (kartai + 1) !== 0) return null
      const mazasis = 180 / (kartai + 1)
      return uzdavinys(T12, {
        klausimas: `Vienas gretutinis kampas ${kartai} kartus didesnis už kitą. Kiek laipsnių turi mažesnysis?`,
        atsakymas: String(mazasis),
        atsakymasRodymui: `$${mazasis}°$`,
        sprendimas: `Kartu jie sudaro ${kartai + 1} vienodas dalis: $180 : ${kartai + 1} = ${mazasis}$.`,
      })
    },

    // 7. Rūšis
    () =>
      uzdavinys(T12, {
        klausimas: `Vienas gretutinis kampas yra ${l}°. Koks yra kitas — smailusis ar bukasis?`,
        atsakymas: rusis(180 - l),
        atsakymasRodymui: rusis(180 - l).charAt(0).toUpperCase() + rusis(180 - l).slice(1),
        sprendimas: `$180 - ${l} = ${180 - l}$, tad kampas ${rusis(180 - l)}.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T12, {
        klausimas: `Mokinys teigia, kad ${l}° kampo gretutinis yra ${360 - l}°. Kiek laipsnių jis turi iš tikrųjų?`,
        atsakymas: String(180 - l),
        atsakymasRodymui: `$${180 - l}°$`,
        sprendimas: 'Gretutinių kampų suma yra 180°, o ne 360°.',
      }),
  ])
}

// ── 8.4.2. Kryžminiai kampai ────────────────────────────────────────────────

const T13 = 'kryzminiai-kampai'

const A_KRYZMINIAI = [
  {
    klausimas: 'Kokie yra kryžminiai kampai?',
    atsakymas: 'lygus',
    atsakymasRodymui: 'Lygūs',
    sprendimas: 'Kryžminiai kampai visada lygūs.',
  },
] as const

export const kryzminiaiKampai: Generatorius = () => suBandymais(kurkKryzminius, A_KRYZMINIAI, T13)

function kurkKryzminius(): Uzdavinys | null {
  const l = pasirink([...SMAILUS, ...BUKI])

  return variacija([
    // 1. Kryžminis lygus
    () =>
      uzdavinys(T13, {
        klausimas: `Dvi tiesės susikerta. Vienas kampas yra ${l}°. Kiek laipsnių turi jam kryžminis kampas?`,
        atsakymas: String(l),
        atsakymasRodymui: `$${l}°$`,
        sprendimas: 'Kryžminiai kampai lygūs.',
        brezinys: kryzminiai(l, 0),
      }),

    // 2. Gretimas kampas iš brėžinio
    () =>
      uzdavinys(T13, {
        klausimas: 'Kiek laipsnių turi brėžinyje 2 numeriu pažymėtas kampas?',
        atsakymas: String(180 - l),
        atsakymasRodymui: `$${180 - l}°$`,
        sprendimas: `Jis gretutinis pažymėtajam: $180 - ${l} = ${180 - l}$.`,
        brezinys: kryzminiai(l, 0),
      }),

    // 3. Kurie kampai kryžminiai
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Kokie du kampai vadinami kryžminiais?',
        variantai: [
          'kampai, kurių kraštinės yra viena kitos tęsiniai',
          'kampai, turintys bendrą kraštinę',
          'kampai, kurių suma 180°',
          'kampai, esantys vienas šalia kito',
        ],
        teisingas: 0,
        sprendimas: 'Susikertančios tiesės sudaro dvi kryžminių kampų poras.',
        brezinys: kryzminiai(l, 0),
      }),

    // 4. Kiek kampų
    () =>
      uzdavinys(T13, {
        klausimas: 'Kiek kampų susidaro susikirtus dviem tiesėms?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Jie sudaro dvi kryžminių kampų poras.',
        brezinys: kryzminiai(l, 0),
      }),

    // 5. Visų suma
    () =>
      uzdavinys(T13, {
        klausimas: 'Kiek laipsnių turi visų keturių kampų, susidariusių susikirtus dviem tiesėms, suma?',
        atsakymas: '360',
        atsakymasRodymui: `$360°$`,
        sprendimas: 'Kartu jie sudaro pilnąjį kampą.',
      }),

    // 6. Kai visi lygūs
    () =>
      uzdavinys(T13, {
        klausimas: 'Visi keturi susikirtus dviem tiesėms susidarę kampai lygūs. Kiek laipsnių turi kiekvienas?',
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: '$360 : 4 = 90$ — tiesės statmenos.',
      }),

    // 7. Trys likusieji
    () =>
      uzdavinys(T13, {
        klausimas: `Vienas iš keturių susikirtimo kampų yra ${l}°. Kiek laipsnių turi kampų, lygių ${180 - l}°, pora — užrašyk, kiek tokių kampų yra.`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: `Du kampai lygūs ${l}°, ir dar du — jiems gretutiniai ${180 - l}°.`,
        brezinys: kryzminiai(l, 0),
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T13, {
        klausimas: `Mokinys teigia, kad ${l}° kampui kryžminis kampas yra ${180 - l}°. Kiek laipsnių jis turi iš tikrųjų?`,
        atsakymas: String(l),
        atsakymasRodymui: `$${l}°$`,
        sprendimas: `${180 - l}° yra gretutinis kampas, o kryžminis lygus pradiniam.`,
        brezinys: kryzminiai(l, 0),
      }),
  ])
}
