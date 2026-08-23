import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { D, VARDAI, kiek } from './ketvirtokams-bendra'
import {
  type FiguraRusis,
  type KampoRusis,
  Lfigura,
  brezinukuEileSuRaidemis,
  dvieluStaciakampiuFigura,
  figuruEile,
  krastiniuSkaicius,
  langeliuFigura,
  lygumoPora,
  patalposPlanas,
  suKampais,
  trikampisPagalKampus,
} from './ketvirtokams-ploto-vaizdai'
import { trikampisSuMatais } from './treciokams-matai-vaizdai'
import { type Figura, figuruSeka } from './treciokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Plokščiosios figūros. Plotas“ — vienuolika potemių.
 *
 * Anksčiau jos rėmėsi `figuros`, `kampai`, `perimetras` ir `plotas-turis`
 * generatoriais, kurie skirti 6–9 klasėms: pasitaikydavo apskritimo ploto,
 * trikampio aukštinės ir kvadratinių šaknų.
 *
 * Tema turi dvi puses. Pirmosios penkios potemės yra apie atpažinimą — ir jose
 * kone visada yra brėžinys, nes klausimas „kuris trikampis bukasis“ be jo
 * neturi turinio. Likusios šešios — apie skaičiavimą, ir jose brėžinys pateikia
 * matmenis, bet niekada neužrašo paties ploto.
 */

const FIGURU_VARDAI: Record<FiguraRusis, { v: string; kilm: string }> = {
  trikampis: { v: 'trikampis', kilm: 'trikampio' },
  kvadratas: { v: 'kvadratas', kilm: 'kvadrato' },
  staciakampis: { v: 'stačiakampis', kilm: 'stačiakampio' },
  apskritimas: { v: 'apskritimas', kilm: 'apskritimo' },
  penkiakampis: { v: 'penkiakampis', kilm: 'penkiakampio' },
  sesiakampis: { v: 'šešiakampis', kilm: 'šešiakampio' },
  rombas: { v: 'rombas', kilm: 'rombo' },
  trapecija: { v: 'trapecija', kilm: 'trapecijos' },
  ovalas: { v: 'ovalas', kilm: 'ovalo' },
}

const RAIDES = ['A', 'B', 'C', 'D', 'E'] as const

// ── 3.1 Ką žinau apie plokščiąsias figūras? ─────────────────────────────────

const T1 = 'plokstumos-figuros'

const A_FIGUROS = [
  {
    klausimas: 'Kiek kraštinių turi trikampis?',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Trikampio pavadinime jau pasakyta: trys kampai ir trys kraštinės.',
  },
] as const

export const plokstumosFiguros: Generatorius = () => suBandymais(kurkFiguras, A_FIGUROS, T1)

function kurkFiguras(): Uzdavinys | null {
  const rinkinys = sumaisyk<FiguraRusis>([
    'trikampis',
    'kvadratas',
    'staciakampis',
    'apskritimas',
    'penkiakampis',
    'sesiakampis',
    'rombas',
    'trapecija',
  ])

  return variacija([
    // 1. Susieti pavadinimą su figūra
    () => {
      const keturios = rinkinys.slice(0, 4)
      return poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Susiek figūros raidę su jos pavadinimu.',
        poros: keturios.map((f, i) => ({
          kaire: RAIDES[i],
          desine: FIGURU_VARDAI[f].v,
        })),
        sprendimas: 'Figūros skiriamos pagal kraštinių skaičių; apskritimas kraštinių neturi.',
        brezinys: figuruEile(keturios),
      })
    },

    // 2. Kuri figūra turi keturias lygias kraštines
    () => {
      const su = pasirink<FiguraRusis>(['kvadratas', 'rombas'])
      const kitos = rinkinys.filter((f) => f !== 'kvadratas' && f !== 'rombas').slice(0, 3)
      const visos = sumaisyk([su, ...kitos])
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuri iš pavaizduotų figūrų turi keturias lygias kraštines?',
        variantai: visos.map((_, i) => RAIDES[i]),
        teisingas: visos.indexOf(su),
        sprendimas: `Tai ${FIGURU_VARDAI[su].v} — jo visos keturios kraštinės vienodo ilgio.`,
        brezinys: figuruEile(visos),
      })
    },

    // 3. Kuri figūra neturi kampų
    () => {
      const kampuotos = rinkinys.filter(suKampais).slice(0, 3)
      const visos = sumaisyk<FiguraRusis>([...kampuotos, 'apskritimas'])
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuri iš pavaizduotų figūrų neturi nė vieno kampo?',
        variantai: visos.map((_, i) => RAIDES[i]),
        teisingas: visos.findIndex((f) => !suKampais(f)),
        sprendimas: 'Apskritimo kontūras yra kreivė — jame nėra nė vienos vietos, kur susieitų dvi kraštinės.',
        brezinys: figuruEile(visos),
      })
    },

    // 4. Kiek iš viso kampų
    () => {
      const dvi = rinkinys.filter(suKampais).slice(0, 2)
      const viso = dvi.reduce((s, f) => s + krastiniuSkaicius(f), 0)
      return uzdavinys(T1, {
        klausimas: `Kiek iš viso kampų turi ${FIGURU_VARDAI[dvi[0]].v} ir ${FIGURU_VARDAI[dvi[1]].v} kartu?`,
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${krastiniuSkaicius(dvi[0])} + ${krastiniuSkaicius(dvi[1])} = ${viso}$.`,
      })
    },

    // 5. Kiek kampuotų figūrų rinkinyje
    () => {
      const astuonios = sumaisyk<FiguraRusis>([
        'trikampis',
        'kvadratas',
        'staciakampis',
        'apskritimas',
        'penkiakampis',
        'ovalas',
        'rombas',
        'trapecija',
      ])
      const kampuotu = astuonios.filter(suKampais).length
      return uzdavinys(T1, {
        klausimas: 'Kiek pavaizduotų figūrų yra kampuotos?',
        atsakymas: String(kampuotu),
        atsakymasRodymui: `$${kampuotu}$`,
        sprendimas: 'Kampuotos yra visos, kurių kontūrą sudaro tiesios kraštinės; apskritimas ir ovalas kampų neturi.',
        brezinys: figuruEile(astuonios),
      })
    },

    // 6. Kvadratas ir stačiakampis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuris teiginys teisingas?',
        variantai: [
          'Visi kvadratai yra stačiakampiai',
          'Visi stačiakampiai yra kvadratai',
          'Kvadratas ir stačiakampis niekada nesutampa',
          'Kvadratas turi daugiau kraštinių nei stačiakampis',
        ],
        teisingas: 0,
        sprendimas:
          'Stačiakampis yra keturkampis su keturiais stačiais kampais. Kvadratas juos turi, tad kiekvienas kvadratas yra stačiakampis, o atvirkščiai — ne, nes stačiakampio kraštinės gali būti skirtingo ilgio.',
      }),

    // 7. Figūra pagal kraštinių skaičių
    () => {
      const kiekKrastiniu = pasirink([3, 4, 5, 6])
      const tinkama = rinkinys.find((f) => krastiniuSkaicius(f) === kiekKrastiniu)
      if (!tinkama) return null
      const kitos = sumaisyk(rinkinys.filter((f) => krastiniuSkaicius(f) !== kiekKrastiniu)).slice(0, 3)
      const visos = sumaisyk<FiguraRusis>([tinkama, ...kitos])
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Kuri figūra turi lygiai ${kiekKrastiniu} kraštines ir ${kiekKrastiniu} kampus?`,
        variantai: visos.map((_, i) => RAIDES[i]),
        teisingas: visos.indexOf(tinkama),
        sprendimas: `Tai ${FIGURU_VARDAI[tinkama].v}.`,
        brezinys: figuruEile(visos),
      })
    },
  ])
}

// ── 3.2 Kaip sudarytos objektų sekos? ───────────────────────────────────────

const T2 = 'objektu-sekos-4'

