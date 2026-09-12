import {
  dienuSkirtumas,
  MENESIAI,
  menesiuSkirtumas,
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
 * čia jie skaitomi būtent taip — elgesys nepasikeičia savaime. Lygiai taip pat
 * tušti `nuoDatos` ir `ikiDatos` reiškia „iškart“ ir „be galo“.
 */

export type Pamoka = {
  kartojimas?: string | null
  savaitesDiena?: string | null
  kasKiek?: number | string | null
  menesioDiena?: number | null
  kasKiekMenesiu?: number | string | null
  nuoDatos?: string | null
  ikiDatos?: string | null
  laikas?: string | null
  trukmeMin?: number | null
}

/**
 * Payload datos laukas grąžina pilną ISO momentą, o mums reikia Vilniaus paros.
 * Tuščia reikšmė — „ribos nėra“.
 */
function riba(reiksme: string | null | undefined): string | null {
  if (!reiksme) return null
  const data = String(reiksme).slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(data) ? data : null
}

/** Ar ši pamoka vyksta nurodytą dieną. */
export function arVyksta(pamoka: Pamoka, dataISO: string): boolean {
  if (!pamoka.laikas) return false

  /**
   * LANGAS „NUO–IKI“ TIKRINAMAS PIRMAS ir galioja abiem kartojimo būdams.
   * Tai paprasčiausia dalis, bet ir ta, kurios anksčiau nebuvo: iki šiol
   * pamoka, kartą įrašyta, kartojosi be galo, o „nuo kada“ pasirodydavo tik
   * pasirinkus rečiau nei kas savaitę.
   */
  const nuo = riba(pamoka.nuoDatos)
  const iki = riba(pamoka.ikiDatos)
  if (nuo && dataISO < nuo) return false
  if (iki && dataISO > iki) return false

  if (pamoka.kartojimas === 'menuo') {
    const menesioDiena = Number(pamoka.menesioDiena)
    if (!menesioDiena) return false
    // Vasarį 30-os dienos nėra — tą mėnesį pamokos tiesiog nėra.
    if (Number(dataISO.slice(8, 10)) !== menesioDiena) return false

    const kasKiek = Math.max(1, Number(pamoka.kasKiekMenesiu || 1))
    if (kasKiek === 1) return true
    // Be atskaitos taško „kas antras mėnuo“ neturi prasmės — žr. komentarą
    // prie savaičių žemiau; elgiamės vienodai.
    if (!nuo) return true

    /**
     * Atskaitos mėnuo — tas, kuriame įvyksta PIRMOJI pamoka, o ne tas, kuriame
     * yra „Nuo kada“. Įrašius „nuo rugsėjo 20“ su 15-a mėnesio diena, rugsėjo
     * 15-oji jau pražiūrėta, tad pirmoji pamoka yra spalio 15-oji — ir būtent
     * nuo jos turi eiti „kas 2 mėn.“. Skaičiuojant nuo rugsėjo, serija
     * atsistotų ant lapkričio, ir niekas nesuprastų, kodėl spalis praleistas.
     */
    const poslinkis = Number(nuo.slice(8, 10)) > menesioDiena ? 1 : 0
    return (menesiuSkirtumas(nuo, dataISO) - poslinkis) % kasKiek === 0
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
  if (!nuo) return true

  // Savaičių, o ne dienų skirtumas: „Nuo kada“ gali būti ir ne ta savaitės
  // diena, kurią vyksta pamoka, o savaitės numeris nuo to nesikeičia.
  const savaites = dienuSkirtumas(savaitesPradzia(nuo), savaitesPradzia(dataISO)) / 7
  if (savaites < 0) return false
  return savaites % kasKiek === 0
}

/** Pamokos trukmė minutėmis. */
export function trukme(pamoka: Pamoka): number {
  return pamoka.trukmeMin || 60
}

/** `Kas 2 sav., pirmadieniais 17:00 · iki 2026-06-15` — eilutės antraštei CMS'e. */
export function santrauka(pamoka: Pamoka): string {
  if (!pamoka.laikas) return 'Nauja pamoka'

  /**
   * Langas prirašomas gale, nes suskleistoje eilutėje tai vienintelė vieta,
   * kur pamatysi, kad pamoka laikina. Be jo pasibaigusi eilutė atrodytų
   * lygiai kaip veikianti.
   */
  const nuo = riba(pamoka.nuoDatos)
  const iki = riba(pamoka.ikiDatos)
  const langas = [nuo ? `nuo ${nuo}` : null, iki ? `iki ${iki}` : null].filter(Boolean).join(', ')
  const prierasas = langas ? ` · ${langas}` : ''

  if (pamoka.kartojimas === 'menuo') {
    const kasKiek = Math.max(1, Number(pamoka.kasKiekMenesiu || 1))
    const daznis = kasKiek === 1 ? 'Kas mėnesį' : `Kas ${kasKiek} mėn.`
    const d = pamoka.menesioDiena
    return `${daznis}${d ? ` ${d} d.` : ''}, ${pamoka.laikas}${prierasas}`
  }

  const diena = Number(pamoka.savaitesDiena)
  if (!diena) return `Kas savaitę, ${pamoka.laikas}${prierasas}`

  const vardas = SAVAITES_DIENOS[diena - 1]
  const kasKiek = Math.max(1, Number(pamoka.kasKiek || 1))
  const daznis = kasKiek === 1 ? 'Kas savaitę' : `Kas ${kasKiek} sav.`
  // „pirmadienis“ → „pirmadieniais“
  return `${daznis}, ${vardas.replace(/is$/, 'iais')} ${pamoka.laikas}${prierasas}`
}

/** `2026-09-07` → `rugsėjo 7 d.` — atskaitos datai paaiškinti. */
export function dataTrumpai(dataISO: string): string {
  const [, menuo, diena] = dataISO.slice(0, 10).split('-').map(Number)
  return `${MENESIAI[menuo - 1]} ${diena} d.`
}
