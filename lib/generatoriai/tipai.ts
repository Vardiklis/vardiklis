/**
 * Uždavinių tipai. Atskirai nuo `index.ts`, kad generatoriai galėtų importuoti
 * tipą be ciklinės priklausomybės su registru.
 */

export type Uzdavinys = {
  id: string
  temaId: string
  /** Tekstas su matematika tarp `$...$`. */
  klausimas: string
  /** Normalizuotas, skirtas palyginimui — žr. `normalizuok`. */
  atsakymas: string
  /** Tas pats atsakymas rodymui, su KaTeX. */
  atsakymasRodymui: string
  /** Trumpas paaiškinimas, kodėl atsakymas toks. */
  sprendimas?: string
}

export type Lygis = 1 | 2 | 3

export type Generatorius = (lygis: Lygis) => Uzdavinys
