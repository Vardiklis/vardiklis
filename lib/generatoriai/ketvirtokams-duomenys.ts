import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { D, kiek } from './ketvirtokams-bendra'
import {
  bruksneliuLentele,
  linijineDiagrama,
  skritulineDiagrama,
} from './ketvirtokams-duomenu-vaizdai'
import { diagramaSuPadala, duomenuLentele } from './treciokams-algebros-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Duomenys ir statistinis tyrimas“ — dvylika potemių.
 *
 * Anksčiau jos rėmėsi `diagramos`, `vidurkis` ir `logika` generatoriais,
 * skirtais 7–10 klasėms: pasitaikydavo medianos, imties dydžio ir procentinių
 * skritulinių diagramų.
 *
 * Tyrimas čia eina per visą temą iš eilės: klausimas, duomenų rinkimas,
 * sisteminimas, vaizdavimas, skaitymas, išvada. Todėl kelios potemės klausia
 * ne skaičiaus, o sprendimo — koks būdas tinka, ar išvada pagrįsta.
 */

const MENESIAI = ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis'] as const
const DIENOS = ['Pirmad.', 'Antrad.', 'Treč.', 'Ketvirt.', 'Penkt.'] as const
const SPORTAS = ['Krepšinis', 'Futbolas', 'Plaukimas', 'Šokiai'] as const

/** Kelios reikšmės su padalos verte, kad diagramą būtų galima tiksliai nuskaityti. */
function reiksmes(kiekis: number, padala: number, maks = 8): number[] {
  return Array.from({ length: kiekis }, () => atsitiktinis(1, maks) * padala)
}

// ── 11.1 Statistinis klausimas ──────────────────────────────────────────────

const T1 = 'statistinis-klausimas'

const A_KLAUSIMAS = [
  {
    klausimas: 'Kuris klausimas yra statistinis?',
    atsakymas: 'a',
    atsakymasRodymui: 'Kokia mėgstamiausia klasės mokinių sporto šaka?',
    sprendimas: 'Statistinis klausimas reikalauja surinkti daug atsakymų.',
  },
] as const

export const statistinisKlausimas: Generatorius = () =>
  suBandymais(kurkStatistiniKlausima, A_KLAUSIMAS, T1)

function kurkStatistiniKlausima(): Uzdavinys | null {
  return variacija([
    // 1. Kuris klausimas statistinis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuris klausimas yra statistinis?',
        variantai: [
          'Kokia mėgstamiausia klasės mokinių sporto šaka?',
          'Kiek metų mokytojai?',
          'Kelinta šiandien diena?',
          'Kiek kojų turi katė?',
        ],
        teisingas: 0,
        sprendimas: 'Statistiniam klausimui atsakyti reikia surinkti daug skirtingų atsakymų; į kitus atsakoma vienu skaičiumi.',
      }),

    // 2. Kuo skiriasi nuo paprasto
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuo statistinis klausimas skiriasi nuo paprasto?',
        variantai: [
          'į jį atsakoma surinkus daug duomenų, o ne vieną reikšmę',
          'jis visada apie skaičius',
          'jis visada ilgesnis',
          'į jį atsakyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Klausimas „kiek man metų“ turi vieną atsakymą, o „kiek metų klasės mokiniams“ — tiek, kiek mokinių.',
      }),

    // 3. Kiek atsakymų reikės surinkti
    () => {
      const mokiniu = atsitiktinis(18, 28)
      return uzdavinys(T1, {
        klausimas: `Klasėje ${kiek(mokiniu, D.mokiniai)}. Kiek atsakymų bus surinkta, jei kiekvienas atsakys į klausimą apie mėgstamiausią sporto šaką?`,
        atsakymas: String(mokiniu),
        atsakymasRodymui: `$${mokiniu}$`,
        sprendimas: 'Kiekvienas mokinys duoda po vieną atsakymą.',
      })
    },

    // 4. Kokį klausimą galima užduoti
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Norima sužinoti, kaip mokiniai keliauja į mokyklą. Kuris klausimas tinka?',
        variantai: [
          'Kaip tu atvyksti į mokyklą?',
          'Kiek kainuoja autobuso bilietas?',
          'Kada prasideda pamokos?',
          'Kiek mokinių mokykloje?',
        ],
        teisingas: 0,
        sprendimas: 'Klausimas turi būti užduodamas kiekvienam ir turėti kelis galimus atsakymus.',
      }),

    // 5. Kada klausimas netinka
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kodėl klausimas „Kiek dienų turi savaitė?“ netinka tyrimui?',
        variantai: [
          'nes atsakymas visada tas pats — duomenų rinkti nereikia',
          'nes jis per trumpas',
          'nes savaitė ne matematinis dydis',
          'nes į jį atsakyti sunku',
        ],
        teisingas: 0,
        sprendimas: 'Tyrimas prasmingas tik tada, kai atsakymai gali skirtis.',
      }),

    // 6. Kiek galimų atsakymų
    () => {
      const variantu = atsitiktinis(3, 5)
      return uzdavinys(T1, {
        klausimas: `Į klausimą apie mėgstamiausią sporto šaką galima rinktis iš ${variantu} atsakymų. Kiek stulpelių turės diagrama, jei kiekvieną atsakymą pasirinko bent vienas mokinys?`,
        atsakymas: String(variantu),
        atsakymasRodymui: `$${variantu}$`,
        sprendimas: 'Kiekvienam atsakymo variantui skiriamas atskiras stulpelis.',
      })
    },

    // 7. Klausimo tikslas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ką pirmiausia reikia nuspręsti pradedant tyrimą?',
        variantai: [
          'kokį klausimą norima ištirti',
          'kokia diagrama bus braižoma',
          'kiek laiko truks tyrimas',
          'kokios spalvos bus lentelė',
        ],
        teisingas: 0,
        sprendimas: 'Nuo klausimo priklauso, kokių duomenų reikės ir kaip juos rinkti.',
      }),
  ])
}

// ── 11.2 Duomenų rinkimo planas ─────────────────────────────────────────────

const T2 = 'duomenu-rinkimo-planas'

const A_PLANAS = [
  {
    klausimas: 'Ko reikia norint suplanuoti duomenų rinkimą?',
    atsakymas: 'a',
    atsakymasRodymui: 'nuspręsti, ko klausti, ką apklausti ir kaip užrašyti atsakymus',
    sprendimas: 'Be plano duomenys būna nepalyginami.',
  },
] as const

export const duomenuRinkimoPlanas: Generatorius = () => suBandymais(kurkPlana, A_PLANAS, T2)

