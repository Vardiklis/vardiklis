import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { brezinuEile, kampas, planas, type PlanoLangelis } from './antroku-figuru-vaizdai'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import {
  apskritimasSuMatu,
  apskritimoBrezinys,
  brezinukuEile,
  dviDalys,
  erdvesFigura,
  figuruPadetis,
  gretasienis,
  kubeliuStatinys,
  postumisTinklelyje,
  simetrijaTinklelyje,
  suskaidytasStaciakampis,
  tiesiuPora,
  vienasBrezinys,
  type Padetis,
  type TiesiuPadetis,
} from './treciokams-geometrija-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 3 klasės tema „Geometrinės figūros“ — dvylika potemių.
 *
 * Anksčiau jos rėmėsi septyniais bendraisiais generatoriais, iš kurių dalis
 * skirta vyresnėms klasėms: `koordinates` duodavo koordinačių plokštumą su
 * neigiamais skaičiais, `kampai` — kampų sumas laipsniais, `apskritimas` —
 * skritulio plotą su $\pi$.
 *
 * Beveik visi šios temos klausimai yra apie tai, ką mokinys mato, tad
 * kiekvienas uždavinys turi brėžinį, o klausimo tekstas neįvardija to, ką iš
 * brėžinio reikia nustatyti.
 */

// Prie pat 90° smailųjį nuo stačiojo galima atskirti tik matlankiu, o šioje
// potemėje rūšis nustatoma akimi, tad palikta aiški atsarga į abi puses.
const KAMPU_RIBOS = {
  smailusis: [25, 65],
  statusis: [90, 90],
  bukasis: [115, 155],
} as const

type KampoRusis = keyof typeof KAMPU_RIBOS

function kampoLaipsniai(rusis: KampoRusis): number {
  const [min, maks] = KAMPU_RIBOS[rusis]
  return min === maks ? min : atsitiktinis(min, maks)
}

const KAMPO_VARDAS: Record<KampoRusis, string> = {
  smailusis: 'smailusis',
  statusis: 'statusis',
  bukasis: 'bukasis',
}

/** Kilmininko daugiskaita: „kiek stačiųjų kampų“, o ne „kiek statusis kampų“. */
const KAMPO_KILM: Record<KampoRusis, string> = {
  smailusis: 'smailiųjų',
  statusis: 'stačiųjų',
  bukasis: 'bukųjų',
}

// ── 3.1 Kokių būna kampų? ───────────────────────────────────────────────────

const A_KAMPAI = [
  {
    klausimas: 'Kaip vadinamas kampas, kuris mažesnis už statųjį?',
    atsakymas: 'smailusis',
    atsakymasRodymui: 'smailusis',
    sprendimas: 'Už statųjį mažesnis kampas vadinamas smailiuoju.',
  },
] as const

export const kampuRusys: Generatorius = () => suBandymais(kurkKampus, A_KAMPAI, 'kampu-rusys')

