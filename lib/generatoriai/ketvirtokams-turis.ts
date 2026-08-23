import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { kiek } from './ketvirtokams-bendra'
import {
  type ErdvesKunas,
  erdvesKunas,
  gretasienisSuMatais,
  isklotine,
  kubeliuStatinys4,
  kunuEile,
  vaizdasIsVirsaus,
} from './ketvirtokams-erdves-vaizdai'
import { gretasienis, vienasBrezinys } from './treciokams-geometrija-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Erdvės figūros ir tūris“ — penkiolika potemių.
 *
 * Anksčiau jos rėmėsi `plotas-turis`, `erdvines-figuros` ir
 * `matavimo-vienetai` generatoriais, skirtais 6–9 klasėms: pasitaikydavo
 * ritinio tūrio formulės ir kubinių decimetrų vertimo į litrus.
 *
 * Tūris čia pradedamas nuo kubelių skaičiaus, o ne nuo formulės: statinys
 * piešiamas nepermatomas, tad kubelius galima suskaičiuoti, o formulė
 * $a \cdot b \cdot c$ atsiranda kaip trumpesnis to paties skaičiavimo būdas.
 */

const KUBELIAI = { vns: 'kubelis', dgs: 'kubeliai', kilm: 'kubelių' }

/** Statinio stulpelių aukščiai — po eilutes. */
function statinioStulpeliai(eiluciu: number, stulpeliu: number, maks: number): number[][] {
  return Array.from({ length: eiluciu }, () =>
    Array.from({ length: stulpeliu }, () => atsitiktinis(1, maks)),
  )
}

function kubeliuKiekis(s: readonly (readonly number[])[]): number {
  return s.reduce((v, e) => v + e.reduce((x, y) => x + y, 0), 0)
}

// ── 10.1 Kas yra tūris? ─────────────────────────────────────────────────────

const T1 = 'kas-yra-turis'

const A_TURIS = [
  {
    klausimas: 'Ką rodo kūno tūris?',
    atsakymas: 'a',
    atsakymasRodymui: 'kiek vietos kūnas užima',
    sprendimas: 'Tūris matuoja erdvę, kurią kūnas užpildo.',
  },
] as const

export const kasYraTuris: Generatorius = () => suBandymais(kurkTuriSavoka, A_TURIS, T1)

function kurkTuriSavoka(): Uzdavinys | null {
  const s = statinioStulpeliai(2, 3, 3)
  const viso = kubeliuKiekis(s)

  return variacija([
    // 1. Kas yra tūris
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ką rodo kūno tūris?',
        variantai: [
          'kiek vietos kūnas užima',
          'kokio ilgio yra kūno briauna',
          'kiek sveria kūnas',
          'kokio ploto yra kūno siena',
        ],
        teisingas: 0,
        sprendimas: 'Plotas matuoja paviršių, o tūris — erdvę, kurią kūnas užpildo.',
      }),

    // 2. Tūris kubeliais
    () =>
      uzdavinys(T1, {
        klausimas: 'Iš kelių kubelių sudarytas statinys?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: 'Suskaičiuojami visi kubeliai, įskaitant paslėptus po viršutiniais.',
        brezinys: kubeliuStatinys4(s),
      }),

    // 3. Kuo matuojamas tūris
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuriuo vienetu matuojamas nedidelės dėžutės tūris?',
        variantai: ['cm³', 'cm²', 'cm', 'kg'],
        teisingas: 0,
        sprendimas: 'Tūrio vienetai rašomi su trejetu viršuje: kubinis centimetras.',
      }),

    // 4. Plotas ar tūris
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Susiek dydį su tuo, ką jis matuoja.',
        poros: [
          { kaire: 'ilgis', desine: 'cm' },
          { kaire: 'plotas', desine: 'cm²' },
          { kaire: 'tūris', desine: 'cm³' },
        ],
        sprendimas: 'Ilgis matuojamas viena kryptimi, plotas — dviem, tūris — trimis.',
      }),

    // 5. Kurio kūno tūris didesnis
    () => {
      const s2 = statinioStulpeliai(2, 3, 3)
      const viso2 = kubeliuKiekis(s2)
      if (viso === viso2) return null
      return uzdavinys(T1, {
        klausimas: `Vienas statinys sudarytas iš ${kiek(viso, KUBELIAI)}, kitas — iš ${kiek(viso2, KUBELIAI)}. Kiek kubelių skiriasi jų tūriai?`,
        atsakymas: String(Math.abs(viso - viso2)),
        atsakymasRodymui: `$${Math.abs(viso - viso2)}$`,
        sprendimas: `$${Math.max(viso, viso2)} - ${Math.min(viso, viso2)} = ${Math.abs(viso - viso2)}$.`,
      })
    },

    // 6. Ar tūris pasikeičia perstačius
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ar pasikeis statinio tūris, jei tuos pačius kubelius sudėsime kitaip?',
        variantai: [
          'ne, kubelių skaičius lieka tas pats',
          'taip, aukštesnis statinys turi didesnį tūrį',
          'taip, platesnis statinys turi didesnį tūrį',
        ],
        teisingas: 0,
        sprendimas: 'Tūris priklauso tik nuo to, kiek vietos užimama, o ne nuo formos.',
      }),

    // 7. Tūris ir talpa
    () => {
      const l = atsitiktinis(2, 9)
      return uzdavinys(T1, {
        klausimas: `Inde telpa ${l} l vandens. Kiek mililitrų tai yra?`,
        atsakymas: String(l * 1000),
        atsakymasRodymui: `$${l * 1000}$ ml`,
        sprendimas: `Viename litre 1000 ml: $${l} \\cdot 1000 = ${l * 1000}$.`,
      })
    },
  ])
}

// ── 10.2 Tūris kubelių skaičiumi ────────────────────────────────────────────

const T2 = 'turis-kubeliais'

const A_KUBELIAIS = [
  {
    klausimas: 'Iš kelių kubelių sudarytas 2 × 3 × 2 statinys?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '$2 \\cdot 3 \\cdot 2 = 12$.',
  },
] as const

export const turisKubeliais: Generatorius = () => suBandymais(kurkKubelius, A_KUBELIAIS, T2)

