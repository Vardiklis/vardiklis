import { derink } from '../lietuviu'
import { atsitiktinis, pasirink, suprastink, trupmenaTeX } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { didink } from './mastas'
import { duLaikrodziai, laikrodis, langeliuEile, trupmenosJuosta } from './vaizdai'
import type { Generatorius, Lygis, Sritis, Uzdavinys } from './tipai'

/**
 * 1–5 klasių aritmetika: sudėtis ir atimtis, palyginimas, sekos, dalys,
 * pinigai, laikas, matavimo vienetai, apvalinimas, veiksmų tvarka,
 * dešimtainės trupmenos.
 *
 * Visur galioja tas pats principas: pirma nustatomas tvarkingas atsakymas,
 * tada iš jo konstruojama sąlyga.
 *
 * Antras principas, atsiradęs vėliau: skaičių ribą nustato `sritis`, o ne
 * `lygis`. Anksčiau „Sunkus“ reiškė skaičius iki 10 000 net pirmokui, nes
 * riba buvo išvedama iš sunkumo. Dabar sunkumas renka tik uždavinio pavidalą
 * — kiek žingsnių ir ar veiksmas atvirkštinis.
 */

/** Srities viršus arba senasis, iš lygio išvestas mastas 5–10 klasėms. */
function virsutine(lygis: Lygis, klase?: number, sritis?: Sritis | null): number {
  if (sritis) return sritis.max
  return didink(lygis === 1 ? 100 : lygis === 2 ? 1000 : 10000, klase)
}

// ── Sudėtis ir atimtis ──────────────────────────────────────────────────────

const A_SUDETIS = [
  {
    klausimas: 'Apskaičiuok: $34 + 25$',
    atsakymas: '59',
    atsakymasRodymui: '$59$',
    sprendimas: 'Dešimtys: $30 + 20 = 50$. Vienetai: $4 + 5 = 9$. Iš viso 59.',
  },
] as const

export const sudetisAtimtis: Generatorius = (lygis, klase, sritis) =>
  suBandymais(() => kurkSudeti(lygis, klase, sritis), A_SUDETIS, 'sudetis-atimtis')

/**
 * Vieno veiksmo tekstinių uždavinių kontekstai.
 *
 * Vienas kontekstas rinkinyje kartojosi dešimt kartų („Autobuse važiavo…“),
 * ir tai buvo pastebimiausia monotonijos dalis — labiau nei skaičiai.
 */
const KONTEKSTAI = [
  {
    ko: { vns: 'keleivis', dgs: 'keleiviai', kilm: 'keleivių' },
    pradzia: 'Autobuse važiavo',
    mazeja: (b: number) => `Stotelėje išlipo ${b},`,
    dideja: (c: number) => `o įlipo ${c}.`,
    klausimas: 'Kiek keleivių liko autobuse?',
  },
  {
    ko: { vns: 'knyga', dgs: 'knygos', kilm: 'knygų' },
    pradzia: 'Bibliotekoje buvo',
    mazeja: (b: number) => `Skaitytojai pasiėmė ${b},`,
    dideja: (c: number) => `o grąžino ${c}.`,
    klausimas: 'Kiek knygų liko bibliotekoje?',
  },
  {
    ko: { vns: 'obuolys', dgs: 'obuoliai', kilm: 'obuolių' },
    pradzia: 'Kioske ryte buvo',
    mazeja: (b: number) => `Iki pietų parduota ${b},`,
    dideja: (c: number) => `o po pietų atvežta dar ${c}.`,
    klausimas: 'Kiek obuolių yra kioske dabar?',
  },
  {
    ko: { vns: 'vaikas', dgs: 'vaikai', kilm: 'vaikų' },
    pradzia: 'Kieme žaidė',
    mazeja: (b: number) => `${b} nuėjo namo,`,
    dideja: (c: number) => `o atbėgo dar ${c}.`,
    klausimas: 'Kiek vaikų žaidžia kieme?',
  },
  {
    ko: { vns: 'dėžė', dgs: 'dėžės', kilm: 'dėžių' },
    pradzia: 'Sandėlyje buvo',
    mazeja: (b: number) => `išvežta ${b},`,
    dideja: (c: number) => `o atvežta ${c}.`,
    klausimas: 'Kiek dėžių yra sandėlyje?',
  },
] as const

/** Vieno veiksmo palyginimo kontekstai — „kiek daugiau“ tipo uždaviniams. */
const PORU_KONTEKSTAI = [
  {
    a: 'Pirmoje klasėje',
    b: 'antroje klasėje',
    ko: { vns: 'mokinys', dgs: 'mokiniai', kilm: 'mokinių' },
  },
  {
    a: 'Pirmame krepšyje',
    b: 'antrame krepšyje',
    ko: { vns: 'riešutas', dgs: 'riešutai', kilm: 'riešutų' },
  },
  {
    a: 'Pirmoje lentynoje',
    b: 'antroje lentynoje',
    ko: { vns: 'knyga', dgs: 'knygos', kilm: 'knygų' },
  },
  {
    a: 'Pirmame akvariume',
    b: 'antrame akvariume',
    ko: { vns: 'žuvytė', dgs: 'žuvytės', kilm: 'žuvyčių' },
  },
] as const

/**
 * Sudėtis ir atimtis — devyni skirtingo pavidalo uždaviniai.
 *
 * Sunkumas renka pavidalą, sritis — skaičius. Todėl „Sunkesnis“ pirmokui reiškia
 * atvirkštinį veiksmą ar du žingsnius skaičiais iki 100, o ne tą patį vieną
 * veiksmą keturženkliais skaičiais.
 */
