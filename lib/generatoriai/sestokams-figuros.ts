import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { dvaTrikampiai, panasusStaciakampiai, trikampisSuZymemis } from './sestokams-vaizdai'
import { sk4 } from './ketvirtokams-bendra'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 6 klasės temos „Lygios plokštumos figūros“ ir „Panašiosios plokštumos
 * figūros“ — keturiolika potemių.
 *
 * Trys trikampių lygumo požymiai turi atskirus generatorius, nes tai trys
 * skirtingi duomenų rinkiniai: dvi kraštinės ir kampas tarp jų, kraštinė ir
 * du kampai prie jos, trys kraštinės. Brėžinyje pažymima būtent tiek, kiek
 * požymiui reikia — kitaip mokinys neturėtų ko atpažinti.
 *
 * Programoje šioje temoje yra ir dvi potemės, kurių turinio apraše nėra —
 * „Figūrų didinimas, mažinimas ir figūrų sekos“ ir „Metrinė matavimo sistema
 * ir vienetų keitimas“; abi čia priklauso, nes mastelis ir vienetų keitimas
 * remiasi tuo pačiu daugybos iš koeficiento veiksmu.
 */

const ILGIO_VIENETAI = [
  { vardas: 'mm', mm: 1 },
  { vardas: 'cm', mm: 10 },
  { vardas: 'dm', mm: 100 },
  { vardas: 'm', mm: 1000 },
  { vardas: 'km', mm: 1000000 },
] as const

// ── 9.1.1. Lygios plokštumos figūros ────────────────────────────────────────

const T1 = 'lygios-figuros-6'

const A_LYGIOS = [
  {
    klausimas: 'Kokios figūros vadinamos lygiomis?',
    atsakymas: 'sutampancios uzdejus',
    atsakymasRodymui: 'Tos, kurios uždėtos viena ant kitos sutampa',
    sprendimas: 'Lygios figūros turi vienodą formą ir vienodą dydį.',
  },
] as const

export const lygiosFiguros6: Generatorius = () => suBandymais(kurkLygias, A_LYGIOS, T1)

function kurkLygias(): Uzdavinys | null {
  const a = atsitiktinis(4, 8)
  const b = atsitiktinis(4, 8)
  const c = atsitiktinis(Math.abs(a - b) + 1, a + b - 1)
  if (c < 3 || c > 10) return null

  return variacija([
    // 1. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kokios figūros vadinamos lygiomis?',
        variantai: [
          'tos, kurios uždėtos viena ant kitos sutampa',
          'tos, kurių plotai vienodi',
          'tos, kurios turi tiek pat kraštinių',
          'tos, kurios nubrėžtos vienodai',
        ],
        teisingas: 0,
        sprendimas: 'Vienodo ploto figūros gali būti visai skirtingos formos.',
      }),

    // 2. Kas sutampa lygiose figūrose
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kas sutampa dviejose lygiose figūrose?',
        variantai: [
          'visos atitinkamos kraštinės ir visi atitinkami kampai',
          'tik kraštinės',
          'tik kampai',
          'tik plotas',
        ],
        teisingas: 0,
        sprendimas: 'Todėl iš lygumo iš karto seka ir plotų, ir perimetrų lygybė.',
        brezinys: dvaTrikampiai(
          { a, b, c, z: { a: String(a), b: String(b), c: String(c) } },
          { a, b, c, z: { a: String(a), b: String(b), c: String(c), raides: ['D', 'E', 'F'] } },
        ),
      }),

    // 3. Perimetras lygiose figūrose
    () =>
      uzdavinys(T1, {
        klausimas: `Trikampiai $ABC$ ir $DEF$ lygūs. Trikampio $ABC$ kraštinės yra ${a} cm, ${b} cm ir ${c} cm. Koks trikampio $DEF$ perimetras?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$ cm`,
        sprendimas: `Lygių figūrų atitinkamos kraštinės lygios: $${a} + ${b} + ${c} = ${a + b + c}$.`,
      }),

    // 4. Atitinkama kraštinė
    () =>
      uzdavinys(T1, {
        klausimas: `Trikampiai $ABC$ ir $DEF$ lygūs, o $AB = ${a}$ cm. Kokio ilgio kraštinė $DE$?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ cm`,
        sprendimas: 'Viršūnės išvardytos ta pačia tvarka, tad $AB$ atitinka $DE$.',
      }),

    // 5. Atitinkamas kampas
    () => {
      const kampas = atsitiktinis(30, 100)
      return uzdavinys(T1, {
        klausimas: `Trikampiai $ABC$ ir $DEF$ lygūs, o kampas $A$ lygus ${kampas}°. Kiek laipsnių turi kampas $D$?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: 'Atitinkami lygių trikampių kampai lygūs.',
      })
    },

    // 6. Ar vienodo ploto reiškia lygios
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ar dvi vienodo ploto figūros būtinai yra lygios?',
        variantai: [
          'ne, jos gali būti skirtingos formos',
          'taip, visada',
          'taip, jei tai daugiakampiai',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: '$2 \\times 6$ ir $3 \\times 4$ stačiakampių plotai vienodi, bet patys stačiakampiai skirtingi.',
      }),

    // 7. Kaip patikrinti
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kaip praktiškai patikrinti, ar dvi figūros lygios?',
        variantai: [
          'perbraižyti vieną ant skaidraus popieriaus ir uždėti ant kitos',
          'palyginti jų plotus',
          'suskaičiuoti kraštines',
          'išmatuoti tik vieną kraštinę',
        ],
        teisingas: 0,
        sprendimas: 'Figūrą galima ir pasukti, ir apversti — svarbu, kad sutaptų.',
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: 'Mokinys teigia, kad pasukta figūra nebėra lygi pradinei. Ar jis teisus?',
        atsakymas: 'ne',
        atsakymasRodymui: 'Ne',
        sprendimas: 'Posūkis keičia tik padėtį, o ne formą ir dydį.',
      }),
  ])
}

// ── 9.1.2. Trikampio kraštinės ir kampai ────────────────────────────────────

const T2 = 'trikampio-krastines-kampai'

const A_KRASTINES = [
  {
    klausimas: 'Kiek laipsnių turi trikampio kampų suma?',
    atsakymas: '180',
    atsakymasRodymui: '$180°$',
    sprendimas: 'Ši savybė galioja bet kuriam trikampiui.',
  },
] as const

export const trikampioKrastinesKampai: Generatorius = () => suBandymais(kurkKrastines, A_KRASTINES, T2)

function kurkKrastines(): Uzdavinys | null {
  const a = atsitiktinis(30, 90)
  const b = atsitiktinis(30, 170 - a)
  const c = 180 - a - b
  if (c < 20) return null

  return variacija([
    // 1. Trečiasis kampas
    () =>
      uzdavinys(T2, {
        klausimas: `Du trikampio kampai yra ${a}° ir ${b}°. Kiek laipsnių turi trečiasis?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}°$`,
        sprendimas: `$180 - ${a} - ${b} = ${c}$.`,
      }),

    // 2. Prieš didesnę kraštinę
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuris trikampio kampas yra didžiausias?',
        variantai: [
          'tas, kuris yra prieš ilgiausią kraštinę',
          'tas, kuris yra prieš trumpiausią kraštinę',
          'visi kampai vienodi',
          'tas, kuris nubrėžtas viršuje',
        ],
        teisingas: 0,
        sprendimas: 'Trikampyje prieš didesnę kraštinę visada yra didesnis kampas.',
      }),

    // 3. Kraštinių ilgiai iš brėžinio
    () => {
      const x = atsitiktinis(4, 9)
      const y = atsitiktinis(4, 9)
      const z = atsitiktinis(Math.abs(x - y) + 1, x + y - 1)
      if (z < 3 || z > 11) return null
      const ilgiausia = Math.max(x, y, z)
      return uzdavinys(T2, {
        klausimas: 'Kokio ilgio yra ilgiausia pavaizduoto trikampio kraštinė?',
        atsakymas: String(ilgiausia),
        atsakymasRodymui: `$${ilgiausia}$ cm`,
        sprendimas: 'Lyginami užrašyti kraštinių ilgiai.',
        brezinys: trikampisSuZymemis(x, y, z, { a: `${x} cm`, b: `${y} cm`, c: `${z} cm` }),
      })
    },

    // 4. Lygiašonis
    () => {
      const pagrindo = atsitiktinis(30, 75)
      return uzdavinys(T2, {
        klausimas: `Lygiašonio trikampio kampai prie pagrindo po ${pagrindo}°. Kiek laipsnių turi viršūnės kampas?`,
        atsakymas: String(180 - 2 * pagrindo),
        atsakymasRodymui: `$${180 - 2 * pagrindo}°$`,
        sprendimas: `$180 - ${pagrindo} \\cdot 2 = ${180 - 2 * pagrindo}$.`,
      })
    },

    // 5. Lygiakraštis
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek laipsnių turi kiekvienas lygiakraščio trikampio kampas?',
        atsakymas: '60',
        atsakymasRodymui: `$60°$`,
        sprendimas: '$180 : 3 = 60$.',
      }),

    // 6. Rūšis pagal kampus
    () => {
      const didziausias = Math.max(a, b, c)
      const rusis = didziausias > 90 ? 'bukasis' : didziausias === 90 ? 'statusis' : 'smailusis'
      return uzdavinys(T2, {
        klausimas: `Trikampio kampai yra ${a}°, ${b}° ir ${c}°. Koks tai trikampis pagal kampus?`,
        atsakymas: rusis,
        atsakymasRodymui: rusis.charAt(0).toUpperCase() + rusis.slice(1),
        sprendimas: `Didžiausias kampas ${didziausias}°.`,
      })
    },

    // 7. Kampų santykis
    () => {
      const dalis = pasirink([2, 3, 5])
      if (180 % (1 + 2 * dalis) !== 0) return null
      const maziausias = 180 / (1 + 2 * dalis)
      return uzdavinys(T2, {
        klausimas: `Trikampio du kampai lygūs, o kiekvienas jų ${dalis} kartus didesnis už trečiąjį. Kiek laipsnių turi mažiausias kampas?`,
        atsakymas: String(maziausias),
        atsakymasRodymui: `$${maziausias}°$`,
        sprendimas: `Kampai sudaro $1 + ${dalis} + ${dalis} = ${1 + 2 * dalis}$ dalis: $180 : ${1 + 2 * dalis} = ${maziausias}$.`,
      })
    },

    // 8. Klaidos radimas
    () => {
      const x = atsitiktinis(95, 130)
      const y = atsitiktinis(95, 130)
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar gali trikampio kampai būti ${x}° ir ${y}°?`,
        variantai: [
          `ne, nes $${x} + ${y} = ${x + y}$ jau viršija $180°$`,
          'taip, jei trečiasis kampas mažas',
          'taip, jei trikampis bukasis',
        ],
        teisingas: 0,
        sprendimas: 'Visų trijų kampų suma turi būti lygiai 180°.',
      })
    },
  ])
}