function kurkPlana(): Uzdavinys | null {
  const mokiniu = atsitiktinis(18, 28)

  return variacija([
    // 1. Ką reikia nuspręsti
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ko reikia norint suplanuoti duomenų rinkimą?',
        variantai: [
          'nuspręsti, ko klausti, ką apklausti ir kaip užrašyti atsakymus',
          'nupiešti diagramą',
          'apskaičiuoti vidurkį',
          'parašyti išvadą',
        ],
        teisingas: 0,
        sprendimas: 'Diagrama ir išvada atsiranda vėliau — pirma reikia surinkti duomenis.',
      }),

    // 2. Ką apklausti
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Norima sužinoti, kokia mėgstamiausia visos klasės sporto šaka. Ką reikia apklausti?',
        variantai: [
          'visus klasės mokinius',
          'tik tuos, kurie lanko būrelius',
          'tik berniukus',
          'mokytoją',
        ],
        teisingas: 0,
        sprendimas: 'Jei apklausiama tik dalis, išvada apie visą klasę bus nepagrįsta.',
      }),

    // 3. Kiek atsakymų
    () =>
      uzdavinys(T2, {
        klausimas: `Klasėje ${kiek(mokiniu, D.mokiniai)}, iš jų ${atsitiktinis(2, 4)} tą dieną nedalyvavo. Kiek daugiausia atsakymų galima surinkti tą dieną? Užrašyk didžiausią galimą skaičių.`,
        atsakymas: String(mokiniu),
        atsakymasRodymui: `$${mokiniu}$`,
        sprendimas: 'Daugiausia atsakymų būtų tada, jei apklausti pavyktų visus — tad tiek, kiek klasėje mokinių.',
      }),

    // 4. Kaip užrašyti atsakymus
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kaip patogiausia užrašyti apklausos atsakymus renkant duomenis?',
        variantai: [
          'lentelėje, brūkšneliais žymint kiekvieną atsakymą',
          'iš karto braižant skritulinę diagramą',
          'įsiminti mintinai',
          'surašyti visus vardus be atsakymų',
        ],
        teisingas: 0,
        sprendimas: 'Brūkšneliai leidžia greitai žymėti ir paskui lengvai suskaičiuoti.',
        brezinys: bruksneliuLentele(
          SPORTAS.slice(0, 3).map((s) => ({ vardas: s, kiek: atsitiktinis(3, 11) })),
        ),
      }),

    // 5. Eiliškumas
    () =>
      eiliskumoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Surikiuok tyrimo žingsnius teisinga tvarka.',
        teisingaEile: [
          'suformuluoti klausimą',
          'surinkti duomenis',
          'surašyti duomenis į lentelę',
          'nubraižyti diagramą',
          'parašyti išvadą',
        ],
        sprendimas: 'Išvada rašoma paskutinė — ji remiasi jau surinktais ir sutvarkytais duomenimis.',
      }),

    // 6. Kada duomenų per mažai
    () => {
      const apklausta = atsitiktinis(3, 6)
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Klasėje ${mokiniu} mokiniai, o apklausti tik ${apklausta}. Ar galima daryti išvadą apie visą klasę?`,
        variantai: [
          'ne, apklausta per mažai mokinių',
          'taip, kelių atsakymų pakanka',
          'taip, jei apklausti geriausi mokiniai',
        ],
        teisingas: 0,
        sprendimas: `${apklausta} iš ${mokiniu} yra maža dalis — kitų nuomonė gali būti visai kitokia.`,
      })
    },

    // 7. Kiek duomenų surinkta
    () => {
      const kiekiai = [atsitiktinis(3, 9), atsitiktinis(3, 9), atsitiktinis(2, 7)]
      const viso = kiekiai.reduce((s, x) => s + x, 0)
      return uzdavinys(T2, {
        klausimas: 'Kiek iš viso atsakymų surinkta apklausoje?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${kiekiai.join(' + ')} = ${viso}$.`,
        brezinys: bruksneliuLentele(
          SPORTAS.slice(0, 3).map((s, i) => ({ vardas: s, kiek: kiekiai[i] })),
        ),
      })
    },
  ])
}

// ── 11.3 Duomenų surinkimas ir sisteminimas ─────────────────────────────────

const T3 = 'duomenu-sisteminimas'

const A_SISTEMINIMAS = [
  {
    klausimas: 'Kiek atsakymų pažymėta brūkšnelių lentelėje, jei yra 2 grupės po 5 ir dar 3 brūkšneliai?',
    atsakymas: '13',
    atsakymasRodymui: '$13$',
    sprendimas: '$5 \\cdot 2 + 3 = 13$.',
  },
] as const

export const duomenuSisteminimas: Generatorius = () =>
  suBandymais(kurkSisteminima, A_SISTEMINIMAS, T3)

function kurkSisteminima(): Uzdavinys | null {
  const eilutes = sumaisyk([...SPORTAS]).slice(0, 3)
  const kiekiai = [atsitiktinis(4, 14), atsitiktinis(4, 14), atsitiktinis(3, 12)]

  return variacija([
    // 1. Kiek atsakymų vienoje eilutėje
    () => {
      const i = atsitiktinis(0, 2)
      return uzdavinys(T3, {
        klausimas: `Kiek brūkšnelių pažymėta prie „${eilutes[i]}“?`,
        atsakymas: String(kiekiai[i]),
        atsakymasRodymui: `$${kiekiai[i]}$`,
        sprendimas: `Brūkšneliai grupuojami po penkis: $${Math.floor(kiekiai[i] / 5)} \\cdot 5 + ${kiekiai[i] % 5} = ${kiekiai[i]}$.`,
        brezinys: bruksneliuLentele(eilutes.map((e, j) => ({ vardas: e, kiek: kiekiai[j] }))),
      })
    },

    // 2. Iš viso
    () => {
      const viso = kiekiai.reduce((s, x) => s + x, 0)
      return uzdavinys(T3, {
        klausimas: 'Kiek iš viso atsakymų užrašyta lentelėje?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${kiekiai.join(' + ')} = ${viso}$.`,
        brezinys: bruksneliuLentele(eilutes.map((e, j) => ({ vardas: e, kiek: kiekiai[j] }))),
      })
    },

    // 3. Kodėl brūkšneliai po penkis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kodėl brūkšneliai žymimi grupėmis po penkis?',
        variantai: [
          'kad juos būtų greičiau suskaičiuoti',
          'kad tilptų į lentelę',
          'nes penki yra nelyginis skaičius',
          'kad atrodytų gražiau',
        ],
        teisingas: 0,
        sprendimas: 'Suskaičiuoti penketais greičiau nei po vieną.',
      }),

    // 4. Į lentelę
    () =>
      uzdavinys(T3, {
        klausimas: 'Koks skaičius turi būti įrašytas lentelėje prie daugiausiai atsakymų surinkusios eilutės?',
        atsakymas: String(Math.max(...kiekiai)),
        atsakymasRodymui: `$${Math.max(...kiekiai)}$`,
        sprendimas: `Daugiausia atsakymų surinko „${eilutes[kiekiai.indexOf(Math.max(...kiekiai))]}“.`,
        brezinys: bruksneliuLentele(eilutes.map((e, j) => ({ vardas: e, kiek: kiekiai[j] }))),
      }),

    // 5. Duomenų lentelė
    () => {
      const i = atsitiktinis(0, 2)
      return uzdavinys(T3, {
        klausimas: `Kiek mokinių pasirinko „${eilutes[i]}“?`,
        atsakymas: String(kiekiai[i]),
        atsakymasRodymui: `$${kiekiai[i]}$`,
        sprendimas: 'Reikšmė nuskaitoma iš lentelės eilutės.',
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          eilutes.map((e, j) => [e, String(kiekiai[j])]),
        ),
      })
    },

    // 6. Skirtumas tarp dviejų
    () => {
      if (kiekiai[0] === kiekiai[1]) return null
      return uzdavinys(T3, {
        klausimas: `Keliais atsakymais „${eilutes[0]}“ ir „${eilutes[1]}“ skiriasi?`,
        atsakymas: String(Math.abs(kiekiai[0] - kiekiai[1])),
        atsakymasRodymui: `$${Math.abs(kiekiai[0] - kiekiai[1])}$`,
        sprendimas: `$${Math.max(kiekiai[0], kiekiai[1])} - ${Math.min(kiekiai[0], kiekiai[1])} = ${Math.abs(kiekiai[0] - kiekiai[1])}$.`,
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          eilutes.map((e, j) => [e, String(kiekiai[j])]),
        ),
      })
    },

    // 7. Kam reikia sisteminti
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kodėl surinktus duomenis surašome į lentelę?',
        variantai: [
          'kad būtų galima juos palyginti ir suskaičiuoti',
          'kad užimtų mažiau vietos',
          'kad būtų sunkiau suklysti rašant',
          'nes to reikalauja diagrama',
        ],
        teisingas: 0,
        sprendimas: 'Netvarkingi atsakymai neleidžia nei palyginti, nei suskaičiuoti.',
      }),
  ])
}

