/**
 * Programos temų mokomosios sritys.
 *
 * ŠIS FAILAS YRA DUOMENYS, NE LOGIKA — kaip ir `lib/programa.ts`.
 * Nerašyk čia funkcijų; diagnostikos logika gyvena `lib/diagnostika.ts`.
 *
 * Kam to reikia. Diagnostika ieško ne tos temos, dėl kurios paskambino tėvai,
 * o vietos, kurioje grandinė nutrūko. Kad būtų galima leistis žemyn, reikia
 * žinoti, kuri žemesnės klasės tema yra tos pačios giminės: septintos klasės
 * nelygybių prielaida yra šeštos klasės lygtys, o ne šeštos klasės tikimybės.
 * Sritis ir yra ta giminė.
 *
 * Raktas — „klasė.temos numeris“, toks pat, kokį rodo programa.
 *
 * Kaip pridėti temą:
 *   1. Įrašyk naują temą į `lib/programa.ts`.
 *   2. Čia įrašyk jos sritį. Auditas neleis pamiršti — jis tikrina, ar kiekviena
 *      programos tema turi sritį ir ar nėra likusių įrašų be temos.
 */

export type MokomojiSritis =
  | 'skaiciai'
  | 'algebra'
  | 'geometrija'
  | 'matai'
  | 'duomenys'
  | 'logika'

/** Srities pavadinimas tėvams — ataskaitoje rašomas paprastais žodžiais. */
export const SRITIES_PAVADINIMAS: Readonly<Record<MokomojiSritis, string>> = {
  skaiciai: 'Skaičiai ir skaičiavimai',
  algebra: 'Reiškiniai, lygtys ir funkcijos',
  geometrija: 'Geometrija',
  matai: 'Matai ir matavimai',
  duomenys: 'Duomenys ir tikimybė',
  logika: 'Dėsningumai ir algoritmai',
}

/**
 * Kiekvienos programos temos sritis.
 *
 * Projektinės („Tyrinėju reiškinį…“) temos priskirtos pagal tai, ko jose iš
 * tikrųjų mokomasi, o ne pagal pavadinimą: „Miškas“ yra matavimai, „Knyga“ —
 * duomenys, „Pinigai“ — matai.
 */
