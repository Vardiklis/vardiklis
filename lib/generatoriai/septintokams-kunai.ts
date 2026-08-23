import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { skritulineDiagrama } from './ketvirtokams-duomenu-vaizdai'
import { ritinysArKugis, staciojiPrizme, taisyklingojiPiramide } from './septintokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 7 klasės temos „Stačioji prizmė ir taisyklingoji piramidė“, „Ritinys ir
 * kūgis“ bei „Duomenys“ — keturiolika potemių.
 *
 * Ritinio ir kūgio uždaviniuose atsakymo su $\pi$ suvesti neįmanoma, tad
 * klausiama koeficiento prie $\pi$ arba apytikslės reikšmės, kai
 * $\pi \approx 3$ — taip mokinys vis tiek taiko formulę.
 */

// ── 10.1. Tiesės ir plokštumos erdvėje ──────────────────────────────────────

const T1 = 'tieses-ir-plokstumos'

const A_ERDVE = [
  {
    klausimas: 'Kiek plokštumų galima nubrėžti per tris taškus, nesančius vienoje tiesėje?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: 'Trys tokie taškai plokštumą apibrėžia vienareikšmiškai.',
  },
] as const

export const tiesesIrPlokstumos: Generatorius = () => suBandymais(kurkErdve, A_ERDVE, T1)

function kurkErdve(): Uzdavinys | null {
  return variacija([
    // 1. Per tris taškus
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek plokštumų galima nubrėžti per tris taškus, nesančius vienoje tiesėje?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Tai plokštumos aksioma.',
      }),

    // 2. Prasilenkiančios tiesės
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kokios tiesės erdvėje vadinamos prasilenkiančiomis?',
        variantai: [
          'nesusikertančios ir nesančios vienoje plokštumoje',
          'nesusikertančios ir esančios vienoje plokštumoje',
          'susikertančios stačiu kampu',
          'sutampančios tiesės',
        ],
        teisingas: 0,
        sprendimas: 'Lygiagrečiosios tiesės, priešingai, guli vienoje plokštumoje.',
      }),

    // 3. Tiesės ir plokštumos padėtys
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Sujunk tiesės ir plokštumos padėtį su jos požymiu.',
        poros: [
          { kaire: 'tiesė plokštumoje', desine: 'visi tiesės taškai priklauso plokštumai' },
          { kaire: 'tiesė kerta plokštumą', desine: 'vienas bendras taškas' },
          { kaire: 'tiesė lygiagreti plokštumai', desine: 'bendrų taškų nėra' },
          { kaire: 'prasilenkiančios tiesės', desine: 'nėra bendros plokštumos' },
        ],
        sprendimas: 'Bendrų taškų skaičius ir nulemia padėtį.',
      }),

    // 4. Kiek bendrų taškų
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kiek bendrų taškų turi tiesė, kertanti plokštumą?',
        variantai: ['vieną', 'du', 'nė vieno', 'be galo daug'],
        teisingas: 0,
        sprendimas: 'Jei bendrų taškų būtų du, visa tiesė gulėtų plokštumoje.',
      }),

    // 5. Dvi plokštumos
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kas gaunama susikirtus dviem plokštumoms?',
        variantai: ['tiesė', 'taškas', 'plokštuma', 'atkarpa'],
        teisingas: 0,
        sprendimas: 'Susikirtimo linija yra tiesė.',
      }),

    // 6. Kubo briaunos
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kokios yra dvi kubo briaunos, esančios skirtingose sienose ir nesikertančios?',
        variantai: ['prasilenkiančios arba lygiagrečios', 'visada susikertančios', 'visada lygiagrečios', 'sutampančios'],
        teisingas: 0,
        sprendimas: 'Erdvėje nesikertančios tiesės nebūtinai yra lygiagrečios.',
      }),

    // 7. Per tiesę ir tašką
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek plokštumų galima nubrėžti per tiesę ir jai nepriklausantį tašką?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Tiesė ir taškas kartu duoda tris taškus, nesančius vienoje tiesėje.',
      }),
  ])
}

// ── 10.2. Stačioji prizmė ───────────────────────────────────────────────────

const T2 = 'stacioji-prizme'

const A_PRIZME = [
  {
    klausimas: 'Kiek sienų turi trikampė prizmė?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Du trikampiai pagrindai ir trys šoninės sienos.',
  },
] as const

export const staciojiPrizme7: Generatorius = () => suBandymais(kurkPrizme, A_PRIZME, T2)

function kurkPrizme(): Uzdavinys | null {
  const n = pasirink([3, 4, 5, 6])
  const a = atsitiktinis(3, 12)
  const h = atsitiktinis(4, 15)

  return variacija([
    // 1. Kiek sienų
    () =>
      uzdavinys(T2, {
        klausimas: `Kiek sienų turi prizmė, kurios pagrindas yra ${n} kraštinių daugiakampis?`,
        atsakymas: String(n + 2),
        atsakymasRodymui: `$${n + 2}$`,
        sprendimas: `${n} šoninės sienos ir du pagrindai: $${n} + 2 = ${n + 2}$.`,
        brezinys: staciojiPrizme(n === 3 ? 3 : 4),
      }),

    // 2. Kiek briaunų
    () =>
      uzdavinys(T2, {
        klausimas: `Kiek briaunų turi prizmė, kurios pagrindas yra ${n} kraštinių daugiakampis?`,
        atsakymas: String(3 * n),
        atsakymasRodymui: `$${3 * n}$`,
        sprendimas: `Po ${n} briaunas abiejuose pagrinduose ir ${n} šoninės: $${n} \\cdot 3 = ${3 * n}$.`,
      }),

    // 3. Kiek viršūnių
    () =>
      uzdavinys(T2, {
        klausimas: `Kiek viršūnių turi prizmė, kurios pagrindas yra ${n} kraštinių daugiakampis?`,
        atsakymas: String(2 * n),
        atsakymasRodymui: `$${2 * n}$`,
        sprendimas: `Po ${n} viršūnes abiejuose pagrinduose.`,
      }),

    // 4. Kas yra stačioji prizmė
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kokia prizmė vadinama stačiąja?',
        variantai: [
          'kurios šoninės briaunos statmenos pagrindams',
          'kurios pagrindas yra statusis trikampis',
          'kurios visos sienos yra kvadratai',
          'kuri stovi ant pagrindo',
        ],
        teisingas: 0,
        sprendimas: 'Tada šoninės sienos yra stačiakampiai.',
        brezinys: staciojiPrizme(3, { a: `${a} cm`, h: `${h} cm` }),
      }),

    // 5. Šoninio paviršiaus plotas
    () =>
      uzdavinys(T2, {
        klausimas: `Stačiosios prizmės pagrindo perimetras ${n * a} cm, aukštinė ${h} cm. Koks šoninio paviršiaus plotas?`,
        atsakymas: String(n * a * h),
        atsakymasRodymui: `$${n * a * h}$ cm²`,
        sprendimas: `$S = Ph = ${n * a} \\cdot ${h} = ${n * a * h}$.`,
      }),

    // 6. Šoninės sienos forma
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kokios formos yra stačiosios prizmės šoninės sienos?',
        variantai: ['stačiakampiai', 'trikampiai', 'trapecijos', 'rombai'],
        teisingas: 0,
        sprendimas: 'Šoninės briaunos statmenos pagrindams, tad sienos yra stačiakampiai.',
      }),

    // 7. Pilnas paviršiaus plotas
    () => {
      const pagrindoPlotas = atsitiktinis(6, 40)
      return uzdavinys(T2, {
        klausimas: `Stačiosios prizmės pagrindo plotas ${pagrindoPlotas} cm², šoninio paviršiaus plotas ${n * a * h} cm². Koks pilnas paviršiaus plotas?`,
        atsakymas: String(n * a * h + 2 * pagrindoPlotas),
        atsakymasRodymui: `$${n * a * h + 2 * pagrindoPlotas}$ cm²`,
        sprendimas: `Prie šoninio paviršiaus pridedami abu pagrindai: $${n * a * h} + 2 \\cdot ${pagrindoPlotas} = ${n * a * h + 2 * pagrindoPlotas}$.`,
      })
    },
  ])
}

