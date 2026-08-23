import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { posukioBrezinys } from './ketvirtokams-erdves-vaizdai'
import { postumisTinklelyje, simetrijaTinklelyje } from './treciokams-geometrija-vaizdai'
import {
  centrineSimetrija,
  keturkampis,
  keturkampiuEile,
  simetrijosAsys,
  type KeturkampioRusis,
} from './penktokams-simetrijos-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 5 klasės tema „Simetrija. Posūkis. Postūmis“ — septynios potemės.
 *
 * Simetrijos uždaviniuose brėžinys rodo tik pradinę figūrą — jei atspindys
 * ar posūkio rezultatas jau nupieštas, atsakyti nebereikia nieko. Todėl
 * `rodytiRezultata` įjungiamas tik ten, kur klausiama apie patį veiksmą
 * („į kurią pusę pasukta“), o ne apie jo rezultatą.
 */

const FIGURA = [
  { x: 1, y: 1 },
  { x: 4, y: 1 },
  { x: 4, y: 3 },
  { x: 2, y: 3 },
  { x: 2, y: 5 },
  { x: 1, y: 5 },
] as const

/** Kiek simetrijos ašių turi figūra. */
const ASIU: Record<KeturkampioRusis, number> = {
  kvadratas: 4,
  staciakampis: 2,
  rombas: 2,
  lygiagretainis: 0,
  trapecija: 0,
}

// ── 10.1.1. Tiesės atžvilgiu simetriškos figūros ────────────────────────────

const T1 = 'simetriskos-tieses-atzvilgiu'

const A_TIESE = [
  {
    klausimas: 'Kas yra dvi figūros, simetriškos tiesės atžvilgiu?',
    atsakymas: 'vienodos',
    atsakymasRodymui: 'Vienodo dydžio ir formos figūros',
    sprendimas: 'Atspindys figūros dydžio nekeičia.',
  },
] as const

export const simetriskosTiesesAtzvilgiu: Generatorius = () => suBandymais(kurkTiese, A_TIESE, T1)