// ── 11.4 Linijinės diagramos skaitymas ──────────────────────────────────────

const T4 = 'linijines-diagramos-skaitymas'

const A_LINIJINE = [
  {
    klausimas: 'Kurį mėnesį reikšmė didžiausia?',
    atsakymas: 'a',
    atsakymasRodymui: 'tas, kuriame linija aukščiausiai',
    sprendimas: 'Aukščiausias taškas rodo didžiausią reikšmę.',
  },
] as const

export const linijinesDiagramosSkaitymas: Generatorius = () =>
  suBandymais(kurkLinijine, A_LINIJINE, T4)

function kurkLinijine(): Uzdavinys | null {
  const padala = pasirink([2, 5, 10])
  const menesiai = MENESIAI.slice(0, 5)
  const r = reiksmes(5, padala, 8)
  if (new Set(r).size < 4) return null
  const taskai = menesiai.map((m, i) => ({ zyme: m, reiksme: r[i] }))

  return variacija([
    // 1. Reikšmė nurodytu mėnesiu
    () => {
      const i = atsitiktinis(0, 4)
      return uzdavinys(T4, {
        klausimas: `Kokia reikšmė pažymėta diagramoje ties „${menesiai[i]}“?`,
        atsakymas: String(r[i]),
        atsakymasRodymui: `$${r[i]}$`,
        sprendimas: `Taškas stovi ties ${r[i]} padala.`,
        brezinys: linijineDiagrama(taskai, padala),
      })
    },

    // 2. Didžiausia reikšmė
    () => {
      const maks = Math.max(...r)
      if (r.filter((x) => x === maks).length > 1) return null
      const variantai = sumaisyk([...menesiai])
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuriuo mėnesiu reikšmė buvo didžiausia?',
        variantai: [...variantai],
        teisingas: variantai.indexOf(menesiai[r.indexOf(maks)]),
        sprendimas: 'Ieškoma aukščiausiai esančio taško.',
        brezinys: linijineDiagrama(taskai, padala),
      })
    },

    // 3. Padalos vertė
    () =>
      uzdavinys(T4, {
        klausimas: 'Kokia yra vienos diagramos padalos vertė?',
        atsakymas: String(padala),
        atsakymasRodymui: `$${padala}$`,
        sprendimas: 'Padalos vertė nustatoma pagal skaičius ašyje: tarp gretimų brūkšnelių skirtumas ir yra padala.',
        brezinys: linijineDiagrama(taskai, padala),
      }),

    // 4. Skirtumas tarp dviejų mėnesių
    () => {
      const i = atsitiktinis(0, 3)
      if (r[i] === r[i + 1]) return null
      return uzdavinys(T4, {
        klausimas: `Kiek pasikeitė reikšmė nuo „${menesiai[i]}“ iki „${menesiai[i + 1]}“?`,
        atsakymas: String(Math.abs(r[i + 1] - r[i])),
        atsakymasRodymui: `$${Math.abs(r[i + 1] - r[i])}$`,
        sprendimas: `$${Math.max(r[i], r[i + 1])} - ${Math.min(r[i], r[i + 1])} = ${Math.abs(r[i + 1] - r[i])}$.`,
        brezinys: linijineDiagrama(taskai, padala),
      })
    },

    // 5. Kada didėjo
    () => {
      const kilimai = r.slice(1).filter((x, i) => x > r[i]).length
      return uzdavinys(T4, {
        klausimas: 'Kiek kartų reikšmė padidėjo, lyginant su ankstesniu mėnesiu?',
        atsakymas: String(kilimai),
        atsakymasRodymui: `$${kilimai}$`,
        sprendimas: 'Skaičiuojamos linijos atkarpos, kylančios į viršų.',
        brezinys: linijineDiagrama(taskai, padala),
      })
    },

    // 6. Bendra suma
    () => {
      const viso = r.reduce((s, x) => s + x, 0)
      return uzdavinys(T4, {
        klausimas: 'Kokia yra visų penkių diagramoje pažymėtų reikšmių suma?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${r.join(' + ')} = ${viso}$.`,
        brezinys: linijineDiagrama(taskai, padala),
      })
    },

    // 7. Ką rodo linija
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ką parodo linijinė diagrama geriau nei lentelė?',
        variantai: [
          'kaip reikšmė kito laikui bėgant',
          'tikslią kiekvienos reikšmės vertę',
          'kiek iš viso surinkta duomenų',
          'kas rinko duomenis',
        ],
        teisingas: 0,
        sprendimas: 'Kylanti ar krintanti linija iš karto parodo pokytį.',
        brezinys: linijineDiagrama(taskai, padala),
      }),
  ])
}

// ── 11.5 Linijinės diagramos braižymas ──────────────────────────────────────

const T5 = 'linijines-diagramos-braizymas'

const A_BRAIZYMAS = [
  {
    klausimas: 'Kokią padalą patogu pasirinkti, kai didžiausia reikšmė yra 40?',
    atsakymas: '10',
    atsakymasRodymui: '$10$',
    sprendimas: 'Su padala 10 ašyje užtenka keturių brūkšnelių.',
  },
] as const

export const linijinesDiagramosBraizymas: Generatorius = () =>
  suBandymais(kurkBraizyma, A_BRAIZYMAS, T5)

