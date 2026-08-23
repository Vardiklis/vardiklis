import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 6 klasės tema „Teigiamųjų ir neigiamųjų skaičių daugyba ir dalyba“ —
 * penkios potemės.
 *
 * Ženklų taisyklė čia svarbesnė už patį skaičiavimą, tad daugyba ir dalyba
 * su vienodais bei skirtingais ženklais turi atskirus generatorius, o
 * skaičiai laikomi nedideli — kitaip mokinys klystų dėl daugybos, o ne dėl
 * ženklo.
 */

/** Skaičiaus užrašas, kai jis gali stovėti po veiksmo ženklo. */
function sk(n: number): string {
  return n < 0 ? `(${n})` : String(n)
}

// ── 5.1.1. Dauginame ────────────────────────────────────────────────────────

const T1 = 'neigiamu-daugyba'

const A_DAUGYBA = [
  {
    klausimas: 'Apskaičiuok: $-6 \\cdot 7$.',
    atsakymas: '-42',
    atsakymasRodymui: '$-42$',
    sprendimas: 'Ženklai skirtingi, tad sandauga neigiama.',
  },
] as const

export const neigiamuDaugyba: Generatorius = () => suBandymais(kurkDaugyba, A_DAUGYBA, T1)

function kurkDaugyba(): Uzdavinys | null {
  const a = atsitiktinis(2, 12)
  const b = atsitiktinis(2, 12)

  return variacija([
    // 1. Neigiamas × teigiamas
    () =>
      uzdavinys(T1, {
        klausimas: `Apskaičiuok: $-${a} \\cdot ${b}$.`,
        atsakymas: String(-a * b),
        atsakymasRodymui: `$${-a * b}$`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$; ženklai skirtingi, tad sandauga neigiama.`,
      }),

    // 2. Neigiamas × neigiamas
    () =>
      uzdavinys(T1, {
        klausimas: `Apskaičiuok: $-${a} \\cdot (-${b})$.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: `Ženklai vienodi, tad sandauga teigiama: $${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 3. Ženklų taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Koks bus dviejų neigiamų skaičių sandaugos ženklas?',
        variantai: ['pliusas', 'minusas', 'priklauso nuo skaičių dydžio', 'sandauga lygi nuliui'],
        teisingas: 0,
        sprendimas: 'Vienodų ženklų sandauga visada teigiama.',
      }),

    // 4. Daugyba iš nulio
    () =>
      uzdavinys(T1, {
        klausimas: `Apskaičiuok: $-${a} \\cdot 0$.`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Bet kurio skaičiaus sandauga su nuliu lygi nuliui — nulis ženklo neturi.',
      }),

    // 5. Daugyba iš −1
    () =>
      uzdavinys(T1, {
        klausimas: `Apskaičiuok: $-1 \\cdot ${a}$.`,
        atsakymas: String(-a),
        atsakymasRodymui: `$${-a}$`,
        sprendimas: `Dauginant iš $-1$ gaunamas priešingas skaičius.`,
      }),

    // 6. Trijų daugiklių sandauga
    () => {
      const c = atsitiktinis(2, 5)
      return uzdavinys(T1, {
        klausimas: `Apskaičiuok: $-${a} \\cdot (-${b}) \\cdot (-${c})$.`,
        atsakymas: String(-a * b * c),
        atsakymasRodymui: `$${-a * b * c}$`,
        sprendimas: `Neigiamų daugiklių yra trys, t. y. nelyginis skaičius, tad sandauga neigiama: $-${a * b * c}$.`,
      })
    },

    // 7. Ženklas pagal minusų skaičių
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kada kelių daugiklių sandauga yra teigiama?',
        variantai: [
          'kai neigiamų daugiklių skaičius lyginis',
          'kai neigiamų daugiklių skaičius nelyginis',
          'kai daugiklių daugiau nei du',
          'kai visi daugikliai neigiami',
        ],
        teisingas: 0,
        sprendimas: 'Kiekviena neigiamų daugiklių pora duoda pliusą.',
      }),

    // 8. Trūkstamas daugiklis
    () =>
      uzdavinys(T1, {
        klausimas: `Rask trūkstamą daugiklį: $-${a} \\cdot \\square = ${a * b}$.`,
        atsakymas: String(-b),
        atsakymasRodymui: `$-${b}$`,
        sprendimas: `Sandauga teigiama, tad daugiklis turi būti neigiamas: $-${b}$.`,
      }),

    // 9. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: `Mokinys apskaičiavo $-${a} \\cdot (-${b}) = -${a * b}$. Užrašyk teisingą sandaugą.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: 'Du minusai duoda pliusą — sandauga teigiama.',
      }),
  ])
}

