/**
 * Pokalbio agentas: kalbos modelis, įrankiai ir patvirtinimas mygtuku.
 *
 * ŠIAME KATALOGE NĖRA NIEKO APIE VARDIKLĮ. Jokių `@/lib/…`, Payload ar
 * mokinių — tik modelis, įrankiai ir pokalbio atmintis. Taip `lib/agentas/`
 * vėliau galima iškelti į atskirą paketą ir naudoti kitame projekte, o
 * vardiklio žinios lieka `lib/sekretorius.ts`.
 *
 * KEISTI GALI TIK ŽMOGUS. Įrankis, kuris ką nors keičia, pats nieko nekeičia:
 * jis grąžina `Pasiulymas` — tekstą ir darbą. Agentas čia pat sustoja, kanalas
 * (Telegram) parodo tekstą su „Taip / Ne“, o darbas paleidžiamas tik paspaudus
 * „Taip“ — ir paleidžia jį kodas, ne modelis. Todėl pigus modelis gali suklysti
 * tik pasiūlyme, kurį žmogus mato prieš patvirtindamas.
 *
 * MODELIS — BET KOKS OPENAI SUDERINAMAS. OpenRouter, vietinis Ollama ar pats
 * OpenAI skiriasi tik adresu ir raktu: užklausa ta pati (`/chat/completions`
 * su `tools`).
 */

export type IrankioKvietimas = {
  id: string
  type: 'function'
  function: { name: string; arguments: string }
}

export type Zinute =
  | { role: 'system' | 'user'; content: string }
  | { role: 'assistant'; content: string | null; tool_calls?: IrankioKvietimas[] }
  | { role: 'tool'; tool_call_id: string; content: string }

/** JSON Schema įrankio argumentams — tokia, kokios laukia `tools[].function.parameters`. */
export type Schema = Record<string, unknown>

export type Irankis = {
  /** Tik `a-z`, `0-9`, `_` — kitaip dalis modelių įrankio nepriima. */
  pavadinimas: string
  /** Modeliui: kada šį įrankį naudoti. Nuo jo labiausiai priklauso, ar modelis pataikys. */
  aprasymas: string
  parametrai: Schema
  /** Grąžina duomenis modeliui arba `Pasiulymas`, jei keitimą turi patvirtinti žmogus. */
  vykdyk: (argumentai: Record<string, unknown>) => Promise<unknown>
}

export class Pasiulymas {
  constructor(
    /** Ką žmogus mato prieš spausdamas „Taip“. */
    readonly tekstas: string,
    /** Paleidžiama tik patvirtinus. Grąžina tekstą, kuris parašomas po pasiūlymu. */
    readonly vykdyk: () => Promise<string>,
  ) {}
}

/** Vienas modelio ėjimas: tekstas arba įrankių kvietimai. */
export type Modelis = (
  zinutes: Zinute[],
  irankiai: Irankis[],
) => Promise<{ content: string | null; tool_calls?: IrankioKvietimas[] }>

export type SuderinamoModelioNustatymai = {
  /** Pvz. `https://openrouter.ai/api/v1`. */
  adresas: string
  raktas: string
  /** Pirmas — pagrindinis. Kiti — atsarginiai, jei pirmo tiekėjas neatsako (OpenRouter `models`). */
  modeliai: string[]
  /** Papildomi užklausos laukai, pvz. OpenRouter `provider`. */
  papildomai?: Record<string, unknown>
  /** Milisekundėmis. */
  laukti?: number
}

