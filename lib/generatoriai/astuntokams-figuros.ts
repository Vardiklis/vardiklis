import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { koordinaciuPlokstuma } from './sestokams-vaizdai'
import { apskritimas, ritinysArKugis, staciojiPrizme, taisyklingojiPiramide } from './septintokams-vaizdai'
import { staciasisTrikampis, vidurioLinija } from './astuntokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 8 klasės temos „Plokštumos figūros“ ir „Erdviniai kūnai“ — trylika potemių.
 *
 * Programoje erdvinių kūnų temoje yra ir potemė „Objekto vaizdai iš viršaus,
 * priekio ir šono bei mastelis“, kurios turinio apraše nėra.
 *
 * Aštuntoje klasėje kūnai jau skaičiuojami su Pitagoro teorema, o π reikšmės
 * neapvalinamos: prašoma koeficiento prieš π arba skaičiuojama su $\pi
 * \approx 3$, kitaip atsakymo nebūtų galima suvesti.
 */

/** Pitagoro trejetai, kad statiniai ir įžambinė būtų sveikieji. */
const TREJETAI = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
  [7, 24, 25],
  [20, 21, 29],
] as const

function trejetas(): readonly [number, number, number] {
  return pasirink(TREJETAI) as unknown as readonly [number, number, number]
}

// ── 7.1. Pitagoro teorema ───────────────────────────────────────────────────

const T1 = 'pitagoro-teorema'

const A_PITAGORAS = [
  {
    klausimas: 'Stačiojo trikampio statiniai 3 cm ir 4 cm. Kokia įžambinė?',
    atsakymas: '5',
    atsakymasRodymui: '$5$ cm',
    sprendimas: '$3^2 + 4^2 = 25$, o $\\sqrt{25} = 5$.',
  },
] as const

export const pitagoroTeorema: Generatorius = () => suBandymais(kurkPitagora, A_PITAGORAS, T1)

function kurkPitagora(): Uzdavinys | null {
  const [a, b, c] = trejetas()

  return variacija([
    // 1. Įžambinė
    () =>
      uzdavinys(T1, {
        klausimas: `Stačiojo trikampio statiniai ${a} cm ir ${b} cm. Kokia jo įžambinė?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$ cm`,
        sprendimas: `$${a}^2 + ${b}^2 = ${a * a + b * b}$, o $\\sqrt{${c * c}} = ${c}$.`,
        brezinys: staciasisTrikampis(a, b, { a: `${a} cm`, b: `${b} cm`, c: '?' }),
      }),

    // 2. Statinis
    () =>
      uzdavinys(T1, {
        klausimas: `Stačiojo trikampio įžambinė ${c} cm, vienas statinis ${a} cm. Koks kitas statinis?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `$${c}^2 - ${a}^2 = ${c * c - a * a}$, o $\\sqrt{${b * b}} = ${b}$.`,
        brezinys: staciasisTrikampis(a, b, { a: `${a} cm`, b: '?', c: `${c} cm` }),
      }),

    // 3. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kaip užrašoma Pitagoro teorema?',
        variantai: [
          'statinių kvadratų suma lygi įžambinės kvadratui',
          'statinių suma lygi įžambinei',
          'įžambinės kvadratas lygus statinių sandaugai',
          'visų kraštinių kvadratai lygūs',
        ],
        teisingas: 0,
        sprendimas: '$a^2 + b^2 = c^2$, kur $c$ — įžambinė.',
      }),

    // 4. Kokiems trikampiams taikoma
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kokiems trikampiams galioja Pitagoro teorema?',
        variantai: ['tik statiesiems', 'visiems', 'tik lygiašoniams', 'tik smailiesiems'],
        teisingas: 0,
        sprendimas: 'Trikampyje turi būti 90° kampas.',
      }),

    // 5. Kopėčios prie sienos
    () =>
      uzdavinys(T1, {
        klausimas: `Kopėčios, kurių ilgis ${c} m, atremtos į sieną, o jų apačia nuo sienos nutolusi ${a} m. Kokiame aukštyje kopėčios liečia sieną?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ m`,
        sprendimas: `Kopėčios yra įžambinė: $${c}^2 - ${a}^2 = ${b * b}$, tad aukštis $${b}$ m.`,
      }),

    // 6. Stačiakampio įstrižainė
    () =>
      uzdavinys(T1, {
        klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Kokia jo įstrižainė?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$ cm`,
        sprendimas: 'Įstrižainė dalija stačiakampį į du stačiuosius trikampius.',
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: `Ieškodamas įžambinės, kai statiniai ${a} cm ir ${b} cm, mokinys gavo ${a + b} cm. Kokia turi būti įžambinė?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$ cm`,
        sprendimas: 'Sudedami ne statiniai, o jų kvadratai.',
      }),
  ])
}

// ── 7.2. Atvirkštinė Pitagoro teorema ───────────────────────────────────────

const T2 = 'atvirkstine-pitagoro'

const A_ATVIRKSTINE = [
  {
    klausimas: 'Ar trikampis, kurio kraštinės 3, 4 ir 5, yra statusis?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: '$3^2 + 4^2 = 5^2$.',
  },
] as const

export const atvirkstinePitagoro: Generatorius = () => suBandymais(kurkAtvirkstine, A_ATVIRKSTINE, T2)

