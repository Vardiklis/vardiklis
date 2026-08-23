import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys } from './formatai'
import { type Daiktas } from './ikonos'
import {
  atkarpuEile,
  liniuote,
  monetos,
  piesinysIrBrezinys,
  svarstykles,
  tinkleliuZemelapis,
  zenkluBrezinys,
  type GeometrijosZenklas,
  type Moneta,
} from './pirmoku-vaizdai'
import { laikrodis } from './vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 1 klasės 4 tema „Matavimas ir braižymas“ ir 9 tema „Matai“.
 *
 * Abi anksčiau rėmėsi bendrais 1–5 klasių generatoriais, ir dėl to pirmokas
 * gaudavo ne savo programą: „Kiek milimetrų yra 7 cm 9 mm?“ vietoj „Kuo
 * matuoti stalą?“, „Kiek įstrižainių galima nubrėžti iš vienos viršūnės?“
 * vietoj „Kur yra atkarpa?“, o pinigų potemė — kainas su centais po kablelio.
 *
 * Pirmos klasės programoje yra tik centimetras ir metras (be milimetrų ir
 * decimetrų), sveikos valandos (be minučių), euro monetos (be sudėties su
 * kableliu) ir kilogramas kaip masės vienetas. Visi šios rinkmenos
 * generatoriai laikosi būtent šių ribų.
 */

const VARDAI = ['Ugnė', 'Matas', 'Ieva', 'Lina', 'Tomas', 'Rugilė'] as const

/** „1 centimetras“, „3 centimetrai“, „10 centimetrų“. */
const CM_FORMOS = { vns: 'centimetras', dgs: 'centimetrai', kilm: 'centimetrų' }
const M_FORMOS = { vns: 'metras', dgs: 'metrai', kilm: 'metrų' }

// ═══ 4 tema. Matavimas ir braižymas ═════════════════════════════════════════

// ── 4.1 Kuo matuoti ilgį? ───────────────────────────────────────────────────

/**
 * Nestandartiniai matai.
 *
 * Pirmiausia matuojama tuo, kas visada po ranka: sprindžiais, pėdomis,
 * žingsniais, delnais. Potemės esmė — pasirinkti tinkamą matą, o ne
 * skaičiuoti, tad daugumos pavidalų atsakymas yra matas, ne skaičius.
 */
const MATAI = [
  { vardas: 'sprindžiais', kam: ['stalą', 'suolą', 'lentyną', 'knygą'] },
  { vardas: 'žingsniais', kam: ['klasės ilgį', 'kiemo ilgį', 'koridorių', 'taką'] },
  { vardas: 'delnais', kam: ['knygą', 'sąsiuvinį', 'dėžutę', 'lentą'] },
  { vardas: 'pėdomis', kam: ['kambario ilgį', 'kilimo ilgį', 'sporto salę', 'taką'] },
] as const

const A_MATAI = [
  {
    klausimas: 'Kuo patogiau išmatuoti klasės ilgį?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — žingsniais',
    sprendimas: 'Ilgus daiktus patogiau matuoti dideliu matu — žingsniais.',
  },
] as const

export const nestandartiniaiMatai: Generatorius = () =>
  suBandymais(kurkMatus, A_MATAI, 'nestandartiniai-matai')

/** Dideli daiktai matuojami žingsniais ar pėdomis, maži — sprindžiais ar delnais. */
const DIDELI = ['klasės ilgį', 'kiemo ilgį', 'koridorių', 'kambario ilgį', 'sporto salę'] as const
const MAZI = ['knygą', 'sąsiuvinį', 'pieštuką', 'dėžutę', 'trintuką'] as const

