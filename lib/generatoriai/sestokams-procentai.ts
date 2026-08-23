import { atsitiktinis, naujasId, pasirink, suprastink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { ivestiesLentele } from './penktokams-vaizdai'
import { proporcingumoGrafikas } from './sestokams-vaizdai'
import { VARDAI } from './ketvirtokams-bendra'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 6 klasės temos „Procentai. Proporcija“ ir „Tiesioginis proporcingumas“ —
 * vienuolika potemių.
 *
 * Programoje šioje temoje yra ir potemė „Finansiniai skaičiavimai: nuolaidos,
 * vieneto tarifai, biudžetas ir mokesčiai“, kurios turinio apraše nėra, bet
 * kuri čia priklauso: nuolaida yra procentas, o vieneto tarifas — tiesioginis
 * proporcingumas.
 *
 * Pinigai visur skaičiuojami centais (sveikaisiais), o kablelis įrašomas tik
 * rodant — kitaip nuolaidos uždavinys duotų atsakymą $17{,}850000000000003$.
 */

/** Centai → eurų užrašas su lietuvišku kableliu. */
function eur(centai: number): string {
  const zenklas = centai < 0 ? '-' : ''
  const a = Math.abs(centai)
  return `${zenklas}${Math.floor(a / 100)}{,}${String(a % 100).padStart(2, '0')}`
}

/** Centai → atsakymo eilutė eurais. */
function eurAts(centai: number): string {
  return (centai / 100).toFixed(2)
}

const PROCENTU_PAVIDALAI = [
  { proc: 10, des: '0{,}1', tr: '\\dfrac{1}{10}', atsDes: '0.1', atsTr: '1/10' },
  { proc: 20, des: '0{,}2', tr: '\\dfrac{1}{5}', atsDes: '0.2', atsTr: '1/5' },
  { proc: 25, des: '0{,}25', tr: '\\dfrac{1}{4}', atsDes: '0.25', atsTr: '1/4' },
  { proc: 50, des: '0{,}5', tr: '\\dfrac{1}{2}', atsDes: '0.5', atsTr: '1/2' },
  { proc: 75, des: '0{,}75', tr: '\\dfrac{3}{4}', atsDes: '0.75', atsTr: '3/4' },
] as const

// ── 6.1.1. Trupmenos, dešimtainiai skaičiai, procentai ──────────────────────

const T1 = 'trupmenos-desimtainiai-procentai-6'

const A_PAVIDALAI = [
  {
    klausimas: 'Kiek procentų sudaro $\\dfrac{1}{4}$?',
    atsakymas: '25',
    atsakymasRodymui: '$25\\%$',
    sprendimas: '$\\dfrac{1}{4} = 0{,}25 = 25\\%$.',
  },
] as const

export const trupmenosDesimtainiaiProcentai6: Generatorius = () =>
  suBandymais(kurkPavidalus, A_PAVIDALAI, T1)

function kurkPavidalus(): Uzdavinys | null {
  const p = pasirink(PROCENTU_PAVIDALAI)

  return variacija([
    // 1. Trupmena → procentai
    () =>
      uzdavinys(T1, {
        klausimas: `Kiek procentų sudaro $${p.tr}$?`,
        atsakymas: String(p.proc),
        atsakymasRodymui: `$${p.proc}\\%$`,
        sprendimas: `$${p.tr} = ${p.des} = ${p.proc}\\%$.`,
      }),

    // 2. Procentai → dešimtainis
    () =>
      uzdavinys(T1, {
        klausimas: `Užrašyk $${p.proc}\\%$ dešimtainiu skaičiumi.`,
        atsakymas: p.atsDes,
        atsakymasRodymui: `$${p.des}$`,
        sprendimas: `Procentas yra šimtoji dalis: $${p.proc} : 100 = ${p.des}$.`,
      }),

    // 3. Procentai → trupmena
    () =>
      uzdavinys(T1, {
        klausimas: `Užrašyk $${p.proc}\\%$ paprastąja suprastinta trupmena.`,
        atsakymas: p.atsTr,
        atsakymasRodymui: `$${p.tr}$`,
        sprendimas: `$${p.proc}\\% = \\dfrac{${p.proc}}{100} = ${p.tr}$.`,
      }),

    // 4. Dešimtainis → procentai
    () => {
      const d = atsitiktinis(11, 89)
      return uzdavinys(T1, {
        klausimas: `Kiek procentų sudaro $0{,}${d}$?`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}\\%$`,
        sprendimas: `Dešimtainis skaičius dauginamas iš 100: $0{,}${d} \\cdot 100 = ${d}$.`,
      })
    },

    // 5. Kas yra procentas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kas yra vienas procentas?',
        variantai: ['šimtoji skaičiaus dalis', 'dešimtoji skaičiaus dalis', 'pusė', 'šimtas vienetų'],
        teisingas: 0,
        sprendimas: '$1\\% = \\dfrac{1}{100} = 0{,}01$.',
      }),

    // 6. Kiek procentų sudaro visuma
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek procentų sudaro visa visuma?',
        atsakymas: '100',
        atsakymasRodymui: `$100\\%$`,
        sprendimas: 'Visuma yra šimtas šimtųjų dalių.',
      }),

    // 7. Poros
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Sujunk trupmeną su ją atitinkančiais procentais.',
        poros: [
          { kaire: '$\\dfrac{1}{2}$', desine: '$50\\%$' },
          { kaire: '$\\dfrac{1}{4}$', desine: '$25\\%$' },
          { kaire: '$\\dfrac{1}{5}$', desine: '$20\\%$' },
          { kaire: '$\\dfrac{3}{4}$', desine: '$75\\%$' },
        ],
        sprendimas: 'Trupmena verčiama procentais padauginus iš 100.',
      }),

    // 8. Daugiau nei visuma
    () => {
      const proc = pasirink([120, 150, 200])
      return uzdavinys(T1, {
        klausimas: `Užrašyk $${proc}\\%$ dešimtainiu skaičiumi.`,
        atsakymas: String(proc / 100),
        atsakymasRodymui: `$${String(proc / 100).replace('.', '{,}')}$`,
        sprendimas: `$${proc} : 100 = ${String(proc / 100).replace('.', '{,}')}$ — procentų gali būti ir daugiau nei 100.`,
      })
    },
  ])
}

// ── 6.1.2. Ieškome skaičiaus dalies ─────────────────────────────────────────

const T2 = 'skaiciaus-dalis-6'

const A_DALIS = [
  {
    klausimas: 'Kiek yra $20\\%$ nuo $150$?',
    atsakymas: '30',
    atsakymasRodymui: '$30$',
    sprendimas: '$150 \\cdot 0{,}2 = 30$.',
  },
] as const

export const skaiciausDalis6: Generatorius = () => suBandymais(kurkDali, A_DALIS, T2)

function kurkDali(): Uzdavinys | null {
  const proc = pasirink([5, 10, 20, 25, 40, 50, 75])
  const visuma = atsitiktinis(2, 40) * 20
  if ((visuma * proc) % 100 !== 0) return null
  const dalis = (visuma * proc) / 100

  return variacija([
    // 1. Procentai nuo skaičiaus
    () =>
      uzdavinys(T2, {
        klausimas: `Kiek yra $${proc}\\%$ nuo $${visuma}$?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `$${visuma} : 100 \\cdot ${proc} = ${dalis}$.`,
      }),

    // 2. Kaip skaičiuojama
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kaip randama skaičiaus dalis, išreikšta procentais?',
        variantai: [
          'skaičius dauginamas iš procentų, užrašytų dešimtainiu skaičiumi',
          'skaičius dalijamas iš procentų',
          'procentai atimami iš skaičiaus',
          'skaičius dauginamas iš 100',
        ],
        teisingas: 0,
        sprendimas: `Pavyzdžiui, $${proc}\\%$ nuo $${visuma}$ yra $${visuma} \\cdot ${proc / 100 < 1 ? String(proc / 100).replace('.', '{,}') : proc / 100} = ${dalis}$.`,
      }),

    // 3. Per vieną procentą
    () =>
      uzdavinys(T2, {
        klausimas: `Kiek yra $1\\%$ nuo $${visuma}$?`,
        atsakymas: String(visuma / 100),
        atsakymasRodymui: `$${String(visuma / 100).replace('.', '{,}')}$`,
        sprendimas: `$${visuma} : 100 = ${String(visuma / 100).replace('.', '{,}')}$.`,
      }),

    // 4. Nuolaida
    () => {
      const kaina = atsitiktinis(10, 80) * 100
      const nuolaida = (kaina * proc) / 100
      if (nuolaida % 1 !== 0) return null
      return uzdavinys(T2, {
        klausimas: `Prekė kainavo $${eur(kaina)}$ Eur ir buvo nupiginta $${proc}\\%$. Kiek eurų sudaro nuolaida?`,
        atsakymas: eurAts(nuolaida),
        atsakymasRodymui: `$${eur(nuolaida)}$ Eur`,
        sprendimas: `$${eur(kaina)} : 100 \\cdot ${proc} = ${eur(nuolaida)}$.`,
      })
    },

    // 5. Kiek liko
    () =>
      uzdavinys(T2, {
        klausimas: `Iš $${visuma}$ mokinių $${proc}\\%$ važiavo į ekskursiją. Kiek mokinių nevažiavo?`,
        atsakymas: String(visuma - dalis),
        atsakymasRodymui: `$${visuma - dalis}$`,
        sprendimas: `Važiavo $${dalis}$, tad liko $${visuma} - ${dalis} = ${visuma - dalis}$.`,
      }),

    // 6. Dalis nuo dalies
    () => {
      const antra = pasirink([10, 50])
      const rez = (dalis * antra) / 100
      if (rez % 1 !== 0) return null
      return uzdavinys(T2, {
        klausimas: `Rask $${antra}\\%$ nuo $${proc}\\%$ skaičiaus $${visuma}$.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${proc}\\%$ nuo $${visuma}$ yra $${dalis}$; $${antra}\\%$ nuo $${dalis}$ yra $${rez}$.`,
      })
    },

    // 7. Kiek procentų sudaro
    () =>
      uzdavinys(T2, {
        klausimas: `Kiek procentų nuo $${visuma}$ sudaro $${dalis}$?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `$${dalis} : ${visuma} \\cdot 100 = ${proc}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Mokinys, ieškodamas $${proc}\\%$ nuo $${visuma}$, padaugino $${visuma} \\cdot ${proc}$. Užrašyk teisingą atsakymą.`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: 'Procentus prieš daugybą reikia paversti dešimtaine trupmena, t. y. padalyti iš 100.',
      }),
  ])
}

// ── 6.1.3. Ieškome viso skaičiaus ───────────────────────────────────────────

const T3 = 'visas-skaicius-6'

const A_VISAS = [
  {
    klausimas: 'Rask skaičių, kurio $20\\%$ yra $30$.',
    atsakymas: '150',
    atsakymasRodymui: '$150$',
    sprendimas: '$30 : 20 \\cdot 100 = 150$.',
  },
] as const

export const visasSkaicius6: Generatorius = () => suBandymais(kurkVisa, A_VISAS, T3)

function kurkVisa(): Uzdavinys | null {
  const proc = pasirink([5, 10, 20, 25, 40, 50, 75])
  const visuma = atsitiktinis(2, 40) * 20
  if ((visuma * proc) % 100 !== 0) return null
  const dalis = (visuma * proc) / 100

  return variacija([
    // 1. Rask visumą
    () =>
      uzdavinys(T3, {
        klausimas: `Rask skaičių, kurio $${proc}\\%$ yra $${dalis}$.`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Vienas procentas yra $${dalis} : ${proc} = ${dalis / proc}$, tad visas skaičius yra $${dalis / proc} \\cdot 100 = ${visuma}$.`,
      }),

    // 2. Per vieną procentą
    () =>
      uzdavinys(T3, {
        klausimas: `Skaičiaus $${proc}\\%$ yra $${dalis}$. Kiek yra $1\\%$ to skaičiaus?`,
        atsakymas: String(dalis / proc),
        atsakymasRodymui: `$${String(dalis / proc).replace('.', '{,}')}$`,
        sprendimas: `$${dalis} : ${proc} = ${String(dalis / proc).replace('.', '{,}')}$.`,
      }),

    // 3. Kaip randama
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip randamas visas skaičius, kai žinoma jo dalis procentais?',
        variantai: [
          'dalis dalijama iš procentų ir dauginama iš 100',
          'dalis dauginama iš procentų',
          'dalis dauginama iš 100',
          'prie dalies pridedami procentai',
        ],
        teisingas: 0,
        sprendimas: 'Pirmiausia randama, kiek yra vienas procentas.',
      }),

    // 4. Tekstinis
    () => {
      const vardas = pasirink(VARDAI)
      return uzdavinys(T3, {
        klausimas: `${vardas} perskaitė $${proc}\\%$ knygos — tai $${dalis}$ puslapiai. Kiek puslapių yra knygoje?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `$${dalis} : ${proc} \\cdot 100 = ${visuma}$.`,
      })
    },

    // 5. Kai žinomas likutis
    () => {
      const likutis = visuma - dalis
      if (proc === 100) return null
      return uzdavinys(T3, {
        klausimas: `Išleista $${proc}\\%$ pinigų, liko $${likutis}$ Eur. Kiek pinigų buvo iš pradžių?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$ Eur`,
        sprendimas: `Likutis sudaro $${100 - proc}\\%$: $${likutis} : ${100 - proc} \\cdot 100 = ${visuma}$.`,
      })
    },

    // 6. Padidėjimas
    () => {
      const nauja = visuma + dalis
      return uzdavinys(T3, {
        klausimas: `Skaičius $${visuma}$ padidintas $${proc}\\%$. Koks skaičius gautas?`,
        atsakymas: String(nauja),
        atsakymasRodymui: `$${nauja}$`,
        sprendimas: `$${proc}\\%$ nuo $${visuma}$ yra $${dalis}$; $${visuma} + ${dalis} = ${nauja}$.`,
      })
    },

    // 7. Sumažėjimas
    () =>
      uzdavinys(T3, {
        klausimas: `Skaičius $${visuma}$ sumažintas $${proc}\\%$. Koks skaičius gautas?`,
        atsakymas: String(visuma - dalis),
        atsakymasRodymui: `$${visuma - dalis}$`,
        sprendimas: `$${visuma} - ${dalis} = ${visuma - dalis}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: `Mokinys, ieškodamas skaičiaus, kurio $${proc}\\%$ yra $${dalis}$, padaugino $${dalis} \\cdot ${proc}$. Užrašyk teisingą skaičių.`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: 'Ieškant visumos dalis dalijama iš procentų, o ne dauginama.',
      }),
  ])
}

