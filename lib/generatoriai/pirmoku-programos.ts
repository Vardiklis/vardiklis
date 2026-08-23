import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { type Daiktas } from './ikonos'
import { tinkleliuZemelapis } from './pirmoku-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 1 klasės 11 tema „Kompiuterinių programų kūrimas“.
 *
 * Anksčiau keturios šios temos potemės rėmėsi `algoritmai` generatoriumi, o jis
 * skirtas vyresniems: „kartok 8 kartus { pirmyn 2 }“ ir figūros perimetras
 * langeliais. Pirmoje klasėje programavimas yra komanda, komandų seka ir
 * paprasta sąlyga IR/ARBA — be ciklų ir be daugybos.
 *
 * Visos potemės sukasi apie tą patį tinklelį su rodyklėmis, kurį vaikas jau
 * matė 4 temoje, tad naujas čia yra tik žodynas: komanda, algoritmas,
 * programa, robotas.
 */

const PLOTIS = 4
const AUKSTIS = 3

/** Komanda ir jos poslinkis tinklelyje. `y` didėja žemyn. */
const KOMANDOS = [
  { zenklas: '↑', dx: 0, dy: -1, vardas: 'aukštyn' },
  { zenklas: '↓', dx: 0, dy: 1, vardas: 'žemyn' },
  { zenklas: '→', dx: 1, dy: 0, vardas: 'į dešinę' },
  { zenklas: '←', dx: -1, dy: 0, vardas: 'į kairę' },
] as const

/** Daiktai, kurių gali siekti robotas. */
const TIKSLAI = [
  { kas: 'zvaigzde' as Daiktas, vardas: 'žvaigždė' },
  { kas: 'gele' as Daiktas, vardas: 'gėlė' },
  { kas: 'namas' as Daiktas, vardas: 'namas' },
  { kas: 'medis' as Daiktas, vardas: 'medis' },
]

/**
 * Kelias tinklelyje be grįžimų atgal.
 *
 * Grįžimas į ką tik paliktą langelį („→ ←“) kelio nepailgina, o pirmokui
 * atrodo kaip klaida sąlygoje, tad tokie žingsniai atmetami.
 */
function kurkKelia(
  pradzia: { x: number; y: number },
  zingsniu: number,
): { takas: { x: number; y: number }[]; zenklai: string[] } | null {
  const takas = [pradzia]
  const zenklai: string[] = []
  let dabar = pradzia
  let ankstesnis: (typeof KOMANDOS)[number] | null = null
  for (let i = 0; i < zingsniu; i += 1) {
    const galimi = KOMANDOS.filter((k) => {
      const x = dabar.x + k.dx
      const y = dabar.y + k.dy
      if (x < 0 || x >= PLOTIS || y < 0 || y >= AUKSTIS) return false
      return !ankstesnis || k.dx !== -ankstesnis.dx || k.dy !== -ankstesnis.dy
    })
    if (galimi.length === 0) return null
    const k = pasirink(galimi)
    ankstesnis = k
    dabar = { x: dabar.x + k.dx, y: dabar.y + k.dy }
    takas.push(dabar)
    zenklai.push(k.zenklas)
  }
  if (dabar.x === pradzia.x && dabar.y === pradzia.y) return null
  return { takas, zenklai }
}

/** Robotas, tikslas ir kelias — bendra beveik visų šios temos pavidalų sąranga. */
function kurkScena(zingsniu = atsitiktinis(3, 4)) {
  const pradzia = { x: atsitiktinis(0, 1), y: AUKSTIS - 1 }
  const kelias = kurkKelia(pradzia, zingsniu)
  if (!kelias) return null
  const galas = kelias.takas[kelias.takas.length - 1]
  const tikslas = pasirink(TIKSLAI)
  const langeliai = [
    { x: pradzia.x, y: pradzia.y, kas: 'kate' as Daiktas },
    { x: galas.x, y: galas.y, kas: tikslas.kas },
  ]
  return { pradzia, kelias, galas, tikslas, langeliai }
}

// ── 11.1 Kas yra komanda? ───────────────────────────────────────────────────

const A_KOMANDA = [
  {
    klausimas: 'Kuri komanda perkelia robotą vienu langeliu į dešinę?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — →',
    sprendimas: 'Rodyklė → nurodo vieną žingsnį į dešinę.',
  },
] as const

