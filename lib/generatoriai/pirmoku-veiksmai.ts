import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { daiktuEile, zodis, type Daiktas } from './ikonos'
import { langeliuEile, skyriuBlokai } from './vaizdai'
import type { Generatorius, Lygis, Sritis, Uzdavinys } from './tipai'

/**
 * 1 klasės 2 ir 3 temos: „Sudėtis ir atimtis nuo 0 iki 9“ ir „Dviženkliai
 * skaičiai iki 20“.
 *
 * Abi temos turi po vienuolika potemių, ir visos jos anksčiau rodė tą patį
 * bendrą `sudetis-atimtis` generatorių. Todėl „Kas yra dėmuo ir suma?“,
 * „Kiek liko?“ ir „Kokio skaičiaus trūksta?“ duodavo vienodus „Apskaičiuok:
 * $a + b$“ — nė viena potemė negaudavo savo turinio. Čia kiekviena turi savo
 * generatorių, o pavidalai paimti iš uždavinių sąlygų banko.
 *
 * Iš to paties banko paimtos ir kalbos taisyklės, galiojančios pirmai klasei:
 * sakinys trumpas ir tiesioginis, klausiama „Kiek…?“, „Koks…?“, „Užbaik…“,
 * „Įrašyk…“, o daiktavardis derinamas su skaičiumi (1 obuolys, 3 obuoliai,
 * 0 obuolių).
 *
 * Sritį nustato tema: 2-ai — [0, 9], 3-iai — [0, 20]. Generatorius jos
 * neperžengia nė tarpiniuose sprendimo skaičiuose, nes `uzRibos` tikrina ir
 * sprendimą.
 */

/** Daiktai, kuriuos pirmokas atpažįsta iš pirmo žvilgsnio ir lengvai suskaičiuoja. */
const SKAICIUOJAMI: readonly Daiktas[] = [
  'obuolys',
  'balionas',
  'sausainis',
  'kubelis',
  'zvaigzde',
  'piestukas',
  'kamuolys',
  'gele',
]

/**
 * Vardai tekstiniams uždaviniams.
 *
 * Imami iš banko, o ne sugalvojami: taip uždaviniai skamba kaip vadovėlio,
 * kurį vaikas turi ant stalo.
 */
const VARDAI = ['Ugnė', 'Matas', 'Ieva', 'Lina', 'Tomas', 'Rugilė', 'Jonas'] as const

/** Daiktavardžio formos skaičiui derinti — `derink` argumentas. */
type Formos = { vns: string; dgs: string; kilm: string }

/** „3 obuoliai“, „1 obuolys“, „0 obuolių“. */
function suSkaiciumi(n: number, formos: Formos): string {
  return `${n} ${derink(n, formos)}`
}

// ═══ 2 tema. Sudėtis ir atimtis nuo 0 iki 9 ═════════════════════════════════

/** Temos viršutinė riba. Lengvesnis lygis lieka mažesniuose skaičiuose. */
function riba2(lygis: Lygis, sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 9, lygis === 1 ? 6 : 9)
}

// ── 2.1 Kiek yra iš viso? ───────────────────────────────────────────────────

const A_IS_VISO = [
  {
    klausimas: 'Kiek iš viso balionų?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Vienoje grupėje 3, kitoje 2. Iš viso $3 + 2 = 5$.',
  },
] as const

export const kiekIsViso: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkIsViso(lygis, sritis), A_IS_VISO, 'kiek-is-viso')

function kurkIsViso(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba2(lygis, sritis)
  const d = pasirink(SKAICIUOJAMI)
  const z = zodis(d)

  return variacija([
    // 1. Dvi grupės piešinyje
    () => {
      const a = atsitiktinis(1, maks - 1)
      const b = atsitiktinis(1, maks - a)
      return uzdavinys('kiek-is-viso', {
        klausimas: `Kiek iš viso ${z.dgsK}?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Vienoje grupėje ${a}, kitoje ${b}. Iš viso $${a} + ${b} = ${a + b}$.`,
        brezinys: daiktuEile(
          [
            { daiktas: d, kiek: a },
            { daiktas: d, kiek: b },
          ],
          34,
        ),
      })
    },

    // 2. Dvi lėkštės — skaičiai pasakyti sąlygoje, piešinys tik patvirtina
    () => {
      const a = atsitiktinis(1, maks - 1)
      const b = atsitiktinis(1, maks - a)
      return uzdavinys('kiek-is-viso', {
        // Ne „lėkštėje“: pieštukai ar kubeliai lėkštėje pirmokui atrodo keista,
        // o daiktas kiekvienam uždaviniui parenkamas atsitiktinai.
        klausimas: `Vienoje dėžutėje ${suSkaiciumi(a, { vns: z.v, dgs: z.dgs, kilm: z.dgsK })}, kitoje — ${b}. Kiek ${z.dgsK} iš viso?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$.`,
        brezinys: daiktuEile(
          [
            { daiktas: d, kiek: a },
            { daiktas: d, kiek: b },
          ],
          32,
        ),
      })
    },

    // 3. Trys grupės
    () => {
      const a = atsitiktinis(1, Math.max(1, maks - 2))
      const b = atsitiktinis(1, Math.max(1, maks - a - 1))
      const c = maks - a - b >= 1 ? atsitiktinis(1, maks - a - b) : 0
      if (c < 1) return null
      return uzdavinys('kiek-is-viso', {
        klausimas: `Piešinyje trys grupės. Kiek ${z.dgsK} iš viso?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$, tada $${a + b} + ${c} = ${a + b + c}$.`,
        brezinys: daiktuEile(
          [
            { daiktas: d, kiek: a },
            { daiktas: d, kiek: b },
            { daiktas: d, kiek: c },
          ],
          28,
        ),
      })
    },

    // 4. Buvo ir atsirado dar — pirmoji pažintis su sudėtimi kaip pokyčiu
    () => {
      const a = atsitiktinis(1, maks - 1)
      const b = atsitiktinis(1, maks - a)
      return uzdavinys('kiek-is-viso', {
        klausimas: `Ant šakos tupėjo ${suSkaiciumi(a, { vns: 'paukštis', dgs: 'paukščiai', kilm: 'paukščių' })}. Atskrido dar ${b}. Kiek paukščių dabar?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Atskridus paukščiams jų padaugėjo: $${a} + ${b} = ${a + b}$.`,
        brezinys: daiktuEile(
          [
            { daiktas: 'paukstis', kiek: a },
            { daiktas: 'paukstis', kiek: b },
          ],
          34,
        ),
      })
    },

    // 5. Pasirinkimas iš piešinio
    () => {
      const a = atsitiktinis(1, maks - 1)
      const b = atsitiktinis(1, maks - a)
      const suma = a + b
      // Netiesa privalo tilpti į temos sritį: pirmokui, kurio tema yra
      // „nuo 0 iki 9“, variantas 10 iškrenta jau iš pirmo žvilgsnio.
      const netiesos = [suma - 1, suma + 1, a].filter(
        (x) => x > 0 && x !== suma && x <= maks,
      )
      const trys = [...new Set(netiesos)].slice(0, 2)
      if (trys.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('kiek-is-viso'), 'kiek-is-viso', {
        klausimas: `Kiek iš viso ${z.dgsK}?`,
        variantai: [String(suma), ...trys.map(String)],
        teisingas: 0,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
        brezinys: daiktuEile(
          [
            { daiktas: d, kiek: a },
            { daiktas: d, kiek: b },
          ],
          34,
        ),
      })
    },
  ])
}

// ── 2.2 Kaip sudėti du skaičius? ────────────────────────────────────────────

const A_SUDETIS_9 = [
  {
    klausimas: 'Apskaičiuok: $4 + 3$',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: '$4 + 3 = 7$.',
  },
] as const

export const sudetisIki9: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkSudeti9(lygis, sritis), A_SUDETIS_9, 'sudetis-iki-9')

