import { eurais } from './ketvirtokams-bendra'
import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 4 klasės temai „Mišrieji ir dešimtainiai skaičiai“.
 *
 * Mišrusis skaičius ir dešimtainė trupmena yra tas pats dydis, užrašytas
 * dvejopai, ir būtent to iš užrašo nematyti. Modelis parodo: du pilni
 * apskritimai ir pusė trečiojo yra $2\frac{1}{2}$, o dešimt langelių eilėje,
 * iš kurių nuspalvinti penki, — 0,5. Todėl piešiniai čia yra uždavinio dalis.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 400): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Mišriojo skaičiaus modelis ──────────────────────────────────────────────

/**
 * Sveiki apskritimai ir vienas dalinis — mišriajam skaičiui.
 *
 * Skaičius po piešiniu nerašomas: jį mokinys ir turi nustatyti. Sveikieji
 * spalvinami visi, tad iš karto matyti, kiek jų yra, o paskutinis rodo
 * trupmeninę dalį.
 */
export function misriojoModelis(sveiki: number, skaitiklis: number, vardiklis: number): string {
  const r = 34
  const tarpas = 16
  const kiek = sveiki + (skaitiklis > 0 ? 1 : 0)
  const plotis = kiek * (2 * r + tarpas) + tarpas
  const aukstis = 2 * r + 24

  const pyragas = (cx: number, cy: number, daliu: number, nuspalvinta: number) => {
    let t = ''
    const taskas = (i: number) => {
      const kampas = (i / daliu) * 2 * Math.PI - Math.PI / 2
      return [cx + r * Math.cos(kampas), cy + r * Math.sin(kampas)]
    }
    for (let i = 0; i < daliu; i += 1) {
      const [x1, y1] = taskas(i)
      const [x2, y2] = taskas(i + 1)
      t += `<path d="M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${daliu === 1 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${
        i < nuspalvinta ? ORANGE : 'none'
      }" fill-opacity="${i < nuspalvinta ? 0.45 : 1}" stroke="${INK}" stroke-width="1.4"/>`
    }
    return t
  }

  let t = ''
  for (let i = 0; i < kiek; i += 1) {
    const cx = tarpas + r + i * (2 * r + tarpas)
    const pilnas = i < sveiki
    t += pyragas(cx, r + 10, vardiklis, pilnas ? vardiklis : skaitiklis)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Skaičių tiesė su vieneto dalimis ────────────────────────────────────────

export type MisrusTaskas = {
  /** Reikšmė vardiklio dalimis nuo tiesės pradžios. */
  daliu: number
  raide?: string
}

/**
 * Skaičių tiesė nuo `nuo` iki `iki`, kur kiekvienas vienetas padalytas į
 * `vardiklis` lygias dalis.
 *
 * Sveikieji pasirašomi, tarpinės padalos — ne: mokinys turi jas suskaičiuoti
 * pats, antraip mišriojo skaičiaus nustatymas virstų nurašymu.
 */
export function misriuTiese(
  nuo: number,
  iki: number,
  vardiklis: number,
  taskai: readonly MisrusTaskas[] = [],
): string {
  const visoDaliu = (iki - nuo) * vardiklis
  const tarpas = Math.max(14, Math.min(40, Math.round(600 / Math.max(visoDaliu, 1))))
  const krastas = 30
  const asis = 58
  const plotis = krastas * 2 + visoDaliu * tarpas
  const aukstis = asis + 30

  const x = (dalis: number) => krastas + dalis * tarpas

  let t = `<line x1="${krastas - 14}" y1="${asis}" x2="${plotis - krastas + 14}" y2="${asis}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<path d="M${plotis - krastas + 14} ${asis} l-9 -4.5 v9 z" fill="${INK}"/>`

  for (let i = 0; i <= visoDaliu; i += 1) {
    const sveikas = i % vardiklis === 0
    t += `<line x1="${x(i)}" y1="${asis - (sveikas ? 9 : 5)}" x2="${x(i)}" y2="${asis + (sveikas ? 9 : 5)}" stroke="${INK}" stroke-width="${sveikas ? 1.6 : 1}"/>`
    if (sveikas) t += txt(x(i), asis + 24, String(nuo + i / vardiklis), 12, INK, 600)
  }

  for (const p of taskai) {
    t += `<circle cx="${x(p.daliu)}" cy="${asis}" r="5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
    if (p.raide) t += txt(x(p.daliu), asis - 18, p.raide, 13, INK, 700)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Dešimtainių skaičių modeliai ────────────────────────────────────────────

/**
 * Juosta iš dešimties langelių — dešimtosioms dalims.
 *
 * Dešimtainis skaičius mokiniui pirmiausia yra kablelis, o ne dydis. Dešimt
 * langelių, iš kurių nuspalvinti šeši, parodo, kad 0,6 yra šiek tiek daugiau
 * nei pusė, — to iš užrašo nematyti.
 */
export function desimtainiuJuosta(desimtosios: number, sveiki = 0): string {
  const langelis = 34
  const aukstis = 52
  const juostos = sveiki + 1
  const plotis = juostos * (10 * langelis + 14) + 10

  let t = ''
  for (let j = 0; j < juostos; j += 1) {
    const x0 = 8 + j * (10 * langelis + 14)
    const pilna = j < sveiki
    for (let i = 0; i < 10; i += 1) {
      const nuspalvinta = pilna || i < desimtosios
      t += `<rect x="${x0 + i * langelis}" y="8" width="${langelis}" height="${aukstis - 20}" fill="${
        nuspalvinta ? ORANGE : 'none'
      }" fill-opacity="${nuspalvinta ? 0.45 : 1}" stroke="${INK}" stroke-width="1.4"/>`
    }
  }
  return svgRemas(plotis, aukstis, t)
}

