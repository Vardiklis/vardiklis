import { atsitiktinis, pasirink, suprastink, trupmenaTeX } from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Geometrija: perimetras, plotas ir tūris, kampai, Pitagoro teorema,
 * apskritimas, trigonometrija.
 *
 * Nė vienam uždaviniui nereikia brėžinio — sąlyga aprašoma žodžiais, o
 * atsakymas visada sveikas arba tvarkinga trupmena.
 */

/** Pitagoro trejetai — visos trys kraštinės sveikos, tad atsakymai lieka gražūs. */
const TREJETAI: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
  [7, 24, 25],
  [15, 20, 25],
  [10, 24, 26],
  [20, 21, 29],
  [18, 24, 30],
  [16, 30, 34],
  [21, 28, 35],
  [12, 35, 37],
]

// ── Perimetras ──────────────────────────────────────────────────────────────

const A_PERIMETRAS = [
  {
    klausimas: 'Stačiakampio kraštinės 5 cm ir 8 cm. Koks jo perimetras?',
    atsakymas: '26',
    atsakymasRodymui: '$26$ cm',
    sprendimas: '$P = 2 \\cdot (5 + 8) = 26$ cm.',
  },
] as const

export const perimetras: Generatorius = (lygis) =>
  suBandymais(() => kurkPerimetra(lygis), A_PERIMETRAS, 'perimetras')

