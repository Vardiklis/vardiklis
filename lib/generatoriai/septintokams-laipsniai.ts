import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { sk4 } from './ketvirtokams-bendra'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 7 klasės temos „Teiginiai“ ir „Laipsniai“ — vienuolika potemių.
 *
 * Laipsnių pagrindai laikomi nedideli, o rodikliai — iki 5: uždavinio esmė
 * yra savybė, o ne skaičiavimas. Kur reikšmė vis dėlto skaičiuojama, ji
 * neviršija milijono, kad atsakymą būtų galima suvesti.
 */

const RAIDES = ['a', 'b', 'x', 'y', 'm', 'n'] as const

/** Laipsnio užrašas KaTeX kalba. */
function lp(pagrindas: number | string, rodiklis: number | string): string {
  return `${pagrindas}^{${rodiklis}}`
}

/** Trupmenos užrašas. */
function tr(sk: number | string, vd: number | string): string {
  return `\\dfrac{${sk}}{${vd}}`
}

// ── 1.1. Teisingi ir klaidingi teiginiai ────────────────────────────────────

const T1 = 'teisingi-klaidingi-teiginiai'

const A_TEIGINIAI = [
  {
    klausimas: 'Ar teiginys „Visi lyginiai skaičiai dalijasi iš 2“ teisingas?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: 'Tai lyginio skaičiaus apibrėžimas.',
  },
] as const

export const teisingiKlaidingiTeiginiai: Generatorius = () => suBandymais(kurkTeiginius, A_TEIGINIAI, T1)

