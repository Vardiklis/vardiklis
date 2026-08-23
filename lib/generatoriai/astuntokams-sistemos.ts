import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { koordinaciuPlokstuma } from './sestokams-vaizdai'
import { ivestiesLentele } from './penktokams-vaizdai'
import { vektoriaiTinklelyje } from './astuntokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 8 klasės temos „Tiesinių lygčių sistemos“ ir „Vektoriai“ — penkiolika
 * potemių.
 *
 * Programoje lygčių sistemų temoje yra ir potemė „Tiesinis sąryšis: lentelė,
 * formulė ir grafikas“, kurios turinio apraše nėra; ji čia priklauso, nes yra
 * ta pati tiesinė priklausomybė, tik pateikta trimis pavidalais.
 *
 * Visų sistemų sprendiniai parenkami sveikieji: uždavinio esmė yra sprendimo
 * būdas, o ne trupmenų aritmetika.
 */

/** Nario su kintamuoju užrašas: 1x → x, −1x → −x. */
function narys(k: number, r: string): string {
  if (k === 1) return r
  if (k === -1) return `-${r}`
  return `${k}${r}`
}

/** Lygties „ax + by = c“ kairioji pusė, tvarkingai su ženklais. */
function kaire(a: number, b: number): string {
  return b < 0 ? `${narys(a, 'x')} - ${narys(-b, 'y')}` : `${narys(a, 'x')} + ${narys(b, 'y')}`
}

// ── 5.1. Tiesinė lygtis su dviem nežinomaisiais ─────────────────────────────

const T1 = 'tiesine-lygtis-dviem'

const A_LYGTIS = [
  {
    klausimas: 'Ar skaičių pora $(2; 3)$ yra lygties $x + y = 5$ sprendinys?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: '$2 + 3 = 5$ — lygybė teisinga.',
  },
] as const

export const tiesineLygtisDviem: Generatorius = () => suBandymais(kurkLygti, A_LYGTIS, T1)

function kurkLygti(): Uzdavinys | null {
  const a = atsitiktinis(1, 6)
  const b = atsitiktinis(1, 6)
  const x = atsitiktinis(-5, 8)
  const y = atsitiktinis(-5, 8)
  const c = a * x + b * y

  return variacija([
    // 1. Ar pora yra sprendinys
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Ar skaičių pora $(${x}; ${y})$ yra lygties $${kaire(a, b)} = ${c}$ sprendinys?`,
        variantai: ['taip, nes įrašius gaunama teisinga lygybė', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `$${a} \\cdot (${x}) + ${b} \\cdot (${y}) = ${c}$.`,
      }),

    // 2. Rask y, kai žinomas x
    () =>
      uzdavinys(T1, {
        klausimas: `Lygtyje $${kaire(a, b)} = ${c}$ rask $y$, kai $x = ${x}$.`,
        atsakymas: String(y),
        atsakymasRodymui: `$${y}$`,
        sprendimas: `$${c} - ${a} \\cdot (${x}) = ${b * y}$, tada $${b * y} : ${b} = ${y}$.`,
      }),

    // 3. Rask x, kai žinomas y
    () =>
      uzdavinys(T1, {
        klausimas: `Lygtyje $${kaire(a, b)} = ${c}$ rask $x$, kai $y = ${y}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `$${c} - ${b} \\cdot (${y}) = ${a * x}$, tada $${a * x} : ${a} = ${x}$.`,
      }),

    // 4. Kiek sprendinių
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kiek sprendinių turi viena tiesinė lygtis su dviem nežinomaisiais?',
        variantai: ['be galo daug', 'vieną', 'du', 'nė vieno'],
        teisingas: 0,
        sprendimas: 'Kiekvienai $x$ reikšmei atitinka sava $y$ reikšmė.',
      }),

    // 5. Kas yra sprendinys
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kas yra tiesinės lygties su dviem nežinomaisiais sprendinys?',
        variantai: [
          'skaičių pora, su kuria lygybė tampa teisinga',
          'vienas skaičius',
          'lygties koeficientas',
          'lygties grafikas',
        ],
        teisingas: 0,
        sprendimas: 'Sprendinys užrašomas pora $(x; y)$.',
      }),

    // 6. Bendrasis pavidalas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Koks yra tiesinės lygties su dviem nežinomaisiais bendrasis pavidalas?',
        variantai: ['$ax + by = c$', '$ax^2 + by = c$', '$ax + by^2 = c$', '$axy = c$'],
        teisingas: 0,
        sprendimas: 'Abu nežinomieji turi būti pirmojo laipsnio ir nesudauginti.',
      }),

    // 7. Netinkama pora
    () => {
      const yBlogas = y + atsitiktinis(1, 4)
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Ar pora $(${x}; ${yBlogas})$ yra lygties $${kaire(a, b)} = ${c}$ sprendinys?`,
        variantai: ['ne', 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `Įrašius gaunama $${a * x + b * yBlogas}$, o ne $${c}$.`,
      })
    },
  ])
}

// ── 5.2. Tiesinės lygties su dviem nežinomaisiais grafikas ──────────────────

const T2 = 'tiesines-lygties-grafikas'

const A_GRAFIKAS = [
  {
    klausimas: 'Kokia linija yra tiesinės lygties su dviem nežinomaisiais grafikas?',
    atsakymas: 'tiese',
    atsakymasRodymui: 'Tiesė',
    sprendimas: 'Todėl lygtis ir vadinama tiesine.',
  },
] as const

export const tiesinesLygtiesGrafikas: Generatorius = () => suBandymais(kurkGrafika, A_GRAFIKAS, T2)

function kurkGrafika(): Uzdavinys | null {
  const k = pasirink([1, 2, -1, -2])
  const b = pasirink([-3, -2, -1, 1, 2, 3])

  return variacija([
    // 1. Kokia linija
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kokia linija yra tiesinės lygties su dviem nežinomaisiais grafikas?',
        variantai: ['tiesė', 'parabolė', 'hiperbolė', 'apskritimas'],
        teisingas: 0,
        sprendimas: 'Todėl lygtis ir vadinama tiesine.',
        brezinys: koordinaciuPlokstuma([], 5, [[[-4, k * -4 + b], [4, k * 4 + b]]]),
      }),

    // 2. Kiek taškų reikia
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek taškų pakanka tiesinės lygties grafikui nubrėžti?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Per du taškus eina vienintelė tiesė.',
      }),

    // 3. Taškas ant tiesės
    () => {
      const x = atsitiktinis(-3, 3)
      return uzdavinys(T2, {
        klausimas: `Rask $y$, kai $x = ${x}$, jei $y = ${narys(k, 'x')} ${b < 0 ? `- ${-b}` : `+ ${b}`}$.`,
        atsakymas: String(k * x + b),
        atsakymasRodymui: `$${k * x + b}$`,
        sprendimas: `$${k} \\cdot (${x}) ${b < 0 ? `- ${-b}` : `+ ${b}`} = ${k * x + b}$.`,
      })
    },

    // 4. Sankirta su y ašimi
    () =>
      uzdavinys(T2, {
        klausimas: `Kokioje $y$ ašies vietoje tiesė $y = ${narys(k, 'x')} ${b < 0 ? `- ${-b}` : `+ ${b}`}$ kerta ašį? Užrašyk ordinatę.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: 'Ant $y$ ašies $x = 0$, tad lieka laisvasis narys.',
      }),

    // 5. Ar taškas priklauso
    () => {
      const x = atsitiktinis(-3, 3)
      const y = k * x + b + atsitiktinis(1, 3)
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar taškas $(${x}; ${y})$ priklauso tiesei $y = ${narys(k, 'x')} ${b < 0 ? `- ${-b}` : `+ ${b}`}$?`,
        variantai: [`ne, nes turėtų būti $y = ${k * x + b}$`, 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `Įrašius $x = ${x}$ gaunama $y = ${k * x + b}$.`,
      })
    },

    // 6. Kylanti ar krintanti
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar tiesė $y = ${narys(k, 'x')} ${b < 0 ? `- ${-b}` : `+ ${b}`}$ kyla, ar leidžiasi?`,
        variantai: k > 0 ? ['kyla', 'leidžiasi', 'horizontali'] : ['leidžiasi', 'kyla', 'horizontali'],
        teisingas: 0,
        sprendimas: `Koeficientas prie $x$ yra ${k}, tad tiesė ${k > 0 ? 'kyla' : 'leidžiasi'}.`,
        brezinys: koordinaciuPlokstuma([], 5, [[[-4, k * -4 + b], [4, k * 4 + b]]]),
      }),

    // 7. Grafiko taškai
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ką rodo kiekvienas tiesinės lygties grafiko taškas?',
        variantai: [
          'vieną lygties sprendinių porą',
          'lygties koeficientą',
          'lygties laisvąjį narį',
          'sprendinių skaičių',
        ],
        teisingas: 0,
        sprendimas: 'Todėl grafike yra be galo daug taškų — tiek, kiek sprendinių.',
      }),
  ])
}

