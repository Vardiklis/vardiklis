import { atsitiktinis, naujasId, pasirink, suprastink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { linijineDiagrama } from './ketvirtokams-duomenu-vaizdai'
import { kauliukas, maiselis, moneta } from './ketvirtokams-duomenu-vaizdai'
import { daznuLentele, galimybiuLentele, galimybiuMedis, stulpelineDiagrama } from './sestokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 6 klasės temos „Duomenys“ ir „Tikimybės“ — dvylika potemių.
 *
 * Vidurkis, mediana ir moda turi atskirus generatorius, nes tai trys
 * skirtingi imties centro matai, o mokinys dažniausiai painioja būtent juos.
 * Medianos uždaviniuose imtis visada nelyginio dydžio arba su aiškiu viduriu,
 * o modos — su vienintele dažniausia reikšme, kad atsakymas būtų vienas.
 */

const DALYKAI = ['pirm', 'antr', 'treč', 'ketv', 'penk'] as const

/** Rinkinys, kurio suma dalijasi iš kiekio be liekanos. */
function rinkinysSuVidurkiu(kiek: number, vidurkis: number): number[] {
  const sk: number[] = []
  let likutis = kiek * vidurkis
  for (let i = 0; i < kiek - 1; i += 1) {
    const maks = Math.min(vidurkis * 2, likutis - (kiek - i - 1))
    const min = Math.max(1, likutis - (kiek - i - 1) * vidurkis * 2)
    if (min > maks) return []
    const x = atsitiktinis(min, maks)
    sk.push(x)
    likutis -= x
  }
  if (likutis < 1) return []
  sk.push(likutis)
  return sk
}

/** Imtis su vienintele dažniausia reikšme. */
function imtisSuModa(): { reiksmes: number[]; moda: number } | null {
  const moda = atsitiktinis(2, 9)
  const kiti = [moda - 1, moda + 1, moda + 2].filter((x) => x > 0 && x !== moda)
  if (kiti.length < 3) return null
  const reiksmes = [moda, moda, moda, kiti[0], kiti[1], kiti[2]]
  return { reiksmes: sumaisyk(reiksmes), moda }
}

// ── 11.1.1. Dažnių lentelė ──────────────────────────────────────────────────

const T1 = 'daznu-lentele'

const A_DAZNIAI = [
  {
    klausimas: 'Ką rodo dažnis dažnių lentelėje?',
    atsakymas: 'kiek kartu pasikartojo reiksme',
    atsakymasRodymui: 'Kiek kartų pasikartojo reikšmė',
    sprendimas: 'Dažnių suma lygi visos imties dydžiui.',
  },
] as const

export const daznuLentele6: Generatorius = () => suBandymais(kurkDaznius, A_DAZNIAI, T1)

function kurkDaznius(): Uzdavinys | null {
  const eilutes = [2, 3, 4, 5].map((v) => ({ vardas: String(v), kiek: atsitiktinis(2, 9) }))
  const viso = eilutes.reduce((s, e) => s + e.kiek, 0)
  const didziausia = eilutes.reduce((a, b) => (a.kiek >= b.kiek ? a : b))

  return variacija([
    // 1. Imties dydis
    () =>
      uzdavinys(T1, {
        klausimas: 'Koks yra imties dydis pagal dažnių lentelę?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `Sudedami visi dažniai: $${eilutes.map((e) => e.kiek).join(' + ')} = ${viso}$.`,
        brezinys: daznuLentele(eilutes),
      }),

    // 2. Ką rodo dažnis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ką rodo dažnis dažnių lentelėje?',
        variantai: [
          'kiek kartų imtyje pasikartojo ta reikšmė',
          'pačią reikšmę',
          'reikšmių sumą',
          'imties vidurkį',
        ],
        teisingas: 0,
        sprendimas: 'Dažnių suma lygi visos imties dydžiui.',
      }),

    // 3. Dažniausia reikšmė
    () =>
      uzdavinys(T1, {
        klausimas: 'Kuri reikšmė lentelėje pasikartoja dažniausiai?',
        atsakymas: didziausia.vardas,
        atsakymasRodymui: `$${didziausia.vardas}$`,
        sprendimas: `Didžiausias dažnis yra ${didziausia.kiek}.`,
        brezinys: daznuLentele(eilutes),
      }),

    // 4. Trūkstamas dažnis
    () => {
      const slepiamas = atsitiktinis(0, eilutes.length - 1)
      return uzdavinys(T1, {
        klausimas: `Imties dydis yra ${viso}. Koks dažnis paslėptas lentelėje?`,
        atsakymas: String(eilutes[slepiamas].kiek),
        atsakymasRodymui: `$${eilutes[slepiamas].kiek}$`,
        sprendimas: `Iš imties dydžio atimami žinomi dažniai: $${viso} - ${eilutes.filter((_, i) => i !== slepiamas).map((e) => e.kiek).join(' - ')} = ${eilutes[slepiamas].kiek}$.`,
        brezinys: daznuLentele(eilutes, slepiamas),
      })
    },

    // 5. Dažnių suma
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kam lygi visų dažnių suma?',
        variantai: ['imties dydžiui', 'imties vidurkiui', 'didžiausiai reikšmei', 'reikšmių skaičiui'],
        teisingas: 0,
        sprendimas: 'Kiekvienas imties narys suskaičiuojamas vieną kartą.',
      }),

    // 6. Kiek kartų reikšmė pasitaikė
    () => {
      const kuri = atsitiktinis(0, eilutes.length - 1)
      return uzdavinys(T1, {
        klausimas: `Kiek kartų imtyje pasitaikė reikšmė ${eilutes[kuri].vardas}?`,
        atsakymas: String(eilutes[kuri].kiek),
        atsakymasRodymui: `$${eilutes[kuri].kiek}$`,
        sprendimas: 'Skaitomas atitinkamas lentelės langelis.',
        brezinys: daznuLentele(eilutes),
      })
    },

    // 7. Santykinis dažnis
    () => {
      const kuri = atsitiktinis(0, eilutes.length - 1)
      const t = suprastink(eilutes[kuri].kiek, viso)
      if (t.vardiklis > 20) return null
      return uzdavinys(T1, {
        klausimas: `Kokią visos imties dalį sudaro reikšmė ${eilutes[kuri].vardas}? Užrašyk suprastinta trupmena.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$\\dfrac{${t.skaitiklis}}{${t.vardiklis}}$`,
        sprendimas: `$\\dfrac{${eilutes[kuri].kiek}}{${viso}} = \\dfrac{${t.skaitiklis}}{${t.vardiklis}}$.`,
        brezinys: daznuLentele(eilutes),
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: 'Mokinys imties dydžiu pavadino skirtingų reikšmių skaičių lentelėje, t. y. 4. Koks yra tikrasis imties dydis?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: 'Imties dydis yra dažnių suma, o ne stulpelių skaičius.',
        brezinys: daznuLentele(eilutes),
      }),
  ])
}

// ── 11.1.2. Stulpelinė diagrama ─────────────────────────────────────────────

