import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { funkcijosGrafikas } from './devintokams-vaizdai'
import { intervalas } from './septintokams-vaizdai'
import { zenkluAsis } from './desimtokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 10 klasės tema „Nelygybės ir jų sistemos“ — šešios potemės.
 *
 * Parabolė brėžinyje visada braižoma iš tos pačios funkcijos, apie kurią
 * klausiama, tad nuliai ir ženklo intervalai paveiksle sutampa su atsakymu.
 * Trupmeninėse nelygybėse vardiklio nuliai visur pažymėti tuščiu tašku — jie
 * niekada neįtraukiami į sprendinius.
 */

/** Trupmena KaTeX pavidalu. */
function tr(virsus: string, apacia: string): string {
  return `\\dfrac{${virsus}}{${apacia}}`
}

/** Narys su tvarkingu ženklu: $+3$ arba $-3$. */
function plius(b: number, kintamasis = ''): string {
  if (b === 0) return ''
  return b < 0 ? ` - ${-b}${kintamasis}` : ` + ${b}${kintamasis}`
}

/** Kvadratinis trinaris $x^2 + bx + c$. */
function trinaris(b: number, c: number): string {
  return `x^2${plius(b, 'x')}${plius(c)}`
}

/** Dvinaris $x - saknis$. */
function dvinaris(saknis: number): string {
  return saknis < 0 ? `x + ${-saknis}` : `x - ${saknis}`
}

// ── 4.1. Kvadratinės nelygybės samprata ─────────────────────────────────────

const T1 = 'kvadratines-nelygybes-samprata'

const A1 = [
  {
    klausimas: 'Nelygybėje $2x^2 - 3x - 5 \\le 0$ nurodyk koeficientą $b$.',
    atsakymas: '-3',
    atsakymasRodymui: '$b = -3$',
    sprendimas: 'Standartinis pavidalas yra $ax^2 + bx + c$, tad $a = 2$, $b = -3$, $c = -5$.',
  },
] as const

