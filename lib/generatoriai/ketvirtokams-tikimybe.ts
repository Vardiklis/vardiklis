import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import {
  bruksneliuLentele,
  kauliukas,
  maiselis,
  moneta,
  tikimybesSkale,
} from './ketvirtokams-duomenu-vaizdai'
import { D, kiek } from './ketvirtokams-bendra'
import { suktuvas } from './treciokams-algebros-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Tikimybė“ — dvylika potemių.
 *
 * Anksčiau jos rėmėsi `tikimybe`, `kombinatorika` ir `diagramos`
 * generatoriais, skirtais 8–10 klasėms: pasitaikydavo tikimybių daugybos ir
 * gretinių.
 *
 * Ketvirtoje klasėje tikimybė yra palyginimas, o ne skaičiavimas: kuri baigtis
 * labiau tikėtina, kada jos vienodai tikėtinos, kada įvykis negalimas. Skaičius
 * atsiranda tik paskutinėse potemėse, ir tai — paprasta trupmena arba 0 ir 1.
 */

// ── 12.1 Bandymas ir baigtis ────────────────────────────────────────────────

const T1 = 'bandymas-ir-baigtis'

const A_BANDYMAS = [
  {
    klausimas: 'Kiek baigčių turi vienas monetos metimas?',
    atsakymas: '2',
    atsakymasRodymui: '$2$',
    sprendimas: 'Herbas arba skaičius.',
  },
] as const

export const bandymasIrBaigtis: Generatorius = () => suBandymais(kurkBandyma, A_BANDYMAS, T1)

function kurkBandyma(): Uzdavinys | null {
  return variacija([
    // 1. Kas yra bandymas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kas vadinama bandymu?',
        variantai: [
          'veiksmas, kurio rezultato iš anksto nežinome',
          'veiksmas, kurio rezultatas visada tas pats',
          'skaičiavimas',
          'duomenų lentelė',
        ],
        teisingas: 0,
        sprendimas: 'Monetos metimas yra bandymas, nes iš anksto nežinia, kuri pusė iškris.',
        brezinys: moneta('herbas'),
      }),

    // 2. Kiek baigčių turi moneta
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek galimų baigčių turi vienas monetos metimas?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Gali iškristi herbas arba skaičius.',
        brezinys: moneta('skaicius'),
      }),

    // 3. Kiek baigčių turi kauliukas
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek galimų baigčių turi vienas kauliuko metimas?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Gali iškristi nuo vieno iki šešių akučių.',
        brezinys: kauliukas(atsitiktinis(1, 6)),
      }),

    // 4. Kas yra baigtis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kas vadinama bandymo baigtimi?',
        variantai: [
          'vienas galimas bandymo rezultatas',
          'bandymų skaičius',
          'bandymo trukmė',
          'taisyklė, pagal kurią bandoma',
        ],
        teisingas: 0,
        sprendimas: 'Metant kauliuką viena baigtis yra „iškrito 3“.',
      }),

    // 5. Ar tai bandymas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuris veiksmas yra bandymas?',
        variantai: [
          'traukti rutuliuką iš maišelio nežiūrint',
          'apskaičiuoti $12 + 5$',
          'išmatuoti stalo ilgį',
          'perskaityti laikrodžio rodmenį',
        ],
        teisingas: 0,
        sprendimas: 'Bandymo rezultato negalima žinoti iš anksto; skaičiavimas ir matavimas visada duoda tą patį.',
      }),

    // 6. Baigtys traukiant iš maišelio
    () => {
      const t = atsitiktinis(2, 5)
      const s = atsitiktinis(2, 5)
      return uzdavinys(T1, {
        klausimas: 'Kiek skirtingų spalvų rutuliuką galima ištraukti iš maišelio?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: `Maišelyje yra tik dviejų spalvų rutuliukai: ${t} raudoni ir ${s} balti.`,
        brezinys: maiselis(t, s),
      })
    },

    // 7. Kiek baigčių suktuke
    () => {
      const sektoriu = pasirink([4, 6, 8])
      const tamsiu = atsitiktinis(1, sektoriu - 1)
      const sektoriai = Array.from({ length: sektoriu }, (_, i) => ({
        spalva: (i < tamsiu ? 'tamsi' : 'sviesi') as 'tamsi' | 'sviesi',
      }))
      return uzdavinys(T1, {
        klausimas: 'Kiek sektorių turi suktukas?',
        atsakymas: String(sektoriu),
        atsakymasRodymui: `$${sektoriu}$`,
        sprendimas: 'Kiekvienas sektorius yra atskira galima baigtis.',
        brezinys: suktuvas(sektoriai),
      })
    },
  ])
}

// ── 12.2 Visos galimos baigtys ──────────────────────────────────────────────

const T2 = 'visos-baigtys'

const A_BAIGTYS = [
  {
    klausimas: 'Kiek galimų baigčių turi kauliuko metimas?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Nuo 1 iki 6 akučių.',
  },
] as const

export const visosBaigtys: Generatorius = () => suBandymais(kurkBaigtis, A_BAIGTYS, T2)

function kurkBaigtis(): Uzdavinys | null {
  return variacija([
    // 1. Kauliuko baigtys
    () =>
      uzdavinys(T2, {
        klausimas: 'Išvardyk visas galimas kauliuko metimo baigtis. Kiek jų yra?',
        atsakymas: '6',
        atsakymasRodymui: '$6$ (1, 2, 3, 4, 5, 6)',
        sprendimas: 'Kauliukas turi šešias sienas, tad ir baigčių šešios.',
        brezinys: kauliukas(atsitiktinis(1, 6)),
      }),

    // 2. Lyginės baigtys
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek kauliuko metimo baigčių yra lyginiai skaičiai?',
        atsakymas: '3',
        atsakymasRodymui: '$3$ (2, 4, 6)',
        sprendimas: 'Iš šešių baigčių lyginės yra trys.',
      }),

    // 3. Baigtys, didesnės už nurodytą
    () => {
      const riba = atsitiktinis(2, 5)
      return uzdavinys(T2, {
        klausimas: `Kiek kauliuko metimo baigčių yra didesnės už ${riba}?`,
        atsakymas: String(6 - riba),
        atsakymasRodymui: `$${6 - riba}$`,
        sprendimas: `Tai skaičiai nuo ${riba + 1} iki 6 — jų ${6 - riba}.`,
      })
    },

    // 4. Monetos baigtys
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kurios yra visos galimos vieno monetos metimo baigtys?',
        variantai: [
          'herbas ir skaičius',
          'herbas, skaičius ir kraštas',
          'tik herbas',
          'šešios baigtys',
        ],
        teisingas: 0,
        sprendimas: 'Moneta turi dvi puses.',
        brezinys: moneta('herbas'),
      }),

    // 5. Suktuko baigtys
    () => {
      const sektoriu = pasirink([4, 6, 8])
      const tamsiu = atsitiktinis(1, sektoriu - 1)
      const sektoriai = Array.from({ length: sektoriu }, (_, i) => ({
        spalva: (i < tamsiu ? 'tamsi' : 'sviesi') as 'tamsi' | 'sviesi',
      }))
      return uzdavinys(T2, {
        klausimas: 'Kiek tamsių sektorių turi suktukas?',
        atsakymas: String(tamsiu),
        atsakymasRodymui: `$${tamsiu}$`,
        sprendimas: `Iš ${sektoriu} sektorių tamsūs yra ${tamsiu}.`,
        brezinys: suktuvas(sektoriai),
      })
    },

    // 6. Baigtys traukiant iš maišelio
    () => {
      const t = atsitiktinis(2, 6)
      const s = atsitiktinis(2, 6)
      return uzdavinys(T2, {
        klausimas: 'Kiek iš viso rutuliukų yra maišelyje?',
        atsakymas: String(t + s),
        atsakymasRodymui: `$${t + s}$`,
        sprendimas: `$${t} + ${s} = ${t + s}$.`,
        brezinys: maiselis(t, s),
      })
    },

    // 7. Kodėl svarbu žinoti visas baigtis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kodėl prieš vertinant tikimybę reikia žinoti visas galimas baigtis?',
        variantai: [
          'kad būtų su kuo palyginti mus dominančią baigtį',
          'kad bandymas truktų trumpiau',
          'kad rezultatas būtų teisingas',
          'kad būtų galima braižyti diagramą',
        ],
        teisingas: 0,
        sprendimas: 'Tikimybė lyginama: kiek baigčių mums tinka iš visų galimų.',
      }),
  ])
}

