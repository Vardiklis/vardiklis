import { timingSafeEqual } from 'node:crypto'
import { after } from 'next/server'
import type { Atnaujinimas } from '@/lib/agentas/telegrama'
import { apdorokTelegrama } from '@/lib/sekretorius'

/**
 * Telegram webhook — čia ateina kiekviena žinutė botui ir kiekvienas mygtuko
 * paspaudimas (žr. `lib/sekretorius.ts`).
 *
 * KAS GALI KVIESTI. Telegram'ui, nustatant webhook'ą, duodamas slaptažodis
 * (`TELEGRAM_SLAPTAZODIS`), ir jis jį siunčia kiekvienoje užklausoje antraštėje
 * `X-Telegram-Bot-Api-Secret-Token`. Be jo — 401. Kuriam pokalbiui atsakoma,
 * sprendžia jau `apdorokTelegrama` (`TELEGRAM_CHAT_ID`).
 *
 * ATSAKOMA IŠKART, DIRBAMA PO TO (`after`). Modelis galvoja kelias sekundes, o
 * Telegram, negavęs atsakymo laiku, tą patį atnaujinimą siunčia iš naujo.
 *
 * Adresas ne po `/api/` — ten viską perima Payload (žr. `vidus/priminimai`).
 */

export const dynamic = 'force-dynamic'

function arLeista(uzklausa: Request, laukiamas: string): boolean {
  const a = Buffer.from(laukiamas)
  const b = Buffer.from(uzklausa.headers.get('x-telegram-bot-api-secret-token') ?? '')
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(uzklausa: Request) {
  const laukiamas = process.env.TELEGRAM_SLAPTAZODIS?.trim()
  if (!laukiamas || !process.env.TELEGRAM_BOT_TOKEN?.trim()) {
    return new Response('Nesukonfigūruota.', { status: 503 })
  }
  if (!arLeista(uzklausa, laukiamas)) return new Response('Neleista.', { status: 401 })

  let atnaujinimas: Atnaujinimas
  try {
    atnaujinimas = (await uzklausa.json()) as Atnaujinimas
  } catch {
    return new Response('Ne JSON.', { status: 400 })
  }

  after(() =>
    apdorokTelegrama(atnaujinimas).catch((klaida) => {
      console.error('[telegrama] nepavyko apdoroti:', klaida)
    }),
  )
  return new Response('ok')
}
