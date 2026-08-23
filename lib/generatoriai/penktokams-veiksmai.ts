import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { D, VARDAI, kiek, sk4 } from './ketvirtokams-bendra'
import { dalybaKampu } from './ketvirtokams-vaizdai'
import { judejimoSchema5 } from './penktokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 5 klasės tema „Veiksmai su natūraliaisiais skaičiais“ — trylika potemių.
 *
 * Anksčiau jos rėmėsi `sudetis-atimtis`, `sveikieji` ir `greitis`
 * generatoriais, kurie apie pačius dėsnius neklausė nieko: mokinys gaudavo
 * `348 + 527` ir ten, kur mokoma perstatomumo, ir ten, kur mokoma jungiamumo.
 *
 * Todėl kiekvienas dėsnis čia turi savo generatorių, o klausimas keliamas apie
 * patį dėsnį: kuris užrašas jį iliustruoja, ką jis leidžia padaryti, kaip juo
 * pasinaudoti skaičiuojant patogiau. Trys paskutinės potemės — judėjimas — turi
 * schemą, iš kurios matyti, ar greičiai sudedami, ar atimami.
 */

const KM = { vns: 'kilometrą', dgs: 'kilometrus', kilm: 'kilometrų' }

// ── 2.1.1. Sudėtis. Perstatomumo dėsnis ─────────────────────────────────────

const T1 = 'sudeties-perstatomumas'

const A_PERSTATOMUMAS = [
  {
    klausimas: 'Apskaičiuok: $348 + 527$.',
    atsakymas: '875',
    atsakymasRodymui: '$875$',
    sprendimas: '$348 + 527 = 875$.',
  },
] as const

export const sudetiesPerstatomumas: Generatorius = () =>
  suBandymais(kurkPerstatomuma, A_PERSTATOMUMAS, T1)

function kurkPerstatomuma(): Uzdavinys | null {
  const a = atsitiktinis(124, 4860)
  const b = atsitiktinis(118, 3940)

  return variacija([
    // 1. Paprasta suma
    () =>
      uzdavinys(T1, {
        klausimas: `Apskaičiuok: $${sk4(a)} + ${sk4(b)}$.`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${sk4(a + b)}$`,
        sprendimas: `$${sk4(a)} + ${sk4(b)} = ${sk4(a + b)}$.`,
      }),

    // 2. Ką teigia dėsnis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ką teigia sudėties perstatomumo dėsnis?',
        variantai: [
          'sukeitus dėmenis vietomis suma nepasikeičia',
          'dėmenis galima jungti į grupes',
          'sumą galima dauginti iš skaičiaus',
          'iš sumos galima atimti dėmenį',
        ],
        teisingas: 0,
        sprendimas: `$${sk4(a)} + ${sk4(b)} = ${sk4(b)} + ${sk4(a)}$.`,
      }),

    // 3. Kuris užrašas iliustruoja dėsnį
    () => {
      const c = atsitiktinis(20, 90)
      const variantai = sumaisyk([
        `$${a} + ${b} = ${b} + ${a}$`,
        `$(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})$`,
        `$${a} \\cdot ${b} = ${b} \\cdot ${a}$`,
      ])
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuris užrašas iliustruoja sudėties perstatomumo dėsnį?',
        variantai,
        teisingas: variantai.indexOf(`$${a} + ${b} = ${b} + ${a}$`),
        sprendimas: 'Perstatomumas keičia dėmenų tvarką; jungiamumas keičia skliaustus, o trečiasis užrašas yra apie daugybą.',
      })
    },

    // 4. Patogi tvarka
    () => {
      const x = atsitiktinis(120, 480)
      const y = 1000 - (x % 1000)
      const z = atsitiktinis(200, 900)
      if (y <= 0 || y >= 1000) return null
      return uzdavinys(T1, {
        klausimas: `Sukeisk dėmenis patogia tvarka ir apskaičiuok: $${x} + ${z} + ${y}$.`,
        atsakymas: String(x + y + z),
        atsakymasRodymui: `$${sk4(x + y + z)}$`,
        sprendimas: `$${x} + ${y} = ${sk4(x + y)}$ yra apvalus, tad lieka $${sk4(x + y)} + ${z} = ${sk4(x + y + z)}$.`,
      })
    },

    // 5. Trūkstamas dėmuo
    () =>
      uzdavinys(T1, {
        klausimas: `Rask trūkstamą dėmenį: $\\square + ${sk4(b)} = ${sk4(a + b)}$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${sk4(a)}$`,
        sprendimas: `$${sk4(a + b)} - ${sk4(b)} = ${sk4(a)}$.`,
      }),

    // 6. Ar galima sukeisti
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuriuose veiksmuose galima sukeisti skaičius vietomis nepakeitus rezultato?',
        variantai: [
          'sudėtyje ir daugyboje',
          'tik sudėtyje',
          'visuose keturiuose veiksmuose',
          'atimtyje ir dalyboje',
        ],
        teisingas: 0,
        sprendimas: `$${a} - ${b}$ ir $${b} - ${a}$ duoda skirtingus rezultatus, tad atimčiai perstatomumas negalioja.`,
      }),

    // 7. Tekstinis
    () => {
      const vardas = pasirink(VARDAI)
      const pirma = atsitiktinis(140, 680)
      const antra = atsitiktinis(140, 680)
      return uzdavinys(T1, {
        klausimas: `${vardas} pirmą dieną nuvažiavo ${kiek(pirma, KM)}, antrą — ${kiek(antra, KM)}. Kiek kilometrų nuvažiuota iš viso?`,
        atsakymas: String(pirma + antra),
        atsakymasRodymui: `$${sk4(pirma + antra)}$ km`,
        sprendimas: `$${pirma} + ${antra} = ${sk4(pirma + antra)}$. Tvarka nesvarbi — suma ta pati.`,
      })
    },
  ])
}

// ── 2.1.2. Sudėties jungiamumo dėsnis ───────────────────────────────────────

const T2 = 'sudeties-jungiamumas'

const A_JUNGIAMUMAS = [
  {
    klausimas: 'Apskaičiuok patogiu būdu: $(275 + 168) + 32$.',
    atsakymas: '475',
    atsakymasRodymui: '$475$',
    sprendimas: '$168 + 32 = 200$, tad $275 + 200 = 475$.',
  },
] as const

export const sudetiesJungiamumas: Generatorius = () =>
  suBandymais(kurkJungiamuma, A_JUNGIAMUMAS, T2)

function kurkJungiamuma(): Uzdavinys | null {
  const a = atsitiktinis(120, 860)
  const b = atsitiktinis(110, 480)
  const c = 100 - (b % 100)
  if (c <= 0 || c >= 100) return null

  return variacija([
    // 1. Patogus grupavimas
    () =>
      uzdavinys(T2, {
        klausimas: `Apskaičiuok patogiu būdu: $(${a} + ${b}) + ${c}$.`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${sk4(a + b + c)}$`,
        sprendimas: `Patogiau sujungti kitus du dėmenis: $${b} + ${c} = ${b + c}$, tad $${a} + ${b + c} = ${sk4(a + b + c)}$.`,
      }),

    // 2. Ką teigia dėsnis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ką teigia sudėties jungiamumo dėsnis?',
        variantai: [
          'dėmenis galima jungti į grupes bet kaip — suma nepasikeičia',
          'dėmenis galima sukeisti vietomis',
          'sumą galima padalyti iš skaičiaus',
          'prie sumos galima pridėti nulį',
        ],
        teisingas: 0,
        sprendimas: `$(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})$.`,
      }),

    // 3. Kur patogiau dėti skliaustus
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kur patogiau dėti skliaustus skaičiuojant $${a} + ${b} + ${c}$?`,
        variantai: [
          `$${a} + (${b} + ${c})$, nes gaunamas apvalus ${b + c}`,
          `$(${a} + ${b}) + ${c}$, nes taip parašyta iš kairės`,
          'skliaustai nieko nekeičia, tad ir dėti nereikia',
        ],
        teisingas: 0,
        sprendimas: `Suma ta pati, bet $${b} + ${c} = ${b + c}$ suskaičiuojama mintinai.`,
      }),

    // 4. Keturi dėmenys
    () => {
      const x = atsitiktinis(120, 480)
      const y = 100 - (x % 100)
      const z = atsitiktinis(210, 690)
      const w = 100 - (z % 100)
      if (y <= 0 || y >= 100 || w <= 0 || w >= 100) return null
      return uzdavinys(T2, {
        klausimas: `Apskaičiuok patogiu būdu: $${x} + ${z} + ${y} + ${w}$.`,
        atsakymas: String(x + y + z + w),
        atsakymasRodymui: `$${sk4(x + y + z + w)}$`,
        sprendimas: `Sujungiamos poros, duodančios apvalius skaičius: $(${x} + ${y}) + (${z} + ${w}) = ${x + y} + ${z + w} = ${sk4(x + y + z + w)}$.`,
      })
    },

    // 5. Ar rezultatas pasikeis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar pasikeis $(${a} + ${b}) + ${c}$ reikšmė, jei skliaustus perkelsime: $${a} + (${b} + ${c})$?`,
        variantai: [
          'ne, pagal jungiamumo dėsnį suma ta pati',
          'taip, skliaustai visada keičia rezultatą',
          'taip, jei dėmenys nevienodo dydžio',
        ],
        teisingas: 0,
        sprendimas: `Abiem atvejais gaunama $${sk4(a + b + c)}$.`,
      }),

    // 6. Trūkstamas dėmuo grupėje
    () =>
      uzdavinys(T2, {
        klausimas: `Rask trūkstamą dėmenį: $${a} + (\\square + ${c}) = ${sk4(a + b + c)}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${sk4(b)}$`,
        sprendimas: `Skliaustuose turi būti $${sk4(a + b + c)} - ${a} = ${b + c}$, tad ieškomas dėmuo $${b + c} - ${c} = ${b}$.`,
      }),

    // 7. Tekstinis
    () => {
      const p1 = atsitiktinis(140, 480)
      const p2 = atsitiktinis(120, 460)
      const p3 = 100 - (p2 % 100)
      if (p3 <= 0 || p3 >= 100) return null
      return uzdavinys(T2, {
        klausimas: `Trijose dėžėse yra ${p1}, ${p2} ir ${p3} obuoliai. Kiek obuolių iš viso?`,
        atsakymas: String(p1 + p2 + p3),
        atsakymasRodymui: `$${sk4(p1 + p2 + p3)}$`,
        sprendimas: `Patogiausia pirma sudėti $${p2} + ${p3} = ${p2 + p3}$, o tada pridėti ${p1}.`,
      })
    },
  ])
}

