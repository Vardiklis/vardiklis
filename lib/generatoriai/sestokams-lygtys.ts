import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys } from './formatai'
import { VARDAI } from './ketvirtokams-bendra'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 6 klasės tema „Reiškiniai. Lygtys“ — septynios potemės.
 *
 * Šeštoje klasėje reiškiniuose ir lygtyse atsiranda neigiami koeficientai, o
 * lygtyse — nežinomasis abiejose pusėse. Todėl paprastos ir sudėtingesnės
 * lygtys turi atskirus generatorius: pirmose užtenka vieno veiksmo, antrose
 * nariai pirma perkeliami į vieną pusę.
 */

const RAIDES = ['x', 'y', 'a', 'b', 'm', 'n'] as const

/** Skaičiaus užrašas po veiksmo ženklo: neigiamas rašomas skliaustuose. */
function sk(n: number): string {
  return n < 0 ? `(${n})` : String(n)
}

/** Nario su raide užrašas: 1x → x, −1x → −x. */
function narys(k: number, r: string): string {
  if (k === 1) return r
  if (k === -1) return `-${r}`
  return `${k}${r}`
}

/**
 * Reiškinio „a + b“ tekstas, kai `b` gali būti neigiamas.
 *
 * Tiesiogiai įrašius neigiamą dėmenį gautųsi „3x + -8“ — mokinys tokio užrašo
 * niekur nemato, o atsakymo eilutėje toks ženklų dubliavimas neatitiktų to,
 * ką jis įveda. Todėl neigiamas dėmuo virsta atimtimi.
 */
function plius(a: string, b: number): string {
  return b < 0 ? `${a} - ${-b}` : `${a} + ${b}`
}

/** Reiškinio „a − b“ tekstas, kai `b` gali būti neigiamas. */
function minus(a: string | number, b: number): string {
  return b < 0 ? `${a} + ${-b}` : `${a} - ${b}`
}

/** Atsakymo eilutė „kx ± c“ be tarpų — tokia, kokią mokinys ir įveda. */
function atsSuLaisvuoju(k: number, r: string, c: number): string {
  return c < 0 ? `${narys(k, r)}-${-c}` : `${narys(k, r)}+${c}`
}

// ── 8.1.1. Raidinio reiškinio koeficientas ──────────────────────────────────

const T1 = 'raidinio-koeficientas'

const A_KOEFICIENTAS = [
  {
    klausimas: 'Koks yra reiškinio $-7x$ koeficientas?',
    atsakymas: '-7',
    atsakymasRodymui: '$-7$',
    sprendimas: 'Koeficientas yra skaitinis daugiklis prie raidės.',
  },
] as const

export const raidinioKoeficientas: Generatorius = () => suBandymais(kurkKoeficienta, A_KOEFICIENTAS, T1)

