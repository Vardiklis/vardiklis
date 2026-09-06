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
import { Mokiniai } from './cms/Mokiniai'
import { Naudotojai } from './cms/Naudotojai'
import { Nustatymai } from './cms/Nustatymai'
import { Priminimai } from './cms/Priminimai'
import { Rezervacijos } from './cms/Rezervacijos'
import { PRADINE_SCHEMA } from './cms/pradine-schema'
import { straipsnioAdresas, Straipsniai } from './cms/Straipsniai'
import { Tvarkarastis } from './cms/Tvarkarastis'
import { Zurnalas } from './cms/Zurnalas'
import { TEKSTO_BUSENOS } from './cms/stiliai'

const katalogas = path.dirname(fileURLToPath(import.meta.url))

/**
 * Stulpeliai, kurių `PRADINE_SCHEMA` nesugeba pridėti į jau egzistuojančias
 * lenteles (žr. `prodMigrations` komentarą žemiau).
 *
 * `autosave` atsirado įjungus automatinį juodraščių saugojimą straipsniuose —
 * be jo Payload versijų lentelės nebeperskaito.
 *
 * `mokiniai_id` ir `zurnalas_id` — atsiradus naujoms kolekcijoms, Payload į
 * SENĄ `payload_locked_documents_rels` lentelę prisideda po stulpelį kiekvienai.
 * Jiems dar sukuriami indeksai, tad be šitų dviejų eilučių migracija nulūžtų
 * ties `CREATE INDEX … (mokiniai_id)`.
 */
const TRUKSTAMI_STULPELIAI: string[] = [
  'ALTER TABLE `_straipsniai_v` ADD `autosave` integer',
  'ALTER TABLE `payload_locked_documents_rels` ADD `mokiniai_id` integer REFERENCES `mokiniai`(`id`)',
  'ALTER TABLE `payload_locked_documents_rels` ADD `zurnalas_id` integer REFERENCES `zurnalas`(`id`)',
  'ALTER TABLE `priminimai` ADD `parasas` text',
  'ALTER TABLE `payload_locked_documents_rels` ADD `rezervacijos_id` integer REFERENCES `rezervacijos`(`id`)',
  "ALTER TABLE `tvarkarastis` ADD `nuo_savaitgali` text DEFAULT '10:00' NOT NULL",
]

/** Ar sakinys kuria lentelę (o ne indeksą). */
const arLentele = (sakinys: string): boolean => /^CREATE TABLE/i.test(sakinys)

/**
 * Ar klaida — „toks stulpelis jau yra“.
 *
 * Bazėje, kur stulpelis jau pridėtas (o tokia yra kiekviena, kurioje anksčiau
 * suveikė migracija), pakartotinis `ALTER TABLE ADD` skundžiasi dublikatu, ir
 * tai yra normalu. Bėda ta, kad Drizzle originalią SQLite klaidą apvynioja
 * savo `DrizzleQueryError`, kurio tekstas yra „Failed query: ALTER TABLE …“ —
 * tad paviršiuje ieškant „duplicate column“ nerandama nieko ir migracija
 * nulūžta be reikalo, o kartu neleidžia pakilti visam Payload'ui.
 *
 * Todėl peržiūrima visa `cause` grandinė.
 */
function arDublikatas(klaida: unknown): boolean {
  let dabartine: unknown = klaida
  for (let gylis = 0; gylis < 5 && dabartine; gylis++) {
    const tekstas = `${(dabartine as Error)?.message ?? ''} ${String(dabartine)}`
    if (/duplicate column/i.test(tekstas)) return true
    dabartine = (dabartine as { cause?: unknown })?.cause
  }
  return false
}

/**
 * Vienos migracijos darbas: **lentelės → stulpeliai → indeksai**.
 *
 * Būtent tokia tvarka, nes nauja kolekcija reiškia ne tik naują lentelę, bet ir
 * naują stulpelį senoje `payload_locked_documents_rels`, o tam stulpeliui dar
 * kuriamas indeksas. Pridėjus stulpelius po indeksų, migracija nulūžta ties
 * `CREATE INDEX … (mokiniai_id)`, Payload nebepakyla, ir visi CMS bei
 * straipsnių puslapiai atsako 503.
 *
 * Visi sakiniai idempotentiški, tad kiekviena migracija paleidžia tą patį
 * darbą — skiriasi tik pavadinimas, o serveryje jau įvykdytas nebekartojamas.
 */
