/**
 * Telegram Bot API — tik tai, ko reikia pokalbiui: žinutė, mygtukai, jų
 * paspaudimas ir „rašo…“.
 *
 * KODĖL NE BIBLIOTEKA (grammY, telegraf). Reikia penkių HTTP kvietimų, ir visi
 * jie — `fetch` su JSON. Biblioteka atsineštų savo serverį, sesijas ir
 * tarpinius sluoksnius, o čia tą darbą atlieka Next maršrutas.
 *
 * BANDOMASIS REŽIMAS — žinutė neišeina, tik atspausdinama terminale. Ar jis
 * įjungtas, sprendžia projektas (vardiklyje — `arMock()`).
 *
 * Kaip `agentas.ts`, šis failas apie vardiklį nežino nieko.
 */

export type Mygtukas = { tekstas: string; duomenys: string } | { tekstas: string; nuoroda: string }

/** Tik tie laukai, kuriuos skaitom. Visas formatas — core.telegram.org/bots/api#update. */
export type Atnaujinimas = {
  update_id: number
  message?: {
    message_id: number
    chat: { id: number }
    text?: string
  }
  callback_query?: {
    id: string
    data?: string
    message?: { message_id: number; chat: { id: number }; text?: string }
  }
}

export type Telegrama = {
  siusk: (pokalbis: string | number, html: string, mygtukai?: Mygtukas[][]) => Promise<void>
  /** Pakeičia jau išsiųstą žinutę. Mygtukai be `mygtukai` dingsta. */
  redaguok: (pokalbis: string | number, zinute: number, html: string, mygtukai?: Mygtukas[][]) => Promise<void>
  /** Būtina į kiekvieną paspaudimą — kitaip mygtukas sukasi „kraunasi“ pusę minutės. */
  atsakykMygtukui: (id: string, tekstas?: string) => Promise<void>
  rasau: (pokalbis: string | number) => Promise<void>
}

/** Telegram ilgesnės žinutės nepriima visai, o ne nukerpa. */
const ZINUTES_RIBA = 4000

/** Tekstas `parse_mode: HTML` žinutei. Telegram'ui užtenka šių trijų. */
export const html = (tekstas: string): string =>
  tekstas.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function klaviatura(mygtukai?: Mygtukas[][]) {
  if (!mygtukai?.length) return undefined
  return {
    inline_keyboard: mygtukai.map((eile) =>
      eile.map((m) =>
        'nuoroda' in m ? { text: m.tekstas, url: m.nuoroda } : { text: m.tekstas, callback_data: m.duomenys },
      ),
    ),
  }
}

export function telegrama(n: { zetonas: string; bandomasis?: boolean }): Telegrama {
  async function kviesk(metodas: string, kunas: Record<string, unknown>): Promise<void> {
    if (n.bandomasis) {
      if (metodas === 'sendChatAction' || metodas === 'answerCallbackQuery') return
      const mygtukai = (kunas.reply_markup as ReturnType<typeof klaviatura>)?.inline_keyboard
        .map((eile) => eile.map((m) => `[${m.text}]`).join(' '))
        .join('\n')
      console.log(
        `\n[mock telegram — NEIŠSIŲSTA] ${metodas} → ${String(kunas.chat_id)}\n${String(kunas.text ?? '')}${mygtukai ? `\n${mygtukai}` : ''}\n`,
      )
      return
    }

    const atsakymas = await fetch(`https://api.telegram.org/bot${n.zetonas}/${metodas}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kunas),
      signal: AbortSignal.timeout(15_000),
    })
    const json = (await atsakymas.json().catch(() => ({}))) as { ok?: boolean; description?: string }
    if (!json.ok) throw new Error(`Telegram ${metodas}: ${json.description ?? atsakymas.status}`)
  }

  const tekstas = (t: string) => (t.length > ZINUTES_RIBA ? `${t.slice(0, ZINUTES_RIBA)}…` : t)

  return {
    siusk: (pokalbis, turinys, mygtukai) =>
      kviesk('sendMessage', {
        chat_id: pokalbis,
        text: tekstas(turinys),
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
        reply_markup: klaviatura(mygtukai),
      }),
    redaguok: (pokalbis, zinute, turinys, mygtukai) =>
      kviesk('editMessageText', {
        chat_id: pokalbis,
        message_id: zinute,
        text: tekstas(turinys),
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
        reply_markup: klaviatura(mygtukai),
      }),
    atsakykMygtukui: (id, t) => kviesk('answerCallbackQuery', { callback_query_id: id, text: t }),
    rasau: (pokalbis) => kviesk('sendChatAction', { chat_id: pokalbis, action: 'typing' }),
  }
}