// ── 5.1.2. Dalijame ─────────────────────────────────────────────────────────

const T2 = 'neigiamu-dalyba'

const A_DALYBA = [
  {
    klausimas: 'Apskaičiuok: $-36 : 9$.',
    atsakymas: '-4',
    atsakymasRodymui: '$-4$',
    sprendimas: 'Ženklai skirtingi, tad dalmuo neigiamas.',
  },
] as const

export const neigiamuDalyba: Generatorius = () => suBandymais(kurkDalyba, A_DALYBA, T2)

function kurkDalyba(): Uzdavinys | null {
  const daliklis = atsitiktinis(2, 12)
  const dalmuo = atsitiktinis(2, 12)
  const dalinys = daliklis * dalmuo

  return variacija([
    // 1. Neigiamas : teigiamas
    () =>
      uzdavinys(T2, {
        klausimas: `Apskaičiuok: $-${dalinys} : ${daliklis}$.`,
        atsakymas: String(-dalmuo),
        atsakymasRodymui: `$${-dalmuo}$`,
        sprendimas: `$${dalinys} : ${daliklis} = ${dalmuo}$; ženklai skirtingi, tad dalmuo neigiamas.`,
      }),

    // 2. Neigiamas : neigiamas
    () =>
      uzdavinys(T2, {
        klausimas: `Apskaičiuok: $-${dalinys} : (-${daliklis})$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: 'Ženklai vienodi, tad dalmuo teigiamas.',
      }),

    // 3. Teigiamas : neigiamas
    () =>
      uzdavinys(T2, {
        klausimas: `Apskaičiuok: $${dalinys} : (-${daliklis})$.`,
        atsakymas: String(-dalmuo),
        atsakymasRodymui: `$${-dalmuo}$`,
        sprendimas: `Ženklai skirtingi: $-${dalmuo}$.`,
      }),

    // 4. Ženklų taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Koks bus dalmens ženklas, jei dalinys ir daliklis turi skirtingus ženklus?',
        variantai: ['minusas', 'pliusas', 'dalmuo lygus nuliui', 'priklauso nuo skaičių dydžio'],
        teisingas: 0,
        sprendimas: 'Dalybos ženklų taisyklė tokia pat kaip daugybos.',
      }),

    // 5. Nulis dalijamas
    () =>
      uzdavinys(T2, {
        klausimas: `Apskaičiuok: $0 : (-${daliklis})$.`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Nulis, padalytas iš bet kurio nelygaus nuliui skaičiaus, lygus nuliui.',
      }),

    // 6. Trūkstamas dalinys
    () =>
      uzdavinys(T2, {
        klausimas: `Rask trūkstamą dalinį: $\\square : (-${daliklis}) = ${dalmuo}$.`,
        atsakymas: String(-dalinys),
        atsakymasRodymui: `$-${dalinys}$`,
        sprendimas: `$${dalmuo} \\cdot (-${daliklis}) = -${dalinys}$.`,
      }),

    // 7. Dalyba iš nulio
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Iš kokio skaičiaus dalyti negalima?',
        variantai: ['iš nulio', 'iš neigiamo skaičiaus', 'iš vieneto', 'iš trupmenos'],
        teisingas: 0,
        sprendimas: 'Dalyba iš nulio neapibrėžta, ir tai negalioja jokiems ženklams.',
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Mokinys apskaičiavo $-${dalinys} : (-${daliklis}) = -${dalmuo}$. Užrašyk teisingą dalmenį.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: 'Kai abu skaičiai neigiami, dalmuo teigiamas.',
      }),
  ])
}

// ── 5.2.1. Dauginame ir dalijame ────────────────────────────────────────────

const T3 = 'neigiamu-daugyba-dalyba'

const A_ABU = [
  {
    klausimas: 'Apskaičiuok: $-4 \\cdot 6 : (-8)$.',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Veiksmai atliekami iš eilės: $-24 : (-8) = 3$.',
  },
] as const

export const neigiamuDaugybaDalyba: Generatorius = () => suBandymais(kurkAbu, A_ABU, T3)

function kurkAbu(): Uzdavinys | null {
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(2, 9)
  const c = atsitiktinis(2, 6)
  if ((a * b) % c !== 0) return null

  return variacija([
    // 1. Daugyba ir dalyba iš eilės
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok: $-${a} \\cdot ${b} : (-${c})$.`,
        atsakymas: String((a * b) / c),
        atsakymasRodymui: `$${(a * b) / c}$`,
        sprendimas: `$-${a} \\cdot ${b} = -${a * b}$, tada $-${a * b} : (-${c}) = ${(a * b) / c}$.`,
      }),

    // 2. Su vienu neigiamu
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${a} \\cdot (-${b}) : ${c}$.`,
        atsakymas: String(-(a * b) / c),
        atsakymasRodymui: `$${-(a * b) / c}$`,
        sprendimas: `Neigiamų daugiklių vienas, tad rezultatas neigiamas: $-${(a * b) / c}$.`,
      }),

    // 3. Ženklas be skaičiavimo
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Koks bus reiškinio $-${a} \\cdot (-${b}) : (-${c})$ ženklas?`,
        variantai: ['minusas', 'pliusas', 'rezultatas lygus nuliui', 'to nustatyti negalima'],
        teisingas: 0,
        sprendimas: 'Neigiamų skaičių yra trys — nelyginis skaičius, tad rezultatas neigiamas.',
      }),

    // 4. Kvadratas
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok: $(-${a}) \\cdot (-${a})$.`,
        atsakymas: String(a * a),
        atsakymasRodymui: `$${a * a}$`,
        sprendimas: 'Skaičiaus daugyba iš savęs visada duoda teigiamą rezultatą.',
      }),

    // 5. Poros
    () =>
      poruUzdavinys(naujasId(T3), T3, {
        klausimas: 'Sujunk reiškinį su jo ženklu.',
        poros: [
          { kaire: '$-3 \\cdot (-4)$', desine: 'teigiamas' },
          { kaire: '$-3 \\cdot 4$', desine: 'neigiamas' },
          { kaire: '$-12 : (-4)$', desine: 'teigiamas' },
          { kaire: '$12 : (-4)$', desine: 'neigiamas' },
        ],
        sprendimas: 'Vienodi ženklai duoda pliusą, skirtingi — minusą.',
      }),

    // 6. Trūkstamas narys
    () =>
      uzdavinys(T3, {
        klausimas: `Rask trūkstamą daugiklį: $-${a} \\cdot \\square : ${c} = ${-(a * b) / c}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$-${a} \\cdot ${b} = -${a * b}$, o $-${a * b} : ${c} = ${-(a * b) / c}$.`,
      }),

    // 7. Su skliaustais
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok: $(-${a} - ${b}) \\cdot (-${c})$.`,
        atsakymas: String((a + b) * c),
        atsakymasRodymui: `$${(a + b) * c}$`,
        sprendimas: `Skliaustuose $-${a} - ${b} = -${a + b}$, tada $-${a + b} \\cdot (-${c}) = ${(a + b) * c}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: `Mokinys apskaičiavo $-${a} \\cdot ${b} : (-${c}) = -${(a * b) / c}$. Užrašyk teisingą reikšmę.`,
        atsakymas: String((a * b) / c),
        atsakymasRodymui: `$${(a * b) / c}$`,
        sprendimas: 'Neigiamų skaičių yra du, tad rezultatas teigiamas.',
      }),
  ])
}

// ── 5.2.2. Taikome skirstomumo dėsnį ────────────────────────────────────────

const T4 = 'skirstomumo-desnis-6'

const A_SKIRSTOMUMAS = [
  {
    klausimas: 'Apskaičiuok patogiausiu būdu: $-5 \\cdot (20 + 3)$.',
    atsakymas: '-115',
    atsakymasRodymui: '$-115$',
    sprendimas: '$-5 \\cdot 20 + (-5) \\cdot 3 = -100 - 15 = -115$.',
  },
] as const

export const skirstomumoDesnis6: Generatorius = () => suBandymais(kurkSkirstomuma, A_SKIRSTOMUMAS, T4)

function kurkSkirstomuma(): Uzdavinys | null {
  const k = atsitiktinis(2, 9)
  const a = atsitiktinis(10, 40)
  const b = atsitiktinis(2, 9)

  return variacija([
    // 1. Atskleidimas su neigiamu daugikliu
    () =>
      uzdavinys(T4, {
        klausimas: `Apskaičiuok patogiausiu būdu: $-${k} \\cdot (${a} + ${b})$.`,
        atsakymas: String(-k * (a + b)),
        atsakymasRodymui: `$${-k * (a + b)}$`,
        sprendimas: `$-${k} \\cdot ${a} + (-${k}) \\cdot ${b} = -${k * a} - ${k * b} = ${-k * (a + b)}$.`,
      }),

    // 2. Su skirtumu
    () =>
      uzdavinys(T4, {
        klausimas: `Apskaičiuok patogiausiu būdu: $-${k} \\cdot (${a} - ${b})$.`,
        atsakymas: String(-k * (a - b)),
        atsakymasRodymui: `$${-k * (a - b)}$`,
        sprendimas: `$-${k} \\cdot ${a} + ${k} \\cdot ${b} = -${k * a} + ${k * b} = ${-k * (a - b)}$.`,
      }),

    // 3. Bendrojo dauginamojo iškėlimas
    () =>
      uzdavinys(T4, {
        klausimas: `Iškelk bendrą dauginamąjį ir apskaičiuok: $-${k} \\cdot ${a} - ${k} \\cdot ${b}$.`,
        atsakymas: String(-k * (a + b)),
        atsakymasRodymui: `$${-k * (a + b)}$`,
        sprendimas: `$-${k}(${a} + ${b}) = -${k} \\cdot ${a + b} = ${-k * (a + b)}$.`,
      }),

    // 4. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ką reiškia daugybos skirstomumo dėsnis?',
        variantai: [
          'daugiklis dauginamas iš kiekvieno skliaustų nario atskirai',
          'skliaustus galima tiesiog nubraukti',
          'daugiklis dauginamas tik iš pirmojo nario',
          'skliaustų nariai sudauginami tarpusavyje',
        ],
        teisingas: 0,
        sprendimas: `$a(b + c) = ab + ac$.`,
      }),

    // 5. Patogus skaičiavimas su apvaliu skaičiumi
    () => {
      const desimt = pasirink([10, 20, 100])
      const likutis = atsitiktinis(1, 9)
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok patogiausiu būdu: $-${k} \\cdot ${desimt - likutis}$.`,
        atsakymas: String(-k * (desimt - likutis)),
        atsakymasRodymui: `$${-k * (desimt - likutis)}$`,
        sprendimas: `$-${k} \\cdot (${desimt} - ${likutis}) = -${k * desimt} + ${k * likutis} = ${-k * (desimt - likutis)}$.`,
      })
    },

    // 6. Raidinis reiškinys
    () =>
      uzdavinys(T4, {
        klausimas: `Užrašyk be skliaustų: $-${k}(x + ${b})$.`,
        atsakymas: `-${k}x-${k * b}`,
        atsakymasRodymui: `$-${k}x - ${k * b}$`,
        sprendimas: `Neigiamas daugiklis pakeičia abiejų narių ženklus.`,
      }),

    // 7. Trūkstamas narys
    () =>
      uzdavinys(T4, {
        klausimas: `Rask trūkstamą skaičių: $-${k} \\cdot (${a} + \\square) = ${-k * (a + b)}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${-k * (a + b)} : (-${k}) = ${a + b}$, tada $${a + b} - ${a} = ${b}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Mokinys užrašė $-${k}(${a} - ${b}) = -${k * a} - ${k * b}$. Užrašyk teisingą reikšmę.`,
        atsakymas: String(-k * (a - b)),
        atsakymasRodymui: `$${-k * (a - b)}$`,
        sprendimas: `Antrojo nario ženklas turi pasikeisti į pliusą: $-${k * a} + ${k * b} = ${-k * (a - b)}$.`,
      }),
  ])
}