async function atnaujinkSchema(db: { run: (sakinys: ReturnType<typeof sql.raw>) => unknown }) {
  for (const sakinys of PRADINE_SCHEMA.filter(arLentele)) {
    await db.run(sql.raw(sakinys))
  }
  for (const sakinys of TRUKSTAMI_STULPELIAI) {
    try {
      await db.run(sql.raw(sakinys))
    } catch (klaida) {
      // Švarioje bazėje stulpelis jau sukurtas kartu su lentele.
      if (!arDublikatas(klaida)) throw klaida
    }
  }
  for (const sakinys of PRADINE_SCHEMA.filter((s) => !arLentele(s))) {
    await db.run(sql.raw(sakinys))
  }
}

/**
 * Perkuria lentelę pagal naują `PRADINE_SCHEMA` aprašą, išsaugant duomenis.
 *
 * KAM TO REIKIA. `ALTER TABLE ADD COLUMN` prideda stulpelį, bet NEIŠIMA seno
 * `NOT NULL`. Pamokoms atsiradus pasikartojimams, `savaites_diena` nebeprivalo
 * būti užpildyta (mėnesinė pamoka jos neturi) — o senoje lentelėje ji vis dar
 * privaloma, tad toks įrašas neįsirašytų. SQLite tokio apribojimo nuimti
 * nemoka, todėl lentelė perkuriama: pervadinam, sukuriam naują, persikeliam
 * senus stulpelius, seną išmetam.
 *
 * `senieji` — stulpeliai, kurie egzistuoja IR senoje, IR naujoje lentelėje.
 * Naujieji lieka tušti, o jų numatytąsias reikšmes duoda pati schema.
 */
