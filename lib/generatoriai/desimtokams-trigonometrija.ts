import { naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { trikampisSuZymemis } from './sestokams-vaizdai'
import { vienetinisApskritimas } from './desimtokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 10 klasės tema „Trigonometrijos pagrindai“ — penkios potemės.
 *
 * Posūkio kampas visur matuojamas nuo teigiamos $Ox$ krypties prieš laikrodžio
 * rodyklę, o brėžinyje taškas piešiamas būtent ties tuo kampu — ketvirtį
 * mokinys nuskaito iš paveikslo.
 *
 * Kur atsakymas yra iracionalus, klausiama arba daugiklio prie šaknies, arba
 * apytikslės reikšmės su aiškiai nurodytu apvalinimu: kitaip mokinys neturėtų
 * ko įrašyti į atsakymo langelį.
 */

/** Trikampis ABC įprastu žymėjimu: $a$ priešais $A$, $b$ priešais $B$, $c$ priešais $C$. */
function trikampisABC(
  a: number,
  b: number,
  c: number,
  z: { a?: string; b?: string; c?: string; A?: string; B?: string; C?: string } = {},
): string {
  return trikampisSuZymemis(b, c, a, {
    a: z.b,
    b: z.c,
    c: z.a,
    kampasA: z.A,
    kampasB: z.B,
    kampasC: z.C,
  })
}

/** Kraštinė pagal kosinusų teoremą. */
function trecioKrastine(a: number, b: number, kampas: number): number {
  return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos((kampas * Math.PI) / 180))
}

/** Skaičius su kableliu, suapvalintas iki nurodyto skaitmenų skaičiaus. */
function apvalus(n: number, skaitmenys = 1): string {
  return n.toFixed(skaitmenys).replace('.', ',')
}

const sin = (laipsniai: number) => Math.sin((laipsniai * Math.PI) / 180)

// ── 2.1. Posūkio kampo sinusas, kosinusas ir tangentas ──────────────────────

const T1 = 'posukio-kampas'

const A1 = [
  {
    klausimas: 'Kuriame ketvirtyje yra $150°$ posūkio kampo galinė kraštinė? Atsakymą užrašyk skaičiumi.',
    atsakymas: '2',
    atsakymasRodymui: 'antrajame ketvirtyje',
    sprendimas: 'Kampas tarp $90°$ ir $180°$, tad taškas yra antrajame ketvirtyje.',
  },
] as const

