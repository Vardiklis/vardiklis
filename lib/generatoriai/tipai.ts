/**
 * Uždavinių tipai. Atskirai nuo `index.ts`, kad generatoriai galėtų importuoti
 * tipą be ciklinės priklausomybės su registru.
 */

import type { Sritis } from './sritis'

export type { Sritis }

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

/**
 * Sunkumo lygis. Du lygiai, ne trys.
 *
 * Trečiasis lygis buvo panaikintas, o jo uždavinių pavidalai perkelti į
 * antrąjį — jie buvo patys įdomiausi (klaidos radimas, atvirkštinis veiksmas,
 * du susiję žingsniai), tad jų praradimas būtų nuskurdinęs rinkinius.
 * Sąsajoje jie vadinami „Vidutinis“ ir „Sunkesnis“.
 */
export type Lygis = 1 | 2

/**
 * Generatorius gauna sunkumo lygį, klasę ir skaičių sritį.
 *
 * Vaidmenų pasidalijimas griežtas:
 *   `lygis`  — uždavinio *pavidalas* (vienas veiksmas, atvirkštinis, tekstinis);
 *   `klase`  — skaičių *mastas* 5–10 klasėms (`mastas.ts`);
 *   `sritis` — *riba*, už kurios negali atsidurti nė vienas skaičius.
 *
 * Iki srities atsiradimo pavidalą ir ribą valdė tas pats `lygis`, todėl
 * pirmokas, paspaudęs „Sunkus“, gaudavo skaičius iki 10 000. Generatoriai,
 * kurie srities nepaiso, ją vis tiek gauna patikrintą `generuok` viduje.
 */
export type Generatorius = (
  lygis: Lygis,
  klase?: number,
  sritis?: Sritis | null,
) => Uzdavinys
