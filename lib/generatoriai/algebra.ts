import { atsitiktinis, atsitiktinisBe, pasirink } from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Algebra: raidiniai reiškiniai, nelygybės, šaknys, greitosios daugybos
 * formulės, lygčių sistemos, funkcijos.
 *
 * Kaip ir visur, sprendinys parenkamas pirma, koeficientai išvedami iš jo.
 */

/** `3a - 5` pavidalas be pertekliaus. */
function narys(koef: number, raide: string, laisvasis: number): string {
  const kint = koef === 1 ? raide : koef === -1 ? `-${raide}` : `${koef}${raide}`
  if (laisvasis === 0) return kint
  return `${kint} ${laisvasis > 0 ? '+' : '-'} ${Math.abs(laisvasis)}`
}

// ── Raidiniai reiškiniai ────────────────────────────────────────────────────

const A_RAIDINIAI = [
  {
    klausimas: 'Apskaičiuok reiškinio $3a + 5$ reikšmę, kai $a = 4$.',
    atsakymas: '17',
    atsakymasRodymui: '$17$',
    sprendimas: 'Vietoj $a$ įrašome 4: $3 \\cdot 4 + 5 = 17$.',
  },
] as const

export const raidiniaiReiskiniai: Generatorius = (lygis) =>
  suBandymais(() => kurkRaidini(lygis), A_RAIDINIAI, 'raidiniai-reiskiniai')

