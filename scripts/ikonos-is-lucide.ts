/**
 * Ištraukia reikiamas Lucide ikonas į `lib/generatoriai/ikonu-duomenys.ts`.
 *
 * Paleidimas:  npx tsx scripts/ikonos-is-lucide.ts
 *
 * Kodėl ne tiesiog importuoti iš `lucide-static`: generatoriai sukasi
 * naršyklėje, o ten failų skaityti negalima. Pakuotėje yra 2025 ikonos —
 * įtraukti visas į paketą būtų švaistymas, todėl reikalingas kelias dešimtis
 * įrašome į modulį vieną kartą.
 *
 * Lucide platinama pagal ISC licenciją; licencijos pastaba lieka sugeneruoto
 * failo antraštėje.
 */

import { readFileSync, writeFileSync } from 'node:fs'

/**
 * Lietuviškas vardas → Lucide ikonos failas.
 *
 * Kur Lucide neturi tikslaus daikto, imamas artimiausias atpažįstamas: lėlei —
 * `baby`, suoliukui — `armchair`. Balionų ir kriaušių Lucide neturi visai, tad
 * jie piešiami patys (`ikonos.ts`), o čia nepatenka.
 */
const IKONOS: Record<string, string> = {
  obuolys: 'apple',
  kriause: 'citrus',
  bananas: 'banana',
  vysnia: 'cherry',
  morka: 'carrot',
  sausainis: 'cookie',
  keksiukas: 'cake',
  saldainis: 'candy',
  kiausinis: 'egg',
  riesutas: 'nut',
  sekla: 'sprout',

  kamuolys: 'volleyball',
  kubelis: 'toy-brick',
  piestukas: 'pencil',
  knyga: 'book',
  zvaigzde: 'star',
  gele: 'flower',
  lapas: 'leaf',
  raktas: 'key',
  dovana: 'gift',
  marskineliai: 'shirt',
  sketis: 'umbrella',
  kuprine: 'backpack',
  liniuote: 'ruler',
  zirkles: 'scissors',
  ledai: 'ice-cream-cone',
  lele: 'baby',

  kate: 'cat',
  suo: 'dog',
  paukstis: 'bird',
  zuvis: 'fish',
  triusis: 'rabbit',

  deze: 'box',
  stalas: 'table',
  suoliukas: 'armchair',
  sofa: 'sofa',
  lempa: 'lamp',
  namas: 'house',
  medis: 'tree-deciduous',
  pusis: 'tree-pine',
  saule: 'sun',
  debesis: 'cloud',

  dviratis: 'bike',
  automobilis: 'car',
  autobusas: 'bus',

  moneta: 'coins',
  banknotas: 'banknote',
  svarstykles: 'scale',
  laikrodis: 'clock',
  termometras: 'thermometer',

  apskritimas: 'circle',
  kvadratas: 'square',
  trikampis: 'triangle',
}

/** Iš Lucide failo paliekama tik vidinė piešinio dalis. */
function vidus(failas: string): string {
  const svg = readFileSync(`node_modules/lucide-static/icons/${failas}.svg`, 'utf8')
  const turinys = svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>'))
  return turinys
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const eilutes = Object.entries(IKONOS)
  .sort(([a], [b]) => a.localeCompare(b, 'lt'))
  .map(([lt, failas]) => `  ${lt}: '${vidus(failas).replace(/'/g, "\\'")}',`)

writeFileSync(
  'lib/generatoriai/ikonu-duomenys.ts',
  `/**
 * SUGENERUOTAS FAILAS — nekeisk ranka.
 *
 * Perkurti:  npx tsx scripts/ikonos-is-lucide.ts
 *
 * Ikonos iš Lucide (https://lucide.dev), ISC licencija.
 * Visos piešiamos \`currentColor\` linijomis be užpildo, todėl paveldi
 * \`var(--ink)\` ir spausdinant lieka juodos.
 */

/** Ikonos vidus 24×24 koordinačių sistemoje. */
export const IKONU_KELIAI: Record<string, string> = {
${eilutes.join('\n')}
}

export type IkonosVardas = keyof typeof IKONU_KELIAI
`,
)

console.log(`Įrašyta ikonų: ${eilutes.length}`)
