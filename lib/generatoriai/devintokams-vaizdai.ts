import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 9 klasės temoms.
 *
 * Devintoje klasėje pirmą kartą braižomi laisvos formos funkcijų grafikai
 * (ne tik tiesės), parabolės, apskritimo liestinės, stygos bei įbrėžtiniai
 * kampai ir sklaidos diagramos. Visur galioja ta pati taisyklė: brėžinys
 * pateikia duomenis, bet ieškomo dydžio neužrašo.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'
const PAPER = 'var(--paper)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Koordinačių plokštuma su laisvu grafiku ─────────────────────────────────

export interface GrafikoTaskas {
  x: number
  y: number
  raide?: string
  /** Ar brėžti punktyrus iki ašių — jais nuskaitoma taško reikšmė. */
  punktyrai?: boolean
}

export interface GrafikoZymes {
  taskai?: readonly GrafikoTaskas[]
  /** Kreivės vardas, rašomas prie dešiniojo galo. */
  vardas?: string
  /** Kiek vienetų matyti į kiekvieną pusę. */
  iki?: number
}

/** Bendra ašių ir tinklelio dalis; grąžina piešimo funkcijas. */
function asys(iki: number) {
  const L = Math.min(26, 260 / (2 * iki))
  const K = 30
  const dydis = 2 * iki * L + 2 * K
  const c = K + iki * L
  const px = (v: number) => c + v * L
  const py = (v: number) => c - v * L

  let t = ''
  for (let i = -iki; i <= iki; i += 1) {
    t += `<line x1="${px(i)}" y1="${K}" x2="${px(i)}" y2="${dydis - K}" stroke="${LINE}" stroke-width="1"/>`
    t += `<line x1="${K}" y1="${py(i)}" x2="${dydis - K}" y2="${py(i)}" stroke="${LINE}" stroke-width="1"/>`
  }
  t += `<line x1="${K - 10}" y1="${c}" x2="${dydis - K + 14}" y2="${c}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<path d="M${dydis - K + 14} ${c} l-7 -4 v8 Z" fill="${INK}"/>`
  t += `<line x1="${c}" y1="${dydis - K + 10}" x2="${c}" y2="${K - 14}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<path d="M${c} ${K - 14} l-4 7 h8 Z" fill="${INK}"/>`
  t += txt(dydis - K + 14, c + 18, 'x', 12, INK, 700)
  t += txt(c - 16, K - 10, 'y', 12, INK, 700)
  for (let i = -iki; i <= iki; i += 1) {
    if (i === 0) continue
    t += txt(px(i), c + 14, String(i), 9, MUTED, 500)
    t += txt(c - 13, py(i) + 3, String(i), 9, MUTED, 500)
  }
  t += txt(c - 11, c + 14, '0', 10, MUTED, 600)
  return { L, K, dydis, c, px, py, t }
}

/** Taškų ir punktyrų sluoksnis — naudojamas visų grafikų pabaigoje. */
function taskuSluoksnis(
  taskai: readonly GrafikoTaskas[],
  px: (v: number) => number,
  py: (v: number) => number,
  c: number,
): string {
  let t = ''
  for (const p of taskai) {
    if (p.punktyrai) {
      t += `<line x1="${px(p.x)}" y1="${py(p.y)}" x2="${px(p.x)}" y2="${c}" stroke="${MUTED}" stroke-width="1" stroke-dasharray="4 3"/>`
      t += `<line x1="${px(p.x)}" y1="${py(p.y)}" x2="${c}" y2="${py(p.y)}" stroke="${MUTED}" stroke-width="1" stroke-dasharray="4 3"/>`
    }
  }
  for (const p of taskai) {
    t += `<circle cx="${px(p.x)}" cy="${py(p.y)}" r="4" fill="${ORANGE}" stroke="${PAPER}" stroke-width="1.5"/>`
    if (p.raide) t += txt(px(p.x) + 14, py(p.y) - 9, p.raide, 12, INK, 700)
  }
  return t
}

/**
 * Laisvos formos funkcijos grafikas: kreivė braižoma iš pačios funkcijos
 * reikšmių, tad iš brėžinio matyti tikrosios didėjimo, mažėjimo ir nulių
 * vietos — mokinys jas nuskaito, o ne spėja.
 */