const T2 = 'stulpeline-diagrama-6'

const A_STULPELINE = [
  {
    klausimas: 'Ką rodo stulpelio aukštis stulpelinėje diagramoje?',
    atsakymas: 'reiksmes dydi',
    atsakymasRodymui: 'Reikšmės dydį',
    sprendimas: 'Aukštis nuskaitomas nuo vertikaliosios ašies.',
  },
] as const

export const stulpelineDiagrama6: Generatorius = () => suBandymais(kurkStulpeline, A_STULPELINE, T2)

function kurkStulpeline(): Uzdavinys | null {
  const eilutes = DALYKAI.slice(0, 4).map((d) => ({ vardas: d, kiek: atsitiktinis(3, 20) }))
  const viso = eilutes.reduce((s, e) => s + e.kiek, 0)
  const didziausias = eilutes.reduce((a, b) => (a.kiek >= b.kiek ? a : b))
  const maziausias = eilutes.reduce((a, b) => (a.kiek <= b.kiek ? a : b))
  if (didziausias.kiek === maziausias.kiek) return null

  return variacija([
    // 1. Didžiausia reikšmė
    () =>
      uzdavinys(T2, {
        klausimas: 'Kokia yra didžiausia diagramoje pavaizduota reikšmė?',
        atsakymas: String(didziausias.kiek),
        atsakymasRodymui: `$${didziausias.kiek}$`,
        sprendimas: 'Ieškomas aukščiausias stulpelis.',
        brezinys: stulpelineDiagrama(eilutes),
      }),

    // 2. Ką rodo aukštis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ką rodo stulpelio aukštis stulpelinėje diagramoje?',
        variantai: ['reikšmės dydį', 'reikšmių skaičių', 'diagramos plotį', 'vidurkį'],
        teisingas: 0,
        sprendimas: 'Aukštis nuskaitomas nuo vertikaliosios ašies padalų.',
      }),

    // 3. Skirtumas tarp stulpelių
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek didžiausia diagramos reikšmė didesnė už mažiausią?',
        atsakymas: String(didziausias.kiek - maziausias.kiek),
        atsakymasRodymui: `$${didziausias.kiek - maziausias.kiek}$`,
        sprendimas: `$${didziausias.kiek} - ${maziausias.kiek} = ${didziausias.kiek - maziausias.kiek}$.`,
        brezinys: stulpelineDiagrama(eilutes),
      }),

    // 4. Bendra suma
    () =>
      uzdavinys(T2, {
        klausimas: 'Kokia yra visų diagramoje pavaizduotų reikšmių suma?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${eilutes.map((e) => e.kiek).join(' + ')} = ${viso}$.`,
        brezinys: stulpelineDiagrama(eilutes),
      }),

    // 5. Konkretaus stulpelio reikšmė
    () => {
      const kuris = atsitiktinis(0, eilutes.length - 1)
      return uzdavinys(T2, {
        klausimas: `Kokia reikšmė atitinka stulpelį „${eilutes[kuris].vardas}“?`,
        atsakymas: String(eilutes[kuris].kiek),
        atsakymasRodymui: `$${eilutes[kuris].kiek}$`,
        sprendimas: 'Nuo stulpelio viršaus einama iki vertikaliosios ašies.',
        brezinys: stulpelineDiagrama(eilutes),
      })
    },

    // 6. Kada patogi stulpelinė
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kada patogiausia rinktis stulpelinę diagramą?',
        variantai: [
          'kai lyginami atskirų grupių dydžiai',
          'kai rodoma, kaip dydis kinta laike',
          'kai rodoma visumos dalis',
          'kai duomenų nėra',
        ],
        teisingas: 0,
        sprendimas: 'Stulpelių aukščius lengva palyginti tarpusavyje.',
      }),

    // 7. Vidurkis iš diagramos
    () => {
      if (viso % eilutes.length !== 0) return null
      return uzdavinys(T2, {
        klausimas: 'Koks yra diagramoje pavaizduotų reikšmių vidurkis?',
        atsakymas: String(viso / eilutes.length),
        atsakymasRodymui: `$${viso / eilutes.length}$`,
        sprendimas: `$${viso} : ${eilutes.length} = ${viso / eilutes.length}$.`,
        brezinys: stulpelineDiagrama(eilutes),
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kodėl stulpelinės diagramos vertikalioji ašis turi prasidėti nuo nulio?',
        variantai: [
          'nes kitaip stulpelių aukščių santykis atrodo iškraipytas',
          'nes taip gražiau',
          'nes nulis yra mažiausia reikšmė',
          'ji neprivalo prasidėti nuo nulio',
        ],
        teisingas: 0,
        sprendimas: 'Nukirpus ašies apačią mažas skirtumas atrodo didžiulis.',
      }),
  ])
}

// ── 11.1.3. Linijinė diagrama ───────────────────────────────────────────────

const T3 = 'linijine-diagrama-6'

const A_LINIJINE = [
  {
    klausimas: 'Kada patogiausia rinktis linijinę diagramą?',
    atsakymas: 'kai rodoma kaita',
    atsakymasRodymui: 'Kai rodoma, kaip dydis kinta laike',
    sprendimas: 'Linija parodo didėjimą ir mažėjimą.',
  },
] as const

export const linijineDiagrama6: Generatorius = () => suBandymais(kurkLinijine, A_LINIJINE, T3)

