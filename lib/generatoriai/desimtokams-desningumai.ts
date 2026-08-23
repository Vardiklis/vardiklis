import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { sekosNariai } from './devintokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 10 klasės tema „Dėsningumai, santykiai ir procentai“ — septynios potemės.
 *
 * Sudėtinių procentų, džiovinimo ir tirpalų uždaviniuose skaičiai parenkami
 * taip, kad atsakymas būtų sveikas arba turėtų ne daugiau kaip du skaitmenis
 * po kablelio. Aukso pjūvio potemėje visur aiškiai skiriama tiksli reikšmė
 * $\\Phi = \\dfrac{1 + \\sqrt{5}}{2}$ nuo apytikslės $1{,}62$.
 */

/** Trupmena KaTeX pavidalu. */
function tr(virsus: string, apacia: string): string {
  return `\\dfrac{${virsus}}{${apacia}}`
}

/** Dešimtainis skaičius lietuviškai — su kableliu. */
function kablelis(n: number): string {
  return String(n).replace('.', ',')
}

/** Tas pats skaičius KaTeX pavidalu, kur kablelis rašomas `{,}`. */
function kablelisTeX(n: number): string {
  return String(n).replace('.', '{,}')
}

/** Suapvalintas skaičius su kableliu. */
function apvalus(n: number, skaitmenys = 2): string {
  return Number(n.toFixed(skaitmenys)).toString().replace('.', ',')
}

const FI = (1 + Math.sqrt(5)) / 2

// ── 5.1. Probleminės situacijos ir trūkstama informacija ────────────────────

const T1 = 'trukstama-informacija'

const A1 = [
  {
    klausimas: 'Parduotuvėje prekė atpigo $20$ %, bet pradinė kaina nenurodyta. Kiek eurų ji atpigo, jei pradinė kaina buvo $45$ Eur?',
    atsakymas: '9',
    atsakymasRodymui: '$9$ Eur',
    sprendimas: '$45 \\cdot 0{,}2 = 9$; be pradinės kainos atsakymo rasti neįmanoma.',
  },
] as const

export const trukstamaInformacija: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  return variacija([
    // 1. Trūksta pradinės kainos
    () => {
      const kaina = pasirink([35, 45, 60, 80])
      const proc = pasirink([10, 20, 25])
      const atpigo = (kaina * proc) / 100
      if (!Number.isInteger(atpigo * 10)) return null
      return uzdavinys(T1, {
        klausimas: `Prekė atpigo $${proc}$ %, tačiau pradinė kaina nenurodyta — būtent jos ir trūksta. Kiek eurų prekė atpigo, jei pradinė kaina buvo $${kaina}$ Eur?`,
        atsakymas: String(atpigo),
        atsakymasRodymui: `$${kablelis(atpigo)}$ Eur`,
        sprendimas: `$${kaina} \\cdot ${tr(String(proc), '100')} = ${kablelisTeX(atpigo)}$. Procentai patys savaime eurų nepasako — reikia dydžio, nuo kurio jie skaičiuojami.`,
      })
    },

    // 2. Ar pakanka laiko keliui rasti
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Žinoma, kad kelionė truko $3$ valandas. Ar to pakanka nuvažiuotam keliui apskaičiuoti?',
        variantai: [
          'Ne — dar reikia greičio, nes $s = vt$',
          'Taip — kelias lygus laikui',
          'Taip — kelias visada $3$ km',
          'Ne — reikia žinoti kelionės kryptį',
        ],
        teisingas: 0,
        sprendimas: 'Kelias randamas dauginant greitį iš laiko, tad be greičio jis nenustatomas.',
      }),

    // 3. Plotas ir perimetras
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Stačiakampio plotas $48$ cm². Ar galima vienareikšmiškai rasti jo perimetrą?',
        variantai: [
          'Ne — tinka daug kraštinių porų, pavyzdžiui $6$ ir $8$ arba $4$ ir $12$, o jų perimetrai skirtingi',
          'Taip — perimetras visada $28$ cm',
          'Taip — perimetras lygus dvigubam plotui',
          'Ne, nes plotas nurodytas kvadratiniais centimetrais',
        ],
        teisingas: 0,
        sprendimas: 'Perimetrai būtų $28$ cm ir $32$ cm — vienos sąlygos nepakanka.',
      }),

    // 4. Papildoma sąlyga
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kokia papildoma sąlyga uždaviniui „Dviejų skaičių suma lygi $20$“ leistų skaičius nustatyti vienareikšmiškai?',
        variantai: [
          'Skaičių skirtumas lygus $4$',
          'Abu skaičiai yra sveikieji',
          'Abu skaičiai teigiami',
          'Vienas skaičius mažesnis už kitą',
        ],
        teisingas: 0,
        sprendimas: 'Antroji tiesinė sąlyga uždaro sistemą: iš $x + y = 20$ ir $x - y = 4$ gaunama $x = 12$, $y = 8$.',
      }),

    // 5. Kurie duomenys reikalingi
    () => {
      const mase = pasirink([5, 8, 12])
      const proc = pasirink([25, 30, 40])
      const gryna = (mase * proc) / 100
      if (!Number.isInteger(gryna * 10)) return null
      return uzdavinys(T1, {
        klausimas: `Duota: $${mase}$ kg, $${proc}$ %, $12$ Eur/kg ir $2$ val. Iš šių duomenų atrink tik tuos, kurių reikia grynos medžiagos masei rasti, ir ją apskaičiuok (kg).`,
        atsakymas: String(gryna),
        atsakymasRodymui: `$${kablelis(gryna)}$ kg`,
        sprendimas: `Reikia tik masės ir koncentracijos: $${mase} \\cdot ${tr(String(proc), '100')} = ${kablelisTeX(gryna)}$. Kaina ir laikas — pertekliniai duomenys.`,
      })
    },

    // 6. Kuro kainos uždavinys
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Uždaviniui „Automobilis nuvažiavo $180$ km. Kiek kainavo kuras?“ trūksta duomenų. Kurių būtent?',
        variantai: [
          'Kuro sąnaudų $100$ km ir kuro kainos už litrą',
          'Kelionės laiko ir vairuotojo amžiaus',
          'Automobilio spalvos ir kelio dangos',
          'Tik kuro kainos už litrą',
        ],
        teisingas: 0,
        sprendimas: 'Kuro kiekis randamas iš sąnaudų ir nuvažiuoto kelio, o kaina — iš kiekio ir kainos už litrą.',
      }),

    // 7. Du skirtingi papildymai
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Nepilną sąlygą „Stačiakampio viena kraštinė $6$ cm“ galima papildyti skirtingai. Susiek papildymą su tuo, ką tada galima rasti.',
        poros: [
          { kaire: 'Antroji kraštinė $4$ cm', desine: 'plotą $24$ cm² ir perimetrą $20$ cm' },
          { kaire: 'Perimetras $20$ cm', desine: 'antrąją kraštinę $4$ cm' },
          { kaire: 'Plotas $30$ cm²', desine: 'antrąją kraštinę $5$ cm' },
        ],
        sprendimas: 'Kiekvienas papildymas uždaro uždavinį kitu keliu, bet visi trys daro atsakymą vienareikšmį.',
      }),

    // 8. Ar visada vienas atsakymas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Mokinys teigia, kad kiekviename uždavinyje turi būti tik vienas teisingas atsakymas. Kuris pavyzdys jam prieštarauja?',
        variantai: [
          '„Rask skaičių, kurio kvadratas lygus $25$“ — tinka ir $5$, ir $-5$',
          '„Rask $2 + 3$“',
          '„Rask stačiakampio, kurio kraštinės $3$ ir $4$, plotą“',
          '„Rask $20$ % nuo $50$“',
        ],
        teisingas: 0,
        sprendimas: 'Kai sąlyga netiesiogiai leidžia kelias reikšmes, teisingų atsakymų būna daugiau nei vienas.',
      }),

    // 9. Perteklinė ir trūkstama informacija
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas:
          'Uždavinys: „Pirkta $3$ kg obuolių po $2$ Eur/kg ir $2$ kg kriaušių. Parduotuvė dirba nuo $8$ val. Kiek sumokėta iš viso?“ Ko šiame uždavinyje per daug ir ko trūksta?',
        variantai: [
          'Per daug — darbo laiko; trūksta — kriaušių kainos',
          'Per daug — obuolių kainos; trūksta — darbo laiko',
          'Nieko netrūksta',
          'Trūksta bendros pirkinių masės',
        ],
        teisingas: 0,
        sprendimas: 'Darbo laikas sumai neturi įtakos, o be kriaušių kainos jų dalies apskaičiuoti neįmanoma.',
      }),

    // 10. Klausimų formulavimas
    () => {
      const lydinys = 12
      const varis = 3
      return uzdavinys(T1, {
        klausimas: `Duota: lydinio masė $${lydinys}$ kg, vario kiekis $${varis}$ kg, kaina $80$ Eur, temperatūra $20$ °C. Suformuluok klausimą apie vario dalį ir atsakyk: kiek procentų lydinio sudaro varis?`,
        atsakymas: String((varis / lydinys) * 100),
        atsakymasRodymui: `$${(varis / lydinys) * 100}$ %`,
        sprendimas: `$${tr(String(varis), String(lydinys))} = ${(varis / lydinys) * 100}\\ \\%$. Kainos ir temperatūros šiam klausimui nereikia — jos tiktų kitiems klausimams.`,
      })
    },
  ])
}