// ── 9.1.3. Lygumo požymis pagal dvi kraštines ir kampą tarp jų ──────────────

const T3 = 'lygumas-dvi-krastines-kampas'

const A_POZ1 = [
  {
    klausimas: 'Pagal kurį požymį trikampiai lygūs, jei sutampa dvi kraštinės ir kampas tarp jų?',
    atsakymas: 'pagal dvi krastines ir kampa tarp ju',
    atsakymasRodymui: 'Pagal dvi kraštines ir kampą tarp jų',
    sprendimas: 'Tokie duomenys trikampį apibrėžia vienareikšmiškai.',
  },
] as const

export const lygumasDviKrastinesKampas: Generatorius = () => suBandymais(kurkPoz1, A_POZ1, T3)

function kurkPoz1(): Uzdavinys | null {
  const a = atsitiktinis(5, 9)
  const b = atsitiktinis(5, 9)
  const c = atsitiktinis(Math.abs(a - b) + 1, a + b - 1)
  if (c < 3 || c > 11) return null
  const kampas = atsitiktinis(35, 100)

  return variacija([
    // 1. Kokių duomenų pakanka
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kokių duomenų pakanka, kad du trikampiai būtų lygūs pagal pirmąjį požymį?',
        variantai: [
          'dvi kraštinės ir kampas tarp jų',
          'dvi kraštinės ir bet kuris kampas',
          'trys kampai',
          'viena kraštinė ir vienas kampas',
        ],
        teisingas: 0,
        sprendimas: 'Kampas turi būti būtent tarp tų dviejų kraštinių.',
        brezinys: dvaTrikampiai(
          { a, b, c, z: { a: String(a), b: String(b), kampasA: `${kampas}°` } },
          { a, b, c, z: { a: String(a), b: String(b), kampasA: `${kampas}°`, raides: ['D', 'E', 'F'] } },
        ),
      }),

    // 2. Ar trikampiai lygūs
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Trikampiuose $ABC$ ir $DEF$ žinoma: $AB = DE = ${a}$ cm, $AC = DF = ${b}$ cm, o kampai $A$ ir $D$ lygūs. Ar trikampiai lygūs?`,
        variantai: [
          'taip, pagal dvi kraštines ir kampą tarp jų',
          'ne, duomenų per mažai',
          'taip, pagal tris kraštines',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Kampas $A$ yra tarp kraštinių $AB$ ir $AC$, tad požymis tinka.',
      }),

    // 3. Trūkstamas duomuo
    () =>
      uzdavinys(T3, {
        klausimas: `Trikampiuose $ABC$ ir $DEF$ jau žinoma, kad $AB = DE$ ir $AC = DF$. Kurio dar dydžio lygybės reikia, kad trikampiai būtų lygūs pagal pirmąjį požymį? Užrašyk kampo raidę pirmajame trikampyje.`,
        atsakymas: 'A',
        atsakymasRodymui: 'Kampo $A$',
        sprendimas: 'Reikia kampo tarp žinomų kraštinių, o jos abi išeina iš viršūnės $A$.',
      }),

    // 4. Kodėl kampas turi būti tarp
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kodėl kampas turi būti būtent tarp dviejų žinomų kraštinių?',
        variantai: [
          'nes tada trečioji kraštinė nustatoma vienareikšmiškai',
          'nes taip lengviau braižyti',
          'nes kitaip kampas per didelis',
          'nes kampų suma yra 180°',
        ],
        teisingas: 0,
        sprendimas: 'Žinant dvi kraštines ir kampą tarp jų, trikampį galima atkurti tik vienu būdu.',
      }),

    // 5. Atitinkama kraštinė
    () =>
      uzdavinys(T3, {
        klausimas: `Trikampiai lygūs pagal dvi kraštines ir kampą tarp jų: $AB = DE = ${a}$ cm, $AC = DF = ${b}$ cm. Kokio ilgio kraštinė $EF$, jei $BC = ${c}$ cm?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$ cm`,
        sprendimas: 'Lygiuose trikampiuose lygios ir likusios atitinkamos kraštinės.',
      }),

    // 6. Perimetras
    () =>
      uzdavinys(T3, {
        klausimas: `Trikampiai $ABC$ ir $DEF$ lygūs, o $ABC$ kraštinės ${a} cm, ${b} cm ir ${c} cm. Koks $DEF$ perimetras?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$ cm`,
        sprendimas: `$${a} + ${b} + ${c} = ${a + b + c}$.`,
      }),

    // 7. Kampas iš lygumo
    () =>
      uzdavinys(T3, {
        klausimas: `Trikampiai lygūs, o pirmojo kampas prie viršūnės $A$ lygus ${kampas}°. Kiek laipsnių turi antrojo trikampio kampas $D$?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: 'Atitinkami lygių trikampių kampai lygūs.',
        brezinys: dvaTrikampiai(
          { a, b, c, z: { kampasA: `${kampas}°` } },
          { a, b, c, z: { kampasA: '?', raides: ['D', 'E', 'F'] } },
        ),
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Mokinys teigia, kad trikampiai lygūs, nes $AB = DE$, $AC = DF$ ir lygūs kampai $B$ ir $E$. Kodėl to nepakanka pirmajam požymiui?`,
        variantai: [
          'nes kampas $B$ nėra tarp kraštinių $AB$ ir $AC$',
          'nes kampų reikia dviejų',
          'nes kraštinės per trumpos',
          'jis teisus',
        ],
        teisingas: 0,
        sprendimas: 'Pirmajam požymiui reikia kampo tarp žinomų kraštinių, t. y. kampo $A$.',
      }),
  ])
}

// ── 9.1.4. Lygumo požymis pagal kraštinę ir du kampus prie jos ──────────────

const T4 = 'lygumas-krastine-du-kampai'

const A_POZ2 = [
  {
    klausimas: 'Kokių duomenų reikia antrajam trikampių lygumo požymiui?',
    atsakymas: 'krastine ir du kampai prie jos',
    atsakymasRodymui: 'Kraštinė ir du kampai prie jos',
    sprendimas: 'Kampai turi remtis į tą pačią kraštinę.',
  },
] as const

export const lygumasKrastineDuKampai: Generatorius = () => suBandymais(kurkPoz2, A_POZ2, T4)

function kurkPoz2(): Uzdavinys | null {
  const a = atsitiktinis(6, 10)
  const kampas1 = atsitiktinis(35, 70)
  const kampas2 = atsitiktinis(35, 70)
  const trecias = 180 - kampas1 - kampas2
  if (trecias < 25) return null

  return variacija([
    // 1. Kokių duomenų reikia
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kokių duomenų reikia antrajam trikampių lygumo požymiui?',
        variantai: [
          'kraštinės ir dviejų kampų prie jos',
          'trijų kampų',
          'dviejų kraštinių',
          'kraštinės ir vieno kampo',
        ],
        teisingas: 0,
        sprendimas: 'Abu kampai turi remtis į tą pačią žinomą kraštinę.',
      }),

    // 2. Ar trikampiai lygūs
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Trikampiuose $ABC$ ir $DEF$: $AB = DE = ${a}$ cm, kampas $A$ lygus kampui $D$, kampas $B$ lygus kampui $E$. Ar trikampiai lygūs?`,
        variantai: [
          'taip, pagal kraštinę ir du kampus prie jos',
          'ne, reikia dar vienos kraštinės',
          'taip, pagal tris kraštines',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Kampai $A$ ir $B$ remiasi į kraštinę $AB$.',
      }),

    // 3. Trečiasis kampas
    () =>
      uzdavinys(T4, {
        klausimas: `Trikampyje du kampai prie kraštinės yra ${kampas1}° ir ${kampas2}°. Kiek laipsnių turi trečiasis kampas?`,
        atsakymas: String(trecias),
        atsakymasRodymui: `$${trecias}°$`,
        sprendimas: `$180 - ${kampas1} - ${kampas2} = ${trecias}$.`,
      }),

    // 4. Kodėl trijų kampų nepakanka
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl trijų lygių kampų nepakanka, kad trikampiai būtų lygūs?',
        variantai: [
          'nes trikampiai gali būti skirtingo dydžio, tik vienodos formos',
          'nes kampų suma visada 180°',
          'nes kampai neišmatuojami',
          'to pakanka',
        ],
        teisingas: 0,
        sprendimas: 'Tokie trikampiai yra panašūs, bet nebūtinai lygūs.',
      }),

    // 5. Iš brėžinio
    () => {
      const b = atsitiktinis(5, 9)
      const c = atsitiktinis(Math.abs(a - b) + 1, a + b - 1)
      if (c < 3 || c > 12) return null
      return uzdavinys(T4, {
        klausimas: 'Kiek laipsnių turi antrojo trikampio kampas, pažymėtas klaustuku, jei trikampiai lygūs?',
        atsakymas: String(kampas1),
        atsakymasRodymui: `$${kampas1}°$`,
        sprendimas: 'Atitinkami lygių trikampių kampai lygūs.',
        brezinys: dvaTrikampiai(
          { a, b, c, z: { a: String(a), kampasA: `${kampas1}°` } },
          { a, b, c, z: { a: String(a), kampasA: '?', raides: ['D', 'E', 'F'] } },
        ),
      })
    },

    // 6. Kuri kraštinė
    () =>
      uzdavinys(T4, {
        klausimas: 'Žinomi trikampio kampai $A$ ir $B$. Kurios kraštinės ilgio dar reikia antrajam lygumo požymiui? Užrašyk ją dviem raidėmis.',
        atsakymas: 'AB',
        atsakymasRodymui: '$AB$',
        sprendimas: 'Abu žinomi kampai remiasi būtent į kraštinę $AB$.',
      }),

    // 7. Taikymas
    () =>
      uzdavinys(T4, {
        klausimas: `Du trikampiai lygūs pagal kraštinę ir du kampus prie jos. Pirmojo kraštinė lygi ${a} cm, o kampai prie jos ${kampas1}° ir ${kampas2}°. Kiek laipsnių turi antrojo trikampio trečiasis kampas?`,
        atsakymas: String(trecias),
        atsakymasRodymui: `$${trecias}°$`,
        sprendimas: `Trikampiai lygūs, tad ir trečiasis kampas toks pat: $180 - ${kampas1} - ${kampas2} = ${trecias}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Mokinys teigia, kad trikampiai lygūs, nes $AB = DE$ ir lygūs kampai $A$ ir $D$ bei $C$ ir $F$. Ar to pakanka?`,
        variantai: [
          'taip, nes iš dviejų kampų randamas ir trečiasis, o jis remiasi į tą pačią kraštinę',
          'ne, kampas $C$ neremiasi į $AB$',
          'ne, reikia visų trijų kraštinių',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: `Kampas $B$ randamas iš $180° - \\angle A - \\angle C$, tad turimi abu kampai prie kraštinės $AB$.`,
      }),
  ])
}