function kurkBraizyma(): Uzdavinys | null {
  const padala = pasirink([2, 5, 10])
  const r = reiksmes(5, padala, 8)
  const dienos = DIENOS.slice(0, 5)
  const taskai = dienos.map((d, i) => ({ zyme: d, reiksme: r[i] }))

  return variacija([
    // 1. Kokia padala tinka
    () => {
      const maks = Math.max(...r)
      return uzdavinys(T5, {
        klausimas: `Didžiausia duomenų reikšmė yra ${maks}. Kiek padalų reikės ašyje, jei vienos padalos vertė ${padala}?`,
        atsakymas: String(maks / padala),
        atsakymasRodymui: `$${maks / padala}$`,
        sprendimas: `$${maks} : ${padala} = ${maks / padala}$.`,
      })
    },

    // 2. Kelinta padala
    () => {
      const i = atsitiktinis(0, 4)
      return uzdavinys(T5, {
        klausimas: `Braižant diagramą reikšmė ${r[i]} žymima ties kelinta padala, jei vienos padalos vertė ${padala}?`,
        atsakymas: String(r[i] / padala),
        atsakymasRodymui: `$${r[i] / padala}$`,
        sprendimas: `$${r[i]} : ${padala} = ${r[i] / padala}$.`,
      })
    },

    // 3. Kiek taškų diagramoje
    () =>
      uzdavinys(T5, {
        klausimas: `Duomenys surinkti apie ${dienos.length} dienas. Kiek taškų bus linijinėje diagramoje?`,
        atsakymas: String(dienos.length),
        atsakymasRodymui: `$${dienos.length}$`,
        sprendimas: 'Kiekvienai dienai žymimas po vieną tašką.',
      }),

    // 4. Ką rašyti ašyse
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Ką rašome linijinės diagramos horizontalioje ašyje?',
        variantai: [
          'laiką arba matavimų eiliškumą',
          'didžiausią reikšmę',
          'duomenų sumą',
          'padalos vertę',
        ],
        teisingas: 0,
        sprendimas: 'Vertikalioje ašyje žymimos reikšmės, horizontalioje — laikas.',
        brezinys: linijineDiagrama(taskai, padala),
      }),

    // 5. Klaida braižant
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kodėl visos padalos ašyje turi būti vienodo dydžio?',
        variantai: [
          'kad diagrama teisingai rodytų reikšmių skirtumus',
          'kad būtų gražiau',
          'kad tilptų daugiau taškų',
          'kad būtų lengviau piešti',
        ],
        teisingas: 0,
        sprendimas: 'Nevienodos padalos iškreipia vaizdą: mažas skirtumas gali atrodyti didelis.',
      }),

    // 6. Kiek aukščiau
    () => {
      const i = atsitiktinis(0, 3)
      if (r[i] === r[i + 1]) return null
      return uzdavinys(T5, {
        klausimas: `Per kiek padalų reikšmė ties „${dienos[i + 1]}“ aukščiau ar žemiau nei ties „${dienos[i]}“, jei padalos vertė ${padala}?`,
        atsakymas: String(Math.abs(r[i + 1] - r[i]) / padala),
        atsakymasRodymui: `$${Math.abs(r[i + 1] - r[i]) / padala}$`,
        sprendimas: `Skirtumas $${Math.abs(r[i + 1] - r[i])}$, o viena padala — ${padala}.`,
        brezinys: linijineDiagrama(taskai, padala),
      })
    },

    // 7. Kada tinka linijinė diagrama
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kada patogiausia braižyti linijinę diagramą?',
        variantai: [
          'kai rodomas dydžio kitimas laikui bėgant',
          'kai rodomos visumos dalys',
          'kai duomenų tik du',
          'kai duomenys nesusiję tarpusavyje',
        ],
        teisingas: 0,
        sprendimas: 'Visumos dalims tinka skritulinė, o kitimui — linijinė diagrama.',
      }),
  ])
}

// ── 11.6 Skritulinės diagramos skaitymas ────────────────────────────────────

const T6 = 'skritulines-diagramos-skaitymas'

const A_SKRITULINE = [
  {
    klausimas: 'Kokią skritulio dalį sudaro pusė?',
    atsakymas: '1/2',
    atsakymasRodymui: '$\\dfrac{1}{2}$',
    sprendimas: 'Pusė yra viena iš dviejų lygių dalių.',
  },
] as const

export const skritulinesDiagramosSkaitymas: Generatorius = () =>
  suBandymais(kurkSkritulini, A_SKRITULINE, T6)