// ── 10.3. Stačiosios prizmės tūris ──────────────────────────────────────────

const T3 = 'prizmes-turis'

const A_PRIZMES_TURIS = [
  {
    klausimas: 'Prizmės pagrindo plotas 12 cm², aukštinė 5 cm. Koks jos tūris?',
    atsakymas: '60',
    atsakymasRodymui: '$60$ cm³',
    sprendimas: '$V = Sh = 12 \\cdot 5 = 60$.',
  },
] as const

export const prizmesTuris: Generatorius = () => suBandymais(kurkPrizmesTuri, A_PRIZMES_TURIS, T3)

function kurkPrizmesTuri(): Uzdavinys | null {
  const S = atsitiktinis(4, 40)
  const h = atsitiktinis(3, 15)

  return variacija([
    // 1. Tūris
    () =>
      uzdavinys(T3, {
        klausimas: `Prizmės pagrindo plotas ${S} cm², aukštinė ${h} cm. Koks jos tūris?`,
        atsakymas: String(S * h),
        atsakymasRodymui: `$${S * h}$ cm³`,
        sprendimas: `$V = Sh = ${S} \\cdot ${h} = ${S * h}$.`,
        brezinys: staciojiPrizme(4, { h: `${h} cm` }),
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kokia yra prizmės tūrio formulė?',
        variantai: ['$V = Sh$', '$V = \\dfrac{Sh}{3}$', '$V = Ph$', '$V = S + h$'],
        teisingas: 0,
        sprendimas: '$S$ — pagrindo plotas, $h$ — aukštinė.',
      }),

    // 3. Aukštinė iš tūrio
    () =>
      uzdavinys(T3, {
        klausimas: `Prizmės tūris ${S * h} cm³, pagrindo plotas ${S} cm². Kokio ilgio jos aukštinė?`,
        atsakymas: String(h),
        atsakymasRodymui: `$${h}$ cm`,
        sprendimas: `$${S * h} : ${S} = ${h}$.`,
      }),

    // 4. Pagrindo plotas iš tūrio
    () =>
      uzdavinys(T3, {
        klausimas: `Prizmės tūris ${S * h} cm³, aukštinė ${h} cm. Koks pagrindo plotas?`,
        atsakymas: String(S),
        atsakymasRodymui: `$${S}$ cm²`,
        sprendimas: `$${S * h} : ${h} = ${S}$.`,
      }),

    // 5. Stačiakampė prizmė
    () => {
      const a = atsitiktinis(2, 10)
      const b = atsitiktinis(2, 10)
      return uzdavinys(T3, {
        klausimas: `Stačiosios prizmės pagrindas — stačiakampis ${a} cm ir ${b} cm, aukštinė ${h} cm. Koks tūris?`,
        atsakymas: String(a * b * h),
        atsakymasRodymui: `$${a * b * h}$ cm³`,
        sprendimas: `Pagrindo plotas $${a} \\cdot ${b} = ${a * b}$; $V = ${a * b} \\cdot ${h} = ${a * b * h}$.`,
      })
    },

    // 6. Trikampė prizmė
    () => {
      const a = atsitiktinis(3, 12)
      const ha = atsitiktinis(2, 10)
      if ((a * ha) % 2 !== 0) return null
      const pagrindas = (a * ha) / 2
      return uzdavinys(T3, {
        klausimas: `Trikampės prizmės pagrindo kraštinė ${a} cm, į ją nuleista aukštinė ${ha} cm, prizmės aukštinė ${h} cm. Koks tūris?`,
        atsakymas: String(pagrindas * h),
        atsakymasRodymui: `$${pagrindas * h}$ cm³`,
        sprendimas: `Pagrindo plotas $${a} \\cdot ${ha} : 2 = ${pagrindas}$; $V = ${pagrindas} \\cdot ${h} = ${pagrindas * h}$.`,
        brezinys: staciojiPrizme(3, { a: `${a} cm`, h: `${h} cm` }),
      })
    },

    // 7. Kiek kartų padidės
    () =>
      uzdavinys(T3, {
        klausimas: 'Prizmės aukštinė padidinta 3 kartus, pagrindas nesikeičia. Kiek kartų padidėja tūris?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Tūris tiesiogiai proporcingas aukštinei.',
      }),
  ])
}

// ── 10.4. Piramidė ──────────────────────────────────────────────────────────

const T4 = 'piramide-7'

const A_PIRAMIDE = [
  {
    klausimas: 'Kiek sienų turi keturkampė piramidė?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Pagrindas ir keturios šoninės sienos.',
  },
] as const

export const piramide7: Generatorius = () => suBandymais(kurkPiramide, A_PIRAMIDE, T4)

