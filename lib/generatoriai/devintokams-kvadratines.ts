import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { funkcijosGrafikas, keliosKreives } from './devintokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 9 klasės temos „Kvadratinė lygtis“ ir „Kvadratinė funkcija“ — devynios
 * potemės.
 *
 * Visų lygčių sprendiniai parenkami sveikieji, o diskriminantas — tikslus
 * kvadratas: tikrinama, ar mokinys moka taikyti formulę, o ne ar sugeba
 * suvesti iracionalųjį skaičių.
 */

/** Nario su kintamuoju užrašas. */
function narys(k: number, r = 'x'): string {
  if (k === 1) return r
  if (k === -1) return `-${r}`
  return `${k}${r}`
}

/** Tvarkingas ženklas prieš skaičių. */
function plius(b: number): string {
  return b < 0 ? ` - ${-b}` : ` + ${b}`
}

/** Kvadratinio trinario užrašas $ax^2 + bx + c$. */
function trinaris(a: number, b: number, c: number): string {
  let t = a === 1 ? 'x^2' : a === -1 ? '-x^2' : `${a}x^2`
  if (b !== 0) t += b < 0 ? ` - ${narys(-b)}` : ` + ${narys(b)}`
  if (c !== 0) t += plius(c)
  return t
}

/** Dvinaris $(x - n)$ su tvarkingu ženklu. */
function dvinaris(n: number): string {
  return n < 0 ? `(x + ${-n})` : `(x - ${n})`
}

// ── 3.1. Kvadratinės lygties samprata ───────────────────────────────────────

const T1 = 'kvadratines-lygties-samprata'

const A1 = [
  {
    klausimas: 'Nurodyk lygties $2x^2 - 3x + 5 = 0$ koeficientą $a$.',
    atsakymas: '2',
    atsakymasRodymui: '$a = 2$',
    sprendimas: '$a$ yra daugiklis prie $x^2$.',
  },
] as const

export const kvadratinesLygtiesSamprata: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  const a = atsitiktinis(1, 5)
  const b = atsitiktinis(-9, 9)
  const c = atsitiktinis(-9, 9)
  if (b === 0 || c === 0) return null
  const x1 = atsitiktinis(-5, 5)
  const x2 = atsitiktinis(-5, 5)
  if (x1 === x2) return null

  return variacija([
    // 1. Koeficientas a
    () =>
      uzdavinys(T1, {
        klausimas: `Nurodyk lygties $${trinaris(a, b, c)} = 0$ koeficientą $a$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$a = ${a}$`,
        sprendimas: '$a$ yra daugiklis prie $x^2$.',
      }),

    // 2. Koeficientas b
    () =>
      uzdavinys(T1, {
        klausimas: `Nurodyk lygties $${trinaris(a, b, c)} = 0$ koeficientą $b$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$b = ${b}$`,
        sprendimas: '$b$ yra daugiklis prie $x$ kartu su ženklu.',
      }),

    // 3. Kuri lygtis kvadratinė
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuri lygtis yra kvadratinė?',
        variantai: ['$x^2 - 5x + 6 = 0$', '$3x - 7 = 0$', '$\\dfrac{1}{x} = 4$', '$x^3 = 8$'],
        teisingas: 0,
        sprendimas: 'Kvadratinėje lygtyje didžiausias nežinomojo laipsnis yra 2.',
      }),

    // 4. Sąlyga koeficientui a
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kokia sąlyga turi galioti koeficientui $a$ lygtyje $ax^2 + bx + c = 0$?',
        variantai: ['$a \\ne 0$', '$a > 0$', '$a = 1$', '$a$ gali būti bet koks'],
        teisingas: 0,
        sprendimas: 'Jei $a = 0$, narys su $x^2$ išnyksta ir lygtis tampa tiesinė.',
      }),

    // 5. Į standartinę formą
    () => {
      const k = atsitiktinis(2, 5)
      const m = atsitiktinis(1, 6)
      const d = atsitiktinis(2, 9)
      return uzdavinys(T1, {
        klausimas: `Paversk lygtį $${k}x(x - ${m}) = ${d}$ standartine forma. Koks bus laisvasis narys $c$?`,
        atsakymas: String(-d),
        atsakymasRodymui: `$${k}x^2 - ${k * m}x - ${d} = 0$`,
        sprendimas: `Atskleidus skliaustus ir perkėlus $${d}$ į kairę, gaunama $c = -${d}$.`,
      })
    },

    // 6. Sandaugos formos pertvarkymas
    () => {
      const p = atsitiktinis(1, 6)
      const q = atsitiktinis(1, 6)
      const d = atsitiktinis(2, 9)
      return uzdavinys(T1, {
        klausimas: `Paversk lygtį $(x - ${p})(x + ${q}) = ${d}$ standartine forma. Koks bus koeficientas $b$?`,
        atsakymas: String(q - p),
        atsakymasRodymui: `$x^2${plius(q - p)}x - ${p * q + d} = 0$`,
        sprendimas: `Sudauginus: $x^2 + (${q} - ${p})x - ${p * q}$; perkėlus $${d}$ gaunama laisvasis narys $-${p * q + d}$.`,
      })
    },

    // 7. Pilnoji ar nepilnoji
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Sujunk lygtį su jos rūšimi.',
        poros: [
          { kaire: '$x^2 - 5x + 6 = 0$', desine: 'pilnoji' },
          { kaire: '$x^2 - 9 = 0$', desine: 'nepilnoji' },
          { kaire: '$3x^2 + 7x = 0$', desine: 'nepilnoji' },
          { kaire: '$2x^2 + x - 1 = 0$', desine: 'pilnoji' },
        ],
        sprendimas: 'Nepilnojoje trūksta nario su $x$ arba laisvojo nario.',
      }),
  ])
}

