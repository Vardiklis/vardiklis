import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys } from './formatai'
import { proporcingumoGrafikas } from './sestokams-vaizdai'
import { VARDAI } from './ketvirtokams-bendra'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 8 klasės temos „Finansiniai skaičiavimai“ ir „Reiškiniai“ — keturiolika
 * potemių.
 *
 * Programoje reiškinių temoje yra ir potemė „Dvinario kvadrato išskyrimas“,
 * kurios turinio apraše nėra; ji čia priklauso, nes yra atvirkštinis veiksmas
 * greitosios daugybos formulei.
 *
 * Pinigai visur skaičiuojami centais, o kablelis įrašomas tik rodant —
 * antraip valiutų kurso uždavinys duotų atsakymą $17{,}850000000000003$.
 */

/** Centai → eurų užrašas. */
function eur(centai: number): string {
  const zenklas = centai < 0 ? '-' : ''
  const a = Math.abs(Math.round(centai))
  return `${zenklas}${Math.floor(a / 100)}{,}${String(a % 100).padStart(2, '0')}`
}

function eurAts(centai: number): string {
  return (Math.round(centai) / 100).toFixed(2)
}

const RAIDES = ['a', 'b', 'x', 'y', 'm', 'n'] as const

/** Nario užrašas: 1x → x. */
function narys(k: number, r: string, laipsnis = 1): string {
  const kintamasis = laipsnis === 1 ? r : `${r}^{${laipsnis}}`
  if (k === 1) return kintamasis
  if (k === -1) return `-${kintamasis}`
  return `${k}${kintamasis}`
}

// ── 3.1. Valiutų kursai ─────────────────────────────────────────────────────

const T1 = 'valiutu-kursai'

const A_VALIUTOS = [
  {
    klausimas: '1 Eur = 4 zlotai. Kiek zlotų gausime už 25 Eur?',
    atsakymas: '100',
    atsakymasRodymui: '$100$',
    sprendimas: '$25 \\cdot 4 = 100$.',
  },
] as const

export const valiutuKursai: Generatorius = () => suBandymais(kurkValiutas, A_VALIUTOS, T1)

function kurkValiutas(): Uzdavinys | null {
  const kursas = pasirink([2, 4, 5, 8, 10])
  const eurai = atsitiktinis(5, 90)

  return variacija([
    // 1. Iš eurų į kitą valiutą
    () =>
      uzdavinys(T1, {
        klausimas: `Kursas: $1$ Eur $= ${kursas}$ zlotai. Kiek zlotų gausime už ${eurai} Eur?`,
        atsakymas: String(eurai * kursas),
        atsakymasRodymui: `$${eurai * kursas}$`,
        sprendimas: `$${eurai} \\cdot ${kursas} = ${eurai * kursas}$.`,
      }),

    // 2. Iš kitos valiutos į eurus
    () =>
      uzdavinys(T1, {
        klausimas: `Kursas: $1$ Eur $= ${kursas}$ zlotai. Kiek eurų gausime už ${eurai * kursas} zlotų?`,
        atsakymas: String(eurai),
        atsakymasRodymui: `$${eurai}$ Eur`,
        sprendimas: `$${eurai * kursas} : ${kursas} = ${eurai}$.`,
      }),

    // 3. Ką rodo kursas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ką rodo valiutos kursas?',
        variantai: [
          'kiek vienos valiutos vienetų atitinka kitos valiutos vienetą',
          'kiek pinigų yra banke',
          'kiek procentų kainuoja keitimas',
          'kiek valiutų yra pasaulyje',
        ],
        teisingas: 0,
        sprendimas: 'Todėl keičiant iš vienos valiutos į kitą dauginama arba dalijama iš kurso.',
      }),

    // 4. Kuris pirkinys pigesnis
    () => {
      const kainaEur = atsitiktinis(10, 60) * 100
      const kainaKita = kainaEur * kursas + atsitiktinis(100, 900)
      return uzdavinys(T1, {
        klausimas: `Kursas: $1$ Eur $= ${kursas}$ zlotai. Prekė Lietuvoje kainuoja $${eur(kainaEur)}$ Eur, o Lenkijoje $${eur(kainaKita)}$ zloto. Kur ji pigesnė? Užrašyk kainą eurais toje šalyje.`,
        atsakymas: eurAts(kainaEur),
        atsakymasRodymui: `$${eur(kainaEur)}$ Eur`,
        sprendimas: `$${eur(kainaKita)}$ zloto $= ${eur(kainaKita / kursas)}$ Eur, o tai daugiau nei $${eur(kainaEur)}$.`,
      })
    },

    // 5. Keitimas su mokesčiu
    () => {
      const proc = pasirink([1, 2, 5])
      const suma = atsitiktinis(10, 80) * 100
      const mokestis = (suma * proc) / 100
      if (mokestis % 1 !== 0) return null
      return uzdavinys(T1, {
        klausimas: `Keičiant $${eur(suma)}$ Eur imamas $${proc}\\%$ mokestis. Kiek eurų sudaro mokestis?`,
        atsakymas: eurAts(mokestis),
        atsakymasRodymui: `$${eur(mokestis)}$ Eur`,
        sprendimas: `$${eur(suma)} : 100 \\cdot ${proc} = ${eur(mokestis)}$.`,
      })
    },

    // 6. Atvirkštinis kursas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Jei $1$ Eur $= ${kursas}$ zlotai, tai kiek eurų vertas vienas zlotas?`,
        variantai: [
          `$\\dfrac{1}{${kursas}}$ Eur`,
          `$${kursas}$ Eur`,
          `$${kursas} - 1$ Eur`,
          `$${kursas + 1}$ Eur`,
        ],
        teisingas: 0,
        sprendimas: 'Atvirkštinis kursas gaunamas apverčiant trupmeną.',
      }),

    // 7. Kelionės biudžetas
    () => {
      const vardas = pasirink(VARDAI)
      const turi = atsitiktinis(20, 90)
      return uzdavinys(T1, {
        klausimas: `${vardas} turi ${turi} Eur ir keičia juos zlotais kursu $1$ Eur $= ${kursas}$ zlotai. Kiek zlotų gaus?`,
        atsakymas: String(turi * kursas),
        atsakymasRodymui: `$${turi * kursas}$`,
        sprendimas: `$${turi} \\cdot ${kursas} = ${turi * kursas}$.`,
      })
    },
  ])
}

// ── 3.2. Paprastosios ir sudėtinės palūkanos ────────────────────────────────

const T2 = 'palukanu-rusys'

const A_PALUKANOS = [
  {
    klausimas: 'Kuo sudėtinės palūkanos skiriasi nuo paprastųjų?',
    atsakymas: 'skaiciuojamos nuo isaugusios sumos',
    atsakymasRodymui: 'Jos kasmet skaičiuojamos nuo išaugusios sumos',
    sprendimas: 'Paprastosios visada skaičiuojamos nuo pradinės sumos.',
  },
] as const

export const palukanuRusys: Generatorius = () => suBandymais(kurkPalukanas, A_PALUKANOS, T2)

