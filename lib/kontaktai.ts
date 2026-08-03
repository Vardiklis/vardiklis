/**
 * Vienintelė kontaktų vieta. Pakeitus čia — pasikeičia visoje svetainėje.
 *
 * TODO(Modesta): pakeisti placeholder'ius tikrais duomenimis prieš paleidimą.
 */
export const kontaktai = {
  vardas: 'Modesta',
  pareigos: 'matematikos korepetitorė',
  elPastas: 'modesta@vardiklis.lt', // placeholder
  telefonas: '+370 600 00000', // placeholder
  telefonasNuoroda: '+37060000000', // placeholder
  messenger: '', // placeholder — palikta tuščia, kol nėra tikros nuorodos
  miestas: 'Vilnius', // placeholder
} as const

export const svetaine = {
  pavadinimas: 'Vardiklis',
  prierasas: 'denominator (lot.) — tas, kuris įvardija',
  url: 'https://vardiklis.lt',
} as const