// ── 3.2. Nepilnosios kvadratinės lygtys ─────────────────────────────────────

const T2 = 'nepilnosios-kvadratines'

const A2 = [
  {
    klausimas: 'Išspręsk $x^2 - 25 = 0$. Užrašyk teigiamąjį sprendinį.',
    atsakymas: '5',
    atsakymasRodymui: '$x = 5$ arba $x = -5$',
    sprendimas: '$x^2 = 25$, tad $x = \\pm 5$.',
  },
] as const

export const nepilnosiosKvadratines: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  const n = atsitiktinis(2, 12)
  const k = atsitiktinis(2, 6)
  const m = atsitiktinis(2, 9)

  return variacija([
    // 1. x² − n² = 0
    () =>
      uzdavinys(T2, {
        klausimas: `Išspręsk $x^2 - ${n * n} = 0$. Užrašyk teigiamąjį sprendinį.`,
        atsakymas: String(n),
        atsakymasRodymui: `$x = ${n}$ arba $x = -${n}$`,
        sprendimas: `$x^2 = ${n * n}$, tad $x = \\pm ${n}$.`,
      }),

    // 2. ax² = b
    () =>
      uzdavinys(T2, {
        klausimas: `Išspręsk $${k}x^2 = ${k * n * n}$. Užrašyk teigiamąjį sprendinį.`,
        atsakymas: String(n),
        atsakymasRodymui: `$x = ${n}$ arba $x = -${n}$`,
        sprendimas: `$x^2 = ${n * n}$, tad $x = \\pm ${n}$.`,
      }),

    // 3. ax² + bx = 0
    () =>
      uzdavinys(T2, {
        klausimas: `Išspręsk $${k}x^2 - ${k * m}x = 0$. Užrašyk nenulinį sprendinį.`,
        atsakymas: String(m),
        atsakymasRodymui: `$x = 0$ arba $x = ${m}$`,
        sprendimas: `Iškėlus: $${k}x(x - ${m}) = 0$.`,
      }),

    // 4. Su teigiamu nariu
    () =>
      uzdavinys(T2, {
        klausimas: `Išspręsk $x^2 + ${m}x = 0$. Užrašyk nenulinį sprendinį.`,
        atsakymas: String(-m),
        atsakymasRodymui: `$x = 0$ arba $x = -${m}$`,
        sprendimas: `$x(x + ${m}) = 0$.`,
      }),

    // 5. Kiek sprendinių
    () =>
      uzdavinys(T2, {
        klausimas: `Kiek sprendinių turi lygtis $x^2 + ${n * n} = 0$?`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Kvadratas neneigiamas, tad suma su teigiamu skaičiumi niekada nelygi nuliui.',
      }),

    // 6. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Iš lygties $x^2 = ${n * n}$ mokinys gavo tik $x = ${n}$. Kokį sprendinį jis pamiršo?`,
        atsakymas: String(-n),
        atsakymasRodymui: `$x = -${n}$`,
        sprendimas: `$(-${n})^2 = ${n * n}$ — neigiamasis skaičius taip pat tinka.`,
      }),

    // 7. Sprendinių suma
    () =>
      uzdavinys(T2, {
        klausimas: `Išspręsk $${k}x^2 - ${k * m}x = 0$ ir apskaičiuok sprendinių sumą.`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$`,
        sprendimas: `Sprendiniai $0$ ir $${m}$, jų suma $${m}$.`,
      }),
  ])
}

// ── 3.3. Pilnoji kvadratinė lygtis ──────────────────────────────────────────

const T3 = 'pilnoji-kvadratine'

const A3 = [
  {
    klausimas: 'Kuo pilnoji kvadratinė lygtis skiriasi nuo nepilnosios?',
    atsakymas: 'visi koeficientai nenuliniai',
    atsakymasRodymui: 'Pilnojoje visi koeficientai $a$, $b$ ir $c$ nelygūs nuliui',
    sprendimas: 'Nepilnojoje trūksta nario su $x$ arba laisvojo nario.',
  },
] as const

export const pilnojiKvadratine: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const a = atsitiktinis(1, 4)
  const b = atsitiktinis(-8, 8)
  const c = atsitiktinis(-8, 8)
  if (b === 0 || c === 0) return null
  const p = atsitiktinis(1, 6)
  const q = atsitiktinis(1, 6)

  return variacija([
    // 1. Ar pilnoji
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Ar lygtis $${trinaris(a, b, c)} = 0$ yra pilnoji?`,
        variantai: ['taip, nes visi trys koeficientai nelygūs nuliui', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Pilnojoje lygtyje yra ir narys su $x$, ir laisvasis narys.',
      }),

    // 2. Kuo skiriasi
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuo pilnoji kvadratinė lygtis skiriasi nuo nepilnosios?',
        variantai: [
          'pilnojoje visi koeficientai $a$, $b$ ir $c$ nelygūs nuliui',
          'pilnojoje $a = 1$',
          'pilnoji visada turi du sprendinius',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Nepilnojoje trūksta nario su $x$ arba laisvojo nario.',
      }),

    // 3. Pertvarkymas į pilnąją formą
    () => {
      const d = atsitiktinis(2, 9)
      return uzdavinys(T3, {
        klausimas: `Paversk lygtį $x(x + ${p}) = ${d}$ pilnosios kvadratinės lygties forma. Koks bus laisvasis narys?`,
        atsakymas: String(-d),
        atsakymasRodymui: `$x^2 + ${p}x - ${d} = 0$`,
        sprendimas: `Atskleidus skliaustus ir perkėlus $${d}$ į kairę.`,
      })
    },

    // 4. Sandaugos pertvarkymas
    () => {
      const d = atsitiktinis(2, 9)
      return uzdavinys(T3, {
        klausimas: `Paversk lygtį $(x - ${p})(x + ${q}) = ${d}$ standartine forma. Koks bus laisvasis narys?`,
        atsakymas: String(-p * q - d),
        atsakymasRodymui: `$x^2${plius(q - p)}x - ${p * q + d} = 0$`,
        sprendimas: `$-${p} \\cdot ${q} = -${p * q}$; dar atimame $${d}$.`,
      })
    },

    // 5. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Mokinys lygtį $x^2 - ${p * p} = 0$ pavadino pilnąja. Kodėl tai klaida?`,
        variantai: [
          'nes joje nėra nario su $x$, tad $b = 0$',
          'nes joje nėra $x^2$',
          'nes koeficientas $a$ lygus nuliui',
          'iš tikrųjų ji pilnoji',
        ],
        teisingas: 0,
        sprendimas: 'Tai nepilnoji kvadratinė lygtis.',
      }),

    // 6. Parametras
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Su kuria $m$ reikšme lygtis $2x^2 + (m - 1)x + 5 = 0$ nebūtų pilnoji?',
        variantai: ['$m = 1$', '$m = 0$', '$m = 2$', '$m = -1$'],
        teisingas: 0,
        sprendimas: 'Tada $b = 0$ ir lieka nepilnoji lygtis.',
      }),

    // 7. Koeficientų suma
    () =>
      uzdavinys(T3, {
        klausimas: `Kam lygi lygties $${trinaris(a, b, c)} = 0$ koeficientų suma $a + b + c$?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$`,
        sprendimas: `$${a} + (${b}) + (${c}) = ${a + b + c}$.`,
      }),
  ])
}

