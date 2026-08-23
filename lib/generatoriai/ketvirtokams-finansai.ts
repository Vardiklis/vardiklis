import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { D, VARDAI, eurais, eurais10, kiek } from './ketvirtokams-bendra'
import { kainuLentele } from './ketvirtokams-trupmenu-vaizdai'
import { duomenuLentele } from './treciokams-algebros-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Finansiniai sprendimai“ — dešimt potemių.
 *
 * Anksčiau jos rėmėsi `pinigai`, `procentai` ir `proporcijos` generatoriais:
 * ketvirtokui tekdavo skaičiuoti nuolaidos procentą ir sudėtines palūkanas.
 *
 * Tema turi savitą sunkumą: teisingas atsakymas dažnai yra ne skaičius, o
 * pasirinkimas — kuris variantas pigesnis, ar užteks pinigų, per kiek mėnesių
 * bus sutaupyta. Todėl čia daug pasirenkamojo atsakymo uždavinių, o kiekvienas
 * jų sprendimas remiasi konkrečiu skaičiavimu, o ne nuojauta.
 */

const PREKES = [
  'Sultys',
  'Sumuštinis',
  'Duona',
  'Sūris',
  'Jogurtas',
  'Sausainiai',
  'Obuoliai',
  'Pienas',
] as const

const ISLAIDOS = ['Maistas', 'Transportas', 'Būrelis', 'Knygos', 'Žaidimai', 'Dovanos'] as const

// ── 8.1 Dešimtaine užrašyta pinigų suma ─────────────────────────────────────

const T1 = 'pinigu-suma-desimtaine'

const A_SUMA = [
  {
    klausimas: 'Kiek centų yra $3{,}50$ Eur?',
    atsakymas: '350',
    atsakymasRodymui: '$350$ ct',
    sprendimas: '3 eurai yra 300 centų, ir dar 50 centų.',
  },
] as const

export const piniguSumaDesimtaine: Generatorius = () => suBandymais(kurkSuma, A_SUMA, T1)

function kurkSuma(): Uzdavinys | null {
  const centai = atsitiktinis(105, 990)

  return variacija([
    // 1. Į centus
    () =>
      uzdavinys(T1, {
        klausimas: `Kiek centų yra $${eurais(centai)}$ Eur?`,
        atsakymas: String(centai),
        atsakymasRodymui: `$${centai}$ ct`,
        sprendimas: `${Math.floor(centai / 100)} eurai yra ${Math.floor(centai / 100) * 100} centų, ir dar ${centai % 100}.`,
      }),

    // 2. Iš centų į eurus
    () =>
      uzdavinys(T1, {
        klausimas: `Užrašyk ${centai} centus eurais.`,
        atsakymas: eurais10(centai),
        atsakymasRodymui: `$${eurais(centai)}$ Eur`,
        sprendimas: 'Kas 100 centų sudaro vieną eurą; likusieji rašomi po kablelio.',
      }),

    // 3. Iš eurų ir centų
    () => {
      const eur = atsitiktinis(1, 9)
      const ct = atsitiktinis(1, 9) * 5
      return uzdavinys(T1, {
        klausimas: `Užrašyk dešimtainiu skaičiumi: ${kiek(eur, D.eurai)} ${kiek(ct, D.centai)}.`,
        atsakymas: eurais10(eur * 100 + ct),
        atsakymasRodymui: `$${eurais(eur * 100 + ct)}$ Eur`,
        sprendimas: 'Prieš kablelį rašomi eurai, po kablelio — centai dviem skaitmenimis.',
      })
    },

    // 4. Ką reiškia skaitmuo po kablelio
    () => {
      const eur = atsitiktinis(2, 9)
      const ct = atsitiktinis(11, 95)
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Ką reiškia skaičiai po kablelio sumoje $${eurais(eur * 100 + ct)}$ Eur?`,
        variantai: [`${ct} centus`, `${ct} eurus`, `${ct} litus`, 'nieko — tai tik atskyrimo ženklas'],
        teisingas: 0,
        sprendimas: 'Po kablelio rašoma euro dalis — centai.',
      })
    },

    // 5. Palyginimas
    () => {
      const kitas = centai + pasirink([-40, -25, 25, 40])
      if (kitas <= 0) return null
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Kuri suma didesnė: $${eurais(centai)}$ Eur ar $${eurais(kitas)}$ Eur?`,
        variantai:
          centai > kitas
            ? [`$${eurais(centai)}$ Eur`, `$${eurais(kitas)}$ Eur`, 'sumos lygios']
            : [`$${eurais(kitas)}$ Eur`, `$${eurais(centai)}$ Eur`, 'sumos lygios'],
        teisingas: 0,
        sprendimas: 'Pirmiausia lyginami eurai, ir tik jiems sutapus — centai.',
      })
    },

    // 6. Klaidos radimas
    () => {
      const eur = atsitiktinis(2, 9)
      const ct = atsitiktinis(1, 9)
      return uzdavinys(T1, {
        klausimas: `Sumą „${eur} eurai ${ct} centai“ mokinys užrašė $${eur}{,}${ct}$ Eur. Užrašyk teisingai.`,
        atsakymas: eurais10(eur * 100 + ct),
        atsakymasRodymui: `$${eurais(eur * 100 + ct)}$ Eur`,
        sprendimas: `Po kablelio visada rašomi du skaitmenys: $${eur}{,}${ct}$ reikštų ${ct * 10} centų, o ne ${ct}.`,
      })
    },

    // 7. Kiek eurų ir kiek centų
    () =>
      uzdavinys(T1, {
        klausimas: `Kiek pilnų eurų yra sumoje $${eurais(centai)}$ Eur?`,
        atsakymas: String(Math.floor(centai / 100)),
        atsakymasRodymui: `$${Math.floor(centai / 100)}$ Eur`,
        sprendimas: `Skaičius prieš kablelį rodo pilnus eurus, o po kablelio lieka ${centai % 100} ct.`,
      }),
  ])
}

// ── 8.2 Prekių ir paslaugų kainų palyginimas ────────────────────────────────

const T2 = 'kainu-palyginimas'

const A_KAINU_PALYGINIMAS = [
  {
    klausimas: 'Kuri kaina mažesnė: $1{,}99$ Eur ar $2{,}05$ Eur?',
    atsakymas: 'a',
    atsakymasRodymui: '$1{,}99$ Eur',
    sprendimas: 'Vienas euras yra mažiau nei du.',
  },
] as const

export const kainuPalyginimas: Generatorius = () =>
  suBandymais(kurkKainuPalyginima, A_KAINU_PALYGINIMAS, T2)

