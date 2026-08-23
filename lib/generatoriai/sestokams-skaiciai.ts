import { atsitiktinis, naujasId, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { koordinaciuPlokstuma, skaiciuTieseNeig } from './sestokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 6 klasės temos „Skaičiai“ ir „Racionaliųjų skaičių sudėtis ir atimtis“ —
 * devynios potemės.
 *
 * Šeštoje klasėje pirmą kartą pasirodo neigiami skaičiai, tad visur, kur
 * anksčiau užteko skaičiaus, dabar reikia ir ženklo. Atsakymai su minusu
 * rašomi paprastu brūkšneliu („-7“), nes būtent taip mokinys juos ir įveda.
 */

/** Nenulinis sveikasis skaičius iš intervalo. */
function nenulinis(nuo: number, iki: number): number {
  const n = atsitiktinis(nuo, iki)
  return n === 0 ? iki : n
}

/** Dešimtainis su viena skiltimi, užrašytas lietuvišku kableliu. */
function des(x: number): string {
  return String(x).replace('.', '{,}')
}

const KETVIRCIAI = ['I', 'II', 'III', 'IV'] as const

/** Kelintame ketvirtyje yra taškas. */
function ketvirtis(x: number, y: number): string {
  if (x > 0 && y > 0) return 'I'
  if (x < 0 && y > 0) return 'II'
  if (x < 0 && y < 0) return 'III'
  return 'IV'
}

// ── 1.1.1. Skaičiai skaičių tiesėje ─────────────────────────────────────────

const T1 = 'skaiciai-tieseje-6'

const A_TIESE = [
  {
    klausimas: 'Kuris skaičius skaičių tiesėje yra dešiniau: $-3$ ar $1$?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: 'Kuo skaičius didesnis, tuo jis dešiniau.',
  },
] as const

export const skaiciaiTieseje6: Generatorius = () => suBandymais(kurkTiese, A_TIESE, T1)

function kurkTiese(): Uzdavinys | null {
  const a = nenulinis(-8, -1)
  const b = nenulinis(1, 8)

  return variacija([
    // 1. Taško koordinatė iš brėžinio
    () =>
      uzdavinys(T1, {
        klausimas: 'Kokį skaičių žymi taškas $A$?',
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: 'Skaičiuojamos padalos nuo nulio į kairę — į kairę skaičiai neigiami.',
        brezinys: skaiciuTieseNeig(-8, 8, [{ reiksme: a, raide: 'A' }]),
      }),

    // 2. Kuris dešiniau
    () =>
      uzdavinys(T1, {
        klausimas: `Kuris skaičius skaičių tiesėje yra dešiniau: $${a}$ ar $${b}$?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: 'Dešiniau yra didesnis skaičius; visi neigiami skaičiai yra kairiau už nulį.',
      }),

    // 3. Tarp kurių sveikųjų
    () => {
      const sveikas = nenulinis(-5, 5)
      const trupmena = sveikas - 0.5
      return uzdavinys(T1, {
        klausimas: `Tarp kurių dviejų gretimų sveikųjų skaičių yra $${des(trupmena)}$? Užrašyk mažesnįjį.`,
        atsakymas: String(sveikas - 1),
        atsakymasRodymui: `$${sveikas - 1}$`,
        sprendimas: `$${des(trupmena)}$ yra tarp $${sveikas - 1}$ ir $${sveikas}$.`,
      })
    },

    // 4. Postūmis tiese
    () => {
      const zingsnis = atsitiktinis(3, 9)
      return uzdavinys(T1, {
        klausimas: `Taškas $A$ yra ties $${a}$. Pajudėjus ${zingsnis} vienetus į dešinę gaunamas taškas $B$. Kokia taško $B$ koordinatė?`,
        atsakymas: String(a + zingsnis),
        atsakymasRodymui: `$${a + zingsnis}$`,
        sprendimas: `Judant į dešinę skaičius didėja: $${a} + ${zingsnis} = ${a + zingsnis}$.`,
        brezinys: skaiciuTieseNeig(-8, 8, [{ reiksme: a, raide: 'A' }]),
      })
    },

    // 5. Atstumas tarp taškų
    () =>
      uzdavinys(T1, {
        klausimas: `Koks atstumas skaičių tiesėje tarp taškų, žyminčių $${a}$ ir $${b}$?`,
        atsakymas: String(b - a),
        atsakymasRodymui: `$${b - a}$`,
        sprendimas: `Nuo $${a}$ iki nulio yra ${-a} vienetai, nuo nulio iki $${b}$ — ${b}: $${-a} + ${b} = ${b - a}$.`,
        brezinys: skaiciuTieseNeig(-8, 8, [
          { reiksme: a, raide: 'A' },
          { reiksme: b, raide: 'B' },
        ]),
      }),

    // 6. Sveikieji, nutolę ne daugiau kaip n
    () => {
      const n = atsitiktinis(2, 5)
      return uzdavinys(T1, {
        klausimas: `Kiek yra sveikųjų skaičių, kurių atstumas iki nulio ne didesnis kaip ${n}?`,
        atsakymas: String(2 * n + 1),
        atsakymasRodymui: `$${2 * n + 1}$`,
        sprendimas: `Tai skaičiai nuo $-${n}$ iki $${n}$: ${n} neigiami, ${n} teigiami ir nulis.`,
      })
    },

    // 7. Trys taškai — didžiausias
    () => {
      const c = nenulinis(-7, 7)
      if (c === a || c === b) return null
      const eile = [a, b, c].sort((x, y) => x - y)
      return uzdavinys(T1, {
        klausimas: 'Kurį skaičių žymi labiausiai kairėje esantis pažymėtas taškas?',
        atsakymas: String(eile[0]),
        atsakymasRodymui: `$${eile[0]}$`,
        sprendimas: 'Kairiausias taškas žymi mažiausią skaičių.',
        brezinys: skaiciuTieseNeig(-8, 8, [
          { reiksme: a, raide: 'A' },
          { reiksme: b, raide: 'B' },
          { reiksme: c, raide: 'C' },
        ]),
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: `Mokinys skaičių $-4$ pažymėjo dešiniau už $-1$. Kuris iš šių dviejų skaičių iš tikrųjų yra dešiniau?`,
        atsakymas: '-1',
        atsakymasRodymui: '$-1$',
        sprendimas: 'Neigiamų skaičių eilė atvirkštinė: kuo didesnis skaičius po minuso, tuo pats skaičius mažesnis.',
        brezinys: skaiciuTieseNeig(-6, 6),
      }),
  ])
}

// ── 1.1.2. Vienas kitam priešingieji skaičiai ───────────────────────────────

const T2 = 'priesingieji-skaiciai'

const A_PRIESINGI = [
  {
    klausimas: 'Parašyk skaičiui $7$ priešingą skaičių.',
    atsakymas: '-7',
    atsakymasRodymui: '$-7$',
    sprendimas: 'Priešingi skaičiai skiriasi tik ženklu.',
  },
] as const

export const priesingiejiSkaiciai: Generatorius = () => suBandymais(kurkPriesingus, A_PRIESINGI, T2)

function kurkPriesingus(): Uzdavinys | null {
  const n = atsitiktinis(2, 20)

  return variacija([
    // 1. Priešingas teigiamam
    () =>
      uzdavinys(T2, {
        klausimas: `Parašyk skaičiui $${n}$ priešingą skaičių.`,
        atsakymas: String(-n),
        atsakymasRodymui: `$-${n}$`,
        sprendimas: 'Priešingi skaičiai nuo nulio nutolę vienodai, bet yra skirtingose pusėse.',
      }),

    // 2. Priešingas neigiamam
    () =>
      uzdavinys(T2, {
        klausimas: `Parašyk skaičiui $-${n}$ priešingą skaičių.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: 'Pakeičiamas tik ženklas.',
      }),

    // 3. Priešingas nuliui
    () =>
      uzdavinys(T2, {
        klausimas: 'Koks skaičius yra priešingas nuliui?',
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Nulis nuo savęs nenutolęs, tad jam priešingas yra jis pats.',
      }),

    // 4. Kuri pora priešinga
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kurie du skaičiai yra vienas kitam priešingi?',
        variantai: [`$-${n}$ ir $${n}$`, `$-${n}$ ir $0$`, `$${n}$ ir $${n + 1}$`, `$-${n}$ ir $-${n}$`],
        teisingas: 0,
        sprendimas: 'Priešingi skaičiai skiriasi tik ženklu.',
      }),

    // 5. Priešingas dešimtainiam
    () => {
      const d = atsitiktinis(11, 98) / 10
      return uzdavinys(T2, {
        klausimas: `Parašyk skaičiui $-${des(d)}$ priešingą skaičių.`,
        atsakymas: String(d),
        atsakymasRodymui: `$${des(d)}$`,
        sprendimas: 'Ženklas keičiamas, o pati skaičiaus reikšmė lieka ta pati.',
      })
    },

    // 6. Atvirkštinis: rask x
    () =>
      uzdavinys(T2, {
        klausimas: `Rask skaičių $x$, jei jam priešingas skaičius yra $${n}$.`,
        atsakymas: String(-n),
        atsakymasRodymui: `$-${n}$`,
        sprendimas: `Priešingas skaičiui $${n}$ yra $-${n}$, tad $x = -${n}$.`,
      }),

    // 7. Atstumas tarp priešingų
    () =>
      uzdavinys(T2, {
        klausimas: `Du priešingi skaičiai skaičių tiesėje nutolę vienas nuo kito per ${2 * n} vienetus. Užrašyk teigiamąjį iš jų.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Kiekvienas jų nuo nulio nutolęs per pusę atstumo: $${2 * n} : 2 = ${n}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Mokinys teigia, kad skaičiui $-${n}$ priešingas yra $\\dfrac{1}{${n}}$. Užrašyk teisingą priešingą skaičių.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: 'Priešingas skaičius gaunamas keičiant ženklą, o ne apverčiant trupmeną.',
      }),

    // 9. Rikiavimas su priešingais
    () => {
      const x = atsitiktinis(2, 9)
      const y = atsitiktinis(2, 9)
      if (x === y) return null
      const eile = [-8, x, 0, -y].sort((p, q) => p - q)
      return eiliskumoUzdavinys(naujasId(T2), T2, {
        klausimas: `Surikiuok didėjimo tvarka: $-8$, priešingas skaičiui $-${x}$, $0$, priešingas skaičiui $${y}$.`,
        teisingaEile: eile.map((v) => `$${v}$`),
        sprendimas: `Priešingas $-${x}$ yra $${x}$, priešingas $${y}$ yra $-${y}$.`,
      })
    },
  ])
}

// ── 1.1.3. Skaičių palyginimas ──────────────────────────────────────────────

const T3 = 'sveikuju-palyginimas-6'

const A_PALYGINIMAS = [
  {
    klausimas: 'Kuris skaičius didesnis: $-8$ ar $-2$?',
    atsakymas: '-2',
    atsakymasRodymui: '$-2$',
    sprendimas: 'Iš dviejų neigiamų didesnis tas, kuris arčiau nulio.',
  },
] as const

export const sveikujuPalyginimas6: Generatorius = () => suBandymais(kurkPalyginima, A_PALYGINIMAS, T3)

function kurkPalyginima(): Uzdavinys | null {
  const a = nenulinis(-12, -1)
  const b = nenulinis(-12, -1)
  if (a === b) return null
  const t = nenulinis(1, 12)

  return variacija([
    // 1. Neigiamas ir teigiamas
    () =>
      uzdavinys(T3, {
        klausimas: `Kuris skaičius didesnis: $${a}$ ar $${t}$?`,
        atsakymas: String(t),
        atsakymasRodymui: `$${t}$`,
        sprendimas: 'Bet kuris teigiamas skaičius didesnis už bet kurį neigiamą.',
      }),

    // 2. Du neigiami
    () =>
      uzdavinys(T3, {
        klausimas: `Kuris skaičius didesnis: $${a}$ ar $${b}$?`,
        atsakymas: String(Math.max(a, b)),
        atsakymasRodymui: `$${Math.max(a, b)}$`,
        sprendimas: 'Iš dviejų neigiamų didesnis tas, kuris skaičių tiesėje yra dešiniau, t. y. arčiau nulio.',
      }),

    // 3. Rikiavimas
    () => {
      const keturi = sumaisyk([atsitiktinis(-9, -5), atsitiktinis(-4, -1), 0, atsitiktinis(1, 6)])
      const eile = [...keturi].sort((x, y) => x - y)
      return eiliskumoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Surikiuok skaičius didėjimo tvarka.',
        teisingaEile: eile.map((v) => `$${v}$`),
        sprendimas: 'Skaičiai rikiuojami taip, kaip išsidėstę skaičių tiesėje iš kairės į dešinę.',
      })
    },

    // 4. Dešimtainiai neigiami
    () => {
      const sveikas = atsitiktinis(2, 8)
      const x = -(sveikas + 0.4)
      const y = -(sveikas + 0.04)
      return uzdavinys(T3, {
        klausimas: `Kuris skaičius didesnis: $${des(x)}$ ar $${des(y)}$?`,
        atsakymas: String(y),
        atsakymasRodymui: `$${des(y)}$`,
        sprendimas: `$${des(-x)} > ${des(-y)}$, tad su minusu tvarka apsiverčia: $${des(y)}$ yra arčiau nulio.`,
      })
    },

    // 5. Didžiausias sveikasis, mažesnis už duotą
    () => {
      const d = -(atsitiktinis(2, 9) + 0.1)
      return uzdavinys(T3, {
        klausimas: `Rask didžiausią sveikąjį skaičių, mažesnį už $${des(d)}$.`,
        atsakymas: String(Math.floor(d)),
        atsakymasRodymui: `$${Math.floor(d)}$`,
        sprendimas: `$${des(d)}$ yra tarp $${Math.floor(d)}$ ir $${Math.ceil(d)}$, tad ieškomas skaičius yra $${Math.floor(d)}$.`,
      })
    },

    // 6. Skaičius tarp dviejų
    () => {
      const sveikas = atsitiktinis(3, 8)
      return uzdavinys(T3, {
        klausimas: `Įrašyk sveikąjį skaičių, kad būtų teisinga: $-${sveikas + 1} < \\square < -${sveikas - 1}$.`,
        atsakymas: String(-sveikas),
        atsakymasRodymui: `$-${sveikas}$`,
        sprendimas: `Tarp $-${sveikas + 1}$ ir $-${sveikas - 1}$ yra vienintelis sveikasis skaičius $-${sveikas}$.`,
      })
    },

    // 7. Klaidos radimas
    () => {
      const x = atsitiktinis(6, 15)
      const y = atsitiktinis(2, 5)
      return uzdavinys(T3, {
        klausimas: `Mokinys teigia, kad $-${x} > -${y}$, nes $${x} > ${y}$. Kuris iš šių dviejų skaičių iš tikrųjų didesnis?`,
        atsakymas: String(-y),
        atsakymasRodymui: `$-${y}$`,
        sprendimas: `Kuo didesnis skaičius po minuso, tuo toliau į kairę jis nutolęs, tad $-${x} < -${y}$.`,
      })
    },

    // 8. Trupmena ir dešimtainis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Palygink $\\dfrac{3}{4}$ ir $0{,}8$.',
        variantai: ['$0{,}8$ didesnis', '$\\dfrac{3}{4}$ didesnis', 'jie lygūs'],
        teisingas: 0,
        sprendimas: '$\\dfrac{3}{4} = 0{,}75$, o $0{,}75 < 0{,}8$.',
      }),
  ])
}

// ── 1.2.1. Natūralieji, sveikieji, racionalieji skaičiai ────────────────────

const T4 = 'skaiciu-aibes'

const A_AIBES = [
  {
    klausimas: 'Ar skaičius $-7$ yra sveikasis?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: 'Sveikieji skaičiai yra natūralieji, jiems priešingi ir nulis.',
  },
] as const

export const skaiciuAibes: Generatorius = () => suBandymais(kurkAibes, A_AIBES, T4)

function kurkAibes(): Uzdavinys | null {
  const n = atsitiktinis(2, 20)

  return variacija([
    // 1. Ar sveikasis
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Ar skaičius $-${n}$ yra sveikasis?`,
        variantai: ['taip', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Sveikuosius skaičius sudaro natūralieji, jiems priešingi skaičiai ir nulis.',
      }),

    // 2. Ar racionalusis
    () => {
      const vd = atsitiktinis(2, 9)
      const sk = atsitiktinis(1, vd - 1)
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Ar skaičius $\\dfrac{${sk}}{${vd}}$ yra racionalusis?`,
        variantai: [
          'taip, nes jį galima užrašyti dviejų sveikųjų skaičių dalmeniu',
          'ne, nes tai trupmena',
          'ne, nes jis mažesnis už vienetą',
        ],
        teisingas: 0,
        sprendimas: 'Racionalusis skaičius ir yra toks, kurį galima užrašyti trupmena su sveikaisiais nariais.',
      })
    },

    // 3. Mažiausia aibė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kuriai siauriausiai skaičių aibei priklauso skaičius $${n}$?`,
        variantai: ['natūraliųjų', 'sveikųjų', 'racionaliųjų', 'jokiai'],
        teisingas: 0,
        sprendimas: 'Kiekvienas natūralusis skaičius kartu yra ir sveikasis, ir racionalusis.',
      }),

    // 4. Atrink sveikuosius
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek sveikųjų skaičių yra sąraše $-4$, $0$, $2$, $\\dfrac{1}{3}$?`,
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Sveikieji yra $-4$, $0$ ir $2$; $\\dfrac{1}{3}$ nėra sveikasis.',
      }),

    // 5. Atrink natūraliuosius
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek natūraliųjų skaičių yra sąraše $5$, $-2$, $0{,}75$, $\\dfrac{7}{2}$?`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Natūralieji skaičiai yra tik skaičiavimo skaičiai $1, 2, 3, \\ldots$ — čia toks vienintelis $5$.',
      }),

    // 6. Kodėl ne atvirkščiai
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl kiekvienas natūralusis skaičius yra sveikasis, bet ne kiekvienas sveikasis yra natūralusis?',
        variantai: [
          'nes sveikieji apima ir neigiamus skaičius bei nulį',
          'nes natūralieji skaičiai didesni',
          'nes sveikieji skaičiai yra trupmenos',
          'nes natūraliųjų skaičių mažiau',
        ],
        teisingas: 0,
        sprendimas: 'Pavyzdžiui, $-3$ yra sveikasis, bet ne natūralusis.',
      }),

    // 7. Racionalusis tarp dviejų
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuris skaičius yra tarp $-1$ ir $0$?',
        variantai: ['$-0{,}5$', '$0{,}5$', '$-1{,}5$', '$1$'],
        teisingas: 0,
        sprendimas: 'Tarp bet kurių dviejų skaičių yra be galo daug racionaliųjų skaičių.',
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Mokinys teigia, kad $0{,}5$ nėra racionalusis skaičius, nes užrašytas dešimtaine trupmena. Kodėl jis klysta?',
        variantai: [
          'nes $0{,}5 = \\dfrac{1}{2}$, o tai dviejų sveikųjų skaičių dalmuo',
          'nes visi dešimtainiai skaičiai yra sveikieji',
          'nes $0{,}5$ yra natūralusis skaičius',
          'jis neklysta',
        ],
        teisingas: 0,
        sprendimas: 'Užrašo forma skaičiaus rūšies nekeičia.',
      }),
  ])
}

