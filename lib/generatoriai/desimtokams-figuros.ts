import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { dvaTrikampiai, panasusStaciakampiai } from './sestokams-vaizdai'
import {
  apibreztinisKeturkampis,
  keturkampisApskritime,
  trikampisPusiaukampine,
  trikampisPusiaukrastines,
  trikampisSuApskritimu,
} from './desimtokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 10 klasės tema „Plokštumos figūros“ — aštuonios potemės.
 *
 * Visi brėžiniai skaičiuojami iš tikrųjų matmenų: pusiaukampinė dalija
 * kraštinę teoremos santykiu, sunkio centras dalija pusiaukraštinę santykiu
 * $2 : 1$, įbrėžtas apskritimas liečia visas tris kraštines, o įbrėžtinio
 * keturkampio kampai brėžinyje tokie, kokie užrašyti. Todėl mokinys gali
 * pasitikrinti akimis ir matuokliu.
 *
 * Trikampių trejetai parinkti taip, kad plotas, $r$ ir $R$ vienu metu būtų
 * gražūs skaičiai — kitaip viena formulė duotų sveiką, o kita nesveiką
 * atsakymą tam pačiam trikampiui.
 */

/** Trupmena KaTeX pavidalu. */
function tr(virsus: string, apacia: string): string {
  return `\\dfrac{${virsus}}{${apacia}}`
}

/** Dešimtainis skaičius lietuviškai — su kableliu. */
function kablelis(n: number): string {
  return String(n).replace('.', ',')
}

/** Tas pats skaičius KaTeX pavidalu. */
function kablelisTeX(n: number): string {
  return String(n).replace('.', '{,}')
}

/**
 * Trikampiai, kuriems plotas, įbrėžto apskritimo spindulys $r$ ir apibrėžto
 * spindulys $R$ yra gražūs skaičiai vienu metu.
 */
const TREJETAI = [
  { a: 13, b: 14, c: 15, S: 84, p: 21, r: 4, R: 8.125 },
  { a: 5, b: 12, c: 13, S: 30, p: 15, r: 2, R: 6.5 },
  { a: 6, b: 8, c: 10, S: 24, p: 12, r: 2, R: 5 },
  { a: 9, b: 12, c: 15, S: 54, p: 18, r: 3, R: 7.5 },
] as const

// ── 6.1. Panašiųjų figūrų perimetrų ir plotų santykiai ──────────────────────

const T1 = 'panasumo-santykiai'

const A1 = [
  {
    klausimas: 'Panašių figūrų mastelio koeficientas $k = 4$. Kiek kartų didesnis yra didesniosios figūros plotas?',
    atsakymas: '16',
    atsakymasRodymui: '$16$ kartų',
    sprendimas: 'Plotų santykis lygus panašumo koeficiento kvadratui: $4^2 = 16$.',
  },
] as const

export const panasumoSantykiai: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  const k = atsitiktinis(2, 6)

  return variacija([
    // 1. Perimetrų santykis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Dviejų panašių trikampių atitinkamų kraštinių santykis yra $2 : 3$. Koks yra jų perimetrų santykis?',
        variantai: ['$2 : 3$', '$4 : 9$', '$3 : 2$', '$1 : 1$'],
        teisingas: 0,
        brezinys: dvaTrikampiai({ a: 4, b: 5, c: 6 }, { a: 6, b: 7.5, c: 9 }),
        sprendimas: 'Perimetras yra kraštinių suma, tad jis didėja tiek pat kartų, kiek ir kiekviena kraštinė.',
      }),

    // 2. Plotų santykis
    () =>
      uzdavinys(T1, {
        klausimas: `Panašių figūrų mastelio koeficientas $k = ${k}$. Kiek kartų didesnis yra didesniosios figūros plotas?`,
        atsakymas: String(k * k),
        atsakymasRodymui: `$${k * k}$ kartų`,
        sprendimas: `Plotų santykis lygus panašumo koeficiento kvadratui: $${k}^2 = ${k * k}$.`,
        brezinys: panasusStaciakampiai(3, 2, k > 3 ? 2 : k),
      }),

    // 3. Antrasis perimetras
    () => {
      const perimetras = pasirink([20, 30, 40])
      const daugiklis = 1.5
      return uzdavinys(T1, {
        klausimas: `Vieno keturkampio perimetras $${perimetras}$ cm, o kito panašaus keturkampio kraštinės yra $${kablelis(daugiklis)}$ karto ilgesnės. Koks antrojo keturkampio perimetras (cm)?`,
        atsakymas: String(perimetras * daugiklis),
        atsakymasRodymui: `$${perimetras * daugiklis}$ cm`,
        sprendimas: `$${perimetras} \\cdot ${kablelisTeX(daugiklis)} = ${perimetras * daugiklis}$ — perimetras didėja tiek pat kartų, kiek kraštinės.`,
      })
    },

    // 4. Kraštinių santykis iš plotų
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Panašių trikampių plotų santykis yra $9 : 16$. Koks yra jų atitinkamų kraštinių santykis?',
        variantai: ['$3 : 4$', '$9 : 16$', '$81 : 256$', '$4 : 3$'],
        teisingas: 0,
        sprendimas: 'Kraštinių santykis yra plotų santykio kvadratinė šaknis: $\\sqrt{9} : \\sqrt{16} = 3 : 4$.',
      }),

    // 5. Kodėl plotai santykiu k²
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kodėl panašių figūrų plotų santykis lygus panašumo koeficiento kvadratui?',
        variantai: [
          'Nes plotas priklauso nuo dviejų matmenų, ir kiekvienas jų padidėja $k$ kartų',
          'Nes plotas visada yra kraštinės kvadratas',
          'Nes taip apibrėžtas panašumas',
          'Nes perimetras taip pat didėja $k^2$ kartų',
        ],
        teisingas: 0,
        sprendimas: 'Padidinus ir ilgį, ir plotį $k$ kartų, plotas padidėja $k \\cdot k = k^2$ kartų.',
      }),

    // 6. Perimetrų santykis iš plotų
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Dviejų panašių daugiakampių plotai yra $72$ cm² ir $200$ cm². Koks jų perimetrų santykis?',
        variantai: ['$3 : 5$', '$9 : 25$', '$36 : 100$', '$5 : 3$'],
        teisingas: 0,
        sprendimas: '$\\dfrac{72}{200} = \\dfrac{9}{25}$, tad kraštinių ir perimetrų santykis yra $\\sqrt{9} : \\sqrt{25} = 3 : 5$.',
      }),

    // 7. Modelio plotas
    () => {
      const mastelis = pasirink([20, 25, 50])
      const tikras = pasirink([12.5, 20, 25])
      const modelis = (tikras * 10000) / (mastelis * mastelis)
      if (!Number.isInteger(modelis)) return null
      return uzdavinys(T1, {
        klausimas: `Modelio mastelis $1 : ${mastelis}$. Tikro objekto paviršiaus plotas $${kablelis(tikras)}$ m². Kokį plotą (cm²) jis atitinka modelyje?`,
        atsakymas: String(modelis),
        atsakymasRodymui: `$${modelis}$ cm²`,
        sprendimas: `$${kablelisTeX(tikras)}$ m² $= ${tikras * 10000}$ cm²; plotai mažėja $${mastelis}^2 = ${mastelis * mastelis}$ kartų, tad $${tr(String(tikras * 10000), String(mastelis * mastelis))} = ${modelis}$ cm².`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: 'Padidinus visas figūros kraštines $3$ kartus, mokinys plotą padidino taip pat $3$ kartus. Kiek kartų iš tikrųjų padidėja plotas?',
        atsakymas: '9',
        atsakymasRodymui: '$9$ kartų',
        sprendimas: 'Plotas priklauso nuo dviejų matmenų, tad jis padidėja $3^2 = 9$ kartų.',
        brezinys: panasusStaciakampiai(2, 3, 3),
      }),

    // 9. Perimetrai iš skirtumo
    () => {
      const dalis = pasirink([8, 12, 16])
      const skirtumas = 2 * dalis
      return uzdavinys(T1, {
        klausimas: `Dviejų panašių trikampių perimetrų skirtumas yra $${skirtumas}$ cm, o panašumo koeficientas $5 : 3$. Koks yra didesniojo trikampio perimetras (cm)?`,
        atsakymas: String(5 * dalis),
        atsakymasRodymui: `$${5 * dalis}$ cm`,
        sprendimas: `Perimetrai yra $5$ ir $3$ dalys; skirtumas — $2$ dalys, tad viena dalis lygi $${tr(String(skirtumas), '2')} = ${dalis}$ cm, o perimetrai yra $${5 * dalis}$ cm ir $${3 * dalis}$ cm.`,
      })
    },

    // 10. Nežinoma kraštinė iš plotų
    () => {
      const maza = pasirink([3, 4, 5])
      const k2 = pasirink([2, 3])
      const didele = maza * k2
      return uzdavinys(T1, {
        klausimas: `Dviejų panašių figūrų plotai yra $${maza * maza}$ cm² ir $${didele * didele}$ cm². Mažesniosios figūros kraštinė lygi $${maza}$ cm. Kokia atitinkama didesniosios figūros kraštinė (cm)?`,
        atsakymas: String(didele),
        atsakymasRodymui: `$${didele}$ cm`,
        sprendimas: `Plotų santykis $${tr(String(didele * didele), String(maza * maza))} = ${k2 * k2}$, tad kraštinių santykis $\\sqrt{${k2 * k2}} = ${k2}$ ir kraštinė lygi $${maza} \\cdot ${k2} = ${didele}$ cm.`,
      })
    },
  ])
}

