import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import {
  erdvesKunas,
  gretasienisSuMatais,
  isklotine,
  kubeliuStatinys4,
  kunuEile,
  type ErdvesKunas,
} from './ketvirtokams-erdves-vaizdai'
import { sk4 } from './ketvirtokams-bendra'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 5 klasės tema „Erdviniai kūnai“ — aštuonios potemės.
 *
 * Paviršiaus plotas ir tūris čia pirmą kartą skiriami vienas nuo kito, tad
 * atsakymuose visur rašomi vienetai: plotas cm², tūris cm³. Uždaviniai, kur
 * mokinys turėtų kūną nubraižyti ar išklotinę iškirpti, pakeisti klausimais
 * apie tai, ką braižymas reikalauja žinoti — kiek sienų, kokių matmenų.
 */

/** Kūnų vardai lietuviškai — brėžinio raktas jų nerašo su diakritikais. */
const VARDAI: Record<ErdvesKunas, string> = {
  kubas: 'kubas',
  gretasienis: 'stačiakampis gretasienis',
  ritinys: 'ritinys',
  kugis: 'kūgis',
  rutulys: 'rutulys',
  piramide: 'piramidė',
  prizme: 'prizmė',
}

// ── 11.1.1. Vaizduojame ─────────────────────────────────────────────────────

const T1 = 'erdviniu-kunu-vaizdavimas'

const A_VAIZDUOJAME = [
  {
    klausimas: 'Kiek sienų turi stačiakampis gretasienis?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Visos jo sienos yra stačiakampiai.',
  },
] as const

export const erdviniuKunuVaizdavimas: Generatorius = () => suBandymais(kurkVaizdavima, A_VAIZDUOJAME, T1)

function kurkVaizdavima(): Uzdavinys | null {
  const kunas = pasirink<ErdvesKunas>(['kubas', 'gretasienis', 'ritinys', 'kugis', 'rutulys', 'piramide', 'prizme'])

  return variacija([
    // 1. Kiek sienų
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek sienų turi stačiakampis gretasienis?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Priešingos sienos yra lygios: trys jų poros.',
        brezinys: erdvesKunas('gretasienis'),
      }),

    // 2. Kiek briaunų
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek briaunų turi kubas?',
        atsakymas: '12',
        atsakymasRodymui: '$12$',
        sprendimas: 'Po keturias kiekvienoje iš trijų krypčių: $4 \\cdot 3 = 12$.',
        brezinys: erdvesKunas('kubas'),
      }),

    // 3. Kiek viršūnių
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek viršūnių turi stačiakampis gretasienis?',
        atsakymas: '8',
        atsakymasRodymui: '$8$',
        sprendimas: 'Po keturias apatinėje ir viršutinėje sienose.',
      }),

    // 4. Kūno atpažinimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Koks kūnas pavaizduotas?',
        variantai: [
          VARDAI[kunas],
          ...(Object.keys(VARDAI) as ErdvesKunas[])
            .filter((x) => x !== kunas)
            .slice(0, 3)
            .map((x) => VARDAI[x]),
        ],
        teisingas: 0,
        sprendimas: 'Kūnas atpažįstamas iš jo sienų ir paviršiaus formos.',
        brezinys: erdvesKunas(kunas),
      }),

    // 5. Kodėl brėžiamos punktyrinės linijos
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ką brėžinyje reiškia punktyrinės kūno linijos?',
        variantai: [
          'briaunas, kurių iš tos pusės nematyti',
          'briaunas, kurios trumpesnės už kitas',
          'kūno simetrijos ašis',
          'vietas, kur kūnas perpjautas',
        ],
        teisingas: 0,
        sprendimas: 'Taip erdvinis kūnas pavaizduojamas plokščiame lape.',
        brezinys: erdvesKunas('gretasienis'),
      }),

    // 6. Kuris kūnas turi tik plokščias sienas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuris kūnas turi tik plokščias sienas?',
        variantai: ['kubas', 'ritinys', 'kūgis', 'rutulys'],
        teisingas: 0,
        sprendimas: 'Ritinio, kūgio ir rutulio paviršius yra išlenktas.',
        brezinys: kunuEile(['kubas', 'ritinys', 'kugis', 'rutulys']),
      }),

    // 7. Poros
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Sujunk kūną su jo sienų skaičiumi.',
        poros: [
          { kaire: 'kubas', desine: '6' },
          { kaire: 'stačiakampis gretasienis', desine: '6' },
          { kaire: 'rutulys', desine: '0 plokščių sienų' },
          { kaire: 'keturkampė piramidė', desine: '5' },
        ],
        sprendimas: 'Piramidės sienos yra pagrindas ir keturi trikampiai.',
      }),

    // 8. Kuo kubas skiriasi nuo gretasienio
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuo kubas skiriasi nuo bet kokio stačiakampio gretasienio?',
        variantai: [
          'visos jo briaunos lygios, o sienos — kvadratai',
          'jis turi daugiau sienų',
          'jis turi mažiau viršūnių',
          'jo sienos yra trikampiai',
        ],
        teisingas: 0,
        sprendimas: 'Kubas yra stačiakampis gretasienis, kurio visi trys matmenys vienodi.',
      }),
  ])
}