// ── 5.3. Tiesinių lygčių su dviem nežinomaisiais sistema ────────────────────

const T3 = 'lygciu-sistema-8'

const A_SISTEMA = [
  {
    klausimas: 'Kas yra lygčių sistemos sprendinys?',
    atsakymas: 'pora tenkinanti abi lygtis',
    atsakymasRodymui: 'Skaičių pora, tenkinanti abi lygtis',
    sprendimas: 'Grafiškai tai tiesių susikirtimo taškas.',
  },
] as const

export const lygciuSistema8: Generatorius = () => suBandymais(kurkSistema, A_SISTEMA, T3)

function kurkSistema(): Uzdavinys | null {
  const x = atsitiktinis(-4, 6)
  const y = atsitiktinis(-4, 6)
  const a1 = atsitiktinis(1, 4)
  const b1 = atsitiktinis(1, 4)
  const a2 = atsitiktinis(1, 4)
  const b2 = atsitiktinis(1, 4)
  if (a1 * b2 === a2 * b1) return null
  const c1 = a1 * x + b1 * y
  const c2 = a2 * x + b2 * y

  return variacija([
    // 1. Kas yra sprendinys
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kas yra dviejų tiesinių lygčių sistemos sprendinys?',
        variantai: [
          'skaičių pora, tenkinanti abi sistemos lygtis',
          'pora, tenkinanti bent vieną lygtį',
          'abiejų lygčių sprendinių suma',
          'lygčių koeficientai',
        ],
        teisingas: 0,
        sprendimas: 'Grafiškai tai tiesių susikirtimo taškas.',
      }),

    // 2. Patikra
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Ar pora $(${x}; ${y})$ yra sistemos $${kaire(a1, b1)} = ${c1}$ ir $${kaire(a2, b2)} = ${c2}$ sprendinys?`,
        variantai: ['taip, nes tenkina abi lygtis', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `Įrašius gaunama $${c1}$ ir $${c2}$ — abi lygybės teisingos.`,
      }),

    // 3. Grafinis sprendimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ką grafiškai reiškia sistemos sprendinys?',
        variantai: [
          'tiesių susikirtimo tašką',
          'tiesių ilgį',
          'tiesių nuolydį',
          'atstumą tarp tiesių',
        ],
        teisingas: 0,
        sprendimas: 'Tas taškas priklauso abiem tiesėms, tad tenkina abi lygtis.',
        brezinys: koordinaciuPlokstuma([{ x: 2, y: 1, raide: 'M' }], 5, [
          [[-4, -1], [4, 3]],
          [[-1, 4], [4, -1]],
        ]),
      }),

    // 4. Kaip užrašoma sistema
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip užrašoma dviejų lygčių sistema?',
        variantai: [
          'abi lygtys rašomos viena po kita ir jungiamos riestiniu skliaustu',
          'lygtys sudedamos',
          'lygtys dauginamos',
          'rašoma tik viena lygtis',
        ],
        teisingas: 0,
        sprendimas: 'Riestinis skliaustas rodo, kad abi lygtys turi galioti kartu.',
      }),

    // 5. Rask nežinomąjį
    () =>
      uzdavinys(T3, {
        klausimas: `Sistemos $${kaire(a1, b1)} = ${c1}$ ir $${kaire(a2, b2)} = ${c2}$ sprendinys yra pora, kurios $y = ${y}$. Koks yra $x$?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Įrašius $y = ${y}$ į pirmąją lygtį: $${a1}x = ${c1 - b1 * y}$, tad $x = ${x}$.`,
      }),

    // 6. Kiek nežinomųjų
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek lygčių paprastai reikia, kad sistema su dviem nežinomaisiais turėtų vienintelį sprendinį?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Viena lygtis su dviem nežinomaisiais turi be galo daug sprendinių.',
      }),

    // 7. Netinkanti pora
    () => {
      const yBlogas = y + atsitiktinis(1, 3)
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Pora $(${x}; ${yBlogas})$ tenkina pirmąją, bet ne antrąją sistemos lygtį. Ar ji yra sistemos sprendinys?`,
        variantai: ['ne, sprendinys turi tenkinti abi lygtis', 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Pakanka vienos netenkinamos lygties, kad pora nebūtų sprendinys.',
      })
    },
  ])
}

// ── 5.4. Tiesinių lygčių sistemos sprendinių skaičius ───────────────────────

const T4 = 'sistemos-sprendiniu-skaicius'

const A_SKAICIUS = [
  {
    klausimas: 'Kiek sprendinių turi sistema, kurios tiesės lygiagrečios?',
    atsakymas: '0',
    atsakymasRodymui: '$0$',
    sprendimas: 'Lygiagrečiosios tiesės bendrų taškų neturi.',
  },
] as const

export const sistemosSprendiniuSkaicius: Generatorius = () => suBandymais(kurkSkaiciu, A_SKAICIUS, T4)

