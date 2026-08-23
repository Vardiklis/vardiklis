import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import type { Egzaminas } from './egzaminai'

/**
 * PDF bibliotekos sudėtojas.
 *
 * Šaltiniai du ir jie sąmoningai atskirti:
 *
 *   1. `public/egzaminai/` — variantai, pagaminti `npm run egzaminai`. Jie
 *      keliauja kartu su repozitorija, tad veikia net be duomenų bazės.
 *   2. Payload kolekcija `failai` — tai, ką įkeli per CMS. Šie failai gula į
 *      `UPLOADS_DIR`, t. y. už programos katalogo ribų, ir diegimo neperrašomi.
 *
 * CMS gali ir neatsakyti — pavyzdžiui, statant be `DATABASE_URI`. Tokiu atveju
 * grąžinamas tuščias sąrašas, o puslapis vis tiek susidaro iš sugeneruotų
 * failų. Tai ne paslėpta klaida, o sąmoningas pasirinkimas: viešoji svetainė
 * neturi griūti dėl neveikiančio backend'o.
 */

export type Kortele = {
  raktas: string
  antraste: string
  poantraste: string
  lapas: string
  atsakymai: string | null
  saltinis: 'sugeneruota' | 'cms'
  /** Kuriai klasei skirta — pagal tai kortelė priskiriama egzaminui. */
  klase: number | null
}

/** Sugeneruoti variantai iš `public/egzaminai/`. */
export function variantaiIsKatalogo(e: Egzaminas): Kortele[] {
  const katalogas = join(process.cwd(), 'public', 'egzaminai')
  let failai: string[]
  try {
    failai = readdirSync(katalogas)
  } catch {
    return []
  }

  const numeris = (f: string) => Number(f.replace(`${e.id}-`, '').replace('.pdf', ''))

  return failai
    .filter((f) => f.startsWith(`${e.id}-`) && f.endsWith('.pdf') && !f.includes('-atsakymai'))
    .sort((a, b) => numeris(a) - numeris(b))
    .map((f) => {
      const nr = numeris(f)
      const atsakymai = `${e.id}-${String(nr).padStart(2, '0')}-atsakymai.pdf`
      const dydisKb = Math.round(statSync(join(katalogas, f)).size / 1024)
      return {
        raktas: f,
        antraste: `${nr} variantas`,
        poantraste: `${e.pavadinimas} · PDF, ${dydisKb} KB`,
        lapas: `/egzaminai/${f}`,
        atsakymai: failai.includes(atsakymai) ? `/egzaminai/${atsakymai}` : null,
        saltinis: 'sugeneruota' as const,
        klase: e.klase,
      }
    })
}

type FailoDok = {
  id: string | number
  alt?: string | null
  url?: string | null
  filename?: string | null
  filesize?: number | null
  klase?: number | null
}

/**
 * Per CMS įkelti failai. Tyliai grąžina tuščią sąrašą, jei backend neatsako.
 *
 * ATSAKYMŲ PORAVIMAS EINA PAGAL FAILO VARDĄ — `variantas-07.pdf` poruojasi su
 * `variantas-07-atsakymai.pdf`, lygiai kaip sugeneruotuose lapuose. Atskiro
 * lauko kolekcijoje nedarom sąmoningai: jam reikėtų duomenų bazės migracijos,
 * o jos šiame projekte kol kas nepasileidžia.
 */
export async function failaiIsCms(grupe: 'pupp' | 'nmpp'): Promise<Kortele[]> {
  try {
    const [{ getPayload }, { default: config }] = await Promise.all([
      import('payload'),
      import('@payload-config'),
    ])
    const payload = await getPayload({ config })
    const rezultatas = await payload.find({
      collection: 'failai',
      where: { kategorija: { equals: grupe } },
      depth: 0,
      limit: 200,
      sort: 'filename',
    })

    const dokai = rezultatas.docs as FailoDok[]
    const pagalVarda = new Map<string, FailoDok>()
    for (const d of dokai) if (d.filename) pagalVarda.set(d.filename, d)

    return dokai
      .filter((d) => Boolean(d.url) && !(d.filename ?? '').includes('-atsakymai'))
      .map((d) => {
        const dydisKb = d.filesize ? Math.round(d.filesize / 1024) : null
        const dalys = [
          d.klase ? `${d.klase} klasė` : null,
          'PDF',
          dydisKb ? `${dydisKb} KB` : null,
        ].filter(Boolean)

        const vardas = d.filename ?? ''
        const atsakymai = pagalVarda.get(vardas.replace(/\.pdf$/i, '-atsakymai.pdf'))?.url ?? null

        return {
          raktas: `cms-${d.id}`,
          antraste: d.alt || vardas || 'Užduotis',
          poantraste: dalys.join(' · '),
          lapas: d.url as string,
          atsakymai,
          saltinis: 'cms' as const,
          klase: d.klase ?? null,
        }
      })
  } catch {
    return []
  }
}
