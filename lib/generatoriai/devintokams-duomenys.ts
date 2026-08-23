import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { sklaidosDiagrama } from './devintokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 9 klasės tema „Duomenys ir jų interpretavimas“ — penkios potemės.
 *
 * Programoje šioje temoje yra ir dvi potemės, kurių turinio apraše nėra:
 * „Imties dydžio ir atsitiktinumo įtaka išvadoms“ bei „Koreliacija nėra
 * priežastinis ryšys“.
 *
 * Sklaidos diagramos braižomos iš tikrų duomenų porų, tad tendencija paveiksle
 * yra tokia, kokia yra duomenyse — išvada grindžiama brėžiniu, o ne įspūdžiu.
 */

/** Duomenų taškai su nedideliu, bet atkuriamu nuokrypiu nuo tiesės. */
function taskai(k: number, b: number, kiek: number, triuksmas = 2): { x: number; y: number }[] {
  const r: { x: number; y: number }[] = []
  for (let x = 1; x <= kiek; x += 1) {
    const nuokrypis = ((x * 7) % (2 * triuksmas + 1)) - triuksmas
    r.push({ x, y: Math.max(1, k * x + b + nuokrypis) })
  }
  return r
}

// ── 9.1. Sklaidos diagrama ──────────────────────────────────────────────────

const T1 = 'sklaidos-diagrama'

const A1 = [
  {
    klausimas: 'Ką sklaidos diagramoje reiškia vienas taškas?',
    atsakymas: 'viena duomenu pora',
    atsakymasRodymui: 'Vieną duomenų porą',
    sprendimas: 'Taško koordinatės — abiejų kintamųjų reikšmės.',
  },
] as const

export const sklaidosDiagramaUzd: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  const k = pasirink([2, 3, 4])
  const b = atsitiktinis(2, 8)
  const duomenys = taskai(k, b, 10)

  return variacija([
    // 1. Bendra tendencija
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Apibūdink bendrą diagramos tendenciją.',
        variantai: [
          'didėjant $x$, $y$ paprastai taip pat didėja',
          'didėjant $x$, $y$ mažėja',
          'ryšio nematyti',
          'visi taškai vienodo aukščio',
        ],
        teisingas: 0,
        sprendimas: 'Taškai kyla iš kairės į dešinę.',
        brezinys: sklaidosDiagrama(duomenys, { x: 'valandos', y: 'taškai' }),
      }),

    // 2. Ką reiškia vienas taškas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ką sklaidos diagramoje reiškia vienas taškas?',
        variantai: [
          'vieną duomenų porą — abiejų kintamųjų reikšmes',
          'vieno kintamojo dažnį',
          'duomenų vidurkį',
          'imties dydį',
        ],
        teisingas: 0,
        sprendimas: 'Todėl taškų yra tiek, kiek stebėjimų.',
      }),

    // 3. Mažėjanti tendencija
    () => {
      const mazejanti = taskai(-2, 28, 8)
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ar didėjant $x$ reikšmės $y$ pagal diagramą didėja, ar mažėja?',
        variantai: ['mažėja', 'didėja', 'nesikeičia'],
        teisingas: 0,
        sprendimas: 'Taškai leidžiasi iš kairės į dešinę.',
        brezinys: sklaidosDiagrama(mazejanti, { x: 'x', y: 'y' }),
      })
    },

    // 4. Kokie kintamieji tinka
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kokius kintamuosius prasminga vaizduoti sklaidos diagramoje?',
        variantai: [
          'du kiekybinius, pavyzdžiui, ūgį ir svorį',
          'vieną kiekybinį',
          'du tekstinius',
          'tik laiką',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienam stebėjimui reikia dviejų skaičių.',
      }),

    // 5. Ar tinka dažniams
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ar sklaidos diagrama tinka vieno kintamojo dažniams rodyti?',
        variantai: [
          'ne, tam tinka stulpelinė diagrama arba histograma',
          'taip, tai jos pagrindinė paskirtis',
          'taip, jei duomenų mažai',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Sklaidos diagrama rodo dviejų kintamųjų ryšį.',
      }),

    // 6. Išskirtis
    () => {
      const su = [...taskai(k, b, 8), { x: 9, y: 1 }]
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kaip toli nuo kitų esantis taškas gali paveikti bendrą vaizdą?',
        variantai: [
          'jis gali iškreipti tendenciją ir aproksimacijos tiesę',
          'jis neturi jokios įtakos',
          'jis padidina visų taškų reikšmes',
          'jis pakeičia ašių padalas',
        ],
        teisingas: 0,
        sprendimas: 'Tokį tašką vadiname išskirtimi ir vertiname atskirai.',
        brezinys: sklaidosDiagrama(su, { x: 'x', y: 'y' }),
      })
    },

    // 7. Ryšio stiprumas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Dviejose diagramose taškai glaudžiai apie tiesę arba labai išsibarstę. Kurioje ryšys stipresnis?',
        variantai: [
          'toje, kur taškai glaudžiai apie tiesę',
          'toje, kur taškai išsibarstę',
          'ryšys vienodas',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Kuo mažiau taškai nutolę nuo tiesės, tuo ryšys stipresnis.',
      }),
  ])
}