const A_SEKOS = [
  {
    klausimas: 'Seka: kvadratas, trikampis, kvadratas, trikampis, … Kokia figūra bus penkta?',
    atsakymas: 'kvadratas',
    atsakymasRodymui: 'kvadratas',
    sprendimas: 'Kartojasi dviejų figūrų grupė, tad penkta vėl kvadratas.',
  },
] as const

export const objektuSekos4: Generatorius = () => suBandymais(kurkObjektuSekas, A_SEKOS, T2)

const SEKOS_FIGUROS: readonly Figura[] = ['trikampis', 'kvadratas', 'apskritimas']

function kurkObjektuSekas(): Uzdavinys | null {
  const grupe = sumaisyk([...SEKOS_FIGUROS]).slice(0, atsitiktinis(2, 3))
  const nariai: Figura[] = []
  for (let i = 0; i < 7; i += 1) nariai.push(grupe[i % grupe.length])

  return variacija([
    // 1. Kokia figūra toliau
    () => {
      const kiekRodoma = grupe.length * 2
      const kita = nariai[kiekRodoma]
      const variantai = sumaisyk([...SEKOS_FIGUROS])
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kokia figūra turėtų būti klaustuko vietoje?',
        variantai: variantai.map((f) => FIGURU_VARDAI[f as FiguraRusis].v),
        teisingas: variantai.indexOf(kita),
        sprendimas: `Kartojasi ${grupe.length} figūrų grupė, tad po jos vėl eina ${FIGURU_VARDAI[kita as FiguraRusis].v}.`,
        brezinys: figuruSeka(nariai.slice(0, kiekRodoma), 1),
      })
    },

    // 2. Grupės ilgis
    () =>
      uzdavinys(T2, {
        klausimas: 'Iš kelių figūrų sudaryta besikartojanti sekos grupė?',
        atsakymas: String(grupe.length),
        atsakymasRodymui: `$${grupe.length}$`,
        sprendimas: 'Ieškoma trumpiausio gabalo, kuris sekoje kartojasi nuo pradžios iki galo.',
        brezinys: figuruSeka(nariai.slice(0, 6), 0),
      }),

    // 3. Kelinta figūra bus nurodyta
    () => {
      const vieta = atsitiktinis(9, 20)
      return kelintaFigura(vieta, grupe[(vieta - 1) % grupe.length], grupe, nariai)
    },

    // 4. Auganti seka — kiek kvadratėlių kitoje figūroje
    () => {
      const pradzia = atsitiktinis(2, 4)
      const zingsnis = atsitiktinis(2, 3)
      const kelinta = atsitiktinis(5, 8)
      return uzdavinys(T2, {
        klausimas: `Sekos figūros sudarytos iš kvadratėlių: pirmoje jų ${pradzia}, antroje ${pradzia + zingsnis}, trečioje ${pradzia + 2 * zingsnis}. Kiek kvadratėlių turės ${kelinta}-oji figūra?`,
        atsakymas: String(pradzia + (kelinta - 1) * zingsnis),
        atsakymasRodymui: `$${pradzia + (kelinta - 1) * zingsnis}$`,
        sprendimas: `Kaskart pridedama po ${zingsnis}, tad ${kelinta}-oje figūroje $${pradzia} + ${kelinta - 1} \\cdot ${zingsnis} = ${pradzia + (kelinta - 1) * zingsnis}$.`,
      })
    },

    // 5. Klaida sekoje
    () => {
      const sugadinti = [...nariai.slice(0, 6)]
      const vieta = grupe.length + atsitiktinis(0, grupe.length - 1)
      const kita = SEKOS_FIGUROS.find((f) => f !== sugadinti[vieta])
      if (!kita) return null
      const teisinga = sugadinti[vieta]
      sugadinti[vieta] = kita
      return klaidaSekoje(teisinga, sugadinti)
    },

    // 6. Kuri seka auga greičiau
    () => {
      const zA = atsitiktinis(1, 2)
      const zB = zA + atsitiktinis(1, 3)
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Seka A prasideda 3 kvadratėliais ir kaskart auga po ${zA}, seka B prasideda 3 ir auga po ${zB}. Kurioje sekoje penktoji figūra didesnė?`,
        variantai: ['B', 'A', 'figūros vienodo dydžio'],
        teisingas: 0,
        sprendimas: `A penktoji: $3 + 4 \\cdot ${zA} = ${3 + 4 * zA}$; B penktoji: $3 + 4 \\cdot ${zB} = ${3 + 4 * zB}$.`,
      })
    },

    // 7. Kiek kartų grupė pasikartos
    () => {
      const nariu = grupe.length * atsitiktinis(3, 6)
      return uzdavinys(T2, {
        klausimas: `Sekoje kartojasi ${grupe.length} figūrų grupė. Kiek kartų ji pasikartos, jei iš viso surašyta ${kiek(nariu, D.nariai)}?`,
        atsakymas: String(nariu / grupe.length),
        atsakymasRodymui: `$${nariu / grupe.length}$`,
        sprendimas: `$${nariu} : ${grupe.length} = ${nariu / grupe.length}$.`,
      })
    },
  ])
}

/** Pasirenkamasis uždavinys su teisingu variantu — atskirai, kad indeksas būtų tikras. */
function kelintaFigura(
  vieta: number,
  kuri: Figura,
  grupe: readonly Figura[],
  nariai: readonly Figura[],
): Uzdavinys {
  const variantai = sumaisyk([...SEKOS_FIGUROS])
  return pasirinkimoUzdavinys(naujasId(T2), T2, {
    klausimas: `Kokia figūra bus ${vieta}-oji, jei seka tęsiama toliau?`,
    variantai: variantai.map((f) => FIGURU_VARDAI[f as FiguraRusis].v),
    teisingas: variantai.indexOf(kuri),
    sprendimas: `Grupėje ${grupe.length} figūros. $${vieta} : ${grupe.length}$ duoda liekaną ${((vieta - 1) % grupe.length) + 1}, tad tai grupės ${((vieta - 1) % grupe.length) + 1}-oji figūra.`,
    brezinys: figuruSeka(nariai.slice(0, 6), 0),
  })
}

function klaidaSekoje(teisinga: Figura, sugadinti: readonly Figura[]): Uzdavinys {
  const variantai = sumaisyk([...SEKOS_FIGUROS])
  return pasirinkimoUzdavinys(naujasId(T2), T2, {
    klausimas: 'Viena sekos figūra neatitinka taisyklės. Kokia figūra jos vietoje turi būti?',
    variantai: variantai.map((f) => FIGURU_VARDAI[f as FiguraRusis].v),
    teisingas: variantai.indexOf(teisinga),
    sprendimas: 'Sekoje kartojasi ta pati figūrų grupė — narys, kuris ją nutraukia, ir yra klaidingas.',
    brezinys: figuruSeka(sugadinti, 0),
  })
}

// ── 3.3 Ką vadiname lygiomis figūromis? ─────────────────────────────────────

const T3 = 'lygios-figuros'

const A_LYGIOS = [
  {
    klausimas: 'Ar pasukta figūra lieka lygi pradinei?',
    atsakymas: 'taip',
    atsakymasRodymui: 'taip',
    sprendimas: 'Pasukus nesikeičia nei kraštinių ilgiai, nei kampai, tad figūros sutampa uždėtos viena ant kitos.',
  },
] as const

export const lygiosFiguros: Generatorius = () => suBandymais(kurkLygias, A_LYGIOS, T3)

function kurkLygias(): Uzdavinys | null {
  return variacija([
    // 1. Pasukta figūra
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ar pavaizduotos figūros lygios?',
        variantai: ['taip, viena tik pasukta', 'ne, jos skirtingo dydžio', 'ne, jų forma skiriasi'],
        teisingas: 0,
        sprendimas: 'Pasukus kraštinių ilgiai ir kampai nesikeičia, tad figūros sutampa uždėtos viena ant kitos.',
        brezinys: lygumoPora('pasukta'),
      }),

    // 2. Kito dydžio figūra
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kodėl šios dvi figūros nėra lygios?',
        variantai: [
          'jų forma ta pati, bet kraštinės skirtingo ilgio',
          'jos pasuktos skirtingai',
          'viena turi daugiau kraštinių',
          'jos nupieštos ne viena šalia kitos',
        ],
        teisingas: 0,
        sprendimas: 'Lygioms figūroms neužtenka vienodos formos — turi sutapti ir visų kraštinių ilgiai.',
        brezinys: lygumoPora('kito-dydzio'),
      }),

    // 3. Atspindėta figūra
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Antroji figūra yra pirmosios atspindys. Ar figūros lygios?',
        variantai: [
          'taip, visos kraštinės ir kampai vienodi',
          'ne, atspindėta figūra visada mažesnė',
          'ne, atspindys pakeičia kraštinių ilgius',
        ],
        teisingas: 0,
        sprendimas: 'Atspindint ilgiai ir kampai nesikeičia, tad figūros lieka lygios.',
        brezinys: lygumoPora('atspindeta'),
      }),

    // 4. Skiriasi viena kraštinė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Figūros iš pirmo žvilgsnio atrodo vienodos. Kas jas skiria?',
        variantai: [
          'vienos kraštinės ilgis',
          'kraštinių skaičius',
          'padėtis lape',
          'niekas — jos yra lygios',
        ],
        teisingas: 0,
        sprendimas: 'Antrojoje figūroje viena kraštinė ilgesnė, tad uždėtos viena ant kitos figūros nesutaptų — jos nėra lygios.',
        brezinys: lygumoPora('kitos-formos'),
      }),

    // 5. Ką reiškia lygios figūros
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kada dvi figūros vadinamos lygiomis?',
        variantai: [
          'kai uždėtos viena ant kitos visiškai sutampa',
          'kai jų forma tokia pati, o dydis gali skirtis',
          'kai jos abi turi tiek pat kraštinių',
          'kai jos nupieštos vienodoje padėtyje',
        ],
        teisingas: 0,
        sprendimas: 'Lygumas reiškia visišką sutapimą: vienodi ir kraštinių ilgiai, ir kampai.',
      }),

    // 6. Ar du vienodų matmenų stačiakampiai lygūs
    () => {
      const a = atsitiktinis(3, 8)
      const b = atsitiktinis(2, 6)
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Vieno stačiakampio kraštinės ${a} cm ir ${b} cm, kito — ${b} cm ir ${a} cm. Ar šie stačiakampiai lygūs?`,
        variantai: [
          'taip, tai tas pats stačiakampis, tik pasuktas',
          'ne, nes matmenys surašyti kita tvarka',
          'ne, nes jų plotai skiriasi',
        ],
        teisingas: 0,
        sprendimas: `Abiejų kraštinės ${a} cm ir ${b} cm, tad pasukus vieną iš jų figūros sutampa. Plotai irgi vienodi: $${a} \\cdot ${b} = ${a * b}$ cm².`,
      })
    },

    // 7. Klaidingas teiginys apie pasukimą
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Mokinys sako: „Pasukta figūra nebėra lygi pradinei.“ Ar jis teisus?',
        variantai: [
          'ne, pasukimas nekeičia nei ilgių, nei kampų',
          'taip, pasukta figūra tampa kita figūra',
          'taip, nes pasikeičia jos plotas',
        ],
        teisingas: 0,
        sprendimas: 'Pasukimas perkelia figūrą į kitą padėtį, bet pačios figūros nekeičia.',
        brezinys: lygumoPora('pasukta'),
      }),
  ])
}

