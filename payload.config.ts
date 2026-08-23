import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { buildConfig } from 'payload'
import { Failai } from './cms/Failai'
import { Naudotojai } from './cms/Naudotojai'
import { Straipsniai } from './cms/Straipsniai'

const katalogas = path.dirname(fileURLToPath(import.meta.url))

/**
 * Payload CMS — straipsniai, SEO laukai ir PDF failai.
 *
 * DUOMENŲ BAZĖ. Naudojamas SQLite, nes visa sistema turi gyventi Hostinger'yje,
 * o Payload MySQL adapterio neturi (yra tik MongoDB, Postgres ir SQLite).
 * Failo kelias imamas iš `DATABASE_URI` ir turi rodyti į katalogą, kurio
 * NEPERRAŠO diegimas iš GitHub — antraip kiekvienas atnaujinimas ištrintų visą
 * turinį. Serveryje tai turėtų būti kelias už aplikacijos aplanko ribų,
 * pavyzdžiui `file:/home/UŽSAKOVAS/payload/vardiklis.db`.
 *
 * Persikelti į Postgres (Neon, Supabase) — vienos eilutės pakeitimas: vietoj
 * `sqliteAdapter` įrašomas `postgresAdapter`, paketas jau įdiegtas.
 */
export default buildConfig({
  admin: {
    user: Naudotojai.slug,
    meta: {
      titleSuffix: ' · Vardiklis',
    },
  },
  collections: [Straipsniai, Failai, Naudotojai],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./vardiklis.db',
    },
  }),
  // Tipai generuojami į `cms/payload-types.ts`, kad juos matytų ir puslapiai.
  typescript: {
    outputFile: path.resolve(katalogas, 'cms/payload-types.ts'),
  },
  plugins: [
    // SEO laukai — antraštė, aprašymas ir peržiūra, kaip atrodys Google.
    seoPlugin({
      collections: ['straipsniai'],
      uploadsCollection: 'failai',
      generateTitle: ({ doc }) => `${doc?.pavadinimas ?? ''} · Vardiklis`,
      generateDescription: ({ doc }) => doc?.santrauka ?? '',
    }),
  ],
  localization: {
    locales: ['lt'],
    defaultLocale: 'lt',
  },
})
