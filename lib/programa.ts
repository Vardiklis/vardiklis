/**
 * Matematikos programa 1–10 klasėms.
 *
 * ŠIS FAILAS YRA DUOMENYS, NE LOGIKA — kaip ir `lib/temos.ts`.
 * Surašyta pagal `uzdaviniu-temos.md`. Stambieji punktai (1., 2., 3.) yra
 * programos skyriai; jie rodomi paryškinti. `potemes` — smulkesnis skirstymas.
 *
 * `generatorius` nurodo raktą iš `lib/generatoriai/index.ts`. Jei jo nėra,
 * tema svetainėje rodoma, bet uždavinių kol kas negeneruoja — taip matyti,
 * kur biblioteką verta pildyti toliau.
 */

export type Lygis = 1 | 2 | 3

/**
 * Potemė. Paprasčiausiu atveju tai tik pavadinimas — tada ji paveldi savo
 * temos generatorių. Objekto forma naudojama tada, kai potemei tinka kitas
 * generatorius nei visai temai (pvz. 8 kl. „Kvadratinė ir kubinė šaknys"
 * temoje „Skaičiai ir skaičiavimai").
 */
export type Potema =
  | string
  | {
      pavadinimas: string
      generatorius?: string
      lygis?: Lygis
    }

export type ProgramosTema = {
  /** Stambiojo punkto numeris klasėje: 1., 2., 3. */
  numeris: number
  pavadinimas: string
  potemes?: Potema[]
  generatorius?: string
  /** Sunkumo lygis, kuriuo tema generuojama pagal nutylėjimą. */
  lygis?: Lygis
}

export type ProgramosKlase = {
  klase: number
  temos: ProgramosTema[]
}

/** Potemė su galutiniu numeriu ir generatoriumi — jau paveldėtu iš temos. */
export type IsskleistaPotema = {
  /** „3.2" pavidalu. */
  numeris: string
  pavadinimas: string
  generatorius?: string
  lygis: Lygis
}

/**
 * Potemės su numeriais ir generatoriais. Potemė be savo generatoriaus
 * paveldi temos generatorių, tad paspaudus bet kurią gaunami uždaviniai.
 */
export function potemes(tema: ProgramosTema): IsskleistaPotema[] {
  return (tema.potemes ?? []).map((p, i) => {
    const objektas = typeof p === 'string' ? { pavadinimas: p } : p
    return {
      numeris: `${tema.numeris}.${i + 1}`,
      pavadinimas: objektas.pavadinimas,
      generatorius: objektas.generatorius ?? tema.generatorius,
      lygis: objektas.lygis ?? tema.lygis ?? 2,
    }
  })
}