// ── 3.4 Trikampiai pagal kraštinių ilgius ───────────────────────────────────

const T4 = 'trikampiai-pagal-krastines'

const A_KRASTINES = [
  {
    klausimas: 'Kaip vadinamas trikampis, kurio visos kraštinės lygios?',
    atsakymas: 'lygiakraštis',
    atsakymasRodymui: 'lygiakraštis',
    sprendimas: 'Visos trys kraštinės vienodo ilgio — lygiakraštis trikampis.',
  },
] as const

export const trikampiaiPagalKrastines: Generatorius = () =>
  suBandymais(kurkTrikampiusPagalKrastines, A_KRASTINES, T4)

type TrikampioRusis = 'lygiakraštis' | 'lygiašonis' | 'įvairiakraštis'

/** Trys kraštinės, sudarančios nurodytos rūšies trikampį. */
function krastines(rusis: TrikampioRusis): [number, number, number] {
  if (rusis === 'lygiakraštis') {
    const a = atsitiktinis(3, 7)
    return [a, a, a]
  }
  if (rusis === 'lygiašonis') {
    const sonas = atsitiktinis(4, 8)
    const pagrindas = atsitiktinis(3, 2 * sonas - 1)
    return pagrindas === sonas ? [sonas, sonas, sonas - 1] : [sonas, sonas, pagrindas]
  }
  const a = atsitiktinis(4, 6)
  const b = a + atsitiktinis(1, 3)
  const c = b + atsitiktinis(1, 2)
  return [a, b, c]
}

