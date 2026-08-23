import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import {
  juostineSchema,
  monetos,
  monetosUzrasas,
  skyriuLentele,
  stulpeliuVeiksmas,
  type Moneta,
} from './pirmoku-vaizdai'
import { langeliuEile, skyriuBlokai } from './vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 1 klasės 5 tema „Skaičiai nuo 0 iki 100“ ir 8 tema „Sudėtis ir atimtis iki
 * 100“.
 *
 * Anksčiau visos šių temų potemės rėmėsi bendraisiais generatoriais, todėl
 * vienuolika 8 temos potemių duodavo tuos pačius kelis uždavinius, o pinigų
 * potemės — kainas su centais po kablelio („Bandelė kainuoja 48,50 €“), kurių
 * pirmoje klasėje nėra. Čia kiekviena potemė turi savo generatorių ir laikosi
 * savo pavadinimo: „sudėti stulpeliu“ reiškia stulpelį, „išardant dešimtį“ —
 * skaidymą, o pinigai yra monetos, ne dešimtainės trupmenos.
 */

const VARDAI = ['Ugnė', 'Matas', 'Ieva', 'Lina', 'Tomas', 'Rugilė'] as const

/** Temos viršutinė riba; be srities imama 100. */
function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 100, 100)
}

// ═══ 5 tema. Skaičiai nuo 0 iki 100 ═════════════════════════════════════════

// ── 5.1 Kaip skaičiuoti dešimtimis? ─────────────────────────────────────────

const A_DESIMTIMIS = [
  {
    klausimas: 'Tęsk: 10, 20, 30, $\\square$.',
    atsakymas: '40',
    atsakymasRodymui: '$40$',
    sprendimas: 'Skaičiuojant dešimtimis kiekvienas kitas skaičius 10 didesnis.',
  },
] as const

export const skaiciavimasDesimtimis: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDesimtimis(sritis), A_DESIMTIMIS, 'skaiciavimas-desimtimis')

