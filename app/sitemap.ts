import type { MetadataRoute } from 'next'
import { svetaine } from '@/lib/kontaktai'

/** `/testas/rezultatas` čia nerašomas — jis pažymėtas `noindex`. */
export default function sitemap(): MetadataRoute.Sitemap {
  const puslapiai = [
    { kelias: '', prioritetas: 1, daznis: 'monthly' as const },
    { kelias: '/testas', prioritetas: 0.9, daznis: 'monthly' as const },
    { kelias: '/uzduotys', prioritetas: 0.8, daznis: 'monthly' as const },
    { kelias: '/testai', prioritetas: 0.8, daznis: 'monthly' as const },
    { kelias: '/egzaminai', prioritetas: 0.8, daznis: 'monthly' as const },
    { kelias: '/apie', prioritetas: 0.6, daznis: 'yearly' as const },
    { kelias: '/privatumas', prioritetas: 0.2, daznis: 'yearly' as const },
  ]

  const dabar = new Date()

  return puslapiai.map((p) => ({
    url: `${svetaine.url}${p.kelias}`,
    lastModified: dabar,
    changeFrequency: p.daznis,
    priority: p.prioritetas,
  }))
}
