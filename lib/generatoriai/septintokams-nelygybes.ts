import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { hiperbole, intervalas } from './septintokams-vaizdai'
import { VARDAI } from './ketvirtokams-bendra'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 7 klasės temos „Procentai“, „Nelygybės“ ir „Atvirkštinis proporcingumas“ —
 * dvidešimt viena potemė.
 *
 * Programoje procentų temoje yra ir potemė „Biudžetas, finansiniai tikslai ir
 * paskolų pasiūlymų palyginimas“, kurios turinio apraše nėra; ji čia
 * priklauso, nes remiasi tais pačiais palūkanų skaičiavimais.
 *
 * Nelygybėse svarbiausia taisyklė — dauginant ar dalijant iš neigiamo
 * skaičiaus ženklas apsiverčia, tad ji turi atskirą generatorių ir kartojasi
 * klaidos radimo variantuose.
 */

/** Pinigai centais → eurų užrašas. */
function eur(centai: number): string {
  const zenklas = centai < 0 ? '-' : ''
  const a = Math.abs(Math.round(centai))
  return `${zenklas}${Math.floor(a / 100)}{,}${String(a % 100).padStart(2, '0')}`
}

function eurAts(centai: number): string {
  return (Math.round(centai) / 100).toFixed(2)
}

/** Nelygybės ženklas ir jam priešingas. */
function apversk(zenklas: string): string {
  return { '<': '>', '>': '<', '\\le': '\\ge', '\\ge': '\\le' }[zenklas] ?? zenklas
}

// ── 3.1. Ieškome, kiek procentų pakito dydis ────────────────────────────────

const T1 = 'kiek-procentu-pakito'

const A_PAKITO = [
  {
    klausimas: 'Kaina pakilo nuo 200 iki 250 Eur. Keliais procentais ji pabrango?',
    atsakymas: '25',
    atsakymasRodymui: '$25\\%$',
    sprendimas: 'Pokytis 50; $50 : 200 \\cdot 100 = 25$.',
  },
] as const

export const kiekProcentuPakito: Generatorius = () => suBandymais(kurkPakito, A_PAKITO, T1)

function kurkPakito(): Uzdavinys | null {
  const proc = pasirink([5, 10, 20, 25, 40, 50])
  const pradine = atsitiktinis(2, 20) * 100
  const pokytis = (pradine * proc) / 100
  if (pokytis % 1 !== 0) return null

  return variacija([
    // 1. Padidėjimas
    () =>
      uzdavinys(T1, {
        klausimas: `Dydis pakito nuo ${pradine} iki ${pradine + pokytis}. Keliais procentais jis padidėjo?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `Pokytis $${pokytis}$; $${pokytis} : ${pradine} \\cdot 100 = ${proc}$.`,
      }),

    // 2. Sumažėjimas
    () =>
      uzdavinys(T1, {
        klausimas: `Dydis pakito nuo ${pradine} iki ${pradine - pokytis}. Keliais procentais jis sumažėjo?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `Pokytis $${pokytis}$; $${pokytis} : ${pradine} \\cdot 100 = ${proc}$.`,
      }),

    // 3. Nuo ko skaičiuojama
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Nuo kurios reikšmės skaičiuojamas pokytis procentais?',
        variantai: ['nuo pradinės', 'nuo galutinės', 'nuo didesniosios', 'nuo jų vidurkio'],
        teisingas: 0,
        sprendimas: 'Pradinė reikšmė atitinka $100\\%$.',
      }),

    // 4. Kainos pokytis
    () => {
      const kaina = atsitiktinis(10, 60) * 100
      const nuolaida = (kaina * proc) / 100
      if (nuolaida % 1 !== 0) return null
      return uzdavinys(T1, {
        klausimas: `Prekė atpigo nuo $${eur(kaina)}$ Eur iki $${eur(kaina - nuolaida)}$ Eur. Keliais procentais ji atpigo?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `Atpigo $${eur(nuolaida)}$ Eur, o tai ${proc}\\% pradinės kainos.`,
      })
    },

    // 5. Kiek procentų sudaro
    () =>
      uzdavinys(T1, {
        klausimas: `Kiek procentų nuo ${pradine} sudaro ${pokytis}?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `$${pokytis} : ${pradine} \\cdot 100 = ${proc}$.`,
      }),

    // 6. Padidėjo daugiau nei 100 %
    () =>
      uzdavinys(T1, {
        klausimas: `Dydis padidėjo nuo ${pradine} iki ${2 * pradine}. Keliais procentais jis padidėjo?`,
        atsakymas: '100',
        atsakymasRodymui: `$100\\%$`,
        sprendimas: 'Padvigubėjimas reiškia padidėjimą 100 procentų.',
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: `Skaičiuodamas, keliais procentais dydis pakito nuo ${pradine} iki ${pradine + pokytis}, mokinys pokytį dalijo iš galutinės reikšmės. Iš kurios reikšmės reikėjo dalyti?`,
        atsakymas: String(pradine),
        atsakymasRodymui: `$${pradine}$`,
        sprendimas: 'Procentinis pokytis visada skaičiuojamas nuo pradinės reikšmės.',
      }),
  ])
}

// ── 3.2. Ieškome dydžio, kai žinoma pradinė vertė ir pokytis procentais ─────

const T2 = 'dydis-po-pokycio'

const A_PO_POKYCIO = [
  {
    klausimas: 'Kaina 200 Eur pakilo 15 %. Kokia nauja kaina?',
    atsakymas: '230',
    atsakymasRodymui: '$230$ Eur',
    sprendimas: '$200 \\cdot 1{,}15 = 230$.',
  },
] as const

export const dydisPoPokycio: Generatorius = () => suBandymais(kurkPoPokycio, A_PO_POKYCIO, T2)

function kurkPoPokycio(): Uzdavinys | null {
  const proc = pasirink([5, 10, 15, 20, 25, 40, 50])
  const pradine = atsitiktinis(2, 20) * 100
  const pokytis = (pradine * proc) / 100
  if (pokytis % 1 !== 0) return null

  return variacija([
    // 1. Padidinta
    () =>
      uzdavinys(T2, {
        klausimas: `Dydis ${pradine} padidintas $${proc}\\%$. Koks dydis gautas?`,
        atsakymas: String(pradine + pokytis),
        atsakymasRodymui: `$${pradine + pokytis}$`,
        sprendimas: `$${proc}\\%$ nuo ${pradine} yra ${pokytis}; $${pradine} + ${pokytis} = ${pradine + pokytis}$.`,
      }),

    // 2. Sumažinta
    () =>
      uzdavinys(T2, {
        klausimas: `Dydis ${pradine} sumažintas $${proc}\\%$. Koks dydis gautas?`,
        atsakymas: String(pradine - pokytis),
        atsakymasRodymui: `$${pradine - pokytis}$`,
        sprendimas: `$${pradine} - ${pokytis} = ${pradine - pokytis}$.`,
      }),

    // 3. Per daugiklį
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Iš kokio skaičiaus reikia padauginti dydį, kad jis padidėtų $${proc}\\%$?`,
        variantai: [
          `$1{,}${String(proc).padStart(2, '0')}$`,
          `$0{,}${String(proc).padStart(2, '0')}$`,
          `$${proc}$`,
          `$${proc / 100 + 1}00$`,
        ],
        teisingas: 0,
        sprendimas: `Prie viso dydžio pridedama $${proc}\\%$, tad daugiklis yra $1 + ${proc}:100$.`,
      }),

    // 4. Kainos pakilimas
    () => {
      const kaina = atsitiktinis(10, 60) * 100
      const augimas = (kaina * proc) / 100
      if (augimas % 1 !== 0) return null
      return uzdavinys(T2, {
        klausimas: `Prekė kainavo $${eur(kaina)}$ Eur ir pabrango $${proc}\\%$. Kiek ji kainuoja dabar?`,
        atsakymas: eurAts(kaina + augimas),
        atsakymasRodymui: `$${eur(kaina + augimas)}$ Eur`,
        sprendimas: `$${eur(kaina)} + ${eur(augimas)} = ${eur(kaina + augimas)}$.`,
      })
    },

    // 5. Pradinė vertė
    () =>
      uzdavinys(T2, {
        klausimas: `Padidinus dydį $${proc}\\%$ gauta ${pradine + pokytis}. Koks buvo pradinis dydis?`,
        atsakymas: String(pradine),
        atsakymasRodymui: `$${pradine}$`,
        sprendimas: `Naujasis dydis sudaro $${100 + proc}\\%$ pradinio: $${pradine + pokytis} : ${100 + proc} \\cdot 100 = ${pradine}$.`,
      }),

    // 6. Du pokyčiai iš eilės
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Dydis padidėjo $${proc}\\%$, paskui sumažėjo $${proc}\\%$. Ar jis grįžo į pradinę reikšmę?`,
        variantai: [
          'ne, jis tapo mažesnis už pradinį',
          'taip',
          'ne, jis tapo didesnis už pradinį',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Antrą kartą procentai skaičiuojami nuo jau padidėjusio dydžio, tad atimama daugiau.',
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Mokinys, didindamas ${pradine} $${proc}\\%$, padaugino iš ${proc}. Užrašyk teisingą rezultatą.`,
        atsakymas: String(pradine + pokytis),
        atsakymasRodymui: `$${pradine + pokytis}$`,
        sprendimas: `Dauginti reikia iš $1 + ${proc}:100$, o ne iš pačių procentų.`,
      }),
  ])
}

// ── 3.3. Paprastosios palūkanos ─────────────────────────────────────────────

const T3 = 'paprastosios-palukanos'

const A_PAPRASTOS = [
  {
    klausimas: 'Į banką padėta 1000 Eur, metinės palūkanos 5 %. Kiek palūkanų gaunama per metus?',
    atsakymas: '50',
    atsakymasRodymui: '$50$ Eur',
    sprendimas: '$1000 \\cdot 0{,}05 = 50$.',
  },
] as const

export const paprastosiosPalukanos: Generatorius = () => suBandymais(kurkPaprastas, A_PAPRASTOS, T3)

function kurkPaprastas(): Uzdavinys | null {
  const proc = pasirink([2, 3, 4, 5, 10])
  const suma = atsitiktinis(5, 40) * 100
  const metai = atsitiktinis(2, 5)
  const perMetus = (suma * proc) / 100
  if (perMetus % 1 !== 0) return null

  return variacija([
    // 1. Palūkanos per metus
    () =>
      uzdavinys(T3, {
        klausimas: `Į banką padėta ${suma} Eur, metinės palūkanos $${proc}\\%$. Kiek palūkanų gaunama per vienerius metus?`,
        atsakymas: String(perMetus),
        atsakymasRodymui: `$${perMetus}$ Eur`,
        sprendimas: `$${suma} : 100 \\cdot ${proc} = ${perMetus}$.`,
      }),

    // 2. Palūkanos per kelerius metus
    () =>
      uzdavinys(T3, {
        klausimas: `Į banką padėta ${suma} Eur, metinės palūkanos $${proc}\\%$. Kiek palūkanų susikaups per ${metai} metus, jei jos paprastosios?`,
        atsakymas: String(perMetus * metai),
        atsakymasRodymui: `$${perMetus * metai}$ Eur`,
        sprendimas: `Paprastosios palūkanos kasmet vienodos: $${perMetus} \\cdot ${metai} = ${perMetus * metai}$.`,
      }),

    // 3. Bendra suma
    () =>
      uzdavinys(T3, {
        klausimas: `Į banką padėta ${suma} Eur $${proc}\\%$ metinių paprastųjų palūkanų. Kokia suma bus sąskaitoje po ${metai} metų?`,
        atsakymas: String(suma + perMetus * metai),
        atsakymasRodymui: `$${suma + perMetus * metai}$ Eur`,
        sprendimas: `$${suma} + ${perMetus} \\cdot ${metai} = ${suma + perMetus * metai}$.`,
      }),

    // 4. Kas yra paprastosios palūkanos
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuo pasižymi paprastosios palūkanos?',
        variantai: [
          'jos kasmet skaičiuojamos nuo tos pačios pradinės sumos',
          'jos kasmet skaičiuojamos nuo išaugusios sumos',
          'jos kasmet mažėja',
          'jos priklauso nuo banko',
        ],
        teisingas: 0,
        sprendimas: 'Todėl kiekvienais metais gaunama vienoda palūkanų suma.',
      }),

    // 5. Palūkanų norma
    () =>
      uzdavinys(T3, {
        klausimas: `Nuo ${suma} Eur per metus gauta ${perMetus} Eur palūkanų. Kokia metinė palūkanų norma procentais?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `$${perMetus} : ${suma} \\cdot 100 = ${proc}$.`,
      }),

    // 6. Pradinė suma
    () =>
      uzdavinys(T3, {
        klausimas: `Esant $${proc}\\%$ metinėms palūkanoms per metus gauta ${perMetus} Eur. Kokia suma buvo padėta?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$ Eur`,
        sprendimas: `$${perMetus} : ${proc} \\cdot 100 = ${suma}$.`,
      }),

    // 7. Paskola
    () =>
      uzdavinys(T3, {
        klausimas: `Paimta ${suma} Eur paskola su $${proc}\\%$ metinėmis paprastosiomis palūkanomis ${metai} metams. Kiek iš viso reikės grąžinti?`,
        atsakymas: String(suma + perMetus * metai),
        atsakymasRodymui: `$${suma + perMetus * metai}$ Eur`,
        sprendimas: `Grąžinama pati paskola ir palūkanos: $${suma} + ${perMetus * metai} = ${suma + perMetus * metai}$.`,
      }),
  ])
}

