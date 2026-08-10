/**
 * Uždavinių tipai. Atskirai nuo `index.ts`, kad generatoriai galėtų importuoti
 * tipą be ciklinės priklausomybės su registru.
 */

import type { Sritis } from './sritis'

export type { Sritis }

/**
 * Kaip mokinys pateikia atsakymą.
 *
 * PUPP programa numato tris pateikimo būdus, o variklis mokėjo tik pirmąjį.
 * I dalis (10 iš 50 taškų) yra vien pasirenkamojo atsakymo, tad be šių formatų
 * egzamino lapas struktūriškai neatitiktų tikrovės.
 *
 *   `ivedimas`  — įrašomas skaičius ar žodis (buvęs vienintelis);
 *   `pasirinkimas` — vienas teisingas iš kelių pateiktų;
 *   `poros`     — kairės pusės teiginiai susiejami su dešinės;
 *   `eiliskumas` — pateikti objektai surikiuojami.
 */
export type AtsakymoFormatas = 'ivedimas' | 'pasirinkimas' | 'poros' | 'eiliskumas'

/** Vienas pasirinkimo variantas. Rodymui — su KaTeX. */
export type Variantas = {
  /** Raidė sąlygoje: A, B, C, D. */
  raide: string
  tekstas: string
}

/** Susiejimo pora: kairė lieka vietoje, dešinė maišoma. */
export type Pora = {
  kaire: string
  desine: string
}

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

  /** Nenurodžius — `ivedimas`, kad visi seni generatoriai liktų nepakeisti. */
  formatas?: AtsakymoFormatas
  /**
   * Domenui teisingi klaidingi atsakymai, jei generatorius juos žino.
   *
   * Automatiškai išvesti distraktoriai tinka ne visur: tikimybės atsakymui 1
   * jie duotų 2 ir 10, o mokinys žino, kad tikimybė už vienetą didesnė nebūna.
   * Nurodžius čia, `iPasirinkima` naudoja būtent šiuos.
   */
  distraktoriai?: string[]
  /** Tik `pasirinkimas`: visi variantai maišyta tvarka, tarp jų ir teisingas. */
  variantai?: Variantas[]
  /**
   * Tik `poros` ir `eiliskumas`: pradiniai duomenys.
   * `poros` atveju dešinė pusė mokiniui rodoma sumaišyta, `eiliskumas` —
   * `elementai` yra sumaišyta eilė, o `atsakymas` nurodo teisingą.
   */
  poros?: Pora[]
  elementai?: string[]
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
