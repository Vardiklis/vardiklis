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
  /**
   * Brėžinys — grynas SVG be išorinių bibliotekų. Spalvos rašomos
   * `var(--ink)`, `var(--orange)`, `var(--line)`, kad veiktų ir spausdinant.
   */
  brezinys?: string
}

export type Lygis = 1 | 2 | 3

/**
 * Generatorius gauna ne tik sunkumo lygį, bet ir klasę. Be klasės dešimtokas
 * gautų tokius pat skaičius kaip penktokas — lygis nusako uždavinio pavidalą,
 * o klasė — skaičių mastą.
 */
export type Generatorius = (lygis: Lygis, klase?: number) => Uzdavinys
