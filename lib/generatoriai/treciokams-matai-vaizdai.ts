import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 3 klasės temoms „Daugiakampio perimetras“, „Laikas“ ir
 * „Tyrinėju reiškinį „Pinigai““.
 *
 * Figūros braižomos matematiškai tiksliai: stačiakampio kraštinių santykis
 * atitinka užrašytus ilgius, trikampio trečioji viršūnė randama pagal
 * kosinusų teoremą, o taisyklingojo daugiakampio visos kraštinės tikrai lygios.
 * Netikslus brėžinys mokytų blogiau nei jokio: vaikas matuoja akimis.
 *
 * Spalvos rašomos kintamaisiais, kad išspausdinus juodai baltai viskas liktų
 * atpažįstama.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

export type Taskas = { x: number; y: number }

/** Vienas centimetras brėžinyje. */
const CM = 15

/** Daugiakampio kontūras su kraštinių užrašais viduryje kiekvienos kraštinės. */
export function figuraSuUzrasais(
  taskai: readonly Taskas[],
  uzrasai: readonly (string | null)[],
  krastas = 34,
): string {
  const minX = Math.min(...taskai.map((t) => t.x))
  const minY = Math.min(...taskai.map((t) => t.y))
  const p = taskai.map((t) => ({ x: t.x - minX + krastas, y: t.y - minY + krastas }))
  const plotis = Math.max(...p.map((t) => t.x)) + krastas
  const aukstis = Math.max(...p.map((t) => t.y)) + krastas

  /** Ar taškas yra daugiakampio viduje — spindulio metodas. */
  const viduje = (x: number, y: number) => {
    let vidus = false
    for (let i = 0, j = p.length - 1; i < p.length; j = i, i += 1) {
      const kertaY = p[i].y > y !== p[j].y > y
      if (kertaY && x < ((p[j].x - p[i].x) * (y - p[i].y)) / (p[j].y - p[i].y) + p[i].x) {
        vidus = !vidus
      }
    }
    return vidus
  }

  let t = `<path d="${p.map((q, i) => `${i === 0 ? 'M' : 'L'}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(' ')} Z" fill="${ORANGE}" fill-opacity="0.12" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`

  // Daugiakampio apėjimo kryptis — pagal ją atpažįstamos įdubusios viršūnės.
  const plotasZenklas = Math.sign(
    p.reduce((s, q, i) => {
      const kitas = p[(i + 1) % p.length]
      return s + (q.x * kitas.y - kitas.x * q.y)
    }, 0),
  )
  const idubusi = (i: number) => {
    const pries = p[(i - 1 + p.length) % p.length]
    const dabar = p[i]
    const po = p[(i + 1) % p.length]
    const kryzmine =
      (dabar.x - pries.x) * (po.y - dabar.y) - (dabar.y - pries.y) * (po.x - dabar.x)
    return Math.sign(kryzmine) !== plotasZenklas && kryzmine !== 0
  }

  p.forEach((q, i) => {
    const uzrasas = uzrasai[i]
    if (!uzrasas) return
    const kitas = p[(i + 1) % p.length]
    // Prie įdubusios viršūnės susieina dvi trumpos kraštinės, ir jų vidurio
    // užrašai atsiduria vienas ant kito. Todėl užrašas paslenkamas tolyn nuo
    // tokios viršūnės.
    const nuoPradzios = idubusi(i)
    const nuoGalo = idubusi((i + 1) % p.length)
    const dalis = nuoPradzios && !nuoGalo ? 0.68 : nuoGalo && !nuoPradzios ? 0.32 : 0.5
    const vx = q.x + (kitas.x - q.x) * dalis
    const vy = q.y + (kitas.y - q.y) * dalis
    // Užrašas stumiamas statmenai savo kraštinei ir būtinai į figūros išorę.
    // Stūmimas nuo figūros centro tinka tik iškiliems daugiakampiams: laiptuotos
    // figūros įduboje jis užrašus suvarytų vieną ant kito.
    const dx = kitas.x - q.x
    const dy = kitas.y - q.y
    const ilgis = Math.hypot(dx, dy) || 1
    let nx = dy / ilgis
    let ny = -dx / ilgis
    if (viduje(vx + nx * 6, vy + ny * 6)) {
      nx = -nx
      ny = -ny
    }
    t += txt(vx + nx * 15, vy + ny * 15 + 4, uzrasas, 11, INK, 600)
  })
  return svgRemas(plotis, aukstis, t)
}

