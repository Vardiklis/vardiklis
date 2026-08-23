import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import {
  algoritmoTinklelis,
  diagramaSuPadala,
  duomenuLentele,
  laikoJuosta,
  suktuvas,
  vezliukoKelias,
} from './treciokams-algebros-vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 3 klasės temos „Duomenys. Algoritmai“ ir „Tyrinėju reiškinį „Knyga““.
 *
 * Anksčiau jos rėmėsi `diagramos`, `tikimybe`, `algoritmai` ir
 * `skaiciu-palyginimas` generatoriais. `diagramos` piešdavo diagramą su padala
 * po vienetą, tad klausimas „kokia padalos vertė?“ neturėdavo prasmės, o
 * `tikimybe` skaičiuodavo tikimybę trupmena — trečioje klasėje tikėtinumas dar
 * tik įvardijamas žodžiais.
 *
 * Diagramose padalos visur vienodos, o jų vertė tekste neužrašoma: kaip tik ją
 * dažniausiai ir reikia nustatyti.
 */

const DALYKAI = ['Matematika', 'Dailė', 'Muzika', 'Sportas', 'Skaitymas'] as const
const MENESIAI = ['Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis', 'Sausis', 'Vasaris'] as const
const VAIKAI = ['Matas', 'Ieva', 'Emilis', 'Luknė', 'Greta'] as const

function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 1000, 1000)
}

/** „Knyga“ temos sritis siekia 10 000 — ten skaičiuojami metai ir tiražai. */
function ribaKnyga(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 10000, 10000)
}

// ── 10.1 Kokia gali būti diagramos padalos vertė? ───────────────────────────

const A_PADALOS_VERTE = [
  {
    klausimas: 'Diagramos ašyje pažymėta 0, 5, 10, 15, 20. Kokia vienos padalos vertė?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Tarp gretimų žymų skirtumas yra 5.',
  },
] as const

export const padalosVerte: Generatorius = () =>
  suBandymais(kurkPadalosVerte, A_PADALOS_VERTE, 'padalos-verte')

function kurkPadalosVerte(): Uzdavinys | null {
  const padala = pasirink([2, 4, 5, 10])
  const stulpeliai = sumaisyk([...DALYKAI])
    .slice(0, 4)
    .map((v) => ({ vardas: v, reiksme: padala * atsitiktinis(1, 6) }))

  return variacija([
    // 1. Kokia padalos vertė
    () =>
      uzdavinys('padalos-verte', {
        // Padalos vertė tekste neužrašoma — ją reikia nustatyti iš ašies žymų.
        klausimas: 'Kokia yra vienos diagramos padalos vertė?',
        atsakymas: String(padala),
        atsakymasRodymui: `$${padala}$`,
        sprendimas: `Tarp dviejų gretimų ašies brūkšnių skirtumas yra ${padala}.`,
        brezinys: diagramaSuPadala(stulpeliai, padala),
      }),

    // 2. Kokią reikšmę rodo stulpelis
    () => {
      const kuris = atsitiktinis(0, stulpeliai.length - 1)
      return uzdavinys('padalos-verte', {
        klausimas: `Kokią reikšmę rodo stulpelis „${stulpeliai[kuris].vardas}“?`,
        atsakymas: String(stulpeliai[kuris].reiksme),
        atsakymasRodymui: `$${stulpeliai[kuris].reiksme}$`,
        sprendimas: `Viena padala verta ${padala}, o stulpelis siekia ${
          stulpeliai[kuris].reiksme / padala
        } padalas: $${stulpeliai[kuris].reiksme / padala} \\cdot ${padala} = ${
          stulpeliai[kuris].reiksme
        }$.`,
        brezinys: diagramaSuPadala(stulpeliai, padala),
      })
    },

    // 3. Padalos vertė iš sumos
    () => {
      const padalu = atsitiktinis(4, 8)
      const viso = padala * padalu
      return uzdavinys('padalos-verte', {
        klausimas: `Jei ${padalu} vienodos diagramos padalos atitinka ${viso} mokinius, kiek mokinių atitinka viena padala?`,
        atsakymas: String(padala),
        atsakymasRodymui: `$${padala}$`,
        sprendimas: `$${viso} : ${padalu} = ${padala}$.`,
      })
    },

    // 4. Kiek rodo kelios padalos
    () => {
      const padalu = atsitiktinis(3, 9)
      return uzdavinys('padalos-verte', {
        klausimas: `Viena padala reiškia ${padala} knygas. Kokią reikšmę rodo ${padalu} padalos?`,
        atsakymas: String(padala * padalu),
        atsakymasRodymui: `$${padala * padalu}$`,
        sprendimas: `$${padalu} \\cdot ${padala} = ${padala * padalu}$.`,
      })
    },

    // 5. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('padalos-verte'), 'padalos-verte', {
        klausimas:
          'Mokinys teigia, kad tarp 0 ir 50 esant 5 vienodiems tarpams padalos vertė yra 5. Kur klaida?',
        variantai: ['padalos vertė yra $50 : 5 = 10$', 'padalos vertė yra $50 : 10 = 5$', 'klaidos nėra'],
        teisingas: 0,
        sprendimas: 'Visą atkarpą reikia dalyti iš tarpų skaičiaus.',
      }),

    // 6. Kodėl stulpeliai atrodo skirtingai
    () =>
      pasirinkimoUzdavinys(naujasId('padalos-verte'), 'padalos-verte', {
        klausimas:
          'Dvi diagramos rodo tuos pačius duomenis, bet vienos padala yra 2, kitos — 5. Kodėl stulpelių aukščiai skiriasi?',
        variantai: [
          'kuo mažesnė padalos vertė, tuo aukštesni stulpeliai',
          'nes duomenys iš tikrųjų skirtingi',
          'nes viena diagrama neteisinga',
        ],
        teisingas: 0,
        sprendimas: 'Ta pati reikšmė užima daugiau padalų, kai viena padala verta mažiau.',
      }),

    // 7. Kiek padalų siekia stulpelis
    () => {
      const kuris = atsitiktinis(0, stulpeliai.length - 1)
      return uzdavinys('padalos-verte', {
        klausimas: `Kiek padalų siekia stulpelis „${stulpeliai[kuris].vardas}“?`,
        atsakymas: String(stulpeliai[kuris].reiksme / padala),
        atsakymasRodymui: `$${stulpeliai[kuris].reiksme / padala}$`,
        sprendimas: `Stulpelis rodo ${stulpeliai[kuris].reiksme}, o viena padala verta ${padala}: $${
          stulpeliai[kuris].reiksme
        } : ${padala} = ${stulpeliai[kuris].reiksme / padala}$.`,
        brezinys: diagramaSuPadala(stulpeliai, padala),
      })
    },
  ])
}

// ── 10.2 Tinkamos padalos vertės parinkimas ─────────────────────────────────

const A_PADALOS_PARINKIMAS = [
  {
    klausimas: 'Duomenys: 4, 8, 12, 16. Kuri padalos vertė patogesnė?',
    atsakymas: 'A',
    atsakymasRodymui: 'A — 2',
    sprendimas: 'Visi duomenys dalijasi iš 2, o diagrama nebus per aukšta.',
  },
] as const

export const padalosParinkimas: Generatorius = () =>
  suBandymais(kurkPadalosParinkima, A_PADALOS_PARINKIMAS, 'padalos-parinkimas')

