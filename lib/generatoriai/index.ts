import { dalumas } from './dalumas'
import { kvadratinesLygtys, tiesinesLygtys } from './lygtys'
import { laipsniai } from './laipsniai'
import { neigiami } from './neigiami'
import { procentai } from './procentai'
import { proporcijos } from './proporcijos'
import { sveikieji } from './sveikieji'
import { bendravardiklinimas, trupmenuDaugyba, trupmenuSudetis } from './trupmenos'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

export type { Generatorius, Lygis, Uzdavinys }

/**
 * Generatorių registras. Raktas — `Tema.generatorius` reikšmė iš `lib/temos.ts`.
 * Pridedant naują generatorių pakanka įrašyti jį čia ir nurodyti temoje.
 */
export const generatoriai: Record<string, Generatorius> = {
  sveikieji,
  dalumas,
  bendravardiklinimas,
  neigiami,
  'trupmenu-sudetis': trupmenuSudetis,
  'trupmenu-daugyba': trupmenuDaugyba,
  procentai,
  'tiesines-lygtys': tiesinesLygtys,
  proporcijos,
  laipsniai,
  'kvadratines-lygtys': kvadratinesLygtys,
}

/** Ar toks generatorius egzistuoja. */
export function arYraGeneratorius(vardas: string): boolean {
  return vardas in generatoriai
}

/** Vienas uždavinys iš nurodyto generatoriaus. */
export function generuok(vardas: string, lygis: Lygis): Uzdavinys {
  const g = generatoriai[vardas]
  if (!g) throw new Error(`Nežinomas generatorius: ${vardas}`)
  return g(lygis)
}

/**
 * Kelių uždavinių rinkinys iš to paties generatoriaus.
 * Vienodi uždaviniai atmetami — tas pats klausimas du kartus iš eilės atrodo
 * kaip klaida, net jei matematiškai viskas gerai.
 */
export function generuokRinkini(vardas: string, lygis: Lygis, kiek: number): Uzdavinys[] {
  const rinkinys: Uzdavinys[] = []
  const matyti = new Set<string>()
  let bandymai = 0

  while (rinkinys.length < kiek && bandymai < kiek * 20) {
    bandymai += 1
    const u = generuok(vardas, lygis)
    if (matyti.has(u.klausimas)) continue
    matyti.add(u.klausimas)
    rinkinys.push(u)
  }

  // Jei generatorius neturi tiek skirtingų variantų, papildom kartojimais.
  while (rinkinys.length < kiek) {
    rinkinys.push(generuok(vardas, lygis))
  }

  return rinkinys
}