function kurkPalukanas(): Uzdavinys | null {
  const proc = pasirink([5, 10, 20, 25, 50])
  const suma = atsitiktinis(4, 20) * 100
  const perMetus = (suma * proc) / 100
  const poVieneriu = suma + perMetus
  const poDvieju = poVieneriu + (poVieneriu * proc) / 100
  if (poDvieju % 1 !== 0) return null

  return variacija([
    // 1. Paprastosios per kelerius metus
    () => {
      const metai = atsitiktinis(2, 5)
      return uzdavinys(T2, {
        klausimas: `Į banką padėta ${suma} Eur, metinės paprastosios palūkanos $${proc}\\%$. Kiek palūkanų susikaups per ${metai} metus?`,
        atsakymas: String(perMetus * metai),
        atsakymasRodymui: `$${perMetus * metai}$ Eur`,
        sprendimas: `Kasmet po $${perMetus}$ Eur: $${perMetus} \\cdot ${metai} = ${perMetus * metai}$.`,
      })
    },

    // 2. Sudėtinės per dvejus metus
    () =>
      uzdavinys(T2, {
        klausimas: `Į banką padėta ${suma} Eur, metinės sudėtinės palūkanos $${proc}\\%$. Kokia suma bus po dvejų metų?`,
        atsakymas: String(poDvieju),
        atsakymasRodymui: `$${poDvieju}$ Eur`,
        sprendimas: `Po pirmųjų metų $${poVieneriu}$; antraisiais skaičiuojama jau nuo $${poVieneriu}$.`,
      }),

    // 3. Kuo skiriasi
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuo sudėtinės palūkanos skiriasi nuo paprastųjų?',
        variantai: [
          'jos kasmet skaičiuojamos nuo jau išaugusios sumos',
          'jos visada mažesnės',
          'jos skaičiuojamos tik paskoloms',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Todėl per kelerius metus sudėtinės duoda daugiau nei paprastosios.',
      }),

    // 4. Skirtumas
    () => {
      const paprastos = suma + 2 * perMetus
      return uzdavinys(T2, {
        klausimas: `Po dvejų metų sudėtinės palūkanos duoda ${poDvieju} Eur, o paprastosios — ${paprastos} Eur. Kiek eurų skiriasi rezultatai?`,
        atsakymas: String(poDvieju - paprastos),
        atsakymasRodymui: `$${poDvieju - paprastos}$ Eur`,
        sprendimas: 'Skirtumas — tai palūkanos, priskaičiuotos nuo pirmųjų metų palūkanų.',
      })
    },

    // 5. Daugiklis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Iš ko dauginama suma kiekvienais metais, kai sudėtinės palūkanos $${proc}\\%$?`,
        variantai: [
          `$1 + \\dfrac{${proc}}{100}$`,
          `$\\dfrac{${proc}}{100}$`,
          `$${proc}$`,
          `$1 - \\dfrac{${proc}}{100}$`,
        ],
        teisingas: 0,
        sprendimas: 'Prie visos sumos pridedami procentai, tad daugiklis didesnis už vienetą.',
      }),

    // 6. Palūkanų norma
    () =>
      uzdavinys(T2, {
        klausimas: `Nuo ${suma} Eur per metus gauta ${perMetus} Eur palūkanų. Kokia metinė palūkanų norma procentais?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `$${perMetus} : ${suma} \\cdot 100 = ${proc}$.`,
      }),

    // 7. Klaidos radimas
    () => {
      const paprastos = suma + 2 * perMetus
      return uzdavinys(T2, {
        klausimas: `Skaičiuodamas sudėtines palūkanas dvejiems metams mokinys gavo ${paprastos} Eur — antraisiais metais skaičiavo nuo pradinės sumos. Kokia suma teisinga?`,
        atsakymas: String(poDvieju),
        atsakymasRodymui: `$${poDvieju}$ Eur`,
        sprendimas: 'Sudėtinėms palūkanoms antrųjų metų bazė yra jau išaugusi suma.',
      })
    },
  ])
}

// ── 3.3. Paprastosios palūkanos ir grafikai ─────────────────────────────────

const T3 = 'palukanos-ir-grafikai'

const A_GRAFIKAI = [
  {
    klausimas: 'Kokia linija vaizduojamas paprastųjų palūkanų augimas?',
    atsakymas: 'tiese',
    atsakymasRodymui: 'Tiesė',
    sprendimas: 'Kasmet pridedama vienoda suma.',
  },
] as const

export const palukanosIrGrafikai: Generatorius = () => suBandymais(kurkGrafikus, A_GRAFIKAI, T3)

function kurkGrafikus(): Uzdavinys | null {
  const perMetus = pasirink([2, 3, 4, 5, 6])
  const metai = atsitiktinis(3, 5)

  return variacija([
    // 1. Kokia linija
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kokia linija vaizduojamas paprastųjų palūkanų susikaupimas laikui bėgant?',
        variantai: ['tiesė', 'kreivė, kylanti vis staigiau', 'hiperbolė', 'laužtė'],
        teisingas: 0,
        sprendimas: 'Kasmet pridedama ta pati suma, tad augimas tolygus.',
        brezinys: proporcingumoGrafikas(perMetus, 6, metai, { x: 'metai', y: 'Eur' }),
      }),

    // 2. Palūkanos iš grafiko
    () =>
      uzdavinys(T3, {
        klausimas: `Grafike pavaizduota, kiek palūkanų susikaupia per metus. Kiek palūkanų susikaups per ${metai} metus?`,
        atsakymas: String(perMetus * metai),
        atsakymasRodymui: `$${perMetus * metai}$ Eur`,
        sprendimas: `Kasmet po ${perMetus} Eur: $${perMetus} \\cdot ${metai} = ${perMetus * metai}$.`,
        brezinys: proporcingumoGrafikas(perMetus, 6, metai, { x: 'metai', y: 'Eur' }),
      }),

    // 3. Metinės palūkanos iš grafiko
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek eurų palūkanų susikaupia per vienerius metus pagal grafiką?',
        atsakymas: String(perMetus),
        atsakymasRodymui: `$${perMetus}$ Eur`,
        sprendimas: `Iš pažymėto taško: $${perMetus * metai} : ${metai} = ${perMetus}$.`,
        brezinys: proporcingumoGrafikas(perMetus, 6, metai, { x: 'metai', y: 'Eur' }),
      }),

    // 4. Kuo skiriasi sudėtinių grafikas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuo sudėtinių palūkanų grafikas skiriasi nuo paprastųjų?',
        variantai: [
          'jis kyla vis staigiau, nes kasmet pridedama vis daugiau',
          'jis yra tiesė',
          'jis leidžiasi žemyn',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Sudėtinių palūkanų bazė kasmet didėja.',
      }),

    // 5. Per kiek metų
    () => {
      const tikslas = perMetus * atsitiktinis(2, 6)
      return uzdavinys(T3, {
        klausimas: `Kasmet susikaupia ${perMetus} Eur palūkanų. Per kiek metų susikaups ${tikslas} Eur?`,
        atsakymas: String(tikslas / perMetus),
        atsakymasRodymui: `$${tikslas / perMetus}$`,
        sprendimas: `$${tikslas} : ${perMetus} = ${tikslas / perMetus}$.`,
      })
    },

    // 6. Ar grafikas eina per nulį
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kodėl susikaupusių palūkanų grafikas prasideda koordinačių pradžios taške?',
        variantai: [
          'nes praėjus nuliui metų palūkanų dar nėra',
          'nes taip patogiau braižyti',
          'nes palūkanos visada nulinės',
          'nes ašys susikerta',
        ],
        teisingas: 0,
        sprendimas: 'Pradiniu momentu susikaupusi suma lygi nuliui.',
        brezinys: proporcingumoGrafikas(perMetus, 6),
      }),

    // 7. Bendra suma
    () => {
      const pradine = atsitiktinis(2, 20) * 100
      return uzdavinys(T3, {
        klausimas: `Pradinė suma ${pradine} Eur, kasmet susikaupia ${perMetus} Eur palūkanų. Kokia bus bendra suma po ${metai} metų?`,
        atsakymas: String(pradine + perMetus * metai),
        atsakymasRodymui: `$${pradine + perMetus * metai}$ Eur`,
        sprendimas: `$${pradine} + ${perMetus} \\cdot ${metai} = ${pradine + perMetus * metai}$.`,
      })
    },
  ])
}

// ── 3.4. Pirkimas išsimokėtinai ─────────────────────────────────────────────

const T4 = 'pirkimas-issimoketinai'

const A_ISSIMOKETINAI = [
  {
    klausimas: 'Prekė kainuoja 600 Eur. Perkant išsimokėtinai mokama 12 mėnesių po 55 Eur. Kiek permokama?',
    atsakymas: '60',
    atsakymasRodymui: '$60$ Eur',
    sprendimas: '$12 \\cdot 55 = 660$; $660 - 600 = 60$.',
  },
] as const

export const pirkimasIssimoketinai: Generatorius = () => suBandymais(kurkIssimoketinai, A_ISSIMOKETINAI, T4)

function kurkIssimoketinai(): Uzdavinys | null {
  const kaina = atsitiktinis(3, 20) * 100
  const menesiu = pasirink([6, 10, 12, 24])
  const priemoka = pasirink([5, 10, 20])
  const bendra = kaina + (kaina * priemoka) / 100
  if (bendra % menesiu !== 0) return null
  const imoka = bendra / menesiu

  return variacija([
    // 1. Kiek permokama
    () =>
      uzdavinys(T4, {
        klausimas: `Prekė kainuoja ${kaina} Eur. Perkant išsimokėtinai mokama ${menesiu} mėnesių po ${imoka} Eur. Kiek eurų permokama?`,
        atsakymas: String(bendra - kaina),
        atsakymasRodymui: `$${bendra - kaina}$ Eur`,
        sprendimas: `$${menesiu} \\cdot ${imoka} = ${bendra}$; $${bendra} - ${kaina} = ${bendra - kaina}$.`,
      }),

    // 2. Bendra sumokėta suma
    () =>
      uzdavinys(T4, {
        klausimas: `Perkant išsimokėtinai mokama ${menesiu} mėnesių po ${imoka} Eur. Kiek iš viso sumokama?`,
        atsakymas: String(bendra),
        atsakymasRodymui: `$${bendra}$ Eur`,
        sprendimas: `$${menesiu} \\cdot ${imoka} = ${bendra}$.`,
      }),

    // 3. Mėnesio įmoka
    () =>
      uzdavinys(T4, {
        klausimas: `Iš viso sumokama ${bendra} Eur per ${menesiu} mėnesių lygiomis dalimis. Kokia mėnesio įmoka?`,
        atsakymas: String(imoka),
        atsakymasRodymui: `$${imoka}$ Eur`,
        sprendimas: `$${bendra} : ${menesiu} = ${imoka}$.`,
      }),

    // 4. Permoka procentais
    () =>
      uzdavinys(T4, {
        klausimas: `Prekė kainuoja ${kaina} Eur, o išsimokėtinai sumokama ${bendra} Eur. Keliais procentais permokama?`,
        atsakymas: String(priemoka),
        atsakymasRodymui: `$${priemoka}\\%$`,
        sprendimas: `Permoka $${bendra - kaina}$ Eur; $${bendra - kaina} : ${kaina} \\cdot 100 = ${priemoka}$.`,
      }),

    // 5. Į ką atsižvelgti
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Į ką svarbiausia atsižvelgti renkantis pirkimą išsimokėtinai?',
        variantai: [
          'į bendrą sumokamą sumą, o ne tik į mėnesio įmoką',
          'tik į mėnesio įmokos dydį',
          'tik į mėnesių skaičių',
          'į parduotuvės pavadinimą',
        ],
        teisingas: 0,
        sprendimas: 'Mažesnė įmoka dažnai reiškia ilgesnį terminą ir didesnę permoką.',
      }),

    // 6. Su pradiniu įnašu
    () => {
      const inasas = kaina / 4
      if (inasas % 1 !== 0) return null
      const likutis = bendra - inasas
      if (likutis % menesiu !== 0) return null
      return uzdavinys(T4, {
        klausimas: `Prekė kainuoja ${kaina} Eur. Sumokamas ${inasas} Eur pradinis įnašas, o likutis — ${menesiu} mėnesių lygiomis dalimis; iš viso sumokama ${bendra} Eur. Kokia mėnesio įmoka?`,
        atsakymas: String(likutis / menesiu),
        atsakymasRodymui: `$${likutis / menesiu}$ Eur`,
        sprendimas: `$${bendra} - ${inasas} = ${likutis}$; $${likutis} : ${menesiu} = ${likutis / menesiu}$.`,
      })
    },

    // 7. Palyginimas su iškart
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl pirkimas išsimokėtinai paprastai brangesnis nei mokėjimas iš karto?',
        variantai: [
          'nes pardavėjas ima palūkanas arba administravimo mokestį',
          'nes prekė blogesnė',
          'nes mokama daugiau kartų',
          'jis nėra brangesnis',
        ],
        teisingas: 0,
        sprendimas: 'Už galimybę mokėti dalimis mokama papildomai.',
      }),
  ])
}

// ── 3.5. Mažėjančiosios palūkanos ───────────────────────────────────────────

const T5 = 'mazejancios-palukanos'

const A_MAZEJANCIOS = [
  {
    klausimas: 'Kodėl grąžinant paskolą lygiomis dalimis palūkanos kasmet mažėja?',
    atsakymas: 'nes likutis mazeja',
    atsakymasRodymui: 'Nes palūkanos skaičiuojamos nuo mažėjančio likučio',
    sprendimas: 'Kiekvienais metais skola sumažėja, tad ir palūkanos mažesnės.',
  },
] as const

export const mazejanciosPalukanos: Generatorius = () => suBandymais(kurkMazejancias, A_MAZEJANCIOS, T5)

function kurkMazejancias(): Uzdavinys | null {
  const paskola = atsitiktinis(4, 20) * 100
  const metai = pasirink([2, 4, 5])
  if (paskola % metai !== 0) return null
  const dalis = paskola / metai
  const proc = pasirink([5, 10, 20])
  const pirmuMetu = (paskola * proc) / 100
  if (pirmuMetu % 1 !== 0) return null
  const antruMetu = ((paskola - dalis) * proc) / 100
  if (antruMetu % 1 !== 0) return null

  return variacija([
    // 1. Kodėl mažėja
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kodėl grąžinant paskolą lygiomis dalimis palūkanos kasmet mažėja?',
        variantai: [
          'nes jos skaičiuojamos nuo vis mažėjančio skolos likučio',
          'nes bankas kasmet mažina normą',
          'nes įmokos didėja',
          'jos nemažėja',
        ],
        teisingas: 0,
        sprendimas: 'Grąžinus dalį skolos, likutis, nuo kurio skaičiuojama, sumažėja.',
      }),

    // 2. Pirmųjų metų palūkanos
    () =>
      uzdavinys(T5, {
        klausimas: `Paimta ${paskola} Eur paskola su $${proc}\\%$ metinėmis palūkanomis. Kiek palūkanų priskaičiuojama pirmaisiais metais?`,
        atsakymas: String(pirmuMetu),
        atsakymasRodymui: `$${pirmuMetu}$ Eur`,
        sprendimas: `$${paskola} : 100 \\cdot ${proc} = ${pirmuMetu}$.`,
      }),

    // 3. Likutis po pirmųjų metų
    () =>
      uzdavinys(T5, {
        klausimas: `Paskola ${paskola} Eur grąžinama per ${metai} metus lygiomis dalimis. Koks likutis lieka po pirmųjų metų?`,
        atsakymas: String(paskola - dalis),
        atsakymasRodymui: `$${paskola - dalis}$ Eur`,
        sprendimas: `Kasmet grąžinama $${paskola} : ${metai} = ${dalis}$ Eur; $${paskola} - ${dalis} = ${paskola - dalis}$.`,
      }),

    // 4. Antrųjų metų palūkanos
    () =>
      uzdavinys(T5, {
        klausimas: `Paskolos likutis po pirmųjų metų yra ${paskola - dalis} Eur, palūkanos $${proc}\\%$. Kiek palūkanų priskaičiuojama antraisiais metais?`,
        atsakymas: String(antruMetu),
        atsakymasRodymui: `$${antruMetu}$ Eur`,
        sprendimas: `$${paskola - dalis} : 100 \\cdot ${proc} = ${antruMetu}$.`,
      }),

    // 5. Kiek sumažėjo palūkanos
    () =>
      uzdavinys(T5, {
        klausimas: `Pirmaisiais metais palūkanos buvo ${pirmuMetu} Eur, antraisiais — ${antruMetu} Eur. Keliais eurais jos sumažėjo?`,
        atsakymas: String(pirmuMetu - antruMetu),
        atsakymasRodymui: `$${pirmuMetu - antruMetu}$ Eur`,
        sprendimas: `$${pirmuMetu} - ${antruMetu} = ${pirmuMetu - antruMetu}$.`,
      }),

    // 6. Pirmųjų metų įmoka
    () =>
      uzdavinys(T5, {
        klausimas: `Pirmaisiais metais grąžinama ${dalis} Eur skolos ir ${pirmuMetu} Eur palūkanų. Kokia pirmųjų metų įmoka?`,
        atsakymas: String(dalis + pirmuMetu),
        atsakymasRodymui: `$${dalis + pirmuMetu}$ Eur`,
        sprendimas: `$${dalis} + ${pirmuMetu} = ${dalis + pirmuMetu}$.`,
      }),

    // 7. Kaip kinta įmokos
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kaip kinta mėnesio įmokos, kai skola grąžinama lygiomis dalimis, o palūkanos mažėjančiosios?',
        variantai: ['jos mažėja', 'jos didėja', 'jos nesikeičia', 'jos kinta atsitiktinai'],
        teisingas: 0,
        sprendimas: 'Skolos dalis pastovi, o palūkanų dalis kaskart mažesnė.',
      }),
  ])
}

// ── 4.1. Vienanaris ir daugianaris ──────────────────────────────────────────

const T6 = 'vienanaris-daugianaris'

const A_VIENANARIS = [
  {
    klausimas: 'Koks yra vienanario $5x^3$ laipsnis?',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Laipsnis — kintamųjų rodiklių suma.',
  },
] as const

export const vienanarisDaugianaris: Generatorius = () => suBandymais(kurkVienanari, A_VIENANARIS, T6)

function kurkVienanari(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const k = atsitiktinis(2, 12)
  const laipsnis = atsitiktinis(2, 5)

  return variacija([
    // 1. Vienanario laipsnis
    () =>
      uzdavinys(T6, {
        klausimas: `Koks yra vienanario $${k}${r}^{${laipsnis}}$ laipsnis?`,
        atsakymas: String(laipsnis),
        atsakymasRodymui: `$${laipsnis}$`,
        sprendimas: 'Vienanario laipsnis — visų kintamųjų rodiklių suma.',
      }),

    // 2. Koeficientas
    () =>
      uzdavinys(T6, {
        klausimas: `Koks yra vienanario $${k}${r}^{${laipsnis}}$ koeficientas?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: 'Koeficientas — skaitinis daugiklis.',
      }),

    // 3. Kas yra daugianaris
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kas yra daugianaris?',
        variantai: [
          'vienanarių suma',
          'vienanarių sandauga',
          'vienanaris su neigiamu koeficientu',
          'reiškinys su trupmena',
        ],
        teisingas: 0,
        sprendimas: `Pavyzdžiui, $${k}${r}^2 + ${r} - 3$ yra trinaris.`,
      }),

    // 4. Kiek narių
    () =>
      uzdavinys(T6, {
        klausimas: `Kiek narių turi daugianaris $${k}${r}^2 + ${r} - ${k}$?`,
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Nariai atskiriami sudėties ir atimties ženklais.',
      }),

    // 5. Daugianario laipsnis
    () =>
      uzdavinys(T6, {
        klausimas: `Koks yra daugianario $${k}${r}^{${laipsnis}} + ${r}^2 - 5$ laipsnis?`,
        atsakymas: String(laipsnis),
        atsakymasRodymui: `$${laipsnis}$`,
        sprendimas: 'Daugianario laipsnis lygus didžiausiam jo narių laipsniui.',
      }),

    // 6. Dviejų kintamųjų vienanaris
    () => {
      const l2 = atsitiktinis(1, 4)
      return uzdavinys(T6, {
        klausimas: `Koks yra vienanario $${k}a^{${laipsnis}}b^{${l2}}$ laipsnis?`,
        atsakymas: String(laipsnis + l2),
        atsakymasRodymui: `$${laipsnis + l2}$`,
        sprendimas: `Sudedami visų kintamųjų rodikliai: $${laipsnis} + ${l2} = ${laipsnis + l2}$.`,
      })
    },

    // 7. Panašūs vienanariai
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kokie vienanariai vadinami panašiais?',
        variantai: [
          'turintys tą pačią raidinę dalį',
          'turintys tą patį koeficientą',
          'turintys tą patį laipsnį',
          'visi vienanariai yra panašūs',
        ],
        teisingas: 0,
        sprendimas: 'Tik panašius vienanarius galima sutraukti.',
      }),
  ])
}

