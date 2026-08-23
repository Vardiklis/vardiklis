import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { trigTrikampis } from './devintokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 9 klasės tema „Įvadas į trigonometriją“ — penkios potemės.
 *
 * Visur, kur prašoma santykio, statiniai parenkami iš Pitagoro trejetų, kad
 * atsakymas būtų tvarkinga trupmena. Ten, kur be skaičiuotuvo neapsieitum,
 * klausiama ne pačios reikšmės, o veiksmų tvarkos arba palyginimo.
 *
 * Kiekvienoje sąlygoje aiškiai pasakoma, kuris trikampis statusis ir kur yra
 * statusis kampas — to reikalauja turinio aprašas.
 */

/** Pitagoro trejetai: [gretimasis, priešais esantis, įžambinė]. */
const TREJETAI = [
  [4, 3, 5],
  [3, 4, 5],
  [12, 5, 13],
  [5, 12, 13],
  [8, 6, 10],
  [15, 8, 17],
  [8, 15, 17],
  [24, 7, 25],
] as const

function trejetas(): readonly [number, number, number] {
  return pasirink(TREJETAI) as unknown as readonly [number, number, number]
}

/** Trupmena. */
function tr(virsus: number, apacia: number): string {
  return `\\dfrac{${virsus}}{${apacia}}`
}

// ── 7.1. Smailiojo kampo sinusas, kosinusas ir tangentas ────────────────────

const T1 = 'sinusas-kosinusas-tangentas'

const A1 = [
  {
    klausimas: 'Stačiajame trikampyje įžambinė 5, o prieš kampą α esantis statinis 3. Kam lygus $\\sin \\alpha$? Užrašyk trupmenos skaitiklį.',
    atsakymas: '3',
    atsakymasRodymui: '$\\dfrac{3}{5}$',
    sprendimas: 'Sinusas — priešais esančio statinio ir įžambinės santykis.',
  },
] as const

export const sinusasKosinusasTangentas: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  const [greta, priesais, izam] = trejetas()

  return variacija([
    // 1. Sinusas
    () =>
      uzdavinys(T1, {
        klausimas: `Stačiojo trikampio $ABC$ statusis kampas yra prie viršūnės $C$, o smailusis kampas $\\alpha$ — prie viršūnės $A$. Prieš kampą $\\alpha$ esantis statinis ${priesais}, įžambinė ${izam}. Kam lygus $\\sin \\alpha$? Užrašyk trupmenos skaitiklį.`,
        atsakymas: String(priesais),
        atsakymasRodymui: `$\\sin \\alpha = ${tr(priesais, izam)}$`,
        sprendimas: 'Sinusas — priešais esančio statinio ir įžambinės santykis.',
        brezinys: trigTrikampis(greta, priesais, { priesais: String(priesais), izambine: String(izam) }),
      }),

    // 2. Kosinusas
    () =>
      uzdavinys(T1, {
        klausimas: `Stačiojo trikampio statusis kampas prie viršūnės $C$. Prie smailiojo kampo $\\alpha$ esantis statinis ${greta}, įžambinė ${izam}. Kam lygus $\\cos \\alpha$? Užrašyk trupmenos skaitiklį.`,
        atsakymas: String(greta),
        atsakymasRodymui: `$\\cos \\alpha = ${tr(greta, izam)}$`,
        sprendimas: 'Kosinusas — prie kampo esančio statinio ir įžambinės santykis.',
        brezinys: trigTrikampis(greta, priesais, { greta: String(greta), izambine: String(izam) }),
      }),

    // 3. Tangentas
    () =>
      uzdavinys(T1, {
        klausimas: `Stačiajame trikampyje prieš kampą $\\alpha$ esantis statinis ${priesais}, o prie kampo esantis statinis ${greta}. Kam lygus $\\mathrm{tg}\\,\\alpha$? Užrašyk trupmenos skaitiklį.`,
        atsakymas: String(priesais),
        atsakymasRodymui: `$\\mathrm{tg}\\,\\alpha = ${tr(priesais, greta)}$`,
        sprendimas: 'Tangentas — priešais esančio ir prie kampo esančio statinių santykis.',
        brezinys: trigTrikampis(greta, priesais, { greta: String(greta), priesais: String(priesais) }),
      }),

    // 4. Kurios kraštinės naudojamos
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Sujunk trigonometrinį santykį su jo apibrėžimu.',
        poros: [
          { kaire: '$\\sin \\alpha$', desine: 'priešais esantis statinis / įžambinė' },
          { kaire: '$\\cos \\alpha$', desine: 'prie kampo esantis statinis / įžambinė' },
          { kaire: '$\\mathrm{tg}\\,\\alpha$', desine: 'priešais esantis / prie kampo esantis statinis' },
          { kaire: 'įžambinė', desine: 'ilgiausia stačiojo trikampio kraštinė' },
        ],
        sprendimas: 'Įžambinė visada yra prieš statųjį kampą.',
      }),

    // 5. Įžambinė pirma
    () =>
      uzdavinys(T1, {
        klausimas: `Stačiojo trikampio statiniai ${greta} ir ${priesais}. Kokia yra įžambinė?`,
        atsakymas: String(izam),
        atsakymasRodymui: `$${izam}$`,
        sprendimas: `$\\sqrt{${greta * greta} + ${priesais * priesais}} = ${izam}$.`,
        brezinys: trigTrikampis(greta, priesais, { greta: String(greta), priesais: String(priesais), izambine: '?' }),
      }),

    // 6. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Sinusą mokinys apskaičiavo kaip prie kampo esančio statinio ir įžambinės santykį. Kokį santykį jis iš tikrųjų apskaičiavo?',
        variantai: ['kosinusą', 'tangentą', 'sinusą', 'nieko iš išvardytų'],
        teisingas: 0,
        sprendimas: 'Sinusui imamas priešais kampą esantis statinis.',
      }),

    // 7. Sinusas ir gretimo kampo kosinusas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kaip susiję $\\sin \\alpha$ ir $\\cos \\beta$, kai $\\alpha$ ir $\\beta$ — to paties stačiojo trikampio smailieji kampai?',
        variantai: [
          'jie lygūs, nes tas pats statinis vienam kampui yra priešais, o kitam — prie jo',
          'jie priešingi',
          'jų suma lygi 1',
          'jie nesusiję',
        ],
        teisingas: 0,
        sprendimas: '$\\alpha + \\beta = 90°$, tad $\\sin \\alpha = \\cos \\beta$.',
      }),
  ])
}

