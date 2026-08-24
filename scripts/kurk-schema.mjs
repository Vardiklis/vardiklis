/**
 * Išrenka duomenų bazės schemą į `cms/pradine-schema.ts`.
 *
 * KAM TO REIKIA. Payload schemą automatiškai kuria tik ne produkcijos režimu
 * (`push`), o serveryje `NODE_ENV=production`, tad tuščioje duomenų bazėje
 * neatsirastų nė vienos lentelės. Todėl schema įrašoma į kodą ir serveryje
 * paleidžiama kaip `prodMigrations` — automatiškai, be SSH.
 *
 * KADA PALEISTI. Pakeitus kolekcijų laukus:
 *   1. `npm run dev`  — vietinė bazė atsinaujina pati;
 *   2. `npm run schema` — schema perrašoma į kodą;
 *   3. commit + push  — serveris pritaikys ją pats.
 */
import { createClient } from '@libsql/client'
import { writeFileSync } from 'node:fs'

const saltinis = process.env.DATABASE_URI || 'file:./vardiklis.db'
const klientas = createClient({ url: saltinis })

const { rows } = await klientas.execute(`
  select type, name, sql from sqlite_master
  where sql is not null and name not like 'sqlite_%'
  order by case type when 'table' then 0 else 1 end, name
`)

if (rows.length === 0) {
  console.error(`Bazėje ${saltinis} nėra lentelių. Pirma paleisk \`npm run dev\`.`)
  process.exit(1)
}

// `IF NOT EXISTS` daro migraciją idempotentišką: ją saugu paleisti ir ant
// tuščios bazės, ir ant jau užpildytos — antruoju atveju ji tiesiog nieko nedaro.
const sakiniai = rows.map((r) =>
  String(r.sql)
    .replace(/^CREATE TABLE /i, 'CREATE TABLE IF NOT EXISTS ')
    .replace(/^CREATE INDEX /i, 'CREATE INDEX IF NOT EXISTS ')
    .replace(/^CREATE UNIQUE INDEX /i, 'CREATE UNIQUE INDEX IF NOT EXISTS ')
    .replace(/\s+/g, ' ')
    .trim(),
)

const turinys = `/**
 * SUGENERUOTA AUTOMATIŠKAI — ranka neredaguoti.
 * Perkurti:  npm run schema
 *
 * Pradinė duomenų bazės schema. Serveryje paleidžiama kaip \`prodMigrations\`,
 * nes produkcijos režimu Payload lentelių pats nekuria.
 */

export const PRADINE_SCHEMA: string[] = [
${sakiniai.map((s) => '  ' + JSON.stringify(s) + ',').join('\n')}
]
`

writeFileSync('cms/pradine-schema.ts', turinys)
console.log(`  ✓ cms/pradine-schema.ts — ${sakiniai.length} sakiniai`)
