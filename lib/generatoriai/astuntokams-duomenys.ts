import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { stulpelineDiagrama } from './sestokams-vaizdai'
import { histograma, sukauptuLentele, usuDiagrama } from './astuntokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 8 klasės tema „Duomenys“ — septynios potemės.
 *
 * Imtys visur sudaromos taip, kad kvartiliai ir mediana būtų sveikieji: kitaip
 * mokinys turėtų suvesti trupmeną, o tikrinama ne aritmetika, o gebėjimas
 * rasti charakteristikas.
 */

/** Sugrupuotų duomenų intervalų vardai. */
function intervaluVardai(pradzia: number, plotis: number, kiek: number): string[] {
  const v: string[] = []
  for (let i = 0; i < kiek; i += 1) {
    const a = pradzia + i * plotis
    v.push(`${a}–${a + plotis}`)
  }
  return v
}

/** Imtis iš 4k+3 skaičių, kad kvartiliai ir mediana būtų imties nariai. */
function imtis(kiek: number): number[] {
  const sk: number[] = []
  for (let i = 0; i < kiek; i += 1) sk.push(atsitiktinis(1, 40))
  return sk.sort((a, b) => a - b)
}

// ── 9.1. Empirinis skirstinys ───────────────────────────────────────────────

const T1 = 'empirinis-skirstinys'

const A_SKIRSTINYS = [
  {
    klausimas: 'Kas yra empirinis skirstinys?',
    atsakymas: 'reiksmiu ir ju dazniu lentele',
    atsakymasRodymui: 'Reikšmių ir jų dažnių sąrašas',
    sprendimas: 'Jis parodo, kaip duomenys pasiskirstę.',
  },
] as const

export const empirinisSkirstinys: Generatorius = () => suBandymais(kurkSkirstini, A_SKIRSTINYS, T1)