export const kasYraKomanda: Generatorius = () =>
  suBandymais(kurkKomanda, A_KOMANDA, 'kas-yra-komanda')

function kurkKomanda(): Uzdavinys | null {
  const k = pasirink(KOMANDOS)
  const kiti = KOMANDOS.filter((x) => x.zenklas !== k.zenklas).slice(0, 2)

  return variacija([
    // 1. Kuri komanda perkelia nurodyta kryptimi
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-komanda'), 'kas-yra-komanda', {
        klausimas: `Kuri komanda perkelia robotą vienu langeliu ${k.vardas}?`,
        variantai: [k.zenklas, ...kiti.map((x) => x.zenklas)],
        teisingas: 0,
        sprendimas: `Komanda ${k.zenklas} reiškia vieną žingsnį ${k.vardas}.`,
      }),

    // 2. Ką reiškia komanda
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-komanda'), 'kas-yra-komanda', {
        klausimas: `Ką reiškia komanda ${k.zenklas}?`,
        variantai: [k.vardas, ...kiti.map((x) => x.vardas)],
        teisingas: 0,
        sprendimas: `Rodyklė ${k.zenklas} nurodo eiti ${k.vardas}.`,
      }),

    // 3. Kuri komanda nėra judėjimo komanda
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-komanda'), 'kas-yra-komanda', {
        klausimas: 'Kuri komanda nėra judėjimo komanda?',
        variantai: ['nupiešk šypseną', 'pirmyn', 'į kairę'],
        teisingas: 0,
        sprendimas: 'Judėjimo komandos perkelia robotą į kitą langelį, o piešimas jo nepajudina.',
      }),

    // 4. Kiek langelių pereina robotas per vieną komandą
    () =>
      uzdavinys('kas-yra-komanda', {
        klausimas: 'Per kiek langelių robotas pajuda įvykdęs vieną judėjimo komandą?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Viena komanda perkelia robotą lygiai per vieną langelį.',
      }),

    // 5. Kokia komanda buvo įvykdyta pirmoji
    () => {
      // Dviejų žingsnių kelias, o ne vieno: gretimuose langeliuose nubrėžtą
      // atkarpą uždengia patys paveikslėliai ir kelio nesimato.
      const scena = kurkScena(2)
      if (!scena) return null
      const zenklas = scena.kelias.zenklai[0]
      const netiesos = KOMANDOS.filter((x) => x.zenklas !== zenklas).slice(0, 2)
      return pasirinkimoUzdavinys(naujasId('kas-yra-komanda'), 'kas-yra-komanda', {
        klausimas: 'Kokia komanda buvo įvykdyta pirmoji?',
        variantai: [zenklas, ...netiesos.map((x) => x.zenklas)],
        teisingas: 0,
        sprendimas: `Kelias prasideda žingsniu ${zenklas}.`,
        brezinys: tinkleliuZemelapis(PLOTIS, AUKSTIS, scena.langeliai, scena.kelias.takas),
      })
    },
  ])
}

// ── 11.2 Kas yra algoritmas? ────────────────────────────────────────────────

const A_ALGORITMAS = [
  {
    klausimas: 'Kuri komandų seka nuveda robotą iki tikslo?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — → → ↑',
    sprendimas: 'Robotas eina du langelius į dešinę ir vieną aukštyn.',
  },
] as const

export const kasYraAlgoritmas: Generatorius = () =>
  suBandymais(kurkAlgoritma, A_ALGORITMAS, 'kas-yra-algoritmas')

