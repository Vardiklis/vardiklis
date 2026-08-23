import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 7 klasės temoms.
 *
 * Septintoje klasėje pirmą kartą braižomi skaičių intervalai (su tuščiu ir
 * pilnu tašku), lygiagrečiosios tiesės su kirstine, trikampio aukštinės,
 * pusiaukraštinės bei pusiaukampinės ir apskritimo dalys. Visur, kur
 * uždavinys prašo dydį rasti, brėžinyje jis lieka be užrašo arba pažymėtas
 * klaustuku.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'
const PAPER = 'var(--paper)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Skaičių intervalai ──────────────────────────────────────────────────────

export interface IntervaloGalas {
  reiksme: number
  /** Pilnas taškas žymi „≤“ arba „≥“, tuščias — griežtą nelygybę. */
  itraukiamas: boolean
}

/**
 * Skaičių tiesė su nuspalvintu intervalu.
 *
 * `nuo` arba `iki` gali būti `null` — tada spindulys eina į begalybę ir
 * baigiasi rodykle.
 */
export function intervalas(
  nuo: IntervaloGalas | null,
  iki: IntervaloGalas | null,
  tiesesNuo = -8,
  tiesesIki = 8,
): string {
  const padalu = tiesesIki - tiesesNuo
  const zingsnis = Math.min(40, Math.max(24, 520 / padalu))
  const plotis = padalu * zingsnis + 60
  const aukstis = 82
  const y = 46
  const x = (v: number) => 30 + (v - tiesesNuo) * zingsnis

  let t = `<line x1="18" y1="${y}" x2="${plotis - 18}" y2="${y}" stroke="${INK}" stroke-width="1.8"/>`
  t += `<path d="M${plotis - 18} ${y} l-9 -5 v10 Z" fill="${INK}"/>`

  for (let v = tiesesNuo; v <= tiesesIki; v += 1) {
    const px = x(v)
    const nulis = v === 0
    t += `<line x1="${px}" y1="${y - (nulis ? 8 : 5)}" x2="${px}" y2="${y + (nulis ? 8 : 5)}" stroke="${INK}" stroke-width="${nulis ? 2 : 1.2}"/>`
    t += txt(px, y + 22, String(v), 10, nulis ? INK : MUTED, nulis ? 700 : 500)
  }

  // Nuspalvinta sritis.
  const kaire = nuo ? x(nuo.reiksme) : 22
  const desine = iki ? x(iki.reiksme) : plotis - 22
  t += `<line x1="${kaire}" y1="${y - 9}" x2="${desine}" y2="${y - 9}" stroke="${ORANGE}" stroke-width="4" stroke-linecap="round"/>`
  if (!nuo) t += `<path d="M22 ${y - 9} l9 -5 v10 Z" fill="${ORANGE}"/>`
  if (!iki) t += `<path d="M${plotis - 22} ${y - 9} l-9 -5 v10 Z" fill="${ORANGE}"/>`

  for (const g of [nuo, iki]) {
    if (!g) continue
    t += `<circle cx="${x(g.reiksme)}" cy="${y - 9}" r="5" fill="${g.itraukiamas ? ORANGE : PAPER}" stroke="${INK}" stroke-width="1.6"/>`
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Atvirkštinio proporcingumo grafikas ─────────────────────────────────────

/**
 * Hiperbolė $y = \dfrac{k}{x}$ pirmajame ketvirtyje.
 *
 * Kreivė braižoma iš tikrų taškų, o ne iš laisvai parinkto lanko: mokinys iš
 * jos nuskaito reikšmes, tad ji privalo būti tiksli.
 */
export function hiperbole(k: number, ikiX = 6, zymetiTaska?: number): string {
  const plotis = 320
  const aukstis = 250
  const K = 46
  const maksY = k
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
  t += txt(plotis - 14, aukstis - K - 12, 'x', 12, INK, 700)
  t += txt(K + 18, K - 24, 'y', 12, INK, 700)
  t += txt(K - 10, aukstis - K + 16, '0', 10, MUTED)

  // Kreivė: nuo x, kuriam y dar telpa į lauką, iki ikiX.
  const pradzia = Math.max(k / maksY, 0.6)
  const taskai: string[] = []
  for (let i = 0; i <= 60; i += 1) {
    const xv = pradzia + ((ikiX - pradzia) * i) / 60
    taskai.push(`${px(xv).toFixed(1)},${py(k / xv).toFixed(1)}`)
  }
  t += `<polyline points="${taskai.join(' ')}" fill="none" stroke="${ORANGE}" stroke-width="2.4" stroke-linejoin="round"/>`

  if (zymetiTaska !== undefined) {
    const yv = k / zymetiTaska
    t += `<line x1="${px(zymetiTaska)}" y1="${py(yv)}" x2="${px(zymetiTaska)}" y2="${py(0)}" stroke="${MUTED}" stroke-width="1.2" stroke-dasharray="4 3"/>`
    t += `<line x1="${px(zymetiTaska)}" y1="${py(yv)}" x2="${K}" y2="${py(yv)}" stroke="${MUTED}" stroke-width="1.2" stroke-dasharray="4 3"/>`
    t += `<circle cx="${px(zymetiTaska)}" cy="${py(yv)}" r="4.5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Tiesės ──────────────────────────────────────────────────────────────────

/** Dvi susikertančios tiesės su pažymėtu vienu kampu. */
export function susikertancios(laipsniai: number, zymetas = 1): string {
  const plotis = 280
  const aukstis = 200
  const c = { x: plotis / 2, y: aukstis / 2 }
  const R = 108
  const tsk = (kampas: number, ilgis: number) => ({
    x: c.x + ilgis * Math.cos((-kampas * Math.PI) / 180),
    y: c.y + ilgis * Math.sin((-kampas * Math.PI) / 180),
  })

  let t = ''
  for (const k of [0, laipsniai]) {
    const a = tsk(k, R)
    const b = tsk(k + 180, R)
    t += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${INK}" stroke-width="2"/>`
  }
  const ribos: [number, number][] = [
    [0, laipsniai],
    [laipsniai, 180],
    [180, 180 + laipsniai],
    [180 + laipsniai, 360],
  ]
  for (let i = 0; i < 4; i++) {
    const [nuo, iki] = ribos[i]
    const p = tsk((nuo + iki) / 2, 50)
    if (i === zymetas - 1) {
      const a = tsk(nuo, 28)
      const b = tsk(iki, 28)
      t += `<path d="M${a.x.toFixed(1)} ${a.y.toFixed(1)} A 28 28 0 0 0 ${b.x.toFixed(1)} ${b.y.toFixed(1)}" fill="none" stroke="${ORANGE}" stroke-width="2"/>`
      t += txt(p.x, p.y + 4, `${iki - nuo}°`, 12, ORANGE, 700)
    } else {
      t += txt(p.x, p.y + 4, String(i + 1), 11, MUTED)
    }
  }
  t += `<circle cx="${c.x}" cy="${c.y}" r="3.5" fill="${INK}"/>`
  return svgRemas(plotis, aukstis, t)
}

/**
 * Kelinto numerio kampas kokio dydžio, kai kirstinė su tiesėmis sudaro
 * smailųjį kampą `smailus`.
 *
 * Numeracija: 1–4 viršutinėje sankirtoje, 5–8 apatinėje; abiejose ta pačia
 * tvarka — viršus-dešinė, viršus-kairė, apačia-kairė, apačia-dešinė.
 * Kirstinė krypsta žemyn į dešinę, tad smailusis kampas atsiduria apačioje
 * dešinėje ir kairėje viršuje, t. y. ties lyginiais numeriais.
 */
export function kampoDydis(kampas: number, numeris: number): number {
  const a = ((kampas % 180) + 180) % 180
  const smailus = a > 90 ? 180 - a : a
  return numeris % 2 === 0 ? smailus : 180 - smailus
}

/**
 * Dvi lygiagrečiosios tiesės, perkirstos kirstine.
 *
 * `smailus` — smailusis kampas tarp kirstinės ir tiesių; `zinomas` nurodo,
 * kurio numerio kampas užrašomas laipsniais. Užrašoma būtent to kampo tikroji
 * reikšmė, o ne perduotas skaičius: brėžinys ir uždavinys turi sutapti, kitaip
 * mokinys mokytųsi iš klaidingo paveikslo.
 */
export function lygiagreciosSuKirstine(kampas: number, zinomas = 1): string {
  // Kirstinė visada krypsta žemyn į dešinę: gavus bukąjį kampą ji pakryptų
  // į kitą pusę, ir kampų numeracija nebeatitiktų brėžinio.
  const a = ((kampas % 180) + 180) % 180
  const smailus = a > 90 ? 180 - a : a
  const laipsniai = smailus
  const plotis = 340
  const aukstis = 250
  const y1 = 80
  const y2 = 175
  const kaire = 26
  const desine = plotis - 26

  // Kirstinė eina per abiejų tiesių taškus; nuolydis parenkamas iš kampo.
  const rad = (laipsniai * Math.PI) / 180
  const dx = (y2 - y1) / Math.tan(rad)
  const x1 = plotis / 2 - dx / 2
  const x2 = x1 + dx
  const pratesimas = 46
  const kx1 = x1 - (pratesimas * Math.cos(rad)) / Math.sin(rad)
  const kx2 = x2 + (pratesimas * Math.cos(rad)) / Math.sin(rad)

  let t = ''
  t += `<line x1="${kaire}" y1="${y1}" x2="${desine}" y2="${y1}" stroke="${INK}" stroke-width="2"/>`
  t += `<line x1="${kaire}" y1="${y2}" x2="${desine}" y2="${y2}" stroke="${INK}" stroke-width="2"/>`
  t += `<line x1="${kx1.toFixed(1)}" y1="${y1 - pratesimas}" x2="${kx2.toFixed(1)}" y2="${y2 + pratesimas}" stroke="${INK}" stroke-width="2"/>`
  t += txt(desine - 4, y1 - 10, 'a', 12, INK, 700)
  t += txt(desine - 4, y2 - 10, 'b', 12, INK, 700)

  // Kampų numeriai apie kiekvieną sankirtą.
  const vietos: [number, number][] = [
    [26, -16],
    [-30, -16],
    [-30, 22],
    [26, 22],
  ]
  const sankirtos = [
    { x: x1, y: y1, nuo: 1 },
    { x: x2, y: y2, nuo: 5 },
  ]
  for (const s of sankirtos) {
    for (let i = 0; i < 4; i++) {
      const nr = s.nuo + i
      const [ox, oy] = vietos[i]
      if (nr === zinomas) {
        t += txt(s.x + ox, s.y + oy, `${kampoDydis(smailus, nr)}°`, 12, ORANGE, 700)
      } else {
        t += txt(s.x + ox, s.y + oy, String(nr), 11, MUTED)
      }
    }
    t += `<circle cx="${s.x.toFixed(1)}" cy="${s.y}" r="3" fill="${INK}"/>`
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Trikampio linijos ───────────────────────────────────────────────────────

export type TrikampioLinija = 'aukstine' | 'pusiaukrastine' | 'pusiaukampine'

/**
 * Trikampis su nubrėžta viena iš trijų svarbiųjų linijų.
 *
 * Linija skaičiuojama tiksliai: aukštinė statmena kraštinei, pusiaukraštinė
 * eina į kraštinės vidurio tašką, pusiaukampinė dalija kampą pusiau. Iš
 * brėžinio mokinys turi jas atskirti, tad netiksli linija uždavinį sugadintų.
 */
export function trikampioLinija(kas: TrikampioLinija, plati = false): string {
  const K = 34
  // Viršūnės: A kairėje apačioje, C dešinėje apačioje, B viršuje.
  const A = { x: 0, y: 100 }
  const C = { x: plati ? 190 : 150, y: 100 }
  const B = { x: plati ? 60 : 96, y: 0 }
  const v = [A, C, B].map((p) => ({ x: p.x + K, y: p.y + K }))
  const [a, c, b] = v
  const plotis = Math.max(...v.map((p) => p.x)) + K
  const aukstis = Math.max(...v.map((p) => p.y)) + K

  let t = `<polygon points="${v.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${ORANGE}" fill-opacity="0.14" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`

  let galas = { x: 0, y: 0 }
  if (kas === 'aukstine') {
    // Statmuo iš B į tiesę AC (ji horizontali).
    galas = { x: b.x, y: a.y }
    t += `<line x1="${b.x.toFixed(1)}" y1="${b.y.toFixed(1)}" x2="${galas.x.toFixed(1)}" y2="${galas.y.toFixed(1)}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="6 4"/>`
    // Stačiojo kampo ženklas.
    t += `<path d="M${galas.x - 11} ${galas.y} v-11 h11" fill="none" stroke="${ORANGE}" stroke-width="1.6"/>`
  } else if (kas === 'pusiaukrastine') {
    galas = { x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 }
    t += `<line x1="${b.x.toFixed(1)}" y1="${b.y.toFixed(1)}" x2="${galas.x.toFixed(1)}" y2="${galas.y.toFixed(1)}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="6 4"/>`
    // Lygių atkarpų brūkšneliai.
    for (const [p, q] of [
      [a, galas],
      [galas, c],
    ]) {
      const mx = (p.x + q.x) / 2
      const my = (p.y + q.y) / 2
      t += `<line x1="${mx}" y1="${my - 6}" x2="${mx}" y2="${my + 6}" stroke="${ORANGE}" stroke-width="1.8"/>`
    }
  } else {
    // Pusiaukampinė iš B: dalija kampą B pusiau, tad kerta AC taške,
    // dalijančiame ją santykiu BA : BC.
    const ba = Math.hypot(a.x - b.x, a.y - b.y)
    const bc = Math.hypot(c.x - b.x, c.y - b.y)
    const dalis = ba / (ba + bc)
    galas = { x: a.x + (c.x - a.x) * dalis, y: a.y + (c.y - a.y) * dalis }
    t += `<line x1="${b.x.toFixed(1)}" y1="${b.y.toFixed(1)}" x2="${galas.x.toFixed(1)}" y2="${galas.y.toFixed(1)}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="6 4"/>`
    // Du lygūs kampai prie viršūnės B.
    const kryptis = (p: { x: number; y: number }) => {
      const dx = p.x - b.x
      const dy = p.y - b.y
      const l = Math.hypot(dx, dy) || 1
      return { x: dx / l, y: dy / l }
    }
    for (const [p, q] of [
      [a, galas],
      [galas, c],
    ]) {
      const k1 = kryptis(p)
      const k2 = kryptis(q)
      const p1 = { x: b.x + k1.x * 26, y: b.y + k1.y * 26 }
      const p2 = { x: b.x + k2.x * 26, y: b.y + k2.y * 26 }
      t += `<path d="M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A 26 26 0 0 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" fill="none" stroke="${ORANGE}" stroke-width="1.6"/>`
    }
  }

  t += `<circle cx="${galas.x.toFixed(1)}" cy="${galas.y.toFixed(1)}" r="3" fill="${ORANGE}"/>`
  for (const [p, raide] of [
    [a, 'A'],
    [c, 'C'],
    [b, 'B'],
  ] as const) {
    const cx = (a.x + c.x + b.x) / 3
    const cy = (a.y + c.y + b.y) / 3
    const dx = p.x - cx
    const dy = p.y - cy
    const l = Math.hypot(dx, dy) || 1
    t += txt(p.x + (dx / l) * 15, p.y + (dy / l) * 15 + 4, raide, 12, INK, 700)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Apskritimas ir skritulys ────────────────────────────────────────────────

export interface ApskritimoZymes {
  /** Ar brėžti spindulį su užrašu. */
  spindulys?: string
  /** Ar brėžti skersmenį su užrašu. */
  skersmuo?: string
  /** Lanko dydis laipsniais — nuspalvinamas sektorius. */
  sektorius?: number
  /** Sektoriaus kampo užrašas. */
  kampoUzrasas?: string
  /** Ar nuspalvinti visą skritulį. */
  skritulys?: boolean
}

/** Apskritimas su spinduliu, skersmeniu, lanku arba sektoriumi. */
export function apskritimas(z: ApskritimoZymes = {}): string {
  const dydis = 220
  const c = dydis / 2
  const R = 76
  const tsk = (kampas: number, r: number) => ({
    x: c + r * Math.cos((-kampas * Math.PI) / 180),
    y: c + r * Math.sin((-kampas * Math.PI) / 180),
  })

  let t = ''
  if (z.skritulys) {
    t += `<circle cx="${c}" cy="${c}" r="${R}" fill="${ORANGE}" fill-opacity="0.18" stroke="none"/>`
  }
  if (z.sektorius) {
    const a = tsk(0, R)
    const b = tsk(z.sektorius, R)
    const didelis = z.sektorius > 180 ? 1 : 0
    t += `<path d="M${c} ${c} L${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${R} ${R} 0 ${didelis} 0 ${b.x.toFixed(1)} ${b.y.toFixed(1)} Z" fill="${ORANGE}" fill-opacity="0.3" stroke="${INK}" stroke-width="1.6"/>`
    const vid = tsk(z.sektorius / 2, 34)
    if (z.kampoUzrasas) t += txt(vid.x, vid.y + 4, z.kampoUzrasas, 12, ORANGE, 700)
  }
  t += `<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${INK}" stroke-width="2"/>`

  if (z.skersmuo) {
    const a = tsk(200, R)
    const b = tsk(20, R)
    t += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${INK}" stroke-width="1.8"/>`
    t += txt(c + 30, c + 18, z.skersmuo, 12, INK, 700)
  }
  if (z.spindulys) {
    const p = tsk(55, R)
    t += `<line x1="${c}" y1="${c}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${INK}" stroke-width="1.8"/>`
    const vid = tsk(55, R / 2)
    t += txt(vid.x + 17, vid.y + 15, z.spindulys, 12, INK, 700)
  }
  t += `<circle cx="${c}" cy="${c}" r="3.5" fill="${INK}"/>`
  t += txt(c - 12, c + 15, 'O', 11, INK, 700)
  return svgRemas(dydis, dydis, t)
}

// ── Erdviniai kūnai su matmenimis ───────────────────────────────────────────

/** Stačioji prizmė su pažymėtais matmenimis; pagrindas — trikampis arba keturkampis. */
export function staciojiPrizme(pagrindas: 3 | 4, matai: { a?: string; h?: string } = {}): string {
  const plotis = 260
  const aukstis = 230
  const H = 110
  const virsus = 40
  const apacia = virsus + H

  const taskai =
    pagrindas === 3
      ? [
          { x: 62, y: apacia },
          { x: 172, y: apacia },
          { x: 117, y: apacia - 34 },
        ]
      : [
          { x: 62, y: apacia },
          { x: 162, y: apacia },
          { x: 202, y: apacia - 34 },
          { x: 102, y: apacia - 34 },
        ]
  const virsutiniai = taskai.map((p) => ({ x: p.x, y: p.y - H }))

  const kelias = (t: { x: number; y: number }[]) => t.map((p) => `${p.x},${p.y}`).join(' ')
  let t = ''
  // Galinės briaunos punktyru.
  t += `<polygon points="${kelias(taskai)}" fill="${PAPER}" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="5 4"/>`
  // Šoninės sienos.
  for (let i = 0; i < taskai.length; i++) {
    const j = (i + 1) % taskai.length
    t += `<polygon points="${taskai[i].x},${taskai[i].y} ${taskai[j].x},${taskai[j].y} ${virsutiniai[j].x},${virsutiniai[j].y} ${virsutiniai[i].x},${virsutiniai[i].y}" fill="${ORANGE}" fill-opacity="0.12" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`
  }
  t += `<polygon points="${kelias(virsutiniai)}" fill="${ORANGE}" fill-opacity="0.28" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`

  if (matai.a) t += txt((taskai[0].x + taskai[1].x) / 2, apacia + 18, matai.a, 12, INK, 700)
  if (matai.h) {
    t += `<text x="${taskai[0].x - 12}" y="${apacia - H / 2 + 4}" font-size="12" fill="${INK}" font-weight="700" text-anchor="end">${matai.h}</text>`
  }
  return svgRemas(plotis, aukstis, t)
}

/** Taisyklingoji piramidė su pažymėtais matmenimis. */
export function taisyklingojiPiramide(matai: { a?: string; h?: string } = {}): string {
  const plotis = 240
  const aukstis = 220
  const apacia = 170
  const virsune = { x: 110, y: 34 }
  const pagr = [
    { x: 34, y: apacia },
    { x: 150, y: apacia },
    { x: 190, y: apacia - 30 },
    { x: 74, y: apacia - 30 },
  ]

  let t = ''
  // Pagrindas su paslėptomis briaunomis.
  t += `<polygon points="${pagr.map((p) => `${p.x},${p.y}`).join(' ')}" fill="${ORANGE}" fill-opacity="0.12" stroke="${INK}" stroke-width="1.6"/>`
  t += `<line x1="${pagr[3].x}" y1="${pagr[3].y}" x2="${virsune.x}" y2="${virsune.y}" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="5 4"/>`
  for (const p of [pagr[0], pagr[1], pagr[2]]) {
    t += `<line x1="${p.x}" y1="${p.y}" x2="${virsune.x}" y2="${virsune.y}" stroke="${INK}" stroke-width="1.7"/>`
  }
  // Aukštinė.
  const centras = { x: (pagr[0].x + pagr[2].x) / 2, y: (pagr[0].y + pagr[2].y) / 2 }
  t += `<line x1="${virsune.x}" y1="${virsune.y}" x2="${centras.x}" y2="${centras.y}" stroke="${ORANGE}" stroke-width="1.6" stroke-dasharray="5 4"/>`
  t += `<path d="M${centras.x - 10} ${centras.y} v-10 h10" fill="none" stroke="${ORANGE}" stroke-width="1.4"/>`

  if (matai.a) t += txt((pagr[0].x + pagr[1].x) / 2, apacia + 18, matai.a, 12, INK, 700)
  if (matai.h) t += txt(212, (virsune.y + centras.y) / 2, matai.h, 12, ORANGE, 700)
  return svgRemas(plotis, aukstis, t)
}

/** Ritinys arba kūgis su pažymėtais matmenimis. */
export function ritinysArKugis(kas: 'ritinys' | 'kugis', matai: { r?: string; h?: string } = {}): string {
  const plotis = 220
  const aukstis = 230
  const cx = 100
  const R = 56
  const ry = 18
  const virsus = 40
  const apacia = 180

  let t = ''
  if (kas === 'ritinys') {
    t += `<path d="M${cx - R} ${virsus} v${apacia - virsus} a ${R} ${ry} 0 0 0 ${2 * R} 0 v${-(apacia - virsus)}" fill="${ORANGE}" fill-opacity="0.12" stroke="${INK}" stroke-width="1.8"/>`
    t += `<path d="M${cx - R} ${apacia} a ${R} ${ry} 0 0 1 ${2 * R} 0" fill="none" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="5 4"/>`
    t += `<ellipse cx="${cx}" cy="${virsus}" rx="${R}" ry="${ry}" fill="${ORANGE}" fill-opacity="0.28" stroke="${INK}" stroke-width="1.8"/>`
  } else {
    const virsune = { x: cx, y: virsus - 6 }
    t += `<path d="M${cx - R} ${apacia} L${virsune.x} ${virsune.y} L${cx + R} ${apacia}" fill="${ORANGE}" fill-opacity="0.12" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`
    t += `<path d="M${cx - R} ${apacia} a ${R} ${ry} 0 0 0 ${2 * R} 0" fill="${ORANGE}" fill-opacity="0.2" stroke="${INK}" stroke-width="1.8"/>`
    t += `<path d="M${cx - R} ${apacia} a ${R} ${ry} 0 0 1 ${2 * R} 0" fill="none" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="5 4"/>`
  }

  // Aukštinė ir spindulys.
  const centras = { x: cx, y: apacia }
  t += `<line x1="${cx}" y1="${kas === 'ritinys' ? virsus : virsus - 6}" x2="${cx}" y2="${apacia}" stroke="${ORANGE}" stroke-width="1.5" stroke-dasharray="5 4"/>`
  t += `<line x1="${cx}" y1="${apacia}" x2="${cx + R}" y2="${apacia}" stroke="${ORANGE}" stroke-width="1.5"/>`
  if (matai.h) t += txt(cx - 14, (virsus + apacia) / 2, matai.h, 12, ORANGE, 700)
  if (matai.r) t += txt(centras.x + R / 2, apacia - 10, matai.r, 12, ORANGE, 700)
  return svgRemas(plotis, aukstis, t)
}