function kurkTiese(): Uzdavinys | null {
  const asis = atsitiktinis(6, 8)

  return variacija([
    // 1. Kas išlieka
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kas nesikeičia atspindint figūrą tiesės atžvilgiu?',
        variantai: [
          'jos dydis ir forma',
          'jos padėtis',
          'jos kraštinių ilgiai sumažėja perpus',
          'jos kampų skaičius',
        ],
        teisingas: 0,
        sprendimas: 'Simetriška figūra yra tokia pat, tik atvirkščiai pasukta ašies atžvilgiu.',
        brezinys: simetrijaTinklelyje(12, 7, FIGURA, asis, true),
      }),

    // 2. Atstumas iki ašies
    () => {
      const atstumas = atsitiktinis(2, 5)
      return uzdavinys(T1, {
        klausimas: `Taškas nuo simetrijos ašies nutolęs ${atstumas} langelius. Per kiek langelių nuo ašies bus jam simetriškas taškas?`,
        atsakymas: String(atstumas),
        atsakymasRodymui: `$${atstumas}$`,
        sprendimas: 'Simetriški taškai nuo ašies nutolę vienodai, tik yra priešingose jos pusėse.',
      })
    },

    // 3. Kur atsidurs viršūnė
    () => {
      const x = atsitiktinis(1, asis - 1)
      return uzdavinys(T1, {
        klausimas: `Simetrijos ašis eina per ${asis}-ąjį stulpelį. Kuriame stulpelyje atsidurs taškas, esantis ${x}-ajame stulpelyje?`,
        atsakymas: String(2 * asis - x),
        atsakymasRodymui: `$${2 * asis - x}$`,
        sprendimas: `Taškas nuo ašies nutolęs $${asis} - ${x} = ${asis - x}$, tad kitoje pusėje bus $${asis} + ${asis - x} = ${2 * asis - x}$.`,
        brezinys: simetrijaTinklelyje(14, 7, FIGURA, asis),
      })
    },

    // 4. Kaip tikrinama simetrija
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kaip patikrinti, ar dvi figūros simetriškos tiesės atžvilgiu?',
        variantai: [
          'perlenkti lapą per tą tiesę — figūros turi sutapti',
          'išmatuoti jų plotus',
          'suskaičiuoti kampus',
          'pastumti vieną figūrą prie kitos',
        ],
        teisingas: 0,
        sprendimas: 'Todėl simetrijos ašis dar vadinama lenkimo linija.',
      }),

    // 5. Simetriškos raidės
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuri raidė turi vertikaliąją simetrijos ašį?',
        variantai: ['A', 'R', 'G', 'P'],
        teisingas: 0,
        sprendimas: 'Perlenkus A per vidurio vertikalę, abi pusės sutampa.',
      }),

    // 6. Ašis ne per vidurį
    () =>
      uzdavinys(T1, {
        klausimas: 'Ar simetriška figūra gali būti didesnė už pradinę?',
        atsakymas: 'ne',
        atsakymasRodymui: 'Ne',
        sprendimas: 'Atspindys keičia tik padėtį, ne dydį.',
      }),

    // 7. Kiek langelių tarp figūrų
    () => {
      const atstumas = atsitiktinis(1, 4)
      return uzdavinys(T1, {
        klausimas: `Figūros viršūnė nuo simetrijos ašies nutolusi ${atstumas} langelius. Per kiek langelių ji bus nutolusi nuo jai simetriškos viršūnės?`,
        atsakymas: String(2 * atstumas),
        atsakymasRodymui: `$${2 * atstumas}$`,
        sprendimas: `Abi viršūnės nuo ašies nutolusios po ${atstumas}: $${atstumas} \\cdot 2 = ${2 * atstumas}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: 'Mokinys atspindėjo figūrą ir gavo tokią pat figūrą toje pačioje ašies pusėje. Kokį veiksmą jis atliko iš tikrųjų?',
        atsakymas: 'postumi',
        atsakymasRodymui: 'Postūmį',
        sprendimas: 'Atspindint figūra atsiduria kitoje ašies pusėje, o postūmis padėties ašies atžvilgiu nekeičia.',
      }),
  ])
}

// ── 10.1.2. Figūros, turinčios simetrijos ašį ───────────────────────────────

const T2 = 'simetrijos-asis-5'

const A_ASIS = [
  {
    klausimas: 'Kiek simetrijos ašių turi kvadratas?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Dvi per kraštinių vidurius ir dvi įstrižainės.',
  },
] as const

export const simetrijosAsis5: Generatorius = () => suBandymais(kurkAsi, A_ASIS, T2)

function kurkAsi(): Uzdavinys | null {
  const rusis = pasirink<KeturkampioRusis>(['kvadratas', 'staciakampis', 'rombas', 'lygiagretainis'])

  return variacija([
    // 1. Kvadrato ašys
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek simetrijos ašių turi kvadratas?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Dvi eina per priešingų kraštinių vidurius, dar dvi — per įstrižaines.',
        brezinys: simetrijosAsys('kvadratas'),
      }),

    // 2. Stačiakampio ašys
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek simetrijos ašių turi stačiakampis, kuris nėra kvadratas?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Tik dvi — per priešingų kraštinių vidurius. Įstrižainės simetrijos ašys nėra.',
        brezinys: simetrijosAsys('staciakampis'),
      }),

    // 3. Iš brėžinio
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek simetrijos ašių turi pavaizduota figūra?',
        atsakymas: String(ASIU[rusis]),
        atsakymasRodymui: `$${ASIU[rusis]}$`,
        sprendimas:
          ASIU[rusis] === 0
            ? 'Perlenkus šią figūrą bet kuria linija, pusės nesutampa.'
            : 'Perlenkus per kiekvieną iš šių linijų, figūros pusės sutampa.',
        brezinys: simetrijosAsys(rusis, false),
      }),

    // 4. Lygiakraštis trikampis
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek simetrijos ašių turi lygiakraštis trikampis?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Po vieną iš kiekvienos viršūnės į priešingos kraštinės vidurį.',
      }),

    // 5. Apskritimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kiek simetrijos ašių turi apskritimas?',
        variantai: ['be galo daug', 'vieną', 'dvi', 'nė vienos'],
        teisingas: 0,
        sprendimas: 'Simetrijos ašis yra bet kuri tiesė, einanti per centrą.',
      }),

    // 6. Lygiašonis trikampis
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek simetrijos ašių turi lygiašonis trikampis, kuris nėra lygiakraštis?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Vienintelė ašis eina per viršūnę tarp lygių kraštinių ir pagrindo vidurį.',
      }),

    // 7. Poros
    () =>
      poruUzdavinys(naujasId(T2), T2, {
        klausimas: 'Sujunk figūrą su jos simetrijos ašių skaičiumi.',
        poros: [
          { kaire: 'kvadratas', desine: '4' },
          { kaire: 'stačiakampis', desine: '2' },
          { kaire: 'lygiagretainis', desine: '0' },
          { kaire: 'lygiakraštis trikampis', desine: '3' },
        ],
        sprendimas: 'Simetrijos ašis yra linija, per kurią perlenkus figūrą jos pusės sutampa.',
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: 'Mokinys teigia, kad stačiakampio įstrižainė yra jo simetrijos ašis. Kiek simetrijos ašių stačiakampis turi iš tikrųjų?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Perlenkus stačiakampį per įstrižainę, pusės nesutampa — nebent jis būtų kvadratas.',
        brezinys: simetrijosAsys('staciakampis'),
      }),
  ])
}

// ── 10.2.1. Posūkis apie tašką ──────────────────────────────────────────────

const T3 = 'posukis-apie-taska-5'

const A_POSUKIS = [
  {
    klausimas: 'Kiek laipsnių sudaro ketvirtis apsisukimo?',
    atsakymas: '90',
    atsakymasRodymui: '$90°$',
    sprendimas: '$360 : 4 = 90$.',
  },
] as const

export const posukisApieTaska5: Generatorius = () => suBandymais(kurkPosuki, A_POSUKIS, T3)

function kurkPosuki(): Uzdavinys | null {
  const laipsniai = pasirink<90 | 180 | 270>([90, 180, 270])
  const pagalLaikrodi = atsitiktinis(0, 1) === 1

  return variacija([
    // 1. Kiek laipsnių pasukta
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Keliais laipsniais pasukta figūra?',
        variantai: [`${laipsniai}°`, `${laipsniai === 90 ? 180 : 90}°`, `${laipsniai === 270 ? 180 : 270}°`, '360°'],
        teisingas: 0,
        sprendimas: 'Punktyru pavaizduota pasukta figūra; posūkio dydį rodo, kiek ji apsuko apie tašką O.',
        brezinys: posukioBrezinys(laipsniai, pagalLaikrodi, true),
      }),

    // 2. Ketvirtis apsisukimo
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek laipsnių sudaro ketvirtis apsisukimo?',
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: '$360 : 4 = 90$.',
      }),

    // 3. Kas nesikeičia
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kas nesikeičia sukant figūrą apie tašką?',
        variantai: ['jos dydis ir forma', 'jos kryptis', 'jos vieta', 'jos kraštinių skaičius mažėja'],
        teisingas: 0,
        sprendimas: 'Posūkis keičia tik figūros padėtį.',
      }),

    // 4. Du posūkiai
    () => {
      const antras = pasirink([90, 180])
      const suma = (laipsniai + antras) % 360
      return uzdavinys(T3, {
        klausimas: `Figūra pasukta ${laipsniai}°, o paskui dar ${antras}° ta pačia kryptimi. Kiek laipsnių ji pasukta iš viso?`,
        atsakymas: String(suma === 0 ? 360 : suma),
        atsakymasRodymui: `$${suma === 0 ? 360 : suma}°$`,
        sprendimas:
          suma === 0
            ? `$${laipsniai} + ${antras} = 360$ — figūra grįžo į pradinę padėtį.`
            : `$${laipsniai} + ${antras} = ${laipsniai + antras}$${laipsniai + antras >= 360 ? `, o tai tas pat, kas ${suma}°` : ''}.`,
      })
    },

    // 5. Kada grįžta į pradinę padėtį
    () =>
      uzdavinys(T3, {
        klausimas: 'Keliais laipsniais reikia pasukti figūrą, kad ji atsidurtų toje pačioje padėtyje?',
        atsakymas: '360',
        atsakymasRodymui: `$360°$`,
        sprendimas: 'Tai pilnas apsisukimas.',
      }),

    // 6. Priešinga kryptis
    () =>
      uzdavinys(T3, {
        klausimas: `Figūra pasukta ${laipsniai}° pagal laikrodžio rodyklę. Keliais laipsniais prieš laikrodžio rodyklę ją reikėtų pasukti, kad ji atsidurtų toje pačioje vietoje?`,
        atsakymas: String(360 - laipsniai),
        atsakymasRodymui: `$${360 - laipsniai}°$`,
        sprendimas: `$360 - ${laipsniai} = ${360 - laipsniai}$.`,
      }),

    // 7. Posūkio centras
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kas brėžinyje pažymėta kryželiu ties raide O?',
        variantai: ['posūkio centras', 'figūros vidurys', 'simetrijos ašis', 'figūros viršūnė'],
        teisingas: 0,
        sprendimas: 'Apie šį tašką figūra ir sukama; pats jis lieka vietoje.',
        brezinys: posukioBrezinys(laipsniai, pagalLaikrodi, true),
      }),

    // 8. Laikrodžio rodyklė
    () => {
      const valandos = pasirink([3, 6, 9])
      return uzdavinys(T3, {
        klausimas: `Kiek laipsnių apsuka laikrodžio valandinė rodyklė per ${valandos} valandas?`,
        atsakymas: String(valandos * 30),
        atsakymasRodymui: `$${valandos * 30}°$`,
        sprendimas: `Per 12 valandų rodyklė apsuka 360°, tad per valandą — 30°: $30 \\cdot ${valandos} = ${valandos * 30}$.`,
      })
    },
  ])
}

// ── 10.2.2. Taško atžvilgiu simetriškos figūros ─────────────────────────────

const T4 = 'simetriskos-tasko-atzvilgiu'

const A_TASKAS = [
  {
    klausimas: 'Kokį posūkį atitinka simetrija taško atžvilgiu?',
    atsakymas: '180',
    atsakymasRodymui: 'Posūkį $180°$',
    sprendimas: 'Centrinė simetrija yra posūkis 180° apie tą tašką.',
  },
] as const

export const simetriskosTaskoAtzvilgiu: Generatorius = () => suBandymais(kurkTaska, A_TASKAS, T4)

function kurkTaska(): Uzdavinys | null {
  return variacija([
    // 1. Koks tai posūkis
    () =>
      uzdavinys(T4, {
        klausimas: 'Keliais laipsniais reikia pasukti figūrą apie tašką, kad gautum jai simetrišką to taško atžvilgiu?',
        atsakymas: '180',
        atsakymasRodymui: `$180°$`,
        sprendimas: 'Simetrija taško atžvilgiu ir yra posūkis 180°.',
        brezinys: centrineSimetrija(true),
      }),

    // 2. Atstumas iki centro
    () => {
      const atstumas = atsitiktinis(2, 6)
      return uzdavinys(T4, {
        klausimas: `Taškas nuo simetrijos centro nutolęs ${atstumas} langelius. Per kiek langelių nuo centro bus jam simetriškas taškas?`,
        atsakymas: String(atstumas),
        atsakymasRodymui: `$${atstumas}$`,
        sprendimas: 'Simetriški taškai yra priešingose centro pusėse ir nuo jo nutolę vienodai.',
      })
    },

    // 3. Kur guli trys taškai
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kaip išsidėstę taškas, jam simetriškas taškas ir simetrijos centras?',
        variantai: [
          'visi trys yra vienoje tiesėje, o centras — viduryje',
          'jie sudaro trikampį',
          'centras yra šalia vieno iš taškų',
          'jie sutampa',
        ],
        teisingas: 0,
        sprendimas: 'Centras yra atkarpos, jungiančios simetriškus taškus, vidurys.',
        brezinys: centrineSimetrija(true),
      }),

    // 4. Atstumas tarp simetriškų taškų
    () => {
      const atstumas = atsitiktinis(2, 7)
      return uzdavinys(T4, {
        klausimas: `Taškas nuo simetrijos centro nutolęs ${atstumas} langelius. Per kiek langelių jis nutolęs nuo jam simetriško taško?`,
        atsakymas: String(2 * atstumas),
        atsakymasRodymui: `$${2 * atstumas}$`,
        sprendimas: `Centras yra viduryje: $${atstumas} \\cdot 2 = ${2 * atstumas}$.`,
      })
    },

    // 5. Kas nesikeičia
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kas nesikeičia atspindint figūrą taško atžvilgiu?',
        variantai: ['jos dydis ir forma', 'jos padėtis', 'jos kampų dydžiai sumažėja', 'jos kraštinių skaičius'],
        teisingas: 0,
        sprendimas: 'Kaip ir posūkis, centrinė simetrija keičia tik padėtį.',
      }),

    // 6. Skirtumas nuo ašinės
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuo simetrija taško atžvilgiu skiriasi nuo simetrijos tiesės atžvilgiu?',
        variantai: [
          'ji yra posūkis 180°, o ne atspindys',
          'ji keičia figūros dydį',
          'ji galima tik kvadratams',
          'jos rezultatas visada sutampa su pradine figūra',
        ],
        teisingas: 0,
        sprendimas: 'Todėl centrinės simetrijos rezultatą galima gauti tiesiog apsukant figūrą.',
      }),

    // 7. Kur atsidurs taškas
    () => {
      const centras = atsitiktinis(5, 8)
      const x = atsitiktinis(1, centras - 1)
      return uzdavinys(T4, {
        klausimas: `Simetrijos centras yra ${centras}-ajame stulpelyje. Kuriame stulpelyje atsidurs taškas, esantis ${x}-ajame stulpelyje?`,
        atsakymas: String(2 * centras - x),
        atsakymasRodymui: `$${2 * centras - x}$`,
        sprendimas: `Taškas nuo centro nutolęs $${centras} - ${x} = ${centras - x}$, tad kitoje pusėje bus $${centras} + ${centras - x} = ${2 * centras - x}$.`,
      })
    },

    // 8. Kur atsidurs figūra
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kur atsidurs figūra, atspindėta taško O atžvilgiu?',
        variantai: [
          'priešingoje taško O pusėje, apversta',
          'toje pačioje pusėje, tik pastumta',
          'ant paties taško O',
          'ji nepasikeis',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienas figūros taškas pereina į kitą centro pusę.',
        brezinys: centrineSimetrija(false),
      }),
  ])
}

// ── 10.2.3. Figūros, turinčios simetrijos centrą ────────────────────────────

const T5 = 'simetrijos-centras'

const A_CENTRAS = [
  {
    klausimas: 'Ar lygiagretainis turi simetrijos centrą?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: 'Jo įstrižainių susikirtimo taškas ir yra simetrijos centras.',
  },
] as const

export const simetrijosCentras: Generatorius = () => suBandymais(kurkCentra, A_CENTRAS, T5)

function kurkCentra(): Uzdavinys | null {
  return variacija([
    // 1. Ar turi lygiagretainis
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Ar lygiagretainis turi simetrijos centrą?',
        variantai: [
          'taip — įstrižainių susikirtimo taškas',
          'ne, jis neturi jokios simetrijos',
          'taip — bet kuri viršūnė',
          'taip — kraštinės vidurys',
        ],
        teisingas: 0,
        sprendimas: 'Pasukus lygiagretainį 180° apie tą tašką, jis sutampa su savimi.',
        brezinys: keturkampis('lygiagretainis'),
      }),

    // 2. Kur yra kvadrato centras
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kur yra kvadrato simetrijos centras?',
        variantai: ['įstrižainių susikirtimo taške', 'viršūnėje', 'kraštinės viduryje', 'kvadratas jo neturi'],
        teisingas: 0,
        sprendimas: 'Pasukus kvadratą 180° apie šį tašką, jis sutampa su savimi.',
      }),

    // 3. Kuri figūra neturi
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuri figūra neturi simetrijos centro?',
        variantai: ['lygiakraštis trikampis', 'kvadratas', 'rombas', 'stačiakampis'],
        teisingas: 0,
        sprendimas: 'Pasukus lygiakraštį trikampį 180°, jis neatsiduria toje pačioje padėtyje.',
      }),

    // 4. Kaip tikrinama
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kaip patikrinti, ar figūra turi simetrijos centrą?',
        variantai: [
          'pasukti ją 180° apie tą tašką — ji turi sutapti su savimi',
          'perlenkti lapą pusiau',
          'išmatuoti jos plotą',
          'suskaičiuoti kraštines',
        ],
        teisingas: 0,
        sprendimas: 'Simetrijos centras yra posūkio 180° centras, apie kurį figūra pereina į save.',
      }),

    // 5. Iš brėžinio
    () => {
      const rusis = pasirink<KeturkampioRusis>(['lygiagretainis', 'rombas', 'trapecija'])
      const turi = rusis !== 'trapecija'
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Ar pavaizduota figūra turi simetrijos centrą?',
        variantai: turi ? ['taip', 'ne', 'to nustatyti neįmanoma'] : ['ne', 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: turi
          ? 'Pasukus figūrą 180° apie įstrižainių susikirtimo tašką, ji sutampa su savimi.'
          : 'Trapecijos priešingos kraštinės nėra lygios ir lygiagrečios, tad pasukta 180° ji nesutampa.',
        brezinys: keturkampis(rusis),
      })
    },

    // 6. Apskritimas
    () =>
      uzdavinys(T5, {
        klausimas: 'Kur yra apskritimo simetrijos centras?',
        atsakymas: 'centre',
        atsakymasRodymui: 'Apskritimo centre',
        sprendimas: 'Pasukus apskritimą apie centrą bet kokiu kampu, jis sutampa su savimi.',
      }),

    // 7. Raidės
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuri raidė turi simetrijos centrą?',
        variantai: ['S', 'A', 'T', 'M'],
        teisingas: 0,
        sprendimas: 'Pasukus S 180°, ji atrodo taip pat; A, T ir M turi tik ašinę simetriją.',
      }),

    // 8. Ašys ir centras
    () =>
      uzdavinys(T5, {
        klausimas: 'Lygiagretainis, kuris nėra rombas ar stačiakampis, turi simetrijos centrą. Kiek jis turi simetrijos ašių?',
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Simetrijos centras ir simetrijos ašis — skirtingi dalykai: figūra gali turėti vieną be kito.',
        brezinys: keturkampis('lygiagretainis'),
      }),
  ])
}

// ── 10.3.1. Lygiagretusis postūmis ──────────────────────────────────────────

const T6 = 'lygiagretusis-postumis'

const A_POSTUMIS = [
  {
    klausimas: 'Kas nesikeičia stumiant figūrą?',
    atsakymas: 'dydis ir forma',
    atsakymasRodymui: 'Jos dydis ir forma',
    sprendimas: 'Postūmis keičia tik padėtį.',
  },
] as const

export const lygiagretusisPostumis: Generatorius = () => suBandymais(kurkPostumi, A_POSTUMIS, T6)

function kurkPostumi(): Uzdavinys | null {
  const dx = atsitiktinis(2, 5)
  const dy = atsitiktinis(-2, 2)

  return variacija([
    // 1. Kur atsidurs viršūnė
    () => {
      const x = atsitiktinis(1, 4)
      return uzdavinys(T6, {
        klausimas: `Figūra stumiama ${dx} langelius į dešinę. Kuriame stulpelyje atsidurs viršūnė, buvusi ${x}-ajame stulpelyje?`,
        atsakymas: String(x + dx),
        atsakymasRodymui: `$${x + dx}$`,
        sprendimas: `$${x} + ${dx} = ${x + dx}$.`,
        brezinys: postumisTinklelyje(14, 7, FIGURA, dx, dy),
      })
    },

    // 2. Kas nesikeičia
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kas nesikeičia stumiant figūrą lygiagrečiuoju postūmiu?',
        variantai: [
          'jos dydis, forma ir kraštinių kryptys',
          'jos padėtis',
          'jos kraštinių ilgiai',
          'jos kampų skaičius mažėja',
        ],
        teisingas: 0,
        sprendimas: 'Visi figūros taškai pasislenka ta pačia kryptimi ir tiek pat.',
      }),

    // 3. Kuo skiriasi nuo posūkio
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kuo lygiagretusis postūmis skiriasi nuo posūkio?',
        variantai: [
          'stumiant figūra nepasisuka',
          'stumiant figūra padidėja',
          'stumiant keičiasi kampų dydžiai',
          'stumiant figūra apverčiama',
        ],
        teisingas: 0,
        sprendimas: 'Postūmyje visos kraštinės lieka tų pačių krypčių.',
      }),

    // 4. Kiek pastumta
    () =>
      uzdavinys(T6, {
        klausimas: `Figūros viršūnė iš ${dx}-ojo stulpelio atsidūrė ${2 * dx}-ajame. Per kiek langelių ji pastumta?`,
        atsakymas: String(dx),
        atsakymasRodymui: `$${dx}$`,
        sprendimas: `$${2 * dx} - ${dx} = ${dx}$.`,
      }),

    // 5. Du postūmiai
    () => {
      const antras = atsitiktinis(2, 6)
      return uzdavinys(T6, {
        klausimas: `Figūra pastumta ${dx} langelius į dešinę, o paskui dar ${antras} langelius į dešinę. Per kiek langelių ji pastumta iš viso?`,
        atsakymas: String(dx + antras),
        atsakymasRodymui: `$${dx + antras}$`,
        sprendimas: `$${dx} + ${antras} = ${dx + antras}$.`,
      })
    },

    // 6. Priešingas postūmis
    () =>
      uzdavinys(T6, {
        klausimas: `Figūra pastumta ${dx} langelius į dešinę. Per kiek langelių ir kuria kryptimi ją reikia pastumti, kad ji grįžtų į pradinę vietą?`,
        atsakymas: String(dx),
        atsakymasRodymui: `$${dx}$ langelius į kairę`,
        sprendimas: 'Grąžinama tokiu pat postūmiu priešinga kryptimi.',
      }),

    // 7. Ornamentas
    () => {
      const kartai = atsitiktinis(3, 6)
      return uzdavinys(T6, {
        klausimas: `Ornamentas sudarytas iš elemento, kartojamo ${kartai} kartus, kaskart pastumiant ${dx} langelius. Per kiek langelių nuo pradinės padėties nutolęs paskutinis elementas?`,
        atsakymas: String(dx * (kartai - 1)),
        atsakymasRodymui: `$${dx * (kartai - 1)}$`,
        sprendimas: `Postūmių yra vienu mažiau nei elementų: $${dx} \\cdot ${kartai - 1} = ${dx * (kartai - 1)}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: 'Mokinys pastūmė figūrą ir jos kraštinės pakrypo kita kryptimi. Koks veiksmas buvo atliktas iš tikrųjų?',
        atsakymas: 'posukis',
        atsakymasRodymui: 'Posūkis',
        sprendimas: 'Lygiagrečiajame postūmyje kraštinių kryptys nesikeičia.',
      }),
  ])
}