function kurkAtvirkstine(): Uzdavinys | null {
  const [a, b, c] = trejetas()
  const cBlogas = c + pasirink([1, 2])

  return variacija([
    // 1. Ar statusis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar trikampis, kurio kraštinės ${a}, ${b} ir ${c}, yra statusis?`,
        variantai: [`taip, nes $${a}^2 + ${b}^2 = ${c}^2$`, 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `$${a * a} + ${b * b} = ${c * c}$ — lygybė teisinga.`,
      }),

    // 2. Ne statusis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar trikampis, kurio kraštinės ${a}, ${b} ir ${cBlogas}, yra statusis?`,
        variantai: [`ne, nes $${a}^2 + ${b}^2 \\ne ${cBlogas}^2$`, 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `$${a * a} + ${b * b} = ${c * c}$, o $${cBlogas}^2 = ${cBlogas * cBlogas}$.`,
      }),

    // 3. Ką teigia atvirkštinė teorema
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ką teigia atvirkštinė Pitagoro teorema?',
        variantai: [
          'jei kraštinių kvadratams galioja $a^2 + b^2 = c^2$, tai trikampis statusis',
          'jei trikampis statusis, tai $a^2 + b^2 = c^2$',
          'visų trikampių kraštinės susijusios',
          'įžambinė visada ilgiausia',
        ],
        teisingas: 0,
        sprendimas: 'Ji leidžia nustatyti stačiąjį kampą tik iš kraštinių ilgių.',
      }),

    // 4. Kurią kraštinę tikrinti
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kurios kraštinės kvadratą reikia palyginti su kitų dviejų kvadratų suma?',
        variantai: ['ilgiausios', 'trumpiausios', 'vidutinės', 'bet kurios'],
        teisingas: 0,
        sprendimas: 'Statųjį kampą atitinka ilgiausia kraštinė — įžambinė.',
      }),

    // 5. Kvadratų suma
    () =>
      uzdavinys(T2, {
        klausimas: `Trikampio kraštinės ${a}, ${b} ir ${c}. Kam lygi dviejų trumpesniųjų kraštinių kvadratų suma?`,
        atsakymas: String(a * a + b * b),
        atsakymasRodymui: `$${a * a + b * b}$`,
        sprendimas: `$${a * a} + ${b * b} = ${a * a + b * b}$.`,
      }),

    // 6. Statybininko patikra
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kodėl statybininkai kampui patikrinti naudoja 3, 4 ir 5 vienetų atkarpas?',
        variantai: [
          'nes toks trikampis yra statusis',
          'nes tai patogūs skaičiai',
          'nes trikampis lygiašonis',
          'nes taip gaunamas 60° kampas',
        ],
        teisingas: 0,
        sprendimas: '$9 + 16 = 25$, tad kampas tarp 3 ir 4 kraštinių — status.',
      }),

    // 7. Bukasis ar smailusis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Trikampio kraštinės ${a}, ${b} ir ${cBlogas}, o $${a}^2 + ${b}^2 < ${cBlogas}^2$. Koks tai trikampis?`,
        variantai: ['bukasis', 'statusis', 'smailusis', 'lygiakraštis'],
        teisingas: 0,
        sprendimas: 'Kai ilgiausios kraštinės kvadratas didesnis, prieš ją esantis kampas bukas.',
      }),
  ])
}

// ── 7.3. Atstumas tarp dviejų koordinačių plokštumos taškų ──────────────────

const T3 = 'atstumas-tarp-tasku'

const A_ATSTUMAS = [
  {
    klausimas: 'Koks atstumas tarp taškų $(0; 0)$ ir $(3; 4)$?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: '$\\sqrt{3^2 + 4^2} = 5$.',
  },
] as const

export const atstumasTarpTasku: Generatorius = () => suBandymais(kurkAtstuma, A_ATSTUMAS, T3)

