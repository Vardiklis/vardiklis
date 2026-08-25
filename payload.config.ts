import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sql, sqliteAdapter } from '@payloadcms/db-sqlite'
import {
  BlocksFeature,
  FixedToolbarFeature,
  lexicalEditor,
  TextStateFeature,
} from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { buildConfig } from 'payload'
import { straipsnioBlokai } from './cms/blokai'
import { Failai } from './cms/Failai'
import { Naudotojai } from './cms/Naudotojai'
import { Nustatymai } from './cms/Nustatymai'
import { PRADINE_SCHEMA } from './cms/pradine-schema'
import { straipsnioAdresas, Straipsniai } from './cms/Straipsniai'
import { TEKSTO_BUSENOS } from './cms/stiliai'

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
    /**
     * GYVA PERŽIŪRA. Redaguojant straipsnį šalia teksto rodomas tikras
     * puslapis — ne tik SEO kortelė. Adresas santykinis: CMS ir svetainė
     * sukasi tame pačiame Next serveryje, tad joks `SERVER_URL` nereikalingas.
     *
     * Rodomas juodraštis, o ne paskelbta versija — todėl adrese `?perziura=1`
     * (žr. `lib/straipsniai.ts`; juodraštį parodo tik prisijungusiam).
     */
    livePreview: {
      collections: ['straipsniai'],
      url: ({ data }) => straipsnioAdresas(data as { nuoroda?: string | null }),
      breakpoints: [
        { name: 'telefonas', label: 'Telefonas', width: 390, height: 844 },
        { name: 'planset', label: 'Planšetė', width: 834, height: 1112 },
        { name: 'kompiuteris', label: 'Kompiuteris', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Straipsniai, Failai, Naudotojai],
  globals: [Nustatymai],
  /**
   * Redaktoriaus galimybės. Prie numatytųjų pridėta:
   *   • `TextStateFeature` — teksto spalva, paryškinimo fonas ir šriftas;
   *   • `BlocksFeature` — spalvoto bloko įdėjimas per „/“;
   *   • `FixedToolbarFeature` — nuolatinė juosta redaktoriaus viršuje. Be jos
   *     spalvų mygtukas pasirodo tik pažymėjus tekstą, ir jo tenka ieškoti.
   * Pačios spalvos aprašytos `cms/stiliai.ts`.
   */
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      TextStateFeature({ state: TEKSTO_BUSENOS }),
      BlocksFeature({ blocks: straipsnioBlokai }),
    ],
  }),
  // Būtinas paveikslėlių dydžiams (Failai.imageSizes) generuoti.
  sharp,
  secret: process.env.PAYLOAD_SECRET || '',
  db: sqliteAdapter({
    /**
     * SCHEMOS KŪRIMAS SERVERYJE.
     *
     * Payload lenteles pats susikuria tik ne produkcijos režimu. Serveryje
     * `NODE_ENV=production`, tad tuščia duomenų bazė liktų visiškai tuščia ir
     * CMS mestų 500. Todėl schema laikoma kode ir paleidžiama kaip migracija —
     * Payload ją įvykdo automatiškai kildamas, be jokio SSH žingsnio.
     *
     * Sakiniai su `IF NOT EXISTS`, tad migracija saugi ir jau užpildytai bazei.
     *
     * PAKEITUS KOLEKCIJŲ LAUKUS: `npm run dev`, paskui `npm run schema`.
     */
    prodMigrations: [
      {
        name: 'pradine-schema',
        up: async ({ db }) => {
          for (const sakinys of PRADINE_SCHEMA) {
            await db.run(sql.raw(sakinys))
          }
        },
        // Atgal nesukam sąmoningai: tai reikštų visų lentelių trynimą.
        down: async () => {},
      },
      /**
       * Atsiradus NAUJAI lentelei (pvz. globalui „Kainos ir kvietimas“)
       * neužtenka perkurti `PRADINE_SCHEMA` — serveryje migracija tuo pačiu
       * pavadinimu jau įvykdyta ir antrą kartą nebepaleidžiama. Todėl
       * pridedamas naujas įrašas, kuris praleidžia tą pačią schemą dar kartą:
       * sakiniai su `IF NOT EXISTS`, tad esamoms lentelėms nieko nedaro.
       *
       * DĖMESIO: taip atsiranda tik naujos LENTELĖS. Pridėjus lauką į jau
       * esamą lentelę, reikia atskiro `ALTER TABLE` sakinio.
       */
      {
        name: 'schema-2026-08-kainos',
        up: async ({ db }) => {
          for (const sakinys of PRADINE_SCHEMA) {
            await db.run(sql.raw(sakinys))
          }
        },
        down: async () => {},
      },
    ],
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