function kurkSudeti9(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba2(lygis, sritis)

  return variacija([
    // 1. Grynoji sudėtis
    () => {
      const a = atsitiktinis(1, maks - 1)
      const b = atsitiktinis(1, maks - a)
      return uzdavinys('sudetis-iki-9', {
        klausimas: `Apskaičiuok: $${a} + ${b}$`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$.`,
      })
    },

    // 2. Sudėtis su nuliu — atskiras pavidalas, nes taisyklė čia kita
    () => {
      const a = atsitiktinis(1, maks)
      const nulisPirmas = atsitiktinis(0, 1) === 1
      return uzdavinys('sudetis-iki-9', {
        klausimas: `Įrašyk atsakymą: $${nulisPirmas ? `0 + ${a}` : `${a} + 0`}$`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Pridėjus 0, skaičius nepasikeičia: liko ${a}.`,
      })
    },

    // 3. Pasirinkimas — netiesos yra tipinės klaidos, o ne atsitiktiniai skaičiai
    () => {
      const a = atsitiktinis(1, maks - 1)
      const b = atsitiktinis(1, maks - a)
      const suma = a + b
      const netiesos = [...new Set([suma - 1, suma + 1, Math.abs(a - b)])].filter(
        (x) => x > 0 && x !== suma && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('sudetis-iki-9'), 'sudetis-iki-9', {
        klausimas: `Pasirink teisingą atsakymą: $${a} + ${b}$`,
        variantai: [String(suma), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      })
    },

    // 4. Sudėtis žodžiais — mokinys pats užrašo veiksmą
    () => {
      const a = atsitiktinis(1, maks - 1)
      const b = atsitiktinis(1, maks - a)
      return uzdavinys('sudetis-iki-9', {
        klausimas: `Sudėk skaičius ${a} ir ${b}.`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$.`,
      })
    },

    // 5. Sudėtis iš piešinio — daiktai skaičiuojami, ne prisimenami
    () => {
      const d = pasirink(SKAICIUOJAMI)
      const a = atsitiktinis(1, maks - 1)
      const b = atsitiktinis(1, maks - a)
      return uzdavinys('sudetis-iki-9', {
        klausimas: `Užbaik: $${a} + ${b} = \\square$`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Suskaičiavus visus daiktus gaunama ${a + b}.`,
        brezinys: daiktuEile(
          [
            { daiktas: d, kiek: a },
            { daiktas: d, kiek: b },
          ],
          32,
        ),
      })
    },
  ])
}

// ── 2.3 Kas yra dėmuo ir suma? ──────────────────────────────────────────────

const A_DEMUO = [
  {
    klausimas: 'Veiksme $3 + 5 = 8$ kuris skaičius yra suma?',
    atsakymas: '8',
    atsakymasRodymui: '$8$',
    sprendimas: 'Suma yra sudėties rezultatas — skaičius po lygybės ženklo.',
  },
] as const

export const demuoSuma: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkDemuo(lygis, sritis), A_DEMUO, 'demuo-suma')

function kurkDemuo(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba2(lygis, sritis)
  const a = atsitiktinis(1, maks - 1)
  const b = atsitiktinis(1, maks - a)
  const s = a + b
  if (a === b || a === s || b === s) return null
  const veiksmas = `$${a} + ${b} = ${s}$`

  return variacija([
    // 1. Kuris skaičius yra suma
    () =>
      uzdavinys('demuo-suma', {
        klausimas: `Veiksme ${veiksmas} kuris skaičius yra suma?`,
        atsakymas: String(s),
        atsakymasRodymui: `$${s}$`,
        sprendimas: `Suma yra sudėties rezultatas — jis rašomas po lygybės ženklo, tad suma yra ${s}.`,
      }),

    // 2. Pirmasis dėmuo
    () =>
      uzdavinys('demuo-suma', {
        klausimas: `Veiksme ${veiksmas} kuris skaičius yra pirmasis dėmuo?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Dėmenys yra sudedamieji skaičiai. Pirmasis iš jų — ${a}.`,
      }),

    // 3. Antrasis dėmuo
    () =>
      uzdavinys('demuo-suma', {
        klausimas: `Veiksme ${veiksmas} kuris skaičius yra antrasis dėmuo?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Dėmenys yra sudedamieji skaičiai. Antrasis iš jų — ${b}.`,
      }),

    // 4. Teiginys — tikrinama pati sąvoka, ne skaičiavimas
    () =>
      pasirinkimoUzdavinys(naujasId('demuo-suma'), 'demuo-suma', {
        klausimas: `Pateikta ${veiksmas}. Pasirink teisingą teiginį.`,
        variantai: [`${s} yra suma`, `${s} yra dėmuo`, `${a} yra suma`],
        teisingas: 0,
        sprendimas: `${a} ir ${b} yra dėmenys, o ${s} — jų suma.`,
      }),

    // 5. Abu dėmenys iš karto
    () =>
      pasirinkimoUzdavinys(naujasId('demuo-suma'), 'demuo-suma', {
        klausimas: `Pažymėk abu veiksmo ${veiksmas} dėmenis.`,
        variantai: [`${a} ir ${b}`, `${a} ir ${s}`, `${b} ir ${s}`],
        teisingas: 0,
        sprendimas: `Dėmenys stovi prieš lygybės ženklą: ${a} ir ${b}.`,
      }),
  ])
}

// ── 2.4 Kaip sudėti tris dėmenis? ───────────────────────────────────────────

const A_TRYS = [
  {
    klausimas: 'Apskaičiuok: $2 + 3 + 1$',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: '$2 + 3 = 5$, tada $5 + 1 = 6$.',
  },
] as const

export const trysDemenys: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkTrisDemenis(lygis, sritis), A_TRYS, 'trys-demenys')

/** Trys nenuliniai dėmenys, kurių suma neperžengia ribos. */
function trysDalys(maks: number): [number, number, number] | null {
  if (maks < 3) return null
  const a = atsitiktinis(1, maks - 2)
  const b = atsitiktinis(1, maks - a - 1)
  const c = atsitiktinis(1, maks - a - b)
  return [a, b, c]
}

function kurkTrisDemenis(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba2(lygis, sritis)
  const dalys = trysDalys(maks)
  if (!dalys) return null
  const [a, b, c] = dalys
  const suma = a + b + c

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('trys-demenys', {
        klausimas: `Apskaičiuok: $${a} + ${b} + ${c}$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Sudedame iš eilės: $${a} + ${b} = ${a + b}$, tada $${a + b} + ${c} = ${suma}$.`,
      }),

    // 2. Užbaigimas — tas pats veiksmas, bet mokinys mato langelį
    () =>
      uzdavinys('trys-demenys', {
        klausimas: `Užbaik: $${a} + ${b} + ${c} = \\square$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$, tada $${a + b} + ${c} = ${suma}$.`,
      }),

    // 3. Trys grupės piešinyje
    () => {
      const d = pasirink(SKAICIUOJAMI)
      const z = zodis(d)
      return uzdavinys('trys-demenys', {
        klausimas: `Piešinyje trys grupės. Kiek ${z.dgsK} iš viso?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${b} + ${c} = ${suma}$.`,
        brezinys: daiktuEile(
          [
            { daiktas: d, kiek: a },
            { daiktas: d, kiek: b },
            { daiktas: d, kiek: c },
          ],
          28,
        ),
      })
    },

    // 4. Pasirinkimas
    () => {
      const netiesos = [...new Set([suma - 1, suma + 1, a + b])].filter(
        (x) => x > 0 && x !== suma && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('trys-demenys'), 'trys-demenys', {
        klausimas: `Pasirink teisingą atsakymą: $${a} + ${b} + ${c}$`,
        variantai: [String(suma), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} + ${b} = ${a + b}$, tada $${a + b} + ${c} = ${suma}$.`,
      })
    },

    // 5. Tarpinis rezultatas — kad matytųsi, jog sudedama po du
    () =>
      uzdavinys('trys-demenys', {
        klausimas: `Kiek gausi sudėjęs pirmus du dėmenis? $${a} + ${b} + ${c}$`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Pirmi du dėmenys yra ${a} ir ${b}: $${a} + ${b} = ${a + b}$.`,
      }),
  ])
}

// ── 2.5 Kaip spręsti sudėties uždavinius? ───────────────────────────────────

/**
 * Sudėties istorijos.
 *
 * `formos` yra to linksnio, kurio reikalauja sakinio veiksmažodis: „turėjo 3
 * lipdukus“ (galininkas), bet „tupėjo 3 paukščiai“ (vardininkas). Todėl
 * linksnis įrašomas kartu su istorija, o ne imamas iš bendro žodyno.
 */
const SUDETIES_ISTORIJOS = [
  {
    formos: { vns: 'lipduką', dgs: 'lipdukus', kilm: 'lipdukų' },
    pradzia: (v: string, n: number) => `${v} turėjo ${n}`,
    pokytis: (n: number) => `Draugė davė dar ${n}.`,
    klausimas: (v: string) => `Kiek lipdukų ${v} turi dabar?`,
  },
  {
    formos: { vns: 'paukštis', dgs: 'paukščiai', kilm: 'paukščių' },
    pradzia: (_v: string, n: number) => `Ant šakos tupėjo ${n}`,
    pokytis: (n: number) => `Atskrido dar ${n}.`,
    klausimas: () => 'Kiek paukščių dabar tupi ant šakos?',
  },
  {
    formos: { vns: 'pieštuką', dgs: 'pieštukus', kilm: 'pieštukų' },
    pradzia: (v: string, n: number) => `${v} įdėjo į dėžę ${n}`,
    pokytis: (n: number) => `Paskui įdėjo dar ${n}.`,
    klausimas: () => 'Kiek pieštukų dėžėje?',
  },
  {
    formos: { vns: 'obuolys', dgs: 'obuoliai', kilm: 'obuolių' },
    pradzia: (_v: string, n: number) => `Krepšelyje buvo ${n}`,
    pokytis: (n: number) => `Mama įdėjo dar ${n}.`,
    klausimas: () => 'Kiek obuolių dabar krepšelyje?',
  },
  {
    formos: { vns: 'sausainį', dgs: 'sausainius', kilm: 'sausainių' },
    pradzia: (v: string, n: number) => `${v} išsikepė ${n}`,
    pokytis: (n: number) => `Sesuo atnešė dar ${n}.`,
    klausimas: () => 'Kiek sausainių yra iš viso?',
  },
] as const

const A_SUD_UZD = [
  {
    klausimas: 'Ugnė turėjo 3 lipdukus. Draugė davė dar 4. Kiek lipdukų Ugnė turi dabar?',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: '„Dar“ reiškia sudėtį: $3 + 4 = 7$.',
  },
] as const