function kurkAlgoritma(): Uzdavinys | null {
  const scena = kurkScena()
  if (!scena) return null
  const komandos = scena.kelias.zenklai.join(' ')
  const kitaTvarka = sumaisyk(scena.kelias.zenklai).join(' ')

  return variacija([
    // 1. Kuri seka nuveda iki tikslo
    () => {
      if (kitaTvarka === komandos) return null
      const trecia = [...scena.kelias.zenklai.slice(0, -1), pasirink(KOMANDOS).zenklas].join(' ')
      if (trecia === komandos || trecia === kitaTvarka) return null
      return pasirinkimoUzdavinys(naujasId('kas-yra-algoritmas'), 'kas-yra-algoritmas', {
        klausimas: `Kuri komandų seka nuveda robotą iki daikto „${scena.tikslas.vardas}“?`,
        variantai: [komandos, kitaTvarka, trecia],
        teisingas: 0,
        sprendimas: `Nubrėžtas kelias eina taip: ${komandos}.`,
        brezinys: tinkleliuZemelapis(PLOTIS, AUKSTIS, scena.langeliai, scena.kelias.takas),
      })
    },

    // 2. Komandų sudėliojimas iš eilės
    () => {
      // Tik skirtingos komandos: kelyje „→ → ↑“ mokinys gautų dvi vienodas
      // rodykles, o tada bet kuri jų tvarka būtų teisinga.
      if (new Set(scena.kelias.zenklai).size !== scena.kelias.zenklai.length) return null
      return eiliskumoUzdavinys(naujasId('kas-yra-algoritmas'), 'kas-yra-algoritmas', {
        klausimas: `Sudėk komandas tokia tvarka, kad robotas nueitų iki daikto „${scena.tikslas.vardas}“.`,
        teisingaEile: scena.kelias.zenklai,
        sprendimas: `Teisinga tvarka: ${komandos}.`,
        brezinys: tinkleliuZemelapis(PLOTIS, AUKSTIS, scena.langeliai, scena.kelias.takas),
      })
    },

    // 3. Kiek komandų algoritme
    () =>
      uzdavinys('kas-yra-algoritmas', {
        klausimas: 'Iš kiek komandų sudarytas nubrėžtas algoritmas?',
        atsakymas: String(scena.kelias.zenklai.length),
        atsakymasRodymui: `$${scena.kelias.zenklai.length}$`,
        sprendimas: `Kelias eina per ${scena.kelias.zenklai.length} langelius, tad komandų taip pat ${scena.kelias.zenklai.length}.`,
        brezinys: tinkleliuZemelapis(PLOTIS, AUKSTIS, scena.langeliai, scena.kelias.takas),
      }),

    // 4. Kas yra algoritmas
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-algoritmas'), 'kas-yra-algoritmas', {
        klausimas: 'Kas yra algoritmas?',
        variantai: [
          'komandų seka, atliekama iš eilės',
          'viena komanda',
          'roboto pavadinimas',
        ],
        teisingas: 0,
        sprendimas: 'Algoritmas yra komandų seka: jos vykdomos viena po kitos, nustatyta tvarka.',
      }),

    // 5. Ar svarbi komandų tvarka
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-algoritmas'), 'kas-yra-algoritmas', {
        klausimas: 'Ar svarbu, kokia tvarka surašytos komandos?',
        variantai: [
          'taip, kitokia tvarka robotas nueis kitur',
          'ne, tvarka nesvarbi',
          'svarbu tik komandų skaičius',
        ],
        teisingas: 0,
        sprendimas: 'Tos pačios komandos kita tvarka nuveda robotą į kitą langelį.',
      }),
  ])
}

// ── 11.3 IR ar ARBA? ────────────────────────────────────────────────────────

const A_IR_ARBA = [
  {
    klausimas: 'Kuri figūra yra raudona IR didelė?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — didelis raudonas apskritimas',
    sprendimas: 'Sąlyga su IR reikalauja, kad tiktų abu požymiai.',
  },
] as const

export const irArba: Generatorius = () => suBandymais(kurkIrArba, A_IR_ARBA, 'ir-arba')

/**
 * Būdvardžiai abiem giminėmis.
 *
 * Klausiama „Kuri figūra…“ (moteriškoji giminė), o atsakymuose vardijamos
 * figūros yra vyriškosios: apskritimas, kvadratas, trikampis. Todėl tas pats
 * požymis sakinyje ir atsakyme rašomas skirtingai — „geltona figūra“, bet
 * „geltonas apskritimas“.
 */
const SPALVOS = [
  { v: 'raudonas', m: 'raudona' },
  { v: 'mėlynas', m: 'mėlyna' },
  { v: 'geltonas', m: 'geltona' },
  { v: 'žalias', m: 'žalia' },
] as const
const FORMOS = ['apskritimas', 'kvadratas', 'trikampis'] as const
const DYDZIAI = [
  { v: 'didelis', m: 'didelė' },
  { v: 'mažas', m: 'maža' },
] as const

