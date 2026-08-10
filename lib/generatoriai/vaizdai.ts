/**
 * Minimalistiniai brėžiniai nefigūriniams uždaviniams.
 *
 * Braižymo temos savo brėžinius jau turi (`braizymas.ts`), o daiktų
 * paveikslėliai gyvena `ikonos.ts`. Čia — piešiniai toms temoms, kur vaizdas
 * irgi neša prasmę: laikrodis prie laiko, trupmenos juosta prie dalies,
 * rutuliai prie tikimybės. Galioja ta pati taisyklė kaip visur: brėžinys yra
 * sąlygos dalis, o ne papuošimas.
 *
 * SPAUSDINIMO TAISYKLĖ. Spausdinant `--orange` virsta juoda, tokia pat kaip
 * `--ink`, o `--orange-soft` — balta. Todėl dviejų dalykų skirti spalva
 * negalima: skiriama tik **užpildyta ar neužpildyta**.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

/** SVG rėmelis vienodais nustatymais — toks pat kaip `braizymas.ts`. */
export function svgRemas(plotis: number, aukstis: number, turinys: string): string {
  return `<svg viewBox="0 0 ${plotis} ${aukstis}" width="${plotis}" height="${aukstis}" role="img" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto">${turinys}</svg>`
}

function tekstas(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 400): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Laikrodis ───────────────────────────────────────────────────────────────

/**
 * Analoginis laikrodis. Įvestis — minutės nuo vidurnakčio.
 *
 * Valandinė rodyklė juda ir tarp valandų: 8:30 ji stovi tarp 8 ir 9, o ne
 * ties 8. Vaikas, mokantis skaityti laikrodį, kaip tik iš to ir sprendžia.
 */
export function laikrodis(minutesNuoVidurnakcio: number, etikete?: string): string {
  const r = 46
  const krastas = 10
  const dydis = 2 * (r + krastas)
  const aukstis = dydis + (etikete ? 18 : 0)
  const c = r + krastas

  const val = Math.floor(minutesNuoVidurnakcio / 60) % 12
  const min = minutesNuoVidurnakcio % 60
  const kampas = (laipsniai: number) => ((laipsniai - 90) * Math.PI) / 180
  const taskas = (laipsniai: number, ilgis: number) => [
    c + ilgis * Math.cos(kampas(laipsniai)),
    c + ilgis * Math.sin(kampas(laipsniai)),
  ]

  let turinys = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${INK}" stroke-width="2"/>`

  for (let i = 0; i < 12; i += 1) {
    const stambus = i % 3 === 0
    const [x1, y1] = taskas(i * 30, r - (stambus ? 9 : 5))
    const [x2, y2] = taskas(i * 30, r - 2)
    turinys += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stambus ? INK : LINE}" stroke-width="${stambus ? 2 : 1.5}"/>`
  }
  for (const [i, zyme] of [[0, '12'], [3, '3'], [6, '6'], [9, '9']] as const) {
    const [x, y] = taskas(i * 30, r - 20)
    turinys += tekstas(x, y + 4, zyme, 11, MUTED)
  }

  const [vx, vy] = taskas(val * 30 + min * 0.5, r - 22)
  const [mx, my] = taskas(min * 6, r - 10)
  turinys += `<line x1="${c}" y1="${c}" x2="${vx}" y2="${vy}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`
  turinys += `<line x1="${c}" y1="${c}" x2="${mx}" y2="${my}" stroke="${ORANGE}" stroke-width="2.5" stroke-linecap="round"/>`
  turinys += `<circle cx="${c}" cy="${c}" r="3" fill="${INK}"/>`

  if (etikete) turinys += tekstas(c, dydis + 13, etikete, 11, MUTED, 600)

  return svgRemas(dydis, aukstis, turinys)
}

/** Du laikrodžiai greta — pradžia ir pabaiga. */
export function duLaikrodziai(nuo: number, iki: number, nuoZyme: string, ikiZyme: string): string {
  const vienas = 112
  const tarpas = 26
  const perkelk = (svg: string, dx: number) =>
    svg.replace(/^<svg[^>]*>/, `<g transform="translate(${dx},0)">`).replace(/<\/svg>$/, '</g>')
  return svgRemas(
    2 * vienas + tarpas,
    130,
    perkelk(laikrodis(nuo, nuoZyme), 0) +
      `<text x="${vienas + tarpas / 2}" y="66" font-size="18" fill="${MUTED}" text-anchor="middle">→</text>` +
      perkelk(laikrodis(iki, ikiZyme), vienas + tarpas),
  )
}

// ── Trupmenos ir procentai ──────────────────────────────────────────────────

/**
 * Trupmenos juosta: stačiakampis, padalytas į lygias dalis, iš kurių
 * `uzpildyta` nuspalvintos. Užpildymas, o ne spalva, yra signalas — todėl
 * brėžinys skaitomas ir išspausdintas nespalvotai.
 */