function kurkPadalosParinkima(): Uzdavinys | null {
  const padala = pasirink([2, 3, 4, 5, 6])
  const duomenys = [1, 2, 3, 4].map((i) => i * padala)

  return variacija([
    // 1. Kuri padala tinka
    () =>
      pasirinkimoUzdavinys(naujasId('padalos-parinkimas'), 'padalos-parinkimas', {
        klausimas: `Duomenys: ${duomenys.join(', ')}. Kuri padalos vertė patogiausia?`,
        variantai: [String(padala), '1', String(padala * 7)],
        teisingas: 0,
        sprendimas: `Visi duomenys dalijasi iš ${padala}, tad kiekvienas atsidurs tiksliai ant padalos.`,
      }),

    // 2. Kodėl padala 1 nepatogi
    () => {
      const dideli = [50, 100, 150]
      return pasirinkimoUzdavinys(naujasId('padalos-parinkimas'), 'padalos-parinkimas', {
        klausimas: `Duomenims ${dideli.join(', ')} mokinys pasirinko padalą 1. Kodėl tai nepraktiška?`,
        variantai: [
          'reikėtų 150 padalų — diagrama netilptų',
          'padala 1 netinka jokiems duomenims',
          'nes duomenys nesidalija iš 1',
        ],
        teisingas: 0,
        sprendimas: 'Padala parenkama taip, kad diagrama tilptų ir liktų skaitoma.',
      })
    },

    // 3. Kiek padalų reikės
    () => {
      const maksReiksme = Math.max(...duomenys)
      return uzdavinys('padalos-parinkimas', {
        klausimas: `Didžiausia reikšmė yra ${maksReiksme}, o viena padala verta ${padala}. Kiek padalų reikės aukščiausiam stulpeliui?`,
        atsakymas: String(maksReiksme / padala),
        atsakymasRodymui: `$${maksReiksme / padala}$`,
        sprendimas: `$${maksReiksme} : ${padala} = ${maksReiksme / padala}$.`,
      })
    },

    // 4. Kuri padala telpa į nurodytą aukštį
    () => {
      const maksReiksme = 36
      const padalu = 12
      return uzdavinys('padalos-parinkimas', {
        klausimas: `Didžiausia reikšmė yra ${maksReiksme}, o diagramoje telpa ${padalu} padalos. Kokia mažiausia tinkama padalos vertė?`,
        atsakymas: String(maksReiksme / padalu),
        atsakymasRodymui: `$${maksReiksme / padalu}$`,
        sprendimas: `$${maksReiksme} : ${padalu} = ${maksReiksme / padalu}$.`,
      })
    },

    // 5. Dviejų padalų palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId('padalos-parinkimas'), 'padalos-parinkimas', {
        klausimas: 'Duomenims 40, 80, 120, 160 palygink padalas 10 ir 20. Kuri patogesnė?',
        variantai: [
          '20 — diagrama bus žemesnė ir aiškesnė',
          '10 — nes skaičius mažesnis',
          'abi vienodai netinkamos',
        ],
        teisingas: 0,
        sprendimas: 'Su padala 20 aukščiausiam stulpeliui reikia 8 padalų, su 10 — net 16.',
      }),

    // 6. Ar duomenys atsidurs ant padalų
    () => {
      const netinkama = padala + 1
      return pasirinkimoUzdavinys(naujasId('padalos-parinkimas'), 'padalos-parinkimas', {
        klausimas: `Ar duomenys ${duomenys.join(', ')} atsidurs tiksliai ant padalų, jei viena padala verta ${netinkama}?`,
        variantai: [
          `ne, jie nesidalija iš ${netinkama}`,
          `taip, visi dalijasi iš ${netinkama}`,
          'tai nepriklauso nuo padalos vertės',
        ],
        teisingas: 0,
        sprendimas: `Visi duomenys dalijasi iš ${padala}, tad ir padala turi būti ${padala} arba jo daliklis.`,
      })
    },

    // 7. Diagrama su parinkta padala
    () => {
      const stulpeliai = sumaisyk([...MENESIAI])
        .slice(0, 4)
        .map((v, i) => ({ vardas: v, reiksme: duomenys[i] }))
      return uzdavinys('padalos-parinkimas', {
        klausimas: 'Kokia diagramos padalos vertė buvo parinkta?',
        atsakymas: String(padala),
        atsakymasRodymui: `$${padala}$`,
        sprendimas: `Ašies žymos didėja po ${padala}.`,
        brezinys: diagramaSuPadala(stulpeliai, padala),
      })
    },
  ])
}

// ── 10.3 Duomenų grupavimas ─────────────────────────────────────────────────

const A_GRUPAVIMAS = [
  {
    klausimas: 'Kiek lyginių skaičių yra tarp 12, 17, 24, 31, 40, 55?',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Lyginiai yra 12, 24 ir 40.',
  },
] as const

export const duomenuGrupavimas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkGrupavima(sritis), A_GRUPAVIMAS, 'duomenu-grupavimas')

function kurkGrupavima(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)

  return variacija([
    // 1. Lyginiai ir nelyginiai
    () => {
      const skaiciai = Array.from({ length: 6 }, () => atsitiktinis(10, 99))
      const lyginiu = skaiciai.filter((x) => x % 2 === 0).length
      if (lyginiu === 0 || lyginiu === 6) return null
      return uzdavinys('duomenu-grupavimas', {
        klausimas: `Kiek lyginių skaičių yra tarp ${skaiciai.join(', ')}?`,
        atsakymas: String(lyginiu),
        atsakymasRodymui: `$${lyginiu}$`,
        sprendimas: `Lyginiai yra ${skaiciai.filter((x) => x % 2 === 0).join(', ')}.`,
      })
    },

    // 2. Dažnių lentelė
    () => {
      const vaisiai = ['obuolys', 'bananas', 'kriaušė'] as const
      const pasirinkimai = Array.from({ length: 8 }, () => pasirink(vaisiai))
      const iesk = pasirink(vaisiai)
      const kiek = pasirinkimai.filter((v) => v === iesk).length
      if (kiek === 0) return null
      return uzdavinys('duomenu-grupavimas', {
        klausimas: `Mokiniai rinkosi vaisius: ${pasirinkimai.join(
          ', ',
        )}. Kiek kartų pasirinktas „${iesk}“?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `Suskaičiuojama, kiek kartų sąraše pasitaiko „${iesk}“ — ${kiek}.`,
      })
    },

    // 3. Grupavimas pagal ribą
    () => {
      const skaiciai = Array.from({ length: 5 }, () => atsitiktinis(100, Math.min(999, maks)))
      const riba500 = 500
      const kiek = skaiciai.filter((x) => x < riba500).length
      if (kiek === 0 || kiek === 5) return null
      return uzdavinys('duomenu-grupavimas', {
        klausimas: `Kiek iš skaičių ${skaiciai.join(', ')} yra mažesni už ${riba500}?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `Mažesni už ${riba500} yra ${skaiciai.filter((x) => x < riba500).join(', ')}.`,
      })
    },

    // 4. Du požymiai iš karto
    () => {
      const skaiciai = [18, 24, 35, 42, 51, 60, 73, 84]
      const abu = skaiciai.filter((x) => x % 2 === 0 && x % 3 === 0)
      return uzdavinys('duomenu-grupavimas', {
        klausimas: `Kiek iš skaičių ${skaiciai.join(
          ', ',
        )} dalijasi ir iš 2, ir iš 3?`,
        atsakymas: String(abu.length),
        atsakymasRodymui: `$${abu.length}$`,
        sprendimas: `Abu požymius tenkina ${abu.join(', ')}.`,
      })
    },

    // 5. Vienodo dydžio grupės
    () => {
      const pasirinkimai = ['sportas', 'muzika', 'dailė', 'sportas', 'robotika', 'muzika', 'sportas', 'dailė']
      const zodziai = [...new Set(pasirinkimai)]
      const daznumai = zodziai.map((z) => pasirinkimai.filter((p) => p === z).length)
      const didziausias = Math.max(...daznumai)
      const kuris = zodziai[daznumai.indexOf(didziausias)]
      return pasirinkimoUzdavinys(naujasId('duomenu-grupavimas'), 'duomenu-grupavimas', {
        klausimas: `Mokiniai pasirinko būrelius: ${pasirinkimai.join(
          ', ',
        )}. Kuris būrelis populiariausias?`,
        variantai: [kuris, ...zodziai.filter((z) => z !== kuris).slice(0, 2)],
        teisingas: 0,
        sprendimas: `„${kuris}“ pasirinktas ${didziausias} kartus — daugiausia.`,
      })
    },

    // 6. Iš lentelės
    () => {
      const knygos = sumaisyk([...VAIKAI])
        .slice(0, 4)
        .map((v) => ({ vardas: v, puslapiai: atsitiktinis(60, 180) }))
      const kiek = knygos.filter((k) => k.puslapiai > 100).length
      if (kiek === 0 || kiek === 4) return null
      return uzdavinys('duomenu-grupavimas', {
        // Puslapių skaičiai yra tik lentelėje.
        klausimas: 'Kiek lentelėje esančių knygų turi daugiau nei 100 puslapių?',
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `Daugiau nei 100 puslapių turi ${kiek} knygos.`,
        brezinys: duomenuLentele(
          ['Knyga', 'Puslapiai'],
          knygos.map((k) => [k.vardas, k.puslapiai]),
        ),
      })
    },

    // 7. Pagal kokį požymį sugrupuota
    () =>
      pasirinkimoUzdavinys(naujasId('duomenu-grupavimas'), 'duomenu-grupavimas', {
        klausimas: 'Skaičiai 12, 15, 20, 25, 30 suskirstyti į dvi grupes: 15, 25, 30 ir 12, 20. Pagal kokį požymį?',
        variantai: [
          'ar dalijasi iš 5',
          'ar skaičius lyginis',
          'ar skaičius didesnis už 20',
        ],
        teisingas: 0,
        sprendimas: 'Iš 5 dalijasi 15, 25 ir 30.',
      }),
  ])
}