function kurkSudeti(lygis: Lygis, klase?: number, sritis?: Sritis | null): Uzdavinys | null {
  const riba = virsutine(lygis, klase, sritis)
  const mazas = () => atsitiktinis(1, Math.max(2, Math.floor(riba * 0.4)))
  const didelis = () =>
    atsitiktinis(Math.max(1, Math.floor(riba * 0.1)), Math.max(3, Math.floor(riba * 0.9)))

  return variacija([
    // 1. Grynoji sudėtis
    () => {
      const a = didelis()
      const b = mazas()
      if (a + b > riba) return null
      return uzdavinys('sudetis-atimtis', {
        klausimas: `Apskaičiuok: $${a} + ${b}$`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$.`,
      })
    },

    // 2. Grynoji atimtis
    () => {
      const a = didelis()
      const b = mazas()
      if (a - b <= 0) return null
      return uzdavinys('sudetis-atimtis', {
        klausimas: `Apskaičiuok: $${a} - ${b}$`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$`,
        sprendimas: `$${a} - ${b} = ${a - b}$.`,
      })
    },

    // 3. Trūkstamas dėmuo — atvirkštinis veiksmas, tad ne lengviausiam lygiui
    () => {
      if (lygis === 1) return null
      const a = didelis()
      const b = mazas()
      if (a + b > riba) return null
      return uzdavinys('sudetis-atimtis', {
        klausimas: `Koks skaičius turi būti vietoj langelio? $${a} + \\square = ${a + b}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Iš sumos atimame žinomą dėmenį: $${a + b} - ${a} = ${b}$.`,
      })
    },

    // 4. Trūkstamas turinys
    () => {
      if (lygis === 1) return null
      const b = mazas()
      const rez = didelis()
      if (rez + b > riba) return null
      return uzdavinys('sudetis-atimtis', {
        klausimas: `Koks skaičius turi būti vietoj langelio? $\\square - ${b} = ${rez}$`,
        atsakymas: String(rez + b),
        atsakymasRodymui: `$${rez + b}$`,
        sprendimas: `Prie skirtumo pridedame atėminį: $${rez} + ${b} = ${rez + b}$.`,
      })
    },

    // 5. Trys nariai — du žingsniai
    () => {
      if (lygis === 1) return null
      const a = didelis()
      const b = mazas()
      const c = mazas()
      const rez = a + b - c
      if (rez <= 0 || a + b > riba) return null
      return uzdavinys('sudetis-atimtis', {
        klausimas: `Apskaičiuok: $${a} + ${b} - ${c}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Iš eilės: $${a} + ${b} = ${a + b}$, tada $${a + b} - ${c} = ${rez}$.`,
      })
    },

    // 6. Tekstinis uždavinys, du pokyčiai
    () => {
      if (lygis === 1) return null
      const k = pasirink(KONTEKSTAI)
      const pradzia = didelis()
      const isejo = mazas()
      const iejo = mazas()
      const rez = pradzia - isejo + iejo
      if (isejo >= pradzia || rez > riba) return null
      return uzdavinys('sudetis-atimtis', {
        klausimas: `${k.pradzia} ${pradzia} ${derink(pradzia, k.ko)}. ${k.mazeja(isejo)} ${k.dideja(iejo)} ${k.klausimas}`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${pradzia} - ${isejo} = ${pradzia - isejo}$, tada $${pradzia - isejo} + ${iejo} = ${rez}$.`,
      })
    },

    // 7. Kiek daugiau
    () => {
      const a = didelis()
      const b = didelis()
      if (a === b) return null
      const [d, m] = a > b ? [a, b] : [b, a]
      return uzdavinys('sudetis-atimtis', {
        klausimas: `Kiek ${d} didesnis už ${m}?`,
        atsakymas: String(d - m),
        atsakymasRodymui: `$${d - m}$`,
        sprendimas: `$${d} - ${m} = ${d - m}$.`,
      })
    },

    // 8. Tekstinis palyginimas
    () => {
      const k = pasirink(PORU_KONTEKSTAI)
      const a = didelis()
      const b = mazas()
      if (a + b > riba) return null
      return uzdavinys('sudetis-atimtis', {
        klausimas: `${k.a} yra ${a} ${derink(a, k.ko)}, o ${k.b} — ${b} daugiau. Kiek ${k.ko.kilm} yra ${k.b}?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `„${b} daugiau“ reiškia sudėtį: $${a} + ${b} = ${a + b}$.`,
      })
    },

    // 9. Suma padalyta į du dėmenis — patikrina veiksmų ryšį
    () => {
      const suma = didelis()
      const a = atsitiktinis(1, Math.max(1, suma - 1))
      if (suma - a <= 0) return null
      return uzdavinys('sudetis-atimtis', {
        klausimas: `Du skaičiai kartu sudaro ${suma}. Vienas iš jų yra ${a}. Koks yra kitas?`,
        atsakymas: String(suma - a),
        atsakymasRodymui: `$${suma - a}$`,
        sprendimas: `Iš sumos atimame žinomą dėmenį: $${suma} - ${a} = ${suma - a}$.`,
      })
    },
  ])
}

// ── Skaičių palyginimas ─────────────────────────────────────────────────────

const A_PALYGINIMAS = [
  {
    klausimas: 'Kuris skaičius didesnis: 348 ar 384? Įrašyk didesnįjį.',
    atsakymas: '384',
    atsakymasRodymui: '$384$',
    sprendimas: 'Šimtai vienodi, o dešimtys 8 > 4, tad 384 didesnis.',
  },
] as const

export const skaiciuPalyginimas: Generatorius = (lygis, klase, sritis) =>
  suBandymais(() => kurkPalyginima(lygis, klase, sritis), A_PALYGINIMAS, 'skaiciu-palyginimas')

/**
 * Skaičių palyginimas.
 *
 * Iš čia sąmoningai pašalintas „koks skaičius eina prieš pat N“ pavidalas:
 * tai gretimų skaičių potemė (`gretimi-skaiciai`), o ne palyginimas. Jis
 * anksčiau buvo vienintelis pavidalas prie „Sunkus“, todėl visas rinkinys
 * išeidavo iš vieno šablono ir dar ne tos potemės.
 */
function kurkPalyginima(lygis: Lygis, klase?: number, sritis?: Sritis | null): Uzdavinys | null {
  const virsus = sritis ? sritis.max : lygis === 1 ? 100 : lygis === 2 ? 1000 : 10000
  const apacia = sritis ? sritis.min : 0
  if (virsus - apacia < 8) return null
  const n = () => atsitiktinis(apacia, virsus)

  return variacija([
    // 1. Kuris didesnis — su sukeistais skaitmenimis, kad nepakaktų žvilgsnio
    () => {
      const a = atsitiktinis(Math.max(apacia, Math.floor(virsus / 10)), virsus)
      const skaitmenys = String(a).split('')
      if (skaitmenys.length < 2) return null
      const i = atsitiktinis(0, skaitmenys.length - 2)
      if (skaitmenys[i] === skaitmenys[i + 1]) return null
      ;[skaitmenys[i], skaitmenys[i + 1]] = [skaitmenys[i + 1], skaitmenys[i]]
      const b = Number(skaitmenys.join(''))
      if (b === a || String(b).length !== String(a).length) return null
      if (b < apacia || b > virsus) return null

      const didesnis = Math.max(a, b)
      return uzdavinys('skaiciu-palyginimas', {
        klausimas: `Kuris skaičius didesnis: ${a} ar ${b}? Įrašyk didesnįjį.`,
        atsakymas: String(didesnis),
        atsakymasRodymui: `$${didesnis}$`,
        sprendimas: `Lyginame skaitmenis iš kairės į dešinę — didesnis yra ${didesnis}.`,
      })
    },

    // 2. Kuris mažesnis
    () => {
      const a = n()
      const b = n()
      if (a === b) return null
      const mazesnis = Math.min(a, b)
      return uzdavinys('skaiciu-palyginimas', {
        klausimas: `Kuris skaičius mažesnis: ${a} ar ${b}? Įrašyk mažesnįjį.`,
        atsakymas: String(mazesnis),
        atsakymasRodymui: `$${mazesnis}$`,
        sprendimas: `Lyginame skaitmenis iš kairės į dešinę — mažesnis yra ${mazesnis}.`,
      })
    },

    // 3. Didžiausias iš trijų
    () => {
      const trys = [n(), n(), n()]
      if (new Set(trys).size < 3) return null
      const rez = Math.max(...trys)
      return uzdavinys('skaiciu-palyginimas', {
        klausimas: `Įrašyk didžiausią iš skaičių ${trys.join(', ')}.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Didžiausias iš pateiktų yra ${rez}.`,
      })
    },

    // 4. Mažiausias iš trijų
    () => {
      const trys = [n(), n(), n()]
      if (new Set(trys).size < 3) return null
      const rez = Math.min(...trys)
      return uzdavinys('skaiciu-palyginimas', {
        klausimas: `Įrašyk mažiausią iš skaičių ${trys.join(', ')}.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Mažiausias iš pateiktų yra ${rez}.`,
      })
    },

    // 5. Didesnis už vieną, mažesnis už kitą
    () => {
      if (lygis === 1) return null
      // Tarpas lygiai 2 — kitaip atsakymas nebūtų vienareikšmis.
      const a = atsitiktinis(apacia, virsus - 2)
      const b = a + 2
      const rez = a + 1
      return uzdavinys('skaiciu-palyginimas', {
        klausimas: `Koks skaičius yra didesnis už ${a} ir mažesnis už ${b}?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Tarp ${a} ir ${b} telpa vienintelis skaičius — ${rez}.`,
      })
    },

    // 6. Kiek skaičių telpa tarp dviejų (sunkus)
    () => {
      if (lygis === 1) return null
      const a = atsitiktinis(apacia, virsus - 10)
      const b = a + atsitiktinis(3, 9)
      if (b > virsus) return null
      return uzdavinys('skaiciu-palyginimas', {
        klausimas: `Kiek skaičių yra tarp ${a} ir ${b}?`,
        atsakymas: String(b - a - 1),
        atsakymasRodymui: `$${b - a - 1}$`,
        sprendimas: `Nuo ${a + 1} iki ${b - 1} yra ${b - a - 1} ${derink(b - a - 1, { vns: 'skaičius', dgs: 'skaičiai', kilm: 'skaičių' })}.`,
      })
    },
  ])
}