// ── 2.2.1. Skaičių atimtis ──────────────────────────────────────────────────

const T3 = 'skaiciu-atimtis-5'

const A_ATIMTIS = [
  {
    klausimas: 'Apskaičiuok: $8\\,204 - 3\\,567$.',
    atsakymas: '4637',
    atsakymasRodymui: '$4637$',
    sprendimas: '$8204 - 3567 = 4637$.',
  },
] as const

export const skaiciuAtimtis5: Generatorius = () => suBandymais(kurkAtimti, A_ATIMTIS, T3)

function kurkAtimti(): Uzdavinys | null {
  const a = atsitiktinis(4200, 96000)
  const b = atsitiktinis(1100, 3900)

  return variacija([
    // 1. Skirtumas
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${sk4(a)} - ${sk4(b)}$.`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${sk4(a - b)}$`,
        sprendimas: `$${sk4(a)} - ${sk4(b)} = ${sk4(a - b)}$.`,
      }),

    // 2. Iš apvalaus
    () => {
      const apvalus = atsitiktinis(3, 9) * 10000
      const atem = atsitiktinis(1234, 9876)
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${sk4(apvalus)} - ${sk4(atem)}$.`,
        atsakymas: String(apvalus - atem),
        atsakymasRodymui: `$${sk4(apvalus - atem)}$`,
        sprendimas: 'Turinys apvalus, tad skolinamasi per visus skyrius iš eilės.',
      })
    },

    // 3. Nežinomas atėminys
    () =>
      uzdavinys(T3, {
        klausimas: `Rask nežinomą atėminį: $${sk4(a)} - \\square = ${sk4(a - b)}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${sk4(b)}$`,
        sprendimas: `Atėminys randamas iš turinio atėmus skirtumą: $${sk4(a)} - ${sk4(a - b)} = ${sk4(b)}$.`,
      }),

    // 4. Nežinomas turinys
    () => {
      const skirtumas = atsitiktinis(1200, 8600)
      return uzdavinys(T3, {
        klausimas: `Rask nežinomą turinį: $\\square - ${sk4(b)} = ${sk4(skirtumas)}$.`,
        atsakymas: String(skirtumas + b),
        atsakymasRodymui: `$${sk4(skirtumas + b)}$`,
        sprendimas: `Turinys yra skirtumo ir atėminio suma: $${sk4(skirtumas)} + ${sk4(b)} = ${sk4(skirtumas + b)}$.`,
      })
    },

    // 5. Komponentų vardai
    () =>
      poruUzdavinys(naujasId(T3), T3, {
        klausimas: `Susiek atimties $${sk4(a)} - ${sk4(b)} = ${sk4(a - b)}$ komponentą su jo vardu.`,
        poros: [
          { kaire: `$${sk4(a)}$`, desine: 'turinys' },
          { kaire: `$${sk4(b)}$`, desine: 'atėminys' },
          { kaire: `$${sk4(a - b)}$`, desine: 'skirtumas' },
        ],
        sprendimas: 'Iš turinio atimamas atėminys ir gaunamas skirtumas.',
      }),

    // 6. Patikra sudėtimi
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuota $${sk4(a)} - ${sk4(b)} = ${sk4(a - b)}$. Patikrink: prie skirtumo pridėk atėminį ir užrašyk rezultatą.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${sk4(a)}$`,
        sprendimas: `$${sk4(a - b)} + ${sk4(b)} = ${sk4(a)}$ — gautas turinys, tad atimtis teisinga.`,
      }),

    // 7. Du atėmimai
    () => {
      const c = atsitiktinis(800, 2800)
      if (a - b - c <= 0) return null
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${sk4(a)} - ${sk4(b)} - ${sk4(c)}$.`,
        atsakymas: String(a - b - c),
        atsakymasRodymui: `$${sk4(a - b - c)}$`,
        sprendimas: `$${sk4(a)} - ${sk4(b)} = ${sk4(a - b)}$, tada $${sk4(a - b)} - ${sk4(c)} = ${sk4(a - b - c)}$.`,
      })
    },
  ])
}

// ── 2.2.2. Atimties dėsniai ─────────────────────────────────────────────────

const T4 = 'atimties-desniai'

const A_ATIMTIES_DESNIAI = [
  {
    klausimas: 'Apskaičiuok patogiu būdu: $840 - (240 + 300)$.',
    atsakymas: '300',
    atsakymasRodymui: '$300$',
    sprendimas: '$840 - 240 - 300 = 300$.',
  },
] as const

export const atimtiesDesniai: Generatorius = () =>
  suBandymais(kurkAtimtiesDesnius, A_ATIMTIES_DESNIAI, T4)

function kurkAtimtiesDesnius(): Uzdavinys | null {
  const a = atsitiktinis(600, 9800)
  const b = atsitiktinis(120, 2400)
  const c = atsitiktinis(120, 2400)
  if (a - b - c <= 0) return null

  return variacija([
    // 1. Sumos atimtis
    () =>
      uzdavinys(T4, {
        klausimas: `Apskaičiuok patogiu būdu: $${sk4(a)} - (${sk4(b)} + ${sk4(c)})$.`,
        atsakymas: String(a - b - c),
        atsakymasRodymui: `$${sk4(a - b - c)}$`,
        sprendimas: `Atimant sumą galima atimti kiekvieną dėmenį iš eilės: $${sk4(a)} - ${sk4(b)} - ${sk4(c)} = ${sk4(a - b - c)}$.`,
      }),

    // 2. Ką leidžia dėsnis
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ką leidžia atimties dėsnis apie sumos atėmimą?',
        variantai: [
          'atimti sumą — tas pat, kas atimti kiekvieną jos dėmenį iš eilės',
          'atimti sumą — tas pat, kas atimti tik didesnįjį dėmenį',
          'sumą galima sukeisti su turiniu',
          'atimtis yra perstatoma',
        ],
        teisingas: 0,
        sprendimas: `$${sk4(a)} - (${sk4(b)} + ${sk4(c)}) = ${sk4(a)} - ${sk4(b)} - ${sk4(c)}$.`,
      }),

    // 3. Skirtumo atimtis
    () => {
      if (b <= c) return null
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${sk4(a)} - (${sk4(b)} - ${sk4(c)})$.`,
        atsakymas: String(a - b + c),
        atsakymasRodymui: `$${sk4(a - b + c)}$`,
        sprendimas: `Atėmus skirtumą, atimtas per daug kiekis grąžinamas: $${sk4(a)} - ${sk4(b)} + ${sk4(c)} = ${sk4(a - b + c)}$.`,
      })
    },

    // 4. Kur klaida
    () =>
      uzdavinys(T4, {
        klausimas: `Mokinys apskaičiavo $${sk4(a)} - (${sk4(b)} + ${sk4(c)}) = ${sk4(a - b + c)}$. Užrašyk teisingą reikšmę.`,
        atsakymas: String(a - b - c),
        atsakymasRodymui: `$${sk4(a - b - c)}$`,
        sprendimas: 'Atimant sumą, atimami abu dėmenys, o ne vienas atimamas, o kitas pridedamas.',
      }),

    // 5. Iš skirtumo atimti
    () => {
      if (a - b - c <= 0) return null
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok patogiu būdu: $(${sk4(a)} - ${sk4(b)}) - ${sk4(c)}$.`,
        atsakymas: String(a - b - c),
        atsakymasRodymui: `$${sk4(a - b - c)}$`,
        sprendimas: `Galima ir taip: $${sk4(a)} - (${sk4(b)} + ${sk4(c)}) = ${sk4(a)} - ${sk4(b + c)} = ${sk4(a - b - c)}$.`,
      })
    },

    // 6. Kada rezultatas nesikeičia
    () => {
      const priedas = atsitiktinis(10, 90)
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kas atsitiks skirtumui $${sk4(a)} - ${sk4(b)}$, jei prie turinio ir prie atėminio pridėsime po ${priedas}?`,
        variantai: [
          'skirtumas nepasikeis',
          `skirtumas padidės ${priedas}`,
          `skirtumas sumažės ${priedas}`,
          `skirtumas padidės ${2 * priedas}`,
        ],
        teisingas: 0,
        sprendimas: `$${sk4(a + priedas)} - ${sk4(b + priedas)} = ${sk4(a - b)}$ — tiek pat, kiek ir pradžioje.`,
      })
    },

    // 7. Tekstinis
    () => {
      const buvo = atsitiktinis(20, 90) * 100
      const pirma = atsitiktinis(4, 18) * 100
      const antra = atsitiktinis(3, 14) * 100
      if (buvo - pirma - antra <= 0) return null
      return uzdavinys(T4, {
        klausimas: `Sandėlyje buvo ${kiek(buvo, D.plyteles)}. Išvežė ${sk4(pirma)} ir ${sk4(antra)}. Kiek liko?`,
        atsakymas: String(buvo - pirma - antra),
        atsakymasRodymui: `$${sk4(buvo - pirma - antra)}$`,
        sprendimas: `Galima skaičiuoti dviem būdais: $${sk4(buvo)} - ${sk4(pirma)} - ${sk4(antra)}$ arba $${sk4(buvo)} - (${sk4(pirma)} + ${sk4(antra)})$ — abu duoda $${sk4(buvo - pirma - antra)}$.`,
      })
    },
  ])
}