function kurkAtstuma(): Uzdavinys | null {
  const [a, b, c] = trejetas()
  if (a > 5 || b > 5) return null
  const x1 = atsitiktinis(-4, 0)
  const y1 = atsitiktinis(-4, 0)

  return variacija([
    // 1. Atstumas
    () =>
      uzdavinys(T3, {
        klausimas: `Koks atstumas tarp taškų $A(${x1}; ${y1})$ ir $B(${x1 + a}; ${y1 + b})$?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$`,
        sprendimas: `Statiniai $${a}$ ir $${b}$: $\\sqrt{${a * a} + ${b * b}} = ${c}$.`,
        brezinys: koordinaciuPlokstuma(
          [
            { x: x1, y: y1, raide: 'A' },
            { x: x1 + a, y: y1 + b, raide: 'B' },
          ],
          6,
          [[[x1, y1], [x1 + a, y1 + b]]],
        ),
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip randamas atstumas tarp dviejų koordinačių plokštumos taškų?',
        variantai: [
          'iš koordinačių skirtumų sudaromas statusis trikampis ir taikoma Pitagoro teorema',
          'koordinatės sudedamos',
          'koordinatės sudauginamos',
          'atimamos tik abscisės',
        ],
        teisingas: 0,
        sprendimas: 'Skirtumai yra statiniai, o atstumas — įžambinė.',
      }),

    // 3. Horizontalus atstumas
    () =>
      uzdavinys(T3, {
        klausimas: `Taškai $A(${x1}; ${y1})$ ir $B(${x1 + a}; ${y1})$. Koks atstumas tarp jų?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: 'Ordinatės vienodos, tad pakanka atimti abscises.',
      }),

    // 4. Statinių ilgiai
    () =>
      uzdavinys(T3, {
        klausimas: `Sudarant statųjį trikampį taškams $A(${x1}; ${y1})$ ir $B(${x1 + a}; ${y1 + b})$, koks bus horizontalaus statinio ilgis?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${x1 + a} - (${x1}) = ${a}$.`,
      }),

    // 5. Atstumas iki pradžios
    () =>
      uzdavinys(T3, {
        klausimas: `Koks taško $P(${a}; ${b})$ atstumas iki koordinačių pradžios?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$`,
        sprendimas: `$\\sqrt{${a * a} + ${b * b}} = ${c}$.`,
      }),

    // 6. Atkarpos vidurio taškas
    () => {
      if (a % 2 !== 0 || b % 2 !== 0) return null
      return uzdavinys(T3, {
        klausimas: `Kokia atkarpos, jungiančios $A(${x1}; ${y1})$ ir $B(${x1 + a}; ${y1 + b})$, vidurio taško abscisė?`,
        atsakymas: String(x1 + a / 2),
        atsakymasRodymui: `$${x1 + a / 2}$`,
        sprendimas: 'Vidurio taško koordinatės yra galų koordinačių vidurkiai.',
      })
    },

    // 7. Ar atstumas gali būti neigiamas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ar atstumas tarp taškų gali būti neigiamas?',
        variantai: [
          'ne, nes iš kvadratų sumos traukiama aritmetinė šaknis',
          'taip, jei koordinatės neigiamos',
          'taip, jei taškas kairiau',
          'atstumas visada nulinis',
        ],
        teisingas: 0,
        sprendimas: 'Skirtumai pakeliami kvadratu, tad ženklas išnyksta.',
      }),
  ])
}

// ── 7.4. Stačiojo trikampio statinis, esantis prieš 30° kampą ───────────────

const T4 = 'statinis-pries-30'

const A_STATINIS30 = [
  {
    klausimas: 'Stačiojo trikampio įžambinė 12 cm, vienas kampas 30°. Koks statinis, esantis prieš tą kampą?',
    atsakymas: '6',
    atsakymasRodymui: '$6$ cm',
    sprendimas: 'Jis lygus pusei įžambinės.',
  },
] as const

export const statinisPries30: Generatorius = () => suBandymais(kurkStatini30, A_STATINIS30, T4)

function kurkStatini30(): Uzdavinys | null {
  const puse = atsitiktinis(3, 15)
  const izambine = 2 * puse

  return variacija([
    // 1. Statinis iš įžambinės
    () =>
      uzdavinys(T4, {
        klausimas: `Stačiojo trikampio įžambinė ${izambine} cm, vienas smailusis kampas $30°$. Koks yra statinis, esantis prieš šį kampą?`,
        atsakymas: String(puse),
        atsakymasRodymui: `$${puse}$ cm`,
        sprendimas: `Toks statinis lygus pusei įžambinės: $${izambine} : 2 = ${puse}$.`,
      }),

    // 2. Įžambinė iš statinio
    () =>
      uzdavinys(T4, {
        klausimas: `Statinis, esantis prieš $30°$ kampą, yra ${puse} cm. Kokia stačiojo trikampio įžambinė?`,
        atsakymas: String(izambine),
        atsakymasRodymui: `$${izambine}$ cm`,
        sprendimas: `$${puse} \\cdot 2 = ${izambine}$.`,
      }),

    // 3. Savybė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kam lygus statinis, esantis prieš $30°$ kampą?',
        variantai: ['pusei įžambinės', 'įžambinei', 'kitam statiniui', 'trečdaliui įžambinės'],
        teisingas: 0,
        sprendimas: 'Tai matyti padalijus lygiakraštį trikampį pusiau.',
      }),

    // 4. Kitas smailusis kampas
    () =>
      uzdavinys(T4, {
        klausimas: 'Stačiojo trikampio vienas smailusis kampas $30°$. Koks yra kitas smailusis kampas?',
        atsakymas: '60',
        atsakymasRodymui: '$60°$',
        sprendimas: '$90° - 30° = 60°$.',
      }),

    // 5. Iš kur savybė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kaip gaunama ši savybė?',
        variantai: [
          'lygiakraštis trikampis padalijamas aukštine pusiau',
          'trikampis padalijamas pusiaukampine',
          'taikoma Pitagoro teorema',
          'trikampis pasukamas',
        ],
        teisingas: 0,
        sprendimas: 'Gautame trikampyje pagrindo pusė yra prieš $30°$ kampą.',
      }),

    // 6. Aukštis su Pitagoru
    () =>
      uzdavinys(T4, {
        klausimas: `Stačiojo trikampio įžambinė ${izambine} cm, o statinis prieš $30°$ kampą — ${puse} cm. Kam lygus kito statinio kvadratas?`,
        atsakymas: String(izambine * izambine - puse * puse),
        atsakymasRodymui: `$${izambine * izambine - puse * puse}$`,
        sprendimas: `$${izambine}^2 - ${puse}^2 = ${izambine * izambine - puse * puse}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Mokinys teigia, kad prieš $30°$ kampą esantis statinis yra trečdalis įžambinės, tad iš ${izambine} cm gavo, kad jis lygus ${Math.round(izambine / 3)} cm. Koks turi būti atsakymas?`,
        atsakymas: String(puse),
        atsakymasRodymui: `$${puse}$ cm`,
        sprendimas: 'Statinis lygus pusei, o ne trečdaliui įžambinės.',
      }),
  ])
}

// ── 7.5. Lygiašonis ir lygiakraštis trikampiai ──────────────────────────────

const T5 = 'lygiasonis-lygiakrastis'

const A_LYGIASONIS = [
  {
    klausimas: 'Lygiašonio trikampio kampas prie viršūnės $40°$. Koks kampas prie pagrindo?',
    atsakymas: '70',
    atsakymasRodymui: '$70°$',
    sprendimas: '$(180° - 40°) : 2 = 70°$.',
  },
] as const

export const lygiasonisLygiakrastis: Generatorius = () => suBandymais(kurkLygiasoni, A_LYGIASONIS, T5)

function kurkLygiasoni(): Uzdavinys | null {
  const virsune = atsitiktinis(2, 34) * 2
  const priePagrindo = (180 - virsune) / 2
  const sonas = atsitiktinis(5, 20)
  const pagrindas = atsitiktinis(3, 2 * sonas - 1)

  return variacija([
    // 1. Kampas prie pagrindo
    () =>
      uzdavinys(T5, {
        klausimas: `Lygiašonio trikampio kampas prie viršūnės $${virsune}°$. Koks kampas prie pagrindo?`,
        atsakymas: String(priePagrindo),
        atsakymasRodymui: `$${priePagrindo}°$`,
        sprendimas: `$(180° - ${virsune}°) : 2 = ${priePagrindo}°$.`,
      }),

    // 2. Kampas prie viršūnės
    () =>
      uzdavinys(T5, {
        klausimas: `Lygiašonio trikampio kampas prie pagrindo $${priePagrindo}°$. Koks kampas prie viršūnės?`,
        atsakymas: String(virsune),
        atsakymasRodymui: `$${virsune}°$`,
        sprendimas: `$180° - 2 \\cdot ${priePagrindo}° = ${virsune}°$.`,
      }),

    // 3. Lygiakraščio kampai
    () =>
      uzdavinys(T5, {
        klausimas: 'Koks yra kiekvienas lygiakraščio trikampio kampas?',
        atsakymas: '60',
        atsakymasRodymui: '$60°$',
        sprendimas: '$180° : 3 = 60°$.',
      }),

    // 4. Perimetras
    () =>
      uzdavinys(T5, {
        klausimas: `Lygiašonio trikampio šoninė kraštinė ${sonas} cm, pagrindas ${pagrindas} cm. Koks perimetras?`,
        atsakymas: String(2 * sonas + pagrindas),
        atsakymasRodymui: `$${2 * sonas + pagrindas}$ cm`,
        sprendimas: `$2 \\cdot ${sonas} + ${pagrindas} = ${2 * sonas + pagrindas}$.`,
      }),

    // 5. Šoninė kraštinė iš perimetro
    () =>
      uzdavinys(T5, {
        klausimas: `Lygiašonio trikampio perimetras ${2 * sonas + pagrindas} cm, pagrindas ${pagrindas} cm. Kokia šoninė kraštinė?`,
        atsakymas: String(sonas),
        atsakymasRodymui: `$${sonas}$ cm`,
        sprendimas: `$(${2 * sonas + pagrindas} - ${pagrindas}) : 2 = ${sonas}$.`,
      }),

    // 6. Savybės
    () =>
      poruUzdavinys(naujasId(T5), T5, {
        klausimas: 'Sujunk trikampio rūšį su jo savybe.',
        poros: [
          { kaire: 'lygiašonis', desine: 'kampai prie pagrindo lygūs' },
          { kaire: 'lygiakraštis', desine: 'visi kampai po 60°' },
          { kaire: 'statusis', desine: 'vienas kampas 90°' },
          { kaire: 'bukasis', desine: 'vienas kampas didesnis už 90°' },
        ],
        sprendimas: 'Lygiakraštis trikampis kartu yra ir lygiašonis.',
      }),

    // 7. Aukštinė lygiašoniame
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kas dar yra lygiašonio trikampio aukštinė, nubrėžta į pagrindą?',
        variantai: [
          'pusiaukraštinė ir pusiaukampinė',
          'tik pusiaukraštinė',
          'tik pusiaukampinė',
          'vidurio linija',
        ],
        teisingas: 0,
        sprendimas: 'Ji dalija pagrindą ir viršūnės kampą pusiau.',
      }),
  ])
}

// ── 7.6. Trikampio vidurio linija ───────────────────────────────────────────

const T6 = 'trikampio-vidurio-linija'

const A_TRIK_VIDURIO = [
  {
    klausimas: 'Trikampio kraštinė 14 cm. Kokia jai lygiagreti vidurio linija?',
    atsakymas: '7',
    atsakymasRodymui: '$7$ cm',
    sprendimas: 'Vidurio linija lygi pusei kraštinės.',
  },
] as const

export const trikampioVidurioLinija: Generatorius = () => suBandymais(kurkTrikVidurio, A_TRIK_VIDURIO, T6)

function kurkTrikVidurio(): Uzdavinys | null {
  const puse = atsitiktinis(3, 16)
  const krastine = 2 * puse

  return variacija([
    // 1. Vidurio linija
    () =>
      uzdavinys(T6, {
        klausimas: `Trikampio kraštinė ${krastine} cm. Kokia jai lygiagreti vidurio linija?`,
        atsakymas: String(puse),
        atsakymasRodymui: `$${puse}$ cm`,
        sprendimas: `Vidurio linija lygi pusei kraštinės: $${krastine} : 2 = ${puse}$.`,
        brezinys: vidurioLinija('trikampis', { apacia: `${krastine} cm`, vidurys: '?' }),
      }),

    // 2. Kraštinė iš vidurio linijos
    () =>
      uzdavinys(T6, {
        klausimas: `Trikampio vidurio linija ${puse} cm. Kokia jai lygiagreti kraštinė?`,
        atsakymas: String(krastine),
        atsakymasRodymui: `$${krastine}$ cm`,
        sprendimas: `$${puse} \\cdot 2 = ${krastine}$.`,
        brezinys: vidurioLinija('trikampis', { apacia: '?', vidurys: `${puse} cm` }),
      }),

    // 3. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kas yra trikampio vidurio linija?',
        variantai: [
          'atkarpa, jungianti dviejų kraštinių vidurio taškus',
          'atkarpa nuo viršūnės iki kraštinės vidurio',
          'aukštinė',
          'pusiaukampinė',
        ],
        teisingas: 0,
        sprendimas: 'Ji lygiagreti trečiajai kraštinei.',
      }),

    // 4. Savybė
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kokia yra trikampio vidurio linijos savybė?',
        variantai: [
          'ji lygiagreti trečiajai kraštinei ir lygi jos pusei',
          'ji lygi trečiajai kraštinei',
          'ji statmena trečiajai kraštinei',
          'ji dalija trikampį į du lygius trikampius',
        ],
        teisingas: 0,
        sprendimas: 'Todėl mažasis trikampis panašus į didįjį.',
      }),

    // 5. Kiek vidurio linijų
    () =>
      uzdavinys(T6, {
        klausimas: 'Kiek vidurio linijų turi trikampis?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Po vieną kiekvienai kraštinių porai.',
      }),

    // 6. Vidurinio trikampio perimetras
    () => {
      const b = atsitiktinis(4, 20)
      const c = atsitiktinis(4, 20)
      if (krastine + b <= c || krastine + c <= b || b + c <= krastine) return null
      if ((krastine + b + c) % 2 !== 0) return null
      return uzdavinys(T6, {
        klausimas: `Trikampio kraštinės ${krastine} cm, ${b} cm ir ${c} cm. Koks yra jo vidurio linijomis sudaryto trikampio perimetras?`,
        atsakymas: String((krastine + b + c) / 2),
        atsakymasRodymui: `$${(krastine + b + c) / 2}$ cm`,
        sprendimas: `Kiekviena vidurio linija lygi pusei kraštinės, tad perimetras dvigubai mažesnis: $${krastine + b + c} : 2$.`,
      })
    },

    // 7. Kiek dalių
    () =>
      uzdavinys(T6, {
        klausimas: 'Į kiek lygių trikampių trikampį padalija visos trys jo vidurio linijos?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Visi keturi trikampiai lygūs tarpusavyje.',
      }),
  ])
}

// ── 7.7. Trapecijos vidurio linija ──────────────────────────────────────────

const T7 = 'trapecijos-vidurio-linija'

const A_TRAP_VIDURIO = [
  {
    klausimas: 'Trapecijos pagrindai 6 cm ir 10 cm. Kokia vidurio linija?',
    atsakymas: '8',
    atsakymasRodymui: '$8$ cm',
    sprendimas: '$(6 + 10) : 2 = 8$.',
  },
] as const

export const trapecijosVidurioLinija: Generatorius = () => suBandymais(kurkTrapVidurio, A_TRAP_VIDURIO, T7)

function kurkTrapVidurio(): Uzdavinys | null {
  const a = atsitiktinis(3, 20)
  const b = a + atsitiktinis(2, 14)
  if ((a + b) % 2 !== 0) return null
  const vidurio = (a + b) / 2

  return variacija([
    // 1. Vidurio linija
    () =>
      uzdavinys(T7, {
        klausimas: `Trapecijos pagrindai ${a} cm ir ${b} cm. Kokia jos vidurio linija?`,
        atsakymas: String(vidurio),
        atsakymasRodymui: `$${vidurio}$ cm`,
        sprendimas: `$(${a} + ${b}) : 2 = ${vidurio}$.`,
        brezinys: vidurioLinija('trapecija', { virsus: `${a} cm`, apacia: `${b} cm`, vidurys: '?' }),
      }),

    // 2. Pagrindas iš vidurio linijos
    () =>
      uzdavinys(T7, {
        klausimas: `Trapecijos vidurio linija ${vidurio} cm, vienas pagrindas ${a} cm. Koks kitas pagrindas?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `$2 \\cdot ${vidurio} - ${a} = ${b}$.`,
        brezinys: vidurioLinija('trapecija', { virsus: `${a} cm`, apacia: '?', vidurys: `${vidurio} cm` }),
      }),

    // 3. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kam lygi trapecijos vidurio linija?',
        variantai: [
          'pagrindų sumos pusei',
          'pagrindų skirtumui',
          'didesniajam pagrindui',
          'pagrindų sandaugai',
        ],
        teisingas: 0,
        sprendimas: 'Ji lygiagreti abiem pagrindams.',
      }),

    // 4. Pagrindų suma
    () =>
      uzdavinys(T7, {
        klausimas: `Trapecijos vidurio linija ${vidurio} cm. Kam lygi jos pagrindų suma?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ cm`,
        sprendimas: `$${vidurio} \\cdot 2 = ${a + b}$.`,
      }),

    // 5. Plotas per vidurio liniją
    () => {
      const h = atsitiktinis(2, 12)
      return uzdavinys(T7, {
        klausimas: `Trapecijos vidurio linija ${vidurio} cm, aukštinė ${h} cm. Koks trapecijos plotas?`,
        atsakymas: String(vidurio * h),
        atsakymasRodymui: `$${vidurio * h}$ cm²`,
        sprendimas: `Plotas lygus vidurio linijos ir aukštinės sandaugai: $${vidurio} \\cdot ${h} = ${vidurio * h}$.`,
      })
    },

    // 6. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kas yra trapecijos vidurio linija?',
        variantai: [
          'atkarpa, jungianti šoninių kraštinių vidurio taškus',
          'atkarpa, jungianti pagrindų vidurio taškus',
          'įstrižainė',
          'aukštinė',
        ],
        teisingas: 0,
        sprendimas: 'Ji lygiagreti pagrindams.',
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Skaičiuodamas trapecijos, kurios pagrindai ${a} cm ir ${b} cm, vidurio liniją mokinys atėmė pagrindus ir gavo ${b - a} cm. Kokia turi būti vidurio linija?`,
        atsakymas: String(vidurio),
        atsakymasRodymui: `$${vidurio}$ cm`,
        sprendimas: 'Pagrindai sudedami ir dalijami pusiau.',
      }),
  ])
}

// ── 8.1. Stačioji prizmė ────────────────────────────────────────────────────

const T8 = 'stacioji-prizme-8'

const A_PRIZME = [
  {
    klausimas: 'Stačiosios prizmės pagrindo plotas 12 cm², aukštinė 5 cm. Koks tūris?',
    atsakymas: '60',
    atsakymasRodymui: '$60$ cm³',
    sprendimas: '$12 \\cdot 5 = 60$.',
  },
] as const

export const staciojiPrizme8: Generatorius = () => suBandymais(kurkPrizme, A_PRIZME, T8)

function kurkPrizme(): Uzdavinys | null {
  const a = atsitiktinis(3, 12)
  const h = atsitiktinis(3, 15)
  const [k1, k2, izam] = trejetas()

  return variacija([
    // 1. Tūris
    () =>
      uzdavinys(T8, {
        klausimas: `Stačiosios prizmės pagrindas — kvadratas, kurio kraštinė ${a} cm, o prizmės aukštinė ${h} cm. Koks prizmės tūris?`,
        atsakymas: String(a * a * h),
        atsakymasRodymui: `$${a * a * h}$ cm³`,
        sprendimas: `$${a}^2 \\cdot ${h} = ${a * a * h}$.`,
        brezinys: staciojiPrizme(4, { a: `${a} cm`, h: `${h} cm` }),
      }),

    // 2. Šoninis paviršius
    () =>
      uzdavinys(T8, {
        klausimas: `Stačiosios prizmės pagrindas — kvadratas, kurio kraštinė ${a} cm, aukštinė ${h} cm. Koks šoninio paviršiaus plotas?`,
        atsakymas: String(4 * a * h),
        atsakymasRodymui: `$${4 * a * h}$ cm²`,
        sprendimas: `Pagrindo perimetras $${4 * a}$ cm; $${4 * a} \\cdot ${h} = ${4 * a * h}$.`,
        brezinys: staciojiPrizme(4, { a: `${a} cm`, h: `${h} cm` }),
      }),

    // 3. Pilnutinis paviršius
    () =>
      uzdavinys(T8, {
        klausimas: `Stačiosios prizmės pagrindas — kvadratas, kurio kraštinė ${a} cm, aukštinė ${h} cm. Koks pilnutinio paviršiaus plotas?`,
        atsakymas: String(4 * a * h + 2 * a * a),
        atsakymasRodymui: `$${4 * a * h + 2 * a * a}$ cm²`,
        sprendimas: `Šoninis $${4 * a * h}$ ir du pagrindai $2 \\cdot ${a * a} = ${2 * a * a}$.`,
      }),

    // 4. Kas yra stačioji prizmė
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kokia prizmė vadinama stačiąja?',
        variantai: [
          'kurios šoninės briaunos statmenos pagrindams',
          'kurios pagrindas — stačiakampis',
          'kurios visos sienos vienodos',
          'kurios pagrindas — statusis trikampis',
        ],
        teisingas: 0,
        sprendimas: 'Tada šoninės sienos yra stačiakampiai.',
      }),

    // 5. Trikampė prizmė
    () =>
      uzdavinys(T8, {
        klausimas: `Stačiosios prizmės pagrindas — statusis trikampis, kurio statiniai ${k1} cm ir ${k2} cm, o prizmės aukštinė ${h} cm. Koks tūris?`,
        atsakymas: String((k1 * k2 * h) / 2),
        atsakymasRodymui: `$${(k1 * k2 * h) / 2}$ cm³`,
        sprendimas: `Pagrindo plotas $${k1} \\cdot ${k2} : 2 = ${(k1 * k2) / 2}$; $${(k1 * k2) / 2} \\cdot ${h} = ${(k1 * k2 * h) / 2}$.`,
        brezinys: staciojiPrizme(3, { a: `${k1} cm`, h: `${h} cm` }),
      }),

    // 6. Šoninis su Pitagoru
    () =>
      uzdavinys(T8, {
        klausimas: `Stačiosios prizmės pagrindas — statusis trikampis, kurio statiniai ${k1} cm ir ${k2} cm. Kokia yra pagrindo įžambinė?`,
        atsakymas: String(izam),
        atsakymasRodymui: `$${izam}$ cm`,
        sprendimas: `$\\sqrt{${k1 * k1} + ${k2 * k2}} = ${izam}$.`,
      }),

    // 7. Aukštinė iš tūrio
    () =>
      uzdavinys(T8, {
        klausimas: `Stačiosios prizmės tūris ${a * a * h} cm³, o pagrindo plotas ${a * a} cm². Kokia jos aukštinė?`,
        atsakymas: String(h),
        atsakymasRodymui: `$${h}$ cm`,
        sprendimas: `$${a * a * h} : ${a * a} = ${h}$.`,
      }),
  ])
}

// ── 8.2. Taisyklingoji piramidė ─────────────────────────────────────────────

const T9 = 'taisyklingoji-piramide-8'

const A_PIRAMIDE = [
  {
    klausimas: 'Piramidės pagrindo plotas 27 cm², aukštinė 5 cm. Koks tūris?',
    atsakymas: '45',
    atsakymasRodymui: '$45$ cm³',
    sprendimas: '$27 \\cdot 5 : 3 = 45$.',
  },
] as const

export const taisyklingojiPiramide8: Generatorius = () => suBandymais(kurkPiramide, A_PIRAMIDE, T9)

function kurkPiramide(): Uzdavinys | null {
  const a = atsitiktinis(3, 12)
  const h = pasirink([3, 6, 9, 12])
  const [k1, k2, izam] = trejetas()

  return variacija([
    // 1. Tūris
    () =>
      uzdavinys(T9, {
        klausimas: `Taisyklingosios keturkampės piramidės pagrindo kraštinė ${a} cm, aukštinė ${h} cm. Koks piramidės tūris?`,
        atsakymas: String((a * a * h) / 3),
        atsakymasRodymui: `$${(a * a * h) / 3}$ cm³`,
        sprendimas: `$${a}^2 \\cdot ${h} : 3 = ${(a * a * h) / 3}$.`,
        brezinys: taisyklingojiPiramide({ a: `${a} cm`, h: `${h} cm` }),
      }),

    // 2. Kas yra taisyklingoji piramidė
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kokia piramidė vadinama taisyklingąja?',
        variantai: [
          'kurios pagrindas — taisyklingasis daugiakampis, o aukštinė eina per jo centrą',
          'kurios visos sienos vienodo dydžio',
          'kurios pagrindas — kvadratas',
          'kurios aukštinė lygi kraštinei',
        ],
        teisingas: 0,
        sprendimas: 'Tada visos šoninės briaunos lygios.',
      }),

    // 3. Apotema ir Pitagoras
    () =>
      uzdavinys(T9, {
        klausimas: `Taisyklingosios keturkampės piramidės pagrindo kraštinė ${2 * k1} cm, aukštinė ${k2} cm. Kokia yra šoninės sienos apotema?`,
        atsakymas: String(izam),
        atsakymasRodymui: `$${izam}$ cm`,
        sprendimas: `Apotema — įžambinė trikampyje, kurio statiniai yra aukštinė ${k2} cm ir pusė pagrindo kraštinės ${k1} cm: $\\sqrt{${k2 * k2} + ${k1 * k1}} = ${izam}$.`,
      }),

    // 4. Šoninių sienų forma
    () =>
      uzdavinys(T9, {
        klausimas: 'Kokios formos yra taisyklingosios piramidės šoninės sienos?',
        atsakymas: 'lygiasoniai trikampiai',
        atsakymasRodymui: 'Lygiašoniai trikampiai',
        sprendimas: 'Visos šoninės briaunos lygios.',
      }),

    // 5. Sienų skaičius
    () =>
      uzdavinys(T9, {
        klausimas: 'Kiek sienų iš viso turi keturkampė piramidė?',
        atsakymas: '5',
        atsakymasRodymui: '$5$',
        sprendimas: 'Keturios šoninės ir vienas pagrindas.',
      }),

    // 6. Palyginimas su prizme
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kiek kartų piramidės tūris mažesnis už prizmės, turinčios tokį patį pagrindą ir aukštinę?',
        variantai: ['3 kartus', '2 kartus', '4 kartus', 'jie lygūs'],
        teisingas: 0,
        sprendimas: 'Piramidės tūrio formulėje yra daliklis 3.',
      }),

    // 7. Aukštinė iš tūrio
    () =>
      uzdavinys(T9, {
        klausimas: `Taisyklingosios keturkampės piramidės tūris ${(a * a * h) / 3} cm³, pagrindo kraštinė ${a} cm. Kokia jos aukštinė?`,
        atsakymas: String(h),
        atsakymasRodymui: `$${h}$ cm`,
        sprendimas: `$${(a * a * h) / 3} \\cdot 3 : ${a * a} = ${h}$.`,
      }),
  ])
}

// ── 8.3. Ritinys ────────────────────────────────────────────────────────────

const T10 = 'ritinys-8'

const A_RITINYS = [
  {
    klausimas: 'Ritinio pagrindo spindulys 3 cm, aukštinė 5 cm. Koks tūris? Užrašyk koeficientą prieš π.',
    atsakymas: '45',
    atsakymasRodymui: '$45\\pi$ cm³',
    sprendimas: '$3^2 \\cdot 5 = 45$.',
  },
] as const

export const ritinys8: Generatorius = () => suBandymais(kurkRitini, A_RITINYS, T10)

function kurkRitini(): Uzdavinys | null {
  const r = atsitiktinis(2, 9)
  const h = atsitiktinis(2, 12)

  return variacija([
    // 1. Tūris
    () =>
      uzdavinys(T10, {
        klausimas: `Ritinio pagrindo spindulys ${r} cm, aukštinė ${h} cm. Koks jo tūris? Užrašyk koeficientą prieš $\\pi$.`,
        atsakymas: String(r * r * h),
        atsakymasRodymui: `$${r * r * h}\\pi$ cm³`,
        sprendimas: `$V = \\pi r^2 h$; $${r}^2 \\cdot ${h} = ${r * r * h}$.`,
        brezinys: ritinysArKugis('ritinys', { r: `${r} cm`, h: `${h} cm` }),
      }),

    // 2. Pagrindo plotas
    () =>
      uzdavinys(T10, {
        klausimas: `Ritinio pagrindo spindulys ${r} cm. Koks pagrindo plotas? Užrašyk koeficientą prieš $\\pi$.`,
        atsakymas: String(r * r),
        atsakymasRodymui: `$${r * r}\\pi$ cm²`,
        sprendimas: `$S = \\pi r^2$; $${r}^2 = ${r * r}$.`,
      }),

    // 3. Šoninis paviršius
    () =>
      uzdavinys(T10, {
        klausimas: `Ritinio spindulys ${r} cm, aukštinė ${h} cm. Koks šoninio paviršiaus plotas? Užrašyk koeficientą prieš $\\pi$.`,
        atsakymas: String(2 * r * h),
        atsakymasRodymui: `$${2 * r * h}\\pi$ cm²`,
        sprendimas: `Šoninis paviršius išklojamas į stačiakampį: $2\\pi r \\cdot h$.`,
        brezinys: ritinysArKugis('ritinys', { r: `${r} cm`, h: `${h} cm` }),
      }),

    // 4. Kaip gaunamas ritinys
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kaip gaunamas ritinys?',
        variantai: [
          'sukant stačiakampį apie vieną jo kraštinę',
          'sukant trikampį apie statinį',
          'sukant apskritimą apie skersmenį',
          'sukant kvadratą apie įstrižainę',
        ],
        teisingas: 0,
        sprendimas: 'Kita kraštinė nubrėžia pagrindo apskritimą.',
      }),

    // 5. Išklotinė
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kokia figūra yra ritinio šoninio paviršiaus išklotinė?',
        variantai: ['stačiakampis', 'trikampis', 'skritulys', 'skritulio išpjova'],
        teisingas: 0,
        sprendimas: 'Jo ilgis lygus pagrindo apskritimo ilgiui.',
      }),

    // 6. Aukštinė iš tūrio
    () =>
      uzdavinys(T10, {
        klausimas: `Ritinio tūris $${r * r * h}\\pi$ cm³, pagrindo spindulys ${r} cm. Kokia jo aukštinė?`,
        atsakymas: String(h),
        atsakymasRodymui: `$${h}$ cm`,
        sprendimas: `$${r * r * h} : ${r * r} = ${h}$.`,
      }),

    // 7. Apytikslis tūris
    () =>
      uzdavinys(T10, {
        klausimas: `Apskaičiuok ritinio, kurio spindulys ${r} cm ir aukštinė ${h} cm, tūrį, imdamas $\\pi \\approx 3$.`,
        atsakymas: String(3 * r * r * h),
        atsakymasRodymui: `$${3 * r * r * h}$ cm³`,
        sprendimas: `$3 \\cdot ${r}^2 \\cdot ${h} = ${3 * r * r * h}$.`,
      }),
  ])
}

// ── 8.4. Kūgis ──────────────────────────────────────────────────────────────

const T11 = 'kugis-8'

const A_KUGIS = [
  {
    klausimas: 'Kūgio spindulys 3 cm, aukštinė 4 cm. Kokia sudaromoji?',
    atsakymas: '5',
    atsakymasRodymui: '$5$ cm',
    sprendimas: '$\\sqrt{3^2 + 4^2} = 5$.',
  },
] as const

export const kugis8: Generatorius = () => suBandymais(kurkKugi, A_KUGIS, T11)

function kurkKugi(): Uzdavinys | null {
  const [r, h, l] = trejetas()
  if (r > 12) return null

  return variacija([
    // 1. Sudaromoji
    () =>
      uzdavinys(T11, {
        klausimas: `Kūgio pagrindo spindulys ${r} cm, aukštinė ${h} cm. Kokia jo sudaromoji?`,
        atsakymas: String(l),
        atsakymasRodymui: `$${l}$ cm`,
        sprendimas: `Sudaromoji yra įžambinė: $\\sqrt{${r * r} + ${h * h}} = ${l}$.`,
        brezinys: ritinysArKugis('kugis', { r: `${r} cm`, h: `${h} cm` }),
      }),

    // 2. Tūris
    () => {
      if ((r * r * h) % 3 !== 0) return null
      return uzdavinys(T11, {
        klausimas: `Kūgio spindulys ${r} cm, aukštinė ${h} cm. Koks tūris? Užrašyk koeficientą prieš $\\pi$.`,
        atsakymas: String((r * r * h) / 3),
        atsakymasRodymui: `$${(r * r * h) / 3}\\pi$ cm³`,
        sprendimas: `$V = \\dfrac{\\pi r^2 h}{3}$; $${r * r} \\cdot ${h} : 3 = ${(r * r * h) / 3}$.`,
        brezinys: ritinysArKugis('kugis', { r: `${r} cm`, h: `${h} cm` }),
      })
    },

    // 3. Aukštinė iš sudaromosios
    () =>
      uzdavinys(T11, {
        klausimas: `Kūgio sudaromoji ${l} cm, pagrindo spindulys ${r} cm. Kokia jo aukštinė?`,
        atsakymas: String(h),
        atsakymasRodymui: `$${h}$ cm`,
        sprendimas: `$\\sqrt{${l * l} - ${r * r}} = ${h}$.`,
      }),

    // 4. Kaip gaunamas kūgis
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kaip gaunamas kūgis?',
        variantai: [
          'sukant statųjį trikampį apie vieną jo statinį',
          'sukant stačiakampį apie kraštinę',
          'sukant trikampį apie įžambinę',
          'sukant skritulį apie spindulį',
        ],
        teisingas: 0,
        sprendimas: 'Kitas statinys nubrėžia pagrindo skritulį.',
      }),

    // 5. Išklotinė
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kokia figūra yra kūgio šoninio paviršiaus išklotinė?',
        variantai: ['skritulio išpjova', 'stačiakampis', 'trikampis', 'skritulys'],
        teisingas: 0,
        sprendimas: 'Išpjovos spindulys lygus kūgio sudaromajai.',
      }),

    // 6. Palyginimas su ritiniu
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kiek kartų kūgio tūris mažesnis už ritinio, turinčio tokį patį pagrindą ir aukštinę?',
        variantai: ['3 kartus', '2 kartus', '4 kartus', 'jie lygūs'],
        teisingas: 0,
        sprendimas: 'Kūgio tūrio formulėje yra daliklis 3.',
      }),

    // 7. Ašinis pjūvis
    () =>
      uzdavinys(T11, {
        klausimas: `Kūgio pagrindo spindulys ${r} cm, aukštinė ${h} cm. Koks yra jo ašinio pjūvio plotas?`,
        atsakymas: String(r * h),
        atsakymasRodymui: `$${r * h}$ cm²`,
        sprendimas: `Ašinis pjūvis — trikampis, kurio pagrindas $${2 * r}$ cm: $${2 * r} \\cdot ${h} : 2 = ${r * h}$.`,
      }),
  ])
}

// ── 8.5. Rutulys ir sfera ───────────────────────────────────────────────────

const T12 = 'rutulys-ir-sfera'

const A_RUTULYS = [
  {
    klausimas: 'Kuo sfera skiriasi nuo rutulio?',
    atsakymas: 'sfera yra pavirsius',
    atsakymasRodymui: 'Sfera yra tik paviršius, o rutulys — ir vidus',
    sprendimas: 'Rutulys apima visus taškus, nutolusius ne daugiau kaip R.',
  },
] as const

export const rutulysIrSfera: Generatorius = () => suBandymais(kurkRutuli, A_RUTULYS, T12)

function kurkRutuli(): Uzdavinys | null {
  const r = atsitiktinis(2, 12)

  return variacija([
    // 1. Kuo skiriasi
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kuo sfera skiriasi nuo rutulio?',
        variantai: [
          'sfera yra tik paviršius, o rutulys — kūnas su vidumi',
          'sfera didesnė',
          'rutulys plokščias',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Sfera — visi taškai, nutolę per R; rutulys — ir visi arčiau esantys.',
        brezinys: apskritimas({ spindulys: `${r} cm` }),
      }),

    // 2. Skersmuo
    () =>
      uzdavinys(T12, {
        klausimas: `Rutulio spindulys ${r} cm. Koks jo skersmuo?`,
        atsakymas: String(2 * r),
        atsakymasRodymui: `$${2 * r}$ cm`,
        sprendimas: `$${r} \\cdot 2 = ${2 * r}$.`,
      }),

    // 3. Sferos plotas
    () =>
      uzdavinys(T12, {
        klausimas: `Sferos spindulys ${r} cm. Koks jos paviršiaus plotas? Užrašyk koeficientą prieš $\\pi$.`,
        atsakymas: String(4 * r * r),
        atsakymasRodymui: `$${4 * r * r}\\pi$ cm²`,
        sprendimas: `$S = 4\\pi R^2$; $4 \\cdot ${r * r} = ${4 * r * r}$.`,
      }),

    // 4. Pjūvis
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kokia figūra gaunama perpjovus rutulį plokštuma?',
        variantai: ['skritulys', 'kvadratas', 'trikampis', 'elipsė'],
        teisingas: 0,
        sprendimas: 'Didžiausias skritulys gaunamas pjaunant per centrą.',
      }),

    // 5. Didysis apskritimas
    () =>
      uzdavinys(T12, {
        klausimas: `Rutulio spindulys ${r} cm. Koks yra didžiausio pjūvio skritulio plotas? Užrašyk koeficientą prieš $\\pi$.`,
        atsakymas: String(r * r),
        atsakymasRodymui: `$${r * r}\\pi$ cm²`,
        sprendimas: `Pjaunant per centrą spindulys lieka ${r} cm: $${r}^2 = ${r * r}$.`,
      }),

    // 6. Kaip gaunamas rutulys
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kaip gaunamas rutulys?',
        variantai: [
          'sukant pusskritulį apie skersmenį',
          'sukant apskritimą apie liestinę',
          'sukant kvadratą apie kraštinę',
          'sukant trikampį apie kraštinę',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienas pusskritulio taškas nubrėžia apskritimą.',
      }),

    // 7. Spindulys iš skersmens
    () =>
      uzdavinys(T12, {
        klausimas: `Rutulio skersmuo ${2 * r} cm. Koks jo spindulys?`,
        atsakymas: String(r),
        atsakymasRodymui: `$${r}$ cm`,
        sprendimas: `$${2 * r} : 2 = ${r}$.`,
      }),
  ])
}

// ── Objekto vaizdai iš viršaus, priekio ir šono bei mastelis ────────────────

const T13 = 'objekto-vaizdai-mastelis'

const A_VAIZDAI = [
  {
    klausimas: 'Brėžinio mastelis 1 : 100. Kokį tikrąjį ilgį atitinka 5 cm brėžinyje?',
    atsakymas: '500',
    atsakymasRodymui: '$500$ cm',
    sprendimas: '$5 \\cdot 100 = 500$.',
  },
] as const

export const objektoVaizdaiMastelis: Generatorius = () => suBandymais(kurkVaizdus, A_VAIZDAI, T13)

function kurkVaizdus(): Uzdavinys | null {
  const mastelis = pasirink([10, 20, 50, 100, 200, 500])
  const brezinyje = atsitiktinis(2, 12)
  const a = atsitiktinis(2, 6)
  const b = atsitiktinis(2, 6)
  const c = atsitiktinis(2, 6)

  return variacija([
    // 1. Tikrasis ilgis
    () =>
      uzdavinys(T13, {
        klausimas: `Brėžinio mastelis $1 : ${mastelis}$. Kokį tikrąjį ilgį centimetrais atitinka ${brezinyje} cm brėžinyje?`,
        atsakymas: String(brezinyje * mastelis),
        atsakymasRodymui: `$${brezinyje * mastelis}$ cm`,
        sprendimas: `$${brezinyje} \\cdot ${mastelis} = ${brezinyje * mastelis}$.`,
      }),

    // 2. Ilgis brėžinyje
    () =>
      uzdavinys(T13, {
        klausimas: `Brėžinio mastelis $1 : ${mastelis}$. Kokio ilgio brėžinyje bus ${brezinyje * mastelis} cm objektas?`,
        atsakymas: String(brezinyje),
        atsakymasRodymui: `$${brezinyje}$ cm`,
        sprendimas: `$${brezinyje * mastelis} : ${mastelis} = ${brezinyje}$.`,
      }),

    // 3. Ką rodo mastelis
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Ką reiškia mastelis $1 : ${mastelis}$?`,
        variantai: [
          `tikrieji matmenys yra ${mastelis} kartus didesni už brėžinio`,
          `tikrieji matmenys yra ${mastelis} kartus mažesni`,
          `brėžinys ${mastelis} kartus didesnis`,
          'matmenys sutampa',
        ],
        teisingas: 0,
        sprendimas: 'Pirmasis skaičius rodo brėžinį, antrasis — tikrovę.',
      }),

    // 4. Vaizdas iš viršaus
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Ką rodo objekto vaizdas iš viršaus?',
        variantai: [
          'objekto ilgį ir plotį',
          'objekto ilgį ir aukštį',
          'objekto plotį ir aukštį',
          'tik aukštį',
        ],
        teisingas: 0,
        sprendimas: 'Aukštis iš viršaus nematomas.',
      }),

    // 5. Kiek vaizdų
    () =>
      uzdavinys(T13, {
        klausimas: 'Kiek vaizdų (iš priekio, šono ir viršaus) paprastai pakanka objektui aprašyti?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Kiekvienas parodo po du matmenis.',
      }),

    // 6. Gretasienio vaizdai
    () =>
      uzdavinys(T13, {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm (ilgis, plotis, aukštis). Koks yra vaizdo iš viršaus plotas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `Iš viršaus matomas ilgis ir plotis: $${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 7. Vaizdas iš priekio
    () =>
      uzdavinys(T13, {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm (ilgis, plotis, aukštis). Koks yra vaizdo iš priekio plotas?`,
        atsakymas: String(a * c),
        atsakymasRodymui: `$${a * c}$ cm²`,
        sprendimas: `Iš priekio matomas ilgis ir aukštis: $${a} \\cdot ${c} = ${a * c}$.`,
      }),
  ])
}