function kurkMatus(): Uzdavinys | null {
  const matas = pasirink(MATAI)

  return variacija([
    // 1. Kuo matuojama paveikslėlyje
    () =>
      pasirinkimoUzdavinys(naujasId('nestandartiniai-matai'), 'nestandartiniai-matai', {
        klausimas: `Vaikas matuoja ${pasirink(matas.kam)} ${matas.vardas}. Kuo jis matuoja?`,
        variantai: [
          matas.vardas,
          pasirink(MATAI.filter((m) => m.vardas !== matas.vardas)).vardas,
          'liniuote',
        ],
        teisingas: 0,
        sprendimas: `Matuojama tuo, kas paminėta sąlygoje — ${matas.vardas}.`,
      }),

    // 2. Didelis daiktas — didelis matas
    () => {
      const kas = pasirink(DIDELI)
      return pasirinkimoUzdavinys(naujasId('nestandartiniai-matai'), 'nestandartiniai-matai', {
        klausimas: `Kuo patogiau išmatuoti ${kas}?`,
        variantai: ['žingsniais', 'sprindžiais', 'pieštuku'],
        teisingas: 0,
        sprendimas: 'Ilgą daiktą patogiau matuoti dideliu matu: žingsnių reikės mažiau.',
      })
    },

    // 3. Mažas daiktas — mažas matas
    () => {
      const kas = pasirink(MAZI)
      return pasirinkimoUzdavinys(naujasId('nestandartiniai-matai'), 'nestandartiniai-matai', {
        klausimas: `Kuo patogiau išmatuoti ${kas}?`,
        variantai: ['sprindžiais', 'žingsniais', 'kilogramais'],
        teisingas: 0,
        sprendimas: 'Mažą daiktą patogiau matuoti mažu matu — sprindžiais.',
      })
    },

    // 4. Kodėl matuoti reikia vienodu matu
    () => {
      const [a, b] = sumaisyk([...VARDAI]).slice(0, 2)
      return pasirinkimoUzdavinys(naujasId('nestandartiniai-matai'), 'nestandartiniai-matai', {
        klausimas: `${a} išmatavo suolą sprindžiais, o ${b} — žingsniais. Kodėl gavo skirtingus skaičius?`,
        variantai: ['matavo skirtingais matais', 'suolas pailgėjo', 'abu suklydo'],
        teisingas: 0,
        sprendimas: 'Tas pats daiktas skirtingais matais išeina skirtingo skaičiaus.',
      })
    },

    // 5. Kiek sprindžių — vienintelis skaitinis pavidalas
    () => {
      const kiek = atsitiktinis(3, 8)
      return uzdavinys('nestandartiniai-matai', {
        klausimas: `Stalo ilgis — ${kiek} ${derink(kiek, { vns: 'sprindis', dgs: 'sprindžiai', kilm: 'sprindžių' })}. Kiek sprindžių ilgio yra stalas?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `Matuojant sprindžiais gauta ${kiek}.`,
      })
    },
  ])
}

// ── 4.2 Kas yra centimetras? ────────────────────────────────────────────────

const A_CM = [
  {
    klausimas: 'Kiek centimetrų ilgio yra juostelė?',
    atsakymas: '7',
    atsakymasRodymui: '$7$ cm',
    sprendimas: 'Juostelė tęsiasi nuo 0 iki 7 padalos, tad jos ilgis 7 cm.',
  },
] as const

export const centimetras: Generatorius = () => suBandymais(kurkCentimetra, A_CM, 'centimetras')

function kurkCentimetra(): Uzdavinys | null {
  return variacija([
    // 1. Vienas centimetras liniuotėje
    () =>
      uzdavinys('centimetras', {
        klausimas: 'Liniuotėje pažymėta atkarpa nuo 0 iki 1. Kiek centimetrų yra jos ilgis?',
        atsakymas: '1',
        atsakymasRodymui: '$1$ cm',
        sprendimas: 'Atstumas tarp dviejų gretimų liniuotės padalų yra 1 centimetras.',
        brezinys: liniuote(6, { nuo: 0, iki: 1 }),
      }),

    // 2. Juostelės ilgis nuo nulio
    () => {
      const ilgis = atsitiktinis(3, 8)
      return uzdavinys('centimetras', {
        klausimas: 'Kiek centimetrų ilgio yra juostelė?',
        atsakymas: String(ilgis),
        atsakymasRodymui: `$${ilgis}$ cm`,
        sprendimas: `Juostelė tęsiasi nuo 0 iki ${ilgis} padalos, tad jos ilgis ${ilgis} cm.`,
        brezinys: liniuote(9, { nuo: 0, iki: ilgis }),
      })
    },

    // 3. Ilgis ar masė — kokiu vienetu matuojama
    () => {
      const kas = pasirink(['Pieštukas', 'Šaukštas', 'Trintukas', 'Sąsiuvinis'])
      const ilgis = atsitiktinis(3, 9)
      return pasirinkimoUzdavinys(naujasId('centimetras'), 'centimetras', {
        klausimas: `Užbaik sakinį: „${kas} yra ${ilgis} … ilgio.“`,
        variantai: ['cm', 'kg', 'val.'],
        teisingas: 0,
        sprendimas: 'Ilgis matuojamas centimetrais, o kilogramais — masė.',
      })
    },

    // 4. Ką reiškia santrumpa
    () =>
      pasirinkimoUzdavinys(naujasId('centimetras'), 'centimetras', {
        klausimas: 'Ką reiškia santrumpa cm?',
        variantai: ['centimetras', 'kilogramas', 'valanda'],
        teisingas: 0,
        sprendimas: 'cm yra centimetro santrumpa — ilgio matavimo vienetas.',
      }),

    // 5. Kiek centimetrų tarp padalų
    () => {
      const nuo = atsitiktinis(1, 4)
      const ilgis = atsitiktinis(2, 5)
      return uzdavinys('centimetras', {
        klausimas: `Kiek centimetrų yra nuo ${nuo} iki ${nuo + ilgis} padalos?`,
        atsakymas: String(ilgis),
        atsakymasRodymui: `$${ilgis}$ cm`,
        sprendimas: `Nuo ${nuo} iki ${nuo + ilgis} yra ${ilgis} ${derink(ilgis, CM_FORMOS)}.`,
        brezinys: liniuote(9, { nuo, iki: nuo + ilgis }),
      })
    },
  ])
}

// ── 4.3 Kaip matuoti ilgį? ──────────────────────────────────────────────────

const A_MATAVIMAS = [
  {
    klausimas: 'Pieštukas padėtas nuo 0 padalos. Koks jo ilgis?',
    atsakymas: '7',
    atsakymasRodymui: '$7$ cm',
    sprendimas: 'Pieštukas baigiasi ties 7 padala, tad jo ilgis 7 cm.',
  },
] as const

export const matavimasLiniuote: Generatorius = () =>
  suBandymais(kurkMatavima, A_MATAVIMAS, 'matavimas-liniuote')

const MATUOJAMI = ['Pieštukas', 'Trintukas', 'Juostelė', 'Segtukas', 'Šiaudelis'] as const

function kurkMatavima(): Uzdavinys | null {
  return variacija([
    // 1. Nuo nulio — ilgį galima nuskaityti tiesiai
    () => {
      const ilgis = atsitiktinis(3, 8)
      return uzdavinys('matavimas-liniuote', {
        klausimas: `${pasirink(MATUOJAMI)} padėtas nuo 0 padalos. Koks jo ilgis?`,
        atsakymas: String(ilgis),
        atsakymasRodymui: `$${ilgis}$ cm`,
        sprendimas: `Daiktas baigiasi ties ${ilgis} padala, tad jo ilgis ${ilgis} cm.`,
        brezinys: liniuote(9, { nuo: 0, iki: ilgis }),
      })
    },

    // 2. Ne nuo nulio — ilgį reikia suskaičiuoti
    () => {
      const nuo = atsitiktinis(1, 4)
      const ilgis = atsitiktinis(2, 5)
      return uzdavinys('matavimas-liniuote', {
        klausimas: `${pasirink(MATUOJAMI)} padėtas nuo ${nuo} iki ${nuo + ilgis} padalos. Koks jo ilgis?`,
        atsakymas: String(ilgis),
        atsakymasRodymui: `$${ilgis}$ cm`,
        sprendimas: `Ilgis nėra ta padala, ties kuria daiktas baigiasi: $${nuo + ilgis} - ${nuo} = ${ilgis}$ cm.`,
        brezinys: liniuote(9, { nuo, iki: nuo + ilgis }),
      })
    },

    // 3. Pasirinkimas iš piešinio
    () => {
      const ilgis = atsitiktinis(3, 7)
      const netiesos = [ilgis + 1, ilgis - 1].filter((x) => x > 0 && x !== ilgis)
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('matavimas-liniuote'), 'matavimas-liniuote', {
        klausimas: 'Pasirink juostelės ilgį.',
        variantai: [`${ilgis} cm`, ...netiesos.map((x) => `${x} cm`)],
        teisingas: 0,
        sprendimas: `Juostelė tęsiasi nuo 0 iki ${ilgis}, tad jos ilgis ${ilgis} cm.`,
        brezinys: liniuote(9, { nuo: 0, iki: ilgis }),
      })
    },

    // 4. Kaip teisingai dėti daiktą prie liniuotės
    () =>
      pasirinkimoUzdavinys(naujasId('matavimas-liniuote'), 'matavimas-liniuote', {
        klausimas: 'Nuo kurios padalos reikia pradėti matuoti daiktą?',
        variantai: ['nuo 0', 'nuo 1', 'nuo bet kurios'],
        teisingas: 0,
        sprendimas: 'Daikto galas dedamas ties 0 — tada ilgį rodo padala kitame gale.',
        brezinys: liniuote(7, { nuo: 0, iki: 5 }),
      }),

    // 5. Kiek liks iki kitos padalos
    () => {
      const ilgis = atsitiktinis(2, 6)
      const iki = ilgis + atsitiktinis(1, 3)
      return uzdavinys('matavimas-liniuote', {
        klausimas: `Juostelė yra ${ilgis} cm ilgio. Kiek centimetrų trūksta iki ${iki} cm?`,
        atsakymas: String(iki - ilgis),
        atsakymasRodymui: `$${iki - ilgis}$ cm`,
        sprendimas: `$${iki} - ${ilgis} = ${iki - ilgis}$ cm.`,
        brezinys: liniuote(9, { nuo: 0, iki: ilgis }),
      })
    },
  ])
}

// ── 4.4 Kaip spręsti ilgio matavimo uždavinius? ─────────────────────────────

const A_ILGIO_UZD = [
  {
    klausimas: 'Raudona juostelė 8 cm, mėlyna 5 cm. Keliais centimetrais raudona ilgesnė?',
    atsakymas: '3',
    atsakymasRodymui: '$3$ cm',
    sprendimas: '$8 - 5 = 3$ cm.',
  },
] as const

export const ilgioUzdaviniai: Generatorius = () =>
  suBandymais(kurkIlgioUzdavini, A_ILGIO_UZD, 'ilgio-uzdaviniai')

function kurkIlgioUzdavini(): Uzdavinys | null {
  const a = atsitiktinis(4, 10)
  const b = atsitiktinis(1, a - 1)

  return variacija([
    // 1. Keliais centimetrais ilgesnė
    () =>
      uzdavinys('ilgio-uzdaviniai', {
        klausimas: `Raudona juostelė ${a} cm, mėlyna — ${b} cm. Keliais centimetrais raudona ilgesnė?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ cm`,
        sprendimas: `$${a} - ${b} = ${a - b}$ cm.`,
        brezinys: atkarpuEile([a, b]),
      }),

    // 2. Bendras ilgis
    () =>
      uzdavinys('ilgio-uzdaviniai', {
        klausimas: `Viena atkarpa ${a} cm, kita — ${b} cm. Koks jų bendras ilgis?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ cm`,
        sprendimas: `$${a} + ${b} = ${a + b}$ cm.`,
        brezinys: atkarpuEile([a, b]),
      }),

    // 3. Nukirpta virvelė
    () =>
      uzdavinys('ilgio-uzdaviniai', {
        klausimas: `Virvelė buvo ${a} cm. Nukirpo ${b} cm. Kiek centimetrų liko?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ cm`,
        sprendimas: `$${a} - ${b} = ${a - b}$ cm.`,
      }),

    // 4. Pieštukas ir trintukas
    () =>
      uzdavinys('ilgio-uzdaviniai', {
        klausimas: `Pieštukas ${a} cm, trintukas — ${b} cm. Kiek centimetrų pieštukas ilgesnis?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ cm`,
        sprendimas: `Ilgių skirtumas: $${a} - ${b} = ${a - b}$ cm.`,
      }),

    // 5. Kuri juostelė ilgesnė
    () =>
      pasirinkimoUzdavinys(naujasId('ilgio-uzdaviniai'), 'ilgio-uzdaviniai', {
        klausimas: `Viena juostelė ${a} cm, kita — ${b} cm. Kuri ilgesnė?`,
        variantai: [`${a} cm`, `${b} cm`, 'abi vienodos'],
        teisingas: 0,
        sprendimas: `${a} yra daugiau nei ${b}, tad ilgesnė yra ${a} cm juostelė.`,
        brezinys: atkarpuEile([a, b]),
      }),
  ])
}

// ── 4.5 Kas yra taškas, atkarpa, tiesė ir spindulys? ────────────────────────

const A_ZENKLAI = [
  {
    klausimas: 'Kelintas brėžinys yra atkarpa?',
    atsakymas: '2',
    atsakymasRodymui: '$2$',
    sprendimas: 'Atkarpa turi du galus — abu pažymėti taškais.',
  },
] as const

export const geometrijosZenklai: Generatorius = () =>
  suBandymais(kurkZenklus, A_ZENKLAI, 'geometrijos-zenklai')

const ZENKLU_APRASAI: Record<GeometrijosZenklas, string> = {
  taskas: 'pažymėtas vienas taškas A ir daugiau nieko',
  atkarpa: 'abu galai pažymėti taškais A ir B',
  spindulys: 'pažymėta tik pradžia — taškas A, o kita kryptimi linija tęsiasi be galo',
  tiese: 'nepažymėtas nė vienas galas: tiesė a tęsiasi į abi puses',
}

const ZENKLU_VARDAI: Record<GeometrijosZenklas, string> = {
  taskas: 'taškas',
  atkarpa: 'atkarpa',
  spindulys: 'spindulys',
  tiese: 'tiesė',
}

function kurkZenklus(): Uzdavinys | null {
  const visi: GeometrijosZenklas[] = ['taskas', 'atkarpa', 'spindulys', 'tiese']

  return variacija([
    // 1–4. Kiekvienas ženklas turi savo pavidalą, kad rinkinyje pasitaikytų visi
    ...visi.map((ieskomas) => () => {
      const eile = sumaisyk(visi)
      const nr = eile.indexOf(ieskomas) + 1
      return uzdavinys('geometrijos-zenklai', {
        klausimas: `Kelintas brėžinys yra ${ZENKLU_VARDAI[ieskomas]}? Parašyk skaičių.`,
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: `Ieškome, kur ${ZENKLU_APRASAI[ieskomas]}. Tai ${nr} brėžinys.`,
        brezinys: zenkluBrezinys(eile),
      })
    }),

    // 5. Kaip vadinasi tas brėžinys
    () => {
      const eile = sumaisyk(visi)
      const nr = atsitiktinis(1, 4)
      const teisingas = eile[nr - 1]
      const kiti = visi.filter((z) => z !== teisingas).slice(0, 2)
      return pasirinkimoUzdavinys(naujasId('geometrijos-zenklai'), 'geometrijos-zenklai', {
        klausimas: `Kaip vadinasi ${nr} brėžinys?`,
        variantai: [ZENKLU_VARDAI[teisingas], ...kiti.map((z) => ZENKLU_VARDAI[z])],
        teisingas: 0,
        sprendimas: `Tai ${ZENKLU_APRASAI[teisingas]}.`,
        brezinys: zenkluBrezinys(eile),
      })
    },
  ])
}

// ── 4.6 Kuo skiriasi piešinys ir brėžinys? ──────────────────────────────────

const A_BREZINYS = [
  {
    klausimas: 'Kelintas vaizdas yra brėžinys?',
    atsakymas: '2',
    atsakymasRodymui: '$2$',
    sprendimas: 'Brėžinys nubrėžtas plonomis tiesiomis linijomis, be spalvų.',
  },
] as const

export const piesinysBrezinys: Generatorius = () =>
  suBandymais(kurkBrezini, A_BREZINYS, 'piesinys-brezinys')

function kurkBrezini(): Uzdavinys | null {
  const kas: Daiktas = 'namas'
  const brezinysPirmas = atsitiktinis(0, 1) === 1
  const nr = brezinysPirmas ? 1 : 2
  const piesinys = piesinysIrBrezinys(brezinysPirmas ? 'brezinys' : 'piesinys', kas)

  return variacija([
    // 1. Kuris yra brėžinys
    () =>
      uzdavinys('piesinys-brezinys', {
        klausimas: 'Kelintas vaizdas yra brėžinys? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: 'Brėžinys nubrėžtas plonomis tiesiomis linijomis, be spalvų ir be smulkmenų.',
        brezinys: piesinys,
      }),

    // 2. Kuris yra piešinys
    () =>
      uzdavinys('piesinys-brezinys', {
        klausimas: 'Kelintas vaizdas yra piešinys? Parašyk skaičių.',
        atsakymas: String(nr === 1 ? 2 : 1),
        atsakymasRodymui: `$${nr === 1 ? 2 : 1}$`,
        sprendimas: 'Piešinys yra spalvotas ir su smulkmenomis — jis rodo, kaip daiktas atrodo.',
        brezinys: piesinys,
      }),

    // 3. Kurį galima nubrėžti liniuote
    () =>
      uzdavinys('piesinys-brezinys', {
        klausimas: 'Kelintą vaizdą galima nubrėžti su liniuote? Parašyk skaičių.',
        atsakymas: String(nr),
        atsakymasRodymui: `$${nr}$`,
        sprendimas: 'Liniuote brėžiamos tiesios linijos, tad su ja nubrėžiamas brėžinys.',
        brezinys: piesinys,
      }),

    // 4. Kuo skiriasi
    () =>
      pasirinkimoUzdavinys(naujasId('piesinys-brezinys'), 'piesinys-brezinys', {
        klausimas: 'Kuo brėžinys skiriasi nuo piešinio?',
        variantai: [
          'brėžinys braižomas tiesiomis linijomis',
          'brėžinys visada spalvotas',
          'brėžinys visada didesnis',
        ],
        teisingas: 0,
        sprendimas: 'Brėžinys tikslus ir braižomas liniuote, o piešinys tik parodo, kaip atrodo.',
      }),

    // 5. Kam reikalingas brėžinys
    () =>
      pasirinkimoUzdavinys(naujasId('piesinys-brezinys'), 'piesinys-brezinys', {
        klausimas: 'Kada reikia brėžinio, o ne piešinio?',
        variantai: [
          'kai svarbu tikslus ilgis',
          'kai norime gražių spalvų',
          'kai piešiame pasaką',
        ],
        teisingas: 0,
        sprendimas: 'Brėžinys rodo tikslius matmenis, tad jo reikia, kai svarbu ilgis.',
      }),
  ])
}

// ── 4.7 Kaip matuoti ir brėžti atkarpas? ────────────────────────────────────

const A_ATKARPOS = [
  {
    klausimas: 'Kelinta atkarpa ilgiausia?',
    atsakymas: '2',
    atsakymasRodymui: '$2$',
    sprendimas: 'Ilgiausia yra ta, kuri tęsiasi toliausiai.',
  },
] as const

export const atkarpuMatavimas: Generatorius = () =>
  suBandymais(kurkAtkarpas, A_ATKARPOS, 'atkarpu-matavimas')

function kurkAtkarpas(): Uzdavinys | null {
  const ilgiai = sumaisyk([2, 4, 6, 8]).slice(0, 3)
  const ilgiausia = ilgiai.indexOf(Math.max(...ilgiai)) + 1
  const trumpiausia = ilgiai.indexOf(Math.min(...ilgiai)) + 1

  return variacija([
    // 1. Atkarpos ilgis liniuote
    () => {
      const ilgis = atsitiktinis(3, 8)
      return uzdavinys('atkarpu-matavimas', {
        klausimas: 'Koks atkarpos ilgis?',
        atsakymas: String(ilgis),
        atsakymasRodymui: `$${ilgis}$ cm`,
        sprendimas: `Atkarpa tęsiasi nuo 0 iki ${ilgis} padalos, tad jos ilgis ${ilgis} cm.`,
        brezinys: liniuote(9, { nuo: 0, iki: ilgis }),
      })
    },

    // 2. Ilgiausia iš trijų
    () =>
      uzdavinys('atkarpu-matavimas', {
        klausimas: 'Kelinta atkarpa ilgiausia? Parašyk skaičių.',
        atsakymas: String(ilgiausia),
        atsakymasRodymui: `$${ilgiausia}$`,
        sprendimas: 'Ilgiausia yra ta atkarpa, kuri tęsiasi toliausiai.',
        brezinys: atkarpuEile(ilgiai),
      }),

    // 3. Trumpiausia iš trijų
    () =>
      uzdavinys('atkarpu-matavimas', {
        klausimas: 'Kelinta atkarpa trumpiausia? Parašyk skaičių.',
        atsakymas: String(trumpiausia),
        atsakymasRodymui: `$${trumpiausia}$`,
        sprendimas: 'Trumpiausia yra ta atkarpa, kuri baigiasi anksčiausiai.',
        brezinys: atkarpuEile(ilgiai),
      }),

    // 4. Kuri iš dviejų ilgesnė
    () => {
      const [a, b] = sumaisyk([3, 7]).slice(0, 2)
      const ilgesne = a > b ? 1 : 2
      return uzdavinys('atkarpu-matavimas', {
        klausimas: 'Palygink dvi atkarpas. Kelinta iš jų ilgesnė? Parašyk skaičių.',
        atsakymas: String(ilgesne),
        atsakymasRodymui: `$${ilgesne}$`,
        sprendimas: `Pirmos atkarpos ilgis ${a} cm, antros — ${b} cm.`,
        brezinys: atkarpuEile([a, b]),
      })
    },

    // 5. Kokio ilgio atkarpą reikia nubrėžti
    () => {
      const ilgis = atsitiktinis(3, 8)
      return uzdavinys('atkarpu-matavimas', {
        klausimas: `Reikia nubrėžti ${ilgis} cm atkarpą. Ties kuria liniuotės padala ji baigsis, jei pradėsi nuo 0?`,
        atsakymas: String(ilgis),
        atsakymasRodymui: `$${ilgis}$`,
        sprendimas: `Pradėjus nuo 0, ${ilgis} cm atkarpa baigiasi ties ${ilgis} padala.`,
        brezinys: liniuote(9),
      })
    },
  ])
}

// ── 4.8 ir 4.9 Kelias tinklelyje ────────────────────────────────────────────

/** Rodyklė ir jos poslinkis tinklelyje. `y` didėja žemyn. */
const RODYKLES = [
  { zenklas: '→', dx: 1, dy: 0 },
  { zenklas: '←', dx: -1, dy: 0 },
  { zenklas: '↑', dx: 0, dy: -1 },
  { zenklas: '↓', dx: 0, dy: 1 },
] as const

const PLOTIS = 4
const AUKSTIS = 3

/** Atsitiktinis kelias tinklelyje, neišeinantis už jo ribų. */
function kurkKelia(
  pradzia: { x: number; y: number },
  zingsniu: number,
): { takas: { x: number; y: number }[]; zenklai: string[] } | null {
  const takas = [pradzia]
  const zenklai: string[] = []
  let dabar = pradzia
  let ankstesnis: (typeof RODYKLES)[number] | null = null
  for (let i = 0; i < zingsniu; i += 1) {
    const galimi = RODYKLES.filter((r) => {
      const x = dabar.x + r.dx
      const y = dabar.y + r.dy
      if (x < 0 || x >= PLOTIS || y < 0 || y >= AUKSTIS) return false
      // Grįžimas atgal į ką tik paliktą langelį („→ ←“) kelio nepailgina, bet
      // pirmokui atrodo kaip klaida sąlygoje.
      return !ankstesnis || r.dx !== -ankstesnis.dx || r.dy !== -ankstesnis.dy
    })
    if (galimi.length === 0) return null
    const r = pasirink(galimi)
    ankstesnis = r
    dabar = { x: dabar.x + r.dx, y: dabar.y + r.dy }
    takas.push(dabar)
    zenklai.push(r.zenklas)
  }
  // Kelias, grįžtantis ten, iš kur pradėjo, uždavinį daro klaidinantį.
  if (dabar.x === pradzia.x && dabar.y === pradzia.y) return null
  return { takas, zenklai }
}

const A_KELIAS = [
  {
    klausimas: 'Katė vykdo komandas → → ↑. Prie kurio daikto ji atsidurs?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — žvaigždė',
    sprendimas: 'Du langeliai į dešinę ir vienas aukštyn veda prie žvaigždės.',
  },
] as const

export const keliasSimboliais: Generatorius = () =>
  suBandymais(() => kurkKeliaSimboliais(), A_KELIAS, 'kelias-simboliais')

/** Daiktai, kuriuos katė gali pasiekti — visi lengvai įvardijami. */
const TIKSLAI = [
  { kas: 'zvaigzde' as Daiktas, vardas: 'žvaigždė' },
  { kas: 'medis' as Daiktas, vardas: 'medis' },
  { kas: 'namas' as Daiktas, vardas: 'namas' },
  { kas: 'gele' as Daiktas, vardas: 'gėlė' },
]

function kurkKeliaSimboliais(): Uzdavinys | null {
  const pradzia = { x: atsitiktinis(0, 1), y: AUKSTIS - 1 }
  const kelias = kurkKelia(pradzia, atsitiktinis(3, 4))
  if (!kelias) return null
  const galas = kelias.takas[kelias.takas.length - 1]

  // Trys daiktai skirtinguose langeliuose: vienas kelio gale, kiti — klaidinantys.
  const laisvi: { x: number; y: number }[] = []
  for (let x = 0; x < PLOTIS; x += 1) {
    for (let y = 0; y < AUKSTIS; y += 1) {
      const uzimtas = (x === pradzia.x && y === pradzia.y) || (x === galas.x && y === galas.y)
      if (!uzimtas) laisvi.push({ x, y })
    }
  }
  const kiti = sumaisyk(laisvi).slice(0, 2)
  if (kiti.length < 2) return null
  const [tikslas, ...netikslai] = sumaisyk(TIKSLAI).slice(0, 3)

  const langeliai = [
    { x: pradzia.x, y: pradzia.y, kas: 'kate' as Daiktas },
    { x: galas.x, y: galas.y, kas: tikslas.kas },
    { x: kiti[0].x, y: kiti[0].y, kas: netikslai[0].kas },
    { x: kiti[1].x, y: kiti[1].y, kas: netikslai[1].kas },
  ]
  const komandos = kelias.zenklai.join(' ')

  return variacija([
    // 1. Prie kurio daikto atsidurs
    () =>
      pasirinkimoUzdavinys(naujasId('kelias-simboliais'), 'kelias-simboliais', {
        klausimas: `Katė vykdo komandas: ${komandos}. Prie kurio daikto ji atsidurs?`,
        variantai: [tikslas.vardas, netikslai[0].vardas, netikslai[1].vardas],
        teisingas: 0,
        sprendimas: `Vykdant komandas ${komandos} katė ateina prie daikto „${tikslas.vardas}“.`,
        brezinys: tinkleliuZemelapis(PLOTIS, AUKSTIS, langeliai),
      }),

    // 2. Kiek žingsnių iš viso
    () =>
      uzdavinys('kelias-simboliais', {
        klausimas: `Katė vykdo komandas: ${komandos}. Per kiek langelių ji pereis?`,
        atsakymas: String(kelias.zenklai.length),
        atsakymasRodymui: `$${kelias.zenklai.length}$`,
        sprendimas: `Kiekviena rodyklė — vienas langelis, o rodyklių yra ${kelias.zenklai.length}.`,
        brezinys: tinkleliuZemelapis(PLOTIS, AUKSTIS, langeliai),
      }),

    // 3. Kiek kartų einama į dešinę
    () => {
      const kiek = kelias.zenklai.filter((z) => z === '→').length
      if (kiek === 0) return null
      return uzdavinys('kelias-simboliais', {
        klausimas: `Komandos: ${komandos}. Kiek kartų katė eina į dešinę?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `Rodyklė → reiškia žingsnį į dešinę; tokių yra ${kiek}.`,
      })
    },

    // 4. Ką reiškia rodyklė
    () => {
      const r = pasirink(RODYKLES)
      const vardai: Record<string, string> = {
        '→': 'į dešinę',
        '←': 'į kairę',
        '↑': 'aukštyn',
        '↓': 'žemyn',
      }
      const kiti = RODYKLES.filter((x) => x.zenklas !== r.zenklas).slice(0, 2)
      return pasirinkimoUzdavinys(naujasId('kelias-simboliais'), 'kelias-simboliais', {
        klausimas: `Ką reiškia komanda ${r.zenklas}?`,
        variantai: [vardai[r.zenklas], ...kiti.map((x) => vardai[x.zenklas])],
        teisingas: 0,
        sprendimas: `Rodyklė ${r.zenklas} nurodo eiti ${vardai[r.zenklas]}.`,
      })
    },
  ])
}

