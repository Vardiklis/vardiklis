import { atsitiktinis, atsitiktinisBe, pasirink } from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Lygtys: tiesinės ir kvadratinės.
 *
 * Sprendinys parenkamas pirmas, laisvasis narys išvedamas iš jo (7.1) —
 * taip garantuojama, kad sprendinys visada sveikas.
 */

/** Sprendiniai be 0 ir 1 — jie per daug pasako iš pirmo žvilgsnio. */
function sprendinys(lygis: Lygis): number {
  if (lygis === 1) return atsitiktinis(2, 9)
  return atsitiktinisBe(-9, 9, [-1, 0, 1])
}

/** `3x - 5` pavidalas. Koeficientas 1 nerašomas, neigiamas narys su minusu. */
function tiesinisNaris(a: number, b: number): string {
  const kintamasis = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`
  if (b === 0) return kintamasis
  return `${kintamasis} ${b > 0 ? '+' : '-'} ${Math.abs(b)}`
}

// ---------------------------------------------------------------------------
// Tiesinės lygtys
// ---------------------------------------------------------------------------

const ATSARGINIAI_TIESINES = [
  {
    klausimas: 'Išspręsk lygtį: $3x + 5 = 17$',
    atsakymas: '4',
    atsakymasRodymui: '$x = 4$',
    sprendimas: '$3x = 17 - 5 = 12$, tad $x = 12 : 3 = 4$.',
  },
  {
    klausimas: 'Išspręsk lygtį: $2x - 7 = 9$',
    atsakymas: '8',
    atsakymasRodymui: '$x = 8$',
    sprendimas: '$2x = 9 + 7 = 16$, tad $x = 16 : 2 = 8$.',
  },
] as const

export const tiesinesLygtys: Generatorius = (lygis) =>
  suBandymais(() => kurkTiesine(lygis), ATSARGINIAI_TIESINES, 'tiesines-lygtys')

function kurkTiesine(lygis: Lygis): Uzdavinys | null {
  const x = sprendinys(lygis)

  if (lygis === 1) {
    // Vieno veiksmo lygtis: `ax = b` arba `x + b = c`.
    if (Math.random() < 0.5) {
      const a = atsitiktinis(2, 9)
      const b = a * x
      if (b > 90) return null
      return uzdavinys('tiesines-lygtys', {
        klausimas: `Išspręsk lygtį: $${a}x = ${b}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `$x = ${b} : ${a} = ${x}$.`,
      })
    }
    const b = atsitiktinis(2, 30)
    const c = x + b
    return uzdavinys('tiesines-lygtys', {
      klausimas: `Išspręsk lygtį: $x + ${b} = ${c}$`,
      atsakymas: String(x),
      atsakymasRodymui: `$x = ${x}$`,
      sprendimas: `$x = ${c} - ${b} = ${x}$.`,
    })
  }

  if (lygis === 2) {
    // Dviejų veiksmų lygtis: `ax + b = c`, `c` išvedamas.
    const a = atsitiktinis(2, 9)
    const b = atsitiktinisBe(-20, 20, [0])
    const c = a * x + b
    if (Math.abs(c) > 80) return null

    return uzdavinys('tiesines-lygtys', {
      klausimas: `Išspręsk lygtį: $${tiesinisNaris(a, b)} = ${c}$`,
      atsakymas: String(x),
      atsakymasRodymui: `$x = ${x}$`,
      sprendimas: `$${a}x = ${c} ${b > 0 ? '-' : '+'} ${Math.abs(b)} = ${
        a * x
      }$, tad $x = ${a * x} : ${a} = ${x}$.`,
    })
  }

  // 3 lygis — kintamasis abiejose pusėse: `ax + b = cx + d`.
  const a = atsitiktinis(3, 9)
  const c = atsitiktinisBe(-5, 5, [0, a])
  const b = atsitiktinisBe(-15, 15, [0])
  const d = (a - c) * x + b
  if (Math.abs(d) > 80) return null

  return uzdavinys('tiesines-lygtys', {
    klausimas: `Išspręsk lygtį: $${tiesinisNaris(a, b)} = ${tiesinisNaris(c, d)}$`,
    atsakymas: String(x),
    atsakymasRodymui: `$x = ${x}$`,
    sprendimas: `Perkeliame kintamuosius į kairę, skaičius į dešinę: $${
      a - c
    }x = ${d - b}$, tad $x = ${x}$.`,
  })
}

