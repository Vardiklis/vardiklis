import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { stulpeliai, termometras } from './pirmoku-vaizdai'
import { laikrodis } from './vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 2 klasės temos „Termometras“, „Tyrinėju reiškinį „Laikas““ ir „Tyrinėju
 * reiškinį „Vanduo““.
 *
 * Potemės rėmėsi vyresnių klasių generatoriais: `neigiami` yra 6 klasės
 * (moduliai, veiksmai su neigiamais), `matavimo-vienetai` duodavo kilometrus
 * ir hektarus, `diagramos` — vienodus stulpelinių diagramų klausimus visose
 * trijose temose, o `dalies-radimas` — trupmenas.
 *
 * Antroje klasėje šios temos yra apie prietaiso rodmens nuskaitymą ir
 * paprastą palyginimą: kiek rodo termometras, kiek minučių trunka pusė
 * valandos, kiek vandens išgaravo. Neigiami skaičiai čia atsiranda natūraliai
 * — kaip šaltis žemiau nulio, o ne kaip veiksmai su minusais.
 */

const VARDAI = ['Matas', 'Ieva', 'Emilis', 'Kajus', 'Joris', 'Iglė', 'Greta'] as const

const LAIPSNIAI = { vns: 'laipsniu', dgs: 'laipsniais', kilm: 'laipsnių' }
const MINUCIU = { vns: 'minutę', dgs: 'minutes', kilm: 'minučių' }

// ═══ Termometras ════════════════════════════════════════════════════════════

/** Orų temperatūra Lietuvoje: nuo −10 iki 30 °C. */
function temperatura(): number {
  return atsitiktinis(-10, 30)
}

// ── Ką matuojame termometru? ────────────────────────────────────────────────

const A_TERMOMETRAS = [
  {
    klausimas: 'Ką matuojame termometru?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — temperatūrą',
    sprendimas: 'Termometras rodo, kiek šilta arba šalta.',
  },
] as const

export const kaMatuojaTermometras: Generatorius = () =>
  suBandymais(kurkTermometra, A_TERMOMETRAS, 'ka-matuoja-termometras')

function kurkTermometra(): Uzdavinys | null {
  return variacija([
    // 1. Ką matuoja termometras
    () =>
      pasirinkimoUzdavinys(naujasId('ka-matuoja-termometras'), 'ka-matuoja-termometras', {
        klausimas: 'Ką matuojame termometru?',
        variantai: ['temperatūrą', 'ilgį', 'masę'],
        teisingas: 0,
        sprendimas: 'Termometras rodo temperatūrą — kiek šilta arba šalta.',
        brezinys: termometras(18),
      }),

    // 2. Kuris prietaisas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('ka-matuoja-termometras'), 'ka-matuoja-termometras', {
        klausimas: 'Kuriuo prietaisu sužinosi, kiek šilta lauke?',
        variantai: ['termometru', 'liniuote', 'svarstyklėmis'],
        teisingas: 0,
        sprendimas: 'Liniuote matuojamas ilgis, svarstyklėmis — masė, o temperatūrą rodo termometras.',
      }),

    // 3. Kuriam klausimui reikia termometro
    () =>
      pasirinkimoUzdavinys(naujasId('ka-matuoja-termometras'), 'ka-matuoja-termometras', {
        klausimas: 'Kuriam klausimui atsakyti reikia termometro?',
        variantai: ['Kiek šilta lauke?', 'Kiek sveria obuolys?', 'Koks stalo ilgis?'],
        teisingas: 0,
        sprendimas: 'Termometras atsako tik į klausimą apie temperatūrą.',
      }),

    // 4. Kokiais vienetais matuojama
    () =>
      pasirinkimoUzdavinys(naujasId('ka-matuoja-termometras'), 'ka-matuoja-termometras', {
        klausimas: 'Kokiais vienetais matuojama temperatūra?',
        variantai: ['laipsniais (°C)', 'centimetrais (cm)', 'gramais (g)'],
        teisingas: 0,
        sprendimas: 'Temperatūra užrašoma laipsniais, pavyzdžiui, 18 °C.',
        brezinys: termometras(18),
      }),

    // 5. Ką reiškia nulis termometre
    () =>
      pasirinkimoUzdavinys(naujasId('ka-matuoja-termometras'), 'ka-matuoja-termometras', {
        klausimas: 'Ką termometre reiškia 0 °C?',
        variantai: [
          'ribą, žemiau kurios prasideda šaltis',
          'kad termometras sugedęs',
          'patį didžiausią šaltį',
        ],
        teisingas: 0,
        sprendimas: 'Aukščiau nulio rašomas šilumos, žemiau — šalčio laipsnių skaičius su minusu.',
        brezinys: termometras(0),
      }),
  ])
}

// ── Kiek šilumos ar šalčio rodo termometras? ────────────────────────────────

const A_RODMUO = [
  {
    klausimas: 'Kiek laipsnių rodo termometras?',
    atsakymas: '8',
    atsakymasRodymui: '$8$ °C',
    sprendimas: 'Stulpelio viršus stovi ties 8 padala.',
  },
] as const

export const termometroRodmuo: Generatorius = () =>
  suBandymais(kurkRodmeni, A_RODMUO, 'termometro-rodmuo')