function kurkKubelius(): Uzdavinys | null {
  const s = statinioStulpeliai(2, 3, 3)
  const viso = kubeliuKiekis(s)

  return variacija([
    // 1. Suskaičiuoti kubelius
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek kubelių sudaro pavaizduotą statinį?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: 'Skaičiuojami visi kubeliai — ir tie, kurie stovi po viršutiniais.',
        brezinys: kubeliuStatinys4(s),
      }),

    // 2. Iš vaizdo iš viršaus
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek kubelių sudaro statinį, kurio vaizdas iš viršaus pateiktas?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `Sudedami visų langelių skaičiai: ${s.flat().join(' + ')} = ${viso}.`,
        brezinys: vaizdasIsVirsaus(s),
      }),

    // 3. Stačiakampis statinys
    () => {
      const a = atsitiktinis(2, 5)
      const b = atsitiktinis(2, 4)
      const c = atsitiktinis(2, 4)
      return uzdavinys(T2, {
        klausimas: `Statinys sudarytas iš ${a} kubelių ilgio, ${b} pločio ir ${c} aukščio eilių. Iš kelių kubelių jis sudarytas?`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$`,
        sprendimas: `$${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$.`,
      })
    },

    // 4. Kiek kubelių pridėti
    () => {
      const tikslas = viso + atsitiktinis(2, 8)
      return uzdavinys(T2, {
        klausimas: `Statinį sudaro ${kiek(viso, KUBELIAI)}. Kiek kubelių reikia pridėti, kad jų būtų ${tikslas}?`,
        atsakymas: String(tikslas - viso),
        atsakymasRodymui: `$${tikslas - viso}$`,
        sprendimas: `$${tikslas} - ${viso} = ${tikslas - viso}$.`,
        brezinys: kubeliuStatinys4(s),
      })
    },

    // 5. Kiek paslėpta
    () => {
      const matomi = s.flat().filter((x) => x > 0).length
      if (viso === matomi) return null
      return uzdavinys(T2, {
        klausimas: 'Kiek kubelių statinyje stovi po viršutiniais ir iš viršaus nesimato?',
        atsakymas: String(viso - matomi),
        atsakymasRodymui: `$${viso - matomi}$`,
        sprendimas: `Iš viršaus matomi ${matomi} viršutiniai kubeliai, o iš viso jų ${viso}.`,
        brezinys: vaizdasIsVirsaus(s),
      })
    },

    // 6. Aukščiausias stulpelis
    () => {
      const maks = Math.max(...s.flat())
      return uzdavinys(T2, {
        klausimas: 'Kiek kubelių yra aukščiausiame statinio stulpelyje?',
        atsakymas: String(maks),
        atsakymasRodymui: `$${maks}$`,
        sprendimas: 'Randamas didžiausias skaičius vaizde iš viršaus.',
        brezinys: vaizdasIsVirsaus(s),
      })
    },

    // 7. Du statiniai
    () => {
      const s2 = statinioStulpeliai(2, 3, 3)
      const viso2 = kubeliuKiekis(s2)
      if (viso === viso2) return null
      return uzdavinys(T2, {
        klausimas: `Pirmame statinyje ${kiek(viso, KUBELIAI)}, antrame — ${kiek(viso2, KUBELIAI)}. Kiek kubelių iš viso?`,
        atsakymas: String(viso + viso2),
        atsakymasRodymui: `$${viso + viso2}$`,
        sprendimas: `$${viso} + ${viso2} = ${viso + viso2}$.`,
      })
    },
  ])
}

// ── 10.3 Kubinis centimetras ────────────────────────────────────────────────

const T3 = 'kubinis-centimetras'

const A_CM3 = [
  {
    klausimas: 'Koks kūnas turi 1 cm³ tūrį?',
    atsakymas: 'a',
    atsakymasRodymui: 'kubas, kurio kraštinė 1 cm',
    sprendimas: 'Kubinis centimetras yra vienetinio kubelio tūris.',
  },
] as const

export const kubinisCentimetras: Generatorius = () => suBandymais(kurkCm3, A_CM3, T3)

function kurkCm3(): Uzdavinys | null {
  const a = atsitiktinis(2, 8)
  const b = atsitiktinis(2, 6)
  const c = atsitiktinis(2, 5)

  return variacija([
    // 1. Kas yra kubinis centimetras
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Koks kūnas turi lygiai 1 cm³ tūrį?',
        variantai: [
          'kubas, kurio kraštinė 1 cm',
          'kvadratas, kurio kraštinė 1 cm',
          'atkarpa, kurios ilgis 1 cm',
          'apskritimas, kurio spindulys 1 cm',
        ],
        teisingas: 0,
        sprendimas: 'Kvadratas ir atkarpa neturi tūrio — jie plokšti.',
      }),

    // 2. Tūris cm³
    () =>
      uzdavinys(T3, {
        klausimas: 'Koks yra pavaizduoto gretasienio tūris?',
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$ cm³`,
        sprendimas: `$${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$.`,
        brezinys: gretasienisSuMatais(a, b, c),
      }),

    // 3. Kiek vienetinių kubelių telpa
    () =>
      uzdavinys(T3, {
        klausimas: `Kiek 1 cm³ kubelių telpa dėžutėje, kurios matmenys ${a} cm, ${b} cm ir ${c} cm?`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$`,
        sprendimas: `Viename sluoksnyje $${a} \\cdot ${b} = ${a * b}$ kubeliai, o sluoksnių ${c}.`,
      }),

    // 4. Kada tinka cm³
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kurio daikto tūrį patogu matuoti kubiniais centimetrais?',
        variantai: ['degtukų dėžutės', 'kambario', 'baseino', 'sunkvežimio kėbulo'],
        teisingas: 0,
        sprendimas: 'Dideliems kūnams cm³ duotų per didelius skaičius — jiems tinka m³.',
      }),

    // 5. Kubo tūris
    () => {
      const k = atsitiktinis(2, 8)
      return uzdavinys(T3, {
        klausimas: `Kubo kraštinė ${k} cm. Koks jo tūris?`,
        atsakymas: String(k * k * k),
        atsakymasRodymui: `$${k * k * k}$ cm³`,
        sprendimas: `Visos kubo kraštinės vienodos: $${k} \\cdot ${k} \\cdot ${k} = ${k * k * k}$.`,
      })
    },

    // 6. Kuo skiriasi cm² ir cm³
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuo skiriasi cm² ir cm³?',
        variantai: [
          'cm² matuojamas plotas, o cm³ — tūris',
          'cm³ yra trimis vienetais didesnis',
          'jie reiškia tą patį',
          'cm² matuojamas tūris, o cm³ — plotas',
        ],
        teisingas: 0,
        sprendimas: 'Plotas gaunamas sudauginus du matmenis, tūris — tris.',
      }),

    // 7. Nežinoma briauna
    () =>
      uzdavinys(T3, {
        klausimas: `Gretasienio tūris ${a * b * c} cm³, o dvi jo briaunos yra ${a} cm ir ${b} cm. Kokio ilgio trečioji briauna?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$ cm`,
        sprendimas: `$${a * b * c} : (${a} \\cdot ${b}) = ${a * b * c} : ${a * b} = ${c}$.`,
      }),
  ])
}

// ── 10.4 Kubinis metras ─────────────────────────────────────────────────────

const T4 = 'kubinis-metras'

const A_M3 = [
  {
    klausimas: 'Koks kūnas turi 1 m³ tūrį?',
    atsakymas: 'a',
    atsakymasRodymui: 'kubas, kurio kraštinė 1 m',
    sprendimas: 'Kubinis metras yra kubo su vieno metro kraštine tūris.',
  },
] as const

export const kubinisMetras: Generatorius = () => suBandymais(kurkM3, A_M3, T4)

function kurkM3(): Uzdavinys | null {
  const a = atsitiktinis(2, 8)
  const b = atsitiktinis(2, 6)
  const c = atsitiktinis(2, 4)

  return variacija([
    // 1. Kas yra kubinis metras
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Koks kūnas turi lygiai 1 m³ tūrį?',
        variantai: [
          'kubas, kurio kraštinė 1 m',
          'kvadratas, kurio kraštinė 1 m',
          'kubas, kurio kraštinė 100 m',
          'stačiakampis 1 m × 1 m',
        ],
        teisingas: 0,
        sprendimas: 'Kubinis metras — kubas, kurio visos briaunos po vieną metrą.',
      }),

    // 2. Kambario tūris
    () =>
      uzdavinys(T4, {
        klausimas: `Kambarys yra ${a} m ilgio, ${b} m pločio ir ${c} m aukščio. Koks jo tūris?`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$ m³`,
        sprendimas: `$${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$.`,
      }),

    // 3. Kada tinka m³
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kurio objekto tūrį patogu matuoti kubiniais metrais?',
        variantai: ['kambario', 'degtukų dėžutės', 'pieštuko', 'monetos'],
        teisingas: 0,
        sprendimas: 'Maži daiktai kubiniais metrais būtų mažiau nei vienetas.',
      }),

    // 4. Kiek kambarių telpa
    () => {
      const salesTuris = a * b * c * atsitiktinis(2, 6)
      return uzdavinys(T4, {
        klausimas: `Salės tūris ${salesTuris} m³, o kambario — ${a * b * c} m³. Kiek kartų salė didesnė?`,
        atsakymas: String(salesTuris / (a * b * c)),
        atsakymasRodymui: `$${salesTuris / (a * b * c)}$ kartus`,
        sprendimas: `$${salesTuris} : ${a * b * c} = ${salesTuris / (a * b * c)}$.`,
      })
    },

    // 5. Nežinomas aukštis
    () =>
      uzdavinys(T4, {
        klausimas: `Kambario tūris ${a * b * c} m³, grindų plotas — ${a * b} m². Koks kambario aukštis?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$ m`,
        sprendimas: `$${a * b * c} : ${a * b} = ${c}$.`,
      }),

    // 6. m³ ir cm³
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuris tūris didesnis: 1 m³ ar 1 cm³?',
        variantai: ['1 m³', '1 cm³', 'jie lygūs'],
        teisingas: 0,
        sprendimas: 'Metras yra 100 cm, tad kubinis metras nepalyginamai didesnis už kubinį centimetrą.',
      }),

    // 7. Sandėlio tūris
    () => {
      const daliu = atsitiktinis(2, 4)
      return uzdavinys(T4, {
        klausimas: `Sandėlis padalytas į ${daliu} vienodas dalis, kurių kiekvienos tūris ${a * b * c} m³. Koks viso sandėlio tūris?`,
        atsakymas: String(a * b * c * daliu),
        atsakymasRodymui: `$${a * b * c * daliu}$ m³`,
        sprendimas: `$${a * b * c} \\cdot ${daliu} = ${a * b * c * daliu}$.`,
      })
    },
  ])
}