const A_KELIO_APRASYMAS = [
  {
    klausimas: 'Kurios komandos nuveda katę iki žvaigždės?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — → → ↑',
    sprendimas: 'Katė eina du langelius į dešinę ir vieną aukštyn.',
  },
] as const

export const kelioAprasymas: Generatorius = () =>
  suBandymais(() => kurkKelioAprasyma(), A_KELIO_APRASYMAS, 'kelio-aprasymas')

function kurkKelioAprasyma(): Uzdavinys | null {
  const pradzia = { x: 0, y: AUKSTIS - 1 }
  const kelias = kurkKelia(pradzia, atsitiktinis(3, 4))
  if (!kelias) return null
  const galas = kelias.takas[kelias.takas.length - 1]
  const tikslas = pasirink(TIKSLAI)
  const langeliai = [
    { x: pradzia.x, y: pradzia.y, kas: 'kate' as Daiktas },
    { x: galas.x, y: galas.y, kas: tikslas.kas },
  ]
  const komandos = kelias.zenklai.join(' ')
  // Klaidinga eilutė — tos pačios komandos kita tvarka; kelias tada baigiasi
  // kitur, nebent tvarka atsitiktinai sutampa.
  const kitaTvarka = sumaisyk(kelias.zenklai).join(' ')

  return variacija([
    // 1. Kurios komandos nuveda iki daikto
    () => {
      if (kitaTvarka === komandos) return null
      const treciasis = [...kelias.zenklai.slice(0, -1), pasirink(RODYKLES).zenklas].join(' ')
      if (treciasis === komandos || treciasis === kitaTvarka) return null
      return pasirinkimoUzdavinys(naujasId('kelio-aprasymas'), 'kelio-aprasymas', {
        klausimas: `Kurios komandos nuveda katę iki daikto „${tikslas.vardas}“?`,
        variantai: [komandos, kitaTvarka, treciasis],
        teisingas: 0,
        sprendimas: `Nubrėžtas kelias eina taip: ${komandos}.`,
        brezinys: tinkleliuZemelapis(PLOTIS, AUKSTIS, langeliai, kelias.takas),
      })
    },

    // 2. Kiek komandų reikia
    () =>
      uzdavinys('kelio-aprasymas', {
        klausimas: 'Kiek komandų reikia, kad katė nueitų nubrėžtu keliu?',
        atsakymas: String(kelias.zenklai.length),
        atsakymasRodymui: `$${kelias.zenklai.length}$`,
        sprendimas: `Kelias eina per ${kelias.zenklai.length} langelius, tad reikia tiek pat komandų.`,
        brezinys: tinkleliuZemelapis(PLOTIS, AUKSTIS, langeliai, kelias.takas),
      }),

    // 3. Kokia pirmoji komanda
    () => {
      const pirma = kelias.zenklai[0]
      const kiti = RODYKLES.filter((r) => r.zenklas !== pirma).slice(0, 2)
      return pasirinkimoUzdavinys(naujasId('kelio-aprasymas'), 'kelio-aprasymas', {
        klausimas: 'Kokia yra pirmoji nubrėžto kelio komanda?',
        variantai: [pirma, ...kiti.map((r) => r.zenklas)],
        teisingas: 0,
        sprendimas: `Kelias prasideda žingsniu ${pirma}.`,
        brezinys: tinkleliuZemelapis(PLOTIS, AUKSTIS, langeliai, kelias.takas),
      })
    },

    // 4. Komandos pagal žodinį nurodymą
    () => {
      const desinen = atsitiktinis(1, 3)
      const auksten = atsitiktinis(1, 2)
      const teisinga = [...Array(desinen).fill('→'), ...Array(auksten).fill('↑')].join(' ')
      const netiesa1 = [...Array(auksten).fill('→'), ...Array(desinen).fill('↑')].join(' ')
      const netiesa2 = [...Array(desinen).fill('←'), ...Array(auksten).fill('↑')].join(' ')
      if (teisinga === netiesa1) return null
      return pasirinkimoUzdavinys(naujasId('kelio-aprasymas'), 'kelio-aprasymas', {
        klausimas: `Robotukas turi eiti ${desinen} ${derink(desinen, { vns: 'langelį', dgs: 'langelius', kilm: 'langelių' })} į dešinę ir ${auksten} aukštyn. Kurios komandos tinka?`,
        variantai: [teisinga, netiesa1, netiesa2],
        teisingas: 0,
        sprendimas: `Į dešinę — ${desinen} kartus rodyklė →, aukštyn — ${auksten} kartus ↑.`,
      })
    },
  ])
}

