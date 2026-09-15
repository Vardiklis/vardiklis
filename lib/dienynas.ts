import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { DIENYNO_FAILAI } from '@/cms/DienynoFailai'
import { DIENYNO_KONTEKSTAS, DIENYNO_PASKYROS } from '@/cms/DienynoPaskyros'
import { arAdministratorius } from '@/cms/prieiga'
import { svetaine } from '@/lib/kontaktai'
import { arDienynoSubdomenas, dienynoKeliasPagalHosta } from '@/lib/dienynas-adresas'
import { data as dataVilniuje, momentas, pridekDienas } from '@/lib/laikas'
import { arVyksta, pauzuoja, trukme, type Pamoka } from '@/lib/pamokos'

/**
 * Dienynas: kas prisijungęs ir ką jam rodyti.
 *
 * PRISIJUNGIMAS — SAVAS SLAPUKAS, NE PAYLOAD JWT. Slaptažodį tikrina Payload
 * (`payload.login`), bet naršyklė gauna tik `id.galiojimas.parasas`. Payload
 * tokio slapuko neatpažįsta, tad su juo `/api` ir GraphQL vaikui neatsiveria
 * (plačiau — `cms/DienynoPaskyros.ts`).
 *
 * Parašas apima ir paskyros slaptažodžio druską. Payload ją sugeneruoja iš
 * naujo kiekvieną kartą keičiant slaptažodį — tad įrašius naują slaptažodį
 * visi seni prisijungimai nustoja galioti patys, be jokios sesijų lentelės.
 * Ištrynus paskyrą — lygiai taip pat.
 */

export const DIENYNO_SLAPUKAS = 'vardiklis-dienynas'

/** Kiek laiko nereikia jungtis iš naujo. Mokslo pusmetis — kad vaikas nepamestų slaptažodžio. */
const GALIOJA_S = 120 * 24 * 60 * 60

/** Kiek dienų į priekį ieškoti kitos pamokos. Toliau jau ne „kita pamoka“. */
const KITOS_PAMOKOS_HORIZONTAS = 120

/** Mažiausias vaiko sugalvoto slaptažodžio ilgis. Vaikui — ne per griežtai. */
export const SLAPTAZODZIO_ILGIS = 6

/** Kiek praėjusių pamokų rodyti. */
const PAMOKU_SARASE = 12

type Payload = Awaited<ReturnType<typeof getPayload>>

const payloadas = () => getPayload({ config })

// ─── Prisijungimas ─────────────────────────────────────────────────────────

function parasas(id: string, galioja: number, druska: string): string {
  const raktas = process.env.PAYLOAD_SECRET || ''
  return createHmac('sha256', raktas)
    .update(`dienynas:${id}:${galioja}:${druska}`)
    .digest('base64url')
}

async function paskyrosDruska(payload: Payload, id: string): Promise<string | null> {
  try {
    const dok = await payload.findByID({
      collection: DIENYNO_PASKYROS,
      id,
      depth: 0,
      overrideAccess: true,
      showHiddenFields: true,
    })
    return ((dok as { salt?: string | null }).salt as string | undefined) || null
  } catch {
    return null
  }
}

export type PrisijungimoRezultatas =
  | { pavyko: true; slapukas: string; galiojaS: number; keistiSlaptazodi: boolean }
  | { pavyko: false; klaida: 'neteisingai' | 'uzrakinta' }

/**
 * Patikrina vardą ir slaptažodį ir grąžina slapuko reikšmę.
 *
 * Vardas suvienodinamas taip pat, kaip Payload jį įrašo (mažosios, be tarpų
 * kraštuose) — vaikas neturi prisiminti, ar rašė „Kate“, ar „kate“.
 */
export async function prisijunk(vardas: string, slaptazodis: string): Promise<PrisijungimoRezultatas> {
  const payload = await payloadas()
  let id: string
  let keistiSlaptazodi: boolean
  try {
    const { user } = await payload.login({
      collection: DIENYNO_PASKYROS,
      data: { username: vardas.toLowerCase().trim(), password: slaptazodis },
      context: { [DIENYNO_KONTEKSTAS]: true },
      depth: 0,
    })
    if (!user) return { pavyko: false, klaida: 'neteisingai' }
    id = String(user.id)
    keistiSlaptazodi = (user as { keistiSlaptazodi?: boolean | null }).keistiSlaptazodi !== false
  } catch (klaida) {
    if ((klaida as Error)?.name === 'LockedAuth') return { pavyko: false, klaida: 'uzrakinta' }
    return { pavyko: false, klaida: 'neteisingai' }
  }

  const slapukas = await sudarykSlapuka(payload, id)
  if (!slapukas) return { pavyko: false, klaida: 'neteisingai' }
  return { pavyko: true, slapukas, galiojaS: GALIOJA_S, keistiSlaptazodi }
}