// ── 12.3 Labiau tikėtina baigtis ────────────────────────────────────────────

const T3 = 'labiau-tiketina'

const A_LABIAU = [
  {
    klausimas: 'Maišelyje 5 raudoni ir 2 balti rutuliukai. Kurios spalvos ištraukimas labiau tikėtinas?',
    atsakymas: 'a',
    atsakymasRodymui: 'raudono',
    sprendimas: 'Raudonų daugiau, tad juos ištraukti tikimybė didesnė.',
  },
] as const

export const labiauTiketina: Generatorius = () => suBandymais(kurkLabiau, A_LABIAU, T3)

function kurkLabiau(): Uzdavinys | null {
  const t = atsitiktinis(2, 8)
  const s = atsitiktinis(2, 8)
  if (t === s) return null

  return variacija([
    // 1. Kurios spalvos labiau tikėtina
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kurios spalvos rutuliuką labiau tikėtina ištraukti nežiūrint?',
        variantai:
          t > s
            ? ['raudoną', 'baltą', 'abi vienodai tikėtinos']
            : ['baltą', 'raudoną', 'abi vienodai tikėtinos'],
        teisingas: 0,
        sprendimas: `Maišelyje ${kiek(t + s, D.rutuliukai)}, iš jų ${t} raudoni — labiau tikėtina ištraukti tą spalvą, kurios daugiau.`,
        brezinys: maiselis(t, s),
      }),

    // 2. Kiek daugiau
    () =>
      uzdavinys(T3, {
        klausimas: 'Keliais rutuliukais vienos spalvos maišelyje daugiau nei kitos?',
        atsakymas: String(Math.abs(t - s)),
        atsakymasRodymui: `$${Math.abs(t - s)}$`,
        sprendimas: `$${Math.max(t, s)} - ${Math.min(t, s)} = ${Math.abs(t - s)}$.`,
        brezinys: maiselis(t, s),
      }),

    // 3. Suktukas
    () => {
      const sektoriu = pasirink([6, 8])
      const tamsiu = atsitiktinis(1, sektoriu - 1)
      if (tamsiu * 2 === sektoriu) return null
      const sektoriai = Array.from({ length: sektoriu }, (_, i) => ({
        spalva: (i < tamsiu ? 'tamsi' : 'sviesi') as 'tamsi' | 'sviesi',
      }))
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kurioje spalvoje suktuko rodyklė sustos labiau tikėtinai?',
        variantai:
          tamsiu * 2 > sektoriu
            ? ['tamsioje', 'šviesioje', 'abi vienodai tikėtinos']
            : ['šviesioje', 'tamsioje', 'abi vienodai tikėtinos'],
        teisingas: 0,
        sprendimas: `Iš ${sektoriu} sektorių tamsūs ${tamsiu}, šviesūs ${sektoriu - tamsiu}.`,
        brezinys: suktuvas(sektoriai),
      })
    },

    // 4. Kauliuko baigtys
    () => {
      const riba = atsitiktinis(2, 4)
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Metant kauliuką, kas labiau tikėtina: iškris skaičius, didesnis už ${riba}, ar mažesnis už ${riba}?`,
        variantai:
          6 - riba > riba - 1
            ? [`didesnis už ${riba}`, `mažesnis už ${riba}`, 'abu vienodai tikėtini']
            : [`mažesnis už ${riba}`, `didesnis už ${riba}`, 'abu vienodai tikėtini'],
        teisingas: 0,
        sprendimas: `Didesnių už ${riba} yra ${6 - riba}, mažesnių — ${riba - 1}.`,
      })
    },

    // 5. Kiek reikia pridėti
    () =>
      uzdavinys(T3, {
        klausimas: `Maišelyje ${kiek(t + s, D.rutuliukai)}, iš jų ${t} raudoni. Kiek reikia pridėti tos spalvos, kurios mažiau, kad abiejų būtų po lygiai?`,
        atsakymas: String(Math.abs(t - s)),
        atsakymasRodymui: `$${Math.abs(t - s)}$`,
        sprendimas: `$${Math.max(t, s)} - ${Math.min(t, s)} = ${Math.abs(t - s)}$.`,
        brezinys: maiselis(t, s),
      }),

    // 6. Ką reiškia „labiau tikėtina“
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ką reiškia, kad viena baigtis labiau tikėtina už kitą?',
        variantai: [
          'kartojant bandymą daug kartų, ji pasitaikys dažniau',
          'ji tikrai įvyks',
          'kita baigtis niekada neįvyks',
          'ji įvyks pirmuoju bandymu',
        ],
        teisingas: 0,
        sprendimas: 'Labiau tikėtina baigtis nėra garantuota — tik dažnesnė iš daugelio bandymų.',
      }),

    // 7. Kada nebus dažnesnė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ar labiau tikėtina baigtis būtinai įvyks pirmuoju bandymu?',
        variantai: [
          'ne, vienas bandymas gali baigtis bet kaip',
          'taip, todėl ji ir vadinama tikėtina',
          'taip, jei bandymų daug',
        ],
        teisingas: 0,
        sprendimas: 'Tikimybė kalba apie daugelį bandymų, o ne apie vieną.',
      }),
  ])
}

// ── 12.4 Mažiau tikėtina baigtis ────────────────────────────────────────────

const T4 = 'maziau-tiketina'

const A_MAZIAU = [
  {
    klausimas: 'Maišelyje 7 raudoni ir 2 balti rutuliukai. Kurios spalvos ištraukimas mažiau tikėtinas?',
    atsakymas: 'a',
    atsakymasRodymui: 'balto',
    sprendimas: 'Baltų mažiau.',
  },
] as const

export const maziauTiketina: Generatorius = () => suBandymais(kurkMaziau, A_MAZIAU, T4)

function kurkMaziau(): Uzdavinys | null {
  const t = atsitiktinis(2, 9)
  const s = atsitiktinis(1, 9)
  if (t === s) return null

  return variacija([
    // 1. Kurios spalvos mažiau tikėtina
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kurios spalvos rutuliuką mažiau tikėtina ištraukti?',
        variantai:
          t < s
            ? ['raudoną', 'baltą', 'abi vienodai tikėtinos']
            : ['baltą', 'raudoną', 'abi vienodai tikėtinos'],
        teisingas: 0,
        sprendimas: `Rutuliukų: ${t} raudoni ir ${s} balti — mažiau tikėtina ta spalva, kurios mažiau.`,
        brezinys: maiselis(t, s),
      }),

    // 2. Negalima baigtis
    () => {
      const spalva = pasirink(['žalią', 'mėlyną', 'geltoną'])
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kokia tikimybė iš maišelio ištraukti ${spalva} rutuliuką?`,
        variantai: [
          'tai neįmanoma — tokios spalvos maišelyje nėra',
          'labai maža, bet įmanoma',
          'tokia pat kaip raudono',
        ],
        teisingas: 0,
        sprendimas: 'Maišelyje yra tik raudonų ir baltų rutuliukų.',
        brezinys: maiselis(t, s),
      })
    },

    // 3. Rečiausia kauliuko baigtis
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Metant kauliuką, kuri baigtis mažiau tikėtina?',
        variantai: [
          'iškris skaičius 7',
          'iškris skaičius 6',
          'iškris lyginis skaičius',
          'iškris skaičius, mažesnis už 4',
        ],
        teisingas: 0,
        sprendimas: 'Kauliuke nėra septynių akučių, tad tokia baigtis neįmanoma.',
      }),

    // 4. Kiek kartų mažiau
    () => {
      const didesnis = Math.max(t, s)
      const mazesnis = Math.min(t, s)
      if (didesnis % mazesnis !== 0 || didesnis === mazesnis) return null
      return uzdavinys(T4, {
        klausimas: 'Kiek kartų vienos spalvos rutuliukų maišelyje daugiau nei kitos?',
        atsakymas: String(didesnis / mazesnis),
        atsakymasRodymui: `$${didesnis / mazesnis}$`,
        sprendimas: `$${didesnis} : ${mazesnis} = ${didesnis / mazesnis}$.`,
        brezinys: maiselis(t, s),
      })
    },

    // 5. Kiek išimti
    () =>
      uzdavinys(T4, {
        klausimas: `Maišelyje ${kiek(t + s, D.rutuliukai)}, iš jų ${t} raudoni. Kiek gausiausios spalvos rutuliukų reikia išimti, kad abiejų liktų po lygiai?`,
        atsakymas: String(Math.abs(t - s)),
        atsakymasRodymui: `$${Math.abs(t - s)}$`,
        sprendimas: `$${Math.max(t, s)} - ${Math.min(t, s)} = ${Math.abs(t - s)}$.`,
        brezinys: maiselis(t, s),
      }),

    // 6. Suktuko rečiausias sektorius
    () => {
      const sektoriu = 8
      const tamsiu = pasirink([1, 2])
      const sektoriai = Array.from({ length: sektoriu }, (_, i) => ({
        spalva: (i < tamsiu ? 'tamsi' : 'sviesi') as 'tamsi' | 'sviesi',
      }))
      return uzdavinys(T4, {
        klausimas: 'Kiek suktuko sektorių yra tos spalvos, kurios sustoti mažiau tikėtina?',
        atsakymas: String(tamsiu),
        atsakymasRodymui: `$${tamsiu}$`,
        sprendimas: `Tamsių sektorių tik ${tamsiu} iš ${sektoriu}, tad juose sustoti mažiau tikėtina.`,
        brezinys: suktuvas(sektoriai),
      })
    },

    // 7. Ką reiškia „mažiau tikėtina“
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ką reiškia, kad baigtis mažiau tikėtina?',
        variantai: [
          'ji pasitaikys rečiau, bet vis tiek gali įvykti',
          'ji niekada neįvyks',
          'ji įvyks paskutinį kartą',
          'ji įvyks tik kartą',
        ],
        teisingas: 0,
        sprendimas: 'Mažiau tikėtina nėra tas pat kaip neįmanoma.',
      }),
  ])
}

