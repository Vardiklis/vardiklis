import { figuraSuUzrasais } from './treciokams-matai-vaizdai'
import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 4 klasės temai „Plokščiosios figūros. Plotas“.
 *
 * Geometrijos potemėse be piešinio klausimas neturi turinio: „kuris trikampis
 * bukasis“ arba „ar figūros lygios“ atsakomi tik pažiūrėjus. Todėl visos
 * figūros braižomos tiksliai — bukasis trikampis iš tikrųjų turi buką kampą, o
 * 6 cm kraštinė brėžinyje yra dvigubai ilgesnė už 3 cm.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

/** Vienas centimetras brėžinyje — tas pats mastelis kaip 3 klasės figūrose. */
const CM = 15

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Plokščiųjų figūrų rinkinys ──────────────────────────────────────────────

export type FiguraRusis =
  | 'trikampis'
  | 'kvadratas'
  | 'staciakampis'
  | 'apskritimas'
  | 'penkiakampis'
  | 'sesiakampis'
  | 'rombas'
  | 'trapecija'
  | 'ovalas'

/** Ar figūra turi kampų. Naudojama grupavimo uždaviniams. */
export function suKampais(f: FiguraRusis): boolean {
  return f !== 'apskritimas' && f !== 'ovalas'
}

/** Figūros kraštinių skaičius; apskritimui ir ovalui — 0. */
export function krastiniuSkaicius(f: FiguraRusis): number {
  const lentele: Record<FiguraRusis, number> = {
    trikampis: 3,
    kvadratas: 4,
    staciakampis: 4,
    rombas: 4,
    trapecija: 4,
    penkiakampis: 5,
    sesiakampis: 6,
    apskritimas: 0,
    ovalas: 0,
  }
  return lentele[f]
}

/** Viena figūra `dydis × dydis` langelyje. */
function figuraSvg(f: FiguraRusis, dydis: number): string {
  const c = dydis / 2
  const r = dydis * 0.38
  const uzpildas = `fill="${ORANGE}" fill-opacity="0.18" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"`

  if (f === 'apskritimas') return `<circle cx="${c}" cy="${c}" r="${r}" ${uzpildas}/>`
  if (f === 'ovalas') return `<ellipse cx="${c}" cy="${c}" rx="${r * 1.15}" ry="${r * 0.7}" ${uzpildas}/>`
  if (f === 'kvadratas') {
    const a = dydis * 0.62
    return `<rect x="${c - a / 2}" y="${c - a / 2}" width="${a}" height="${a}" ${uzpildas}/>`
  }
  if (f === 'staciakampis') {
    const w = dydis * 0.78
    const h = dydis * 0.46
    return `<rect x="${c - w / 2}" y="${c - h / 2}" width="${w}" height="${h}" ${uzpildas}/>`
  }
  if (f === 'trikampis') {
    return `<polygon points="${c},${c - r} ${c + r * 0.94},${c + r * 0.72} ${c - r * 0.94},${c + r * 0.72}" ${uzpildas}/>`
  }
  if (f === 'rombas') {
    return `<polygon points="${c},${c - r} ${c + r * 0.72},${c} ${c},${c + r} ${c - r * 0.72},${c}" ${uzpildas}/>`
  }
  if (f === 'trapecija') {
    return `<polygon points="${c - r * 0.5},${c - r * 0.62} ${c + r * 0.5},${c - r * 0.62} ${c + r},${c + r * 0.62} ${c - r},${c + r * 0.62}" ${uzpildas}/>`
  }
  // Taisyklingas daugiakampis — penkiakampis arba šešiakampis.
  const n = krastiniuSkaicius(f)
  const taskai = Array.from({ length: n }, (_, i) => {
    const kampas = (i / n) * 2 * Math.PI - Math.PI / 2
    return `${(c + r * Math.cos(kampas)).toFixed(1)},${(c + r * Math.sin(kampas)).toFixed(1)}`
  })
  return `<polygon points="${taskai.join(' ')}" ${uzpildas}/>`
}

/**
 * Figūrų eilė su raidėmis A, B, C… — pavadinimams susieti ir grupuoti.
 *
 * Pavadinimai po figūromis nerašomi: kaip tik juos mokinys ir turi nustatyti.
 */
