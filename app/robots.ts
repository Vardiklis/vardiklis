import type { MetadataRoute } from 'next'
import { svetaine } from '@/lib/kontaktai'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Ataskaita yra asmeninė ir gyvuoja tik naršyklėje.
      disallow: '/testas/rezultatas',
    },
    sitemap: `${svetaine.url}/sitemap.xml`,
  }
}
