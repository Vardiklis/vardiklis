import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 4 klasės temoms „Duomenys ir statistinis tyrimas“, „Tikimybė“ ir
 * „Dėsningumai, algoritmai ir programavimas“.
 *
 * Diagrama nėra iliustracija: klausimas „kurį mėnesį buvo šalčiausia“ atsakomas
 * tik pažiūrėjus į liniją, o „kuri baigtis labiau tikėtina“ — tik pamačius,
 * kiek kurios spalvos rutuliukų maišelyje. Todėl visi šie brėžiniai perteikia
 * duomenis, bet niekada neužrašo paties atsakymo.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Linijinė diagrama ───────────────────────────────────────────────────────

export type LinijosTaskas = { zyme: string; reiksme: number }

/**
 * Linijinė diagrama su padalomis ir taškais.
 *
 * Padalos vertė pasirenkama tokia, kad taškai neatsidurtų tarp padalų — kitaip
 * reikšmės nuskaityti neįmanoma, o kaip tik to uždavinys ir prašo.
 */
export function linijineDiagrama(taskai: readonly LinijosTaskas[], padala = 0): string {
  const maks = Math.max(...taskai.map((t) => t.reiksme))
  const zingsnis = padala || Math.max(1, Math.ceil(maks / 5))
  const virsus = Math.ceil(maks / zingsnis) * zingsnis
  const kaire = 44
  const apacia = 30
  const aukstis = 200
  const stulpelis = 62
  const plotis = kaire + taskai.length * stulpelis + 16
  const asisY = aukstis - apacia

  const x = (i: number) => kaire + i * stulpelis + stulpelis / 2 - stulpelis / 2 + 10
  const y = (v: number) => asisY - (v / virsus) * (asisY - 16)

  let t = ''
  for (let v = 0; v <= virsus; v += zingsnis) {
    t += `<line x1="${kaire}" y1="${y(v)}" x2="${plotis - 10}" y2="${y(v)}" stroke="${LINE}" stroke-width="0.9"/>`
    t += `<text x="${kaire - 8}" y="${y(v) + 4}" font-size="11" fill="${MUTED}" text-anchor="end">${v}</text>`
  }
  t += `<line x1="${kaire}" y1="12" x2="${kaire}" y2="${asisY}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<line x1="${kaire}" y1="${asisY}" x2="${plotis - 10}" y2="${asisY}" stroke="${INK}" stroke-width="1.6"/>`

  const kelias = taskai.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(p.reiksme).toFixed(1)}`).join(' ')
  t += `<path d="${kelias}" fill="none" stroke="${ORANGE}" stroke-width="2.4" stroke-linejoin="round"/>`

  taskai.forEach((p, i) => {
    t += `<circle cx="${x(i)}" cy="${y(p.reiksme).toFixed(1)}" r="4.5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
    t += txt(x(i), asisY + 18, p.zyme, 11, INK, 600)
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Skritulinė diagrama ─────────────────────────────────────────────────────

export type SkritulioDalis = { vardas: string; dalys: number }

/**
 * Skritulinė diagrama su vienodo dydžio sektoriais.
 *
 * Ketvirtoje klasėje skritulys dalijamas į lygias dalis — pusę, ketvirtį,
 * aštuntadalį — tad ir dalys nurodomos vienodų sektorių skaičiumi. Užrašai
 * dedami už skritulio, kad nedengtų sektorių ribų.
 */