// ── 9.1.5. Lygumo požymis pagal tris kraštines ──────────────────────────────

const T5 = 'lygumas-trys-krastines'

const A_POZ3 = [
  {
    klausimas: 'Ar du trikampiai, kurių visos trys kraštinės atitinkamai lygios, yra lygūs?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: 'Tai trečiasis trikampių lygumo požymis.',
  },
] as const

export const lygumasTrysKrastines: Generatorius = () => suBandymais(kurkPoz3, A_POZ3, T5)

function kurkPoz3(): Uzdavinys | null {
  const a = atsitiktinis(5, 10)
  const b = atsitiktinis(5, 10)
  const c = atsitiktinis(Math.abs(a - b) + 1, a + b - 1)
  if (c < 3 || c > 12) return null

  return variacija([
    // 1. Ar lygūs
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Trikampių $ABC$ ir $DEF$ kraštinės atitinkamai lygios: ${a} cm, ${b} cm ir ${c} cm. Ar trikampiai lygūs?`,
        variantai: [
          'taip, pagal tris kraštines',
          'ne, dar reikia kampo',
          'taip, bet tik jei trikampiai statieji',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Trys kraštinės trikampį apibrėžia vienareikšmiškai.',
        brezinys: dvaTrikampiai(
          { a, b, c, z: { a: String(a), b: String(b), c: String(c) } },
          { a, b, c, z: { a: String(a), b: String(b), c: String(c), raides: ['D', 'E', 'F'] } },
        ),
      }),

    // 2. Kodėl kampo nereikia
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kodėl žinant tris kraštines kampų matuoti nebereikia?',
        variantai: [
          'nes trys kraštinės vienareikšmiškai nustato ir visus kampus',
          'nes kampai visada lygūs 60°',
          'nes kampų suma yra 180°',
          'nes kraštinės ilgesnės už kampus',
        ],
        teisingas: 0,
        sprendimas: 'Iš trijų atkarpų galima sudėti tik vieną trikampį.',
      }),

    // 3. Kampas iš lygumo
    () => {
      const kampas = atsitiktinis(35, 100)
      return uzdavinys(T5, {
        klausimas: `Trikampiai lygūs pagal tris kraštines. Pirmojo kampas $A$ lygus ${kampas}°. Kiek laipsnių turi kampas $D$?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: 'Iš kraštinių lygybės seka ir kampų lygybė.',
      })
    },

    // 4. Kiek požymių iš viso
    () =>
      uzdavinys(T5, {
        klausimas: 'Kiek trikampių lygumo požymių mokomasi šioje temoje?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Pagal dvi kraštines ir kampą tarp jų, pagal kraštinę ir du kampus prie jos, pagal tris kraštines.',
      }),

    // 5. Poros
    () =>
      poruUzdavinys(naujasId(T5), T5, {
        klausimas: 'Sujunk duomenų rinkinį su lygumo požymiu.',
        poros: [
          { kaire: 'dvi kraštinės ir kampas tarp jų', desine: 'pirmasis požymis' },
          { kaire: 'kraštinė ir du kampai prie jos', desine: 'antrasis požymis' },
          { kaire: 'trys kraštinės', desine: 'trečiasis požymis' },
          { kaire: 'trys kampai', desine: 'lygumo neįrodo' },
        ],
        sprendimas: 'Trys kampai rodo tik panašumą, ne lygumą.',
      }),

    // 6. Trikampio nelygybė kaip sąlyga
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kada iš trijų duotų atkarpų trikampio sudaryti neįmanoma?',
        variantai: [
          'kai dviejų atkarpų suma nedidesnė už trečiąją',
          'kai visos atkarpos skirtingos',
          'kai atkarpos labai ilgos',
          'tokio atvejo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Tada trumpesnės atkarpos tiesiog nesusieina.',
      }),

    // 7. Perimetras
    () =>
      uzdavinys(T5, {
        klausimas: `Du trikampiai lygūs pagal tris kraštines, o pirmojo perimetras ${a + b + c} cm. Koks antrojo perimetras?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$ cm`,
        sprendimas: 'Kraštinės atitinkamai lygios, tad ir perimetrai lygūs.',
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Mokinys teigia, kad du trikampiai lygūs, nes jų perimetrai vienodi. Ar to pakanka?',
        variantai: [
          'ne, vienodo perimetro trikampiai gali būti skirtingi',
          'taip, perimetro pakanka',
          'taip, jei trikampiai smailieji',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Perimetrą 12 cm turi ir trikampis 3–4–5, ir 4–4–4.',
      }),
  ])
}

