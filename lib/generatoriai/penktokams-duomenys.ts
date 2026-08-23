import { atsitiktinis, naujasId, pasirink, suprastink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import {
  bruksneliuLentele,
  kauliukas,
  linijineDiagrama,
  maiselis,
  moneta,
  tikimybesSkale,
} from './ketvirtokams-duomenu-vaizdai'
import { VARDAI } from './ketvirtokams-bendra'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 5 klasės tema „Duomenys ir tikimybės“ — keturios potemės.
 *
 * Vidurkio uždaviniuose skaičiai parenkami taip, kad dalyba būtų be liekanos:
 * penktokas dar nedalija su liekana ir vidurkio trupmena čia tik trukdytų.
 * Tikimybė visur užrašoma paprastąja trupmena ir suprastinama.
 */

const DALYKAI = ['matematika', 'lietuvių kalba', 'istorija', 'biologija', 'dailė'] as const
const SPALVOS = ['raudona', 'mėlyna', 'žalia', 'geltona'] as const

/** Rinkinys skaičių, kurių suma dalijasi iš jų kiekio be liekanos. */
function rinkinysSuVidurkiu(kiek: number, vidurkis: number): number[] {
  const sk: number[] = []
  let likutis = kiek * vidurkis
  for (let i = 0; i < kiek - 1; i++) {
    const maks = Math.min(vidurkis * 2, likutis - (kiek - i - 1))
    const min = Math.max(1, likutis - (kiek - i - 1) * vidurkis * 2)
    if (min > maks) return []
    const x = atsitiktinis(min, maks)
    sk.push(x)
    likutis -= x
  }
  if (likutis < 1) return []
  sk.push(likutis)
  return sk
}

// ── 12.1.1. Kokybiniai ir kiekybiniai duomenys ──────────────────────────────

const T1 = 'kokybiniai-ir-kiekybiniai'

const A_DUOMENYS = [
  {
    klausimas: 'Kokie duomenys yra mokinių ūgis centimetrais?',
    atsakymas: 'kiekybiniai',
    atsakymasRodymui: 'Kiekybiniai',
    sprendimas: 'Jie išreiškiami skaičiais, kuriuos galima palyginti ir sudėti.',
  },
] as const

export const kokybiniaiIrKiekybiniai: Generatorius = () => suBandymais(kurkDuomenis, A_DUOMENYS, T1)

function kurkDuomenis(): Uzdavinys | null {
  const kiekybiniai = ['mokinių ūgis centimetrais', 'klasės mokinių amžius', 'knygų skaičius lentynoje', 'oro temperatūra']
  const kokybiniai = ['mėgstamiausia spalva', 'akių spalva', 'mėgstamiausias mokomasis dalykas', 'gyvenamasis miestas']

  return variacija([
    // 1. Kiekybiniai
    () =>
      uzdavinys(T1, {
        klausimas: `Kokie duomenys yra ${pasirink(kiekybiniai)}?`,
        atsakymas: 'kiekybiniai',
        atsakymasRodymui: 'Kiekybiniai',
        sprendimas: 'Kiekybiniai duomenys išreiškiami skaičiais.',
      }),

    // 2. Kokybiniai
    () =>
      uzdavinys(T1, {
        klausimas: `Kokie duomenys yra ${pasirink(kokybiniai)}?`,
        atsakymas: 'kokybiniai',
        atsakymasRodymui: 'Kokybiniai',
        sprendimas: 'Kokybiniai duomenys nusako savybę, o ne dydį — jų sudėti negalima.',
      }),

    // 3. Kuo skiriasi
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuo kiekybiniai duomenys skiriasi nuo kokybinių?',
        variantai: [
          'kiekybiniai išreiškiami skaičiais, o kokybiniai — savybėmis',
          'kiekybinių visada daugiau',
          'kokybiniai visada tikslesni',
          'kiekybiniai renkami tik apklausose',
        ],
        teisingas: 0,
        sprendimas: 'Ūgį galima sudėti ir suvidurkinti, o akių spalvos — ne.',
      }),

    // 4. Kurie iš sąrašo
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kurie iš šių duomenų yra kokybiniai?',
        variantai: ['mėgstamiausia knygos rūšis', 'knygų skaičius', 'puslapių skaičius', 'knygos kaina'],
        teisingas: 0,
        sprendimas: 'Rūšis nusako savybę, o visi kiti duomenys yra skaičiai.',
      }),

    // 5. Iš lentelės
    () => {
      const eilutes = sumaisyk([...SPALVOS]).slice(0, 4).map((v) => ({ vardas: v, kiek: atsitiktinis(2, 9) }))
      const viso = eilutes.reduce((s, e) => s + e.kiek, 0)
      return uzdavinys(T1, {
        klausimas: 'Lentelėje surašyti mokinių atsakymai. Kiek iš viso mokinių apklausta?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `Sudedami visų eilučių skaičiai: $${eilutes.map((e) => e.kiek).join(' + ')} = ${viso}$.`,
        brezinys: bruksneliuLentele(eilutes),
      })
    },

    // 6. Kokio tipo klausimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kokius duomenis surinksi paklausęs „Kiek turi brolių ir seserų?“',
        variantai: ['kiekybinius', 'kokybinius', 'ir kiekybinius, ir kokybinius', 'jokių'],
        teisingas: 0,
        sprendimas: 'Atsakymas yra skaičius.',
      }),

    // 7. Poros
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Sujunk duomenis su jų rūšimi.',
        poros: [
          { kaire: 'mokinio ūgis', desine: 'kiekybiniai' },
          { kaire: 'akių spalva', desine: 'kokybiniai' },
          { kaire: 'pažymių skaičius', desine: 'kiekybiniai' },
          { kaire: 'mėgstamiausias sportas', desine: 'kokybiniai' },
        ],
        sprendimas: 'Kiekybiniai duomenys visada išreiškiami skaičiais.',
      }),

    // 8. Kaip vaizduojami
    () => {
      const taskai = DALYKAI.slice(0, 4).map((d) => ({ zyme: d.slice(0, 4), reiksme: atsitiktinis(3, 20) }))
      const maks = taskai.reduce((a, b) => (a.reiksme > b.reiksme ? a : b))
      return uzdavinys(T1, {
        klausimas: 'Diagramoje pavaizduoti apklausos rezultatai. Kokia yra didžiausia pažymėta reikšmė?',
        atsakymas: String(maks.reiksme),
        atsakymasRodymui: `$${maks.reiksme}$`,
        sprendimas: 'Ieškomas aukščiausiai esantis taškas.',
        brezinys: linijineDiagrama(taskai),
      })
    },
  ])
}

