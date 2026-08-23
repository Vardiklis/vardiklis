import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 10 klasės temoms.
 *
 * Dešimtoje klasėje pirmą kartą reikia vienetinio apskritimo su posūkio
 * kampais, trikampio pusiaukampinės ir pusiaukraštinių, įbrėžto bei apibrėžto
 * apskritimų, įbrėžtinių ir apibrėžtinių keturkampių, ženklų ašies
 * trupmeninėms nelygybėms ir skirstinio formų.
 *
 * Galioja ta pati taisyklė kaip ir žemesnėse klasėse: brėžinys pateikia
 * duomenis, bet ieškomo dydžio neužrašo, o figūros skaičiuojamos iš tikrųjų
 * matmenų — pusiaukampinė tikrai dalija kraštinę teoremos santykiu, įbrėžtas
 * apskritimas tikrai liečia visas tris kraštines, o apibrėžto centras
 * bukajame trikampyje tikrai atsiduria už jo ribų.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'
const PAPER = 'var(--paper)'

type Taskas = { x: number; y: number }

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 600): string {
  return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

/** Vienetinis vektorius nuo `a` link `b`. */
function kryptis(a: Taskas, b: Taskas): Taskas {
  const l = Math.hypot(b.x - a.x, b.y - a.y) || 1
  return { x: (b.x - a.x) / l, y: (b.y - a.y) / l }
}

/** Taškas atkarpoje `a`–`b`, dalijantis ją santykiu `dalis` : (1 − `dalis`). */
function tarp(a: Taskas, b: Taskas, dalis: number): Taskas {
  return { x: a.x + (b.x - a.x) * dalis, y: a.y + (b.y - a.y) * dalis }
}

/** Statmens ženkliukas taške `p` tarp dviejų vienetinių krypčių. */
function statmuoZyme(p: Taskas, u: Taskas, v: Taskas, s = 10): string {
  const a = { x: p.x + u.x * s, y: p.y + u.y * s }
  return `<path d="M${a.x.toFixed(1)} ${a.y.toFixed(1)} l${(v.x * s).toFixed(1)} ${(v.y * s).toFixed(1)} l${(-u.x * s).toFixed(1)} ${(-u.y * s).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.4"/>`
}

/**
 * Sutalpina brėžinį į rėmą.
 *
 * Figūros skaičiuojamos tikrose koordinatėse, kur viršūnė ar apskritimo
 * centras gali atsidurti ir neigiamoje pusėje, tad prieš piešiant jos
 * perkeliamos į rėmą su paraštėmis.
 */
function remas(taskai: readonly Taskas[], K = 34) {
  const minX = Math.min(...taskai.map((p) => p.x))
  const maksX = Math.max(...taskai.map((p) => p.x))
  const minY = Math.min(...taskai.map((p) => p.y))
  const maksY = Math.max(...taskai.map((p) => p.y))
  return {
    plotis: maksX - minX + 2 * K,
    aukstis: maksY - minY + 2 * K,
    p: (q: Taskas): Taskas => ({ x: q.x - minX + K, y: q.y - minY + K }),
  }
}

/** Kraštinės užrašas — atkarpos viduryje, pastumtas nuo figūros centro. */
function krastinesUzrasas(a: Taskas, b: Taskas, centras: Taskas, tekstas: string, atstumas = 16): string {
  const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  const k = kryptis(centras, m)
  return txt(m.x + k.x * atstumas, m.y + k.y * atstumas + 4, tekstas, 12, INK, 700)
}

/**
 * Kraštinės užrašas, pastumtas statmenai nuo pačios kraštinės.
 *
 * Stūmimas centro kryptimi netinka pasvirusioms kraštinėms: ten kryptis nėra
 * statmena, ir užrašas atsiduria ant pačios linijos. Statmuo garantuoja, kad
 * tekstas visada nutols nuo kraštinės vienodai.
 */
function statmenasUzrasas(a: Taskas, b: Taskas, centras: Taskas, tekstas: string, atstumas = 18): string {
  const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  const d = kryptis(a, b)
  let n = { x: -d.y, y: d.x }
  if ((m.x - centras.x) * n.x + (m.y - centras.y) * n.y < 0) n = { x: d.y, y: -d.x }
  return txt(m.x + n.x * atstumas, m.y + n.y * atstumas + 4, tekstas, 12, INK, 700)
}

// ── Vienetinis apskritimas ──────────────────────────────────────────────────

export interface PosukioKampas {
  laipsniai: number
  raide?: string
  /** Ar brėžti punktyrus iki ašių — jais nuskaitomos taško koordinatės. */
  punktyrai?: boolean
}

/**
 * Vienetinis apskritimas su posūkio kampais.
 *
 * Kampas matuojamas nuo teigiamos Ox krypties prieš laikrodžio rodyklę, tad
 * taško padėtis brėžinyje ir yra ta, kurią duoda kampo dydis — ketvirtį
 * mokinys nuskaito, o ne spėja iš užrašo.
 */
export function vienetinisApskritimas(kampai: readonly PosukioKampas[]): string {
  const dydis = 264
  const c = dydis / 2
  const R = 84
  const tsk = (kampas: number, r = R): Taskas => ({
    x: c + r * Math.cos((kampas * Math.PI) / 180),
    y: c - r * Math.sin((kampas * Math.PI) / 180),
  })

  let t = `<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${INK}" stroke-width="2"/>`
  t += `<line x1="${c - R - 28}" y1="${c}" x2="${c + R + 28}" y2="${c}" stroke="${INK}" stroke-width="1.5"/>`
  t += `<path d="M${c + R + 28} ${c} l-7 -4 v8 Z" fill="${INK}"/>`
  t += `<line x1="${c}" y1="${c + R + 28}" x2="${c}" y2="${c - R - 28}" stroke="${INK}" stroke-width="1.5"/>`
  t += `<path d="M${c} ${c - R - 28} l-4 7 h8 Z" fill="${INK}"/>`
  t += txt(c + R + 25, c + 20, 'x', 12, INK, 700)
  t += txt(c - 17, c - R - 22, 'y', 12, INK, 700)
  t += txt(c + R + 2, c + 17, '1', 9, MUTED, 500)
  t += txt(c - R - 3, c + 17, '−1', 9, MUTED, 500)
  t += txt(c - 15, c - R + 4, '1', 9, MUTED, 500)
  t += txt(c - 18, c + R + 4, '−1', 9, MUTED, 500)
  t += txt(c - 11, c + 16, '0', 10, MUTED, 600)

  kampai.forEach((k, i) => {
    const p = tsk(k.laipsniai)
    t += `<line x1="${c}" y1="${c}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${ORANGE}" stroke-width="2"/>`
    const r = 26 + i * 16
    const a0 = tsk(0, r)
    const a1 = tsk(k.laipsniai, r)
    const didelis = k.laipsniai > 180 ? 1 : 0
    t += `<path d="M${a0.x.toFixed(1)} ${a0.y.toFixed(1)} A ${r} ${r} 0 ${didelis} 0 ${a1.x.toFixed(1)} ${a1.y.toFixed(1)}" fill="none" stroke="${ORANGE}" stroke-width="1.6"/>`
    // Užrašas rašomas kampo pusiaukampinės kryptimi, bet tokiu atstumu, kad
    // tarp jo ir galinės kraštinės liktų bent 22 px. Prie siaurų kampų arti
    // lanko tekstas kitaip atsidurtų tiesiai ant pačios kraštinės.
    const pusiau = (Math.max(k.laipsniai, 12) * Math.PI) / 360
    const uzrasoR = Math.min(Math.max(r + 20, 22 / Math.sin(pusiau)), R - 12)
    const u = tsk(k.laipsniai / 2, uzrasoR)
    t += txt(u.x, u.y + 4, `${k.laipsniai}°`, 11, ORANGE, 700)
    if (k.punktyrai) {
      t += `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${p.x.toFixed(1)}" y2="${c}" stroke="${MUTED}" stroke-width="1" stroke-dasharray="4 3"/>`
      t += `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${c}" y2="${p.y.toFixed(1)}" stroke="${MUTED}" stroke-width="1" stroke-dasharray="4 3"/>`
    }
    t += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="${ORANGE}" stroke="${PAPER}" stroke-width="1.5"/>`
    if (k.raide) {
      const u2 = tsk(k.laipsniai, R + 18)
      t += txt(u2.x, u2.y + 4, k.raide, 12, INK, 700)
    }
  })

  t += `<circle cx="${c}" cy="${c}" r="3" fill="${INK}"/>`
  return svgRemas(dydis, dydis, t)
}

// ── Trikampio pusiaukampinė ─────────────────────────────────────────────────

/**
 * Trikampis ABC su kampo A pusiaukampine AD.
 *
 * Taškas D randamas iš pačių kraštinių: BD : DC = AB : AC. Todėl brėžinyje
 * atkarpos tikrai tokio santykio, kokio reikalauja pusiaukampinės teorema.
 */
export function trikampisPusiaukampine(
  ab: number,
  ac: number,
  bc: number,
  z: { ab?: string; ac?: string; bd?: string; dc?: string } = {},
): string {
  if (ab + ac <= bc || ab + bc <= ac || ac + bc <= ab) return ''
  const m = Math.min(26, 200 / Math.max(ab, ac, bc))
  const kampasB = Math.acos((ab * ab + bc * bc - ac * ac) / (2 * ab * bc))
  const B = { x: 0, y: 0 }
  const C = { x: bc * m, y: 0 }
  const A = { x: ab * m * Math.cos(kampasB), y: -ab * m * Math.sin(kampasB) }
  const D = tarp(B, C, ab / (ab + ac))

  const r = remas([A, B, C])
  const [a, b, cc, d] = [A, B, C, D].map(r.p)
  const centras = { x: (a.x + b.x + cc.x) / 3, y: (a.y + b.y + cc.y) / 3 }

  let t = `<polygon points="${[a, b, cc].map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}" fill="${ORANGE}" fill-opacity="0.14" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`
  t += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${d.x.toFixed(1)}" y2="${d.y.toFixed(1)}" stroke="${ORANGE}" stroke-width="2"/>`

  // Du lankeliai su brūkšneliais. Spinduliai skirtingi tyčia: vienodo spindulio
  // lankeliai susilieja į vieną ir atrodo kaip vienas kampas, o brūkšneliai ant
  // jų ir rodo, kad abu puskampiai lygūs.
  const kryptys = [kryptis(a, b), kryptis(a, d), kryptis(a, cc)]
  const spinduliai = [20, 28]
  for (let i = 0; i < 2; i += 1) {
    const rr = spinduliai[i]
    const p1 = { x: a.x + kryptys[i].x * rr, y: a.y + kryptys[i].y * rr }
    const p2 = { x: a.x + kryptys[i + 1].x * rr, y: a.y + kryptys[i + 1].y * rr }
    t += `<path d="M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${rr} ${rr} 0 0 0 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" fill="none" stroke="${ORANGE}" stroke-width="1.6"/>`
    const vid = { x: (kryptys[i].x + kryptys[i + 1].x) / 2, y: (kryptys[i].y + kryptys[i + 1].y) / 2 }
    const l = Math.hypot(vid.x, vid.y) || 1
    const s = { x: a.x + (vid.x / l) * rr, y: a.y + (vid.y / l) * rr }
    const nx = (-vid.y / l) * 6
    const ny = (vid.x / l) * 6
    t += `<line x1="${(s.x - nx).toFixed(1)}" y1="${(s.y - ny).toFixed(1)}" x2="${(s.x + nx).toFixed(1)}" y2="${(s.y + ny).toFixed(1)}" stroke="${ORANGE}" stroke-width="2"/>`
  }

  if (z.ab) t += krastinesUzrasas(a, b, centras, z.ab)
  if (z.ac) t += krastinesUzrasas(a, cc, centras, z.ac)
  if (z.bd) t += txt((b.x + d.x) / 2, b.y + 19, z.bd, 12, INK, 700)
  if (z.dc) t += txt((d.x + cc.x) / 2, cc.y + 19, z.dc, 12, INK, 700)

  t += `<circle cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="3.2" fill="${INK}"/>`
  t += txt(a.x, a.y - 13, 'A', 12, INK, 700)
  t += txt(b.x - 14, b.y + 7, 'B', 12, INK, 700)
  t += txt(cc.x + 14, cc.y + 7, 'C', 12, INK, 700)
  t += txt(d.x, d.y + 33, 'D', 12, ORANGE, 700)
  return svgRemas(r.plotis, r.aukstis, t)
}

// ── Trikampio pusiaukraštinės ───────────────────────────────────────────────

/**
 * Trikampis su pusiaukraštinėmis ir sunkio centru G.
 *
 * G skaičiuojamas kaip viršūnių vidurkis, tad brėžinyje jis tikrai dalija
 * kiekvieną pusiaukraštinę santykiu 2 : 1 — tai galima ir išmatuoti.
 */
export function trikampisPusiaukrastines(
  z: { visos?: boolean; ag?: string; gm?: string; am?: string } = {},
): string {
  const B = { x: 0, y: 0 }
  const C = { x: 210, y: 0 }
  const A = { x: 62, y: -156 }
  const M = tarp(B, C, 0.5)
  const E = tarp(A, C, 0.5)
  const F = tarp(A, B, 0.5)
  const G = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 }

  const r = remas([A, B, C])
  const [a, b, cc, m, e, f, g] = [A, B, C, M, E, F, G].map(r.p)

  let t = `<polygon points="${[a, b, cc].map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}" fill="${ORANGE}" fill-opacity="0.14" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`
  const linija = (p: Taskas, q: Taskas, pagrindine: boolean) =>
    `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" stroke="${pagrindine ? ORANGE : INK}" stroke-opacity="${pagrindine ? 1 : 0.45}" stroke-width="${pagrindine ? 2 : 1.5}"/>`
  t += linija(a, m, true)
  if (z.visos) {
    t += linija(b, e, false)
    t += linija(cc, f, false)
    t += `<circle cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" r="3" fill="${INK}"/>`
    t += `<circle cx="${f.x.toFixed(1)}" cy="${f.y.toFixed(1)}" r="3" fill="${INK}"/>`
    t += txt(e.x + 15, e.y + 4, 'E', 11, MUTED, 700)
    t += txt(f.x - 15, f.y + 4, 'F', 11, MUTED, 700)
  }

  // Vidurio brūkšneliai ant BM ir MC — jie rodo, kad M yra BC vidurys.
  for (const [p, q] of [[b, m], [m, cc]] as const) {
    const s = tarp(p, q, 0.5)
    t += `<line x1="${s.x.toFixed(1)}" y1="${(s.y - 5).toFixed(1)}" x2="${s.x.toFixed(1)}" y2="${(s.y + 5).toFixed(1)}" stroke="${INK}" stroke-width="1.6"/>`
  }

  if (z.ag) t += txt((a.x + g.x) / 2 + 17, (a.y + g.y) / 2 + 4, z.ag, 12, INK, 700)
  if (z.gm) t += txt((g.x + m.x) / 2 + 17, (g.y + m.y) / 2 + 4, z.gm, 12, INK, 700)
  if (z.am) t += txt((a.x + m.x) / 2 + 24, (a.y + m.y) / 2 + 4, z.am, 12, INK, 700)

  t += `<circle cx="${g.x.toFixed(1)}" cy="${g.y.toFixed(1)}" r="4" fill="${ORANGE}" stroke="${PAPER}" stroke-width="1.5"/>`
  t += `<circle cx="${m.x.toFixed(1)}" cy="${m.y.toFixed(1)}" r="3" fill="${INK}"/>`
  t += txt(g.x - 15, g.y - 8, 'G', 12, ORANGE, 700)
  t += txt(a.x, a.y - 13, 'A', 12, INK, 700)
  t += txt(b.x - 14, b.y + 7, 'B', 12, INK, 700)
  t += txt(cc.x + 14, cc.y + 7, 'C', 12, INK, 700)
  t += txt(m.x, m.y + 20, 'M', 12, INK, 700)
  return svgRemas(r.plotis, r.aukstis, t)
}

// ── Įbrėžtas ir apibrėžtas apskritimas ──────────────────────────────────────

/**
 * Trikampis su įbrėžtu arba apibrėžtu apskritimu.
 *
 * Kraštinės perduodamos įprastu žymėjimu: `a` priešais A, `b` priešais B,
 * `c` priešais C. Centrai skaičiuojami iš tų pačių kraštinių, tad įbrėžtas
 * apskritimas tikrai liečia visas tris kraštines, o apibrėžto centras
 * bukajame trikampyje tikrai atsiduria už trikampio ribų.
 */
export function trikampisSuApskritimu(
  kas: 'ibreztas' | 'apibreztas',
  krastines: readonly [number, number, number],
  z: {
    pusiaukampines?: boolean
    statmenys?: boolean
    spindulys?: string
    a?: string
    b?: string
    c?: string
  } = {},
): string {
  const [a, b, c] = krastines
  if (a + b <= c || a + c <= b || b + c <= a) return ''
  const m = Math.min(20, 175 / Math.max(a, b, c))
  const kampasB = Math.acos((a * a + c * c - b * b) / (2 * a * c))
  const B = { x: 0, y: 0 }
  const C = { x: a * m, y: 0 }
  const A = { x: c * m * Math.cos(kampasB), y: -c * m * Math.sin(kampasB) }

  const plotas = Math.abs((C.x - B.x) * (A.y - B.y) - (A.x - B.x) * (C.y - B.y)) / 2
  let centras: Taskas
  let R: number
  if (kas === 'ibreztas') {
    const suma = a + b + c
    centras = {
      x: (a * A.x + b * B.x + c * C.x) / suma,
      y: (a * A.y + b * B.y + c * C.y) / suma,
    }
    R = (2 * plotas) / (suma * m)
  } else {
    const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y))
    const kv = (p: Taskas) => p.x * p.x + p.y * p.y
    centras = {
      x: (kv(A) * (B.y - C.y) + kv(B) * (C.y - A.y) + kv(C) * (A.y - B.y)) / d,
      y: (kv(A) * (C.x - B.x) + kv(B) * (A.x - C.x) + kv(C) * (B.x - A.x)) / d,
    }
    R = Math.hypot(A.x - centras.x, A.y - centras.y)
  }

  const apskritimas = [
    { x: centras.x - R, y: centras.y - R },
    { x: centras.x + R, y: centras.y + R },
  ]
  const r = remas(kas === 'ibreztas' ? [A, B, C] : [A, B, C, ...apskritimas])
  const [va, vb, vc, o] = [A, B, C, centras].map(r.p)
  const vidurys = { x: (va.x + vb.x + vc.x) / 3, y: (va.y + vb.y + vc.y) / 3 }

  let t = `<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${R.toFixed(1)}" fill="${ORANGE}" fill-opacity="${kas === 'ibreztas' ? 0.16 : 0}" stroke="${ORANGE}" stroke-width="1.8"/>`
  t += `<polygon points="${[va, vb, vc].map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`

  if (kas === 'ibreztas') {
    if (z.pusiaukampines) {
      // Pusiaukampinė iš viršūnės kerta priešingą kraštinę prie jos esančių
      // kraštinių santykiu — tik taip visos trys susikerta viename taške.
      const galai: readonly [Taskas, Taskas][] = [
        [va, tarp(vb, vc, c / (b + c))],
        [vb, tarp(va, vc, c / (c + a))],
        [vc, tarp(va, vb, b / (a + b))],
      ]
      for (const [nuo, iki] of galai) {
        t += `<line x1="${nuo.x.toFixed(1)}" y1="${nuo.y.toFixed(1)}" x2="${iki.x.toFixed(1)}" y2="${iki.y.toFixed(1)}" stroke="${MUTED}" stroke-width="1.2" stroke-dasharray="4 3"/>`
      }
    }
    // Statmuo iš centro į BC — jo ilgis ir yra įbrėžto apskritimo spindulys.
    const lietimosi = { x: o.x, y: vb.y }
    t += `<line x1="${o.x.toFixed(1)}" y1="${o.y.toFixed(1)}" x2="${lietimosi.x.toFixed(1)}" y2="${lietimosi.y.toFixed(1)}" stroke="${INK}" stroke-width="1.6"/>`
    t += statmuoZyme(lietimosi, { x: 1, y: 0 }, { x: 0, y: -1 }, 9)
    if (z.spindulys) t += txt(o.x + 15, (o.y + lietimosi.y) / 2 + 4, z.spindulys, 12, INK, 700)
  } else {
    t += `<line x1="${o.x.toFixed(1)}" y1="${o.y.toFixed(1)}" x2="${va.x.toFixed(1)}" y2="${va.y.toFixed(1)}" stroke="${INK}" stroke-width="1.6"/>`
    if (z.spindulys) {
      const s = tarp(o, va, 0.5)
      t += txt(s.x + 14, s.y + 4, z.spindulys, 12, INK, 700)
    }
    if (z.statmenys) {
      for (const [p, q] of [[vb, vc], [va, vb], [va, vc]] as const) {
        const s = tarp(p, q, 0.5)
        t += `<line x1="${s.x.toFixed(1)}" y1="${s.y.toFixed(1)}" x2="${o.x.toFixed(1)}" y2="${o.y.toFixed(1)}" stroke="${MUTED}" stroke-width="1.2" stroke-dasharray="4 3"/>`
        t += statmuoZyme(s, kryptis(p, q), kryptis(s, o), 8)
        t += `<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="2.6" fill="${MUTED}"/>`
      }
    }
  }

  if (z.a) t += krastinesUzrasas(vb, vc, vidurys, z.a)
  if (z.b) t += krastinesUzrasas(va, vc, vidurys, z.b)
  if (z.c) t += krastinesUzrasas(va, vb, vidurys, z.c)

  t += `<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="3.6" fill="${ORANGE}"/>`
  t += txt(o.x - 15, o.y + (kas === 'ibreztas' ? -9 : 17), kas === 'ibreztas' ? 'I' : 'O', 12, ORANGE, 700)
  t += txt(va.x, va.y - 13, 'A', 12, INK, 700)
  t += txt(vb.x - 14, vb.y + 8, 'B', 12, INK, 700)
  t += txt(vc.x + 14, vc.y + 8, 'C', 12, INK, 700)
  return svgRemas(r.plotis, r.aukstis, t)
}