// ── 6.2.1. Pagrindinė proporcijos savybė ────────────────────────────────────

const T4 = 'proporcijos-savybe'

const A_PROPORCIJA = [
  {
    klausimas: 'Rask nežinomąjį: $\\dfrac{3}{4} = \\dfrac{x}{8}$.',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: '$3 \\cdot 8 = 4x$, tad $x = 6$.',
  },
] as const

export const proporcijosSavybe: Generatorius = () => suBandymais(kurkProporcija, A_PROPORCIJA, T4)

function kurkProporcija(): Uzdavinys | null {
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(2, 9)
  const k = atsitiktinis(2, 6)

  return variacija([
    // 1. Nežinomasis proporcijoje
    () =>
      uzdavinys(T4, {
        klausimas: `Rask nežinomąjį: $\\dfrac{${a}}{${b}} = \\dfrac{x}{${b * k}}$.`,
        atsakymas: String(a * k),
        atsakymasRodymui: `$${a * k}$`,
        sprendimas: `Kraštinių narių sandauga lygi vidurinių: $${a} \\cdot ${b * k} = ${b}x$, tad $x = ${a * k}$.`,
      }),

    // 2. Pagrindinė savybė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kokia yra pagrindinė proporcijos savybė?',
        variantai: [
          'kraštinių narių sandauga lygi vidurinių narių sandaugai',
          'visi keturi nariai lygūs',
          'skaitikliai lygūs',
          'vardikliai lygūs',
        ],
        teisingas: 0,
        sprendimas: 'Jei $\\dfrac{a}{b} = \\dfrac{c}{d}$, tai $ad = bc$.',
      }),

    // 3. Nežinomasis vardiklyje
    () =>
      uzdavinys(T4, {
        klausimas: `Rask nežinomąjį: $\\dfrac{${a}}{${b}} = \\dfrac{${a * k}}{x}$.`,
        atsakymas: String(b * k),
        atsakymasRodymui: `$${b * k}$`,
        sprendimas: `$${a}x = ${b} \\cdot ${a * k}$, tad $x = ${b * k}$.`,
      }),

    // 4. Ar proporcija teisinga
    () => {
      const c = a * k
      const d = b * k + atsitiktinis(1, 3)
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Ar teisinga proporcija $\\dfrac{${a}}{${b}} = \\dfrac{${c}}{${d}}$?`,
        variantai: [
          `ne, nes $${a} \\cdot ${d} \\ne ${b} \\cdot ${c}$`,
          'taip',
          'to patikrinti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: `$${a} \\cdot ${d} = ${a * d}$, o $${b} \\cdot ${c} = ${b * c}$ — sandaugos skiriasi.`,
      })
    },

    // 5. Santykis
    () => {
      const t = suprastink(a * k, b * k)
      return uzdavinys(T4, {
        klausimas: `Suprastink santykį $${a * k} : ${b * k}$. Užrašyk jį trupmena.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$\\dfrac{${t.skaitiklis}}{${t.vardiklis}}$`,
        sprendimas: `Abu nariai dalūs iš ${k}: gaunama $\\dfrac{${a}}{${b}}$.`,
      })
    },

    // 6. Kraštiniai ir viduriniai nariai
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kurie proporcijos $\\dfrac{${a}}{${b}} = \\dfrac{${a * k}}{${b * k}}$ nariai yra kraštiniai?`,
        variantai: [`$${a}$ ir $${b * k}$`, `$${b}$ ir $${a * k}$`, `$${a}$ ir $${b}$`, `$${a * k}$ ir $${b * k}$`],
        teisingas: 0,
        sprendimas: 'Kraštiniai nariai yra pirmasis ir ketvirtasis.',
      }),

    // 7. Tekstinis
    () => {
      const kiek = atsitiktinis(2, 8)
      const kaina = atsitiktinis(2, 9)
      return uzdavinys(T4, {
        klausimas: `${kiek} sąsiuviniai kainuoja ${kiek * kaina} Eur. Kiek kainuos ${kiek * 2} tokie sąsiuviniai?`,
        atsakymas: String(kiek * 2 * kaina),
        atsakymasRodymui: `$${kiek * 2 * kaina}$ Eur`,
        sprendimas: `Sudaroma proporcija $\\dfrac{${kiek}}{${kiek * kaina}} = \\dfrac{${kiek * 2}}{x}$, iš kurios $x = ${kiek * 2 * kaina}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Spręsdamas $\\dfrac{${a}}{${b}} = \\dfrac{x}{${b * k}}$ mokinys sudaugino $${a} \\cdot ${b}$. Užrašyk teisingą $x$ reikšmę.`,
        atsakymas: String(a * k),
        atsakymasRodymui: `$${a * k}$`,
        sprendimas: 'Dauginami kraštiniai su kraštiniais, o ne toje pačioje trupmenoje esantys nariai.',
      }),
  ])
}