function kurkTeiginius(): Uzdavinys | null {
  return variacija([
    // 1. Teisingas teiginys apie dalumą
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ar teiginys „Visi lyginiai skaičiai dalijasi iš 2“ teisingas?',
        variantai: ['taip', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Tai ir yra lyginio skaičiaus apibrėžimas.',
      }),

    // 2. Klaidingas teiginys apie pirminius
    () => {
      const n = pasirink([9, 15, 21, 25, 27, 33, 35])
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Ar teiginys „Skaičius ${n} yra pirminis“ teisingas?`,
        variantai: ['ne', 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `${n} turi daugiau nei du daliklius, tad jis sudėtinis.`,
      })
    },

    // 3. Kontrpavyzdys
    () =>
      uzdavinys(T1, {
        klausimas: 'Rask kontrpavyzdį teiginiui „Visi nelyginiai skaičiai yra pirminiai“. Užrašyk mažiausią tinkamą skaičių.',
        atsakymas: '9',
        atsakymasRodymui: '$9$',
        sprendimas: '$9$ yra nelyginis, bet dalijasi iš 3, tad nėra pirminis.',
      }),

    // 4. Sąlyginis teiginys
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ar teiginys „Jei skaičius dalijasi iš 6, tai jis dalijasi ir iš 3“ teisingas?',
        variantai: [
          'taip, nes 6 dalijasi iš 3',
          'ne, yra išimčių',
          'taip, bet tik lyginiams skaičiams',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienas šešeto kartotinis yra ir trejeto kartotinis.',
      }),

    // 5. Atvirkštinis sąlyginis teiginys
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ar teiginys „Jei skaičius dalijasi iš 3, tai jis dalijasi ir iš 6“ teisingas?',
        variantai: [
          'ne, pavyzdžiui, 9 dalijasi iš 3, bet ne iš 6',
          'taip',
          'taip, bet tik dideliems skaičiams',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Vienas kontrpavyzdys teiginį paneigia.',
      }),

    // 6. Kiek kontrpavyzdžių pakanka
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek kontrpavyzdžių pakanka, kad teiginys būtų paneigtas?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Teiginys „visi…“ klaidingas, jei bent vienas atvejis netinka.',
      }),

    // 7. Teiginys apie kvadratus
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ar teiginys „Jei $a > b$, tai $a^2 > b^2$“ visada teisingas?',
        variantai: [
          'ne, pavyzdžiui, $1 > -3$, bet $1 < 9$',
          'taip, visada',
          'taip, jei skaičiai sveikieji',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Su neigiamais skaičiais teiginys sugriūva.',
      }),

    // 8. Teisingas iš trijų
    () => {
      const n = atsitiktinis(3, 9)
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuris teiginys teisingas?',
        variantai: [
          `$${lp(n, 2)} = ${n * n}$`,
          `$${lp(n, 2)} = ${2 * n}$`,
          `$${lp(n, 2)} = ${n + 2}$`,
          `$${lp(n, 2)} = ${n * n + 1}$`,
        ],
        teisingas: 0,
        sprendimas: `Kelti kvadratu reiškia padauginti skaičių patį iš savęs: $${n} \\cdot ${n} = ${n * n}$.`,
      })
    },
  ])
}

// ── 1.2. Aksioma, apibrėžimas, teorema ──────────────────────────────────────

const T2 = 'aksioma-apibrezimas-teorema'

const A_SAVOKOS = [
  {
    klausimas: 'Kas yra aksioma?',
    atsakymas: 'teiginys priimamas be irodymo',
    atsakymasRodymui: 'Teiginys, priimamas be įrodymo',
    sprendimas: 'Aksiomomis remiasi visi kiti įrodymai.',
  },
] as const

export const aksiomaApibrezimasTeorema: Generatorius = () => suBandymais(kurkSavokas, A_SAVOKOS, T2)

function kurkSavokas(): Uzdavinys | null {
  return variacija([
    // 1. Aksioma
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kas yra aksioma?',
        variantai: [
          'teiginys, priimamas be įrodymo',
          'teiginys, kurį reikia įrodyti',
          'sąvokos paaiškinimas',
          'skaičiavimo taisyklė',
        ],
        teisingas: 0,
        sprendimas: 'Aksiomos yra pagrindas, ant kurio statomi visi įrodymai.',
      }),

    // 2. Teorema
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kas yra teorema?',
        variantai: [
          'teiginys, kurio teisingumas įrodomas',
          'teiginys, priimamas be įrodymo',
          'sąvokos apibrėžimas',
          'klaidingas teiginys',
        ],
        teisingas: 0,
        sprendimas: 'Teoremos įrodymas remiasi aksiomomis ir anksčiau įrodytomis teoremomis.',
      }),

    // 3. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kas yra apibrėžimas?',
        variantai: [
          'tikslus sąvokos paaiškinimas',
          'teiginys, kurį reikia įrodyti',
          'teiginys be įrodymo',
          'uždavinio sprendimas',
        ],
        teisingas: 0,
        sprendimas: 'Apibrėžimas pasako, ką tiksliai reiškia sąvoka.',
      }),

    // 4. Kas yra „per du taškus“
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuo laikomas teiginys „Per du taškus galima nubrėžti vienintelę tiesę“?',
        variantai: ['aksioma', 'teorema', 'apibrėžimu', 'klaidingu teiginiu'],
        teisingas: 0,
        sprendimas: 'Šis teiginys priimamas be įrodymo.',
      }),

    // 5. Kas yra trikampio kampų suma
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuo laikomas teiginys „Trikampio kampų suma lygi 180°“?',
        variantai: ['teorema', 'aksioma', 'apibrėžimu', 'spėjimu'],
        teisingas: 0,
        sprendimas: 'Šis teiginys įrodomas remiantis lygiagrečiųjų tiesių savybėmis.',
      }),

    // 6. Kas yra lygiašonis trikampis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuo laikomas teiginys „Lygiašonis trikampis — trikampis, turintis dvi lygias kraštines“?',
        variantai: ['apibrėžimu', 'teorema', 'aksioma', 'kontrpavyzdžiu'],
        teisingas: 0,
        sprendimas: 'Jis pasako, ką reiškia sąvoka, o ne ką reikia įrodyti.',
      }),

    // 7. Poros
    () =>
      poruUzdavinys(naujasId(T2), T2, {
        klausimas: 'Sujunk sąvoką su jos paaiškinimu.',
        poros: [
          { kaire: 'aksioma', desine: 'priimama be įrodymo' },
          { kaire: 'teorema', desine: 'įrodoma' },
          { kaire: 'apibrėžimas', desine: 'paaiškina sąvoką' },
          { kaire: 'kontrpavyzdys', desine: 'paneigia teiginį' },
        ],
        sprendimas: 'Šios keturios sąvokos sudaro matematinio samprotavimo pagrindą.',
      }),

    // 8. Kuo skiriasi aksioma nuo teoremos
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuo aksioma skiriasi nuo teoremos?',
        variantai: [
          'aksioma priimama be įrodymo, o teorema įrodoma',
          'aksioma trumpesnė',
          'teorema visada teisinga, o aksioma ne',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Be aksiomų įrodinėjimas neturėtų nuo ko prasidėti.',
      }),
  ])
}

// ── 1.3. Įrodymas ───────────────────────────────────────────────────────────

const T3 = 'irodymas'

const A_IRODYMAS = [
  {
    klausimas: 'Ar keli pavyzdžiai įrodo bendrą teiginį?',
    atsakymas: 'ne',
    atsakymasRodymui: 'Ne',
    sprendimas: 'Pavyzdžiai teiginio neįrodo, o kontrpavyzdys jį paneigia.',
  },
] as const

export const irodymas: Generatorius = () => suBandymais(kurkIrodyma, A_IRODYMAS, T3)

function kurkIrodyma(): Uzdavinys | null {
  const n = atsitiktinis(2, 20)

  return variacija([
    // 1. Ar pavyzdžiai įrodo
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ar keli tinkami pavyzdžiai įrodo bendrą teiginį?',
        variantai: [
          'ne, jie tik parodo, kad teiginys kartais teisingas',
          'taip, jei pavyzdžių daug',
          'taip, jei pavyzdžiai skirtingi',
          'taip, visada',
        ],
        teisingas: 0,
        sprendimas: 'Įrodymas turi galioti visiems atvejams iš karto.',
      }),

    // 2. Kuo paneigiamas teiginys
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuo paneigiamas bendras teiginys?',
        variantai: ['vienu kontrpavyzdžiu', 'keliais pavyzdžiais', 'aksioma', 'apibrėžimu'],
        teisingas: 0,
        sprendimas: 'Užtenka vieno atvejo, kuriame teiginys neteisingas.',
      }),

    // 3. Dviejų lyginių suma
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip įrodoma, kad dviejų lyginių skaičių suma yra lyginė?',
        variantai: [
          'užrašius skaičius kaip $2m$ ir $2n$ ir gavus $2(m + n)$',
          'patikrinus kelis pavyzdžius',
          'nubraižius brėžinį',
          'to įrodyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Bendras užrašas apima visus lyginius skaičius iš karto.',
      }),

    // 4. Kodėl bendras užrašas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kodėl įrodyme naudojamos raidės, o ne konkretūs skaičiai?',
        variantai: [
          'nes raidė pakeičia bet kurį skaičių iš karto',
          'nes su raidėmis lengviau skaičiuoti',
          'nes taip gražiau',
          'nes skaičių per daug',
        ],
        teisingas: 0,
        sprendimas: 'Taip vienas samprotavimas apima begalę atvejų.',
      }),

    // 5. Konkretus tikrinimas
    () =>
      uzdavinys(T3, {
        klausimas: `Patikrink teiginį „Dviejų iš eilės einančių skaičių suma yra nelyginė“ su skaičiais ${n} ir ${n + 1}. Kokia jų suma?`,
        atsakymas: String(2 * n + 1),
        atsakymasRodymui: `$${2 * n + 1}$`,
        sprendimas: `$${n} + ${n + 1} = ${2 * n + 1}$ — nelyginis skaičius.`,
      }),

    // 6. Bendras užrašas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip užrašomi du iš eilės einantys sveikieji skaičiai?',
        variantai: ['$n$ ir $n + 1$', '$n$ ir $2n$', '$n$ ir $n + 2$', '$2n$ ir $2n + 2$'],
        teisingas: 0,
        sprendimas: 'Kitas iš eilės einantis skaičius yra vienetu didesnis.',
      }),

    // 7. Kontrpavyzdys kvadratams
    () =>
      uzdavinys(T3, {
        klausimas: 'Teiginys „Jei $a^2 = b^2$, tai $a = b$“ yra klaidingas. Kokia yra $a$ reikšmė, jei $b = 5$, o $a \\ne b$?',
        atsakymas: '-5',
        atsakymasRodymui: '$-5$',
        sprendimas: '$(-5)^2 = 25 = 5^2$, bet $-5 \\ne 5$.',
      }),

    // 8. Įrodymo dalys
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Iš ko susideda teoremos formuluotė?',
        variantai: [
          'iš sąlygos ir išvados',
          'iš pavyzdžio ir kontrpavyzdžio',
          'iš skaičiaus ir raidės',
          'iš brėžinio ir atsakymo',
        ],
        teisingas: 0,
        sprendimas: 'Sąlyga — tai, kas duota; išvada — tai, ką reikia įrodyti.',
      }),
  ])
}

// ── 2.1. Keliame kvadratu ir kubu ───────────────────────────────────────────

const T4 = 'kvadratu-ir-kubu'

const A_KVADRATU = [
  {
    klausimas: 'Apskaičiuok: $6^2$.',
    atsakymas: '36',
    atsakymasRodymui: '$36$',
    sprendimas: '$6 \\cdot 6 = 36$.',
  },
] as const

export const kvadratuIrKubu: Generatorius = () => suBandymais(kurkKvadratu, A_KVADRATU, T4)

function kurkKvadratu(): Uzdavinys | null {
  const n = atsitiktinis(2, 15)
  const m = atsitiktinis(2, 9)

  return variacija([
    // 1. Kvadratas
    () =>
      uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${lp(n, 2)}$.`,
        atsakymas: String(n * n),
        atsakymasRodymui: `$${n * n}$`,
        sprendimas: `$${n} \\cdot ${n} = ${n * n}$.`,
      }),

    // 2. Kubas
    () =>
      uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${lp(m, 3)}$.`,
        atsakymas: String(m * m * m),
        atsakymasRodymui: `$${m * m * m}$`,
        sprendimas: `$${m} \\cdot ${m} \\cdot ${m} = ${m * m * m}$.`,
      }),

    // 3. Neigiamo skaičiaus kvadratas
    () =>
      uzdavinys(T4, {
        klausimas: `Apskaičiuok: $(-${n})^2$.`,
        atsakymas: String(n * n),
        atsakymasRodymui: `$${n * n}$`,
        sprendimas: 'Neigiamo skaičiaus kvadratas teigiamas — dauginami du vienodo ženklo skaičiai.',
      }),

    // 4. Neigiamo skaičiaus kubas
    () =>
      uzdavinys(T4, {
        klausimas: `Apskaičiuok: $(-${m})^3$.`,
        atsakymas: String(-(m * m * m)),
        atsakymasRodymui: `$-${m * m * m}$`,
        sprendimas: 'Neigiamų daugiklių trys — nelyginis skaičius, tad rezultatas neigiamas.',
      }),

    // 5. Kodėl kvadratas teigiamas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl bet kurio nelygaus nuliui skaičiaus kvadratas yra teigiamas?',
        variantai: [
          'nes dauginami du vienodo ženklo skaičiai',
          'nes kvadratas visada didesnis už skaičių',
          'nes kvadratu keliami tik teigiami skaičiai',
          'nes taip sutarta',
        ],
        teisingas: 0,
        sprendimas: '$(-3)^2 = (-3) \\cdot (-3) = 9$.',
      }),

    // 6. Atvirkštinis
    () =>
      uzdavinys(T4, {
        klausimas: `Kokio teigiamo skaičiaus kvadratas lygus ${n * n}?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${n} \\cdot ${n} = ${n * n}$.`,
      }),

    // 7. Ploto ir tūrio ryšys
    () =>
      uzdavinys(T4, {
        klausimas: `Kubo briauna ${m} cm. Koks jo tūris?`,
        atsakymas: String(m * m * m),
        atsakymasRodymui: `$${m * m * m}$ cm³`,
        sprendimas: `$${lp(m, 3)} = ${m * m * m}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Mokinys apskaičiavo $${lp(n, 2)} = ${2 * n}$. Užrašyk teisingą reikšmę.`,
        atsakymas: String(n * n),
        atsakymasRodymui: `$${n * n}$`,
        sprendimas: 'Kelti kvadratu — ne padauginti iš dviejų, o padauginti skaičių patį iš savęs.',
      }),
  ])
}

// ── 2.2. Laipsnis su natūraliuoju rodikliu ──────────────────────────────────

const T5 = 'laipsnis-naturalusis-rodiklis'

const A_LAIPSNIS = [
  {
    klausimas: 'Apskaičiuok: $2^5$.',
    atsakymas: '32',
    atsakymasRodymui: '$32$',
    sprendimas: '$2 \\cdot 2 \\cdot 2 \\cdot 2 \\cdot 2 = 32$.',
  },
] as const

export const laipsnisNaturalusisRodiklis: Generatorius = () => suBandymais(kurkLaipsni, A_LAIPSNIS, T5)

function kurkLaipsni(): Uzdavinys | null {
  const pagrindas = atsitiktinis(2, 6)
  const rodiklis = atsitiktinis(2, 5)
  const reiksme = pagrindas ** rodiklis
  if (reiksme > 100000) return null

  return variacija([
    // 1. Reikšmė
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${lp(pagrindas, rodiklis)}$.`,
        atsakymas: String(reiksme),
        atsakymasRodymui: `$${sk4(reiksme)}$`,
        sprendimas: `$${Array(rodiklis).fill(pagrindas).join(' \\cdot ')} = ${sk4(reiksme)}$.`,
      }),

    // 2. Kas yra pagrindas ir rodiklis
    () =>
      uzdavinys(T5, {
        klausimas: `Koks yra laipsnio $${lp(pagrindas, rodiklis)}$ pagrindas?`,
        atsakymas: String(pagrindas),
        atsakymasRodymui: `$${pagrindas}$`,
        sprendimas: 'Pagrindas rašomas apačioje, rodiklis — viršuje.',
      }),

    // 3. Rodiklis
    () =>
      uzdavinys(T5, {
        klausimas: `Koks yra laipsnio $${lp(pagrindas, rodiklis)}$ rodiklis?`,
        atsakymas: String(rodiklis),
        atsakymasRodymui: `$${rodiklis}$`,
        sprendimas: 'Rodiklis rodo, kiek kartų pagrindas imamas daugikliu.',
      }),

    // 4. Sandauga į laipsnį
    () =>
      uzdavinys(T5, {
        klausimas: `Užrašyk laipsniu: $${Array(rodiklis).fill(pagrindas).join(' \\cdot ')}$. Koks bus rodiklis?`,
        atsakymas: String(rodiklis),
        atsakymasRodymui: `$${lp(pagrindas, rodiklis)}$, rodiklis $${rodiklis}$`,
        sprendimas: `Daugiklis kartojasi ${rodiklis} kartus.`,
      }),

    // 5. Laipsnis su rodikliu 1
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${lp(pagrindas, 1)}$.`,
        atsakymas: String(pagrindas),
        atsakymasRodymui: `$${pagrindas}$`,
        sprendimas: 'Rodiklis 1 reiškia, kad pagrindas imamas vieną kartą.',
      }),

    // 6. Laipsnis su rodikliu 0
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${lp(pagrindas, 0)}$.`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Bet kurio nelygaus nuliui skaičiaus nulinis laipsnis lygus vienetui.',
      }),

    // 7. Vieneto laipsnis
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${lp(1, rodiklis)}$.`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Vienetas, dauginamas pats iš savęs, lieka vienetu.',
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Mokinys apskaičiavo $${lp(pagrindas, rodiklis)} = ${pagrindas * rodiklis}$. Užrašyk teisingą reikšmę.`,
        atsakymas: String(reiksme),
        atsakymasRodymui: `$${sk4(reiksme)}$`,
        sprendimas: 'Rodiklis rodo daugiklių skaičių, o ne daugiklį.',
      }),
  ])
}