export function funkcijosGrafikas(f: (x: number) => number, z: GrafikoZymes = {}): string {
  const iki = z.iki ?? 5
  const { dydis, c, px, py, t: pagrindas } = asys(iki)
  let t = pagrindas

  const tsk: string[] = []
  for (let i = 0; i <= 400; i += 1) {
    const x = -iki + (2 * iki * i) / 400
    const y = f(x)
    if (!Number.isFinite(y) || Math.abs(y) > iki + 0.5) {
      tsk.push('')
      continue
    }
    tsk.push(`${px(x).toFixed(1)},${py(y).toFixed(1)}`)
  }
  let dabar: string[] = []
  for (const p of tsk) {
    if (p === '') {
      if (dabar.length > 1) t += `<polyline points="${dabar.join(' ')}" fill="none" stroke="${ORANGE}" stroke-width="2.4" stroke-linejoin="round"/>`
      dabar = []
    } else dabar.push(p)
  }
  if (dabar.length > 1) t += `<polyline points="${dabar.join(' ')}" fill="none" stroke="${ORANGE}" stroke-width="2.4" stroke-linejoin="round"/>`

  t += taskuSluoksnis(z.taskai ?? [], px, py, c)
  if (z.vardas) t += txt(dydis - 40, 26, z.vardas, 12, ORANGE, 700)
  return svgRemas(dydis, dydis, t)
}

/**
 * Kelios kreivės vienoje plokštumoje — grafikų transformacijoms ir tiesių
 * tarpusavio padėčiai. Kiekviena gauna savo vardą prie kreivės galo.
 */
export function keliosKreives(
  kreives: readonly { f: (x: number) => number; vardas?: string }[],
  z: GrafikoZymes = {},
): string {
  const iki = z.iki ?? 5
  const { dydis, c, px, py, t: pagrindas } = asys(iki)
  let t = pagrindas
  const tonai = [1, 0.55, 0.3]

  kreives.forEach((k, nr) => {
    const dalys: string[][] = [[]]
    for (let i = 0; i <= 400; i += 1) {
      const x = -iki + (2 * iki * i) / 400
      const y = k.f(x)
      if (!Number.isFinite(y) || Math.abs(y) > iki + 0.5) {
        if (dalys[dalys.length - 1].length) dalys.push([])
        continue
      }
      dalys[dalys.length - 1].push(`${px(x).toFixed(1)},${py(y).toFixed(1)}`)
    }
    const spalva = nr === 0 ? ORANGE : INK
    for (const d of dalys) {
      if (d.length > 1) {
        t += `<polyline points="${d.join(' ')}" fill="none" stroke="${spalva}" stroke-opacity="${tonai[nr] ?? 0.3}" stroke-width="2.4" stroke-linejoin="round"/>`
      }
    }
    if (k.vardas) {
      const paskutine = dalys.filter((d) => d.length).pop()
      if (paskutine) {
        const [x, y] = paskutine[paskutine.length - 1].split(',').map(Number)
        t += txt(Math.min(x, dydis - 24), Math.max(y - 10, 18 + nr * 16), k.vardas, 12, spalva, 700)
      }
    }
  })

  t += taskuSluoksnis(z.taskai ?? [], px, py, c)
  return svgRemas(dydis, dydis, t)
}

// ── Statusis trikampis trigonometrijai ──────────────────────────────────────

export interface TrigZymes {
  /** Statinio prieš kampą α užrašas. */
  priesais?: string
  /** Statinio prie kampo α užrašas. */
  greta?: string
  /** Įžambinės užrašas. */
  izambine?: string
  /** Kampo užrašas prie viršūnės A. */
  kampas?: string
  raides?: readonly [string, string, string]
}

/**
 * Statusis trikampis su pažymėtu smailiuoju kampu α.
 *
 * Kampas α yra prie kairiosios apatinės viršūnės, status kampas — prie
 * dešiniosios apatinės. Kraštinių ilgiai brėžinyje proporcingi tikriesiems,
 * tad matyti, kuris statinis prieš kampą, o kuris prie jo.
 */
