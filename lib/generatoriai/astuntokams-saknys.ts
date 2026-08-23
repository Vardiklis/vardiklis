import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 8 klasės temos „Kvadratinė ir kubinė šaknys“ ir „Skaičių aibės“ —
 * keturiolika potemių.
 *
 * Iracionalaus atsakymo suvesti neįmanoma, tad ten, kur šaknis neišsitraukia,
 * klausiama koeficiento prieš šaknį, pošaknio arba tarp kurių sveikųjų
 * skaičių yra reikšmė. Taip mokinys vis tiek atlieka pertvarkį, bet atsakymą
 * gali įrašyti.
 */

/** Pirmųjų dvidešimties skaičių kvadratai — iš jų renkami „gražūs“ pošakniai. */
const KVADRATAI = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400]

function sqrt(x: number | string): string {
  return `\\sqrt{${x}}`
}

function cbrt(x: number | string): string {
  return `\\sqrt[3]{${x}}`
}

/** Didžiausias kvadratas, kuriuo dalus `n` — pošaknio prastinimui. */
function didziausiasKvadratas(n: number): number {
  let geriausias = 1
  for (const k of KVADRATAI) {
    if (k > n) break
    if (n % k === 0) geriausias = k
  }
  return geriausias
}

// ── 1.1. Kvadratinė šaknis ──────────────────────────────────────────────────

const T1 = 'kvadratine-saknis'

const A_KVADRATINE = [
  {
    klausimas: 'Apskaičiuok: $\\sqrt{49}$.',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: '$7^2 = 49$.',
  },
] as const

export const kvadratineSaknis: Generatorius = () => suBandymais(kurkKvadratine, A_KVADRATINE, T1)

function kurkKvadratine(): Uzdavinys | null {
  const n = atsitiktinis(2, 20)
  const kvadratas = n * n

  return variacija([
    // 1. Šaknies reikšmė
    () =>
      uzdavinys(T1, {
        klausimas: `Apskaičiuok: $${sqrt(kvadratas)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${n}^2 = ${kvadratas}$.`,
      }),

    // 2. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kas yra skaičiaus kvadratinė šaknis?',
        variantai: [
          'neneigiamas skaičius, kurio kvadratas lygus duotajam',
          'skaičius, padaugintas iš dviejų',
          'skaičius, padalytas iš dviejų',
          'skaičiaus kvadratas',
        ],
        teisingas: 0,
        sprendimas: `$${sqrt(kvadratas)} = ${n}$, nes $${n}^2 = ${kvadratas}$.`,
      }),

    // 3. Šaknis iš nulio ir vieneto
    () =>
      uzdavinys(T1, {
        klausimas: `Apskaičiuok: $${sqrt(1)}$.`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: '$1^2 = 1$.',
      }),

    // 4. Ar galima traukti iš neigiamo
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Ar galima ištraukti kvadratinę šaknį iš $-${kvadratas}$?`,
        variantai: [
          'ne, nes nėra skaičiaus, kurio kvadratas būtų neigiamas',
          `taip, gaunama $-${n}$`,
          `taip, gaunama $${n}$`,
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Bet kurio skaičiaus kvadratas yra neneigiamas.',
      }),

    // 5. Šaknis iš kvadrato
    () =>
      uzdavinys(T1, {
        klausimas: `Apskaičiuok: $${sqrt(`${n}^2`)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: 'Šaknies traukimas ir kėlimas kvadratu vienas kitą panaikina, kai skaičius neneigiamas.',
      }),

    // 6. Įvertinimas
    () => {
      const tarp = atsitiktinis(2, 19)
      const x = atsitiktinis(tarp * tarp + 1, (tarp + 1) * (tarp + 1) - 1)
      return uzdavinys(T1, {
        klausimas: `Tarp kurių dviejų gretimų sveikųjų skaičių yra $${sqrt(x)}$? Užrašyk mažesnįjį.`,
        atsakymas: String(tarp),
        atsakymasRodymui: `$${tarp}$`,
        sprendimas: `$${tarp}^2 = ${tarp * tarp}$, o $${tarp + 1}^2 = ${(tarp + 1) * (tarp + 1)}$, tad $${tarp} < ${sqrt(x)} < ${tarp + 1}$.`,
      })
    },

    // 7. Lygtis su kvadratu
    () =>
      uzdavinys(T1, {
        klausimas: `Rask teigiamą $x$, kai $x^2 = ${kvadratas}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$x = ${sqrt(kvadratas)} = ${n}$.`,
      }),

    // 8. Kvadrato kraštinė
    () =>
      uzdavinys(T1, {
        klausimas: `Kvadrato plotas ${kvadratas} cm². Kokio ilgio jo kraštinė?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$ cm`,
        sprendimas: `$${sqrt(kvadratas)} = ${n}$.`,
      }),
  ])
}

// ── 1.2. Kubinė šaknis ──────────────────────────────────────────────────────

const T2 = 'kubine-saknis'

const A_KUBINE = [
  {
    klausimas: 'Apskaičiuok: $\\sqrt[3]{27}$.',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: '$3^3 = 27$.',
  },
] as const

export const kubineSaknis: Generatorius = () => suBandymais(kurkKubine, A_KUBINE, T2)

