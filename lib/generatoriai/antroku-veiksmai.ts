import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys } from './formatai'
import { juostineSchema, stulpeliuVeiksmas, tieseSuSuoliu } from './pirmoku-vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 2 klasės 1 tema „Skaičiai ir skaičiavimai nuo 0 iki 100“.
 *
 * Vienuolika iš trylikos potemių rėmėsi bendruoju `sudetis-atimtis`, tad nė
 * viena negaudavo to, ką skelbia jos pavadinimas: „stulpeliu“ neduodavo
 * stulpelio, „išskaidant atėminį“ — skaidymo, „kurį būdą pasirinksi“ —
 * pasirinkimo tarp būdų.
 *
 * Vadovėlio esmė šioje temoje yra ne atsakymas, o BŪDAS: tą patį veiksmą
 * galima atlikti skaičiuojant eilute, skaidant atėminį arba rašant stulpeliu,
 * ir vaikas turi mokėti pasirinkti patogiausią. Todėl daugumoje potemių yra
 * pavidalų, kur klausiama apie tarpinį žingsnį, o ne apie galutinį skaičių.
 */

const VARDAI = ['Matas', 'Ieva', 'Emilis', 'Luknė', 'Tauras', 'Sofija', 'Arnas'] as const

/** Temos riba; be srities imama 100. */
function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 100, 100)
}

const VIENETAI = { vns: 'vienetu', dgs: 'vienetais', kilm: 'vienetų' }

// ── 1.3 Kurį sudėties būdą pasirinksi? ──────────────────────────────────────

const A_SUD_BUDAS = [
  {
    klausimas: 'Apskaičiuok patogiu būdu: $38 + 20$',
    atsakymas: '58',
    atsakymasRodymui: '$58$',
    sprendimas: 'Pridedamos tik dešimtys: $3 + 2 = 5$ dešimtys, vienetai lieka 8.',
  },
] as const

export const sudetiesBudas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSudetiesBuda(sritis), A_SUD_BUDAS, 'sudeties-budas')