function kurkKoeficienta(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const k = atsitiktinis(2, 15)

  return variacija([
    // 1. Neigiamas koeficientas
    () =>
      uzdavinys(T1, {
        klausimas: `Koks yra reiškinio $-${k}${r}$ koeficientas?`,
        atsakymas: String(-k),
        atsakymasRodymui: `$-${k}$`,
        sprendimas: 'Koeficientas yra skaitinis daugiklis prie raidės kartu su savo ženklu.',
      }),

    // 2. Koeficientas 1
    () =>
      uzdavinys(T1, {
        klausimas: `Koks yra reiškinio $${r}$ koeficientas?`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Vienetas prie raidės nerašomas, bet jis ten yra.',
      }),

    // 3. Koeficientas −1
    () =>
      uzdavinys(T1, {
        klausimas: `Koks yra reiškinio $-${r}$ koeficientas?`,
        atsakymas: '-1',
        atsakymasRodymui: '$-1$',
        sprendimas: 'Minusas prieš raidę reiškia daugybą iš $-1$.',
      }),

    // 4. Kas yra koeficientas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kas vadinama raidinio reiškinio koeficientu?',
        variantai: [
          'skaitinis daugiklis prie raidės',
          'raidė reiškinyje',
          'reiškinio reikšmė',
          'raidžių skaičius',
        ],
        teisingas: 0,
        sprendimas: `Reiškinyje $${k}${r}$ koeficientas yra $${k}$.`,
      }),

    // 5. Koeficientas sandaugoje
    () => {
      const m = atsitiktinis(2, 6)
      return uzdavinys(T1, {
        klausimas: `Užrašyk paprasčiau ir nurodyk koeficientą: $${k} \\cdot ${m}${r}$.`,
        atsakymas: String(k * m),
        atsakymasRodymui: `$${k * m}${r}$, koeficientas $${k * m}$`,
        sprendimas: `Skaitiniai daugikliai sudauginami: $${k} \\cdot ${m} = ${k * m}$.`,
      })
    },

    // 6. Koeficientas su trupmena
    () =>
      uzdavinys(T1, {
        klausimas: `Koks yra reiškinio $\\dfrac{${r}}{${k}}$ koeficientas?`,
        atsakymas: `1/${k}`,
        atsakymasRodymui: `$\\dfrac{1}{${k}}$`,
        sprendimas: `Dalyba iš ${k} yra tas pat, kas daugyba iš $\\dfrac{1}{${k}}$.`,
      }),

    // 7. Koeficientas su dviem raidėmis
    () => {
      const m = atsitiktinis(2, 8)
      return uzdavinys(T1, {
        klausimas: `Užrašyk paprasčiau: $${k}a \\cdot ${m}b$. Koks gauto reiškinio koeficientas?`,
        atsakymas: String(k * m),
        atsakymasRodymui: `$${k * m}ab$, koeficientas $${k * m}$`,
        sprendimas: `$${k} \\cdot ${m} = ${k * m}$, o raidės rašomos greta.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: `Mokinys teigia, kad reiškinio $-${r}$ koeficientas yra $0$. Užrašyk teisingą koeficientą.`,
        atsakymas: '-1',
        atsakymasRodymui: '$-1$',
        sprendimas: 'Nulinis koeficientas panaikintų visą narį, o čia raidė lieka.',
      }),
  ])
}

// ── 8.1.2. Panašiųjų narių sutraukimas ──────────────────────────────────────

const T2 = 'panasiuju-sutraukimas-6'

const A_SUTRAUKIMAS = [
  {
    klausimas: 'Sutrauk panašiuosius narius: $5x - 8x$.',
    atsakymas: '-3x',
    atsakymasRodymui: '$-3x$',
    sprendimas: 'Sudedami koeficientai: $5 - 8 = -3$.',
  },
] as const

export const panasiujuSutraukimas6: Generatorius = () => suBandymais(kurkSutraukima, A_SUTRAUKIMAS, T2)

function kurkSutraukima(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const a = atsitiktinis(2, 12)
  const b = atsitiktinis(2, 12)
  const c = atsitiktinis(2, 15)

  return variacija([
    // 1. Neigiamas rezultatas
    () => {
      if (a >= b) return null
      return uzdavinys(T2, {
        klausimas: `Sutrauk panašiuosius narius: $${a}${r} - ${b}${r}$.`,
        atsakymas: narys(a - b, r),
        atsakymasRodymui: `$${narys(a - b, r)}$`,
        sprendimas: `Sudedami koeficientai: $${a} - ${b} = ${a - b}$.`,
      })
    },

    // 2. Su neigiamu pirmuoju nariu
    () =>
      uzdavinys(T2, {
        klausimas: `Sutrauk: $-${a}${r} + ${b}${r}$.`,
        atsakymas: narys(b - a, r),
        atsakymasRodymui: `$${narys(b - a, r)}$`,
        sprendimas: `$-${a} + ${b} = ${b - a}$.`,
      }),

    // 3. Su laisvuoju nariu
    () =>
      uzdavinys(T2, {
        klausimas: `Supaprastink: $${a}${r} - ${c} - ${b}${r}$.`,
        atsakymas: `${narys(a - b, r)}-${c}`,
        atsakymasRodymui: `$${narys(a - b, r)} - ${c}$`,
        sprendimas: `Nariai su raide: $${a} - ${b} = ${a - b}$; laisvasis narys $-${c}$ lieka.`,
      }),

    // 4. Kurie nariai panašūs
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kurie nariai yra panašūs: $${a}x$, $-${c}$, $-${b}x$, $${a}y$?`,
        variantai: [`$${a}x$ ir $-${b}x$`, `$${a}x$ ir $${a}y$`, `$-${c}$ ir $${a}x$`, 'visi keturi'],
        teisingas: 0,
        sprendimas: 'Panašūs nariai turi tą pačią raidinę dalį.',
      }),

    // 5. Keturi nariai
    () => {
      const d = atsitiktinis(2, 10)
      return uzdavinys(T2, {
        klausimas: `Sutrauk: $-${a}${r} + ${c} + ${b}${r} - ${d}$.`,
        atsakymas: atsSuLaisvuoju(b - a, r, c - d),
        atsakymasRodymui: `$${narys(b - a, r)} ${c - d < 0 ? '-' : '+'} ${Math.abs(c - d)}$`,
        sprendimas: `Nariai su raide: $-${a} + ${b} = ${b - a}$; skaičiai: $${c} - ${d} = ${c - d}$.`,
      })
    },

    // 6. Su dviem raidėmis
    () => {
      const d = atsitiktinis(2, 9)
      const e = atsitiktinis(2, 9)
      if (d === e) return null
      return uzdavinys(T2, {
        klausimas: `Supaprastink: $${a}a - ${d}b - ${b}a + ${e}b$.`,
        atsakymas: e - d < 0 ? `${narys(a - b, 'a')}-${narys(-(e - d), 'b')}` : `${narys(a - b, 'a')}+${narys(e - d, 'b')}`,
        atsakymasRodymui: `$${narys(a - b, 'a')} ${e - d < 0 ? '-' : '+'} ${narys(Math.abs(e - d), 'b')}$`,
        sprendimas: `Atskirai su $a$: $${a} - ${b} = ${a - b}$; su $b$: $-${d} + ${e} = ${e - d}$.`,
      })
    },

    // 7. Reikšmė po sutraukimo
    () => {
      const x = -atsitiktinis(2, 8)
      if (a === b) return null
      return uzdavinys(T2, {
        klausimas: `Sutrauk panašiuosius narius ir rask reikšmę: $${a}${r} - ${b}${r} + ${c}$, kai $${r} = ${x}$.`,
        atsakymas: String((a - b) * x + c),
        atsakymasRodymui: `$${(a - b) * x + c}$`,
        sprendimas: `Sutraukus: $${narys(a - b, r)} + ${c}$. Įrašius: $${a - b} \\cdot ${sk(x)} + ${c} = ${(a - b) * x + c}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Mokinys $${a}${r} - ${c}$ sutraukė į $${narys(a - c, r)}$. Šio reiškinio sutraukti negalima — užrašyk jį nepakeistą.`,
        atsakymas: `${a}${r}-${c}`,
        atsakymasRodymui: `$${a}${r} - ${c}$`,
        sprendimas: `$${a}${r}$ ir $${c}$ nėra panašūs nariai: vienas su raide, kitas be jos.`,
      }),
  ])
}

