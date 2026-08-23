/**
 * Egzaminų PDF gamyba.
 *
 * Paleidimas:  npm run egzaminai            (6 variantai)
 *              npm run egzaminai -- 10      (10 variantų)
 *
 * PDF gaminami VIENĄ KARTĄ ir gulą į `public/egzaminai/`. Svetainė jų
 * negeneruoja — ji tik atiduoda failus. Taip variantas Nr. 7 lieka tas pats
 * amžinai, net jei generatoriai vėliau pasikeis.
 *
 * Perleidus scenarijų failai perrašomi, todėl to daryti nereikia be reikalo:
 * mokytojai gali būti išsidalinę nuorodas į konkrečius variantus.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { EGZAMINAI, sudarykLapa } from '../lib/egzaminai'
import { atsakymuHtml, lapoHtml } from './egzamino-lapas'

const ARGUMENTAI = process.argv.slice(2)
const PERRASYTI = ARGUMENTAI.includes('--perrasyti')
const KIEK = Number(ARGUMENTAI.find((a) => !a.startsWith('--')) ?? 6)
const KATALOGAS = 'public/egzaminai'
const LAIKINAS = '.egzaminai-laikini'

/** Chrome ieškoma tų pačių vietų, kur ją deda dažniausi diegimai. */
function rastChrome(): string {
  const kandidatai = [
    process.env.CHROME_PATH,
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
  ].filter((c): c is string => Boolean(c))

  for (const c of kandidatai) {
    try {
      execFileSync('which', [c], { stdio: 'pipe' })
      return c
    } catch {
      // kitas kandidatas
    }
  }
  throw new Error(
    'Nerasta Chrome/Chromium. Įdiek ją arba nurodyk kelią per CHROME_PATH aplinkos kintamąjį.',
  )
}

function iPdf(chrome: string, htmlKelias: string, pdfKelias: string): void {
  execFileSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      `--user-data-dir=${LAIKINAS}/profilis`,
      '--no-pdf-header-footer',
      '--generate-pdf-document-outline',
      `--print-to-pdf=${pdfKelias}`,
      htmlKelias,
    ],
    { stdio: 'pipe' },
  )
}

function pagrindinis(): void {
  // Kataloge gali gulėti ranka darytos užduotys tais pačiais vardais.
  // Be šito patikrinimo `npm run egzaminai` jas tyliai perrašytų.
  if (!PERRASYTI && existsSync(KATALOGAS)) {
    const esami = readdirSync(KATALOGAS).filter((f) => f.endsWith('.pdf'))
    if (esami.length > 0) {
      console.error(
        `Kataloge ${KATALOGAS} jau yra ${esami.length} PDF failai.\n` +
          'Jie būtų perrašyti. Jei tikrai to nori:\n\n' +
          '  npm run egzaminai -- --perrasyti\n',
      )
      process.exit(1)
    }
  }

  const chrome = rastChrome()
  mkdirSync(KATALOGAS, { recursive: true })
  mkdirSync(LAIKINAS, { recursive: true })

  const suvestine: string[] = []

  for (const e of EGZAMINAI) {
    for (let v = 1; v <= KIEK; v += 1) {
      const lapas = sudarykLapa(e, v)
      const vardas = `${e.id}-${String(v).padStart(2, '0')}`

      for (const [priesaga, html] of [
        ['', lapoHtml(lapas)],
        ['-atsakymai', atsakymuHtml(lapas)],
      ] as const) {
        const htmlKelias = join(LAIKINAS, `${vardas}${priesaga}.html`)
        const pdfKelias = join(KATALOGAS, `${vardas}${priesaga}.pdf`)
        writeFileSync(htmlKelias, html)
        iPdf(chrome, htmlKelias, pdfKelias)
      }

      const uzdaviniu = lapas.dalys.reduce((s, d) => s + d.uzdaviniai.length, 0)
      const taskai = lapas.dalys.reduce(
        (s, d) => s + d.uzdaviniai.reduce((x, u) => x + u.taskai, 0),
        0,
      )
      suvestine.push(`${vardas}   ${uzdaviniu} užd.   ${taskai} t.`)
      console.log(`  ✓ ${vardas} (+ atsakymai)`)
    }
  }

  rmSync(LAIKINAS, { recursive: true, force: true })

  console.log(`\n=== Sugeneruota ===\n${suvestine.join('\n')}`)
  console.log(`\nFailai: ${KATALOGAS}/`)
}

pagrindinis()