function kurkKubine(): Uzdavinys | null {
  const n = atsitiktinis(2, 10)
  const kubas = n * n * n

  return variacija([
    // 1. Reikšmė
    () =>
      uzdavinys(T2, {
        klausimas: `Apskaičiuok: $${cbrt(kubas)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${n}^3 = ${kubas}$.`,
      }),

    // 2. Iš neigiamo
    () =>
      uzdavinys(T2, {
        klausimas: `Apskaičiuok: $${cbrt(-kubas)}$.`,
        atsakymas: String(-n),
        atsakymasRodymui: `$-${n}$`,
        sprendimas: `$(-${n})^3 = -${kubas}$ — kubinę šaknį galima traukti ir iš neigiamo skaičiaus.`,
      }),

    // 3. Kuo skiriasi nuo kvadratinės
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuo kubinė šaknis skiriasi nuo kvadratinės?',
        variantai: [
          'kubinę šaknį galima traukti ir iš neigiamo skaičiaus',
          'kubinė šaknis visada didesnė',
          'kubinė šaknis neturi reikšmės',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Nelyginio laipsnio šaknį galima traukti iš bet kurio skaičiaus.',
      }),

    // 4. Kubo briauna
    () =>
      uzdavinys(T2, {
        klausimas: `Kubo tūris ${kubas} cm³. Kokio ilgio jo briauna?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$ cm`,
        sprendimas: `$${cbrt(kubas)} = ${n}$.`,
      }),

    // 5. Lygtis su kubu
    () =>
      uzdavinys(T2, {
        klausimas: `Rask $x$, kai $x^3 = ${kubas}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$x = ${cbrt(kubas)} = ${n}$.`,
      }),

    // 6. Šaknis iš kubo
    () =>
      uzdavinys(T2, {
        klausimas: `Apskaičiuok: $${cbrt(`${n}^3`)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: 'Kubinės šaknies traukimas panaikina kėlimą kubu.',
      }),

    // 7. Įvertinimas
    () => {
      const tarp = atsitiktinis(2, 9)
      const x = atsitiktinis(tarp ** 3 + 1, (tarp + 1) ** 3 - 1)
      return uzdavinys(T2, {
        klausimas: `Tarp kurių dviejų gretimų sveikųjų skaičių yra $${cbrt(x)}$? Užrašyk mažesnįjį.`,
        atsakymas: String(tarp),
        atsakymasRodymui: `$${tarp}$`,
        sprendimas: `$${tarp}^3 = ${tarp ** 3}$, o $${tarp + 1}^3 = ${(tarp + 1) ** 3}$.`,
      })
    },

    // 8. Poros
    () =>
      poruUzdavinys(naujasId(T2), T2, {
        klausimas: 'Sujunk šaknį su jos reikšme.',
        poros: [
          { kaire: '$\\sqrt[3]{8}$', desine: '$2$' },
          { kaire: '$\\sqrt[3]{27}$', desine: '$3$' },
          { kaire: '$\\sqrt[3]{64}$', desine: '$4$' },
          { kaire: '$\\sqrt[3]{125}$', desine: '$5$' },
        ],
        sprendimas: 'Kubinė šaknis atsako, kurį skaičių reikia pakelti kubu.',
      }),
  ])
}

// ── 1.3. Iracionalieji skaičiai ─────────────────────────────────────────────

const T3 = 'iracionalieji-skaiciai'

const A_IRACIONALUS = [
  {
    klausimas: 'Ar $\\sqrt{2}$ yra racionalusis skaičius?',
    atsakymas: 'ne',
    atsakymasRodymui: 'Ne',
    sprendimas: 'Jo negalima užrašyti dviejų sveikųjų skaičių dalmeniu.',
  },
] as const

export const iracionaliejiSkaiciai: Generatorius = () => suBandymais(kurkIracionalius, A_IRACIONALUS, T3)

function kurkIracionalius(): Uzdavinys | null {
  const n = atsitiktinis(2, 20)
  const kvadratas = n * n
  const neKvadratas = pasirink([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15])

  return variacija([
    // 1. Ar iracionalusis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Koks skaičius yra $${sqrt(neKvadratas)}$?`,
        variantai: ['iracionalusis', 'natūralusis', 'sveikasis', 'racionalusis'],
        teisingas: 0,
        sprendimas: `${neKvadratas} nėra sveikojo skaičiaus kvadratas, tad šaknis neišsitraukia.`,
      }),

    // 2. Kuri šaknis racionali
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Koks skaičius yra $${sqrt(kvadratas)}$?`,
        variantai: ['racionalusis', 'iracionalusis', 'neapibrėžtas', 'neigiamas'],
        teisingas: 0,
        sprendimas: `$${sqrt(kvadratas)} = ${n}$ — sveikasis, tad ir racionalusis skaičius.`,
      }),

    // 3. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kas yra iracionalusis skaičius?',
        variantai: [
          'skaičius, kurio negalima užrašyti dviejų sveikųjų skaičių dalmeniu',
          'bet koks skaičius su šaknimi',
          'neigiamas skaičius',
          'begalinė periodinė trupmena',
        ],
        teisingas: 0,
        sprendimas: 'Jo dešimtainė išraiška begalinė ir neperiodinė.',
      }),

    // 4. Kada šaknis racionali
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kada kvadratinė šaknis iš natūraliojo skaičiaus yra racionalusis skaičius?',
        variantai: [
          'kai pošaknis yra sveikojo skaičiaus kvadratas',
          'kai pošaknis lyginis',
          'kai pošaknis pirminis',
          'visada',
        ],
        teisingas: 0,
        sprendimas: 'Kitais atvejais šaknis neišsitraukia.',
      }),

    // 5. π
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Koks skaičius yra $\\pi$?',
        variantai: ['iracionalusis', 'racionalusis', 'sveikasis', 'natūralusis'],
        teisingas: 0,
        sprendimas: 'Jo dešimtainė išraiška begalinė ir neperiodinė, o $3{,}14$ yra tik apytikslė reikšmė.',
      }),

    // 6. Kiek iracionaliųjų sąraše
    () =>
      uzdavinys(T3, {
        klausimas: `Kiek iracionaliųjų skaičių yra sąraše: $${sqrt(4)}$, $${sqrt(5)}$, $\\dfrac{1}{3}$, $${sqrt(9)}$?`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: `$${sqrt(4)} = 2$ ir $${sqrt(9)} = 3$ yra sveikieji, $\\dfrac{1}{3}$ — racionalusis; iracionalusis tik $${sqrt(5)}$.`,
      }),

    // 7. Dešimtainė išraiška
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kokia yra iracionaliojo skaičiaus dešimtainė išraiška?',
        variantai: [
          'begalinė ir neperiodinė',
          'baigtinė',
          'begalinė periodinė',
          'visada lygi nuliui',
        ],
        teisingas: 0,
        sprendimas: 'Periodinė trupmena visada yra racionalusis skaičius.',
      }),

    // 8. Suma su racionaliuoju
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Koks skaičius yra $1 + ${sqrt(neKvadratas)}$?`,
        variantai: ['iracionalusis', 'racionalusis', 'sveikasis', 'natūralusis'],
        teisingas: 0,
        sprendimas: 'Prie iracionaliojo pridėjus racionalųjį vėl gaunamas iracionalusis skaičius.',
      }),
  ])
}

// ── 1.4. Palyginame ─────────────────────────────────────────────────────────

const T4 = 'saknu-palyginimas'

const A_PALYGINIMAS = [
  {
    klausimas: 'Kuris skaičius didesnis: $\\sqrt{10}$ ar $3$?',
    atsakymas: '10',
    atsakymasRodymui: '$\\sqrt{10}$',
    sprendimas: '$3 = \\sqrt{9}$, o $10 > 9$.',
  },
] as const

export const saknuPalyginimas: Generatorius = () => suBandymais(kurkPalyginima, A_PALYGINIMAS, T4)

