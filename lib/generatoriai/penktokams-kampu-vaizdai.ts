import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 5 klasės kampų temai.
 *
 * Visi kampai brėžiami tikro dydžio — jei uždavinyje sakoma 130°, brėžinyje
 * ir yra 130°, kitaip mokinys, mokydamasis atskirti smailųjį nuo bukojo,
 * mokytųsi iš klaidingo paveikslo. Kampo dydis brėžinyje užrašomas tik tada,
 * kai jis uždavinyje duotas; kai jį reikia rasti — lieka klaustukas arba
 * nieko.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

function txt(x: number, y: number, t: string, dydis = 12, spalva = INK, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

/** Taškas ant spindulio, kuris iš `v` eina `kampas` laipsnių kryptimi. */
function tsk(v: { x: number; y: number }, kampas: number, ilgis: number) {
  const rad = (-kampas * Math.PI) / 180
  return { x: v.x + ilgis * Math.cos(rad), y: v.y + ilgis * Math.sin(rad) }
}

function sp(v: { x: number; y: number }, kampas: number, ilgis: number, storis = 2.2): string {
  const p = tsk(v, kampas, ilgis)
  return `<line x1="${v.x.toFixed(1)}" y1="${v.y.toFixed(1)}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${INK}" stroke-width="${storis}" stroke-linecap="round"/>`
}

/**
 * Kampo lankelis nuo `nuo` iki `iki` laipsnių.
 *
 * Statusis kampas žymimas ne lankeliu, o kvadratėliu — taip jį žymi ir
 * vadovėlis, ir mokinys turi tą ženklą atpažinti.
 */
function lankas(
  v: { x: number; y: number },
  nuo: number,
  iki: number,
  r = 26,
  spalva = ORANGE,
): string {
  if (Math.abs(iki - nuo - 90) < 0.5) {
    const a = tsk(v, nuo, 14)
    const b = tsk(v, iki, 14)
    const c = { x: a.x + (b.x - v.x), y: a.y + (b.y - v.y) }
    return `<path d="M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${c.x.toFixed(1)} ${c.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}" fill="none" stroke="${spalva}" stroke-width="2"/>`
  }
  const a = tsk(v, nuo, r)
  const b = tsk(v, iki, r)
  const didelis = iki - nuo > 180 ? 1 : 0
  return `<path d="M${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${r} ${r} 0 ${didelis} 0 ${b.x.toFixed(1)} ${b.y.toFixed(1)}" fill="none" stroke="${spalva}" stroke-width="2"/>`
}

/** Viršūnės taškas su raide, pastumta priešinga kampo pusiaukampinei kryptimi. */
function virsune(v: { x: number; y: number }, raide: string, kryptis: number): string {
  const p = tsk(v, kryptis, 15)
  return `<circle cx="${v.x.toFixed(1)}" cy="${v.y.toFixed(1)}" r="3.5" fill="${INK}"/>${txt(p.x, p.y + 4, raide)}`
}

// ── Vienas kampas ───────────────────────────────────────────────────────────

export interface KampoNustatymai {
  /** Viršūnės raidė. */
  virsune?: string
  /** Kraštinių galų raidės. */
  kraštines?: readonly [string, string]
  /** Ką rašyti prie lankelio: skaičių, „?“ arba nieko. */
  uzrasas?: string
  /** Pirmosios kraštinės kryptis laipsniais (0° — į dešinę). */
  posukis?: number
  /** Kraštinių ilgis — kampo dydžio jis nekeičia, bet tai reikia parodyti. */
  ilgis?: number
}

/** Vienas kampas su viršūne, kraštinėmis ir lankeliu. */
export function kampasSuRaidemis(laipsniai: number, n: KampoNustatymai = {}): string {
  const { virsune: V = 'B', kraštines = ['A', 'C'], uzrasas, posukis = 0, ilgis = 78 } = n
  const P = 34
  const kampai = [posukis, posukis + laipsniai]
  const galai = kampai.map((k) => tsk({ x: 0, y: 0 }, k, ilgis))
  const minX = Math.min(0, ...galai.map((p) => p.x))
  const maxX = Math.max(0, ...galai.map((p) => p.x))
  const minY = Math.min(0, ...galai.map((p) => p.y))
  const maxY = Math.max(0, ...galai.map((p) => p.y))
  const plotis = Math.max(150, maxX - minX + 2 * P)
  const aukstis = Math.max(110, maxY - minY + 2 * P)
  const v = { x: P - minX, y: P - minY }

  let t = ''
  for (const k of kampai) t += sp(v, k, ilgis)
  t += lankas(v, kampai[0], kampai[1])
  if (uzrasas) {
    const vidurys = tsk(v, (kampai[0] + kampai[1]) / 2, 44)
    t += txt(vidurys.x, vidurys.y + 4, uzrasas, 13, ORANGE)
  }
  t += virsune(v, V, (kampai[0] + kampai[1]) / 2 + 180)
  for (let i = 0; i < 2; i++) {
    const p = tsk(v, kampai[i], ilgis + 13)
    t += txt(p.x, p.y + 4, kraštines[i])
  }
  return svgRemas(plotis, aukstis, t)
}

/** Keli spinduliai iš vienos viršūnės — kampams įvardyti. */
export function keliSpinduliai(kampai: readonly number[], raides: readonly string[]): string {
  const plotis = 240
  const aukstis = 170
  const v = { x: 46, y: aukstis - 40 }
  let t = ''
  for (let i = 0; i < kampai.length; i++) {
    t += sp(v, kampai[i], 130)
    const p = tsk(v, kampai[i], 143)
    t += txt(p.x, p.y + 4, raides[i])
  }
  t += virsune(v, 'O', 200)
  return svgRemas(plotis, aukstis, t)
}

/**
 * Keli kampai greta, sunumeruoti.
 *
 * Kraštinių ilgiai skirtingi tyčia: mokinys turi įsitikinti, kad kampo dydis
 * nuo jų nepriklauso.
 */
export function kampuEile(
  kampai: readonly { laipsniai: number; posukis?: number; ilgis?: number }[],
): string {
  const langelis = 130
  const aukstis = 160
  let t = ''
  for (let i = 0; i < kampai.length; i++) {
    const k = kampai[i]
    const ilgis = k.ilgis ?? 52
    const posukis = k.posukis ?? 0
    const v = { x: i * langelis + 34, y: aukstis - 44 }
    t += sp(v, posukis, ilgis)
    t += sp(v, posukis + k.laipsniai, ilgis)
    t += lankas(v, posukis, posukis + k.laipsniai, 18)
    t += `<circle cx="${v.x}" cy="${v.y}" r="3" fill="${INK}"/>`
    t += txt(i * langelis + langelis / 2, aukstis - 10, String(i + 1), 12, MUTED)
  }
  return svgRemas(kampai.length * langelis, aukstis, t)
}

// ── Matlankis ───────────────────────────────────────────────────────────────

/**
 * Matlankis su ant jo uždėtu kampu.
 *
 * Brėžiamos abi skalės — išorinė iš kairės į dešinę, vidinė atvirkščiai, —
 * nes būtent jų painiojimas ir yra dažniausia matavimo klaida, o uždaviniai
 * apie tai klausia.
 */
export function matlankis(laipsniai: number, rodytiKampa = true): string {
  const plotis = 300
  const aukstis = 190
  const c = { x: plotis / 2, y: aukstis - 34 }
  const R = 118
  let t = ''

  t += `<path d="M${c.x - R} ${c.y} A ${R} ${R} 0 0 1 ${c.x + R} ${c.y} Z" fill="none" stroke="${LINE}" stroke-width="1.6"/>`
  t += `<line x1="${c.x - R}" y1="${c.y}" x2="${c.x + R}" y2="${c.y}" stroke="${LINE}" stroke-width="1.6"/>`

  for (let a = 0; a <= 180; a += 10) {
    const vid = tsk(c, a, R - (a % 30 === 0 ? 20 : 12))
    const isor = tsk(c, a, R)
    t += `<line x1="${vid.x.toFixed(1)}" y1="${vid.y.toFixed(1)}" x2="${isor.x.toFixed(1)}" y2="${isor.y.toFixed(1)}" stroke="${LINE}" stroke-width="1.2"/>`
    if (a % 30 === 0) {
      // Dvi skalės atitraukiamos viena nuo kitos: susiglaudę skaičiai
      // susilieja būtent ten, kur mokinys turi jas atskirti.
      const p = tsk(c, a, R - 30)
      t += txt(p.x, p.y + 4, String(a), 9, MUTED, 400)
      const p2 = tsk(c, a, R - 54)
      t += txt(p2.x, p2.y + 4, String(180 - a), 9, MUTED, 400)
    }
  }

  if (rodytiKampa) {
    t += sp(c, 0, R + 16, 2.4)
    t += sp(c, laipsniai, R + 16, 2.4)
    t += lankas(c, 0, laipsniai, 34)
  }
  t += `<circle cx="${c.x}" cy="${c.y}" r="3.5" fill="${INK}"/>`
  return svgRemas(plotis, aukstis, t)
}

// ── Pusiaukampinė ───────────────────────────────────────────────────────────

/**
 * Kampas su nubrėžta pusiaukampine.
 *
 * Lauko ribos skaičiuojamos iš kraštinių galų: bukojo kampo antroji kraštinė
 * krypsta į kairę ir su pastovia viršūne išlįstų už brėžinio.
 */
export function pusiaukampine(laipsniai: number, uzrasas?: string): string {
  const P = 34
  const ilgis = 126
  const galai = [0, laipsniai / 2, laipsniai].map((k) => tsk({ x: 0, y: 0 }, k, ilgis + 18))
  const minX = Math.min(0, ...galai.map((p) => p.x))
  const maxX = Math.max(0, ...galai.map((p) => p.x))
  const minY = Math.min(0, ...galai.map((p) => p.y))
  const maxY = Math.max(0, ...galai.map((p) => p.y))
  const plotis = Math.max(200, maxX - minX + 2 * P)
  const aukstis = Math.max(150, maxY - minY + 2 * P)
  const v = { x: P - minX, y: P - minY }
  let t = ''
  t += sp(v, 0, ilgis)
  t += sp(v, laipsniai, ilgis)
  const p = tsk(v, laipsniai / 2, ilgis)
  t += `<line x1="${v.x}" y1="${v.y}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="6 4"/>`
  t += lankas(v, 0, laipsniai / 2, 30)
  t += lankas(v, laipsniai / 2, laipsniai, 30)
  if (uzrasas) {
    const u = tsk(v, laipsniai / 2, ilgis + 16)
    t += txt(u.x, u.y + 4, uzrasas, 12, ORANGE)
  }
  t += virsune(v, 'O', laipsniai / 2 + 180)
  const a = tsk(v, 0, ilgis + 13)
  const b = tsk(v, laipsniai, ilgis + 13)
  t += txt(a.x, a.y + 4, 'A')
  t += txt(b.x, b.y + 4, 'B')
  return svgRemas(plotis, aukstis, t)
}

// ── Gretutiniai ir kryžminiai kampai ────────────────────────────────────────

/**
 * Gretutiniai kampai: spindulys, išeinantis iš tiesės taško.
 *
 * Žinomas kampas užrašomas, nežinomas žymimas klaustuku — taip brėžinys duoda
 * duomenis, bet neišduoda atsakymo.
 */
export function gretutiniai(laipsniai: number, zinomas: 'kairysis' | 'desinysis' = 'desinysis'): string {
  const plotis = 300
  const aukstis = 170
  const v = { x: plotis / 2, y: aukstis - 46 }
  const R = 120
  let t = ''
  t += `<line x1="${v.x - R}" y1="${v.y}" x2="${v.x + R}" y2="${v.y}" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`
  t += sp(v, laipsniai, 108)
  t += lankas(v, 0, laipsniai, 30)
  t += lankas(v, laipsniai, 180, 44)

  const desPad = tsk(v, laipsniai / 2, 50)
  const kairPad = tsk(v, (laipsniai + 180) / 2, 64)
  t += txt(desPad.x, desPad.y + 4, zinomas === 'desinysis' ? `${laipsniai}°` : '?', 13, ORANGE)
  t += txt(kairPad.x, kairPad.y + 4, zinomas === 'kairysis' ? `${180 - laipsniai}°` : '?', 13, ORANGE)

  t += `<circle cx="${v.x}" cy="${v.y}" r="3.5" fill="${INK}"/>`
  t += txt(v.x + R + 12, v.y + 4, 'C')
  t += txt(v.x - R - 12, v.y + 4, 'A')
  const virs = tsk(v, laipsniai, 122)
  t += txt(virs.x, virs.y - 4, 'D')
  t += txt(v.x - 4, v.y + 20, 'O')
  return svgRemas(plotis, aukstis, t)
}

/**
 * Kryžminiai kampai: dvi susikertančios tiesės.
 *
 * Užrašomas tik vienas kampas — visi kiti trys randami samprotaujant.
 */
export function kryzminiai(laipsniai: number, kuris: 0 | 1 | 2 | 3 = 0): string {
  const plotis = 280
  const aukstis = 210
  const c = { x: plotis / 2, y: aukstis / 2 }
  const R = 112
  let t = ''
  for (const k of [0, laipsniai]) {
    const a = tsk(c, k, R)
    const b = tsk(c, k + 180, R)
    t += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`
  }
  const ribos: [number, number][] = [
    [0, laipsniai],
    [laipsniai, 180],
    [180, 180 + laipsniai],
    [180 + laipsniai, 360],
  ]
  for (let i = 0; i < 4; i++) {
    const [nuo, iki] = ribos[i]
    // Lankeliu žymimas tik žinomas kampas: keturi lankeliai vienodu spinduliu
    // susilietų į apskritimą ir nebeatrodytų kaip kampų žymės.
    if (i === kuris) t += lankas(c, nuo, iki, 30, ORANGE)
    const p = tsk(c, (nuo + iki) / 2, 54)
    t += txt(p.x, p.y + 4, i === kuris ? `${iki - nuo}°` : String(i + 1), 12, i === kuris ? ORANGE : MUTED)
  }
  t += `<circle cx="${c.x}" cy="${c.y}" r="3.5" fill="${INK}"/>`
  return svgRemas(plotis, aukstis, t)
}

/** Pilnasis arba priešpilnis kampas — spindulys ir aplink jį apsukamas lankas. */
export function didelisKampas(laipsniai: number, uzrasas?: string): string {
  const plotis = 250
  const aukstis = 220
  const c = { x: plotis / 2, y: aukstis / 2 }
  const ilgis = 88
  let t = ''
  t += sp(c, 0, ilgis)
  if (laipsniai < 360) t += sp(c, laipsniai, ilgis)
  if (laipsniai >= 360) {
    t += `<circle cx="${c.x}" cy="${c.y}" r="34" fill="none" stroke="${ORANGE}" stroke-width="2"/>`
    t += `<path d="M${c.x + 34} ${c.y - 6} L${c.x + 34} ${c.y + 6} L${c.x + 42} ${c.y}Z" fill="${ORANGE}"/>`
  } else {
    t += lankas(c, 0, laipsniai, 34)
  }
  if (uzrasas) t += txt(c.x, c.y + 62, uzrasas, 13, ORANGE)
  t += `<circle cx="${c.x}" cy="${c.y}" r="3.5" fill="${INK}"/>`
  return svgRemas(plotis, aukstis, t)
}