// ── 2.3.1. Daugyba. Perstatomumo dėsnis ─────────────────────────────────────

const T5 = 'daugybos-perstatomumas'

const A_DAUGYBOS_PERSTATOMUMAS = [
  {
    klausimas: 'Apskaičiuok: $24 \\cdot 35$.',
    atsakymas: '840',
    atsakymasRodymui: '$840$',
    sprendimas: '$24 \\cdot 35 = 840$.',
  },
] as const

export const daugybosPerstatomumas: Generatorius = () =>
  suBandymais(kurkDaugybosPerstatomuma, A_DAUGYBOS_PERSTATOMUMAS, T5)

function kurkDaugybosPerstatomuma(): Uzdavinys | null {
  const a = atsitiktinis(12, 89)
  const b = atsitiktinis(12, 89)

  return variacija([
    // 1. Sandauga
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${a} \\cdot ${b}$.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `$${a} \\cdot ${b} = ${sk4(a * b)}$.`,
      }),

    // 2. Ką teigia dėsnis
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Ką teigia daugybos perstatomumo dėsnis?',
        variantai: [
          'sukeitus daugiklius vietomis sandauga nepasikeičia',
          'daugiklius galima jungti į grupes',
          'sandaugą galima išskaidyti į sumą',
          'daugybą galima keisti dalyba',
        ],
        teisingas: 0,
        sprendimas: `$${a} \\cdot ${b} = ${b} \\cdot ${a}$.`,
      }),

    // 3. Ar sandauga pasikeis
    () =>
      uzdavinys(T5, {
        klausimas: `Žinoma, kad $${a} \\cdot ${b} = ${sk4(a * b)}$. Kokia yra $${b} \\cdot ${a}$ reikšmė?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: 'Pagal perstatomumo dėsnį sandauga nepriklauso nuo daugiklių tvarkos — skaičiuoti iš naujo nereikia.',
      }),

    // 4. Patogesnė tvarka
    () => {
      const x = pasirink([2, 4, 5])
      const y = pasirink([5, 25, 50])
      const z = atsitiktinis(12, 48)
      if (x * y % 10 !== 0) return null
      return uzdavinys(T5, {
        klausimas: `Apskaičiuok patogiu būdu: $${x} \\cdot ${z} \\cdot ${y}$.`,
        atsakymas: String(x * y * z),
        atsakymasRodymui: `$${sk4(x * y * z)}$`,
        sprendimas: `Patogiausia pirma sudauginti $${x} \\cdot ${y} = ${x * y}$, o tada $${x * y} \\cdot ${z} = ${sk4(x * y * z)}$.`,
      })
    },

    // 5. Nežinomas daugiklis
    () =>
      uzdavinys(T5, {
        klausimas: `Rask nežinomą daugiklį: $\\square \\cdot ${b} = ${sk4(a * b)}$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${sk4(a * b)} : ${b} = ${a}$.`,
      }),

    // 6. Kuriuose veiksmuose galioja
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Ar dalyboje galima sukeisti skaičius vietomis, kaip daugyboje?`,
        variantai: [
          `ne, $${a * b} : ${b}$ ir $${b} : ${a * b}$ duoda skirtingus rezultatus`,
          'taip, dalyba yra atvirkštinė daugybai',
          'taip, jei dalinys dalus iš daliklio',
        ],
        teisingas: 0,
        sprendimas: 'Perstatomumas galioja tik sudėčiai ir daugybai.',
      }),

    // 7. Tekstinis
    () => {
      const eiliu = atsitiktinis(12, 40)
      const eileje = atsitiktinis(12, 40)
      return uzdavinys(T5, {
        klausimas: `Sode ${eiliu} eilės po ${eileje} medelius. Kiek medelių sode?`,
        atsakymas: String(eiliu * eileje),
        atsakymasRodymui: `$${sk4(eiliu * eileje)}$`,
        sprendimas: `$${eiliu} \\cdot ${eileje} = ${sk4(eiliu * eileje)}$. Skaičiuoti galima ir eilėmis, ir stulpeliais — rezultatas tas pats.`,
      })
    },
  ])
}