// ── 9.2.1. Braižome kampą, lygų duotam kampui ───────────────────────────────

const T6 = 'braizome-lygu-kampa'

const A_BRAIZOME_KAMPA = [
  {
    klausimas: 'Kokiais įrankiais braižomas kampas, lygus duotam, be matlankio?',
    atsakymas: 'skriestuvu ir liniuote',
    atsakymasRodymui: 'Skriestuvu ir liniuote',
    sprendimas: 'Skriestuvu perkeliami atstumai, o liniuote brėžiami spinduliai.',
  },
] as const

export const braizomeLyguKampa: Generatorius = () => suBandymais(kurkBraizymaKampo, A_BRAIZOME_KAMPA, T6)

function kurkBraizymaKampo(): Uzdavinys | null {
  const kampas = atsitiktinis(25, 140)

  return variacija([
    // 1. Kokie įrankiai
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kokiais įrankiais braižomas kampas, lygus duotam, nematuojant matlankiu?',
        variantai: ['skriestuvu ir liniuote', 'tik matlankiu', 'tik liniuote', 'trikampiu ir pieštuku'],
        teisingas: 0,
        sprendimas: 'Skriestuvu perkeliami atstumai, o kampo dydis atkuriamas savaime.',
      }),

    // 2. Koks bus gautas kampas
    () =>
      uzdavinys(T6, {
        klausimas: `Nubraižytas kampas, lygus ${kampas}° kampui. Kiek laipsnių jis turi?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: 'Braižant lygų kampą jo dydis nesikeičia.',
      }),

    // 3. Kodėl veikia
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kuriuo trikampių lygumo požymiu remiasi kampo perbraižymas skriestuvu?',
        variantai: [
          'pagal tris kraštines',
          'pagal dvi kraštines ir kampą tarp jų',
          'pagal kraštinę ir du kampus',
          'jokiu — tai tik braižymo būdas',
        ],
        teisingas: 0,
        sprendimas: 'Skriestuvu perkeliami trys atstumai, tad gaunami lygūs trikampiai, o kartu ir lygūs kampai.',
      }),

    // 4. Gretutinis nubraižyto kampo
    () =>
      uzdavinys(T6, {
        klausimas: `Nubraižytas kampas, lygus ${kampas}° kampui. Kiek laipsnių turi jam gretutinis kampas?`,
        atsakymas: String(180 - kampas),
        atsakymasRodymui: `$${180 - kampas}°$`,
        sprendimas: `$180 - ${kampas} = ${180 - kampas}$.`,
      }),

    // 5. Pusiaukampinė
    () => {
      const lyginis = kampas % 2 === 0 ? kampas : kampas + 1
      return uzdavinys(T6, {
        klausimas: `Nubraižytas ${lyginis}° kampas ir jo pusiaukampinė. Kiek laipsnių turi kiekvienas gautas kampas?`,
        atsakymas: String(lyginis / 2),
        atsakymasRodymui: `$${lyginis / 2}°$`,
        sprendimas: `$${lyginis} : 2 = ${lyginis / 2}$.`,
      })
    },

    // 6. Du lygūs kampai greta
    () => {
      if (2 * kampas > 180) return null
      return uzdavinys(T6, {
        klausimas: `Prie ${kampas}° kampo pribraižytas jam lygus kampas. Kiek laipsnių turi bendras kampas?`,
        atsakymas: String(2 * kampas),
        atsakymasRodymui: `$${2 * kampas}°$`,
        sprendimas: `$${kampas} \\cdot 2 = ${2 * kampas}$.`,
      })
    },

    // 7. Rūšis
    () => {
      const rusis = kampas < 90 ? 'smailusis' : kampas === 90 ? 'statusis' : 'bukasis'
      return uzdavinys(T6, {
        klausimas: `Nubraižytas kampas, lygus ${kampas}° kampui. Koks jis pagal dydį?`,
        atsakymas: rusis,
        atsakymasRodymui: rusis.charAt(0).toUpperCase() + rusis.slice(1),
        sprendimas: `${kampas}° lyginamas su 90°.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Mokinys, perbraižydamas kampą, nubrėžė ilgesnes kraštines nei duotajame. Ar gautas kampas lygus duotajam?',
        variantai: [
          'taip, kampo dydis nuo kraštinių ilgio nepriklauso',
          'ne, jis didesnis',
          'ne, jis mažesnis',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Kampą lemia tik kraštinių prasiskėtimas.',
      }),
  ])
}

// ── 9.2.2. Braižome trikampį, lygų duotam trikampiui ────────────────────────

const T7 = 'braizome-lygu-trikampi'

const A_BRAIZOME_TRIK = [
  {
    klausimas: 'Kiek duomenų reikia, kad būtų galima nubraižyti trikampį, lygų duotam?',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Kiekvienas lygumo požymis remiasi trimis duomenimis.',
  },
] as const

export const braizomeLyguTrikampi: Generatorius = () => suBandymais(kurkBraizymaTrik, A_BRAIZOME_TRIK, T7)