// ── Sekos ───────────────────────────────────────────────────────────────────

const A_SEKOS = [
  {
    klausimas: 'Koks skaičius eina toliau: $3, 6, 9, 12, \\ldots$?',
    atsakymas: '15',
    atsakymasRodymui: '$15$',
    sprendimas: 'Kiekvienas narys 3 vienetais didesnis už ankstesnį: $12 + 3 = 15$.',
  },
] as const

export const sekos: Generatorius = (lygis, klase, sritis) =>
  suBandymais(() => kurkSeka(lygis, klase, sritis), A_SEKOS, 'sekos')

/**
 * Skaičių sekos.
 *
 * Visi keturi rodomi nariai ir atsakymas privalo tilpti į sritį — todėl
 * žingsnį riboja ne lygis, o tai, kiek vietos lieka iki srities viršaus.
 */
function kurkSeka(lygis: Lygis, klase?: number, sritis?: Sritis | null): Uzdavinys | null {
  const virsus = virsutine(lygis, klase, sritis)
  const apacia = sritis?.min ?? 0
  // Penki nariai turi tilpti, tad žingsnis negali būti didesnis nei ketvirtadalis.
  const maksZingsnis = Math.max(2, Math.floor((virsus - apacia) / 5))

  return variacija([
    // 1. Didėjanti seka
    () => {
      const zingsnis = Math.min(maksZingsnis, lygis === 1 ? pasirink([2, 5, 10] as const) : atsitiktinis(3, 12))
      const pradzia = atsitiktinis(apacia, Math.max(apacia, virsus - 4 * zingsnis))
      const nariai = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      const kitas = pradzia + 4 * zingsnis
      if (kitas > virsus) return null

      return uzdavinys('sekos', {
        klausimas: 'Seka didėja tolygiai. Koks skaičius eina toliau?',
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        brezinys: langeliuEile([...nariai, null], true),
        sprendimas: `Kiekvienas narys ${zingsnis} vienetais didesnis už ankstesnį: $${nariai[3]} + ${zingsnis} = ${kitas}$.`,
      })
    },

    // 2. Mažėjanti seka
    () => {
      const zingsnis = Math.min(maksZingsnis, lygis === 1 ? pasirink([2, 5, 10] as const) : atsitiktinis(3, 12))
      const pradzia = atsitiktinis(apacia + 4 * zingsnis, virsus)
      const nariai = [0, 1, 2, 3].map((i) => pradzia - i * zingsnis)
      const kitas = pradzia - 4 * zingsnis
      if (kitas < apacia) return null

      return uzdavinys('sekos', {
        klausimas: 'Seka mažėja tolygiai. Koks skaičius eina toliau?',
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        brezinys: langeliuEile([...nariai, null], true),
        sprendimas: `Kiekvienas narys ${zingsnis} vienetais mažesnis už ankstesnį: $${nariai[3]} - ${zingsnis} = ${kitas}$.`,
      })
    },

    // 3. Spraga sekos viduryje
    () => {
      const zingsnis = Math.min(maksZingsnis, pasirink([2, 3, 5, 10] as const))
      const pradzia = atsitiktinis(apacia, Math.max(apacia, virsus - 4 * zingsnis))
      const nariai = [0, 1, 2, 3, 4].map((i) => pradzia + i * zingsnis)
      if (nariai[4] > virsus) return null
      const trukstamas = atsitiktinis(1, 3)

      return uzdavinys('sekos', {
        klausimas: 'Koks skaičius turi būti vietoj klaustuko?',
        atsakymas: String(nariai[trukstamas]),
        atsakymasRodymui: `$${nariai[trukstamas]}$`,
        sprendimas: `Seka didėja po ${zingsnis}, tad klaustuko vietoje ${nariai[trukstamas]}.`,
        brezinys: langeliuEile(nariai.map((v, i) => (i === trukstamas ? null : v))),
      })
    },

    // 4. Sekos taisyklė
    () => {
      if (lygis === 1) return null
      const zingsnis = Math.min(maksZingsnis, atsitiktinis(2, 12))
      const pradzia = atsitiktinis(apacia, Math.max(apacia, virsus - 3 * zingsnis))
      const nariai = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      if (nariai[3] > virsus) return null

      return uzdavinys('sekos', {
        klausimas: `Keliais vienetais didėja seka $${nariai.join(', ')}, \\ldots$?`,
        atsakymas: String(zingsnis),
        atsakymasRodymui: `$${zingsnis}$`,
        sprendimas: `$${nariai[1]} - ${nariai[0]} = ${zingsnis}$ — tiek pat skiriasi ir kitos poros.`,
      })
    },

    // 5. Geometrinė seka (sunkus, tik kai sritis leidžia)
    () => {
      if (lygis === 1) return null
      const pradzia = atsitiktinis(1, 5)
      const daugiklis = pasirink([2, 3] as const)
      const nariai = [0, 1, 2, 3].map((i) => pradzia * daugiklis ** i)
      const kitas = pradzia * daugiklis ** 4
      if (kitas > Math.min(virsus, 2000)) return null

      return uzdavinys('sekos', {
        klausimas: `Koks skaičius eina toliau: $${nariai.join(', ')}, \\ldots$?`,
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        sprendimas: `Kiekvienas narys ${daugiklis} kartus didesnis už ankstesnį: $${nariai[3]} \\cdot ${daugiklis} = ${kitas}$.`,
      })
    },
  ])
}

// ── Dalies ir visumos radimas ───────────────────────────────────────────────

const DALYS = [
  { vardiklis: 2, pavadinimas: 'pusė' },
  { vardiklis: 3, pavadinimas: 'trečdalis' },
  { vardiklis: 4, pavadinimas: 'ketvirtadalis' },
  { vardiklis: 5, pavadinimas: 'penktadalis' },
  { vardiklis: 8, pavadinimas: 'aštuntadalis' },
] as const

