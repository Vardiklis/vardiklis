/**
 * Paprastas greičio ribotuvas atmintyje.
 *
 * Perkrovus serverį atsistato ir kiekvienas procesas skaičiuoja atskirai —
 * tikram DDoS neapsaugotų, bet botui, kuris tą pačią formą siunčia šimtą
 * kartų, užtenka.
 *
 * `sritis` skiria skaitliukus: registracijos forma ir kalendoriaus rezervacija
 * turi savo kvotas, kad vienos naudojimas neužrakintų kitos.
 */

const zurnalas = new Map<string, number[]>()

export function perDaznai(
  sritis: string,
  raktas: string,
  riba: number,
  langasMs: number,
): boolean {
  const dabar = Date.now()
  const pilnas = `${sritis}:${raktas}`
  const buve = (zurnalas.get(pilnas) ?? []).filter((t) => dabar - t < langasMs)

  if (buve.length >= riba) {
    zurnalas.set(pilnas, buve)
    return true
  }
  buve.push(dabar)
  zurnalas.set(pilnas, buve)

  // Kad Map neaugtų be galo — retkarčiais išvalom pasenusius įrašus.
  if (zurnalas.size > 500) {
    for (const [k, laikai] of zurnalas) {
      if (laikai.every((t) => dabar - t >= langasMs)) zurnalas.delete(k)
    }
  }
  return false
}

/** Naujos eilutės antraštėse leidžia įterpti savo `Bcc:` — iškerpam. */
export function saugiEilute(tekstas: string, ilgis: number): string {
  return tekstas.replace(/[\r\n]+/g, ' ').trim().slice(0, ilgis)
}

export const ATRODO_KAIP_PASTAS = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