export const kvadratinesNelygybesSamprata: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  const a = pasirink([2, 3, 4])
  const b = pasirink([-5, -3, 3, 5])
  const c = pasirink([-8, -5, 4, 6])

  return variacija([
    // 1. Kuri nelygybė kvadratinė
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuri nelygybė yra kvadratinė?',
        variantai: ['$x^2 - 5x + 6 > 0$', '$3x - 2 \\le 7$', '$\\dfrac{2}{x} > 1$', '$5 - x \\ge 0$'],
        teisingas: 0,
        sprendimas: 'Kvadratinėje nelygybėje aukščiausias nežinomojo laipsnis yra antrasis, o jo koeficientas nelygus nuliui.',
      }),

    // 2. Koeficientų nurodymas
    () =>
      uzdavinys(T1, {
        klausimas: `Nelygybėje $${a}x^2${plius(b, 'x')}${plius(c)} \\le 0$ nurodyk koeficientą $b$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$b = ${b}$`,
        sprendimas: `Standartinis pavidalas yra $ax^2 + bx + c$, tad $a = ${a}$, $b = ${b}$, $c = ${c}$.`,
      }),

    // 3. Nelygybės užrašymas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuri iš šių nelygybių yra kvadratinė, kurios kairioji pusė yra $x^2 - 9$?',
        variantai: ['$x^2 - 9 > 0$', '$x - 9 > 0$', '$\\dfrac{x^2 - 9}{x} > 0$', '$x^2 = 9$'],
        teisingas: 0,
        sprendimas: 'Reiškinys turi likti kvadratinis, o ženklas — nelygybės, o ne lygybės.',
      }),

    // 4. Skirtumas nuo lygties
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuo kvadratinė nelygybė skiriasi nuo kvadratinės lygties?',
        variantai: [
          'Lygtis klausia, kada reiškinys lygus nuliui, o nelygybė — kada jis teigiamas arba neigiamas',
          'Nelygybė neturi sprendinių',
          'Nelygybėje nebūna laisvojo nario',
          'Lygtis visada turi daugiau sprendinių',
        ],
        teisingas: 0,
        sprendimas: 'Lygties sprendiniai yra atskiri skaičiai, o nelygybės — ištisi intervalai tarp tų skaičių.',
      }),

    // 5. Ar tikrai kvadratinė
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ar $0x^2 + 4x - 1 > 0$ yra kvadratinė nelygybė?',
        variantai: [
          'Ne, nes $a = 0$ ir lieka tiesinė nelygybė $4x - 1 > 0$',
          'Taip, nes joje yra $x^2$',
          'Taip, nes yra trys nariai',
          'Ne, nes dešinėje yra nulis',
        ],
        teisingas: 0,
        sprendimas: 'Kvadratinei nelygybei būtina sąlyga $a \\ne 0$.',
      }),

    // 6. Pertvarkymas į standartinį pavidalą
    () => {
      const m = atsitiktinis(2, 6)
      const n = atsitiktinis(2, 7)
      return uzdavinys(T1, {
        klausimas: `Nelygybę $x(x - ${m}) > ${n}x - 5$ paversk standartiniu pavidalu $x^2 + bx + c > 0$ ir užrašyk koeficientą $b$.`,
        atsakymas: String(-m - n),
        atsakymasRodymui: `$b = ${-m - n}$`,
        sprendimas: `$x^2 - ${m}x - ${n}x + 5 > 0$, tad $${trinaris(-m - n, 5)} > 0$ ir $b = ${-m - n}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Nelygybę $x^2 + 4 \\ge 0$ mokinys pavadino tiesine, nes joje nėra nario su $x$. Kur klaida?',
        variantai: [
          'Nelygybės rūšį lemia aukščiausias laipsnis, o čia jis antrasis — nelygybė kvadratinė',
          'Nelygybė iš tiesų tiesinė',
          'Nelygybė nėra nei tiesinė, nei kvadratinė',
          'Klaidos nėra, nes $b = 0$',
        ],
        teisingas: 0,
        sprendimas: 'Koeficientas $b$ gali būti nulis; svarbu tik tai, kad $a \\ne 0$.',
      }),

    // 8. Nelygybė pagal ribinius taškus
    () => {
      const maza = pasirink([-5, -3, -2])
      const didele = pasirink([2, 4, 5])
      return uzdavinys(T1, {
        klausimas: `Sukurk kvadratinę nelygybę, kurios ribiniai taškai būtų $${maza}$ ir $${didele}$, ir užrašyk jos laisvąjį narį $c$, kai kairioji pusė yra $(${dvinaris(maza)})(${dvinaris(didele)})$.`,
        atsakymas: String(maza * didele),
        atsakymasRodymui: `$c = ${maza * didele}$`,
        sprendimas: `$(${dvinaris(maza)})(${dvinaris(didele)}) = ${trinaris(-(maza + didele), maza * didele)}$, tad $c = ${maza * didele}$.`,
      })
    },

    // 9. Skliaustų atskleidimas
    () => {
      const m = atsitiktinis(1, 5)
      const n = atsitiktinis(2, 6)
      if (n === m) return null
      return uzdavinys(T1, {
        klausimas: `Nelygybę $(x - ${m})(x + ${n}) \\le ${n - m}x$ paversk standartiniu pavidalu ir užrašyk laisvąjį narį $c$.`,
        atsakymas: String(-m * n),
        atsakymasRodymui: `$c = ${-m * n}$`,
        sprendimas: `Atskleidę skliaustus kairėje gauname $${trinaris(n - m, -m * n)}$. Iš abiejų pusių atėmus $${n - m}x$, nariai su $x$ susinaikina ir lieka $x^2 - ${m * n} \\le 0$, tad $c = ${-m * n}$.`,
      })
    },

    // 10. Kodėl sprendinys yra intervalas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kodėl kvadratinės nelygybės sprendinys paprastai yra intervalas ar keli intervalai, o ne viena reikšmė?',
        variantai: [
          'Nes parabolė virš arba po $Ox$ ašimi yra ištisose $x$ reikšmių srityse, o ne atskiruose taškuose',
          'Nes kvadratinė lygtis turi dvi šaknis',
          'Nes nelygybėje visada yra du ženklai',
          'Nes intervalus lengviau užrašyti',
        ],
        teisingas: 0,
        sprendimas: 'Nuliai tik atskiria sritis; tarp jų ir už jų reiškinio ženklas nekinta.',
      }),
  ])
}

// ── 4.2. Kvadratinės nelygybės sprendimas pagal parabolės savybes ───────────

const T2 = 'nelygybe-parabole'

const A2 = [
  {
    klausimas: 'Išspręsk $x^2 - 5x + 6 < 0$ ir užrašyk didesnįjį sprendinių intervalo galą.',
    atsakymas: '3',
    atsakymasRodymui: '$x \\in (2; 3)$, didesnysis galas $3$',
    sprendimas: 'Parabolės nuliai yra $2$ ir $3$; šakos nukreiptos į viršų, tad neigiama ji tarp nulių.',
  },
] as const

export const nelygybeParabole: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  const maza = pasirink([1, 2, 3])
  const didele = pasirink([3, 4, 5])

  return variacija([
    // 1. Neigiama tarp nulių
    () => {
      if (maza >= didele) return null
      return uzdavinys(T2, {
        klausimas: `Brėžinyje pavaizduota parabolė. Išspręsk $${trinaris(-(maza + didele), maza * didele)} < 0$ ir užrašyk didesnįjį sprendinių intervalo galą.`,
        atsakymas: String(didele),
        atsakymasRodymui: `$x \\in (${maza}; ${didele})$`,
        sprendimas: `Parabolės nuliai yra $${maza}$ ir $${didele}$, o šakos nukreiptos į viršų, tad reikšmės neigiamos tarp nulių.`,
        brezinys: funkcijosGrafikas((t) => t * t - (maza + didele) * t + maza * didele, { iki: 6 }),
      })
    },

    // 2. Grafinis sprendimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Brėžinyje pavaizduota parabolė $y = x^2 - 4$. Kokie yra nelygybės $x^2 - 4 \\ge 0$ sprendiniai?',
        variantai: [
          '$x \\le -2$ arba $x \\ge 2$',
          '$-2 \\le x \\le 2$',
          '$x \\ge 2$',
          '$x \\le -2$',
        ],
        teisingas: 0,
        brezinys: funkcijosGrafikas((t) => t * t - 4, { iki: 6 }),
        sprendimas: 'Parabolė yra virš $Ox$ ašies arba ją liečia už nulių $-2$ ir $2$ ribų.',
      }),

    // 3. Uždarasis intervalas
    () => {
      if (maza >= didele) return null
      return uzdavinys(T2, {
        klausimas: `Remdamasis parabolės nuliais išspręsk $${trinaris(-(maza + didele), maza * didele)} \\le 0$ ir užrašyk didesnįjį sprendinių intervalo galą.`,
        atsakymas: String(didele),
        atsakymasRodymui: `$x \\in [${maza}; ${didele}]$`,
        sprendimas: `Nuliai $${maza}$ ir $${didele}$ dabar įtraukiami, nes ženklas negriežtas.`,
        brezinys: funkcijosGrafikas((t) => t * t - (maza + didele) * t + maza * didele, { iki: 6 }),
      })
    },

    // 4. Šakos žemyn
    () => {
      const k = pasirink([4, 9])
      return uzdavinys(T2, {
        klausimas: `Brėžinyje pavaizduota parabolė $y = -x^2 + ${k}$. Užrašyk teigiamą sprendinių intervalo galą, kai $-x^2 + ${k} > 0$.`,
        atsakymas: String(Math.sqrt(k)),
        atsakymasRodymui: `$x \\in (${-Math.sqrt(k)}; ${Math.sqrt(k)})$`,
        sprendimas: `Nuliai yra $${-Math.sqrt(k)}$ ir $${Math.sqrt(k)}$; kai šakos nukreiptos žemyn, reikšmės teigiamos tarp nulių.`,
        // Langas siekia iki parabolės viršūnės — kitaip jos smaigalys nukristų už rėmo.
        brezinys: funkcijosGrafikas((t) => -t * t + k, { iki: Math.max(6, k + 2) }),
      })
    },

    // 5. Šakų kryptis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kaip parabolės šakų kryptis padeda spręsti kvadratinę nelygybę?',
        variantai: [
          'Kai šakos į viršų, reiškinys neigiamas tarp nulių; kai žemyn — teigiamas tarp nulių',
          'Šakų kryptis sprendimui nesvarbi',
          'Kai šakos į viršų, reiškinys visada teigiamas',
          'Kai šakos žemyn, sprendinių nėra',
        ],
        teisingas: 0,
        sprendimas: 'Šakų kryptį lemia koeficiento $a$ ženklas, o jis ir nulemia, kurioje srityje reiškinys teigiamas.',
      }),

    // 6. Su koeficientu prie x²
    () => {
      const trejetas = pasirink([
        { a: 2, b: -7, c: 3, maza: '\\tfrac{1}{2}', didele: 3 },
        { a: 2, b: -5, c: 2, maza: '\\tfrac{1}{2}', didele: 2 },
        { a: 3, b: -10, c: 3, maza: '\\tfrac{1}{3}', didele: 3 },
      ])
      return uzdavinys(T2, {
        klausimas: `Išspręsk $${trejetas.a}x^2${plius(trejetas.b, 'x')}${plius(trejetas.c)} > 0$ ir užrašyk didesnįjį parabolės nulį.`,
        atsakymas: String(trejetas.didele),
        atsakymasRodymui: `$x = ${trejetas.didele}$`,
        sprendimas: `Nuliai yra $${trejetas.maza}$ ir $${trejetas.didele}$; kadangi $a > 0$, reiškinys teigiamas už nulių ribų.`,
        brezinys: funkcijosGrafikas((t) => trejetas.a * t * t + trejetas.b * t + trejetas.c, { iki: 6 }),
      })
    },

    // 7. Šakos žemyn su dviem nuliais
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Brėžinyje parabolės šakos nukreiptos žemyn, o nuliai yra $-1$ ir $4$. Kokie yra nelygybės $f(x) \\ge 0$ sprendiniai?',
        variantai: [
          '$-1 \\le x \\le 4$',
          '$x \\le -1$ arba $x \\ge 4$',
          '$x \\ge 4$',
          'Sprendinių nėra',
        ],
        teisingas: 0,
        brezinys: funkcijosGrafikas((t) => -(t + 1) * (t - 4), { iki: 7 }),
        sprendimas: 'Kai šakos žemyn, parabolė yra virš $Ox$ ašies būtent tarp nulių.',
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Spręsdamas $x^2 - 4 < 0$, mokinys užrašė $x < -2$ arba $x > 2$. Kur klaida?',
        variantai: [
          'Ten parabolė yra virš ašies; žemiau ašies ji yra tarp nulių, tad teisinga $-2 < x < 2$',
          'Klaidos nėra',
          'Reikėjo užrašyti $x \\le -2$ arba $x \\ge 2$',
          'Sprendinių iš viso nėra',
        ],
        teisingas: 0,
        brezinys: funkcijosGrafikas((t) => t * t - 4, { iki: 6 }),
        sprendimas: 'Ženklas $<$ reiškia, kad ieškoma sritis, kurioje parabolė yra po $Ox$ ašimi.',
      }),

    // 9. Su neigiamu koeficientu
    () => {
      const k = pasirink([3, 2])
      const maza2 = 1
      const didele2 = 3
      return uzdavinys(T2, {
        klausimas: `Išspręsk $-${k}x^2 + ${4 * k}x - ${3 * k} \\ge 0$ ir užrašyk didesnįjį sprendinių intervalo galą.`,
        atsakymas: String(didele2),
        atsakymasRodymui: `$x \\in [${maza2}; ${didele2}]$`,
        sprendimas: `Padalijus iš $-${k}$ ženklas apsiverčia: $${trinaris(-4, 3)} \\le 0$, tad $x \\in [1; 3]$.`,
        brezinys: funkcijosGrafikas((t) => -k * t * t + 4 * k * t - 3 * k, { iki: 6 }),
      })
    },

    // 10. Nelygybė pagal sprendinių aibę
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kurios nelygybės sprendinių aibė yra $[1; 5]$?',
        variantai: [
          '$x^2 - 6x + 5 \\le 0$',
          '$x^2 - 6x + 5 \\ge 0$',
          '$x^2 + 6x + 5 \\le 0$',
          '$x^2 - 6x + 5 < 0$',
        ],
        teisingas: 0,
        brezinys: funkcijosGrafikas((t) => t * t - 6 * t + 5, { iki: 7 }),
        sprendimas: 'Nuliai turi būti $1$ ir $5$, ženklas negriežtas, o šakos į viršų — tada sprendiniai yra būtent tarp nulių kartu su jais.',
      }),
  ])
}

// ── 4.3. Kvadratinės nelygybės keitimas nelygybių sistemomis ────────────────

const T3 = 'nelygybe-sistemomis'

const A3 = [
  {
    klausimas: 'Išspręsk $(x - 2)(x - 5) > 0$ ir užrašyk didesnįjį kritinį tašką.',
    atsakymas: '5',
    atsakymasRodymui: '$x \\in (-\\infty; 2) \\cup (5; +\\infty)$',
    sprendimas: 'Sandauga teigiama, kai abu dauginamieji teigiami arba abu neigiami.',
  },
] as const

export const nelygybeSistemomis: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const maza = pasirink([-5, -3, -2, 1, 2])
  const didele = pasirink([3, 4, 5, 6])

  return variacija([
    // 1. Teigiama sandauga
    () => {
      if (maza >= didele) return null
      return uzdavinys(T3, {
        klausimas: `Išspręsk $(${dvinaris(maza)})(${dvinaris(didele)}) > 0$, pakeisdamas dviem nelygybių sistemomis, ir užrašyk didesnįjį kritinį tašką.`,
        atsakymas: String(didele),
        atsakymasRodymui: `$x \\in (-\\infty; ${maza}) \\cup (${didele}; +\\infty)$`,
        sprendimas: `Sistemos: abu dauginamieji teigiami, kai $x > ${didele}$; abu neigiami, kai $x < ${maza}$.`,
        brezinys: zenkluAsis(
          [
            { reiksme: maza, itraukiamas: false },
            { reiksme: didele, itraukiamas: false },
          ],
          { zenklai: ['+', '−', '+'], nuspalvinti: [true, false, true] },
        ),
      })
    },

    // 2. Neigiama sandauga
    () => {
      if (maza >= didele) return null
      return uzdavinys(T3, {
        klausimas: `Išspręsk $(${dvinaris(maza)})(${dvinaris(didele)}) < 0$ ir užrašyk mažesnįjį sprendinių intervalo galą.`,
        atsakymas: String(maza),
        atsakymasRodymui: `$x \\in (${maza}; ${didele})$`,
        sprendimas: `Sandauga neigiama tik tada, kai dauginamieji skirtingų ženklų, t. y. tarp kritinių taškų.`,
        brezinys: zenkluAsis(
          [
            { reiksme: maza, itraukiamas: false },
            { reiksme: didele, itraukiamas: false },
          ],
          { zenklai: ['+', '−', '+'], nuspalvinti: [false, true, false] },
        ),
      })
    },

    // 3. Sistemų užrašymas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kurios dvi sistemos atitinka sąlygą $(x - 4)(x + 2) \\ge 0$?',
        variantai: [
          '$\\begin{cases} x - 4 \\ge 0 \\\\ x + 2 \\ge 0 \\end{cases}$ arba $\\begin{cases} x - 4 \\le 0 \\\\ x + 2 \\le 0 \\end{cases}$',
          '$\\begin{cases} x - 4 \\ge 0 \\\\ x + 2 \\le 0 \\end{cases}$ arba $\\begin{cases} x - 4 \\le 0 \\\\ x + 2 \\ge 0 \\end{cases}$',
          'Tik $\\begin{cases} x - 4 \\ge 0 \\\\ x + 2 \\ge 0 \\end{cases}$',
          '$\\begin{cases} x - 4 \\ge 0 \\\\ x + 2 \\ge 0 \\end{cases}$ ir kartu $\\begin{cases} x - 4 \\le 0 \\\\ x + 2 \\le 0 \\end{cases}$',
        ],
        teisingas: 0,
        sprendimas: 'Sandauga neneigiama, kai abu dauginamieji to paties ženklo; abu atvejai jungiami sąjunga.',
      }),

    // 4. Kada sandauga teigiama
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kada dviejų dauginamųjų sandauga yra teigiama?',
        variantai: [
          'Kai abu teigiami arba abu neigiami',
          'Tik kai abu teigiami',
          'Kai bent vienas teigiamas',
          'Kai jų suma teigiama',
        ],
        teisingas: 0,
        sprendimas: 'Ženklų taisyklė: $(+) \\cdot (+) = (+)$ ir $(-) \\cdot (-) = (+)$.',
      }),

    // 5. Kvadratų skirtumas
    () => {
      const n = pasirink([2, 3, 4, 5])
      return uzdavinys(T3, {
        klausimas: `Išskaidęs dauginamaisiais išspręsk $x^2 - ${n * n} \\le 0$ ir užrašyk didesnįjį sprendinių intervalo galą.`,
        atsakymas: String(n),
        atsakymasRodymui: `$x \\in [${-n}; ${n}]$`,
        sprendimas: `$(x - ${n})(x + ${n}) \\le 0$ — dauginamieji priešingų ženklų tarp $${-n}$ ir $${n}$.`,
        brezinys: zenkluAsis(
          [
            { reiksme: -n, itraukiamas: true },
            { reiksme: n, itraukiamas: true },
          ],
          { zenklai: ['+', '−', '+'], nuspalvinti: [false, true, false] },
        ),
      })
    },

    // 6. Skaidymas su koeficientu
    () => {
      const trejetas = pasirink([
        { uzrasas: '2x^2 - 5x - 3', maza: '-\\tfrac{1}{2}', didele: 3, skaidinys: '(2x + 1)(x - 3)' },
        { uzrasas: '3x^2 - 5x - 2', maza: '-\\tfrac{1}{3}', didele: 2, skaidinys: '(3x + 1)(x - 2)' },
        { uzrasas: '2x^2 - 7x + 3', maza: '\\tfrac{1}{2}', didele: 3, skaidinys: '(2x - 1)(x - 3)' },
      ])
      return uzdavinys(T3, {
        klausimas: `Išskaidęs dauginamaisiais išspręsk $${trejetas.uzrasas} > 0$ ir užrašyk didesnįjį kritinį tašką.`,
        atsakymas: String(trejetas.didele),
        atsakymasRodymui: `$x = ${trejetas.didele}$`,
        sprendimas: `$${trejetas.uzrasas} = ${trejetas.skaidinys}$; kritiniai taškai yra $${trejetas.maza}$ ir $${trejetas.didele}$, o sandauga teigiama už jų ribų.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Sąlygai $ab > 0$ mokinys užrašė tik $a > 0$ ir $b > 0$. Kokį atvejį jis praleido?',
        variantai: [
          'Atvejį, kai abu dauginamieji neigiami',
          'Atvejį, kai vienas lygus nuliui',
          'Atvejį, kai $a > b$',
          'Nepraleido nieko',
        ],
        teisingas: 0,
        sprendimas: 'Dviejų neigiamų skaičių sandauga taip pat teigiama, tad ta sistema būtina.',
      }),

    // 8. Neigiama sandauga su koeficientu
    () =>
      uzdavinys(T3, {
        klausimas: 'Išspręsk $(3x - 2)(x + 5) \\le 0$ ir užrašyk mažesnįjį sprendinių intervalo galą.',
        atsakymas: '-5',
        atsakymasRodymui: '$x \\in \\left[-5; \\tfrac{2}{3}\\right]$',
        sprendimas:
          'Kritiniai taškai yra $-5$ ir $\\tfrac{2}{3}$; sandauga neteigiama tarp jų, o galai įtraukiami, nes ženklas negriežtas.',
        brezinys: zenkluAsis(
          [
            { reiksme: -5, itraukiamas: true },
            { reiksme: 2 / 3, itraukiamas: true },
          ],
          { zenklai: ['+', '−', '+'], nuspalvinti: [false, true, false] },
        ),
      }),

    // 9. Dviejų būdų palyginimas
    () =>
      poruUzdavinys(naujasId(T3), T3, {
        klausimas: 'Nelygybė $x^2 - x - 6 > 0$ sprendžiama dviem būdais. Susiek būdą su tuo, ką jame reikia rasti.',
        poros: [
          { kaire: 'Parabolės būdas', desine: 'nulius $-2$ ir $3$ bei šakų kryptį' },
          { kaire: 'Nelygybių sistemų būdas', desine: 'dauginamųjų $(x + 2)$ ir $(x - 3)$ ženklus' },
          { kaire: 'Bendras abiejų rezultatas', desine: '$x < -2$ arba $x > 3$' },
        ],
        sprendimas: 'Abu būdai duoda tą patį atsakymą; skiriasi tik tai, ar žiūrima į grafiką, ar į dauginamųjų ženklus.',
      }),

    // 10. Nelygybės kūrimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kurios nelygybės sprendiniai yra $x \\in (-4; 2)$?',
        variantai: [
          '$(x + 4)(x - 2) < 0$',
          '$(x + 4)(x - 2) > 0$',
          '$(x - 4)(x + 2) < 0$',
          '$(x + 4)(x + 2) < 0$',
        ],
        teisingas: 0,
        sprendimas: 'Kritiniai taškai turi būti $-4$ ir $2$, o sandauga tarp jų neigiama.',
      }),
  ])
}