// ── 2.3. Dauginame ir dalijame laipsnius su vienodais pagrindais ────────────

const T6 = 'laipsniai-vienodi-pagrindai'

const A_PAGRINDAI = [
  {
    klausimas: 'Užrašyk vienu laipsniu: $2^3 \\cdot 2^4$.',
    atsakymas: '7',
    atsakymasRodymui: '$2^{7}$',
    sprendimas: 'Rodikliai sudedami: $3 + 4 = 7$.',
  },
] as const

export const laipsniaiVienodiPagrindai: Generatorius = () => suBandymais(kurkPagrindus, A_PAGRINDAI, T6)

function kurkPagrindus(): Uzdavinys | null {
  const p = atsitiktinis(2, 9)
  const r = pasirink(RAIDES)
  const m = atsitiktinis(2, 8)
  const n = atsitiktinis(2, 8)

  return variacija([
    // 1. Daugyba — rodiklis
    () =>
      uzdavinys(T6, {
        klausimas: `Užrašyk vienu laipsniu: $${lp(p, m)} \\cdot ${lp(p, n)}$. Koks bus rodiklis?`,
        atsakymas: String(m + n),
        atsakymasRodymui: `$${lp(p, m + n)}$, rodiklis $${m + n}$`,
        sprendimas: `Dauginant laipsnius su vienodais pagrindais rodikliai sudedami: $${m} + ${n} = ${m + n}$.`,
      }),

    // 2. Dalyba — rodiklis
    () => {
      if (m <= n) return null
      return uzdavinys(T6, {
        klausimas: `Užrašyk vienu laipsniu: $${lp(p, m)} : ${lp(p, n)}$. Koks bus rodiklis?`,
        atsakymas: String(m - n),
        atsakymasRodymui: `$${lp(p, m - n)}$, rodiklis $${m - n}$`,
        sprendimas: `Dalijant rodikliai atimami: $${m} - ${n} = ${m - n}$.`,
      })
    },

    // 3. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kas daroma su rodikliais, dauginant laipsnius su vienodais pagrindais?',
        variantai: ['jie sudedami', 'jie dauginami', 'jie atimami', 'jie nesikeičia'],
        teisingas: 0,
        sprendimas: `$${lp('a', 'm')} \\cdot ${lp('a', 'n')} = ${lp('a', 'm+n')}$.`,
      }),

    // 4. Raidinis reiškinys
    () =>
      uzdavinys(T6, {
        klausimas: `Užrašyk vienu laipsniu: $${lp(r, m)} \\cdot ${lp(r, n)}$. Koks bus rodiklis?`,
        atsakymas: String(m + n),
        atsakymasRodymui: `$${lp(r, m + n)}$`,
        sprendimas: `$${m} + ${n} = ${m + n}$.`,
      }),

    // 5. Reikšmė
    () => {
      const rez = 2 ** (m + n)
      if (rez > 100000) return null
      return uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${lp(2, m)} \\cdot ${lp(2, n)}$.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `$${lp(2, m)} \\cdot ${lp(2, n)} = ${lp(2, m + n)} = ${sk4(rez)}$.`,
      })
    },

    // 6. Trūkstamas rodiklis
    () =>
      uzdavinys(T6, {
        klausimas: `Rask trūkstamą rodiklį: $${lp(p, m)} \\cdot ${lp(p, '\\square')} = ${lp(p, m + n)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${m + n} - ${m} = ${n}$.`,
      }),

    // 7. Trys daugikliai
    () => {
      const k = atsitiktinis(2, 5)
      return uzdavinys(T6, {
        klausimas: `Užrašyk vienu laipsniu: $${lp(p, m)} \\cdot ${lp(p, n)} \\cdot ${lp(p, k)}$. Koks bus rodiklis?`,
        atsakymas: String(m + n + k),
        atsakymasRodymui: `$${lp(p, m + n + k)}$`,
        sprendimas: `$${m} + ${n} + ${k} = ${m + n + k}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: `Mokinys užrašė $${lp(p, m)} \\cdot ${lp(p, n)} = ${lp(p, m * n)}$. Koks turi būti rodiklis?`,
        atsakymas: String(m + n),
        atsakymasRodymui: `$${m + n}$`,
        sprendimas: 'Dauginant laipsnius rodikliai sudedami, o ne dauginami.',
      }),
  ])
}

// ── 2.4. Dauginame ir dalijame laipsnius su vienodais rodikliais ────────────

const T7 = 'laipsniai-vienodi-rodikliai'

const A_RODIKLIAI = [
  {
    klausimas: 'Užrašyk vienu laipsniu: $2^3 \\cdot 5^3$.',
    atsakymas: '10',
    atsakymasRodymui: '$10^{3}$',
    sprendimas: 'Pagrindai sudauginami: $2 \\cdot 5 = 10$.',
  },
] as const

export const laipsniaiVienodiRodikliai: Generatorius = () => suBandymais(kurkRodiklius, A_RODIKLIAI, T7)

function kurkRodiklius(): Uzdavinys | null {
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(2, 9)
  const n = atsitiktinis(2, 4)

  return variacija([
    // 1. Daugyba — pagrindas
    () =>
      uzdavinys(T7, {
        klausimas: `Užrašyk vienu laipsniu: $${lp(a, n)} \\cdot ${lp(b, n)}$. Koks bus pagrindas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${lp(a * b, n)}$, pagrindas $${a * b}$`,
        sprendimas: `Rodikliai vienodi, tad pagrindai sudauginami: $${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 2. Dalyba — pagrindas
    () => {
      if ((a * b) % b !== 0) return null
      return uzdavinys(T7, {
        klausimas: `Užrašyk vienu laipsniu: $${lp(a * b, n)} : ${lp(b, n)}$. Koks bus pagrindas?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${lp(a, n)}$, pagrindas $${a}$`,
        sprendimas: `$${a * b} : ${b} = ${a}$.`,
      })
    },

    // 3. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kas daroma su pagrindais, dauginant laipsnius su vienodais rodikliais?',
        variantai: ['jie sudauginami', 'jie sudedami', 'jie atimami', 'jie nesikeičia'],
        teisingas: 0,
        sprendimas: `$${lp('a', 'n')} \\cdot ${lp('b', 'n')} = ${lp('(ab)', 'n')}$.`,
      }),

    // 4. Patogus skaičiavimas
    () => {
      const rez = (2 * 5) ** n
      if (rez > 1000000) return null
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok patogiausiu būdu: $${lp(2, n)} \\cdot ${lp(5, n)}$.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `$${lp(2, n)} \\cdot ${lp(5, n)} = ${lp(10, n)} = ${sk4(rez)}$.`,
      })
    },

    // 5. Trupmenos laipsnis
    () =>
      uzdavinys(T7, {
        klausimas: `Užrašyk vienu laipsniu: $${tr(lp(a, n), lp(b, n))}$. Koks bus pagrindas? Užrašyk jį trupmena.`,
        atsakymas: `${a}/${b}`,
        atsakymasRodymui: `$\\left(${tr(a, b)}\\right)^{${n}}$`,
        sprendimas: 'Vienodus rodiklius turintys laipsniai dalijami sudarant pagrindų dalmenį.',
      }),

    // 6. Raidinis
    () =>
      uzdavinys(T7, {
        klausimas: `Užrašyk vienu laipsniu: $${lp('a', n)} \\cdot ${lp('b', n)}$. Koks bus pagrindas?`,
        atsakymas: 'ab',
        atsakymasRodymui: `$${lp('(ab)', n)}$`,
        sprendimas: 'Pagrindai sudauginami, rodiklis lieka tas pats.',
      }),

    // 7. Trūkstamas pagrindas
    () =>
      uzdavinys(T7, {
        klausimas: `Rask trūkstamą pagrindą: $${lp(a, n)} \\cdot ${lp('\\square', n)} = ${lp(a * b, n)}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${a * b} : ${a} = ${b}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Mokinys užrašė $${lp(a, n)} \\cdot ${lp(b, n)} = ${lp(a + b, n)}$. Koks turi būti pagrindas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: 'Pagrindai sudauginami, o ne sudedami.',
      }),
  ])
}

// ── 2.5. Laipsnį keliame laipsniu ───────────────────────────────────────────

const T8 = 'laipsni-keliame-laipsniu'

const A_LAIPSNIU = [
  {
    klausimas: 'Užrašyk vienu laipsniu: $(2^3)^4$.',
    atsakymas: '12',
    atsakymasRodymui: '$2^{12}$',
    sprendimas: 'Rodikliai sudauginami: $3 \\cdot 4 = 12$.',
  },
] as const

export const laipsniKeliameLaipsniu: Generatorius = () => suBandymais(kurkLaipsniu, A_LAIPSNIU, T8)

function kurkLaipsniu(): Uzdavinys | null {
  const p = atsitiktinis(2, 9)
  const m = atsitiktinis(2, 6)
  const n = atsitiktinis(2, 5)
  const r = pasirink(RAIDES)

  return variacija([
    // 1. Rodiklis
    () =>
      uzdavinys(T8, {
        klausimas: `Užrašyk vienu laipsniu: $\\left(${lp(p, m)}\\right)^{${n}}$. Koks bus rodiklis?`,
        atsakymas: String(m * n),
        atsakymasRodymui: `$${lp(p, m * n)}$, rodiklis $${m * n}$`,
        sprendimas: `Keliant laipsnį laipsniu rodikliai sudauginami: $${m} \\cdot ${n} = ${m * n}$.`,
      }),

    // 2. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kas daroma su rodikliais, keliant laipsnį laipsniu?',
        variantai: ['jie sudauginami', 'jie sudedami', 'jie atimami', 'jie nesikeičia'],
        teisingas: 0,
        sprendimas: `$\\left(${lp('a', 'm')}\\right)^{n} = ${lp('a', 'mn')}$.`,
      }),

    // 3. Raidinis
    () =>
      uzdavinys(T8, {
        klausimas: `Užrašyk vienu laipsniu: $\\left(${lp(r, m)}\\right)^{${n}}$. Koks bus rodiklis?`,
        atsakymas: String(m * n),
        atsakymasRodymui: `$${lp(r, m * n)}$`,
        sprendimas: `$${m} \\cdot ${n} = ${m * n}$.`,
      }),

    // 4. Reikšmė
    () => {
      const rez = 2 ** (m * n)
      if (rez > 1000000) return null
      return uzdavinys(T8, {
        klausimas: `Apskaičiuok: $\\left(${lp(2, m)}\\right)^{${n}}$.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `$\\left(${lp(2, m)}\\right)^{${n}} = ${lp(2, m * n)} = ${sk4(rez)}$.`,
      })
    },

    // 5. Sandaugos laipsnis
    () =>
      uzdavinys(T8, {
        klausimas: `Užrašyk be skliaustų: $\\left(${p}a\\right)^{${n}}$. Koks bus skaitinis daugiklis?`,
        atsakymas: String(p ** n),
        atsakymasRodymui: `$${sk4(p ** n)}${lp('a', n)}$`,
        sprendimas: `Laipsniu keliamas kiekvienas daugiklis: $${lp(p, n)} = ${sk4(p ** n)}$.`,
      }),

    // 6. Trūkstamas rodiklis
    () =>
      uzdavinys(T8, {
        klausimas: `Rask trūkstamą rodiklį: $\\left(${lp(p, m)}\\right)^{\\square} = ${lp(p, m * n)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${m * n} : ${m} = ${n}$.`,
      }),

    // 7. Kuo skiriasi nuo daugybos
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Kuo skiriasi $${lp(p, m)} \\cdot ${lp(p, n)}$ nuo $\\left(${lp(p, m)}\\right)^{${n}}$?`,
        variantai: [
          'pirmuoju atveju rodikliai sudedami, antruoju — sudauginami',
          'skirtumo nėra',
          'pirmuoju atveju sudauginami pagrindai',
          'antruoju atveju rodikliai atimami',
        ],
        teisingas: 0,
        sprendimas: `$${lp(p, m + n)}$ ir $${lp(p, m * n)}$ — skirtingi laipsniai.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T8, {
        klausimas: `Mokinys užrašė $\\left(${lp(p, m)}\\right)^{${n}} = ${lp(p, m + n)}$. Koks turi būti rodiklis?`,
        atsakymas: String(m * n),
        atsakymasRodymui: `$${m * n}$`,
        sprendimas: 'Keliant laipsnį laipsniu rodikliai sudauginami.',
      }),
  ])
}