function kurkSkaiciu(): Uzdavinys | null {
  const k = pasirink([1, 2, 3])
  const b1 = atsitiktinis(1, 6)
  const b2 = b1 + atsitiktinis(1, 5)

  return variacija([
    // 1. Lygiagrečios tiesės
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek sprendinių turi sistema $y = ${narys(k, 'x')} + ${b1}$ ir $y = ${narys(k, 'x')} + ${b2}$?`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Nuolydžiai vienodi, o laisvieji nariai skiriasi — tiesės lygiagrečios.',
      }),

    // 2. Susikertančios tiesės
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek sprendinių turi sistema $y = ${narys(k, 'x')} + ${b1}$ ir $y = ${narys(k + 1, 'x')} + ${b2}$?`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Nuolydžiai skirtingi, tad tiesės susikerta viename taške.',
      }),

    // 3. Sutampančios tiesės
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kiek sprendinių turi sistema $y = ${narys(k, 'x')} + ${b1}$ ir $${narys(2 * k, 'x')} - 2y = ${-2 * b1}$?`,
        variantai: ['be galo daug', 'vieną', 'nė vieno', 'du'],
        teisingas: 0,
        sprendimas: 'Antroji lygtis gaunama pirmąją padauginus iš 2 — tiesės sutampa.',
      }),

    // 4. Kada nėra sprendinių
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kada tiesinių lygčių sistema neturi sprendinių?',
        variantai: [
          'kai tiesės lygiagrečios ir nesutampa',
          'kai tiesės susikerta',
          'kai tiesės sutampa',
          'niekada',
        ],
        teisingas: 0,
        sprendimas: 'Lygiagrečiosios tiesės bendrų taškų neturi.',
      }),

    // 5. Poros
    () =>
      poruUzdavinys(naujasId(T4), T4, {
        klausimas: 'Sujunk tiesių padėtį su sistemos sprendinių skaičiumi.',
        poros: [
          { kaire: 'tiesės susikerta', desine: 'vienas sprendinys' },
          { kaire: 'tiesės lygiagrečios', desine: 'sprendinių nėra' },
          { kaire: 'tiesės sutampa', desine: 'be galo daug' },
          { kaire: 'tiesės statmenos', desine: 'vienas sprendinys' },
        ],
        sprendimas: 'Statmenos tiesės yra atskiras susikertančiųjų atvejis.',
      }),

    // 6. Iš koeficientų
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kaip iš lygčių pavidalo $y = kx + b$ atpažinti, kad sprendinių nėra?',
        variantai: [
          'koeficientai $k$ vienodi, o $b$ skirtingi',
          'koeficientai $k$ skirtingi',
          'koeficientai $b$ vienodi',
          'visi koeficientai vienodi',
        ],
        teisingas: 0,
        sprendimas: 'Tada tiesės vienodo nuolydžio, bet skirtingose vietose.',
      }),

    // 7. Grafinis atpažinimas
    () =>
      uzdavinys(T4, {
        klausimas: 'Grafike pavaizduotos dvi susikertančios tiesės. Kiek sprendinių turi atitinkama sistema?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Susikirtimo taškas yra vienintelis.',
        brezinys: koordinaciuPlokstuma([], 5, [
          [[-4, -2], [4, 4]],
          [[-3, 4], [4, -2]],
        ]),
      }),
  ])
}

// ── 5.5. Keitimo būdas ──────────────────────────────────────────────────────

const T5 = 'sistemos-keitimo-budu'

const A_KEITIMAS = [
  {
    klausimas: 'Išspręsk keitimo būdu: $y = x + 2$ ir $2x + y = 11$. Koks $x$?',
    atsakymas: '3',
    atsakymasRodymui: '$x = 3$',
    sprendimas: 'Vietoj $y$ įrašoma $x + 2$: $3x + 2 = 11$.',
  },
] as const

export const sistemosKeitimoBudu: Generatorius = () => suBandymais(kurkKeitima, A_KEITIMAS, T5)

function kurkKeitima(): Uzdavinys | null {
  const x = atsitiktinis(-4, 8)
  const y = atsitiktinis(-4, 8)
  const b = y - x
  if (b === 0) return null
  const a2 = atsitiktinis(2, 5)
  const c2 = a2 * x + y

  return variacija([
    // 1. Rask x
    () =>
      uzdavinys(T5, {
        klausimas: `Išspręsk keitimo būdu: $y = x ${b < 0 ? `- ${-b}` : `+ ${b}`}$ ir $${narys(a2, 'x')} + y = ${c2}$. Koks $x$?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Vietoj $y$ įrašoma $x ${b < 0 ? `- ${-b}` : `+ ${b}`}$: $${a2 + 1}x ${b < 0 ? `- ${-b}` : `+ ${b}`} = ${c2}$, tad $x = ${x}$.`,
      }),

    // 2. Rask y
    () =>
      uzdavinys(T5, {
        klausimas: `Sistemos $y = x ${b < 0 ? `- ${-b}` : `+ ${b}`}$ ir $${narys(a2, 'x')} + y = ${c2}$ sprendinio $x = ${x}$. Koks $y$?`,
        atsakymas: String(y),
        atsakymasRodymui: `$y = ${y}$`,
        sprendimas: `$y = ${x} ${b < 0 ? `- ${-b}` : `+ ${b}`} = ${y}$.`,
      }),

    // 3. Kuo remiasi būdas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuo remiasi keitimo būdas?',
        variantai: [
          'vienas nežinomasis išreiškiamas kitu ir įrašomas į antrąją lygtį',
          'lygtys sudedamos',
          'lygtys sudauginamos',
          'lygtys sulyginamos',
        ],
        teisingas: 0,
        sprendimas: 'Taip gaunama viena lygtis su vienu nežinomuoju.',
      }),

    // 4. Kada patogus
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kada keitimo būdas patogiausias?',
        variantai: [
          'kai vienoje lygtyje nežinomasis jau išreikštas arba jo koeficientas lygus 1',
          'kai visi koeficientai dideli',
          'kai lygtys vienodos',
          'kai sprendinių nėra',
        ],
        teisingas: 0,
        sprendimas: 'Tada išreikšti nežinomąjį nereikia arba tai lengva.',
      }),

    // 5. Išreiškimas
    () => {
      const a = atsitiktinis(2, 5)
      const c = a * x + y
      return uzdavinys(T5, {
        klausimas: `Iš lygties $${narys(a, 'x')} + y = ${c}$ išreikšk $y$. Koks bus koeficientas prieš $x$?`,
        atsakymas: String(-a),
        atsakymasRodymui: `$y = ${narys(-a, 'x')} ${c < 0 ? `- ${-c}` : `+ ${c}`}$`,
        sprendimas: `Narys $${narys(a, 'x')}$ perkeliamas į dešinę su priešingu ženklu.`,
      })
    },

    // 6. Sprendinio užrašas
    () =>
      uzdavinys(T5, {
        klausimas: `Sistemos sprendinys yra $x = ${x}$ ir $y = ${y}$. Užrašyk sprendinio poros pirmąjį skaičių.`,
        atsakymas: String(x),
        atsakymasRodymui: `$(${x}; ${y})$`,
        sprendimas: 'Poroje pirmas rašomas $x$, antras — $y$.',
      }),

    // 7. Patikra
    () =>
      uzdavinys(T5, {
        klausimas: `Patikrink porą $(${x}; ${y})$ lygtyje $${narys(a2, 'x')} + y = ${c2}$. Kokia reikšmė gaunama kairėje pusėje?`,
        atsakymas: String(c2),
        atsakymasRodymui: `$${c2}$`,
        sprendimas: `$${a2} \\cdot (${x}) + (${y}) = ${c2}$ — sutampa su dešiniąja puse.`,
      }),
  ])
}

// ── 5.6. Sulyginimo būdas ───────────────────────────────────────────────────

const T6 = 'sistemos-sulyginimo-budu'

const A_SULYGINIMAS = [
  {
    klausimas: 'Išspręsk sulyginimo būdu: $y = 2x + 1$ ir $y = x + 4$. Koks $x$?',
    atsakymas: '3',
    atsakymasRodymui: '$x = 3$',
    sprendimas: 'Sulyginus: $2x + 1 = x + 4$.',
  },
] as const

export const sistemosSulyginimoBudu: Generatorius = () => suBandymais(kurkSulyginima, A_SULYGINIMAS, T6)

function kurkSulyginima(): Uzdavinys | null {
  const x = atsitiktinis(-4, 8)
  const k1 = atsitiktinis(2, 5)
  const k2 = atsitiktinis(1, k1 - 1)
  const b1 = atsitiktinis(-6, 6)
  const y = k1 * x + b1
  const b2 = y - k2 * x

  return variacija([
    // 1. Rask x
    () =>
      uzdavinys(T6, {
        klausimas: `Išspręsk sulyginimo būdu: $y = ${narys(k1, 'x')} ${b1 < 0 ? `- ${-b1}` : `+ ${b1}`}$ ir $y = ${narys(k2, 'x')} ${b2 < 0 ? `- ${-b2}` : `+ ${b2}`}$. Koks $x$?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Sulyginus dešiniąsias puses: $${k1 - k2}x = ${b2 - b1}$, tad $x = ${x}$.`,
      }),

    // 2. Rask y
    () =>
      uzdavinys(T6, {
        klausimas: `Sistemos $y = ${narys(k1, 'x')} ${b1 < 0 ? `- ${-b1}` : `+ ${b1}`}$ sprendinio $x = ${x}$. Koks $y$?`,
        atsakymas: String(y),
        atsakymasRodymui: `$y = ${y}$`,
        sprendimas: `$${k1} \\cdot (${x}) ${b1 < 0 ? `- ${-b1}` : `+ ${b1}`} = ${y}$.`,
      }),

    // 3. Kuo remiasi
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kuo remiasi sulyginimo būdas?',
        variantai: [
          'abiejose lygtyse išreikštas tas pats nežinomasis sulyginamas',
          'lygtys sudedamos',
          'viena lygtis įrašoma į kitą',
          'lygtys dauginamos iš skaičiaus',
        ],
        teisingas: 0,
        sprendimas: 'Jei $y$ lygus abiem reiškiniams, tie reiškiniai lygūs tarpusavyje.',
      }),

    // 4. Kada patogus
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kada sulyginimo būdas patogiausias?',
        variantai: [
          'kai abiejose lygtyse tas pats nežinomasis jau išreikštas',
          'kai koeficientai priešingi',
          'kai lygtys turi skliaustus',
          'kai sprendinių nėra',
        ],
        teisingas: 0,
        sprendimas: 'Tada iš karto galima sulyginti dešiniąsias puses.',
      }),

    // 5. Sulyginta lygtis
    () =>
      uzdavinys(T6, {
        klausimas: `Sulyginus $y = ${narys(k1, 'x')} ${b1 < 0 ? `- ${-b1}` : `+ ${b1}`}$ ir $y = ${narys(k2, 'x')} ${b2 < 0 ? `- ${-b2}` : `+ ${b2}`}$, koks bus koeficientas prieš $x$ gautoje lygtyje?`,
        atsakymas: String(k1 - k2),
        atsakymasRodymui: `$${k1 - k2}$`,
        sprendimas: `$${k1} - ${k2} = ${k1 - k2}$.`,
      }),

    // 6. Grafinė prasmė
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Ką grafiškai reiškia sulyginimo būdas?',
        variantai: [
          'ieškoma $x$ reikšmė, kuriai abiejų tiesių $y$ sutampa',
          'ieškomas tiesių ilgis',
          'tiesės sudedamos',
          'tiesės pasukamos',
        ],
        teisingas: 0,
        sprendimas: 'Tai ir yra susikirtimo taško abscisė.',
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Mokinys sulygino ne tuos pačius nežinomuosius: vienoje lygtyje išreikštą $y$, kitoje — $x$. Kodėl taip negalima?',
        variantai: [
          'nes sulyginti galima tik tuos pačius dydžius',
          'nes lygtys skirtingos',
          'nes koeficientai skiriasi',
          'iš tikrųjų galima',
        ],
        teisingas: 0,
        sprendimas: 'Sulyginami reiškiniai, lygūs tam pačiam nežinomajam.',
      }),
  ])
}

// ── 5.7. Sudėties būdas ─────────────────────────────────────────────────────

const T7 = 'sistemos-sudeties-budu'

const A_SUDETIS = [
  {
    klausimas: 'Išspręsk sudėties būdu: $x + y = 7$ ir $x - y = 1$. Koks $x$?',
    atsakymas: '4',
    atsakymasRodymui: '$x = 4$',
    sprendimas: 'Sudėjus lygtis: $2x = 8$.',
  },
] as const

export const sistemosSudetiesBudu: Generatorius = () => suBandymais(kurkSudeti, A_SUDETIS, T7)

function kurkSudeti(): Uzdavinys | null {
  const x = atsitiktinis(-4, 8)
  const y = atsitiktinis(-4, 8)
  const a = atsitiktinis(1, 4)
  const b = atsitiktinis(1, 4)
  const c1 = a * x + b * y
  const c2 = a * x - b * y

  return variacija([
    // 1. Rask x
    () =>
      uzdavinys(T7, {
        klausimas: `Išspręsk sudėties būdu: $${kaire(a, b)} = ${c1}$ ir $${kaire(a, -b)} = ${c2}$. Koks $x$?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Sudėjus lygtis nariai su $y$ panaikina vienas kitą: $${2 * a}x = ${c1 + c2}$, tad $x = ${x}$.`,
      }),

    // 2. Rask y
    () =>
      uzdavinys(T7, {
        klausimas: `Atėmus lygtį $${kaire(a, -b)} = ${c2}$ iš lygties $${kaire(a, b)} = ${c1}$, koks gaunamas $y$?`,
        atsakymas: String(y),
        atsakymasRodymui: `$y = ${y}$`,
        sprendimas: `Nariai su $x$ panaikina vienas kitą: $${2 * b}y = ${c1 - c2}$, tad $y = ${y}$.`,
      }),

    // 3. Kuo remiasi
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kuo remiasi sudėties būdas?',
        variantai: [
          'lygtys sudedamos taip, kad vienas nežinomasis būtų panaikintas',
          'lygtys sudauginamos',
          'nežinomasis išreiškiamas kitu',
          'lygtys sulyginamos',
        ],
        teisingas: 0,
        sprendimas: 'Kad nariai susinaikintų, jų koeficientai turi būti priešingi.',
      }),

    // 4. Kada reikia dauginti
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ką daryti, kai nė vieno nežinomojo koeficientai nėra priešingi?',
        variantai: [
          'padauginti vieną arba abi lygtis iš tinkamų skaičių',
          'sudėti lygtis kaip yra',
          'atimti laisvuosius narius',
          'sistemos išspręsti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Padauginus lygtį iš skaičiaus jos sprendiniai nesikeičia.',
      }),

    // 5. Su daugyba
    () => {
      const a1 = atsitiktinis(1, 3)
      const a2 = a1 * atsitiktinis(2, 3)
      const bb = atsitiktinis(1, 4)
      const cc1 = a1 * x + bb * y
      const cc2 = a2 * x - bb * y
      return uzdavinys(T7, {
        klausimas: `Sistemoje $${kaire(a1, bb)} = ${cc1}$ ir $${kaire(a2, -bb)} = ${cc2}$ sudėjus lygtis panaikinamas $y$. Koks bus koeficientas prieš $x$?`,
        atsakymas: String(a1 + a2),
        atsakymasRodymui: `$${a1 + a2}$`,
        sprendimas: `$${a1} + ${a2} = ${a1 + a2}$.`,
      })
    },

    // 6. Kas panaikinama
    () =>
      uzdavinys(T7, {
        klausimas: `Sudėjus lygtis $${kaire(a, b)} = ${c1}$ ir $${kaire(a, -b)} = ${c2}$, kuris nežinomasis panaikinamas? Užrašyk jo raidę.`,
        atsakymas: 'y',
        atsakymasRodymui: '$y$',
        sprendimas: `Koeficientai $${b}$ ir $-${b}$ yra priešingi.`,
      }),

    // 7. Patikra
    () =>
      uzdavinys(T7, {
        klausimas: `Patikrink porą $(${x}; ${y})$ lygtyje $${kaire(a, b)} = ${c1}$. Kokia reikšmė gaunama kairėje pusėje?`,
        atsakymas: String(c1),
        atsakymasRodymui: `$${c1}$`,
        sprendimas: `$${a} \\cdot (${x}) + ${b} \\cdot (${y}) = ${c1}$.`,
      }),
  ])
}

// ── 5.8. Judėjimo uždaviniai ────────────────────────────────────────────────

const T8 = 'sistemu-judejimo-uzdaviniai'

const A_JUDEJIMAS = [
  {
    klausimas: 'Valtis upe pasroviui plaukia 12 km/h, prieš srovę — 8 km/h. Koks valties greitis stovinčiame vandenyje?',
    atsakymas: '10',
    atsakymasRodymui: '$10$ km/h',
    sprendimas: '$(12 + 8) : 2 = 10$.',
  },
] as const

export const sistemuJudejimoUzdaviniai: Generatorius = () => suBandymais(kurkJudejima, A_JUDEJIMAS, T8)

function kurkJudejima(): Uzdavinys | null {
  const valtis = atsitiktinis(8, 20)
  const srove = atsitiktinis(1, 5)
  if (srove >= valtis) return null
  const pasroviui = valtis + srove
  const priesSrove = valtis - srove

  return variacija([
    // 1. Valties greitis
    () =>
      uzdavinys(T8, {
        klausimas: `Valtis pasroviui plaukia ${pasroviui} km/h, prieš srovę — ${priesSrove} km/h. Koks valties greitis stovinčiame vandenyje?`,
        atsakymas: String(valtis),
        atsakymasRodymui: `$${valtis}$ km/h`,
        sprendimas: `$(${pasroviui} + ${priesSrove}) : 2 = ${valtis}$.`,
      }),

    // 2. Srovės greitis
    () =>
      uzdavinys(T8, {
        klausimas: `Valtis pasroviui plaukia ${pasroviui} km/h, prieš srovę — ${priesSrove} km/h. Koks srovės greitis?`,
        atsakymas: String(srove),
        atsakymasRodymui: `$${srove}$ km/h`,
        sprendimas: `$(${pasroviui} - ${priesSrove}) : 2 = ${srove}$.`,
      }),

    // 3. Kaip sudaroma sistema
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kokia sistema aprašo valties judėjimą upe?',
        variantai: [
          '$v + s$ — greitis pasroviui, $v - s$ — prieš srovę',
          '$v \\cdot s$ ir $v : s$',
          '$v + s$ abiem kryptimis',
          '$v - s$ abiem kryptimis',
        ],
        teisingas: 0,
        sprendimas: 'Srovė pasroviui greitį didina, prieš srovę — mažina.',
      }),

    // 4. Nuvažiuotas kelias
    () => {
      const laikas = atsitiktinis(2, 6)
      return uzdavinys(T8, {
        klausimas: `Valtis pasroviui plaukė ${laikas} h ${pasroviui} km/h greičiu. Kokį kelią ji nuplaukė?`,
        atsakymas: String(pasroviui * laikas),
        atsakymasRodymui: `$${pasroviui * laikas}$ km`,
        sprendimas: `$${pasroviui} \\cdot ${laikas} = ${pasroviui * laikas}$.`,
      })
    },

    // 5. Du judantys objektai
    () => {
      const v1 = atsitiktinis(40, 70)
      const v2 = atsitiktinis(40, 70)
      const laikas = atsitiktinis(2, 5)
      return uzdavinys(T8, {
        klausimas: `Du automobiliai išvažiuoja vienas kito link iš miestų, nutolusių per ${(v1 + v2) * laikas} km, greičiais ${v1} km/h ir ${v2} km/h. Po kiek valandų jie susitiks?`,
        atsakymas: String(laikas),
        atsakymasRodymui: `$${laikas}$ h`,
        sprendimas: `Suartėjimo greitis $${v1} + ${v2} = ${v1 + v2}$ km/h; $${(v1 + v2) * laikas} : ${v1 + v2} = ${laikas}$.`,
      })
    },

    // 6. Vejamasis
    () => {
      const v1 = atsitiktinis(50, 80)
      const v2 = atsitiktinis(20, v1 - 10)
      const laikas = atsitiktinis(2, 5)
      return uzdavinys(T8, {
        klausimas: `Automobilis ${v1} km/h greičiu vejasi dviratininką, važiuojantį ${v2} km/h, o atstumas tarp jų ${(v1 - v2) * laikas} km. Po kiek valandų automobilis jį pavys?`,
        atsakymas: String(laikas),
        atsakymasRodymui: `$${laikas}$ h`,
        sprendimas: `Artėjimo greitis $${v1} - ${v2} = ${v1 - v2}$ km/h.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kodėl valties greitis pasroviui didesnis nei stovinčiame vandenyje?',
        variantai: [
          'nes prie valties greičio pridedamas srovės greitis',
          'nes valtis lengvesnė',
          'nes upė siauresnė',
          'jis nėra didesnis',
        ],
        teisingas: 0,
        sprendimas: 'Srovė neša valtį ta pačia kryptimi.',
      }),
  ])
}