// ── 1.2.2. Koordinačių plokštuma ────────────────────────────────────────────

const T5 = 'koordinaciu-plokstuma-6'

const A_PLOKSTUMA = [
  {
    klausimas: 'Kuriame ketvirtyje yra taškas $C(4; -2)$?',
    atsakymas: 'IV',
    atsakymasRodymui: 'IV ketvirtyje',
    sprendimas: 'Teigiama abscisė ir neigiama ordinatė — ketvirtasis ketvirtis.',
  },
] as const

export const koordinaciuPlokstuma6: Generatorius = () => suBandymais(kurkPlokstuma, A_PLOKSTUMA, T5)

function kurkPlokstuma(): Uzdavinys | null {
  const x = nenulinis(-5, 5)
  const y = nenulinis(-5, 5)

  return variacija([
    // 1. Abscisė iš brėžinio
    () =>
      uzdavinys(T5, {
        klausimas: 'Kokia yra pažymėto taško $A$ abscisė (pirmoji koordinatė)?',
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: 'Abscisė nuskaitoma nuo $x$ ašies — kiek taškas nutolęs į dešinę arba į kairę.',
        brezinys: koordinaciuPlokstuma([{ x, y, raide: 'A' }]),
      }),

    // 2. Ordinatė iš brėžinio
    () =>
      uzdavinys(T5, {
        klausimas: 'Kokia yra pažymėto taško $A$ ordinatė (antroji koordinatė)?',
        atsakymas: String(y),
        atsakymasRodymui: `$${y}$`,
        sprendimas: 'Ordinatė nuskaitoma nuo $y$ ašies — kiek taškas nutolęs aukštyn arba žemyn.',
        brezinys: koordinaciuPlokstuma([{ x, y, raide: 'A' }]),
      }),

    // 3. Kuriame ketvirtyje
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kuriame ketvirtyje yra taškas $C(${x}; ${y})$?`,
        variantai: [
          `${ketvirtis(x, y)} ketvirtyje`,
          ...KETVIRCIAI.filter((k) => k !== ketvirtis(x, y)).map((k) => `${k} ketvirtyje`),
        ],
        teisingas: 0,
        sprendimas: `Abscisė ${x > 0 ? 'teigiama' : 'neigiama'}, ordinatė ${y > 0 ? 'teigiama' : 'neigiama'}.`,
      }),

    // 4. Taškas ant ašies
    () => {
      const n = atsitiktinis(2, 5)
      return uzdavinys(T5, {
        klausimas: `Taškas yra ant $y$ ašies, ${n} vienetais virš pradžios taško. Kokia jo abscisė?`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Visi $y$ ašies taškai nuo jos nenutolę, tad jų abscisė lygi nuliui.',
      })
    },

    // 5. Postūmis
    () => {
      const dx = atsitiktinis(2, 6)
      const dy = atsitiktinis(2, 6)
      return uzdavinys(T5, {
        klausimas: `Taškas $A(${x}; ${y})$ pastumtas ${dx} vienetais į dešinę ir ${dy} žemyn. Kokia naujoji jo abscisė?`,
        atsakymas: String(x + dx),
        atsakymasRodymui: `$${x + dx}$`,
        sprendimas: `Judant į dešinę abscisė didėja: $${x} + ${dx} = ${x + dx}$.`,
      })
    },

    // 6. Simetriškas taškas
    () =>
      uzdavinys(T5, {
        klausimas: `Rask taško $P(${x}; ${y})$ simetriško taško $y$ ašies atžvilgiu abscisę.`,
        atsakymas: String(-x),
        atsakymasRodymui: `$${-x}$`,
        sprendimas: 'Atspindint per $y$ ašį abscisės ženklas pasikeičia, o ordinatė lieka ta pati.',
      }),

    // 7. Figūra iš viršūnių
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kokia figūra gaunama sujungus taškus $A(-2; 1)$, $B(2; 1)$, $C(2; 4)$, $D(-2; 4)$?',
        variantai: ['stačiakampis', 'trikampis', 'trapecija', 'rombas'],
        teisingas: 0,
        sprendimas: 'Kraštinės $AB$ ir $CD$ po 4 vienetus, $BC$ ir $AD$ po 3, o visi kampai statieji.',
        brezinys: koordinaciuPlokstuma([], 5, [[[-2, 1], [2, 1], [2, 4], [-2, 4], [-2, 1]]]),
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: 'Mokinys tašką $(-2; 5)$ pažymėjo IV ketvirtyje. Kuriame ketvirtyje jis yra iš tikrųjų?',
        atsakymas: 'II',
        atsakymasRodymui: 'II ketvirtyje',
        sprendimas: 'Abscisė neigiama, ordinatė teigiama — tai antrasis ketvirtis.',
      }),
  ])
}

// ── 2.1.1. Sudedame skaičius su vienodais ženklais ──────────────────────────

const T6 = 'sudetis-vienodi-zenklai'

const A_VIENODI = [
  {
    klausimas: 'Apskaičiuok: $-7 + (-5)$.',
    atsakymas: '-12',
    atsakymasRodymui: '$-12$',
    sprendimas: 'Moduliai sudedami, ženklas lieka tas pats.',
  },
] as const

export const sudetisVienodiZenklai: Generatorius = () => suBandymais(kurkVienodus, A_VIENODI, T6)

function kurkVienodus(): Uzdavinys | null {
  const a = atsitiktinis(2, 40)
  const b = atsitiktinis(2, 40)

  return variacija([
    // 1. Du neigiami
    () =>
      uzdavinys(T6, {
        klausimas: `Apskaičiuok: $-${a} + (-${b})$.`,
        atsakymas: String(-(a + b)),
        atsakymasRodymui: `$-${a + b}$`,
        sprendimas: `Ženklai vienodi, tad moduliai sudedami: $${a} + ${b} = ${a + b}$, o ženklas lieka minusas.`,
      }),

    // 2. Du teigiami
    () =>
      uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${a} + ${b}$.`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$.`,
      }),

    // 3. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kaip sudedami du skaičiai su vienodais ženklais?',
        variantai: [
          'moduliai sudedami, o ženklas paliekamas tas pats',
          'moduliai atimami, o ženklas paliekamas tas pats',
          'moduliai sudedami, o ženklas keičiamas',
          'atsakymas visada teigiamas',
        ],
        teisingas: 0,
        sprendimas: 'Abu dėmenys traukia į tą pačią pusę nuo nulio.',
      }),

    // 4. Trys neigiami
    () => {
      const c = atsitiktinis(2, 30)
      return uzdavinys(T6, {
        klausimas: `Apskaičiuok: $-${a} + (-${b}) + (-${c})$.`,
        atsakymas: String(-(a + b + c)),
        atsakymasRodymui: `$-${a + b + c}$`,
        sprendimas: `$${a} + ${b} + ${c} = ${a + b + c}$, ženklas — minusas.`,
      })
    },

    // 5. Trūkstamas dėmuo
    () =>
      uzdavinys(T6, {
        klausimas: `Rask trūkstamą dėmenį: $-${a} + \\square = -${a + b}$.`,
        atsakymas: String(-b),
        atsakymasRodymui: `$-${b}$`,
        sprendimas: `Suma pasislinko dar per ${b} į kairę, tad pridėta $-${b}$.`,
      }),

    // 6. Dešimtainiai
    () => {
      const x = atsitiktinis(11, 89) / 10
      const y = atsitiktinis(11, 89) / 10
      const suma = Math.round((x + y) * 10) / 10
      return uzdavinys(T6, {
        klausimas: `Apskaičiuok: $-${des(x)} + (-${des(y)})$.`,
        atsakymas: String(-suma),
        atsakymasRodymui: `$-${des(suma)}$`,
        sprendimas: `$${des(x)} + ${des(y)} = ${des(suma)}$, ženklas — minusas.`,
      })
    },

    // 7. Temperatūra
    () => {
      const pradzia = atsitiktinis(2, 15)
      const krito = atsitiktinis(2, 12)
      return uzdavinys(T6, {
        klausimas: `Temperatūra buvo $-${pradzia}$ °C ir nukrito dar ${krito} laipsniais. Kokia ji tapo?`,
        atsakymas: String(-(pradzia + krito)),
        atsakymasRodymui: `$-${pradzia + krito}$ °C`,
        sprendimas: `$-${pradzia} + (-${krito}) = -${pradzia + krito}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: `Mokinys apskaičiavo $-${a} + (-${b}) = ${a + b}$. Užrašyk teisingą sumą.`,
        atsakymas: String(-(a + b)),
        atsakymasRodymui: `$-${a + b}$`,
        sprendimas: 'Sudedant du neigiamus skaičius rezultatas negali būti teigiamas — abu traukia į kairę nuo nulio.',
      }),
  ])
}