// ── 12.5 Vienodai tikėtinos baigtys ─────────────────────────────────────────

const T5 = 'vienodai-tiketinos'

const A_VIENODAI = [
  {
    klausimas: 'Kada dvi baigtys yra vienodai tikėtinos?',
    atsakymas: 'a',
    atsakymasRodymui: 'kai joms palankių galimybių po lygiai',
    sprendimas: 'Monetos herbas ir skaičius vienodai tikėtini.',
  },
] as const

export const vienodaiTiketinos: Generatorius = () => suBandymais(kurkVienodai, A_VIENODAI, T5)

function kurkVienodai(): Uzdavinys | null {
  const puse = atsitiktinis(2, 7)

  return variacija([
    // 1. Kada vienodai tikėtinos
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kada dvi baigtys yra vienodai tikėtinos?',
        variantai: [
          'kai joms palankių galimybių yra po lygiai',
          'kai jos abi retos',
          'kai bandymų daug',
          'kai baigčių tik dvi',
        ],
        teisingas: 0,
        sprendimas: 'Svarbu ne baigčių pavadinimai, o kiek galimybių kiekvienai jų palanku.',
      }),

    // 2. Vienodas maišelis
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Ar vienodai tikėtina ištraukti raudoną ir baltą rutuliuką?',
        variantai: [
          'taip, jų po lygiai',
          'ne, raudonų daugiau',
          'ne, baltų daugiau',
        ],
        teisingas: 0,
        sprendimas: `Maišelyje po ${puse} kiekvienos spalvos rutuliukų.`,
        brezinys: maiselis(puse, puse),
      }),

    // 3. Moneta
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Ar metant monetą herbas ir skaičius vienodai tikėtini?',
        variantai: [
          'taip, moneta turi dvi vienodas puses',
          'ne, herbas iškrenta dažniau',
          'ne, skaičius iškrenta dažniau',
        ],
        teisingas: 0,
        sprendimas: 'Nė viena pusė neturi pranašumo.',
        brezinys: moneta('herbas'),
      }),

    // 4. Kauliukas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Ar metant kauliuką visos šešios baigtys vienodai tikėtinos?',
        variantai: [
          'taip, visos sienos vienodos',
          'ne, šešetas iškrenta rečiau',
          'ne, vienetas iškrenta dažniau',
        ],
        teisingas: 0,
        sprendimas: 'Taisyklingas kauliukas neturi palankesnės sienos.',
        brezinys: kauliukas(atsitiktinis(1, 6)),
      }),

    // 5. Kiek reikia, kad būtų vienodai
    () => {
      const t = atsitiktinis(3, 9)
      const s = atsitiktinis(1, t - 1)
      return uzdavinys(T5, {
        klausimas: `Maišelyje ${kiek(t + s, D.rutuliukai)}, iš jų ${t} raudoni. Kiek baltų reikia pridėti, kad abi spalvos taptų vienodai tikėtinos?`,
        atsakymas: String(t - s),
        atsakymasRodymui: `$${t - s}$`,
        sprendimas: `$${t} - ${s} = ${t - s}$.`,
        brezinys: maiselis(t, s),
      })
    },

    // 6. Vienodi sektoriai
    () => {
      const sektoriu = pasirink([4, 6, 8])
      const sektoriai = Array.from({ length: sektoriu }, (_, i) => ({
        spalva: (i < sektoriu / 2 ? 'tamsi' : 'sviesi') as 'tamsi' | 'sviesi',
      }))
      return uzdavinys(T5, {
        klausimas: 'Kiek suktuko sektorių yra kiekvienos spalvos, jei abi spalvos vienodai tikėtinos?',
        atsakymas: String(sektoriu / 2),
        atsakymasRodymui: `$${sektoriu / 2}$`,
        sprendimas: `Iš ${sektoriu} sektorių kiekvienai spalvai tenka po ${sektoriu / 2}.`,
        brezinys: suktuvas(sektoriai),
      })
    },

    // 7. Lyginis ir nelyginis
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Metant kauliuką, ar vienodai tikėtina, kad iškris lyginis ar nelyginis skaičius?',
        variantai: [
          'taip, lyginių ir nelyginių yra po tris',
          'ne, lyginių daugiau',
          'ne, nelyginių daugiau',
        ],
        teisingas: 0,
        sprendimas: 'Lyginiai: 2, 4, 6. Nelyginiai: 1, 3, 5.',
      }),
  ])
}

