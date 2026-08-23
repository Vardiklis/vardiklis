import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { keturkampis } from './penktokams-simetrijos-vaizdai'
import { staciakampisSuMatais } from './treciokams-matai-vaizdai'
import { apskritimas } from './septintokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 7 klasės temos „Trikampių ir keturkampių plotai“ ir „Apskritimas ir
 * skritulys“ — devynios potemės.
 *
 * Apskritimo uždaviniuose atsakymo su $\pi$ suvesti neįmanoma, tad klausiama
 * arba koeficiento prie $\pi$ (tada atsakymas sveikasis), arba apytikslės
 * reikšmės, kai $\pi \approx 3$. Taip mokinys vis tiek turi pritaikyti
 * formulę, bet atsakymą gali įrašyti.
 */

// ── 8.1. Stačiakampio, kvadrato ir stačiojo trikampio plotų formulės ────────

const T1 = 'pagrindiniu-figuru-plotai'

const A_PAGRINDINIAI = [
  {
    klausimas: 'Stačiakampio kraštinės 7 cm ir 4 cm. Koks jo plotas?',
    atsakymas: '28',
    atsakymasRodymui: '$28$ cm²',
    sprendimas: '$7 \\cdot 4 = 28$.',
  },
] as const

export const pagrindiniuFiguruPlotai: Generatorius = () => suBandymais(kurkPagrindinius, A_PAGRINDINIAI, T1)