// ── 4.4. Kvadratinių nelygybių taikymas ─────────────────────────────────────

const T4 = 'nelygybiu-taikymas'

const A4 = [
  {
    klausimas: 'Kvadrato kraštinė $x$ cm, $x > 0$. Kokioms $x$ reikšmėms plotas didesnis už $49$ cm²? Užrašyk ribinę reikšmę.',
    atsakymas: '7',
    atsakymasRodymui: '$x > 7$',
    sprendimas: 'Iš $x^2 > 49$ ir $x > 0$ gauname $x > 7$.',
  },
] as const

export const nelygybiuTaikymas: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  return variacija([
    // 1. Stačiakampio plotas
    () => {
      const pora = pasirink([
        { d: 3, riba: 40, x: 5 },
        { d: 2, riba: 24, x: 4 },
        { d: 4, riba: 45, x: 5 },
      ])
      return uzdavinys(T4, {
        klausimas: `Stačiakampio kraštinės yra $x$ cm ir $x + ${pora.d}$ cm, o plotas turi būti ne didesnis kaip $${pora.riba}$ cm². Kokia didžiausia sveikoji $x$ reikšmė tinka?`,
        atsakymas: String(pora.x),
        atsakymasRodymui: `$x = ${pora.x}$`,
        sprendimas: `Nelygybė $x(x + ${pora.d}) \\le ${pora.riba}$, t. y. $${trinaris(pora.d, -pora.riba)} \\le 0$; su sąlyga $x > 0$ gauname $0 < x \\le ${pora.x}$.`,
      })
    },

    // 2. Gretimi natūralieji
    () => {
      const riba = pasirink([72, 90, 56])
      const n = Math.floor((-1 + Math.sqrt(1 + 4 * riba)) / 2)
      if (n * (n + 1) >= riba) return null
      return uzdavinys(T4, {
        klausimas: `Dviejų iš eilės einančių natūraliųjų skaičių sandauga mažesnė už $${riba}$. Koks didžiausias gali būti mažesnysis skaičius?`,
        atsakymas: String(n),
        atsakymasRodymui: `$n = ${n}$`,
        sprendimas: `Nelygybė $n(n + 1) < ${riba}$; kai $n = ${n}$, sandauga $${n * (n + 1)}$, o kai $n = ${n + 1}$, jau $${(n + 1) * (n + 2)}$.`,
      })
    },

    // 3. Kūno aukštis
    () =>
      uzdavinys(T4, {
        klausimas: 'Kamuolio aukštis aprašomas $h(t) = -5t^2 + 20t + 1$. Kokiu laiko momentu (sekundėmis) baigiasi laikotarpis, kai $h(t) > 16$?',
        atsakymas: '3',
        atsakymasRodymui: '$t \\in (1; 3)$, pabaiga ties $t = 3$',
        sprendimas:
          'Iš $-5t^2 + 20t + 1 > 16$ gauname $t^2 - 4t + 3 < 0$, tad $1 < t < 3$. Padalijus iš $-5$ nelygybės ženklas apsiverčia, todėl pertvarkytos parabolės šakos nukreiptos į viršų.',
      }),

    // 4. Kvadrato plotas
    () => {
      const n = pasirink([5, 6, 7, 8])
      return uzdavinys(T4, {
        klausimas: `Kvadrato kraštinė $x$ cm, $x > 0$. Kokioms $x$ reikšmėms jo plotas didesnis už $${n * n}$ cm²? Užrašyk ribinę reikšmę.`,
        atsakymas: String(n),
        atsakymasRodymui: `$x > ${n}$`,
        sprendimas: `Iš $x^2 > ${n * n}$ formaliai gaunama $x < ${-n}$ arba $x > ${n}$, bet kraštinė teigiama, tad lieka $x > ${n}$.`,
      })
    },

    // 5. Kontekstiniai apribojimai
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl tekstiniame uždavinyje po nelygybės išsprendimo dar reikia atsižvelgti į kontekstą?',
        variantai: [
          'Nes ilgis, laikas ar kiekis negali būti neigiami, tad dalis matematinių sprendinių netinka',
          'Nes nelygybė visada išsprendžiama neteisingai',
          'Nes kontekstas keičia nelygybės ženklą',
          'Nes atsakymas turi būti sveikasis skaičius',
        ],
        teisingas: 0,
        sprendimas: 'Matematinė sprendinių aibė susiaurinama iki tų reikšmių, kurios turi prasmę uždavinyje.',
      }),

    // 6. Perimetras ir plotas
    () =>
      uzdavinys(T4, {
        klausimas: 'Stačiakampio perimetras $30$ cm, viena kraštinė $x$ cm. Kokioms $x$ reikšmėms plotas yra bent $50$ cm²? Užrašyk mažesnįjį intervalo galą.',
        atsakymas: '5',
        atsakymasRodymui: '$x \\in [5; 10]$',
        sprendimas: 'Kita kraštinė yra $15 - x$, tad $x(15 - x) \\ge 50$, t. y. $x^2 - 15x + 50 \\le 0$ ir $5 \\le x \\le 10$.',
      }),

    // 7. Aukštis ne žemiau kaip
    () =>
      uzdavinys(T4, {
        klausimas: 'Kūno aukštis aprašomas $h(t) = -4t^2 + 16t + 5$. Kiek sekundžių trunka laikotarpis, kai kūnas yra ne žemiau kaip $17$ m?',
        atsakymas: '2',
        atsakymasRodymui: '$t \\in [1; 3]$, trukmė $2$ s',
        sprendimas: 'Iš $-4t^2 + 16t + 5 \\ge 17$ gauname $t^2 - 4t + 3 \\le 0$, tad $1 \\le t \\le 3$ ir intervalo ilgis $2$.',
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ieškodamas kraštinės mokinys gavo $x < -3$ arba $x > 5$ ir paliko abu intervalus. Kaip kontekstas keičia atsakymą?',
        variantai: [
          'Kraštinė teigiama, tad lieka tik $x > 5$',
          'Lieka tik $x < -3$',
          'Abu intervalai tinka',
          'Netinka nė vienas intervalas',
        ],
        teisingas: 0,
        sprendimas: 'Neigiamo ilgio nebūna, tad neigiamas intervalas atmetamas.',
      }),

    // 9. Sandauga didesnė už
    () => {
      const suma = pasirink([10, 12])
      const riba = suma === 10 ? 21 : 32
      const maza = suma === 10 ? 3 : 4
      const didele = suma - maza
      return uzdavinys(T4, {
        klausimas: `Dviejų skaičių suma lygi $${suma}$. Kokioms $x$ reikšmėms jų sandauga didesnė už $${riba}$, jei skaičiai yra $x$ ir $${suma} - x$? Užrašyk didesnįjį intervalo galą.`,
        atsakymas: String(didele),
        atsakymasRodymui: `$x \\in (${maza}; ${didele})$`,
        sprendimas: `Iš $x(${suma} - x) > ${riba}$ gauname $${trinaris(-suma, riba)} < 0$, tad $${maza} < x < ${didele}$.`,
      })
    },

    // 10. Modelio parinkimas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuri situacija modeliuojama kvadratine nelygybe?',
        variantai: [
          'Aptvaro, kurio perimetras pastovus, plotas turi būti ne mažesnis už duotą',
          'Prekės kaina padidėja $5$ Eur',
          'Automobilis važiuoja pastoviu greičiu',
          'Sutaupyta suma didėja tolygiai',
        ],
        teisingas: 0,
        sprendimas: 'Pastovus perimetras leidžia antrąją kraštinę užrašyti per pirmąją, ir plotas tampa kvadratiniu reiškiniu.',
      }),
  ])
}

