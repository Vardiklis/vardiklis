import { naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { histograma, usuDiagrama } from './astuntokams-vaizdai'
import { skirstiniuKreives, taskinesDiagramos } from './desimtokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 10 klasės tema „Duomenys ir jų interpretavimas“ — šešios potemės.
 *
 * Turinio aprašas reikalauja, kad statistinis patikimumas būtų nagrinėjamas
 * per imties sudarymą, dydį ir atsitiktinumą, o ne per hipotezių testus, tad
 * čia nė karto neprašoma nieko, kas peržengtų 10 klasės kursą.
 *
 * Skirstinių kreivės ir taškinės diagramos braižomos iš tikrų reikšmių, tad
 * asimetrijos kryptis ir sklaidos skirtumas paveiksle yra tikri.
 */

/** Trupmena KaTeX pavidalu. */
function tr(virsus: string, apacia: string): string {
  return `\\dfrac{${virsus}}{${apacia}}`
}

/** Tas pats skaičius KaTeX pavidalu. */
function kablelisTeX(n: number): string {
  return String(n).replace('.', '{,}')
}

/** Rinkiniai, kurių dispersija (dalijant iš $n$) yra sveikasis skaičius. */
const RINKINIAI = [
  { reiksmes: [2, 4, 4, 6], vidurkis: 4, dispersija: 2 },
  { reiksmes: [1, 3, 5, 7], vidurkis: 4, dispersija: 5 },
  { reiksmes: [2, 4, 6, 8], vidurkis: 5, dispersija: 5 },
  { reiksmes: [3, 3, 5, 5], vidurkis: 4, dispersija: 1 },
  { reiksmes: [1, 2, 3, 4, 5], vidurkis: 3, dispersija: 2 },
  { reiksmes: [2, 4, 6, 8, 10], vidurkis: 6, dispersija: 8 },
] as const

// ── 7.1. Populiacija, imtis ir pagrįstos išvados ────────────────────────────

const T1 = 'populiacija-ir-imtis'

const A1 = [
  {
    klausimas: 'Mokykloje yra $900$ mokinių, apklausta $90$ atsitiktinai parinktų. Kiek procentų visų mokinių sudaro imtis?',
    atsakymas: '10',
    atsakymasRodymui: '$10$ %',
    sprendimas: '$\\dfrac{90}{900} = 0{,}1 = 10\\ \\%$; populiacija — visi $900$ mokinių, imtis — apklaustieji $90$.',
  },
] as const

export const populiacijaIrImtis: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  return variacija([
    // 1. Populiacija ir imtis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Mokykla nori sužinoti visų $900$ mokinių nuomonę ir apklausia $90$ atsitiktinai parinktų. Kas čia yra populiacija ir kas imtis?',
        variantai: [
          'Populiacija — visi $900$ mokinių, imtis — apklaustieji $90$',
          'Populiacija — apklaustieji $90$, imtis — visi $900$',
          'Populiacija ir imtis sutampa',
          'Populiacija — mokykla, imtis — mokytojai',
        ],
        teisingas: 0,
        sprendimas: 'Populiacija yra visa grupė, apie kurią daromos išvados, o imtis — ta jos dalis, kuri iš tikrųjų tiriama.',
      }),

    // 2. Imties dalis procentais
    () => {
      const populiacija = pasirink([600, 800, 900, 1200])
      const imtis = populiacija / 10
      return uzdavinys(T1, {
        klausimas: `Mokykloje yra $${populiacija}$ mokinių, apklausta $${imtis}$ atsitiktinai parinktų. Kiek procentų visų mokinių sudaro imtis?`,
        atsakymas: '10',
        atsakymasRodymui: '$10$ %',
        sprendimas: `$${tr(String(imtis), String(populiacija))} = ${kablelisTeX(0.1)} = 10\\ \\%$.`,
      })
    },

    // 3. Savanorių apklausa
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ar $20$ savanorių apklausa gali patikimai atspindėti visų miesto gyventojų nuomonę?',
        variantai: [
          'Ne — imtis maža ir sudaryta ne atsitiktinai, tad ji gali atstovauti tik panašiems į savanorius',
          'Taip — svarbu tik tai, kad respondentai atsakė nuoširdžiai',
          'Taip — $20$ žmonių visada pakanka',
          'Ne — nes miesto gyventojų skaičius nežinomas',
        ],
        teisingas: 0,
        sprendimas: 'Savanoriai patys pasirenka dalyvauti, tad jų nuomonė dažnai stipresnė ar kitokia nei vidutinė.',
      }),

    // 4. Atsitiktinė ir patogioji imtis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kodėl atsitiktinė imtis dažniausiai geresnė už patogiąją?',
        variantai: [
          'Nes kiekvienas populiacijos narys turi vienodą galimybę patekti į imtį, tad sisteminis šališkumas mažesnis',
          'Nes atsitiktinė imtis visada didesnė',
          'Nes ją lengviau surinkti',
          'Nes patogiojoje imtyje būna per daug žmonių',
        ],
        teisingas: 0,
        sprendimas: 'Patogioji imtis renkama iš to, kas po ranka, tad tam tikros grupės į ją nepatenka visai.',
      }),

    // 5. Šališka atranka
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Sporto klube apklausti tik rytinėse treniruotėse dalyvaujantys žmonės. Kokia čia problema?',
        variantai: [
          'Imtis šališka: vakarais sportuojantieji į ją nepatenka, nors priklauso tai pačiai populiacijai',
          'Problemos nėra, jei apklausta pakankamai žmonių',
          'Problema ta, kad rytais žmonės pavargę',
          'Problema ta, kad klubas per mažas',
        ],
        teisingas: 0,
        sprendimas: 'Atrankos būdas iš anksto atmeta dalį populiacijos, tad išvada galios tik rytinei grupei.',
      }),

    // 6. Kada tiriama visa populiacija
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kada galima tirti visą populiaciją, o ne imtį?',
        variantai: [
          'Kai populiacija maža ir pasiekiama, pavyzdžiui, visi vienos klasės mokiniai',
          'Kai populiacija labai didelė',
          'Kai tyrimas brangus',
          'Niekada',
        ],
        teisingas: 0,
        sprendimas: 'Ištisinis tyrimas įmanomas tada, kai apklausti visus nėra nei brangu, nei ilga.',
      }),

    // 7. Imties planas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Universitetas nori įvertinti $12\\,000$ studentų kelionės į paskaitas laiką. Kuris imties sudarymo būdas pagrįstas?',
        variantai: [
          'Atsitiktinai atrinkti studentus iš viso sąrašo, išlaikant kursų ir fakultetų proporcijas',
          'Apklausti tuos, kurie ateina anksčiausiai',
          'Apklausti vieno bendrabučio gyventojus',
          'Paskelbti apklausą socialiniame tinkle ir laukti savanorių',
        ],
        teisingas: 0,
        sprendimas: 'Kiti trys būdai iš anksto atrenka panašius studentus, tad kelionės laikas juose būtų sistemingai kitoks.',
      }),

    // 8. Išvados apie visą šalį
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Apklausęs $15$ savo klasės draugų, mokinys padarė išvadą apie visus Lietuvos dešimtokus. Kokios dvi problemos?',
        variantai: [
          'Imtis per maža ir sudaryta ne atsitiktinai — visi respondentai iš tos pačios klasės',
          'Imtis per didelė ir per įvairi',
          'Klausimai buvo per sunkūs, o atsakymai per ilgi',
          'Problemų nėra',
        ],
        teisingas: 0,
        sprendimas: 'Nedidelė ir vienalytė imtis neatspindi šalies įvairovės.',
      }),

    // 9. Dviejų imčių palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kurios imties rezultatai patikimesni: A — $500$ savanorių interneto apklausoje, ar B — $150$ atsitiktinai atrinktų populiacijos narių?',
        variantai: [
          'B, nes atsitiktinė atranka svarbesnė už vien didesnį imties dydį',
          'A, nes imtis didesnė',
          'Abi vienodai patikimos',
          'Nė viena netinka',
        ],
        teisingas: 0,
        sprendimas: 'Didelė, bet šališka imtis sistemingai klysta, ir tos klaidos didinant imtį nemažėja.',
      }),

    // 10. Reprezentatyvumas pagal du požymius
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Tiriama mokyklos mokinių fizinio aktyvumo trukmė. Susiek tyrimo dalį su jos aprašymu.',
        poros: [
          { kaire: 'Populiacija', desine: 'visi mokyklos mokiniai' },
          { kaire: 'Reprezentatyvi imtis', desine: 'atsitiktinai atrinkti mokiniai iš kiekvienos klasės, išlaikant lyčių proporcijas' },
          { kaire: 'Šališka imtis', desine: 'tik sporto būrelio nariai' },
        ],
        sprendimas: 'Reprezentatyvumas tikrinamas pagal tuos požymius, kurie gali paveikti tiriamą dydį.',
      }),
  ])
}