/** OpenAI suderinamas `/chat/completions`. */
export function suderinamasModelis(n: SuderinamoModelioNustatymai): Modelis {
  return async (zinutes, irankiai) => {
    const atsakymas = await fetch(`${n.adresas.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${n.raktas}` },
      body: JSON.stringify({
        model: n.modeliai[0],
        ...(n.modeliai.length > 1 ? { models: n.modeliai } : {}),
        messages: zinutes,
        tools: irankiai.map((i) => ({
          type: 'function',
          function: { name: i.pavadinimas, description: i.aprasymas, parameters: i.parametrai },
        })),
        // Sekretoriui kūrybiškumo nereikia — reikia, kad tą patį suprastų vienodai.
        temperature: 0.2,
        max_tokens: 1000,
        ...n.papildomai,
      }),
      signal: AbortSignal.timeout(n.laukti ?? 60_000),
    })
    if (!atsakymas.ok) {
      throw new Error(`Modelis atsakė ${atsakymas.status}: ${(await atsakymas.text()).slice(0, 300)}`)
    }
    const json = (await atsakymas.json()) as {
      choices?: { message?: { content?: string | null; tool_calls?: IrankioKvietimas[] } }[]
      error?: { message?: string }
    }
    const zinute = json.choices?.[0]?.message
    if (!zinute) throw new Error(`Modelis negrąžino atsakymo: ${json.error?.message ?? 'tuščia'}`)
    return {
      content: zinute.content ?? null,
      tool_calls: zinute.tool_calls?.length ? zinute.tool_calls : undefined,
    }
  }
}

/** Įrankio rezultatas modeliui — apkarpytas, kad vienas didelis sąrašas nesuvalgytų viso konteksto. */
const IRANKIO_RIBA = 8000

async function paleisk(irankiai: Irankis[], kvietimas: IrankioKvietimas): Promise<unknown> {
  const irankis = irankiai.find((i) => i.pavadinimas === kvietimas.function.name)
  if (!irankis) return { klaida: `Tokio įrankio nėra: ${kvietimas.function.name}` }

  let argumentai: Record<string, unknown>
  try {
    // Dalis modelių be argumentų atsiunčia tuščią eilutę, o ne `{}`.
    argumentai = kvietimas.function.arguments?.trim() ? JSON.parse(kvietimas.function.arguments) : {}
  } catch {
    return { klaida: 'Argumentai — ne JSON. Pakartok su teisingais.' }
  }

  try {
    return await irankis.vykdyk(argumentai)
  } catch (klaida) {
    // Klaida grąžinama modeliui, o ne metama: dažniausiai jis pats ją ištaiso
    // (kita data, tikslesnis vardas) arba paaiškina žmogui.
    return { klaida: klaida instanceof Error ? klaida.message : String(klaida) }
  }
}

export type AgentoAtsakymas = {
  tekstas: string
  /** Užpildytas — tekstą reikia rodyti su „Taip / Ne“. */
  pasiulymas: Pasiulymas | null
  /** Naujos pokalbio žinutės — jas kanalas įsideda į atmintį. */
  nauji: Zinute[]
}

/**
 * Vienas žmogaus klausimas → vienas atsakymas.
 *
 * Modelis gali kelis kartus iš eilės kviesti įrankius (rasti pamoką, paskui ją
 * perkelti), bet ne daugiau kaip `zingsniu` — kitaip suklydęs modelis suktųsi
 * ratu ir degintų žetonus.
 */
export async function klausk(n: {
  modelis: Modelis
  sistema: string
  irankiai: Irankis[]
  istorija: Zinute[]
  klausimas: string
  zingsniu?: number
}): Promise<AgentoAtsakymas> {
  const nauji: Zinute[] = [{ role: 'user', content: n.klausimas }]

  for (let i = 0; i < (n.zingsniu ?? 6); i++) {
    const ats = await n.modelis(
      [{ role: 'system', content: n.sistema }, ...n.istorija, ...nauji],
      n.irankiai,
    )

    if (!ats.tool_calls) {
      const tekstas = ats.content?.trim() || 'Neturiu ką atsakyti — pabandyk paklausti kitaip.'
      nauji.push({ role: 'assistant', content: tekstas })
      return { tekstas, pasiulymas: null, nauji }
    }

    nauji.push({ role: 'assistant', content: ats.content ?? null, tool_calls: ats.tool_calls })

    /**
     * Į KIEKVIENĄ KVIETIMĄ ATSAKOMA, net jei vienas jau grąžino pasiūlymą —
     * kitaip kitas modelio kvietimas atmetamas dėl neatsakyto `tool_call_id`.
     * Bet keitimas vienu metu tik vienas: po vienu pranešimu — vieni mygtukai.
     */
    let pasiulymas: Pasiulymas | null = null
    for (const kvietimas of ats.tool_calls) {
      const rezultatas: unknown = pasiulymas
        ? { klaida: 'Vienu metu — vienas keitimas. Šis nevykdytas; pasiūlyk jį po patvirtinimo.' }
        : await paleisk(n.irankiai, kvietimas)

      if (rezultatas instanceof Pasiulymas) pasiulymas = rezultatas
      const turinys =
        rezultatas instanceof Pasiulymas
          ? { parodyta: 'Pasiūlymas parodytas su mygtukais „Taip / Ne“. Dar niekas nepakeista.' }
          : rezultatas
      nauji.push({
        role: 'tool',
        tool_call_id: kvietimas.id,
        content: (JSON.stringify(turinys ?? null) ?? 'null').slice(0, IRANKIO_RIBA),
      })
    }

    // Pasiūlymui modelio nebeklausiam: tekstą sudarė kodas, ir jis tikslesnis.
    if (pasiulymas) {
      nauji.push({ role: 'assistant', content: pasiulymas.tekstas })
      return { tekstas: pasiulymas.tekstas, pasiulymas, nauji }
    }
  }

  const tekstas = 'Nepavyko užbaigti — pabandyk paprasčiau arba po vieną dalyką.'
  nauji.push({ role: 'assistant', content: tekstas })
  return { tekstas, pasiulymas: null, nauji }
}