function kurkKampus(): Uzdavinys | null {
  const rusys: KampoRusis[] = ['smailusis', 'statusis', 'bukasis']

  return variacija([
    // 1. Koks kampas nubrėžtas
    () => {
      const rusis = pasirink(rusys)
      const blogos = rusys.filter((r) => r !== rusis)
      return pasirinkimoUzdavinys(naujasId('kampu-rusys'), 'kampu-rusys', {
        // Laipsniai neįvardijami: kampo rūšį reikia nustatyti iš brėžinio.
        klausimas: 'Koks kampas nubrėžtas?',
        variantai: [KAMPO_VARDAS[rusis], ...blogos.map((r) => KAMPO_VARDAS[r])],
        teisingas: 0,
        sprendimas:
          rusis === 'statusis'
            ? 'Kampo kraštinės statmenos — tai statusis kampas.'
            : `Kampas ${rusis === 'smailusis' ? 'siauresnis' : 'platesnis'} už statųjį, tad jis ${
                KAMPO_VARDAS[rusis]
              }.`,
        brezinys: vienasBrezinys(kampas(kampoLaipsniai(rusis), 'A')),
      })
    },

    // 2. Kuriame brėžinyje nurodytos rūšies kampas
    () => {
      const eile = sumaisyk<KampoRusis>(['smailusis', 'statusis', 'bukasis'])
      const iesk = pasirink(rusys)
      const vieta = eile.indexOf(iesk) + 1
      return uzdavinys('kampu-rusys', {
        klausimas: `Kuriame brėžinyje pavaizduotas ${KAMPO_VARDAS[iesk]} kampas? Parašyk brėžinio numerį.`,
        atsakymas: String(vieta),
        atsakymasRodymui: `$${vieta}$`,
        sprendimas:
          iesk === 'statusis'
            ? 'Statusis kampas yra toks, kurio kraštinės statmenos.'
            : `Ieškomas kampas, ${iesk === 'smailusis' ? 'siauresnis' : 'platesnis'} už statųjį.`,
        brezinys: brezinuEile(eile.map((r) => kampas(kampoLaipsniai(r), 'A'))),
      })
    },

    // 3. Kiek stačiųjų kampų figūroje
    () => {
      const figura = pasirink([
        { vardas: 'stačiakampyje', kiek: 4 },
        { vardas: 'kvadrate', kiek: 4 },
        { vardas: 'stačiajame trikampyje', kiek: 1 },
      ])
      return uzdavinys('kampu-rusys', {
        klausimas: `Kiek stačiųjų kampų yra ${figura.vardas}?`,
        atsakymas: String(figura.kiek),
        atsakymasRodymui: `$${figura.kiek}$`,
        sprendimas:
          figura.kiek === 4
            ? 'Visi keturi kampai statūs.'
            : 'Statusis kampas trikampyje gali būti tik vienas.',
      })
    },

    // 4. Kampų rūšių susiejimas
    () =>
      poruUzdavinys(naujasId('kampu-rusys'), 'kampu-rusys', {
        klausimas: 'Sujunk kampo rūšį su jos apibūdinimu.',
        poros: [
          { kaire: 'smailusis', desine: 'mažesnis už statųjį' },
          { kaire: 'statusis', desine: 'kraštinės statmenos' },
          { kaire: 'bukasis', desine: 'didesnis už statųjį' },
        ],
        sprendimas: 'Visos kampų rūšys lyginamos su stačiuoju kampu.',
      }),

    // 5. Kiek kurios rūšies kampų brėžinyje
    () => {
      const eile = sumaisyk<KampoRusis>(['smailusis', 'statusis', 'bukasis', 'smailusis'])
      const iesk = pasirink(rusys)
      const kiek = eile.filter((r) => r === iesk).length
      if (kiek === 0) return null
      return uzdavinys('kampu-rusys', {
        klausimas: `Kiek brėžinyje yra ${KAMPO_KILM[iesk]} kampų?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `Kiekvienas kampas lyginamas su stačiuoju — tokių yra ${kiek}.`,
        brezinys: brezinuEile(eile.map((r) => kampas(kampoLaipsniai(r), 'A'))),
      })
    },

    // 6. Teiginio tikrinimas
    () =>
      pasirinkimoUzdavinys(naujasId('kampu-rusys'), 'kampu-rusys', {
        klausimas: 'Kuris teiginys apie kampus teisingas?',
        variantai: [
          'bukasis kampas didesnis už statųjį',
          'smailusis kampas didesnis už statųjį',
          'visi kampai yra statūs',
        ],
        teisingas: 0,
        sprendimas: 'Bukasis kampas platesnis už statųjį, o smailusis — siauresnis.',
      }),
  ])
}

// ── 3.2 Susikertančios, statmenos, lygiagrečios ─────────────────────────────

const PADETIES_VARDAS: Record<TiesiuPadetis, string> = {
  lygiagrecios: 'lygiagrečios',
  statmenos: 'statmenos',
  susikertancios: 'susikertančios',
}

const A_TIESES = [
  {
    klausimas: 'Kaip vadinamos tiesės, kurios niekada nesusikerta?',
    atsakymas: 'lygiagrečios',
    atsakymasRodymui: 'lygiagrečios',
    sprendimas: 'Niekada nesusikertančios tiesės vadinamos lygiagrečiomis.',
  },
] as const

export const tiesiuPadetys: Generatorius = () =>
  suBandymais(kurkTieses, A_TIESES, 'tiesiu-padetys')

function kurkTieses(): Uzdavinys | null {
  const visos: TiesiuPadetis[] = ['lygiagrecios', 'statmenos', 'susikertancios']

  return variacija([
    // 1. Kaip išsidėsčiusios tiesės
    () => {
      const padetis = pasirink(visos)
      const blogos = visos.filter((p) => p !== padetis)
      return pasirinkimoUzdavinys(naujasId('tiesiu-padetys'), 'tiesiu-padetys', {
        klausimas: 'Kaip išsidėsčiusios brėžinio tiesės?',
        variantai: [PADETIES_VARDAS[padetis], ...blogos.map((p) => PADETIES_VARDAS[p])],
        teisingas: 0,
        sprendimas:
          padetis === 'lygiagrecios'
            ? 'Tiesės niekur nesusikerta ir visur vienodai nutolusios.'
            : padetis === 'statmenos'
              ? 'Tiesės susikerta stačiuoju kampu.'
              : 'Tiesės susikerta, bet ne stačiuoju kampu.',
        brezinys: vienasBrezinys(tiesiuPora(padetis, atsitiktinis(0, 3) * 15)),
      })
    },

    // 2. Kuriame brėžinyje
    () => {
      const eile = sumaisyk<TiesiuPadetis>(['lygiagrecios', 'statmenos', 'susikertancios'])
      const iesk = pasirink(visos)
      const vieta = eile.indexOf(iesk) + 1
      return uzdavinys('tiesiu-padetys', {
        klausimas: `Kuriame brėžinyje tiesės ${PADETIES_VARDAS[iesk]}? Parašyk brėžinio numerį.`,
        atsakymas: String(vieta),
        atsakymasRodymui: `$${vieta}$`,
        sprendimas:
          iesk === 'statmenos'
            ? 'Statmenų tiesių sankirtoje yra statusis kampas.'
            : iesk === 'lygiagrecios'
              ? 'Lygiagrečios tiesės niekur nesusikerta.'
              : 'Susikertančios tiesės turi bendrą tašką, bet kampas nėra statusis.',
        brezinys: brezinukuEile(eile.map((p) => tiesiuPora(p, atsitiktinis(0, 3) * 15))),
      })
    },

    // 3. Ar statmenos yra ir susikertančios
    () =>
      pasirinkimoUzdavinys(naujasId('tiesiu-padetys'), 'tiesiu-padetys', {
        klausimas: 'Ar statmenos tiesės yra ir susikertančios?',
        variantai: [
          'taip, jos susikerta stačiuoju kampu',
          'ne, statmenos tiesės nesusikerta',
          'taip, bet tik tada, kai jos lygiagrečios',
        ],
        teisingas: 0,
        sprendimas: 'Statmenos tiesės turi bendrą tašką, tad jos susikerta — ir dar stačiuoju kampu.',
      }),

    // 4. Stačiakampio kraštinės
    () =>
      pasirinkimoUzdavinys(naujasId('tiesiu-padetys'), 'tiesiu-padetys', {
        klausimas: 'Kokios tarpusavyje yra dvi priešingos stačiakampio kraštinės?',
        variantai: ['lygiagrečios', 'statmenos', 'susikertančios'],
        teisingas: 0,
        sprendimas: 'Priešingos stačiakampio kraštinės niekur nesusikerta, o gretimos yra statmenos.',
      }),

    // 5. Kiek porų lygiagrečių kraštinių
    () => {
      const figura = pasirink([
        { vardas: 'stačiakampyje', poru: 2 },
        { vardas: 'kvadrate', poru: 2 },
        { vardas: 'trikampyje', poru: 0 },
      ])
      return uzdavinys('tiesiu-padetys', {
        klausimas: `Kiek porų lygiagrečių kraštinių yra ${figura.vardas}?`,
        atsakymas: String(figura.poru),
        atsakymasRodymui: `$${figura.poru}$`,
        sprendimas:
          figura.poru === 0
            ? 'Trikampio kraštinės viena kitos atžvilgiu lygiagrečios nėra.'
            : 'Lygiagrečios yra abi priešingų kraštinių poros.',
      })
    },

    // 6. Susiejimas su apibūdinimu
    () =>
      poruUzdavinys(naujasId('tiesiu-padetys'), 'tiesiu-padetys', {
        klausimas: 'Sujunk tiesių padėtį su jos apibūdinimu.',
        poros: [
          { kaire: 'lygiagrečios', desine: 'niekur nesusikerta' },
          { kaire: 'statmenos', desine: 'susikerta stačiuoju kampu' },
          { kaire: 'susikertančios', desine: 'turi vieną bendrą tašką' },
        ],
        sprendimas: 'Skiriamasis požymis yra bendras taškas ir kampas tarp tiesių.',
      }),
  ])
}

// ── 3.3 Apskritimo centras ir spindulys ─────────────────────────────────────

const A_SPINDULYS = [
  {
    klausimas: 'Kaip vadinamas atkarpa nuo apskritimo centro iki apskritimo taško?',
    atsakymas: 'spindulys',
    atsakymasRodymui: 'spindulys',
    sprendimas: 'Tokia atkarpa vadinama spinduliu.',
  },
] as const

export const apskritimoSpindulys: Generatorius = () =>
  suBandymais(kurkSpinduli, A_SPINDULYS, 'apskritimo-spindulys')

function kurkSpinduli(): Uzdavinys | null {
  const r = atsitiktinis(2, 9)

  return variacija([
    // 1. Kas pažymėta brėžinyje
    () =>
      pasirinkimoUzdavinys(naujasId('apskritimo-spindulys'), 'apskritimo-spindulys', {
        klausimas: 'Kas pažymėta apskritimo brėžinyje spalvota atkarpa?',
        variantai: ['spindulys', 'skersmuo', 'apskritimo centras'],
        teisingas: 0,
        sprendimas: 'Atkarpa eina nuo centro O iki apskritimo taško A — tai spindulys.',
        brezinys: vienasBrezinys(apskritimoBrezinys('spindulys')),
      }),

    // 2. Kiek spindulių galima nubrėžti
    () =>
      pasirinkimoUzdavinys(naujasId('apskritimo-spindulys'), 'apskritimo-spindulys', {
        klausimas: 'Kiek skirtingų spindulių galima nubrėžti viename apskritime?',
        variantai: ['be galo daug', 'tik vieną', 'tik keturis'],
        teisingas: 0,
        sprendimas: 'Spindulį galima nubrėžti į kiekvieną apskritimo tašką, o jų yra be galo daug.',
      }),

    // 3. Visi spinduliai vienodi
    () =>
      uzdavinys('apskritimo-spindulys', {
        klausimas: `Vieno apskritimo spindulys yra ${r} cm. Koks bus kito to paties apskritimo spindulio ilgis centimetrais?`,
        atsakymas: String(r),
        atsakymasRodymui: `$${r}$ cm`,
        sprendimas: 'Visi to paties apskritimo spinduliai vienodo ilgio.',
      }),

    // 4. Atstumas nuo centro
    () =>
      uzdavinys('apskritimo-spindulys', {
        klausimas: 'Koks yra brėžinyje pažymėtos atkarpos ilgis centimetrais?',
        atsakymas: String(r),
        atsakymasRodymui: `$${r}$ cm`,
        sprendimas: 'Ilgis užrašytas prie pačios atkarpos.',
        brezinys: apskritimasSuMatu('spindulys', r),
      }),

    // 5. Centro atpažinimas
    () =>
      pasirinkimoUzdavinys(naujasId('apskritimo-spindulys'), 'apskritimo-spindulys', {
        klausimas: 'Kur yra apskritimo centras?',
        variantai: [
          'taške, vienodai nutolusiame nuo visų apskritimo taškų',
          'bet kuriame apskritimo taške',
          'ten, kur susikerta dvi kraštinės',
        ],
        teisingas: 0,
        sprendimas: 'Nuo centro iki bet kurio apskritimo taško atstumas vienodas — tai spindulys.',
        brezinys: vienasBrezinys(apskritimoBrezinys('centras')),
      }),

    // 6. Brėžimas skriestuvu
    () =>
      uzdavinys('apskritimo-spindulys', {
        klausimas: `Skriestuvo kojelės išskėstos ${r} cm. Kokio ilgio spindulio apskritimą nubrėši centimetrais?`,
        atsakymas: String(r),
        atsakymasRodymui: `$${r}$ cm`,
        sprendimas: 'Skriestuvo kojelių atstumas ir yra apskritimo spindulys.',
      }),
  ])
}

// ── 3.4 Apskritimo skersmuo ─────────────────────────────────────────────────

const A_SKERSMUO = [
  {
    klausimas: 'Apskritimo spindulys yra 3 cm. Koks jo skersmuo centimetrais?',
    atsakymas: '6',
    atsakymasRodymui: '$6$ cm',
    sprendimas: 'Skersmuo dvigubai ilgesnis už spindulį: $3 \\cdot 2 = 6$.',
  },
] as const

export const apskritimoSkersmuo: Generatorius = () =>
  suBandymais(kurkSkersmeni, A_SKERSMUO, 'apskritimo-skersmuo')

function kurkSkersmeni(): Uzdavinys | null {
  const r = atsitiktinis(2, 9)
  const d = r * 2

  return variacija([
    // 1. Kas pažymėta
    () =>
      pasirinkimoUzdavinys(naujasId('apskritimo-skersmuo'), 'apskritimo-skersmuo', {
        klausimas: 'Kas pažymėta apskritimo brėžinyje spalvota atkarpa?',
        variantai: ['skersmuo', 'spindulys', 'apskritimo centras'],
        teisingas: 0,
        sprendimas: 'Atkarpa eina per centrą nuo taško A iki taško B — tai skersmuo.',
        brezinys: vienasBrezinys(apskritimoBrezinys('skersmuo')),
      }),

    // 2. Iš spindulio į skersmenį
    () =>
      uzdavinys('apskritimo-skersmuo', {
        klausimas: `Apskritimo spindulys ${r} cm. Koks jo skersmuo centimetrais?`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}$ cm`,
        sprendimas: `Skersmuo — du spinduliai: $${r} \\cdot 2 = ${d}$.`,
      }),

    // 3. Iš skersmens į spindulį
    () =>
      uzdavinys('apskritimo-skersmuo', {
        klausimas: `Apskritimo skersmuo ${d} cm. Koks jo spindulys centimetrais?`,
        atsakymas: String(r),
        atsakymasRodymui: `$${r}$ cm`,
        sprendimas: `Spindulys — pusė skersmens: $${d} : 2 = ${r}$.`,
      }),

    // 4. Skersmuo iš brėžinio
    () =>
      uzdavinys('apskritimo-skersmuo', {
        klausimas: 'Brėžinyje užrašytas skersmuo. Koks yra šio apskritimo spindulys centimetrais?',
        atsakymas: String(r),
        atsakymasRodymui: `$${r}$ cm`,
        sprendimas: `$${d} : 2 = ${r}$.`,
        brezinys: apskritimasSuMatu('skersmuo', d),
      }),

    // 5. Kuris teiginys teisingas
    () =>
      pasirinkimoUzdavinys(naujasId('apskritimo-skersmuo'), 'apskritimo-skersmuo', {
        klausimas: 'Kuris teiginys apie skersmenį teisingas?',
        variantai: [
          'skersmuo eina per centrą ir yra dvigubai ilgesnis už spindulį',
          'skersmuo yra dvigubai trumpesnis už spindulį',
          'skersmuo per centrą neina',
        ],
        teisingas: 0,
        sprendimas: 'Skersmuo sudarytas iš dviejų spindulių, sudėtų per centrą.',
      }),

    // 6. Klaidos radimas
    () => {
      const blogas = r + 2
      return pasirinkimoUzdavinys(naujasId('apskritimo-skersmuo'), 'apskritimo-skersmuo', {
        klausimas: `Apskritimo skersmuo ${d} cm. Mokinys sako, kad spindulys yra ${blogas} cm. Ar teisingai?`,
        variantai: [`ne, spindulys yra ${r} cm`, 'taip, teisingai', 'negalima apskaičiuoti'],
        teisingas: 0,
        sprendimas: `Spindulys yra pusė skersmens: $${d} : 2 = ${r}$.`,
      })
    },
  ])
}

// ── 3.5 Figūrų tarpusavio padėtis ───────────────────────────────────────────

const PADETIES_TEKSTAS: Record<Padetis, string> = {
  viduje: 'apskritimas yra kvadrato viduje',
  isore: 'figūros neturi bendrų taškų',
  kertasi: 'figūrų kontūrai susikerta',
  liecia: 'figūros liečiasi vienu tašku',
}

const A_PADETIS = [
  {
    klausimas: 'Kaip vadinama padėtis, kai viena figūra yra kitos viduje?',
    atsakymas: 'viduje',
    atsakymasRodymui: 'viduje',
    sprendimas: 'Figūra yra kitos figūros viduje.',
  },
] as const

export const figuruPadetys: Generatorius = () =>
  suBandymais(kurkPadeti, A_PADETIS, 'figuru-padetys')

function kurkPadeti(): Uzdavinys | null {
  const visos: Padetis[] = ['viduje', 'isore', 'kertasi', 'liecia']

  return variacija([
    // 1. Kokia padėtis brėžinyje
    () => {
      const padetis = pasirink(visos)
      const blogos = sumaisyk(visos.filter((p) => p !== padetis)).slice(0, 2)
      return pasirinkimoUzdavinys(naujasId('figuru-padetys'), 'figuru-padetys', {
        klausimas: 'Kaip viena kitos atžvilgiu išsidėsčiusios brėžinio figūros?',
        variantai: [PADETIES_TEKSTAS[padetis], ...blogos.map((p) => PADETIES_TEKSTAS[p])],
        teisingas: 0,
        sprendimas: `Brėžinyje matyti, kad ${PADETIES_TEKSTAS[padetis]}.`,
        brezinys: vienasBrezinys(figuruPadetis(padetis)),
      })
    },

    // 2. Kuriame brėžinyje
    () => {
      const eile = sumaisyk(visos).slice(0, 3)
      const iesk = pasirink(eile)
      const vieta = eile.indexOf(iesk) + 1
      return uzdavinys('figuru-padetys', {
        klausimas: `Kuriame brėžinyje ${PADETIES_TEKSTAS[iesk]}? Parašyk brėžinio numerį.`,
        atsakymas: String(vieta),
        atsakymasRodymui: `$${vieta}$`,
        sprendimas: 'Reikia palyginti figūrų kontūrus: ar jie kertasi, liečiasi, ar visai atskiri.',
        brezinys: brezinukuEile(eile.map((p) => figuruPadetis(p))),
      })
    },

    // 3. Kiek bendrų taškų
    () => {
      const padetis = pasirink<Padetis>(['isore', 'liecia'])
      const kiek = padetis === 'isore' ? 0 : 1
      return uzdavinys('figuru-padetys', {
        klausimas: 'Kiek bendrų taškų turi brėžinio figūros?',
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas:
          kiek === 0
            ? 'Figūros viena kitos neliečia, tad bendrų taškų nėra.'
            : 'Figūros susiliečia lygiai viename taške.',
        brezinys: vienasBrezinys(figuruPadetis(padetis)),
      })
    },

    // 4. Susiejimas
    () =>
      poruUzdavinys(naujasId('figuru-padetys'), 'figuru-padetys', {
        klausimas: 'Sujunk figūrų padėtį su jos apibūdinimu.',
        poros: [
          { kaire: 'viduje', desine: 'viena figūra visa kitos viduje' },
          { kaire: 'liečiasi', desine: 'vienas bendras taškas' },
          { kaire: 'atskirai', desine: 'bendrų taškų nėra' },
        ],
        sprendimas: 'Padėtis nustatoma pagal bendrų taškų skaičių.',
      }),

    // 5. Teiginio tikrinimas
    () =>
      pasirinkimoUzdavinys(naujasId('figuru-padetys'), 'figuru-padetys', {
        klausimas: 'Ar brėžinio figūros turi bendrų taškų?',
        variantai: ['taip, jų kontūrai susikerta', 'ne, bendrų taškų nėra', 'turi lygiai vieną'],
        teisingas: 0,
        sprendimas: 'Kontūrai persikerta, tad bendrų taškų yra.',
        brezinys: vienasBrezinys(figuruPadetis('kertasi')),
      }),

    // 6. Kur padėti figūrą
    () =>
      pasirinkimoUzdavinys(naujasId('figuru-padetys'), 'figuru-padetys', {
        klausimas: 'Kur reikia nubraižyti apskritimą, kad jis su kvadratu neturėtų nė vieno bendro taško?',
        variantai: ['visiškai už kvadrato ribų', 'kvadrato viduje', 'ant kvadrato kraštinės'],
        teisingas: 0,
        sprendimas: 'Bendrų taškų nebus tik tada, kai figūros visai atskiros.',
      }),
  ])
}

// ── 3.6 Figūros suskaidymas ir sujungimas ───────────────────────────────────

const A_SKAIDYMAS = [
  {
    klausimas: 'Į kiek trikampių padalija stačiakampį viena jo įstrižainė?',
    atsakymas: '2',
    atsakymasRodymui: '$2$',
    sprendimas: 'Įstrižainė perkerta stačiakampį į du vienodus trikampius.',
  },
] as const

export const figuruSkaidymas: Generatorius = () =>
  suBandymais(kurkSkaidyma, A_SKAIDYMAS, 'figuru-skaidymas')

function kurkSkaidyma(): Uzdavinys | null {
  return variacija([
    // 1. Į kiek dalių suskaidyta
    () => {
      const kaip = pasirink([
        { k: 'per-istrizaine' as const, daliu: 2, kas: 'trikampiai' },
        { k: 'per-vidurio-linija' as const, daliu: 2, kas: 'stačiakampiai' },
        { k: 'i-keturis' as const, daliu: 4, kas: 'stačiakampiai' },
      ])
      return uzdavinys('figuru-skaidymas', {
        // Skaidymo būdas tekste neįvardijamas — jį reikia pamatyti brėžinyje.
        klausimas: 'Į kiek dalių brūkšninės linijos padalija stačiakampį?',
        atsakymas: String(kaip.daliu),
        atsakymasRodymui: `$${kaip.daliu}$`,
        sprendimas: `Gaunami ${kaip.daliu} ${kaip.kas}.`,
        brezinys: vienasBrezinys(suskaidytasStaciakampis(kaip.k)),
      })
    },

    // 2. Kokios figūros gaunamos
    () =>
      pasirinkimoUzdavinys(naujasId('figuru-skaidymas'), 'figuru-skaidymas', {
        klausimas: 'Kokios figūros gaunamos padalijus stačiakampį taip, kaip parodyta brėžinyje?',
        variantai: ['du trikampiai', 'du kvadratai', 'trys stačiakampiai'],
        teisingas: 0,
        sprendimas: 'Įstrižainė perkerta stačiakampį per priešingas viršūnes — gaunami trikampiai.',
        brezinys: vienasBrezinys(suskaidytasStaciakampis('per-istrizaine')),
      }),

    // 3. Kas gaunama sudėjus dvi dalis
    () => {
      const kaip = pasirink(['du-trikampiai', 'du-staciakampiai'] as const)
      return pasirinkimoUzdavinys(naujasId('figuru-skaidymas'), 'figuru-skaidymas', {
        klausimas: 'Kokia figūra gaunama sudėjus abi brėžinio dalis?',
        variantai:
          kaip === 'du-trikampiai'
            ? ['stačiakampis', 'trikampis', 'penkiakampis']
            : ['stačiakampis', 'trikampis', 'apskritimas'],
        teisingas: 0,
        sprendimas:
          kaip === 'du-trikampiai'
            ? 'Du vienodi stačiakampiai trikampiai sudedami į stačiakampį.'
            : 'Du vienodi stačiakampiai, sustatyti greta, sudaro didesnį stačiakampį.',
        brezinys: vienasBrezinys(dviDalys(kaip)),
      })
    },

    // 4. Kiek pjūvių reikia
    () => {
      const daliu = pasirink([2, 3, 4])
      return uzdavinys('figuru-skaidymas', {
        klausimas: `Kiek tiesių pjūvių reikia, kad juostą padalytum į ${daliu} dalis?`,
        atsakymas: String(daliu - 1),
        atsakymasRodymui: `$${daliu - 1}$`,
        sprendimas: `Kiekvienas pjūvis prideda po vieną dalį: $${daliu} - 1 = ${daliu - 1}$.`,
      })
    },

    // 5. Kiek kvadratų gaunama
    () => {
      const eiluciu = atsitiktinis(2, 4)
      const stulpeliu = atsitiktinis(2, 5)
      return uzdavinys('figuru-skaidymas', {
        klausimas: `Stačiakampis padalytas į ${eiluciu} eilutes ir ${stulpeliu} stulpelius vienodų langelių. Kiek langelių gavosi?`,
        atsakymas: String(eiluciu * stulpeliu),
        atsakymasRodymui: `$${eiluciu * stulpeliu}$`,
        sprendimas: `$${eiluciu} \\cdot ${stulpeliu} = ${eiluciu * stulpeliu}$.`,
      })
    },

    // 6. Ar galima sudėti
    () =>
      pasirinkimoUzdavinys(naujasId('figuru-skaidymas'), 'figuru-skaidymas', {
        klausimas: 'Iš kokių figūrų galima sudėlioti kvadratą?',
        variantai: [
          'iš keturių vienodų mažesnių kvadratų',
          'iš trijų vienodų apskritimų',
          'iš dviejų nevienodų apskritimų',
        ],
        teisingas: 0,
        sprendimas: 'Keturi vienodi kvadratai sustatomi po du į dvi eilutes.',
      }),
  ])
}

// ── 3.7 Simetriška figūra ───────────────────────────────────────────────────

/** Nesimetriškos figūros tinklelyje — kad atspindys būtų tikrai kitoks. */
const FIGUROS: readonly { x: number; y: number }[][] = [
  [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 3, y: 2 },
    { x: 2, y: 2 },
    { x: 2, y: 4 },
    { x: 1, y: 4 },
  ],
  [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 3, y: 3 },
    { x: 1, y: 4 },
  ],
  [
    { x: 1, y: 1 },
    { x: 3, y: 2 },
    { x: 3, y: 4 },
    { x: 1, y: 3 },
  ],
]