// ── Įbrėžtinis ir apibrėžtinis keturkampiai ─────────────────────────────────

/**
 * Į apskritimą įbrėžtas keturkampis ABCD su nurodyto dydžio kampais A ir B.
 *
 * Viršūnės išdėstomos pagal lankus, kuriuos remiasi įbrėžtiniai kampai, tad
 * kampai brėžinyje yra būtent tokie — vadinasi, ir priešingų kampų suma
 * paveiksle iš tikrųjų lygi 180°.
 */
export function keturkampisApskritime(
  kampasA: number,
  kampasB: number,
  z: { a?: string; b?: string; c?: string; d?: string } = {},
): string {
  const zemiausia = Math.max(0, 2 * kampasA + 2 * kampasB - 360)
  const auksciausia = Math.min(2 * kampasA, 2 * kampasB)
  if (auksciausia <= zemiausia) return ''
  const g3 = (zemiausia + auksciausia) / 2
  const g2 = 2 * kampasA - g3
  const g4 = 2 * kampasB - g3
  const g1 = 360 - g2 - g3 - g4
  if (Math.min(g1, g2, g3, g4) < 14) return ''

  const dydis = 250
  const c = dydis / 2
  const R = 82
  const posukis = 100
  const kampai = [posukis, posukis + g1, posukis + g1 + g2, posukis + g1 + g2 + g3]
  const v = kampai.map((k) => ({
    x: c + R * Math.cos((k * Math.PI) / 180),
    y: c - R * Math.sin((k * Math.PI) / 180),
  }))
  const raides = ['A', 'B', 'C', 'D']
  const uzrasai = [z.a, z.b, z.c, z.d]

  let t = `<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${MUTED}" stroke-width="1.6"/>`
  t += `<polygon points="${v.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}" fill="${ORANGE}" fill-opacity="0.14" stroke="${INK}" stroke-width="1.9" stroke-linejoin="round"/>`

  v.forEach((p, i) => {
    const uzrasas = uzrasai[i]
    if (uzrasas) {
      const k1 = kryptis(p, v[(i + 3) % 4])
      const k2 = kryptis(p, v[(i + 1) % 4])
      const rr = 21
      const p1 = { x: p.x + k1.x * rr, y: p.y + k1.y * rr }
      const p2 = { x: p.x + k2.x * rr, y: p.y + k2.y * rr }
      t += `<path d="M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${rr} ${rr} 0 0 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" fill="none" stroke="${ORANGE}" stroke-width="1.7"/>`
      const vid = { x: (k1.x + k2.x) / 2, y: (k1.y + k2.y) / 2 }
      const l = Math.hypot(vid.x, vid.y) || 1
      t += txt(p.x + (vid.x / l) * (rr + 18), p.y + (vid.y / l) * (rr + 18) + 4, uzrasas, 12, ORANGE, 700)
    }
    const isore = kryptis({ x: c, y: c }, p)
    t += txt(p.x + isore.x * 17, p.y + isore.y * 17 + 4, raides[i], 12, INK, 700)
  })
  return svgRemas(dydis, dydis, t)
}

