/**
 * Ištraukia spalvotus Twemoji paveikslėlius į `lib/generatoriai/spalvoti-duomenys.ts`.
 *
 * Paleidimas:  npx tsx scripts/ikonos-is-twemoji.ts
 *
 * Kam jų reikia šalia Lucide: Lucide ikonos yra vienspalvės linijos — puikios
 * schemoms, bet pirmokui medis, katė ar obuolys atpažįstami sunkiau nei
 * spalvotas paveikslėlis. Twemoji piešiniai yra spalvoti, atpažįstami ir
 * pakankamai maži (400–900 baitų), kad kelias dešimtis būtų galima įdėti
 * tiesiai į paketą.
 *
 * SPAUSDINIMO IŠLYGA. Šie paveikslėliai turi įrašytas spalvas, todėl,
 * priešingai nei visi kiti brėžiniai, spausdinant nevirsta juodi. Todėl jie
 * dedami tik ten, kur svarbu atpažinti daiktą, o ne skaityti schemą.
 *
 * Twemoji: MIT (kodas) + CC-BY 4.0 (grafika), © Twitter, Inc. ir bendraautoriai.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'

/** Lietuviškas vardas → Unicode taškas Twemoji failo pavadinime. */
const EMOJI: Record<string, string> = {
  medis: '1f333',
  pusis: '1f332',
  daigas: '1f331',
  gile: '1f330',
  lapas: '1f342',
  gele: '1f338',

  obuolys: '1f34e',
  kriause: '1f350',
  bananas: '1f34c',
  vysnia: '1f352',
  morka: '1f955',
  sausainis: '1f36a',
  keksiukas: '1f9c1',
  saldainis: '1f36c',

  balionas: '1f388',
  zvaigzde: '2b50',
  kamuolys: '26bd',
  meskiukas: '1f9f8',
  knyga: '1f4d5',
  piestukas: '270f',
  deze: '1f4e6',
  dovana: '1f381',
  raktas: '1f511',
  liniuote: '1f4cf',

  kate: '1f431',
  suo: '1f436',
  paukstis: '1f426',
  zuvis: '1f41f',
  triusis: '1f430',
  drugelis: '1f98b',

  namas: '1f3e0',
  kede: '1fa91',
  dviratis: '1f6b2',
  automobilis: '1f697',
  autobusas: '1f68c',
  laikrodis: '23f0',
  svarstykles: '2696',
  moneta: '1fa99',
  saule: '2600',
}

/** Iš Twemoji failo paliekama tik vidinė piešinio dalis (viewBox 0 0 36 36). */
function vidus(kodas: string): string | null {
  const kelias = `node_modules/@twemoji/svg/${kodas}.svg`
  if (!existsSync(kelias)) return null
  const svg = readFileSync(kelias, 'utf8')
  return svg
    .slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>'))
    .replace(/\s+/g, ' ')
    .trim()
}

const eilutes: string[] = []
const truksta: string[] = []
for (const [lt, kodas] of Object.entries(EMOJI).sort(([a], [b]) => a.localeCompare(b, 'lt'))) {
  const turinys = vidus(kodas)
  if (!turinys) {
    truksta.push(`${lt} (${kodas})`)
    continue
  }
  eilutes.push(`  ${lt}: '${turinys.replace(/'/g, "\\'")}',`)
}

writeFileSync(
  'lib/generatoriai/spalvoti-duomenys.ts',
  `/**
 * SUGENERUOTAS FAILAS — nekeisk ranka.
 *
 * Perkurti:  npx tsx scripts/ikonos-is-twemoji.ts
 *
 * Spalvoti paveikslėliai iš Twemoji (https://github.com/jdecked/twemoji):
 * MIT (kodas) + CC-BY 4.0 (grafika), © Twitter, Inc. ir bendraautoriai.
 *
 * Skirtingai nuo Lucide ikonų, šie turi įrašytas spalvas ir spausdinant
 * nevirsta juodi — todėl naudojami tik daiktui atpažinti, ne schemai skaityti.
 */

/** Paveikslėlio vidus 36×36 koordinačių sistemoje. */
export const SPALVOTU_PIESINIAI: Record<string, string> = {
${eilutes.join('\n')}
}

export type SpalvotoVardas = keyof typeof SPALVOTU_PIESINIAI
`,
)

console.log(`Įrašyta spalvotų: ${eilutes.length}`)
if (truksta.length) console.log(`Nerasta: ${truksta.join(', ')}`)