function kurkKainuPalyginima(): Uzdavinys | null {
  return variacija([
    // 1. Dvi kainos abipus euro ribos
    () => {
      const riba = atsitiktinis(2, 8) * 100
      const a = riba - atsitiktinis(1, 9)
      const b = riba + atsitiktinis(1, 9)
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuri kaina mažesnė: $${eurais(a)}$ Eur ar $${eurais(b)}$ Eur?`,
        variantai: [`$${eurais(a)}$ Eur`, `$${eurais(b)}$ Eur`, 'kainos vienodos'],
        teisingas: 0,
        sprendimas: `$${eurais(a)}$ dar nesiekia ${riba / 100} eurų, o $${eurais(b)}$ jau viršija.`,
      })
    },

    // 2. Vieneto kaina
    () => {
      const n1 = atsitiktinis(2, 5)
      const vieneto1 = atsitiktinis(40, 150)
      const n2 = n1 + atsitiktinis(1, 3)
      const vieneto2 = vieneto1 + pasirink([-20, -10, 10, 20])
      if (vieneto2 <= 0 || vieneto1 === vieneto2) return null
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kur vienas jogurtas pigesnis: ${n1} vnt. pakuotėje už $${eurais(n1 * vieneto1)}$ Eur ar ${n2} vnt. pakuotėje už $${eurais(n2 * vieneto2)}$ Eur?`,
        variantai:
          vieneto1 < vieneto2
            ? [`${n1} vnt. pakuotėje`, `${n2} vnt. pakuotėje`, 'vieneto kaina vienoda']
            : [`${n2} vnt. pakuotėje`, `${n1} vnt. pakuotėje`, 'vieneto kaina vienoda'],
        teisingas: 0,
        sprendimas: `Vieneto kainos: $${eurais(vieneto1)}$ Eur ir $${eurais(vieneto2)}$ Eur.`,
      })
    },

    // 3. Rikiavimas
    () => {
      const trys = sumaisyk([atsitiktinis(105, 295), atsitiktinis(305, 495), atsitiktinis(505, 795)])
      const eile = [...trys].sort((a, b) => a - b)
      return eiliskumoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Surikiuok kainas nuo mažiausios iki didžiausios.',
        teisingaEile: eile.map((c) => `$${eurais(c)}$ Eur`),
        sprendimas: 'Pirmiausia lyginami eurai, paskui centai.',
      })
    },

    // 4. Kiek pigiau
    () => {
      const a = atsitiktinis(205, 890)
      const b = a - atsitiktinis(35, 180)
      if (b <= 0) return null
      return uzdavinys(T2, {
        klausimas: `Vienoje parduotuvėje prekė kainuoja $${eurais(a)}$ Eur, kitoje — $${eurais(b)}$ Eur. Keliais centais ji pigesnė antroje parduotuvėje?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ ct`,
        sprendimas: `$${eurais(a)} - ${eurais(b)} = ${eurais(a - b)}$ Eur, tai yra ${a - b} centai.`,
      })
    },

    // 5. Pigiausia iš lentelės
    () => {
      const prekes = sumaisyk([...PREKES]).slice(0, 4)
      const kainos = [atsitiktinis(80, 190), atsitiktinis(200, 390), atsitiktinis(400, 590), atsitiktinis(600, 890)]
      const sumaisytos = sumaisyk(kainos)
      const maziausia = Math.min(...sumaisytos)
      return uzdavinys(T2, {
        klausimas: 'Kokia yra pigiausios lentelėje esančios prekės kaina?',
        atsakymas: eurais10(maziausia),
        atsakymasRodymui: `$${eurais(maziausia)}$ Eur`,
        sprendimas: `Mažiausia iš pateiktų kainų yra $${eurais(maziausia)}$ Eur.`,
        brezinys: kainuLentele(prekes.map((p, i) => ({ pavadinimas: p, centai: sumaisytos[i] }))),
      })
    },

    // 6. Ar galima palyginti
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kodėl prieš lyginant dviejų pakuočių kainas patogu apskaičiuoti vieneto kainą?',
        variantai: [
          'nes pakuotėse gali būti skirtingas prekių skaičius',
          'nes taip skaičiai tampa mažesni',
          'nes vieneto kaina visada apvali',
          'nes to reikalauja parduotuvė',
        ],
        teisingas: 0,
        sprendimas: 'Didesnė pakuotė kainuoja daugiau, bet vienas vienetas joje gali būti pigesnis.',
      }),

    // 7. Klaidos radimas
    () => {
      const a = atsitiktinis(150, 480)
      const b = atsitiktinis(150, 480)
      if (a === b) return null
      return uzdavinys(T2, {
        klausimas: `Mokinys teigia, kad $${eurais(Math.min(a, b))}$ Eur yra didesnė kaina nei $${eurais(Math.max(a, b))}$ Eur, „nes centų daugiau“. Užrašyk didesnę kainą.`,
        atsakymas: eurais10(Math.max(a, b)),
        atsakymasRodymui: `$${eurais(Math.max(a, b))}$ Eur`,
        sprendimas: 'Pirmiausia lyginami eurai; centai lemia tik tada, kai eurų skaičius vienodas.',
      })
    },
  ])
}

// ── 8.3 Bendra pirkinio kaina ───────────────────────────────────────────────

const T3 = 'bendra-pirkinio-kaina'

const A_BENDRA = [
  {
    klausimas: 'Kiek kainuoja 2 duonos kepalai po $1{,}15$ Eur ir vienas sūris už $3{,}75$ Eur?',
    atsakymas: '6.05',
    atsakymasRodymui: '$6{,}05$ Eur',
    sprendimas: '$115 \\cdot 2 + 375 = 605$ centai.',
  },
] as const

export const bendraPirkinioKaina: Generatorius = () => suBandymais(kurkBendra, A_BENDRA, T3)