function kurkPalyginima(): Uzdavinys | null {
  const n = atsitiktinis(2, 14)
  const kvadratas = n * n

  return variacija([
    // 1. Šaknis ir sveikasis
    () => {
      const x = kvadratas + atsitiktinis(1, 2 * n)
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kuris skaičius didesnis: $${sqrt(x)}$ ar $${n}$?`,
        variantai: [`$${sqrt(x)}$`, `$${n}$`, 'jie lygūs'],
        teisingas: 0,
        sprendimas: `$${n} = ${sqrt(kvadratas)}$, o $${x} > ${kvadratas}$.`,
      })
    },

    // 2. Dvi šaknys
    () => {
      const a = atsitiktinis(2, 60)
      const b = atsitiktinis(2, 60)
      if (a === b) return null
      return uzdavinys(T4, {
        klausimas: `Kuris skaičius didesnis: $${sqrt(a)}$ ar $${sqrt(b)}$? Užrašyk didesniojo pošaknį.`,
        atsakymas: String(Math.max(a, b)),
        atsakymasRodymui: `$${sqrt(Math.max(a, b))}$`,
        sprendimas: 'Didesnis pošaknis duoda didesnę šaknį.',
      })
    },

    // 3. Kaip lyginamos
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kaip lyginamos dvi neneigiamos kvadratinės šaknys?',
        variantai: [
          'didesnė ta, kurios pošaknis didesnis',
          'didesnė ta, kurios pošaknis mažesnis',
          'jos visada lygios',
          'reikia jas ištraukti',
        ],
        teisingas: 0,
        sprendimas: 'Kvadratinė šaknis yra didėjanti neneigiamų skaičių funkcija.',
      }),

    // 4. Rikiavimas
    () => {
      const eile = [2, 5, 7, 11].map((x) => x)
      return eiliskumoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Surikiuok skaičius didėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${sqrt(x)}$`),
        sprendimas: 'Lyginami pošakniai.',
      })
    },

    // 5. Tarp kurių sveikųjų
    () => {
      const x = atsitiktinis(kvadratas + 1, (n + 1) * (n + 1) - 1)
      return uzdavinys(T4, {
        klausimas: `Koks yra didžiausias sveikasis skaičius, mažesnis už $${sqrt(x)}$?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${n}^2 = ${kvadratas} < ${x}$, o $${n + 1}^2 = ${(n + 1) * (n + 1)} > ${x}$.`,
      })
    },

    // 6. Šaknis ir trupmena
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuris skaičius didesnis: $\\sqrt{0{,}25}$ ar $0{,}25$?',
        variantai: ['$\\sqrt{0{,}25}$', '$0{,}25$', 'jie lygūs'],
        teisingas: 0,
        sprendimas: '$\\sqrt{0{,}25} = 0{,}5$, o $0{,}5 > 0{,}25$ — iš skaičiaus, mažesnio už vienetą, šaknis didesnė už patį skaičių.',
      }),

    // 7. Klaidos radimas
    () => {
      const x = kvadratas + atsitiktinis(1, 2 * n)
      return uzdavinys(T4, {
        klausimas: `Mokinys teigia, kad $${sqrt(x)} < ${n}$. Kuris skaičius iš tikrųjų didesnis? Užrašyk jį.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${sqrt(x)}$`,
        sprendimas: `$${n} = ${sqrt(kvadratas)}$, o $${x} > ${kvadratas}$.`,
      })
    },
  ])
}

// ── 1.5. Sudedame ir atimame ────────────────────────────────────────────────

const T5 = 'saknu-sudetis'

const A_SUDETIS = [
  {
    klausimas: 'Sutrauk: $3\\sqrt{5} + 4\\sqrt{5}$. Užrašyk koeficientą prieš šaknį.',
    atsakymas: '7',
    atsakymasRodymui: '$7\\sqrt{5}$',
    sprendimas: 'Sudedami koeficientai: $3 + 4 = 7$.',
  },
] as const

export const saknuSudetis: Generatorius = () => suBandymais(kurkSudeti, A_SUDETIS, T5)

