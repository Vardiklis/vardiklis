import { generuok, type Uzdavinys } from './generatoriai'
import { iPasirinkima } from './generatoriai/formatai'
import { atsitiktinumas, suSekla } from './sekla'

/**
 * Egzaminų lapų sudėtojas.
 *
 * ŠIS FAILAS YRA MŪSŲ UŽDAVINIAI, NE NŠA UŽDUOTYS. Nė vienas uždavinys čia
 * nėra nurašytas ar perfrazuotas iš oficialios užduoties. Kartojama tik tai,
 * kas skelbiama pačioje programoje ir kas nėra saugoma autorių teisių:
 * dalių skaičius, uždavinių tipai, taškų pasiskirstymas, trukmė ir turinio
 * sritys. Turinys — originalus, iš to paties variklio kaip visa svetainė.
 *
 * Šaltinis struktūrai: NŠA matematikos PUPP programa (2025–2026 m. m.).
 *
 * PATIKRINTI ŽMOGUI. Uždavinių kiekiai ir taškai paimti iš programos
 * santraukos, o ne perskaityti iš PDF akimis — dokumento šriftas užkoduotas ir
 * skaitmenys iš teksto srauto neišsitraukė patikimai. Struktūriniai faktai
 * (trys dalys, jų tipai, turinio sritys) perskaityti tiesiai iš dokumento.
 */

export type DaliesTipas = 'pasirenkamasis' | 'trumpasis' | 'pilnasis'

export type Dalis = {
  numeris: 'I' | 'II' | 'III'
  tipas: DaliesTipas
  pavadinimas: string
  /** Kiek uždavinių šioje dalyje. */
  uzdaviniu: number
  /** Kiek taškų iš viso už dalį. */
  taskai: number
}

export type Egzaminas = {
  id: string
  pavadinimas: string
  klase: number
  trukmeMin: number
  taskai: number
  dalys: Dalis[]
  /** Generatorių raktai pagal turinio sritį ir jų svoris rinkinyje. */
  sritys: { pavadinimas: string; dalis: number; generatoriai: string[] }[]
}

/**
 * PUPP matematika, II gimnazijos klasė.
 *
 * Iš 10 klasės turinio programa neįtraukia srities „Duomenys ir tikimybės“,
 * bet 9 klasės turinys įtraukiamas visas — todėl duomenų ir tikimybės
 * uždaviniai lape lieka, tik mažesniu svoriu.
 */
export const PUPP_MATEMATIKA: Egzaminas = {
  id: 'pupp-matematika',
  pavadinimas: 'PUPP matematika',
  klase: 10,
  trukmeMin: 150,
  taskai: 50,
  dalys: [
    {
      numeris: 'I',
      tipas: 'pasirenkamasis',
      pavadinimas: 'Pasirenkamojo atsakymo uždaviniai',
      uzdaviniu: 9,
      taskai: 10,
    },
    {
      numeris: 'II',
      tipas: 'trumpasis',
      pavadinimas: 'Trumpojo atsakymo uždaviniai',
      uzdaviniu: 18,
      taskai: 24,
    },
    {
      numeris: 'III',
      tipas: 'pilnasis',
      pavadinimas: 'Pilnojo sprendimo uždaviniai',
      uzdaviniu: 6,
      taskai: 16,
    },
  ],
  sritys: [
    {
      pavadinimas: 'Skaičiai ir skaičiavimai',
      dalis: 0.5,
      generatoriai: [
        'trupmenu-sudetis',
        'trupmenu-daugyba',
        'procentai',
        'neigiami',
        'laipsniai',
        'saknys',
        'proporcijos',
        'atvirkstinis',
        'palukanos',
        'dalumo-pozymiai',
        'tiesines-lygtys',
        'kvadratines-lygtys',
        'lygciu-sistemos',
        'nelygybes',
        'greitosios-formules',
        'funkcijos',
        'raidiniai-reiskiniai',
      ],
    },
    {
      pavadinimas: 'Geometrija, matai ir matavimai',
      dalis: 0.35,
      generatoriai: [
        'pitagoras',
        'plotas-turis',
        'perimetras',
        'kampai',
        'apskritimas',
        'trigonometrija',
        'erdvines-figuros',
        'piramide',
        'prizme',
        'koordinates',
        'vektoriai',
        'simetrija',
      ],
    },
    {
      pavadinimas: 'Duomenys, statistika ir tikimybė',
      dalis: 0.15,
      generatoriai: ['vidurkis', 'tikimybe', 'kombinatorika', 'diagramos', 'sklaida'],
    },
  ],
}

export const EGZAMINAI: Egzaminas[] = [PUPP_MATEMATIKA]