function kurkSudetiesBuda(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(21, 79)
  const desimtys = atsitiktinis(1, 3) * 10
  if (a + desimtys > maks) return null

  return variacija([
    // 1. Pridedamos pilnos dešimtys — vienetai nesikeičia
    () =>
      uzdavinys('sudeties-budas', {
        klausimas: `Apskaičiuok patogiu būdu: $${a} + ${desimtys}$`,
        atsakymas: String(a + desimtys),
        atsakymasRodymui: `$${a + desimtys}$`,
        sprendimas: `Pridedamos tik dešimtys: $${Math.floor(a / 10)} + ${desimtys / 10} = ${Math.floor(a / 10) + desimtys / 10}$ dešimtys, o vienetai lieka ${a % 10}.`,
      }),

    // 2. Pridedami vienetai be dešimties peržengimo
    () => {
      const v = a % 10
      if (v > 8) return null
      const b = atsitiktinis(1, 9 - v)
      return uzdavinys('sudeties-budas', {
        klausimas: `Apskaičiuok: $${a} + ${b}$`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Dešimtys lieka, sudedami tik vienetai: $${v} + ${b} = ${v + b}$.`,
      })
    },

    // 3. Kuris būdas patogesnis peržengiant dešimtį
    () => {
      const v = a % 10
      if (v < 2) return null
      const b = atsitiktinis(11 - v, 9)
      const iki10 = 10 - v
      const pilna = a + iki10
      if (a + b > maks) return null
      return pasirinkimoUzdavinys(naujasId('sudeties-budas'), 'sudeties-budas', {
        klausimas: `Skaičiuoji $${a} + ${b}$. Kuris būdas patogesnis?`,
        variantai: [
          `pirmiausia papildyti iki ${pilna}`,
          'skaičiuoti po vieną',
          'pirmiausia atimti dešimtį',
        ],
        teisingas: 0,
        sprendimas: `Papildžius iki pilnos dešimties lieka lengvas veiksmas: $${pilna} + ${b - iki10} = ${a + b}$.`,
      })
    },

    // 4. Kuris skaidymo būdas tinka
    () => {
      const v = a % 10
      if (v < 2) return null
      const b = atsitiktinis(11 - v, 9)
      const iki10 = 10 - v
      if (a + b > maks) return null
      return pasirinkimoUzdavinys(naujasId('sudeties-budas'), 'sudeties-budas', {
        klausimas: `Kaip patogiausia išskaidyti antrą dėmenį veiksme $${a} + ${b}$?`,
        variantai: [
          `$${iki10}$ ir $${b - iki10}$`,
          `$${b - 1}$ ir $1$`,
          `$${b}$ ir $0$`,
        ],
        teisingas: 0,
        sprendimas: `Pirmoji dalis papildo ${a} iki ${a + iki10}, o likusi ${b - iki10} pridedama prie pilnos dešimties.`,
      })
    },

    // 5. Dėmenų sukeitimas vietomis
    () => {
      const x = atsitiktinis(2, 9)
      const y = atsitiktinis(21, 79)
      if (x + y > maks) return null
      return pasirinkimoUzdavinys(naujasId('sudeties-budas'), 'sudeties-budas', {
        klausimas: `Kaip patogiau skaičiuoti: $${x} + ${y}$ ar $${y} + ${x}$?`,
        variantai: [
          `$${y} + ${x}$, nes patogiau prie didesnio pridėti mažesnį`,
          `$${x} + ${y}$, nes pirmas dėmuo turi būti mažesnis`,
          'abu vienodai sunku',
        ],
        teisingas: 0,
        sprendimas: `Sukeitus dėmenis vietomis suma nepasikeičia, tad renkamės patogesnį kelią: $${y} + ${x} = ${x + y}$.`,
      })
    },

    // 6. Dėmuo, dėmuo, suma — sąvokos
    () => {
      const x = atsitiktinis(11, 49)
      const y = atsitiktinis(11, 49)
      if (x + y > maks) return null
      return uzdavinys('sudeties-budas', {
        klausimas: `Pirmas dėmuo — ${x}, antras — ${y}. Apskaičiuok sumą.`,
        atsakymas: String(x + y),
        atsakymasRodymui: `$${x + y}$`,
        sprendimas: `$${x} + ${y} = ${x + y}$.`,
      })
    },

    // 7. Sumą padidink keliais vienetais — du žingsniai
    () => {
      const x = atsitiktinis(11, 40)
      const y = atsitiktinis(11, 40)
      const pokytis = atsitiktinis(2, 9)
      if (x + y + pokytis > maks) return null
      return uzdavinys('sudeties-budas', {
        klausimas: `Skaičių ${x} ir ${y} sumą padidink ${pokytis} ${derink(pokytis, VIENETAI)}.`,
        atsakymas: String(x + y + pokytis),
        atsakymasRodymui: `$${x + y + pokytis}$`,
        sprendimas: `Pirma suma: $${x} + ${y} = ${x + y}$. Tada $${x + y} + ${pokytis} = ${x + y + pokytis}$.`,
      })
    },

    // 8. Skrybėlė uždengia skaičių — „padidink“ rodyklė
    () => {
      const pokytis = atsitiktinis(5, 12)
      if (a + pokytis > maks) return null
      return uzdavinys('sudeties-budas', {
        klausimas: `Kokį skaičių slepia skrybėlė? $${a}$ padidink ${pokytis} — gausi $\\square$`,
        atsakymas: String(a + pokytis),
        atsakymasRodymui: `$${a + pokytis}$`,
        sprendimas: `$${a} + ${pokytis} = ${a + pokytis}$.`,
      })
    },
  ])
}

// ── 1.4 Kurį atimties būdą pasirinksi? ──────────────────────────────────────

const A_ATIM_BUDAS = [
  {
    klausimas: 'Apskaičiuok patogiu būdu: $76 - 20$',
    atsakymas: '56',
    atsakymasRodymui: '$56$',
    sprendimas: 'Atimamos tik dešimtys: $7 - 2 = 5$ dešimtys, vienetai lieka 6.',
  },
] as const

export const atimtiesBudas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkAtimtiesBuda(sritis), A_ATIM_BUDAS, 'atimties-budas')

function kurkAtimtiesBuda(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(41, maks)

  return variacija([
    // 1. Atimamos pilnos dešimtys
    () => {
      const desimtys = atsitiktinis(1, 3) * 10
      if (a - desimtys < 10) return null
      return uzdavinys('atimties-budas', {
        klausimas: `Apskaičiuok patogiu būdu: $${a} - ${desimtys}$`,
        atsakymas: String(a - desimtys),
        atsakymasRodymui: `$${a - desimtys}$`,
        sprendimas: `Atimamos tik dešimtys: $${Math.floor(a / 10)} - ${desimtys / 10} = ${Math.floor(a / 10) - desimtys / 10}$ dešimtys, o vienetai lieka ${a % 10}.`,
      })
    },

    // 2. Atimami vienetai be dešimties ardymo
    () => {
      const v = a % 10
      if (v < 2) return null
      const b = atsitiktinis(1, v)
      return uzdavinys('atimties-budas', {
        klausimas: `Apskaičiuok: $${a} - ${b}$`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$`,
        sprendimas: `Dešimtys lieka, atimami tik vienetai: $${v} - ${b} = ${v - b}$.`,
      })
    },

    // 3. Kuris būdas patogesnis ardant dešimtį
    () => {
      const v = a % 10
      if (v > 7 || v < 1) return null
      const b = atsitiktinis(v + 1, 9)
      const pilna = a - v
      return pasirinkimoUzdavinys(naujasId('atimties-budas'), 'atimties-budas', {
        klausimas: `Skaičiuoji $${a} - ${b}$. Kuris būdas patogesnis?`,
        variantai: [
          `pirmiausia nusileisti iki ${pilna}`,
          'skaičiuoti po vieną',
          'pirmiausia pridėti dešimtį',
        ],
        teisingas: 0,
        sprendimas: `Nusileidus iki pilnos dešimties lieka lengvas veiksmas: $${pilna} - ${b - v} = ${a - b}$.`,
      })
    },

    // 4. Atėminio išskaidymas — kaip vadovėlyje 52 − 3 = 52 − 2 − 1
    () => {
      const v = a % 10
      if (v > 7 || v < 1) return null
      const b = atsitiktinis(v + 1, 9)
      return uzdavinys('atimties-budas', {
        klausimas: `Užbaik skaidymą: $${a} - ${b} = ${a} - ${v} - \\square$`,
        atsakymas: String(b - v),
        atsakymasRodymui: `$${b - v}$`,
        sprendimas: `${b} skaidome į ${v} ir ${b - v}: pirma nusileidžiame iki ${a - v}, paskui atimame ${b - v}.`,
      })
    },

    // 5. Atimamas dviženklis be ardymo
    () => {
      const bD = atsitiktinis(1, Math.floor(a / 10) - 1)
      const bV = atsitiktinis(1, a % 10)
      const b = bD * 10 + bV
      if (b >= a) return null
      return uzdavinys('atimties-budas', {
        klausimas: `Apskaičiuok patogiu būdu: $${a} - ${b}$`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$`,
        sprendimas: `Atimame atskirai dešimtis ir vienetus: $${a} - ${bD * 10} = ${a - bD * 10}$, tada $${a - bD * 10} - ${bV} = ${a - b}$.`,
      })
    },

    // 6. Keliais vienetais ar dešimtimis mažesnis
    () => {
      const desimtimis = atsitiktinis(0, 1) === 1
      const pokytis = desimtimis ? atsitiktinis(1, 3) : atsitiktinis(2, 7)
      const kiek = desimtimis ? pokytis * 10 : pokytis
      if (a - kiek < 1) return null
      return uzdavinys('atimties-budas', {
        klausimas: `Pasakyk skaičių, kuris ${pokytis} ${
          desimtimis
            ? derink(pokytis, { vns: 'dešimtimi', dgs: 'dešimtimis', kilm: 'dešimčių' })
            : derink(pokytis, VIENETAI)
        } mažesnis už ${a}.`,
        atsakymas: String(a - kiek),
        atsakymasRodymui: `$${a - kiek}$`,
        sprendimas: `$${a} - ${kiek} = ${a - kiek}$.`,
      })
    },

    // 7. Šuolis skaičių tiesėje
    () => {
      const b = atsitiktinis(2, 5)
      const nuo = Math.max(0, a - b - 2)
      if (a - b < 0 || a - nuo > 10) return null
      return uzdavinys('atimties-budas', {
        // Klausiama to paties, ką grąžina atsakymas: „koks veiksmas“ būtų
        // klausimas apie užrašą, o įrašomas skaičius.
        klausimas: `Skaičių tiesėje pavaizduotas šuolis atgal nuo ${a}. Prie kokio skaičiaus atsidursi?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$`,
        sprendimas: `Šuolis atgal per ${b}: $${a} - ${b} = ${a - b}$.`,
        brezinys: tieseSuSuoliu(nuo, nuo + 10, a, a - b),
      })
    },
  ])
}

// ── 1.5 Kaip rasti nežinomą skaičių? ────────────────────────────────────────

const A_NEZINOMAS = [
  {
    klausimas: 'Įrašyk: $\\square + 28 = 65$',
    atsakymas: '37',
    atsakymasRodymui: '$37$',
    sprendimas: 'Iš sumos atimame žinomą dėmenį: $65 - 28 = 37$.',
  },
] as const

export const nezinomasSkaicius: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkNezinoma(sritis), A_NEZINOMAS, 'nezinomas-skaicius')

function kurkNezinoma(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(21, 60)
  const b = atsitiktinis(11, Math.min(45, maks - a))
  if (a + b > maks) return null
  const suma = a + b

  return variacija([
    // 1. Nežinomas pirmas dėmuo
    () =>
      uzdavinys('nezinomas-skaicius', {
        klausimas: `Įrašyk: $\\square + ${b} = ${suma}$`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Iš sumos atimame žinomą dėmenį: $${suma} - ${b} = ${a}$.`,
      }),

    // 2. Nežinomas antras dėmuo
    () =>
      uzdavinys('nezinomas-skaicius', {
        klausimas: `Įrašyk: $${a} + \\square = ${suma}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Iš sumos atimame žinomą dėmenį: $${suma} - ${a} = ${b}$.`,
      }),

    // 3. Nežinomas atėminys
    () =>
      uzdavinys('nezinomas-skaicius', {
        klausimas: `Įrašyk: $${suma} - \\square = ${a}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Iš turinio atimame skirtumą: $${suma} - ${a} = ${b}$.`,
      }),

    // 4. Nežinomas turinys
    () =>
      uzdavinys('nezinomas-skaicius', {
        klausimas: `Įrašyk: $\\square - ${b} = ${a}$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Prie skirtumo pridedame atėminį: $${a} + ${b} = ${suma}$.`,
      }),

    // 5. Skaičių tiesė parodo, kiek trūksta
    () => {
      const x = atsitiktinis(11, 14)
      const y = atsitiktinis(x + 3, 20)
      return uzdavinys('nezinomas-skaicius', {
        klausimas: `Kiek reikia pridėti prie ${x}, kad gautum ${y}? $${x} + \\square = ${y}$`,
        atsakymas: String(y - x),
        atsakymasRodymui: `$${y - x}$`,
        sprendimas: `Skaičių tiesėje nuo ${x} iki ${y} yra ${y - x} žingsniai: $${y} - ${x} = ${y - x}$.`,
        brezinys: tieseSuSuoliu(x - 2, y + 1, x, y, '?'),
      })
    },

    // 6. Kaip tikrinamas atsakymas
    () =>
      pasirinkimoUzdavinys(naujasId('nezinomas-skaicius'), 'nezinomas-skaicius', {
        klausimas: `Radai, kad $${a} + \\square = ${suma}$, kai langelyje ${b}. Kaip pasitikrinti?`,
        variantai: [
          `sudėti: $${a} + ${b}$ ir gauti ${suma}`,
          `atimti: $${a} - ${b}$`,
          'nieko tikrinti nereikia',
        ],
        teisingas: 0,
        sprendimas: `Sudėjus abu dėmenis turi gautis suma: $${a} + ${b} = ${suma}$.`,
      }),
  ])
}

// ── 1.6 Sudėtis eilute peržengiant dešimtį ──────────────────────────────────

/** Du dviženkliai, kurių vienetai peržengia dešimtį. */
function poraSuPerejimu(maks: number): { a: number; b: number } | null {
  const aV = atsitiktinis(2, 9)
  const bV = atsitiktinis(11 - aV, 9)
  const aD = atsitiktinis(1, 6)
  const bD = atsitiktinis(1, Math.min(3, 8 - aD))
  const a = aD * 10 + aV
  const b = bD * 10 + bV
  if (a + b > maks) return null
  return { a, b }
}

const A_EILUTE_SUD = [
  {
    klausimas: 'Apskaičiuok eilute: $27 + 38$',
    atsakymas: '65',
    atsakymasRodymui: '$65$',
    sprendimas: '$27 + 30 = 57$, tada $57 + 8 = 65$.',
  },
] as const

export const sudetisEilute2: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkEiluteSud(sritis), A_EILUTE_SUD, 'sudetis-eilute-2')