function kurkPagrindinius(): Uzdavinys | null {
  const a = atsitiktinis(3, 20)
  const b = atsitiktinis(3, 20)

  return variacija([
    // 1. Stačiakampio plotas
    () =>
      uzdavinys(T1, {
        klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Koks jo plotas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
        brezinys: staciakampisSuMatais(a, b),
      }),

    // 2. Kvadrato plotas
    () =>
      uzdavinys(T1, {
        klausimas: `Kvadrato kraštinė ${a} cm. Koks jo plotas?`,
        atsakymas: String(a * a),
        atsakymasRodymui: `$${a * a}$ cm²`,
        sprendimas: `$${a} \\cdot ${a} = ${a * a}$.`,
      }),

    // 3. Stačiojo trikampio plotas
    () => {
      if ((a * b) % 2 !== 0) return null
      return uzdavinys(T1, {
        klausimas: `Stačiojo trikampio statiniai ${a} cm ir ${b} cm. Koks jo plotas?`,
        atsakymas: String((a * b) / 2),
        atsakymasRodymui: `$${(a * b) / 2}$ cm²`,
        sprendimas: `$${a} \\cdot ${b} : 2 = ${(a * b) / 2}$.`,
      })
    },

    // 4. Formulės
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Sujunk figūrą su jos ploto formule.',
        poros: [
          { kaire: 'stačiakampis', desine: '$ab$' },
          { kaire: 'kvadratas', desine: '$a^2$' },
          { kaire: 'statusis trikampis', desine: '$\\dfrac{ab}{2}$' },
          { kaire: 'lygiagretainis', desine: '$ah$' },
        ],
        sprendimas: 'Trikampio plotas visada dvigubai mažesnis už atitinkamo stačiakampio.',
      }),

    // 5. Trūkstama kraštinė
    () =>
      uzdavinys(T1, {
        klausimas: `Stačiakampio plotas ${a * b} cm², viena kraštinė ${a} cm. Kokio ilgio kita kraštinė?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `$${a * b} : ${a} = ${b}$.`,
      }),

    // 6. Kvadrato kraštinė iš ploto
    () =>
      uzdavinys(T1, {
        klausimas: `Kvadrato plotas ${a * a} cm². Kokio ilgio jo kraštinė?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ cm`,
        sprendimas: `Ieškomas skaičius, kurio kvadratas lygus ${a * a}.`,
      }),

    // 7. Ploto vienetai
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kodėl plotas matuojamas kvadratiniais vienetais?',
        variantai: [
          'nes dauginami du ilgiai',
          'nes figūros yra kvadratai',
          'nes taip sutarta',
          'nes plotas visada didesnis už ilgį',
        ],
        teisingas: 0,
        sprendimas: '$\\text{cm} \\cdot \\text{cm} = \\text{cm}^2$.',
      }),
  ])
}

// ── 8.2. Trikampio ploto formulė ────────────────────────────────────────────

const T2 = 'trikampio-plotas-7'

const A_TRIKAMPIO = [
  {
    klausimas: 'Trikampio kraštinė 10 cm, į ją nuleista aukštinė 6 cm. Koks plotas?',
    atsakymas: '30',
    atsakymasRodymui: '$30$ cm²',
    sprendimas: '$10 \\cdot 6 : 2 = 30$.',
  },
] as const

export const trikampioPlotas7: Generatorius = () => suBandymais(kurkTrikampioPlota, A_TRIKAMPIO, T2)

function kurkTrikampioPlota(): Uzdavinys | null {
  const a = atsitiktinis(4, 20)
  const h = atsitiktinis(3, 16)
  if ((a * h) % 2 !== 0) return null
  const plotas = (a * h) / 2

  return variacija([
    // 1. Plotas
    () =>
      uzdavinys(T2, {
        klausimas: `Trikampio kraštinė ${a} cm, į ją nuleista aukštinė ${h} cm. Koks trikampio plotas?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `$${a} \\cdot ${h} : 2 = ${plotas}$.`,
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kokia yra trikampio ploto formulė?',
        variantai: ['$\\dfrac{ah}{2}$', '$ah$', '$2ah$', '$a + h$'],
        teisingas: 0,
        sprendimas: '$a$ — kraštinė, $h$ — į ją nuleista aukštinė.',
      }),

    // 3. Aukštinė iš ploto
    () =>
      uzdavinys(T2, {
        klausimas: `Trikampio plotas ${plotas} cm², kraštinė ${a} cm. Kokio ilgio į ją nuleista aukštinė?`,
        atsakymas: String(h),
        atsakymasRodymui: `$${h}$ cm`,
        sprendimas: `$${plotas} \\cdot 2 : ${a} = ${h}$.`,
      }),

    // 4. Kraštinė iš ploto
    () =>
      uzdavinys(T2, {
        klausimas: `Trikampio plotas ${plotas} cm², aukštinė ${h} cm. Kokio ilgio kraštinė, į kurią nuleista ši aukštinė?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ cm`,
        sprendimas: `$${plotas} \\cdot 2 : ${h} = ${a}$.`,
      }),

    // 5. Kodėl dalijama iš 2
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kodėl trikampio ploto formulėje dalijama iš 2?',
        variantai: [
          'nes du tokie trikampiai sudaro lygiagretainį',
          'nes trikampis turi tris kraštines',
          'nes aukštinė perpus trumpesnė',
          'nes taip sutarta',
        ],
        teisingas: 0,
        sprendimas: 'Trikampis yra lygiagretainio pusė.',
      }),

    // 6. Kelios aukštinės
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ar trikampio plotą galima apskaičiuoti su bet kuria kraštine?',
        variantai: [
          'taip, jei imama į tą kraštinę nuleista aukštinė',
          'ne, tik su ilgiausia kraštine',
          'ne, tik su pagrindu',
          'taip, su bet kuria aukštine',
        ],
        teisingas: 0,
        sprendimas: 'Kraštinė ir aukštinė turi atitikti viena kitą.',
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Mokinys apskaičiavo trikampio, kurio kraštinė ${a} cm ir aukštinė ${h} cm, plotą ${a * h} cm². Koks plotas iš tikrųjų?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: 'Pamiršta padalyti iš 2 — taip apskaičiuotas lygiagretainio plotas.',
      }),
  ])
}

// ── 8.3. Lygiagretainio ploto formulė ───────────────────────────────────────

const T3 = 'lygiagretainio-plotas'

const A_LYGIAGRETAINIO = [
  {
    klausimas: 'Lygiagretainio kraštinė 8 cm, į ją nuleista aukštinė 5 cm. Koks plotas?',
    atsakymas: '40',
    atsakymasRodymui: '$40$ cm²',
    sprendimas: '$8 \\cdot 5 = 40$.',
  },
] as const

export const lygiagretainioPlotas: Generatorius = () => suBandymais(kurkLygiagretainioPlota, A_LYGIAGRETAINIO, T3)

