import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { kiek } from './ketvirtokams-bendra'
import {
  type Kryptis,
  koordinaciuTinklelis,
  krypciuTinklelis,
  ornamentoJuosta,
  pagalKryptis,
  posukioBrezinys,
} from './ketvirtokams-erdves-vaizdai'
import { postumisTinklelyje } from './treciokams-geometrija-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Konstravimas ir transformacijos“ — dvylika potemių.
 *
 * Anksčiau jos rėmėsi `koordinates`, `simetrija`, `konstravimas` ir
 * `ornamentai` generatoriais, skirtais 6–9 klasėms: pasitaikydavo neigiamų
 * koordinačių, vektorių ir posūkio matricų.
 *
 * Tema turi tris sluoksnius: vieta tinklelyje (keturios pirmosios potemės),
 * judėjimas ir komandos (keturios vidurinės) ir posūkiai su ornamentais
 * (keturios paskutinės). Visos jos remiasi tuo pačiu tinkleliu, o skiriasi
 * tuo, ko klausiama — kur objektas yra, kaip ten patekti ar kas su juo padaryta.
 */

const OBJEKTAI = ['medis', 'namas', 'tiltas', 'šulinys', 'suoliukas', 'fontanas'] as const
const ZYMES = ['M', 'N', 'T', 'Š', 'S', 'F'] as const

const KRYPCIU_VARDAI: Record<Kryptis, string> = {
  Š: 'šiaurę',
  P: 'pietus',
  R: 'rytus',
  V: 'vakarus',
}

const LANGELIAI = { vns: 'langelį', dgs: 'langelius', kilm: 'langelių' }

/** Keli objektai tinklelyje, niekada ne tame pačiame langelyje. */
function ismetykObjektus(stulpeliu: number, eiluciu: number, kiekis: number) {
  const vietos = new Set<string>()
  const rez: { x: number; y: number; zyme: string; vardas: string }[] = []
  for (let i = 0; i < kiekis; i += 1) {
    for (let b = 0; b < 30; b += 1) {
      const x = atsitiktinis(0, stulpeliu - 1)
      const y = atsitiktinis(0, eiluciu - 1)
      if (vietos.has(`${x},${y}`)) continue
      vietos.add(`${x},${y}`)
      rez.push({ x, y, zyme: ZYMES[i], vardas: OBJEKTAI[i] })
      break
    }
  }
  return rez.length === kiekis ? rez : null
}

// ── 9.1 Langelio vieta raidės ir skaičiaus pora ─────────────────────────────

const T1 = 'langelio-vieta-raide'

const A_RAIDE = [
  {
    klausimas: 'Kaip užrašoma langelio vieta, esanti trečiame stulpelyje ir antroje eilutėje?',
    atsakymas: 'c2',
    atsakymasRodymui: 'C2',
    sprendimas: 'Pirma rašoma stulpelio raidė, paskui eilutės numeris.',
  },
] as const

export const langelioVietaRaide: Generatorius = () => suBandymais(kurkRaidesVieta, A_RAIDE, T1)

function kurkRaidesVieta(): Uzdavinys | null {
  const stulpeliu = 5
  const eiluciu = 4
  const objektai = ismetykObjektus(stulpeliu, eiluciu, 3)
  if (!objektai) return null
  const o = pasirink(objektai)
  const vieta = `${String.fromCharCode(65 + o.x)}${o.y + 1}`

  return variacija([
    // 1. Kurioje vietoje objektas
    () =>
      uzdavinys(T1, {
        klausimas: `Kurioje tinklelio vietoje yra ${o.zyme}?`,
        atsakymas: vieta.toLowerCase(),
        atsakymasRodymui: vieta,
        sprendimas: `Stulpelis ${String.fromCharCode(65 + o.x)}, eilutė ${o.y + 1}, tad vieta ${vieta}.`,
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai),
      }),

    // 2. Kas yra nurodytoje vietoje
    () => kasVietoje(o, objektai, stulpeliu, eiluciu, vieta),

    // 3. Ką reiškia užrašas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Ką reiškia užrašas ${vieta}?`,
        variantai: [
          `stulpelis ${String.fromCharCode(65 + o.x)}, eilutė ${o.y + 1}`,
          `eilutė ${String.fromCharCode(65 + o.x)}, stulpelis ${o.y + 1}`,
          `${o.y + 1} langeliai į dešinę`,
          `langelio dydis`,
        ],
        teisingas: 0,
        sprendimas: 'Raidė visada nurodo stulpelį, o skaičius — eilutę.',
      }),

    // 4. Susieti raides su vietomis
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Susiek raidę su jos vieta tinklelyje.',
        poros: objektai.map((x) => ({
          kaire: x.zyme,
          desine: `${String.fromCharCode(65 + x.x)}${x.y + 1}`,
        })),
        sprendimas: 'Pirma nuskaitomas stulpelis (raidė), paskui eilutė (skaičius).',
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai),
      }),

    // 5. Langelis dešiniau
    () => {
      if (o.x + 1 >= stulpeliu) return null
      return uzdavinys(T1, {
        klausimas: `Kokia yra langelio, esančio vienu langeliu į dešinę nuo ${vieta}, vieta?`,
        atsakymas: `${String.fromCharCode(66 + o.x)}${o.y + 1}`.toLowerCase(),
        atsakymasRodymui: `${String.fromCharCode(66 + o.x)}${o.y + 1}`,
        sprendimas: 'Judant į dešinę keičiasi tik stulpelio raidė, eilutė lieka ta pati.',
      })
    },

    // 6. Kiek langelių tarp dviejų
    () => {
      const kitas = objektai.find((x) => x !== o && x.y === o.y)
      if (!kitas) return null
      return uzdavinys(T1, {
        klausimas: `Per kiek langelių viena nuo kitos nutolusios raidės ${o.zyme} ir ${kitas.zyme}?`,
        atsakymas: String(Math.abs(kitas.x - o.x)),
        atsakymasRodymui: `$${Math.abs(kitas.x - o.x)}$`,
        sprendimas: `Abi yra ${o.y + 1} eilutėje, tad skaičiuojami stulpeliai tarp jų.`,
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai),
      })
    },

    // 7. Kiek iš viso langelių
    () =>
      uzdavinys(T1, {
        klausimas: `Kiek iš viso langelių yra tinklelyje, kuriame ${stulpeliu} stulpeliai ir ${eiluciu} eilutės?`,
        atsakymas: String(stulpeliu * eiluciu),
        atsakymasRodymui: `$${stulpeliu * eiluciu}$`,
        sprendimas: `$${stulpeliu} \\cdot ${eiluciu} = ${stulpeliu * eiluciu}$.`,
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, []),
      }),
  ])
}

function kasVietoje(
  o: { zyme: string },
  objektai: readonly { zyme: string }[],
  stulpeliu: number,
  eiluciu: number,
  vieta: string,
): Uzdavinys {
  const variantai = sumaisyk(objektai.map((x) => x.zyme))
  return pasirinkimoUzdavinys(naujasId(T1), T1, {
    klausimas: `Kuri raidė pažymėta langelyje ${vieta}?`,
    variantai,
    teisingas: variantai.indexOf(o.zyme),
    sprendimas: `Randamas stulpelis ${vieta[0]}, tada eilutė ${vieta.slice(1)}.`,
    brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai as never),
  })
}

// ── 9.2 Vieta dviejų skaičių pora ───────────────────────────────────────────

const T2 = 'vieta-skaiciu-pora'