// ── 4.2. Atskliautimas ──────────────────────────────────────────────────────

const T7 = 'atskliautimas-8'

const A_ATSKLIAUTIMAS = [
  {
    klausimas: 'Užrašyk be skliaustų: $3(2x - 5)$.',
    atsakymas: '6x-15',
    atsakymasRodymui: '$6x - 15$',
    sprendimas: 'Daugiklis dauginamas iš kiekvieno nario.',
  },
] as const

export const atskliautimas8: Generatorius = () => suBandymais(kurkAtskliautima, A_ATSKLIAUTIMAS, T7)

function kurkAtskliautima(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const k = atsitiktinis(2, 9)
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(2, 12)

  return variacija([
    // 1. Skaitinis daugiklis
    () =>
      uzdavinys(T7, {
        klausimas: `Užrašyk be skliaustų: $${k}(${a}${r} - ${b})$. Užrašyk koeficientą prieš $${r}$.`,
        atsakymas: String(k * a),
        atsakymasRodymui: `$${k * a}${r} - ${k * b}$`,
        sprendimas: `$${k} \\cdot ${a} = ${k * a}$, $${k} \\cdot ${b} = ${k * b}$.`,
      }),

    // 2. Neigiamas daugiklis
    () =>
      uzdavinys(T7, {
        klausimas: `Užrašyk be skliaustų: $-${k}(${a}${r} + ${b})$. Užrašyk koeficientą prieš $${r}$.`,
        atsakymas: String(-k * a),
        atsakymasRodymui: `$-${k * a}${r} - ${k * b}$`,
        sprendimas: 'Neigiamas daugiklis pakeičia abiejų narių ženklus.',
      }),

    // 3. Vienanaris kaip daugiklis
    () =>
      uzdavinys(T7, {
        klausimas: `Užrašyk be skliaustų: $${k}${r}(${a}${r} + ${b})$. Koks bus koeficientas prieš $${r}^2$?`,
        atsakymas: String(k * a),
        atsakymasRodymui: `$${k * a}${r}^2 + ${k * b}${r}$`,
        sprendimas: `$${k}${r} \\cdot ${a}${r} = ${k * a}${r}^2$.`,
      }),

    // 4. Minusas prieš skliaustus
    () =>
      uzdavinys(T7, {
        klausimas: `Užrašyk be skliaustų: $-(${a}${r} - ${b})$. Užrašyk laisvąjį narį.`,
        atsakymas: String(b),
        atsakymasRodymui: `$-${a}${r} + ${b}$`,
        sprendimas: 'Minusas prieš skliaustus pakeičia kiekvieno nario ženklą.',
      }),

    // 5. Su sutraukimu
    () => {
      const c = atsitiktinis(1, k * a - 1)
      return uzdavinys(T7, {
        klausimas: `Supaprastink: $${k}(${a}${r} + ${b}) - ${c}${r}$. Užrašyk koeficientą prieš $${r}$.`,
        atsakymas: String(k * a - c),
        atsakymasRodymui: `$${k * a - c}${r} + ${k * b}$`,
        sprendimas: `Atskleidus: $${k * a}${r} + ${k * b} - ${c}${r}$; sutraukus: $${k * a - c}${r} + ${k * b}$.`,
      })
    },

    // 6. Du skliaustai
    () => {
      const c = atsitiktinis(2, 8)
      return uzdavinys(T7, {
        klausimas: `Supaprastink: $${k}(${r} + ${b}) - ${c}(${r} - ${b})$. Užrašyk koeficientą prieš $${r}$.`,
        atsakymas: String(k - c),
        atsakymasRodymui: `$${narys(k - c, r)} + ${(k + c) * b}$`,
        sprendimas: `$${k}${r} + ${k * b} - ${c}${r} + ${c * b}$; sutraukus gaunama $${narys(k - c, r)} + ${(k + c) * b}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Mokinys užrašė $${k}(${a}${r} - ${b}) = ${k * a}${r} - ${b}$. Koks turi būti laisvasis narys?`,
        atsakymas: String(-k * b),
        atsakymasRodymui: `$-${k * b}$`,
        sprendimas: `Daugikliu ${k} dauginami abu skliaustų nariai: $${k} \\cdot ${b} = ${k * b}$.`,
      }),
  ])
}

// ── 4.3. Daugianarių daugyba ────────────────────────────────────────────────

const T8 = 'daugianariu-daugyba'

const A_DAUGYBA = [
  {
    klausimas: 'Sudaugink: $(x + 2)(x + 3)$. Užrašyk laisvąjį narį.',
    atsakymas: '6',
    atsakymasRodymui: '$x^2 + 5x + 6$',
    sprendimas: 'Kiekvienas pirmojo narys dauginamas iš kiekvieno antrojo.',
  },
] as const

export const daugianariuDaugyba: Generatorius = () => suBandymais(kurkDaugyba, A_DAUGYBA, T8)

function kurkDaugyba(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const a = atsitiktinis(1, 9)
  const b = atsitiktinis(1, 9)

  return variacija([
    // 1. Laisvasis narys
    () =>
      uzdavinys(T8, {
        klausimas: `Sudaugink: $(${r} + ${a})(${r} + ${b})$. Užrašyk laisvąjį narį.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${r}^2 + ${a + b}${r} + ${a * b}$`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 2. Koeficientas prie x
    () =>
      uzdavinys(T8, {
        klausimas: `Sudaugink: $(${r} + ${a})(${r} + ${b})$. Užrašyk koeficientą prieš $${r}$.`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$ — sudedami vidiniai ir išoriniai nariai.`,
      }),

    // 3. Su minusu
    () => {
      if (a === b) return null
      return uzdavinys(T8, {
        klausimas: `Sudaugink: $(${r} + ${a})(${r} - ${b})$. Užrašyk koeficientą prieš $${r}$.`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${r}^2 ${a - b < 0 ? '-' : '+'} ${Math.abs(a - b)}${r} - ${a * b}$`,
        sprendimas: `$${a} - ${b} = ${a - b}$, o laisvasis narys $-${a * b}$.`,
      })
    },

    // 4. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kaip dauginami du daugianariai?',
        variantai: [
          'kiekvienas pirmojo narys dauginamas iš kiekvieno antrojo nario',
          'sudauginami tik pirmieji nariai',
          'nariai sudedami',
          'daugianariai bendravardiklinami',
        ],
        teisingas: 0,
        sprendimas: 'Paskui sutraukiami panašieji nariai.',
      }),

    // 5. Kiek narių gaunama
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek sandaugų gaunama sudauginus du dvinarius, dar nesutraukus panašiųjų narių?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: '$2 \\cdot 2 = 4$.',
      }),

    // 6. Su koeficientu
    () => {
      const k = atsitiktinis(2, 5)
      return uzdavinys(T8, {
        klausimas: `Sudaugink: $(${k}${r} + ${a})(${r} + ${b})$. Užrašyk koeficientą prieš $${r}^2$.`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}${r}^2 + ${k * b + a}${r} + ${a * b}$`,
        sprendimas: `$${k}${r} \\cdot ${r} = ${k}${r}^2$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T8, {
        klausimas: `Mokinys užrašė $(${r} + ${a})(${r} + ${b}) = ${r}^2 + ${a * b}$. Koks turi būti koeficientas prieš $${r}$?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: 'Praleisti vidiniai ir išoriniai nariai, kurie duoda vidurinįjį narį.',
      }),
  ])
}

// ── 4.4. Dvinario kėlimas kvadratu ──────────────────────────────────────────

const T9 = 'dvinario-kvadratas'

const A_KVADRATAS = [
  {
    klausimas: 'Pakelk kvadratu: $(x + 3)^2$. Užrašyk laisvąjį narį.',
    atsakymas: '9',
    atsakymasRodymui: '$x^2 + 6x + 9$',
    sprendimas: '$(a+b)^2 = a^2 + 2ab + b^2$.',
  },
] as const

export const dvinarioKvadratas: Generatorius = () => suBandymais(kurkKvadrata, A_KVADRATAS, T9)

function kurkKvadrata(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const b = atsitiktinis(2, 12)
  const k = atsitiktinis(1, 5)

  return variacija([
    // 1. Laisvasis narys
    () =>
      uzdavinys(T9, {
        klausimas: `Pakelk kvadratu: $(${r} + ${b})^2$. Užrašyk laisvąjį narį.`,
        atsakymas: String(b * b),
        atsakymasRodymui: `$${r}^2 + ${2 * b}${r} + ${b * b}$`,
        sprendimas: `$(a+b)^2 = a^2 + 2ab + b^2$; čia $b^2 = ${b * b}$.`,
      }),

    // 2. Vidurinis narys
    () =>
      uzdavinys(T9, {
        klausimas: `Pakelk kvadratu: $(${r} + ${b})^2$. Užrašyk koeficientą prieš $${r}$.`,
        atsakymas: String(2 * b),
        atsakymasRodymui: `$${2 * b}$`,
        sprendimas: `Dvigubinta sandauga: $2 \\cdot ${b} = ${2 * b}$.`,
      }),

    // 3. Skirtumo kvadratas
    () =>
      uzdavinys(T9, {
        klausimas: `Pakelk kvadratu: $(${r} - ${b})^2$. Užrašyk koeficientą prieš $${r}$.`,
        atsakymas: String(-2 * b),
        atsakymasRodymui: `$${r}^2 - ${2 * b}${r} + ${b * b}$`,
        sprendimas: `$(a-b)^2 = a^2 - 2ab + b^2$; vidurinio nario koeficientas $-${2 * b}$.`,
      }),

    // 4. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kokia yra sumos kvadrato formulė?',
        variantai: [
          '$(a+b)^2 = a^2 + 2ab + b^2$',
          '$(a+b)^2 = a^2 + b^2$',
          '$(a+b)^2 = a^2 + ab + b^2$',
          '$(a+b)^2 = 2a + 2b$',
        ],
        teisingas: 0,
        sprendimas: 'Dažniausia klaida — pamiršti dvigubintą sandaugą.',
      }),

    // 5. Su koeficientu
    () =>
      uzdavinys(T9, {
        klausimas: `Pakelk kvadratu: $(${k}${r} + ${b})^2$. Užrašyk koeficientą prieš $${r}^2$.`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}${r}^2 + ${2 * k * b}${r} + ${b * b}$`,
        sprendimas: `$(${k}${r})^2 = ${k * k}${r}^2$.`,
      }),

    // 6. Patogus skaičiavimas
    () => {
      const desimt = pasirink([20, 30, 40, 50])
      const maza = atsitiktinis(1, 5)
      const skaicius = desimt + maza
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok patogiausiu būdu: $${skaicius}^2$.`,
        atsakymas: String(skaicius * skaicius),
        atsakymasRodymui: `$${skaicius * skaicius}$`,
        sprendimas: `$(${desimt} + ${maza})^2 = ${desimt * desimt} + ${2 * desimt * maza} + ${maza * maza} = ${skaicius * skaicius}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Mokinys užrašė $(${r} + ${b})^2 = ${r}^2 + ${b * b}$. Koks turi būti koeficientas prieš $${r}$?`,
        atsakymas: String(2 * b),
        atsakymasRodymui: `$${2 * b}$`,
        sprendimas: 'Pamiršta dvigubinta sandauga $2ab$.',
      }),
  ])
}

// ── 4.5. Dviejų narių sumos dauginimas iš tų narių skirtumo ─────────────────

const T10 = 'sumos-ir-skirtumo-sandauga'

const A_SKIRTUMAS = [
  {
    klausimas: 'Sudaugink: $(x + 4)(x - 4)$. Užrašyk laisvąjį narį.',
    atsakymas: '-16',
    atsakymasRodymui: '$x^2 - 16$',
    sprendimas: '$(a+b)(a-b) = a^2 - b^2$.',
  },
] as const

export const sumosIrSkirtumoSandauga: Generatorius = () => suBandymais(kurkSkirtuma, A_SKIRTUMAS, T10)

function kurkSkirtuma(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const b = atsitiktinis(2, 12)
  const k = atsitiktinis(2, 5)

  return variacija([
    // 1. Laisvasis narys
    () =>
      uzdavinys(T10, {
        klausimas: `Sudaugink: $(${r} + ${b})(${r} - ${b})$. Užrašyk laisvąjį narį.`,
        atsakymas: String(-b * b),
        atsakymasRodymui: `$${r}^2 - ${b * b}$`,
        sprendimas: `$(a+b)(a-b) = a^2 - b^2$; čia $b^2 = ${b * b}$.`,
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kam lygi $(a+b)(a-b)$?',
        variantai: ['$a^2 - b^2$', '$a^2 + b^2$', '$a^2 - 2ab + b^2$', '$a^2 + 2ab + b^2$'],
        teisingas: 0,
        sprendimas: 'Vidiniai ir išoriniai nariai vienas kitą panaikina.',
      }),

    // 3. Kodėl nelieka vidurinio nario
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kodėl sumos ir skirtumo sandaugoje nelieka nario su $x$?',
        variantai: [
          'nes vidiniai ir išoriniai nariai yra priešingi ir vienas kitą panaikina',
          'nes jis pamirštamas',
          'nes koeficientai lygūs nuliui',
          'nes sandauga visada dvinaris',
        ],
        teisingas: 0,
        sprendimas: `$-${b}${r} + ${b}${r} = 0$.`,
      }),

    // 4. Su koeficientu
    () =>
      uzdavinys(T10, {
        klausimas: `Sudaugink: $(${k}${r} + ${b})(${k}${r} - ${b})$. Užrašyk koeficientą prieš $${r}^2$.`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}${r}^2 - ${b * b}$`,
        sprendimas: `$(${k}${r})^2 = ${k * k}${r}^2$.`,
      }),

    // 5. Patogus skaičiavimas
    () => {
      const n = pasirink([20, 30, 40, 50, 60])
      const d = atsitiktinis(1, 4)
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok patogiausiu būdu: $${n + d} \\cdot ${n - d}$.`,
        atsakymas: String((n + d) * (n - d)),
        atsakymasRodymui: `$${(n + d) * (n - d)}$`,
        sprendimas: `$(${n} + ${d})(${n} - ${d}) = ${n * n} - ${d * d} = ${(n + d) * (n - d)}$.`,
      })
    },

    // 6. Skaidymas atgal
    () =>
      uzdavinys(T10, {
        klausimas: `Išskaidyk dauginamaisiais: $${r}^2 - ${b * b}$. Užrašyk skaičių, esantį skliaustuose.`,
        atsakymas: String(b),
        atsakymasRodymui: `$(${r} + ${b})(${r} - ${b})$`,
        sprendimas: `$${b * b} = ${b}^2$, tad tinka skirtumo formulė.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T10, {
        klausimas: `Mokinys užrašė $(${r} + ${b})(${r} - ${b}) = ${r}^2 + ${b * b}$. Koks turi būti laisvasis narys?`,
        atsakymas: String(-b * b),
        atsakymasRodymui: `$-${b * b}$`,
        sprendimas: 'Kvadratų skirtume antrasis narys atimamas.',
      }),
  ])
}