export function figuruEile(figuros: readonly FiguraRusis[]): string {
  // Penkiakampį nuo šešiakampio atskiri tik suskaičiavęs viršūnes, tad figūros
  // piešiamos pakankamai didelės, kad viršūnes išvis matytum.
  const dydis = 98
  const tarpas = 12
  const plotis = figuros.length * (dydis + tarpas) + tarpas
  const aukstis = dydis + 30

  let t = ''
  figuros.forEach((f, i) => {
    const x = tarpas + i * (dydis + tarpas)
    t += `<g transform="translate(${x}, 6)">${figuraSvg(f, dydis)}</g>`
    t += txt(x + dydis / 2, dydis + 24, String.fromCharCode(65 + i), 14, INK, 700)
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Trikampiai pagal kampų rūšis ────────────────────────────────────────────

export type KampoRusis = 'statusis' | 'smailusis' | 'bukasis'

/** Viršūnės, kurių kampai iš tikrųjų yra nurodytos rūšies. */
function trikampioTaskai(rusis: KampoRusis): { x: number; y: number }[] {
  if (rusis === 'statusis') return [
    { x: 0, y: 70 },
    { x: 88, y: 70 },
    { x: 0, y: 0 },
  ]
  if (rusis === 'smailusis') return [
    { x: 0, y: 74 },
    { x: 86, y: 74 },
    { x: 43, y: 0 },
  ]
  // Bukasis: viršūnė pastumta už pagrindo vidurio, kad kampas viršuje viršytų 90°.
  return [
    { x: 0, y: 78 },
    { x: 112, y: 78 },
    { x: 26, y: 30 },
  ]
}

/**
 * Vienas trikampis su pažymėtu būdinguoju kampu.
 *
 * Statusis kampas žymimas kvadratėliu, kiti — lankeliu: taip mokinys mato, į
 * kurį kampą žiūrėti, bet pati rūšis lieka nepasakyta.
 */
export function trikampisPagalKampus(rusis: KampoRusis, zymeti = true): string {
  const p = trikampioTaskai(rusis)
  const krastas = 16
  const plotis = Math.max(...p.map((q) => q.x)) + 2 * krastas
  const aukstis = Math.max(...p.map((q) => q.y)) + 2 * krastas
  const v = p.map((q) => ({ x: q.x + krastas, y: q.y + krastas }))

  let t = `<polygon points="${v.map((q) => `${q.x},${q.y}`).join(' ')}" fill="${ORANGE}" fill-opacity="0.15" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`

  if (zymeti) {
    // Būdingasis kampas: statusis ir bukasis — prie savo viršūnės, smailusis —
    // prie bet kurios, nes visi trys smailūs.
    const i = rusis === 'statusis' ? 0 : rusis === 'bukasis' ? 2 : 1
    const a = v[i]
    const b = v[(i + 1) % 3]
    const c = v[(i + 2) % 3]
    const kryptis = (nuo: typeof a, i2: typeof b) => {
      const dx = i2.x - nuo.x
      const dy = i2.y - nuo.y
      const l = Math.hypot(dx, dy) || 1
      return { x: dx / l, y: dy / l }
    }
    const u1 = kryptis(a, b)
    const u2 = kryptis(a, c)
    if (rusis === 'statusis') {
      const d = 13
      t += `<path d="M${a.x + u1.x * d} ${a.y + u1.y * d} L${a.x + (u1.x + u2.x) * d} ${a.y + (u1.y + u2.y) * d} L${a.x + u2.x * d} ${a.y + u2.y * d}" fill="none" stroke="${INK}" stroke-width="1.4"/>`
    } else {
      const r = 20
      t += `<path d="M${(a.x + u1.x * r).toFixed(1)} ${(a.y + u1.y * r).toFixed(1)} A ${r} ${r} 0 0 ${
        u1.x * u2.y - u1.y * u2.x > 0 ? 1 : 0
      } ${(a.x + u2.x * r).toFixed(1)} ${(a.y + u2.y * r).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.4"/>`
    }
  }
  return svgRemas(plotis, aukstis, t)
}

/** Kelių brėžinukų eilė su raidėmis. */
export function brezinukuEileSuRaidemis(brezinukai: readonly string[]): string {
  const vidus = brezinukai.map((b) => {
    const w = Number(b.match(/width="(\d+(?:\.\d+)?)"/)?.[1] ?? 100)
    const h = Number(b.match(/height="(\d+(?:\.\d+)?)"/)?.[1] ?? 100)
    return { svg: b.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''), w, h }
  })
  const tarpas = 16
  const aukstis = Math.max(...vidus.map((v) => v.h)) + 30
  const plotis = vidus.reduce((s, v) => s + v.w + tarpas, tarpas)

  let t = ''
  let x = tarpas
  vidus.forEach((v, i) => {
    t += `<g transform="translate(${x}, 4)">${v.svg}</g>`
    t += txt(x + v.w / 2, aukstis - 8, String.fromCharCode(65 + i), 13, INK, 700)
    x += v.w + tarpas
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Lygios figūros ──────────────────────────────────────────────────────────

export type LygumoAtvejis = 'pasukta' | 'atspindeta' | 'kito-dydzio' | 'kitos-formos'

/**
 * Dvi figūros lygumui palyginti.
 *
 * Uždavinio esmė — kad pasukta figūra lieka lygi, o padidinta nebe. Vien
 * žodžiais to nepaklausi, tad abi figūros braižomos iš tų pačių taškų, o
 * skiriasi tik pertvarkymas.
 */
export function lygumoPora(atvejis: LygumoAtvejis): string {
  const forma = [
    { x: 0, y: 0 },
    { x: 46, y: 0 },
    { x: 46, y: 26 },
    { x: 22, y: 26 },
    { x: 22, y: 48 },
    { x: 0, y: 48 },
  ]
  const dydis = 120
  const plotis = 2 * dydis + 30
  const aukstis = dydis + 30

  const pieskim = (taskai: readonly { x: number; y: number }[], dx: number, raide: string) => {
    const minX = Math.min(...taskai.map((t) => t.x))
    const minY = Math.min(...taskai.map((t) => t.y))
    const w = Math.max(...taskai.map((t) => t.x)) - minX
    const h = Math.max(...taskai.map((t) => t.y)) - minY
    const ox = dx + (dydis - w) / 2 - minX
    const oy = 12 + (dydis - 24 - h) / 2 - minY
    let r = `<polygon points="${taskai
      .map((t) => `${(t.x + ox).toFixed(1)},${(t.y + oy).toFixed(1)}`)
      .join(' ')}" fill="${ORANGE}" fill-opacity="0.18" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`
    r += txt(dx + dydis / 2, aukstis - 8, raide, 13, INK, 700)
    return r
  }

  const antra =
    atvejis === 'pasukta'
      ? forma.map((t) => ({ x: -t.y, y: t.x }))
      : atvejis === 'atspindeta'
        ? forma.map((t) => ({ x: -t.x, y: t.y }))
        : atvejis === 'kito-dydzio'
          ? forma.map((t) => ({ x: t.x * 0.62, y: t.y * 0.62 }))
          : forma.map((t, i) => (i === 3 ? { x: 30, y: 26 } : t))

  return svgRemas(plotis, aukstis, pieskim(forma, 10, 'A') + pieskim(antra, dydis + 20, 'B'))
}

// ── Sudėtinė figūra iš stačiakampių ─────────────────────────────────────────

/**
 * L formos figūra su visomis kraštinėmis, išreikštomis centimetrais.
 *
 * `a × b` — gaubiantis stačiakampis, `c × d` — iškirstas kampas. Užrašomos tik
 * keturios kraštinės: likusias dvi mokinys turi rasti pats, ir kaip tik tai
 * daro uždavinį sudėtinės figūros uždaviniu, o ne dviguba daugyba.
 */
export function Lfigura(a: number, b: number, c: number, d: number, visosKrastines = false): string {
  const taskai = [
    { x: 0, y: 0 },
    { x: a * CM, y: 0 },
    { x: a * CM, y: (b - d) * CM },
    { x: (a - c) * CM, y: (b - d) * CM },
    { x: (a - c) * CM, y: b * CM },
    { x: 0, y: b * CM },
  ]
  const uzrasai = visosKrastines
    ? [`${a} cm`, `${b - d} cm`, `${c} cm`, `${d} cm`, `${a - c} cm`, `${b} cm`]
    : [`${a} cm`, `${b - d} cm`, null, `${d} cm`, null, `${b} cm`]
  return figuraSuUzrasais(taskai, uzrasai)
}

/** Du greta sustatyti stačiakampiai — bendram plotui rasti. */
export function dvieluStaciakampiuFigura(a1: number, b1: number, a2: number, b2: number): string {
  const auks = Math.max(b1, b2)
  const taskai = [
    { x: 0, y: (auks - b1) * CM },
    { x: a1 * CM, y: (auks - b1) * CM },
    { x: a1 * CM, y: (auks - b2) * CM },
    { x: (a1 + a2) * CM, y: (auks - b2) * CM },
    { x: (a1 + a2) * CM, y: auks * CM },
    { x: 0, y: auks * CM },
  ]
  const uzrasai =
    b1 === b2
      ? [`${a1} cm`, null, `${a2} cm`, `${b2} cm`, `${a1 + a2} cm`, `${b1} cm`]
      : [`${a1} cm`, `${Math.abs(b1 - b2)} cm`, `${a2} cm`, `${b2} cm`, null, `${b1} cm`]
  return figuraSuUzrasais(taskai, uzrasai)
}

// ── Patalpos planas ─────────────────────────────────────────────────────────

export type Kambarys = { vardas: string; ilgis: number; plotis: number }

/**
 * Buto planas iš vieno ar dviejų kambarių.
 *
 * Matmenys rašomi metrais prie sienų, kaip tikrame plane; kambarių vardai —
 * viduje. Plotas nerašomas: jį ir reikia apskaičiuoti.
 */
export function patalposPlanas(kambariai: readonly Kambarys[]): string {
  const M = 22
  const krastas = 30
  const bendrasIlgis = kambariai.reduce((s, k) => s + k.ilgis, 0)
  const maksPlotis = Math.max(...kambariai.map((k) => k.plotis))
  const plotis = krastas * 2 + bendrasIlgis * M
  const aukstis = krastas * 2 + maksPlotis * M

  let t = ''
  let x = krastas
  for (const k of kambariai) {
    const h = k.plotis * M
    const y = krastas + (maksPlotis - k.plotis) * M
    t += `<rect x="${x}" y="${y}" width="${k.ilgis * M}" height="${h}" fill="${ORANGE}" fill-opacity="0.12" stroke="${INK}" stroke-width="2"/>`
    t += txt(x + (k.ilgis * M) / 2, y + h / 2 + 4, k.vardas, 12, INK, 600)
    // Ilgis rašomas virš kambario, plotis — jo kairėje.
    t += txt(x + (k.ilgis * M) / 2, y - 8, `${k.ilgis} m`, 11, MUTED, 600)
    t += `<text x="${x - 8}" y="${y + h / 2 + 4}" font-size="11" fill="${MUTED}" font-weight="600" text-anchor="end">${k.plotis} m</text>`
    x += k.ilgis * M
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Figūra langeliuose ──────────────────────────────────────────────────────

/**
 * Stačiakampis languotame lape, kai plotas skaičiuojamas langeliais.
 *
 * Ploto sąvoka prasideda ne nuo formulės, o nuo klausimo „kiek kvadratėlių
 * telpa“. Tinklelis tą klausimą padaro atsakomą.
 */
export function langeliuFigura(a: number, b: number, sudetine?: { c: number; d: number }): string {
  const L = 20
  const krastas = 14
  const stulp = Math.max(a, 10)
  const eil = Math.max(b, 7)
  const plotis = krastas * 2 + stulp * L
  const aukstis = krastas * 2 + eil * L

  let t = ''
  for (let i = 0; i <= stulp; i += 1) {
    t += `<line x1="${krastas + i * L}" y1="${krastas}" x2="${krastas + i * L}" y2="${krastas + eil * L}" stroke="${LINE}" stroke-width="0.8"/>`
  }
  for (let j = 0; j <= eil; j += 1) {
    t += `<line x1="${krastas}" y1="${krastas + j * L}" x2="${krastas + stulp * L}" y2="${krastas + j * L}" stroke="${LINE}" stroke-width="0.8"/>`
  }

  if (sudetine) {
    t += `<path d="M${krastas} ${krastas} h${a * L} v${(b - sudetine.d) * L} h${-sudetine.c * L} v${sudetine.d * L} h${-(a - sudetine.c) * L} Z" fill="${ORANGE}" fill-opacity="0.28" stroke="${INK}" stroke-width="2"/>`
  } else {
    t += `<rect x="${krastas}" y="${krastas}" width="${a * L}" height="${b * L}" fill="${ORANGE}" fill-opacity="0.28" stroke="${INK}" stroke-width="2"/>`
  }
  return svgRemas(plotis, aukstis, t)
}