// ── 3.4. Sudėtinės palūkanos ────────────────────────────────────────────────

const T4 = 'sudetines-palukanos'

const A_SUDETINES = [
  {
    klausimas: 'Į banką padėta 1000 Eur, 10 % metinių sudėtinių palūkanų. Kokia suma bus po dvejų metų?',
    atsakymas: '1210',
    atsakymasRodymui: '$1210$ Eur',
    sprendimas: '$1000 \\cdot 1{,}1 \\cdot 1{,}1 = 1210$.',
  },
] as const

export const sudetinesPalukanos: Generatorius = () => suBandymais(kurkSudetines, A_SUDETINES, T4)

function kurkSudetines(): Uzdavinys | null {
  const proc = pasirink([10, 20, 50])
  const suma = atsitiktinis(5, 20) * 100
  const poVieneriu = suma + (suma * proc) / 100
  const poDvieju = poVieneriu + (poVieneriu * proc) / 100
  if (poDvieju % 1 !== 0) return null

  return variacija([
    // 1. Po dvejų metų
    () =>
      uzdavinys(T4, {
        klausimas: `Į banką padėta ${suma} Eur, metinės sudėtinės palūkanos $${proc}\\%$. Kokia suma bus po dvejų metų?`,
        atsakymas: String(poDvieju),
        atsakymasRodymui: `$${poDvieju}$ Eur`,
        sprendimas: `Po pirmųjų metų $${poVieneriu}$; antraisiais metais palūkanos skaičiuojamos jau nuo $${poVieneriu}$: gaunama $${poDvieju}$.`,
      }),

    // 2. Kuo skiriasi nuo paprastųjų
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuo sudėtinės palūkanos skiriasi nuo paprastųjų?',
        variantai: [
          'jos kasmet skaičiuojamos nuo jau išaugusios sumos',
          'jos visada mažesnės',
          'jos skaičiuojamos tik paskoloms',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Todėl per kelerius metus sudėtinės palūkanos duoda daugiau nei paprastosios.',
      }),

    // 3. Po pirmųjų metų
    () =>
      uzdavinys(T4, {
        klausimas: `Į banką padėta ${suma} Eur, palūkanos $${proc}\\%$. Kokia suma bus po vienerių metų?`,
        atsakymas: String(poVieneriu),
        atsakymasRodymui: `$${poVieneriu}$ Eur`,
        sprendimas: `$${suma} + ${(suma * proc) / 100} = ${poVieneriu}$.`,
      }),

    // 4. Antrųjų metų palūkanos
    () =>
      uzdavinys(T4, {
        klausimas: `Į banką padėta ${suma} Eur su $${proc}\\%$ sudėtinėmis palūkanomis. Kiek palūkanų priskaičiuojama antraisiais metais?`,
        atsakymas: String(poDvieju - poVieneriu),
        atsakymasRodymui: `$${poDvieju - poVieneriu}$ Eur`,
        sprendimas: `Antraisiais metais skaičiuojama nuo $${poVieneriu}$: $${poVieneriu} : 100 \\cdot ${proc} = ${poDvieju - poVieneriu}$.`,
      }),

    // 5. Skirtumas nuo paprastųjų
    () => {
      const paprastos = suma + 2 * ((suma * proc) / 100)
      return uzdavinys(T4, {
        klausimas: `Po dvejų metų sudėtinės palūkanos duoda ${poDvieju} Eur, o paprastosios — ${paprastos} Eur. Kiek eurų skiriasi rezultatai?`,
        atsakymas: String(poDvieju - paprastos),
        atsakymasRodymui: `$${poDvieju - paprastos}$ Eur`,
        sprendimas: `$${poDvieju} - ${paprastos} = ${poDvieju - paprastos}$ — tai palūkanos nuo pirmųjų metų palūkanų.`,
      })
    },

    // 6. Daugiklis
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Iš ko dauginama suma kiekvienais metais, kai palūkanos $${proc}\\%$ sudėtinės?`,
        variantai: [
          `$1{,}${String(proc).padStart(2, '0')}$`,
          `$0{,}${String(proc).padStart(2, '0')}$`,
          `$${proc}$`,
          `$2$`,
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienais metais suma padidėja tuo pačiu daugikliu.',
      }),

    // 7. Klaidos radimas
    () => {
      const paprastos = suma + 2 * ((suma * proc) / 100)
      return uzdavinys(T4, {
        klausimas: `Skaičiuodamas sudėtines palūkanas dvejiems metams mokinys gavo ${paprastos} Eur — antraisiais metais skaičiavo nuo pradinės sumos. Kokia suma teisinga?`,
        atsakymas: String(poDvieju),
        atsakymasRodymui: `$${poDvieju}$ Eur`,
        sprendimas: 'Sudėtinėms palūkanoms antraisiais metais bazė yra jau išaugusi suma.',
      })
    },
  ])
}

// ── 3.5. Sudėtiniai procentai ───────────────────────────────────────────────

const T5 = 'sudetiniai-procentai'

const A_SUDETINIAI = [
  {
    klausimas: 'Prekė pabrango 20 %, paskui atpigo 20 %. Ar kaina grįžo į pradinę?',
    atsakymas: 'ne',
    atsakymasRodymui: 'Ne',
    sprendimas: 'Antrą kartą procentai skaičiuojami nuo didesnės kainos.',
  },
] as const

export const sudetiniaiProcentai: Generatorius = () => suBandymais(kurkSudetinius, A_SUDETINIAI, T5)

function kurkSudetinius(): Uzdavinys | null {
  const p1 = pasirink([10, 20, 25, 50])
  const p2 = pasirink([10, 20, 25, 50])
  const suma = atsitiktinis(4, 20) * 100
  const po1 = suma + (suma * p1) / 100
  const po2 = po1 - (po1 * p2) / 100
  if (po1 % 1 !== 0 || po2 % 1 !== 0) return null

  return variacija([
    // 1. Du pokyčiai
    () =>
      uzdavinys(T5, {
        klausimas: `Kaina ${suma} Eur pabrango $${p1}\\%$, paskui atpigo $${p2}\\%$. Kokia galutinė kaina?`,
        atsakymas: String(po2),
        atsakymasRodymui: `$${po2}$ Eur`,
        sprendimas: `Po pabrangimo $${po1}$ Eur; atpigus $${p2}\\%$ nuo $${po1}$ lieka $${po2}$.`,
      }),

    // 2. Ar grįžta į pradinę
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Prekė pabrango $${p1}\\%$, paskui atpigo $${p1}\\%$. Ar kaina grįžo į pradinę?`,
        variantai: [
          'ne, ji tapo mažesnė už pradinę',
          'taip',
          'ne, ji tapo didesnė už pradinę',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Atpiginimo procentai skaičiuojami nuo jau didesnės kainos, tad atimama daugiau nei buvo pridėta.',
      }),

    // 3. Du padidėjimai
    () => {
      const abu = po1 + (po1 * p2) / 100
      if (abu % 1 !== 0) return null
      return uzdavinys(T5, {
        klausimas: `Dydis ${suma} padidėjo $${p1}\\%$, paskui dar $${p2}\\%$. Koks dydis gautas?`,
        atsakymas: String(abu),
        atsakymasRodymui: `$${abu}$`,
        sprendimas: `Po pirmojo padidėjimo $${po1}$; po antrojo — $${abu}$.`,
      })
    },

    // 4. Kodėl negalima sudėti procentų
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kodėl negalima tiesiog sudėti $${p1}\\%$ ir $${p2}\\%$?`,
        variantai: [
          'nes antrieji procentai skaičiuojami nuo jau pakitusio dydžio',
          'nes procentų sudėti apskritai negalima',
          'nes procentai skirtingi',
          'iš tikrųjų galima',
        ],
        teisingas: 0,
        sprendimas: 'Pokyčių bazė kaskart kita.',
      }),

    // 5. Bendras daugiklis
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Iš kokių daugiklių sandaugos gaunamas galutinis dydis, kai pirma padidėja $${p1}\\%$, paskui sumažėja $${p2}\\%$?`,
        variantai: [
          `iš $1 + ${p1}:100$ ir $1 - ${p2}:100$`,
          `iš $${p1}:100$ ir $${p2}:100$`,
          `iš $1 + ${p1}:100$ ir $1 + ${p2}:100$`,
          `iš $${p1}$ ir $${p2}$`,
        ],
        teisingas: 0,
        sprendimas: 'Padidėjimą atitinka daugiklis, didesnis už 1, sumažėjimą — mažesnis.',
      }),

    // 6. Bendras pokytis
    () =>
      uzdavinys(T5, {
        klausimas: `Kaina ${suma} Eur pabrango $${p1}\\%$, paskui atpigo $${p2}\\%$. Keliais eurais pasikeitė pradinė kaina?`,
        atsakymas: String(Math.abs(po2 - suma)),
        atsakymasRodymui: `$${Math.abs(po2 - suma)}$ Eur`,
        sprendimas: `$${po2} - ${suma} = ${po2 - suma}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Mokinys teigia, kad pabrangus $${p1}\\%$ ir atpigus $${p2}\\%$ kaina pakito $${p1 - p2}\\%$. Kokia iš tikrųjų galutinė ${suma} Eur kainos vertė?`,
        atsakymas: String(po2),
        atsakymasRodymui: `$${po2}$ Eur`,
        sprendimas: 'Procentų sudėti ar atimti negalima — pokyčiai skaičiuojami nuo skirtingų bazių.',
      }),
  ])
}