function kurkLinijine(): Uzdavinys | null {
  const taskai = DALYKAI.slice(0, 5).map((d) => ({ zyme: d, reiksme: atsitiktinis(4, 24) }))
  const didziausias = taskai.reduce((a, b) => (a.reiksme >= b.reiksme ? a : b))
  const maziausias = taskai.reduce((a, b) => (a.reiksme <= b.reiksme ? a : b))
  if (didziausias.reiksme === maziausias.reiksme) return null

  return variacija([
    // 1. Didžiausia reikšmė
    () =>
      uzdavinys(T3, {
        klausimas: 'Kokia yra didžiausia diagramoje pažymėta reikšmė?',
        atsakymas: String(didziausias.reiksme),
        atsakymasRodymui: `$${didziausias.reiksme}$`,
        sprendimas: 'Ieškomas aukščiausiai esantis taškas.',
        brezinys: linijineDiagrama(taskai),
      }),

    // 2. Kada patogi
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kada patogiausia rinktis linijinę diagramą?',
        variantai: [
          'kai rodoma, kaip dydis kinta laike',
          'kai lyginamos nesusijusios grupės',
          'kai rodoma visumos dalis',
          'kai duomenų tik du',
        ],
        teisingas: 0,
        sprendimas: 'Linija sujungia iš eilės einančius matavimus ir parodo kaitą.',
      }),

    // 3. Mažiausia reikšmė
    () =>
      uzdavinys(T3, {
        klausimas: 'Kokia yra mažiausia diagramoje pažymėta reikšmė?',
        atsakymas: String(maziausias.reiksme),
        atsakymasRodymui: `$${maziausias.reiksme}$`,
        sprendimas: 'Ieškomas žemiausiai esantis taškas.',
        brezinys: linijineDiagrama(taskai),
      }),

    // 4. Pokytis tarp dviejų matavimų
    () => {
      const i = atsitiktinis(0, taskai.length - 2)
      const pokytis = taskai[i + 1].reiksme - taskai[i].reiksme
      if (pokytis === 0) return null
      return uzdavinys(T3, {
        klausimas: `Kiek pasikeitė reikšmė nuo „${taskai[i].zyme}“ iki „${taskai[i + 1].zyme}“? Užrašyk pokytį su ženklu.`,
        atsakymas: String(pokytis),
        atsakymasRodymui: `$${pokytis > 0 ? '+' : ''}${pokytis}$`,
        sprendimas: `$${taskai[i + 1].reiksme} - ${taskai[i].reiksme} = ${pokytis}$.`,
        brezinys: linijineDiagrama(taskai),
      })
    },

    // 5. Kur didėjo
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ką linijinėje diagramoje reiškia kylanti atkarpa?',
        variantai: ['reikšmė padidėjo', 'reikšmė sumažėjo', 'reikšmė nepakito', 'duomenų trūksta'],
        teisingas: 0,
        sprendimas: 'Krintanti atkarpa atitinkamai reiškia sumažėjimą.',
        brezinys: linijineDiagrama(taskai),
      }),

    // 6. Skirtumas tarp kraštutinių
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek skiriasi didžiausia ir mažiausia diagramos reikšmės?',
        atsakymas: String(didziausias.reiksme - maziausias.reiksme),
        atsakymasRodymui: `$${didziausias.reiksme - maziausias.reiksme}$`,
        sprendimas: `$${didziausias.reiksme} - ${maziausias.reiksme} = ${didziausias.reiksme - maziausias.reiksme}$.`,
        brezinys: linijineDiagrama(taskai),
      }),

    // 7. Konkreti reikšmė
    () => {
      const i = atsitiktinis(0, taskai.length - 1)
      return uzdavinys(T3, {
        klausimas: `Kokia reikšmė pažymėta ties „${taskai[i].zyme}“?`,
        atsakymas: String(taskai[i].reiksme),
        atsakymasRodymui: `$${taskai[i].reiksme}$`,
        sprendimas: 'Nuo taško einama horizontaliai iki vertikaliosios ašies.',
        brezinys: linijineDiagrama(taskai),
      })
    },

    // 8. Poros
    () =>
      poruUzdavinys(naujasId(T3), T3, {
        klausimas: 'Sujunk duomenų rūšį su tinkamiausia diagrama.',
        poros: [
          { kaire: 'temperatūra per savaitę', desine: 'linijinė' },
          { kaire: 'mokinių skaičius klasėse', desine: 'stulpelinė' },
          { kaire: 'visumos dalys procentais', desine: 'skritulinė' },
          { kaire: 'reikšmių pasikartojimai', desine: 'dažnių lentelė' },
        ],
        sprendimas: 'Diagrama parenkama pagal tai, ką norima parodyti.',
      }),
  ])
}

// ── 11.2.1. Imties vidurkis ─────────────────────────────────────────────────

const T4 = 'imties-vidurkis-6'

const A_VIDURKIS = [
  {
    klausimas: 'Apskaičiuok skaičių 4, 7, 10 vidurkį.',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: '$(4 + 7 + 10) : 3 = 7$.',
  },
] as const

export const imtiesVidurkis6: Generatorius = () => suBandymais(kurkVidurki, A_VIDURKIS, T4)

function kurkVidurki(): Uzdavinys | null {
  const kiek = atsitiktinis(3, 6)
  const vidurkis = atsitiktinis(4, 20)
  const sk = rinkinysSuVidurkiu(kiek, vidurkis)
  if (sk.length === 0) return null

  return variacija([
    // 1. Vidurkis
    () =>
      uzdavinys(T4, {
        klausimas: `Apskaičiuok skaičių ${sk.join(', ')} vidurkį.`,
        atsakymas: String(vidurkis),
        atsakymasRodymui: `$${vidurkis}$`,
        sprendimas: `Suma $${sk.join(' + ')} = ${kiek * vidurkis}$; $${kiek * vidurkis} : ${kiek} = ${vidurkis}$.`,
      }),

    // 2. Kaip skaičiuojamas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kaip apskaičiuojamas imties vidurkis?',
        variantai: [
          'visų reikšmių suma dalijama iš jų kiekio',
          'randama vidurinė reikšmė',
          'randama dažniausia reikšmė',
          'iš didžiausios atimama mažiausia',
        ],
        teisingas: 0,
        sprendimas: 'Vidurkis rodo, po kiek tektų kiekvienam padalijus po lygiai.',
      }),

    // 3. Suma iš vidurkio
    () =>
      uzdavinys(T4, {
        klausimas: `${kiek} skaičių vidurkis yra ${vidurkis}. Kokia jų suma?`,
        atsakymas: String(kiek * vidurkis),
        atsakymasRodymui: `$${kiek * vidurkis}$`,
        sprendimas: `$${vidurkis} \\cdot ${kiek} = ${kiek * vidurkis}$.`,
      }),

    // 4. Trūkstama reikšmė
    () => {
      const be = sk.slice(0, -1)
      return uzdavinys(T4, {
        klausimas: `${kiek} skaičių vidurkis yra ${vidurkis}. Žinomi ${kiek - 1}: ${be.join(', ')}. Koks paskutinis skaičius?`,
        atsakymas: String(sk[sk.length - 1]),
        atsakymasRodymui: `$${sk[sk.length - 1]}$`,
        sprendimas: `Visa suma $${kiek * vidurkis}$; $${kiek * vidurkis} - ${be.reduce((s, x) => s + x, 0)} = ${sk[sk.length - 1]}$.`,
      })
    },

    // 5. Ar gali viršyti kraštutines
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ar vidurkis gali būti didesnis už didžiausią imties reikšmę?',
        variantai: [
          'ne, jis visada tarp mažiausios ir didžiausios reikšmės',
          'taip, jei reikšmių daug',
          'taip, jei imtis maža',
          'taip, jei visos reikšmės lygios',
        ],
        teisingas: 0,
        sprendimas: 'Vidurkis yra tolygiai paskirstytas dydis, tad už kraštines reikšmes neišeina.',
      }),

    // 6. Vidurkis su neigiamais
    () => {
      const a = -atsitiktinis(2, 10)
      const b = atsitiktinis(2, 10)
      const c = -a - b
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok skaičių $${a}$, $${b}$, $${c}$ vidurkį.`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: `Suma lygi nuliui, tad ir vidurkis lygus nuliui.`,
      })
    },

    // 7. Tekstinis
    () =>
      uzdavinys(T4, {
        klausimas: `Per ${kiek} dienas parduota ${sk.join(', ')} bilietai. Kiek bilietų vidutiniškai parduodama per dieną?`,
        atsakymas: String(vidurkis),
        atsakymasRodymui: `$${vidurkis}$`,
        sprendimas: `$${kiek * vidurkis} : ${kiek} = ${vidurkis}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Skaičiuodamas ${kiek} skaičių vidurkį mokinys sumą padalijo iš ${kiek - 1}. Iš kokio skaičiaus reikėjo dalyti?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: 'Dalijama iš reikšmių kiekio, o ne iš kiekio be vieneto.',
      }),
  ])
}

