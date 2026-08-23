import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 6 klasės temoms.
 *
 * Šeštoje klasėje pirmą kartą atsiranda neigiami skaičiai ir koordinačių
 * plokštuma, tad skaičių tiesė turi turėti abi puses, o plokštuma — visus
 * keturis ketvirčius. Taškas, kurio koordinates reikia nustatyti, žymimas be
 * užrašo: kitaip brėžinys pats pasakytų atsakymą.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'
const PAPER = 'var(--paper)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Skaičių tiesė su neigiamais skaičiais ───────────────────────────────────

export interface TieseTaskas {
  reiksme: number
  raide?: string
}

/**
 * Skaičių tiesė nuo `nuo` iki `iki` su pažymėta nuline padala.
 *
 * Taškų reikšmės neužrašomos — užrašoma tik raidė. Uždavinys klausia, kokį
 * skaičių žymi taškas, tad skaičius brėžinyje būtų atsakymas.
 */
export function skaiciuTieseNeig(
  nuo: number,
  iki: number,
  taskai: readonly TieseTaskas[] = [],
  zingsnis = 1,
): string {
  const padalu = (iki - nuo) / zingsnis
  const zingsnioPlotis = Math.min(46, Math.max(24, 560 / padalu))
  const plotis = padalu * zingsnioPlotis + 60
  const aukstis = 84
  const y = 50
  const x = (v: number) => 30 + ((v - nuo) / zingsnis) * zingsnioPlotis

  let t = `<line x1="18" y1="${y}" x2="${plotis - 18}" y2="${y}" stroke="${INK}" stroke-width="1.8"/>`
  t += `<path d="M${plotis - 18} ${y} l-9 -5 v10 Z" fill="${INK}"/>`

  for (let v = nuo; v <= iki; v += zingsnis) {
    const px = x(v)
    const nulis = v === 0
    t += `<line x1="${px}" y1="${y - (nulis ? 9 : 6)}" x2="${px}" y2="${y + (nulis ? 9 : 6)}" stroke="${INK}" stroke-width="${nulis ? 2 : 1.3}"/>`
    t += txt(px, y + 24, String(v), 11, nulis ? INK : MUTED, nulis ? 700 : 500)
  }

  for (const p of taskai) {
    const px = x(p.reiksme)
    t += `<circle cx="${px}" cy="${y}" r="4.5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
    if (p.raide) t += txt(px, y - 14, p.raide, 13, INK, 700)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Koordinačių plokštuma ───────────────────────────────────────────────────

export interface Taskas2D {
  x: number
  y: number
  raide?: string
  /** Ar rašyti koordinates greta taško. */
  suKoordinatemis?: boolean
}

/**
 * Koordinačių plokštuma su visais keturiais ketvirčiais.
 *
 * `iki` nurodo, kiek vienetų matyti į kiekvieną pusę nuo pradžios.
 */
export function koordinaciuPlokstuma(
  taskai: readonly Taskas2D[] = [],
  iki = 5,
  atkarpos: readonly [number, number][][] = [],
): string {
  const L = Math.min(30, 300 / (2 * iki))
  const K = 30
  const dydis = 2 * iki * L + 2 * K
  const c = K + iki * L
  const px = (v: number) => c + v * L
  const py = (v: number) => c - v * L

  let t = ''
  // Tinklelis.
  for (let i = -iki; i <= iki; i += 1) {
    t += `<line x1="${px(i)}" y1="${K}" x2="${px(i)}" y2="${dydis - K}" stroke="${LINE}" stroke-width="1"/>`
    t += `<line x1="${K}" y1="${py(i)}" x2="${dydis - K}" y2="${py(i)}" stroke="${LINE}" stroke-width="1"/>`
  }
  // Ašys su rodyklėmis.
  t += `<line x1="${K - 10}" y1="${c}" x2="${dydis - K + 12}" y2="${c}" stroke="${INK}" stroke-width="1.8"/>`
  t += `<path d="M${dydis - K + 12} ${c} l-9 -5 v10 Z" fill="${INK}"/>`
  t += `<line x1="${c}" y1="${dydis - K + 10}" x2="${c}" y2="${K - 12}" stroke="${INK}" stroke-width="1.8"/>`
  t += `<path d="M${c} ${K - 12} l-5 9 h10 Z" fill="${INK}"/>`
  t += txt(dydis - K + 12, c + 18, 'x', 12, INK, 700)
  t += txt(c - 16, K - 8, 'y', 12, INK, 700)
  t += txt(c - 10, c + 15, '0', 11, MUTED)

  // Padalos.
  for (let i = -iki; i <= iki; i += 1) {
    if (i === 0) continue
    t += txt(px(i), c + 15, String(i), 9, MUTED, 500)
    t += txt(c - 14, py(i) + 4, String(i), 9, MUTED, 500)
  }

  for (const a of atkarpos) {
    t += `<polyline points="${a.map(([x, y]) => `${px(x)},${py(y)}`).join(' ')}" fill="none" stroke="${ORANGE}" stroke-width="2" stroke-linejoin="round"/>`
  }

  for (const p of taskai) {
    t += `<circle cx="${px(p.x)}" cy="${py(p.y)}" r="4.5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
    if (p.raide) {
      const uzrasas = p.suKoordinatemis ? `${p.raide}(${p.x}; ${p.y})` : p.raide
      t += txt(px(p.x) + (p.x >= 0 ? 16 : -16), py(p.y) - 9, uzrasas, 12, INK, 700)
    }
  }
  return svgRemas(dydis, dydis, t)
}