/** `id.galiojimas.parašas` pagal DABARTINĘ paskyros druską. */
async function sudarykSlapuka(payload: Payload, id: string): Promise<string | null> {
  const druska = await paskyrosDruska(payload, id)
  if (!druska) return null
  const galioja = Math.floor(Date.now() / 1000) + GALIOJA_S
  return `${id}.${galioja}.${parasas(id, galioja, druska)}`
}

export type KeitimoRezultatas = { pavyko: true; slapukas: string; galiojaS: number } | { pavyko: false; klaida: string }

/**
 * Vaikas pasikeičia laikiną slaptažodį į savo.
 *
 * Keičiant slaptažodį Payload sugeneruoja naują druską, o ji įeina į slapuko
 * parašą — tad senas slapukas nustoja galioti ir čia pat grąžinamas naujas.
 * Kitaip vaikas, vos pasikeitęs slaptažodį, būtų išmestas lauk.
 */
export async function pakeiskSlaptazodi(
  paskyra: DienynoPaskyra,
  naujas: string,
  pakartotas: string,
): Promise<KeitimoRezultatas> {
  if (naujas.length < SLAPTAZODZIO_ILGIS) {
    return { pavyko: false, klaida: `Slaptažodis turi būti bent ${SLAPTAZODZIO_ILGIS} simbolių.` }
  }
  if (naujas !== pakartotas) return { pavyko: false, klaida: 'Slaptažodžiai nesutampa.' }
  if (naujas.toLowerCase().trim() === paskyra.vardas.toLowerCase()) {
    return { pavyko: false, klaida: 'Slaptažodis negali sutapti su vardu.' }
  }

  const payload = await payloadas()

  // Tas pats laikinas slaptažodis — ne pakeitimas. Patikrinama prisijungimu,
  // nes slaptažodžio maišos palyginti tiesiogiai Payload neleidžia.
  if ((await prisijunk(paskyra.vardas, naujas)).pavyko) {
    return { pavyko: false, klaida: 'Sugalvokite naują slaptažodį — ne tą, kurį gavote.' }
  }

  await payload.update({
    collection: DIENYNO_PASKYROS,
    id: paskyra.id,
    overrideAccess: true,
    context: { [DIENYNO_KONTEKSTAS]: true },
    data: { password: naujas, keistiSlaptazodi: false },
  })

  const slapukas = await sudarykSlapuka(payload, paskyra.id)
  if (!slapukas) return { pavyko: false, klaida: 'Nepavyko. Pabandykite dar kartą.' }
  return { pavyko: true, slapukas, galiojaS: GALIOJA_S }
}

export type DienynoPaskyra = {
  id: string
  vardas: string
  mokiniai: string[]
  /** Dar su korepetitorės duotu laikinu slaptažodžiu. */
  keistiSlaptazodi: boolean
}

/** Prisijungusi paskyra pagal slapuką — arba `null`. */
export async function prisijungusiPaskyra(): Promise<DienynoPaskyra | null> {
  const reiksme = (await cookies()).get(DIENYNO_SLAPUKAS)?.value
  if (!reiksme) return null

  const [id, galiojaTekstas, gautas] = reiksme.split('.')
  const galioja = Number(galiojaTekstas)
  if (!id || !gautas || !Number.isInteger(galioja)) return null
  if (galioja < Date.now() / 1000) return null

  const payload = await payloadas()
  let dok: {
    id: number | string
    username?: string | null
    salt?: string | null
    mokiniai?: unknown[] | null
    keistiSlaptazodi?: boolean | null
  }
  try {
    dok = (await payload.findByID({
      collection: DIENYNO_PASKYROS,
      id,
      depth: 0,
      overrideAccess: true,
      showHiddenFields: true,
    })) as typeof dok
  } catch {
    return null
  }
  if (!dok?.salt) return null

  const laukiamas = Buffer.from(parasas(id, galioja, dok.salt))
  const gautasBuf = Buffer.from(gautas)
  if (laukiamas.length !== gautasBuf.length || !timingSafeEqual(laukiamas, gautasBuf)) return null

  const mokiniai = (dok.mokiniai ?? [])
    .map((m) => (typeof m === 'object' && m ? (m as { id?: unknown }).id : m))
    .filter((m): m is number | string => m != null)
    .map(String)

  return { id: String(dok.id), vardas: dok.username ?? '', mokiniai, keistiSlaptazodi: dok.keistiSlaptazodi !== false }
}