export const TEMU_SRITYS: Readonly<Record<string, MokomojiSritis>> = {
  // ── 1 klasė ──────────────────────────────────────────────────────────────
  '1.1': 'skaiciai',
  '1.2': 'skaiciai',
  '1.3': 'skaiciai',
  '1.4': 'matai',
  '1.5': 'skaiciai',
  '1.6': 'duomenys',
  '1.7': 'duomenys',
  '1.8': 'skaiciai',
  '1.9': 'matai',
  '1.10': 'matai',
  '1.11': 'logika',
  '1.12': 'skaiciai',

  // ── 2 klasė ──────────────────────────────────────────────────────────────
  '2.1': 'skaiciai',
  '2.2': 'skaiciai',
  '2.3': 'skaiciai',
  '2.4': 'geometrija',
  '2.5': 'matai',
  '2.6': 'matai',
  '2.7': 'skaiciai',
  '2.8': 'skaiciai',
  '2.9': 'matai',
  '2.10': 'matai',
  '2.11': 'matai',

  // ── 3 klasė ──────────────────────────────────────────────────────────────
  '3.1': 'skaiciai',
  '3.2': 'skaiciai',
  '3.3': 'geometrija',
  '3.4': 'geometrija',
  '3.5': 'matai',
  '3.6': 'matai',
  '3.7': 'skaiciai',
  '3.8': 'algebra',
  '3.9': 'skaiciai',
  '3.10': 'duomenys',
  '3.11': 'duomenys',

  // ── 4 klasė ──────────────────────────────────────────────────────────────
  '4.1': 'skaiciai',
  '4.2': 'skaiciai',
  '4.3': 'geometrija',
  '4.4': 'skaiciai',
  '4.5': 'algebra',
  '4.6': 'matai',
  '4.7': 'matai',
  '4.8': 'matai',
  '4.9': 'geometrija',
  '4.10': 'geometrija',
  '4.11': 'duomenys',
  '4.12': 'duomenys',
  '4.13': 'logika',

  // ── 5 klasė ──────────────────────────────────────────────────────────────
  '5.1': 'skaiciai',
  '5.2': 'skaiciai',
  '5.3': 'skaiciai',
  '5.4': 'skaiciai',
  '5.5': 'skaiciai',
  '5.6': 'skaiciai',
  '5.7': 'algebra',
  '5.8': 'geometrija',
  '5.9': 'geometrija',
  '5.10': 'geometrija',
  '5.11': 'geometrija',
  '5.12': 'duomenys',

  // ── 6 klasė ──────────────────────────────────────────────────────────────
  '6.1': 'skaiciai',
  '6.2': 'skaiciai',
  '6.3': 'skaiciai',
  '6.4': 'skaiciai',
  '6.5': 'skaiciai',
  '6.6': 'skaiciai',
  '6.7': 'algebra',
  '6.8': 'algebra',
  '6.9': 'geometrija',
  '6.10': 'geometrija',
  '6.11': 'duomenys',
  '6.12': 'duomenys',

  // ── 7 klasė ──────────────────────────────────────────────────────────────
  '7.1': 'logika',
  '7.2': 'skaiciai',
  '7.3': 'skaiciai',
  '7.4': 'algebra',
  '7.5': 'algebra',
  '7.6': 'geometrija',
  '7.7': 'geometrija',
  '7.8': 'geometrija',
  '7.9': 'geometrija',
  '7.10': 'geometrija',
  '7.11': 'geometrija',
  '7.12': 'duomenys',

  // ── 8 klasė ──────────────────────────────────────────────────────────────
  '8.1': 'skaiciai',
  '8.2': 'skaiciai',
  '8.3': 'matai',
  '8.4': 'algebra',
  '8.5': 'algebra',
  '8.6': 'geometrija',
  '8.7': 'geometrija',
  '8.8': 'geometrija',
  '8.9': 'duomenys',
  // Kartojimo tema apima visas sritis; leidžiantis žemyn ji laikoma skaičiais,
  // nes nuo jų prasideda ir pati potemių eilė.
  '8.10': 'skaiciai',

  // ── 9 klasė ──────────────────────────────────────────────────────────────
  '9.1': 'algebra',
  '9.2': 'algebra',
  '9.3': 'algebra',
  '9.4': 'algebra',
  '9.5': 'algebra',
  '9.6': 'algebra',
  '9.7': 'geometrija',
  '9.8': 'geometrija',
  '9.9': 'duomenys',

  // ── 10 klasė ─────────────────────────────────────────────────────────────
  '10.1': 'algebra',
  '10.2': 'geometrija',
  '10.3': 'algebra',
  '10.4': 'algebra',
  '10.5': 'skaiciai',
  '10.6': 'geometrija',
  '10.7': 'duomenys',
  '10.8': 'duomenys',
}

/**
 * Papildomos prielaidos, kertančios sritis.
 *
 * Pagal nutylėjimą tema remiasi į ankstesnę tos pačios srities temą, ir to
 * dažniausiai pakanka. Bet svarbiausi ryšiai matematikoje kaip tik kerta
 * sritis: lygtis su trupmenomis reikalauja mokėti veiksmus su trupmenomis, o
 * ne ankstesnę lygtį. Tokius ryšius surašom čia — jie pridedami prie
 * automatinės grandinės, o ne ją pakeičia.
 *
 * Raktas ir reikšmės — tie patys „klasė.temos numeris“ raktai.
 */
export const TEMU_PRIELAIDOS: Readonly<Record<string, readonly string[]>> = {
  // Lygtys remiasi į veiksmus su skaičiais, o ne tik į ankstesnes lygtis.
  '5.7': ['5.2'],
  '6.8': ['5.5', '6.2'],
  // Veiksmai su trupmenomis įmanomi tik mokant dalumą — bendrąjį vardiklį.
  '5.5': ['5.3'],
  // Algebros grandinės apačia: raidiniai reiškiniai remiasi į daugybą ir dalybą.
  // Be šio ryšio nusileidimas nuo lygčių sustotų trečioje klasėje.
  '3.8': ['2.7'],
  // Šaknys yra atvirkštinis laipsnių veiksmas.
  '8.1': ['7.2'],
  // Trupmeniniai reiškiniai remiasi į paprastųjų trupmenų daugybą ir dalybą.
  '9.5': ['6.3'],
  // Trupmeninė lygtis — tų pačių reiškinių tąsa.
  '10.1': ['9.5'],
  // Trigonometrijos pagrindai tęsia devintos klasės įvadą.
  '10.2': ['9.7'],
}