const A_SIMETRIJA = [
  {
    klausimas: 'Kiek simetrijos ašių turi kvadratas?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Kvadratas turi dvi vidurio linijas ir dvi įstrižaines — iš viso keturias ašis.',
  },
] as const

export const simetriskaFigura: Generatorius = () =>
  suBandymais(kurkSimetrija, A_SIMETRIJA, 'simetriska-figura')

function kurkSimetrija(): Uzdavinys | null {
  const taskai = pasirink(FIGUROS)
  const asisX = 5

  return variacija([
    // 1. Kiek skirs viršūnę ir jos atspindį
    () => {
      const arciausia = Math.max(...taskai.map((p) => p.x))
      const atstumas = asisX - arciausia
      return uzdavinys('simetriska-figura', {
        // Atspindys nepiešiamas: kaip tik jį mokinys ir turi įsivaizduoti.
        // Skaičiuojama nuo ašies, o ne nuo tinklelio krašto — atstumas iki
        // ašies matomas iš karto, o langelių skaičiavimas nuo krašto tik
        // paverčia uždavinį painia aritmetika.
        klausimas:
          'Figūra atspindima brūkšninės ašies atžvilgiu. Per kiek langelių viena nuo kitos bus nutolusios arčiausiai ašies esanti viršūnė ir jos atspindys?',
        atsakymas: String(2 * atstumas),
        atsakymasRodymui: `$${2 * atstumas}$`,
        sprendimas: `Iki ašies ta viršūnė nutolusi per ${atstumas} langelius, o jos atspindys — per tiek pat kitoje pusėje: $${atstumas} + ${atstumas} = ${
          2 * atstumas
        }$.`,
        brezinys: simetrijaTinklelyje(10, 6, taskai, asisX),
      })
    },

    // 2. Ar figūros simetriškos
    () =>
      pasirinkimoUzdavinys(naujasId('simetriska-figura'), 'simetriska-figura', {
        klausimas: 'Ar brėžinio figūros simetriškos brūkšninės ašies atžvilgiu?',
        variantai: ['taip, jos yra viena kitos atspindys', 'ne, viena didesnė', 'ne, jos pasuktos'],
        teisingas: 0,
        sprendimas: 'Kiekviena viršūnė nuo ašies nutolusi per tiek pat langelių abiejose pusėse.',
        brezinys: simetrijaTinklelyje(10, 6, taskai, asisX, true),
      }),

    // 3. Atstumas iki ašies iš brėžinio
    () => {
      const toliausia = Math.min(...taskai.map((p) => p.x))
      return uzdavinys('simetriska-figura', {
        // Atstumas tekste neįvardijamas — jį reikia suskaičiuoti tinklelyje.
        klausimas: 'Per kiek langelių nuo ašies nutolusi toliausiai nuo jos esanti figūros viršūnė?',
        atsakymas: String(asisX - toliausia),
        atsakymasRodymui: `$${asisX - toliausia}$`,
        sprendimas: `Nuo tos viršūnės iki ašies suskaičiuojami ${asisX - toliausia} langeliai; atspindėjus atstumas nepasikeis.`,
        brezinys: simetrijaTinklelyje(10, 6, taskai, asisX),
      })
    },

    // 4. Kiek simetrijos ašių turi figūra
    () => {
      const figura = pasirink([
        { vardas: 'kvadratas', asiu: 4 },
        { vardas: 'stačiakampis', asiu: 2 },
        { vardas: 'lygiakraštis trikampis', asiu: 3 },
      ])
      return uzdavinys('simetriska-figura', {
        klausimas: `Kiek simetrijos ašių turi ${figura.vardas}?`,
        atsakymas: String(figura.asiu),
        atsakymasRodymui: `$${figura.asiu}$`,
        sprendimas:
          figura.asiu === 2
            ? 'Stačiakampio ašys yra dvi vidurio linijos; įstrižainės ašimis nėra.'
            : 'Ašis eina per kiekvieną simetrijos kryptį.',
      })
    },

    // 5. Kuri figūra simetriška
    () =>
      pasirinkimoUzdavinys(naujasId('simetriska-figura'), 'simetriska-figura', {
        klausimas: 'Kuri figūra neturi nė vienos simetrijos ašies?',
        variantai: ['laisvos formos keturkampis', 'kvadratas', 'lygiakraštis trikampis'],
        teisingas: 0,
        sprendimas: 'Simetrijos ašis yra tik ten, kur figūra dalijasi į dvi veidrodines dalis.',
      }),

    // 6. Kas keičiasi atspindint
    () =>
      pasirinkimoUzdavinys(naujasId('simetriska-figura'), 'simetriska-figura', {
        klausimas: 'Kas atsitinka figūros dydžiui, kai ji atspindima ašies atžvilgiu?',
        variantai: ['dydis nesikeičia', 'figūra padidėja dvigubai', 'figūra sumažėja per pusę'],
        teisingas: 0,
        sprendimas: 'Atspindys keičia tik figūros vietą ir kryptį, bet ne dydį.',
      }),
  ])
}