// ── 2.6. Laipsnis su sveikuoju neigiamuoju rodikliu ─────────────────────────

const T9 = 'neigiamas-rodiklis'

const A_NEIGIAMAS = [
  {
    klausimas: 'Užrašyk trupmena: $2^{-3}$.',
    atsakymas: '1/8',
    atsakymasRodymui: '$\\dfrac{1}{8}$',
    sprendimas: '$2^{-3} = \\dfrac{1}{2^3} = \\dfrac{1}{8}$.',
  },
] as const

export const neigiamasRodiklis: Generatorius = () => suBandymais(kurkNeigiama, A_NEIGIAMAS, T9)

function kurkNeigiama(): Uzdavinys | null {
  const p = atsitiktinis(2, 6)
  const n = atsitiktinis(1, 4)
  const reiksme = p ** n
  // Vardiklis turi likti perskaitomas: 3^5 duotų 1/243, o tokio atsakymo
  // mokinys nei įsivaizduoja, nei patikrina.
  if (reiksme > 20 && 1000 % reiksme !== 0) return null

  return variacija([
    // 1. Į trupmeną
    () =>
      uzdavinys(T9, {
        klausimas: `Užrašyk trupmena: $${lp(p, -n)}$.`,
        atsakymas: `1/${reiksme}`,
        atsakymasRodymui: `$${tr(1, reiksme)}$`,
        sprendimas: `$${lp(p, -n)} = ${tr(1, lp(p, n))} = ${tr(1, reiksme)}$.`,
      }),

    // 2. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Ką reiškia neigiamas laipsnio rodiklis?',
        variantai: [
          'laipsnis su priešingu rodikliu apverčiamas',
          'laipsnio reikšmė neigiama',
          'pagrindas tampa neigiamas',
          'laipsnis lygus nuliui',
        ],
        teisingas: 0,
        sprendimas: `$${lp('a', '-n')} = ${tr(1, lp('a', 'n'))}$.`,
      }),

    // 3. Ar reikšmė neigiama
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Ar $${lp(p, -n)}$ yra neigiamas skaičius?`,
        variantai: [
          'ne, tai teigiama trupmena, mažesnė už vienetą',
          'taip',
          'taip, jei rodiklis nelyginis',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Neigiamas rodiklis keičia ne ženklą, o apverčia laipsnį.',
      }),

    // 4. Iš trupmenos į laipsnį
    () =>
      uzdavinys(T9, {
        klausimas: `Užrašyk laipsniu su neigiamu rodikliu: $${tr(1, reiksme)}$, kai pagrindas ${p}. Koks bus rodiklis?`,
        atsakymas: String(-n),
        atsakymasRodymui: `$${lp(p, -n)}$, rodiklis $-${n}$`,
        sprendimas: `$${reiksme} = ${lp(p, n)}$, tad $${tr(1, reiksme)} = ${lp(p, -n)}$.`,
      }),

    // 5. Rodiklis −1
    () =>
      uzdavinys(T9, {
        klausimas: `Užrašyk trupmena: $${lp(p, -1)}$.`,
        atsakymas: `1/${p}`,
        atsakymasRodymui: `$${tr(1, p)}$`,
        sprendimas: 'Rodiklis $-1$ tiesiog apverčia skaičių.',
      }),

    // 6. Dešimties neigiamas laipsnis
    //
    // Rodiklis iki 3: $10^{-4}$ duotų $\dfrac{1}{10\,000}$, o tokį atsakymą
    // mokinys jau tik nurašo, o ne perskaito.
    () => {
      const k = atsitiktinis(1, 3)
      return uzdavinys(T9, {
        klausimas: `Užrašyk dešimtainiu skaičiumi: $${lp(10, -k)}$.`,
        atsakymas: String(10 ** -k),
        atsakymasRodymui: `$0{,}${'0'.repeat(k - 1)}1$`,
        sprendimas: `$${lp(10, -k)} = ${tr(1, sk4(10 ** k))}$.`,
      })
    },

    // 7. Trupmenos neigiamas laipsnis
    () =>
      uzdavinys(T9, {
        klausimas: `Apskaičiuok: $\\left(${tr(1, p)}\\right)^{-1}$.`,
        atsakymas: String(p),
        atsakymasRodymui: `$${p}$`,
        sprendimas: 'Trupmena apverčiama.',
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Mokinys užrašė $${lp(p, -n)} = -${reiksme}$. Užrašyk teisingą reikšmę trupmena.`,
        atsakymas: `1/${reiksme}`,
        atsakymasRodymui: `$${tr(1, reiksme)}$`,
        sprendimas: 'Neigiamas rodiklis skaičiaus ženklo nekeičia.',
      }),
  ])
}