function kurkSudeti(): Uzdavinys | null {
  const posaknis = pasirink([2, 3, 5, 6, 7, 10, 11, 13])
  const a = atsitiktinis(2, 12)
  const b = atsitiktinis(2, 12)

  return variacija([
    // 1. Sudėtis
    () =>
      uzdavinys(T5, {
        klausimas: `Sutrauk: $${a}${sqrt(posaknis)} + ${b}${sqrt(posaknis)}$. Užrašyk koeficientą prieš šaknį.`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}${sqrt(posaknis)}$`,
        sprendimas: `Panašūs nariai: $${a} + ${b} = ${a + b}$.`,
      }),

    // 2. Atimtis
    () => {
      if (a <= b) return null
      return uzdavinys(T5, {
        klausimas: `Sutrauk: $${a}${sqrt(posaknis)} - ${b}${sqrt(posaknis)}$. Užrašyk koeficientą prieš šaknį.`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}${sqrt(posaknis)}$`,
        sprendimas: `$${a} - ${b} = ${a - b}$.`,
      })
    },

    // 3. Kada galima sudėti
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kada dvi šaknis galima sudėti į vieną narį?',
        variantai: [
          'kai pošakniai vienodi',
          'kai koeficientai vienodi',
          'visada',
          'kai pošakniai skirtingi',
        ],
        teisingas: 0,
        sprendimas: `$${sqrt(2)} + ${sqrt(3)}$ sutraukti negalima.`,
      }),

    // 4. Negalima sutraukti
    () => {
      const kitas = pasirink([2, 3, 5, 6, 7].filter((x) => x !== posaknis))
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Ar galima sutraukti $${a}${sqrt(posaknis)} + ${b}${sqrt(kitas)}$?`,
        variantai: ['ne, pošakniai skirtingi', 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Sutraukti galima tik panašius narius — tuos, kurių pošakniai sutampa.',
      })
    },

    // 5. Su vienetiniu koeficientu
    () =>
      uzdavinys(T5, {
        klausimas: `Sutrauk: $${sqrt(posaknis)} + ${a}${sqrt(posaknis)}$. Užrašyk koeficientą prieš šaknį.`,
        atsakymas: String(a + 1),
        atsakymasRodymui: `$${a + 1}${sqrt(posaknis)}$`,
        sprendimas: `Prie šaknies be skaičiaus koeficientas lygus 1: $1 + ${a} = ${a + 1}$.`,
      }),

    // 6. Trys nariai
    () => {
      const c = atsitiktinis(1, 8)
      if (a + b - c < 1) return null
      return uzdavinys(T5, {
        klausimas: `Sutrauk: $${a}${sqrt(posaknis)} + ${b}${sqrt(posaknis)} - ${c}${sqrt(posaknis)}$. Užrašyk koeficientą prieš šaknį.`,
        atsakymas: String(a + b - c),
        atsakymasRodymui: `$${a + b - c}${sqrt(posaknis)}$`,
        sprendimas: `$${a} + ${b} - ${c} = ${a + b - c}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Mokinys užrašė $${sqrt(9)} + ${sqrt(16)} = ${sqrt(25)}$. Kodėl tai klaida?`,
        variantai: [
          'nes šaknų sudėti po vienu ženklu negalima: $3 + 4 = 7$, o ne $5$',
          'nes 9 ir 16 nėra kvadratai',
          'nes šaknys neišsitraukia',
          'tai nėra klaida',
        ],
        teisingas: 0,
        sprendimas: `$${sqrt(9)} = 3$, $${sqrt(16)} = 4$, tad suma lygi $7$, o $${sqrt(25)} = 5$.`,
      }),
  ])
}

// ── 1.6. Šaknis iš sandaugos ────────────────────────────────────────────────

const T6 = 'saknis-is-sandaugos'

const A_SANDAUGA = [
  {
    klausimas: 'Apskaičiuok: $\\sqrt{4 \\cdot 25}$.',
    atsakymas: '10',
    atsakymasRodymui: '$10$',
    sprendimas: '$\\sqrt{4} \\cdot \\sqrt{25} = 2 \\cdot 5 = 10$.',
  },
] as const

export const saknisIsSandaugos: Generatorius = () => suBandymais(kurkSandauga, A_SANDAUGA, T6)

function kurkSandauga(): Uzdavinys | null {
  const a = atsitiktinis(2, 12)
  const b = atsitiktinis(2, 12)

  return variacija([
    // 1. Šaknis iš sandaugos
    () =>
      uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${sqrt(`${a * a} \\cdot ${b * b}`)}$.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: `$${sqrt(a * a)} \\cdot ${sqrt(b * b)} = ${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 2. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kaip traukiama šaknis iš sandaugos?',
        variantai: [
          'šaknis traukiama iš kiekvieno daugiklio atskirai',
          'šaknis traukiama tik iš pirmojo daugiklio',
          'daugikliai sudedami',
          'to daryti negalima',
        ],
        teisingas: 0,
        sprendimas: `$${sqrt('ab')} = ${sqrt('a')} \\cdot ${sqrt('b')}$, kai $a \\ge 0$ ir $b \\ge 0$.`,
      }),

    // 3. Šaknų sandauga
    () =>
      uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${sqrt(a * a)} \\cdot ${sqrt(b * b)}$.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 4. Kai atskirai neišsitraukia
    () => {
      const x = pasirink([2, 3, 5, 6, 8])
      const y = pasirink([2, 3, 5, 6, 8])
      const sandauga = x * y
      const saknis = Math.sqrt(sandauga)
      if (!Number.isInteger(saknis)) return null
      return uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${sqrt(x)} \\cdot ${sqrt(y)}$.`,
        atsakymas: String(saknis),
        atsakymasRodymui: `$${saknis}$`,
        sprendimas: `$${sqrt(x)} \\cdot ${sqrt(y)} = ${sqrt(sandauga)} = ${saknis}$ — atskirai nė viena šaknis neišsitraukia.`,
      })
    },

    // 5. Su nesutraukiamu pošakniu
    () => {
      const k = pasirink([2, 3, 5, 6, 7])
      return uzdavinys(T6, {
        klausimas: `Užrašyk paprasčiau: $${sqrt(a * a)} \\cdot ${sqrt(k)}$. Užrašyk koeficientą prieš šaknį.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}${sqrt(k)}$`,
        sprendimas: `$${sqrt(a * a)} = ${a}$, tad gaunama $${a}${sqrt(k)}$.`,
      })
    },

    // 6. Trys daugikliai
    () =>
      uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${sqrt(`4 \\cdot 9 \\cdot ${a * a}`)}$.`,
        atsakymas: String(6 * a),
        atsakymasRodymui: `$${6 * a}$`,
        sprendimas: `$2 \\cdot 3 \\cdot ${a} = ${6 * a}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Ar teisinga lygybė $${sqrt(`${a * a} + ${b * b}`)} = ${a} + ${b}$?`,
        variantai: [
          'ne, šaknies iš sumos taip skaidyti negalima',
          'taip',
          'taip, jei skaičiai teigiami',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Šaknis skaidoma tik sandaugai ir dalmeniui, bet ne sumai.',
      }),
  ])
}

// ── 1.7. Šaknis iš trupmenos ────────────────────────────────────────────────

const T7 = 'saknis-is-trupmenos'

const A_TRUPMENA = [
  {
    klausimas: 'Apskaičiuok: $\\sqrt{\\dfrac{9}{16}}$. Užrašyk atsakymą trupmena.',
    atsakymas: '3/4',
    atsakymasRodymui: '$\\dfrac{3}{4}$',
    sprendimas: '$\\dfrac{\\sqrt{9}}{\\sqrt{16}} = \\dfrac{3}{4}$.',
  },
] as const

export const saknisIsTrupmenos: Generatorius = () => suBandymais(kurkTrupmena, A_TRUPMENA, T7)