function kurkLygiagretainioPlota(): Uzdavinys | null {
  const a = atsitiktinis(4, 20)
  const h = atsitiktinis(3, 15)
  const plotas = a * h

  return variacija([
    // 1. Plotas
    () =>
      uzdavinys(T3, {
        klausimas: `Lygiagretainio kraštinė ${a} cm, į ją nuleista aukštinė ${h} cm. Koks jo plotas?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `$${a} \\cdot ${h} = ${plotas}$.`,
        brezinys: keturkampis('lygiagretainis'),
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kokia yra lygiagretainio ploto formulė?',
        variantai: ['$ah$', '$\\dfrac{ah}{2}$', '$ab$, kur $a$ ir $b$ — gretimos kraštinės', '$4a$'],
        teisingas: 0,
        sprendimas: 'Dauginama kraštinė ir į ją nuleista aukštinė, o ne dvi gretimos kraštinės.',
      }),

    // 3. Aukštinė iš ploto
    () =>
      uzdavinys(T3, {
        klausimas: `Lygiagretainio plotas ${plotas} cm², kraštinė ${a} cm. Kokio ilgio į ją nuleista aukštinė?`,
        atsakymas: String(h),
        atsakymasRodymui: `$${h}$ cm`,
        sprendimas: `$${plotas} : ${a} = ${h}$.`,
      }),

    // 4. Kodėl ne kraštinių sandauga
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kodėl lygiagretainio ploto negalima skaičiuoti kaip gretimų kraštinių sandaugos?',
        variantai: [
          'nes aukštinė trumpesnė už šoninę kraštinę',
          'nes kraštinės nelygios',
          'nes lygiagretainis nėra keturkampis',
          'iš tikrųjų galima',
        ],
        teisingas: 0,
        sprendimas: 'Taip skaičiuoti galima tik tada, kai kampai statieji, t. y. stačiakampiui.',
      }),

    // 5. Ryšys su stačiakampiu
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip lygiagretainio plotas susijęs su stačiakampio plotu?',
        variantai: [
          'lygiagretainį galima perkirpti ir sudėti į to paties ploto stačiakampį',
          'lygiagretainio plotas visada mažesnis',
          'lygiagretainio plotas visada didesnis',
          'jie nesusiję',
        ],
        teisingas: 0,
        sprendimas: 'Todėl ir formulė ta pati: kraštinė kartu su aukštine.',
      }),

    // 6. Trikampio ir lygiagretainio ryšys
    () => {
      if (plotas % 2 !== 0) return null
      return uzdavinys(T3, {
        klausimas: `Lygiagretainio plotas ${plotas} cm². Koks yra trikampio, gauto nubrėžus lygiagretainio įstrižainę, plotas?`,
        atsakymas: String(plotas / 2),
        atsakymasRodymui: `$${plotas / 2}$ cm²`,
        sprendimas: 'Įstrižainė dalija lygiagretainį į du lygius trikampius.',
      })
    },

    // 7. Kraštinė iš ploto
    () =>
      uzdavinys(T3, {
        klausimas: `Lygiagretainio plotas ${plotas} cm², aukštinė ${h} cm. Kokio ilgio kraštinė, į kurią nuleista ši aukštinė?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ cm`,
        sprendimas: `$${plotas} : ${h} = ${a}$.`,
      }),
  ])
}

// ── 8.4. Rombo ploto formulė ────────────────────────────────────────────────

const T4 = 'rombo-plotas'

const A_ROMBO = [
  {
    klausimas: 'Rombo įstrižainės 8 cm ir 6 cm. Koks jo plotas?',
    atsakymas: '24',
    atsakymasRodymui: '$24$ cm²',
    sprendimas: '$8 \\cdot 6 : 2 = 24$.',
  },
] as const

export const romboPlotas: Generatorius = () => suBandymais(kurkRomboPlota, A_ROMBO, T4)

function kurkRomboPlota(): Uzdavinys | null {
  const d1 = atsitiktinis(4, 20)
  const d2 = atsitiktinis(4, 20)
  if ((d1 * d2) % 2 !== 0) return null
  const plotas = (d1 * d2) / 2

  return variacija([
    // 1. Plotas iš įstrižainių
    () =>
      uzdavinys(T4, {
        klausimas: `Rombo įstrižainės ${d1} cm ir ${d2} cm. Koks jo plotas?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `$${d1} \\cdot ${d2} : 2 = ${plotas}$.`,
        brezinys: keturkampis('rombas'),
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kokia yra rombo ploto formulė per įstrižaines?',
        variantai: [
          '$\\dfrac{d_1 d_2}{2}$',
          '$d_1 d_2$',
          '$\\dfrac{d_1 + d_2}{2}$',
          '$2 d_1 d_2$',
        ],
        teisingas: 0,
        sprendimas: 'Įstrižainės statmenos, tad rombas telpa į stačiakampį, kurio kraštinės lygios įstrižainėms.',
      }),

    // 3. Trūkstama įstrižainė
    () =>
      uzdavinys(T4, {
        klausimas: `Rombo plotas ${plotas} cm², viena įstrižainė ${d1} cm. Kokio ilgio kita įstrižainė?`,
        atsakymas: String(d2),
        atsakymasRodymui: `$${d2}$ cm`,
        sprendimas: `$${plotas} \\cdot 2 : ${d1} = ${d2}$.`,
      }),

    // 4. Per kraštinę ir aukštinę
    () => {
      const a = atsitiktinis(4, 15)
      const h = atsitiktinis(3, a)
      return uzdavinys(T4, {
        klausimas: `Rombo kraštinė ${a} cm, aukštinė ${h} cm. Koks jo plotas?`,
        atsakymas: String(a * h),
        atsakymasRodymui: `$${a * h}$ cm²`,
        sprendimas: `Rombas yra lygiagretainis: $${a} \\cdot ${h} = ${a * h}$.`,
      })
    },

    // 5. Kodėl dalijama iš 2
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl rombo ploto formulėje su įstrižainėmis dalijama iš 2?',
        variantai: [
          'nes rombas užima pusę stačiakampio, kurio kraštinės lygios įstrižainėms',
          'nes įstrižainių yra dvi',
          'nes rombas turi keturias kraštines',
          'nes įstrižainės dalijasi pusiau',
        ],
        teisingas: 0,
        sprendimas: 'Įstrižainės statmenos, tad rombą galima įrašyti į tokį stačiakampį.',
      }),

    // 6. Kvadrato plotas per įstrižainę
    () => {
      const d = atsitiktinis(4, 18)
      if ((d * d) % 2 !== 0) return null
      return uzdavinys(T4, {
        klausimas: `Kvadrato įstrižainė ${d} cm. Koks jo plotas?`,
        atsakymas: String((d * d) / 2),
        atsakymasRodymui: `$${(d * d) / 2}$ cm²`,
        sprendimas: `Kvadratas yra rombas, kurio abi įstrižainės lygios: $${d} \\cdot ${d} : 2 = ${(d * d) / 2}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Mokinys apskaičiavo rombo su ${d1} cm ir ${d2} cm įstrižainėmis plotą ${d1 * d2} cm². Koks plotas iš tikrųjų?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: 'Įstrižainių sandaugą reikia dar padalyti iš 2.',
      }),
  ])
}

// ── 8.5. Trapecijos ploto formulė ───────────────────────────────────────────

const T5 = 'trapecijos-plotas'

const A_TRAPECIJOS = [
  {
    klausimas: 'Trapecijos pagrindai 7 cm ir 5 cm, aukštinė 4 cm. Koks plotas?',
    atsakymas: '24',
    atsakymasRodymui: '$24$ cm²',
    sprendimas: '$(7 + 5) : 2 \\cdot 4 = 24$.',
  },
] as const

export const trapecijosPlotas: Generatorius = () => suBandymais(kurkTrapecijosPlota, A_TRAPECIJOS, T5)

function kurkTrapecijosPlota(): Uzdavinys | null {
  const a = atsitiktinis(6, 20)
  const b = atsitiktinis(3, a - 1)
  const h = atsitiktinis(3, 14)
  if (((a + b) * h) % 2 !== 0) return null
  const plotas = ((a + b) * h) / 2

  return variacija([
    // 1. Plotas
    () =>
      uzdavinys(T5, {
        klausimas: `Trapecijos pagrindai ${a} cm ir ${b} cm, aukštinė ${h} cm. Koks jos plotas?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `$(${a} + ${b}) : 2 \\cdot ${h} = ${plotas}$.`,
        brezinys: keturkampis('trapecija'),
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kokia yra trapecijos ploto formulė?',
        variantai: [
          '$\\dfrac{a + b}{2} \\cdot h$',
          '$(a + b) \\cdot h$',
          '$\\dfrac{ab}{2}$',
          '$a \\cdot b \\cdot h$',
        ],
        teisingas: 0,
        sprendimas: 'Pagrindų pussumė dauginama iš aukštinės.',
      }),

    // 3. Per vidurinę liniją
    () => {
      if ((a + b) % 2 !== 0) return null
      return uzdavinys(T5, {
        klausimas: `Trapecijos vidurinė linija ${(a + b) / 2} cm, aukštinė ${h} cm. Koks jos plotas?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `Vidurinė linija lygi pagrindų pussumei: $${(a + b) / 2} \\cdot ${h} = ${plotas}$.`,
      })
    },

    // 4. Aukštinė iš ploto
    () => {
      if ((a + b) % 2 !== 0) return null
      return uzdavinys(T5, {
        klausimas: `Trapecijos plotas ${plotas} cm², pagrindai ${a} cm ir ${b} cm. Kokio ilgio jos aukštinė?`,
        atsakymas: String(h),
        atsakymasRodymui: `$${h}$ cm`,
        sprendimas: `$${plotas} : ${(a + b) / 2} = ${h}$.`,
      })
    },

    // 5. Trūkstamas pagrindas
    () =>
      uzdavinys(T5, {
        klausimas: `Trapecijos plotas ${plotas} cm², aukštinė ${h} cm, vienas pagrindas ${a} cm. Kokio ilgio kitas pagrindas?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `$${plotas} \\cdot 2 : ${h} = ${a + b}$, tada $${a + b} - ${a} = ${b}$.`,
      }),

    // 6. Kodėl pussumė
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kodėl trapecijos ploto formulėje imama pagrindų pussumė?',
        variantai: [
          'nes tai vidutinis figūros plotis, o jį padauginus iš aukštinės gaunamas plotas',
          'nes pagrindų yra du',
          'nes trapecija yra pusė lygiagretainio',
          'nes taip sutarta',
        ],
        teisingas: 0,
        sprendimas: 'Pagrindų pussumė lygi vidurinei linijai.',
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Mokinys apskaičiavo trapecijos plotą $(${a} + ${b}) \\cdot ${h} = ${(a + b) * h}$ cm². Koks plotas iš tikrųjų?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: 'Pamiršta padalyti pagrindų sumą iš 2.',
      }),
  ])
}