function kurkPiramide(): Uzdavinys | null {
  const n = pasirink([3, 4, 5, 6])

  return variacija([
    // 1. Kiek sienų
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek sienų turi piramidė, kurios pagrindas yra ${n} kraštinių daugiakampis?`,
        atsakymas: String(n + 1),
        atsakymasRodymui: `$${n + 1}$`,
        sprendimas: `${n} šoninės sienos ir vienas pagrindas.`,
        brezinys: taisyklingojiPiramide(),
      }),

    // 2. Kiek briaunų
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek briaunų turi piramidė, kurios pagrindas yra ${n} kraštinių daugiakampis?`,
        atsakymas: String(2 * n),
        atsakymasRodymui: `$${2 * n}$`,
        sprendimas: `${n} pagrindo briaunos ir ${n} šoninės.`,
      }),

    // 3. Kiek viršūnių
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek viršūnių turi piramidė, kurios pagrindas yra ${n} kraštinių daugiakampis?`,
        atsakymas: String(n + 1),
        atsakymasRodymui: `$${n + 1}$`,
        sprendimas: `${n} pagrindo viršūnės ir viena piramidės viršūnė.`,
      }),

    // 4. Šoninių sienų forma
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kokios formos yra piramidės šoninės sienos?',
        variantai: ['trikampiai', 'stačiakampiai', 'trapecijos', 'kvadratai'],
        teisingas: 0,
        sprendimas: 'Visos šoninės sienos susieina viename taške — piramidės viršūnėje.',
        brezinys: taisyklingojiPiramide(),
      }),

    // 5. Kuo skiriasi nuo prizmės
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuo piramidė skiriasi nuo prizmės?',
        variantai: [
          'piramidė turi vieną pagrindą, o prizmė — du',
          'piramidė turi daugiau sienų',
          'piramidės pagrindas visada trikampis',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Piramidės šoninės sienos yra trikampiai, prizmės — stačiakampiai.',
      }),

    // 6. Aukštinė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kas yra piramidės aukštinė?',
        variantai: [
          'statmuo iš viršūnės į pagrindo plokštumą',
          'šoninė briauna',
          'pagrindo kraštinė',
          'šoninės sienos aukštinė',
        ],
        teisingas: 0,
        sprendimas: 'Šoninės sienos aukštinė vadinama apotema.',
        brezinys: taisyklingojiPiramide({ h: 'h' }),
      }),

    // 7. Poros
    () =>
      poruUzdavinys(naujasId(T4), T4, {
        klausimas: 'Sujunk kūną su jo šoninių sienų forma.',
        poros: [
          { kaire: 'stačioji prizmė', desine: 'stačiakampiai' },
          { kaire: 'piramidė', desine: 'trikampiai' },
          { kaire: 'ritinys', desine: 'išlenktas paviršius' },
          { kaire: 'kūgis', desine: 'išlenktas paviršius' },
        ],
        sprendimas: 'Ritinys ir kūgis plokščių šoninių sienų neturi.',
      }),
  ])
}

// ── 10.5. Taisyklingoji piramidė ir jos tūris ───────────────────────────────

const T5 = 'piramides-turis'

const A_PIR_TURIS = [
  {
    klausimas: 'Piramidės pagrindo plotas 18 cm², aukštinė 5 cm. Koks jos tūris?',
    atsakymas: '30',
    atsakymasRodymui: '$30$ cm³',
    sprendimas: '$V = \\dfrac{Sh}{3} = \\dfrac{18 \\cdot 5}{3} = 30$.',
  },
] as const

export const piramidesTuris: Generatorius = () => suBandymais(kurkPiramidesTuri, A_PIR_TURIS, T5)

function kurkPiramidesTuri(): Uzdavinys | null {
  const S = atsitiktinis(2, 20) * 3
  const h = atsitiktinis(3, 15)
  const turis = (S * h) / 3

  return variacija([
    // 1. Tūris
    () =>
      uzdavinys(T5, {
        klausimas: `Piramidės pagrindo plotas ${S} cm², aukštinė ${h} cm. Koks jos tūris?`,
        atsakymas: String(turis),
        atsakymasRodymui: `$${turis}$ cm³`,
        sprendimas: `$V = \\dfrac{Sh}{3} = \\dfrac{${S} \\cdot ${h}}{3} = ${turis}$.`,
        brezinys: taisyklingojiPiramide({ h: `${h} cm` }),
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kokia yra piramidės tūrio formulė?',
        variantai: ['$V = \\dfrac{Sh}{3}$', '$V = Sh$', '$V = \\dfrac{Sh}{2}$', '$V = 3Sh$'],
        teisingas: 0,
        sprendimas: 'Piramidės tūris tris kartus mažesnis už tokio pat pagrindo ir aukštinės prizmės tūrį.',
      }),

    // 3. Kas yra taisyklingoji
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kokia piramidė vadinama taisyklingąja?',
        variantai: [
          'kurios pagrindas yra taisyklingasis daugiakampis, o aukštinė krinta į jo centrą',
          'kurios visos sienos lygios',
          'kurios pagrindas yra kvadratas',
          'kurios aukštinė lygi kraštinei',
        ],
        teisingas: 0,
        sprendimas: 'Tada visos šoninės sienos yra lygūs lygiašoniai trikampiai.',
      }),

    // 4. Aukštinė iš tūrio
    () =>
      uzdavinys(T5, {
        klausimas: `Piramidės tūris ${turis} cm³, pagrindo plotas ${S} cm². Kokio ilgio jos aukštinė?`,
        atsakymas: String(h),
        atsakymasRodymui: `$${h}$ cm`,
        sprendimas: `$${turis} \\cdot 3 : ${S} = ${h}$.`,
      }),

    // 5. Pagrindo plotas iš tūrio
    () =>
      uzdavinys(T5, {
        klausimas: `Piramidės tūris ${turis} cm³, aukštinė ${h} cm. Koks pagrindo plotas?`,
        atsakymas: String(S),
        atsakymasRodymui: `$${S}$ cm²`,
        sprendimas: `$${turis} \\cdot 3 : ${h} = ${S}$.`,
      }),

    // 6. Kvadratinis pagrindas
    () => {
      const a = atsitiktinis(3, 12)
      if ((a * a * h) % 3 !== 0) return null
      return uzdavinys(T5, {
        klausimas: `Taisyklingosios keturkampės piramidės pagrindo kraštinė ${a} cm, aukštinė ${h} cm. Koks jos tūris?`,
        atsakymas: String((a * a * h) / 3),
        atsakymasRodymui: `$${(a * a * h) / 3}$ cm³`,
        sprendimas: `Pagrindo plotas $${a * a}$ cm²; $V = \\dfrac{${a * a} \\cdot ${h}}{3} = ${(a * a * h) / 3}$.`,
        brezinys: taisyklingojiPiramide({ a: `${a} cm`, h: `${h} cm` }),
      })
    },

    // 7. Palyginimas su prizme
    () =>
      uzdavinys(T5, {
        klausimas: `Prizmės ir piramidės pagrindai bei aukštinės vienodi, o prizmės tūris ${S * h} cm³. Koks piramidės tūris?`,
        atsakymas: String(turis),
        atsakymasRodymui: `$${turis}$ cm³`,
        sprendimas: `$${S * h} : 3 = ${turis}$.`,
      }),
  ])
}

// ── 11.1. Ritinys ───────────────────────────────────────────────────────────

const T6 = 'ritinys-7'

const A_RITINYS = [
  {
    klausimas: 'Kokios formos yra ritinio pagrindas?',
    atsakymas: 'skritulys',
    atsakymasRodymui: 'Skritulys',
    sprendimas: 'Ritinys turi du lygius skritulinius pagrindus.',
  },
] as const

export const ritinys7: Generatorius = () => suBandymais(kurkRitini, A_RITINYS, T6)

function kurkRitini(): Uzdavinys | null {
  const r = atsitiktinis(2, 12)
  const h = atsitiktinis(3, 15)

  return variacija([
    // 1. Pagrindo forma
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kokios formos yra ritinio pagrindas?',
        variantai: ['skritulys', 'kvadratas', 'trikampis', 'stačiakampis'],
        teisingas: 0,
        sprendimas: 'Ritinys turi du lygius skritulinius pagrindus.',
        brezinys: ritinysArKugis('ritinys', { r: 'r', h: 'h' }),
      }),

    // 2. Išklotinė
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kokia figūra gaunama išklojus ritinio šoninį paviršių?',
        variantai: ['stačiakampis', 'skritulys', 'trikampis', 'skritulio sektorius'],
        teisingas: 0,
        sprendimas: 'Stačiakampio viena kraštinė lygi pagrindo apskritimo ilgiui, kita — aukštinei.',
      }),

    // 3. Kiek pagrindų
    () =>
      uzdavinys(T6, {
        klausimas: 'Kiek pagrindų turi ritinys?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Abu pagrindai lygūs ir lygiagretūs.',
      }),

    // 4. Kaip gaunamas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kaip gaunamas ritinys sukant plokščią figūrą?',
        variantai: [
          'sukant stačiakampį apie jo kraštinę',
          'sukant trikampį apie statinį',
          'sukant skritulį apie skersmenį',
          'sukant kvadratą apie įstrižainę',
        ],
        teisingas: 0,
        sprendimas: 'Sukant statųjį trikampį apie statinį gaunamas kūgis.',
      }),

    // 5. Išklotinės kraštinė
    () =>
      uzdavinys(T6, {
        klausimas: `Ritinio pagrindo spindulys ${r} cm. Kokio ilgio yra šoninio paviršiaus išklotinės kraštinė, atitinkanti pagrindo apskritimą? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(2 * r),
        atsakymasRodymui: `$${2 * r}\\pi$ cm`,
        sprendimas: `Ji lygi pagrindo apskritimo ilgiui: $2\\pi r = ${2 * r}\\pi$.`,
      }),

    // 6. Ašinis pjūvis
    () =>
      uzdavinys(T6, {
        klausimas: `Ritinio spindulys ${r} cm, aukštinė ${h} cm. Koks yra ašinio pjūvio (stačiakampio) plotas?`,
        atsakymas: String(2 * r * h),
        atsakymasRodymui: `$${2 * r * h}$ cm²`,
        sprendimas: `Pjūvio kraštinės lygios skersmeniui ir aukštinei: $${2 * r} \\cdot ${h} = ${2 * r * h}$.`,
      }),

    // 7. Poros
    () =>
      poruUzdavinys(naujasId(T6), T6, {
        klausimas: 'Sujunk kūną su tuo, kaip jis gaunamas sukant figūrą.',
        poros: [
          { kaire: 'ritinys', desine: 'sukant stačiakampį' },
          { kaire: 'kūgis', desine: 'sukant statųjį trikampį' },
          { kaire: 'rutulys', desine: 'sukant pusskritulį' },
          { kaire: 'prizmė', desine: 'sukimu negaunama' },
        ],
        sprendimas: 'Sukimu gaunami tik sukiniai — ritinys, kūgis ir rutulys.',
      }),
  ])
}

