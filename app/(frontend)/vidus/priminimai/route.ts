import { timingSafeEqual } from 'node:crypto'
import { siuskPriminimus } from '@/lib/priminimai'

/**
 * Priminimų siuntimas. Šį adresą kviečia cron'as (Hostinger arba cron-job.org).
 *
 * KAS 5 MINUTES, o ne kartą per rytą: siuntimo valanda gyvena CMS'e, tad
 * serveris turi reguliariai klausti, ar jau laikas. Nieko siųsti neradęs
 * badymas nekainuoja beveik nieko.
 *
 *   *​/5 * * * *   curl -s "https://vardiklis.lt/vidus/priminimai?raktas=..."
 *
 * Adresas ne po `/api/`, nes ten viską perima Payload katch-all maršrutas
 * (`app/(payload)/api/[...slug]`).
 */

export const dynamic = 'force-dynamic'

const BE_KESO = { 'Cache-Control': 'no-store' }

function arLeista(uzklausa: Request): boolean {
  const laukiamas = process.env.PRIMINIMU_RAKTAS?.trim()
  if (!laukiamas) return false

  const url = new URL(uzklausa.url)
  const gautas = uzklausa.headers.get('x-priminimu-raktas') ?? url.searchParams.get('raktas') ?? ''

  // Ilgiai lyginami atskirai: `timingSafeEqual` skirtingo ilgio buferiams meta.
  const a = Buffer.from(laukiamas)
  const b = Buffer.from(gautas)
  return a.length === b.length && timingSafeEqual(a, b)
}

async function vykdyk(uzklausa: Request): Promise<Response> {
  if (!process.env.PRIMINIMU_RAKTAS?.trim()) {
    console.error('[priminimai] PRIMINIMU_RAKTAS nenurodytas — maršrutas išjungtas.')
    return new Response('Nesukonfigūruota.', { status: 503, headers: BE_KESO })
  }
  if (!arLeista(uzklausa)) {
    return new Response('Neleista.', { status: 401, headers: BE_KESO })
  }

  try {
    const ataskaita = await siuskPriminimus()
    return Response.json(ataskaita, { headers: BE_KESO })
  } catch (klaida) {
    console.error('[priminimai] siuntimas nulūžo:', klaida)
    return new Response('Klaida.', { status: 500, headers: BE_KESO })
  }
}

export const GET = vykdyk
export const POST = vykdyk