// ── Biudžetas ir paskolos (programos potemė) ────────────────────────────────

const T6 = 'biudzetas-ir-paskolos'

const A_BIUDZETAS = [
  {
    klausimas: 'Pajamos 900 Eur, išlaidos 720 Eur. Kiek galima sutaupyti?',
    atsakymas: '180',
    atsakymasRodymui: '$180$ Eur',
    sprendimas: '$900 - 720 = 180$.',
  },
] as const

export const biudzetasIrPaskolos: Generatorius = () => suBandymais(kurkBiudzeta, A_BIUDZETAS, T6)

function kurkBiudzeta(): Uzdavinys | null {
  const pajamos = atsitiktinis(6, 20) * 100
  const proc = pasirink([10, 20, 25, 40])
  const islaidos = pajamos - (pajamos * proc) / 100
  if (islaidos % 1 !== 0) return null

  return variacija([
    // 1. Santaupos
    () =>
      uzdavinys(T6, {
        klausimas: `Mėnesio pajamos ${pajamos} Eur, išlaidos ${islaidos} Eur. Kiek eurų galima sutaupyti?`,
        atsakymas: String(pajamos - islaidos),
        atsakymasRodymui: `$${pajamos - islaidos}$ Eur`,
        sprendimas: `$${pajamos} - ${islaidos} = ${pajamos - islaidos}$.`,
      }),

    // 2. Kiek procentų sutaupoma
    () =>
      uzdavinys(T6, {
        klausimas: `Iš ${pajamos} Eur pajamų sutaupoma ${pajamos - islaidos} Eur. Kiek procentų pajamų tai sudaro?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `$${pajamos - islaidos} : ${pajamos} \\cdot 100 = ${proc}$.`,
      }),

    // 3. Per kiek mėnesių sutaupoma
    () => {
      const tikslas = (pajamos - islaidos) * atsitiktinis(3, 10)
      return uzdavinys(T6, {
        klausimas: `Kas mėnesį sutaupoma ${pajamos - islaidos} Eur. Per kiek mėnesių bus sukaupta ${tikslas} Eur?`,
        atsakymas: String(tikslas / (pajamos - islaidos)),
        atsakymasRodymui: `$${tikslas / (pajamos - islaidos)}$`,
        sprendimas: `$${tikslas} : ${pajamos - islaidos} = ${tikslas / (pajamos - islaidos)}$.`,
      })
    },

    // 4. Kuri paskola pigesnė
    () => {
      const suma = atsitiktinis(10, 30) * 100
      const p1 = atsitiktinis(5, 9)
      const p2 = p1 + atsitiktinis(1, 4)
      return uzdavinys(T6, {
        klausimas: `Dvi ${suma} Eur paskolos vieneriems metams: pirmosios metinės palūkanos $${p1}\\%$, antrosios — $${p2}\\%$. Kiek eurų daugiau kainuos antroji?`,
        atsakymas: String((suma * (p2 - p1)) / 100),
        atsakymasRodymui: `$${(suma * (p2 - p1)) / 100}$ Eur`,
        sprendimas: `Skirtumas $${p2 - p1}\\%$ nuo ${suma}: $${(suma * (p2 - p1)) / 100}$.`,
      })
    },

    // 5. Į ką žiūrėti renkantis paskolą
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Į ką svarbiausia atsižvelgti lyginant paskolų pasiūlymus?',
        variantai: [
          'į bendrą grąžintiną sumą, o ne tik į mėnesio įmoką',
          'tik į mėnesio įmokos dydį',
          'tik į paskolos trukmę',
          'į banko pavadinimą',
        ],
        teisingas: 0,
        sprendimas: 'Mažesnė įmoka dažnai reiškia ilgesnį terminą ir didesnes bendras palūkanas.',
      }),

    // 6. Būtinos ir nebūtinos išlaidos
    () =>
      poruUzdavinys(naujasId(T6), T6, {
        klausimas: 'Sujunk išlaidas su jų rūšimi.',
        poros: [
          { kaire: 'nuoma', desine: 'būtinos' },
          { kaire: 'maistas', desine: 'būtinos' },
          { kaire: 'kino bilietas', desine: 'nebūtinos' },
          { kaire: 'žaidimas telefone', desine: 'nebūtinos' },
        ],
        sprendimas: 'Planuojant biudžetą pirmiausia padengiamos būtinos išlaidos.',
      }),

    // 7. Tekstinis
    () => {
      const vardas = pasirink(VARDAI)
      const tikslas = (pajamos - islaidos) * atsitiktinis(4, 8)
      return uzdavinys(T6, {
        klausimas: `${vardas} kas mėnesį sutaupo ${pajamos - islaidos} Eur ir nori sukaupti ${tikslas} Eur. Kiek mėnesių tam prireiks?`,
        atsakymas: String(tikslas / (pajamos - islaidos)),
        atsakymasRodymui: `$${tikslas / (pajamos - islaidos)}$`,
        sprendimas: `$${tikslas} : ${pajamos - islaidos} = ${tikslas / (pajamos - islaidos)}$.`,
      })
    },
  ])
}

// ── 4.1. Skaičių palyginimas ────────────────────────────────────────────────

const T7 = 'skaiciu-palyginimas-7'

const A_PALYGINIMAS = [
  {
    klausimas: 'Kurį ženklą reikia rašyti: $-5 \\square -2$?',
    atsakymas: '<',
    atsakymasRodymui: '$<$',
    sprendimas: 'Skaičių tiesėje $-5$ yra kairiau už $-2$.',
  },
] as const

export const skaiciuPalyginimas7: Generatorius = () => suBandymais(kurkPalyginima, A_PALYGINIMAS, T7)

function kurkPalyginima(): Uzdavinys | null {
  const a = atsitiktinis(-15, 15)
  const b = atsitiktinis(-15, 15)
  if (a === b) return null

  return variacija([
    // 1. Koks ženklas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Kurį ženklą reikia rašyti: $${a} \\square ${b}$?`,
        variantai: a < b ? ['$<$', '$>$', '$=$'] : ['$>$', '$<$', '$=$'],
        teisingas: 0,
        sprendimas: `Skaičių tiesėje ${a < b ? a : b} yra kairiau.`,
      }),

    // 2. Ką reiškia a < b
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ką reiškia užrašas $a < b$?',
        variantai: [
          'skaičių tiesėje $a$ yra kairiau už $b$',
          '$a$ yra didesnis už $b$',
          '$a$ ir $b$ lygūs',
          '$a$ yra teigiamas',
        ],
        teisingas: 0,
        sprendimas: 'Mažesnis skaičius visada yra kairiau.',
      }),

    // 3. Skirtumo ženklas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Koks bus skirtumo $${a} - ${b < 0 ? `(${b})` : b}$ ženklas?`,
        variantai: a - b > 0 ? ['teigiamas', 'neigiamas', 'nulis'] : ['neigiamas', 'teigiamas', 'nulis'],
        teisingas: 0,
        sprendimas: `Jei $a > b$, tai $a - b > 0$; čia $${a} - ${b < 0 ? `(${b})` : b} = ${a - b}$.`,
      }),

    // 4. Nelygybės ženklai
    () =>
      poruUzdavinys(naujasId(T7), T7, {
        klausimas: 'Sujunk ženklą su jo reikšme.',
        poros: [
          { kaire: '$<$', desine: 'mažiau' },
          { kaire: '$>$', desine: 'daugiau' },
          { kaire: '$\\le$', desine: 'ne daugiau' },
          { kaire: '$\\ge$', desine: 'ne mažiau' },
        ],
        sprendimas: 'Brūkšnys po ženklu reiškia, kad lygybė taip pat tinka.',
      }),

    // 5. Griežta ir negriežta
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kuo skiriasi $x > 3$ nuo $x \\ge 3$?',
        variantai: [
          'antruoju atveju tinka ir pati reikšmė 3',
          'skirtumo nėra',
          'pirmuoju atveju tinka ir 3',
          'antruoju atveju sprendinių mažiau',
        ],
        teisingas: 0,
        sprendimas: 'Negriežtoje nelygybėje riba įtraukiama.',
      }),

    // 6. Modulių palyginimas
    () => {
      const x = -atsitiktinis(2, 12)
      const y = -atsitiktinis(2, 12)
      if (x === y) return null
      return uzdavinys(T7, {
        klausimas: `Kuris skaičius didesnis: $${x}$ ar $${y}$?`,
        atsakymas: String(Math.max(x, y)),
        atsakymasRodymui: `$${Math.max(x, y)}$`,
        sprendimas: 'Iš dviejų neigiamų didesnis tas, kuris arčiau nulio.',
      })
    },

    // 7. Trys skaičiai
    () => {
      const c = atsitiktinis(-15, 15)
      if (c === a || c === b) return null
      const maz = Math.min(a, b, c)
      return uzdavinys(T7, {
        klausimas: `Kuris iš skaičių $${a}$, $${b}$, $${c}$ mažiausias?`,
        atsakymas: String(maz),
        atsakymasRodymui: `$${maz}$`,
        sprendimas: 'Mažiausias yra tas, kuris skaičių tiesėje labiausiai kairėje.',
      })
    },
  ])
}

// ── 4.2. Skaičių intervalai ─────────────────────────────────────────────────

const T8 = 'skaiciu-intervalai'

const A_INTERVALAI = [
  {
    klausimas: 'Kaip skaičių tiesėje žymimas taškas, kuris į intervalą neįeina?',
    atsakymas: 'tusciu tasku',
    atsakymasRodymui: 'Tuščiu (neužpildytu) tašku',
    sprendimas: 'Pilnas taškas reiškia, kad riba įtraukiama.',
  },
] as const

export const skaiciuIntervalai: Generatorius = () => suBandymais(kurkIntervalus, A_INTERVALAI, T8)

