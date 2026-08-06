import {
  atsitiktinis,
  mbk,
  pasirink,
  suprastink,
  trupmenaTeX,
  type Trupmena,
} from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
import { vyresne } from './mastas'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Trupmenos: bendravardiklinimas, sudėtis, atimtis, daugyba, dalyba.
 *
 * Vardikliai imami iš kuruotų sąrašų, o ne atsitiktinai — kitaip gaunami
 * atsakymai tipo 37/91, kokių mokykloje nebūna (7.1).
 */

/** Vienas vardiklis dalus iš kito — bendravardiklinimas paprastas. */
const POROS_LENGVOS: readonly (readonly [number, number])[] = [
  [4, 4],
  [6, 6],
  [8, 8],
  [2, 4],
  [3, 6],
  [2, 6],
  [4, 8],
  [3, 9],
  [5, 10],
  [2, 10],
  [4, 12],
  [6, 12],
]

/** Kuruotas sąrašas iš specifikacijos — vardikliai su mažu MBK. */
const POROS_KURUOTOS: readonly (readonly [number, number])[] = [
  [2, 3],
  [3, 4],
  [4, 6],
  [2, 5],
  [3, 6],
  [5, 10],
  [4, 8],
  [6, 9],
]

const POROS_PLATESNES: readonly (readonly [number, number])[] = [
  ...POROS_KURUOTOS,
  [3, 5],
  [5, 6],
  [3, 8],
  [4, 10],
  [6, 8],
  [8, 12],
]

/**
 * 8–10 klasei — poros, kurių bendrą vardiklį jau reikia suskaičiuoti, bet
 * atsakymo vardiklis lieka ne didesnis nei 20 (7.1 reikalavimas tvarkingiems
 * atsakymams galioja ir vyresnėse klasėse).
 */
const POROS_SUNKIOS: readonly (readonly [number, number])[] = [
  ...POROS_PLATESNES,
  [3, 5],
  [4, 5],
  [3, 15],
  [5, 15],
  [4, 10],
  [4, 20],
  [5, 20],
  [2, 20],
  [10, 20],
  [5, 4],
]

const VARDIKLIAI = [2, 3, 4, 5, 6, 8, 9, 10, 12] as const
const VARDIKLIAI_SUNKUS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 20] as const

function ribaVardiklio(lygis: Lygis, klase?: number): number {
  const bazinis = lygis === 1 ? 10 : lygis === 2 ? 12 : 20
  // Vyresniems leidžiamas platesnis vardiklis, bet niekada virš 20 — kitaip
  // atsakymai nustoja būti mokykliniai.
  return vyresne(klase) ? 20 : bazinis
}

function tex(t: Trupmena): string {
  return `$${trupmenaTeX(t)}$`
}

function neapdorotas(t: Trupmena): string {
  return t.vardiklis === 1 ? String(t.skaitiklis) : `${t.skaitiklis}/${t.vardiklis}`
}

// ---------------------------------------------------------------------------
// Sudėtis ir atimtis
// ---------------------------------------------------------------------------

const ATSARGINIAI_SUDETIS = [
  {
    klausimas: 'Apskaičiuok ir suprastink: $\\dfrac{1}{2} + \\dfrac{1}{3}$',
    atsakymas: '5/6',
    atsakymasRodymui: '$\\dfrac{5}{6}$',
    sprendimas:
      'Bendras vardiklis — 6. $\\dfrac{3}{6} + \\dfrac{2}{6} = \\dfrac{5}{6}$.',
  },
  {
    klausimas: 'Apskaičiuok ir suprastink: $\\dfrac{3}{4} - \\dfrac{1}{2}$',
    atsakymas: '1/4',
    atsakymasRodymui: '$\\dfrac{1}{4}$',
    sprendimas: 'Bendras vardiklis — 4. $\\dfrac{3}{4} - \\dfrac{2}{4} = \\dfrac{1}{4}$.',
  },
] as const

export const trupmenuSudetis: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkSudeti(lygis, klase), ATSARGINIAI_SUDETIS, 'trupmenu-sudetis')

function kurkSudeti(lygis: Lygis, klase?: number): Uzdavinys | null {
  // 3 lygis — kombinuoti veiksmai: mišrusis skaičius ir trupmena.
  if (lygis === 3 && Math.random() < 0.45) return kurkMisru()

  const poros = vyresne(klase)
    ? POROS_SUNKIOS
    : lygis === 1
      ? POROS_LENGVOS
      : lygis === 2
        ? POROS_KURUOTOS
        : POROS_PLATESNES
  const riba = ribaVardiklio(lygis, klase)
  const [d1, d2] = pasirink(poros)

  let n1 = atsitiktinis(1, d1 - 1)
  let n2 = atsitiktinis(1, d2 - 1)
  const atimtis = Math.random() < 0.5

  if (atimtis) {
    // Rezultatas turi būti teigiamas — kitaip 6 klasei tai jau neigiami skaičiai.
    if (n1 * d2 === n2 * d1) return null
    if (n1 * d2 < n2 * d1) {
      ;[n1, n2] = [n2, n1]
      return kurkSudetiIsPoros(d2, d1, n1, n2, true, riba, lygis)
    }
  }

  return kurkSudetiIsPoros(d1, d2, n1, n2, atimtis, riba, lygis)
}