/** Figūros aprašas žodžiais — piešti jų nereikia, sąlyga skaitoma. */
function figuraZodziais(spalva: string, forma: string, dydis: string): string {
  return `${dydis} ${spalva} ${forma}`
}

function kurkIrArba(): Uzdavinys | null {
  const spalva = pasirink(SPALVOS)
  const kitaSpalva = pasirink(SPALVOS.filter((s) => s.v !== spalva.v))
  const forma = pasirink(FORMOS)
  const kitaForma = pasirink(FORMOS.filter((f) => f !== forma))
  const dydis = pasirink(DYDZIAI)
  const kitasDydis = dydis.v === 'didelis' ? DYDZIAI[1] : DYDZIAI[0]

  return variacija([
    // 1. IR — turi tikti abu požymiai
    () =>
      pasirinkimoUzdavinys(naujasId('ir-arba'), 'ir-arba', {
        klausimas: `Kuri figūra yra ${spalva.m} IR ${dydis.m}?`,
        variantai: [
          figuraZodziais(spalva.v, forma, dydis.v),
          figuraZodziais(spalva.v, forma, kitasDydis.v),
          figuraZodziais(kitaSpalva.v, kitaForma, dydis.v),
        ],
        teisingas: 0,
        sprendimas: `Su IR turi tikti abu požymiai: ir spalva (${spalva.m}), ir dydis (${dydis.m}).`,
      }),

    // 2. ARBA — užtenka vieno požymio
    () =>
      pasirinkimoUzdavinys(naujasId('ir-arba'), 'ir-arba', {
        klausimas: `Kuri figūra atitinka sąlygą „${spalva.m} ARBA ${kitaForma}“?`,
        variantai: [
          figuraZodziais(spalva.v, forma, dydis.v),
          figuraZodziais(kitaSpalva.v, forma, dydis.v),
          figuraZodziais(kitaSpalva.v, forma, kitasDydis.v),
        ],
        teisingas: 0,
        sprendimas: `Su ARBA užtenka vieno požymio — ši figūra yra ${spalva.m}.`,
      }),

    // 3. Kuo skiriasi IR nuo ARBA
    () =>
      pasirinkimoUzdavinys(naujasId('ir-arba'), 'ir-arba', {
        klausimas: 'Kuo skiriasi sąlygos su IR ir su ARBA?',
        variantai: [
          'su IR turi tikti abu požymiai, su ARBA — bent vienas',
          'su IR turi tikti bent vienas, su ARBA — abu',
          'jos nesiskiria',
        ],
        teisingas: 0,
        sprendimas: 'IR reikalauja abiejų požymių, ARBA — bent vieno.',
      }),

    // 4. Ar figūra tinka sąlygai
    () => {
      const tinka = atsitiktinis(0, 1) === 1
      const aprasas = figuraZodziais(spalva.v, forma, (tinka ? dydis : kitasDydis).v)
      return pasirinkimoUzdavinys(naujasId('ir-arba'), 'ir-arba', {
        klausimas: `Ar figūra „${aprasas}“ atitinka sąlygą „${spalva.m} IR ${dydis.m}“?`,
        variantai: tinka
          ? ['taip, tinka abu požymiai', 'ne, netinka spalva', 'ne, netinka dydis']
          : ['ne, netinka dydis', 'taip, tinka abu požymiai', 'ne, netinka spalva'],
        teisingas: 0,
        sprendimas: tinka
          ? `Figūra yra ${spalva.m} ir ${dydis.m} — abu požymiai tinka.`
          : `Figūra yra ${spalva.m}, bet ${kitasDydis.m}, tad su IR ji netinka.`,
      })
    },

    // 5. Kiek figūrų tinka sąlygai su ARBA
    () => {
      const kiek = atsitiktinis(2, 4)
      return uzdavinys('ir-arba', {
        klausimas: `Dėžėje ${kiek} mėlynos ir ${kiek + 1} geltonos figūros. Kiek figūrų atitinka sąlygą „mėlyna ARBA geltona“?`,
        atsakymas: String(kiek + kiek + 1),
        atsakymasRodymui: `$${kiek + kiek + 1}$`,
        sprendimas: `Su ARBA tinka abi grupės: $${kiek} + ${kiek + 1} = ${kiek + kiek + 1}$.`,
      })
    },
  ])
}