// ── 5.2. Proporcingoji dalyba į dvi nelygias dalis ──────────────────────────

const T2 = 'proporcinga-dalyba'

const A2 = [
  {
    klausimas: 'Padalyk $60$ santykiu $2 : 3$ ir užrašyk didesniąją dalį.',
    atsakymas: '36',
    atsakymasRodymui: '$36$ (dalys $24$ ir $36$)',
    sprendimas: 'Iš viso $5$ dalys; viena dalis $12$, tad $2 \\cdot 12 = 24$ ir $3 \\cdot 12 = 36$.',
  },
] as const

export const proporcingaDalyba: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  const m = pasirink([2, 3, 4, 5, 7])
  const n = pasirink([3, 4, 5, 7, 8])

  return variacija([
    // 1. Skaičiaus dalyba
    () => {
      if (m >= n) return null
      const dalis = pasirink([6, 9, 12, 15])
      const visas = (m + n) * dalis
      return uzdavinys(T2, {
        klausimas: `Padalyk $${visas}$ santykiu $${m} : ${n}$ ir užrašyk didesniąją dalį.`,
        atsakymas: String(n * dalis),
        atsakymasRodymui: `$${n * dalis}$ (dalys $${m * dalis}$ ir $${n * dalis}$)`,
        sprendimas: `Iš viso $${m + n}$ dalys; viena dalis lygi $${tr(String(visas), String(m + n))} = ${dalis}$, tad dalys yra $${m * dalis}$ ir $${n * dalis}$.`,
      })
    },

    // 2. Pinigų dalyba
    () => {
      if (m >= n) return null
      const dalis = pasirink([8, 12, 20])
      const visas = (m + n) * dalis
      return uzdavinys(T2, {
        klausimas: `Padalyk $${visas}$ Eur santykiu $${m} : ${n}$ ir užrašyk mažesniąją dalį (Eur).`,
        atsakymas: String(m * dalis),
        atsakymasRodymui: `$${m * dalis}$ Eur`,
        sprendimas: `Viena dalis lygi $${tr(String(visas), String(m + n))} = ${dalis}$ Eur, tad mažesnioji dalis yra $${m} \\cdot ${dalis} = ${m * dalis}$ Eur.`,
      })
    },

    // 3. Virvės dalijimas
    () => {
      const dalis = pasirink([5, 6, 9])
      const visas = 9 * dalis
      return uzdavinys(T2, {
        klausimas: `Virvė, kurios ilgis $${visas}$ m, padalyta santykiu $2 : 7$. Rask ilgesniosios dalies ilgį (m).`,
        atsakymas: String(7 * dalis),
        atsakymasRodymui: `$${7 * dalis}$ m`,
        sprendimas: `Dalių iš viso $9$; viena dalis $${dalis}$ m, tad dalys yra $${2 * dalis}$ m ir $${7 * dalis}$ m.`,
      })
    },

    // 4. Taškų paskirstymas
    () => {
      const dalis = pasirink([8, 12, 16])
      const visas = 8 * dalis
      return uzdavinys(T2, {
        klausimas: `Dviem komandoms $${visas}$ taškai paskirstomi santykiu $5 : 3$. Kiek taškų gauna pirmoji komanda?`,
        atsakymas: String(5 * dalis),
        atsakymasRodymui: `$${5 * dalis}$ taškų`,
        sprendimas: `Viena dalis lygi $${tr(String(visas), '8')} = ${dalis}$, tad komandos gauna $${5 * dalis}$ ir $${3 * dalis}$ taškų.`,
      })
    },

    // 5. Kodėl skaičiuojamos dalys
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kodėl dalijant santykiu $2 : 5$ pirmiausia patogu suskaičiuoti $7$ dalis?',
        variantai: [
          'Nes visas dydis susideda iš $2 + 5 = 7$ vienodų dalių, ir vienos dalies dydis atrakina abi dalis',
          'Nes $7$ yra pirminis skaičius',
          'Nes santykis visada didinamas iki $10$ dalių',
          'Nes taip išvengiama trupmenų',
        ],
        teisingas: 0,
        sprendimas: 'Radus vieną dalį, kiekviena dalis gaunama dauginant ją iš atitinkamo santykio nario.',
      }),

    // 6. Premijos dalyba su skirtumu
    () => {
      const dalis = pasirink([150, 200, 250])
      const visas = 12 * dalis
      return uzdavinys(T2, {
        klausimas: `$${visas}$ Eur premiją reikia padalyti dviem darbuotojams santykiu $7 : 5$. Koks yra jų sumų skirtumas (Eur)?`,
        atsakymas: String(2 * dalis),
        atsakymasRodymui: `$${2 * dalis}$ Eur`,
        sprendimas: `Viena dalis $${dalis}$ Eur; sumos yra $${7 * dalis}$ Eur ir $${5 * dalis}$ Eur, tad skirtumas $${2 * dalis}$ Eur.`,
      })
    },

    // 7. Dalis žinoma per skirtumą
    () => {
      const dalis = pasirink([9, 11, 13])
      const skirtumas = 5 * dalis
      return uzdavinys(T2, {
        klausimas: `Kelias padalytas santykiu $3 : 8$, o ilgesnioji dalis $${skirtumas}$ km ilgesnė už trumpesniąją. Koks yra viso kelio ilgis (km)?`,
        atsakymas: String(11 * dalis),
        atsakymasRodymui: `$${11 * dalis}$ km`,
        sprendimas: `Skirtumas sudaro $8 - 3 = 5$ dalis, tad viena dalis lygi $${tr(String(skirtumas), '5')} = ${dalis}$ km; visas kelias — $11$ dalių, t. y. $${11 * dalis}$ km.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Dalydamas $90$ santykiu $2 : 3$, mokinys apskaičiavo $90 \\cdot \\dfrac{2}{3}$ ir $90 \\cdot \\dfrac{3}{2}$. Kur klaida?',
        variantai: [
          'Vardiklyje turi būti dalių suma $5$, tad $90 \\cdot \\dfrac{2}{5} = 36$ ir $90 \\cdot \\dfrac{3}{5} = 54$',
          'Reikėjo dalyti iš $2$ ir iš $3$',
          'Klaidos nėra',
          'Reikėjo abu dauginti iš $\\dfrac{1}{5}$',
        ],
        teisingas: 0,
        sprendimas: 'Jo dalys būtų $60$ ir $135$, o jų suma $195$ — daugiau už patį dalijamą skaičių.',
      }),

    // 9. Dalys pagal sumą
    () => {
      const dalis = pasirink([6, 12, 15])
      const visas = 11 * dalis
      return uzdavinys(T2, {
        klausimas: `Dvi dalys yra santykiu $4 : 7$, o jų suma lygi $${visas}$. Rask didesniąją dalį.`,
        atsakymas: String(7 * dalis),
        atsakymasRodymui: `$${7 * dalis}$`,
        sprendimas: `Viena dalis $${dalis}$; dalys yra $${4 * dalis}$ ir $${7 * dalis}$. Patikra: $${tr(String(4 * dalis), String(7 * dalis))} = ${tr('4', '7')}$.`,
      })
    },

    // 10. Uždavinio kūrimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuris dydis dalijasi santykiu $5 : 8$ be liekanos, kad abi dalys būtų sveikieji skaičiai?',
        variantai: ['$260$', '$100$', '$120$', '$150$'],
        teisingas: 0,
        sprendimas: 'Dalių iš viso $13$, tad dalijamas dydis turi dalytis iš $13$: $260 : 13 = 20$, dalys $100$ ir $160$.',
      }),
  ])
}

// ── 5.3. Fibonačio skaičių seka ─────────────────────────────────────────────

const T3 = 'fibonacio-seka'

/** Fibonačio seka nuo $F_1 = 1$. */
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987] as const

const A3 = [
  {
    klausimas: 'Pratęsk Fibonačio seką: $1$, $1$, $2$, $3$, $5$, $8$, ... Koks yra kitas narys?',
    atsakymas: '13',
    atsakymasRodymui: '$13$',
    sprendimas: 'Kiekvienas narys lygus dviejų prieš jį einančių sumai: $5 + 8 = 13$.',
  },
] as const

export const fibonacioSeka: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const nr = atsitiktinis(3, 9)

  return variacija([
    // 1. Sekos pratęsimas
    () =>
      uzdavinys(T3, {
        klausimas: 'Brėžinyje pateikta Fibonačio sekos pradžia. Koks yra kitas narys?',
        atsakymas: String(FIB[6]),
        atsakymasRodymui: `$${FIB[6]}$`,
        sprendimas: `Kiekvienas narys lygus dviejų prieš jį einančių sumai: $${FIB[4]} + ${FIB[5]} = ${FIB[6]}$.`,
        brezinys: sekosNariai([FIB[0], FIB[1], FIB[2], FIB[3], FIB[4], FIB[5], null]),
      }),

    // 2. Sudarymo taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kokia yra Fibonačio sekos sudarymo taisyklė?',
        variantai: [
          '$F_n = F_{n-1} + F_{n-2}$, kai $F_1 = F_2 = 1$',
          '$F_n = 2F_{n-1}$',
          '$F_n = F_{n-1} + 1$',
          '$F_n = n^2 - 1$',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienas narys, pradedant trečiuoju, yra dviejų prieš jį einančių narių suma.',
      }),

    // 3. Kitas narys po dviejų duotų
    () => {
      if (nr < 2 || nr > 12) return null
      return uzdavinys(T3, {
        klausimas: `Fibonačio sekoje po narių $${FIB[nr - 1]}$ ir $${FIB[nr]}$ eina dar vienas. Koks jis?`,
        atsakymas: String(FIB[nr + 1]),
        atsakymasRodymui: `$${FIB[nr + 1]}$`,
        sprendimas: `$${FIB[nr - 1]} + ${FIB[nr]} = ${FIB[nr + 1]}$.`,
        brezinys: sekosNariai([FIB[nr - 1], FIB[nr], null], '+'),
      })
    },

    // 4. Nario vieta sekoje
    () => {
      const vieta = atsitiktinis(5, 10)
      return uzdavinys(T3, {
        klausimas: `Kelintoje vietoje Fibonačio sekoje $1$, $1$, $2$, $3$, $5$, $8$, $13$, $21$, $34$, $55$ yra skaičius $${FIB[vieta - 1]}$?`,
        atsakymas: String(vieta),
        atsakymasRodymui: `$${vieta}$-oje vietoje`,
        sprendimas: `Skaičiuojant nuo pirmojo nario $F_1 = 1$, skaičius $${FIB[vieta - 1]}$ yra $F_{${vieta}}$.`,
      })
    },

    // 5. Ar skaičius yra sekos narys
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ar $55$ yra Fibonačio sekos narys?',
        variantai: [
          'Taip, nes $21 + 34 = 55$',
          'Ne, nes $55$ dalijasi iš $5$',
          'Ne, nes seka baigiasi ties $34$',
          'Taip, nes $55$ yra nelyginis',
        ],
        teisingas: 0,
        sprendimas: 'Pakanka patikrinti, ar skaičius gaunamas sudėjus du prieš jį einančius sekos narius.',
      }),

    // 6. Konkretus narys pagal rekurenciją
    () => {
      const n = atsitiktinis(8, 12)
      return uzdavinys(T3, {
        klausimas: `Jei $F_1 = 1$, $F_2 = 1$ ir $F_n = F_{n-1} + F_{n-2}$, apskaičiuok $F_{${n}}$.`,
        atsakymas: String(FIB[n - 1]),
        atsakymasRodymui: `$F_{${n}} = ${FIB[n - 1]}$`,
        sprendimas: `Skaičiuojant paeiliui: $${FIB.slice(0, n).join('$, $')}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: 'Po narių $13$ ir $21$ mokinys parašė $35$. Koks turi būti tas narys?',
        atsakymas: '34',
        atsakymasRodymui: '$34$',
        sprendimas: '$13 + 21 = 34$; toliau seka $55$, $89$ ir $144$.',
        brezinys: sekosNariai([13, 21, null, null, null], '+'),
      }),

    // 8. Gretimų narių santykiai
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Apskaičiavus santykius $\\dfrac{13}{8}$, $\\dfrac{21}{13}$ ir $\\dfrac{34}{21}$, ką galima pastebėti?',
        variantai: [
          'Jie svyruoja apie $1{,}618$ ir vis mažiau nuo jo nutolsta',
          'Jie nuolat didėja be ribos',
          'Jie visi lygūs $1{,}5$',
          'Jie mažėja link nulio',
        ],
        teisingas: 0,
        sprendimas: '$\\dfrac{13}{8} = 1{,}625$, $\\dfrac{21}{13} \\approx 1{,}615$, $\\dfrac{34}{21} \\approx 1{,}619$ — artėjama prie aukso pjūvio skaičiaus.',
      }),

    // 9. Algoritmo žingsniai
    () =>
      eiliskumoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Sudėliok rekursinio algoritmo, generuojančio pirmuosius Fibonačio sekos narius, žingsnius teisinga tvarka.',
        teisingaEile: [
          'Užrašyti pradinius narius $F_1 = 1$ ir $F_2 = 1$',
          'Kitą narį rasti kaip dviejų paskutinių sumą',
          'Naująjį narį įrašyti į sekos pabaigą',
          'Kartoti, kol narių bus tiek, kiek reikia',
        ],
        sprendimas: 'Rekursija remiasi pradinėmis reikšmėmis, taisykle ir sustojimo sąlyga.',
      }),

    // 10. Narių skaičius iki ribos
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek Fibonačio sekos narių yra mažesni už $100$, jei vienetas skaičiuojamas tik vieną kartą?',
        atsakymas: '10',
        atsakymasRodymui: '$10$',
        sprendimas: 'Tai $1$, $2$, $3$, $5$, $8$, $13$, $21$, $34$, $55$ ir $89$ — iš viso dešimt.',
      }),
  ])
}