function kurkSkritulini(): Uzdavinys | null {
  const visoDaliu = pasirink([4, 8])
  const a = atsitiktinis(1, visoDaliu - 2)
  const b = atsitiktinis(1, visoDaliu - a - 1)
  const c = visoDaliu - a - b
  const vardai = sumaisyk([...SPORTAS]).slice(0, 3)
  const dalys = [
    { vardas: vardai[0], dalys: a },
    { vardas: vardai[1], dalys: b },
    { vardas: vardai[2], dalys: c },
  ]

  return variacija([
    // 1. Kuri dalis didžiausia
    () => {
      const maks = Math.max(a, b, c)
      if ([a, b, c].filter((x) => x === maks).length > 1) return null
      const variantai = sumaisyk(vardai)
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kuri dalis diagramoje didžiausia?',
        variantai,
        teisingas: variantai.indexOf(dalys[[a, b, c].indexOf(maks)].vardas),
        sprendimas: 'Didžiausia yra ta dalis, kuri užima daugiausiai skritulio.',
        brezinys: skritulineDiagrama(dalys, visoDaliu),
      })
    },

    // 2. Į kiek dalių padalytas skritulys
    () =>
      uzdavinys(T6, {
        klausimas: 'Į kiek lygių dalių padalytas skritulys?',
        atsakymas: String(visoDaliu),
        atsakymasRodymui: `$${visoDaliu}$`,
        sprendimas: 'Suskaičiuojami vienodo dydžio sektoriai.',
        brezinys: skritulineDiagrama(dalys, visoDaliu),
      }),

    // 3. Kokią dalį sudaro
    () => {
      const i = atsitiktinis(0, 2)
      const d = [a, b, c][i]
      return uzdavinys(T6, {
        klausimas: `Kiek lygių dalių iš ${visoDaliu} užima „${dalys[i].vardas}“?`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}$`,
        sprendimas: `Ši dalis apima ${d} sektorius iš ${visoDaliu}.`,
        brezinys: skritulineDiagrama(dalys, visoDaliu),
      })
    },

    // 4. Kiek mokinių
    () => {
      const vienaDalis = atsitiktinis(2, 6)
      const mokiniu = vienaDalis * visoDaliu
      const i = atsitiktinis(0, 2)
      const d = [a, b, c][i]
      return uzdavinys(T6, {
        klausimas: `Apklausta ${kiek(mokiniu, D.mokiniai)}. Kiek jų pasirinko „${dalys[i].vardas}“?`,
        atsakymas: String(d * vienaDalis),
        atsakymasRodymui: `$${d * vienaDalis}$`,
        sprendimas: `Viena dalis atitinka $${mokiniu} : ${visoDaliu} = ${vienaDalis}$ mokinius, o šių dalių ${d}.`,
        brezinys: skritulineDiagrama(dalys, visoDaliu),
      })
    },

    // 5. Ar dalis didesnė už pusę
    () => {
      const maks = Math.max(a, b, c)
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Ar didžiausia diagramos dalis užima daugiau nei pusę skritulio?',
        variantai:
          maks * 2 > visoDaliu
            ? ['taip', 'ne', 'lygiai pusę']
            : maks * 2 === visoDaliu
              ? ['lygiai pusę', 'taip', 'ne']
              : ['ne', 'taip', 'lygiai pusę'],
        teisingas: 0,
        sprendimas: `Pusę sudarytų ${visoDaliu / 2} dalys, o didžiausia dalis apima ${maks}.`,
        brezinys: skritulineDiagrama(dalys, visoDaliu),
      })
    },

    // 6. Dviejų dalių suma
    () =>
      uzdavinys(T6, {
        klausimas: `Kiek dalių kartu užima „${dalys[0].vardas}“ ir „${dalys[1].vardas}“?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$ iš ${visoDaliu}.`,
        brezinys: skritulineDiagrama(dalys, visoDaliu),
      }),

    // 7. Ką rodo skritulinė diagrama
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Ką geriausiai parodo skritulinė diagrama?',
        variantai: [
          'kokią visumos dalį sudaro kiekviena grupė',
          'kaip dydis kito laikui bėgant',
          'tikslų kiekvienos grupės skaičių',
          'kiek grupių iš viso',
        ],
        teisingas: 0,
        sprendimas: 'Visas skritulys yra visuma, o sektoriai — jos dalys.',
      }),
  ])
}

// ── 11.7 Skritulinės diagramos sudarymas ────────────────────────────────────

const T7 = 'skritulines-diagramos-sudarymas'

const A_SUDARYMAS = [
  {
    klausimas: 'Į kiek dalių dalyti skritulį, jei apklausta 8 mokiniai ir kiekvienas pasirinko po vieną atsakymą?',
    atsakymas: '8',
    atsakymasRodymui: '$8$',
    sprendimas: 'Kiekvienam atsakymui po lygią dalį.',
  },
] as const

export const skritulinesDiagramosSudarymas: Generatorius = () =>
  suBandymais(kurkSkritulioSudaryma, A_SUDARYMAS, T7)

function kurkSkritulioSudaryma(): Uzdavinys | null {
  const visoDaliu = pasirink([4, 8])
  const vienaDalis = atsitiktinis(2, 6)
  const mokiniu = vienaDalis * visoDaliu
  const a = atsitiktinis(1, visoDaliu - 2)
  const b = visoDaliu - a - 1

  return variacija([
    // 1. Kiek mokinių atitinka vieną dalį
    () =>
      uzdavinys(T7, {
        klausimas: `Apklausta ${kiek(mokiniu, D.mokiniai)}, o skritulys dalijamas į ${visoDaliu} lygias dalis. Kiek mokinių atitinka viena dalis?`,
        atsakymas: String(vienaDalis),
        atsakymasRodymui: `$${vienaDalis}$`,
        sprendimas: `$${mokiniu} : ${visoDaliu} = ${vienaDalis}$.`,
      }),

    // 2. Kiek dalių skirti grupei
    () =>
      uzdavinys(T7, {
        klausimas: `Viena skritulio dalis atitinka ${vienaDalis} mokinius. Kiek dalių reikia skirti grupei, kurioje ${a * vienaDalis} mokiniai?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${a * vienaDalis} : ${vienaDalis} = ${a}$.`,
      }),

    // 3. Kiek dalių lieka
    () =>
      uzdavinys(T7, {
        klausimas: `Skritulys padalytas į ${visoDaliu} dalis. Dvi grupės užėmė ${a} ir ${b} dalis. Kiek dalių lieka trečiajai grupei?`,
        atsakymas: String(visoDaliu - a - b),
        atsakymasRodymui: `$${visoDaliu - a - b}$`,
        sprendimas: `$${visoDaliu} - ${a} - ${b} = ${visoDaliu - a - b}$.`,
      }),

    // 4. Pusė skritulio
    () =>
      uzdavinys(T7, {
        klausimas: `Skritulys padalytas į ${visoDaliu} lygias dalis. Kiek dalių sudaro pusę skritulio?`,
        atsakymas: String(visoDaliu / 2),
        atsakymasRodymui: `$${visoDaliu / 2}$`,
        sprendimas: `$${visoDaliu} : 2 = ${visoDaliu / 2}$.`,
      }),

    // 5. Ar duomenys tinka
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ką reikia patikrinti sudarius skritulinę diagramą?',
        variantai: [
          'ar visų dalių suma sudaro visą skritulį',
          'ar sektoriai skirtingų spalvų',
          'ar diagramoje yra bent trys dalys',
          'ar skritulys pakankamai didelis',
        ],
        teisingas: 0,
        sprendimas: 'Jei dalių suma nesudaro visumos, kažkurie duomenys prarasti.',
      }),

    // 6. Ketvirtis
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Grupė užima ${visoDaliu / 4} iš ${visoDaliu} skritulio dalių. Kokią visumos dalį tai sudaro?`,
        variantai: ['ketvirtadalį', 'pusę', 'trečdalį', 'visą skritulį'],
        teisingas: 0,
        sprendimas: `$${visoDaliu / 4}$ iš $${visoDaliu}$ yra ketvirtadalis.`,
      }),

    // 7. Kiek mokinių didžiausioje grupėje
    () => {
      const c = visoDaliu - a - b
      const maks = Math.max(a, b, c)
      return uzdavinys(T7, {
        klausimas: `Skritulys padalytas į ${visoDaliu} dalis, o viena dalis atitinka ${vienaDalis} mokinius. Kiek mokinių yra didžiausioje grupėje, jei grupės užima ${a}, ${b} ir ${c} dalis?`,
        atsakymas: String(maks * vienaDalis),
        atsakymasRodymui: `$${maks * vienaDalis}$`,
        sprendimas: `Didžiausia grupė užima ${maks} dalis: $${maks} \\cdot ${vienaDalis} = ${maks * vienaDalis}$.`,
      })
    },
  ])
}

// ── 11.8 Atsakymai pagal diagramą ───────────────────────────────────────────

const T8 = 'atsakymai-pagal-diagrama'

const A_PAGAL_DIAGRAMA = [
  {
    klausimas: 'Kiek didesnis didžiausias stulpelis už mažiausią?',
    atsakymas: 'a',
    atsakymasRodymui: 'jų reikšmių skirtumas',
    sprendimas: 'Nuskaitomos abi reikšmės ir randamas skirtumas.',
  },
] as const

export const atsakymaiPagalDiagrama: Generatorius = () =>
  suBandymais(kurkPagalDiagrama, A_PAGAL_DIAGRAMA, T8)