/**
 * Apie apskritimą apibrėžtas keturkampis ABCD su duotomis kraštinėmis.
 *
 * Kraštinės privalo tenkinti sąlygą AB + CD = BC + DA; iš jų randami liestinių
 * atkarpų ilgiai, o iš sąlygos, kad pusinių kampų suma lygi 180°, — apskritimo
 * spindulys. Todėl figūra brėžinyje tikrai liečia apskritimą visomis keturiomis
 * kraštinėmis, o jų ilgiai sutampa su užrašytais.
 */
export function apibreztinisKeturkampis(
  krastines: readonly [number, number, number, number],
  z: { a?: string; b?: string; c?: string; d?: string } = {},
): string {
  const [ab, bc, cd, da] = krastines
  if (Math.abs(ab + cd - (bc + da)) > 1e-9) return ''
  const zemiausia = Math.max(0, ab - bc)
  const auksciausia = Math.min(ab, ab - bc + cd)
  if (auksciausia <= zemiausia) return ''
  const pirma = (zemiausia + auksciausia) / 2
  const x = [pirma, ab - pirma, bc - ab + pirma, cd - bc + ab - pirma]
  if (Math.min(...x) <= 0) return ''

  let zemiau = 1e-4
  let auksciau = 1e4
  for (let i = 0; i < 90; i += 1) {
    const vid = (zemiau + auksciau) / 2
    if (x.reduce((s, xi) => s + Math.atan(vid / xi), 0) < Math.PI) zemiau = vid
    else auksciau = vid
  }
  const R = (zemiau + auksciau) / 2
  // Kampas centre tarp viršūnės krypties ir lietimosi taško: statmenyje OTV
  // status kampas yra prie T, tad $\mathrm{tg} \angle TOV = \dfrac{x}{R}$.
  // Viršūnės kampas prie V yra kitas — $2\arctan\dfrac{R}{x}$.
  const centriniai = x.map((xi) => Math.atan(xi / R))

  const kampai = [Math.PI / 2]
  for (let i = 1; i < 4; i += 1) kampai.push(kampai[i - 1] + centriniai[i - 1] + centriniai[i])
  const tolis = x.map((xi) => Math.hypot(xi, R))
  const m = Math.min(18, 190 / Math.max(...tolis))
  const v = kampai.map((k, i) => ({
    x: tolis[i] * m * Math.cos(k),
    y: -tolis[i] * m * Math.sin(k),
  }))

  const r = remas([...v, { x: -R * m, y: -R * m }, { x: R * m, y: R * m }], 32)
  const vv = v.map(r.p)
  const o = r.p({ x: 0, y: 0 })
  const raides = ['A', 'B', 'C', 'D']
  const uzrasai = [z.a, z.b, z.c, z.d]

  let t = `<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${(R * m).toFixed(1)}" fill="${ORANGE}" fill-opacity="0.16" stroke="${ORANGE}" stroke-width="1.7"/>`
  t += `<polygon points="${vv.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.9" stroke-linejoin="round"/>`
  vv.forEach((p, i) => {
    const uzrasas = uzrasai[i]
    if (uzrasas) t += statmenasUzrasas(p, vv[(i + 1) % 4], o, uzrasas, 19)
    const isore = kryptis(o, p)
    t += txt(p.x + isore.x * 16, p.y + isore.y * 16 + 4, raides[i], 12, INK, 700)
  })
  t += `<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="3" fill="${ORANGE}"/>`
  return svgRemas(r.plotis, r.aukstis, t)
}