function kurkPerimetra(lygis: Lygis): Uzdavinys | null {
  const a = atsitiktinis(2, lygis === 1 ? 12 : 25)
  const b = atsitiktinis(2, lygis === 1 ? 12 : 25)

  if (lygis === 1) {
    if (a === b) return null
    const p = 2 * (a + b)
    return uzdavinys('perimetras', {
      klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Koks jo perimetras?`,
      atsakymas: String(p),
      atsakymasRodymui: `$${p}$ cm`,
      sprendimas: `$P = 2 \\cdot (${a} + ${b}) = ${p}$ cm.`,
    })
  }

  if (lygis === 2) {
    // Atvirkštinis: žinomas perimetras ir viena kraštinė.
    if (a === b) return null
    const p = 2 * (a + b)
    return uzdavinys('perimetras', {
      klausimas: `Stačiakampio perimetras ${p} cm, viena kraštinė ${a} cm. Kokia kita kraštinė?`,
      atsakymas: String(b),
      atsakymasRodymui: `$${b}$ cm`,
      sprendimas: `Pusė perimetro yra $${p} : 2 = ${a + b}$ cm, tad kita kraštinė $${
        a + b
      } - ${a} = ${b}$ cm.`,
    })
  }

  // 3 lygis — kvadratas iš duoto perimetro.
  const krastine = atsitiktinis(3, 40)
  const p = 4 * krastine
  return uzdavinys('perimetras', {
    klausimas: `Kvadrato perimetras ${p} cm. Kokia jo kraštinė?`,
    atsakymas: String(krastine),
    atsakymasRodymui: `$${krastine}$ cm`,
    sprendimas: `Kvadratas turi keturias lygias kraštines: $${p} : 4 = ${krastine}$ cm.`,
  })
}

// ── Plotas ir tūris ─────────────────────────────────────────────────────────

const A_PLOTAS = [
  {
    klausimas: 'Stačiakampio kraštinės 6 cm ir 4 cm. Koks jo plotas?',
    atsakymas: '24',
    atsakymasRodymui: '$24$ cm²',
    sprendimas: '$S = 6 \\cdot 4 = 24$ cm².',
  },
] as const

export const plotasTuris: Generatorius = (lygis) =>
  suBandymais(() => kurkPlota(lygis), A_PLOTAS, 'plotas-turis')

function kurkPlota(lygis: Lygis): Uzdavinys | null {
  if (lygis === 1) {
    const a = atsitiktinis(2, 15)
    const b = atsitiktinis(2, 15)
    return uzdavinys('plotas-turis', {
      klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Koks jo plotas?`,
      atsakymas: String(a * b),
      atsakymasRodymui: `$${a * b}$ cm²`,
      sprendimas: `$S = ${a} \\cdot ${b} = ${a * b}$ cm².`,
    })
  }

  if (lygis === 2) {
    // Stačiakampio gretasienio tūris.
    const a = atsitiktinis(2, 8)
    const b = atsitiktinis(2, 8)
    const c = atsitiktinis(2, 8)
    return uzdavinys('plotas-turis', {
      klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm. Koks jo tūris?`,
      atsakymas: String(a * b * c),
      atsakymasRodymui: `$${a * b * c}$ cm³`,
      sprendimas: `$V = ${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$ cm³.`,
    })
  }

  // 3 lygis — trikampio plotas arba atvirkštinis stačiakampio uždavinys.
  if (Math.random() < 0.5) {
    const pagrindas = atsitiktinis(2, 20) * 2 // porinis, kad plotas būtų sveikas
    const auksis = atsitiktinis(2, 15)
    const plotas = (pagrindas * auksis) / 2
    return uzdavinys('plotas-turis', {
      klausimas: `Trikampio pagrindas ${pagrindas} cm, aukštinė ${auksis} cm. Koks jo plotas?`,
      atsakymas: String(plotas),
      atsakymasRodymui: `$${plotas}$ cm²`,
      sprendimas: `$S = \\dfrac{${pagrindas} \\cdot ${auksis}}{2} = ${plotas}$ cm².`,
    })
  }

  const a = atsitiktinis(2, 15)
  const b = atsitiktinis(2, 15)
  return uzdavinys('plotas-turis', {
    klausimas: `Stačiakampio plotas ${a * b} cm², viena kraštinė ${a} cm. Kokia kita kraštinė?`,
    atsakymas: String(b),
    atsakymasRodymui: `$${b}$ cm`,
    sprendimas: `$${a * b} : ${a} = ${b}$ cm.`,
  })
}

// ── Kampai ──────────────────────────────────────────────────────────────────

const A_KAMPAI = [
  {
    klausimas: 'Du trikampio kampai yra 40° ir 70°. Koks trečiasis kampas?',
    atsakymas: '70',
    atsakymasRodymui: '$70°$',
    sprendimas: 'Trikampio kampų suma 180°, tad $180 - 40 - 70 = 70$°.',
  },
] as const

export const kampai: Generatorius = (lygis) =>
  suBandymais(() => kurkKampus(lygis), A_KAMPAI, 'kampai')

function kurkKampus(lygis: Lygis): Uzdavinys | null {
  if (lygis === 1) {
    const a = atsitiktinis(2, 17) * 5
    const b = atsitiktinis(2, 17) * 5
    const c = 180 - a - b
    if (c <= 0 || c % 5 !== 0) return null
    return uzdavinys('kampai', {
      klausimas: `Du trikampio kampai yra ${a}° ir ${b}°. Koks trečiasis kampas?`,
      atsakymas: String(c),
      atsakymasRodymui: `$${c}°$`,
      sprendimas: `Trikampio kampų suma 180°, tad $180 - ${a} - ${b} = ${c}$°.`,
    })
  }

  if (lygis === 2) {
    // Gretutiniai arba papildomi kampai.
    const gretutiniai = Math.random() < 0.5
    const suma = gretutiniai ? 180 : 90
    const a = atsitiktinis(2, suma / 5 - 2) * 5
    const b = suma - a
    if (b <= 0) return null
    return uzdavinys('kampai', {
      klausimas: gretutiniai
        ? `Kampas yra ${a}°. Koks jo gretutinis kampas?`
        : `Kampas yra ${a}°. Kiek jam trūksta iki stataus kampo?`,
      atsakymas: String(b),
      atsakymasRodymui: `$${b}°$`,
      sprendimas: `Kampų suma ${suma}°, tad $${suma} - ${a} = ${b}$°.`,
    })
  }

  // 3 lygis — daugiakampio kampų suma.
  const kraštiniu = atsitiktinis(3, 20)
  const suma = (kraštiniu - 2) * 180
  return uzdavinys('kampai', {
    klausimas: `Kokia yra ${kraštiniu} kraštinių daugiakampio vidaus kampų suma laipsniais?`,
    atsakymas: String(suma),
    atsakymasRodymui: `$${suma}°$`,
    sprendimas: `$(n - 2) \\cdot 180 = (${kraštiniu} - 2) \\cdot 180 = ${suma}$°.`,
  })
}

// ── Pitagoro teorema ────────────────────────────────────────────────────────

const A_PITAGORAS = [
  {
    klausimas: 'Stačiojo trikampio statiniai 3 cm ir 4 cm. Kokia įžambinė?',
    atsakymas: '5',
    atsakymasRodymui: '$5$ cm',
    sprendimas: '$c^2 = 3^2 + 4^2 = 25$, tad $c = 5$ cm.',
  },
] as const

export const pitagoras: Generatorius = (lygis) =>
  suBandymais(() => kurkPitagora(lygis), A_PITAGORAS, 'pitagoras')

function kurkPitagora(lygis: Lygis): Uzdavinys | null {
  const [a, b, c] = pasirink(TREJETAI)

  if (lygis === 1) {
    return uzdavinys('pitagoras', {
      klausimas: `Stačiojo trikampio statiniai ${a} cm ir ${b} cm. Kokia įžambinė?`,
      atsakymas: String(c),
      atsakymasRodymui: `$${c}$ cm`,
      sprendimas: `$c^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}$, tad $c = ${c}$ cm.`,
    })
  }

  if (lygis === 2) {
    // Ieškomas statinis — atvirkštinis veiksmas.
    return uzdavinys('pitagoras', {
      klausimas: `Stačiojo trikampio įžambinė ${c} cm, vienas statinis ${a} cm. Koks kitas statinis?`,
      atsakymas: String(b),
      atsakymasRodymui: `$${b}$ cm`,
      sprendimas: `$b^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b}$, tad $b = ${b}$ cm.`,
    })
  }

  // 3 lygis — stačiojo trikampio plotas iš statinių.
  const plotas = (a * b) / 2
  if (!Number.isInteger(plotas)) return null
  return uzdavinys('pitagoras', {
    klausimas: `Stačiojo trikampio įžambinė ${c} cm, vienas statinis ${a} cm. Koks trikampio plotas?`,
    atsakymas: String(plotas),
    atsakymasRodymui: `$${plotas}$ cm²`,
    sprendimas: `Kitas statinis $\\sqrt{${c * c} - ${a * a}} = ${b}$ cm, tad $S = \\dfrac{${a} \\cdot ${b}}{2} = ${plotas}$ cm².`,
  })
}

// ── Apskritimas ─────────────────────────────────────────────────────────────

const A_APSKRITIMAS = [
  {
    klausimas: 'Apskritimo spindulys 6 cm. Jo ilgis yra $\\ldots \\pi$ cm. Koks skaičius prieš $\\pi$?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '$C = 2\\pi r = 2 \\cdot 6 \\cdot \\pi = 12\\pi$ cm.',
  },
] as const

export const apskritimas: Generatorius = (lygis) =>
  suBandymais(() => kurkApskritima(lygis), A_APSKRITIMAS, 'apskritimas')

function kurkApskritima(lygis: Lygis): Uzdavinys | null {
  const r = atsitiktinis(2, 30)

  if (lygis === 1) {
    return uzdavinys('apskritimas', {
      klausimas: `Apskritimo spindulys ${r} cm. Koks jo skersmuo?`,
      atsakymas: String(2 * r),
      atsakymasRodymui: `$${2 * r}$ cm`,
      sprendimas: `Skersmuo dvigubai ilgesnis už spindulį: $2 \\cdot ${r} = ${2 * r}$ cm.`,
    })
  }

  if (lygis === 2) {
    // Atsakymas paliekamas su π, kad neatsirastų begalinių dešimtainių.
    return uzdavinys('apskritimas', {
      klausimas: `Apskritimo spindulys ${r} cm. Jo ilgis yra $\\ldots \\pi$ cm. Koks skaičius rašomas prieš $\\pi$?`,
      atsakymas: String(2 * r),
      atsakymasRodymui: `$${2 * r}$`,
      sprendimas: `$C = 2\\pi r = 2 \\cdot ${r} \\cdot \\pi = ${2 * r}\\pi$ cm.`,
    })
  }

  return uzdavinys('apskritimas', {
    klausimas: `Skritulio spindulys ${r} cm. Jo plotas yra $\\ldots \\pi$ cm². Koks skaičius rašomas prieš $\\pi$?`,
    atsakymas: String(r * r),
    atsakymasRodymui: `$${r * r}$`,
    sprendimas: `$S = \\pi r^2 = \\pi \\cdot ${r}^2 = ${r * r}\\pi$ cm².`,
  })
}

// ── Trigonometrija ──────────────────────────────────────────────────────────

const A_TRIGONOMETRIJA = [
  {
    klausimas:
      'Stačiajame trikampyje statinis priešais kampą yra 3, įžambinė 5. Kam lygus to kampo sinusas? Įrašyk trupmena.',
    atsakymas: '3/5',
    atsakymasRodymui: '$\\dfrac{3}{5}$',
    sprendimas: 'Sinusas — priešais esantis statinis, padalytas iš įžambinės: $\\dfrac{3}{5}$.',
  },
] as const

export const trigonometrija: Generatorius = (lygis) =>
  suBandymais(() => kurkTrigonometrija(lygis), A_TRIGONOMETRIJA, 'trigonometrija')

function kurkTrigonometrija(lygis: Lygis): Uzdavinys | null {
  const [a, b, c] = pasirink(TREJETAI)

  const funkcija =
    lygis === 1
      ? 'sinusas'
      : lygis === 2
        ? pasirink(['sinusas', 'kosinusas'] as const)
        : 'tangentas'

  const t =
    funkcija === 'sinusas'
      ? suprastink(a, c)
      : funkcija === 'kosinusas'
        ? suprastink(b, c)
        : suprastink(a, b)

  if (t.vardiklis > 20) return null

  const paaiskinimas =
    funkcija === 'sinusas'
      ? `Sinusas — priešais kampą esantis statinis, padalytas iš įžambinės: $\\dfrac{${a}}{${c}}$`
      : funkcija === 'kosinusas'
        ? `Kosinusas — prie kampo esantis statinis, padalytas iš įžambinės: $\\dfrac{${b}}{${c}}$`
        : `Tangentas — priešais esantis statinis, padalytas iš prie kampo esančio: $\\dfrac{${a}}{${b}}$`

  return uzdavinys('trigonometrija', {
    klausimas: `Stačiajame trikampyje statinis priešais kampą yra ${a}, gretimas statinis ${b}, įžambinė ${c}. Kam lygus to kampo ${funkcija}? Įrašyk trupmena.`,
    atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
    atsakymasRodymui: `$${trupmenaTeX(t)}$`,
    sprendimas: `${paaiskinimas}$ = ${trupmenaTeX(t)}$.`,
  })
}