export const programa: ProgramosKlase[] = [
  {
    klase: 1,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Natūralieji skaičiai iki 100 ir skaičius 0',
        potemes: [
          'Skaičiai nuo 0 iki 100, skaičių palyginimas',
          'Sudėtis, skliaustai',
          'Atimtis',
          { pavadinimas: 'Finansiniai skaičiavimai. Eurai ir centai', generatorius: 'pinigai', lygis: 1 },
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 1,
      },
      {
        numeris: 2,
        pavadinimas: 'Modeliai ir sąryšiai',
        potemes: [
          'Dėsningumai. Sekos',
          { pavadinimas: 'Algoritmai ir programavimas', generatorius: 'algoritmai', lygis: 1 },
        ],
        generatorius: 'sekos',
        lygis: 1,
      },
      {
        numeris: 3,
        pavadinimas: 'Matavimų skalės ir vienetai',
        potemes: [
          { pavadinimas: 'Masė, laikas', generatorius: 'laikas', lygis: 1 },
          'Ilgis, atstumas',
          { pavadinimas: 'Konstravimas, transformacijos', generatorius: 'simetrija', lygis: 1 },
          { pavadinimas: 'Plokštumos figūros', generatorius: 'figuros', lygis: 1 },
          { pavadinimas: 'Erdvės figūros', generatorius: 'erdvines-figuros', lygis: 1 },
        ],
        generatorius: 'matavimo-vienetai',
        lygis: 1,
      },
      {
        numeris: 4,
        pavadinimas: 'Duomenys ir tikimybės',
        potemes: ['Duomenys ir jų interpretavimas'],
        generatorius: 'diagramos',
        lygis: 1,
      },
    ],
  },

  {
    klase: 2,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Natūralieji ir sveikieji skaičiai. Skaičiai nuo 0 iki 1000',
        potemes: [
          'Skaičiai ir skaitmenys',
          'Vienaženkliai, dviženkliai ir triženkliai skaičiai. Skaičių skyriai',
          'Skaičių rikiavimas',
          'Skaičių kaimynai',
          'Skaičių palyginimas',
        ],
        generatorius: 'skaiciu-palyginimas',
        lygis: 1,
      },
      {
        numeris: 2,
        pavadinimas: 'Sudėtis, atimtis',
        potemes: [
          'Skaičių nuo 1 iki 1000 sudėtis',
          'Skaičių nuo 1 iki 1000 atimtis',
          'Kaip spręsti dviejų žingsnių uždavinius',
          'Skaitinės lygybės ir nelygybės',
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Daugyba, dalyba',
        potemes: [
          'Kas yra daugyba. Kaip atlikti daugybos veiksmus',
          'Daugybos lentelė',
          'Kas yra dalyba',
          'Lyginiai ir nelyginiai skaičiai',
          'Kaip spręsti uždavinius',
          { pavadinimas: 'Veiksmų tvarka skaitiniame reiškinyje', generatorius: 'veiksmu-tvarka', lygis: 1 },
        ],
        generatorius: 'sveikieji',
        lygis: 1,
      },
      {
        numeris: 4,
        pavadinimas: 'Trupmenos ir dalys',
        potemes: [
          'Kas yra daikto dalis',
          'Kaip apskaičiuoti pusę, trečdalį, ketvirtadalį ir aštuntadalį',
          'Kaip rasti visą daiktų skaičių, kai žinoma jų dalis',
        ],
        generatorius: 'dalies-radimas',
        lygis: 1,
      },
      {
        numeris: 5,
        pavadinimas: 'Finansiniai skaičiavimai',
        potemes: [
          'Kas yra pinigai. Kam jie reikalingi',
          'Kas yra banknotas ir moneta',
          'Monetos vertė',
        ],
        generatorius: 'pinigai',
        lygis: 1,
      },
      {
        numeris: 6,
        pavadinimas: 'Dėsningumai. Sekos',
        potemes: [
          'Kas yra seka. Kas yra skaičių seka',
          'Kaip sudaroma objektų seka',
          'Kaip skaičių sekoje rasti trūkstamą jos narį',
        ],
        generatorius: 'sekos',
        lygis: 1,
      },
      {
        numeris: 7,
        pavadinimas: 'Algoritmai ir programavimas',
        potemes: ['Kas yra komanda', 'Komandos (nurodymai)', 'Pasirinkimo komanda'],
        generatorius: 'algoritmai',
        lygis: 1,
      },
      {
        numeris: 8,
        pavadinimas: 'Matavimo skalės ir vienetai',
        potemes: ['Masė', 'Temperatūra'],
        generatorius: 'matavimo-vienetai',
        lygis: 1,
      },
      {
        numeris: 9,
        pavadinimas: 'Masė, laikas, temperatūra',
        potemes: ['Laikas'],
        generatorius: 'laikas',
        lygis: 1,
      },
      {
        numeris: 10,
        pavadinimas: 'Ilgis, plotas, tūris',
        potemes: ['Ilgis (mm, cm, m, km). Kaip nubrėžti atkarpą', 'Plotas (langeliais)', 'Tūris'],
        generatorius: 'matavimo-vienetai',
        lygis: 2,
      },
      {
        numeris: 11,
        pavadinimas: 'Konstravimas. Transformacijos',
        potemes: ['Kaip rasti kelią plane pagal komandas', 'Simetriškos figūros'],
        generatorius: 'simetrija',
        lygis: 1,
      },
      {
        numeris: 12,
        pavadinimas: 'Figūros. Plokščiosios figūros',
        potemes: [
          'Plokščiosios figūros',
          'Kraštinės, kampai, viršūnės',
          { pavadinimas: 'Laužės', generatorius: 'lauzes', lygis: 1 },
          { pavadinimas: 'Simetriškos figūros', generatorius: 'simetrija', lygis: 1 },
        ],
        generatorius: 'figuros',
        lygis: 1,
      },
      {
        numeris: 13,
        pavadinimas: 'Erdvinės figūros',
        potemes: ['Erdvinės figūros', 'Ryšiai tarp dvimačių ir trimačių figūrų'],
        generatorius: 'erdvines-figuros',
        lygis: 1,
      },
      {
        numeris: 14,
        pavadinimas: 'Duomenys ir jų interpretavimas',
        potemes: [
          'Pirminiai ir antriniai duomenys',
          'Duomenų dažnių lentelė',
          'Stulpelinė diagrama',
          'Piktogramos',
        ],
        generatorius: 'diagramos',
        lygis: 2,
      },
    ],
  },

  {
    klase: 3,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Natūralieji skaičiai iki 10 000',
        potemes: [
          { pavadinimas: 'Skaičių skaitymas, rašymas, palyginimas, apvalinimas', generatorius: 'apvalinimas', lygis: 2 },
          { pavadinimas: 'Sudėtis ir atimtis', generatorius: 'sudetis-atimtis', lygis: 2 },
          'Daugyba iš vienaženklio skaičiaus',
          'Dalyba iš vienaženklio skaičiaus. Dalyba su liekana',
          { pavadinimas: 'Skaitiniai reiškiniai', generatorius: 'veiksmu-tvarka', lygis: 2 },
          { pavadinimas: 'Sekos, algoritmai', generatorius: 'sekos', lygis: 2 },
        ],
        generatorius: 'sveikieji',
        lygis: 2,
      },
      {
        numeris: 2,
        pavadinimas: 'Trupmeniniai skaičiai nuo 0 iki 1',
        potemes: [
          'Trupmenos samprata. Trupmenų vaizdavimas, palyginimas',
          'Dydžio, skaičiaus dalies ir visumos radimas',
        ],
        generatorius: 'dalies-radimas',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Matavimai',
        potemes: [
          { pavadinimas: 'Ilgio vienetai: cm, dm, m', generatorius: 'matavimo-vienetai', lygis: 1 },
          'Perimetro sąvoka. Daugiakampio perimetro skaičiavimas',
          { pavadinimas: 'Laiko vienetai: sek., min., val.', generatorius: 'laikas', lygis: 2 },
        ],
        generatorius: 'perimetras',
        lygis: 1,
      },
      {
        numeris: 4,
        pavadinimas: 'Raidiniai reiškiniai',
        potemes: [
          'Raidinio reiškinio samprata',
          'Raidinio reiškinio reikšmės',
          'Raidinio reiškinio sudarymas',
        ],
        generatorius: 'raidiniai-reiskiniai',
        lygis: 1,
      },
      {
        numeris: 5,
        pavadinimas: 'Lygtys',
        potemes: ['Lygties samprata', 'Lygčių sprendimas', 'Lygties sudarymas'],
        generatorius: 'tiesines-lygtys',
        lygis: 1,
      },
      {
        numeris: 6,
        pavadinimas: 'Plokštumos figūros',
        potemes: [
          { pavadinimas: 'Tiesės ir atkarpos', generatorius: 'lauzes', lygis: 2 },
          { pavadinimas: 'Kampai', generatorius: 'kampai', lygis: 1 },
          'Stačiakampis, kvadratas',
          { pavadinimas: 'Apskritimas ir skritulys', generatorius: 'apskritimas', lygis: 1 },
          { pavadinimas: 'Tiesės atžvilgiu simetriškos figūros', generatorius: 'simetrija', lygis: 1 },
        ],
        generatorius: 'perimetras',
        lygis: 2,
      },
      {
        numeris: 7,
        pavadinimas: 'Erdvės figūros',
        potemes: ['Stačiakampis gretasienis ir kubas', 'Prizmės', 'Piramidės'],
        generatorius: 'erdvines-figuros',
        lygis: 2,
      },
      {
        numeris: 8,
        pavadinimas: 'Duomenys ir jų interpretavimas. Tikėtinumas',
        potemes: ['Duomenų rinkimas', 'Duomenų vaizdavimas. Stulpelinės diagramos', 'Tikėtinumas'],
        generatorius: 'diagramos',
        lygis: 2,
      },
    ],
  },

  {
    klase: 4,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Natūralieji ir sveikieji skaičiai. Skaičiai nuo 0 iki 1 000 000',
        potemes: [
          'Skaičiai. Jų svarba kasdieniame gyvenime',
          { pavadinimas: 'Skirtingų skaičių dydžių palyginimas', generatorius: 'skaiciu-palyginimas', lygis: 3 },
          'Didelių skaičių trumpinimo žymėjimas',
          'Natūralieji skaičiai',
          { pavadinimas: 'Skaičių suapvalinimas', generatorius: 'apvalinimas', lygis: 3 },
          'Natūralieji ir sveikieji skaičiai',
        ],
        generatorius: 'apvalinimas',
        lygis: 1,
      },
      {
        numeris: 2,
        pavadinimas: 'Sudėtis, atimtis, daugyba, dalyba',
        potemes: [
          'Sudėtis. Sudėties veiksmų eilutė',
          'Atimtis iš didesnio skaičiaus',
          'Dalijimas',
          'Daugyba',
          'Kelių žingsnių uždavinių sprendimas',
        ],
        generatorius: 'sveikieji',
        lygis: 3,
      },
      {
        numeris: 3,
        pavadinimas: 'Trupmenos ir dalys',
        potemes: [
          'Paprastosios trupmenos ir jos dalys',
          'Taisyklingos ir netaisyklingos paprastosios trupmenos',
          'Paprastųjų trupmenų palyginimas',
          'Natūraliojo skaičiaus užrašymas trupmena',
          'Mišriojo skaičiaus sąvoka',
        ],
        generatorius: 'bendravardiklinimas',
        lygis: 3,
      },
      {
        numeris: 4,
        pavadinimas: 'Veiksmai su trupmenomis',
        potemes: [
          'Mišriųjų skaičių apvalinimas iki sveikųjų',
          { pavadinimas: 'Trupmenos su vardikliu 10, 100, 1000 dešimtainiais', generatorius: 'desimtaines', lygis: 3 },
          { pavadinimas: 'Trupmenos su vienodais vardikliais', generatorius: 'trupmenu-sudetis', lygis: 1 },
          { pavadinimas: 'Mišriosios trupmenos', generatorius: 'trupmenu-sudetis', lygis: 3 },
          'Dešimtainės trupmenos',
          { pavadinimas: 'Dešimtainiai skaičiai kainose', generatorius: 'pinigai', lygis: 1 },
        ],
        generatorius: 'desimtaines',
        lygis: 1,
      },
      {
        numeris: 5,
        pavadinimas: 'Finansiniai skaičiavimai',
        potemes: [
          'Nurodytos pinigų sumos palyginimas',
          'Nurodytos pinigų sumos sudėtis',
          'Nurodytos pinigų sumos atimtis',
          'Finansinio planavimo pagrindų taikymas',
        ],
        generatorius: 'pinigai',
        lygis: 2,
      },
      {
        numeris: 6,
        pavadinimas: 'Dėsningumai',
        potemes: [
          'Trupmenų arba dešimtainių skaičių sekų pratęsimas',
          'Sekos su daugėjančiais arba mažėjančiais elementais',
          'Sekos, gautos suliejus dvi sekas į vieną',
        ],
        generatorius: 'sekos',
        lygis: 2,
      },
      {
        numeris: 7,
        pavadinimas: 'Algoritmai ir programavimas',
        potemes: ['Kartojimo komandos', 'Komandų sekos'],
        generatorius: 'algoritmai',
        lygis: 2,
      },
      {
        numeris: 8,
        pavadinimas: 'Algebra. Lygtys',
        potemes: [
          'Iš žodinio uždavinio sąlygos ar schemos lygties sudarymas',
          'Situacijų nagrinėjimas skirtingomis lygtimis',
        ],
        generatorius: 'tiesines-lygtys',
        lygis: 1,
      },
      {
        numeris: 9,
        pavadinimas: 'Raidiniai reiškiniai',
        potemes: [
          'Raidinio reiškinio sąvoka',
          'Raidinių reiškinių sudarymas iš žodinio uždavinio',
        ],
        generatorius: 'raidiniai-reiskiniai',
        lygis: 2,
      },
      {
        numeris: 10,
        pavadinimas: 'Matavimo skalės ir vienetai. Masė, laikas, temperatūra, greitis',
        potemes: [
          { pavadinimas: 'Įvairių matavimo prietaisų rodmenys', generatorius: 'matavimo-vienetai', lygis: 2 },
          'Kelio ir greičio sąvokos',
          'Kelio, laiko, greičio sąryšis',
          'Kelio, laiko, greičio apskaičiavimas',
        ],
        generatorius: 'greitis',
        lygis: 1,
      },
      {
        numeris: 11,
        pavadinimas: 'Plotas, tūris',
        potemes: [
          { pavadinimas: 'Figūros plotas ir ploto vienetai', generatorius: 'plotas-turis', lygis: 1 },
          { pavadinimas: 'Tūris', generatorius: 'plotas-turis', lygis: 2 },
        ],
        generatorius: 'plotas-turis',
        lygis: 1,
      },
      {
        numeris: 12,
        pavadinimas: 'Konstravimas. Transformacijos',
        potemes: [
          'Objektų padėties plokštumoje nusakymas',
          { pavadinimas: 'Objektų judėjimas plokštumoje', generatorius: 'simetrija', lygis: 3 },
          { pavadinimas: 'Ornamentai', generatorius: 'ornamentai', lygis: 1 },
          { pavadinimas: 'Objekto posūkis apie duotą tašką', generatorius: 'simetrija', lygis: 2 },
        ],
        generatorius: 'koordinates',
        lygis: 1,
      },
      {
        numeris: 13,
        pavadinimas: 'Figūros. Plokščiosios figūros',
        potemes: [
          { pavadinimas: 'Trikampiai pagal kraštinių ilgius', generatorius: 'figuros', lygis: 1 },
          'Trikampiai pagal kampus',
          { pavadinimas: 'Lygios geometrinės figūros', generatorius: 'figuros', lygis: 2 },
        ],
        generatorius: 'kampai',
        lygis: 1,
      },
      {
        numeris: 14,
        pavadinimas: 'Erdvinės figūros',
        potemes: [
          { pavadinimas: 'Kubas ir stačiakampis gretasienis', generatorius: 'erdvines-figuros', lygis: 1 },
          { pavadinimas: 'Erdvinės figūros', generatorius: 'erdvines-figuros', lygis: 2 },
          { pavadinimas: 'Erdvinės figūros iš įvairių pusių', generatorius: 'plotas-turis', lygis: 2 },
        ],
        generatorius: 'plotas-turis',
        lygis: 2,
      },
      {
        numeris: 15,
        pavadinimas: 'Duomenys ir interpretavimas',
        potemes: [
          'Statistinis tyrimas',
          { pavadinimas: 'Diagramų skaitymas', generatorius: 'diagramos', lygis: 2 },
        ],
        generatorius: 'vidurkis',
        lygis: 1,
      },
      {
        numeris: 16,
        pavadinimas: 'Tikimybės ir interpretavimas',
        potemes: ['Bandymas. Bandymo baigtis', 'Baigties tikimybė užrašoma trupmena'],
        generatorius: 'tikimybe',
        lygis: 1,
      },
    ],
  },

  {
    klase: 5,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Natūralieji skaičiai',
        potemes: [
          'Skaičius ir skaitmuo',
          'Skaičiaus skaitmenų skyrių lentelė',
          'Skaitmens reikšmė',
          'Rašome natūraliuosius skaičius',
          { pavadinimas: 'Skaičių tiesė', generatorius: 'koordinates', lygis: 1 },
          { pavadinimas: 'Palyginame natūraliuosius skaičius', generatorius: 'skaiciu-palyginimas', lygis: 3 },
          { pavadinimas: 'Apvaliname iki dešimčių', generatorius: 'apvalinimas', lygis: 1 },
          { pavadinimas: 'Apvaliname iki nurodyto skyriaus', generatorius: 'apvalinimas', lygis: 3 },
          'Romėniškieji skaitmenys',
          'Rašome skaičius romėniškaisiais skaitmenimis',
        ],
        generatorius: 'apvalinimas',
        lygis: 2,
      },
      {
        numeris: 2,
        pavadinimas: 'Veiksmai su natūraliaisiais skaičiais',
        potemes: [
          { pavadinimas: 'Skaičių sudėtis. Sudėties perstatomumo dėsnis', generatorius: 'sudetis-atimtis', lygis: 2 },
          { pavadinimas: 'Sudėties jungiamumo dėsnis', generatorius: 'sudetis-atimtis', lygis: 3 },
          { pavadinimas: 'Skaičių atimtis', generatorius: 'sudetis-atimtis', lygis: 2 },
          { pavadinimas: 'Atimties dėsniai', generatorius: 'sudetis-atimtis', lygis: 3 },
          { pavadinimas: 'Skaičių daugyba. Daugybos perstatomumo dėsnis', generatorius: 'sveikieji', lygis: 1 },
          { pavadinimas: 'Daugybos jungiamumo dėsnis', generatorius: 'sveikieji', lygis: 2 },
          { pavadinimas: 'Daugybos skirstomumo dėsnis', generatorius: 'sveikieji', lygis: 3 },
          { pavadinimas: 'Skaičių dalyba. Dalyba kampu', generatorius: 'sveikieji', lygis: 2 },
          { pavadinimas: 'Dalybos dėsniai. Pagrindinė dalmens savybė', generatorius: 'sveikieji', lygis: 2 },
          { pavadinimas: 'Sumos (skirtumo) dalijimas iš natūraliojo skaičiaus', generatorius: 'veiksmu-tvarka', lygis: 3 },
          { pavadinimas: 'Kelio formulė', generatorius: 'greitis', lygis: 1 },
          { pavadinimas: 'Judėjimas iš tos pačios vietos', generatorius: 'greitis', lygis: 2 },
          { pavadinimas: 'Judėjimas iš skirtingų vietų', generatorius: 'greitis', lygis: 3 },
        ],
        generatorius: 'sveikieji',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Dalumas',
        potemes: [
          'Dalijame iš 10 ir iš 100',
          'Dalijame iš 5 ir iš 2',
          'Dalijame iš 9 ir iš 3',
          'Dalijame iš 4',
          { pavadinimas: 'Skaičiaus dalikliai', generatorius: 'dalumas', lygis: 1 },
          'Pirminiai ir sudėtiniai skaičiai',
          'Skaidome pirminiais dauginamaisiais',
          { pavadinimas: 'Didžiausiasis bendrasis daliklis', generatorius: 'dalumas', lygis: 1 },
          'Skaičiaus kartotiniai',
          { pavadinimas: 'Mažiausiasis bendrasis kartotinis', generatorius: 'dalumas', lygis: 2 },
        ],
        generatorius: 'dalumas',
        lygis: 2,
      },
      {
        numeris: 4,
        pavadinimas: 'Trupmeniniai skaičiai',
        potemes: [
          'Taisyklingosios ir netaisyklingosios paprastosios trupmenos',
          { pavadinimas: 'Netaisyklingoji trupmena ir mišrusis skaičius', generatorius: 'trupmenu-sudetis', lygis: 3 },
          { pavadinimas: 'Pagrindinė paprastosios trupmenos savybė', generatorius: 'bendravardiklinimas', lygis: 2 },
          { pavadinimas: 'Dešimtainiai skaičiai', generatorius: 'desimtaines', lygis: 1 },
          'Lygūs dešimtainiai skaičiai',
          { pavadinimas: 'Paprastoji trupmena ir dešimtainis skaičius', generatorius: 'desimtaines', lygis: 3 },
          { pavadinimas: 'Procentai', generatorius: 'procentai', lygis: 1 },
          { pavadinimas: 'Paprastosios trupmenos, dešimtainiai skaičiai ir procentai', generatorius: 'procentai', lygis: 2 },
          { pavadinimas: 'Skaičiaus dalies radimas', generatorius: 'dalies-radimas', lygis: 1 },
          { pavadinimas: 'Skaičiaus radimas, kai žinoma jo dalis', generatorius: 'dalies-radimas', lygis: 2 },
        ],
        generatorius: 'dalies-radimas',
        lygis: 2,
      },
      {
        numeris: 5,
        pavadinimas: 'Veiksmai su paprastosiomis trupmenomis ir mišriaisiais skaičiais',
        potemes: [
          { pavadinimas: 'Palyginame', generatorius: 'bendravardiklinimas', lygis: 3 },
          { pavadinimas: 'Sudedame paprastąsias trupmenas', generatorius: 'trupmenu-sudetis', lygis: 1 },
          { pavadinimas: 'Sudedame mišriuosius skaičius', generatorius: 'trupmenu-sudetis', lygis: 3 },
          { pavadinimas: 'Atimame paprastąją trupmeną', generatorius: 'trupmenu-sudetis', lygis: 2 },
          'Natūraliųjų ir mišriųjų skaičių atimtis',
          { pavadinimas: 'Mišriųjų skaičių atimtis', generatorius: 'trupmenu-sudetis', lygis: 3 },
          { pavadinimas: 'Bendravardikliname', generatorius: 'bendravardiklinimas', lygis: 1 },
          { pavadinimas: 'Palyginame bendravardiklinę', generatorius: 'bendravardiklinimas', lygis: 3 },
          { pavadinimas: 'Sudedame skirtingų vardiklių trupmenas', generatorius: 'trupmenu-sudetis', lygis: 2 },
          { pavadinimas: 'Atimame skirtingų vardiklių trupmenas', generatorius: 'trupmenu-sudetis', lygis: 2 },
          { pavadinimas: 'Paprastosios trupmenos ir natūraliojo skaičiaus daugyba', generatorius: 'trupmenu-daugyba', lygis: 1 },
          { pavadinimas: 'Mišriojo ir natūraliojo skaičių daugyba', generatorius: 'trupmenu-daugyba', lygis: 3 },
        ],
        generatorius: 'trupmenu-sudetis',
        lygis: 2,
      },
      {
        numeris: 6,
        pavadinimas: 'Veiksmai su dešimtainiais skaičiais',
        potemes: [
          'Palyginame',
          { pavadinimas: 'Apvaliname iki vienetų', generatorius: 'apvalinimas', lygis: 1 },
          { pavadinimas: 'Apvaliname iki nurodyto skyriaus', generatorius: 'apvalinimas', lygis: 2 },
          { pavadinimas: 'Sudedame', generatorius: 'desimtaines', lygis: 1 },
          { pavadinimas: 'Atimame', generatorius: 'desimtaines', lygis: 2 },
          { pavadinimas: 'Dešimtainio ir natūraliojo skaičių daugyba', generatorius: 'desimtaines', lygis: 2 },
          { pavadinimas: 'Dauginame iš 10, 100, 1000', generatorius: 'matavimo-vienetai', lygis: 1 },
        ],
        generatorius: 'desimtaines',
        lygis: 2,
      },
      {
        numeris: 7,
        pavadinimas: 'Reiškiniai. Lygtys',
        potemes: [
          { pavadinimas: 'Skaitinis reiškinys ir jo reikšmė', generatorius: 'veiksmu-tvarka', lygis: 1 },
          'Raidinis reiškinys',
          { pavadinimas: 'Raidinio reiškinio reikšmės', generatorius: 'raidiniai-reiskiniai', lygis: 1 },
          { pavadinimas: 'Dauginame ir dalijame iš skaičiaus', generatorius: 'sveikieji', lygis: 2 },
          { pavadinimas: 'Panašieji nariai, jų sutraukimas', generatorius: 'raidiniai-reiskiniai', lygis: 3 },
          'Skaitinių lygybių savybės',
          { pavadinimas: 'Lygtis ir jos sprendinys', generatorius: 'tiesines-lygtys', lygis: 1 },
          { pavadinimas: 'Lygties sprendimas', generatorius: 'tiesines-lygtys', lygis: 2 },
          { pavadinimas: 'Tekstinių uždavinių sprendimas sudarant lygtis', generatorius: 'tiesines-lygtys', lygis: 3 },
        ],
        generatorius: 'tiesines-lygtys',
        lygis: 2,
      },
      {
        numeris: 8,
        pavadinimas: 'Kampai',
        potemes: [
          'Kampas ir jo elementai',
          'Kuris kampas didesnis?',
          'Ištiestinis ir statusis kampai',
          'Smailusis ir bukasis kampai',
          'Pilnasis ir priešpilnis kampai',
          { pavadinimas: 'Laipsnis', generatorius: 'kampai', lygis: 2 },
          { pavadinimas: 'Kampų palyginimas', generatorius: 'kampai', lygis: 2 },
          'Ištiestinio, stačiojo ir smailiojo kampų dydžiai',
          'Bukojo, pilnojo ir priešpilnio kampų dydžiai',
          'Matlankis. Matuojame kampus',
          { pavadinimas: 'Braižome kampą. Kampo pusiaukampinė', generatorius: 'konstravimas', lygis: 1 },
          { pavadinimas: 'Gretutiniai kampai', generatorius: 'kampai', lygis: 2 },
          { pavadinimas: 'Kryžminiai kampai', generatorius: 'kampai', lygis: 2 },
        ],
        generatorius: 'kampai',
        lygis: 1,
      },
      {
        numeris: 9,
        pavadinimas: 'Trikampiai ir keturkampiai',
        potemes: [
          { pavadinimas: 'Daugiakampis', generatorius: 'figuros', lygis: 1 },
          { pavadinimas: 'Trikampio kampai', generatorius: 'kampai', lygis: 1 },
          { pavadinimas: 'Daugiakampio kampai', generatorius: 'kampai', lygis: 3 },
          { pavadinimas: 'Ilgio matavimo vienetai', generatorius: 'matavimo-vienetai', lygis: 1 },
          { pavadinimas: 'Trikampio perimetras', generatorius: 'perimetras', lygis: 1 },
          { pavadinimas: 'Keturkampio perimetras', generatorius: 'perimetras', lygis: 2 },
          { pavadinimas: 'Ploto matavimo vienetai', generatorius: 'matavimo-vienetai', lygis: 3 },
          { pavadinimas: 'Stačiakampio ir kvadrato plotai', generatorius: 'plotas-turis', lygis: 1 },
          { pavadinimas: 'Stačiojo trikampio plotas', generatorius: 'plotas-turis', lygis: 3 },
        ],
        generatorius: 'perimetras',
        lygis: 1,
      },
      {
        numeris: 10,
        pavadinimas: 'Simetrija. Posūkis. Postūmis',
        potemes: [
          { pavadinimas: 'Tiesės atžvilgiu simetriškos figūros', generatorius: 'simetrija', lygis: 1 },
          'Figūros, turinčios simetrijos ašį',
          { pavadinimas: 'Posūkis apie tašką', generatorius: 'simetrija', lygis: 2 },
          { pavadinimas: 'Taško atžvilgiu simetriškos figūros', generatorius: 'simetrija', lygis: 2 },
          'Figūros, turinčios simetrijos centrą',
          { pavadinimas: 'Lygiagretusis postūmis', generatorius: 'simetrija', lygis: 3 },
          { pavadinimas: 'Lygiagretainis, rombas, trapecija', generatorius: 'figuros', lygis: 2 },
        ],
        generatorius: 'simetrija',
        lygis: 1,
      },
      {
        numeris: 11,
        pavadinimas: 'Erdviniai kūnai',
        potemes: [
          { pavadinimas: 'Vaizduojame', generatorius: 'erdvines-figuros', lygis: 1 },
          'Matmenys. Išklotinė',
          { pavadinimas: 'Stačiakampio gretasienio paviršiaus plotas', generatorius: 'plotas-turis', lygis: 3 },
          { pavadinimas: 'Kubo paviršiaus plotas', generatorius: 'plotas-turis', lygis: 3 },
          { pavadinimas: 'Tūris', generatorius: 'plotas-turis', lygis: 2 },
          { pavadinimas: 'Stačiakampio gretasienio tūris', generatorius: 'plotas-turis', lygis: 2 },
          { pavadinimas: 'Kubo tūris', generatorius: 'plotas-turis', lygis: 2 },
          { pavadinimas: 'Talpa', generatorius: 'matavimo-vienetai', lygis: 2 },
        ],
        generatorius: 'erdvines-figuros',
        lygis: 1,
      },
      {
        numeris: 12,
        pavadinimas: 'Duomenys ir tikimybės',
        potemes: [
          'Kokybiniai ir kiekybiniai duomenys',
          { pavadinimas: 'Imtis, imties vidurkis', generatorius: 'vidurkis', lygis: 1 },
          { pavadinimas: 'Bandymas ir jo baigtys', generatorius: 'tikimybe', lygis: 1 },
          { pavadinimas: 'Įvykio tikimybė', generatorius: 'tikimybe', lygis: 2 },
        ],
        generatorius: 'vidurkis',
        lygis: 1,
      },
    ],
  },

  {
    klase: 6,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Skaičiai',
        potemes: [
          { pavadinimas: 'Skaičiai skaičių tiesėje', generatorius: 'koordinates', lygis: 2 },
          { pavadinimas: 'Vienas kitam priešingieji skaičiai', generatorius: 'neigiami', lygis: 1 },
          { pavadinimas: 'Skaičių palyginimas', generatorius: 'skaiciu-palyginimas', lygis: 3 },
          'Natūralieji, sveikieji, racionalieji skaičiai',
          { pavadinimas: 'Koordinačių plokštuma', generatorius: 'koordinates', lygis: 2 },
        ],
        generatorius: 'neigiami',
        lygis: 1,
      },
      {
        numeris: 2,
        pavadinimas: 'Racionaliųjų skaičių sudėtis ir atimtis',
        potemes: [
          { pavadinimas: 'Sudedame skaičius su vienodais ženklais', generatorius: 'neigiami', lygis: 1 },
          { pavadinimas: 'Sudedame skaičius su skirtingais ženklais', generatorius: 'neigiami', lygis: 2 },
          { pavadinimas: 'Atimame', generatorius: 'neigiami', lygis: 2 },
          { pavadinimas: 'Algebrinė suma', generatorius: 'neigiami', lygis: 3 },
        ],
        generatorius: 'neigiami',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Neneigiamųjų paprastųjų trupmenų daugyba ir dalyba',
        potemes: [
          { pavadinimas: 'Paprastosios trupmenos ir natūraliojo skaičiaus daugyba', generatorius: 'trupmenu-daugyba', lygis: 1 },
          { pavadinimas: 'Dauginame paprastąsias trupmenas', generatorius: 'trupmenu-daugyba', lygis: 2 },
          { pavadinimas: 'Paprastąją trupmeną dalijame iš natūraliojo skaičiaus', generatorius: 'trupmenu-daugyba', lygis: 2 },
          { pavadinimas: 'Dalijame iš paprastosios trupmenos', generatorius: 'trupmenu-daugyba', lygis: 3 },
        ],
        generatorius: 'trupmenu-daugyba',
        lygis: 2,
      },
      {
        numeris: 4,
        pavadinimas: 'Neneigiamųjų dešimtainių skaičių daugyba ir dalyba',
        potemes: [
          { pavadinimas: 'Dešimtainį skaičių dauginame iš natūraliojo', generatorius: 'desimtaines', lygis: 2 },
          'Dauginame dešimtainius skaičius',
          'Dešimtainį skaičių dalijame iš natūraliojo',
          'Periodinės trupmenos',
          'Dalijame dešimtainius skaičius',
        ],
        generatorius: 'desimtaines',
        lygis: 3,
      },
      {
        numeris: 5,
        pavadinimas: 'Teigiamųjų ir neigiamųjų skaičių daugyba ir dalyba',
        potemes: [
          { pavadinimas: 'Dauginame', generatorius: 'neigiami', lygis: 3 },
          { pavadinimas: 'Dalijame', generatorius: 'neigiami', lygis: 3 },
          { pavadinimas: 'Dauginame ir dalijame', generatorius: 'neigiami', lygis: 3 },
          { pavadinimas: 'Taikome skirstomumo dėsnį', generatorius: 'veiksmu-tvarka', lygis: 2 },
          { pavadinimas: 'Skaičiuojame skaitinių reiškinių reikšmes', generatorius: 'veiksmu-tvarka', lygis: 3 },
        ],
        generatorius: 'neigiami',
        lygis: 3,
      },
      {
        numeris: 6,
        pavadinimas: 'Procentai. Proporcija',
        potemes: [
          { pavadinimas: 'Trupmenos, dešimtainiai skaičiai, procentai', generatorius: 'procentai', lygis: 1 },
          { pavadinimas: 'Ieškome skaičiaus dalies', generatorius: 'procentai', lygis: 1 },
          { pavadinimas: 'Ieškome viso skaičiaus', generatorius: 'procentai', lygis: 2 },
          { pavadinimas: 'Pagrindinė proporcijos savybė', generatorius: 'proporcijos', lygis: 2 },
          { pavadinimas: 'Procentų uždavinių sprendimas sudarant proporciją', generatorius: 'procentai', lygis: 3 },
          { pavadinimas: 'Dalijimas proporcingai', generatorius: 'proporcijos', lygis: 3 },
        ],
        generatorius: 'procentai',
        lygis: 2,
      },
      {
        numeris: 7,
        pavadinimas: 'Tiesioginis proporcingumas',
        potemes: [
          { pavadinimas: 'Formulės, lentelės', generatorius: 'proporcijos', lygis: 1 },
          { pavadinimas: 'Grafikai', generatorius: 'funkcijos', lygis: 1 },
          { pavadinimas: 'Tiesiogiai proporcingi dydžiai', generatorius: 'proporcijos', lygis: 2 },
          { pavadinimas: 'Tiesiogiai proporcingų dydžių priklausomybės grafikas', generatorius: 'funkcijos', lygis: 1 },
        ],
        generatorius: 'proporcijos',
        lygis: 2,
      },
      {
        numeris: 8,
        pavadinimas: 'Reiškiniai. Lygtys',
        potemes: [
          { pavadinimas: 'Raidinio reiškinio koeficientas', generatorius: 'raidiniai-reiskiniai', lygis: 1 },
          { pavadinimas: 'Panašiųjų narių sutraukimas', generatorius: 'raidiniai-reiskiniai', lygis: 3 },
          { pavadinimas: 'Atskliautimas', generatorius: 'veiksmu-tvarka', lygis: 2 },
          { pavadinimas: 'Sprendžiame paprastas lygtis', generatorius: 'tiesines-lygtys', lygis: 1 },
          { pavadinimas: 'Sprendžiame sudėtingesnes lygtis', generatorius: 'tiesines-lygtys', lygis: 2 },
          { pavadinimas: 'Sprendžiame lygtis su skliaustais', generatorius: 'tiesines-lygtys', lygis: 3 },
          { pavadinimas: 'Tekstinių uždavinių sprendimas sudarant lygtis', generatorius: 'tiesines-lygtys', lygis: 3 },
        ],
        generatorius: 'tiesines-lygtys',
        lygis: 2,
      },
      {
        numeris: 9,
        pavadinimas: 'Lygios plokštumos figūros',
        potemes: [
          { pavadinimas: 'Lygios plokštumos figūros', generatorius: 'figuros', lygis: 2 },
          { pavadinimas: 'Trikampio kraštinės ir kampai', generatorius: 'kampai', lygis: 1 },
          'Trikampių lygumo požymis pagal dvi kraštines ir kampą tarp jų',
          'Trikampių lygumo požymis pagal kraštinę ir du kampus prie jos',
          'Trikampių lygumo požymis pagal tris kraštines',
          { pavadinimas: 'Braižome kampą, lygų duotam kampui', generatorius: 'konstravimas', lygis: 2 },
          'Braižome trikampį, lygų duotam trikampiui',
          'Trikampio nelygybė',
        ],
        generatorius: 'kampai',
        lygis: 2,
      },
      {
        numeris: 10,
        pavadinimas: 'Panašiosios plokštumos figūros',
        potemes: [
          { pavadinimas: 'Didiname ir mažiname', generatorius: 'proporcijos', lygis: 3 },
          { pavadinimas: 'Mastelis', generatorius: 'proporcijos', lygis: 3 },
          { pavadinimas: 'Panašiosios plokštumos figūros', generatorius: 'figuros', lygis: 3 },
          'Trikampių panašumo požymiai',
        ],
        generatorius: 'figuros',
        lygis: 3,
      },
      {
        numeris: 11,
        pavadinimas: 'Duomenys',
        potemes: [
          'Dažnių lentelė',
          { pavadinimas: 'Stulpelinė diagrama', generatorius: 'diagramos', lygis: 1 },
          { pavadinimas: 'Linijinė diagrama', generatorius: 'diagramos', lygis: 3 },
          { pavadinimas: 'Imties vidurkis', generatorius: 'vidurkis', lygis: 1 },
          { pavadinimas: 'Imties mediana', generatorius: 'vidurkis', lygis: 2 },
          'Imties moda',
        ],
        generatorius: 'vidurkis',
        lygis: 2,
      },
      {
        numeris: 12,
        pavadinimas: 'Tikimybės',
        potemes: [
          'Galimybių medis',
          'Galimybių lentelė',
          { pavadinimas: 'Daugybos taisyklė', generatorius: 'kombinatorika', lygis: 1 },
          { pavadinimas: 'Įvykis', generatorius: 'tikimybe', lygis: 1 },
          { pavadinimas: 'Įvykio tikimybė', generatorius: 'tikimybe', lygis: 2 },
          { pavadinimas: 'Įvykiui priešingas įvykis ir jo tikimybė', generatorius: 'tikimybe', lygis: 3 },
        ],
        generatorius: 'tikimybe',
        lygis: 2,
      },
    ],
  },

  {
    klase: 7,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Teiginiai',
        potemes: ['Teisingi ir klaidingi teiginiai', 'Aksioma, apibrėžimas, teorema', 'Įrodymas'],
      },
      {
        numeris: 2,
        pavadinimas: 'Laipsniai',
        potemes: [
          { pavadinimas: 'Keliame kvadratu ir kubu', generatorius: 'laipsniai', lygis: 1 },
          { pavadinimas: 'Laipsnis su natūraliuoju rodikliu', generatorius: 'laipsniai', lygis: 1 },
          { pavadinimas: 'Dauginame ir dalijame laipsnius su vienodais pagrindais', generatorius: 'laipsniai', lygis: 2 },
          { pavadinimas: 'Dauginame ir dalijame laipsnius su vienodais rodikliais', generatorius: 'laipsniai', lygis: 2 },
          { pavadinimas: 'Laipsnį keliame laipsniu', generatorius: 'laipsniai', lygis: 3 },
          'Laipsnis su sveikuoju neigiamuoju rodikliu',
          'Laipsnio su sveikuoju neigiamuoju rodikliu savybės',
          'Standartinė skaičiaus išraiška',
        ],
        generatorius: 'laipsniai',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Procentai',
        potemes: [
          { pavadinimas: 'Ieškome, kiek procentų pakito dydis', generatorius: 'procentai', lygis: 3 },
          { pavadinimas: 'Ieškome dydžio, kai žinoma jo pradinė vertė ir pokytis procentais', generatorius: 'procentai', lygis: 3 },
          { pavadinimas: 'Paprastosios palūkanos', generatorius: 'palukanos', lygis: 1 },
          { pavadinimas: 'Sudėtinės palūkanos', generatorius: 'palukanos', lygis: 3 },
          { pavadinimas: 'Sudėtiniai procentai', generatorius: 'palukanos', lygis: 2 },
        ],
        generatorius: 'palukanos',
        lygis: 1,
      },
      {
        numeris: 4,
        pavadinimas: 'Nelygybės',
        potemes: [
          { pavadinimas: 'Skaičių palyginimas', generatorius: 'skaiciu-palyginimas', lygis: 3 },
          'Skaičių intervalai',
          'Prie (iš) abiejų nelygybės pusių pridedame (atimame) tą patį skaičių',
          'Abi nelygybės puses dauginame (dalijame) iš to paties skaičiaus',
          { pavadinimas: 'Nelygybės sprendinys', generatorius: 'nelygybes', lygis: 1 },
          { pavadinimas: 'Sprendžiame vieno žingsnio nelygybes', generatorius: 'nelygybes', lygis: 1 },
          { pavadinimas: 'Sprendžiame paprastas nelygybes', generatorius: 'nelygybes', lygis: 2 },
          { pavadinimas: 'Sprendžiame sudėtingesnes nelygybes', generatorius: 'nelygybes', lygis: 2 },
          'Dviejų nelygybių su vienu nežinomuoju sistema',
          'Dvigubųjų nelygybių sprendimas',
          { pavadinimas: 'Sprendžiame tekstinius uždavinius', generatorius: 'nelygybes', lygis: 3 },
        ],
        generatorius: 'nelygybes',
        lygis: 1,
      },
      {
        numeris: 5,
        pavadinimas: 'Atvirkštinis proporcingumas',
        potemes: [
          'Tarpusavyje susiję dydžiai',
          { pavadinimas: 'Atvirkščiai proporcingi dydžiai', generatorius: 'atvirkstinis', lygis: 1 },
          'Atvirkščiai proporcingų dydžių priklausomybės grafikas',
          { pavadinimas: 'Tekstinių uždavinių sprendimas', generatorius: 'atvirkstinis', lygis: 3 },
        ],
        generatorius: 'atvirkstinis',
        lygis: 1,
      },
      {
        numeris: 6,
        pavadinimas: 'Tiesės',
        potemes: [
          'Taškas ir tiesė',
          { pavadinimas: 'Susikertančiosios tiesės', generatorius: 'kampai', lygis: 2 },
          'Lygiagrečiosios tiesės',
          'Dviejų tiesių lygiagretumo požymiai',
          { pavadinimas: 'Kampų, susidariusių dvi lygiagrečiąsias tieses perkirtus kirstine, savybės', generatorius: 'kampai', lygis: 2 },
        ],
        generatorius: 'kampai',
        lygis: 2,
      },
      {
        numeris: 7,
        pavadinimas: 'Trikampiai ir keturkampiai',
        potemes: [
          { pavadinimas: 'Trikampių rūšys', generatorius: 'kampai', lygis: 1 },
          'Trikampio aukštinės',
          'Trikampio pusiaukraštinės',
          { pavadinimas: 'Trikampio pusiaukampinės', generatorius: 'konstravimas', lygis: 1 },
          { pavadinimas: 'Lygiagretainis', generatorius: 'figuros', lygis: 2 },
          { pavadinimas: 'Stačiakampis', generatorius: 'perimetras', lygis: 1 },
          'Rombas',
          { pavadinimas: 'Kvadratas', generatorius: 'perimetras', lygis: 3 },
          'Trapecija',
          'Lygiašonė ir stačioji trapecijos',
          { pavadinimas: 'Daugiakampiai koordinačių plokštumoje', generatorius: 'koordinates', lygis: 2 },
        ],
        generatorius: 'figuros',
        lygis: 2,
      },
      {
        numeris: 8,
        pavadinimas: 'Trikampių ir keturkampių plotai',
        potemes: [
          { pavadinimas: 'Stačiakampio, kvadrato ir stačiojo trikampio plotų formulės', generatorius: 'plotas-turis', lygis: 1 },
          { pavadinimas: 'Trikampio ploto formulė', generatorius: 'plotas-turis', lygis: 3 },
          { pavadinimas: 'Lygiagretainio ploto formulė', generatorius: 'plotas-turis', lygis: 1 },
          'Rombo ploto formulė',
          'Trapecijos ploto formulė',
        ],
        generatorius: 'plotas-turis',
        lygis: 3,
      },
      {
        numeris: 9,
        pavadinimas: 'Apskritimas ir skritulys',
        potemes: [
          { pavadinimas: 'Apskritimas', generatorius: 'apskritimas', lygis: 1 },
          { pavadinimas: 'Apskritimo ilgis', generatorius: 'apskritimas', lygis: 2 },
          'Apskritimo lankas ir jo ilgis',
          { pavadinimas: 'Skritulys. Skritulio ir jo dalies plotai', generatorius: 'apskritimas', lygis: 3 },
        ],
        generatorius: 'apskritimas',
        lygis: 2,
      },
      {
        numeris: 10,
        pavadinimas: 'Stačioji prizmė ir taisyklingoji piramidė',
        potemes: [
          'Tiesės ir plokštumos erdvėje',
          { pavadinimas: 'Stačioji prizmė', generatorius: 'erdvines-figuros', lygis: 2 },
          { pavadinimas: 'Stačiosios prizmės tūris', generatorius: 'plotas-turis', lygis: 2 },
          { pavadinimas: 'Piramidė', generatorius: 'erdvines-figuros', lygis: 1 },
          { pavadinimas: 'Taisyklingoji piramidė ir jos tūris', generatorius: 'erdvines-figuros', lygis: 3 },
        ],
        generatorius: 'erdvines-figuros',
        lygis: 2,
      },
      {
        numeris: 11,
        pavadinimas: 'Ritinys ir kūgis',
        potemes: [
          'Ritinys',
          { pavadinimas: 'Ritinio paviršiaus plotas ir tūris', generatorius: 'apskritimas', lygis: 3 },
          'Kūgis',
          'Kūgio paviršiaus plotas ir tūris',
        ],
        generatorius: 'apskritimas',
        lygis: 3,
      },
      {
        numeris: 12,
        pavadinimas: 'Duomenys',
        potemes: [
          'Statistinis tyrimas. Populiacija',
          { pavadinimas: 'Imtis. Paprastoji atsitiktinė imtis', generatorius: 'vidurkis', lygis: 1 },
          'Sisteminė, sluoksninė, lizdinė atsitiktinės imtys',
          'Statistinis kintamasis',
          { pavadinimas: 'Duomenų pateikimas skrituline diagrama', generatorius: 'diagramos', lygis: 3 },
        ],
        generatorius: 'vidurkis',
        lygis: 3,
      },
    ],
  },

  {
    klase: 8,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Kvadratinė ir kubinė šaknys',
        potemes: [
          { pavadinimas: 'Kvadratinė šaknis', generatorius: 'saknys', lygis: 1 },
          { pavadinimas: 'Kubinė šaknis', generatorius: 'saknys', lygis: 2 },
          'Iracionalieji skaičiai',
          'Palyginame',
          'Sudedame ir atimame',
          { pavadinimas: 'Šaknis iš sandaugos', generatorius: 'saknys', lygis: 3 },
          'Šaknis iš trupmenos',
          'Iškeliame prieš šaknies ženklą, įkeliame į pošaknį',
          'Skaitinių reiškinių su šaknimis pertvarkiai',
          'Raidinių reiškinių su šaknimis pertvarkiai',
        ],
        generatorius: 'saknys',
        lygis: 1,
      },
      {
        numeris: 2,
        pavadinimas: 'Skaičių aibės',
        potemes: [
          'Skaičių aibės',
          'Skaičių aibės poaibis',
          'Realieji skaičiai',
          { pavadinimas: 'Veiksmai su realiaisiais skaičiais', generatorius: 'saknys', lygis: 3 },
        ],
        generatorius: 'saknys',
        lygis: 3,
      },
      {
        numeris: 3,
        pavadinimas: 'Finansiniai skaičiavimai',
        potemes: [
          { pavadinimas: 'Valiutų kursai', generatorius: 'proporcijos', lygis: 2 },
          { pavadinimas: 'Paprastosios ir sudėtinės palūkanos', generatorius: 'palukanos', lygis: 3 },
          { pavadinimas: 'Paprastosios palūkanos ir grafikai', generatorius: 'palukanos', lygis: 1 },
          { pavadinimas: 'Pirkimas išsimokėtinai', generatorius: 'palukanos', lygis: 2 },
          'Mažėjančiosios palūkanos',
        ],
        generatorius: 'palukanos',
        lygis: 2,
      },
      {
        numeris: 4,
        pavadinimas: 'Reiškiniai',
        potemes: [
          { pavadinimas: 'Vienanaris ir daugianaris', generatorius: 'raidiniai-reiskiniai', lygis: 2 },
          { pavadinimas: 'Atskliautimas', generatorius: 'veiksmu-tvarka', lygis: 3 },
          'Daugianarių daugyba',
          { pavadinimas: 'Dvinario kėlimas kvadratu', generatorius: 'greitosios-formules', lygis: 1 },
          { pavadinimas: 'Dviejų narių sumos dauginimas iš tų narių skirtumo', generatorius: 'greitosios-formules', lygis: 3 },
          'Bendrojo dauginamojo iškėlimas prieš skliaustus',
          'Skaidymas dauginamaisiais grupavimo būdu',
          { pavadinimas: 'Skaidymas dauginamaisiais taikant greitosios daugybos formules', generatorius: 'greitosios-formules', lygis: 2 },
        ],
        generatorius: 'greitosios-formules',
        lygis: 1,
      },
      {
        numeris: 5,
        pavadinimas: 'Tiesinių lygčių sistemos',
        potemes: [
          'Tiesinė lygtis su dviem nežinomaisiais',
          { pavadinimas: 'Tiesinės lygties su dviem nežinomaisiais grafikas', generatorius: 'funkcijos', lygis: 3 },
          { pavadinimas: 'Tiesinių lygčių su dviem nežinomaisiais sistema', generatorius: 'lygciu-sistemos', lygis: 1 },
          'Tiesinių lygčių sistemos sprendinių skaičius',
          { pavadinimas: 'Sprendžiame tiesinių lygčių sistemas keitimo būdu', generatorius: 'lygciu-sistemos', lygis: 2 },
          { pavadinimas: 'Sprendžiame tiesinių lygčių sistemas sulyginimo būdu', generatorius: 'lygciu-sistemos', lygis: 2 },
          { pavadinimas: 'Sprendžiame tiesinių lygčių sistemas sudėties būdu', generatorius: 'lygciu-sistemos', lygis: 3 },
          { pavadinimas: 'Judėjimo uždaviniai', generatorius: 'greitis', lygis: 3 },
          { pavadinimas: 'Įvairūs tekstiniai uždaviniai', generatorius: 'lygciu-sistemos', lygis: 3 },
        ],
        generatorius: 'lygciu-sistemos',
        lygis: 1,
      },
      {
        numeris: 6,
        pavadinimas: 'Vektoriai',
        potemes: [
          { pavadinimas: 'Vektoriaus sąvoka', generatorius: 'vektoriai', lygis: 1 },
          'Vektorių lygumas',
          { pavadinimas: 'Vektorių sudėtis', generatorius: 'vektoriai', lygis: 3 },
          { pavadinimas: 'Vektorių atimtis', generatorius: 'vektoriai', lygis: 3 },
          { pavadinimas: 'Vektoriaus daugyba iš skaičiaus', generatorius: 'vektoriai', lygis: 2 },
        ],
        generatorius: 'vektoriai',
        lygis: 1,
      },
      {
        numeris: 7,
        pavadinimas: 'Plokštumos figūros',
        potemes: [
          { pavadinimas: 'Pitagoro teorema', generatorius: 'pitagoras', lygis: 1 },
          { pavadinimas: 'Atvirkštinė Pitagoro teorema', generatorius: 'pitagoras', lygis: 2 },
          { pavadinimas: 'Atstumas tarp dviejų koordinačių plokštumos taškų', generatorius: 'koordinates', lygis: 3 },
          'Stačiojo trikampio statinis, esantis prieš 30° kampą',
          { pavadinimas: 'Lygiašonis ir lygiakraštis trikampiai', generatorius: 'kampai', lygis: 1 },
          'Trikampio vidurio linija',
          'Trapecijos vidurio linija',
        ],
        generatorius: 'pitagoras',
        lygis: 1,
      },
      {
        numeris: 8,
        pavadinimas: 'Erdviniai kūnai',
        potemes: [
          { pavadinimas: 'Stačioji prizmė', generatorius: 'erdvines-figuros', lygis: 2 },
          { pavadinimas: 'Taisyklingoji piramidė', generatorius: 'erdvines-figuros', lygis: 1 },
          { pavadinimas: 'Ritinys', generatorius: 'apskritimas', lygis: 3 },
          'Kūgis',
          'Rutulys ir sfera',
        ],
        generatorius: 'erdvines-figuros',
        lygis: 3,
      },
      {
        numeris: 9,
        pavadinimas: 'Duomenys',
        potemes: [
          'Empirinis skirstinys',
          'Sukauptasis ir sukauptasis santykinis dažniai',
          { pavadinimas: 'Sugrupuotų duomenų stulpelinė diagrama', generatorius: 'diagramos', lygis: 2 },
          { pavadinimas: 'Histograma', generatorius: 'diagramos', lygis: 3 },
          { pavadinimas: 'Imties skaitinės charakteristikos', generatorius: 'vidurkis', lygis: 3 },
          'Kvartiliai',
          'Stačiakampė diagrama su „ūsais“',
        ],
        generatorius: 'vidurkis',
        lygis: 2,
      },
      {
        numeris: 10,
        pavadinimas: 'Progimnazijos kurso kartojimo medžiaga',
        potemes: [
          'Skaičių aibės',
          { pavadinimas: 'Skaičių dalumas', generatorius: 'dalumas', lygis: 3 },
          { pavadinimas: 'Aritmetiniai veiksmai su skaičiais', generatorius: 'veiksmu-tvarka', lygis: 3 },
          { pavadinimas: 'Paprastosios trupmenos', generatorius: 'trupmenu-sudetis', lygis: 3 },
          { pavadinimas: 'Proporcingumas', generatorius: 'proporcijos', lygis: 3 },
          { pavadinimas: 'Procentai', generatorius: 'procentai', lygis: 3 },
          { pavadinimas: 'Laipsniai. Šaknys', generatorius: 'laipsniai', lygis: 3 },
          { pavadinimas: 'Raidiniai reiškiniai', generatorius: 'raidiniai-reiskiniai', lygis: 3 },
          { pavadinimas: 'Lygtys, lygčių sistemos', generatorius: 'lygciu-sistemos', lygis: 3 },
          { pavadinimas: 'Nelygybės, nelygybių sistemos', generatorius: 'nelygybes', lygis: 3 },
          { pavadinimas: 'Kampai', generatorius: 'kampai', lygis: 3 },
          { pavadinimas: 'Trikampiai', generatorius: 'pitagoras', lygis: 3 },
          { pavadinimas: 'Keturkampiai. Daugiakampiai', generatorius: 'figuros', lygis: 3 },
          { pavadinimas: 'Apskritimas. Skritulys', generatorius: 'apskritimas', lygis: 3 },
          { pavadinimas: 'Vektoriai', generatorius: 'vektoriai', lygis: 3 },
          { pavadinimas: 'Simetrija. Posūkis. Postūmis', generatorius: 'simetrija', lygis: 3 },
          { pavadinimas: 'Erdviniai kūnai', generatorius: 'erdvines-figuros', lygis: 3 },
          { pavadinimas: 'Rinkinių skaičius. Statistika', generatorius: 'kombinatorika', lygis: 2 },
          { pavadinimas: 'Tikimybės', generatorius: 'tikimybe', lygis: 3 },
        ],
        generatorius: 'pupp',
        lygis: 2,
      },
    ],
  },

  {
    klase: 9,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Funkcijos, sekos',
        potemes: [
          'Tarpusavyje susiję dydžiai',
          { pavadinimas: 'Funkcija ir jos grafikas', generatorius: 'funkcijos', lygis: 1 },
          { pavadinimas: 'Funkcijos savybės', generatorius: 'funkcijos', lygis: 3 },
          { pavadinimas: 'Skaičių seka', generatorius: 'sekos', lygis: 2 },
          { pavadinimas: 'Skaičių sekos, išreikštos rekurentiškai', generatorius: 'sekos', lygis: 3 },
        ],
        generatorius: 'funkcijos',
        lygis: 1,
      },
      {
        numeris: 2,
        pavadinimas: 'Tiesinė funkcija',
        potemes: [
          { pavadinimas: 'Tiesioginio proporcingumo funkcija', generatorius: 'proporcijos', lygis: 2 },
          { pavadinimas: 'Tiesinė funkcija', generatorius: 'funkcijos', lygis: 1 },
          { pavadinimas: 'Tiesinės funkcijos savybės', generatorius: 'funkcijos', lygis: 3 },
          'Dviejų tiesių tarpusavio padėtis',
        ],
        generatorius: 'funkcijos',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Kvadratinė lygtis',
        potemes: [
          { pavadinimas: 'Kvadratinės lygties samprata', generatorius: 'kvadratines-lygtys', lygis: 1 },
          { pavadinimas: 'Nepilnosios kvadratinės lygtys', generatorius: 'kvadratines-lygtys', lygis: 1 },
          { pavadinimas: 'Pilnoji kvadratinė lygtis', generatorius: 'kvadratines-lygtys', lygis: 2 },
          { pavadinimas: 'Kvadratinės lygties sprendinių formulės', generatorius: 'kvadratines-lygtys', lygis: 2 },
          { pavadinimas: 'Kvadratinio trinario skaidymas dauginamaisiais', generatorius: 'kvadratines-lygtys', lygis: 3 },
          { pavadinimas: 'Vijeto teorema', generatorius: 'kvadratines-lygtys', lygis: 2 },
        ],
        generatorius: 'kvadratines-lygtys',
        lygis: 2,
      },
      {
        numeris: 4,
        pavadinimas: 'Kvadratinė funkcija',
        potemes: [
          { pavadinimas: 'Kvadratinės funkcijos samprata', generatorius: 'kvadratines-lygtys', lygis: 1 },
          'Grafiko transformacijos',
          { pavadinimas: 'Kvadratinės funkcijos grafikas ir savybės', generatorius: 'kvadratines-lygtys', lygis: 3 },
        ],
        generatorius: 'kvadratines-lygtys',
        lygis: 3,
      },
      {
        numeris: 5,
        pavadinimas: 'Trupmeniniai racionalieji reiškiniai',
        potemes: [
          'Trupmeninio racionaliojo reiškinio samprata',
          { pavadinimas: 'Trupmeninių racionaliųjų reiškinių daugyba, dalyba ir kėlimas laipsniu', generatorius: 'trupmenu-daugyba', lygis: 3 },
          { pavadinimas: 'Trupmeninių racionaliųjų reiškinių sudėtis ir atimtis', generatorius: 'trupmenu-sudetis', lygis: 3 },
          'Sudėtingesnių uždavinių sprendimas',
        ],
        generatorius: 'trupmenu-daugyba',
        lygis: 3,
      },
      {
        numeris: 6,
        pavadinimas: 'Lygčių sistemos',
        potemes: [
          { pavadinimas: 'Lygčių sistemų sprendimas algebriniais būdais', generatorius: 'lygciu-sistemos', lygis: 2 },
          { pavadinimas: 'Lygčių sistemų sprendimas grafiniu būdu', generatorius: 'funkcijos', lygis: 3 },
          { pavadinimas: 'Sudėtingesnių lygčių sistemų sprendimas', generatorius: 'lygciu-sistemos', lygis: 3 },
        ],
        generatorius: 'lygciu-sistemos',
        lygis: 3,
      },
      {
        numeris: 7,
        pavadinimas: 'Įvadas į trigonometriją',
        potemes: [
          { pavadinimas: 'Smailiojo kampo sinusas, kosinusas ir tangentas', generatorius: 'trigonometrija', lygis: 1 },
          { pavadinimas: 'Trigonometrinių santykių reikšmės', generatorius: 'trigonometrija', lygis: 2 },
          'Skaičiuojame skaičiuotuvu',
          'Trigonometrinės formulės',
          { pavadinimas: 'Stačiųjų trikampių sprendimas', generatorius: 'pitagoras', lygis: 2 },
        ],
        generatorius: 'trigonometrija',
        lygis: 1,
      },
      {
        numeris: 8,
        pavadinimas: 'Apskritimas ir skritulys',
        potemes: [
          'Apskritimo liestinė ir kirstinė',
          { pavadinimas: 'Apskritimo centrinis ir įbrėžtinis kampai', generatorius: 'kampai', lygis: 2 },
          'Apskritimo stygų savybės',
          { pavadinimas: 'Skritulio išpjova ir nuopjova', generatorius: 'apskritimas', lygis: 3 },
          'Kirstinių, liestinių, stygų proporcingos atkarpos ir sudaromi kampai',
        ],
        generatorius: 'apskritimas',
        lygis: 2,
      },
      {
        numeris: 9,
        pavadinimas: 'Duomenys ir jų interpretavimas',
        potemes: [
          { pavadinimas: 'Sklaidos diagrama', generatorius: 'diagramos', lygis: 3 },
          'Tiesinė koreliacija',
          'Tiesė sklaidos diagramoje',
        ],
        generatorius: 'vidurkis',
        lygis: 3,
      },
    ],
  },

  {
    klase: 10,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Trupmeninė racionalioji lygtis',
        potemes: [
          'Trupmeninės racionaliosios lygties samprata',
          { pavadinimas: 'Lygčių sprendimas taikant trupmenos, lygios nuliui, savybę', generatorius: 'tiesines-lygtys', lygis: 3 },
          { pavadinimas: 'Kiti trupmeninių lygčių sprendimo būdai', generatorius: 'tiesines-lygtys', lygis: 3 },
          { pavadinimas: 'Judėjimo uždaviniai', generatorius: 'greitis', lygis: 3 },
          { pavadinimas: 'Darbo uždaviniai', generatorius: 'atvirkstinis', lygis: 3 },
          { pavadinimas: 'Mišiniai', generatorius: 'procentai', lygis: 3 },
        ],
        generatorius: 'tiesines-lygtys',
        lygis: 3,
      },
      {
        numeris: 2,
        pavadinimas: 'Trigonometrijos pagrindai',
        potemes: [
          { pavadinimas: 'Posūkio kampo sinusas, kosinusas ir tangentas', generatorius: 'trigonometrija', lygis: 3 },
          { pavadinimas: 'Sinuso, kosinuso ir tangento reikšmės', generatorius: 'trigonometrija', lygis: 2 },
          { pavadinimas: 'Trikampio ploto skaičiavimo formulė', generatorius: 'plotas-turis', lygis: 3 },
          'Sinusų teorema',
          'Kosinusų teorema',
        ],
        generatorius: 'trigonometrija',
        lygis: 3,
      },
      {
        numeris: 3,
        pavadinimas: 'Lygčių su dviem nežinomaisiais sistemos',
        potemes: [
          { pavadinimas: 'Lygčių su dviem nežinomaisiais sistema ir jos sprendiniai', generatorius: 'lygciu-sistemos', lygis: 2 },
          { pavadinimas: 'Atvirkštinio proporcingumo funkcija', generatorius: 'atvirkstinis', lygis: 2 },
          { pavadinimas: 'Lygčių sistemų sprendimas grafiniu būdu', generatorius: 'funkcijos', lygis: 3 },
          { pavadinimas: 'Lygčių sistemų sprendimas algebriniais būdais', generatorius: 'lygciu-sistemos', lygis: 3 },
          { pavadinimas: 'Uždavinių sprendimas, sudarant lygčių sistemas', generatorius: 'lygciu-sistemos', lygis: 3 },
          'Lygčių sistemų sprendimas, įvedant keitinius',
        ],
        generatorius: 'lygciu-sistemos',
        lygis: 3,
      },
      {
        numeris: 4,
        pavadinimas: 'Nelygybės ir jų sistemos',
        potemes: [
          { pavadinimas: 'Kvadratinės nelygybės samprata', generatorius: 'nelygybes', lygis: 3 },
          'Kvadratinės nelygybės sprendimas, remiantis parabolės savybėmis',
          'Kvadratinės nelygybės keitimas nelygybių sistemomis',
          { pavadinimas: 'Kvadratinių nelygybių taikymas', generatorius: 'nelygybes', lygis: 3 },
          { pavadinimas: 'Nelygybių sistemos ir dvigubosios nelygybės', generatorius: 'nelygybes', lygis: 2 },
          'Trupmeninių nelygybių sprendimas',
        ],
        generatorius: 'nelygybes',
        lygis: 3,
      },
    ],
  },
]

/** Kiek programos temų jau turi uždavinių generatorių. */
export function padengimas(): { isViso: number; suGeneratoriumi: number } {
  const visos = programa.flatMap((k) => k.temos)
  return {
    isViso: visos.length,
    suGeneratoriumi: visos.filter((t) => t.generatorius).length,
  }
}