// ── 9.1. Apskritimas ────────────────────────────────────────────────────────

const T6 = 'apskritimas-7'

const A_APSKRITIMAS = [
  {
    klausimas: 'Apskritimo spindulys 6 cm. Kokio ilgio jo skersmuo?',
    atsakymas: '12',
    atsakymasRodymui: '$12$ cm',
    sprendimas: 'Skersmuo dvigubai ilgesnis už spindulį.',
  },
] as const

export const apskritimas7: Generatorius = () => suBandymais(kurkApskritima, A_APSKRITIMAS, T6)

function kurkApskritima(): Uzdavinys | null {
  const r = atsitiktinis(2, 20)

  return variacija([
    // 1. Skersmuo iš spindulio
    () =>
      uzdavinys(T6, {
        klausimas: `Apskritimo spindulys ${r} cm. Kokio ilgio jo skersmuo?`,
        atsakymas: String(2 * r),
        atsakymasRodymui: `$${2 * r}$ cm`,
        sprendimas: `$${r} \\cdot 2 = ${2 * r}$.`,
        brezinys: apskritimas({ spindulys: 'r' }),
      }),

    // 2. Spindulys iš skersmens
    () =>
      uzdavinys(T6, {
        klausimas: `Apskritimo skersmuo ${2 * r} cm. Kokio ilgio jo spindulys?`,
        atsakymas: String(r),
        atsakymasRodymui: `$${r}$ cm`,
        sprendimas: `$${2 * r} : 2 = ${r}$.`,
        brezinys: apskritimas({ skersmuo: 'd' }),
      }),

    // 3. Kas yra apskritimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kas yra apskritimas?',
        variantai: [
          'taškų, vienodai nutolusių nuo centro, linija',
          'apskritimo apribota plokštumos dalis',
          'atkarpa per centrą',
          'bet kokia uždara kreivė',
        ],
        teisingas: 0,
        sprendimas: 'Apskritimo apribota plokštumos dalis vadinama skrituliu.',
      }),

    // 4. Styga ir skersmuo
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kuri styga yra ilgiausia?',
        variantai: ['skersmuo', 'spindulys', 'lankas', 'visos vienodos'],
        teisingas: 0,
        sprendimas: 'Skersmuo yra styga, einanti per centrą.',
      }),

    // 5. Kiek spindulių
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kiek spindulių galima nubrėžti viename apskritime?',
        variantai: ['be galo daug', 'vieną', 'du', 'keturis'],
        teisingas: 0,
        sprendimas: 'Spindulys jungia centrą su bet kuriuo apskritimo tašku.',
      }),

    // 6. Taško padėtis
    () => {
      const atstumas = r + atsitiktinis(1, 5)
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Apskritimo spindulys ${r} cm, o taškas nuo centro nutolęs ${atstumas} cm. Kur yra tas taškas?`,
        variantai: ['už apskritimo', 'ant apskritimo', 'apskritimo viduje', 'centre'],
        teisingas: 0,
        sprendimas: `$${atstumas} > ${r}$, tad taškas yra išorėje.`,
      })
    },

    // 7. Skirtumas nuo skritulio
    () =>
      poruUzdavinys(naujasId(T6), T6, {
        klausimas: 'Sujunk sąvoką su jos apibrėžimu.',
        poros: [
          { kaire: 'apskritimas', desine: 'linija' },
          { kaire: 'skritulys', desine: 'apskritimo apribota sritis' },
          { kaire: 'spindulys', desine: 'atkarpa nuo centro iki apskritimo' },
          { kaire: 'skersmuo', desine: 'styga per centrą' },
        ],
        sprendimas: 'Apskritimas turi ilgį, o skritulys — plotą.',
      }),
  ])
}

// ── 9.2. Apskritimo ilgis ───────────────────────────────────────────────────

const T7 = 'apskritimo-ilgis'

const A_ILGIS = [
  {
    klausimas: 'Apskritimo spindulys 5 cm. Koks jo ilgis? Užrašyk koeficientą prie $\\pi$.',
    atsakymas: '10',
    atsakymasRodymui: '$10\\pi$ cm',
    sprendimas: '$C = 2\\pi r = 2 \\cdot 5 \\cdot \\pi = 10\\pi$.',
  },
] as const

export const apskritimoIlgis: Generatorius = () => suBandymais(kurkIlgi, A_ILGIS, T7)

function kurkIlgi(): Uzdavinys | null {
  const r = atsitiktinis(2, 20)

  return variacija([
    // 1. Ilgis per spindulį
    () =>
      uzdavinys(T7, {
        klausimas: `Apskritimo spindulys ${r} cm. Koks jo ilgis? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(2 * r),
        atsakymasRodymui: `$${2 * r}\\pi$ cm`,
        sprendimas: `$C = 2\\pi r = 2 \\cdot ${r} \\cdot \\pi = ${2 * r}\\pi$.`,
        brezinys: apskritimas({ spindulys: `${r}` }),
      }),

    // 2. Ilgis per skersmenį
    () =>
      uzdavinys(T7, {
        klausimas: `Apskritimo skersmuo ${2 * r} cm. Koks jo ilgis? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(2 * r),
        atsakymasRodymui: `$${2 * r}\\pi$ cm`,
        sprendimas: `$C = \\pi d = ${2 * r}\\pi$.`,
      }),

    // 3. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kokia yra apskritimo ilgio formulė?',
        variantai: ['$C = 2\\pi r$', '$C = \\pi r^2$', '$C = \\pi r$', '$C = 2r$'],
        teisingas: 0,
        sprendimas: '$\\pi r^2$ yra skritulio ploto formulė.',
      }),

    // 4. Apytikslė reikšmė
    () =>
      uzdavinys(T7, {
        klausimas: `Apskritimo spindulys ${r} cm. Koks apytikslis jo ilgis, kai $\\pi \\approx 3$?`,
        atsakymas: String(6 * r),
        atsakymasRodymui: `$${6 * r}$ cm`,
        sprendimas: `$2 \\cdot ${r} \\cdot 3 = ${6 * r}$.`,
      }),

    // 5. Spindulys iš ilgio
    () =>
      uzdavinys(T7, {
        klausimas: `Apskritimo ilgis $${2 * r}\\pi$ cm. Kokio ilgio jo spindulys?`,
        atsakymas: String(r),
        atsakymasRodymui: `$${r}$ cm`,
        sprendimas: `$${2 * r}\\pi : (2\\pi) = ${r}$.`,
      }),

    // 6. Kas yra π
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ką reiškia skaičius $\\pi$?',
        variantai: [
          'apskritimo ilgio ir jo skersmens santykį',
          'apskritimo ilgio ir spindulio santykį',
          'skritulio plotą',
          'apskritimo skersmenį',
        ],
        teisingas: 0,
        sprendimas: 'Šis santykis vienodas visiems apskritimams ir apytiksliai lygus $3{,}14$.',
      }),

    // 7. Kiek kartų padidės
    () =>
      uzdavinys(T7, {
        klausimas: 'Apskritimo spindulys padidintas 3 kartus. Kiek kartų padidėja apskritimo ilgis?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Ilgis tiesiogiai proporcingas spinduliui.',
      }),
  ])
}

// ── 9.3. Apskritimo lankas ir jo ilgis ──────────────────────────────────────

const T8 = 'apskritimo-lankas'

const A_LANKAS = [
  {
    klausimas: 'Kokią apskritimo dalį sudaro 90° lankas?',
    atsakymas: '1/4',
    atsakymasRodymui: '$\\dfrac{1}{4}$',
    sprendimas: '$90 : 360 = \\dfrac{1}{4}$.',
  },
] as const

export const apskritimoLankas: Generatorius = () => suBandymais(kurkLanka, A_LANKAS, T8)

function kurkLanka(): Uzdavinys | null {
  const kampas = pasirink([30, 45, 60, 72, 90, 120, 180, 240, 270])
  const r = atsitiktinis(3, 18)

  return variacija([
    // 1. Kokią dalį sudaro
    () => {
      const dalys: Record<number, string> = {
        30: '1/12',
        45: '1/8',
        60: '1/6',
        72: '1/5',
        90: '1/4',
        120: '1/3',
        180: '1/2',
        240: '2/3',
        270: '3/4',
      }
      const rodymas: Record<number, string> = {
        30: '\\dfrac{1}{12}',
        45: '\\dfrac{1}{8}',
        60: '\\dfrac{1}{6}',
        72: '\\dfrac{1}{5}',
        90: '\\dfrac{1}{4}',
        120: '\\dfrac{1}{3}',
        180: '\\dfrac{1}{2}',
        240: '\\dfrac{2}{3}',
        270: '\\dfrac{3}{4}',
      }
      return uzdavinys(T8, {
        klausimas: `Kokią viso apskritimo dalį sudaro ${kampas}° lankas?`,
        atsakymas: dalys[kampas],
        atsakymasRodymui: `$${rodymas[kampas]}$`,
        sprendimas: `$${kampas} : 360 = ${rodymas[kampas]}$.`,
        brezinys: apskritimas({ sektorius: kampas, kampoUzrasas: `${kampas}°` }),
      })
    },

    // 2. Lanko ilgis su π
    () => {
      const ilgis = (2 * r * kampas) / 360
      if (ilgis % 1 !== 0) return null
      return uzdavinys(T8, {
        klausimas: `Apskritimo spindulys ${r} cm. Koks ${kampas}° lanko ilgis? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(ilgis),
        atsakymasRodymui: `$${ilgis}\\pi$ cm`,
        sprendimas: `Visas ilgis $${2 * r}\\pi$; lankas sudaro $\\dfrac{${kampas}}{360}$ dalį: $${ilgis}\\pi$.`,
      })
    },

    // 3. Kampas iš dalies
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek laipsnių turi lankas, sudarantis ketvirtadalį apskritimo?',
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: '$360 : 4 = 90$.',
      }),

    // 4. Pusapskritimis
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek laipsnių turi pusapskritimio lankas?',
        atsakymas: '180',
        atsakymasRodymui: `$180°$`,
        sprendimas: '$360 : 2 = 180$.',
      }),

    // 5. Centrinis kampas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kaip susijęs centrinis kampas ir jį atitinkantis lankas?',
        variantai: [
          'lanko dydis laipsniais lygus centrinio kampo dydžiui',
          'lankas dvigubai didesnis',
          'lankas dvigubai mažesnis',
          'jie nesusiję',
        ],
        teisingas: 0,
        sprendimas: 'Todėl visas apskritimas atitinka 360°.',
        brezinys: apskritimas({ sektorius: kampas, kampoUzrasas: `${kampas}°` }),
      }),

    // 6. Lankų suma
    () =>
      uzdavinys(T8, {
        klausimas: `Vienas lankas lygus ${kampas}°. Kiek laipsnių turi likusi apskritimo dalis?`,
        atsakymas: String(360 - kampas),
        atsakymasRodymui: `$${360 - kampas}°$`,
        sprendimas: `$360 - ${kampas} = ${360 - kampas}$.`,
      }),

    // 7. Apytikslis lanko ilgis
    () => {
      const ilgis = (2 * r * 3 * kampas) / 360
      if (ilgis % 1 !== 0) return null
      return uzdavinys(T8, {
        klausimas: `Apskritimo spindulys ${r} cm. Koks apytikslis ${kampas}° lanko ilgis, kai $\\pi \\approx 3$?`,
        atsakymas: String(ilgis),
        atsakymasRodymui: `$${ilgis}$ cm`,
        sprendimas: `Visas ilgis apytiksliai $${6 * r}$ cm; lankas sudaro $\\dfrac{${kampas}}{360}$ dalį.`,
      })
    },
  ])
}