// ── 11.2.2. Imties mediana ──────────────────────────────────────────────────

const T5 = 'imties-mediana'

const A_MEDIANA = [
  {
    klausimas: 'Rask imties 3, 7, 9, 12, 15 medianą.',
    atsakymas: '9',
    atsakymasRodymui: '$9$',
    sprendimas: 'Surikiavus mediana yra vidurinė reikšmė.',
  },
] as const

export const imtiesMediana: Generatorius = () => suBandymais(kurkMediana, A_MEDIANA, T5)

function kurkMediana(): Uzdavinys | null {
  const kiek = pasirink([5, 7])
  const reiksmes = sumaisyk(
    Array.from({ length: kiek }, (_, i) => atsitiktinis(2 + i * 3, 4 + i * 3)),
  )
  const surikiuotos = [...reiksmes].sort((a, b) => a - b)
  const mediana = surikiuotos[(kiek - 1) / 2]

  return variacija([
    // 1. Mediana nelyginėje imtyje
    () =>
      uzdavinys(T5, {
        klausimas: `Rask imties ${reiksmes.join(', ')} medianą.`,
        atsakymas: String(mediana),
        atsakymasRodymui: `$${mediana}$`,
        sprendimas: `Surikiavus: ${surikiuotos.join(', ')}. Vidurinė reikšmė yra $${mediana}$.`,
      }),

    // 2. Kas yra mediana
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kas yra imties mediana?',
        variantai: [
          'vidurinė reikšmė, kai imtis surikiuota',
          'reikšmių vidurkis',
          'dažniausia reikšmė',
          'didžiausios ir mažiausios reikšmių skirtumas',
        ],
        teisingas: 0,
        sprendimas: 'Prieš ieškant medianos imtį būtina surikiuoti.',
      }),

    // 3. Pirmas žingsnis
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Ką reikia padaryti pirmiausia, ieškant medianos?',
        variantai: [
          'surikiuoti imties reikšmes didėjimo tvarka',
          'sudėti visas reikšmes',
          'rasti dažniausią reikšmę',
          'padalyti iš reikšmių kiekio',
        ],
        teisingas: 0,
        sprendimas: 'Nesurikiavus vidurinė reikšmė būtų atsitiktinė.',
      }),

    // 4. Mediana lyginėje imtyje
    () => {
      const a = atsitiktinis(2, 8)
      const b = a + 2
      const c = b + 2
      const d = c + 2
      return uzdavinys(T5, {
        klausimas: `Rask imties ${a}, ${b}, ${c}, ${d} medianą.`,
        atsakymas: String((b + c) / 2),
        atsakymasRodymui: `$${(b + c) / 2}$`,
        sprendimas: `Reikšmių lyginis skaičius, tad mediana yra dviejų vidurinių vidurkis: $(${b} + ${c}) : 2 = ${(b + c) / 2}$.`,
      })
    },

    // 5. Kelinta reikšmė yra mediana
    () =>
      uzdavinys(T5, {
        klausimas: `Imtį sudaro ${kiek} reikšmės. Kelinta iš eilės surikiuota reikšmė yra mediana?`,
        atsakymas: String((kiek + 1) / 2),
        atsakymasRodymui: `$${(kiek + 1) / 2}$`,
        sprendimas: `$(${kiek} + 1) : 2 = ${(kiek + 1) / 2}$.`,
      }),

    // 6. Mediana ir vidurkis skiriasi
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kodėl kartais medianą naudoti geriau nei vidurkį?',
        variantai: [
          'nes vieno labai didelio ar mažo dydžio mediana beveik nepakeičia',
          'nes mediana visada didesnė',
          'nes medianą lengviau apskaičiuoti',
          'nes vidurkio apskaičiuoti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Vieną atlyginimą padidinus dešimt kartų vidurkis šoktels, o mediana liks beveik ta pati.',
      }),

    // 7. Mediana iš surikiuotos imties
    () =>
      uzdavinys(T5, {
        klausimas: `Imtis jau surikiuota: ${surikiuotos.join(', ')}. Kokia jos mediana?`,
        atsakymas: String(mediana),
        atsakymasRodymui: `$${mediana}$`,
        sprendimas: `Vidurinė iš ${kiek} reikšmių yra ${(kiek + 1) / 2}-oji.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Mokinys medianą rado nesurikiavęs imties ${reiksmes.join(', ')} ir nurodė vidurinę pagal eilę reikšmę $${reiksmes[(kiek - 1) / 2]}$. Užrašyk teisingą medianą.`,
        atsakymas: String(mediana),
        atsakymasRodymui: `$${mediana}$`,
        sprendimas: `Surikiavus: ${surikiuotos.join(', ')} — vidurinė reikšmė yra $${mediana}$.`,
      }),
  ])
}

// ── 11.2.3. Imties moda ─────────────────────────────────────────────────────

const T6 = 'imties-moda'

const A_MODA = [
  {
    klausimas: 'Rask imties 3, 5, 5, 7, 9 modą.',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Moda yra dažniausiai pasikartojanti reikšmė.',
  },
] as const

export const imtiesModa: Generatorius = () => suBandymais(kurkModa, A_MODA, T6)