// ── 9.2. Tiesinė koreliacija ────────────────────────────────────────────────

const T2 = 'tiesine-koreliacija'

const A2 = [
  {
    klausimas: 'Ką reiškia teigiama tiesinė koreliacija?',
    atsakymas: 'abu dydziai dideja kartu',
    atsakymasRodymui: 'Didėjant vienam kintamajam, kitas taip pat didėja',
    sprendimas: 'Taškai kyla iš kairės į dešinę.',
  },
] as const

export const tiesineKoreliacija: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  const teigiama = taskai(3, 4, 9, 1)
  const neigiama = taskai(-3, 32, 9, 1)

  return variacija([
    // 1. Teigiama koreliacija
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kokia koreliacija matoma diagramoje?',
        variantai: ['stipri teigiama', 'stipri neigiama', 'tiesinio ryšio beveik nėra'],
        teisingas: 0,
        sprendimas: 'Taškai beveik ant kylančios tiesės.',
        brezinys: sklaidosDiagrama(teigiama, { x: 'x', y: 'y' }),
      }),

    // 2. Neigiama koreliacija
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kokia koreliacija matoma diagramoje?',
        variantai: ['stipri neigiama', 'stipri teigiama', 'tiesinio ryšio beveik nėra'],
        teisingas: 0,
        sprendimas: 'Taškai beveik ant leidžiančiosios tiesės.',
        brezinys: sklaidosDiagrama(neigiama, { x: 'x', y: 'y' }),
      }),

    // 3. Ką reiškia neigiama
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ką reiškia neigiama tiesinė koreliacija?',
        variantai: [
          'didėjant vienam kintamajam, kitas paprastai mažėja',
          'abu kintamieji didėja',
          'abu kintamieji neigiami',
          'ryšio nėra',
        ],
        teisingas: 0,
        sprendimas: 'Taškų debesis leidžiasi iš kairės į dešinę.',
      }),

    // 4. Koeficientų palyginimas
    () =>
      poruUzdavinys(naujasId(T2), T2, {
        klausimas: 'Sujunk koreliacijos koeficientą su ryšio apibūdinimu.',
        poros: [
          { kaire: '$r \\approx 0{,}9$', desine: 'stiprus teigiamas ryšys' },
          { kaire: '$r \\approx -0{,}8$', desine: 'stiprus neigiamas ryšys' },
          { kaire: '$r \\approx 0{,}1$', desine: 'tiesinio ryšio beveik nėra' },
          { kaire: '$r = 0$', desine: 'tiesinio ryšio nėra visai' },
        ],
        sprendimas: 'Ženklas rodo kryptį, o dydis — stiprumą.',
      }),

    // 5. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Mokinys teigia, kad $r = -0{,}95$ reiškia silpną ryšį, nes skaičius neigiamas. Kodėl tai klaida?',
        variantai: [
          'ženklas rodo tik kryptį, o stiprumą — koeficiento didumas',
          'nes $r$ negali būti neigiamas',
          'nes $-0{,}95$ yra vidutinis ryšys',
          'iš tikrųjų tai tiesa',
        ],
        teisingas: 0,
        sprendimas: '$|-0{,}95|$ yra beveik 1, tad ryšys labai stiprus.',
      }),

    // 6. Kada koreliacija silpna
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kada sakome, kad tiesinė koreliacija silpna?',
        variantai: [
          'kai taškai labai išsibarstę ir tiesės krypties beveik nematyti',
          'kai taškų mažai',
          'kai $y$ reikšmės mažos',
          'kai ašys skirtingos',
        ],
        teisingas: 0,
        sprendimas: 'Tada koeficientas $r$ yra arti nulio.',
      }),

    // 7. r ≈ 0, bet ryšys yra
    () => {
      const u = [1, 2, 3, 4, 5, 6, 7, 8].map((x) => ({ x, y: (x - 4.5) * (x - 4.5) + 2 }))
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kodėl tiesinė koreliacija gali būti arti nulio, nors ryšys diagramoje akivaizdus?',
        variantai: [
          'nes koeficientas $r$ matuoja tik tiesinį ryšį, o čia ryšys kreivinis',
          'nes taškų per mažai',
          'nes duomenys neteisingi',
          'nes ašys per trumpos',
        ],
        teisingas: 0,
        sprendimas: 'U formos ryšys tiesine tiese neaprašomas.',
        brezinys: sklaidosDiagrama(u, { x: 'x', y: 'y' }),
      })
    },
  ])
}