function kurkBraizymaTrik(): Uzdavinys | null {
  const a = atsitiktinis(5, 10)
  const b = atsitiktinis(5, 10)
  const c = atsitiktinis(Math.abs(a - b) + 1, a + b - 1)
  if (c < 3 || c > 12) return null

  return variacija([
    // 1. Kiek duomenų reikia
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek duomenų apie trikampį pakanka, kad būtų galima nubraižyti jam lygų trikampį?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Visi trys lygumo požymiai remiasi trimis duomenimis.',
      }),

    // 2. Kraštinių ilgiai
    () =>
      uzdavinys(T7, {
        klausimas: `Nubraižytas trikampis, lygus trikampiui, kurio kraštinės ${a} cm, ${b} cm ir ${c} cm. Koks jo perimetras?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$ cm`,
        sprendimas: `$${a} + ${b} + ${c} = ${a + b + c}$.`,
        brezinys: trikampisSuZymemis(a, b, c, { a: `${a} cm`, b: `${b} cm`, c: `${c} cm` }),
      }),

    // 3. Kuris požymis naudojamas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kuriuo požymiu remiamasi, braižant trikampį pagal tris duotas kraštines?',
        variantai: [
          'pagal tris kraštines',
          'pagal dvi kraštines ir kampą tarp jų',
          'pagal kraštinę ir du kampus',
          'jokiu',
        ],
        teisingas: 0,
        sprendimas: 'Kraštinių galai randami skriestuvu — dviejų lankų susikirtimo taške.',
      }),

    // 4. Ar galima nubraižyti
    () => {
      const x = atsitiktinis(2, 5)
      const y = atsitiktinis(2, 5)
      const z = x + y + atsitiktinis(1, 4)
      return pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Ar galima nubraižyti trikampį, kurio kraštinės ${x} cm, ${y} cm ir ${z} cm?`,
        variantai: [`ne, nes $${x} + ${y} = ${x + y}$ mažiau nei ${z}`, 'taip', 'taip, jei jis bukasis'],
        teisingas: 0,
        sprendimas: 'Dviejų kraštinių suma turi būti didesnė už trečiąją.',
      })
    },

    // 5. Su kampu
    () => {
      const kampas = atsitiktinis(30, 110)
      return uzdavinys(T7, {
        klausimas: `Braižomas trikampis pagal kraštines ${a} cm ir ${b} cm bei ${kampas}° kampą tarp jų. Kiek tokių skirtingų trikampių galima nubraižyti?`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Šie duomenys trikampį apibrėžia vienareikšmiškai.',
      })
    },

    // 6. Trečiasis kampas prieš braižant
    () => {
      const k1 = atsitiktinis(35, 70)
      const k2 = atsitiktinis(35, 70)
      if (180 - k1 - k2 < 25) return null
      return uzdavinys(T7, {
        klausimas: `Braižomas trikampis pagal kraštinę ${a} cm ir du kampus prie jos — ${k1}° ir ${k2}°. Kiek laipsnių turės trečiasis kampas?`,
        atsakymas: String(180 - k1 - k2),
        atsakymasRodymui: `$${180 - k1 - k2}°$`,
        sprendimas: `$180 - ${k1} - ${k2} = ${180 - k1 - k2}$.`,
      })
    },

    // 7. Braižymo eiliškumas
    () =>
      eiliskumoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Surikiuok trikampio braižymo pagal tris kraštines žingsnius.',
        teisingaEile: [
          'nubrėžiama viena kraštinė',
          'iš vieno jos galo skriestuvu brėžiamas lankas',
          'iš kito galo brėžiamas antras lankas',
          'lankų susikirtimo taškas sujungiamas su kraštinės galais',
        ],
        sprendimas: 'Trečioji viršūnė ir yra dviejų lankų susikirtimo taškas.',
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Mokinys braižo trikampį pagal dvi kraštines ir kampą, esantį ne tarp jų, ir gauna du skirtingus trikampius. Kodėl taip nutinka?',
        variantai: [
          'nes tokie duomenys trikampio vienareikšmiškai neapibrėžia',
          'nes jis netiksliai matuoja',
          'nes kampas per didelis',
          'taip nutikti negali',
        ],
        teisingas: 0,
        sprendimas: 'Lygumo požymiui kampas turi būti būtent tarp žinomų kraštinių.',
      }),
  ])
}

// ── 9.2.3. Trikampio nelygybė ───────────────────────────────────────────────

const T8 = 'trikampio-nelygybe'

const A_NELYGYBE = [
  {
    klausimas: 'Ar galima sudaryti trikampį iš 2 cm, 3 cm ir 8 cm kraštinių?',
    atsakymas: 'ne',
    atsakymasRodymui: 'Ne',
    sprendimas: '$2 + 3 = 5$, o tai mažiau nei 8.',
  },
] as const

export const trikampioNelygybe: Generatorius = () => suBandymais(kurkNelygybe, A_NELYGYBE, T8)

function kurkNelygybe(): Uzdavinys | null {
  const a = atsitiktinis(3, 12)
  const b = atsitiktinis(3, 12)

  return variacija([
    // 1. Ar galima
    () => {
      const c = a + b + atsitiktinis(1, 5)
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Ar galima sudaryti trikampį iš ${a} cm, ${b} cm ir ${c} cm kraštinių?`,
        variantai: [`ne, nes $${a} + ${b} = ${a + b}$ mažiau nei ${c}`, 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Trumpesniosios kraštinės nesusieina.',
      })
    },

    // 2. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kaip skamba trikampio nelygybė?',
        variantai: [
          'kiekvienos dviejų kraštinių sumos ilgis didesnis už trečiąją kraštinę',
          'visos kraštinės turi būti skirtingos',
          'didžiausia kraštinė lygi kitų dviejų sumai',
          'kraštinių suma lygi 180',
        ],
        teisingas: 0,
        sprendimas: 'Tiesiausias kelias tarp dviejų taškų yra atkarpa.',
      }),

    // 3. Didžiausia galima trečioji kraštinė
    () =>
      uzdavinys(T8, {
        klausimas: `Dvi trikampio kraštinės yra ${a} cm ir ${b} cm. Kokia didžiausia sveikoji trečiosios kraštinės reikšmė?`,
        atsakymas: String(a + b - 1),
        atsakymasRodymui: `$${a + b - 1}$ cm`,
        sprendimas: `Trečioji kraštinė turi būti mažesnė už $${a} + ${b} = ${a + b}$.`,
      }),

    // 4. Mažiausia galima trečioji kraštinė
    () => {
      if (Math.abs(a - b) === 0) return null
      return uzdavinys(T8, {
        klausimas: `Dvi trikampio kraštinės yra ${a} cm ir ${b} cm. Kokia mažiausia sveikoji trečiosios kraštinės reikšmė?`,
        atsakymas: String(Math.abs(a - b) + 1),
        atsakymasRodymui: `$${Math.abs(a - b) + 1}$ cm`,
        sprendimas: `Trečioji kraštinė turi būti didesnė už skirtumą $${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(a - b)}$.`,
      })
    },

    // 5. Kiek reikšmių tinka
    () => {
      const maziausia = Math.abs(a - b) + 1
      const didziausia = a + b - 1
      return uzdavinys(T8, {
        klausimas: `Dvi trikampio kraštinės yra ${a} cm ir ${b} cm. Kiek yra sveikųjų trečiosios kraštinės reikšmių?`,
        atsakymas: String(didziausia - maziausia + 1),
        atsakymasRodymui: `$${didziausia - maziausia + 1}$`,
        sprendimas: `Nuo ${maziausia} iki ${didziausia} cm — iš viso ${didziausia - maziausia + 1}.`,
      })
    },

    // 6. Trikampis egzistuoja
    () => {
      const c = atsitiktinis(Math.abs(a - b) + 1, a + b - 1)
      if (c < 1) return null
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Ar galima sudaryti trikampį iš ${a} cm, ${b} cm ir ${c} cm kraštinių?`,
        variantai: ['taip', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `Kiekvienų dviejų kraštinių suma didesnė už trečiąją.`,
      })
    },

    // 7. Kelio uždavinys
    () =>
      uzdavinys(T8, {
        klausimas: `Nuo namų iki mokyklos tiesiai yra ${a + b} km, o einant per parduotuvę — ${a} km iki parduotuvės ir dar tiek pat iki mokyklos. Ar kelias per parduotuvę gali būti trumpesnis už tiesų? Atsakyk „taip“ arba „ne“.`,
        atsakymas: 'ne',
        atsakymasRodymui: 'Ne',
        sprendimas: 'Pagal trikampio nelygybę bet kuris lūžtantis kelias yra ilgesnis už tiesų.',
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Mokinys teigia, kad iš ${a} cm, ${b} cm ir ${a + b} cm kraštinių galima sudaryti trikampį. Kodėl jis klysta?`,
        variantai: [
          `nes $${a} + ${b} = ${a + b}$ — kraštinės sugultų į vieną tiesę`,
          'nes kraštinės per trumpos',
          'nes kraštinių turi būti keturios',
          'jis neklysta',
        ],
        teisingas: 0,
        sprendimas: 'Suma turi būti griežtai didesnė už trečiąją kraštinę.',
      }),
  ])
}

// ── 10.1.1. Didiname ir mažiname ────────────────────────────────────────────

const T9 = 'didiname-mazinime'

const A_DIDINAME = [
  {
    klausimas: 'Stačiakampio kraštinės 3 cm ir 5 cm. Kokios bus kraštinės padidinus figūrą 2 kartus?',
    atsakymas: '6',
    atsakymasRodymui: '$6$ cm ir $10$ cm',
    sprendimas: 'Abi kraštinės dauginamos iš 2.',
  },
] as const

export const didinameMazinime: Generatorius = () => suBandymais(kurkDidinima, A_DIDINAME, T9)

function kurkDidinima(): Uzdavinys | null {
  const a = atsitiktinis(2, 8)
  const b = atsitiktinis(2, 8)
  const k = atsitiktinis(2, 4)

  return variacija([
    // 1. Padidinta kraštinė
    () =>
      uzdavinys(T9, {
        klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Kokio ilgio bus ilgesnioji kraštinė padidinus figūrą ${k} kartus?`,
        atsakymas: String(Math.max(a, b) * k),
        atsakymasRodymui: `$${Math.max(a, b) * k}$ cm`,
        sprendimas: `$${Math.max(a, b)} \\cdot ${k} = ${Math.max(a, b) * k}$.`,
        brezinys: panasusStaciakampiai(a, b, k),
      }),

    // 2. Sumažinta kraštinė
    () => {
      if ((a * k) % k !== 0) return null
      return uzdavinys(T9, {
        klausimas: `Stačiakampio kraštinės ${a * k} cm ir ${b * k} cm. Kokio ilgio bus trumpesnioji kraštinė sumažinus figūrą ${k} kartus?`,
        atsakymas: String(Math.min(a, b)),
        atsakymasRodymui: `$${Math.min(a, b)}$ cm`,
        sprendimas: `$${Math.min(a, b) * k} : ${k} = ${Math.min(a, b)}$.`,
      })
    },

    // 3. Kas nesikeičia
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kas nesikeičia didinant ar mažinant figūrą?',
        variantai: ['jos kampų dydžiai', 'jos kraštinių ilgiai', 'jos plotas', 'jos perimetras'],
        teisingas: 0,
        sprendimas: 'Keičiasi tik dydis, o forma lieka ta pati.',
      }),

    // 4. Perimetras
    () =>
      uzdavinys(T9, {
        klausimas: `Stačiakampio perimetras ${2 * (a + b)} cm. Koks bus perimetras padidinus figūrą ${k} kartus?`,
        atsakymas: String(2 * (a + b) * k),
        atsakymasRodymui: `$${2 * (a + b) * k}$ cm`,
        sprendimas: `Visos kraštinės padidėja ${k} kartus, tad ir perimetras: $${2 * (a + b)} \\cdot ${k} = ${2 * (a + b) * k}$.`,
      }),

    // 5. Plotas
    () =>
      uzdavinys(T9, {
        klausimas: `Kiek kartų padidėja stačiakampio plotas, padidinus jo kraštines ${k} kartus?`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}$`,
        sprendimas: `Abi kraštinės padidėja ${k} kartus: $${k} \\cdot ${k} = ${k * k}$.`,
        brezinys: panasusStaciakampiai(a, b, k),
      }),

    // 6. Didinimo koeficientas
    () =>
      uzdavinys(T9, {
        klausimas: `Figūros kraštinė buvo ${a} cm, o tapo ${a * k} cm. Kiek kartų figūra padidinta?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `$${a * k} : ${a} = ${k}$.`,
      }),

    // 7. Sumažinimas trupmena
    () =>
      uzdavinys(T9, {
        klausimas: `Figūra sumažinta ${k} kartus. Kokia trupmena išreiškiamas jos kraštinių pokytis?`,
        atsakymas: `1/${k}`,
        atsakymasRodymui: `$\\dfrac{1}{${k}}$`,
        sprendimas: `Sumažinti ${k} kartus — tas pat, kas padauginti iš $\\dfrac{1}{${k}}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Padidinus stačiakampio kraštines ${k} kartus mokinys teigia, kad plotas taip pat padidėjo ${k} kartus. Kiek kartų plotas padidėjo iš tikrųjų?`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}$`,
        sprendimas: 'Plotą lemia abi kraštinės, tad jis didėja koeficiento kvadratu.',
      }),
  ])
}