function kurkRodmeni(): Uzdavinys | null {
  const t = temperatura()
  const kitas = temperatura()

  return variacija([
    // 1. Kiek rodo termometras
    () =>
      uzdavinys('termometro-rodmuo', {
        klausimas: 'Kiek laipsnių rodo termometras?',
        atsakymas: String(t),
        atsakymasRodymui: `$${t}$ °C`,
        sprendimas: `Stulpelio viršus stovi ties ${t} padala, tad termometras rodo ${t} °C.`,
        brezinys: termometras(t),
      }),

    // 2. Kur šilčiau
    () => {
      if (t === kitas) return null
      return pasirinkimoUzdavinys(naujasId('termometro-rodmuo'), 'termometro-rodmuo', {
        klausimas: `Vienas termometras rodo ${t} °C, kitas — ${kitas} °C. Kur šilčiau?`,
        variantai: [`${Math.max(t, kitas)} °C`, `${Math.min(t, kitas)} °C`, 'vienodai'],
        teisingas: 0,
        sprendimas: `${Math.max(t, kitas)} yra aukščiau termometro skalėje nei ${Math.min(t, kitas)}.`,
      })
    },

    // 3. Keliais laipsniais sušilo
    () => {
      const pradzia = atsitiktinis(-8, 15)
      const pokytis = atsitiktinis(2, 9)
      if (pradzia + pokytis > 30) return null
      return uzdavinys('termometro-rodmuo', {
        klausimas: `Rytą termometras rodė ${pradzia} °C, dieną — ${pradzia + pokytis} °C. Keliais laipsniais sušilo?`,
        atsakymas: String(pokytis),
        atsakymasRodymui: `$${pokytis}$ °C`,
        sprendimas: `Nuo ${pradzia} iki ${pradzia + pokytis} yra ${pokytis} ${derink(pokytis, LAIPSNIAI)}.`,
        brezinys: termometras(pradzia + pokytis),
      })
    },

    // 4. Kiek rodys atšalus — atsakymas gali būti neigiamas
    () => {
      const vakare = atsitiktinis(1, 10)
      const atsalo = atsitiktinis(2, 12)
      const naktis = vakare - atsalo
      if (naktis < -10) return null
      return uzdavinys('termometro-rodmuo', {
        klausimas: `Vakare termometras rodė ${vakare} °C. Naktį atšalo ${atsalo} ${derink(atsalo, LAIPSNIAI)}. Kokią temperatūrą rodė naktį?`,
        atsakymas: String(naktis),
        atsakymasRodymui: `$${naktis}$ °C`,
        sprendimas:
          naktis < 0
            ? `Nuo ${vakare} nusileidžiame ${atsalo} laipsnius ir peržengiame nulį: gauname ${naktis} °C — tai šaltis.`
            : `$${vakare} - ${atsalo} = ${naktis}$ °C.`,
        brezinys: termometras(naktis),
      })
    },

    // 5. Kuri temperatūra tinka veiklai
    () => {
      const scenos = [
        { kas: 'važinėti riedlente be striukės', t: 27 },
        { kas: 'slidinėti', t: -8 },
        { kas: 'lipdyti sniego senį', t: 0 },
      ]
      const s = pasirink(scenos)
      const kiti = scenos.filter((x) => x.kas !== s.kas)
      return pasirinkimoUzdavinys(naujasId('termometro-rodmuo'), 'termometro-rodmuo', {
        klausimas: `Kuri temperatūra tinka, kai norime ${s.kas}?`,
        variantai: [`${s.t} °C`, `${kiti[0].t} °C`, `${kiti[1].t} °C`],
        teisingas: 0,
        sprendimas: `${s.kas[0].toUpperCase()}${s.kas.slice(1)} tinka, kai termometras rodo ${s.t} °C.`,
      })
    },

    // 6. Kuris termometras rodo mažiau
    () => {
      const skirtumas = atsitiktinis(3, 8)
      if (t - skirtumas < -10) return null
      return uzdavinys('termometro-rodmuo', {
        klausimas: `Termometras rodo ${t} °C. Kokią temperatūrą rodytų termometras, rodantis ${skirtumas} ${derink(skirtumas, LAIPSNIAI)} mažiau?`,
        atsakymas: String(t - skirtumas),
        atsakymasRodymui: `$${t - skirtumas}$ °C`,
        sprendimas: `$${t} - ${skirtumas} = ${t - skirtumas}$ °C.`,
        brezinys: termometras(t),
      })
    },
  ])
}

// ── Kaip rinkti duomenis apie orus? ─────────────────────────────────────────

const SAVAITES_DIENOS = ['P', 'A', 'T', 'K', 'Pn', 'Š', 'S'] as const

const A_ORAI = [
  {
    klausimas: 'Kurią dieną buvo šilčiausia?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — trečiadienį',
    sprendimas: 'Šilčiausia yra ta diena, kurios rodmuo didžiausias.',
  },
] as const

export const oruDuomenys: Generatorius = () => suBandymais(kurkOrus, A_ORAI, 'oru-duomenys')

/** Penkių dienų temperatūros — skirtingos, kad klausimas turėtų vieną atsakymą. */
function oruSavaite(): { diena: string; t: number }[] | null {
  const reiksmes = sumaisyk([...Array(21).keys()].map((i) => i - 5)).slice(0, 5)
  if (new Set(reiksmes).size < 5) return null
  return SAVAITES_DIENOS.slice(0, 5).map((diena, i) => ({ diena, t: reiksmes[i] }))
}