// ── 5.4. Aukso pjūvio skaičius ir aukso pjūvio seka ─────────────────────────

const T4 = 'aukso-pjuvis'

const A4 = [
  {
    klausimas: 'Apskaičiuok $\\Phi = \\dfrac{1 + \\sqrt{5}}{2}$ apytikslę reikšmę iki šimtųjų.',
    atsakymas: '1,62',
    atsakymasRodymui: '$\\Phi \\approx 1{,}62$',
    sprendimas: '$\\sqrt{5} \\approx 2{,}236$, tad $\\Phi \\approx \\dfrac{3{,}236}{2} \\approx 1{,}62$.',
  },
] as const

export const auksoPjuvis: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  return variacija([
    // 1. Apytikslė Φ reikšmė
    () =>
      uzdavinys(T4, {
        klausimas: 'Apskaičiuok $\\Phi = \\dfrac{1 + \\sqrt{5}}{2}$ apytikslę reikšmę iki šimtųjų.',
        atsakymas: '1,62',
        atsakymasRodymui: '$\\Phi \\approx 1{,}62$',
        sprendimas: '$\\sqrt{5} \\approx 2{,}236$, tad $\\Phi \\approx \\dfrac{3{,}236}{2} = 1{,}618 \\approx 1{,}62$.',
      }),

    // 2. Kuris arčiau Φ
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuris skaičius arčiau $\\Phi$: $1{,}60$ ar $1{,}65$?',
        variantai: [
          '$1{,}60$, nes skirtumas $0{,}018$ mažesnis už $0{,}032$',
          '$1{,}65$, nes jis didesnis',
          'Abu vienodai nutolę',
          'Palyginti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: '$\\Phi \\approx 1{,}618$; $|1{,}618 - 1{,}60| = 0{,}018$, o $|1{,}65 - 1{,}618| = 0{,}032$.',
      }),

    // 3. Aukso pjūvio sekos pratęsimas
    () =>
      uzdavinys(T4, {
        klausimas: 'Pratęsk seką $0{,}056$; $0{,}090$; $0{,}146$; $0{,}236$; ... Koks yra kitas narys?',
        atsakymas: '0,382',
        atsakymasRodymui: '$0{,}382$',
        sprendimas: 'Kiekvienas narys lygus dviejų prieš jį einančių sumai: $0{,}146 + 0{,}236 = 0{,}382$.',
      }),

    // 4. Ką reiškia padalyti aukso pjūviu
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ką reiškia padalyti atkarpą aukso pjūviu?',
        variantai: [
          'Padalyti taip, kad visos atkarpos ir ilgesniosios dalies santykis būtų toks pat kaip ilgesniosios ir trumpesniosios',
          'Padalyti į dvi lygias dalis',
          'Padalyti santykiu $1 : 2$',
          'Padalyti taip, kad dalių skirtumas būtų $1{,}618$',
        ],
        teisingas: 0,
        sprendimas: 'Tas bendras santykis ir yra $\\Phi \\approx 1{,}618$.',
      }),

    // 5. Ilgesnioji dalis iš trumpesniosios
    () => {
      const trumpa = pasirink([8, 10, 12, 20])
      const ilga = trumpa * FI
      return uzdavinys(T4, {
        klausimas: `Ilgesniosios ir trumpesniosios atkarpos santykis apytiksliai $1{,}618$. Rask ilgesniąją dalį (cm), kai trumpesnioji yra $${trumpa}$ cm. Suapvalink iki šimtųjų.`,
        atsakymas: apvalus(ilga),
        atsakymasRodymui: `$\\approx ${apvalus(ilga)}$ cm`,
        sprendimas: `$${trumpa} \\cdot 1{,}618 \\approx ${apvalus(ilga)}$.`,
      })
    },

    // 6. Atkarpos dalijimas
    () => {
      const visa = pasirink([26.18, 32.36, 16.18])
      const ilga = visa / FI
      return uzdavinys(T4, {
        klausimas: `Atkarpa $AB = ${kablelis(visa)}$ cm padalyta aukso pjūviu. Rask ilgesniąją dalį (cm) ir suapvalink iki šimtųjų.`,
        atsakymas: apvalus(ilga),
        atsakymasRodymui: `$\\approx ${apvalus(ilga)}$ cm`,
        sprendimas: `Ilgesnioji dalis yra $${tr('AB', '\\Phi')} \\approx ${tr(kablelisTeX(visa), '1{,}618')} \\approx ${apvalus(ilga)}$ cm; trumpesnioji — likusi dalis.`,
      })
    },

    // 7. Fibonačio santykių palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuris santykis artimesnis $\\Phi$: $\\dfrac{21}{13}$ ar $\\dfrac{34}{21}$?',
        variantai: [
          '$\\dfrac{34}{21} \\approx 1{,}6190$, nes jis nuo $1{,}6180$ nutolęs mažiau',
          '$\\dfrac{21}{13} \\approx 1{,}6154$, nes jis mažesnis',
          'Abu vienodai nutolę',
          'Nė vienas neartėja prie $\\Phi$',
        ],
        teisingas: 0,
        sprendimas: 'Kuo toliau sekoje, tuo gretimų Fibonačio narių santykis arčiau $\\Phi$.',
      }),

    // 8. Tiksli ir apytikslė reikšmė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Mokinys teigia, kad aukso pjūvio santykis yra tiksliai $1{,}6$. Kur klaida?',
        variantai: [
          '$\\Phi = \\dfrac{1 + \\sqrt{5}}{2}$ yra iracionalusis skaičius, tad $1{,}6$ tėra apytikslė reikšmė',
          '$\\Phi$ iš tiesų lygus $1{,}6$',
          '$\\Phi$ yra sveikasis skaičius',
          '$\\Phi$ lygus $\\sqrt{5}$',
        ],
        teisingas: 0,
        sprendimas: 'Iracionaliojo skaičiaus dešimtainė išraiška nesibaigia ir nesikartoja, tad tiksliai užrašyti trupmena jo negalima.',
      }),

    // 9. Aukso pjūvio stačiakampis
    () => {
      const trumpa = pasirink([6, 8, 14])
      const ilga = trumpa * FI
      return uzdavinys(T4, {
        klausimas: `Stačiakampio ilgesniosios ir trumpesniosios kraštinių santykis apytiksliai $\\Phi$. Kokio ilgio (cm) yra ilgesnioji kraštinė, kai trumpesnioji $${trumpa}$ cm? Suapvalink iki šimtųjų.`,
        atsakymas: apvalus(ilga),
        atsakymasRodymui: `$\\approx ${apvalus(ilga)}$ cm`,
        sprendimas: `$${trumpa} \\cdot 1{,}618 \\approx ${apvalus(ilga)}$ cm.`,
      })
    },

    // 10. Ryšys su Fibonačio seka
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kaip Fibonačio seka susijusi su aukso pjūvio skaičiumi?',
        variantai: [
          'Gretimų sekos narių santykis $\\dfrac{F_{n+1}}{F_n}$ artėja prie $\\Phi$',
          'Kiekvienas Fibonačio narys lygus $\\Phi$',
          'Fibonačio narių suma lygi $\\Phi$',
          'Ryšio nėra',
        ],
        teisingas: 0,
        sprendimas: 'Kuo didesnis $n$, tuo santykis tiksliau atitinka $\\Phi \\approx 1{,}618$.',
      }),
  ])
}