const A_DALIS = [
  {
    klausimas: 'Kiek yra $\\dfrac{1}{4}$ nuo 20?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Ketvirtadalis — tai dalyba iš 4: $20 : 4 = 5$.',
  },
] as const

/** Tekstiniai dalies radimo kontekstai — kad rinkinys nebūtų vien „Kiek yra…“. */
const DALIU_KONTEKSTAI = [
  {
    kur: 'Dėžutėje',
    ko: { vns: 'saldainis', dgs: 'saldainiai', kilm: 'saldainių' },
    veiksmas: 'Vaikai suvalgė',
  },
  {
    kur: 'Knygoje',
    ko: { vns: 'puslapis', dgs: 'puslapiai', kilm: 'puslapių' },
    veiksmas: 'Rasa perskaitė',
  },
  {
    kur: 'Krepšyje',
    ko: { vns: 'obuolys', dgs: 'obuoliai', kilm: 'obuolių' },
    veiksmas: 'Į pyragą sudėta',
  },
  {
    kur: 'Klasėje',
    ko: { vns: 'mokinys', dgs: 'mokiniai', kilm: 'mokinių' },
    veiksmas: 'Į ekskursiją išvyko',
  },
] as const

export const dalisIrVisuma: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkDali(lygis, sritis), A_DALIS, 'dalies-radimas')

function kurkDali(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const virsus = Math.min(sritis?.max ?? 300, 300)
  const d = pasirink(DALYS)
  const dalis = atsitiktinis(2, lygis === 1 ? 10 : 25)
  const visuma = dalis * d.vardiklis
  if (visuma > virsus) return null
  const Didžioji = `${d.pavadinimas[0].toUpperCase()}${d.pavadinimas.slice(1)}`

  return variacija([
    // 1. Dalis nuo visumos
    () =>
      uzdavinys('dalies-radimas', {
        klausimas: `Kiek yra $\\dfrac{1}{${d.vardiklis}}$ nuo ${visuma}?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `${Didžioji} — tai dalyba iš ${d.vardiklis}: $${visuma} : ${d.vardiklis} = ${dalis}$.`,
        brezinys: trupmenosJuosta(d.vardiklis, 1, `visas skaičius — ${visuma}`),
      }),

    // 2. Atvirkštinis veiksmas: žinoma dalis, ieškoma visuma
    () => {
      if (lygis === 1) return null
      return uzdavinys('dalies-radimas', {
        klausimas: `${Didžioji} skaičiaus yra ${dalis}. Koks tas skaičius?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Jei ${d.pavadinimas} yra ${dalis}, tai visas skaičius $${dalis} \\cdot ${d.vardiklis} = ${visuma}$.`,
      })
    },

    // 3. Kelios dalys iš visumos
    () => {
      if (lygis === 1 || d.vardiklis < 3) return null
      const skaitiklis = atsitiktinis(2, d.vardiklis - 1)
      const rez = dalis * skaitiklis
      return uzdavinys('dalies-radimas', {
        klausimas: `Kiek yra $\\dfrac{${skaitiklis}}{${d.vardiklis}}$ nuo ${visuma}?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Viena ${d.vardiklis}-oji dalis yra $${visuma} : ${d.vardiklis} = ${dalis}$, o ${skaitiklis} tokios dalys — $${dalis} \\cdot ${skaitiklis} = ${rez}$.`,
      })
    },

    // 4. Kiek liko atėmus dalį
    () => {
      const k = pasirink(DALIU_KONTEKSTAI)
      const liko = visuma - dalis
      if (liko <= 0) return null
      return uzdavinys('dalies-radimas', {
        klausimas: `${k.kur} buvo ${visuma} ${derink(visuma, k.ko)}. ${k.veiksmas} ${d.pavadinimas}. Kiek ${k.ko.kilm} liko?`,
        atsakymas: String(liko),
        atsakymasRodymui: `$${liko}$`,
        sprendimas: `${Didžioji} yra $${visuma} : ${d.vardiklis} = ${dalis}$, tad liko $${visuma} - ${dalis} = ${liko}$.`,
        brezinys: trupmenosJuosta(d.vardiklis, 1, `iš viso — ${visuma}`),
      })
    },

    // 5. Kelintoji dalis
    () => {
      if (lygis === 1) return null
      return uzdavinys('dalies-radimas', {
        klausimas: `Skaičius ${dalis} yra kelintoji skaičiaus ${visuma} dalis? Įrašyk vardiklį.`,
        atsakymas: String(d.vardiklis),
        atsakymasRodymui: `$${d.vardiklis}$`,
        sprendimas: `$${visuma} : ${dalis} = ${d.vardiklis}$, tad tai ${d.vardiklis}-oji dalis.`,
      })
    },

    // 6. Dalis nuo dalies žinomos visumos — tekstinis
    () => {
      if (lygis === 1) return null
      const k = pasirink(DALIU_KONTEKSTAI)
      return uzdavinys('dalies-radimas', {
        klausimas: `${k.kur} yra ${visuma} ${derink(visuma, k.ko)}. ${d.pavadinimas[0].toUpperCase()}${d.pavadinimas.slice(1)} jų yra raudoni. Kiek raudonų?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `$${visuma} : ${d.vardiklis} = ${dalis}$.`,
      })
    },
  ])
}

// ── Pinigai ─────────────────────────────────────────────────────────────────

const A_PINIGAI = [
  {
    klausimas: 'Sąsiuvinis kainuoja 2,40 €, pieštukas — 1,30 €. Kiek kainuoja abu kartu?',
    atsakymas: '3,7',
    atsakymasRodymui: '$3{,}70$ €',
    sprendimas: '$2{,}40 + 1{,}30 = 3{,}70$ €.',
  },
] as const

/** Centai kaip suma eurais su kableliu: 370 → „3,70". */
function eurais(centai: number): string {
  return `${Math.floor(centai / 100)},${String(centai % 100).padStart(2, '0')}`
}

/** Prekės, kad sąlyga nebūtų vien „vienas daiktas“ ir „kitas daiktas“. */
const PREKES = [
  { v: 'sąsiuvinis', dgs: 'sąsiuviniai', kilm: 'sąsiuvinių', tokie: 'tokie', tokiu: 'tokių' },
  { v: 'pieštukas', dgs: 'pieštukai', kilm: 'pieštukų', tokie: 'tokie', tokiu: 'tokių' },
  { v: 'trintukas', dgs: 'trintukai', kilm: 'trintukų', tokie: 'tokie', tokiu: 'tokių' },
  { v: 'liniuotė', dgs: 'liniuotės', kilm: 'liniuočių', tokie: 'tokios', tokiu: 'tokių' },
  { v: 'žurnalas', dgs: 'žurnalai', kilm: 'žurnalų', tokie: 'tokie', tokiu: 'tokių' },
  { v: 'bandelė', dgs: 'bandelės', kilm: 'bandelių', tokie: 'tokios', tokiu: 'tokių' },
  { v: 'obuolys', dgs: 'obuoliai', kilm: 'obuolių', tokie: 'tokie', tokiu: 'tokių' },
] as const

/** Suma eurais KaTeX'ui: „3,70“ → „3{,}70“. */
function eurTeX(centai: number): string {
  return eurais(centai).replace(',', '{,}')
}

