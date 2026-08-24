/**
 * Vienintelė kontaktų vieta. Pakeitus čia — pasikeičia visoje svetainėje.
 */
export const kontaktai = {
  vardas: 'Modesta',
  pareigos: 'matematikos korepetitorė',
  elPastas: 'korepetitore.modesta@gmail.com',
  telefonas: '+370 636 65873',
  telefonasNuoroda: '+37063665873',
  messenger: '',
  // TODO(Modesta): jei dirbama ir gyvai konkrečiame mieste — įrašyk jį čia,
  // tada jis atsiras poraštėje, „Apie" puslapyje ir struktūriniuose duomenyse.
  miestas: '',
  vietove: 'Pamokos vyksta nuotoliniu būdu',
} as const

export const svetaine = {
  pavadinimas: 'Vardiklis',
  prierasas: 'denominator (lot.) — tas, kuris įvardija',
  url: 'https://vardiklis.lt',
} as const

/**
 * Pamokų kainos. Laikom čia, kad keičiant jas nereikėtų medžioti po puslapius.
 * `eurai` — skaičius, ne tekstas: iš jo formuojam ir rodomą kainą, ir
 * struktūrinius duomenis, kur Google laukia gryno skaičiaus.
 */
export const kainos = [
  {
    id: 'individuali',
    pavadinimas: 'Individuali pamoka',
    eurai: 25,
    trukmeMin: 60,
    paaiskinimas: 'Vienas mokinys, visas dėmesys jam',
  },
  {
    id: 'grupine',
    pavadinimas: 'Grupinė pamoka',
    eurai: 20,
    trukmeMin: 60,
    paaiskinimas: 'Iki 3 mokinių grupėje, kaina vienam',
  },
] as const

/**
 * Nuolaida pirmajai pamokai, eurais. Naudojama ir juostelėje po navigacija,
 * ir „Susisiekti“ puslapio kainų bloke — kad akcijos dydis būtų vienoje vietoje
 * ir niekada nepradėtų skirtis dviejose vietose vienu metu.
 */
export const nuolaidaPirmajai = 5
