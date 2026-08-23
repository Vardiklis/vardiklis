import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 5 klasės simetrijos ir keturkampių potemėms.
 *
 * Keturkampiai brėžiami tikslūs: rombo visos keturios kraštinės tikrai
 * vienodo ilgio, lygiagretainio priešingos kraštinės tikrai lygiagrečios,
 * o trapecijos — tik viena pora. Mokinys iš brėžinio šias savybes ir turi
 * atpažinti, tad brėžinys negali meluoti.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const MUTED = 'var(--muted)'

function txt(x: number, y: number, t: string, dydis = 12, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

function kelias(taskai: readonly { x: number; y: number }[], uzpildyti = true): string {
  return `<polygon points="${taskai.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${
    uzpildyti ? ORANGE : 'none'
  }" fill-opacity="${uzpildyti ? 0.18 : 1}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`
}

export type KeturkampioRusis =
  | 'lygiagretainis'
  | 'rombas'
  | 'trapecija'
  | 'staciakampis'
  | 'kvadratas'

/** Keturkampio viršūnės — kiekviena rūšis tikslių proporcijų. */
function keturkampioTaskai(kas: KeturkampioRusis): { x: number; y: number }[] {
  switch (kas) {
    case 'lygiagretainis':
      // Priešingos kraštinės lygiagrečios ir lygios: viršutinė pastumta 30 į dešinę.
      return [
        { x: 0, y: 76 },
        { x: 100, y: 76 },
        { x: 130, y: 0 },
        { x: 30, y: 0 },
      ]
    case 'rombas': {
      // Visos kraštinės po 75: pusinės įstrižainės 45 ir 60 duoda 75.
      // Siauresnis rombas (30 ir 72) atrodo kaip smaigalys, o ne kaip
      // lygiagretainis su lygiomis kraštinėmis.
      const a = 45
      const b = 60
      return [
        { x: 0, y: b },
        { x: a, y: 0 },
        { x: 2 * a, y: b },
        { x: a, y: 2 * b },
      ]
    }
    case 'trapecija':
      // Lygiagretūs tik pagrindai (viršutinis ir apatinis), šonai nelygiagretūs.
      return [
        { x: 0, y: 76 },
        { x: 140, y: 76 },
        { x: 104, y: 0 },
        { x: 34, y: 0 },
      ]
    case 'staciakampis':
      return [
        { x: 0, y: 0 },
        { x: 130, y: 0 },
        { x: 130, y: 80 },
        { x: 0, y: 80 },
      ]
    case 'kvadratas':
      return [
        { x: 0, y: 0 },
        { x: 96, y: 0 },
        { x: 96, y: 96 },
        { x: 0, y: 96 },
      ]
  }
}

/** Vienas keturkampis. */
export function keturkampis(kas: KeturkampioRusis, raides = false): string {
  const K = 26
  const t0 = keturkampioTaskai(kas)
  const minX = Math.min(...t0.map((p) => p.x))
  const minY = Math.min(...t0.map((p) => p.y))
  const p = t0.map((q) => ({ x: q.x - minX + K, y: q.y - minY + K }))
  const plotis = Math.max(...p.map((q) => q.x)) + K
  const aukstis = Math.max(...p.map((q) => q.y)) + K
  let t = kelias(p)
  if (raides) {
    const vardai = ['A', 'B', 'C', 'D']
    const cx = p.reduce((s, q) => s + q.x, 0) / 4
    const cy = p.reduce((s, q) => s + q.y, 0) / 4
    for (let i = 0; i < 4; i++) {
      const dx = p[i].x - cx
      const dy = p[i].y - cy
      const l = Math.hypot(dx, dy) || 1
      t += txt(p[i].x + (dx / l) * 14, p[i].y + (dy / l) * 14 + 4, vardai[i], 12, INK)
    }
  }
  return svgRemas(plotis, aukstis, t)
}

/** Kelios figūros greta, sunumeruotos — rūšiai atpažinti. */
export function keturkampiuEile(rusys: readonly KeturkampioRusis[]): string {
  const langelis = 170
  const aukstis = 168
  let t = ''
  for (let i = 0; i < rusys.length; i++) {
    const t0 = keturkampioTaskai(rusys[i])
    const minX = Math.min(...t0.map((p) => p.x))
    const minY = Math.min(...t0.map((p) => p.y))
    const w = Math.max(...t0.map((p) => p.x)) - minX
    const h = Math.max(...t0.map((p) => p.y)) - minY
    const dx = i * langelis + (langelis - w) / 2 - minX
    const dy = (aukstis - 34 - h) / 2 - minY
    t += kelias(t0.map((q) => ({ x: q.x + dx, y: q.y + dy })))
    t += txt(i * langelis + langelis / 2, aukstis - 10, String(i + 1))
  }
  return svgRemas(rusys.length * langelis, aukstis, t)
}

/**
 * Figūra su simetrijos ašimis.
 *
 * `rodytiAsis = false` palieka vien figūrą — tada uždavinys gali klausti,
 * kiek ašių ji turi, o brėžinys atsakymo neišduoda.
 */
export function simetrijosAsys(kas: KeturkampioRusis, rodytiAsis = true): string {
  const K = 26
  const t0 = keturkampioTaskai(kas)
  const minX = Math.min(...t0.map((p) => p.x))
  const minY = Math.min(...t0.map((p) => p.y))
  const p = t0.map((q) => ({ x: q.x - minX + K, y: q.y - minY + K }))
  const plotis = Math.max(...p.map((q) => q.x)) + K
  const aukstis = Math.max(...p.map((q) => q.y)) + K
  const cx = p.reduce((s, q) => s + q.x, 0) / 4
  const cy = p.reduce((s, q) => s + q.y, 0) / 4
  let t = kelias(p)

  if (rodytiAsis) {
    const asis = (x1: number, y1: number, x2: number, y2: number) =>
      `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="6 4"/>`
    if (kas === 'staciakampis' || kas === 'kvadratas') {
      t += asis(cx, K - 12, cx, aukstis - K + 12)
      t += asis(K - 12, cy, plotis - K + 12, cy)
    }
    if (kas === 'kvadratas') {
      t += asis(p[0].x - 8, p[0].y - 8, p[2].x + 8, p[2].y + 8)
      t += asis(p[1].x + 8, p[1].y - 8, p[3].x - 8, p[3].y + 8)
    }
    if (kas === 'rombas') {
      t += asis(p[0].x - 8, p[0].y, p[2].x + 8, p[2].y)
      t += asis(p[1].x, p[1].y - 8, p[3].x, p[3].y + 8)
    }
  }
  return svgRemas(plotis, aukstis, t)
}

/**
 * Figūra ir jos vaizdas taško atžvilgiu.
 *
 * Centrinė simetrija — tas pats, kas posūkis 180° apie tašką, tad vaizdas
 * skaičiuojamas tiksliai: kiekvienas taškas atspindimas per centrą.
 */
export function centrineSimetrija(rodytiRezultata = true): string {
  const dydis = 210
  const c = dydis / 2
  const forma = [
    { x: 8, y: 8 },
    { x: 68, y: 8 },
    { x: 68, y: 30 },
    { x: 30, y: 30 },
    { x: 30, y: 58 },
    { x: 8, y: 58 },
  ]
  let t = kelias(forma.map((p) => ({ x: c + p.x, y: c + p.y })))
  if (rodytiRezultata) {
    t += kelias(
      forma.map((p) => ({ x: c - p.x, y: c - p.y })),
      false,
    )
  }
  t += `<line x1="${c - 8}" y1="${c}" x2="${c + 8}" y2="${c}" stroke="${INK}" stroke-width="1.8"/>`
  t += `<line x1="${c}" y1="${c - 8}" x2="${c}" y2="${c + 8}" stroke="${INK}" stroke-width="1.8"/>`
  t += txt(c - 17, c - 13, 'O', 12, INK)
  return svgRemas(dydis, dydis, t)
}