function kurkPagalDiagrama(): Uzdavinys | null {
  const padala = pasirink([2, 5, 10])
  const vardai = sumaisyk([...SPORTAS])
  const r = reiksmes(4, padala, 8)
  if (new Set(r).size < 4) return null
  const stulpeliai = vardai.map((v, i) => ({ vardas: v, reiksme: r[i] }))

  return variacija([
    // 1. Didžiausias stulpelis
    () => {
      const maks = Math.max(...r)
      const variantai = sumaisyk([...vardai])
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuris stulpelis diagramoje aukščiausias?',
        variantai,
        teisingas: variantai.indexOf(vardai[r.indexOf(maks)]),
        sprendimas: 'Aukščiausias stulpelis rodo didžiausią reikšmę.',
        brezinys: diagramaSuPadala(stulpeliai, padala, 2),
      })
    },

    // 2. Skirtumas tarp didžiausio ir mažiausio
    () => {
      const maks = Math.max(...r)
      const min = Math.min(...r)
      return uzdavinys(T8, {
        klausimas: 'Kiek skiriasi didžiausia ir mažiausia diagramos reikšmės?',
        atsakymas: String(maks - min),
        atsakymasRodymui: `$${maks - min}$`,
        sprendimas: `$${maks} - ${min} = ${maks - min}$.`,
        brezinys: diagramaSuPadala(stulpeliai, padala, 2),
      })
    },

    // 3. Konkreti reikšmė
    () => {
      const i = atsitiktinis(0, 3)
      return uzdavinys(T8, {
        klausimas: `Kokia yra „${vardai[i]}“ stulpelio reikšmė?`,
        atsakymas: String(r[i]),
        atsakymasRodymui: `$${r[i]}$`,
        sprendimas: `Stulpelio viršus yra ties ${r[i]}.`,
        brezinys: diagramaSuPadala(stulpeliai, padala, 2),
      })
    },

    // 4. Bendra suma
    () => {
      const viso = r.reduce((s, x) => s + x, 0)
      return uzdavinys(T8, {
        klausimas: 'Kokia yra visų diagramos stulpelių reikšmių suma?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${r.join(' + ')} = ${viso}$.`,
        brezinys: diagramaSuPadala(stulpeliai, padala, 2),
      })
    },

    // 5. Kiek stulpelių viršija ribą
    () => {
      const riba = padala * atsitiktinis(3, 5)
      const kiekis = r.filter((x) => x > riba).length
      if (kiekis === 0 || kiekis === 4) return null
      return uzdavinys(T8, {
        klausimas: `Kiek stulpelių diagramoje viršija ${riba}?`,
        atsakymas: String(kiekis),
        atsakymasRodymui: `$${kiekis}$`,
        sprendimas: `Reikšmės: ${r.join(', ')} — už ${riba} didesnės ${kiekis}.`,
        brezinys: diagramaSuPadala(stulpeliai, padala, 2),
      })
    },

    // 6. Kiek kartų didesnis
    () => {
      const maks = Math.max(...r)
      const min = Math.min(...r)
      if (maks % min !== 0) return null
      return uzdavinys(T8, {
        klausimas: 'Kiek kartų didžiausia diagramos reikšmė didesnė už mažiausią?',
        atsakymas: String(maks / min),
        atsakymasRodymui: `$${maks / min}$`,
        sprendimas: `$${maks} : ${min} = ${maks / min}$.`,
        brezinys: diagramaSuPadala(stulpeliai, padala, 2),
      })
    },

    // 7. Į kokį klausimą atsako diagrama
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Į kurį klausimą galima atsakyti pagal šią diagramą?',
        variantai: [
          'kuri sporto šaka populiariausia',
          'kiek metų mokiniams',
          'kada vyko apklausa',
          'kiek kainuoja treniruotė',
        ],
        teisingas: 0,
        sprendimas: 'Diagramoje pavaizduotas tik pasirinkimų skaičius kiekvienai sporto šakai.',
        brezinys: diagramaSuPadala(stulpeliai, padala, 2),
      }),
  ])
}

// ── 11.9 Duomenų pateikimo būdo pasirinkimas ────────────────────────────────

const T9 = 'pateikimo-budo-pasirinkimas'

const A_BUDAS = [
  {
    klausimas: 'Kuri diagrama tinka rodyti dydžio kitimą per metus?',
    atsakymas: 'a',
    atsakymasRodymui: 'linijinė',
    sprendimas: 'Linija parodo kitimą laikui bėgant.',
  },
] as const

export const pateikimoBudoPasirinkimas: Generatorius = () =>
  suBandymais(kurkBuda, A_BUDAS, T9)

function kurkBuda(): Uzdavinys | null {
  return variacija([
    // 1. Kitimas laikui bėgant
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kuris duomenų pateikimo būdas geriausiai parodo temperatūros kitimą per savaitę?',
        variantai: ['linijinė diagrama', 'skritulinė diagrama', 'brūkšnelių lentelė', 'sąrašas'],
        teisingas: 0,
        sprendimas: 'Linija sujungia reikšmes iš eilės ir parodo kilimą bei kritimą.',
      }),

    // 2. Visumos dalys
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kuris būdas geriausiai parodo, kokią visumos dalį sudaro kiekviena grupė?',
        variantai: ['skritulinė diagrama', 'linijinė diagrama', 'brūkšnelių lentelė', 'skaičių eilutė'],
        teisingas: 0,
        sprendimas: 'Skritulys yra visuma, o sektoriai — jos dalys.',
      }),

    // 3. Grupių palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kuris būdas patogiausias lyginant kelių grupių dydžius?',
        variantai: ['stulpelinė diagrama', 'linijinė diagrama', 'skaičių sąrašas', 'tekstinis aprašymas'],
        teisingas: 0,
        sprendimas: 'Greta stovintys stulpeliai leidžia palyginti iš karto.',
      }),

    // 4. Duomenų rinkimo metu
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kuris būdas patogiausias pačiam duomenų rinkimo metu?',
        variantai: ['brūkšnelių lentelė', 'skritulinė diagrama', 'linijinė diagrama', 'stulpelinė diagrama'],
        teisingas: 0,
        sprendimas: 'Brūkšnelį pažymėti greita, o diagramą braižyti galima tik surinkus visus duomenis.',
      }),

    // 5. Susieti būdą su tikslu
    () =>
      poruUzdavinys(naujasId(T9), T9, {
        klausimas: 'Susiek tikslą su tinkamiausiu duomenų pateikimo būdu.',
        poros: [
          { kaire: 'parodyti kitimą per savaitę', desine: 'linijinė diagrama' },
          { kaire: 'parodyti visumos dalis', desine: 'skritulinė diagrama' },
          { kaire: 'palyginti grupių dydžius', desine: 'stulpelinė diagrama' },
        ],
        sprendimas: 'Kiekvienas būdas pabrėžia skirtingą duomenų savybę.',
      }),

    // 6. Kodėl netinka
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kodėl skritulinė diagrama netinka rodyti temperatūros kitimui per savaitę?',
        variantai: [
          'nes ji rodo dalis, o ne kitimo eiliškumą',
          'nes savaitėje per mažai dienų',
          'nes temperatūra gali būti neigiama',
          'nes skritulys per mažas',
        ],
        teisingas: 0,
        sprendimas: 'Skritulinėje diagramoje nematyti, kuri reikšmė buvo anksčiau, o kuri vėliau.',
      }),

    // 7. Kiek duomenų reikia
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Ką reikia žinoti prieš pasirenkant duomenų pateikimo būdą?',
        variantai: [
          'ką norima parodyti — kitimą, dalis ar palyginimą',
          'kiek spalvų turi pieštukų dėžutė',
          'kas rinko duomenis',
          'kiek laiko truko tyrimas',
        ],
        teisingas: 0,
        sprendimas: 'Būdas parenkamas pagal tai, kokį klausimą norima atsakyti.',
      }),
  ])
}