// ── 2.3.2. Daugybos jungiamumo dėsnis ───────────────────────────────────────

const T6 = 'daugybos-jungiamumas'

const A_DAUGYBOS_JUNGIAMUMAS = [
  {
    klausimas: 'Apskaičiuok patogiu būdu: $4 \\cdot 17 \\cdot 25$.',
    atsakymas: '1700',
    atsakymasRodymui: '$1700$',
    sprendimas: '$4 \\cdot 25 = 100$, tad $100 \\cdot 17 = 1700$.',
  },
] as const

export const daugybosJungiamumas: Generatorius = () =>
  suBandymais(kurkDaugybosJungiamuma, A_DAUGYBOS_JUNGIAMUMAS, T6)

const PATOGIOS_POROS = [
  [4, 25],
  [2, 50],
  [5, 20],
  [8, 125],
  [2, 5],
] as const

function kurkDaugybosJungiamuma(): Uzdavinys | null {
  const [x, y] = pasirink(PATOGIOS_POROS)
  const z = atsitiktinis(12, 48)

  return variacija([
    // 1. Patogus grupavimas
    () =>
      uzdavinys(T6, {
        klausimas: `Apskaičiuok patogiu būdu: $${x} \\cdot ${z} \\cdot ${y}$.`,
        atsakymas: String(x * y * z),
        atsakymasRodymui: `$${sk4(x * y * z)}$`,
        sprendimas: `$${x} \\cdot ${y} = ${x * y}$, tad $${x * y} \\cdot ${z} = ${sk4(x * y * z)}$.`,
      }),

    // 2. Ką teigia dėsnis
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Ką teigia daugybos jungiamumo dėsnis?',
        variantai: [
          'daugiklius galima jungti į grupes bet kaip — sandauga nepasikeičia',
          'daugiklius galima sukeisti vietomis',
          'sandaugą galima išskaidyti į sumą',
          'sandaugą galima dalyti iš daliklio',
        ],
        teisingas: 0,
        sprendimas: `$(${x} \\cdot ${y}) \\cdot ${z} = ${x} \\cdot (${y} \\cdot ${z})$.`,
      }),

    // 3. Kurią porą sudauginti pirma
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Kurią porą patogiausia sudauginti pirmą skaičiuojant $${x} \\cdot ${z} \\cdot ${y}$?`,
        variantai: [
          `$${x} \\cdot ${y}$, nes gaunama ${x * y}`,
          `$${x} \\cdot ${z}$, nes jie parašyti greta`,
          `$${z} \\cdot ${y}$, nes ${y} didesnis`,
          'tvarka nesvarbi — visais atvejais vienodai sunku',
        ],
        teisingas: 0,
        sprendimas: `Apvalus ${x * y} paverčia likusią daugybą mintine.`,
      }),

    // 4. Skliaustų perkėlimas
    () =>
      uzdavinys(T6, {
        klausimas: `Žinoma, kad $(${x} \\cdot ${y}) \\cdot ${z} = ${sk4(x * y * z)}$. Kokia yra $${x} \\cdot (${y} \\cdot ${z})$ reikšmė?`,
        atsakymas: String(x * y * z),
        atsakymasRodymui: `$${sk4(x * y * z)}$`,
        sprendimas: 'Pagal jungiamumo dėsnį skliaustų vieta sandaugos nekeičia.',
      }),

    // 5. Keturi daugikliai
    () => {
      const c = atsitiktinis(2, 9)
      if (x * y * z * c > 1000000) return null
      return uzdavinys(T6, {
        klausimas: `Apskaičiuok patogiu būdu: $${x} \\cdot ${c} \\cdot ${y} \\cdot ${z}$.`,
        atsakymas: String(x * y * z * c),
        atsakymasRodymui: `$${sk4(x * y * z * c)}$`,
        sprendimas: `$(${x} \\cdot ${y}) \\cdot (${c} \\cdot ${z}) = ${x * y} \\cdot ${c * z} = ${sk4(x * y * z * c)}$.`,
      })
    },

    // 6. Trūkstamas daugiklis
    () =>
      uzdavinys(T6, {
        klausimas: `Rask trūkstamą daugiklį: $(${x} \\cdot \\square) \\cdot ${z} = ${sk4(x * y * z)}$.`,
        atsakymas: String(y),
        atsakymasRodymui: `$${y}$`,
        sprendimas: `$${sk4(x * y * z)} : ${z} = ${x * y}$, tad $${x * y} : ${x} = ${y}$.`,
      }),

    // 7. Tekstinis
    () => {
      const deziu = pasirink([4, 5, 8, 25])
      const pakuociu = pasirink([25, 20, 125, 4])
      const vnt = atsitiktinis(3, 9)
      if (deziu * pakuociu % 10 !== 0 || deziu * pakuociu * vnt > 1000000) return null
      return uzdavinys(T6, {
        klausimas: `Sandėlyje ${deziu} dėžės, kiekvienoje po ${pakuociu} pakuotes, o pakuotėje — ${vnt} vienetai. Kiek vienetų iš viso?`,
        atsakymas: String(deziu * pakuociu * vnt),
        atsakymasRodymui: `$${sk4(deziu * pakuociu * vnt)}$`,
        sprendimas: `Patogiausia pirma $${deziu} \\cdot ${pakuociu} = ${sk4(deziu * pakuociu)}$, tada $\\cdot ${vnt}$.`,
      })
    },
  ])
}

// ── 2.3.3. Daugybos skirstomumo dėsnis ──────────────────────────────────────

const T7 = 'daugybos-skirstomumas'

const A_SKIRSTOMUMAS = [
  {
    klausimas: 'Apskaičiuok patogiu būdu: $23 \\cdot 102$.',
    atsakymas: '2346',
    atsakymasRodymui: '$2346$',
    sprendimas: '$23 \\cdot 100 + 23 \\cdot 2 = 2300 + 46 = 2346$.',
  },
] as const

export const daugybosSkirstomumas: Generatorius = () =>
  suBandymais(kurkSkirstomuma, A_SKIRSTOMUMAS, T7)

function kurkSkirstomuma(): Uzdavinys | null {
  const a = atsitiktinis(12, 48)
  const b = atsitiktinis(20, 90)
  const c = atsitiktinis(2, 9)

  return variacija([
    // 1. Sumos daugyba
    () =>
      uzdavinys(T7, {
        klausimas: `Apskaičiuok taikydamas skirstomumo dėsnį: $${a} \\cdot (${b} + ${c})$.`,
        atsakymas: String(a * (b + c)),
        atsakymasRodymui: `$${sk4(a * (b + c))}$`,
        sprendimas: `$${a} \\cdot ${b} + ${a} \\cdot ${c} = ${sk4(a * b)} + ${a * c} = ${sk4(a * (b + c))}$.`,
      }),

    // 2. Ką teigia dėsnis
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ką teigia daugybos skirstomumo sumos atžvilgiu dėsnis?',
        variantai: [
          'dauginant iš sumos galima padauginti iš kiekvieno dėmens ir sudėti',
          'daugiklius galima sukeisti vietomis',
          'daugiklius galima jungti į grupes',
          'sumą galima dalyti iš skaičiaus',
        ],
        teisingas: 0,
        sprendimas: `$${a} \\cdot (${b} + ${c}) = ${a} \\cdot ${b} + ${a} \\cdot ${c}$.`,
      }),

    // 3. Daugyba per apvalų skaičių
    () => {
      const x = atsitiktinis(12, 48)
      const apvalus = pasirink([100, 200, 500])
      const priedas = pasirink([1, 2, 3])
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok patogiu būdu: $${x} \\cdot ${apvalus + priedas}$.`,
        atsakymas: String(x * (apvalus + priedas)),
        atsakymasRodymui: `$${sk4(x * (apvalus + priedas))}$`,
        sprendimas: `$${x} \\cdot ${apvalus} + ${x} \\cdot ${priedas} = ${sk4(x * apvalus)} + ${x * priedas} = ${sk4(x * (apvalus + priedas))}$.`,
      })
    },

    // 4. Daugyba atimant
    () => {
      const x = atsitiktinis(12, 48)
      const apvalus = pasirink([100, 200, 500])
      const truksta = pasirink([1, 2, 3])
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok patogiu būdu: $${x} \\cdot ${apvalus - truksta}$.`,
        atsakymas: String(x * (apvalus - truksta)),
        atsakymasRodymui: `$${sk4(x * (apvalus - truksta))}$`,
        sprendimas: `$${x} \\cdot ${apvalus} - ${x} \\cdot ${truksta} = ${sk4(x * apvalus)} - ${x * truksta} = ${sk4(x * (apvalus - truksta))}$.`,
      })
    },

    // 5. Bendro daugiklio iškėlimas
    () =>
      uzdavinys(T7, {
        klausimas: `Iškelk bendrą daugiklį ir apskaičiuok: $${a} \\cdot ${b} + ${a} \\cdot ${c}$.`,
        atsakymas: String(a * (b + c)),
        atsakymasRodymui: `$${sk4(a * (b + c))}$`,
        sprendimas: `$${a} \\cdot (${b} + ${c}) = ${a} \\cdot ${b + c} = ${sk4(a * (b + c))}$.`,
      }),

    // 6. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Mokinys apskaičiavo $${a} \\cdot (${b} + ${c}) = ${a} \\cdot ${b} + ${c}$, tai yra $${sk4(a * b + c)}$. Užrašyk teisingą reikšmę.`,
        atsakymas: String(a * (b + c)),
        atsakymasRodymui: `$${sk4(a * (b + c))}$`,
        sprendimas: 'Iš daugiklio reikia padauginti abu dėmenis, o ne tik pirmąjį.',
      }),

    // 7. Tekstinis
    () => {
      const kiekis = atsitiktinis(12, 40)
      const kaina1 = atsitiktinis(3, 12)
      const kaina2 = atsitiktinis(3, 12)
      return uzdavinys(T7, {
        klausimas: `Nupirkta ${kiekis} rinkinių; kiekviename — sąsiuvinis už ${kaina1} Eur ir pieštukas už ${kaina2} Eur. Kiek sumokėta iš viso?`,
        atsakymas: String(kiekis * (kaina1 + kaina2)),
        atsakymasRodymui: `$${sk4(kiekis * (kaina1 + kaina2))}$ Eur`,
        sprendimas: `Galima skaičiuoti dviem būdais: $${kiekis} \\cdot (${kaina1} + ${kaina2})$ arba $${kiekis} \\cdot ${kaina1} + ${kiekis} \\cdot ${kaina2}$ — abu duoda $${sk4(kiekis * (kaina1 + kaina2))}$.`,
      })
    },
  ])
}