function kurkRaidini(lygis: Lygis): Uzdavinys | null {
  const raide = pasirink(['a', 'b', 'x', 'n'] as const)

  if (lygis === 1) {
    const k = atsitiktinis(2, 9)
    const c = atsitiktinis(1, 20)
    const a = atsitiktinis(2, 12)
    return uzdavinys('raidiniai-reiskiniai', {
      klausimas: `Apskaičiuok reiškinio $${narys(k, raide, c)}$ reikšmę, kai $${raide} = ${a}$.`,
      atsakymas: String(k * a + c),
      atsakymasRodymui: `$${k * a + c}$`,
      sprendimas: `Vietoj $${raide}$ įrašome ${a}: $${k} \\cdot ${a} + ${c} = ${k * a + c}$.`,
    })
  }

  if (lygis === 2) {
    const k = atsitiktinis(2, 9)
    const c = atsitiktinisBe(-20, 20, [0])
    const a = atsitiktinisBe(-8, 8, [0, 1])
    const rez = k * a + c
    if (Math.abs(rez) > 100) return null
    return uzdavinys('raidiniai-reiskiniai', {
      klausimas: `Apskaičiuok reiškinio $${narys(k, raide, c)}$ reikšmę, kai $${raide} = ${a}$.`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$`,
      sprendimas: `$${k} \\cdot (${a}) ${c > 0 ? '+' : '-'} ${Math.abs(c)} = ${
        k * a
      } ${c > 0 ? '+' : '-'} ${Math.abs(c)} = ${rez}$.`,
    })
  }

  // 3 lygis — reiškinys su dviem kintamaisiais.
  const k1 = atsitiktinis(2, 7)
  const k2 = atsitiktinis(2, 7)
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(2, 9)
  const rez = k1 * a - k2 * b
  if (rez <= 0 || rez > 80) return null

  return uzdavinys('raidiniai-reiskiniai', {
    klausimas: `Apskaičiuok reiškinio $${k1}a - ${k2}b$ reikšmę, kai $a = ${a}$ ir $b = ${b}$.`,
    atsakymas: String(rez),
    atsakymasRodymui: `$${rez}$`,
    sprendimas: `$${k1} \\cdot ${a} - ${k2} \\cdot ${b} = ${k1 * a} - ${k2 * b} = ${rez}$.`,
  })
}

// ── Nelygybės ───────────────────────────────────────────────────────────────

const A_NELYGYBES = [
  {
    klausimas: 'Išspręsk nelygybę $3x > 12$. Įrašyk mažiausią sveikąjį $x$, kuris ją tenkina.',
    atsakymas: '5',
    atsakymasRodymui: '$x = 5$',
    sprendimas: '$x > 4$, tad mažiausias sveikasis sprendinys yra 5.',
  },
] as const

export const nelygybes: Generatorius = (lygis) =>
  suBandymais(() => kurkNelygybe(lygis), A_NELYGYBES, 'nelygybes')

function kurkNelygybe(lygis: Lygis): Uzdavinys | null {
  if (lygis === 3) {
    // Kvadratinė nelygybė $x^2 < k^2$.
    const k = atsitiktinis(3, 25)
    return uzdavinys('nelygybes', {
      klausimas: `Išspręsk nelygybę $x^2 < ${k * k}$. Įrašyk didžiausią sveikąjį $x$, kuris ją tenkina.`,
      atsakymas: String(k - 1),
      atsakymasRodymui: `$x = ${k - 1}$`,
      sprendimas: `Nelygybę tenkina $-${k} < x < ${k}$, tad didžiausias sveikasis sprendinys yra ${
        k - 1
      }.`,
    })
  }

  const a = atsitiktinis(2, 9)
  const riba = atsitiktinis(2, 15)
  const b = lygis === 1 ? 0 : atsitiktinisBe(-20, 20, [0])
  const desine = a * riba + b

  if (Math.abs(desine) > 90) return null

  // Nelygybė griežta, tad mažiausias sveikasis sprendinys yra riba + 1.
  return uzdavinys('nelygybes', {
    klausimas: `Išspręsk nelygybę $${narys(a, 'x', b)} > ${desine}$. Įrašyk mažiausią sveikąjį $x$, kuris ją tenkina.`,
    atsakymas: String(riba + 1),
    atsakymasRodymui: `$x = ${riba + 1}$`,
    sprendimas: `Gauname $x > ${riba}$, tad mažiausias sveikasis sprendinys yra ${riba + 1}.`,
  })
}

// ── Šaknys ──────────────────────────────────────────────────────────────────

const A_SAKNYS = [
  {
    klausimas: 'Apskaičiuok: $\\sqrt{144}$',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '$12 \\cdot 12 = 144$, tad $\\sqrt{144} = 12$.',
  },
] as const

export const saknys: Generatorius = (lygis) =>
  suBandymais(() => kurkSaknis(lygis), A_SAKNYS, 'saknys')

function kurkSaknis(lygis: Lygis): Uzdavinys | null {
  if (lygis === 1) {
    const n = atsitiktinis(2, 20)
    return uzdavinys('saknys', {
      klausimas: `Apskaičiuok: $\\sqrt{${n * n}}$`,
      atsakymas: String(n),
      atsakymasRodymui: `$${n}$`,
      sprendimas: `$${n} \\cdot ${n} = ${n * n}$, tad $\\sqrt{${n * n}} = ${n}$.`,
    })
  }

  if (lygis === 2) {
    const n = atsitiktinis(2, 15)
    return uzdavinys('saknys', {
      klausimas: `Apskaičiuok: $\\sqrt[3]{${n ** 3}}$`,
      atsakymas: String(n),
      atsakymasRodymui: `$${n}$`,
      sprendimas: `$${n}^3 = ${n ** 3}$, tad kubinė šaknis lygi ${n}.`,
    })
  }

  // 3 lygis — šaknis iš sandaugos.
  const a = atsitiktinis(2, 12)
  const b = atsitiktinis(2, 12)
  return uzdavinys('saknys', {
    klausimas: `Apskaičiuok: $\\sqrt{${a * a} \\cdot ${b * b}}$`,
    atsakymas: String(a * b),
    atsakymasRodymui: `$${a * b}$`,
    sprendimas: `$\\sqrt{${a * a}} \\cdot \\sqrt{${b * b}} = ${a} \\cdot ${b} = ${a * b}$.`,
  })
}

// ── Greitosios daugybos formulės ────────────────────────────────────────────

const A_FORMULES = [
  {
    klausimas: 'Atskliausk: $(x + 3)^2 = x^2 + \\ldots x + 9$. Koks skaičius prieš $x$?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: '$(a + b)^2 = a^2 + 2ab + b^2$, tad vidurinis narys $2 \\cdot 3 = 6$.',
  },
] as const

export const greitosiosFormules: Generatorius = (lygis) =>
  suBandymais(() => kurkFormule(lygis), A_FORMULES, 'greitosios-formules')

function kurkFormule(lygis: Lygis): Uzdavinys | null {
  const b = atsitiktinis(2, 20)

  if (lygis === 1) {
    return uzdavinys('greitosios-formules', {
      klausimas: `Atskliausk: $(x + ${b})^2 = x^2 + \\ldots x + ${b * b}$. Koks skaičius rašomas prieš $x$?`,
      atsakymas: String(2 * b),
      atsakymasRodymui: `$${2 * b}$`,
      sprendimas: `$(a + b)^2 = a^2 + 2ab + b^2$, tad vidurinis narys $2 \\cdot ${b} = ${2 * b}$.`,
    })
  }

  if (lygis === 2) {
    // Skirtumo kvadratas — laisvasis narys.
    return uzdavinys('greitosios-formules', {
      klausimas: `Atskliausk: $(x - ${b})^2 = x^2 - ${2 * b}x + \\ldots$. Koks laisvasis narys?`,
      atsakymas: String(b * b),
      atsakymasRodymui: `$${b * b}$`,
      sprendimas: `$(a - b)^2 = a^2 - 2ab + b^2$, tad laisvasis narys $${b}^2 = ${b * b}$.`,
    })
  }

  // 3 lygis — kvadratų skirtumo formulė skaičiams.
  const a = atsitiktinis(11, 40)
  const skirtumas = atsitiktinis(1, 5)
  const didesnis = a + skirtumas
  const rez = didesnis * didesnis - a * a

  return uzdavinys('greitosios-formules', {
    klausimas: `Apskaičiuok naudodamas kvadratų skirtumo formulę: $${didesnis}^2 - ${a}^2$`,
    atsakymas: String(rez),
    atsakymasRodymui: `$${rez}$`,
    sprendimas: `$a^2 - b^2 = (a - b)(a + b) = ${skirtumas} \\cdot ${didesnis + a} = ${rez}$.`,
  })
}

// ── Lygčių sistemos ─────────────────────────────────────────────────────────

const A_SISTEMOS = [
  {
    klausimas:
      'Išspręsk sistemą: $x + y = 10$ ir $x - y = 4$. Įrašyk $x$ reikšmę.',
    atsakymas: '7',
    atsakymasRodymui: '$x = 7$',
    sprendimas: 'Sudėjus abi lygtis: $2x = 14$, tad $x = 7$.',
  },
] as const

export const lygciuSistemos: Generatorius = (lygis) =>
  suBandymais(() => kurkSistema(lygis), A_SISTEMOS, 'lygciu-sistemos')

function kurkSistema(lygis: Lygis): Uzdavinys | null {
  // Sprendiniai parenkami pirma.
  const x = lygis === 1 ? atsitiktinis(2, 12) : atsitiktinisBe(-9, 12, [0])
  const y = lygis === 1 ? atsitiktinis(2, 12) : atsitiktinisBe(-9, 12, [0])

  if (lygis === 1) {
    const suma = x + y
    const skirtumas = x - y
    if (skirtumas === 0) return null
    return uzdavinys('lygciu-sistemos', {
      klausimas: `Išspręsk sistemą: $x + y = ${suma}$ ir $x - y = ${skirtumas}$. Įrašyk $x$ reikšmę.`,
      atsakymas: String(x),
      atsakymasRodymui: `$x = ${x}$`,
      sprendimas: `Sudėjus abi lygtis: $2x = ${suma + skirtumas}$, tad $x = ${x}$.`,
    })
  }

  const a = atsitiktinis(2, 6)
  const b = atsitiktinisBe(-5, 5, [0])
  const c = atsitiktinis(2, 6)
  const d = atsitiktinisBe(-5, 5, [0])
  // Sistema turi turėti vienintelį sprendinį.
  if (a * d - b * c === 0) return null

  const e = a * x + b * y
  const f = c * x + d * y
  if (Math.abs(e) > 90 || Math.abs(f) > 90) return null

  const klausiama = lygis === 3 ? 'y' : 'x'
  const atsakymas = klausiama === 'x' ? x : y

  return uzdavinys('lygciu-sistemos', {
    klausimas: `Išspręsk sistemą: $${narys(a, 'x', 0)} ${b > 0 ? '+' : '-'} ${Math.abs(
      b,
    )}y = ${e}$ ir $${narys(c, 'x', 0)} ${d > 0 ? '+' : '-'} ${Math.abs(
      d,
    )}y = ${f}$. Įrašyk $${klausiama}$ reikšmę.`,
    atsakymas: String(atsakymas),
    atsakymasRodymui: `$${klausiama} = ${atsakymas}$`,
    sprendimas: `Sistemos sprendinys yra $x = ${x}$, $y = ${y}$.`,
  })
}

// ── Funkcijos ───────────────────────────────────────────────────────────────

const A_FUNKCIJOS = [
  {
    klausimas: 'Funkcija $y = 3x - 5$. Kokia $y$ reikšmė, kai $x = 4$?',
    atsakymas: '7',
    atsakymasRodymui: '$y = 7$',
    sprendimas: '$y = 3 \\cdot 4 - 5 = 7$.',
  },
] as const

export const funkcijos: Generatorius = (lygis) =>
  suBandymais(() => kurkFunkcija(lygis), A_FUNKCIJOS, 'funkcijos')

function kurkFunkcija(lygis: Lygis): Uzdavinys | null {
  const k = atsitiktinisBe(-6, 6, [0, 1])
  const b = atsitiktinisBe(-15, 15, [0])

  if (lygis === 1) {
    const x = atsitiktinis(2, 10)
    const y = k * x + b
    if (Math.abs(y) > 90) return null
    return uzdavinys('funkcijos', {
      klausimas: `Funkcija $y = ${narys(k, 'x', b)}$. Kokia $y$ reikšmė, kai $x = ${x}$?`,
      atsakymas: String(y),
      atsakymasRodymui: `$y = ${y}$`,
      sprendimas: `$y = ${k} \\cdot ${x} ${b > 0 ? '+' : '-'} ${Math.abs(b)} = ${y}$.`,
    })
  }

  if (lygis === 2) {
    // Ieškomas x pagal duotą y — tas pats, kas išspręsti lygtį.
    const x = atsitiktinisBe(-8, 9, [0])
    const y = k * x + b
    if (Math.abs(y) > 90) return null
    return uzdavinys('funkcijos', {
      klausimas: `Funkcija $y = ${narys(k, 'x', b)}$. Su kuria $x$ reikšme $y = ${y}$?`,
      atsakymas: String(x),
      atsakymasRodymui: `$x = ${x}$`,
      sprendimas: `Sprendžiame $${narys(k, 'x', b)} = ${y}$ ir gauname $x = ${x}$.`,
    })
  }

  // 3 lygis — nulio taškas: kur grafikas kerta x ašį.
  const x = atsitiktinisBe(-9, 9, [0])
  const laisvasis = -k * x
  if (Math.abs(laisvasis) > 60) return null

  return uzdavinys('funkcijos', {
    klausimas: `Kuriame taške funkcijos $y = ${narys(k, 'x', laisvasis)}$ grafikas kerta $x$ ašį? Įrašyk $x$ reikšmę.`,
    atsakymas: String(x),
    atsakymasRodymui: `$x = ${x}$`,
    sprendimas: `Ašį $x$ grafikas kerta ten, kur $y = 0$: $${narys(
      k,
      'x',
      laisvasis,
    )} = 0$, tad $x = ${x}$.`,
  })
}
