import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { D, VARDAI, kiek, sk4 } from './ketvirtokams-bendra'
import { judejimoSchema } from './ketvirtokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Kelias, laikas ir greitis“ — dešimt potemių.
 *
 * Anksčiau jos rėmėsi `greitis` generatoriumi, skirtu 7–9 klasėms: ten
 * pasitaikydavo susitikimo uždavinių, vidutinio greičio per skirtingas
 * atkarpas ir dešimtainių greičių.
 *
 * Visos potemės sukasi apie tą patį ryšį $s = v \cdot t$, tad skirtis turi ne
 * skaičiai, o tai, kuris dydis nežinomas ir kaip klausiama. Todėl atskiros
 * potemės yra „kaip rasti kelią“, „kaip rasti laiką“ ir „kaip rasti greitį“, o
 * paskutinė klausia ne rezultato, o ar jis apskritai galimas.
 */

const TRANSPORTAS = [
  { vardas: 'dviratininkas', greitis: [12, 24], vnt: 'km/h' },
  { vardas: 'automobilis', greitis: [60, 110], vnt: 'km/h' },
  { vardas: 'autobusas', greitis: [40, 80], vnt: 'km/h' },
  { vardas: 'traukinys', greitis: [80, 140], vnt: 'km/h' },
] as const

const KM = { vns: 'kilometrą', dgs: 'kilometrus', kilm: 'kilometrų' }

// ── 7.1 Kas yra kelias? ─────────────────────────────────────────────────────

const T1 = 'kas-yra-kelias'

const A_KELIAS = [
  {
    klausimas: 'Kuriuo vienetu matuojamas nuvažiuotas kelias tarp miestų?',
    atsakymas: 'km',
    atsakymasRodymui: 'km',
    sprendimas: 'Ilgus atstumus patogu matuoti kilometrais.',
  },
] as const

export const kasYraKelias: Generatorius = () => suBandymais(kurkKelia, A_KELIAS, T1)

function kurkKelia(): Uzdavinys | null {
  const vardas = pasirink(VARDAI)

  return variacija([
    // 1. Kas yra kelias
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ką matematikoje vadiname keliu?',
        variantai: [
          'atstumą, kurį įveikia judantis kūnas',
          'laiką, per kurį kūnas juda',
          'greitį, kuriuo kūnas juda',
          'kryptį, kuria kūnas juda',
        ],
        teisingas: 0,
        sprendimas: 'Kelias yra ilgis — jis matuojamas metrais arba kilometrais.',
      }),

    // 2. Vienetas keliui
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuriuo vienetu patogiausia matuoti kelią tarp dviejų miestų?',
        variantai: ['km', 'cm', 'min', 'kg'],
        teisingas: 0,
        sprendimas: 'Atstumai tarp miestų yra dešimtys ar šimtai kilometrų.',
      }),

    // 3. Kelias iš dviejų atkarpų
    () => {
      const a = atsitiktinis(12, 90)
      const b = atsitiktinis(12, 90)
      return uzdavinys(T1, {
        klausimas: 'Koks visas kelias, kurį įveikė keliautojas?',
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ km`,
        sprendimas: `Abi atkarpos sudedamos: $${a} + ${b} = ${a + b}$ km.`,
        brezinys: judejimoSchema(
          [
            { kelias: `${a} km`, dalis: a },
            { kelias: `${b} km`, dalis: b },
          ],
          'Namai',
          'Stovykla',
        ),
      })
    },

    // 4. Kiek liko nueiti
    () => {
      const visas = atsitiktinis(20, 90)
      const nueita = atsitiktinis(5, visas - 5)
      return uzdavinys(T1, {
        klausimas: `Visas kelias yra ${kiek(visas, KM)}, o ${vardas} jau nuėjo ${kiek(nueita, KM)}. Kiek kilometrų liko?`,
        atsakymas: String(visas - nueita),
        atsakymasRodymui: `$${visas - nueita}$ km`,
        sprendimas: `$${visas} - ${nueita} = ${visas - nueita}$.`,
        brezinys: judejimoSchema(
          [
            { kelias: `${nueita} km`, dalis: nueita },
            { kelias: '?', dalis: visas - nueita },
          ],
          'Pradžia',
          'Tikslas',
        ),
      })
    },

    // 5. Metrai ir kilometrai
    () => {
      const km = atsitiktinis(2, 9)
      const m = atsitiktinis(100, 900)
      return uzdavinys(T1, {
        klausimas: `${vardas} nuėjo ${km} km ir dar ${m} m. Kiek metrų iš viso nueita?`,
        atsakymas: String(km * 1000 + m),
        atsakymasRodymui: `$${sk4(km * 1000 + m)}$ m`,
        sprendimas: `${km} km yra $${sk4(km * 1000)}$ m, tad $${sk4(km * 1000)} + ${m} = ${sk4(km * 1000 + m)}$.`,
      })
    },

    // 6. Kelias pirmyn ir atgal
    () => {
      const viena = atsitiktinis(8, 60)
      return uzdavinys(T1, {
        klausimas: `Nuo namų iki mokyklos yra ${kiek(viena, KM)}. Kokį kelią ${vardas} nueina per dieną, jei eina į mokyklą ir grįžta atgal?`,
        atsakymas: String(viena * 2),
        atsakymasRodymui: `$${viena * 2}$ km`,
        sprendimas: `Kelias įveikiamas du kartus: $${viena} \\cdot 2 = ${viena * 2}$ km.`,
      })
    },

    // 7. Kuris kelias ilgesnis
    () => {
      const a = atsitiktinis(3, 20)
      const b = atsitiktinis(2000, 20000)
      if (a * 1000 === b) return null
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Kuris kelias ilgesnis: ${a} km ar $${sk4(b)}$ m?`,
        variantai:
          a * 1000 > b
            ? [`${a} km`, `$${sk4(b)}$ m`, 'keliai vienodi']
            : [`$${sk4(b)}$ m`, `${a} km`, 'keliai vienodi'],
        teisingas: 0,
        sprendimas: `${a} km yra $${sk4(a * 1000)}$ m.`,
      })
    },
  ])
}

// ── 7.2 Kas yra greitis? ────────────────────────────────────────────────────

const T2 = 'kas-yra-greitis'

const A_GREITIS = [
  {
    klausimas: 'Ką rodo greitis 60 km/h?',
    atsakymas: 'a',
    atsakymasRodymui: 'per vieną valandą nuvažiuojama 60 km',
    sprendimas: 'Greitis rodo kelią, įveikiamą per vieną laiko vienetą.',
  },
] as const

export const kasYraGreitis: Generatorius = () => suBandymais(kurkGreiti, A_GREITIS, T2)