// ═══ 9 tema. Matai ══════════════════════════════════════════════════════════

// ── 9.1 Ką rodo laikrodis? ──────────────────────────────────────────────────

const A_LAIKRODIS = [
  {
    klausimas: 'Kiek valandų rodo laikrodis?',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Valandinė rodyklė rodo į 3, o minutinė — į 12.',
  },
] as const

export const pilnosValandos: Generatorius = () =>
  suBandymais(kurkValandas, A_LAIKRODIS, 'pilnos-valandos')

/**
 * Tik pilnos valandos.
 *
 * Pirmoje klasėje mokoma atpažinti valandą, kai minutinė rodyklė rodo į 12.
 * Pusvalandžiai ir minutės — vėlesnių klasių dalykas, tad čia jų nėra.
 */
function kurkValandas(): Uzdavinys | null {
  const val = atsitiktinis(1, 12)

  return variacija([
    // 1. Kelintą valandą rodo
    () =>
      uzdavinys('pilnos-valandos', {
        // „Kelintą valandą…“, o ne „Kiek valandų…“: antrasis klausimas skamba
        // kaip trukmė, o čia klausiama, kuri valanda dabar.
        klausimas: 'Kelintą valandą rodo laikrodis?',
        atsakymas: String(val),
        atsakymasRodymui: `$${val}$`,
        sprendimas: `Trumpoji rodyklė rodo į ${val}, o ilgoji — į 12. Vadinasi, ${val} valanda.`,
        brezinys: laikrodis(val * 60),
      }),

    // 2. Pasirinkimas
    () => {
      const netiesos = [val === 12 ? 1 : val + 1, val === 1 ? 12 : val - 1]
      if (netiesos[0] === netiesos[1]) return null
      return pasirinkimoUzdavinys(naujasId('pilnos-valandos'), 'pilnos-valandos', {
        klausimas: 'Pasirink teisingą laiką.',
        variantai: [`${val} val.`, ...netiesos.map((n) => `${n} val.`)],
        teisingas: 0,
        sprendimas: `Valandinė rodyklė rodo į ${val}.`,
        brezinys: laikrodis(val * 60),
      })
    },

    // 3. Kur rodo minutinė rodyklė, kai valanda pilna
    () =>
      pasirinkimoUzdavinys(naujasId('pilnos-valandos'), 'pilnos-valandos', {
        klausimas: 'Į kurį skaičių rodo minutinė rodyklė, kai valanda pilna?',
        variantai: ['į 12', 'į 6', 'į 3'],
        teisingas: 0,
        sprendimas: 'Pilnos valandos metu minutinė rodyklė visada rodo į 12.',
        brezinys: laikrodis(val * 60),
      }),

    // 4. Kuri rodyklė trumpesnė
    () =>
      pasirinkimoUzdavinys(naujasId('pilnos-valandos'), 'pilnos-valandos', {
        klausimas: 'Kuri laikrodžio rodyklė rodo valandas?',
        variantai: ['trumpoji', 'ilgoji', 'abi'],
        teisingas: 0,
        sprendimas: 'Valandas rodo trumpoji rodyklė, o minutes — ilgoji.',
        brezinys: laikrodis(val * 60),
      }),

    // 5. Kelintą valandą rodys po kelių valandų
    () => {
      const kiek = atsitiktinis(1, 3)
      const po = ((val + kiek - 1) % 12) + 1
      return uzdavinys('pilnos-valandos', {
        klausimas: `Kelintą valandą laikrodis rodys po ${kiek} ${derink(kiek, { vns: 'valandos', dgs: 'valandų', kilm: 'valandų' })}?`,
        atsakymas: String(po),
        atsakymasRodymui: `$${po}$`,
        sprendimas: `Dabar ${val} valanda, o po ${kiek} bus ${po}.`,
        brezinys: laikrodis(val * 60),
      })
    },
  ])
}