// ── 9.3. Tiesė sklaidos diagramoje ──────────────────────────────────────────

const T3 = 'tiese-sklaidos-diagramoje'

const A3 = [
  {
    klausimas: 'Ar aproksimacijos tiesė privalo eiti per visus duomenų taškus?',
    atsakymas: 'ne',
    atsakymasRodymui: 'Ne',
    sprendimas: 'Ji tik kuo geriau atitinka bendrą taškų kryptį.',
  },
] as const

export const tieseSklaidosDiagramoje: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const k = pasirink([2, 3])
  const b = atsitiktinis(2, 6)
  const duomenys = taskai(k, b, 10, 2)
  const x = atsitiktinis(6, 9)

  return variacija([
    // 1. Kam naudojama tiesė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kam sklaidos diagramoje naudojama aproksimacijos tiesė?',
        variantai: [
          'bendrai tendencijai parodyti ir reikšmėms prognozuoti',
          'taškams sujungti',
          'ašims pažymėti',
          'išskirtims pašalinti',
        ],
        teisingas: 0,
        sprendimas: 'Ji eina per taškų debesies vidurį.',
        brezinys: sklaidosDiagrama(duomenys, { x: 'x', y: 'y', tiese: { k, b } }),
      }),

    // 2. Prognozė pagal tiesę
    () =>
      uzdavinys(T3, {
        klausimas: `Aproksimacijos tiesė yra $y = ${k}x + ${b}$. Kokią $y$ reikšmę ji prognozuoja, kai $x = ${x}$?`,
        atsakymas: String(k * x + b),
        atsakymasRodymui: `apie $${k * x + b}$`,
        sprendimas: `$${k} \\cdot ${x} + ${b} = ${k * x + b}$; tai apytikslė reikšmė.`,
        brezinys: sklaidosDiagrama(duomenys, { x: 'x', y: 'y', tiese: { k, b } }),
      }),

    // 3. Ar eina per visus taškus
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ar aproksimacijos tiesė privalo eiti per visus duomenų taškus?',
        variantai: [
          'ne, ji tik kuo geriau atitinka bendrą taškų kryptį',
          'taip, per visus',
          'taip, bent per pusę',
          'ji apskritai nebrėžiama',
        ],
        teisingas: 0,
        sprendimas: 'Dalis taškų lieka virš tiesės, dalis — po ja.',
      }),

    // 4. Kada prognozė patikimesnė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kada prognozė pagal aproksimacijos tiesę patikimesnė?',
        variantai: [
          'kai $x$ reikšmė yra duomenų intervalo viduje',
          'kai $x$ labai toli už duomenų intervalo',
          'abiem atvejais vienodai',
          'kai $x$ neigiamas',
        ],
        teisingas: 0,
        sprendimas: 'Už duomenų ribų tendencija gali ir nebegalioti.',
      }),

    // 5. Bloga tiesė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Mokinys pasirinko tiesę, kuri eina per vieną išskirtį, bet prastai atitinka likusius taškus. Kodėl tai blogas pasirinkimas?',
        variantai: [
          'nes tiesė turi atitikti daugumą taškų, o ne vieną išskirtį',
          'nes išskirtis visada klaidinga',
          'nes tiesė turi eiti per pradžios tašką',
          'iš tikrųjų tai geras pasirinkimas',
        ],
        teisingas: 0,
        sprendimas: 'Tokia tiesė duotų netikslias prognozes daugumai reikšmių.',
      }),

    // 6. Interpoliacija ir ekstrapoliacija
    () =>
      poruUzdavinys(naujasId(T3), T3, {
        klausimas: 'Sujunk sąvoką su jos paaiškinimu.',
        poros: [
          { kaire: 'interpoliacija', desine: 'reikšmės vertinimas duomenų intervalo viduje' },
          { kaire: 'ekstrapoliacija', desine: 'reikšmės vertinimas už duomenų intervalo ribų' },
          { kaire: 'išskirtis', desine: 'taškas, smarkiai nutolęs nuo kitų' },
          { kaire: 'aproksimacijos tiesė', desine: 'tiesė, geriausiai atitinkanti taškų kryptį' },
        ],
        sprendimas: 'Ekstrapoliacija visada rizikingesnė.',
      }),

    // 7. Nuolydžio prasmė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Ką reiškia aproksimacijos tiesės $y = ${k}x + ${b}$ koeficientas ${k}?`,
        variantai: [
          `kad $x$ padidėjus vienetu, $y$ vidutiniškai padidėja ${k}`,
          `kad $y$ visada lygus ${k}`,
          `kad duomenų yra ${k}`,
          'nieko nereiškia',
        ],
        teisingas: 0,
        sprendimas: 'Nuolydis rodo vidutinį kitimo greitį.',
      }),
  ])
}