// ── 3.8 Objekto postūmis ────────────────────────────────────────────────────

const A_POSTUMIS = [
  {
    klausimas: 'Figūra pastumta 3 langeliais į dešinę. Per kiek langelių pasislinko kiekviena jos viršūnė?',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Postūmio metu visos viršūnės pasislenka vienodai.',
  },
] as const

export const objektoPostumis: Generatorius = () =>
  suBandymais(kurkPostumi, A_POSTUMIS, 'objekto-postumis')

function kurkPostumi(): Uzdavinys | null {
  const taskai = pasirink(FIGUROS)
  const dx = atsitiktinis(2, 5)
  const dy = atsitiktinis(0, 1)

  return variacija([
    // 1. Kaip toli nuo krašto atsidurs viršūnė
    () => {
      const p = taskai[0]
      return uzdavinys('objekto-postumis', {
        // Viršūnė stovi ant tinklelio linijos, tad klausiama atstumo nuo
        // krašto, o ne stulpelio numerio — pastarasis būtų dviprasmis.
        klausimas:
          'Rodyklė rodo, kaip pastumiama figūra. Per kiek langelių nuo kairiojo krašto atsidurs viršūnė, nuo kurios prasideda rodyklė?',
        atsakymas: String(p.x + dx),
        atsakymasRodymui: `$${p.x + dx}$`,
        sprendimas: `Viršūnė buvo nutolusi per ${p.x} ir pasislinko per ${dx}: $${p.x} + ${dx} = ${
          p.x + dx
        }$.`,
        brezinys: postumisTinklelyje(12, 6, taskai, dx, dy),
      })
    },

    // 2. Per kiek langelių pastumta
    () =>
      uzdavinys('objekto-postumis', {
        klausimas: 'Per kiek langelių į dešinę pastumta brėžinio figūra?',
        atsakymas: String(dx),
        atsakymasRodymui: `$${dx}$`,
        sprendimas: 'Skaičiuojama, per kiek langelių pasislinko bet kuri viena viršūnė.',
        brezinys: postumisTinklelyje(12, 6, taskai, dx, dy, true),
      }),

    // 3. Ar keičiasi dydis
    () =>
      pasirinkimoUzdavinys(naujasId('objekto-postumis'), 'objekto-postumis', {
        klausimas: 'Kas pasikeičia, kai figūra pastumiama?',
        variantai: ['tik jos vieta', 'jos dydis', 'jos kampų skaičius'],
        teisingas: 0,
        sprendimas: 'Postūmis perkelia figūrą, bet nekeičia nei dydžio, nei formos.',
      }),

    // 4. Visos viršūnės slenka vienodai
    () =>
      uzdavinys('objekto-postumis', {
        klausimas: `Figūra pastumta ${dx} langeliais į dešinę. Per kiek langelių pasislinko kiekviena jos viršūnė?`,
        atsakymas: String(dx),
        atsakymasRodymui: `$${dx}$`,
        sprendimas: 'Postūmio metu visos figūros viršūnės pasislenka vienodai.',
      }),

    // 5. Du postūmiai iš eilės
    () => {
      const antras = atsitiktinis(2, 4)
      return uzdavinys('objekto-postumis', {
        klausimas: `Figūra pastumta ${dx} langeliais į dešinę, paskui dar ${antras} langeliais į dešinę. Per kiek langelių ji pasislinko iš viso?`,
        atsakymas: String(dx + antras),
        atsakymasRodymui: `$${dx + antras}$`,
        sprendimas: `$${dx} + ${antras} = ${dx + antras}$.`,
      })
    },

    // 6. Postūmis ir atspindys
    () =>
      pasirinkimoUzdavinys(naujasId('objekto-postumis'), 'objekto-postumis', {
        klausimas: 'Kuo postūmis skiriasi nuo atspindžio ašies atžvilgiu?',
        variantai: [
          'pastumta figūra nėra apversta, o atspindėta — apversta',
          'pastumta figūra pasidaro didesnė',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Postūmis figūrą tik perkelia, o atspindys ją dar ir apverčia kaip veidrodyje.',
      }),
  ])
}

// ── 3.9 Stačiakampio gretasienio elementai ──────────────────────────────────

const A_GRETASIENIS = [
  {
    klausimas: 'Kiek briaunų turi stačiakampis gretasienis?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: 'Gretasienis turi 12 briaunų, 8 viršūnes ir 6 sienas.',
  },
] as const

export const gretasienioElementai: Generatorius = () =>
  suBandymais(kurkGretasieni, A_GRETASIENIS, 'gretasienio-elementai')

function kurkGretasieni(): Uzdavinys | null {
  return variacija([
    // 1. Kiek elementų
    () => {
      const el = pasirink([
        { vardas: 'briaunų', kiek: 12 },
        { vardas: 'viršūnių', kiek: 8 },
        { vardas: 'sienų', kiek: 6 },
      ])
      return uzdavinys('gretasienio-elementai', {
        klausimas: `Kiek ${el.vardas} turi stačiakampis gretasienis?`,
        atsakymas: String(el.kiek),
        atsakymasRodymui: `$${el.kiek}$`,
        sprendimas: 'Gretasienis turi 12 briaunų, 8 viršūnes ir 6 sienas.',
        brezinys: vienasBrezinys(gretasienis()),
      })
    },

    // 2. Kas pažymėta brėžinyje
    () => {
      const kas = pasirink(['briauna', 'virsune', 'siena'] as const)
      const vardai = { briauna: 'briauna', virsune: 'viršūnė', siena: 'siena' }
      const blogi = (['briauna', 'virsune', 'siena'] as const).filter((k) => k !== kas)
      return pasirinkimoUzdavinys(naujasId('gretasienio-elementai'), 'gretasienio-elementai', {
        klausimas: 'Kuris gretasienio elementas pažymėtas brėžinyje?',
        variantai: [vardai[kas], ...blogi.map((k) => vardai[k])],
        teisingas: 0,
        sprendimas:
          kas === 'briauna'
            ? 'Briauna yra atkarpa, kurioje susieina dvi sienos.'
            : kas === 'virsune'
              ? 'Viršūnė yra taškas, kuriame susieina trys briaunos.'
              : 'Siena yra visa plokščioji gretasienio dalis.',
        brezinys: vienasBrezinys(gretasienis(kas)),
      })
    },

    // 3. Kokia figūra yra siena
    () =>
      pasirinkimoUzdavinys(naujasId('gretasienio-elementai'), 'gretasienio-elementai', {
        klausimas: 'Kokia plokščioji figūra yra kiekviena stačiakampio gretasienio siena?',
        variantai: ['stačiakampis', 'trikampis', 'apskritimas'],
        teisingas: 0,
        sprendimas: 'Visos šešios stačiakampio gretasienio sienos yra stačiakampiai.',
        brezinys: vienasBrezinys(gretasienis('siena')),
      }),

    // 4. Vienodo ilgio briaunos
    () =>
      uzdavinys('gretasienio-elementai', {
        klausimas: 'Kiek stačiakampio gretasienio briaunų yra tokio pat ilgio kaip viena pasirinkta briauna?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Briaunos eina keturiomis vienodomis grupėmis po keturias.',
        brezinys: vienasBrezinys(gretasienis('briauna')),
      }),

    // 5. Kubas kaip atskiras atvejis
    () =>
      pasirinkimoUzdavinys(naujasId('gretasienio-elementai'), 'gretasienio-elementai', {
        klausimas: 'Kuo kubas skiriasi nuo kitų stačiakampių gretasienių?',
        variantai: [
          'visos jo briaunos vienodo ilgio',
          'jis turi mažiau viršūnių',
          'jis turi tik keturias sienas',
        ],
        teisingas: 0,
        sprendimas: 'Kubas yra gretasienis, kurio visos sienos — kvadratai, o briaunos vienodos.',
      }),

    // 6. Briaunų ilgių suma
    () => {
      const a = atsitiktinis(2, 9)
      const b = atsitiktinis(2, 9)
      const c = atsitiktinis(2, 9)
      return uzdavinys('gretasienio-elementai', {
        klausimas: `Stačiakampio gretasienio briaunos yra ${a} cm, ${b} cm ir ${c} cm. Kokia visų jo briaunų ilgių suma centimetrais?`,
        atsakymas: String(4 * (a + b + c)),
        atsakymasRodymui: `$${4 * (a + b + c)}$ cm`,
        sprendimas: `Kiekvieno ilgio briaunų yra po keturias: $4 \\cdot (${a} + ${b} + ${c}) = ${
          4 * (a + b + c)
        }$.`,
      })
    },
  ])
}

// ── 3.10 Prizmė ir piramidė ─────────────────────────────────────────────────

const A_PRIZME = [
  {
    klausimas: 'Kiek viršūnių turi trikampė piramidė?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Trys pagrindo viršūnės ir viena viršūnė viršuje.',
  },
] as const

export const prizmeIrPiramide: Generatorius = () =>
  suBandymais(kurkPrizme, A_PRIZME, 'prizme-ir-piramide')

function kurkPrizme(): Uzdavinys | null {
  return variacija([
    // 1. Kuri figūra nubraižyta
    () => {
      const kas = pasirink(['prizme', 'piramide'] as const)
      const n = pasirink([3, 4] as const)
      const vardas = kas === 'prizme' ? 'prizmė' : 'piramidė'
      const kitas = kas === 'prizme' ? 'piramidė' : 'prizmė'
      return pasirinkimoUzdavinys(naujasId('prizme-ir-piramide'), 'prizme-ir-piramide', {
        klausimas: 'Kuri erdvės figūra nubraižyta?',
        variantai: [vardas, kitas, 'rutulys'],
        teisingas: 0,
        sprendimas:
          kas === 'prizme'
            ? 'Prizmė turi du vienodus pagrindus, sujungtus šoninėmis briaunomis.'
            : 'Piramidės visos šoninės briaunos susieina viename taške — viršūnėje.',
        brezinys: vienasBrezinys(erdvesFigura(kas, n)),
      })
    },

    // 2. Kiek viršūnių
    () => {
      const kas = pasirink(['prizme', 'piramide'] as const)
      const n = pasirink([3, 4] as const)
      const kiek = kas === 'prizme' ? 2 * n : n + 1
      const vardas = kas === 'prizme' ? 'prizmė' : 'piramidė'
      const pagrindas = n === 3 ? 'trikampė' : 'keturkampė'
      return uzdavinys('prizme-ir-piramide', {
        klausimas: `Kiek viršūnių turi ${pagrindas} ${vardas}?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas:
          kas === 'prizme'
            ? `Abiejuose pagrinduose po ${n} viršūnes: $${n} \\cdot 2 = ${kiek}$.`
            : `${n} pagrindo viršūnės ir dar viena viršuje: $${n} + 1 = ${kiek}$.`,
        brezinys: vienasBrezinys(erdvesFigura(kas, n)),
      })
    },

    // 3. Kokios sienos
    () =>
      pasirinkimoUzdavinys(naujasId('prizme-ir-piramide'), 'prizme-ir-piramide', {
        klausimas: 'Kokios figūros yra piramidės šoninės sienos?',
        variantai: ['trikampiai', 'stačiakampiai', 'apskritimai'],
        teisingas: 0,
        sprendimas: 'Visos šoninės briaunos susieina viršūnėje, tad kiekviena šoninė siena — trikampis.',
        brezinys: vienasBrezinys(erdvesFigura('piramide', 4)),
      }),

    // 4. Prizmės ir piramidės skirtumas
    () =>
      pasirinkimoUzdavinys(naujasId('prizme-ir-piramide'), 'prizme-ir-piramide', {
        klausimas: 'Kuo prizmė skiriasi nuo piramidės?',
        variantai: [
          'prizmė turi du vienodus pagrindus, o piramidė — vieną',
          'prizmė neturi viršūnių',
          'piramidės sienos yra stačiakampiai',
        ],
        teisingas: 0,
        sprendimas: 'Piramidės šoninės briaunos susieina viename taške, o prizmės — jungia du pagrindus.',
      }),

    // 5. Susiejimas
    () =>
      poruUzdavinys(naujasId('prizme-ir-piramide'), 'prizme-ir-piramide', {
        klausimas: 'Sujunk erdvės figūrą su jos požymiu.',
        poros: [
          { kaire: 'trikampė piramidė', desine: '4 viršūnės' },
          { kaire: 'trikampė prizmė', desine: '6 viršūnės' },
          { kaire: 'stačiakampis gretasienis', desine: '8 viršūnės' },
        ],
        sprendimas: 'Viršūnių skaičius priklauso nuo pagrindo formos ir figūros rūšies.',
      }),

    // 6. Kiek briaunų
    () => {
      const kas = pasirink(['prizme', 'piramide'] as const)
      const n = pasirink([3, 4] as const)
      const kiek = kas === 'prizme' ? 3 * n : 2 * n
      const vardas = kas === 'prizme' ? 'prizmė' : 'piramidė'
      const pagrindas = n === 3 ? 'trikampė' : 'keturkampė'
      return uzdavinys('prizme-ir-piramide', {
        klausimas: `Kiek briaunų turi ${pagrindas} ${vardas}?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas:
          kas === 'prizme'
            ? `Du pagrindai po ${n} briaunas ir ${n} šoninės: $${n} \\cdot 3 = ${kiek}$.`
            : `Pagrindo ${n} briaunos ir ${n} šoninės: $${n} \\cdot 2 = ${kiek}$.`,
        brezinys: vienasBrezinys(erdvesFigura(kas, n)),
      })
    },
  ])
}

// ── 3.11 Erdvės figūros skaidymas ir jungimas ───────────────────────────────

const A_ERDVES_SKAIDYMAS = [
  {
    klausimas: 'Į kiek vienodų kubelių galima suskaidyti kubą, kurio kiekviena briauna padalyta pusiau?',
    atsakymas: '8',
    atsakymasRodymui: '$8$',
    sprendimas: 'Kiekvienoje kryptyje po du, tad $2 \\cdot 2 \\cdot 2 = 8$.',
  },
] as const

export const erdvesSkaidymas: Generatorius = () =>
  suBandymais(kurkErdvesSkaidyma, A_ERDVES_SKAIDYMAS, 'erdves-skaidymas')

function kurkErdvesSkaidyma(): Uzdavinys | null {
  return variacija([
    // 1. Kiek kubelių statinyje
    () => {
      const stulpeliai = Array.from({ length: atsitiktinis(3, 5) }, () => atsitiktinis(1, 4))
      const viso = stulpeliai.reduce((s, x) => s + x, 0)
      return uzdavinys('erdves-skaidymas', {
        // Kubelių skaičius tekste nenurodytas — jį reikia suskaičiuoti iš brėžinio.
        klausimas: 'Iš kiek kubelių sudėtas brėžinio statinys?',
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `Stulpeliuose yra ${stulpeliai.join(' + ')} kubeliai — iš viso ${viso}.`,
        brezinys: kubeliuStatinys(stulpeliai),
      })
    },

    // 2. Kiek dar trūksta
    () => {
      const stulpeliai = Array.from({ length: 4 }, () => atsitiktinis(1, 3))
      const viso = stulpeliai.reduce((s, x) => s + x, 0)
      const auksciausias = 4
      const reikia = stulpeliai.length * auksciausias
      return uzdavinys('erdves-skaidymas', {
        klausimas: `Kiek kubelių dar reikia, kad kiekviename brėžinio stulpelyje būtų po ${auksciausias}?`,
        atsakymas: String(reikia - viso),
        atsakymasRodymui: `$${reikia - viso}$`,
        sprendimas: `Reikia $${stulpeliai.length} \\cdot ${auksciausias} = ${reikia}$, o yra ${viso}: trūksta ${
          reikia - viso
        }.`,
        brezinys: kubeliuStatinys(stulpeliai),
      })
    },

    // 3. Kubo skaidymas
    () => {
      const n = pasirink([2, 3])
      return uzdavinys('erdves-skaidymas', {
        klausimas: `Kubo kiekviena briauna padalyta į ${n} lygias dalis. Į kiek vienodų kubelių jis suskaidytas?`,
        atsakymas: String(n ** 3),
        atsakymasRodymui: `$${n ** 3}$`,
        sprendimas: `Kiekviena kryptimi po ${n}: $${n} \\cdot ${n} \\cdot ${n} = ${n ** 3}$.`,
      })
    },

    // 4. Iš kokių figūrų sudėta
    () =>
      pasirinkimoUzdavinys(naujasId('erdves-skaidymas'), 'erdves-skaidymas', {
        klausimas: 'Iš kokių erdvės figūrų sudėtas brėžinio statinys?',
        variantai: ['iš kubų', 'iš rutulių', 'iš piramidžių'],
        teisingas: 0,
        sprendimas: 'Visos statinio dalys yra vienodi kubeliai.',
        brezinys: kubeliuStatinys([2, 3, 1]),
      }),

    // 5. Dėžės pripildymas
    () => {
      const a = atsitiktinis(2, 4)
      const b = atsitiktinis(2, 4)
      const c = atsitiktinis(2, 3)
      return uzdavinys('erdves-skaidymas', {
        klausimas: `Į dėžės dugną telpa ${a} eilės po ${b} kubelius, o kubelių galima sudėti ${c} sluoksniais. Kiek kubelių telpa į dėžę?`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$`,
        sprendimas: `Viename sluoksnyje $${a} \\cdot ${b} = ${a * b}$, o sluoksnių ${c}: $${
          a * b
        } \\cdot ${c} = ${a * b * c}$.`,
      })
    },

    // 6. Ką gauname sujungę
    () =>
      pasirinkimoUzdavinys(naujasId('erdves-skaidymas'), 'erdves-skaidymas', {
        klausimas: 'Kokia figūra gaunama sustačius du vienodus kubus greta?',
        variantai: ['stačiakampis gretasienis', 'piramidė', 'rutulys'],
        teisingas: 0,
        sprendimas: 'Du kubai greta sudaro gretasienį, kurio viena briauna dvigubai ilgesnė.',
      }),
  ])
}

// ── 3.12 Aikštės maketas ────────────────────────────────────────────────────

// Raidė kiekvienam objektui nurodoma atskirai: pagal pirmąją pavadinimo raidę
// „Sūpynės“, „Smėlio dėžė“ ir „Suoliukas“ plane virstų trimis vienodomis S, ir
// klausimas „kur yra objektas S?“ nebeturėtų vieno atsakymo.
const OBJEKTAI = [
  { vardas: 'Sūpynės', raide: 'S' },
  { vardas: 'Smėlio dėžė', raide: 'D' },
  { vardas: 'Čiuožykla', raide: 'Č' },
  { vardas: 'Suoliukas', raide: 'L' },
  { vardas: 'Krepšinio stovas', raide: 'K' },
] as const

const A_MAKETAS = [
  {
    klausimas: 'Aikštės plane objektas pažymėtas 2-ajame stulpelyje ir 3-ojoje eilutėje. Kelintas yra jo stulpelis?',
    atsakymas: '2',
    atsakymasRodymui: '$2$',
    sprendimas: 'Pirmas skaičius nurodo stulpelį.',
  },
] as const

export const aikstesMaketas: Generatorius = () =>
  suBandymais(kurkMaketa, A_MAKETAS, 'aikstes-maketas')

function kurkMaketa(): Uzdavinys | null {
  const stulpeliu = 6
  const eiluciu = 4
  const parinkti = sumaisyk([...OBJEKTAI]).slice(0, 3)
  const vietos: PlanoLangelis[] = []
  const vardai: string[] = []
  for (const o of parinkti) {
    const x = atsitiktinis(0, stulpeliu - 1)
    const y = atsitiktinis(0, eiluciu - 1)
    if (vietos.some((v) => v.x === x && v.y === y)) return null
    vietos.push({ x, y, zyme: o.raide })
    vardai.push(o.vardas)
  }
  const [pirmas, antras] = vietos

  return variacija([
    // 1. Kelintame stulpelyje objektas
    () =>
      uzdavinys('aikstes-maketas', {
        klausimas: `Kelintame plano stulpelyje yra „${vardai[0]}“ (${pirmas.zyme})? Stulpeliai skaičiuojami iš kairės.`,
        atsakymas: String(pirmas.x + 1),
        atsakymasRodymui: `$${pirmas.x + 1}$`,
        sprendimas: `Nuo kairiojo krašto tai ${pirmas.x + 1}-asis stulpelis.`,
        brezinys: planas(stulpeliu, eiluciu, vietos),
      }),

    // 2. Kelintoje eilutėje
    () =>
      uzdavinys('aikstes-maketas', {
        klausimas: `Kelintoje plano eilutėje yra „${vardai[1]}“ (${antras.zyme})? Eilutės skaičiuojamos iš viršaus.`,
        atsakymas: String(antras.y + 1),
        atsakymasRodymui: `$${antras.y + 1}$`,
        sprendimas: `Nuo viršaus tai ${antras.y + 1}-oji eilutė.`,
        brezinys: planas(stulpeliu, eiluciu, vietos),
      }),

    // 3. Per kiek langelių nutolę
    () => {
      if (pirmas.y !== antras.y) return null
      const atstumas = Math.abs(pirmas.x - antras.x)
      if (atstumas === 0) return null
      return uzdavinys('aikstes-maketas', {
        klausimas: `Per kiek langelių nutolę „${vardai[0]}“ (${pirmas.zyme}) ir „${vardai[1]}“ (${antras.zyme})?`,
        atsakymas: String(atstumas),
        atsakymasRodymui: `$${atstumas}$`,
        sprendimas: 'Objektai toje pačioje eilutėje, tad skaičiuojami langeliai tarp stulpelių.',
        brezinys: planas(stulpeliu, eiluciu, vietos),
      })
    },

    // 4. Kiek langelių plane
    () =>
      uzdavinys('aikstes-maketas', {
        klausimas: 'Iš kiek langelių sudarytas aikštės planas?',
        atsakymas: String(stulpeliu * eiluciu),
        atsakymasRodymui: `$${stulpeliu * eiluciu}$`,
        sprendimas: `$${stulpeliu} \\cdot ${eiluciu} = ${stulpeliu * eiluciu}$.`,
        brezinys: planas(stulpeliu, eiluciu, vietos),
      }),

    // 5. Kiek laisvų langelių
    () =>
      uzdavinys('aikstes-maketas', {
        klausimas: 'Kiek plano langelių lieka tuščių?',
        atsakymas: String(stulpeliu * eiluciu - vietos.length),
        atsakymasRodymui: `$${stulpeliu * eiluciu - vietos.length}$`,
        sprendimas: `Iš viso ${stulpeliu * eiluciu} langeliai, užimti ${vietos.length}: liko ${
          stulpeliu * eiluciu - vietos.length
        }.`,
        brezinys: planas(stulpeliu, eiluciu, vietos),
      }),

    // 6. Maketo mastelis
    () => {
      const langelis = pasirink([1, 2, 5])
      const langeliu = atsitiktinis(3, 8)
      return uzdavinys('aikstes-maketas', {
        klausimas: `Aikštės makete vienas langelis atitinka ${langelis} m. Kiek metrų ilgio yra ${langeliu} langelių takas?`,
        atsakymas: String(langelis * langeliu),
        atsakymasRodymui: `$${langelis * langeliu}$ m`,
        sprendimas: `$${langeliu} \\cdot ${langelis} = ${langelis * langeliu}$.`,
      })
    },
  ])
}