// ── 3.4. Kvadratinės lygties sprendinių formulės ────────────────────────────

const T4 = 'sprendiniu-formules'

const A4 = [
  {
    klausimas: 'Apskaičiuok lygties $x^2 - 5x + 6 = 0$ diskriminantą.',
    atsakymas: '1',
    atsakymasRodymui: '$D = 1$',
    sprendimas: '$D = 25 - 24 = 1$.',
  },
] as const

export const sprendiniuFormules: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  const x1 = atsitiktinis(-6, 6)
  const x2 = atsitiktinis(-6, 6)
  if (x1 === x2) return null
  const b = -(x1 + x2)
  const c = x1 * x2
  const D = b * b - 4 * c
  const didesnis = Math.max(x1, x2)
  const n = atsitiktinis(2, 7)

  return variacija([
    // 1. Diskriminantas
    () =>
      uzdavinys(T4, {
        klausimas: `Apskaičiuok lygties $${trinaris(1, b, c)} = 0$ diskriminantą.`,
        atsakymas: String(D),
        atsakymasRodymui: `$D = ${D}$`,
        sprendimas: `$D = b^2 - 4ac = (${b})^2 - 4 \\cdot 1 \\cdot (${c}) = ${D}$.`,
      }),

    // 2. Didesnysis sprendinys
    () =>
      uzdavinys(T4, {
        klausimas: `Išspręsk $${trinaris(1, b, c)} = 0$. Užrašyk didesnįjį sprendinį.`,
        atsakymas: String(didesnis),
        atsakymasRodymui: `$x_1 = ${Math.min(x1, x2)}$, $x_2 = ${didesnis}$`,
        sprendimas: `$D = ${D}$, $\\sqrt{D} = ${Math.sqrt(D)}$; $x = \\dfrac{${-b} \\pm ${Math.sqrt(D)}}{2}$.`,
      }),

    // 3. Kiek sprendinių, kai D = 0
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek realiųjų sprendinių turi lygtis $x^2 + ${2 * n}x + ${n * n} = 0$?`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: `$D = ${4 * n * n} - ${4 * n * n} = 0$, tad sprendinys vienas.`,
      }),

    // 4. Kiek sprendinių, kai D < 0
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek realiųjų sprendinių turi lygtis $x^2 + x + ${n + 2} = 0$?`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: `$D = 1 - ${4 * (n + 2)} < 0$, tad realiųjų sprendinių nėra.`,
      }),

    // 5. Ką rodo diskriminanto ženklas
    () =>
      poruUzdavinys(naujasId(T4), T4, {
        klausimas: 'Sujunk diskriminanto reikšmę su sprendinių skaičiumi.',
        poros: [
          { kaire: '$D > 0$', desine: 'du skirtingi sprendiniai' },
          { kaire: '$D = 0$', desine: 'vienas sprendinys' },
          { kaire: '$D < 0$', desine: 'realiųjų sprendinių nėra' },
          { kaire: '$D$ — tikslus kvadratas', desine: 'sprendiniai racionalieji' },
        ],
        sprendimas: 'Diskriminantas yra po šaknies ženklu, tad jo ženklas viską ir lemia.',
      }),

    // 6. Parametras vienam sprendiniui
    () =>
      uzdavinys(T4, {
        klausimas: `Su kuria $m$ reikšme lygtis $x^2 - ${2 * n}x + m = 0$ turi lygiai vieną realųjį sprendinį?`,
        atsakymas: String(n * n),
        atsakymasRodymui: `$m = ${n * n}$`,
        sprendimas: `$D = ${4 * n * n} - 4m = 0$, tad $m = ${n * n}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: 'Lygties $2x^2 - 5x - 3 = 0$ diskriminantą mokinys apskaičiavo $D = 25 - 24 = 1$. Koks yra teisingas $D$?',
        atsakymas: '49',
        atsakymasRodymui: '$D = 49$',
        sprendimas: '$D = 25 - 4 \\cdot 2 \\cdot (-3) = 25 + 24 = 49$ — atimant neigiamą $c$ ženklas keičiasi.',
      }),
  ])
}

// ── 3.5. Kvadratinio trinario skaidymas dauginamaisiais ─────────────────────

const T5 = 'trinario-skaidymas'

const A5 = [
  {
    klausimas: 'Išskaidyk $x^2 + 5x + 6$ dauginamaisiais. Užrašyk mažesnįjį skaičių skliaustuose.',
    atsakymas: '2',
    atsakymasRodymui: '$(x + 2)(x + 3)$',
    sprendimas: 'Ieškomi skaičiai, kurių suma 5, o sandauga 6.',
  },
] as const

export const trinarioSkaidymas: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const x1 = atsitiktinis(-6, 6)
  const x2 = atsitiktinis(-6, 6)
  if (x1 === x2 || x1 === 0 || x2 === 0) return null
  const b = -(x1 + x2)
  const c = x1 * x2
  const n = atsitiktinis(2, 10)

  return variacija([
    // 1. Skaidymas
    () =>
      uzdavinys(T5, {
        klausimas: `Išskaidyk $${trinaris(1, b, c)}$ dauginamaisiais. Užrašyk mažesnįjį lygties šaknį.`,
        atsakymas: String(Math.min(x1, x2)),
        atsakymasRodymui: `$${dvinaris(Math.min(x1, x2))}${dvinaris(Math.max(x1, x2))}$`,
        sprendimas: `Trinaris skaidomas $a(x - x_1)(x - x_2)$, kur $x_1$ ir $x_2$ — lygties šaknys.`,
      }),

    // 2. Kvadratų skirtumas
    () =>
      uzdavinys(T5, {
        klausimas: `Išskaidyk $x^2 - ${n * n}$. Užrašyk skaičių, esantį skliaustuose.`,
        atsakymas: String(n),
        atsakymasRodymui: `$(x + ${n})(x - ${n})$`,
        sprendimas: `$${n * n} = ${n}^2$, tad tinka kvadratų skirtumo formulė.`,
      }),

    // 3. Patikra
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kaip patikrinti, ar trinaris išskaidytas teisingai?',
        variantai: [
          'sudauginti gautus dauginamuosius ir palyginti su pradiniu trinariu',
          'įrašyti $x = 0$',
          'suskaičiuoti narius',
          'patikrinti negalima',
        ],
        teisingas: 0,
        sprendimas: 'Daugyba yra atvirkštinis skaidymo veiksmas.',
      }),

    // 4. Su vyresniuoju koeficientu
    () => {
      const a = atsitiktinis(2, 3)
      const p = atsitiktinis(1, 4)
      const q = atsitiktinis(1, 4)
      return uzdavinys(T5, {
        klausimas: `Išskaidyk $${a}x^2 + ${a * q + p}x + ${p * q}$ dauginamaisiais. Koks koeficientas bus prieš $x$ pirmajame skliauste?`,
        atsakymas: String(a),
        atsakymasRodymui: `$(${a}x + ${p})(x + ${q})$`,
        sprendimas: `Sudauginus $(${a}x + ${p})(x + ${q})$ gaunamas pradinis trinaris.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const p = atsitiktinis(2, 6)
      const q = p + atsitiktinis(1, 4)
      return uzdavinys(T5, {
        klausimas: `Trinarį $x^2 + ${q - p}x - ${p * q}$ mokinys išskaidė $(x + ${q})(x + ${p})$. Koks skaičius turi būti su minusu?`,
        atsakymas: String(p),
        atsakymasRodymui: `$(x + ${q})(x - ${p})$`,
        sprendimas: `Laisvasis narys neigiamas, tad skliaustų ženklai turi būti skirtingi.`,
      })
    },

    // 6. Lygties sprendimas per skaidymą
    () =>
      uzdavinys(T5, {
        klausimas: `Išspręsk lygtį $${trinaris(1, b, c)} = 0$ išskaidydamas kairiąją pusę. Užrašyk didesnįjį sprendinį.`,
        atsakymas: String(Math.max(x1, x2)),
        atsakymasRodymui: `$x = ${Math.min(x1, x2)}$ arba $x = ${Math.max(x1, x2)}$`,
        sprendimas: `Sandauga lygi nuliui, kai bent vienas dauginamasis lygus nuliui.`,
      }),

    // 7. Koeficientas iš skaidinio
    () => {
      const p = atsitiktinis(1, 6)
      const q = atsitiktinis(1, 6)
      return uzdavinys(T5, {
        klausimas: `Su kuriuo $k$ trinarį $x^2 + kx + ${p * q}$ galima išskaidyti kaip $(x + ${p})(x + ${q})$?`,
        atsakymas: String(p + q),
        atsakymasRodymui: `$k = ${p + q}$`,
        sprendimas: `$${p} + ${q} = ${p + q}$.`,
      })
    },
  ])
}