// ── 2.4.1. Dalyba. Dalyba kampu ─────────────────────────────────────────────

const T8 = 'dalyba-kampu-5'

const A_DALYBA = [
  {
    klausimas: 'Apskaičiuok: $4\\,872 : 12$.',
    atsakymas: '406',
    atsakymasRodymui: '$406$',
    sprendimas: '$4872 : 12 = 406$.',
  },
] as const

export const dalybaKampu5: Generatorius = () => suBandymais(kurkDalyba, A_DALYBA, T8)

function kurkDalyba(): Uzdavinys | null {
  const daliklis = atsitiktinis(12, 48)
  const dalmuo = atsitiktinis(24, 480)
  const dalinys = daliklis * dalmuo

  return variacija([
    // 1. Dalyba kampu
    () =>
      uzdavinys(T8, {
        klausimas: 'Padalyk kampu ir užrašyk dalmenį.',
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `$${sk4(dalinys)} : ${daliklis} = ${sk4(dalmuo)}$.`,
        brezinys: dalybaKampu(dalinys, daliklis),
      }),

    // 2. Paprasta dalyba
    () =>
      uzdavinys(T8, {
        klausimas: `Apskaičiuok: $${sk4(dalinys)} : ${daliklis}$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `$${sk4(dalinys)} : ${daliklis} = ${sk4(dalmuo)}$.`,
      }),

    // 3. Komponentų vardai
    () =>
      poruUzdavinys(naujasId(T8), T8, {
        klausimas: `Susiek dalybos $${sk4(dalinys)} : ${daliklis} = ${sk4(dalmuo)}$ komponentą su jo vardu.`,
        poros: [
          { kaire: `$${sk4(dalinys)}$`, desine: 'dalinys' },
          { kaire: `$${daliklis}$`, desine: 'daliklis' },
          { kaire: `$${sk4(dalmuo)}$`, desine: 'dalmuo' },
        ],
        sprendimas: 'Dalinys dalijamas iš daliklio ir gaunamas dalmuo.',
      }),

    // 4. Dalyba su liekana
    () => {
      const liekana = atsitiktinis(1, daliklis - 1)
      return uzdavinys(T8, {
        klausimas: `Padalyk su liekana: $${sk4(dalinys + liekana)} : ${daliklis}$. Kokia gaunama liekana?`,
        atsakymas: String(liekana),
        atsakymasRodymui: `$${liekana}$`,
        sprendimas: `$${sk4(dalinys + liekana)} = ${daliklis} \\cdot ${sk4(dalmuo)} + ${liekana}$.`,
      })
    },

    // 5. Nežinomas dalinys
    () =>
      uzdavinys(T8, {
        klausimas: `Rask nežinomą dalinį: $\\square : ${daliklis} = ${sk4(dalmuo)}$.`,
        atsakymas: String(dalinys),
        atsakymasRodymui: `$${sk4(dalinys)}$`,
        sprendimas: `$${sk4(dalmuo)} \\cdot ${daliklis} = ${sk4(dalinys)}$.`,
      }),

    // 6. Patikra daugyba
    () =>
      uzdavinys(T8, {
        klausimas: `Apskaičiuota $${sk4(dalinys)} : ${daliklis} = ${sk4(dalmuo)}$. Patikrink: padaugink dalmenį iš daliklio ir užrašyk rezultatą.`,
        atsakymas: String(dalinys),
        atsakymasRodymui: `$${sk4(dalinys)}$`,
        sprendimas: `$${sk4(dalmuo)} \\cdot ${daliklis} = ${sk4(dalinys)}$ — gautas dalinys, tad dalyba teisinga.`,
      }),

    // 7. Tekstinis
    () => {
      const dezeje = atsitiktinis(12, 36)
      const deziu = atsitiktinis(14, 90)
      return uzdavinys(T8, {
        klausimas: `${sk4(dezeje * deziu)} sąsiuviniai sudėti po ${dezeje} į dėžes. Kiek dėžių prireikė?`,
        atsakymas: String(deziu),
        atsakymasRodymui: `$${sk4(deziu)}$`,
        sprendimas: `$${sk4(dezeje * deziu)} : ${dezeje} = ${sk4(deziu)}$.`,
      })
    },
  ])
}

// ── 2.4.2. Dalybos dėsniai. Pagrindinė dalmens savybė ───────────────────────

const T9 = 'dalybos-desniai'

const A_DALYBOS_DESNIAI = [
  {
    klausimas: 'Kaip pasikeis dalmuo, jei dalinį ir daliklį padauginsime iš 3?',
    atsakymas: 'a',
    atsakymasRodymui: 'nepasikeis',
    sprendimas: 'Tai pagrindinė dalmens savybė.',
  },
] as const

export const dalybosDesniai: Generatorius = () =>
  suBandymais(kurkDalybosDesnius, A_DALYBOS_DESNIAI, T9)

function kurkDalybosDesnius(): Uzdavinys | null {
  const daliklis = atsitiktinis(3, 24)
  const dalmuo = atsitiktinis(12, 240)
  const dalinys = daliklis * dalmuo
  const kartai = atsitiktinis(2, 5)

  return variacija([
    // 1. Pagrindinė dalmens savybė
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kaip pasikeis dalmuo $${sk4(dalinys)} : ${daliklis}$, jei ir dalinį, ir daliklį padauginsime iš ${kartai}?`,
        variantai: [
          'nepasikeis',
          `padidės ${kartai} kartus`,
          `sumažės ${kartai} kartus`,
          `padidės ${kartai * kartai} kartus`,
        ],
        teisingas: 0,
        sprendimas: `$${sk4(dalinys * kartai)} : ${daliklis * kartai} = ${sk4(dalmuo)}$ — tas pats dalmuo.`,
      }),

    // 2. Padauginus tik dalinį
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kaip pasikeis dalmuo, jei dalinį padauginsime iš ${kartai}, o daliklio nekeisime?`,
        variantai: [
          `padidės ${kartai} kartus`,
          'nepasikeis',
          `sumažės ${kartai} kartus`,
          `padidės ${kartai} vienetais`,
        ],
        teisingas: 0,
        sprendimas: `$${sk4(dalinys * kartai)} : ${daliklis} = ${sk4(dalmuo * kartai)}$.`,
      }),

    // 3. Padauginus tik daliklį
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kaip pasikeis dalmuo, jei daliklį padauginsime iš ${kartai}, o dalinio nekeisime?`,
        variantai: [
          `sumažės ${kartai} kartus`,
          `padidės ${kartai} kartus`,
          'nepasikeis',
          `sumažės ${kartai} vienetais`,
        ],
        teisingas: 0,
        sprendimas: `Dalinys lieka tas pats, o dalijama iš ${kartai} kartų didesnio skaičiaus, tad dalmuo tiek pat kartų sumažėja.`,
      }),

    // 4. Supaprastinta dalyba
    () => {
      const d = pasirink([2, 4, 5])
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok patogiu būdu, sumažindamas abu skaičius: $${sk4(dalinys * d)} : ${daliklis * d}$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `Padalijus abu iš ${d}, lieka $${sk4(dalinys)} : ${daliklis} = ${sk4(dalmuo)}$ — dalmuo nepasikeitė.`,
      })
    },

    // 5. Dalyba iš vieneto ir savęs
    () => {
      const n = atsitiktinis(24, 980)
      const kuris = pasirink(['vienetas', 'savęs'] as const)
      return uzdavinys(T9, {
        klausimas:
          kuris === 'vienetas'
            ? `Apskaičiuok: $${sk4(n)} : 1$.`
            : `Apskaičiuok: $${sk4(n)} : ${sk4(n)}$.`,
        atsakymas: kuris === 'vienetas' ? String(n) : '1',
        atsakymasRodymui: kuris === 'vienetas' ? `$${sk4(n)}$` : '$1$',
        sprendimas:
          kuris === 'vienetas'
            ? 'Dalijant iš vieneto skaičius nepasikeičia.'
            : 'Bet kuris skaičius, padalytas iš savęs, duoda vienetą.',
      })
    },

    // 6. Nulio dalyba
    () => {
      const n = atsitiktinis(12, 480)
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kokia yra $0 : ${n}$ reikšmė?`,
        variantai: ['$0$', `$${n}$`, '$1$', 'tokio veiksmo atlikti negalima'],
        teisingas: 0,
        sprendimas: 'Nulį padalijus iš bet kurio skaičiaus gaunamas nulis. Dalyti iš nulio negalima.',
      })
    },

    // 7. Ar galima dalyti iš nulio
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kodėl negalima dalyti iš nulio?',
        variantai: [
          'nes nėra skaičiaus, kurį padauginus iš nulio gautume ne nulį',
          'nes nulis yra per mažas',
          'nes rezultatas būtų nulis',
          'galima — rezultatas visada nulis',
        ],
        teisingas: 0,
        sprendimas: 'Dalyba tikrinama daugyba, o iš nulio padauginus visada gaunamas nulis.',
      }),
  ])
}

// ── 2.4.3. Sumos (skirtumo) dalijimas ───────────────────────────────────────

const T10 = 'sumos-dalijimas'

const A_SUMOS_DALIJIMAS = [
  {
    klausimas: 'Apskaičiuok patogiu būdu: $(360 + 240) : 6$.',
    atsakymas: '100',
    atsakymasRodymui: '$100$',
    sprendimas: '$360 : 6 + 240 : 6 = 60 + 40 = 100$.',
  },
] as const

export const sumosDalijimas: Generatorius = () =>
  suBandymais(kurkSumosDalijima, A_SUMOS_DALIJIMAS, T10)

function kurkSumosDalijima(): Uzdavinys | null {
  const daliklis = atsitiktinis(3, 12)
  const a = daliklis * atsitiktinis(12, 90)
  const b = daliklis * atsitiktinis(12, 90)

  return variacija([
    // 1. Sumos dalijimas
    () =>
      uzdavinys(T10, {
        klausimas: `Apskaičiuok patogiu būdu: $(${sk4(a)} + ${sk4(b)}) : ${daliklis}$.`,
        atsakymas: String((a + b) / daliklis),
        atsakymasRodymui: `$${sk4((a + b) / daliklis)}$`,
        sprendimas: `$${sk4(a)} : ${daliklis} + ${sk4(b)} : ${daliklis} = ${sk4(a / daliklis)} + ${sk4(b / daliklis)} = ${sk4((a + b) / daliklis)}$.`,
      }),

    // 2. Skirtumo dalijimas
    () => {
      if (a <= b) return null
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok patogiu būdu: $(${sk4(a)} - ${sk4(b)}) : ${daliklis}$.`,
        atsakymas: String((a - b) / daliklis),
        atsakymasRodymui: `$${sk4((a - b) / daliklis)}$`,
        sprendimas: `$${sk4(a)} : ${daliklis} - ${sk4(b)} : ${daliklis} = ${sk4(a / daliklis)} - ${sk4(b / daliklis)} = ${sk4((a - b) / daliklis)}$.`,
      })
    },

    // 3. Ką leidžia dėsnis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kada sumą galima dalyti iš skaičiaus dalijant kiekvieną dėmenį atskirai?',
        variantai: [
          'kai kiekvienas dėmuo dalus iš to skaičiaus',
          'visada, nesvarbu, ar dėmenys dalūs',
          'tik kai dėmenys vienodi',
          'niekada',
        ],
        teisingas: 0,
        sprendimas: `Čia abu dėmenys dalūs iš ${daliklis}, tad būdas veikia.`,
      }),

    // 4. Kuris būdas patogesnis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kuris būdas patogesnis skaičiuojant $(${sk4(a)} + ${sk4(b)}) : ${daliklis}$?`,
        variantai: [
          'padalyti kiekvieną dėmenį atskirai ir sudėti',
          'pirma sudėti, o paskui dalyti didelį skaičių',
          'padalyti tik didesnįjį dėmenį',
        ],
        teisingas: 0,
        sprendimas: `$${sk4(a / daliklis)} + ${sk4(b / daliklis)} = ${sk4((a + b) / daliklis)}$ — abu tarpiniai dalmenys nedideli.`,
      }),

    // 5. Bendro daliklio iškėlimas
    () =>
      uzdavinys(T10, {
        klausimas: `Apskaičiuok: $${sk4(a)} : ${daliklis} + ${sk4(b)} : ${daliklis}$.`,
        atsakymas: String((a + b) / daliklis),
        atsakymasRodymui: `$${sk4((a + b) / daliklis)}$`,
        sprendimas: `Tai tas pats, kas $(${sk4(a)} + ${sk4(b)}) : ${daliklis} = ${sk4(a + b)} : ${daliklis} = ${sk4((a + b) / daliklis)}$.`,
      }),

    // 6. Klaidos radimas
    () =>
      uzdavinys(T10, {
        klausimas: `Mokinys apskaičiavo $(${sk4(a)} + ${sk4(b)}) : ${daliklis} = ${sk4(a / daliklis)} + ${sk4(b)}$. Užrašyk teisingą reikšmę.`,
        atsakymas: String((a + b) / daliklis),
        atsakymasRodymui: `$${sk4((a + b) / daliklis)}$`,
        sprendimas: 'Dalyti reikia abu dėmenis, o ne tik pirmąjį.',
      }),

    // 7. Tekstinis
    () => {
      const klasiu = daliklis
      const pirma = klasiu * atsitiktinis(6, 30)
      const antra = klasiu * atsitiktinis(6, 30)
      return uzdavinys(T10, {
        klausimas: `${sk4(pirma)} sąsiuvinių ir ${sk4(antra)} pieštukų išdalyta po lygiai ${klasiu} klasėms. Kiek daiktų gavo viena klasė?`,
        atsakymas: String((pirma + antra) / klasiu),
        atsakymasRodymui: `$${sk4((pirma + antra) / klasiu)}$`,
        sprendimas: `$${sk4(pirma)} : ${klasiu} + ${sk4(antra)} : ${klasiu} = ${sk4(pirma / klasiu)} + ${sk4(antra / klasiu)} = ${sk4((pirma + antra) / klasiu)}$.`,
      })
    },
  ])
}