export const sudetiesUzdaviniai: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkSudetiesUzdavini(lygis, sritis), A_SUD_UZD, 'sudeties-uzdaviniai')

function kurkSudetiesUzdavini(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba2(lygis, sritis)
  const a = atsitiktinis(1, maks - 1)
  const b = atsitiktinis(1, maks - a)
  const vardas = pasirink(VARDAI)

  // Kiekviena istorija yra atskiras šablonas: sakinys skiriasi ne skaičiais, o
  // veiksmu, todėl rinkinys neatrodo kaip vienas uždavinys, perrašytas dešimt
  // kartų.
  return variacija(
    SUDETIES_ISTORIJOS.map((istorija) => () =>
      uzdavinys('sudeties-uzdaviniai', {
        klausimas: `${istorija.pradzia(vardas, a)} ${derink(a, istorija.formos)}. ${istorija.pokytis(b)} ${istorija.klausimas(vardas)}`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `„Dar“ reiškia, kad daiktų padaugėjo: $${a} + ${b} = ${a + b}$.`,
      }),
    ),
  )
}

// ── 2.6 Kiek liko? ──────────────────────────────────────────────────────────

const A_LIKO = [
  {
    klausimas: 'Buvo 7 obuoliai, 2 nubraukti. Kiek obuolių liko?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Nubraukti daiktai atimami: $7 - 2 = 5$.',
  },
] as const

export const kiekLiko: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkLiko(lygis, sritis), A_LIKO, 'kiek-liko')

function kurkLiko(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba2(lygis, sritis)
  if (maks < 3) return null
  const buvo = atsitiktinis(3, maks)
  const dingo = atsitiktinis(1, buvo - 1)
  const liko = buvo - dingo
  const d = pasirink(SKAICIUOJAMI)
  const z = zodis(d)
  const formos = { vns: z.v, dgs: z.dgs, kilm: z.dgsK }
  // Dalyvis derinamas su daikto gimine ir skaičiumi: „4 nubrauktos žvaigždės“,
  // bet „1 nubrauktas obuolys“.
  const nubraukta = derink(
    dingo,
    z.gimine === 'v'
      ? { vns: 'nubrauktas', dgs: 'nubraukti', kilm: 'nubrauktų' }
      : { vns: 'nubraukta', dgs: 'nubrauktos', kilm: 'nubrauktų' },
  )
  const piesinys = (dydis = 32) =>
    daiktuEile([{ daiktas: d, kiek: buvo, nubraukta: dingo }], dydis)

  return variacija([
    // 1. Nubraukti daiktai piešinyje
    () =>
      uzdavinys('kiek-liko', {
        klausimas: `Piešinyje buvo ${suSkaiciumi(buvo, formos)}, ${dingo} ${nubraukta}. Kiek ${z.dgsK} liko?`,
        atsakymas: String(liko),
        atsakymasRodymui: `$${liko}$`,
        sprendimas: `Nubraukti daiktai atimami: $${buvo} - ${dingo} = ${liko}$.`,
        brezinys: piesinys(),
      }),

    // 2. Balionai sprogo
    () =>
      uzdavinys('kiek-liko', {
        klausimas: `Buvo ${suSkaiciumi(buvo, { vns: 'balionas', dgs: 'balionai', kilm: 'balionų' })}. ${dingo} sprogo. Kiek balionų liko?`,
        atsakymas: String(liko),
        atsakymasRodymui: `$${liko}$`,
        sprendimas: `$${buvo} - ${dingo} = ${liko}$.`,
        brezinys: daiktuEile([{ daiktas: 'balionas', kiek: buvo, nubraukta: dingo }], 32),
      }),

    // 3. Suvalgyti sausainiai
    () =>
      uzdavinys('kiek-liko', {
        klausimas: `Ant stalo buvo ${suSkaiciumi(buvo, { vns: 'sausainis', dgs: 'sausainiai', kilm: 'sausainių' })}. ${pasirink(VARDAI)} suvalgė ${dingo}. Kiek sausainių liko?`,
        atsakymas: String(liko),
        atsakymasRodymui: `$${liko}$`,
        sprendimas: `Suvalgyti sausainiai atimami: $${buvo} - ${dingo} = ${liko}$.`,
        brezinys: daiktuEile([{ daiktas: 'sausainis', kiek: buvo, nubraukta: dingo }], 32),
      }),

    // 4. Išimti kubeliai
    () =>
      uzdavinys('kiek-liko', {
        klausimas: `Dėžėje buvo ${suSkaiciumi(buvo, { vns: 'kubelis', dgs: 'kubeliai', kilm: 'kubelių' })}. ${pasirink(VARDAI)} išėmė ${dingo}. Kiek kubelių liko?`,
        atsakymas: String(liko),
        atsakymasRodymui: `$${liko}$`,
        sprendimas: `$${buvo} - ${dingo} = ${liko}$.`,
        brezinys: daiktuEile([{ daiktas: 'kubelis', kiek: buvo, nubraukta: dingo }], 32),
      }),

    // 5. Pasirinkimas iš piešinio
    () => {
      const netiesos = [...new Set([liko + 1, liko - 1, dingo])].filter(
        (x) => x > 0 && x !== liko && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('kiek-liko'), 'kiek-liko', {
        klausimas: `Nubraukti daiktai išimti. Kiek ${z.dgsK} liko?`,
        variantai: [String(liko), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${buvo} - ${dingo} = ${liko}$.`,
        brezinys: piesinys(),
      })
    },
  ])
}

// ── 2.7 Kaip atimti skaičių? ────────────────────────────────────────────────

const A_ATIMTIS_9 = [
  {
    klausimas: 'Apskaičiuok: $8 - 3$',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: '$8 - 3 = 5$.',
  },
] as const

export const atimtisIki9: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkAtimti9(lygis, sritis), A_ATIMTIS_9, 'atimtis-iki-9')

function kurkAtimti9(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba2(lygis, sritis)
  if (maks < 3) return null

  return variacija([
    // 1. Grynoji atimtis
    () => {
      const a = atsitiktinis(2, maks)
      const b = atsitiktinis(1, a - 1)
      return uzdavinys('atimtis-iki-9', {
        klausimas: `Apskaičiuok: $${a} - ${b}$`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$`,
        sprendimas: `$${a} - ${b} = ${a - b}$.`,
      })
    },

    // 2. Atimtis su nuliu
    () => {
      const a = atsitiktinis(1, maks)
      return uzdavinys('atimtis-iki-9', {
        klausimas: `Įrašyk atsakymą: $${a} - 0$`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Atėmus 0, skaičius nepasikeičia: liko ${a}.`,
      })
    },

    // 3. Atimamas visas skaičius — rezultatas 0
    () => {
      const a = atsitiktinis(1, maks)
      return uzdavinys('atimtis-iki-9', {
        klausimas: `Kiek liks, kai iš ${a} atimsi ${a}?`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: `Atėmus visą skaičių nelieka nieko: $${a} - ${a} = 0$.`,
      })
    },

    // 4. Pasirinkimas
    () => {
      const a = atsitiktinis(2, maks)
      const b = atsitiktinis(1, a - 1)
      const sk = a - b
      const netiesos = [...new Set([sk + 1, sk - 1, a + b])].filter(
        (x) => x > 0 && x !== sk && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('atimtis-iki-9'), 'atimtis-iki-9', {
        klausimas: `Pasirink teisingą atsakymą: $${a} - ${b}$`,
        variantai: [String(sk), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      })
    },

    // 5. Atimtis žodžiais
    () => {
      const a = atsitiktinis(2, maks)
      const b = atsitiktinis(1, a - 1)
      return uzdavinys('atimtis-iki-9', {
        klausimas: `Iš skaičiaus ${a} atimk ${b}.`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$`,
        sprendimas: `$${a} - ${b} = ${a - b}$.`,
      })
    },
  ])
}

// ── 2.8 Kas yra turinys, atėminys ir skirtumas? ─────────────────────────────

const A_TURINYS = [
  {
    klausimas: 'Veiksme $8 - 3 = 5$ kuris skaičius yra atėminys?',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Atėminys yra tas skaičius, kurį atimame — jis stovi po minuso ženklo.',
  },
] as const

export const turinysAteminys: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkTurini(lygis, sritis), A_TURINYS, 'turinys-ateminys')

