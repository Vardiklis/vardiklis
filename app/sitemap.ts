import type { MetadataRoute } from 'next'
import { svetaine } from '@/lib/kontaktai'
import { visiStraipsniai } from '@/lib/straipsniai'
import { KLASES, klasesNuoroda } from '@/lib/uzduotys-klasems'

/**
 * `/testas/rezultatas` čia nerašomas — jis pažymėtas `noindex`.
 *
 * Straipsniai imami iš Payload, tad naujas įrašas patenka į sitemap be
 * naujo diegimo. Backend'ui neatsakius `visiStraipsniai` grąžina tuščią
 * sąrašą, ir sitemap lieka su statiniais puslapiais, o ne sugriūna.
 */
/** Generuojamas užklausos metu — statymo metu Payload dar nepasiekiamas. */
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const puslapiai = [
    { kelias: '', prioritetas: 1, daznis: 'monthly' as const },
    { kelias: '/testas', prioritetas: 0.9, daznis: 'monthly' as const },
    { kelias: '/uzduotys', prioritetas: 0.8, daznis: 'monthly' as const },
    { kelias: '/testai', prioritetas: 0.8, daznis: 'monthly' as const },
    { kelias: '/egzaminai', prioritetas: 0.8, daznis: 'monthly' as const },
    { kelias: '/egzaminai/nmpp', prioritetas: 0.8, daznis: 'monthly' as const },
    { kelias: '/egzaminai/pupp', prioritetas: 0.8, daznis: 'monthly' as const },
    { kelias: '/straipsniai', prioritetas: 0.7, daznis: 'weekly' as const },
    { kelias: '/matematikos-korepetitore', prioritetas: 0.9, daznis: 'monthly' as const },
    { kelias: '/susisiekti', prioritetas: 0.6, daznis: 'yearly' as const },
    { kelias: '/privatumas', prioritetas: 0.2, daznis: 'yearly' as const },
  ]

  // Klasių puslapiai — po vieną kiekvienai klasei. Būtent jie taikosi į
  // „N klasės uždaviniai", tad sitemap'e jiems duodam ne mažesnį svorį nei
  // generatoriui, kuris pats pagal tokias užklausas rangeuotis negali.
  const klasiuPuslapiai = KLASES.map((k) => ({
    kelias: `/uzduotys/${klasesNuoroda(k)}`,
    prioritetas: 0.8,
    daznis: 'monthly' as const,
  }))

  const dabar = new Date()

  const statiniai = [...puslapiai, ...klasiuPuslapiai].map((p) => ({
    url: `${svetaine.url}${p.kelias}`,
    lastModified: dabar,
    changeFrequency: p.daznis,
    priority: p.prioritetas,
  }))

  const straipsniai = (await visiStraipsniai()).map((s) => ({
    url: `${svetaine.url}/straipsniai/${s.nuoroda}`,
    lastModified: s.paskelbta ? new Date(s.paskelbta) : dabar,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...statiniai, ...straipsniai]
}