// ── 2.5.1. Kelio formulė ────────────────────────────────────────────────────

const T11 = 'kelio-formule'

const A_KELIO_FORMULE = [
  {
    klausimas: 'Automobilis 3 valandas važiavo 80 km/h greičiu. Kokį kelią jis nuvažiavo?',
    atsakymas: '240',
    atsakymasRodymui: '$240$ km',
    sprendimas: '$s = v \\cdot t = 80 \\cdot 3 = 240$.',
  },
] as const

export const kelioFormule: Generatorius = () => suBandymais(kurkKelioFormule, A_KELIO_FORMULE, T11)

function kurkKelioFormule(): Uzdavinys | null {
  const v = atsitiktinis(12, 110)
  const t = atsitiktinis(2, 9)

  return variacija([
    // 1. Kelias
    () =>
      uzdavinys(T11, {
        klausimas: `Kūnas ${t} valandas judėjo ${v} km/h greičiu. Kokį kelią jis nuveikė?`,
        atsakymas: String(v * t),
        atsakymasRodymui: `$${sk4(v * t)}$ km`,
        sprendimas: `$s = v \\cdot t = ${v} \\cdot ${t} = ${sk4(v * t)}$.`,
      }),

    // 2. Greitis
    () =>
      uzdavinys(T11, {
        klausimas: `Per ${t} valandas nuvažiuota ${kiek(v * t, KM)}. Koks buvo greitis?`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$ km/h`,
        sprendimas: `$v = s : t = ${sk4(v * t)} : ${t} = ${v}$.`,
      }),

    // 3. Laikas
    () =>
      uzdavinys(T11, {
        klausimas: `Kelias ${kiek(v * t, KM)}, greitis ${v} km/h. Kiek valandų truko kelionė?`,
        atsakymas: String(t),
        atsakymasRodymui: `$${t}$ val.`,
        sprendimas: `$t = s : v = ${sk4(v * t)} : ${v} = ${t}$.`,
      }),

    // 4. Formulės pasirinkimas
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kuri formulė nusako kelią?',
        variantai: [
          '$s = v \\cdot t$',
          '$s = v : t$',
          '$s = t : v$',
          '$s = v + t$',
        ],
        teisingas: 0,
        sprendimas: 'Kelias yra greičio ir laiko sandauga.',
      }),

    // 5. Vienetai
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Greitis nurodytas m/min, laikas — minutėmis. Kuriuo vienetu bus išreikštas kelias?',
        variantai: ['metrais', 'kilometrais', 'minutėmis', 'metrais per minutę'],
        teisingas: 0,
        sprendimas: 'Minutės susiprastina, ir lieka metrai.',
      }),

    // 6. Dvi atkarpos
    () => {
      const v2 = atsitiktinis(12, 110)
      const t2 = atsitiktinis(1, 5)
      return uzdavinys(T11, {
        klausimas: `Pirmas ${t} valandas judėta ${v} km/h greičiu, paskui ${t2} valandas — ${v2} km/h. Koks visas kelias?`,
        atsakymas: String(v * t + v2 * t2),
        atsakymasRodymui: `$${sk4(v * t + v2 * t2)}$ km`,
        sprendimas: `$${v} \\cdot ${t} + ${v2} \\cdot ${t2} = ${sk4(v * t)} + ${sk4(v2 * t2)} = ${sk4(v * t + v2 * t2)}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T11, {
        klausimas: `Uždavinys: „Greitis ${v} km/h, laikas ${t} val. Koks kelias?“ Mokinys užrašė $${v} + ${t}$. Užrašyk teisingą kelią.`,
        atsakymas: String(v * t),
        atsakymasRodymui: `$${sk4(v * t)}$ km`,
        sprendimas: `Kelio formulė yra $s = v \\cdot t$, tad $${v} \\cdot ${t} = ${sk4(v * t)}$.`,
      }),
  ])
}

// ── 2.5.2. Judėjimas iš tos pačios vietos ───────────────────────────────────

const T12 = 'judejimas-is-tos-pacios'

const A_TA_PATI = [
  {
    klausimas: 'Iš tos pačios vietos ta pačia kryptimi išvyko du kūnai 40 km/h ir 60 km/h greičiais. Kokiu greičiu jie tolsta vienas nuo kito?',
    atsakymas: '20',
    atsakymasRodymui: '$20$ km/h',
    sprendimas: '$60 - 40 = 20$.',
  },
] as const

export const judejimasIsTosPacios: Generatorius = () =>
  suBandymais(kurkTosPacios, A_TA_PATI, T12)

function kurkTosPacios(): Uzdavinys | null {
  const v1 = atsitiktinis(12, 60)
  const v2 = v1 + atsitiktinis(8, 50)
  const t = atsitiktinis(2, 6)

  return variacija([
    // 1. Tolimo greitis ta pačia kryptimi
    () =>
      uzdavinys(T12, {
        klausimas: 'Kokiu greičiu kūnai tolsta vienas nuo kito?',
        atsakymas: String(v2 - v1),
        atsakymasRodymui: `$${v2 - v1}$ km/h`,
        sprendimas: `Judant ta pačia kryptimi greičiai atimami: $${v2} - ${v1} = ${v2 - v1}$.`,
        brezinys: judejimoSchema5('ta-pati-kryptis', { vardas: 'Pirmas', greitis: v1 }, { vardas: 'Antras', greitis: v2 }),
      }),

    // 2. Atstumas po kurio laiko (ta pati kryptis)
    () =>
      uzdavinys(T12, {
        klausimas: `Kokiu atstumu kūnai bus vienas nuo kito po ${t} valandų?`,
        atsakymas: String((v2 - v1) * t),
        atsakymasRodymui: `$${sk4((v2 - v1) * t)}$ km`,
        sprendimas: `Tolimo greitis $${v2} - ${v1} = ${v2 - v1}$ km/h, tad $${v2 - v1} \\cdot ${t} = ${sk4((v2 - v1) * t)}$ km.`,
        brezinys: judejimoSchema5('ta-pati-kryptis', { vardas: 'Pirmas', greitis: v1 }, { vardas: 'Antras', greitis: v2 }),
      }),

    // 3. Priešingos kryptys — tolimo greitis
    () =>
      uzdavinys(T12, {
        klausimas: 'Kokiu greičiu kūnai tolsta vienas nuo kito, judėdami priešingomis kryptimis?',
        atsakymas: String(v1 + v2),
        atsakymasRodymui: `$${v1 + v2}$ km/h`,
        sprendimas: `Judant priešingomis kryptimis greičiai sudedami: $${v1} + ${v2} = ${v1 + v2}$.`,
        brezinys: judejimoSchema5('priesingos-kryptys', { vardas: 'Pirmas', greitis: v1 }, { vardas: 'Antras', greitis: v2 }),
      }),

    // 4. Atstumas priešingomis kryptimis
    () =>
      uzdavinys(T12, {
        klausimas: `Kokiu atstumu kūnai bus vienas nuo kito po ${t} valandų, judėdami priešingomis kryptimis?`,
        atsakymas: String((v1 + v2) * t),
        atsakymasRodymui: `$${sk4((v1 + v2) * t)}$ km`,
        sprendimas: `$(${v1} + ${v2}) \\cdot ${t} = ${v1 + v2} \\cdot ${t} = ${sk4((v1 + v2) * t)}$ km.`,
        brezinys: judejimoSchema5('priesingos-kryptys', { vardas: 'Pirmas', greitis: v1 }, { vardas: 'Antras', greitis: v2 }),
      }),

    // 5. Kada greičiai atimami
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kada tolimo greitis randamas atimant greičius?',
        variantai: [
          'kai kūnai juda ta pačia kryptimi',
          'kai kūnai juda priešingomis kryptimis',
          'kai kūnai juda vienas kito link',
          'visada',
        ],
        teisingas: 0,
        sprendimas: 'Ta pačia kryptimi judant greitesnysis tolsta tik greičių skirtumu.',
      }),

    // 6. Nežinomas greitis
    () =>
      uzdavinys(T12, {
        klausimas: `Iš tos pačios vietos ta pačia kryptimi išvyko du kūnai. Vieno greitis ${v1} km/h, o po ${t} valandų jie nutolo ${kiek((v2 - v1) * t, KM)}. Koks antrojo greitis?`,
        atsakymas: String(v2),
        atsakymasRodymui: `$${v2}$ km/h`,
        sprendimas: `Tolimo greitis $${sk4((v2 - v1) * t)} : ${t} = ${v2 - v1}$ km/h, tad antrojo greitis $${v1} + ${v2 - v1} = ${v2}$.`,
      }),

    // 7. Po kiek laiko nutols
    () => {
      const atstumas = (v2 - v1) * t
      return uzdavinys(T12, {
        klausimas: `Kūnai išvyko iš tos pačios vietos ta pačia kryptimi ${v1} km/h ir ${v2} km/h greičiais. Po kiek valandų jie nutols ${kiek(atstumas, KM)}?`,
        atsakymas: String(t),
        atsakymasRodymui: `$${t}$ val.`,
        sprendimas: `$${sk4(atstumas)} : (${v2} - ${v1}) = ${sk4(atstumas)} : ${v2 - v1} = ${t}$.`,
      })
    },
  ])
}