/**
 * Stačiakampis su pasirašytais kraštinių ilgiais.
 *
 * `rodyti` valdo, kiek ilgių užrašoma: „visos“ tinka, kai reikia vien sudėti,
 * „abi“ — kai mokinys turi prisiminti, kad priešingos kraštinės lygios, o
 * „viena“ — kai antrąją kraštinę reikia rasti iš perimetro.
 */
export function staciakampisSuMatais(
  a: number,
  b: number,
  rodyti: 'viena' | 'abi' | 'visos' = 'abi',
): string {
  const A = a * CM
  const B = b * CM
  const taskai = [
    { x: 0, y: 0 },
    { x: A, y: 0 },
    { x: A, y: B },
    { x: 0, y: B },
  ]
  const uzrasai =
    rodyti === 'visos'
      ? [`${a} cm`, `${b} cm`, `${a} cm`, `${b} cm`]
      : rodyti === 'abi'
        ? [`${a} cm`, `${b} cm`, null, null]
        : [`${a} cm`, null, null, null]
  return figuraSuUzrasais(taskai, uzrasai)
}

/**
 * Trikampis su pasirašytomis kraštinėmis.
 *
 * Trečioji viršūnė randama pagal kosinusų teoremą, tad brėžinio kraštinių
 * santykiai atitinka užrašytus ilgius.
 */
export function trikampisSuMatais(a: number, b: number, c: number): string {
  // a — apatinė kraštinė; b eina iš kairiosios viršūnės, c — iš dešiniosios.
  if (a + b <= c || a + c <= b || b + c <= a) return ''
  const kampas = Math.acos((a * a + b * b - c * c) / (2 * a * b))
  const taskai = [
    { x: 0, y: 0 },
    { x: a * CM, y: 0 },
    { x: b * CM * Math.cos(kampas), y: -b * CM * Math.sin(kampas) },
  ]
  return figuraSuUzrasais(taskai, [`${a} cm`, `${c} cm`, `${b} cm`])
}

/** Taisyklingasis daugiakampis; pasirašoma viena kraštinė. */
export function taisyklingasSuMatais(n: number, krastine: number): string {
  // Iš kraštinės ilgio randamas apibrėžtinio apskritimo spindulys.
  const r = (krastine * CM) / (2 * Math.sin(Math.PI / n))
  // Lyginio kraštinių skaičiaus figūros pasukamos per pusę žingsnio, kad
  // kvadratas stovėtų ant kraštinės, o ne ant kampo.
  const posukis = n % 2 === 0 ? Math.PI / n : 0
  const taskai = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2 + posukis
    return { x: r * Math.cos(a), y: r * Math.sin(a) }
  })
  const uzrasai = taskai.map((_, i) => (i === 0 ? `${krastine} cm` : null))
  return figuraSuUzrasais(taskai, uzrasai)
}

/**
 * Laiptuota figūra — šešiakampis iš stačių kampų.
 *
 * Visos kraštinės lygiagrečios ašims, tad kiekvieno ilgio galima laikytis
 * tiksliai; laisvos formos penkiakampio su nurodytais ilgiais nubraižyti
 * tiksliai nepavyktų.
 */
export function laiptuotaFigura(a: number, b: number, c: number, d: number): string {
  const taskai = [
    { x: 0, y: 0 },
    { x: a * CM, y: 0 },
    { x: a * CM, y: b * CM },
    { x: (a + c) * CM, y: b * CM },
    { x: (a + c) * CM, y: (b + d) * CM },
    { x: 0, y: (b + d) * CM },
  ]
  return figuraSuUzrasais(taskai, [
    `${a} cm`,
    `${b} cm`,
    `${c} cm`,
    `${d} cm`,
    `${a + c} cm`,
    `${b + d} cm`,
  ])
}

/** Langelių tinklelis su nubrėžtu stačiakampiu — perimetrui skaičiuoti langeliais. */
export function tinklelisSuStaciakampiu(
  stulpeliu: number,
  eiluciu: number,
  plotis: number,
  aukstis: number,
): string {
  const L = 20
  const krastas = 12
  const w = krastas * 2 + stulpeliu * L
  const h = krastas * 2 + eiluciu * L

  let t = ''
  for (let i = 0; i <= stulpeliu; i += 1) {
    t += `<line x1="${krastas + i * L}" y1="${krastas}" x2="${krastas + i * L}" y2="${krastas + eiluciu * L}" stroke="${LINE}" stroke-width="1"/>`
  }
  for (let j = 0; j <= eiluciu; j += 1) {
    t += `<line x1="${krastas}" y1="${krastas + j * L}" x2="${krastas + stulpeliu * L}" y2="${krastas + j * L}" stroke="${LINE}" stroke-width="1"/>`
  }
  t += `<rect x="${krastas + L}" y="${krastas + L}" width="${plotis * L}" height="${aukstis * L}" fill="${ORANGE}" fill-opacity="0.18" stroke="${INK}" stroke-width="2"/>`
  return svgRemas(w, h, t)
}