// ── 4.6. Bendrojo dauginamojo iškėlimas prieš skliaustus ────────────────────

const T11 = 'bendrojo-daugiklio-iskelimas'

const A_ISKELIMAS = [
  {
    klausimas: 'Iškelk bendrą dauginamąjį: $6x + 9$. Koks skaičius atsidurs prieš skliaustus?',
    atsakymas: '3',
    atsakymasRodymui: '$3(2x + 3)$',
    sprendimas: 'Didžiausias bendras 6 ir 9 daliklis yra 3.',
  },
] as const

export const bendrojoDaugiklioIskelimas: Generatorius = () => suBandymais(kurkIskelima, A_ISKELIMAS, T11)

function kurkIskelima(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const bendras = atsitiktinis(2, 9)
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(2, 9)

  return variacija([
    // 1. Skaitinis dauginamasis
    () =>
      uzdavinys(T11, {
        klausimas: `Iškelk didžiausią bendrą dauginamąjį: $${bendras * a}${r} + ${bendras * b}$. Koks skaičius atsidurs prieš skliaustus?`,
        atsakymas: String(bendras),
        atsakymasRodymui: `$${bendras}(${a}${r} + ${b})$`,
        sprendimas: `Abu nariai dalūs iš ${bendras}.`,
      }),

    // 2. Kas lieka skliaustuose
    () =>
      uzdavinys(T11, {
        klausimas: `Iškėlus ${bendras} iš reiškinio $${bendras * a}${r} + ${bendras * b}$, koks bus koeficientas prieš $${r}$ skliaustuose?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${bendras * a} : ${bendras} = ${a}$.`,
      }),

    // 3. Su kintamuoju
    () =>
      uzdavinys(T11, {
        klausimas: `Iškelk bendrą dauginamąjį: $${a}${r}^2 + ${b}${r}$. Užrašyk, kas atsiduria prieš skliaustus.`,
        atsakymas: `${r}`,
        atsakymasRodymui: `$${r}(${a}${r} + ${b})$`,
        sprendimas: `Abu nariai turi daugiklį $${r}$.`,
      }),

    // 4. Skaičius ir kintamasis
    () =>
      uzdavinys(T11, {
        klausimas: `Iškelk didžiausią bendrą dauginamąjį: $${bendras * a}${r}^2 + ${bendras * b}${r}$. Koks skaitinis daugiklis atsidurs prieš skliaustus?`,
        atsakymas: String(bendras),
        atsakymasRodymui: `$${bendras}${r}(${a}${r} + ${b})$`,
        sprendimas: `Bendras dauginamasis yra $${bendras}${r}$.`,
      }),

    // 5. Kam naudingas iškėlimas
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kam naudingas bendrojo dauginamojo iškėlimas?',
        variantai: [
          'reiškinys paverčiamas sandauga, kurią lengviau tirti ir prastinti',
          'reiškinys tampa ilgesnis',
          'panaikinami kintamieji',
          'pakeičiami ženklai',
        ],
        teisingas: 0,
        sprendimas: 'Sandaugą galima prilyginti nuliui arba suprastinti.',
      }),

    // 6. Trys nariai
    () => {
      const c = atsitiktinis(2, 9)
      return uzdavinys(T11, {
        klausimas: `Iškelk bendrą dauginamąjį: $${bendras * a}${r} + ${bendras * b} + ${bendras * c}${r}^2$. Koks skaičius atsidurs prieš skliaustus?`,
        atsakymas: String(bendras),
        atsakymasRodymui: `$${bendras}(${a}${r} + ${b} + ${c}${r}^2)$`,
        sprendimas: `Visi trys nariai dalūs iš ${bendras}.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T11, {
        klausimas: `Iškeldamas ${bendras} iš $${bendras * a}${r} + ${bendras * b}$ mokinys skliaustuose paliko $${a}${r} + ${bendras * b}$. Koks turi būti laisvasis narys skliaustuose?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Iš ${bendras} reikia padalyti abu narius: $${bendras * b} : ${bendras} = ${b}$.`,
      }),
  ])
}

// ── 4.7. Skaidymas dauginamaisiais grupavimo būdu ───────────────────────────

const T12 = 'skaidymas-grupavimu'

const A_GRUPAVIMAS = [
  {
    klausimas: 'Išskaidyk grupavimo būdu: $ax + ay + bx + by$. Kas atsiduria pirmuosiuose skliaustuose?',
    atsakymas: 'a+b',
    atsakymasRodymui: '$(a + b)(x + y)$',
    sprendimas: 'Sugrupuojama po du narius ir iškeliamas bendras dauginamasis.',
  },
] as const

export const skaidymasGrupavimu: Generatorius = () => suBandymais(kurkGrupavima, A_GRUPAVIMAS, T12)

function kurkGrupavima(): Uzdavinys | null {
  const a = atsitiktinis(2, 8)
  const b = atsitiktinis(2, 8)
  if (a === b) return null

  return variacija([
    // 1. Klasikinis grupavimas
    () =>
      uzdavinys(T12, {
        klausimas: `Išskaidyk grupavimo būdu: $${a}x + ${a}y + ${b}x + ${b}y$. Koks skaičius yra pirmajame daugiklyje kartu su ${b}?`,
        atsakymas: String(a),
        atsakymasRodymui: `$(${a} + ${b})(x + y)$`,
        sprendimas: `Sugrupavus: $${a}(x + y) + ${b}(x + y) = (${a} + ${b})(x + y)$.`,
      }),

    // 2. Su kintamuoju
    () =>
      uzdavinys(T12, {
        klausimas: `Išskaidyk grupavimo būdu: $x^2 + ${a}x + ${b}x + ${a * b}$. Užrašyk mažesnįjį skaičių, esantį skliaustuose.`,
        atsakymas: String(Math.min(a, b)),
        atsakymasRodymui: `$(x + ${a})(x + ${b})$`,
        sprendimas: `$x(x + ${a}) + ${b}(x + ${a}) = (x + ${a})(x + ${b})$.`,
      }),

    // 3. Kaip grupuojama
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kaip skaidoma dauginamaisiais grupavimo būdu?',
        variantai: [
          'nariai sugrupuojami taip, kad kiekvienoje grupėje būtų bendras dauginamasis',
          'visi nariai sudedami',
          'nariai sukeičiami vietomis',
          'nariai dalijami iš pirmojo',
        ],
        teisingas: 0,
        sprendimas: 'Po iškėlimo visose grupėse turi likti tas pats daugiklis skliaustuose.',
      }),

    // 4. Kiek narių reikia
    () =>
      uzdavinys(T12, {
        klausimas: 'Kiek narių paprastai turi daugianaris, skaidomas grupavimo būdu?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Jie sugrupuojami po du.',
      }),

    // 5. Su minusu
    () =>
      uzdavinys(T12, {
        klausimas: `Išskaidyk: $${a}x - ${a}y + ${b}x - ${b}y$. Koks skaičius yra pirmajame daugiklyje kartu su ${b}?`,
        atsakymas: String(a),
        atsakymasRodymui: `$(${a} + ${b})(x - y)$`,
        sprendimas: `$${a}(x - y) + ${b}(x - y) = (${a} + ${b})(x - y)$.`,
      }),

    // 6. Patikra
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kaip patikrinti, ar teisingai išskaidyta dauginamaisiais?',
        variantai: [
          'sudauginti gautus daugiklius ir palyginti su pradiniu reiškiniu',
          'įrašyti nulį',
          'suskaičiuoti narius',
          'patikrinti negalima',
        ],
        teisingas: 0,
        sprendimas: 'Daugyba yra atvirkštinis skaidymo veiksmas.',
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Grupuodamas $${a}x + ${b}y + ${a}y + ${b}x$ mokinys sugrupavo pirmuosius du narius. Kodėl taip nepavyksta?`,
        variantai: [
          `nes $${a}x$ ir $${b}y$ neturi bendro dauginamojo`,
          'nes narių per daug',
          'nes ženklai skirtingi',
          'iš tikrųjų pavyksta',
        ],
        teisingas: 0,
        sprendimas: `Reikia grupuoti $${a}x + ${a}y$ ir $${b}x + ${b}y$.`,
      }),
  ])
}