// ── 6.2.2. Procentų uždavinių sprendimas sudarant proporciją ────────────────

const T5 = 'procentai-proporcija'

const A_PROC_PROP = [
  {
    klausimas: 'Sudaryk proporciją ir rask, kiek yra $30\\%$ nuo $200$.',
    atsakymas: '60',
    atsakymasRodymui: '$60$',
    sprendimas: '$\\dfrac{200}{100} = \\dfrac{x}{30}$, tad $x = 60$.',
  },
] as const

export const procentaiProporcija: Generatorius = () => suBandymais(kurkProcProp, A_PROC_PROP, T5)

function kurkProcProp(): Uzdavinys | null {
  const proc = pasirink([10, 15, 20, 25, 30, 40, 60, 75])
  const visuma = atsitiktinis(2, 20) * 20
  if ((visuma * proc) % 100 !== 0) return null
  const dalis = (visuma * proc) / 100

  return variacija([
    // 1. Dalis per proporciją
    () =>
      uzdavinys(T5, {
        klausimas: `Sudaryk proporciją ir rask, kiek yra $${proc}\\%$ nuo $${visuma}$.`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `$\\dfrac{${visuma}}{100} = \\dfrac{x}{${proc}}$, iš čia $x = ${dalis}$.`,
      }),

    // 2. Visuma per proporciją
    () =>
      uzdavinys(T5, {
        klausimas: `Sudaryk proporciją ir rask skaičių, kurio $${proc}\\%$ yra $${dalis}$.`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `$\\dfrac{x}{100} = \\dfrac{${dalis}}{${proc}}$, iš čia $x = ${visuma}$.`,
      }),

    // 3. Kiek procentų
    () =>
      uzdavinys(T5, {
        klausimas: `Kiek procentų nuo $${visuma}$ sudaro $${dalis}$? Spręsk sudarydamas proporciją.`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `$\\dfrac{${visuma}}{100} = \\dfrac{${dalis}}{x}$, iš čia $x = ${proc}$.`,
      }),

    // 4. Kaip sudaroma proporcija
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kaip sudaroma proporcija procentų uždaviniui?',
        variantai: [
          'visas skaičius atitinka $100\\%$, o ieškoma dalis — duotus procentus',
          'visas skaičius atitinka $1\\%$',
          'procentai rašomi abiejose pusėse',
          'proporcijos sudaryti negalima',
        ],
        teisingas: 0,
        sprendimas: 'Iš tokios proporcijos randamas bet kuris nežinomas dydis.',
      }),

    // 5. Nuolaida
    () => {
      const kaina = atsitiktinis(20, 90) * 100
      const nuolaida = (kaina * proc) / 100
      if (nuolaida % 1 !== 0) return null
      return uzdavinys(T5, {
        klausimas: `Prekė kainavo $${eur(kaina)}$ Eur, nuolaida $${proc}\\%$. Kiek kainuoja prekė po nuolaidos?`,
        atsakymas: eurAts(kaina - nuolaida),
        atsakymasRodymui: `$${eur(kaina - nuolaida)}$ Eur`,
        sprendimas: `Nuolaida $${eur(nuolaida)}$ Eur; $${eur(kaina)} - ${eur(nuolaida)} = ${eur(kaina - nuolaida)}$.`,
      })
    },

    // 6. Kiek procentų padidėjo
    () => {
      const nauja = visuma + dalis
      return uzdavinys(T5, {
        klausimas: `Skaičius padidėjo nuo $${visuma}$ iki $${nauja}$. Keliais procentais jis padidėjo?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `Padidėjo $${dalis}$; $\\dfrac{${visuma}}{100} = \\dfrac{${dalis}}{x}$, iš čia $x = ${proc}$.`,
      })
    },

    // 7. Druskos tirpalas
    () => {
      const tirpalas = atsitiktinis(2, 10) * 100
      const druskos = (tirpalas * proc) / 100
      if (druskos % 1 !== 0) return null
      return uzdavinys(T5, {
        klausimas: `Tirpale yra $${proc}\\%$ druskos. Kiek gramų druskos yra ${tirpalas} g tirpalo?`,
        atsakymas: String(druskos),
        atsakymasRodymui: `$${druskos}$ g`,
        sprendimas: `$\\dfrac{${tirpalas}}{100} = \\dfrac{x}{${proc}}$, iš čia $x = ${druskos}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Mokinys sudarė proporciją $\\dfrac{${visuma}}{${proc}} = \\dfrac{x}{100}$ ieškodamas $${proc}\\%$ nuo $${visuma}$. Užrašyk teisingą atsakymą.`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `Visas skaičius atitinka $100\\%$, tad teisinga proporcija yra $\\dfrac{${visuma}}{100} = \\dfrac{x}{${proc}}$.`,
      }),
  ])
}

// ── 6.2.3. Dalijimas proporcingai ───────────────────────────────────────────

const T6 = 'dalijimas-proporcingai'

const A_DALIJIMAS = [
  {
    klausimas: 'Padalyk $40$ santykiu $2 : 3$. Užrašyk didesniąją dalį.',
    atsakymas: '24',
    atsakymasRodymui: '$24$',
    sprendimas: 'Dalių iš viso 5; viena dalis lygi 8, tad didesnioji dalis $8 \\cdot 3 = 24$.',
  },
] as const

export const dalijimasProporcingai: Generatorius = () => suBandymais(kurkDalijima, A_DALIJIMAS, T6)

function kurkDalijima(): Uzdavinys | null {
  const d1 = atsitiktinis(1, 5)
  const d2 = atsitiktinis(1, 5)
  if (d1 === d2) return null
  const viena = atsitiktinis(3, 20)
  const viso = viena * (d1 + d2)

  return variacija([
    // 1. Didesnioji dalis
    () =>
      uzdavinys(T6, {
        klausimas: `Padalyk $${viso}$ santykiu $${d1} : ${d2}$. Užrašyk didesniąją dalį.`,
        atsakymas: String(viena * Math.max(d1, d2)),
        atsakymasRodymui: `$${viena * Math.max(d1, d2)}$`,
        sprendimas: `Dalių iš viso $${d1} + ${d2} = ${d1 + d2}$; viena dalis $${viso} : ${d1 + d2} = ${viena}$.`,
      }),

    // 2. Viena dalis
    () =>
      uzdavinys(T6, {
        klausimas: `Skaičius $${viso}$ dalijamas santykiu $${d1} : ${d2}$. Kiek vienetų tenka vienai daliai?`,
        atsakymas: String(viena),
        atsakymasRodymui: `$${viena}$`,
        sprendimas: `$${viso} : (${d1} + ${d2}) = ${viena}$.`,
      }),

    // 3. Kiek dalių iš viso
    () =>
      uzdavinys(T6, {
        klausimas: `Į kiek lygių dalių padalytas skaičius, dalijant jį santykiu $${d1} : ${d2}$?`,
        atsakymas: String(d1 + d2),
        atsakymasRodymui: `$${d1 + d2}$`,
        sprendimas: `$${d1} + ${d2} = ${d1 + d2}$.`,
      }),

    // 4. Skirtumas tarp dalių
    () =>
      uzdavinys(T6, {
        klausimas: `Skaičius $${viso}$ padalytas santykiu $${d1} : ${d2}$. Kiek viena dalis didesnė už kitą?`,
        atsakymas: String(viena * Math.abs(d1 - d2)),
        atsakymasRodymui: `$${viena * Math.abs(d1 - d2)}$`,
        sprendimas: `Skirtumas yra $${Math.abs(d1 - d2)}$ dalys: $${viena} \\cdot ${Math.abs(d1 - d2)} = ${viena * Math.abs(d1 - d2)}$.`,
      }),

    // 5. Trijų dalių santykis
    () => {
      const d3 = atsitiktinis(1, 4)
      const viena3 = atsitiktinis(3, 12)
      const viso3 = viena3 * (d1 + d2 + d3)
      return uzdavinys(T6, {
        klausimas: `Padalyk $${viso3}$ santykiu $${d1} : ${d2} : ${d3}$. Užrašyk pirmąją dalį.`,
        atsakymas: String(viena3 * d1),
        atsakymasRodymui: `$${viena3 * d1}$`,
        sprendimas: `Dalių iš viso ${d1 + d2 + d3}; viena dalis $${viso3} : ${d1 + d2 + d3} = ${viena3}$, tad pirmoji dalis $${viena3} \\cdot ${d1} = ${viena3 * d1}$.`,
      })
    },

    // 6. Tekstinis — pinigai
    () => {
      const vardas = pasirink(VARDAI)
      return uzdavinys(T6, {
        klausimas: `${vardas} ir draugas pasidalijo ${viso} Eur santykiu $${d1} : ${d2}$. Kiek eurų gavo tas, kuriam teko mažesnioji dalis?`,
        atsakymas: String(viena * Math.min(d1, d2)),
        atsakymasRodymui: `$${viena * Math.min(d1, d2)}$ Eur`,
        sprendimas: `Viena dalis $${viena}$; mažesnioji dalis $${viena} \\cdot ${Math.min(d1, d2)} = ${viena * Math.min(d1, d2)}$.`,
      })
    },

    // 7. Atvirkštinis
    () =>
      uzdavinys(T6, {
        klausimas: `Skaičius padalytas santykiu $${d1} : ${d2}$, ir mažesnioji dalis lygi $${viena * Math.min(d1, d2)}$. Koks buvo visas skaičius?`,
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `Viena dalis $${viena * Math.min(d1, d2)} : ${Math.min(d1, d2)} = ${viena}$; visas skaičius $${viena} \\cdot ${d1 + d2} = ${viso}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: `Dalydamas $${viso}$ santykiu $${d1} : ${d2}$ mokinys padalijo iš 2. Kiek vienetų iš tikrųjų tenka vienai daliai?`,
        atsakymas: String(viena),
        atsakymasRodymui: `$${viena}$`,
        sprendimas: `Dalijama iš dalių sumos $${d1} + ${d2} = ${d1 + d2}$, o ne iš dalių skaičiaus.`,
      }),
  ])
}