async function perkurkLentele(
  db: { run: (sakinys: ReturnType<typeof sql.raw>) => unknown },
  lentele: string,
  senieji: string[],
) {
  const aprasas = PRADINE_SCHEMA.find((s) =>
    s.startsWith(`CREATE TABLE IF NOT EXISTS \`${lentele}\``),
  )
  if (!aprasas) throw new Error(`Schemoje nėra lentelės ${lentele}`)

  try {
    await db.run(sql.raw(`ALTER TABLE \`${lentele}\` RENAME TO \`${lentele}_senas\``))
  } catch (klaida) {
    // Švarioje bazėje senos lentelės nėra — ją sukurs `atnaujinkSchema`.
    if (/no such table/i.test(`${(klaida as Error)?.message} ${String(klaida)}`)) return
    throw klaida
  }

  const stulpeliai = senieji.map((s) => `\`${s}\``).join(', ')
  await db.run(sql.raw(aprasas))
  await db.run(
    sql.raw(
      `INSERT INTO \`${lentele}\` (${stulpeliai}) SELECT ${stulpeliai} FROM \`${lentele}_senas\``,
    ),
  )
  await db.run(sql.raw(`DROP TABLE \`${lentele}_senas\``))
}

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
  collections: [Straipsniai, Failai, Naudotojai, Mokiniai, Zurnalas, Rezervacijos],
  globals: [Nustatymai, Priminimai, Tvarkarastis],
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
       * Atsiradus NAUJAI lentelei (globalas „Kainos ir kvietimas“) neužtenka
       * perkurti `PRADINE_SCHEMA` — serveryje migracija tuo pačiu pavadinimu
       * jau įvykdyta ir antrą kartą nebepaleidžiama. Todėl pridedamas naujas
       * įrašas, kuris praleidžia tą pačią schemą dar kartą: sakiniai su
       * `IF NOT EXISTS`, tad esamoms lentelėms nieko nedaro.
       *
       * O TAI, KO `IF NOT EXISTS` NEPADARO — nauji stulpeliai jau esamose
       * lentelėse. `CREATE TABLE IF NOT EXISTS` seną lentelę tiesiog praleidžia,
       * tad stulpelis niekada neatsirastų, o paskui jį minintis indeksas
       * nulaužtų visą migraciją ir Payload nebepakiltų. Todėl stulpeliai
       * pridedami atskirai ir PIRMIAU už schemą.
       */
      {
        name: 'schema-2026-08-kainos',
        up: async ({ db }) => {
          for (const sakinys of TRUKSTAMI_STULPELIAI) {
            try {
              await db.run(sql.raw(sakinys))
            } catch (klaida) {
              // Švarioje bazėje stulpelis jau sukurtas kartu su lentele —
              // tada SQLite skundžiasi dublikatu, ir tai yra gerai.
              if (!arDublikatas(klaida)) throw klaida
            }
          }
          for (const sakinys of PRADINE_SCHEMA) {
            await db.run(sql.raw(sakinys))
          }
        },
        down: async () => {},
      },
      /**
       * Mokiniai, pamokų žurnalas ir priminimų nustatymai.
       *
       * Nuo čia visos migracijos daro tą patį (`atnaujinkSchema`) ir skiriasi
       * tik pavadinimu. Senesnės dvi paliktos tokios, kokios buvo įvykdytos
       * serveryje — perrašinėti jų nėra prasmės, nes ten jos nebepasileis.
       */
      {
        name: 'schema-2026-09-mokiniai',
        up: async ({ db }) => atnaujinkSchema(db),
        down: async () => {},
      },
      /**
       * Parašas laiško gale (`priminimai.parasas`).
       *
       * Grynas stulpelis jau esamoje lentelėje: `priminimai` serveryje atsirado
       * su ankstesne migracija, tad `CREATE TABLE IF NOT EXISTS` jos nebeliečia
       * ir naujas laukas be `ALTER` niekada neatsirastų. Darbas tas pats, tik
       * naujas pavadinimas — serveryje jau įvykdyta migracija nepasileidžia.
       */
      {
        name: 'schema-2026-09-parasas',
        up: async ({ db }) => atnaujinkSchema(db),
        down: async () => {},
      },
      /** Laisvų laikų kalendorius — globalas „Tvarkarastis“ ir jo dvi lentelės. */
      {
        name: 'schema-2026-09-tvarkarastis',
        up: async ({ db }) => atnaujinkSchema(db),
        down: async () => {},
      },
      /** Rezervacijos iš kalendoriaus — kolekcija ir jos stulpelis rakinimų lentelėje. */
      {
        name: 'schema-2026-09-rezervacijos',
        up: async ({ db }) => atnaujinkSchema(db),
        down: async () => {},
      },
      /**
       * Pamokų pasikartojimai (kas N savaičių, mėnesio diena), pataisymai
       * konkrečiai datai ir atskira savaitgalio pradžia.
       *
       * Dvi lentelės čia PERKURIAMOS, o ne papildomos: jose `savaites_diena`
       * buvo `NOT NULL`, o dabar gali būti tuščia (mėnesinė pamoka, pataisymas
       * konkrečiai datai). Duomenys persikelia.
       */
      {
        name: 'schema-2026-09-kartojimas',
        up: async ({ db }) => {
          await perkurkLentele(db, 'mokiniai_pamokos', [
            '_order',
            '_parent_id',
            'id',
            'savaites_diena',
            'laikas',
            'trukme_min',
          ])
          await perkurkLentele(db, 'tvarkarastis_pakeitimai', [
            '_order',
            '_parent_id',
            'id',
            'savaites_diena',
            'nuo',
            'iki',
            'busena',
            'pastaba',
          ])
          await atnaujinkSchema(db)

          /**
           * Senoji „Pirma eilutė“ reiškė visų dienų pradžią, o dabar — tik
           * darbo dienų. Įrašai, kuriuose likusi senoji numatytoji `08:00`,
           * pakeliami iki naujos: kitaip lentelė be reikalo prasidėtų aštuntą
           * ryto, o pirmos penkios eilutės darbo dienomis būtų tuščios.
           * Sąmoningai pasirinktos kitokios reikšmės neliečiamos.
           */
          await db.run(
            sql.raw("UPDATE `tvarkarastis` SET `nuo` = '13:00' WHERE `nuo` = '08:00'"),
          )
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