function kurkTrikampiusPagalKrastines(): Uzdavinys | null {
  const rusis = pasirink<TrikampioRusis>(['lygiakraštis', 'lygiašonis', 'įvairiakraštis'])
  const [a, b, c] = krastines(rusis)
  if (a + b <= c) return null

  return variacija([
    // 1. Pavadinimas iš aprašymo
    () => {
      const aprasymas: Record<TrikampioRusis, string> = {
        lygiakraštis: 'visos kraštinės lygios',
        lygiašonis: 'dvi kraštinės lygios, o trečia kitokia',
        įvairiakraštis: 'visos kraštinės skirtingo ilgio',
      }
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kaip vadinamas trikampis, kurio ${aprasymas[rusis]}?`,
        variantai: ['lygiakraštis', 'lygiašonis', 'įvairiakraštis'],
        teisingas: ['lygiakraštis', 'lygiašonis', 'įvairiakraštis'].indexOf(rusis),
        sprendimas: `Pavadinimas nusako kraštinių ilgius: ${aprasymas[rusis]}.`,
      })
    },

    // 2. Rūšis iš brėžinio
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kokios rūšies yra pavaizduotas trikampis pagal kraštinių ilgius?',
        variantai: ['lygiakraštis', 'lygiašonis', 'įvairiakraštis'],
        teisingas: ['lygiakraštis', 'lygiašonis', 'įvairiakraštis'].indexOf(rusis),
        sprendimas: `Kraštinės yra ${a} cm, ${b} cm ir ${c} cm.`,
        brezinys: trikampisSuMatais(a, b, c),
      }),

    // 3. Rūšis iš skaičių
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kokios rūšies trikampis, kurio kraštinės ${a} cm, ${b} cm ir ${c} cm?`,
        variantai: ['lygiakraštis', 'lygiašonis', 'įvairiakraštis'],
        teisingas: ['lygiakraštis', 'lygiašonis', 'įvairiakraštis'].indexOf(rusis),
        sprendimas: `Lyginami kraštinių ilgiai: ${a}, ${b} ir ${c}.`,
      }),

    // 4. Kuris iš dviejų yra lygiašonis
    () => {
      const [x, y, z] = krastines('lygiašonis')
      const [p, q, r] = krastines('įvairiakraštis')
      if (x + y <= z || p + q <= r) return null
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kuris trikampis yra lygiašonis: su kraštinėmis ${x}, ${y}, ${z} ar su kraštinėmis ${p}, ${q}, ${r}?`,
        variantai: [`${x}, ${y}, ${z}`, `${p}, ${q}, ${r}`, 'abu lygiašoniai'],
        teisingas: 0,
        sprendimas: `Pirmajame dvi kraštinės vienodos (${x} ir ${y}), antrajame visos trys skirtingos.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const [p, q, r] = krastines('įvairiakraštis')
      if (p + q <= r) return null
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Mokinys trikampį su kraštinėmis ${p} cm, ${q} cm ir ${r} cm pavadino lygiašoniu. Kaip jis vadinamas iš tikrųjų?`,
        variantai: ['įvairiakraštis', 'lygiašonis', 'lygiakraštis'],
        teisingas: 0,
        sprendimas: 'Lygiašoniame bent dvi kraštinės turi būti vienodo ilgio, o čia visos trys skirtingos.',
      })
    },

    // 6. Trečia kraštinė lygiašoniam
    () => {
      const sonas = atsitiktinis(5, 9)
      const pagrindas = atsitiktinis(3, sonas - 1)
      return uzdavinys(T4, {
        klausimas: `Lygiašonio trikampio dvi kraštinės yra po ${sonas} cm, o perimetras ${2 * sonas + pagrindas} cm. Koks trečios kraštinės ilgis?`,
        atsakymas: String(pagrindas),
        atsakymasRodymui: `$${pagrindas}$ cm`,
        sprendimas: `$${2 * sonas + pagrindas} - ${sonas} - ${sonas} = ${pagrindas}$.`,
      })
    },

    // 7. Lygiakraščio perimetras
    () => {
      const krastine = atsitiktinis(4, 12)
      return uzdavinys(T4, {
        klausimas: `Lygiakraščio trikampio kraštinė ${krastine} cm. Koks jo perimetras?`,
        atsakymas: String(krastine * 3),
        atsakymasRodymui: `$${krastine * 3}$ cm`,
        sprendimas: `Visos trys kraštinės vienodos: $${krastine} \\cdot 3 = ${krastine * 3}$.`,
        brezinys: trikampisSuMatais(krastine, krastine, krastine),
      })
    },
  ])
}

// ── 3.5 Trikampiai pagal kampų rūšis ────────────────────────────────────────

const T5 = 'trikampiai-pagal-kampus'

const A_KAMPAI = [
  {
    klausimas: 'Kaip vadinamas trikampis, turintis statų kampą?',
    atsakymas: 'statusis',
    atsakymasRodymui: 'statusis',
    sprendimas: 'Trikampis su vienu stačiu kampu vadinamas stačiuoju.',
  },
] as const

export const trikampiaiPagalKampus: Generatorius = () =>
  suBandymais(kurkTrikampiusPagalKampus, A_KAMPAI, T5)

const KAMPU_RUSYS: readonly KampoRusis[] = ['statusis', 'smailusis', 'bukasis']

const KAMPU_APRASYMAI: Record<KampoRusis, string> = {
  statusis: 'vienas kampas status',
  smailusis: 'visi kampai smailūs',
  bukasis: 'vienas kampas bukas',
}

function kurkTrikampiusPagalKampus(): Uzdavinys | null {
  const rusis = pasirink([...KAMPU_RUSYS])

  return variacija([
    // 1. Pavadinimas iš aprašymo
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kaip vadinamas trikampis, kurio ${KAMPU_APRASYMAI[rusis]}?`,
        variantai: [...KAMPU_RUSYS],
        teisingas: KAMPU_RUSYS.indexOf(rusis),
        sprendimas: `Trikampio rūšį pagal kampus nusako didžiausias jo kampas.`,
      }),

    // 2. Rūšis iš brėžinio
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kokios rūšies yra pavaizduotas trikampis pagal kampus?',
        variantai: [...KAMPU_RUSYS],
        teisingas: KAMPU_RUSYS.indexOf(rusis),
        sprendimas: `Pažymėtas kampas rodo, į kurį žiūrėti: ${KAMPU_APRASYMAI[rusis]}.`,
        brezinys: trikampisPagalKampus(rusis),
      }),

    // 3. Atrinkti iš trijų
    () => {
      const eile = sumaisyk([...KAMPU_RUSYS])
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kuris iš pavaizduotų trikampių yra ${rusis}?`,
        variantai: eile.map((_, i) => RAIDES[i]),
        teisingas: eile.indexOf(rusis),
        sprendimas: `Ieškoma trikampio, kurio ${KAMPU_APRASYMAI[rusis]}.`,
        brezinys: brezinukuEileSuRaidemis(eile.map((r) => trikampisPagalKampus(r, false))),
      })
    },

    // 4. Kodėl negali būti dviejų stačių kampų
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kodėl trikampis negali turėti dviejų stačių kampų?',
        variantai: [
          'nes du statūs kampai jau sudarytų 180°, ir trečiam kampui nebeliktų vietos',
          'nes statusis kampas trikampyje būna tik vienas pagal apibrėžimą',
          'nes tada kraštinės būtų vienodo ilgio',
          'nes tada figūra taptų kvadratu',
        ],
        teisingas: 0,
        sprendimas: 'Trikampio kampų suma yra 180°. Du statūs kampai jau duoda $90 + 90 = 180$, tad trečiojo kampo nebeliktų.',
      }),

    // 5. Kuo skiriasi smailusis ir statusis
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuo skiriasi smailusis trikampis nuo stačiojo?',
        variantai: [
          'smailiajame visi kampai mažesni už statų, stačiajame vienas kampas status',
          'smailusis visada mažesnis',
          'smailusis turi tris kraštines, o statusis — keturias',
          'stačiajame visi kampai statūs',
        ],
        teisingas: 0,
        sprendimas: 'Rūšis nustatoma pagal didžiausią kampą, o ne pagal figūros dydį.',
        brezinys: brezinukuEileSuRaidemis([
          trikampisPagalKampus('smailusis'),
          trikampisPagalKampus('statusis'),
        ]),
      }),

    // 6. Trečias kampas
    () => {
      const pirmas = atsitiktinis(30, 70)
      const antras = atsitiktinis(20, 60)
      const trecias = 180 - pirmas - antras
      if (trecias < 15) return null
      const rez: KampoRusis =
        Math.max(pirmas, antras, trecias) === 90
          ? 'statusis'
          : Math.max(pirmas, antras, trecias) > 90
            ? 'bukasis'
            : 'smailusis'
      return uzdavinys(T5, {
        klausimas: `Du trikampio kampai yra ${pirmas}° ir ${antras}°. Koks yra trečiasis kampas?`,
        atsakymas: String(trecias),
        atsakymasRodymui: `$${trecias}°$`,
        sprendimas: `Trikampio kampų suma 180°, tad $180 - ${pirmas} - ${antras} = ${trecias}$. Toks trikampis yra ${rez}.`,
      })
    },

    // 7. Susieti pavadinimus su brėžiniais
    () => {
      const eile = sumaisyk([...KAMPU_RUSYS])
      return poruUzdavinys(naujasId(T5), T5, {
        klausimas: 'Susiek trikampio raidę su jo pavadinimu pagal kampus.',
        poros: eile.map((r, i) => ({ kaire: RAIDES[i], desine: r })),
        sprendimas: 'Pažymėtas kampas kiekviename brėžinyje rodo, pagal kurį kampą nustatoma rūšis.',
        brezinys: brezinukuEileSuRaidemis(eile.map((r) => trikampisPagalKampus(r))),
      })
    },
  ])
}

// ── 3.6 Ploto matavimo vienetai ─────────────────────────────────────────────

const T6 = 'ploto-vienetai'

const A_PLOTO_VIENETAI = [
  {
    klausimas: 'Kuo patogiau matuoti klasės grindų plotą: cm² ar m²?',
    atsakymas: 'm2',
    atsakymasRodymui: 'm²',
    sprendimas: 'Grindys didelės, tad kvadratinių centimetrų susidarytų dešimtys tūkstančių.',
  },
] as const

const MAZI_DAIKTAI = ['sąsiuvinio viršelis', 'pašto ženklas', 'lipdukas', 'delnas', 'nuotrauka'] as const
const DIDELI_DAIKTAI = ['klasės grindys', 'stadionas', 'mokyklos kiemas', 'kilimas', 'buto grindys'] as const

export const plotoVienetai: Generatorius = () => suBandymais(kurkPlotoVienetus, A_PLOTO_VIENETAI, T6)

function kurkPlotoVienetus(): Uzdavinys | null {
  const mazas = pasirink(MAZI_DAIKTAI)
  const didelis = pasirink(DIDELI_DAIKTAI)

  return variacija([
    // 1. Mažas daiktas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Kuriuo vienetu patogiau matuoti, koks yra ${mazas} plotas?`,
        variantai: ['cm²', 'm²', 'cm'],
        teisingas: 0,
        sprendimas: 'Daiktas nedidelis, tad kvadratiniais metrais jo plotas būtų mažesnis už vienetą.',
      }),

    // 2. Didelis daiktas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Kuriuo vienetu patogiau matuoti, koks yra plotas, kurį užima ${didelis}?`,
        variantai: ['m²', 'cm²', 'm'],
        teisingas: 0,
        sprendimas: 'Plotas didelis, tad kvadratiniais centimetrais gautųsi dešimtys tūkstančių.',
      }),

    // 3. Kuo skiriasi cm ir cm²
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kuo skiriasi cm ir cm²?',
        variantai: [
          'cm matuojamas ilgis, o cm² — plotas',
          'cm² yra du kartus didesnis už cm',
          'jie reiškia tą patį, tik rašomi skirtingai',
          'cm matuojamas plotas, o cm² — ilgis',
        ],
        teisingas: 0,
        sprendimas: 'Centimetras yra atkarpos ilgis, o kvadratinis centimetras — kvadrato, kurio kraštinė 1 cm, plotas.',
      }),

    // 4. Sugrupuoti daiktus
    () => {
      const du = sumaisyk([...MAZI_DAIKTAI]).slice(0, 2)
      const duDideli = sumaisyk([...DIDELI_DAIKTAI]).slice(0, 2)
      const visi = sumaisyk([
        { vardas: du[0], vienetas: 'cm²' },
        { vardas: du[1], vienetas: 'cm²' },
        { vardas: duDideli[0], vienetas: 'm²' },
        { vardas: duDideli[1], vienetas: 'm²' },
      ])
      return poruUzdavinys(naujasId(T6), T6, {
        klausimas: 'Susiek objektą su vienetu, kuriuo patogiausia matuoti jo plotą.',
        poros: visi.map((v) => ({ kaire: v.vardas, desine: v.vienetas })),
        sprendimas: 'Maži paviršiai matuojami kvadratiniais centimetrais, dideli — kvadratiniais metrais.',
      })
    },

    // 5. Kiek cm² sudaro nedidelį plotą
    () => {
      const a = atsitiktinis(3, 9)
      const b = atsitiktinis(2, 8)
      return uzdavinys(T6, {
        klausimas: `Nuotraukos kraštinės ${a} cm ir ${b} cm. Kiek kvadratinių centimetrų yra jos plotas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$ — tiek vieno kvadratinio centimetro langelių telpa nuotraukoje.`,
        brezinys: langeliuFigura(a, b),
      })
    },

    // 6. Ar patogu grindis matuoti cm²
    () => {
      const a = atsitiktinis(4, 8)
      const b = atsitiktinis(3, 6)
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Mokinys ${a} m × ${b} m grindų plotą užrašė kvadratiniais centimetrais. Ar toks matas patogus?`,
        variantai: [
          `ne, gautųsi šimtai tūkstančių cm², o m² užtenka ${a * b}`,
          'taip, cm² tinka bet kokiam plotui',
          'taip, nes cm² yra tikslesnis vienetas už m²',
        ],
        teisingas: 0,
        sprendimas: `Grindų plotas yra $${a} \\cdot ${b} = ${a * b}$ m². Tas pats plotas kvadratiniais centimetrais būtų kelių ženklų skaičius, kurio net neperskaitysi.`,
      })
    },

    // 7. Vienetas pagal duotą skaičių
    () => {
      const plotas = atsitiktinis(12, 60)
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Kambario plotas yra ${plotas}. Kokį vienetą reikia prirašyti?`,
        variantai: ['m²', 'cm²', 'm', 'cm'],
        teisingas: 0,
        sprendimas: `${plotas} cm² būtų mažesnis už delną, o ${plotas} m² — įprasto kambario dydis.`,
      })
    },
  ])
}