// ── 5.5. Sudėtiniai procentai ───────────────────────────────────────────────

const T5 = 'sudetiniai-procentai-10'

const A5 = [
  {
    klausimas: 'Prekės kaina du kartus iš eilės padidėjo po $10$ %. Kokia ji tapo, jei pradinė kaina buvo $100$ Eur?',
    atsakymas: '121',
    atsakymasRodymui: '$121$ Eur',
    sprendimas: '$100 \\cdot 1{,}1 \\cdot 1{,}1 = 121$.',
  },
] as const

export const sudetiniaiProcentai10: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  return variacija([
    // 1. Dviejų metų augimas
    () => {
      const suma = pasirink([1000, 2000, 4000])
      const proc = pasirink([5, 10])
      const galas = suma * (1 + proc / 100) ** 2
      return uzdavinys(T5, {
        klausimas: `$${suma}$ Eur suma kasmet padidėja $${proc}$ %. Kokia ji bus po $2$ metų (Eur)?`,
        atsakymas: apvalus(galas),
        atsakymasRodymui: `$${apvalus(galas)}$ Eur`,
        sprendimas: `$${suma} \\cdot ${kablelisTeX(1 + proc / 100)}^2 = ${apvalus(galas)}$.`,
      })
    },

    // 2. Du padidėjimai po 10 %
    () =>
      uzdavinys(T5, {
        klausimas: 'Prekės kaina du kartus iš eilės padidėjo po $10$ %. Kokia ji tapo, jei pradinė kaina buvo $100$ Eur?',
        atsakymas: '121',
        atsakymasRodymui: '$121$ Eur',
        sprendimas: '$100 \\cdot 1{,}1 = 110$, paskui $110 \\cdot 1{,}1 = 121$ — tai daugiau nei $120$ Eur.',
      }),

    // 3. Metinis daugiklis
    () => {
      const proc = pasirink([15, 20, 25])
      return uzdavinys(T5, {
        klausimas: `Skaičius kasmet sumažėja $${proc}$ %. Koks daugiklis taikomas kiekvienais metais?`,
        atsakymas: kablelis(1 - proc / 100),
        atsakymasRodymui: `$${kablelisTeX(1 - proc / 100)}$`,
        sprendimas: `Lieka $${100 - proc}\\ \\%$, tad daugiklis yra $${tr(String(100 - proc), '100')} = ${kablelisTeX(1 - proc / 100)}$.`,
      })
    },

    // 4. Formulė po n metų
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Gyventojų skaičius $5000$ kasmet auga $2$ %. Kuri formulė duoda jų skaičių po $n$ metų?',
        variantai: [
          '$5000 \\cdot 1{,}02^n$',
          '$5000 + 0{,}02n$',
          '$5000 \\cdot 0{,}02^n$',
          '$5000 \\cdot 2n$',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienais metais dauginama iš to paties daugiklio, tad po $n$ metų jis pakeliamas $n$-uoju laipsniu.',
      }),

    // 5. Kodėl ne 20 %
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kodėl du kartus po $10$ % padidėjimas nėra tas pats, kas vienkartinis $20$ % padidėjimas?',
        variantai: [
          'Nes antrą kartą $10$ % skaičiuojama jau nuo padidėjusios sumos, tad iš viso gaunama $21$ %',
          'Nes procentai niekada nesumuojami',
          'Nes $10 + 10 = 20$ tik sveikiesiems skaičiams',
          'Nes antrasis padidėjimas visada mažesnis',
        ],
        teisingas: 0,
        sprendimas: 'Daugikliai dauginami: $1{,}1 \\cdot 1{,}1 = 1{,}21$, o ne $1{,}2$.',
      }),

    // 6. Keturių metų investicija
    () => {
      const suma = pasirink([2000, 5000])
      const proc = 6
      const galas = suma * 1.06 ** 4
      return uzdavinys(T5, {
        klausimas: `$${suma}$ Eur investicija $4$ metus auga po $${proc}$ % per metus. Kokia bus galutinė suma (Eur)? Suapvalink iki šimtųjų.`,
        atsakymas: apvalus(galas),
        atsakymasRodymui: `$\\approx ${apvalus(galas)}$ Eur`,
        sprendimas: `$${suma} \\cdot 1{,}06^4 \\approx ${apvalus(galas)}$; bendras padidėjimas yra apie $26{,}25\\ \\%$, o ne $24\\ \\%$.`,
      })
    },

    // 7. Pradinės vertės radimas
    () => {
      const pradine = pasirink([4000, 8000])
      const galas = pradine * 0.85 ** 3
      if (!Number.isInteger(galas * 100)) return null
      return uzdavinys(T5, {
        klausimas: `Įrenginio vertė kasmet sumažėja $15$ %. Po $3$ metų ji lygi $${kablelis(galas)}$ Eur. Kokia buvo pradinė vertė (Eur)?`,
        atsakymas: String(pradine),
        atsakymasRodymui: `$${pradine}$ Eur`,
        sprendimas: `$x \\cdot 0{,}85^3 = ${kablelisTeX(galas)}$, tad $x = ${tr(kablelisTeX(galas), '0{,}614125')} = ${pradine}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Tris kartus didindamas po $5$ %, mokinys tiesiog pridėjo $15$ % prie pradinės sumos. Kuo skiriasi rezultatai?',
        variantai: [
          'Tikrasis daugiklis yra $1{,}05^3 \\approx 1{,}1576$, tad padidėjimas yra apie $15{,}76$ %, o ne $15$ %',
          'Rezultatai sutampa',
          'Tikrasis padidėjimas mažesnis už $15$ %',
          'Tikrasis padidėjimas yra $5$ %',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienas kitas padidėjimas skaičiuojamas nuo jau padidėjusios sumos, tad susikaupia daugiau.',
      }),

    // 9. Padidėjimas ir sumažėjimas
    () => {
      const suma = pasirink([5000, 10000, 2500])
      const galas = suma * 1.08 * 0.92
      if (!Number.isInteger(galas * 100)) return null
      return uzdavinys(T5, {
        klausimas: `Gyventojų skaičius pirmus metus padidėjo $8$ %, antrus sumažėjo $8$ %. Kiek gyventojų bus po dvejų metų, jei pradžioje jų buvo $${suma}$?`,
        atsakymas: apvalus(galas),
        atsakymasRodymui: `$${apvalus(galas)}$`,
        sprendimas: `$${suma} \\cdot 1{,}08 \\cdot 0{,}92 = ${suma} \\cdot 0{,}9936 = ${apvalus(galas)}$ — į pradinį dydį negrįžtama, nes antrieji $8\\ \\%$ skaičiuojami nuo didesnio skaičiaus.`,
      })
    },

    // 10. Trys skirtingi pokyčiai
    () => {
      const suma = pasirink([1000, 2000])
      const galas = suma * 1.1 * 0.95 * 1.2
      if (!Number.isInteger(galas * 100)) return null
      return uzdavinys(T5, {
        klausimas: `Suma $${suma}$ Eur pirmais metais padidėjo $10$ %, antrais sumažėjo $5$ %, trečiais padidėjo $20$ %. Kokia ji tapo (Eur)?`,
        atsakymas: apvalus(galas),
        atsakymasRodymui: `$${apvalus(galas)}$ Eur`,
        sprendimas: `$${suma} \\cdot 1{,}1 \\cdot 0{,}95 \\cdot 1{,}2 = ${apvalus(galas)}$ — daugikliai dauginami iš eilės.`,
      })
    },
  ])
}

// ── 5.6. Džiovinimo ir drėkinimo uždaviniai ─────────────────────────────────

const T6 = 'dziovinimo-uzdaviniai'

const A6 = [
  {
    klausimas: '$10$ kg vaisių sudaro $80$ % vandens. Kiek kilogramų sausosios medžiagos juose yra?',
    atsakymas: '2',
    atsakymasRodymui: '$2$ kg',
    sprendimas: 'Sausoji medžiaga sudaro $20$ %: $10 \\cdot 0{,}2 = 2$.',
  },
] as const

export const dziovinimoUzdaviniai: Generatorius = () => suBandymais(kurk6, A6, T6)

function kurk6(): Uzdavinys | null {
  return variacija([
    // 1. Sausoji medžiaga
    () => {
      const mase = pasirink([10, 15, 20, 25])
      const vanduo = pasirink([80, 90, 60])
      const sausa = (mase * (100 - vanduo)) / 100
      if (!Number.isInteger(sausa * 10)) return null
      return uzdavinys(T6, {
        klausimas: `$${mase}$ kg vaisių sudaro $${vanduo}$ % vandens. Kiek kilogramų sausosios medžiagos juose yra?`,
        atsakymas: String(sausa),
        atsakymasRodymui: `$${kablelis(sausa)}$ kg`,
        sprendimas: `Sausoji medžiaga sudaro $${100 - vanduo}\\ \\%$: $${mase} \\cdot ${kablelisTeX((100 - vanduo) / 100)} = ${kablelisTeX(sausa)}$.`,
      })
    },

    // 2. Vandens kiekis
    () => {
      const mase = pasirink([20, 30, 40])
      const dregnumas = pasirink([25, 30, 40])
      const vanduo = (mase * dregnumas) / 100
      if (!Number.isInteger(vanduo * 10)) return null
      return uzdavinys(T6, {
        klausimas: `$${mase}$ kg medžiagos drėgnumas yra $${dregnumas}$ %. Kiek kilogramų sudaro vanduo?`,
        atsakymas: String(vanduo),
        atsakymasRodymui: `$${kablelis(vanduo)}$ kg`,
        sprendimas: `$${mase} \\cdot ${tr(String(dregnumas), '100')} = ${kablelisTeX(vanduo)}$.`,
      })
    },

    // 3. Kodėl sausoji medžiaga nekinta
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kodėl džiovinimo uždaviniuose svarbu, kad sausosios medžiagos masė nekinta?',
        variantai: [
          'Nes garuoja tik vanduo, tad sausosios medžiagos masė ir yra pastovus dydis, per kurį surišama pradžia su pabaiga',
          'Nes sausoji medžiaga taip pat garuoja',
          'Nes sausosios medžiagos procentas nekinta',
          'Nes bendra masė nekinta',
        ],
        teisingas: 0,
        sprendimas: 'Kinta ir bendra masė, ir procentai, o pastovi lieka tik sausosios medžiagos masė kilogramais.',
      }),

    // 4. Sausoji medžiaga po džiovinimo
    () => {
      const mase = pasirink([12, 16, 24])
      const sausaProc = pasirink([25, 50])
      const sausa = (mase * sausaProc) / 100
      if (!Number.isInteger(sausa)) return null
      return uzdavinys(T6, {
        klausimas: `$${mase}$ kg produkto sudaro $${sausaProc}$ % sausosios medžiagos. Kiek kilogramų jos liks po džiovinimo?`,
        atsakymas: String(sausa),
        atsakymasRodymui: `$${sausa}$ kg`,
        sprendimas: `Prieš džiovinimą sausosios medžiagos yra $${mase} \\cdot ${tr(String(sausaProc), '100')} = ${sausa}$ kg; džiovinant garuoja tik vanduo, tad jos lieka tiek pat.`,
      })
    },

    // 5. Kaip keičiasi vandens procentas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Po džiovinimo produkto masė sumažėjo, o sausosios medžiagos masė nepasikeitė. Kaip keitėsi vandens procentas?',
        variantai: [
          'Sumažėjo, nes ta pati sausoji medžiaga dabar sudaro didesnę visos masės dalį',
          'Padidėjo, nes masė sumažėjo',
          'Nepasikeitė',
          'Tapo lygus nuliui',
        ],
        teisingas: 0,
        sprendimas: 'Sausosios medžiagos dalis auga, tad vandens dalis būtinai mažėja.',
      }),

    // 6. Kiek vandens išgarinti
    () => {
      const mase = pasirink([20, 30, 40])
      const nuo = 90
      const iki = 80
      const sausa = (mase * (100 - nuo)) / 100
      const naujaMase = (sausa * 100) / (100 - iki)
      const isgaravo = mase - naujaMase
      if (!Number.isInteger(isgaravo)) return null
      return uzdavinys(T6, {
        klausimas: `$${mase}$ kg vaisių sudaro $${nuo}$ % vandens. Kiek kilogramų vandens turi išgaruoti, kad vanduo sudarytų $${iki}$ % likusios masės?`,
        atsakymas: String(isgaravo),
        atsakymasRodymui: `$${isgaravo}$ kg`,
        sprendimas: `Sausosios medžiagos yra $${sausa}$ kg ir ji nekinta. Po džiovinimo ji sudaro $${100 - iki}\\ \\%$, tad nauja masė $${tr(String(sausa), kablelisTeX((100 - iki) / 100))} = ${naujaMase}$ kg, o išgaravo $${mase} - ${naujaMase} = ${isgaravo}$ kg.`,
      })
    },

    // 7. Drėkinimas
    () => {
      const mase = pasirink([15, 20, 30])
      const sausaNuo = 40
      const sausaIki = 30
      const sausa = (mase * sausaNuo) / 100
      const nauja = (sausa * 100) / sausaIki
      if (!Number.isInteger(nauja)) return null
      return uzdavinys(T6, {
        klausimas: `$${mase}$ kg produkto sudaro $${sausaNuo}$ % sausosios medžiagos. Po drėkinimo ji sudaro $${sausaIki}$ %. Kokia tapo produkto masė (kg)?`,
        atsakymas: String(nauja),
        atsakymasRodymui: `$${nauja}$ kg`,
        sprendimas: `Sausosios medžiagos $${sausa}$ kg ir ji nekinta: $${tr(String(sausa), kablelisTeX(sausaIki / 100))} = ${nauja}$ kg.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: 'Džiovinant $10$ kg produkto, kuriame $80$ % vandens, kol vandens liks $60$ %, mokinys masę apskaičiavo $10 \\cdot 0{,}6$. Kokia iš tikrųjų bus masė (kg)?',
        atsakymas: '5',
        atsakymasRodymui: '$5$ kg',
        sprendimas:
          'Sausosios medžiagos yra $2$ kg ir ji nekinta; po džiovinimo ji sudaro $40$ %, tad masė yra $\\dfrac{2}{0{,}4} = 5$ kg.',
      }),

    // 9. Sugerto vandens kiekis
    () => {
      const mase = pasirink([50, 60, 80])
      const dregnumas = 20
      const naujasDregnumas = 50
      const sausa = (mase * (100 - dregnumas)) / 100
      const nauja = (sausa * 100) / (100 - naujasDregnumas)
      const sugerta = nauja - mase
      if (!Number.isInteger(sugerta)) return null
      return uzdavinys(T6, {
        klausimas: `Medienos masė $${mase}$ kg, drėgnumas $${dregnumas}$ %. Po sudrėkinimo drėgnumas tapo $${naujasDregnumas}$ %. Kiek kilogramų vandens buvo sugerta?`,
        atsakymas: String(sugerta),
        atsakymasRodymui: `$${sugerta}$ kg`,
        sprendimas: `Sausoji medžiaga $${sausa}$ kg nekinta. Naujoji masė $${tr(String(sausa), kablelisTeX((100 - naujasDregnumas) / 100))} = ${nauja}$ kg, tad sugerta $${nauja} - ${mase} = ${sugerta}$ kg.`,
      })
    },

    // 10. Uždavinio sandara
    () =>
      poruUzdavinys(naujasId(T6), T6, {
        klausimas: 'Džiovinimo uždavinyje $20$ kg produkto su $90$ % vandens džiovinama iki $75$ % vandens. Susiek dydžius su jų reikšmėmis.',
        poros: [
          { kaire: 'Sausosios medžiagos masė', desine: '$2$ kg — prieš ir po džiovinimo ta pati' },
          { kaire: 'Naujoji produkto masė', desine: '$8$ kg' },
          { kaire: 'Išgaravusio vandens masė', desine: '$12$ kg' },
        ],
        sprendimas: 'Sausoji medžiaga $2$ kg po džiovinimo sudaro $25$ %, tad visa masė yra $\\dfrac{2}{0{,}25} = 8$ kg.',
      }),
  ])
}