function kurkTurini(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba2(lygis, sritis)
  if (maks < 4) return null
  const a = atsitiktinis(3, maks)
  const b = atsitiktinis(1, a - 1)
  const sk = a - b
  // Trys skirtingi skaičiai: jei du sutampa, klausimas „kuris yra atėminys“
  // turi du teisingus atsakymus.
  if (b === sk || a === b || a === sk) return null
  const veiksmas = `$${a} - ${b} = ${sk}$`

  return variacija([
    // 1. Turinys
    () =>
      uzdavinys('turinys-ateminys', {
        klausimas: `Veiksme ${veiksmas} kuris skaičius yra turinys?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Turinys yra tas skaičius, iš kurio atimame — ${a}.`,
      }),

    // 2. Atėminys
    () =>
      uzdavinys('turinys-ateminys', {
        klausimas: `Veiksme ${veiksmas} kuris skaičius yra atėminys?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Atėminys yra tas skaičius, kurį atimame — ${b}.`,
      }),

    // 3. Skirtumas
    () =>
      uzdavinys('turinys-ateminys', {
        klausimas: `Veiksme ${veiksmas} kuris skaičius yra skirtumas?`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Skirtumas yra atimties rezultatas — jis rašomas po lygybės ženklo, tad ${sk}.`,
      }),

    // 4. Teiginys
    () =>
      pasirinkimoUzdavinys(naujasId('turinys-ateminys'), 'turinys-ateminys', {
        klausimas: `Pateikta ${veiksmas}. Pasirink teisingą teiginį.`,
        variantai: [`${sk} yra skirtumas`, `${sk} yra turinys`, `${a} yra atėminys`],
        teisingas: 0,
        sprendimas: `${a} yra turinys, ${b} — atėminys, o ${sk} — skirtumas.`,
      }),

    // 5. Vardo parinkimas skaičiui
    () =>
      pasirinkimoUzdavinys(naujasId('turinys-ateminys'), 'turinys-ateminys', {
        klausimas: `Veiksme ${veiksmas} kaip vadinamas skaičius ${a}?`,
        variantai: ['turinys', 'atėminys', 'skirtumas'],
        teisingas: 0,
        sprendimas: `Iš ${a} atimame, tad ${a} yra turinys.`,
      }),
  ])
}

// ── 2.9 Kaip spręsti atimties uždavinius? ───────────────────────────────────

/**
 * Atimties istorijos — sandara tokia pat kaip sudėties, tik pokytis mažina.
 *
 * Sakinyje pirmas eina veikėjas, o ne skaičius: „Matas paėmė 4“, ne „4 paėmė
 * Matas“. Antroji tvarka lietuviškai taisyklinga, bet pirmokas ją perskaito
 * kaip „keturi paėmė“ ir uždavinį supranta atvirkščiai.
 */
const ATIMTIES_ISTORIJOS = [
  {
    formos: { vns: 'pieštukas', dgs: 'pieštukai', kilm: 'pieštukų' },
    pradzia: (n: number) => `Dėžėje buvo ${n}`,
    pokytis: (v: string, n: number) => `${v} paėmė ${n}.`,
    klausimas: 'Kiek pieštukų liko?',
  },
  {
    formos: { vns: 'sausainis', dgs: 'sausainiai', kilm: 'sausainių' },
    pradzia: (n: number) => `Ant stalo buvo ${n}`,
    pokytis: (v: string, n: number) => `${v} suvalgė ${n}.`,
    klausimas: 'Kiek sausainių liko?',
  },
  {
    formos: { vns: 'vaikas', dgs: 'vaikai', kilm: 'vaikų' },
    pradzia: (n: number) => `Kieme žaidė ${n}`,
    pokytis: (_v: string, n: number) => `Namo išėjo ${n}.`,
    klausimas: 'Kiek vaikų liko?',
  },
  {
    formos: { vns: 'knyga', dgs: 'knygos', kilm: 'knygų' },
    pradzia: (n: number) => `Lentynoje buvo ${n}`,
    pokytis: (v: string, n: number) => `${v} pasiėmė ${n}.`,
    klausimas: 'Kiek knygų liko lentynoje?',
  },
  {
    formos: { vns: 'obuolys', dgs: 'obuoliai', kilm: 'obuolių' },
    pradzia: (n: number) => `Krepšelyje buvo ${n}`,
    pokytis: (_v: string, n: number) => `Draugams išdalijo ${n}.`,
    klausimas: 'Kiek obuolių liko krepšelyje?',
  },
] as const

const A_ATIM_UZD = [
  {
    klausimas: 'Dėžėje buvo 9 pieštukai. 4 paėmė Matas. Kiek pieštukų liko?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: '„Paėmė“ reiškia atimtį: $9 - 4 = 5$.',
  },
] as const

export const atimtiesUzdaviniai: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkAtimtiesUzdavini(lygis, sritis), A_ATIM_UZD, 'atimties-uzdaviniai')

function kurkAtimtiesUzdavini(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba2(lygis, sritis)
  if (maks < 3) return null
  const buvo = atsitiktinis(3, maks)
  const dingo = atsitiktinis(1, buvo - 1)
  const vardas = pasirink(VARDAI)

  return variacija(
    ATIMTIES_ISTORIJOS.map((istorija) => () =>
      uzdavinys('atimties-uzdaviniai', {
        klausimas: `${istorija.pradzia(buvo)} ${derink(buvo, istorija.formos)}. ${istorija.pokytis(vardas, dingo)} ${istorija.klausimas}`,
        atsakymas: String(buvo - dingo),
        atsakymasRodymui: `$${buvo - dingo}$`,
        sprendimas: `Daiktų sumažėjo, tad atimame: $${buvo} - ${dingo} = ${buvo - dingo}$.`,
      }),
    ),
  )
}

// ── 2.10 Koks sudėties ir atimties veiksmų ryšys? ───────────────────────────

const A_RYSYS = [
  {
    klausimas: 'Jeigu $3 + 5 = 8$, tai $8 - 3 = \\square$. Koks skaičius vietoj langelio?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Iš sumos atėmus vieną dėmenį lieka kitas dėmuo.',
  },
] as const

export const veiksmuRysys: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkRysi(lygis, sritis), A_RYSYS, 'veiksmu-rysys')

function kurkRysi(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba2(lygis, sritis)
  if (maks < 3) return null
  const a = atsitiktinis(1, maks - 1)
  const b = atsitiktinis(1, maks - a)
  const s = a + b
  if (a === b) return null

  return variacija([
    // 1. Iš sumos atimame pirmąjį dėmenį
    () =>
      uzdavinys('veiksmu-rysys', {
        klausimas: `Jeigu $${a} + ${b} = ${s}$, tai $${s} - ${a} = \\square$. Koks skaičius vietoj langelio?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Iš sumos atėmus vieną dėmenį lieka kitas: $${s} - ${a} = ${b}$.`,
      }),

    // 2. Skaičių šeima — keturi veiksmai iš tų pačių trijų skaičių
    () =>
      uzdavinys('veiksmu-rysys', {
        klausimas: `Užbaik skaičių šeimą: $${a} + ${b} = ${s}$, $${b} + ${a} = ${s}$, $${s} - ${a} = ${b}$, $${s} - ${b} = \\square$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Visi keturi veiksmai sudaryti iš tų pačių skaičių ${a}, ${b} ir ${s}, tad $${s} - ${b} = ${a}$.`,
      }),

    // 3. Kuris atimties veiksmas tinka sudėčiai
    () => {
      const netiesa = s - a === b ? `${s} - ${b} = ${a + 1}` : `${s} - ${b} = ${a}`
      return pasirinkimoUzdavinys(naujasId('veiksmu-rysys'), 'veiksmu-rysys', {
        klausimas: `Jeigu $${a} + ${b} = ${s}$, kuris atimties veiksmas teisingas?`,
        variantai: [`${s} - ${a} = ${b}`, netiesa, `${s} + ${a} = ${b}`],
        teisingas: 0,
        sprendimas: `Iš sumos ${s} atėmus dėmenį ${a} lieka antrasis dėmuo ${b}.`,
      })
    },

    // 4. Atvirkščia kryptis: iš atimties į sudėtį
    () =>
      uzdavinys('veiksmu-rysys', {
        klausimas: `Jeigu $${s} - ${a} = ${b}$, tai $${b} + ${a} = \\square$. Koks skaičius vietoj langelio?`,
        atsakymas: String(s),
        atsakymasRodymui: `$${s}$`,
        sprendimas: `Pridėjus atėminį prie skirtumo grįžtame į turinį: $${b} + ${a} = ${s}$.`,
      }),

    // 5. Tas pats klausimas žodžiais
    () =>
      uzdavinys('veiksmu-rysys', {
        klausimas: `Pateikta $${a} + ${b} = ${s}$. Kiek liktų iš ${s} atėmus ${b}?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Atėmus dėmenį ${b} lieka kitas dėmuo: $${s} - ${b} = ${a}$.`,
      }),
  ])
}

// ── 2.11 Kokio skaičiaus trūksta? ───────────────────────────────────────────

const A_TRUKSTA = [
  {
    klausimas: 'Įrašyk: $4 + \\square = 7$',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Iš sumos atimame žinomą dėmenį: $7 - 4 = 3$.',
  },
] as const

export const trukstamasSkaicius: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkTrukstama(lygis, sritis), A_TRUKSTA, 'trukstamas-skaicius')

function kurkTrukstama(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba2(lygis, sritis)
  if (maks < 3) return null
  const a = atsitiktinis(1, maks - 1)
  const b = atsitiktinis(1, maks - a)
  const s = a + b

  return variacija([
    // 1. Trūksta antrojo dėmens
    () =>
      uzdavinys('trukstamas-skaicius', {
        klausimas: `Įrašyk: $${a} + \\square = ${s}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Iš sumos atimame žinomą dėmenį: $${s} - ${a} = ${b}$.`,
      }),

    // 2. Trūksta pirmojo dėmens
    () =>
      uzdavinys('trukstamas-skaicius', {
        klausimas: `Įrašyk: $\\square + ${b} = ${s}$`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Iš sumos atimame žinomą dėmenį: $${s} - ${b} = ${a}$.`,
      }),

    // 3. Trūksta atėminio
    () =>
      uzdavinys('trukstamas-skaicius', {
        klausimas: `Įrašyk: $${s} - \\square = ${a}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Iš turinio atimame skirtumą: $${s} - ${a} = ${b}$.`,
      }),

    // 4. Trūksta turinio
    () =>
      uzdavinys('trukstamas-skaicius', {
        klausimas: `Įrašyk: $\\square - ${b} = ${a}$`,
        atsakymas: String(s),
        atsakymasRodymui: `$${s}$`,
        sprendimas: `Prie skirtumo pridedame atėminį: $${a} + ${b} = ${s}$.`,
      }),

    // 5. Kiek trūksta iki skaičiaus — tas pats klausimas žodžiais
    () =>
      uzdavinys('trukstamas-skaicius', {
        klausimas: `Kiek trūksta skaičiui ${a} iki ${s}?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${s} - ${a} = ${b}$.`,
      }),
  ])
}