// ── 6.2. Trikampio pusiaukampinių savybės ───────────────────────────────────

const T2 = 'pusiaukampiniu-savybes'

const A2 = [
  {
    klausimas: 'Trikampyje $AD$ yra kampo $A$ pusiaukampinė, $AB = 10$, $BD = 5$, $DC = 7$. Rask $AC$.',
    atsakymas: '14',
    atsakymasRodymui: '$AC = 14$',
    sprendimas: '$\\dfrac{BD}{DC} = \\dfrac{AB}{AC}$, tad $\\dfrac{5}{7} = \\dfrac{10}{AC}$ ir $AC = 14$.',
  },
] as const

export const pusiaukampiniuSavybes: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  const k = atsitiktinis(2, 4)

  return variacija([
    // 1. DC radimas iš brėžinio
    () => {
      const ab = 6
      const ac = 9
      const bc = 10
      const bd = (bc * ab) / (ab + ac)
      const dc = bc - bd
      return uzdavinys(T2, {
        klausimas: 'Brėžinyje $AD$ yra kampo $A$ pusiaukampinė. Naudodamas pusiaukampinės teoremą rask atkarpą $DC$.',
        atsakymas: String(dc),
        atsakymasRodymui: `$DC = ${dc}$`,
        sprendimas: `$${tr('BD', 'DC')} = ${tr('AB', 'AC')} = ${tr(String(ab), String(ac))}$, tad $DC = ${tr(`${ac} \\cdot ${kablelisTeX(bd)}`, String(ab))} = ${dc}$.`,
        brezinys: trikampisPusiaukampine(ab, ac, bc, {
          ab: `${ab}`,
          ac: `${ac}`,
          bd: `${kablelis(bd)}`,
        }),
      })
    },

    // 2. Santykis iš kraštinių
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Trikampyje $AB : AC = 2 : 3$, o kampo $A$ pusiaukampinė dalija $BC$ į atkarpas $BD$ ir $DC$. Koks yra $BD : DC$?',
        variantai: ['$2 : 3$', '$3 : 2$', '$1 : 1$', '$4 : 9$'],
        teisingas: 0,
        brezinys: trikampisPusiaukampine(6, 9, 10, { ab: 'AB', ac: 'AC' }),
        sprendimas: 'Pusiaukampinė dalija priešingą kraštinę prie jos esančių kraštinių santykiu.',
      }),

    // 3. Teoremos formuluotė
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kokiu santykiu trikampio kampo pusiaukampinė dalija priešingą kraštinę?',
        variantai: [
          'Prie to kampo esančių kraštinių santykiu',
          'Visada pusiau',
          'Priešingų kraštinių kvadratų santykiu',
          'Santykiu $2 : 1$',
        ],
        teisingas: 0,
        sprendimas: 'Tai ir yra pusiaukampinės savybė: $\\dfrac{BD}{DC} = \\dfrac{AB}{AC}$.',
      }),

    // 4. Lygiašonis atvejis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Trikampyje $AB = AC$. Ką galima pasakyti apie atkarpas, į kurias kampo $A$ pusiaukampinė dalija $BC$?',
        variantai: [
          'Jos lygios, nes santykis $\\dfrac{AB}{AC} = 1$',
          'Viena dvigubai ilgesnė už kitą',
          'Jos negali būti lygios',
          'Jų santykis lygus $2 : 1$',
        ],
        teisingas: 0,
        brezinys: trikampisPusiaukampine(9, 9, 10, { ab: 'AB', ac: 'AC' }),
        sprendimas: 'Lygiašoniame trikampyje viršūnės kampo pusiaukampinė kartu yra ir pusiaukraštinė.',
      }),

    // 5. AC radimas
    () => {
      const bd = pasirink([4, 5, 6])
      const dc = pasirink([7, 8, 9])
      const ab = pasirink([10, 12, 15])
      const ac = (ab * dc) / bd
      if (!Number.isInteger(ac) || ac > 40) return null
      return uzdavinys(T2, {
        klausimas: `Trikampyje $BD = ${bd}$, $DC = ${dc}$, $AB = ${ab}$, o $AD$ yra kampo $A$ pusiaukampinė. Rask $AC$.`,
        atsakymas: String(ac),
        atsakymasRodymui: `$AC = ${ac}$`,
        sprendimas: `$${tr(String(bd), String(dc))} = ${tr(String(ab), 'AC')}$, tad $AC = ${tr(`${ab} \\cdot ${dc}`, String(bd))} = ${ac}$.`,
      })
    },

    // 6. BD ir DC iš trijų kraštinių
    () => {
      const ab = 12
      const ac = 18
      const bc = 20
      const bd = (bc * ab) / (ab + ac)
      if (!Number.isInteger(bd)) return null
      return uzdavinys(T2, {
        klausimas: `Trikampyje $AB = ${ab}$, $AC = ${ac}$, $BC = ${bc}$. Kampo $A$ pusiaukampinė kerta $BC$ taške $D$. Rask $BD$.`,
        atsakymas: String(bd),
        atsakymasRodymui: `$BD = ${bd}$`,
        sprendimas: `$BD : DC = ${ab} : ${ac} = 2 : 3$, o $BD + DC = ${bc}$, tad viena dalis lygi $${bc / 5}$ ir $BD = ${bd}$, $DC = ${bc - bd}$.`,
        brezinys: trikampisPusiaukampine(ab, ac, bc, { ab: `${ab}`, ac: `${ac}` }),
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Mokinys teigia, kad pusiaukampinė visada dalija priešingą kraštinę pusiau. Kada tai tiesa?',
        variantai: [
          'Tik tada, kai prie to kampo esančios kraštinės lygios, t. y. trikampis lygiašonis',
          'Visada',
          'Tik stačiuosiuose trikampiuose',
          'Niekada',
        ],
        teisingas: 0,
        sprendimas: 'Iš $\\dfrac{BD}{DC} = \\dfrac{AB}{AC}$ matyti, kad atkarpos lygios tik tada, kai $AB = AC$.',
      }),

    // 8. AC iš dalių ir AB
    () => {
      const dalis = pasirink([2, 4])
      const bd = 2 * dalis
      const dc = 3 * dalis
      const ab = pasirink([10, 12, 14])
      const ac = (ab * dc) / bd
      if (!Number.isInteger(ac)) return null
      return uzdavinys(T2, {
        klausimas: `Kampo $A$ pusiaukampinė dalija $BC$ į $${bd}$ cm ir $${dc}$ cm dalis. Rask $AC$ (cm), jei $AB = ${ab}$ cm.`,
        atsakymas: String(ac),
        atsakymasRodymui: `$AC = ${ac}$ cm`,
        sprendimas: `$${tr(String(bd), String(dc))} = ${tr(String(ab), 'AC')}$, tad $AC = ${ac}$ cm.`,
      })
    },

    // 9. Įrodymo eiga
    () =>
      eiliskumoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Sudėliok įrodymo, kad lygiašonio trikampio viršūnės kampo pusiaukampinė yra ir pusiaukraštinė, žingsnius teisinga tvarka.',
        teisingaEile: [
          'Duota: trikampis $ABC$, kuriame $AB = AC$, ir kampo $A$ pusiaukampinė $AD$',
          'Pagal pusiaukampinės savybę $\\dfrac{BD}{DC} = \\dfrac{AB}{AC}$',
          'Kadangi $AB = AC$, tas santykis lygus $1$',
          'Vadinasi, $BD = DC$, tad $AD$ yra ir pusiaukraštinė',
        ],
        sprendimas: 'Įrodymas eina nuo duotų sąlygų prie žinomos savybės ir tik tada prie išvados.',
      }),

    // 10. Uždavinio kūrimas
    () => {
      const ab = 3 * k
      const ac = 5 * k
      const bc = 8 * k
      const bd = (bc * ab) / (ab + ac)
      if (!Number.isInteger(bd) || ab + ac <= bc) return null
      return uzdavinys(T2, {
        klausimas: `Sukurtame uždavinyje $AB = ${ab}$, $AC = ${ac}$, $BC = ${bc}$, o $AD$ — kampo $A$ pusiaukampinė. Rask $DC$.`,
        atsakymas: String(bc - bd),
        atsakymasRodymui: `$DC = ${bc - bd}$`,
        sprendimas: `$BD : DC = ${ab} : ${ac} = 3 : 5$; iš $BD + DC = ${bc}$ gauname $BD = ${bd}$ ir $DC = ${bc - bd}$.`,
      })
    },
  ])
}