export function skritulineDiagrama(dalys: readonly SkritulioDalis[], visoDaliu: number): string {
  const r = 62
  const c = r + 16
  const plotis = 2 * c + 150
  const aukstis = 2 * c

  const taskas = (dalis: number) => {
    const kampas = (dalis / visoDaliu) * 2 * Math.PI - Math.PI / 2
    return [c + r * Math.cos(kampas), c + r * Math.sin(kampas)]
  }

  let t = ''
  let nuo = 0
  dalys.forEach((d, i) => {
    const [x1, y1] = taskas(nuo)
    const [x2, y2] = taskas(nuo + d.dalys)
    const didelis = d.dalys * 2 > visoDaliu ? 1 : 0
    t += `<path d="M${c} ${c} L${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${didelis} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${ORANGE}" fill-opacity="${0.1 + i * 0.3}" stroke="${INK}" stroke-width="1.5"/>`
    nuo += d.dalys
  })

  // Legenda dešinėje: langelis su ta pačia spalva ir pavadinimas.
  dalys.forEach((d, i) => {
    const y = 24 + i * 24
    t += `<rect x="${2 * c + 6}" y="${y - 10}" width="14" height="14" fill="${ORANGE}" fill-opacity="${0.1 + i * 0.3}" stroke="${INK}" stroke-width="1.2"/>`
    t += `<text x="${2 * c + 26}" y="${y + 2}" font-size="12" fill="${INK}" text-anchor="start">${d.vardas}</text>`
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Tikimybės ───────────────────────────────────────────────────────────────

/** Maišelis su dviejų spalvų rutuliukais. */
export function maiselis(tamsiu: number, sviesiu: number): string {
  const r = 11
  const eileje = 6
  const viso = tamsiu + sviesiu
  const eiluciu = Math.ceil(viso / eileje)
  const plotis = 40 + eileje * (2 * r + 6)
  const aukstis = 52 + eiluciu * (2 * r + 6)

  let t = `<path d="M14 26 q0 -14 ${plotis / 2 - 14} -14 q${plotis / 2 - 14} 0 ${plotis / 2 - 14} 14 v${aukstis - 40} q0 12 -${plotis / 2 - 14} 12 q-${plotis / 2 - 14} 0 -${plotis / 2 - 14} -12 Z" fill="none" stroke="${INK}" stroke-width="1.8"/>`
  for (let i = 0; i < viso; i += 1) {
    const cx = 26 + (i % eileje) * (2 * r + 6)
    const cy = 42 + Math.floor(i / eileje) * (2 * r + 6)
    const tamsus = i < tamsiu
    t += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${tamsus ? ORANGE : 'none'}" fill-opacity="${tamsus ? 0.6 : 1}" stroke="${INK}" stroke-width="1.4"/>`
  }
  return svgRemas(plotis, aukstis, t)
}

/** Šešiasienis kauliukas su taškais. */
export function kauliukas(akuciu: number): string {
  const dydis = 74
  const r = 5.5
  const vietos: Record<number, [number, number][]> = {
    1: [[0.5, 0.5]],
    2: [
      [0.28, 0.28],
      [0.72, 0.72],
    ],
    3: [
      [0.28, 0.28],
      [0.5, 0.5],
      [0.72, 0.72],
    ],
    4: [
      [0.28, 0.28],
      [0.72, 0.28],
      [0.28, 0.72],
      [0.72, 0.72],
    ],
    5: [
      [0.28, 0.28],
      [0.72, 0.28],
      [0.5, 0.5],
      [0.28, 0.72],
      [0.72, 0.72],
    ],
    6: [
      [0.28, 0.24],
      [0.72, 0.24],
      [0.28, 0.5],
      [0.72, 0.5],
      [0.28, 0.76],
      [0.72, 0.76],
    ],
  }
  let t = `<rect x="5" y="5" width="${dydis - 10}" height="${dydis - 10}" rx="10" fill="none" stroke="${INK}" stroke-width="2"/>`
  for (const [fx, fy] of vietos[akuciu] ?? []) {
    t += `<circle cx="${5 + fx * (dydis - 10)}" cy="${5 + fy * (dydis - 10)}" r="${r}" fill="${INK}"/>`
  }
  return svgRemas(dydis, dydis, t)
}

/** Moneta — herbas arba skaičius. */
export function moneta(pusė: 'herbas' | 'skaicius'): string {
  const dydis = 74
  const c = dydis / 2
  let t = `<circle cx="${c}" cy="${c}" r="${c - 6}" fill="${ORANGE}" fill-opacity="0.18" stroke="${INK}" stroke-width="2"/>`
  t += `<circle cx="${c}" cy="${c}" r="${c - 12}" fill="none" stroke="${INK}" stroke-width="1"/>`
  if (pusė === 'skaicius') {
    t += txt(c, c + 8, '1', 26, INK, 700)
  } else {
    // Herbas — supaprastintas skydas.
    t += `<path d="M${c} ${c - 15} l13 6 v10 q0 12 -13 18 q-13 -6 -13 -18 v-10 z" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`
  }
  return svgRemas(dydis, dydis, t)
}

/**
 * Tikimybės skalė nuo 0 iki 1 su pažymėta vieta.
 *
 * Ketvirtoje klasėje tikimybė dar nesukama į trupmenas; svarbu suvokti, kad
 * neįmanomas įvykis yra 0, būtinas — 1, o visa kita — tarp jų.
 */
export function tikimybesSkale(dalis: number, visoDaliu: number, zyme = '?'): string {
  const plotis = 420
  const krastas = 40
  const asis = 46
  const aukstis = 88
  const ilgis = plotis - 2 * krastas

  let t = `<line x1="${krastas}" y1="${asis}" x2="${krastas + ilgis}" y2="${asis}" stroke="${INK}" stroke-width="2"/>`
  for (let i = 0; i <= visoDaliu; i += 1) {
    const x = krastas + (i / visoDaliu) * ilgis
    const galas = i === 0 || i === visoDaliu
    t += `<line x1="${x}" y1="${asis - (galas ? 9 : 5)}" x2="${x}" y2="${asis + (galas ? 9 : 5)}" stroke="${INK}" stroke-width="${galas ? 2 : 1}"/>`
  }
  t += txt(krastas, asis + 24, '0', 12, INK, 700)
  t += txt(krastas + ilgis, asis + 24, '1', 12, INK, 700)
  t += txt(krastas, asis - 20, 'neįmanoma', 10, MUTED)
  t += txt(krastas + ilgis, asis - 20, 'būtina', 10, MUTED)

  const x = krastas + (dalis / visoDaliu) * ilgis
  t += `<circle cx="${x}" cy="${asis}" r="6" fill="${ORANGE}" stroke="${INK}" stroke-width="1.6"/>`
  t += txt(x, asis + 24, zyme, 12, INK, 700)
  return svgRemas(plotis, aukstis, t)
}

/** Bandymų rezultatų brūkšneliai. */
export function bruksneliuLentele(eilutes: readonly { vardas: string; kiek: number }[]): string {
  const eilute = 30
  const kaire = 96
  const plotis = kaire + 5 * 42 + 40
  const aukstis = eilutes.length * eilute + 16

  let t = `<rect x="1" y="1" width="${plotis - 2}" height="${aukstis - 2}" rx="6" fill="none" stroke="${INK}" stroke-width="1.3"/>`
  eilutes.forEach((e, i) => {
    const y = 8 + i * eilute
    if (i > 0) t += `<line x1="6" y1="${y}" x2="${plotis - 6}" y2="${y}" stroke="${LINE}" stroke-width="1"/>`
    t += `<text x="14" y="${y + 20}" font-size="13" fill="${INK}" text-anchor="start">${e.vardas}</text>`
    // Brūkšneliai grupuojami po penkis — kaip skaičiuojama iš tikrųjų.
    for (let b = 0; b < e.kiek; b += 1) {
      const grupe = Math.floor(b / 5)
      const vietoje = b % 5
      const x = kaire + grupe * 42 + vietoje * 8
      if (vietoje === 4) {
        t += `<line x1="${x - 32}" y1="${y + 20}" x2="${x + 3}" y2="${y + 6}" stroke="${INK}" stroke-width="1.6"/>`
      } else {
        t += `<line x1="${x}" y1="${y + 6}" x2="${x}" y2="${y + 20}" stroke="${INK}" stroke-width="1.6"/>`
      }
    }
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Blokinė schema ──────────────────────────────────────────────────────────

export type Blokas = { tekstas: string; tipas: 'pradzia' | 'veiksmas' | 'salyga' | 'pabaiga' }

/**
 * Algoritmo blokinė schema.
 *
 * Sąlygos blokas piešiamas rombu, veiksmo — stačiakampiu, pradžia ir pabaiga —
 * suapvalintais. Būtent iš formos matyti, kur algoritmas šakojasi.
 */
export function blokuSchema(blokai: readonly Blokas[]): string {
  const w = 190
  const h = 42
  const tarpas = 26
  const plotis = w + 60
  const aukstis = blokai.length * (h + tarpas) + 16
  const cx = plotis / 2

  let t = ''
  blokai.forEach((b, i) => {
    const y = 8 + i * (h + tarpas)
    if (b.tipas === 'salyga') {
      t += `<polygon points="${cx},${y} ${cx + w / 2},${y + h / 2} ${cx},${y + h} ${cx - w / 2},${y + h / 2}" fill="${ORANGE}" fill-opacity="0.16" stroke="${INK}" stroke-width="1.6"/>`
    } else {
      const r = b.tipas === 'veiksmas' ? 4 : h / 2
      t += `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${ORANGE}" fill-opacity="${b.tipas === 'veiksmas' ? 0.12 : 0.24}" stroke="${INK}" stroke-width="1.6"/>`
    }
    t += txt(cx, y + h / 2 + 4, b.tekstas, 12, INK, 600)
    if (i < blokai.length - 1) {
      t += `<line x1="${cx}" y1="${y + h}" x2="${cx}" y2="${y + h + tarpas - 6}" stroke="${INK}" stroke-width="1.4"/>`
      t += `<path d="M${cx} ${y + h + tarpas} l-4.5 -8 h9 z" fill="${INK}"/>`
    }
  })
  return svgRemas(plotis, aukstis, t)
}