function kurkBendra(): Uzdavinys | null {
  return variacija([
    // 1. Dvi prekės
    () => {
      const a = atsitiktinis(105, 590)
      const b = atsitiktinis(105, 490)
      return uzdavinys(T3, {
        klausimas: `Kiek kainuoja pirkinys, jei viena prekė kainuoja $${eurais(a)}$ Eur, o kita — $${eurais(b)}$ Eur?`,
        atsakymas: eurais10(a + b),
        atsakymasRodymui: `$${eurais(a + b)}$ Eur`,
        sprendimas: `$${eurais(a)} + ${eurais(b)} = ${eurais(a + b)}$.`,
      })
    },

    // 2. Kelios vienodos ir viena atskira
    () => {
      const n = atsitiktinis(2, 5)
      const vieneto = atsitiktinis(80, 250)
      const atskira = atsitiktinis(200, 590)
      return uzdavinys(T3, {
        klausimas: `Nupirkti ${n} kepalai po $${eurais(vieneto)}$ Eur ir vienas sūris už $${eurais(atskira)}$ Eur. Kiek sumokėta?`,
        atsakymas: eurais10(n * vieneto + atskira),
        atsakymasRodymui: `$${eurais(n * vieneto + atskira)}$ Eur`,
        sprendimas: `$${vieneto} \\cdot ${n} + ${atskira} = ${n * vieneto + atskira}$ centai.`,
      })
    },

    // 3. Trys prekės iš lentelės
    () => {
      const prekes = sumaisyk([...PREKES]).slice(0, 3)
      const kainos = [atsitiktinis(105, 295), atsitiktinis(305, 595), atsitiktinis(105, 195)]
      const viso = kainos.reduce((s, k) => s + k, 0)
      return uzdavinys(T3, {
        klausimas: 'Kiek kainuoja visos lentelėje išvardytos prekės?',
        atsakymas: eurais10(viso),
        atsakymasRodymui: `$${eurais(viso)}$ Eur`,
        sprendimas: `$${kainos.map((k) => eurais(k)).join(' + ')} = ${eurais(viso)}$.`,
        brezinys: kainuLentele(prekes.map((p, i) => ({ pavadinimas: p, centai: kainos[i] }))),
      })
    },

    // 4. Kiek reikia sumokėti už kelias vienodas
    () => {
      const n = atsitiktinis(3, 8)
      const vieneto = atsitiktinis(45, 180)
      return uzdavinys(T3, {
        klausimas: `Kiek kainuoja ${n} vienodi batonėliai po $${eurais(vieneto)}$ Eur?`,
        atsakymas: eurais10(n * vieneto),
        atsakymasRodymui: `$${eurais(n * vieneto)}$ Eur`,
        sprendimas: `$${vieneto} \\cdot ${n} = ${n * vieneto}$ centai.`,
      })
    },

    // 5. Ar užteks pinigų
    () => {
      const turima = atsitiktinis(5, 20) * 100
      const a = atsitiktinis(105, 590)
      const b = atsitiktinis(105, 590)
      const c = atsitiktinis(105, 590)
      if (a + b + c === turima) return null
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Turima ${turima / 100} Eur. Prekės kainuoja $${eurais(a)}$, $${eurais(b)}$ ir $${eurais(c)}$ Eur. Ar užteks pinigų?`,
        variantai:
          a + b + c <= turima
            ? [`taip, iš viso reikia $${eurais(a + b + c)}$ Eur`, `ne, trūksta pinigų`, 'sumos lygios']
            : [`ne, reikia $${eurais(a + b + c)}$ Eur`, `taip, pinigų užtenka`, 'sumos lygios'],
        teisingas: 0,
        sprendimas: `$${eurais(a)} + ${eurais(b)} + ${eurais(c)} = ${eurais(a + b + c)}$ Eur.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const n = atsitiktinis(3, 6)
      const vieneto = atsitiktinis(110, 240)
      const klaidingas = vieneto + (n - 1) * 100
      return uzdavinys(T3, {
        klausimas: `Uždavinys: „${n} sąsiuviniai po $${eurais(vieneto)}$ Eur.“ Mokinys gavo $${eurais(klaidingas)}$ Eur. Užrašyk teisingą kainą.`,
        atsakymas: eurais10(n * vieneto),
        atsakymasRodymui: `$${eurais(n * vieneto)}$ Eur`,
        sprendimas: `Dauginami ir eurai, ir centai: $${vieneto} \\cdot ${n} = ${n * vieneto}$ centai.`,
      })
    },

    // 7. Dviejų rūšių prekės
    () => {
      const n1 = atsitiktinis(2, 5)
      const k1 = atsitiktinis(60, 190)
      const n2 = atsitiktinis(2, 5)
      const k2 = atsitiktinis(60, 190)
      return uzdavinys(T3, {
        klausimas: `Nupirkta ${n1} obuoliai po $${eurais(k1)}$ Eur ir ${n2} jogurtai po $${eurais(k2)}$ Eur. Kiek sumokėta iš viso?`,
        atsakymas: eurais10(n1 * k1 + n2 * k2),
        atsakymasRodymui: `$${eurais(n1 * k1 + n2 * k2)}$ Eur`,
        sprendimas: `$${eurais(n1 * k1)} + ${eurais(n2 * k2)} = ${eurais(n1 * k1 + n2 * k2)}$.`,
      })
    },
  ])
}

// ── 8.4 Kainos pokytis ──────────────────────────────────────────────────────

const T4 = 'kainos-pokytis'

const A_POKYTIS = [
  {
    klausimas: 'Prekė kainavo $4{,}50$ Eur, o dabar kainuoja $3{,}80$ Eur. Kiek ji atpigo?',
    atsakymas: '0.70',
    atsakymasRodymui: '$0{,}70$ Eur',
    sprendimas: '$450 - 380 = 70$ centų.',
  },
] as const

export const kainosPokytis: Generatorius = () => suBandymais(kurkPokyti, A_POKYTIS, T4)