// ── 8.1.3. Atskliautimas ────────────────────────────────────────────────────

const T3 = 'atskliautimas'

const A_ATSKLIAUTIMAS = [
  {
    klausimas: 'Užrašyk be skliaustų: $-(3x - 5)$.',
    atsakymas: '-3x+5',
    atsakymasRodymui: '$-3x + 5$',
    sprendimas: 'Minusas prieš skliaustus keičia visų narių ženklus.',
  },
] as const

export const atskliautimas: Generatorius = () => suBandymais(kurkAtskliautima, A_ATSKLIAUTIMAS, T3)

function kurkAtskliautima(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(2, 12)
  const k = atsitiktinis(2, 8)

  return variacija([
    // 1. Minusas prieš skliaustus
    () =>
      uzdavinys(T3, {
        klausimas: `Užrašyk be skliaustų: $-(${a}${r} - ${b})$.`,
        atsakymas: `-${a}${r}+${b}`,
        atsakymasRodymui: `$-${a}${r} + ${b}$`,
        sprendimas: 'Minusas prieš skliaustus pakeičia kiekvieno nario ženklą.',
      }),

    // 2. Pliusas prieš skliaustus
    () =>
      uzdavinys(T3, {
        klausimas: `Užrašyk be skliaustų: $${b} + (${a}${r} - ${k})$.`,
        atsakymas: atsSuLaisvuoju(a, r, b - k),
        atsakymasRodymui: `$${a}${r} ${b - k < 0 ? '-' : '+'} ${Math.abs(b - k)}$`,
        sprendimas: `Pliusas ženklų nekeičia: $${b} + ${a}${r} - ${k} = ${a}${r} ${b - k < 0 ? '-' : '+'} ${Math.abs(b - k)}$.`,
      }),

    // 3. Neigiamas daugiklis
    () =>
      uzdavinys(T3, {
        klausimas: `Užrašyk be skliaustų: $-${k}(${r} + ${b})$.`,
        atsakymas: `-${k}${r}-${k * b}`,
        atsakymasRodymui: `$-${k}${r} - ${k * b}$`,
        sprendimas: `Kiekvienas narys dauginamas iš $-${k}$.`,
      }),

    // 4. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kas atsitinka skliaustų nariams, kai prieš skliaustus yra minusas?',
        variantai: [
          'kiekvieno nario ženklas pasikeičia priešingu',
          'ženklas pasikeičia tik pirmajam nariui',
          'ženklai nesikeičia',
          'nariai sudedami',
        ],
        teisingas: 0,
        sprendimas: `$-(a - b) = -a + b$.`,
      }),

    // 5. Atskliautimas su sutraukimu
    () =>
      uzdavinys(T3, {
        klausimas: `Supaprastink: $${k}${r} - (${a}${r} - ${b})$.`,
        atsakymas: `${narys(k - a, r)}+${b}`,
        atsakymasRodymui: `$${narys(k - a, r)} + ${b}$`,
        sprendimas: `Atskleidus: $${k}${r} - ${a}${r} + ${b}$; sutraukus: $${narys(k - a, r)} + ${b}$.`,
      }),

    // 6. Du skliaustai
    () => {
      const c = atsitiktinis(2, 9)
      return uzdavinys(T3, {
        klausimas: `Supaprastink: $(${a}${r} + ${b}) - (${c}${r} - ${k})$.`,
        atsakymas: `${narys(a - c, r)}+${b + k}`,
        atsakymasRodymui: `$${narys(a - c, r)} + ${b + k}$`,
        sprendimas: `Antrųjų skliaustų nariai keičia ženklus: $${a}${r} + ${b} - ${c}${r} + ${k}$.`,
      })
    },

    // 7. Bendrojo dauginamojo iškėlimas
    () =>
      uzdavinys(T3, {
        klausimas: `Iškelk bendrą dauginamąjį: $-${k}${r} - ${k * b}$.`,
        atsakymas: `-${k}(${r}+${b})`,
        atsakymasRodymui: `$-${k}(${r} + ${b})$`,
        sprendimas: `Abu nariai dalūs iš $-${k}$: iškėlus lieka $${r} + ${b}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: `Mokinys užrašė $-(${a}${r} - ${b}) = -${a}${r} - ${b}$. Užrašyk teisingą reiškinį.`,
        atsakymas: `-${a}${r}+${b}`,
        atsakymasRodymui: `$-${a}${r} + ${b}$`,
        sprendimas: 'Ženklą turi pakeisti abu nariai, ne tik pirmasis.',
      }),
  ])
}

// ── 8.2.1. Sprendžiame paprastas lygtis ─────────────────────────────────────

const T4 = 'paprastos-lygtys-6'

const A_PAPRASTOS = [
  {
    klausimas: 'Išspręsk: $x + 12 = 5$.',
    atsakymas: '-7',
    atsakymasRodymui: '$x = -7$',
    sprendimas: '$5 - 12 = -7$.',
  },
] as const

export const paprastosLygtys6: Generatorius = () => suBandymais(kurkPaprastas, A_PAPRASTOS, T4)

function kurkPaprastas(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const x = atsitiktinis(-15, 15)
  if (x === 0) return null
  const n = atsitiktinis(3, 25)
  const k = atsitiktinis(2, 9)

  return variacija([
    // 1. Nežinomas dėmuo, neigiamas sprendinys
    () =>
      uzdavinys(T4, {
        klausimas: `Išspręsk: $${r} + ${n} = ${x + n}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `$${x + n} - ${n} = ${x}$.`,
      }),

    // 2. Nežinomas daugiklis
    () =>
      uzdavinys(T4, {
        klausimas: `Išspręsk: $${k}${r} = ${k * x}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `$${k * x} : ${k} = ${x}$.`,
      }),

    // 3. Neigiamas koeficientas
    () =>
      uzdavinys(T4, {
        klausimas: `Išspręsk: $-${k}${r} = ${k * x}$.`,
        atsakymas: String(-x),
        atsakymasRodymui: `$${r} = ${-x}$`,
        sprendimas: `$${k * x} : (-${k}) = ${-x}$.`,
      }),

    // 4. Nežinomas atėminys
    () =>
      uzdavinys(T4, {
        klausimas: `Išspręsk: $${n} - ${r} = ${n - x}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `$${minus(n, n - x)} = ${x}$.`,
      }),

    // 5. Su dalyba
    () =>
      uzdavinys(T4, {
        klausimas: `Išspręsk: $\\dfrac{${r}}{${k}} = ${x}$.`,
        atsakymas: String(k * x),
        atsakymasRodymui: `$${r} = ${k * x}$`,
        sprendimas: `$${x} \\cdot ${k} = ${k * x}$.`,
      }),

    // 6. Patikra
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Ar $${r} = ${x}$ yra lygties $${r} + ${n} = ${x + n}$ sprendinys?`,
        variantai: ['taip, nes įrašius gaunama teisinga lygybė', 'ne', 'to patikrinti neįmanoma'],
        teisingas: 0,
        sprendimas: `$${sk(x)} + ${n} = ${x + n}$.`,
      }),

    // 7. Su nuliu
    () =>
      uzdavinys(T4, {
        klausimas: `Išspręsk: $${k}${r} = 0$.`,
        atsakymas: '0',
        atsakymasRodymui: `$${r} = 0$`,
        sprendimas: `Sandauga lygi nuliui tik tada, kai vienas daugiklis lygus nuliui, o $${k} \\ne 0$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Spręsdamas $-${k}${r} = ${k * x}$ mokinys gavo $${r} = ${x}$. Užrašyk teisingą sprendinį.`,
        atsakymas: String(-x),
        atsakymasRodymui: `$${-x}$`,
        sprendimas: `Dalijant iš neigiamo koeficiento ženklas pasikeičia: $${k * x} : (-${k}) = ${-x}$.`,
      }),
  ])
}

// ── 8.2.2. Sprendžiame sudėtingesnes lygtis ─────────────────────────────────

const T5 = 'sudetingesnes-lygtys'

const A_SUDETINGESNES = [
  {
    klausimas: 'Išspręsk: $5x - 3 = 2x + 9$.',
    atsakymas: '4',
    atsakymasRodymui: '$x = 4$',
    sprendimas: 'Nariai su nežinomuoju perkeliami į kairę: $3x = 12$.',
  },
] as const

export const sudetingesnesLygtys: Generatorius = () => suBandymais(kurkSudetingesnes, A_SUDETINGESNES, T5)

function kurkSudetingesnes(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const x = atsitiktinis(-9, 12)
  if (x === 0) return null
  const a = atsitiktinis(3, 9)
  const b = atsitiktinis(2, a - 1)
  const c = atsitiktinis(2, 20)

  return variacija([
    // 1. Nežinomasis abiejose pusėse
    () => {
      const kaire = a * x - c
      return uzdavinys(T5, {
        klausimas: `Išspręsk: $${a}${r} - ${c} = ${plius(`${b}${r}`, kaire - b * x)}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `Perkėlus: $${a - b}${r} = ${c + (kaire - b * x)}$, tad $${r} = ${x}$.`,
      })
    },

    // 2. Du veiksmai
    () =>
      uzdavinys(T5, {
        klausimas: `Išspręsk: $${a}${r} + ${c} = ${a * x + c}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `$${a * x + c} - ${c} = ${a * x}$, tada $${a * x} : ${a} = ${x}$.`,
      }),

    // 3. Su neigiamu koeficientu
    () =>
      uzdavinys(T5, {
        klausimas: `Išspręsk: $${c} - ${a}${r} = ${c - a * x}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `$${minus(c, c - a * x)} = ${a * x}$, tada $${a * x} : ${a} = ${x}$.`,
      }),

    // 4. Kur perkelti narius
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kas atsitinka nario ženklui, perkeliant jį iš vienos lygties pusės į kitą?',
        variantai: [
          'ženklas pasikeičia priešingu',
          'ženklas nesikeičia',
          'narys padvigubėja',
          'narys tampa nuliu',
        ],
        teisingas: 0,
        sprendimas: 'Perkėlimas yra tas pat, kas iš abiejų pusių atimti tą patį narį.',
      }),

    // 5. Sutraukimas prieš sprendimą
    () => {
      const d = atsitiktinis(2, 5)
      return uzdavinys(T5, {
        klausimas: `Išspręsk: $${a}${r} + ${d}${r} = ${(a + d) * x}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `Sutraukus: $${a + d}${r} = ${(a + d) * x}$, tad $${r} = ${x}$.`,
      })
    },

    // 6. Patikra
    () =>
      uzdavinys(T5, {
        klausimas: `Išspręsk ir patikrink: $${a}${r} - ${c} = ${a * x - c}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `$${a * x - c} + ${c} = ${a * x}$, $${a * x} : ${a} = ${x}$. Patikra: $${a} \\cdot ${sk(x)} - ${c} = ${a * x - c}$.`,
      }),

    // 7. Kiek sprendinių
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kiek sprendinių turi lygtis $${a}${r} = ${a}${r} + ${c}$?`,
        variantai: ['nė vieno', 'vieną', 'du', 'be galo daug'],
        teisingas: 0,
        sprendimas: `Perkėlus gaunama $0 = ${c}$ — neteisinga lygybė, tad sprendinių nėra.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Perkeldamas narį $-${c}$ į dešinę pusę mokinys ženklo nepakeitė. Išspręsk teisingai: $${a}${r} - ${c} = ${a * x - c}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `Perkeliant ženklas keičiasi: $${a}${r} = ${a * x - c} + ${c} = ${a * x}$.`,
      }),
  ])
}