// ── 5.7. Lydiniai, mišiniai, tirpalai ir koncentracija ──────────────────────

const T7 = 'lydiniai-tirpalai'

const A7 = [
  {
    klausimas: 'Kiek kilogramų druskos yra $20$ kg $15$ % tirpale?',
    atsakymas: '3',
    atsakymasRodymui: '$3$ kg',
    sprendimas: '$20 \\cdot 0{,}15 = 3$.',
  },
] as const

export const lydiniaiTirpalai: Generatorius = () => suBandymais(kurk7, A7, T7)

function kurk7(): Uzdavinys | null {
  return variacija([
    // 1. Ištirpusios medžiagos masė
    () => {
      const mase = pasirink([20, 25, 40])
      const proc = pasirink([15, 20, 35])
      const druska = (mase * proc) / 100
      if (!Number.isInteger(druska * 10)) return null
      return uzdavinys(T7, {
        klausimas: `Kiek kilogramų druskos yra $${mase}$ kg $${proc}$ % tirpale?`,
        atsakymas: String(druska),
        atsakymasRodymui: `$${kablelis(druska)}$ kg`,
        sprendimas: `$${mase} \\cdot ${kablelisTeX(proc / 100)} = ${kablelisTeX(druska)}$.`,
      })
    },

    // 2. Dviejų vienodų kiekių maišymas
    () => {
      const kiekis = pasirink([5, 8, 10])
      const p1 = 10
      const p2 = 30
      return uzdavinys(T7, {
        klausimas: `Sumaišyta $${kiekis}$ l $${p1}$ % ir $${kiekis}$ l $${p2}$ % tirpalų. Kokia gauto tirpalo koncentracija (procentais)?`,
        atsakymas: String((p1 + p2) / 2),
        atsakymasRodymui: `$${(p1 + p2) / 2}$ %`,
        sprendimas: `Maišant vienodus kiekius gaunamas koncentracijų vidurkis: $${tr(`${p1} + ${p2}`, '2')} = ${(p1 + p2) / 2}\\ \\%$.`,
      })
    },

    // 3. Grynas varis lydinyje
    () => {
      const mase = pasirink([12, 15, 20])
      const proc = pasirink([40, 45, 60])
      const varis = (mase * proc) / 100
      if (!Number.isInteger(varis * 10)) return null
      return uzdavinys(T7, {
        klausimas: `Kiek kilogramų gryno vario yra $${mase}$ kg $${proc}$ % vario lydinyje?`,
        atsakymas: String(varis),
        atsakymasRodymui: `$${kablelis(varis)}$ kg`,
        sprendimas: `$${mase} \\cdot ${kablelisTeX(proc / 100)} = ${kablelisTeX(varis)}$.`,
      })
    },

    // 4. Vandens įpylimas
    () => {
      const turis = pasirink([8, 12, 15])
      const proc = pasirink([25, 20, 40])
      const vanduo = pasirink([2, 3, 5])
      const gryna = (turis * proc) / 100
      const nauja = (gryna * 100) / (turis + vanduo)
      if (!Number.isInteger(nauja)) return null
      return uzdavinys(T7, {
        klausimas: `Į $${turis}$ l $${proc}$ % tirpalo įpilta $${vanduo}$ l vandens. Kokia naujoji koncentracija (procentais)?`,
        atsakymas: String(nauja),
        atsakymasRodymui: `$${nauja}$ %`,
        sprendimas: `Grynos medžiagos lieka $${kablelisTeX(gryna)}$ l, o tūris tampa $${turis + vanduo}$ l: $${tr(kablelisTeX(gryna), String(turis + vanduo))} = ${nauja}\\ \\%$.`,
      })
    },

    // 5. Tirpalo masė ir ištirpusios medžiagos masė
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kuo skiriasi tirpalo masė nuo jame ištirpusios medžiagos masės?',
        variantai: [
          'Tirpalo masė apima ir tirpiklį, ir ištirpusią medžiagą; koncentracija yra jų santykis',
          'Jos visada lygios',
          'Ištirpusios medžiagos masė visada didesnė',
          'Tirpalo masė lygi koncentracijai',
        ],
        teisingas: 0,
        sprendimas: 'Koncentracija $= \\dfrac{\\text{ištirpusios medžiagos masė}}{\\text{viso tirpalo masė}}$.',
      }),

    // 6. Kiek stipresnio lydinio pridėti
    () => {
      const turimas = pasirink([10, 20])
      const stiprus = 60
      const silpnas = 20
      const tikslas = 40
      const x = (turimas * (tikslas - silpnas)) / (stiprus - tikslas)
      if (!Number.isInteger(x)) return null
      return uzdavinys(T7, {
        klausimas: `Kiek kilogramų $${stiprus}$ % lydinio reikia sumaišyti su $${turimas}$ kg $${silpnas}$ % lydinio, kad gautume $${tikslas}$ % lydinį?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$ kg`,
        sprendimas: `Lygtis $${kablelisTeX(stiprus / 100)}x + ${kablelisTeX((turimas * silpnas) / 100)} = ${kablelisTeX(tikslas / 100)}(x + ${turimas})$ duoda $x = ${x}$.`,
      })
    },

    // 7. Du tirpalai duotam kiekiui
    () => {
      const turis = 16
      const p1 = 30
      const p2 = 50
      const tikslas = 42
      const y = (turis * (tikslas - p1)) / (p2 - p1)
      const x = turis - y
      if (!Number.isInteger(x * 10)) return null
      return uzdavinys(T7, {
        klausimas: `Iš $${p1}$ % ir $${p2}$ % tirpalų reikia paruošti $${turis}$ l $${tikslas}$ % tirpalo. Kiek litrų $${p1}$ % tirpalo reikės?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${kablelis(x)}$ l`,
        sprendimas: `Iš $x + y = ${turis}$ ir $${kablelisTeX(p1 / 100)}x + ${kablelisTeX(p2 / 100)}y = ${kablelisTeX((turis * tikslas) / 100)}$ gauname $y = ${kablelisTeX(y)}$ ir $x = ${kablelisTeX(x)}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: 'Sumaišęs vienodus kiekius $10$ % ir $50$ % tirpalų, mokinys teigia gavęs $60$ % tirpalą. Kokia iš tikrųjų yra koncentracija (procentais)?',
        atsakymas: '30',
        atsakymasRodymui: '$30$ %',
        sprendimas:
          'Koncentracijos nesudedamos — sudedamos grynos medžiagos ir bendri tūriai. Vienodiems kiekiams gaunamas vidurkis $\\dfrac{10 + 50}{2} = 30\\ \\%$.',
      }),

    // 9. Vandens išgarinimas
    () => {
      const turis = pasirink([20, 40])
      const nuo = 25
      const iki = pasirink([40, 50])
      const gryna = (turis * nuo) / 100
      const naujas = (gryna * 100) / iki
      const isgaravo = turis - naujas
      if (!Number.isInteger(isgaravo * 10)) return null
      return uzdavinys(T7, {
        klausimas: `Iš $${turis}$ l $${nuo}$ % tirpalo garinamas vanduo, kol koncentracija tampa $${iki}$ %. Kiek litrų vandens išgaravo? Tūrius laikyk lygiais masėms.`,
        atsakymas: String(isgaravo),
        atsakymasRodymui: `$${kablelis(isgaravo)}$ l`,
        sprendimas: `Grynos medžiagos $${gryna}$ l ir garinant ji nekinta; naujas tūris $${tr(String(gryna), kablelisTeX(iki / 100))} = ${kablelis(naujas)}$ l, tad išgaravo $${kablelis(isgaravo)}$ l.`,
      })
    },

    // 10. Trys komponentai
    () =>
      uzdavinys(T7, {
        klausimas: 'Sumaišyta $4$ l $10$ %, $6$ l $20$ % ir $10$ l $35$ % tirpalų. Kokia gauto mišinio koncentracija (procentais)?',
        atsakymas: '24',
        atsakymasRodymui: '$24$ %',
        sprendimas:
          'Grynos medžiagos: $0{,}4 + 1{,}2 + 3{,}5 = 4{,}8$ l; viso mišinio $20$ l, tad $\\dfrac{4{,}8}{20} = 0{,}24 = 24\\ \\%$.',
      }),
  ])
}