// ── 4.8. Skaidymas taikant greitosios daugybos formules ─────────────────────

const T13 = 'skaidymas-formulemis'

const A_FORMULES = [
  {
    klausimas: 'Išskaidyk dauginamaisiais: $x^2 - 25$. Užrašyk skaičių, esantį skliaustuose.',
    atsakymas: '5',
    atsakymasRodymui: '$(x + 5)(x - 5)$',
    sprendimas: '$25 = 5^2$, tad tinka kvadratų skirtumo formulė.',
  },
] as const

export const skaidymasFormulemis: Generatorius = () => suBandymais(kurkFormules, A_FORMULES, T13)

function kurkFormules(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const b = atsitiktinis(2, 12)
  const k = atsitiktinis(2, 5)

  return variacija([
    // 1. Kvadratų skirtumas
    () =>
      uzdavinys(T13, {
        klausimas: `Išskaidyk dauginamaisiais: $${r}^2 - ${b * b}$. Užrašyk skaičių, esantį skliaustuose.`,
        atsakymas: String(b),
        atsakymasRodymui: `$(${r} + ${b})(${r} - ${b})$`,
        sprendimas: `$${b * b} = ${b}^2$, tad tinka formulė $a^2 - b^2 = (a+b)(a-b)$.`,
      }),

    // 2. Sumos kvadratas
    () =>
      uzdavinys(T13, {
        klausimas: `Išskaidyk dauginamaisiais: $${r}^2 + ${2 * b}${r} + ${b * b}$. Užrašyk skaičių, esantį skliaustuose.`,
        atsakymas: String(b),
        atsakymasRodymui: `$(${r} + ${b})^2$`,
        sprendimas: `$${2 * b} = 2 \\cdot ${b}$ ir $${b * b} = ${b}^2$, tad tai sumos kvadratas.`,
      }),

    // 3. Skirtumo kvadratas
    () =>
      uzdavinys(T13, {
        klausimas: `Išskaidyk dauginamaisiais: $${r}^2 - ${2 * b}${r} + ${b * b}$. Užrašyk skaičių, esantį skliaustuose.`,
        atsakymas: String(b),
        atsakymasRodymui: `$(${r} - ${b})^2$`,
        sprendimas: 'Tai skirtumo kvadratas $(a-b)^2$.',
      }),

    // 4. Kuri formulė tinka
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Kuri formulė tinka reiškiniui $${r}^2 - ${b * b}$?`,
        variantai: [
          'kvadratų skirtumas',
          'sumos kvadratas',
          'skirtumo kvadratas',
          'jokia formulė netinka',
        ],
        teisingas: 0,
        sprendimas: 'Tarp dviejų kvadratų yra minusas, o vidurinio nario nėra.',
      }),

    // 5. Su koeficientu
    () =>
      uzdavinys(T13, {
        klausimas: `Išskaidyk dauginamaisiais: $${k * k}${r}^2 - ${b * b}$. Koks koeficientas bus prieš $${r}$ skliaustuose?`,
        atsakymas: String(k),
        atsakymasRodymui: `$(${k}${r} + ${b})(${k}${r} - ${b})$`,
        sprendimas: `$${k * k}${r}^2 = (${k}${r})^2$.`,
      }),

    // 6. Skaitinis pavyzdys
    () => {
      const n = pasirink([21, 31, 41, 51, 61])
      return uzdavinys(T13, {
        klausimas: `Apskaičiuok taikydamas formulę: $${n}^2 - ${n - 2}^2$.`,
        atsakymas: String(n * n - (n - 2) * (n - 2)),
        atsakymasRodymui: `$${n * n - (n - 2) * (n - 2)}$`,
        sprendimas: `$(${n} + ${n - 2})(${n} - ${n - 2}) = ${2 * n - 2} \\cdot 2 = ${n * n - (n - 2) * (n - 2)}$.`,
      })
    },

    // 7. Ar galima skaidyti sumą
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Ar reiškinį $${r}^2 + ${b * b}$ galima išskaidyti dauginamaisiais?`,
        variantai: [
          'ne, kvadratų sumos skaidymo formulės nėra',
          'taip, kaip kvadratų skirtumą',
          'taip, kaip sumos kvadratą',
          'taip, iškeliant bendrą dauginamąjį',
        ],
        teisingas: 0,
        sprendimas: 'Formulė yra tik kvadratų skirtumui.',
      }),
  ])
}