function kurkGreiti(): Uzdavinys | null {
  const t = pasirink(TRANSPORTAS)
  const v = atsitiktinis(t.greitis[0], t.greitis[1])

  return variacija([
    // 1. Ką rodo greitis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ką rodo greitis ${v} km/h?`,
        variantai: [
          `per vieną valandą nuvažiuojama ${v} km`,
          `visas kelias yra ${v} km`,
          `kelionė trunka ${v} valandas`,
          `per vieną kilometrą sugaištama ${v} valandos`,
        ],
        teisingas: 0,
        sprendimas: 'Greitis nusako, kokį kelią kūnas įveikia per vieną laiko vienetą.',
      }),

    // 2. Kelias per vieną valandą
    () =>
      uzdavinys(T2, {
        klausimas: `${t.vardas[0].toUpperCase()}${t.vardas.slice(1)} važiuoja ${v} km/h greičiu. Kiek kilometrų jis nuvažiuoja per vieną valandą?`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$ km`,
        sprendimas: `Greitis ir yra kelias per valandą, tad ${v} km.`,
      }),

    // 3. Kuris greitesnis
    () => {
      const kitas = pasirink(TRANSPORTAS.filter((x) => x.vardas !== t.vardas))
      const v2 = atsitiktinis(kitas.greitis[0], kitas.greitis[1])
      if (v === v2) return null
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuris juda greičiau: ${t.vardas} ${v} km/h greičiu ar ${kitas.vardas} ${v2} km/h greičiu?`,
        variantai:
          v > v2
            ? [`${t.vardas} (${v} km/h)`, `${kitas.vardas} (${v2} km/h)`, 'greičiai vienodi']
            : [`${kitas.vardas} (${v2} km/h)`, `${t.vardas} (${v} km/h)`, 'greičiai vienodi'],
        teisingas: 0,
        sprendimas: 'Greitesnis tas, kurio greičio skaičius didesnis, kai vienetai tie patys.',
      })
    },

    // 4. Greitis pėsčiomis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuris greitis tinka einančiam žmogui?',
        variantai: ['5 km/h', '50 km/h', '150 km/h', '500 km/h'],
        teisingas: 0,
        sprendimas: 'Per valandą žmogus nueina apie penkis kilometrus.',
      }),

    // 5. Susieti transportą su greičiu
    () => {
      const trys = sumaisyk([
        { kaire: 'pėsčiasis', desine: '5 km/h' },
        { kaire: 'dviratininkas', desine: '18 km/h' },
        { kaire: 'automobilis', desine: '90 km/h' },
      ])
      return poruUzdavinys(naujasId(T2), T2, {
        klausimas: 'Susiek judėjimo būdą su jam būdingu greičiu.',
        poros: trys,
        sprendimas: 'Dviratis greitesnis už pėsčiąjį, o automobilis — už dviratį.',
      })
    },

    // 6. Greitis kaip kelio ir laiko santykis
    () => {
      const laikas = atsitiktinis(2, 6)
      return uzdavinys(T2, {
        klausimas: `Per ${kiek(laikas, D.valandos)} nuvažiuota ${kiek(v * laikas, KM)}. Koks buvo greitis?`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$ km/h`,
        sprendimas: `Greitis yra kelias, tenkantis vienai valandai: $${v * laikas} : ${laikas} = ${v}$.`,
      })
    },

    // 7. Ar greitis gali būti toks
    () => {
      const nerealus = atsitiktinis(400, 900)
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar dviratininko greitis gali būti ${nerealus} km/h?`,
        variantai: [
          'ne, tai daugiau nei lėktuvo greitis',
          'taip, jei jis labai stengiasi',
          'taip, jei važiuoja nuo kalno',
        ],
        teisingas: 0,
        sprendimas: `Dviratininko greitis paprastai yra 12–25 km/h, o ${nerealus} km/h būdinga lėktuvui.`,
      })
    },
  ])
}

// ── 7.3 Kelio, laiko ir greičio ryšys ───────────────────────────────────────

const T3 = 'kelias-laikas-greitis'

const A_RYSYS = [
  {
    klausimas: 'Kaip randamas kelias, kai žinomas greitis ir laikas?',
    atsakymas: 'a',
    atsakymasRodymui: 'greitis dauginamas iš laiko',
    sprendimas: '$s = v \\cdot t$.',
  },
] as const

export const keliasLaikasGreitis: Generatorius = () => suBandymais(kurkRysi, A_RYSYS, T3)

function kurkRysi(): Uzdavinys | null {
  const v = atsitiktinis(4, 90)
  const t = atsitiktinis(2, 8)

  return variacija([
    // 1. Kaip randamas kelias
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip randamas kelias, kai žinomas greitis ir laikas?',
        variantai: [
          'greitis dauginamas iš laiko',
          'greitis dalijamas iš laiko',
          'laikas dalijamas iš greičio',
          'greitis sudedamas su laiku',
        ],
        teisingas: 0,
        sprendimas: `Jei per valandą nuvažiuojama ${v} km, tai per ${t} valandas — ${t} kartus daugiau: $${v} \\cdot ${t} = ${v * t}$ km.`,
      }),

    // 2. Kaip randamas laikas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip randamas judėjimo laikas, kai žinomas kelias ir greitis?',
        variantai: [
          'kelias dalijamas iš greičio',
          'kelias dauginamas iš greičio',
          'greitis dalijamas iš kelio',
          'kelias sudedamas su greičiu',
        ],
        teisingas: 0,
        sprendimas: `$${v * t} : ${v} = ${t}$ valandos.`,
      }),

    // 3. Kaip randamas greitis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip randamas greitis, kai žinomas kelias ir laikas?',
        variantai: [
          'kelias dalijamas iš laiko',
          'kelias dauginamas iš laiko',
          'laikas dalijamas iš kelio',
          'kelias sudedamas su laiku',
        ],
        teisingas: 0,
        sprendimas: `$${v * t} : ${t} = ${v}$ km/h.`,
      }),

    // 4. Kuris dydis nežinomas
    () => {
      const kuris = pasirink(['kelias', 'laikas', 'greitis'] as const)
      const salygos: Record<typeof kuris, string> = {
        kelias: `Automobilis važiavo ${kiek(t, D.valandos)} ${v} km/h greičiu.`,
        laikas: `Automobilis ${v} km/h greičiu nuvažiavo ${kiek(v * t, KM)}.`,
        greitis: `Automobilis per ${kiek(t, D.valandos)} nuvažiavo ${kiek(v * t, KM)}.`,
      }
      const eile = sumaisyk(['kelias', 'laikas', 'greitis'] as const)
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `${salygos[kuris]} Kurio dydžio sąlygoje nėra?`,
        variantai: [...eile],
        teisingas: eile.indexOf(kuris),
        sprendimas: `Būtent jį ir reikėtų apskaičiuoti iš likusių dviejų.`,
      })
    },

    // 5. Iš dviejų dydžių — trečias
    () =>
      uzdavinys(T3, {
        klausimas: `Greitis ${v} km/h, laikas ${kiek(t, D.valandos)}. Koks kelias?`,
        atsakymas: String(v * t),
        atsakymasRodymui: `$${v * t}$ km`,
        sprendimas: `$${v} \\cdot ${t} = ${v * t}$.`,
      }),

    // 6. Kas atsitiks padvigubinus laiką
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kelias buvo ${v * t} km. Kas atsitiks keliui, jei tuo pačiu greičiu važiuosime dvigubai ilgiau?`,
        variantai: [
          `jis padvigubės ir bus ${2 * v * t} km`,
          'jis nesikeis',
          `jis sumažės perpus ir bus ${(v * t) / 2} km`,
          `jis padidės dviem kilometrais`,
        ],
        teisingas: 0,
        sprendimas: `Greitis tas pats, o laikas dvigubas: $${v} \\cdot ${2 * t} = ${2 * v * t}$ km.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: `Uždavinys: „Greitis ${v} km/h, kelias ${v * t} km. Koks laikas?“ Mokinys užrašė $${v} \\cdot ${v * t}$. Kokia turi būti atsakymo reikšmė?`,
        atsakymas: String(t),
        atsakymasRodymui: `$${t}$ val.`,
        sprendimas: `Laikas randamas dalijant: $${v * t} : ${v} = ${t}$.`,
      }),
  ])
}