function kurkModa(): Uzdavinys | null {
  const imtis = imtisSuModa()
  if (imtis === null) return null

  return variacija([
    // 1. Moda
    () =>
      uzdavinys(T6, {
        klausimas: `Rask imties ${imtis.reiksmes.join(', ')} modą.`,
        atsakymas: String(imtis.moda),
        atsakymasRodymui: `$${imtis.moda}$`,
        sprendimas: `Reikšmė $${imtis.moda}$ pasikartoja tris kartus — dažniau nei kitos.`,
      }),

    // 2. Kas yra moda
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kas yra imties moda?',
        variantai: [
          'dažniausiai pasikartojanti reikšmė',
          'vidurinė reikšmė',
          'reikšmių vidurkis',
          'didžiausia reikšmė',
        ],
        teisingas: 0,
        sprendimas: 'Modai rasti imties rikiuoti nebūtina, bet patogu.',
      }),

    // 3. Moda iš dažnių lentelės
    () => {
      const eilutes = [2, 3, 4, 5].map((v) => ({ vardas: String(v), kiek: atsitiktinis(2, 9) }))
      const didziausia = eilutes.reduce((a, b) => (a.kiek >= b.kiek ? a : b))
      if (eilutes.filter((e) => e.kiek === didziausia.kiek).length > 1) return null
      return uzdavinys(T6, {
        klausimas: 'Kokia yra imties moda pagal dažnių lentelę?',
        atsakymas: didziausia.vardas,
        atsakymasRodymui: `$${didziausia.vardas}$`,
        sprendimas: `Didžiausias dažnis ${didziausia.kiek} yra ties reikšme ${didziausia.vardas}.`,
        brezinys: daznuLentele(eilutes),
      })
    },

    // 4. Ar moda visada viena
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Ar imtis visada turi tik vieną modą?',
        variantai: [
          'ne, kelios reikšmės gali kartotis vienodai dažnai',
          'taip, visada viena',
          'ne, modos gali ir visai nebūti',
          'moda yra tik lyginėse imtyse',
        ],
        teisingas: 0,
        sprendimas: 'Jei visos reikšmės skirtingos, modos nėra išvis.',
      }),

    // 5. Trys centro matai
    () =>
      poruUzdavinys(naujasId(T6), T6, {
        klausimas: 'Sujunk imties charakteristiką su jos apibrėžimu.',
        poros: [
          { kaire: 'vidurkis', desine: 'suma, padalyta iš kiekio' },
          { kaire: 'mediana', desine: 'vidurinė surikiuotos imties reikšmė' },
          { kaire: 'moda', desine: 'dažniausia reikšmė' },
          { kaire: 'imties dydis', desine: 'reikšmių skaičius' },
        ],
        sprendimas: 'Visi trys pirmieji dydžiai rodo imties centrą, bet skirtingai.',
      }),

    // 6. Moda tekstiniuose duomenyse
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kuris imties centro matas tinka kokybiniams duomenims, pavyzdžiui, mėgstamiausiai spalvai?',
        variantai: ['moda', 'vidurkis', 'mediana', 'nė vienas'],
        teisingas: 0,
        sprendimas: 'Spalvų sudėti ar surikiuoti negalima, o dažniausią rasti — galima.',
      }),

    // 7. Kiek kartų pasikartoja
    () =>
      uzdavinys(T6, {
        klausimas: `Kiek kartų imtyje ${imtis.reiksmes.join(', ')} pasikartoja moda?`,
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: `Reikšmė $${imtis.moda}$ imtyje yra tris kartus.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: `Mokinys imties ${imtis.reiksmes.join(', ')} moda pavadino didžiausią reikšmę. Užrašyk teisingą modą.`,
        atsakymas: String(imtis.moda),
        atsakymasRodymui: `$${imtis.moda}$`,
        sprendimas: 'Moda yra dažniausia, o ne didžiausia reikšmė.',
      }),
  ])
}

// ── 12.1.1. Galimybių medis ─────────────────────────────────────────────────

const T7 = 'galimybiu-medis'

const A_MEDIS = [
  {
    klausimas: 'Kiek baigčių gaunama metant monetą ir kauliuką?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '$2 \\cdot 6 = 12$.',
  },
] as const

export const galimybiuMedis6: Generatorius = () => suBandymais(kurkMedi, A_MEDIS, T7)

function kurkMedi(): Uzdavinys | null {
  const pirmas = pasirink([
    ['H', 'S'],
    ['A', 'B'],
    ['1', '2', '3'],
  ])
  const antras = pasirink([
    ['1', '2'],
    ['x', 'y', 'z'],
    ['a', 'b'],
  ])
  const viso = pirmas.length * antras.length

  return variacija([
    // 1. Kiek baigčių medyje
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek iš viso baigčių rodo galimybių medis?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `Kiekvienai pirmojo žingsnio šakai tenka ${antras.length} antrojo žingsnio šakos: $${pirmas.length} \\cdot ${antras.length} = ${viso}$.`,
        brezinys: galimybiuMedis(pirmas, antras),
      }),

    // 2. Ką rodo medžio lapai
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ką galimybių medyje rodo kiekvienas kelias nuo pradžios iki galo?',
        variantai: ['vieną galimą baigtį', 'vieną bandymą', 'baigčių skaičių', 'tikimybę'],
        teisingas: 0,
        sprendimas: 'Kelių skaičius ir yra visų baigčių skaičius.',
        brezinys: galimybiuMedis(pirmas, antras, true),
      }),

    // 3. Moneta ir kauliukas
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek baigčių gaunama metant monetą ir lošimo kauliuką?',
        atsakymas: '12',
        atsakymasRodymui: '$12$',
        sprendimas: '$2 \\cdot 6 = 12$.',
      }),

    // 4. Dvi monetos
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek baigčių gaunama metant dvi monetas?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'HH, HS, SH ir SS — keturios baigtys.',
        brezinys: galimybiuMedis(['H', 'S'], ['H', 'S'], true),
      }),

    // 5. Kiek šakų iš pradžios
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek šakų išeina iš galimybių medžio pradžios taško?',
        atsakymas: String(pirmas.length),
        atsakymasRodymui: `$${pirmas.length}$`,
        sprendimas: 'Tiek, kiek baigčių turi pirmasis bandymo žingsnis.',
        brezinys: galimybiuMedis(pirmas, antras),
      }),

    // 6. Trys žingsniai
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek baigčių gaunama metant monetą tris kartus?',
        atsakymas: '8',
        atsakymasRodymui: '$8$',
        sprendimas: '$2 \\cdot 2 \\cdot 2 = 8$.',
      }),

    // 7. Kada patogus medis
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kada patogu naudoti galimybių medį?',
        variantai: [
          'kai bandymas susideda iš kelių žingsnių iš eilės',
          'kai baigčių labai daug',
          'kai baigtis viena',
          'kai duomenys kokybiniai',
        ],
        teisingas: 0,
        sprendimas: 'Medis parodo, kaip kiekvienas žingsnis šakojasi toliau.',
      }),

    // 8. Konkreti baigtis
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Kiek kartų medyje pasitaiko baigtis, prasidedanti „${pirmas[0]}“?`,
        variantai: [String(antras.length), String(pirmas.length), String(viso), '1'],
        teisingas: 0,
        sprendimas: `Iš šakos „${pirmas[0]}“ išeina ${antras.length} keliai.`,
        brezinys: galimybiuMedis(pirmas, antras, true),
      }),
  ])
}

// ── 12.1.2. Galimybių lentelė ───────────────────────────────────────────────

const T8 = 'galimybiu-lentele'

const A_LENTELE = [
  {
    klausimas: 'Kiek langelių turi galimybių lentelė, kai vienas bandymas turi 2, o kitas 3 baigtis?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: '$2 \\cdot 3 = 6$.',
  },
] as const

export const galimybiuLentele6: Generatorius = () => suBandymais(kurkLentele, A_LENTELE, T8)