// ── 2.7. Laipsnio su sveikuoju neigiamuoju rodikliu savybės ─────────────────

const T10 = 'neigiamo-rodiklio-savybes'

const A_SAVYBES = [
  {
    klausimas: 'Užrašyk vienu laipsniu: $2^{5} \\cdot 2^{-3}$.',
    atsakymas: '2',
    atsakymasRodymui: '$2^{2}$',
    sprendimas: 'Rodikliai sudedami: $5 + (-3) = 2$.',
  },
] as const

export const neigiamoRodiklioSavybes: Generatorius = () => suBandymais(kurkSavybes, A_SAVYBES, T10)

function kurkSavybes(): Uzdavinys | null {
  const p = atsitiktinis(2, 7)
  const m = atsitiktinis(3, 8)
  const n = atsitiktinis(1, m - 1)

  return variacija([
    // 1. Daugyba su neigiamu rodikliu
    () =>
      uzdavinys(T10, {
        klausimas: `Užrašyk vienu laipsniu: $${lp(p, m)} \\cdot ${lp(p, -n)}$. Koks bus rodiklis?`,
        atsakymas: String(m - n),
        atsakymasRodymui: `$${lp(p, m - n)}$`,
        sprendimas: `Rodikliai sudedami: $${m} + (-${n}) = ${m - n}$.`,
      }),

    // 2. Dalyba, duodanti neigiamą rodiklį
    () =>
      uzdavinys(T10, {
        klausimas: `Užrašyk vienu laipsniu: $${lp(p, n)} : ${lp(p, m)}$. Koks bus rodiklis?`,
        atsakymas: String(n - m),
        atsakymasRodymui: `$${lp(p, n - m)}$`,
        sprendimas: `$${n} - ${m} = ${n - m}$ — rodiklis neigiamas.`,
      }),

    // 3. Laipsnio kėlimas laipsniu
    () =>
      uzdavinys(T10, {
        klausimas: `Užrašyk vienu laipsniu: $\\left(${lp(p, -n)}\\right)^{2}$. Koks bus rodiklis?`,
        atsakymas: String(-2 * n),
        atsakymasRodymui: `$${lp(p, -2 * n)}$`,
        sprendimas: `$-${n} \\cdot 2 = ${-2 * n}$.`,
      }),

    // 4. Ar savybės galioja
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Ar laipsnių savybės galioja ir neigiamiems rodikliams?',
        variantai: [
          'taip, visos savybės galioja',
          'ne, joms reikia atskirų taisyklių',
          'taip, bet tik daugybai',
          'taip, bet tik teigiamiems pagrindams',
        ],
        teisingas: 0,
        sprendimas: 'Todėl rodiklius galima sudėti ir atimti kaip įprastus sveikuosius skaičius.',
      }),

    // 5. Rodiklių suma lygi nuliui
    () =>
      uzdavinys(T10, {
        klausimas: `Apskaičiuok: $${lp(p, m)} \\cdot ${lp(p, -m)}$.`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: `Rodiklių suma lygi nuliui: $${lp(p, 0)} = 1$.`,
      }),

    // 6. Trūkstamas rodiklis
    () =>
      uzdavinys(T10, {
        klausimas: `Rask trūkstamą rodiklį: $${lp(p, m)} \\cdot ${lp(p, '\\square')} = ${lp(p, m - n)}$.`,
        atsakymas: String(-n),
        atsakymasRodymui: `$-${n}$`,
        sprendimas: `$${m - n} - ${m} = ${-n}$.`,
      }),

    // 7. Reikšmė
    () => {
      const rez = 2 ** (m - n)
      if (rez > 100000) return null
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok: $${lp(2, m)} \\cdot ${lp(2, -n)}$.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `$${lp(2, m - n)} = ${sk4(rez)}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T10, {
        klausimas: `Mokinys užrašė $${lp(p, m)} \\cdot ${lp(p, -n)} = ${lp(p, m + n)}$. Koks turi būti rodiklis?`,
        atsakymas: String(m - n),
        atsakymasRodymui: `$${m - n}$`,
        sprendimas: `Sudedant neigiamą rodiklį reikšmė mažėja: $${m} + (-${n}) = ${m - n}$.`,
      }),
  ])
}

// ── 2.8. Standartinė skaičiaus išraiška ─────────────────────────────────────

const T11 = 'standartine-israiska'

const A_STANDARTINE = [
  {
    klausimas: 'Užrašyk standartine išraiška: $4500$. Koks bus dešimties rodiklis?',
    atsakymas: '3',
    atsakymasRodymui: '$4{,}5 \\cdot 10^{3}$',
    sprendimas: 'Kablelis perkeliamas taip, kad prieš jį liktų vienas skaitmuo.',
  },
] as const

export const standartineIsraiska: Generatorius = () => suBandymais(kurkStandartine, A_STANDARTINE, T11)

function kurkStandartine(): Uzdavinys | null {
  const pirmas = atsitiktinis(1, 9)
  const antras = atsitiktinis(0, 9)
  const rodiklis = atsitiktinis(2, 6)
  const skaicius = (pirmas * 10 + antras) * 10 ** (rodiklis - 1)
  if (skaicius > 1_000_000) return null
  const mantise = antras === 0 ? String(pirmas) : `${pirmas}{,}${antras}`

  return variacija([
    // 1. Rodiklis
    () =>
      uzdavinys(T11, {
        klausimas: `Užrašyk standartine išraiška skaičių $${sk4(skaicius)}$. Koks bus dešimties rodiklis?`,
        atsakymas: String(rodiklis),
        atsakymasRodymui: `$${mantise} \\cdot ${lp(10, rodiklis)}$, rodiklis $${rodiklis}$`,
        sprendimas: 'Kablelis perkeliamas taip, kad prieš jį liktų vienas nenulinis skaitmuo.',
      }),

    // 2. Kas yra standartinė išraiška
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kaip atrodo skaičiaus standartinė išraiška?',
        variantai: [
          'skaičius nuo 1 iki 10, padaugintas iš dešimties laipsnio',
          'bet koks skaičius, padaugintas iš dešimties laipsnio',
          'skaičius su kableliu',
          'skaičius, užrašytas laipsniu',
        ],
        teisingas: 0,
        sprendimas: `Pavyzdžiui, $${mantise} \\cdot ${lp(10, rodiklis)}$.`,
      }),

    // 3. Iš standartinės į įprastą
    () =>
      uzdavinys(T11, {
        klausimas: `Užrašyk įprastu būdu: $${mantise} \\cdot ${lp(10, rodiklis)}$.`,
        atsakymas: String(skaicius),
        atsakymasRodymui: `$${sk4(skaicius)}$`,
        sprendimas: `Kablelis perkeliamas ${rodiklis} skiltimis į dešinę.`,
      }),

    // 4. Mažas skaičius
    () => {
      const k = atsitiktinis(2, 5)
      return uzdavinys(T11, {
        klausimas: `Užrašyk standartine išraiška skaičių $0{,}${'0'.repeat(k - 1)}${pirmas}$. Koks bus dešimties rodiklis?`,
        atsakymas: String(-k),
        atsakymasRodymui: `$${pirmas} \\cdot ${lp(10, -k)}$, rodiklis $-${k}$`,
        sprendimas: 'Mažesniems už vienetą skaičiams dešimties rodiklis neigiamas.',
      })
    },

    // 5. Kuris didesnis
    () => {
      const r2 = rodiklis + atsitiktinis(1, 3)
      return pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Kuris skaičius didesnis: $${mantise} \\cdot ${lp(10, rodiklis)}$ ar $1 \\cdot ${lp(10, r2)}$?`,
        variantai: [`$1 \\cdot ${lp(10, r2)}$`, `$${mantise} \\cdot ${lp(10, rodiklis)}$`, 'jie lygūs'],
        teisingas: 0,
        sprendimas: 'Pirmiausia lyginami dešimties rodikliai — didesnis rodiklis lemia didesnį skaičių.',
      })
    },

    // 6. Kur naudojama
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kam naudinga standartinė skaičiaus išraiška?',
        variantai: [
          'labai dideliems ir labai mažiems skaičiams patogiai užrašyti',
          'trupmenoms prastinti',
          'lygtims spręsti',
          'kampams matuoti',
        ],
        teisingas: 0,
        sprendimas: 'Šviesos greitis užrašomas $3 \\cdot 10^{8}$ m/s, o ne $300\\,000\\,000$.',
      }),

    // 7. Sandauga standartine išraiška
    () => {
      const r2 = atsitiktinis(2, 4)
      return uzdavinys(T11, {
        klausimas: `Apskaičiuok ir užrašyk standartine išraiška: $2 \\cdot ${lp(10, rodiklis)} \\cdot 3 \\cdot ${lp(10, r2)}$. Koks bus dešimties rodiklis?`,
        atsakymas: String(rodiklis + r2),
        atsakymasRodymui: `$6 \\cdot ${lp(10, rodiklis + r2)}$`,
        sprendimas: `Skaičiai sudauginami, o rodikliai sudedami: $${rodiklis} + ${r2} = ${rodiklis + r2}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T11, {
        klausimas: `Mokinys užrašė $${sk4(skaicius)} = ${pirmas * 10 + antras} \\cdot ${lp(10, rodiklis - 1)}$. Toks užrašas nėra standartinė išraiška. Koks turi būti dešimties rodiklis?`,
        atsakymas: String(rodiklis),
        atsakymasRodymui: `$${rodiklis}$`,
        sprendimas: 'Standartinėje išraiškoje prieš kablelį turi likti tik vienas skaitmuo.',
      }),
  ])
}