// ── 3.6. Vijeto teorema ─────────────────────────────────────────────────────

const T6 = 'vijeto-teorema'

const A6 = [
  {
    klausimas: 'Lygties $x^2 - 7x + 10 = 0$ sprendinių suma?',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: 'Pagal Vijeto teoremą $x_1 + x_2 = -b$.',
  },
] as const

export const vijetoTeorema: Generatorius = () => suBandymais(kurk6, A6, T6)

function kurk6(): Uzdavinys | null {
  const x1 = atsitiktinis(-7, 7)
  const x2 = atsitiktinis(-7, 7)
  if (x1 === x2) return null
  const b = -(x1 + x2)
  const c = x1 * x2

  return variacija([
    // 1. Sprendinių suma
    () =>
      uzdavinys(T6, {
        klausimas: `Lygties $${trinaris(1, b, c)} = 0$ sprendiniai $x_1$ ir $x_2$. Kam lygi $x_1 + x_2$?`,
        atsakymas: String(x1 + x2),
        atsakymasRodymui: `$${x1 + x2}$`,
        sprendimas: `Pagal Vijeto teoremą $x_1 + x_2 = -b = ${-b}$.`,
      }),

    // 2. Sprendinių sandauga
    () =>
      uzdavinys(T6, {
        klausimas: `Lygties $${trinaris(1, b, c)} = 0$ sprendiniai $x_1$ ir $x_2$. Kam lygi $x_1 x_2$?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$`,
        sprendimas: `Pagal Vijeto teoremą $x_1 x_2 = c = ${c}$.`,
      }),

    // 3. Sprendimas be diskriminanto
    () =>
      uzdavinys(T6, {
        klausimas: `Nenaudodamas diskriminanto rask lygties $${trinaris(1, b, c)} = 0$ didesnįjį sprendinį.`,
        atsakymas: String(Math.max(x1, x2)),
        atsakymasRodymui: `$${Math.min(x1, x2)}$ ir $${Math.max(x1, x2)}$`,
        sprendimas: `Ieškomi du skaičiai, kurių suma $${x1 + x2}$, o sandauga $${c}$.`,
      }),

    // 4. Lygties sudarymas
    () =>
      uzdavinys(T6, {
        klausimas: `Sudaryk kvadratinę lygtį, kurios sprendiniai yra ${x1} ir ${x2}. Koks bus koeficientas $b$?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${trinaris(1, b, c)} = 0$`,
        sprendimas: `$b = -(x_1 + x_2) = ${b}$, $c = x_1 x_2 = ${c}$.`,
      }),

    // 5. Ką sieja teorema
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Ką teigia Vijeto teorema lygčiai $x^2 + bx + c = 0$?',
        variantai: [
          'sprendinių suma lygi $-b$, o sandauga lygi $c$',
          'sprendinių suma lygi $b$, o sandauga $-c$',
          'sprendinių suma lygi $c$',
          'sprendinių sandauga lygi $b$',
        ],
        teisingas: 0,
        sprendimas: 'Todėl sprendinius dažnai galima atspėti iš galvos.',
      }),

    // 6. Parametras
    () => {
      const p = atsitiktinis(1, 6)
      const q = atsitiktinis(1, 6)
      return uzdavinys(T6, {
        klausimas: `Lygties $x^2 + px + ${p * q} = 0$ sprendiniai yra $-${p}$ ir $-${q}$. Rask $p$.`,
        atsakymas: String(p + q),
        atsakymasRodymui: `$p = ${p + q}$`,
        sprendimas: `Sprendinių suma $-${p + q}$, tad $p = ${p + q}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: 'Lygties $x^2 - 6x - 16 = 0$ sprendinių sandaugą mokinys nurodė $16$. Kokia ji iš tikrųjų?',
        atsakymas: '-16',
        atsakymasRodymui: '$-16$',
        sprendimas: 'Sandauga lygi $c$ kartu su jo ženklu, o $c = -16$.',
      }),
  ])
}

// ── 4.1. Kvadratinės funkcijos samprata ─────────────────────────────────────

const T7 = 'kvadratines-funkcijos-samprata'

const A7 = [
  {
    klausimas: 'Nurodyk funkcijos $y = -x^2 + 4x - 5$ koeficientą $a$.',
    atsakymas: '-1',
    atsakymasRodymui: '$a = -1$',
    sprendimas: '$a$ yra daugiklis prie $x^2$.',
  },
] as const

export const kvadratinesFunkcijosSamprata: Generatorius = () => suBandymais(kurk7, A7, T7)

function kurk7(): Uzdavinys | null {
  const a = pasirink([-3, -2, -1, 1, 2, 3])
  const b = atsitiktinis(-6, 6)
  const c = atsitiktinis(-6, 6)
  if (b === 0 || c === 0) return null
  const x = atsitiktinis(-3, 3)

  return variacija([
    // 1. Koeficientas a
    () =>
      uzdavinys(T7, {
        klausimas: `Nurodyk funkcijos $y = ${trinaris(a, b, c)}$ koeficientą $a$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$a = ${a}$`,
        sprendimas: '$a$ yra daugiklis prie $x^2$.',
      }),

    // 2. Reikšmė
    () =>
      uzdavinys(T7, {
        klausimas: `Apskaičiuok funkcijos $y = ${trinaris(a, b, c)}$ reikšmę, kai $x = ${x}$.`,
        atsakymas: String(a * x * x + b * x + c),
        atsakymasRodymui: `$${a * x * x + b * x + c}$`,
        sprendimas: `$${a} \\cdot (${x})^2 + (${b}) \\cdot (${x}) + (${c}) = ${a * x * x + b * x + c}$.`,
      }),

    // 3. Kuri funkcija kvadratinė
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kuri funkcija yra kvadratinė?',
        variantai: ['$y = 2x^2 - 3x + 1$', '$y = 5x - 2$', '$y = \\dfrac{2}{x}$', '$y = x^3$'],
        teisingas: 0,
        sprendimas: 'Kvadratinėje funkcijoje didžiausias laipsnis yra 2.',
      }),

    // 4. Kodėl a ≠ 0
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kodėl funkcijoje $y = ax^2 + bx + c$ koeficientas $a$ negali būti nulis?',
        variantai: [
          'nes tada išnyktų narys su $x^2$ ir funkcija taptų tiesinė',
          'nes tada nebūtų grafiko',
          'nes tada $b$ taip pat būtų nulis',
          'jis gali būti nulis',
        ],
        teisingas: 0,
        sprendimas: 'Būtent narys su $x^2$ daro funkciją kvadratine.',
      }),

    // 5. Į kurią pusę atsidaro
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Į kurią pusę atsidaro funkcijos $y = ${trinaris(a, b, c)}$ parabolė?`,
        variantai: a > 0 ? ['į viršų', 'į apačią', 'į šoną'] : ['į apačią', 'į viršų', 'į šoną'],
        teisingas: 0,
        sprendimas: `Koeficientas $a = ${a}$, tad parabolė atsidaro ${a > 0 ? 'į viršų' : 'į apačią'}.`,
        brezinys:
          Math.abs(c - (b * b) / (4 * a)) <= 4
            ? funkcijosGrafikas((t) => a * t * t + b * t + c, { iki: 6 })
            : undefined,
      }),

    // 6. Parametras
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Su kuria $m$ reikšme funkcija $y = (m - 2)x^2 + 3x + 1$ nebūtų kvadratinė?',
        variantai: ['$m = 2$', '$m = 0$', '$m = 3$', '$m = -2$'],
        teisingas: 0,
        sprendimas: 'Tada $a = 0$ ir lieka tiesinė funkcija.',
      }),

    // 7. Priešingos kryptys
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kuo skiriasi funkcijų $y = x^2$ ir $y = -x^2$ grafikai?',
        variantai: [
          'pirmasis atsidaro į viršų, antrasis — į apačią',
          'jie sutampa',
          'antrasis siauresnis',
          'antrasis paslinktas į dešinę',
        ],
        teisingas: 0,
        sprendimas: 'Ženklas prie $x^2$ lemia parabolės kryptį.',
        brezinys: keliosKreives([
          { f: (t) => t * t, vardas: 'y=x²' },
          { f: (t) => -t * t, vardas: 'y=-x²' },
        ]),
      }),
  ])
}