/**
 * Pokalbių ir laukiančių pasiūlymų atmintis — procese, ne bazėje.
 *
 * KODĖL NE BAZĖJE. Pokalbis yra apie vaikus, o atmintyje jis dingsta pats:
 * po pusvalandžio tylos arba perkrovus serverį. Pokalbiui to užtenka — kas
 * svarbu, jau įrašyta ten, kur reikia (pvz. žurnale). Perkrovus serverį
 * nepaspausti mygtukai tiesiog praneša, kad nebegalioja.
 */
export class Atmintis {
  private pokalbiai = new Map<string, { zinutes: Zinute[]; paliesta: number }>()
  private pasiulymai = new Map<string, { pasiulymas: Pasiulymas; sukurta: number }>()

  constructor(
    private readonly n = {
      /** Kiek paskutinių žinučių siunčiama modeliui. */
      zinuciu: 20,
      /** Po tiek tylos pokalbis pamirštamas. */
      pamirsti: 30 * 60_000,
      /** Tiek laiko galioja nepaspaustas „Taip“. */
      pasiulymoGaliojimas: 60 * 60_000,
    },
  ) {}

  istorija(kas: string, dabar = Date.now()): Zinute[] {
    const p = this.pokalbiai.get(kas)
    if (!p || dabar - p.paliesta > this.n.pamirsti) return []
    return p.zinutes
  }

  /**
   * Kerpama nuo pradžios, bet pirma žinutė visada žmogaus: pradėjus nuo
   * įrankio atsakymo, modelis gautų `tool` be jį iškvietusios žinutės, ir
   * užklausa būtų atmesta.
   */
  papildyk(kas: string, nauji: Zinute[], dabar = Date.now()): void {
    let zinutes = [...this.istorija(kas, dabar), ...nauji].slice(-this.n.zinuciu)
    const pirma = zinutes.findIndex((z) => z.role === 'user')
    zinutes = pirma === -1 ? [] : zinutes.slice(pirma)
    this.pokalbiai.set(kas, { zinutes, paliesta: dabar })
  }

  pamirsk(kas: string): void {
    this.pokalbiai.delete(kas)
  }

  /** Grąžina trumpą raktą mygtukui — Telegram mygtuko duomenims leidžia tik 64 baitus. */
  idek(pasiulymas: Pasiulymas, dabar = Date.now()): string {
    for (const [raktas, p] of this.pasiulymai) {
      if (dabar - p.sukurta > this.n.pasiulymoGaliojimas) this.pasiulymai.delete(raktas)
    }
    const raktas = crypto.randomUUID().slice(0, 8)
    this.pasiulymai.set(raktas, { pasiulymas, sukurta: dabar })
    return raktas
  }

  /** Paimtas pasiūlymas išimamas — antras paspaudimas to paties nebepakartos. */
  paimk(raktas: string, dabar = Date.now()): Pasiulymas | null {
    const p = this.pasiulymai.get(raktas)
    this.pasiulymai.delete(raktas)
    if (!p || dabar - p.sukurta > this.n.pasiulymoGaliojimas) return null
    return p.pasiulymas
  }
}