// ── Laikas ──────────────────────────────────────────────────────────────────

export type TvarkarascioEilute = { pavadinimas: string; nuo: string; iki: string }

/**
 * Tvarkaraštis lentele.
 *
 * Laikai rašomi tik lentelėje: uždavinio tekste jų nekartojame, nes surasti
 * reikiamą eilutę ir yra pirmasis uždavinio žingsnis.
 */
export function tvarkarastis(eilutes: readonly TvarkarascioEilute[], antraste = 'Pamoka'): string {
  const eiluteH = 26
  const plotis = 300
  const aukstis = eiluteH * (eilutes.length + 1) + 4

  let t = `<rect x="2" y="2" width="${plotis - 4}" height="${eiluteH}" fill="${ORANGE}" fill-opacity="0.25" stroke="${INK}" stroke-width="1.3"/>`
  t += `<text x="14" y="${eiluteH - 8}" font-size="12" fill="${INK}" font-weight="700">${antraste}</text>`
  t += `<text x="${plotis - 14}" y="${eiluteH - 8}" font-size="12" fill="${INK}" font-weight="700" text-anchor="end">Laikas</text>`

  eilutes.forEach((e, i) => {
    const y = eiluteH * (i + 1) + 2
    t += `<rect x="2" y="${y}" width="${plotis - 4}" height="${eiluteH}" fill="none" stroke="${LINE}" stroke-width="1.1"/>`
    t += `<text x="14" y="${y + eiluteH - 9}" font-size="12" fill="${INK}">${e.pavadinimas}</text>`
    t += `<text x="${plotis - 14}" y="${y + eiluteH - 9}" font-size="12" fill="${INK}" font-weight="600" text-anchor="end">${e.nuo}–${e.iki}</text>`
  })
  return svgRemas(plotis, aukstis, t)
}

/**
 * Mėnesio kalendorius.
 *
 * Savaitė prasideda pirmadieniu, kaip Lietuvoje. `pazymeta` diena apvedama —
 * ja remiasi klausimas, o savaitės dienos pavadinimas iš stulpelio nuskaitomas
 * pats, todėl tekste jo nerašome.
 */