function kurkEiluteSud(sritis?: Sritis | null): Uzdavinys | null {
  const pora = poraSuPerejimu(riba(sritis))
  if (!pora) return null
  const { a, b } = pora
  const suma = a + b
  const bD = Math.floor(b / 10) * 10
  const bV = b % 10
  const iki10 = 10 - (a % 10)

  return variacija([
    // 1. Grynas veiksmas eilute
    () =>
      uzdavinys('sudetis-eilute-2', {
        klausimas: `Apskaičiuok eilute: $${a} + ${b}$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Pirma pridedame dešimtis: $${a} + ${bD} = ${a + bD}$. Tada vienetus: $${a + bD} + ${bV} = ${suma}$.`,
      }),

    // 2. Skaidymas į dešimtis ir vienetus
    () =>
      uzdavinys('sudetis-eilute-2', {
        klausimas: `Užbaik: $${a} + ${b} = ${a} + ${bD} + \\square$`,
        atsakymas: String(bV),
        atsakymasRodymui: `$${bV}$`,
        sprendimas: `${b} skaidome į ${bD} ir ${bV}.`,
      }),

    // 3. Tarpinis rezultatas
    () =>
      uzdavinys('sudetis-eilute-2', {
        klausimas: `Skaičiuoji $${a} + ${b}$ eilute. Kiek gausi pridėjęs dešimtis?`,
        atsakymas: String(a + bD),
        atsakymasRodymui: `$${a + bD}$`,
        sprendimas: `$${a} + ${bD} = ${a + bD}$.`,
      }),

    // 4. Papildymas iki pilnos dešimties
    () => {
      if (bV < iki10) return null
      return uzdavinys('sudetis-eilute-2', {
        klausimas: `Užbaik skaidymą: $${a} + ${b} = ${a} + ${iki10} + \\square$`,
        atsakymas: String(b - iki10),
        atsakymasRodymui: `$${b - iki10}$`,
        sprendimas: `Pirma papildome ${a} iki ${a + iki10}, o iš ${b} lieka ${b - iki10}.`,
      })
    },

    // 5. Pasirinkimas
    () => {
      const netiesos = [...new Set([suma - 10, suma + 1, suma - 1])].filter(
        (x) => x > 0 && x !== suma && x <= 100,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('sudetis-eilute-2'), 'sudetis-eilute-2', {
        klausimas: `Pasirink teisingą atsakymą: $${a} + ${b}$`,
        variantai: [String(suma), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${a} + ${bD} = ${a + bD}$, tada $${a + bD} + ${bV} = ${suma}$.`,
      })
    },
  ])
}

// ── 1.7 Sudėtis stulpeliu peržengiant dešimtį ───────────────────────────────

const A_STULP_SUD = [
  {
    klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
    atsakymas: '85',
    atsakymasRodymui: '$85$',
    sprendimas: 'Vienetai: $7 + 8 = 15$. Rašome 5, dešimtį perkeliame: $4 + 3 + 1 = 8$.',
  },
] as const

export const sudetisStulpeliu2: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkStulpeliuSud(sritis), A_STULP_SUD, 'sudetis-stulpeliu-2')

function kurkStulpeliuSud(sritis?: Sritis | null): Uzdavinys | null {
  const pora = poraSuPerejimu(riba(sritis))
  if (!pora) return null
  const { a, b } = pora
  const suma = a + b
  const aV = a % 10
  const bV = b % 10
  const aD = Math.floor(a / 10)
  const bD = Math.floor(b / 10)

  return variacija([
    // 1. Koks atsakymas
    () =>
      uzdavinys('sudetis-stulpeliu-2', {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Vienetai: $${aV} + ${bV} = ${aV + bV}$. Rašome ${(aV + bV) % 10}, o susidariusią dešimtį perkeliame: $${aD} + ${bD} + 1 = ${aD + bD + 1}$.`,
        brezinys: stulpeliuVeiksmas(a, b, '+'),
      }),

    // 2. Koks skaitmuo rašomas vienetų vietoje
    () =>
      uzdavinys('sudetis-stulpeliu-2', {
        klausimas: 'Koks skaitmuo rašomas vienetų skyriuje?',
        atsakymas: String((aV + bV) % 10),
        atsakymasRodymui: `$${(aV + bV) % 10}$`,
        sprendimas: `$${aV} + ${bV} = ${aV + bV}$ — vienetų skyriuje rašome ${(aV + bV) % 10}, o dešimtį pasižymime prie dešimčių.`,
        brezinys: stulpeliuVeiksmas(a, b, '+'),
      }),

    // 3. Kiek dešimčių sumoje
    () =>
      uzdavinys('sudetis-stulpeliu-2', {
        klausimas: 'Kiek dešimčių bus sumoje?',
        atsakymas: String(aD + bD + 1),
        atsakymasRodymui: `$${aD + bD + 1}$`,
        sprendimas: `Prie ${aD} ir ${bD} dešimčių prisideda dar viena, susidariusi iš vienetų: $${aD} + ${bD} + 1 = ${aD + bD + 1}$.`,
        brezinys: stulpeliuVeiksmas(a, b, '+'),
      }),

    // 4. Rask klaidą — pamiršta perkelta dešimtis
    () => {
      const klaidingas = suma - 10
      if (klaidingas <= 0) return null
      return pasirinkimoUzdavinys(naujasId('sudetis-stulpeliu-2'), 'sudetis-stulpeliu-2', {
        klausimas: 'Veiksmas atliktas su klaida. Kur suklysta?',
        variantai: [
          'pamiršta perkelta dešimtis',
          'sudėti ne tie vienetai',
          'skaičiai užrašyti ne vienas po kitu',
        ],
        teisingas: 0,
        sprendimas: `Iš vienetų susidaro dešimtis, tad teisingas atsakymas yra ${suma}, o ne ${klaidingas}.`,
        brezinys: stulpeliuVeiksmas(a, b, '+', klaidingas),
      })
    },

    // 5. Ar susidaro nauja dešimtis
    () =>
      pasirinkimoUzdavinys(naujasId('sudetis-stulpeliu-2'), 'sudetis-stulpeliu-2', {
        klausimas: 'Ar sudedant vienetus susidaro nauja dešimtis?',
        variantai: ['taip, ją reikia pasižymėti', 'ne, nesusidaro', 'susidaro dvi dešimtys'],
        teisingas: 0,
        sprendimas: `$${aV} + ${bV} = ${aV + bV}$ — tai daugiau nei 10, tad viena dešimtis perkeliama.`,
        brezinys: stulpeliuVeiksmas(a, b, '+'),
      }),
  ])
}

// ── 1.8 Iš pilnų dešimčių atimti dviženklį ──────────────────────────────────

const A_DESIMTYS_MINUS = [
  {
    klausimas: 'Apskaičiuok: $60 - 24$',
    atsakymas: '36',
    atsakymasRodymui: '$36$',
    sprendimas: '$60 - 20 = 40$, tada $40 - 4 = 36$.',
  },
] as const

export const desimtysMinusDvizenklis: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDesimtysMinus(sritis), A_DESIMTYS_MINUS, 'desimtys-minus-dvizenklis')

function kurkDesimtysMinus(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(4, Math.floor(maks / 10)) * 10
  const bD = atsitiktinis(1, a / 10 - 1)
  const bV = atsitiktinis(1, 9)
  const b = bD * 10 + bV
  if (b >= a) return null
  const sk = a - b

  return variacija([
    // 1. Grynas veiksmas
    () =>
      uzdavinys('desimtys-minus-dvizenklis', {
        klausimas: `Apskaičiuok: $${a} - ${b}$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${bD * 10} = ${a - bD * 10}$, tada $${a - bD * 10} - ${bV} = ${sk}$.`,
      }),

    // 2. Atėminio skaidymas parodytas
    () =>
      uzdavinys('desimtys-minus-dvizenklis', {
        klausimas: `Užbaik: $${a} - ${b} = ${a} - ${bD * 10} - \\square$`,
        atsakymas: String(bV),
        atsakymasRodymui: `$${bV}$`,
        sprendimas: `Atėminį ${b} skaidome į ${bD * 10} ir ${bV}.`,
      }),

    // 3. Kiek lieka atėmus dešimtis
    () =>
      uzdavinys('desimtys-minus-dvizenklis', {
        klausimas: `Skaičiuoji $${a} - ${b}$. Kiek liks atėmus tik dešimtis?`,
        atsakymas: String(a - bD * 10),
        atsakymasRodymui: `$${a - bD * 10}$`,
        sprendimas: `$${a} - ${bD * 10} = ${a - bD * 10}$.`,
      }),

    // 4. Pasirinkimas
    () => {
      const netiesos = [...new Set([sk + 10, sk - 10, sk + 1])].filter(
        (x) => x > 0 && x !== sk && x <= maks,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(
        naujasId('desimtys-minus-dvizenklis'),
        'desimtys-minus-dvizenklis',
        {
          klausimas: `Pasirink teisingą atsakymą: $${a} - ${b}$`,
          variantai: [String(sk), ...netiesos.slice(0, 2).map(String)],
          teisingas: 0,
          sprendimas: `$${a} - ${bD * 10} = ${a - bD * 10}$, tada $${a - bD * 10} - ${bV} = ${sk}$.`,
        },
      )
    },

    // 5. Kodėl reikia išardyti dešimtį
    () =>
      pasirinkimoUzdavinys(
        naujasId('desimtys-minus-dvizenklis'),
        'desimtys-minus-dvizenklis',
        {
          klausimas: `Kodėl skaičiuojant $${a} - ${b}$ tenka išardyti dešimtį?`,
          variantai: [
            `${a} neturi nė vieno vieneto`,
            `${b} yra per didelis`,
            'dešimtys visada ardomos',
          ],
          teisingas: 0,
          sprendimas: `Pilna dešimtis vienetų skyriuje turi 0, o atimti reikia ${bV}, tad viena dešimtis išardoma.`,
        },
      ),

    // 6. Stulpeliu
    () =>
      uzdavinys('desimtys-minus-dvizenklis', {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Vienetų nėra, tad skolinamės dešimtį: $10 - ${bV} = ${10 - bV}$, o dešimčių lieka ${a / 10 - 1 - bD}.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),
  ])
}

// ── 1.9 Atimtis eilute išskaidant atėminį ───────────────────────────────────

/** Du dviženkliai, kurių vienetų neužtenka — atėminį tenka skaidyti. */
function atimtisSuArdymu(maks: number): { a: number; b: number } | null {
  const aV = atsitiktinis(1, 7)
  const bV = atsitiktinis(aV + 1, 9)
  const aD = atsitiktinis(4, Math.floor(maks / 10))
  const bD = atsitiktinis(1, aD - 2)
  const a = aD * 10 + aV
  const b = bD * 10 + bV
  if (a > maks || b >= a) return null
  return { a, b }
}

const A_EILUTE_ATIM = [
  {
    klausimas: 'Apskaičiuok eilute: $74 - 32$',
    atsakymas: '42',
    atsakymasRodymui: '$42$',
    sprendimas: '$74 - 30 = 44$, tada $44 - 2 = 42$.',
  },
] as const

export const atimtisEilute2: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkEiluteAtim(sritis), A_EILUTE_ATIM, 'atimtis-eilute-2')

function kurkEiluteAtim(sritis?: Sritis | null): Uzdavinys | null {
  const pora = atimtisSuArdymu(riba(sritis))
  if (!pora) return null
  const { a, b } = pora
  const sk = a - b
  const bD = Math.floor(b / 10) * 10
  const bV = b % 10
  const poDesimciu = a - bD
  const aV = a % 10

  return variacija([
    // 1. Grynas veiksmas eilute
    () =>
      uzdavinys('atimtis-eilute-2', {
        klausimas: `Apskaičiuok eilute: $${a} - ${b}$`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Pirma atimame dešimtis: $${a} - ${bD} = ${poDesimciu}$. Tada vienetus: $${poDesimciu} - ${bV} = ${sk}$.`,
      }),

    // 2. Atėminio skaidymas į dešimtis ir vienetus
    () =>
      uzdavinys('atimtis-eilute-2', {
        klausimas: `Užbaik: $${a} - ${b} = ${a} - ${bD} - \\square$`,
        atsakymas: String(bV),
        atsakymasRodymui: `$${bV}$`,
        sprendimas: `Atėminį ${b} skaidome į ${bD} ir ${bV}.`,
      }),

    // 3. Tarpinis rezultatas
    () =>
      uzdavinys('atimtis-eilute-2', {
        klausimas: `Skaičiuoji $${a} - ${b}$ eilute. Kiek liks atėmus dešimtis?`,
        atsakymas: String(poDesimciu),
        atsakymasRodymui: `$${poDesimciu}$`,
        sprendimas: `$${a} - ${bD} = ${poDesimciu}$.`,
      }),

    // 4. Antras skaidymas — vienetai per pilną dešimtį
    () =>
      uzdavinys('atimtis-eilute-2', {
        klausimas: `Toliau skaičiuoji $${poDesimciu} - ${bV}$. Užbaik: $${poDesimciu} - ${aV} - \\square$`,
        atsakymas: String(bV - aV),
        atsakymasRodymui: `$${bV - aV}$`,
        sprendimas: `${bV} skaidome į ${aV} ir ${bV - aV}: pirma nusileidžiame iki ${poDesimciu - aV}, paskui atimame ${bV - aV}.`,
      }),

    // 5. Kuris skaidymas teisingas
    () =>
      pasirinkimoUzdavinys(naujasId('atimtis-eilute-2'), 'atimtis-eilute-2', {
        klausimas: `Kuris skaidymas tinka veiksmui $${a} - ${b}$?`,
        // Netiesos turi būti tikros klaidos, o ne ta pati pora kita tvarka:
        // ${bV} ir ${bD} sudėti duotų tą patį atėminį, tad atsakymai būtų du.
        variantai: [
          `$${bD}$ ir $${bV}$`,
          `$${bD}$ ir $${bV + 1}$`,
          `$${b}$ ir $0$`,
        ],
        teisingas: 0,
        sprendimas: `Atėminys skaidomas į dešimtis ir vienetus: ${b} = ${bD} + ${bV}.`,
      }),
  ])
}

// ── 1.10 Atimtis stulpeliu išardant dešimtį ─────────────────────────────────

const A_STULP_ATIM = [
  {
    klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
    atsakymas: '24',
    atsakymasRodymui: '$24$',
    sprendimas: 'Iš 2 vienetų 8 atimti negalime, tad išardome dešimtį: $12 - 8 = 4$.',
  },
] as const

export const atimtisStulpeliu2: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkStulpeliuAtim(sritis), A_STULP_ATIM, 'atimtis-stulpeliu-2')

function kurkStulpeliuAtim(sritis?: Sritis | null): Uzdavinys | null {
  const pora = atimtisSuArdymu(riba(sritis))
  if (!pora) return null
  const { a, b } = pora
  const sk = a - b
  const aV = a % 10
  const bV = b % 10
  const aD = Math.floor(a / 10)
  const bD = Math.floor(b / 10)

  return variacija([
    // 1. Koks atsakymas
    () =>
      uzdavinys('atimtis-stulpeliu-2', {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Iš ${aV} vienetų ${bV} atimti negalime, tad išardome dešimtį: $${aV + 10} - ${bV} = ${aV + 10 - bV}$. Dešimčių lieka $${aD - 1} - ${bD} = ${aD - 1 - bD}$.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),

    // 2. Kiek vienetų po dešimties išardymo
    () =>
      uzdavinys('atimtis-stulpeliu-2', {
        klausimas: 'Kiek vienetų gaunasi išardžius vieną dešimtį?',
        atsakymas: String(aV + 10 - bV),
        atsakymasRodymui: `$${aV + 10 - bV}$`,
        sprendimas: `Išardę dešimtį turime ${aV + 10} vienetų: $${aV + 10} - ${bV} = ${aV + 10 - bV}$.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),

    // 3. Kiek dešimčių lieka
    () =>
      uzdavinys('atimtis-stulpeliu-2', {
        klausimas: 'Kiek dešimčių liks skirtume?',
        atsakymas: String(aD - 1 - bD),
        atsakymasRodymui: `$${aD - 1 - bD}$`,
        sprendimas: `Vieną dešimtį išardėme, tad liko ${aD - 1}, iš jų atimame ${bD}: $${aD - 1} - ${bD} = ${aD - 1 - bD}$.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),

    // 4. Rask klaidą — dešimtis neišardyta
    () => {
      const klaidingas = (aD - bD) * 10 + Math.abs(aV - bV)
      if (klaidingas === sk) return null
      return pasirinkimoUzdavinys(naujasId('atimtis-stulpeliu-2'), 'atimtis-stulpeliu-2', {
        klausimas: 'Veiksmas atliktas su klaida. Kur suklysta?',
        variantai: [
          'vienetai atimti atvirkščiai, neišardžius dešimties',
          'sumaišyti dešimčių skaitmenys',
          'skaičiai užrašyti ne vienas po kitu',
        ],
        teisingas: 0,
        sprendimas: `Iš ${aV} atimti ${bV} negalima, tad reikia išardyti dešimtį. Teisingas atsakymas ${sk}, o ne ${klaidingas}.`,
        brezinys: stulpeliuVeiksmas(a, b, '−', klaidingas),
      })
    },

    // 5. Ar reikia skolintis
    () =>
      pasirinkimoUzdavinys(naujasId('atimtis-stulpeliu-2'), 'atimtis-stulpeliu-2', {
        klausimas: 'Ar užtenka vienetų, ar reikia išardyti dešimtį?',
        variantai: ['reikia išardyti dešimtį', 'vienetų užtenka', 'reikia išardyti dvi dešimtis'],
        teisingas: 0,
        sprendimas: `Vienetų yra ${aV}, o atimti reikia ${bV} — tad viena dešimtis išardoma.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),
  ])
}

// ── 1.11 ir 1.12 Tekstiniai uždaviniai ──────────────────────────────────────

/** Sudėties istorijos: dvi dalys, ieškoma visumos. */
const SUDETIES_ISTORIJOS = [
  {
    tekstas: (a: number, b: number) =>
      `Vienoje lentynoje yra ${a} ${derink(a, { vns: 'knyga', dgs: 'knygos', kilm: 'knygų' })}, kitoje — ${b}. Kiek knygų yra iš viso?`,
  },
  {
    tekstas: (a: number, b: number) =>
      `Į autobusą įlipo ${a} ${derink(a, { vns: 'žmogus', dgs: 'žmonės', kilm: 'žmonių' })}, kitoje stotelėje — dar ${b}. Kiek žmonių dabar autobuse?`,
  },
  {
    tekstas: (a: number, b: number, v: string, v2: string) =>
      `${v} surinko ${a} ${derink(a, { vns: 'kaštoną', dgs: 'kaštonus', kilm: 'kaštonų' })}, o ${v2} — ${b}. Kiek kaštonų jie surinko kartu?`,
  },
  {
    tekstas: (a: number, b: number) =>
      `Sporto salėje buvo ${a} ${derink(a, { vns: 'vaikas', dgs: 'vaikai', kilm: 'vaikų' })}. Atėjo dar ${b}. Kiek vaikų dabar salėje?`,
  },
] as const

const A_TEKST_SUD = [
  {
    klausimas: 'Vienoje lentynoje yra 36 knygos, kitoje — 27. Kiek knygų yra iš viso?',
    atsakymas: '63',
    atsakymasRodymui: '$63$',
    sprendimas: '$36 + 27 = 63$.',
  },
] as const

export const tekstiniaiSudeties: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTekstiniSud(sritis), A_TEKST_SUD, 'tekstiniai-sudeties')

function kurkTekstiniSud(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(21, 55)
  const b = atsitiktinis(15, Math.min(45, maks - a))
  if (a + b > maks) return null
  const [v, v2] = sumaisyk([...VARDAI]).slice(0, 2)

  return variacija([
    // 1–4. Kiekviena istorija — savas šablonas
    ...SUDETIES_ISTORIJOS.map((istorija) => () =>
      uzdavinys('tekstiniai-sudeties', {
        klausimas: istorija.tekstas(a, b, v, v2),
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Abi dalys sudedamos: $${a} + ${b} = ${a + b}$. Ats.: ${a + b}.`,
      }),
    ),

    // 5. Uždavinys su schema
    () =>
      uzdavinys('tekstiniai-sudeties', {
        klausimas: `${v} turi ${a} korteles, ${v2} — ${b}. Kiek kortelių jie turi kartu?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Schemoje žinomos abi dalys, o ieškoma visumos: $${a} + ${b} = ${a + b}$.`,
        brezinys: juostineSchema(null, a, b),
      }),
  ])
}

/** Atimties istorijos: žinoma visuma ir dalis, ieškoma likučio. */
const ATIMTIES_ISTORIJOS = [
  {
    tekstas: (a: number, b: number, v: string) =>
      `Dėžėje buvo ${a} ${derink(a, { vns: 'pieštukas', dgs: 'pieštukai', kilm: 'pieštukų' })}. ${v} paėmė ${b}. Kiek liko?`,
  },
  {
    tekstas: (a: number, b: number) =>
      `Bibliotekoje buvo ${a} ${derink(a, { vns: 'knyga', dgs: 'knygos', kilm: 'knygų' })}. Paskolino ${b}. Kiek knygų liko?`,
  },
  {
    tekstas: (a: number, b: number) =>
      `Parke žaidė ${a} ${derink(a, { vns: 'vaikas', dgs: 'vaikai', kilm: 'vaikų' })}. Namo išėjo ${b}. Kiek vaikų liko?`,
  },
  {
    tekstas: (a: number, b: number) =>
      `Turguje buvo ${a} ${derink(a, { vns: 'obuolys', dgs: 'obuoliai', kilm: 'obuolių' })}. Pardavė ${b}. Kiek obuolių liko?`,
  },
] as const

const A_TEKST_ATIM = [
  {
    klausimas: 'Dėžėje buvo 83 pieštukai. Matas paėmė 26. Kiek liko?',
    atsakymas: '57',
    atsakymasRodymui: '$57$',
    sprendimas: '$83 - 26 = 57$.',
  },
] as const

export const tekstiniaiAtimties: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTekstiniAtim(sritis), A_TEKST_ATIM, 'tekstiniai-atimties')

function kurkTekstiniAtim(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(55, maks)
  const b = atsitiktinis(21, a - 15)
  const v = pasirink(VARDAI)

  return variacija([
    // 1–4. Kiekviena istorija — savas šablonas
    ...ATIMTIES_ISTORIJOS.map((istorija) => () =>
      uzdavinys('tekstiniai-atimties', {
        klausimas: istorija.tekstas(a, b, v),
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$`,
        sprendimas: `Iš visumos atimame paimtą dalį: $${a} - ${b} = ${a - b}$. Ats.: ${a - b}.`,
      }),
    ),

    // 5. Uždavinys su schema
    () =>
      uzdavinys('tekstiniai-atimties', {
        klausimas: `Buvo ${a} ${derink(a, { vns: 'balionas', dgs: 'balionai', kilm: 'balionų' })}. Sprogo ${b}. Kiek balionų liko?`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$`,
        sprendimas: `Schemoje žinoma visuma ir viena dalis, tad ieškoma kitos: $${a} - ${b} = ${a - b}$.`,
        brezinys: juostineSchema(a, b, null),
      }),
  ])
}

// ── 1.13 Kaip sukurti ir pavaizduoti tekstinį uždavinį? ─────────────────────

const A_UZD_SCHEMA = [
  {
    klausimas: 'Kuris tekstas tinka šiai schemai?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — Vienoje dėžėje 34 obuoliai, kitoje 28. Kiek obuolių iš viso?',
    sprendimas: 'Schemoje žinomos abi dalys, o ieškoma visumos.',
  },
] as const

export const uzdavinioSchema: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkUzdavinioSchema(sritis), A_UZD_SCHEMA, 'uzdavinio-schema')

function kurkUzdavinioSchema(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(21, 50)
  const b = atsitiktinis(15, Math.min(40, maks - a))
  if (a + b > maks) return null
  const visuma = a + b

  return variacija([
    // 1. Koks tekstas tinka sudėties schemai
    () =>
      pasirinkimoUzdavinys(naujasId('uzdavinio-schema'), 'uzdavinio-schema', {
        klausimas: 'Kuris tekstas tinka šiai schemai?',
        variantai: [
          `Vienoje dėžėje ${a} obuoliai, kitoje ${b}. Kiek obuolių iš viso?`,
          `Buvo ${visuma} obuoliai, ${b} suvalgė. Kiek liko?`,
          `Buvo ${a} obuoliai, ${b} supuvo. Kiek liko?`,
        ],
        teisingas: 0,
        sprendimas: 'Schemoje žinomos abi dalys, o tuščias langelis viršuje yra visuma.',
        brezinys: juostineSchema(null, a, b),
      }),

    // 2. Kokia schema tinka tekstui
    () =>
      pasirinkimoUzdavinys(naujasId('uzdavinio-schema'), 'uzdavinio-schema', {
        klausimas: `Buvo ${visuma} obuoliai, ${b} suvalgė. Ko ieškoma šiame uždavinyje?`,
        variantai: ['dalies — kiek liko', 'visumos — kiek buvo', 'kito uždavinio klausimo'],
        teisingas: 0,
        sprendimas: 'Visuma ir viena dalis žinomos, tad ieškoma antrosios dalies.',
        brezinys: juostineSchema(visuma, b, null),
      }),

    // 3. Kuris klausimas tinka veiksmui
    () =>
      pasirinkimoUzdavinys(naujasId('uzdavinio-schema'), 'uzdavinio-schema', {
        klausimas: `Uždavinys sprendžiamas veiksmu $${visuma} - ${b}$. Kuris klausimas jam tinka?`,
        variantai: ['Kiek liko?', 'Kiek yra iš viso?', 'Kiek buvo iš pradžių?'],
        teisingas: 0,
        sprendimas: 'Atimtis rodo, kad iš visumos kažkas paimta, tad klausiama, kiek liko.',
        brezinys: juostineSchema(visuma, b, null),
      }),

    // 4. Kuriam klausimui reikia sudėties
    () =>
      pasirinkimoUzdavinys(naujasId('uzdavinio-schema'), 'uzdavinio-schema', {
        klausimas: `Paveiksle dvi grupės daiktų: ${a} ir ${b}. Kuriam klausimui spręsti reikia sudėties?`,
        variantai: [
          'Kiek daiktų iš viso?',
          'Kiek daiktų liko?',
          'Kurioje grupėje mažiau?',
        ],
        teisingas: 0,
        sprendimas: 'Sudėtis sujungia abi grupes į visumą.',
        brezinys: juostineSchema(null, a, b),
      }),

    // 5. Iš kokių dalių sudarytas uždavinys
    () =>
      pasirinkimoUzdavinys(naujasId('uzdavinio-schema'), 'uzdavinio-schema', {
        klausimas: 'Iš kokių dalių sudarytas tekstinis uždavinys?',
        variantai: [
          'sąlyga, klausimas, sprendimas ir atsakymas',
          'tik sąlyga ir atsakymas',
          'tik klausimas ir sprendimas',
        ],
        teisingas: 0,
        sprendimas: 'Sąlyga pateikia duomenis, klausimas nurodo, ko ieškoti, o sprendimas veda į atsakymą.',
      }),

    // 6. Koks skaičius įrašomas schemoje
    () =>
      uzdavinys('uzdavinio-schema', {
        klausimas: 'Koks skaičius turi būti vietoj klaustuko?',
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Visuma yra abiejų dalių suma: $${a} + ${b} = ${visuma}$.`,
        brezinys: juostineSchema(null, a, b),
      }),
  ])
}
