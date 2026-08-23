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

import type { Sritis } from './generatoriai/sritis'

export type Lygis = 1 | 2
export type { Sritis }

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
      /** Siauresnė sritis nei temos — pvz. potemė vien apie dešimtis. */
      sritis?: Sritis
    }

export type ProgramosTema = {
  /** Stambiojo punkto numeris klasėje: 1., 2., 3. */
  numeris: number
  pavadinimas: string
  potemes?: Potema[]
  generatorius?: string
  /** Sunkumo lygis, kuriuo tema generuojama pagal nutylėjimą. */
  lygis?: Lygis
  /**
   * Skaičių sritis, už kurios negali atsidurti nė vienas temos skaičius.
   *
   * Riba temos *pavadinime* („Skaičiai nuo 0 iki 100") generatoriui nieko
   * nereiškia — jam reikia lauko. Nenurodžius galioja klasės numatytoji
   * sritis iš `SRITIS_PAGAL_KLASE`; 5–10 klasėse ribos netaikomos.
   */
  sritis?: Sritis
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
  /** Paveldėta potemė → tema; `undefined` reiškia klasės numatytąją. */
  sritis?: Sritis
}

/**
 * Potemės su numeriais, generatoriais ir sritimis. Potemė be savo
 * generatoriaus paveldi temos generatorių, tad paspaudus bet kurią gaunami
 * uždaviniai; taip pat paveldima ir sritis.
 */
export function potemes(tema: ProgramosTema): IsskleistaPotema[] {
  return (tema.potemes ?? []).map((p, i) => {
    const objektas = typeof p === 'string' ? { pavadinimas: p } : p
    return {
      numeris: `${tema.numeris}.${i + 1}`,
      pavadinimas: objektas.pavadinimas,
      generatorius: objektas.generatorius ?? tema.generatorius,
      lygis: objektas.lygis ?? tema.lygis ?? 2,
      sritis: ('sritis' in objektas ? objektas.sritis : undefined) ?? tema.sritis,
    }
  })
}

/**
 * Generatoriai, iš kurių sudaromas visos temos uždavinių rinkinys.
 *
 * Anksčiau temos antraštė turėjo vieną bendrąjį generatorių, tad „visos temos“
 * rinkinys parodydavo tik vieną potemės tipą — pavyzdžiui, 10 kl. „Plokštumos
 * figūros“ duodavo vien perimetrus, nors temoje yra ir pusiaukampinės, ir
 * įbrėžtas apskritimas, ir įrodymai. Todėl temai imamas jos potemių
 * generatorių sąrašas: rinkinyje po uždavinį gauna kiekviena potemė.
 *
 * Tvarka — programos tvarka, be pasikartojimų (kelios potemės gali dalytis tuo
 * pačiu generatoriumi). Temos generatorius lieka atsarginis: jis naudojamas
 * tik tada, kai potemių nėra visai.
 */
export function temosGeneratoriai(tema: ProgramosTema): string[] {
  const isPotemiu = potemes(tema)
    .map((p) => p.generatorius)
    .filter((g): g is string => Boolean(g))
  const unikalus = [...new Set(isPotemiu)]
  if (unikalus.length > 0) return unikalus
  return tema.generatorius ? [tema.generatorius] : []
}