// ── 8.2.3. Sprendžiame lygtis su skliaustais ────────────────────────────────

const T6 = 'lygtys-su-skliaustais'

const A_SKLIAUSTAI = [
  {
    klausimas: 'Išspręsk: $3(x + 4) = 21$.',
    atsakymas: '3',
    atsakymasRodymui: '$x = 3$',
    sprendimas: '$21 : 3 = 7$, tada $7 - 4 = 3$.',
  },
] as const

export const lygtysSuSkliaustais: Generatorius = () => suBandymais(kurkSuSkliaustais, A_SKLIAUSTAI, T6)

function kurkSuSkliaustais(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const x = atsitiktinis(-8, 12)
  if (x === 0) return null
  const k = atsitiktinis(2, 8)
  const n = atsitiktinis(2, 12)

  return variacija([
    // 1. Vienas skliaustas
    () =>
      uzdavinys(T6, {
        klausimas: `Išspręsk: $${k}(${r} + ${n}) = ${k * (x + n)}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `$${k * (x + n)} : ${k} = ${x + n}$, tada $${x + n} - ${n} = ${x}$.`,
      }),

    // 2. Su atskliautimu
    () =>
      uzdavinys(T6, {
        klausimas: `Išspręsk atskliaudamas: $${k}(${r} - ${n}) = ${k * (x - n)}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `Atskleidus: $${k}${r} - ${k * n} = ${k * (x - n)}$, tad $${k}${r} = ${k * x}$ ir $${r} = ${x}$.`,
      }),

    // 3. Neigiamas daugiklis prieš skliaustus
    () =>
      uzdavinys(T6, {
        klausimas: `Išspręsk: $-${k}(${r} + ${n}) = ${-k * (x + n)}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `$${-k * (x + n)} : (-${k}) = ${x + n}$, tada $${x + n} - ${n} = ${x}$.`,
      }),

    // 4. Skliaustai abiejose pusėse
    () => {
      const m = atsitiktinis(1, k - 1)
      if (m === k) return null
      const desine = m * (x + n)
      return uzdavinys(T6, {
        klausimas: `Išspręsk: $${k}(${r} + ${n}) = ${plius(`${m}(${r} + ${n})`, k * (x + n) - desine)}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `Perkėlus: $${k - m}(${r} + ${n}) = ${k * (x + n) - desine}$, tad $${r} + ${n} = ${x + n}$.`,
      })
    },

    // 5. Kuris žingsnis pirmas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Kaip patogiausia pradėti spręsti lygtį $${k}(${r} + ${n}) = ${k * (x + n)}$?`,
        variantai: [
          'padalyti abi puses iš daugiklio prieš skliaustus',
          'iš karto atimti $${n}$',
          'padauginti abi puses iš daugiklio',
          'atmesti skliaustus nekeičiant nieko',
        ],
        teisingas: 0,
        sprendimas: 'Padalijus iš daugiklio skliaustai lieka vieni ir lygtis tampa paprasta.',
      }),

    // 6. Su dviem skliaustais
    () => {
      const m = atsitiktinis(2, 5)
      const p = atsitiktinis(2, 8)
      const desine = k * (x + n) - m * (x - p)
      return uzdavinys(T6, {
        klausimas: `Išspręsk: $${k}(${r} + ${n}) - ${m}(${r} - ${p}) = ${desine}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `Atskleidus ir sutraukus gaunama $${k - m}${r} + ${k * n + m * p} = ${desine}$.`,
      })
    },

    // 7. Patikra
    () =>
      uzdavinys(T6, {
        klausimas: `Išspręsk ir patikrink: $${k}(${r} - ${n}) = ${k * (x - n)}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `Patikra: $${k}(${sk(x)} - ${n}) = ${k} \\cdot ${sk(x - n)} = ${k * (x - n)}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: `Spręsdamas $${k}(${r} + ${n}) = ${k * (x + n)}$ mokinys iš dešinės pusės iš karto atėmė ${n}. Užrašyk teisingą sprendinį.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `Pirmiausia dalijama iš ${k}, nes skliaustai dauginami visi: $${k * (x + n)} : ${k} = ${x + n}$.`,
      }),
  ])
}