// ── 3.7 Kaip apskaičiuoti stačiakampio plotą? ───────────────────────────────

const T7 = 'staciakampio-plotas'

const A_STACIAKAMPIO_PLOTAS = [
  {
    klausimas: 'Apskaičiuok stačiakampio plotą, kai ilgis 6 cm, plotis 4 cm.',
    atsakymas: '24',
    atsakymasRodymui: '$24$ cm²',
    sprendimas: '$6 \\cdot 4 = 24$.',
  },
] as const

export const staciakampioPlotas: Generatorius = () =>
  suBandymais(kurkStaciakampioPlota, A_STACIAKAMPIO_PLOTAS, T7)

function kurkStaciakampioPlota(): Uzdavinys | null {
  const a = atsitiktinis(3, 12)
  const b = atsitiktinis(2, 9)

  return variacija([
    // 1. Plotas iš dviejų kraštinių
    () =>
      uzdavinys(T7, {
        klausimas: `Apskaičiuok stačiakampio plotą, kai ilgis ${a} cm, plotis ${b} cm.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `Plotas randamas kraštines sudauginus: $${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 2. Kvadrato plotas
    () => {
      const k = atsitiktinis(3, 12)
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok kvadrato plotą, kai jo kraštinė ${k} cm.`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}$ cm²`,
        sprendimas: `Kvadrato abi kraštinės vienodos: $${k} \\cdot ${k} = ${k * k}$.`,
      })
    },

    // 3. Plotas iš brėžinio langeliais
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek kvadratinių centimetrų yra pavaizduoto stačiakampio plotas? Vieno langelio kraštinė — 1 cm.',
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `Stačiakampyje telpa ${b} eilės po ${a} langelius: $${a} \\cdot ${b} = ${a * b}$.`,
        brezinys: langeliuFigura(a, b),
      }),

    // 4. Nežinoma kraštinė
    () =>
      uzdavinys(T7, {
        klausimas: `Stačiakampio plotas ${a * b} cm², viena kraštinė ${a} cm. Koks kitos kraštinės ilgis?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `Kraštinė randama plotą padalijus iš kitos kraštinės: $${a * b} : ${a} = ${b}$.`,
      }),

    // 5. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Mokinys stačiakampio, kurio kraštinės ${a} cm ir ${b} cm, plotą apskaičiavo $${a} + ${b} = ${a + b}$. Užrašyk teisingą plotą.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `Sudėtis duoda ne plotą, o pusę perimetro. Plotas: $${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 6. Palyginti stačiakampį ir kvadratą
    () => {
      const k = atsitiktinis(4, 8)
      if (a * b === k * k) return null
      return pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Kurio plotas didesnis: stačiakampio ${a} cm × ${b} cm ar kvadrato, kurio kraštinė ${k} cm?`,
        variantai:
          a * b > k * k
            ? [`stačiakampio (${a} × ${b})`, `kvadrato (${k} × ${k})`, 'plotai vienodi']
            : [`kvadrato (${k} × ${k})`, `stačiakampio (${a} × ${b})`, 'plotai vienodi'],
        teisingas: 0,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$ cm² ir $${k} \\cdot ${k} = ${k * k}$ cm².`,
      })
    },

    // 7. Plotas metrais
    () => {
      const x = atsitiktinis(3, 12)
      const y = atsitiktinis(2, 9)
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok stačiakampio plotą, kai jo kraštinės ${x} m ir ${y} m.`,
        atsakymas: String(x * y),
        atsakymasRodymui: `$${x * y}$ m²`,
        sprendimas: `$${x} \\cdot ${y} = ${x * y}$. Matuojant metrais plotas gaunamas kvadratiniais metrais.`,
      })
    },

    // 8. Koks veiksmas reikalingas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kokį veiksmą reikia atlikti norint rasti stačiakampio plotą?',
        variantai: [
          'sudauginti ilgį ir plotį',
          'sudėti visas keturias kraštines',
          'sudėti ilgį ir plotį',
          'ilgį padalyti iš pločio',
        ],
        teisingas: 0,
        sprendimas: 'Plotas rodo, kiek vienetinių kvadratėlių telpa figūroje: eilėje jų tiek, koks ilgis, o eilių tiek, koks plotis.',
      }),
  ])
}

// ── 3.8 Sudėtinės figūros plotas ────────────────────────────────────────────

const T8 = 'sudetines-figuros-plotas'

const A_SUDETINE = [
  {
    klausimas: 'Figūrą sudaro 6 cm × 2 cm ir 4 cm × 3 cm stačiakampiai. Koks jos plotas?',
    atsakymas: '24',
    atsakymasRodymui: '$24$ cm²',
    sprendimas: '$6 \\cdot 2 + 4 \\cdot 3 = 12 + 12 = 24$.',
  },
] as const

export const sudetinesFigurosPlotas: Generatorius = () => suBandymais(kurkSudetine, A_SUDETINE, T8)

function kurkSudetine(): Uzdavinys | null {
  const a = atsitiktinis(6, 11)
  const b = atsitiktinis(5, 9)
  const c = atsitiktinis(2, a - 3)
  const d = atsitiktinis(2, b - 2)
  const plotas = a * b - c * d

  return variacija([
    // 1. L formos figūra iš brėžinio
    () =>
      uzdavinys(T8, {
        klausimas: 'Suskaidyk figūrą į stačiakampius ir apskaičiuok jos plotą.',
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `Viršutinis stačiakampis $${a} \\cdot ${b - d} = ${a * (b - d)}$ cm², apatinis $${a - c} \\cdot ${d} = ${(a - c) * d}$ cm². Iš viso $${a * (b - d)} + ${(a - c) * d} = ${plotas}$ cm².`,
        brezinys: Lfigura(a, b, c, d),
      }),

    // 2. Du greta esantys stačiakampiai
    () => {
      const a1 = atsitiktinis(3, 7)
      const b1 = atsitiktinis(3, 6)
      const a2 = atsitiktinis(3, 7)
      return uzdavinys(T8, {
        klausimas: 'Kokį plotą užima abu greta sustatyti stačiakampiai?',
        atsakymas: String(a1 * b1 + a2 * b1),
        atsakymasRodymui: `$${a1 * b1 + a2 * b1}$ cm²`,
        sprendimas: `$${a1} \\cdot ${b1} + ${a2} \\cdot ${b1} = ${a1 * b1} + ${a2 * b1} = ${a1 * b1 + a2 * b1}$ cm².`,
        brezinys: dvieluStaciakampiuFigura(a1, b1, a2, b1),
      })
    },

    // 3. Iš dviejų duotų matmenų
    () => {
      const a1 = atsitiktinis(4, 9)
      const b1 = atsitiktinis(2, 5)
      const a2 = atsitiktinis(3, 7)
      const b2 = atsitiktinis(2, 5)
      return uzdavinys(T8, {
        klausimas: `Sudėtinė figūra sudaryta iš ${a1} cm × ${b1} cm ir ${a2} cm × ${b2} cm stačiakampių. Koks jos plotas?`,
        atsakymas: String(a1 * b1 + a2 * b2),
        atsakymasRodymui: `$${a1 * b1 + a2 * b2}$ cm²`,
        sprendimas: `$${a1} \\cdot ${b1} = ${a1 * b1}$, $${a2} \\cdot ${b2} = ${a2 * b2}$, suma $${a1 * b1 + a2 * b2}$.`,
      })
    },

    // 4. Iš vienodų kvadratų
    () => {
      const kvadratu = atsitiktinis(3, 6)
      const kraštine = atsitiktinis(2, 5)
      return uzdavinys(T8, {
        klausimas: `Figūrą sudaro ${kvadratu} vienodi kvadratai, kurių kiekvieno kraštinė ${kraštine} cm. Koks figūros plotas?`,
        atsakymas: String(kvadratu * kraštine * kraštine),
        atsakymasRodymui: `$${kvadratu * kraštine * kraštine}$ cm²`,
        sprendimas: `Vieno kvadrato plotas $${kraštine} \\cdot ${kraštine} = ${kraštine * kraštine}$ cm², tad iš viso $${kraštine * kraštine} \\cdot ${kvadratu} = ${kvadratu * kraštine * kraštine}$ cm².`,
      })
    },

    // 5. Trūkstamos dalies plotas
    () => {
      const visas = atsitiktinis(30, 90)
      const dalis = atsitiktinis(8, visas - 8)
      return uzdavinys(T8, {
        klausimas: `Visos figūros plotas ${visas} cm², o vienos jos dalies — ${dalis} cm². Koks kitos dalies plotas?`,
        atsakymas: String(visas - dalis),
        atsakymasRodymui: `$${visas - dalis}$ cm²`,
        sprendimas: `$${visas} - ${dalis} = ${visas - dalis}$.`,
      })
    },

    // 6. Klaida: dalis suskaičiuota du kartus
    () => {
      const a1 = atsitiktinis(5, 9)
      const b1 = atsitiktinis(3, 6)
      const a2 = atsitiktinis(3, 6)
      const teisingas = a1 * b1 + a2 * b1
      const klaidingas = (a1 + a2) * b1 + a2 * b1
      return uzdavinys(T8, {
        klausimas: `Skaičiuodamas sudėtinės figūros plotą mokinys bendrą dalį suskaičiavo du kartus ir gavo ${klaidingas} cm². Užrašyk teisingą plotą.`,
        atsakymas: String(teisingas),
        atsakymasRodymui: `$${teisingas}$ cm²`,
        sprendimas: `Dalys sudedamos po vieną kartą: $${a1} \\cdot ${b1} + ${a2} \\cdot ${b1} = ${teisingas}$ cm².`,
        brezinys: dvieluStaciakampiuFigura(a1, b1, a2, b1),
      })
    },

    // 7. Iškirstos dalies plotas
    () =>
      uzdavinys(T8, {
        klausimas: `Iš ${a} cm × ${b} cm stačiakampio iškirptas ${c} cm × ${d} cm kampas. Koks likusios figūros plotas?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `$${a} \\cdot ${b} - ${c} \\cdot ${d} = ${a * b} - ${c * d} = ${plotas}$ cm².`,
        brezinys: langeliuFigura(a, b, { c, d }),
      }),
  ])
}