export const pinigai: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkPinigus(lygis, sritis), A_PINIGAI, 'pinigai')

function kurkPinigus(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  // Kainos rašomos centais, kad nedingtų nė vienas centas apvalinant.
  const virsusEur = Math.min(sritis?.max ?? 100, 100)
  const maksKaina = Math.max(2, Math.floor(virsusEur / 2)) * 100
  const kaina = () => atsitiktinis(11, Math.floor(maksKaina / 10)) * 10
  const [p, q] = [pasirink(PREKES), pasirink(PREKES)]

  return variacija([
    // 1. Dviejų prekių suma
    () => {
      const a = kaina()
      const b = kaina()
      if ((a + b) / 100 > virsusEur) return null
      return uzdavinys('pinigai', {
        klausimas: `${p.v[0].toUpperCase()}${p.v.slice(1)} kainuoja ${eurais(a)} €, ${q.v} — ${eurais(b)} €. Kiek kainuoja abu kartu?`,
        atsakymas: eurais(a + b),
        atsakymasRodymui: `$${eurTeX(a + b)}$ €`,
        sprendimas: `$${eurTeX(a)} + ${eurTeX(b)} = ${eurTeX(a + b)}$ €.`,
      })
    },

    // 2. Grąža iš banknoto
    () => {
      const a = kaina()
      const banknotas = pasirink([1000, 2000, 5000] as const)
      if (a >= banknotas || banknotas / 100 > virsusEur) return null
      return uzdavinys('pinigai', {
        klausimas: `Pirkinys kainavo ${eurais(a)} €. Mokėta ${banknotas / 100} € banknotu. Kiek grąžos?`,
        atsakymas: eurais(banknotas - a),
        atsakymasRodymui: `$${eurTeX(banknotas - a)}$ €`,
        sprendimas: `$${banknotas / 100} - ${eurTeX(a)} = ${eurTeX(banknotas - a)}$ €.`,
      })
    },

    // 3. Kiek daiktų telpa į turimą sumą
    () => {
      if (lygis === 1) return null
      const vieneto = atsitiktinis(2, 9) * 100
      const kiekis = atsitiktinis(3, 9)
      const turima = vieneto * kiekis + atsitiktinis(0, vieneto - 100)
      if (turima / 100 > virsusEur) return null
      return uzdavinys('pinigai', {
        klausimas: `Vienas ${p.v} kainuoja ${vieneto / 100} €. Kiek ${p.tokiu} ${p.kilm} galima nupirkti už ${eurais(turima)} €?`,
        atsakymas: String(kiekis),
        atsakymasRodymui: `$${kiekis}$`,
        sprendimas: `$${vieneto / 100} \\cdot ${kiekis} = ${(vieneto * kiekis) / 100}$ €, o ${kiekis + 1} jau neužtektų.`,
      })
    },

    // 4. Kiek trūksta
    () => {
      const a = kaina()
      const turima = atsitiktinis(1, Math.max(1, Math.floor(a / 10) - 1)) * 10
      if (turima >= a) return null
      return uzdavinys('pinigai', {
        klausimas: `${p.v[0].toUpperCase()}${p.v.slice(1)} kainuoja ${eurais(a)} €, o Jonas turi ${eurais(turima)} €. Kiek jam trūksta?`,
        atsakymas: eurais(a - turima),
        atsakymasRodymui: `$${eurTeX(a - turima)}$ €`,
        sprendimas: `$${eurTeX(a)} - ${eurTeX(turima)} = ${eurTeX(a - turima)}$ €.`,
      })
    },

    // 5. Kelių vienodų prekių kaina
    () => {
      const vieneto = atsitiktinis(2, 9) * 50
      const kiekis = atsitiktinis(2, 5)
      if ((vieneto * kiekis) / 100 > virsusEur) return null
      return uzdavinys('pinigai', {
        klausimas: `Vienas ${p.v} kainuoja ${eurais(vieneto)} €. Kiek kainuoja ${kiekis} ${p.tokie} ${p.dgs}?`,
        atsakymas: eurais(vieneto * kiekis),
        atsakymasRodymui: `$${eurTeX(vieneto * kiekis)}$ €`,
        sprendimas: `$${eurTeX(vieneto)} \\cdot ${kiekis} = ${eurTeX(vieneto * kiekis)}$ €.`,
      })
    },

    // 6. Kiek brangesnė prekė
    () => {
      const a = kaina()
      const b = kaina()
      if (a === b) return null
      const [didesne, mazesne] = a > b ? [a, b] : [b, a]
      return uzdavinys('pinigai', {
        // Be būdvardžio „brangesnis“ — jis nederėtų prie moteriškos giminės prekių.
        klausimas: `${p.v[0].toUpperCase()}${p.v.slice(1)} kainuoja ${eurais(didesne)} €, ${q.v} — ${eurais(mazesne)} €. Koks kainų skirtumas?`,
        atsakymas: eurais(didesne - mazesne),
        atsakymasRodymui: `$${eurTeX(didesne - mazesne)}$ €`,
        sprendimas: `$${eurTeX(didesne)} - ${eurTeX(mazesne)} = ${eurTeX(didesne - mazesne)}$ €.`,
      })
    },
  ])
}

// ── Laikas ──────────────────────────────────────────────────────────────────

const A_LAIKAS = [
  {
    klausimas: 'Kiek minučių yra 2 valandose 15 minučių?',
    atsakymas: '135',
    atsakymasRodymui: '$135$ min',
    sprendimas: '$2 \\cdot 60 + 15 = 135$ minutės.',
  },
] as const

/** Stambesnių laiko vienetų poros — savaitės, paros, metai. */
const LAIKO_POROS = [
  { didelis: 'paroje', mazasKilm: 'valandų', santykis: 24, vienas: 'para' },
  { didelis: 'savaitėje', mazasKilm: 'dienų', santykis: 7, vienas: 'savaitė' },
  { didelis: 'metuose', mazasKilm: 'mėnesių', santykis: 12, vienas: 'metai' },
] as const

const LAIKO_IVYKIAI = [
  'Pamoka',
  'Filmas',
  'Treniruotė',
  'Repeticija',
  'Ekskursija',
  'Koncertas',
] as const

export const laikas: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkLaika(lygis, sritis), A_LAIKAS, 'laikas')

/** „1 minutė“, „5 minutės“, „10 minučių“ — sprendimų tekstui. */
function minutesZodis(n: number): string {
  return derink(n, { vns: 'minutė', dgs: 'minutės', kilm: 'minučių' })
}

/** Laikas `7:30` pavidalu. */
function valandomis(m: number): string {
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
}

