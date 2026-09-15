import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { DIENYNO_FAILAI } from '@/cms/DienynoFailai'
import { arGalimaFaila } from '@/lib/dienynas'

/**
 * Dienyno failo atidavimas: `/dienynas/failas/<id>` (ir `?dydis=perzvalga`).
 *
 * KODĖL NE `/api/dienyno-failai/file/…`. Payload failą atiduoda tik tam, kas
 * Payload'e prisijungęs, o vaikas ten neprisijungęs niekada (žr.
 * `cms/DienynoPaskyros.ts`). Todėl leidimą tikrina `arGalimaFaila`: vaiko
 * paskyra gauna tik prie savo vaiko pamokų prisegtus failus, korepetitorė — visus.
 *
 * Svetimas ar neegzistuojantis failas atsako vienodai — 404, kad iš atsakymo
 * nebūtų galima spręsti, kokie numeriai egzistuoja.
 */

const NERASTA = () =>
  new Response('Nerasta.', { status: 404, headers: { 'Cache-Control': 'private, no-store' } })

/** Rodomi naršyklėje. Kita (Word, HEIC) — atsisiunčiama. */
const ATIDAROMI = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']

type FailoDokumentas = {
  filename?: string | null
  mimeType?: string | null
  sizes?: { perzvalga?: { filename?: string | null; mimeType?: string | null } | null } | null
}

export async function GET(uzklausa: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await arGalimaFaila(id))) return NERASTA()

  const payload = await getPayload({ config })
  let dok: FailoDokumentas
  try {
    dok = (await payload.findByID({
      collection: DIENYNO_FAILAI,
      id,
      depth: 0,
      overrideAccess: true,
    })) as FailoDokumentas
  } catch {
    return NERASTA()
  }
  if (!dok?.filename) return NERASTA()

  const perzvalga = new URL(uzklausa.url).searchParams.get('dydis') === 'perzvalga' ? dok.sizes?.perzvalga : null
  const vardas = perzvalga?.filename || dok.filename
  const tipas = (perzvalga?.filename && perzvalga.mimeType) || dok.mimeType || 'application/octet-stream'

  // Vardas ateina iš bazės, bet vis tiek — jokių katalogų kelyje.
  if (path.basename(vardas) !== vardas) return NERASTA()

  // Tas pats kelias, kurį naudoja Payload įkeldamas (santykinis — nuo proceso katalogo).
  const katalogas = path.resolve(payload.collections[DIENYNO_FAILAI].config.upload.staticDir as string)

  let turinys: Buffer
  try {
    turinys = await readFile(path.join(katalogas, vardas))
  } catch {
    return NERASTA()
  }

  const atidaromas = ATIDAROMI.includes(tipas)
  return new Response(new Uint8Array(turinys), {
    headers: {
      'Content-Type': tipas,
      'Content-Length': String(turinys.length),
      'Content-Disposition': `${atidaromas ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(dok.filename)}`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