// ── 6.3. Trikampio pusiaukraštinių savybės ──────────────────────────────────

const T3 = 'pusiaukrastiniu-savybes'

const A3 = [
  {
    klausimas: 'Trikampio pusiaukraštinės susikerta taške $G$, o $AG = 8$ cm. Rask visą pusiaukraštinę $AM$ (cm).',
    atsakymas: '12',
    atsakymasRodymui: '$AM = 12$ cm',
    sprendimas: 'Sunkio centras dalija pusiaukraštinę santykiu $2 : 1$, tad $AG$ yra $\\dfrac{2}{3}$ visos: $AM = 8 : \\dfrac{2}{3} = 12$.',
  },
] as const

export const pusiaukrastiniuSavybes: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  return variacija([
    // 1. Visa pusiaukraštinė iš AG
    () => {
      const ag = pasirink([6, 8, 10, 14])
      const am = (ag * 3) / 2
      if (!Number.isInteger(am)) return null
      return uzdavinys(T3, {
        klausimas: `Brėžinyje trikampio pusiaukraštinės susikerta taške $G$, o $AG = ${ag}$ cm. Rask visą pusiaukraštinę $AM$ (cm).`,
        atsakymas: String(am),
        atsakymasRodymui: `$AM = ${am}$ cm`,
        sprendimas: `$AG$ sudaro $${tr('2', '3')}$ visos pusiaukraštinės, tad $AM = ${tr(`3 \\cdot ${ag}`, '2')} = ${am}$ cm.`,
        brezinys: trikampisPusiaukrastines({ visos: true, ag: `${ag} cm` }),
      })
    },

    // 2. Kuri dalis ilgesnė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Pusiaukraštines jų sankirtos taškas dalija santykiu $2 : 1$. Kuri dalis ilgesnė?',
        variantai: [
          'Nuo viršūnės iki sankirtos taško',
          'Nuo sankirtos taško iki kraštinės vidurio',
          'Abi lygios',
          'Priklauso nuo trikampio',
        ],
        teisingas: 0,
        brezinys: trikampisPusiaukrastines({ ag: 'ilgesnioji', gm: 'trumpesnioji' }),
        sprendimas: 'Santykis $2 : 1$ skaičiuojamas pradedant nuo viršūnės, tad ta dalis dvigubai ilgesnė.',
      }),

    // 3. Dalys iš visos pusiaukraštinės
    () => {
      const cm = pasirink([9, 12, 15, 18])
      const cg = (cm * 2) / 3
      if (!Number.isInteger(cg)) return null
      return uzdavinys(T3, {
        klausimas: `Pusiaukraštinė $CM = ${cm}$ cm. Rask atkarpą $CG$ (cm), kur $G$ — sunkio centras.`,
        atsakymas: String(cg),
        atsakymasRodymui: `$CG = ${cg}$ cm`,
        sprendimas: `$CG = ${tr('2', '3')} \\cdot ${cm} = ${cg}$ cm, o $GM = ${cm - cg}$ cm.`,
      })
    },

    // 4. Kas yra sunkio centras
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kas yra trikampio sunkio centras?',
        variantai: [
          'Trijų pusiaukraštinių sankirtos taškas',
          'Trijų pusiaukampinių sankirtos taškas',
          'Trijų aukštinių sankirtos taškas',
          'Kraštinių statmenų pusiaukirčių sankirtos taškas',
        ],
        teisingas: 0,
        brezinys: trikampisPusiaukrastines({ visos: true }),
        sprendimas: 'Pusiaukampinių sankirta yra įbrėžto apskritimo centras, o statmenų pusiaukirčių — apibrėžto.',
      }),

    // 5. Ar susikerta viename taške
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ar visos trys trikampio pusiaukraštinės susikerta viename taške?',
        variantai: [
          'Taip, ir tas taškas kiekvieną jų dalija santykiu $2 : 1$',
          'Ne, jos sudaro mažą trikampį',
          'Taip, bet tik lygiakraščiame trikampyje',
          'Taip, ir jos dalija viena kitą pusiau',
        ],
        teisingas: 0,
        brezinys: trikampisPusiaukrastines({ visos: true }),
        sprendimas: 'Bendras taškas vadinamas sunkio centru, o santykis $2 : 1$ galioja visose trijose pusiaukraštinėse.',
      }),

    // 6. Trys pusiaukraštinės iš atkarpų
    () => {
      const ag = pasirink([10, 8, 12])
      return uzdavinys(T3, {
        klausimas: `Pusiaukraštinės $AD$, $BE$ ir $CF$ susikerta taške $G$, o $AG = ${ag}$. Rask visą pusiaukraštinę $AD$.`,
        atsakymas: String((ag * 3) / 2),
        atsakymasRodymui: `$AD = ${(ag * 3) / 2}$`,
        sprendimas: `Kiekvienai pusiaukraštinei galioja tas pats santykis: $AD = ${tr('3', '2')} \\cdot ${ag} = ${(ag * 3) / 2}$.`,
        brezinys: trikampisPusiaukrastines({ visos: true, ag: `${ag}` }),
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: 'Pusiaukraštinės, kurios ilgis $18$ cm, atkarpą nuo viršūnės iki sunkio centro mokinys apskaičiavo $9$ cm. Kokia ji iš tikrųjų (cm)?',
        atsakymas: '12',
        atsakymasRodymui: '$12$ cm',
        sprendimas:
          'Sunkio centras dalija pusiaukraštinę ne pusiau, o santykiu $2 : 1$: $\\dfrac{2}{3} \\cdot 18 = 12$ cm ir $6$ cm.',
        brezinys: trikampisPusiaukrastines({ ag: '?', gm: '', am: '18 cm' }),
      }),

    // 8. Trumpesnioji dalis
    () => {
      const am = pasirink([15, 21, 24, 27])
      const gm = am / 3
      if (!Number.isInteger(gm)) return null
      return uzdavinys(T3, {
        klausimas: `Trikampio pusiaukraštinė $AM = ${am}$ cm. Koks atstumas (cm) nuo sunkio centro $G$ iki kraštinės $BC$ vidurio taško $M$?`,
        atsakymas: String(gm),
        atsakymasRodymui: `$GM = ${gm}$ cm`,
        sprendimas: `$GM$ sudaro $${tr('1', '3')}$ visos pusiaukraštinės: $${tr(String(am), '3')} = ${gm}$ cm.`,
      })
    },

    // 9. Įrodymo pagrindimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuo remiantis galima teigti, kad trijų pusiaukraštinių sankirtos taškas yra vienintelis?',
        variantai: [
          'Kiekviena pusiaukraštinė dalijama santykiu $2 : 1$ tik viename savo taške, tad ir bendras taškas gali būti tik vienas',
          'Nes dvi tiesės visada kertasi viename taške',
          'Nes trikampis turi tris viršūnes',
          'Nes pusiaukraštinės yra lygios',
        ],
        teisingas: 0,
        sprendimas: 'Dviejų pusiaukraštinių sankirta jau nustato tą vienintelį tašką, o trečioji per jį būtinai praeina.',
      }),

    // 10. Koordinatinis trikampis
    () => {
      const x = pasirink([6, 9, 12])
      return uzdavinys(T3, {
        klausimas: `Trikampio viršūnės yra $A(0; 0)$, $B(${x}; 0)$ ir $C(0; ${x})$. Rask kraštinės $BC$ vidurio taško abscisę.`,
        atsakymas: String(x / 2),
        atsakymasRodymui: `$M\\left(${kablelis(x / 2)}; ${kablelis(x / 2)}\\right)$`,
        sprendimas: `Vidurio taško koordinatės — galų koordinačių vidurkiai: $${tr(`${x} + 0`, '2')} = ${kablelisTeX(x / 2)}$. Sunkio centras būtų $\\left(${kablelisTeX(x / 3)}; ${kablelisTeX(x / 3)}\\right)$.`,
      })
    },
  ])
}