// ── 3.9 Tekstiniai uždaviniai su plotu ──────────────────────────────────────

const T9 = 'ploto-tekstiniai'

const A_PLOTO_TEKSTINIAI = [
  {
    klausimas: 'Kambario grindys 6 m ilgio ir 4 m pločio. Kiek kvadratinių metrų grindų reikės uždengti?',
    atsakymas: '24',
    atsakymasRodymui: '$24$ m²',
    sprendimas: '$6 \\cdot 4 = 24$.',
  },
] as const

export const plotoTekstiniai: Generatorius = () => suBandymais(kurkPlotoTekstini, A_PLOTO_TEKSTINIAI, T9)

function kurkPlotoTekstini(): Uzdavinys | null {
  const a = atsitiktinis(3, 12)
  const b = atsitiktinis(2, 9)
  const vardas = pasirink(VARDAI)

  return variacija([
    // 1. Grindų danga
    () =>
      uzdavinys(T9, {
        klausimas: `Kambario grindys ${a} m ilgio ir ${b} m pločio. Kiek kvadratinių metrų dangos reikės?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ m²`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 2. Kaina už kvadratinį metrą
    () => {
      const kaina = atsitiktinis(4, 15)
      if (a * b * kaina > 10000) return null
      return uzdavinys(T9, {
        klausimas: `Vieno kvadratinio metro dangos kaina ${kaina} Eur. Kiek kainuos padengti ${a} m × ${b} m grindis?`,
        atsakymas: String(a * b * kaina),
        atsakymasRodymui: `$${a * b * kaina}$ Eur`,
        sprendimas: `Plotas $${a} \\cdot ${b} = ${a * b}$ m², kaina $${a * b} \\cdot ${kaina} = ${a * b * kaina}$ Eur.`,
      })
    },

    // 3. Kiek plytelių reikės
    () => {
      const plytele = pasirink([2, 3, 4])
      const ilgis = plytele * atsitiktinis(3, 8)
      const plotis = plytele * atsitiktinis(2, 6)
      const kiekis = (ilgis / plytele) * (plotis / plytele)
      return uzdavinys(T9, {
        klausimas: `Sienos plotas ${ilgis} dm × ${plotis} dm dengiamas kvadratinėmis plytelėmis, kurių kraštinė ${plytele} dm. Kiek plytelių reikės?`,
        atsakymas: String(kiekis),
        atsakymasRodymui: `$${kiekis}$`,
        sprendimas: `Vienos plytelės plotas $${plytele} \\cdot ${plytele} = ${plytele * plytele}$ dm², sienos plotas $${ilgis} \\cdot ${plotis} = ${ilgis * plotis}$ dm². Reikės $${ilgis * plotis} : ${plytele * plytele} = ${kiekis}$ plytelių.`,
      })
    },

    // 4. Dviejų žingsnių: liko plotas
    () => {
      const c = atsitiktinis(1, Math.max(1, a - 2))
      const d = atsitiktinis(1, Math.max(1, b - 1))
      if (a * b - c * d <= 0) return null
      return uzdavinys(T9, {
        klausimas: `Kambarys ${a} m × ${b} m, o dalį jo užima ${c} m × ${d} m sandėliukas. Kiek kvadratinių metrų lieka pagrindinei erdvei?`,
        atsakymas: String(a * b - c * d),
        atsakymasRodymui: `$${a * b - c * d}$ m²`,
        sprendimas: `$${a} \\cdot ${b} - ${c} \\cdot ${d} = ${a * b} - ${c * d} = ${a * b - c * d}$.`,
      })
    },

    // 5. Atvirkštinis: rasti kraštinę
    () => {
      const plotas = a * b
      return uzdavinys(T9, {
        klausimas: `Daržo plotas ${plotas} m², o jo ilgis ${a} m. Koks daržo plotis?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ m`,
        sprendimas: `$${plotas} : ${a} = ${b}$.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Uždavinys: „Sklypas ${a} m × ${b} m. Koks jo plotas?“ ${vardas} užrašė $(${a} + ${b}) \\cdot 2$. Užrašyk teisingą plotą.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ m²`,
        sprendimas: `$(${a} + ${b}) \\cdot 2$ duoda perimetrą, o ne plotą. Plotas: $${a} \\cdot ${b} = ${a * b}$ m².`,
      }),

    // 7. Palyginti du sklypus
    () => {
      const c = atsitiktinis(3, 12)
      const d = atsitiktinis(2, 9)
      if (a * b === c * d) return null
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kurio sklypo plotas didesnis: ${a} m × ${b} m ar ${c} m × ${d} m?`,
        variantai:
          a * b > c * d
            ? [`${a} m × ${b} m`, `${c} m × ${d} m`, 'plotai vienodi']
            : [`${c} m × ${d} m`, `${a} m × ${b} m`, 'plotai vienodi'],
        teisingas: 0,
        sprendimas: `$${a * b}$ m² ir $${c * d}$ m².`,
      })
    },
  ])
}

// ── 3.10 Plotas ir perimetras kartu ─────────────────────────────────────────

const T10 = 'plotas-ir-perimetras'

const A_PLOTAS_PERIMETRAS = [
  {
    klausimas: 'Stačiakampio ilgis 8 cm, plotis 3 cm. Koks jo perimetras?',
    atsakymas: '22',
    atsakymasRodymui: '$22$ cm',
    sprendimas: '$(8 + 3) \\cdot 2 = 22$.',
  },
] as const

export const plotasIrPerimetras: Generatorius = () =>
  suBandymais(kurkPlotaIrPerimetra, A_PLOTAS_PERIMETRAS, T10)

function kurkPlotaIrPerimetra(): Uzdavinys | null {
  const a = atsitiktinis(4, 12)
  const b = atsitiktinis(2, 9)
  if (a === b) return null

  return variacija([
    // 1. Perimetras iš kraštinių
    () =>
      uzdavinys(T10, {
        klausimas: `Stačiakampio ilgis ${a} cm, plotis ${b} cm. Koks jo perimetras?`,
        atsakymas: String((a + b) * 2),
        atsakymasRodymui: `$${(a + b) * 2}$ cm`,
        sprendimas: `$(${a} + ${b}) \\cdot 2 = ${(a + b) * 2}$.`,
      }),

    // 2. Plotas ir perimetras — klausiama ploto
    () =>
      uzdavinys(T10, {
        klausimas: `Sodo lysvė ${a} m ilgio ir ${b} m pločio. Kiek kvadratinių metrų ji užima?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ m²`,
        sprendimas: `Plotas: $${a} \\cdot ${b} = ${a * b}$ m². (Aptvėrimui reikėtų $(${a} + ${b}) \\cdot 2 = ${(a + b) * 2}$ m tvoros.)`,
      }),

    // 3. Kvadratas
    () => {
      const k = atsitiktinis(3, 12)
      return uzdavinys(T10, {
        klausimas: `Kvadrato kraštinė ${k} cm. Kiek jo perimetras skiriasi nuo skaičiaus, išreiškiančio plotą?`,
        atsakymas: String(Math.abs(k * k - 4 * k)),
        atsakymasRodymui: `$${Math.abs(k * k - 4 * k)}$`,
        sprendimas: `Perimetras $${4 * k}$ cm, plotas $${k * k}$ cm². Skirtumas $${Math.abs(k * k - 4 * k)}$. Skaičius sutampa tik tada, kai kraštinė 4 cm.`,
      })
    },

    // 4. Iš ploto rasti kitą kraštinę ir perimetrą
    () =>
      uzdavinys(T10, {
        klausimas: `Stačiakampio plotas ${a * b} cm², viena kraštinė ${a} cm. Koks jo perimetras?`,
        atsakymas: String((a + b) * 2),
        atsakymasRodymui: `$${(a + b) * 2}$ cm`,
        sprendimas: `Kita kraštinė $${a * b} : ${a} = ${b}$ cm, tad perimetras $(${a} + ${b}) \\cdot 2 = ${(a + b) * 2}$ cm.`,
      }),

    // 5. Klaida: plotas ir perimetras sutapatinti
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Mokinys kvadrato, kurio kraštinė 7 cm, ir plotą, ir perimetrą užrašė 28. Ką jis supainiojo?`,
        variantai: [
          'plotą su perimetru: plotas yra $7 \\cdot 7 = 49$ cm², o 28 cm yra perimetras',
          'nieko, abu atsakymai teisingi',
          'perimetrą su kraštine',
          'kvadratą su stačiakampiu',
        ],
        teisingas: 0,
        sprendimas: 'Perimetras sudedamas iš kraštinių ilgių ($4 \\cdot 7 = 28$ cm), o plotas gaunamas kraštines sudauginus ($7 \\cdot 7 = 49$ cm²).',
      }),

    // 6. Du sklypai: kur didesnis plotas, kur ilgesnis perimetras
    () => {
      const c = atsitiktinis(4, 12)
      const d = atsitiktinis(2, 9)
      if (a * b === c * d || (a + b) * 2 === (c + d) * 2) return null
      const plotasDidesnis = a * b > c * d ? `${a}×${b}` : `${c}×${d}`
      const perimetrasIlgesnis = a + b > c + d ? `${a}×${b}` : `${c}×${d}`
      if (plotasDidesnis === perimetrasIlgesnis) return null
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Du sklypai: ${a} m × ${b} m ir ${c} m × ${d} m. Kurio sklypo plotas didesnis?`,
        variantai:
          a * b > c * d
            ? [`${a} m × ${b} m`, `${c} m × ${d} m`, 'plotai vienodi']
            : [`${c} m × ${d} m`, `${a} m × ${b} m`, 'plotai vienodi'],
        teisingas: 0,
        sprendimas: `Plotai: $${a * b}$ m² ir $${c * d}$ m². Įdomu, kad ilgesnį perimetrą turi ${perimetrasIlgesnis} sklypas — didesnis plotas ir ilgesnis perimetras ne visada sutampa.`,
      })
    },

    // 7. Kuo skiriasi plotas ir perimetras
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kuo skiriasi figūros plotas ir perimetras?',
        variantai: [
          'perimetras yra kraštinių ilgių suma, o plotas — figūros užimamas paviršius',
          'plotas visada didesnis už perimetrą',
          'perimetras matuojamas kvadratiniais vienetais, o plotas — paprastais',
          'jie skiriasi tik pavadinimu',
        ],
        teisingas: 0,
        sprendimas: 'Perimetras matuojamas cm arba m, plotas — cm² arba m². Tai skirtingi dydžiai, ir jų lyginti tarpusavyje negalima.',
      }),

    // 8. Aptvėrimo ilgis
    () => {
      const kaina = atsitiktinis(3, 9)
      if ((a + b) * 2 * kaina > 10000) return null
      return uzdavinys(T10, {
        klausimas: `Daržą ${a} m × ${b} m reikia aptverti tvora. Vienas metras tvoros kainuoja ${kaina} Eur. Kiek kainuos tvora?`,
        atsakymas: String((a + b) * 2 * kaina),
        atsakymasRodymui: `$${(a + b) * 2 * kaina}$ Eur`,
        sprendimas: `Tvorai reikia perimetro: $(${a} + ${b}) \\cdot 2 = ${(a + b) * 2}$ m. Kaina $${(a + b) * 2} \\cdot ${kaina} = ${(a + b) * 2 * kaina}$ Eur.`,
      })
    },
  ])
}

// ── 3.11 Patalpos plotas pagal planą ────────────────────────────────────────

const T11 = 'patalpos-plotas'

const A_PATALPA = [
  {
    klausimas: 'Kambarys plane yra 6 m × 4 m. Koks jo plotas?',
    atsakymas: '24',
    atsakymasRodymui: '$24$ m²',
    sprendimas: '$6 \\cdot 4 = 24$.',
  },
] as const

const KAMBARIU_VARDAI = ['Kambarys', 'Virtuvė', 'Miegamasis', 'Svetainė', 'Koridorius'] as const

export const patalposPlotas: Generatorius = () => suBandymais(kurkPatalposPlota, A_PATALPA, T11)

function kurkPatalposPlota(): Uzdavinys | null {
  const a = atsitiktinis(3, 8)
  const b = atsitiktinis(3, 6)
  const vardai = sumaisyk([...KAMBARIU_VARDAI])

  return variacija([
    // 1. Vienas kambarys iš plano
    () =>
      uzdavinys(T11, {
        klausimas: 'Koks kambario plotas pagal planą?',
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ m²`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
        brezinys: patalposPlanas([{ vardas: vardai[0], ilgis: a, plotis: b }]),
      }),

    // 2. Du kambariai iš plano
    () => {
      const a2 = atsitiktinis(3, 7)
      const b2 = atsitiktinis(2, b)
      return uzdavinys(T11, {
        klausimas: 'Koks bendras abiejų patalpų plotas pagal planą?',
        atsakymas: String(a * b + a2 * b2),
        atsakymasRodymui: `$${a * b + a2 * b2}$ m²`,
        sprendimas: `$${a} \\cdot ${b} + ${a2} \\cdot ${b2} = ${a * b} + ${a2 * b2} = ${a * b + a2 * b2}$.`,
        brezinys: patalposPlanas([
          { vardas: vardai[0], ilgis: a, plotis: b },
          { vardas: vardai[1], ilgis: a2, plotis: b2 },
        ]),
      })
    },

    // 3. Plotas iš žodinio plano
    () =>
      uzdavinys(T11, {
        klausimas: `Pagal planą kambario ilgis ${a} m, plotis ${b} m. Koks jo plotas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ m²`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 4. Kiek dangos reikės
    () => {
      const k = atsitiktinis(3, 6)
      return uzdavinys(T11, {
        klausimas: `Pagal planą virtuvė yra ${k} m × ${k} m. Kiek kvadratinių metrų grindų reikės uždengti?`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}$ m²`,
        sprendimas: `Virtuvė kvadratinė: $${k} \\cdot ${k} = ${k * k}$.`,
        brezinys: patalposPlanas([{ vardas: 'Virtuvė', ilgis: k, plotis: k }]),
      })
    },

    // 5. Kambarys su sandėliuku
    () => {
      const c = atsitiktinis(1, Math.max(1, a - 2))
      const d = atsitiktinis(1, Math.max(1, b - 1))
      if (a * b - c * d <= 0) return null
      return uzdavinys(T11, {
        klausimas: `Plane kambarys ${a} m × ${b} m, o jo kampe yra ${c} m × ${d} m sandėliukas. Kiek kvadratinių metrų lieka pačiam kambariui?`,
        atsakymas: String(a * b - c * d),
        atsakymasRodymui: `$${a * b - c * d}$ m²`,
        sprendimas: `$${a * b} - ${c * d} = ${a * b - c * d}$.`,
      })
    },

    // 6. Palyginti du kambarius
    () => {
      const a2 = atsitiktinis(3, 8)
      const b2 = atsitiktinis(2, 6)
      if (a * b === a2 * b2) return null
      return pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kurios patalpos plotas didesnis pagal planą?',
        variantai:
          a * b > a2 * b2
            ? [vardai[0], vardai[1], 'plotai vienodi']
            : [vardai[1], vardai[0], 'plotai vienodi'],
        teisingas: 0,
        sprendimas: `${vardai[0]}: $${a} \\cdot ${b} = ${a * b}$ m². ${vardai[1]}: $${a2} \\cdot ${b2} = ${a2 * b2}$ m².`,
        brezinys: patalposPlanas([
          { vardas: vardai[0], ilgis: a, plotis: b },
          { vardas: vardai[1], ilgis: a2, plotis: b2 },
        ]),
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T11, {
        klausimas: `Pagal planą kambarys yra ${a} m × ${b} m. Mokinys plotą apskaičiavo sudėdamas visas keturias sienas ir gavo ${(a + b) * 2}. Užrašyk teisingą plotą.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ m²`,
        sprendimas: `Sudėjus sienas gaunamas perimetras. Plotas randamas dauginant: $${a} \\cdot ${b} = ${a * b}$ m².`,
        brezinys: patalposPlanas([{ vardas: vardai[0], ilgis: a, plotis: b }]),
      }),

    // 8. Kiek kainuos danga
    () => {
      const kaina = atsitiktinis(6, 20)
      if (a * b * kaina > 10000) return null
      return uzdavinys(T11, {
        klausimas: `Pagal planą kambarys yra ${a} m × ${b} m, o kvadratinio metro dangos kaina ${kaina} Eur. Kiek kainuos visos grindys?`,
        atsakymas: String(a * b * kaina),
        atsakymasRodymui: `$${a * b * kaina}$ Eur`,
        sprendimas: `Plotas $${a * b}$ m², kaina $${a * b} \\cdot ${kaina} = ${a * b * kaina}$ Eur.`,
        brezinys: patalposPlanas([{ vardas: vardai[0], ilgis: a, plotis: b }]),
      })
    },
  ])
}