export function trigTrikampis(greta: number, priesais: number, z: TrigZymes = {}): string {
  const mastelis = Math.min(18, 150 / Math.max(greta, priesais))
  const K = 40
  const kaire = 44
  const A = greta * mastelis
  const B = priesais * mastelis
  const desine = 62
  const plotis = A + kaire + desine
  const aukstis = B + 2 * K
  const a = { x: kaire, y: aukstis - K }
  const c = { x: kaire + A, y: aukstis - K }
  const b = { x: kaire + A, y: aukstis - K - B }
  const raides = z.raides ?? ['A', 'B', 'C']

  let t = `<polygon points="${a.x},${a.y} ${c.x},${c.y} ${b.x},${b.y}" fill="${ORANGE}" fill-opacity="0.14" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`
  t += `<path d="M${c.x - 13} ${c.y} v-13 h13" fill="none" stroke="${INK}" stroke-width="1.5"/>`

  // Kampo α lankelis prie viršūnės A.
  const r = Math.min(26, A * 0.4)
  const kampas = Math.atan2(B, A)
  t += `<path d="M${(a.x + r).toFixed(1)} ${a.y} A ${r} ${r} 0 0 0 ${(a.x + r * Math.cos(kampas)).toFixed(1)} ${(a.y - r * Math.sin(kampas)).toFixed(1)}" fill="none" stroke="${ORANGE}" stroke-width="1.8"/>`
  const pusiau = kampas / 2
  t += txt(a.x + (r + 24) * Math.cos(pusiau), a.y - (r + 24) * Math.sin(pusiau) + 4, z.kampas ?? 'α', 12, ORANGE, 700)

  if (z.greta) t += txt((a.x + c.x) / 2, a.y + 19, z.greta, 12, INK, 700)
  if (z.priesais) {
    t += `<text x="${c.x + 10}" y="${(c.y + b.y) / 2 + 4}" font-size="12" fill="${INK}" font-weight="700" text-anchor="start">${z.priesais}</text>`
  }
  if (z.izambine) {
    const ilgis = Math.hypot(A, B)
    t += txt((a.x + b.x) / 2 - (B / ilgis) * 18, (a.y + b.y) / 2 - (A / ilgis) * 18 + 4, z.izambine, 12, INK, 700)
  }

  t += txt(a.x - 12, a.y + 6, raides[0], 12, INK, 700)
  t += txt(b.x + 14, b.y - 6, raides[1], 12, INK, 700)
  t += txt(c.x + 14, c.y + 6, raides[2], 12, INK, 700)
  return svgRemas(plotis, aukstis, t)
}

// ── Apskritimo geometrija ───────────────────────────────────────────────────

export interface ApskritimasZymes {
  /** Liestinės lietimosi taško kampas laipsniais (0° — dešinėje). */
  liestine?: number
  /** Ar brėžti spindulį į lietimosi tašką. */
  spindulysILietimosi?: boolean
  /** Stygos galų kampai laipsniais. */
  styga?: readonly [number, number]
  /** Stygos užrašas. */
  stygosUzrasas?: string
  /** Statmuo iš centro į stygą. */
  statmuo?: boolean
  /** Kirstinės kampai — tiesė, kertanti apskritimą dviejuose taškuose. */
  kirstine?: readonly [number, number]
  /** Centrinio kampo galų kampai. */
  centrinis?: readonly [number, number]
  /** Centrinio kampo užrašas. */
  centrinioUzrasas?: string
  /** Įbrėžtinio kampo viršūnės kampas — remiasi į tą pačią stygą. */
  ibreztinio?: number
  /** Įbrėžtinio kampo užrašas. */
  ibreztinioUzrasas?: string
  /** Nuspalvintos išpjovos dydis laipsniais. */
  ispjova?: number
  /** Nuopjova — nuspalvinama tik dalis tarp stygos ir lanko. */
  nuopjova?: readonly [number, number]
  raides?: Record<string, string>
}

/**
 * Apskritimas su liestine, kirstine, stygomis ir kampais.
 *
 * Visi taškai skaičiuojami iš tikrųjų kampų, tad statmuo tikrai statmenas, o
 * liestinė tikrai liečia apskritimą viename taške.
 */