// ── 11.1.2. Matmenys. Išklotinė ─────────────────────────────────────────────

const T2 = 'matmenys-ir-isklotine'

const A_ISKLOTINE = [
  {
    klausimas: 'Iš kiek stačiakampių sudaryta stačiakampio gretasienio išklotinė?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Tiek, kiek kūnas turi sienų.',
  },
] as const

export const matmenysIrIsklotine: Generatorius = () => suBandymais(kurkIsklotine, A_ISKLOTINE, T2)

function kurkIsklotine(): Uzdavinys | null {
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(2, 9)
  const c = atsitiktinis(2, 9)

  return variacija([
    // 1. Iš kiek dalių
    () =>
      uzdavinys(T2, {
        klausimas: 'Iš kiek stačiakampių sudaryta stačiakampio gretasienio išklotinė?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Kiek sienų turi kūnas, tiek dalių ir jo išklotinėje.',
        brezinys: isklotine('gretasienis'),
      }),

    // 2. Kiek matmenų
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kiek matmenų turi stačiakampis gretasienis?',
        variantai: ['tris: ilgį, plotį ir aukštį', 'du: ilgį ir plotį', 'keturis', 'vieną'],
        teisingas: 0,
        sprendimas: 'Iš šių trijų matmenų apskaičiuojamas ir paviršiaus plotas, ir tūris.',
        brezinys: gretasienisSuMatais(a, b, c),
      }),

    // 3. Ar tinka išklotinė
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ar iš pavaizduotos išklotinės galima sulankstyti kubą?',
        variantai: ['ne', 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Lankstant kai kurios sienos uždengtų viena kitą, o kita vieta liktų atvira.',
        brezinys: isklotine('ne-kubas'),
      }),

    // 4. Kubo išklotinės kvadratai
    () => {
      const k = atsitiktinis(2, 12)
      return uzdavinys(T2, {
        klausimas: `Kubo briauna yra ${k} cm. Kokio ploto yra vienas jo išklotinės kvadratas?`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}$ cm²`,
        sprendimas: `$${k} \\cdot ${k} = ${k * k}$.`,
        brezinys: isklotine('kubas'),
      })
    },

    // 5. Priešingos sienos
    () =>
      uzdavinys(T2, {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm. Kiek jo sienų yra ${a} cm $\\times$ ${b} cm dydžio?`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Priešingos gretasienio sienos lygios, tad kiekvieno dydžio sienų yra po dvi.',
        brezinys: gretasienisSuMatais(a, b, c),
      }),

    // 6. Briaunų suma
    () =>
      uzdavinys(T2, {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm. Kokia visų jo briaunų ilgių suma?`,
        atsakymas: String(4 * (a + b + c)),
        atsakymasRodymui: `$${4 * (a + b + c)}$ cm`,
        sprendimas: `Kiekvieno matmens briaunų yra po keturias: $4 \\cdot (${a} + ${b} + ${c}) = ${4 * (a + b + c)}$.`,
      }),

    // 7. Piramidės išklotinė
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Iš kokių figūrų sudaryta keturkampės piramidės išklotinė?',
        variantai: [
          'iš kvadrato ir keturių trikampių',
          'iš šešių kvadratų',
          'iš dviejų kvadratų ir keturių stačiakampių',
          'iš keturių kvadratų',
        ],
        teisingas: 0,
        sprendimas: 'Kvadratas yra pagrindas, o trikampiai — šoninės sienos.',
        brezinys: isklotine('piramide'),
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: 'Mokinys teigia, kad kubo išklotinę sudaro 4 kvadratai. Kiek jų yra iš tikrųjų?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Nepamirštamos ir viršutinė bei apatinė sienos.',
        brezinys: isklotine('kubas'),
      }),
  ])
}

// ── 11.1.3. Stačiakampio gretasienio paviršiaus plotas ──────────────────────

const T3 = 'gretasienio-pavirsiaus-plotas'

const A_PAVIRSIUS = [
  {
    klausimas: 'Stačiakampio gretasienio matmenys 3 cm, 4 cm ir 5 cm. Koks jo paviršiaus plotas?',
    atsakymas: '94',
    atsakymasRodymui: '$94$ cm²',
    sprendimas: '$2 \\cdot (3 \\cdot 4 + 3 \\cdot 5 + 4 \\cdot 5) = 94$.',
  },
] as const

export const gretasienioPavirsiausPlotas: Generatorius = () => suBandymais(kurkPavirsiu, A_PAVIRSIUS, T3)

function kurkPavirsiu(): Uzdavinys | null {
  const a = atsitiktinis(2, 10)
  const b = atsitiktinis(2, 10)
  const c = atsitiktinis(2, 10)
  const plotas = 2 * (a * b + a * c + b * c)

  return variacija([
    // 1. Paviršiaus plotas
    () =>
      uzdavinys(T3, {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm. Koks jo paviršiaus plotas?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `$2 \\cdot (${a} \\cdot ${b} + ${a} \\cdot ${c} + ${b} \\cdot ${c}) = 2 \\cdot ${a * b + a * c + b * c} = ${plotas}$.`,
        brezinys: gretasienisSuMatais(a, b, c),
      }),

    // 2. Vienos sienos plotas
    () =>
      uzdavinys(T3, {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm. Koks jo apatinės sienos, kurios kraštinės ${a} cm ir ${b} cm, plotas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
        brezinys: gretasienisSuMatais(a, b, c),
      }),

    // 3. Kodėl dauginama iš dviejų
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kodėl skaičiuojant gretasienio paviršiaus plotą trijų sienų plotų suma dauginama iš 2?',
        variantai: [
          'nes priešingos sienos yra lygios',
          'nes sienų yra dvylika',
          'nes plotas visada dvigubas',
          'nes kūnas turi du pagrindus',
        ],
        teisingas: 0,
        sprendimas: 'Gretasienis turi tris skirtingų dydžių sienų poras.',
      }),

    // 4. Dviejų pagrindų plotas
    () =>
      uzdavinys(T3, {
        klausimas: `Gretasienio pagrindo kraštinės ${a} cm ir ${b} cm. Koks bendras abiejų pagrindų plotas?`,
        atsakymas: String(2 * a * b),
        atsakymasRodymui: `$${2 * a * b}$ cm²`,
        sprendimas: `$${a} \\cdot ${b} \\cdot 2 = ${2 * a * b}$.`,
      }),

    // 5. Šoninis paviršius
    () =>
      uzdavinys(T3, {
        klausimas: `Gretasienio pagrindo kraštinės ${a} cm ir ${b} cm, aukštis ${c} cm. Koks jo šoninio paviršiaus plotas?`,
        atsakymas: String(2 * c * (a + b)),
        atsakymasRodymui: `$${2 * c * (a + b)}$ cm²`,
        sprendimas: `Šoninis paviršius yra keturios sienos: $2 \\cdot ${c} \\cdot (${a} + ${b}) = ${2 * c * (a + b)}$.`,
        brezinys: gretasienisSuMatais(a, b, c),
      }),

    // 6. Trūkstamas matmuo
    () =>
      uzdavinys(T3, {
        klausimas: `Gretasienio sienos plotas ${a * b} cm², viena jos kraštinė ${a} cm. Kokia kita kraštinė?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `$${a * b} : ${a} = ${b}$.`,
      }),

    // 7. Praktinis
    () => {
      const kaina = atsitiktinis(2, 9)
      if (plotas * kaina > 100000) return null
      return uzdavinys(T3, {
        klausimas: `Dėžę, kurios matmenys ${a} dm, ${b} dm ir ${c} dm, reikia apklijuoti popieriumi. Vienas kvadratinis decimetras popieriaus kainuoja ${kaina} centus. Kiek centų kainuos popierius?`,
        atsakymas: String(plotas * kaina),
        atsakymasRodymui: `$${sk4(plotas * kaina)}$ centų`,
        sprendimas: `Paviršiaus plotas $${plotas}$ dm²; $${plotas} \\cdot ${kaina} = ${sk4(plotas * kaina)}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: `Mokinys gretasienio, kurio matmenys ${a} cm, ${b} cm ir ${c} cm, paviršiaus plotą apskaičiavo ${a * b * c} cm². Koks jo paviršiaus plotas iš tikrųjų?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: 'Sudauginęs visus tris matmenis mokinys apskaičiavo tūrį, o ne paviršiaus plotą.',
      }),
  ])
}