function kurkPokyti(): Uzdavinys | null {
  const buvo = atsitiktinis(205, 890)
  const pokytis = atsitiktinis(25, 180)

  return variacija([
    // 1. Kiek atpigo
    () =>
      uzdavinys(T4, {
        klausimas: `Prekė kainavo $${eurais(buvo)}$ Eur, o dabar — $${eurais(buvo - pokytis)}$ Eur. Kiek ji atpigo?`,
        atsakymas: eurais10(pokytis),
        atsakymasRodymui: `$${eurais(pokytis)}$ Eur`,
        sprendimas: `$${eurais(buvo)} - ${eurais(buvo - pokytis)} = ${eurais(pokytis)}$.`,
      }),

    // 2. Kiek pabrango
    () =>
      uzdavinys(T4, {
        klausimas: `Prekė kainavo $${eurais(buvo)}$ Eur, o dabar — $${eurais(buvo + pokytis)}$ Eur. Kiek ji pabrango?`,
        atsakymas: eurais10(pokytis),
        atsakymasRodymui: `$${eurais(pokytis)}$ Eur`,
        sprendimas: `$${eurais(buvo + pokytis)} - ${eurais(buvo)} = ${eurais(pokytis)}$.`,
      }),

    // 3. Nauja kaina po nuolaidos
    () =>
      uzdavinys(T4, {
        klausimas: `Prekė kainavo $${eurais(buvo)}$ Eur ir atpigo $${eurais(pokytis)}$ Eur. Kiek ji kainuoja dabar?`,
        atsakymas: eurais10(buvo - pokytis),
        atsakymasRodymui: `$${eurais(buvo - pokytis)}$ Eur`,
        sprendimas: `$${eurais(buvo)} - ${eurais(pokytis)} = ${eurais(buvo - pokytis)}$.`,
      }),

    // 4. Senoji kaina
    () =>
      uzdavinys(T4, {
        klausimas: `Po $${eurais(pokytis)}$ Eur nuolaidos prekė kainuoja $${eurais(buvo)}$ Eur. Kiek ji kainavo anksčiau?`,
        atsakymas: eurais10(buvo + pokytis),
        atsakymasRodymui: `$${eurais(buvo + pokytis)}$ Eur`,
        sprendimas: `$${eurais(buvo)} + ${eurais(pokytis)} = ${eurais(buvo + pokytis)}$.`,
      }),

    // 5. Kuri prekė labiau atpigo
    () => {
      const buvo2 = atsitiktinis(205, 890)
      const pokytis2 = atsitiktinis(25, 180)
      if (pokytis === pokytis2) return null
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Pirma prekė atpigo nuo $${eurais(buvo)}$ iki $${eurais(buvo - pokytis)}$ Eur, antra — nuo $${eurais(buvo2)}$ iki $${eurais(buvo2 - pokytis2)}$ Eur. Kuri atpigo labiau?`,
        variantai:
          pokytis > pokytis2 ? ['pirma', 'antra', 'abi vienodai'] : ['antra', 'pirma', 'abi vienodai'],
        teisingas: 0,
        sprendimas: `Nuolaidos: $${eurais(pokytis)}$ Eur ir $${eurais(pokytis2)}$ Eur.`,
      })
    },

    // 6. Pokytis kelioms prekėms
    () => {
      const n = atsitiktinis(2, 6)
      return uzdavinys(T4, {
        klausimas: `Kiekviena prekė atpigo $${eurais(pokytis)}$ Eur. Kiek sutaupoma perkant ${n} tokias prekes?`,
        atsakymas: eurais10(n * pokytis),
        atsakymasRodymui: `$${eurais(n * pokytis)}$ Eur`,
        sprendimas: `$${pokytis} \\cdot ${n} = ${n * pokytis}$ centai.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Prekė kainavo $${eurais(buvo)}$ Eur, dabar — $${eurais(buvo - pokytis)}$ Eur. Mokinys teigia, kad ji atpigo $${eurais(buvo + pokytis)}$ Eur. Užrašyk teisingą pokytį.`,
        atsakymas: eurais10(pokytis),
        atsakymasRodymui: `$${eurais(pokytis)}$ Eur`,
        sprendimas: `Pokytis randamas atimant: $${eurais(buvo)} - ${eurais(buvo - pokytis)} = ${eurais(pokytis)}$.`,
      }),
  ])
}

// ── 8.5 Pajamos ir išlaidos ─────────────────────────────────────────────────

const T5 = 'pajamos-ir-islaidos'

const A_PAJAMOS = [
  {
    klausimas: 'Kas yra išlaidos?',
    atsakymas: 'a',
    atsakymasRodymui: 'pinigai, kurie išleidžiami',
    sprendimas: 'Pajamos — gaunami pinigai, išlaidos — išleidžiami.',
  },
] as const

export const pajamosIrIslaidos: Generatorius = () => suBandymais(kurkPajamas, A_PAJAMOS, T5)

function kurkPajamas(): Uzdavinys | null {
  const pajamos = atsitiktinis(20, 90)
  const straipsniai = sumaisyk([...ISLAIDOS]).slice(0, 3)
  const sumos = [atsitiktinis(4, 15), atsitiktinis(3, 12), atsitiktinis(2, 10)]
  const viso = sumos.reduce((s, x) => s + x, 0)

  return variacija([
    // 1. Kas yra pajamos ir išlaidos
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kas vadinama išlaidomis?',
        variantai: [
          'pinigai, kurie išleidžiami',
          'pinigai, kurie gaunami',
          'pinigai, kurie taupomi',
          'pinigų likutis mėnesio pabaigoje',
        ],
        teisingas: 0,
        sprendimas: 'Pajamos yra gaunami pinigai, išlaidos — išleidžiami, o jų skirtumas rodo, kiek lieka.',
      }),

    // 2. Bendros išlaidos iš lentelės
    () =>
      uzdavinys(T5, {
        klausimas: 'Kokios yra bendros lentelėje surašytos išlaidos?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$ Eur`,
        sprendimas: `$${sumos.join(' + ')} = ${viso}$.`,
        brezinys: duomenuLentele(
          ['Išlaidos', 'Eur'],
          straipsniai.map((s, i) => [s, String(sumos[i])]),
        ),
      }),

    // 3. Kiek lieka
    () => {
      if (viso >= pajamos) return null
      return uzdavinys(T5, {
        klausimas: `Pajamos per mėnesį — ${kiek(pajamos, D.eurai)}, o išlaidos — ${kiek(viso, D.eurai)}. Kiek pinigų lieka?`,
        atsakymas: String(pajamos - viso),
        atsakymasRodymui: `$${pajamos - viso}$ Eur`,
        sprendimas: `$${pajamos} - ${viso} = ${pajamos - viso}$.`,
      })
    },

    // 4. Kuri išlaida didžiausia
    () => {
      const didziausia = Math.max(...sumos)
      return uzdavinys(T5, {
        klausimas: 'Kuri išlaidų suma lentelėje didžiausia?',
        atsakymas: String(didziausia),
        atsakymasRodymui: `$${didziausia}$ Eur`,
        sprendimas: `Didžiausia iš ${sumos.join(', ')} yra ${didziausia}.`,
        brezinys: duomenuLentele(
          ['Išlaidos', 'Eur'],
          straipsniai.map((s, i) => [s, String(sumos[i])]),
        ),
      })
    },

    // 5. Ar pajamų užtenka
    () => {
      const islaidos = pajamos + pasirink([-12, -6, 6, 12])
      if (islaidos <= 0 || islaidos === pajamos) return null
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Pajamos — ${kiek(pajamos, D.eurai)}, išlaidos — ${kiek(islaidos, D.eurai)}. Ar pajamų užtenka išlaidoms padengti?`,
        variantai:
          pajamos >= islaidos
            ? [`taip, dar lieka ${pajamos - islaidos} Eur`, `ne, trūksta ${islaidos - pajamos} Eur`, 'sumos lygios']
            : [`ne, trūksta ${islaidos - pajamos} Eur`, `taip, dar lieka ${pajamos - islaidos} Eur`, 'sumos lygios'],
        teisingas: 0,
        sprendimas: `$${pajamos} - ${islaidos} = ${pajamos - islaidos}$.`,
      })
    },

    // 6. Susieti sąvokas
    () =>
      poruUzdavinys(naujasId(T5), T5, {
        klausimas: 'Susiek sąvoką su pavyzdžiu.',
        poros: [
          { kaire: 'pajamos', desine: 'gauta kišenpinigių' },
          { kaire: 'išlaidos', desine: 'nupirktas bilietas į kiną' },
          { kaire: 'likutis', desine: 'pinigai, likę mėnesio gale' },
        ],
        sprendimas: 'Likutis randamas iš pajamų atėmus išlaidas.',
      }),

    // 7. Kiek reikia pajamų
    () => {
      const noras = atsitiktinis(10, 40)
      return uzdavinys(T5, {
        klausimas: `Mėnesio išlaidos yra ${kiek(viso, D.eurai)}, o dar norima atidėti ${kiek(noras, D.eurus)}. Kiek pajamų reikia?`,
        atsakymas: String(viso + noras),
        atsakymasRodymui: `$${viso + noras}$ Eur`,
        sprendimas: `$${viso} + ${noras} = ${viso + noras}$.`,
      })
    },
  ])
}

// ── 8.6 Kiek pinigų liko ────────────────────────────────────────────────────

const T6 = 'kiek-pinigu-liko'

const A_LIKO = [
  {
    klausimas: 'Turėta 10 Eur, išleista $6{,}40$ Eur. Kiek liko?',
    atsakymas: '3.60',
    atsakymasRodymui: '$3{,}60$ Eur',
    sprendimas: '$1000 - 640 = 360$ centų.',
  },
] as const

export const kiekPiniguLiko: Generatorius = () => suBandymais(kurkLiko, A_LIKO, T6)

function kurkLiko(): Uzdavinys | null {
  const vardas = pasirink(VARDAI)
  const turejo = atsitiktinis(5, 20) * 100

  return variacija([
    // 1. Vienas pirkinys
    () => {
      const kaina = atsitiktinis(105, turejo - 50)
      return uzdavinys(T6, {
        klausimas: `${vardas} turėjo ${turejo / 100} Eur ir nupirko prekę už $${eurais(kaina)}$ Eur. Kiek pinigų liko?`,
        atsakymas: eurais10(turejo - kaina),
        atsakymasRodymui: `$${eurais(turejo - kaina)}$ Eur`,
        sprendimas: `$${turejo} - ${kaina} = ${turejo - kaina}$ centai.`,
      })
    },

    // 2. Du pirkiniai
    () => {
      const a = atsitiktinis(105, 395)
      const b = atsitiktinis(105, 395)
      if (a + b >= turejo) return null
      return uzdavinys(T6, {
        klausimas: `${vardas} turėjo ${turejo / 100} Eur. Nusipirko sulčių už $${eurais(a)}$ Eur ir sumuštinį už $${eurais(b)}$ Eur. Kiek liko?`,
        atsakymas: eurais10(turejo - a - b),
        atsakymasRodymui: `$${eurais(turejo - a - b)}$ Eur`,
        sprendimas: `Išleista $${eurais(a + b)}$ Eur, liko $${eurais(turejo - a - b)}$ Eur.`,
      })
    },

    // 3. Kelios vienodos prekės
    () => {
      const n = atsitiktinis(2, 5)
      const vieneto = atsitiktinis(80, 250)
      if (n * vieneto >= turejo) return null
      return uzdavinys(T6, {
        klausimas: `${vardas} turėjo ${turejo / 100} Eur ir nupirko ${n} batonėlius po $${eurais(vieneto)}$ Eur. Kiek liko?`,
        atsakymas: eurais10(turejo - n * vieneto),
        atsakymasRodymui: `$${eurais(turejo - n * vieneto)}$ Eur`,
        sprendimas: `Išleista $${vieneto} \\cdot ${n} = ${n * vieneto}$ centų, liko $${eurais(turejo - n * vieneto)}$ Eur.`,
      })
    },

    // 4. Grąža
    () => {
      const kaina = atsitiktinis(105, turejo - 50)
      return uzdavinys(T6, {
        klausimas: `Pirkinys kainavo $${eurais(kaina)}$ Eur, o kasoje paduota ${turejo / 100} Eur. Kokia bus grąža?`,
        atsakymas: eurais10(turejo - kaina),
        atsakymasRodymui: `$${eurais(turejo - kaina)}$ Eur`,
        sprendimas: `$${eurais(turejo)} - ${eurais(kaina)} = ${eurais(turejo - kaina)}$.`,
      })
    },

    // 5. Kiek trūksta
    () => {
      const kaina = turejo + atsitiktinis(50, 400)
      return uzdavinys(T6, {
        klausimas: `${vardas} turi ${turejo / 100} Eur, o prekė kainuoja $${eurais(kaina)}$ Eur. Kiek pinigų trūksta?`,
        atsakymas: eurais10(kaina - turejo),
        atsakymasRodymui: `$${eurais(kaina - turejo)}$ Eur`,
        sprendimas: `$${eurais(kaina)} - ${eurais(turejo)} = ${eurais(kaina - turejo)}$.`,
      })
    },

    // 6. Kiek turėjo iš pradžių
    () => {
      const isleista = atsitiktinis(205, 690)
      const liko = atsitiktinis(105, 490)
      return uzdavinys(T6, {
        klausimas: `Išleidus $${eurais(isleista)}$ Eur liko $${eurais(liko)}$ Eur. Kiek pinigų buvo iš pradžių?`,
        atsakymas: eurais10(isleista + liko),
        atsakymasRodymui: `$${eurais(isleista + liko)}$ Eur`,
        sprendimas: `$${eurais(isleista)} + ${eurais(liko)} = ${eurais(isleista + liko)}$.`,
      })
    },

    // 7. Klaidos radimas
    () => {
      const kaina = atsitiktinis(105, turejo - 100)
      const klaidingas = turejo - kaina + 100
      return uzdavinys(T6, {
        klausimas: `Turėta ${turejo / 100} Eur, išleista $${eurais(kaina)}$ Eur. Mokinys gavo, kad liko $${eurais(klaidingas)}$ Eur. Užrašyk teisingą likutį.`,
        atsakymas: eurais10(turejo - kaina),
        atsakymasRodymui: `$${eurais(turejo - kaina)}$ Eur`,
        sprendimas: `Skolinantis euras turėjo sumažėti vienetu: $${eurais(turejo)} - ${eurais(kaina)} = ${eurais(turejo - kaina)}$.`,
      })
    },
  ])
}

// ── 8.7 Taupymo planas ──────────────────────────────────────────────────────

const T7 = 'taupymo-planas'

const A_TAUPYMAS = [
  {
    klausimas: 'Kas savaitę atidedama 5 Eur. Per kiek savaičių bus sutaupyta 40 Eur?',
    atsakymas: '8',
    atsakymasRodymui: '$8$ savaitės',
    sprendimas: '$40 : 5 = 8$.',
  },
] as const

const SAVAITES = { vns: 'savaitė', dgs: 'savaitės', kilm: 'savaičių' }
const MENESIAI = { vns: 'mėnuo', dgs: 'mėnesiai', kilm: 'mėnesių' }

export const taupymoPlanas: Generatorius = () => suBandymais(kurkTaupyma, A_TAUPYMAS, T7)

function kurkTaupyma(): Uzdavinys | null {
  const vardas = pasirink(VARDAI)
  const perSavaite = atsitiktinis(2, 12)
  const savaiciu = atsitiktinis(4, 16)
  const tikslas = perSavaite * savaiciu

  return variacija([
    // 1. Per kiek savaičių
    () =>
      uzdavinys(T7, {
        klausimas: `${vardas} kas savaitę atideda ${kiek(perSavaite, D.eurus)}. Per kiek savaičių bus sutaupyta ${kiek(tikslas, D.eurai)}?`,
        atsakymas: String(savaiciu),
        atsakymasRodymui: `$${savaiciu}$ ${SAVAITES.dgs}`,
        sprendimas: `$${tikslas} : ${perSavaite} = ${savaiciu}$.`,
      }),

    // 2. Kiek bus sutaupyta
    () =>
      uzdavinys(T7, {
        klausimas: `Kas mėnesį atidedama ${kiek(perSavaite, D.eurus)}. Kiek bus sutaupyta per ${kiek(savaiciu, MENESIAI)}?`,
        atsakymas: String(tikslas),
        atsakymasRodymui: `$${tikslas}$ Eur`,
        sprendimas: `$${perSavaite} \\cdot ${savaiciu} = ${tikslas}$.`,
      }),

    // 3. Kiek reikia atidėti
    () =>
      uzdavinys(T7, {
        klausimas: `Norima per ${kiek(savaiciu, SAVAITES)} sutaupyti ${kiek(tikslas, D.eurai)}. Kiek reikia atidėti kas savaitę?`,
        atsakymas: String(perSavaite),
        atsakymasRodymui: `$${perSavaite}$ Eur`,
        sprendimas: `$${tikslas} : ${savaiciu} = ${perSavaite}$.`,
      }),

    // 4. Su pradine suma
    () => {
      const turi = atsitiktinis(5, 40)
      const kaina = turi + tikslas
      return uzdavinys(T7, {
        klausimas: `${vardas} jau turi ${kiek(turi, D.eurus)} ir kas savaitę atideda po ${perSavaite}. Per kiek savaičių jis surinks ${kiek(kaina, D.eurus)}?`,
        atsakymas: String(savaiciu),
        atsakymasRodymui: `$${savaiciu}$ ${SAVAITES.dgs}`,
        sprendimas: `Trūksta $${kaina} - ${turi} = ${tikslas}$ Eur, tad $${tikslas} : ${perSavaite} = ${savaiciu}$ savaitės.`,
      })
    },

    // 5. Kiek liks po pirkinio
    () => {
      const kaina = atsitiktinis(10, Math.max(11, tikslas - 5))
      if (kaina >= tikslas) return null
      return uzdavinys(T7, {
        klausimas: `Sutaupyta ${kiek(tikslas, D.eurai)}, o dovana kainuoja ${kiek(kaina, D.eurus)}. Kiek pinigų liks?`,
        atsakymas: String(tikslas - kaina),
        atsakymasRodymui: `$${tikslas - kaina}$ Eur`,
        sprendimas: `$${tikslas} - ${kaina} = ${tikslas - kaina}$.`,
      })
    },

    // 6. Kuris planas greitesnis
    () => {
      const kitas = perSavaite + pasirink([-2, -1, 1, 2])
      if (kitas <= 0 || kitas === perSavaite || tikslas % kitas !== 0) return null
      return pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Reikia sutaupyti ${kiek(tikslas, D.eurai)}. Kuris planas greitesnis: atidėti po ${perSavaite} Eur ar po ${kitas} Eur per savaitę?`,
        variantai:
          perSavaite > kitas
            ? [`po ${perSavaite} Eur`, `po ${kitas} Eur`, 'abu vienodai greiti']
            : [`po ${kitas} Eur`, `po ${perSavaite} Eur`, 'abu vienodai greiti'],
        teisingas: 0,
        sprendimas: `$${tikslas} : ${perSavaite} = ${savaiciu}$ savaitės ir $${tikslas} : ${kitas} = ${tikslas / kitas}$ savaitės.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Norint per ${kiek(savaiciu, SAVAITES)} sutaupyti ${kiek(tikslas, D.eurai)}, mokinys siūlo kas savaitę atidėti po $${tikslas} \\cdot ${savaiciu}$ Eur. Kiek iš tikrųjų reikia atidėti?`,
        atsakymas: String(perSavaite),
        atsakymasRodymui: `$${perSavaite}$ Eur`,
        sprendimas: `Tikslas dalijamas iš savaičių skaičiaus: $${tikslas} : ${savaiciu} = ${perSavaite}$ Eur.`,
      }),
  ])
}