function kurkLaika(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const virsus = sritis?.max ?? Infinity

  return variacija([
    // 1. Valandos → minutės
    () => {
      const val = atsitiktinis(1, 9)
      const min = pasirink([0, 5, 10, 15, 20, 25, 30, 40, 45, 50] as const)
      const rez = val * 60 + min
      if (rez > virsus) return null
      return uzdavinys('laikas', {
        klausimas:
          min === 0
            ? `Kiek minučių yra ${val} valandose?`
            : `Kiek minučių yra ${val} valandose ${min} minutėse?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$ min`,
        sprendimas: `$${val} \\cdot 60${min ? ` + ${min}` : ''} = ${rez}$ ${minutesZodis(rez)}.`,
      })
    },

    // 2. Sekundės → minutės
    () => {
      const rez = atsitiktinis(2, 30)
      const sekundes = rez * 60
      if (sekundes > virsus) return null
      return uzdavinys('laikas', {
        klausimas: `Kiek minučių yra ${sekundes} sekundžių?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$ min`,
        sprendimas: `$${sekundes} : 60 = ${rez}$ ${minutesZodis(rez)}.`,
      })
    },

    // 3. Kiek laiko truko
    () => {
      const pradziaMin = atsitiktinis(6, 20) * 60 + pasirink([0, 10, 15, 20, 30, 40, 45] as const)
      const trukme = atsitiktinis(2, 15) * 10
      const pabaigaMin = pradziaMin + trukme
      if (pabaigaMin >= 24 * 60) return null
      return uzdavinys('laikas', {
        klausimas: `${pasirink(LAIKO_IVYKIAI)} prasidėjo ${valandomis(pradziaMin)} ir baigėsi ${valandomis(pabaigaMin)}. Kiek minučių jis truko?`,
        atsakymas: String(trukme),
        atsakymasRodymui: `$${trukme}$ min`,
        sprendimas: `Nuo ${valandomis(pradziaMin)} iki ${valandomis(pabaigaMin)} praėjo ${trukme} ${minutesZodis(trukme)}.`,
        brezinys: duLaikrodziai(pradziaMin, pabaigaMin, 'pradžia', 'pabaiga'),
      })
    },

    // 4. Stambesni vienetai
    () => {
      const v = pasirink(LAIKO_POROS)
      const k = atsitiktinis(2, 9)
      const rez = k * v.santykis
      if (rez > virsus) return null
      return uzdavinys('laikas', {
        klausimas: `Kiek ${v.mazasKilm} yra ${k} ${v.didelis}?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Vienoje ${v.vienas} yra ${v.santykis}, tad $${k} \\cdot ${v.santykis} = ${rez}$.`,
      })
    },

    // 5. Kiek minučių iki pilnos valandos
    () => {
      const min = atsitiktinis(1, 11) * 5
      if (min === 60) return null
      const rodo = atsitiktinis(7, 20) * 60 + min
      return uzdavinys('laikas', {
        klausimas: 'Kiek minučių liko iki pilnos valandos?',
        atsakymas: String(60 - min),
        atsakymasRodymui: `$${60 - min}$ min`,
        sprendimas: `$60 - ${min} = ${60 - min}$ ${minutesZodis(60 - min)}.`,
        brezinys: laikrodis(rodo),
      })
    },

    // 6. Kiek liko iki įvykio — atvirkštinis laiko skaičiavimas
    () => {
      if (lygis === 1) return null
      const val = atsitiktinis(8, 20)
      const liko = atsitiktinis(1, 11) * 5
      const dabar = val * 60 - liko
      return uzdavinys('laikas', {
        klausimas: `Autobusas išvažiuoja ${valandomis(val * 60)}. Dabar ${valandomis(dabar)}. Po kiek minučių jis išvažiuos?`,
        atsakymas: String(liko),
        atsakymasRodymui: `$${liko}$ min`,
        sprendimas: `Nuo ${valandomis(dabar)} iki ${valandomis(val * 60)} yra ${liko} ${minutesZodis(liko)}.`,
        brezinys: duLaikrodziai(dabar, val * 60, 'dabar', 'išvyksta'),
      })
    },
  ])
}

// ── Matavimo vienetai ───────────────────────────────────────────────────────

const VIENETAI = [
  { didelis: 'm', didelisKilm: 'metrų', mazas: 'cm', mazasKilm: 'centimetrų', santykis: 100 },
  { didelis: 'km', didelisKilm: 'kilometrų', mazas: 'm', mazasKilm: 'metrų', santykis: 1000 },
  { didelis: 'kg', didelisKilm: 'kilogramų', mazas: 'g', mazasKilm: 'gramų', santykis: 1000 },
  { didelis: 'cm', didelisKilm: 'centimetrų', mazas: 'mm', mazasKilm: 'milimetrų', santykis: 10 },
  { didelis: 'dm', didelisKilm: 'decimetrų', mazas: 'cm', mazasKilm: 'centimetrų', santykis: 10 },
  { didelis: 'l', didelisKilm: 'litrų', mazas: 'ml', mazasKilm: 'mililitrų', santykis: 1000 },
] as const

const A_VIENETAI = [
  {
    klausimas: 'Kiek centimetrų yra 3 m?',
    atsakymas: '300',
    atsakymasRodymui: '$300$ cm',
    sprendimas: '1 m yra 100 cm, tad $3 \\cdot 100 = 300$ cm.',
  },
] as const

export const matavimoVienetai: Generatorius = (lygis, klase, sritis) =>
  suBandymais(() => kurkVienetus(lygis, sritis), A_VIENETAI, 'matavimo-vienetai')

/**
 * Matavimo vienetai.
 *
 * Vienetų pora renkama pagal sritį: 1 klasėje, kur riba yra 1000, kilometrai
 * ir metrai netinka, nes 9 km jau yra 9000 m. Anksčiau pora buvo renkama
 * aklai, ir pirmokas gaudavo penkiaženklius rezultatus.
 */
function kurkVienetus(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const virsus = sritis?.max ?? Infinity
  const tinkami = VIENETAI.filter((v) => v.santykis * 9 <= virsus)
  if (tinkami.length === 0) return null
  const v = pasirink(tinkami)

  return variacija([
    // 1. Stambesnis → smulkesnis
    () => {
      const k = atsitiktinis(2, 9)
      return uzdavinys('matavimo-vienetai', {
        klausimas: `Kiek ${v.mazasKilm} yra ${k} ${v.didelis}?`,
        atsakymas: String(k * v.santykis),
        atsakymasRodymui: `$${k * v.santykis}$ ${v.mazas}`,
        sprendimas: `1 ${v.didelis} yra ${v.santykis} ${v.mazas}, tad $${k} \\cdot ${v.santykis} = ${k * v.santykis}$ ${v.mazas}.`,
      })
    },

    // 2. Sudėtinis matmuo → smulkesnis
    () => {
      const k = atsitiktinis(1, 9)
      const likutis = atsitiktinis(1, v.santykis - 1)
      const rez = k * v.santykis + likutis
      if (rez > virsus) return null
      return uzdavinys('matavimo-vienetai', {
        klausimas: `Kiek ${v.mazasKilm} yra ${k} ${v.didelis} ${likutis} ${v.mazas}?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$ ${v.mazas}`,
        sprendimas: `$${k} \\cdot ${v.santykis} + ${likutis} = ${rez}$ ${v.mazas}.`,
      })
    },

    // 3. Smulkesnis → stambesnis
    () => {
      const k = atsitiktinis(2, 9)
      return uzdavinys('matavimo-vienetai', {
        klausimas: `Kiek ${v.didelisKilm} yra ${k * v.santykis} ${v.mazas}?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$ ${v.didelis}`,
        sprendimas: `$${k * v.santykis} : ${v.santykis} = ${k}$ ${v.didelis}.`,
      })
    },

    // 4. Kiek trūksta iki pilno stambaus vieneto
    () => {
      const turima = atsitiktinis(1, v.santykis - 1)
      return uzdavinys('matavimo-vienetai', {
        klausimas: `Turime ${turima} ${v.mazas}. Kiek ${v.mazasKilm} trūksta iki 1 ${v.didelis}?`,
        atsakymas: String(v.santykis - turima),
        atsakymasRodymui: `$${v.santykis - turima}$ ${v.mazas}`,
        sprendimas: `$${v.santykis} - ${turima} = ${v.santykis - turima}$ ${v.mazas}.`,
      })
    },

    // 5. Palyginimas per skirtingus vienetus
    () => {
      if (lygis === 1) return null
      const k = atsitiktinis(2, 8)
      const kiti = atsitiktinis(1, v.santykis - 1) + k * v.santykis
      if (kiti > virsus) return null
      return uzdavinys('matavimo-vienetai', {
        klausimas: `Kas ilgesnis ar didesnis: ${k} ${v.didelis} ar ${kiti} ${v.mazas}? Įrašyk atsakymą ${v.mazas}.`,
        atsakymas: String(kiti),
        atsakymasRodymui: `$${kiti}$ ${v.mazas}`,
        sprendimas: `${k} ${v.didelis} yra ${k * v.santykis} ${v.mazas}, o tai mažiau nei ${kiti} ${v.mazas}.`,
      })
    },

    // 6. Suma skirtingais vienetais (sunkus)
    () => {
      if (lygis === 1) return null
      const k = atsitiktinis(1, 5)
      const a = atsitiktinis(1, v.santykis - 1)
      const b = atsitiktinis(1, v.santykis - 1)
      const rez = k * v.santykis + a + b
      if (rez > virsus) return null
      return uzdavinys('matavimo-vienetai', {
        klausimas: `Kiek ${v.mazasKilm} yra ${k} ${v.didelis} ${a} ${v.mazas} ir dar ${b} ${v.mazas} kartu?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$ ${v.mazas}`,
        sprendimas: `$${k} \\cdot ${v.santykis} + ${a} + ${b} = ${rez}$ ${v.mazas}.`,
      })
    },
  ])
}