// ── 10.5 Tinkamo tūrio vieneto parinkimas ───────────────────────────────────

const T5 = 'turio-vieneto-parinkimas'

const A_TURIO_VIENETAS = [
  {
    klausimas: 'Kuriuo vienetu matuoti kambario tūrį?',
    atsakymas: 'a',
    atsakymasRodymui: 'm³',
    sprendimas: 'Dideliems kūnams tinka kubiniai metrai.',
  },
] as const

const TURIO_OBJEKTAI = [
  { vardas: 'degtukų dėžutė', vienetas: 'cm³' },
  { vardas: 'kambarys', vienetas: 'm³' },
  { vardas: 'pieno pakelis', vienetas: 'l' },
  { vardas: 'baseinas', vienetas: 'm³' },
  { vardas: 'trintukas', vienetas: 'cm³' },
  { vardas: 'kibiras', vienetas: 'l' },
] as const

export const turioVienetoParinkimas: Generatorius = () =>
  suBandymais(kurkTurioVieneta, A_TURIO_VIENETAS, T5)

function kurkTurioVieneta(): Uzdavinys | null {
  const o = pasirink(TURIO_OBJEKTAI)

  return variacija([
    // 1. Vienetas objektui
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kuriuo vienetu patogiausia nusakyti, koks yra objekto „${o.vardas}“ tūris?`,
        variantai: [o.vienetas, ...['cm³', 'm³', 'l'].filter((v) => v !== o.vienetas), 'cm²'],
        teisingas: 0,
        sprendimas: `Objekto dydis lemia vienetą: „${o.vardas}“ tūris patogiausiai nusakomas ${o.vienetas}.`,
      }),

    // 2. Susieti objektus su vienetais
    () => {
      const trys = sumaisyk([...TURIO_OBJEKTAI]).slice(0, 3)
      if (new Set(trys.map((x) => x.vienetas)).size < 3) return null
      return poruUzdavinys(naujasId(T5), T5, {
        klausimas: 'Susiek objektą su jam tinkamu tūrio vienetu.',
        poros: trys.map((x) => ({ kaire: x.vardas, desine: x.vienetas })),
        sprendimas: 'Maži daiktai — cm³, patalpos — m³, skysčiai — litrai.',
      })
    },

    // 3. Kodėl netinka cm³
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kodėl kambario tūrio nepatogu matuoti kubiniais centimetrais?',
        variantai: [
          'gautųsi milijonai — tokio skaičiaus net neperskaitytum',
          'kambarys nėra kubas',
          'kubiniai centimetrai netinka patalpoms pagal taisykles',
          'kambaryje yra baldų',
        ],
        teisingas: 0,
        sprendimas: 'Vienetas parenkamas toks, kad skaičius būtų patogaus dydžio.',
      }),

    // 4. Kuris skaičius su kuriuo vienetu
    () => {
      const m3 = atsitiktinis(20, 80)
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kambario tūris yra apie ${m3}. Kokį vienetą reikia prirašyti?`,
        variantai: ['m³', 'cm³', 'm²', 'cm'],
        teisingas: 0,
        sprendimas: `${m3} cm³ būtų mažiau nei stiklinė, o ${m3} m³ — įprastas kambarys.`,
      })
    },

    // 5. Litrai ir kubiniai centimetrai
    () => {
      const l = atsitiktinis(1, 5)
      return uzdavinys(T5, {
        klausimas: `Inde telpa ${l} l skysčio. Kiek mililitrų tai yra?`,
        atsakymas: String(l * 1000),
        atsakymasRodymui: `$${l * 1000}$ ml`,
        sprendimas: `$${l} \\cdot 1000 = ${l * 1000}$.`,
      })
    },

    // 6. Skysčių vienetas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuriuo vienetu paprastai nusakomas skysčio kiekis pakelyje?',
        variantai: ['l arba ml', 'cm³', 'm³', 'cm²'],
        teisingas: 0,
        sprendimas: 'Skysčiams vartojami litrai ir mililitrai, nors tai irgi tūrio vienetai.',
      }),

    // 7. Grupavimas pagal dydį
    () => {
      const mazi = TURIO_OBJEKTAI.filter((x) => x.vienetas === 'cm³').map((x) => x.vardas)
      const dideli = TURIO_OBJEKTAI.filter((x) => x.vienetas === 'm³').map((x) => x.vardas)
      return uzdavinys(T5, {
        klausimas: `Kiek iš šių objektų tūrį patogiau matuoti kubiniais metrais: ${[...mazi, ...dideli].join(', ')}?`,
        atsakymas: String(dideli.length),
        atsakymasRodymui: `$${dideli.length}$`,
        sprendimas: `Kubiniais metrais matuojami ${dideli.join(' ir ')}, o likusieji — kubiniais centimetrais.`,
      })
    },
  ])
}

// ── 10.6 Statinį sudarančių kubelių skaičius ────────────────────────────────

const T6 = 'statinio-kubeliai'

const A_STATINYS = [
  {
    klausimas: 'Kiek kubelių sudaro 3 × 2 × 2 statinį?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '$3 \\cdot 2 \\cdot 2 = 12$.',
  },
] as const

export const statinioKubeliai: Generatorius = () => suBandymais(kurkStatini, A_STATINYS, T6)