function kurkSudetiIsPoros(
  d1: number,
  d2: number,
  n1: number,
  n2: number,
  atimtis: boolean,
  riba: number,
  lygis: Lygis,
): Uzdavinys | null {
  if (n1 >= d1 || n2 >= d2) return null

  const rez = suprastink(atimtis ? n1 * d2 - n2 * d1 : n1 * d2 + n2 * d1, d1 * d2)
  if (rez.skaitiklis === 0) return null
  if (rez.vardiklis > riba) return null
  // Netaisyklinga trupmena leidžiama, bet ne didesnė nei 2.
  if (rez.skaitiklis > 2 * rez.vardiklis) return null
  // 1 lygyje rezultatas turi būti mažesnis už vienetą.
  if (lygis === 1 && rez.skaitiklis > rez.vardiklis) return null

  const zenklas = atimtis ? '-' : '+'
  const m = mbk(d1, d2)
  const a1 = (n1 * m) / d1
  const a2 = (n2 * m) / d2
  const s = atimtis ? a1 - a2 : a1 + a2

  return uzdavinys('trupmenu-sudetis', {
    klausimas: `Apskaičiuok ir suprastink: $\\dfrac{${n1}}{${d1}} ${zenklas} \\dfrac{${n2}}{${d2}}$`,
    atsakymas: neapdorotas(rez),
    atsakymasRodymui: tex(rez),
    sprendimas: `Bendras vardiklis — ${m}. $\\dfrac{${a1}}{${m}} ${zenklas} \\dfrac{${a2}}{${m}} = ${pabaiga(
      s,
      m,
      rez,
    )}$.`,
  })
}

/** Mišrusis skaičius KaTeX'u: `1\dfrac{1}{2}`. */
function misrusTeX(t: Trupmena): string {
  if (t.vardiklis === 1) return String(t.skaitiklis)
  if (Math.abs(t.skaitiklis) < t.vardiklis) return trupmenaTeX(t)
  const sveikas = Math.trunc(t.skaitiklis / t.vardiklis)
  const liekana = Math.abs(t.skaitiklis) % t.vardiklis
  if (liekana === 0) return String(sveikas)
  return `${sveikas}\\dfrac{${liekana}}{${t.vardiklis}}`
}

/** Mišrusis skaičius atėmus trupmeną — 3 lygio uždavinys. */
function kurkMisru(): Uzdavinys | null {
  const [d1, d2] = pasirink(POROS_KURUOTOS)
  const sveikas = atsitiktinis(1, 3)
  const n1 = atsitiktinis(1, d1 - 1)
  const n2 = atsitiktinis(1, d2 - 1)
  const atimtis = Math.random() < 0.6

  const m = mbk(d1, d2)
  const pilnasSkaitiklis = sveikas * d1 + n1
  const rez = suprastink(
    atimtis ? pilnasSkaitiklis * d2 - n2 * d1 : pilnasSkaitiklis * d2 + n2 * d1,
    d1 * d2,
  )
  if (rez.skaitiklis <= 0) return null
  if (rez.vardiklis > 20) return null
  if (rez.vardiklis === 1) return null // sveikas atsakymas per lengvas

  return uzdavinys('trupmenu-sudetis', {
    klausimas: `Apskaičiuok ir suprastink: $${sveikas}\\dfrac{${n1}}{${d1}} ${
      atimtis ? '-' : '+'
    } \\dfrac{${n2}}{${d2}}$`,
    atsakymas: neapdorotas(rez),
    atsakymasRodymui: `$${misrusTeX(rez)}$`,
    sprendimas: `Mišrųjį skaičių paverčiame netaisyklinga trupmena: $${sveikas}\\dfrac{${n1}}{${d1}} = \\dfrac{${pilnasSkaitiklis}}{${d1}}$. Bendras vardiklis — ${m}. Gauname $${misrusTeX(
      rez,
    )}$.`,
  })
}

/**
 * Paskutinis sprendimo žingsnis. Jei suprastinti nėra ko, pakartoto
 * „= tas pats" nerodom — tai atrodo kaip klaida.
 */
function pabaiga(skaitiklis: number, vardiklis: number, rez: Trupmena): string {
  const tarpinis = `\\dfrac{${skaitiklis}}{${vardiklis}}`
  if (skaitiklis === rez.skaitiklis && vardiklis === rez.vardiklis) return tarpinis
  return `${tarpinis} = ${trupmenaTeX(rez)}`
}