// ── 2.5.3. Judėjimas iš skirtingų vietų ─────────────────────────────────────

const T13 = 'judejimas-is-skirtingu'

const A_SKIRTINGU = [
  {
    klausimas: 'Du kūnai juda vienas kito link 40 km/h ir 60 km/h greičiais. Kokiu greičiu jie artėja?',
    atsakymas: '100',
    atsakymasRodymui: '$100$ km/h',
    sprendimas: '$40 + 60 = 100$.',
  },
] as const

export const judejimasIsSkirtingu: Generatorius = () =>
  suBandymais(kurkSkirtinguVietu, A_SKIRTINGU, T13)

function kurkSkirtinguVietu(): Uzdavinys | null {
  const v1 = atsitiktinis(12, 60)
  const v2 = atsitiktinis(12, 60)
  const t = atsitiktinis(2, 6)
  const atstumas = (v1 + v2) * t

  return variacija([
    // 1. Artėjimo greitis
    () =>
      uzdavinys(T13, {
        klausimas: 'Kokiu greičiu kūnai artėja vienas prie kito?',
        atsakymas: String(v1 + v2),
        atsakymasRodymui: `$${v1 + v2}$ km/h`,
        sprendimas: `Judant vienas kito link greičiai sudedami: $${v1} + ${v2} = ${v1 + v2}$.`,
        brezinys: judejimoSchema5('vienas-kito-link', { vardas: 'A', greitis: v1 }, { vardas: 'B', greitis: v2 }, atstumas),
      }),

    // 2. Po kiek laiko susitiks
    () =>
      uzdavinys(T13, {
        klausimas: 'Po kiek valandų kūnai susitiks?',
        atsakymas: String(t),
        atsakymasRodymui: `$${t}$ val.`,
        sprendimas: `Artėjimo greitis $${v1} + ${v2} = ${v1 + v2}$ km/h, tad $${sk4(atstumas)} : ${v1 + v2} = ${t}$ val.`,
        brezinys: judejimoSchema5('vienas-kito-link', { vardas: 'A', greitis: v1 }, { vardas: 'B', greitis: v2 }, atstumas),
      }),

    // 3. Koks buvo pradinis atstumas
    () =>
      uzdavinys(T13, {
        klausimas: `Du kūnai išvyko vienas kito link ${v1} km/h ir ${v2} km/h greičiais ir susitiko po ${t} valandų. Koks buvo atstumas tarp jų?`,
        atsakymas: String(atstumas),
        atsakymasRodymui: `$${sk4(atstumas)}$ km`,
        sprendimas: `$(${v1} + ${v2}) \\cdot ${t} = ${v1 + v2} \\cdot ${t} = ${sk4(atstumas)}$ km.`,
        brezinys: judejimoSchema5('vienas-kito-link', { vardas: 'A', greitis: v1 }, { vardas: 'B', greitis: v2 }),
      }),

    // 4. Kiek nuvažiavo kiekvienas
    () =>
      uzdavinys(T13, {
        klausimas: `Kūnai išvyko vienas kito link ${v1} km/h ir ${v2} km/h greičiais ir susitiko po ${t} valandų. Kokį kelią nuveikė pirmasis?`,
        atsakymas: String(v1 * t),
        atsakymasRodymui: `$${sk4(v1 * t)}$ km`,
        sprendimas: `$${v1} \\cdot ${t} = ${sk4(v1 * t)}$ km.`,
      }),

    // 5. Kada greičiai sudedami
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Kada artėjimo greitis randamas sudedant greičius?',
        variantai: [
          'kai kūnai juda vienas kito link',
          'kai kūnai juda ta pačia kryptimi',
          'kai vienas kūnas stovi',
          'niekada',
        ],
        teisingas: 0,
        sprendimas: 'Judant vienas kito link atstumas mažėja abiejų greičių suma.',
      }),

    // 6. Nežinomas greitis
    () =>
      uzdavinys(T13, {
        klausimas: `Du kūnai išvyko vienas kito link iš ${kiek(atstumas, KM)} atstumo ir susitiko po ${t} valandų. Vieno greitis ${v1} km/h. Koks antrojo greitis?`,
        atsakymas: String(v2),
        atsakymasRodymui: `$${v2}$ km/h`,
        sprendimas: `Artėjimo greitis $${sk4(atstumas)} : ${t} = ${v1 + v2}$ km/h, tad antrojo greitis $${v1 + v2} - ${v1} = ${v2}$.`,
      }),

    // 7. Kiek liks iki susitikimo
    () => {
      const praejo = atsitiktinis(1, t - 1)
      if (praejo < 1) return null
      return uzdavinys(T13, {
        klausimas: `Kūnai išvyko vienas kito link iš ${kiek(atstumas, KM)} atstumo ${v1} km/h ir ${v2} km/h greičiais. Koks atstumas tarp jų liks po ${praejo} valandų?`,
        atsakymas: String(atstumas - (v1 + v2) * praejo),
        atsakymasRodymui: `$${sk4(atstumas - (v1 + v2) * praejo)}$ km`,
        sprendimas: `Per ${praejo} val. jie suartėja $(${v1} + ${v2}) \\cdot ${praejo} = ${sk4((v1 + v2) * praejo)}$ km, tad lieka $${sk4(atstumas)} - ${sk4((v1 + v2) * praejo)} = ${sk4(atstumas - (v1 + v2) * praejo)}$ km.`,
      })
    },
  ])
}
