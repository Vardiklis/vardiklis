import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { monetos, type Moneta } from './pirmoku-vaizdai'
import { kainuEtiketes } from './treciokams-matai-vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 3 klasės tema „Tyrinėju reiškinį „Pinigai““ — septynios potemės.
 *
 * Anksčiau jos rėmėsi `pinigai` ir `procentai` generatoriais: pirmasis duodavo
 * kainas su kableliu, antrasis — nuolaidas procentais, o trečioje klasėje nei
 * dešimtainių trupmenų, nei procentų dar nėra.
 *
 * Tema yra ne tik apie skaičiavimą, bet ir apie tai, kur pinigai išleidžiami ir
 * kurios išlaidos būtinos. Tokie klausimai užrašomi pasirenkamuoju formatu —
 * su vienu teisingu atsakymu, o ne prašant „parašyk tris vietas“.
 */

const EURU = { vns: 'euras', dgs: 'eurai', kilm: 'eurų' }
const EURUS = { vns: 'eurą', dgs: 'eurus', kilm: 'eurų' }

const PREKES = [
  'Duona',
  'Pienas',
  'Obuoliai',
  'Sąsiuvinis',
  'Pieštukai',
  'Sultys',
  'Sausainiai',
  'Kuprinė',
] as const

function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 10000, 10000)
}

// ── 6.1 Kodėl pinigai turi skirtingą vertę? ─────────────────────────────────

const A_VERTE = [
  {
    klausimas: 'Kuris banknotas vertingesnis: 5 Eur ar 10 Eur?',
    atsakymas: '10',
    atsakymasRodymui: '$10$ Eur',
    sprendimas: 'Dešimt yra daugiau už penkis, tad 10 Eur banknotas vertingesnis.',
  },
] as const

export const piniguVerte3: Generatorius = () => suBandymais(kurkVerte, A_VERTE, 'pinigu-verte-3')

function kurkVerte(): Uzdavinys | null {
  return variacija([
    // 1. Kiek monetų sudaro banknotą
    () => {
      const banknotas = pasirink([5, 10, 20])
      const moneta = pasirink([1, 2])
      if (banknotas % moneta !== 0) return null
      return uzdavinys('pinigu-verte-3', {
        klausimas: `Kiek ${moneta} Eur monetų reikia, kad susidarytų ${banknotas} Eur?`,
        atsakymas: String(banknotas / moneta),
        atsakymasRodymui: `$${banknotas / moneta}$`,
        sprendimas: `$${banknotas} : ${moneta} = ${banknotas / moneta}$.`,
      })
    },

    // 2. Ar vertės vienodos
    () =>
      pasirinkimoUzdavinys(naujasId('pinigu-verte-3'), 'pinigu-verte-3', {
        klausimas: 'Ar 2 Eur moneta ir dvi 1 Eur monetos turi tą pačią vertę?',
        variantai: [
          'taip, abiem atvejais tai 2 Eur',
          'ne, dvi monetos visada vertingesnės',
          'ne, viena moneta visada vertingesnė',
        ],
        teisingas: 0,
        sprendimas: 'Vertė priklauso nuo sumos, o ne nuo monetų skaičiaus: $1 + 1 = 2$.',
      }),

    // 3. Kurios monetos vertė didesnė
    () => {
      const a = pasirink([10, 20, 50] as const)
      const b = pasirink([5, 10, 20, 50] as const)
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId('pinigu-verte-3'), 'pinigu-verte-3', {
        klausimas: `Kurios monetos vertė didesnė: ${a} ct ar ${b} ct?`,
        variantai: a > b ? [`${a} ct`, `${b} ct`, 'vertės vienodos'] : [`${b} ct`, `${a} ct`, 'vertės vienodos'],
        teisingas: 0,
        sprendimas: `${Math.max(a, b)} yra daugiau už ${Math.min(a, b)}.`,
      })
    },

    // 4. Monetų suma iš brėžinio
    () => {
      const vertes = sumaisyk<Moneta>([200, 100, 50, 20, 10]).slice(0, 4)
      const centai = vertes.reduce((s, x) => s + x, 0)
      return uzdavinys('pinigu-verte-3', {
        // Monetos yra tik piešinyje: jų vertes reikia atpažinti pačiam.
        klausimas: 'Kiek centų iš viso sudaro pavaizduotos monetos?',
        atsakymas: String(centai),
        atsakymasRodymui: `$${centai}$ ct`,
        sprendimas: `$${vertes.join(' + ')} = ${centai}$.`,
        brezinys: monetos(vertes),
      })
    },

    // 5. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('pinigu-verte-3'), 'pinigu-verte-3', {
        klausimas:
          'Mokinys sako, kad penkios 10 ct monetos vertingesnės už vieną 50 ct monetą, nes monetų daugiau. Kur klaida?',
        variantai: [
          'vertės vienodos: $5 \\cdot 10 = 50$ ct',
          'penkios monetos iš tikrųjų vertingesnės',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Svarbu ne monetų skaičius, o jų verčių suma.',
      }),

    // 6. Kuri suma didesnė
    () => {
      const a = atsitiktinis(2, 8) * 100 + atsitiktinis(1, 9) * 10
      const b = atsitiktinis(2, 8) * 100 + atsitiktinis(1, 9) * 10
      if (a === b) return null
      const eur = (c: number) => `${Math.floor(c / 100)} Eur ${c % 100} ct`
      return uzdavinys('pinigu-verte-3', {
        klausimas: `Kuri suma didesnė ir keliais centais: ${eur(a)} ar ${eur(b)}?`,
        atsakymas: String(Math.abs(a - b)),
        atsakymasRodymui: `$${Math.abs(a - b)}$ ct`,
        sprendimas: `${eur(a)} yra ${a} ct, ${eur(b)} — ${b} ct; skirtumas $${Math.max(
          a,
          b,
        )} - ${Math.min(a, b)} = ${Math.abs(a - b)}$.`,
      })
    },

    // 7. Kiek monetų mažiausiai
    () => {
      const eurai = pasirink([3, 4, 6, 7, 8])
      const dvieju = Math.floor(eurai / 2)
      const vieno = eurai % 2
      return uzdavinys('pinigu-verte-3', {
        klausimas: `Kiek mažiausiai monetų reikia ${eurai} Eur sumai, jei yra tik 1 Eur ir 2 Eur monetos?`,
        atsakymas: String(dvieju + vieno),
        atsakymasRodymui: `$${dvieju + vieno}$`,
        sprendimas: `Imamos ${dvieju} monetos po 2 Eur${
          vieno ? ' ir viena 1 Eur moneta' : ''
        }: iš viso ${dvieju + vieno}.`,
      })
    },
  ])
}