function kurkDesimtimis(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  if (maks < 50) return null

  return variacija([
    // 1. Seka pirmyn
    () => {
      const pradzia = atsitiktinis(1, 6) * 10
      if (pradzia + 30 > maks) return null
      return uzdavinys('skaiciavimas-desimtimis', {
        klausimas: `Tęsk: ${pradzia}, ${pradzia + 10}, ${pradzia + 20}, $\\square$.`,
        atsakymas: String(pradzia + 30),
        atsakymasRodymui: `$${pradzia + 30}$`,
        sprendimas: `Skaičiuojant dešimtimis kiekvienas kitas skaičius 10 didesnis: ${pradzia + 30}.`,
        brezinys: langeliuEile([pradzia, pradzia + 10, pradzia + 20, null]),
      })
    },

    // 2. Seka atgal
    () => {
      const pradzia = atsitiktinis(4, 10) * 10
      if (pradzia > maks) return null
      return uzdavinys('skaiciavimas-desimtimis', {
        klausimas: `Skaičiuok atgal dešimtimis: ${pradzia}, ${pradzia - 10}, $\\square$, ${pradzia - 30}.`,
        atsakymas: String(pradzia - 20),
        atsakymasRodymui: `$${pradzia - 20}$`,
        sprendimas: `Skaičiuojant atgal kiekvienas kitas skaičius 10 mažesnis: ${pradzia - 20}.`,
        brezinys: langeliuEile([pradzia, pradzia - 10, null, pradzia - 30]),
      })
    },

    // 3. Ryšulėliai piešinyje
    () => {
      const kiek = atsitiktinis(3, Math.min(9, Math.floor(maks / 10)))
      return uzdavinys('skaiciavimas-desimtimis', {
        klausimas: `Piešinyje ${kiek} ${derink(kiek, { vns: 'dešimties ryšulėlis', dgs: 'dešimties ryšulėliai', kilm: 'dešimties ryšulėlių' })}. Kiek yra iš viso?`,
        atsakymas: String(kiek * 10),
        atsakymasRodymui: `$${kiek * 10}$`,
        sprendimas: `${kiek} dešimtys yra ${kiek * 10}.`,
        brezinys: skyriuBlokai(kiek, 0),
      })
    },

    // 4. Kuris eina po
    () => {
      const n = atsitiktinis(1, 8) * 10
      if (n + 10 > maks) return null
      // „Kokia dešimtis…“, o ne „koks skaičius“: skaičiuojant dešimtimis kitas
      // narys yra pilna dešimtis, ir klausimas turi to paties ir paprašyti.
      return pasirinkimoUzdavinys(naujasId('skaiciavimas-desimtimis'), 'skaiciavimas-desimtimis', {
        klausimas: `Skaičiuojame dešimtimis. Kokia dešimtis eina po ${n}?`,
        variantai: [String(n + 10), String(n + 1), String(n - 10)],
        teisingas: 0,
        sprendimas: `Po ${n} dešimtimis skaičiuojame ${n + 10}.`,
      })
    },

    // 5. Kiek dešimčių
    () => {
      const kiek = atsitiktinis(2, Math.min(9, Math.floor(maks / 10)))
      return uzdavinys('skaiciavimas-desimtimis', {
        klausimas: `Kiek dešimčių yra skaičiuje ${kiek * 10}?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `${kiek * 10} yra ${kiek} ${derink(kiek, { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' })}.`,
        brezinys: skyriuBlokai(kiek, 0),
      })
    },
  ])
}

// ── 5.2 Kokie yra skaičiaus skyriai? ────────────────────────────────────────

const A_SKYRIAI = [
  {
    klausimas: 'Kiek dešimčių yra skaičiuje 47?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Skaičių 47 sudaro 4 dešimtys ir 7 vienetai.',
  },
] as const

export const skaiciausSkyriai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSkyrius(sritis), A_SKYRIAI, 'skaiciaus-skyriai')

function kurkSkyrius(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  if (maks < 30) return null
  const n = atsitiktinis(11, Math.min(maks, 99))
  const d = Math.floor(n / 10)
  const v = n % 10
  if (v === 0) return null

  return variacija([
    // 1. Kiek dešimčių
    () =>
      uzdavinys('skaiciaus-skyriai', {
        klausimas: `Kiek dešimčių yra skaičiuje ${n}?`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}$`,
        sprendimas: `Skaičių ${n} sudaro ${d} ${derink(d, { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' })} ir ${v} ${derink(v, { vns: 'vienetas', dgs: 'vienetai', kilm: 'vienetų' })}.`,
        brezinys: skyriuBlokai(d, v),
      }),

    // 2. Kiek vienetų
    () =>
      uzdavinys('skaiciaus-skyriai', {
        klausimas: `Kiek vienetų yra skaičiuje ${n}?`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$`,
        sprendimas: `Skaičių ${n} sudaro ${d} ${derink(d, { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' })} ir ${v} ${derink(v, { vns: 'vienetas', dgs: 'vienetai', kilm: 'vienetų' })}.`,
        brezinys: skyriuBlokai(d, v),
      }),

    // 3. Skaičius iš skyrių lentelės
    () =>
      uzdavinys('skaiciaus-skyriai', {
        klausimas: `${d} ${derink(d, { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' })} ir ${v} ${derink(v, { vns: 'vienetas', dgs: 'vienetai', kilm: 'vienetų' })}. Koks tai skaičius?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${d * 10} + ${v} = ${n}$.`,
        brezinys: skyriuLentele(d, v),
      }),

    // 4. Išskaidymas
    () =>
      uzdavinys('skaiciaus-skyriai', {
        klausimas: `Išskaidyk skaičių ${n}: $${n} = ${d * 10} + \\square$`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$`,
        sprendimas: `$${n} - ${d * 10} = ${v}$.`,
        brezinys: skyriuLentele(d, v),
      }),

    // 6. Trūkstamas skyrių lentelės langelis
    () => {
      const trūkstaVienetu = atsitiktinis(0, 1) === 1
      return uzdavinys('skaiciaus-skyriai', {
        klausimas: `Skaičiaus ${n} skyrių lentelėje trūksta vieno skaičiaus. Koks jis?`,
        atsakymas: String(trūkstaVienetu ? v : d),
        atsakymasRodymui: `$${trūkstaVienetu ? v : d}$`,
        sprendimas: `Skaičių ${n} sudaro ${d} ${derink(d, { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' })} ir ${v} ${derink(v, { vns: 'vienetas', dgs: 'vienetai', kilm: 'vienetų' })}.`,
        brezinys: skyriuLentele(trūkstaVienetu ? d : null, trūkstaVienetu ? null : v),
      })
    },

    // 5. Koks skaičius pavaizduotas
    () =>
      uzdavinys('skaiciaus-skyriai', {
        klausimas: 'Paveikslėlyje dešimčių stulpeliai ir atskiri kubeliai. Koks skaičius pavaizduotas?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `${d} ${derink(d, { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' })} ir ${v} ${derink(v, { vns: 'vienetas', dgs: 'vienetai', kilm: 'vienetų' })} sudaro ${n}.`,
        brezinys: skyriuBlokai(d, v),
      }),
  ])
}

// ── 5.5 Kaip palyginti skaičius? ────────────────────────────────────────────

const A_PALYGINIMAS = [
  {
    klausimas: 'Kuris skaičius didesnis: 54 ar 45?',
    atsakymas: '54',
    atsakymasRodymui: '$54$',
    sprendimas: '54 turi 5 dešimtis, o 45 — tik 4, tad 54 didesnis.',
  },
] as const

export const palyginimasIki100: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkPalyginima(sritis), A_PALYGINIMAS, 'palyginimas-iki-100')

/**
 * Kodėl vienas skaičius didesnis: pirma dešimtys, tada vienetai.
 *
 * Ne „skaičiuojant pasakomas vėliau“: iki šimto taip skaičiuoti per ilga, o
 * palyginimo taisyklė kaip tik ir yra ta, kad pirmiausia lyginamos dešimtys.
 */
function kodel(d: number, m: number, isvada: string): string {
  const dD = Math.floor(d / 10)
  const mD = Math.floor(m / 10)
  if (dD !== mD) {
    return `Skaičiuje ${d} yra ${dD} ${derink(dD, { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' })}, o skaičiuje ${m} — ${mD}, tad ${isvada}.`
  }
  return `Dešimčių po lygiai, tad lyginame vienetus: ${d % 10} daugiau nei ${m % 10}, tad ${isvada}.`
}

function kurkPalyginima(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  if (maks < 30) return null
  const a = atsitiktinis(10, maks)
  const b = atsitiktinis(10, maks)

  return variacija([
    // 1. Ženklas
    () =>
      pasirinkimoUzdavinys(naujasId('palyginimas-iki-100'), 'palyginimas-iki-100', {
        klausimas: `Įrašyk tinkamą ženklą: $${a} \\;\\square\\; ${b}$`,
        variantai: ['<', '>', '='],
        teisingas: a < b ? 0 : a > b ? 1 : 2,
        sprendimas:
          a === b
            ? 'Skaičiai vienodi, tad tarp jų rašome lygybės ženklą.'
            : kodel(Math.max(a, b), Math.min(a, b), `${Math.max(a, b)} didesnis`),
      }),

    // 2. Kuris didesnis
    () => {
      if (a === b) return null
      return uzdavinys('palyginimas-iki-100', {
        klausimas: `Kuris skaičius didesnis: ${a} ar ${b}?`,
        atsakymas: String(Math.max(a, b)),
        atsakymasRodymui: `$${Math.max(a, b)}$`,
        sprendimas: kodel(Math.max(a, b), Math.min(a, b), `${Math.max(a, b)} didesnis`),
      })
    },

    // 3. Kuris mažesnis
    () => {
      if (a === b) return null
      return uzdavinys('palyginimas-iki-100', {
        klausimas: `Kuris skaičius mažesnis: ${a} ar ${b}?`,
        atsakymas: String(Math.min(a, b)),
        atsakymasRodymui: `$${Math.min(a, b)}$`,
        sprendimas: kodel(Math.max(a, b), Math.min(a, b), `${Math.min(a, b)} mažesnis`),
      })
    },

    // 4. Surikiuoti tris
    () => {
      const trys = [...new Set([a, b, atsitiktinis(10, maks)])]
      if (trys.length < 3) return null
      const surikiuoti = [...trys].sort((x, y) => x - y)
      return eiliskumoUzdavinys(naujasId('palyginimas-iki-100'), 'palyginimas-iki-100', {
        klausimas: 'Surikiuok skaičius nuo mažiausio iki didžiausio.',
        teisingaEile: surikiuoti.map(String),
        sprendimas: `Nuo mažiausio: ${surikiuoti.join(', ')}.`,
      })
    },

    // 5. Sukeisti skaitmenys — tipinė klaidos vieta
    () => {
      const d = atsitiktinis(1, 9)
      const v = atsitiktinis(1, 9)
      if (d === v || d * 10 + v > maks || v * 10 + d > maks) return null
      const x = d * 10 + v
      const y = v * 10 + d
      return uzdavinys('palyginimas-iki-100', {
        klausimas: `Kuris skaičius didesnis: ${x} ar ${y}?`,
        atsakymas: String(Math.max(x, y)),
        atsakymasRodymui: `$${Math.max(x, y)}$`,
        sprendimas: kodel(Math.max(x, y), Math.min(x, y), `${Math.max(x, y)} didesnis`),
      })
    },
  ])
}

// ── 5.6 Kokius pinigus naudojame Lietuvoje? ─────────────────────────────────

const A_LT_PINIGAI = [
  {
    klausimas: 'Kiek centų yra viename eure?',
    atsakymas: '100',
    atsakymasRodymui: '$100$',
    sprendimas: 'Viename eure yra 100 centų.',
  },
] as const

export const lietuvosPinigai: Generatorius = () =>
  suBandymais(kurkLtPinigus, A_LT_PINIGAI, 'lietuvos-pinigai')

/** Monetos, kurias pirmokas turi atpažinti. */
const NOMINALAI: Moneta[] = [1, 2, 5, 10, 20, 50, 100, 200]

function kurkLtPinigus(): Uzdavinys | null {
  const trys = sumaisyk(NOMINALAI).slice(0, 3)
  const ieskoma = trys[0]

  return variacija([
    // 1. Kuri moneta
    () =>
      pasirinkimoUzdavinys(naujasId('lietuvos-pinigai'), 'lietuvos-pinigai', {
        klausimas: `Pasirink ${monetosUzrasas(ieskoma)} monetą.`,
        variantai: trys.map(monetosUzrasas),
        teisingas: 0,
        sprendimas: `Ieškoma moneta užrašyta ${monetosUzrasas(ieskoma)}.`,
        brezinys: monetos(trys),
      }),

    // 2. Kiek centų eure
    () =>
      uzdavinys('lietuvos-pinigai', {
        klausimas: 'Kiek centų yra viename eure?',
        atsakymas: '100',
        atsakymasRodymui: '$100$',
        sprendimas: 'Viename eure yra 100 centų.',
      }),

    // 3. Kokie pinigai naudojami Lietuvoje
    () =>
      pasirinkimoUzdavinys(naujasId('lietuvos-pinigai'), 'lietuvos-pinigai', {
        klausimas: 'Kokie pinigai naudojami Lietuvoje?',
        variantai: ['eurai ir centai', 'litai ir centai', 'doleriai'],
        teisingas: 0,
        sprendimas: 'Lietuvoje mokama eurais, o smulkiausi pinigai yra centai.',
      }),

    // 4. Kuri moneta didesnės vertės
    () => {
      const [x, y] = sumaisyk(NOMINALAI).slice(0, 2)
      if (x === y) return null
      return pasirinkimoUzdavinys(naujasId('lietuvos-pinigai'), 'lietuvos-pinigai', {
        klausimas: 'Kuri moneta didesnės vertės?',
        variantai: [
          monetosUzrasas(Math.max(x, y) as Moneta),
          monetosUzrasas(Math.min(x, y) as Moneta),
          'abi vienodos',
        ],
        teisingas: 0,
        sprendimas: `${monetosUzrasas(Math.max(x, y) as Moneta)} yra daugiau nei ${monetosUzrasas(Math.min(x, y) as Moneta)}.`,
        brezinys: monetos([x, y]),
      })
    },

    // 5. Kuo sumokėti tiksliai
    () =>
      pasirinkimoUzdavinys(naujasId('lietuvos-pinigai'), 'lietuvos-pinigai', {
        klausimas: 'Kuo galima sumokėti lygiai 1 €?',
        variantai: ['viena 1 € moneta', 'viena 10 ct moneta', 'viena 2 ct moneta'],
        teisingas: 0,
        sprendimas: 'Lygiai euro vertės yra tik 1 € moneta; 10 ct ir 2 ct yra mažiau.',
        brezinys: monetos([100, 10, 2]),
      }),
  ])
}

// ── 5.7 Kokia pinigų vertė? ─────────────────────────────────────────────────

const A_VERTE = [
  {
    klausimas: 'Kiek centų yra paveikslėlyje?',
    atsakymas: '70',
    atsakymasRodymui: '$70$ ct',
    sprendimas: '$50 + 20 = 70$ ct.',
  },
] as const

export const piniguVerte: Generatorius = () => suBandymais(kurkVerte, A_VERTE, 'pinigu-verte')

/** Monetos, kurių suma neviršija 100 ct — pirmos klasės sritis. */
function smulkiosMonetos(): { rinkinys: Moneta[]; suma: number } | null {
  const galimi: Moneta[] = [5, 10, 20, 50]
  const kiek = atsitiktinis(2, 3)
  const rinkinys: Moneta[] = []
  let suma = 0
  for (let i = 0; i < kiek; i += 1) {
    const m = pasirink(galimi)
    if (suma + m > 100) return null
    rinkinys.push(m)
    suma += m
  }
  return suma > 0 ? { rinkinys, suma } : null
}

function kurkVerte(): Uzdavinys | null {
  const pirmas = smulkiosMonetos()
  const antras = smulkiosMonetos()
  if (!pirmas || !antras) return null

  return variacija([
    // 1. Kiek pinigų iš viso
    () =>
      uzdavinys('pinigu-verte', {
        klausimas: 'Kiek centų yra paveikslėlyje?',
        atsakymas: String(pirmas.suma),
        atsakymasRodymui: `$${pirmas.suma}$ ct`,
        sprendimas: `${pirmas.rinkinys.join(' + ')} = ${pirmas.suma} ct.`,
        brezinys: monetos(pirmas.rinkinys),
      }),

    // 2. Kuri suma didesnė
    () => {
      if (pirmas.suma === antras.suma) return null
      return pasirinkimoUzdavinys(naujasId('pinigu-verte'), 'pinigu-verte', {
        klausimas: `Viena krūvelė — ${pirmas.suma} ct, kita — ${antras.suma} ct. Kuri suma didesnė?`,
        variantai: [
          `${Math.max(pirmas.suma, antras.suma)} ct`,
          `${Math.min(pirmas.suma, antras.suma)} ct`,
          'abi vienodos',
        ],
        teisingas: 0,
        sprendimas: `${Math.max(pirmas.suma, antras.suma)} ct yra daugiau nei ${Math.min(pirmas.suma, antras.suma)} ct.`,
      })
    },

    // 3. Ar užteks
    () => {
      const kaina = atsitiktinis(2, 9) * 10
      return pasirinkimoUzdavinys(naujasId('pinigu-verte'), 'pinigu-verte', {
        klausimas: `Keksiukas kainuoja ${kaina} ct. Ar užteks paveikslėlyje parodytų pinigų?`,
        variantai:
          pirmas.suma >= kaina
            ? ['taip, užteks', 'ne, trūksta', 'negalima pasakyti']
            : ['ne, trūksta', 'taip, užteks', 'negalima pasakyti'],
        teisingas: 0,
        sprendimas: `Paveikslėlyje yra ${pirmas.suma} ct, o kaina ${kaina} ct.`,
        brezinys: monetos(pirmas.rinkinys),
      })
    },

    // 4. Kiek grąžos
    () => {
      const kaina = atsitiktinis(1, Math.max(1, Math.floor(pirmas.suma / 10) - 1)) * 10
      if (kaina >= pirmas.suma) return null
      return uzdavinys('pinigu-verte', {
        klausimas: `Turima ${pirmas.suma} ct, o prekė kainuoja ${kaina} ct. Kiek centų grąžos?`,
        atsakymas: String(pirmas.suma - kaina),
        atsakymasRodymui: `$${pirmas.suma - kaina}$ ct`,
        sprendimas: `$${pirmas.suma} - ${kaina} = ${pirmas.suma - kaina}$ ct.`,
        brezinys: monetos(pirmas.rinkinys),
      })
    },

    // 5. Kiek trūksta
    () => {
      const kaina = pirmas.suma + atsitiktinis(1, 3) * 10
      if (kaina > 100) return null
      return uzdavinys('pinigu-verte', {
        klausimas: `Prekė kainuoja ${kaina} ct, o turima ${pirmas.suma} ct. Kiek centų trūksta?`,
        atsakymas: String(kaina - pirmas.suma),
        atsakymasRodymui: `$${kaina - pirmas.suma}$ ct`,
        sprendimas: `$${kaina} - ${pirmas.suma} = ${kaina - pirmas.suma}$ ct.`,
        brezinys: monetos(pirmas.rinkinys),
      })
    },
  ])
}

// ═══ 8 tema. Sudėtis ir atimtis iki 100 ═════════════════════════════════════

// ── 8.1 Kaip sudėti dviženklį ir vienaženklį skaičius? ──────────────────────

const A_DV_PLIUS_V = [
  {
    klausimas: 'Apskaičiuok: $42 + 5$',
    atsakymas: '47',
    atsakymasRodymui: '$47$',
    sprendimas: 'Dešimtis lieka, sudedame vienetus: $2 + 5 = 7$, tad 47.',
  },
] as const

export const dvizenklisPlusVienazenklis: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDvPlusV(sritis), A_DV_PLIUS_V, 'dvizenklis-plius-vienazenklis')

/** Pora be dešimties peržengimo: vienetų suma neviršija 9. */
function poraBePerejimo(maks: number): [number, number] | null {
  const a = atsitiktinis(11, Math.min(maks - 1, 98))
  const v = a % 10
  if (v > 8) return null
  const b = atsitiktinis(1, 9 - v)
  if (a + b > maks) return null
  return [a, b]
}

function kurkDvPlusV(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const pora = poraBePerejimo(maks)
  if (!pora) return null
  const [a, b] = pora
  const suma = a + b

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('dvizenklis-plius-vienazenklis', {
        klausimas: `Apskaičiuok: $${a} + ${b}$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Dešimtys lieka, sudedame vienetus: $${a % 10} + ${b} = ${(a % 10) + b}$, tad ${suma}.`,
      }),

    // 2. Užbaigimas
    () =>
      uzdavinys('dvizenklis-plius-vienazenklis', {
        klausimas: `Užbaik: $${a} + ${b} = \\square$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      }),

    // 3. Pieštukai dėžėje
    () =>
      uzdavinys('dvizenklis-plius-vienazenklis', {
        klausimas: `Dėžėje yra ${a} ${derink(a, { vns: 'pieštukas', dgs: 'pieštukai', kilm: 'pieštukų' })}. Įdėjo dar ${b}. Kiek pieštukų dabar?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      }),

    // 4. Knygos lentynoje
    () =>
      uzdavinys('dvizenklis-plius-vienazenklis', {
        klausimas: `Lentynoje buvo ${a} ${derink(a, { vns: 'knyga', dgs: 'knygos', kilm: 'knygų' })}. Padėjo dar ${b}. Kiek knygų dabar?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      }),

    // 5. Pasirinkimas
    () => {
      const netiesos = [...new Set([suma + 1, suma - 1, a + b * 10])].filter(
        (x) => x > 0 && x !== suma && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(
        naujasId('dvizenklis-plius-vienazenklis'),
        'dvizenklis-plius-vienazenklis',
        {
          klausimas: `Pasirink teisingą atsakymą: $${a} + ${b}$`,
          variantai: [String(suma), ...netiesos.slice(0, 2).map(String)],
          teisingas: 0,
          sprendimas: `$${a} + ${b} = ${suma}$.`,
        },
      )
    },
  ])
}

// ── 8.2 Kiek vienetų trūksta iki pilnos dešimties? ──────────────────────────

const A_IKI_DESIMTIES = [
  {
    klausimas: 'Kiek trūksta iki 50? $47 + \\square = 50$',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: '$50 - 47 = 3$.',
  },
] as const

export const ikiPilnosDesimties: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkIkiDesimties(sritis), A_IKI_DESIMTIES, 'iki-pilnos-desimties')

function kurkIkiDesimties(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const n = atsitiktinis(11, Math.min(maks - 1, 98))
  const v = n % 10
  if (v === 0) return null
  const desimtis = n + (10 - v)
  if (desimtis > maks) return null
  const trukstama = 10 - v

  return variacija([
    // 1. Kiek trūksta iki dešimties
    () =>
      uzdavinys('iki-pilnos-desimties', {
        klausimas: `Kiek trūksta iki ${desimtis}? $${n} + \\square = ${desimtis}$`,
        atsakymas: String(trukstama),
        atsakymasRodymui: `$${trukstama}$`,
        sprendimas: `$${desimtis} - ${n} = ${trukstama}$.`,
      }),

    // 2. Kiek pridėti
    () =>
      uzdavinys('iki-pilnos-desimties', {
        klausimas: `Kiek reikia pridėti prie ${n}, kad gautume ${desimtis}?`,
        atsakymas: String(trukstama),
        atsakymasRodymui: `$${trukstama}$`,
        sprendimas: `Iki pilnos dešimties trūksta ${trukstama}.`,
      }),

    // 3. Užbaik lygybę
    () =>
      uzdavinys('iki-pilnos-desimties', {
        klausimas: `Užbaik: $${n} + \\square = ${desimtis}$`,
        atsakymas: String(trukstama),
        atsakymasRodymui: `$${trukstama}$`,
        sprendimas: `Vienetų skaičiuje ${n} yra ${v}, o iki 10 trūksta ${trukstama}.`,
      }),

    // 4. Kuri dešimtis artimiausia
    () =>
      pasirinkimoUzdavinys(naujasId('iki-pilnos-desimties'), 'iki-pilnos-desimties', {
        klausimas: `Kuri pilna dešimtis eina tuoj po ${n}?`,
        variantai: [String(desimtis), String(desimtis + 10), String(desimtis - 10)],
        teisingas: 0,
        sprendimas: `Po ${n} artimiausia pilna dešimtis yra ${desimtis}.`,
      }),

    // 5. Kiek vienetų trūksta iki šimto
    () => {
      if (maks < 100) return null
      const x = atsitiktinis(90, 99)
      return uzdavinys('iki-pilnos-desimties', {
        klausimas: `Kiek vienetų trūksta skaičiui ${x} iki 100?`,
        atsakymas: String(100 - x),
        atsakymasRodymui: `$${100 - x}$`,
        sprendimas: `$100 - ${x} = ${100 - x}$.`,
      })
    },
  ])
}

// ── 8.3 Sudėtis eilute peržengiant dešimtį ──────────────────────────────────

const A_EILUTE_PLIUS = [
  {
    klausimas: 'Apskaičiuok: $38 + 5$',
    atsakymas: '43',
    atsakymasRodymui: '$43$',
    sprendimas: '$38 + 2 = 40$, liko pridėti 3: $40 + 3 = 43$.',
  },
] as const

export const sudetisEilutePerDesimti: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkEilutePlius(sritis), A_EILUTE_PLIUS, 'sudetis-eilute-per-desimti')

/** Pora, kurioje vienetų suma peržengia 10 — būtent tam potemė ir skirta. */
function poraSuPerejimu(maks: number): [number, number] | null {
  const a = atsitiktinis(11, Math.min(maks - 5, 94))
  const v = a % 10
  if (v < 2) return null
  const b = atsitiktinis(11 - v, 9)
  if (b < 1 || a + b > maks) return null
  return [a, b]
}

function kurkEilutePlius(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const pora = poraSuPerejimu(maks)
  if (!pora) return null
  const [a, b] = pora
  const suma = a + b
  const iki10 = 10 - (a % 10)
  const po10 = b - iki10
  const desimtis = a + iki10

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('sudetis-eilute-per-desimti', {
        klausimas: `Apskaičiuok eilute: $${a} + ${b}$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${iki10} = ${desimtis}$, liko pridėti ${po10}: $${desimtis} + ${po10} = ${suma}$.`,
      }),

    // 2. Skaidymas parodytas
    () => {
      if (po10 < 1) return null
      return uzdavinys('sudetis-eilute-per-desimti', {
        klausimas: `Užbaik: $${a} + ${b} = ${a} + ${iki10} + \\square$`,
        atsakymas: String(po10),
        atsakymasRodymui: `$${po10}$`,
        sprendimas: `${b} skaidome į ${iki10} ir ${po10}: pirma papildome iki ${desimtis}.`,
      })
    },

    // 3. Kiek iki pilnos dešimties
    () =>
      uzdavinys('sudetis-eilute-per-desimti', {
        klausimas: `Skaičiuojame $${a} + ${b}$. Kiek trūksta skaičiui ${a} iki ${desimtis}?`,
        atsakymas: String(iki10),
        atsakymasRodymui: `$${iki10}$`,
        sprendimas: `$${desimtis} - ${a} = ${iki10}$.`,
      }),

    // 4. Nuo dešimties toliau
    () => {
      if (po10 < 1) return null
      return uzdavinys('sudetis-eilute-per-desimti', {
        klausimas: `Papildyk iki dešimties ir užbaik: $${a} + ${b} = ${desimtis} + \\square$`,
        atsakymas: String(po10),
        atsakymasRodymui: `$${po10}$`,
        sprendimas: `Iš ${b} panaudojome ${iki10}, liko ${po10}, tad $${desimtis} + ${po10} = ${suma}$.`,
      })
    },

    // 5. Pasirinkimas
    () => {
      const netiesos = [...new Set([suma - 1, suma + 1, desimtis])].filter(
        (x) => x > 0 && x !== suma && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(
        naujasId('sudetis-eilute-per-desimti'),
        'sudetis-eilute-per-desimti',
        {
          klausimas: `Pasirink teisingą atsakymą: $${a} + ${b}$`,
          variantai: [String(suma), ...netiesos.slice(0, 2).map(String)],
          teisingas: 0,
          sprendimas: `$${a} + ${iki10} = ${desimtis}$, tada $${desimtis} + ${po10} = ${suma}$.`,
        },
      )
    },
  ])
}

// ── 8.4 Sudėtis stulpeliu peržengiant dešimtį ───────────────────────────────

const A_STULPELIU_PLIUS = [
  {
    klausimas: 'Apskaičiuok stulpeliu: $58 + 7$',
    atsakymas: '65',
    atsakymasRodymui: '$65$',
    sprendimas: 'Vienetai: $8 + 7 = 15$. Rašome 5, o dešimtį perkeliame: $5 + 1 = 6$.',
  },
] as const

export const sudetisStulpeliu: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkStulpeliuPlius(sritis), A_STULPELIU_PLIUS, 'sudetis-stulpeliu')

function kurkStulpeliuPlius(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const pora = poraSuPerejimu(maks)
  if (!pora) return null
  const [a, b] = pora
  const suma = a + b
  const v = a % 10
  const d = Math.floor(a / 10)

  return variacija([
    // 1. Suskaičiuok stulpeliu
    () =>
      uzdavinys('sudetis-stulpeliu', {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Vienetai: $${v} + ${b} = ${v + b}$. Rašome ${(v + b) % 10}, o dešimtį perkeliame: $${d} + 1 = ${d + 1}$.`,
        brezinys: stulpeliuVeiksmas(a, b, '+'),
      }),

    // 2. Kiek vienetų gaunasi
    () =>
      uzdavinys('sudetis-stulpeliu', {
        klausimas: 'Kiek gaunasi sudėjus vienetus?',
        atsakymas: String(v + b),
        atsakymasRodymui: `$${v + b}$`,
        sprendimas: `Vienetai yra ${v} ir ${b}: $${v} + ${b} = ${v + b}$.`,
        brezinys: stulpeliuVeiksmas(a, b, '+'),
      }),

    // 3. Koks skaitmuo rašomas po vienetais
    () =>
      uzdavinys('sudetis-stulpeliu', {
        klausimas: 'Koks skaitmuo rašomas vienetų vietoje?',
        atsakymas: String((v + b) % 10),
        atsakymasRodymui: `$${(v + b) % 10}$`,
        sprendimas: `$${v} + ${b} = ${v + b}$, tad vienetų vietoje rašome ${(v + b) % 10}, o dešimtį perkeliame.`,
        brezinys: stulpeliuVeiksmas(a, b, '+'),
      }),

    // 4. Kiek dešimčių bus sumoje
    () =>
      uzdavinys('sudetis-stulpeliu', {
        klausimas: 'Kiek dešimčių bus sumoje?',
        atsakymas: String(d + 1),
        atsakymasRodymui: `$${d + 1}$`,
        sprendimas: `Buvo ${d} dešimtys, o iš vienetų susidarė dar viena: $${d} + 1 = ${d + 1}$.`,
        brezinys: stulpeliuVeiksmas(a, b, '+'),
      }),

    // 5. Pasirinkimas — kur klaida
    () => {
      const klaida = suma - 10
      if (klaida <= 0) return null
      return pasirinkimoUzdavinys(naujasId('sudetis-stulpeliu'), 'sudetis-stulpeliu', {
        klausimas: `Kuris atsakymas teisingas: $${a} + ${b}$?`,
        variantai: [String(suma), String(klaida), String(suma + 1)],
        teisingas: 0,
        sprendimas: `Neužmiršk perkeltos dešimties: $${a} + ${b} = ${suma}$.`,
      })
    },
  ])
}

// ── 8.5 Kaip sudėti du dviženklius skaičius? ────────────────────────────────

const A_DU_DV = [
  {
    klausimas: 'Apskaičiuok: $32 + 45$',
    atsakymas: '77',
    atsakymasRodymui: '$77$',
    sprendimas: 'Dešimtys: $30 + 40 = 70$. Vienetai: $2 + 5 = 7$. Iš viso 77.',
  },
] as const

export const duDvizenkliai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDuDvizenklius(sritis), A_DU_DV, 'du-dvizenkliai')

function kurkDuDvizenklius(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  // Be perėjimo per dešimtį: pirmoje klasėje sudedamos atskirai dešimtys ir
  // atskirai vienetai, o perkėlimas mokomas tik su vienaženkliu.
  const aD = atsitiktinis(1, 4)
  const aV = atsitiktinis(1, 4)
  const bD = atsitiktinis(1, Math.min(4, 9 - aD))
  const bV = atsitiktinis(1, 9 - aV)
  const a = aD * 10 + aV
  const b = bD * 10 + bV
  if (a + b > maks) return null
  const suma = a + b

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('du-dvizenkliai', {
        klausimas: `Apskaičiuok: $${a} + ${b}$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Dešimtys: $${aD * 10} + ${bD * 10} = ${(aD + bD) * 10}$. Vienetai: $${aV} + ${bV} = ${aV + bV}$. Iš viso ${suma}.`,
      }),

    // 2. Kiek dešimčių
    () =>
      uzdavinys('du-dvizenkliai', {
        klausimas: `Sudedame $${a} + ${b}$. Kiek gaunasi sudėjus dešimtis?`,
        atsakymas: String((aD + bD) * 10),
        atsakymasRodymui: `$${(aD + bD) * 10}$`,
        sprendimas: `$${aD * 10} + ${bD * 10} = ${(aD + bD) * 10}$.`,
      }),

    // 3. Kubeliai dviejose dėžėse
    () =>
      uzdavinys('du-dvizenkliai', {
        klausimas: `Vienoje dėžėje ${a} ${derink(a, { vns: 'kubelis', dgs: 'kubeliai', kilm: 'kubelių' })}, kitoje — ${b}. Kiek kubelių iš viso?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      }),

    // 4. Knygos dviejose lentynose
    () =>
      uzdavinys('du-dvizenkliai', {
        klausimas: `Pirmoje lentynoje ${a} ${derink(a, { vns: 'knyga', dgs: 'knygos', kilm: 'knygų' })}, antroje — ${b}. Kiek knygų abiejose lentynose?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      }),

    // 5. Pasirinkimas
    () => {
      const netiesos = [...new Set([suma + 10, suma - 10, suma + 1])].filter(
        (x) => x > 0 && x !== suma && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('du-dvizenkliai'), 'du-dvizenkliai', {
        klausimas: `Pasirink teisingą atsakymą: $${a} + ${b}$`,
        variantai: [String(suma), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} + ${b} = ${suma}$.`,
      })
    },
  ])
}

// ── 8.6 Kaip iš dviženklio atimti vienaženklį? ──────────────────────────────

const A_DV_MINUS_V = [
  {
    klausimas: 'Apskaičiuok: $67 - 4$',
    atsakymas: '63',
    atsakymasRodymui: '$63$',
    sprendimas: 'Dešimtys lieka, atimame vienetus: $7 - 4 = 3$, tad 63.',
  },
] as const

export const dvizenklisMinusVienazenklis: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDvMinusV(sritis), A_DV_MINUS_V, 'dvizenklis-minus-vienazenklis')

function kurkDvMinusV(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(21, Math.min(maks, 99))
  const v = a % 10
  if (v < 1) return null
  const b = atsitiktinis(1, v)
  const sk = a - b

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('dvizenklis-minus-vienazenklis', {
        klausimas: `Apskaičiuok: $${a} - ${b}$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Dešimtys lieka, atimame vienetus: $${v} - ${b} = ${v - b}$, tad ${sk}.`,
      }),

    // 2. Užbaigimas
    () =>
      uzdavinys('dvizenklis-minus-vienazenklis', {
        klausimas: `Užbaik: $${a} - ${b} = \\square$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      }),

    // 3. Lipdukai
    () =>
      uzdavinys('dvizenklis-minus-vienazenklis', {
        klausimas: `Buvo ${a} ${derink(a, { vns: 'lipdukas', dgs: 'lipdukai', kilm: 'lipdukų' })}. ${pasirink(VARDAI)} atidavė ${b}. Kiek liko?`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      }),

    // 4. Pieštukai
    () =>
      uzdavinys('dvizenklis-minus-vienazenklis', {
        klausimas: `Dėžėje ${a} ${derink(a, { vns: 'pieštukas', dgs: 'pieštukai', kilm: 'pieštukų' })}. ${pasirink(VARDAI)} paėmė ${b}. Kiek liko?`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      }),

    // 5. Pasirinkimas
    () => {
      const netiesos = [...new Set([sk + 1, sk - 1, a + b])].filter(
        (x) => x > 0 && x !== sk && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(
        naujasId('dvizenklis-minus-vienazenklis'),
        'dvizenklis-minus-vienazenklis',
        {
          klausimas: `Pasirink teisingą atsakymą: $${a} - ${b}$`,
          variantai: [String(sk), ...netiesos.slice(0, 2).map(String)],
          teisingas: 0,
          sprendimas: `$${a} - ${b} = ${sk}$.`,
        },
      )
    },
  ])
}

// ── 8.7 Atimtis eilute išardant dešimtį ─────────────────────────────────────

const A_EILUTE_MINUS = [
  {
    klausimas: 'Apskaičiuok: $42 - 7$',
    atsakymas: '35',
    atsakymasRodymui: '$35$',
    sprendimas: '$42 - 2 = 40$, liko atimti 5: $40 - 5 = 35$.',
  },
] as const

export const atimtisEilutePerDesimti: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkEiluteMinus(sritis), A_EILUTE_MINUS, 'atimtis-eilute-per-desimti')

/** Pora, kurioje atėminys didesnis už turinio vienetus — dešimtį tenka ardyti. */
function atimtisSuArdymu(maks: number): [number, number] | null {
  const a = atsitiktinis(21, Math.min(maks, 98))
  const v = a % 10
  if (v > 7) return null
  const b = atsitiktinis(v + 1, 9)
  if (b > a) return null
  return [a, b]
}

function kurkEiluteMinus(sritis?: Sritis | null): Uzdavinys | null {
  const pora = atimtisSuArdymu(riba(sritis))
  if (!pora) return null
  const [a, b] = pora
  const sk = a - b
  const v = a % 10
  const desimtis = a - v
  const po10 = b - v

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('atimtis-eilute-per-desimti', {
        klausimas: `Apskaičiuok eilute: $${a} - ${b}$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${v} = ${desimtis}$, liko atimti ${po10}: $${desimtis} - ${po10} = ${sk}$.`,
      }),

    // 2. Skaidymas parodytas
    () =>
      uzdavinys('atimtis-eilute-per-desimti', {
        klausimas: `Užbaik: $${a} - ${b} = ${a} - ${v} - \\square$`,
        atsakymas: String(po10),
        atsakymasRodymui: `$${po10}$`,
        sprendimas: `${b} skaidome į ${v} ir ${po10}: pirma nusileidžiame iki ${desimtis}.`,
      }),

    // 3. Kiek atimti iki pilnos dešimties
    () =>
      uzdavinys('atimtis-eilute-per-desimti', {
        klausimas: `Kiek reikia atimti iš ${a}, kad liktų ${desimtis}?`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$`,
        sprendimas: `$${a} - ${desimtis} = ${v}$.`,
      }),

    // 4. Nuo dešimties toliau
    () =>
      uzdavinys('atimtis-eilute-per-desimti', {
        klausimas: `Nusileisk iki dešimties ir užbaik: $${a} - ${b} = ${desimtis} - \\square$`,
        atsakymas: String(po10),
        atsakymasRodymui: `$${po10}$`,
        sprendimas: `Iš ${b} panaudojome ${v}, liko ${po10}, tad $${desimtis} - ${po10} = ${sk}$.`,
      }),

    // 5. Pasirinkimas
    () => {
      const netiesos = [...new Set([sk + 1, sk - 1, desimtis])].filter(
        (x) => x > 0 && x !== sk,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(
        naujasId('atimtis-eilute-per-desimti'),
        'atimtis-eilute-per-desimti',
        {
          klausimas: `Pasirink teisingą atsakymą: $${a} - ${b}$`,
          variantai: [String(sk), ...netiesos.slice(0, 2).map(String)],
          teisingas: 0,
          sprendimas: `$${a} - ${v} = ${desimtis}$, tada $${desimtis} - ${po10} = ${sk}$.`,
        },
      )
    },
  ])
}

// ── 8.8 Atimtis stulpeliu išardant dešimtį ──────────────────────────────────

const A_STULPELIU_MINUS = [
  {
    klausimas: 'Apskaičiuok stulpeliu: $62 - 8$',
    atsakymas: '54',
    atsakymasRodymui: '$54$',
    sprendimas: 'Vienetų neužtenka, tad skolinamės dešimtį: $12 - 8 = 4$, lieka 5 dešimtys.',
  },
] as const

export const atimtisStulpeliu: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkStulpeliuMinus(sritis), A_STULPELIU_MINUS, 'atimtis-stulpeliu')

function kurkStulpeliuMinus(sritis?: Sritis | null): Uzdavinys | null {
  const pora = atimtisSuArdymu(riba(sritis))
  if (!pora) return null
  const [a, b] = pora
  const sk = a - b
  const v = a % 10
  const d = Math.floor(a / 10)

  return variacija([
    // 1. Suskaičiuok stulpeliu
    () =>
      uzdavinys('atimtis-stulpeliu', {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Vienetų neužtenka (${v} mažiau nei ${b}), tad skolinamės dešimtį: $${v + 10} - ${b} = ${v + 10 - b}$, o dešimčių lieka ${d - 1}.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),

    // 2. Ar užtenka vienetų
    () =>
      pasirinkimoUzdavinys(naujasId('atimtis-stulpeliu'), 'atimtis-stulpeliu', {
        klausimas: 'Ar užtenka vienetų, ar reikia skolintis dešimtį?',
        variantai: ['reikia skolintis dešimtį', 'vienetų užtenka', 'vienetų nereikia'],
        teisingas: 0,
        sprendimas: `Vienetų yra ${v}, o atimti reikia ${b} — tad viena dešimtis išardoma.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),

    // 3. Kiek vienetų po skolinimosi
    () =>
      uzdavinys('atimtis-stulpeliu', {
        klausimas: 'Kiek vienetų gaunasi išardžius dešimtį?',
        atsakymas: String(v + 10 - b),
        atsakymasRodymui: `$${v + 10 - b}$`,
        sprendimas: `Išardę dešimtį turime ${v + 10} vienetų: $${v + 10} - ${b} = ${v + 10 - b}$.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),

    // 4. Kiek dešimčių lieka
    () =>
      uzdavinys('atimtis-stulpeliu', {
        klausimas: 'Kiek dešimčių lieka?',
        atsakymas: String(d - 1),
        atsakymasRodymui: `$${d - 1}$`,
        sprendimas: `Iš ${d} dešimčių vieną išardėme, tad liko ${d - 1}.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),

    // 5. Kur klaida
    () => {
      const klaida = a - b + 10
      return pasirinkimoUzdavinys(naujasId('atimtis-stulpeliu'), 'atimtis-stulpeliu', {
        klausimas: `Kuris atsakymas teisingas: $${a} - ${b}$?`,
        variantai: [String(sk), String(klaida), String(sk - 1)],
        teisingas: 0,
        sprendimas: `Neužmiršk, kad viena dešimtis buvo išardyta: $${a} - ${b} = ${sk}$.`,
      })
    },
  ])
}

// ── 8.9 Kaip atimti dviženklį skaičių? ──────────────────────────────────────

const A_DV_MINUS_DV = [
  {
    klausimas: 'Apskaičiuok: $76 - 24$',
    atsakymas: '52',
    atsakymasRodymui: '$52$',
    sprendimas: 'Dešimtys: $70 - 20 = 50$. Vienetai: $6 - 4 = 2$. Iš viso 52.',
  },
] as const

export const dvizenkliuAtimtis: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDvMinusDv(sritis), A_DV_MINUS_DV, 'dvizenkliu-atimtis')

function kurkDvMinusDv(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  // Be dešimties ardymo: atimamo skaičiaus skyriai ne didesni už turinio.
  const aD = atsitiktinis(4, 9)
  const aV = atsitiktinis(2, 9)
  const bD = atsitiktinis(1, aD - 1)
  const bV = atsitiktinis(1, aV)
  const a = aD * 10 + aV
  const b = bD * 10 + bV
  if (a > maks) return null
  const sk = a - b

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('dvizenkliu-atimtis', {
        klausimas: `Apskaičiuok: $${a} - ${b}$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Dešimtys: $${aD * 10} - ${bD * 10} = ${(aD - bD) * 10}$. Vienetai: $${aV} - ${bV} = ${aV - bV}$. Iš viso ${sk}.`,
      }),

    // 2. Kiek dešimčių
    () =>
      uzdavinys('dvizenkliu-atimtis', {
        klausimas: `Atimame $${a} - ${b}$. Kiek gaunasi atėmus dešimtis?`,
        atsakymas: String((aD - bD) * 10),
        atsakymasRodymui: `$${(aD - bD) * 10}$`,
        sprendimas: `$${aD * 10} - ${bD * 10} = ${(aD - bD) * 10}$.`,
      }),

    // 3. Knygos
    () =>
      uzdavinys('dvizenkliu-atimtis', {
        klausimas: `Buvo ${a} ${derink(a, { vns: 'knyga', dgs: 'knygos', kilm: 'knygų' })}. Mokiniai paėmė ${b}. Kiek liko?`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      }),

    // 4. Dėžės sandėlyje
    () =>
      uzdavinys('dvizenkliu-atimtis', {
        klausimas: `Sandėlyje buvo ${a} ${derink(a, { vns: 'dėžė', dgs: 'dėžės', kilm: 'dėžių' })}. Išvežė ${b}. Kiek dėžių liko?`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      }),

    // 5. Pasirinkimas
    () => {
      const netiesos = [...new Set([sk + 10, sk - 10, sk + 1])].filter(
        (x) => x > 0 && x !== sk && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('dvizenkliu-atimtis'), 'dvizenkliu-atimtis', {
        klausimas: `Pasirink teisingą atsakymą: $${a} - ${b}$`,
        variantai: [String(sk), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} - ${b} = ${sk}$.`,
      })
    },
  ])
}

// ── 8.10 ir 8.11 Uždavinio vaizdavimas schema ───────────────────────────────


const A_SCHEMA_PLIUS = [
  {
    klausimas: 'Matas turi 24 korteles, Ieva — 13. Ko ieškoma šioje schemoje?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — kiek kortelių jie turi kartu',
    sprendimas: 'Abi dalys žinomos, o tuščias langelis yra visuma.',
  },
] as const

export const sudetiesSchema: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSudetiesSchema(sritis), A_SCHEMA_PLIUS, 'sudeties-schema')

function kurkSudetiesSchema(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(11, 45)
  const b = atsitiktinis(11, 45)
  if (a + b > maks) return null
  const [v1, v2] = sumaisyk([...VARDAI]).slice(0, 2)

  return variacija([
    // 1. Ko ieškoma schemoje
    () =>
      pasirinkimoUzdavinys(naujasId('sudeties-schema'), 'sudeties-schema', {
        klausimas: `${v1} turi ${a} korteles, ${v2} — ${b}. Ko ieškoma šioje schemoje?`,
        variantai: ['kiek kortelių jie turi kartu', `kiek kortelių turi ${v1}`, 'kas turi daugiau'],
        teisingas: 0,
        sprendimas: 'Abi dalys žinomos, o tuščias langelis viršuje yra visuma — kiek yra kartu.',
        brezinys: juostineSchema(null, a, b),
      }),

    // 2. Koks skaičius įrašomas
    () =>
      uzdavinys('sudeties-schema', {
        klausimas: 'Koks skaičius turi būti vietoj klaustuko?',
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Visuma yra abiejų dalių suma: $${a} + ${b} = ${a + b}$.`,
        brezinys: juostineSchema(null, a, b),
      }),

    // 3. Kuris uždavinys tinka schemai
    () =>
      pasirinkimoUzdavinys(naujasId('sudeties-schema'), 'sudeties-schema', {
        klausimas: 'Kuris uždavinys tinka šiai schemai?',
        variantai: [
          `Vienoje dėžėje ${a} obuoliai, kitoje ${b}. Kiek obuolių iš viso?`,
          `Buvo ${a + b} obuoliai, ${b} suvalgė. Kiek liko?`,
          `Buvo ${a} obuoliai, ${b} supuvo. Kiek liko?`,
        ],
        teisingas: 0,
        sprendimas: 'Schemoje žinomos abi dalys, o ieškoma visumos — tai sudėties uždavinys.',
        brezinys: juostineSchema(null, a, b),
      }),

    // 4. Koks klausimas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('sudeties-schema'), 'sudeties-schema', {
        klausimas: `Vienoje dėžėje ${a} obuoliai, kitoje ${b}. Kuris klausimas tinka schemai?`,
        variantai: ['Kiek obuolių iš viso?', 'Kiek obuolių liko?', 'Kurioje dėžėje mažiau?'],
        teisingas: 0,
        sprendimas: 'Tuščias langelis yra visuma, tad klausiama, kiek yra iš viso.',
        brezinys: juostineSchema(null, a, b),
      }),

    // 5. Kokiu veiksmu sprendžiama
    () =>
      pasirinkimoUzdavinys(naujasId('sudeties-schema'), 'sudeties-schema', {
        klausimas: 'Kokiu veiksmu randama visuma, kai žinomos abi dalys?',
        variantai: ['sudėtimi', 'atimtimi', 'palyginimu'],
        teisingas: 0,
        sprendimas: 'Dalys sudedamos — taip gaunama visuma.',
        brezinys: juostineSchema(null, a, b),
      }),
  ])
}

const A_SCHEMA_MINUS = [
  {
    klausimas: 'Buvo 48 balionai, 15 sprogo. Ko ieškoma šioje schemoje?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — kiek balionų liko',
    sprendimas: 'Visuma ir viena dalis žinomos, o ieškoma kitos dalies.',
  },
] as const

export const atimtiesSchema: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkAtimtiesSchema(sritis), A_SCHEMA_MINUS, 'atimties-schema')

function kurkAtimtiesSchema(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const visuma = atsitiktinis(30, Math.min(maks, 90))
  const dalis = atsitiktinis(10, visuma - 10)

  return variacija([
    // 1. Ko ieškoma schemoje
    () =>
      pasirinkimoUzdavinys(naujasId('atimties-schema'), 'atimties-schema', {
        klausimas: `Buvo ${visuma} balionai, ${dalis} sprogo. Ko ieškoma šioje schemoje?`,
        variantai: ['kiek balionų liko', 'kiek balionų buvo', 'kiek balionų sprogo'],
        teisingas: 0,
        sprendimas: 'Visuma ir viena dalis žinomos, tad ieškoma kitos dalies — kiek liko.',
        brezinys: juostineSchema(visuma, dalis, null),
      }),

    // 2. Koks skaičius įrašomas
    () =>
      uzdavinys('atimties-schema', {
        klausimas: 'Koks skaičius turi būti vietoj klaustuko?',
        atsakymas: String(visuma - dalis),
        atsakymasRodymui: `$${visuma - dalis}$`,
        sprendimas: `Iš visumos atimame žinomą dalį: $${visuma} - ${dalis} = ${visuma - dalis}$.`,
        brezinys: juostineSchema(visuma, dalis, null),
      }),

    // 3. Kuris uždavinys tinka
    () =>
      pasirinkimoUzdavinys(naujasId('atimties-schema'), 'atimties-schema', {
        klausimas: 'Kuris uždavinys tinka šiai schemai?',
        variantai: [
          `Lentynoje ${visuma} knygos, ${dalis} paėmė. Kiek liko?`,
          `Vienoje lentynoje ${visuma} knygos, kitoje ${dalis}. Kiek iš viso?`,
          `Lentynoje ${visuma} knygos. Padėjo dar ${dalis}. Kiek dabar?`,
        ],
        teisingas: 0,
        sprendimas: 'Schemoje žinoma visuma ir viena dalis — tai atimties uždavinys.',
        brezinys: juostineSchema(visuma, dalis, null),
      }),

    // 4. Koks klausimas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('atimties-schema'), 'atimties-schema', {
        klausimas: `Lentynoje buvo ${visuma} knygos, ${dalis} paėmė. Kuris klausimas tinka schemai?`,
        variantai: ['Kiek knygų liko?', 'Kiek knygų buvo iš viso?', 'Kiek lentynų yra?'],
        teisingas: 0,
        sprendimas: 'Tuščias langelis yra viena iš dalių, tad klausiama, kiek liko.',
        brezinys: juostineSchema(visuma, dalis, null),
      }),

    // 5. Kokiu veiksmu sprendžiama
    () =>
      pasirinkimoUzdavinys(naujasId('atimties-schema'), 'atimties-schema', {
        klausimas: 'Kokiu veiksmu randama dalis, kai žinoma visuma ir kita dalis?',
        variantai: ['atimtimi', 'sudėtimi', 'palyginimu'],
        teisingas: 0,
        sprendimas: 'Iš visumos atimama žinoma dalis — lieka ieškomoji.',
        brezinys: juostineSchema(visuma, dalis, null),
      }),
  ])
}