// ── 7.2. Duomenų kintamumas ir pasiskirstymas ───────────────────────────────

const T2 = 'duomenu-kintamumas'

const A2 = [
  {
    klausimas: 'Duomenų rinkinyje $4$, $7$, $7$, $9$, $12$ rask sklaidos plotį (didžiausios ir mažiausios reikšmių skirtumą).',
    atsakymas: '8',
    atsakymasRodymui: '$12 - 4 = 8$',
    sprendimas: 'Mažiausia reikšmė $4$, didžiausia $12$, tad plotis lygus $8$.',
  },
] as const

export const duomenuKintamumas: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  return variacija([
    // 1. Kuris rinkinys kintamesnis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Palygink rinkinius A: $5$, $5$, $5$, $5$, $5$ ir B: $1$, $3$, $5$, $7$, $9$. Kuris labiau kintamas?',
        variantai: [
          'B — jo reikšmės išsibarsčiusios, o A visos vienodos',
          'A — jame daugiau vienodų reikšmių',
          'Abu vienodai kintami, nes vidurkiai lygūs',
          'Kintamumo palyginti negalima',
        ],
        teisingas: 0,
        brezinys: taskinesDiagramos([
          { reiksmes: [5, 5, 5, 5, 5], vardas: 'A' },
          { reiksmes: [1, 3, 5, 7, 9], vardas: 'B' },
        ]),
        sprendimas: 'Abiejų vidurkis lygus $5$, bet A sklaida nulinė, o B reikšmės nutolusios nuo centro.',
      }),

    // 2. Sklaidos plotis
    () => {
      const rinkinys = pasirink([
        [4, 7, 7, 9, 12],
        [3, 5, 8, 8, 14],
        [6, 6, 9, 11, 15],
      ])
      const maziausia = Math.min(...rinkinys)
      const didziausia = Math.max(...rinkinys)
      return uzdavinys(T2, {
        klausimas: `Duomenų rinkinyje $${rinkinys.join('$, $')}$ rask sklaidos plotį (didžiausios ir mažiausios reikšmių skirtumą).`,
        atsakymas: String(didziausia - maziausia),
        atsakymasRodymui: `$${didziausia} - ${maziausia} = ${didziausia - maziausia}$`,
        sprendimas: `Mažiausia reikšmė $${maziausia}$, didžiausia $${didziausia}$, tad plotis lygus $${didziausia - maziausia}$.`,
        brezinys: taskinesDiagramos([{ reiksmes: rinkinys }]),
      })
    },

    // 3. Kas yra kintamumas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ką reiškia duomenų kintamumas?',
        variantai: [
          'Kaip stipriai reikšmės skiriasi viena nuo kitos ir nuo centro',
          'Kokia yra didžiausia reikšmė',
          'Kiek yra duomenų',
          'Koks yra vidurkis',
        ],
        teisingas: 0,
        sprendimas: 'Centras pasako, kur duomenys susitelkę, o kintamumas — kaip plačiai jie išsibarstę.',
      }),

    // 4. Dvi taškinės diagramos
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Brėžinyje pavaizduoti du rinkiniai su tuo pačiu centru. Kuriame sklaida didesnė?',
        variantai: ['Antrajame', 'Pirmajame', 'Abiejuose vienoda', 'Iš brėžinio nustatyti negalima'],
        teisingas: 0,
        brezinys: taskinesDiagramos([
          { reiksmes: [5, 6, 6, 6, 7, 7, 6], vardas: 'A' },
          { reiksmes: [2, 3, 6, 6, 9, 10, 6], vardas: 'B' },
        ]),
        sprendimas: 'Abiejų centras yra apie $6$, bet antrojo taškai nusidriekę per visą ašį.',
      }),

    // 5. Išskirtis
    () => {
      const rinkinys = pasirink([
        [2, 3, 3, 4, 18],
        [5, 6, 6, 7, 24],
        [1, 2, 2, 3, 15],
      ])
      const isskirtis = Math.max(...rinkinys)
      return uzdavinys(T2, {
        klausimas: `Duomenyse $${rinkinys.join('$, $')}$ kuri reikšmė labiausiai išsiskiria iš kitų?`,
        atsakymas: String(isskirtis),
        atsakymasRodymui: `$${isskirtis}$`,
        sprendimas: `Kitos reikšmės sutelktos siaurame ruože, o $${isskirtis}$ nuo jų nutolusi kelis kartus.`,
        brezinys: taskinesDiagramos([{ reiksmes: rinkinys }]),
      })
    },

    // 6. Du rinkiniai su tuo pačiu vidurkiu
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kurie du šešių skaičių rinkiniai turi tą patį vidurkį $10$, bet labai skirtingą sklaidą?',
        variantai: [
          '$9, 10, 10, 10, 10, 11$ ir $1, 2, 3, 17, 18, 19$',
          '$9, 10, 10, 10, 10, 11$ ir $8, 9, 10, 10, 11, 12$',
          '$1, 2, 3, 4, 5, 6$ ir $7, 8, 9, 10, 11, 12$',
          '$10, 10, 10, 10, 10, 10$ ir $9, 9, 9, 11, 11, 11$',
        ],
        teisingas: 0,
        sprendimas: 'Abiejų suma lygi $60$, tad vidurkis $10$, bet antrojo reikšmės nutolusios nuo centro daug labiau.',
      }),

    // 7. Vienodas vidurkis, kitoks pasiskirstymas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Mokinys teigia, kad vienodas vidurkis reiškia vienodą duomenų pasiskirstymą. Kuris kontrpavyzdys tai paneigia?',
        variantai: [
          '$5, 5, 5$ ir $1, 5, 9$ — vidurkis abiejų $5$, bet pasiskirstymas visai kitoks',
          '$5, 5, 5$ ir $6, 6, 6$',
          '$1, 2, 3$ ir $1, 2, 3$',
          '$2, 4$ ir $1, 2$',
        ],
        teisingas: 0,
        brezinys: taskinesDiagramos([
          { reiksmes: [5, 5, 5], vardas: 'A' },
          { reiksmes: [1, 5, 9], vardas: 'B' },
        ]),
        sprendimas: 'Vidurkis apibūdina tik centrą; sklaida ir forma iš jo neišplaukia.',
      }),

    // 8. Dvi histogramos
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Brėžinyje pavaizduota histograma. Kaip apibūdintum duomenų pasiskirstymą?',
        variantai: [
          'Simetriškas ir siauras — dauguma reikšmių sutelktos ties viduriu',
          'Aiškiai asimetriškas į dešinę',
          'Tolygus — visų intervalų dažniai vienodi',
          'Dvimodalinis — yra dvi atskiros viršūnės',
        ],
        teisingas: 0,
        brezinys: histograma([
          { vardas: '0–10', daznis: 2 },
          { vardas: '10–20', daznis: 6 },
          { vardas: '20–30', daznis: 12 },
          { vardas: '30–40', daznis: 6 },
          { vardas: '40–50', daznis: 2 },
        ]),
        sprendimas: 'Kraštiniai stulpeliai vienodi, o didžiausias yra viduryje — tai simetriškos ir siauros formos požymis.',
      }),

    // 9. Išskirties poveikis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Rinkinyje yra viena labai didelė išskirtis. Kaip ji paveikia duomenų vaizdą?',
        variantai: [
          'Ji pastebimai patraukia vidurkį į savo pusę ir padidina sklaidą, o mediana pasikeičia mažai',
          'Ji nieko nekeičia',
          'Ji sumažina sklaidą',
          'Ji pakeičia tik medianą',
        ],
        teisingas: 0,
        sprendimas: 'Vidurkis ir sklaida skaičiuojami iš visų reikšmių, tad viena tolima reikšmė juos stipriai veikia.',
      }),

    // 10. Pasiskirstymo aprašymas
    () =>
      poruUzdavinys(naujasId(T2), T2, {
        klausimas: 'Duomenys: $12$, $14$, $15$, $15$, $16$, $18$, $40$. Susiek pasiskirstymo požymį su reikšme.',
        poros: [
          { kaire: 'Centras (mediana)', desine: '$15$' },
          { kaire: 'Sklaidos plotis', desine: '$40 - 12 = 28$' },
          { kaire: 'Išskirtis', desine: '$40$' },
        ],
        brezinys: taskinesDiagramos([{ reiksmes: [12, 14, 15, 15, 16, 18, 40] }]),
        sprendimas: 'Mediana yra vidurinė reikšmė, o plotį stipriai išpučia būtent išskirtis.',
      }),
  ])
}