// ═══ 3 tema. Dviženkliai skaičiai iki 20 ════════════════════════════════════

/** Temos viršutinė riba. */
function riba3(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 20, 20)
}

// ── 3.1 Kaip sudaryti skaičių 10? ───────────────────────────────────────────

const A_DESIMT = [
  {
    klausimas: 'Kiek trūksta iki 10? $7 + \\square = 10$',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: '$10 - 7 = 3$.',
  },
] as const

export const skaicius10: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkDesimt(lygis, sritis), A_DESIMT, 'skaicius-10')

function kurkDesimt(_lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  if (riba3(sritis) < 10) return null
  const a = atsitiktinis(1, 9)
  const b = 10 - a

  return variacija([
    // 1. Kiek trūksta iki 10
    () =>
      uzdavinys('skaicius-10', {
        klausimas: `Kiek trūksta iki 10? $${a} + \\square = 10$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$10 - ${a} = ${b}$.`,
      }),

    // 2. Dešimt išskaidyta į du dėmenis
    () =>
      uzdavinys('skaicius-10', {
        klausimas: `Užbaik: $10 = ${a} + \\square$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `${a} ir ${b} kartu sudaro 10.`,
      }),

    // 3. Iš piešinio — kiek kubelių pridėti
    () => {
      // Piešinyje turi būti ką skaičiuoti: su vienu kubeliu uždavinys virsta
      // klausimu atmintinai, o piešinys tampa nereikalingas.
      const kiek = atsitiktinis(4, 9)
      const z = zodis('kubelis')
      return uzdavinys('skaicius-10', {
        klausimas: `Piešinyje ${suSkaiciumi(kiek, { vns: z.v, dgs: z.dgs, kilm: z.dgsK })}. Kiek reikia pridėti, kad jų būtų 10?`,
        atsakymas: String(10 - kiek),
        atsakymasRodymui: `$${10 - kiek}$`,
        sprendimas: `Iki 10 trūksta $10 - ${kiek} = ${10 - kiek}$.`,
        brezinys: daiktuEile([{ daiktas: 'kubelis', kiek }], 30),
      })
    },

    // 4. Pora, kurios suma lygi 10
    () => {
      const kita = atsitiktinis(1, 9)
      const trecia = atsitiktinis(1, 9)
      // Netiesos privalo NEsudaryti dešimties — kitaip teisingi būtų du atsakymai.
      if (kita + trecia === 10 || kita === a) return null
      const netiesa1 = `${kita} ir ${kita + 1 <= 9 ? kita + 1 : kita - 1}`
      const netiesa2 = `${trecia} ir ${trecia + 2 <= 9 ? trecia + 2 : trecia - 2}`
      const suma1 = kita + (kita + 1 <= 9 ? kita + 1 : kita - 1)
      const suma2 = trecia + (trecia + 2 <= 9 ? trecia + 2 : trecia - 2)
      if (suma1 === 10 || suma2 === 10 || netiesa1 === netiesa2) return null
      return pasirinkimoUzdavinys(naujasId('skaicius-10'), 'skaicius-10', {
        klausimas: 'Pasirink porą, kurios suma lygi 10.',
        variantai: [`${a} ir ${b}`, netiesa1, netiesa2],
        teisingas: 0,
        sprendimas: `$${a} + ${b} = 10$.`,
      })
    },

    // 5. Skaičiaus pora atmintinai
    () =>
      uzdavinys('skaicius-10', {
        klausimas: `Su kuriuo skaičiumi ${a} sudaro 10?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${a} + ${b} = 10$.`,
      }),
  ])
}

// ── 3.2 Kaip skaičiuoti iki 20? ─────────────────────────────────────────────

const A_SKAICIAVIMAS = [
  {
    klausimas: 'Įrašyk trūkstamą skaičių: 12, 13, $\\square$, 15, 16.',
    atsakymas: '14',
    atsakymasRodymui: '$14$',
    sprendimas: 'Skaičiuojant pirmyn kiekvienas kitas skaičius vienetu didesnis.',
  },
] as const

export const skaiciavimasIki20: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkSkaiciavima(lygis, sritis), A_SKAICIAVIMAS, 'skaiciavimas-iki-20')

function kurkSkaiciavima(_lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba3(sritis)
  if (maks < 12) return null

  return variacija([
    // 1. Seka pirmyn, trūksta vidurinio
    () => {
      const pradzia = atsitiktinis(1, maks - 4)
      const trukstamas = pradzia + 2
      return uzdavinys('skaiciavimas-iki-20', {
        klausimas: `Įrašyk trūkstamą skaičių: ${pradzia}, ${pradzia + 1}, $\\square$, ${pradzia + 3}, ${pradzia + 4}.`,
        atsakymas: String(trukstamas),
        atsakymasRodymui: `$${trukstamas}$`,
        sprendimas: `Skaičiuojant pirmyn kiekvienas kitas skaičius vienetu didesnis, tad trūksta ${trukstamas}.`,
        brezinys: langeliuEile([
          pradzia,
          pradzia + 1,
          null,
          pradzia + 3,
          pradzia + 4,
        ]),
      })
    },

    // 2. Seka atgal
    () => {
      const pradzia = atsitiktinis(5, maks)
      const trukstamas = pradzia - 2
      if (trukstamas < 0 || pradzia - 4 < 0) return null
      return uzdavinys('skaiciavimas-iki-20', {
        klausimas: `Skaičiuok atgal. Įrašyk trūkstamą skaičių: ${pradzia}, ${pradzia - 1}, $\\square$, ${pradzia - 3}, ${pradzia - 4}.`,
        atsakymas: String(trukstamas),
        atsakymasRodymui: `$${trukstamas}$`,
        sprendimas: `Skaičiuojant atgal kiekvienas kitas skaičius vienetu mažesnis, tad trūksta ${trukstamas}.`,
        brezinys: langeliuEile([
          pradzia,
          pradzia - 1,
          null,
          pradzia - 3,
          pradzia - 4,
        ]),
      })
    },

    // 3. Kuris eina po — pasirinkimas
    () => {
      const n = atsitiktinis(1, maks - 1)
      const netiesos = [n - 1, n + 2].filter((x) => x >= 0 && x <= maks && x !== n + 1)
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('skaiciavimas-iki-20'), 'skaiciavimas-iki-20', {
        klausimas: `Kuris skaičius eina po ${n}?`,
        variantai: [String(n + 1), ...netiesos.map(String)],
        teisingas: 0,
        sprendimas: `Po ${n} skaičiuojame ${n + 1}.`,
      })
    },

    // 4. Kuris eina prieš — pasirinkimas
    () => {
      const n = atsitiktinis(2, maks)
      const netiesos = [n + 1, n - 2].filter((x) => x >= 0 && x <= maks && x !== n - 1)
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('skaiciavimas-iki-20'), 'skaiciavimas-iki-20', {
        klausimas: `Kuris skaičius eina prieš ${n}?`,
        variantai: [String(n - 1), ...netiesos.map(String)],
        teisingas: 0,
        sprendimas: `Prieš ${n} skaičiuojame ${n - 1}.`,
      })
    },

    // 5. Seka, kurios trūkstamas skaičius yra gale — sunkiau nei viduryje,
    //    nes atramos iš dešinės nebėra
    () => {
      const pradzia = atsitiktinis(1, maks - 4)
      const paskutinis = pradzia + 4
      return uzdavinys('skaiciavimas-iki-20', {
        klausimas: `Įrašyk paskutinį skaičių: ${pradzia}, ${pradzia + 1}, ${pradzia + 2}, ${pradzia + 3}, $\\square$.`,
        atsakymas: String(paskutinis),
        atsakymasRodymui: `$${paskutinis}$`,
        sprendimas: `Po ${pradzia + 3} skaičiuojame ${paskutinis}.`,
        brezinys: langeliuEile([pradzia, pradzia + 1, pradzia + 2, pradzia + 3, null]),
      })
    },
  ])
}

// ── 3.4 Kas yra dešimtys ir vienetai? ───────────────────────────────────────

const A_DESIMTYS = [
  {
    klausimas: 'Kiek vienetų yra skaičiuje 16?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Skaičių 16 sudaro 1 dešimtis ir 6 vienetai.',
  },
] as const

export const desimtysVienetai: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkDesimtis(lygis, sritis), A_DESIMTYS, 'desimtys-vienetai')

function kurkDesimtis(_lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba3(sritis)
  if (maks < 11) return null
  const n = atsitiktinis(11, maks)
  const vienetai = n % 10
  const desimtys = Math.floor(n / 10)
  if (vienetai === 0) return null

  return variacija([
    // 1. Kiek vienetų
    () =>
      uzdavinys('desimtys-vienetai', {
        klausimas: `Kiek vienetų yra skaičiuje ${n}?`,
        atsakymas: String(vienetai),
        atsakymasRodymui: `$${vienetai}$`,
        sprendimas: `Skaičių ${n} sudaro ${desimtys} dešimtis ir ${vienetai} vienetai.`,
        brezinys: skyriuBlokai(desimtys, vienetai),
      }),

    // 2. Kiek dešimčių
    () =>
      uzdavinys('desimtys-vienetai', {
        klausimas: `Kiek dešimčių yra skaičiuje ${n}?`,
        atsakymas: String(desimtys),
        atsakymasRodymui: `$${desimtys}$`,
        sprendimas: `Skaičiuje ${n} yra ${desimtys} pilna dešimtis ir dar ${vienetai} vienetai.`,
        brezinys: skyriuBlokai(desimtys, vienetai),
      }),

    // 3. Koks skaičius pavaizduotas
    () =>
      uzdavinys('desimtys-vienetai', {
        klausimas: 'Piešinyje viena dešimties lazdelė ir pavieniai kubeliai. Koks skaičius pavaizduotas?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `${desimtys} dešimtis ir ${vienetai} vienetai sudaro ${n}.`,
        brezinys: skyriuBlokai(desimtys, vienetai),
      }),

    // 4. Skaičius iš skyrių
    () =>
      uzdavinys('desimtys-vienetai', {
        klausimas: `Užrašyk skaičių, kurį sudaro ${desimtys} dešimtis ir ${vienetai} vienetai.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$10 + ${vienetai} = ${n}$.`,
      }),

    // 5. Išskaidymas skyrių suma
    () =>
      uzdavinys('desimtys-vienetai', {
        klausimas: `Skaičių ${n} išskaidyk į dešimtį ir vienetus: $${n} = 10 + \\square$`,
        atsakymas: String(vienetai),
        atsakymasRodymui: `$${vienetai}$`,
        sprendimas: `$${n} - 10 = ${vienetai}$.`,
      }),
  ])
}

// ── 3.5 Kaip palyginti dviženklius skaičius? ────────────────────────────────

const A_PALYGINIMAS_20 = [
  {
    klausimas: 'Kuris skaičius didesnis: 19 ar 16?',
    atsakymas: '19',
    atsakymasRodymui: '$19$',
    sprendimas: '19 yra toliau skaičiuojant, tad jis didesnis.',
  },
] as const

export const palyginimasIki20: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkPalyginima20(lygis, sritis), A_PALYGINIMAS_20, 'palyginimas-iki-20')

/**
 * Kodėl vienas dviženklis skaičius didesnis už kitą.
 *
 * Potemė yra apie palyginimo BŪDĄ: pirma lyginamos dešimtys, ir tik tada, kai
 * jos vienodos, — vienetai. „Skaičiuojant pasakomas vėliau“ tokio būdo nemoko,
 * o srityje iki 20 dešimtys beveik visada sutampa, tad visas darbas ir yra
 * vienetuose.
 */
function kodelPalyginimas(d: number, m: number, isvada: string): string {
  const desimtys = (n: number) =>
    `${Math.floor(n / 10)} ${derink(Math.floor(n / 10), {
      vns: 'dešimtis',
      dgs: 'dešimtys',
      kilm: 'dešimčių',
    })}`
  if (Math.floor(d / 10) !== Math.floor(m / 10)) {
    return `Skaičiuje ${d} yra ${desimtys(d)}, o skaičiuje ${m} — ${desimtys(m)}, tad ${isvada}.`
  }
  return `Dešimčių po lygiai, tad lyginame vienetus: ${d % 10} daugiau nei ${m % 10}, tad ${isvada}.`
}

function kurkPalyginima20(_lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba3(sritis)
  if (maks < 12) return null
  // Tik dviženkliai: potemė vadinasi „Kaip palyginti dviženklius skaičius?“, o
  // pora 16 ir 5 lyginama iš pirmo žvilgsnio ir dešimčių lyginti neverčia.
  const dvizenklis = () => atsitiktinis(10, maks)
  const a = dvizenklis()
  const b = dvizenklis()

  return variacija([
    // 1. Ženklas tarp dviejų skaičių
    () =>
      pasirinkimoUzdavinys(naujasId('palyginimas-iki-20'), 'palyginimas-iki-20', {
        klausimas: `Įrašyk tinkamą ženklą: $${a} \\;\\square\\; ${b}$`,
        variantai: ['<', '>', '='],
        teisingas: a < b ? 0 : a > b ? 1 : 2,
        sprendimas:
          a === b
            ? 'Skaičiai vienodi, tad tarp jų rašome lygybės ženklą.'
            : kodelPalyginimas(
                Math.max(a, b),
                Math.min(a, b),
                `${Math.max(a, b)} didesnis`,
              ),
      }),

    // 2. Kuris didesnis
    () => {
      if (a === b) return null
      return uzdavinys('palyginimas-iki-20', {
        klausimas: `Kuris skaičius didesnis: ${a} ar ${b}?`,
        atsakymas: String(Math.max(a, b)),
        atsakymasRodymui: `$${Math.max(a, b)}$`,
        sprendimas: kodelPalyginimas(
          Math.max(a, b),
          Math.min(a, b),
          `${Math.max(a, b)} didesnis`,
        ),
      })
    },

    // 3. Kuris mažesnis
    () => {
      if (a === b) return null
      return uzdavinys('palyginimas-iki-20', {
        klausimas: `Kuris skaičius mažesnis: ${a} ar ${b}?`,
        atsakymas: String(Math.min(a, b)),
        atsakymasRodymui: `$${Math.min(a, b)}$`,
        // Išvada rašoma ta pačia kryptimi kaip klausimas: paklaustas, kuris
        // mažesnis, mokinys sprendime turi rasti mažesnįjį, o ne didesnįjį.
        sprendimas: kodelPalyginimas(
          Math.max(a, b),
          Math.min(a, b),
          `${Math.min(a, b)} mažesnis`,
        ),
      })
    },

    // 4. Surikiuoti tris skaičius
    () => {
      const trys = [...new Set([a, b, dvizenklis()])]
      if (trys.length < 3) return null
      const surikiuoti = [...trys].sort((x, y) => x - y)
      return eiliskumoUzdavinys(naujasId('palyginimas-iki-20'), 'palyginimas-iki-20', {
        klausimas: 'Surikiuok skaičius nuo mažiausio iki didžiausio.',
        teisingaEile: surikiuoti.map(String),
        sprendimas: `Nuo mažiausio: ${surikiuoti.join(', ')}.`,
      })
    },

    // 5. Didžiausias iš trijų
    () => {
      const trys = [...new Set([a, b, dvizenklis()])]
      if (trys.length < 3) return null
      return uzdavinys('palyginimas-iki-20', {
        klausimas: `Įrašyk didžiausią iš skaičių ${trys.join(', ')}.`,
        atsakymas: String(Math.max(...trys)),
        atsakymasRodymui: `$${Math.max(...trys)}$`,
        sprendimas: `Didžiausias yra ${Math.max(...trys)}.`,
      })
    },
  ])
}

// ── 3.6 Kaip sudėti skaičius nuo 0 iki 20? ──────────────────────────────────

const A_SUDETIS_20 = [
  {
    klausimas: 'Apskaičiuok: $12 + 4$',
    atsakymas: '16',
    atsakymasRodymui: '$16$',
    sprendimas: 'Vienetai: $2 + 4 = 6$. Dešimtis lieka, tad 16.',
  },
] as const

export const sudetisIki20: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkSudeti20(lygis, sritis), A_SUDETIS_20, 'sudetis-iki-20')

/**
 * Sudėtis be dešimties perėjimo: vienetų suma neviršija 9.
 *
 * Perėjimas per dešimtį yra atskira potemė (3.7), tad čia jo negali būti —
 * kitaip mokinys susidurtų su nauju sunkumu anksčiau, nei jo mokomasi.
 */
function poraBePerejimo(maks: number): [number, number] | null {
  const a = atsitiktinis(10, Math.min(maks, 18))
  const vienetai = a % 10
  const b = atsitiktinis(1, 9 - vienetai)
  if (b < 1 || a + b > maks) return null
  return [a, b]
}

function kurkSudeti20(_lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba3(sritis)
  if (maks < 12) return null
  const pora = poraBePerejimo(maks)
  if (!pora) return null
  const [a, b] = pora
  const suma = a + b

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('sudetis-iki-20', {
        klausimas: `Apskaičiuok: $${a} + ${b}$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Dešimtis lieka, sudedame vienetus: $${a % 10} + ${b} = ${(a % 10) + b}$, tad $${suma}$.`,
      }),

    // 2. Dešimtis ir vienetai
    () => {
      const v = atsitiktinis(1, 9)
      return uzdavinys('sudetis-iki-20', {
        klausimas: `Kiek bus, kai prie 10 pridėsi ${v}?`,
        atsakymas: String(10 + v),
        atsakymasRodymui: `$${10 + v}$`,
        sprendimas: `Prie dešimties pridėjus ${v} vienetus gaunama ${10 + v}.`,
      })
    },

    // 3. Sudėtis žodžiais
    () =>
      uzdavinys('sudetis-iki-20', {
        klausimas: `Sudėk skaičius ${b} ir ${a}.`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Dėmenis galima sukeisti vietomis: $${b} + ${a} = ${suma}$.`,
      }),

    // 4. Pasirinkimas
    () => {
      const netiesos = [...new Set([suma - 1, suma + 1, a - b])].filter(
        (x) => x > 0 && x !== suma && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('sudetis-iki-20'), 'sudetis-iki-20', {
        klausimas: `Pasirink teisingą atsakymą: $${a} + ${b}$`,
        variantai: [String(suma), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      })
    },

    // 5. Tekstinis
    () =>
      uzdavinys('sudetis-iki-20', {
        klausimas: `Lentynoje buvo ${suSkaiciumi(a, { vns: 'knyga', dgs: 'knygos', kilm: 'knygų' })}. Padėjo dar ${b}. Kiek knygų dabar lentynoje?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      }),
  ])
}

// ── 3.7 Kaip sudėti skaičius sudarant naują dešimtį? ────────────────────────

const A_PER_DESIMTI = [
  {
    klausimas: 'Apskaičiuok: $8 + 5$',
    atsakymas: '13',
    atsakymasRodymui: '$13$',
    sprendimas: '$8 + 2 = 10$, liko pridėti 3: $10 + 3 = 13$.',
  },
] as const

export const sudetisPerDesimti: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkSudetiPerDesimti(lygis, sritis), A_PER_DESIMTI, 'sudetis-per-desimti')

function kurkSudetiPerDesimti(_lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba3(sritis)
  if (maks < 13) return null
  const a = atsitiktinis(5, 9)
  const b = atsitiktinis(11 - a, Math.min(9, maks - a))
  if (a + b <= 10 || a + b > maks) return null
  const suma = a + b
  // Kiek trūksta iki dešimties ir kiek lieka pridėti po jos.
  const iki10 = 10 - a
  const po10 = b - iki10

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('sudetis-per-desimti', {
        klausimas: `Apskaičiuok: $${a} + ${b}$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${iki10} = 10$, liko pridėti ${po10}: $10 + ${po10} = ${suma}$.`,
      }),

    // 2. Skaidymas parodytas, mokinys įrašo trūkstamą dalį
    () => {
      if (po10 < 1) return null
      return uzdavinys('sudetis-per-desimti', {
        klausimas: `Užbaik: $${a} + ${b} = ${a} + ${iki10} + \\square$`,
        atsakymas: String(po10),
        atsakymasRodymui: `$${po10}$`,
        sprendimas: `${b} skaidome į ${iki10} ir ${po10}: pirma papildome iki 10, paskui pridedame ${po10}.`,
      })
    },

    // 3. Papildymas iki dešimties
    () =>
      uzdavinys('sudetis-per-desimti', {
        klausimas: `Kiek trūksta skaičiui ${a} iki 10?`,
        atsakymas: String(iki10),
        atsakymasRodymui: `$${iki10}$`,
        sprendimas: `$10 - ${a} = ${iki10}$.`,
      }),

    // 4. Nuo dešimties iki sumos
    () => {
      if (po10 < 1) return null
      return uzdavinys('sudetis-per-desimti', {
        klausimas: `Papildyk iki dešimties ir užbaik: $${a} + ${b} = 10 + \\square$`,
        atsakymas: String(po10),
        atsakymasRodymui: `$${po10}$`,
        sprendimas: `$${a} + ${iki10} = 10$, o iš ${b} liko ${po10}, tad $10 + ${po10} = ${suma}$.`,
      })
    },

    // 5. Pasirinkimas
    () => {
      const netiesos = [...new Set([suma - 1, suma + 1, suma - 10])].filter(
        (x) => x > 0 && x !== suma && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('sudetis-per-desimti'), 'sudetis-per-desimti', {
        klausimas: `Pasirink teisingą atsakymą: $${a} + ${b}$`,
        variantai: [String(suma), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} + ${iki10} = 10$, tada $10 + ${po10} = ${suma}$.`,
      })
    },
  ])
}

