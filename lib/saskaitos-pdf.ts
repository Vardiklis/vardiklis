import { join } from 'node:path'
import PDFDocument from 'pdfkit'
import { skaicius, suformatuok } from '@/lib/pinigai'
import type { SaskaitosVaizdas } from '@/lib/saskaitos-vaizdas'

/**
 * Sąskaitos PDF.
 *
 * KODĖL SAVAS ŠRIFTAS. Standartiniai PDF šriftai (Helvetica ir kiti keturi)
 * neturi nei ą, nei č, nei ž — vietoj jų žiūryklė piešia tuščią langelį arba
 * praleidžia raidę. Todėl į failą įdedamas Noto Sans; pdfkit įterpia tik tuos
 * glifus, kurie panaudoti, tad sąskaita telpa į kelias dešimtis kilobaitų,
 * nors pats šriftas sveria pusę megabaito.
 *
 * DIEGIANT: šriftai skaitomi iš disko, tad `next.config.ts` juos įtraukia į
 * `outputFileTracingIncludes` — kitaip savarankiškame (standalone) serveryje
 * failo tiesiog nebūtų ir sąskaitos generavimas nulūžtų tik produkcijoje.
 */

const SRIFTAI = join(process.cwd(), 'lib', 'saskaitos-sriftai')
const PAPRASTAS = join(SRIFTAI, 'NotoSans-Regular.ttf')
const PARYSKINTAS = join(SRIFTAI, 'NotoSans-SemiBold.ttf')

const PARASTE = 48
const PLOTIS = 595.28 - PARASTE * 2

/** Pilkas tekstas smulkmenoms, juodas — turiniui. */
const PILKA = '#6b655f'
const JUODA = '#12100e'
const LINIJA = '#ddd6cc'

/** Stulpelių kraštinės nuo kairės paraštės. */
const STULPELIAI = {
  aprasymas: 0,
  kiekis: 300,
  kaina: 370,
  suma: 460,
}

type Dok = InstanceType<typeof PDFDocument>

export function saskaitosPdf(v: SaskaitosVaizdas): Promise<Buffer> {
  const dok: Dok = new PDFDocument({
    size: 'A4',
    margin: PARASTE,
    info: {
      Title: `${v.pavadinimas} ${v.numeris}`,
      Author: v.pardavejas.vardas,
    },
  })

  const gabalai: Buffer[] = []
  const baigta = new Promise<Buffer>((istesek, atmesk) => {
    dok.on('data', (g: Buffer) => gabalai.push(g))
    dok.on('end', () => istesek(Buffer.concat(gabalai)))
    dok.on('error', atmesk)
  })

  piesk(dok, v)
  dok.end()
  return baigta
}

function paprastas(dok: Dok, dydis = 9.5): Dok {
  return dok.font(PAPRASTAS).fontSize(dydis).fillColor(JUODA)
}

function paryskintas(dok: Dok, dydis = 9.5): Dok {
  return dok.font(PARYSKINTAS).fontSize(dydis).fillColor(JUODA)
}

function bruksnys(dok: Dok, y: number, spalva = LINIJA): void {
  dok
    .moveTo(PARASTE, y)
    .lineTo(PARASTE + PLOTIS, y)
    .lineWidth(0.5)
    .strokeColor(spalva)
    .stroke()
}

/** Eilučių sąrašas, kur tuščios reikšmės tiesiog nepatenka į tekstą. */
function blokas(dok: Dok, x: number, y: number, plotis: number, eilutes: (string | null)[]): number {
  let dabartinis = y
  for (const e of eilutes) {
    if (!e) continue
    dok.text(e, x, dabartinis, { width: plotis })
    dabartinis = dok.y
  }
  return dabartinis
}