// ── 11.2. Ritinio paviršiaus plotas ir tūris ────────────────────────────────

const T7 = 'ritinio-plotas-turis'

const A_RIT_PLOTAS = [
  {
    klausimas: 'Ritinio spindulys 3 cm, aukštinė 5 cm. Koks jo tūris? Užrašyk koeficientą prie $\\pi$.',
    atsakymas: '45',
    atsakymasRodymui: '$45\\pi$ cm³',
    sprendimas: '$V = \\pi r^2 h = \\pi \\cdot 9 \\cdot 5$.',
  },
] as const

export const ritinioPlotasTuris: Generatorius = () => suBandymais(kurkRitinioPlota, A_RIT_PLOTAS, T7)

function kurkRitinioPlota(): Uzdavinys | null {
  const r = atsitiktinis(2, 10)
  const h = atsitiktinis(3, 12)

  return variacija([
    // 1. Tūris
    () =>
      uzdavinys(T7, {
        klausimas: `Ritinio pagrindo spindulys ${r} cm, aukštinė ${h} cm. Koks jo tūris? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(r * r * h),
        atsakymasRodymui: `$${r * r * h}\\pi$ cm³`,
        sprendimas: `$V = \\pi r^2 h = \\pi \\cdot ${r * r} \\cdot ${h} = ${r * r * h}\\pi$.`,
        brezinys: ritinysArKugis('ritinys', { r: `${r}`, h: `${h}` }),
      }),

    // 2. Tūrio formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kokia yra ritinio tūrio formulė?',
        variantai: ['$V = \\pi r^2 h$', '$V = 2\\pi r h$', '$V = \\dfrac{\\pi r^2 h}{3}$', '$V = \\pi r h$'],
        teisingas: 0,
        sprendimas: 'Tūris yra pagrindo plotas, padaugintas iš aukštinės.',
      }),

    // 3. Šoninio paviršiaus plotas
    () =>
      uzdavinys(T7, {
        klausimas: `Ritinio spindulys ${r} cm, aukštinė ${h} cm. Koks šoninio paviršiaus plotas? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(2 * r * h),
        atsakymasRodymui: `$${2 * r * h}\\pi$ cm²`,
        sprendimas: `$S = 2\\pi r h = 2 \\cdot ${r} \\cdot ${h} \\cdot \\pi = ${2 * r * h}\\pi$.`,
      }),

    // 4. Pilnas paviršiaus plotas
    () =>
      uzdavinys(T7, {
        klausimas: `Ritinio spindulys ${r} cm, aukštinė ${h} cm. Koks pilnas paviršiaus plotas? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(2 * r * h + 2 * r * r),
        atsakymasRodymui: `$${2 * r * h + 2 * r * r}\\pi$ cm²`,
        sprendimas: `Šoninis $${2 * r * h}\\pi$ ir du pagrindai po $${r * r}\\pi$: $${2 * r * h + 2 * r * r}\\pi$.`,
      }),

    // 5. Apytikslis tūris
    () =>
      uzdavinys(T7, {
        klausimas: `Ritinio spindulys ${r} cm, aukštinė ${h} cm. Koks apytikslis jo tūris, kai $\\pi \\approx 3$?`,
        atsakymas: String(3 * r * r * h),
        atsakymasRodymui: `$${3 * r * r * h}$ cm³`,
        sprendimas: `$3 \\cdot ${r * r} \\cdot ${h} = ${3 * r * r * h}$.`,
      }),

    // 6. Aukštinė iš tūrio
    () =>
      uzdavinys(T7, {
        klausimas: `Ritinio tūris $${r * r * h}\\pi$ cm³, pagrindo spindulys ${r} cm. Kokio ilgio jo aukštinė?`,
        atsakymas: String(h),
        atsakymasRodymui: `$${h}$ cm`,
        sprendimas: `$${r * r * h}\\pi : (${r * r}\\pi) = ${h}$.`,
      }),

    // 7. Kiek kartų padidės tūris
    () =>
      uzdavinys(T7, {
        klausimas: 'Ritinio spindulys padidintas 2 kartus, aukštinė nesikeičia. Kiek kartų padidėja tūris?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Tūrio formulėje spindulys keliamas kvadratu: $2^2 = 4$.',
      }),
  ])
}

// ── 11.3. Kūgis ─────────────────────────────────────────────────────────────

const T8 = 'kugis-7'

const A_KUGIS = [
  {
    klausimas: 'Kiek pagrindų turi kūgis?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: 'Kūgis turi vieną skritulinį pagrindą ir viršūnę.',
  },
] as const

export const kugis7: Generatorius = () => suBandymais(kurkKugi, A_KUGIS, T8)

function kurkKugi(): Uzdavinys | null {
  const r = atsitiktinis(2, 12)
  const h = atsitiktinis(3, 15)

  return variacija([
    // 1. Kiek pagrindų
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek pagrindų turi kūgis?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Kūgis turi vieną skritulinį pagrindą ir vieną viršūnę.',
        brezinys: ritinysArKugis('kugis', { r: 'r', h: 'h' }),
      }),

    // 2. Kaip gaunamas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kaip gaunamas kūgis sukant plokščią figūrą?',
        variantai: [
          'sukant statųjį trikampį apie statinį',
          'sukant stačiakampį apie kraštinę',
          'sukant skritulį apie skersmenį',
          'sukant trikampį apie įžambinę',
        ],
        teisingas: 0,
        sprendimas: 'Antrasis statinis tampa pagrindo spinduliu, o pirmasis — aukštine.',
      }),

    // 3. Išklotinė
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kokia figūra gaunama išklojus kūgio šoninį paviršių?',
        variantai: ['skritulio sektorius', 'stačiakampis', 'trikampis', 'visas skritulys'],
        teisingas: 0,
        sprendimas: 'Sektoriaus lanko ilgis lygus pagrindo apskritimo ilgiui.',
      }),

    // 4. Ašinis pjūvis
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kokia figūra yra kūgio ašinis pjūvis?',
        variantai: ['lygiašonis trikampis', 'stačiakampis', 'skritulys', 'trapecija'],
        teisingas: 0,
        sprendimas: 'Pjūvio pagrindas lygus skersmeniui, o šoninės kraštinės — sudaromosioms.',
        brezinys: ritinysArKugis('kugis', { r: `${r}`, h: `${h}` }),
      }),

    // 5. Sudaromoji
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kas yra kūgio sudaromoji?',
        variantai: [
          'atkarpa nuo viršūnės iki pagrindo apskritimo taško',
          'pagrindo spindulys',
          'kūgio aukštinė',
          'pagrindo skersmuo',
        ],
        teisingas: 0,
        sprendimas: 'Visos sudaromosios lygios.',
      }),

    // 6. Ašinio pjūvio plotas
    () => {
      if ((2 * r * h) % 2 !== 0) return null
      return uzdavinys(T8, {
        klausimas: `Kūgio pagrindo spindulys ${r} cm, aukštinė ${h} cm. Koks yra ašinio pjūvio plotas?`,
        atsakymas: String(r * h),
        atsakymasRodymui: `$${r * h}$ cm²`,
        sprendimas: `Trikampio pagrindas $${2 * r}$ cm, aukštinė $${h}$ cm: $${2 * r} \\cdot ${h} : 2 = ${r * h}$.`,
      })
    },

    // 7. Kuo skiriasi nuo piramidės
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuo kūgis panašus į piramidę?',
        variantai: [
          'abu turi vieną pagrindą ir viršūnę',
          'abiejų pagrindas yra skritulys',
          'abu turi plokščias šonines sienas',
          'abu turi du pagrindus',
        ],
        teisingas: 0,
        sprendimas: 'Todėl ir tūrio formulėse abu turi daliklį 3.',
      }),
  ])
}

// ── 11.4. Kūgio paviršiaus plotas ir tūris ──────────────────────────────────

const T9 = 'kugio-plotas-turis'

const A_KUGIO = [
  {
    klausimas: 'Kūgio spindulys 3 cm, aukštinė 4 cm. Koks jo tūris? Užrašyk koeficientą prie $\\pi$.',
    atsakymas: '12',
    atsakymasRodymui: '$12\\pi$ cm³',
    sprendimas: '$V = \\dfrac{\\pi r^2 h}{3} = \\dfrac{\\pi \\cdot 9 \\cdot 4}{3}$.',
  },
] as const

export const kugioPlotasTuris: Generatorius = () => suBandymais(kurkKugioPlota, A_KUGIO, T9)

function kurkKugioPlota(): Uzdavinys | null {
  const r = atsitiktinis(2, 9)
  const h = atsitiktinis(3, 12)
  if ((r * r * h) % 3 !== 0) return null
  const turis = (r * r * h) / 3

  return variacija([
    // 1. Tūris
    () =>
      uzdavinys(T9, {
        klausimas: `Kūgio pagrindo spindulys ${r} cm, aukštinė ${h} cm. Koks jo tūris? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(turis),
        atsakymasRodymui: `$${turis}\\pi$ cm³`,
        sprendimas: `$V = \\dfrac{\\pi r^2 h}{3} = \\dfrac{\\pi \\cdot ${r * r} \\cdot ${h}}{3} = ${turis}\\pi$.`,
        brezinys: ritinysArKugis('kugis', { r: `${r}`, h: `${h}` }),
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kokia yra kūgio tūrio formulė?',
        variantai: [
          '$V = \\dfrac{\\pi r^2 h}{3}$',
          '$V = \\pi r^2 h$',
          '$V = \\dfrac{\\pi r h}{3}$',
          '$V = 2\\pi r h$',
        ],
        teisingas: 0,
        sprendimas: 'Kūgio tūris tris kartus mažesnis už tokio pat pagrindo ir aukštinės ritinio tūrį.',
      }),

    // 3. Palyginimas su ritiniu
    () =>
      uzdavinys(T9, {
        klausimas: `Ritinio ir kūgio pagrindai bei aukštinės vienodi, o ritinio tūris $${r * r * h}\\pi$ cm³. Koks kūgio tūris? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(turis),
        atsakymasRodymui: `$${turis}\\pi$ cm³`,
        sprendimas: `$${r * r * h} : 3 = ${turis}$.`,
      }),

    // 4. Pagrindo plotas
    () =>
      uzdavinys(T9, {
        klausimas: `Kūgio pagrindo spindulys ${r} cm. Koks pagrindo plotas? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(r * r),
        atsakymasRodymui: `$${r * r}\\pi$ cm²`,
        sprendimas: `$S = \\pi r^2 = ${r * r}\\pi$.`,
      }),

    // 5. Šoninio paviršiaus plotas
    () => {
      const l = atsitiktinis(h + 1, h + 10)
      return uzdavinys(T9, {
        klausimas: `Kūgio pagrindo spindulys ${r} cm, sudaromoji ${l} cm. Koks šoninio paviršiaus plotas? Užrašyk koeficientą prie $\\pi$.`,
        atsakymas: String(r * l),
        atsakymasRodymui: `$${r * l}\\pi$ cm²`,
        sprendimas: `$S = \\pi r l = ${r} \\cdot ${l} \\cdot \\pi = ${r * l}\\pi$.`,
      })
    },

    // 6. Apytikslis tūris
    () =>
      uzdavinys(T9, {
        klausimas: `Kūgio spindulys ${r} cm, aukštinė ${h} cm. Koks apytikslis jo tūris, kai $\\pi \\approx 3$?`,
        atsakymas: String(3 * turis),
        atsakymasRodymui: `$${3 * turis}$ cm³`,
        sprendimas: `$${turis}\\pi \\approx ${turis} \\cdot 3 = ${3 * turis}$.`,
      }),

    // 7. Aukštinė iš tūrio
    () =>
      uzdavinys(T9, {
        klausimas: `Kūgio tūris $${turis}\\pi$ cm³, pagrindo spindulys ${r} cm. Kokio ilgio jo aukštinė?`,
        atsakymas: String(h),
        atsakymasRodymui: `$${h}$ cm`,
        sprendimas: `$${turis} \\cdot 3 : ${r * r} = ${h}$.`,
      }),
  ])
}