// ── 4.5. Nelygybių sistemos ir dvigubosios nelygybės ────────────────────────

const T5 = 'nelygybiu-sistemos'

const A5 = [
  {
    klausimas: 'Išspręsk sistemą $x > 2$ ir $x \\le 7$. Užrašyk didesnįjį sprendinių intervalo galą.',
    atsakymas: '7',
    atsakymasRodymui: '$x \\in (2; 7]$',
    sprendimas: 'Sprendinys yra abiejų aibių sankirta.',
  },
] as const

export const nelygybiuSistemos: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const maza = atsitiktinis(-4, 3)
  const didele = maza + atsitiktinis(2, 6)

  return variacija([
    // 1. Paprasta sistema
    () =>
      uzdavinys(T5, {
        klausimas: `Išspręsk sistemą $x > ${maza}$ ir $x \\le ${didele}$. Užrašyk didesnįjį sprendinių intervalo galą.`,
        atsakymas: String(didele),
        atsakymasRodymui: `$x \\in (${maza}; ${didele}]$`,
        sprendimas: 'Sistemos sprendinys yra abiejų aibių sankirta — bendra jų dalis.',
        brezinys: intervalas({ reiksme: maza, itraukiamas: false }, { reiksme: didele, itraukiamas: true }),
      }),

    // 2. Sistema su tiesinėmis nelygybėmis
    () => {
      const a = pasirink([2, 3])
      const b = pasirink([1, 2, 5])
      const riba = pasirink([8, 10, 12])
      const kaire = (3 + b) / a
      const desine = riba - 4
      if (!Number.isInteger(kaire) || kaire >= desine) return null
      return uzdavinys(T5, {
        klausimas: `Išspręsk sistemą $${a}x - ${b} \\ge 3$ ir $x + 4 < ${riba}$. Užrašyk mažesnįjį sprendinių intervalo galą.`,
        atsakymas: String(kaire),
        atsakymasRodymui: `$x \\in [${kaire}; ${desine})$`,
        sprendimas: `Iš pirmosios $x \\ge ${kaire}$, iš antrosios $x < ${desine}$; sankirta yra $[${kaire}; ${desine})$.`,
        brezinys: intervalas({ reiksme: kaire, itraukiamas: true }, { reiksme: desine, itraukiamas: false }),
      })
    },

    // 3. Intervalo užrašymas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuris intervalas atitinka dvigubą nelygybę $-3 < x \\le 5$?',
        variantai: ['$(-3; 5]$', '$[-3; 5)$', '$[-3; 5]$', '$(-3; 5)$'],
        teisingas: 0,
        brezinys: intervalas({ reiksme: -3, itraukiamas: false }, { reiksme: 5, itraukiamas: true }),
        sprendimas: 'Griežtas ženklas duoda apvalų skliaustą, negriežtas — laužtinį.',
      }),

    // 4. Dviguba nelygybė
    () => {
      const a = pasirink([2, 3])
      const b = pasirink([1, 3, 5])
      const kaire = (1 - b) / a
      const desine = (9 - b) / a
      if (!Number.isInteger(kaire) || !Number.isInteger(desine)) return null
      return uzdavinys(T5, {
        klausimas: `Išspręsk dvigubą nelygybę $1 < ${a}x + ${b} \\le 9$ ir užrašyk didesnįjį sprendinių intervalo galą.`,
        atsakymas: String(desine),
        atsakymasRodymui: `$x \\in (${kaire}; ${desine}]$`,
        sprendimas: `Iš visų trijų dalių atėmę $${b}$ ir padaliję iš $${a}$, gauname $${kaire} < x \\le ${desine}$.`,
        brezinys: intervalas({ reiksme: kaire, itraukiamas: false }, { reiksme: desine, itraukiamas: true }),
      })
    },

    // 5. Sankirta ir sąjunga
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuo nelygybių sistemos sprendinių sankirta skiriasi nuo sąjungos?',
        variantai: [
          'Sankirtoje reikšmė turi tenkinti visas nelygybes, sąjungoje — bent vieną',
          'Sankirta visada platesnė už sąjungą',
          'Skirtumo nėra',
          'Sąjunga naudojama tik kvadratinėms nelygybėms',
        ],
        teisingas: 0,
        sprendimas: 'Žodis „ir“ reiškia sankirtą, žodis „arba“ — sąjungą.',
      }),

    // 6. Kvadratinė ir tiesinė kartu
    () =>
      uzdavinys(T5, {
        klausimas: 'Išspręsk sistemą $x^2 - 5x + 6 \\le 0$ ir $x > 0$. Užrašyk mažesnįjį sprendinių intervalo galą.',
        atsakymas: '2',
        atsakymasRodymui: '$x \\in [2; 3]$',
        sprendimas: 'Pirmoji nelygybė duoda $2 \\le x \\le 3$; sąlyga $x > 0$ nieko nesiaurina, nes visas intervalas teigiamas.',
        brezinys: intervalas({ reiksme: 2, itraukiamas: true }, { reiksme: 3, itraukiamas: true }),
      }),

    // 7. Ženklo apsivertimas
    () =>
      uzdavinys(T5, {
        klausimas: 'Išspręsk dvigubą nelygybę $-5 \\le 3 - 2x < 9$ ir užrašyk didesnįjį sprendinių intervalo galą.',
        atsakymas: '4',
        atsakymasRodymui: '$x \\in (-3; 4]$',
        sprendimas:
          'Atėmę $3$: $-8 \\le -2x < 6$. Dalijant iš $-2$ nelygybių ženklai apsiverčia: $4 \\ge x > -3$.',
        brezinys: intervalas({ reiksme: -3, itraukiamas: false }, { reiksme: 4, itraukiamas: true }),
      }),

    // 8. Tuščia sankirta
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Sistemos $x < 4$ ir $x > 7$ sprendinius mokinys užrašė $(-\\infty; 4) \\cup (7; +\\infty)$. Kur klaida?',
        variantai: [
          'Sistemoje reikia sankirtos, o šios aibės nesikerta, tad sprendinių nėra',
          'Reikėjo užrašyti $(4; 7)$',
          'Klaidos nėra',
          'Reikėjo užrašyti visus realiuosius skaičius',
        ],
        teisingas: 0,
        sprendimas: 'Sąjungos ženklas tiktų, jei nelygybės būtų jungiamos žodžiu „arba“, bet sistemoje jos jungiamos „ir“.',
      }),

    // 9. Kvadratinė nelygybė su riba
    () =>
      uzdavinys(T5, {
        klausimas: 'Išspręsk sistemą $2x^2 - 8 < 0$ ir $x \\ge -1$. Užrašyk didesnįjį sprendinių intervalo galą.',
        atsakymas: '2',
        atsakymasRodymui: '$x \\in [-1; 2)$',
        sprendimas: 'Pirmoji duoda $-2 < x < 2$; kartu su $x \\ge -1$ lieka $[-1; 2)$.',
        brezinys: intervalas({ reiksme: -1, itraukiamas: true }, { reiksme: 2, itraukiamas: false }),
      }),

    // 10. Sistemos kūrimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kurios sistemos sprendinių aibė yra $[-2; 3)$?',
        variantai: [
          '$x \\ge -2$ ir $x < 3$',
          '$x > -2$ ir $x \\le 3$',
          '$x \\ge -2$ arba $x < 3$',
          '$x \\le -2$ ir $x > 3$',
        ],
        teisingas: 0,
        brezinys: intervalas({ reiksme: -2, itraukiamas: true }, { reiksme: 3, itraukiamas: false }),
        sprendimas: 'Kairysis galas įtraukiamas, tad ženklas negriežtas; dešinysis neįtraukiamas, tad griežtas.',
      }),
  ])
}

