import { tekstu } from './ketvirtokams-bendra'
import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 5 klasės skaičių ir judėjimo temoms.
 *
 * Taisyklė ta pati kaip jaunesnėse klasėse: brėžinys pateikia duomenis, bet
 * neišduoda atsakymo. Skaičių tiesėje ieškomas taškas lieka be užrašo, o
 * judėjimo schemoje nežinomas atstumas — klaustuku.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Romėniškieji skaitmenys ─────────────────────────────────────────────────

const ROMENISKI = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
] as const

/** Skaičius romėniškaisiais skaitmenimis. */
export function romeniskai(n: number): string {
  let likutis = n
  let rez = ''
  for (const [verte, zenklas] of ROMENISKI) {
    while (likutis >= verte) {
      rez += zenklas
      likutis -= verte
    }
  }
  return rez
}

/**
 * Laikrodžio ciferblatas su romėniškaisiais skaitmenimis.
 *
 * Ciferblatas yra tikroji vieta, kur vaikas romėniškus skaitmenis mato
 * kasdien, ir kaip tik jame matyti, kad IV rašomas prieš V, o IX — prieš X.
 */
export function romenuLaikrodis(pazymeta?: number): string {
  const r = 78
  const krastas = 18
  const dydis = 2 * (r + krastas)
  const c = r + krastas

  let t = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${INK}" stroke-width="2"/>`
  for (let i = 1; i <= 12; i += 1) {
    const kampas = ((i * 30 - 90) * Math.PI) / 180
    const x = c + (r - 16) * Math.cos(kampas)
    const y = c + (r - 16) * Math.sin(kampas)
    const zymima = pazymeta === i
    if (zymima) {
      t += `<circle cx="${x}" cy="${y}" r="14" fill="${ORANGE}" fill-opacity="0.35" stroke="${INK}" stroke-width="1.3"/>`
    }
    t += txt(x, y + 4, romeniskai(i), 12, INK, 700)
    const xb = c + r * Math.cos(kampas)
    const yb = c + r * Math.sin(kampas)
    const xa = c + (r - 6) * Math.cos(kampas)
    const ya = c + (r - 6) * Math.sin(kampas)
    t += `<line x1="${xa.toFixed(1)}" y1="${ya.toFixed(1)}" x2="${xb.toFixed(1)}" y2="${yb.toFixed(1)}" stroke="${INK}" stroke-width="1.4"/>`
  }
  t += `<circle cx="${c}" cy="${c}" r="3" fill="${INK}"/>`
  return svgRemas(dydis, dydis, t)
}

// ── Skaičių tiesė su keliais taškais ────────────────────────────────────────

export type TieseTaskas = { reiksme: number; raide?: string }

/**
 * Skaičių tiesė su vienodomis padalomis.
 *
 * Pasirašomos tik kas `zymetiKas` padalos: pasirašius visas, taško reikšmę
 * tektų ne nustatyti, o nurašyti nuo gretimo užrašo. Padalos visada vienodo
 * pločio — netolygi tiesė būtų klaidinga pati savaime.
 */