// ── 4.2. Grafiko transformacijos ────────────────────────────────────────────

const T8 = 'grafiko-transformacijos'

const A8 = [
  {
    klausimas: 'Nurodyk funkcijos $y = (x - 1)^2 - 5$ viršūnės abscisę.',
    atsakymas: '1',
    atsakymasRodymui: '$V(1; -5)$',
    sprendimas: 'Viršūnė yra $(h; k)$, kai $y = (x - h)^2 + k$.',
  },
] as const

export const grafikoTransformacijos: Generatorius = () => suBandymais(kurk8, A8, T8)

function kurk8(): Uzdavinys | null {
  const h = atsitiktinis(-3, 3)
  const k = atsitiktinis(-4, 4)
  if (h === 0 && k === 0) return null

  return variacija([
    // 1. Viršūnės abscisė
    () =>
      uzdavinys(T8, {
        klausimas: `Nurodyk funkcijos $y = (x${h < 0 ? ` + ${-h}` : ` - ${h}`})^2${plius(k)}$ viršūnės abscisę.`,
        atsakymas: String(h),
        atsakymasRodymui: `$V(${h}; ${k})$`,
        sprendimas: 'Užraše $y = (x - h)^2 + k$ viršūnė yra taškas $(h; k)$.',
      }),

    // 2. Viršūnės ordinatė
    () =>
      uzdavinys(T8, {
        klausimas: `Nurodyk funkcijos $y = (x${h < 0 ? ` + ${-h}` : ` - ${h}`})^2${plius(k)}$ viršūnės ordinatę.`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: 'Tai skaičius, pridėtas prie kvadrato.',
      }),

    // 3. Postūmis aukštyn
    () => {
      const d = atsitiktinis(1, 4)
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Kaip pasikeičia grafikas $y = x^2$, pereinant prie $y = x^2 + ${d}$?`,
        variantai: [
          `pasislenka ${d} vienetais aukštyn`,
          `pasislenka ${d} vienetais žemyn`,
          `pasislenka ${d} vienetais į dešinę`,
          'tampa siauresnis',
        ],
        teisingas: 0,
        sprendimas: 'Skaičius, pridėtas prie visos funkcijos, stumia grafiką vertikaliai.',
        brezinys: keliosKreives([
          { f: (x) => x * x, vardas: 'y=x²' },
          { f: (x) => x * x + d, vardas: `y=x²+${d}` },
        ]),
      })
    },

    // 4. Postūmis į šoną
    () => {
      const d = atsitiktinis(1, 3)
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Kaip pasikeičia grafikas $y = x^2$, pereinant prie $y = (x - ${d})^2$?`,
        variantai: [
          `pasislenka ${d} vienetais į dešinę`,
          `pasislenka ${d} vienetais į kairę`,
          `pasislenka ${d} vienetais žemyn`,
          'apsiverčia',
        ],
        teisingas: 0,
        sprendimas: 'Skaičius, atimtas nuo $x$, stumia grafiką į dešinę.',
      })
    },

    // 5. Klaidos radimas
    () => {
      const d = atsitiktinis(1, 4)
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Mokinys teigia, kad $y = (x + ${d})^2$ grafikas paslinktas ${d} vienetais į dešinę. Kodėl tai klaida?`,
        variantai: [
          `nes pliusas skliaustuose stumia grafiką į kairę`,
          'nes grafikas nepasislenka',
          'nes grafikas pasislenka aukštyn',
          'iš tikrųjų tai tiesa',
        ],
        teisingas: 0,
        sprendimas: `$(x + ${d})^2 = (x - (-${d}))^2$, tad viršūnė yra ties $-${d}$.`,
      })
    },

    // 6. Formulė iš viršūnės
    () =>
      uzdavinys(T8, {
        klausimas: `Parabolė atsidaro į viršų, o jos viršūnė yra $V(${h}; ${k})$. Koks skaičius bus skliaustuose užraše $y = (x - \\ldots)^2 + \\ldots$?`,
        atsakymas: String(h),
        atsakymasRodymui: `$y = (x${h < 0 ? ` + ${-h}` : ` - ${h}`})^2${plius(k)}$`,
        sprendimas: 'Skliaustuose rašoma viršūnės abscisė su priešingu ženklu.',
      }),

    // 7. Platumas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kurios parabolės siauresnės: $y = 2x^2$ ar $y = 0{,}5x^2$?',
        variantai: [
          '$y = 2x^2$, nes koeficientas didesnis',
          '$y = 0{,}5x^2$',
          'jos vienodo pločio',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Kuo didesnis $|a|$, tuo parabolė siauresnė.',
        brezinys: keliosKreives([
          { f: (x) => 2 * x * x, vardas: 'y=2x²' },
          { f: (x) => 0.5 * x * x, vardas: 'y=0,5x²' },
        ]),
      }),
  ])
}

// ── 4.3. Kvadratinės funkcijos grafikas ir savybės ──────────────────────────

const T9 = 'kvadratines-funkcijos-savybes'

const A9 = [
  {
    klausimas: 'Rask funkcijos $y = x^2 - 4$ teigiamąjį nulį.',
    atsakymas: '2',
    atsakymasRodymui: '$x = 2$ ir $x = -2$',
    sprendimas: '$x^2 = 4$.',
  },
] as const

export const kvadratinesFunkcijosSavybes: Generatorius = () => suBandymais(kurk9, A9, T9)

function kurk9(): Uzdavinys | null {
  const x1 = atsitiktinis(-4, 1)
  const x2 = x1 + atsitiktinis(2, 5)
  if ((x1 + x2) % 2 !== 0) return null
  const v = (x1 + x2) / 2
  const b = -(x1 + x2)
  const c = x1 * x2
  const w = v * v + b * v + c
  const n = atsitiktinis(2, 6)

  return variacija([
    // 1. Nuliai
    () =>
      uzdavinys(T9, {
        klausimas: `Rask funkcijos $y = ${trinaris(1, b, c)}$ didesnįjį nulį.`,
        atsakymas: String(x2),
        atsakymasRodymui: `$x = ${x1}$ ir $x = ${x2}$`,
        sprendimas: `Nuliai — kvadratinės lygties $${trinaris(1, b, c)} = 0$ sprendiniai.`,
      }),

    // 2. Viršūnės abscisė
    () =>
      uzdavinys(T9, {
        klausimas: `Rask funkcijos $y = ${trinaris(1, b, c)}$ viršūnės abscisę.`,
        atsakymas: String(v),
        atsakymasRodymui: `$x = ${v}$`,
        sprendimas: `$x = -\\dfrac{b}{2a} = ${v}$.`,
      }),

    // 3. Mažiausia reikšmė
    () =>
      uzdavinys(T9, {
        klausimas: `Kokia yra mažiausia funkcijos $y = ${trinaris(1, b, c)}$ reikšmė?`,
        atsakymas: String(w),
        atsakymasRodymui: `$${w}$`,
        sprendimas: `Viršūnėje $x = ${v}$, o $y = ${w}$.`,
        brezinys: funkcijosGrafikas((x) => x * x + b * x + c, { iki: 6 }),
      }),

    // 4. Simetrijos ašis
    () =>
      uzdavinys(T9, {
        klausimas: `Kokia yra funkcijos $y = ${trinaris(1, b, c)}$ grafiko simetrijos ašis? Užrašyk $x$ reikšmę.`,
        atsakymas: String(v),
        atsakymasRodymui: `$x = ${v}$`,
        sprendimas: 'Simetrijos ašis eina per viršūnę.',
      }),

    // 5. Didžiausia reikšmė
    () =>
      uzdavinys(T9, {
        klausimas: `Kokia yra didžiausia funkcijos $y = -2(x + 1)^2 + ${n}$ reikšmė?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Kvadratas neneigiamas, tad didžiausia reikšmė pasiekiama, kai $x = -1$.`,
      }),

    // 6. Kada reikšmės neigiamos
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kurioms $x$ reikšmėms funkcija $y = x^2 - ${n * n}$ yra neigiama?`,
        variantai: [
          `kai $-${n} < x < ${n}$`,
          `kai $x > ${n}$`,
          `kai $x < -${n}$`,
          'niekada',
        ],
        teisingas: 0,
        sprendimas: `Tarp nulių $-${n}$ ir $${n}$ parabolė yra žemiau $x$ ašies.`,
        brezinys: funkcijosGrafikas((x) => x * x - n * n, { iki: Math.max(5, n + 1) }),
      }),

    // 7. Viršūnė nėra nulis
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Mokinys parabolės viršūnę $V(2; -3)$ pavadino funkcijos nuliu. Kodėl tai klaida?',
        variantai: [
          'nes nulis yra $x$ reikšmė, kuriai $y = 0$, o čia $y = -3$',
          'nes viršūnė visada yra nulis',
          'nes viršūnė yra $y$ reikšmė',
          'iš tikrųjų tai tiesa',
        ],
        teisingas: 0,
        sprendimas: 'Nuliai yra sankirtos su $x$ ašimi taškai.',
      }),
  ])
}