// ── 3.8 Kaip atimti skaičius, mažesnius už 20? ──────────────────────────────

const A_ATIMTIS_20 = [
  {
    klausimas: 'Apskaičiuok: $17 - 4$',
    atsakymas: '13',
    atsakymasRodymui: '$13$',
    sprendimas: 'Vienetai: $7 - 4 = 3$. Dešimtis lieka, tad 13.',
  },
] as const

export const atimtisIki20: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkAtimti20(lygis, sritis), A_ATIMTIS_20, 'atimtis-iki-20')

function kurkAtimti20(_lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba3(sritis)
  if (maks < 12) return null
  // Be dešimties ardymo: atimame ne daugiau vienetų, nei jų yra turinyje.
  const a = atsitiktinis(11, Math.min(maks, 19))
  const vienetai = a % 10
  if (vienetai < 1) return null
  const b = atsitiktinis(1, vienetai)
  const sk = a - b

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('atimtis-iki-20', {
        klausimas: `Apskaičiuok: $${a} - ${b}$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Dešimtis lieka, atimame vienetus: $${vienetai} - ${b} = ${vienetai - b}$, tad $${sk}$.`,
      }),

    // 2. Žodžiais
    () =>
      uzdavinys('atimtis-iki-20', {
        klausimas: `Kiek bus, kai iš ${a} atimsi ${b}?`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      }),

    // 3. Atimame visus vienetus — lieka pilna dešimtis
    () =>
      uzdavinys('atimtis-iki-20', {
        klausimas: `Užbaik: $${a} - ${vienetai} = \\square$`,
        atsakymas: '10',
        atsakymasRodymui: '$10$',
        sprendimas: `Atėmus visus ${vienetai} vienetus lieka pilna dešimtis.`,
      }),

    // 4. Pasirinkimas
    () => {
      const netiesos = [...new Set([sk - 1, sk + 1, a + b])].filter(
        (x) => x > 0 && x !== sk && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('atimtis-iki-20'), 'atimtis-iki-20', {
        klausimas: `Pasirink teisingą atsakymą: $${a} - ${b}$`,
        variantai: [String(sk), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      })
    },

    // 5. Tekstinis
    () =>
      uzdavinys('atimtis-iki-20', {
        klausimas: `Dėžėje buvo ${suSkaiciumi(a, { vns: 'kubelis', dgs: 'kubeliai', kilm: 'kubelių' })}. ${pasirink(VARDAI)} išėmė ${b}. Kiek kubelių liko?`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      }),
  ])
}

