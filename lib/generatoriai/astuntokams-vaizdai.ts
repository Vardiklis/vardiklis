import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 8 klasės temoms.
 *
 * Aštuntoje klasėje pirmą kartą braižomi vektoriai (su rodykle, kuri turi ir
 * kryptį, ir ilgį), stačiojo trikampio kraštinės Pitagoro teoremai, vidurio
 * linijos bei statistikos vaizdai — histograma ir stačiakampė diagrama su
 * ūsais. Visur, kur uždavinys prašo dydį rasti, brėžinyje jis lieka be užrašo.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'
const PAPER = 'var(--paper)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

/** Rodyklė nuo taško iki taško — vektoriaus atvaizdas. */
function rodykle(x1: number, y1: number, x2: number, y2: number, spalva = ORANGE, storis = 2.2): string {
  const kampas = Math.atan2(y2 - y1, x2 - x1)
  const ilgis = 10
  const a = { x: x2 - ilgis * Math.cos(kampas - 0.4), y: y2 - ilgis * Math.sin(kampas - 0.4) }
  const b = { x: x2 - ilgis * Math.cos(kampas + 0.4), y: y2 - ilgis * Math.sin(kampas + 0.4) }
  return (
    `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${spalva}" stroke-width="${storis}"/>` +
    `<path d="M${x2.toFixed(1)} ${y2.toFixed(1)} L${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)} Z" fill="${spalva}"/>`
  )
}

// ── Vektoriai ───────────────────────────────────────────────────────────────

export interface Vektorius {
  x: number
  y: number
  vardas?: string
}

/**
 * Vektoriai languotame tinklelyje.
 *
 * `pradzia` nurodo kiekvieno vektoriaus pradžios tašką langeliais; taip
 * galima parodyti ir sudėtį trikampio taisykle (antrasis prasideda ten, kur
 * baigiasi pirmasis), ir lygius vektorius skirtingose vietose.
 */