/** Kelias dienyne pagal tai, kuriuo adresu atėjo lankytojas (`lib/dienynas-adresas.ts`). */
export async function dienynoKelias(kelias: string): Promise<string> {
  const h = await headers()
  const subdomenas = arDienynoSubdomenas(h.get('x-forwarded-host')) || arDienynoSubdomenas(h.get('host'))
  return dienynoKeliasPagalHosta(kelias, subdomenas)
}

// ─── Ką rodyti ─────────────────────────────────────────────────────────────

export type KitaPamoka = {
  dataISO: string
  laikas: string
  pabaiga: string
  grupine: boolean
  /** Jau prasidėjo, bet dar nesibaigė. */
  vyksta: boolean
}

/** Prie pamokos prisegtas failas. Adresą sudaro komponentas — jis žino, kuriuo adresu atėjo lankytojas. */
export type DienynoFailas = {
  id: string
  pavadinimas: string
  /** Naršyklė jį parodo kaip paveikslėlį (HEIC — ne, jį tik atsisiųsti). */
  paveikslelis: boolean
  /** Yra sumažinta versija sąrašui. */
  perziura: boolean
}

export type IvykusiPamoka = {
  id: string
  dataISO: string
  laikas: string | null
  tema: string | null
  namuDarbai: string | null
  namuDarbuFailai: DienynoFailas[]
  atsiliepimas: string | null
  atsiliepimoFailai: DienynoFailas[]
}

export type VaikoDienynas = {
  id: string
  vardas: string
  /** `vardiklis.lt/p/…` — ta pati nuoroda, kuri eina laiškuose. */
  nuoroda: string | null
  kita: KitaPamoka | null
  pamokos: IvykusiPamoka[]
}

type Mokinys = {
  id: number | string
  vardas?: string | null
  raktas?: string | null
  aktyvus?: boolean | null
  pauzeIki?: string | null
  pamokos?: Pamoka[] | null
}

type Grupe = {
  pauzeIki?: string | null
  pamokos?: Pamoka[] | null
}

function pabaiga(laikas: string, minutes: number): string {
  const [val, min] = laikas.split(':').map(Number)
  const viso = (val * 60 + min + minutes) % (24 * 60)
  return `${String(Math.floor(viso / 60)).padStart(2, '0')}:${String(viso % 60).padStart(2, '0')}`
}

/**
 * Artimiausia dar nepasibaigusi pamoka.
 *
 * Skaičiuojama iš pamokų laikų, o ne iš žurnalo: žurnalo įrašas atsiranda tik
 * priminimo dieną, tad kitos savaitės pamokos jame dar nėra. Taisyklės tos
 * pačios, kaip priminimų (`suplanuok` faile `lib/priminimai.ts`): neaktyvus
 * mokinys ar grupė pamokų neturi, pauzė galioja imtinai, o vaiko pauzė galioja
 * ir jo grupinėms pamokoms.
 */
function artimiausia(mokinys: Mokinys, grupes: Grupe[], dabar: Date): KitaPamoka | null {
  if (mokinys.aktyvus === false) return null

  const siandien = dataVilniuje(dabar)
  for (let i = 0; i <= KITOS_PAMOKOS_HORIZONTAS; i++) {
    const dataISO = pridekDienas(siandien, i)
    if (pauzuoja(mokinys.pauzeIki, dataISO)) continue

    const kandidatai: { pamoka: Pamoka; grupine: boolean }[] = [
      ...(mokinys.pamokos ?? []).map((pamoka) => ({ pamoka, grupine: false })),
      ...grupes
        .filter((g) => !pauzuoja(g.pauzeIki, dataISO))
        .flatMap((g) => (g.pamokos ?? []).map((pamoka) => ({ pamoka, grupine: true }))),
    ]

    let geriausia: KitaPamoka | null = null
    for (const { pamoka, grupine } of kandidatai) {
      if (!pamoka.laikas || !arVyksta(pamoka, dataISO)) continue
      const pradzia = momentas(dataISO, pamoka.laikas)
      const galas = new Date(pradzia.getTime() + trukme(pamoka) * 60000)
      if (galas <= dabar) continue
      if (geriausia && geriausia.laikas <= pamoka.laikas) continue
      geriausia = {
        dataISO,
        laikas: pamoka.laikas,
        pabaiga: pabaiga(pamoka.laikas, trukme(pamoka)),
        grupine,
        vyksta: pradzia <= dabar,
      }
    }
    if (geriausia) return geriausia
  }
  return null
}

