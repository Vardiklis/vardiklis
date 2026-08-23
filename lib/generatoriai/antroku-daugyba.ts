import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { daiktuEile, type Daiktas } from './ikonos'
import { daugybosLentele, kartuSchema } from './pirmoku-vaizdai'
import { langeliuEile } from './vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 2 klasės 2 tema „Daugyba“ ir 3 tema „Dalyba“.
 *
 * Abi temos rėmėsi `sveikieji` generatoriumi — jis skirtas 6 klasei ir duoda
 * neigiamus skaičius bei modulius, tad antrokas vietoj „5 dėžės po 4 obuolius“
 * gaudavo veiksmus su minusais. Nė viena iš dvidešimt trijų potemių negaudavo
 * savo turinio.
 *
 * Vadovėlio žodynas, kurio laikomasi visur: **daugiklis · daugiklis =
 * sandauga**, o daugybos ženklas eilutėje rašomas tašku (`\cdot`), ne kryželiu.
 * Dalyboje — **dalinys : daliklis = dalmuo**.
 *
 * Svarbiausias šių temų skirtumas, kurį vadovėlis pabrėžia atskirai: „3 taškais
 * daugiau“ reiškia sudėtį, o „3 kartus daugiau“ — daugybą. Todėl uždavinių
 * potemėse yra pavidalų, kur abu variantai stovi greta.
 */

const VARDAI = ['Matas', 'Ieva', 'Emilis', 'Luknė', 'Greta', 'Tauras', 'Kajus'] as const

/** Temos riba; be srities imama 100. */
function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 100, 100)
}

/** Daugybos veiksmas taip, kaip rašo vadovėlis. */
function sandauga(a: number, b: number): string {
  return `$${a} \\cdot ${b}$`
}

/** Visa lygybė vienu KaTeX intarpu — du gretimi `$…$` rodomi su tarpu viduryje. */
function lygybe(a: number, b: number): string {
  return `$${a} \\cdot ${b} = ${a * b}$`
}

/**
 * Skaičiuojami daiktai su linksniais.
 *
 * `gal` yra galininkas, kurio reikalauja „po …“: po 1 sausainį, po 3
 * sausainius, po 10 sausainių. `ind` — talpykla vardininku, o `gimine` reikia
 * įvardžiui: „kiekvienoje dėžėje“, bet „kiekviename ryšulyje“.
 */
const DAIKTAI = [
  {
    kas: 'sausainis' as Daiktas,
    gal: { vns: 'sausainį', dgs: 'sausainius', kilm: 'sausainių' },
    k: 'sausainių',
    ind: { vns: 'lėkštė', dgs: 'lėkštės', kilm: 'lėkščių' },
    gimine: 'm' as const,
  },
  {
    kas: 'obuolys' as Daiktas,
    gal: { vns: 'obuolį', dgs: 'obuolius', kilm: 'obuolių' },
    k: 'obuolių',
    ind: { vns: 'dėžė', dgs: 'dėžės', kilm: 'dėžių' },
    gimine: 'm' as const,
  },
  {
    kas: 'piestukas' as Daiktas,
    gal: { vns: 'pieštuką', dgs: 'pieštukus', kilm: 'pieštukų' },
    k: 'pieštukų',
    ind: { vns: 'dėžutė', dgs: 'dėžutės', kilm: 'dėžučių' },
    gimine: 'm' as const,
  },
  {
    kas: 'balionas' as Daiktas,
    gal: { vns: 'balioną', dgs: 'balionus', kilm: 'balionų' },
    k: 'balionų',
    ind: { vns: 'ryšulys', dgs: 'ryšuliai', kilm: 'ryšulių' },
    gimine: 'v' as const,
  },
  {
    kas: 'kubelis' as Daiktas,
    gal: { vns: 'kubelį', dgs: 'kubelius', kilm: 'kubelių' },
    k: 'kubelių',
    ind: { vns: 'statinys', dgs: 'statiniai', kilm: 'statinių' },
    gimine: 'v' as const,
  },
] as const

/** „kiekvienoje dėžėje“ arba „kiekviename ryšulyje“ — pagal talpyklos giminę. */
function kiekvienoje(gimine: 'v' | 'm'): string {
  return gimine === 'm' ? 'kiekvienoje' : 'kiekviename'
}

const VNT_FORMOS = { vns: 'vienetu', dgs: 'vienetais', kilm: 'vienetų' }
const KARTU = { vns: 'kartą', dgs: 'kartus', kilm: 'kartų' }

// ═══ 2 tema. Daugyba ════════════════════════════════════════════════════════

// ── 2.1 Kas yra daugyba? ────────────────────────────────────────────────────