export function skaiciuTiese(
  nuo: number,
  iki: number,
  zingsnis: number,
  taskai: readonly TieseTaskas[] = [],
  zymetiKas = 1,
): string {
  const padalu = Math.round((iki - nuo) / zingsnis)
  const tarpas = Math.max(Math.min(58 / zymetiKas, 62), Math.min(62, Math.round(660 / Math.max(padalu, 1))))
  const krastas = 36
  const asis = 64
  const plotis = krastas * 2 + padalu * tarpas
  const aukstis = asis + 32

  const x = (v: number) => krastas + ((v - nuo) / zingsnis) * tarpas

  let t = `<line x1="${krastas - 16}" y1="${asis}" x2="${plotis - krastas + 16}" y2="${asis}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<path d="M${plotis - krastas + 16} ${asis} l-9 -4.5 v9 z" fill="${INK}"/>`

  for (let i = 0; i <= padalu; i += 1) {
    const v = nuo + i * zingsnis
    const zymeti = i % zymetiKas === 0
    t += `<line x1="${x(v)}" y1="${asis - (zymeti ? 8 : 4)}" x2="${x(v)}" y2="${asis + (zymeti ? 8 : 4)}" stroke="${INK}" stroke-width="${zymeti ? 1.5 : 1}"/>`
    if (zymeti) t += txt(x(v), asis + 22, tekstu(v), 11, INK)
  }

  for (const p of taskai) {
    t += `<circle cx="${x(p.reiksme)}" cy="${asis}" r="5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
    if (p.raide) t += txt(x(p.reiksme), asis - 16, p.raide, 13, INK, 700)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Judėjimas iš tos pačios ir iš skirtingų vietų ───────────────────────────

export type Judantis = { vardas: string; greitis: number }

/**
 * Dviejų judančių kūnų schema.
 *
 * `kaip` skiria tris situacijas, kurios uždavinyje sprendžiamos skirtingai:
 * iš tos pačios vietos ta pačia kryptimi (greičiai atimami), iš tos pačios
 * priešingomis (sudedami) ir iš skirtingų vietų vienas kito link (sudedami, o
 * pradinis atstumas duotas). Rodyklių kryptis brėžinyje ir yra tai, iš ko
 * mokinys sprendžia, kurį veiksmą rinktis.
 */
export function judejimoSchema5(
  kaip: 'ta-pati-kryptis' | 'priesingos-kryptys' | 'vienas-kito-link',
  a: Judantis,
  b: Judantis,
  atstumas?: number,
): string {
  const plotis = 520
  const aukstis = 132
  const asis = 74
  const kaire = 40
  const desine = plotis - 40

  let t = `<line x1="${kaire - 20}" y1="${asis}" x2="${desine + 20}" y2="${asis}" stroke="${LINE}" stroke-width="1.4"/>`

  const rodykle = (x: number, y: number, ilgis: number, i: 1 | -1, uzrasas: string) => {
    const galas = x + ilgis * i
    let r = `<line x1="${x}" y1="${y}" x2="${galas}" y2="${y}" stroke="${ORANGE}" stroke-width="2.4"/>`
    r += `<path d="M${galas} ${y} l${-9 * i} -4.5 v9 z" fill="${ORANGE}"/>`
    r += txt((x + galas) / 2, y - 9, uzrasas, 12, INK, 600)
    return r
  }
  const taskas = (x: number, zyme: string) => {
    let r = `<circle cx="${x}" cy="${asis}" r="5" fill="${INK}"/>`
    r += txt(x, asis + 20, zyme, 12, INK, 700)
    return r
  }

  if (kaip === 'ta-pati-kryptis') {
    t += taskas(kaire, 'Pradžia')
    t += rodykle(kaire, asis - 22, 150, 1, `${a.vardas}, ${a.greitis} km/h`)
    t += rodykle(kaire, asis - 50, 250, 1, `${b.vardas}, ${b.greitis} km/h`)
    t += txt(plotis / 2 + 60, asis + 34, 'abu juda ta pačia kryptimi', 11, MUTED)
  } else if (kaip === 'priesingos-kryptys') {
    const c = plotis / 2
    t += taskas(c, 'Pradžia')
    t += rodykle(c, asis - 26, 170, -1, `${a.vardas}, ${a.greitis} km/h`)
    t += rodykle(c, asis - 26, 170, 1, `${b.vardas}, ${b.greitis} km/h`)
    t += txt(c, asis + 34, 'juda priešingomis kryptimis', 11, MUTED)
  } else {
    t += taskas(kaire, a.vardas)
    t += taskas(desine, b.vardas)
    t += rodykle(kaire, asis - 26, 130, 1, `${a.greitis} km/h`)
    t += rodykle(desine, asis - 26, 130, -1, `${b.greitis} km/h`)
    // Pradinis atstumas — su ribiniais brūkšneliais, kad matytųsi, kas matuojama.
    const y = asis + 40
    t += `<line x1="${kaire}" y1="${y}" x2="${desine}" y2="${y}" stroke="${MUTED}" stroke-width="1.2"/>`
    t += `<line x1="${kaire}" y1="${y - 5}" x2="${kaire}" y2="${y + 5}" stroke="${MUTED}" stroke-width="1.2"/>`
    t += `<line x1="${desine}" y1="${y - 5}" x2="${desine}" y2="${y + 5}" stroke="${MUTED}" stroke-width="1.2"/>`
    t += txt((kaire + desine) / 2, y - 6, atstumas === undefined ? '?' : `${atstumas} km`, 12, INK, 700)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Įvesties ir išvesties lentelė ───────────────────────────────────────────

/**
 * Dviejų eilučių lentelė: įvestis viršuje, išvestis apačioje.
 *
 * Taisyklė nerašoma — kaip tik ją mokinys ir turi rasti iš porų. Tuščias
 * langelis žymimas klaustuku.
 */
export function ivestiesLentele(
  ivestis: readonly number[],
  isvestis: readonly (number | null)[],
): string {
  const langelis = 62
  const eilute = 34
  const kaire = 76
  const plotis = kaire + ivestis.length * langelis + 4
  const aukstis = 2 * eilute + 12

  let t = ''
  t += `<text x="${kaire - 8}" y="${eilute - 4}" font-size="12" fill="${INK}" font-weight="700" text-anchor="end">Įvestis</text>`
  t += `<text x="${kaire - 8}" y="${2 * eilute - 4}" font-size="12" fill="${INK}" font-weight="700" text-anchor="end">Išvestis</text>`

  ivestis.forEach((v, i) => {
    const x = kaire + i * langelis
    t += `<rect x="${x}" y="6" width="${langelis}" height="${eilute}" fill="${ORANGE}" fill-opacity="0.16" stroke="${INK}" stroke-width="1.3"/>`
    t += txt(x + langelis / 2, eilute - 4, String(v), 15, INK, 600)
    const iv = isvestis[i]
    t += `<rect x="${x}" y="${6 + eilute}" width="${langelis}" height="${eilute}" fill="none" stroke="${INK}" stroke-width="1.3"${
      iv === null ? ' stroke-dasharray="5 4"' : ''
    }/>`
    t += txt(x + langelis / 2, 2 * eilute - 4, iv === null ? '?' : String(iv), 15, iv === null ? MUTED : INK, 600)
  })
  return svgRemas(plotis, aukstis, t)
}