// ── 11.1.4. Kubo paviršiaus plotas ──────────────────────────────────────────

const T4 = 'kubo-pavirsiaus-plotas'

const A_KUBO_PAVIRSIUS = [
  {
    klausimas: 'Kubo briauna yra 4 cm. Koks jo paviršiaus plotas?',
    atsakymas: '96',
    atsakymasRodymui: '$96$ cm²',
    sprendimas: '$4 \\cdot 4 \\cdot 6 = 96$.',
  },
] as const

export const kuboPavirsiausPlotas: Generatorius = () => suBandymais(kurkKuboPavirsiu, A_KUBO_PAVIRSIUS, T4)

function kurkKuboPavirsiu(): Uzdavinys | null {
  const k = atsitiktinis(2, 15)
  const plotas = 6 * k * k

  return variacija([
    // 1. Paviršiaus plotas
    () =>
      uzdavinys(T4, {
        klausimas: `Kubo briauna yra ${k} cm. Koks jo paviršiaus plotas?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `Vienos sienos plotas $${k} \\cdot ${k} = ${k * k}$ cm², sienų šešios: $${k * k} \\cdot 6 = ${plotas}$.`,
        brezinys: erdvesKunas('kubas'),
      }),

    // 2. Vienos sienos plotas
    () =>
      uzdavinys(T4, {
        klausimas: `Kubo briauna yra ${k} cm. Koks vienos jo sienos plotas?`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}$ cm²`,
        sprendimas: `Siena yra kvadratas: $${k} \\cdot ${k} = ${k * k}$.`,
      }),

    // 3. Briauna iš sienos ploto
    () =>
      uzdavinys(T4, {
        klausimas: `Kubo sienos plotas ${k * k} cm². Kokia jo briauna?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$ cm`,
        sprendimas: `Ieškomas skaičius, kurio kvadratas lygus ${k * k}: tai ${k}, nes $${k} \\cdot ${k} = ${k * k}$.`,
      }),

    // 4. Briauna iš paviršiaus ploto
    () =>
      uzdavinys(T4, {
        klausimas: `Kubo paviršiaus plotas ${plotas} cm². Koks vienos jo sienos plotas?`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}$ cm²`,
        sprendimas: `$${plotas} : 6 = ${k * k}$.`,
      }),

    // 5. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kaip apskaičiuojamas kubo paviršiaus plotas, kai briauna yra $a$?',
        variantai: ['$6a \\cdot a$', '$a \\cdot a \\cdot a$', '$4a$', '$12a$'],
        teisingas: 0,
        sprendimas: 'Šešios vienodos kvadratinės sienos.',
      }),

    // 6. Kaip keičiasi
    () =>
      uzdavinys(T4, {
        klausimas: `Kubo briauna ${k} cm padvigubinama. Kiek kartų padidėja jo paviršiaus plotas?`,
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: `Kiekviena siena padidėja 4 kartus: $${6 * 4 * k * k} : ${plotas} = 4$.`,
      }),

    // 7. Palyginimas su gretasieniu
    () => {
      const a = atsitiktinis(2, 8)
      const b = atsitiktinis(2, 8)
      const c = atsitiktinis(2, 8)
      const gretasienio = 2 * (a * b + a * c + b * c)
      if (gretasienio === plotas) return null
      return uzdavinys(T4, {
        klausimas: `Kubo briauna ${k} cm, o gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm. Kurio kūno paviršiaus plotas didesnis? Užrašyk tą plotą.`,
        atsakymas: String(Math.max(plotas, gretasienio)),
        atsakymasRodymui: `$${Math.max(plotas, gretasienio)}$ cm²`,
        sprendimas: `Kubo: $${plotas}$ cm², gretasienio: $${gretasienio}$ cm².`,
      })
    },

    // 8. Praktinis
    () => {
      if (plotas > 5000) return null
      return uzdavinys(T4, {
        klausimas: `Kubo formos dėžės briauna ${k} dm. Kiek kvadratinių decimetrų popieriaus reikės jai apklijuoti?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ dm²`,
        sprendimas: `$${k} \\cdot ${k} \\cdot 6 = ${plotas}$.`,
      })
    },
  ])
}

// ── 11.2.1. Tūris ───────────────────────────────────────────────────────────

const T5 = 'turis-5'

const A_TURIS = [
  {
    klausimas: 'Kuo matuojamas tūris?',
    atsakymas: 'kubiniais vienetais',
    atsakymasRodymui: 'Kubiniais vienetais, pavyzdžiui, cm³',
    sprendimas: 'Tūris rodo, kiek vienetinių kubelių telpa kūne.',
  },
] as const

export const turis5: Generatorius = () => suBandymais(kurkTuri, A_TURIS, T5)

function kurkTuri(): Uzdavinys | null {
  return variacija([
    // 1. Kas yra tūris
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Ką rodo kūno tūris?',
        variantai: [
          'kiek vienetinių kubelių telpa kūne',
          'kokio ploto yra kūno paviršius',
          'kokio ilgio yra kūno briaunos',
          'kiek sienų turi kūnas',
        ],
        teisingas: 0,
        sprendimas: 'Todėl tūris ir matuojamas kubiniais vienetais.',
      }),

    // 2. Kubelių skaičiavimas
    () => {
      const stulpeliai = [
        [2, 2, 1],
        [2, 1, 1],
      ]
      const viso = stulpeliai.flat().reduce((s, x) => s + x, 0)
      return uzdavinys(T5, {
        klausimas: 'Iš kiek vienetinių kubelių sudarytas pavaizduotas statinys?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: 'Suskaičiuojami visi kubeliai, taip pat ir tie, kurių iš priekio nematyti.',
        brezinys: kubeliuStatinys4(stulpeliai),
      })
    },

    // 3. Tūrio vienetai
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuris vienetas naudojamas tūriui matuoti?',
        variantai: ['cm³', 'cm²', 'cm', 'kg'],
        teisingas: 0,
        sprendimas: 'Trečias laipsnis rodo, kad matuojama trimis matmenimis.',
      }),

    // 4. Kiek cm³ dm³
    () => {
      const n = atsitiktinis(2, 9)
      return uzdavinys(T5, {
        klausimas: `Kiek kubinių centimetrų yra ${n} dm³?`,
        atsakymas: String(n * 1000),
        atsakymasRodymui: `$${sk4(n * 1000)}$ cm³`,
        sprendimas: `$1$ dm³ $= 10 \\cdot 10 \\cdot 10 = 1000$ cm³, tad $${n} \\cdot 1000 = ${sk4(n * 1000)}$.`,
      })
    },

    // 5. Kodėl 1000
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kodėl gretimi tūrio vienetai skiriasi 1000 kartų?',
        variantai: [
          'nes visi trys matmenys padidėja 10 kartų: $10 \\cdot 10 \\cdot 10$',
          'nes taip sutarta',
          'nes tūris visada didesnis už plotą',
          'nes kubas turi 1000 kubelių',
        ],
        teisingas: 0,
        sprendimas: 'Ilgio vienetai skiriasi 10, ploto — 100, tūrio — 1000 kartų.',
      }),

    // 6. Tūris ir paviršiaus plotas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuo tūris skiriasi nuo paviršiaus ploto?',
        variantai: [
          'tūris rodo, kiek telpa viduje, o plotas — kokio dydžio yra paviršius',
          'tai tas pats dydis',
          'tūris matuojamas cm², o plotas cm³',
          'tūris skaičiuojamas tik kubams',
        ],
        teisingas: 0,
        sprendimas: 'Todėl ir vienetai skirtingi: cm³ ir cm².',
      }),

    // 7. Sluoksniais
    () => {
      const a = atsitiktinis(2, 6)
      const b = atsitiktinis(2, 6)
      const c = atsitiktinis(2, 5)
      return uzdavinys(T5, {
        klausimas: `Dėžės dugne telpa ${a * b} kubeliai, o tokių sluoksnių yra ${c}. Kiek kubelių telpa dėžėje?`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$`,
        sprendimas: `$${a * b} \\cdot ${c} = ${a * b * c}$.`,
      })
    },

    // 8. Vienodo tūrio kūnai
    () =>
      uzdavinys(T5, {
        klausimas: 'Du kūnai sudaryti iš tiek pat vienodų kubelių, bet skirtingos formos. Ar jų tūriai lygūs?',
        atsakymas: 'taip',
        atsakymasRodymui: 'Taip',
        sprendimas: 'Tūrį lemia kubelių skaičius, ne jų išdėstymas.',
      }),
  ])
}