function kurkIntervalus(): Uzdavinys | null {
  const riba = atsitiktinis(-6, 6)
  const kita = riba + atsitiktinis(2, 6)
  if (kita > 8) return null

  return variacija([
    // 1. Kokia nelygybė pavaizduota
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kokia nelygybė pavaizduota skaičių tiesėje?',
        variantai: [`$x > ${riba}$`, `$x \\ge ${riba}$`, `$x < ${riba}$`, `$x \\le ${riba}$`],
        teisingas: 0,
        sprendimas: 'Taškas tuščias, tad pati riba neįtraukiama, o spalvota dalis eina į dešinę.',
        brezinys: intervalas({ reiksme: riba, itraukiamas: false }, null),
      }),

    // 2. Tuščias ir pilnas taškas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Ką skaičių tiesėje reiškia pilnas (užpildytas) taškas?',
        variantai: [
          'riba įeina į intervalą',
          'riba neįeina į intervalą',
          'intervalas baigiasi',
          'skaičius neigiamas',
        ],
        teisingas: 0,
        sprendimas: 'Pilnas taškas atitinka ženklus $\\le$ ir $\\ge$.',
        brezinys: intervalas({ reiksme: riba, itraukiamas: true }, null),
      }),

    // 3. Dvipusis intervalas
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek sveikųjų skaičių priklauso pavaizduotam intervalui?',
        atsakymas: String(kita - riba),
        atsakymasRodymui: `$${kita - riba}$`,
        sprendimas: `Nuo $${riba}$ (įskaitant) iki $${kita}$ (neįskaitant) — iš viso ${kita - riba}.`,
        brezinys: intervalas({ reiksme: riba, itraukiamas: true }, { reiksme: kita, itraukiamas: false }),
      }),

    // 4. Mažiausias sveikasis
    () =>
      uzdavinys(T8, {
        klausimas: `Koks mažiausias sveikasis skaičius tenkina nelygybę $x > ${riba}$?`,
        atsakymas: String(riba + 1),
        atsakymasRodymui: `$${riba + 1}$`,
        sprendimas: `Pati riba netinka, tad mažiausias tinkamas yra $${riba + 1}$.`,
      }),

    // 5. Didžiausias sveikasis
    () =>
      uzdavinys(T8, {
        klausimas: `Koks didžiausias sveikasis skaičius tenkina nelygybę $x \\le ${kita}$?`,
        atsakymas: String(kita),
        atsakymasRodymui: `$${kita}$`,
        sprendimas: 'Ženklas negriežtas, tad pati riba tinka.',
      }),

    // 6. Ar priklauso
    () => {
      const tikrinamas = atsitiktinis(riba - 2, kita + 2)
      const priklauso = tikrinamas >= riba && tikrinamas < kita
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Ar skaičius $${tikrinamas}$ priklauso intervalui $${riba} \\le x < ${kita}$?`,
        variantai: priklauso ? ['taip', 'ne', 'to nustatyti neįmanoma'] : ['ne', 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `Tikrinama, ar $${riba} \\le ${tikrinamas}$ ir $${tikrinamas} < ${kita}$.`,
      })
    },

    // 7. Dvigubas užrašas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Kaip vienu užrašu užrašomos nelygybės $x \\ge ${riba}$ ir $x < ${kita}$?`,
        variantai: [`$${riba} \\le x < ${kita}$`, `$${riba} < x \\le ${kita}$`, `$${riba} < x < ${kita}$`, `$${riba} \\le x \\le ${kita}$`],
        teisingas: 0,
        sprendimas: 'Kiekvieno galo ženklas perkeliamas iš atitinkamos nelygybės.',
        brezinys: intervalas({ reiksme: riba, itraukiamas: true }, { reiksme: kita, itraukiamas: false }),
      }),
  ])
}

// ── 4.3. Pridedame (atimame) tą patį skaičių ────────────────────────────────

const T9 = 'nelygybe-pridedame'

const A_PRIDEDAME = [
  {
    klausimas: 'Jei $a > b$, koks ženklas bus tarp $a + 5$ ir $b + 5$?',
    atsakymas: '>',
    atsakymasRodymui: '$>$',
    sprendimas: 'Pridėjus tą patį skaičių nelygybės ženklas nesikeičia.',
  },
] as const

export const nelygybePridedame: Generatorius = () => suBandymais(kurkPridejima, A_PRIDEDAME, T9)

function kurkPridejima(): Uzdavinys | null {
  const a = atsitiktinis(-10, 10)
  const b = atsitiktinis(-10, 10)
  if (a === b) return null
  const c = atsitiktinis(2, 15)
  const zenklas = a > b ? '>' : '<'

  return variacija([
    // 1. Pridedame
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Jei $${a} ${zenklas} ${b}$, koks ženklas bus tarp $${a} + ${c}$ ir $${b} + ${c}$?`,
        variantai: [`$${zenklas}$`, `$${apversk(zenklas)}$`, '$=$'],
        teisingas: 0,
        sprendimas: 'Pridėjus prie abiejų pusių tą patį skaičių nelygybės ženklas nesikeičia.',
      }),

    // 2. Atimame
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Jei $${a} ${zenklas} ${b}$, koks ženklas bus tarp $${a} - ${c}$ ir $${b} - ${c}$?`,
        variantai: [`$${zenklas}$`, `$${apversk(zenklas)}$`, '$=$'],
        teisingas: 0,
        sprendimas: 'Atėmus iš abiejų pusių tą patį skaičių ženklas taip pat nesikeičia.',
      }),

    // 3. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kas nutinka nelygybės ženklui, prie abiejų pusių pridėjus tą patį skaičių?',
        variantai: ['jis nesikeičia', 'jis apsiverčia', 'nelygybė tampa lygybe', 'sprendinių nebelieka'],
        teisingas: 0,
        sprendimas: 'Abi pusės pasislenka vienodai, tad jų tvarka išlieka.',
      }),

    // 4. Nario perkėlimas
    () => {
      const x = atsitiktinis(2, 12)
      return uzdavinys(T9, {
        klausimas: `Iš nelygybės $x + ${c} > ${x + c}$ perkelk ${c} į dešinę pusę. Kas lieka dešinėje?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `$${x + c} - ${c} = ${x}$; perkeliant ženklas keičiasi priešingu.`,
      })
    },

    // 5. Konkreti nelygybė
    () => {
      const x = atsitiktinis(2, 15)
      return uzdavinys(T9, {
        klausimas: `Išspręsk: $x + ${c} > ${x + c}$. Koks mažiausias sveikasis sprendinys?`,
        atsakymas: String(x + 1),
        atsakymasRodymui: `$${x + 1}$`,
        sprendimas: `$x > ${x}$, tad mažiausias sveikasis sprendinys yra $${x + 1}$.`,
      })
    },

    // 6. Su neigiamu dėmeniu
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Jei $${a} ${zenklas} ${b}$, koks ženklas bus tarp $${a} + (-${c})$ ir $${b} + (-${c})$?`,
        variantai: [`$${zenklas}$`, `$${apversk(zenklas)}$`, '$=$'],
        teisingas: 0,
        sprendimas: 'Svarbu ne dėmens ženklas, o tai, kad jis pridedamas prie abiejų pusių.',
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Mokinys teigia, kad pridėjus prie abiejų $${a} ${zenklas} ${b}$ pusių neigiamą skaičių ženklas apsiverčia. Ar jis teisus?`,
        variantai: [
          'ne, ženklas apsiverčia tik dauginant ar dalijant iš neigiamo skaičiaus',
          'taip',
          'taip, jei skaičius didelis',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Sudėtis abiejų pusių tvarkos nekeičia.',
      }),
  ])
}

// ── 4.4. Dauginame (dalijame) iš to paties skaičiaus ────────────────────────

const T10 = 'nelygybe-dauginame'

const A_DAUGINAME = [
  {
    klausimas: 'Jei $a > b$, koks ženklas bus tarp $-2a$ ir $-2b$?',
    atsakymas: '<',
    atsakymasRodymui: '$<$',
    sprendimas: 'Dauginant iš neigiamo skaičiaus ženklas apsiverčia.',
  },
] as const

export const nelygybeDauginame: Generatorius = () => suBandymais(kurkDaugyba, A_DAUGINAME, T10)

function kurkDaugyba(): Uzdavinys | null {
  const a = atsitiktinis(-10, 10)
  const b = atsitiktinis(-10, 10)
  if (a === b) return null
  const k = atsitiktinis(2, 8)
  const zenklas = a > b ? '>' : '<'

  return variacija([
    // 1. Teigiamas daugiklis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Jei $${a} ${zenklas} ${b}$, koks ženklas bus tarp $${k} \\cdot ${a < 0 ? `(${a})` : a}$ ir $${k} \\cdot ${b < 0 ? `(${b})` : b}$?`,
        variantai: [`$${zenklas}$`, `$${apversk(zenklas)}$`, '$=$'],
        teisingas: 0,
        sprendimas: 'Dauginant iš teigiamo skaičiaus nelygybės ženklas nesikeičia.',
      }),

    // 2. Neigiamas daugiklis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Jei $${a} ${zenklas} ${b}$, koks ženklas bus tarp $-${k} \\cdot ${a < 0 ? `(${a})` : a}$ ir $-${k} \\cdot ${b < 0 ? `(${b})` : b}$?`,
        variantai: [`$${apversk(zenklas)}$`, `$${zenklas}$`, '$=$'],
        teisingas: 0,
        sprendimas: 'Dauginant iš neigiamo skaičiaus nelygybės ženklas apsiverčia.',
      }),

    // 3. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kada nelygybės ženklas apsiverčia?',
        variantai: [
          'dauginant arba dalijant abi puses iš neigiamo skaičiaus',
          'pridedant neigiamą skaičių',
          'atimant iš abiejų pusių',
          'niekada',
        ],
        teisingas: 0,
        sprendimas: 'Sudėtis ir atimtis ženklo nekeičia.',
      }),

    // 4. Dalyba iš neigiamo
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Jei $${a} ${zenklas} ${b}$, koks ženklas bus tarp $${a < 0 ? `(${a})` : a} : (-${k})$ ir $${b < 0 ? `(${b})` : b} : (-${k})$?`,
        variantai: [`$${apversk(zenklas)}$`, `$${zenklas}$`, '$=$'],
        teisingas: 0,
        sprendimas: 'Dalyba iš neigiamo skaičiaus, kaip ir daugyba, ženklą apverčia.',
      }),

    // 5. Kodėl apsiverčia
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kodėl dauginant iš neigiamo skaičiaus nelygybės ženklas apsiverčia?',
        variantai: [
          'nes skaičiai atsiduria kitoje nulio pusėje ir jų tvarka apsiverčia',
          'nes rezultatas tampa mažesnis',
          'nes taip sutarta',
          'nes neigiami skaičiai neturi tvarkos',
        ],
        teisingas: 0,
        sprendimas: '$2 < 5$, bet $-2 > -5$.',
      }),

    // 6. Konkretus pavyzdys
    () =>
      uzdavinys(T10, {
        klausimas: `Padauginus abi nelygybės $2 < 5$ puses iš $-3$ gaunama nelygybė tarp $-6$ ir $-15$. Kuris skaičius didesnis?`,
        atsakymas: '-6',
        atsakymasRodymui: '$-6$',
        sprendimas: '$-6 > -15$ — ženklas apsivertė.',
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Spręsdamas $-${k}x > ${k}$ mokinys padalijo abi puses iš $-${k}$ ir paliko tą patį ženklą. Kokia nelygybė teisinga?`,
        variantai: [`$x < -1$`, `$x > -1$`, `$x < 1$`, `$x > 1$`],
        teisingas: 0,
        sprendimas: 'Dalijant iš neigiamo skaičiaus ženklas turi apsiversti.',
      }),
  ])
}

// ── 4.5. Nelygybės sprendinys ───────────────────────────────────────────────

const T11 = 'nelygybes-sprendinys'

const A_SPRENDINYS = [
  {
    klausimas: 'Ar $x = 4$ yra nelygybės $x > 3$ sprendinys?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: '$4 > 3$ — nelygybė teisinga.',
  },
] as const

export const nelygybesSprendinys: Generatorius = () => suBandymais(kurkSprendini, A_SPRENDINYS, T11)

