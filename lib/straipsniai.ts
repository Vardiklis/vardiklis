/**
 * Straipsnių skaitymas iš Payload.
 *
 * Kaip ir PDF bibliotekoje, klaidos nuryjamos sąmoningai: jei backend
 * neatsako, tinklaraštis lieka tuščias, bet svetainė nesugriūna. Juodraščiai
 * neprasprūsta — kolekcijos `access.read` anonimiškam lankytojui grąžina tik
 * paskelbtus įrašus, tad filtras čia yra antras sluoksnis, ne vienintelis.
 */

export type StraipsnioSantrauka = {
  id: string | number
  pavadinimas: string
  nuoroda: string
  santrauka: string
  paskelbta: string | null
  virselis: { url: string; alt: string } | null
  klases: string[]
}

export type Straipsnis = StraipsnioSantrauka & {
  turinys: unknown
  meta: { title?: string | null; description?: string | null; image?: string | null }
}

type Dok = {
  id: string | number
  pavadinimas?: string | null
  nuoroda?: string | null
  santrauka?: string | null
  paskelbta?: string | null
  turinys?: unknown
  klases?: string[] | null
  virselis?: { url?: string | null; alt?: string | null } | string | number | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null } | string | number | null
  } | null
}

async function payloadas() {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ])
  return getPayload({ config })
}

function virselis(d: Dok): { url: string; alt: string } | null {
  if (d.virselis && typeof d.virselis === 'object' && d.virselis.url) {
    return { url: d.virselis.url, alt: d.virselis.alt ?? '' }
  }
  return null
}

function santrauka(d: Dok): StraipsnioSantrauka {
  return {
    id: d.id,
    pavadinimas: d.pavadinimas ?? 'Be pavadinimo',
    nuoroda: d.nuoroda ?? '',
    santrauka: d.santrauka ?? '',
    paskelbta: d.paskelbta ?? null,
    virselis: virselis(d),
    klases: d.klases ?? [],
  }
}

/** Paskelbti straipsniai, naujausi viršuje. */
export async function visiStraipsniai(): Promise<StraipsnioSantrauka[]> {
  try {
    const payload = await payloadas()
    const r = await payload.find({
      collection: 'straipsniai',
      where: { busena: { equals: 'paskelbta' } },
      depth: 1,
      limit: 100,
      sort: '-paskelbta',
      overrideAccess: false,
    })
    return (r.docs as Dok[]).map(santrauka)
  } catch {
    return []
  }
}

/**
 * Prisijungęs CMS naudotojas — arba `null`.
 *
 * `next/headers` importuojamas tingiai: jis paverstų dinaminiu kiekvieną
 * puslapį, kuris ką nors ima iš šio failo (pvz. sitemap).
 */
async function prisijungesNaudotojas() {
  try {
    const [{ headers }, payload] = await Promise.all([import('next/headers'), payloadas()])
    const { user } = await payload.auth({ headers: await headers() })
    return user ?? null
  } catch {
    return null
  }
}

/**
 * Vienas straipsnis pagal adreso dalį. `null`, jei nėra arba dar juodraštis.
 *
 * `perziura` įjungiama tik iš CMS (`?perziura=1`) ir rodo naujausią juodraštį
 * — bet tik prisijungusiam naudotojui. Neprisijungusiam tas pats adresas
 * grąžina įprastą paskelbtą versiją, tad nuoroda nieko nepraskleidžia.
 */
export async function rastStraipsni(
  nuoroda: string,
  perziura = false,
): Promise<Straipsnis | null> {
  try {
    const payload = await payloadas()
    const naudotojas = perziura ? await prisijungesNaudotojas() : null
    const juodrastis = Boolean(naudotojas)

    const r = await payload.find({
      collection: 'straipsniai',
      where: juodrastis
        ? { nuoroda: { equals: nuoroda } }
        : { nuoroda: { equals: nuoroda }, busena: { equals: 'paskelbta' } },
      draft: juodrastis,
      user: naudotojas ?? undefined,
      depth: 2,
      limit: 1,
      overrideAccess: false,
    })
    const d = (r.docs as Dok[])[0]
    if (!d) return null

    const paveikslelis =
      d.meta?.image && typeof d.meta.image === 'object' ? (d.meta.image.url ?? null) : null

    return {
      ...santrauka(d),
      turinys: d.turinys,
      meta: {
        title: d.meta?.title ?? null,
        description: d.meta?.description ?? null,
        image: paveikslelis,
      },
    }
  } catch {
    return null
  }
}

/** „2026 m. rugpjūčio 24 d.“ */
export function data(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('lt-LT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}