/**
 * Vieno vaiko dienynas.
 *
 * Duomenys skaitomi su `overrideAccess`, todėl čia imami TIK rodomi laukai —
 * tėvų el. paštas, Meet nuoroda, kainos ir pastabos iš serverio neišeina.
 * Kad vaikas būtų šios paskyros, patikrina kviečiantysis.
 */
export async function vaikoDienynas(mokinioId: string, dabar = new Date()): Promise<VaikoDienynas | null> {
  const payload = await payloadas()

  let mokinys: Mokinys
  try {
    mokinys = (await payload.findByID({
      collection: 'mokiniai',
      id: mokinioId,
      depth: 0,
      overrideAccess: true,
      select: { vardas: true, raktas: true, aktyvus: true, pauzeIki: true, pamokos: true },
    })) as unknown as Mokinys
  } catch {
    return null
  }
  if (!mokinys) return null

  const [{ docs: grupiuDokai }, { docs: zurnaloDokai }] = await Promise.all([
    payload.find({
      collection: 'grupes',
      where: { and: [{ nariai: { in: [mokinioId] } }, { aktyvi: { equals: true } }] },
      limit: 50,
      depth: 0,
      overrideAccess: true,
      select: { pauzeIki: true, pamokos: true },
    }),
    payload.find({
      collection: 'zurnalas',
      where: {
        and: [
          { mokinys: { equals: mokinioId } },
          { data: { less_than_equal: dataVilniuje(dabar) } },
          // Neįvykusios pamokos temos neturi — sąraše jos tik trukdytų.
          { busena: { not_equals: 'neivyko' } },
        ],
      },
      sort: '-data',
      // Su atsarga: šiandienos dar neprasidėjusios išmetamos `prasidejusios`.
      limit: PAMOKU_SARASE + 5,
      ...SU_FAILAIS,
      select: { data: true, laikas: true, ...DIENYNO_LAUKAI },
    }),
  ])

  return {
    id: String(mokinys.id),
    vardas: mokinys.vardas ?? '',
    nuoroda: mokinys.raktas ? `${svetaine.url}/p/${mokinys.raktas}` : null,
    kita: artimiausia(mokinys, grupiuDokai as unknown as Grupe[], dabar),
    pamokos: prasidejusios(zurnaloDokai as unknown as ZurnaloIrasas[], dabar)
      .slice(0, PAMOKU_SARASE)
      .map(kaipIvykusi),
  }
}

type ZurnaloIrasas = {
  id: number | string
  data: string
  laikas?: string | null
  mokinys?: number | string | null
  busena?: string | null
  tema?: string | null
  namuDarbai?: string | null
  namuDarbuFailai?: unknown[] | null
  atsiliepimas?: string | null
  atsiliepimoFailai?: unknown[] | null
}

/** Žurnalo laukai, kuriuos mato vaikas. */
const DIENYNO_LAUKAI = {
  tema: true,
  namuDarbai: true,
  namuDarbuFailai: true,
  atsiliepimas: true,
  atsiliepimoFailai: true,
} as const

/**
 * Failų dokumentai įtraukiami į žurnalo įrašą, bet tik tie keli laukai, kurių
 * reikia sąrašui — ne visas dokumentas su keliais ir dydžiais.
 */
const SU_FAILAIS = {
  depth: 1,
  overrideAccess: true,
  populate: { [DIENYNO_FAILAI]: { filename: true, mimeType: true, sizes: true } },
} as const

/** Tipai, kuriuos kiekviena naršyklė parodo `<img>`. HEIC to nemoka. */
const RODOMI_PAVEIKSLELIAI = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function failai(reiksme: unknown): DienynoFailas[] {
  if (!Array.isArray(reiksme)) return []
  return reiksme
    .filter((f): f is { id: number | string; filename?: string; mimeType?: string; sizes?: unknown } =>
      Boolean(f && typeof f === 'object' && 'id' in f),
    )
    .map((f) => ({
      id: String(f.id),
      pavadinimas: f.filename ?? 'failas',
      paveikslelis: RODOMI_PAVEIKSLELIAI.includes(f.mimeType ?? ''),
      perziura: Boolean((f.sizes as { perzvalga?: { filename?: string | null } } | undefined)?.perzvalga?.filename),
    }))
}