// ---------------------------------------------------------------------------
// Daugyba ir dalyba
// ---------------------------------------------------------------------------

const ATSARGINIAI_DAUGYBA = [
  {
    klausimas: 'Apskaičiuok ir suprastink: $\\dfrac{2}{3} \\cdot \\dfrac{3}{4}$',
    atsakymas: '1/2',
    atsakymasRodymui: '$\\dfrac{1}{2}$',
    sprendimas: '$\\dfrac{2 \\cdot 3}{3 \\cdot 4} = \\dfrac{6}{12} = \\dfrac{1}{2}$.',
  },
  {
    klausimas: 'Apskaičiuok ir suprastink: $\\dfrac{3}{4} : \\dfrac{1}{2}$',
    atsakymas: '3/2',
    atsakymasRodymui: '$\\dfrac{3}{2}$',
    sprendimas:
      'Dalyba — tai daugyba iš apversto daliklio: $\\dfrac{3}{4} \\cdot \\dfrac{2}{1} = \\dfrac{3}{2}$.',
  },
] as const

export const trupmenuDaugyba: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkDaugyba(lygis, klase), ATSARGINIAI_DAUGYBA, 'trupmenu-daugyba')

function kurkDaugyba(lygis: Lygis, klase?: number): Uzdavinys | null {
  const riba = ribaVardiklio(lygis, klase)
  const vardikliai = vyresne(klase) ? VARDIKLIAI_SUNKUS : VARDIKLIAI

  // 1 lygyje pusė uždavinių — trupmena kart sveikas skaičius.
  if (lygis === 1 && Math.random() < 0.5) {
    const d = pasirink(vardikliai)
    const n = atsitiktinis(1, d - 1)
    const k = atsitiktinis(2, 9)
    const rez = suprastink(n * k, d)
    if (rez.vardiklis > riba) return null
    if (rez.skaitiklis > 30) return null
    // 1 lygyje netaisyklingų trupmenų dar nerodom — tik sveikas arba mažiau už vienetą.
    if (rez.vardiklis !== 1 && rez.skaitiklis > rez.vardiklis) return null

    return uzdavinys('trupmenu-daugyba', {
      klausimas: `Apskaičiuok ir suprastink: $\\dfrac{${n}}{${d}} \\cdot ${k}$`,
      atsakymas: neapdorotas(rez),
      atsakymasRodymui: tex(rez),
      sprendimas: `$\\dfrac{${n} \\cdot ${k}}{${d}} = ${pabaiga(n * k, d, rez)}$.`,
    })
  }

  const d1 = pasirink(vardikliai)
  const d2 = pasirink(vardikliai)
  const n1 = atsitiktinis(1, d1 - 1)
  const n2 = atsitiktinis(1, d2 - 1)
  const dalyba = lygis >= 2 && Math.random() < 0.45

  const rez = dalyba ? suprastink(n1 * d2, d1 * n2) : suprastink(n1 * n2, d1 * d2)
  if (rez.vardiklis > riba) return null
  if (rez.skaitiklis > 4 * rez.vardiklis) return null
  // Atmetam uždavinius, kur atsakymas sutampa su vienu iš dauginamųjų.
  if (rez.skaitiklis === n1 && rez.vardiklis === d1) return null
  if (!dalyba && rez.vardiklis === 1 && rez.skaitiklis === 1) return null

  const zenklas = dalyba ? ':' : '\\cdot'
  const sprendimas = dalyba
    ? `Dalyba — tai daugyba iš apversto daliklio: $\\dfrac{${n1}}{${d1}} \\cdot \\dfrac{${d2}}{${n2}} = ${pabaiga(
        n1 * d2,
        d1 * n2,
        rez,
      )}$.`
    : `$\\dfrac{${n1} \\cdot ${n2}}{${d1} \\cdot ${d2}} = ${pabaiga(n1 * n2, d1 * d2, rez)}$.`

  return uzdavinys('trupmenu-daugyba', {
    klausimas: `Apskaičiuok ir suprastink: $\\dfrac{${n1}}{${d1}} ${zenklas} \\dfrac{${n2}}{${d2}}$`,
    atsakymas: neapdorotas(rez),
    atsakymasRodymui: tex(rez),
    sprendimas,
  })
}

// ---------------------------------------------------------------------------
// Bendravardiklinimas — atskira tema, nes tai yra ta vieta, kur dažniausiai lūžta
// ---------------------------------------------------------------------------