// ── 11.2.2. Stačiakampio gretasienio tūris ──────────────────────────────────

const T6 = 'gretasienio-turis'

const A_GRET_TURIS = [
  {
    klausimas: 'Stačiakampio gretasienio matmenys 3 cm, 4 cm ir 5 cm. Koks jo tūris?',
    atsakymas: '60',
    atsakymasRodymui: '$60$ cm³',
    sprendimas: '$3 \\cdot 4 \\cdot 5 = 60$.',
  },
] as const

export const gretasienioTuris: Generatorius = () => suBandymais(kurkGretTuri, A_GRET_TURIS, T6)

function kurkGretTuri(): Uzdavinys | null {
  const a = atsitiktinis(2, 12)
  const b = atsitiktinis(2, 12)
  const c = atsitiktinis(2, 12)
  const turis = a * b * c

  return variacija([
    // 1. Tūris
    () =>
      uzdavinys(T6, {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm. Koks jo tūris?`,
        atsakymas: String(turis),
        atsakymasRodymui: `$${sk4(turis)}$ cm³`,
        sprendimas: `$${a} \\cdot ${b} \\cdot ${c} = ${sk4(turis)}$.`,
        brezinys: gretasienisSuMatais(a, b, c),
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kaip apskaičiuojamas stačiakampio gretasienio tūris?',
        variantai: [
          'sudauginami visi trys matmenys',
          'sudedami visi trys matmenys',
          'pagrindo plotas dauginamas iš 6',
          'sudauginami du matmenys',
        ],
        teisingas: 0,
        sprendimas: 'Tai tas pat, kas pagrindo plotą padauginti iš aukščio.',
      }),

    // 3. Per pagrindo plotą
    () =>
      uzdavinys(T6, {
        klausimas: `Gretasienio pagrindo plotas ${a * b} cm², aukštis ${c} cm. Koks jo tūris?`,
        atsakymas: String(turis),
        atsakymasRodymui: `$${sk4(turis)}$ cm³`,
        sprendimas: `$${a * b} \\cdot ${c} = ${sk4(turis)}$.`,
      }),

    // 4. Trūkstamas matmuo
    () =>
      uzdavinys(T6, {
        klausimas: `Gretasienio tūris $${sk4(turis)}$ cm³, pagrindo plotas ${a * b} cm². Koks jo aukštis?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$ cm`,
        sprendimas: `$${sk4(turis)} : ${a * b} = ${c}$.`,
      }),

    // 5. Kiek kubelių telpa
    () =>
      uzdavinys(T6, {
        klausimas: `Kiek $1$ cm briaunos kubelių telpa dėžėje, kurios matmenys ${a} cm, ${b} cm ir ${c} cm?`,
        atsakymas: String(turis),
        atsakymasRodymui: `$${sk4(turis)}$`,
        sprendimas: `Tiek, koks yra dėžės tūris: $${a} \\cdot ${b} \\cdot ${c} = ${sk4(turis)}$.`,
      }),

    // 6. Kaip keičiasi
    () =>
      uzdavinys(T6, {
        klausimas: `Gretasienio aukštis ${c} cm padvigubinamas, kiti matmenys nesikeičia. Kiek kartų padidėja tūris?`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Vienas daugiklis padvigubėja, tad ir sandauga padvigubėja.',
      }),

    // 7. Palyginimas
    () => {
      const x = atsitiktinis(2, 10)
      const y = atsitiktinis(2, 10)
      const z = atsitiktinis(2, 10)
      if (x * y * z === turis) return null
      return uzdavinys(T6, {
        klausimas: `Vienos dėžės matmenys ${a} cm, ${b} cm ir ${c} cm, kitos — ${x} cm, ${y} cm ir ${z} cm. Kurios dėžės tūris didesnis? Užrašyk jį.`,
        atsakymas: String(Math.max(turis, x * y * z)),
        atsakymasRodymui: `$${sk4(Math.max(turis, x * y * z))}$ cm³`,
        sprendimas: `$${sk4(turis)}$ cm³ ir $${sk4(x * y * z)}$ cm³.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: `Mokinys gretasienio, kurio matmenys ${a} cm, ${b} cm ir ${c} cm, tūrį apskaičiavo ${a + b + c} cm³. Koks jo tūris iš tikrųjų?`,
        atsakymas: String(turis),
        atsakymasRodymui: `$${sk4(turis)}$ cm³`,
        sprendimas: 'Matmenys sudauginami, o ne sudedami.',
      }),
  ])
}