export const posukioKampas: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  const antrasis = pasirink([100, 120, 135, 150, 160])
  const kampas = pasirink([30, 60, 120, 135, 150, 210, 225, 300, 330])

  return variacija([
    // 1. Ženklai iš brėžinio
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Brėžinyje pavaizduotas posūkio kampas ir jo galinės kraštinės taškas vienetiniame apskritime. Kokie yra $\\sin \\alpha$ ir $\\cos \\alpha$ ženklai?',
        variantai: [
          '$\\sin \\alpha > 0$, $\\cos \\alpha < 0$',
          '$\\sin \\alpha < 0$, $\\cos \\alpha > 0$',
          'abu teigiami',
          'abu neigiami',
        ],
        teisingas: 0,
        brezinys: vienetinisApskritimas([{ laipsniai: antrasis, raide: 'P', punktyrai: true }]),
        sprendimas:
          'Antrajame ketvirtyje taško $y$ koordinatė teigiama, o $x$ — neigiama; sinusas atitinka $y$, kosinusas — $x$.',
      }),

    // 2. Ketvirtis
    () => {
      const ketvirtis = Math.floor(kampas / 90) + 1
      return uzdavinys(T1, {
        klausimas: `Kuriame ketvirtyje yra $${kampas}°$ posūkio kampo galinė kraštinė? Atsakymą užrašyk skaičiumi.`,
        atsakymas: String(ketvirtis),
        atsakymasRodymui: `${ketvirtis} ketvirtyje`,
        sprendimas: `Ketvirčių ribos yra $90°$, $180°$ ir $270°$; kampas $${kampas}°$ patenka tarp $${(ketvirtis - 1) * 90}°$ ir $${ketvirtis * 90}°$.`,
      })
    },

    // 3. Kuri koordinatė
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Vienetiniame apskritime posūkio kampo galinės kraštinės taškas turi koordinates $(x; y)$. Kurį dydį atitinka $y$?',
        variantai: ['$\\sin \\alpha$', '$\\cos \\alpha$', '$\\mathrm{tg}\\, \\alpha$', 'spindulį'],
        teisingas: 0,
        sprendimas: 'Vienetiniame apskritime $x = \\cos \\alpha$, o $y = \\sin \\alpha$.',
      }),

    // 4. Reikšmės ties nuliu
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Susiek trigonometrines funkcijas su jų reikšmėmis, kai $\\alpha = 0°$.',
        poros: [
          { kaire: '$\\sin 0°$', desine: '$0$' },
          { kaire: '$\\cos 0°$', desine: '$1$' },
          { kaire: '$\\mathrm{tg}\\, 0°$', desine: 'taip pat $0$' },
        ],
        brezinys: vienetinisApskritimas([{ laipsniai: 0, raide: 'P' }]),
        sprendimas: 'Kampo $0°$ taškas yra $(1; 0)$, tad $\\sin 0° = 0$, $\\cos 0° = 1$ ir $\\mathrm{tg}\\, 0° = \\dfrac{0}{1} = 0$.',
      }),

    // 5. Kodėl tg 90° neapibrėžtas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kodėl $\\mathrm{tg}\\, 90°$ neapibrėžtas?',
        variantai: [
          'Nes $\\mathrm{tg}\\, \\alpha = \\dfrac{\\sin \\alpha}{\\cos \\alpha}$, o $\\cos 90° = 0$',
          'Nes $\\sin 90° = 0$',
          'Nes $90°$ nėra posūkio kampas',
          'Nes tangentas apibrėžtas tik smailiesiems kampams',
        ],
        teisingas: 0,
        sprendimas: 'Vardiklis $\\cos 90°$ lygus nuliui, o dalyba iš nulio neapibrėžta.',
      }),

    // 6. Trys kampai brėžinyje
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Brėžinyje pažymėti trys posūkio kampai ir jų taškai. Kuris teiginys apie jų sinusus ir kosinusus teisingas?',
        variantai: [
          'Visų trijų sinusai teigiami, bet dviejų kosinusai neigiami',
          'Visų trijų kosinusai teigiami',
          'Visų trijų sinusai neigiami',
          'Sinusai ir kosinusai visų trijų vienodo ženklo',
        ],
        teisingas: 0,
        brezinys: vienetinisApskritimas([
          { laipsniai: 30, raide: 'A' },
          { laipsniai: 120, raide: 'B' },
          { laipsniai: 150, raide: 'C' },
        ]),
        sprendimas:
          'Visi trys taškai yra virš $Ox$ ašies, tad sinusai teigiami; $120°$ ir $150°$ taškai yra kairėje nuo $Oy$, tad jų kosinusai neigiami.',
      }),

    // 7. Redukcijos formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kaip vienetiniame apskritime susiję kampų $\\alpha$ ir $180° - \\alpha$ taškai?',
        variantai: [
          'Jie simetriški $Oy$ ašies atžvilgiu, tad $\\sin(180° - \\alpha) = \\sin \\alpha$, o $\\cos(180° - \\alpha) = -\\cos \\alpha$',
          'Jie sutampa, tad abi funkcijos nesikeičia',
          'Jie simetriški $Ox$ ašies atžvilgiu, tad keičiasi sinuso ženklas',
          'Jie simetriški centro atžvilgiu, tad keičiasi abiejų ženklai',
        ],
        teisingas: 0,
        brezinys: vienetinisApskritimas([
          { laipsniai: 40, raide: 'P' },
          { laipsniai: 140, raide: 'Q' },
        ]),
        sprendimas: 'Simetrija $Oy$ ašies atžvilgiu keičia tik $x$ koordinatės ženklą, o $y$ palieka tą pačią.',
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Mokinys teigia, kad antrajame ketvirtyje sinusas ir kosinusas abu teigiami. Kur klaida?',
        variantai: [
          'Antrajame ketvirtyje $x < 0$, tad kosinusas neigiamas; teigiamas tik sinusas',
          'Antrajame ketvirtyje abu neigiami',
          'Antrajame ketvirtyje teigiamas tik kosinusas',
          'Klaidos nėra',
        ],
        teisingas: 0,
        brezinys: vienetinisApskritimas([{ laipsniai: 125, raide: 'P', punktyrai: true }]),
        sprendimas: 'Taško abscisė antrajame ketvirtyje neigiama, o ordinatė teigiama.',
      }),

    // 9. Bukojo kampo funkcijų ženklai
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kampas $\\alpha$ bukasis ir $\\sin \\alpha = 0{,}6$. Kokie yra $\\cos \\alpha$ ir $\\mathrm{tg}\\, \\alpha$ ženklai?',
        variantai: [
          'abu neigiami',
          'abu teigiami',
          '$\\cos \\alpha > 0$, $\\mathrm{tg}\\, \\alpha < 0$',
          '$\\cos \\alpha < 0$, $\\mathrm{tg}\\, \\alpha > 0$',
        ],
        teisingas: 0,
        sprendimas:
          'Bukasis kampas yra antrajame ketvirtyje: $\\cos \\alpha < 0$, o $\\mathrm{tg}\\, \\alpha = \\dfrac{\\sin \\alpha}{\\cos \\alpha}$ dalija teigiamą iš neigiamo.',
      }),

    // 10. Kampo pavyzdys su ženklais
    () => {
      const laipsniai = pasirink([100, 110, 140, 170])
      return uzdavinys(T1, {
        klausimas: `Kampas $${laipsniai}°$ priklauso intervalui $(90°; 180°)$. Kiek iš trijų dydžių — $\\sin ${laipsniai}°$, $\\cos ${laipsniai}°$, $\\mathrm{tg}\\, ${laipsniai}°$ — yra neigiami?`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Antrajame ketvirtyje sinusas teigiamas, o kosinusas ir tangentas neigiami.',
      })
    },
  ])
}

// ── 2.2. Sinuso, kosinuso ir tangento reikšmės ──────────────────────────────

const T2 = 'trigonometrines-reiksmes-10'

const A2 = [
  {
    klausimas: 'Apskaičiuok $\\sin 150°$. Atsakymą užrašyk trupmena.',
    atsakymas: '1/2',
    atsakymasRodymui: '$\\dfrac{1}{2}$',
    sprendimas: '$\\sin 150° = \\sin(180° - 30°) = \\sin 30° = \\dfrac{1}{2}$.',
  },
] as const

