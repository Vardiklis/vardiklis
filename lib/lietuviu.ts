/**
 * Lietuvių kalbos derinimas su skaitvardžiais.
 *
 * Taisyklė:
 *   1, 21, 31…            → vienaskaita   (1 uždavinys)
 *   2–9, 22–29…           → daugiskaita   (5 uždaviniai)
 *   0, 10, 11–19, 20, 30… → kilmininkas   (10 uždavinių)
 */

export type SkaitvardzioForma = 'vns' | 'dgs' | 'kilm'

export function skaitvardzioForma(n: number): SkaitvardzioForma {
  const desimtys = Math.abs(n) % 100
  if (desimtys >= 11 && desimtys <= 19) return 'kilm'
  const paskutinis = Math.abs(n) % 10
  if (paskutinis === 0) return 'kilm'
  if (paskutinis === 1) return 'vns'
  return 'dgs'
}

/** Parenka daiktavardžio formą pagal skaičių. */
export function derink(
  n: number,
  formos: { vns: string; dgs: string; kilm: string },
): string {
  return formos[skaitvardzioForma(n)]
}

/** „1 uždavinys", „5 uždaviniai", „10 uždavinių". */
export function uzdaviniuKiekis(n: number): string {
  return `${n} ${derink(n, {
    vns: 'uždavinys',
    dgs: 'uždaviniai',
    kilm: 'uždavinių',
  })}`
}