function kurkLentele(): Uzdavinys | null {
  const eilutes = pasirink([
    ['1', '2', '3'],
    ['A', 'B'],
    ['1', '2', '3', '4'],
  ])
  const stulpeliai = pasirink([
    ['H', 'S'],
    ['a', 'b', 'c'],
  ])
  const viso = eilutes.length * stulpeliai.length

  return variacija([
    // 1. Kiek langelių
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek baigčių rodo galimybių lentelė?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${eilutes.length} \\cdot ${stulpeliai.length} = ${viso}$ langeliai.`,
        brezinys: galimybiuLentele(eilutes, stulpeliai),
      }),

    // 2. Ką rodo langelis
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Ką rodo vienas galimybių lentelės langelis?',
        variantai: ['vieną galimą baigtį', 'vieno bandymo baigčių skaičių', 'tikimybę', 'imties dydį'],
        teisingas: 0,
        sprendimas: 'Langelis sujungia po vieną baigtį iš eilutės ir iš stulpelio.',
        brezinys: galimybiuLentele(eilutes, stulpeliai, true),
      }),

    // 3. Dviejų kauliukų lentelė
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek baigčių gaunama metant du lošimo kauliukus?',
        atsakymas: '36',
        atsakymasRodymui: '$36$',
        sprendimas: '$6 \\cdot 6 = 36$.',
      }),

    // 4. Kiek eilučių
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek eilučių turi galimybių lentelė?',
        atsakymas: String(eilutes.length),
        atsakymasRodymui: `$${eilutes.length}$`,
        sprendimas: 'Tiek, kiek baigčių turi pirmasis bandymas.',
        brezinys: galimybiuLentele(eilutes, stulpeliai),
      }),

    // 5. Kuo skiriasi nuo medžio
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuo galimybių lentelė patogesnė už medį?',
        variantai: [
          'kai bandymų du, visos baigtys sutelpa į kompaktišką lentelę',
          'ji rodo daugiau baigčių',
          'ji tinka ir trims bandymams',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Medis patogesnis, kai žingsnių daugiau nei du.',
      }),

    // 6. Palankios baigtys
    () =>
      uzdavinys(T8, {
        klausimas: `Kiek lentelės baigčių prasideda reikšme „${eilutes[0]}“?`,
        atsakymas: String(stulpeliai.length),
        atsakymasRodymui: `$${stulpeliai.length}$`,
        sprendimas: 'Tai visa pirmoji lentelės eilutė.',
        brezinys: galimybiuLentele(eilutes, stulpeliai, true),
      }),

    // 7. Vienodų reikšmių baigtys
    () =>
      uzdavinys(T8, {
        klausimas: 'Metami du kauliukai. Kiek yra baigčių, kai abu rodo vienodą akučių skaičių?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Tai lentelės įstrižainė: $1$–$1$, $2$–$2$, …, $6$–$6$.',
      }),

    // 8. Suma metant du kauliukus
    () =>
      uzdavinys(T8, {
        klausimas: 'Metami du lošimo kauliukai. Kiek yra baigčių, kurių akučių suma lygi 7?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: '$1{+}6$, $2{+}5$, $3{+}4$, $4{+}3$, $5{+}2$, $6{+}1$ — šešios baigtys.',
      }),
  ])
}

// ── 12.1.3. Daugybos taisyklė ───────────────────────────────────────────────

const T9 = 'daugybos-taisykle'

const A_DAUGYBOS = [
  {
    klausimas: 'Kaip randamas kelių žingsnių bandymo baigčių skaičius?',
    atsakymas: 'sudauginant',
    atsakymasRodymui: 'Sudauginant kiekvieno žingsnio baigčių skaičius',
    sprendimas: 'Tai ir yra daugybos taisyklė.',
  },
] as const

export const daugybosTaisykle: Generatorius = () => suBandymais(kurkDaugyba, A_DAUGYBOS, T9)

function kurkDaugyba(): Uzdavinys | null {
  const a = atsitiktinis(2, 6)
  const b = atsitiktinis(2, 6)
  const c = atsitiktinis(2, 4)

  return variacija([
    // 1. Du žingsniai
    () =>
      uzdavinys(T9, {
        klausimas: `Pirmasis bandymo žingsnis turi ${a} baigtis, antrasis — ${b}. Kiek iš viso baigčių?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 2. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kaip randamas kelių žingsnių bandymo baigčių skaičius?',
        variantai: [
          'sudauginami kiekvieno žingsnio baigčių skaičiai',
          'sudedami kiekvieno žingsnio baigčių skaičiai',
          'imamas didžiausias iš jų',
          'jie dalijami',
        ],
        teisingas: 0,
        sprendimas: 'Kiekviena pirmojo žingsnio baigtis jungiasi su kiekviena antrojo.',
      }),

    // 3. Trys žingsniai
    () =>
      uzdavinys(T9, {
        klausimas: `Bandymą sudaro trys žingsniai, turintys ${a}, ${b} ir ${c} baigtis. Kiek iš viso baigčių?`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$`,
        sprendimas: `$${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$.`,
      }),

    // 4. Apranga
    () => {
      const marskiniai = atsitiktinis(3, 6)
      const kelnes = atsitiktinis(2, 5)
      return uzdavinys(T9, {
        klausimas: `Spintoje ${marskiniai} marškinėliai ir ${kelnes} kelnės. Kiek skirtingų derinių galima sudaryti?`,
        atsakymas: String(marskiniai * kelnes),
        atsakymasRodymui: `$${marskiniai * kelnes}$`,
        sprendimas: `$${marskiniai} \\cdot ${kelnes} = ${marskiniai * kelnes}$.`,
      })
    },

    // 5. Kodo variantai
    () => {
      const skaitmenu = atsitiktinis(2, 3)
      return uzdavinys(T9, {
        klausimas: `Kiek skirtingų ${skaitmenu} skaitmenų kodų galima sudaryti, jei kiekvienoje vietoje gali būti bet kuris skaitmuo nuo 0 iki 9?`,
        atsakymas: String(10 ** skaitmenu),
        atsakymasRodymui: `$${10 ** skaitmenu}$`,
        sprendimas: `Kiekvienoje iš ${skaitmenu} vietų yra 10 galimybių: $${Array(skaitmenu).fill(10).join(' \\cdot ')} = ${10 ** skaitmenu}$.`,
      })
    },

    // 6. Atvirkštinis
    () =>
      uzdavinys(T9, {
        klausimas: `Bandymą sudaro du žingsniai; iš viso yra ${a * b} baigtys, o pirmasis žingsnis turi ${a} baigtis. Kiek baigčių turi antrasis?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${a * b} : ${a} = ${b}$.`,
      }),

    // 7. Medis ir daugybos taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kuo daugybos taisyklė patogesnė už galimybių medį?',
        variantai: [
          'baigčių skaičių galima rasti nebraižant visų kelių',
          'ji tikslesnė',
          'ji tinka tik dviem žingsniams',
          'ji parodo kiekvieną baigtį',
        ],
        teisingas: 0,
        sprendimas: 'Kai baigčių šimtai, medžio nubraižyti nebeįmanoma.',
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Mokinys, ieškodamas bandymo su ${a} ir ${b} baigtimis bendro baigčių skaičiaus, sudėjo $${a} + ${b}$. Užrašyk teisingą baigčių skaičių.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: 'Baigčių skaičiai dauginami, nes kiekviena pirmojo baigtis jungiasi su kiekviena antrojo.',
      }),
  ])
}

// ── 12.2.1. Įvykis ──────────────────────────────────────────────────────────

const T10 = 'ivykis-6'

const A_IVYKIS = [
  {
    klausimas: 'Koks įvykis vadinamas būtinu?',
    atsakymas: 'kuris visada ivyksta',
    atsakymasRodymui: 'Toks, kuris visada įvyksta',
    sprendimas: 'Būtino įvykio tikimybė lygi 1.',
  },
] as const

export const ivykis6: Generatorius = () => suBandymais(kurkIvyki, A_IVYKIS, T10)

function kurkIvyki(): Uzdavinys | null {
  const tamsiu = atsitiktinis(2, 8)
  const sviesiu = atsitiktinis(2, 8)

  return variacija([
    // 1. Būtinas įvykis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Koks įvykis vadinamas būtinu?',
        variantai: [
          'toks, kuris visada įvyksta',
          'toks, kuris niekada neįvyksta',
          'toks, kuris įvyksta pusę kartų',
          'toks, kurio tikimybės nežinome',
        ],
        teisingas: 0,
        sprendimas: 'Būtino įvykio tikimybė lygi 1.',
      }),

    // 2. Negalimas įvykis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kuris įvykis metant lošimo kauliuką yra negalimas?',
        variantai: [
          'iškris 7 akutės',
          'iškris lyginis akučių skaičius',
          'iškris 6 akutės',
          'iškris mažiau nei 7 akutės',
        ],
        teisingas: 0,
        sprendimas: 'Kauliukas turi tik akutes nuo 1 iki 6.',
        brezinys: kauliukas(atsitiktinis(1, 6)),
      }),

    // 3. Atsitiktinis įvykis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Koks įvykis vadinamas atsitiktiniu?',
        variantai: [
          'toks, kuris gali įvykti arba neįvykti',
          'toks, kuris visada įvyksta',
          'toks, kuris niekada neįvyksta',
          'toks, kurio baigčių nėra',
        ],
        teisingas: 0,
        sprendimas: 'Atsitiktinio įvykio tikimybė yra tarp 0 ir 1.',
      }),

    // 4. Palankios baigtys
    () =>
      uzdavinys(T10, {
        klausimas: 'Iš maišelio traukiamas vienas rutuliukas. Kiek baigčių palankios įvykiui „ištrauktas tamsus rutuliukas“?',
        atsakymas: String(tamsiu),
        atsakymasRodymui: `$${tamsiu}$`,
        sprendimas: 'Palanki kiekviena tamsaus rutuliuko baigtis.',
        brezinys: maiselis(tamsiu, sviesiu),
      }),

    // 5. Visos baigtys
    () =>
      uzdavinys(T10, {
        klausimas: 'Kiek iš viso baigčių turi vieno rutuliuko traukimas iš maišelio?',
        atsakymas: String(tamsiu + sviesiu),
        atsakymasRodymui: `$${tamsiu + sviesiu}$`,
        sprendimas: `$${tamsiu} + ${sviesiu} = ${tamsiu + sviesiu}$.`,
        brezinys: maiselis(tamsiu, sviesiu),
      }),

    // 6. Būtinas įvykis su kauliuku
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kuris įvykis metant lošimo kauliuką yra būtinas?',
        variantai: [
          'iškris nuo 1 iki 6 akučių',
          'iškris 6 akutės',
          'iškris nelyginis akučių skaičius',
          'iškris daugiau nei 3 akutės',
        ],
        teisingas: 0,
        sprendimas: 'Šis įvykis įvyksta kiekvieno metimo metu.',
      }),

    // 7. Poros
    () =>
      poruUzdavinys(naujasId(T10), T10, {
        klausimas: 'Sujunk įvykį su jo rūšimi.',
        poros: [
          { kaire: 'metant monetą iškris herbas arba skaičius', desine: 'būtinas' },
          { kaire: 'metant kauliuką iškris 9 akutės', desine: 'negalimas' },
          { kaire: 'metant kauliuką iškris 4 akutės', desine: 'atsitiktinis' },
          { kaire: 'rytoj saulė patekės', desine: 'būtinas' },
        ],
        sprendimas: 'Atsitiktinis įvykis gali ir įvykti, ir neįvykti.',
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Mokinys teigia, kad įvykis „metant monetą iškris herbas“ yra būtinas. Kodėl jis klysta?',
        variantai: [
          'nes gali iškristi ir skaičius — įvykis atsitiktinis',
          'nes moneta neturi herbo',
          'nes moneta gali atsistoti ant briaunos',
          'jis neklysta',
        ],
        teisingas: 0,
        sprendimas: 'Būtinas įvykis įvyksta visada, o herbas iškrenta maždaug pusę kartų.',
        brezinys: moneta('herbas'),
      }),
  ])
}

// ── 12.2.2. Įvykio tikimybė ─────────────────────────────────────────────────

const T11 = 'ivykio-tikimybe-6'

const A_TIKIMYBE = [
  {
    klausimas: 'Kokia tikimybė metant kauliuką gauti lyginį akučių skaičių?',
    atsakymas: '1/2',
    atsakymasRodymui: '$\\dfrac{1}{2}$',
    sprendimas: 'Palankios trys baigtys iš šešių.',
  },
] as const

export const ivykioTikimybe6: Generatorius = () => suBandymais(kurkTikimybe, A_TIKIMYBE, T11)

function kurkTikimybe(): Uzdavinys | null {
  const tamsiu = atsitiktinis(2, 8)
  const sviesiu = atsitiktinis(2, 8)
  const viso = tamsiu + sviesiu
  const t = suprastink(tamsiu, viso)

  return variacija([
    // 1. Iš maišelio
    () =>
      uzdavinys(T11, {
        klausimas: 'Iš maišelio atsitiktinai traukiamas vienas rutuliukas. Kokia tikimybė ištraukti tamsų?',
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$\\dfrac{${t.skaitiklis}}{${t.vardiklis}}$`,
        sprendimas: `Palankios ${tamsiu} baigtys iš ${viso}: $\\dfrac{${tamsiu}}{${viso}}$.`,
        brezinys: maiselis(tamsiu, sviesiu),
      }),

    // 2. Formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kaip apskaičiuojama įvykio tikimybė?',
        variantai: [
          'palankių baigčių skaičius dalijamas iš visų baigčių skaičiaus',
          'visos baigtys dalijamos iš palankių',
          'palankios baigtys dauginamos iš visų',
          'palankios baigtys sudedamos',
        ],
        teisingas: 0,
        sprendimas: 'Todėl tikimybė visada yra nuo 0 iki 1.',
      }),

    // 3. Kauliukas — lyginis
    () =>
      uzdavinys(T11, {
        klausimas: 'Kokia tikimybė metant lošimo kauliuką gauti lyginį akučių skaičių?',
        atsakymas: '1/2',
        atsakymasRodymui: '$\\dfrac{1}{2}$',
        sprendimas: 'Palankios trys baigtys (2, 4, 6) iš šešių: $\\dfrac{3}{6} = \\dfrac{1}{2}$.',
        brezinys: kauliukas(pasirink([2, 4, 6])),
      }),

    // 4. Kauliukas — didesnis už
    () => {
      const riba = atsitiktinis(2, 5)
      const palankios = 6 - riba
      const tr2 = suprastink(palankios, 6)
      return uzdavinys(T11, {
        klausimas: `Kokia tikimybė metant lošimo kauliuką gauti daugiau nei ${riba} akutes?`,
        atsakymas: `${tr2.skaitiklis}/${tr2.vardiklis}`,
        atsakymasRodymui: `$\\dfrac{${tr2.skaitiklis}}{${tr2.vardiklis}}$`,
        sprendimas: `Palankios ${palankios} baigtys iš 6: $\\dfrac{${palankios}}{6} = \\dfrac{${tr2.skaitiklis}}{${tr2.vardiklis}}$.`,
      })
    },

    // 5. Būtino ir negalimo tikimybė
    () =>
      uzdavinys(T11, {
        klausimas: 'Kokia yra būtino įvykio tikimybė?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Palankios visos baigtys, tad $n : n = 1$. Negalimo įvykio tikimybė lygi 0.',
      }),

    // 6. Tikimybės ribos
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kokiose ribose visada yra įvykio tikimybė?',
        variantai: ['nuo 0 iki 1', 'nuo 1 iki 100', 'nuo $-1$ iki 1', 'ribų nėra'],
        teisingas: 0,
        sprendimas: 'Palankių baigčių negali būti nei mažiau nei nulis, nei daugiau nei visos.',
      }),

    // 7. Kiek rutuliukų reikia
    () =>
      uzdavinys(T11, {
        klausimas: `Maišelyje ${tamsiu} tamsūs ir ${sviesiu} šviesūs rutuliukai. Kiek tamsių rutuliukų reikėtų pridėti, kad tamsių būtų dvigubai daugiau nei šviesių?`,
        atsakymas: String(Math.max(0, 2 * sviesiu - tamsiu)),
        atsakymasRodymui: `$${Math.max(0, 2 * sviesiu - tamsiu)}$`,
        sprendimas: `Reikia $${2 * sviesiu}$ tamsių: $${2 * sviesiu} - ${tamsiu} = ${2 * sviesiu - tamsiu}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T11, {
        klausimas: `Mokinys tamsaus rutuliuko tikimybe pavadino $\\dfrac{${tamsiu}}{${sviesiu}}$. Užrašyk teisingą tikimybę.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$\\dfrac{${t.skaitiklis}}{${t.vardiklis}}$`,
        sprendimas: 'Vardiklyje rašomas visų baigčių skaičius, o ne likusių rutuliukų skaičius.',
        brezinys: maiselis(tamsiu, sviesiu),
      }),
  ])
}

// ── 12.2.3. Įvykiui priešingas įvykis ir jo tikimybė ────────────────────────

const T12 = 'priesingas-ivykis'

const A_PRIESINGAS = [
  {
    klausimas: 'Įvykio tikimybė yra $\\dfrac{1}{4}$. Kokia jam priešingo įvykio tikimybė?',
    atsakymas: '3/4',
    atsakymasRodymui: '$\\dfrac{3}{4}$',
    sprendimas: '$1 - \\dfrac{1}{4} = \\dfrac{3}{4}$.',
  },
] as const

export const priesingasIvykis: Generatorius = () => suBandymais(kurkPriesinga, A_PRIESINGAS, T12)

function kurkPriesinga(): Uzdavinys | null {
  const tamsiu = atsitiktinis(2, 8)
  const sviesiu = atsitiktinis(2, 8)
  const viso = tamsiu + sviesiu
  const t = suprastink(tamsiu, viso)
  const p = suprastink(sviesiu, viso)

  return variacija([
    // 1. Priešingo įvykio tikimybė
    () =>
      uzdavinys(T12, {
        klausimas: `Tikimybė ištraukti tamsų rutuliuką yra $\\dfrac{${t.skaitiklis}}{${t.vardiklis}}$. Kokia tikimybė ištraukti ne tamsų?`,
        atsakymas: `${p.skaitiklis}/${p.vardiklis}`,
        atsakymasRodymui: `$\\dfrac{${p.skaitiklis}}{${p.vardiklis}}$`,
        sprendimas: `$1 - \\dfrac{${t.skaitiklis}}{${t.vardiklis}} = \\dfrac{${p.skaitiklis}}{${p.vardiklis}}$.`,
        brezinys: maiselis(tamsiu, sviesiu),
      }),

    // 2. Tikimybių suma
    () =>
      uzdavinys(T12, {
        klausimas: 'Kam lygi įvykio ir jam priešingo įvykio tikimybių suma?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Vienas iš jų būtinai įvyksta, tad kartu jie apima visas baigtis.',
      }),

    // 3. Kas yra priešingas įvykis
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Koks įvykis vadinamas priešingu duotajam?',
        variantai: [
          'toks, kuris įvyksta tada ir tik tada, kai duotasis neįvyksta',
          'toks, kurio tikimybė mažesnė',
          'toks, kuris niekada neįvyksta',
          'toks, kuris turi tiek pat baigčių',
        ],
        teisingas: 0,
        sprendimas: 'Kartu jie apima visas galimas baigtis ir nesikerta.',
      }),

    // 4. Kauliukas
    () => {
      const akutes = atsitiktinis(1, 6)
      return uzdavinys(T12, {
        klausimas: `Kokia tikimybė metant lošimo kauliuką negauti ${akutes} akučių?`,
        atsakymas: '5/6',
        atsakymasRodymui: '$\\dfrac{5}{6}$',
        sprendimas: `$1 - \\dfrac{1}{6} = \\dfrac{5}{6}$.`,
        brezinys: kauliukas(akutes),
      })
    },

    // 5. Priešingas būtinam
    () =>
      uzdavinys(T12, {
        klausimas: 'Kokia yra įvykio, priešingo būtinam, tikimybė?',
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: '$1 - 1 = 0$ — tai negalimas įvykis.',
      }),

    // 6. Iš procentų
    () => {
      const proc = pasirink([10, 20, 25, 40, 60, 75])
      return uzdavinys(T12, {
        klausimas: `Įvykio tikimybė yra $${proc}\\%$. Kiek procentų sudaro priešingo įvykio tikimybė?`,
        atsakymas: String(100 - proc),
        atsakymasRodymui: `$${100 - proc}\\%$`,
        sprendimas: `$100 - ${proc} = ${100 - proc}$.`,
      })
    },

    // 7. Kada patogiau skaičiuoti priešingą
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kada patogiau skaičiuoti priešingo įvykio tikimybę?',
        variantai: [
          'kai palankių baigčių labai daug, o nepalankių — mažai',
          'kai baigčių tik dvi',
          'kai tikimybė lygi 1',
          'niekada',
        ],
        teisingas: 0,
        sprendimas: 'Pavyzdžiui, „bent viena“ tikimybę patogiau rasti per „nė vienos“.',
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T12, {
        klausimas: `Mokinys teigia, kad įvykio ir jam priešingo įvykio tikimybių suma lygi $\\dfrac{${t.skaitiklis}}{${t.vardiklis}}$. Kam ji lygi iš tikrųjų?`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Kartu abu įvykiai apima visas baigtis, tad jų tikimybių suma visada lygi vienetui.',
      }),
  ])
}