// ── 9.2 Kiek valandų trunka para? ───────────────────────────────────────────

const A_PARA = [
  {
    klausimas: 'Kiek valandų yra vienoje paroje?',
    atsakymas: '24',
    atsakymasRodymui: '$24$',
    sprendimas: 'Para trunka 24 valandas.',
  },
] as const

export const para: Generatorius = () => suBandymais(kurkPara, A_PARA, 'para')

function kurkPara(): Uzdavinys | null {
  return variacija([
    // 1. Kiek valandų paroje
    () =>
      uzdavinys('para', {
        klausimas: 'Kiek valandų yra vienoje paroje?',
        atsakymas: '24',
        atsakymasRodymui: '$24$',
        sprendimas: 'Para — tai diena ir naktis kartu, o jos trukmė 24 valandos.',
      }),

    // 2. Pasirinkimas
    () =>
      pasirinkimoUzdavinys(naujasId('para'), 'para', {
        klausimas: 'Kiek valandų trunka para?',
        variantai: ['24', '12', '60'],
        teisingas: 0,
        sprendimas: 'Paroje yra 24 valandos. 12 rodo laikrodžio ciferblatas, o 60 — minutės.',
      }),

    // 3. Užbaik sakinį
    () =>
      uzdavinys('para', {
        klausimas: 'Užbaik sakinį: „Viena para trunka $\\square$ valandas.“',
        atsakymas: '24',
        atsakymasRodymui: '$24$',
        sprendimas: 'Para trunka 24 valandas.',
      }),

    // 4. Kas sudaro parą
    () =>
      pasirinkimoUzdavinys(naujasId('para'), 'para', {
        klausimas: 'Kas kartu sudaro parą?',
        variantai: ['diena ir naktis', 'rytas ir vakaras', 'savaitė'],
        teisingas: 0,
        sprendimas: 'Para yra diena ir naktis kartu — 24 valandos.',
      }),

    // 5. Kiek valandų liko iki paros pabaigos
    () => {
      const praejo = atsitiktinis(2, 20)
      return uzdavinys('para', {
        klausimas: `Nuo paros pradžios praėjo ${praejo} ${derink(praejo, { vns: 'valanda', dgs: 'valandos', kilm: 'valandų' })}. Kiek valandų liko iki paros pabaigos?`,
        atsakymas: String(24 - praejo),
        atsakymasRodymui: `$${24 - praejo}$`,
        sprendimas: `$24 - ${praejo} = ${24 - praejo}$ valandos.`,
      })
    },
  ])
}