// ── 8.8 Ar pirkinio kaina priimtina ─────────────────────────────────────────

const T8 = 'kainos-vertinimas'

const A_VERTINIMAS = [
  {
    klausimas: 'Sąsiuvinis kainuoja 12 Eur. Ar tokia kaina įprasta?',
    atsakymas: 'a',
    atsakymasRodymui: 'ne, sąsiuvinis paprastai kainuoja apie 1 Eur',
    sprendimas: 'Kainą verta palyginti su įprasta panašių prekių kaina.',
  },
] as const

export const kainosVertinimas: Generatorius = () => suBandymais(kurkVertinima, A_VERTINIMAS, T8)

function kurkVertinima(): Uzdavinys | null {
  return variacija([
    // 1. Ar kaina įprasta
    () => {
      const perDaug = atsitiktinis(10, 30)
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Sąsiuvinis kainuoja ${perDaug} Eur. Ar tokia kaina įprasta?`,
        variantai: [
          'ne, sąsiuvinis paprastai kainuoja apie 1 Eur',
          'taip, tokia kaina įprasta',
          'to įvertinti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Prieš perkant verta palyginti kainą su įprasta tokios prekės kaina.',
      })
    },

    // 2. Ar verta pirkti didesnę pakuotę
    () => {
      const n1 = atsitiktinis(2, 4)
      const vnt = atsitiktinis(60, 150)
      const n2 = n1 * 2
      const nuolaida = atsitiktinis(10, 30)
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Maža pakuotė: ${n1} vnt. už $${eurais(n1 * vnt)}$ Eur. Didelė: ${n2} vnt. už $${eurais(n2 * vnt - nuolaida)}$ Eur. Kuri naudingesnė, jei prekės reikia daug?`,
        variantai: [
          `didelė — vienas vienetas joje pigesnis`,
          `maža — ji kainuoja mažiau`,
          'abi vienodai naudingos',
        ],
        teisingas: 0,
        sprendimas: `Mažoje vieneto kaina $${eurais(vnt)}$ Eur, didelėje — $${eurais(Math.round((n2 * vnt - nuolaida) / n2))}$ Eur.`,
      })
    },

    // 3. Ar užtenka pinigų
    () => {
      const turima = atsitiktinis(5, 25)
      const kaina = atsitiktinis(105, 3000)
      if (kaina === turima * 100) return null
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Turima ${kiek(turima, D.eurai)}, o prekė kainuoja $${eurais(kaina)}$ Eur. Ar galima ją nusipirkti?`,
        variantai:
          kaina <= turima * 100
            ? ['taip, pinigų užtenka', `ne, trūksta $${eurais(kaina - turima * 100)}$ Eur`, 'sumos lygios']
            : [`ne, trūksta $${eurais(kaina - turima * 100)}$ Eur`, 'taip, pinigų užtenka', 'sumos lygios'],
        teisingas: 0,
        sprendimas: `Lyginama $${eurais(turima * 100)}$ Eur ir $${eurais(kaina)}$ Eur.`,
      })
    },

    // 4. Kiek kartų brangesnė
    () => {
      const pigi = atsitiktinis(2, 8)
      const kartai = atsitiktinis(2, 6)
      return uzdavinys(T8, {
        klausimas: `Viena kuprinė kainuoja ${kiek(pigi, D.eurai)}, kita — ${kiek(pigi * kartai, D.eurai)}. Kiek kartų antroji brangesnė?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$ kartus`,
        sprendimas: `$${pigi * kartai} : ${pigi} = ${kartai}$.`,
      })
    },

    // 5. Kiek liktų
    () => {
      const turima = atsitiktinis(10, 40)
      const kaina = atsitiktinis(105, turima * 100 - 50)
      return uzdavinys(T8, {
        klausimas: `Turima ${kiek(turima, D.eurai)}. Nusipirkus prekę už $${eurais(kaina)}$ Eur, kiek liktų?`,
        atsakymas: eurais10(turima * 100 - kaina),
        atsakymasRodymui: `$${eurais(turima * 100 - kaina)}$ Eur`,
        sprendimas: `$${eurais(turima * 100)} - ${eurais(kaina)} = ${eurais(turima * 100 - kaina)}$.`,
      })
    },

    // 6. Kaina ir kokybė
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuo remiantis sprendžiama, ar prekės kaina priimtina?',
        variantai: [
          'lyginant su įprasta tokios prekės kaina ir su turimais pinigais',
          'vien pagal tai, ar prekė patinka',
          'vien pagal parduotuvės pavadinimą',
          'vien pagal pakuotės dydį',
        ],
        teisingas: 0,
        sprendimas: 'Kaina vertinama dviem klausimais: ar ji įprasta ir ar jos pakanka turimiems pinigams.',
      }),

    // 7. Kiek prekių galima nupirkti
    () => {
      const turima = atsitiktinis(10, 40)
      const vnt = atsitiktinis(150, 400)
      return uzdavinys(T8, {
        klausimas: `Turima ${kiek(turima, D.eurai)}, viena prekė kainuoja $${eurais(vnt)}$ Eur. Kiek tokių prekių galima nupirkti?`,
        atsakymas: String(Math.floor((turima * 100) / vnt)),
        atsakymasRodymui: `$${Math.floor((turima * 100) / vnt)}$`,
        sprendimas: `$${turima * 100} : ${vnt}$ duoda ${Math.floor((turima * 100) / vnt)} (lieka ${(turima * 100) % vnt} ct, kurių prekei nepakanka).`,
      })
    },
  ])
}

// ── 8.9 Naudingesnis sprendimas ─────────────────────────────────────────────

const T9 = 'naudingesnis-sprendimas'

const A_NAUDINGESNIS = [
  {
    klausimas: 'Kuris pirkinys naudingesnis: 3 sultys po $1{,}20$ Eur ar 2 sultys po $1{,}85$ Eur?',
    atsakymas: 'a',
    atsakymasRodymui: '3 sultys po $1{,}20$ Eur — vienas buteliukas pigesnis',
    sprendimas: 'Lyginama vieno buteliuko kaina.',
  },
] as const

export const naudingesnisSprendimas: Generatorius = () =>
  suBandymais(kurkNaudingesni, A_NAUDINGESNIS, T9)

function kurkNaudingesni(): Uzdavinys | null {
  return variacija([
    // 1. Vieneto kaina
    () => {
      const n1 = atsitiktinis(2, 5)
      const v1 = atsitiktinis(60, 200)
      const n2 = n1 + atsitiktinis(1, 3)
      const v2 = v1 + pasirink([-25, -15, 15, 25])
      if (v2 <= 0 || v1 === v2) return null
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kuris pirkinys naudingesnis: ${n1} vnt. už $${eurais(n1 * v1)}$ Eur ar ${n2} vnt. už $${eurais(n2 * v2)}$ Eur?`,
        variantai:
          v1 < v2
            ? [`${n1} vnt. už $${eurais(n1 * v1)}$ Eur`, `${n2} vnt. už $${eurais(n2 * v2)}$ Eur`, 'vieneto kaina vienoda']
            : [`${n2} vnt. už $${eurais(n2 * v2)}$ Eur`, `${n1} vnt. už $${eurais(n1 * v1)}$ Eur`, 'vieneto kaina vienoda'],
        teisingas: 0,
        sprendimas: `Vieneto kainos: $${eurais(v1)}$ Eur ir $${eurais(v2)}$ Eur.`,
      })
    },

    // 2. Nuolaida ar dovana
    () => {
      const kaina = atsitiktinis(400, 900)
      const nuolaida = atsitiktinis(50, 150)
      const dovanosVerte = atsitiktinis(50, 150)
      if (nuolaida === dovanosVerte) return null
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Prekė kainuoja $${eurais(kaina)}$ Eur. Pirmoji parduotuvė duoda $${eurais(nuolaida)}$ Eur nuolaidą, antroji — dovaną, kurios vertė $${eurais(dovanosVerte)}$ Eur. Kuris pasiūlymas naudingesnis?`,
        variantai:
          nuolaida > dovanosVerte
            ? ['nuolaida', 'dovana', 'pasiūlymai lygiaverčiai']
            : ['dovana', 'nuolaida', 'pasiūlymai lygiaverčiai'],
        teisingas: 0,
        sprendimas: `Lyginamos vertės: $${eurais(nuolaida)}$ Eur ir $${eurais(dovanosVerte)}$ Eur.`,
      })
    },

    // 3. Kiek sutaupoma
    () => {
      const n = atsitiktinis(3, 8)
      const brangi = atsitiktinis(150, 400)
      const pigi = brangi - atsitiktinis(20, 90)
      return uzdavinys(T9, {
        klausimas: `Perkant ${n} vienetus po $${eurais(pigi)}$ Eur vietoj $${eurais(brangi)}$ Eur, kiek sutaupoma?`,
        atsakymas: eurais10(n * (brangi - pigi)),
        atsakymasRodymui: `$${eurais(n * (brangi - pigi))}$ Eur`,
        sprendimas: `Vienam vienetui sutaupoma $${eurais(brangi - pigi)}$ Eur, tad iš viso $${eurais(n * (brangi - pigi))}$ Eur.`,
      })
    },

    // 4. Kelionė autobusu ar dviračiu
    () => {
      const bilietas = atsitiktinis(80, 150)
      const kartai = atsitiktinis(8, 20)
      const menesinis = atsitiktinis(900, 1800)
      if (bilietas * kartai === menesinis) return null
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Vienas bilietas kainuoja $${eurais(bilietas)}$ Eur, o mėnesinis — $${eurais(menesinis)}$ Eur. Kas naudingiau, jei per mėnesį važiuojama ${kartai} kartus?`,
        variantai:
          bilietas * kartai < menesinis
            ? ['pavieniai bilietai', 'mėnesinis bilietas', 'kaina vienoda']
            : ['mėnesinis bilietas', 'pavieniai bilietai', 'kaina vienoda'],
        teisingas: 0,
        sprendimas: `Pavieniai bilietai kainuotų $${eurais(bilietas * kartai)}$ Eur, mėnesinis — $${eurais(menesinis)}$ Eur.`,
      })
    },

    // 5. Dvi pakuotės su lentele
    () => {
      const kainos = [atsitiktinis(180, 320), atsitiktinis(340, 620)]
      const kiekiai = [atsitiktinis(2, 4), atsitiktinis(5, 8)]
      const vnt = kainos.map((k, i) => Math.round(k / kiekiai[i]))
      if (vnt[0] === vnt[1]) return null
      const geresnis = vnt[0] < vnt[1] ? 0 : 1
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kurioje pakuotėje vienas jogurtas pigesnis: mažoje (${kiekiai[0]} vnt.) ar didelėje (${kiekiai[1]} vnt.)?`,
        variantai: geresnis === 0 ? ['mažoje', 'didelėje', 'vienodai'] : ['didelėje', 'mažoje', 'vienodai'],
        teisingas: 0,
        sprendimas: `Vieneto kainos apytiksliai $${eurais(vnt[0])}$ Eur ir $${eurais(vnt[1])}$ Eur.`,
        brezinys: kainuLentele([
          { pavadinimas: `Maža pakuotė (${kiekiai[0]} vnt.)`, centai: kainos[0] },
          { pavadinimas: `Didelė pakuotė (${kiekiai[1]} vnt.)`, centai: kainos[1] },
        ]),
      })
    },

    // 6. Klaidos radimas
    () => {
      const n1 = 2
      const v1 = atsitiktinis(150, 300)
      const n2 = 4
      const v2 = v1 - atsitiktinis(20, 60)
      return uzdavinys(T9, {
        klausimas: `Mokinys sako, kad ${n1} vnt. už $${eurais(n1 * v1)}$ Eur naudingiau nei ${n2} vnt. už $${eurais(n2 * v2)}$ Eur, „nes sumokama mažiau“. Kokia yra vieneto kaina naudingesniame pirkinyje?`,
        atsakymas: eurais10(v2),
        atsakymasRodymui: `$${eurais(v2)}$ Eur`,
        sprendimas: `Lyginti reikia ne bendrą sumą, o vieneto kainą: $${eurais(v1)}$ Eur ir $${eurais(v2)}$ Eur.`,
      })
    },

    // 7. Kada didelė pakuotė nenaudinga
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kada didelė pakuotė gali būti nenaudinga, net jei vieneto kaina joje mažesnė?',
        variantai: [
          'kai tiek prekės nereikia ir dalis lieka nepanaudota',
          'kai ji sunkesnė',
          'kai ji kitos spalvos',
          'niekada — didelė pakuotė visada naudingesnė',
        ],
        teisingas: 0,
        sprendimas: 'Sutaupoma tik tada, kai visa nupirkta prekė iš tikrųjų sunaudojama.',
      }),
  ])
}

// ── 8.10 Pasirinkimo pagrindimas skaičiavimais ──────────────────────────────

const T10 = 'pasirinkimo-pagrindimas'

const A_PAGRINDIMAS = [
  {
    klausimas: 'Kuo remiantis pagrindžiamas finansinis pasirinkimas?',
    atsakymas: 'a',
    atsakymasRodymui: 'abiejų variantų kainos apskaičiavimu',
    sprendimas: 'Palyginami skaičiai, o ne įspūdis.',
  },
] as const

export const pasirinkimoPagrindimas: Generatorius = () =>
  suBandymais(kurkPagrindima, A_PAGRINDIMAS, T10)

function kurkPagrindima(): Uzdavinys | null {
  return variacija([
    // 1. Kiek kainuotų kiekvienas variantas
    () => {
      const n = atsitiktinis(4, 10)
      const v1 = atsitiktinis(80, 200)
      const v2 = atsitiktinis(80, 200)
      if (v1 === v2) return null
      return uzdavinys(T10, {
        klausimas: `Reikia ${n} vienetų. Pirmoje parduotuvėje vienas kainuoja $${eurais(v1)}$ Eur, antroje — $${eurais(v2)}$ Eur. Kiek sutaupoma pasirinkus pigesnę?`,
        atsakymas: eurais10(n * Math.abs(v1 - v2)),
        atsakymasRodymui: `$${eurais(n * Math.abs(v1 - v2))}$ Eur`,
        sprendimas: `$${eurais(n * v1)}$ Eur ir $${eurais(n * v2)}$ Eur — skirtumas $${eurais(n * Math.abs(v1 - v2))}$ Eur.`,
      })
    },

    // 2. Kuo grindžiamas pasirinkimas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kaip skaičiavimais pagrindžiamas finansinis pasirinkimas?',
        variantai: [
          'apskaičiuojama abiejų variantų kaina ir palyginami skaičiai',
          'pasirenkamas variantas, kuris atrodo gražiau',
          'pasirenkamas tas, kurio skaičius mažesnis, neskaičiuojant kiekio',
          'klausiama pardavėjo nuomonės',
        ],
        teisingas: 0,
        sprendimas: 'Pagrindimas reiškia, kad nurodomas konkretus skaičius, o ne įspūdis.',
      }),

    // 3. Išvada iš dviejų skaičiavimų
    () => {
      const n = atsitiktinis(3, 8)
      const vnt = atsitiktinis(90, 220)
      const rinkinys = n * vnt - atsitiktinis(30, 120)
      if (rinkinys <= 0) return null
      return uzdavinys(T10, {
        klausimas: `${n} vienetai atskirai kainuoja po $${eurais(vnt)}$ Eur, o rinkinys su tiek pat vienetų — $${eurais(rinkinys)}$ Eur. Kiek sutaupoma perkant rinkinį?`,
        atsakymas: eurais10(n * vnt - rinkinys),
        atsakymasRodymui: `$${eurais(n * vnt - rinkinys)}$ Eur`,
        sprendimas: `$${eurais(n * vnt)} - ${eurais(rinkinys)} = ${eurais(n * vnt - rinkinys)}$.`,
      })
    },

    // 4. Kuris skaičiavimas pagrindžia teiginį
    () => {
      const n = atsitiktinis(3, 8)
      const vnt = atsitiktinis(100, 250)
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Teiginys: „${n} vienetai po $${eurais(vnt)}$ Eur kainuos daugiau nei ${n * vnt < 1000 ? 10 : 20} Eur.“ Kuris skaičiavimas jį patikrina?`,
        variantai: [
          `$${vnt} \\cdot ${n}$`,
          `$${vnt} + ${n}$`,
          `$${vnt} : ${n}$`,
          `$${n} - ${vnt}$`,
        ],
        teisingas: 0,
        sprendimas: `$${vnt} \\cdot ${n} = ${n * vnt}$ centai, tai yra $${eurais(n * vnt)}$ Eur.`,
      })
    },

    // 5. Ar išvada pagrįsta
    () => {
      const a = atsitiktinis(200, 500)
      const b = atsitiktinis(200, 500)
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Apskaičiuota, kad pirmas variantas kainuoja $${eurais(a)}$ Eur, antras — $${eurais(b)}$ Eur. Kuri išvada pagrįsta šiais skaičiais?`,
        variantai: [
          a < b ? 'pigesnis pirmas variantas' : 'pigesnis antras variantas',
          a < b ? 'pigesnis antras variantas' : 'pigesnis pirmas variantas',
          'abu variantai kainuoja vienodai',
        ],
        teisingas: 0,
        sprendimas: `$${eurais(Math.min(a, b))}$ Eur yra mažiau nei $${eurais(Math.max(a, b))}$ Eur.`,
      })
    },

    // 6. Trūkstamas skaičiavimas
    () => {
      const n1 = atsitiktinis(2, 5)
      const n2 = atsitiktinis(6, 10)
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Lyginamos dvi pakuotės: ${n1} vnt. ir ${n2} vnt. Ko reikia norint pasakyti, kuri naudingesnė?`,
        variantai: [
          'apskaičiuoti vieno vieneto kainą kiekvienoje pakuotėje',
          'palyginti tik bendras pakuočių kainas',
          'palyginti pakuočių dydį',
          'sudėti abiejų pakuočių kainas',
        ],
        teisingas: 0,
        sprendimas: 'Skirtingo dydžio pakuotes galima palyginti tik per vieneto kainą.',
      })
    },

    // 7. Sudėtinis palyginimas
    () => {
      const bilietas = atsitiktinis(150, 350)
      const vaiku = atsitiktinis(3, 8)
      const seimos = atsitiktinis(600, 1800)
      if (bilietas * vaiku === seimos) return null
      return uzdavinys(T10, {
        klausimas: `Vienas bilietas kainuoja $${eurais(bilietas)}$ Eur, o šeimos bilietas ${vaiku} asmenims — $${eurais(seimos)}$ Eur. Koks yra kainų skirtumas?`,
        atsakymas: eurais10(Math.abs(bilietas * vaiku - seimos)),
        atsakymasRodymui: `$${eurais(Math.abs(bilietas * vaiku - seimos))}$ Eur`,
        sprendimas: `Pavieniai bilietai: $${eurais(bilietas * vaiku)}$ Eur. Šeimos bilietas: $${eurais(seimos)}$ Eur. Skirtumas $${eurais(Math.abs(bilietas * vaiku - seimos))}$ Eur.`,
      })
    },
  ])
}