function kurkSkirstini(): Uzdavinys | null {
  const vardai = ['1', '2', '3', '4', '5']
  const daznis = vardai.map(() => atsitiktinis(2, 12))
  const viso = daznis.reduce((s, d) => s + d, 0)
  const eilutes = vardai.map((v, i) => ({ vardas: v, kiek: daznis[i] }))
  const didziausias = daznis.indexOf(Math.max(...daznis))

  return variacija([
    // 1. Kas yra empirinis skirstinys
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kas yra empirinis skirstinys?',
        variantai: [
          'stebėtų reikšmių ir jų dažnių sąrašas',
          'visų galimų reikšmių sąrašas',
          'duomenų vidurkis',
          'imties dydis',
        ],
        teisingas: 0,
        sprendimas: 'Jis sudaromas iš tikrai surinktų duomenų.',
      }),

    // 2. Imties dydis
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek iš viso duomenų yra diagramoje pavaizduotoje imtyje?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `Sudedami visi dažniai: $${daznis.join(' + ')} = ${viso}$.`,
        brezinys: stulpelineDiagrama(eilutes),
      }),

    // 3. Dažniausia reikšmė
    () =>
      uzdavinys(T1, {
        klausimas: 'Kuri reikšmė diagramoje pasikartoja dažniausiai?',
        atsakymas: vardai[didziausias],
        atsakymasRodymui: `$${vardai[didziausias]}$`,
        sprendimas: `Jos dažnis didžiausias — $${daznis[didziausias]}$.`,
        brezinys: stulpelineDiagrama(eilutes),
      }),

    // 4. Santykinis dažnis
    () => {
      const i = atsitiktinis(0, 4)
      const proc = (daznis[i] * 100) / viso
      if (proc % 1 !== 0) return null
      return uzdavinys(T1, {
        klausimas: `Imtyje iš ${viso} duomenų reikšmė $${vardai[i]}$ pasikartojo ${daznis[i]} kartus. Koks jos santykinis dažnis procentais?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `$${daznis[i]} : ${viso} \\cdot 100 = ${proc}$.`,
      })
    },

    // 5. Dažnių suma
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kam lygi visų santykinių dažnių suma?',
        variantai: ['$1$, arba $100\\%$', '$0$', 'imties dydžiui', 'vidurkiui'],
        teisingas: 0,
        sprendimas: 'Visi duomenys pasiskirsto tarp reikšmių.',
      }),

    // 6. Kam naudingas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kam naudingas empirinis skirstinys?',
        variantai: [
          'jis parodo, kaip duomenys pasiskirstę tarp reikšmių',
          'jis parodo tik didžiausią reikšmę',
          'jis pakeičia vidurkį',
          'jis rodo imties tikslumą',
        ],
        teisingas: 0,
        sprendimas: 'Iš jo matyti ir mada, ir sklaida.',
      }),

    // 7. Dažnis iš diagramos
    () => {
      const i = atsitiktinis(0, 4)
      return uzdavinys(T1, {
        klausimas: `Koks yra reikšmės $${vardai[i]}$ dažnis pagal diagramą?`,
        atsakymas: String(daznis[i]),
        atsakymasRodymui: `$${daznis[i]}$`,
        sprendimas: 'Skaitoma stulpelio aukštis.',
        brezinys: stulpelineDiagrama(eilutes),
      })
    },
  ])
}

// ── 9.2. Sukauptasis ir sukauptasis santykinis dažniai ──────────────────────

const T2 = 'sukauptieji-dazniai'

const A_SUKAUPTI = [
  {
    klausimas: 'Dažniai 3, 5 ir 2. Koks yra antrosios reikšmės sukauptasis dažnis?',
    atsakymas: '8',
    atsakymasRodymui: '$8$',
    sprendimas: '$3 + 5 = 8$.',
  },
] as const

export const sukauptiejiDazniai: Generatorius = () => suBandymais(kurkSukauptus, A_SUKAUPTI, T2)

function kurkSukauptus(): Uzdavinys | null {
  const vardai = intervaluVardai(pasirink([0, 10, 20]), 10, 4)
  const daznis = vardai.map(() => atsitiktinis(2, 12))
  const viso = daznis.reduce((s, d) => s + d, 0)
  const eilutes = vardai.map((v, i) => ({ vardas: v, daznis: daznis[i] }))
  const iki2 = daznis[0] + daznis[1]
  const iki3 = iki2 + daznis[2]

  return variacija([
    // 1. Sukauptasis dažnis
    () =>
      uzdavinys(T2, {
        klausimas: 'Koks yra antrojo intervalo sukauptasis dažnis?',
        atsakymas: String(iki2),
        atsakymasRodymui: `$${iki2}$`,
        sprendimas: `Sudedami visi dažniai iki jo imtinai: $${daznis[0]} + ${daznis[1]} = ${iki2}$.`,
        brezinys: sukauptuLentele(eilutes),
      }),

    // 2. Trečiojo intervalo
    () =>
      uzdavinys(T2, {
        klausimas: 'Koks yra trečiojo intervalo sukauptasis dažnis?',
        atsakymas: String(iki3),
        atsakymasRodymui: `$${iki3}$`,
        sprendimas: `$${daznis[0]} + ${daznis[1]} + ${daznis[2]} = ${iki3}$.`,
        brezinys: sukauptuLentele(eilutes),
      }),

    // 3. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kas yra sukauptasis dažnis?',
        variantai: [
          'visų iki tos reikšmės imtinai esančių dažnių suma',
          'didžiausias dažnis',
          'dažnių skirtumas',
          'dažnių vidurkis',
        ],
        teisingas: 0,
        sprendimas: 'Todėl jis niekada nemažėja.',
      }),

    // 4. Paskutinis sukauptasis
    () =>
      uzdavinys(T2, {
        klausimas: `Imtyje yra ${viso} duomenų. Koks yra paskutinio intervalo sukauptasis dažnis?`,
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: 'Iki paskutinio intervalo susikaupia visi duomenys.',
      }),

    // 5. Sukauptasis santykinis
    () => {
      const proc = (iki2 * 100) / viso
      if (proc % 1 !== 0) return null
      return uzdavinys(T2, {
        klausimas: `Imtyje ${viso} duomenų, iki antrojo intervalo imtinai susikaupė ${iki2}. Koks sukauptasis santykinis dažnis procentais?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `$${iki2} : ${viso} \\cdot 100 = ${proc}$.`,
      })
    },

    // 6. Atskiras dažnis iš sukauptųjų
    () =>
      uzdavinys(T2, {
        klausimas: `Antrojo intervalo sukauptasis dažnis ${iki2}, trečiojo — ${iki3}. Koks yra trečiojo intervalo dažnis?`,
        atsakymas: String(daznis[2]),
        atsakymasRodymui: `$${daznis[2]}$`,
        sprendimas: `$${iki3} - ${iki2} = ${daznis[2]}$.`,
      }),

    // 7. Kaip kinta
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kaip kinta sukauptieji dažniai einant nuo pirmojo intervalo prie paskutinio?',
        variantai: ['jie didėja arba nesikeičia', 'jie mažėja', 'jie kinta atsitiktinai', 'jie vienodi'],
        teisingas: 0,
        sprendimas: 'Prie ankstesnės sumos vis pridedamas neneigiamas dažnis.',
      }),
  ])
}