// ── 12.1. Statistinis tyrimas. Populiacija ──────────────────────────────────

const T10 = 'statistinis-tyrimas'

const A_TYRIMAS = [
  {
    klausimas: 'Kas vadinama populiacija statistiniame tyrime?',
    atsakymas: 'visi tiriami objektai',
    atsakymasRodymui: 'Visi tiriami objektai',
    sprendimas: 'Iš populiacijos atrenkama imtis.',
  },
] as const

export const statistinisTyrimas: Generatorius = () => suBandymais(kurkTyrima, A_TYRIMAS, T10)

function kurkTyrima(): Uzdavinys | null {
  return variacija([
    // 1. Kas yra populiacija
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kas vadinama populiacija statistiniame tyrime?',
        variantai: [
          'visi tiriami objektai',
          'tik apklaustieji objektai',
          'tyrimo rezultatas',
          'duomenų vidurkis',
        ],
        teisingas: 0,
        sprendimas: 'Iš populiacijos atrenkama imtis, kuri tiriama iš tikrųjų.',
      }),

    // 2. Tyrimo eiga
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kuo prasideda statistinis tyrimas?',
        variantai: [
          'klausimo ir tiriamos populiacijos nusakymu',
          'duomenų rinkimu',
          'diagramos braižymu',
          'išvadų formulavimu',
        ],
        teisingas: 0,
        sprendimas: 'Nežinant, ko klausiama ir ką tiriame, duomenys būtų beprasmiai.',
      }),

    // 3. Kada tiriama visa populiacija
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kada tiriama visa populiacija, o ne imtis?',
        variantai: [
          'kai populiacija nedidelė ir ją ištirti įmanoma',
          'kai populiacija labai didelė',
          'visada',
          'niekada',
        ],
        teisingas: 0,
        sprendimas: 'Visos populiacijos tyrimas vadinamas surašymu.',
      }),

    // 4. Populiacija konkrečiame tyrime
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Tiriama, kiek laiko mokyklos mokiniai skiria namų darbams. Kas yra populiacija?',
        variantai: [
          'visi tos mokyklos mokiniai',
          'apklausti mokiniai',
          'visi šalies mokiniai',
          'mokytojai',
        ],
        teisingas: 0,
        sprendimas: 'Populiacija — visi objektai, apie kuriuos norima padaryti išvadą.',
      }),

    // 5. Tyrimo etapai
    () =>
      poruUzdavinys(naujasId(T10), T10, {
        klausimas: 'Sujunk tyrimo etapą su jo turiniu.',
        poros: [
          { kaire: 'planavimas', desine: 'klausimo ir populiacijos nusakymas' },
          { kaire: 'duomenų rinkimas', desine: 'apklausa arba matavimas' },
          { kaire: 'apdorojimas', desine: 'lentelės ir diagramos' },
          { kaire: 'išvados', desine: 'atsakymas į tyrimo klausimą' },
        ],
        sprendimas: 'Kiekvienas etapas remiasi ankstesniojo rezultatais.',
      }),

    // 6. Kodėl imtis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kodėl dažniausiai tiriama imtis, o ne visa populiacija?',
        variantai: [
          'nes visą populiaciją ištirti per brangu ir per ilgai',
          'nes imtis tikslesnė',
          'nes populiacijos nežinome',
          'nes taip reikalauja taisyklės',
        ],
        teisingas: 0,
        sprendimas: 'Gerai parinkta imtis leidžia padaryti išvadą apie visą populiaciją.',
      }),

    // 7. Statistinis klausimas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kuris klausimas yra statistinis?',
        variantai: [
          'Kiek valandų per dieną mokiniai žiūri ekranus?',
          'Kiek man metų?',
          'Kiek yra $7 \\cdot 8$?',
          'Kada gimė mano draugas?',
        ],
        teisingas: 0,
        sprendimas: 'Statistinis klausimas laukia įvairių atsakymų, o ne vieno tikslaus.',
      }),
  ])
}