// ── 5.9. Įvairūs tekstiniai uždaviniai ──────────────────────────────────────

const T9 = 'sistemu-tekstiniai'

const A_TEKSTINIAI = [
  {
    klausimas: 'Du skaičiai: jų suma 20, skirtumas 4. Koks didesnysis?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '$(20 + 4) : 2 = 12$.',
  },
] as const

export const sistemuTekstiniai: Generatorius = () => suBandymais(kurkTekstinius, A_TEKSTINIAI, T9)

function kurkTekstinius(): Uzdavinys | null {
  const a = atsitiktinis(5, 30)
  const b = atsitiktinis(2, a - 1)

  return variacija([
    // 1. Suma ir skirtumas
    () =>
      uzdavinys(T9, {
        klausimas: `Dviejų skaičių suma ${a + b}, o skirtumas ${a - b}. Koks didesnysis skaičius?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$(${a + b} + ${a - b}) : 2 = ${a}$.`,
      }),

    // 2. Mažesnysis
    () =>
      uzdavinys(T9, {
        klausimas: `Dviejų skaičių suma ${a + b}, o skirtumas ${a - b}. Koks mažesnysis skaičius?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$(${a + b} - ${a - b}) : 2 = ${b}$.`,
      }),

    // 3. Bilietai
    () => {
      const suaugusio = atsitiktinis(5, 12)
      const vaiko = atsitiktinis(2, suaugusio - 1)
      const nSuaugusiu = atsitiktinis(2, 8)
      const nVaiku = atsitiktinis(2, 8)
      const viso = nSuaugusiu * suaugusio + nVaiku * vaiko
      return uzdavinys(T9, {
        klausimas: `${nSuaugusiu} suaugusiųjų bilietai po ${suaugusio} Eur ir ${nVaiku} vaikų bilietai kartu kainavo ${viso} Eur. Kiek kainavo vienas vaiko bilietas?`,
        atsakymas: String(vaiko),
        atsakymasRodymui: `$${vaiko}$ Eur`,
        sprendimas: `$${viso} - ${nSuaugusiu} \\cdot ${suaugusio} = ${nVaiku * vaiko}$; $${nVaiku * vaiko} : ${nVaiku} = ${vaiko}$.`,
      })
    },

    // 4. Amžiai
    () => {
      const skirtumas = atsitiktinis(20, 32)
      const sunus = atsitiktinis(8, 18)
      return uzdavinys(T9, {
        klausimas: `Tėvas ${skirtumas} metais vyresnis už sūnų, o jų amžių suma ${2 * sunus + skirtumas}. Kiek metų sūnui?`,
        atsakymas: String(sunus),
        atsakymasRodymui: `$${sunus}$`,
        sprendimas: `$(${2 * sunus + skirtumas} - ${skirtumas}) : 2 = ${sunus}$.`,
      })
    },

    // 5. Perimetras ir skirtumas
    () => {
      const plotis = atsitiktinis(3, 15)
      const skirtumas = atsitiktinis(2, 8)
      const ilgis = plotis + skirtumas
      return uzdavinys(T9, {
        klausimas: `Stačiakampio perimetras ${2 * (plotis + ilgis)} cm, o ilgis ${skirtumas} cm didesnis už plotį. Koks plotis?`,
        atsakymas: String(plotis),
        atsakymasRodymui: `$${plotis}$ cm`,
        sprendimas: `Pusperimetris $${plotis + ilgis}$; $(${plotis + ilgis} - ${skirtumas}) : 2 = ${plotis}$.`,
      })
    },

    // 6. Kaip sudaroma sistema
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kaip sudaroma lygčių sistema tekstiniam uždaviniui?',
        variantai: [
          'du nežinomi dydžiai pažymimi raidėmis, o sąlygos užrašomos dviem lygtimis',
          'užrašoma viena lygtis',
          'visi skaičiai sudedami',
          'sistema sudaroma tik iš skaičių',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienas sąlygos sakinys paprastai duoda po vieną lygtį.',
      }),

    // 7. Monetos
    () => {
      const dvieju = atsitiktinis(3, 12)
      const penkiu = atsitiktinis(3, 12)
      return uzdavinys(T9, {
        klausimas: `Piniginėje ${dvieju + penkiu} monetų po 2 Eur ir 5 Eur, o jų bendra vertė ${2 * dvieju + 5 * penkiu} Eur. Kiek yra 5 Eur monetų?`,
        atsakymas: String(penkiu),
        atsakymasRodymui: `$${penkiu}$`,
        sprendimas: `Jei visos būtų po 2 Eur, vertė būtų $${2 * (dvieju + penkiu)}$; skirtumas $${2 * dvieju + 5 * penkiu - 2 * (dvieju + penkiu)}$ dalijamas iš $5 - 2 = 3$.`,
      })
    },
  ])
}

