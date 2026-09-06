import {
  dienuSkirtumas,
  MENESIAI,
  SAVAITES_DIENOS,
  savaitesDiena,
  savaitesPradzia,
} from '@/lib/laikas'

/**
 * Pamokos pasikartojimas.
 *
 * VIENA VIETA DVIEM VARTOTOJAMS: pagal tai, ką sako `arVyksta()`, svetainės
 * kalendorius dažo langelius (`lib/tvarkarastis.ts`), o rytiniai priminimai
 * sprendžia, ar šiandien yra pamoka (`lib/priminimai.ts`). Jei logika būtų
 * dviejose vietose, anksčiau ar vėliau tėvai gautų laišką apie pamoką, kurios
 * kalendorius nerodo.
 *
 * SENI ĮRAŠAI. Iki pasikartojimo laukų pamokos buvo tiesiog „kas savaitę tą
 * savaitės dieną“. Tokiuose įrašuose `kartojimas` ir `kasKiek` yra tušti, ir
 * čia jie skaitomi būtent taip — elgesys nepasikeičia savaime.
 */

export type Pamoka = {
  kartojimas?: string | null
  savaitesDiena?: string | null
  kasKiek?: number | string | null
  nuoDatos?: string | null
  menesioDiena?: number | null
  laikas?: string | null
  trukmeMin?: number | null
}

/** Ar ši pamoka vyksta nurodytą dieną. */
export function arVyksta(pamoka: Pamoka, dataISO: string): boolean {
  if (!pamoka.laikas) return false

  if (pamoka.kartojimas === 'menuo') {
    const menesioDiena = Number(pamoka.menesioDiena)
    if (!menesioDiena) return false
    // Vasarį 30-os dienos nėra — tą mėnesį pamokos tiesiog nėra.
    return Number(dataISO.split('-')[2]) === menesioDiena
  }

  if (!pamoka.savaitesDiena) return false
  if (savaitesDiena(dataISO) !== Number(pamoka.savaitesDiena)) return false

  const kasKiek = Math.max(1, Number(pamoka.kasKiek || 1))
  if (kasKiek === 1) return true

  /**
   * Kas antrą (trečią…) savaitę reikia atskaitos taško — kitaip neaišku,
   * KURIOS savaitės yra „tos“. Jo neradus laikom, kad pamoka kas savaitę:
   * kalendoriuje tai parodo daugiau užimtumo, o ne pasiūlo laiką, kurio nėra.
   * CMS to neleidžia — laukas ten privalomas, kai pasirinkta daugiau nei 1.
   */
  if (!pamoka.nuoDatos) return true

  const nuo = String(pamoka.nuoDatos).slice(0, 10)
  const savaites = dienuSkirtumas(savaitesPradzia(nuo), savaitesPradzia(dataISO)) / 7
  if (savaites < 0) return false
  return savaites % kasKiek === 0
}

/** Pamokos trukmė minutėmis. */
export function trukme(pamoka: Pamoka): number {
  return pamoka.trukmeMin || 60
}

/** `Kas 2 sav., pirmadieniais 17:00` — eilutės antraštei CMS'e. */
export function santrauka(pamoka: Pamoka): string {
  if (!pamoka.laikas) return 'Nauja pamoka'

  if (pamoka.kartojimas === 'menuo') {
    const d = pamoka.menesioDiena
    return d ? `Kas mėnesį ${d} d., ${pamoka.laikas}` : `Kas mėnesį, ${pamoka.laikas}`
  }

  const diena = Number(pamoka.savaitesDiena)
  if (!diena) return `Kas savaitę, ${pamoka.laikas}`

  const vardas = SAVAITES_DIENOS[diena - 1]
  const kasKiek = Math.max(1, Number(pamoka.kasKiek || 1))
  const daznis = kasKiek === 1 ? 'Kas savaitę' : `Kas ${kasKiek} sav.`
  // „pirmadienis“ → „pirmadieniais“
  return `${daznis}, ${vardas.replace(/is$/, 'iais')} ${pamoka.laikas}`
}

/** `2026-09-07` → `rugsėjo 7 d.` — atskaitos datai paaiškinti. */
export function dataTrumpai(dataISO: string): string {
  const [, menuo, diena] = dataISO.slice(0, 10).split('-').map(Number)
  return `${MENESIAI[menuo - 1]} ${diena} d.`
}