// ── 9.3 Kiek laiko užtruko...? ──────────────────────────────────────────────

const A_TRUKME = [
  {
    klausimas: 'Filmukas prasidėjo 15 val. ir baigėsi 16 val. Kiek valandų jis truko?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: '$16 - 15 = 1$ valanda.',
  },
] as const

export const laikoTrukme: Generatorius = () => suBandymais(kurkTrukme, A_TRUKME, 'laiko-trukme')

const IVYKIAI = [
  { kas: 'Filmukas', veiksmas: 'truko' },
  { kas: 'Treniruotė', veiksmas: 'truko' },
  { kas: 'Kelionė', veiksmas: 'truko' },
  { kas: 'Žaidimas', veiksmas: 'truko' },
  { kas: 'Pamoka', veiksmas: 'truko' },
] as const

function kurkTrukme(): Uzdavinys | null {
  const nuo = atsitiktinis(8, 18)
  const trukme = atsitiktinis(1, 4)
  const iki = nuo + trukme
  if (iki > 22) return null
  const ivykis = pasirink(IVYKIAI)

  return variacija([
    // 1. Kiek truko
    () =>
      uzdavinys('laiko-trukme', {
        klausimas: `${ivykis.kas} prasidėjo ${nuo} val. ir baigėsi ${iki} val. Kiek valandų ${ivykis.veiksmas}?`,
        atsakymas: String(trukme),
        atsakymasRodymui: `$${trukme}$`,
        sprendimas: `$${iki} - ${nuo} = ${trukme}$.`,
      }),

    // 2. Kada baigsis
    () =>
      uzdavinys('laiko-trukme', {
        klausimas: `${ivykis.kas} prasidėjo ${nuo} val. ir truko ${trukme} ${derink(trukme, { vns: 'valandą', dgs: 'valandas', kilm: 'valandų' })}. Kelintą valandą jis baigėsi?`,
        atsakymas: String(iki),
        atsakymasRodymui: `$${iki}$`,
        sprendimas: `$${nuo} + ${trukme} = ${iki}$.`,
      }),

    // 3. Kada prasidėjo
    () =>
      uzdavinys('laiko-trukme', {
        klausimas: `${ivykis.kas} baigėsi ${iki} val. ir truko ${trukme} ${derink(trukme, { vns: 'valandą', dgs: 'valandas', kilm: 'valandų' })}. Kelintą valandą jis prasidėjo?`,
        atsakymas: String(nuo),
        atsakymasRodymui: `$${nuo}$`,
        sprendimas: `$${iki} - ${trukme} = ${nuo}$.`,
      }),

    // 4. Pasirinkimas
    () => {
      const netiesos = [trukme + 1, iki].filter((x) => x !== trukme)
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('laiko-trukme'), 'laiko-trukme', {
        klausimas: `${ivykis.kas} prasidėjo ${nuo} val., baigėsi ${iki} val. Kiek laiko praėjo?`,
        variantai: [`${trukme} val.`, ...netiesos.map((n) => `${n} val.`)],
        teisingas: 0,
        sprendimas: `$${iki} - ${nuo} = ${trukme}$ val.`,
      })
    },

    // 5. Kuris užtruko ilgiau
    () => {
      const kitas = atsitiktinis(1, 5)
      if (kitas === trukme) return null
      return pasirinkimoUzdavinys(naujasId('laiko-trukme'), 'laiko-trukme', {
        klausimas: `Vienas darbas truko ${trukme} val., kitas — ${kitas} val. Kuris užtruko ilgiau?`,
        variantai: [
          `${Math.max(trukme, kitas)} val.`,
          `${Math.min(trukme, kitas)} val.`,
          'abu vienodai',
        ],
        teisingas: 0,
        sprendimas: `${Math.max(trukme, kitas)} valandos yra daugiau nei ${Math.min(trukme, kitas)}.`,
      })
    },
  ])
}

// ── 9.4 Kam užteks pinigų? ──────────────────────────────────────────────────

const A_PINIGAI = [
  {
    klausimas: 'Keksiukas kainuoja 50 ct. Ar užteks 50 ct monetos?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — taip, užteks',
    sprendimas: 'Moneta yra lygiai tokios pat vertės kaip kaina.',
  },
] as const

export const arUztenkaPinigu: Generatorius = () =>
  suBandymais(kurkPinigus, A_PINIGAI, 'ar-uztenka-pinigu')

const PREKES = ['keksiukas', 'sausainis', 'obuolys', 'saldainis', 'balionas'] as const

/** Monetų rinkinys, kurio suma nurodyta centais. */
function monetuRinkinys(centai: number): Moneta[] | null {
  const nominalai: Moneta[] = [50, 20, 10, 5, 2, 1]
  const rez: Moneta[] = []
  let liko = centai
  for (const n of nominalai) {
    while (liko >= n && rez.length < 5) {
      rez.push(n)
      liko -= n
    }
  }
  return liko === 0 ? rez : null
}