function kurkTrupmena(): Uzdavinys | null {
  const a = atsitiktinis(2, 12)
  const b = atsitiktinis(2, 12)
  if (a >= b) return null

  return variacija([
    // 1. Šaknis iš trupmenos
    () =>
      uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${sqrt(`\\dfrac{${a * a}}{${b * b}}`)}$. Atsakymą užrašyk trupmena.`,
        atsakymas: `${a}/${b}`,
        atsakymasRodymui: `$\\dfrac{${a}}{${b}}$`,
        sprendimas: `$\\dfrac{${sqrt(a * a)}}{${sqrt(b * b)}} = \\dfrac{${a}}{${b}}$.`,
      }),

    // 2. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kaip traukiama šaknis iš trupmenos?',
        variantai: [
          'atskirai iš skaitiklio ir iš vardiklio',
          'tik iš skaitiklio',
          'tik iš vardiklio',
          'to daryti negalima',
        ],
        teisingas: 0,
        sprendimas: `$${sqrt('\\dfrac{a}{b}')} = \\dfrac{${sqrt('a')}}{${sqrt('b')}}$, kai $b > 0$.`,
      }),

    // 3. Šaknų dalmuo
    () =>
      uzdavinys(T7, {
        klausimas: `Apskaičiuok: $\\dfrac{${sqrt(a * a)}}{${sqrt(b * b)}}$. Atsakymą užrašyk trupmena.`,
        atsakymas: `${a}/${b}`,
        atsakymasRodymui: `$\\dfrac{${a}}{${b}}$`,
        sprendimas: `$\\dfrac{${a}}{${b}}$.`,
      }),

    // 4. Dešimtainė trupmena
    () =>
      uzdavinys(T7, {
        klausimas: 'Apskaičiuok: $\\sqrt{0{,}64}$.',
        atsakymas: '0.8',
        atsakymasRodymui: '$0{,}8$',
        sprendimas: '$0{,}64 = \\dfrac{64}{100}$, tad šaknis lygi $\\dfrac{8}{10} = 0{,}8$.',
      }),

    // 5. Kai dalmuo išsitraukia
    () => {
      const dalmuo = atsitiktinis(2, 8)
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok: $\\dfrac{${sqrt(dalmuo * dalmuo * b * b)}}{${sqrt(b * b)}}$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `$${sqrt(`\\dfrac{${dalmuo * dalmuo * b * b}}{${b * b}}`)} = ${sqrt(dalmuo * dalmuo)} = ${dalmuo}$.`,
      })
    },

    // 6. Mišrus pavyzdys
    () =>
      uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${sqrt(`\\dfrac{${a * a}}{${b * b}}`)} \\cdot ${b}$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$\\dfrac{${a}}{${b}} \\cdot ${b} = ${a}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ar teisinga lygybė $\\sqrt{\\dfrac{a}{b}} = \\dfrac{\\sqrt{a}}{\\sqrt{b}}$?',
        variantai: [
          'taip, kai $a \\ge 0$ ir $b > 0$',
          'ne, niekada',
          'taip, visada',
          'taip, tik kai $a = b$',
        ],
        teisingas: 0,
        sprendimas: 'Vardiklis negali būti nulis, o pošakniai turi būti neneigiami.',
      }),
  ])
}

// ── 1.8. Iškeliame prieš šaknies ženklą, įkeliame į pošaknį ─────────────────

const T8 = 'iskeliame-ikeliame'

const A_ISKELIMAS = [
  {
    klausimas: 'Iškelk daugiklį prieš šaknies ženklą: $\\sqrt{18}$. Užrašyk koeficientą.',
    atsakymas: '3',
    atsakymasRodymui: '$3\\sqrt{2}$',
    sprendimas: '$18 = 9 \\cdot 2$, tad $\\sqrt{18} = 3\\sqrt{2}$.',
  },
] as const

export const iskeliameIkeliame: Generatorius = () => suBandymais(kurkIskelima, A_ISKELIMAS, T8)

function kurkIskelima(): Uzdavinys | null {
  const k = atsitiktinis(2, 9)
  const likutis = pasirink([2, 3, 5, 6, 7, 10, 11, 13])
  const posaknis = k * k * likutis
  if (posaknis > 1000) return null

  return variacija([
    // 1. Iškėlimas
    () =>
      uzdavinys(T8, {
        klausimas: `Iškelk daugiklį prieš šaknies ženklą: $${sqrt(posaknis)}$. Užrašyk koeficientą.`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}${sqrt(likutis)}$`,
        sprendimas: `$${posaknis} = ${k * k} \\cdot ${likutis}$, tad $${sqrt(posaknis)} = ${k}${sqrt(likutis)}$.`,
      }),

    // 2. Koks lieka pošaknis
    () =>
      uzdavinys(T8, {
        klausimas: `Iškelk daugiklį prieš šaknies ženklą: $${sqrt(posaknis)}$. Koks lieka pošaknis?`,
        atsakymas: String(likutis),
        atsakymasRodymui: `$${likutis}$`,
        sprendimas: `$${posaknis} : ${k * k} = ${likutis}$.`,
      }),

    // 3. Įkėlimas
    () =>
      uzdavinys(T8, {
        klausimas: `Įkelk daugiklį į pošaknį: $${k}${sqrt(likutis)}$. Koks bus pošaknis?`,
        atsakymas: String(posaknis),
        atsakymasRodymui: `$${sqrt(posaknis)}$`,
        sprendimas: `$${k}^2 \\cdot ${likutis} = ${k * k} \\cdot ${likutis} = ${posaknis}$.`,
      }),

    // 4. Kaip iškeliama
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kaip iškeliamas daugiklis prieš šaknies ženklą?',
        variantai: [
          'pošaknis skaidomas į kvadrato ir likučio sandaugą, o iš kvadrato traukiama šaknis',
          'pošaknis dalijamas iš dviejų',
          'pošaknis keliamas kvadratu',
          'pošaknis dalijamas iš koeficiento',
        ],
        teisingas: 0,
        sprendimas: `$${sqrt(posaknis)} = ${sqrt(`${k * k} \\cdot ${likutis}`)} = ${k}${sqrt(likutis)}$.`,
      }),

    // 5. Didžiausias kvadratas
    () => {
      const kv = didziausiasKvadratas(posaknis)
      if (kv === 1) return null
      return uzdavinys(T8, {
        klausimas: `Koks didžiausias kvadratas dalija ${posaknis}?`,
        atsakymas: String(kv),
        atsakymasRodymui: `$${kv}$`,
        sprendimas: `Būtent iš jo ir traukiama šaknis iškeliant daugiklį: $${posaknis} : ${kv} = ${posaknis / kv}$.`,
      })
    },

    // 6. Kaip įkeliama
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kaip įkeliamas daugiklis į pošaknį?',
        variantai: [
          'daugiklis keliamas kvadratu ir dauginamas iš pošaknio',
          'daugiklis dauginamas iš pošaknio',
          'daugiklis pridedamas prie pošaknio',
          'daugiklis dalijamas iš pošaknio',
        ],
        teisingas: 0,
        sprendimas: `$${k}${sqrt(likutis)} = ${sqrt(`${k}^2 \\cdot ${likutis}`)} = ${sqrt(posaknis)}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T8, {
        klausimas: `Įkeldamas daugiklį mokinys užrašė $${k}${sqrt(likutis)} = ${sqrt(k * likutis)}$. Koks turi būti pošaknis?`,
        atsakymas: String(posaknis),
        atsakymasRodymui: `$${posaknis}$`,
        sprendimas: `Daugiklis keliamas kvadratu: $${k}^2 \\cdot ${likutis} = ${posaknis}$.`,
      }),
  ])
}

// ── 1.9. Skaitinių reiškinių su šaknimis pertvarkiai ────────────────────────

const T9 = 'skaitiniai-su-saknimis'

const A_SKAITINIAI = [
  {
    klausimas: 'Apskaičiuok: $\\sqrt{8} \\cdot \\sqrt{2}$.',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: '$\\sqrt{16} = 4$.',
  },
] as const

export const skaitiniaiSuSaknimis: Generatorius = () => suBandymais(kurkSkaitinius, A_SKAITINIAI, T9)

function kurkSkaitinius(): Uzdavinys | null {
  const n = atsitiktinis(2, 12)
  const posaknis = pasirink([2, 3, 5, 6, 7])

  return variacija([
    // 1. Šaknų sandauga, kuri išsitraukia
    () => {
      const k = atsitiktinis(2, 9)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${sqrt(k * posaknis)} \\cdot ${sqrt(k * posaknis)}$.`,
        atsakymas: String(k * posaknis),
        atsakymasRodymui: `$${k * posaknis}$`,
        sprendimas: 'Šaknis, padauginta pati iš savęs, duoda pošaknį.',
      })
    },

    // 2. Šaknies kvadratas
    () =>
      uzdavinys(T9, {
        klausimas: `Apskaičiuok: $\\left(${sqrt(posaknis)}\\right)^2$.`,
        atsakymas: String(posaknis),
        atsakymasRodymui: `$${posaknis}$`,
        sprendimas: 'Kėlimas kvadratu panaikina šaknį, kai pošaknis neneigiamas.',
      }),

    // 3. Sandauga su iškėlimu
    () => {
      const a = atsitiktinis(2, 6)
      const b = atsitiktinis(2, 6)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${a}${sqrt(posaknis)} \\cdot ${b}${sqrt(posaknis)}$.`,
        atsakymas: String(a * b * posaknis),
        atsakymasRodymui: `$${a * b * posaknis}$`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$, o $${sqrt(posaknis)} \\cdot ${sqrt(posaknis)} = ${posaknis}$: gaunama $${a * b * posaknis}$.`,
      })
    },

    // 4. Sumos ir skirtumo sandauga
    () =>
      uzdavinys(T9, {
        klausimas: `Apskaičiuok: $\\left(${sqrt(posaknis)} + 1\\right)\\left(${sqrt(posaknis)} - 1\\right)$.`,
        atsakymas: String(posaknis - 1),
        atsakymasRodymui: `$${posaknis - 1}$`,
        sprendimas: `Pagal formulę $(a+b)(a-b) = a^2 - b^2$: $${posaknis} - 1 = ${posaknis - 1}$.`,
      }),

    // 5. Dalmuo
    () => {
      const k = atsitiktinis(2, 9)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $\\dfrac{${sqrt(k * k * posaknis)}}{${sqrt(posaknis)}}$.`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `$${sqrt(`\\dfrac{${k * k * posaknis}}{${posaknis}}`)} = ${sqrt(k * k)} = ${k}$.`,
      })
    },

    // 6. Su sudėtimi
    () => {
      const kvadratas = n * n
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${sqrt(kvadratas)} + ${sqrt(9)}$.`,
        atsakymas: String(n + 3),
        atsakymasRodymui: `$${n + 3}$`,
        sprendimas: `$${n} + 3 = ${n + 3}$.`,
      })
    },

    // 7. Veiksmų tvarka
    () => {
      const kvadratas = n * n
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $2 \\cdot ${sqrt(kvadratas)} - ${sqrt(16)}$.`,
        atsakymas: String(2 * n - 4),
        atsakymasRodymui: `$${2 * n - 4}$`,
        sprendimas: `$2 \\cdot ${n} - 4 = ${2 * n - 4}$.`,
      })
    },
  ])
}

// ── 1.10. Raidinių reiškinių su šaknimis pertvarkiai ────────────────────────

const T10 = 'raidiniai-su-saknimis'

const A_RAIDINIAI = [
  {
    klausimas: 'Užrašyk paprasčiau: $\\sqrt{a^2}$, kai $a \\ge 0$.',
    atsakymas: 'a',
    atsakymasRodymui: '$a$',
    sprendimas: 'Neneigiamam $a$ šaknis iš kvadrato lygi pačiam skaičiui.',
  },
] as const

export const raidiniaiSuSaknimis: Generatorius = () => suBandymais(kurkRaidinius, A_RAIDINIAI, T10)

function kurkRaidinius(): Uzdavinys | null {
  const k = atsitiktinis(2, 9)
  const a = atsitiktinis(2, 12)
  const b = atsitiktinis(2, 12)

  return variacija([
    // 1. Šaknis iš kvadrato
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kam lygu $${sqrt('a^2')}$, kai $a \\ge 0$?`,
        variantai: ['$a$', '$a^2$', '$2a$', '$\\dfrac{a}{2}$'],
        teisingas: 0,
        sprendimas: 'Kai $a$ neneigiamas, šaknis iš kvadrato lygi pačiam skaičiui.',
      }),

    // 2. Su koeficientu
    () =>
      uzdavinys(T10, {
        klausimas: `Užrašyk paprasčiau: $${sqrt(`${k * k}a^2`)}$, kai $a \\ge 0$. Užrašyk koeficientą prieš $a$.`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}a$`,
        sprendimas: `$${sqrt(k * k)} \\cdot ${sqrt('a^2')} = ${k}a$.`,
      }),

    // 3. Panašių narių sutraukimas
    () =>
      uzdavinys(T10, {
        klausimas: `Sutrauk: $${a}${sqrt('a')} + ${b}${sqrt('a')}$. Užrašyk koeficientą prieš šaknį.`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}${sqrt('a')}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$.`,
      }),

    // 4. Šaknis iš sandaugos su raide
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kam lygu $${sqrt('4a^2b^2')}$, kai $a \\ge 0$ ir $b \\ge 0$?`,
        variantai: ['$2ab$', '$4ab$', '$2a^2b^2$', '$ab$'],
        teisingas: 0,
        sprendimas: 'Šaknis traukiama iš kiekvieno daugiklio atskirai.',
      }),

    // 5. Kodėl reikia sąlygos
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kodėl užrašant $${sqrt('a^2')} = a$ būtina sąlyga $a \\ge 0$?`,
        variantai: [
          'nes neigiamam $a$ šaknis duotų teigiamą skaičių, o ne patį $a$',
          'nes neigiamo skaičiaus kvadrato nėra',
          'nes šaknis visada neigiama',
          'ši sąlyga nebūtina',
        ],
        teisingas: 0,
        sprendimas: `Pavyzdžiui, $${sqrt('(-3)^2')} = ${sqrt(9)} = 3$, o ne $-3$.`,
      }),

    // 6. Reikšmės apskaičiavimas
    () => {
      const x = k * k
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok $${sqrt('x')} + ${a}$, kai $x = ${x}$.`,
        atsakymas: String(k + a),
        atsakymasRodymui: `$${k + a}$`,
        sprendimas: `$${sqrt(x)} + ${a} = ${k} + ${a} = ${k + a}$.`,
      })
    },

    // 7. Iškėlimas su raide
    () =>
      uzdavinys(T10, {
        klausimas: `Užrašyk paprasčiau: $${sqrt(`${k * k}x`)}$, kai $x \\ge 0$. Užrašyk koeficientą prieš šaknį.`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}${sqrt('x')}$`,
        sprendimas: `$${sqrt(k * k)} = ${k}$, o $${sqrt('x')}$ lieka po šaknimi.`,
      }),
  ])
}