// ── 7.4 Kelio skaičiavimas ──────────────────────────────────────────────────

const T4 = 'kelio-skaiciavimas'

const A_KELIO_SKAICIAVIMAS = [
  {
    klausimas: 'Dviratininkas važiavo 3 valandas 15 km/h greičiu. Kokį kelią jis nuvažiavo?',
    atsakymas: '45',
    atsakymasRodymui: '$45$ km',
    sprendimas: '$15 \\cdot 3 = 45$.',
  },
] as const

export const kelioSkaiciavimas: Generatorius = () =>
  suBandymais(kurkKelioSkaiciavima, A_KELIO_SKAICIAVIMAS, T4)

function kurkKelioSkaiciavima(): Uzdavinys | null {
  const tr = pasirink(TRANSPORTAS)
  const v = atsitiktinis(tr.greitis[0], tr.greitis[1])
  const t = atsitiktinis(2, 7)
  if (v * t > 10000) return null

  return variacija([
    // 1. Vienas žingsnis
    () =>
      uzdavinys(T4, {
        klausimas: `${tr.vardas[0].toUpperCase()}${tr.vardas.slice(1)} važiavo ${kiek(t, D.valandos)} ${v} km/h greičiu. Kokį kelią jis nuvažiavo?`,
        atsakymas: String(v * t),
        atsakymasRodymui: `$${v * t}$ km`,
        sprendimas: `$${v} \\cdot ${t} = ${v * t}$.`,
      }),

    // 2. Dvi atkarpos skirtingu greičiu
    () => {
      const v2 = atsitiktinis(tr.greitis[0], tr.greitis[1])
      const t2 = atsitiktinis(1, 4)
      if (v * t + v2 * t2 > 10000) return null
      return uzdavinys(T4, {
        klausimas: 'Kokį visą kelią nuvažiavo automobilis?',
        atsakymas: String(v * t + v2 * t2),
        atsakymasRodymui: `$${v * t + v2 * t2}$ km`,
        sprendimas: `Pirma atkarpa $${v} \\cdot ${t} = ${v * t}$ km, antra $${v2} \\cdot ${t2} = ${v2 * t2}$ km. Iš viso $${v * t + v2 * t2}$ km.`,
        brezinys: judejimoSchema([
          { kelias: '?', virsuje: `${v} km/h, ${t} val.`, dalis: v * t },
          { kelias: '?', virsuje: `${v2} km/h, ${t2} val.`, dalis: v2 * t2 },
        ]),
      })
    },

    // 3. Kelias per minutes
    () => {
      const mGreitis = atsitiktinis(40, 90)
      const min = atsitiktinis(10, 40)
      return uzdavinys(T4, {
        klausimas: `Pėsčiasis eina ${mGreitis} m/min greičiu. Kokį kelią jis nueis per ${min} minutes?`,
        atsakymas: String(mGreitis * min),
        atsakymasRodymui: `$${sk4(mGreitis * min)}$ m`,
        sprendimas: `$${mGreitis} \\cdot ${min} = ${sk4(mGreitis * min)}$.`,
      })
    },

    // 4. Kelias pirmyn ir atgal
    () =>
      uzdavinys(T4, {
        klausimas: `${tr.vardas[0].toUpperCase()}${tr.vardas.slice(1)} važiavo į tikslą ${kiek(t, D.valandos)} ${v} km/h greičiu ir tuo pačiu keliu grįžo atgal. Kokį kelią jis įveikė iš viso?`,
        atsakymas: String(2 * v * t),
        atsakymasRodymui: `$${2 * v * t}$ km`,
        sprendimas: `Į vieną pusę $${v} \\cdot ${t} = ${v * t}$ km, o iš viso dvigubai: $${2 * v * t}$ km.`,
      }),

    // 5. Kiek liko
    () => {
      const visas = v * (t + atsitiktinis(1, 3))
      if (visas > 10000) return null
      return uzdavinys(T4, {
        klausimas: `Visas kelias ${kiek(visas, KM)}. Automobilis jau važiavo ${kiek(t, D.valandos)} ${v} km/h greičiu. Kiek kilometrų liko?`,
        atsakymas: String(visas - v * t),
        atsakymasRodymui: `$${visas - v * t}$ km`,
        sprendimas: `Nuvažiuota $${v} \\cdot ${t} = ${v * t}$ km, liko $${visas} - ${v * t} = ${visas - v * t}$ km.`,
        brezinys: judejimoSchema([
          { kelias: `${v * t} km`, dalis: v * t },
          { kelias: '?', dalis: visas - v * t },
        ]),
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Uždavinys: „Greitis ${v} km/h, laikas ${kiek(t, D.valandos)}. Koks kelias?“ Mokinys užrašė $${v} + ${t}$. Užrašyk teisingą kelią.`,
        atsakymas: String(v * t),
        atsakymasRodymui: `$${v * t}$ km`,
        sprendimas: `Kelias randamas dauginant: $${v} \\cdot ${t} = ${v * t}$ km.`,
      }),

    // 7. Kuris nuvažiavo daugiau
    () => {
      const v2 = atsitiktinis(20, 90)
      const t2 = atsitiktinis(2, 7)
      if (v * t === v2 * t2 || v2 * t2 > 10000) return null
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Pirmas važiavo ${kiek(t, D.valandos)} ${v} km/h greičiu, antras — ${kiek(t2, D.valandos)} ${v2} km/h greičiu. Kuris nuvažiavo ilgesnį kelią?`,
        variantai:
          v * t > v2 * t2
            ? ['pirmas', 'antras', 'jie nuvažiavo vienodai']
            : ['antras', 'pirmas', 'jie nuvažiavo vienodai'],
        teisingas: 0,
        sprendimas: `$${v} \\cdot ${t} = ${v * t}$ km ir $${v2} \\cdot ${t2} = ${v2 * t2}$ km.`,
      })
    },
  ])
}