/**
 * Kvadratas iš 100 langelių — šimtosioms dalims.
 *
 * Be jo 0,08 ir 0,8 mokiniui skiriasi vienu ženklu; su juo — aštuoniais
 * langeliais prieš aštuonias eilutes.
 */
export function desimtainiuKvadratas(simtosios: number): string {
  const langelis = 17
  const krastas = 8
  const dydis = krastas * 2 + 10 * langelis

  let t = ''
  for (let e = 0; e < 10; e += 1) {
    for (let s = 0; s < 10; s += 1) {
      const numeris = e * 10 + s
      const nuspalvinta = numeris < simtosios
      t += `<rect x="${krastas + s * langelis}" y="${krastas + e * langelis}" width="${langelis}" height="${langelis}" fill="${
        nuspalvinta ? ORANGE : 'none'
      }" fill-opacity="${nuspalvinta ? 0.45 : 1}" stroke="${LINE}" stroke-width="0.8"/>`
    }
  }
  t += `<rect x="${krastas}" y="${krastas}" width="${10 * langelis}" height="${10 * langelis}" fill="none" stroke="${INK}" stroke-width="1.6"/>`
  return svgRemas(dydis, dydis, t)
}

// ── Kainoraštis dešimtainėmis kainomis ──────────────────────────────────────

export type PrekesKaina = { pavadinimas: string; centai: number }

/**
 * Kainų lentelė. Kainos rašomos su kableliu ir dviem skaitmenimis po jo —
 * taip, kaip parduotuvėje, kad uždavinys būtų apie tikrą užrašą.
 */
export function kainuLentele(prekes: readonly PrekesKaina[]): string {
  const eilute = 32
  const plotis = 300
  const aukstis = prekes.length * eilute + 14

  let t = `<rect x="1" y="1" width="${plotis - 2}" height="${aukstis - 2}" rx="6" fill="none" stroke="${INK}" stroke-width="1.3"/>`
  prekes.forEach((p, i) => {
    const y = 8 + i * eilute
    if (i > 0) {
      t += `<line x1="6" y1="${y}" x2="${plotis - 6}" y2="${y}" stroke="${LINE}" stroke-width="1"/>`
    }
    t += `<text x="16" y="${y + 21}" font-size="14" fill="${INK}" text-anchor="start">${p.pavadinimas}</text>`
    t += `<text x="${plotis - 16}" y="${y + 21}" font-size="14" fill="${INK}" font-weight="700" text-anchor="end">${eurais(
      p.centai,
    ).replace('{,}', ',')} €</text>`
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Dešimtainių skaičių tiesė ───────────────────────────────────────────────

/**
 * Tiesė nuo `nuo` iki `nuo + 1` su dešimčia padalų.
 *
 * Klausimams „kuris skaičius tarp 4,2 ir 4,3“ ir „kur arčiau“ — be tiesės tai
 * tik ženklų lyginimas, su tiese — atstumas.
 */
export function desimtainiuTiese(nuo: number, taskai: readonly { desimtosios: number; raide?: string }[]): string {
  const tarpas = 52
  const krastas = 34
  const asis = 58
  const plotis = krastas * 2 + 10 * tarpas
  const aukstis = asis + 32

  const x = (d: number) => krastas + d * tarpas

  let t = `<line x1="${krastas - 14}" y1="${asis}" x2="${plotis - krastas + 14}" y2="${asis}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<path d="M${plotis - krastas + 14} ${asis} l-9 -4.5 v9 z" fill="${INK}"/>`

  for (let i = 0; i <= 10; i += 1) {
    const galas = i === 0 || i === 10
    t += `<line x1="${x(i)}" y1="${asis - (galas ? 9 : 5)}" x2="${x(i)}" y2="${asis + (galas ? 9 : 5)}" stroke="${INK}" stroke-width="${galas ? 1.6 : 1}"/>`
    if (galas) t += txt(x(i), asis + 24, String(nuo + i / 10).replace('.', ','), 12, INK, 600)
  }

  for (const p of taskai) {
    t += `<circle cx="${x(p.desimtosios)}" cy="${asis}" r="5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
    if (p.raide) t += txt(x(p.desimtosios), asis - 18, p.raide, 13, INK, 700)
  }
  return svgRemas(plotis, aukstis, t)
}