// ── 12.2. Imtis. Paprastoji atsitiktinė imtis ───────────────────────────────

const T11 = 'imtis-atsitiktine'

const A_IMTIS = [
  {
    klausimas: 'Kas yra paprastoji atsitiktinė imtis?',
    atsakymas: 'kai kiekvienas turi vienoda galimybe patekti',
    atsakymasRodymui: 'Imtis, kurioje kiekvienas populiacijos narys turi vienodą galimybę patekti',
    sprendimas: 'Tik tada imtis atspindi visą populiaciją.',
  },
] as const

export const imtisAtsitiktine: Generatorius = () => suBandymais(kurkImti, A_IMTIS, T11)

function kurkImti(): Uzdavinys | null {
  const populiacija = atsitiktinis(10, 60) * 10
  const imtis = atsitiktinis(2, 10) * 5
  if (imtis >= populiacija) return null

  return variacija([
    // 1. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kas yra paprastoji atsitiktinė imtis?',
        variantai: [
          'imtis, kurioje kiekvienas populiacijos narys turi vienodą galimybę į ją patekti',
          'imtis, sudaryta iš pirmųjų sąrašo narių',
          'imtis, sudaryta iš savanorių',
          'visa populiacija',
        ],
        teisingas: 0,
        sprendimas: 'Tik tokia imtis nešališkai atspindi populiaciją.',
      }),

    // 2. Imties dydis
    () =>
      uzdavinys(T11, {
        klausimas: `Iš ${populiacija} mokinių atrinkta ${imtis}. Koks yra imties dydis?`,
        atsakymas: String(imtis),
        atsakymasRodymui: `$${imtis}$`,
        sprendimas: 'Imties dydis — atrinktų objektų skaičius.',
      }),

    // 3. Kokią dalį sudaro
    () => {
      const proc = (imtis / populiacija) * 100
      if (proc % 1 !== 0) return null
      return uzdavinys(T11, {
        klausimas: `Iš ${populiacija} mokinių atrinkta ${imtis}. Kiek procentų populiacijos sudaro imtis?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `$${imtis} : ${populiacija} \\cdot 100 = ${proc}$.`,
      })
    },

    // 4. Šališka imtis
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kodėl apklausus tik krepšinio būrelio narius išvada apie visos mokyklos sportinius įpročius bus netiksli?',
        variantai: [
          'nes imtis šališka — ji neatspindi visos populiacijos',
          'nes imtis per maža',
          'nes krepšininkai neatsako teisingai',
          'nes reikia apklausti mokytojus',
        ],
        teisingas: 0,
        sprendimas: 'Būrelio nariai sportuoja daugiau nei vidutinis mokinys.',
      }),

    // 5. Kaip sudaryti
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kaip sudaroma paprastoji atsitiktinė imtis?',
        variantai: [
          'burtais arba atsitiktinių skaičių pagalba',
          'pasirenkant pirmuosius sąrašo narius',
          'pasirenkant tuos, kurie nori dalyvauti',
          'pasirenkant pažįstamus',
        ],
        teisingas: 0,
        sprendimas: 'Bet koks pasirinkimas „patogumo“ principu daro imtį šališką.',
      }),

    // 6. Kada imtis patikimesnė
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kaip imties dydis veikia tyrimo patikimumą?',
        variantai: [
          'didesnė imtis paprastai duoda patikimesnę išvadą',
          'imties dydis nesvarbus',
          'mažesnė imtis patikimesnė',
          'patikimumas priklauso tik nuo klausimo',
        ],
        teisingas: 0,
        sprendimas: 'Bet net didelė imtis blogai parinkta lieka šališka.',
      }),

    // 7. Populiacija ir imtis
    () =>
      poruUzdavinys(naujasId(T11), T11, {
        klausimas: 'Sujunk sąvoką su jos reikšme.',
        poros: [
          { kaire: 'populiacija', desine: 'visi tiriami objektai' },
          { kaire: 'imtis', desine: 'atrinkta populiacijos dalis' },
          { kaire: 'imties dydis', desine: 'atrinktų objektų skaičius' },
          { kaire: 'šališka imtis', desine: 'neatspindi populiacijos' },
        ],
        sprendimas: 'Išvada daroma apie populiaciją, nors tiriama imtis.',
      }),
  ])
}

// ── 12.3. Sisteminė, sluoksninė, lizdinė atsitiktinės imtys ─────────────────

const T12 = 'imciu-rusys'

const A_IMCIU_RUSYS = [
  {
    klausimas: 'Kaip sudaroma sisteminė imtis?',
    atsakymas: 'imamas kas k-tasis sarasas narys',
    atsakymasRodymui: 'Imamas kas $k$-tasis sąrašo narys',
    sprendimas: 'Pradžia parenkama atsitiktinai.',
  },
] as const

export const imciuRusys: Generatorius = () => suBandymais(kurkImciuRusis, A_IMCIU_RUSYS, T12)

function kurkImciuRusis(): Uzdavinys | null {
  const populiacija = atsitiktinis(10, 40) * 10
  const zingsnis = pasirink([5, 10, 20])
  if (populiacija % zingsnis !== 0) return null

  return variacija([
    // 1. Sisteminė
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kaip sudaroma sisteminė imtis?',
        variantai: [
          'iš sąrašo imamas kas $k$-tasis narys',
          'populiacija skaidoma į grupes ir imama iš kiekvienos',
          'atsitiktinai parenkamos ištisos grupės',
          'imami pirmieji sąrašo nariai',
        ],
        teisingas: 0,
        sprendimas: 'Pradinis narys parenkamas atsitiktinai, o toliau žingsnis pastovus.',
      }),

    // 2. Sluoksninė
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kaip sudaroma sluoksninė imtis?',
        variantai: [
          'populiacija skaidoma į sluoksnius ir iš kiekvieno imama atsitiktinai',
          'imamas kas $k$-tasis narys',
          'atsitiktinai parenkamos ištisos grupės',
          'imami savanoriai',
        ],
        teisingas: 0,
        sprendimas: 'Taip užtikrinama, kad kiekviena grupė būtų atstovaujama.',
      }),

    // 3. Lizdinė
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kaip sudaroma lizdinė imtis?',
        variantai: [
          'atsitiktinai parenkamos ištisos grupės ir tiriami visi jų nariai',
          'iš kiekvienos grupės imama po vieną narį',
          'imamas kas $k$-tasis narys',
          'imami pirmieji sąrašo nariai',
        ],
        teisingas: 0,
        sprendimas: 'Pavyzdžiui, atsitiktinai parenkamos kelios klasės ir apklausiami visi jų mokiniai.',
      }),

    // 4. Sisteminės imties žingsnis
    () =>
      uzdavinys(T12, {
        klausimas: `Iš ${populiacija} mokinių sąrašo sudaroma sisteminė ${populiacija / zingsnis} mokinių imtis. Kas kelintas mokinys imamas?`,
        atsakymas: String(zingsnis),
        atsakymasRodymui: `$${zingsnis}$`,
        sprendimas: `$${populiacija} : ${populiacija / zingsnis} = ${zingsnis}$.`,
      }),

    // 5. Imties dydis pagal žingsnį
    () =>
      uzdavinys(T12, {
        klausimas: `Iš ${populiacija} mokinių sąrašo imamas kas ${zingsnis}-tasis. Koks bus imties dydis?`,
        atsakymas: String(populiacija / zingsnis),
        atsakymasRodymui: `$${populiacija / zingsnis}$`,
        sprendimas: `$${populiacija} : ${zingsnis} = ${populiacija / zingsnis}$.`,
      }),

    // 6. Poros
    () =>
      poruUzdavinys(naujasId(T12), T12, {
        klausimas: 'Sujunk imties rūšį su jos sudarymo būdu.',
        poros: [
          { kaire: 'paprastoji atsitiktinė', desine: 'burtais iš visos populiacijos' },
          { kaire: 'sisteminė', desine: 'kas $k$-tasis narys' },
          { kaire: 'sluoksninė', desine: 'po dalį iš kiekvienos grupės' },
          { kaire: 'lizdinė', desine: 'ištisos atsitiktinės grupės' },
        ],
        sprendimas: 'Visos keturios yra atsitiktinės, bet skiriasi atrankos tvarka.',
      }),

    // 7. Kada tinka sluoksninė
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kada tikslinga rinktis sluoksninę imtį?',
        variantai: [
          'kai populiacija aiškiai skyla į grupes, kurių kiekviena svarbi',
          'kai populiacija labai maža',
          'kai sąrašo nėra',
          'kai grupės vienodos',
        ],
        teisingas: 0,
        sprendimas: 'Pavyzdžiui, atskirai imama iš kiekvienos klasės.',
      }),
  ])
}

// ── 12.4. Statistinis kintamasis ────────────────────────────────────────────

const T13 = 'statistinis-kintamasis'

const A_KINTAMASIS = [
  {
    klausimas: 'Koks yra kintamasis „mokinių ūgis“?',
    atsakymas: 'kiekybinis',
    atsakymasRodymui: 'Kiekybinis',
    sprendimas: 'Jis matuojamas skaičiais.',
  },
] as const

export const statistinisKintamasis: Generatorius = () => suBandymais(kurkKintamaji, A_KINTAMASIS, T13)

function kurkKintamaji(): Uzdavinys | null {
  return variacija([
    // 1. Kiekybinis
    () =>
      uzdavinys(T13, {
        klausimas: 'Koks yra statistinis kintamasis „mokinių ūgis centimetrais“?',
        atsakymas: 'kiekybinis',
        atsakymasRodymui: 'Kiekybinis',
        sprendimas: 'Kiekybiniai kintamieji matuojami skaičiais.',
      }),

    // 2. Kokybinis
    () =>
      uzdavinys(T13, {
        klausimas: 'Koks yra statistinis kintamasis „mėgstamiausia spalva“?',
        atsakymas: 'kokybinis',
        atsakymasRodymui: 'Kokybinis',
        sprendimas: 'Kokybiniai kintamieji nusako savybę, o ne dydį.',
      }),

    // 3. Diskretusis ir tolydusis
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Koks kiekybinis kintamasis vadinamas diskrečiuoju?',
        variantai: [
          'kurio reikšmės yra atskiri skaičiai, pavyzdžiui, vaikų skaičius',
          'kurio reikšmės gali būti bet kokios, pavyzdžiui, ūgis',
          'kuris matuojamas žodžiais',
          'kuris nekinta',
        ],
        teisingas: 0,
        sprendimas: 'Tolydusis kintamasis gali įgyti bet kokią reikšmę tam tikrame intervale.',
      }),

    // 4. Kuris kintamasis kokybinis
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Kuris kintamasis yra kokybinis?',
        variantai: ['gyvenamasis miestas', 'ūgis', 'amžius', 'brolių skaičius'],
        teisingas: 0,
        sprendimas: 'Miestų sudėti ar suvidurkinti negalima.',
      }),

    // 5. Kuris tolydusis
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Kuris kintamasis yra tolydusis?',
        variantai: ['kūno masė', 'vaikų skaičius šeimoje', 'akių spalva', 'klasės numeris'],
        teisingas: 0,
        sprendimas: 'Masė gali būti bet koks skaičius tam tikrame intervale.',
      }),

    // 6. Kokį matą taikyti
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Kurį imties centro matą galima taikyti kokybiniam kintamajam?',
        variantai: ['modą', 'vidurkį', 'medianą', 'jokio'],
        teisingas: 0,
        sprendimas: 'Kokybinių reikšmių sudėti ar surikiuoti negalima, o dažniausią rasti — galima.',
      }),

    // 7. Poros
    () =>
      poruUzdavinys(naujasId(T13), T13, {
        klausimas: 'Sujunk kintamąjį su jo rūšimi.',
        poros: [
          { kaire: 'ūgis', desine: 'kiekybinis tolydusis' },
          { kaire: 'brolių skaičius', desine: 'kiekybinis diskretusis' },
          { kaire: 'akių spalva', desine: 'kokybinis' },
          { kaire: 'mėgstamiausias sportas', desine: 'kokybinis' },
        ],
        sprendimas: 'Kintamojo rūšis lemia, kokius skaičiavimus ir diagramas galima taikyti.',
      }),
  ])
}

// ── 12.5. Duomenų pateikimas skrituline diagrama ────────────────────────────

const T14 = 'skritulines-diagramos'

const A_SKRITULINE = [
  {
    klausimas: 'Kiek laipsnių sudaro visa skritulinė diagrama?',
    atsakymas: '360',
    atsakymasRodymui: '$360°$',
    sprendimas: 'Visas skritulys atitinka 100 % duomenų.',
  },
] as const

export const skritulinesDiagramos: Generatorius = () => suBandymais(kurkSkritulines, A_SKRITULINE, T14)

function kurkSkritulines(): Uzdavinys | null {
  const proc = pasirink([10, 20, 25, 50, 75])
  const viso = atsitiktinis(2, 20) * 20
  const dalis = (viso * proc) / 100
  if (dalis % 1 !== 0) return null
  const kampas = (360 * proc) / 100
  if (kampas % 1 !== 0) return null

  return variacija([
    // 1. Visa diagrama
    () =>
      uzdavinys(T14, {
        klausimas: 'Kiek laipsnių sudaro visa skritulinė diagrama?',
        atsakymas: '360',
        atsakymasRodymui: `$360°$`,
        sprendimas: 'Visas skritulys atitinka visus duomenis, t. y. 100 %.',
      }),

    // 2. Sektoriaus kampas iš procentų
    () =>
      uzdavinys(T14, {
        klausimas: `Kiek laipsnių turi sektorius, atitinkantis $${proc}\\%$ duomenų?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: `$360 : 100 \\cdot ${proc} = ${kampas}$.`,
      }),

    // 3. Procentai iš kampo
    () =>
      uzdavinys(T14, {
        klausimas: `Sektoriaus kampas lygus ${kampas}°. Kiek procentų duomenų jis atitinka?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `$${kampas} : 360 \\cdot 100 = ${proc}$.`,
      }),

    // 4. Kiek objektų
    () =>
      uzdavinys(T14, {
        klausimas: `Apklausta ${viso} žmonių, o vienas sektorius sudaro $${proc}\\%$. Kiek žmonių jį atitinka?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `$${viso} : 100 \\cdot ${proc} = ${dalis}$.`,
        brezinys: skritulineDiagrama(
          [
            { vardas: 'A', dalys: proc / 25 >= 1 ? Math.round(proc / 25) : 1 },
            { vardas: 'kiti', dalys: 4 - (proc / 25 >= 1 ? Math.round(proc / 25) : 1) },
          ],
          4,
        ),
      }),

    // 5. Kada tinka skritulinė
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kada tikslinga rinktis skritulinę diagramą?',
        variantai: [
          'kai rodoma, kokias visumos dalis sudaro grupės',
          'kai rodoma dydžio kaita laike',
          'kai lyginami nesusiję dydžiai',
          'kai duomenų labai daug',
        ],
        teisingas: 0,
        sprendimas: 'Skritulinė diagrama visada rodo dalis iš vienos visumos.',
      }),

    // 6. Sektorių suma
    () =>
      uzdavinys(T14, {
        klausimas: `Skritulinėje diagramoje vienas sektorius sudaro $${proc}\\%$. Kiek procentų sudaro visi likusieji kartu?`,
        atsakymas: String(100 - proc),
        atsakymasRodymui: `$${100 - proc}\\%$`,
        sprendimas: `$100 - ${proc} = ${100 - proc}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Skritulinės diagramos sektorių procentų suma gavosi 110 %. Ką tai reiškia?',
        variantai: [
          'skaičiavimuose yra klaida — suma turi būti 100 %',
          'diagrama teisinga',
          'reikia pridėti dar vieną sektorių',
          'reikia padidinti skritulį',
        ],
        teisingas: 0,
        sprendimas: 'Visos dalys kartu sudaro visumą, t. y. lygiai 100 %.',
      }),
  ])
}