// ── 12.6 Bandymas su moneta ─────────────────────────────────────────────────

const T6 = 'bandymas-su-moneta'

const A_MONETA = [
  {
    klausimas: 'Kiek kartų iš 20 metimų maždaug turėtų iškristi herbas?',
    atsakymas: '10',
    atsakymasRodymui: 'apie $10$',
    sprendimas: 'Herbas ir skaičius vienodai tikėtini.',
  },
] as const

export const bandymasSuMoneta: Generatorius = () => suBandymais(kurkMonetosBandyma, A_MONETA, T6)

function kurkMonetosBandyma(): Uzdavinys | null {
  const metimu = pasirink([10, 20, 30, 40, 50])
  const herbu = Math.round(metimu / 2) + pasirink([-3, -2, -1, 1, 2, 3])

  return variacija([
    // 1. Kiek maždaug herbų
    () =>
      uzdavinys(T6, {
        klausimas: `Moneta metama ${metimu} kartų. Kiek maždaug kartų turėtų iškristi herbas?`,
        atsakymas: String(metimu / 2),
        atsakymasRodymui: `apie $${metimu / 2}$`,
        sprendimas: `Abi pusės vienodai tikėtinos: $${metimu} : 2 = ${metimu / 2}$.`,
      }),

    // 2. Kiek kartų iškrito skaičius
    () =>
      uzdavinys(T6, {
        klausimas: `Iš ${metimu} metimų herbas iškrito ${herbu} kartus. Kiek kartų iškrito skaičius?`,
        atsakymas: String(metimu - herbu),
        atsakymasRodymui: `$${metimu - herbu}$`,
        sprendimas: `$${metimu} - ${herbu} = ${metimu - herbu}$.`,
        brezinys: bruksneliuLentele([
          { vardas: 'Herbas', kiek: Math.min(herbu, 18) },
          { vardas: 'Skaičius', kiek: Math.min(metimu - herbu, 18) },
        ]),
      }),

    // 3. Ar rezultatas įtikimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Iš ${metimu} metimų herbas iškrito ${herbu} kartus. Ar toks rezultatas įtikimas?`,
        variantai: [
          `taip, tai beveik pusė iš ${metimu}`,
          'ne, turėjo iškristi lygiai pusė',
          'ne, herbas negali iškristi tiek kartų',
        ],
        teisingas: 0,
        sprendimas: `Tikėtina apie ${metimu / 2}, o gauta ${herbu} — skirtumas nedidelis.`,
      }),

    // 4. Ar galima žinoti iš anksto
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Ar galima iš anksto pasakyti, kuri pusė iškris kitą kartą?',
        variantai: [
          'ne, kiekvienas metimas nepriklauso nuo ankstesnių',
          'taip, jei prieš tai iškrito herbas, dabar bus skaičius',
          'taip, jei žinai, kiek kartų jau metei',
        ],
        teisingas: 0,
        sprendimas: 'Moneta „neprisimena“ ankstesnių metimų.',
        brezinys: moneta('skaicius'),
      }),

    // 5. Kiek skiriasi nuo tikėtino
    () =>
      uzdavinys(T6, {
        klausimas: `Tikėtasi apie ${metimu / 2} herbų, o gauta ${herbu}. Kiek skiriasi rezultatas nuo tikėtino?`,
        atsakymas: String(Math.abs(herbu - metimu / 2)),
        atsakymasRodymui: `$${Math.abs(herbu - metimu / 2)}$`,
        sprendimas: `$${Math.max(herbu, metimu / 2)} - ${Math.min(herbu, metimu / 2)} = ${Math.abs(herbu - metimu / 2)}$.`,
      }),

    // 6. Daugiau metimų
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kas nutinka rezultatui, kai monetą metame vis daugiau kartų?',
        variantai: [
          'herbų ir skaičių dalis vis labiau artėja prie pusės',
          'herbas pradeda iškristi dažniau',
          'rezultatas darosi vis atsitiktinesnis',
          'niekas nesikeičia',
        ],
        teisingas: 0,
        sprendimas: 'Kuo daugiau bandymų, tuo arčiau tikėtino santykio.',
      }),

    // 7. Dviejų monetų metimas
    () =>
      uzdavinys(T6, {
        klausimas: 'Kiek skirtingų baigčių gaunama metant dvi monetas iš karto?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Herbas–herbas, herbas–skaičius, skaičius–herbas, skaičius–skaičius.',
      }),
  ])
}

// ── 12.7 Bandymas su kauliuku ───────────────────────────────────────────────

const T7 = 'bandymas-su-kauliuku'

const A_KAULIUKAS = [
  {
    klausimas: 'Kiek kartų iš 60 metimų maždaug turėtų iškristi šešetas?',
    atsakymas: '10',
    atsakymasRodymui: 'apie $10$',
    sprendimas: '$60 : 6 = 10$.',
  },
] as const

export const bandymasSuKauliuku: Generatorius = () =>
  suBandymais(kurkKauliukoBandyma, A_KAULIUKAS, T7)