/**
 * Jau prasidėjusios pamokos, naujausia pirma.
 *
 * Šiandienos 17:00 pamoka 15:00 dar neįvyko — jos temos nerodom. Rūšiuojama
 * čia, o ne užklausoje, nes Payload rūšiuoja tik pagal vieną lauką, o tą pačią
 * dieną pamokų gali būti kelios.
 */
function prasidejusios(irasai: ZurnaloIrasas[], dabar: Date): ZurnaloIrasas[] {
  return irasai
    .filter((z) => !z.laikas || momentas(z.data, z.laikas) <= dabar)
    .sort((a, b) => `${b.data} ${b.laikas ?? ''}`.localeCompare(`${a.data} ${a.laikas ?? ''}`))
}

const kaipIvykusi = (z: ZurnaloIrasas): IvykusiPamoka => ({
  id: String(z.id),
  dataISO: z.data,
  laikas: z.laikas ?? null,
  tema: z.tema?.trim() || null,
  namuDarbai: z.namuDarbai?.trim() || null,
  namuDarbuFailai: failai(z.namuDarbuFailai),
  atsiliepimas: z.atsiliepimas?.trim() || null,
  atsiliepimoFailai: failai(z.atsiliepimoFailai),
})

/**
 * Ar prisijungęs lankytojas gali atsisiųsti šį dienyno failą.
 *
 * Korepetitorė — visada. Vaiko paskyra — tik jei failas prisegtas prie JOS
 * vaiko pamokos (prie namų darbų ar atsiliepimo). Grupės nariai failą mato
 * todėl, kad grupės kopijavimas jų įrašuose rodo į tą patį dokumentą.
 */
export async function arGalimaFaila(failoId: string): Promise<boolean> {
  if (!/^\d+$/.test(failoId)) return false
  if (await prisijungesAdministratorius()) return true

  const paskyra = await prisijungusiPaskyra()
  if (!paskyra || paskyra.mokiniai.length === 0) return false

  const payload = await payloadas()
  const { totalDocs } = await payload.count({
    collection: 'zurnalas',
    overrideAccess: true,
    where: {
      and: [
        { mokinys: { in: paskyra.mokiniai } },
        { or: [{ namuDarbuFailai: { in: [failoId] } }, { atsiliepimoFailai: { in: [failoId] } }] },
      ],
    },
  })
  return totalDocs > 0
}

// ─── Korepetitorės suvestinė ───────────────────────────────────────────────

/**
 * Prisijungęs CMS administratorius — arba `null`.
 *
 * Atskiro prisijungimo dienynui jam nereikia: dienynas gyvena tame pačiame
 * `vardiklis.lt`, tad naršyklė kartu atsiunčia ir `/admin` slapuką.
 */
export async function prisijungesAdministratorius(): Promise<{ vardas: string } | null> {
  try {
    const payload = await payloadas()
    const { user } = await payload.auth({ headers: await headers() })
    if (!arAdministratorius(user)) return null
    return { vardas: (user as { vardas?: string | null }).vardas ?? '' }
  } catch {
    return null
  }
}

export type SuvestinesPamoka = IvykusiPamoka & { busena: string | null }

export type SuvestinesVaikas = {
  id: string
  vardas: string
  klase: string | null
  /** `YYYY-MM-DD`, jei pauzė dar galioja. */
  pauzeIki: string | null
  kita: KitaPamoka | null
  pamokos: SuvestinesPamoka[]
  paskyros: { id: string; vardas: string; keistiSlaptazodi: boolean }[]
  /** Kiek iš vaiko matomų pamokų dar be temos. */
  beTemos: number
}

/** Kiek pamokų rodyti prie kiekvieno vaiko suvestinėje. */
const PAMOKU_SUVESTINEJE = 5

/** Kiek dienų atgal žurnalo imti suvestinei. */
const SUVESTINES_LANGAS = 120