// ── 7.5 Judėjimo laikas ─────────────────────────────────────────────────────

const T5 = 'judejimo-laikas'

const A_LAIKAS = [
  {
    klausimas: 'Kelias 240 km, greitis 60 km/h. Per kiek valandų bus nuvažiuota?',
    atsakymas: '4',
    atsakymasRodymui: '$4$ val.',
    sprendimas: '$240 : 60 = 4$.',
  },
] as const

export const judejimoLaikas: Generatorius = () => suBandymais(kurkJudejimoLaika, A_LAIKAS, T5)

function kurkJudejimoLaika(): Uzdavinys | null {
  const tr = pasirink(TRANSPORTAS)
  const v = atsitiktinis(tr.greitis[0], tr.greitis[1])
  const t = atsitiktinis(2, 8)
  if (v * t > 10000) return null

  return variacija([
    // 1. Vienas žingsnis
    () =>
      uzdavinys(T5, {
        klausimas: `Kelias ${kiek(v * t, KM)}, greitis ${v} km/h. Per kiek valandų bus nuvažiuota?`,
        atsakymas: String(t),
        atsakymasRodymui: `$${t}$ val.`,
        sprendimas: `$${v * t} : ${v} = ${t}$.`,
      }),

    // 2. Laikas minutėmis
    () => {
      const mGreitis = atsitiktinis(50, 90)
      const min = atsitiktinis(10, 45)
      return uzdavinys(T5, {
        klausimas: `Pėsčiasis eina ${mGreitis} m/min greičiu. Per kiek minučių jis nueis ${sk4(mGreitis * min)} m?`,
        atsakymas: String(min),
        atsakymasRodymui: `$${min}$ min.`,
        sprendimas: `$${sk4(mGreitis * min)} : ${mGreitis} = ${min}$.`,
      })
    },

    // 3. Kada atvyks
    () => {
      const isvyko = atsitiktinis(7, 14)
      return uzdavinys(T5, {
        klausimas: `Traukinys išvyko ${isvyko}:00 ir važiavo ${kiek(v * t, KM)} ${v} km/h greičiu. Kelintą valandą jis atvyko?`,
        atsakymas: String(isvyko + t),
        atsakymasRodymui: `${isvyko + t}:00`,
        sprendimas: `Kelionė truko $${v * t} : ${v} = ${t}$ val., tad atvyko $${isvyko} + ${t} = ${isvyko + t}$ valandą.`,
      })
    },

    // 4. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Uždavinys: „Kelias ${v * t} km, greitis ${v} km/h. Koks laikas?“ Mokinys užrašė $${v * t} \\cdot ${v}$. Užrašyk teisingą laiką.`,
        atsakymas: String(t),
        atsakymasRodymui: `$${t}$ val.`,
        sprendimas: `Laikas randamas dalijant kelią iš greičio: $${v * t} : ${v} = ${t}$.`,
      }),

    // 5. Kas greičiau nuvyks
    () => {
      const v2 = atsitiktinis(20, 100)
      const kelias = v * t
      if (kelias % v2 !== 0 || kelias / v2 === t) return null
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Tą patį ${kelias} km kelią pirmas įveikia ${v} km/h greičiu, antras — ${v2} km/h. Kuris nuvyks greičiau?`,
        variantai:
          t < kelias / v2
            ? [`važiuojantis ${v} km/h`, `važiuojantis ${v2} km/h`, 'abu nuvyks vienu metu']
            : [`važiuojantis ${v2} km/h`, `važiuojantis ${v} km/h`, 'abu nuvyks vienu metu'],
        teisingas: 0,
        sprendimas: `$${kelias} : ${v} = ${t}$ val. ir $${kelias} : ${v2} = ${kelias / v2}$ val.`,
      })
    },

    // 6. Su poilsiu
    () => {
      const poilsis = atsitiktinis(1, 2)
      return uzdavinys(T5, {
        klausimas: `Kelionė ${kiek(v * t, KM)} ${v} km/h greičiu, o pakeliui dar ${kiek(poilsis, D.valandos)} poilsio. Kiek valandų truko visa kelionė?`,
        atsakymas: String(t + poilsis),
        atsakymasRodymui: `$${t + poilsis}$ val.`,
        sprendimas: `Važiavimas truko $${v * t} : ${v} = ${t}$ val., o su poilsiu — $${t} + ${poilsis} = ${t + poilsis}$ val.`,
      })
    },

    // 7. Ar užteks laiko
    () => {
      const turimas = t + pasirink([-1, 1])
      if (turimas <= 0) return null
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Reikia nuvažiuoti ${kiek(v * t, KM)} ${v} km/h greičiu, o laiko yra ${kiek(turimas, D.valandos)}. Ar užteks?`,
        variantai:
          turimas >= t
            ? ['taip, kelionė trunka mažiau', 'ne, kelionė trunka ilgiau', 'laiko lygiai tiek, kiek reikia']
            : ['ne, kelionė trunka ilgiau', 'taip, kelionė trunka mažiau', 'laiko lygiai tiek, kiek reikia'],
        teisingas: 0,
        sprendimas: `Kelionė trunka $${v * t} : ${v} = ${t}$ val., o turima ${turimas} val.`,
      })
    },
  ])
}

// ── 7.6 Greičio skaičiavimas ────────────────────────────────────────────────

const T6 = 'greicio-skaiciavimas'

const A_GREICIO_SKAICIAVIMAS = [
  {
    klausimas: 'Per 3 valandas nuvažiuota 180 km. Koks greitis?',
    atsakymas: '60',
    atsakymasRodymui: '$60$ km/h',
    sprendimas: '$180 : 3 = 60$.',
  },
] as const

export const greicioSkaiciavimas: Generatorius = () =>
  suBandymais(kurkGreicioSkaiciavima, A_GREICIO_SKAICIAVIMAS, T6)