export function trupmenosJuosta(vardiklis: number, uzpildyta: number, antraste?: string): string {
  const plotis = Math.min(320, Math.max(180, vardiklis * 26))
  const aukstis = 34
  const krastas = 8
  const dalis = plotis / vardiklis
  const virsus = antraste ? 16 : 0

  let turinys = ''
  for (let i = 0; i < vardiklis; i += 1) {
    const x = krastas + i * dalis
    turinys += `<rect x="${x}" y="${virsus}" width="${dalis}" height="${aukstis}" fill="${
      i < uzpildyta ? ORANGE : 'none'
    }" stroke="${INK}" stroke-width="1.5"/>`
  }
  if (antraste) {
    turinys += `<text x="${krastas}" y="11" font-size="11" fill="${MUTED}" text-anchor="start">${antraste}</text>`
  }

  return svgRemas(plotis + 2 * krastas, aukstis + virsus + 6, turinys)
}

/**
 * Procentų juosta su padalomis kas 10 %. Tinka ir netaisyklingiems
 * procentams (5 %, 35 %) — užpildoma tiksliai, o padalos padeda nuskaityti.
 */
export function procentuJuosta(procentai: number, antraste?: string): string {
  const plotis = 300
  const aukstis = 26
  const krastas = 10
  const virsus = antraste ? 16 : 0
  const uzpildyta = (plotis * Math.min(100, Math.max(0, procentai))) / 100

  let turinys = `<rect x="${krastas}" y="${virsus}" width="${uzpildyta}" height="${aukstis}" fill="${ORANGE}"/>`
  turinys += `<rect x="${krastas}" y="${virsus}" width="${plotis}" height="${aukstis}" fill="none" stroke="${INK}" stroke-width="1.5"/>`
  for (let i = 1; i < 10; i += 1) {
    const x = krastas + (plotis * i) / 10
    turinys += `<line x1="${x}" y1="${virsus + aukstis - 6}" x2="${x}" y2="${virsus + aukstis}" stroke="${INK}" stroke-width="1"/>`
  }
  turinys += `<text x="${krastas}" y="${virsus + aukstis + 13}" font-size="10" fill="${MUTED}" text-anchor="start">0 %</text>`
  turinys += `<text x="${krastas + plotis}" y="${virsus + aukstis + 13}" font-size="10" fill="${MUTED}" text-anchor="end">100 %</text>`
  if (antraste) {
    turinys += `<text x="${krastas}" y="11" font-size="11" fill="${MUTED}" text-anchor="start">${antraste}</text>`
  }

  return svgRemas(plotis + 2 * krastas, aukstis + virsus + 18, turinys)
}

// ── Rutuliai dėžėje ─────────────────────────────────────────────────────────

/**
 * Dėžė su dviejų rūšių rutuliais.
 *
 * Rūšys skiriamos užpildymu, ne spalva, todėl po brėžiniu reikia trumpos
 * legendos — kitaip išspausdintame lape neaišku, kurie yra kurie.
 */
export function rutuliaiDezeje(uzpildytu: number, tusciu: number): string {
  const r = 11
  const tarpas = 6
  const eileje = 6
  const isViso = uzpildytu + tusciu
  const eiluciu = Math.ceil(isViso / eileje)
  const krastas = 12
  const plotis = Math.min(isViso, eileje) * (2 * r + tarpas) + 2 * krastas
  const aukstis = eiluciu * (2 * r + tarpas) + 2 * krastas

  let turinys = `<rect x="1" y="1" width="${plotis - 2}" height="${aukstis - 2}" rx="8" fill="none" stroke="${INK}" stroke-width="2"/>`
  for (let i = 0; i < isViso; i += 1) {
    const cx = krastas + r + (i % eileje) * (2 * r + tarpas)
    const cy = krastas + r + Math.floor(i / eileje) * (2 * r + tarpas)
    turinys += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${
      i < uzpildytu ? ORANGE : 'none'
    }" stroke="${INK}" stroke-width="1.5"/>`
  }

  // Legenda: be jos nespalvotame lape rūšių neatskirtum.
  const ly = aukstis + 15
  let legenda = `<circle cx="${krastas + 6}" cy="${ly - 4}" r="6" fill="${ORANGE}" stroke="${INK}" stroke-width="1.2"/>`
  legenda += `<text x="${krastas + 17}" y="${ly}" font-size="11" fill="${MUTED}">raudoni</text>`
  legenda += `<circle cx="${krastas + 88}" cy="${ly - 4}" r="6" fill="none" stroke="${INK}" stroke-width="1.2"/>`
  legenda += `<text x="${krastas + 99}" y="${ly}" font-size="11" fill="${MUTED}">mėlyni</text>`

  return svgRemas(Math.max(plotis, 170), aukstis + 22, turinys + legenda)
}

// ── Sekos ir gretimi skaičiai ───────────────────────────────────────────────