// ── 10.3.2. Lygiagretainis, rombas, trapecija ───────────────────────────────

const T7 = 'lygiagretainis-rombas-trapecija'

const A_KETURKAMPIAI = [
  {
    klausimas: 'Kuris keturkampis turi visas keturias kraštines lygias?',
    atsakymas: 'rombas',
    atsakymasRodymui: 'Rombas',
    sprendimas: 'Rombas — lygiagretainis, kurio visos kraštinės lygios.',
  },
] as const

export const lygiagretainisRombasTrapecija: Generatorius = () =>
  suBandymais(kurkKeturkampius, A_KETURKAMPIAI, T7)

function kurkKeturkampius(): Uzdavinys | null {
  const krastine = atsitiktinis(4, 15)
  const kitas = atsitiktinis(4, 15)

  return variacija([
    // 1. Rombo apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kuris keturkampis turi visas keturias kraštines lygias?',
        variantai: ['rombas', 'trapecija', 'lygiagretainis', 'bet kuris keturkampis'],
        teisingas: 0,
        sprendimas: 'Rombas yra lygiagretainis, kurio visos kraštinės lygios.',
        brezinys: keturkampis('rombas'),
      }),

    // 2. Lygiagretainio apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Koks keturkampis vadinamas lygiagretainiu?',
        variantai: [
          'kurio abi priešingų kraštinių poros lygiagrečios',
          'kurio tik viena kraštinių pora lygiagreti',
          'kurio visi kampai statieji',
          'kurio įstrižainės lygios',
        ],
        teisingas: 0,
        sprendimas: 'Iš to seka, kad priešingos kraštinės ir priešingi kampai lygūs.',
        brezinys: keturkampis('lygiagretainis'),
      }),

    // 3. Trapecijos apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Koks keturkampis vadinamas trapecija?',
        variantai: [
          'kurio lygiagreti tik viena kraštinių pora',
          'kurio abi kraštinių poros lygiagrečios',
          'kurio visos kraštinės lygios',
          'kurio visi kampai statieji',
        ],
        teisingas: 0,
        sprendimas: 'Lygiagrečiosios trapecijos kraštinės vadinamos pagrindais.',
        brezinys: keturkampis('trapecija'),
      }),

    // 4. Atpažinimas iš brėžinio
    () => {
      const rusys: KeturkampioRusis[] = ['lygiagretainis', 'trapecija', 'rombas']
      const kuris = atsitiktinis(0, 2)
      return uzdavinys(T7, {
        klausimas: `Kuris iš pavaizduotų keturkampių yra ${rusys[kuris]}? Užrašyk jo numerį.`,
        atsakymas: String(kuris + 1),
        atsakymasRodymui: `$${kuris + 1}$`,
        sprendimas:
          'Lygiagretainio abi priešingų kraštinių poros lygiagrečios, trapecijos — tik viena, o rombo dar ir visos kraštinės lygios.',
        brezinys: keturkampiuEile(rusys),
      })
    },

    // 5. Rombo perimetras
    () =>
      uzdavinys(T7, {
        klausimas: `Rombo kraštinė yra ${krastine} cm. Koks jo perimetras?`,
        atsakymas: String(4 * krastine),
        atsakymasRodymui: `$${4 * krastine}$ cm`,
        sprendimas: `Visos rombo kraštinės lygios: $${krastine} \\cdot 4 = ${4 * krastine}$.`,
      }),

    // 6. Lygiagretainio perimetras
    () =>
      uzdavinys(T7, {
        klausimas: `Lygiagretainio gretimos kraštinės yra ${krastine} cm ir ${kitas} cm. Koks jo perimetras?`,
        atsakymas: String(2 * (krastine + kitas)),
        atsakymasRodymui: `$${2 * (krastine + kitas)}$ cm`,
        sprendimas: `Priešingos kraštinės lygios: $2 \\cdot (${krastine} + ${kitas}) = ${2 * (krastine + kitas)}$.`,
        brezinys: keturkampis('lygiagretainis'),
      }),

    // 7. Ar kvadratas yra rombas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ar kvadratas yra rombas?',
        variantai: [
          'taip, nes visos jo kraštinės lygios',
          'ne, nes jo kampai statieji',
          'ne, nes rombas neturi stačiųjų kampų',
          'taip, bet tik jei jis pasuktas',
        ],
        teisingas: 0,
        sprendimas: 'Kvadratas yra rombas, kurio visi kampai statieji.',
      }),

    // 8. Lygiagretainio kampai
    () => {
      const kampas = atsitiktinis(35, 80)
      return uzdavinys(T7, {
        klausimas: `Vienas lygiagretainio kampas yra ${kampas}°. Kiek laipsnių turi jam gretimas kampas?`,
        atsakymas: String(180 - kampas),
        atsakymasRodymui: `$${180 - kampas}°$`,
        sprendimas: `Gretimų lygiagretainio kampų suma 180°: $180 - ${kampas} = ${180 - kampas}$.`,
        brezinys: keturkampis('lygiagretainis', true),
      })
    },
  ])
}
