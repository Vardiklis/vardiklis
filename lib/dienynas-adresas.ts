/**
 * Kuriuo adresu atidarytas dienynas.
 *
 * DIENYNAS GYVENA DVIEM ADRESAIS, bet kodas vienas:
 *   • `dienynas.vardiklis.lt/…` — pagrindinis. `proxy.ts` jį perrašo į
 *     vidinį `/dienynas/…` maršrutą;
 *   • `vardiklis.lt/dienynas/…` — atsarginis, jei subdomeno serveryje
 *     prijungti nepavyktų. Veikia be jokių papildomų nustatymų.
 *
 * Nuorodos puslapyje turi atitikti tą adresą, kuriuo atėjo lankytojas: subdomene
 * `/prisijungti`, pagrindiniame — `/dienynas/prisijungti`. Todėl kelias
 * sudaromas per `dienynoKelias`, o ne rašomas ranka.
 *
 * Grynas modulis be Payload ir `next/headers` — jį importuoja ir `proxy.ts`.
 */

/** Subdomeno pradžia. Tinka ir `dienynas.vardiklis.lt`, ir `dienynas.localhost:3000`. */
export const DIENYNO_SUBDOMENAS = 'dienynas.'

/** Vidinio maršruto šaknis (`app/(dienynas)/dienynas`). */
export const DIENYNO_SAKNIS = '/dienynas'

/** Ar `Host` (ar `X-Forwarded-Host`) antraštė rodo į dienyno subdomeną. */
export function arDienynoSubdomenas(host: string | null | undefined): boolean {
  return Boolean(host?.trim().toLowerCase().startsWith(DIENYNO_SUBDOMENAS))
}

/** `/prisijungti` → `/prisijungti` subdomene arba `/dienynas/prisijungti` kitur. */
export function dienynoKeliasPagalHosta(kelias: string, subdomenas: boolean): string {
  if (subdomenas) return kelias
  return kelias === '/' ? DIENYNO_SAKNIS : `${DIENYNO_SAKNIS}${kelias}`
}