function kurkPinigus(): Uzdavinys | null {
  const kaina = atsitiktinis(2, 9) * 10
  const turi = atsitiktinis(2, 9) * 10
  const rinkinys = monetuRinkinys(turi)
  if (!rinkinys) return null
  const preke = pasirink(PREKES)

  return variacija([
    // 1. Ar užteks
    () =>
      pasirinkimoUzdavinys(naujasId('ar-uztenka-pinigu'), 'ar-uztenka-pinigu', {
        klausimas: `${preke[0].toUpperCase()}${preke.slice(1)} kainuoja ${kaina} ct. Ar užteks pinigų?`,
        variantai:
          turi >= kaina
            ? ['taip, užteks', 'ne, trūksta', 'negalima pasakyti']
            : ['ne, trūksta', 'taip, užteks', 'negalima pasakyti'],
        teisingas: 0,
        sprendimas:
          turi >= kaina
            ? `Turima ${turi} ct, o kaina ${kaina} ct — pinigų užtenka.`
            : `Turima tik ${turi} ct, o kaina ${kaina} ct — pinigų trūksta.`,
        brezinys: monetos(rinkinys),
      }),

    // 2. Kiek trūksta
    () => {
      if (turi >= kaina) return null
      return uzdavinys('ar-uztenka-pinigu', {
        klausimas: `${preke[0].toUpperCase()}${preke.slice(1)} kainuoja ${kaina} ct, o turima ${turi} ct. Kiek centų trūksta?`,
        atsakymas: String(kaina - turi),
        atsakymasRodymui: `$${kaina - turi}$ ct`,
        sprendimas: `$${kaina} - ${turi} = ${kaina - turi}$ ct.`,
        brezinys: monetos(rinkinys),
      })
    },

    // 3. Kiek grąžos
    () => {
      if (turi <= kaina) return null
      return uzdavinys('ar-uztenka-pinigu', {
        klausimas: `${preke[0].toUpperCase()}${preke.slice(1)} kainuoja ${kaina} ct, o sumokėta ${turi} ct. Kiek centų grąžos?`,
        atsakymas: String(turi - kaina),
        atsakymasRodymui: `$${turi - kaina}$ ct`,
        sprendimas: `$${turi} - ${kaina} = ${turi - kaina}$ ct.`,
        brezinys: monetos(rinkinys),
      })
    },

    // 4. Kuris brangesnis
    () => {
      const kita = atsitiktinis(2, 9) * 10
      if (kita === kaina) return null
      return uzdavinys('ar-uztenka-pinigu', {
        klausimas: `Vienas keksiukas kainuoja ${kaina} ct, kitas — ${kita} ct. Keliais centais brangesnis brangesnysis?`,
        atsakymas: String(Math.abs(kaina - kita)),
        atsakymasRodymui: `$${Math.abs(kaina - kita)}$ ct`,
        sprendimas: `$${Math.max(kaina, kita)} - ${Math.min(kaina, kita)} = ${Math.abs(kaina - kita)}$ ct.`,
      })
    },

    // 5. Kiek pinigų parodyta
    () =>
      uzdavinys('ar-uztenka-pinigu', {
        klausimas: 'Kiek centų parodyta paveikslėlyje?',
        atsakymas: String(turi),
        atsakymasRodymui: `$${turi}$ ct`,
        sprendimas: `Sudėjus monetas gaunama ${turi} ct.`,
        brezinys: monetos(rinkinys),
      }),
  ])
}

// ── 9.5 Kas yra metras? ─────────────────────────────────────────────────────

const A_METRAS = [
  {
    klausimas: 'Kuo patogiau matuoti kambario ilgį?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — metrais',
    sprendimas: 'Ilgus atstumus matuojame metrais, o mažus daiktus — centimetrais.',
  },
] as const

export const metras: Generatorius = () => suBandymais(kurkMetra, A_METRAS, 'metras')

const METRINIAI = ['kambario ilgį', 'durų plotį', 'kiemo ilgį', 'klasės ilgį', 'tvoros ilgį'] as const
const CENTIMETRINIAI = ['pieštuko ilgį', 'trintuko ilgį', 'knygos plotį', 'segtuko ilgį'] as const

function kurkMetra(): Uzdavinys | null {
  return variacija([
    // 1. Ką matuoti metrais
    () =>
      pasirinkimoUzdavinys(naujasId('metras'), 'metras', {
        klausimas: `Kuo patogiau matuoti ${pasirink(METRINIAI)}?`,
        variantai: ['metrais', 'centimetrais', 'kilogramais'],
        teisingas: 0,
        sprendimas: 'Ilgus atstumus matuojame metrais — kitaip centimetrų būtų labai daug.',
      }),

    // 2. Ką matuoti centimetrais
    () =>
      pasirinkimoUzdavinys(naujasId('metras'), 'metras', {
        klausimas: `Kuo patogiau matuoti ${pasirink(CENTIMETRINIAI)}?`,
        variantai: ['centimetrais', 'metrais', 'valandomis'],
        teisingas: 0,
        sprendimas: 'Mažus daiktus matuojame centimetrais.',
      }),

    // 3. Kuris daiktas apie metrą
    () =>
      pasirinkimoUzdavinys(naujasId('metras'), 'metras', {
        klausimas: 'Kuris daiktas yra maždaug 1 m ilgio?',
        variantai: ['stalo ilgis', 'pieštukas', 'moneta'],
        teisingas: 0,
        sprendimas: 'Pieštukas ir moneta yra kelių centimetrų, o stalas — apie metro ilgio.',
      }),

    // 4. Ką reiškia santrumpa
    () =>
      pasirinkimoUzdavinys(naujasId('metras'), 'metras', {
        klausimas: 'Ką reiškia santrumpa m?',
        variantai: ['metras', 'minutė', 'masė'],
        teisingas: 0,
        sprendimas: 'm yra metro santrumpa — ilgio matavimo vienetas.',
      }),

    // 5. Kas ilgiau
    () => {
      const a = atsitiktinis(2, 9)
      const b = atsitiktinis(2, 9)
      if (a === b) return null
      return uzdavinys('metras', {
        klausimas: `Viena tvora ${a} m, kita — ${b} m. Kiek metrų ilgesnė ilgesnioji?`,
        atsakymas: String(Math.abs(a - b)),
        atsakymasRodymui: `$${Math.abs(a - b)}$ m`,
        sprendimas: `$${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(a - b)}$ m.`,
      })
    },
  ])
}

// ── 9.6 Uždaviniai su metrais ───────────────────────────────────────────────

const A_METRO_UZD = [
  {
    klausimas: 'Virvė 8 m ilgio. Nukirpo 3 m. Kiek metrų liko?',
    atsakymas: '5',
    atsakymasRodymui: '$5$ m',
    sprendimas: '$8 - 3 = 5$ m.',
  },
] as const

export const metroUzdaviniai: Generatorius = () =>
  suBandymais(kurkMetroUzdavini, A_METRO_UZD, 'metro-uzdaviniai')

function kurkMetroUzdavini(): Uzdavinys | null {
  const a = atsitiktinis(6, 20)
  const b = atsitiktinis(2, a - 1)

  return variacija([
    // 1. Nukirpta virvė
    () =>
      uzdavinys('metro-uzdaviniai', {
        klausimas: `Virvė ${a} m ilgio. Nukirpo ${b} m. Kiek metrų liko?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ m`,
        sprendimas: `$${a} - ${b} = ${a - b}$ m.`,
      }),

    // 2. Bendras ilgis
    () =>
      uzdavinys('metro-uzdaviniai', {
        klausimas: `Vienas takas ${a} m, kitas — ${b} m. Koks jų bendras ilgis?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ m`,
        sprendimas: `$${a} + ${b} = ${a + b}$ m.`,
      }),

    // 3. Prailginta tvora
    () =>
      uzdavinys('metro-uzdaviniai', {
        klausimas: `Tvora buvo ${a} m. Pastatė dar ${b} m. Koks jos ilgis dabar?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ m`,
        sprendimas: `$${a} + ${b} = ${a + b}$ m.`,
      }),

    // 4. Panaudota juosta
    () =>
      uzdavinys('metro-uzdaviniai', {
        klausimas: `Juosta ${a} m ilgio. Panaudojo ${b} m. Kiek metrų liko?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ m`,
        sprendimas: `$${a} - ${b} = ${a - b}$ m.`,
      }),

    // 5. Keliais metrais ilgesnis
    () =>
      uzdavinys('metro-uzdaviniai', {
        klausimas: `Vienas takas ${a} ${derink(a, M_FORMOS)}, kitas — ${b}. Keliais metrais pirmasis ilgesnis?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ m`,
        sprendimas: `$${a} - ${b} = ${a - b}$ m.`,
      }),

    // 6. Grynas veiksmas su metrais — kaip vadovėlyje „17 m + 6 m = □ m“
    () =>
      uzdavinys('metro-uzdaviniai', {
        klausimas: `Apskaičiuok: $${a}$ m $+$ $${b}$ m $=$ $\\square$ m`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ m`,
        sprendimas: `$${a} + ${b} = ${a + b}$ m.`,
      }),

    // 7. Trūkstamas skaičius su metrais
    () =>
      uzdavinys('metro-uzdaviniai', {
        klausimas: `Įrašyk trūkstamą skaičių: $\\square$ m $+$ $${b}$ m $=$ $${a + b}$ m`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ m`,
        sprendimas: `Iš sumos atimame žinomą dėmenį: $${a + b} - ${b} = ${a}$ m.`,
      }),

    // 8. Kelios vienodos atkarpos — baseinas perplaukiamas kelis kartus
    () => {
      const ilgis = pasirink([5, 10])
      const kartai = atsitiktinis(2, 4)
      if (ilgis * kartai > 100) return null
      return uzdavinys('metro-uzdaviniai', {
        klausimas: `Baseinas yra ${ilgis} m ilgio. Plaukikas jį perplaukė ${kartai} ${derink(kartai, { vns: 'kartą', dgs: 'kartus', kilm: 'kartų' })}. Kiek metrų jis nuplaukė?`,
        atsakymas: String(ilgis * kartai),
        atsakymasRodymui: `$${ilgis * kartai}$ m`,
        sprendimas: `Po ${ilgis} m ${kartai} kartus: ${Array(kartai).fill(ilgis).join(' + ')} = ${ilgis * kartai} m.`,
      })
    },

    // 9. Vėliavėlės kas metrą — atstumų yra vienu mažiau nei vėliavėlių
    () => {
      const kiek = atsitiktinis(4, 10)
      return uzdavinys('metro-uzdaviniai', {
        klausimas: `${pasirink(VARDAI)} viena linija susmeigė ${kiek} ${derink(kiek, { vns: 'vėliavėlę', dgs: 'vėliavėles', kilm: 'vėliavėlių' })} kas 1 metrą. Koks atstumas nuo pirmos iki paskutinės vėliavėlės?`,
        atsakymas: String(kiek - 1),
        atsakymasRodymui: `$${kiek - 1}$ m`,
        sprendimas: `Tarp ${kiek} vėliavėlių yra ${kiek - 1} tarpai po 1 m, tad atstumas ${kiek - 1} m.`,
      })
    },

    // 10. Kelio atkarpų suma — kaip brėžinys vadovėlyje
    () => {
      const dalys = [atsitiktinis(5, 20), atsitiktinis(5, 20), atsitiktinis(5, 20)]
      const visas = dalys.reduce((s, x) => s + x, 0)
      if (visas > 100) return null
      return uzdavinys('metro-uzdaviniai', {
        klausimas: `Dviratininkas nuvažiavo tris atkarpas: ${dalys.join(' m, ')} m. Kokį atstumą jis nuvažiavo iš viso?`,
        atsakymas: String(visas),
        atsakymasRodymui: `$${visas}$ m`,
        sprendimas: `${dalys.join(' + ')} = ${visas} m.`,
      })
    },
  ])
}