function kurkStatini(): Uzdavinys | null {
  const a = atsitiktinis(2, 5)
  const b = atsitiktinis(2, 4)
  const c = atsitiktinis(2, 4)

  return variacija([
    // 1. Stačiakampio statinio kubeliai
    () =>
      uzdavinys(T6, {
        klausimas: `Statinys yra ${a} kubelių ilgio, ${b} pločio ir ${c} aukščio. Kiek kubelių jį sudaro?`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$`,
        sprendimas: `$${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$.`,
      }),

    // 2. Vieno sluoksnio kubeliai
    () =>
      uzdavinys(T6, {
        klausimas: `Statinio pagrindas yra ${a} kubelių ilgio ir ${b} pločio. Kiek kubelių sudaro vieną sluoksnį?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 3. Kiek sluoksnių
    () =>
      uzdavinys(T6, {
        klausimas: `Statinį sudaro ${a * b * c} kubeliai, o viename sluoksnyje jų ${a * b}. Kiek sluoksnių yra statinyje?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$`,
        sprendimas: `$${a * b * c} : ${a * b} = ${c}$.`,
      }),

    // 4. Netaisyklingas statinys
    () => {
      const s = statinioStulpeliai(2, 3, 3)
      return uzdavinys(T6, {
        klausimas: 'Kiek kubelių sudaro pavaizduotą statinį?',
        atsakymas: String(kubeliuKiekis(s)),
        atsakymasRodymui: `$${kubeliuKiekis(s)}$`,
        sprendimas: 'Sudedami visų stulpelių kubeliai.',
        brezinys: kubeliuStatinys4(s),
      })
    },

    // 5. Kiek trūksta iki pilno gretasienio
    () => {
      const s = statinioStulpeliai(2, 3, 3)
      const maks = Math.max(...s.flat())
      const pilnas = s.length * s[0].length * maks
      const yra = kubeliuKiekis(s)
      if (pilnas === yra) return null
      return uzdavinys(T6, {
        klausimas: `Kiek kubelių reikia pridėti, kad statinys taptų pilnu ${s[0].length} × ${s.length} × ${maks} gretasieniu?`,
        atsakymas: String(pilnas - yra),
        atsakymasRodymui: `$${pilnas - yra}$`,
        sprendimas: `Pilname gretasienyje būtų $${s[0].length} \\cdot ${s.length} \\cdot ${maks} = ${pilnas}$ kubeliai, o dabar jų ${yra}.`,
        brezinys: vaizdasIsVirsaus(s),
      })
    },

    // 6. Kubo kubeliai
    () => {
      const k = atsitiktinis(2, 5)
      return uzdavinys(T6, {
        klausimas: `Kiek kubelių sudaro kubą, kurio kiekviena briauna yra ${k} kubelių ilgio?`,
        atsakymas: String(k * k * k),
        atsakymasRodymui: `$${k * k * k}$`,
        sprendimas: `$${k} \\cdot ${k} \\cdot ${k} = ${k * k * k}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: `Statinys yra ${a} × ${b} × ${c} kubelių. Mokinys suskaičiavo $${a} + ${b} + ${c} = ${a + b + c}$. Užrašyk teisingą kubelių skaičių.`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$`,
        sprendimas: `Kubelių skaičius randamas dauginant: $${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$.`,
      }),
  ])
}

// ── 10.7 Kubas ir stačiakampis gretasienis ──────────────────────────────────

const T7 = 'kubas-ir-gretasienis'

const A_KUBAS = [
  {
    klausimas: 'Kuo kubas panašus į stačiakampį gretasienį?',
    atsakymas: 'a',
    atsakymasRodymui: 'abu turi 6 sienas, 12 briaunų ir 8 viršūnes',
    sprendimas: 'Kubas yra ypatingas gretasienis.',
  },
] as const

export const kubasIrGretasienis: Generatorius = () => suBandymais(kurkKuba, A_KUBAS, T7)

function kurkKuba(): Uzdavinys | null {
  return variacija([
    // 1. Kuo panašūs
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kuo kubas panašus į stačiakampį gretasienį?',
        variantai: [
          'abu turi 6 sienas, 12 briaunų ir 8 viršūnes',
          'abu turi 4 sienas',
          'abiejų visos briaunos vienodo ilgio',
          'abu yra plokščios figūros',
        ],
        teisingas: 0,
        sprendimas: 'Skiriasi tik briaunų ilgiai, o sandara ta pati.',
        brezinys: vienasBrezinys(gretasienis()),
      }),

    // 2. Kiek sienų
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek sienų turi stačiakampis gretasienis?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Priekinė ir galinė, viršutinė ir apatinė, kairė ir dešinė.',
        brezinys: vienasBrezinys(gretasienis('siena')),
      }),

    // 3. Kiek briaunų
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek briaunų turi kubas?',
        atsakymas: '12',
        atsakymasRodymui: '$12$',
        sprendimas: 'Keturios apačioje, keturios viršuje ir keturios vertikalios.',
        brezinys: vienasBrezinys(gretasienis('briauna')),
      }),

    // 4. Kiek viršūnių
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek viršūnių turi stačiakampis gretasienis?',
        atsakymas: '8',
        atsakymasRodymui: '$8$',
        sprendimas: 'Keturios apatinės ir keturios viršutinės.',
        brezinys: vienasBrezinys(gretasienis('virsune')),
      }),

    // 5. Visų briaunų ilgis
    () => {
      const k = atsitiktinis(2, 9)
      return uzdavinys(T7, {
        klausimas: `Kubo briauna ${k} cm. Koks yra visų jo briaunų bendras ilgis?`,
        atsakymas: String(12 * k),
        atsakymasRodymui: `$${12 * k}$ cm`,
        sprendimas: `Briaunų yra 12, visos vienodos: $${k} \\cdot 12 = ${12 * k}$.`,
      })
    },

    // 6. Sienų forma
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kokios formos yra kubo sienos?',
        variantai: ['visos šešios — kvadratai', 'visos šešios — stačiakampiai, bet ne kvadratai', 'keturios kvadratai ir dvi stačiakampiai', 'visos šešios — trikampiai'],
        teisingas: 0,
        sprendimas: 'Kubo briaunos vienodos, tad kiekviena siena yra kvadratas.',
      }),

    // 7. Ar kubas yra gretasienis
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kuris teiginys teisingas?',
        variantai: [
          'kiekvienas kubas yra stačiakampis gretasienis',
          'kiekvienas stačiakampis gretasienis yra kubas',
          'kubas ir gretasienis niekada nesutampa',
          'kubas turi daugiau sienų nei gretasienis',
        ],
        teisingas: 0,
        sprendimas: 'Kubas yra gretasienis, kurio visos briaunos vienodo ilgio, o atvirkščiai — ne.',
      }),
  ])
}

// ── 10.8 Kodėl kubas yra ypatingas gretasienis ──────────────────────────────

const T8 = 'kodel-kubas-ypatingas'

const A_YPATINGAS = [
  {
    klausimas: 'Kodėl kubas yra ypatingas stačiakampis gretasienis?',
    atsakymas: 'a',
    atsakymasRodymui: 'nes visos jo briaunos vienodo ilgio',
    sprendimas: 'Dėl to visos sienos tampa kvadratais.',
  },
] as const

export const kodelKubasYpatingas: Generatorius = () =>
  suBandymais(kurkYpatinguma, A_YPATINGAS, T8)