export function apskritimoBrezinys(z: ApskritimasZymes = {}): string {
  const dydis = 250
  const c = dydis / 2
  const R = 82
  const tsk = (kampas: number, r = R) => ({
    x: c + r * Math.cos((-kampas * Math.PI) / 180),
    y: c + r * Math.sin((-kampas * Math.PI) / 180),
  })
  const raides = z.raides ?? {}
  const zyme = (raktas: string, kampas: number, atstumas = R + 16) => {
    const p = tsk(kampas, atstumas)
    return raides[raktas] ? txt(p.x, p.y + 4, raides[raktas], 12, INK, 700) : ''
  }

  let t = ''

  if (z.ispjova) {
    const a = tsk(90)
    const b = tsk(90 - z.ispjova)
    const didelis = z.ispjova > 180 ? 1 : 0
    t += `<path d="M${c} ${c} L${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${R} ${R} 0 ${didelis} 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)} Z" fill="${ORANGE}" fill-opacity="0.28" stroke="${INK}" stroke-width="1.6"/>`
  }
  if (z.nuopjova) {
    const a = tsk(z.nuopjova[0])
    const b = tsk(z.nuopjova[1])
    const dalis = (z.nuopjova[1] - z.nuopjova[0] + 360) % 360
    t += `<path d="M${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${R} ${R} 0 ${dalis > 180 ? 1 : 0} 0 ${b.x.toFixed(1)} ${b.y.toFixed(1)} Z" fill="${ORANGE}" fill-opacity="0.28" stroke="${INK}" stroke-width="1.6"/>`
  }

  t += `<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${INK}" stroke-width="2"/>`

  if (z.centrinis) {
    const a = tsk(z.centrinis[0])
    const b = tsk(z.centrinis[1])
    t += `<line x1="${c}" y1="${c}" x2="${a.x.toFixed(1)}" y2="${a.y.toFixed(1)}" stroke="${INK}" stroke-width="1.8"/>`
    t += `<line x1="${c}" y1="${c}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${INK}" stroke-width="1.8"/>`
    const vidurys = (z.centrinis[0] + z.centrinis[1]) / 2
    const r = 26
    const p1 = tsk(z.centrinis[0], r)
    const p2 = tsk(z.centrinis[1], r)
    const didelis = Math.abs(z.centrinis[0] - z.centrinis[1]) > 180 ? 1 : 0
    t += `<path d="M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${r} ${r} 0 ${didelis} 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" fill="none" stroke="${ORANGE}" stroke-width="1.8"/>`
    if (z.centrinioUzrasas) {
      const u = tsk(vidurys, r + 20)
      t += txt(u.x, u.y + 4, z.centrinioUzrasas, 12, ORANGE, 700)
    }
    t += zyme('a', z.centrinis[0])
    t += zyme('b', z.centrinis[1])
  }

  if (z.ibreztinio !== undefined && z.centrinis) {
    const v = tsk(z.ibreztinio)
    const a = tsk(z.centrinis[0])
    const b = tsk(z.centrinis[1])
    t += `<line x1="${v.x.toFixed(1)}" y1="${v.y.toFixed(1)}" x2="${a.x.toFixed(1)}" y2="${a.y.toFixed(1)}" stroke="${INK}" stroke-width="1.8"/>`
    t += `<line x1="${v.x.toFixed(1)}" y1="${v.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${INK}" stroke-width="1.8"/>`
    // Lankelis prie įbrėžtinio kampo viršūnės.
    const kryptis = [a, b].map((p) => {
      const dx = p.x - v.x
      const dy = p.y - v.y
      const l = Math.hypot(dx, dy) || 1
      return { x: dx / l, y: dy / l }
    })
    const r = 24
    const k1 = { x: v.x + kryptis[0].x * r, y: v.y + kryptis[0].y * r }
    const k2 = { x: v.x + kryptis[1].x * r, y: v.y + kryptis[1].y * r }
    t += `<path d="M${k1.x.toFixed(1)} ${k1.y.toFixed(1)} A ${r} ${r} 0 0 0 ${k2.x.toFixed(1)} ${k2.y.toFixed(1)}" fill="none" stroke="${ORANGE}" stroke-width="1.8"/>`
    if (z.ibreztinioUzrasas) {
      const vid = { x: (kryptis[0].x + kryptis[1].x) / 2, y: (kryptis[0].y + kryptis[1].y) / 2 }
      const l = Math.hypot(vid.x, vid.y) || 1
      t += txt(v.x + (vid.x / l) * (r + 18), v.y + (vid.y / l) * (r + 18) + 4, z.ibreztinioUzrasas, 12, ORANGE, 700)
    }
    t += zyme('c', z.ibreztinio)
  }

  if (z.styga) {
    const a = tsk(z.styga[0])
    const b = tsk(z.styga[1])
    t += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${INK}" stroke-width="2"/>`
    if (z.stygosUzrasas) {
      const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      const dx = m.x - c
      const dy = m.y - c
      const l = Math.hypot(dx, dy) || 1
      t += txt(m.x + (dx / l) * 30, m.y + (dy / l) * 30 + 4, z.stygosUzrasas, 12, INK, 700)
    }
    if (z.statmuo) {
      const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      t += `<line x1="${c}" y1="${c}" x2="${m.x.toFixed(1)}" y2="${m.y.toFixed(1)}" stroke="${ORANGE}" stroke-width="1.8" stroke-dasharray="5 3"/>`
      const dx = (b.x - a.x) / Math.hypot(b.x - a.x, b.y - a.y)
      const dy = (b.y - a.y) / Math.hypot(b.x - a.x, b.y - a.y)
      const nx = (c - m.x) / Math.hypot(c - m.x, c - m.y)
      const ny = (c - m.y) / Math.hypot(c - m.x, c - m.y)
      const s = 11
      t += `<path d="M${(m.x + dx * s).toFixed(1)} ${(m.y + dy * s).toFixed(1)} l${(nx * s).toFixed(1)} ${(ny * s).toFixed(1)} l${(-dx * s).toFixed(1)} ${(-dy * s).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.4"/>`
      t += `<circle cx="${m.x.toFixed(1)}" cy="${m.y.toFixed(1)}" r="3" fill="${INK}"/>`
      if (raides.m) t += txt(m.x - 16, m.y + 15, raides.m, 12, INK, 700)
    }
    t += zyme('a', z.styga[0])
    t += zyme('b', z.styga[1])
  }

  if (z.kirstine) {
    const a = tsk(z.kirstine[0])
    const b = tsk(z.kirstine[1])
    const dx = b.x - a.x
    const dy = b.y - a.y
    const l = Math.hypot(dx, dy)
    const ilg = 34
    t += `<line x1="${(a.x - (dx / l) * ilg).toFixed(1)}" y1="${(a.y - (dy / l) * ilg).toFixed(1)}" x2="${(b.x + (dx / l) * ilg).toFixed(1)}" y2="${(b.y + (dy / l) * ilg).toFixed(1)}" stroke="${INK}" stroke-width="1.8"/>`
    t += `<circle cx="${a.x.toFixed(1)}" cy="${a.y.toFixed(1)}" r="3.5" fill="${ORANGE}"/>`
    t += `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="3.5" fill="${ORANGE}"/>`
    t += zyme('a', z.kirstine[0])
    t += zyme('b', z.kirstine[1])
  }

  if (z.liestine !== undefined) {
    const p = tsk(z.liestine)
    const dx = -Math.sin((-z.liestine * Math.PI) / 180)
    const dy = Math.cos((-z.liestine * Math.PI) / 180)
    const ilg = 76
    t += `<line x1="${(p.x - dx * ilg).toFixed(1)}" y1="${(p.y - dy * ilg).toFixed(1)}" x2="${(p.x + dx * ilg).toFixed(1)}" y2="${(p.y + dy * ilg).toFixed(1)}" stroke="${INK}" stroke-width="2"/>`
    t += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="${ORANGE}"/>`
    if (z.spindulysILietimosi) {
      t += `<line x1="${c}" y1="${c}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${ORANGE}" stroke-width="1.8"/>`
      const rx = (p.x - c) / R
      const ry = (p.y - c) / R
      const s = 11
      t += `<path d="M${(p.x - rx * s).toFixed(1)} ${(p.y - ry * s).toFixed(1)} l${(dx * s).toFixed(1)} ${(dy * s).toFixed(1)} l${(rx * s).toFixed(1)} ${(ry * s).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.4"/>`
    }
    t += zyme('t', z.liestine)
  }

  t += `<circle cx="${c}" cy="${c}" r="3.5" fill="${INK}"/>`
  t += txt(c - 13, c + 15, raides.o ?? 'O', 11, INK, 700)
  return svgRemas(dydis, dydis, t)
}

// ── Sklaidos diagrama ───────────────────────────────────────────────────────

export interface SklaidosZymes {
  /** Ašių pavadinimai. */
  x?: string
  y?: string
  /** Aproksimacijos tiesė y = k·x + b. */
  tiese?: { k: number; b: number }
  /** Didžiausia ašių reikšmė; pagal nutylėjimą randama iš duomenų. */
  maksX?: number
  maksY?: number
}

/**
 * Sklaidos diagrama: kiekvienas taškas — viena duomenų pora.
 *
 * Taškai piešiami iš tikrųjų reikšmių, tad tendencija brėžinyje yra tokia,
 * kokia yra duomenyse — mokinys ją nuskaito, o ne atspėja iš užrašo.
 */
export function sklaidosDiagrama(
  taskai: readonly { x: number; y: number }[],
  z: SklaidosZymes = {},
): string {
  const plotis = 280
  const aukstis = 220
  const kaire = 40
  const apacia = 36
  const maksX = z.maksX ?? Math.ceil(Math.max(...taskai.map((p) => p.x)) / 2) * 2
  const maksY = z.maksY ?? Math.ceil(Math.max(...taskai.map((p) => p.y)) / 5) * 5
  const px = (v: number) => kaire + (v / maksX) * (plotis - kaire - 18)
  const py = (v: number) => aukstis - apacia - (v / maksY) * (aukstis - apacia - 20)

  let t = ''
  for (let i = 0; i <= 5; i += 1) {
    const y = py((maksY * i) / 5)
    t += `<line x1="${kaire}" y1="${y.toFixed(1)}" x2="${plotis - 14}" y2="${y.toFixed(1)}" stroke="${LINE}" stroke-width="1"/>`
    t += `<text x="${kaire - 7}" y="${(y + 3).toFixed(1)}" font-size="9" fill="${MUTED}" text-anchor="end">${Math.round((maksY * i) / 5)}</text>`
  }
  for (let i = 0; i <= maksX; i += Math.max(1, Math.round(maksX / 5))) {
    t += txt(px(i), aukstis - apacia + 15, String(i), 9, MUTED, 500)
  }
  t += `<line x1="${kaire}" y1="${aukstis - apacia}" x2="${plotis - 14}" y2="${aukstis - apacia}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<line x1="${kaire}" y1="${aukstis - apacia}" x2="${kaire}" y2="14" stroke="${INK}" stroke-width="1.6"/>`

  if (z.tiese) {
    const x1 = 0
    const x2 = maksX
    const y1 = z.tiese.k * x1 + z.tiese.b
    const y2 = z.tiese.k * x2 + z.tiese.b
    t += `<line x1="${px(x1).toFixed(1)}" y1="${py(y1).toFixed(1)}" x2="${px(x2).toFixed(1)}" y2="${py(y2).toFixed(1)}" stroke="${ORANGE}" stroke-width="2.2"/>`
  }
  for (const p of taskai) {
    t += `<circle cx="${px(p.x).toFixed(1)}" cy="${py(p.y).toFixed(1)}" r="4" fill="${INK}" fill-opacity="0.75"/>`
  }
  if (z.x) t += txt((plotis + kaire) / 2, aukstis - 8, z.x, 11, MUTED, 600)
  if (z.y) {
    t += `<text x="${kaire - 26}" y="${(aukstis - apacia) / 2}" font-size="11" fill="${MUTED}" font-weight="600" text-anchor="middle" transform="rotate(-90 ${kaire - 26} ${(aukstis - apacia) / 2})">${z.y}</text>`
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Sekos nariai ────────────────────────────────────────────────────────────

/**
 * Sekos nariai eilute su rodyklėmis tarp jų.
 *
 * Nežinomas narys žymimas klaustuku — taip matyti ir taisyklė, ir kurio
 * nario ieškoma.
 */
export function sekosNariai(nariai: readonly (number | null)[], zingsnis?: string): string {
  const langelis = 54
  const plotis = nariai.length * langelis + 24
  const aukstis = zingsnis ? 88 : 62
  const y = zingsnis ? 56 : 38

  let t = ''
  nariai.forEach((n, i) => {
    const x = 12 + i * langelis
    t += `<rect x="${x}" y="${y - 22}" width="${langelis - 12}" height="32" rx="6" fill="${ORANGE}" fill-opacity="${n === null ? 0.08 : 0.2}" stroke="${INK}" stroke-width="1.4" ${n === null ? 'stroke-dasharray="5 3"' : ''}/>`
    t += txt(x + (langelis - 12) / 2, y, n === null ? '?' : String(n), 14, INK, 700)
    if (i < nariai.length - 1) {
      const a = x + langelis - 12
      t += `<path d="M${a + 2} ${y - 6} h7" stroke="${MUTED}" stroke-width="1.4"/>`
      if (zingsnis) {
        t += `<path d="M${a + 2} ${y - 26} q ${5} -12 ${10} 0" fill="none" stroke="${ORANGE}" stroke-width="1.4"/>`
        t += txt(a + 7, y - 32, zingsnis, 10, ORANGE, 700)
      }
    }
  })
  return svgRemas(plotis, aukstis, t)
}