// ── 7.2. Trigonometrinių santykių reikšmės ──────────────────────────────────

const T2 = 'trigonometrines-reiksmes'

const A2 = [
  {
    klausimas: 'Kam lygu $\\sin 30°$? Užrašyk trupmenos vardiklį.',
    atsakymas: '2',
    atsakymasRodymui: '$\\dfrac{1}{2}$',
    sprendimas: 'Statinis prieš 30° kampą lygus pusei įžambinės.',
  },
] as const

export const trigonometrinesReiksmes: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  return variacija([
    // 1. sin 30°
    () =>
      uzdavinys(T2, {
        klausimas: 'Kam lygu $\\sin 30°$? Užrašyk trupmenos vardiklį.',
        atsakymas: '2',
        atsakymasRodymui: `$${tr(1, 2)}$`,
        sprendimas: 'Statinis prieš $30°$ kampą lygus pusei įžambinės.',
      }),

    // 2. cos 60°
    () =>
      uzdavinys(T2, {
        klausimas: 'Kam lygu $\\cos 60°$? Užrašyk trupmenos vardiklį.',
        atsakymas: '2',
        atsakymasRodymui: `$${tr(1, 2)}$`,
        sprendimas: '$\\cos 60° = \\sin 30° = \\dfrac{1}{2}$.',
      }),

    // 3. tg 45°
    () =>
      uzdavinys(T2, {
        klausimas: 'Kam lygu $\\mathrm{tg}\\,45°$?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Trikampyje su $45°$ kampais abu statiniai lygūs.',
      }),

    // 4. Palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuri reikšmė didesnė: $\\sin 30°$ ar $\\sin 60°$?',
        variantai: ['$\\sin 60°$', '$\\sin 30°$', 'jos lygios'],
        teisingas: 0,
        sprendimas: 'Didėjant smailiajam kampui sinusas didėja.',
      }),

    // 5. Kosinuso palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuri reikšmė didesnė: $\\cos 30°$ ar $\\cos 60°$?',
        variantai: ['$\\cos 30°$', '$\\cos 60°$', 'jos lygios'],
        teisingas: 0,
        sprendimas: 'Didėjant smailiajam kampui kosinusas mažėja.',
      }),

    // 6. Skaitinis reiškinys
    () =>
      uzdavinys(T2, {
        klausimas: 'Apskaičiuok $2\\sin 30° + \\cos 60°$. Užrašyk atsakymą dešimtaine trupmena.',
        atsakymas: '1.5',
        atsakymasRodymui: '$1{,}5$',
        sprendimas: '$2 \\cdot \\dfrac{1}{2} + \\dfrac{1}{2} = 1{,}5$.',
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Mokinys teigia, kad $\\sin 60° = \\dfrac{1}{2}$. Kodėl tai klaida?',
        variantai: [
          'nes $\\dfrac{1}{2}$ yra $\\sin 30°$, o $\\sin 60°$ didesnis',
          'nes $\\sin 60° = 1$',
          'nes sinusas negali būti trupmena',
          'iš tikrųjų tai tiesa',
        ],
        teisingas: 0,
        sprendimas: '$\\sin 60° = \\cos 30°$, o tai daugiau nei $0{,}8$.',
      }),
  ])
}