function kurkGreicioSkaiciavima(): Uzdavinys | null {
  const tr = pasirink(TRANSPORTAS)
  const v = atsitiktinis(tr.greitis[0], tr.greitis[1])
  const t = atsitiktinis(2, 8)
  if (v * t > 10000) return null

  return variacija([
    // 1. Vienas žingsnis
    () =>
      uzdavinys(T6, {
        klausimas: `Per ${kiek(t, D.valandos)} nuvažiuota ${kiek(v * t, KM)}. Koks buvo greitis?`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$ km/h`,
        sprendimas: `$${v * t} : ${t} = ${v}$.`,
      }),

    // 2. Greitis metrais per minutę
    () => {
      const mGreitis = atsitiktinis(50, 90)
      const min = atsitiktinis(10, 45)
      return uzdavinys(T6, {
        klausimas: `Per ${min} minutes nueita ${sk4(mGreitis * min)} m. Koks greitis metrais per minutę?`,
        atsakymas: String(mGreitis),
        atsakymasRodymui: `$${mGreitis}$ m/min`,
        sprendimas: `$${sk4(mGreitis * min)} : ${min} = ${mGreitis}$.`,
      })
    },

    // 3. Greitis iš schemos
    () =>
      uzdavinys(T6, {
        klausimas: 'Koks buvo judėjimo greitis?',
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$ km/h`,
        sprendimas: `$${v * t} : ${t} = ${v}$ km/h.`,
        brezinys: judejimoSchema([{ kelias: `${v * t} km`, virsuje: `${t} val.`, dalis: 1 }]),
      }),

    // 4. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: `Uždavinys: „Per ${kiek(t, D.valandos)} nuvažiuota ${kiek(v * t, KM)}. Koks greitis?“ Mokinys užrašė $${v * t} \\cdot ${t}$. Užrašyk teisingą greitį.`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$ km/h`,
        sprendimas: `Greitis randamas dalijant kelią iš laiko: $${v * t} : ${t} = ${v}$.`,
      }),

    // 5. Kieno greitis didesnis
    () => {
      const kelias2 = atsitiktinis(60, 400)
      const t2 = atsitiktinis(2, 8)
      if (kelias2 % t2 !== 0 || kelias2 / t2 === v) return null
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Pirmas per ${kiek(t, D.valandos)} nuvažiavo ${v * t} km, antras per ${kiek(t2, D.valandos)} — ${kelias2} km. Kurio greitis didesnis?`,
        variantai:
          v > kelias2 / t2
            ? ['pirmo', 'antro', 'greičiai vienodi']
            : ['antro', 'pirmo', 'greičiai vienodi'],
        teisingas: 0,
        sprendimas: `$${v * t} : ${t} = ${v}$ km/h ir $${kelias2} : ${t2} = ${kelias2 / t2}$ km/h.`,
      })
    },

    // 6. Greitis pusei kelio
    () => {
      const puse = v * t
      return uzdavinys(T6, {
        klausimas: `Visas kelias ${kiek(2 * puse, KM)}, ir pusę jo automobilis įveikė per ${kiek(t, D.valandos)}. Koks buvo greitis pirmojoje pusėje?`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$ km/h`,
        sprendimas: `Pusė kelio yra $${2 * puse} : 2 = ${puse}$ km, tad greitis $${puse} : ${t} = ${v}$ km/h.`,
      })
    },

    // 7. Iš kelio ir laiko minutėmis
    () => {
      const min = pasirink([30, 45, 15, 20])
      const kelias = Math.round((v * min) / 60)
      if (kelias * 60 !== v * min) return null
      return uzdavinys(T6, {
        klausimas: `Per ${min} minutes nuvažiuota ${kiek(kelias, KM)}. Koks greitis kilometrais per valandą?`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$ km/h`,
        sprendimas: `${min} min. yra ${min / 60 === 0.5 ? 'pusė' : `${min}/60`} valandos, tad per visą valandą būtų nuvažiuota $${kelias} \\cdot ${60 / min} = ${v}$ km.`,
      })
    },
  ])
}

// ── 7.7 Vidutinis greitis ───────────────────────────────────────────────────

const T7 = 'vidutinis-greitis'

const A_VIDUTINIS = [
  {
    klausimas: 'Per 5 valandas nuvažiuota 300 km. Koks vidutinis greitis?',
    atsakymas: '60',
    atsakymasRodymui: '$60$ km/h',
    sprendimas: '$300 : 5 = 60$.',
  },
] as const

export const vidutinisGreitis: Generatorius = () => suBandymais(kurkVidutini, A_VIDUTINIS, T7)

function kurkVidutini(): Uzdavinys | null {
  const t1 = atsitiktinis(1, 4)
  const t2 = atsitiktinis(1, 4)
  const v1 = atsitiktinis(30, 90)
  const v2 = atsitiktinis(30, 90)
  const kelias = v1 * t1 + v2 * t2
  const laikas = t1 + t2
  if (kelias % laikas !== 0 || kelias > 10000) return null
  const vid = kelias / laikas

  return variacija([
    // 1. Kas yra vidutinis greitis
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kas yra vidutinis greitis?',
        variantai: [
          'visas kelias, padalytas iš viso kelionės laiko',
          'didžiausias pasiektas greitis',
          'dviejų greičių suma',
          'greitis kelionės viduryje',
        ],
        teisingas: 0,
        sprendimas: `Net jei greitis kito, vidutinis greitis rodo, kokiu pastoviu greičiu tas pats kelias būtų įveiktas per tą patį laiką.`,
      }),

    // 2. Vidutinis greitis iš dviejų atkarpų
    () =>
      uzdavinys(T7, {
        klausimas: `Pirmas ${kiek(t1, D.valandos)} važiuota ${v1} km/h greičiu, kitas ${kiek(t2, D.valandos)} — ${v2} km/h. Koks vidutinis greitis?`,
        atsakymas: String(vid),
        atsakymasRodymui: `$${vid}$ km/h`,
        sprendimas: `Visas kelias $${v1} \\cdot ${t1} + ${v2} \\cdot ${t2} = ${kelias}$ km, visas laikas ${laikas} val., tad $${kelias} : ${laikas} = ${vid}$ km/h.`,
        brezinys: judejimoSchema([
          { kelias: `${v1 * t1} km`, virsuje: `${t1} val.`, dalis: v1 * t1 },
          { kelias: `${v2 * t2} km`, virsuje: `${t2} val.`, dalis: v2 * t2 },
        ]),
      }),

    // 3. Vidutinis greitis su poilsiu
    () => {
      const poilsis = 1
      const visasLaikas = laikas + poilsis
      if (kelias % visasLaikas !== 0) return null
      return uzdavinys(T7, {
        klausimas: `Automobilis nuvažiavo ${kiek(kelias, KM)}, važiavo ${kiek(laikas, D.valandos)} ir dar ${poilsis} valandą ilsėjosi. Koks vidutinis greitis, skaičiuojant visą kelionės laiką?`,
        atsakymas: String(kelias / visasLaikas),
        atsakymasRodymui: `$${kelias / visasLaikas}$ km/h`,
        sprendimas: `Visa kelionė truko ${visasLaikas} val., tad $${kelias} : ${visasLaikas} = ${kelias / visasLaikas}$ km/h.`,
      })
    },

    // 4. Ar vidutinis greitis yra dviejų greičių vidurkis
    () => {
      const paprastas = (v1 + v2) / 2
      if (paprastas === vid || !Number.isInteger(paprastas)) return null
      return pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Pirmas ${t1} val. važiuota ${v1} km/h, kitas ${t2} val. — ${v2} km/h. Ar vidutinis greitis lygus $(${v1} + ${v2}) : 2 = ${paprastas}$ km/h?`,
        variantai: [
          `ne, vidutinis greitis yra ${vid} km/h`,
          'taip, tai dviejų greičių vidurkis',
          'taip, nes abu greičiai vienodai svarbūs',
        ],
        teisingas: 0,
        sprendimas: `Vidutinis greitis randamas visą kelią padalijus iš viso laiko: $${kelias} : ${laikas} = ${vid}$ km/h. Paprastas vidurkis tiktų tik tada, jei abiem greičiais būtų važiuota vienodą laiką.`,
      })
    },

    // 5. Kelias iš vidutinio greičio
    () => {
      const t3 = atsitiktinis(2, 6)
      if (vid * t3 > 10000) return null
      return uzdavinys(T7, {
        klausimas: `Vidutinis greitis ${vid} km/h. Kokį kelią automobilis nuvažiuos per ${kiek(t3, D.valandos)}?`,
        atsakymas: String(vid * t3),
        atsakymasRodymui: `$${vid * t3}$ km`,
        sprendimas: `$${vid} \\cdot ${t3} = ${vid * t3}$.`,
      })
    },

    // 6. Vidutinis greitis pirmyn ir atgal
    () => {
      const s = atsitiktinis(30, 120)
      const tPirmyn = atsitiktinis(1, 3)
      const tAtgal = atsitiktinis(1, 3)
      if ((2 * s) % (tPirmyn + tAtgal) !== 0) return null
      return uzdavinys(T7, {
        klausimas: `Kelias į vieną pusę ${kiek(s, KM)}. Ten važiuota ${kiek(tPirmyn, D.valandos)}, atgal — ${kiek(tAtgal, D.valandos)}. Koks vidutinis greitis visoje kelionėje?`,
        atsakymas: String((2 * s) / (tPirmyn + tAtgal)),
        atsakymasRodymui: `$${(2 * s) / (tPirmyn + tAtgal)}$ km/h`,
        sprendimas: `Visas kelias $${2 * s}$ km, visas laikas ${tPirmyn + tAtgal} val., tad $${2 * s} : ${tPirmyn + tAtgal} = ${(2 * s) / (tPirmyn + tAtgal)}$ km/h.`,
      })
    },

    // 7. Laikas iš vidutinio greičio
    () => {
      const kelias2 = vid * atsitiktinis(2, 6)
      if (kelias2 > 10000) return null
      return uzdavinys(T7, {
        klausimas: `Vidutinis greitis ${vid} km/h, visas kelias ${kiek(kelias2, KM)}. Kiek valandų truko kelionė?`,
        atsakymas: String(kelias2 / vid),
        atsakymasRodymui: `$${kelias2 / vid}$ val.`,
        sprendimas: `$${kelias2} : ${vid} = ${kelias2 / vid}$.`,
      })
    },
  ])
}