function kurkYpatinguma(): Uzdavinys | null {
  const k = atsitiktinis(2, 8)

  return variacija([
    // 1. Kodėl ypatingas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kodėl kubas vadinamas ypatingu stačiakampiu gretasieniu?',
        variantai: [
          'nes visos jo briaunos vienodo ilgio',
          'nes jis turi mažiau sienų',
          'nes jis visada didesnis',
          'nes jo sienos yra trikampiai',
        ],
        teisingas: 0,
        sprendimas: 'Kai visi trys matmenys sutampa, gretasienis tampa kubu.',
      }),

    // 2. Kubo tūris
    () =>
      uzdavinys(T8, {
        klausimas: `Kubo briauna ${k} cm. Koks jo tūris?`,
        atsakymas: String(k * k * k),
        atsakymasRodymui: `$${k * k * k}$ cm³`,
        sprendimas: `$${k} \\cdot ${k} \\cdot ${k} = ${k * k * k}$.`,
        brezinys: gretasienisSuMatais(k, k, k),
      }),

    // 3. Kada gretasienis tampa kubu
    () => {
      const a = atsitiktinis(2, 8)
      const b = atsitiktinis(2, 8)
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Gretasienio briaunos yra ${a} cm, ${a} cm ir ${b} cm. Ką reikėtų pakeisti, kad jis taptų kubu?`,
        variantai: [
          `trečiąją briauną padaryti ${a} cm ilgio`,
          'pridėti dar vieną sieną',
          'pasukti gretasienį',
          'padvigubinti visas briaunas',
        ],
        teisingas: 0,
        sprendimas: 'Kube visos trys briaunos vienodo ilgio.',
      })
    },

    // 4. Vienos sienos plotas
    () =>
      uzdavinys(T8, {
        klausimas: `Kubo briauna ${k} cm. Koks vienos jo sienos plotas?`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}$ cm²`,
        sprendimas: `Siena yra kvadratas: $${k} \\cdot ${k} = ${k * k}$.`,
      }),

    // 5. Visų sienų plotas
    () =>
      uzdavinys(T8, {
        klausimas: `Kubo briauna ${k} cm. Koks yra visų šešių jo sienų bendras plotas?`,
        atsakymas: String(6 * k * k),
        atsakymasRodymui: `$${6 * k * k}$ cm²`,
        sprendimas: `Viena siena $${k * k}$ cm², sienų šešios: $${k * k} \\cdot 6 = ${6 * k * k}$.`,
      }),

    // 6. Briauna iš tūrio
    () => {
      const t = k * k * k
      return uzdavinys(T8, {
        klausimas: `Kubo tūris ${t} cm³. Kokio ilgio jo briauna?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$ cm`,
        sprendimas: `Ieškomas skaičius, kurį padauginus tris kartus iš savęs gaunama ${t}: $${k} \\cdot ${k} \\cdot ${k} = ${t}$.`,
      })
    },

    // 7. Kaip keičiasi tūris
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Kubo briauna padvigubinama nuo ${k} cm iki ${2 * k} cm. Kaip pasikeičia tūris?`,
        variantai: [
          `padidėja nuo ${k * k * k} iki ${8 * k * k * k} cm³`,
          `padvigubėja iki ${2 * k * k * k} cm³`,
          'nesikeičia',
          `padidėja keturis kartus`,
        ],
        teisingas: 0,
        sprendimas: `Dvigubėja visos trys briaunos: $${2 * k} \\cdot ${2 * k} \\cdot ${2 * k} = ${8 * k * k * k}$.`,
      }),
  ])
}

// ── 10.9 Prizmė ir piramidė ─────────────────────────────────────────────────

const T9 = 'prizme-ir-piramide-4'

const A_PRIZME = [
  {
    klausimas: 'Kuo piramidė skiriasi nuo prizmės?',
    atsakymas: 'a',
    atsakymasRodymui: 'piramidė turi vieną pagrindą ir viršūnę, prizmė — du pagrindus',
    sprendimas: 'Prizmės pagrindai vienodi ir lygiagretūs.',
  },
] as const

export const prizmeIrPiramide4: Generatorius = () => suBandymais(kurkPrizme, A_PRIZME, T9)

function kurkPrizme(): Uzdavinys | null {
  return variacija([
    // 1. Kuo skiriasi
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kuo piramidė skiriasi nuo prizmės?',
        variantai: [
          'piramidė turi vieną pagrindą ir viršūnę, o prizmė — du vienodus pagrindus',
          'piramidė turi daugiau sienų',
          'prizmė neturi viršūnių',
          'piramidė yra plokščia figūra',
        ],
        teisingas: 0,
        sprendimas: 'Prizmės šoninės sienos yra stačiakampiai, o piramidės — trikampiai.',
        brezinys: kunuEile(['prizme', 'piramide']),
      }),

    // 2. Atpažinti iš brėžinio
    () => {
      const kuris = pasirink<ErdvesKunas>(['prizme', 'piramide'])
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kokia erdvės figūra pavaizduota?',
        variantai: kuris === 'prizme' ? ['prizmė', 'piramidė', 'ritinys'] : ['piramidė', 'prizmė', 'kūgis'],
        teisingas: 0,
        sprendimas:
          kuris === 'prizme'
            ? 'Viršuje ir apačioje yra dvi vienodos figūros, sujungtos vertikaliomis briaunomis.'
            : 'Visos šoninės briaunos susieina viename taške — viršūnėje.',
        brezinys: erdvesKunas(kuris),
      })
    },

    // 3. Piramidės sienos
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kokios formos yra piramidės šoninės sienos?',
        variantai: ['trikampiai', 'kvadratai', 'apskritimai', 'stačiakampiai'],
        teisingas: 0,
        sprendimas: 'Visos šoninės sienos susieina viršūnėje, tad kiekviena jų yra trikampis.',
        brezinys: erdvesKunas('piramide'),
      }),

    // 4. Prizmės sienos
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kokios formos yra tiesiosios prizmės šoninės sienos?',
        variantai: ['stačiakampiai', 'trikampiai', 'apskritimai', 'penkiakampiai'],
        teisingas: 0,
        sprendimas: 'Šoninės briaunos vertikalios ir vienodo ilgio, tad sienos yra stačiakampiai.',
        brezinys: erdvesKunas('prizme'),
      }),

    // 5. Kiek sienų turi trikampė prizmė
    () =>
      uzdavinys(T9, {
        klausimas: 'Kiek sienų turi trikampė prizmė?',
        atsakymas: '5',
        atsakymasRodymui: '$5$',
        sprendimas: 'Du trikampiai pagrindai ir trys stačiakampės šoninės sienos.',
        brezinys: erdvesKunas('prizme'),
      }),

    // 6. Kiek sienų turi keturkampė piramidė
    () =>
      uzdavinys(T9, {
        klausimas: 'Kiek sienų turi piramidė, kurios pagrindas yra kvadratas?',
        atsakymas: '5',
        atsakymasRodymui: '$5$',
        sprendimas: 'Vienas kvadratinis pagrindas ir keturios trikampės šoninės sienos.',
        brezinys: erdvesKunas('piramide'),
      }),

    // 7. Susieti figūras su pavadinimais
    () => {
      const eile = sumaisyk<ErdvesKunas>(['prizme', 'piramide', 'kubas'])
      const vardai: Record<string, string> = {
        prizme: 'prizmė',
        piramide: 'piramidė',
        kubas: 'kubas',
      }
      return poruUzdavinys(naujasId(T9), T9, {
        klausimas: 'Susiek figūros raidę su jos pavadinimu.',
        poros: eile.map((k, i) => ({ kaire: String.fromCharCode(65 + i), desine: vardai[k] })),
        sprendimas: 'Prizmė turi du vienodus pagrindus, piramidė — vieną pagrindą ir viršūnę, kubas — šešias kvadratines sienas.',
        brezinys: kunuEile(eile),
      })
    },
  ])
}

// ── 10.10 Ritinys ir kūgis ──────────────────────────────────────────────────

const T10 = 'ritinys-ir-kugis'

const A_RITINYS = [
  {
    klausimas: 'Kuo ritinys skiriasi nuo kūgio?',
    atsakymas: 'a',
    atsakymasRodymui: 'ritinys turi du apskritus pagrindus, kūgis — vieną ir viršūnę',
    sprendimas: 'Abu turi apskritą pagrindą, bet kūgis smailėja.',
  },
] as const

export const ritinysIrKugis: Generatorius = () => suBandymais(kurkRitini, A_RITINYS, T10)

function kurkRitini(): Uzdavinys | null {
  return variacija([
    // 1. Kuo skiriasi
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kuo ritinys skiriasi nuo kūgio?',
        variantai: [
          'ritinys turi du apskritus pagrindus, o kūgis — vieną pagrindą ir viršūnę',
          'kūgis neturi pagrindo',
          'ritinys yra plokščias',
          'kūgis turi šešias sienas',
        ],
        teisingas: 0,
        sprendimas: 'Abiejų pagrindas apskritas, bet kūgis smailėja į viršūnę.',
        brezinys: kunuEile(['ritinys', 'kugis']),
      }),

    // 2. Atpažinti iš brėžinio
    () => {
      const kuris = pasirink<ErdvesKunas>(['ritinys', 'kugis', 'rutulys'])
      const vardai: Record<string, string> = { ritinys: 'ritinys', kugis: 'kūgis', rutulys: 'rutulys' }
      const variantai = sumaisyk(['ritinys', 'kūgis', 'rutulys'])
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kokia erdvės figūra pavaizduota?',
        variantai,
        teisingas: variantai.indexOf(vardai[kuris]),
        sprendimas: 'Ritinys turi du apskritus pagrindus, kūgis — vieną ir viršūnę, o rutulys pagrindo neturi.',
        brezinys: erdvesKunas(kuris),
      })
    },

    // 3. Kasdieniai pavyzdžiai
    () =>
      poruUzdavinys(naujasId(T10), T10, {
        klausimas: 'Susiek daiktą su į jį panašia erdvės figūra.',
        poros: [
          { kaire: 'konservų skardinė', desine: 'ritinys' },
          { kaire: 'ledų ragelis', desine: 'kūgis' },
          { kaire: 'kamuolys', desine: 'rutulys' },
        ],
        sprendimas: 'Figūra atpažįstama pagal pagrindų skaičių ir formą.',
      }),

    // 4. Kiek pagrindų
    () =>
      uzdavinys(T10, {
        klausimas: 'Kiek apskritų pagrindų turi ritinys?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Vienas apačioje, kitas viršuje; jie vienodo dydžio.',
        brezinys: erdvesKunas('ritinys'),
      }),

    // 5. Ar turi briaunų
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kodėl ritinio ir kūgio negalima vadinti daugiasieniais?',
        variantai: [
          'nes jų paviršius yra išlenktas, o ne sudarytas iš plokščių sienų',
          'nes jie per maži',
          'nes jie neturi tūrio',
          'nes jie turi per daug sienų',
        ],
        teisingas: 0,
        sprendimas: 'Daugiasienio visos sienos plokščios, o ritinio šoninis paviršius išlenktas.',
      }),

    // 6. Kaip atrodo iš viršaus
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kaip atrodo ritinys, žiūrint tiesiai iš viršaus?',
        variantai: ['apskritimas', 'stačiakampis', 'trikampis', 'kvadratas'],
        teisingas: 0,
        sprendimas: 'Iš viršaus matomas apskritas pagrindas.',
        brezinys: erdvesKunas('ritinys'),
      }),

    // 7. Kaip atrodo iš šono
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kaip atrodo kūgis, žiūrint tiesiai iš šono?',
        variantai: ['trikampis', 'apskritimas', 'kvadratas', 'stačiakampis'],
        teisingas: 0,
        sprendimas: 'Iš šono matyti pagrindas ir į viršūnę smailėjančios kraštinės.',
        brezinys: erdvesKunas('kugis'),
      }),
  ])
}

// ── 10.11 Sienos, briaunos ir viršūnės ──────────────────────────────────────

const T11 = 'sienos-briaunos-virsunes'

const A_ELEMENTAI = [
  {
    klausimas: 'Kiek briaunų turi stačiakampis gretasienis?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: 'Keturios apačioje, keturios viršuje ir keturios vertikalios.',
  },
] as const

export const sienosBriaunosVirsunes: Generatorius = () =>
  suBandymais(kurkElementus, A_ELEMENTAI, T11)

function kurkElementus(): Uzdavinys | null {
  return variacija([
    // 1. Kas yra briauna
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kas vadinama erdvės figūros briauna?',
        variantai: [
          'atkarpa, kurioje susieina dvi sienos',
          'plokščia figūros dalis',
          'taškas, kuriame susieina kelios atkarpos',
          'visas figūros paviršius',
        ],
        teisingas: 0,
        sprendimas: 'Siena yra plokštuma, briauna — atkarpa, viršūnė — taškas.',
        brezinys: vienasBrezinys(gretasienis('briauna')),
      }),

    // 2. Kas yra viršūnė
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kas vadinama erdvės figūros viršūne?',
        variantai: [
          'taškas, kuriame susieina kelios briaunos',
          'plokščia figūros dalis',
          'atkarpa tarp dviejų sienų',
          'aukščiausia figūros vieta',
        ],
        teisingas: 0,
        sprendimas: 'Viršūnė yra taškas — ji neturi nei ilgio, nei ploto.',
        brezinys: vienasBrezinys(gretasienis('virsune')),
      }),

    // 3. Kiek sienų
    () =>
      uzdavinys(T11, {
        klausimas: 'Kiek sienų turi pavaizduota figūra?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Trys matomos ir trys paslėptos — iš viso šešios.',
        brezinys: vienasBrezinys(gretasienis('siena')),
      }),

    // 4. Susieti sąvokas
    () =>
      poruUzdavinys(naujasId(T11), T11, {
        klausimas: 'Susiek sąvoką su tuo, kas ji yra.',
        poros: [
          { kaire: 'siena', desine: 'plokščia figūros dalis' },
          { kaire: 'briauna', desine: 'atkarpa tarp dviejų sienų' },
          { kaire: 'viršūnė', desine: 'taškas, kuriame susieina briaunos' },
        ],
        sprendimas: 'Sienos plokščios, briaunos — atkarpos, viršūnės — taškai.',
      }),

    // 5. Kiek briaunų susieina viršūnėje
    () =>
      uzdavinys(T11, {
        klausimas: 'Kiek briaunų susieina vienoje stačiakampio gretasienio viršūnėje?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Kiekvienoje viršūnėje susieina ilgio, pločio ir aukščio briaunos.',
        brezinys: vienasBrezinys(gretasienis('virsune')),
      }),

    // 6. Trikampės prizmės elementai
    () =>
      uzdavinys(T11, {
        klausimas: 'Kiek viršūnių turi trikampė prizmė?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Trys viršūnės apatiniame trikampyje ir trys viršutiniame.',
        brezinys: erdvesKunas('prizme'),
      }),

    // 7. Elementų suma
    () =>
      uzdavinys(T11, {
        klausimas: 'Kiek iš viso sienų, briaunų ir viršūnių turi kubas?',
        atsakymas: '26',
        atsakymasRodymui: '$26$',
        sprendimas: '$6 + 12 + 8 = 26$.',
        brezinys: vienasBrezinys(gretasienis()),
      }),
  ])
}

// ── 10.12 Erdvės figūra ir jos išklotinė ────────────────────────────────────

const T12 = 'figura-ir-isklotine'

const A_ISKLOTINE = [
  {
    klausimas: 'Iš kelių kvadratų sudaryta kubo išklotinė?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Kubas turi šešias vienodas sienas.',
  },
] as const

export const figuraIrIsklotine: Generatorius = () => suBandymais(kurkIsklotine, A_ISKLOTINE, T12)

function kurkIsklotine(): Uzdavinys | null {
  return variacija([
    // 1. Kiek kvadratų kubo išklotinėje
    () =>
      uzdavinys(T12, {
        klausimas: 'Iš kelių kvadratų sudaryta kubo išklotinė?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Tiek, kiek kubas turi sienų.',
        brezinys: isklotine('kubas'),
      }),

    // 2. Kokia figūra gaunama
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kokia erdvės figūra gaunama sulankstus pavaizduotą išklotinę?',
        variantai: ['kubas', 'piramidė', 'ritinys', 'kūgis'],
        teisingas: 0,
        sprendimas: 'Šeši vienodi kvadratai sulankstomi į kubą.',
        brezinys: isklotine('kubas'),
      }),

    // 3. Piramidės išklotinė
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kokia erdvės figūra gaunama sulankstus šią išklotinę?',
        variantai: ['piramidė', 'kubas', 'prizmė', 'ritinys'],
        teisingas: 0,
        sprendimas: 'Kvadratinis pagrindas ir keturi trikampiai susieina viename taške.',
        brezinys: isklotine('piramide'),
      }),

    // 4. Netinkama išklotinė
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ar iš šios šešių kvadratų figūros galima sulankstyti kubą?',
        variantai: [
          'ne, sulankstant kvadratai užsidengtų vienas ant kito',
          'taip, kvadratų yra šeši',
          'taip, bet tik iš kartono',
        ],
        teisingas: 0,
        sprendimas: 'Kubo išklotinėje šeši kvadratai turi būti išdėstyti taip, kad kiekvienas atitiktų atskirą sieną.',
        brezinys: isklotine('ne-kubas'),
      }),

    // 5. Kiek trikampių piramidės išklotinėje
    () =>
      uzdavinys(T12, {
        klausimas: 'Kiek trikampių yra keturkampės piramidės išklotinėje?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Tiek, kiek pagrindas turi kraštinių.',
        brezinys: isklotine('piramide'),
      }),

    // 6. Sienos plotas iš išklotinės
    () => {
      const k = atsitiktinis(2, 8)
      return uzdavinys(T12, {
        klausimas: `Kubo išklotinę sudaro šeši kvadratai, kurių kraštinė ${k} cm. Koks yra visos išklotinės plotas?`,
        atsakymas: String(6 * k * k),
        atsakymasRodymui: `$${6 * k * k}$ cm²`,
        sprendimas: `Vieno kvadrato plotas $${k * k}$ cm², jų šeši: $${k * k} \\cdot 6 = ${6 * k * k}$.`,
      })
    },

    // 7. Ką rodo išklotinė
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ką parodo erdvės figūros išklotinė?',
        variantai: [
          'iš kokių plokščių figūrų sudarytas jos paviršius',
          'koks yra figūros tūris',
          'kiek figūra sveria',
          'kokios spalvos figūra',
        ],
        teisingas: 0,
        sprendimas: 'Išklotinė yra išlankstytas figūros paviršius.',
      }),
  ])
}

// ── 10.13 Vaizdas iš viršaus ────────────────────────────────────────────────

const T13 = 'vaizdas-is-virsaus'

const A_IS_VIRSAUS = [
  {
    klausimas: 'Kaip atrodo kubas, žiūrint tiesiai iš viršaus?',
    atsakymas: 'a',
    atsakymasRodymui: 'kvadratas',
    sprendimas: 'Matoma tik viršutinė siena.',
  },
] as const

export const vaizdasIsVirsausUzd: Generatorius = () =>
  suBandymais(kurkIsVirsaus, A_IS_VIRSAUS, T13)

function kurkIsVirsaus(): Uzdavinys | null {
  const s = statinioStulpeliai(2, 3, 3)

  return variacija([
    // 1. Kubo vaizdas iš viršaus
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Kaip atrodo kubas, žiūrint tiesiai iš viršaus?',
        variantai: ['kvadratas', 'stačiakampis', 'trikampis', 'apskritimas'],
        teisingas: 0,
        sprendimas: 'Matoma tik viršutinė siena, o ji yra kvadratas.',
        brezinys: erdvesKunas('kubas'),
      }),

    // 2. Kiek langelių matyti iš viršaus
    () => {
      const langeliu = s.flat().filter((x) => x > 0).length
      return uzdavinys(T13, {
        klausimas: 'Kiek langelių užima statinys, žiūrint iš viršaus?',
        atsakymas: String(langeliu),
        atsakymasRodymui: `$${langeliu}$`,
        sprendimas: 'Skaičiuojami visi langeliai, kuriuose stovi bent vienas kubelis.',
        brezinys: vaizdasIsVirsaus(s),
      })
    },

    // 3. Kiek kubelių viršuje
    () => {
      const maks = Math.max(...s.flat())
      const kiekis = s.flat().filter((x) => x === maks).length
      return uzdavinys(T13, {
        klausimas: `Kiek stulpelių statinyje yra ${maks} kubelių aukščio?`,
        atsakymas: String(kiekis),
        atsakymasRodymui: `$${kiekis}$`,
        sprendimas: `Vaizde iš viršaus skaičiuojami langeliai su skaičiumi ${maks}.`,
        brezinys: vaizdasIsVirsaus(s),
      })
    },

    // 4. Ritinio vaizdas
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Kaip atrodo ritinys, žiūrint iš viršaus?',
        variantai: ['apskritimas', 'stačiakampis', 'kvadratas', 'trikampis'],
        teisingas: 0,
        sprendimas: 'Iš viršaus matomas apskritas pagrindas.',
        brezinys: erdvesKunas('ritinys'),
      }),

    // 5. Gretasienio vaizdas
    () => {
      const a = atsitiktinis(2, 6)
      const b = atsitiktinis(2, 6)
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Gretasienio matmenys ${a} cm, ${b} cm ir ${atsitiktinis(2, 6)} cm. Kokios formos figūra matoma iš viršaus?`,
        variantai: ['stačiakampis', 'kvadratas', 'trikampis', 'apskritimas'],
        teisingas: 0,
        sprendimas: `Viršutinė siena yra ${a} cm × ${b} cm stačiakampis.`,
      })
    },

    // 6. Kiek kubelių statinyje pagal vaizdą
    () =>
      uzdavinys(T13, {
        klausimas: 'Kiek kubelių sudaro statinį, kurio vaizdas iš viršaus pateiktas?',
        atsakymas: String(kubeliuKiekis(s)),
        atsakymasRodymui: `$${kubeliuKiekis(s)}$`,
        sprendimas: `Sudedami visi langelių skaičiai: ${s.flat().join(' + ')}.`,
        brezinys: vaizdasIsVirsaus(s),
      }),

    // 7. Ko iš viršaus nematyti
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Ko negalima sužinoti žiūrint į statinį tik iš viršaus, be užrašytų skaičių?',
        variantai: [
          'kiek kubelių yra kiekviename stulpelyje',
          'kiek langelių statinys užima',
          'kokia statinio forma iš viršaus',
          'kiek stulpelių yra statinyje',
        ],
        teisingas: 0,
        sprendimas: 'Iš viršaus matyti tik viršutiniai kubeliai, tad aukštį reikia nurodyti atskirai.',
      }),
  ])
}