// ── 6.4. Į trikampį įbrėžtas apskritimas ────────────────────────────────────

const T4 = 'ibreztas-apskritimas'

const A4 = [
  {
    klausimas: 'Trikampio plotas $30$ cm², o pusperimetris $10$ cm. Rask įbrėžto apskritimo spindulį (cm).',
    atsakymas: '3',
    atsakymasRodymui: '$r = 3$ cm',
    sprendimas: 'Iš $S = rp$ gauname $r = \\dfrac{30}{10} = 3$.',
  },
] as const

export const ibreztasApskritimas: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  const t = pasirink(TREJETAI)

  return variacija([
    // 1. Kaip randamas centras
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Brėžinyje pavaizduotas į trikampį įbrėžtas apskritimas ir trys kampų pusiaukampinės. Kaip randamas įbrėžto apskritimo centras?',
        variantai: [
          'Tai kampų pusiaukampinių sankirtos taškas',
          'Tai pusiaukraštinių sankirtos taškas',
          'Tai aukštinių sankirtos taškas',
          'Tai kraštinių vidurio taškų sankirta',
        ],
        teisingas: 0,
        brezinys: trikampisSuApskritimu('ibreztas', [t.a, t.b, t.c], { pusiaukampines: true }),
        sprendimas: 'Pusiaukampinės taškai yra vienodai nutolę nuo kampo kraštinių, tad jų sankirta vienodai nutolusi nuo visų trijų kraštinių.',
      }),

    // 2. Atstumas iki kraštinių
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kokiu atstumu įbrėžto apskritimo centras nutolęs nuo trikampio kraštinių?',
        variantai: [
          'Nuo visų trijų vienodu — tas atstumas ir yra spindulys $r$',
          'Nuo kiekvienos skirtingu',
          'Nuo ilgiausios kraštinės toliausiai',
          'Nuo kraštinių atstumas lygus $R$',
        ],
        teisingas: 0,
        brezinys: trikampisSuApskritimu('ibreztas', [t.a, t.b, t.c], { spindulys: 'r' }),
        sprendimas: 'Būtent dėl vienodo atstumo apskritimas ir liečia visas tris kraštines.',
      }),

    // 3. Kas yra spindulys
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kas yra į trikampį įbrėžto apskritimo spindulys?',
        variantai: [
          'Statmuo, nuleistas iš centro į bet kurią kraštinę',
          'Atstumas nuo centro iki viršūnės',
          'Pusė ilgiausios kraštinės',
          'Pusiaukraštinės trečdalis',
        ],
        teisingas: 0,
        brezinys: trikampisSuApskritimu('ibreztas', [t.a, t.b, t.c], { spindulys: 'r' }),
        sprendimas: 'Spindulys statmenas kraštinei lietimosi taške — tai matyti ir brėžinyje pažymėtu stačiuoju kampu.',
      }),

    // 4. Ar visada galima įbrėžti
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ar kiekvienam trikampiui galima įbrėžti apskritimą?',
        variantai: [
          'Taip — trys pusiaukampinės visada susikerta viename trikampio viduje esančiame taške',
          'Ne, tik stačiajam',
          'Ne, tik lygiašoniam',
          'Taip, bet centras kartais būna už trikampio',
        ],
        teisingas: 0,
        sprendimas: 'Pusiaukampinės eina trikampio viduje, tad jų sankirta visada yra viduje.',
      }),

    // 5. r iš ploto ir pusperimetrio
    () => {
      const plotas = pasirink([24, 30, 48, 60])
      const p = pasirink([8, 10, 12, 15])
      if (!Number.isInteger(plotas / p)) return null
      return uzdavinys(T4, {
        klausimas: `Trikampio plotas $${plotas}$ cm², o pusperimetris $${p}$ cm. Rask įbrėžto apskritimo spindulį (cm).`,
        atsakymas: String(plotas / p),
        atsakymasRodymui: `$r = ${plotas / p}$ cm`,
        sprendimas: `Iš $S = rp$ gauname $r = ${tr(String(plotas), String(p))} = ${plotas / p}$.`,
      })
    },

    // 6. r iš trijų kraštinių
    () =>
      uzdavinys(T4, {
        klausimas: `Trikampio kraštinės yra $${t.a}$ cm, $${t.b}$ cm ir $${t.c}$ cm, o plotas $${t.S}$ cm². Rask įbrėžto apskritimo spindulį (cm).`,
        atsakymas: String(t.r),
        atsakymasRodymui: `$r = ${t.r}$ cm`,
        sprendimas: `Pusperimetris $p = ${tr(`${t.a} + ${t.b} + ${t.c}`, '2')} = ${t.p}$ cm, tad $r = ${tr(String(t.S), String(t.p))} = ${t.r}$ cm.`,
        brezinys: trikampisSuApskritimu('ibreztas', [t.a, t.b, t.c], {
          a: `${t.a}`,
          b: `${t.b}`,
          c: `${t.c}`,
          spindulys: 'r',
        }),
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Mokinys teigia, kad įbrėžto apskritimo centras yra pusiaukraštinių sankirta. Kur klaida?',
        variantai: [
          'Pusiaukraštinių sankirta yra sunkio centras; įbrėžto apskritimo centras — pusiaukampinių sankirta',
          'Pusiaukraštinių sankirta yra apibrėžto apskritimo centras',
          'Klaidos nėra',
          'Įbrėžto apskritimo centras yra aukštinių sankirta',
        ],
        teisingas: 0,
        brezinys: trikampisSuApskritimu('ibreztas', [t.a, t.b, t.c], { pusiaukampines: true }),
        sprendimas: 'Nuo kraštinių vienodai nutolęs yra būtent pusiaukampinių sankirtos taškas.',
      }),

    // 8. Kodėl I vienodai nutolęs
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kampų $A$ ir $B$ pusiaukampinės susikerta taške $I$. Kodėl $I$ vienodai nutolęs nuo visų trijų kraštinių?',
        variantai: [
          'Nes kampo $A$ pusiaukampinės taškai vienodai nutolę nuo $AB$ ir $AC$, o kampo $B$ — nuo $AB$ ir $BC$; sankirtoje sutampa visi trys atstumai',
          'Nes $I$ yra trikampio viduryje',
          'Nes pusiaukampinės lygios',
          'Nes $I$ yra kraštinių vidurio taškas',
        ],
        teisingas: 0,
        brezinys: trikampisSuApskritimu('ibreztas', [t.a, t.b, t.c], { pusiaukampines: true }),
        sprendimas: 'Iš dviejų lygybių $d(AB) = d(AC)$ ir $d(AB) = d(BC)$ išplaukia, kad visi trys atstumai lygūs.',
      }),

    // 9. Plotas iš perimetro ir r
    () => {
      const perimetras = pasirink([42, 50, 36])
      const r = pasirink([3, 4, 5])
      const plotas = (perimetras / 2) * r
      if (!Number.isInteger(plotas)) return null
      return uzdavinys(T4, {
        klausimas: `Trikampio perimetras $${perimetras}$ cm, o įbrėžto apskritimo spindulys $${r}$ cm. Rask trikampio plotą (cm²).`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$S = ${plotas}$ cm²`,
        sprendimas: `Pusperimetris $p = ${tr(String(perimetras), '2')} = ${perimetras / 2}$ cm, tad $S = rp = ${r} \\cdot ${perimetras / 2} = ${plotas}$ cm².`,
      })
    },

    // 10. Sudėtinis uždavinys
    () =>
      uzdavinys(T4, {
        klausimas: `Trikampio kraštinės $${t.a}$ cm, $${t.b}$ cm ir $${t.c}$ cm, o įbrėžto apskritimo spindulys $${t.r}$ cm. Rask trikampio plotą (cm²).`,
        atsakymas: String(t.S),
        atsakymasRodymui: `$S = ${t.S}$ cm²`,
        sprendimas: `$p = ${t.p}$ cm, tad $S = rp = ${t.r} \\cdot ${t.p} = ${t.S}$ cm².`,
        brezinys: trikampisSuApskritimu('ibreztas', [t.a, t.b, t.c], {
          a: `${t.a}`,
          b: `${t.b}`,
          c: `${t.c}`,
        }),
      }),
  ])
}

// ── 6.5. Apie trikampį apibrėžtas apskritimas ───────────────────────────────

const T5 = 'apibreztas-apskritimas'

const A5 = [
  {
    klausimas: 'Stačiojo trikampio įžambinė $10$ cm. Rask apibrėžto apskritimo spindulį (cm).',
    atsakymas: '5',
    atsakymasRodymui: '$R = 5$ cm',
    sprendimas: 'Stačiojo trikampio apibrėžto apskritimo centras yra įžambinės vidurio taškas, tad $R$ lygus pusei įžambinės.',
  },
] as const

export const apibreztasApskritimas: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const t = pasirink(TREJETAI)

  return variacija([
    // 1. Taško O įvardijimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Brėžinyje kraštinių statmenos pusiaukirtės susikerta taške $O$, apie trikampį nubrėžtas apskritimas. Kaip vadinamas taškas $O$?',
        variantai: [
          'Apie trikampį apibrėžto apskritimo centras',
          'Trikampio sunkio centras',
          'Įbrėžto apskritimo centras',
          'Aukštinių sankirtos taškas',
        ],
        teisingas: 0,
        brezinys: trikampisSuApskritimu('apibreztas', [t.a, t.b, t.c], { statmenys: true }),
        sprendimas: 'Statmenos pusiaukirtės taškai vienodai nutolę nuo kraštinės galų, tad jų sankirta vienodai nutolusi nuo visų viršūnių.',
      }),

    // 2. Atstumas iki viršūnių
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kokiu atstumu apie trikampį apibrėžto apskritimo centras nutolęs nuo viršūnių?',
        variantai: [
          'Nuo visų trijų vienodu — tas atstumas yra spindulys $R$',
          'Nuo kiekvienos skirtingu',
          'Nuo artimiausios viršūnės $r$, nuo tolimiausios $R$',
          'Nuo viršūnių atstumas lygus pusperimetriui',
        ],
        teisingas: 0,
        brezinys: trikampisSuApskritimu('apibreztas', [t.a, t.b, t.c], { spindulys: 'R' }),
        sprendimas: 'Visos trys viršūnės yra ant to paties apskritimo, tad jos vienodai nutolusios nuo jo centro.',
      }),

    // 3. Stačiojo trikampio atvejis
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kur yra stačiojo trikampio apibrėžto apskritimo centras?',
        variantai: [
          'Įžambinės vidurio taške',
          'Stačiojo kampo viršūnėje',
          'Trikampio viduje, vienodai nuo statinių',
          'Už trikampio ribų',
        ],
        teisingas: 0,
        brezinys: trikampisSuApskritimu('apibreztas', [6, 8, 10], { statmenys: true }),
        sprendimas: 'Įžambinė tampa apskritimo skersmeniu, tad jos vidurys ir yra centras.',
      }),

    // 4. Kaip rasti centrą
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kaip randamas apie trikampį apibrėžto apskritimo centras?',
        variantai: [
          'Nubrėžiamos bent dviejų kraštinių statmenos pusiaukirtės ir randama jų sankirta',
          'Nubrėžiamos pusiaukampinės',
          'Randamas pusiaukraštinių sankirtos taškas',
          'Imamas ilgiausios kraštinės vidurys',
        ],
        teisingas: 0,
        brezinys: trikampisSuApskritimu('apibreztas', [t.a, t.b, t.c], { statmenys: true }),
        sprendimas: 'Dviejų statmenų pusiaukirčių pakanka — trečioji per tą patį tašką praeina savaime.',
      }),

    // 5. R iš įžambinės
    () => {
      const izambine = pasirink([10, 12, 16, 20])
      return uzdavinys(T5, {
        klausimas: `Stačiojo trikampio įžambinė $${izambine}$ cm. Rask apibrėžto apskritimo spindulį (cm).`,
        atsakymas: String(izambine / 2),
        atsakymasRodymui: `$R = ${izambine / 2}$ cm`,
        sprendimas: `Centras yra įžambinės vidurio taškas, tad $R = ${tr(String(izambine), '2')} = ${izambine / 2}$ cm.`,
      })
    },

    // 6. R iš kraštinės ir kampo
    () => {
      const krastine = pasirink([10, 12, 14, 16])
      return uzdavinys(T5, {
        klausimas: `Trikampio kraštinė $a = ${krastine}$ cm, o prieš ją esantis kampas $A = 30°$. Naudodamas sinusų teoremą rask apibrėžto apskritimo spindulį (cm).`,
        atsakymas: String(krastine),
        atsakymasRodymui: `$R = ${krastine}$ cm`,
        sprendimas: `$${tr('a', '\\sin A')} = 2R$, tad $2R = ${tr(String(krastine), '0{,}5')} = ${2 * krastine}$ ir $R = ${krastine}$ cm.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Mokinys teigia, kad apibrėžto apskritimo centras visada yra trikampio viduje. Kada taip nėra?',
        variantai: [
          'Stačiajame trikampyje jis yra ant kraštinės, o bukajame — už trikampio ribų',
          'Niekada — jis visada viduje',
          'Tik lygiakraščiame trikampyje jis yra išorėje',
          'Tik lygiašoniame trikampyje jis yra ant kraštinės',
        ],
        teisingas: 0,
        brezinys: trikampisSuApskritimu('apibreztas', [5, 7, 11], { statmenys: true }),
        sprendimas: 'Centras nusitraukia į tą pusę, kurioje yra didžiausias kampas; bukajame trikampyje jis išeina už kraštinės.',
      }),

    // 8. Įrodymas apie įžambinę
    () =>
      eiliskumoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Sudėliok įrodymo, kad stačiojo trikampio įžambinės vidurio taškas vienodai nutolęs nuo visų viršūnių, žingsnius teisinga tvarka.',
        teisingaEile: [
          'Duota: stačiasis trikampis $ABC$ su stačiuoju kampu $C$ ir įžambinės $AB$ vidurio taškas $O$',
          'Pagal apibrėžimą $OA = OB$, nes $O$ yra $AB$ vidurys',
          'Įbrėžtinis kampas $C$ remiasi į skersmenį, tad $O$ yra apibrėžto apskritimo centras',
          'Vadinasi, $OC = OA = OB$ — visos trys atkarpos yra spinduliai',
        ],
        sprendimas: 'Statusis įbrėžtinis kampas visada remiasi į skersmenį, ir tai suriša $OC$ su kitomis dviem atkarpomis.',
      }),

    // 9. Bukasis trikampis
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Brėžinyje pavaizduotas bukasis trikampis ir jo kraštinių statmenos pusiaukirtės. Kur atsiduria apibrėžto apskritimo centras?',
        variantai: [
          'Už trikampio ribų, priešingoje pusėje nuo bukojo kampo',
          'Bukojo kampo viršūnėje',
          'Trikampio viduje',
          'Ilgiausios kraštinės vidurio taške',
        ],
        teisingas: 0,
        brezinys: trikampisSuApskritimu('apibreztas', [5, 7, 11], { statmenys: true }),
        sprendimas: 'Ilgiausios kraštinės statmena pusiaukirtė kerta kitas dvi už trikampio ribų.',
      }),

    // 10. R iš kraštinės ir 150° kampo
    () => {
      const krastine = pasirink([8, 10, 14])
      return uzdavinys(T5, {
        klausimas: `Trikampyje kraštinė $a = ${krastine}$ cm, o prieš ją esantis kampas $A = 150°$. Rask apibrėžto apskritimo spindulį (cm).`,
        atsakymas: String(krastine),
        atsakymasRodymui: `$R = ${krastine}$ cm`,
        sprendimas: `$\\sin 150° = 0{,}5$, tad $2R = ${tr(String(krastine), '0{,}5')} = ${2 * krastine}$ ir $R = ${krastine}$ cm — toks pat kaip ir su $30°$ kampu.`,
      })
    },
  ])
}