// ── Finansiniai skaičiavimai (programos potemė) ─────────────────────────────

const T7 = 'finansai-6'

const A_FINANSAI = [
  {
    klausimas: 'Prekė kainavo 40 Eur, nuolaida 25 %. Kiek ji kainuoja po nuolaidos?',
    atsakymas: '30',
    atsakymasRodymui: '$30$ Eur',
    sprendimas: 'Nuolaida 10 Eur, tad lieka 30 Eur.',
  },
] as const

export const finansai6: Generatorius = () => suBandymais(kurkFinansus, A_FINANSAI, T7)

function kurkFinansus(): Uzdavinys | null {
  const proc = pasirink([10, 20, 25, 50])
  const kaina = atsitiktinis(10, 90) * 100
  const nuolaida = (kaina * proc) / 100
  if (nuolaida % 1 !== 0) return null

  return variacija([
    // 1. Kaina po nuolaidos
    () =>
      uzdavinys(T7, {
        klausimas: `Prekė kainavo $${eur(kaina)}$ Eur, nuolaida $${proc}\\%$. Kiek ji kainuoja po nuolaidos?`,
        atsakymas: eurAts(kaina - nuolaida),
        atsakymasRodymui: `$${eur(kaina - nuolaida)}$ Eur`,
        sprendimas: `Nuolaida $${eur(nuolaida)}$ Eur: $${eur(kaina)} - ${eur(nuolaida)} = ${eur(kaina - nuolaida)}$.`,
      }),

    // 2. Vieneto tarifas
    () => {
      const kiek = atsitiktinis(2, 12)
      const uzVieneta = atsitiktinis(105, 890)
      return uzdavinys(T7, {
        klausimas: `Vienas kilovatvalandės tarifas $${eur(uzVieneta)}$ Eur. Kiek kainuos ${kiek} kWh?`,
        atsakymas: eurAts(uzVieneta * kiek),
        atsakymasRodymui: `$${eur(uzVieneta * kiek)}$ Eur`,
        sprendimas: `$${eur(uzVieneta)} \\cdot ${kiek} = ${eur(uzVieneta * kiek)}$.`,
      })
    },

    // 3. Kuris pirkinys naudingesnis
    () => {
      const a = atsitiktinis(2, 6)
      const kainaA = atsitiktinis(200, 600)
      const b = a + atsitiktinis(1, 4)
      const kainaB = Math.round((kainaA / a) * b) - atsitiktinis(10, 40)
      return uzdavinys(T7, {
        klausimas: `Pakuotė iš ${a} vienetų kainuoja $${eur(kainaA)}$ Eur, pakuotė iš ${b} vienetų — $${eur(kainaB)}$ Eur. Kurios pakuotės vieneto kaina mažesnė? Užrašyk vienetų skaičių toje pakuotėje.`,
        atsakymas: String(kainaA / a <= kainaB / b ? a : b),
        atsakymasRodymui: `$${kainaA / a <= kainaB / b ? a : b}$`,
        sprendimas: `Vieneto kainos: $${eur(Math.round(kainaA / a))}$ Eur ir $${eur(Math.round(kainaB / b))}$ Eur.`,
      })
    },

    // 4. Biudžetas
    () => {
      const pajamos = atsitiktinis(300, 900) * 100
      const islaidos = Math.round((pajamos * atsitiktinis(50, 90)) / 100)
      return uzdavinys(T7, {
        klausimas: `Mėnesio pajamos $${eur(pajamos)}$ Eur, išlaidos $${eur(islaidos)}$ Eur. Kiek eurų galima sutaupyti?`,
        atsakymas: eurAts(pajamos - islaidos),
        atsakymasRodymui: `$${eur(pajamos - islaidos)}$ Eur`,
        sprendimas: `$${eur(pajamos)} - ${eur(islaidos)} = ${eur(pajamos - islaidos)}$.`,
      })
    },

    // 5. Mokestis
    () => {
      const alga = atsitiktinis(500, 1500) * 100
      const mokestis = Math.round((alga * 20) / 100)
      return uzdavinys(T7, {
        klausimas: `Nuo $${eur(alga)}$ Eur atlyginimo išskaičiuojama $20\\%$ mokesčių. Kiek eurų lieka?`,
        atsakymas: eurAts(alga - mokestis),
        atsakymasRodymui: `$${eur(alga - mokestis)}$ Eur`,
        sprendimas: `Mokesčiai $${eur(mokestis)}$ Eur: $${eur(alga)} - ${eur(mokestis)} = ${eur(alga - mokestis)}$.`,
      })
    },

    // 6. Kiek procentų nuolaida
    () =>
      uzdavinys(T7, {
        klausimas: `Prekė atpigo nuo $${eur(kaina)}$ Eur iki $${eur(kaina - nuolaida)}$ Eur. Keliais procentais ji atpigo?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `Atpigo $${eur(nuolaida)}$ Eur; $${eur(nuolaida)} : ${eur(kaina)} \\cdot 100 = ${proc}$.`,
      }),

    // 7. Kaina prieš nuolaidą
    () =>
      uzdavinys(T7, {
        klausimas: `Po $${proc}\\%$ nuolaidos prekė kainuoja $${eur(kaina - nuolaida)}$ Eur. Kiek ji kainavo prieš nuolaidą?`,
        atsakymas: eurAts(kaina),
        atsakymasRodymui: `$${eur(kaina)}$ Eur`,
        sprendimas: `Po nuolaidos lieka $${100 - proc}\\%$: $${eur(kaina - nuolaida)} : ${100 - proc} \\cdot 100 = ${eur(kaina)}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Prekė atpigo $${proc}\\%$, o paskui vėl pabrango $${proc}\\%$. Ar ji atsidūrė ties pradine kaina?`,
        atsakymas: 'ne',
        atsakymasRodymui: 'Ne',
        sprendimas: `Procentai skaičiuojami nuo skirtingų kainų: $${proc}\\%$ nuo mažesnės kainos yra mažiau nei nuo pradinės.`,
      }),
  ])
}

// ── 7.1.1. Formulės, lentelės ───────────────────────────────────────────────

const T8 = 'formules-lenteles'

const A_FORMULES = [
  {
    klausimas: 'Pagal formulę $y = 4x$ apskaičiuok $y$, kai $x = 6$.',
    atsakymas: '24',
    atsakymasRodymui: '$24$',
    sprendimas: '$4 \\cdot 6 = 24$.',
  },
] as const

export const formulesLenteles: Generatorius = () => suBandymais(kurkFormules, A_FORMULES, T8)

function kurkFormules(): Uzdavinys | null {
  const k = atsitiktinis(2, 9)
  const x = atsitiktinis(2, 12)

  return variacija([
    // 1. Reikšmė pagal formulę
    () =>
      uzdavinys(T8, {
        klausimas: `Pagal formulę $y = ${k}x$ apskaičiuok $y$, kai $x = ${x}$.`,
        atsakymas: String(k * x),
        atsakymasRodymui: `$${k * x}$`,
        sprendimas: `$${k} \\cdot ${x} = ${k * x}$.`,
      }),

    // 2. Lentelės pildymas
    () =>
      uzdavinys(T8, {
        klausimas: `Lentelė pildoma pagal formulę $y = ${k}x$. Kokia bus trūkstama reikšmė?`,
        atsakymas: String(k * 5),
        atsakymasRodymui: `$${k * 5}$`,
        sprendimas: `Kai $x = 5$: $${k} \\cdot 5 = ${k * 5}$.`,
        brezinys: ivestiesLentele([1, 2, 3, 5], [k, k * 2, k * 3, null]),
      }),

    // 3. Atvirkštinis
    () =>
      uzdavinys(T8, {
        klausimas: `Pagal formulę $y = ${k}x$ rask $x$, kai $y = ${k * x}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `$${k * x} : ${k} = ${x}$.`,
      }),

    // 4. Kelio formulė
    () => {
      const greitis = atsitiktinis(40, 90)
      const laikas = atsitiktinis(2, 6)
      return uzdavinys(T8, {
        klausimas: `Pagal formulę $s = vt$ apskaičiuok kelią, kai greitis ${greitis} km/h, o laikas ${laikas} h.`,
        atsakymas: String(greitis * laikas),
        atsakymasRodymui: `$${greitis * laikas}$ km`,
        sprendimas: `$${greitis} \\cdot ${laikas} = ${greitis * laikas}$.`,
      })
    },

    // 5. Formulė iš lentelės
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kokia formulė sieja lentelės dydžius?',
        variantai: [`$y = ${k}x$`, `$y = x + ${k}$`, `$y = ${k} - x$`, `$y = \\dfrac{x}{${k}}$`],
        teisingas: 0,
        sprendimas: `Kiekviena $y$ reikšmė yra ${k} kartus didesnė už atitinkamą $x$.`,
        brezinys: ivestiesLentele([1, 2, 3, 4], [k, k * 2, k * 3, k * 4]),
      }),

    // 6. Perimetro formulė
    () => {
      const krastine = atsitiktinis(3, 15)
      return uzdavinys(T8, {
        klausimas: `Kvadrato perimetras skaičiuojamas pagal formulę $P = 4a$. Koks perimetras, kai $a = ${krastine}$ cm?`,
        atsakymas: String(4 * krastine),
        atsakymasRodymui: `$${4 * krastine}$ cm`,
        sprendimas: `$4 \\cdot ${krastine} = ${4 * krastine}$.`,
      })
    },

    // 7. Kainos formulė
    () => {
      const kaina = atsitiktinis(2, 9)
      const kiek = atsitiktinis(3, 15)
      return uzdavinys(T8, {
        klausimas: `Vieno vieneto kaina ${kaina} Eur. Užrašyk formulę bendrai kainai $y$ apskaičiuoti, kai perkama $x$ vienetų, ir rask $y$, kai $x = ${kiek}$.`,
        atsakymas: String(kaina * kiek),
        atsakymasRodymui: `$y = ${kaina}x$, $y = ${kaina * kiek}$ Eur`,
        sprendimas: `$${kaina} \\cdot ${kiek} = ${kaina * kiek}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T8, {
        klausimas: `Pagal formulę $y = ${k}x$ mokinys, esant $x = ${x}$, gavo $y = ${k + x}$. Užrašyk teisingą $y$ reikšmę.`,
        atsakymas: String(k * x),
        atsakymasRodymui: `$${k * x}$`,
        sprendimas: `Užrašas $${k}x$ reiškia daugybą: $${k} \\cdot ${x} = ${k * x}$.`,
      }),
  ])
}

// ── 7.1.2. Grafikai ─────────────────────────────────────────────────────────

const T9 = 'grafikai-6'

const A_GRAFIKAI = [
  {
    klausimas: 'Grafike pavaizduota kelio priklausomybė nuo laiko. Kokį kelią atitinka 3 valandos, jei per valandą nuvažiuojama 60 km?',
    atsakymas: '180',
    atsakymasRodymui: '$180$ km',
    sprendimas: '$60 \\cdot 3 = 180$.',
  },
] as const

export const grafikai6: Generatorius = () => suBandymais(kurkGrafikus, A_GRAFIKAI, T9)

function kurkGrafikus(): Uzdavinys | null {
  const k = atsitiktinis(2, 6)
  const ikiX = atsitiktinis(4, 6)
  const taskas = atsitiktinis(2, ikiX - 1)

  return variacija([
    // 1. Reikšmė iš grafiko
    () =>
      uzdavinys(T9, {
        klausimas: `Kokia $y$ reikšmė atitinka $x = ${taskas}$?`,
        atsakymas: String(k * taskas),
        atsakymasRodymui: `$${k * taskas}$`,
        sprendimas: 'Nuo pažymėto taško punktyru einama iki $y$ ašies.',
        brezinys: proporcingumoGrafikas(k, ikiX, taskas),
      }),

    // 2. Atvirkštinė nuskaita
    () =>
      uzdavinys(T9, {
        klausimas: `Kokia $x$ reikšmė atitinka $y = ${k * taskas}$?`,
        atsakymas: String(taskas),
        atsakymasRodymui: `$${taskas}$`,
        sprendimas: 'Nuo $y$ ašies einama iki tiesės, o iš jos žemyn iki $x$ ašies.',
        brezinys: proporcingumoGrafikas(k, ikiX, taskas),
      }),

    // 3. Kaina pagal grafiką
    () =>
      uzdavinys(T9, {
        klausimas: `Grafike pavaizduota, kiek eurų kainuoja prekės kilogramai. Kiek kainuoja ${taskas} kg?`,
        atsakymas: String(k * taskas),
        atsakymasRodymui: `$${k * taskas}$ Eur`,
        sprendimas: `Vienas kilogramas kainuoja ${k} Eur: $${k} \\cdot ${taskas} = ${k * taskas}$.`,
        brezinys: proporcingumoGrafikas(k, ikiX, taskas, { x: 'kg', y: 'Eur' }),
      }),

    // 4. Vieneto kaina iš grafiko
    () =>
      uzdavinys(T9, {
        klausimas: 'Kiek eurų kainuoja vienas kilogramas pagal grafiką?',
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$ Eur`,
        sprendimas: `Iš pažymėto taško: $${k * taskas} : ${taskas} = ${k}$.`,
        brezinys: proporcingumoGrafikas(k, ikiX, taskas, { x: 'kg', y: 'Eur' }),
      }),

    // 5. Ką rodo grafiko taškas
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Ką rodo kiekvienas tiesės taškas šiame grafike?',
        variantai: [
          'vieną $x$ ir $y$ reikšmių porą',
          'tik $x$ reikšmę',
          'tik $y$ reikšmę',
          'dydžių sumą',
        ],
        teisingas: 0,
        sprendimas: 'Taško abscisė yra $x$, ordinatė — atitinkama $y$ reikšmė.',
        brezinys: proporcingumoGrafikas(k, ikiX),
      }),

    // 6. Ar grafikas eina per pradžią
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kodėl šis grafikas prasideda koordinačių pradžios taške?',
        variantai: [
          'nes kai $x = 0$, ir $y = 0$',
          'nes taip patogiau braižyti',
          'nes tiesė visada eina per nulį',
          'nes ašys susikerta',
        ],
        teisingas: 0,
        sprendimas: 'Nepirkus nė kilogramo, mokėti nereikia nieko.',
        brezinys: proporcingumoGrafikas(k, ikiX),
      }),

    // 7. Kelias ir laikas
    () => {
      const greitis = atsitiktinis(40, 80)
      const laikas = atsitiktinis(2, 5)
      return uzdavinys(T9, {
        klausimas: `Grafikas rodo kelio priklausomybę nuo laiko, kai važiuojama pastoviu ${greitis} km/h greičiu. Kokį kelią atitinka ${laikas} h?`,
        atsakymas: String(greitis * laikas),
        atsakymasRodymui: `$${greitis * laikas}$ km`,
        sprendimas: `$${greitis} \\cdot ${laikas} = ${greitis * laikas}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Iš grafiko mokinys nuskaitė, kad $x = ${taskas}$ atitinka $y = ${taskas}$. Užrašyk teisingą $y$ reikšmę.`,
        atsakymas: String(k * taskas),
        atsakymasRodymui: `$${k * taskas}$`,
        sprendimas: 'Reikšmė nuskaitoma nuo $y$ ašies, o ne nuo tos pačios $x$ ašies.',
        brezinys: proporcingumoGrafikas(k, ikiX, taskas),
      }),
  ])
}