// ── 7.3. Dispersija ir standartinis nuokrypis ───────────────────────────────

const T3 = 'dispersija-nuokrypis'

const A3 = [
  {
    klausimas: 'Rask rinkinio $2$, $2$, $2$, $2$ standartinį nuokrypį.',
    atsakymas: '0',
    atsakymasRodymui: '$0$',
    sprendimas: 'Visos reikšmės vienodos, tad nė viena nenukrypsta nuo vidurkio.',
  },
] as const

export const dispersijaNuokrypis: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const r = pasirink(RINKINIAI)

  return variacija([
    // 1. Nulinis nuokrypis
    () => {
      const reiksme = pasirink([2, 5, 7, 9])
      return uzdavinys(T3, {
        klausimas: `Rask rinkinio $${reiksme}$, $${reiksme}$, $${reiksme}$, $${reiksme}$ standartinį nuokrypį.`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: `Vidurkis lygus $${reiksme}$, tad kiekvieno nario nuokrypis nulinis, o kartu ir dispersija, ir standartinis nuokrypis lygūs nuliui.`,
      })
    },

    // 2. Kuris nuokrypis didesnis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuris rinkinys turi didesnį standartinį nuokrypį: A — $9$, $10$, $11$ ar B — $1$, $10$, $19$? Atsakyk neskaičiuodamas tiksliai.',
        variantai: [
          'B, nes jo reikšmės nuo bendro vidurkio $10$ nutolusios daug labiau',
          'A, nes jo reikšmės didesnės',
          'Abiejų vienodas, nes vidurkiai lygūs',
          'Nustatyti neįmanoma',
        ],
        teisingas: 0,
        brezinys: taskinesDiagramos([
          { reiksmes: [9, 10, 11], vardas: 'A' },
          { reiksmes: [1, 10, 19], vardas: 'B' },
        ]),
        sprendimas: 'Abiejų vidurkis $10$, bet A nuokrypiai yra $1$, o B — $9$.',
      }),

    // 3. Ką matuoja standartinis nuokrypis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ką matuoja standartinis nuokrypis?',
        variantai: [
          'Vidutinį reikšmių nutolimą nuo vidurkio',
          'Didžiausią reikšmę rinkinyje',
          'Duomenų kiekį',
          'Vidurkio dydį',
        ],
        teisingas: 0,
        sprendimas: 'Tai sklaidos, o ne centro charakteristika.',
      }),

    // 4. Pridėjus pastovų skaičių
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Prie kiekvienos duomenų reikšmės pridėjus $5$, kaip pasikeis standartinis nuokrypis?',
        variantai: [
          'Nepasikeis — pasislenka visas rinkinys, o tarpusavio atstumai lieka tie patys',
          'Padidės $5$ vienetais',
          'Padidės $5$ kartus',
          'Sumažės $5$ vienetais',
        ],
        teisingas: 0,
        sprendimas: 'Vidurkis padidėja $5$, tad kiekvieno nario nuokrypis nuo jo išlieka nepakitęs.',
      }),

    // 5. Dispersijos ir nuokrypio ryšys
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuo dispersija susijusi su standartiniu nuokrypiu?',
        variantai: [
          'Standartinis nuokrypis yra dispersijos kvadratinė šaknis',
          'Dispersija yra standartinio nuokrypio kvadratinė šaknis',
          'Jie visada lygūs',
          'Dispersija yra dvigubas standartinis nuokrypis',
        ],
        teisingas: 0,
        sprendimas: 'Dispersija skaičiuojama iš nuokrypių kvadratų, tad ji matuojama kvadratiniais vienetais; šaknis grąžina pradinius vienetus.',
      }),

    // 6. Dispersijos skaičiavimas
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok duomenų $${r.reiksmes.join('$, $')}$ dispersiją.`,
        atsakymas: String(r.dispersija),
        atsakymasRodymui: `dispersija $= ${r.dispersija}$`,
        sprendimas: `Vidurkis lygus $${r.vidurkis}$; nuokrypių kvadratų suma yra $${r.reiksmes.reduce((s, v) => s + (v - r.vidurkis) ** 2, 0)}$, o padalijus iš $${r.reiksmes.length}$ gaunama $${r.dispersija}$. Standartinis nuokrypis — $\\sqrt{${r.dispersija}}$.`,
        brezinys: taskinesDiagramos([{ reiksmes: r.reiksmes }]),
      }),

    // 7. Ką reiškia skirtingi nuokrypiai
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Du rinkiniai turi tą patį vidurkį $50$, bet standartinius nuokrypius $2$ ir $12$. Ką tai reiškia praktiškai?',
        variantai: [
          'Pirmojo rezultatai stabilūs ir nuspėjami, antrojo — labai įvairūs',
          'Pirmojo rezultatai didesni',
          'Antrojo vidurkis iš tikrųjų didesnis',
          'Skirtumo praktikoje nėra',
        ],
        teisingas: 0,
        sprendimas: 'Mažesnis nuokrypis reiškia, kad atskiros reikšmės arti vidurkio, tad prognozė patikimesnė.',
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Mokinys teigia, kad didesnis standartinis nuokrypis reiškia didesnį vidurkį. Kuris kontrpavyzdys tai paneigia?',
        variantai: [
          '$1$, $10$, $19$ (vidurkis $10$, didelė sklaida) ir $99$, $100$, $101$ (vidurkis $100$, maža sklaida)',
          '$1$, $2$, $3$ ir $4$, $5$, $6$',
          '$5$, $5$, $5$ ir $5$, $5$, $5$',
          '$2$, $4$ ir $6$, $8$',
        ],
        teisingas: 0,
        sprendimas: 'Vidurkis ir sklaida yra nepriklausomi dydžiai: didelė sklaida gali būti ir prie mažo vidurkio.',
      }),

    // 9. Padauginus iš skaičiaus
    () => {
      const nuokrypis = pasirink([2, 4, 5])
      const daugiklis = 3
      return uzdavinys(T3, {
        klausimas: `Duomenų rinkinio standartinis nuokrypis lygus $${nuokrypis}$. Visas reikšmes padauginus iš $${daugiklis}$, koks jis taps?`,
        atsakymas: String(nuokrypis * daugiklis),
        atsakymasRodymui: `$${nuokrypis * daugiklis}$`,
        sprendimas: `Padauginus reikšmes, tiek pat kartų padidėja ir vidurkis, ir kiekvienas nuokrypis: $${nuokrypis} \\cdot ${daugiklis} = ${nuokrypis * daugiklis}$.`,
      })
    },

    // 10. Rinkiniai su tuo pačiu vidurkiu
    () =>
      poruUzdavinys(naujasId(T3), T3, {
        klausimas: 'Du penkių reikšmių rinkiniai turi tą patį vidurkį $6$. Susiek rinkinį su jo dispersija.',
        poros: [
          { kaire: '$6$, $6$, $6$, $6$, $6$', desine: 'dispersija $0$' },
          { kaire: '$5$, $6$, $6$, $6$, $7$', desine: 'dispersija $0{,}4$' },
          { kaire: '$2$, $4$, $6$, $8$, $10$', desine: 'dispersija $8$' },
        ],
        sprendimas: 'Vidurkis visų trijų lygus $6$, bet nuokrypių kvadratų suma vis didesnė.',
      }),
  ])
}

// ── 7.4. Normalusis, simetriškasis ir asimetriškasis skirstiniai ────────────

const T4 = 'skirstiniu-formos'

const A4 = [
  {
    klausimas: 'Kokia bendra forma būdinga normaliajam skirstiniui?',
    atsakymas: 'B',
    atsakymasRodymui: 'varpo formos simetriška kreivė',
    sprendimas: 'Dauguma reikšmių sutelktos ties centru, o abi uodegos vienodai plonėja.',
  },
] as const

export const skirstiniuFormos: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  return variacija([
    // 1. Formų susiejimas
    () =>
      poruUzdavinys(naujasId(T4), T4, {
        klausimas: 'Brėžinyje pavaizduotos trys skirstinių kreivės. Susiek jas su pavadinimais.',
        poros: [
          { kaire: 'Kairioji kreivė', desine: 'simetriškas (varpo formos) skirstinys' },
          { kaire: 'Vidurinė kreivė', desine: 'dešiniškai asimetriškas — ilga uodega į dešinę' },
          { kaire: 'Dešinioji kreivė', desine: 'kairiškai asimetriškas — ilga uodega į kairę' },
        ],
        brezinys: skirstiniuKreives([
          { forma: 'simetriskas', vardas: 'kairioji' },
          { forma: 'desine', vardas: 'vidurinė' },
          { forma: 'kaire', vardas: 'dešinioji' },
        ]),
        sprendimas: 'Asimetrijos kryptį rodo tai, į kurią pusę tęsiasi ilgesnioji uodega.',
      }),

    // 2. Kas yra simetriškas skirstinys
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ką reiškia simetriškas duomenų skirstinys?',
        variantai: [
          'Kairioji ir dešinioji pusės apie centrą atrodo vienodai',
          'Visos reikšmės vienodos',
          'Duomenų yra lyginis skaičius',
          'Vidurkis lygus nuliui',
        ],
        teisingas: 0,
        brezinys: skirstiniuKreives([{ forma: 'simetriskas', vardas: 'simetriškas' }]),
        sprendimas: 'Simetrijos ašis eina per skirstinio centrą, ir abi pusės yra jos veidrodinis atspindys.',
      }),

    // 3. Normaliojo skirstinio forma
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kokia bendra forma būdinga normaliajam skirstiniui?',
        variantai: [
          'Varpo formos simetriška kreivė su viena viršūne ties centru',
          'Tolygi, vienodo aukščio kreivė',
          'Kreivė su dviem vienodomis viršūnėmis',
          'Kreivė su ilga uodega į dešinę',
        ],
        teisingas: 0,
        brezinys: skirstiniuKreives([{ forma: 'simetriskas', vardas: 'normalusis' }]),
        sprendimas: 'Dauguma reikšmių sutelktos ties centru, o abi uodegos plonėja vienodai.',
      }),

    // 4. Asimetrijos kryptis
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Dauguma reikšmių yra mažos, o kelios labai didelės. Į kurią pusę bus asimetrija?',
        variantai: [
          'Į dešinę — ilgoji uodega tęsiasi didelių reikšmių pusėn',
          'Į kairę',
          'Skirstinys bus simetriškas',
          'Skirstinys bus tolygus',
        ],
        teisingas: 0,
        brezinys: skirstiniuKreives([{ forma: 'desine', vardas: 'dešiniškai asimetriškas' }]),
        sprendimas: 'Asimetrijos kryptį nurodo uodega, o ne ta pusė, kurioje yra dauguma reikšmių.',
      }),

    // 5. Realaus gyvenimo pavyzdys
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kurio dydžio pasiskirstymas galėtų būti apytiksliai simetriškas?',
        variantai: [
          'Suaugusių to paties amžiaus žmonių ūgis',
          'Gyventojų metinės pajamos',
          'Namų kainos mieste',
          'Laukimo trukmė eilėje piko metu',
        ],
        teisingas: 0,
        sprendimas: 'Ūgis telkiasi apie vidurkį ir į abi puses krinta panašiai, o pajamos ir kainos turi ilgą dešiniąją uodegą.',
      }),

    // 6. Vidurkis ir mediana asimetriškame skirstinyje
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Histograma turi ilgą dešiniąją uodegą. Kaip tada susiję vidurkis ir mediana?',
        variantai: [
          'Vidurkis didesnis už medianą, nes didelės reikšmės jį patraukia į dešinę',
          'Vidurkis mažesnis už medianą',
          'Jie lygūs',
          'Ryšio nėra',
        ],
        teisingas: 0,
        brezinys: skirstiniuKreives([{ forma: 'desine', vardas: 'ilga uodega į dešinę' }]),
        sprendimas: 'Mediana priklauso tik nuo reikšmių vietos eilėje, o vidurkis jautrus tolimoms reikšmėms.',
      }),

    // 7. Simetriškas nebūtinai normalusis
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Mokinys teigia, kad kiekvienas simetriškas skirstinys būtinai yra normalusis. Kodėl ne?',
        variantai: [
          'Simetriškas gali būti ir dvimodalinis ar tolygus skirstinys, o normalusis turi vieną varpo formos viršūnę',
          'Nes normalusis skirstinys nėra simetriškas',
          'Nes simetriškų skirstinių nebūna',
          'Nes normalusis skirstinys turi dvi viršūnes',
        ],
        teisingas: 0,
        brezinys: skirstiniuKreives([
          { forma: 'simetriskas', vardas: 'normalusis' },
          { forma: 'dvimodalinis', vardas: 'dvimodalinis' },
          { forma: 'tolygus', vardas: 'tolygus' },
        ]),
        sprendimas: 'Visi trys brėžinio skirstiniai simetriški, bet tik pirmasis yra varpo formos.',
      }),

    // 8. Varpo ir dvimodalinis
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Vienas skirstinys yra varpo formos, kitas — simetriškas, bet su dviem viršūnėmis. Kurį galima vadinti normaliuoju?',
        variantai: [
          'Tik varpo formos',
          'Abu',
          'Tik dvimodalinį',
          'Nė vieno',
        ],
        teisingas: 0,
        brezinys: skirstiniuKreives([
          { forma: 'simetriskas', vardas: 'pirmasis' },
          { forma: 'dvimodalinis', vardas: 'antrasis' },
        ]),
        sprendimas: 'Normaliajam skirstiniui būtina viena viršūnė ties centru.',
      }),

    // 9. Simetriškų skirstinių skaičius
    () =>
      uzdavinys(T4, {
        klausimas: 'Brėžinyje pavaizduotos keturios skirstinių kreivės. Kiek iš jų yra simetriškos?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Simetriški yra varpo formos ir dvimodalinis skirstiniai; abu asimetriški turi po ilgą uodegą.',
        brezinys: skirstiniuKreives([
          { forma: 'simetriskas', vardas: 'A' },
          { forma: 'desine', vardas: 'B' },
          { forma: 'dvimodalinis', vardas: 'C' },
          { forma: 'kaire', vardas: 'D' },
        ]),
      }),

    // 10. Artimiausias normaliajam
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Brėžinyje pateiktos keturios histogramos. Kuri arčiausiai normaliojo skirstinio?',
        variantai: [
          'Ta, kurios stulpeliai simetriškai auga iki vidurio ir vėl krinta',
          'Ta, kurios stulpeliai vienodo aukščio',
          'Ta, kuri turi ilgą uodegą dešinėje',
          'Ta, kuri turi dvi vienodas viršūnes',
        ],
        teisingas: 0,
        brezinys: histograma([
          { vardas: '0–10', daznis: 1 },
          { vardas: '10–20', daznis: 5 },
          { vardas: '20–30', daznis: 10 },
          { vardas: '30–40', daznis: 5 },
          { vardas: '40–50', daznis: 1 },
        ]),
        sprendimas: 'Normaliajam skirstiniui būdinga viena centrinė viršūnė ir simetriškai plonėjančios uodegos.',
      }),
  ])
}

// ── 7.5. Duomenų centro ir sklaidos charakteristikų interpretavimas ─────────

const T5 = 'centro-ir-sklaidos-interpretavimas'

const A5 = [
  {
    klausimas: 'Rinkinyje $2$, $3$, $4$, $5$, $30$ rask medianą.',
    atsakymas: '4',
    atsakymasRodymui: 'mediana $= 4$',
    sprendimas: 'Reikšmės surikiuotos, o vidurinė iš penkių yra $4$; vidurkis būtų $8{,}8$ ir tipiškos reikšmės neatspindėtų.',
  },
] as const

export const centroIrSklaidosInterpretavimas: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  return variacija([
    // 1. Vienodi vidurkiai, skirtingi nuokrypiai
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Dviejų klasių pažymių vidurkiai vienodi, bet vienos klasės standartinis nuokrypis didesnis. Ką tai reiškia?',
        variantai: [
          'Toje klasėje rezultatai labiau išsibarstę: daugiau ir labai gerų, ir labai silpnų pažymių',
          'Toje klasėje mokiniai geresni',
          'Toje klasėje daugiau mokinių',
          'Vidurkiai apskaičiuoti klaidingai',
        ],
        teisingas: 0,
        sprendimas: 'Vidurkis rodo centrą, o nuokrypis — kaip toli nuo jo nutolusios atskiros reikšmės.',
      }),

    // 2. Kada mediana geriau
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kada medianą prasmingiau naudoti už vidurkį?',
        variantai: [
          'Kai duomenyse yra išskirčių arba skirstinys stipriai asimetriškas',
          'Kai duomenų mažai',
          'Kai visos reikšmės vienodos',
          'Kai duomenys sveikieji skaičiai',
        ],
        teisingas: 0,
        sprendimas: 'Mediana nepriklauso nuo to, kaip toli nutolusios kraštinės reikšmės, tad ji atsparesnė išskirtims.',
      }),

    // 3. Mediana su išskirtimi
    () => {
      const rinkinys = pasirink([
        [2, 3, 4, 5, 30],
        [1, 2, 6, 7, 40],
        [3, 4, 8, 9, 50],
      ])
      const mediana = rinkinys[2]
      const vidurkis = rinkinys.reduce((s, v) => s + v, 0) / rinkinys.length
      return uzdavinys(T5, {
        klausimas: `Rinkinyje $${rinkinys.join('$, $')}$ rask medianą.`,
        atsakymas: String(mediana),
        atsakymasRodymui: `mediana $= ${mediana}$`,
        sprendimas: `Reikšmės surikiuotos, tad vidurinė iš penkių yra $${mediana}$; vidurkis būtų $${kablelisTeX(vidurkis)}$ ir tipiškos reikšmės neatspindėtų.`,
        brezinys: taskinesDiagramos([{ reiksmes: rinkinys }]),
      })
    },

    // 4. Centras ir sklaida
    () =>
      poruUzdavinys(naujasId(T5), T5, {
        klausimas: 'Susiek charakteristiką su tuo, ką ji apibūdina.',
        poros: [
          { kaire: 'Vidurkis', desine: 'duomenų centrą' },
          { kaire: 'Mediana', desine: 'centrą, atsparų išskirtims' },
          { kaire: 'Standartinis nuokrypis', desine: 'sklaidą apie centrą' },
        ],
        sprendimas: 'Centro charakteristikos pasako, kur duomenys susitelkę, sklaidos — kaip plačiai jie išsidėstę.',
      }),

    // 5. Dviejų rinkinių palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Rinkinio A vidurkis $50$, standartinis nuokrypis $3$; rinkinio B — $48$ ir $12$. Kuris teiginys teisingas?',
        variantai: [
          'Vidurkiai panašūs, bet A rezultatai kur kas stabilesni',
          'B rezultatai stabilesni',
          'A ir B vienodi',
          'B vidurkis daug didesnis',
        ],
        teisingas: 0,
        sprendimas: 'Skirtumas tarp $50$ ir $48$ mažas, o sklaida skiriasi keturis kartus.',
      }),

    // 6. Vienoda mediana, skirtingas vidurkis
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Dviejų darbuotojų grupių atlyginimų medianos vienodos, bet vienoje grupėje vidurkis daug didesnis. Kokia galima priežastis?',
        variantai: [
          'Toje grupėje yra keli labai dideli atlyginimai, kurie patraukia vidurkį, bet medianos beveik nekeičia',
          'Toje grupėje daugiau darbuotojų',
          'Ta grupė dirba ilgiau',
          'Medianos apskaičiuotos klaidingai',
        ],
        teisingas: 0,
        sprendimas: 'Kelios didelės reikšmės keičia sumą, o kartu ir vidurkį, bet vidurinės reikšmės vietos beveik nepajudina.',
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Iš dviejų vienodų vidurkių mokinys padarė išvadą, kad grupių rezultatai vienodi. Ko dar reikia?',
        variantai: [
          'Sklaidos charakteristikų — standartinio nuokrypio, ploties ar kvartilių',
          'Daugiau duomenų apie vidurkį',
          'Tik medianos',
          'Nieko — išvada teisinga',
        ],
        teisingas: 0,
        sprendimas: 'Vienodas vidurkis gali slėpti visai skirtingus pasiskirstymus.',
      }),

    // 8. Kvartilių skirtumas
    () => {
      const q1 = pasirink([12, 15, 20])
      const q3 = q1 + pasirink([8, 10, 12])
      return uzdavinys(T5, {
        klausimas: `Duomenų $Q_1 = ${q1}$, o $Q_3 = ${q3}$. Rask kvartilių skirtumą.`,
        atsakymas: String(q3 - q1),
        atsakymasRodymui: `$Q_3 - Q_1 = ${q3 - q1}$`,
        sprendimas: `Kvartilių skirtumas rodo, kokiame ruože telpa vidurinieji $50\\ \\%$ duomenų: $${q3} - ${q1} = ${q3 - q1}$.`,
        brezinys: usuDiagrama(q1 - 6, q1, (q1 + q3) / 2, q3, q3 + 8),
      })
    },

    // 9. Rinkiniai su ta pačia mediana
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kurie du rinkiniai turi tą pačią medianą, bet aiškiai skirtingus vidurkius?',
        variantai: [
          '$1$, $5$, $9$ ir $1$, $5$, $60$',
          '$1$, $5$, $9$ ir $2$, $5$, $8$',
          '$3$, $3$, $3$ ir $3$, $3$, $3$',
          '$1$, $2$, $3$ ir $4$, $5$, $6$',
        ],
        teisingas: 0,
        sprendimas: 'Abiejų mediana lygi $5$, bet vidurkiai yra $5$ ir $22$ — vieną iš jų išpučia didelė reikšmė.',
      }),

    // 10. Prognozuojamumas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Du tyrimai turi panašius vidurkius, bet vieno rezultatai labai išsibarstę. Kaip tai keičia interpretaciją?',
        variantai: [
          'Prie didelės sklaidos vidurkis blogiau apibūdina atskirą atvejį, tad prognozės mažiau patikimos',
          'Interpretacija nesikeičia',
          'Didesnė sklaida reiškia tikslesnį vidurkį',
          'Didesnė sklaida reiškia didesnį vidurkį',
        ],
        teisingas: 0,
        sprendimas: 'Kuo plačiau išsibarstę duomenys, tuo dažniau atskira reikšmė smarkiai skiriasi nuo vidurkio.',
      }),
  ])
}

// ── 7.6. Statistinis patikimumas ────────────────────────────────────────────

const T6 = 'statistinis-patikimumas'

const A6 = [
  {
    klausimas: 'Mokykloje $600$ mokinių, o atsitiktinei apklausai atrinkta $150$. Kiek procentų populiacijos sudaro imtis?',
    atsakymas: '25',
    atsakymasRodymui: '$25$ %',
    sprendimas: '$\\dfrac{150}{600} = 0{,}25 = 25\\ \\%$.',
  },
] as const

export const statistinisPatikimumas: Generatorius = () => suBandymais(kurk6, A6, T6)

function kurk6(): Uzdavinys | null {
  return variacija([
    // 1. Atsitiktinė ar patogioji
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kuris tyrimas patikimesnis: $20$ atsitiktinai ar $20$ patogiai pasirinktų respondentų?',
        variantai: [
          'Atsitiktinai parinktų — patogioji atranka sistemingai praleidžia dalį populiacijos',
          'Patogiai pasirinktų — juos lengviau pasiekti',
          'Abu vienodai patikimi',
          'Nė vienas netinka, nes imtis $20$',
        ],
        teisingas: 0,
        sprendimas: 'Prie vienodo imties dydžio lemia atrankos būdas.',
      }),

    // 2. Imties dalis
    () => {
      const populiacija = pasirink([600, 800, 1000])
      const imtis = populiacija / 4
      return uzdavinys(T6, {
        klausimas: `Mokykloje $${populiacija}$ mokinių, o atsitiktinei apklausai atrinkta $${imtis}$. Kiek procentų populiacijos sudaro imtis?`,
        atsakymas: '25',
        atsakymasRodymui: '$25$ %',
        sprendimas: `$${tr(String(imtis), String(populiacija))} = ${kablelisTeX(0.25)} = 25\\ \\%$.`,
      })
    },

    // 3. Didesnė imtis
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kaip didesnė atsitiktinė imtis paprastai veikia išvadų stabilumą?',
        variantai: [
          'Rezultatai mažiau svyruoja kartojant tyrimą, tad išvados stabilesnės',
          'Rezultatai tampa nepatikimesni',
          'Nieko nekeičia',
          'Padidina šališkumą',
        ],
        teisingas: 0,
        sprendimas: 'Atsitiktinis svyravimas mažėja didėjant imčiai, bet šališkumo tai neištaiso.',
      }),

    // 4. Viena klasė apie visą šalį
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kodėl vienos klasės apklausos nepakanka spręsti apie visos šalies mokinius?',
        variantai: [
          'Viena klasė yra maža ir vienalytė imtis, neatspindinti šalies įvairovės',
          'Nes klasėje per daug mokinių',
          'Nes mokiniai atsako nenuoširdžiai',
          'Nes klausimynas per trumpas',
        ],
        teisingas: 0,
        sprendimas: 'Vienos vietos, vieno amžiaus ir panašios aplinkos mokiniai negali atstovauti visai populiacijai.',
      }),

    // 5. Nepatikimumo priežastys
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Dėl kurių priežasčių statistinė išvada gali būti nepatikima?',
        variantai: [
          'Per maža imtis ir šališkas atrankos būdas',
          'Per daug atsitiktinumo atrankoje',
          'Per didelis populiacijos dydis',
          'Per tikslūs matavimai',
        ],
        teisingas: 0,
        sprendimas: 'Šie du trūkumai veikia skirtingai: mažas dydis didina svyravimą, šališkumas — sistemingą klaidą.',
      }),

    // 6. Rinkimo būdo svarba
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kodėl duomenų rinkimo būdas svarbus ne mažiau negu imties dydis?',
        variantai: [
          'Nes šališkumas nemažėja didinant imtį — didelė šališka imtis klysta taip pat sistemingai',
          'Nes didelės imtys sunkiai renkamos',
          'Nes būdas nulemia klausimų skaičių',
          'Nes rinkimo būdas keičia populiacijos dydį',
        ],
        teisingas: 0,
        sprendimas: 'Atsitiktinė paklaida mažėja su imtimi, o sisteminė — ne.',
      }),

    // 7. Dviejų tyrimų palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Tyrimas A — $1000$ savanorių socialiniame tinkle, tyrimas B — $400$ atsitiktinai atrinktų gyventojų. Kurio išvadas saugiau apibendrinti?',
        variantai: [
          'B, nes jo imtis atsitiktinė ir atstovauja populiacijai',
          'A, nes imtis didesnė',
          'Abu vienodai',
          'Nė vieno',
        ],
        teisingas: 0,
        sprendimas: 'Savanoriai socialiniame tinkle yra atskira grupė, tad jų atsakymai gali sistemingai skirtis nuo visos populiacijos.',
      }),

    // 8. Didelė, bet šališka imtis
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Mokinys sako: „Imtis didelė, vadinasi, rezultatas tikrai patikimas.“ Kuris atvejis tai paneigia?',
        variantai: [
          'Apklausus $10\\,000$ prekybos centro lankytojų daroma išvada apie visų šalies gyventojų apsipirkimo įpročius',
          'Apklausus $500$ atsitiktinai atrinktų gyventojų',
          'Apklausus visą populiaciją',
          'Apklausus $50$ atsitiktinai atrinktų žmonių',
        ],
        teisingas: 0,
        sprendimas: 'Tie, kurie neapsiperka tame centre, į imtį nepatenka niekada, kad ir kokia ji būtų didelė.',
      }),

    // 9. Apklausos plano dalys
    () =>
      eiliskumoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Sudėliok apklausos plano žingsnius teisinga tvarka.',
        teisingaEile: [
          'Apibrėžti populiaciją, apie kurią bus daromos išvados',
          'Pasirinkti atsitiktinės atrankos būdą',
          'Nustatyti imties dydį',
          'Įvardyti galimus šališkumo šaltinius ir surinkti duomenis',
        ],
        sprendimas: 'Populiacija apibrėžiama pirmiausia — be jos neaišku, iš ko rinkti imtį.',
      }),

    // 10. Skirtingi rezultatai
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Du nepriklausomi atsitiktiniai tyrimai davė šiek tiek skirtingus rezultatus. Ar tai reiškia, kad vienas klaidingas?',
        variantai: [
          'Ne — skirtingos atsitiktinės imtys natūraliai duoda šiek tiek skirtingus įverčius',
          'Taip — teisingas gali būti tik vienas',
          'Taip — reikia rinktis didesnįjį rezultatą',
          'Ne — tai reiškia, kad abu klaidingi',
        ],
        teisingas: 0,
        sprendimas: 'Atsitiktinis svyravimas yra neišvengiamas; svarbu, ar rezultatai skiriasi daugiau, nei leidžia imties dydis.',
      }),
  ])
}