export const trigonometrinesReiksmes10: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  return variacija([
    // 1. sin 150°
    () =>
      uzdavinys(T2, {
        klausimas: 'Apskaičiuok $\\sin 150°$. Atsakymą užrašyk trupmena.',
        atsakymas: '1/2',
        atsakymasRodymui: '$\\dfrac{1}{2}$',
        sprendimas: '$\\sin 150° = \\sin(180° - 30°) = \\sin 30° = \\dfrac{1}{2}$.',
        brezinys: vienetinisApskritimas([{ laipsniai: 150, raide: 'P', punktyrai: true }]),
      }),

    // 2. cos 120°
    () =>
      uzdavinys(T2, {
        klausimas: 'Apskaičiuok $\\cos 120°$. Atsakymą užrašyk trupmena.',
        atsakymas: '-1/2',
        atsakymasRodymui: '$-\\dfrac{1}{2}$',
        sprendimas: '$\\cos 120° = -\\cos 60° = -\\dfrac{1}{2}$.',
        brezinys: vienetinisApskritimas([{ laipsniai: 120, raide: 'P', punktyrai: true }]),
      }),

    // 3. cos 135° — pasirenkamasis, nes reikšmė iracionali
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuriai reikšmei lygus $\\cos 135°$?',
        variantai: [
          '$-\\dfrac{\\sqrt{2}}{2}$',
          '$\\dfrac{\\sqrt{2}}{2}$',
          '$-\\dfrac{\\sqrt{3}}{2}$',
          '$-\\dfrac{1}{2}$',
        ],
        teisingas: 0,
        sprendimas: '$\\cos 135° = -\\cos 45° = -\\dfrac{\\sqrt{2}}{2}$; antrajame ketvirtyje kosinusas neigiamas.',
      }),

    // 4. tg 135°
    () =>
      uzdavinys(T2, {
        klausimas: 'Naudodamas $\\mathrm{tg}\\, \\alpha = \\dfrac{\\sin \\alpha}{\\cos \\alpha}$, apskaičiuok $\\mathrm{tg}\\, 135°$.',
        atsakymas: '-1',
        atsakymasRodymui: '$-1$',
        sprendimas:
          '$\\mathrm{tg}\\, 135° = \\dfrac{\\sin 135°}{\\cos 135°} = \\dfrac{\\frac{\\sqrt{2}}{2}}{-\\frac{\\sqrt{2}}{2}} = -1$.',
      }),

    // 5. Reiškinys su dviem nariais
    () =>
      uzdavinys(T2, {
        klausimas: 'Apskaičiuok $2\\sin 150° + \\cos 120°$.',
        atsakymas: '1/2',
        atsakymasRodymui: '$\\dfrac{1}{2}$',
        sprendimas: '$2 \\cdot \\dfrac{1}{2} + \\left(-\\dfrac{1}{2}\\right) = 1 - \\dfrac{1}{2} = \\dfrac{1}{2}$.',
      }),

    // 6. Pagrindinė tapatybė
    () => {
      const kampas = pasirink([120, 135, 150, 100])
      return uzdavinys(T2, {
        klausimas: `Apskaičiuok $\\sin^2 ${kampas}° + \\cos^2 ${kampas}°$.`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Pagal pagrindinę trigonometrinę tapatybę $\\sin^2 \\alpha + \\cos^2 \\alpha = 1$ su bet kuriuo kampu.',
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Mokinys teigia, kad $\\cos 150° = \\cos 30°$. Koks ryšys teisingas?',
        variantai: [
          '$\\cos 150° = -\\cos 30°$',
          '$\\cos 150° = \\cos 30°$',
          '$\\cos 150° = \\sin 30°$',
          '$\\cos 150° = -\\sin 30°$',
        ],
        teisingas: 0,
        brezinys: vienetinisApskritimas([
          { laipsniai: 30, raide: 'A' },
          { laipsniai: 150, raide: 'B' },
        ]),
        sprendimas: 'Taškai simetriški $Oy$ ašies atžvilgiu, tad abscisės skiriasi ženklu: $\\cos(180° - \\alpha) = -\\cos \\alpha$.',
      }),

    // 8. Palyginimas be skaičiuotuvo
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Nenaudodamas skaičiuotuvo palygink $\\sin 120°$ ir $\\sin 135°$.',
        variantai: [
          '$\\sin 120° > \\sin 135°$',
          '$\\sin 120° < \\sin 135°$',
          '$\\sin 120° = \\sin 135°$',
          'Palyginti neįmanoma',
        ],
        teisingas: 0,
        sprendimas:
          '$\\sin 120° = \\sin 60° = \\dfrac{\\sqrt{3}}{2}$, o $\\sin 135° = \\sin 45° = \\dfrac{\\sqrt{2}}{2}$; kadangi $\\sqrt{3} > \\sqrt{2}$, pirmasis didesnis.',
      }),

    // 9. Lygtis su dviem sprendiniais
    () => {
      const pora = pasirink([
        { reiksme: '\\dfrac{1}{2}', maza: 30, didele: 150 },
        { reiksme: '\\dfrac{\\sqrt{2}}{2}', maza: 45, didele: 135 },
        { reiksme: '\\dfrac{\\sqrt{3}}{2}', maza: 60, didele: 120 },
      ])
      return uzdavinys(T2, {
        klausimas: `Išspręsk lygtį $\\sin \\alpha = ${pora.reiksme}$, kai $\\alpha \\in (0°; 180°)$, ir užrašyk didesnįjį sprendinį laipsniais.`,
        atsakymas: String(pora.didele),
        atsakymasRodymui: `$${pora.didele}°$`,
        sprendimas: `Tą pačią sinuso reikšmę duoda $${pora.maza}°$ ir $180° - ${pora.maza}° = ${pora.didele}°$, nes abu taškai yra vienodame aukštyje virš $Ox$ ašies.`,
        brezinys: vienetinisApskritimas([
          { laipsniai: pora.maza, raide: 'A' },
          { laipsniai: pora.didele, raide: 'B' },
        ]),
      })
    },

    // 10. Kodėl sprendiniai du
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kodėl lygtis $\\sin \\alpha = 0{,}5$ intervale $(0°; 180°)$ turi du sprendinius?',
        variantai: [
          'Nes tame pačiame aukštyje virš $Ox$ ašies yra du apskritimo taškai — pirmajame ir antrajame ketvirčiuose',
          'Nes sinusas visada turi du sprendinius',
          'Nes $0{,}5$ yra trupmena',
          'Nes kampas gali būti ir neigiamas',
        ],
        teisingas: 0,
        sprendimas: 'Sinusas atitinka taško ordinatę, o vienodą ordinatę turi du simetriški $Oy$ ašies atžvilgiu taškai.',
      }),
  ])
}

