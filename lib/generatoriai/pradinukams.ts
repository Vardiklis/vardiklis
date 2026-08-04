import { atsitiktinis, pasirink, suprastink, trupmenaTeX } from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * 1–5 klasių aritmetika: sudėtis ir atimtis, palyginimas, sekos, dalys,
 * pinigai, laikas, matavimo vienetai, apvalinimas, veiksmų tvarka,
 * dešimtainės trupmenos.
 *
 * Visur galioja tas pats principas: pirma nustatomas tvarkingas atsakymas,
 * tada iš jo konstruojama sąlyga.
 */

// ── Sudėtis ir atimtis ──────────────────────────────────────────────────────

const A_SUDETIS = [
  {
    klausimas: 'Apskaičiuok: $34 + 25$',
    atsakymas: '59',
    atsakymasRodymui: '$59$',
    sprendimas: 'Dešimtys: $30 + 20 = 50$. Vienetai: $4 + 5 = 9$. Iš viso 59.',
  },
] as const

export const sudetisAtimtis: Generatorius = (lygis) =>
  suBandymais(() => kurkSudeti(lygis), A_SUDETIS, 'sudetis-atimtis')

function kurkSudeti(lygis: Lygis): Uzdavinys | null {
  const riba = lygis === 1 ? 100 : 1000

  if (lygis === 3) {
    // Trys nariai su skliaustais — tikrinama ir veiksmų tvarka.
    const a = atsitiktinis(20, 300)
    const b = atsitiktinis(10, 200)
    const c = atsitiktinis(10, 200)
    const rez = a - (b + c)
    if (rez <= 0) return null

    return uzdavinys('sudetis-atimtis', {
      klausimas: `Apskaičiuok: $${a} - (${b} + ${c})$`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$`,
      sprendimas: `Pirma skliaustai: $${b} + ${c} = ${b + c}$. Tada $${a} - ${b + c} = ${rez}$.`,
    })
  }

  const atimtis = Math.random() < 0.5
  const a = atsitiktinis(lygis === 1 ? 11 : 101, riba - 1)
  const b = atsitiktinis(lygis === 1 ? 2 : 11, lygis === 1 ? 60 : 600)

  if (atimtis) {
    const rez = a - b
    if (rez <= 0) return null
    return uzdavinys('sudetis-atimtis', {
      klausimas: `Apskaičiuok: $${a} - ${b}$`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$`,
      sprendimas: `$${a} - ${b} = ${rez}$.`,
    })
  }

  const rez = a + b
  if (rez > riba) return null
  return uzdavinys('sudetis-atimtis', {
    klausimas: `Apskaičiuok: $${a} + ${b}$`,
    atsakymas: String(rez),
    atsakymasRodymui: `$${rez}$`,
    sprendimas: `$${a} + ${b} = ${rez}$.`,
  })
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

export const skaiciuPalyginimas: Generatorius = (lygis) =>
  suBandymais(() => kurkPalyginima(lygis), A_PALYGINIMAS, 'skaiciu-palyginimas')

function kurkPalyginima(lygis: Lygis): Uzdavinys | null {
  const virsus = lygis === 1 ? 100 : lygis === 2 ? 1000 : 10000

  if (lygis === 3) {
    // Skaičiaus kaimynai — patikrina supratimą apie skyrius.
    const n = atsitiktinis(100, virsus - 2)
    return uzdavinys('skaiciu-palyginimas', {
      klausimas: `Koks skaičius eina prieš pat ${n}?`,
      atsakymas: String(n - 1),
      atsakymasRodymui: `$${n - 1}$`,
      sprendimas: `Prieš ${n} eina vienetu mažesnis skaičius: ${n - 1}.`,
    })
  }

  const a = atsitiktinis(virsus / 10, virsus - 1)
  // Antrasis skaičius gaunamas sukeitus du skaitmenis — kitaip palyginimas
  // per lengvas, nes skiriasi jau pirmas skaitmuo.
  const skaitmenys = String(a).split('')
  if (skaitmenys.length < 2) return null
  const i = atsitiktinis(0, skaitmenys.length - 2)
  if (skaitmenys[i] === skaitmenys[i + 1]) return null
  ;[skaitmenys[i], skaitmenys[i + 1]] = [skaitmenys[i + 1], skaitmenys[i]]
  const b = Number(skaitmenys.join(''))
  if (b === a || String(b).length !== String(a).length) return null

  const didesnis = Math.max(a, b)
  return uzdavinys('skaiciu-palyginimas', {
    klausimas: `Kuris skaičius didesnis: ${a} ar ${b}? Įrašyk didesnįjį.`,
    atsakymas: String(didesnis),
    atsakymasRodymui: `$${didesnis}$`,
    sprendimas: `Lyginame skaitmenis iš kairės į dešinę — didesnis yra ${didesnis}.`,
  })
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

export const sekos: Generatorius = (lygis) => suBandymais(() => kurkSeka(lygis), A_SEKOS, 'sekos')

function kurkSeka(lygis: Lygis): Uzdavinys | null {
  if (lygis === 3 && Math.random() < 0.5) {
    // Geometrinė seka — kiekvienas narys kartų didesnis.
    const pradzia = atsitiktinis(1, 5)
    const daugiklis = pasirink([2, 3] as const)
    const nariai = [0, 1, 2, 3].map((i) => pradzia * daugiklis ** i)
    const kitas = pradzia * daugiklis ** 4
    if (kitas > 2000) return null

    return uzdavinys('sekos', {
      klausimas: `Koks skaičius eina toliau: $${nariai.join(', ')}, \\ldots$?`,
      atsakymas: String(kitas),
      atsakymasRodymui: `$${kitas}$`,
      sprendimas: `Kiekvienas narys ${daugiklis} kartus didesnis už ankstesnį: $${nariai[3]} \\cdot ${daugiklis} = ${kitas}$.`,
    })
  }

  const zingsnis = lygis === 1 ? pasirink([2, 3, 5, 10] as const) : atsitiktinis(3, 12)
  const mazejanti = lygis >= 2 && Math.random() < 0.4
  const pradzia = mazejanti ? atsitiktinis(60, 120) : atsitiktinis(1, 20)

  const nariai = [0, 1, 2, 3].map((i) => (mazejanti ? pradzia - i * zingsnis : pradzia + i * zingsnis))
  const kitas = mazejanti ? pradzia - 4 * zingsnis : pradzia + 4 * zingsnis
  if (kitas <= 0) return null

  return uzdavinys('sekos', {
    klausimas: `Koks skaičius eina toliau: $${nariai.join(', ')}, \\ldots$?`,
    atsakymas: String(kitas),
    atsakymasRodymui: `$${kitas}$`,
    sprendimas: `Kiekvienas narys ${zingsnis} vienetais ${
      mazejanti ? 'mažesnis' : 'didesnis'
    } už ankstesnį: $${nariai[3]} ${mazejanti ? '-' : '+'} ${zingsnis} = ${kitas}$.`,
  })
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

export const dalisIrVisuma: Generatorius = (lygis) =>
  suBandymais(() => kurkDali(lygis), A_DALIS, 'dalies-radimas')

function kurkDali(lygis: Lygis): Uzdavinys | null {
  const d = pasirink(DALYS)
  const dalis = atsitiktinis(2, lygis === 1 ? 10 : 25)
  const visuma = dalis * d.vardiklis
  if (visuma > 300) return null

  if (lygis === 2) {
    // Atvirkštinis veiksmas: žinoma dalis, ieškoma visuma.
    return uzdavinys('dalies-radimas', {
      klausimas: `${d.pavadinimas[0].toUpperCase()}${d.pavadinimas.slice(1)} skaičiaus yra ${dalis}. Koks tas skaičius?`,
      atsakymas: String(visuma),
      atsakymasRodymui: `$${visuma}$`,
      sprendimas: `Jei ${d.pavadinimas} yra ${dalis}, tai visas skaičius $${dalis} \\cdot ${d.vardiklis} = ${visuma}$.`,
    })
  }

  if (lygis === 3) {
    // Kelios dalys iš visumos.
    const skaitiklis = atsitiktinis(2, d.vardiklis - 1)
    if (d.vardiklis < 3) return null
    const rez = dalis * skaitiklis
    return uzdavinys('dalies-radimas', {
      klausimas: `Kiek yra $\\dfrac{${skaitiklis}}{${d.vardiklis}}$ nuo ${visuma}?`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$`,
      sprendimas: `Viena ${d.vardiklis}-oji dalis yra $${visuma} : ${d.vardiklis} = ${dalis}$, o ${skaitiklis} tokios dalys — $${dalis} \\cdot ${skaitiklis} = ${rez}$.`,
    })
  }

  return uzdavinys('dalies-radimas', {
    klausimas: `Kiek yra $\\dfrac{1}{${d.vardiklis}}$ nuo ${visuma}?`,
    atsakymas: String(dalis),
    atsakymasRodymui: `$${dalis}$`,
    sprendimas: `${d.pavadinimas[0].toUpperCase()}${d.pavadinimas.slice(1)} — tai dalyba iš ${
      d.vardiklis
    }: $${visuma} : ${d.vardiklis} = ${dalis}$.`,
  })
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

export const pinigai: Generatorius = (lygis) =>
  suBandymais(() => kurkPinigus(lygis), A_PINIGAI, 'pinigai')

function kurkPinigus(lygis: Lygis): Uzdavinys | null {
  // Kainos rašomos centais, kad nedingtų nė vienas centas apvalinant.
  const a = atsitiktinis(11, lygis === 1 ? 500 : 1500) * 10
  const b = atsitiktinis(11, lygis === 1 ? 500 : 1500) * 10

  if (lygis === 1) {
    const suma = a + b
    return uzdavinys('pinigai', {
      klausimas: `Vienas daiktas kainuoja ${eurais(a)} €, kitas — ${eurais(
        b,
      )} €. Kiek kainuoja abu kartu?`,
      atsakymas: eurais(suma),
      atsakymasRodymui: `$${eurais(suma).replace(',', '{,}')}$ €`,
      sprendimas: `$${eurais(a).replace(',', '{,}')} + ${eurais(b).replace(
        ',',
        '{,}',
      )} = ${eurais(suma).replace(',', '{,}')}$ €.`,
    })
  }

  if (lygis === 2) {
    // Grąža iš banknoto.
    const banknotas = pasirink([1000, 2000, 5000] as const)
    if (a >= banknotas) return null
    const graza = banknotas - a
    return uzdavinys('pinigai', {
      klausimas: `Pirkinys kainavo ${eurais(a)} €. Mokėta ${banknotas / 100} € banknotu. Kiek grąžos?`,
      atsakymas: eurais(graza),
      atsakymasRodymui: `$${eurais(graza).replace(',', '{,}')}$ €`,
      sprendimas: `$${banknotas / 100} - ${eurais(a).replace(',', '{,}')} = ${eurais(
        graza,
      ).replace(',', '{,}')}$ €.`,
    })
  }

  // 3 lygis — kiek daiktų telpa į turimą sumą.
  const kaina = atsitiktinis(2, 9) * 100
  const kiekis = atsitiktinis(3, 9)
  const turima = kaina * kiekis + atsitiktinis(0, kaina - 100)
  return uzdavinys('pinigai', {
    klausimas: `Vienas daiktas kainuoja ${kaina / 100} €. Kiek tokių daiktų galima nupirkti už ${eurais(
      turima,
    )} €?`,
    atsakymas: String(kiekis),
    atsakymasRodymui: `$${kiekis}$`,
    sprendimas: `$${kaina / 100} \\cdot ${kiekis} = ${(kaina * kiekis) / 100}$ €, o ${
      kiekis + 1
    } daiktams jau neužtektų.`,
  })
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

export const laikas: Generatorius = (lygis) =>
  suBandymais(() => kurkLaika(lygis), A_LAIKAS, 'laikas')

function kurkLaika(lygis: Lygis): Uzdavinys | null {
  if (lygis === 1) {
    const val = atsitiktinis(1, 9)
    const min = pasirink([0, 5, 10, 15, 20, 25, 30, 40, 45, 50] as const)
    const rez = val * 60 + min
    return uzdavinys('laikas', {
      klausimas:
        min === 0
          ? `Kiek minučių yra ${val} valandose?`
          : `Kiek minučių yra ${val} valandose ${min} minutėse?`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$ min`,
      sprendimas: `$${val} \\cdot 60${min ? ` + ${min}` : ''} = ${rez}$ minutės.`,
    })
  }

  if (lygis === 2) {
    const rez = atsitiktinis(2, 30)
    const sekundes = rez * 60
    return uzdavinys('laikas', {
      klausimas: `Kiek minučių yra ${sekundes} sekundžių?`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$ min`,
      sprendimas: `$${sekundes} : 60 = ${rez}$ minutės.`,
    })
  }

  // 3 lygis — kiek laiko praėjo.
  const pradziaMin = atsitiktinis(6, 20) * 60 + pasirink([0, 10, 15, 20, 30, 40, 45] as const)
  const trukme = atsitiktinis(2, 15) * 10
  const pabaigaMin = pradziaMin + trukme
  if (pabaigaMin >= 24 * 60) return null

  const uzrasas = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`

  return uzdavinys('laikas', {
    klausimas: `Renginys prasidėjo ${uzrasas(pradziaMin)} ir baigėsi ${uzrasas(
      pabaigaMin,
    )}. Kiek minučių jis truko?`,
    atsakymas: String(trukme),
    atsakymasRodymui: `$${trukme}$ min`,
    sprendimas: `Nuo ${uzrasas(pradziaMin)} iki ${uzrasas(pabaigaMin)} praėjo ${trukme} minutės.`,
  })
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

export const matavimoVienetai: Generatorius = (lygis) =>
  suBandymais(() => kurkVienetus(lygis), A_VIENETAI, 'matavimo-vienetai')

function kurkVienetus(lygis: Lygis): Uzdavinys | null {
  const v = pasirink(VIENETAI)

  if (lygis === 1) {
    const k = atsitiktinis(2, 9)
    const rez = k * v.santykis
    return uzdavinys('matavimo-vienetai', {
      klausimas: `Kiek ${v.mazasKilm} yra ${k} ${v.didelis}?`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$ ${v.mazas}`,
      sprendimas: `1 ${v.didelis} yra ${v.santykis} ${v.mazas}, tad $${k} \\cdot ${v.santykis} = ${rez}$ ${v.mazas}.`,
    })
  }

  if (lygis === 2) {
    const k = atsitiktinis(1, 9)
    const likutis = atsitiktinis(1, v.santykis - 1)
    const rez = k * v.santykis + likutis
    return uzdavinys('matavimo-vienetai', {
      klausimas: `Kiek ${v.mazasKilm} yra ${k} ${v.didelis} ${likutis} ${v.mazas}?`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$ ${v.mazas}`,
      sprendimas: `$${k} \\cdot ${v.santykis} + ${likutis} = ${rez}$ ${v.mazas}.`,
    })
  }

  // 3 lygis — atgal į stambesnį vienetą.
  const k = atsitiktinis(2, 9)
  const rez = k * v.santykis
  return uzdavinys('matavimo-vienetai', {
    klausimas: `Kiek ${v.didelisKilm} yra ${rez} ${v.mazas}?`,
    atsakymas: String(k),
    atsakymasRodymui: `$${k}$ ${v.didelis}`,
    sprendimas: `$${rez} : ${v.santykis} = ${k}$ ${v.didelis}.`,
  })
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

export const apvalinimas: Generatorius = (lygis) =>
  suBandymais(() => kurkApvalinima(lygis), A_APVALINIMAS, 'apvalinimas')

function kurkApvalinima(lygis: Lygis): Uzdavinys | null {
  const t = TIKSLUMAI[Math.min(lygis, 3) - 1]
  const n = atsitiktinis(t.verte + 1, t.verte * 20)
  const liekana = n % t.verte
  // Riba 5 — atmetam, kad nereikėtų aiškintis apvalinimo susitarimų.
  if (liekana === t.verte / 2) return null

  const rez = Math.round(n / t.verte) * t.verte
  if (rez === 0) return null

  return uzdavinys('apvalinimas', {
    klausimas: `Suapvalink ${n} iki ${t.pavadinimas}.`,
    atsakymas: String(rez),
    atsakymasRodymui: `$${rez}$`,
    sprendimas: `Liekana ${liekana} yra ${
      liekana < t.verte / 2 ? 'mažesnė' : 'didesnė'
    } už ${t.verte / 2}, tad apvaliname ${liekana < t.verte / 2 ? 'žemyn' : 'aukštyn'}: ${rez}.`,
  })
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

export const veiksmuTvarka: Generatorius = (lygis) =>
  suBandymais(() => kurkTvarka(lygis), A_TVARKA, 'veiksmu-tvarka')

function kurkTvarka(lygis: Lygis): Uzdavinys | null {
  const a = atsitiktinis(2, 20)
  const b = atsitiktinis(2, 9)
  const c = atsitiktinis(2, 9)

  if (lygis === 1) {
    const rez = a + b * c
    return uzdavinys('veiksmu-tvarka', {
      klausimas: `Apskaičiuok: $${a} + ${b} \\cdot ${c}$`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$`,
      sprendimas: `Pirma daugyba: $${b} \\cdot ${c} = ${b * c}$. Tada $${a} + ${b * c} = ${rez}$.`,
    })
  }

  if (lygis === 2) {
    const rez = (a + b) * c
    if (rez > 300) return null
    return uzdavinys('veiksmu-tvarka', {
      klausimas: `Apskaičiuok: $(${a} + ${b}) \\cdot ${c}$`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$`,
      sprendimas: `Pirma skliaustai: $${a} + ${b} = ${a + b}$. Tada $${a + b} \\cdot ${c} = ${rez}$.`,
    })
  }

  // 3 lygis — daugyba, dalyba ir skliaustai viename reiškinyje.
  const d = atsitiktinis(2, 9)
  const dalinys = b * c
  const rez = a + dalinys / c - d
  if (!Number.isInteger(rez) || rez <= 0) return null

  return uzdavinys('veiksmu-tvarka', {
    klausimas: `Apskaičiuok: $${a} + ${dalinys} : ${c} - ${d}$`,
    atsakymas: String(rez),
    atsakymasRodymui: `$${rez}$`,
    sprendimas: `Pirma dalyba: $${dalinys} : ${c} = ${b}$. Tada iš eilės: $${a} + ${b} - ${d} = ${rez}$.`,
  })
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

export const desimtaines: Generatorius = (lygis) =>
  suBandymais(() => kurkDesimtaines(lygis), A_DESIMTAINES, 'desimtaines')

function kurkDesimtaines(lygis: Lygis): Uzdavinys | null {
  if (lygis === 3) {
    // Paprastoji trupmena su vardikliu 10 ar 100 → dešimtainė.
    const vardiklis = pasirink([10, 100] as const)
    const skaitiklis = atsitiktinis(1, vardiklis - 1)
    const t = suprastink(skaitiklis, vardiklis)
    const reiksme = skaitiklis / vardiklis
    const uzrasas = String(reiksme).replace('.', ',')

    return uzdavinys('desimtaines', {
      klausimas: `Užrašyk trupmeną $${trupmenaTeX(t)}$ dešimtaine trupmena.`,
      atsakymas: uzrasas,
      atsakymasRodymui: `$${uzrasas.replace(',', '{,}')}$`,
      sprendimas: `$${skaitiklis} : ${vardiklis} = ${uzrasas.replace(',', '{,}')}$.`,
    })
  }

  const a = atsitiktinis(11, lygis === 1 ? 99 : 300)
  const b = atsitiktinis(11, lygis === 1 ? 99 : 300)
  const atimtis = Math.random() < 0.5
  const rez = atimtis ? a - b : a + b
  if (rez <= 0) return null

  const t = (n: number) => desimtainis(n).replace(',', '{,}')

  return uzdavinys('desimtaines', {
    klausimas: `Apskaičiuok: $${t(a)} ${atimtis ? '-' : '+'} ${t(b)}$`,
    atsakymas: desimtainis(rez),
    atsakymasRodymui: `$${t(rez)}$`,
    sprendimas: `Sulygiuojame kablelius ir skaičiuojame: $${t(a)} ${atimtis ? '-' : '+'} ${t(
      b,
    )} = ${t(rez)}$.`,
  })
}