const A_PORA = [
  {
    klausimas: 'Ką reiškia užrašas (3; 2)?',
    atsakymas: 'a',
    atsakymasRodymui: 'trečias stulpelis, antra eilutė',
    sprendimas: 'Pirmasis skaičius nurodo stulpelį, antrasis — eilutę.',
  },
] as const

export const vietaSkaiciuPora: Generatorius = () => suBandymais(kurkPoraVieta, A_PORA, T2)

function kurkPoraVieta(): Uzdavinys | null {
  const stulpeliu = 5
  const eiluciu = 4
  const objektai = ismetykObjektus(stulpeliu, eiluciu, 3)
  if (!objektai) return null
  const o = pasirink(objektai)
  const pora = `(${o.x + 1}; ${o.y + 1})`

  return variacija([
    // 1. Kokia objekto pora
    () =>
      uzdavinys(T2, {
        klausimas: `Kokia skaičių pora nusakoma raidės ${o.zyme} vieta? Užrašyk pirmąjį porų skaičių.`,
        atsakymas: String(o.x + 1),
        atsakymasRodymui: pora,
        sprendimas: `Pirmasis skaičius rodo stulpelį (${o.x + 1}), antrasis — eilutę (${o.y + 1}).`,
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai, false),
      }),

    // 2. Ką reiškia pora
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ką reiškia užrašas ${pora}?`,
        variantai: [
          `${o.x + 1}-as stulpelis, ${o.y + 1}-a eilutė`,
          `${o.x + 1}-a eilutė, ${o.y + 1}-as stulpelis`,
          `${o.x + 1} langeliai į viršų`,
          `langelio plotas`,
        ],
        teisingas: 0,
        sprendimas: 'Pirmasis poros skaičius visada nurodo stulpelį.',
      }),

    // 3. Kuris objektas nurodytoje poroje
    () => {
      const variantai = sumaisyk(objektai.map((x) => x.zyme))
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuri raidė yra vietoje ${pora}?`,
        variantai,
        teisingas: variantai.indexOf(o.zyme),
        sprendimas: `Skaičiuojamas ${o.x + 1}-as stulpelis ir ${o.y + 1}-a eilutė.`,
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai, false),
      })
    },

    // 4. Antrasis poros skaičius
    () =>
      uzdavinys(T2, {
        klausimas: `Koks yra antrasis raidės ${o.zyme} vietos poros skaičius?`,
        atsakymas: String(o.y + 1),
        atsakymasRodymui: `$${o.y + 1}$`,
        sprendimas: `Antrasis skaičius rodo eilutę — čia ji ${o.y + 1}-a.`,
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai, false),
      }),

    // 5. Ar poros tvarka svarbi
    () => {
      if (o.x === o.y) return null
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar $(${o.x + 1}; ${o.y + 1})$ ir $(${o.y + 1}; ${o.x + 1})$ nurodo tą patį langelį?`,
        variantai: [
          'ne, skaičių tvarka svarbi',
          'taip, tai tie patys skaičiai',
          'taip, jei tinklelis kvadratinis',
        ],
        teisingas: 0,
        sprendimas: 'Pirmasis skaičius visada reiškia stulpelį, tad sukeitus skaičius gaunamas kitas langelis.',
      })
    },

    // 6. Pora po postūmio
    () => {
      if (o.y + 1 >= eiluciu) return null
      return uzdavinys(T2, {
        klausimas: `Objektas iš vietos ${pora} pakeliamas vienu langeliu aukštyn. Koks tampa antrasis poros skaičius?`,
        atsakymas: String(o.y + 2),
        atsakymasRodymui: `$(${o.x + 1}; ${o.y + 2})$`,
        sprendimas: 'Judant aukštyn keičiasi tik eilutės numeris.',
      })
    },

    // 7. Kiek porų galima sudaryti
    () =>
      uzdavinys(T2, {
        klausimas: `Kiek skirtingų skaičių porų galima sudaryti tinklelyje, kuriame ${stulpeliu} stulpeliai ir ${eiluciu} eilutės?`,
        atsakymas: String(stulpeliu * eiluciu),
        atsakymasRodymui: `$${stulpeliu * eiluciu}$`,
        sprendimas: `Kiekvienam iš ${stulpeliu} stulpelių yra ${eiluciu} eilutės: $${stulpeliu} \\cdot ${eiluciu} = ${stulpeliu * eiluciu}$.`,
      }),
  ])
}

// ── 9.3 Objektas pagal nurodytą vietą ───────────────────────────────────────

const T3 = 'objektas-pagal-vieta'

const A_OBJEKTAS = [
  {
    klausimas: 'Kaip randamas objektas pagal nurodytą vietą?',
    atsakymas: 'a',
    atsakymasRodymui: 'pirma randamas stulpelis, paskui eilutė',
    sprendimas: 'Vieta nusakoma dviem dydžiais, tad ieškoma jų sankirtoje.',
  },
] as const

export const objektasPagalVieta: Generatorius = () => suBandymais(kurkObjekta, A_OBJEKTAS, T3)

function kurkObjekta(): Uzdavinys | null {
  const stulpeliu = 5
  const eiluciu = 4
  const objektai = ismetykObjektus(stulpeliu, eiluciu, 4)
  if (!objektai) return null
  const o = pasirink(objektai)

  return variacija([
    // 1. Kas yra nurodytoje vietoje
    () => {
      const variantai = sumaisyk(objektai.map((x) => x.vardas))
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kuris objektas pažymėtas langelyje ${String.fromCharCode(65 + o.x)}${o.y + 1}? Raidės: ${objektai.map((x) => `${x.zyme} — ${x.vardas}`).join(', ')}.`,
        variantai,
        teisingas: variantai.indexOf(o.vardas),
        sprendimas: `Nurodytoje vietoje stovi raidė ${o.zyme}.`,
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai),
      })
    },

    // 2. Kaip ieškoma
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip randamas langelis pagal nurodytą vietą?',
        variantai: [
          'randamas nurodytas stulpelis, paskui nurodyta eilutė, ir žiūrima į jų sankirtą',
          'skaičiuojama nuo tinklelio vidurio',
          'ieškoma bet kurio langelio su ta pačia raide',
          'skaičiuojama tik eilutė',
        ],
        teisingas: 0,
        sprendimas: 'Vieta nusakoma dviem dydžiais, tad reikia abiejų.',
      }),

    // 3. Kiek objektų nurodytoje eilutėje
    () => {
      const eilute = atsitiktinis(0, eiluciu - 1)
      const kiekis = objektai.filter((x) => x.y === eilute).length
      return uzdavinys(T3, {
        klausimas: `Kiek objektų yra ${eilute + 1}-oje tinklelio eilutėje?`,
        atsakymas: String(kiekis),
        atsakymasRodymui: `$${kiekis}$`,
        sprendimas: 'Peržiūrimi visi tos eilutės langeliai.',
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai),
      })
    },

    // 4. Kuris objektas aukščiausiai
    () => {
      const aukstyn = objektai.reduce((a, b) => (a.y > b.y ? a : b))
      if (objektai.filter((x) => x.y === aukstyn.y).length > 1) return null
      const variantai = sumaisyk(objektai.map((x) => x.zyme))
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuris objektas tinklelyje yra aukščiausiai?',
        variantai,
        teisingas: variantai.indexOf(aukstyn.zyme),
        sprendimas: `Aukščiausia eilutė, kurioje yra objektas, — ${aukstyn.y + 1}-oji.`,
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai),
      })
    },

    // 5. Tuščias langelis
    () => {
      const uzimti = new Set(objektai.map((x) => `${x.x},${x.y}`))
      let laisvas: { x: number; y: number } | null = null
      for (let b = 0; b < 40 && !laisvas; b += 1) {
        const x = atsitiktinis(0, stulpeliu - 1)
        const y = atsitiktinis(0, eiluciu - 1)
        if (!uzimti.has(`${x},${y}`)) laisvas = { x, y }
      }
      if (!laisvas) return null
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kas yra langelyje ${String.fromCharCode(65 + laisvas.x)}${laisvas.y + 1}?`,
        variantai: ['langelis tuščias', ...sumaisyk(objektai.map((x) => x.zyme)).slice(0, 3)],
        teisingas: 0,
        sprendimas: 'Nurodytoje vietoje nėra nė vienos raidės.',
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai),
      })
    },

    // 6. Kiek tuščių langelių
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek tinklelio langelių yra tušti?',
        atsakymas: String(stulpeliu * eiluciu - objektai.length),
        atsakymasRodymui: `$${stulpeliu * eiluciu - objektai.length}$`,
        sprendimas: `Iš viso $${stulpeliu} \\cdot ${eiluciu} = ${stulpeliu * eiluciu}$ langelių, o užimti ${objektai.length}.`,
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai),
      }),

    // 7. Objektas tarp dviejų
    () => {
      const eilute = objektai.filter((x) => x.y === o.y)
      if (eilute.length < 2) return null
      const kitas = eilute.find((x) => x !== o)
      if (!kitas) return null
      return uzdavinys(T3, {
        klausimas: `Kiek tuščių langelių yra tarp ${o.zyme} ir ${kitas.zyme}, jei jie abu yra toje pačioje eilutėje?`,
        atsakymas: String(Math.max(0, Math.abs(kitas.x - o.x) - 1)),
        atsakymasRodymui: `$${Math.max(0, Math.abs(kitas.x - o.x) - 1)}$`,
        sprendimas: `Tarp ${o.x + 1}-o ir ${kitas.x + 1}-o stulpelių lieka ${Math.max(0, Math.abs(kitas.x - o.x) - 1)} langeliai.`,
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, objektai),
      })
    },
  ])
}

// ── 9.4 Objekto judėjimas tinklelyje ────────────────────────────────────────

const T4 = 'judejimas-tinklelyje'

const A_JUDEJIMAS = [
  {
    klausimas: 'Objektas pastumtas 3 langeliais į dešinę ir 2 aukštyn. Kiek langelių jis pajudėjo iš viso?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: '$3 + 2 = 5$.',
  },
] as const

export const judejimasTinklelyje: Generatorius = () => suBandymais(kurkJudejima, A_JUDEJIMAS, T4)

const FIGURA = [
  { x: 1, y: 1 },
  { x: 3, y: 1 },
  { x: 3, y: 3 },
  { x: 1, y: 3 },
]

function kurkJudejima(): Uzdavinys | null {
  const dx = atsitiktinis(1, 4)
  const dy = atsitiktinis(1, 3)

  return variacija([
    // 1. Kiek langelių pastumta
    () =>
      uzdavinys(T4, {
        klausimas: 'Per kiek langelių į dešinę pastumta figūra?',
        atsakymas: String(dx),
        atsakymasRodymui: `$${dx}$`,
        sprendimas: 'Skaičiuojamas rodyklės ilgis horizontalia kryptimi.',
        brezinys: postumisTinklelyje(10, 7, FIGURA, dx, 0, true),
      }),

    // 2. Iš viso langelių
    () =>
      uzdavinys(T4, {
        klausimas: `Figūra pastumta ${kiek(dx, LANGELIAI)} į dešinę ir ${kiek(dy, LANGELIAI)} žemyn. Iš kelių langelių susideda visas postūmis?`,
        atsakymas: String(dx + dy),
        atsakymasRodymui: `$${dx + dy}$`,
        sprendimas: `$${dx} + ${dy} = ${dx + dy}$.`,
        brezinys: postumisTinklelyje(10, 7, FIGURA, dx, dy, true),
      }),

    // 3. Kur atsidurs viršūnė
    () =>
      uzdavinys(T4, {
        klausimas: `Figūros viršūnė yra ${FIGURA[0].x + 1}-ame stulpelyje. Kelintame stulpelyje ji atsidurs pastūmus figūrą ${kiek(dx, LANGELIAI)} į dešinę?`,
        atsakymas: String(FIGURA[0].x + 1 + dx),
        atsakymasRodymui: `$${FIGURA[0].x + 1 + dx}$`,
        sprendimas: `$${FIGURA[0].x + 1} + ${dx} = ${FIGURA[0].x + 1 + dx}$.`,
      }),

    // 4. Ar figūra pasikeičia
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kas nutinka figūrai, kai ji pastumiama tinkleliu?',
        variantai: [
          'ji nesikeičia — pasikeičia tik jos vieta',
          'ji tampa didesnė',
          'ji pasisuka',
          'jos kraštinės pailgėja',
        ],
        teisingas: 0,
        sprendimas: 'Postūmis perkelia figūrą, bet nekeičia nei kraštinių, nei kampų.',
        brezinys: postumisTinklelyje(10, 7, FIGURA, dx, dy, true),
      }),

    // 5. Postūmis ar posūkis
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kaip vadinamas figūros perkėlimas be sukimo ir be dydžio keitimo?',
        variantai: ['postūmis', 'posūkis', 'atspindys', 'padidinimas'],
        teisingas: 0,
        sprendimas: 'Postūmis perkelia kiekvieną figūros tašką ta pačia kryptimi ir per tą patį atstumą.',
      }),

    // 6. Atvirkštinis postūmis
    () =>
      uzdavinys(T4, {
        klausimas: `Figūra pastumta ${kiek(dx, LANGELIAI)} į dešinę. Per kiek langelių ir kuria kryptimi ją reikia pastumti, kad grįžtų atgal? Užrašyk langelių skaičių.`,
        atsakymas: String(dx),
        atsakymasRodymui: `$${dx}$ į kairę`,
        sprendimas: 'Atgal grįžtama tokiu pat postūmiu priešinga kryptimi.',
      }),

    // 7. Du postūmiai iš eilės
    () => {
      const dx2 = atsitiktinis(1, 3)
      return uzdavinys(T4, {
        klausimas: `Figūra pastumta ${kiek(dx, LANGELIAI)} į dešinę, paskui dar ${kiek(dx2, LANGELIAI)} į dešinę. Kokiu vienu postūmiu tai galima pakeisti?`,
        atsakymas: String(dx + dx2),
        atsakymasRodymui: `$${dx + dx2}$ langeliais į dešinę`,
        sprendimas: `$${dx} + ${dx2} = ${dx + dx2}$.`,
      })
    },
  ])
}

// ── 9.5 Judėjimas pasaulio kryptimis ────────────────────────────────────────

const T5 = 'pasaulio-kryptys'

const A_KRYPTYS = [
  {
    klausimas: 'Kuria kryptimi judama, kai einama į viršų žemėlapyje?',
    atsakymas: 'a',
    atsakymasRodymui: 'į šiaurę',
    sprendimas: 'Žemėlapyje viršus yra šiaurė.',
  },
] as const

export const pasaulioKryptys: Generatorius = () => suBandymais(kurkKryptis, A_KRYPTYS, T5)

function kurkKryptis(): Uzdavinys | null {
  const stulpeliu = 6
  const eiluciu = 5
  const objektai = ismetykObjektus(stulpeliu, eiluciu, 2)
  if (!objektai) return null
  const [nuo, iki] = objektai

  return variacija([
    // 1. Kur atsidursi
    () => {
      const zingsniai: { kryptis: Kryptis; kiek: number }[] = [
        { kryptis: pasirink(['R', 'V'] as const), kiek: atsitiktinis(1, 3) },
        { kryptis: pasirink(['Š', 'P'] as const), kiek: atsitiktinis(1, 2) },
      ]
      const galas = pagalKryptis(nuo, zingsniai)
      if (galas.x < 0 || galas.x >= stulpeliu || galas.y < 0 || galas.y >= eiluciu) return null
      return uzdavinys(T5, {
        klausimas: `Nuo ${nuo.zyme} nueita ${kiek(zingsniai[0].kiek, LANGELIAI)} į ${KRYPCIU_VARDAI[zingsniai[0].kryptis]} ir ${kiek(zingsniai[1].kiek, LANGELIAI)} į ${KRYPCIU_VARDAI[zingsniai[1].kryptis]}. Kelintame stulpelyje atsidursi?`,
        atsakymas: String(galas.x + 1),
        atsakymasRodymui: `$${galas.x + 1}$-ame stulpelyje, ${galas.y + 1}-oje eilutėje`,
        sprendimas: `Į rytus — dešinėn, į vakarus — kairėn, į šiaurę — aukštyn, į pietus — žemyn.`,
        brezinys: krypciuTinklelis(stulpeliu, eiluciu, objektai),
      })
    },

    // 2. Kuri kryptis yra viršus
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuri kryptis žemėlapyje yra viršuje?',
        variantai: ['šiaurė', 'pietūs', 'rytai', 'vakarai'],
        teisingas: 0,
        sprendimas: 'Krypčių rožėje rodyklė aukštyn visada rodo šiaurę.',
      }),

    // 3. Kuria kryptimi nuo vieno iki kito
    () => {
      if (nuo.x === iki.x || nuo.y !== iki.y) return null
      const kryptis: Kryptis = iki.x > nuo.x ? 'R' : 'V'
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kuria kryptimi reikia eiti nuo ${nuo.zyme} iki ${iki.zyme}?`,
        variantai: [KRYPCIU_VARDAI[kryptis], KRYPCIU_VARDAI[kryptis === 'R' ? 'V' : 'R'], 'į šiaurę', 'į pietus'],
        teisingas: 0,
        sprendimas: `Abu objektai yra toje pačioje eilutėje, tad judama tik ${KRYPCIU_VARDAI[kryptis]}.`,
        brezinys: krypciuTinklelis(stulpeliu, eiluciu, objektai),
      })
    },

    // 4. Kiek langelių kuria kryptimi
    () =>
      uzdavinys(T5, {
        klausimas: `Per kiek langelių į rytus ar į vakarus nutolęs ${iki.zyme} nuo ${nuo.zyme}?`,
        atsakymas: String(Math.abs(iki.x - nuo.x)),
        atsakymasRodymui: `$${Math.abs(iki.x - nuo.x)}$`,
        sprendimas: `Skaičiuojami stulpeliai tarp objektų: ${Math.abs(iki.x - nuo.x)}.`,
        brezinys: krypciuTinklelis(stulpeliu, eiluciu, objektai),
      }),

    // 5. Priešinga kryptis
    () => {
      const k = pasirink(['Š', 'P', 'R', 'V'] as const)
      const pries: Record<Kryptis, Kryptis> = { Š: 'P', P: 'Š', R: 'V', V: 'R' }
      const variantai = sumaisyk(['Š', 'P', 'R', 'V'] as Kryptis[])
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kuri kryptis priešinga ${KRYPCIU_VARDAI[k]}?`,
        variantai: variantai.map((x) => KRYPCIU_VARDAI[x]),
        teisingas: variantai.indexOf(pries[k]),
        sprendimas: 'Šiaurė priešinga pietums, o rytai — vakarams.',
      })
    },

    // 6. Grįžti atgal
    () => {
      const zingsniu = atsitiktinis(2, 4)
      const k = pasirink(['Š', 'P', 'R', 'V'] as const)
      const pries: Record<Kryptis, string> = { Š: 'pietus', P: 'šiaurę', R: 'vakarus', V: 'rytus' }
      return uzdavinys(T5, {
        klausimas: `Nuėjus ${kiek(zingsniu, LANGELIAI)} į ${KRYPCIU_VARDAI[k]}, kiek langelių ir kuria kryptimi reikia eiti norint grįžti? Užrašyk langelių skaičių.`,
        atsakymas: String(zingsniu),
        atsakymasRodymui: `$${zingsniu}$ į ${pries[k]}`,
        sprendimas: `Grįžtama tiek pat langelių priešinga kryptimi — į ${pries[k]}.`,
      })
    },

    // 7. Trumpiausias kelias
    () => {
      const dx = Math.abs(iki.x - nuo.x)
      const dy = Math.abs(iki.y - nuo.y)
      if (dx + dy === 0) return null
      return uzdavinys(T5, {
        klausimas: `Kiek mažiausiai langelių reikia pereiti nuo ${nuo.zyme} iki ${iki.zyme}, judant tik šiaurės, pietų, rytų ir vakarų kryptimis?`,
        atsakymas: String(dx + dy),
        atsakymasRodymui: `$${dx + dy}$`,
        sprendimas: `${dx} langeliai horizontaliai ir ${dy} vertikaliai: $${dx} + ${dy} = ${dx + dy}$.`,
        brezinys: krypciuTinklelis(stulpeliu, eiluciu, objektai),
      })
    },
  ])
}

// ── 9.6 Objekto perkėlimas pagal komandų seką ───────────────────────────────

const T6 = 'komandu-seka'

const A_KOMANDOS = [
  {
    klausimas: 'Komandos: 2 į dešinę, 3 aukštyn. Kiek komandų reikėtų grįžti atgal?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Tiek pat žingsnių priešingomis kryptimis.',
  },
] as const

export const komanduSeka: Generatorius = () => suBandymais(kurkKomandas, A_KOMANDOS, T6)

function kurkKomandas(): Uzdavinys | null {
  const stulpeliu = 6
  const eiluciu = 5
  const startas = { x: atsitiktinis(0, 2), y: atsitiktinis(0, 2) }
  const desinen = atsitiktinis(1, 3)
  const aukstyn = atsitiktinis(1, 2)
  const galas = { x: startas.x + desinen, y: startas.y + aukstyn }
  if (galas.x >= stulpeliu || galas.y >= eiluciu) return null

  return variacija([
    // 1. Kur atsidurs
    () =>
      uzdavinys(T6, {
        klausimas: `Objektas stovi langelyje ${String.fromCharCode(65 + startas.x)}${startas.y + 1}. Komandos: ${desinen} į dešinę, ${aukstyn} aukštyn. Kokioje vietoje jis atsidurs?`,
        atsakymas: `${String.fromCharCode(65 + galas.x)}${galas.y + 1}`.toLowerCase(),
        atsakymasRodymui: `${String.fromCharCode(65 + galas.x)}${galas.y + 1}`,
        sprendimas: `Stulpelis pasislenka ${desinen}, eilutė — ${aukstyn}.`,
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, [
          { x: startas.x, y: startas.y, zyme: 'A' },
        ]),
      }),

    // 2. Kiek komandų iš viso
    () =>
      uzdavinys(T6, {
        klausimas: `Objektas pastumtas ${desinen} langeliais į dešinę ir ${aukstyn} aukštyn. Kiek vieno langelio komandų iš viso atlikta?`,
        atsakymas: String(desinen + aukstyn),
        atsakymasRodymui: `$${desinen + aukstyn}$`,
        sprendimas: `$${desinen} + ${aukstyn} = ${desinen + aukstyn}$.`,
      }),

    // 3. Kokių komandų reikia
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Objektas yra ${String.fromCharCode(65 + startas.x)}${startas.y + 1}, o reikia patekti į ${String.fromCharCode(65 + galas.x)}${galas.y + 1}. Kurios komandos tinka?`,
        variantai: [
          `${desinen} į dešinę, ${aukstyn} aukštyn`,
          `${aukstyn} į dešinę, ${desinen} aukštyn`,
          `${desinen} į kairę, ${aukstyn} žemyn`,
          `${desinen + aukstyn} į dešinę`,
        ],
        teisingas: 0,
        sprendimas: 'Palyginami stulpelių ir eilučių numeriai prieš ir po perkėlimo.',
        brezinys: koordinaciuTinklelis(stulpeliu, eiluciu, [
          { x: startas.x, y: startas.y, zyme: 'A' },
          { x: galas.x, y: galas.y, zyme: 'B' },
        ]),
      }),

    // 4. Grįžti atgal
    () =>
      uzdavinys(T6, {
        klausimas: `Atlikus komandas „${desinen} į dešinę, ${aukstyn} aukštyn“, kiek vieno langelio komandų reikia grįžti į pradžią?`,
        atsakymas: String(desinen + aukstyn),
        atsakymasRodymui: `$${desinen + aukstyn}$`,
        sprendimas: 'Tiek pat žingsnių, tik priešingomis kryptimis.',
      }),

    // 5. Ar tvarka svarbi
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Ar rezultatas pasikeis, jei komandas „${desinen} į dešinę“ ir „${aukstyn} aukštyn“ atliktume kita tvarka?`,
        variantai: [
          'ne, objektas atsidurs toje pačioje vietoje',
          'taip, objektas atsidurs kitur',
          'taip, jei tinklelis nekvadratinis',
        ],
        teisingas: 0,
        sprendimas: 'Postūmiai į dešinę ir aukštyn nepriklauso vienas nuo kito, tad tvarka rezultato nekeičia.',
      }),

    // 6. Trūkstama komanda
    () =>
      uzdavinys(T6, {
        klausimas: `Objektas iš ${String.fromCharCode(65 + startas.x)}${startas.y + 1} pateko į ${String.fromCharCode(65 + galas.x)}${galas.y + 1}. Pirmoji komanda buvo „${desinen} į dešinę“. Kokia buvo antroji? Užrašyk langelių skaičių.`,
        atsakymas: String(aukstyn),
        atsakymasRodymui: `$${aukstyn}$ aukštyn`,
        sprendimas: `Eilutė pasikeitė nuo ${startas.y + 1} iki ${galas.y + 1}, tad ${aukstyn}.`,
      }),

    // 7. Kelias su kliūtimi
    () => {
      const ilgis = desinen + aukstyn + 2
      return uzdavinys(T6, {
        klausimas: `Trumpiausias kelias iš ${String.fromCharCode(65 + startas.x)}${startas.y + 1} į ${String.fromCharCode(65 + galas.x)}${galas.y + 1} yra ${desinen + aukstyn} langeliai, bet dėl kliūties tenka eiti ${ilgis} langelius. Keliais langeliais kelias ilgesnis?`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: `$${ilgis} - ${desinen + aukstyn} = 2$.`,
      })
    },
  ])
}

// ── 9.7 Ornamentas languotame popieriuje ────────────────────────────────────

const T7 = 'ornamento-apibudinimas'

const A_ORNAMENTAS = [
  {
    klausimas: 'Ornamente kartojasi 3 elementų grupė. Kiek kartų ji pasikartos 12 elementų juostoje?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: '$12 : 3 = 4$.',
  },
] as const

export const ornamentoApibudinimas: Generatorius = () =>
  suBandymais(kurkOrnamenta, A_ORNAMENTAS, T7)

type OrnamentoElementas = 'L' | 'T' | 'apversta-L'

function kurkOrnamenta(): Uzdavinys | null {
  const grupe: OrnamentoElementas[] = pasirink([
    ['L', 'apversta-L'],
    ['L', 'T'],
    ['L', 'T', 'apversta-L'],
  ])
  const nariai: OrnamentoElementas[] = []
  for (let i = 0; i < 6; i += 1) nariai.push(grupe[i % grupe.length])

  return variacija([
    // 1. Grupės ilgis
    () =>
      uzdavinys(T7, {
        klausimas: 'Iš kelių elementų sudaryta besikartojanti ornamento grupė?',
        atsakymas: String(grupe.length),
        atsakymasRodymui: `$${grupe.length}$`,
        sprendimas: 'Ieškoma trumpiausio gabalo, kuris juostoje kartojasi.',
        brezinys: ornamentoJuosta(nariai),
      }),

    // 2. Koks elementas toliau
    () => {
      const rodoma = nariai.slice(0, grupe.length * 2 - 1)
      const kitas = nariai[rodoma.length]
      const vardai: Record<OrnamentoElementas, string> = {
        L: 'raidės L formos figūra',
        'apversta-L': 'apversta L formos figūra',
        T: 'raidės T formos figūra',
      }
      const variantai = sumaisyk(['L', 'apversta-L', 'T'] as OrnamentoElementas[])
      return pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kokia figūra turi būti klaustuko vietoje?',
        variantai: variantai.map((v) => vardai[v]),
        teisingas: variantai.indexOf(kitas),
        sprendimas: `Kartojasi ${grupe.length} figūrų grupė.`,
        brezinys: ornamentoJuosta(rodoma, 1),
      })
    },

    // 3. Kiek kartų pasikartos
    () => {
      const viso = grupe.length * atsitiktinis(3, 7)
      return uzdavinys(T7, {
        klausimas: `Ornamente kartojasi ${grupe.length} elementų grupė. Kiek kartų ji pasikartos ${viso} elementų juostoje?`,
        atsakymas: String(viso / grupe.length),
        atsakymasRodymui: `$${viso / grupe.length}$`,
        sprendimas: `$${viso} : ${grupe.length} = ${viso / grupe.length}$.`,
      })
    },

    // 4. Kaip gaunamas kitas elementas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kaip iš pirmojo ornamento elemento gaunamas antrasis?',
        variantai: [
          'jis apverčiamas ir pastumiamas į dešinę',
          'jis padidinamas',
          'jis nuspalvinamas kitaip',
          'jis sumažinamas perpus',
        ],
        teisingas: 0,
        sprendimas: 'Ornamentai kuriami postūmiais, posūkiais ir atspindžiais — dydis nesikeičia.',
        brezinys: ornamentoJuosta(nariai.slice(0, 4)),
      }),

    // 5. Kelintas elementas
    () => {
      const vieta = atsitiktinis(7, 18)
      const kuris = ((vieta - 1) % grupe.length) + 1
      return uzdavinys(T7, {
        klausimas: `Ornamente kartojasi ${grupe.length} elementų grupė. Kelintas grupės elementas bus ${vieta}-oje juostos vietoje?`,
        atsakymas: String(kuris),
        atsakymasRodymui: `$${kuris}$-asis`,
        sprendimas: `$${vieta} : ${grupe.length}$ duoda liekaną ${kuris === grupe.length ? 0 : kuris}, tad tai ${kuris}-asis grupės elementas.`,
      })
    },

    // 6. Kiek elementų reikės
    () => {
      const kartu = atsitiktinis(3, 8)
      return uzdavinys(T7, {
        klausimas: `Kiek iš viso elementų bus juostoje, jei ${grupe.length} elementų grupė pakartojama ${kartu} kartus?`,
        atsakymas: String(grupe.length * kartu),
        atsakymasRodymui: `$${grupe.length * kartu}$`,
        sprendimas: `$${grupe.length} \\cdot ${kartu} = ${grupe.length * kartu}$.`,
      })
    },

    // 7. Ornamento taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kas nusako ornamento taisyklę?',
        variantai: [
          'kuri elementų grupė kartojasi ir kaip ji perkeliama',
          'kiek juostoje elementų',
          'kokia elementų spalva',
          'kokio dydžio yra langeliai',
        ],
        teisingas: 0,
        sprendimas: 'Ornamentą galima pratęsti tik žinant, kas kartojasi ir kokiu būdu.',
      }),
  ])
}

// ── 9.8 Kas yra posūkis ─────────────────────────────────────────────────────

const T8 = 'kas-yra-posukis'

const A_POSUKIS = [
  {
    klausimas: 'Kas yra objekto posūkis?',
    atsakymas: 'a',
    atsakymasRodymui: 'figūros pasukimas apie tašką',
    sprendimas: 'Sukant figūra lieka tokio pat dydžio, keičiasi tik jos padėtis.',
  },
] as const

export const kasYraPosukis: Generatorius = () => suBandymais(kurkPosukiSavoka, A_POSUKIS, T8)

function kurkPosukiSavoka(): Uzdavinys | null {
  const kampas = pasirink([90, 180, 270] as const)
  const pagalLaikrodi = pasirink([true, false])

  return variacija([
    // 1. Kas yra posūkis
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kas vadinama objekto posūkiu?',
        variantai: [
          'figūros pasukimas apie pažymėtą tašką',
          'figūros perkėlimas tiesiai į šoną',
          'figūros padidinimas',
          'figūros atspindėjimas',
        ],
        teisingas: 0,
        sprendimas: 'Posūkis turi centrą — tašką, apie kurį sukama.',
        brezinys: posukioBrezinys(kampas, pagalLaikrodi),
      }),

    // 2. Kas nesikeičia sukant
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kas nesikeičia pasukus figūrą?',
        variantai: [
          'kraštinių ilgiai ir kampai',
          'figūros dydis mažėja',
          'kraštinių skaičius padvigubėja',
          'figūra tampa simetriška',
        ],
        teisingas: 0,
        sprendimas: 'Pasukta figūra lieka lygi pradinei — pasikeičia tik jos padėtis.',
        brezinys: posukioBrezinys(kampas, pagalLaikrodi),
      }),

    // 3. Kiek posūkių iki pradinės padėties
    () => {
      const kiekPosukiu = 360 / kampas
      if (!Number.isInteger(kiekPosukiu)) return null
      return uzdavinys(T8, {
        klausimas: `Kiek kartų reikia pasukti figūrą po ${kampas}°, kad ji grįžtų į pradinę padėtį?`,
        atsakymas: String(kiekPosukiu),
        atsakymasRodymui: `$${kiekPosukiu}$`,
        sprendimas: `Pilnas ratas yra 360°: $360 : ${kampas} = ${kiekPosukiu}$.`,
      })
    },

    // 4. Posūkis ar postūmis
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuo posūkis skiriasi nuo postūmio?',
        variantai: [
          'posūkis keičia figūros kryptį, o postūmis — tik vietą',
          'posūkis padidina figūrą',
          'postūmis pakeičia kraštinių ilgius',
          'jie niekuo nesiskiria',
        ],
        teisingas: 0,
        sprendimas: 'Pastumta figūra lieka taip pat pakreipta, o pasukta — jau kitaip.',
      }),

    // 5. Kiek laipsnių pusė rato
    () =>
      uzdavinys(T8, {
        klausimas: 'Keliais laipsniais pasisuka figūra, apsukta pusę rato?',
        atsakymas: '180',
        atsakymasRodymui: '$180°$',
        sprendimas: 'Visas ratas yra 360°, tad pusė jo — 180°.',
      }),

    // 6. Sukimo centras
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Ką brėžinyje žymi kryželis prie figūros?',
        variantai: [
          'tašką, apie kurį figūra sukama',
          'figūros vidurį',
          'ilgiausios kraštinės vidurį',
          'vietą, į kurią figūra bus pastumta',
        ],
        teisingas: 0,
        sprendimas: 'Be sukimo centro posūkio nusakyti neįmanoma: apie skirtingus taškus pasukta figūra atsiduria skirtingose vietose.',
        brezinys: posukioBrezinys(kampas, pagalLaikrodi),
      }),

    // 7. Du posūkiai iš eilės
    () => {
      const antras = pasirink([90, 180] as const)
      const suma = (kampas + antras) % 360
      if (suma === 0) return null
      return uzdavinys(T8, {
        klausimas: `Figūra pasukta ${kampas}°, paskui dar ${antras}° ta pačia kryptimi. Kiek laipsnių sudaro bendras posūkis?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}°$`,
        sprendimas: `$${kampas} + ${antras} = ${kampas + antras}$${kampas + antras >= 360 ? `, o tai tas pat kaip ${suma}°, nes pilnas ratas grąžina figūrą į pradinę padėtį` : ''}.`,
      })
    },
  ])
}

// ── 9.9 Posūkis apie nurodytą tašką ─────────────────────────────────────────

const T9 = 'posukis-apie-taska'

const A_APIE_TASKA = [
  {
    klausimas: 'Keliais laipsniais pasukta figūra, jei ji atsidūrė stačiu kampu nuo pradinės padėties?',
    atsakymas: '90',
    atsakymasRodymui: '$90°$',
    sprendimas: 'Statusis kampas yra 90°.',
  },
] as const

export const posukisApieTaska: Generatorius = () => suBandymais(kurkApieTaska, A_APIE_TASKA, T9)

function kurkApieTaska(): Uzdavinys | null {
  const kampas = pasirink([90, 180, 270] as const)
  const pagalLaikrodi = pasirink([true, false])

  return variacija([
    // 1. Keliais laipsniais pasukta
    () => keliaisLaipsniais(kampas, pagalLaikrodi),

    // 2. Ar tai posūkis apie pažymėtą tašką
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Apie kurį tašką pasukta figūra?',
        variantai: [
          'apie kryželiu pažymėtą tašką O',
          'apie figūros vidurį',
          'apie tinklelio kampą',
          'apie ilgiausios kraštinės vidurį',
        ],
        teisingas: 0,
        sprendimas: 'Sukimo centras brėžinyje žymimas kryželiu ir raide O.',
        brezinys: posukioBrezinys(kampas, pagalLaikrodi),
      }),

    // 3. Kiek laipsnių trūksta iki pilno rato
    () =>
      uzdavinys(T9, {
        klausimas: `Figūra pasukta ${kampas}°. Keliais laipsniais dar reikia pasukti, kad ji grįžtų į pradinę padėtį?`,
        atsakymas: String(360 - kampas),
        atsakymasRodymui: `$${360 - kampas}°$`,
        sprendimas: `$360 - ${kampas} = ${360 - kampas}$.`,
      }),

    // 4. Posūkis stačiuoju kampu
    () =>
      uzdavinys(T9, {
        klausimas: 'Keliais laipsniais pasukama figūra, kai sakoma „pasuk stačiuoju kampu“?',
        atsakymas: '90',
        atsakymasRodymui: '$90°$',
        sprendimas: 'Statusis kampas yra 90°.',
      }),

    // 5. Kiek stačiųjų kampų sudaro posūkį
    () =>
      uzdavinys(T9, {
        klausimas: `Iš kelių stačiųjų kampų susideda ${kampas}° posūkis?`,
        atsakymas: String(kampas / 90),
        atsakymasRodymui: `$${kampas / 90}$`,
        sprendimas: `$${kampas} : 90 = ${kampas / 90}$.`,
      }),

    // 6. Ar reikšmė priklauso nuo centro
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Ar figūra atsidurs toje pačioje vietoje, jei ją pasuksime tuo pačiu kampu, bet apie kitą tašką?',
        variantai: [
          'ne, sukimo centras lemia, kur figūra atsiduria',
          'taip, svarbu tik kampas',
          'taip, jei kampas status',
        ],
        teisingas: 0,
        sprendimas: 'Posūkis nusakomas dviem dalykais: kampu ir centru.',
      }),

    // 7. Posūkio rezultatas
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kaip atrodys figūra po 180° posūkio?',
        variantai: [
          'tokio pat dydžio, bet apversta',
          'dvigubai didesnė',
          'tokia pati kaip buvo',
          'perpus mažesnė',
        ],
        teisingas: 0,
        sprendimas: '180° posūkis yra pusė rato — figūra lieka lygi pradinei, tik pakreipta priešingai.',
        brezinys: posukioBrezinys(180, true),
      }),
  ])
}

function keliaisLaipsniais(kampas: number, pagalLaikrodi: boolean): Uzdavinys {
  const variantai = sumaisyk(['90°', '180°', '270°'])
  return pasirinkimoUzdavinys(naujasId(T9), T9, {
    klausimas: 'Keliais laipsniais pasukta figūra?',
    variantai,
    teisingas: variantai.indexOf(`${kampas}°`),
    sprendimas: `Punktyrinė figūra yra pasuktoji. Ji nuo pradinės nutolusi ${kampas / 90} stačiaisiais kampais.`,
    brezinys: posukioBrezinys(kampas as 90 | 180 | 270, pagalLaikrodi),
  })
}

// ── 9.10 Posūkio kryptis ────────────────────────────────────────────────────

const T10 = 'posukio-kryptis'

const A_KRYPTIS = [
  {
    klausimas: 'Kaip vadinama posūkio kryptis, sutampanti su laikrodžio rodyklės judėjimu?',
    atsakymas: 'a',
    atsakymasRodymui: 'pagal laikrodžio rodyklę',
    sprendimas: 'Priešinga kryptis vadinama prieš laikrodžio rodyklę.',
  },
] as const

export const posukioKryptis: Generatorius = () => suBandymais(kurkPosukioKrypti, A_KRYPTIS, T10)

function kurkPosukioKrypti(): Uzdavinys | null {
  const kampas = pasirink([90, 270] as const)
  const pagalLaikrodi = pasirink([true, false])

  return variacija([
    // 1. Kuria kryptimi pasukta
    () => {
      const variantai = ['pagal laikrodžio rodyklę', 'prieš laikrodžio rodyklę', 'krypties nustatyti neįmanoma']
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kuria kryptimi pasukta figūra, jei posūkis yra ${kampas === 90 ? 'ketvirtis' : 'trys ketvirčiai'} rato?`,
        variantai: pagalLaikrodi
          ? variantai
          : [variantai[1], variantai[0], variantai[2]],
        teisingas: 0,
        sprendimas: 'Kryptis nustatoma sekant, į kurią pusę pasislinko ta pati figūros viršūnė.',
        brezinys: posukioBrezinys(kampas, pagalLaikrodi),
      })
    },

    // 2. Kaip vadinamos kryptys
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kaip vadinama posūkio kryptis, sutampanti su laikrodžio rodyklės judėjimu?',
        variantai: [
          'pagal laikrodžio rodyklę',
          'prieš laikrodžio rodyklę',
          'į šiaurę',
          'statmenai',
        ],
        teisingas: 0,
        sprendimas: 'Priešinga kryptis vadinama „prieš laikrodžio rodyklę“.',
      }),

    // 3. Tas pats rezultatas kita kryptimi
    () =>
      uzdavinys(T10, {
        klausimas: `Figūra pasukta ${kampas}° pagal laikrodžio rodyklę. Keliais laipsniais ją reikėtų pasukti prieš laikrodžio rodyklę, kad rezultatas būtų toks pat?`,
        atsakymas: String(360 - kampas),
        atsakymasRodymui: `$${360 - kampas}°$`,
        sprendimas: `$360 - ${kampas} = ${360 - kampas}$ — tas pats galutinis rezultatas.`,
      }),

    // 4. 180° abiem kryptimis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Ar 180° posūkis pagal ir prieš laikrodžio rodyklę duoda tą patį rezultatą?',
        variantai: [
          'taip, nes tai lygiai pusė rato',
          'ne, rezultatai skirtingi',
          'taip, tik jei figūra kvadratinė',
        ],
        teisingas: 0,
        sprendimas: 'Pusę rato pasukus bet kuria kryptimi atsiduriama toje pačioje vietoje.',
      }),

    // 5. Kryptis po dviejų posūkių
    () =>
      uzdavinys(T10, {
        klausimas: `Figūra pasukta 90° pagal laikrodžio rodyklę, paskui 90° prieš laikrodžio rodyklę. Keliais laipsniais ji pasisuko iš viso?`,
        atsakymas: '0',
        atsakymasRodymui: '$0°$',
        sprendimas: 'Antrasis posūkis panaikina pirmąjį — figūra grįžta į pradinę padėtį.',
      }),

    // 6. Iš laikrodžio
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kuria kryptimi juda laikrodžio minutinė rodyklė nuo 12 iki 3?',
        variantai: [
          'pagal laikrodžio rodyklę, ketvirtį rato',
          'prieš laikrodžio rodyklę, ketvirtį rato',
          'pagal laikrodžio rodyklę, pusę rato',
        ],
        teisingas: 0,
        sprendimas: 'Nuo 12 iki 3 yra ketvirtis ciferblato, tai yra 90°.',
      }),

    // 7. Posūkio užrašas
    () =>
      uzdavinys(T10, {
        klausimas: 'Keliais laipsniais reikia pasukti figūrą prieš laikrodžio rodyklę, kad rezultatas sutaptų su 270° posūkiu pagal laikrodžio rodyklę?',
        atsakymas: '90',
        atsakymasRodymui: '$90°$',
        sprendimas: '$360 - 270 = 90$.',
      }),
  ])
}