/**
 * Skaičių langelių eilutė. `null` reiškia tuščią langelį su klaustuku —
 * būtent jį mokinys ir turi užpildyti.
 */
export function langeliuEile(reiksmes: readonly (number | null)[], rodykles = false): string {
  const plotis = 44
  const aukstis = 34
  const tarpas = rodykles ? 22 : 8
  const krastas = 6
  const visasPlotis = reiksmes.length * plotis + (reiksmes.length - 1) * tarpas + 2 * krastas

  let turinys = ''
  reiksmes.forEach((v, i) => {
    const x = krastas + i * (plotis + tarpas)
    turinys += `<rect x="${x}" y="${krastas}" width="${plotis}" height="${aukstis}" rx="4" fill="none" stroke="${INK}" stroke-width="1.5"${
      v === null ? ' stroke-dasharray="5 4"' : ''
    }/>`
    turinys += tekstas(
      x + plotis / 2,
      krastas + aukstis / 2 + 5,
      v === null ? '?' : String(v),
      14,
      INK,
      v === null ? 700 : 400,
    )
    if (rodykles && i < reiksmes.length - 1) {
      const sx = x + plotis + 4
      turinys += `<line x1="${sx}" y1="${krastas + aukstis / 2}" x2="${sx + tarpas - 8}" y2="${krastas + aukstis / 2}" stroke="${MUTED}" stroke-width="1.2"/>`
      turinys += `<path d="M${sx + tarpas - 8} ${krastas + aukstis / 2} l-5 -3 v6 z" fill="${MUTED}"/>`
    }
  })

  return svgRemas(visasPlotis, aukstis + 2 * krastas, turinys)
}

// ── Skyriai: dešimtys ir vienetai ───────────────────────────────────────────

/**
 * Dešimčių ir vienetų blokai. Dešimtis — stulpelis iš dešimties langelių,
 * vienetas — vienas langelis. Tai standartinis pradinių klasių vaizdas,
 * paaiškinantis, kodėl 47 yra „keturios dešimtys ir septyni".
 */
export function skyriuBlokai(desimtys: number, vienetai: number): string {
  const lang = 12
  const stulpTarpas = 6
  const krastas = 10
  const stulpelioPlotis = lang + stulpTarpas
  // Antraštė „dešimtys" yra apie 50 px pločio, tad siauresnė grupė už ją būti
  // negali — kitaip antraštės užlipa viena ant kitos arba nukerpamos krašte.
  const ANTRASTES_PLOTIS = 56
  const grupiuTarpas = 18

  const vienetuStulpeliu = Math.ceil(vienetai / 5)
  const desimciuGrupe = desimtys > 0 ? Math.max(desimtys * stulpelioPlotis, ANTRASTES_PLOTIS) : 0
  const vienetuGrupe = vienetai > 0 ? Math.max(vienetuStulpeliu * stulpelioPlotis, ANTRASTES_PLOTIS) : 0
  const tarpas = desimciuGrupe > 0 && vienetuGrupe > 0 ? grupiuTarpas : 0

  const plotis = krastas * 2 + desimciuGrupe + tarpas + vienetuGrupe
  const aukstis = 10 * lang + krastas + 20

  /** Grupė centruojama savo ruože, kad blokai stovėtų po antrašte. */
  const grupesPradzia = (nuo: number, ruozas: number, turinioPlotis: number) =>
    nuo + (ruozas - turinioPlotis) / 2

  let turinys = ''
  const desimciuX = grupesPradzia(krastas, desimciuGrupe, desimtys * stulpelioPlotis - stulpTarpas)
  for (let d = 0; d < desimtys; d += 1) {
    const x = desimciuX + d * stulpelioPlotis
    for (let i = 0; i < 10; i += 1) {
      turinys += `<rect x="${x}" y="${krastas + i * lang}" width="${lang}" height="${lang}" fill="${ORANGE}" stroke="${INK}" stroke-width="1"/>`
    }
  }

  const vienetuRuozas = krastas + desimciuGrupe + tarpas
  const vienetuX = grupesPradzia(vienetuRuozas, vienetuGrupe, vienetuStulpeliu * stulpelioPlotis - stulpTarpas)
  for (let v = 0; v < vienetai; v += 1) {
    const x = vienetuX + Math.floor(v / 5) * stulpelioPlotis
    const y = krastas + (v % 5) * lang
    turinys += `<rect x="${x}" y="${y}" width="${lang}" height="${lang}" fill="none" stroke="${INK}" stroke-width="1.5"/>`
  }

  const ly = aukstis - 5
  if (desimtys > 0) turinys += tekstas(krastas + desimciuGrupe / 2, ly, 'dešimtys', 10)
  if (vienetai > 0) turinys += tekstas(vienetuRuozas + vienetuGrupe / 2, ly, 'vienetai', 10)

  return svgRemas(plotis, aukstis, turinys)
}