// ── 9.3. Sugrupuotų duomenų stulpelinė diagrama ─────────────────────────────

const T3 = 'sugrupuotu-diagrama'

const A_SUGRUPUOTI = [
  {
    klausimas: 'Kodėl duomenys grupuojami į intervalus?',
    atsakymas: 'kad butu aiskiau',
    atsakymasRodymui: 'Kad būtų aiškiau matyti pasiskirstymas',
    sprendimas: 'Kai reikšmių labai daug, atskiri stulpeliai nieko neparodo.',
  },
] as const

export const sugrupuotuDiagrama: Generatorius = () => suBandymais(kurkSugrupuotus, A_SUGRUPUOTI, T3)

function kurkSugrupuotus(): Uzdavinys | null {
  const plotis = pasirink([5, 10])
  const vardai = intervaluVardai(0, plotis, 5)
  const daznis = vardai.map(() => atsitiktinis(1, 14))
  const viso = daznis.reduce((s, d) => s + d, 0)
  const eilutes = vardai.map((v, i) => ({ vardas: v, kiek: daznis[i] }))
  const didziausias = daznis.indexOf(Math.max(...daznis))

  return variacija([
    // 1. Kodėl grupuojama
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kodėl duomenys grupuojami į intervalus?',
        variantai: [
          'kad būtų aiškiau matyti pasiskirstymas, kai reikšmių labai daug',
          'kad duomenų būtų mažiau',
          'kad būtų lengviau skaičiuoti vidurkį',
          'kad diagrama būtų spalvinga',
        ],
        teisingas: 0,
        sprendimas: 'Vietoj dešimčių siaurų stulpelių lieka keli platūs.',
      }),

    // 2. Gausiausias intervalas
    () =>
      uzdavinys(T3, {
        klausimas: 'Kuriame intervale yra daugiausia duomenų? Užrašyk intervalo pradžią.',
        atsakymas: String(didziausias * plotis),
        atsakymasRodymui: `$${didziausias * plotis}$ (${vardai[didziausias]})`,
        sprendimas: `Šio intervalo stulpelis aukščiausias — $${daznis[didziausias]}$.`,
        brezinys: stulpelineDiagrama(eilutes),
      }),

    // 3. Duomenų kiekis
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek iš viso duomenų pavaizduota diagramoje?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${daznis.join(' + ')} = ${viso}$.`,
        brezinys: stulpelineDiagrama(eilutes),
      }),

    // 4. Intervalo plotis
    () =>
      uzdavinys(T3, {
        klausimas: `Duomenys sugrupuoti į intervalus ${vardai[0]}, ${vardai[1]}, ${vardai[2]}. Koks yra intervalo plotis?`,
        atsakymas: String(plotis),
        atsakymasRodymui: `$${plotis}$`,
        sprendimas: `$${plotis} - 0 = ${plotis}$.`,
      }),

    // 5. Dviejų intervalų suma
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek duomenų patenka į du pirmuosius intervalus kartu?',
        atsakymas: String(daznis[0] + daznis[1]),
        atsakymasRodymui: `$${daznis[0] + daznis[1]}$`,
        sprendimas: `$${daznis[0]} + ${daznis[1]} = ${daznis[0] + daznis[1]}$.`,
        brezinys: stulpelineDiagrama(eilutes),
      }),

    // 6. Ko nematyti
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ko nebematyti sugrupavus duomenis į intervalus?',
        variantai: [
          'atskirų reikšmių',
          'bendro duomenų kiekio',
          'gausiausio intervalo',
          'intervalų pločio',
        ],
        teisingas: 0,
        sprendimas: 'Matomas tik intervalas, į kurį reikšmė patenka.',
      }),

    // 7. Intervalų skaičius
    () =>
      uzdavinys(T3, {
        klausimas: 'Į kiek intervalų sugrupuoti diagramos duomenys?',
        atsakymas: '5',
        atsakymasRodymui: '$5$',
        sprendimas: 'Skaičiuojami stulpeliai.',
        brezinys: stulpelineDiagrama(eilutes),
      }),
  ])
}

// ── 9.4. Histograma ─────────────────────────────────────────────────────────

const T4 = 'histograma-8'

const A_HISTOGRAMA = [
  {
    klausimas: 'Kuo histograma skiriasi nuo įprastos stulpelinės diagramos?',
    atsakymas: 'stulpeliai susilieja',
    atsakymasRodymui: 'Jos stulpeliai vaizduoja intervalus ir yra sulipę',
    sprendimas: 'Tarp intervalų nėra tarpų.',
  },
] as const

export const histograma8: Generatorius = () => suBandymais(kurkHistograma, A_HISTOGRAMA, T4)

function kurkHistograma(): Uzdavinys | null {
  const plotis = pasirink([5, 10])
  const vardai = intervaluVardai(0, plotis, 5)
  const daznis = vardai.map(() => atsitiktinis(1, 14))
  const eilutes = vardai.map((v, i) => ({ vardas: v, daznis: daznis[i] }))
  const viso = daznis.reduce((s, d) => s + d, 0)
  const didziausias = daznis.indexOf(Math.max(...daznis))

  return variacija([
    // 1. Kuo skiriasi
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuo histograma skiriasi nuo įprastos stulpelinės diagramos?',
        variantai: [
          'jos stulpeliai vaizduoja intervalus ir tarp jų nėra tarpų',
          'ji visada spalvota',
          'joje nėra ašių',
          'ji vaizduoja tik procentus',
        ],
        teisingas: 0,
        sprendimas: 'Intervalai vienas su kitu susisiekia.',
        brezinys: histograma(eilutes),
      }),

    // 2. Dažnis iš histogramos
    () => {
      const i = atsitiktinis(0, 4)
      return uzdavinys(T4, {
        klausimas: `Kiek duomenų patenka į intervalą ${vardai[i]}?`,
        atsakymas: String(daznis[i]),
        atsakymasRodymui: `$${daznis[i]}$`,
        sprendimas: 'Skaitomas stulpelio aukštis.',
        brezinys: histograma(eilutes),
      })
    },

    // 3. Gausiausias intervalas
    () =>
      uzdavinys(T4, {
        klausimas: 'Kuriame intervale duomenų daugiausia? Užrašyk intervalo pradžią.',
        atsakymas: String(didziausias * plotis),
        atsakymasRodymui: `$${didziausias * plotis}$ (${vardai[didziausias]})`,
        sprendimas: `Aukščiausias stulpelis siekia $${daznis[didziausias]}$.`,
        brezinys: histograma(eilutes),
      }),

    // 4. Imties dydis
    () =>
      uzdavinys(T4, {
        klausimas: 'Kiek iš viso duomenų pavaizduota histogramoje?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `Sudedami visi stulpeliai: $${daznis.join(' + ')} = ${viso}$.`,
        brezinys: histograma(eilutes),
      }),

    // 5. Kokiems duomenims tinka
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kokiems duomenims tinka histograma?',
        variantai: [
          'skaitiniams, sugrupuotiems į intervalus',
          'tik tekstiniams',
          'tik dviem reikšmėms',
          'bet kokiems, išskyrus skaitinius',
        ],
        teisingas: 0,
        sprendimas: 'Horizontalioji ašis yra skaičių ašis.',
      }),

    // 6. Nuo kurios reikšmės
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek duomenų yra didesnių už ${3 * plotis}, jeigu paskutiniuose dviejuose intervaluose yra ${daznis[3]} ir ${daznis[4]} duomenys?`,
        atsakymas: String(daznis[3] + daznis[4]),
        atsakymasRodymui: `$${daznis[3] + daznis[4]}$`,
        sprendimas: `$${daznis[3]} + ${daznis[4]} = ${daznis[3] + daznis[4]}$.`,
      }),

    // 7. Ko negalima pasakyti
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ko negalima tiksliai pasakyti iš histogramos?',
        variantai: [
          'kokios yra atskiros duomenų reikšmės',
          'kiek duomenų yra intervale',
          'kuris intervalas gausiausias',
          'koks intervalų plotis',
        ],
        teisingas: 0,
        sprendimas: 'Sugrupavus lieka žinomas tik intervalas.',
      }),
  ])
}