export const programa: ProgramosKlase[] = [
  {
    klase: 1,
    temos: [
      {
        numeris: 1,
        sritis: { min: 0, max: 20 },
        pavadinimas: 'Žingsnis į pirmąją klasę',
        potemes: [
          { pavadinimas: 'Kur yra daiktas?', generatorius: 'vieta' },
          { pavadinimas: 'Kaip surikiuoti daiktai?', generatorius: 'daiktu-rikiavimas' },
          { pavadinimas: 'Pagal kokią taisyklę išrikiuoti skaičiai?', generatorius: 'sekos' },
          // Keturios potemės anksčiau dalijosi vienu `skaiciu-palyginimas`
          // generatoriumi ir todėl nė viena negaudavo savo turinio.
          { pavadinimas: 'Kaip rašyti skaičius nuo 0 iki 4?', generatorius: 'skaiciu-rasymas', lygis: 1 },
          { pavadinimas: 'Kaip rašyti skaičius nuo 5 iki 9?', generatorius: 'skaiciu-rasymas', lygis: 2 },
          { pavadinimas: 'Lygu ar nelygu?', generatorius: 'lygu-nelygu' },
          { pavadinimas: 'Daugiau ar mažiau?', generatorius: 'daugiau-maziau' },
        ],
        generatorius: 'skaiciu-palyginimas',
        lygis: 1,
      },
      {
        numeris: 2,
        sritis: { min: 0, max: 9 },
        pavadinimas: 'Sudėtis ir atimtis nuo 0 iki 9',
        // Visos vienuolika potemių anksčiau dalijosi vienu `sudetis-atimtis`
        // generatoriumi, todėl „Kas yra dėmuo ir suma?“ ir „Kiek liko?“ duodavo
        // tą patį „Apskaičiuok: $a + b$“. Dabar kiekviena turi savo.
        potemes: [
          { pavadinimas: 'Kiek yra iš viso?', generatorius: 'kiek-is-viso' },
          { pavadinimas: 'Kaip sudėti du skaičius?', generatorius: 'sudetis-iki-9' },
          { pavadinimas: 'Kas yra dėmuo ir suma?', generatorius: 'demuo-suma' },
          { pavadinimas: 'Kaip sudėti tris dėmenis?', generatorius: 'trys-demenys' },
          { pavadinimas: 'Kaip spręsti sudėties uždavinius?', generatorius: 'sudeties-uzdaviniai' },
          { pavadinimas: 'Kiek liko?', generatorius: 'kiek-liko' },
          { pavadinimas: 'Kaip atimti skaičių?', generatorius: 'atimtis-iki-9' },
          { pavadinimas: 'Kas yra turinys, atėminys ir skirtumas?', generatorius: 'turinys-ateminys' },
          { pavadinimas: 'Kaip spręsti atimties uždavinius?', generatorius: 'atimties-uzdaviniai' },
          { pavadinimas: 'Koks sudėties ir atimties veiksmų ryšys?', generatorius: 'veiksmu-rysys' },
          { pavadinimas: 'Kokio skaičiaus trūksta?', generatorius: 'trukstamas-skaicius' },
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 1,
      },
      {
        numeris: 3,
        sritis: { min: 0, max: 20 },
        pavadinimas: 'Dviženkliai skaičiai iki 20',
        // `skaitmenys` čia duodavo romėniškus skaitmenis ir skaitmenų sumas —
        // ne pirmokui. `skaiciu-palyginimas` nemokėjo nei ženklo <, >, =, nei
        // sekos, kurių prašo abi jo potemės. Abu pakeisti savais.
        potemes: [
          { pavadinimas: 'Kaip sudaryti skaičių 10?', generatorius: 'skaicius-10' },
          { pavadinimas: 'Kaip skaičiuoti iki 20?', generatorius: 'skaiciavimas-iki-20' },
          { pavadinimas: 'Kas yra gretimi skaičiai?', generatorius: 'gretimi-skaiciai' },
          { pavadinimas: 'Kas yra dešimtys ir vienetai?', generatorius: 'desimtys-vienetai' },
          { pavadinimas: 'Kaip palyginti dviženklius skaičius?', generatorius: 'palyginimas-iki-20' },
          { pavadinimas: 'Kaip sudėti skaičius nuo 0 iki 20?', generatorius: 'sudetis-iki-20' },
          { pavadinimas: 'Kaip sudėti skaičius sudarant naują dešimtį?', generatorius: 'sudetis-per-desimti' },
          { pavadinimas: 'Kaip atimti skaičius, mažesnius už 20?', generatorius: 'atimtis-iki-20' },
          { pavadinimas: 'Kaip atimti skaičius, mažesnius už 20, išardant dešimtį?', generatorius: 'atimtis-per-desimti' },
          { pavadinimas: 'Kas yra tekstinis uždavinys?', generatorius: 'tekstinis-uzdavinys' },
          { pavadinimas: 'Kaip skaičių padidinti arba sumažinti keliais vienetais?', generatorius: 'padidink-sumazink' },
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 1,
      },
      {
        numeris: 4,
        sritis: { min: 0, max: 100 },
        pavadinimas: 'Matavimas ir braižymas',
        // `matavimo-vienetai` čia duodavo milimetrus ir decimetrus, `figuros` —
        // daugiakampių įstrižaines, o `algoritmai` — ciklus su daugyba. Pirmoje
        // klasėje mokoma tik centimetro, keturių braižybos sąvokų ir rodyklių
        // tinklelyje, tad kiekviena potemė gavo savo generatorių.
        potemes: [
          { pavadinimas: 'Kuo matuoti ilgį?', generatorius: 'nestandartiniai-matai' },
          { pavadinimas: 'Kas yra centimetras?', generatorius: 'centimetras' },
          { pavadinimas: 'Kaip matuoti ilgį?', generatorius: 'matavimas-liniuote' },
          { pavadinimas: 'Kaip spręsti ilgio matavimo uždavinius?', generatorius: 'ilgio-uzdaviniai' },
          { pavadinimas: 'Kas yra taškas, atkarpa, tiesė ir spindulys?', generatorius: 'geometrijos-zenklai' },
          { pavadinimas: 'Kuo skiriasi piešinys ir brėžinys?', generatorius: 'piesinys-brezinys' },
          { pavadinimas: 'Kaip matuoti ir brėžti atkarpas?', generatorius: 'atkarpu-matavimas' },
          { pavadinimas: 'Kaip perskaityti simboliais užrašytą kelią?', generatorius: 'kelias-simboliais' },
          { pavadinimas: 'Kaip nusakomas kelias?', generatorius: 'kelio-aprasymas' },
        ],
        generatorius: 'nestandartiniai-matai',
        lygis: 1,
      },
      {
        numeris: 5,
        sritis: { min: 0, max: 100 },
        pavadinimas: 'Skaičiai nuo 0 iki 100',
        // Pinigų potemės rėmėsi bendruoju `pinigai` generatoriumi ir duodavo
        // kainas su centais po kablelio („Bandelė kainuoja 48,50 €“). Pirmoje
        // klasėje pinigai yra monetos ir sveiki centai, tad abi gavo savo.
        potemes: [
          { pavadinimas: 'Kaip skaičiuoti dešimtimis?', generatorius: 'skaiciavimas-desimtimis' },
          { pavadinimas: 'Kokie yra skaičiaus skyriai?', generatorius: 'skaiciaus-skyriai' },
          { pavadinimas: 'Kaip skaičiai išrikiuoti šimtalangėje?', generatorius: 'simtalange' },
          { pavadinimas: 'Kaip skaičiai išrikiuoti skaičių tiesėje?', generatorius: 'skaiciu-tiese' },
          { pavadinimas: 'Kaip palyginti skaičius?', generatorius: 'palyginimas-iki-100' },
          { pavadinimas: 'Kokius pinigus naudojame Lietuvoje?', generatorius: 'lietuvos-pinigai' },
          { pavadinimas: 'Kokia pinigų vertė?', generatorius: 'pinigu-verte' },
        ],
        generatorius: 'palyginimas-iki-100',
        lygis: 1,
      },
      {
        numeris: 6,
        sritis: { min: 0, max: 100 },
        pavadinimas: 'Tyrinėju reiškinį „Ženklai“',
        potemes: [
          { pavadinimas: 'Kodėl svarbu suprasti ženklus?', generatorius: 'zenklu-reiksme' },
          { pavadinimas: 'Kokius ženklus žmonės vartojo prieš tūkstančius metų?', generatorius: 'senove-zenklai' },
          { pavadinimas: 'Kokią informaciją perduoda skaičiai?', generatorius: 'skaiciu-informacija' },
        ],
        generatorius: 'zenklu-reiksme',
        lygis: 1,
      },
      {
        numeris: 7,
        sritis: { min: 0, max: 100 },
        pavadinimas: 'Duomenys',
        potemes: [
          { pavadinimas: 'Kas vadinama duomenimis?', generatorius: 'kas-yra-duomenys' },
          { pavadinimas: 'Kaip skaityti piktogramą?', generatorius: 'piktogramos-skaitymas' },
          { pavadinimas: 'Kaip skaityti stulpelinę diagramą?', generatorius: 'diagramos-skaitymas' },
          { pavadinimas: 'Kaip nubraižyti stulpelinę diagramą?', generatorius: 'diagramos-braizymas' },
          { pavadinimas: 'Kaip atliekamas tyrimas?', generatorius: 'tyrimo-eiga' },
          { pavadinimas: 'Kaip aš atlieku tyrimą?', generatorius: 'mano-tyrimas' },
        ],
        generatorius: 'kas-yra-duomenys',
        lygis: 1,
      },
      {
        numeris: 8,
        sritis: { min: 0, max: 100 },
        pavadinimas: 'Sudėtis ir atimtis iki 100',
        // Vienuolika potemių dalijosi vienu `sudetis-atimtis`, tad „stulpeliu“
        // neduodavo stulpelio, „išardant dešimtį“ — skaidymo, o „schema“ —
        // schemos. Kiekvienas pavadinimas dabar turi jį atitinkantį generatorių.
        potemes: [
          { pavadinimas: 'Kaip sudėti dviženklį ir vienaženklį skaičius?', generatorius: 'dvizenklis-plius-vienazenklis' },
          { pavadinimas: 'Kiek vienetų trūksta iki pilnos dešimties?', generatorius: 'iki-pilnos-desimties' },
          { pavadinimas: 'Kaip sudėti eilute dviženklį ir vienaženklį skaičius peržengiant dešimtį?', generatorius: 'sudetis-eilute-per-desimti' },
          { pavadinimas: 'Kaip sudėti stulpeliu dviženklį ir vienaženklį skaičius peržengiant dešimtį?', generatorius: 'sudetis-stulpeliu' },
          { pavadinimas: 'Kaip sudėti du dviženklius skaičius?', generatorius: 'du-dvizenkliai', lygis: 2 },
          { pavadinimas: 'Kaip iš dviženklio skaičiaus atimti vienaženklį?', generatorius: 'dvizenklis-minus-vienazenklis' },
          { pavadinimas: 'Kaip atimti eilute iš dviženklio skaičiaus vienaženklį išardant dešimtį?', generatorius: 'atimtis-eilute-per-desimti' },
          { pavadinimas: 'Kaip atimti stulpeliu iš dviženklio skaičiaus vienaženklį išardant dešimtį?', generatorius: 'atimtis-stulpeliu' },
          { pavadinimas: 'Kaip atimti dviženklį skaičių?', generatorius: 'dvizenkliu-atimtis', lygis: 2 },
          { pavadinimas: 'Kaip vaizduoti tekstinius sudėties uždavinius?', generatorius: 'sudeties-schema' },
          { pavadinimas: 'Kaip vaizduoti tekstinius atimties uždavinius?', generatorius: 'atimties-schema' },
        ],
        generatorius: 'dvizenklis-plius-vienazenklis',
        lygis: 1,
      },
      {
        numeris: 9,
        // Sritis siaurinama iki 100: pirmoje klasėje nei valandos, nei metrai,
        // nei kilogramai neperžengia šimto, o plati riba čia įleisdavo
        // šimtines kainas ir tūkstančius.
        sritis: { min: 0, max: 100 },
        pavadinimas: 'Matai',
        potemes: [
          { pavadinimas: 'Ką rodo laikrodis?', generatorius: 'pilnos-valandos' },
          { pavadinimas: 'Kiek valandų trunka para?', generatorius: 'para' },
          { pavadinimas: 'Kiek laiko užtruko...?', generatorius: 'laiko-trukme' },
          { pavadinimas: 'Kam užteks pinigų?', generatorius: 'ar-uztenka-pinigu' },
          { pavadinimas: 'Kas yra metras?', generatorius: 'metras' },
          { pavadinimas: 'Kaip spręsti uždavinius su ilgio matavimo vienetu metru?', generatorius: 'metro-uzdaviniai' },
          { pavadinimas: 'Kas yra kilogramas?', generatorius: 'kilogramas' },
          { pavadinimas: 'Sunkesnis ar lengvesnis?', generatorius: 'sunkesnis-lengvesnis' },
        ],
        generatorius: 'pilnos-valandos',
        lygis: 1,
      },
      {
        numeris: 10,
        sritis: { min: 0, max: 100 },
        pavadinimas: 'Tyrinėju reiškinį „Miškas“',
        potemes: [
          // Anksčiau sėklos ir aukštis ėjo per `matavimo-vienetai` (kilometrai,
          // litrai), o amžius — per `sudetis-atimtis`, tad „medžio amžius"
          // duodavo uždavinių apie žuvytes akvariume.
          { pavadinimas: 'Kokia medžio sėklos masė?', generatorius: 'misko-sekla' },
          { pavadinimas: 'Kaip išmatuoti medžio aukštį?', generatorius: 'medzio-aukstis' },
          { pavadinimas: 'Kaip apskaičiuoti medžio amžių?', generatorius: 'medzio-amzius' },
        ],
        generatorius: 'medzio-aukstis',
        lygis: 1,
      },
      {
        numeris: 11,
        sritis: { min: 0, max: 100 },
        pavadinimas: 'Kompiuterinių programų kūrimas',
        // `algoritmai` skirtas vyresniems: ciklai „kartok 8 kartus“ ir figūros
        // perimetras. `logika` — 5–10 klasių teiginiai. Pirmokui programavimas
        // yra komanda, komandų seka ir paprasta IR/ARBA sąlyga.
        potemes: [
          { pavadinimas: 'Kas yra komanda?', generatorius: 'kas-yra-komanda' },
          { pavadinimas: 'Kas yra algoritmas?', generatorius: 'kas-yra-algoritmas' },
          { pavadinimas: 'IR ar ARBA?', generatorius: 'ir-arba' },
          { pavadinimas: 'Kaip sukurti programą „Blue-Bot“ robotui?', generatorius: 'blue-bot' },
          { pavadinimas: 'Kaip naudoti programą „ScratchJr“?', generatorius: 'scratch-jr' },
        ],
        generatorius: 'kas-yra-komanda',
        lygis: 1,
      },
      {
        numeris: 12,
        sritis: { min: 0, max: 100 },
        pavadinimas: 'Kartojimas',
        // Kartojimas turi kartoti tai, kas išmokta, o ne kviesti bendruosius
        // generatorius: `skaiciu-palyginimas` čia nemokėjo ženklo <, >, =,
        // `laikas` duodavo minutes, `pinigai` — kainas su centais po kablelio,
        // `figuros` — įstrižaines, o `algoritmai` — ciklus. Dabar kiekviena
        // kartojimo potemė rodo tos pačios klasės savo temos generatorių.
        potemes: [
          { pavadinimas: 'Skaičiai iki 100', generatorius: 'palyginimas-iki-100' },
          { pavadinimas: 'Skaičiaus skyriai', generatorius: 'skaiciaus-skyriai' },
          { pavadinimas: 'Sudėtis ir atimtis', generatorius: 'dvizenklis-plius-vienazenklis' },
          { pavadinimas: 'Ilgis', generatorius: 'ilgio-uzdaviniai' },
          { pavadinimas: 'Laikas', generatorius: 'pilnos-valandos' },
          { pavadinimas: 'Masė', generatorius: 'sunkesnis-lengvesnis' },
          { pavadinimas: 'Pinigai', generatorius: 'pinigu-verte' },
          { pavadinimas: 'Taškas, atkarpa, tiesė ir spindulys', generatorius: 'geometrijos-zenklai' },
          { pavadinimas: 'Duomenys', generatorius: 'diagramos-skaitymas' },
          { pavadinimas: 'Tekstiniai uždaviniai', generatorius: 'sudeties-schema' },
          { pavadinimas: 'Algoritmai ir programavimas', generatorius: 'kas-yra-algoritmas' },
        ],
        generatorius: 'dvizenklis-plius-vienazenklis',
        lygis: 1,
      },
    ],
  },
  {
    klase: 2,
    temos: [
      {
        numeris: 1,
        sritis: { min: 0, max: 100 },
        pavadinimas: 'Skaičiai ir skaičiavimai nuo 0 iki 100',
        potemes: [
          { pavadinimas: 'Ką jau žinau apie skaičius nuo 0 iki 100?', generatorius: 'skaiciu-palyginimas' },
          { pavadinimas: 'Pagal kokią taisyklę sudaryta seka?', generatorius: 'sekos' },
          { pavadinimas: 'Kurį sudėties būdą pasirinksi?', generatorius: 'sudeties-budas' },
          { pavadinimas: 'Kurį atimties būdą pasirinksi?', generatorius: 'atimties-budas' },
          { pavadinimas: 'Kaip rasti nežinomą skaičių?', generatorius: 'nezinomas-skaicius' },
          { pavadinimas: 'Kaip eilute sudėti du dviženklius skaičius peržengiant dešimtį?', generatorius: 'sudetis-eilute-2', lygis: 2 },
          { pavadinimas: 'Kaip stulpeliu sudėti du dviženklius skaičius peržengiant dešimtį?', generatorius: 'sudetis-stulpeliu-2', lygis: 2 },
          { pavadinimas: 'Kaip iš pilnų dešimčių atimti dviženklį skaičių išardant dešimtį?', generatorius: 'desimtys-minus-dvizenklis', lygis: 2 },
          { pavadinimas: 'Kaip eilute iš dviženklio skaičiaus atimti dviženklį išskaidant atėminį?', generatorius: 'atimtis-eilute-2', lygis: 2 },
          { pavadinimas: 'Kaip stulpeliu iš dviženklio skaičiaus atimti dviženklį išardant dešimtį?', generatorius: 'atimtis-stulpeliu-2', lygis: 2 },
          { pavadinimas: 'Kaip spręsti tekstinius sudėties uždavinius?', generatorius: 'tekstiniai-sudeties' },
          { pavadinimas: 'Kaip spręsti tekstinius atimties uždavinius?', generatorius: 'tekstiniai-atimties' },
          { pavadinimas: 'Kaip sukurti ir pavaizduoti tekstinį uždavinį?', generatorius: 'uzdavinio-schema' },
        ],
        generatorius: 'sudeties-budas',
        lygis: 1,
      },
      {
        numeris: 2,
        sritis: { min: 0, max: 100 },
        pavadinimas: 'Daugyba',
        // `sveikieji` yra 6 klasės generatorius: jis duoda neigiamus skaičius ir
        // modulius, tad antrokas vietoj „5 dėžės po 4 obuolius“ gaudavo veiksmus
        // su minusais. Kiekviena potemė gavo savo generatorių.
        potemes: [
          { pavadinimas: 'Kas yra daugyba?', generatorius: 'kas-yra-daugyba' },
          { pavadinimas: 'Kaip vienodų dėmenų sudėtį pakeisti daugyba?', generatorius: 'sudetis-i-daugyba' },
          { pavadinimas: 'Kaip dauginti iš 2?', generatorius: 'daugyba-is-2' },
          { pavadinimas: 'Kaip dauginti iš 3?', generatorius: 'daugyba-is-3' },
          // `sekos` duoda aritmetines sekas (13, 18, 23 — po +5). Ši potemė yra
          // daugybos temoje, tad seka turi didėti kartais: 2, 4, 8, 16.
          { pavadinimas: 'Kiek kartų padidėja sekos narys?', generatorius: 'kartu-sekos' },
          { pavadinimas: 'Kaip dauginti iš 4?', generatorius: 'daugyba-is-4' },
          { pavadinimas: 'Kaip dauginti iš 5?', generatorius: 'daugyba-is-5' },
          { pavadinimas: 'Kaip dauginti iš 0 ir iš 1?', generatorius: 'daugyba-is-0-ir-1' },
          { pavadinimas: 'Kaip dauginti iš 10?', generatorius: 'daugyba-is-10' },
          { pavadinimas: 'Kaip naudotis daugybos lentele?', generatorius: 'daugybos-lentele' },
          { pavadinimas: 'Kaip spręsti daugybos uždavinius?', generatorius: 'daugybos-uzdaviniai' },
          { pavadinimas: 'Kaip sukurti matematinį žaidimą?', generatorius: 'matematinis-zaidimas' },
        ],
        generatorius: 'kas-yra-daugyba',
        lygis: 1,
      },
      {
        numeris: 3,
        sritis: { min: 0, max: 100 },
        pavadinimas: 'Dalyba',
        // `dalies-radimas` duodavo trupmenas, `dalumo-pozymiai` — dalumą iš 9
        // ir 11, `pinigai` — kainas su centais. Visos potemės perrašytos į
        // antroko lygį: dalyba be liekanos ir sveiki eurai.
        potemes: [
          { pavadinimas: 'Kas yra dalyba?', generatorius: 'kas-yra-dalyba' },
          { pavadinimas: 'Koks daugybos ir dalybos veiksmų ryšys?', generatorius: 'daugybos-dalybos-rysys' },
          { pavadinimas: 'Kaip dalyti iš 2?', generatorius: 'dalyba-is-2' },
          { pavadinimas: 'Kaip rasti pusę?', generatorius: 'puse' },
          { pavadinimas: 'Kaip dalyti iš 3 ir 4?', generatorius: 'dalyba-is-3-ir-4' },
          { pavadinimas: 'Kas yra talpos dalyba?', generatorius: 'talpos-dalyba' },
          { pavadinimas: 'Kaip rasti trečdalį ir ketvirtadalį?', generatorius: 'trecdalis-ketvirtadalis' },
          { pavadinimas: 'Kas yra lyginiai ir nelyginiai skaičiai?', generatorius: 'lyginiai-nelyginiai' },
          { pavadinimas: 'Kaip dalyti iš 5?', generatorius: 'dalyba-is-5' },
          { pavadinimas: 'Kiek kainuoja viena prekė?', generatorius: 'vienos-prekes-kaina' },
          { pavadinimas: 'Kaip sumažinti skaičių kelis kartus?', generatorius: 'sumazink-kartus' },
        ],
        generatorius: 'kas-yra-dalyba',
        lygis: 1,
      },
      {
        numeris: 4,
        // Kampų laipsniai iškrenta iš skaičiavimo srities: pilnas kampas yra
        // 360°, nors antrokas skaičiuoja iki 100. Riba čia yra kampo, o ne
        // skaičiavimo riba.
        sritis: { min: 0, max: 360 },
        pavadinimas: 'Plokščiosios figūros',
        // Trys potemės dalijosi `simetrija` generatoriumi (jis vaizduoja taškus
        // koordinačių plokštumoje), `figuros` duodavo įstrižaines ir perimetrus,
        // `kampai` — laipsnius, `logika` — 5–10 klasių teiginius. Antrokui ši
        // tema yra apie atpažinimą, tad kiekviena potemė gavo savo generatorių.
        potemes: [
          { pavadinimas: 'Kas yra laužtė?', generatorius: 'kas-yra-lauzte' },
          { pavadinimas: 'Kas yra kampas?', generatorius: 'kas-yra-kampas' },
          { pavadinimas: 'Kokias figūras vadiname daugiakampiais?', generatorius: 'daugiakampiai' },
          { pavadinimas: 'Ką vadiname taisyklinguoju daugiakampiu?', generatorius: 'taisyklingas-daugiakampis' },
          { pavadinimas: 'Kas yra simetrija ir simetrijos ašis?', generatorius: 'simetrijos-asis' },
          { pavadinimas: 'Kaip vaizduojamos horizontalioji ir vertikalioji simetrijos ašys?', generatorius: 'asiu-rusys' },
          { pavadinimas: 'Kaip atpažinti ir nubraižyti simetriškas figūras?', generatorius: 'simetriskos-figuros' },
          { pavadinimas: 'Kaip atpažinti ir formuluoti teiginius?', generatorius: 'figuru-teiginiai' },
          { pavadinimas: 'Kaip rasti kelią plane pagal komandas?', generatorius: 'plano-kelias' },
          { pavadinimas: 'Kaip sukurti planą?', generatorius: 'plano-kurimas' },
        ],
        generatorius: 'kas-yra-lauzte',
        lygis: 1,
      },
      {
        numeris: 5,
        // Vienintelė pradinių klasių tema, kurioje neigiami skaičiai yra ne
        // klaida, o pati esmė: termometras rodo ir šaltį.
        sritis: { min: -50, max: 1000 },
        pavadinimas: 'Termometras',
        // `neigiami` yra 6 klasės generatorius (moduliai, veiksmai su
        // neigiamais), o `matavimo-vienetai` duodavo kilometrus ir hektarus.
        // Neigiama sritis lieka: šalčio laipsniai yra pati temos esmė.
        potemes: [
          { pavadinimas: 'Ką matuojame termometru?', generatorius: 'ka-matuoja-termometras' },
          { pavadinimas: 'Kiek šilumos ar šalčio rodo termometras?', generatorius: 'termometro-rodmuo' },
          { pavadinimas: 'Kaip rinkti duomenis apie orus?', generatorius: 'oru-duomenys' },
        ],
        generatorius: 'termometro-rodmuo',
        lygis: 1,
      },
      {
        numeris: 6,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Tyrinėju reiškinį „Laikas“',
        potemes: [
          { pavadinimas: 'Kaip atsirado laikrodžiai?', generatorius: 'laikrodziu-istorija' },
          { pavadinimas: 'Kaip pasigaminti smėlio laikrodį?', generatorius: 'smelio-laikrodis' },
          { pavadinimas: 'Ką galima nuveikti per minutę?', generatorius: 'kas-per-minute' },
          { pavadinimas: 'Kiek minučių trunka pusė valandos? Ketvirtis valandos?', generatorius: 'valandos-dalys' },
          { pavadinimas: 'Kaip nusakyti laiką minučių tikslumu?', generatorius: 'laikas-minutemis', lygis: 2 },
          { pavadinimas: 'Kaip atlikti tyrimą, susijusį su laiku?', generatorius: 'laiko-tyrimas' },
        ],
        generatorius: 'valandos-dalys',
        lygis: 1,
      },
      {
        numeris: 7,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Daugyba ir dalyba',
        // `sveikieji` yra 6 klasės (neigiami skaičiai), `veiksmu-tvarka` — 5–6
        // klasės (laipsniai), `dalies-radimas` — trupmenų generatorius. Nė
        // vienas neatitiko antroko: čia reikia lentelės iki 9, dalybos kampu ir
        // veiksmų tvarkos be laipsnių.
        potemes: [
          { pavadinimas: 'Kaip dauginti ir dalyti iš 6?', generatorius: 'daugyba-dalyba-is-6' },
          { pavadinimas: 'Kaip dauginti ir dalyti iš 7?', generatorius: 'daugyba-dalyba-is-7' },
          { pavadinimas: 'Kaip parašyti ir atlikti dalybos veiksmą kampu?', generatorius: 'dalyba-kampu' },
          { pavadinimas: 'Kaip dauginti ir dalyti iš 8 ir 9?', generatorius: 'daugyba-dalyba-is-8-ir-9' },
          { pavadinimas: 'Kaip rasti aštuntadalį?', generatorius: 'astuntadalis' },
          { pavadinimas: 'Kiek kartų daugiau? Kiek kartų mažiau?', generatorius: 'kiek-kartu' },
          { pavadinimas: 'Kaip dalyti 0? Kaip dalyti iš 1 ir 10?', generatorius: 'dalyba-su-nuliu', lygis: 1 },
          { pavadinimas: 'Ką vadiname skaitine lygybe ir nelygybe?', generatorius: 'lygybe-nelygybe' },
          { pavadinimas: 'Kokia tvarka reikia atlikti veiksmus skaitiniame reiškinyje?', generatorius: 'veiksmu-tvarka-2', lygis: 1 },
          { pavadinimas: 'Kaip apskaičiuoti reiškinio su skliaustais reikšmę?', generatorius: 'skliaustai' },
          { pavadinimas: 'Kaip rasti visą daiktų skaičių, kai žinoma jų dalis?', generatorius: 'visuma-pagal-dali' },
        ],
        generatorius: 'daugyba-dalyba-is-6',
        lygis: 2,
      },
      {
        numeris: 8,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Skaičiai iki 1000',
        potemes: [
          { pavadinimas: 'Kaip skaityti ir užrašyti skaičius iki 1000?', generatorius: 'skaiciu-skaitymas' },
          { pavadinimas: 'Kokia yra triženklių skaičių sandara?', generatorius: 'trizenkliu-sandara' },
          { pavadinimas: 'Kaip stambinti ir smulkinti pinigus?', generatorius: 'pinigu-stambinimas' },
          { pavadinimas: 'Pagal kokią taisyklę sudaryta triženklių skaičių seka?', generatorius: 'trizenkliu-sekos' },
          { pavadinimas: 'Kaip sudėti skaičius iki 1000?', generatorius: 'sudetis-iki-1000' },
          { pavadinimas: 'Kaip sudėti skaičius iki 1000 sudarant naują apvalią dešimtį, šimtą?', generatorius: 'sudetis-iki-apvalaus' },
          { pavadinimas: 'Kaip sudėti skaičius iki 1000 peržengiant dešimtį, šimtą?', generatorius: 'sudetis-perzengiant' },
          { pavadinimas: 'Kaip schema vaizduoti dviejų žingsnių uždavinį?', generatorius: 'dvieju-zingsniu-schema' },
          { pavadinimas: 'Kaip užrašyti dviejų žingsnių uždavinio sprendimą?', generatorius: 'dvieju-zingsniu-sprendimas' },
          { pavadinimas: 'Kaip atimti skaičius iki 1000?', generatorius: 'atimtis-iki-1000' },
          { pavadinimas: 'Kaip atimti skaičius iki 1000 iš apvalių dešimčių, šimtų?', generatorius: 'atimtis-is-apvalaus' },
          { pavadinimas: 'Kaip atimti skaičius iki 1000 išardant dešimtį ir šimtą?', generatorius: 'atimtis-isardant' },
          { pavadinimas: 'Kaip sukurti dviejų žingsnių tekstinį uždavinį?', generatorius: 'uzdavinio-kurimas' },
        ],
        generatorius: 'sudetis-iki-1000',
        lygis: 2,
      },
      {
        numeris: 9,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Ilgio matavimas',
        potemes: [
          // `matavimo-vienetai` duodavo hektarus, `plotas-turis` — plotų
          // formules, `erdvines-figuros` — briaunų skaičiavimą. Antrokui čia
          // pakanka mm, cm, m, km ir ploto langeliais.
          { pavadinimas: 'Kas matuojama metrais, centimetrais?', generatorius: 'metrai-centimetrai' },
          { pavadinimas: 'Kas matuojama milimetrais?', generatorius: 'milimetrai' },
          { pavadinimas: 'Kaip smulkinti ir stambinti ilgio matavimo vienetus?', generatorius: 'ilgio-vienetai' },
          { pavadinimas: 'Kaip nubraižyti figūrą?', generatorius: 'figuros-braizymas' },
          { pavadinimas: 'Kaip išmatuoti plotą langeliais?', generatorius: 'plotas-langeliais' },
          { pavadinimas: 'Kaip apskaičiuoti figūros dalį?', generatorius: 'figuros-dalis' },
          { pavadinimas: 'Kas yra erdvės figūros?', generatorius: 'erdves-figuros' },
          { pavadinimas: 'Kas matuojama kilometrais?', generatorius: 'kilometrai' },
          { pavadinimas: 'Kaip spręsti uždavinius su ilgio matavimo vienetais?', generatorius: 'ilgio-uzdaviniai-2' },
          { pavadinimas: 'Kaip atlikti tyrimą su ilgio matavimo vienetais?', generatorius: 'ilgio-tyrimas' },
          { pavadinimas: 'Kokį atstumą nuskrieja skraidyklė?', generatorius: 'skraidykle' },
        ],
        generatorius: 'ilgio-vienetai',
        lygis: 2,
      },
      {
        numeris: 10,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Masės ir talpos matavimas. Algoritmai',
        potemes: [
          { pavadinimas: 'Kas matuojama gramais?', generatorius: 'gramai' },
          { pavadinimas: 'Kokią masę rodo svarstyklės?', generatorius: 'svarstykliu-rodmuo' },
          { pavadinimas: 'Kas matuojama tonomis?', generatorius: 'tonos' },
          { pavadinimas: 'Kaip spręsti uždavinius su masės matavimo vienetais?', generatorius: 'mases-uzdaviniai' },
          { pavadinimas: 'Kaip atlikti tyrimą su masės matavimo vienetais?', generatorius: 'mases-tyrimas' },
          { pavadinimas: 'Kokie yra talpos matavimo vienetai?', generatorius: 'talpos-vienetai' },
          { pavadinimas: 'Kaip spręsti uždavinius su talpos matavimo vienetais?', generatorius: 'talpos-uzdaviniai' },
          // `algoritmai` yra vyresnių klasių ciklai; antrokui — sąlyga
          // „jei… tada…“ ir komandų seka tinklelyje.
          { pavadinimas: 'Ką vadiname pasirinkimo komanda?', generatorius: 'pasirinkimo-komanda' },
          { pavadinimas: 'Kaip sukurti ir vykdyti nuorodų algoritmą?', generatorius: 'nuorodu-algoritmas' },
          { pavadinimas: 'Kaip kurti programą su „ScratchJr“?', generatorius: 'scratch-jr-2' },
        ],
        generatorius: 'gramai',
        lygis: 2,
      },
      {
        numeris: 11,
        // Vandens ir ledo temperatūra — neigiami skaičiai čia yra tema, ne klaida.
        sritis: { min: -50, max: 10000 },
        pavadinimas: 'Tyrinėju reiškinį „Vanduo“',
        potemes: [
          { pavadinimas: 'Kiek vandens sudaro ...?', generatorius: 'vandens-dalis' },
          { pavadinimas: 'Kiek vandens išgaravo?', generatorius: 'kiek-isgaravo' },
          { pavadinimas: 'Kokia gali būti vandens temperatūra?', generatorius: 'vandens-temperatura' },
          { pavadinimas: 'Kada vanduo tampa ledu?', generatorius: 'vanduo-ir-ledas' },
          { pavadinimas: 'Kaip apibendrinti duomenis remiantis stebėjimo lentele?', generatorius: 'stebejimo-lentele' },
        ],
        generatorius: 'kiek-isgaravo',
        lygis: 2,
      },
    ],
  },
  {
    klase: 3,
    temos: [
      {
        numeris: 1,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Skaičiavimai iki 1000. Paprastosios trupmenos',
        potemes: [
          // `sveikieji` yra 6 klasės generatorius, o `dalies-radimas` visoms
          // penkioms trupmenų potemėms duodavo tą patį uždavinį. Šios temos
          // esmė — būdų įvairovė, tad kiekviena potemė gavo savo generatorių.
          { pavadinimas: 'Ką žinau apie skaičius nuo 0 iki 1000?', generatorius: 'skaiciai-iki-1000' },
          { pavadinimas: 'Kokios būna sekos?', generatorius: 'sekos-3' },
          { pavadinimas: 'Kaip įvairiais būdais sudėti skaičius iki 1000?', generatorius: 'sudeties-budai-1000' },
          { pavadinimas: 'Kaip įvairiais būdais atimti skaičius iki 1000?', generatorius: 'atimties-budai-1000' },
          { pavadinimas: 'Kaip lengviau sudėti ir atimti skaičius iki 1000?', generatorius: 'patogus-skaiciavimas' },
          { pavadinimas: 'Kaip pasitikrinti skaičiavimų rezultatus?', generatorius: 'patikrinimas' },
          { pavadinimas: 'Kada reikalinga daugyba arba dalyba?', generatorius: 'daugyba-ar-dalyba' },
          { pavadinimas: 'Kaip moku daugybos lentelę?', generatorius: 'daugybos-lentele-3' },
          { pavadinimas: 'Kaip spręsti tekstinius uždavinius su skaičiais iki 1000?', generatorius: 'tekstiniai-1000' },
          { pavadinimas: 'Kas yra paprastoji trupmena?', generatorius: 'paprastoji-trupmena' },
          { pavadinimas: 'Kaip rasti skaičiaus dalį?', generatorius: 'skaiciaus-dalis' },
          { pavadinimas: 'Kaip apskaičiuoti skaičiaus dalį, kai skaitiklis yra didesnis už 1?', generatorius: 'dalis-su-skaitikliu', lygis: 2 },
          { pavadinimas: 'Kaip spręsti tekstinius uždavinius su trupmenomis?', generatorius: 'trupmenu-uzdaviniai' },
          { pavadinimas: 'Kaip pasigaminti picą?', generatorius: 'picos-dalys' },
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 2,
      },
      {
        numeris: 2,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Sudėtis ir atimtis iki 10 000',
        potemes: [
          // `skaitmenys` duodavo romėniškus skaitmenis, `apvalinimas` —
          // apvalinimą iki dešimtųjų dalių, o šešios veiksmų potemės dalijosi
          // vienu `sudetis-atimtis`, tad išardyto šimto ar tūkstančio atvejai
          // niekada nebūdavo atskirti.
          { pavadinimas: 'Kaip perskaityti ir užrašyti skaičius iki 10 000?', generatorius: 'skaiciai-10000' },
          { pavadinimas: 'Kaip sudaryti skaičiai iki 10 000?', generatorius: 'skaiciu-sudarymas' },
          { pavadinimas: 'Kaip apvalinti skaičius?', generatorius: 'apvalinimas-10000' },
          { pavadinimas: 'Kaip sudėti skaičius iki 10 000, kai nesusidaro naujas tūkstantis?', generatorius: 'sudetis-be-tukstancio' },
          { pavadinimas: 'Kaip sudėti skaičius iki 10 000, kai susidaro naujas tūkstantis?', generatorius: 'sudetis-su-tukstanciu' },
          { pavadinimas: 'Kaip atimti skaičius iki 10 000, kai nereikia išardyti dešimties, šimto, tūkstančio?', generatorius: 'atimtis-be-ardymo' },
          { pavadinimas: 'Kaip atimti skaičius iki 10 000, kai reikia išardyti dešimtį?', generatorius: 'atimtis-ardant-desimti' },
          { pavadinimas: 'Kaip atimti skaičius iki 10 000, kai reikia išardyti šimtą?', generatorius: 'atimtis-ardant-simta' },
          { pavadinimas: 'Kaip atimti skaičius iki 10 000, kai reikia išardyti tūkstantį?', generatorius: 'atimtis-ardant-tukstanti' },
          { pavadinimas: 'Kaip spręsti tekstinius uždavinius sudedant ir atimant skaičius iki 10 000?', generatorius: 'tekstiniai-10000' },
          { pavadinimas: 'Kaip panaudoti elektroninių parduotuvių duomenis kuriant tekstinį uždavinį?', generatorius: 'parduotuves-uzdavinys' },
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 2,
      },
      {
        numeris: 3,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Geometrinės figūros',
        potemes: [
          // `kampai` duodavo kampų sumas laipsniais, `apskritimas` — skritulio
          // plotą su π, `koordinates` — plokštumą su neigiamais skaičiais.
          // Trečiokui šios potemės yra apie atpažinimą brėžinyje, tad
          // kiekviena gavo savo generatorių su savo piešiniu.
          { pavadinimas: 'Kokių būna kampų?', generatorius: 'kampu-rusys' },
          { pavadinimas: 'Kokios tiesės, atkarpos yra susikertančios, statmenos, lygiagrečios?', generatorius: 'tiesiu-padetys' },
          { pavadinimas: 'Kas yra apskritimo centras ir spindulys?', generatorius: 'apskritimo-spindulys' },
          { pavadinimas: 'Kas yra apskritimo skersmuo?', generatorius: 'apskritimo-skersmuo' },
          { pavadinimas: 'Kokia gali būti figūrų tarpusavio padėtis?', generatorius: 'figuru-padetys' },
          { pavadinimas: 'Kaip galima suskaidyti plokštumos figūrą arba sujungti kelias figūras?', generatorius: 'figuru-skaidymas' },
          { pavadinimas: 'Kaip nubraižyti figūrą simetrišką tiesės atžvilgiu?', generatorius: 'simetriska-figura' },
          { pavadinimas: 'Kaip pavaizduoti objekto postūmį?', generatorius: 'objekto-postumis' },
          { pavadinimas: 'Kokie yra stačiakampio gretasienio elementai?', generatorius: 'gretasienio-elementai' },
          { pavadinimas: 'Kas yra prizmė ir piramidė?', generatorius: 'prizme-ir-piramide' },
          { pavadinimas: 'Kaip galima suskaidyti erdvės figūrą arba sujungti kelias figūras?', generatorius: 'erdves-skaidymas' },
          { pavadinimas: 'Kaip sukurti aikštės maketą?', generatorius: 'aikstes-maketas' },
        ],
        generatorius: 'figuros',
        lygis: 2,
      },
      {
        numeris: 4,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Daugiakampio perimetras',
        potemes: [
          // `matavimo-vienetai` ir `figuros` skirti vyresnėms klasėms: pasitaikydavo
          // kvadratinių metrų, įstrižainių ir plotų, kurių trečioje klasėje dar nėra.
          { pavadinimas: 'Kas yra decimetras?', generatorius: 'decimetras' },
          { pavadinimas: 'Kaip smulkinti ir stambinti ilgio matavimo vienetus?', generatorius: 'ilgio-vienetai-3' },
          { pavadinimas: 'Kas yra daugiakampio perimetras?', generatorius: 'perimetro-savoka' },
          { pavadinimas: 'Kaip apskaičiuoti taisyklingojo daugiakampio perimetrą?', generatorius: 'taisyklingo-perimetras' },
          { pavadinimas: 'Kaip galima skirtingais būdais apskaičiuoti stačiakampio perimetrą?', generatorius: 'staciakampio-perimetras' },
          { pavadinimas: 'Kaip nubraižyti daugiakampį ir apskaičiuoti jo perimetrą?', generatorius: 'braizymas-perimetras' },
          { pavadinimas: 'Kaip apskaičiuoti taisyklingojo daugiakampio kraštinės ilgį, kai žinomas jo perimetras?', generatorius: 'taisyklingo-krastine' },
          { pavadinimas: 'Kaip apskaičiuoti nežinomos stačiakampio kraštinės ilgį, kai žinomas jo perimetras?', generatorius: 'staciakampio-krastine' },
          { pavadinimas: 'Kaip pasigaminti matematinį stalo žaidimą?', generatorius: 'stalo-zaidimas' },
        ],
        generatorius: 'perimetras',
        lygis: 1,
      },
      {
        numeris: 5,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Laikas',
        potemes: [
          // Bendrasis `laikas` duodavo sekundes ir vienetų vertimą; tvarkaraščio
          // ir kalendoriaus skaitymo, kurie čia mokomi, jame nebuvo.
          { pavadinimas: 'Kaip apskaičiuoti įvykio trukmę?', generatorius: 'ivykio-trukme' },
          { pavadinimas: 'Kaip naudotis tvarkaraščiu?', generatorius: 'tvarkarascio-skaitymas' },
          { pavadinimas: 'Kaip naudotis kalendoriumi?', generatorius: 'kalendoriaus-skaitymas' },
        ],
        generatorius: 'laikas',
        lygis: 2,
      },
      {
        numeris: 6,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Tyrinėju reiškinį „Pinigai“',
        potemes: [
          // `pinigai` duodavo kainas su kableliu, `procentai` — nuolaidas procentais;
          // nei dešimtainių trupmenų, nei procentų trečioje klasėje dar nėra.
          { pavadinimas: 'Kodėl pinigai turi skirtingą vertę?', generatorius: 'pinigu-verte-3' },
          { pavadinimas: 'Kur išleidžiami pinigai?', generatorius: 'kur-isleidziami' },
          { pavadinimas: 'Kokios yra būtinosios išlaidos?', generatorius: 'butinos-islaidos' },
          { pavadinimas: 'Kaip apskaičiuoti išlaidas?', generatorius: 'islaidu-skaiciavimas' },
          { pavadinimas: 'Kiek atpigo prekė?', generatorius: 'kiek-atpigo' },
          { pavadinimas: 'Kaip galime daugiau sutaupyti?', generatorius: 'taupymas' },
          { pavadinimas: 'Kas sudaro paslaugos kainą?', generatorius: 'paslaugos-kaina' },
        ],
        generatorius: 'pinigai',
        lygis: 2,
      },
      {
        numeris: 7,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Daugyba ir dalyba iki 10 000',
        potemes: [
          // `sveikieji` yra 6 klasės generatorius su neigiamais skaičiais, o dalybos
          // su liekana, nulio dalmenyje ir dalybos kampu jame nebuvo.
          { pavadinimas: 'Kaip dauginti iš apvalių dešimčių, šimtų, tūkstančių?', generatorius: 'daugyba-apvaliais' },
          { pavadinimas: 'Kaip dauginti dviženklį skaičių iš vienaženklio?', generatorius: 'dvizenklio-daugyba' },
          { pavadinimas: 'Kaip dauginti triženklį ir keturženklį skaičių iš vienaženklio?', generatorius: 'trizenklio-daugyba' },
          { pavadinimas: 'Kaip dalyti iš apvalių dešimčių, šimtų, tūkstančių?', generatorius: 'dalyba-apvaliais' },
          { pavadinimas: 'Kas yra dalyba su liekana?', generatorius: 'dalyba-su-liekana' },
          { pavadinimas: 'Kaip dviženklį skaičių dalyti iš vienaženklio?', generatorius: 'dvizenklio-dalyba' },
          { pavadinimas: 'Kaip triženklį skaičių dalyti iš vienaženklio?', generatorius: 'trizenklio-dalyba' },
          { pavadinimas: 'Kaip keturženklį skaičių dalyti iš vienaženklio?', generatorius: 'keturzenklio-dalyba' },
          { pavadinimas: 'Kada dalmenyje reikia rašyti nulį?', generatorius: 'nulis-dalmenyje' },
          { pavadinimas: 'Kiek kartų padidėja ar sumažėja sekos narys?', generatorius: 'kartu-sekos-3' },
          { pavadinimas: 'Kaip pritaikyti daugybą ir dalybą sprendžiant tekstinius uždavinius?', generatorius: 'tekstiniai-daugyba-dalyba' },
          { pavadinimas: 'Kaip spręsti tekstinį uždavinį skirtingais būdais?', generatorius: 'uzdavinys-budais' },
          { pavadinimas: 'Kaip sukurti daugybos ir dalybos žaidimą?', generatorius: 'daugybos-zaidimas' },
        ],
        generatorius: 'sveikieji',
        lygis: 2,
      },
      {
        numeris: 8,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Lygtys ir raidiniai reiškiniai',
        potemes: [
          // `tiesines-lygtys` ir `raidiniai-reiskiniai` skirti 7–8 klasei: ten
          // skleidžiami skliaustai ir sutraukiami panašūs nariai. Trečioje klasėje
          // lygtis sprendžiama prisimenant veiksmo dalių ryšį.
          { pavadinimas: 'Kas yra lygtis?', generatorius: 'kas-yra-lygtis' },
          { pavadinimas: 'Kaip sprendžiant lygtį rasti nežinomą dėmenį?', generatorius: 'nezinomas-demuo' },
          { pavadinimas: 'Kaip sprendžiant lygtį rasti nežinomą turinį ar atėminį?', generatorius: 'nezinomas-turinys' },
          { pavadinimas: 'Kaip sprendžiant lygtį rasti nežinomą daugiklį?', generatorius: 'nezinomas-daugiklis' },
          { pavadinimas: 'Kaip sprendžiant lygtį rasti nežinomą dalinį ar daliklį?', generatorius: 'nezinomas-dalinys' },
          { pavadinimas: 'Kaip pagal piešinį, modelį ar schemą sudaryti lygtį?', generatorius: 'lygtis-is-schemos' },
          { pavadinimas: 'Kaip parašyti raidinį reiškinį ir apskaičiuoti jo reikšmę?', generatorius: 'raidinis-reiskinys-3' },
          { pavadinimas: 'Kaip pagal uždavinio sąlygą parašyti raidinį reiškinį?', generatorius: 'reiskinys-is-salygos' },
          { pavadinimas: 'Kaip pagal piešinį ar schemą parašyti raidinį reiškinį?', generatorius: 'reiskinys-is-piesinio' },
          { pavadinimas: 'Kaip sukurti kompoziciją iš figūrų?', generatorius: 'figuru-kompozicija' },
        ],
        generatorius: 'tiesines-lygtys',
        lygis: 1,
      },
      {
        numeris: 9,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Trupmenos. Tekstinių uždavinių sprendimas',
        potemes: [
          // `bendravardiklinimas` skirtas 5–6 klasei — ten ieškoma bendro vardiklio,
          // o trečiokas trupmenas lygina pažiūrėjęs į modelį arba į skaičių tiesę.
          { pavadinimas: 'Kaip pavaizduoti trupmenas skaičių tiesėje?', generatorius: 'trupmenos-tieseje' },
          { pavadinimas: 'Kaip palyginti trupmenas?', generatorius: 'trupmenu-palyginimas' },
          { pavadinimas: 'Kokios trupmenos yra lygios?', generatorius: 'lygios-trupmenos' },
          { pavadinimas: 'Kaip spręsti uždavinius, kai duomenys pateikti trupmenomis su matavimo vienetais?', generatorius: 'trupmenos-su-matais' },
          { pavadinimas: 'Kaip spręsti visumos radimo uždavinius, kai žinomos kelios dalys?', generatorius: 'visumos-radimas' },
          { pavadinimas: 'Kaip pasirinkti tinkamą uždavinio sprendimo būdą?', generatorius: 'budo-pasirinkimas' },
          { pavadinimas: 'Kaip pagrįsti uždavinio atsakymą remiantis sprendimu?', generatorius: 'atsakymo-pagrindimas' },
          { pavadinimas: 'Kaip keliais skirtingais būdais išspręsti tekstinį uždavinį?', generatorius: 'keli-budai' },
          { pavadinimas: 'Kaip pasigaminti trupmenų modelį?', generatorius: 'trupmenu-modelis' },
        ],
        generatorius: 'dalies-radimas',
        lygis: 2,
      },
      {
        numeris: 10,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Duomenys. Algoritmai',
        potemes: [
          // `diagramos` piešdavo diagramą su padala po vienetą, tad klausimas apie
          // padalos vertę neturėdavo prasmės; `tikimybe` skaičiuodavo tikimybę
          // trupmena, o trečioje klasėje tikėtinumas dar tik įvardijamas žodžiais.
          { pavadinimas: 'Kokia gali būti diagramos padalos vertė?', generatorius: 'padalos-verte' },
          { pavadinimas: 'Kaip pasirinkti tinkamą diagramos padalos vertę?', generatorius: 'padalos-parinkimas' },
          { pavadinimas: 'Kaip grupuoti duomenis pagal nurodytą požymį?', generatorius: 'duomenu-grupavimas' },
          { pavadinimas: 'Kaip įvardyti įvykio tikėtinumą?', generatorius: 'ivykio-tiketinumas' },
          { pavadinimas: 'Kiek skirtingų algoritmų galima sukurti tam pačiam rezultatui gauti?', generatorius: 'keli-algoritmai' },
          { pavadinimas: 'Kaip patikrinti algoritmo teisingumą?', generatorius: 'algoritmo-tikrinimas' },
          { pavadinimas: 'Kaip naudotis programa „XLogo“?', generatorius: 'xlogo' },
        ],
        generatorius: 'diagramos',
        lygis: 2,
      },
      {
        numeris: 11,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Tyrinėju reiškinį „Knyga“',
        potemes: [
          // Tema lieka matematinė: datos, tiražai, lentelės ir diagramos.
          { pavadinimas: 'Kaip keitėsi knyga?', generatorius: 'knygos-raida' },
          { pavadinimas: 'Kiek knygų perskaitėme trečioje klasėje?', generatorius: 'perskaitytos-knygos' },
          { pavadinimas: 'Kokios yra knygos rekordininkės?', generatorius: 'knygu-rekordai' },
          { pavadinimas: 'Kodėl skiriasi knygų tiražai?', generatorius: 'knygu-tirazai' },
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 2,
      },
    ],
  },
  {
    klase: 4,
    temos: [
      {
        numeris: 1,
        sritis: { min: 0, max: 100000 },
        pavadinimas: 'Skaičiai ir skaičiavimai iki 100 000',
        potemes: [
          { pavadinimas: 'Ką žinau apie skaičius iki 10 000?', generatorius: 'skaiciai-iki-10000-4', lygis: 2 },
          { pavadinimas: 'Kaip moku sudėti ir atimti skaičius iki 10 000?', generatorius: 'sudetis-atimtis-10000-4', lygis: 2 },
          { pavadinimas: 'Kaip moku dauginti ir dalyti skaičius iki 10 000?', generatorius: 'daugyba-dalyba-10000-4', lygis: 2 },
          { pavadinimas: 'Kaip moku spręsti tekstinius uždavinius?', generatorius: 'tekstiniai-uzdaviniai-4', lygis: 2 },
          { pavadinimas: 'Kaip stulpeliu dauginti dviženklius skaičius?', generatorius: 'dvizenkliu-daugyba-stulpeliu', lygis: 2 },
          { pavadinimas: 'Kaip dauginti triženklį skaičių iš dviženklio?', generatorius: 'trizenklis-is-dvizenklio', lygis: 2 },
          { pavadinimas: 'Kaip sudaryti skaičius iki 100 000?', generatorius: 'skaiciu-sudarymas-100000', lygis: 2 },
          { pavadinimas: 'Kaip sudėti skaičius iki 100 000?', generatorius: 'sudetis-100000', lygis: 2 },
          { pavadinimas: 'Kaip atimti skaičius iki 100 000?', generatorius: 'atimtis-100000', lygis: 2 },
          { pavadinimas: 'Kaip dauginti skaičius iki 100 000?', generatorius: 'daugyba-100000', lygis: 2 },
          { pavadinimas: 'Kaip dalyti skaičius iki 100 000?', generatorius: 'dalyba-100000', lygis: 2 },
          { pavadinimas: 'Kaip nustatyti sekos sudarymo taisyklę, kai siūlomos dvi sekos?', generatorius: 'dvi-pintos-sekos', lygis: 2 },
          { pavadinimas: 'Kokia tvarka atlikti veiksmus skaitiniame reiškinyje?', generatorius: 'veiksmu-tvarka-4', lygis: 2 },
          { pavadinimas: 'Kaip spręsti tekstinį uždavinį sudarant skaitinį reiškinį?', generatorius: 'reiskinys-pagal-uzdavini', lygis: 2 },
          { pavadinimas: 'Kaip kompiuterine programa sukurti užduotį?', generatorius: 'programa-uzduociai', lygis: 2 },
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 2,
      },
      {
        numeris: 2,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Mišrieji ir dešimtainiai skaičiai',
        potemes: [
          { pavadinimas: 'Ką žinau apie trupmenas?', generatorius: 'trupmenos-kartojimas-4', lygis: 2 },
          { pavadinimas: 'Kaip moku spręsti tekstinius uždavinius su trupmenomis?', generatorius: 'trupmenu-tekstiniai-4', lygis: 2 },
          { pavadinimas: 'Kas yra mišrieji skaičiai?', generatorius: 'misrieji-skaiciai', lygis: 2 },
          { pavadinimas: 'Kaip skaičių tiesėje pavaizduoti mišrųjį skaičių?', generatorius: 'misrieji-tieseje', lygis: 2 },
          { pavadinimas: 'Kaip apvalinti mišriuosius skaičius?', generatorius: 'misriuju-apvalinimas', lygis: 2 },
          { pavadinimas: 'Kaip sudėti ir atimti trupmenas?', generatorius: 'trupmenu-sudetis-4', lygis: 2 },
          { pavadinimas: 'Kaip sudėti ir atimti mišriuosius skaičius?', generatorius: 'misriuju-sudetis', lygis: 2 },
          { pavadinimas: 'Kas yra dešimtainiai skaičiai?', generatorius: 'desimtainiai-skaiciai-4', lygis: 2 },
          { pavadinimas: 'Kaip trupmeną užrašyti dešimtainiu skaičiumi, o dešimtainį skaičių – trupmena?', generatorius: 'trupmena-ir-desimtainis', lygis: 2 },
          { pavadinimas: 'Kaip užrašyti ir apskaičiuoti prekių kainą dešimtainiais skaičiais?', generatorius: 'prekiu-kaina-desimtainiais', lygis: 2 },
          { pavadinimas: 'Kaip atlikti daugybos ir dalybos veiksmus, kai prekių kainos nurodytos dešimtainiais skaičiais?', generatorius: 'kainu-daugyba-dalyba', lygis: 2 },
          { pavadinimas: 'Kaip sudaryti seką iš dešimtainių skaičių?', generatorius: 'desimtainiu-sekos', lygis: 2 },
          { pavadinimas: 'Kaip apskaičiuoti gaminio savikainą?', generatorius: 'gaminio-savikaina', lygis: 2 },
        ],
        generatorius: 'desimtaines',
        lygis: 2,
      },
      {
        numeris: 3,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Plokščiosios figūros. Plotas',
        potemes: [
          { pavadinimas: 'Ką žinau apie plokščiąsias figūras?', generatorius: 'plokstumos-figuros', lygis: 2 },
          { pavadinimas: 'Kaip sudarytos objektų sekos?', generatorius: 'objektu-sekos-4', lygis: 2 },
          { pavadinimas: 'Ką vadiname lygiomis figūromis?', generatorius: 'lygios-figuros', lygis: 2 },
          { pavadinimas: 'Kaip vadinami trikampiai pagal kraštinių ilgius?', generatorius: 'trikampiai-pagal-krastines', lygis: 2 },
          { pavadinimas: 'Kaip vadinami trikampiai pagal kampų rūšis?', generatorius: 'trikampiai-pagal-kampus', lygis: 2 },
          { pavadinimas: 'Kas matuojama kvadratiniais centimetrais, kvadratiniais metrais?', generatorius: 'ploto-vienetai', lygis: 2 },
          { pavadinimas: 'Kaip apskaičiuoti stačiakampio plotą?', generatorius: 'staciakampio-plotas', lygis: 2 },
          { pavadinimas: 'Kaip apskaičiuoti iš kvadratų ir stačiakampių sudarytos figūros plotą?', generatorius: 'sudetines-figuros-plotas', lygis: 2 },
          { pavadinimas: 'Kaip spręsti tekstinius uždavinius, kuriuose reikia apskaičiuoti plotą?', generatorius: 'ploto-tekstiniai', lygis: 2 },
          { pavadinimas: 'Kaip spręsti tekstinius uždavinius, kuriuose reikia apskaičiuoti plotą ir perimetrą?', generatorius: 'plotas-ir-perimetras', lygis: 2 },
          { pavadinimas: 'Kaip remiantis planu apskaičiuoti patalpos plotą?', generatorius: 'patalpos-plotas', lygis: 2 },
        ],
        generatorius: 'plotas-turis',
        lygis: 1,
      },
      {
        numeris: 4,
        sritis: { min: 0, max: 1000000 },
        pavadinimas: 'Skaičiai iki 1 000 000',
        potemes: [
          { pavadinimas: 'Kaip skaityti ir užrašyti skaičius iki 1 000 000?', generatorius: 'skaiciu-skaitymas-1000000', lygis: 2 },
          { pavadinimas: 'Kokia yra skaičių iki 1 000 000 sandara?', generatorius: 'skaiciu-sandara-1000000', lygis: 2 },
          { pavadinimas: 'Kaip skaičių užrašyti skyrių suma?', generatorius: 'skyriu-suma', lygis: 2 },
          { pavadinimas: 'Ką reiškia skaičių trumpiniai „tūkst.“ ir „mln.“?', generatorius: 'tukst-ir-mln', lygis: 2 },
          { pavadinimas: 'Kaip palyginti skaičius iki 1 000 000?', generatorius: 'palyginimas-1000000', lygis: 2 },
          { pavadinimas: 'Kaip apvalinti skaičius iki 1 000 000?', generatorius: 'apvalinimas-1000000', lygis: 2 },
          { pavadinimas: 'Kaip sudėti skaičius iki 1 000 000?', generatorius: 'sudetis-1000000', lygis: 2 },
          { pavadinimas: 'Kaip atimti skaičius iki 1 000 000?', generatorius: 'atimtis-1000000', lygis: 2 },
          { pavadinimas: 'Kaip dauginti skaičius iki 1 000 000?', generatorius: 'daugyba-1000000', lygis: 2 },
          { pavadinimas: 'Kaip dalyti skaičius iki 1 000 000?', generatorius: 'dalyba-1000000', lygis: 2 },
          { pavadinimas: 'Kaip pasirinkti patogų mintinio skaičiavimo būdą?', generatorius: 'mintinis-skaiciavimas', lygis: 2 },
          { pavadinimas: 'Kaip patikrinti skaičiavimo rezultatą?', generatorius: 'rezultato-patikra', lygis: 2 },
          { pavadinimas: 'Kaip iš perteklinės informacijos atrinkti uždaviniui reikalingus duomenis?', generatorius: 'pertekliniai-duomenys', lygis: 2 },
          { pavadinimas: 'Kaip išspręsti kelių žingsnių tekstinį uždavinį?', generatorius: 'keliu-zingsniu-uzdavinys', lygis: 2 },
          { pavadinimas: 'Kaip sudaryti reiškinį su skliaustais pagal tekstinio uždavinio sąlygą?', generatorius: 'reiskinys-su-skliaustais', lygis: 2 },
          { pavadinimas: 'Kaip sukurti matematinį klausimą pagal pateiktus duomenis?', generatorius: 'matematinis-klausimas', lygis: 2 },
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 2,
      },
      {
        numeris: 5,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Lygtys ir raidiniai reiškiniai',
        potemes: [
          { pavadinimas: 'Kas yra lygtis?', generatorius: 'lygties-savoka', lygis: 2 },
          { pavadinimas: 'Kas yra lygties nežinomasis ir sprendinys?', generatorius: 'lygties-nezinomasis', lygis: 2 },
          { pavadinimas: 'Kaip sudaryti lygtį pagal tekstinio uždavinio sąlygą?', generatorius: 'lygtis-pagal-salyga', lygis: 2 },
          { pavadinimas: 'Kaip sudaryti lygtį pagal schemą?', generatorius: 'lygtis-pagal-schema', lygis: 2 },
          { pavadinimas: 'Kaip išspręsti paprastą lygtį?', generatorius: 'paprasta-lygtis', lygis: 2 },
          { pavadinimas: 'Kaip patikrinti lygties sprendinį?', generatorius: 'sprendinio-patikra', lygis: 2 },
          { pavadinimas: 'Kaip tą pačią situaciją aprašyti skirtingomis lygtimis?', generatorius: 'skirtingos-lygtys', lygis: 2 },
          { pavadinimas: 'Kas yra raidinis reiškinys?', generatorius: 'raidinio-reiskinio-savoka', lygis: 2 },
          { pavadinimas: 'Kaip apskaičiuoti raidinio reiškinio reikšmę?', generatorius: 'raidinio-reiskinio-reiksme', lygis: 2 },
          { pavadinimas: 'Kaip pagal tekstinio uždavinio sąlygą parašyti raidinį reiškinį?', generatorius: 'raidinis-pagal-salyga', lygis: 2 },
          { pavadinimas: 'Kaip susieti tekstinę sąlygą, schemą ir raidinį reiškinį?', generatorius: 'salyga-schema-reiskinys', lygis: 2 },
        ],
        generatorius: 'tiesines-lygtys',
        lygis: 2,
      },
      {
        numeris: 6,
        // Termometro rodmenys — vienintelė vieta, kur 4 klasėje reikia minuso.
        sritis: { min: -50, max: 100000 },
        pavadinimas: 'Matavimo prietaisai ir rodmenys',
        potemes: [
          { pavadinimas: 'Kaip perskaityti svarstyklių rodmenis?', generatorius: 'svarstykliu-rodmenys-4', lygis: 2 },
          { pavadinimas: 'Kaip perskaityti laikrodžio rodmenis?', generatorius: 'laikrodzio-rodmenys', lygis: 2 },
          { pavadinimas: 'Kaip perskaityti termometro rodmenis?', generatorius: 'termometro-rodmenys-4', lygis: 2 },
          { pavadinimas: 'Kaip perskaityti odometro rodmenis?', generatorius: 'odometro-rodmenys', lygis: 2 },
          { pavadinimas: 'Kaip pasirinkti tinkamą matavimo vienetą?', generatorius: 'matavimo-vieneto-parinkimas', lygis: 2 },
          { pavadinimas: 'Kaip palyginti skirtingais vienetais išreikštus dydžius?', generatorius: 'vienetu-palyginimas', lygis: 2 },
          { pavadinimas: 'Kaip spręsti uždavinius su masės, laiko ir temperatūros duomenimis?', generatorius: 'mases-laiko-temperaturos-uzdaviniai', lygis: 2 },
        ],
        generatorius: 'matavimo-vienetai',
        lygis: 2,
      },
      {
        numeris: 7,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Kelias, laikas ir greitis',
        potemes: [
          { pavadinimas: 'Kas yra kelias?', generatorius: 'kas-yra-kelias', lygis: 2 },
          { pavadinimas: 'Kas yra greitis?', generatorius: 'kas-yra-greitis', lygis: 2 },
          { pavadinimas: 'Kaip susiję kelias, laikas ir greitis?', generatorius: 'kelias-laikas-greitis', lygis: 2 },
          { pavadinimas: 'Kaip apskaičiuoti nueitą arba nuvažiuotą kelią?', generatorius: 'kelio-skaiciavimas', lygis: 2 },
          { pavadinimas: 'Kaip apskaičiuoti judėjimo laiką?', generatorius: 'judejimo-laikas', lygis: 2 },
          { pavadinimas: 'Kaip apskaičiuoti greitį?', generatorius: 'greicio-skaiciavimas', lygis: 2 },
          { pavadinimas: 'Kas yra vidutinis greitis?', generatorius: 'vidutinis-greitis', lygis: 2 },
          { pavadinimas: 'Kaip naudoti greičio matavimo vienetus km/h, m/min ir m/s?', generatorius: 'greicio-vienetai', lygis: 2 },
          { pavadinimas: 'Kaip spręsti tekstinius judėjimo uždavinius?', generatorius: 'judejimo-uzdaviniai', lygis: 2 },
          { pavadinimas: 'Kaip patikrinti, ar apskaičiuotas greitis yra tikroviškas?', generatorius: 'greicio-tikroviskumas', lygis: 2 },
        ],
        generatorius: 'greitis',
        lygis: 1,
      },
      {
        numeris: 8,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Finansiniai sprendimai',
        potemes: [
          { pavadinimas: 'Kaip perskaityti dešimtainiu skaičiumi užrašytą pinigų sumą?', generatorius: 'pinigu-suma-desimtaine', lygis: 2 },
          { pavadinimas: 'Kaip palyginti prekių ir paslaugų kainas?', generatorius: 'kainu-palyginimas', lygis: 2 },
          { pavadinimas: 'Kaip apskaičiuoti bendrą pirkinio kainą?', generatorius: 'bendra-pirkinio-kaina', lygis: 2 },
          { pavadinimas: 'Kaip apskaičiuoti kainos pokytį?', generatorius: 'kainos-pokytis', lygis: 2 },
          { pavadinimas: 'Kas yra pajamos ir išlaidos?', generatorius: 'pajamos-ir-islaidos', lygis: 2 },
          { pavadinimas: 'Kaip apskaičiuoti, kiek pinigų liko?', generatorius: 'kiek-pinigu-liko', lygis: 2 },
          { pavadinimas: 'Kaip suplanuoti paprastą taupymą?', generatorius: 'taupymo-planas', lygis: 2 },
          { pavadinimas: 'Kaip įvertinti, ar pirkinio kaina yra priimtina?', generatorius: 'kainos-vertinimas', lygis: 2 },
          { pavadinimas: 'Kaip pasirinkti finansiškai naudingesnį sprendimą?', generatorius: 'naudingesnis-sprendimas', lygis: 2 },
          { pavadinimas: 'Kaip skaičiavimais pagrįsti finansinį pasirinkimą?', generatorius: 'pasirinkimo-pagrindimas', lygis: 2 },
        ],
        generatorius: 'pinigai',
        lygis: 2,
      },
      {
        numeris: 9,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Konstravimas ir transformacijos',
        potemes: [
          { pavadinimas: 'Kaip nusakyti langelio vietą raidės ir skaičiaus pora?', generatorius: 'langelio-vieta-raide', lygis: 2 },
          { pavadinimas: 'Kaip nusakyti objekto vietą dviejų skaičių pora?', generatorius: 'vieta-skaiciu-pora', lygis: 2 },
          { pavadinimas: 'Kaip rasti objektą pagal nurodytą vietą tinklelyje?', generatorius: 'objektas-pagal-vieta', lygis: 2 },
          { pavadinimas: 'Kaip apibūdinti objekto judėjimą tinklelyje?', generatorius: 'judejimas-tinklelyje', lygis: 2 },
          { pavadinimas: 'Kaip judėti šiaurės, pietų, rytų ir vakarų kryptimis?', generatorius: 'pasaulio-kryptys', lygis: 2 },
          { pavadinimas: 'Kaip pagal komandų seką perkelti objektą?', generatorius: 'komandu-seka', lygis: 2 },
          { pavadinimas: 'Kaip apibūdinti languotame popieriuje pavaizduotą ornamentą?', generatorius: 'ornamento-apibudinimas', lygis: 2 },
          { pavadinimas: 'Kas yra objekto posūkis?', generatorius: 'kas-yra-posukis', lygis: 2 },
          { pavadinimas: 'Kaip atpažinti posūkį apie nurodytą tašką?', generatorius: 'posukis-apie-taska', lygis: 2 },
          { pavadinimas: 'Kaip atpažinti posūkio kryptį?', generatorius: 'posukio-kryptis', lygis: 2 },
          { pavadinimas: 'Kaip pavaizduoti posūkį stačiuoju kampu?', generatorius: 'posukis-staciuoju-kampu', lygis: 2 },
          { pavadinimas: 'Kaip sukurti ornamentą taikant postūmius ir posūkius?', generatorius: 'ornamento-kurimas', lygis: 2 },
        ],
        generatorius: 'koordinates',
        lygis: 1,
      },
      {
        numeris: 10,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Erdvės figūros ir tūris',
        potemes: [
          { pavadinimas: 'Kas yra tūris?', generatorius: 'kas-yra-turis', lygis: 2 },
          { pavadinimas: 'Kaip statinio tūrį apibūdinti kubelių skaičiumi?', generatorius: 'turis-kubeliais', lygis: 2 },
          { pavadinimas: 'Kas yra kubinis centimetras?', generatorius: 'kubinis-centimetras', lygis: 2 },
          { pavadinimas: 'Kas yra kubinis metras?', generatorius: 'kubinis-metras', lygis: 2 },
          { pavadinimas: 'Kaip pasirinkti tinkamą tūrio matavimo vienetą?', generatorius: 'turio-vieneto-parinkimas', lygis: 2 },
          { pavadinimas: 'Kaip apskaičiuoti statinį sudarančių kubelių skaičių?', generatorius: 'statinio-kubeliai', lygis: 2 },
          { pavadinimas: 'Kuo kubas panašus į stačiakampį gretasienį?', generatorius: 'kubas-ir-gretasienis', lygis: 2 },
          { pavadinimas: 'Kodėl kubas yra ypatingas stačiakampis gretasienis?', generatorius: 'kodel-kubas-ypatingas', lygis: 2 },
          { pavadinimas: 'Kaip atpažinti prizmę ir piramidę?', generatorius: 'prizme-ir-piramide-4', lygis: 2 },
          { pavadinimas: 'Kaip atpažinti ritinį ir kūgį?', generatorius: 'ritinys-ir-kugis', lygis: 2 },
          { pavadinimas: 'Kaip įvardyti erdvės figūros sienas, briaunas ir viršūnes?', generatorius: 'sienos-briaunos-virsunes', lygis: 2 },
          { pavadinimas: 'Kaip susieti erdvės figūrą su jos išklotine?', generatorius: 'figura-ir-isklotine', lygis: 2 },
          { pavadinimas: 'Kaip erdvės figūra atrodo iš viršaus?', generatorius: 'vaizdas-is-virsaus', lygis: 2 },
          { pavadinimas: 'Kaip erdvės figūra atrodo iš priekio arba iš šono?', generatorius: 'vaizdas-is-priekio', lygis: 2 },
          { pavadinimas: 'Kaip sukonstruoti erdvės figūrą pagal jos išklotinę?', generatorius: 'konstravimas-is-isklotines', lygis: 2 },
        ],
        generatorius: 'erdvines-figuros',
        lygis: 2,
      },
      {
        numeris: 11,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Duomenys ir statistinis tyrimas',
        potemes: [
          { pavadinimas: 'Kas yra statistinis klausimas?', generatorius: 'statistinis-klausimas', lygis: 2 },
          { pavadinimas: 'Kaip suplanuoti duomenų rinkimą?', generatorius: 'duomenu-rinkimo-planas', lygis: 2 },
          { pavadinimas: 'Kaip surinkti ir susisteminti duomenis?', generatorius: 'duomenu-sisteminimas', lygis: 2 },
          { pavadinimas: 'Kaip perskaityti linijinę diagramą?', generatorius: 'linijines-diagramos-skaitymas', lygis: 2 },
          { pavadinimas: 'Kaip nubraižyti linijinę diagramą?', generatorius: 'linijines-diagramos-braizymas', lygis: 2 },
          { pavadinimas: 'Kaip perskaityti skritulinę diagramą?', generatorius: 'skritulines-diagramos-skaitymas', lygis: 2 },
          { pavadinimas: 'Kaip sudaryti paprastą skritulinę diagramą?', generatorius: 'skritulines-diagramos-sudarymas', lygis: 2 },
          { pavadinimas: 'Kaip pagal diagramą atsakyti į klausimus?', generatorius: 'atsakymai-pagal-diagrama', lygis: 2 },
          { pavadinimas: 'Kaip pasirinkti tinkamą duomenų pateikimo būdą?', generatorius: 'pateikimo-budo-pasirinkimas', lygis: 2 },
          { pavadinimas: 'Kaip pristatyti statistinio tyrimo rezultatus?', generatorius: 'tyrimo-pristatymas', lygis: 2 },
          { pavadinimas: 'Kaip suformuluoti tyrimo išvadą?', generatorius: 'tyrimo-isvada', lygis: 2 },
          { pavadinimas: 'Kaip įvertinti, ar tyrimo išvada pagrįsta surinktais duomenimis?', generatorius: 'isvados-pagristumas', lygis: 2 },
        ],
        generatorius: 'diagramos',
        lygis: 2,
      },
      {
        numeris: 12,
        sritis: { min: 0, max: 1000 },
        pavadinimas: 'Tikimybė',
        potemes: [
          { pavadinimas: 'Kas yra bandymas ir jo baigtis?', generatorius: 'bandymas-ir-baigtis', lygis: 2 },
          { pavadinimas: 'Kaip išvardyti visas galimas bandymo baigtis?', generatorius: 'visos-baigtys', lygis: 2 },
          { pavadinimas: 'Kuri baigtis labiau tikėtina?', generatorius: 'labiau-tiketina', lygis: 2 },
          { pavadinimas: 'Kuri baigtis mažiau tikėtina?', generatorius: 'maziau-tiketina', lygis: 2 },
          { pavadinimas: 'Kada baigtys yra vienodai tikėtinos?', generatorius: 'vienodai-tiketinos', lygis: 2 },
          { pavadinimas: 'Kaip atlikti bandymą su moneta?', generatorius: 'bandymas-su-moneta', lygis: 2 },
          { pavadinimas: 'Kaip atlikti bandymą su kauliuku?', generatorius: 'bandymas-su-kauliuku', lygis: 2 },
          { pavadinimas: 'Kaip atlikti bandymą su suktuku?', generatorius: 'bandymas-su-suktuku', lygis: 2 },
          { pavadinimas: 'Kaip užrašyti bandymo rezultatus?', generatorius: 'bandymo-rezultatai', lygis: 2 },
          { pavadinimas: 'Kaip palyginti spėjimą su eksperimento rezultatais?', generatorius: 'spejimas-ir-eksperimentas', lygis: 2 },
          { pavadinimas: 'Kaip tikimybę užrašyti skaičiumi nuo 0 iki 1?', generatorius: 'tikimybe-skaiciumi', lygis: 2 },
          { pavadinimas: 'Kaip sukurti sąžiningą tikimybinį žaidimą?', generatorius: 'sazingas-zaidimas', lygis: 2 },
        ],
        generatorius: 'tikimybe',
        lygis: 1,
      },
      {
        numeris: 13,
        sritis: { min: 0, max: 10000 },
        pavadinimas: 'Dėsningumai, algoritmai ir programavimas',
        potemes: [
          { pavadinimas: 'Kaip pratęsti seką iš trupmenų?', generatorius: 'trupmenu-seka', lygis: 2 },
          { pavadinimas: 'Kaip pratęsti seką iš dešimtainių skaičių?', generatorius: 'desimtainiu-seka-4', lygis: 2 },
          { pavadinimas: 'Kaip apibūdinti didėjančių arba mažėjančių objektų seką?', generatorius: 'objektu-augimo-seka', lygis: 2 },
          { pavadinimas: 'Kaip sukurti seką pagal nurodytą taisyklę?', generatorius: 'sekos-kurimas', lygis: 2 },
          { pavadinimas: 'Kas yra kartojimo komanda?', generatorius: 'kartojimo-komanda', lygis: 2 },
          { pavadinimas: 'Kaip vykdyti komandų seką su kartojimo komanda?', generatorius: 'komandos-su-kartojimu', lygis: 2 },
          { pavadinimas: 'Kaip vienoje programoje taikyti pasirinkimo ir kartojimo komandas?', generatorius: 'pasirinkimas-ir-kartojimas', lygis: 2 },
          { pavadinimas: 'Kaip didelę užduotį suskaidyti į mažesnes dalis?', generatorius: 'uzduoties-skaidymas', lygis: 2 },
          { pavadinimas: 'Kaip sudaryti užduoties sprendimo algoritmą?', generatorius: 'algoritmo-sudarymas', lygis: 2 },
          { pavadinimas: 'Kaip patikrinti algoritmo teisingumą?', generatorius: 'algoritmo-teisingumas', lygis: 2 },
          { pavadinimas: 'Kaip rasti ir ištaisyti algoritmo klaidą?', generatorius: 'algoritmo-klaida', lygis: 2 },
          { pavadinimas: 'Kaip sukurti skirtingus algoritmus tam pačiam rezultatui pasiekti?', generatorius: 'skirtingi-algoritmai', lygis: 2 },
        ],
        generatorius: 'algoritmai',
        lygis: 2,
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
          { pavadinimas: 'Skaičius ir skaitmuo', generatorius: 'skaicius-ir-skaitmuo', lygis: 1 },
          { pavadinimas: 'Skaičiaus skaitmenų skyrių lentelė', generatorius: 'skyriu-lentele-5', lygis: 1 },
          { pavadinimas: 'Skaitmens reikšmė', generatorius: 'skaitmens-reiksme', lygis: 1 },
          { pavadinimas: 'Rašome natūraliuosius skaičius', generatorius: 'rasome-skaicius', lygis: 2 },
          { pavadinimas: 'Skaičių tiesė', generatorius: 'skaiciu-tiese-5', lygis: 2 },
          { pavadinimas: 'Palyginame natūraliuosius skaičius', generatorius: 'palyginame-skaicius-5', lygis: 2 },
          { pavadinimas: 'Apvaliname iki dešimčių', generatorius: 'apvaliname-iki-desimciu', lygis: 2 },
          { pavadinimas: 'Apvaliname iki nurodyto skyriaus', generatorius: 'apvaliname-iki-skyriaus', lygis: 2 },
          { pavadinimas: 'Romėniškieji skaitmenys', generatorius: 'romeniskieji-skaitmenys', lygis: 2 },
          { pavadinimas: 'Rašome skaičius romėniškaisiais skaitmenimis', generatorius: 'rasome-romeniskai', lygis: 2 },
        ],
        generatorius: 'skaitmenys',
        lygis: 2,
      },
      {
        numeris: 2,
        pavadinimas: 'Veiksmai su natūraliaisiais skaičiais',
        potemes: [
          { pavadinimas: 'Skaičių sudėtis. Sudėties perstatomumo dėsnis', generatorius: 'sudeties-perstatomumas', lygis: 2 },
          { pavadinimas: 'Sudėties jungiamumo dėsnis', generatorius: 'sudeties-jungiamumas', lygis: 2 },
          { pavadinimas: 'Skaičių atimtis', generatorius: 'skaiciu-atimtis-5', lygis: 2 },
          { pavadinimas: 'Atimties dėsniai', generatorius: 'atimties-desniai', lygis: 2 },
          { pavadinimas: 'Skaičių daugyba. Daugybos perstatomumo dėsnis', generatorius: 'daugybos-perstatomumas', lygis: 2 },
          { pavadinimas: 'Daugybos jungiamumo dėsnis', generatorius: 'daugybos-jungiamumas', lygis: 2 },
          { pavadinimas: 'Daugybos skirstomumo dėsnis', generatorius: 'daugybos-skirstomumas', lygis: 2 },
          { pavadinimas: 'Skaičių dalyba. Dalyba kampu', generatorius: 'dalyba-kampu-5', lygis: 2 },
          { pavadinimas: 'Dalybos dėsniai. Pagrindinė dalmens savybė', generatorius: 'dalybos-desniai', lygis: 2 },
          { pavadinimas: 'Sumos (skirtumo) dalijimas iš natūraliojo skaičiaus', generatorius: 'sumos-dalijimas', lygis: 2 },
          { pavadinimas: 'Kelio formulė', generatorius: 'kelio-formule', lygis: 2 },
          { pavadinimas: 'Judėjimas iš tos pačios vietos', generatorius: 'judejimas-is-tos-pacios', lygis: 2 },
          { pavadinimas: 'Judėjimas iš skirtingų vietų', generatorius: 'judejimas-is-skirtingu', lygis: 2 },
        ],
        generatorius: 'sveikieji',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Dalumas',
        potemes: [
          { pavadinimas: 'Dalijame iš 10 ir iš 100', generatorius: 'dalumas-is-10-ir-100', lygis: 1 },
          { pavadinimas: 'Dalijame iš 5 ir iš 2', generatorius: 'dalumas-is-5-ir-2', lygis: 1 },
          { pavadinimas: 'Dalijame iš 9 ir iš 3', generatorius: 'dalumas-is-9-ir-3', lygis: 1 },
          { pavadinimas: 'Dalijame iš 4', generatorius: 'dalumas-is-4', lygis: 1 },
          { pavadinimas: 'Skaičiaus dalikliai', generatorius: 'skaiciaus-dalikliai', lygis: 2 },
          { pavadinimas: 'Pirminiai ir sudėtiniai skaičiai', generatorius: 'pirminiai-ir-sudetiniai', lygis: 2 },
          { pavadinimas: 'Skaidome pirminiais dauginamaisiais', generatorius: 'skaidymas-pirminiais', lygis: 2 },
          { pavadinimas: 'Didžiausiasis bendrasis daliklis', generatorius: 'didziausiasis-bendrasis-daliklis', lygis: 2 },
          { pavadinimas: 'Skaičiaus kartotiniai', generatorius: 'skaiciaus-kartotiniai', lygis: 2 },
          { pavadinimas: 'Mažiausiasis bendrasis kartotinis', generatorius: 'maziausiasis-bendrasis-kartotinis', lygis: 2 },
        ],
        generatorius: 'dalumo-pozymiai',
        lygis: 2,
      },
      {
        numeris: 4,
        pavadinimas: 'Trupmeniniai skaičiai',
        potemes: [
          { pavadinimas: 'Taisyklingosios ir netaisyklingosios paprastosios trupmenos', generatorius: 'taisyklingos-trupmenos', lygis: 2 },
          { pavadinimas: 'Netaisyklingoji trupmena ir mišrusis skaičius', generatorius: 'netaisyklinga-ir-misrus', lygis: 2 },
          { pavadinimas: 'Pagrindinė paprastosios trupmenos savybė', generatorius: 'pagrindine-trupmenos-savybe', lygis: 2 },
          { pavadinimas: 'Dešimtainiai skaičiai', generatorius: 'desimtainiai-skaiciai-5', lygis: 2 },
          { pavadinimas: 'Lygūs dešimtainiai skaičiai', generatorius: 'lygus-desimtainiai', lygis: 2 },
          { pavadinimas: 'Paprastoji trupmena ir dešimtainis skaičius', generatorius: 'trupmena-ir-desimtainis-5', lygis: 2 },
          { pavadinimas: 'Procentai', generatorius: 'procentai-5', lygis: 2 },
          { pavadinimas: 'Paprastosios trupmenos, dešimtainiai skaičiai ir procentai', generatorius: 'trupmenos-desimtainiai-procentai', lygis: 2 },
          { pavadinimas: 'Skaičiaus dalies radimas', generatorius: 'skaiciaus-dalies-radimas', lygis: 2 },
          { pavadinimas: 'Skaičiaus radimas, kai žinoma jo dalis', generatorius: 'skaiciaus-radimas-is-dalies', lygis: 2 },
          { pavadinimas: 'Finansiniai skaičiavimai: pirkimas, pardavimas ir nuolaidos', generatorius: 'finansiniai-skaiciavimai-5', lygis: 2 },
        ],
        generatorius: 'trupmenu-sudetis',
        lygis: 2,
      },
      {
        numeris: 5,
        pavadinimas: 'Veiksmai su paprastosiomis trupmenomis ir mišriaisiais skaičiais',
        potemes: [
          { pavadinimas: 'Palyginame', generatorius: 'trupmenu-palyginimas-vienodi', lygis: 2 },
          { pavadinimas: 'Sudedame paprastąsias trupmenas', generatorius: 'trupmenu-sudetis-vienodi', lygis: 2 },
          { pavadinimas: 'Sudedame mišriuosius skaičius', generatorius: 'misriuju-sudetis-5', lygis: 2 },
          { pavadinimas: 'Atimame paprastąją trupmeną', generatorius: 'trupmenu-atimtis-vienodi', lygis: 2 },
          { pavadinimas: 'Natūraliųjų ir mišriųjų skaičių atimtis', generatorius: 'naturaliuju-ir-misriuju-atimtis', lygis: 2 },
          { pavadinimas: 'Mišriųjų skaičių atimtis', generatorius: 'misriuju-atimtis-5', lygis: 2 },
          { pavadinimas: 'Bendravardikliname', generatorius: 'bendravardiklinimas-5', lygis: 1 },
          { pavadinimas: 'Palyginame', generatorius: 'trupmenu-palyginimas-skirtingi', lygis: 2 },
          { pavadinimas: 'Sudedame', generatorius: 'trupmenu-sudetis-skirtingi', lygis: 2 },
          { pavadinimas: 'Atimame', generatorius: 'trupmenu-atimtis-skirtingi', lygis: 2 },
          { pavadinimas: 'Paprastosios trupmenos ir natūraliojo skaičiaus daugyba', generatorius: 'trupmenos-daugyba-is-naturaliojo', lygis: 2 },
          { pavadinimas: 'Mišriojo ir natūraliojo skaičių daugyba', generatorius: 'misriojo-daugyba-is-naturaliojo', lygis: 2 },
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 2,
      },
      {
        numeris: 6,
        pavadinimas: 'Veiksmai su dešimtainiais skaičiais',
        potemes: [
          { pavadinimas: 'Palyginame', generatorius: 'desimtainiu-palyginimas', lygis: 2 },
          { pavadinimas: 'Apvaliname iki vienetų', generatorius: 'desimtainiu-apvalinimas-vienetais', lygis: 2 },
          { pavadinimas: 'Apvaliname iki nurodyto skyriaus', generatorius: 'desimtainiu-apvalinimas-skyriumi', lygis: 2 },
          { pavadinimas: 'Sudedame', generatorius: 'desimtainiu-sudetis', lygis: 2 },
          { pavadinimas: 'Atimame', generatorius: 'desimtainiu-atimtis', lygis: 2 },
          { pavadinimas: 'Dešimtainio ir natūraliojo skaičių daugyba', generatorius: 'desimtainio-daugyba', lygis: 2 },
          { pavadinimas: 'Dauginame iš 10, 100, 1000, ...', generatorius: 'daugyba-is-10-100-1000', lygis: 2 },
        ],
        generatorius: 'apvalinimas',
        lygis: 2,
      },
      {
        numeris: 7,
        pavadinimas: 'Reiškiniai. Lygtys',
        potemes: [
          { pavadinimas: 'Skaitinis reiškinys ir jo reikšmė', generatorius: 'skaitinis-reiskinys', lygis: 2 },
          { pavadinimas: 'Raidinis reiškinys', generatorius: 'raidinis-reiskinys', lygis: 2 },
          { pavadinimas: 'Raidinio reiškinio reikšmės', generatorius: 'raidinio-reiskinio-reiksmes', lygis: 2 },
          { pavadinimas: 'Dauginame ir dalijame iš skaičiaus', generatorius: 'skliaustu-atskleidimas', lygis: 2 },
          { pavadinimas: 'Panašieji nariai, jų sutraukimas', generatorius: 'panasieji-nariai', lygis: 2 },
          { pavadinimas: 'Skaitinių lygybių savybės', generatorius: 'lygybiu-savybes', lygis: 1 },
          { pavadinimas: 'Lygtis ir jos sprendinys', generatorius: 'lygtis-ir-sprendinys', lygis: 2 },
          { pavadinimas: 'Lygties sprendimas', generatorius: 'lygties-sprendimas-5', lygis: 2 },
          { pavadinimas: 'Tekstinių uždavinių sprendimas sudarant lygtis', generatorius: 'tekstiniai-su-lygtimis-5', lygis: 2 },
          { pavadinimas: 'Skaičių sekos ir įvesties–išvesties lentelės', generatorius: 'skaiciu-sekos-lenteles', lygis: 2 },
        ],
        generatorius: 'raidiniai-reiskiniai',
        lygis: 2,
      },
      {
        numeris: 8,
        pavadinimas: 'Kampai',
        potemes: [
          { pavadinimas: 'Kampas ir jo elementai', generatorius: 'kampas-ir-elementai', lygis: 2 },
          { pavadinimas: 'Kuris kampas didesnis?', generatorius: 'kuris-kampas-didesnis', lygis: 2 },
          { pavadinimas: 'Ištiestinis ir statusis kampai', generatorius: 'istiestinis-ir-statusis', lygis: 2 },
          { pavadinimas: 'Smailusis ir bukasis kampai', generatorius: 'smailusis-ir-bukasis', lygis: 2 },
          { pavadinimas: 'Pilnasis ir priešpilnis kampai', generatorius: 'pilnasis-ir-priespilnis', lygis: 2 },
          { pavadinimas: 'Laipsnis', generatorius: 'laipsnis', lygis: 2 },
          { pavadinimas: 'Kampų palyginimas', generatorius: 'kampu-palyginimas', lygis: 2 },
          { pavadinimas: 'Ištiestinio, stačiojo ir smailiojo kampų dydžiai', generatorius: 'kampu-dydziai-smailus', lygis: 2 },
          { pavadinimas: 'Bukojo, pilnojo ir priešpilnio kampų dydžiai', generatorius: 'kampu-dydziai-buki', lygis: 2 },
          { pavadinimas: 'Matlankis. Matuojame kampus', generatorius: 'matlankis-matuojame', lygis: 2 },
          { pavadinimas: 'Braižome kampą. Kampo pusiaukampinė', generatorius: 'braizome-pusiaukampine', lygis: 1 },
          { pavadinimas: 'Gretutiniai kampai', generatorius: 'gretutiniai-kampai', lygis: 2 },
          { pavadinimas: 'Kryžminiai kampai', generatorius: 'kryzminiai-kampai', lygis: 2 },
        ],
        generatorius: 'kampai',
        lygis: 2,
      },
      {
        numeris: 9,
        pavadinimas: 'Trikampiai ir keturkampiai',
        potemes: [
          { pavadinimas: 'Daugiakampis', generatorius: 'daugiakampis-5', lygis: 2 },
          { pavadinimas: 'Trikampio kampai', generatorius: 'trikampio-kampai', lygis: 2 },
          { pavadinimas: 'Daugiakampio kampai', generatorius: 'daugiakampio-kampai', lygis: 2 },
          { pavadinimas: 'Ilgio matavimo vienetai', generatorius: 'ilgio-vienetai-5', lygis: 2 },
          { pavadinimas: 'Trikampio perimetras', generatorius: 'trikampio-perimetras', lygis: 2 },
          { pavadinimas: 'Keturkampio perimetras', generatorius: 'keturkampio-perimetras', lygis: 2 },
          { pavadinimas: 'Ploto matavimo vienetai', generatorius: 'ploto-vienetai-5', lygis: 2 },
          { pavadinimas: 'Stačiakampio ir kvadrato plotai', generatorius: 'staciakampio-plotas-5', lygis: 2 },
          { pavadinimas: 'Stačiojo trikampio plotas', generatorius: 'staciojo-trikampio-plotas', lygis: 2 },
        ],
        generatorius: 'plotas-turis',
        lygis: 2,
      },
      {
        numeris: 10,
        pavadinimas: 'Simetrija. Posūkis. Postūmis',
        potemes: [
          { pavadinimas: 'Tiesės atžvilgiu simetriškos figūros', generatorius: 'simetriskos-tieses-atzvilgiu', lygis: 2 },
          { pavadinimas: 'Figūros, turinčios simetrijos ašį', generatorius: 'simetrijos-asis-5', lygis: 2 },
          { pavadinimas: 'Posūkis apie tašką', generatorius: 'posukis-apie-taska-5', lygis: 2 },
          { pavadinimas: 'Taško atžvilgiu simetriškos figūros', generatorius: 'simetriskos-tasko-atzvilgiu', lygis: 2 },
          { pavadinimas: 'Figūros, turinčios simetrijos centrą', generatorius: 'simetrijos-centras', lygis: 2 },
          { pavadinimas: 'Lygiagretusis postūmis', generatorius: 'lygiagretusis-postumis', lygis: 2 },
          { pavadinimas: 'Lygiagretainis, rombas, trapecija', generatorius: 'lygiagretainis-rombas-trapecija', lygis: 2 },
        ],
        generatorius: 'simetrija',
        lygis: 2,
      },
      {
        numeris: 11,
        pavadinimas: 'Erdviniai kūnai',
        potemes: [
          { pavadinimas: 'Vaizduojame', generatorius: 'erdviniu-kunu-vaizdavimas', lygis: 1 },
          { pavadinimas: 'Matmenys. Išklotinė', generatorius: 'matmenys-ir-isklotine', lygis: 2 },
          { pavadinimas: 'Stačiakampio gretasienio paviršiaus plotas', generatorius: 'gretasienio-pavirsiaus-plotas', lygis: 2 },
          { pavadinimas: 'Kubo paviršiaus plotas', generatorius: 'kubo-pavirsiaus-plotas', lygis: 2 },
          { pavadinimas: 'Tūris', generatorius: 'turis-5', lygis: 2 },
          { pavadinimas: 'Stačiakampio gretasienio tūris', generatorius: 'gretasienio-turis', lygis: 2 },
          { pavadinimas: 'Kubo tūris', generatorius: 'kubo-turis', lygis: 2 },
          { pavadinimas: 'Talpa', generatorius: 'talpa-5', lygis: 2 },
        ],
        generatorius: 'plotas-turis',
        lygis: 2,
      },
      {
        numeris: 12,
        pavadinimas: 'Duomenys ir tikimybės',
        potemes: [
          { pavadinimas: 'Kokybiniai ir kiekybiniai duomenys', generatorius: 'kokybiniai-ir-kiekybiniai', lygis: 2 },
          { pavadinimas: 'Imtis, imties vidurkis', generatorius: 'imtis-ir-vidurkis', lygis: 2 },
          { pavadinimas: 'Bandymas ir jo baigtys', generatorius: 'bandymas-ir-baigtys', lygis: 2 },
          { pavadinimas: 'Įvykio tikimybė', generatorius: 'ivykio-tikimybe', lygis: 2 },
        ],
        generatorius: 'vidurkis',
        lygis: 2,
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
          { pavadinimas: 'Skaičiai skaičių tiesėje', generatorius: 'skaiciai-tieseje-6', lygis: 2 },
          { pavadinimas: 'Vienas kitam priešingieji skaičiai', generatorius: 'priesingieji-skaiciai', lygis: 2 },
          { pavadinimas: 'Skaičių palyginimas', generatorius: 'sveikuju-palyginimas-6', lygis: 2 },
          { pavadinimas: 'Natūralieji, sveikieji, racionalieji skaičiai', generatorius: 'skaiciu-aibes', lygis: 2 },
          { pavadinimas: 'Koordinačių plokštuma', generatorius: 'koordinaciu-plokstuma-6', lygis: 2 },
        ],
        generatorius: 'koordinates',
        lygis: 2,
      },
      {
        numeris: 2,
        pavadinimas: 'Racionaliųjų skaičių sudėtis ir atimtis',
        potemes: [
          { pavadinimas: 'Sudedame skaičius su vienodais ženklais', generatorius: 'sudetis-vienodi-zenklai', lygis: 2 },
          { pavadinimas: 'Sudedame skaičius su skirtingais ženklais', generatorius: 'sudetis-skirtingi-zenklai', lygis: 2 },
          { pavadinimas: 'Atimame', generatorius: 'racionaliuju-atimtis', lygis: 2 },
          { pavadinimas: 'Algebrinė suma', generatorius: 'algebrine-suma', lygis: 2 },
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Neneigiamųjų paprastųjų trupmenų daugyba ir dalyba',
        potemes: [
          { pavadinimas: 'Paprastosios trupmenos ir natūraliojo skaičiaus daugyba', generatorius: 'trupmenos-daugyba-6', lygis: 2 },
          { pavadinimas: 'Dauginame paprastąsias trupmenas', generatorius: 'trupmenu-daugyba-6', lygis: 2 },
          { pavadinimas: 'Paprastąją trupmeną dalijame iš natūraliojo skaičiaus', generatorius: 'trupmenos-dalyba-is-naturaliojo', lygis: 2 },
          { pavadinimas: 'Dalijame iš paprastosios trupmenos', generatorius: 'dalyba-is-trupmenos', lygis: 2 },
        ],
        generatorius: 'trupmenu-daugyba',
        lygis: 2,
      },
      {
        numeris: 4,
        pavadinimas: 'Neneigiamųjų dešimtainių skaičių daugyba ir dalyba',
        potemes: [
          { pavadinimas: 'Dešimtainį skaičių dauginame iš natūraliojo', generatorius: 'desimtainio-daugyba-6', lygis: 2 },
          { pavadinimas: 'Dauginame dešimtainius skaičius', generatorius: 'desimtainiu-daugyba', lygis: 2 },
          { pavadinimas: 'Dešimtainį skaičių dalijame iš natūraliojo', generatorius: 'desimtainio-dalyba', lygis: 2 },
          { pavadinimas: 'Periodinės trupmenos', generatorius: 'periodines-trupmenos', lygis: 2 },
          { pavadinimas: 'Dalijame dešimtainius skaičius', generatorius: 'desimtainiu-dalyba', lygis: 2 },
        ],
        generatorius: 'desimtaines',
        lygis: 2,
      },
      {
        numeris: 5,
        pavadinimas: 'Teigiamųjų ir neigiamųjų skaičių daugyba ir dalyba',
        potemes: [
          { pavadinimas: 'Dauginame', generatorius: 'neigiamu-daugyba', lygis: 2 },
          { pavadinimas: 'Dalijame', generatorius: 'neigiamu-dalyba', lygis: 2 },
          { pavadinimas: 'Dauginame ir dalijame', generatorius: 'neigiamu-daugyba-dalyba', lygis: 2 },
          { pavadinimas: 'Taikome skirstomumo dėsnį', generatorius: 'skirstomumo-desnis-6', lygis: 2 },
          { pavadinimas: 'Skaičiuojame skaitinių reiškinių reikšmes', generatorius: 'reiskiniu-reiksmes-6', lygis: 2 },
        ],
        generatorius: 'sveikieji',
        lygis: 2,
      },
      {
        numeris: 6,
        pavadinimas: 'Procentai. Proporcija',
        potemes: [
          { pavadinimas: 'Trupmenos, dešimtainiai skaičiai, procentai', generatorius: 'trupmenos-desimtainiai-procentai-6', lygis: 2 },
          { pavadinimas: 'Ieškome skaičiaus dalies', generatorius: 'skaiciaus-dalis-6', lygis: 2 },
          { pavadinimas: 'Ieškome viso skaičiaus', generatorius: 'visas-skaicius-6', lygis: 2 },
          { pavadinimas: 'Pagrindinė proporcijos savybė', generatorius: 'proporcijos-savybe', lygis: 2 },
          { pavadinimas: 'Procentų uždavinių sprendimas sudarant proporciją', generatorius: 'procentai-proporcija', lygis: 2 },
          { pavadinimas: 'Dalijimas proporcingai', generatorius: 'dalijimas-proporcingai', lygis: 2 },
          { pavadinimas: 'Finansiniai skaičiavimai: nuolaidos, vieneto tarifai, biudžetas ir mokesčiai', generatorius: 'finansai-6', lygis: 2 },
        ],
        generatorius: 'procentai',
        lygis: 2,
      },
      {
        numeris: 7,
        pavadinimas: 'Tiesioginis proporcingumas',
        potemes: [
          { pavadinimas: 'Formulės, lentelės', generatorius: 'formules-lenteles', lygis: 2 },
          { pavadinimas: 'Grafikai', generatorius: 'grafikai-6', lygis: 2 },
          { pavadinimas: 'Tiesiogiai proporcingi dydžiai', generatorius: 'tiesiogiai-proporcingi', lygis: 2 },
          { pavadinimas: 'Tiesiogiai proporcingų dydžių priklausomybės grafikas', generatorius: 'proporcingumo-grafikas-6', lygis: 2 },
        ],
        generatorius: 'proporcijos',
        lygis: 2,
      },
      {
        numeris: 8,
        pavadinimas: 'Reiškiniai. Lygtys',
        potemes: [
          { pavadinimas: 'Raidinio reiškinio koeficientas', generatorius: 'raidinio-koeficientas', lygis: 2 },
          { pavadinimas: 'Panašiųjų narių sutraukimas', generatorius: 'panasiuju-sutraukimas-6', lygis: 2 },
          { pavadinimas: 'Atskliautimas', generatorius: 'atskliautimas', lygis: 2 },
          { pavadinimas: 'Sprendžiame paprastas lygtis', generatorius: 'paprastos-lygtys-6', lygis: 2 },
          { pavadinimas: 'Sprendžiame sudėtingesnes lygtis', generatorius: 'sudetingesnes-lygtys', lygis: 2 },
          { pavadinimas: 'Sprendžiame lygtis su skliaustais', generatorius: 'lygtys-su-skliaustais', lygis: 2 },
          { pavadinimas: 'Tekstinių uždavinių sprendimas sudarant lygtis', generatorius: 'tekstiniai-lygtys-6', lygis: 2 },
        ],
        generatorius: 'raidiniai-reiskiniai',
        lygis: 2,
      },
      {
        numeris: 9,
        pavadinimas: 'Lygios plokštumos figūros',
        potemes: [
          { pavadinimas: 'Lygios plokštumos figūros', generatorius: 'lygios-figuros-6', lygis: 2 },
          { pavadinimas: 'Trikampio kraštinės ir kampai', generatorius: 'trikampio-krastines-kampai', lygis: 2 },
          { pavadinimas: 'Trikampių lygumo požymis pagal dvi kraštines ir kampą tarp jų', generatorius: 'lygumas-dvi-krastines-kampas', lygis: 2 },
          { pavadinimas: 'Trikampių lygumo požymis pagal kraštinę ir du kampus prie jos', generatorius: 'lygumas-krastine-du-kampai', lygis: 2 },
          { pavadinimas: 'Trikampių lygumo požymis pagal tris kraštines', generatorius: 'lygumas-trys-krastines', lygis: 2 },
          { pavadinimas: 'Braižome kampą, lygų duotam kampui', generatorius: 'braizome-lygu-kampa', lygis: 2 },
          { pavadinimas: 'Braižome trikampį, lygų duotam trikampiui', generatorius: 'braizome-lygu-trikampi', lygis: 2 },
          { pavadinimas: 'Trikampio nelygybė', generatorius: 'trikampio-nelygybe', lygis: 2 },
        ],
        generatorius: 'figuros',
        lygis: 2,
      },
      {
        numeris: 10,
        pavadinimas: 'Panašiosios plokštumos figūros',
        potemes: [
          { pavadinimas: 'Didiname ir mažiname', generatorius: 'didiname-mazinime', lygis: 2 },
          { pavadinimas: 'Mastelis', generatorius: 'mastelis-6', lygis: 2 },
          { pavadinimas: 'Panašiosios plokštumos figūros', generatorius: 'panasiosios-figuros', lygis: 2 },
          { pavadinimas: 'Trikampių panašumo požymiai', generatorius: 'trikampiu-panasumas', lygis: 2 },
          { pavadinimas: 'Figūrų didinimas, mažinimas ir figūrų sekos', generatorius: 'figuru-sekos-6', lygis: 2 },
          { pavadinimas: 'Metrinė matavimo sistema ir vienetų keitimas', generatorius: 'metrine-sistema', lygis: 2 },
        ],
        generatorius: 'trigonometrija',
        lygis: 2,
      },
      {
        numeris: 11,
        pavadinimas: 'Duomenys',
        potemes: [
          { pavadinimas: 'Dažnių lentelė', generatorius: 'daznu-lentele', lygis: 2 },
          { pavadinimas: 'Stulpelinė diagrama', generatorius: 'stulpeline-diagrama-6', lygis: 2 },
          { pavadinimas: 'Linijinė diagrama', generatorius: 'linijine-diagrama-6', lygis: 2 },
          { pavadinimas: 'Imties vidurkis', generatorius: 'imties-vidurkis-6', lygis: 2 },
          { pavadinimas: 'Imties mediana', generatorius: 'imties-mediana', lygis: 2 },
          { pavadinimas: 'Imties moda', generatorius: 'imties-moda', lygis: 2 },
        ],
        generatorius: 'diagramos',
        lygis: 2,
      },
      {
        numeris: 12,
        pavadinimas: 'Tikimybės',
        potemes: [
          { pavadinimas: 'Galimybių medis', generatorius: 'galimybiu-medis', lygis: 2 },
          { pavadinimas: 'Galimybių lentelė', generatorius: 'galimybiu-lentele', lygis: 2 },
          { pavadinimas: 'Daugybos taisyklė', generatorius: 'daugybos-taisykle', lygis: 2 },
          { pavadinimas: 'Įvykis', generatorius: 'ivykis-6', lygis: 2 },
          { pavadinimas: 'Įvykio tikimybė', generatorius: 'ivykio-tikimybe-6', lygis: 2 },
          { pavadinimas: 'Įvykiui priešingas įvykis ir jo tikimybė', generatorius: 'priesingas-ivykis', lygis: 2 },
        ],
        generatorius: 'kombinatorika',
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
        potemes: [
          { pavadinimas: 'Teisingi ir klaidingi teiginiai', generatorius: 'teisingi-klaidingi-teiginiai' },
          { pavadinimas: 'Aksioma, apibrėžimas, teorema', generatorius: 'aksioma-apibrezimas-teorema' },
          { pavadinimas: 'Įrodymas', generatorius: 'irodymas' },
        ],
      },
      {
        numeris: 2,
        pavadinimas: 'Laipsniai',
        potemes: [
          { pavadinimas: 'Keliame kvadratu ir kubu', generatorius: 'kvadratu-ir-kubu', lygis: 2 },
          { pavadinimas: 'Laipsnis su natūraliuoju rodikliu', generatorius: 'laipsnis-naturalusis-rodiklis', lygis: 2 },
          { pavadinimas: 'Dauginame ir dalijame laipsnius su vienodais pagrindais', generatorius: 'laipsniai-vienodi-pagrindai', lygis: 2 },
          { pavadinimas: 'Dauginame ir dalijame laipsnius su vienodais rodikliais', generatorius: 'laipsniai-vienodi-rodikliai', lygis: 2 },
          { pavadinimas: 'Laipsnį keliame laipsniu', generatorius: 'laipsni-keliame-laipsniu', lygis: 2 },
          { pavadinimas: 'Laipsnis su sveikuoju neigiamuoju rodikliu', generatorius: 'neigiamas-rodiklis', lygis: 2 },
          { pavadinimas: 'Laipsnio su sveikuoju neigiamuoju rodikliu savybės', generatorius: 'neigiamo-rodiklio-savybes', lygis: 2 },
          { pavadinimas: 'Standartinė skaičiaus išraiška', generatorius: 'standartine-israiska', lygis: 2 },
        ],
        generatorius: 'laipsniai',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Procentai',
        potemes: [
          { pavadinimas: 'Ieškome, kiek procentų pakito dydis', generatorius: 'kiek-procentu-pakito', lygis: 2 },
          { pavadinimas: 'Ieškome dydžio, kai žinoma jo pradinė vertė ir pokytis procentais', generatorius: 'dydis-po-pokycio', lygis: 2 },
          { pavadinimas: 'Paprastosios palūkanos', generatorius: 'paprastosios-palukanos', lygis: 2 },
          { pavadinimas: 'Sudėtinės palūkanos', generatorius: 'sudetines-palukanos', lygis: 2 },
          { pavadinimas: 'Sudėtiniai procentai', generatorius: 'sudetiniai-procentai', lygis: 2 },
          { pavadinimas: 'Biudžetas, finansiniai tikslai ir paskolų pasiūlymų palyginimas', generatorius: 'biudzetas-ir-paskolos', lygis: 2 },
        ],
        generatorius: 'procentai',
        lygis: 2,
      },
      {
        numeris: 4,
        pavadinimas: 'Nelygybės',
        potemes: [
          { pavadinimas: 'Skaičių palyginimas', generatorius: 'skaiciu-palyginimas-7', lygis: 2 },
          { pavadinimas: 'Skaičių intervalai', generatorius: 'skaiciu-intervalai', lygis: 2 },
          { pavadinimas: 'Prie (iš) abiejų nelygybės pusių pridedame (atimame) tą patį skaičių', generatorius: 'nelygybe-pridedame', lygis: 2 },
          { pavadinimas: 'Abi nelygybės puses dauginame (dalijame) iš to paties skaičiaus', generatorius: 'nelygybe-dauginame', lygis: 2 },
          { pavadinimas: 'Nelygybės sprendinys', generatorius: 'nelygybes-sprendinys', lygis: 2 },
          { pavadinimas: 'Sprendžiame vieno žingsnio nelygybes', generatorius: 'vieno-zingsnio-nelygybes', lygis: 2 },
          { pavadinimas: 'Sprendžiame paprastas nelygybes', generatorius: 'paprastos-nelygybes', lygis: 2 },
          { pavadinimas: 'Sprendžiame sudėtingesnes nelygybes', generatorius: 'sudetingesnes-nelygybes', lygis: 2 },
          { pavadinimas: 'Dviejų nelygybių su vienu nežinomuoju sistema', generatorius: 'nelygybiu-sistema', lygis: 2 },
          { pavadinimas: 'Dvigubųjų nelygybių sprendimas', generatorius: 'dvigubos-nelygybes', lygis: 2 },
          { pavadinimas: 'Sprendžiame tekstinius uždavinius', generatorius: 'nelygybiu-tekstiniai', lygis: 2 },
        ],
        generatorius: 'nelygybes',
        lygis: 2,
      },
      {
        numeris: 5,
        pavadinimas: 'Atvirkštinis proporcingumas',
        potemes: [
          { pavadinimas: 'Tarpusavyje susiję dydžiai', generatorius: 'susije-dydziai', lygis: 2 },
          { pavadinimas: 'Atvirkščiai proporcingi dydžiai', generatorius: 'atvirksciai-proporcingi', lygis: 2 },
          { pavadinimas: 'Atvirkščiai proporcingų dydžių priklausomybės grafikas', generatorius: 'atvirkstinio-grafikas', lygis: 2 },
          { pavadinimas: 'Tekstinių uždavinių sprendimas', generatorius: 'atvirkstinio-tekstiniai', lygis: 2 },
        ],
        generatorius: 'proporcijos',
        lygis: 2,
      },
      {
        numeris: 6,
        pavadinimas: 'Tiesės',
        potemes: [
          { pavadinimas: 'Taškas ir tiesė', generatorius: 'taskas-ir-tiese', lygis: 2 },
          { pavadinimas: 'Susikertančiosios tiesės', generatorius: 'susikertancios-tieses', lygis: 2 },
          { pavadinimas: 'Lygiagrečiosios tiesės', generatorius: 'lygiagrecios-tieses', lygis: 2 },
          { pavadinimas: 'Dviejų tiesių lygiagretumo požymiai', generatorius: 'lygiagretumo-pozymiai', lygis: 2 },
          { pavadinimas: 'Kampų, susidariusių dvi lygiagrečiąsias tieses perkirtus kirstine, savybės', generatorius: 'kampai-su-kirstine', lygis: 2 },
          { pavadinimas: 'Konstravimas ir transformacijos koordinačių plokštumoje', generatorius: 'konstravimas-plokstumoje', lygis: 2 },
        ],
        generatorius: 'trigonometrija',
        lygis: 2,
      },
      {
        numeris: 7,
        pavadinimas: 'Trikampiai ir keturkampiai',
        potemes: [
          { pavadinimas: 'Trikampių rūšys', generatorius: 'trikampiu-rusys', lygis: 2 },
          { pavadinimas: 'Trikampio aukštinės', generatorius: 'trikampio-aukstines', lygis: 2 },
          { pavadinimas: 'Trikampio pusiaukraštinės', generatorius: 'trikampio-pusiaukrastines', lygis: 2 },
          { pavadinimas: 'Trikampio pusiaukampinės', generatorius: 'trikampio-pusiaukampines', lygis: 2 },
          { pavadinimas: 'Lygiagretainis', generatorius: 'lygiagretainis-7', lygis: 2 },
          { pavadinimas: 'Stačiakampis', generatorius: 'staciakampis-7', lygis: 2 },
          { pavadinimas: 'Rombas', generatorius: 'rombas-7', lygis: 2 },
          { pavadinimas: 'Kvadratas', generatorius: 'kvadratas-7', lygis: 2 },
          { pavadinimas: 'Trapecija', generatorius: 'trapecija-7', lygis: 2 },
          { pavadinimas: 'Lygiašonė ir stačioji trapecijos', generatorius: 'trapeciju-rusys', lygis: 2 },
          { pavadinimas: 'Daugiakampiai koordinačių plokštumoje', generatorius: 'daugiakampiai-plokstumoje', lygis: 2 },
        ],
        generatorius: 'figuros',
        lygis: 2,
      },
      {
        numeris: 8,
        pavadinimas: 'Trikampių ir keturkampių plotai',
        potemes: [
          { pavadinimas: 'Stačiakampio, kvadrato ir stačiojo trikampio plotų formulės', generatorius: 'pagrindiniu-figuru-plotai', lygis: 2 },
          { pavadinimas: 'Trikampio ploto formulė', generatorius: 'trikampio-plotas-7', lygis: 2 },
          { pavadinimas: 'Lygiagretainio ploto formulė', generatorius: 'lygiagretainio-plotas', lygis: 2 },
          { pavadinimas: 'Rombo ploto formulė', generatorius: 'rombo-plotas', lygis: 2 },
          { pavadinimas: 'Trapecijos ploto formulė', generatorius: 'trapecijos-plotas', lygis: 2 },
        ],
        generatorius: 'plotas-turis',
        lygis: 2,
      },
      {
        numeris: 9,
        pavadinimas: 'Apskritimas ir skritulys',
        potemes: [
          { pavadinimas: 'Apskritimas', generatorius: 'apskritimas-7', lygis: 2 },
          { pavadinimas: 'Apskritimo ilgis', generatorius: 'apskritimo-ilgis', lygis: 2 },
          { pavadinimas: 'Apskritimo lankas ir jo ilgis', generatorius: 'apskritimo-lankas', lygis: 2 },
          { pavadinimas: 'Skritulys. Skritulio ir jo dalies plotai', generatorius: 'skritulio-plotas', lygis: 2 },
        ],
        generatorius: 'apskritimas',
        lygis: 2,
      },
      {
        numeris: 10,
        pavadinimas: 'Stačioji prizmė ir taisyklingoji piramidė',
        potemes: [
          { pavadinimas: 'Tiesės ir plokštumos erdvėje', generatorius: 'tieses-ir-plokstumos', lygis: 2 },
          { pavadinimas: 'Stačioji prizmė', generatorius: 'stacioji-prizme', lygis: 2 },
          { pavadinimas: 'Stačiosios prizmės tūris', generatorius: 'prizmes-turis', lygis: 2 },
          { pavadinimas: 'Piramidė', generatorius: 'piramide-7', lygis: 2 },
          { pavadinimas: 'Taisyklingoji piramidė ir jos tūris', generatorius: 'piramides-turis', lygis: 2 },
        ],
        generatorius: 'plotas-turis',
        lygis: 2,
      },
      {
        numeris: 11,
        pavadinimas: 'Ritinys ir kūgis',
        potemes: [
          { pavadinimas: 'Ritinys', generatorius: 'ritinys-7', lygis: 2 },
          { pavadinimas: 'Ritinio paviršiaus plotas ir tūris', generatorius: 'ritinio-plotas-turis', lygis: 2 },
          { pavadinimas: 'Kūgis', generatorius: 'kugis-7', lygis: 2 },
          { pavadinimas: 'Kūgio paviršiaus plotas ir tūris', generatorius: 'kugio-plotas-turis', lygis: 2 },
        ],
        generatorius: 'apskritimas',
        lygis: 2,
      },
      {
        numeris: 12,
        pavadinimas: 'Duomenys',
        potemes: [
          { pavadinimas: 'Statistinis tyrimas. Populiacija', generatorius: 'statistinis-tyrimas', lygis: 2 },
          { pavadinimas: 'Imtis. Paprastoji atsitiktinė imtis', generatorius: 'imtis-atsitiktine', lygis: 2 },
          { pavadinimas: 'Sisteminė, sluoksninė, lizdinė atsitiktinės imtys', generatorius: 'imciu-rusys', lygis: 2 },
          { pavadinimas: 'Statistinis kintamasis', generatorius: 'statistinis-kintamasis', lygis: 2 },
          { pavadinimas: 'Duomenų pateikimas skrituline diagrama', generatorius: 'skritulines-diagramos', lygis: 2 },
        ],
        generatorius: 'vidurkis',
        lygis: 2,
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
          { pavadinimas: 'Kvadratinė šaknis', generatorius: 'kvadratine-saknis', lygis: 2 },
          { pavadinimas: 'Kubinė šaknis', generatorius: 'kubine-saknis', lygis: 2 },
          { pavadinimas: 'Iracionalieji skaičiai', generatorius: 'iracionalieji-skaiciai', lygis: 2 },
          { pavadinimas: 'Palyginame', generatorius: 'saknu-palyginimas', lygis: 2 },
          { pavadinimas: 'Sudedame ir atimame', generatorius: 'saknu-sudetis', lygis: 2 },
          { pavadinimas: 'Šaknis iš sandaugos', generatorius: 'saknis-is-sandaugos', lygis: 2 },
          { pavadinimas: 'Šaknis iš trupmenos', generatorius: 'saknis-is-trupmenos', lygis: 2 },
          { pavadinimas: 'Iškeliame prieš šaknies ženklą, įkeliame į pošaknį', generatorius: 'iskeliame-ikeliame', lygis: 2 },
          { pavadinimas: 'Skaitinių reiškinių su šaknimis pertvarkiai', generatorius: 'skaitiniai-su-saknimis', lygis: 2 },
          { pavadinimas: 'Raidinių reiškinių su šaknimis pertvarkiai', generatorius: 'raidiniai-su-saknimis', lygis: 2 },
        ],
        generatorius: 'saknu-ivertinimas',
        lygis: 2,
      },
      {
        numeris: 2,
        pavadinimas: 'Skaičių aibės',
        potemes: [
          { pavadinimas: 'Skaičių aibės', generatorius: 'skaiciu-aibes-8', lygis: 2 },
          { pavadinimas: 'Skaičių aibės poaibis', generatorius: 'aibes-poaibis', lygis: 2 },
          { pavadinimas: 'Realieji skaičiai', generatorius: 'realieji-skaiciai', lygis: 2 },
          { pavadinimas: 'Veiksmai su realiaisiais skaičiais', generatorius: 'veiksmai-su-realiaisiais', lygis: 2 },
        ],
        generatorius: 'saknu-ivertinimas',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Finansiniai skaičiavimai',
        potemes: [
          { pavadinimas: 'Valiutų kursai', generatorius: 'valiutu-kursai', lygis: 2 },
          { pavadinimas: 'Paprastosios ir sudėtinės palūkanos', generatorius: 'palukanu-rusys', lygis: 2 },
          { pavadinimas: 'Paprastosios palūkanos ir grafikai', generatorius: 'palukanos-ir-grafikai', lygis: 2 },
          { pavadinimas: 'Pirkimas išsimokėtinai', generatorius: 'pirkimas-issimoketinai', lygis: 2 },
          { pavadinimas: 'Mažėjančiosios palūkanos', generatorius: 'mazejancios-palukanos', lygis: 2 },
        ],
        generatorius: 'palukanos',
        lygis: 2,
      },
      {
        numeris: 4,
        pavadinimas: 'Reiškiniai',
        potemes: [
          { pavadinimas: 'Vienanaris ir daugianaris', generatorius: 'vienanaris-daugianaris', lygis: 2 },
          { pavadinimas: 'Atskliautimas', generatorius: 'atskliautimas-8', lygis: 2 },
          { pavadinimas: 'Daugianarių daugyba', generatorius: 'daugianariu-daugyba', lygis: 2 },
          { pavadinimas: 'Dvinario kėlimas kvadratu', generatorius: 'dvinario-kvadratas', lygis: 2 },
          { pavadinimas: 'Dviejų narių sumos dauginimas iš tų narių skirtumo', generatorius: 'sumos-ir-skirtumo-sandauga', lygis: 2 },
          { pavadinimas: 'Bendrojo dauginamojo iškėlimas prieš skliaustus', generatorius: 'bendrojo-daugiklio-iskelimas', lygis: 2 },
          { pavadinimas: 'Skaidymas dauginamaisiais grupavimo būdu', generatorius: 'skaidymas-grupavimu', lygis: 2 },
          { pavadinimas: 'Skaidymas dauginamaisiais taikant greitosios daugybos formules', generatorius: 'skaidymas-formulemis', lygis: 2 },
          { pavadinimas: 'Dvinario kvadrato išskyrimas', generatorius: 'dvinario-kvadrato-isskyrimas', lygis: 2 },
        ],
        generatorius: 'greitosios-formules',
        lygis: 2,
      },
      {
        numeris: 5,
        pavadinimas: 'Tiesinių lygčių sistemos',
        potemes: [
          { pavadinimas: 'Tiesinė lygtis su dviem nežinomaisiais', generatorius: 'tiesine-lygtis-dviem', lygis: 2 },
          { pavadinimas: 'Tiesinės lygties su dviem nežinomaisiais grafikas', generatorius: 'tiesines-lygties-grafikas', lygis: 2 },
          { pavadinimas: 'Tiesinių lygčių su dviem nežinomaisiais sistema', generatorius: 'lygciu-sistema-8', lygis: 2 },
          { pavadinimas: 'Tiesinių lygčių sistemos sprendinių skaičius', generatorius: 'sistemos-sprendiniu-skaicius', lygis: 2 },
          { pavadinimas: 'Sprendžiame tiesinių lygčių sistemas keitimo būdu', generatorius: 'sistemos-keitimo-budu', lygis: 2 },
          { pavadinimas: 'Sprendžiame tiesinių lygčių sistemas sulyginimo būdu', generatorius: 'sistemos-sulyginimo-budu', lygis: 2 },
          { pavadinimas: 'Sprendžiame tiesinių lygčių sistemas sudėties būdu', generatorius: 'sistemos-sudeties-budu', lygis: 2 },
          { pavadinimas: 'Judėjimo uždaviniai', generatorius: 'sistemu-judejimo-uzdaviniai', lygis: 2 },
          { pavadinimas: 'Įvairūs tekstiniai uždaviniai', generatorius: 'sistemu-tekstiniai', lygis: 2 },
          { pavadinimas: 'Tiesinis sąryšis: lentelė, formulė ir grafikas', generatorius: 'tiesinis-sarysis', lygis: 2 },
        ],
        generatorius: 'lygciu-sistemos',
        lygis: 2,
      },
      {
        numeris: 6,
        pavadinimas: 'Vektoriai',
        potemes: [
          { pavadinimas: 'Vektoriaus sąvoka', generatorius: 'vektoriaus-savoka', lygis: 2 },
          { pavadinimas: 'Vektorių lygumas', generatorius: 'vektoriu-lygumas', lygis: 2 },
          { pavadinimas: 'Vektorių sudėtis', generatorius: 'vektoriu-sudetis', lygis: 2 },
          { pavadinimas: 'Vektorių atimtis', generatorius: 'vektoriu-atimtis', lygis: 2 },
          { pavadinimas: 'Vektoriaus daugyba iš skaičiaus', generatorius: 'vektoriaus-daugyba', lygis: 2 },
        ],
        generatorius: 'vektoriai',
        lygis: 2,
      },
      {
        numeris: 7,
        pavadinimas: 'Plokštumos figūros',
        potemes: [
          { pavadinimas: 'Pitagoro teorema', generatorius: 'pitagoro-teorema', lygis: 2 },
          { pavadinimas: 'Atvirkštinė Pitagoro teorema', generatorius: 'atvirkstine-pitagoro', lygis: 2 },
          { pavadinimas: 'Atstumas tarp dviejų koordinačių plokštumos taškų', generatorius: 'atstumas-tarp-tasku', lygis: 2 },
          { pavadinimas: 'Stačiojo trikampio statinis, esantis prieš 30° kampą', generatorius: 'statinis-pries-30', lygis: 2 },
          { pavadinimas: 'Lygiašonis ir lygiakraštis trikampiai', generatorius: 'lygiasonis-lygiakrastis', lygis: 2 },
          { pavadinimas: 'Trikampio vidurio linija', generatorius: 'trikampio-vidurio-linija', lygis: 2 },
          { pavadinimas: 'Trapecijos vidurio linija', generatorius: 'trapecijos-vidurio-linija', lygis: 2 },
        ],
        generatorius: 'figuros',
        lygis: 2,
      },
      {
        numeris: 8,
        pavadinimas: 'Erdviniai kūnai',
        potemes: [
          { pavadinimas: 'Stačioji prizmė', generatorius: 'stacioji-prizme-8', lygis: 2 },
          { pavadinimas: 'Taisyklingoji piramidė', generatorius: 'taisyklingoji-piramide-8', lygis: 2 },
          { pavadinimas: 'Ritinys', generatorius: 'ritinys-8', lygis: 2 },
          { pavadinimas: 'Kūgis', generatorius: 'kugis-8', lygis: 2 },
          { pavadinimas: 'Rutulys ir sfera', generatorius: 'rutulys-ir-sfera', lygis: 2 },
          { pavadinimas: 'Objekto vaizdai iš viršaus, priekio ir šono bei mastelis', generatorius: 'objekto-vaizdai-mastelis', lygis: 2 },
        ],
        generatorius: 'erdvines-figuros',
        lygis: 2,
      },
      {
        numeris: 9,
        pavadinimas: 'Duomenys',
        potemes: [
          { pavadinimas: 'Empirinis skirstinys', generatorius: 'empirinis-skirstinys', lygis: 2 },
          { pavadinimas: 'Sukauptasis ir sukauptasis santykinis dažniai', generatorius: 'sukauptieji-dazniai', lygis: 2 },
          { pavadinimas: 'Sugrupuotų duomenų stulpelinė diagrama', generatorius: 'sugrupuotu-diagrama', lygis: 2 },
          { pavadinimas: 'Histograma', generatorius: 'histograma-8', lygis: 2 },
          { pavadinimas: 'Imties skaitinės charakteristikos', generatorius: 'imties-charakteristikos', lygis: 2 },
          { pavadinimas: 'Kvartiliai', generatorius: 'kvartiliai', lygis: 2 },
          { pavadinimas: 'Stačiakampė diagrama su „ūsais“', generatorius: 'usu-diagrama', lygis: 2 },
        ],
        generatorius: 'diagramos',
        lygis: 2,
      },
      {
        numeris: 10,
        pavadinimas: 'Progimnazijos kurso kartojimo medžiaga',
        potemes: [
          { pavadinimas: 'Skaičių aibės', generatorius: 'kartojimas-aibes', lygis: 2 },
          { pavadinimas: 'Skaičių dalumas', generatorius: 'kartojimas-dalumas', lygis: 2 },
          { pavadinimas: 'Aritmetiniai veiksmai su skaičiais', generatorius: 'kartojimas-veiksmai', lygis: 2 },
          { pavadinimas: 'Paprastosios trupmenos', generatorius: 'kartojimas-trupmenos', lygis: 2 },
          { pavadinimas: 'Proporcingumas', generatorius: 'kartojimas-proporcingumas', lygis: 2 },
          { pavadinimas: 'Procentai', generatorius: 'kartojimas-procentai', lygis: 2 },
          { pavadinimas: 'Laipsniai. Šaknys', generatorius: 'kartojimas-laipsniai', lygis: 2 },
          { pavadinimas: 'Raidininiai reiškiniai', generatorius: 'kartojimas-raidiniai', lygis: 2 },
          { pavadinimas: 'Lygtys, lygčių sistemos', generatorius: 'kartojimas-lygtys', lygis: 2 },
          { pavadinimas: 'Nelygybės, nelygybių sistemos', generatorius: 'kartojimas-nelygybes', lygis: 2 },
          { pavadinimas: 'Kampai', generatorius: 'kartojimas-kampai', lygis: 2 },
          { pavadinimas: 'Trikampiai', generatorius: 'kartojimas-trikampiai', lygis: 2 },
          { pavadinimas: 'Keturkampiai. Daugiakampiai', generatorius: 'kartojimas-keturkampiai', lygis: 2 },
          { pavadinimas: 'Apskritimas. Skritulys', generatorius: 'kartojimas-apskritimas', lygis: 2 },
          { pavadinimas: 'Vektoriai', generatorius: 'kartojimas-vektoriai', lygis: 2 },
          { pavadinimas: 'Simetrija. Posūkis. Postūmis', generatorius: 'kartojimas-simetrija', lygis: 2 },
          { pavadinimas: 'Erdviniai kūnai', generatorius: 'kartojimas-kunai', lygis: 2 },
          { pavadinimas: 'Rinkinių skaičius. Statistika', generatorius: 'kartojimas-statistika', lygis: 2 },
          { pavadinimas: 'Tikimybės', generatorius: 'kartojimas-tikimybes', lygis: 2 },
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
          { pavadinimas: 'Tarpusavyje susiję dydžiai', generatorius: 'susije-dydziai-9', lygis: 2 },
          { pavadinimas: 'Funkcija ir jos grafikas', generatorius: 'funkcija-ir-grafikas', lygis: 2 },
          { pavadinimas: 'Funkcijos savybės', generatorius: 'funkcijos-savybes', lygis: 2 },
          { pavadinimas: 'Skaičių seka', generatorius: 'skaiciu-seka', lygis: 2 },
          { pavadinimas: 'Skaičių sekos, išreikštos rekurentiškai', generatorius: 'rekurentines-sekos', lygis: 2 },
          { pavadinimas: 'Funkcijos apibrėžimo ir reikšmių sritys', generatorius: 'apibrezimo-sritis', lygis: 2 },
        ],
        generatorius: 'funkcijos',
        lygis: 2,
      },
      {
        numeris: 2,
        pavadinimas: 'Tiesinė funkcija',
        potemes: [
          { pavadinimas: 'Tiesioginio proporcingumo funkcija', generatorius: 'tiesioginis-proporcingumas', lygis: 2 },
          { pavadinimas: 'Tiesinė funkcija', generatorius: 'tiesine-funkcija-9', lygis: 2 },
          { pavadinimas: 'Tiesinės funkcijos savybės', generatorius: 'tiesines-funkcijos-savybes', lygis: 2 },
          { pavadinimas: 'Dviejų tiesių tarpusavio padėtis', generatorius: 'dvieju-tiesiu-padetis', lygis: 2 },
        ],
        generatorius: 'funkcijos',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Kvadratinė lygtis',
        potemes: [
          { pavadinimas: 'Kvadratinės lygties samprata', generatorius: 'kvadratines-lygties-samprata', lygis: 2 },
          { pavadinimas: 'Nepilnosios kvadratinės lygtys', generatorius: 'nepilnosios-kvadratines', lygis: 2 },
          { pavadinimas: 'Pilnoji kvadratinė lygtis', generatorius: 'pilnoji-kvadratine', lygis: 2 },
          { pavadinimas: 'Kvadratinės lygties sprendinių formulės', generatorius: 'sprendiniu-formules', lygis: 2 },
          { pavadinimas: 'Kvadratinio trinario skaidymas dauginamaisiais', generatorius: 'trinario-skaidymas', lygis: 2 },
          { pavadinimas: 'Vijeto teorema', generatorius: 'vijeto-teorema', lygis: 2 },
        ],
        generatorius: 'vijeto',
        lygis: 2,
      },
      {
        numeris: 4,
        pavadinimas: 'Kvadratinė funkcija',
        potemes: [
          { pavadinimas: 'Kvadratinės funkcijos samprata', generatorius: 'kvadratines-funkcijos-samprata', lygis: 2 },
          { pavadinimas: 'Grafiko transformacijos', generatorius: 'grafiko-transformacijos', lygis: 2 },
          { pavadinimas: 'Kvadratinės funkcijos grafikas ir savybės', generatorius: 'kvadratines-funkcijos-savybes', lygis: 2 },
        ],
        generatorius: 'kvadratines-lygtys',
        lygis: 2,
      },
      {
        numeris: 5,
        pavadinimas: 'Trupmeniniai racionalieji reiškiniai',
        potemes: [
          { pavadinimas: 'Trupmeninio racionaliojo reiškinio samprata', generatorius: 'trupmeninio-reiskinio-samprata', lygis: 2 },
          { pavadinimas: 'Trupmeninių racionaliųjų reiškinių daugyba, dalyba ir kėlimas laipsniu', generatorius: 'trupmenu-daugyba-dalyba', lygis: 2 },
          { pavadinimas: 'Trupmeninių racionaliųjų reiškinių sudėtis ir atimtis', generatorius: 'trupmenu-sudetis-atimtis', lygis: 2 },
          { pavadinimas: 'Sudėtingesnių uždavinių sprendimas', generatorius: 'trupmeniniai-sudetingesni', lygis: 2 },
        ],
        generatorius: 'sudetis-atimtis',
        lygis: 2,
      },
      {
        numeris: 6,
        pavadinimas: 'Lygčių sistemos',
        potemes: [
          { pavadinimas: 'Lygčių sistemų sprendimas algebriniais būdais', generatorius: 'sistemos-algebriskai', lygis: 2 },
          { pavadinimas: 'Lygčių sistemų sprendimas grafiniu būdu', generatorius: 'sistemos-grafiskai', lygis: 2 },
          { pavadinimas: 'Sudėtingesnių lygčių sistemų sprendimas', generatorius: 'sistemos-sudetingesnes', lygis: 2 },
        ],
        generatorius: 'lygciu-sistemos',
        lygis: 2,
      },
      {
        numeris: 7,
        pavadinimas: 'Įvadas į trigonometriją',
        potemes: [
          { pavadinimas: 'Smailiojo kampo sinusas, kosinusas ir tangentas', generatorius: 'sinusas-kosinusas-tangentas', lygis: 2 },
          { pavadinimas: 'Trigonometrinių santykių reikšmės', generatorius: 'trigonometrines-reiksmes', lygis: 2 },
          { pavadinimas: 'Skaičiuojame skaičiuotuvu', generatorius: 'skaiciuotuvas-trigonometrija', lygis: 2 },
          { pavadinimas: 'Trigonometrinės formulės', generatorius: 'trigonometrines-formules', lygis: 2 },
          { pavadinimas: 'Stačiųjų trikampių sprendimas', generatorius: 'staciuju-trikampiu-sprendimas', lygis: 2 },
        ],
        generatorius: 'trigonometrija',
        lygis: 2,
      },
      {
        numeris: 8,
        pavadinimas: 'Apskritimas ir skritulys',
        potemes: [
          { pavadinimas: 'Apskritimo liestinė ir kirstinė', generatorius: 'liestine-ir-kirstine', lygis: 2 },
          { pavadinimas: 'Apskritimo centrinis ir įbrėžtinis kampai', generatorius: 'centrinis-ir-ibreztinis', lygis: 2 },
          { pavadinimas: 'Apskritimo stygų savybės', generatorius: 'stygu-savybes', lygis: 2 },
          { pavadinimas: 'Skritulio išpjova ir nuopjova', generatorius: 'ispjova-ir-nuopjova', lygis: 2 },
          { pavadinimas: 'Kirstinių, liestinių, stygų proporcingos atkarpos ir sudaromi kampai', generatorius: 'proporcingos-atkarpos', lygis: 2 },
        ],
        generatorius: 'apskritimas',
        lygis: 2,
      },
      {
        numeris: 9,
        pavadinimas: 'Duomenys ir jų interpretavimas',
        potemes: [
          { pavadinimas: 'Sklaidos diagrama', generatorius: 'sklaidos-diagrama', lygis: 2 },
          { pavadinimas: 'Tiesinė koreliacija', generatorius: 'tiesine-koreliacija', lygis: 2 },
          { pavadinimas: 'Tiesė sklaidos diagramo', generatorius: 'tiese-sklaidos-diagramoje', lygis: 2 },
          { pavadinimas: 'Imties dydžio ir atsitiktinumo įtaka išvadoms', generatorius: 'imties-dydzio-itaka', lygis: 2 },
          { pavadinimas: 'Koreliacija nėra priežastinis ryšys', generatorius: 'koreliacija-ne-priezastis', lygis: 2 },
        ],
        generatorius: 'vidurkis',
        lygis: 2,
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
          { pavadinimas: 'Trupmeninės racionaliosios lygties samprata', generatorius: 'trupmenines-lygties-samprata', lygis: 2 },
          { pavadinimas: 'Lygčių sprendimas taikant trupmenos, lygios nuliui, savybę', generatorius: 'trupmena-lygi-nuliui', lygis: 2 },
          { pavadinimas: 'Kiti trupmeninių lygčių sprendimo būdai', generatorius: 'trupmeniniu-lygciu-budai', lygis: 2 },
          { pavadinimas: 'Judėjimo uždaviniai', generatorius: 'judejimo-uzdaviniai-10', lygis: 2 },
          { pavadinimas: 'Darbo uždaviniai', generatorius: 'darbo-uzdaviniai', lygis: 2 },
          { pavadinimas: 'Mišiniai', generatorius: 'misiniu-uzdaviniai', lygis: 2 },
        ],
        generatorius: 'tiesines-lygtys',
        lygis: 2,
      },
      {
        numeris: 2,
        pavadinimas: 'Trigonometrijos pagrindai',
        potemes: [
          { pavadinimas: 'Posūkio kampo sinusas, kosinusas ir tangentas', generatorius: 'posukio-kampas', lygis: 2 },
          { pavadinimas: 'Sinuso, kosinuso ir tangento reikšmės', generatorius: 'trigonometrines-reiksmes-10', lygis: 2 },
          { pavadinimas: 'Trikampio ploto skaičiavimo formulė', generatorius: 'trikampio-plotas-sinusu', lygis: 2 },
          { pavadinimas: 'Sinusų teorema', generatorius: 'sinusu-teorema', lygis: 2 },
          { pavadinimas: 'Kosinusų teorema', generatorius: 'kosinusu-teorema', lygis: 2 },
        ],
        generatorius: 'trigonometrija',
        lygis: 2,
      },
      {
        numeris: 3,
        pavadinimas: 'Lygčių su dviem nežinomaisiais sistemos',
        potemes: [
          { pavadinimas: 'Lygčių su dviem nežinomaisiais sistema ir jos sprendiniai', generatorius: 'sistemos-samprata', lygis: 2 },
          { pavadinimas: 'Atvirkštinio proporcingumo funkcija', generatorius: 'atvirkstinis-proporcingumas', lygis: 2 },
          { pavadinimas: 'Lygčių sistemų sprendimas grafiniu būdu', generatorius: 'sistemos-grafiskai-10', lygis: 2 },
          { pavadinimas: 'Lygčių sistemų sprendimas algebriniais būdais', generatorius: 'sistemos-algebriskai-10', lygis: 2 },
          { pavadinimas: 'Uždavinių sprendimas, sudarant lygčių sistemas', generatorius: 'sistemu-uzdaviniai', lygis: 2 },
          { pavadinimas: 'Lygčių sistemų sprendimas, įvedant keitinius', generatorius: 'sistemos-keitiniai', lygis: 2 },
        ],
        generatorius: 'lygciu-sistemos',
        lygis: 2,
      },
      {
        numeris: 4,
        pavadinimas: 'Nelygybės ir jų sistemos',
        potemes: [
          { pavadinimas: 'Kvadratinės nelygybės samprata', generatorius: 'kvadratines-nelygybes-samprata', lygis: 2 },
          { pavadinimas: 'Kvadratinės nelygybės sprendimas, remiantis parabolės savybėmis', generatorius: 'nelygybe-parabole', lygis: 2 },
          { pavadinimas: 'Kvadratinės nelygybės keitimas nelygybių sistemomis', generatorius: 'nelygybe-sistemomis', lygis: 2 },
          { pavadinimas: 'Kvadratinių nelygybių taikymas', generatorius: 'nelygybiu-taikymas', lygis: 2 },
          { pavadinimas: 'Nelygybių sistemos ir dvigubosios nelygybės', generatorius: 'nelygybiu-sistemos', lygis: 2 },
          { pavadinimas: 'Trupmeninių nelygybių sprendimas', generatorius: 'trupmenines-nelygybes', lygis: 2 },
        ],
        generatorius: 'nelygybes',
        lygis: 2,
      },
      {
        numeris: 5,
        pavadinimas: 'Dėsningumai, santykiai ir procentai',
        potemes: [
          { pavadinimas: 'Probleminės situacijos ir trūkstamos informacijos nustatymas', generatorius: 'trukstama-informacija', lygis: 2 },
          { pavadinimas: 'Proporcingoji dalyba į dvi nelygias dalis', generatorius: 'proporcinga-dalyba', lygis: 2 },
          { pavadinimas: 'Fibonačio skaičių seka', generatorius: 'fibonacio-seka', lygis: 2 },
          { pavadinimas: 'Aukso pjūvio skaičius ir aukso pjūvio seka', generatorius: 'aukso-pjuvis', lygis: 2 },
          { pavadinimas: 'Sudėtiniai procentai', generatorius: 'sudetiniai-procentai-10', lygis: 2 },
          { pavadinimas: 'Džiovinimo ir drėkinimo uždaviniai', generatorius: 'dziovinimo-uzdaviniai', lygis: 2 },
          { pavadinimas: 'Lydiniai, mišiniai, tirpalai ir koncentracija', generatorius: 'lydiniai-tirpalai', lygis: 2 },
        ],
        generatorius: 'rekurencios-sekos',
        lygis: 2,
      },
      {
        numeris: 6,
        pavadinimas: 'Plokštumos figūros',
        potemes: [
          { pavadinimas: 'Panašiųjų figūrų perimetrų ir plotų santykiai', generatorius: 'panasumo-santykiai', lygis: 2 },
          { pavadinimas: 'Trikampio pusiaukampinių savybės', generatorius: 'pusiaukampiniu-savybes', lygis: 2 },
          { pavadinimas: 'Trikampio pusiaukraštinių savybės', generatorius: 'pusiaukrastiniu-savybes', lygis: 2 },
          { pavadinimas: 'Į trikampį įbrėžtas apskritimas', generatorius: 'ibreztas-apskritimas', lygis: 2 },
          { pavadinimas: 'Apie trikampį apibrėžtas apskritimas', generatorius: 'apibreztas-apskritimas', lygis: 2 },
          { pavadinimas: 'Trikampio ploto formulės S = rp ir S = abc/(4R)', generatorius: 'ploto-formules-rp', lygis: 2 },
          { pavadinimas: 'Įbrėžtiniai ir apibrėžtiniai keturkampiai', generatorius: 'ibreztiniai-keturkampiai', lygis: 2 },
          { pavadinimas: 'Geometrinių teiginių įrodymas', generatorius: 'geometriniai-irodymai', lygis: 2 },
        ],
        generatorius: 'figuros',
        lygis: 2,
      },
      {
        numeris: 7,
        pavadinimas: 'Duomenys ir jų interpretavimas',
        potemes: [
          { pavadinimas: 'Populiacija, imtis ir pagrįstos išvados', generatorius: 'populiacija-ir-imtis', lygis: 2 },
          { pavadinimas: 'Duomenų kintamumas ir pasiskirstymas', generatorius: 'duomenu-kintamumas', lygis: 2 },
          { pavadinimas: 'Dispersija ir standartinis nuokrypis', generatorius: 'dispersija-nuokrypis', lygis: 2 },
          { pavadinimas: 'Normalusis, simetriškasis ir asimetriškasis skirstiniai', generatorius: 'skirstiniu-formos', lygis: 2 },
          { pavadinimas: 'Duomenų centro ir sklaidos charakteristikų interpretavimas', generatorius: 'centro-ir-sklaidos-interpretavimas', lygis: 2 },
          { pavadinimas: 'Statistinis patikimumas', generatorius: 'statistinis-patikimumas', lygis: 2 },
        ],
        generatorius: 'sklaida',
        lygis: 2,
      },
      {
        numeris: 8,
        pavadinimas: 'Rinkiniai, kombinatorika ir tikimybės',
        potemes: [
          { pavadinimas: 'Kelių elementų rinkiniai', generatorius: 'elementu-rinkiniai', lygis: 2 },
          { pavadinimas: 'Elementų tvarka rinkinyje', generatorius: 'elementu-tvarka', lygis: 2 },
          { pavadinimas: 'Rinkinių skaičiaus apskaičiavimas', generatorius: 'rinkiniu-skaicius', lygis: 2 },
          { pavadinimas: 'Kombinatorikos sudėties taisyklė', generatorius: 'sudeties-taisykle', lygis: 2 },
          { pavadinimas: 'Kombinatorikos daugybos taisyklė', generatorius: 'daugybos-taisykle-10', lygis: 2 },
          { pavadinimas: 'Teorinė ir eksperimentinė tikimybė', generatorius: 'teorine-eksperimentine', lygis: 2 },
          { pavadinimas: 'Ilgalaikis santykinis dažnis', generatorius: 'ilgalaikis-daznis', lygis: 2 },
        ],
        generatorius: 'kombinatorika',
        lygis: 2,
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
