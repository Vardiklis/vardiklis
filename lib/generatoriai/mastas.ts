/**
 * Skaičių mastas pagal klasę.
 *
 * Sunkumo lygis nusako uždavinio *pavidalą* (vienas veiksmas, du veiksmai,
 * tekstinis), o klasė — skaičių *dydį*. Be to dešimtokas spręstų tas pačias
 * lygtis su vienaženkliais koeficientais kaip penktokas.
 */

/** Kiek kartų didinami skaičiai, palyginti su 5 klasės baziniu dydžiu. */
export function mastas(klase?: number): number {
  if (!klase || klase <= 5) return 1
  if (klase === 6) return 1.3
  if (klase === 7) return 1.8
  if (klase === 8) return 2.5
  if (klase === 9) return 3.5
  return 4.5
}

/** Padidina bazinį skaičių pagal klasę. Rezultatas visada bent 2. */
export function didink(bazinis: number, klase?: number): number {
  return Math.max(2, Math.round(bazinis * mastas(klase)))
}

/** Ar klasė laikoma vyresne — nuo jos atsiranda sunkesnės variacijos. */
export function vyresne(klase?: number): boolean {
  return (klase ?? 0) >= 8
}
