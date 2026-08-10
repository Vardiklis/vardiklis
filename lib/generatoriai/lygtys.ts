import { atsitiktinis, atsitiktinisBe, pasirink } from '../matematika'
import { atsitiktinumas } from '../sekla'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { didink, vyresne } from './mastas'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Lygtys: tiesinės ir kvadratinės.
 *
 * Sprendinys parenkamas pirmas, laisvasis narys išvedamas iš jo (7.1) —
 * taip garantuojama, kad sprendinys visada sveikas.
 */

/**
 * Sprendiniai be 0 ir 1 — jie per daug pasako iš pirmo žvilgsnio.
 * Vyresnėse klasėse intervalas platesnis: dešimtokui `x = 3` per lengva.
 */
function sprendinys(lygis: Lygis, klase?: number): number {
  const riba = didink(9, klase)
  if (lygis === 1) return atsitiktinis(2, Math.max(9, Math.round(riba / 2)))
  return atsitiktinisBe(-riba, riba, [-1, 0, 1])
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

export const tiesinesLygtys: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkTiesine(lygis, klase), ATSARGINIAI_TIESINES, 'tiesines-lygtys')

/** Aštuonios skirtingo pavidalo variacijos; sprendinys visada parenkamas pirma. */
function kurkTiesine(lygis: Lygis, klase?: number): Uzdavinys | null {
  const x = sprendinys(lygis, klase)
  const kf = () => atsitiktinis(2, didink(9, klase))
  const laisvasis = () => atsitiktinisBe(-didink(20, klase), didink(20, klase), [0])
  const virsus = didink(90, klase)

  return variacija([
    // 1. ax = b — aštuntokui ir vyresniam per lengva, tad jam neduodama
    () => {
      if (vyresne(klase)) return null
      const a = kf()
      const b = a * x
      if (Math.abs(b) > virsus * 2) return null
      return uzdavinys('tiesines-lygtys', {
        klausimas: `Išspręsk lygtį: $${a}x = ${b}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `$x = ${b} : ${a} = ${x}$.`,
      })
    },

    // 2. x + b = c — irgi tik jaunesnėms klasėms
    () => {
      if (vyresne(klase)) return null
      const b = atsitiktinisBe(-didink(30, klase), didink(30, klase), [0])
      const c = x + b
      return uzdavinys('tiesines-lygtys', {
        klausimas: `Išspręsk lygtį: $${tiesinisNaris(1, b)} = ${c}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `$x = ${c} ${b > 0 ? '-' : '+'} ${Math.abs(b)} = ${x}$.`,
      })
    },

    // 3. ax + b = c
    () => {
      const a = kf()
      const b = laisvasis()
      const c = a * x + b
      if (Math.abs(c) > virsus) return null
      return uzdavinys('tiesines-lygtys', {
        klausimas: `Išspręsk lygtį: $${tiesinisNaris(a, b)} = ${c}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `$${a}x = ${c} ${b > 0 ? '-' : '+'} ${Math.abs(b)} = ${a * x}$, tad $x = ${x}$.`,
      })
    },

    // 4. a(x + b) = c
    () => {
      if (lygis === 1) return null
      const a = atsitiktinis(2, didink(7, klase))
      const b = atsitiktinisBe(-didink(9, klase), didink(9, klase), [0])
      const c = a * (x + b)
      if (Math.abs(c) > virsus * 2) return null
      return uzdavinys('tiesines-lygtys', {
        klausimas: `Išspręsk lygtį: $${a}(${tiesinisNaris(1, b)}) = ${c}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Padalijus abi puses iš ${a}: $${tiesinisNaris(1, b)} = ${c / a}$, tad $x = ${x}$.`,
      })
    },

    // 5. Kintamasis abiejose pusėse
    () => {
      if (lygis === 1) return null
      const a = atsitiktinis(3, didink(9, klase))
      const c = atsitiktinisBe(-didink(5, klase), didink(5, klase), [0, a])
      const b = atsitiktinisBe(-didink(15, klase), didink(15, klase), [0])
      const d = (a - c) * x + b
      if (Math.abs(d) > virsus * 2) return null
      return uzdavinys('tiesines-lygtys', {
        klausimas: `Išspręsk lygtį: $${tiesinisNaris(a, b)} = ${tiesinisNaris(c, d)}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Kintamuosius perkeliame į kairę: $${a - c}x = ${d - b}$, tad $x = ${x}$.`,
      })
    },

    // 6. Trupmeninė lygtis
    () => {
      if (lygis === 1) return null
      const b = atsitiktinis(2, didink(6, klase))
      const a = atsitiktinisBe(-didink(12, klase), didink(12, klase), [0])
      const c = (x + a) / b
      if (!Number.isInteger(c)) return null
      return uzdavinys('tiesines-lygtys', {
        klausimas: `Išspręsk lygtį: $\\dfrac{${tiesinisNaris(1, a)}}{${b}} = ${c}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Padauginus abi puses iš ${b}: $${tiesinisNaris(1, a)} = ${c * b}$, tad $x = ${x}$.`,
      })
    },

    // 7. Tekstinis: sugalvotas skaičius
    () => {
      if (x <= 0) return null
      const a = kf()
      const b = atsitiktinis(3, didink(30, klase))
      const c = a * x + b
      if (Math.abs(c) > virsus * 3) return null
      return uzdavinys('tiesines-lygtys', {
        klausimas: `Sugalvotą skaičių padauginome iš ${a} ir prie sandaugos pridėjome ${b}. Gavome ${c}. Koks buvo sugalvotas skaičius?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Sudarome lygtį $${a}x + ${b} = ${c}$. Iš jos $${a}x = ${a * x}$, tad $x = ${x}$.`,
      })
    },

    // 8. Skliaustai abiejose pusėse — tik vyresnėms klasėms
    () => {
      if (!vyresne(klase)) return null
      const a = atsitiktinis(2, didink(6, klase))
      const b = atsitiktinisBe(-didink(9, klase), didink(9, klase), [0])
      const c = atsitiktinisBe(-didink(6, klase), didink(6, klase), [0, a])
      const d = (a * (x + b) - c * x) / 1
      if (Math.abs(d) > virsus * 3) return null
      return uzdavinys('tiesines-lygtys', {
        klausimas: `Išspręsk lygtį: $${a}(${tiesinisNaris(1, b)}) = ${tiesinisNaris(c, d)}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Atskliaudę gauname $${a}x ${b > 0 ? '+' : '-'} ${Math.abs(
          a * b,
        )} = ${tiesinisNaris(c, d)}$. Sutvarkę: $${a - c}x = ${(a - c) * x}$, tad $x = ${x}$.`,
      })
    },

    // 9. Tekstinis: perimetras
    () => {
      if (x <= 1) return null
      const kita = atsitiktinis(2, didink(15, klase))
      const p = 2 * (x + kita)
      return uzdavinys('tiesines-lygtys', {
        klausimas: `Stačiakampio perimetras ${p} cm, viena kraštinė ${kita} cm. Kokio ilgio kita kraštinė?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$ cm`,
        sprendimas: `Sudarome lygtį $2(x + ${kita}) = ${p}$. Iš jos $x + ${kita} = ${p / 2}$, tad $x = ${x}$ cm.`,
      })
    },
  ])
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

export const kvadratinesLygtys: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkKvadratine(lygis, klase), ATSARGINIAI_KVADRATINES, 'kvadratines-lygtys')

function kurkKvadratine(lygis: Lygis, klase?: number): Uzdavinys | null {
  const m = atsitiktinis(2, 12)
  // Sprendiniai parenkami pirma, koeficientai išvedami iš Vietos teoremos.
  const riba = vyresne(klase) ? 14 : 8
  const p = atsitiktinisBe(-riba, riba, [0])
  const q = atsitiktinisBe(-riba, riba, [0, p])
  const suma = p + q
  const sandauga = p * q
  const didesnis = Math.max(p, q)

  /**
   * Nario užrašas su ženklu: „ + 5x", „ - 3", „ + x".
   * Vienetinis koeficientas prie nežinomojo nerašomas — „1x" mokykloje
   * neužrašoma niekada.
   */
  const naris = (k: number, x: string) => {
    if (k === 0) return ''
    const modulis = Math.abs(k) === 1 && x !== '' ? '' : String(Math.abs(k))
    return ` ${k > 0 ? '+' : '-'} ${modulis}${x}`
  }

  return variacija([
    // 1. Paprasčiausia nepilna lygtis
    () =>
      uzdavinys('kvadratines-lygtys', {
        klausimas: `Išspręsk: $x^2 = ${m * m}$. Įrašyk teigiamąjį sprendinį.`,
        atsakymas: String(m),
        atsakymasRodymui: `$x = ${m}$`,
        sprendimas: `$${m} \\cdot ${m} = ${m * m}$, tad teigiamasis sprendinys yra ${m}.`,
      }),

    // 2. Nepilna lygtis su laisvuoju nariu
    () => {
      const bb = atsitiktinis(2, 30)
      return uzdavinys('kvadratines-lygtys', {
        klausimas: `Išspręsk: $x^2 + ${bb} = ${m * m + bb}$. Įrašyk teigiamąjį sprendinį.`,
        atsakymas: String(m),
        atsakymasRodymui: `$x = ${m}$`,
        sprendimas: `$x^2 = ${m * m + bb} - ${bb} = ${m * m}$, tad teigiamasis sprendinys yra ${m}.`,
      })
    },

    // 3. Nepilna lygtis su atimtimi
    () => {
      const bb = atsitiktinis(2, 30)
      return uzdavinys('kvadratines-lygtys', {
        klausimas: `Išspręsk: $x^2 - ${bb} = ${m * m - bb}$. Įrašyk teigiamąjį sprendinį.`,
        atsakymas: String(m),
        atsakymasRodymui: `$x = ${m}$`,
        sprendimas: `$x^2 = ${m * m - bb} + ${bb} = ${m * m}$, tad teigiamasis sprendinys yra ${m}.`,
      })
    },

    // 4. Neigiamasis sprendinys — priminimas, kad jų yra du
    () =>
      uzdavinys('kvadratines-lygtys', {
        klausimas: `Išspręsk: $x^2 = ${m * m}$. Įrašyk neigiamąjį sprendinį.`,
        atsakymas: String(-m),
        atsakymasRodymui: `$x = ${-m}$`,
        sprendimas: `$(${-m}) \\cdot (${-m}) = ${m * m}$, tad neigiamasis sprendinys yra ${-m}.`,
      }),

    // 5. Kiek sprendinių turi lygtis
    () => {
      const laisvas = atsitiktinis(1, 40)
      const teigiamas = atsitiktinumas() < 0.5
      return uzdavinys('kvadratines-lygtys', {
        klausimas: `Kiek sprendinių turi lygtis $x^2 = ${teigiamas ? laisvas : -laisvas}$?`,
        atsakymas: teigiamas ? '2' : '0',
        atsakymasRodymui: teigiamas ? '$2$' : '$0$',
        sprendimas: teigiamas
          ? `Teigiamas skaičius turi du sprendinius — teigiamą ir neigiamą.`
          : `Kvadratas negali būti neigiamas, tad sprendinių nėra.`,
      })
    },

    // 6. Pilna lygtis — didesnysis sprendinys
    () => {
      if (lygis === 1) return null
      if (Math.abs(suma) > didink(12, klase) || Math.abs(sandauga) > didink(40, klase)) return null
      return uzdavinys('kvadratines-lygtys', {
        klausimas: `Išspręsk: $x^2${naris(-suma, 'x')}${naris(sandauga, '')} = 0$. Įrašyk didesnįjį sprendinį.`,
        atsakymas: String(didesnis),
        atsakymasRodymui: `$x = ${didesnis}$`,
        sprendimas: `Sprendiniai yra ${Math.min(p, q)} ir ${didesnis}, nes jų suma ${suma}, o sandauga ${sandauga}.`,
      })
    },

    // 4. Pilna lygtis — mažesnysis sprendinys
    () => {
      if (lygis === 1) return null
      if (Math.abs(suma) > didink(12, klase) || Math.abs(sandauga) > didink(40, klase)) return null
      return uzdavinys('kvadratines-lygtys', {
        klausimas: `Išspręsk: $x^2${naris(-suma, 'x')}${naris(sandauga, '')} = 0$. Įrašyk mažesnįjį sprendinį.`,
        atsakymas: String(Math.min(p, q)),
        atsakymasRodymui: `$x = ${Math.min(p, q)}$`,
        sprendimas: `Sprendiniai yra ${Math.min(p, q)} ir ${didesnis}, nes jų suma ${suma}, o sandauga ${sandauga}.`,
      })
    },

    // 5. Lygtis su vyresniuoju koeficientu
    () => {
      if (lygis === 1) return null
      const a = pasirink([2, 3] as const)
      const bb = -a * suma
      const cc = a * sandauga
      if (Math.abs(bb) > didink(40, klase) || Math.abs(cc) > didink(90, klase)) return null
      return uzdavinys('kvadratines-lygtys', {
        klausimas: `Išspręsk: $${a}x^2${naris(bb, 'x')}${naris(cc, '')} = 0$. Įrašyk didesnįjį sprendinį.`,
        atsakymas: String(didesnis),
        atsakymasRodymui: `$x = ${didesnis}$`,
        sprendimas: `Padalijus abi puses iš ${a}, lieka lygtis su sprendiniais ${Math.min(
          p,
          q,
        )} ir ${didesnis}: jų suma ${suma}, sandauga ${sandauga}.`,
      })
    },

    // 6. Sprendinių suma pagal Vietos teoremą
    () => {
      if (lygis === 1) return null
      if (Math.abs(suma) > didink(12, klase) || Math.abs(sandauga) > didink(40, klase)) return null
      return uzdavinys('kvadratines-lygtys', {
        klausimas: `Kokia lygties $x^2${naris(-suma, 'x')}${naris(sandauga, '')} = 0$ sprendinių suma?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Pagal Vietos teoremą sprendinių suma lygi $-b$: čia ${suma}.`,
      })
    },

    // 7. Sprendinių sandauga
    () => {
      if (lygis === 1) return null
      if (Math.abs(suma) > didink(12, klase) || Math.abs(sandauga) > didink(40, klase)) return null
      return uzdavinys('kvadratines-lygtys', {
        klausimas: `Kokia lygties $x^2${naris(-suma, 'x')}${naris(sandauga, '')} = 0$ sprendinių sandauga?`,
        atsakymas: String(sandauga),
        atsakymasRodymui: `$${sandauga}$`,
        sprendimas: `Pagal Vietos teoremą sprendinių sandauga lygi laisvajam nariui: čia ${sandauga}.`,
      })
    },
  ])
}