// ── 2.1.2. Sudedame skaičius su skirtingais ženklais ────────────────────────

const T7 = 'sudetis-skirtingi-zenklai'

const A_SKIRTINGI = [
  {
    klausimas: 'Apskaičiuok: $-9 + 4$.',
    atsakymas: '-5',
    atsakymasRodymui: '$-5$',
    sprendimas: 'Iš didesnio modulio atimamas mažesnis, ženklas imamas didesniojo.',
  },
] as const

export const sudetisSkirtingiZenklai: Generatorius = () => suBandymais(kurkSkirtingus, A_SKIRTINGI, T7)

function kurkSkirtingus(): Uzdavinys | null {
  const a = atsitiktinis(3, 40)
  const b = atsitiktinis(3, 40)
  if (a === b) return null

  return variacija([
    // 1. Neigiamas plius teigiamas
    () =>
      uzdavinys(T7, {
        klausimas: `Apskaičiuok: $-${a} + ${b}$.`,
        atsakymas: String(b - a),
        atsakymasRodymui: `$${b - a}$`,
        sprendimas: `Moduliai ${a} ir ${b}; iš didesnio atimamas mažesnis: $${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(b - a)}$, ženklas — didesniojo modulio skaičiaus.`,
      }),

    // 2. Teigiamas plius neigiamas
    () =>
      uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${a} + (-${b})$.`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$`,
        sprendimas: `$${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(a - b)}$; didesnis modulis yra ${Math.max(a, b)}.`,
      }),

    // 3. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kaip sudedami du skaičiai su skirtingais ženklais?',
        variantai: [
          'iš didesnio modulio atimamas mažesnis, o ženklas imamas didesniojo modulio',
          'moduliai sudedami, ženklas imamas didesniojo',
          'moduliai sudedami, ženklas visada minusas',
          'iš mažesnio modulio atimamas didesnis',
        ],
        teisingas: 0,
        sprendimas: 'Dėmenys traukia į priešingas puses, tad viena dalis kitą panaikina.',
      }),

    // 4. Suma lygi nuliui
    () =>
      uzdavinys(T7, {
        klausimas: `Koks skaičius pridėtas prie $-${a}$ duoda nulį?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: 'Suma lygi nuliui tada, kai dėmenys yra priešingi skaičiai.',
      }),

    // 5. Trūkstamas dėmuo
    () =>
      uzdavinys(T7, {
        klausimas: `Rask trūkstamą dėmenį: $${a} + \\square = ${a - b}$.`,
        atsakymas: String(-b),
        atsakymasRodymui: `$-${b}$`,
        sprendimas: `Suma sumažėjo ${b}, tad pridėta $-${b}$.`,
      }),

    // 6. Kelių dėmenų suma
    () => {
      const c = atsitiktinis(3, 20)
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok: $-${a} + ${b} + (-${c})$.`,
        atsakymas: String(-a + b - c),
        atsakymasRodymui: `$${-a + b - c}$`,
        sprendimas: `$-${a} + ${b} = ${b - a}$, tada $${b - a} + (-${c}) = ${-a + b - c}$.`,
      })
    },

    // 7. Sąskaita
    () => {
      const skola = atsitiktinis(10, 60)
      const gauta = atsitiktinis(10, 60)
      if (skola === gauta) return null
      return uzdavinys(T7, {
        klausimas: `Sąskaitoje buvo $-${skola}$ Eur, į ją įnešta ${gauta} Eur. Kiek pinigų sąskaitoje dabar?`,
        atsakymas: String(gauta - skola),
        atsakymasRodymui: `$${gauta - skola}$ Eur`,
        sprendimas: `$-${skola} + ${gauta} = ${gauta - skola}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Mokinys apskaičiavo $-${a} + ${b} = -${a + b}$ — sudėjo modulius. Užrašyk teisingą sumą.`,
        atsakymas: String(b - a),
        atsakymasRodymui: `$${b - a}$`,
        sprendimas: 'Kai ženklai skirtingi, moduliai ne sudedami, o atimami.',
      }),
  ])
}