// ── 7.8 Greičio matavimo vienetai ───────────────────────────────────────────

const T8 = 'greicio-vienetai'

const A_GREICIO_VIENETAI = [
  {
    klausimas: 'Kuriuo vienetu matuojamas automobilio greitis?',
    atsakymas: 'a',
    atsakymasRodymui: 'km/h',
    sprendimas: 'Kilometrai per valandą — įprastas kelių transporto greičio vienetas.',
  },
] as const

export const greicioVienetai: Generatorius = () =>
  suBandymais(kurkGreicioVienetus, A_GREICIO_VIENETAI, T8)

function kurkGreicioVienetus(): Uzdavinys | null {
  return variacija([
    // 1. Vienetas automobiliui
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuriuo vienetu patogiausia nusakyti automobilio greitį?',
        variantai: ['km/h', 'm/min', 'm/s', 'km/min'],
        teisingas: 0,
        sprendimas: 'Automobilis per valandą nuvažiuoja dešimtis kilometrų, tad km/h duoda patogų skaičių.',
      }),

    // 2. Vienetas pėsčiajam trumpame kelyje
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuriuo vienetu patogiausia nusakyti pėsčiojo greitį einant per kiemą?',
        variantai: ['m/min', 'km/h', 'km/min', 'm/val.'],
        teisingas: 0,
        sprendimas: 'Per kiemą einama kelias minutes, tad patogu skaičiuoti metrais per minutę.',
      }),

    // 3. Ką reiškia užrašas
    () => {
      const v = atsitiktinis(40, 100)
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Ką reiškia užrašas ${v} m/min?`,
        variantai: [
          `per vieną minutę įveikiama ${v} m`,
          `per vieną metrą sugaištama ${v} min.`,
          `visas kelias yra ${v} m`,
          `kelionė trunka ${v} min.`,
        ],
        teisingas: 0,
        sprendimas: 'Brūkšnys užraše reiškia „per“: metrai per minutę.',
      })
    },

    // 4. Iš m/min į m per valandą
    () => {
      const v = atsitiktinis(40, 90)
      return uzdavinys(T8, {
        klausimas: `Pėsčiasis eina ${v} m/min greičiu. Kiek metrų jis nueis per valandą?`,
        atsakymas: String(v * 60),
        atsakymasRodymui: `$${sk4(v * 60)}$ m`,
        sprendimas: `Valandoje 60 minučių: $${v} \\cdot 60 = ${sk4(v * 60)}$ m.`,
      })
    },

    // 5. Susieti vienetą su judėjimu
    () =>
      poruUzdavinys(naujasId(T8), T8, {
        klausimas: 'Susiek judėjimą su jam tinkamu greičio vienetu.',
        poros: [
          { kaire: 'kelionė tarp miestų', desine: 'km/h' },
          { kaire: 'ėjimas mokyklos koridoriumi', desine: 'm/min' },
          { kaire: 'bėgimo varžybų startas', desine: 'm/s' },
        ],
        sprendimas: 'Kuo trumpesnis kelias ir laikas, tuo smulkesni vienetai patogesni.',
      }),

    // 6. Kuris greitis didesnis skirtingais vienetais
    () => {
      const kmh = atsitiktinis(4, 9)
      const mmin = atsitiktinis(50, 200)
      const kmhIsMmin = (mmin * 60) / 1000
      if (kmh === kmhIsMmin) return null
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Kuris greitis didesnis: ${kmh} km/h ar ${mmin} m/min?`,
        variantai:
          kmh > kmhIsMmin
            ? [`${kmh} km/h`, `${mmin} m/min`, 'greičiai vienodi']
            : [`${mmin} m/min`, `${kmh} km/h`, 'greičiai vienodi'],
        teisingas: 0,
        sprendimas: `${mmin} m/min per valandą duoda $${mmin} \\cdot 60 = ${sk4(mmin * 60)}$ m, tai yra ${kmhIsMmin} km/h.`,
      })
    },

    // 7. Klaidingas vienetas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Mokinys automobilio greitį užrašė 90 km. Kas čia ne taip?',
        variantai: [
          'trūksta laiko vieneto: turi būti 90 km/h',
          'greitis negali būti 90',
          'reikėjo rašyti 90 m',
          'nieko — taip rašyti galima',
        ],
        teisingas: 0,
        sprendimas: 'Greitis visada nusako kelią per laiko vienetą, tad vien kilometrų neužtenka.',
      }),
  ])
}