// ── Dvinario kvadrato išskyrimas (programos potemė) ─────────────────────────

const T14 = 'dvinario-kvadrato-isskyrimas'

const A_ISSKYRIMAS = [
  {
    klausimas: 'Reiškinyje $x^2 + 6x + 11$ išskirk dvinario kvadratą. Koks skaičius bus skliaustuose?',
    atsakymas: '3',
    atsakymasRodymui: '$(x + 3)^2 + 2$',
    sprendimas: 'Pusė koeficiento prieš $x$ yra 3.',
  },
] as const

export const dvinarioKvadratoIsskyrimas: Generatorius = () => suBandymais(kurkIsskyrima, A_ISSKYRIMAS, T14)

function kurkIsskyrima(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const b = atsitiktinis(1, 9)
  const likutis = atsitiktinis(1, 15)
  const laisvasis = b * b + likutis

  return variacija([
    // 1. Koks skaičius skliaustuose
    () =>
      uzdavinys(T14, {
        klausimas: `Reiškinyje $${r}^2 + ${2 * b}${r} + ${laisvasis}$ išskirk dvinario kvadratą. Koks skaičius bus skliaustuose?`,
        atsakymas: String(b),
        atsakymasRodymui: `$(${r} + ${b})^2 + ${likutis}$`,
        sprendimas: `Pusė koeficiento prieš $${r}$ yra $${2 * b} : 2 = ${b}$.`,
      }),

    // 2. Kas lieka už skliaustų
    () =>
      uzdavinys(T14, {
        klausimas: `Reiškinyje $${r}^2 + ${2 * b}${r} + ${laisvasis}$ išskyrus dvinario kvadratą, koks skaičius lieka už skliaustų?`,
        atsakymas: String(likutis),
        atsakymasRodymui: `$${likutis}$`,
        sprendimas: `$${laisvasis} - ${b * b} = ${likutis}$.`,
      }),

    // 3. Kaip randamas skaičius
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kaip randamas skaičius, kuris rašomas skliaustuose išskiriant dvinario kvadratą?',
        variantai: [
          'imama pusė koeficiento prieš $x$',
          'imamas visas koeficientas prieš $x$',
          'traukiama šaknis iš laisvojo nario',
          'imamas laisvasis narys',
        ],
        teisingas: 0,
        sprendimas: `Nes $(x + b)^2$ vidurinis narys yra $2bx$.`,
      }),

    // 4. Kiek reikia pridėti
    () =>
      uzdavinys(T14, {
        klausimas: `Kiek reikia pridėti prie $${r}^2 + ${2 * b}${r}$, kad gautųsi pilnas dvinario kvadratas?`,
        atsakymas: String(b * b),
        atsakymasRodymui: `$${b * b}$`,
        sprendimas: `$\\left(\\dfrac{${2 * b}}{2}\\right)^2 = ${b * b}$.`,
      }),

    // 5. Su skirtumu
    () =>
      uzdavinys(T14, {
        klausimas: `Reiškinyje $${r}^2 - ${2 * b}${r} + ${laisvasis}$ išskirk dvinario kvadratą. Koks skaičius bus skliaustuose?`,
        atsakymas: String(-b),
        atsakymasRodymui: `$(${r} - ${b})^2 + ${likutis}$`,
        sprendimas: `Vidurinio nario ženklas minusas, tad skliaustuose $-${b}$.`,
      }),

    // 6. Mažiausia reikšmė
    () =>
      uzdavinys(T14, {
        klausimas: `Kokia mažiausia reiškinio $${r}^2 + ${2 * b}${r} + ${laisvasis}$ reikšmė?`,
        atsakymas: String(likutis),
        atsakymasRodymui: `$${likutis}$`,
        sprendimas: `$(${r} + ${b})^2 + ${likutis}$; kvadratas mažiausias, kai lygus nuliui, tad lieka $${likutis}$.`,
      }),

    // 7. Kam naudinga
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kam naudinga išskirti dvinario kvadratą?',
        variantai: [
          'galima rasti mažiausią arba didžiausią reiškinio reikšmę',
          'reiškinys tampa trumpesnis',
          'panaikinamas kintamasis',
          'pakeičiami ženklai',
        ],
        teisingas: 0,
        sprendimas: 'Kvadratas niekada nėra neigiamas, tad likutis ir yra kraštutinė reikšmė.',
      }),
  ])
}