function kurkSprendini(): Uzdavinys | null {
  const riba = atsitiktinis(-6, 8)
  const tinkamas = riba + atsitiktinis(1, 5)
  const netinkamas = riba - atsitiktinis(1, 5)

  return variacija([
    // 1. Ar tinka
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Ar $x = ${tinkamas}$ yra nelygybės $x > ${riba}$ sprendinys?`,
        variantai: ['taip', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `$${tinkamas} > ${riba}$ — nelygybė teisinga.`,
      }),

    // 2. Netinkamas
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Ar $x = ${netinkamas}$ yra nelygybės $x > ${riba}$ sprendinys?`,
        variantai: ['ne', 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `$${netinkamas} < ${riba}$, tad nelygybė neteisinga.`,
      }),

    // 3. Kas yra sprendinys
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kas vadinama nelygybės sprendiniu?',
        variantai: [
          'nežinomojo reikšmė, su kuria nelygybė tampa teisinga',
          'vienintelis skaičius, tenkinantis nelygybę',
          'nelygybės ženklas',
          'nelygybės riba',
        ],
        teisingas: 0,
        sprendimas: 'Nelygybė paprastai turi be galo daug sprendinių.',
      }),

    // 4. Kiek sprendinių
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Kiek sprendinių turi nelygybė $x > ${riba}$?`,
        variantai: ['be galo daug', 'vieną', 'du', 'nė vieno'],
        teisingas: 0,
        sprendimas: 'Tinka kiekvienas skaičius, didesnis už ribą.',
        brezinys: intervalas({ reiksme: riba, itraukiamas: false }, null),
      }),

    // 5. Mažiausias sveikasis sprendinys
    () =>
      uzdavinys(T11, {
        klausimas: `Koks mažiausias sveikasis nelygybės $x \\ge ${riba}$ sprendinys?`,
        atsakymas: String(riba),
        atsakymasRodymui: `$${riba}$`,
        sprendimas: 'Ženklas negriežtas, tad pati riba tinka.',
      }),

    // 6. Kuris iš trijų
    () =>
      uzdavinys(T11, {
        klausimas: `Kuris iš skaičių $${netinkamas}$, $${riba}$, $${tinkamas}$ yra nelygybės $x > ${riba}$ sprendinys?`,
        atsakymas: String(tinkamas),
        atsakymasRodymui: `$${tinkamas}$`,
        sprendimas: `Tik $${tinkamas}$ yra didesnis už $${riba}$.`,
      }),

    // 7. Nelygybė be sprendinių
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kiek sprendinių turi nelygybė $x < x - 1$?',
        variantai: ['nė vieno', 'vieną', 'be galo daug', 'du'],
        teisingas: 0,
        sprendimas: 'Skaičius negali būti mažesnis už save vienetu sumažintą.',
      }),
  ])
}

// ── 4.6. Sprendžiame vieno žingsnio nelygybes ───────────────────────────────

const T12 = 'vieno-zingsnio-nelygybes'

const A_VIENO = [
  {
    klausimas: 'Išspręsk: $x + 5 > 12$. Koks mažiausias sveikasis sprendinys?',
    atsakymas: '8',
    atsakymasRodymui: '$x > 7$, mažiausias sveikasis $8$',
    sprendimas: '$12 - 5 = 7$.',
  },
] as const

export const vienoZingsnioNelygybes: Generatorius = () => suBandymais(kurkViena, A_VIENO, T12)

function kurkViena(): Uzdavinys | null {
  const x = atsitiktinis(-8, 12)
  const c = atsitiktinis(2, 15)
  const k = atsitiktinis(2, 6)

  return variacija([
    // 1. Su sudėtimi
    () =>
      uzdavinys(T12, {
        klausimas: `Išspręsk: $x + ${c} > ${x + c}$. Koks mažiausias sveikasis sprendinys?`,
        atsakymas: String(x + 1),
        atsakymasRodymui: `$x > ${x}$, mažiausias sveikasis $${x + 1}$`,
        sprendimas: `$${x + c} - ${c} = ${x}$.`,
      }),

    // 2. Su atimtimi
    () =>
      uzdavinys(T12, {
        klausimas: `Išspręsk: $x - ${c} < ${x - c}$. Koks didžiausias sveikasis sprendinys?`,
        atsakymas: String(x - 1),
        atsakymasRodymui: `$x < ${x}$, didžiausias sveikasis $${x - 1}$`,
        sprendimas: `$${x - c} + ${c} = ${x}$.`,
      }),

    // 3. Su teigiamu daugikliu
    () =>
      uzdavinys(T12, {
        klausimas: `Išspręsk: $${k}x \\ge ${k * x}$. Koks mažiausias sveikasis sprendinys?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x \\ge ${x}$`,
        sprendimas: `$${k * x} : ${k} = ${x}$; daugiklis teigiamas, tad ženklas nesikeičia.`,
      }),

    // 4. Su neigiamu daugikliu
    () =>
      uzdavinys(T12, {
        klausimas: `Išspręsk: $-${k}x > ${k * x}$. Koks didžiausias sveikasis sprendinys?`,
        atsakymas: String(-x - 1),
        atsakymasRodymui: `$x < ${-x}$, didžiausias sveikasis $${-x - 1}$`,
        sprendimas: `Dalijant iš $-${k}$ ženklas apsiverčia: $x < ${-x}$.`,
      }),

    // 5. Sprendinių vaizdas
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Kaip skaičių tiesėje vaizduojami nelygybės $x > ${x}$ sprendiniai?`,
        variantai: [
          'tuščiu tašku ties riba ir spinduliu į dešinę',
          'pilnu tašku ties riba ir spinduliu į dešinę',
          'tuščiu tašku ir spinduliu į kairę',
          'vienu tašku',
        ],
        teisingas: 0,
        sprendimas: 'Griežtas ženklas reiškia tuščią tašką.',
        brezinys: intervalas({ reiksme: Math.max(-7, Math.min(7, x)), itraukiamas: false }, null),
      }),

    // 6. Su dalyba
    () =>
      uzdavinys(T12, {
        klausimas: `Išspręsk: $\\dfrac{x}{${k}} < ${x}$. Koks didžiausias sveikasis sprendinys?`,
        atsakymas: String(k * x - 1),
        atsakymasRodymui: `$x < ${k * x}$, didžiausias sveikasis $${k * x - 1}$`,
        sprendimas: `$${x} \\cdot ${k} = ${k * x}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T12, {
        klausimas: `Spręsdamas $-${k}x > ${k * x}$ mokinys gavo $x > ${-x}$. Kokia nelygybė teisinga? Užrašyk ribą.`,
        atsakymas: String(-x),
        atsakymasRodymui: `$x < ${-x}$`,
        sprendimas: 'Dalijant iš neigiamo skaičiaus ženklas apsiverčia.',
      }),
  ])
}

// ── 4.7. Sprendžiame paprastas nelygybes ────────────────────────────────────

const T13 = 'paprastos-nelygybes'

const A_PAPRASTOS_N = [
  {
    klausimas: 'Išspręsk: $3x + 4 > 19$. Koks mažiausias sveikasis sprendinys?',
    atsakymas: '6',
    atsakymasRodymui: '$x > 5$, mažiausias sveikasis $6$',
    sprendimas: '$19 - 4 = 15$, $15 : 3 = 5$.',
  },
] as const

export const paprastosNelygybes: Generatorius = () => suBandymais(kurkPaprastasN, A_PAPRASTOS_N, T13)

function kurkPaprastasN(): Uzdavinys | null {
  const x = atsitiktinis(-6, 12)
  const k = atsitiktinis(2, 7)
  const c = atsitiktinis(2, 15)

  return variacija([
    // 1. Du žingsniai, didesnis
    () =>
      uzdavinys(T13, {
        klausimas: `Išspręsk: $${k}x + ${c} > ${k * x + c}$. Koks mažiausias sveikasis sprendinys?`,
        atsakymas: String(x + 1),
        atsakymasRodymui: `$x > ${x}$, mažiausias sveikasis $${x + 1}$`,
        sprendimas: `$${k * x + c} - ${c} = ${k * x}$, tada $${k * x} : ${k} = ${x}$.`,
      }),

    // 2. Du žingsniai, mažesnis
    () =>
      uzdavinys(T13, {
        klausimas: `Išspręsk: $${k}x - ${c} \\le ${k * x - c}$. Koks didžiausias sveikasis sprendinys?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x \\le ${x}$`,
        sprendimas: `$${k * x - c} + ${c} = ${k * x}$, tada $${k * x} : ${k} = ${x}$.`,
      }),

    // 3. Su neigiamu koeficientu
    () =>
      uzdavinys(T13, {
        klausimas: `Išspręsk: $${c} - ${k}x > ${c - k * x}$. Koks didžiausias sveikasis sprendinys?`,
        atsakymas: String(x - 1),
        atsakymasRodymui: `$x < ${x}$, didžiausias sveikasis $${x - 1}$`,
        sprendimas: `Perkėlus: $-${k}x > -${k * x}$; dalijant iš $-${k}$ ženklas apsiverčia.`,
      }),

    // 4. Sprendinių vaizdas
    () => {
      const riba = Math.max(-7, Math.min(7, x))
      return uzdavinys(T13, {
        klausimas: 'Kokia nelygybė pavaizduota skaičių tiesėje? Užrašyk jos ribą.',
        atsakymas: String(riba),
        atsakymasRodymui: `$x \\ge ${riba}$`,
        sprendimas: 'Taškas pilnas, tad riba įtraukiama; spalvota dalis eina į dešinę.',
        brezinys: intervalas({ reiksme: riba, itraukiamas: true }, null),
      })
    },

    // 5. Patikra
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Ar $x = ${x + 2}$ tenkina nelygybę $${k}x + ${c} > ${k * x + c}$?`,
        variantai: ['taip', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `Sprendinių aibė yra $x > ${x}$, o $${x + 2} > ${x}$.`,
      }),

    // 6. Nelygybė su skliaustais
    () => {
      const n = atsitiktinis(2, 8)
      return uzdavinys(T13, {
        klausimas: `Išspręsk: $${k}(x + ${n}) > ${k * (x + n)}$. Koks mažiausias sveikasis sprendinys?`,
        atsakymas: String(x + 1),
        atsakymasRodymui: `$x > ${x}$, mažiausias sveikasis $${x + 1}$`,
        sprendimas: `$${k * (x + n)} : ${k} = ${x + n}$, tada $${x + n} - ${n} = ${x}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T13, {
        klausimas: `Spręsdamas $${k}x + ${c} > ${k * x + c}$ mokinys iš karto padalijo ${k * x + c} iš ${k}. Kokį veiksmą reikėjo atlikti pirmiausia? Užrašyk, kas lieka dešinėje.`,
        atsakymas: String(k * x),
        atsakymasRodymui: `$${k * x}$`,
        sprendimas: `Pirmiausia iš abiejų pusių atimama ${c}: $${k * x + c} - ${c} = ${k * x}$.`,
      }),
  ])
}

// ── 4.8. Sprendžiame sudėtingesnes nelygybes ────────────────────────────────

const T14 = 'sudetingesnes-nelygybes'

const A_SUDETINGESNES = [
  {
    klausimas: 'Išspręsk: $5x - 3 > 2x + 9$. Koks mažiausias sveikasis sprendinys?',
    atsakymas: '5',
    atsakymasRodymui: '$x > 4$, mažiausias sveikasis $5$',
    sprendimas: '$3x > 12$, tad $x > 4$.',
  },
] as const

export const sudetingesnesNelygybes: Generatorius = () => suBandymais(kurkSudetingesnes, A_SUDETINGESNES, T14)

function kurkSudetingesnes(): Uzdavinys | null {
  const x = atsitiktinis(-5, 10)
  const a = atsitiktinis(3, 9)
  const b = atsitiktinis(1, a - 1)
  const c = atsitiktinis(2, 15)

  return variacija([
    // 1. Nežinomasis abiejose pusėse
    () => {
      const kaire = a * x - c
      const laisvas = kaire - b * x
      return uzdavinys(T14, {
        klausimas: `Išspręsk: $${a}x - ${c} > ${b}x ${laisvas < 0 ? `- ${-laisvas}` : `+ ${laisvas}`}$. Koks mažiausias sveikasis sprendinys?`,
        atsakymas: String(x + 1),
        atsakymasRodymui: `$x > ${x}$, mažiausias sveikasis $${x + 1}$`,
        sprendimas: `Perkėlus: $${a - b}x > ${(a - b) * x}$, tad $x > ${x}$.`,
      })
    },

    // 2. Su neigiamu koeficientu po perkėlimo
    () => {
      const kaire = b * x + c
      const laisvas = kaire - a * x
      return uzdavinys(T14, {
        klausimas: `Išspręsk: $${b}x + ${c} > ${a}x ${laisvas < 0 ? `- ${-laisvas}` : `+ ${laisvas}`}$. Koks didžiausias sveikasis sprendinys?`,
        atsakymas: String(x - 1),
        atsakymasRodymui: `$x < ${x}$, didžiausias sveikasis $${x - 1}$`,
        sprendimas: `Perkėlus gaunama $-${a - b}x > -${(a - b) * x}$; dalijant iš neigiamo skaičiaus ženklas apsiverčia.`,
      })
    },

    // 3. Su skliaustais abiejose pusėse
    () => {
      const n = atsitiktinis(2, 6)
      return uzdavinys(T14, {
        klausimas: `Išspręsk: $${a}(x + ${n}) > ${b}(x + ${n}) ${(a - b) * (x + n) < 0 ? `- ${-(a - b) * (x + n)}` : `+ ${(a - b) * (x + n)}`}$. Koks mažiausias sveikasis sprendinys?`,
        atsakymas: String(x + 1),
        atsakymasRodymui: `$x > ${x}$, mažiausias sveikasis $${x + 1}$`,
        sprendimas: `Perkėlus: $${a - b}(x + ${n}) > ${(a - b) * (x + n)}$, tad $x + ${n} > ${x + n}$.`,
      })
    },

    // 4. Kur perkelti narius
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kaip patogiausia spręsti nelygybę, kurioje nežinomasis yra abiejose pusėse?',
        variantai: [
          'nariai su nežinomuoju perkeliami į vieną pusę, skaičiai — į kitą',
          'abi pusės dalijamos iš nežinomojo',
          'nelygybė paverčiama lygybe',
          'nežinomasis pakeičiamas nuliu',
        ],
        teisingas: 0,
        sprendimas: 'Perkeliant narį jo ženklas keičiasi priešingu.',
      }),

    // 5. Sprendinių aibė
    () => {
      const riba = Math.max(-7, Math.min(7, x))
      return pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kokia nelygybė pavaizduota skaičių tiesėje?',
        variantai: [`$x < ${riba}$`, `$x > ${riba}$`, `$x \\le ${riba}$`, `$x \\ge ${riba}$`],
        teisingas: 0,
        sprendimas: 'Taškas tuščias, o spalvota dalis eina į kairę.',
        brezinys: intervalas(null, { reiksme: riba, itraukiamas: false }),
      })
    },

    // 6. Patikra
    () =>
      uzdavinys(T14, {
        klausimas: `Nelygybės sprendinių aibė yra $x > ${x}$. Koks mažiausias sveikasis skaičius jai priklauso?`,
        atsakymas: String(x + 1),
        atsakymasRodymui: `$${x + 1}$`,
        sprendimas: 'Pati riba netinka, nes ženklas griežtas.',
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Perkeldamas narį į kitą nelygybės pusę mokinys ženklo nepakeitė. Kas atsitiks su sprendiniais?',
        variantai: [
          'jie bus neteisingi, nes pakis pati nelygybė',
          'niekas — sprendiniai tie patys',
          'sprendinių nebeliks',
          'nelygybė taps lygybe',
        ],
        teisingas: 0,
        sprendimas: 'Perkėlimas yra tas pat, kas iš abiejų pusių atimti tą patį narį.',
      }),
  ])
}

// ── 4.9. Dviejų nelygybių su vienu nežinomuoju sistema ──────────────────────

const T15 = 'nelygybiu-sistema'

const A_SISTEMA = [
  {
    klausimas: 'Kiek sveikųjų skaičių tenkina abi nelygybes: $x > 2$ ir $x \\le 6$?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Tinka 3, 4, 5 ir 6.',
  },
] as const

export const nelygybiuSistema: Generatorius = () => suBandymais(kurkSistema, A_SISTEMA, T15)

function kurkSistema(): Uzdavinys | null {
  const a = atsitiktinis(-6, 3)
  const b = a + atsitiktinis(2, 7)
  if (b > 8) return null

  return variacija([
    // 1. Kiek sveikųjų tenkina
    () =>
      uzdavinys(T15, {
        klausimas: `Kiek sveikųjų skaičių tenkina abi nelygybes: $x > ${a}$ ir $x \\le ${b}$?`,
        atsakymas: String(b - a),
        atsakymasRodymui: `$${b - a}$`,
        sprendimas: `Tinka skaičiai nuo $${a + 1}$ iki $${b}$ — iš viso ${b - a}.`,
        brezinys: intervalas({ reiksme: a, itraukiamas: false }, { reiksme: b, itraukiamas: true }),
      }),

    // 2. Kas yra sistemos sprendinys
    () =>
      pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: 'Kas yra nelygybių sistemos sprendinys?',
        variantai: [
          'reikšmė, tenkinanti visas sistemos nelygybes',
          'reikšmė, tenkinanti bent vieną nelygybę',
          'nelygybių sprendinių suma',
          'nelygybių ribos',
        ],
        teisingas: 0,
        sprendimas: 'Sistemos sprendinių aibė yra atskirų sprendinių aibių bendra dalis.',
      }),

    // 3. Mažiausias sveikasis
    () =>
      uzdavinys(T15, {
        klausimas: `Koks mažiausias sveikasis skaičius tenkina abi nelygybes: $x > ${a}$ ir $x < ${b}$?`,
        atsakymas: String(a + 1),
        atsakymasRodymui: `$${a + 1}$`,
        sprendimas: 'Pati apatinė riba netinka, nes ženklas griežtas.',
      }),

    // 4. Didžiausias sveikasis
    () =>
      uzdavinys(T15, {
        klausimas: `Koks didžiausias sveikasis skaičius tenkina abi nelygybes: $x \\ge ${a}$ ir $x < ${b}$?`,
        atsakymas: String(b - 1),
        atsakymasRodymui: `$${b - 1}$`,
        sprendimas: 'Viršutinė riba netinka, nes ženklas griežtas.',
      }),

    // 5. Sistema be sprendinių
    () =>
      pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: `Kiek sprendinių turi sistema $x > ${b}$ ir $x < ${a}$?`,
        variantai: ['nė vieno', 'be galo daug', 'vieną', `${b - a}`],
        teisingas: 0,
        sprendimas: `Skaičius negali būti kartu didesnis už $${b}$ ir mažesnis už $${a}$.`,
      }),

    // 6. Ar priklauso
    () => {
      const tikrinamas = atsitiktinis(a - 2, b + 2)
      const tinka = tikrinamas > a && tikrinamas <= b
      return pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: `Ar $x = ${tikrinamas}$ tenkina sistemą $x > ${a}$ ir $x \\le ${b}$?`,
        variantai: tinka ? ['taip', 'ne', 'to nustatyti neįmanoma'] : ['ne', 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `Tikrinamos abi sąlygos iš karto.`,
      })
    },

    // 7. Sprendinių aibė
    () =>
      uzdavinys(T15, {
        klausimas: 'Kokia yra pavaizduoto sprendinių intervalo apatinė riba?',
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: 'Ieškomas kairysis nuspalvintos dalies galas.',
        brezinys: intervalas({ reiksme: a, itraukiamas: false }, { reiksme: b, itraukiamas: true }),
      }),
  ])
}

// ── 4.10. Dvigubųjų nelygybių sprendimas ────────────────────────────────────

const T16 = 'dvigubos-nelygybes'

const A_DVIGUBOS = [
  {
    klausimas: 'Kiek sveikųjų skaičių tenkina $-2 < x \\le 3$?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Tinka $-1, 0, 1, 2, 3$.',
  },
] as const

export const dvigubosNelygybes: Generatorius = () => suBandymais(kurkDvigubas, A_DVIGUBOS, T16)

function kurkDvigubas(): Uzdavinys | null {
  const a = atsitiktinis(-6, 2)
  const b = a + atsitiktinis(2, 7)
  if (b > 8) return null
  const k = atsitiktinis(2, 5)
  const c = atsitiktinis(1, 10)

  return variacija([
    // 1. Kiek sveikųjų
    () =>
      uzdavinys(T16, {
        klausimas: `Kiek sveikųjų skaičių tenkina $${a} < x \\le ${b}$?`,
        atsakymas: String(b - a),
        atsakymasRodymui: `$${b - a}$`,
        sprendimas: `Tinka skaičiai nuo $${a + 1}$ iki $${b}$.`,
        brezinys: intervalas({ reiksme: a, itraukiamas: false }, { reiksme: b, itraukiamas: true }),
      }),

    // 2. Ką reiškia dvigubas užrašas
    () =>
      pasirinkimoUzdavinys(naujasId(T16), T16, {
        klausimas: `Ką reiškia užrašas $${a} < x < ${b}$?`,
        variantai: [
          `$x$ yra didesnis už $${a}$ ir kartu mažesnis už $${b}$`,
          `$x$ yra didesnis už $${a}$ arba mažesnis už $${b}$`,
          `$x$ lygus $${a}$ arba $${b}$`,
          `$x$ yra tarp $${a}$ ir $${b}$ imtinai`,
        ],
        teisingas: 0,
        sprendimas: 'Dvigubas užrašas sujungia dvi nelygybes, kurios galioja kartu.',
      }),

    // 3. Sprendimas dviem žingsniais
    () =>
      uzdavinys(T16, {
        klausimas: `Išspręsk: $${a * k + c} < ${k}x + ${c} \\le ${b * k + c}$. Kokia apatinė $x$ riba?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a} < x \\le ${b}$, apatinė riba $${a}$`,
        sprendimas: `Iš visų trijų dalių atimama ${c}, paskui visos dalijamos iš ${k}.`,
      }),

    // 4. Ką daryti su visomis dalimis
    () =>
      pasirinkimoUzdavinys(naujasId(T16), T16, {
        klausimas: 'Ką reikia daryti su visomis trimis dvigubos nelygybės dalimis?',
        variantai: [
          'tą patį veiksmą su visomis trimis',
          'veiksmą tik su vidurine dalimi',
          'veiksmą tik su kraštinėmis dalimis',
          'nieko — dviguba nelygybė nesprendžiama',
        ],
        teisingas: 0,
        sprendimas: 'Kitaip nelygybė nustotų būti teisinga.',
      }),

    // 5. Mažiausias sveikasis
    () =>
      uzdavinys(T16, {
        klausimas: `Koks mažiausias sveikasis skaičius tenkina $${a} \\le x < ${b}$?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: 'Apatinės ribos ženklas negriežtas, tad ji tinka.',
      }),

    // 6. Iš brėžinio
    () =>
      uzdavinys(T16, {
        klausimas: 'Kokia yra pavaizduoto intervalo viršutinė riba?',
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: 'Ieškomas dešinysis nuspalvintos dalies galas.',
        brezinys: intervalas({ reiksme: a, itraukiamas: true }, { reiksme: b, itraukiamas: false }),
      }),

    // 7. Su neigiamu daugikliu
    () =>
      pasirinkimoUzdavinys(naujasId(T16), T16, {
        klausimas: 'Kas atsitinka dvigubai nelygybei, padauginus visas jos dalis iš neigiamo skaičiaus?',
        variantai: [
          'abu ženklai apsiverčia, o kraštinės dalys susikeičia vietomis',
          'ženklai nesikeičia',
          'apsiverčia tik vienas ženklas',
          'nelygybė tampa lygybe',
        ],
        teisingas: 0,
        sprendimas: '$2 < x < 5$ padauginus iš $-1$ virsta $-5 < -x < -2$.',
      }),
  ])
}