// ── Apvalinimas ─────────────────────────────────────────────────────────────

const TIKSLUMAI = [
  { verte: 10, pavadinimas: 'dešimčių' },
  { verte: 100, pavadinimas: 'šimtų' },
  { verte: 1000, pavadinimas: 'tūkstančių' },
] as const

const A_APVALINIMAS = [
  {
    klausimas: 'Suapvalink 3 847 iki šimtų.',
    atsakymas: '3800',
    atsakymasRodymui: '$3800$',
    sprendimas: 'Dešimčių skaitmuo 4 yra mažesnis už 5, tad apvaliname žemyn: 3800.',
  },
] as const

export const apvalinimas: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkApvalinima(lygis, sritis), A_APVALINIMAS, 'apvalinimas')

function kurkApvalinima(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const virsus = sritis?.max ?? Infinity
  const galimi = TIKSLUMAI.filter((t) => t.verte * 20 <= virsus)
  const t = galimi.length > 0 ? pasirink(galimi) : TIKSLUMAI[Math.min(lygis, 3) - 1]
  if (t.verte * 20 > virsus) return null

  const n = atsitiktinis(t.verte + 1, t.verte * 20)
  const liekana = n % t.verte
  // Riba 5 — atmetam, kad nereikėtų aiškintis apvalinimo susitarimų.
  if (liekana === t.verte / 2) return null
  const zemyn = liekana < t.verte / 2
  const rez = Math.round(n / t.verte) * t.verte
  if (rez === 0) return null

  return variacija([
    // 1. Suapvalink
    () =>
      uzdavinys('apvalinimas', {
        klausimas: `Suapvalink ${n} iki ${t.pavadinimas}.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Liekana ${liekana} yra ${zemyn ? 'mažesnė' : 'didesnė'} už ${t.verte / 2}, tad apvaliname ${zemyn ? 'žemyn' : 'aukštyn'}: ${rez}.`,
      }),

    // 2. Artimiausias mažesnis apvalus skaičius
    () =>
      uzdavinys('apvalinimas', {
        klausimas: `Kuris artimiausias už ${n} mažesnis skaičius dalijasi iš ${t.verte}?`,
        atsakymas: String(n - liekana),
        atsakymasRodymui: `$${n - liekana}$`,
        sprendimas: `$${n} - ${liekana} = ${n - liekana}$ — tai artimiausias mažesnis pilnas ${t.verte}.`,
      }),

    // 3. Artimiausias didesnis apvalus skaičius
    () => {
      const virsutinis = n - liekana + t.verte
      if (virsutinis > virsus) return null
      return uzdavinys('apvalinimas', {
        klausimas: `Kuris artimiausias už ${n} didesnis skaičius dalijasi iš ${t.verte}?`,
        atsakymas: String(virsutinis),
        atsakymasRodymui: `$${virsutinis}$`,
        sprendimas: `Iki ${virsutinis} trūksta $${t.verte} - ${liekana} = ${t.verte - liekana}$.`,
      })
    },

    // 4. Kiek trūksta iki apvalaus
    () => {
      if (lygis === 1) return null
      return uzdavinys('apvalinimas', {
        klausimas: `Kiek trūksta skaičiui ${n} iki artimiausio didesnio pilno ${t.verte}?`,
        atsakymas: String(t.verte - liekana),
        atsakymasRodymui: `$${t.verte - liekana}$`,
        sprendimas: `$${n - liekana + t.verte} - ${n} = ${t.verte - liekana}$.`,
      })
    },

    // 5. Atvirkštinis: koks didžiausias skaičius apvalinamas į duotą (sunkus)
    () => {
      if (lygis === 1) return null
      const didziausias = rez + t.verte / 2 - 1
      if (didziausias > virsus) return null
      return uzdavinys('apvalinimas', {
        klausimas: `Skaičius suapvalintas iki ${t.pavadinimas} tapo ${rez}. Koks didžiausias jis galėjo būti?`,
        atsakymas: String(didziausias),
        atsakymasRodymui: `$${didziausias}$`,
        sprendimas: `Aukštyn apvalinama nuo ${rez + t.verte / 2}, tad didžiausias tinkamas yra ${didziausias}.`,
      })
    },
  ])
}

// ── Veiksmų tvarka ──────────────────────────────────────────────────────────

const A_TVARKA = [
  {
    klausimas: 'Apskaičiuok: $4 + 3 \\cdot 5$',
    atsakymas: '19',
    atsakymasRodymui: '$19$',
    sprendimas: 'Pirma daugyba: $3 \\cdot 5 = 15$. Tada $4 + 15 = 19$.',
  },
] as const

export const veiksmuTvarka: Generatorius = (lygis, klase, sritis) =>
  suBandymais(() => kurkTvarka(lygis, klase, sritis), A_TVARKA, 'veiksmu-tvarka')