function kurkKauliukoBandyma(): Uzdavinys | null {
  const metimu = pasirink([12, 18, 24, 30, 60])
  const akutes = atsitiktinis(1, 6)

  return variacija([
    // 1. Kiek maždaug kartų
    () =>
      uzdavinys(T7, {
        klausimas: `Kauliukas metamas ${metimu} kartų. Kiek maždaug kartų turėtų iškristi ${akutes}?`,
        atsakymas: String(metimu / 6),
        atsakymasRodymui: `apie $${metimu / 6}$`,
        sprendimas: `Baigčių šešios, visos vienodai tikėtinos: $${metimu} : 6 = ${metimu / 6}$.`,
        brezinys: kauliukas(akutes),
      }),

    // 2. Lyginis skaičius
    () =>
      uzdavinys(T7, {
        klausimas: `Kauliukas metamas ${metimu} kartų. Kiek maždaug kartų turėtų iškristi lyginis skaičius?`,
        atsakymas: String(metimu / 2),
        atsakymasRodymui: `apie $${metimu / 2}$`,
        sprendimas: `Lyginių baigčių trys iš šešių, tai yra pusė: $${metimu} : 2 = ${metimu / 2}$.`,
      }),

    // 3. Kiek kartų iškrito kita
    () => {
      const gauta = Math.round(metimu / 6) + pasirink([-2, -1, 1, 2])
      if (gauta < 0 || gauta > metimu) return null
      return uzdavinys(T7, {
        klausimas: `Kauliukas mestas ${metimu} kartų, ir ${akutes} iškrito ${gauta} kartus. Kiek kartų iškrito kiti skaičiai?`,
        atsakymas: String(metimu - gauta),
        atsakymasRodymui: `$${metimu - gauta}$`,
        sprendimas: `$${metimu} - ${gauta} = ${metimu - gauta}$.`,
      })
    },

    // 4. Ar septynetas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kiek kartų iš šimto metimų iškris septynetas?',
        variantai: ['nė karto — tokios baigties nėra', 'apie 16', 'apie 10', 'apie 1'],
        teisingas: 0,
        sprendimas: 'Kauliukas turi tik šešias sienas.',
        brezinys: kauliukas(6),
      }),

    // 5. Daugiau nei nurodytas
    () => {
      const riba = atsitiktinis(2, 5)
      if (metimu % 6 !== 0) return null
      return uzdavinys(T7, {
        klausimas: `Kauliukas metamas ${metimu} kartų. Kiek maždaug kartų iškris skaičius, didesnis už ${riba}?`,
        atsakymas: String(((6 - riba) * metimu) / 6),
        atsakymasRodymui: `apie $${((6 - riba) * metimu) / 6}$`,
        sprendimas: `Tinka ${6 - riba} baigtys iš 6: $${metimu} : 6 \\cdot ${6 - riba} = ${((6 - riba) * metimu) / 6}$.`,
      })
    },

    // 6. Rezultatų lentelė
    () => {
      const kiekiai = [atsitiktinis(2, 8), atsitiktinis(2, 8), atsitiktinis(2, 8)]
      const viso = kiekiai.reduce((s, x) => s + x, 0)
      return uzdavinys(T7, {
        klausimas: 'Kiek iš viso kartų buvo mestas kauliukas per šį bandymą?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${kiekiai.join(' + ')} = ${viso}$.`,
        brezinys: bruksneliuLentele([
          { vardas: 'Iškrito 1–2', kiek: kiekiai[0] },
          { vardas: 'Iškrito 3–4', kiek: kiekiai[1] },
          { vardas: 'Iškrito 5–6', kiek: kiekiai[2] },
        ]),
      })
    },

    // 7. Ar rezultatas įrodo, kad kauliukas netaisyklingas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Metus kauliuką 12 kartų, šešetas iškrito 4 kartus. Ar tai reiškia, kad kauliukas netaisyklingas?',
        variantai: [
          'ne, per tiek metimų nukrypimai įprasti',
          'taip, turėjo iškristi lygiai 2 kartus',
          'taip, šešetas iškrenta rečiau',
        ],
        teisingas: 0,
        sprendimas: 'Tikėtina apie 2 kartus, bet 12 metimų — per mažai, kad nukrypimas ką nors įrodytų.',
      }),
  ])
}

// ── 12.8 Bandymas su suktuku ────────────────────────────────────────────────

const T8 = 'bandymas-su-suktuku'

const A_SUKTUKAS = [
  {
    klausimas: 'Suktuke 4 sektoriai, iš jų 1 tamsus. Kiek kartų iš 20 sukimų rodyklė maždaug sustos tamsiame?',
    atsakymas: '5',
    atsakymasRodymui: 'apie $5$',
    sprendimas: '$20 : 4 = 5$.',
  },
] as const

export const bandymasSuSuktuku: Generatorius = () => suBandymais(kurkSuktuka, A_SUKTUKAS, T8)

function kurkSuktuka(): Uzdavinys | null {
  const sektoriu = pasirink([4, 6, 8])
  const tamsiu = atsitiktinis(1, sektoriu - 1)
  const sektoriai = Array.from({ length: sektoriu }, (_, i) => ({
    spalva: (i < tamsiu ? 'tamsi' : 'sviesi') as 'tamsi' | 'sviesi',
  }))
  const sukimu = sektoriu * pasirink([3, 4, 5])

  return variacija([
    // 1. Kiek maždaug kartų tamsiame
    () =>
      uzdavinys(T8, {
        klausimas: `Suktukas sukamas ${sukimu} kartų. Kiek maždaug kartų rodyklė sustos tamsiame sektoriuje?`,
        atsakymas: String((sukimu / sektoriu) * tamsiu),
        atsakymasRodymui: `apie $${(sukimu / sektoriu) * tamsiu}$`,
        sprendimas: `Vienam sektoriui tenka $${sukimu} : ${sektoriu} = ${sukimu / sektoriu}$ sukimai, o tamsių sektorių ${tamsiu}.`,
        brezinys: suktuvas(sektoriai),
      }),

    // 2. Kiek tamsių sektorių
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek tamsių sektorių turi suktukas?',
        atsakymas: String(tamsiu),
        atsakymasRodymui: `$${tamsiu}$`,
        sprendimas: `Iš ${sektoriu} sektorių tamsūs ${tamsiu}.`,
        brezinys: suktuvas(sektoriai),
      }),

    // 3. Kokią dalį sudaro tamsūs
    () => {
      if (sektoriu % tamsiu !== 0) return null
      return uzdavinys(T8, {
        klausimas: 'Kelintą suktuko dalį sudaro tamsūs sektoriai?',
        atsakymas: String(sektoriu / tamsiu),
        atsakymasRodymui: `$\\dfrac{1}{${sektoriu / tamsiu}}$`,
        sprendimas: `$${tamsiu}$ iš $${sektoriu}$ yra viena ${sektoriu / tamsiu}-oji dalis.`,
        brezinys: suktuvas(sektoriai),
      })
    },

    // 4. Kuri spalva dažnesnė
    () => {
      if (tamsiu * 2 === sektoriu) return null
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kurioje spalvoje rodyklė sustos dažniau, jei suktuką suksime daug kartų?',
        variantai:
          tamsiu * 2 > sektoriu
            ? ['tamsioje', 'šviesioje', 'abiejose vienodai']
            : ['šviesioje', 'tamsioje', 'abiejose vienodai'],
        teisingas: 0,
        sprendimas: `Tamsių sektorių ${tamsiu}, šviesių — ${sektoriu - tamsiu}.`,
        brezinys: suktuvas(sektoriai),
      })
    },

    // 5. Kiek kartų šviesiame
    () =>
      uzdavinys(T8, {
        klausimas: `Iš ${sukimu} sukimų rodyklė tamsiame sektoriuje sustojo ${(sukimu / sektoriu) * tamsiu} kartus. Kiek kartų ji sustojo šviesiame?`,
        atsakymas: String(sukimu - (sukimu / sektoriu) * tamsiu),
        atsakymasRodymui: `$${sukimu - (sukimu / sektoriu) * tamsiu}$`,
        sprendimas: `$${sukimu} - ${(sukimu / sektoriu) * tamsiu} = ${sukimu - (sukimu / sektoriu) * tamsiu}$.`,
      }),

    // 6. Sąžiningas suktukas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kada suktukas laikomas sąžiningu?',
        variantai: [
          'kai visi sektoriai vienodo dydžio',
          'kai sektorių yra lyginis skaičius',
          'kai jis greitai sukasi',
          'kai spalvų tik dvi',
        ],
        teisingas: 0,
        sprendimas: 'Didesniame sektoriuje rodyklė sustoja dažniau.',
      }),

    // 7. Kiek sektorių reikia
    () => {
      if (sektoriu % 2 !== 0) return null
      return uzdavinys(T8, {
        klausimas: `Suktukas turi ${sektoriu} sektorius. Kiek jų turi būti tamsių, kad abi spalvos būtų vienodai tikėtinos?`,
        atsakymas: String(sektoriu / 2),
        atsakymasRodymui: `$${sektoriu / 2}$`,
        sprendimas: `$${sektoriu} : 2 = ${sektoriu / 2}$.`,
      })
    },
  ])
}