// ── 10.1.2. Mastelis ────────────────────────────────────────────────────────

const T10 = 'mastelis-6'

const A_MASTELIS = [
  {
    klausimas: 'Žemėlapio mastelis 1 : 100 000. Kokį tikrą atstumą atitinka 3 cm?',
    atsakymas: '3',
    atsakymasRodymui: '$3$ km',
    sprendimas: '$3 \\cdot 100\\,000 = 300\\,000$ cm $= 3$ km.',
  },
] as const

export const mastelis6: Generatorius = () => suBandymais(kurkMasteli, A_MASTELIS, T10)

function kurkMasteli(): Uzdavinys | null {
  const mastelis = pasirink([100, 1000, 10000, 100000])
  const cm = atsitiktinis(2, 12)
  const tikras = cm * mastelis
  // Atsakymas turi likti perskaitomas: didesnio nei milijonas centimetrų
  // skaičiaus mokinys nei suvokia, nei tiksliai suveda.
  if (tikras > 1_000_000) return null

  return variacija([
    // 1. Tikras atstumas centimetrais
    () =>
      uzdavinys(T10, {
        klausimas: `Mastelis $1 : ${sk4(mastelis)}$. Kokį tikrą atstumą centimetrais atitinka ${cm} cm brėžinyje?`,
        atsakymas: String(tikras),
        atsakymasRodymui: `$${sk4(tikras)}$ cm`,
        sprendimas: `$${cm} \\cdot ${sk4(mastelis)} = ${sk4(tikras)}$.`,
      }),

    // 2. Ką rodo mastelis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Ką reiškia mastelis $1 : ${sk4(mastelis)}$?`,
        variantai: [
          `vienas centimetras brėžinyje atitinka $${sk4(mastelis)}$ tikrų centimetrų`,
          `brėžinys ${sk4(mastelis)} kartų didesnis už tikrovę`,
          `brėžinys nubraižytas ${sk4(mastelis)} kartus`,
          'mastelis nieko nereiškia',
        ],
        teisingas: 0,
        sprendimas: 'Pirmasis skaičius yra brėžinio, antrasis — tikrovės ilgis.',
      }),

    // 3. Atstumas metrais
    () => {
      if (tikras % 100 !== 0) return null
      return uzdavinys(T10, {
        klausimas: `Mastelis $1 : ${sk4(mastelis)}$. Kiek metrų atitinka ${cm} cm brėžinyje?`,
        atsakymas: String(tikras / 100),
        atsakymasRodymui: `$${sk4(tikras / 100)}$ m`,
        sprendimas: `$${cm} \\cdot ${sk4(mastelis)} = ${sk4(tikras)}$ cm $= ${sk4(tikras / 100)}$ m.`,
      })
    },

    // 4. Atvirkštinis
    () =>
      uzdavinys(T10, {
        klausimas: `Mastelis $1 : ${sk4(mastelis)}$. Kiek centimetrų brėžinyje atitiks $${sk4(tikras)}$ cm tikrovėje?`,
        atsakymas: String(cm),
        atsakymasRodymui: `$${cm}$ cm`,
        sprendimas: `$${sk4(tikras)} : ${sk4(mastelis)} = ${cm}$.`,
      }),

    // 5. Didinantis mastelis
    () => {
      const k = pasirink([2, 5, 10])
      const detale = atsitiktinis(2, 9)
      return uzdavinys(T10, {
        klausimas: `Detalė nubraižyta masteliu $${k} : 1$. Brėžinyje jos ilgis ${detale * k} mm. Koks tikrasis ilgis?`,
        atsakymas: String(detale),
        atsakymasRodymui: `$${detale}$ mm`,
        sprendimas: `Brėžinys ${k} kartus didesnis: $${detale * k} : ${k} = ${detale}$.`,
      })
    },

    // 6. Kuris mastelis smulkesnis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kuris žemėlapio mastelis rodo didesnę teritoriją tame pačiame lape?',
        variantai: ['$1 : 100\\,000$', '$1 : 10\\,000$', '$1 : 1000$', 'visi vienodai'],
        teisingas: 0,
        sprendimas: 'Kuo antrasis skaičius didesnis, tuo daugiau tikrovės telpa į tą patį lapą.',
      }),

    // 7. Mastelio nustatymas
    () =>
      uzdavinys(T10, {
        klausimas: `Brėžinyje atkarpa ${cm} cm atitinka $${sk4(tikras)}$ cm tikrovėje. Koks yra mastelio antrasis skaičius?`,
        atsakymas: String(mastelis),
        atsakymasRodymui: `$${sk4(mastelis)}$`,
        sprendimas: `$${sk4(tikras)} : ${cm} = ${sk4(mastelis)}$, tad mastelis $1 : ${sk4(mastelis)}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T10, {
        klausimas: `Mokinys, taikydamas mastelį $1 : ${sk4(mastelis)}$, ${cm} cm brėžinyje pavertė $${sk4(cm * mastelis * 10)}$ cm. Užrašyk teisingą tikrą atstumą centimetrais.`,
        atsakymas: String(tikras),
        atsakymasRodymui: `$${sk4(tikras)}$ cm`,
        sprendimas: `Dauginama iš $${sk4(mastelis)}$, o ne iš $${sk4(mastelis * 10)}$.`,
      }),
  ])
}

// ── 10.2.1. Panašiosios plokštumos figūros ──────────────────────────────────

const T11 = 'panasiosios-figuros'

const A_PANASIOS = [
  {
    klausimas: 'Kokios figūros vadinamos panašiosiomis?',
    atsakymas: 'tos pacios formos',
    atsakymasRodymui: 'Tos pačios formos, bet galbūt skirtingo dydžio',
    sprendimas: 'Jų atitinkamos kraštinės proporcingos, o kampai lygūs.',
  },
] as const

export const panasiosiosFiguros: Generatorius = () => suBandymais(kurkPanasias, A_PANASIOS, T11)

function kurkPanasias(): Uzdavinys | null {
  const a = atsitiktinis(2, 8)
  const b = atsitiktinis(2, 8)
  const k = atsitiktinis(2, 4)

  return variacija([
    // 1. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kokios figūros vadinamos panašiosiomis?',
        variantai: [
          'tos pačios formos, kurių atitinkamos kraštinės proporcingos, o kampai lygūs',
          'tos, kurios sutampa uždėtos viena ant kitos',
          'tos, kurių plotai vienodi',
          'tos, kurios turi tiek pat kraštinių',
        ],
        teisingas: 0,
        sprendimas: 'Lygios figūros yra atskiras panašiųjų atvejis, kai koeficientas lygus 1.',
        brezinys: panasusStaciakampiai(a, b, k),
      }),

    // 2. Panašumo koeficientas
    () =>
      uzdavinys(T11, {
        klausimas: `Dviejų panašiųjų stačiakampių kraštinės yra ${a} cm ir ${a * k} cm. Koks panašumo koeficientas?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `$${a * k} : ${a} = ${k}$.`,
        brezinys: panasusStaciakampiai(a, b, k),
      }),

    // 3. Atitinkama kraštinė
    () =>
      uzdavinys(T11, {
        klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Panašiojo stačiakampio ilgesnioji atitinkama kraštinė yra ${Math.max(a, b) * k} cm. Kokio ilgio jo kita kraštinė?`,
        atsakymas: String(Math.min(a, b) * k),
        atsakymasRodymui: `$${Math.min(a, b) * k}$ cm`,
        sprendimas: `Panašumo koeficientas ${k}: $${Math.min(a, b)} \\cdot ${k} = ${Math.min(a, b) * k}$.`,
      }),

    // 4. Kampai panašiosiose figūrose
    () => {
      const kampas = atsitiktinis(30, 120)
      return uzdavinys(T11, {
        klausimas: `Dvi figūros panašios, o vienos jų kampas lygus ${kampas}°. Kiek laipsnių turi atitinkamas kitos figūros kampas?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: 'Panašiųjų figūrų atitinkami kampai lygūs.',
      })
    },

    // 5. Ar lygios figūros panašios
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Ar dvi lygios figūros yra panašios?',
        variantai: [
          'taip, jų panašumo koeficientas lygus 1',
          'ne, panašios būna tik skirtingo dydžio',
          'taip, bet tik trikampiai',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Lygumas yra griežtesnis reikalavimas nei panašumas.',
      }),

    // 6. Perimetrų santykis
    () =>
      uzdavinys(T11, {
        klausimas: `Panašumo koeficientas ${k}. Kiek kartų didesnis panašiosios figūros perimetras?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: 'Visos kraštinės didėja tiek pat kartų, tad ir jų suma.',
      }),

    // 7. Plotų santykis
    () =>
      uzdavinys(T11, {
        klausimas: `Panašumo koeficientas ${k}. Kiek kartų didesnis panašiosios figūros plotas?`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}$`,
        sprendimas: `Plotą lemia du matmenys: $${k} \\cdot ${k} = ${k * k}$.`,
      }),

    // 8. Ar visi stačiakampiai panašūs
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Ar bet kurie du stačiakampiai yra panašūs?',
        variantai: [
          'ne, jų kraštinių santykiai gali skirtis',
          'taip, nes visi jų kampai statieji',
          'taip, jei plotai vienodi',
          'taip, visada',
        ],
        teisingas: 0,
        sprendimas: '$2 \\times 3$ ir $2 \\times 5$ stačiakampiai nėra panašūs, nors visi kampai statieji.',
      }),
  ])
}