function kurkTvarka(lygis: Lygis, klase?: number, sritis?: Sritis | null): Uzdavinys | null {
  const virsus = sritis?.max ?? didink(300, klase)
  const a = atsitiktinis(2, didink(20, klase))
  const b = atsitiktinis(2, didink(9, klase))
  const c = atsitiktinis(2, didink(9, klase))
  const d = atsitiktinis(2, 9)

  return variacija([
    // 1. Daugyba pirmiau sudėties
    () => {
      const rez = a + b * c
      if (rez > virsus) return null
      return uzdavinys('veiksmu-tvarka', {
        klausimas: `Apskaičiuok: $${a} + ${b} \\cdot ${c}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Pirma daugyba: $${b} \\cdot ${c} = ${b * c}$. Tada $${a} + ${b * c} = ${rez}$.`,
      })
    },

    // 2. Skliaustai keičia tvarką
    () => {
      const rez = (a + b) * c
      if (rez > virsus) return null
      return uzdavinys('veiksmu-tvarka', {
        klausimas: `Apskaičiuok: $(${a} + ${b}) \\cdot ${c}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Pirma skliaustai: $${a} + ${b} = ${a + b}$. Tada $${a + b} \\cdot ${c} = ${rez}$.`,
      })
    },

    // 3. Daugyba pirmiau atimties
    () => {
      const rez = a * b - c
      if (rez <= 0 || a * b > virsus) return null
      return uzdavinys('veiksmu-tvarka', {
        klausimas: `Apskaičiuok: $${a} \\cdot ${b} - ${c}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Pirma daugyba: $${a} \\cdot ${b} = ${a * b}$. Tada $${a * b} - ${c} = ${rez}$.`,
      })
    },

    // 4. Atimtis skliaustuose
    () => {
      if (lygis === 1) return null
      const rez = a * (b - c)
      if (b <= c || rez > virsus || rez <= 0) return null
      return uzdavinys('veiksmu-tvarka', {
        klausimas: `Apskaičiuok: $${a} \\cdot (${b} - ${c})$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Pirma skliaustai: $${b} - ${c} = ${b - c}$. Tada $${a} \\cdot ${b - c} = ${rez}$.`,
      })
    },

    // 5. Dalyba, sudėtis ir atimtis viename reiškinyje
    () => {
      if (lygis === 1) return null
      const dalinys = b * c
      const rez = a + dalinys / c - d
      if (!Number.isInteger(rez) || rez <= 0 || rez > virsus || dalinys > virsus) return null
      return uzdavinys('veiksmu-tvarka', {
        klausimas: `Apskaičiuok: $${a} + ${dalinys} : ${c} - ${d}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Pirma dalyba: $${dalinys} : ${c} = ${b}$. Tada iš eilės: $${a} + ${b} - ${d} = ${rez}$.`,
      })
    },

    // 6. Kuris veiksmas atliekamas pirmas — tikrina taisyklę, ne skaičiavimą
    () => {
      if (lygis === 1) return null
      const rez = b * c
      if (a + rez > virsus) return null
      return uzdavinys('veiksmu-tvarka', {
        klausimas: `Reiškinyje $${a} + ${b} \\cdot ${c}$ pirma atliekamas vienas veiksmas. Koks jo rezultatas?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Daugyba atliekama pirmiau už sudėtį: $${b} \\cdot ${c} = ${rez}$.`,
      })
    },
  ])
}

// ── Dešimtainės trupmenos ───────────────────────────────────────────────────

const A_DESIMTAINES = [
  {
    klausimas: 'Apskaičiuok: $2{,}4 + 1{,}3$',
    atsakymas: '3,7',
    atsakymasRodymui: '$3{,}7$',
    sprendimas: 'Sudedame dešimtąsias: $4 + 3 = 7$, o sveikąsias: $2 + 1 = 3$.',
  },
] as const

/** Dešimtainis skaičius iš dešimtųjų: 37 → „3,7". */
function desimtainis(desimtosios: number): string {
  return `${Math.floor(desimtosios / 10)},${desimtosios % 10}`
}

export const desimtaines: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkDesimtaines(lygis, sritis), A_DESIMTAINES, 'desimtaines')

function kurkDesimtaines(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  // Skaičiuojama dešimtosiomis, kad neatsirastų slankaus kablelio paklaidų.
  const virsus = Math.min((sritis?.max ?? 100) * 10, lygis === 1 ? 990 : 3000)
  const t = (n: number) => desimtainis(n).replace(',', '{,}')
  const d = () => atsitiktinis(11, virsus)

  return variacija([
    // 1. Sudėtis
    () => {
      const a = d()
      const b = d()
      if (a + b > virsus) return null
      return uzdavinys('desimtaines', {
        klausimas: `Apskaičiuok: $${t(a)} + ${t(b)}$`,
        atsakymas: desimtainis(a + b),
        atsakymasRodymui: `$${t(a + b)}$`,
        sprendimas: `Sulygiuojame kablelius ir sudedame: $${t(a)} + ${t(b)} = ${t(a + b)}$.`,
      })
    },

    // 2. Atimtis
    () => {
      const a = d()
      const b = d()
      if (a - b <= 0) return null
      return uzdavinys('desimtaines', {
        klausimas: `Apskaičiuok: $${t(a)} - ${t(b)}$`,
        atsakymas: desimtainis(a - b),
        atsakymasRodymui: `$${t(a - b)}$`,
        sprendimas: `Sulygiuojame kablelius ir atimame: $${t(a)} - ${t(b)} = ${t(a - b)}$.`,
      })
    },

    // 3. Paprastoji trupmena → dešimtainė
    () => {
      const vardiklis = pasirink([10, 100] as const)
      const skaitiklis = atsitiktinis(1, vardiklis - 1)
      const tr = suprastink(skaitiklis, vardiklis)
      const uzrasas = String(skaitiklis / vardiklis).replace('.', ',')
      return uzdavinys('desimtaines', {
        klausimas: `Užrašyk trupmeną $${trupmenaTeX(tr)}$ dešimtaine trupmena.`,
        atsakymas: uzrasas,
        atsakymasRodymui: `$${uzrasas.replace(',', '{,}')}$`,
        sprendimas: `$${skaitiklis} : ${vardiklis} = ${uzrasas.replace(',', '{,}')}$.`,
      })
    },

    // 4. Kuris didesnis
    () => {
      const a = d()
      const b = d()
      if (a === b || Math.floor(a / 10) !== Math.floor(b / 10)) return null
      const didesnis = Math.max(a, b)
      return uzdavinys('desimtaines', {
        klausimas: `Kuris skaičius didesnis: $${t(a)}$ ar $${t(b)}$? Įrašyk didesnįjį.`,
        atsakymas: desimtainis(didesnis),
        atsakymasRodymui: `$${t(didesnis)}$`,
        sprendimas: `Sveikosios dalys vienodos, tad lyginame dešimtąsias — didesnis yra ${desimtainis(didesnis)}.`,
      })
    },

    // 5. Kiek dešimtųjų
    () => {
      const a = d()
      if (a % 10 === 0) return null
      return uzdavinys('desimtaines', {
        klausimas: `Kiek dešimtųjų yra skaičiuje $${t(a)}$ po kablelio?`,
        atsakymas: String(a % 10),
        atsakymasRodymui: `$${a % 10}$`,
        sprendimas: `Po kablelio stovi ${a % 10} — tiek dešimtųjų.`,
      })
    },

    // 6. Dauginimas iš 10
    () => {
      if (lygis === 1) return null
      const a = d()
      if (a > virsus) return null
      return uzdavinys('desimtaines', {
        klausimas: `Apskaičiuok: $${t(a)} \\cdot 10$`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Dauginant iš 10 kablelis pasislenka viena vieta dešinėn: $${t(a)} \\cdot 10 = ${a}$.`,
      })
    },
  ])
}