// ── 12.9 Bandymo rezultatų užrašymas ────────────────────────────────────────

const T9 = 'bandymo-rezultatai'

const A_REZULTATAI = [
  {
    klausimas: 'Kaip patogiausia užrašyti bandymo rezultatus?',
    atsakymas: 'a',
    atsakymasRodymui: 'brūkšnelių lentelėje',
    sprendimas: 'Brūkšnelį pažymėti greita, o paskui lengva suskaičiuoti.',
  },
] as const

export const bandymoRezultatai: Generatorius = () =>
  suBandymais(kurkRezultatus, A_REZULTATAI, T9)

function kurkRezultatus(): Uzdavinys | null {
  const kiekiai = [atsitiktinis(4, 14), atsitiktinis(4, 14), atsitiktinis(3, 12)]
  const viso = kiekiai.reduce((s, x) => s + x, 0)
  const eilutes = [
    { vardas: 'Raudona', kiek: kiekiai[0] },
    { vardas: 'Balta', kiek: kiekiai[1] },
    { vardas: 'Mėlyna', kiek: kiekiai[2] },
  ]

  return variacija([
    // 1. Kaip užrašyti
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kaip patogiausia užrašyti bandymo rezultatus jį atliekant?',
        variantai: [
          'brūkšnelių lentelėje',
          'iš karto skritulinėje diagramoje',
          'įsiminti mintinai',
          'surašyti sakiniais',
        ],
        teisingas: 0,
        sprendimas: 'Brūkšnelį pažymėti greita, o paskui jį lengva suskaičiuoti.',
        brezinys: bruksneliuLentele(eilutes),
      }),

    // 2. Kiek kartų atliktas bandymas
    () =>
      uzdavinys(T9, {
        klausimas: 'Kiek kartų iš viso buvo atliktas bandymas?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${kiekiai.join(' + ')} = ${viso}$.`,
        brezinys: bruksneliuLentele(eilutes),
      }),

    // 3. Dažniausia baigtis
    () => {
      const maks = Math.max(...kiekiai)
      if (kiekiai.filter((x) => x === maks).length > 1) return null
      const variantai = sumaisyk(eilutes.map((e) => e.vardas))
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kuri baigtis pasitaikė dažniausiai?',
        variantai,
        teisingas: variantai.indexOf(eilutes[kiekiai.indexOf(maks)].vardas),
        sprendimas: `Daugiausia brūkšnelių — ${maks}.`,
        brezinys: bruksneliuLentele(eilutes),
      })
    },

    // 4. Kiek kartų nurodyta baigtis
    () => {
      const i = atsitiktinis(0, 2)
      return uzdavinys(T9, {
        klausimas: `Kiek kartų pasitaikė baigtis „${eilutes[i].vardas}“?`,
        atsakymas: String(kiekiai[i]),
        atsakymasRodymui: `$${kiekiai[i]}$`,
        sprendimas: `Suskaičiuojami brūkšneliai: $${Math.floor(kiekiai[i] / 5)} \\cdot 5 + ${kiekiai[i] % 5} = ${kiekiai[i]}$.`,
        brezinys: bruksneliuLentele(eilutes),
      })
    },

    // 5. Skirtumas
    () => {
      if (kiekiai[0] === kiekiai[1]) return null
      return uzdavinys(T9, {
        klausimas: `Keliais kartais „${eilutes[0].vardas}“ pasitaikė dažniau ar rečiau nei „${eilutes[1].vardas}“?`,
        atsakymas: String(Math.abs(kiekiai[0] - kiekiai[1])),
        atsakymasRodymui: `$${Math.abs(kiekiai[0] - kiekiai[1])}$`,
        sprendimas: `$${Math.max(kiekiai[0], kiekiai[1])} - ${Math.min(kiekiai[0], kiekiai[1])} = ${Math.abs(kiekiai[0] - kiekiai[1])}$.`,
        brezinys: bruksneliuLentele(eilutes),
      })
    },

    // 6. Ko negalima praleisti
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Ką būtina užrašyti kartu su bandymo rezultatais?',
        variantai: [
          'kiek kartų bandymas buvo atliktas',
          'kokios spalvos pieštuku rašyta',
          'kada bandymas prasidėjo',
          'kas skaičiavo brūkšnelius',
        ],
        teisingas: 0,
        sprendimas: 'Be bandymų skaičiaus neaišku, ar 8 kartai yra daug, ar mažai.',
      }),

    // 7. Iš lentelės į diagramą
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kokia diagrama patogiausiai parodytų šio bandymo rezultatus?',
        variantai: ['stulpelinė', 'linijinė', 'skaičių tiesė', 'jokia'],
        teisingas: 0,
        sprendimas: 'Lyginami trijų baigčių dažniai, tad tinka stulpeliai.',
        brezinys: bruksneliuLentele(eilutes),
      }),
  ])
}

// ── 12.10 Spėjimas ir eksperimentas ─────────────────────────────────────────

const T10 = 'spejimas-ir-eksperimentas'