// ── 10.2.2. Trikampių panašumo požymiai ─────────────────────────────────────

const T12 = 'trikampiu-panasumas'

const A_PANASUMAS = [
  {
    klausimas: 'Ar du trikampiai, kurių du kampai atitinkamai lygūs, yra panašūs?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: 'Tada ir trečiasis kampas lygus, tad trikampiai tos pačios formos.',
  },
] as const

export const trikampiuPanasumas: Generatorius = () => suBandymais(kurkPanasuma, A_PANASUMAS, T12)

function kurkPanasuma(): Uzdavinys | null {
  const a = atsitiktinis(3, 8)
  const b = atsitiktinis(3, 8)
  const c = atsitiktinis(Math.abs(a - b) + 1, a + b - 1)
  if (c < 2 || c > 10) return null
  const k = atsitiktinis(2, 3)

  return variacija([
    // 1. Du kampai
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ar du trikampiai, kurių du kampai atitinkamai lygūs, yra panašūs?',
        variantai: [
          'taip, nes tada lygus ir trečiasis kampas',
          'ne, reikia dar kraštinės',
          'taip, bet tik jei jie statieji',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Kampų suma yra 180°, tad du lygūs kampai lemia ir trečiąjį.',
      }),

    // 2. Panašumo koeficientas
    () =>
      uzdavinys(T12, {
        klausimas: `Trikampiai panašūs. Pirmojo kraštinė ${a} cm atitinka antrojo kraštinę ${a * k} cm. Koks panašumo koeficientas?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `$${a * k} : ${a} = ${k}$.`,
        brezinys: dvaTrikampiai(
          { a, b, c, z: { a: String(a), b: String(b) } },
          { a: a * k, b: b * k, c: c * k, z: { a: String(a * k), b: String(b * k), raides: ['D', 'E', 'F'] } },
          8,
        ),
      }),

    // 3. Nežinoma kraštinė
    () =>
      uzdavinys(T12, {
        klausimas: `Trikampiai panašūs, panašumo koeficientas ${k}. Pirmojo kraštinė ${b} cm. Kokio ilgio atitinkama antrojo kraštinė?`,
        atsakymas: String(b * k),
        atsakymasRodymui: `$${b * k}$ cm`,
        sprendimas: `$${b} \\cdot ${k} = ${b * k}$.`,
      }),

    // 4. Trys proporcingos kraštinės
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ar du trikampiai, kurių visos trys kraštinės proporcingos, yra panašūs?',
        variantai: [
          'taip, tai vienas iš panašumo požymių',
          'ne, reikia dar kampo',
          'taip, bet tik jei koeficientas sveikasis',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Proporcingos kraštinės lemia ir lygius kampus.',
      }),

    // 5. Perimetrų santykis
    () =>
      uzdavinys(T12, {
        klausimas: `Panašiųjų trikampių panašumo koeficientas ${k}, o mažesniojo perimetras ${a + b + c} cm. Koks didesniojo perimetras?`,
        atsakymas: String((a + b + c) * k),
        atsakymasRodymui: `$${(a + b + c) * k}$ cm`,
        sprendimas: `$${a + b + c} \\cdot ${k} = ${(a + b + c) * k}$.`,
      }),

    // 6. Kuo skiriasi nuo lygumo
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kuo panašumas skiriasi nuo lygumo?',
        variantai: [
          'panašiųjų figūrų kraštinės proporcingos, o lygiųjų — lygios',
          'panašiosios figūros neturi lygių kampų',
          'lygios figūros gali būti skirtingos formos',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Lygumas yra panašumas, kurio koeficientas lygus 1.',
      }),

    // 7. Šešėlio uždavinys
    () => {
      const stulpas = atsitiktinis(4, 9)
      const seselisStulpo = atsitiktinis(2, 6)
      const seselisZmogaus = seselisStulpo * 2
      return uzdavinys(T12, {
        klausimas: `Stulpo aukštis ${stulpas * 2} m, jo šešėlis ${seselisZmogaus} m. Kokio aukščio medis, kurio šešėlis tuo pačiu metu yra ${seselisStulpo} m?`,
        atsakymas: String(stulpas),
        atsakymasRodymui: `$${stulpas}$ m`,
        sprendimas: `Trikampiai panašūs: $\\dfrac{${stulpas * 2}}{${seselisZmogaus}} = \\dfrac{x}{${seselisStulpo}}$, iš čia $x = ${stulpas}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Mokinys teigia, kad panašiųjų trikampių plotai santykiauja taip pat kaip kraštinės. Kodėl jis klysta?',
        variantai: [
          'nes plotų santykis lygus panašumo koeficiento kvadratui',
          'nes plotai visada lygūs',
          'nes plotų palyginti negalima',
          'jis neklysta',
        ],
        teisingas: 0,
        sprendimas: `Jei kraštinės didėja ${k} kartus, plotas didėja $${k * k}$ kartus.`,
      }),
  ])
}

// ── Figūrų didinimas, mažinimas ir figūrų sekos (programos potemė) ──────────

const T13 = 'figuru-sekos-6'

const A_SEKOS = [
  {
    klausimas: 'Kvadratų kraštinės sudaro seką 2, 4, 8, … Kokia bus ketvirtoji kraštinė?',
    atsakymas: '16',
    atsakymasRodymui: '$16$',
    sprendimas: 'Kiekviena kraštinė dvigubai ilgesnė už ankstesnę.',
  },
] as const

export const figuruSekos6: Generatorius = () => suBandymais(kurkSekas, A_SEKOS, T13)