// ── 7.2.1. Tiesiogiai proporcingi dydžiai ───────────────────────────────────

const T10 = 'tiesiogiai-proporcingi'

const A_PROPORCINGI = [
  {
    klausimas: 'Kada du dydžiai vadinami tiesiogiai proporcingais?',
    atsakymas: 'kai ju santykis pastovus',
    atsakymasRodymui: 'Kai jų santykis pastovus',
    sprendimas: 'Vienam padidėjus kelis kartus, tiek pat kartų padidėja ir kitas.',
  },
] as const

export const tiesiogiaiProporcingi: Generatorius = () => suBandymais(kurkProporcingus, A_PROPORCINGI, T10)

function kurkProporcingus(): Uzdavinys | null {
  const k = atsitiktinis(2, 12)
  const x1 = atsitiktinis(2, 9)
  const kartai = atsitiktinis(2, 4)

  return variacija([
    // 1. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kada du dydžiai vadinami tiesiogiai proporcingais?',
        variantai: [
          'kai vienam padidėjus kelis kartus tiek pat kartų padidėja ir kitas',
          'kai vienam padidėjus kitas tiek pat kartų sumažėja',
          'kai jų suma pastovi',
          'kai jie lygūs',
        ],
        teisingas: 0,
        sprendimas: 'Tada jų santykis yra pastovus dydis.',
      }),

    // 2. Proporcingumo koeficientas
    () =>
      uzdavinys(T10, {
        klausimas: `Dydžiai tiesiogiai proporcingi: kai $x = ${x1}$, tai $y = ${k * x1}$. Koks proporcingumo koeficientas?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `$${k * x1} : ${x1} = ${k}$.`,
      }),

    // 3. Kiek kartų padidės
    () =>
      uzdavinys(T10, {
        klausimas: `Dydžiai tiesiogiai proporcingi. $x$ padidėjo ${kartai} kartus. Kiek kartų padidėjo $y$?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: 'Tiesiogiai proporcingi dydžiai kinta vienodai.',
      }),

    // 4. Rask antrą reikšmę
    () =>
      uzdavinys(T10, {
        klausimas: `Dydžiai tiesiogiai proporcingi: kai $x = ${x1}$, tai $y = ${k * x1}$. Kiek bus $y$, kai $x = ${x1 * kartai}$?`,
        atsakymas: String(k * x1 * kartai),
        atsakymasRodymui: `$${k * x1 * kartai}$`,
        sprendimas: `$x$ padidėjo ${kartai} kartus, tad ir $y$ padidėja tiek pat: $${k * x1} \\cdot ${kartai} = ${k * x1 * kartai}$.`,
      }),

    // 5. Kurie dydžiai proporcingi
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kurie du dydžiai yra tiesiogiai proporcingi?',
        variantai: [
          'prekės kiekis ir jos kaina',
          'greitis ir kelionės laikas nuvažiuojant tą patį kelią',
          'stačiakampio kraštinė ir jo perimetras esant pastoviai kitai kraštinei',
          'žmogaus amžius ir ūgis',
        ],
        teisingas: 0,
        sprendimas: 'Perkant dvigubai daugiau, mokama dvigubai daugiau.',
      }),

    // 6. Lentelė
    () =>
      uzdavinys(T10, {
        klausimas: 'Lentelės dydžiai tiesiogiai proporcingi. Kokia bus trūkstama reikšmė?',
        atsakymas: String(k * 5),
        atsakymasRodymui: `$${k * 5}$`,
        sprendimas: `Proporcingumo koeficientas ${k}: $${k} \\cdot 5 = ${k * 5}$.`,
        brezinys: ivestiesLentele([1, 2, 3, 5], [k, k * 2, k * 3, null]),
      }),

    // 7. Tekstinis
    () => {
      const kiek = atsitiktinis(2, 8)
      return uzdavinys(T10, {
        klausimas: `${kiek} vienodos knygos sveria ${kiek * k} kg. Kiek svers ${kiek * kartai} tokios knygos?`,
        atsakymas: String(kiek * kartai * k),
        atsakymasRodymui: `$${kiek * kartai * k}$ kg`,
        sprendimas: `Vienos knygos masė ${k} kg: $${k} \\cdot ${kiek * kartai} = ${kiek * kartai * k}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Mokinys teigia, kad greitis ir kelionės laikas, nuvažiuojant tą patį kelią, yra tiesiogiai proporcingi. Kodėl jis klysta?',
        variantai: [
          'nes didėjant greičiui laikas mažėja — dydžiai atvirkščiai proporcingi',
          'nes greitis nėra dydis',
          'nes laikas visada pastovus',
          'jis neklysta',
        ],
        teisingas: 0,
        sprendimas: 'Tiesiogiai proporcingi dydžiai didėja kartu.',
      }),
  ])
}

// ── 7.2.2. Tiesiogiai proporcingų dydžių priklausomybės grafikas ────────────

const T11 = 'proporcingumo-grafikas-6'

const A_GRAFIKAS = [
  {
    klausimas: 'Kokia linija vaizduojamas tiesiogiai proporcingų dydžių ryšys?',
    atsakymas: 'tiese',
    atsakymasRodymui: 'Tiesė, einanti per koordinačių pradžią',
    sprendimas: 'Kai $x = 0$, ir $y = 0$.',
  },
] as const

export const proporcingumoGrafikas6: Generatorius = () => suBandymais(kurkGrafika, A_GRAFIKAS, T11)

function kurkGrafika(): Uzdavinys | null {
  const k = atsitiktinis(2, 6)
  const ikiX = atsitiktinis(4, 6)
  const taskas = atsitiktinis(2, ikiX - 1)

  return variacija([
    // 1. Kokia linija
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kokia linija vaizduojamas tiesiogiai proporcingų dydžių ryšys?',
        variantai: [
          'tiesė, einanti per koordinačių pradžią',
          'tiesė, nekertanti ašių',
          'kreivė',
          'laužtė',
        ],
        teisingas: 0,
        sprendimas: 'Nuliniam $x$ atitinka nulinis $y$, tad tiesė eina per pradžios tašką.',
        brezinys: proporcingumoGrafikas(k, ikiX),
      }),

    // 2. Koeficientas iš grafiko
    () =>
      uzdavinys(T11, {
        klausimas: 'Koks yra proporcingumo koeficientas pagal grafiką?',
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `Iš pažymėto taško: $${k * taskas} : ${taskas} = ${k}$.`,
        brezinys: proporcingumoGrafikas(k, ikiX, taskas),
      }),

    // 3. Formulė iš grafiko
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kokia formulė atitinka pavaizduotą grafiką?',
        variantai: [`$y = ${k}x$`, `$y = x + ${k}$`, `$y = ${k}$`, `$y = \\dfrac{x}{${k}}$`],
        teisingas: 0,
        sprendimas: `Pažymėtame taške $x = ${taskas}$, $y = ${k * taskas}$, o $${k * taskas} : ${taskas} = ${k}$.`,
        brezinys: proporcingumoGrafikas(k, ikiX, taskas),
      }),

    // 4. Taško reikšmė
    () =>
      uzdavinys(T11, {
        klausimas: `Kokia $y$ reikšmė atitinka $x = ${ikiX}$?`,
        atsakymas: String(k * ikiX),
        atsakymasRodymui: `$${k * ikiX}$`,
        sprendimas: `$${k} \\cdot ${ikiX} = ${k * ikiX}$.`,
        brezinys: proporcingumoGrafikas(k, ikiX),
      }),

    // 5. Kuo statesnė tiesė
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Ką rodo tiesės statumas tiesioginio proporcingumo grafike?',
        variantai: [
          'proporcingumo koeficiento dydį',
          'dydžių sumą',
          'grafiko ilgį',
          'ašių padalų skaičių',
        ],
        teisingas: 0,
        sprendimas: 'Kuo koeficientas didesnis, tuo tiesė statesnė.',
      }),

    // 6. Ar taškas priklauso
    () => {
      const y = k * taskas + atsitiktinis(1, 4)
      return pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Ar taškas $(${taskas}; ${y})$ priklauso grafikui $y = ${k}x$?`,
        variantai: [`ne, nes $${k} \\cdot ${taskas} = ${k * taskas}$`, 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `Grafikui priklausytų taškas $(${taskas}; ${k * taskas})$.`,
      })
    },

    // 7. Grafiko braižymas
    () =>
      uzdavinys(T11, {
        klausimas: `Kiek taškų pakanka, kad būtų galima nubrėžti tiesioginio proporcingumo grafiką?`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Vienas taškas visada yra koordinačių pradžia, tad pakanka rasti dar vieną.',
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T11, {
        klausimas: 'Mokinys nubrėžė tiesioginio proporcingumo grafiką, nekertantį koordinačių pradžios taško. Per kurį tašką grafikas privalo eiti? Užrašyk jo abscisę ir ordinatę atskirai — pradėk nuo abscisės.',
        atsakymas: '0',
        atsakymasRodymui: '$(0; 0)$ — abscisė $0$',
        sprendimas: 'Nuliniam $x$ visada atitinka nulinis $y$.',
      }),
  ])
}
