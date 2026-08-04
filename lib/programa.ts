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

export type ProgramosTema = {
  /** Stambiojo punkto numeris klasėje: 1., 2., 3. */
  numeris: number
  pavadinimas: string
  potemes?: string[]
  generatorius?: string
  /** Sunkumo lygis, kuriuo tema generuojama pagal nutylėjimą. */
  lygis?: 1 | 2 | 3
}

export type ProgramosKlase = {
  klase: number
  temos: ProgramosTema[]
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
          'Finansiniai skaičiavimai. Eurai ir centai',
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 1,
      },
      {
        numeris: 2,
        pavadinimas: 'Modeliai ir sąryšiai',
        potemes: ['Dėsningumai. Sekos', 'Algoritmai ir programavimas'],
        generatorius: 'sekos',
        lygis: 1,
      },
      {
        numeris: 3,
        pavadinimas: 'Matavimų skalės ir vienetai',
        potemes: [
          'Masė, laikas',
          'Ilgis, atstumas',
          'Konstravimas, transformacijos',
          'Plokštumos figūros',
          'Erdvės figūros',
        ],
        generatorius: 'matavimo-vienetai',
        lygis: 1,
      },
      {
        numeris: 4,
        pavadinimas: 'Duomenys ir tikimybės',
        potemes: ['Duomenys ir jų interpretavimas'],
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
          'Veiksmų tvarka skaitiniame reiškinyje',
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
      },
      {
        numeris: 12,
        pavadinimas: 'Figūros. Plokščiosios figūros',
        potemes: ['Plokščiosios figūros', 'Kraštinės, kampai, viršūnės', 'Laužės', 'Simetriškos figūros'],
      },
      {
        numeris: 13,
        pavadinimas: 'Erdvinės figūros',
        potemes: ['Erdvinės figūros', 'Ryšiai tarp dvimačių ir trimačių figūrų'],
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
          'Skaičių nuo 0 iki 10 000 skaitymas, rašymas, palyginimas, apvalinimas',
          'Sudėtis ir atimtis',
          'Daugyba iš vienaženklio skaičiaus',
          'Dalyba iš vienaženklio skaičiaus. Dalyba su liekana',
          'Skaitiniai reiškiniai',
          'Sekos, algoritmai',
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
          'Ilgio matavimo vienetas decimetras. Vienetų cm, dm ir m sąryšiai',
          'Perimetro sąvoka. Daugiakampio perimetro skaičiavimas',
          'Laiko matavimo vienetas sekundė. Vienetų sek., min., val. sąryšiai',
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
          'Tiesės ir atkarpos',
          'Kampai',
          'Stačiakampis, kvadratas',
          'Apskritimas ir skritulys',
          'Tiesės atžvilgiu simetriškos figūros',
        ],
        generatorius: 'perimetras',
        lygis: 2,
      },
      {
        numeris: 7,
        pavadinimas: 'Erdvės figūros',
        potemes: ['Stačiakampis gretasienis ir kubas', 'Prizmės', 'Piramidės'],
      },
      {
        numeris: 8,
        pavadinimas: 'Duomenys ir jų interpretavimas. Tikėtinumas',
        potemes: ['Duomenų rinkimas', 'Duomenų vaizdavimas. Stulpelinės diagramos', 'Tikėtinumas'],
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
          'Skirtingų skaičių dydžių ir reikšmių palyginimas',
          'Didelių skaičių trumpinimo žymėjimas',
          'Natūralieji skaičiai',
          'Skaičių suapvalinimas',
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
          'Trupmenų, kurių vardiklyje 10, 100, 1000, rašymas dešimtainiais skaičiais',
          'Trupmenos su vienodais vardikliais',
          'Mišriosios trupmenos',
          'Dešimtainės trupmenos',
          'Dešimtainiai skaičiai kainose',
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
          'Įvairių matavimo prietaisų rodmenys',
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
        potemes: ['Figūros plotas ir ploto vienetai', 'Tūris'],
        generatorius: 'plotas-turis',
        lygis: 1,
      },
      {
        numeris: 12,
        pavadinimas: 'Konstravimas. Transformacijos',
        potemes: [
          'Objektų padėties plokštumoje nusakymas',
          'Objektų judėjimas plokštumoje',
          'Ornamentai',
          'Objekto posūkis apie duotą tašką',
        ],
      },
      {
        numeris: 13,
        pavadinimas: 'Figūros. Plokščiosios figūros',
        potemes: [
          'Trikampiai pagal kraštinių ilgius',
          'Trikampiai pagal kampus',
          'Lygios geometrinės figūros',
        ],
        generatorius: 'kampai',
        lygis: 1,
      },
      {
        numeris: 14,
        pavadinimas: 'Erdvinės figūros',
        potemes: [
          'Kubas ir stačiakampis gretasienis',
          'Erdvinės figūros',
          'Erdvinės figūros iš įvairių pusių',
        ],
        generatorius: 'plotas-turis',
        lygis: 2,
      },
      {
        numeris: 15,
        pavadinimas: 'Duomenys ir interpretavimas',
        potemes: ['Statistinis tyrimas', 'Diagramų skaitymas'],
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
      { numeris: 1, pavadinimas: 'Natūralieji skaičiai', generatorius: 'apvalinimas', lygis: 2 },
      {
        numeris: 2,
        pavadinimas: 'Veiksmai su natūraliaisiais skaičiais',
        generatorius: 'veiksmu-tvarka',
        lygis: 1,
      },
      { numeris: 3, pavadinimas: 'Trupmenos', generatorius: 'dalumas', lygis: 1 },
      {
        numeris: 4,
        pavadinimas: 'Veiksmai su trupmenomis',
        generatorius: 'bendravardiklinimas',
        lygis: 2,
      },
      { numeris: 5, pavadinimas: 'Finansiniai skaičiavimai', generatorius: 'pinigai', lygis: 3 },
      { numeris: 6, pavadinimas: 'Sekos', generatorius: 'sekos', lygis: 3 },
      { numeris: 7, pavadinimas: 'Lygtys', generatorius: 'tiesines-lygtys', lygis: 2 },
      {
        numeris: 8,
        pavadinimas: 'Raidiniai reiškiniai',
        generatorius: 'raidiniai-reiskiniai',
        lygis: 3,
      },
      { numeris: 9, pavadinimas: 'Kelias, laikas, greitis', generatorius: 'greitis', lygis: 2 },
      { numeris: 10, pavadinimas: 'Ilgis, plotas, tūris', generatorius: 'plotas-turis', lygis: 2 },
      { numeris: 11, pavadinimas: 'Transformacijos' },
      { numeris: 12, pavadinimas: 'Plokščios figūros', generatorius: 'kampai', lygis: 2 },
      { numeris: 13, pavadinimas: 'Erdvės figūros' },
      {
        numeris: 14,
        pavadinimas: 'Ploto, tūrio skaičiavimai',
        generatorius: 'plotas-turis',
        lygis: 3,
      },
      { numeris: 15, pavadinimas: 'Duomenys ir interpretavimas', generatorius: 'vidurkis', lygis: 2 },
      { numeris: 16, pavadinimas: 'Tikimybės ir interpretavimas', generatorius: 'tikimybe', lygis: 2 },
    ],
  },

  {
    klase: 6,
    temos: [
      { numeris: 1, pavadinimas: 'Sveikieji skaičiai', generatorius: 'neigiami', lygis: 1 },
      {
        numeris: 2,
        pavadinimas: 'Veiksmai su sveikaisiais skaičiais',
        generatorius: 'neigiami',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Veiksmai su trupmenomis',
        generatorius: 'trupmenu-sudetis',
        lygis: 2,
      },
      { numeris: 4, pavadinimas: 'Finansiniai skaičiavimai', generatorius: 'procentai', lygis: 3 },
      { numeris: 5, pavadinimas: 'Lygtys', generatorius: 'tiesines-lygtys', lygis: 2 },
      {
        numeris: 6,
        pavadinimas: 'Tiesioginis proporcingumas',
        generatorius: 'proporcijos',
        lygis: 2,
      },
      { numeris: 7, pavadinimas: 'Transformacijos' },
      { numeris: 8, pavadinimas: 'Braižymas' },
      { numeris: 9, pavadinimas: 'Plokščiosios figūros', generatorius: 'kampai', lygis: 3 },
      { numeris: 10, pavadinimas: 'Duomenys ir interpretavimas', generatorius: 'vidurkis', lygis: 3 },
      { numeris: 11, pavadinimas: 'Tikimybės ir interpretavimas', generatorius: 'tikimybe', lygis: 3 },
    ],
  },

  {
    klase: 7,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Laipsniai su sveikuoju rodikliu',
        generatorius: 'laipsniai',
        lygis: 2,
      },
      { numeris: 2, pavadinimas: 'Finansiniai skaičiavimai', generatorius: 'palukanos', lygis: 1 },
      { numeris: 3, pavadinimas: 'Nelygybės', generatorius: 'nelygybes', lygis: 1 },
      {
        numeris: 4,
        pavadinimas: 'Atvirkštinis proporcingumas',
        generatorius: 'atvirkstinis',
        lygis: 1,
      },
      { numeris: 5, pavadinimas: 'Transformacijos' },
      { numeris: 6, pavadinimas: 'Braižymas' },
      { numeris: 7, pavadinimas: 'Plokščiosios figūros', generatorius: 'kampai', lygis: 3 },
      { numeris: 8, pavadinimas: 'Erdvės figūros', generatorius: 'plotas-turis', lygis: 3 },
      {
        numeris: 9,
        pavadinimas: 'Ploto, tūrio skaičiavimai',
        generatorius: 'plotas-turis',
        lygis: 3,
      },
      { numeris: 10, pavadinimas: 'Duomenys ir interpretavimas', generatorius: 'vidurkis', lygis: 3 },
      { numeris: 11, pavadinimas: 'Tikimybės ir interpretavimas', generatorius: 'tikimybe', lygis: 3 },
    ],
  },

  {
    klase: 8,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Skaičiai ir skaičiavimai',
        potemes: [
          'Racionaliųjų skaičių aibės samprata',
          'Kvadratinė ir kubinė šaknys',
          'Realiųjų skaičių aibė. Veiksmai su realiaisiais skaičiais',
          'Paprastosios ir sudėtinės palūkanos',
        ],
        generatorius: 'saknys',
        lygis: 1,
      },
      {
        numeris: 2,
        pavadinimas: 'Raidiniai reiškiniai',
        potemes: [
          'Daugianariai. Atskliautimas',
          'Greitosios daugybos formulės',
          'Dvinario kvadrato išskyrimas',
          'Skaidymas dauginamaisiais',
        ],
        generatorius: 'greitosios-formules',
        lygis: 1,
      },
      {
        numeris: 3,
        pavadinimas: 'Lygčių sistemos',
        potemes: [
          'Lygtis su dviem nežinomaisiais',
          'Dviejų tiesinių lygčių sistemos samprata',
          'Sprendimas grafiniu būdu',
          'Sprendimas algebriniais būdais',
        ],
        generatorius: 'lygciu-sistemos',
        lygis: 1,
      },
      {
        numeris: 4,
        pavadinimas: 'Plokštumos figūros. Trikampiai',
        potemes: [
          'Trikampio vidurio linija',
          'Statusis trikampis',
          'Lygiašonis ir lygiakraštis trikampiai',
          'Įrodymai',
        ],
        generatorius: 'pitagoras',
        lygis: 1,
      },
      {
        numeris: 5,
        pavadinimas: 'Erdvės figūros',
        potemes: ['Stačioji prizmė', 'Taisyklingoji piramidė', 'Ritinys', 'Kūgis', 'Sfera ir rutulys'],
        generatorius: 'plotas-turis',
        lygis: 3,
      },
      {
        numeris: 6,
        pavadinimas: 'Konstravimas, transformacijos. Vektoriai',
        potemes: ['Vektoriaus samprata', 'Veiksmai su vektoriais'],
      },
      {
        numeris: 7,
        pavadinimas: 'Duomenys ir jų interpretavimas',
        potemes: [
          'Duomenų rinkimas ir grupavimas',
          'Duomenų vaizdavimas',
          'Duomenų skaitinės charakteristikos',
        ],
        generatorius: 'vidurkis',
        lygis: 3,
      },
    ],
  },

  {
    klase: 9,
    temos: [
      {
        numeris: 1,
        pavadinimas: 'Funkcijos ir sekos',
        potemes: ['Funkcijos samprata', 'Funkcijos savybės', 'Sekos'],
        generatorius: 'funkcijos',
        lygis: 1,
      },
      {
        numeris: 2,
        pavadinimas: 'Tiesinė funkcija',
        potemes: ['Tiesinės funkcijos samprata', 'Tiesės lygtis'],
        generatorius: 'funkcijos',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Kvadratinės lygties algebrinis sprendimas',
        potemes: [
          'Kvadratinės lygties samprata',
          'Kvadratinės lygties sprendinių formulės',
          'Kvadratinio trinario skaidymas tiesiniais dauginamaisiais',
        ],
        generatorius: 'kvadratines-lygtys',
        lygis: 2,
      },
      {
        numeris: 4,
        pavadinimas: 'Kvadratinė funkcija',
        potemes: [
          'Kvadratinės funkcijos samprata',
          'Parabolė',
          'Lygčių sistemos, kurių viena lygtis tiesinė, kita kvadratinė',
        ],
        generatorius: 'kvadratines-lygtys',
        lygis: 3,
      },
      {
        numeris: 5,
        pavadinimas: 'Trupmeniniai racionalieji reiškiniai',
        potemes: [
          'Trupmeninio racionaliojo reiškinio samprata',
          'Veiksmai su trupmeniniais racionaliaisiais reiškiniais',
        ],
        generatorius: 'trupmenu-daugyba',
        lygis: 3,
      },
      {
        numeris: 6,
        pavadinimas: 'Įvadas į trigonometriją',
        potemes: [
          'Panašieji trikampiai',
          'Smailiojo kampo sinusas, kosinusas ir tangentas',
          'Stačiojo trikampio sprendimas',
        ],
        generatorius: 'trigonometrija',
        lygis: 1,
      },
      {
        numeris: 7,
        pavadinimas: 'Apskritimas ir skritulys',
        potemes: ['Apskritimas ir tiesė', 'Apskritimas ir kampas'],
        generatorius: 'apskritimas',
        lygis: 1,
      },
      {
        numeris: 8,
        pavadinimas: 'Duomenys ir jų interpretavimas',
        potemes: ['Taškinė diagrama', 'Tiesinė koreliacija'],
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
        pavadinimas: 'Trupmeninės racionaliosios lygtys',
        potemes: [
          'Trupmeninės racionaliosios lygties samprata',
          'Algebrinis sprendimas',
          'Judėjimo uždaviniai',
          'Darbo uždaviniai',
        ],
        generatorius: 'greitis',
        lygis: 3,
      },
      {
        numeris: 2,
        pavadinimas: 'Lygčių sistemos',
        potemes: [
          'Lygčių sistemų sprendimo būdai',
          'Viena lygtis tiesinė, kita kvadratinė',
          'Viena lygtis tiesinė, kita racionalioji',
        ],
        generatorius: 'lygciu-sistemos',
        lygis: 3,
      },
      {
        numeris: 3,
        pavadinimas: 'Kvadratinės nelygybės',
        potemes: [
          'Kvadratinės nelygybės samprata',
          'Algebrinis sprendimas',
          'Grafinis sprendimas',
        ],
        generatorius: 'nelygybes',
        lygis: 3,
      },
      {
        numeris: 4,
        pavadinimas: 'Trigonometrija',
        potemes: [
          'Vienetinis apskritimas ir posūkio kampas',
          'Bukojo kampo sinusas, kosinusas ir tangentas',
          'Trikampio ploto trigonometrinė formulė',
          'Sinusų teorema',
          'Kosinusų teorema',
        ],
        generatorius: 'trigonometrija',
        lygis: 3,
      },
      {
        numeris: 5,
        pavadinimas: 'Trikampiai',
        potemes: [
          'Trikampio pusiaukampinės ir įbrėžtinis apskritimas',
          'Kraštinių vidurio statmenys ir apibrėžtinis apskritimas',
          'Trikampio pusiaukraštinės',
        ],
        generatorius: 'pitagoras',
        lygis: 3,
      },
      {
        numeris: 6,
        pavadinimas: 'Keturkampiai ir daugiakampiai',
        potemes: [
          'Įbrėžtinis į apskritimą keturkampis',
          'Apibrėžtinis apie apskritimą keturkampis',
          'Įbrėžtiniai ir apibrėžtiniai daugiakampiai',
          'Panašiųjų figūrų savybės',
        ],
        generatorius: 'kampai',
        lygis: 3,
      },
      {
        numeris: 7,
        pavadinimas: 'Rengimasis PUPP',
        generatorius: 'pupp',
        lygis: 2,
      },
      {
        numeris: 8,
        pavadinimas: 'Kombinatorika ir tikimybės',
        potemes: [
          'Kombinatorikos sudėties ir daugybos taisyklės',
          'Rinkiniai, kuriuose elementų tvarka svarbi ir nesvarbi',
          'Santykinis dažnis ir klasikinė tikimybė',
        ],
        generatorius: 'kombinatorika',
        lygis: 1,
      },
      {
        numeris: 9,
        pavadinimas: 'Duomenys ir jų interpretavimas',
        potemes: ['Dispersija ir standartinis nuokrypis', 'Skirstiniai', 'Duomenų skaitinės charakteristikos'],
        generatorius: 'vidurkis',
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