function kurkSekas(): Uzdavinys | null {
  const pradzia = atsitiktinis(2, 6)
  const k = atsitiktinis(2, 3)
  const zingsnis = atsitiktinis(2, 5)

  return variacija([
    // 1. Daugybos seka
    () => {
      const seka = [0, 1, 2].map((i) => pradzia * k ** i)
      return uzdavinys(T13, {
        klausimas: `Kvadratų kraštinės sudaro seką ${seka.join(', ')}, … Kokia bus ketvirtoji kraštinė?`,
        atsakymas: String(pradzia * k ** 3),
        atsakymasRodymui: `$${pradzia * k ** 3}$`,
        sprendimas: `Kiekviena kraštinė ${k} kartus ilgesnė: $${seka[2]} \\cdot ${k} = ${pradzia * k ** 3}$.`,
      })
    },

    // 2. Sudėties seka
    () => {
      const seka = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      return uzdavinys(T13, {
        klausimas: `Trikampių perimetrai sudaro seką ${seka.join(', ')}, … Koks bus penktasis perimetras?`,
        atsakymas: String(pradzia + 4 * zingsnis),
        atsakymasRodymui: `$${pradzia + 4 * zingsnis}$`,
        sprendimas: `Kiekvienas perimetras ${zingsnis} didesnis: $${seka[3]} + ${zingsnis} = ${pradzia + 4 * zingsnis}$.`,
      })
    },

    // 3. Plotų seka
    () =>
      uzdavinys(T13, {
        klausimas: `Kvadrato kraštinė didinama ${k} kartus. Kiek kartų padidėja jo plotas?`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}$`,
        sprendimas: `$${k} \\cdot ${k} = ${k * k}$.`,
      }),

    // 4. Sekos taisyklė
    () => {
      const seka = [0, 1, 2].map((i) => pradzia * k ** i)
      return pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Kokia sekos ${seka.join(', ')}, … taisyklė?`,
        variantai: [
          `ankstesnis narys dauginamas iš ${k}`,
          `prie ankstesnio nario pridedama ${k}`,
          `iš ankstesnio nario atimama ${k}`,
          `ankstesnis narys dalijamas iš ${k}`,
        ],
        teisingas: 0,
        sprendimas: `$${seka[1]} : ${seka[0]} = ${k}$.`,
      })
    },

    // 5. Kelintas narys
    () =>
      uzdavinys(T13, {
        klausimas: `Sekoje ${pradzia}, ${pradzia + zingsnis}, ${pradzia + 2 * zingsnis}, … kiek yra ${pradzia + 5 * zingsnis}-asis pagal eilę narys? Užrašyk jo numerį.`,
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: `Nuo pradžios pridėta $${5 * zingsnis} : ${zingsnis} = 5$ žingsniai, tad tai šeštasis narys.`,
      }),

    // 6. Kubelių seka
    () => {
      const seka = [1, 2, 3].map((i) => i * i)
      return uzdavinys(T13, {
        klausimas: `Kvadratų plotai sudaro seką ${seka.join(', ')}, … Koks bus ketvirtasis plotas?`,
        atsakymas: '16',
        atsakymasRodymui: '$16$',
        sprendimas: 'Plotai yra kraštinių kvadratai: $4 \\cdot 4 = 16$.',
      })
    },

    // 7. Trūkstamas narys
    () => {
      const seka = [0, 1, 2, 3, 4].map((i) => pradzia + i * zingsnis)
      return uzdavinys(T13, {
        klausimas: `Sekoje trūksta nario: ${seka[0]}, ${seka[1]}, ?, ${seka[3]}, ${seka[4]}. Koks jis?`,
        atsakymas: String(seka[2]),
        atsakymasRodymui: `$${seka[2]}$`,
        sprendimas: `Skirtumas tarp gretimų narių ${zingsnis}.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T13, {
        klausimas: `Kvadrato kraštinę padidinus ${k} kartus mokinys teigia, kad perimetras padidėjo $${k * k}$ kartus. Kiek kartų padidėjo perimetras iš tikrųjų?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: 'Perimetras yra ilgių suma, tad jis didėja tiek pat kartų kaip kraštinė; kvadratu didėja plotas.',
      }),
  ])
}

// ── Metrinė matavimo sistema ir vienetų keitimas (programos potemė) ─────────

const T14 = 'metrine-sistema'

const A_METRINE = [
  {
    klausimas: 'Kiek metrų yra 3 km?',
    atsakymas: '3000',
    atsakymasRodymui: '$3000$ m',
    sprendimas: '$1$ km $= 1000$ m.',
  },
] as const

export const metrineSistema: Generatorius = () => suBandymais(kurkMetrine, A_METRINE, T14)

function kurkMetrine(): Uzdavinys | null {
  const i = atsitiktinis(0, ILGIO_VIENETAI.length - 2)
  const mazesnis = ILGIO_VIENETAI[i]
  const didesnis = ILGIO_VIENETAI[i + 1]
  const kartai = didesnis.mm / mazesnis.mm
  const n = atsitiktinis(2, 40)

  return variacija([
    // 1. Iš didesnio į mažesnį
    () =>
      uzdavinys(T14, {
        klausimas: `Kiek ${mazesnis.vardas} yra ${n} ${didesnis.vardas}?`,
        atsakymas: String(n * kartai),
        atsakymasRodymui: `$${sk4(n * kartai)}$ ${mazesnis.vardas}`,
        sprendimas: `$1$ ${didesnis.vardas} $= ${sk4(kartai)}$ ${mazesnis.vardas}, tad $${n} \\cdot ${sk4(kartai)} = ${sk4(n * kartai)}$.`,
      }),

    // 2. Iš mažesnio į didesnį
    () =>
      uzdavinys(T14, {
        klausimas: `Kiek ${didesnis.vardas} yra $${sk4(n * kartai)}$ ${mazesnis.vardas}?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$ ${didesnis.vardas}`,
        sprendimas: `$${sk4(n * kartai)} : ${sk4(kartai)} = ${n}$.`,
      }),

    // 3. Kodėl sistema vadinama metrine
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kodėl matavimo sistema vadinama metrine ir dešimtaine?',
        variantai: [
          'nes gretimi vienetai skiriasi 10, 100 arba 1000 kartų',
          'nes visi vienetai matuojami metrais',
          'nes ji sugalvota dešimtajame amžiuje',
          'nes vienetų yra dešimt',
        ],
        teisingas: 0,
        sprendimas: 'Todėl keičiant vienetus tereikia perkelti kablelį.',
      }),

    // 4. Masės vienetai
    () => {
      const kg = atsitiktinis(2, 40)
      return uzdavinys(T14, {
        klausimas: `Kiek gramų yra ${kg} kg?`,
        atsakymas: String(kg * 1000),
        atsakymasRodymui: `$${sk4(kg * 1000)}$ g`,
        sprendimas: `$1$ kg $= 1000$ g.`,
      })
    },

    // 5. Talpos vienetai
    () => {
      const l = atsitiktinis(2, 40)
      return uzdavinys(T14, {
        klausimas: `Kiek mililitrų yra ${l} l?`,
        atsakymas: String(l * 1000),
        atsakymasRodymui: `$${sk4(l * 1000)}$ ml`,
        sprendimas: `$1$ l $= 1000$ ml.`,
      })
    },

    // 6. Sudėtinis matas
    () => {
      if (kartai > 1000) return null
      const sveikas = atsitiktinis(1, 9)
      const likutis = atsitiktinis(1, kartai - 1)
      return uzdavinys(T14, {
        klausimas: `Kiek ${mazesnis.vardas} yra ${sveikas} ${didesnis.vardas} ${likutis} ${mazesnis.vardas}?`,
        atsakymas: String(sveikas * kartai + likutis),
        atsakymasRodymui: `$${sk4(sveikas * kartai + likutis)}$ ${mazesnis.vardas}`,
        sprendimas: `$${sveikas} \\cdot ${sk4(kartai)} + ${likutis} = ${sk4(sveikas * kartai + likutis)}$.`,
      })
    },

    // 7. Rikiavimas
    () => {
      const matai = sumaisyk([
        { t: '5 dm', mm: 500 },
        { t: '30 cm', mm: 300 },
        { t: '1 m', mm: 1000 },
        { t: '450 mm', mm: 450 },
      ])
      const eile = [...matai].sort((x, y) => x.mm - y.mm)
      return eiliskumoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Surikiuok ilgius didėjimo tvarka.',
        teisingaEile: eile.map((x) => x.t),
        sprendimas: 'Patogiausia visus paversti milimetrais.',
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T14, {
        klausimas: `Mokinys teigia, kad ${n} ${didesnis.vardas} yra $${sk4(n * kartai * 10)}$ ${mazesnis.vardas}. Užrašyk teisingą reikšmę.`,
        atsakymas: String(n * kartai),
        atsakymasRodymui: `$${sk4(n * kartai)}$ ${mazesnis.vardas}`,
        sprendimas: `$1$ ${didesnis.vardas} $= ${sk4(kartai)}$ ${mazesnis.vardas}, o ne $${sk4(kartai * 10)}$.`,
      }),
  ])
}