// ── Tiesioginio proporcingumo grafikas ──────────────────────────────────────

/**
 * Tiesiogiai proporcingų dydžių grafikas — tiesė per koordinačių pradžią.
 *
 * `zymetiTaska` pažymi vieną tiesės tašką be užrašo: iš jo mokinys nustato
 * proporcingumo koeficientą.
 */
export function proporcingumoGrafikas(
  k: number,
  ikiX: number,
  zymetiTaska?: number,
  asys: { x: string; y: string } = { x: 'x', y: 'y' },
): string {
  const plotis = 320
  const aukstis = 250
  const K = 46
  const maksY = k * ikiX
  // Dešinėje ir viršuje paliekama vietos ašių vardams: anksčiau „x“ gulė ant
  // paskutinio padalos skaičiaus, o „y“ — ant viršutinio.
  const px = (v: number) => K + (v / ikiX) * (plotis - K - 44)
  const py = (v: number) => aukstis - K - (v / maksY) * (aukstis - K - 40)

  let t = ''
  for (let i = 1; i <= ikiX; i += 1) {
    t += `<line x1="${px(i)}" y1="${K - 12}" x2="${px(i)}" y2="${aukstis - K}" stroke="${LINE}" stroke-width="1"/>`
    t += txt(px(i), aukstis - K + 16, String(i), 10, MUTED, 500)
  }
  const zingsnisY = Math.max(1, Math.round(maksY / 5))
  for (let v = zingsnisY; v <= maksY; v += zingsnisY) {
    t += `<line x1="${K}" y1="${py(v)}" x2="${plotis - 20}" y2="${py(v)}" stroke="${LINE}" stroke-width="1"/>`
    t += txt(K - 16, py(v) + 4, String(v), 10, MUTED, 500)
  }

  t += `<line x1="${K}" y1="${aukstis - K}" x2="${plotis - 14}" y2="${aukstis - K}" stroke="${INK}" stroke-width="1.8"/>`
  t += `<path d="M${plotis - 14} ${aukstis - K} l-9 -5 v10 Z" fill="${INK}"/>`
  t += `<line x1="${K}" y1="${aukstis - K}" x2="${K}" y2="${K - 20}" stroke="${INK}" stroke-width="1.8"/>`
  t += `<path d="M${K} ${K - 20} l-5 9 h10 Z" fill="${INK}"/>`
  t += txt(plotis - 14, aukstis - K - 12, asys.x, 12, INK, 700)
  t += txt(K + 18, K - 24, asys.y, 12, INK, 700)
  t += txt(K - 10, aukstis - K + 16, '0', 10, MUTED)

  t += `<line x1="${px(0)}" y1="${py(0)}" x2="${px(ikiX)}" y2="${py(maksY)}" stroke="${ORANGE}" stroke-width="2.4"/>`
  if (zymetiTaska !== undefined) {
    t += `<line x1="${px(zymetiTaska)}" y1="${py(k * zymetiTaska)}" x2="${px(zymetiTaska)}" y2="${py(0)}" stroke="${MUTED}" stroke-width="1.2" stroke-dasharray="4 3"/>`
    t += `<line x1="${px(zymetiTaska)}" y1="${py(k * zymetiTaska)}" x2="${px(0)}" y2="${py(k * zymetiTaska)}" stroke="${MUTED}" stroke-width="1.2" stroke-dasharray="4 3"/>`
    t += `<circle cx="${px(zymetiTaska)}" cy="${py(k * zymetiTaska)}" r="4.5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Duomenų vaizdai ─────────────────────────────────────────────────────────

export interface Eilute {
  vardas: string
  kiek: number
}

/** Dažnių lentelė: reikšmė ir jos dažnis. */
export function daznuLentele(eilutes: readonly Eilute[], slepti = -1): string {
  const stulpelioPlotis = Math.max(74, ...eilutes.map((e) => e.vardas.length * 9 + 18))
  const antrastesPlotis = 96
  const plotis = antrastesPlotis + eilutes.length * stulpelioPlotis + 20
  const aukstis = 88
  const y0 = 22
  const h = 27

  let t = ''
  const langelis = (x: number, y: number, w: number, tekstas: string, antraste: boolean) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${antraste ? ORANGE : PAPER}" fill-opacity="${antraste ? 0.14 : 1}" stroke="${INK}" stroke-width="1.3"/>` +
    txt(x + w / 2, y + 18, tekstas, 12, INK, antraste ? 700 : 500)

  t += langelis(10, y0, antrastesPlotis, 'Reikšmė', true)
  t += langelis(10, y0 + h, antrastesPlotis, 'Dažnis', true)
  eilutes.forEach((e, i) => {
    const x = 10 + antrastesPlotis + i * stulpelioPlotis
    t += langelis(x, y0, stulpelioPlotis, e.vardas, false)
    t += langelis(x, y0 + h, stulpelioPlotis, i === slepti ? '?' : String(e.kiek), false)
  })
  return svgRemas(plotis, aukstis, t)
}

/** Stulpelinė diagrama su padalomis. */
export function stulpelineDiagrama(eilutes: readonly Eilute[], padala = 0): string {
  const maks = Math.max(...eilutes.map((e) => e.kiek))
  const zingsnis = padala || Math.max(1, Math.ceil(maks / 5))
  const virsus = Math.ceil(maks / zingsnis) * zingsnis
  const kaire = 40
  const apacia = 40
  const stulpelis = 46
  const tarpas = 18
  const plotis = kaire + eilutes.length * (stulpelis + tarpas) + 24
  const aukstis = 210
  const nulis = aukstis - apacia
  const auksciai = nulis - 24
  const y = (v: number) => nulis - (v / virsus) * auksciai

  let t = ''
  for (let v = 0; v <= virsus; v += zingsnis) {
    t += `<line x1="${kaire}" y1="${y(v)}" x2="${plotis - 12}" y2="${y(v)}" stroke="${LINE}" stroke-width="1"/>`
    t += txt(kaire - 14, y(v) + 4, String(v), 10, MUTED, 500)
  }
  eilutes.forEach((e, i) => {
    const x = kaire + tarpas / 2 + i * (stulpelis + tarpas)
    t += `<rect x="${x}" y="${y(e.kiek)}" width="${stulpelis}" height="${nulis - y(e.kiek)}" fill="${ORANGE}" fill-opacity="0.5" stroke="${INK}" stroke-width="1.4"/>`
    t += txt(x + stulpelis / 2, aukstis - apacia + 17, e.vardas, 11, INK, 600)
  })
  t += `<line x1="${kaire}" y1="${nulis}" x2="${plotis - 12}" y2="${nulis}" stroke="${INK}" stroke-width="1.8"/>`
  t += `<line x1="${kaire}" y1="${nulis}" x2="${kaire}" y2="${18}" stroke="${INK}" stroke-width="1.8"/>`
  return svgRemas(plotis, aukstis, t)
}

// ── Galimybių medis ir lentelė ──────────────────────────────────────────────

/**
 * Galimybių medis: du bandymo žingsniai.
 *
 * Baigtys prie lapų nerašomos — jas mokinys turi suskaičiuoti pats.
 */
export function galimybiuMedis(
  pirmas: readonly string[],
  antras: readonly string[],
  rodytiBaigtis = false,
): string {
  const lapu = pirmas.length * antras.length
  const aukstis = Math.max(180, lapu * 30 + 40)
  const plotis = 300
  const x0 = 26
  const x1 = 130
  const x2 = 226
  const tarpas = (aukstis - 40) / lapu

  let t = `<circle cx="${x0}" cy="${aukstis / 2}" r="5" fill="${INK}"/>`
  pirmas.forEach((p, i) => {
    const grupe = antras.length
    const yPirmas = 20 + (i * grupe + grupe / 2) * tarpas
    t += `<line x1="${x0}" y1="${aukstis / 2}" x2="${x1}" y2="${yPirmas}" stroke="${INK}" stroke-width="1.5"/>`
    t += `<rect x="${x1 - 20}" y="${yPirmas - 12}" width="40" height="24" rx="5" fill="${ORANGE}" fill-opacity="0.2" stroke="${INK}" stroke-width="1.3"/>`
    t += txt(x1, yPirmas + 4, p, 11, INK, 600)
    antras.forEach((a, j) => {
      const yLapas = 20 + (i * grupe + j + 0.5) * tarpas
      t += `<line x1="${x1 + 20}" y1="${yPirmas}" x2="${x2 - 20}" y2="${yLapas}" stroke="${INK}" stroke-width="1.3"/>`
      t += `<rect x="${x2 - 20}" y="${yLapas - 11}" width="40" height="22" rx="5" fill="${PAPER}" stroke="${INK}" stroke-width="1.2"/>`
      t += txt(x2, yLapas + 4, a, 11, INK, 500)
      if (rodytiBaigtis) t += txt(x2 + 44, yLapas + 4, `${p}${a}`, 10, MUTED, 500)
    })
  })
  return svgRemas(plotis, aukstis, t)
}

/** Galimybių lentelė: eilutės × stulpeliai. */
export function galimybiuLentele(
  eilutes: readonly string[],
  stulpeliai: readonly string[],
  pildyti = false,
): string {
  const L = 40
  const antraste = 46
  const plotis = antraste + stulpeliai.length * L + 20
  const aukstis = antraste + eilutes.length * L + 20
  const x0 = 10
  const y0 = 10

  let t = ''
  const langelis = (x: number, y: number, w: number, h: number, tekstas: string, ats: boolean) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${ats ? ORANGE : PAPER}" fill-opacity="${ats ? 0.14 : 1}" stroke="${INK}" stroke-width="1.3"/>` +
    txt(x + w / 2, y + h / 2 + 4, tekstas, 11, INK, ats ? 700 : 500)

  t += langelis(x0, y0, antraste, antraste, '', true)
  stulpeliai.forEach((s, j) => {
    t += langelis(x0 + antraste + j * L, y0, L, antraste, s, true)
  })
  eilutes.forEach((e, i) => {
    t += langelis(x0, y0 + antraste + i * L, antraste, L, e, true)
    stulpeliai.forEach((s, j) => {
      t += langelis(x0 + antraste + j * L, y0 + antraste + i * L, L, L, pildyti ? `${e}${s}` : '', false)
    })
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Lygūs ir panašūs trikampiai ─────────────────────────────────────────────

export interface TrikampioZymes {
  /** Kraštinių užrašai: a — apatinė, b — kairioji, c — dešinioji. */
  a?: string
  b?: string
  c?: string
  /** Kampų užrašai prie viršūnių A (kairė apačia), B (viršus), C (dešinė apačia). */
  kampasA?: string
  kampasB?: string
  kampasC?: string
  raides?: readonly [string, string, string]
}

function trikampioTaskai(a: number, b: number, c: number) {
  // a — apatinė kraštinė, b — iš kairiosios viršūnės, c — iš dešiniosios.
  const kampas = Math.acos((a * a + b * b - c * c) / (2 * a * b))
  return [
    { x: 0, y: 0 },
    { x: a, y: 0 },
    { x: b * Math.cos(kampas), y: -b * Math.sin(kampas) },
  ]
}

/** Vienas trikampis su pažymėtomis kraštinėmis ir kampais. */
export function trikampisSuZymemis(
  a: number,
  b: number,
  c: number,
  z: TrikampioZymes = {},
  mastelis = 12,
): string {
  if (a + b <= c || a + c <= b || b + c <= a) return ''
  const p = trikampioTaskai(a * mastelis, b * mastelis, c * mastelis)
  const K = 34
  const minY = Math.min(...p.map((q) => q.y))
  const v = p.map((q) => ({ x: q.x + K, y: q.y - minY + K }))
  const plotis = Math.max(...v.map((q) => q.x)) + K
  const aukstis = Math.max(...v.map((q) => q.y)) + K
  const raides = z.raides ?? ['A', 'B', 'C']

  let t = `<polygon points="${v.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}" fill="${ORANGE}" fill-opacity="0.16" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`
  // Kraštinių užrašai — atkarpų vidurio taškuose, pastumti nuo figūros.
  const vidurys = (i: number, j: number) => ({ x: (v[i].x + v[j].x) / 2, y: (v[i].y + v[j].y) / 2 })
  const centras = { x: (v[0].x + v[1].x + v[2].x) / 3, y: (v[0].y + v[1].y + v[2].y) / 3 }
  const uzrasas = (m: { x: number; y: number }, tekstas: string) => {
    const dx = m.x - centras.x
    const dy = m.y - centras.y
    const l = Math.hypot(dx, dy) || 1
    return txt(m.x + (dx / l) * 16, m.y + (dy / l) * 16 + 4, tekstas, 12, INK, 600)
  }
  if (z.a) t += uzrasas(vidurys(0, 1), z.a)
  if (z.b) t += uzrasas(vidurys(0, 2), z.b)
  if (z.c) t += uzrasas(vidurys(1, 2), z.c)

  // Kampų lankeliai ir užrašai.
  const kampai = [z.kampasA, z.kampasC, z.kampasB]
  for (let i = 0; i < 3; i++) {
    const kampoUzrasas = kampai[i]
    if (!kampoUzrasas) continue
    const kiti = [0, 1, 2].filter((x) => x !== i)
    const kryptis = kiti.map((j) => {
      const dx = v[j].x - v[i].x
      const dy = v[j].y - v[i].y
      const l = Math.hypot(dx, dy) || 1
      return { x: dx / l, y: dy / l }
    })
    const vid = { x: (kryptis[0].x + kryptis[1].x) / 2, y: (kryptis[0].y + kryptis[1].y) / 2 }
    const l = Math.hypot(vid.x, vid.y) || 1
    // Lankelio ir užrašo atstumas derinamas prie trikampio dydžio: pastovus
    // 38 px mažame trikampyje nustumdavo abu kampų užrašus į vidurį, kur jie
    // užlipdavo vienas ant kito.
    const kraštiniu = [0, 1, 2].map((j) => Math.hypot(v[j].x - v[(j + 1) % 3].x, v[j].y - v[(j + 1) % 3].y))
    const r = Math.max(13, Math.min(22, Math.min(...kraštiniu) * 0.3))
    const a1 = { x: v[i].x + kryptis[0].x * r, y: v[i].y + kryptis[0].y * r }
    const a2 = { x: v[i].x + kryptis[1].x * r, y: v[i].y + kryptis[1].y * r }
    t += `<path d="M${a1.x.toFixed(1)} ${a1.y.toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 0 ${a2.x.toFixed(1)} ${a2.y.toFixed(1)}" fill="none" stroke="${ORANGE}" stroke-width="1.8"/>`
    t += txt(v[i].x + (vid.x / l) * (r + 16), v[i].y + (vid.y / l) * (r + 16) + 4, kampoUzrasas, 11, ORANGE, 600)
  }

  const virsuniuRaides = [raides[0], raides[1], raides[2]]
  const tvarka = [0, 2, 1]
  for (let i = 0; i < 3; i++) {
    const q = v[tvarka[i]]
    const dx = q.x - centras.x
    const dy = q.y - centras.y
    const l = Math.hypot(dx, dy) || 1
    t += txt(q.x + (dx / l) * 15, q.y + (dy / l) * 15 + 4, virsuniuRaides[i], 12, INK, 700)
  }
  return svgRemas(plotis, aukstis, t)
}

/** Du trikampiai greta — lygumo ar panašumo požymiams. */
export function dvaTrikampiai(
  pirmas: { a: number; b: number; c: number; z?: TrikampioZymes },
  antras: { a: number; b: number; c: number; z?: TrikampioZymes },
  mastelis = 12,
): string {
  const svgai = [
    trikampisSuZymemis(pirmas.a, pirmas.b, pirmas.c, pirmas.z, mastelis),
    trikampisSuZymemis(antras.a, antras.b, antras.c, antras.z ?? { raides: ['D', 'E', 'F'] }, mastelis),
  ]
  if (svgai.some((s) => s === '')) return ''
  const matmenys = svgai.map((s) => {
    const m = s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
    return { w: Number(m?.[1] ?? 0), h: Number(m?.[2] ?? 0) }
  })
  const tarpas = 24
  const plotis = matmenys[0].w + matmenys[1].w + tarpas
  const aukstis = Math.max(matmenys[0].h, matmenys[1].h)
  let t = ''
  let x = 0
  for (let i = 0; i < 2; i++) {
    const vidus = svgai[i].replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
    t += `<g transform="translate(${x}, ${(aukstis - matmenys[i].h) / 2})">${vidus}</g>`
    x += matmenys[i].w + tarpas
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Panašiosios figūros ir mastelis ─────────────────────────────────────────

/** Du stačiakampiai — originalas ir padidinta ar sumažinta kopija. */
export function panasusStaciakampiai(a: number, b: number, k: number): string {
  const mastelis = 14
  const K = 30
  const w1 = a * mastelis
  const h1 = b * mastelis
  const w2 = a * k * mastelis
  const h2 = b * k * mastelis
  const tarpas = 40
  const plotis = K * 2 + w1 + tarpas + w2
  const aukstis = K * 2 + Math.max(h1, h2) + 22

  let t = ''
  const stac = (x: number, y: number, w: number, h: number, ilgis: number, plotisM: number) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${ORANGE}" fill-opacity="0.16" stroke="${INK}" stroke-width="1.8"/>` +
    txt(x + w / 2, y + h + 16, `${ilgis}`, 11, INK, 600) +
    `<text x="${x - 8}" y="${y + h / 2 + 4}" font-size="11" fill="${INK}" font-weight="600" text-anchor="end">${plotisM}</text>`

  const y1 = K + (Math.max(h1, h2) - h1)
  const y2 = K + (Math.max(h1, h2) - h2)
  t += stac(K, y1, w1, h1, a, b)
  t += stac(K + w1 + tarpas, y2, w2, h2, a * k, b * k)
  return svgRemas(plotis, aukstis, t)
}
