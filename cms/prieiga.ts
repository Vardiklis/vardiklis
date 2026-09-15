import type { Access } from 'payload'

/**
 * Kas yra „savas“ — CMS administratorius.
 *
 * KODĖL NE `Boolean(req.user)`. Payload'e prisijungusiu gali tapti bet kurios
 * kolekcijos su `auth` naudotojas, ne tik administratorius. Kol tokia buvo
 * viena („Naudotojai“), tai buvo tas pats. Atsiradus „Dienyno paskyroms“,
 * `Boolean(req.user)` reikštų „ir bet kuris vaikas“ — o čia guli tėvų el.
 * paštai, Meet nuorodos ir sąskaitos.
 *
 * Vaikai Payload'e prisijungę netampa ir dabar (žr. `cms/DienynoPaskyros.ts`),
 * tad ši patikra — antras užraktas, o ne vienintelis. Bet naujoje taisyklėje
 * rašyti reikia būtent jį.
 */
export const ADMINISTRATORIU_KOLEKCIJA = 'naudotojai'

export function arAdministratorius(naudotojas: unknown): boolean {
  return (naudotojas as { collection?: unknown } | null)?.collection === ADMINISTRATORIU_KOLEKCIJA
}

export const tikAdministratoriui: Access = ({ req }) => arAdministratorius(req.user)