// ── 11.10 Tyrimo rezultatų pristatymas ──────────────────────────────────────

const T10 = 'tyrimo-pristatymas'

const A_PRISTATYMAS = [
  {
    klausimas: 'Kas turi būti pristatant tyrimo rezultatus?',
    atsakymas: 'a',
    atsakymasRodymui: 'klausimas, duomenys ir išvada',
    sprendimas: 'Be klausimo neaišku, ką duomenys reiškia.',
  },
] as const

export const tyrimoPristatymas: Generatorius = () =>
  suBandymais(kurkPristatyma, A_PRISTATYMAS, T10)

function kurkPristatyma(): Uzdavinys | null {
  const vardai = sumaisyk([...SPORTAS]).slice(0, 4)
  const r = reiksmes(4, 1, 12)
  if (new Set(r).size < 4) return null
  const viso = r.reduce((s, x) => s + x, 0)

  return variacija([
    // 1. Kas turi būti pristatyme
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Ką būtina nurodyti pristatant tyrimo rezultatus?',
        variantai: [
          'kokio klausimo buvo ieškoma, kokie duomenys surinkti ir kokia išvada',
          'tik gražią diagramą',
          'tik didžiausią skaičių',
          'tik apklaustų žmonių vardus',
        ],
        teisingas: 0,
        sprendimas: 'Be klausimo skaičiai nieko nereiškia, o be duomenų išvada nepagrįsta.',
      }),

    // 2. Kiek iš viso apklausta
    () =>
      uzdavinys(T10, {
        klausimas: 'Kiek iš viso mokinių dalyvavo apklausoje?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${r.join(' + ')} = ${viso}$.`,
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          vardai.map((v, i) => [v, String(r[i])]),
        ),
      }),

    // 3. Populiariausias pasirinkimas
    () => {
      const maks = Math.max(...r)
      const variantai = sumaisyk([...vardai])
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kurią sporto šaką pasirinko daugiausia mokinių?',
        variantai,
        teisingas: variantai.indexOf(vardai[r.indexOf(maks)]),
        sprendimas: `Daugiausia pasirinkimų — ${maks}.`,
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          vardai.map((v, i) => [v, String(r[i])]),
        ),
      })
    },

    // 4. Vidurkis
    () => {
      if (viso % r.length !== 0) return null
      return uzdavinys(T10, {
        klausimas: 'Kiek vidutiniškai mokinių teko vienai sporto šakai?',
        atsakymas: String(viso / r.length),
        atsakymasRodymui: `$${viso / r.length}$`,
        sprendimas: `$${viso} : ${r.length} = ${viso / r.length}$.`,
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          vardai.map((v, i) => [v, String(r[i])]),
        ),
      })
    },

    // 5. Kokia diagrama pristatyti
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kokia diagrama geriausiai pristatytų šiuos apklausos duomenis?',
        variantai: ['stulpelinė', 'linijinė', 'skaičių tiesė', 'jokia'],
        teisingas: 0,
        sprendimas: 'Lyginamos atskiros grupės, tad tinka stulpeliai.',
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          vardai.map((v, i) => [v, String(r[i])]),
        ),
      }),

    // 6. Kiek skiriasi populiariausias ir rečiausias
    () => {
      const maks = Math.max(...r)
      const min = Math.min(...r)
      return uzdavinys(T10, {
        klausimas: 'Keliais mokiniais populiariausias pasirinkimas lenkia rečiausią?',
        atsakymas: String(maks - min),
        atsakymasRodymui: `$${maks - min}$`,
        sprendimas: `$${maks} - ${min} = ${maks - min}$.`,
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          vardai.map((v, i) => [v, String(r[i])]),
        ),
      })
    },

    // 7. Ką rodo pristatymas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kodėl pristatant rezultatus svarbu nurodyti, kiek žmonių buvo apklausta?',
        variantai: [
          'nes nuo apklaustųjų skaičiaus priklauso, ar išvada patikima',
          'kad būtų ilgesnis pristatymas',
          'kad būtų aišku, kas rinko duomenis',
          'nes to reikalauja diagrama',
        ],
        teisingas: 0,
        sprendimas: 'Trijų žmonių atsakymai apie visą mokyklą nieko nepasako.',
      }),
  ])
}

// ── 11.11 Tyrimo išvada ─────────────────────────────────────────────────────

const T11 = 'tyrimo-isvada'

const A_ISVADA = [
  {
    klausimas: 'Kuri išvada pagrįsta duomenimis?',
    atsakymas: 'a',
    atsakymasRodymui: 'ta, kuri remiasi surinktais skaičiais',
    sprendimas: 'Išvada negali pasakyti daugiau, nei rodo duomenys.',
  },
] as const

export const tyrimoIsvada: Generatorius = () => suBandymais(kurkIsvada, A_ISVADA, T11)