// ── 7.9 Tekstiniai judėjimo uždaviniai ──────────────────────────────────────

const T9 = 'judejimo-uzdaviniai'

const A_JUDEJIMO_UZDAVINIAI = [
  {
    klausimas: 'Automobilis 2 val. važiavo 70 km/h greičiu, paskui dar 3 val. 60 km/h greičiu. Kokį kelią nuvažiavo?',
    atsakymas: '320',
    atsakymasRodymui: '$320$ km',
    sprendimas: '$70 \\cdot 2 + 60 \\cdot 3 = 140 + 180 = 320$.',
  },
] as const

export const judejimoUzdaviniai: Generatorius = () =>
  suBandymais(kurkJudejimoUzdavini, A_JUDEJIMO_UZDAVINIAI, T9)

function kurkJudejimoUzdavini(): Uzdavinys | null {
  const vardas = pasirink(VARDAI)
  const v1 = atsitiktinis(40, 90)
  const t1 = atsitiktinis(2, 5)
  const v2 = atsitiktinis(40, 90)
  const t2 = atsitiktinis(1, 4)
  if (v1 * t1 + v2 * t2 > 10000) return null

  return variacija([
    // 1. Dvi atkarpos
    () =>
      uzdavinys(T9, {
        klausimas: `Automobilis ${kiek(t1, D.valandos)} važiavo ${v1} km/h greičiu, paskui dar ${kiek(t2, D.valandos)} ${v2} km/h greičiu. Kokį kelią jis nuvažiavo?`,
        atsakymas: String(v1 * t1 + v2 * t2),
        atsakymasRodymui: `$${v1 * t1 + v2 * t2}$ km`,
        sprendimas: `$${v1} \\cdot ${t1} = ${v1 * t1}$, $${v2} \\cdot ${t2} = ${v2 * t2}$, iš viso $${v1 * t1 + v2 * t2}$ km.`,
        brezinys: judejimoSchema([
          { kelias: '?', virsuje: `${v1} km/h, ${t1} val.`, dalis: v1 * t1 },
          { kelias: '?', virsuje: `${v2} km/h, ${t2} val.`, dalis: v2 * t2 },
        ]),
      }),

    // 2. Kiek liko ir per kiek
    () => {
      const visas = v1 * (t1 + atsitiktinis(1, 3))
      if (visas > 10000 || (visas - v1 * t1) % v1 !== 0) return null
      return uzdavinys(T9, {
        klausimas: `Visas kelias ${kiek(visas, KM)}. Automobilis ${kiek(t1, D.valandos)} važiavo ${v1} km/h greičiu. Per kiek valandų jis įveiks likusį kelią tuo pačiu greičiu?`,
        atsakymas: String((visas - v1 * t1) / v1),
        atsakymasRodymui: `$${(visas - v1 * t1) / v1}$ val.`,
        sprendimas: `Nuvažiuota $${v1 * t1}$ km, liko $${visas - v1 * t1}$ km, tad $${visas - v1 * t1} : ${v1} = ${(visas - v1 * t1) / v1}$ val.`,
      })
    },

    // 3. Du judantys objektai
    () => {
      const s = v1 * t1
      if (s % v2 !== 0) return null
      return uzdavinys(T9, {
        klausimas: `${vardas} tą patį ${kiek(s, KM)} kelią automobiliu įveikia per ${kiek(t1, D.valandos)}, o dviračiu — ${v2} km/h greičiu. Kiek valandų užtruktų dviračiu?`,
        atsakymas: String(s / v2),
        atsakymasRodymui: `$${s / v2}$ val.`,
        sprendimas: `$${s} : ${v2} = ${s / v2}$.`,
      })
    },

    // 4. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Uždavinys: „${kiek(t1, D.valandos)} važiuota ${v1} km/h, dar ${kiek(t2, D.valandos)} — ${v2} km/h. Koks kelias?“ Mokinys užrašė $(${v1} + ${v2}) \\cdot (${t1} + ${t2})$. Užrašyk teisingą kelią.`,
        atsakymas: String(v1 * t1 + v2 * t2),
        atsakymasRodymui: `$${v1 * t1 + v2 * t2}$ km`,
        sprendimas: `Kiekviena atkarpa skaičiuojama atskirai: $${v1} \\cdot ${t1} + ${v2} \\cdot ${t2} = ${v1 * t1 + v2 * t2}$ km.`,
      }),

    // 5. Vienas kelias, du būdai
    () => {
      const s = v1 * t1
      if (s % v2 !== 0 || s / v2 === t1) return null
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kelią ${kiek(s, KM)} galima įveikti ${v1} km/h arba ${v2} km/h greičiu. Kuriuo atveju sugaištama mažiau laiko?`,
        variantai:
          t1 < s / v2
            ? [`${v1} km/h greičiu`, `${v2} km/h greičiu`, 'laikas vienodas']
            : [`${v2} km/h greičiu`, `${v1} km/h greičiu`, 'laikas vienodas'],
        teisingas: 0,
        sprendimas: `$${s} : ${v1} = ${t1}$ val. ir $${s} : ${v2} = ${s / v2}$ val.`,
      })
    },

    // 6. Su sustojimu
    () => {
      const sustojimas = atsitiktinis(1, 2)
      return uzdavinys(T9, {
        klausimas: `Kelionė ${v1} km/h greičiu truko ${kiek(t1, D.valandos)}, po to buvo ${kiek(sustojimas, D.valandos)} pertrauka, o paskui dar ${kiek(t2, D.valandos)} ${v2} km/h greičiu. Kiek valandų truko visa kelionė?`,
        atsakymas: String(t1 + sustojimas + t2),
        atsakymasRodymui: `$${t1 + sustojimas + t2}$ val.`,
        sprendimas: `$${t1} + ${sustojimas} + ${t2} = ${t1 + sustojimas + t2}$. Kelias čia nereikalingas.`,
      })
    },

    // 7. Perteklinis duomuo
    () => {
      const keleiviu = atsitiktinis(20, 50)
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Sąlyga: „Autobusas važiavo ${kiek(t1, D.valandos)} ${v1} km/h greičiu ir vežė ${kiek(keleiviu, D.keleiviai)}.“ Kurio duomens nereikia nuvažiuotam keliui rasti?`,
        variantai: [`keleivių skaičius (${keleiviu})`, `greitis (${v1} km/h)`, `laikas (${t1} val.)`],
        teisingas: 0,
        sprendimas: `Kelias randamas $${v1} \\cdot ${t1} = ${v1 * t1}$ km — keleivių skaičius jam įtakos neturi.`,
      })
    },
  ])
}