// ── Tiesinis sąryšis: lentelė, formulė ir grafikas (programos potemė) ───────

const T10 = 'tiesinis-sarysis'

const A_SARYSIS = [
  {
    klausimas: 'Pagal formulę $y = 3x + 1$ apskaičiuok $y$, kai $x = 4$.',
    atsakymas: '13',
    atsakymasRodymui: '$13$',
    sprendimas: '$3 \\cdot 4 + 1 = 13$.',
  },
] as const

export const tiesinisSarysis: Generatorius = () => suBandymais(kurkSarysi, A_SARYSIS, T10)

function kurkSarysi(): Uzdavinys | null {
  const k = atsitiktinis(2, 6)
  const b = atsitiktinis(1, 8)
  const x = atsitiktinis(2, 9)

  return variacija([
    // 1. Reikšmė pagal formulę
    () =>
      uzdavinys(T10, {
        klausimas: `Pagal formulę $y = ${narys(k, 'x')} + ${b}$ apskaičiuok $y$, kai $x = ${x}$.`,
        atsakymas: String(k * x + b),
        atsakymasRodymui: `$${k * x + b}$`,
        sprendimas: `$${k} \\cdot ${x} + ${b} = ${k * x + b}$.`,
      }),

    // 2. Lentelės pildymas
    () =>
      uzdavinys(T10, {
        klausimas: `Lentelė pildoma pagal formulę $y = ${narys(k, 'x')} + ${b}$. Kokia bus trūkstama reikšmė?`,
        atsakymas: String(k * 5 + b),
        atsakymasRodymui: `$${k * 5 + b}$`,
        sprendimas: `Kai $x = 5$: $${k} \\cdot 5 + ${b} = ${k * 5 + b}$.`,
        brezinys: ivestiesLentele([1, 2, 3, 5], [k + b, 2 * k + b, 3 * k + b, null]),
      }),

    // 3. Formulė iš lentelės
    () =>
      uzdavinys(T10, {
        klausimas: 'Lentelė pildyta pagal tiesinį sąryšį. Koks yra koeficientas prieš $x$?',
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `Kiekvienas $x$ žingsnis padidina $y$ per ${k}.`,
        brezinys: ivestiesLentele([1, 2, 3, 4], [k + b, 2 * k + b, 3 * k + b, 4 * k + b]),
      }),

    // 4. Laisvasis narys iš lentelės
    () =>
      uzdavinys(T10, {
        klausimas: `Tiesinio sąryšio koeficientas prie $x$ yra ${k}, o kai $x = 1$, tai $y = ${k + b}$. Koks laisvasis narys?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${k + b} - ${k} = ${b}$.`,
      }),

    // 5. Atvirkštinis
    () =>
      uzdavinys(T10, {
        klausimas: `Pagal formulę $y = ${narys(k, 'x')} + ${b}$ rask $x$, kai $y = ${k * x + b}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `$${k * x + b} - ${b} = ${k * x}$; $${k * x} : ${k} = ${x}$.`,
      }),

    // 6. Trys pavidalai
    () =>
      poruUzdavinys(naujasId(T10), T10, {
        klausimas: 'Sujunk tiesinio sąryšio pateikimo būdą su tuo, ką jis parodo geriausiai.',
        poros: [
          { kaire: 'formulė', desine: 'leidžia apskaičiuoti bet kurią reikšmę' },
          { kaire: 'lentelė', desine: 'rodo konkrečias poras' },
          { kaire: 'grafikas', desine: 'rodo bendrą kitimo vaizdą' },
          { kaire: 'tekstas', desine: 'nusako situaciją' },
        ],
        sprendimas: 'Tas pats sąryšis gali būti užrašytas visais keturiais būdais.',
      }),

    // 7. Ar sąryšis tiesinis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kaip iš lentelės atpažinti, kad sąryšis tiesinis?',
        variantai: [
          'vienodiems $x$ pokyčiams atitinka vienodi $y$ pokyčiai',
          'visos $y$ reikšmės vienodos',
          '$y$ reikšmės didėja dvigubai',
          'lentelėje yra keturios reikšmės',
        ],
        teisingas: 0,
        sprendimas: 'Tada grafikas yra tiesė.',
      }),
  ])
}

// ── 6.1. Vektoriaus sąvoka ──────────────────────────────────────────────────

const T11 = 'vektoriaus-savoka'

const A_VEKTORIUS = [
  {
    klausimas: 'Kuo vektorius skiriasi nuo atkarpos?',
    atsakymas: 'turi krypti',
    atsakymasRodymui: 'Vektorius turi ir kryptį',
    sprendimas: 'Atkarpa turi tik ilgį.',
  },
] as const

export const vektoriausSavoka: Generatorius = () => suBandymais(kurkVektoriu, A_VEKTORIUS, T11)

function kurkVektoriu(): Uzdavinys | null {
  const x = atsitiktinis(1, 5)
  const y = atsitiktinis(1, 4)

  return variacija([
    // 1. Kuo skiriasi nuo atkarpos
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kuo vektorius skiriasi nuo atkarpos?',
        variantai: [
          'vektorius turi ne tik ilgį, bet ir kryptį',
          'vektorius ilgesnis',
          'vektorius neturi galų',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Todėl vektorius brėžiamas su rodykle.',
        brezinys: vektoriaiTinklelyje([{ v: { x, y, vardas: 'a' }, pradzia: { x: 1, y: 2 } }]),
      }),

    // 2. Koordinatės
    () =>
      uzdavinys(T11, {
        klausimas: `Vektoriaus pradžia yra taške $(1; 2)$, pabaiga — $(${1 + x}; ${2 + y})$. Kokia jo pirmoji koordinatė?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Iš pabaigos abscisės atimama pradžios: $${1 + x} - 1 = ${x}$.`,
      }),

    // 3. Antroji koordinatė
    () =>
      uzdavinys(T11, {
        klausimas: `Vektoriaus pradžia yra taške $(1; 2)$, pabaiga — $(${1 + x}; ${2 + y})$. Kokia jo antroji koordinatė?`,
        atsakymas: String(y),
        atsakymasRodymui: `$${y}$`,
        sprendimas: `$${2 + y} - 2 = ${y}$.`,
      }),

    // 4. Ilgis
    () => {
      const a = 3
      const b = 4
      return uzdavinys(T11, {
        klausimas: `Koks yra vektoriaus $(${a}; ${b})$ ilgis?`,
        atsakymas: '5',
        atsakymasRodymui: '$5$',
        sprendimas: `Pagal Pitagoro teoremą: $\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = 5$.`,
      })
    },

    // 5. Nulinis vektorius
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Koks vektorius vadinamas nuliniu?',
        variantai: [
          'kurio pradžia ir pabaiga sutampa',
          'kurio kryptis į kairę',
          'kurio ilgis lygus vienetui',
          'kurio koordinatės neigiamos',
        ],
        teisingas: 0,
        sprendimas: 'Jo ilgis lygus nuliui, o kryptis neapibrėžta.',
      }),

    // 6. Iš brėžinio
    () =>
      uzdavinys(T11, {
        klausimas: 'Kokia yra pavaizduoto vektoriaus pirmoji koordinatė (kiek langelių į dešinę)?',
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: 'Skaičiuojama, per kiek langelių pasislenka rodyklė horizontaliai.',
        brezinys: vektoriaiTinklelyje([{ v: { x, y, vardas: 'a' }, pradzia: { x: 1, y: 1 } }]),
      }),

    // 7. Kur naudojami
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kokiems dydžiams aprašyti naudojami vektoriai?',
        variantai: [
          'turintiems ir dydį, ir kryptį, pavyzdžiui, greičiui ar jėgai',
          'tik ilgiams',
          'tik plotams',
          'tik temperatūrai',
        ],
        teisingas: 0,
        sprendimas: 'Masė ar temperatūra krypties neturi, tad vektoriais nežymimos.',
      }),
  ])
}

// ── 6.2. Vektorių lygumas ───────────────────────────────────────────────────

const T12 = 'vektoriu-lygumas'

const A_LYGUMAS = [
  {
    klausimas: 'Kada du vektoriai vadinami lygiais?',
    atsakymas: 'kai vienodo ilgio ir krypties',
    atsakymasRodymui: 'Kai jie vienodo ilgio ir tos pačios krypties',
    sprendimas: 'Vieta plokštumoje nesvarbi.',
  },
] as const

export const vektoriuLygumas: Generatorius = () => suBandymais(kurkLyguma, A_LYGUMAS, T12)

function kurkLyguma(): Uzdavinys | null {
  const x = atsitiktinis(1, 4)
  const y = atsitiktinis(1, 3)

  return variacija([
    // 1. Kada lygūs
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kada du vektoriai vadinami lygiais?',
        variantai: [
          'kai jie vienodo ilgio ir tos pačios krypties',
          'kai jie yra toje pačioje vietoje',
          'kai jie vienodo ilgio',
          'kai jų kryptys priešingos',
        ],
        teisingas: 0,
        sprendimas: 'Lygūs vektoriai gali būti skirtingose plokštumos vietose.',
        brezinys: vektoriaiTinklelyje([
          { v: { x, y, vardas: 'a' }, pradzia: { x: 0, y: 1 } },
          { v: { x, y, vardas: 'b' }, pradzia: { x: 5, y: 4 } },
        ]),
      }),

    // 2. Ar lygūs pagal koordinates
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Ar vektoriai $(${x}; ${y})$ ir $(${x}; ${y})$ lygūs?`,
        variantai: ['taip, nes jų koordinatės sutampa', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Vektorių lygumą lemia tik koordinatės.',
      }),

    // 3. Nelygūs vektoriai
    () => {
      if (x === y) return null
      return pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Ar vektoriai $(${x}; ${y})$ ir $(${y}; ${x})$ lygūs, kai $${x} \\ne ${y}$?`,
        variantai: ['ne, jų koordinatės skiriasi', 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Koordinačių tvarka svarbi.',
      })
    },

    // 4. Priešingi vektoriai
    () =>
      uzdavinys(T12, {
        klausimas: `Koks vektorius yra priešingas vektoriui $(${x}; ${y})$? Užrašyk jo pirmąją koordinatę.`,
        atsakymas: String(-x),
        atsakymasRodymui: `$(-${x}; -${y})$`,
        sprendimas: 'Priešingas vektorius turi tą patį ilgį, bet priešingą kryptį.',
      }),

    // 5. Kolinearumas
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kokie vektoriai vadinami kolineariais?',
        variantai: [
          'esantys lygiagrečiose arba toje pačioje tiesėje',
          'vienodo ilgio',
          'statmeni',
          'nuliniai',
        ],
        teisingas: 0,
        sprendimas: 'Lygūs vektoriai visada kolinearūs, bet kolinearūs nebūtinai lygūs.',
      }),

    // 6. Lygumas iš brėžinio
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ar pavaizduoti vektoriai lygūs?',
        variantai: ['taip, jie vienodo ilgio ir krypties', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Vieta plokštumoje vektorių lygumui įtakos neturi.',
        brezinys: vektoriaiTinklelyje([
          { v: { x, y, vardas: 'a' }, pradzia: { x: 0, y: 0 } },
          { v: { x, y, vardas: 'b' }, pradzia: { x: 4, y: 3 } },
        ]),
      }),

    // 7. Lygiagretainio kraštinės
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ką galima pasakyti apie lygiagretainio priešingų kraštinių vektorius, nukreiptus ta pačia kryptimi?',
        variantai: ['jie lygūs', 'jie priešingi', 'jie statmeni', 'jie nuliniai'],
        teisingas: 0,
        sprendimas: 'Priešingos lygiagretainio kraštinės lygios ir lygiagrečios.',
      }),
  ])
}

// ── 6.3. Vektorių sudėtis ───────────────────────────────────────────────────

const T13 = 'vektoriu-sudetis'

const A_VEKT_SUDETIS = [
  {
    klausimas: 'Sudėk vektorius $(3; 1)$ ir $(2; 4)$. Užrašyk pirmąją sumos koordinatę.',
    atsakymas: '5',
    atsakymasRodymui: '$(5; 5)$',
    sprendimas: 'Koordinatės sudedamos atskirai.',
  },
] as const

export const vektoriuSudetis: Generatorius = () => suBandymais(kurkVektSudeti, A_VEKT_SUDETIS, T13)

function kurkVektSudeti(): Uzdavinys | null {
  const a = { x: atsitiktinis(3, 5), y: atsitiktinis(1, 2) }
  const b = { x: atsitiktinis(1, 2), y: atsitiktinis(3, 4) }

  return variacija([
    // 1. Pirmoji koordinatė
    () =>
      uzdavinys(T13, {
        klausimas: `Sudėk vektorius $(${a.x}; ${a.y})$ ir $(${b.x}; ${b.y})$. Užrašyk pirmąją sumos koordinatę.`,
        atsakymas: String(a.x + b.x),
        atsakymasRodymui: `$(${a.x + b.x}; ${a.y + b.y})$`,
        sprendimas: `$${a.x} + ${b.x} = ${a.x + b.x}$.`,
      }),

    // 2. Antroji koordinatė
    () =>
      uzdavinys(T13, {
        klausimas: `Sudėk vektorius $(${a.x}; ${a.y})$ ir $(${b.x}; ${b.y})$. Užrašyk antrąją sumos koordinatę.`,
        atsakymas: String(a.y + b.y),
        atsakymasRodymui: `$${a.y + b.y}$`,
        sprendimas: `$${a.y} + ${b.y} = ${a.y + b.y}$.`,
      }),

    // 3. Trikampio taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Kaip vektoriai sudedami trikampio taisykle?',
        variantai: [
          'antrasis vektorius atidedamas nuo pirmojo galo, o suma jungia pirmojo pradžią su antrojo galu',
          'abu vektoriai atidedami nuo to paties taško',
          'vektoriai sudedami po vieną koordinatę',
          'vektoriai sudauginami',
        ],
        teisingas: 0,
        sprendimas: 'Brėžinyje matyti, kaip susidaro trikampis.',
        brezinys: vektoriaiTinklelyje([
          { v: { x: a.x, y: a.y, vardas: 'a' }, pradzia: { x: 1, y: 1 } },
          { v: { x: b.x, y: b.y, vardas: 'b' }, pradzia: { x: 1 + a.x, y: 1 + a.y } },
          { v: { x: a.x + b.x, y: a.y + b.y, vardas: 'a+b' }, pradzia: { x: 1, y: 1 } },
        ]),
      }),

    // 4. Lygiagretainio taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Kaip vektoriai sudedami lygiagretainio taisykle?',
        variantai: [
          'abu atidedami nuo to paties taško, o suma yra lygiagretainio įstrižainė',
          'antrasis atidedamas nuo pirmojo galo',
          'vektoriai sukeičiami vietomis',
          'vektoriai dalijami pusiau',
        ],
        teisingas: 0,
        sprendimas: 'Abi taisyklės duoda tą pačią sumą.',
      }),

    // 5. Perstatomumas
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Ar vektorių sudėčiai galioja perstatomumo dėsnis?',
        variantai: [
          'taip, $\\vec{a} + \\vec{b} = \\vec{b} + \\vec{a}$',
          'ne',
          'taip, tik kolineariems vektoriams',
          'taip, tik nuliniams vektoriams',
        ],
        teisingas: 0,
        sprendimas: 'Koordinatės sudedamos, o skaičių sudėtis perstatoma.',
      }),

    // 6. Suma su priešingu
    () =>
      uzdavinys(T13, {
        klausimas: `Kam lygi vektorių $(${a.x}; ${a.y})$ ir $(-${a.x}; -${a.y})$ suma? Užrašyk pirmąją koordinatę.`,
        atsakymas: '0',
        atsakymasRodymui: '$(0; 0)$',
        sprendimas: 'Vektoriaus ir jam priešingo suma yra nulinis vektorius.',
      }),

    // 7. Suma iš brėžinio
    () =>
      uzdavinys(T13, {
        klausimas: 'Kokia yra pavaizduotos vektorių sumos pirmoji koordinatė?',
        atsakymas: String(a.x + b.x),
        atsakymasRodymui: `$${a.x + b.x}$`,
        sprendimas: `$${a.x} + ${b.x} = ${a.x + b.x}$.`,
        brezinys: vektoriaiTinklelyje([
          { v: { x: a.x, y: a.y, vardas: 'a' }, pradzia: { x: 1, y: 1 } },
          { v: { x: b.x, y: b.y, vardas: 'b' }, pradzia: { x: 1 + a.x, y: 1 + a.y } },
        ]),
      }),
  ])
}

// ── 6.4. Vektorių atimtis ───────────────────────────────────────────────────

const T14 = 'vektoriu-atimtis'

const A_VEKT_ATIMTIS = [
  {
    klausimas: 'Atimk: $(5; 4) - (2; 1)$. Užrašyk pirmąją koordinatę.',
    atsakymas: '3',
    atsakymasRodymui: '$(3; 3)$',
    sprendimas: 'Koordinatės atimamos atskirai.',
  },
] as const

export const vektoriuAtimtis: Generatorius = () => suBandymais(kurkVektAtimti, A_VEKT_ATIMTIS, T14)

function kurkVektAtimti(): Uzdavinys | null {
  const a = { x: atsitiktinis(3, 8), y: atsitiktinis(3, 7) }
  const b = { x: atsitiktinis(1, a.x - 1), y: atsitiktinis(1, a.y - 1) }

  return variacija([
    // 1. Pirmoji koordinatė
    () =>
      uzdavinys(T14, {
        klausimas: `Atimk: $(${a.x}; ${a.y}) - (${b.x}; ${b.y})$. Užrašyk pirmąją koordinatę.`,
        atsakymas: String(a.x - b.x),
        atsakymasRodymui: `$(${a.x - b.x}; ${a.y - b.y})$`,
        sprendimas: `$${a.x} - ${b.x} = ${a.x - b.x}$.`,
      }),

    // 2. Antroji koordinatė
    () =>
      uzdavinys(T14, {
        klausimas: `Atimk: $(${a.x}; ${a.y}) - (${b.x}; ${b.y})$. Užrašyk antrąją koordinatę.`,
        atsakymas: String(a.y - b.y),
        atsakymasRodymui: `$${a.y - b.y}$`,
        sprendimas: `$${a.y} - ${b.y} = ${a.y - b.y}$.`,
      }),

    // 3. Kuo pakeičiama atimtis
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kuo pakeičiama vektorių atimtis?',
        variantai: [
          'sudėtimi su priešingu vektoriumi',
          'daugyba iš $-1$',
          'sudėtimi su tuo pačiu vektoriumi',
          'niekuo',
        ],
        teisingas: 0,
        sprendimas: '$\\vec{a} - \\vec{b} = \\vec{a} + (-\\vec{b})$.',
      }),

    // 4. Vektorius iš dviejų taškų
    () =>
      uzdavinys(T14, {
        klausimas: `Taškai $A(${b.x}; ${b.y})$ ir $B(${a.x}; ${a.y})$. Kokia vektoriaus $\\vec{AB}$ pirmoji koordinatė?`,
        atsakymas: String(a.x - b.x),
        atsakymasRodymui: `$${a.x - b.x}$`,
        sprendimas: 'Iš pabaigos koordinačių atimamos pradžios koordinatės.',
      }),

    // 5. Skirtumas su savimi
    () =>
      uzdavinys(T14, {
        klausimas: `Kam lygus $(${a.x}; ${a.y}) - (${a.x}; ${a.y})$? Užrašyk pirmąją koordinatę.`,
        atsakymas: '0',
        atsakymasRodymui: '$(0; 0)$',
        sprendimas: 'Gaunamas nulinis vektorius.',
      }),

    // 6. Priešinga tvarka
    () =>
      uzdavinys(T14, {
        klausimas: `Kokia yra skirtumo $(${b.x}; ${b.y}) - (${a.x}; ${a.y})$ pirmoji koordinatė?`,
        atsakymas: String(b.x - a.x),
        atsakymasRodymui: `$${b.x - a.x}$`,
        sprendimas: `$${b.x} - ${a.x} = ${b.x - a.x}$ — gaunamas priešingas vektorius.`,
      }),

    // 7. Ar galioja perstatomumas
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Ar vektorių atimčiai galioja perstatomumo dėsnis?',
        variantai: [
          'ne, sukeitus vektorius gaunamas priešingas vektorius',
          'taip',
          'taip, tik kolineariems',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Kaip ir skaičių atimtyje, tvarka svarbi.',
      }),
  ])
}

// ── 6.5. Vektoriaus daugyba iš skaičiaus ────────────────────────────────────

const T15 = 'vektoriaus-daugyba'

const A_VEKT_DAUGYBA = [
  {
    klausimas: 'Padaugink vektorių $(2; 3)$ iš 4. Užrašyk pirmąją koordinatę.',
    atsakymas: '8',
    atsakymasRodymui: '$(8; 12)$',
    sprendimas: 'Kiekviena koordinatė dauginama iš skaičiaus.',
  },
] as const

export const vektoriausDaugyba: Generatorius = () => suBandymais(kurkVektDaugyba, A_VEKT_DAUGYBA, T15)

function kurkVektDaugyba(): Uzdavinys | null {
  const v = { x: atsitiktinis(1, 6), y: atsitiktinis(1, 6) }
  const k = atsitiktinis(2, 6)

  return variacija([
    // 1. Pirmoji koordinatė
    () =>
      uzdavinys(T15, {
        klausimas: `Padaugink vektorių $(${v.x}; ${v.y})$ iš ${k}. Užrašyk pirmąją koordinatę.`,
        atsakymas: String(k * v.x),
        atsakymasRodymui: `$(${k * v.x}; ${k * v.y})$`,
        sprendimas: `$${k} \\cdot ${v.x} = ${k * v.x}$.`,
      }),

    // 2. Antroji koordinatė
    () =>
      uzdavinys(T15, {
        klausimas: `Padaugink vektorių $(${v.x}; ${v.y})$ iš ${k}. Užrašyk antrąją koordinatę.`,
        atsakymas: String(k * v.y),
        atsakymasRodymui: `$${k * v.y}$`,
        sprendimas: `$${k} \\cdot ${v.y} = ${k * v.y}$.`,
      }),

    // 3. Kaip keičiasi ilgis
    () =>
      uzdavinys(T15, {
        klausimas: `Vektorius padaugintas iš ${k}. Kiek kartų pailgėja vektorius?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: 'Daugyba iš teigiamo skaičiaus keičia tik ilgį, ne kryptį.',
      }),

    // 4. Daugyba iš neigiamo
    () =>
      pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: `Kas atsitinka vektoriui, padauginus jį iš $-${k}$?`,
        variantai: [
          `jis pailgėja ${k} kartus ir pakeičia kryptį į priešingą`,
          `jis tik pailgėja ${k} kartus`,
          'jis tik pakeičia kryptį',
          'jis tampa nuliniu',
        ],
        teisingas: 0,
        sprendimas: 'Neigiamas daugiklis apverčia kryptį.',
      }),

    // 5. Daugyba iš nulio
    () =>
      uzdavinys(T15, {
        klausimas: `Kam lygus $0 \\cdot (${v.x}; ${v.y})$? Užrašyk pirmąją koordinatę.`,
        atsakymas: '0',
        atsakymasRodymui: '$(0; 0)$',
        sprendimas: 'Gaunamas nulinis vektorius.',
      }),

    // 6. Kolinearumas
    () =>
      pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: `Kokie yra vektoriai $(${v.x}; ${v.y})$ ir $(${k * v.x}; ${k * v.y})$?`,
        variantai: ['kolinearūs', 'statmeni', 'lygūs', 'priešingi'],
        teisingas: 0,
        sprendimas: 'Vienas gaunamas iš kito padauginus iš skaičiaus, tad jie tos pačios krypties.',
      }),

    // 7. Atvirkštinis
    () =>
      uzdavinys(T15, {
        klausimas: `Iš kokio skaičiaus padaugintas vektorius $(${v.x}; ${v.y})$, jei gauta $(${k * v.x}; ${k * v.y})$?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `$${k * v.x} : ${v.x} = ${k}$.`,
      }),
  ])
}