// ── 10.4 Įvykio tikėtinumas ─────────────────────────────────────────────────

const A_TIKETINUMAS = [
  {
    klausimas: 'Maišelyje tik raudoni kamuoliukai. Koks yra raudono ištraukimas?',
    atsakymas: 'A',
    atsakymasRodymui: 'A — užtikrintas',
    sprendimas: 'Kitokių kamuoliukų nėra, tad raudonas bus visada.',
  },
] as const

export const ivykioTiketinumas: Generatorius = () =>
  suBandymais(kurkTiketinuma, A_TIKETINUMAS, 'ivykio-tiketinumas')

function kurkTiketinuma(): Uzdavinys | null {
  return variacija([
    // 1. Užtikrintas įvykis
    () =>
      pasirinkimoUzdavinys(naujasId('ivykio-tiketinumas'), 'ivykio-tiketinumas', {
        klausimas: 'Maišelyje yra tik raudoni kamuoliukai. Koks yra raudono kamuoliuko ištraukimas?',
        variantai: ['užtikrintas', 'neįmanomas', 'mažai tikėtinas'],
        teisingas: 0,
        sprendimas: 'Kitokių kamuoliukų maišelyje nėra.',
      }),

    // 2. Neįmanomas įvykis
    () =>
      pasirinkimoUzdavinys(naujasId('ivykio-tiketinumas'), 'ivykio-tiketinumas', {
        klausimas: 'Maišelyje yra tik mėlyni kamuoliukai. Koks yra geltono kamuoliuko ištraukimas?',
        variantai: ['neįmanomas', 'užtikrintas', 'labai tikėtinas'],
        teisingas: 0,
        sprendimas: 'Geltonų kamuoliukų maišelyje išvis nėra.',
      }),

    // 3. Kuri spalva labiau tikėtina
    () => {
      const melynu = atsitiktinis(2, 9)
      const geltonu = atsitiktinis(1, 9)
      if (melynu === geltonu) return null
      return pasirinkimoUzdavinys(naujasId('ivykio-tiketinumas'), 'ivykio-tiketinumas', {
        klausimas: `Maišelyje ${melynu} mėlyni ir ${geltonu} geltoni kamuoliukai. Kurios spalvos ištraukimas labiau tikėtinas?`,
        variantai:
          melynu > geltonu
            ? ['mėlynos', 'geltonos', 'abi vienodai tikėtinos']
            : ['geltonos', 'mėlynos', 'abi vienodai tikėtinos'],
        teisingas: 0,
        sprendimas: `Tos spalvos kamuoliukų daugiau: ${Math.max(melynu, geltonu)} prieš ${Math.min(
          melynu,
          geltonu,
        )}.`,
      })
    },

    // 4. Iš suktuvo
    () => {
      const viso = pasirink([8, 10, 12])
      const tamsiu = atsitiktinis(2, viso - 2)
      if (tamsiu * 2 === viso) return null
      const sektoriai = Array.from({ length: viso }, (_, i) => ({
        spalva: (i < tamsiu ? 'tamsi' : 'sviesi') as 'tamsi' | 'sviesi',
      }))
      return pasirinkimoUzdavinys(naujasId('ivykio-tiketinumas'), 'ivykio-tiketinumas', {
        // Sektorių skaičių reikia suskaičiuoti pačiame suktuve.
        klausimas: 'Kurios spalvos sektorius suktuve labiau tikėtinas?',
        variantai:
          tamsiu * 2 > viso
            ? ['spalvotas', 'baltas', 'abu vienodai tikėtini']
            : ['baltas', 'spalvotas', 'abu vienodai tikėtini'],
        teisingas: 0,
        sprendimas: `Iš ${viso} vienodų sektorių spalvotų yra ${tamsiu}, baltų — ${viso - tamsiu}.`,
        brezinys: suktuvas(sektoriai),
      })
    },

    // 5. Kiek palankių kortelių
    () => {
      const iki = 10
      const lyginiu = 5
      const didesniuUz8 = 2
      return pasirinkimoUzdavinys(naujasId('ivykio-tiketinumas'), 'ivykio-tiketinumas', {
        klausimas: `Yra ${iki} kortelės su skaičiais nuo 1 iki ${iki}. Kas labiau tikėtina: ištraukti lyginį skaičių ar skaičių, didesnį už 8?`,
        variantai: [
          `lyginį skaičių — jam palankios ${lyginiu} kortelės`,
          `skaičių, didesnį už 8 — jam palankios ${didesniuUz8} kortelės`,
          'abu vienodai tikėtini',
        ],
        teisingas: 0,
        sprendimas: `Lyginių yra ${lyginiu}, o didesnių už 8 — tik ${didesniuUz8}.`,
      })
    },

    // 6. Klaidingas teiginys
    () =>
      pasirinkimoUzdavinys(naujasId('ivykio-tiketinumas'), 'ivykio-tiketinumas', {
        klausimas:
          'Mokinys sako: „Jei maišelyje yra bent vienas žalias kamuoliukas, žalią ištraukti yra užtikrinta.“ Kur klaida?',
        variantai: [
          'užtikrinta būtų tik tada, jei visi kamuoliukai būtų žali',
          'žalio ištraukimas iš tikrųjų neįmanomas',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Esant ir kitokių kamuoliukų, žalias tėra galimas, o ne užtikrintas.',
      }),

    // 7. Rikiavimas pagal tikėtinumą
    () => {
      const geltonu = 1
      const melynu = 3
      const zaliu = 8
      return eiliskumoUzdavinys(naujasId('ivykio-tiketinumas'), 'ivykio-tiketinumas', {
        klausimas: `Suktuve ${geltonu} geltona, ${melynu} mėlynos ir ${zaliu} žalios vienodos dalys. Surikiuok spalvas nuo mažiausiai iki labiausiai tikėtinos.`,
        teisingaEile: ['geltona', 'mėlyna', 'žalia'],
        sprendimas: 'Kuo daugiau tos spalvos dalių, tuo labiau tikėtina, kad ji iškris.',
      })
    },
  ])
}

// ── 10.5 Keli algoritmai tam pačiam rezultatui ──────────────────────────────

const A_KELI_ALGORITMAI = [
  {
    klausimas: 'Nuo 10 iki 30 galima nueiti vienu šuoliu po 20. Kiek reikės šuolių po 10?',
    atsakymas: '2',
    atsakymasRodymui: '$2$',
    sprendimas: '$20 : 10 = 2$.',
  },
] as const

export const keliAlgoritmai: Generatorius = () =>
  suBandymais(kurkAlgoritmus, A_KELI_ALGORITMAI, 'keli-algoritmai')

function kurkAlgoritmus(): Uzdavinys | null {
  return variacija([
    // 1. Kiek trumpesnių šuolių
    () => {
      const zingsnis = pasirink([5, 10, 20])
      const kartu = atsitiktinis(2, 6)
      const nuo = atsitiktinis(1, 5) * 10
      return uzdavinys('keli-algoritmai', {
        klausimas: `Nuo ${nuo} iki ${
          nuo + zingsnis * kartu
        } galima nueiti vienu šuoliu. Kiek reikės šuolių po ${zingsnis}?`,
        atsakymas: String(kartu),
        atsakymasRodymui: `$${kartu}$`,
        sprendimas: `$${zingsnis * kartu} : ${zingsnis} = ${kartu}$.`,
      })
    },

    // 2. Kiek komandų iki tikslo
    () => {
      const dx = atsitiktinis(2, 5)
      const dy = atsitiktinis(1, 3)
      return uzdavinys('keli-algoritmai', {
        // Starto ir tikslo vietos yra tik tinklelyje.
        klausimas: 'Kiek mažiausiai žingsnių reikia nueiti nuo A iki B, jei einama tik langelių kraštinėmis?',
        atsakymas: String(dx + dy),
        atsakymasRodymui: `$${dx + dy}$`,
        sprendimas: `Į dešinę ${dx}, aukštyn ${dy}: $${dx} + ${dy} = ${dx + dy}$.`,
        brezinys: algoritmoTinklelis(dx + 2, dy + 2, { x: 0, y: dy + 1 }, { x: dx, y: dy + 1 - dy }),
      })
    },

    // 3. Kvadratas su KARTOK
    () => {
      const krastine = atsitiktinis(3, 8)
      return uzdavinys('keli-algoritmai', {
        klausimas: `Kvadratui nubrėžti naudojama komanda KARTOK 4 [PIRMYN ${krastine}, DEŠINĖN 90]. Kiek vienetų iš viso nubrėš vėžliukas?`,
        atsakymas: String(4 * krastine),
        atsakymasRodymui: `$${4 * krastine}$`,
        sprendimas: `Keturios kraštinės po ${krastine}: $4 \\cdot ${krastine} = ${4 * krastine}$.`,
      })
    },

    // 4. Skaičius dviem būdais
    () => {
      const tikslas = pasirink([24, 36, 48])
      const daugiklis = pasirink([2, 3, 4, 6])
      if (tikslas % daugiklis !== 0) return null
      return uzdavinys('keli-algoritmai', {
        klausimas: `Skaičių ${tikslas} norima gauti dauginant iš ${daugiklis}. Iš kokio skaičiaus reikia pradėti?`,
        atsakymas: String(tikslas / daugiklis),
        atsakymasRodymui: `$${tikslas / daugiklis}$`,
        sprendimas: `$${tikslas} : ${daugiklis} = ${tikslas / daugiklis}$.`,
      })
    },

    // 5. Ar tvarka svarbi
    () =>
      pasirinkimoUzdavinys(naujasId('keli-algoritmai'), 'keli-algoritmai', {
        klausimas:
          'Robotas turi nueiti 4 langelius į dešinę ir 3 aukštyn. Ar rezultatas priklauso nuo komandų tvarkos?',
        variantai: [
          'ne, galutinė vieta ta pati, tik kelias skiriasi',
          'taip, robotas atsidurs kitoje vietoje',
          'taip, nes žingsnių skaičius pasikeis',
        ],
        teisingas: 0,
        sprendimas: 'Kiek žingsnių padaryta į kiekvieną pusę, tiek ir lieka, nesvarbu, kokia tvarka.',
      }),

    // 6. Kliūties apėjimas
    () => {
      const dx = 4
      const dy = 3
      return uzdavinys('keli-algoritmai', {
        klausimas: 'Kiek mažiausiai žingsnių reikia nueiti nuo A iki B, apeinant pilką langelį?',
        atsakymas: String(dx + dy),
        atsakymasRodymui: `$${dx + dy}$`,
        sprendimas: `Kliūtis kelio nepailgina, jei ją apeinama nesugrįžtant: $${dx} + ${dy} = ${
          dx + dy
        }$.`,
        brezinys: algoritmoTinklelis(6, 5, { x: 0, y: 4 }, { x: 4, y: 1 }, [{ x: 2, y: 2 }]),
      })
    },

    // 7. Pakartotinė sudėtis vietoj daugybos
    () => {
      const pradzia = 5
      const tikslas = 35
      const zingsnis = 5
      return uzdavinys('keli-algoritmai', {
        klausimas: `Iš skaičiaus ${pradzia} norima gauti ${tikslas}, kaskart pridedant po ${zingsnis}. Kiek kartų reikės pridėti?`,
        atsakymas: String((tikslas - pradzia) / zingsnis),
        atsakymasRodymui: `$${(tikslas - pradzia) / zingsnis}$`,
        sprendimas: `$${tikslas} - ${pradzia} = ${tikslas - pradzia}$, tada $${
          tikslas - pradzia
        } : ${zingsnis} = ${(tikslas - pradzia) / zingsnis}$.`,
      })
    },
  ])
}

// ── 10.6 Algoritmo teisingumo tikrinimas ────────────────────────────────────

const A_TIKRINIMAS = [
  {
    klausimas: 'Pradėk nuo 20, pridėk 10, atimk 5. Koks rezultatas?',
    atsakymas: '25',
    atsakymasRodymui: '$25$',
    sprendimas: '$20 + 10 = 30$, tada $30 - 5 = 25$.',
  },
] as const

export const algoritmoTikrinimas: Generatorius = () =>
  suBandymais(kurkTikrinima, A_TIKRINIMAS, 'algoritmo-tikrinimas')

function kurkTikrinima(): Uzdavinys | null {
  return variacija([
    // 1. Vykdyk žingsnis po žingsnio
    () => {
      const pradzia = atsitiktinis(10, 60)
      const prideda = atsitiktinis(5, 30)
      const atima = atsitiktinis(3, 20)
      return uzdavinys('algoritmo-tikrinimas', {
        klausimas: `Pradėk nuo ${pradzia}, pridėk ${prideda}, atimk ${atima}. Koks rezultatas?`,
        atsakymas: String(pradzia + prideda - atima),
        atsakymasRodymui: `$${pradzia + prideda - atima}$`,
        sprendimas: `$${pradzia} + ${prideda} = ${
          pradzia + prideda
        }$, tada $${pradzia + prideda} - ${atima} = ${pradzia + prideda - atima}$.`,
      })
    },

    // 2. Daugyba ir dalyba iš eilės
    () => {
      const pradzia = atsitiktinis(4, 9)
      const daugiklis = atsitiktinis(3, 8)
      const daliklis = pasirink([2, 4])
      if ((pradzia * daugiklis) % daliklis !== 0) return null
      return uzdavinys('algoritmo-tikrinimas', {
        klausimas: `Pradėk nuo ${pradzia}, padaugink iš ${daugiklis}, padalyk iš ${daliklis}. Koks rezultatas?`,
        atsakymas: String((pradzia * daugiklis) / daliklis),
        atsakymasRodymui: `$${(pradzia * daugiklis) / daliklis}$`,
        sprendimas: `$${pradzia} \\cdot ${daugiklis} = ${
          pradzia * daugiklis
        }$, tada $${pradzia * daugiklis} : ${daliklis} = ${(pradzia * daugiklis) / daliklis}$.`,
      })
    },

    // 3. Ko trūksta kvadrato algoritme
    () =>
      pasirinkimoUzdavinys(naujasId('algoritmo-tikrinimas'), 'algoritmo-tikrinimas', {
        klausimas:
          'Kvadrato algoritme keturis kartus einama pirmyn, bet posūkiai atlikti tik tris kartus. Ko trūksta?',
        variantai: [
          'dar vieno posūkio, kad kryptis grįžtų į pradinę',
          'dar vienos komandos PIRMYN',
          'nieko netrūksta',
        ],
        teisingas: 0,
        sprendimas: 'Kvadratui reikia keturių kraštinių ir keturių posūkių po 90°.',
      }),

    // 4. Klaida komandoje KARTOK
    () =>
      pasirinkimoUzdavinys(naujasId('algoritmo-tikrinimas'), 'algoritmo-tikrinimas', {
        klausimas:
          'Norėta nubrėžti kvadratą, bet parašyta KARTOK 4 [PIRMYN 5, DEŠINĖN 60]. Kur klaida?',
        variantai: [
          'posūkis turi būti 90°, o ne 60°',
          'kartoti reikia 6 kartus',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Kvadrato kampai statūs, tad kiekvienas posūkis yra 90°.',
      }),

    // 5. Kiek kartų kartoti
    () => {
      const kampas = pasirink([90, 120])
      const kartu = 360 / kampas
      return uzdavinys('algoritmo-tikrinimas', {
        klausimas: `Vėžliukas kaskart pasuka ${kampas}°. Kiek kartų reikia pasukti, kad jis apsisuktų visą ratą?`,
        atsakymas: String(kartu),
        atsakymasRodymui: `$${kartu}$`,
        sprendimas: `Visas ratas yra 360°: $360 : ${kampas} = ${kartu}$.`,
      })
    },

    // 6. Kur atsidurs robotas
    () => {
      const desinen = atsitiktinis(2, 5)
      const aukstyn = atsitiktinis(1, 3)
      return uzdavinys('algoritmo-tikrinimas', {
        klausimas: `Robotas nuo starto nuėjo ${desinen} langelius į dešinę ir ${aukstyn} aukštyn. Per kiek langelių iš viso jis pajudėjo?`,
        atsakymas: String(desinen + aukstyn),
        atsakymasRodymui: `$${desinen + aukstyn}$`,
        sprendimas: `$${desinen} + ${aukstyn} = ${desinen + aukstyn}$.`,
        brezinys: algoritmoTinklelis(
          desinen + 2,
          aukstyn + 2,
          { x: 0, y: aukstyn + 1 },
          { x: desinen, y: 1 },
        ),
      })
    },

    // 7. Kontrolinis pavyzdys
    () => {
      const pradzia = atsitiktinis(3, 20)
      return uzdavinys('algoritmo-tikrinimas', {
        klausimas: `Algoritmas: skaičių padvigubink ir pridėk 3. Koks bus rezultatas, jei pradėsi nuo ${pradzia}?`,
        atsakymas: String(2 * pradzia + 3),
        atsakymasRodymui: `$${2 * pradzia + 3}$`,
        sprendimas: `$${pradzia} \\cdot 2 = ${2 * pradzia}$, tada $${2 * pradzia} + 3 = ${
          2 * pradzia + 3
        }$.`,
      })
    },
  ])
}

// ── 10.7 Programa „XLogo“ ───────────────────────────────────────────────────

const A_XLOGO = [
  {
    klausimas: 'Kiek vienetų nubrėš komanda PIRMYN 5?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Komanda PIRMYN nurodo, per kiek vienetų vėžliukas paeis.',
  },
] as const

export const xlogo: Generatorius = () => suBandymais(kurkXlogo, A_XLOGO, 'xlogo')

function kurkXlogo(): Uzdavinys | null {
  return variacija([
    // 1. Kokia komanda
    () => {
      const ilgis = atsitiktinis(3, 9)
      return pasirinkimoUzdavinys(naujasId('xlogo'), 'xlogo', {
        klausimas: `Kuri komanda nubrėš ${ilgis} vienetų atkarpą pirmyn?`,
        variantai: [`PIRMYN ${ilgis}`, `DEŠINĖN ${ilgis}`, `KARTOK ${ilgis}`],
        teisingas: 0,
        sprendimas: 'PIRMYN nurodo, per kiek vienetų vėžliukas paeis.',
      })
    },

    // 2. Kiek iš viso nubrėžta
    () => {
      const ilgis = atsitiktinis(3, 8)
      const kartu = pasirink([3, 4, 6])
      return uzdavinys('xlogo', {
        klausimas: `Komanda KARTOK ${kartu} [PIRMYN ${ilgis}, DEŠINĖN ${
          360 / kartu
        }]. Kiek vienetų iš viso nubrėš vėžliukas?`,
        atsakymas: String(ilgis * kartu),
        atsakymasRodymui: `$${ilgis * kartu}$`,
        sprendimas: `$${kartu} \\cdot ${ilgis} = ${ilgis * kartu}$.`,
      })
    },

    // 3. Kokį kelią nubrėžė
    () => {
      const a = atsitiktinis(2, 4)
      const b = atsitiktinis(2, 4)
      return uzdavinys('xlogo', {
        // Kelio forma matoma tik brėžinyje — komandų skaičių reikia suskaičiuoti.
        klausimas: 'Iš kelių atkarpų sudarytas vėžliuko nubrėžtas kelias?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Kelias lūžta du kartus, tad jį sudaro trys atkarpos.',
        brezinys: vezliukoKelias([
          { dx: a, dy: 0 },
          { dx: 0, dy: b },
          { dx: a, dy: 0 },
        ]),
      })
    },

    // 4. Ką pakeisti komandoje
    () => {
      const senas = atsitiktinis(3, 7)
      const naujas = atsitiktinis(8, 12)
      return pasirinkimoUzdavinys(naujasId('xlogo'), 'xlogo', {
        klausimas: `Ką reikia pakeisti komandoje PIRMYN ${senas}, kad atkarpa būtų ${naujas} vienetų?`,
        variantai: [
          `skaičių ${senas} pakeisti į ${naujas}`,
          `komandą pakeisti į DEŠINĖN ${naujas}`,
          `pridėti komandą KARTOK ${naujas}`,
        ],
        teisingas: 0,
        sprendimas: 'Atkarpos ilgį nurodo skaičius po komandos PIRMYN.',
      })
    },

    // 5. Kiek komandų be KARTOK
    () => {
      const kraštiniu = pasirink([3, 4, 6])
      return uzdavinys('xlogo', {
        klausimas: `Norint nubrėžti ${kraštiniu} kraštinių figūrą be komandos KARTOK, reikia PIRMYN ir posūkio komandų. Kiek iš viso komandų reikės?`,
        atsakymas: String(2 * kraštiniu),
        atsakymasRodymui: `$${2 * kraštiniu}$`,
        sprendimas: `Kiekvienai kraštinei — po PIRMYN ir po posūkį: $${kraštiniu} \\cdot 2 = ${
          2 * kraštiniu
        }$.`,
      })
    },

    // 6. Stačiakampio algoritmas
    () => {
      const a = atsitiktinis(3, 8)
      const b = atsitiktinis(2, 6)
      if (a === b) return null
      return uzdavinys('xlogo', {
        klausimas: `Vėžliukas brėžia stačiakampį, kurio kraštinės ${a} ir ${b} vienetai. Kiek vienetų iš viso jis nubrėš?`,
        atsakymas: String(2 * (a + b)),
        atsakymasRodymui: `$${2 * (a + b)}$`,
        sprendimas: `Tai stačiakampio perimetras: $2 \\cdot (${a} + ${b}) = ${2 * (a + b)}$.`,
      })
    },

    // 7. Laiptelių forma
    () => {
      const pakopu = atsitiktinis(2, 4)
      const ilgis = atsitiktinis(1, 3)
      return uzdavinys('xlogo', {
        klausimas: `Vėžliukas brėžia laiptelius: ${pakopu} horizontalios ir ${pakopu} vertikalios atkarpos po ${ilgis} vienetus. Kiek vienetų iš viso jis nubrėš?`,
        atsakymas: String(2 * pakopu * ilgis),
        atsakymasRodymui: `$${2 * pakopu * ilgis}$`,
        sprendimas: `Atkarpų iš viso $${pakopu} \\cdot 2 = ${
          2 * pakopu
        }$, kiekviena po ${ilgis}: $${2 * pakopu} \\cdot ${ilgis} = ${2 * pakopu * ilgis}$.`,
        brezinys: vezliukoKelias(
          Array.from({ length: pakopu * 2 }, (_, i) =>
            i % 2 === 0 ? { dx: ilgis, dy: 0 } : { dx: 0, dy: -ilgis },
          ),
        ),
      })
    },
  ])
}

// ── 11.1 Kaip keitėsi knyga? ────────────────────────────────────────────────

const A_KNYGOS_RAIDA = [
  {
    klausimas: 'Kuris įvykis senesnis: 1825 m. ar 1798 m.?',
    atsakymas: 'A',
    atsakymasRodymui: 'A — 1798 m.',
    sprendimas: 'Mažesni metai reiškia ankstesnį laiką.',
  },
] as const

export const knygosRaida: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkKnygosRaida(sritis), A_KNYGOS_RAIDA, 'knygos-raida')

function kurkKnygosRaida(sritis?: Sritis | null): Uzdavinys | null {
  const maks = ribaKnyga(sritis)
  if (maks < 2100) return null

  return variacija([
    // 1. Kuris įvykis senesnis
    () => {
      const a = atsitiktinis(1400, 1900)
      const b = atsitiktinis(1400, 1900)
      if (a === b) return null
      return uzdavinys('knygos-raida', {
        klausimas: `Kiek metų skiria ${a} m. ir ${b} m. įvykius?`,
        atsakymas: String(Math.abs(a - b)),
        atsakymasRodymui: `$${Math.abs(a - b)}$`,
        sprendimas: `$${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(a - b)}$.`,
      })
    },

    // 2. Rikiavimas
    () => {
      const metai = sumaisyk([1450, 1800, 1950, 2020])
      return eiliskumoUzdavinys(naujasId('knygos-raida'), 'knygos-raida', {
        klausimas: 'Surikiuok knygos raidos datas nuo seniausios iki naujausios.',
        teisingaEile: [...metai].sort((a, b) => a - b).map((m) => `${m} m.`),
        sprendimas: 'Kuo metai mažesni, tuo įvykis senesnis.',
      })
    },

    // 3. Vėlesnis įvykis
    () => {
      const ankstesnis = atsitiktinis(1400, 1700)
      const skirtumas = atsitiktinis(50, 350)
      return uzdavinys('knygos-raida', {
        klausimas: `Vienas knygos raidos įvykis įvyko ${ankstesnis} m., o kitas — po ${skirtumas} metų. Kuriais metais įvyko vėlesnis?`,
        atsakymas: String(ankstesnis + skirtumas),
        atsakymasRodymui: `$${ankstesnis + skirtumas}$`,
        sprendimas: `$${ankstesnis} + ${skirtumas} = ${ankstesnis + skirtumas}$.`,
      })
    },

    // 4. Trūkstama data laiko juostoje
    () => {
      const metai = [1500, 1700, 1900]
      const trukstamas = pasirink(metai)
      return uzdavinys('knygos-raida', {
        // Kitos datos matomos juostoje, o klaustuku pažymėta viena.
        klausimas: 'Kokie metai turi būti įrašyti vietoje klaustuko laiko juostoje?',
        atsakymas: String(trukstamas),
        atsakymasRodymui: `$${trukstamas}$`,
        sprendimas: `Tarpai tarp datų vienodi po 200 metų, tad trūksta ${trukstamas} m.`,
        brezinys: laikoJuosta(metai, trukstamas),
      })
    },

    // 5. Kiek metų iki šiandien
    () => {
      const ivykis = atsitiktinis(1450, 1950)
      const dabar = 2025
      return uzdavinys('knygos-raida', {
        klausimas: `Kiek metų praėjo nuo ${ivykis} m. iki ${dabar} m.?`,
        atsakymas: String(dabar - ivykis),
        atsakymasRodymui: `$${dabar - ivykis}$`,
        sprendimas: `$${dabar} - ${ivykis} = ${dabar - ivykis}$.`,
      })
    },

    // 6. Seniausias ir naujausias
    () => {
      const metai = sumaisyk([1795, 1450, 2020])
      return uzdavinys('knygos-raida', {
        klausimas: `Kiek metų skiria seniausią ir naujausią datą: ${metai.join(', ')}?`,
        atsakymas: String(Math.max(...metai) - Math.min(...metai)),
        atsakymasRodymui: `$${Math.max(...metai) - Math.min(...metai)}$`,
        sprendimas: `$${Math.max(...metai)} - ${Math.min(...metai)} = ${
          Math.max(...metai) - Math.min(...metai)
        }$.`,
      })
    },

    // 7. Kas eina anksčiau
    () =>
      pasirinkimoUzdavinys(naujasId('knygos-raida'), 'knygos-raida', {
        klausimas: 'Kuri knygos forma seniausia?',
        variantai: ['molio lentelė', 'spausdinta knyga', 'elektroninė knyga'],
        teisingas: 0,
        sprendimas: 'Molio lentelės naudotos anksčiausiai, spausdinta knyga atsirado daug vėliau.',
      }),
  ])
}

// ── 11.2 Kiek knygų perskaitėme? ────────────────────────────────────────────

const A_PERSKAITYTA = [
  {
    klausimas: 'Rugsėjį perskaityta 18, spalį 24 knygos. Kiek iš viso?',
    atsakymas: '42',
    atsakymasRodymui: '$42$',
    sprendimas: '$18 + 24 = 42$.',
  },
] as const

export const perskaitytosKnygos: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkPerskaitytas(sritis), A_PERSKAITYTA, 'perskaitytos-knygos')