// ---------------------------------------------------------------------------
// Kvadratinės lygtys
// ---------------------------------------------------------------------------

const ATSARGINIAI_KVADRATINES = [
  {
    klausimas: 'Išspręsk: $x^2 = 49$. Įrašyk teigiamąjį sprendinį.',
    atsakymas: '7',
    atsakymasRodymui: '$x = 7$',
    sprendimas: '$7 \\cdot 7 = 49$, tad teigiamasis sprendinys yra 7.',
  },
  {
    klausimas: 'Išspręsk: $x^2 - 5x + 6 = 0$. Įrašyk didesnįjį sprendinį.',
    atsakymas: '3',
    atsakymasRodymui: '$x = 3$',
    sprendimas: 'Sprendiniai yra 2 ir 3, nes $2 + 3 = 5$ ir $2 \\cdot 3 = 6$.',
  },
] as const

export const kvadratinesLygtys: Generatorius = (lygis) =>
  suBandymais(() => kurkKvadratine(lygis), ATSARGINIAI_KVADRATINES, 'kvadratines-lygtys')

function kurkKvadratine(lygis: Lygis): Uzdavinys | null {
  if (lygis === 1) {
    const m = atsitiktinis(2, 12)

    // Pusė uždavinių su papildomu nariu — kitaip variantų yra vos vienuolika.
    if (Math.random() < 0.5) {
      const b = atsitiktinis(2, 30)
      const c = m * m + b
      return uzdavinys('kvadratines-lygtys', {
        klausimas: `Išspręsk: $x^2 + ${b} = ${c}$. Įrašyk teigiamąjį sprendinį.`,
        atsakymas: String(m),
        atsakymasRodymui: `$x = ${m}$`,
        sprendimas: `$x^2 = ${c} - ${b} = ${m * m}$, tad teigiamasis sprendinys yra ${m}.`,
      })
    }

    return uzdavinys('kvadratines-lygtys', {
      klausimas: `Išspręsk: $x^2 = ${m * m}$. Įrašyk teigiamąjį sprendinį.`,
      atsakymas: String(m),
      atsakymasRodymui: `$x = ${m}$`,
      sprendimas: `$${m} \\cdot ${m} = ${m * m}$, tad teigiamasis sprendinys yra ${m}.`,
    })
  }

  // Sprendiniai parenkami pirma, koeficientai išvedami iš Vietos teoremos.
  const p = atsitiktinisBe(-8, 8, [0])
  const q = atsitiktinisBe(-8, 8, [0, p])
  const suma = p + q
  const sandauga = p * q
  const didesnis = Math.max(p, q)

  if (lygis === 2) {
    if (Math.abs(suma) > 12 || Math.abs(sandauga) > 40) return null
    const bNaris = suma === 0 ? '' : ` ${-suma > 0 ? '+' : '-'} ${Math.abs(suma)}x`
    const cNaris = ` ${sandauga > 0 ? '+' : '-'} ${Math.abs(sandauga)}`

    return uzdavinys('kvadratines-lygtys', {
      klausimas: `Išspręsk: $x^2${bNaris}${cNaris} = 0$. Įrašyk didesnįjį sprendinį.`,
      atsakymas: String(didesnis),
      atsakymasRodymui: `$x = ${didesnis}$`,
      sprendimas: `Sprendiniai yra ${Math.min(p, q)} ir ${didesnis}, nes jų suma ${suma}, o sandauga ${sandauga}.`,
    })
  }

  // 3 lygis — su vyresniuoju koeficientu.
  const a = pasirink([2, 3] as const)
  const b = -a * suma
  const c = a * sandauga
  if (Math.abs(b) > 40 || Math.abs(c) > 90) return null
  const bNaris = b === 0 ? '' : ` ${b > 0 ? '+' : '-'} ${Math.abs(b)}x`
  const cNaris = ` ${c > 0 ? '+' : '-'} ${Math.abs(c)}`

  return uzdavinys('kvadratines-lygtys', {
    klausimas: `Išspręsk: $${a}x^2${bNaris}${cNaris} = 0$. Įrašyk didesnįjį sprendinį.`,
    atsakymas: String(didesnis),
    atsakymasRodymui: `$x = ${didesnis}$`,
    sprendimas: `Padalijus abi puses iš ${a}, lieka lygtis su sprendiniais ${Math.min(
      p,
      q,
    )} ir ${didesnis}: jų suma ${suma}, sandauga ${sandauga}.`,
  })
}