const ATSARGINIAI_BENDRAVARDIKLINIMAS = [
  {
    klausimas:
      'Koks mažiausias bendrasis vardiklis trupmenoms $\\dfrac{1}{4}$ ir $\\dfrac{1}{6}$?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '12 dalijasi ir iš 4, ir iš 6, o mažesnio tokio skaičiaus nėra.',
  },
  {
    klausimas: 'Užrašyk trupmeną $\\dfrac{2}{3}$ vardikliu 12. Koks bus skaitiklis?',
    atsakymas: '8',
    atsakymasRodymui: '$8$',
    sprendimas: 'Vardiklis padidėjo 4 kartus, tad ir skaitiklis: $2 \\cdot 4 = 8$.',
  },
] as const

export const bendravardiklinimas: Generatorius = (lygis, klase) =>
  suBandymais(
    () => kurkBendravardiklinima(lygis, klase),
    ATSARGINIAI_BENDRAVARDIKLINIMAS,
    'bendravardiklinimas',
  )

/**
 * Poros vien bendrajam vardikliui ieškoti. Čia atsakymas yra sveikas MBK, tad
 * vardikliai gali būti didesni nei tie, kuriuos leidžia tvarkingo atsakymo
 * taisyklė sudėčiai.
 */
const POROS_MBK: readonly (readonly [number, number])[] = [
  [7, 9],
  [8, 12],
  [9, 15],
  [10, 14],
  [12, 18],
  [11, 6],
  [14, 21],
  [15, 20],
  [16, 24],
  [13, 5],
]

function kurkBendravardiklinima(lygis: Lygis, klase?: number): Uzdavinys | null {
  if (lygis === 1) {
    // Mažiausias bendrasis vardiklis.
    const [d1, d2] = pasirink(vyresne(klase) ? POROS_MBK : POROS_KURUOTOS)
    if (d1 === d2) return null
    const m = mbk(d1, d2)
    if (m > (vyresne(klase) ? 120 : 36)) return null
    const n1 = atsitiktinis(1, d1 - 1)
    const n2 = atsitiktinis(1, d2 - 1)

    return uzdavinys('bendravardiklinimas', {
      klausimas: `Koks mažiausias bendrasis vardiklis trupmenoms $\\dfrac{${n1}}{${d1}}$ ir $\\dfrac{${n2}}{${d2}}$?`,
      atsakymas: String(m),
      atsakymasRodymui: `$${m}$`,
      sprendimas: `${m} dalijasi ir iš ${d1}, ir iš ${d2}, o mažesnio tokio skaičiaus nėra.`,
    })
  }

  if (lygis === 2) {
    // Trupmenos plėtimas iki nurodyto vardiklio.
    const d = vyresne(klase)
      ? pasirink([2, 3, 4, 5, 6, 7, 8, 9, 10, 12] as const)
      : pasirink([2, 3, 4, 5, 6, 8] as const)
    const k = atsitiktinis(2, vyresne(klase) ? 9 : 5)
    const naujas = d * k
    if (naujas > (vyresne(klase) ? 90 : 24)) return null
    const n = atsitiktinis(1, d - 1)

    return uzdavinys('bendravardiklinimas', {
      klausimas: `Užrašyk trupmeną $\\dfrac{${n}}{${d}}$ vardikliu ${naujas}. Koks bus skaitiklis?`,
      atsakymas: String(n * k),
      atsakymasRodymui: `$${n * k}$`,
      sprendimas: `Vardiklis padidėjo ${k} kartus, tad ir skaitiklis: $${n} \\cdot ${k} = ${
        n * k
      }$.`,
    })
  }

  // 3 lygis — palyginimas, kuriam bendravardiklinti būtina.
  const [d1, d2] = pasirink(vyresne(klase) ? POROS_SUNKIOS : POROS_PLATESNES)
  if (d1 === d2) return null
  const n1 = atsitiktinis(1, d1 - 1)
  const n2 = atsitiktinis(1, d2 - 1)
  const kaire = n1 * d2
  const desine = n2 * d1
  if (kaire === desine) return null
  // Per didelis skirtumas — atsakymą galima atspėti nebendravardiklinus.
  if (Math.abs(kaire - desine) > d1 * d2 * 0.25) return null

  const didesne = kaire > desine ? { skaitiklis: n1, vardiklis: d1 } : { skaitiklis: n2, vardiklis: d2 }
  const m = mbk(d1, d2)

  return uzdavinys('bendravardiklinimas', {
    klausimas: `Kuri trupmena didesnė: $\\dfrac{${n1}}{${d1}}$ ar $\\dfrac{${n2}}{${d2}}$? Įrašyk didesniąją.`,
    atsakymas: neapdorotas(didesne),
    atsakymasRodymui: tex(didesne),
    sprendimas: `Suvedus į vardiklį ${m}: $\\dfrac{${(n1 * m) / d1}}{${m}}$ ir $\\dfrac{${
      (n2 * m) / d2
    }}{${m}}$.`,
  })
}
