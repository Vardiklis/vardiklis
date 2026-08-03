/**
 * Prielaidų grafas.
 *
 * ŠIS FAILAS YRA DUOMENYS, NE LOGIKA. Jį redaguoja Modesta.
 * Nerašyk čia jokių funkcijų, sąlygų ar skaičiavimų — visa logika gyvena
 * `lib/diagnostika.ts`.
 *
 * Kaip pridėti temą:
 *   1. Įrašyk naują objektą į `temos` masyvą.
 *   2. `priklausoNuo` surašyk temų, kurias reikia mokėti PRIEŠ šią, `id`.
 *   3. `generatorius` turi sutapti su raktu iš `lib/generatoriai/index.ts`.
 *
 * `pavadinimas` matomas tėvams — rašyk paprastais žodžiais, be terminų.
 */

export type Tema = {
  id: string
  /** Rodomas tėvams, paprasta kalba. */
  pavadinimas: string
  klase: number
  /** Temų id, kurias reikia mokėti prieš šią. */
  priklausoNuo: string[]
  /** Raktas iš generatorių registro. */
  generatorius: string
}

export const temos: Tema[] = [
  {
    id: 'daugyba-dalyba',
    pavadinimas: 'Daugyba ir dalyba',
    klase: 3,
    priklausoNuo: [],
    generatorius: 'sveikieji',
  },
  {
    id: 'dalumas',
    pavadinimas: 'Dalumas, bendri dalikliai ir kartotiniai',
    klase: 5,
    priklausoNuo: ['daugyba-dalyba'],
    generatorius: 'dalumas',
  },
  {
    id: 'bendravardiklinimas',
    pavadinimas: 'Trupmenų suvedimas į bendrą vardiklį',
    klase: 5,
    priklausoNuo: ['dalumas'],
    generatorius: 'bendravardiklinimas',
  },
  {
    id: 'neigiami-skaiciai',
    pavadinimas: 'Neigiami skaičiai',
    klase: 6,
    priklausoNuo: [],
    generatorius: 'neigiami',
  },
  {
    id: 'trupmenu-sudetis',
    pavadinimas: 'Trupmenų sudėtis ir atimtis',
    klase: 6,
    priklausoNuo: ['bendravardiklinimas'],
    generatorius: 'trupmenu-sudetis',
  },
  {
    id: 'trupmenu-daugyba',
    pavadinimas: 'Trupmenų daugyba ir dalyba',
    klase: 6,
    priklausoNuo: ['daugyba-dalyba'],
    generatorius: 'trupmenu-daugyba',
  },
  {
    id: 'procentai',
    pavadinimas: 'Procentai',
    klase: 6,
    priklausoNuo: ['trupmenu-daugyba'],
    generatorius: 'procentai',
  },
  {
    id: 'tiesines-lygtys',
    pavadinimas: 'Tiesinės lygtys',
    klase: 7,
    priklausoNuo: ['neigiami-skaiciai', 'trupmenu-sudetis'],
    generatorius: 'tiesines-lygtys',
  },
  {
    id: 'proporcijos',
    pavadinimas: 'Proporcijos',
    klase: 7,
    priklausoNuo: ['procentai'],
    generatorius: 'proporcijos',
  },
  {
    id: 'laipsniai',
    pavadinimas: 'Laipsniai',
    klase: 8,
    priklausoNuo: ['daugyba-dalyba'],
    generatorius: 'laipsniai',
  },
  {
    id: 'kvadratines-lygtys',
    pavadinimas: 'Kvadratinės lygtys',
    klase: 9,
    priklausoNuo: ['tiesines-lygtys', 'laipsniai'],
    generatorius: 'kvadratines-lygtys',
  },
]