// ── 4.6. Trupmeninių nelygybių sprendimas ───────────────────────────────────

const T6 = 'trupmenines-nelygybes'

const A6 = [
  {
    klausimas: 'Išspręsk $\\dfrac{x - 2}{x + 1} > 0$, kai $x \\ne -1$. Užrašyk didesnįjį kritinį tašką.',
    atsakymas: '2',
    atsakymasRodymui: '$x \\in (-\\infty; -1) \\cup (2; +\\infty)$',
    sprendimas: 'Trupmena teigiama, kai skaitiklis ir vardiklis to paties ženklo.',
  },
] as const

export const trupmeninesNelygybes: Generatorius = () => suBandymais(kurk6, A6, T6)

function kurk6(): Uzdavinys | null {
  const skaitiklis = pasirink([-3, -1, 2, 3, 5])
  const vardiklis = pasirink([-2, 1, 4])

  return variacija([
    // 1. Teigiama trupmena
    () => {
      if (skaitiklis === vardiklis) return null
      const maza = Math.min(skaitiklis, vardiklis)
      const didele = Math.max(skaitiklis, vardiklis)
      return uzdavinys(T6, {
        klausimas: `Išspręsk $${tr(dvinaris(skaitiklis), dvinaris(vardiklis))} > 0$, kai $x \\ne ${vardiklis}$. Užrašyk didesnįjį kritinį tašką.`,
        atsakymas: String(didele),
        atsakymasRodymui: `$x \\in (-\\infty; ${maza}) \\cup (${didele}; +\\infty)$`,
        sprendimas: `Kritiniai taškai yra $${skaitiklis}$ ir $${vardiklis}$; trupmena teigiama, kai skaitiklis ir vardiklis to paties ženklo.`,
        brezinys: zenkluAsis(
          [
            { reiksme: maza, itraukiamas: false },
            { reiksme: didele, itraukiamas: false },
          ],
          { zenklai: ['+', '−', '+'], nuspalvinti: [true, false, true] },
        ),
      })
    },

    // 2. Neigiama trupmena su negriežtu ženklu
    () => {
      if (skaitiklis >= vardiklis) return null
      return uzdavinys(T6, {
        klausimas: `Išspręsk $${tr(dvinaris(skaitiklis), dvinaris(vardiklis))} \\le 0$, kai $x \\ne ${vardiklis}$. Užrašyk mažesnįjį sprendinių intervalo galą.`,
        atsakymas: String(skaitiklis),
        atsakymasRodymui: `$x \\in [${skaitiklis}; ${vardiklis})$`,
        sprendimas: `Skaitiklio nulis $${skaitiklis}$ įtraukiamas, o vardiklio nulis $${vardiklis}$ — ne, nes ties juo trupmena neapibrėžta.`,
        brezinys: zenkluAsis(
          [
            { reiksme: skaitiklis, itraukiamas: true },
            { reiksme: vardiklis, itraukiamas: false },
          ],
          { zenklai: ['+', '−', '+'], nuspalvinti: [false, true, false] },
        ),
      })
    },

    // 3. Kritiniai taškai
    () => {
      if (skaitiklis === vardiklis) return null
      return uzdavinys(T6, {
        klausimas: `Nurodyk mažesnįjį kritinį tašką nelygybei $${tr(dvinaris(skaitiklis), dvinaris(vardiklis))} \\ge 0$.`,
        atsakymas: String(Math.min(skaitiklis, vardiklis)),
        atsakymasRodymui: `$x = ${Math.min(skaitiklis, vardiklis)}$`,
        sprendimas: `Kritiniai taškai — skaitiklio nulis $${skaitiklis}$ ir vardiklio nulis $${vardiklis}$; mažesnysis iš jų yra $${Math.min(skaitiklis, vardiklis)}$.`,
      })
    },

    // 4. Kodėl vardiklio nulis neįtraukiamas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kodėl vardiklio nulis niekada neįtraukiamas į trupmeninės nelygybės sprendinius?',
        variantai: [
          'Nes ties ta reikšme trupmena neapibrėžta',
          'Nes ten trupmena lygi nuliui',
          'Nes ten trupmena visada teigiama',
          'Nes taip patogiau rašyti',
        ],
        teisingas: 0,
        sprendimas: 'Dalyba iš nulio neapibrėžta, tad tokia reikšmė iškrenta net ir esant negriežtam ženklui.',
      }),

    // 5. Paprasčiausia trupmena
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kokie yra nelygybės $\\dfrac{1}{x} < 0$ sprendiniai?',
        variantai: ['$x < 0$', '$x > 0$', '$x \\le 0$', 'Sprendinių nėra'],
        teisingas: 0,
        sprendimas: 'Skaitiklis teigiamas, tad trupmena neigiama tik tada, kai vardiklis neigiamas.',
      }),

    // 6. Trys kritiniai taškai
    () =>
      uzdavinys(T6, {
        klausimas: 'Naudodamas ženklų lentelę išspręsk $\\dfrac{(x - 1)(x + 3)}{x - 4} \\ge 0$ ir užrašyk kritinį tašką, kuris į sprendinius neįeina.',
        atsakymas: '4',
        atsakymasRodymui: '$x = 4$',
        sprendimas:
          'Sprendiniai yra $[-3; 1] \\cup (4; +\\infty)$. Taškai $-3$ ir $1$ įtraukiami, nes tai skaitiklio nuliai, o $4$ — ne, nes ties juo vardiklis virsta nuliu.',
        brezinys: zenkluAsis(
          [
            { reiksme: -3, itraukiamas: true },
            { reiksme: 1, itraukiamas: true },
            { reiksme: 4, itraukiamas: false },
          ],
          { zenklai: ['−', '+', '−', '+'], nuspalvinti: [false, true, false, true] },
        ),
      }),

    // 7. Kvadratų skirtumas skaitiklyje
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kokie yra nelygybės $\\dfrac{x^2 - 9}{x - 2} < 0$ sprendiniai?',
        variantai: [
          '$x < -3$ arba $2 < x < 3$',
          '$-3 < x < 3$',
          '$x < -3$ arba $x > 3$',
          '$2 < x < 3$',
        ],
        teisingas: 0,
        brezinys: zenkluAsis(
          [
            { reiksme: -3, itraukiamas: false },
            { reiksme: 2, itraukiamas: false },
            { reiksme: 3, itraukiamas: false },
          ],
          { zenklai: ['−', '+', '−', '+'], nuspalvinti: [true, false, true, false] },
        ),
        sprendimas: 'Kritiniai taškai yra $-3$, $2$ ir $3$; ženklų lentelėje reiškinys neigiamas kraštiniame kairiajame ir viduriniame dešiniajame intervale.',
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Spręsdamas $\\dfrac{x - 2}{x + 5} > 0$, mokinys į atsakymą įtraukė $x = -5$. Kur klaida?',
        variantai: [
          'Ties $x = -5$ vardiklis virsta nuliu, tad trupmena neapibrėžta',
          'Ties $x = -5$ trupmena lygi nuliui, tad ženklas netinka',
          'Klaidos nėra',
          'Reikėjo įtraukti ir $x = 2$',
        ],
        teisingas: 0,
        sprendimas: 'Vardiklio nulis niekada nepriklauso sprendinių aibei.',
      }),

    // 9. Ženklų lentelės pildymas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Brėžinyje pažymėti reiškinio $\\dfrac{(x + 3)(x - 1)}{x - 4}$ kritiniai taškai. Koks yra reiškinio ženklas intervale $(-3; 1)$?',
        variantai: ['teigiamas', 'neigiamas', 'lygus nuliui', 'neapibrėžtas'],
        teisingas: 0,
        brezinys: zenkluAsis([
          { reiksme: -3, itraukiamas: true },
          { reiksme: 1, itraukiamas: true },
          { reiksme: 4, itraukiamas: false },
        ]),
        sprendimas:
          'Kai $-3 < x < 1$: $x + 3 > 0$, $x - 1 < 0$, $x - 4 < 0$; sandauga $(+)(-)$ dalijama iš $(-)$ duoda teigiamą reikšmę.',
      }),

    // 10. Nelygybės kūrimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kurios trupmeninės nelygybės sprendiniai yra $(-\\infty; -2) \\cup [3; +\\infty)$?',
        variantai: [
          '$\\dfrac{x - 3}{x + 2} \\ge 0$',
          '$\\dfrac{x + 2}{x - 3} \\ge 0$',
          '$\\dfrac{x - 3}{x + 2} \\le 0$',
          '$\\dfrac{x - 3}{x + 2} > 0$',
        ],
        teisingas: 0,
        sprendimas:
          'Taškas $3$ turi būti įtrauktas, tad tai skaitiklio nulis prie negriežto ženklo; taškas $-2$ neįtraukiamas, tad tai vardiklio nulis.',
        brezinys: zenkluAsis(
          [
            { reiksme: -2, itraukiamas: false },
            { reiksme: 3, itraukiamas: true },
          ],
          { zenklai: ['+', '−', '+'], nuspalvinti: [true, false, true] },
        ),
      }),
  ])
}