export type LapoUzdavinys = Uzdavinys & {
  /** Numeris lape: 1, 2, 3 … per visas dalis iš eilės. */
  nr: number
  taskai: number
  sritis: string
}

export type LapoDalis = Dalis & { uzdaviniai: LapoUzdavinys[] }

export type Lapas = {
  egzaminas: Egzaminas
  /** Sėkla, iš kurios lapas atkuriamas. Tas pats variantas — tas pats lapas. */
  sekla: string
  variantas: number
  dalys: LapoDalis[]
}

/**
 * Taškai vienam uždaviniui: dalies suma paskirstoma kuo tolygiau.
 *
 * Programa nurodo intervalus (1–3 arba 2–4 taškai), o ne fiksuotą reikšmę,
 * todėl svarbu tik tai, kad dalies suma sutaptų ir nė vienas uždavinys
 * neiškristų iš intervalo.
 */
function paskirstykTaskus(uzdaviniu: number, taskai: number, maziausiai: number): number[] {
  const bazine = Math.floor(taskai / uzdaviniu)
  const likutis = taskai - bazine * uzdaviniu
  return Array.from({ length: uzdaviniu }, (_, i) =>
    Math.max(maziausiai, bazine + (i < likutis ? 1 : 0)),
  )
}

/** Turinio sritis kiekvienam dalies uždaviniui pagal programos svorius. */
function sritysDaliai(e: Egzaminas, kiek: number): Egzaminas['sritys'] {
  const eile: Egzaminas['sritys'] = []
  for (const s of e.sritys) {
    for (let i = 0; i < Math.round(kiek * s.dalis); i += 1) eile.push(s)
  }
  // Apvalinimas gali duoti per mažai ar per daug — išlyginam pagrindine sritimi.
  while (eile.length < kiek) eile.push(e.sritys[0])
  return eile.slice(0, kiek)
}

/**
 * Sudaro visą egzamino lapą iš sėklos.
 *
 * Tas pats `variantas` visada duoda tą patį lapą — tuo ir remiasi PDF
 * biblioteka: nuoroda į variantą Nr. 7 rytoj duos lygiai tą patį lapą.
 */
export function sudarykLapa(e: Egzaminas, variantas: number): Lapas {
  const sekla = `${e.id}-v${variantas}`

  const dalys = suSekla(sekla, () =>
    e.dalys.map((d) => {
      const maziausiai = d.tipas === 'pilnasis' ? 2 : 1
      const taskuEile = paskirstykTaskus(d.uzdaviniu, d.taskai, maziausiai)
      const sritys = sritysDaliai(e, d.uzdaviniu)
      const matyti = new Set<string>()
      const uzdaviniai: Omit<LapoUzdavinys, 'nr'>[] = []

      for (let i = 0; i < d.uzdaviniu; i += 1) {
        const s = sritys[i]
        // Kartojimo vengiam pagal klausimą: sritis siaura, tad be to iš 18
        // uždavinių keli išeitų vienodi.
        let u: Uzdavinys | null = null
        for (let bandymas = 0; bandymas < 60 && !u; bandymas += 1) {
          const vardas = s.generatoriai[Math.floor(atsitiktinumas() * s.generatoriai.length)]
          // Pilnojo sprendimo dalis — sunkesnis lygis; I dalis gali būti lengvesnė.
          const kandidatas = generuok(vardas, d.tipas === 'pasirenkamasis' ? 1 : 2, e.klase)
          if (matyti.has(kandidatas.klausimas)) continue

          if (d.tipas === 'pasirenkamasis') {
            // I dalis pagal apibrėžimą yra vien pasirenkamojo atsakymo. Jei
            // uždavinys į šį formatą nevirsta (tekstinis atsakymas, mišrusis
            // skaičius), imam kitą — kitaip dalies tipas būtų melagingas.
            const suVariantais = iPasirinkima(kandidatas)
            if (suVariantais.formatas !== 'pasirinkimas') continue
            matyti.add(kandidatas.klausimas)
            u = suVariantais
          } else {
            matyti.add(kandidatas.klausimas)
            u = kandidatas
          }
        }
        if (!u) continue

        uzdaviniai.push({ ...u, taskai: taskuEile[i], sritis: s.pavadinimas })
      }

      return { ...d, uzdaviniai }
    }),
  )

  // Numeracija bendra per visas dalis — kaip tikrame lape.
  let nr = 0
  return {
    egzaminas: e,
    sekla,
    variantas,
    dalys: dalys.map((d) => ({
      ...d,
      uzdaviniai: d.uzdaviniai.map((u) => ({ ...u, nr: (nr += 1) })),
    })),
  }
}

/** Egzaminas pagal id — naudoja ir puslapis, ir API. */
export function rastEgzamina(id: string): Egzaminas | undefined {
  return EGZAMINAI.find((e) => e.id === id)
}