// ── 6.2 Kur išleidžiami pinigai? ────────────────────────────────────────────

const A_ISLEIDIMAS = [
  {
    klausimas: 'Kur mokama už važiavimą autobusu?',
    atsakymas: 'B',
    atsakymasRodymui: 'B — už paslaugą',
    sprendimas: 'Važiavimas yra paslauga, o ne daiktas.',
  },
] as const

export const kurIsleidziami: Generatorius = () =>
  suBandymais(kurkIsleidima, A_ISLEIDIMAS, 'kur-isleidziami')

function kurkIsleidima(): Uzdavinys | null {
  const PREKE_AR_PASLAUGA = [
    { kas: 'duona', tipas: 'prekė' },
    { kas: 'kirpimas', tipas: 'paslauga' },
    { kas: 'sąsiuvinis', tipas: 'prekė' },
    { kas: 'autobuso bilietas', tipas: 'paslauga' },
    { kas: 'dviračio remontas', tipas: 'paslauga' },
    { kas: 'obuoliai', tipas: 'prekė' },
  ] as const

  return variacija([
    // 1. Prekė ar paslauga
    () => {
      const x = pasirink(PREKE_AR_PASLAUGA)
      return pasirinkimoUzdavinys(naujasId('kur-isleidziami'), 'kur-isleidziami', {
        klausimas: `Ar už tai mokama kaip už prekę, ar kaip už paslaugą: ${x.kas}?`,
        variantai:
          x.tipas === 'prekė'
            ? ['prekė', 'paslauga', 'nei viena, nei kita']
            : ['paslauga', 'prekė', 'nei viena, nei kita'],
        teisingas: 0,
        sprendimas:
          x.tipas === 'prekė'
            ? 'Prekę galima paimti į rankas ir parsinešti.'
            : 'Paslauga yra atliktas darbas, o ne daiktas.',
      })
    },

    // 2. Kuo skiriasi prekė nuo paslaugos
    () =>
      pasirinkimoUzdavinys(naujasId('kur-isleidziami'), 'kur-isleidziami', {
        klausimas: 'Kuo prekės pirkimas skiriasi nuo paslaugos pirkimo?',
        variantai: [
          'perkant prekę gaunamas daiktas, o perkant paslaugą — atliktas darbas',
          'paslaugos visada nemokamos',
          'prekės visada brangesnės už paslaugas',
        ],
        teisingas: 0,
        sprendimas: 'Prekė yra daiktas, o paslauga — kažkieno atliktas darbas.',
      }),

    // 3. Kur mokama už maistą
    () =>
      pasirinkimoUzdavinys(naujasId('kur-isleidziami'), 'kur-isleidziami', {
        klausimas: 'Kur dažniausiai mokama už maistą?',
        variantai: ['parduotuvėje', 'bibliotekoje', 'mokyklos kieme'],
        teisingas: 0,
        sprendimas: 'Maisto prekės perkamos parduotuvėje.',
      }),

    // 4. Susiejimas
    () =>
      poruUzdavinys(naujasId('kur-isleidziami'), 'kur-isleidziami', {
        klausimas: 'Sujunk išlaidą su tuo, kur už ją mokama.',
        poros: [
          { kaire: 'duona', desine: 'parduotuvė' },
          { kaire: 'kirpimas', desine: 'kirpykla' },
          { kaire: 'bilietas', desine: 'autobusas' },
        ],
        sprendimas: 'Kiekviena išlaida turi savo vietą, kurioje už ją mokama.',
      }),

    // 5. Savaitės išlaidos
    () => {
      const maistas = atsitiktinis(15, 40)
      const transportas = atsitiktinis(5, 15)
      const laisvalaikis = atsitiktinis(5, 20)
      const viso = maistas + transportas + laisvalaikis
      return uzdavinys('kur-isleidziami', {
        klausimas: `Per savaitę maistui išleista ${maistas} Eur, transportui — ${transportas} Eur, laisvalaikiui — ${laisvalaikis} Eur. Kiek iš viso eurų išleista?`,
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$ Eur`,
        sprendimas: `$${maistas} + ${transportas} + ${laisvalaikis} = ${viso}$.`,
      })
    },

    // 6. Kuriai sričiai daugiausia
    () => {
      const sritys = sumaisyk([
        { vardas: 'maistui', suma: atsitiktinis(20, 45) },
        { vardas: 'transportui', suma: atsitiktinis(5, 18) },
        { vardas: 'drabužiams', suma: atsitiktinis(10, 30) },
      ])
      const didziausia = sritys.reduce((a, b) => (a.suma >= b.suma ? a : b))
      if (sritys.filter((s) => s.suma === didziausia.suma).length > 1) return null
      return pasirinkimoUzdavinys(naujasId('kur-isleidziami'), 'kur-isleidziami', {
        klausimas: `Šeima išleido: ${sritys
          .map((s) => `${s.vardas} — ${s.suma} Eur`)
          .join(', ')}. Kuriai sričiai išleista daugiausia?`,
        variantai: [
          didziausia.vardas,
          ...sritys.filter((s) => s !== didziausia).map((s) => s.vardas),
        ],
        teisingas: 0,
        sprendimas: `Didžiausia suma yra ${didziausia.suma} Eur.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('kur-isleidziami'), 'kur-isleidziami', {
        klausimas: 'Mokinys sako, kad už elektrą nemokama, nes tai ne daiktas. Kur klaida?',
        variantai: [
          'elektra yra paslauga, o už paslaugas taip pat mokama',
          'elektra iš tikrųjų yra daiktas',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Mokama ne tik už daiktus, bet ir už paslaugas.',
      }),
  ])
}

// ── 6.3 Kokios yra būtinosios išlaidos? ─────────────────────────────────────

const BUTINOS = ['duona', 'vanduo', 'šildymas', 'vaistai', 'būsto nuoma'] as const
const NEBUTINOS = ['ledai', 'komiksas', 'žaislas', 'bilietas į kiną', 'saldainiai'] as const

const A_BUTINOS = [
  {
    klausimas: 'Ar ledai yra būtinoji išlaida?',
    atsakymas: 'B',
    atsakymasRodymui: 'B — ne',
    sprendimas: 'Be ledų galima apsieiti, tad tai nebūtinoji išlaida.',
  },
] as const

export const butinosIslaidos: Generatorius = () =>
  suBandymais(kurkButinas, A_BUTINOS, 'butinos-islaidos')

function kurkButinas(): Uzdavinys | null {
  return variacija([
    // 1. Ar išlaida būtinoji
    () => {
      const butina = pasirink([true, false])
      const kas = butina ? pasirink(BUTINOS) : pasirink(NEBUTINOS)
      return pasirinkimoUzdavinys(naujasId('butinos-islaidos'), 'butinos-islaidos', {
        klausimas: `Ar tai būtinoji išlaida: ${kas}?`,
        variantai: butina
          ? ['taip, be to apsieiti negalima', 'ne, be to galima apsieiti', 'tai ne išlaida']
          : ['ne, be to galima apsieiti', 'taip, be to apsieiti negalima', 'tai ne išlaida'],
        teisingas: 0,
        sprendimas: butina
          ? 'Tai reikalinga kasdien gyventi, tad išlaida būtinoji.'
          : 'Tai malonu, bet gyventi be to galima — išlaida nebūtinoji.',
      })
    },

    // 2. Kuri iš keturių nebūtina
    () => {
      const trys = sumaisyk([...BUTINOS]).slice(0, 2)
      const nebutina = pasirink(NEBUTINOS)
      return pasirinkimoUzdavinys(naujasId('butinos-islaidos'), 'butinos-islaidos', {
        klausimas: `Kuri iš šių išlaidų nėra būtinoji: ${sumaisyk([...trys, nebutina]).join(', ')}?`,
        variantai: [nebutina, trys[0], trys[1]],
        teisingas: 0,
        sprendimas: `Be ${nebutina} galima apsieiti, o kiti dalykai reikalingi kasdien.`,
      })
    },

    // 3. Kuo skiriasi
    () =>
      pasirinkimoUzdavinys(naujasId('butinos-islaidos'), 'butinos-islaidos', {
        klausimas: 'Kuo būtinosios išlaidos skiriasi nuo nebūtinųjų?',
        variantai: [
          'be būtinųjų negalima apsieiti, o be nebūtinųjų galima',
          'būtinosios visada mažesnės',
          'nebūtinųjų išlaidų nebūna',
        ],
        teisingas: 0,
        sprendimas: 'Būtinosios išlaidos reikalingos kasdieniam gyvenimui.',
      }),

    // 4. Kiek liks po būtinųjų pirkinių
    () => {
      const turi = atsitiktinis(30, 60)
      const duona = atsitiktinis(1, 3)
      const pienas = atsitiktinis(1, 3)
      const sasiuvinis = atsitiktinis(1, 4)
      const viso = duona + pienas + sasiuvinis
      return uzdavinys('butinos-islaidos', {
        klausimas: `Šeima turi ${turi} ${derink(
          turi,
          EURUS,
        )}. Nupirkta duonos už ${duona} Eur, pieno už ${pienas} Eur ir sąsiuvinis už ${sasiuvinis} Eur. Kiek eurų liko?`,
        atsakymas: String(turi - viso),
        atsakymasRodymui: `$${turi - viso}$ Eur`,
        sprendimas: `Būtiniems pirkiniams išleista $${duona} + ${pienas} + ${sasiuvinis} = ${viso}$, liko $${turi} - ${viso} = ${
          turi - viso
        }$.`,
      })
    },

    // 5. Ką pirkti pirmiausia
    () =>
      pasirinkimoUzdavinys(naujasId('butinos-islaidos'), 'butinos-islaidos', {
        klausimas: 'Pinigų užtenka tik daliai pirkinių. Ką pirkti pirmiausia?',
        variantai: ['būtinąsias prekes: duoną ir pieną', 'ledus ir saldainius', 'žaislą'],
        teisingas: 0,
        sprendimas: 'Pirmiausia perkama tai, be ko negalima apsieiti.',
      }),

    // 6. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('butinos-islaidos'), 'butinos-islaidos', {
        klausimas: 'Mokinys teigia, kad kiekviena norima prekė yra būtinoji išlaida. Kur klaida?',
        variantai: [
          'norėti ir būtinai reikėti nėra tas pats',
          'iš tikrųjų visos prekės būtinos',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Būtina yra tai, be ko negalima apsieiti, o ne tai, ko norisi.',
      }),

    // 7. Kiek būtinųjų grupėje
    () => {
      const butinu = atsitiktinis(2, 3)
      const nebutinu = atsitiktinis(1, 3)
      const sarasas = sumaisyk([
        ...sumaisyk([...BUTINOS]).slice(0, butinu),
        ...sumaisyk([...NEBUTINOS]).slice(0, nebutinu),
      ])
      return uzdavinys('butinos-islaidos', {
        klausimas: `Kiek iš šių išlaidų yra būtinosios: ${sarasas.join(', ')}?`,
        atsakymas: String(butinu),
        atsakymasRodymui: `$${butinu}$`,
        sprendimas: `Būtinosios yra tos, be kurių negalima apsieiti — jų ${butinu}.`,
      })
    },
  ])
}

// ── 6.4 Kaip apskaičiuoti išlaidas? ─────────────────────────────────────────

const A_ISLAIDOS = [
  {
    klausimas: 'Duona kainuoja 1 Eur, pienas 2 Eur, obuoliai 3 Eur. Kiek kainuoja visi pirkiniai?',
    atsakymas: '6',
    atsakymasRodymui: '$6$ Eur',
    sprendimas: '$1 + 2 + 3 = 6$.',
  },
] as const

export const islaiduSkaiciavimas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkIslaidas(sritis), A_ISLAIDOS, 'islaidu-skaiciavimas')

function kurkIslaidas(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const prekes = sumaisyk([...PREKES]).slice(0, 4)
  const kainos = prekes.map(() => atsitiktinis(2, 9))

  return variacija([
    // 1. Trijų pirkinių suma
    () => {
      const viso = kainos[0] + kainos[1] + kainos[2]
      return uzdavinys('islaidu-skaiciavimas', {
        klausimas: `Apskaičiuok pirkinių sumą: ${prekes[0].toLowerCase()} — ${
          kainos[0]
        } Eur, ${prekes[1].toLowerCase()} — ${kainos[1]} Eur, ${prekes[2].toLowerCase()} — ${
          kainos[2]
        } Eur.`,
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$ Eur`,
        sprendimas: `$${kainos[0]} + ${kainos[1]} + ${kainos[2]} = ${viso}$.`,
      })
    },

    // 2. Iš kainų etikečių
    () => {
      const etiketes = prekes.map((p, i) => ({ pavadinimas: p, kaina: kainos[i] }))
      const dvi = sumaisyk([0, 1, 2, 3]).slice(0, 2)
      return uzdavinys('islaidu-skaiciavimas', {
        // Kainos yra tik etiketėse — jas reikia susirasti.
        klausimas: `Kiek kartu kainuoja „${prekes[dvi[0]]}“ ir „${prekes[dvi[1]]}“?`,
        atsakymas: String(kainos[dvi[0]] + kainos[dvi[1]]),
        atsakymasRodymui: `$${kainos[dvi[0]] + kainos[dvi[1]]}$ Eur`,
        sprendimas: `$${kainos[dvi[0]]} + ${kainos[dvi[1]]} = ${kainos[dvi[0]] + kainos[dvi[1]]}$.`,
        brezinys: kainuEtiketes(etiketes),
      })
    },

    // 3. Kiek liko
    () => {
      const turejo = atsitiktinis(10, 30)
      const isleido = atsitiktinis(4, turejo - 2)
      return uzdavinys('islaidu-skaiciavimas', {
        klausimas: `Iš ${turejo} ${derink(turejo, EURU)} išleista ${isleido} Eur. Kiek pinigų liko?`,
        atsakymas: String(turejo - isleido),
        atsakymasRodymui: `$${turejo - isleido}$ Eur`,
        sprendimas: `$${turejo} - ${isleido} = ${turejo - isleido}$.`,
      })
    },

    // 4. Šeimos išlaidos
    () => {
      const maistas = atsitiktinis(15, 60)
      const transportas = atsitiktinis(4, 20)
      const vaistai = atsitiktinis(3, 15)
      const viso = maistas + transportas + vaistai
      if (viso > maks) return null
      return uzdavinys('islaidu-skaiciavimas', {
        klausimas: `Šeimos išlaidos: maistas — ${maistas} Eur, transportas — ${transportas} Eur, vaistai — ${vaistai} Eur. Kiek iš viso?`,
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$ Eur`,
        sprendimas: `$${maistas} + ${transportas} + ${vaistai} = ${viso}$.`,
      })
    },

    // 5. Du pirkiniai ir grąža
    () => {
      const turejo = atsitiktinis(25, 50)
      const a = atsitiktinis(5, 15)
      const b = atsitiktinis(5, 15)
      if (a + b >= turejo) return null
      return uzdavinys('islaidu-skaiciavimas', {
        klausimas: `Iš ${turejo} ${derink(
          turejo,
          EURU,
        )} nupirkta už ${a} Eur ir už ${b} Eur. Kiek liko?`,
        atsakymas: String(turejo - a - b),
        atsakymasRodymui: `$${turejo - a - b}$ Eur`,
        sprendimas: `Išleista $${a} + ${b} = ${a + b}$, liko $${turejo} - ${a + b} = ${
          turejo - a - b
        }$.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const a = atsitiktinis(4, 9)
      const b = atsitiktinis(4, 9)
      const blogas = a + b + 5
      return pasirinkimoUzdavinys(naujasId('islaidu-skaiciavimas'), 'islaidu-skaiciavimas', {
        klausimas: `Mokinys sudėjo ${a} Eur ir ${b} Eur ir gavo ${blogas} Eur. Kur klaida?`,
        variantai: [`teisinga suma yra ${a + b} Eur`, `teisinga suma yra ${a + b + 10} Eur`, 'klaidos nėra'],
        teisingas: 0,
        sprendimas: `$${a} + ${b} = ${a + b}$.`,
      })
    },

    // 7. Kuri grupė brangesnė
    () => {
      const A = [atsitiktinis(2, 9), atsitiktinis(2, 9), atsitiktinis(2, 9)]
      const B = [atsitiktinis(2, 9), atsitiktinis(2, 9), atsitiktinis(2, 9)]
      const sA = A.reduce((s, x) => s + x, 0)
      const sB = B.reduce((s, x) => s + x, 0)
      if (sA === sB) return null
      return pasirinkimoUzdavinys(naujasId('islaidu-skaiciavimas'), 'islaidu-skaiciavimas', {
        klausimas: `Kuri pirkinių grupė brangesnė: A — ${A.join(' Eur + ')} Eur ar B — ${B.join(
          ' Eur + ',
        )} Eur?`,
        variantai: sA > sB ? ['A', 'B', 'kainuoja vienodai'] : ['B', 'A', 'kainuoja vienodai'],
        teisingas: 0,
        sprendimas: `A kainuoja ${sA} Eur, B — ${sB} Eur.`,
      })
    },
  ])
}

// ── 6.5 Kiek atpigo prekė? ──────────────────────────────────────────────────

const A_ATPIGO = [
  {
    klausimas: 'Prekė kainavo 10 Eur, dabar kainuoja 8 Eur. Kiek eurų ji atpigo?',
    atsakymas: '2',
    atsakymasRodymui: '$2$ Eur',
    sprendimas: '$10 - 8 = 2$.',
  },
] as const

export const kiekAtpigo: Generatorius = () => suBandymais(kurkAtpigima, A_ATPIGO, 'kiek-atpigo')

function kurkAtpigima(): Uzdavinys | null {
  const sena = atsitiktinis(8, 40)
  const nuolaida = atsitiktinis(2, Math.min(12, sena - 3))
  const nauja = sena - nuolaida
  const preke = pasirink(PREKES)

  return variacija([
    // 1. Kiek atpigo
    () =>
      uzdavinys('kiek-atpigo', {
        klausimas: `Prekė kainavo ${sena} Eur, o dabar kainuoja ${nauja} Eur. Kiek eurų ji atpigo?`,
        atsakymas: String(nuolaida),
        atsakymasRodymui: `$${nuolaida}$ Eur`,
        sprendimas: `$${sena} - ${nauja} = ${nuolaida}$.`,
      }),

    // 2. Iš kainų etikečių
    () =>
      uzdavinys('kiek-atpigo', {
        // Abi kainos yra tik etiketėje: seną kainą reikia rasti perbrauktą.
        klausimas: 'Keliais eurais atpigo etiketėje pavaizduota prekė?',
        atsakymas: String(nuolaida),
        atsakymasRodymui: `$${nuolaida}$ Eur`,
        sprendimas: `$${sena} - ${nauja} = ${nuolaida}$.`,
        brezinys: kainuEtiketes([{ pavadinimas: preke, kaina: nauja, senaKaina: sena }]),
      }),

    // 3. Nauja kaina iš nuolaidos
    () =>
      uzdavinys('kiek-atpigo', {
        klausimas: `Prekė kainavo ${sena} Eur ir atpigo ${nuolaida} Eur. Kokia nauja kaina?`,
        atsakymas: String(nauja),
        atsakymasRodymui: `$${nauja}$ Eur`,
        sprendimas: `$${sena} - ${nuolaida} = ${nauja}$.`,
      }),

    // 4. Kokį veiksmą atlikti
    () =>
      pasirinkimoUzdavinys(naujasId('kiek-atpigo'), 'kiek-atpigo', {
        klausimas: 'Kokį veiksmą reikia atlikti, norint sužinoti, kiek prekė atpigo?',
        variantai: [
          'iš senos kainos atimti naują',
          'seną kainą pridėti prie naujos',
          'seną kainą padalyti iš naujos',
        ],
        teisingas: 0,
        sprendimas: 'Atpigimas yra kainų skirtumas.',
      }),

    // 5. Du daiktai po nuolaidos
    () =>
      uzdavinys('kiek-atpigo', {
        klausimas: `Žaislas kainavo ${sena} Eur, o po nuolaidos — ${nauja} Eur. Kiek reikėtų sumokėti už du tokius žaislus po nuolaidos?`,
        atsakymas: String(2 * nauja),
        atsakymasRodymui: `$${2 * nauja}$ Eur`,
        sprendimas: `$${nauja} + ${nauja} = ${2 * nauja}$.`,
      }),

    // 6. Klaidos radimas
    () => {
      const blogas = sena + nauja
      return pasirinkimoUzdavinys(naujasId('kiek-atpigo'), 'kiek-atpigo', {
        klausimas: `Mokinys sako, kad nukritus kainai nuo ${sena} Eur iki ${nauja} Eur prekė atpigo ${blogas} Eur. Kur klaida?`,
        variantai: [
          `kainos buvo sudėtos, o reikėjo atimti: $${sena} - ${nauja} = ${nuolaida}$`,
          `atpigimas iš tikrųjų yra ${nauja} Eur`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Atpigimas yra skirtumas: $${sena} - ${nauja} = ${nuolaida}$.`,
      })
    },

    // 7. Kuri prekė atpigo labiau
    () => {
      const sena2 = atsitiktinis(10, 40)
      const nuolaida2 = atsitiktinis(2, Math.min(12, sena2 - 3))
      if (nuolaida2 === nuolaida) return null
      return pasirinkimoUzdavinys(naujasId('kiek-atpigo'), 'kiek-atpigo', {
        klausimas: `Kuri prekė atpigo labiau: A — nuo ${sena} Eur iki ${nauja} Eur ar B — nuo ${sena2} Eur iki ${
          sena2 - nuolaida2
        } Eur?`,
        variantai:
          nuolaida > nuolaida2 ? ['A', 'B', 'atpigo vienodai'] : ['B', 'A', 'atpigo vienodai'],
        teisingas: 0,
        sprendimas: `A atpigo ${nuolaida} Eur, B — ${nuolaida2} Eur.`,
      })
    },
  ])
}

// ── 6.6 Kaip galime daugiau sutaupyti? ──────────────────────────────────────

const A_TAUPYMAS = [
  {
    klausimas: 'Kiekvieną savaitę sutaupoma po 2 Eur. Kiek bus sutaupyta per 4 savaites?',
    atsakymas: '8',
    atsakymasRodymui: '$8$ Eur',
    sprendimas: '$2 \\cdot 4 = 8$.',
  },
] as const

export const taupymas: Generatorius = () => suBandymais(kurkTaupyma, A_TAUPYMAS, 'taupymas')

function kurkTaupyma(): Uzdavinys | null {
  return variacija([
    // 1. Kiek sutaupys per savaites
    () => {
      const persavaite = atsitiktinis(2, 6)
      const savaiciu = atsitiktinis(3, 8)
      return uzdavinys('taupymas', {
        klausimas: `Kiekvieną savaitę sutaupoma po ${persavaite} Eur. Kiek eurų bus sutaupyta per ${savaiciu} savaites?`,
        atsakymas: String(persavaite * savaiciu),
        atsakymasRodymui: `$${persavaite * savaiciu}$ Eur`,
        sprendimas: `$${persavaite} \\cdot ${savaiciu} = ${persavaite * savaiciu}$.`,
      })
    },

    // 2. Kiek galima atidėti
    () => {
      const turi = atsitiktinis(10, 30)
      const isleido = atsitiktinis(3, turi - 3)
      return uzdavinys('taupymas', {
        klausimas: `Turima ${turi} ${derink(
          turi,
          EURU,
        )}, o išleista ${isleido} Eur. Kiek eurų galima atidėti taupyklei?`,
        atsakymas: String(turi - isleido),
        atsakymasRodymui: `$${turi - isleido}$ Eur`,
        sprendimas: `$${turi} - ${isleido} = ${turi - isleido}$.`,
      })
    },

    // 3. Po kiek savaičių užteks
    () => {
      const turi = atsitiktinis(10, 25)
      const persavaite = atsitiktinis(2, 5)
      const savaiciu = atsitiktinis(3, 8)
      const kaina = turi + persavaite * savaiciu
      return uzdavinys('taupymas', {
        klausimas: `Turima ${turi} Eur, o daiktas kainuoja ${kaina} Eur. Kas savaitę sutaupoma po ${persavaite} Eur. Po kiek savaičių užteks pinigų?`,
        atsakymas: String(savaiciu),
        atsakymasRodymui: `$${savaiciu}$`,
        sprendimas: `Trūksta $${kaina} - ${turi} = ${
          kaina - turi
        }$ Eur, tad $${kaina - turi} : ${persavaite} = ${savaiciu}$ savaitės.`,
      })
    },

    // 4. Du taupymo planai
    () => {
      const a = atsitiktinis(3, 6)
      const b = atsitiktinis(2, 5)
      const priedas = atsitiktinis(4, 10)
      const planA = a * 4
      const planB = b * 4 + priedas
      if (planA === planB) return null
      return pasirinkimoUzdavinys(naujasId('taupymas'), 'taupymas', {
        klausimas: `Kuris taupymo planas per 4 savaites duoda daugiau: A — po ${a} Eur per savaitę ar B — po ${b} Eur per savaitę ir dar ${priedas} Eur mėnesio pabaigoje?`,
        variantai: planA > planB ? ['A', 'B', 'planai vienodi'] : ['B', 'A', 'planai vienodi'],
        teisingas: 0,
        sprendimas: `A duoda $${a} \\cdot 4 = ${planA}$ Eur, B — $${b} \\cdot 4 + ${priedas} = ${planB}$ Eur.`,
      })
    },

    // 5. Kuris pasirinkimas taupesnis
    () =>
      pasirinkimoUzdavinys(naujasId('taupymas'), 'taupymas', {
        klausimas: 'Kuris pasirinkimas padeda taupyti labiau?',
        variantai: [
          'nusipirkti vieną ledą vietoj dviejų',
          'nusipirkti du ledus vietoj vieno',
          'nusipirkti tris ledus',
        ],
        teisingas: 0,
        sprendimas: 'Kuo mažiau išleidžiama, tuo daugiau lieka sutaupyti.',
      }),

    // 6. Klaidingas teiginys apie taupymą
    () =>
      pasirinkimoUzdavinys(naujasId('taupymas'), 'taupymas', {
        klausimas: 'Mokinys sako, kad taupyti reiškia visai nieko nepirkti. Kur klaida?',
        variantai: [
          'taupoma planuojant pirkinius, o būtinus dalykus vis tiek reikia pirkti',
          'iš tikrųjų taupant negalima pirkti nieko',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Taupymas yra pinigų planavimas, o ne visiškas atsisakymas pirkti.',
      }),

    // 7. Per du mėnesius
    () => {
      const persavaite = atsitiktinis(2, 6)
      return uzdavinys('taupymas', {
        klausimas: `Kas savaitę sutaupoma po ${persavaite} Eur. Kiek eurų bus sutaupyta per 2 mėnesius, jei mėnuo — 4 savaitės?`,
        atsakymas: String(persavaite * 8),
        atsakymasRodymui: `$${persavaite * 8}$ Eur`,
        sprendimas: `Savaičių $4 \\cdot 2 = 8$, tad $${persavaite} \\cdot 8 = ${persavaite * 8}$.`,
      })
    },
  ])
}

// ── 6.7 Kas sudaro paslaugos kainą? ─────────────────────────────────────────

const PASLAUGOS = [
  { vardas: 'Kirpimas', min: 8, max: 18 },
  { vardas: 'Batų taisymas', min: 5, max: 14 },
  { vardas: 'Dviračio remontas', min: 10, max: 25 },
  { vardas: 'Plaukų plovimas', min: 3, max: 8 },
  { vardas: 'Nuotraukų spausdinimas', min: 2, max: 9 },
] as const

const A_PASLAUGA = [
  {
    klausimas: 'Kirpimas kainuoja 11 Eur, plaukų plovimas — 4 Eur. Kiek kainuos abi paslaugos kartu?',
    atsakymas: '15',
    atsakymasRodymui: '$15$ Eur',
    sprendimas: '$11 + 4 = 15$.',
  },
] as const

export const paslaugosKaina: Generatorius = () =>
  suBandymais(kurkPaslauga, A_PASLAUGA, 'paslaugos-kaina')

function kurkPaslauga(): Uzdavinys | null {
  const trys = sumaisyk([...PASLAUGOS]).slice(0, 3)
  const kainos = trys.map((p) => atsitiktinis(p.min, p.max))

  return variacija([
    // 1. Dviejų paslaugų suma
    () =>
      uzdavinys('paslaugos-kaina', {
        // Kainos yra tik kainoraštyje — jas reikia susirasti.
        klausimas: `Kiek kartu kainuoja „${trys[0].vardas}“ ir „${trys[1].vardas}“?`,
        atsakymas: String(kainos[0] + kainos[1]),
        atsakymasRodymui: `$${kainos[0] + kainos[1]}$ Eur`,
        sprendimas: `$${kainos[0]} + ${kainos[1]} = ${kainos[0] + kainos[1]}$.`,
        brezinys: kainuEtiketes(trys.map((p, i) => ({ pavadinimas: p.vardas, kaina: kainos[i] }))),
      }),

    // 2. Kas yra paslauga
    () =>
      pasirinkimoUzdavinys(naujasId('paslaugos-kaina'), 'paslaugos-kaina', {
        klausimas: 'Kas yra paslauga?',
        variantai: [
          'kito žmogaus atliktas darbas, už kurį mokama',
          'daiktas, kurį galima parsinešti namo',
          'pinigai, gaunami parduotuvėje',
        ],
        teisingas: 0,
        sprendimas: 'Paslaugą galima gauti, bet negalima paimti į rankas kaip daikto.',
      }),

    // 3. Kas sudaro paslaugos kainą
    () =>
      pasirinkimoUzdavinys(naujasId('paslaugos-kaina'), 'paslaugos-kaina', {
        klausimas: 'Kas sudaro paslaugos kainą?',
        variantai: [
          'darbuotojo laikas ir naudotos priemonės',
          'tik parduotuvės adresas',
          'tik prekės svoris',
        ],
        teisingas: 0,
        sprendimas: 'Į kainą įskaičiuojamas ir darbas, ir sunaudotos priemonės.',
      }),

    // 4. Kuri paslauga brangesnė
    () => {
      if (kainos[0] === kainos[2]) return null
      return pasirinkimoUzdavinys(naujasId('paslaugos-kaina'), 'paslaugos-kaina', {
        klausimas: `Kuri paslauga kainoraštyje brangesnė: „${trys[0].vardas}“ ar „${trys[2].vardas}“?`,
        variantai:
          kainos[0] > kainos[2]
            ? [trys[0].vardas, trys[2].vardas, 'kainos vienodos']
            : [trys[2].vardas, trys[0].vardas, 'kainos vienodos'],
        teisingas: 0,
        sprendimas: `Kainos yra ${kainos[0]} Eur ir ${kainos[2]} Eur.`,
        brezinys: kainuEtiketes(trys.map((p, i) => ({ pavadinimas: p.vardas, kaina: kainos[i] }))),
      })
    },

    // 5. Kiek kainuos kelis kartus
    () => {
      const kartu = atsitiktinis(2, 4)
      return uzdavinys('paslaugos-kaina', {
        klausimas: `Viena „${trys[0].vardas}“ paslauga kainuoja ${kainos[0]} Eur. Kiek kainuos ${kartu} tokios paslaugos?`,
        atsakymas: String(kainos[0] * kartu),
        atsakymasRodymui: `$${kainos[0] * kartu}$ Eur`,
        sprendimas: `$${kainos[0]} \\cdot ${kartu} = ${kainos[0] * kartu}$.`,
      })
    },

    // 6. Visų trijų suma
    () => {
      const viso = kainos.reduce((s, x) => s + x, 0)
      return uzdavinys('paslaugos-kaina', {
        klausimas: 'Kiek kainuotų visos trys kainoraštyje nurodytos paslaugos kartu?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$ Eur`,
        sprendimas: `$${kainos.join(' + ')} = ${viso}$.`,
        brezinys: kainuEtiketes(trys.map((p, i) => ({ pavadinimas: p.vardas, kaina: kainos[i] }))),
      })
    },

    // 7. Kodėl kainos skiriasi
    () =>
      pasirinkimoUzdavinys(naujasId('paslaugos-kaina'), 'paslaugos-kaina', {
        klausimas: 'Kodėl ta pati paslauga skirtingose vietose gali kainuoti nevienodai?',
        variantai: [
          'skiriasi darbo trukmė, priemonės ir vietos išlaidos',
          'paslaugų kainos visur privalo sutapti',
          'kaina priklauso tik nuo savaitės dienos',
        ],
        teisingas: 0,
        sprendimas: 'Kaina susideda iš skirtingų dalių, tad skirtingose vietose ji gali skirtis.',
      }),

    // 8. Rikiavimas pagal kainą
    () => {
      if (new Set(kainos).size < 3) return null
      const suKaina = trys.map((p, i) => ({ vardas: p.vardas, kaina: kainos[i] }))
      return eiliskumoUzdavinys(naujasId('paslaugos-kaina'), 'paslaugos-kaina', {
        klausimas: 'Surikiuok kainoraščio paslaugas nuo pigiausios iki brangiausios.',
        teisingaEile: [...suKaina].sort((a, b) => a.kaina - b.kaina).map((x) => x.vardas),
        sprendimas: 'Lyginamos kainoraštyje užrašytos kainos.',
        brezinys: kainuEtiketes(suKaina.map((p) => ({ pavadinimas: p.vardas, kaina: p.kaina }))),
      })
    },
  ])
}