// ── 7.10 Ar greitis tikroviškas ─────────────────────────────────────────────

const T10 = 'greicio-tikroviskumas'

const A_TIKROVISKUMAS = [
  {
    klausimas: 'Mokinys apskaičiavo, kad dviratininko greitis 300 km/h. Ar toks atsakymas tikroviškas?',
    atsakymas: 'a',
    atsakymasRodymui: 'ne, dviratininkas taip greitai nevažiuoja',
    sprendimas: 'Dviratininko greitis paprastai 12–25 km/h.',
  },
] as const

export const greicioTikroviskumas: Generatorius = () =>
  suBandymais(kurkTikroviskuma, A_TIKROVISKUMAS, T10)

function kurkTikroviskuma(): Uzdavinys | null {
  return variacija([
    // 1. Per didelis dviratininko greitis
    () => {
      const nerealus = atsitiktinis(200, 600)
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Mokinys apskaičiavo, kad dviratininko greitis yra ${nerealus} km/h. Ar toks atsakymas tikroviškas?`,
        variantai: [
          'ne, dviratininkas važiuoja apie 15–25 km/h',
          'taip, jei dviratis labai geras',
          'taip, jei kelias nuokalnėje',
        ],
        teisingas: 0,
        sprendimas: 'Toks greitis būdingas lėktuvui, o ne dviračiui — vadinasi, skaičiuojant padaryta klaida.',
      })
    },

    // 2. Per mažas automobilio greitis
    () => {
      const mazas = atsitiktinis(2, 6)
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Apskaičiuota, kad greitkeliu važiuojančio automobilio greitis yra ${mazas} km/h. Kas greičiausiai nutiko?`,
        variantai: [
          'skaičiuojant kelias buvo padalytas ne iš to skaičiaus',
          'automobilis tiesiog važiavo labai lėtai',
          'toks greitis greitkelyje įprastas',
        ],
        teisingas: 0,
        sprendimas: `${mazas} km/h yra lėčiau, nei eina žmogus, tad greitkelyje toks rezultatas neįmanomas.`,
      })
    },

    // 3. Įvertinti prieš skaičiuojant
    () => {
      const v = atsitiktinis(60, 100)
      const t = atsitiktinis(2, 5)
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Automobilis ${kiek(t, D.valandos)} važiavo ${v} km/h greičiu. Kuris atsakymas apie nuvažiuotą kelią tikrai neteisingas?`,
        variantai: [`${v + t} km`, `${v * t} km`, `apie ${Math.round((v * t) / 10) * 10} km`],
        teisingas: 0,
        sprendimas: `Per kelias valandas nuvažiuojama kelis kartus daugiau, nei per vieną. $${v} \\cdot ${t} = ${v * t}$ km.`,
      })
    },

    // 4. Ar galima nueiti tiek per tiek
    () => {
      const km = atsitiktinis(30, 60)
      const val = atsitiktinis(2, 4)
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Ar žmogus gali pėsčiomis nueiti ${kiek(km, KM)} per ${kiek(val, D.valandos)}?`,
        variantai: [
          `ne, tam reikėtų eiti ${Math.round(km / val)} km/h greičiu`,
          'taip, tai įprastas pėsčiojo greitis',
          'taip, jei eina labai lėtai',
        ],
        teisingas: 0,
        sprendimas: `$${km} : ${val} = ${Math.round(km / val)}$ km/h, o žmogus eina apie 5 km/h.`,
      })
    },

    // 5. Kuris atsakymas įtikimas
    () => {
      const s = atsitiktinis(120, 400)
      const t = atsitiktinis(2, 5)
      if (s % t !== 0) return null
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Automobilis ${kiek(s, KM)} nuvažiavo per ${kiek(t, D.valandos)}. Kuris greitis gautas teisingai?`,
        variantai: [`${s / t} km/h`, `${s * t} km/h`, `${s + t} km/h`],
        teisingas: 0,
        sprendimas: `Greitis randamas dalijant: $${s} : ${t} = ${s / t}$ km/h — toks greitis automobiliui įprastas.`,
      })
    },

    // 6. Patikra atvirkštiniu veiksmu
    () => {
      const v = atsitiktinis(40, 90)
      const t = atsitiktinis(2, 6)
      return uzdavinys(T10, {
        klausimas: `Apskaičiuota, kad greitis yra ${v} km/h, kai per ${kiek(t, D.valandos)} nuvažiuota ${kiek(v * t, KM)}. Patikrink: kiek kilometrų nuvažiuojama tokiu greičiu per ${kiek(t, D.valandos)}?`,
        atsakymas: String(v * t),
        atsakymasRodymui: `$${v * t}$ km`,
        sprendimas: `$${v} \\cdot ${t} = ${v * t}$ km — sutampa su sąlyga, tad greitis apskaičiuotas teisingai.`,
      })
    },

    // 7. Kuris greitis kuriam transportui
    () =>
      eiliskumoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Surikiuok pagal greitį — nuo lėčiausio iki greičiausio.',
        teisingaEile: ['pėsčiasis', 'dviratininkas', 'automobilis', 'lėktuvas'],
        sprendimas:
          'Pėsčiasis eina apie 5 km/h, dviratininkas važiuoja apie 18 km/h, automobilis — apie 90 km/h, lėktuvas skrenda apie 800 km/h. Šie dydžiai padeda patikrinti, ar apskaičiuotas greitis tikroviškas.',
      }),
  ])
}