export function vektoriaiTinklelyje(
  vektoriai: readonly { v: Vektorius; pradzia: { x: number; y: number } }[],
  stulpeliu = 10,
  eiluciu = 8,
): string {
  const L = 26
  const K = 16
  const plotis = stulpeliu * L + 2 * K
  const aukstis = eiluciu * L + 2 * K
  const px = (x: number) => K + x * L
  const py = (y: number) => aukstis - K - y * L

  let t = ''
  for (let i = 0; i <= stulpeliu; i += 1) {
    t += `<line x1="${px(i)}" y1="${K}" x2="${px(i)}" y2="${aukstis - K}" stroke="${LINE}" stroke-width="1"/>`
  }
  for (let i = 0; i <= eiluciu; i += 1) {
    t += `<line x1="${K}" y1="${py(i)}" x2="${plotis - K}" y2="${py(i)}" stroke="${LINE}" stroke-width="1"/>`
  }

  for (const { v, pradzia } of vektoriai) {
    const x1 = px(pradzia.x)
    const y1 = py(pradzia.y)
    const x2 = px(pradzia.x + v.x)
    const y2 = py(pradzia.y + v.y)
    t += rodykle(x1, y1, x2, y2)
    if (v.vardas) {
      t += txt((x1 + x2) / 2 + 12, (y1 + y2) / 2 - 8, v.vardas, 13, INK, 700)
    }
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Statusis trikampis Pitagoro teoremai ────────────────────────────────────

export interface StatinioZymes {
  /** Apatinis statinis. */
  a?: string
  /** Vertikalusis statinis. */
  b?: string
  /** Įžambinė. */
  c?: string
}

/**
 * Statusis trikampis su pažymėtomis kraštinėmis.
 *
 * Statinių ilgiai brėžinyje proporcingi duotiesiems, tad iš paveikslo matyti,
 * kuri kraštinė ilgesnė — mokinys neturi spėlioti.
 */
export function staciasisTrikampis(a: number, b: number, z: StatinioZymes = {}): string {
  const mastelis = Math.min(20, 150 / Math.max(a, b))
  const K = 36
  const kaire = 56
  const A = a * mastelis
  const B = b * mastelis
  const plotis = A + kaire + K
  const aukstis = B + 2 * K
  const p = { x: kaire, y: aukstis - K }
  const q = { x: kaire + A, y: aukstis - K }
  const r = { x: kaire, y: aukstis - K - B }
  let t = `<polygon points="${p.x},${p.y} ${q.x},${q.y} ${r.x},${r.y}" fill="${ORANGE}" fill-opacity="0.16" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`
  t += `<path d="M${p.x + 12} ${p.y} v-12 h-12" fill="none" stroke="${INK}" stroke-width="1.5"/>`
  if (z.a) t += txt((p.x + q.x) / 2, p.y + 18, z.a, 12, INK, 700)
  if (z.b) t += `<text x="${p.x - 8}" y="${(p.y + r.y) / 2 + 4}" font-size="12" fill="${INK}" font-weight="700" text-anchor="end">${z.b}</text>`
  if (z.c) t += txt((q.x + r.x) / 2 + 16, (q.y + r.y) / 2 - 6, z.c, 12, INK, 700)
  return svgRemas(plotis, aukstis, t)
}

// ── Vidurio linija ──────────────────────────────────────────────────────────

/**
 * Trikampio arba trapecijos vidurio linija.
 *
 * Linija brėžiama per tikrus kraštinių vidurio taškus, o lygios atkarpos
 * pažymimos brūkšneliais — iš to mokinys ir atpažįsta, kad tai vidurio linija.
 */
export function vidurioLinija(kas: 'trikampis' | 'trapecija', uzrasai: { virsus?: string; apacia?: string; vidurys?: string } = {}): string {
  const K = 34
  const taskai =
    kas === 'trikampis'
      ? [
          { x: 0, y: 100 },
          { x: 180, y: 100 },
          { x: 70, y: 0 },
        ]
      : [
          { x: 0, y: 100 },
          { x: 200, y: 100 },
          { x: 150, y: 0 },
          { x: 50, y: 0 },
        ]
  const v = taskai.map((p) => ({ x: p.x + K, y: p.y + K }))
  const plotis = Math.max(...v.map((p) => p.x)) + K
  const aukstis = Math.max(...v.map((p) => p.y)) + K

  let t = `<polygon points="${v.map((p) => `${p.x},${p.y}`).join(' ')}" fill="${ORANGE}" fill-opacity="0.14" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`

  // Vidurio taškai ant abiejų šoninių kraštinių.
  const vid = (p: { x: number; y: number }, q: { x: number; y: number }) => ({
    x: (p.x + q.x) / 2,
    y: (p.y + q.y) / 2,
  })
  const m1 = kas === 'trikampis' ? vid(v[0], v[2]) : vid(v[0], v[3])
  const m2 = kas === 'trikampis' ? vid(v[1], v[2]) : vid(v[1], v[2])
  t += `<line x1="${m1.x.toFixed(1)}" y1="${m1.y.toFixed(1)}" x2="${m2.x.toFixed(1)}" y2="${m2.y.toFixed(1)}" stroke="${ORANGE}" stroke-width="2.2"/>`

  // Lygių atkarpų brūkšneliai ant šoninių kraštinių.
  const bruksnys = (p: { x: number; y: number }, q: { x: number; y: number }) => {
    const m = vid(p, q)
    const dx = q.x - p.x
    const dy = q.y - p.y
    const l = Math.hypot(dx, dy) || 1
    const nx = (-dy / l) * 5
    const ny = (dx / l) * 5
    return `<line x1="${(m.x - nx).toFixed(1)}" y1="${(m.y - ny).toFixed(1)}" x2="${(m.x + nx).toFixed(1)}" y2="${(m.y + ny).toFixed(1)}" stroke="${ORANGE}" stroke-width="1.8"/>`
  }
  const sonai: [{ x: number; y: number }, { x: number; y: number }][] =
    kas === 'trikampis'
      ? [
          [v[0], m1],
          [m1, v[2]],
          [v[1], m2],
          [m2, v[2]],
        ]
      : [
          [v[0], m1],
          [m1, v[3]],
          [v[1], m2],
          [m2, v[2]],
        ]
  for (const [p, q] of sonai) t += bruksnys(p, q)

  if (uzrasai.apacia) t += txt((v[0].x + v[1].x) / 2, v[0].y + 18, uzrasai.apacia, 12, INK, 700)
  if (uzrasai.vidurys) t += txt((m1.x + m2.x) / 2, m1.y - 8, uzrasai.vidurys, 12, ORANGE, 700)
  if (uzrasai.virsus && kas === 'trapecija') t += txt((v[2].x + v[3].x) / 2, v[2].y - 8, uzrasai.virsus, 12, INK, 700)
  return svgRemas(plotis, aukstis, t)
}

// ── Statistikos vaizdai ─────────────────────────────────────────────────────

export interface Intervalas {
  /** Intervalo užrašas, pavyzdžiui, „10–20“. */
  vardas: string
  daznis: number
}

/**
 * Histograma — sugrupuotų duomenų stulpeliai be tarpų.
 *
 * Tarpų nėra tyčia: histogramoje stulpeliai remiasi vienas į kitą, nes
 * intervalai eina iš eilės. Būtent tuo ji ir skiriasi nuo stulpelinės
 * diagramos, kurioje grupės nesusijusios.
 */
export function histograma(intervalai: readonly Intervalas[]): string {
  const maks = Math.max(...intervalai.map((i) => i.daznis))
  const zingsnis = Math.max(1, Math.ceil(maks / 5))
  const virsus = Math.ceil(maks / zingsnis) * zingsnis
  const kaire = 42
  const apacia = 44
  const stulpelis = 54
  const plotis = kaire + intervalai.length * stulpelis + 24
  const aukstis = 220
  const nulis = aukstis - apacia
  const auksciai = nulis - 24
  const y = (v: number) => nulis - (v / virsus) * auksciai

  let t = ''
  for (let v = 0; v <= virsus; v += zingsnis) {
    t += `<line x1="${kaire}" y1="${y(v)}" x2="${plotis - 12}" y2="${y(v)}" stroke="${LINE}" stroke-width="1"/>`
    t += txt(kaire - 14, y(v) + 4, String(v), 10, MUTED, 500)
  }
  intervalai.forEach((e, i) => {
    const x = kaire + i * stulpelis
    t += `<rect x="${x}" y="${y(e.daznis)}" width="${stulpelis}" height="${nulis - y(e.daznis)}" fill="${ORANGE}" fill-opacity="0.45" stroke="${INK}" stroke-width="1.4"/>`
    t += txt(x + stulpelis / 2, aukstis - apacia + 18, e.vardas, 10, INK, 600)
  })
  t += `<line x1="${kaire}" y1="${nulis}" x2="${plotis - 12}" y2="${nulis}" stroke="${INK}" stroke-width="1.8"/>`
  t += `<line x1="${kaire}" y1="${nulis}" x2="${kaire}" y2="18" stroke="${INK}" stroke-width="1.8"/>`
  return svgRemas(plotis, aukstis, t)
}

/**
 * Stačiakampė diagrama su ūsais.
 *
 * Penki skaičiai — mažiausias, $Q_1$, mediana, $Q_3$ ir didžiausias — turi
 * būti perduoti surikiuoti; brėžinys jų nerikiuoja, nes tada uždavinys galėtų
 * nesutapti su paveikslu.
 */
export function usuDiagrama(
  maziausias: number,
  q1: number,
  mediana: number,
  q3: number,
  didziausias: number,
  rodytiSkaicius = true,
): string {
  const plotis = 340
  const aukstis = 150
  const kaire = 30
  const desine = plotis - 30
  const y = 60
  const h = 34

  const nuo = maziausias
  const iki = didziausias
  const tarpas = iki - nuo || 1
  const x = (v: number) => kaire + ((v - nuo) / tarpas) * (desine - kaire)

  let t = ''
  // Ūsai.
  t += `<line x1="${x(maziausias)}" y1="${y + h / 2}" x2="${x(q1)}" y2="${y + h / 2}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<line x1="${x(q3)}" y1="${y + h / 2}" x2="${x(didziausias)}" y2="${y + h / 2}" stroke="${INK}" stroke-width="1.6"/>`
  for (const v of [maziausias, didziausias]) {
    t += `<line x1="${x(v)}" y1="${y + 6}" x2="${x(v)}" y2="${y + h - 6}" stroke="${INK}" stroke-width="1.8"/>`
  }
  // Dėžė ir mediana.
  t += `<rect x="${x(q1)}" y="${y}" width="${x(q3) - x(q1)}" height="${h}" fill="${ORANGE}" fill-opacity="0.3" stroke="${INK}" stroke-width="1.8"/>`
  t += `<line x1="${x(mediana)}" y1="${y}" x2="${x(mediana)}" y2="${y + h}" stroke="${INK}" stroke-width="2.4"/>`

  // Skalė braižoma tik su skaičiais: tuščia linija po diagrama neneša
  // informacijos ir atrodo kaip brėžinio klaida.
  if (rodytiSkaicius) {
    t += `<line x1="${kaire - 10}" y1="${y + h + 26}" x2="${desine + 10}" y2="${y + h + 26}" stroke="${INK}" stroke-width="1.4"/>`
    for (const v of [maziausias, q1, mediana, q3, didziausias]) {
      t += `<line x1="${x(v)}" y1="${y + h + 21}" x2="${x(v)}" y2="${y + h + 31}" stroke="${INK}" stroke-width="1.2"/>`
      t += txt(x(v), y + h + 44, String(v), 10, MUTED, 500)
    }
  }
  return svgRemas(plotis, aukstis, t)
}

/** Dažnių lentelė su sukauptuoju dažniu. */
export function sukauptuLentele(eilutes: readonly Intervalas[], slepti = -1): string {
  const stulpelioPlotis = 72
  const antraste = 128
  const plotis = antraste + eilutes.length * stulpelioPlotis + 20
  const aukstis = 112
  const y0 = 16
  const h = 27

  const langelis = (x: number, y: number, w: number, tekstas: string, ats: boolean) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${ats ? ORANGE : PAPER}" fill-opacity="${ats ? 0.14 : 1}" stroke="${INK}" stroke-width="1.3"/>` +
    txt(x + w / 2, y + 18, tekstas, 11, INK, ats ? 700 : 500)

  let t = ''
  t += langelis(10, y0, antraste, 'Reikšmė', true)
  t += langelis(10, y0 + h, antraste, 'Dažnis', true)
  t += langelis(10, y0 + 2 * h, antraste, 'Sukauptasis', true)

  let sukauptas = 0
  eilutes.forEach((e, i) => {
    const x = 10 + antraste + i * stulpelioPlotis
    sukauptas += e.daznis
    t += langelis(x, y0, stulpelioPlotis, e.vardas, false)
    t += langelis(x, y0 + h, stulpelioPlotis, String(e.daznis), false)
    t += langelis(x, y0 + 2 * h, stulpelioPlotis, i === slepti ? '?' : String(sukauptas), false)
  })
  return svgRemas(plotis, aukstis, t)
}