// ── 2.3. Trikampio ploto skaičiavimo formulė ────────────────────────────────

const T3 = 'trikampio-plotas-sinusu'

const A3 = [
  {
    klausimas: 'Trikampio dvi kraštinės yra $8$ cm ir $6$ cm, o kampas tarp jų $30°$. Apskaičiuok plotą (cm²).',
    atsakymas: '12',
    atsakymasRodymui: '$12$ cm²',
    sprendimas: '$S = \\dfrac{1}{2} \\cdot 8 \\cdot 6 \\cdot \\sin 30° = 24 \\cdot 0{,}5 = 12$.',
  },
] as const

export const trikampioPlotasSinusu: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const a = pasirink([6, 8, 10, 12])
  const b = pasirink([4, 6, 8, 9])

  return variacija([
    // 1. Plotas su 30° iš brėžinio
    () => {
      const plotas = (a * b) / 4
      if (!Number.isInteger(plotas)) return null
      return uzdavinys(T3, {
        klausimas: 'Brėžinyje pavaizduotas trikampis su pažymėtomis dviem kraštinėmis ir kampu tarp jų. Apskaičiuok trikampio plotą (cm²) formule $S = \\dfrac{1}{2}ab\\sin C$.',
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `$S = \\dfrac{1}{2} \\cdot ${a} \\cdot ${b} \\cdot \\sin 30° = ${(a * b) / 2} \\cdot 0{,}5 = ${plotas}$.`,
        brezinys: trikampisABC(trecioKrastine(b, a, 30), b, a, {
          b: `${b} cm`,
          c: `${a} cm`,
          A: '30°',
        }),
      })
    },

    // 2. Plotas su 60°
    () => {
      const daugiklis = (a * b) / 4
      if (!Number.isInteger(daugiklis)) return null
      return uzdavinys(T3, {
        klausimas: `Trikampio dvi kraštinės yra $${a}$ cm ir $${b}$ cm, o kampas tarp jų $60°$. Plotas užrašomas pavidalu $k\\sqrt{3}$ cm². Rask $k$.`,
        atsakymas: String(daugiklis),
        atsakymasRodymui: `$k = ${daugiklis}$`,
        sprendimas: `$S = \\dfrac{1}{2} \\cdot ${a} \\cdot ${b} \\cdot \\dfrac{\\sqrt{3}}{2} = ${daugiklis}\\sqrt{3}$.`,
      })
    },

    // 3. Kampo sinuso radimas
    () => {
      const plotas = (a * b) / 2
      return uzdavinys(T3, {
        klausimas: `Trikampio plotas $${plotas}$ cm², o dvi kraštinės — $${a}$ cm ir $${b}$ cm. Rask kampo tarp jų sinusą.`,
        atsakymas: '1',
        atsakymasRodymui: '$\\sin C = 1$',
        sprendimas: `Iš $S = \\dfrac{1}{2}ab\\sin C$ gauname $\\sin C = \\dfrac{2 \\cdot ${plotas}}{${a} \\cdot ${b}} = 1$, tad kampas statusis.`,
      })
    },

    // 4. Kokių duomenų pakanka
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kokių duomenų pakanka, kad būtų galima taikyti formulę $S = \\dfrac{1}{2}ab\\sin C$?',
        variantai: [
          'Dviejų kraštinių ir kampo tarp jų',
          'Trijų kampų',
          'Dviejų kraštinių ir bet kurio kampo',
          'Vienos kraštinės ir dviejų kampų',
        ],
        teisingas: 0,
        sprendimas: 'Kampas $C$ formulėje yra būtent tarp kraštinių $a$ ir $b$ — kitas kampas duotų kitą plotą.',
      }),

    // 5. Lygiakraštis trikampis
    () => {
      const krastine = pasirink([4, 6, 8, 10])
      const daugiklis = (krastine * krastine) / 4
      if (!Number.isInteger(daugiklis)) return null
      return uzdavinys(T3, {
        klausimas: `Lygiakraščio trikampio kraštinė $${krastine}$ cm. Jo plotas užrašomas pavidalu $k\\sqrt{3}$ cm². Rask $k$.`,
        atsakymas: String(daugiklis),
        atsakymasRodymui: `$k = ${daugiklis}$`,
        sprendimas: `Visi kampai lygūs $60°$, tad $S = \\dfrac{1}{2} \\cdot ${krastine} \\cdot ${krastine} \\cdot \\dfrac{\\sqrt{3}}{2} = ${daugiklis}\\sqrt{3}$.`,
        brezinys: trikampisABC(krastine, krastine, krastine, {
          a: `${krastine} cm`,
          A: '60°',
        }),
      })
    },

    // 6. Bukasis kampas
    () => {
      const daugiklis = (a * b) / 4
      if (!Number.isInteger(daugiklis)) return null
      return uzdavinys(T3, {
        klausimas: `Trikampio kraštinės $a = ${a}$ cm ir $b = ${b}$ cm, kampas tarp jų $135°$. Plotas užrašomas pavidalu $k\\sqrt{2}$ cm². Rask $k$.`,
        atsakymas: String(daugiklis),
        atsakymasRodymui: `$k = ${daugiklis}$`,
        sprendimas: `$\\sin 135° = \\dfrac{\\sqrt{2}}{2}$, tad $S = \\dfrac{1}{2} \\cdot ${a} \\cdot ${b} \\cdot \\dfrac{\\sqrt{2}}{2} = ${daugiklis}\\sqrt{2}$.`,
      })
    },

    // 7. Nežinoma kraštinė
    () => {
      const zinoma = pasirink([10, 12, 8])
      const kita = pasirink([6, 8, 12])
      const plotas = (zinoma * kita) / 4
      if (!Number.isInteger(plotas)) return null
      return uzdavinys(T3, {
        klausimas: `Trikampio plotas $${plotas}$ cm², viena kraštinė $${zinoma}$ cm, o kampas tarp jos ir kitos kraštinės yra $30°$. Rask kitą kraštinę (cm).`,
        atsakymas: String(kita),
        atsakymasRodymui: `$${kita}$ cm`,
        sprendimas: `$${plotas} = \\dfrac{1}{2} \\cdot ${zinoma} \\cdot b \\cdot 0{,}5 = ${apvalus(zinoma / 4, 2).replace(',', '{,}')}b$, tad $b = ${kita}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Formulėje $S = \\dfrac{1}{2}ab\\sin C$ mokinys paėmė kampą, kuris nėra tarp kraštinių $a$ ir $b$. Kodėl tai svarbu?',
        variantai: [
          'Nes $b\\sin C$ yra aukštinė į kraštinę $a$ tik tada, kai $C$ yra tarp $a$ ir $b$',
          'Nes kito kampo sinusas visada neigiamas',
          'Nes kitas kampas visada didesnis',
          'Nesvarbu — plotas gaunasi toks pat',
        ],
        teisingas: 0,
        sprendimas: 'Formulė remiasi tuo, kad $h = b\\sin C$ yra statmuo į kraštinę $a$; kitas kampas duoda kitą aukštinę.',
      }),

    // 9. Du trikampiai su papildomais kampais
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Du trikampiai turi po $8$ cm ir $10$ cm kraštines, bet kampai tarp jų yra $30°$ ir $150°$. Palygink jų plotus.',
        variantai: [
          'Plotai lygūs, nes $\\sin 30° = \\sin 150°$',
          'Pirmojo plotas didesnis',
          'Antrojo plotas didesnis',
          'Antrojo plotas penkis kartus didesnis',
        ],
        teisingas: 0,
        sprendimas: 'Papildomų kampų sinusai lygūs, o kraštinės tos pačios, tad ir plotai lygūs — abu po $20$ cm².',
      }),

    // 10. Bukojo kampo uždavinio kūrimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuris trikampis turi didžiausią plotą, jei visų kraštinės yra $6$ cm ir $10$ cm?',
        variantai: [
          'Tas, kurio kampas tarp jų $90°$',
          'Tas, kurio kampas tarp jų $150°$',
          'Tas, kurio kampas tarp jų $30°$',
          'Visi turi vienodą plotą',
        ],
        teisingas: 0,
        sprendimas: 'Plotas didžiausias, kai $\\sin C$ didžiausias, o didžiausia sinuso reikšmė $1$ pasiekiama ties $90°$.',
      }),
  ])
}

// ── 2.4. Sinusų teorema ─────────────────────────────────────────────────────

const T4 = 'sinusu-teorema'

const A4 = [
  {
    klausimas: 'Trikampyje $\\angle A = 45°$ ir $\\angle B = 75°$. Rask $\\angle C$ laipsniais.',
    atsakymas: '60',
    atsakymasRodymui: '$60°$',
    sprendimas: '$\\angle C = 180° - 45° - 75° = 60°$.',
  },
] as const

export const sinusuTeorema: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  const kampasA = pasirink([35, 40, 45, 50, 55])
  const kampasB = pasirink([60, 65, 70, 75])
  const a = pasirink([6, 8, 10, 12, 14])

  return variacija([
    // 1. Kraštinės radimas iš brėžinio
    () => {
      if (kampasA + kampasB >= 170) return null
      const b = (a * sin(kampasB)) / sin(kampasA)
      if (b > 60) return null
      return uzdavinys(T4, {
        klausimas: 'Brėžinyje pažymėta viena trikampio kraštinė ir du kampai. Taikydamas sinusų teoremą rask kraštinę $b$ (cm) ir suapvalink iki dešimtųjų.',
        atsakymas: apvalus(b),
        atsakymasRodymui: `$b \\approx ${apvalus(b)}$ cm`,
        sprendimas: `$\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B}$, tad $b = \\dfrac{${a} \\cdot \\sin ${kampasB}°}{\\sin ${kampasA}°} \\approx ${apvalus(b)}$.`,
        brezinys: trikampisABC(a, b, (a * sin(180 - kampasA - kampasB)) / sin(kampasA), {
          a: `${a} cm`,
          A: `${kampasA}°`,
          B: `${kampasB}°`,
        }),
      })
    },

    // 2. Teisinga proporcija
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Trikampyje $a = 10$ cm, $b = 7$ cm ir $\\angle A = 50°$. Kuri lygybė leidžia rasti $\\angle B$?',
        variantai: [
          '$\\dfrac{10}{\\sin 50°} = \\dfrac{7}{\\sin B}$',
          '$\\dfrac{10}{\\sin B} = \\dfrac{7}{\\sin 50°}$',
          '$\\dfrac{\\sin 50°}{10} = \\dfrac{\\sin B}{7} \\cdot 2$',
          '$10 \\sin 50° = 7 \\sin B$',
        ],
        teisingas: 0,
        sprendimas: 'Sinusų teoremoje kiekviena kraštinė poruojama su prieš ją esančiu kampu.',
      }),

    // 3. Patogios kampų poros
    () => {
      const pora = pasirink([
        { A: 30, B: 90, kartas: 2 },
        { A: 30, B: 150, kartas: 1 },
        { A: 90, B: 30, kartas: 0.5 },
      ])
      const b = a * pora.kartas
      if (!Number.isInteger(b) || pora.A + pora.B >= 180) return null
      return uzdavinys(T4, {
        klausimas: `Trikampyje $\\angle A = ${pora.A}°$, $\\angle B = ${pora.B}°$ ir $a = ${a}$ cm. Rask kraštinę $b$ (cm).`,
        atsakymas: String(b),
        atsakymasRodymui: `$b = ${b}$ cm`,
        sprendimas: `$b = \\dfrac{a \\sin B}{\\sin A} = \\dfrac{${a} \\cdot \\sin ${pora.B}°}{\\sin ${pora.A}°} = ${b}$.`,
      })
    },

    // 4. Kas su kuo poruojama
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kokios kraštinių ir kampų poros naudojamos sinusų teoremoje?',
        variantai: [
          'Kraštinė ir prieš ją esantis kampas',
          'Kraštinė ir prie jos esantis kampas',
          'Dvi kraštinės ir kampas tarp jų',
          'Bet kuri kraštinė su bet kuriuo kampu',
        ],
        teisingas: 0,
        sprendimas: 'Teorema teigia $\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} = 2R$.',
      }),

    // 5. Apibrėžto apskritimo spindulys
    () => {
      const krastine = pasirink([8, 10, 12, 14])
      return uzdavinys(T4, {
        klausimas: `Trikampio kraštinė $a = ${krastine}$ cm, o prieš ją esantis kampas lygus $30°$. Naudodamas $\\dfrac{a}{\\sin A} = 2R$, rask apibrėžto apskritimo spindulį $R$ (cm).`,
        atsakymas: String(krastine),
        atsakymasRodymui: `$R = ${krastine}$ cm`,
        sprendimas: `$2R = \\dfrac{${krastine}}{\\sin 30°} = \\dfrac{${krastine}}{0{,}5} = ${2 * krastine}$, tad $R = ${krastine}$.`,
      })
    },

    // 6. Trečiasis kampas
    () => {
      if (kampasA + kampasB >= 175) return null
      return uzdavinys(T4, {
        klausimas: `Trikampyje $\\angle A = ${kampasA}°$ ir $\\angle B = ${kampasB}°$. Rask $\\angle C$ laipsniais.`,
        atsakymas: String(180 - kampasA - kampasB),
        atsakymasRodymui: `$\\angle C = ${180 - kampasA - kampasB}°$`,
        sprendimas: `Trikampio kampų suma $180°$: $180° - ${kampasA}° - ${kampasB}° = ${180 - kampasA - kampasB}°$.`,
        brezinys: trikampisABC(a, (a * sin(kampasB)) / sin(kampasA), (a * sin(180 - kampasA - kampasB)) / sin(kampasA), {
          A: `${kampasA}°`,
          B: `${kampasB}°`,
          C: '?',
        }),
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Sinusų teoremoje mokinys kraštinę $a$ suporavo su kampu $B$. Kaip užrašyti teisingai?',
        variantai: [
          '$\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B}$',
          '$\\dfrac{a}{\\sin B} = \\dfrac{b}{\\sin A}$',
          '$\\dfrac{a}{\\sin B} = \\dfrac{b}{\\sin C}$',
          '$a \\sin A = b \\sin B$',
        ],
        teisingas: 0,
        sprendimas: 'Kraštinė $a$ yra prieš kampą $A$, o $b$ — prieš $B$; sukeitus poras proporcija nebegalioja.',
      }),

    // 8. Bukasis kampas ir spindulys
    () => {
      const b = pasirink([12, 15, 18])
      const spindulys = b / (2 * sin(120))
      return uzdavinys(T4, {
        klausimas: `Trikampyje $b = ${b}$ cm, $\\angle B = 120°$, $\\angle A = 30°$. Rask apibrėžto apskritimo spindulį $R$ (cm) ir suapvalink iki šimtųjų.`,
        atsakymas: apvalus(spindulys, 2),
        atsakymasRodymui: `$R \\approx ${apvalus(spindulys, 2)}$ cm`,
        sprendimas: `$2R = \\dfrac{${b}}{\\sin 120°}$, tad $R = \\dfrac{${b}}{2\\sin 120°} \\approx ${apvalus(spindulys, 2)}$.`,
      })
    },

    // 9. Dvi kraštinės iš brėžinio
    () => {
      const c = pasirink([12, 14, 16])
      const kampasC = 70
      const kampasA2 = 50
      const aa = (c * sin(kampasA2)) / sin(kampasC)
      return uzdavinys(T4, {
        klausimas: 'Brėžinyje pažymėta viena kraštinė ir du kampai. Rask kraštinę $a$ (cm) ir suapvalink iki dešimtųjų.',
        atsakymas: apvalus(aa),
        atsakymasRodymui: `$a \\approx ${apvalus(aa)}$ cm`,
        sprendimas: `$\\angle B = 180° - ${kampasC}° - ${kampasA2}° = ${180 - kampasC - kampasA2}°$; $a = \\dfrac{${c} \\cdot \\sin ${kampasA2}°}{\\sin ${kampasC}°} \\approx ${apvalus(aa)}$.`,
        brezinys: trikampisABC(aa, (c * sin(180 - kampasC - kampasA2)) / sin(kampasC), c, {
          c: `${c} cm`,
          A: `${kampasA2}°`,
          C: `${kampasC}°`,
        }),
      })
    },

    // 10. Realaus konteksto uždavinys
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuriai situacijai tinka sinusų teorema, kai atstumas tiesiogiai neišmatuojamas?',
        variantai: [
          'Išmatuotas atstumas tarp dviejų taškų krante ir kampai, kuriais iš jų matoma sala',
          'Išmatuotos visos trys trikampio kraštinės',
          'Išmatuotos dvi kraštinės ir kampas tarp jų',
          'Žinomas tik vienas kampas',
        ],
        teisingas: 0,
        sprendimas:
          'Turint kraštinę ir du kampus, trečiasis kampas randamas iš kampų sumos, o nepasiekiamas atstumas — iš sinusų teoremos.',
      }),
  ])
}

// ── 2.5. Kosinusų teorema ───────────────────────────────────────────────────

const T5 = 'kosinusu-teorema'

/** Trejetai, kuriuose kampas tarp $a$ ir $b$ lygus $60°$ arba $120°$, o $c$ sveikas. */
const TREJETAI_60 = [
  { a: 3, b: 8, c: 7 },
  { a: 5, b: 8, c: 7 },
  { a: 8, b: 15, c: 13 },
  { a: 7, b: 15, c: 13 },
] as const

const TREJETAI_120 = [
  { a: 3, b: 5, c: 7 },
  { a: 7, b: 8, c: 13 },
  { a: 5, b: 16, c: 19 },
] as const

const A5 = [
  {
    klausimas: 'Trikampio kraštinės yra $6$ cm, $8$ cm ir $10$ cm. Rask didžiausio kampo dydį laipsniais.',
    atsakymas: '90',
    atsakymasRodymui: '$90°$',
    sprendimas: '$6^2 + 8^2 = 100 = 10^2$, tad kampas prieš kraštinę $10$ cm yra statusis.',
  },
] as const

export const kosinusuTeorema: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const t60 = pasirink(TREJETAI_60)
  const t120 = pasirink(TREJETAI_120)

  return variacija([
    // 1. Kraštinė, kai kampas 60°
    () =>
      uzdavinys(T5, {
        klausimas: `Trikampio kraštinės $a = ${t60.a}$ cm ir $b = ${t60.b}$ cm, o kampas tarp jų $C = 60°$. Rask kraštinę $c$ (cm).`,
        atsakymas: String(t60.c),
        atsakymasRodymui: `$c = ${t60.c}$ cm`,
        sprendimas: `$c^2 = ${t60.a}^2 + ${t60.b}^2 - 2 \\cdot ${t60.a} \\cdot ${t60.b} \\cdot 0{,}5 = ${t60.c * t60.c}$, tad $c = ${t60.c}$.`,
        brezinys: trikampisABC(t60.a, t60.b, t60.c, {
          a: `${t60.a} cm`,
          b: `${t60.b} cm`,
          C: '60°',
        }),
      }),

    // 2. Didžiausias kampas stačiajame trikampyje
    () => {
      const trejetas = pasirink([
        { a: 6, b: 8, c: 10 },
        { a: 9, b: 12, c: 15 },
        { a: 5, b: 12, c: 13 },
      ])
      return uzdavinys(T5, {
        klausimas: `Trikampio kraštinės yra $${trejetas.a}$ cm, $${trejetas.b}$ cm ir $${trejetas.c}$ cm. Naudodamas kosinusų teoremą rask didžiausio kampo dydį laipsniais.`,
        atsakymas: '90',
        atsakymasRodymui: '$90°$',
        sprendimas: `$\\cos C = \\dfrac{${trejetas.a}^2 + ${trejetas.b}^2 - ${trejetas.c}^2}{2 \\cdot ${trejetas.a} \\cdot ${trejetas.b}} = 0$, tad $C = 90°$.`,
        brezinys: trikampisABC(trejetas.a, trejetas.b, trejetas.c, {
          a: `${trejetas.a} cm`,
          b: `${trejetas.b} cm`,
          c: `${trejetas.c} cm`,
        }),
      })
    },

    // 3. Formulės užrašymas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kaip užrašoma kosinusų teorema kraštinei $c$ rasti?',
        variantai: [
          '$c^2 = a^2 + b^2 - 2ab\\cos C$',
          '$c^2 = a^2 + b^2 + 2ab\\cos C$',
          '$c^2 = a^2 + b^2 - 2ab\\cos A$',
          '$c = a + b - 2ab\\cos C$',
        ],
        teisingas: 0,
        sprendimas: 'Atimamas narys su kampu, esančiu būtent tarp kraštinių $a$ ir $b$.',
      }),

    // 4. Lygtis kampui rasti
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Trikampyje $a = 9$, $b = 11$, $c = 13$. Kuri lygybė leidžia rasti kampą $C$?',
        variantai: [
          '$13^2 = 9^2 + 11^2 - 2 \\cdot 9 \\cdot 11 \\cdot \\cos C$',
          '$9^2 = 11^2 + 13^2 - 2 \\cdot 11 \\cdot 13 \\cdot \\cos C$',
          '$11^2 = 9^2 + 13^2 - 2 \\cdot 9 \\cdot 13 \\cdot \\cos C$',
          '$13^2 = 9^2 + 11^2 + 2 \\cdot 9 \\cdot 11 \\cdot \\cos C$',
        ],
        teisingas: 0,
        sprendimas: 'Kampas $C$ yra prieš kraštinę $c = 13$, tad jos kvadratas rašomas kairėje.',
      }),

    // 5. Ryšys su Pitagoro teorema
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuo kosinusų teorema apibendrina Pitagoro teoremą?',
        variantai: [
          'Kai $C = 90°$, narys $2ab\\cos C$ virsta nuliu ir lieka $c^2 = a^2 + b^2$',
          'Kai $C = 60°$, ji virsta Pitagoro teorema',
          'Ji galioja tik stačiuosiuose trikampiuose',
          'Ji galioja tik lygiakraščiuose trikampiuose',
        ],
        teisingas: 0,
        sprendimas: '$\\cos 90° = 0$, tad papildomas narys išnyksta.',
      }),

    // 6. Didžiausias kampas bendru atveju
    () => {
      const trejetas = pasirink([
        { a: 7, b: 9, c: 12 },
        { a: 4, b: 6, c: 8 },
        { a: 6, b: 7, c: 11 },
      ])
      const kosinusas = (trejetas.a ** 2 + trejetas.b ** 2 - trejetas.c ** 2) / (2 * trejetas.a * trejetas.b)
      const kampas = (Math.acos(kosinusas) * 180) / Math.PI
      return uzdavinys(T5, {
        klausimas: `Trikampio kraštinės yra $${trejetas.a}$ cm, $${trejetas.b}$ cm ir $${trejetas.c}$ cm. Rask didžiausio kampo dydį laipsniais ir suapvalink iki sveikųjų.`,
        atsakymas: String(Math.round(kampas)),
        atsakymasRodymui: `$\\approx ${Math.round(kampas)}°$`,
        sprendimas: `Didžiausias kampas yra prieš ilgiausią kraštinę: $\\cos C = \\dfrac{${trejetas.a}^2 + ${trejetas.b}^2 - ${trejetas.c}^2}{2 \\cdot ${trejetas.a} \\cdot ${trejetas.b}} \\approx ${apvalus(kosinusas, 3)}$, tad $C \\approx ${Math.round(kampas)}°$.`,
        brezinys: trikampisABC(trejetas.a, trejetas.b, trejetas.c, {
          a: `${trejetas.a} cm`,
          b: `${trejetas.b} cm`,
          c: `${trejetas.c} cm`,
        }),
      })
    },

    // 7. Kraštinė, kai kampas 120°
    () =>
      uzdavinys(T5, {
        klausimas: `Trikampyje $a = ${t120.a}$ cm, $b = ${t120.b}$ cm, o kampas tarp jų $C = 120°$. Rask kraštinę $c$ (cm).`,
        atsakymas: String(t120.c),
        atsakymasRodymui: `$c = ${t120.c}$ cm`,
        sprendimas: `$\\cos 120° = -0{,}5$, tad $c^2 = ${t120.a}^2 + ${t120.b}^2 + ${t120.a} \\cdot ${t120.b} = ${t120.c * t120.c}$ ir $c = ${t120.c}$.`,
        brezinys: trikampisABC(t120.a, t120.b, t120.c, {
          a: `${t120.a} cm`,
          b: `${t120.b} cm`,
          C: '120°',
        }),
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Formulėje $c^2 = a^2 + b^2 - 2ab\\cos C$ mokinys pamiršo narį $-2ab\\cos C$. Kada jo formulė vis dėlto teisinga?',
        variantai: [
          'Tik tada, kai $C = 90°$',
          'Visada',
          'Tik tada, kai $C = 60°$',
          'Tik lygiašoniuose trikampiuose',
        ],
        teisingas: 0,
        sprendimas: 'Praleistas narys lygus nuliui tik tada, kai $\\cos C = 0$, t. y. kai kampas statusis.',
      }),

    // 9. Kampo rūšis
    () => {
      const trejetas = pasirink([
        { a: 8, b: 13, c: 15, rusis: 'smailusis' },
        { a: 5, b: 7, c: 11, rusis: 'bukasis' },
        { a: 9, b: 12, c: 15, rusis: 'statusis' },
      ])
      const zenklas = trejetas.a ** 2 + trejetas.b ** 2 - trejetas.c ** 2
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Trikampyje $a = ${trejetas.a}$, $b = ${trejetas.b}$, $c = ${trejetas.c}$. Koks yra kampas $C$?`,
        variantai: ['smailusis', 'statusis', 'bukasis'],
        teisingas: trejetas.rusis === 'smailusis' ? 0 : trejetas.rusis === 'statusis' ? 1 : 2,
        sprendimas: `$a^2 + b^2 - c^2 = ${zenklas}$; kai šis skirtumas teigiamas, kampas smailusis, kai nulis — statusis, kai neigiamas — bukasis.`,
      })
    },

    // 10. Kampas ir plotas iš trijų kraštinių
    () => {
      const plotas = (t60.a * t60.b * Math.sqrt(3)) / 4
      return uzdavinys(T5, {
        klausimas: `Trikampio kraštinės yra $${t60.a}$ cm, $${t60.b}$ cm ir $${t60.c}$ cm. Radęs kampą tarp dviejų trumpesniųjų, apskaičiuok plotą (cm²) ir suapvalink iki dešimtųjų.`,
        atsakymas: apvalus(plotas),
        atsakymasRodymui: `$\\approx ${apvalus(plotas)}$ cm²`,
        sprendimas: `Iš kosinusų teoremos $\\cos C = 0{,}5$, tad $C = 60°$ ir $S = \\dfrac{1}{2} \\cdot ${t60.a} \\cdot ${t60.b} \\cdot \\dfrac{\\sqrt{3}}{2} \\approx ${apvalus(plotas)}$.`,
        brezinys: trikampisABC(t60.a, t60.b, t60.c, {
          a: `${t60.a} cm`,
          b: `${t60.b} cm`,
          c: `${t60.c} cm`,
        }),
      })
    },
  ])
}