const A_SPEJIMAS = [
  {
    klausimas: 'Metant monetą 20 kartų tikėtasi 10 herbų, o gauta 12. Kiek skiriasi rezultatas?',
    atsakymas: '2',
    atsakymasRodymui: '$2$',
    sprendimas: '$12 - 10 = 2$.',
  },
] as const

export const spejimasIrEksperimentas: Generatorius = () =>
  suBandymais(kurkSpejima, A_SPEJIMAS, T10)

function kurkSpejima(): Uzdavinys | null {
  const metimu = pasirink([20, 30, 40, 60])
  const tiketasi = metimu / 2
  const gauta = tiketasi + pasirink([-5, -4, -3, 3, 4, 5])

  return variacija([
    // 1. Kiek skiriasi
    () =>
      uzdavinys(T10, {
        klausimas: `Metant monetą ${metimu} kartų tikėtasi ${tiketasi} herbų, o gauta ${gauta}. Kiek rezultatas skiriasi nuo spėjimo?`,
        atsakymas: String(Math.abs(gauta - tiketasi)),
        atsakymasRodymui: `$${Math.abs(gauta - tiketasi)}$`,
        sprendimas: `$${Math.max(gauta, tiketasi)} - ${Math.min(gauta, tiketasi)} = ${Math.abs(gauta - tiketasi)}$.`,
      }),

    // 2. Ar spėjimas pasitvirtino
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Tikėtasi apie ${tiketasi} herbų, gauta ${gauta}. Ar spėjimas pasitvirtino?`,
        variantai: [
          'taip, rezultatas artimas tikėtam',
          'ne, turėjo būti lygiai tiek pat',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Atsitiktiniame bandyme tikslus sutapimas nebūtinas — svarbu, kad rezultatas būtų netoli.',
      }),

    // 3. Koks būtų spėjimas
    () => {
      const sektoriu = 4
      const sukimu = sektoriu * atsitiktinis(4, 10)
      return uzdavinys(T10, {
        klausimas: `Suktukas su ${sektoriu} vienodais sektoriais sukamas ${sukimu} kartų. Kiek kartų tikitės, kad rodyklė sustos viename konkrečiame sektoriuje?`,
        atsakymas: String(sukimu / sektoriu),
        atsakymasRodymui: `apie $${sukimu / sektoriu}$`,
        sprendimas: `$${sukimu} : ${sektoriu} = ${sukimu / sektoriu}$.`,
      })
    },

    // 4. Kada spėjimas tikslesnis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kada eksperimento rezultatas būna artimesnis spėjimui?',
        variantai: [
          'kai bandymų atliekama daugiau',
          'kai bandymų atliekama mažiau',
          'kai bandymus atlieka keli žmonės',
          'kai bandymai atliekami greičiau',
        ],
        teisingas: 0,
        sprendimas: 'Keli bandymai gali duoti bet ką, o iš daugelio išryškėja dėsningumas.',
      }),

    // 5. Palyginti su lentele
    () => {
      const a = atsitiktinis(6, 14)
      const b = atsitiktinis(6, 14)
      if (a === b) return null
      return uzdavinys(T10, {
        klausimas: 'Kiek iš viso kartų buvo mesta moneta šiame bandyme?',
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$.`,
        brezinys: bruksneliuLentele([
          { vardas: 'Herbas', kiek: a },
          { vardas: 'Skaičius', kiek: b },
        ]),
      })
    },

    // 6. Klaidingas spėjimas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Mokinys spėja: „Jei penkis kartus iškrito herbas, šeštą kartą tikrai bus skaičius.“ Ar jis teisus?',
        variantai: [
          'ne, kiekvienas metimas nepriklauso nuo ankstesnių',
          'taip, turi išsilyginti',
          'taip, jei moneta taisyklinga',
        ],
        teisingas: 0,
        sprendimas: 'Moneta neprisimena ankstesnių metimų — tikimybė lieka ta pati.',
      }),

    // 7. Ką parodo skirtumas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Ką rodo didelis skirtumas tarp spėjimo ir eksperimento rezultato?',
        variantai: [
          'gali būti, kad bandymų per mažai arba priemonė nesąžininga',
          'kad spėjimas visada klaidingas',
          'kad eksperimentas atliktas neteisingai',
          'nieko nerodo',
        ],
        teisingas: 0,
        sprendimas: 'Prieš darant išvadą verta bandymą pakartoti daugiau kartų.',
      }),
  ])
}

// ── 12.11 Tikimybė skaičiumi nuo 0 iki 1 ────────────────────────────────────

const T11 = 'tikimybe-skaiciumi'

const A_SKAICIUMI = [
  {
    klausimas: 'Kokiu skaičiumi žymima neįmanomo įvykio tikimybė?',
    atsakymas: '0',
    atsakymasRodymui: '$0$',
    sprendimas: 'Neįmanomas įvykis niekada neįvyksta.',
  },
] as const

export const tikimybeSkaiciumi: Generatorius = () =>
  suBandymais(kurkTikimybeSkaiciumi, A_SKAICIUMI, T11)