// ── Ženklų ašis nelygybėms ──────────────────────────────────────────────────

export interface ZenkloTaskas {
  reiksme: number
  /** Pilnas taškas — reikšmė tinka, tuščias — netinka (pvz. vardiklio nulis). */
  itraukiamas: boolean
}

/**
 * Skaičių tiesė su kritiniais taškais ir reiškinio ženklais intervaluose.
 *
 * `zenklai` yra vienu ilgesnis už `taskai`: po vieną kiekvienam intervalui,
 * įskaitant kraštinius. Tuščia eilutė palieka vietą mokiniui užpildyti.
 */
export function zenkluAsis(
  taskai: readonly ZenkloTaskas[],
  z: { zenklai?: readonly string[]; nuspalvinti?: readonly boolean[] } = {},
): string {
  const reiksmes = taskai.map((p) => p.reiksme)
  const nuo = Math.floor(Math.min(...reiksmes)) - 2
  const iki = Math.ceil(Math.max(...reiksmes)) + 2
  const padalu = iki - nuo
  const zingsnis = Math.min(44, Math.max(26, 460 / padalu))
  const plotis = padalu * zingsnis + 60
  const aukstis = 96
  const y = 60
  const px = (v: number) => 30 + (v - nuo) * zingsnis

  let t = `<line x1="18" y1="${y}" x2="${plotis - 18}" y2="${y}" stroke="${INK}" stroke-width="1.8"/>`
  t += `<path d="M${plotis - 18} ${y} l-9 -5 v10 Z" fill="${INK}"/>`
  for (let v = nuo; v <= iki; v += 1) {
    const nulis = v === 0
    t += `<line x1="${px(v).toFixed(1)}" y1="${y - (nulis ? 8 : 5)}" x2="${px(v).toFixed(1)}" y2="${y + (nulis ? 8 : 5)}" stroke="${INK}" stroke-width="${nulis ? 2 : 1.2}"/>`
    t += txt(px(v), y + 22, String(v), 10, nulis ? INK : MUTED, nulis ? 700 : 500)
  }

  const ribos = [nuo - 0.6, ...reiksmes, iki + 0.6]
  const zenklai = z.zenklai ?? []
  const nuspalvinti = z.nuspalvinti ?? []
  for (let i = 0; i < ribos.length - 1; i += 1) {
    if (nuspalvinti[i]) {
      const kaire = i === 0 ? 22 : px(ribos[i])
      const desine = i === ribos.length - 2 ? plotis - 22 : px(ribos[i + 1])
      t += `<line x1="${kaire.toFixed(1)}" y1="${y - 11}" x2="${desine.toFixed(1)}" y2="${y - 11}" stroke="${ORANGE}" stroke-width="4" stroke-linecap="round"/>`
    }
    if (zenklai[i]) {
      const vidurys = (Math.max(ribos[i], nuo) + Math.min(ribos[i + 1], iki)) / 2
      t += txt(px(vidurys), y - 22, zenklai[i], 15, INK, 700)
    }
  }

  for (const p of taskai) {
    t += `<circle cx="${px(p.reiksme).toFixed(1)}" cy="${y}" r="5" fill="${p.itraukiamas ? ORANGE : PAPER}" stroke="${INK}" stroke-width="1.7"/>`
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Skirstinių formos ───────────────────────────────────────────────────────

export type SkirstinioForma = 'simetriskas' | 'desine' | 'kaire' | 'dvimodalinis' | 'tolygus'

function tankis(forma: SkirstinioForma, x: number): number {
  if (forma === 'simetriskas') return Math.exp(-((x - 0.5) ** 2) / (2 * 0.15 ** 2))
  if (forma === 'desine') return x <= 0 ? 0 : (x / 0.2) ** 1.8 * Math.exp(-x / 0.13)
  if (forma === 'kaire') return tankis('desine', 1 - x)
  if (forma === 'dvimodalinis') {
    return Math.exp(-((x - 0.28) ** 2) / (2 * 0.085 ** 2)) + Math.exp(-((x - 0.72) ** 2) / (2 * 0.085 ** 2))
  }
  return x > 0.08 && x < 0.92 ? 1 : 0
}

/**
 * Skirstinių formos greta viena kitos.
 *
 * Kreivės braižomos iš formulių, tad dešiniškai asimetriško skirstinio uodega
 * iš tikrųjų tęsiasi į dešinę, o simetriško abi pusės tikrai vienodos.
 */
export function skirstiniuKreives(
  formos: readonly { forma: SkirstinioForma; vardas?: string }[],
): string {
  const langas = 156
  const aukstis = 150
  const apacia = 42
  const plotis = formos.length * langas + 14

  let t = ''
  formos.forEach((f, nr) => {
    const x0 = 7 + nr * langas
    const w = langas - 30
    const h = aukstis - apacia - 18
    const reiksmes: number[] = []
    for (let i = 0; i <= 120; i += 1) reiksmes.push(tankis(f.forma, i / 120))
    const maks = Math.max(...reiksmes) || 1
    const taskai = reiksmes.map(
      (v, i) => `${(x0 + 15 + (i / 120) * w).toFixed(1)},${(aukstis - apacia - (v / maks) * h).toFixed(1)}`,
    )
    t += `<path d="M${x0 + 15} ${aukstis - apacia} L${taskai.join(' L')} L${(x0 + 15 + w).toFixed(1)} ${aukstis - apacia} Z" fill="${ORANGE}" fill-opacity="0.3" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`
    t += `<line x1="${x0 + 8}" y1="${aukstis - apacia}" x2="${x0 + w + 22}" y2="${aukstis - apacia}" stroke="${INK}" stroke-width="1.6"/>`
    if (f.vardas) t += txt(x0 + langas / 2 - 3, aukstis - 14, f.vardas, 12, INK, 700)
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Taškinės diagramos ──────────────────────────────────────────────────────

/**
 * Viena ar kelios taškinės diagramos bendroje skalėje.
 *
 * Bendra skalė būtina: tik joje matyti, kad vieno rinkinio taškai susispietę,
 * o kito išsibarstę, nors abiejų centras tas pats.
 */
export function taskinesDiagramos(
  rinkiniai: readonly { reiksmes: readonly number[]; vardas?: string }[],
): string {
  const visos = rinkiniai.flatMap((r) => r.reiksmes)
  const nuo = Math.min(...visos)
  const iki = Math.max(...visos)
  const zingsnis = Math.min(30, Math.max(14, 440 / Math.max(1, iki - nuo)))
  const kaire = 46
  const plotis = (iki - nuo) * zingsnis + kaire + 30
  const maksKruva = Math.max(
    ...rinkiniai.map((r) => Math.max(...r.reiksmes.map((v) => r.reiksmes.filter((u) => u === v).length))),
  )
  const eiluteAukstis = maksKruva * 13 + 48
  const aukstis = rinkiniai.length * eiluteAukstis + 6
  const px = (v: number) => kaire + (v - nuo) * zingsnis

  let t = ''
  rinkiniai.forEach((r, nr) => {
    const y = (nr + 1) * eiluteAukstis - 28
    t += `<line x1="${kaire - 16}" y1="${y}" x2="${plotis - 12}" y2="${y}" stroke="${INK}" stroke-width="1.6"/>`
    for (let v = nuo; v <= iki; v += 1) {
      t += `<line x1="${px(v).toFixed(1)}" y1="${y}" x2="${px(v).toFixed(1)}" y2="${y + 5}" stroke="${INK}" stroke-width="1.1"/>`
      t += txt(px(v), y + 18, String(v), 9, MUTED, 500)
    }
    const suskaiciuota = new Map<number, number>()
    for (const v of [...r.reiksmes].sort((p, q) => p - q)) {
      const eile = (suskaiciuota.get(v) ?? 0) + 1
      suskaiciuota.set(v, eile)
      t += `<circle cx="${px(v).toFixed(1)}" cy="${y - 8 - (eile - 1) * 13}" r="5" fill="${ORANGE}" fill-opacity="0.8" stroke="${INK}" stroke-width="1.2"/>`
    }
    if (r.vardas) {
      t += `<text x="8" y="${y - 5}" font-size="12" fill="${INK}" font-weight="700" text-anchor="start">${r.vardas}</text>`
    }
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Ilgalaikis santykinis dažnis ────────────────────────────────────────────

/**
 * Santykinio dažnio kitimas didėjant bandymų skaičiui.
 *
 * Bandymų skaičiai dedami vienodais tarpais — tiesinė skalė nuo 10 iki 1000
 * suspaustų visus pirmuosius taškus į vieną vietą. Teorinė tikimybė brėžiama
 * punktyrine tiese, prie kurios ir artėja kreivė.
 */
export function daznioGrafikas(
  taskai: readonly { n: number; daznis: number }[],
  riba: number,
  z: { ribosUzrasas?: string } = {},
): string {
  const plotis = 300
  const aukstis = 212
  const kaire = 44
  const apacia = 42
  const px = (i: number) => kaire + (i / Math.max(1, taskai.length - 1)) * (plotis - kaire - 24)
  const py = (v: number) => aukstis - apacia - v * (aukstis - apacia - 20)

  let t = ''
  for (let i = 0; i <= 4; i += 1) {
    const v = i / 4
    t += `<line x1="${kaire}" y1="${py(v).toFixed(1)}" x2="${plotis - 14}" y2="${py(v).toFixed(1)}" stroke="${LINE}" stroke-width="1"/>`
    t += `<text x="${kaire - 7}" y="${(py(v) + 3).toFixed(1)}" font-size="9" fill="${MUTED}" text-anchor="end">${v.toFixed(2)}</text>`
  }
  t += `<line x1="${kaire}" y1="${py(riba).toFixed(1)}" x2="${plotis - 14}" y2="${py(riba).toFixed(1)}" stroke="${INK}" stroke-width="1.6" stroke-dasharray="6 4"/>`
  if (z.ribosUzrasas) {
    t += `<text x="${plotis - 16}" y="${(py(riba) - 7).toFixed(1)}" font-size="10" fill="${INK}" font-weight="700" text-anchor="end">${z.ribosUzrasas}</text>`
  }
  t += `<polyline points="${taskai.map((p, i) => `${px(i).toFixed(1)},${py(p.daznis).toFixed(1)}`).join(' ')}" fill="none" stroke="${ORANGE}" stroke-width="2.4" stroke-linejoin="round"/>`
  taskai.forEach((p, i) => {
    t += `<circle cx="${px(i).toFixed(1)}" cy="${py(p.daznis).toFixed(1)}" r="3.6" fill="${ORANGE}" stroke="${PAPER}" stroke-width="1.2"/>`
    t += txt(px(i), aukstis - apacia + 16, String(p.n), 9, MUTED, 500)
  })
  t += `<line x1="${kaire}" y1="${aukstis - apacia}" x2="${plotis - 14}" y2="${aukstis - apacia}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<line x1="${kaire}" y1="${aukstis - apacia}" x2="${kaire}" y2="14" stroke="${INK}" stroke-width="1.6"/>`
  t += txt((plotis + kaire) / 2, aukstis - 10, 'bandymų skaičius', 10, MUTED, 600)
  return svgRemas(plotis, aukstis, t)
}