// ── 11.2.3. Kubo tūris ──────────────────────────────────────────────────────

const T7 = 'kubo-turis'

const A_KUBO_TURIS = [
  {
    klausimas: 'Kubo briauna yra 4 cm. Koks jo tūris?',
    atsakymas: '64',
    atsakymasRodymui: '$64$ cm³',
    sprendimas: '$4 \\cdot 4 \\cdot 4 = 64$.',
  },
] as const

export const kuboTuris: Generatorius = () => suBandymais(kurkKuboTuri, A_KUBO_TURIS, T7)

function kurkKuboTuri(): Uzdavinys | null {
  const k = atsitiktinis(2, 12)
  const turis = k * k * k

  return variacija([
    // 1. Tūris
    () =>
      uzdavinys(T7, {
        klausimas: `Kubo briauna yra ${k} cm. Koks jo tūris?`,
        atsakymas: String(turis),
        atsakymasRodymui: `$${sk4(turis)}$ cm³`,
        sprendimas: `$${k} \\cdot ${k} \\cdot ${k} = ${sk4(turis)}$.`,
        brezinys: erdvesKunas('kubas'),
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kaip apskaičiuojamas kubo tūris, kai briauna yra $a$?',
        variantai: ['$a \\cdot a \\cdot a$', '$6a \\cdot a$', '$3a$', '$12a$'],
        teisingas: 0,
        sprendimas: 'Visi trys kubo matmenys vienodi.',
      }),

    // 3. Briauna iš tūrio
    () =>
      uzdavinys(T7, {
        klausimas: `Kubo tūris ${sk4(turis)} cm³. Kokia jo briauna?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$ cm`,
        sprendimas: `Ieškomas skaičius, kurį padauginus patį iš savęs tris kartus gaunama ${sk4(turis)}: $${k} \\cdot ${k} \\cdot ${k} = ${sk4(turis)}$.`,
      }),

    // 4. Kaip keičiasi
    () =>
      uzdavinys(T7, {
        klausimas: `Kubo briauna ${k} cm padvigubinama. Kiek kartų padidėja jo tūris?`,
        atsakymas: '8',
        atsakymasRodymui: '$8$',
        sprendimas: `Visi trys matmenys padvigubėja: $2 \\cdot 2 \\cdot 2 = 8$.`,
      }),

    // 5. Iš kubelių
    () => {
      const n = atsitiktinis(2, 5)
      return uzdavinys(T7, {
        klausimas: `Iš kiek $1$ cm briaunos kubelių sudėtas kubas, kurio briauna ${n} cm?`,
        atsakymas: String(n * n * n),
        atsakymasRodymui: `$${n * n * n}$`,
        sprendimas: `$${n} \\cdot ${n} \\cdot ${n} = ${n * n * n}$.`,
      })
    },

    // 6. Tūris ir paviršiaus plotas
    () =>
      uzdavinys(T7, {
        klausimas: `Kubo briauna ${k} cm. Kiek jo tūrio skaitinė reikšmė didesnė už vienos sienos ploto skaitinę reikšmę?`,
        atsakymas: String(turis - k * k),
        atsakymasRodymui: `$${sk4(turis - k * k)}$`,
        sprendimas: `Tūris $${sk4(turis)}$, sienos plotas $${k * k}$: $${sk4(turis)} - ${k * k} = ${sk4(turis - k * k)}$.`,
      }),

    // 7. Kubas dėžėje
    () => {
      const n = atsitiktinis(2, 4)
      return uzdavinys(T7, {
        klausimas: `Kiek ${n} cm briaunos kubelių telpa dėžėje, kurios briauna ${2 * n} cm?`,
        atsakymas: '8',
        atsakymasRodymui: '$8$',
        sprendimas: `Kiekvienoje kryptyje telpa po 2 kubelius: $2 \\cdot 2 \\cdot 2 = 8$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Mokinys kubo su ${k} cm briauna tūrį apskaičiavo ${6 * k * k} cm³. Koks jo tūris iš tikrųjų?`,
        atsakymas: String(turis),
        atsakymasRodymui: `$${sk4(turis)}$ cm³`,
        sprendimas: 'Mokinys apskaičiavo paviršiaus plotą — tūriui briauna dauginama pati iš savęs tris kartus.',
      }),
  ])
}

// ── 11.2.4. Talpa ───────────────────────────────────────────────────────────

const T8 = 'talpa-5'

const A_TALPA = [
  {
    klausimas: 'Kiek litrų yra 1 dm³?',
    atsakymas: '1',
    atsakymasRodymui: '$1$ l',
    sprendimas: '$1$ dm³ $= 1$ l.',
  },
] as const

export const talpa5: Generatorius = () => suBandymais(kurkTalpa, A_TALPA, T8)

function kurkTalpa(): Uzdavinys | null {
  const a = atsitiktinis(2, 10)
  const b = atsitiktinis(2, 10)
  const c = atsitiktinis(2, 10)
  const litrai = atsitiktinis(2, 40)

  return variacija([
    // 1. dm³ ir litras
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek litrų telpa į indą, kurio tūris 1 dm³?',
        atsakymas: '1',
        atsakymasRodymui: '$1$ l',
        sprendimas: 'Litras ir kubinis decimetras yra tas pats dydis.',
      }),

    // 2. Iš matmenų į litrus
    () =>
      uzdavinys(T8, {
        klausimas: `Indo, kurio matmenys ${a} dm, ${b} dm ir ${c} dm, talpa. Kiek litrų į jį telpa?`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${sk4(a * b * c)}$ l`,
        sprendimas: `Tūris $${a} \\cdot ${b} \\cdot ${c} = ${sk4(a * b * c)}$ dm³, o $1$ dm³ $= 1$ l.`,
        brezinys: gretasienisSuMatais(a, b, c),
      }),

    // 3. Mililitrai
    () =>
      uzdavinys(T8, {
        klausimas: `Kiek mililitrų yra ${litrai} l?`,
        atsakymas: String(litrai * 1000),
        atsakymasRodymui: `$${sk4(litrai * 1000)}$ ml`,
        sprendimas: `$1$ l $= 1000$ ml, tad $${litrai} \\cdot 1000 = ${sk4(litrai * 1000)}$.`,
      }),

    // 4. cm³ ir ml
    () => {
      const ml = atsitiktinis(50, 900)
      return uzdavinys(T8, {
        klausimas: `Kiek kubinių centimetrų yra ${ml} ml?`,
        atsakymas: String(ml),
        atsakymasRodymui: `$${ml}$ cm³`,
        sprendimas: '$1$ ml $= 1$ cm³.',
      })
    },

    // 5. Kiek indų
    () => {
      const indas = pasirink([2, 5, 10])
      const viso = indas * atsitiktinis(3, 12)
      return uzdavinys(T8, {
        klausimas: `Iš ${viso} l talpos statinės vanduo perpilamas į ${indas} l indus. Kiek indų prireiks?`,
        atsakymas: String(viso / indas),
        atsakymasRodymui: `$${viso / indas}$`,
        sprendimas: `$${viso} : ${indas} = ${viso / indas}$.`,
      })
    },

    // 6. Iš cm³ į litrus
    () => {
      const litru = atsitiktinis(2, 20)
      return uzdavinys(T8, {
        klausimas: `Kiek litrų yra $${sk4(litru * 1000)}$ cm³?`,
        atsakymas: String(litru),
        atsakymasRodymui: `$${litru}$ l`,
        sprendimas: `$1$ l $= 1000$ cm³, tad $${sk4(litru * 1000)} : 1000 = ${litru}$.`,
      })
    },

    // 7. Dalinai pripildytas
    () => {
      const talpa = a * b * c
      if (talpa % 2 !== 0) return null
      return uzdavinys(T8, {
        klausimas: `Indas, kurio matmenys ${a} dm, ${b} dm ir ${c} dm, pripildytas iki pusės. Kiek litrų vandens jame yra?`,
        atsakymas: String(talpa / 2),
        atsakymasRodymui: `$${sk4(talpa / 2)}$ l`,
        sprendimas: `Visa talpa $${sk4(talpa)}$ l; $${sk4(talpa)} : 2 = ${sk4(talpa / 2)}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T8, {
        klausimas: `Mokinys teigia, kad ${litrai} l yra ${sk4(litrai * 100)} ml. Kiek mililitrų yra iš tikrųjų?`,
        atsakymas: String(litrai * 1000),
        atsakymasRodymui: `$${sk4(litrai * 1000)}$ ml`,
        sprendimas: 'Litre yra 1000, o ne 100 mililitrų.',
      }),
  ])
}
