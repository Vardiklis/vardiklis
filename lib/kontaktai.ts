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
  vietove: 'Nuotoliu ir gyvai',
} as const

export const svetaine = {
  pavadinimas: 'Vardiklis',
  prierasas: 'denominator (lot.) — tas, kuris įvardija',
  url: 'https://vardiklis.lt',
} as const