/**
 * Visi aktyvūs mokiniai su kita pamoka, paskutinėmis pamokomis ir paskyromis.
 *
 * Keturios užklausos visiems iškart, o ne po tris kiekvienam vaikui — kitaip
 * trisdešimčiai mokinių puslapis lauktų devyniasdešimties užklausų.
 *
 * Tik administratoriui: kviečiantysis patikrina `prisijungesAdministratorius`.
 */
export async function korepetitoresSuvestine(dabar = new Date()): Promise<SuvestinesVaikas[]> {
  const payload = await payloadas()
  const siandien = dataVilniuje(dabar)

  const [mokiniai, grupes, zurnalas, paskyros] = await Promise.all([
    payload.find({
      collection: 'mokiniai',
      where: { aktyvus: { equals: true } },
      limit: 1000,
      depth: 0,
      overrideAccess: true,
      select: { vardas: true, klase: true, aktyvus: true, pauzeIki: true, pamokos: true },
    }),
    payload.find({
      collection: 'grupes',
      where: { aktyvi: { equals: true } },
      limit: 500,
      depth: 0,
      overrideAccess: true,
      select: { nariai: true, pauzeIki: true, pamokos: true },
    }),
    payload.find({
      collection: 'zurnalas',
      where: {
        and: [
          { data: { less_than_equal: siandien } },
          { data: { greater_than_equal: pridekDienas(siandien, -SUVESTINES_LANGAS) } },
        ],
      },
      sort: '-data',
      limit: 5000,
      ...SU_FAILAIS,
      // `mokinys` čia reikalingas tik kaip numeris — viso vaiko dokumento netraukiam.
      populate: { ...SU_FAILAIS.populate, mokiniai: { vardas: true } },
      select: { data: true, laikas: true, mokinys: true, busena: true, ...DIENYNO_LAUKAI },
    }),
    payload.find({
      collection: DIENYNO_PASKYROS,
      limit: 1000,
      depth: 0,
      overrideAccess: true,
      select: { username: true, mokiniai: true, keistiSlaptazodi: true },
    }),
  ])

  const idTekstu = (reiksme: unknown): string | null => {
    if (reiksme == null) return null
    if (typeof reiksme === 'object') return String((reiksme as { id?: unknown }).id ?? '') || null
    return String(reiksme)
  }

  const irasaiPagalVaika = new Map<string, ZurnaloIrasas[]>()
  for (const z of zurnalas.docs as unknown as ZurnaloIrasas[]) {
    const id = idTekstu(z.mokinys)
    if (!id) continue
    const sarasas = irasaiPagalVaika.get(id)
    if (sarasas) sarasas.push(z)
    else irasaiPagalVaika.set(id, [z])
  }

  const grupiuDokai = grupes.docs as unknown as (Grupe & { nariai?: unknown[] | null })[]
  const paskyruDokai = paskyros.docs as unknown as {
    id: number | string
    username?: string | null
    mokiniai?: unknown[] | null
    keistiSlaptazodi?: boolean | null
  }[]

  return (mokiniai.docs as unknown as (Mokinys & { klase?: string | null })[])
    .map((m) => {
      const id = String(m.id)
      const irasai = prasidejusios(irasaiPagalVaika.get(id) ?? [], dabar)
      // Tos pačios pamokos, kurias mato vaikas — iš jų skaičiuojamos be temos.
      const matomos = irasai.filter((z) => z.busena !== 'neivyko').slice(0, PAMOKU_SARASE)
      const pauze = m.pauzeIki ? dataVilniuje(new Date(m.pauzeIki)) : null

      return {
        id,
        vardas: m.vardas ?? '',
        klase: m.klase ?? null,
        pauzeIki: pauze && pauze >= siandien ? pauze : null,
        kita: artimiausia(
          m,
          grupiuDokai.filter((g) => (g.nariai ?? []).some((n) => idTekstu(n) === id)),
          dabar,
        ),
        pamokos: irasai.slice(0, PAMOKU_SUVESTINEJE).map((z) => ({ ...kaipIvykusi(z), busena: z.busena ?? null })),
        paskyros: paskyruDokai
          .filter((p) => (p.mokiniai ?? []).some((n) => idTekstu(n) === id))
          .map((p) => ({ id: String(p.id), vardas: p.username ?? '', keistiSlaptazodi: p.keistiSlaptazodi !== false })),
        beTemos: matomos.filter((z) => !z.tema?.trim()).length,
      }
    })
    .sort((a, b) => a.vardas.localeCompare(b.vardas, 'lt'))
}