// ── 9.7 Kas yra kilogramas? ─────────────────────────────────────────────────

const A_KG = [
  {
    klausimas: 'Kuo matuojame arbūzo masę?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — kilogramais',
    sprendimas: 'Masė matuojama kilogramais, o ilgis — centimetrais.',
  },
] as const

export const kilogramas: Generatorius = () => suBandymais(kurkKilograma, A_KG, 'kilogramas')

function kurkKilograma(): Uzdavinys | null {
  return variacija([
    // 1. Kuo matuojame masę
    () =>
      pasirinkimoUzdavinys(naujasId('kilogramas'), 'kilogramas', {
        klausimas: `Kuo matuojame ${pasirink(['arbūzo', 'kuprinės', 'obuolių', 'miltų'])} masę?`,
        variantai: ['kilogramais', 'centimetrais', 'valandomis'],
        teisingas: 0,
        sprendimas: 'Masė matuojama kilogramais.',
      }),

    // 2. Ką rodo svarstyklės
    () => {
      const kg = atsitiktinis(1, 9)
      return uzdavinys('kilogramas', {
        klausimas: `Svarstyklės rodo ${kg} kg. Kokia daikto masė?`,
        atsakymas: String(kg),
        atsakymasRodymui: `$${kg}$ kg`,
        sprendimas: `Svarstyklės rodo ${kg} ${derink(kg, { vns: 'kilogramą', dgs: 'kilogramus', kilm: 'kilogramų' })}.`,
      })
    },

    // 3. Kuris daiktas sunkesnis maždaug 2 kg
    () =>
      pasirinkimoUzdavinys(naujasId('kilogramas'), 'kilogramas', {
        klausimas: 'Kuris daiktas galėtų sverti apie 2 kg?',
        variantai: ['arbūzas', 'obuolys', 'pieštukas'],
        teisingas: 0,
        sprendimas: 'Obuolys ir pieštukas daug lengvesni — jie nesveria nė kilogramo.',
      }),

    // 4. Ką matuojame kilogramais
    () =>
      pasirinkimoUzdavinys(naujasId('kilogramas'), 'kilogramas', {
        klausimas: 'Užbaik sakinį: „Kilogramais matuojame daikto …“',
        variantai: ['masę', 'ilgį', 'laiką'],
        teisingas: 0,
        sprendimas: 'Kilogramas yra masės matavimo vienetas.',
      }),

    // 5. Kiek kilogramų iš viso
    () => {
      const a = atsitiktinis(1, 9)
      const b = atsitiktinis(1, 9)
      return uzdavinys('kilogramas', {
        klausimas: `Vienas maišas sveria ${a} kg, kitas — ${b} kg. Kiek kilogramų sveria abu kartu?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ kg`,
        sprendimas: `$${a} + ${b} = ${a + b}$ kg.`,
      })
    },
  ])
}

// ── 9.8 Sunkesnis ar lengvesnis? ────────────────────────────────────────────

const A_SUNKESNIS = [
  {
    klausimas: 'Kuris daiktas sunkesnis?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — arbūzas',
    sprendimas: 'Sunkesnis daiktas nusveria žemyn.',
  },
] as const

export const sunkesnisLengvesnis: Generatorius = () =>
  suBandymais(kurkSvorius, A_SUNKESNIS, 'sunkesnis-lengvesnis')

const SVERIAMI = [
  { kas: 'obuolys' as Daiktas, vardas: 'obuolys' },
  { kas: 'kamuolys' as Daiktas, vardas: 'kamuolys' },
  { kas: 'knyga' as Daiktas, vardas: 'knyga' },
  { kas: 'kriause' as Daiktas, vardas: 'kriaušė' },
]

function kurkSvorius(): Uzdavinys | null {
  const [k, d] = sumaisyk(SVERIAMI).slice(0, 2)
  const kairePasviro = atsitiktinis(0, 1) === 1
  const sunkesnis = kairePasviro ? k : d
  const lengvesnis = kairePasviro ? d : k
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(1, a - 1)

  return variacija([
    // 1. Kuris sunkesnis pagal svarstykles
    () =>
      pasirinkimoUzdavinys(naujasId('sunkesnis-lengvesnis'), 'sunkesnis-lengvesnis', {
        klausimas: 'Kuris daiktas sunkesnis?',
        variantai: [sunkesnis.vardas, lengvesnis.vardas, 'abu vienodi'],
        teisingas: 0,
        sprendimas: 'Sunkesnis daiktas nusveria lėkštelę žemyn.',
        brezinys: svarstykles(k.kas, d.kas, kairePasviro ? 'kaire' : 'desine'),
      }),

    // 2. Kuris lengvesnis pagal svarstykles
    () =>
      pasirinkimoUzdavinys(naujasId('sunkesnis-lengvesnis'), 'sunkesnis-lengvesnis', {
        klausimas: 'Kuris daiktas lengvesnis?',
        variantai: [lengvesnis.vardas, sunkesnis.vardas, 'abu vienodi'],
        teisingas: 0,
        sprendimas: 'Lengvesnio daikto lėkštelė pakyla aukštyn.',
        brezinys: svarstykles(k.kas, d.kas, kairePasviro ? 'kaire' : 'desine'),
      }),

    // 3. Lygios svarstyklės
    () =>
      pasirinkimoUzdavinys(naujasId('sunkesnis-lengvesnis'), 'sunkesnis-lengvesnis', {
        klausimas: 'Ką rodo šios svarstyklės?',
        variantai: ['daiktai vienodo sunkumo', `${k.vardas} sunkesnis`, `${d.vardas} sunkesnis`],
        teisingas: 0,
        sprendimas: 'Kai lėkštelės vienodame aukštyje, daiktai sveria po lygiai.',
        brezinys: svarstykles(k.kas, d.kas, 'lygu'),
      }),

    // 4. Palyginimas kilogramais
    () =>
      pasirinkimoUzdavinys(naujasId('sunkesnis-lengvesnis'), 'sunkesnis-lengvesnis', {
        klausimas: `Kuprinė sveria ${a} kg, kamuolys — ${b} kg. Kuris lengvesnis?`,
        variantai: ['kamuolys', 'kuprinė', 'abu vienodi'],
        teisingas: 0,
        sprendimas: `${b} kg yra mažiau nei ${a} kg, tad kamuolys lengvesnis.`,
      }),

    // 5. Keliais kilogramais sunkesnis
    () =>
      uzdavinys('sunkesnis-lengvesnis', {
        klausimas: `Vienas maišas ${a} kg, kitas — ${b} kg. Keliais kilogramais pirmasis sunkesnis?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ kg`,
        sprendimas: `$${a} - ${b} = ${a - b}$ kg.`,
      }),
  ])
}
