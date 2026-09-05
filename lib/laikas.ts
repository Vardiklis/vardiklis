/**
 * Vilniaus laikas.
 *
 * KAM TO REIKIA. Serveris sukasi UTC, o pamokos vyksta Lietuvos laiku. Įrašius
 * „17:00“ ir palyginus jį su `new Date()` be vertimo, žiemą priminimas išeitų
 * valanda anksčiau, o vasarą dviem — ir niekas to nepastebėtų iki spalio.
 *
 * Naudojama tik `Intl`: jis moka vasaros laiką ir jo taisykles atnaujina pati
 * Node versija. Jokios `date-fns` ar `luxon` — dėl dviejų funkcijų neverta.
 */

export const JUOSTA = 'Europe/Vilnius'

/** Savaitės dienos taip, kaip jos saugomos Payload'e: 1 = pirmadienis. */
export const SAVAITES_DIENOS = [
  'pirmadienis',
  'antradienis',
  'trečiadienis',
  'ketvirtadienis',
  'penktadienis',
  'šeštadienis',
  'sekmadienis',
] as const

const FORMATUOTOJAS = new Intl.DateTimeFormat('lt-LT', {
  timeZone: JUOSTA,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

export type Dalys = {
  metai: number
  menuo: number
  diena: number
  valanda: number
  minute: number
  sekunde: number
}

/** Momento dalys Vilniaus laiku. */
export function dalys(momentas: Date): Dalys {
  const d: Record<string, string> = {}
  for (const dalis of FORMATUOTOJAS.formatToParts(momentas)) {
    if (dalis.type !== 'literal') d[dalis.type] = dalis.value
  }
  return {
    metai: Number(d.year),
    menuo: Number(d.month),
    diena: Number(d.day),
    // Kai kurios Node versijos vidurnaktį grąžina „24“, ne „00“.
    valanda: Number(d.hour) % 24,
    minute: Number(d.minute),
    sekunde: Number(d.second),
  }
}

/** `2026-09-05` Vilniaus laiku. */
export function data(momentas: Date): string {
  const { metai, menuo, diena } = dalys(momentas)
  return `${metai}-${String(menuo).padStart(2, '0')}-${String(diena).padStart(2, '0')}`
}

/** `17:05` Vilniaus laiku. */
export function laikas(momentas: Date): string {
  const { valanda, minute } = dalys(momentas)
  return `${String(valanda).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

/**
 * Savaitės diena 1–7 (1 = pirmadienis) Vilniaus laiku.
 *
 * `getUTCDay()` iš datos be laiko: `Date.UTC` neturi jokios juostos, tad
 * paros riba nenuslenka.
 */
export function savaitesDiena(dataISO: string): number {
  const [m, men, d] = dataISO.split('-').map(Number)
  const diena = new Date(Date.UTC(m, men - 1, d)).getUTCDay()
  return diena === 0 ? 7 : diena
}

/** Pridėti (ar atimti) dienų prie `YYYY-MM-DD`. */
export function pridekDienas(dataISO: string, kiek: number): string {
  const [m, men, d] = dataISO.split('-').map(Number)
  const naujas = new Date(Date.UTC(m, men - 1, d + kiek))
  return `${naujas.getUTCFullYear()}-${String(naujas.getUTCMonth() + 1).padStart(2, '0')}-${String(
    naujas.getUTCDate(),
  ).padStart(2, '0')}`
}

/** Kiek Vilniaus laikas tuo momentu skiriasi nuo UTC, milisekundėmis. */
function poslinkis(momentas: Date): number {
  const d = dalys(momentas)
  const kaipUtc = Date.UTC(d.metai, d.menuo - 1, d.diena, d.valanda, d.minute, d.sekunde)
  // Sekundės tikslumu — `Intl` smulkiau ir negrąžina.
  return kaipUtc - Math.floor(momentas.getTime() / 1000) * 1000
}

/**
 * Vilniaus sieninis laikas → tikras momentas.
 *
 * Pirmas spėjimas traktuoja įrašą kaip UTC ir gali prašauti per poslinkį; jį
 * atėmus gaunamas beveik teisingas momentas, o antra iteracija pataiso ir tą
 * atvejį, kai pirmas spėjimas nukrito į kitą vasaros laiko pusę.
 *
 * Perėjimo naktimis viena valanda būna dviguba (spalį) arba jos nebūna visai
 * (kovą). Tai keičia priminimo laiką ne daugiau kaip valanda du kartus per
 * metus — dėl tikslesnio elgesio čia nesivarginam.
 */
export function momentas(dataISO: string, laikasHHMM: string): Date {
  const [m, men, d] = dataISO.split('-').map(Number)
  const [val, min] = laikasHHMM.split(':').map(Number)
  const sieninis = Date.UTC(m, men - 1, d, val, min)

  let rezultatas = sieninis
  for (let i = 0; i < 2; i++) {
    rezultatas = sieninis - poslinkis(new Date(rezultatas))
  }
  return new Date(rezultatas)
}

/** Ar tekstas yra `HH:MM` nuo 00:00 iki 23:59. */
export function arLaikas(tekstas: unknown): boolean {
  return typeof tekstas === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(tekstas)
}

/** `2026-09-05` → `rugsėjo 5 d. (šeštadienis)`. */
const MENESIAI = [
  'sausio',
  'vasario',
  'kovo',
  'balandžio',
  'gegužės',
  'birželio',
  'liepos',
  'rugpjūčio',
  'rugsėjo',
  'spalio',
  'lapkričio',
  'gruodžio',
]

export function dataZodziais(dataISO: string): string {
  const [, men, d] = dataISO.split('-').map(Number)
  return `${MENESIAI[men - 1]} ${d} d. (${SAVAITES_DIENOS[savaitesDiena(dataISO) - 1]})`
}