// ── 11.4 Kaip sukurti programą „Blue-Bot“ robotui? ──────────────────────────

const A_BLUEBOT = [
  {
    klausimas: 'Robotas vykdo programą → → ↑. Prie kurio daikto jis sustos?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — gėlė',
    sprendimas: 'Du langeliai į dešinę ir vienas aukštyn veda prie gėlės.',
  },
] as const

export const blueBot: Generatorius = () => suBandymais(kurkBlueBot, A_BLUEBOT, 'blue-bot')

function kurkBlueBot(): Uzdavinys | null {
  const scena = kurkScena()
  if (!scena) return null
  const komandos = scena.kelias.zenklai.join(' ')

  return variacija([
    // 1. Kur robotas sustos
    () => {
      const laisvi: { x: number; y: number }[] = []
      for (let x = 0; x < PLOTIS; x += 1) {
        for (let y = 0; y < AUKSTIS; y += 1) {
          const uzimtas =
            (x === scena.pradzia.x && y === scena.pradzia.y) ||
            (x === scena.galas.x && y === scena.galas.y)
          if (!uzimtas) laisvi.push({ x, y })
        }
      }
      const kiti = sumaisyk(laisvi).slice(0, 2)
      if (kiti.length < 2) return null
      const netikslai = TIKSLAI.filter((t) => t.vardas !== scena.tikslas.vardas).slice(0, 2)
      const langeliai = [
        ...scena.langeliai,
        { x: kiti[0].x, y: kiti[0].y, kas: netikslai[0].kas },
        { x: kiti[1].x, y: kiti[1].y, kas: netikslai[1].kas },
      ]
      return pasirinkimoUzdavinys(naujasId('blue-bot'), 'blue-bot', {
        klausimas: `Roboto programa: ${komandos}. Prie kurio daikto jis sustos?`,
        variantai: [scena.tikslas.vardas, netikslai[0].vardas, netikslai[1].vardas],
        teisingas: 0,
        sprendimas: `Vykdydamas ${komandos} robotas ateina prie daikto „${scena.tikslas.vardas}“.`,
        // Kelias nerodomas: jį atsekti ir yra visas uždavinys.
        brezinys: tinkleliuZemelapis(PLOTIS, AUKSTIS, langeliai),
      })
    },

    // 2. Trūkstamas programos žingsnis
    () => {
      if (scena.kelias.zenklai.length < 3) return null
      const vieta = atsitiktinis(1, scena.kelias.zenklai.length - 1)
      const trukstama = scena.kelias.zenklai[vieta]
      const su = scena.kelias.zenklai.map((z, i) => (i === vieta ? '□' : z)).join(' ')
      const netiesos = KOMANDOS.filter((k) => k.zenklas !== trukstama).slice(0, 2)
      return pasirinkimoUzdavinys(naujasId('blue-bot'), 'blue-bot', {
        klausimas: `Programoje trūksta vieno žingsnio: ${su}. Kuri komanda turi būti vietoj langelio?`,
        variantai: [trukstama, ...netiesos.map((k) => k.zenklas)],
        teisingas: 0,
        sprendimas: `Pagal nubrėžtą kelią toje vietoje yra ${trukstama}.`,
        brezinys: tinkleliuZemelapis(PLOTIS, AUKSTIS, scena.langeliai, scena.kelias.takas),
      })
    },

    // 3. Kiek komandų programoje
    () =>
      uzdavinys('blue-bot', {
        klausimas: `Roboto programa: ${komandos}. Iš kiek komandų ji sudaryta?`,
        atsakymas: String(scena.kelias.zenklai.length),
        atsakymasRodymui: `$${scena.kelias.zenklai.length}$`,
        sprendimas: `Programoje surašytos ${scena.kelias.zenklai.length} rodyklės.`,
      }),

    // 4. Ką reikia padaryti prieš paleidžiant programą
    () =>
      pasirinkimoUzdavinys(naujasId('blue-bot'), 'blue-bot', {
        klausimas: 'Ką reikia padaryti prieš paleidžiant naują „Blue-Bot“ programą?',
        variantai: ['ištrinti senas komandas', 'pasukti robotą aukštyn kojomis', 'nieko'],
        teisingas: 0,
        sprendimas: 'Neištrynus senų komandų robotas pirmiausia įvykdys jas, o tik paskui naujas.',
      }),

    // 5. Kiek kartų einama viena kryptimi
    () => {
      const k = pasirink(KOMANDOS)
      const kiek = scena.kelias.zenklai.filter((z) => z === k.zenklas).length
      if (kiek === 0) return null
      return uzdavinys('blue-bot', {
        klausimas: `Programa: ${komandos}. Kiek kartų robotas eina ${k.vardas}?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `Komanda ${k.zenklas} programoje pasitaiko ${kiek} ${kiek === 1 ? 'kartą' : 'kartus'}.`,
      })
    },
  ])
}

// ── 11.5 Kaip naudoti programą „ScratchJr“? ─────────────────────────────────

const A_SCRATCH = [
  {
    klausimas: 'Kuris blokas pajudina veikėją į dešinę?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — →',
    sprendimas: 'Į dešinę veikėją pajudina blokas su rodykle →.',
  },
] as const

export const scratchJr: Generatorius = () => suBandymais(kurkScratch, A_SCRATCH, 'scratch-jr')

function kurkScratch(): Uzdavinys | null {
  const k = pasirink(KOMANDOS)
  const kiti = KOMANDOS.filter((x) => x.zenklas !== k.zenklas).slice(0, 2)
  const zingsniai = atsitiktinis(2, 4)

  return variacija([
    // 1. Kuris blokas juda nurodyta kryptimi
    () =>
      pasirinkimoUzdavinys(naujasId('scratch-jr'), 'scratch-jr', {
        klausimas: `Kuris blokas pajudina veikėją ${k.vardas}?`,
        variantai: [k.zenklas, ...kiti.map((x) => x.zenklas)],
        teisingas: 0,
        sprendimas: `Veikėją ${k.vardas} pajudina blokas su rodykle ${k.zenklas}.`,
      }),

    // 2. Kiek blokų reikia keliems žingsniams
    () =>
      uzdavinys('scratch-jr', {
        klausimas: `Veikėjas turi paeiti ${zingsniai} žingsnius į dešinę. Kiek blokų → reikia sudėti?`,
        atsakymas: String(zingsniai),
        atsakymasRodymui: `$${zingsniai}$`,
        sprendimas: `Vienas blokas — vienas žingsnis, tad reikia ${zingsniai} blokų.`,
      }),

    // 3. Blokų seka dviem kryptimis
    () => {
      const antra = pasirink(KOMANDOS.filter((x) => x.zenklas !== k.zenklas))
      const teisinga = `${k.zenklas} ${antra.zenklas}`
      const atvirkscia = `${antra.zenklas} ${k.zenklas}`
      const trecia = `${antra.zenklas} ${antra.zenklas}`
      if (teisinga === atvirkscia) return null
      return pasirinkimoUzdavinys(naujasId('scratch-jr'), 'scratch-jr', {
        klausimas: `Veikėjas turi pajudėti ${k.vardas}, o paskui ${antra.vardas}. Kuri blokų seka tinka?`,
        variantai: [teisinga, atvirkscia, trecia],
        teisingas: 0,
        sprendimas: `Blokai vykdomi iš eilės, tad pirmas turi būti ${k.zenklas}, antras — ${antra.zenklas}.`,
      })
    },

    // 4. Kas paleidžia programą
    () =>
      pasirinkimoUzdavinys(naujasId('scratch-jr'), 'scratch-jr', {
        klausimas: 'Kas atsitinka, kai paspaudžiame žalią vėliavėlę?',
        variantai: ['veikėjas pradeda vykdyti blokus', 'blokai ištrinami', 'veikėjas dingsta'],
        teisingas: 0,
        sprendimas: 'Žalia vėliavėlė paleidžia programą — veikėjas vykdo blokus iš eilės.',
      }),

    // 5. Kokia tvarka vykdomi blokai
    () =>
      pasirinkimoUzdavinys(naujasId('scratch-jr'), 'scratch-jr', {
        klausimas: 'Kokia tvarka veikėjas vykdo blokus?',
        variantai: ['iš eilės, nuo kairės į dešinę', 'atsitiktine tvarka', 'nuo paskutinio'],
        teisingas: 0,
        sprendimas: 'Blokai vykdomi iš eilės — taip, kaip jie sudėti.',
      }),
  ])
}