const A_KAS_DAUGYBA = [
  {
    klausimas: 'Yra 4 lėkštės, kiekvienoje po 3 sausainius. Kiek sausainių iš viso?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: 'Keturis kartus po 3: $4 \\cdot 3 = 12$.',
  },
] as const

export const kasYraDaugyba: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkKasDaugyba(sritis), A_KAS_DAUGYBA, 'kas-yra-daugyba')

function kurkKasDaugyba(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const kiek = atsitiktinis(3, 6)
  const kiekviename = atsitiktinis(2, 5)
  if (kiek * kiekviename > maks) return null
  const d = pasirink(DAIKTAI)
  const sand = kiek * kiekviename

  return variacija([
    // 1. Kiek iš viso pagal paveikslėlį
    () =>
      uzdavinys('kas-yra-daugyba', {
        klausimas: `Yra ${kiek} ${derink(kiek, d.ind)}, ${kiekvienoje(d.gimine)} po ${kiekviename} ${derink(kiekviename, d.gal)}. Kiek ${d.k} iš viso?`,
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `${kiek} kartus po ${kiekviename}: ${lygybe(kiek, kiekviename)}.`,
        brezinys: daiktuEile(
          Array.from({ length: kiek }, () => ({ daiktas: d.kas, kiek: kiekviename })),
          22,
        ),
      }),

    // 2. Kuris veiksmas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-daugyba'), 'kas-yra-daugyba', {
        klausimas: `Yra ${kiek} ${derink(kiek, d.ind)} po ${kiekviename} ${derink(kiekviename, d.gal)}. Kuris veiksmas tinka?`,
        variantai: [
          `$${kiek} \\cdot ${kiekviename}$`,
          `$${kiek} + ${kiekviename}$`,
          `$${kiek} - ${kiekviename}$`,
        ],
        teisingas: 0,
        sprendimas: `Vienodos grupės sudedamos daugybos veiksmu: ${kiek} kartus po ${kiekviename}.`,
      }),

    // 3. Sudėtis paverčiama daugyba
    () => {
      const suma = Array(kiek).fill(kiekviename).join(' + ')
      return uzdavinys('kas-yra-daugyba', {
        klausimas: `Užbaik: $${suma} = ${kiek} \\cdot \\square$`,
        atsakymas: String(kiekviename),
        atsakymasRodymui: `$${kiekviename}$`,
        sprendimas: `Dėmuo ${kiekviename} kartojasi ${kiek} kartus, tad ${sandauga(kiek, kiekviename)}.`,
      })
    },

    // 4. Daugiklis, daugiklis, sandauga — sąvokos
    () => {
      // Vienodi daugikliai duotų du vienodus atsakymo variantus.
      if (kiek === kiekviename) return null
      return pasirinkimoUzdavinys(naujasId('kas-yra-daugyba'), 'kas-yra-daugyba', {
        klausimas: `Veiksme ${lygybe(kiek, kiekviename)} kuris skaičius yra sandauga?`,
        variantai: [String(sand), String(kiek), String(kiekviename)],
        teisingas: 0,
        sprendimas: `Sandauga yra daugybos rezultatas — ji rašoma po lygybės ženklo, tad ${sand}.`,
      })
    },

    // 5. Ką rodo pirmasis daugiklis
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-daugyba'), 'kas-yra-daugyba', {
        klausimas: `Veiksme ${sandauga(kiek, kiekviename)} ką rodo pirmasis daugiklis ${kiek}?`,
        variantai: ['kiek grupių imame', 'kiek yra vienoje grupėje', 'kiek turime iš viso'],
        teisingas: 0,
        sprendimas: `${kiek} rodo grupių skaičių, o ${kiekviename} — kiek daiktų vienoje grupėje.`,
      }),
  ])
}

// ── 2.2 Kaip vienodų dėmenų sudėtį pakeisti daugyba? ────────────────────────

const A_SUDETIS_DAUGYBA = [
  {
    klausimas: 'Pakeisk daugyba: $4 + 4 + 4$',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: 'Trys kartus po 4: $3 \\cdot 4 = 12$.',
  },
] as const

export const sudetisIDaugyba: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSudetiIDaugyba(sritis), A_SUDETIS_DAUGYBA, 'sudetis-i-daugyba')