// ── 10.14 Vaizdas iš priekio ir iš šono ─────────────────────────────────────

const T14 = 'vaizdas-is-priekio'

const A_IS_PRIEKIO = [
  {
    klausimas: 'Kaip atrodo ritinys, žiūrint iš šono?',
    atsakymas: 'a',
    atsakymasRodymui: 'stačiakampis',
    sprendimas: 'Iš šono matomas ritinio šoninis paviršius.',
  },
] as const

export const vaizdasIsPriekio: Generatorius = () => suBandymais(kurkIsPriekio, A_IS_PRIEKIO, T14)

function kurkIsPriekio(): Uzdavinys | null {
  const s = statinioStulpeliai(2, 3, 3)

  return variacija([
    // 1. Ritinys iš šono
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kaip atrodo ritinys, žiūrint tiesiai iš šono?',
        variantai: ['stačiakampis', 'apskritimas', 'trikampis', 'ovalas'],
        teisingas: 0,
        sprendimas: 'Iš šono matomas šoninis paviršius, kuris atrodo kaip stačiakampis.',
        brezinys: erdvesKunas('ritinys'),
      }),

    // 2. Kūgis iš šono
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kaip atrodo kūgis, žiūrint tiesiai iš šono?',
        variantai: ['trikampis', 'apskritimas', 'stačiakampis', 'kvadratas'],
        teisingas: 0,
        sprendimas: 'Iš šono matomas pagrindas ir dvi į viršūnę einančios kraštinės.',
        brezinys: erdvesKunas('kugis'),
      }),

    // 3. Statinio aukštis iš priekio
    () => {
      const maks = Math.max(...s.flat())
      return uzdavinys(T14, {
        klausimas: 'Kiek kubelių aukščio atrodys statinys, žiūrint iš priekio?',
        atsakymas: String(maks),
        atsakymasRodymui: `$${maks}$`,
        sprendimas: `Iš priekio matomas aukščiausias stulpelis — jame ${maks} kubeliai.`,
        brezinys: vaizdasIsVirsaus(s),
      })
    },

    // 4. Statinio plotis iš priekio
    () =>
      uzdavinys(T14, {
        klausimas: 'Kiek kubelių pločio atrodys statinys, žiūrint iš priekio?',
        atsakymas: String(s[0].length),
        atsakymasRodymui: `$${s[0].length}$`,
        sprendimas: `Iš priekio matomi visi ${s[0].length} stulpeliai vienoje eilėje.`,
        brezinys: vaizdasIsVirsaus(s),
      }),

    // 5. Kubas iš visų pusių
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kaip atrodo kubas, žiūrint iš priekio, iš šono ir iš viršaus?',
        variantai: [
          'visais atvejais kaip kvadratas',
          'iš priekio kaip kvadratas, iš šono kaip stačiakampis',
          'iš viršaus kaip apskritimas',
          'kiekvieną kartą skirtingai',
        ],
        teisingas: 0,
        sprendimas: 'Visos šešios kubo sienos yra vienodi kvadratai.',
        brezinys: erdvesKunas('kubas'),
      }),

    // 6. Kodėl reikia kelių vaizdų
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kodėl erdvės figūrai aprašyti reikia kelių vaizdų?',
        variantai: [
          'nes iš vienos pusės nesimato visų matmenų',
          'nes taip gražiau',
          'nes figūra keičia formą',
          'nes vienas vaizdas per mažas',
        ],
        teisingas: 0,
        sprendimas: 'Iš viršaus matyti ilgis ir plotis, iš priekio — ilgis ir aukštis.',
      }),

    // 7. Kuris kūnas
    () => {
      const eile = sumaisyk<ErdvesKunas>(['ritinys', 'kugis', 'kubas'])
      const vardai: Record<string, string> = { ritinys: 'ritinys', kugis: 'kūgis', kubas: 'kubas' }
      const kuris = eile[0]
      const variantai = eile.map((_, i) => String.fromCharCode(65 + i))
      return pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: `Kuris iš pavaizduotų kūnų iš viršaus atrodo kaip ${kuris === 'kubas' ? 'kvadratas' : 'apskritimas'}, o iš šono — kaip ${kuris === 'kubas' ? 'kvadratas' : kuris === 'ritinys' ? 'stačiakampis' : 'trikampis'}?`,
        variantai,
        teisingas: 0,
        sprendimas: `Tai ${vardai[kuris]}.`,
        brezinys: kunuEile(eile),
      })
    },
  ])
}