function kurkIsvada(): Uzdavinys | null {
  const vardai = sumaisyk([...SPORTAS]).slice(0, 3)
  const r = reiksmes(3, 1, 14)
  if (new Set(r).size < 3) return null
  const maks = Math.max(...r)
  const viso = r.reduce((s, x) => s + x, 0)
  const populiariausia = vardai[r.indexOf(maks)]

  return variacija([
    // 1. Kuri išvada pagrįsta
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kuri išvada pagrįsta lentelės duomenimis?',
        variantai: [
          `daugiausia mokinių pasirinko „${populiariausia}“`,
          'visi mokiniai mėgsta sportą',
          `„${populiariausia}“ yra geriausia sporto šaka pasaulyje`,
          'mokiniai nemėgsta kitų sporto šakų',
        ],
        teisingas: 0,
        sprendimas: 'Duomenys rodo tik pasirinkimų skaičių, o ne nuomonę apie visą pasaulį.',
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          vardai.map((v, i) => [v, String(r[i])]),
        ),
      }),

    // 2. Suformuluoti išvadą skaičiumi
    () =>
      uzdavinys(T11, {
        klausimas: 'Kiek mokinių pasirinko populiariausią sporto šaką?',
        atsakymas: String(maks),
        atsakymasRodymui: `$${maks}$`,
        sprendimas: `Didžiausias lentelės skaičius yra ${maks}.`,
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          vardai.map((v, i) => [v, String(r[i])]),
        ),
      }),

    // 3. Ar išvada per plati
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Apklausta viena klasė. Ar galima daryti išvadą, kad „${populiariausia}“ yra populiariausia visoje mokykloje?`,
        variantai: [
          'ne, apklausta tik viena klasė',
          'taip, klasė atstovauja visai mokyklai',
          'taip, jei klasė didelė',
        ],
        teisingas: 0,
        sprendimas: 'Išvada gali kalbėti tik apie tuos, kurie buvo apklausti.',
      }),

    // 4. Kokią dalį sudaro
    () => {
      if (viso % maks !== 0) return null
      return uzdavinys(T11, {
        klausimas: `Iš viso apklausta ${viso} mokiniai, o populiariausią pasirinkimą nurodė ${maks}. Kiek kartų daugiau mokinių pasirinko kitas šakas kartu paėmus? Užrašyk kitų pasirinkimų skaičių.`,
        atsakymas: String(viso - maks),
        atsakymasRodymui: `$${viso - maks}$`,
        sprendimas: `$${viso} - ${maks} = ${viso - maks}$.`,
      })
    },

    // 5. Trūkstamas duomuo išvadai
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Ko trūksta išvadai „Mūsų klasėje populiariausias krepšinis“ pagrįsti?',
        variantai: [
          'skaičių, rodančių, kiek mokinių ką pasirinko',
          'mokytojo nuomonės',
          'sporto salės nuotraukos',
          'apklausos datos',
        ],
        teisingas: 0,
        sprendimas: 'Išvadą turi paremti patys duomenys.',
      }),

    // 6. Kiek mokinių nesirinko
    () => {
      const i = atsitiktinis(0, 2)
      return uzdavinys(T11, {
        klausimas: `Kiek mokinių NEpasirinko „${vardai[i]}“?`,
        atsakymas: String(viso - r[i]),
        atsakymasRodymui: `$${viso - r[i]}$`,
        sprendimas: `$${viso} - ${r[i]} = ${viso - r[i]}$.`,
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          vardai.map((v, j) => [v, String(r[j])]),
        ),
      })
    },

    // 7. Kaip rašoma išvada
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kaip turi būti suformuluota tyrimo išvada?',
        variantai: [
          'trumpai, atsakant į pradinį klausimą ir remiantis skaičiais',
          'kuo ilgiau, kad būtų įtikinamiau',
          'be skaičių, kad būtų aiškiau',
          'užduodant naują klausimą',
        ],
        teisingas: 0,
        sprendimas: 'Išvada yra atsakymas į tą patį klausimą, nuo kurio tyrimas prasidėjo.',
      }),
  ])
}

// ── 11.12 Ar išvada pagrįsta duomenimis ─────────────────────────────────────

const T12 = 'isvados-pagristumas'

const A_PAGRISTUMAS = [
  {
    klausimas: 'Kada išvada laikoma pagrįsta?',
    atsakymas: 'a',
    atsakymasRodymui: 'kai ją patvirtina surinkti duomenys',
    sprendimas: 'Duomenys turi pasakyti tiksliai tai, kas teigiama išvadoje.',
  },
] as const

export const isvadosPagristumas: Generatorius = () =>
  suBandymais(kurkPagristuma, A_PAGRISTUMAS, T12)

function kurkPagristuma(): Uzdavinys | null {
  const vardai = sumaisyk([...SPORTAS]).slice(0, 3)
  const r = reiksmes(3, 1, 14)
  if (new Set(r).size < 3) return null
  const maks = Math.max(...r)
  const min = Math.min(...r)
  const viso = r.reduce((s, x) => s + x, 0)

  return variacija([
    // 1. Kada išvada pagrįsta
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kada tyrimo išvada laikoma pagrįsta?',
        variantai: [
          'kai ją patvirtina surinkti duomenys',
          'kai ji skamba įtikinamai',
          'kai su ja sutinka dauguma',
          'kai ji trumpa',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienas išvados teiginys turi būti matomas duomenyse.',
      }),

    // 2. Ar teiginys teisingas
    () => {
      const teiginys = `daugiau nei pusė apklaustųjų pasirinko „${vardai[r.indexOf(maks)]}“`
      const teisinga = maks * 2 > viso
      return pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Ar teiginys „${teiginys}“ atitinka lentelės duomenis?`,
        variantai: teisinga
          ? [
              `taip, ${maks} yra daugiau nei pusė iš ${viso}`,
              `ne, ${maks} yra mažiau nei pusė iš ${viso}`,
              'iš lentelės to nustatyti neįmanoma',
            ]
          : [
              `ne, ${maks} yra mažiau nei pusė iš ${viso}`,
              `taip, ${maks} yra daugiau nei pusė iš ${viso}`,
              'iš lentelės to nustatyti neįmanoma',
            ],
        teisingas: 0,
        sprendimas: `Pusė iš ${viso} būtų ${viso / 2}, o didžiausias pasirinkimas — ${maks}.`,
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          vardai.map((v, i) => [v, String(r[i])]),
        ),
      })
    },

    // 3. Per plati išvada
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Apklausus 20 mokinių padaryta išvada apie visos šalies vaikus. Kas čia negerai?',
        variantai: [
          'apklausta per mažai ir tik vienos vietos vaikų',
          'nieko — 20 yra daug',
          'reikėjo braižyti kitokią diagramą',
          'reikėjo apklausti mokytojus',
        ],
        teisingas: 0,
        sprendimas: 'Išvada gali kalbėti tik apie tą grupę, kuri buvo tirta.',
      }),

    // 4. Kuris teiginys neišplaukia
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kuris teiginys NEIŠPLAUKIA iš apklausos apie mėgstamiausią sporto šaką duomenų?',
        variantai: [
          'mokiniai, pasirinkę krepšinį, jį lanko kiekvieną dieną',
          `daugiausiai pasirinkimų surinko „${vardai[r.indexOf(maks)]}“`,
          `mažiausiai pasirinkimų surinko „${vardai[r.indexOf(min)]}“`,
          `iš viso apklausta ${viso} mokiniai`,
        ],
        teisingas: 0,
        sprendimas: 'Apie treniruočių dažnumą nebuvo klausiama, tad tokių duomenų nėra.',
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          vardai.map((v, i) => [v, String(r[i])]),
        ),
      }),

    // 5. Kiek reikėtų apklausti
    () => {
      const mokykloje = atsitiktinis(200, 500)
      const apklausta = atsitiktinis(10, 25)
      return pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Mokykloje ${mokykloje} mokiniai, apklausti ${apklausta}. Apie ką galima daryti pagrįstą išvadą?`,
        variantai: [
          'tik apie apklaustuosius',
          'apie visą mokyklą',
          'apie visą miestą',
          'apie visus vaikus',
        ],
        teisingas: 0,
        sprendimas: `${apklausta} iš ${mokykloje} yra maža dalis, tad išvados apie visą mokyklą daryti negalima.`,
      })
    },

    // 6. Patikrinti skaičiumi
    () => {
      const i = atsitiktinis(0, 2)
      return uzdavinys(T12, {
        klausimas: `Teigiama, kad „${vardai[i]}“ pasirinko daugiau nei ${r[i] - 1} mokiniai. Kiek jų pasirinko iš tikrųjų?`,
        atsakymas: String(r[i]),
        atsakymasRodymui: `$${r[i]}$`,
        sprendimas: `Lentelėje nurodyta ${r[i]} — teiginys teisingas.`,
        brezinys: duomenuLentele(
          ['Sporto šaka', 'Mokinių'],
          vardai.map((v, j) => [v, String(r[j])]),
        ),
      })
    },

    // 7. Ko negalima teigti
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ko negalima teigti remiantis vien apklausos skaičiais?',
        variantai: [
          'kodėl mokiniai pasirinko būtent tą atsakymą',
          'kuris atsakymas dažniausias',
          'kiek atsakymų surinkta',
          'kuris atsakymas rečiausias',
        ],
        teisingas: 0,
        sprendimas: 'Priežasčių apklausa neatskleidžia — jos reikėtų klausti atskirai.',
      }),
  ])
}