function kurkTikimybeSkaiciumi(): Uzdavinys | null {
  const viso = pasirink([4, 5, 8, 10])
  const palankiu = atsitiktinis(1, viso - 1)

  return variacija([
    // 1. Neįmanomas įvykis
    () =>
      uzdavinys(T11, {
        klausimas: 'Kokiu skaičiumi žymima neįmanomo įvykio tikimybė?',
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Neįmanomas įvykis niekada neįvyksta, tad jo tikimybė yra nulis.',
        brezinys: tikimybesSkale(0, viso, '0'),
      }),

    // 2. Būtinas įvykis
    () =>
      uzdavinys(T11, {
        klausimas: 'Kokiu skaičiumi žymima būtino įvykio tikimybė?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Būtinas įvykis įvyksta visada, tad jo tikimybė yra vienetas.',
        brezinys: tikimybesSkale(viso, viso, '1'),
      }),

    // 3. Kur skalėje
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Maišelyje ${kiek(viso, D.rutuliukai)}, iš jų ${palankiu} raudoni. Kur skalėje nuo 0 iki 1 yra raudono ištraukimo tikimybė?`,
        variantai:
          palankiu * 2 < viso
            ? ['arčiau nulio', 'arčiau vieneto', 'tiksliai per vidurį']
            : palankiu * 2 > viso
              ? ['arčiau vieneto', 'arčiau nulio', 'tiksliai per vidurį']
              : ['tiksliai per vidurį', 'arčiau nulio', 'arčiau vieneto'],
        teisingas: 0,
        sprendimas: `Palankių baigčių ${palankiu} iš ${viso}.`,
        brezinys: tikimybesSkale(palankiu, viso),
      }),

    // 4. Tikimybė trupmena
    () =>
      uzdavinys(T11, {
        klausimas: `Maišelyje ${kiek(viso, D.rutuliukai)}, iš jų ${palankiu} raudoni. Kiek yra palankių baigčių raudonam ištraukti?`,
        atsakymas: String(palankiu),
        atsakymasRodymui: `$${palankiu}$ iš $${viso}$`,
        sprendimas: `Palankios yra tos baigtys, kai ištraukiamas raudonas rutuliukas — jų ${palankiu}.`,
        brezinys: maiselis(palankiu, viso - palankiu),
      }),

    // 5. Pusė
    () => {
      if (viso % 2 !== 0) return null
      return pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kokiu skaičiumi žymima tikimybė įvykio, kuris įvyksta lygiai pusėje bandymų?',
        variantai: ['$\\dfrac{1}{2}$', '$0$', '$1$', '$2$'],
        teisingas: 0,
        sprendimas: 'Pusė yra tarp nulio ir vieneto.',
        brezinys: tikimybesSkale(viso / 2, viso, '½'),
      })
    },

    // 6. Ar gali būti didesnė už 1
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Ar tikimybė gali būti didesnė už 1?',
        variantai: [
          'ne, didžiausia tikimybė yra 1',
          'taip, jei įvykis labai tikėtinas',
          'taip, jei bandymų daug',
        ],
        teisingas: 0,
        sprendimas: 'Palankių baigčių negali būti daugiau, nei yra visų galimų.',
      }),

    // 7. Kauliuko tikimybė
    () =>
      uzdavinys(T11, {
        klausimas: 'Kiek yra palankių baigčių, kad metant kauliuką iškris lyginis skaičius?',
        atsakymas: '3',
        atsakymasRodymui: '$3$ iš $6$',
        sprendimas: 'Lyginiai skaičiai yra 2, 4 ir 6.',
        brezinys: kauliukas(4),
      }),
  ])
}

// ── 12.12 Sąžiningas tikimybinis žaidimas ───────────────────────────────────

const T12 = 'sazingas-zaidimas'

const A_ZAIDIMAS = [
  {
    klausimas: 'Kada tikimybinis žaidimas yra sąžiningas?',
    atsakymas: 'a',
    atsakymasRodymui: 'kai visų žaidėjų laimėjimo galimybės vienodos',
    sprendimas: 'Sąžiningame žaidime niekas neturi pranašumo.',
  },
] as const

export const sazingasZaidimas: Generatorius = () => suBandymais(kurkZaidima, A_ZAIDIMAS, T12)

function kurkZaidima(): Uzdavinys | null {
  const viso = pasirink([6, 8, 10, 12])
  const pirmam = atsitiktinis(1, viso - 1)

  return variacija([
    // 1. Kada žaidimas sąžiningas
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kada tikimybinis žaidimas yra sąžiningas?',
        variantai: [
          'kai visų žaidėjų laimėjimo galimybės vienodos',
          'kai žaidėjų yra du',
          'kai naudojamas kauliukas',
          'kai laimi tas, kas pradeda',
        ],
        teisingas: 0,
        sprendimas: 'Jei vienam žaidėjui palankių baigčių daugiau, žaidimas nesąžiningas.',
      }),

    // 2. Ar žaidimas sąžiningas
    () => {
      if (pirmam * 2 === viso) return null
      return pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Maišelyje ${kiek(viso, D.rutuliukai)}. Pirmasis žaidėjas laimi, jei ištraukiamas vienas iš ${pirmam} raudonų, antrasis — jei vienas iš ${viso - pirmam} baltų. Ar žaidimas sąžiningas?`,
        variantai: [
          `ne, laimėjimo galimybės nevienodos (${pirmam} ir ${viso - pirmam})`,
          'taip, abu turi po vieną spalvą',
          'taip, nes traukiama nežiūrint',
        ],
        teisingas: 0,
        sprendimas: `Sąžiningame žaidime abiem tektų po ${viso / 2} rutuliukus.`,
        brezinys: maiselis(pirmam, viso - pirmam),
      })
    },

    // 3. Kaip padaryti sąžiningą
    () => {
      if (viso % 2 !== 0) return null
      return uzdavinys(T12, {
        klausimas: `Maišelyje ${kiek(viso, D.rutuliukai)}. Kiek jų turi būti raudonų, kad žaidimas dviem žaidėjams būtų sąžiningas?`,
        atsakymas: String(viso / 2),
        atsakymasRodymui: `$${viso / 2}$`,
        sprendimas: `$${viso} : 2 = ${viso / 2}$.`,
      })
    },

    // 4. Kiek rutuliukų pakeisti
    () => {
      if (viso % 2 !== 0 || pirmam === viso / 2) return null
      return uzdavinys(T12, {
        klausimas: `Maišelyje ${kiek(viso, D.rutuliukai)}, iš jų ${pirmam} raudoni. Kiek rutuliukų reikia pakeisti kita spalva, kad žaidimas taptų sąžiningas?`,
        atsakymas: String(Math.abs(viso / 2 - pirmam)),
        atsakymasRodymui: `$${Math.abs(viso / 2 - pirmam)}$`,
        sprendimas: `Kiekvienai spalvai turi tekti po ${viso / 2}, o dabar raudonų ${pirmam}.`,
        brezinys: maiselis(pirmam, viso - pirmam),
      })
    },

    // 5. Kauliuko žaidimas
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Pirmasis žaidėjas laimi, jei iškrenta lyginis skaičius, antrasis — jei nelyginis. Ar žaidimas sąžiningas?',
        variantai: [
          'taip, abiem tenka po tris baigtis',
          'ne, lyginių daugiau',
          'ne, nelyginių daugiau',
        ],
        teisingas: 0,
        sprendimas: 'Lyginiai: 2, 4, 6. Nelyginiai: 1, 3, 5.',
        brezinys: kauliukas(atsitiktinis(1, 6)),
      }),

    // 6. Nesąžiningas suktukas
    () => {
      const sektoriu = 8
      const tamsiu = pasirink([2, 3])
      const sektoriai = Array.from({ length: sektoriu }, (_, i) => ({
        spalva: (i < tamsiu ? 'tamsi' : 'sviesi') as 'tamsi' | 'sviesi',
      }))
      return uzdavinys(T12, {
        klausimas: `Suktuke ${sektoriu} sektoriai. Kiek tamsių sektorių reikėtų pridėti, kad žaidimas dviem žaidėjams taptų sąžiningas?`,
        atsakymas: String(sektoriu / 2 - tamsiu),
        atsakymasRodymui: `$${sektoriu / 2 - tamsiu}$`,
        sprendimas: `Sąžiningame žaidime tamsių turėtų būti ${sektoriu / 2}, o dabar jų ${tamsiu}.`,
        brezinys: suktuvas(sektoriai),
      })
    },

    // 7. Susieti su sąžiningumu
    () =>
      poruUzdavinys(naujasId(T12), T12, {
        klausimas: 'Susiek žaidimo priemonę su tuo, kada ji sąžininga.',
        poros: [
          { kaire: 'moneta', desine: 'abi pusės vienodos' },
          { kaire: 'kauliukas', desine: 'visos šešios sienos vienodos' },
          { kaire: 'suktukas', desine: 'visi sektoriai vienodo dydžio' },
        ],
        sprendimas: 'Kiekvienu atveju sąžiningumas reiškia, kad nė viena baigtis neturi pranašumo.',
      }),
  ])
}