// ── 10.15 Erdvės figūros konstravimas iš išklotinės ─────────────────────────

const T15 = 'konstravimas-is-isklotines'

const A_KONSTRAVIMAS = [
  {
    klausimas: 'Kiek kvadratų reikia kubo išklotinei?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Kiekvienai kubo sienai po kvadratą.',
  },
] as const

export const konstravimasIsIsklotines: Generatorius = () =>
  suBandymais(kurkKonstravima, A_KONSTRAVIMAS, T15)

function kurkKonstravima(): Uzdavinys | null {
  const k = atsitiktinis(2, 8)

  return variacija([
    // 1. Kiek kvadratų reikia
    () =>
      uzdavinys(T15, {
        klausimas: 'Kiek kvadratų reikia iškirpti, kad būtų galima sulankstyti kubą?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Kubas turi šešias sienas, tad reikia šešių kvadratų.',
        brezinys: isklotine('kubas'),
      }),

    // 2. Kokio dydžio kvadratai
    () =>
      uzdavinys(T15, {
        klausimas: `Norima sulankstyti kubą, kurio briauna ${k} cm. Kokio ilgio turi būti išklotinės kvadratų kraštinė?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$ cm`,
        sprendimas: 'Kiekviena kubo siena yra kvadratas su tokia pat kraštine kaip briauna.',
      }),

    // 3. Kiek popieriaus reikės
    () =>
      uzdavinys(T15, {
        klausimas: `Kiek kvadratinių centimetrų popieriaus reikės kubo, kurio briauna ${k} cm, išklotinei?`,
        atsakymas: String(6 * k * k),
        atsakymasRodymui: `$${6 * k * k}$ cm²`,
        sprendimas: `$${k} \\cdot ${k} \\cdot 6 = ${6 * k * k}$.`,
      }),

    // 4. Kokia figūra gausis
    () =>
      pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: 'Kokia figūra gausis sulankstus pavaizduotą išklotinę?',
        variantai: ['piramidė', 'kubas', 'ritinys', 'prizmė'],
        teisingas: 0,
        sprendimas: 'Trikampiai susilenkia į vieną viršūnę virš kvadratinio pagrindo.',
        brezinys: isklotine('piramide'),
      }),

    // 5. Kiek lankstymo linijų
    () =>
      uzdavinys(T15, {
        klausimas: 'Kiek lankstymo linijų yra tarp šešių kubo išklotinės kvadratų?',
        atsakymas: '5',
        atsakymasRodymui: '$5$',
        sprendimas: 'Šeši kvadratai sujungti į vieną figūrą penkiomis bendromis kraštinėmis.',
        brezinys: isklotine('kubas'),
      }),

    // 6. Kubelių tūris iš išklotinės
    () =>
      uzdavinys(T15, {
        klausimas: `Iš išklotinės sulankstyto kubo briauna ${k} cm. Koks jo tūris?`,
        atsakymas: String(k * k * k),
        atsakymasRodymui: `$${k * k * k}$ cm³`,
        sprendimas: `$${k} \\cdot ${k} \\cdot ${k} = ${k * k * k}$.`,
      }),

    // 7. Ką reikia patikrinti
    () =>
      pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: 'Ką reikia patikrinti prieš lankstant išklotinę į kubą?',
        variantai: [
          'ar visi šeši kvadratai vienodo dydžio ir ar jie išdėstyti tinkamai',
          'ar popierius spalvotas',
          'ar išklotinė telpa ant stalo',
          'ar kvadratų yra daugiau nei šeši',
        ],
        teisingas: 0,
        sprendimas: 'Šeši kvadratai turi būti vienodi ir sujungti taip, kad lankstant kiekvienas atsidurtų prie savo kubo sienos.',
      }),
  ])
}