// ── 9.5. Imties skaitinės charakteristikos ──────────────────────────────────

const T5 = 'imties-charakteristikos'

const A_CHARAKT = [
  {
    klausimas: 'Kas yra imties mada?',
    atsakymas: 'dazniausia reiksme',
    atsakymasRodymui: 'Dažniausiai pasikartojanti reikšmė',
    sprendimas: 'Mada gali būti ir kelios.',
  },
] as const

export const imtiesCharakteristikos: Generatorius = () => suBandymais(kurkCharakt, A_CHARAKT, T5)

function kurkCharakt(): Uzdavinys | null {
  const sk = imtis(7)
  const suma = sk.reduce((s, x) => s + x, 0)
  if (suma % 7 !== 0) return null
  const vidurkis = suma / 7
  const mediana = sk[3]
  const plotis = sk[6] - sk[0]

  return variacija([
    // 1. Vidurkis
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok imties $${sk.join('; ')}$ vidurkį.`,
        atsakymas: String(vidurkis),
        atsakymasRodymui: `$${vidurkis}$`,
        sprendimas: `$${suma} : 7 = ${vidurkis}$.`,
      }),

    // 2. Mediana
    () =>
      uzdavinys(T5, {
        klausimas: `Rask imties $${sk.join('; ')}$ medianą.`,
        atsakymas: String(mediana),
        atsakymasRodymui: `$${mediana}$`,
        sprendimas: 'Duomenys jau surikiuoti, tad mediana yra ketvirtasis skaičius.',
      }),

    // 3. Plotis
    () =>
      uzdavinys(T5, {
        klausimas: `Koks yra imties $${sk.join('; ')}$ plotis (skirtumas tarp didžiausios ir mažiausios reikšmės)?`,
        atsakymas: String(plotis),
        atsakymasRodymui: `$${plotis}$`,
        sprendimas: `$${sk[6]} - ${sk[0]} = ${plotis}$.`,
      }),

    // 4. Kas yra mada
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kas yra imties mada?',
        variantai: [
          'dažniausiai pasikartojanti reikšmė',
          'vidurinė reikšmė',
          'reikšmių vidurkis',
          'didžiausia reikšmė',
        ],
        teisingas: 0,
        sprendimas: 'Jei visos reikšmės skirtingos, mados nėra.',
      }),

    // 5. Kuri charakteristika atspari
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuri charakteristika mažiau priklauso nuo vienos labai didelės reikšmės?',
        variantai: ['mediana', 'vidurkis', 'plotis', 'suma'],
        teisingas: 0,
        sprendimas: 'Mediana žiūri tik į vidurinę padėtį, o ne į dydį.',
      }),

    // 6. Poros
    () =>
      poruUzdavinys(naujasId(T5), T5, {
        klausimas: 'Sujunk charakteristiką su jos apibūdinimu.',
        poros: [
          { kaire: 'vidurkis', desine: 'suma, padalyta iš duomenų skaičiaus' },
          { kaire: 'mediana', desine: 'vidurinė surikiuotų duomenų reikšmė' },
          { kaire: 'mada', desine: 'dažniausiai pasikartojanti reikšmė' },
          { kaire: 'plotis', desine: 'didžiausios ir mažiausios reikšmių skirtumas' },
        ],
        sprendimas: 'Pirmosios trys rodo vidurį, o plotis — sklaidą.',
      }),

    // 7. Trūkstamas duomuo
    () => {
      const naujas = atsitiktinis(1, 40)
      const naujaSuma = suma + naujas
      if (naujaSuma % 8 !== 0) return null
      return uzdavinys(T5, {
        klausimas: `Septynių skaičių suma ${suma}. Kokį aštuntą skaičių reikia pridėti, kad vidurkis būtų ${naujaSuma / 8}?`,
        atsakymas: String(naujas),
        atsakymasRodymui: `$${naujas}$`,
        sprendimas: `$${naujaSuma / 8} \\cdot 8 = ${naujaSuma}$; $${naujaSuma} - ${suma} = ${naujas}$.`,
      })
    },
  ])
}

// ── 9.6. Kvartiliai ─────────────────────────────────────────────────────────

const T6 = 'kvartiliai'

const A_KVARTILIAI = [
  {
    klausimas: 'Kiek duomenų yra žemiau apatinio kvartilio?',
    atsakymas: '25',
    atsakymasRodymui: 'Apie $25\\%$',
    sprendimas: 'Kvartiliai dalija duomenis į keturias lygias dalis.',
  },
] as const

export const kvartiliai: Generatorius = () => suBandymais(kurkKvartilius, A_KVARTILIAI, T6)

function kurkKvartilius(): Uzdavinys | null {
  const sk = imtis(7)
  if (sk[1] === sk[5]) return null
  const q1 = sk[1]
  const mediana = sk[3]
  const q3 = sk[5]

  return variacija([
    // 1. Apatinis kvartilis
    () =>
      uzdavinys(T6, {
        klausimas: `Rask imties $${sk.join('; ')}$ apatinį kvartilį.`,
        atsakymas: String(q1),
        atsakymasRodymui: `$${q1}$`,
        sprendimas: 'Tai apatinės pusės mediana — antrasis skaičius.',
      }),

    // 2. Viršutinis kvartilis
    () =>
      uzdavinys(T6, {
        klausimas: `Rask imties $${sk.join('; ')}$ viršutinį kvartilį.`,
        atsakymas: String(q3),
        atsakymasRodymui: `$${q3}$`,
        sprendimas: 'Tai viršutinės pusės mediana — šeštasis skaičius.',
      }),

    // 3. Kvartilių skirtumas
    () =>
      uzdavinys(T6, {
        klausimas: `Imties apatinis kvartilis ${q1}, viršutinis — ${q3}. Koks yra kvartilių skirtumas?`,
        atsakymas: String(q3 - q1),
        atsakymasRodymui: `$${q3 - q1}$`,
        sprendimas: `$${q3} - ${q1} = ${q3 - q1}$.`,
      }),

    // 4. Ką dalija kvartiliai
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Į kiek dalių kvartiliai padalija surikiuotus duomenis?',
        variantai: ['į keturias', 'į dvi', 'į tris', 'į penkias'],
        teisingas: 0,
        sprendimas: 'Trys kvartiliai duoda keturias dalis.',
      }),

    // 5. Kiek duomenų tarp kvartilių
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kiek maždaug duomenų yra tarp apatinio ir viršutinio kvartilių?',
        variantai: ['pusė', 'ketvirtadalis', 'visi', 'trys ketvirtadaliai'],
        teisingas: 0,
        sprendimas: 'Nuo $25\\%$ iki $75\\%$ — pusė duomenų.',
      }),

    // 6. Antrasis kvartilis
    () =>
      uzdavinys(T6, {
        klausimas: `Kam lygus imties $${sk.join('; ')}$ antrasis kvartilis?`,
        atsakymas: String(mediana),
        atsakymasRodymui: `$${mediana}$`,
        sprendimas: 'Antrasis kvartilis yra mediana.',
      }),

    // 7. Ką rodo kvartilių skirtumas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Ką rodo kvartilių skirtumas?',
        variantai: [
          'kiek išsibarsčiusi vidurinė duomenų pusė',
          'duomenų vidurkį',
          'didžiausią reikšmę',
          'duomenų skaičių',
        ],
        teisingas: 0,
        sprendimas: 'Kraštinės reikšmės jam įtakos neturi.',
      }),
  ])
}

// ── 9.7. Stačiakampė diagrama su „ūsais“ ────────────────────────────────────

const T7 = 'usu-diagrama'

const A_USAI = [
  {
    klausimas: 'Ką rodo stačiakampio kraštinės ūsų diagramoje?',
    atsakymas: 'kvartilius',
    atsakymasRodymui: 'Apatinį ir viršutinį kvartilius',
    sprendimas: 'Stačiakampyje telpa vidurinė duomenų pusė.',
  },
] as const

export const usuDiagramaUzd: Generatorius = () => suBandymais(kurkUsus, A_USAI, T7)

function kurkUsus(): Uzdavinys | null {
  const maziausias = atsitiktinis(1, 8)
  const q1 = maziausias + atsitiktinis(2, 6)
  const mediana = q1 + atsitiktinis(2, 6)
  const q3 = mediana + atsitiktinis(2, 6)
  const didziausias = q3 + atsitiktinis(2, 6)
  const bre = () => usuDiagrama(maziausias, q1, mediana, q3, didziausias)

  return variacija([
    // 1. Mediana iš diagramos
    () =>
      uzdavinys(T7, {
        klausimas: 'Kokia yra diagramoje pavaizduotų duomenų mediana?',
        atsakymas: String(mediana),
        atsakymasRodymui: `$${mediana}$`,
        sprendimas: 'Mediana pažymėta brūkšniu stačiakampio viduje.',
        brezinys: bre(),
      }),

    // 2. Plotis
    () =>
      uzdavinys(T7, {
        klausimas: 'Koks yra diagramoje pavaizduotų duomenų plotis?',
        atsakymas: String(didziausias - maziausias),
        atsakymasRodymui: `$${didziausias - maziausias}$`,
        sprendimas: `$${didziausias} - ${maziausias} = ${didziausias - maziausias}$.`,
        brezinys: bre(),
      }),

    // 3. Kvartilių skirtumas
    () =>
      uzdavinys(T7, {
        klausimas: 'Koks yra diagramoje pavaizduotų duomenų kvartilių skirtumas?',
        atsakymas: String(q3 - q1),
        atsakymasRodymui: `$${q3 - q1}$`,
        sprendimas: `Stačiakampio kraštinės rodo kvartilius: $${q3} - ${q1} = ${q3 - q1}$.`,
        brezinys: bre(),
      }),

    // 4. Ką rodo stačiakampis
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ką rodo stačiakampio kraštinės šioje diagramoje?',
        variantai: [
          'apatinį ir viršutinį kvartilius',
          'mažiausią ir didžiausią reikšmes',
          'vidurkį ir medianą',
          'duomenų skaičių',
        ],
        teisingas: 0,
        sprendimas: 'Stačiakampyje telpa vidurinė duomenų pusė.',
        brezinys: bre(),
      }),

    // 5. Ką rodo ūsai
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ką rodo diagramos „ūsai“?',
        variantai: [
          'mažiausią ir didžiausią imties reikšmes',
          'kvartilius',
          'medianą',
          'vidurkį',
        ],
        teisingas: 0,
        sprendimas: 'Ūsai nutįsta iki kraštinių reikšmių.',
      }),

    // 6. Kiek duomenų stačiakampyje
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek procentų duomenų patenka į stačiakampį?',
        atsakymas: '50',
        atsakymasRodymui: '$50\\%$',
        sprendimas: 'Nuo apatinio iki viršutinio kvartilio — pusė duomenų.',
      }),

    // 7. Didžiausia reikšmė
    () =>
      uzdavinys(T7, {
        klausimas: 'Kokia yra didžiausia diagramoje pavaizduota reikšmė?',
        atsakymas: String(didziausias),
        atsakymasRodymui: `$${didziausias}$`,
        sprendimas: 'Ji yra dešiniojo ūso gale.',
        brezinys: bre(),
      }),
  ])
}