// ── 2.2.1. Atimame ──────────────────────────────────────────────────────────

const T8 = 'racionaliuju-atimtis'

const A_ATIMTIS = [
  {
    klausimas: 'Apskaičiuok: $-6 - (-9)$.',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Atimti skaičių — tas pat, kas pridėti jam priešingą.',
  },
] as const

export const racionaliujuAtimtis: Generatorius = () => suBandymais(kurkAtimti, A_ATIMTIS, T8)

function kurkAtimti(): Uzdavinys | null {
  const a = atsitiktinis(2, 40)
  const b = atsitiktinis(2, 40)

  return variacija([
    // 1. Neigiamas minus neigiamas
    () =>
      uzdavinys(T8, {
        klausimas: `Apskaičiuok: $-${a} - (-${b})$.`,
        atsakymas: String(-a + b),
        atsakymasRodymui: `$${-a + b}$`,
        sprendimas: `Atimtis keičiama sudėtimi su priešingu skaičiumi: $-${a} + ${b} = ${-a + b}$.`,
      }),

    // 2. Teigiamas minus neigiamas
    () =>
      uzdavinys(T8, {
        klausimas: `Apskaičiuok: $${a} - (-${b})$.`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$ — du minusai iš eilės duoda pliusą.`,
      }),

    // 3. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuo pakeičiama atimtis, kai skaičiuojama su neigiamais skaičiais?',
        variantai: [
          'sudėtimi su atėminiui priešingu skaičiumi',
          'sudėtimi su tuo pačiu skaičiumi',
          'daugyba iš $-1$',
          'niekuo — atimama kaip įprastai',
        ],
        teisingas: 0,
        sprendimas: `Pavyzdžiui, $5 - (-3) = 5 + 3 = 8$.`,
      }),

    // 4. Neigiamas minus teigiamas
    () =>
      uzdavinys(T8, {
        klausimas: `Apskaičiuok: $-${a} - ${b}$.`,
        atsakymas: String(-a - b),
        atsakymasRodymui: `$${-a - b}$`,
        sprendimas: `$-${a} + (-${b}) = -${a + b}$.`,
      }),

    // 5. Trūkstamas atėminys
    () =>
      uzdavinys(T8, {
        klausimas: `Rask trūkstamą atėminį: $-${a} - \\square = -${a + b}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Rezultatas pasislinko ${b} į kairę, tad atimta ${b}.`,
      }),

    // 6. Temperatūrų skirtumas
    () => {
      const rytas = -atsitiktinis(2, 18)
      const diena = atsitiktinis(1, 12)
      return uzdavinys(T8, {
        klausimas: `Rytą buvo $${rytas}$ °C, dieną $${diena}$ °C. Keliais laipsniais atšilo?`,
        atsakymas: String(diena - rytas),
        atsakymasRodymui: `$${diena - rytas}$ °C`,
        sprendimas: `$${diena} - (${rytas}) = ${diena} + ${-rytas} = ${diena - rytas}$.`,
      })
    },

    // 7. Dešimtainiai
    () => {
      const x = atsitiktinis(11, 89) / 10
      const y = atsitiktinis(11, 89) / 10
      const rez = Math.round((-x + y) * 10) / 10
      return uzdavinys(T8, {
        klausimas: `Apskaičiuok: $-${des(x)} - (-${des(y)})$.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${des(rez)}$`,
        sprendimas: `$-${des(x)} + ${des(y)} = ${des(rez)}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T8, {
        klausimas: `Mokinys apskaičiavo $${a} - (-${b}) = ${a - b}$. Užrašyk teisingą skirtumą.`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: 'Atimant neigiamą skaičių rezultatas didėja, nes pridedamas jam priešingas teigiamas skaičius.',
      }),
  ])
}

// ── 2.2.2. Algebrinė suma ───────────────────────────────────────────────────

const T9 = 'algebrine-suma'

const A_ALGEBRINE = [
  {
    klausimas: 'Užrašyk be skliaustų ir apskaičiuok: $-8 + (-3) - (-5)$.',
    atsakymas: '-6',
    atsakymasRodymui: '$-6$',
    sprendimas: '$-8 - 3 + 5 = -6$.',
  },
] as const

export const algebrineSuma: Generatorius = () => suBandymais(kurkAlgebrine, A_ALGEBRINE, T9)

function kurkAlgebrine(): Uzdavinys | null {
  const a = atsitiktinis(2, 25)
  const b = atsitiktinis(2, 25)
  const c = atsitiktinis(2, 25)

  return variacija([
    // 1. Be skliaustų
    () =>
      uzdavinys(T9, {
        klausimas: `Užrašyk be skliaustų ir apskaičiuok: $-${a} + (-${b}) - (-${c})$.`,
        atsakymas: String(-a - b + c),
        atsakymasRodymui: `$${-a - b + c}$`,
        sprendimas: `$-${a} - ${b} + ${c} = ${-a - b + c}$.`,
      }),

    // 2. Kas yra algebrinė suma
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kas vadinama algebrine suma?',
        variantai: [
          'reiškinys, kuriame atimtis pakeista sudėtimi su priešingais skaičiais',
          'tik teigiamų skaičių suma',
          'suma, kurios rezultatas neigiamas',
          'dviejų skaičių sandauga',
        ],
        teisingas: 0,
        sprendimas: 'Todėl algebrinėje sumoje lieka tik sudėtis, o dėmenys turi savo ženklus.',
      }),

    // 3. Patogus grupavimas
    () =>
      uzdavinys(T9, {
        klausimas: `Apskaičiuok patogiausiu būdu: $-${a} + ${b} + ${a}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Priešingi dėmenys $-${a}$ ir $${a}$ vienas kitą panaikina, lieka $${b}$.`,
      }),

    // 4. Teigiamų ir neigiamų grupavimas
    () =>
      uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${a} - ${b} + ${c} - ${a}$.`,
        atsakymas: String(c - b),
        atsakymasRodymui: `$${c - b}$`,
        sprendimas: `$${a}$ ir $-${a}$ panaikina vienas kitą: lieka $-${b} + ${c} = ${c - b}$.`,
      }),

    // 5. Skliaustų atskleidimas su minusu
    () =>
      uzdavinys(T9, {
        klausimas: `Užrašyk be skliaustų ir apskaičiuok: $${a} - (${b} - ${c})$.`,
        atsakymas: String(a - b + c),
        atsakymasRodymui: `$${a - b + c}$`,
        sprendimas: `Prieš skliaustus esantis minusas pakeičia visų narių ženklus: $${a} - ${b} + ${c} = ${a - b + c}$.`,
      }),

    // 6. Trūkstamas dėmuo
    () =>
      uzdavinys(T9, {
        klausimas: `Rask trūkstamą dėmenį: $-${a} + \\square - ${c} = ${-a + b - c}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${-a + b - c} + ${c} + ${a} = ${b}$.`,
      }),

    // 7. Tekstinis
    () => {
      const pradzia = atsitiktinis(20, 60)
      return uzdavinys(T9, {
        klausimas: `Lifte buvo ${pradzia} kg krovinio, išimta ${a} kg, paskui įdėta ${b} kg ir vėl išimta ${c} kg. Kiek kilogramų liko?`,
        atsakymas: String(pradzia - a + b - c),
        atsakymasRodymui: `$${pradzia - a + b - c}$ kg`,
        sprendimas: `$${pradzia} - ${a} + ${b} - ${c} = ${pradzia - a + b - c}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Mokinys užrašė $${a} - (${b} - ${c}) = ${a - b - c}$. Užrašyk teisingą reikšmę.`,
        atsakymas: String(a - b + c),
        atsakymasRodymui: `$${a - b + c}$`,
        sprendimas: 'Minusas prieš skliaustus keičia ženklą kiekvienam skliaustų nariui, ne tik pirmajam.',
      }),
  ])
}