// ── 9.11 Posūkis stačiuoju kampu ────────────────────────────────────────────

const T11 = 'posukis-staciuoju-kampu'

const A_STATUSIS = [
  {
    klausimas: 'Kiek stačiųjų kampų sudaro pilną ratą?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: '$360 : 90 = 4$.',
  },
] as const

export const posukisStaciuojuKampu: Generatorius = () =>
  suBandymais(kurkStatuji, A_STATUSIS, T11)

function kurkStatuji(): Uzdavinys | null {
  return variacija([
    // 1. Kiek stačiųjų kampų pilname rate
    () =>
      uzdavinys(T11, {
        klausimas: 'Iš kelių stačiųjų kampų susideda pilnas ratas?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: '$360 : 90 = 4$.',
      }),

    // 2. Posūkis stačiuoju kampu brėžinyje
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Ar pavaizduotas posūkis yra stačiuoju kampu?',
        variantai: ['taip, tai ketvirtis rato', 'ne, tai pusė rato', 'ne, tai visas ratas'],
        teisingas: 0,
        sprendimas: 'Statusis kampas yra 90° — ketvirtis pilno rato.',
        brezinys: posukioBrezinys(90, true),
      }),

    // 3. Kiek kartų pasukti
    () => {
      const kartai = atsitiktinis(2, 6)
      return uzdavinys(T11, {
        klausimas: `Figūra ${kartai} kartus pasukama stačiuoju kampu ta pačia kryptimi. Keliais laipsniais ji pasisuko iš viso?`,
        atsakymas: String((kartai * 90) % 360 === 0 ? 360 : kartai * 90),
        atsakymasRodymui: `$${kartai * 90}°$`,
        sprendimas: `$90 \\cdot ${kartai} = ${kartai * 90}$.`,
      })
    },

    // 4. Kryptis po posūkio stačiuoju kampu
    () => {
      const nuo = pasirink(['šiaurę', 'rytus', 'pietus', 'vakarus'])
      const eile = ['šiaurę', 'rytus', 'pietus', 'vakarus']
      const kitas = eile[(eile.indexOf(nuo) + 1) % 4]
      const variantai = sumaisyk([...eile])
      return pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Judama į ${nuo}. Kuria kryptimi bus judama pasisukus stačiuoju kampu pagal laikrodžio rodyklę?`,
        variantai: variantai.map((v) => `į ${v}`),
        teisingas: variantai.indexOf(kitas),
        sprendimas: 'Pagal laikrodžio rodyklę kryptys keičiasi šiaurė → rytai → pietūs → vakarai.',
      })
    },

    // 5. Kiek stačiųjų kampų iki priešingos krypties
    () =>
      uzdavinys(T11, {
        klausimas: 'Kiek kartų reikia pasisukti stačiuoju kampu, kad atsisuktum priešinga kryptimi?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Du statieji kampai sudaro 180° — pusę rato.',
      }),

    // 6. Kvadratas ir posūkiai
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kodėl pasukus kvadratą stačiuoju kampu jis atrodo taip pat kaip prieš tai?',
        variantai: [
          'nes visos jo kraštinės ir kampai vienodi',
          'nes jis yra didelis',
          'nes jis nupieštas tinklelyje',
          'nes statusis kampas yra 90°',
        ],
        teisingas: 0,
        sprendimas: 'Kvadratas turi keturias vienodas kraštines, tad kas ketvirtį rato jis sutampa pats su savimi.',
      }),

    // 7. Kelias su posūkiais
    () => {
      const posukiu = atsitiktinis(2, 5)
      return uzdavinys(T11, {
        klausimas: `Vėžliukas eina tiesiai, o po kiekvienos atkarpos pasisuka stačiuoju kampu. Keliais laipsniais jis pasisuka po ${posukiu} posūkių?`,
        atsakymas: String(posukiu * 90),
        atsakymasRodymui: `$${posukiu * 90}°$`,
        sprendimas: `$90 \\cdot ${posukiu} = ${posukiu * 90}$.`,
      })
    },
  ])
}

// ── 9.12 Ornamentas iš postūmių ir posūkių ──────────────────────────────────

const T12 = 'ornamento-kurimas'

const A_KURIMAS = [
  {
    klausimas: 'Kiek elementų bus ornamente, jei 4 elementų grupė pakartojama 5 kartus?',
    atsakymas: '20',
    atsakymasRodymui: '$20$',
    sprendimas: '$4 \\cdot 5 = 20$.',
  },
] as const

export const ornamentoKurimas: Generatorius = () => suBandymais(kurkKurima, A_KURIMAS, T12)

function kurkKurima(): Uzdavinys | null {
  const grupeje = atsitiktinis(2, 4)
  const kartu = atsitiktinis(3, 8)

  return variacija([
    // 1. Kiek elementų iš viso
    () =>
      uzdavinys(T12, {
        klausimas: `Ornamentas kuriamas kartojant ${grupeje} elementų grupę ${kartu} kartus. Kiek elementų bus iš viso?`,
        atsakymas: String(grupeje * kartu),
        atsakymasRodymui: `$${grupeje * kartu}$`,
        sprendimas: `$${grupeje} \\cdot ${kartu} = ${grupeje * kartu}$.`,
      }),

    // 2. Kokiais veiksmais kuriamas ornamentas
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kuriais veiksmais kuriamas ornamentas iš vienodų elementų?',
        variantai: [
          'postūmiais ir posūkiais',
          'didinimu ir mažinimu',
          'spalvinimu',
          'kraštinių ilginimu',
        ],
        teisingas: 0,
        sprendimas: 'Postūmis ir posūkis nekeičia elemento dydžio, tad visi ornamento elementai lieka vienodi.',
      }),

    // 3. Kiek langelių užims ornamentas
    () => {
      const plotis = atsitiktinis(2, 4)
      return uzdavinys(T12, {
        klausimas: `Vienas ornamento elementas užima ${plotis} langelius pločio. Kiek langelių pločio bus ${kartu} elementų juosta?`,
        atsakymas: String(plotis * kartu),
        atsakymasRodymui: `$${plotis * kartu}$`,
        sprendimas: `$${plotis} \\cdot ${kartu} = ${plotis * kartu}$.`,
      })
    },

    // 4. Kiek kartų telpa
    () => {
      const juosta = grupeje * kartu
      return uzdavinys(T12, {
        klausimas: `Juostoje yra ${juosta} langelių, o vienas ornamento elementas užima ${grupeje}. Kiek elementų telpa juostoje?`,
        atsakymas: String(kartu),
        atsakymasRodymui: `$${kartu}$`,
        sprendimas: `$${juosta} : ${grupeje} = ${kartu}$.`,
      })
    },

    // 5. Ornamentas su posūkiu
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ornamente kas antras elementas apverstas. Kokiu veiksmu jis gaunamas iš pirmojo?',
        variantai: [
          '180° posūkiu',
          '90° posūkiu',
          'padidinimu dvigubai',
          'pastūmimu žemyn',
        ],
        teisingas: 0,
        sprendimas: 'Apverstas elementas yra pasuktas pusę rato.',
        brezinys: ornamentoJuosta(['L', 'apversta-L', 'L', 'apversta-L']),
      }),

    // 6. Kiek posūkių ornamente
    () => {
      const elementu = grupeje * kartu
      return uzdavinys(T12, {
        klausimas: `Ornamente ${elementu} elementai, ir kas antras jų apverstas. Kiek elementų apversta?`,
        atsakymas: String(Math.floor(elementu / 2)),
        atsakymasRodymui: `$${Math.floor(elementu / 2)}$`,
        sprendimas: `$${elementu} : 2 = ${Math.floor(elementu / 2)}$${elementu % 2 === 1 ? ' (lieka vienas neapverstas)' : ''}.`,
      })
    },

    // 7. Ornamento tęsimas
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ką reikia žinoti norint tiksliai pratęsti ornamentą?',
        variantai: [
          'kuri elementų grupė kartojasi ir kokiu veiksmu ji perkeliama',
          'kiek ornamentas kainuoja',
          'kokia lapo spalva',
          'kiek laiko truko piešimas',
        ],
        teisingas: 0,
        sprendimas: 'Ornamento taisyklė yra kartojama grupė kartu su perkėlimo būdu.',
      }),
  ])
}