function kurkPerskaitytas(sritis?: Sritis | null): Uzdavinys | null {
  const maks = ribaKnyga(sritis)
  const padala = pasirink([2, 5])
  const menesiai = [...MENESIAI].slice(0, 4)
  const reiksmes = menesiai.map(() => padala * atsitiktinis(2, 8))

  return variacija([
    // 1. Kiek iš viso pagal diagramą
    () => {
      const viso = reiksmes.reduce((s, x) => s + x, 0)
      if (viso > maks) return null
      return uzdavinys('perskaitytos-knygos', {
        // Reikšmės yra tik diagramoje: pirma jas reikia nuskaityti.
        klausimas: 'Kiek knygų perskaityta per visus diagramoje pavaizduotus mėnesius?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${reiksmes.join(' + ')} = ${viso}$.`,
        brezinys: diagramaSuPadala(
          menesiai.map((v, i) => ({ vardas: v, reiksme: reiksmes[i] })),
          padala,
        ),
      })
    },

    // 2. Kurį mėnesį daugiausia
    () => {
      const didziausia = Math.max(...reiksmes)
      const maziausia = Math.min(...reiksmes)
      if (didziausia === maziausia) return null
      return uzdavinys('perskaitytos-knygos', {
        klausimas: 'Keliomis knygomis daugiausia perskaityta daugiau negu mažiausiai?',
        atsakymas: String(didziausia - maziausia),
        atsakymasRodymui: `$${didziausia - maziausia}$`,
        sprendimas: `$${didziausia} - ${maziausia} = ${didziausia - maziausia}$.`,
        brezinys: diagramaSuPadala(
          menesiai.map((v, i) => ({ vardas: v, reiksme: reiksmes[i] })),
          padala,
        ),
      })
    },

    // 3. Iš lentelės
    () => {
      const vaikai = sumaisyk([...VAIKAI]).slice(0, 4)
      const kiek = vaikai.map(() => atsitiktinis(4, 18))
      const viso = kiek.reduce((s, x) => s + x, 0)
      return uzdavinys('perskaitytos-knygos', {
        klausimas: 'Kiek knygų iš viso perskaitė lentelėje surašyti mokiniai?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${kiek.join(' + ')} = ${viso}$.`,
        brezinys: duomenuLentele(
          ['Mokinys', 'Knygų'],
          vaikai.map((v, i) => [v, kiek[i]]),
        ),
      })
    },

    // 4. Kiek daugiau perskaitė antrasis
    () => {
      const a = atsitiktinis(6, 20)
      const daugiau = atsitiktinis(2, 9)
      return uzdavinys('perskaitytos-knygos', {
        klausimas: `Mantas perskaitė ${a} knygas, Ieva — ${daugiau} daugiau. Kiek knygų perskaitė abu?`,
        atsakymas: String(a + a + daugiau),
        atsakymasRodymui: `$${a + a + daugiau}$`,
        sprendimas: `Ieva perskaitė $${a} + ${daugiau} = ${
          a + daugiau
        }$, iš viso $${a} + ${a + daugiau} = ${a + a + daugiau}$.`,
      })
    },

    // 5. Kiek dar reikia iki tikslo
    () => {
      const tikslas = atsitiktinis(20, 40) * 10
      const perskaityta = atsitiktinis(10, tikslas / 10 - 5) * 10
      if (tikslas > maks) return null
      return uzdavinys('perskaitytos-knygos', {
        klausimas: `Klasė nori per metus perskaityti ${tikslas} knygas, o jau perskaitė ${perskaityta}. Kiek dar reikia?`,
        atsakymas: String(tikslas - perskaityta),
        atsakymasRodymui: `$${tikslas - perskaityta}$`,
        sprendimas: `$${tikslas} - ${perskaityta} = ${tikslas - perskaityta}$.`,
      })
    },

    // 6. Trūkstama reikšmė lentelėje
    () => {
      const vaikai = sumaisyk([...VAIKAI]).slice(0, 4)
      const kiek = vaikai.map(() => atsitiktinis(5, 20))
      const viso = kiek.reduce((s, x) => s + x, 0)
      const paslepta = kiek[3]
      return uzdavinys('perskaitytos-knygos', {
        klausimas: `Iš viso perskaityta ${viso} knygos. Kiek knygų perskaitė mokinys, kurio skaičius lentelėje neužrašytas?`,
        atsakymas: String(paslepta),
        atsakymasRodymui: `$${paslepta}$`,
        sprendimas: `$${viso} - (${kiek.slice(0, 3).join(' + ')}) = ${paslepta}$.`,
        brezinys: duomenuLentele(
          ['Mokinys', 'Knygų'],
          vaikai.map((v, i) => [v, i === 3 ? '?' : kiek[i]]),
        ),
      })
    },

    // 7. Kiek turi perskaityti ketvirta grupė
    () => {
      const a = atsitiktinis(30, 60)
      const b = atsitiktinis(30, 60)
      const c = atsitiktinis(20, 50)
      const tikslas = 200
      if (a + b + c >= tikslas) return null
      return uzdavinys('perskaitytos-knygos', {
        klausimas: `Trys grupės perskaitė ${a}, ${b} ir ${c} knygas. Kiek turi perskaityti ketvirta grupė, kad kartu būtų ${tikslas}?`,
        atsakymas: String(tikslas - a - b - c),
        atsakymasRodymui: `$${tikslas - a - b - c}$`,
        sprendimas: `$${a} + ${b} + ${c} = ${a + b + c}$, tad $${tikslas} - ${a + b + c} = ${
          tikslas - a - b - c
        }$.`,
      })
    },
  ])
}