function kurkOrus(): Uzdavinys | null {
  const savaite = oruSavaite()
  if (!savaite) return null
  const silciausia = savaite.reduce((a, b) => (b.t > a.t ? b : a))
  const salciausia = savaite.reduce((a, b) => (b.t < a.t ? b : a))
  const lentele = savaite.map((d) => `${d.diena} — ${d.t} °C`).join(', ')

  return variacija([
    // 1. Kurią dieną šilčiausia
    () =>
      pasirinkimoUzdavinys(naujasId('oru-duomenys'), 'oru-duomenys', {
        klausimas: `Savaitės temperatūros: ${lentele}. Kurią dieną buvo šilčiausia?`,
        variantai: [
          silciausia.diena,
          ...savaite.filter((d) => d.diena !== silciausia.diena).slice(0, 2).map((d) => d.diena),
        ],
        teisingas: 0,
        sprendimas: `Didžiausias rodmuo yra ${silciausia.t} °C — tai ${silciausia.diena}.`,
      }),

    // 2. Kurią dieną šalčiausia
    () =>
      pasirinkimoUzdavinys(naujasId('oru-duomenys'), 'oru-duomenys', {
        klausimas: `Savaitės temperatūros: ${lentele}. Kurią dieną buvo šalčiausia?`,
        variantai: [
          salciausia.diena,
          ...savaite.filter((d) => d.diena !== salciausia.diena).slice(0, 2).map((d) => d.diena),
        ],
        teisingas: 0,
        sprendimas: `Mažiausias rodmuo yra ${salciausia.t} °C — tai ${salciausia.diena}.`,
      }),

    // 3. Koks skirtumas tarp šilčiausios ir šalčiausios
    () =>
      uzdavinys('oru-duomenys', {
        klausimas: `Savaitės temperatūros: ${lentele}. Keliais laipsniais šilčiausia diena šiltesnė už šalčiausią?`,
        atsakymas: String(silciausia.t - salciausia.t),
        atsakymasRodymui: `$${silciausia.t - salciausia.t}$ °C`,
        sprendimas: `Nuo ${salciausia.t} iki ${silciausia.t} yra ${silciausia.t - salciausia.t} ${derink(silciausia.t - salciausia.t, LAIPSNIAI)}.`,
      }),

    // 4. Kiek dienų buvo šalčio
    () => {
      const kiek = savaite.filter((d) => d.t < 0).length
      if (kiek === 0) return null
      return uzdavinys('oru-duomenys', {
        klausimas: `Savaitės temperatūros: ${lentele}. Kiek dienų buvo šalčio (žemiau 0 °C)?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `Žemiau nulio nukrito ${kiek} ${derink(kiek, { vns: 'diena', dgs: 'dienos', kilm: 'dienų' })}.`,
      })
    },

    // 5. Kokius duomenis reikia užrašyti
    () =>
      pasirinkimoUzdavinys(naujasId('oru-duomenys'), 'oru-duomenys', {
        klausimas: 'Kokius duomenis reikia užrašyti stebint orus?',
        variantai: ['temperatūrą kiekvieną dieną', 'pieštukų skaičių', 'klasės ilgį'],
        teisingas: 0,
        sprendimas: 'Orų stebėjimo lentelėje rašoma diena ir tos dienos temperatūra.',
      }),

    // 6. Surikiuoti temperatūras
    () =>
      eiliskumoUzdavinys(naujasId('oru-duomenys'), 'oru-duomenys', {
        klausimas: 'Surikiuok savaitės temperatūras nuo šalčiausios iki šilčiausios.',
        teisingaEile: savaite
          .map((d) => d.t)
          .sort((a, b) => a - b)
          .map((t) => `${t} °C`),
        sprendimas: 'Neigiami skaičiai yra mažesni už nulį, tad jie rikiuojami pirmi.',
      }),
  ])
}

// ═══ Tyrinėju reiškinį „Laikas“ ═════════════════════════════════════════════

// ── Kaip atsirado laikrodžiai? ──────────────────────────────────────────────

const A_LAIKRODZIU_ISTORIJA = [
  {
    klausimas: 'Kuriame laikrodyje laikas matuojamas byrančiu smėliu?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — smėlio laikrodyje',
    sprendimas: 'Smėlio laikrodyje laikas matuojamas tuo, per kiek smėlis subyra.',
  },
] as const

export const laikrodziuIstorija: Generatorius = () =>
  suBandymais(kurkIstorija, A_LAIKRODZIU_ISTORIJA, 'laikrodziu-istorija')

function kurkIstorija(): Uzdavinys | null {
  return variacija([
    // 1. Kuris laikrodis matuoja smėliu
    () =>
      pasirinkimoUzdavinys(naujasId('laikrodziu-istorija'), 'laikrodziu-istorija', {
        klausimas: 'Kuriame laikrodyje laikas matuojamas byrančiu smėliu?',
        variantai: ['smėlio laikrodyje', 'saulės laikrodyje', 'mechaniniame laikrodyje'],
        teisingas: 0,
        sprendimas: 'Smėlio laikrodyje matuojama tai, per kiek laiko smėlis subyra iš vienos talpos į kitą.',
      }),

    // 2. Kuris matuoja pagal šešėlį
    () =>
      pasirinkimoUzdavinys(naujasId('laikrodziu-istorija'), 'laikrodziu-istorija', {
        klausimas: 'Kuris laikrodis rodo laiką pagal saulės šešėlį?',
        variantai: ['saulės laikrodis', 'smėlio laikrodis', 'mechaninis laikrodis'],
        teisingas: 0,
        sprendimas: 'Saulės laikrodyje laiką rodo strypelio metamas šešėlis.',
      }),

    // 3. Kurio laikrodžio veikimui reikia saulės
    () =>
      pasirinkimoUzdavinys(naujasId('laikrodziu-istorija'), 'laikrodziu-istorija', {
        klausimas: 'Kuris laikrodis naktį neveikia?',
        variantai: ['saulės', 'smėlio', 'mechaninis'],
        teisingas: 0,
        sprendimas: 'Be saulės nėra šešėlio, tad saulės laikrodis laiko neberodo.',
      }),

    // 4. Laikrodžių eiliškumas
    () =>
      eiliskumoUzdavinys(naujasId('laikrodziu-istorija'), 'laikrodziu-istorija', {
        klausimas: 'Surikiuok laikrodžius nuo seniausio iki naujausio.',
        teisingaEile: ['saulės laikrodis', 'smėlio laikrodis', 'mechaninis laikrodis'],
        sprendimas:
          'Pirmiausia laiką matuodavo pagal saulę, vėliau atsirado smėlio, o dar vėliau — mechaniniai laikrodžiai su rodyklėmis.',
      }),

    // 5. Kuris laikrodis turi rodykles
    () =>
      pasirinkimoUzdavinys(naujasId('laikrodziu-istorija'), 'laikrodziu-istorija', {
        klausimas: 'Kuris laikrodis turi rodykles?',
        variantai: ['mechaninis', 'smėlio', 'saulės'],
        teisingas: 0,
        sprendimas: 'Mechaninio laikrodžio ciferblate sukasi valandinė ir minutinė rodyklės.',
        brezinys: laikrodis(9 * 60),
      }),
  ])
}

// ── Kaip pasigaminti smėlio laikrodį? ───────────────────────────────────────

const A_SMELIO = [
  {
    klausimas: 'Ko reikia smėlio laikrodžiui pasigaminti?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — dviejų talpų ir smėlio',
    sprendimas: 'Smėlis turi byrėti iš vienos talpos į kitą.',
  },
] as const

export const smelioLaikrodis: Generatorius = () =>
  suBandymais(kurkSmelio, A_SMELIO, 'smelio-laikrodis')

function kurkSmelio(): Uzdavinys | null {
  return variacija([
    // 1. Ko reikia
    () =>
      pasirinkimoUzdavinys(naujasId('smelio-laikrodis'), 'smelio-laikrodis', {
        klausimas: 'Ko reikia smėlio laikrodžiui pasigaminti?',
        variantai: ['dviejų talpų ir smėlio', 'liniuotės ir pieštuko', 'svarstyklių'],
        teisingas: 0,
        sprendimas: 'Smėlis turi byrėti iš vienos talpos į kitą pro mažą skylutę.',
      }),

    // 2. Gaminimo žingsniai
    () =>
      eiliskumoUzdavinys(naujasId('smelio-laikrodis'), 'smelio-laikrodis', {
        klausimas: 'Sudėliok smėlio laikrodžio gaminimo žingsnius tinkama tvarka.',
        teisingaEile: [
          'paimti dvi talpas',
          'į vieną įberti smėlio',
          'talpas sujungti pro mažą skylutę',
          'išmatuoti, per kiek laiko smėlis subyra',
        ],
        sprendimas: 'Pirmiausia paruošiamos talpos ir smėlis, tik paskui matuojama.',
      }),

    // 3. Kur smėlis subyrės greičiau
    () =>
      pasirinkimoUzdavinys(naujasId('smelio-laikrodis'), 'smelio-laikrodis', {
        klausimas: 'Du smėlio laikrodžiai skiriasi skylutės dydžiu. Kuriame smėlis subyrės greičiau?',
        variantai: ['kuriame skylutė didesnė', 'kuriame skylutė mažesnė', 'abiejuose vienodai'],
        teisingas: 0,
        sprendimas: 'Pro didesnę skylutę per tą patį laiką prabyra daugiau smėlio.',
      }),

    // 4. Ką reikia stebėti lyginant
    () =>
      pasirinkimoUzdavinys(naujasId('smelio-laikrodis'), 'smelio-laikrodis', {
        klausimas: 'Ką reikia stebėti norint palyginti du smėlio laikrodžius?',
        variantai: [
          'per kiek laiko subyra smėlis',
          'kokios spalvos yra talpos',
          'kiek jie sveria',
        ],
        teisingas: 0,
        sprendimas: 'Laikrodžius lyginame pagal tai, ką jie matuoja — pagal laiką.',
      }),

    // 5. Kiek kartų apversti
    () => {
      const vienas = pasirink([2, 3, 5])
      const kiek = atsitiktinis(2, 5)
      return uzdavinys('smelio-laikrodis', {
        klausimas: `Smėlio laikrodyje smėlis subyra per ${vienas} min. Kiek minučių praeis apvertus jį ${kiek} ${derink(kiek, { vns: 'kartą', dgs: 'kartus', kilm: 'kartų' })}?`,
        atsakymas: String(vienas * kiek),
        atsakymasRodymui: `$${vienas * kiek}$ min`,
        sprendimas: `$${kiek} \\cdot ${vienas} = ${vienas * kiek}$ min.`,
      })
    },
  ])
}

// ── Ką galima nuveikti per minutę? ──────────────────────────────────────────

const A_MINUTE = [
  {
    klausimas: 'Kiek minučių sudaro vieną valandą?',
    atsakymas: '60',
    atsakymasRodymui: '$60$',
    sprendimas: '$1$ h $= 60$ min.',
  },
] as const

export const kasPerMinute: Generatorius = () => suBandymais(kurkMinute, A_MINUTE, 'kas-per-minute')

function kurkMinute(): Uzdavinys | null {
  const [v, v2] = sumaisyk([...VARDAI]).slice(0, 2)

  return variacija([
    // 1. Kiek minučių valandoje
    () =>
      uzdavinys('kas-per-minute', {
        klausimas: 'Kiek minučių sudaro vieną valandą?',
        atsakymas: '60',
        atsakymasRodymui: '$60$ min',
        sprendimas: 'Vieną valandą sudaro 60 minučių: $1$ h $= 60$ min.',
      }),

    // 2. Ką galima padaryti per minutę
    () =>
      pasirinkimoUzdavinys(naujasId('kas-per-minute'), 'kas-per-minute', {
        klausimas: 'Kurį darbą galima atlikti per mažiau nei minutę?',
        variantai: ['nusiplauti rankas', 'perskaityti visą knygą', 'nuvažiuoti į kitą miestą'],
        teisingas: 0,
        sprendimas: 'Rankas nusiplauname per kelias dešimtis sekundžių, o kiti darbai trunka daug ilgiau.',
      }),

    // 3. Kas padarė daugiau
    () => {
      const a = atsitiktinis(10, 25)
      const b = atsitiktinis(10, 25)
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId('kas-per-minute'), 'kas-per-minute', {
        klausimas: `Per minutę ${v} padarė ${a} ${derink(a, { vns: 'pritūpimą', dgs: 'pritūpimus', kilm: 'pritūpimų' })}, ${v2} — ${b}. Kas padarė daugiau?`,
        variantai: a > b ? [v, v2, 'abu po lygiai'] : [v2, v, 'abu po lygiai'],
        teisingas: 0,
        sprendimas: `${Math.max(a, b)} yra daugiau nei ${Math.min(a, b)}.`,
      })
    },

    // 4. Kiek trūksta iki valandos
    () => {
      const min = atsitiktinis(5, 55)
      return uzdavinys('kas-per-minute', {
        klausimas: `Kiek minučių reikia pridėti prie ${min} min, kad gautume valandą?`,
        atsakymas: String(60 - min),
        atsakymasRodymui: `$${60 - min}$ min`,
        sprendimas: `Valandoje 60 minučių: $60 - ${min} = ${60 - min}$ min.`,
      })
    },

    // 5. Kiek atimti iš valandos
    () => {
      const min = atsitiktinis(5, 55)
      return uzdavinys('kas-per-minute', {
        klausimas: `Kiek minučių reikia atimti iš valandos, kad gautume ${min} min?`,
        atsakymas: String(60 - min),
        atsakymasRodymui: `$${60 - min}$ min`,
        sprendimas: `$60 - ${min} = ${60 - min}$ min.`,
      })
    },

    // 6. Kiek truko trumpiau
    () => {
      const ilgiau = atsitiktinis(20, 50)
      const skirtumas = atsitiktinis(5, 15)
      if (ilgiau - skirtumas < 1) return null
      return uzdavinys('kas-per-minute', {
        klausimas: `${v} skaitė knygą ${ilgiau} minučių, o kieme žaidė ${skirtumas} ${derink(skirtumas, MINUCIU)} trumpiau. Kiek minučių ${v} žaidė kieme?`,
        atsakymas: String(ilgiau - skirtumas),
        atsakymasRodymui: `$${ilgiau - skirtumas}$ min`,
        sprendimas: `$${ilgiau} - ${skirtumas} = ${ilgiau - skirtumas}$ min.`,
      })
    },

    // 7. Palyginimas valandų ir minučių
    () => {
      const val = atsitiktinis(2, 4)
      const min = atsitiktinis(20, 50)
      return pasirinkimoUzdavinys(naujasId('kas-per-minute'), 'kas-per-minute', {
        klausimas: `Kas ilgiau: ${val} h ar ${min} min?`,
        variantai: [`${val} h`, `${min} min`, 'vienodai'],
        teisingas: 0,
        sprendimas: `${val} h yra ${val * 60} min — daugiau nei ${min} min.`,
      })
    },
  ])
}

// ── Kiek minučių trunka pusė valandos? Ketvirtis valandos? ──────────────────

const A_DALYS = [
  {
    klausimas: 'Kiek minučių trunka pusė valandos?',
    atsakymas: '30',
    atsakymasRodymui: '$30$ min',
    sprendimas: 'Pusė valandos = 30 min.',
  },
] as const

export const valandosDalys: Generatorius = () =>
  suBandymais(kurkValandosDalis, A_DALYS, 'valandos-dalys')

function kurkValandosDalis(): Uzdavinys | null {
  return variacija([
    // 1. Pusė valandos
    () =>
      uzdavinys('valandos-dalys', {
        klausimas: 'Užbaik: pusė valandos $=\\square$ min.',
        atsakymas: '30',
        atsakymasRodymui: '$30$ min',
        sprendimas: 'Valandoje 60 minučių, o pusė jų — 30: $60 : 2 = 30$.',
        brezinys: laikrodis(30),
      }),

    // 2. Ketvirtis valandos
    () =>
      uzdavinys('valandos-dalys', {
        klausimas: 'Užbaik: ketvirtis valandos $=\\square$ min.',
        atsakymas: '15',
        atsakymasRodymui: '$15$ min',
        sprendimas: 'Valandą padalijus į keturias dalis gaunama 15 minučių: $60 : 4 = 15$.',
        brezinys: laikrodis(15),
      }),

    // 3. Pasirinkimas
    () =>
      pasirinkimoUzdavinys(naujasId('valandos-dalys'), 'valandos-dalys', {
        klausimas: 'Kuris laikas lygus pusei valandos?',
        variantai: ['30 min', '20 min', '40 min'],
        teisingas: 0,
        sprendimas: 'Pusė iš 60 minučių yra 30.',
      }),

    // 4. Kelionė truko ketvirtį valandos
    () =>
      uzdavinys('valandos-dalys', {
        klausimas: 'Kelionė truko ketvirtį valandos. Kiek tai minučių?',
        atsakymas: '15',
        atsakymasRodymui: '$15$ min',
        sprendimas: 'Ketvirtis valandos yra 15 minučių.',
      }),

    // 5. Du pusvalandžiai
    () =>
      uzdavinys('valandos-dalys', {
        klausimas: 'Kiek minučių sudaro du pusvalandžiai?',
        atsakymas: '60',
        atsakymasRodymui: '$60$ min',
        sprendimas: '$30 + 30 = 60$ min — tai visa valanda.',
      }),

    // 6. Prie ketvirčio pridėti minutes
    () => {
      const pridedam = atsitiktinis(5, 20)
      return uzdavinys('valandos-dalys', {
        klausimas: `Prie ketvirčio valandos pridėk ${pridedam} min. Kiek minučių gausi?`,
        atsakymas: String(15 + pridedam),
        atsakymasRodymui: `$${15 + pridedam}$ min`,
        sprendimas: `Ketvirtis valandos yra 15 min: $15 + ${pridedam} = ${15 + pridedam}$ min.`,
      })
    },

    // 7. Iš pusvalandžio atimti ketvirtį
    () =>
      uzdavinys('valandos-dalys', {
        klausimas: 'Iš pusvalandžio atimk ketvirtį valandos. Kiek minučių liks?',
        atsakymas: '15',
        atsakymasRodymui: '$15$ min',
        sprendimas: '$30 - 15 = 15$ min.',
      }),
  ])
}

// ── Kaip nusakyti laiką minučių tikslumu? ───────────────────────────────────

const A_MINUCIU_TIKSLUMAS = [
  {
    klausimas: 'Kiek minučių rodo laikrodis, kai minutinė rodyklė rodo į 3?',
    atsakymas: '15',
    atsakymasRodymui: '$15$',
    sprendimas: 'Tarpas nuo skaičiaus iki skaičiaus žymi 5 minutes: $3 \\cdot 5 = 15$.',
  },
] as const

export const laikasMinutemis: Generatorius = () =>
  suBandymais(kurkMinuciuLaika, A_MINUCIU_TIKSLUMAS, 'laikas-minutemis')

function kurkMinuciuLaika(): Uzdavinys | null {
  const val = atsitiktinis(1, 11)
  const minZyme = atsitiktinis(1, 11)
  const min = minZyme * 5
  const laikas = val * 60 + min

  return variacija([
    // 1. Kiek minučių rodo minutinė rodyklė
    () =>
      uzdavinys('laikas-minutemis', {
        klausimas: `Minutinė rodyklė rodo į ${minZyme}. Kiek tai minučių?`,
        atsakymas: String(min),
        atsakymasRodymui: `$${min}$ min`,
        sprendimas: `Tarpas nuo skaičiaus iki skaičiaus žymi 5 minutes: $${minZyme} \\cdot 5 = ${min}$.`,
        brezinys: laikrodis(laikas),
      }),

    // 2. Kiek valandų ir minučių rodo laikrodis
    () =>
      uzdavinys('laikas-minutemis', {
        klausimas: 'Kiek minučių po pilnos valandos rodo laikrodis?',
        atsakymas: String(min),
        atsakymasRodymui: `$${min}$ min`,
        sprendimas: `Minutinė rodyklė nuėjo ${minZyme} tarpus po ${minZyme} penketą: ${min} min.`,
        brezinys: laikrodis(laikas),
      }),

    // 3. Kelinta valanda
    () =>
      uzdavinys('laikas-minutemis', {
        klausimas: 'Kelintą valandą rodo laikrodis? Parašyk tik valandų skaičių.',
        atsakymas: String(val),
        atsakymasRodymui: `$${val}$`,
        sprendimas: `Trumpoji rodyklė jau praėjo ${val}, bet dar nepasiekė ${val + 1}, tad valanda yra ${val}.`,
        brezinys: laikrodis(laikas),
      }),

    // 4. Kiek bus po kelių minučių
    () => {
      const po = pasirink([5, 10, 15, 20])
      const naujos = (min + po) % 60
      return uzdavinys('laikas-minutemis', {
        klausimas: `Laikrodis rodo ${val} val. ${min} min. Kiek minučių rodys po ${po} min?`,
        atsakymas: String(naujos),
        atsakymasRodymui: `$${naujos}$ min`,
        sprendimas:
          min + po >= 60
            ? `$${min} + ${po} = ${min + po}$, o tai daugiau nei 60 — prasideda nauja valanda ir lieka ${naujos} min.`
            : `$${min} + ${po} = ${naujos}$ min.`,
        brezinys: laikrodis(laikas),
      })
    },

    // 5. Pusė ar ketvirtis
    () => {
      if (min !== 15 && min !== 30 && min !== 45) return null
      const vardas = min === 15 ? 'ketvirtis valandos' : min === 30 ? 'pusė valandos' : 'trys ketvirčiai valandos'
      const kiti = ['ketvirtis valandos', 'pusė valandos', 'trys ketvirčiai valandos'].filter(
        (x) => x !== vardas,
      )
      return pasirinkimoUzdavinys(naujasId('laikas-minutemis'), 'laikas-minutemis', {
        klausimas: `Laikrodis rodo ${min} minutes po pilnos valandos. Kaip tai vadinama?`,
        variantai: [vardas, ...kiti],
        teisingas: 0,
        sprendimas: `${min} min yra ${vardas}.`,
        brezinys: laikrodis(laikas),
      })
    },

    // 6. Pamokos pabaiga
    () => {
      const pradzia = atsitiktinis(8, 13)
      const trukme = pasirink([35, 40, 45])
      const pertrauka = pasirink([10, 15, 20])
      const visas = trukme + pertrauka
      if (visas >= 60) return null
      return uzdavinys('laikas-minutemis', {
        klausimas: `Pamoka prasidėjo ${pradzia} val. Ji trunka ${trukme} min, o pertrauka — ${pertrauka} min. Po kiek minučių nuo pamokos pradžios prasidės kita pamoka?`,
        atsakymas: String(visas),
        atsakymasRodymui: `$${visas}$ min`,
        sprendimas: `$${trukme} + ${pertrauka} = ${visas}$ min.`,
      })
    },
  ])
}

// ── Kaip atlikti tyrimą, susijusį su laiku? ─────────────────────────────────

const A_LAIKO_TYRIMAS = [
  {
    klausimas: 'Kas užtruko trumpiausiai?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — Matas',
    sprendimas: 'Trumpiausiai užtruko tas, kurio laikas mažiausias.',
  },
] as const

export const laikoTyrimas: Generatorius = () =>
  suBandymais(kurkLaikoTyrima, A_LAIKO_TYRIMAS, 'laiko-tyrimas')

function kurkLaikoTyrima(): Uzdavinys | null {
  const vardai = sumaisyk([...VARDAI]).slice(0, 3)
  const laikai = sumaisyk([...Array(20).keys()].map((i) => i + 5)).slice(0, 3)
  if (new Set(laikai).size < 3) return null
  const duomenys = vardai.map((v, i) => ({ vardas: v, min: laikai[i] }))
  const ilgiausiai = duomenys.reduce((a, b) => (b.min > a.min ? b : a))
  const trumpiausiai = duomenys.reduce((a, b) => (b.min < a.min ? b : a))
  const sarasas = duomenys.map((d) => `${d.vardas} — ${d.min} min`).join(', ')

  return variacija([
    // 1. Kas užtruko trumpiausiai
    () =>
      pasirinkimoUzdavinys(naujasId('laiko-tyrimas'), 'laiko-tyrimas', {
        klausimas: `Vaikai tvarkėsi kuprines: ${sarasas}. Kas užtruko trumpiausiai?`,
        variantai: [
          trumpiausiai.vardas,
          ...duomenys.filter((d) => d.vardas !== trumpiausiai.vardas).map((d) => d.vardas),
        ],
        teisingas: 0,
        sprendimas: `Mažiausias laikas yra ${trumpiausiai.min} min.`,
        brezinys: stulpeliai(duomenys.map((d) => ({ vardas: d.vardas, kiek: d.min }))),
      }),

    // 2. Kas skaito ilgiausiai
    () =>
      pasirinkimoUzdavinys(naujasId('laiko-tyrimas'), 'laiko-tyrimas', {
        klausimas: `Kiek minučių per dieną vaikai skaito: ${sarasas}. Kas skaito ilgiausiai?`,
        variantai: [
          ilgiausiai.vardas,
          ...duomenys.filter((d) => d.vardas !== ilgiausiai.vardas).map((d) => d.vardas),
        ],
        teisingas: 0,
        sprendimas: `Didžiausias laikas yra ${ilgiausiai.min} min.`,
        brezinys: stulpeliai(duomenys.map((d) => ({ vardas: d.vardas, kiek: d.min }))),
      }),

    // 3. Koks skirtumas
    () =>
      uzdavinys('laiko-tyrimas', {
        klausimas: `Duomenys: ${sarasas}. Keliomis minutėmis ilgiausias laikas didesnis už trumpiausią?`,
        atsakymas: String(ilgiausiai.min - trumpiausiai.min),
        atsakymasRodymui: `$${ilgiausiai.min - trumpiausiai.min}$ min`,
        sprendimas: `$${ilgiausiai.min} - ${trumpiausiai.min} = ${ilgiausiai.min - trumpiausiai.min}$ min.`,
      }),

    // 4. Kiek iš viso
    () => {
      const suma = duomenys.reduce((s, d) => s + d.min, 0)
      return uzdavinys('laiko-tyrimas', {
        klausimas: `Duomenys: ${sarasas}. Kiek minučių jie užtruko iš viso?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$ min`,
        sprendimas: `${duomenys.map((d) => d.min).join(' + ')} = ${suma} min.`,
      })
    },

    // 5. Koks klausimas tinka tyrimui
    () =>
      pasirinkimoUzdavinys(naujasId('laiko-tyrimas'), 'laiko-tyrimas', {
        klausimas: 'Koks klausimas tinka tyrimui apie laiką?',
        variantai: [
          'Kiek laiko užtrunka susitvarkyti kuprinę?',
          'Kokios spalvos yra kuprinė?',
          'Kiek kuprinių yra klasėje?',
        ],
        teisingas: 0,
        sprendimas: 'Tyrimo apie laiką klausimas turi klausti trukmės.',
      }),
  ])
}

// ═══ Tyrinėju reiškinį „Vanduo“ ═════════════════════════════════════════════

// ── Kiek vandens sudaro ...? ────────────────────────────────────────────────

const A_VANDENS_DALIS = [
  {
    klausimas: 'Šimte gramų braškių yra 91 g vandens. Kiek gramų vandens yra 200 g braškių?',
    atsakymas: '182',
    atsakymasRodymui: '$182$ g',
    sprendimas: 'Dvigubai daugiau produkto — dvigubai daugiau vandens.',
  },
] as const

export const vandensDalis: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkVandensDali(sritis), A_VANDENS_DALIS, 'vandens-dalis')

/** Vandens kiekis šimte gramų — skaičiai iš vadovėlio lentelės. */
const PRODUKTAI = [
  { vardas: 'žirnelių', vandens: 79 },
  { vardas: 'ridikėlių', vandens: 95 },
  { vardas: 'braškių', vandens: 91 },
  { vardas: 'šviežių mėlynių', vandens: 84 },
] as const

function kurkVandensDali(sritis?: Sritis | null): Uzdavinys | null {
  const maks = sritis?.max ?? 1000
  const p = pasirink(PRODUKTAI)
  const kitas = pasirink(PRODUKTAI.filter((x) => x.vardas !== p.vardas))

  return variacija([
    // 1. Kiek vandens šimte gramų
    () =>
      uzdavinys('vandens-dalis', {
        klausimas: `Šimte gramų ${p.vardas} yra ${p.vandens} g vandens. Kiek gramų vandens yra 100 g ${p.vardas}?`,
        atsakymas: String(p.vandens),
        atsakymasRodymui: `$${p.vandens}$ g`,
        sprendimas: `Lentelėje nurodyta būtent 100 gramų: ${p.vandens} g vandens.`,
      }),

    // 2. Dvigubai daugiau produkto
    () => {
      if (p.vandens * 2 > maks) return null
      return uzdavinys('vandens-dalis', {
        klausimas: `Šimte gramų ${p.vardas} yra ${p.vandens} g vandens. Kiek gramų vandens yra 200 g ${p.vardas}?`,
        atsakymas: String(p.vandens * 2),
        atsakymasRodymui: `$${p.vandens * 2}$ g`,
        sprendimas: `200 g yra du kartus po 100 g: $${p.vandens} \\cdot 2 = ${p.vandens * 2}$ g.`,
      })
    },

    // 3. Kuriame produkte vandens daugiau
    () =>
      pasirinkimoUzdavinys(naujasId('vandens-dalis'), 'vandens-dalis', {
        klausimas: `Šimte gramų ${p.vardas} yra ${p.vandens} g vandens, o šimte gramų ${kitas.vardas} — ${kitas.vandens} g. Kuriame produkte vandens daugiau?`,
        variantai:
          p.vandens > kitas.vandens
            ? [p.vardas, kitas.vardas, 'vienodai']
            : [kitas.vardas, p.vardas, 'vienodai'],
        teisingas: 0,
        sprendimas: `${Math.max(p.vandens, kitas.vandens)} g yra daugiau nei ${Math.min(p.vandens, kitas.vandens)} g.`,
      }),

    // 4. Keliais gramais daugiau
    () => {
      if (p.vandens === kitas.vandens) return null
      return uzdavinys('vandens-dalis', {
        klausimas: `Šimte gramų ${p.vardas} yra ${p.vandens} g vandens, o šimte gramų ${kitas.vardas} — ${kitas.vandens} g. Keliais gramais skiriasi?`,
        atsakymas: String(Math.abs(p.vandens - kitas.vandens)),
        atsakymasRodymui: `$${Math.abs(p.vandens - kitas.vandens)}$ g`,
        sprendimas: `$${Math.max(p.vandens, kitas.vandens)} - ${Math.min(p.vandens, kitas.vandens)} = ${Math.abs(p.vandens - kitas.vandens)}$ g.`,
      })
    },

    // 5. Kiek dalių indo užima vanduo
    () => {
      const daliu = pasirink([4, 8, 10])
      const uzimta = atsitiktinis(1, daliu - 1)
      return uzdavinys('vandens-dalis', {
        klausimas: `Indas padalytas į ${daliu} lygias dalis, o vanduo užima ${uzimta} iš jų. Kiek dalių užima vanduo?`,
        atsakymas: String(uzimta),
        atsakymasRodymui: `$${uzimta}$`,
        sprendimas: `Iš ${daliu} dalių vanduo užima ${uzimta}.`,
      })
    },
  ])
}

// ── Kiek vandens išgaravo? ──────────────────────────────────────────────────

const A_ISGARAVO = [
  {
    klausimas: 'Inde buvo 8 l vandens, liko 5 l. Kiek litrų išgaravo?',
    atsakymas: '3',
    atsakymasRodymui: '$3$ l',
    sprendimas: '$8 - 5 = 3$ l.',
  },
] as const

export const kiekIsgaravo: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkIsgaravima(sritis), A_ISGARAVO, 'kiek-isgaravo')

function kurkIsgaravima(sritis?: Sritis | null): Uzdavinys | null {
  const maks = sritis?.max ?? 1000
  const buvo = atsitiktinis(5, 12)
  const liko = atsitiktinis(1, buvo - 1)
  const ml = atsitiktinis(2, 9) * 100
  const likoMl = atsitiktinis(1, ml / 100 - 1) * 100
  if (ml > maks) return null

  return variacija([
    // 1. Kiek litrų išgaravo
    () =>
      uzdavinys('kiek-isgaravo', {
        klausimas: `Inde buvo ${buvo} l vandens, liko ${liko} l. Kiek litrų išgaravo?`,
        atsakymas: String(buvo - liko),
        atsakymasRodymui: `$${buvo - liko}$ l`,
        sprendimas: `$${buvo} - ${liko} = ${buvo - liko}$ l.`,
      }),

    // 2. Kiek mililitrų sumažėjo
    () =>
      uzdavinys('kiek-isgaravo', {
        klausimas: `Matavimo cilindre buvo ${ml} ml vandens, po savaitės liko ${likoMl} ml. Kiek mililitrų vandens sumažėjo?`,
        atsakymas: String(ml - likoMl),
        atsakymasRodymui: `$${ml - likoMl}$ ml`,
        sprendimas: `$${ml} - ${likoMl} = ${ml - likoMl}$ ml.`,
      }),

    // 3. Kuris veiksmas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('kiek-isgaravo'), 'kiek-isgaravo', {
        klausimas: `Buvo ${buvo} l vandens, liko ${liko} l. Kuriuo veiksmu sužinosi, kiek išgaravo?`,
        variantai: [
          `$${buvo} - ${liko}$`,
          `$${buvo} + ${liko}$`,
          `$${liko} - ${buvo}$`,
        ],
        teisingas: 0,
        sprendimas: 'Iš pradinio kiekio atimame tai, kas liko.',
      }),

    // 4. Kiek liko
    () =>
      uzdavinys('kiek-isgaravo', {
        klausimas: `Inde buvo ${buvo} l vandens. Išgaravo ${buvo - liko} l. Kiek litrų liko?`,
        atsakymas: String(liko),
        atsakymasRodymui: `$${liko}$ l`,
        sprendimas: `$${buvo} - ${buvo - liko} = ${liko}$ l.`,
      }),

    // 5. Kuriame inde išgaravo daugiau
    () => {
      const kitasBuvo = atsitiktinis(5, 12)
      const kitasLiko = atsitiktinis(1, kitasBuvo - 1)
      if (kitasBuvo - kitasLiko === buvo - liko) return null
      const daugiau = buvo - liko > kitasBuvo - kitasLiko ? 'pirmame' : 'antrame'
      return pasirinkimoUzdavinys(naujasId('kiek-isgaravo'), 'kiek-isgaravo', {
        klausimas: `Pirmame inde iš ${buvo} l liko ${liko} l, antrame iš ${kitasBuvo} l liko ${kitasLiko} l. Kuriame inde išgaravo daugiau?`,
        variantai: [daugiau, daugiau === 'pirmame' ? 'antrame' : 'pirmame', 'vienodai'],
        teisingas: 0,
        sprendimas: `Pirmame išgaravo ${buvo - liko} l, antrame — ${kitasBuvo - kitasLiko} l.`,
      })
    },
  ])
}

// ── Kokia gali būti vandens temperatūra? ────────────────────────────────────

const A_VANDENS_T = [
  {
    klausimas: 'Termometras vandenyje rodo 20 °C. Kiek laipsnių rodo termometras?',
    atsakymas: '20',
    atsakymasRodymui: '$20$ °C',
    sprendimas: 'Stulpelio viršus stovi ties 20 padala.',
  },
] as const

export const vandensTemperatura: Generatorius = () =>
  suBandymais(kurkVandensT, A_VANDENS_T, 'vandens-temperatura')

function kurkVandensT(): Uzdavinys | null {
  const t = atsitiktinis(2, 28)
  const kitas = atsitiktinis(2, 28)

  return variacija([
    // 1. Kiek rodo termometras vandenyje
    () =>
      uzdavinys('vandens-temperatura', {
        klausimas: 'Termometras panardintas į vandenį. Kiek laipsnių jis rodo?',
        atsakymas: String(t),
        atsakymasRodymui: `$${t}$ °C`,
        sprendimas: `Stulpelio viršus stovi ties ${t} padala.`,
        brezinys: termometras(t),
      }),

    // 2. Kuris vanduo šiltesnis
    () => {
      if (t === kitas) return null
      return pasirinkimoUzdavinys(naujasId('vandens-temperatura'), 'vandens-temperatura', {
        klausimas: `Viename inde vanduo ${t} °C, kitame — ${kitas} °C. Kuris vanduo šiltesnis?`,
        variantai: [`${Math.max(t, kitas)} °C`, `${Math.min(t, kitas)} °C`, 'vienodai'],
        teisingas: 0,
        sprendimas: `${Math.max(t, kitas)} °C yra daugiau nei ${Math.min(t, kitas)} °C.`,
      })
    },

    // 3. Keliais laipsniais sušilo
    () => {
      const pradzia = atsitiktinis(5, 18)
      const pokytis = atsitiktinis(2, 10)
      if (pradzia + pokytis > 30) return null
      return uzdavinys('vandens-temperatura', {
        klausimas: `Vanduo buvo ${pradzia} °C, sušilo iki ${pradzia + pokytis} °C. Keliais laipsniais sušilo?`,
        atsakymas: String(pokytis),
        atsakymasRodymui: `$${pokytis}$ °C`,
        sprendimas: `$${pradzia + pokytis} - ${pradzia} = ${pokytis}$ °C.`,
        brezinys: termometras(pradzia + pokytis),
      })
    },

    // 4. Kokia temperatūra tinka
    () =>
      pasirinkimoUzdavinys(naujasId('vandens-temperatura'), 'vandens-temperatura', {
        klausimas: 'Kokia gali būti šilto vandens temperatūra?',
        variantai: ['30 °C', '−5 °C', '0 °C'],
        teisingas: 0,
        sprendimas: 'Žemiau nulio vanduo virsta ledu, o ties nuliu jis ledinis.',
      }),

    // 5. Keliais laipsniais atvėso
    () => {
      const pradzia = atsitiktinis(15, 28)
      const pokytis = atsitiktinis(3, 12)
      if (pradzia - pokytis < 1) return null
      return uzdavinys('vandens-temperatura', {
        klausimas: `Vanduo buvo ${pradzia} °C, atvėso iki ${pradzia - pokytis} °C. Keliais laipsniais atvėso?`,
        atsakymas: String(pokytis),
        atsakymasRodymui: `$${pokytis}$ °C`,
        sprendimas: `$${pradzia} - ${pradzia - pokytis} = ${pokytis}$ °C.`,
        brezinys: termometras(pradzia - pokytis),
      })
    },
  ])
}

// ── Kada vanduo tampa ledu? ─────────────────────────────────────────────────

const A_LEDAS = [
  {
    klausimas: 'Kur vanduo greičiausiai sušals?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — šaldiklyje',
    sprendimas: 'Vanduo virsta ledu, kai atšąla žemiau 0 °C.',
  },
] as const

export const vanduoIrLedas: Generatorius = () => suBandymais(kurkLeda, A_LEDAS, 'vanduo-ir-ledas')

function kurkLeda(): Uzdavinys | null {
  return variacija([
    // 1. Kur greičiausiai sušals
    () =>
      pasirinkimoUzdavinys(naujasId('vanduo-ir-ledas'), 'vanduo-ir-ledas', {
        klausimas: 'Kur vanduo greičiausiai sušals?',
        variantai: ['šaldiklyje', 'ant šilto radiatoriaus', 'saulėje'],
        teisingas: 0,
        sprendimas: 'Vanduo virsta ledu tik atšalęs žemiau 0 °C, o šaldiklyje kaip tik taip šalta.',
        brezinys: termometras(-8),
      }),

    // 2. Prie kokios temperatūros virsta ledu
    () =>
      pasirinkimoUzdavinys(naujasId('vanduo-ir-ledas'), 'vanduo-ir-ledas', {
        klausimas: 'Prie kokios temperatūros vanduo virsta ledu?',
        variantai: ['0 °C ir žemiau', '10 °C', '25 °C'],
        teisingas: 0,
        sprendimas: 'Nulis laipsnių yra riba: žemiau jos vanduo užšąla.',
        brezinys: termometras(0),
      }),

    // 3. Kuri temperatūra tinka ledui
    () => {
      const salta = atsitiktinis(-10, -1)
      const silta = atsitiktinis(5, 25)
      return pasirinkimoUzdavinys(naujasId('vanduo-ir-ledas'), 'vanduo-ir-ledas', {
        klausimas: 'Kurioje temperatūroje vanduo bus ledas?',
        variantai: [`${salta} °C`, `${silta} °C`, `${silta + 3} °C`],
        teisingas: 0,
        sprendimas: `${salta} °C yra žemiau nulio, tad vanduo užšalęs.`,
        brezinys: termometras(salta),
      })
    },

    // 4. Užbaik sakinį
    () =>
      pasirinkimoUzdavinys(naujasId('vanduo-ir-ledas'), 'vanduo-ir-ledas', {
        klausimas: 'Užbaik sakinį: „Kai vanduo labai atšąla, jis virsta …“',
        variantai: ['ledu', 'garais', 'smėliu'],
        teisingas: 0,
        sprendimas: 'Atšalęs vanduo virsta ledu, o labai įkaitęs — garais.',
      }),

    // 5. Kiek laipsnių iki užšalimo
    () => {
      const t = atsitiktinis(1, 12)
      return uzdavinys('vanduo-ir-ledas', {
        klausimas: `Vanduo yra ${t} °C. Keliais laipsniais jam reikia atšalti, kad pasiektų 0 °C?`,
        atsakymas: String(t),
        atsakymasRodymui: `$${t}$ °C`,
        sprendimas: `Nuo ${t} iki 0 yra ${t} ${derink(t, LAIPSNIAI)}.`,
        brezinys: termometras(t),
      })
    },
  ])
}

// ── Kaip apibendrinti duomenis remiantis stebėjimo lentele? ─────────────────

const A_STEBEJIMAS = [
  {
    klausimas: 'Kurią dieną vandens liko mažiausiai?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — 3 diena',
    sprendimas: 'Mažiausias lentelės skaičius rodo, kada vandens liko mažiausiai.',
  },
] as const

export const stebejimoLentele: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkStebejima(sritis), A_STEBEJIMAS, 'stebejimo-lentele')

function kurkStebejima(sritis?: Sritis | null): Uzdavinys | null {
  const maks = sritis?.max ?? 1000
  const reiksmes = sumaisyk([...Array(9).keys()].map((i) => (i + 2) * 10)).slice(0, 4)
  if (new Set(reiksmes).size < 4 || Math.max(...reiksmes) > maks) return null
  const dienos = reiksmes.map((ml, i) => ({ diena: `${i + 1} diena`, ml }))
  const daugiausia = dienos.reduce((a, b) => (b.ml > a.ml ? b : a))
  const maziausia = dienos.reduce((a, b) => (b.ml < a.ml ? b : a))
  const lentele = dienos.map((d) => `${d.diena} — ${d.ml} ml`).join(', ')

  return variacija([
    // 1. Kada liko mažiausiai
    () =>
      pasirinkimoUzdavinys(naujasId('stebejimo-lentele'), 'stebejimo-lentele', {
        klausimas: `Stebėjimo lentelė: ${lentele}. Kurią dieną vandens liko mažiausiai?`,
        variantai: [
          maziausia.diena,
          ...dienos.filter((d) => d.diena !== maziausia.diena).slice(0, 2).map((d) => d.diena),
        ],
        teisingas: 0,
        sprendimas: `Mažiausias skaičius lentelėje yra ${maziausia.ml} ml.`,
        brezinys: stulpeliai(dienos.map((d) => ({ vardas: d.diena, kiek: d.ml / 10 }))),
      }),

    // 2. Kada liko daugiausia
    () =>
      pasirinkimoUzdavinys(naujasId('stebejimo-lentele'), 'stebejimo-lentele', {
        klausimas: `Stebėjimo lentelė: ${lentele}. Kurią dieną vandens buvo daugiausia?`,
        variantai: [
          daugiausia.diena,
          ...dienos.filter((d) => d.diena !== daugiausia.diena).slice(0, 2).map((d) => d.diena),
        ],
        teisingas: 0,
        sprendimas: `Didžiausias skaičius lentelėje yra ${daugiausia.ml} ml.`,
        brezinys: stulpeliai(dienos.map((d) => ({ vardas: d.diena, kiek: d.ml / 10 }))),
      }),

    // 3. Koks skirtumas
    () =>
      uzdavinys('stebejimo-lentele', {
        klausimas: `Stebėjimo lentelė: ${lentele}. Keliais mililitrais skiriasi didžiausias ir mažiausias rodmuo?`,
        atsakymas: String(daugiausia.ml - maziausia.ml),
        atsakymasRodymui: `$${daugiausia.ml - maziausia.ml}$ ml`,
        sprendimas: `$${daugiausia.ml} - ${maziausia.ml} = ${daugiausia.ml - maziausia.ml}$ ml.`,
      }),

    // 4. Kokia išvada tinka
    () =>
      pasirinkimoUzdavinys(naujasId('stebejimo-lentele'), 'stebejimo-lentele', {
        klausimas: `Stebėjimo lentelė: ${lentele}. Kuri išvada teisinga?`,
        variantai: [
          `daugiausia vandens buvo ${daugiausia.diena}`,
          `daugiausia vandens buvo ${maziausia.diena}`,
          'visomis dienomis vandens buvo po lygiai',
        ],
        teisingas: 0,
        sprendimas: `${daugiausia.ml} ml yra didžiausias lentelės skaičius.`,
      }),

    // 5. Ką rašome į stebėjimo lentelę
    () =>
      pasirinkimoUzdavinys(naujasId('stebejimo-lentele'), 'stebejimo-lentele', {
        klausimas: 'Ką reikia rašyti į vandens stebėjimo lentelę?',
        variantai: [
          'dieną ir tą dieną likusio vandens kiekį',
          'indo spalvą',
          'stebėtojo vardą',
        ],
        teisingas: 0,
        sprendimas: 'Lentelėje fiksuojama tai, kas kinta — vandens kiekis kiekvieną dieną.',
      }),
  ])
}