// ── 3.9 Kaip atimti išardant dešimtį? ───────────────────────────────────────

const A_ARDYMAS = [
  {
    klausimas: 'Apskaičiuok: $13 - 5$',
    atsakymas: '8',
    atsakymasRodymui: '$8$',
    sprendimas: '$13 - 3 = 10$, liko atimti 2: $10 - 2 = 8$.',
  },
] as const

export const atimtisPerDesimti: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkAtimtiPerDesimti(lygis, sritis), A_ARDYMAS, 'atimtis-per-desimti')

function kurkAtimtiPerDesimti(_lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba3(sritis)
  if (maks < 12) return null
  const a = atsitiktinis(11, Math.min(maks, 18))
  const vienetai = a % 10
  if (vienetai < 1) return null
  // Atėminys didesnis už turinio vienetus — tik tada dešimtį tenka ardyti.
  const b = atsitiktinis(vienetai + 1, 9)
  if (b > a) return null
  const sk = a - b
  const iki10 = vienetai
  const po10 = b - vienetai

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('atimtis-per-desimti', {
        klausimas: `Apskaičiuok: $${a} - ${b}$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${iki10} = 10$, liko atimti ${po10}: $10 - ${po10} = ${sk}$.`,
      }),

    // 2. Skaidymas parodytas
    () =>
      uzdavinys('atimtis-per-desimti', {
        klausimas: `Užbaik: $${a} - ${b} = ${a} - ${iki10} - \\square$`,
        atsakymas: String(po10),
        atsakymasRodymui: `$${po10}$`,
        sprendimas: `${b} skaidome į ${iki10} ir ${po10}: pirma nusileidžiame iki 10, paskui atimame ${po10}.`,
      }),

    // 3. Kiek atimti iki dešimties
    () =>
      uzdavinys('atimtis-per-desimti', {
        klausimas: `Kiek reikia atimti iš ${a}, kad liktų 10?`,
        atsakymas: String(iki10),
        atsakymasRodymui: `$${iki10}$`,
        sprendimas: `$${a} - 10 = ${iki10}$.`,
      }),

    // 4. Nuo dešimties toliau
    () =>
      uzdavinys('atimtis-per-desimti', {
        klausimas: `Nusileisk iki dešimties ir užbaik: $${a} - ${b} = 10 - \\square$`,
        atsakymas: String(po10),
        atsakymasRodymui: `$${po10}$`,
        sprendimas: `$${a} - ${iki10} = 10$, o iš ${b} liko atimti ${po10}, tad $10 - ${po10} = ${sk}$.`,
      }),

    // 5. Pasirinkimas
    () => {
      const netiesos = [...new Set([sk - 1, sk + 1, b - vienetai])].filter(
        (x) => x > 0 && x !== sk && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('atimtis-per-desimti'), 'atimtis-per-desimti', {
        klausimas: `Pasirink teisingą atsakymą: $${a} - ${b}$`,
        variantai: [String(sk), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} - ${iki10} = 10$, tada $10 - ${po10} = ${sk}$.`,
      })
    },
  ])
}

// ── 3.10 Kas yra tekstinis uždavinys? ───────────────────────────────────────

const A_TEKSTINIS = [
  {
    klausimas: 'Kurį tekstą galima spręsti kaip uždavinį?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — Kieme žaidė 5 vaikai, 2 išėjo. Kiek vaikų liko?',
    sprendimas: 'Uždavinyje turi būti ir skaičiai, ir klausimas.',
  },
] as const

export const tekstinisUzdavinys: Generatorius = () =>
  suBandymais(kurkTekstini, A_TEKSTINIS, 'tekstinis-uzdavinys')

/**
 * Sąlygos be klausimo ir klausimai be duomenų.
 *
 * Ši potemė vienintelė temoje nieko neskaičiuoja: tikrinama, ar mokinys skiria
 * uždavinį nuo paprasto pasakojimo. Todėl visi pavidalai yra pasirenkamojo
 * atsakymo — įrašyti čia nėra ko.
 */
const TEKSTAI = [
  {
    salyga: 'Lina turi 8 pieštukus. 3 atidavė sesei.',
    tinkamas: 'Kiek pieštukų liko Linai?',
    netinkami: ['Kokios spalvos pieštukai?', 'Kada Lina nusipirko pieštukus?'],
    pasakojimas: 'Lina mėgsta piešti ir dažnai dovanoja piešinius sesei.',
  },
  {
    salyga: 'Ant šakos tupėjo 6 paukščiai. Atskrido dar 2.',
    tinkamas: 'Kiek paukščių tupi ant šakos dabar?',
    netinkami: ['Kokie tai paukščiai?', 'Ar šaka stora?'],
    pasakojimas: 'Ant medžio šakos rytais susirenka paukščiai ir gieda.',
  },
  {
    salyga: 'Kieme žaidė 9 vaikai. 4 išėjo namo.',
    tinkamas: 'Kiek vaikų liko kieme?',
    netinkami: ['Kokį žaidimą jie žaidė?', 'Ar kieme buvo šilta?'],
    pasakojimas: 'Vaikai kieme mėgsta žaisti slėpynių ir laipioti.',
  },
  {
    salyga: 'Dėžėje buvo 7 obuoliai. Mama įdėjo dar 5.',
    tinkamas: 'Kiek obuolių dabar dėžėje?',
    netinkami: ['Ar obuoliai saldūs?', 'Kur stovi dėžė?'],
    pasakojimas: 'Rudenį obuolius mama sudeda į dėžę ir laiko sandėliuke.',
  },
] as const

/** Sunkumas ir sritis čia nieko nekeičia: uždavinys apie sąvoką, ne apie skaičius. */
function kurkTekstini(): Uzdavinys | null {
  const t = pasirink(TEKSTAI)
  const kitas = pasirink(TEKSTAI.filter((x) => x.salyga !== t.salyga))

  return variacija([
    // 1. Kurį tekstą galima spręsti
    () =>
      pasirinkimoUzdavinys(naujasId('tekstinis-uzdavinys'), 'tekstinis-uzdavinys', {
        klausimas: 'Kurį tekstą galima spręsti kaip uždavinį?',
        variantai: [`${t.salyga} ${t.tinkamas}`, t.salyga, kitas.pasakojimas],
        teisingas: 0,
        sprendimas:
          'Uždavinyje turi būti ir duomenys, ir klausimas. Be klausimo tekstas tik pasakoja.',
      }),

    // 2. Koks klausimas tinka sąlygai
    () =>
      pasirinkimoUzdavinys(naujasId('tekstinis-uzdavinys'), 'tekstinis-uzdavinys', {
        klausimas: `Perskaityk: „${t.salyga}“ Pasirink tinkamą klausimą.`,
        variantai: [t.tinkamas, ...t.netinkami],
        teisingas: 0,
        sprendimas: 'Tinka tas klausimas, į kurį galima atsakyti turimais skaičiais.',
      }),

    // 3. Kas paverčia tekstą uždaviniu
    () =>
      pasirinkimoUzdavinys(naujasId('tekstinis-uzdavinys'), 'tekstinis-uzdavinys', {
        klausimas: `Pateikta sąlyga: „${t.salyga}“ Ko trūksta, kad tai būtų uždavinys?`,
        variantai: ['klausimo', 'dar vieno skaičiaus', 'paveikslėlio'],
        teisingas: 0,
        sprendimas: 'Sąlyga jau turi duomenis, tad trūksta tik klausimo.',
      }),

    // 4. Kurio teksto išspręsti negalima
    () =>
      pasirinkimoUzdavinys(naujasId('tekstinis-uzdavinys'), 'tekstinis-uzdavinys', {
        klausimas: 'Kurio teksto išspręsti negalima?',
        variantai: [
          kitas.pasakojimas,
          `${t.salyga} ${t.tinkamas}`,
          `${kitas.salyga} ${kitas.tinkamas}`,
        ],
        teisingas: 0,
        sprendimas: 'Tekste be skaičių ir be klausimo nėra ko skaičiuoti.',
      }),

    // 5. Iš kokių dalių sudarytas uždavinys
    () =>
      pasirinkimoUzdavinys(naujasId('tekstinis-uzdavinys'), 'tekstinis-uzdavinys', {
        klausimas: 'Iš kokių dalių sudarytas tekstinis uždavinys?',
        variantai: ['iš sąlygos ir klausimo', 'iš sąlygos ir atsakymo', 'iš klausimo ir piešinio'],
        teisingas: 0,
        sprendimas: 'Sąlyga pateikia duomenis, o klausimas nurodo, ką reikia rasti.',
      }),
  ])
}

// ── 3.11 Kaip skaičių padidinti arba sumažinti keliais vienetais? ───────────

const A_PADIDINK = [
  {
    klausimas: 'Skaičių 12 padidink 4 vienetais.',
    atsakymas: '16',
    atsakymasRodymui: '$16$',
    sprendimas: 'Padidinti reiškia pridėti: $12 + 4 = 16$.',
  },
] as const

export const padidinkSumazink: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkPadidinima(lygis, sritis), A_PADIDINK, 'padidink-sumazink')

function kurkPadidinima(_lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba3(sritis)
  if (maks < 10) return null
  const pokytis = atsitiktinis(2, 5)
  const n = atsitiktinis(pokytis + 1, maks - pokytis)
  const vardas = pasirink(VARDAI)
  const antras = pasirink(VARDAI.filter((v) => v !== vardas))

  return variacija([
    // 1. Padidinti
    () =>
      uzdavinys('padidink-sumazink', {
        klausimas: `Skaičių ${n} padidink ${pokytis} vienetais.`,
        atsakymas: String(n + pokytis),
        atsakymasRodymui: `$${n + pokytis}$`,
        sprendimas: `Padidinti reiškia pridėti: $${n} + ${pokytis} = ${n + pokytis}$.`,
      }),

    // 2. Sumažinti
    () =>
      uzdavinys('padidink-sumazink', {
        klausimas: `Skaičių ${n} sumažink ${pokytis} vienetais.`,
        atsakymas: String(n - pokytis),
        atsakymasRodymui: `$${n - pokytis}$`,
        sprendimas: `Sumažinti reiškia atimti: $${n} - ${pokytis} = ${n - pokytis}$.`,
      }),

    // 3. „Keliais daugiau“ tekste
    () =>
      uzdavinys('padidink-sumazink', {
        klausimas: `${vardas} turi ${suSkaiciumi(n, { vns: 'kortelę', dgs: 'korteles', kilm: 'kortelių' })}, o ${antras} — ${pokytis} kortelėmis daugiau. Kiek kortelių turi ${antras}?`,
        atsakymas: String(n + pokytis),
        atsakymasRodymui: `$${n + pokytis}$`,
        sprendimas: `„Daugiau“ reiškia sudėtį: $${n} + ${pokytis} = ${n + pokytis}$.`,
      }),

    // 4. „Keliais mažiau“ tekste
    () =>
      uzdavinys('padidink-sumazink', {
        klausimas: `${vardas} turi ${suSkaiciumi(n, { vns: 'lipduką', dgs: 'lipdukus', kilm: 'lipdukų' })}, o ${antras} — ${pokytis} lipdukais mažiau. Kiek lipdukų turi ${antras}?`,
        atsakymas: String(n - pokytis),
        atsakymasRodymui: `$${n - pokytis}$`,
        sprendimas: `„Mažiau“ reiškia atimtį: $${n} - ${pokytis} = ${n - pokytis}$.`,
      }),

    // 5. Pasirinkimas — tikrinama, ar neapsiverčia veiksmas
    () => {
      const netiesos = [...new Set([n - pokytis, n + pokytis + 1, n])].filter(
        (x) => x > 0 && x !== n + pokytis && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('padidink-sumazink'), 'padidink-sumazink', {
        klausimas: `Kuris skaičius ${pokytis} vienetais didesnis už ${n}?`,
        variantai: [String(n + pokytis), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${n} + ${pokytis} = ${n + pokytis}$.`,
      })
    },
  ])
}