export function kalendorius(dienu: number, pirmaDiena: number, pazymeta?: number): string {
  const SAVAITE = ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk']
  const L = 30
  const krastas = 10
  const antraste = 22
  const eiluciu = Math.ceil((pirmaDiena + dienu) / 7)
  const plotis = krastas * 2 + 7 * L
  const aukstis = krastas * 2 + antraste + eiluciu * L

  let t = ''
  SAVAITE.forEach((d, i) => {
    t += txt(krastas + i * L + L / 2, krastas + 14, d, 11, MUTED, 700)
  })
  for (let d = 1; d <= dienu; d += 1) {
    const vieta = pirmaDiena + d - 1
    const x = krastas + (vieta % 7) * L
    const y = krastas + antraste + Math.floor(vieta / 7) * L
    t += `<rect x="${x}" y="${y}" width="${L}" height="${L}" fill="none" stroke="${LINE}" stroke-width="1"/>`
    if (d === pazymeta) {
      t += `<circle cx="${x + L / 2}" cy="${y + L / 2}" r="${L / 2 - 3}" fill="${ORANGE}" fill-opacity="0.35" stroke="${INK}" stroke-width="1.6"/>`
    }
    t += txt(x + L / 2, y + L / 2 + 4, String(d), 11, INK, d === pazymeta ? 700 : 400)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Pinigai ─────────────────────────────────────────────────────────────────

/**
 * Kainų etiketės.
 *
 * Sena kaina, kai ji nurodyta, perbraukiama — kaip parduotuvėje per išpardavimą.
 */
export function kainuEtiketes(
  etiketes: readonly { pavadinimas: string; kaina: number; senaKaina?: number }[],
): string {
  const w = 108
  const h = 62
  const tarpas = 12
  const krastas = 8
  const plotis = krastas * 2 + etiketes.length * (w + tarpas) - tarpas
  const aukstis = krastas * 2 + h

  let t = ''
  etiketes.forEach((e, i) => {
    const x = krastas + i * (w + tarpas)
    t += `<rect x="${x}" y="${krastas}" width="${w}" height="${h}" rx="8" fill="${ORANGE}" fill-opacity="0.12" stroke="${INK}" stroke-width="1.6"/>`
    t += txt(x + w / 2, krastas + 18, e.pavadinimas, 11, INK, 600)
    if (e.senaKaina !== undefined) {
      t += txt(x + w / 2, krastas + 36, `${e.senaKaina} Eur`, 12, MUTED, 400)
      t += `<line x1="${x + w / 2 - 26}" y1="${krastas + 32}" x2="${x + w / 2 + 26}" y2="${krastas + 32}" stroke="${MUTED}" stroke-width="1.4"/>`
      t += txt(x + w / 2, krastas + 54, `${e.kaina} Eur`, 15, INK, 700)
    } else {
      t += txt(x + w / 2, krastas + 46, `${e.kaina} Eur`, 17, INK, 700)
    }
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Daugyba stulpeliu ───────────────────────────────────────────────────────

/**
 * Daugyba stulpeliu — daugiaženklis skaičius iš vienaženklio.
 *
 * Skyrių išsidėstymas vienas po kitu yra pati mokoma dalis: iš eilutės
 * $348 \cdot 6$ nematyti, kuris skaitmuo su kuriuo dauginamas.
 */
export function stulpeliuDaugyba(a: number, b: number, atsakymas?: number): string {
  const skaitmuo = 24
  const ilgis = Math.max(String(a).length, String(atsakymas ?? a * b).length)
  const desinysis = 40 + ilgis * skaitmuo
  const plotis = desinysis + 24
  const aukstis = 126

  const eilute = (n: number, y: number) => {
    const s = String(n)
    let r = ''
    for (let i = 0; i < s.length; i += 1) {
      const x = desinysis - (s.length - 1 - i) * skaitmuo
      r += `<text x="${x}" y="${y}" font-size="22" fill="${INK}" text-anchor="middle">${s[i]}</text>`
    }
    return r
  }

  const kairysis = desinysis - (ilgis - 1) * skaitmuo
  let t = eilute(a, 36)
  t += `<text x="${kairysis - skaitmuo}" y="70" font-size="22" fill="${INK}" text-anchor="middle">×</text>`
  t += eilute(b, 70)
  t += `<line x1="${kairysis - skaitmuo - 10}" y1="82" x2="${desinysis + 14}" y2="82" stroke="${INK}" stroke-width="2"/>`
  if (atsakymas === undefined) {
    t += `<rect x="${kairysis - 14}" y="90" width="${ilgis * skaitmuo + 4}" height="28" rx="4" fill="none" stroke="${MUTED}" stroke-width="1.4" stroke-dasharray="5 4"/>`
    t += txt((kairysis + desinysis) / 2, 110, '?', 18, MUTED, 700)
  } else {
    t += eilute(atsakymas, 110)
  }
  return svgRemas(plotis, aukstis, t)
}

/** Vienodos eilutės po tiek pat objektų — daugybai iš piešinio. */
export function taskuEilutes(eiluciu: number, eileje: number): string {
  const r = 8
  const tarpas = 10
  const krastas = 12
  const plotis = krastas * 2 + eileje * (2 * r + tarpas)
  const aukstis = krastas * 2 + eiluciu * (2 * r + tarpas)

  let t = ''
  for (let i = 0; i < eiluciu; i += 1) {
    for (let j = 0; j < eileje; j += 1) {
      const cx = krastas + r + j * (2 * r + tarpas)
      const cy = krastas + r + i * (2 * r + tarpas)
      t += `<path d="M${cx} ${cy - r} l${r * 0.3} ${r * 0.7} h${r * 0.7} l-${r * 0.55} ${r * 0.5} l${r * 0.22} ${r * 0.75} l-${r * 0.67} -${r * 0.45} l-${r * 0.67} ${r * 0.45} l${r * 0.22} -${r * 0.75} l-${r * 0.55} -${r * 0.5} h${r * 0.7} z" fill="${ORANGE}" fill-opacity="0.6" stroke="${INK}" stroke-width="1"/>`
    }
  }
  return svgRemas(plotis, aukstis, t)
}