function kurkSudetiIDaugyba(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const kartai = atsitiktinis(3, 7)
  const demuo = atsitiktinis(2, 6)
  if (kartai * demuo > maks) return null
  const suma = Array(kartai).fill(demuo).join(' + ')
  const sand = kartai * demuo

  return variacija([
    // 1. Kiek gaunasi
    () =>
      uzdavinys('sudetis-i-daugyba', {
        klausimas: `Pakeisk daugyba ir apskaičiuok: $${suma}$`,
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `${kartai} kartus po ${demuo}: ${lygybe(kartai, demuo)}.`,
      }),

    // 2. Kiek kartų kartojasi dėmuo
    () =>
      uzdavinys('sudetis-i-daugyba', {
        klausimas: `Užbaik: $${suma} = \\square \\cdot ${demuo}$`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `Dėmuo ${demuo} pasikartoja ${kartai} ${derink(kartai, KARTU)}.`,
      }),

    // 3. Koks dėmuo kartojasi
    () =>
      uzdavinys('sudetis-i-daugyba', {
        klausimas: `Užbaik: $${suma} = ${kartai} \\cdot \\square$`,
        atsakymas: String(demuo),
        atsakymasRodymui: `$${demuo}$`,
        sprendimas: `Kartojasi dėmuo ${demuo}, o kartų yra ${kartai}.`,
      }),

    // 4. Kuris daugybos veiksmas tinka sumai
    () =>
      pasirinkimoUzdavinys(naujasId('sudetis-i-daugyba'), 'sudetis-i-daugyba', {
        klausimas: `Kuris daugybos veiksmas tinka sumai $${suma}$?`,
        variantai: [
          `$${kartai} \\cdot ${demuo}$`,
          `$${kartai} \\cdot ${demuo + 1}$`,
          `$${kartai + 1} \\cdot ${demuo}$`,
        ],
        teisingas: 0,
        sprendimas: `Dėmenų yra ${kartai}, kiekvienas lygus ${demuo}.`,
      }),

    // 5. Atvirkščiai: daugyba paverčiama sudėtimi
    () =>
      uzdavinys('sudetis-i-daugyba', {
        klausimas: `Kiek dėmenų bus, jei ${sandauga(kartai, demuo)} pakeisi sudėtimi?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `${sandauga(kartai, demuo)} reiškia ${kartai} kartus po ${demuo}, tad dėmenų bus ${kartai}.`,
      }),
  ])
}

// ── 2.3–2.4, 2.6–2.7 Daugyba iš 2, 3, 4, 5 ──────────────────────────────────

/**
 * Bendras daugybos iš vieno daugiklio generatorius.
 *
 * Keturios potemės („iš 2“, „iš 3“, „iš 4“, „iš 5“) skiriasi tik daugikliu, o
 * uždavinių pavidalai jose vienodi. Kartoti tą patį kodą keturis kartus būtų
 * kvietimas juos prasilenkti, tad daugiklis paduodamas kaip argumentas.
 */
function daugybaIs(daugiklis: number, temaId: string) {
  return (sritis?: Sritis | null): Uzdavinys | null => {
    const maks = riba(sritis)
    const kitas = atsitiktinis(2, Math.min(10, Math.floor(maks / daugiklis)))
    const sand = daugiklis * kitas
    const d = pasirink(DAIKTAI)

    return variacija([
      // 1. Grynas veiksmas
      () =>
        uzdavinys(temaId, {
          klausimas: `Apskaičiuok: ${sandauga(daugiklis, kitas)}`,
          atsakymas: String(sand),
          atsakymasRodymui: `$${sand}$`,
          sprendimas: `${daugiklis} kartus po ${kitas} yra ${sand}.`,
        }),

      // 2. Tekstinis su grupėmis
      () =>
        uzdavinys(temaId, {
          klausimas: `Yra ${kitas} ${derink(kitas, d.ind)}, ${kiekvienoje(d.gimine)} po ${daugiklis} ${derink(daugiklis, d.gal)}. Kiek ${d.k} iš viso?`,
          atsakymas: String(sand),
          atsakymasRodymui: `$${sand}$`,
          sprendimas: `${lygybe(kitas, daugiklis)}.`,
        }),

      // 3. Nežinomas daugiklis
      () =>
        uzdavinys(temaId, {
          klausimas: `Užbaik: $${daugiklis} \\cdot \\square = ${sand}$`,
          atsakymas: String(kitas),
          atsakymasRodymui: `$${kitas}$`,
          sprendimas: `Ieškome, kiek kartų po ${daugiklis} sudaro ${sand}: tai ${kitas}.`,
        }),

      // 4. Pasirinkimas — netiesos iš gretimų lentelės eilučių
      () => {
        const netiesos = [...new Set([sand - daugiklis, sand + daugiklis, sand + 1])].filter(
          (x) => x > 0 && x !== sand && x <= maks,
        )
        if (netiesos.length < 2) return null
        return pasirinkimoUzdavinys(naujasId(temaId), temaId, {
          klausimas: `Pasirink teisingą atsakymą: ${sandauga(kitas, daugiklis)}`,
          variantai: [String(sand), ...netiesos.slice(0, 2).map(String)],
          teisingas: 0,
          sprendimas: `${lygybe(kitas, daugiklis)}.`,
        })
      },

      // 5. Sudėtis vietoj daugybos
      () => {
        if (kitas > 7) return null
        return uzdavinys(temaId, {
          klausimas: `Užbaik: $${Array(kitas).fill(daugiklis).join(' + ')} = \\square$`,
          atsakymas: String(sand),
          atsakymasRodymui: `$${sand}$`,
          sprendimas: `${kitas} kartus po ${daugiklis}: ${lygybe(kitas, daugiklis)}.`,
        })
      },

      // 6. Daugiklių sukeitimas vietomis
      () =>
        pasirinkimoUzdavinys(naujasId(temaId), temaId, {
          klausimas: `Ar ${sandauga(daugiklis, kitas)} ir ${sandauga(kitas, daugiklis)} sandaugos vienodos?`,
          variantai: ['taip, sandauga nepasikeičia', 'ne, pirmoji didesnė', 'ne, antroji didesnė'],
          teisingas: 0,
          sprendimas: `Sukeitus daugiklius vietomis sandauga nepasikeičia: abi lygios ${sand}.`,
        }),
    ])
  }
}

const A_DAUGYBA = [
  {
    klausimas: 'Apskaičiuok: $2 \\cdot 7$',
    atsakymas: '14',
    atsakymasRodymui: '$14$',
    sprendimas: '2 kartus po 7 yra 14.',
  },
] as const

export const daugybaIs2: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => daugybaIs(2, 'daugyba-is-2')(sritis), A_DAUGYBA, 'daugyba-is-2')

export const daugybaIs3: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => daugybaIs(3, 'daugyba-is-3')(sritis), A_DAUGYBA, 'daugyba-is-3')

export const daugybaIs4: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => daugybaIs(4, 'daugyba-is-4')(sritis), A_DAUGYBA, 'daugyba-is-4')

export const daugybaIs5: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => daugybaIs(5, 'daugyba-is-5')(sritis), A_DAUGYBA, 'daugyba-is-5')

// ── 2.8 Kaip dauginti iš 0 ir iš 1? ─────────────────────────────────────────

const A_NULIS_VIENAS = [
  {
    klausimas: 'Apskaičiuok: $7 \\cdot 0$',
    atsakymas: '0',
    atsakymasRodymui: '$0$',
    sprendimas: 'Padauginus iš nulio visada gaunamas 0.',
  },
] as const

export const daugybaIs0Ir1: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkNuliVieneta(sritis), A_NULIS_VIENAS, 'daugyba-is-0-ir-1')

function kurkNuliVieneta(sritis?: Sritis | null): Uzdavinys | null {
  const n = atsitiktinis(2, Math.min(10, riba(sritis)))

  return variacija([
    // 1. Daugyba iš nulio
    () =>
      uzdavinys('daugyba-is-0-ir-1', {
        klausimas: `Apskaičiuok: ${sandauga(n, 0)}`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: `Imame ${n} grupes, kuriose nieko nėra, tad iš viso 0.`,
      }),

    // 2. Daugyba iš vieneto
    () =>
      uzdavinys('daugyba-is-0-ir-1', {
        klausimas: `Apskaičiuok: ${sandauga(1, n)}`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Vieną kartą po ${n} yra ${n} — padauginus iš 1 skaičius nepasikeičia.`,
      }),

    // 3. Nežinomas daugiklis prie vieneto
    () =>
      uzdavinys('daugyba-is-0-ir-1', {
        klausimas: `Užbaik: $\\square \\cdot 1 = ${n}$`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Padauginus iš 1 skaičius nepasikeičia, tad langelyje ${n}.`,
      }),

    // 4. Taisyklė žodžiais
    () =>
      pasirinkimoUzdavinys(naujasId('daugyba-is-0-ir-1'), 'daugyba-is-0-ir-1', {
        klausimas: 'Kas gaunasi bet kurį skaičių padauginus iš 0?',
        variantai: ['visada 0', 'tas pats skaičius', 'visada 1'],
        teisingas: 0,
        sprendimas: 'Nulis grupių arba grupės be nė vieno daikto — abiem atvejais nieko nėra.',
      }),

    // 5. Koks ženklas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('daugyba-is-0-ir-1'), 'daugyba-is-0-ir-1', {
        klausimas: `Koks ženklas tinka, kad lygybė būtų teisinga: $${n} \\;\\square\\; 0 = ${n}$?`,
        variantai: ['+', '\\cdot', '-'],
        teisingas: 0,
        sprendimas: `Pridėjus 0 skaičius nepasikeičia, o padauginus iš 0 gautume 0.`,
      }),
  ])
}

// ── 2.9 Kaip dauginti iš 10? ────────────────────────────────────────────────

const A_DESIMT = [
  {
    klausimas: 'Apskaičiuok: $7 \\cdot 10$',
    atsakymas: '70',
    atsakymasRodymui: '$70$',
    sprendimas: '7 dešimtys yra 70.',
  },
] as const

export const daugybaIs10: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDaugybaIs10(sritis), A_DESIMT, 'daugyba-is-10')

function kurkDaugybaIs10(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const n = atsitiktinis(2, Math.min(10, Math.floor(maks / 10)))
  const sand = n * 10
  const d = pasirink(DAIKTAI)

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('daugyba-is-10', {
        klausimas: `Apskaičiuok: ${sandauga(n, 10)}`,
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `${n} ${derink(n, { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' })} yra ${sand}.`,
      }),

    // 2. Tekstinis
    () =>
      uzdavinys('daugyba-is-10', {
        klausimas: `Yra ${n} ${derink(n, d.ind)}, ${kiekvienoje(d.gimine)} po 10 ${d.gal.kilm}. Kiek ${d.k} iš viso?`,
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `${lygybe(n, 10)}.`,
      }),

    // 3. Nežinomas daugiklis
    () =>
      uzdavinys('daugyba-is-10', {
        klausimas: `Užbaik: $10 \\cdot \\square = ${sand}$`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `${sand} yra ${n} ${derink(n, { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' })}.`,
      }),

    // 4. Pasirinkimas — tipinė klaida su nuliais
    () =>
      pasirinkimoUzdavinys(naujasId('daugyba-is-10'), 'daugyba-is-10', {
        klausimas: `Pasirink teisingą atsakymą: ${sandauga(n, 10)}`,
        variantai: [String(sand), String(n), String(sand + 10)],
        teisingas: 0,
        sprendimas: `Dauginant iš 10 prie skaičiaus prirašomas nulis: ${sand}.`,
      }),

    // 5. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId('daugyba-is-10'), 'daugyba-is-10', {
        klausimas: 'Kas atsitinka skaičiui, kai jį padauginame iš 10?',
        variantai: [
          'prie jo prirašomas nulis',
          'jis padidėja 10 vienetų',
          'jis nepasikeičia',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienas vienetas virsta dešimtimi, tad skaitmuo pasislenka į dešimčių skyrių.',
      }),
  ])
}

// ── 2.5 Kiek kartų padidėja sekos narys? ────────────────────────────────────

const A_KARTU_SEKA = [
  {
    klausimas: 'Kiek kartų didėja kiekvienas sekos narys: 2, 4, 8, 16?',
    atsakymas: '2',
    atsakymasRodymui: '$2$',
    sprendimas: 'Kiekvienas paskesnis narys dvigubai didesnis: $2 \\cdot 2 = 4$, $4 \\cdot 2 = 8$.',
  },
] as const

export const kartuSekos: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkKartuSeka(sritis), A_KARTU_SEKA, 'kartu-sekos')

/**
 * Seka, kurios narys didėja kartais, o ne vienetais.
 *
 * Potemė yra daugybos temoje, tad ir taisyklė turi būti daugybos: 2, 4, 8, 16
 * (dvigubai), 3, 9, 27 (trigubai). Aritmetinė seka (13, 18, 23) čia netinka —
 * ji nieko nemoko apie tai, ką reiškia „kiek kartų“.
 */
function kurkKartuSeka(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const kartai = pasirink([2, 3])
  const pradzia = kartai === 2 ? atsitiktinis(1, 6) : atsitiktinis(1, 3)
  const seka = [pradzia]
  while (seka[seka.length - 1] * kartai <= maks) seka.push(seka[seka.length - 1] * kartai)
  if (seka.length < 4) return null
  const rodomi = seka.slice(0, 4)
  const kitas = seka[4] ?? rodomi[3] * kartai
  const eilute = rodomi.join(', ')

  return variacija([
    // 1. Koks kitas narys
    () => {
      if (kitas > maks) return null
      return uzdavinys('kartu-sekos', {
        klausimas: `Seka didėja kartais. Koks skaičius eina toliau: ${eilute}?`,
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        sprendimas: `Kiekvienas paskesnis narys ${kartai} kartus didesnis: $${rodomi[3]} \\cdot ${kartai} = ${kitas}$.`,
        brezinys: langeliuEile([...rodomi, null], true),
      })
    },

    // 2. Kiek kartų didėja
    () =>
      uzdavinys('kartu-sekos', {
        klausimas: `Kiek kartų didėja kiekvienas sekos narys: ${eilute}?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `$${rodomi[0]} \\cdot ${kartai} = ${rodomi[1]}$, $${rodomi[1]} \\cdot ${kartai} = ${rodomi[2]}$ — narys didėja ${kartai} kartus.`,
        brezinys: langeliuEile(rodomi, true),
      }),

    // 3. Trūkstamas vidurinis narys
    () =>
      uzdavinys('kartu-sekos', {
        klausimas: `Įrašyk trūkstamą sekos narį: ${rodomi[0]}, ${rodomi[1]}, $\\square$, ${rodomi[3]}.`,
        atsakymas: String(rodomi[2]),
        atsakymasRodymui: `$${rodomi[2]}$`,
        sprendimas: `Narys didėja ${kartai} kartus: $${rodomi[1]} \\cdot ${kartai} = ${rodomi[2]}$.`,
        brezinys: langeliuEile([rodomi[0], rodomi[1], null, rodomi[3]], true),
      }),

    // 4. Kuri taisyklė tinka — daugyba ar sudėtis
    () =>
      pasirinkimoUzdavinys(naujasId('kartu-sekos'), 'kartu-sekos', {
        klausimas: `Pasirink sekos ${eilute} taisyklę.`,
        variantai: [
          `kiekvieną narį dauginame iš ${kartai}`,
          `prie kiekvieno nario pridedame ${kartai}`,
          `iš kiekvieno nario atimame ${kartai}`,
        ],
        teisingas: 0,
        sprendimas: `Pridėjus ${kartai} po ${rodomi[0]} eitų ${rodomi[0] + kartai}, o sekoje yra ${rodomi[1]} — tad nariai dauginami.`,
        brezinys: langeliuEile(rodomi, true),
      }),

    // 5. Kurioje sekoje narys didėja ne 2 kartus
    () => {
      const dvigubai = [4, 8, 16, 32]
      const kitas1 = [5, 10, 20, 40]
      const trigubai = [3, 9, 27, 81]
      return pasirinkimoUzdavinys(naujasId('kartu-sekos'), 'kartu-sekos', {
        klausimas: 'Kurioje sekoje kiekvienas paskesnis narys padidėja ne 2 kartus?',
        variantai: [trigubai.join(', '), dvigubai.join(', '), kitas1.join(', ')],
        teisingas: 0,
        sprendimas: 'Sekoje 3, 9, 27, 81 kiekvienas narys 3 kartus didesnis, o kitose dviejose — 2 kartus.',
      })
    },

    // 6. Kelintas narys yra nurodytas skaičius
    () =>
      uzdavinys('kartu-sekos', {
        klausimas: `Sekoje ${eilute} kelintas narys yra ${rodomi[2]}? Parašyk skaičių.`,
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: `Skaičiuojame nuo pradžios: ${rodomi[0]}, ${rodomi[1]}, ${rodomi[2]} — tai trečiasis narys.`,
        brezinys: langeliuEile(rodomi, true),
      }),
  ])
}

// ── 2.10 Kaip naudotis daugybos lentele? ────────────────────────────────────

const A_LENTELE = [
  {
    klausimas: 'Daugybos lentelėje rask $6 \\cdot 4$.',
    atsakymas: '24',
    atsakymasRodymui: '$24$',
    sprendimas: '6 eilutė ir 4 stulpelis susikerta langelyje, kuriame yra 24.',
  },
] as const

export const daugybosLentelesNaudojimas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkLentele(sritis), A_LENTELE, 'daugybos-lentele')

function kurkLentele(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const e = atsitiktinis(2, 9)
  const s = atsitiktinis(2, 9)
  const sand = e * s
  if (sand > maks) return null

  return variacija([
    // 1. Rask sandaugą lentelėje
    () =>
      uzdavinys('daugybos-lentele', {
        klausimas: `Daugybos lentelėje rask ${sandauga(e, s)}.`,
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `${e} eilutė ir ${s} stulpelis susikerta langelyje, kuriame yra ${sand}.`,
        brezinys: daugybosLentele({ e, s }),
      }),

    // 2. Kas yra eilutės ir stulpelio sankirtoje
    () =>
      uzdavinys('daugybos-lentele', {
        klausimas: `Koks skaičius yra ${e} eilutės ir ${s} stulpelio sankirtoje?`,
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `Sankirtoje stovi sandauga ${lygybe(e, s)}.`,
        brezinys: daugybosLentele({ e, s }),
      }),

    // 3. Uždengtas langelis
    () =>
      uzdavinys('daugybos-lentele', {
        klausimas: 'Koks skaičius uždengtas pažymėtame lentelės langelyje?',
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `Langelis yra ${e} eilutėje ir ${s} stulpelyje, tad jame ${lygybe(e, s)}.`,
        brezinys: daugybosLentele({ e, s, slepti: true }),
      }),

    // 4. Nežinomas daugiklis pagal lentelę
    () =>
      uzdavinys('daugybos-lentele', {
        klausimas: `Naudodamasis lentele užbaik: $${e} \\cdot \\square = ${sand}$`,
        atsakymas: String(s),
        atsakymasRodymui: `$${s}$`,
        sprendimas: `${e} eilutėje ieškome ${sand} — jis stovi ${s} stulpelyje.`,
        brezinys: daugybosLentele({ e, s }),
      }),

    // 5. Kiek didėja skaičiai eilutėje
    () =>
      uzdavinys('daugybos-lentele', {
        klausimas: `Kiek vienetų padidėja kiekvienas kitas skaičius ${e} lentelės eilutėje?`,
        atsakymas: String(e),
        atsakymasRodymui: `$${e}$`,
        sprendimas: `Kiekvienoje eilutėje skaičiai didėja tiek, koks yra tos eilutės daugiklis — čia ${e}.`,
        brezinys: daugybosLentele({ e, s }),
      }),

    // 6. Palyginimas su ženklu
    () => {
      const kitas = atsitiktinis(2, 9) * atsitiktinis(2, 9)
      if (kitas > maks || kitas === sand) return null
      return pasirinkimoUzdavinys(naujasId('daugybos-lentele'), 'daugybos-lentele', {
        klausimas: `Parink tinkamą ženklą: $${e} \\cdot ${s} \\;\\square\\; ${kitas}$`,
        variantai: ['<', '>', '='],
        teisingas: sand < kitas ? 0 : 1,
        sprendimas: `${lygybe(e, s)}, o tai ${sand < kitas ? 'mažiau' : 'daugiau'} nei ${kitas}.`,
      })
    },
  ])
}

// ── 2.11 Kaip spręsti daugybos uždavinius? ──────────────────────────────────

const A_DAUG_UZD = [
  {
    klausimas: 'Yra 5 dėžės, kiekvienoje po 4 obuolius. Kiek obuolių iš viso?',
    atsakymas: '20',
    atsakymasRodymui: '$20$',
    sprendimas: '$5 \\cdot 4 = 20$. Ats.: 20 obuolių.',
  },
] as const

export const daugybosUzdaviniai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDaugybosUzdavini(sritis), A_DAUG_UZD, 'daugybos-uzdaviniai')

function kurkDaugybosUzdavini(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const grupiu = atsitiktinis(3, 7)
  const grupeje = atsitiktinis(2, 6)
  if (grupiu * grupeje > maks) return null
  const sand = grupiu * grupeje
  const d = pasirink(DAIKTAI)
  const [v, v2] = sumaisyk([...VARDAI]).slice(0, 2)
  const kartai = atsitiktinis(2, 4)
  const vienetas = atsitiktinis(3, 8)

  return variacija([
    // 1. Grupės po tiek pat
    () =>
      uzdavinys('daugybos-uzdaviniai', {
        klausimas: `Yra ${grupiu} ${derink(grupiu, d.ind)}. Kiekvienoje grupėje po ${grupeje} ${derink(grupeje, d.gal)}. Kiek ${d.k} iš viso?`,
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `${lygybe(grupiu, grupeje)}. Ats.: ${sand}.`,
      }),

    // 2. Kiekvienas vaikas turi po tiek pat
    () =>
      uzdavinys('daugybos-uzdaviniai', {
        klausimas: `${grupiu} vaikai turi po ${grupeje} ${derink(grupeje, d.gal)}. Kiek ${d.k} jie turi kartu?`,
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `${lygybe(grupiu, grupeje)}. Ats.: ${sand}.`,
      }),

    // 3. „Kartus daugiau“ — su schema
    () => {
      if (vienetas * kartai > maks) return null
      return uzdavinys('daugybos-uzdaviniai', {
        klausimas: `${v} surinko ${vienetas} taškus, o ${v2} — ${kartai} ${derink(kartai, KARTU)} daugiau. Kiek taškų surinko ${v2}?`,
        atsakymas: String(vienetas * kartai),
        atsakymasRodymui: `$${vienetas * kartai}$`,
        sprendimas: `„${kartai} kartus daugiau“ reiškia daugybą: ${lygybe(kartai, vienetas)}.`,
        brezinys: kartuSchema(vienetas, kartai),
      })
    },

    // 4. „Vienetais daugiau“ ar „kartus daugiau“ — kuo skiriasi
    () => {
      if (vienetas * kartai > maks) return null
      return pasirinkimoUzdavinys(naujasId('daugybos-uzdaviniai'), 'daugybos-uzdaviniai', {
        klausimas: `${v} surinko ${vienetas} taškus, o ${v2} — ${kartai} ${derink(kartai, KARTU)} daugiau. Kuriuo veiksmu skaičiuosi?`,
        variantai: [
          `$${vienetas} \\cdot ${kartai}$`,
          `$${vienetas} + ${kartai}$`,
          `$${vienetas} - ${kartai}$`,
        ],
        teisingas: 0,
        sprendimas: `„Kartus daugiau“ reiškia daugybą, o „${kartai} ${derink(kartai, VNT_FORMOS)} daugiau“ reikštų sudėtį.`,
      })
    },

    // 5. Eilės ir stulpeliai
    () =>
      uzdavinys('daugybos-uzdaviniai', {
        klausimas: `${grupiu} eilėse auga po ${grupeje} ${derink(grupeje, { vns: 'gėlę', dgs: 'gėles', kilm: 'gėlių' })}. Kiek gėlių iš viso?`,
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `${lygybe(grupiu, grupeje)}. Ats.: ${sand}.`,
      }),

    // 6. Padidinti vienetais ar kartais
    () => {
      const n = atsitiktinis(4, 9)
      const k = atsitiktinis(2, 3)
      if (n * k > maks) return null
      return uzdavinys('daugybos-uzdaviniai', {
        klausimas: `Kiek bus, jei skaičių ${n} padidinsi ${k} ${derink(k, KARTU)}?`,
        atsakymas: String(n * k),
        atsakymasRodymui: `$${n * k}$`,
        sprendimas: `Padidinti kartais reiškia dauginti: ${lygybe(n, k)}.`,
      })
    },
  ])
}

// ── 2.12 Kaip sukurti matematinį žaidimą? ───────────────────────────────────

const A_ZAIDIMAS = [
  {
    klausimas: 'Kuri kortelė tinka prie $4 \\cdot 5$?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — 20',
    sprendimas: '$4 \\cdot 5 = 20$.',
  },
] as const

export const matematinisZaidimas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkZaidima(sritis), A_ZAIDIMAS, 'matematinis-zaidimas')

function kurkZaidima(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const poros = sumaisyk([2, 3, 4, 5])
    .slice(0, 3)
    .map((a) => ({ a, b: atsitiktinis(2, 6) }))
    .filter((p) => p.a * p.b <= maks)
  if (poros.length < 3) return null
  const [pirma] = poros
  const sand = pirma.a * pirma.b

  return variacija([
    // 1. Kuri kortelė tinka veiksmui
    () => {
      const netiesos = [...new Set([sand + pirma.a, sand - pirma.a, sand + 1])].filter(
        (x) => x > 0 && x !== sand,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('matematinis-zaidimas'), 'matematinis-zaidimas', {
        klausimas: `Kuri atsakymo kortelė tinka prie ${sandauga(pirma.a, pirma.b)}?`,
        variantai: [String(sand), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `${lygybe(pirma.a, pirma.b)}.`,
      })
    },

    // 2. Kortelių susiejimas — žaidimo esmė
    () =>
      poruUzdavinys(naujasId('matematinis-zaidimas'), 'matematinis-zaidimas', {
        klausimas: 'Sujunk kiekvieną daugybos veiksmą su jo atsakymu.',
        poros: poros.map((p) => ({
          kaire: `$${p.a} \\cdot ${p.b}$`,
          desine: String(p.a * p.b),
        })),
        sprendimas: poros.map((p) => `$${p.a} \\cdot ${p.b} = ${p.a * p.b}$`).join(', ') + '.',
      }),

    // 3. Kuri kortelė netinka grupei
    () =>
      pasirinkimoUzdavinys(naujasId('matematinis-zaidimas'), 'matematinis-zaidimas', {
        klausimas: `Kuri kortelė netinka grupei prie skaičiaus ${sand}?`,
        variantai: [
          `$${pirma.a} + ${pirma.b}$`,
          `$${pirma.a} \\cdot ${pirma.b}$`,
          `$${pirma.b} \\cdot ${pirma.a}$`,
        ],
        teisingas: 0,
        sprendimas: `Abi daugybos kortelės duoda ${sand}, o sudėtis — ${pirma.a + pirma.b}.`,
      }),

    // 4. Kiek porų sudarys žaidimas
    () =>
      uzdavinys('matematinis-zaidimas', {
        klausimas: `Žaidime yra ${poros.length} veiksmų kortelės ir tiek pat atsakymų kortelių. Kiek porų iš viso sudarysi?`,
        atsakymas: String(poros.length),
        atsakymasRodymui: `$${poros.length}$`,
        sprendimas: `Kiekvienam veiksmui yra po vieną atsakymą, tad porų bus ${poros.length}.`,
      }),

    // 5. Kokia žaidimo taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId('matematinis-zaidimas'), 'matematinis-zaidimas', {
        klausimas: 'Kokia taisyklė tinka daugybos kortelių žaidimui?',
        variantai: [
          'kortelė su veiksmu dedama prie kortelės su jo sandauga',
          'kortelės dedamos bet kokia tvarka',
          'laimi tas, kas turi daugiausia kortelių',
        ],
        teisingas: 0,
        sprendimas: 'Žaidimo tikslas — sudaryti poras, kuriose veiksmas ir jo atsakymas sutampa.',
      }),
  ])
}