// ── 2.1. Skaičių aibės ──────────────────────────────────────────────────────

const T11 = 'skaiciu-aibes-8'

const A_AIBES = [
  {
    klausimas: 'Kuria raide žymima natūraliųjų skaičių aibė?',
    atsakymas: 'N',
    atsakymasRodymui: '$\\mathbb{N}$',
    sprendimas: 'Sveikieji žymimi $\\mathbb{Z}$, racionalieji — $\\mathbb{Q}$.',
  },
] as const

export const skaiciuAibes8: Generatorius = () => suBandymais(kurkAibes, A_AIBES, T11)

function kurkAibes(): Uzdavinys | null {
  return variacija([
    // 1. Natūraliųjų žymuo
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kuria raide žymima natūraliųjų skaičių aibė?',
        variantai: ['$\\mathbb{N}$', '$\\mathbb{Z}$', '$\\mathbb{Q}$', '$\\mathbb{R}$'],
        teisingas: 0,
        sprendimas: 'Nuo lotyniško žodžio „naturalis“.',
      }),

    // 2. Sveikųjų žymuo
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kuria raide žymima sveikųjų skaičių aibė?',
        variantai: ['$\\mathbb{Z}$', '$\\mathbb{N}$', '$\\mathbb{Q}$', '$\\mathbb{R}$'],
        teisingas: 0,
        sprendimas: 'Nuo vokiško žodžio „Zahlen“.',
      }),

    // 3. Racionaliųjų žymuo
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kuria raide žymima racionaliųjų skaičių aibė?',
        variantai: ['$\\mathbb{Q}$', '$\\mathbb{N}$', '$\\mathbb{Z}$', '$\\mathbb{R}$'],
        teisingas: 0,
        sprendimas: 'Nuo žodžio „quotient“ — dalmuo.',
      }),

    // 4. Priklausymo ženklas
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Ką reiškia užrašas $5 \\in \\mathbb{N}$?',
        variantai: [
          'skaičius 5 priklauso natūraliųjų skaičių aibei',
          'skaičius 5 nepriklauso natūraliųjų skaičių aibei',
          'natūraliųjų skaičių aibė lygi 5',
          '5 yra aibės poaibis',
        ],
        teisingas: 0,
        sprendimas: 'Nepriklausymas žymimas $\\notin$.',
      }),

    // 5. Poros
    () =>
      poruUzdavinys(naujasId(T11), T11, {
        klausimas: 'Sujunk aibę su jos žymeniu.',
        poros: [
          { kaire: 'natūralieji', desine: '$\\mathbb{N}$' },
          { kaire: 'sveikieji', desine: '$\\mathbb{Z}$' },
          { kaire: 'racionalieji', desine: '$\\mathbb{Q}$' },
          { kaire: 'realieji', desine: '$\\mathbb{R}$' },
        ],
        sprendimas: 'Kiekviena aibė įeina į kitą kaip poaibis.',
      }),

    // 6. Kuriai aibei priklauso
    () => {
      const n = atsitiktinis(2, 20)
      return pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Kuriai siauriausiai aibei priklauso skaičius $-${n}$?`,
        variantai: ['sveikųjų', 'natūraliųjų', 'racionaliųjų', 'iracionaliųjų'],
        teisingas: 0,
        sprendimas: 'Neigiamas sveikasis skaičius nėra natūralusis.',
      })
    },

    // 7. Sąjunga ir sankirta
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Ką reiškia aibių sankirta?',
        variantai: [
          'elementus, priklausančius abiem aibėms',
          'visus abiejų aibių elementus',
          'elementus, priklausančius tik vienai aibei',
          'tuščią aibę',
        ],
        teisingas: 0,
        sprendimas: 'Sankirta žymima $\\cap$, sąjunga — $\\cup$.',
      }),
  ])
}

// ── 2.2. Skaičių aibės poaibis ──────────────────────────────────────────────

const T12 = 'aibes-poaibis'

const A_POAIBIS = [
  {
    klausimas: 'Ar natūraliųjų skaičių aibė yra sveikųjų skaičių aibės poaibis?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: 'Kiekvienas natūralusis skaičius yra ir sveikasis.',
  },
] as const

export const aibesPoaibis: Generatorius = () => suBandymais(kurkPoaibi, A_POAIBIS, T12)

function kurkPoaibi(): Uzdavinys | null {
  return variacija([
    // 1. N ⊂ Z
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ar natūraliųjų skaičių aibė yra sveikųjų skaičių aibės poaibis?',
        variantai: [
          'taip, nes kiekvienas natūralusis skaičius yra ir sveikasis',
          'ne',
          'taip, bet tik teigiamiems',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: '$\\mathbb{N} \\subset \\mathbb{Z}$.',
      }),

    // 2. Kas yra poaibis
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kada aibė $A$ vadinama aibės $B$ poaibiu?',
        variantai: [
          'kai kiekvienas $A$ elementas priklauso ir $B$',
          'kai $A$ ir $B$ neturi bendrų elementų',
          'kai $A$ didesnė už $B$',
          'kai $A$ ir $B$ lygios',
        ],
        teisingas: 0,
        sprendimas: 'Žymima $A \\subset B$.',
      }),

    // 3. Aibių grandinė
    () =>
      eiliskumoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Surikiuok aibes nuo siauriausios iki plačiausios.',
        teisingaEile: ['$\\mathbb{N}$', '$\\mathbb{Z}$', '$\\mathbb{Q}$', '$\\mathbb{R}$'],
        sprendimas: 'Kiekviena aibė yra kitos poaibis: $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$.',
      }),

    // 4. Ar Z ⊂ N
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ar sveikųjų skaičių aibė yra natūraliųjų skaičių aibės poaibis?',
        variantai: [
          'ne, nes neigiami sveikieji nėra natūralieji',
          'taip',
          'taip, jei skaičiai teigiami',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Poaibio sąryšis veikia tik viena kryptimi.',
      }),

    // 5. Lyginių skaičių poaibis
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ar lyginių natūraliųjų skaičių aibė yra natūraliųjų skaičių aibės poaibis?',
        variantai: ['taip', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Kiekvienas lyginis natūralusis skaičius yra natūralusis.',
      }),

    // 6. Tuščioji aibė
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kas yra tuščioji aibė?',
        variantai: [
          'aibė, neturinti nė vieno elemento',
          'aibė, turinti vieną elementą',
          'aibė, turinti nulį',
          'begalinė aibė',
        ],
        teisingas: 0,
        sprendimas: 'Ji žymima $\\varnothing$ ir yra kiekvienos aibės poaibis.',
      }),

    // 7. Sankirta
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kam lygi natūraliųjų ir neigiamų sveikųjų skaičių aibių sankirta?',
        variantai: ['tuščiajai aibei', 'natūraliųjų aibei', 'sveikųjų aibei', 'nuliui'],
        teisingas: 0,
        sprendimas: 'Bendrų elementų šios aibės neturi.',
      }),
  ])
}

// ── 2.3. Realieji skaičiai ──────────────────────────────────────────────────

const T13 = 'realieji-skaiciai'

const A_REALIEJI = [
  {
    klausimas: 'Iš kokių skaičių sudaryta realiųjų skaičių aibė?',
    atsakymas: 'racionaliuju ir iracionaliuju',
    atsakymasRodymui: 'Iš racionaliųjų ir iracionaliųjų',
    sprendimas: 'Kartu jie užpildo visą skaičių tiesę.',
  },
] as const

export const realiejiSkaiciai: Generatorius = () => suBandymais(kurkRealiuosius, A_REALIEJI, T13)

function kurkRealiuosius(): Uzdavinys | null {
  return variacija([
    // 1. Iš ko sudaryta
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Iš kokių skaičių sudaryta realiųjų skaičių aibė?',
        variantai: [
          'iš racionaliųjų ir iracionaliųjų',
          'tik iš racionaliųjų',
          'tik iš sveikųjų',
          'tik iš iracionaliųjų',
        ],
        teisingas: 0,
        sprendimas: 'Kartu jie užpildo visą skaičių tiesę be tarpų.',
      }),

    // 2. Skaičių tiesė
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Ką atitinka kiekvienas skaičių tiesės taškas?',
        variantai: [
          'vieną realųjį skaičių',
          'vieną sveikąjį skaičių',
          'vieną racionalųjį skaičių',
          'vieną natūralųjį skaičių',
        ],
        teisingas: 0,
        sprendimas: 'Todėl skaičių tiesė dar vadinama realiąja ašimi.',
      }),

    // 3. Ar π realusis
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Ar $\\pi$ yra realusis skaičius?',
        variantai: [
          'taip, nes visi iracionalieji skaičiai yra realieji',
          'ne, nes jis iracionalusis',
          'taip, nes jis racionalusis',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Realiųjų aibė apima ir racionaliuosius, ir iracionaliuosius skaičius.',
      }),

    // 4. Kuris nėra realusis
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Kuris iš šių reiškinių neturi realiosios reikšmės?`,
        variantai: [`$${sqrt(-4)}$`, `$${sqrt(4)}$`, `$${cbrt(-8)}$`, `$-${sqrt(9)}$`],
        teisingas: 0,
        sprendimas: 'Kvadratinės šaknies iš neigiamo skaičiaus realiųjų skaičių aibėje nėra.',
      }),

    // 5. Aibių grandinė
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Kuri aibė plačiausia?',
        variantai: ['$\\mathbb{R}$', '$\\mathbb{Q}$', '$\\mathbb{Z}$', '$\\mathbb{N}$'],
        teisingas: 0,
        sprendimas: '$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$.',
      }),

    // 6. Tarp dviejų racionaliųjų
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Kiek realiųjų skaičių yra tarp $1$ ir $2$?',
        variantai: ['be galo daug', 'nė vieno', 'vienas', 'dešimt'],
        teisingas: 0,
        sprendimas: 'Tarp bet kurių dviejų skirtingų realiųjų skaičių jų yra be galo daug.',
      }),

    // 7. Modulis
    () => {
      const n = atsitiktinis(2, 20)
      return uzdavinys(T13, {
        klausimas: `Apskaičiuok: $\\left|-${n}\\right|$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: 'Modulis rodo atstumą iki nulio, tad jis niekada nėra neigiamas.',
      })
    },
  ])
}

// ── 2.4. Veiksmai su realiaisiais skaičiais ─────────────────────────────────

const T14 = 'veiksmai-su-realiaisiais'

const A_VEIKSMAI = [
  {
    klausimas: 'Koks skaičius gaunamas sudėjus du racionaliuosius skaičius?',
    atsakymas: 'racionalusis',
    atsakymasRodymui: 'Racionalusis',
    sprendimas: 'Racionaliųjų skaičių aibė uždara sudėties atžvilgiu.',
  },
] as const

export const veiksmaiSuRealiaisiais: Generatorius = () => suBandymais(kurkVeiksmus, A_VEIKSMAI, T14)

function kurkVeiksmus(): Uzdavinys | null {
  const posaknis = pasirink([2, 3, 5, 7])
  const a = atsitiktinis(2, 12)

  return variacija([
    // 1. Racionaliųjų suma
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Koks skaičius gaunamas sudėjus du racionaliuosius skaičius?',
        variantai: ['racionalusis', 'iracionalusis', 'natūralusis', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Dviejų trupmenų suma vėl yra trupmena.',
      }),

    // 2. Racionalusis plius iracionalusis
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: `Koks skaičius yra $${a} + ${sqrt(posaknis)}$?`,
        variantai: ['iracionalusis', 'racionalusis', 'sveikasis', 'natūralusis'],
        teisingas: 0,
        sprendimas: 'Prie racionaliojo pridėjus iracionalųjį rezultatas lieka iracionalusis.',
      }),

    // 3. Dviejų iracionaliųjų suma
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: `Koks skaičius yra $${sqrt(posaknis)} + \\left(-${sqrt(posaknis)}\\right)$?`,
        variantai: ['racionalusis, lygus nuliui', 'iracionalusis', 'neapibrėžtas', 'neigiamas'],
        teisingas: 0,
        sprendimas: 'Dviejų iracionaliųjų suma gali būti ir racionali.',
      }),

    // 4. Sandauga
    () =>
      uzdavinys(T14, {
        klausimas: `Apskaičiuok: $${sqrt(posaknis)} \\cdot ${sqrt(posaknis)}$.`,
        atsakymas: String(posaknis),
        atsakymasRodymui: `$${posaknis}$`,
        sprendimas: 'Šaknis, padauginta pati iš savęs, duoda pošaknį — racionalųjį skaičių.',
      }),

    // 5. Veiksmų savybės
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Ar realiesiems skaičiams galioja sudėties perstatomumo dėsnis?',
        variantai: [
          'taip, visiems realiesiems skaičiams',
          'ne, tik sveikiesiems',
          'ne, tik teigiamiems',
          'ne, tik racionaliesiems',
        ],
        teisingas: 0,
        sprendimas: 'Visi aritmetikos dėsniai galioja visoje realiųjų skaičių aibėje.',
      }),

    // 6. Dalyba iš nulio
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kuris veiksmas su realiaisiais skaičiais neapibrėžtas?',
        variantai: [
          'dalyba iš nulio',
          'daugyba iš nulio',
          'neigiamo skaičiaus kėlimas kubu',
          'kubinės šaknies traukimas iš neigiamo skaičiaus',
        ],
        teisingas: 0,
        sprendimas: 'Visi kiti išvardyti veiksmai apibrėžti.',
      }),

    // 7. Reiškinio reikšmė
    () => {
      const k = atsitiktinis(2, 9)
      return uzdavinys(T14, {
        klausimas: `Apskaičiuok: $\\left(${sqrt(posaknis)}\\right)^2 + ${sqrt(k * k)}$.`,
        atsakymas: String(posaknis + k),
        atsakymasRodymui: `$${posaknis + k}$`,
        sprendimas: `$${posaknis} + ${k} = ${posaknis + k}$.`,
      })
    },
  ])
}