// ── 11.3 Knygos rekordininkės ───────────────────────────────────────────────

const A_REKORDAI = [
  {
    klausimas: 'Knyga A turi 820 puslapių, B — 645. Keliais puslapiais A storesnė?',
    atsakymas: '175',
    atsakymasRodymui: '$175$',
    sprendimas: '$820 - 645 = 175$.',
  },
] as const

export const knyguRekordai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkRekordus(sritis), A_REKORDAI, 'knygu-rekordai')

function kurkRekordus(sritis?: Sritis | null): Uzdavinys | null {
  const maks = ribaKnyga(sritis)
  if (maks < 2000) return null
  const knygos = ['A', 'B', 'C', 'D'] as const
  const puslapiai = knygos.map(() => atsitiktinis(400, 1400))

  return variacija([
    // 1. Kuri storiausia ir kiek
    () => {
      const didziausia = Math.max(...puslapiai)
      const maziausia = Math.min(...puslapiai)
      if (didziausia === maziausia) return null
      return uzdavinys('knygu-rekordai', {
        klausimas: 'Keliais puslapiais storiausia lentelės knyga viršija ploniausią?',
        atsakymas: String(didziausia - maziausia),
        atsakymasRodymui: `$${didziausia - maziausia}$`,
        sprendimas: `$${didziausia} - ${maziausia} = ${didziausia - maziausia}$.`,
        brezinys: duomenuLentele(
          ['Knyga', 'Puslapiai'],
          knygos.map((k, i) => [k, puslapiai[i]]),
        ),
      })
    },

    // 2. Rikiavimas
    () => {
      if (new Set(puslapiai).size < 4) return null
      const suKnygomis = knygos.map((k, i) => ({ k, p: puslapiai[i] }))
      return eiliskumoUzdavinys(naujasId('knygu-rekordai'), 'knygu-rekordai', {
        klausimas: 'Surikiuok knygas nuo ploniausios iki storiausios.',
        teisingaEile: [...suKnygomis].sort((x, y) => x.p - y.p).map((x) => `${x.k} (${x.p} psl.)`),
        sprendimas: 'Lyginami puslapių skaičiai.',
      })
    },

    // 3. Tiražų skirtumas
    () => {
      const a = atsitiktinis(3, 9) * 1000 + atsitiktinis(0, 9) * 100
      const b = atsitiktinis(3, 9) * 1000 + atsitiktinis(0, 9) * 100
      if (a === b || Math.max(a, b) > maks) return null
      return uzdavinys('knygu-rekordai', {
        klausimas: `Vienos knygos tiražas ${a} egz., kitos — ${b} egz. Kiek egzempliorių jie skiriasi?`,
        atsakymas: String(Math.abs(a - b)),
        atsakymasRodymui: `$${Math.abs(a - b)}$`,
        sprendimas: `$${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(a - b)}$.`,
      })
    },

    // 4. Brangesnė knyga
    () => {
      const kaina = atsitiktinis(20, 60)
      const brangiau = atsitiktinis(5, 25)
      return uzdavinys('knygu-rekordai', {
        klausimas: `Knyga kainuoja ${kaina} Eur, kita — ${brangiau} Eur brangiau. Kokia antros knygos kaina?`,
        atsakymas: String(kaina + brangiau),
        atsakymasRodymui: `$${kaina + brangiau}$ Eur`,
        sprendimas: `$${kaina} + ${brangiau} = ${kaina + brangiau}$.`,
      })
    },

    // 5. Trys susijusios knygos
    () => {
      const A = atsitiktinis(1000, 1400)
      const maziau = atsitiktinis(200, 500)
      const daugiau = atsitiktinis(100, 300)
      const B = A - maziau
      const C = B + daugiau
      return uzdavinys('knygu-rekordai', {
        klausimas: `Knyga A turi ${A} puslapius, B — ${maziau} mažiau, C — ${daugiau} daugiau už B. Kiek puslapių turi C?`,
        atsakymas: String(C),
        atsakymasRodymui: `$${C}$`,
        sprendimas: `$B = ${A} - ${maziau} = ${B}$, tad $C = ${B} + ${daugiau} = ${C}$.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('knygu-rekordai'), 'knygu-rekordai', {
        klausimas:
          'Mokinys teigia, kad 999 puslapių knyga storesnė už 1001 puslapio knygą, nes 999 turi daugiau devynetų. Kur klaida?',
        variantai: [
          'lyginami skaičiai, o ne skaitmenys: $1001 > 999$',
          '999 iš tikrųjų didesnis už 1001',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: '1001 turi keturis skaitmenis, tad jis didesnis.',
      }),

    // 7. Iš diagramos
    () => {
      const padala = 500
      const tirazai = [2, 3, 4, 5].map(() => padala * atsitiktinis(2, 6))
      const dumaks = tirazai.slice().sort((a, b) => b - a).slice(0, 2)
      if (dumaks[0] + dumaks[1] > maks) return null
      return uzdavinys('knygu-rekordai', {
        klausimas: 'Kiek egzempliorių kartu sudaro du didžiausi diagramos tiražai?',
        atsakymas: String(dumaks[0] + dumaks[1]),
        atsakymasRodymui: `$${dumaks[0] + dumaks[1]}$`,
        sprendimas: `$${dumaks[0]} + ${dumaks[1]} = ${dumaks[0] + dumaks[1]}$.`,
        brezinys: diagramaSuPadala(
          knygos.map((k, i) => ({ vardas: k, reiksme: tirazai[i] })),
          padala,
        ),
      })
    },
  ])
}

// ── 11.4 Kodėl skiriasi knygų tiražai? ──────────────────────────────────────

const A_TIRAZAI = [
  {
    klausimas: 'Pirmasis tiražas 4200 egz., antrasis 1800 egz. didesnis. Koks antrojo tiražas?',
    atsakymas: '6000',
    atsakymasRodymui: '$6000$',
    sprendimas: '$4200 + 1800 = 6000$.',
  },
] as const

export const knyguTirazai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTirazus(sritis), A_TIRAZAI, 'knygu-tirazai')

function kurkTirazus(sritis?: Sritis | null): Uzdavinys | null {
  const maks = ribaKnyga(sritis)
  if (maks < 10000) return null
  const padala = 1000
  const knygos = ['A', 'B', 'C', 'D'] as const
  const tirazai = knygos.map(() => padala * atsitiktinis(2, 8))

  return variacija([
    // 1. Didžiausio ir mažiausio skirtumas
    () => {
      const didziausias = Math.max(...tirazai)
      const maziausias = Math.min(...tirazai)
      if (didziausias === maziausias) return null
      return uzdavinys('knygu-tirazai', {
        // Tiražai yra tik lentelėje.
        klausimas: 'Keliais egzemplioriais didžiausias lentelės tiražas viršija mažiausią?',
        atsakymas: String(didziausias - maziausias),
        atsakymasRodymui: `$${didziausias - maziausias}$`,
        sprendimas: `$${didziausias} - ${maziausias} = ${didziausias - maziausias}$.`,
        brezinys: duomenuLentele(
          ['Knyga', 'Tiražas'],
          knygos.map((k, i) => [k, tirazai[i]]),
        ),
      })
    },

    // 2. Antrasis tiražas
    () => {
      const pirmas = atsitiktinis(2, 6) * 1000 + atsitiktinis(0, 9) * 100
      const daugiau = atsitiktinis(5, 25) * 100
      if (pirmas + daugiau > maks) return null
      return uzdavinys('knygu-tirazai', {
        klausimas: `Pirmasis leidimas — ${pirmas} egz., antrasis ${daugiau} egz. didesnis. Koks antrojo tiražas?`,
        atsakymas: String(pirmas + daugiau),
        atsakymasRodymui: `$${pirmas + daugiau}$`,
        sprendimas: `$${pirmas} + ${daugiau} = ${pirmas + daugiau}$.`,
      })
    },

    // 3. Papildomas spausdinimas
    () => {
      const pradinis = atsitiktinis(3, 7) * 1000
      const papildomai = atsitiktinis(5, 25) * 100
      if (pradinis + papildomai > maks) return null
      return uzdavinys('knygu-tirazai', {
        klausimas: `Knygos tiražas buvo ${pradinis} egz. Vėliau papildomai išspausdinta ${papildomai}. Kiek egzempliorių iš viso?`,
        atsakymas: String(pradinis + papildomai),
        atsakymasRodymui: `$${pradinis + papildomai}$`,
        sprendimas: `$${pradinis} + ${papildomai} = ${pradinis + papildomai}$.`,
      })
    },

    // 4. Kiek padidėjo
    () => {
      const pernai = atsitiktinis(3, 7) * 1000
      const siemet = pernai + atsitiktinis(5, 30) * 100
      if (siemet > maks) return null
      return uzdavinys('knygu-tirazai', {
        klausimas: 'Keliais egzemplioriais antrasis diagramos tiražas didesnis už pirmąjį?',
        atsakymas: String(siemet - pernai),
        atsakymasRodymui: `$${siemet - pernai}$`,
        sprendimas: `$${siemet} - ${pernai} = ${siemet - pernai}$.`,
        brezinys: diagramaSuPadala(
          [
            { vardas: '2024 m.', reiksme: pernai },
            { vardas: '2025 m.', reiksme: siemet },
          ],
          500,
        ),
      })
    },

    // 5. Rikiavimas
    () => {
      if (new Set(tirazai).size < 4) return null
      const su = knygos.map((k, i) => ({ k, t: tirazai[i] }))
      return eiliskumoUzdavinys(naujasId('knygu-tirazai'), 'knygu-tirazai', {
        klausimas: 'Surikiuok tiražus mažėjimo tvarka.',
        teisingaEile: [...su].sort((x, y) => y.t - x.t).map((x) => `${x.t} egz.`),
        sprendimas: 'Lyginami tiražų skaičiai.',
      })
    },

    // 6. Kiek dar reikia iki plano
    () => {
      const planas = 10000
      const isspausdinta = atsitiktinis(30, 70) * 100
      const veliau = atsitiktinis(10, 25) * 100
      if (isspausdinta + veliau > planas) return null
      return uzdavinys('knygu-tirazai', {
        klausimas: `Leidykla planavo ${planas} egz., išspausdino ${isspausdinta}, vėliau dar ${veliau}. Kiek dar trūksta iki plano?`,
        atsakymas: String(planas - isspausdinta - veliau),
        atsakymasRodymui: `$${planas - isspausdinta - veliau}$`,
        sprendimas: `Išspausdinta $${isspausdinta} + ${veliau} = ${
          isspausdinta + veliau
        }$, trūksta $${planas} - ${isspausdinta + veliau} = ${
          planas - isspausdinta - veliau
        }$.`,
      })
    },

    // 7. Trys susiję tiražai
    () => {
      const pirmas = atsitiktinis(25, 45) * 100
      const daugiau = atsitiktinis(15, 30) * 100
      const maziau = atsitiktinis(5, 14) * 100
      const antras = pirmas + daugiau
      const trecias = antras - maziau
      if (antras > maks) return null
      return uzdavinys('knygu-tirazai', {
        klausimas: `Pirmas tiražas ${pirmas} egz., antras ${daugiau} egz. didesnis, trečias ${maziau} egz. mažesnis už antrą. Koks trečiojo tiražas?`,
        atsakymas: String(trecias),
        atsakymasRodymui: `$${trecias}$`,
        sprendimas: `Antras $${pirmas} + ${daugiau} = ${antras}$, trečias $${antras} - ${maziau} = ${trecias}$.`,
      })
    },
  ])
}