// ── Imties dydžio ir atsitiktinumo įtaka išvadoms (programos potemė) ────────

const T4 = 'imties-dydzio-itaka'

const A4 = [
  {
    klausimas: 'Kuri imtis patikimesnė: 10 ar 1000 žmonių?',
    atsakymas: '1000',
    atsakymasRodymui: '$1000$ žmonių',
    sprendimas: 'Didesnėje imtyje atsitiktinumo įtaka mažesnė.',
  },
] as const

export const imtiesDydzioItaka: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  const maza = pasirink([5, 8, 10, 12])
  const didele = maza * pasirink([10, 50, 100])

  return variacija([
    // 1. Kuri imtis patikimesnė
    () =>
      uzdavinys(T4, {
        klausimas: `Apklausti ${maza} ir ${didele} žmonių. Kurios imties išvados patikimesnės? Užrašyk imties dydį.`,
        atsakymas: String(didele),
        atsakymasRodymui: `$${didele}$`,
        sprendimas: 'Didesnėje imtyje atsitiktiniai svyravimai mažiau iškreipia rezultatą.',
      }),

    // 2. Kodėl maža imtis nepatikima
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kodėl iš ${maza} žmonių apklausos negalima daryti tvirtų išvadų apie visą mokyklą?`,
        variantai: [
          'nes tokia maža imtis gali atsitiktinai neatspindėti visų nuomonių',
          'nes apklausti reikia visus',
          'nes skaičiai per maži skaičiavimams',
          'iš tikrųjų galima',
        ],
        teisingas: 0,
        sprendimas: 'Keli netipiški atsakymai mažoje imtyje pakeičia bendrą vaizdą.',
      }),

    // 3. Atsitiktinumas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Metus monetą 10 kartų herbas iškrito 7 kartus. Ar tai reiškia, kad moneta netaisyklinga?',
        variantai: [
          'ne, tokie nuokrypiai mažoje imtyje yra įprasti',
          'taip, moneta tikrai netaisyklinga',
          'taip, nes turėjo iškristi lygiai 5',
          'to nustatyti neįmanoma niekada',
        ],
        teisingas: 0,
        sprendimas: 'Kuo daugiau bandymų, tuo dažnis artėja prie tikimybės.',
      }),

    // 4. Šališka imtis
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Norint sužinoti mokyklos mokinių nuomonę, apklausti tik krepšinio būrelio nariai. Kuo bloga tokia imtis?',
        variantai: [
          'ji šališka — neatspindi visų mokinių',
          'ji per didelė',
          'ji per tiksli',
          'ji tinkama',
        ],
        teisingas: 0,
        sprendimas: 'Imtis turi būti atsitiktinė ir atspindėti visą populiaciją.',
      }),

    // 5. Ką daryti su išskirtimi
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ką daryti radus imtyje labai išsiskiriančią reikšmę?',
        variantai: [
          'patikrinti, ar tai ne klaida, ir aptarti ją atskirai',
          'iš karto ištrinti',
          'padvigubinti kitas reikšmes',
          'nekreipti dėmesio',
        ],
        teisingas: 0,
        sprendimas: 'Išskirtis gali būti ir klaida, ir tikras retas atvejis.',
      }),

    // 6. Dažnis artėja prie tikimybės
    () =>
      uzdavinys(T4, {
        klausimas: `Metus monetą ${didele} kartų herbas iškrito maždaug pusę kartų. Kiek procentų tai sudaro?`,
        atsakymas: '50',
        atsakymasRodymui: '$50\\%$',
        sprendimas: 'Didėjant bandymų skaičiui santykinis dažnis artėja prie tikimybės.',
      }),

    // 7. Kartojimo nauda
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl tyrimą verta pakartoti su kita imtimi?',
        variantai: [
          'kad įsitikintume, jog rezultatas nebuvo atsitiktinis',
          'kad gautume didesnius skaičius',
          'kad būtų daugiau darbo',
          'kartoti nereikia',
        ],
        teisingas: 0,
        sprendimas: 'Pasikartojantis rezultatas yra patikimesnis.',
      }),
  ])
}

// ── Koreliacija nėra priežastinis ryšys (programos potemė) ──────────────────

const T5 = 'koreliacija-ne-priezastis'

const A5 = [
  {
    klausimas: 'Ar koreliacija įrodo priežastinį ryšį?',
    atsakymas: 'ne',
    atsakymasRodymui: 'Ne',
    sprendimas: 'Ryšį gali lemti trečias, nematomas veiksnys.',
  },
] as const

export const koreliacijaNePriezastis: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const duomenys = taskai(3, 5, 9, 1)

  return variacija([
    // 1. Ar koreliacija įrodo priežastį
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Ar sklaidos diagramoje matomas ryšys įrodo, kad vienas dydis yra kito priežastis?',
        variantai: [
          'ne, ryšį gali lemti trečias veiksnys arba atsitiktinumas',
          'taip, visada',
          'taip, jei taškų daug',
          'taip, jei ryšys teigiamas',
        ],
        teisingas: 0,
        sprendimas: 'Koreliacija rodo tik tai, kad dydžiai kinta kartu.',
        brezinys: sklaidosDiagrama(duomenys, { x: 'x', y: 'y' }),
      }),

    // 2. Trečias veiksnys
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Vasarą kartu didėja ir ledų pardavimas, ir maudynių skaičius. Kas tai geriausiai paaiškina?',
        variantai: [
          'abu dydžius veikia trečias veiksnys — oro temperatūra',
          'ledai skatina maudytis',
          'maudynės skatina pirkti ledus',
          'tai visiškas atsitiktinumas',
        ],
        teisingas: 0,
        sprendimas: 'Toks veiksnys vadinamas paslėptuoju kintamuoju.',
      }),

    // 3. Kryptis neaiški
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Nustatyta, kad daugiau skaitantys mokiniai geriau rašo rašinius. Ko iš to negalima teigti?',
        variantai: [
          'kad būtent skaitymas yra geresnio rašymo priežastis',
          'kad šie dydžiai susiję',
          'kad koreliacija teigiama',
          'kad verta tirti toliau',
        ],
        teisingas: 0,
        sprendimas: 'Gali būti ir atvirkščiai, ir dėl trečio veiksnio.',
      }),

    // 4. Kada galima kalbėti apie priežastį
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kada galima tvirčiau kalbėti apie priežastinį ryšį?',
        variantai: [
          'kai atliekamas eksperimentas su atsitiktinai parinktomis grupėmis',
          'kai koreliacija didesnė už $0{,}5$',
          'kai duomenų daug',
          'niekada',
        ],
        teisingas: 0,
        sprendimas: 'Eksperimente kiti veiksniai išlaikomi vienodi.',
      }),

    // 5. Pagrįstos ir nepagrįstos išvados
    () =>
      poruUzdavinys(naujasId(T5), T5, {
        klausimas: 'Sujunk teiginį su tuo, ar jis pagrįstas sklaidos diagrama.',
        poros: [
          { kaire: '„Dydžiai kinta kartu“', desine: 'pagrįsta' },
          { kaire: '„Matoma teigiama koreliacija“', desine: 'pagrįsta' },
          { kaire: '„Vienas dydis sukelia kitą“', desine: 'nepagrįsta' },
          { kaire: '„Taip bus ir po dešimties metų“', desine: 'nepagrįsta' },
        ],
        sprendimas: 'Diagrama parodo ryšį, bet ne jo priežastį ir ne ateitį.',
      }),

    // 6. Atsitiktinis sutapimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Rasta stipri koreliacija tarp suvalgytų sūrių kiekio ir kino filmų skaičiaus. Kaip tai vertinti?',
        variantai: [
          'greičiausiai tai atsitiktinis sutapimas be jokio ryšio',
          'sūris veikia kino pramonę',
          'filmai skatina valgyti sūrį',
          'reikia uždrausti sūrį',
        ],
        teisingas: 0,
        sprendimas: 'Turint daug duomenų atsitiktinių sutapimų neišvengiamai pasitaiko.',
      }),

    // 7. Kaip užrašyti išvadą
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kaip atsargiausiai užrašyti sklaidos diagramos išvadą?',
        variantai: [
          '„Duomenyse matomas teigiamas ryšys tarp $x$ ir $y$“',
          '„$x$ didina $y$“',
          '„$y$ priklauso tik nuo $x$“',
          '„Kiti veiksniai nesvarbūs“',
        ],
        teisingas: 0,
        sprendimas: 'Teiginys apie ryšį yra pagrįstas, o apie priežastį — ne.',
      }),
  ])
}