// ── 8.2.4. Tekstinių uždavinių sprendimas sudarant lygtis ───────────────────

const T7 = 'tekstiniai-lygtys-6'

const A_TEKSTINIAI = [
  {
    klausimas: 'Skaičių padidinus 3 kartus ir pridėjus 8 gaunama 32. Sudaryk lygtį ir rask skaičių.',
    atsakymas: '8',
    atsakymasRodymui: '$3x + 8 = 32$, $x = 8$',
    sprendimas: '$32 - 8 = 24$, $24 : 3 = 8$.',
  },
] as const

export const tekstiniaiLygtys6: Generatorius = () => suBandymais(kurkTekstinius, A_TEKSTINIAI, T7)

function kurkTekstinius(): Uzdavinys | null {
  const x = atsitiktinis(3, 25)
  const k = atsitiktinis(2, 8)
  const n = atsitiktinis(3, 20)

  return variacija([
    // 1. Padidinus kartų ir pridėjus
    () =>
      uzdavinys(T7, {
        klausimas: `Skaičių padidinus ${k} kartus ir pridėjus ${n} gaunama ${k * x + n}. Sudaryk lygtį ir rask skaičių.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${k}x + ${n} = ${k * x + n}$, $x = ${x}$`,
        sprendimas: `$${k * x + n} - ${n} = ${k * x}$, $${k * x} : ${k} = ${x}$.`,
      }),

    // 2. Du skaičiai, žinoma suma
    () => {
      const skirtumas = atsitiktinis(2, 15)
      return uzdavinys(T7, {
        klausimas: `Vienas skaičius ${skirtumas} didesnis už kitą, o jų suma ${2 * x + skirtumas}. Sudaryk lygtį ir rask mažesnįjį skaičių.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x + (x + ${skirtumas}) = ${2 * x + skirtumas}$, $x = ${x}$`,
        sprendimas: `$${2 * x + skirtumas} - ${skirtumas} = ${2 * x}$, $${2 * x} : 2 = ${x}$.`,
      })
    },

    // 3. Kartų daugiau
    () => {
      const kartai = atsitiktinis(2, 5)
      return uzdavinys(T7, {
        klausimas: `Viename inde ${kartai} kartus daugiau vandens nei kitame, o iš viso ${(kartai + 1) * x} litrai. Kiek litrų mažesniajame inde?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x + ${kartai}x = ${(kartai + 1) * x}$, $x = ${x}$`,
        sprendimas: `$${(kartai + 1) * x} : ${kartai + 1} = ${x}$.`,
      })
    },

    // 4. Bilietai su mokesčiu
    () =>
      uzdavinys(T7, {
        klausimas: `${k} vienodi bilietai ir ${n} Eur mokestis kainuoja ${k * x + n} Eur. Kiek kainuoja vienas bilietas?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${k}x + ${n} = ${k * x + n}$, $x = ${x}$ Eur`,
        sprendimas: `$${k * x + n} - ${n} = ${k * x}$, $${k * x} : ${k} = ${x}$.`,
      }),

    // 5. Stačiakampis
    () => {
      const plotis = atsitiktinis(3, 12)
      const skirtumas = atsitiktinis(2, 8)
      const perimetras = 2 * (2 * plotis + skirtumas)
      return uzdavinys(T7, {
        klausimas: `Stačiakampio ilgis ${skirtumas} cm didesnis už plotį, o perimetras ${perimetras} cm. Sudaryk lygtį ir rask plotį.`,
        atsakymas: String(plotis),
        atsakymasRodymui: `$2(x + x + ${skirtumas}) = ${perimetras}$, $x = ${plotis}$ cm`,
        sprendimas: `$${perimetras} : 2 = ${2 * plotis + skirtumas}$; $${2 * plotis + skirtumas} - ${skirtumas} = ${2 * plotis}$; $${2 * plotis} : 2 = ${plotis}$.`,
      })
    },

    // 6. Amžiai
    () => {
      const skirtumas = atsitiktinis(20, 32)
      const sunus = atsitiktinis(8, 16)
      return uzdavinys(T7, {
        klausimas: `Tėvas ${skirtumas} metais vyresnis už sūnų, o jų amžių suma ${2 * sunus + skirtumas}. Kiek metų sūnui?`,
        atsakymas: String(sunus),
        atsakymasRodymui: `$x + (x + ${skirtumas}) = ${2 * sunus + skirtumas}$, $x = ${sunus}$`,
        sprendimas: `$${2 * sunus + skirtumas} - ${skirtumas} = ${2 * sunus}$, $${2 * sunus} : 2 = ${sunus}$.`,
      })
    },

    // 7. Nežinomasis abiejose pusėse
    () => {
      const vardas = pasirink(VARDAI)
      const turi = atsitiktinis(2, 6)
      const kitas = turi + atsitiktinis(1, 4)
      const skirtumas = (kitas - turi) * x
      return uzdavinys(T7, {
        klausimas: `${vardas} nusipirko ${turi} vienodus sąsiuvinius, o draugas — ${kitas}. Draugas sumokėjo ${skirtumas} Eur daugiau. Kiek kainuoja vienas sąsiuvinis?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${kitas}x - ${turi}x = ${skirtumas}$, $x = ${x}$ Eur`,
        sprendimas: `$${kitas - turi}x = ${skirtumas}$, tad $x = ${x}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Uždaviniui „skaičių padidinus ${k} kartus ir pridėjus ${n} gaunama ${k * x + n}“ mokinys sudarė lygtį $${k} + x + ${n} = ${k * x + n}$. Kuri lygtis teisinga?`,
        variantai: [
          `$${k}x + ${n} = ${k * x + n}$`,
          `$${k} + x + ${n} = ${k * x + n}$`,
          `$x + ${k} \\cdot ${n} = ${k * x + n}$`,
          `$${k}(x + ${n}) = ${k * x + n}$`,
        ],
        teisingas: 0,
        sprendimas: 'Padidinti kartus reiškia padauginti, o ne pridėti.',
      }),
  ])
}