// ── 12.1.2. Imtis, imties vidurkis ──────────────────────────────────────────

const T2 = 'imtis-ir-vidurkis'

const A_VIDURKIS = [
  {
    klausimas: 'Kaip apskaičiuojamas imties vidurkis?',
    atsakymas: 'suma dalijama is kiekio',
    atsakymasRodymui: 'Visų reikšmių suma dalijama iš jų kiekio',
    sprendimas: 'Vidurkis rodo, po kiek tektų kiekvienam, jei viskas būtų padalyta po lygiai.',
  },
] as const

export const imtisIrVidurkis: Generatorius = () => suBandymais(kurkVidurki, A_VIDURKIS, T2)

function kurkVidurki(): Uzdavinys | null {
  const kiek = atsitiktinis(3, 6)
  const vidurkis = atsitiktinis(4, 20)
  const sk = rinkinysSuVidurkiu(kiek, vidurkis)
  if (sk.length === 0) return null

  return variacija([
    // 1. Vidurkis
    () =>
      uzdavinys(T2, {
        klausimas: `Apskaičiuok skaičių ${sk.join(', ')} vidurkį.`,
        atsakymas: String(vidurkis),
        atsakymasRodymui: `$${vidurkis}$`,
        sprendimas: `Suma $${sk.join(' + ')} = ${kiek * vidurkis}$; $${kiek * vidurkis} : ${kiek} = ${vidurkis}$.`,
      }),

    // 2. Kaip skaičiuojamas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kaip apskaičiuojamas imties vidurkis?',
        variantai: [
          'visų reikšmių suma padalijama iš jų kiekio',
          'didžiausia reikšmė padalijama iš mažiausios',
          'randama vidurinė reikšmė',
          'sudedamos visos reikšmės',
        ],
        teisingas: 0,
        sprendimas: 'Vidurkis rodo, po kiek tektų kiekvienam, jei viskas būtų padalyta po lygiai.',
      }),

    // 3. Kas yra imtis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kas vadinama imtimi?',
        variantai: [
          'tirti atrinktų duomenų rinkinys',
          'didžiausia duomenų reikšmė',
          'duomenų vidurkis',
          'apklausos klausimas',
        ],
        teisingas: 0,
        sprendimas: 'Imties dydis — kiek reikšmių į ją pateko.',
      }),

    // 4. Imties dydis
    () =>
      uzdavinys(T2, {
        klausimas: `Imtį sudaro reikšmės ${sk.join(', ')}. Koks jos dydis?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: 'Imties dydis yra reikšmių skaičius.',
      }),

    // 5. Suma iš vidurkio
    () =>
      uzdavinys(T2, {
        klausimas: `${kiek} skaičių vidurkis yra ${vidurkis}. Kokia visų tų skaičių suma?`,
        atsakymas: String(kiek * vidurkis),
        atsakymasRodymui: `$${kiek * vidurkis}$`,
        sprendimas: `$${vidurkis} \\cdot ${kiek} = ${kiek * vidurkis}$.`,
      }),

    // 6. Trūkstama reikšmė
    () => {
      const be = sk.slice(0, -1)
      return uzdavinys(T2, {
        klausimas: `${kiek} skaičių vidurkis yra ${vidurkis}. Žinomi ${kiek - 1} iš jų: ${be.join(', ')}. Koks paskutinis skaičius?`,
        atsakymas: String(sk[sk.length - 1]),
        atsakymasRodymui: `$${sk[sk.length - 1]}$`,
        sprendimas: `Visa suma $${vidurkis} \\cdot ${kiek} = ${kiek * vidurkis}$; $${kiek * vidurkis} - ${be.reduce((s, x) => s + x, 0)} = ${sk[sk.length - 1]}$.`,
      })
    },

    // 7. Tekstinis
    () => {
      const vardas = pasirink(VARDAI)
      return uzdavinys(T2, {
        klausimas: `${vardas} per ${kiek} dienas perskaitė ${sk.join(', ')} puslapius. Kiek puslapių vidutiniškai per dieną?`,
        atsakymas: String(vidurkis),
        atsakymasRodymui: `$${vidurkis}$`,
        sprendimas: `$${kiek * vidurkis} : ${kiek} = ${vidurkis}$.`,
      })
    },

    // 8. Ar vidurkis gali būti didesnis už visus
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ar vidurkis gali būti didesnis už didžiausią imties reikšmę?',
        variantai: [
          'ne, jis visada yra tarp mažiausios ir didžiausios reikšmės',
          'taip, jei reikšmių daug',
          'taip, jei visos reikšmės lygios',
          'taip, jei imtis maža',
        ],
        teisingas: 0,
        sprendimas: 'Vidurkis yra tarsi tolygiai padalytas dydis, tad už kraštines reikšmes jis neišeina.',
      }),
  ])
}

// ── 12.2.1. Bandymas ir jo baigtys ──────────────────────────────────────────

const T3 = 'bandymas-ir-baigtys'

const A_BAIGTYS = [
  {
    klausimas: 'Kiek baigčių turi vienos monetos metimas?',
    atsakymas: '2',
    atsakymasRodymui: '$2$',
    sprendimas: 'Herbas arba skaičius.',
  },
] as const

export const bandymasIrBaigtys: Generatorius = () => suBandymais(kurkBaigtis, A_BAIGTYS, T3)

function kurkBaigtis(): Uzdavinys | null {
  const tamsiu = atsitiktinis(2, 8)
  const sviesiu = atsitiktinis(2, 8)

  return variacija([
    // 1. Monetos baigtys
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek baigčių turi vienos monetos metimas?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Iškrenta arba herbas, arba skaičius.',
        brezinys: moneta(pasirink(['herbas', 'skaicius'])),
      }),

    // 2. Kauliuko baigtys
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek baigčių turi vieno lošimo kauliuko metimas?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Gali iškristi nuo 1 iki 6 akučių.',
        brezinys: kauliukas(atsitiktinis(1, 6)),
      }),

    // 3. Kas yra baigtis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kas vadinama bandymo baigtimi?',
        variantai: [
          'vienas galimas bandymo rezultatas',
          'bandymo pakartojimų skaičius',
          'palankiausias rezultatas',
          'bandymo trukmė',
        ],
        teisingas: 0,
        sprendimas: 'Metant kauliuką baigtys yra 1, 2, 3, 4, 5 ir 6.',
      }),

    // 4. Palankios baigtys
    () =>
      uzdavinys(T3, {
        klausimas: 'Metamas lošimo kauliukas. Kiek yra baigčių, kai iškrenta lyginis akučių skaičius?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Tai 2, 4 ir 6 — trys baigtys.',
        brezinys: kauliukas(pasirink([2, 4, 6])),
      }),

    // 5. Maišelio baigtys
    () =>
      uzdavinys(T3, {
        klausimas: 'Iš maišelio traukiamas vienas rutuliukas. Kiek iš viso yra galimų baigčių?',
        atsakymas: String(tamsiu + sviesiu),
        atsakymasRodymui: `$${tamsiu + sviesiu}$`,
        sprendimas: `Kiekvienas rutuliukas yra atskira baigtis: $${tamsiu} + ${sviesiu} = ${tamsiu + sviesiu}$.`,
        brezinys: maiselis(tamsiu, sviesiu),
      }),

    // 6. Negalima baigtis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuri baigtis metant lošimo kauliuką yra negalima?',
        variantai: ['iškris 7 akutės', 'iškris 6 akutės', 'iškris 1 akutė', 'iškris lyginis skaičius'],
        teisingas: 0,
        sprendimas: 'Kauliukas turi tik šešias sienas su 1–6 akutėmis.',
      }),

    // 7. Dviejų monetų baigtys
    () =>
      uzdavinys(T3, {
        klausimas: 'Metamos dvi monetos. Kiek iš viso galimų baigčių?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'HH, HS, SH ir SS — keturios baigtys.',
      }),

    // 8. Tikra baigtis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuris įvykis metant lošimo kauliuką yra būtinas?',
        variantai: [
          'iškris nuo 1 iki 6 akučių',
          'iškris 6 akutės',
          'iškris lyginis skaičius',
          'iškris daugiau nei 6 akutės',
        ],
        teisingas: 0,
        sprendimas: 'Būtinas įvykis įvyksta visada — jo tikimybė lygi 1.',
      }),
  ])
}

// ── 12.2.2. Įvykio tikimybė ─────────────────────────────────────────────────

const T4 = 'ivykio-tikimybe'

const A_TIKIMYBE = [
  {
    klausimas: 'Kokia tikimybė metant kauliuką gauti 6 akutes?',
    atsakymas: '1/6',
    atsakymasRodymui: '$\\dfrac{1}{6}$',
    sprendimas: 'Palanki viena baigtis iš šešių.',
  },
] as const

export const ivykioTikimybe: Generatorius = () => suBandymais(kurkTikimybe, A_TIKIMYBE, T4)

function kurkTikimybe(): Uzdavinys | null {
  const tamsiu = atsitiktinis(2, 8)
  const sviesiu = atsitiktinis(2, 8)
  const viso = tamsiu + sviesiu
  const t = suprastink(tamsiu, viso)

  return variacija([
    // 1. Iš maišelio
    () =>
      uzdavinys(T4, {
        klausimas: 'Iš maišelio atsitiktinai traukiamas vienas rutuliukas. Kokia tikimybė ištraukti tamsų?',
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$\\dfrac{${t.skaitiklis}}{${t.vardiklis}}$`,
        sprendimas: `Palankios ${tamsiu} baigtys iš ${viso}: $\\dfrac{${tamsiu}}{${viso}}$.`,
        brezinys: maiselis(tamsiu, sviesiu),
      }),

    // 2. Kauliukas
    () => {
      const akutes = atsitiktinis(1, 6)
      return uzdavinys(T4, {
        klausimas: `Kokia tikimybė metant lošimo kauliuką gauti ${akutes} akutes?`,
        atsakymas: '1/6',
        atsakymasRodymui: '$\\dfrac{1}{6}$',
        sprendimas: 'Palanki viena baigtis iš šešių.',
        brezinys: kauliukas(akutes),
      })
    },

    // 3. Moneta
    () =>
      uzdavinys(T4, {
        klausimas: 'Kokia tikimybė metant monetą gauti herbą?',
        atsakymas: '1/2',
        atsakymasRodymui: '$\\dfrac{1}{2}$',
        sprendimas: 'Palanki viena baigtis iš dviejų.',
        brezinys: moneta('herbas'),
      }),

    // 4. Kaip skaičiuojama
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kaip apskaičiuojama įvykio tikimybė?',
        variantai: [
          'palankių baigčių skaičius dalijamas iš visų baigčių skaičiaus',
          'visų baigčių skaičius dalijamas iš palankių',
          'palankios baigtys sudedamos',
          'palankios baigtys dauginamos iš visų',
        ],
        teisingas: 0,
        sprendimas: 'Todėl tikimybė visada yra nuo 0 iki 1.',
      }),

    // 5. Lyginis kauliuko skaičius
    () =>
      uzdavinys(T4, {
        klausimas: 'Kokia tikimybė metant lošimo kauliuką gauti lyginį akučių skaičių?',
        atsakymas: '1/2',
        atsakymasRodymui: '$\\dfrac{1}{2}$',
        sprendimas: 'Palankios trys baigtys (2, 4, 6) iš šešių: $\\dfrac{3}{6} = \\dfrac{1}{2}$.',
      }),

    // 6. Negalimas ir būtinas įvykis
    () =>
      uzdavinys(T4, {
        klausimas: 'Kokia yra negalimo įvykio tikimybė?',
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Palankių baigčių nėra, tad $0 : n = 0$. Būtino įvykio tikimybė lygi 1.',
        brezinys: tikimybesSkale(0, 4, '?'),
      }),

    // 7. Priešingas įvykis
    () => {
      const s = suprastink(sviesiu, viso)
      return uzdavinys(T4, {
        klausimas: `Maišelyje ${tamsiu} tamsūs ir ${sviesiu} šviesūs rutuliukai. Kokia tikimybė ištraukti šviesų rutuliuką?`,
        atsakymas: `${s.skaitiklis}/${s.vardiklis}`,
        atsakymasRodymui: `$\\dfrac{${s.skaitiklis}}{${s.vardiklis}}$`,
        sprendimas: `Palankios ${sviesiu} baigtys iš ${viso}: $\\dfrac{${sviesiu}}{${viso}}$.`,
      })
    },

    // 8. Kuris įvykis tikėtinesnis
    () => {
      if (tamsiu === sviesiu) return null
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kurį rutuliuką tikėtiniau ištraukti iš maišelio?',
        variantai:
          tamsiu > sviesiu
            ? ['tamsų', 'šviesų', 'abu vienodai tikėtina']
            : ['šviesų', 'tamsų', 'abu vienodai tikėtina'],
        teisingas: 0,
        sprendimas: `Tamsių yra ${tamsiu}, šviesių — ${sviesiu}; kuo daugiau palankių baigčių, tuo didesnė tikimybė.`,
        brezinys: maiselis(tamsiu, sviesiu),
      })
    },
  ])
}