// ── 4.11. Sprendžiame tekstinius uždavinius ─────────────────────────────────

const T17 = 'nelygybiu-tekstiniai'

const A_TEKSTINIAI = [
  {
    klausimas: 'Sąsiuvinis kainuoja 3 Eur. Kiek daugiausia sąsiuvinių galima nupirkti už 20 Eur?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: '$3x \\le 20$, tad $x \\le 6\\tfrac{2}{3}$; sveikųjų — daugiausia 6.',
  },
] as const

export const nelygybiuTekstiniai: Generatorius = () => suBandymais(kurkTekstinius, A_TEKSTINIAI, T17)

function kurkTekstinius(): Uzdavinys | null {
  const kaina = atsitiktinis(2, 9)
  const turi = atsitiktinis(20, 90)
  const kiek = Math.floor(turi / kaina)
  if (kiek < 2) return null

  return variacija([
    // 1. Kiek daugiausia nupirkti
    () =>
      uzdavinys(T17, {
        klausimas: `Vienas sąsiuvinis kainuoja ${kaina} Eur. Kiek daugiausia sąsiuvinių galima nupirkti už ${turi} Eur?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `$${kaina}x \\le ${turi}$, tad $x \\le ${(turi / kaina).toFixed(2).replace('.', '{,}')}$; sveikųjų — daugiausia ${kiek}.`,
      }),

    // 2. Su pradiniu mokesčiu
    () => {
      const mokestis = atsitiktinis(2, 10)
      const galima = Math.floor((turi - mokestis) / kaina)
      if (galima < 1) return null
      return uzdavinys(T17, {
        klausimas: `Įėjimas kainuoja ${mokestis} Eur, o vienas atrakcionas — ${kaina} Eur. Kiek daugiausia atrakcionų galima išbandyti turint ${turi} Eur?`,
        atsakymas: String(galima),
        atsakymasRodymui: `$${galima}$`,
        sprendimas: `$${kaina}x + ${mokestis} \\le ${turi}$, tad $x \\le ${((turi - mokestis) / kaina).toFixed(2).replace('.', '{,}')}$.`,
      })
    },

    // 3. Kiek mažiausiai
    () => {
      const vienam = atsitiktinis(3, 9)
      const zmoniu = atsitiktinis(20, 80)
      const reikia = Math.ceil(zmoniu / vienam)
      return uzdavinys(T17, {
        klausimas: `Į vieną stalą telpa ${vienam} žmonės. Kiek mažiausiai stalų reikia ${zmoniu} žmonėms?`,
        atsakymas: String(reikia),
        atsakymasRodymui: `$${reikia}$`,
        sprendimas: `$${vienam}x \\ge ${zmoniu}$, tad $x \\ge ${(zmoniu / vienam).toFixed(2).replace('.', '{,}')}$; mažiausias sveikasis — ${reikia}.`,
      })
    },

    // 4. Kokia nelygybė
    () =>
      pasirinkimoUzdavinys(naujasId(T17), T17, {
        klausimas: `Kokia nelygybė atitinka sąlygą „už ${turi} Eur nuperkama $x$ prekių po ${kaina} Eur“?`,
        variantai: [`$${kaina}x \\le ${turi}$`, `$${kaina}x \\ge ${turi}$`, `$x + ${kaina} \\le ${turi}$`, `$${kaina} + ${turi} \\le x$`],
        teisingas: 0,
        sprendimas: 'Bendra kaina negali viršyti turimos sumos.',
      }),

    // 5. Kodėl apvalinama žemyn
    () =>
      pasirinkimoUzdavinys(naujasId(T17), T17, {
        klausimas: 'Kodėl uždavinyje „kiek daugiausia prekių galima nupirkti“ atsakymas apvalinamas žemyn?',
        variantai: [
          'nes prekių skaičius yra sveikasis, o pinigų neužtektų didesniam',
          'nes taip patogiau',
          'nes visada apvalinama žemyn',
          'nes kaina dešimtainė',
        ],
        teisingas: 0,
        sprendimas: 'Dalies prekės nusipirkti negalima.',
      }),

    // 6. Kiek liks
    () =>
      uzdavinys(T17, {
        klausimas: `Nupirkus ${kiek} sąsiuvinius po ${kaina} Eur iš ${turi} Eur, kiek eurų liks?`,
        atsakymas: String(turi - kiek * kaina),
        atsakymasRodymui: `$${turi - kiek * kaina}$ Eur`,
        sprendimas: `$${turi} - ${kiek} \\cdot ${kaina} = ${turi - kiek * kaina}$.`,
      }),

    // 7. Vidurkio sąlyga
    () => {
      const testai = atsitiktinis(3, 5)
      const vidurkis = atsitiktinis(6, 8)
      const surinkta = vidurkis * (testai - 1) - atsitiktinis(1, 5)
      const reikia = vidurkis * testai - surinkta
      if (reikia < 1 || reikia > 10) return null
      return uzdavinys(T17, {
        klausimas: `Iš ${testai - 1} atsiskaitymų surinkta ${surinkta} balai. Kiek mažiausiai balų reikia paskutiniame, kad ${testai} atsiskaitymų vidurkis būtų ne mažesnis kaip ${vidurkis}?`,
        atsakymas: String(reikia),
        atsakymasRodymui: `$${reikia}$`,
        sprendimas: `Bendra suma turi būti ne mažesnė kaip $${vidurkis} \\cdot ${testai} = ${vidurkis * testai}$: $${vidurkis * testai} - ${surinkta} = ${reikia}$.`,
      })
    },
  ])
}

// ── 5.1. Tarpusavyje susiję dydžiai ─────────────────────────────────────────

const T18 = 'susije-dydziai'

const A_SUSIJE = [
  {
    klausimas: 'Ar greitis ir kelionės laikas, nuvažiuojant tą patį kelią, yra susiję dydžiai?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: 'Didėjant greičiui laikas mažėja.',
  },
] as const

export const susijeDydziai: Generatorius = () => suBandymais(kurkSusijusius, A_SUSIJE, T18)

function kurkSusijusius(): Uzdavinys | null {
  const k = atsitiktinis(12, 60)

  return variacija([
    // 1. Ar susiję
    () =>
      pasirinkimoUzdavinys(naujasId(T18), T18, {
        klausimas: 'Kaip kinta kelionės laikas, didėjant greičiui, kai kelias tas pats?',
        variantai: ['mažėja', 'didėja', 'nesikeičia', 'iš pradžių didėja, paskui mažėja'],
        teisingas: 0,
        sprendimas: 'Greičiau važiuojant tą patį kelią nuvažiuojama per trumpesnį laiką.',
      }),

    // 2. Tiesiogiai ar atvirkščiai
    () =>
      pasirinkimoUzdavinys(naujasId(T18), T18, {
        klausimas: 'Kurie dydžiai yra tiesiogiai proporcingi?',
        variantai: [
          'prekės kiekis ir bendra kaina',
          'greitis ir kelionės laikas tam pačiam keliui',
          'darbininkų skaičius ir darbo trukmė',
          'sriubos porcijų skaičius ir vienos porcijos dydis',
        ],
        teisingas: 0,
        sprendimas: 'Tiesiogiai proporcingi dydžiai didėja kartu.',
      }),

    // 3. Sandauga pastovi
    () =>
      pasirinkimoUzdavinys(naujasId(T18), T18, {
        klausimas: 'Kas lieka pastovu, kai du dydžiai atvirkščiai proporcingi?',
        variantai: ['jų sandauga', 'jų suma', 'jų skirtumas', 'jų dalmuo'],
        teisingas: 0,
        sprendimas: 'Todėl vienam padidėjus kelis kartus, kitas tiek pat kartų sumažėja.',
      }),

    // 4. Konkretus pavyzdys
    () => {
      const v1 = pasirink([2, 3, 4, 6])
      if (k % v1 !== 0) return null
      return uzdavinys(T18, {
        klausimas: `Kelias ${k} km. Kiek valandų truks kelionė ${v1} km/h greičiu?`,
        atsakymas: String(k / v1),
        atsakymasRodymui: `$${k / v1}$ h`,
        sprendimas: `$${k} : ${v1} = ${k / v1}$.`,
      })
    },

    // 5. Kaip pasikeis
    () =>
      uzdavinys(T18, {
        klausimas: 'Greitis padidėjo 2 kartus. Kiek kartų sutrumpėjo kelionės laikas tam pačiam keliui?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Atvirkščiai proporcingi dydžiai kinta priešingai, bet tiek pat kartų.',
      }),

    // 6. Darbininkai
    () => {
      const darbininku = pasirink([2, 3, 4, 6])
      if (k % darbininku !== 0) return null
      return uzdavinys(T18, {
        klausimas: `Vienas darbininkas darbą atliktų per ${k} valandas. Per kiek valandų jį atliks ${darbininku} vienodai dirbantys darbininkai?`,
        atsakymas: String(k / darbininku),
        atsakymasRodymui: `$${k / darbininku}$ h`,
        sprendimas: `$${k} : ${darbininku} = ${k / darbininku}$.`,
      })
    },

    // 7. Poros
    () =>
      poruUzdavinys(naujasId(T18), T18, {
        klausimas: 'Sujunk dydžių porą su priklausomybės rūšimi.',
        poros: [
          { kaire: 'kiekis ir kaina', desine: 'tiesioginis proporcingumas' },
          { kaire: 'greitis ir laikas', desine: 'atvirkštinis proporcingumas' },
          { kaire: 'darbininkų skaičius ir trukmė', desine: 'atvirkštinis proporcingumas' },
          { kaire: 'kraštinė ir perimetras', desine: 'tiesioginis proporcingumas' },
        ],
        sprendimas: 'Tiesiogiai proporcingų dydžių dalmuo pastovus, atvirkščiai — sandauga.',
      }),
  ])
}

// ── 5.2. Atvirkščiai proporcingi dydžiai ────────────────────────────────────

const T19 = 'atvirksciai-proporcingi'

const A_ATVIRKSCIAI = [
  {
    klausimas: 'Dydžiai atvirkščiai proporcingi: kai $x = 4$, tai $y = 6$. Kiek bus $y$, kai $x = 8$?',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Sandauga pastovi: $4 \\cdot 6 = 24$, tad $24 : 8 = 3$.',
  },
] as const

export const atvirksciaiProporcingi: Generatorius = () => suBandymais(kurkAtvirkscius, A_ATVIRKSCIAI, T19)

function kurkAtvirkscius(): Uzdavinys | null {
  const k = pasirink([12, 18, 24, 30, 36, 48, 60])
  const x1 = pasirink([2, 3, 4, 6])
  if (k % x1 !== 0) return null
  const y1 = k / x1
  const x2 = pasirink([2, 3, 4, 6, 12].filter((v) => v !== x1 && k % v === 0))
  if (x2 === undefined) return null

  return variacija([
    // 1. Rask antrą reikšmę
    () =>
      uzdavinys(T19, {
        klausimas: `Dydžiai atvirkščiai proporcingi: kai $x = ${x1}$, tai $y = ${y1}$. Kiek bus $y$, kai $x = ${x2}$?`,
        atsakymas: String(k / x2),
        atsakymasRodymui: `$${k / x2}$`,
        sprendimas: `Sandauga pastovi: $${x1} \\cdot ${y1} = ${k}$, tad $${k} : ${x2} = ${k / x2}$.`,
      }),

    // 2. Proporcingumo koeficientas
    () =>
      uzdavinys(T19, {
        klausimas: `Dydžiai atvirkščiai proporcingi: kai $x = ${x1}$, tai $y = ${y1}$. Koks yra proporcingumo koeficientas?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `Koeficientas yra pastovi sandauga: $${x1} \\cdot ${y1} = ${k}$.`,
      }),

    // 3. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T19), T19, {
        klausimas: 'Kokia formule užrašomi atvirkščiai proporcingi dydžiai?',
        variantai: [`$y = \\dfrac{k}{x}$`, `$y = kx$`, `$y = x + k$`, `$y = k - x$`],
        teisingas: 0,
        sprendimas: 'Iš jos matyti, kad sandauga $xy = k$ yra pastovi.',
      }),

    // 4. Kiek kartų pasikeis
    () =>
      uzdavinys(T19, {
        klausimas: 'Dydžiai atvirkščiai proporcingi. $x$ padidėjo 3 kartus. Kiek kartų sumažėjo $y$?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Sandauga turi likti ta pati.',
      }),

    // 5. Ar atvirkščiai proporcingi
    () => {
      const kitas = atsitiktinis(2, 9)
      return pasirinkimoUzdavinys(naujasId(T19), T19, {
        klausimas: `Ar dydžiai, kurių poros $(${x1}; ${y1})$ ir $(${x2}; ${k / x2})$, yra atvirkščiai proporcingi?`,
        variantai: [
          `taip, nes $${x1} \\cdot ${y1} = ${x2} \\cdot ${k / x2} = ${k}$`,
          'ne, nes reikšmės skirtingos',
          `ne, nes $${kitas}$ netinka`,
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Atvirkščiai proporcingų dydžių sandauga visada ta pati.',
      })
    },

    // 6. Rask x
    () =>
      uzdavinys(T19, {
        klausimas: `Dydžiai atvirkščiai proporcingi, koeficientas ${k}. Koks $x$, kai $y = ${k / x2}$?`,
        atsakymas: String(x2),
        atsakymasRodymui: `$${x2}$`,
        sprendimas: `$${k} : ${k / x2} = ${x2}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T19), T19, {
        klausimas: 'Mokinys teigia, kad atvirkščiai proporcingų dydžių suma pastovi. Kas iš tikrųjų yra pastovu?',
        variantai: ['jų sandauga', 'jų suma', 'jų skirtumas', 'jų dalmuo'],
        teisingas: 0,
        sprendimas: `$${x1} + ${y1} = ${x1 + y1}$, o $${x2} + ${k / x2} = ${x2 + k / x2}$ — sumos skiriasi, o sandaugos ne.`,
      }),
  ])
}

// ── 5.3. Atvirkščiai proporcingų dydžių priklausomybės grafikas ─────────────

const T20 = 'atvirkstinio-grafikas'

const A_GRAFIKAS = [
  {
    klausimas: 'Kokia linija vaizduojami atvirkščiai proporcingi dydžiai?',
    atsakymas: 'hiperbole',
    atsakymasRodymui: 'Hiperbole',
    sprendimas: 'Tai kreivė, kuri niekada nekerta ašių.',
  },
] as const

export const atvirkstinioGrafikas: Generatorius = () => suBandymais(kurkGrafika, A_GRAFIKAS, T20)

function kurkGrafika(): Uzdavinys | null {
  const k = pasirink([12, 18, 24, 30, 36])
  const x = pasirink([2, 3, 4, 6].filter((v) => k % v === 0))
  if (x === undefined) return null

  return variacija([
    // 1. Kokia linija
    () =>
      pasirinkimoUzdavinys(naujasId(T20), T20, {
        klausimas: 'Kokia linija vaizduojami atvirkščiai proporcingi dydžiai?',
        variantai: ['hiperbole', 'tiese per koordinačių pradžią', 'tiese, nekertančia ašių', 'laužte'],
        teisingas: 0,
        sprendimas: 'Tiesė per pradžią vaizduoja tiesioginį proporcingumą.',
        brezinys: hiperbole(k, 6),
      }),

    // 2. Reikšmė iš grafiko
    () =>
      uzdavinys(T20, {
        klausimas: `Kokia $y$ reikšmė atitinka $x = ${x}$?`,
        atsakymas: String(k / x),
        atsakymasRodymui: `$${k / x}$`,
        sprendimas: 'Nuo pažymėto taško punktyru einama iki $y$ ašies.',
        brezinys: hiperbole(k, 6, x),
      }),

    // 3. Koeficientas iš grafiko
    () =>
      uzdavinys(T20, {
        klausimas: 'Koks yra atvirkštinio proporcingumo koeficientas pagal grafiką?',
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `Iš pažymėto taško: $${x} \\cdot ${k / x} = ${k}$.`,
        brezinys: hiperbole(k, 6, x),
      }),

    // 4. Ar kerta ašis
    () =>
      pasirinkimoUzdavinys(naujasId(T20), T20, {
        klausimas: 'Ar hiperbolė kerta koordinačių ašis?',
        variantai: [
          'ne, ji tik artėja prie jų',
          'taip, kerta abi',
          'taip, kerta tik $x$ ašį',
          'taip, kerta tik $y$ ašį',
        ],
        teisingas: 0,
        sprendimas: 'Nei $x$, nei $y$ negali būti lygūs nuliui, nes jų sandauga pastovi ir nenulinė.',
        brezinys: hiperbole(k, 6),
      }),

    // 5. Kaip kinta
    () =>
      pasirinkimoUzdavinys(naujasId(T20), T20, {
        klausimas: 'Kaip kinta $y$ reikšmės, didėjant $x$?',
        variantai: ['mažėja', 'didėja', 'nesikeičia', 'iš pradžių didėja'],
        teisingas: 0,
        sprendimas: 'Kreivė leidžiasi žemyn — tai atvirkštinio proporcingumo požymis.',
        brezinys: hiperbole(k, 6),
      }),

    // 6. Kiek taškų reikia
    () =>
      pasirinkimoUzdavinys(naujasId(T20), T20, {
        klausimas: 'Kuo hiperbolės brėžimas skiriasi nuo tiesės brėžimo?',
        variantai: [
          'hiperbolei reikia daugiau taškų, nes tai kreivė',
          'hiperbolei pakanka dviejų taškų',
          'hiperbolė brėžiama liniuote',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Per du taškus galima nubrėžti tiesę, bet ne kreivę.',
      }),

    // 7. Ar taškas priklauso
    () => {
      const y = k / x + atsitiktinis(1, 4)
      return pasirinkimoUzdavinys(naujasId(T20), T20, {
        klausimas: `Ar taškas $(${x}; ${y})$ priklauso grafikui $y = \\dfrac{${k}}{x}$?`,
        variantai: [`ne, nes $${x} \\cdot ${y} \\ne ${k}$`, 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `Grafikui priklausytų taškas $(${x}; ${k / x})$.`,
      })
    },
  ])
}

// ── 5.4. Tekstinių uždavinių sprendimas ─────────────────────────────────────

const T21 = 'atvirkstinio-tekstiniai'

const A_ATV_TEKSTINIAI = [
  {
    klausimas: '4 darbininkai darbą atlieka per 6 valandas. Per kiek valandų jį atliks 8 darbininkai?',
    atsakymas: '3',
    atsakymasRodymui: '$3$ h',
    sprendimas: '$4 \\cdot 6 = 24$; $24 : 8 = 3$.',
  },
] as const

export const atvirkstinioTekstiniai: Generatorius = () => suBandymais(kurkAtvTekstinius, A_ATV_TEKSTINIAI, T21)

function kurkAtvTekstinius(): Uzdavinys | null {
  const k = pasirink([24, 36, 48, 60, 72, 120])
  const a = pasirink([2, 3, 4, 6].filter((v) => k % v === 0))
  if (a === undefined) return null
  const b = pasirink([2, 3, 4, 6, 8, 12].filter((v) => v !== a && k % v === 0))
  if (b === undefined) return null

  return variacija([
    // 1. Darbininkai
    () =>
      uzdavinys(T21, {
        klausimas: `${a} darbininkai darbą atlieka per ${k / a} valandas. Per kiek valandų jį atliks ${b} tokie pat darbininkai?`,
        atsakymas: String(k / b),
        atsakymasRodymui: `$${k / b}$ h`,
        sprendimas: `Darbo apimtis pastovi: $${a} \\cdot ${k / a} = ${k}$; $${k} : ${b} = ${k / b}$.`,
      }),

    // 2. Greitis ir laikas
    () =>
      uzdavinys(T21, {
        klausimas: `Važiuojant ${a * 10} km/h greičiu kelionė trunka ${k / a} valandas. Kiek valandų truks kelionė ${b * 10} km/h greičiu?`,
        atsakymas: String(k / b),
        atsakymasRodymui: `$${k / b}$ h`,
        sprendimas: `Kelias pastovus: $${a * 10} \\cdot ${k / a} = ${a * 10 * (k / a)}$ km.`,
      }),

    // 3. Dėžės
    () =>
      uzdavinys(T21, {
        klausimas: `Į ${a} dėžes telpa po ${k / a} obuolius. Po kiek obuolių tektų į kiekvieną, jei dėžių būtų ${b}?`,
        atsakymas: String(k / b),
        atsakymasRodymui: `$${k / b}$`,
        sprendimas: `Obuolių iš viso $${k}$; $${k} : ${b} = ${k / b}$.`,
      }),

    // 4. Kokia proporcija
    () =>
      pasirinkimoUzdavinys(naujasId(T21), T21, {
        klausimas: 'Kaip sprendžiamas atvirkštinio proporcingumo uždavinys?',
        variantai: [
          'randama pastovi sandauga ir iš jos dalijama',
          'sudaroma įprasta proporcija',
          'dydžiai sudedami',
          'dydžiai dalijami vienas iš kito',
        ],
        teisingas: 0,
        sprendimas: 'Tiesioginiam proporcingumui pastovus yra dalmuo, atvirkštiniam — sandauga.',
      }),

    // 5. Kiek reikės
    () =>
      uzdavinys(T21, {
        klausimas: `Darbą per ${k / a} valandas atlieka ${a} darbininkai. Kiek darbininkų reikia, kad darbas būtų atliktas per ${k / b} valandas?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${k} : ${k / b} = ${b}$.`,
      }),

    // 6. Maisto atsargos
    () =>
      uzdavinys(T21, {
        klausimas: `Maisto atsargų ${a} žmonėms pakanka ${k / a} dienoms. Kiek dienų tų pačių atsargų pakaktų ${b} žmonėms?`,
        atsakymas: String(k / b),
        atsakymasRodymui: `$${k / b}$`,
        sprendimas: `Atsargos pastovios: $${k} : ${b} = ${k / b}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T21), T21, {
        klausimas: `Uždaviniui „${a} darbininkai dirba ${k / a} h; per kiek dirbs ${b}?“ mokinys sudarė proporciją $\\dfrac{${a}}{${k / a}} = \\dfrac{${b}}{x}$. Kodėl tai klaida?`,
        variantai: [
          'nes dydžiai atvirkščiai proporcingi — pastovi yra sandauga, o ne dalmuo',
          'nes skaičiai per dideli',
          'nes proporcijos sudaryti negalima',
          'tai nėra klaida',
        ],
        teisingas: 0,
        sprendimas: `Teisinga lygybė yra $${a} \\cdot ${k / a} = ${b} \\cdot x$.`,
      }),
  ])
}