// ── 5.2.3. Skaičiuojame skaitinių reiškinių reikšmes ────────────────────────

const T5 = 'reiskiniu-reiksmes-6'

const A_REISKINIAI = [
  {
    klausimas: 'Apskaičiuok: $-3 + 4 \\cdot (-5)$.',
    atsakymas: '-23',
    atsakymasRodymui: '$-23$',
    sprendimas: 'Pirma daugyba: $4 \\cdot (-5) = -20$, tada $-3 - 20 = -23$.',
  },
] as const

export const reiskiniuReiksmes6: Generatorius = () => suBandymais(kurkReiskinius, A_REISKINIAI, T5)

function kurkReiskinius(): Uzdavinys | null {
  const a = atsitiktinis(2, 15)
  const b = atsitiktinis(2, 9)
  const c = atsitiktinis(2, 9)

  return variacija([
    // 1. Sudėtis ir daugyba
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $-${a} + ${b} \\cdot (-${c})$.`,
        atsakymas: String(-a - b * c),
        atsakymasRodymui: `$${-a - b * c}$`,
        sprendimas: `Pirma daugyba: $${b} \\cdot (-${c}) = -${b * c}$, tada $-${a} - ${b * c} = ${-a - b * c}$.`,
      }),

    // 2. Su skliaustais
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $(-${a} + ${b}) \\cdot (-${c})$.`,
        atsakymas: String((-a + b) * -c),
        atsakymasRodymui: `$${(-a + b) * -c}$`,
        sprendimas: `Skliaustuose $-${a} + ${b} = ${b - a}$, tada $${sk(b - a)} \\cdot (-${c}) = ${(-a + b) * -c}$.`,
      }),

    // 3. Su dalyba
    () => {
      const dalinys = b * c
      return uzdavinys(T5, {
        klausimas: `Apskaičiuok: $-${dalinys} : ${c} + ${a}$.`,
        atsakymas: String(-b + a),
        atsakymasRodymui: `$${-b + a}$`,
        sprendimas: `Pirma dalyba: $-${dalinys} : ${c} = -${b}$, tada $-${b} + ${a} = ${a - b}$.`,
      })
    },

    // 4. Veiksmų tvarka
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kuris veiksmas reiškinyje $-${a} + ${b} \\cdot (-${c})$ atliekamas pirmiausia?`,
        variantai: ['daugyba', 'sudėtis', 'bet kuris — tvarka nesvarbi', 'ženklo keitimas'],
        teisingas: 0,
        sprendimas: 'Daugyba ir dalyba visada atliekamos prieš sudėtį ir atimtį.',
      }),

    // 5. Du veiksmų lygiai
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $-${a} \\cdot ${b} + ${a} \\cdot ${c}$.`,
        atsakymas: String(a * (c - b)),
        atsakymasRodymui: `$${a * (c - b)}$`,
        sprendimas: `$-${a * b} + ${a * c} = ${a * (c - b)}$; patogiau iškelti $${a}$ prieš skliaustus.`,
      }),

    // 6. Kvadratas reiškinyje
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $(-${b}) \\cdot (-${b}) - ${a}$.`,
        atsakymas: String(b * b - a),
        atsakymasRodymui: `$${b * b - a}$`,
        sprendimas: `$(-${b}) \\cdot (-${b}) = ${b * b}$, tada $${b * b} - ${a} = ${b * b - a}$.`,
      }),

    // 7. Reikšmė su raide
    () => {
      const x = -atsitiktinis(2, 9)
      return uzdavinys(T5, {
        klausimas: `Apskaičiuok $${b}x + ${a}$, kai $x = ${x}$.`,
        atsakymas: String(b * x + a),
        atsakymasRodymui: `$${b * x + a}$`,
        sprendimas: `$${b} \\cdot ${sk(x)} + ${a} = ${b * x} + ${a} = ${b * x + a}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Mokinys apskaičiavo $-${a} + ${b} \\cdot (-${c}) = ${(-a + b) * -c}$ — pirma atliko sudėtį. Užrašyk teisingą reikšmę.`,
        atsakymas: String(-a - b * c),
        atsakymasRodymui: `$${-a - b * c}$`,
        sprendimas: 'Be skliaustų pirmiausia atliekama daugyba.',
      }),
  ])
}