function piesk(dok: Dok, v: SaskaitosVaizdas): void {
  const p = v.pardavejas

  // ── Antraštė ────────────────────────────────────────────────────────────
  paryskintas(dok, 16).text(v.pavadinimas, PARASTE, PARASTE, { width: PLOTIS * 0.6 })
  paprastas(dok, 11).fillColor(PILKA).text(`Serija ir Nr. ${v.numeris}`)

  const desine = PARASTE + PLOTIS * 0.58
  const desinesPlotis = PLOTIS * 0.42
  paprastas(dok, 9.5)
  blokas(dok, desine, PARASTE + 4, desinesPlotis, [
    v.data ? `Išrašymo data: ${v.data}` : null,
    v.terminas ? `Apmokėti iki: ${v.terminas}` : null,
    v.laikotarpis ? `Laikotarpis: ${v.laikotarpis}` : null,
  ])

  let y = Math.max(dok.y, PARASTE + 64) + 14
  bruksnys(dok, y)
  y += 16

  // ── Pardavėjas ir pirkėjas greta ───────────────────────────────────────
  const stulpelioPlotis = PLOTIS / 2 - 12

  paryskintas(dok, 8).fillColor(PILKA).text('PARDAVĖJAS', PARASTE, y)
  paprastas(dok, 9.5)
  const pardavejoApacia = blokas(dok, PARASTE, dok.y + 3, stulpelioPlotis, [
    p.vardas,
    p.kodas ? `Kodas: ${p.kodas}` : null,
    p.pvmKodas ? `PVM kodas: ${p.pvmKodas}` : null,
    p.veiklosPazyma ? `Ind. veiklos pažyma Nr. ${p.veiklosPazyma}` : null,
    p.adresas,
    p.pastas,
    p.telefonas,
  ])

  const pirkejoX = PARASTE + PLOTIS / 2 + 12
  paryskintas(dok, 8).fillColor(PILKA).text('PIRKĖJAS', pirkejoX, y)
  paprastas(dok, 9.5)
  const pirkejoApacia = blokas(dok, pirkejoX, dok.y + 3, stulpelioPlotis, [
    v.pirkejas.vardas,
    v.pirkejas.kodas ? `Kodas: ${v.pirkejas.kodas}` : null,
    v.pirkejas.pvmKodas ? `PVM kodas: ${v.pirkejas.pvmKodas}` : null,
    v.pirkejas.adresas,
    v.pirkejas.pastas,
  ])

  y = Math.max(pardavejoApacia, pirkejoApacia) + 22

  // ── Eilučių lentelė ────────────────────────────────────────────────────
  paryskintas(dok, 8).fillColor(PILKA)
  dok.text('PASLAUGA', PARASTE + STULPELIAI.aprasymas, y)
  dok.text('KIEKIS', PARASTE + STULPELIAI.kiekis, y, { width: 60, align: 'right' })
  dok.text(v.kainosSuPvm ? 'KAINA SU PVM' : 'KAINA', PARASTE + STULPELIAI.kaina, y, {
    width: 80,
    align: 'right',
  })
  dok.text('SUMA', PARASTE + STULPELIAI.suma, y, { width: PLOTIS - STULPELIAI.suma, align: 'right' })

  y = dok.y + 5
  bruksnys(dok, y)
  y += 8

  for (const e of v.eilutes) {
    // Naujas lapas, jei eilutė nebetelpa — antraštė nekartojama sąmoningai:
    // sąskaita už mėnesį į antrą lapą peržengia labai retai.
    if (y > 700) {
      dok.addPage()
      y = PARASTE
    }

    paprastas(dok, 9.5).text(e.aprasymas, PARASTE + STULPELIAI.aprasymas, y, {
      width: STULPELIAI.kiekis - 14,
    })
    const aprasymoApacia = dok.y

    paprastas(dok, 9.5)
    dok.text(`${e.kiekis} ${e.matoVnt}`, PARASTE + STULPELIAI.kiekis, y, {
      width: 60,
      align: 'right',
    })
    dok.text(skaicius(e.kaina), PARASTE + STULPELIAI.kaina, y, { width: 80, align: 'right' })
    dok.text(skaicius(e.suma), PARASTE + STULPELIAI.suma, y, {
      width: PLOTIS - STULPELIAI.suma,
      align: 'right',
    })

    y = aprasymoApacia

    if (e.detales) {
      paprastas(dok, 8).fillColor(PILKA).text(e.detales, PARASTE + STULPELIAI.aprasymas, y + 1, {
        width: STULPELIAI.kiekis - 14,
      })
      y = dok.y
    }

    y += 8
    bruksnys(dok, y - 4, '#f0ece4')
  }

  // ── Sumos ──────────────────────────────────────────────────────────────
  y += 6
  const sumuX = PARASTE + STULPELIAI.kaina - 60
  const etiketesPlotis = 140
  const reiksmesX = PARASTE + STULPELIAI.suma
  const reiksmesPlotis = PLOTIS - STULPELIAI.suma

  const sumosEilute = (etikete: string, reiksme: string, stiprus = false) => {
    const sriftas = stiprus ? paryskintas : paprastas
    sriftas(dok, stiprus ? 11 : 9.5)
    dok.text(etikete, sumuX, y, { width: etiketesPlotis, align: 'right' })
    dok.text(reiksme, reiksmesX, y, { width: reiksmesPlotis, align: 'right' })
    y = dok.y + 3
  }

  sumosEilute('Suma be PVM:', suformatuok(v.sumos.bePvm))
  for (const g of v.sumos.grupes) {
    sumosEilute(`PVM (${g.pvmKodas}, ${g.pvmProc} %):`, suformatuok(g.pvm))
  }

  y += 3
  dok
    .moveTo(sumuX, y)
    .lineTo(PARASTE + PLOTIS, y)
    .lineWidth(0.5)
    .strokeColor(LINIJA)
    .stroke()
  y += 7
  sumosEilute('Mokėti:', suformatuok(v.sumos.isViso), true)

  // ── Apmokėjimas ir pastabos ────────────────────────────────────────────
  y += 18
  if (p.iban) {
    paryskintas(dok, 8).fillColor(PILKA).text('APMOKĖJIMAS', PARASTE, y)
    paprastas(dok, 9.5)
    y = blokas(dok, PARASTE, dok.y + 3, PLOTIS, [
      `Sąskaita: ${p.iban}`,
      p.bankas ? `Bankas: ${p.bankas}` : null,
      `Mokėjimo paskirtis: ${v.numeris}`,
    ])
    y += 12
  }

  if (v.pastaba) {
    paprastas(dok, 8.5).fillColor(PILKA).text(v.pastaba, PARASTE, y, { width: PLOTIS })
    y = dok.y + 12
  }

  if (v.busena === 'juodrastis') {
    // Juodraštį būtina atskirti akimi: jis dar neturi numerio ir apskaitoje
    // neegzistuoja, o atspausdintas atrodo lygiai kaip tikra sąskaita.
    paryskintas(dok, 10).fillColor('#b45309').text('JUODRAŠTIS — dar neišrašyta', PARASTE, y)
  }
}
