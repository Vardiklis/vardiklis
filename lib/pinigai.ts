/**
 * Pinigai.
 *
 * VISKAS SKAIČIUOJAMA CENTAIS. `0.1 + 0.2 !== 0.3` yra ne kuriozas, o būdas
 * gauti sąskaitą, kurios eilutės nesusideda į galą: dešimt pamokų po 20,66 €
 * slankiuoju kableliu duoda 206,59999999999997, o mokesčių inspekcijai reikia
 * skaičiaus, kuris sutampa su rankiniu patikrinimu. Todėl visos sudėtys vyksta
 * sveikaisiais centais, o į eurus verčiama tik pačiame gale.
 *
 * APVALINIMAS — „pusė tolyn nuo nulio“ (0,005 → 0,01), kaip įprasta buhalte-
 * rijoje. `Math.round` apvalina pusę į teigiamą pusę, tad neigiamoms sumoms
 * (kreditinė sąskaita) jis duotų −0,00 vietoj −0,01; ženklas išimamas atskirai.
 */

/** Eurai → sveiki centai. */
export function centai(eurai: number): number {
  const zenklas = eurai < 0 ? -1 : 1
  return zenklas * Math.round(Math.abs(eurai) * 100)
}

/** Centai → eurai su dviem ženklais. */
export function eurai(centai: number): number {
  return Math.round(centai) / 100
}

/**
 * PVM išskaičiavimas iš kainos SU PVM.
 *
 * 25 € tėvams yra galutinė kaina, tad bazė yra 25 / 1,21 = 20,66 €, o PVM —
 * likutis. PVM skaičiuojamas kaip SKIRTUMAS, o ne atskiru daugybos veiksmu:
 * taip bazė ir mokestis visada susideda tiksliai į 25,00 € ir eilutėje nelieka
 * cento paklaidos.
 */
export function isskaidykSuPvm(sumaSuPvmCentais: number, proc: number): {
  bePvm: number
  pvm: number
} {
  if (proc <= 0) return { bePvm: sumaSuPvmCentais, pvm: 0 }
  const bePvm = Math.round(sumaSuPvmCentais / (1 + proc / 100))
  return { bePvm, pvm: sumaSuPvmCentais - bePvm }
}

/** PVM pridėjimas prie kainos BE PVM. */
export function pridekPvm(sumaBePvmCentais: number, proc: number): {
  pvm: number
  isViso: number
} {
  if (proc <= 0) return { pvm: 0, isViso: sumaBePvmCentais }
  const pvm = Math.round((sumaBePvmCentais * proc) / 100)
  return { pvm, isViso: sumaBePvmCentais + pvm }
}

/**
 * `2066` → `20,66 €`.
 *
 * Kablelis, ne taškas: taip rašoma lietuviškoje sąskaitoje. Tarpas prieš eurą
 * — nedalomas (U+00A0), kad PDF'e ar laiške suma nepersilaužtų per eilutes.
 */
export function suformatuok(centai: number): string {
  const zenklas = centai < 0 ? '−' : ''
  const abs = Math.abs(Math.round(centai))
  return `${zenklas}${Math.floor(abs / 100)},${String(abs % 100).padStart(2, '0')} €`
}

/** Tas pats be euro ženklo — lentelės stulpeliui, kur ženklas antraštėje. */
export function skaicius(centai: number): string {
  const zenklas = centai < 0 ? '−' : ''
  const abs = Math.abs(Math.round(centai))
  return `${zenklas}${Math.floor(abs / 100)},${String(abs % 100).padStart(2, '0')}`
}
