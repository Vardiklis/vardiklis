import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { DIENYNO_KONTEKSTAS, DIENYNO_PASKYROS } from '@/cms/DienynoPaskyros'
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
  | { pavyko: true; slapukas: string; galiojaS: number }
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
  try {
    const { user } = await payload.login({
      collection: DIENYNO_PASKYROS,
      data: { username: vardas.toLowerCase().trim(), password: slaptazodis },
      context: { [DIENYNO_KONTEKSTAS]: true },
      depth: 0,
    })
    if (!user) return { pavyko: false, klaida: 'neteisingai' }
    id = String(user.id)
  } catch (klaida) {
    if ((klaida as Error)?.name === 'LockedAuth') return { pavyko: false, klaida: 'uzrakinta' }
    return { pavyko: false, klaida: 'neteisingai' }
  }

  const druska = await paskyrosDruska(payload, id)
  if (!druska) return { pavyko: false, klaida: 'neteisingai' }

  const galioja = Math.floor(Date.now() / 1000) + GALIOJA_S
  return { pavyko: true, slapukas: `${id}.${galioja}.${parasas(id, galioja, druska)}`, galiojaS: GALIOJA_S }
}

export type DienynoPaskyra = { id: string; vardas: string; mokiniai: string[] }

/** Prisijungusi paskyra pagal slapuką — arba `null`. */
export async function prisijungusiPaskyra(): Promise<DienynoPaskyra | null> {
  const reiksme = (await cookies()).get(DIENYNO_SLAPUKAS)?.value
  if (!reiksme) return null

  const [id, galiojaTekstas, gautas] = reiksme.split('.')
  const galioja = Number(galiojaTekstas)
  if (!id || !gautas || !Number.isInteger(galioja)) return null
  if (galioja < Date.now() / 1000) return null

  const payload = await payloadas()
  let dok: { id: number | string; username?: string | null; salt?: string | null; mokiniai?: unknown[] | null }
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

  return { id: String(dok.id), vardas: dok.username ?? '', mokiniai }
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

export type IvykusiPamoka = {
  id: string
  dataISO: string
  laikas: string | null
  tema: string | null
  namuDarbai: string | null
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
      // Su atsarga: šiandienos dar neprasidėjusios išmetamos žemiau.
      limit: PAMOKU_SARASE + 5,
      depth: 0,
      overrideAccess: true,
      select: { data: true, laikas: true, tema: true, namuDarbai: true },
    }),
  ])

  const pamokos = (zurnaloDokai as unknown as {
    id: number | string
    data: string
    laikas?: string | null
    tema?: string | null
    namuDarbai?: string | null
  }[])
    // Šiandienos 17:00 pamoka 15:00 dar neįvyko — jos temos nerodom.
    .filter((z) => !z.laikas || momentas(z.data, z.laikas) <= dabar)
    .sort((a, b) => `${b.data} ${b.laikas ?? ''}`.localeCompare(`${a.data} ${a.laikas ?? ''}`))
    .slice(0, PAMOKU_SARASE)
    .map((z) => ({
      id: String(z.id),
      dataISO: z.data,
      laikas: z.laikas ?? null,
      tema: z.tema?.trim() || null,
      namuDarbai: z.namuDarbai?.trim() || null,
    }))

  return {
    id: String(mokinys.id),
    vardas: mokinys.vardas ?? '',
    nuoroda: mokinys.raktas ? `${svetaine.url}/p/${mokinys.raktas}` : null,
    kita: artimiausia(mokinys, grupiuDokai as unknown as Grupe[], dabar),
    pamokos,
  }
}
