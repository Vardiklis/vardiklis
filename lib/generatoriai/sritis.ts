/**
 * Skaičių sritis — griežčiausia potemės riba.
 *
 * Iki šiol ribą netiesiogiai nustatydavo sunkumo mygtukas: `lygis === 3`
 * reiškė skaičius iki 10 000 nepriklausomai nuo to, kad tema vadinasi
 * „Skaičiai nuo 0 iki 100“, o mokinys — pirmokas. Sunkumas nuo šiol nusako
 * tik uždavinio *pavidalą*, o sritis yra atskiras, kodu tikrinamas laukas.
 *
 * Sritis paveldima trimis pakopomis: potemė → tema → klasė. Pirmoji rasta
 * reikšmė laimi.
 */

export type Sritis = {
  min: number
  max: number
}

/**
 * Numatytoji klasės sritis pagal Lietuvos pradinio ugdymo programą.
 *
 * 5–10 klasėms sritis nenurodoma sąmoningai: ten skaičių mastą tvarko
 * `mastas.ts` pagal klasę, o griežtos viršutinės ribos programoje nėra
 * (laipsniai, šaknys, kombinatorika ją peržengtų teisėtai).
 */
export const SRITIS_PAGAL_KLASE: Readonly<Record<number, Sritis>> = {
  1: { min: 0, max: 100 },
  2: { min: 0, max: 1000 },
  3: { min: 0, max: 10_000 },
  4: { min: 0, max: 1_000_000 },
}

/** Klasės numatytoji sritis arba `null`, jei klasei ribos netaikomos. */
export function sritisKlasei(klase?: number): Sritis | null {
  if (!klase) return null
  return SRITIS_PAGAL_KLASE[klase] ?? null
}

/** Ar skaičius telpa į sritį. Sritis `null` reiškia „netikrinama“. */
export function telpa(n: number, sritis: Sritis | null): boolean {
  if (!sritis) return true
  return n >= sritis.min && n <= sritis.max
}

/**
 * Visi tekste esantys skaičiai.
 *
 * Klausimai rašomi mišriu formatu — lietuviškas tekstas su KaTeX intarpais,
 * todėl paprastas `/\d+/g` čia neveikia: iš `$\dfrac{3}{4}$` jis ištrauktų
 * „3“ ir „4“ tik atsitiktinai, o iš `2{,}40` — „2“ ir „40“ vietoj 2,40.
 * Todėl pirma nurašomos KaTeX komandos, o `{,}` paverčiamas tikru kableliu.
 */
export function skaiciaiTekste(...tekstai: (string | undefined)[]): number[] {
  const tekstas = tekstai
    .filter((t): t is string => Boolean(t))
    .join(' ')
    // KaTeX kablelis: `2{,}40` → `2,40`
    .replace(/\{,\}/g, ',')
    // Komandos `\dfrac`, `\cdot`, `\square`, `\ldots` — ne skaičiai
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[${}]/g, ' ')

  const rasti = tekstas.match(/-?\d+(?:[.,]\d+)?/g) ?? []
  return rasti.map((s) => Number(s.replace(',', '.')))
}

/**
 * Skaičiai, iškrentantys iš srities.
 *
 * Tikrinamas ir `sprendimas` — būtent jame gyvena tarpiniai rezultatai,
 * dažniausia srities pažeidimo vieta. Brėžinys netikrinamas: jo skaičiai yra
 * SVG koordinatės pikseliais, o ne uždavinio duomenys.
 */
export function uzRibos(
  laukai: { klausimas: string; atsakymasRodymui: string; sprendimas?: string },
  sritis: Sritis | null,
): number[] {
  if (!sritis) return []
  return skaiciaiTekste(laukai.klausimas, laukai.atsakymasRodymui, laukai.sprendimas).filter(
    (n) => !telpa(n, sritis),
  )
}

/**
 * Srities zona (0–3), į kurią patenka skaičius.
 *
 * Naudojama įvairovės auditui: jeigu visi rinkinio skaičiai susispietę
 * vienoje zonoje, uždaviniai atrodo vienodi, net jei skaičiai skirtingi.
 */
export function zona(n: number, sritis: Sritis): number {
  const plotis = (sritis.max - sritis.min + 1) / 4
  return Math.min(3, Math.max(0, Math.floor((n - sritis.min) / plotis)))
}