// ── 7.3. Skaičiuojame skaičiuotuvu ──────────────────────────────────────────

const T3 = 'skaiciuotuvas-trigonometrija'

const A3 = [
  {
    klausimas: 'Ar $\\sin 20°$ mažesnis už $\\sin 40°$?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: 'Didėjant smailiajam kampui sinusas didėja.',
  },
] as const

export const skaiciuotuvasTrigonometrija: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const a = atsitiktinis(15, 40)
  const b = a + atsitiktinis(10, 30)
  if (b > 85) return null

  return variacija([
    // 1. Sinuso palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kuri reikšmė didesnė: $\\sin ${a}°$ ar $\\sin ${b}°$?`,
        variantai: [`$\\sin ${b}°$`, `$\\sin ${a}°$`, 'jos lygios'],
        teisingas: 0,
        sprendimas: 'Smailiesiems kampams sinusas didėja kartu su kampu.',
      }),

    // 2. Kosinuso palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kuri reikšmė didesnė: $\\cos ${a}°$ ar $\\cos ${b}°$?`,
        variantai: [`$\\cos ${a}°$`, `$\\cos ${b}°$`, 'jos lygios'],
        teisingas: 0,
        sprendimas: 'Smailiesiems kampams kosinusas mažėja didėjant kampui.',
      }),

    // 3. Radianų režimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Skaičiuotuvu ieškant $\\sin 30°$ gauta neįprasta reikšmė. Ką reikia pakeisti?',
        variantai: [
          'perjungti skaičiuotuvą iš radianų į laipsnių režimą',
          'pakeisti kampą',
          'naudoti kosinusą',
          'padalyti rezultatą iš 2',
        ],
        teisingas: 0,
        sprendimas: 'Režimas DEG reiškia laipsnius, RAD — radianus.',
      }),

    // 4. Atvirkštinė funkcija
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip skaičiuotuvu rasti kampą, kai žinoma, kad $\\sin \\alpha = 0{,}6$?',
        variantai: [
          'naudoti atvirkštinę funkciją $\\arcsin$ (mygtukas $\\sin^{-1}$)',
          'padalyti $0{,}6$ iš $90$',
          'padauginti $0{,}6$ iš $180$',
          'to rasti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Atvirkštinė funkcija iš santykio grąžina kampą.',
      }),

    // 5. sin ir cos ryšys
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Ką pastebi palyginęs $\\sin ${a}°$ ir $\\cos ${90 - a}°$?`,
        variantai: [
          'jos lygios',
          'sinusas visada didesnis',
          'kosinusas visada didesnis',
          'jos nesusijusios',
        ],
        teisingas: 0,
        sprendimas: `$\\sin \\alpha = \\cos(90° - \\alpha)$.`,
      }),

    // 6. Kada reikia atvirkštinės funkcijos
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kada sprendžiant statųjį trikampį prireikia atvirkštinės trigonometrinės funkcijos?',
        variantai: [
          'kai žinomos kraštinės ir reikia rasti kampą',
          'kai žinomas kampas ir reikia rasti kraštinę',
          'kai žinomi abu smailieji kampai',
          'jos niekada nereikia',
        ],
        teisingas: 0,
        sprendimas: 'Iš santykio kampas randamas tik atvirkštine funkcija.',
      }),

    // 7. Apvalinimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kodėl skaičiuotuvu gautas $\\sin 37° \\approx 0{,}60$ užrašomas su apytikslio lygumo ženklu?',
        variantai: [
          'nes tiksli reikšmė yra begalinė neperiodinė dešimtainė trupmena',
          'nes skaičiuotuvas klysta',
          'nes sinusas visada apytikslis',
          'nes taip patogiau',
        ],
        teisingas: 0,
        sprendimas: 'Suapvalinus reikšmė nebėra tiksli.',
      }),
  ])
}

// ── 7.4. Trigonometrinės formulės ───────────────────────────────────────────

const T4 = 'trigonometrines-formules'

const A4 = [
  {
    klausimas: 'Jei $\\sin \\alpha = \\dfrac{3}{5}$ ir $\\alpha$ smailus, kam lygus $\\cos \\alpha$? Užrašyk trupmenos skaitiklį.',
    atsakymas: '4',
    atsakymasRodymui: '$\\dfrac{4}{5}$',
    sprendimas: '$\\cos^2 \\alpha = 1 - \\dfrac{9}{25} = \\dfrac{16}{25}$.',
  },
] as const

export const trigonometrinesFormules: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  const [greta, priesais, izam] = trejetas()

  return variacija([
    // 1. Kosinusas iš sinuso
    () =>
      uzdavinys(T4, {
        klausimas: `Jei $\\sin \\alpha = ${tr(priesais, izam)}$ ir $\\alpha$ smailus, kam lygus $\\cos \\alpha$? Užrašyk trupmenos skaitiklį.`,
        atsakymas: String(greta),
        atsakymasRodymui: `$\\cos \\alpha = ${tr(greta, izam)}$`,
        sprendimas: `$\\cos^2 \\alpha = 1 - ${tr(priesais * priesais, izam * izam)} = ${tr(greta * greta, izam * izam)}$.`,
      }),

    // 2. Sinusas iš kosinuso
    () =>
      uzdavinys(T4, {
        klausimas: `Jei $\\cos \\alpha = ${tr(greta, izam)}$ ir $\\alpha$ smailus, kam lygus $\\sin \\alpha$? Užrašyk trupmenos skaitiklį.`,
        atsakymas: String(priesais),
        atsakymasRodymui: `$\\sin \\alpha = ${tr(priesais, izam)}$`,
        sprendimas: `$\\sin^2 \\alpha = 1 - ${tr(greta * greta, izam * izam)} = ${tr(priesais * priesais, izam * izam)}$.`,
      }),

    // 3. Tangentas iš sinuso ir kosinuso
    () =>
      uzdavinys(T4, {
        klausimas: `Jei $\\sin \\alpha = ${tr(priesais, izam)}$ ir $\\cos \\alpha = ${tr(greta, izam)}$, kam lygus $\\mathrm{tg}\\,\\alpha$? Užrašyk trupmenos skaitiklį.`,
        atsakymas: String(priesais),
        atsakymasRodymui: `$\\mathrm{tg}\\,\\alpha = ${tr(priesais, greta)}$`,
        sprendimas: `$\\mathrm{tg}\\,\\alpha = \\dfrac{\\sin \\alpha}{\\cos \\alpha}$; įžambinės sutrumpėja.`,
      }),

    // 4. Pagrindinė tapatybė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ką teigia pagrindinė trigonometrinė tapatybė?',
        variantai: [
          '$\\sin^2 \\alpha + \\cos^2 \\alpha = 1$',
          '$\\sin \\alpha + \\cos \\alpha = 1$',
          '$\\sin^2 \\alpha - \\cos^2 \\alpha = 1$',
          '$\\sin \\alpha \\cdot \\cos \\alpha = 1$',
        ],
        teisingas: 0,
        sprendimas: 'Ji išplaukia iš Pitagoro teoremos stačiajame trikampyje.',
      }),

    // 5. Kraštinės iš tangento
    () =>
      uzdavinys(T4, {
        klausimas: `Jei $\\mathrm{tg}\\,\\alpha = ${tr(priesais, greta)}$ ir $\\alpha$ smailus, kokia bus stačiojo trikampio įžambinė, kai statiniai lygūs ${priesais} ir ${greta}?`,
        atsakymas: String(izam),
        atsakymasRodymui: `$${izam}$`,
        sprendimas: `$\\sqrt{${priesais * priesais} + ${greta * greta}} = ${izam}$.`,
        brezinys: trigTrikampis(greta, priesais, { greta: String(greta), priesais: String(priesais), izambine: '?' }),
      }),

    // 6. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: 'Iš $\\sin \\alpha = \\dfrac{5}{13}$ mokinys gavo $\\cos \\alpha = \\dfrac{8}{13}$. Koks turi būti kosinuso skaitiklis?',
        atsakymas: '12',
        atsakymasRodymui: '$\\dfrac{12}{13}$',
        sprendimas: 'Atimami ne skaitikliai, o jų kvadratai: $169 - 25 = 144$.',
      }),

    // 7. Tapatybės patikra
    () =>
      uzdavinys(T4, {
        klausimas: `Kam lygu $\\sin^2 \\alpha + \\cos^2 \\alpha$, kai $\\sin \\alpha = ${tr(priesais, izam)}$?`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: `$${tr(priesais * priesais, izam * izam)} + ${tr(greta * greta, izam * izam)} = 1$.`,
      }),
  ])
}

// ── 7.5. Stačiųjų trikampių sprendimas ──────────────────────────────────────

const T5 = 'staciuju-trikampiu-sprendimas'

const A5 = [
  {
    klausimas: 'Stačiojo trikampio vienas smailusis kampas 35°. Koks kitas smailusis kampas?',
    atsakymas: '55',
    atsakymasRodymui: '$55°$',
    sprendimas: '$90° - 35° = 55°$.',
  },
] as const

export const staciujuTrikampiuSprendimas: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const [greta, priesais, izam] = trejetas()
  const kampas = atsitiktinis(20, 70)

  return variacija([
    // 1. Kitas smailusis kampas
    () =>
      uzdavinys(T5, {
        klausimas: `Stačiojo trikampio $ABC$ statusis kampas prie viršūnės $C$, o vienas smailusis kampas lygus $${kampas}°$. Koks yra kitas smailusis kampas?`,
        atsakymas: String(90 - kampas),
        atsakymasRodymui: `$${90 - kampas}°$`,
        sprendimas: `$90° - ${kampas}° = ${90 - kampas}°$.`,
      }),

    // 2. Kurį santykį rinktis
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Žinomas smailusis kampas ir prie jo esantis statinis, o ieškoma įžambinės. Kurį santykį patogiausia rinktis?',
        variantai: ['kosinusą', 'sinusą', 'tangentą', 'bet kurį'],
        teisingas: 0,
        sprendimas: 'Kosinusas sieja būtent prie kampo esantį statinį ir įžambinę.',
      }),

    // 3. Kopėčios prie sienos
    () => {
      const ilgis = pasirink([4, 6, 8, 10])
      return uzdavinys(T5, {
        klausimas: `Kopėčios, kurių ilgis ${ilgis} m, su žeme sudaro $60°$ kampą. Kokiu atstumu nuo sienos yra jų apačia?`,
        atsakymas: String(ilgis / 2),
        atsakymasRodymui: `$${ilgis / 2}$ m`,
        sprendimas: `$\\cos 60° = \\dfrac{1}{2}$, tad atstumas $${ilgis} \\cdot \\dfrac{1}{2} = ${ilgis / 2}$ m.`,
      })
    },

    // 4. Statinis prieš 30°
    () => {
      const izambine = pasirink([6, 8, 10, 12, 14])
      return uzdavinys(T5, {
        klausimas: `Stačiojo trikampio įžambinė ${izambine} cm, o vienas smailusis kampas $30°$. Koks yra statinis, esantis prieš šį kampą?`,
        atsakymas: String(izambine / 2),
        atsakymasRodymui: `$${izambine / 2}$ cm`,
        sprendimas: `$\\sin 30° = \\dfrac{1}{2}$, tad statinis lygus pusei įžambinės.`,
      })
    },

    // 5. Trečioji kraštinė
    () =>
      uzdavinys(T5, {
        klausimas: `Stačiojo trikampio, kurio statusis kampas prie viršūnės $C$, statiniai ${greta} cm ir ${priesais} cm. Kokia yra įžambinė?`,
        atsakymas: String(izam),
        atsakymasRodymui: `$${izam}$ cm`,
        sprendimas: `$\\sqrt{${greta * greta} + ${priesais * priesais}} = ${izam}$.`,
        brezinys: trigTrikampis(greta, priesais, { greta: `${greta} cm`, priesais: `${priesais} cm`, izambine: '?' }),
      }),

    // 6. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kopėčių uždavinyje žinomas prie kampo esantis statinys, o ieškoma įžambinės, bet mokinys pasirinko sinusą. Kodėl patogiau kosinusas?',
        variantai: [
          'nes sinusas sieja įžambinę su priešais esančiu statiniu, o čia žinomas gretimasis',
          'nes sinusas visada netinka',
          'nes kosinusas didesnis',
          'iš tikrųjų sinusas patogesnis',
        ],
        teisingas: 0,
        sprendimas: 'Santykis renkamas pagal tai, kurios kraštinės žinomos.',
      }),

    // 7. Kampas iš kraštinių
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Stačiojo trikampio statiniai ${greta} ir ${priesais}. Kaip rasti smailųjį kampą $\\alpha$, esantį prieš statinį ${priesais}?`,
        variantai: [
          `apskaičiuoti $\\mathrm{tg}\\,\\alpha = ${tr(priesais, greta)}$ ir taikyti atvirkštinę funkciją`,
          `apskaičiuoti $\\sin \\alpha = ${tr(priesais, greta)}$`,
          'atimti statinius',
          'to rasti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Žinomi abu statiniai, tad patogiausias tangentas.',
      }),
  ])
}