// ── 9.4. Skritulys. Skritulio ir jo dalies plotai ───────────────────────────

const T9 = 'skritulio-plotas'

const A_SKRITULYS = [
  {
    klausimas: 'Skritulio spindulys 4 cm. Koks jo plotas? Užrašyk koeficientą prie $\\pi$.',
    atsakymas: '16',
    atsakymasRodymui: '$16\\pi$ cm²',
    sprendimas: '$S = \\pi r^2 = \\pi \\cdot 16$.',
  },
] as const

export const skritulioPlotas: Generatorius = () => suBandymais(kurkSkrituli, A_SKRITULYS, T9)

function kurkSkrituli(): Uzdavinys | null {
  const r = atsitiktinis(2, 15)
  const kampas = pasirink([60, 90, 120, 180, 240, 270])

  return variacija([
    // 1. Skritulio plotas
    () =>
      uzdavinys(T9, {
        klausimas: `Skritulio spindulys ${r} cm. Koks jo plotas? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(r * r),
        atsakymasRodymui: `$${r * r}\\pi$ cm²`,
        sprendimas: `$S = \\pi r^2 = \\pi \\cdot ${r} \\cdot ${r} = ${r * r}\\pi$.`,
        brezinys: apskritimas({ skritulys: true, spindulys: `${r}` }),
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kokia yra skritulio ploto formulė?',
        variantai: ['$S = \\pi r^2$', '$S = 2\\pi r$', '$S = \\pi d$', '$S = 2r^2$'],
        teisingas: 0,
        sprendimas: '$2\\pi r$ yra apskritimo ilgio formulė.',
      }),

    // 3. Plotas per skersmenį
    () =>
      uzdavinys(T9, {
        klausimas: `Skritulio skersmuo ${2 * r} cm. Koks jo plotas? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(r * r),
        atsakymasRodymui: `$${r * r}\\pi$ cm²`,
        sprendimas: `Spindulys $${2 * r} : 2 = ${r}$; $S = ${r * r}\\pi$.`,
      }),

    // 4. Sektoriaus plotas
    () => {
      const plotas = (r * r * kampas) / 360
      if (plotas % 1 !== 0) return null
      return uzdavinys(T9, {
        klausimas: `Skritulio spindulys ${r} cm. Koks ${kampas}° sektoriaus plotas? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}\\pi$ cm²`,
        sprendimas: `Visas plotas $${r * r}\\pi$; sektorius sudaro $\\dfrac{${kampas}}{360}$ dalį: $${plotas}\\pi$.`,
        brezinys: apskritimas({ sektorius: kampas, kampoUzrasas: `${kampas}°` }),
      })
    },

    // 5. Apytikslis plotas
    () =>
      uzdavinys(T9, {
        klausimas: `Skritulio spindulys ${r} cm. Koks apytikslis jo plotas, kai $\\pi \\approx 3$?`,
        atsakymas: String(3 * r * r),
        atsakymasRodymui: `$${3 * r * r}$ cm²`,
        sprendimas: `$3 \\cdot ${r} \\cdot ${r} = ${3 * r * r}$.`,
      }),

    // 6. Spindulys iš ploto
    () =>
      uzdavinys(T9, {
        klausimas: `Skritulio plotas $${r * r}\\pi$ cm². Kokio ilgio jo spindulys?`,
        atsakymas: String(r),
        atsakymasRodymui: `$${r}$ cm`,
        sprendimas: `Ieškomas skaičius, kurio kvadratas lygus ${r * r}.`,
      }),

    // 7. Kiek kartų padidės plotas
    () =>
      uzdavinys(T9, {
        klausimas: 'Skritulio spindulys padidintas 2 kartus. Kiek kartų padidėja jo plotas?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Plote spindulys keliamas kvadratu: $2^2 = 4$.',
      }),
  ])
}