// ── 6.6. Trikampio ploto formulės S = rp ir S = abc/(4R) ────────────────────

const T6 = 'ploto-formules-rp'

const A6 = [
  {
    klausimas: 'Trikampio pusperimetris $p = 12$ cm, o įbrėžto apskritimo spindulys $r = 3$ cm. Rask plotą (cm²).',
    atsakymas: '36',
    atsakymasRodymui: '$S = 36$ cm²',
    sprendimas: '$S = rp = 3 \\cdot 12 = 36$.',
  },
] as const

export const plotoFormulesRp: Generatorius = () => suBandymais(kurk6, A6, T6)

function kurk6(): Uzdavinys | null {
  const t = pasirink(TREJETAI)

  return variacija([
    // 1. S = rp
    () => {
      const p = pasirink([10, 12, 15, 18])
      const r = pasirink([3, 4, 5])
      return uzdavinys(T6, {
        klausimas: `Trikampio pusperimetris $p = ${p}$ cm, o įbrėžto apskritimo spindulys $r = ${r}$ cm. Rask plotą (cm²).`,
        atsakymas: String(p * r),
        atsakymasRodymui: `$S = ${p * r}$ cm²`,
        sprendimas: `$S = rp = ${r} \\cdot ${p} = ${p * r}$.`,
      })
    },

    // 2. S = abc/(4R)
    () =>
      uzdavinys(T6, {
        klausimas: `Trikampio kraštinės $a = ${t.a}$, $b = ${t.b}$, $c = ${t.c}$, o apibrėžto apskritimo spindulys $R = ${kablelis(t.R)}$. Rask plotą formule $S = ${tr('abc', '4R')}$.`,
        atsakymas: String(t.S),
        atsakymasRodymui: `$S = ${t.S}$`,
        sprendimas: `$abc = ${t.a * t.b * t.c}$, $4R = ${kablelisTeX(4 * t.R)}$, tad $S = ${tr(String(t.a * t.b * t.c), kablelisTeX(4 * t.R))} = ${t.S}$.`,
        brezinys: trikampisSuApskritimu('apibreztas', [t.a, t.b, t.c], {
          a: `${t.a}`,
          b: `${t.b}`,
          c: `${t.c}`,
          spindulys: 'R',
        }),
      }),

    // 3. r iš S ir p
    () => {
      const plotas = pasirink([48, 60, 72])
      const p = pasirink([12, 15, 16, 18])
      if (!Number.isInteger(plotas / p)) return null
      return uzdavinys(T6, {
        klausimas: `Trikampio plotas $${plotas}$ cm², o pusperimetris $${p}$ cm. Rask $r$ (cm).`,
        atsakymas: String(plotas / p),
        atsakymasRodymui: `$r = ${plotas / p}$ cm`,
        sprendimas: `Iš $S = rp$ gauname $r = ${tr(String(plotas), String(p))} = ${plotas / p}$.`,
      })
    },

    // 4. R iš S ir kraštinių
    () =>
      uzdavinys(T6, {
        klausimas: `Trikampio plotas $${t.S}$, o kraštinės $${t.a}$, $${t.b}$, $${t.c}$. Rask $R$ iš formulės $S = ${tr('abc', '4R')}$.`,
        atsakymas: kablelis(t.R),
        atsakymasRodymui: `$R = ${kablelis(t.R)}$`,
        sprendimas: `$R = ${tr('abc', '4S')} = ${tr(String(t.a * t.b * t.c), String(4 * t.S))} = ${kablelisTeX(t.R)}$.`,
      }),

    // 5. Kada kurią formulę patogiau
    () =>
      poruUzdavinys(naujasId(T6), T6, {
        klausimas: 'Susiek duomenų rinkinį su formule, kuria patogiausia rasti trikampio plotą.',
        poros: [
          { kaire: 'Žinomas $r$ ir pusperimetris', desine: '$S = rp$' },
          { kaire: 'Žinomos trys kraštinės ir $R$', desine: '$S = \\dfrac{abc}{4R}$' },
          { kaire: 'Žinomos dvi kraštinės ir kampas tarp jų', desine: '$S = \\dfrac{1}{2}ab\\sin C$' },
        ],
        sprendimas: 'Formulė renkama pagal tai, kurie dydžiai jau duoti — kitaip tektų juos pirma skaičiuoti.',
      }),

    // 6. r ir R vienu metu
    () =>
      uzdavinys(T6, {
        klausimas: `Trikampio kraštinės $${t.a}$ cm, $${t.b}$ cm ir $${t.c}$ cm, o plotas $${t.S}$ cm². Rask įbrėžto apskritimo spindulį $r$ (cm).`,
        atsakymas: String(t.r),
        atsakymasRodymui: `$r = ${t.r}$ cm, o $R = ${kablelis(t.R)}$ cm`,
        sprendimas: `$p = ${t.p}$, tad $r = ${tr(String(t.S), String(t.p))} = ${t.r}$; iš kitos formulės $R = ${tr(String(t.a * t.b * t.c), String(4 * t.S))} = ${kablelisTeX(t.R)}$.`,
        brezinys: trikampisSuApskritimu('ibreztas', [t.a, t.b, t.c], { spindulys: 'r' }),
      }),

    // 7. Plotas ir R iš perimetro
    () => {
      // Duomenys imami iš tikro trikampio: laisvai parinktas perimetras su $r$
      // ir $abc$ gali apibūdinti trikampį, kurio išvis nėra.
      const abc = t.a * t.b * t.c
      return uzdavinys(T6, {
        klausimas: `Trikampio perimetras $${2 * t.p}$ cm, $r = ${t.r}$ cm, o kraštinių sandauga $abc = ${abc}$. Rask apibrėžto apskritimo spindulį $R$ (cm).`,
        atsakymas: kablelis(t.R),
        atsakymasRodymui: `$R = ${kablelis(t.R)}$ cm`,
        sprendimas: `$p = ${t.p}$, tad $S = rp = ${t.S}$ cm²; iš $S = ${tr('abc', '4R')}$ gauname $R = ${tr(String(abc), String(4 * t.S))} = ${kablelisTeX(t.R)}$ cm.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Formulėje $S = rp$ vietoj pusperimetrio mokinys panaudojo visą perimetrą. Kaip tai paveikė atsakymą?',
        variantai: [
          'Plotas gavosi dvigubai per didelis',
          'Plotas gavosi dvigubai per mažas',
          'Atsakymas nepasikeitė',
          'Plotas gavosi keturis kartus per didelis',
        ],
        teisingas: 0,
        sprendimas: 'Perimetras yra dvigubai didesnis už pusperimetrį, tad ir sandauga $rP$ dvigubai didesnė už tikrąjį plotą.',
      }),

    // 9. Nežinoma kraštinė
    () =>
      uzdavinys(T6, {
        klausimas: 'Trikampio plotas $24$ cm², dvi kraštinės $6$ cm ir $8$ cm, o apibrėžto apskritimo spindulys $R = 5$ cm. Rask trečiąją kraštinę $c$ (cm).',
        atsakymas: '10',
        atsakymasRodymui: '$c = 10$ cm',
        sprendimas:
          'Iš $S = \\dfrac{abc}{4R}$ gauname $c = \\dfrac{4SR}{ab} = \\dfrac{4 \\cdot 24 \\cdot 5}{48} = 10$ cm — tai stačiojo trikampio įžambinė.',
        brezinys: trikampisSuApskritimu('apibreztas', [6, 8, 10], { a: '6', b: '8', spindulys: 'R' }),
      }),

    // 10. Tas pats plotas dviem būdais
    () =>
      uzdavinys(T6, {
        klausimas: `Trikampio kraštinės $${t.a}$, $${t.b}$, $${t.c}$, $r = ${t.r}$ ir $R = ${kablelis(t.R)}$. Apskaičiuok plotą formule $S = rp$ ir palygink su $S = ${tr('abc', '4R')}$. Užrašyk gautą plotą.`,
        atsakymas: String(t.S),
        atsakymasRodymui: `$S = ${t.S}$`,
        sprendimas: `$rp = ${t.r} \\cdot ${t.p} = ${t.S}$, o $${tr(String(t.a * t.b * t.c), kablelisTeX(4 * t.R))} = ${t.S}$ — abi formulės duoda tą patį.`,
      }),
  ])
}

// ── 6.7. Įbrėžtiniai ir apibrėžtiniai keturkampiai ──────────────────────────

const T7 = 'ibreztiniai-keturkampiai'

const A7 = [
  {
    klausimas: 'Įbrėžtinio keturkampio vienas kampas lygus $70°$. Rask jam priešingą kampą laipsniais.',
    atsakymas: '110',
    atsakymasRodymui: '$110°$',
    sprendimas: 'Įbrėžtinio keturkampio priešingų kampų suma lygi $180°$.',
  },
] as const

export const ibreztiniaiKeturkampiai: Generatorius = () => suBandymais(kurk7, A7, T7)

function kurk7(): Uzdavinys | null {
  const kampas = pasirink([70, 85, 95, 110, 120])
  const kampasB = pasirink([80, 95, 105])

  return variacija([
    // 1. Įbrėžtinio apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kokį keturkampį vadiname įbrėžtiniu?',
        variantai: [
          'Tokį, kurio visos keturios viršūnės yra ant to paties apskritimo',
          'Tokį, kurio visos kraštinės liečia apskritimą',
          'Tokį, kurio įstrižainės lygios',
          'Tokį, kurio priešingos kraštinės lygiagrečios',
        ],
        teisingas: 0,
        brezinys: keturkampisApskritime(110, 95),
        sprendimas: 'Apskritimas eina per visas keturias viršūnes, todėl keturkampis ir vadinamas įbrėžtiniu.',
      }),

    // 2. Apibrėžtinio apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kokį keturkampį vadiname apibrėžtiniu?',
        variantai: [
          'Tokį, kurio visos keturios kraštinės liečia tą patį apskritimą',
          'Tokį, kurio visos viršūnės yra ant apskritimo',
          'Tokį, kurio įstrižainės statmenos',
          'Tokį, kurio visi kampai statūs',
        ],
        teisingas: 0,
        brezinys: apibreztinisKeturkampis([7, 9, 8, 6]),
        sprendimas: 'Apskritimas įbrėžiamas į keturkampį, tad kiekviena kraštinė yra jo liestinė.',
      }),

    // 3. Priešingas kampas
    () =>
      uzdavinys(T7, {
        klausimas: `Įbrėžtinio keturkampio $ABCD$ kampas $A$ lygus $${kampas}°$. Rask jam priešingą kampą $C$ laipsniais.`,
        atsakymas: String(180 - kampas),
        atsakymasRodymui: `$\\angle C = ${180 - kampas}°$`,
        sprendimas: `Įbrėžtinio keturkampio priešingų kampų suma lygi $180°$: $180° - ${kampas}° = ${180 - kampas}°$.`,
        brezinys: keturkampisApskritime(kampas, kampasB, { a: `${kampas}°`, c: '?' }),
      }),

    // 4. Apibrėžtinio kraštinė
    () => {
      const a = pasirink([5, 6, 7])
      const b = pasirink([7, 9, 10])
      const c = pasirink([8, 11, 12])
      const d = a + c - b
      if (d <= 0 || Math.abs(a - b) >= c) return null
      return uzdavinys(T7, {
        klausimas: `Apibrėžtinio keturkampio kraštinės iš eilės yra $${a}$, $${b}$, $${c}$ ir $x$. Rask $x$.`,
        atsakymas: String(d),
        atsakymasRodymui: `$x = ${d}$`,
        sprendimas: `Apibrėžtiniame keturkampyje priešingų kraštinių sumos lygios: $${a} + ${c} = ${b} + x$, tad $x = ${d}$.`,
        brezinys: apibreztinisKeturkampis([a, b, c, d], {
          a: `${a}`,
          b: `${b}`,
          c: `${c}`,
          d: 'x',
        }),
      })
    },

    // 5. Kampas C iš brėžinio
    () =>
      uzdavinys(T7, {
        klausimas: 'Brėžinyje į apskritimą įbrėžtas keturkampis $ABCD$ su pažymėtu kampu $A$. Rask kampą $C$ laipsniais.',
        atsakymas: '70',
        atsakymasRodymui: '$\\angle C = 70°$',
        sprendimas: '$\\angle A + \\angle C = 180°$, tad $\\angle C = 180° - 110° = 70°$.',
        brezinys: keturkampisApskritime(110, 95, { a: '110°', c: '?' }),
      }),

    // 6. Kampai su nežinomuoju
    () =>
      uzdavinys(T7, {
        klausimas: 'Įbrėžtinio keturkampio kampai yra $A = 2x + 10°$ ir $C = 3x - 5°$. Rask $x$.',
        atsakymas: '35',
        atsakymasRodymui: '$x = 35$',
        sprendimas: 'Iš $2x + 10 + 3x - 5 = 180$ gauname $5x = 175$, tad $x = 35$; kampai lygūs $80°$ ir $100°$.',
        brezinys: keturkampisApskritime(80, 95, { a: '2x + 10°', c: '3x - 5°' }),
      }),

    // 7. Būtinosios savybės patikra
    () => {
      const a = 6
      const b = 9
      const c = 11
      const d = a + c - b
      return uzdavinys(T7, {
        klausimas: `Apibrėžtinio keturkampio kraštinės yra $${a}$, $${b}$, $${c}$ ir $x$. Rask $x$ ir patikrink būtinąją savybę: kokia yra abiejų priešingų kraštinių porų suma?`,
        atsakymas: String(a + c),
        atsakymasRodymui: `$x = ${d}$, o abi sumos lygios $${a + c}$`,
        sprendimas: `$${a} + ${c} = ${a + c}$ ir $${b} + ${d} = ${a + c}$ — sumos sutampa, tad apskritimą įbrėžti galima.`,
        brezinys: apibreztinisKeturkampis([a, b, c, d], {
          a: `${a}`,
          b: `${b}`,
          c: `${c}`,
          d: 'x',
        }),
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Mokinys teigia, kad kiekvienas stačiakampis yra apibrėžtinis apie apskritimą. Kokios papildomos sąlygos reikia?',
        variantai: [
          'Priešingų kraštinių sumos turi būti lygios, o stačiakampyje tai reiškia, kad jis yra kvadratas',
          'Įstrižainės turi būti lygios',
          'Visi kampai turi būti statūs',
          'Papildomų sąlygų nereikia',
        ],
        teisingas: 0,
        sprendimas: 'Stačiakampyje $a + a = b + b$ tik tada, kai $a = b$.',
      }),

    // 9. Įrodymas apie stačiakampį
    () =>
      eiliskumoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Sudėliok įrodymo, kad bet kuris stačiakampis yra įbrėžtinis keturkampis, žingsnius teisinga tvarka.',
        teisingaEile: [
          'Duota: stačiakampis $ABCD$, kurio visi kampai statūs',
          'Priešingų kampų suma lygi $90° + 90° = 180°$',
          'Keturkampis, kurio priešingų kampų suma lygi $180°$, yra įbrėžtinis',
          'Vadinasi, apie kiekvieną stačiakampį galima apibrėžti apskritimą',
        ],
        sprendimas: 'Sąlyga apie priešingų kampų sumą yra ne tik būtina, bet ir pakankama.',
      }),

    // 10. Sudėtinis uždavinys
    () =>
      uzdavinys(T7, {
        klausimas:
          'Įbrėžtiniame keturkampyje $ABCD$ kampas $A$ lygus $95°$, o trikampyje $ABD$ kampas $ABD$ lygus $40°$. Rask kampą $ADB$ laipsniais.',
        atsakymas: '45',
        atsakymasRodymui: '$\\angle ADB = 45°$',
        sprendimas:
          'Trikampio kampų suma lygi $180°$: $180° - 95° - 40° = 45°$. Kampas $C$ tuo tarpu lygus $180° - 95° = 85°$.',
        brezinys: keturkampisApskritime(95, 100, { a: '95°' }),
      }),
  ])
}

// ── 6.8. Geometrinių teiginių įrodymas ──────────────────────────────────────

const T8 = 'geometriniai-irodymai'

const A8 = [
  {
    klausimas: 'Lygiašonio trikampio viršūnės kampas lygus $40°$. Kiek laipsnių yra kiekvienas pamatinis kampas?',
    atsakymas: '70',
    atsakymasRodymui: '$70°$',
    sprendimas: 'Pamatiniai kampai lygūs, tad kiekvienas jų lygus $\\dfrac{180° - 40°}{2} = 70°$.',
  },
] as const

export const geometriniaiIrodymai: Generatorius = () => suBandymais(kurk8, A8, T8)

function kurk8(): Uzdavinys | null {
  const virsune = pasirink([30, 40, 50, 80, 100])

  return variacija([
    // 1. Lygiašonio trikampio pamatiniai kampai
    () => {
      if ((180 - virsune) % 2 !== 0) return null
      return uzdavinys(T8, {
        klausimas: `Įrodyta, kad lygiašonio trikampio pamatiniai kampai lygūs. Kiek laipsnių yra kiekvienas jų, jei viršūnės kampas lygus $${virsune}°$?`,
        atsakymas: String((180 - virsune) / 2),
        atsakymasRodymui: `$${(180 - virsune) / 2}°$`,
        sprendimas: `Kampų suma lygi $180°$, o pamatiniai kampai lygūs: $${tr(`180° - ${virsune}°`, '2')} = ${(180 - virsune) / 2}°$.`,
      })
    },

    // 2. Stačiakampio įstrižainės
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kaip įrodoma, kad stačiakampio įstrižainės lygios?',
        variantai: [
          'Trikampiai $ABC$ ir $BAD$ lygūs pagal dvi kraštines ir kampą tarp jų, tad ir įstrižainės $AC$ ir $BD$ lygios',
          'Įstrižainės lygios pagal apibrėžimą',
          'Nes stačiakampio kampai statūs, tad įstrižainės statmenos',
          'Nes įstrižainės dalija stačiakampį pusiau',
        ],
        teisingas: 0,
        sprendimas: 'Abiejuose trikampiuose yra ta pati kraštinė $AB$, lygios kraštinės $BC = AD$ ir statūs kampai tarp jų.',
      }),

    // 3. Įbrėžtinio keturkampio kampai
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuo remiantis pagrindžiama, kad įbrėžtinio keturkampio priešingų kampų suma lygi $180°$?',
        variantai: [
          'Įbrėžtinis kampas lygus pusei lanko, o priešingi kampai remiasi į du lankus, sudarančius visą apskritimą',
          'Keturkampio kampų suma lygi $360°$, tad kiekvieni du duoda $180°$',
          'Priešingi kampai visada lygūs',
          'Nes apskritimas turi $360°$',
        ],
        teisingas: 0,
        brezinys: keturkampisApskritime(110, 95, { a: 'α', c: 'γ' }),
        sprendimas: 'Du lankai kartu sudaro $360°$, tad kampų suma lygi $\\dfrac{360°}{2} = 180°$.',
      }),

    // 4. Pavyzdys ir įrodymas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuo pavyzdžio patikrinimas skiriasi nuo bendro matematinio įrodymo?',
        variantai: [
          'Pavyzdys parodo, kad teiginys galioja vienu atveju, o įrodymas — kad jis galioja visais',
          'Pavyzdys yra tikslesnis už įrodymą',
          'Įrodymas reikalingas tik geometrijoje',
          'Skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Vieno pavyzdžio pakanka tik teiginiui paneigti, bet ne patvirtinti.',
      }),

    // 5. Įrodymo dalys
    () =>
      eiliskumoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Sudėliok įrodymo dalis teisinga tvarka.',
        teisingaEile: [
          'Duota — kas žinoma iš sąlygos',
          'Reikia įrodyti — koks teiginys tikrinamas',
          'Taikoma savybė arba teorema',
          'Išvada — teiginys įrodytas',
        ],
        sprendimas: 'Įrodymas visada prasideda nuo duomenų ir baigiasi išvada; savybės naudojamos tarp jų.',
      }),

    // 6. Lygiašonio trikampio pusiaukampinė
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kaip įrodoma, kad lygiašonio trikampio viršūnės kampo pusiaukampinė kartu yra ir pusiaukraštinė, ir aukštinė?',
        variantai: [
          'Ji dalija trikampį į du lygius trikampius, tad pamato dalys lygios, o gretutiniai kampai prie pamato lygūs ir sudaro $180°$, vadinasi, statūs',
          'Nes visos trys linijos visada sutampa',
          'Nes pamatiniai kampai lygūs',
          'Nes pusiaukampinė yra ir simetrijos ašis, o daugiau nieko įrodyti nereikia',
        ],
        teisingas: 0,
        brezinys: trikampisPusiaukampine(9, 9, 10, { ab: 'AB', ac: 'AC' }),
        sprendimas: 'Iš trikampių lygumo išplaukia ir kraštinių, ir kampų lygybė, o iš jos — abi savybės.',
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Norėdamas įrodyti teiginį, mokinys patikrino tik vieną konkretų brėžinį. Kodėl to nepakanka?',
        variantai: [
          'Nes teiginys turi galioti visiems tokio tipo brėžiniams, o vienas atvejis kitų neapima',
          'Nes brėžinys buvo netikslus',
          'Nes reikėjo patikrinti bent tris brėžinius',
          'Nes brėžiniuose matavimai visada klaidingi',
        ],
        teisingas: 0,
        sprendimas: 'Bendram teiginiui reikia samprotavimo, tinkančio bet kuriai figūrai, o ne vienos iliustracijos.',
      }),

    // 8. Rombo įstrižainės
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuo remiantis įrodoma, kad rombo įstrižainės statmenos?',
        variantai: [
          'Rombas yra lygiašonių trikampių pora, o įstrižainė yra jų viršūnės kampo pusiaukampinė, tad kartu ir aukštinė',
          'Nes rombo kampai statūs',
          'Nes įstrižainės lygios',
          'Nes rombas yra kvadratas',
        ],
        teisingas: 0,
        sprendimas: 'Iš lygiašonio trikampio savybės išplaukia, kad ta pati atkarpa yra ir aukštinė, tad kampas tarp įstrižainių statusis.',
      }),

    // 9. Tiesioginis įrodymas apie stačiojo trikampio centrą
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuris samprotavimas įrodo, kad apie statųjį trikampį apibrėžto apskritimo centras yra įžambinės vidurio taškas?',
        variantai: [
          'Statusis įbrėžtinis kampas remiasi į skersmenį, tad įžambinė yra skersmuo, o jos vidurys — centras',
          'Nes įžambinė yra ilgiausia kraštinė',
          'Nes statiniai lygūs',
          'Nes centras visada yra ilgiausios kraštinės viduryje',
        ],
        teisingas: 0,
        brezinys: trikampisSuApskritimu('apibreztas', [6, 8, 10], { spindulys: 'R' }),
        sprendimas: 'Teorema apie įbrėžtinį kampą veikia abiem kryptimis, tad statusis kampas ir skersmuo susiję vienareikšmiškai.',
      }),

    // 10. Įrodymo sandara
    () =>
      poruUzdavinys(naujasId(T8), T8, {
        klausimas: 'Teiginiui „lygiašonio trikampio pamatiniai kampai lygūs“ susiek įrodymo dalį su jos turiniu.',
        poros: [
          { kaire: 'Duota', desine: 'trikampis $ABC$, kuriame $AB = AC$' },
          { kaire: 'Reikia įrodyti', desine: '$\\angle B = \\angle C$' },
          { kaire: 'Naudojama savybė', desine: 'trikampių lygumas pagal dvi kraštines ir kampą tarp jų' },
        ],
        sprendimas: 'Nubrėžus viršūnės kampo pusiaukampinę, gaunami du lygūs trikampiai, o iš jų lygumo — kampų lygybė.',
      }),
  ])
}
