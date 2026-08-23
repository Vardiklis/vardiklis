import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 3 klasės temoms „Lygtys ir raidiniai reiškiniai“, „Trupmenos“,
 * „Duomenys. Algoritmai“ ir „Tyrinėju reiškinį „Knyga““.
 *
 * Taisyklė ta pati kaip ir kitur: brėžinys pateikia duomenis, o klausimo tekstas
 * neišduoda to, ką iš jo reikia nustatyti. Todėl diagramos padalos vertė
 * neužrašoma žodžiais, o skaičių tiesėje ieškomos trupmenos vardas nerašomas.
 *
 * Padalos visur vienodo pločio ir matematiškai tikslios: trupmena $\tfrac{3}{4}$
 * stovi lygiai ties trečia iš keturių padalų, o diagramos stulpelio aukštis
 * atitinka jo reikšmę.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

/** Trupmena su brūkšniu — taip, kaip rašoma sąsiuvinyje. */
function trupmenosZyme(x: number, y: number, skaitiklis: number, vardiklis: number): string {
  return (
    txt(x, y - 4, String(skaitiklis), 11, INK, 700) +
    `<line x1="${x - 8}" y1="${y}" x2="${x + 8}" y2="${y}" stroke="${INK}" stroke-width="1.3"/>` +
    txt(x, y + 13, String(vardiklis), 11, INK, 700)
  )
}

// ── Trupmenos skaičių tiesėje ───────────────────────────────────────────────

export type TrupmenosTaskas = {
  /** Kelinta padala nuo nulio. */
  skaitiklis: number
  /** Raidė virš taško; be jos taškas lieka neįvardytas. */
  raide?: string
  /** Ar po tašku rašyti pačią trupmeną. */
  rodytiTrupmena?: boolean
}

/**
 * Skaičių tiesė nuo 0 iki `vienetu`, kurios kiekvienas vienetas padalytas į
 * `vardiklis` lygių dalių.
 *
 * Padalos išdėstomos vienodais tarpais, o sveikieji skaičiai pažymimi
 * storesniu brūkšniu — kitaip trupmenos praranda atskaitos tašką.
 */
export function trupmenuTiese(
  vardiklis: number,
  taskai: readonly TrupmenosTaskas[] = [],
  vienetu = 1,
): string {
  const padalu = vardiklis * vienetu
  const tarpas = Math.max(30, Math.min(64, Math.round(520 / padalu)))
  const krastas = 34
  const asis = 62
  const plotis = krastas * 2 + padalu * tarpas
  const aukstis = asis + 46
  const x = (n: number) => krastas + n * tarpas

  let t = `<line x1="${krastas - 16}" y1="${asis}" x2="${plotis - krastas + 16}" y2="${asis}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<path d="M${plotis - krastas + 16} ${asis} l-9 -4.5 v9 z" fill="${INK}"/>`

  for (let i = 0; i <= padalu; i += 1) {
    const sveikas = i % vardiklis === 0
    t += `<line x1="${x(i)}" y1="${asis - (sveikas ? 9 : 5)}" x2="${x(i)}" y2="${
      asis + (sveikas ? 9 : 5)
    }" stroke="${sveikas ? INK : LINE}" stroke-width="${sveikas ? 1.6 : 1.1}"/>`
    if (sveikas) t += txt(x(i), asis + 24, String(i / vardiklis), 12, INK, 700)
  }

  for (const p of taskai) {
    t += `<circle cx="${x(p.skaitiklis)}" cy="${asis}" r="5.5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
    if (p.raide) t += txt(x(p.skaitiklis), asis - 18, p.raide, 13, INK, 700)
    if (p.rodytiTrupmena) t += trupmenosZyme(x(p.skaitiklis), asis + 30, p.skaitiklis, vardiklis)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Svarstyklės lygčiai ─────────────────────────────────────────────────────

export type Lekste = {
  /** Kiek nežinomųjų dėžučių yra lėkštėje. */
  dezuciu: number
  /** Šalia gulinčių svarelių vertė; 0 — jų nėra. */
  svarelis: number
}

/**
 * Sverto schema lygčiai: abi pusės sveria vienodai.
 *
 * Nežinomasis piešiamas dėžute su raide, o ne skaičiumi — kaip tik jo reikšmę
 * ir reikia rasti. Lygios svarstyklės vaizdžiai parodo, kodėl lygtyje abiejose
 * pusėse turi likti tas pats.
 */
export function svarstykliuLygtis(kaire: Lekste, desine: Lekste, raide = 'x'): string {
  const plotis = 360
  const aukstis = 150
  const c = plotis / 2
  const sija = 52

  const lekste = (cx: number, o: Lekste) => {
    let r = `<line x1="${cx - 52}" y1="${sija}" x2="${cx + 52}" y2="${sija}" stroke="${INK}" stroke-width="2.4"/>`
    r += `<line x1="${cx}" y1="${sija}" x2="${cx}" y2="${sija - 12}" stroke="${INK}" stroke-width="1.6"/>`
    const daiktu = o.dezuciu + (o.svarelis > 0 ? 1 : 0)
    const w = 34
    const tarpas = 8
    const pradzia = cx - (daiktu * (w + tarpas) - tarpas) / 2
    for (let i = 0; i < o.dezuciu; i += 1) {
      const x = pradzia + i * (w + tarpas)
      r += `<rect x="${x}" y="${sija - 46}" width="${w}" height="${34}" rx="4" fill="${ORANGE}" fill-opacity="0.3" stroke="${INK}" stroke-width="1.6"/>`
      r += txt(x + w / 2, sija - 22, raide, 15, INK, 700)
    }
    if (o.svarelis > 0) {
      const x = pradzia + o.dezuciu * (w + tarpas)
      r += `<rect x="${x}" y="${sija - 46}" width="${w}" height="${34}" rx="4" fill="none" stroke="${INK}" stroke-width="1.6"/>`
      r += txt(x + w / 2, sija - 22, String(o.svarelis), 14, INK, 700)
    }
    return r
  }

  let t = lekste(c - 92, kaire) + lekste(c + 92, desine)
  // Stovas: trikampė atrama ir horizontali sija — svarstyklės pusiausvyroje.
  t += `<line x1="${c - 144}" y1="${sija + 14}" x2="${c + 144}" y2="${sija + 14}" stroke="${INK}" stroke-width="2.4"/>`
  t += `<line x1="${c - 92}" y1="${sija}" x2="${c - 92}" y2="${sija + 14}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<line x1="${c + 92}" y1="${sija}" x2="${c + 92}" y2="${sija + 14}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<path d="M${c} ${sija + 14} L${c - 26} ${aukstis - 12} L${c + 26} ${aukstis - 12} Z" fill="none" stroke="${INK}" stroke-width="2"/>`
  t += `<line x1="${c - 40}" y1="${aukstis - 12}" x2="${c + 40}" y2="${aukstis - 12}" stroke="${INK}" stroke-width="2.4"/>`
  return svgRemas(plotis, aukstis, t)
}

// ── Raidinio reiškinio modelis ──────────────────────────────────────────────

/**
 * Dėžutės su nežinomu kiekiu ir pavieniai objektai greta.
 *
 * Iš tokio piešinio užrašomas reiškinys $a + 7$ arba $4 \cdot b$: dėžučių
 * skaičius rodo daugiklį, o pavieniai objektai — pridedamą skaičių.
 */
export function raidinioModelis(dezuciu: number, pavieniu: number, raide = 'a'): string {
  const w = 46
  const h = 40
  const tarpas = 10
  const r = 8
  const krastas = 12
  const plotis =
    krastas * 2 + dezuciu * (w + tarpas) + (pavieniu > 0 ? 18 + pavieniu * (2 * r + 6) : 0)
  const aukstis = krastas * 2 + h

  let t = ''
  for (let i = 0; i < dezuciu; i += 1) {
    const x = krastas + i * (w + tarpas)
    t += `<rect x="${x}" y="${krastas}" width="${w}" height="${h}" rx="5" fill="${ORANGE}" fill-opacity="0.28" stroke="${INK}" stroke-width="1.8"/>`
    t += txt(x + w / 2, krastas + h / 2 + 6, raide, 17, INK, 700)
  }
  const pradzia = krastas + dezuciu * (w + tarpas) + 8
  for (let i = 0; i < pavieniu; i += 1) {
    t += `<circle cx="${pradzia + r + i * (2 * r + 6)}" cy="${krastas + h / 2}" r="${r}" fill="${ORANGE}" fill-opacity="0.6" stroke="${INK}" stroke-width="1.3"/>`
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Stulpelinė diagrama su padalos verte ────────────────────────────────────

export type Stulpelis = { vardas: string; reiksme: number }

/**
 * Stulpelinė diagrama, kurios viena padala verta `padala` vienetų.
 *
 * Ašyje pasirašomos tik kas antra padala — kitaip padalos vertės klausimas
 * netektų prasmės: ją reikia nustatyti iš to, kur stovi užrašyti skaičiai.
 */
export function diagramaSuPadala(
  stulpeliai: readonly Stulpelis[],
  padala: number,
  zymetiKas = 2,
): string {
  const krastas = 14
  const asisPlotis = 32
  const plotis1 = 46
  const tarpas = 16
  const vienetas = 20
  const maks = Math.ceil(Math.max(...stulpeliai.map((s) => s.reiksme)) / padala) + 1
  const plotis = krastas * 2 + asisPlotis + stulpeliai.length * (plotis1 + tarpas)
  const dugnas = krastas + maks * vienetas
  const aukstis = dugnas + 28

  let t = ''
  for (let i = 0; i <= maks; i += 1) {
    const y = dugnas - i * vienetas
    t += `<line x1="${krastas + asisPlotis}" y1="${y}" x2="${plotis - krastas}" y2="${y}" stroke="${LINE}" stroke-width="1"/>`
    if (i % zymetiKas === 0) {
      t += `<text x="${krastas + asisPlotis - 6}" y="${y + 4}" font-size="10" fill="${MUTED}" text-anchor="end">${
        i * padala
      }</text>`
    }
  }
  t += `<line x1="${krastas + asisPlotis}" y1="${krastas}" x2="${krastas + asisPlotis}" y2="${dugnas}" stroke="${INK}" stroke-width="1.5"/>`

  stulpeliai.forEach((s, i) => {
    const x = krastas + asisPlotis + tarpas / 2 + i * (plotis1 + tarpas)
    const h = (s.reiksme / padala) * vienetas
    t += `<rect x="${x}" y="${dugnas - h}" width="${plotis1}" height="${h}" fill="${ORANGE}" fill-opacity="0.35" stroke="${INK}" stroke-width="1.5"/>`
    t += txt(x + plotis1 / 2, dugnas + 17, s.vardas, 11, INK)
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Suktukas tikimybei ──────────────────────────────────────────────────────

/**
 * Suktukas su vienodais sektoriais.
 *
 * Sektoriai lygūs, tad tikėtinumą galima nustatyti tiesiog juos suskaičiavus —
 * o tam reikia pamatyti, ne perskaityti.
 */
export function suktuvas(sektoriai: readonly { spalva: 'tamsi' | 'sviesi' }[]): string {
  const n = sektoriai.length
  const r = 62
  const c = r + 14
  const dydis = 2 * c

  const taskas = (i: number) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    return [c + r * Math.cos(a), c + r * Math.sin(a)]
  }

  let t = ''
  sektoriai.forEach((s, i) => {
    const [x1, y1] = taskas(i)
    const [x2, y2] = taskas(i + 1)
    t += `<path d="M${c} ${c} L${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 1 ${x2.toFixed(
      1,
    )} ${y2.toFixed(1)} Z" fill="${s.spalva === 'tamsi' ? ORANGE : 'none'}" fill-opacity="${
      s.spalva === 'tamsi' ? 0.55 : 1
    }" stroke="${INK}" stroke-width="1.5"/>`
  })
  // Rodyklė centre — kad būtų aišku, jog tai suktukas, o ne skritulio dalys.
  t += `<line x1="${c}" y1="${c}" x2="${c + r * 0.7}" y2="${c - r * 0.35}" stroke="${INK}" stroke-width="2.6"/>`
  t += `<circle cx="${c}" cy="${c}" r="5" fill="${INK}"/>`
  return svgRemas(dydis, dydis, t)
}

// ── Duomenų lentelė ─────────────────────────────────────────────────────────

/**
 * Lentelė su antraštėmis ir eilutėmis.
 *
 * Naudojama ten, kur uždavinio duomenys turi būti surandami, o ne perskaitomi
 * iš klausimo: knygų puslapiai, tiražai, dažnių lentelės.
 */
export function duomenuLentele(
  antrastes: readonly string[],
  eilutes: readonly (readonly (string | number)[])[],
): string {
  const eiluteH = 26
  const stulpelis = Math.max(96, Math.round(320 / antrastes.length))
  const plotis = stulpelis * antrastes.length + 4
  const aukstis = eiluteH * (eilutes.length + 1) + 4

  let t = ''
  antrastes.forEach((a, i) => {
    const x = 2 + i * stulpelis
    t += `<rect x="${x}" y="2" width="${stulpelis}" height="${eiluteH}" fill="${ORANGE}" fill-opacity="0.25" stroke="${INK}" stroke-width="1.3"/>`
    t += txt(x + stulpelis / 2, eiluteH - 8, a, 12, INK, 700)
  })
  eilutes.forEach((e, r) => {
    const y = eiluteH * (r + 1) + 2
    e.forEach((v, i) => {
      const x = 2 + i * stulpelis
      t += `<rect x="${x}" y="${y}" width="${stulpelis}" height="${eiluteH}" fill="none" stroke="${LINE}" stroke-width="1.1"/>`
      t += txt(x + stulpelis / 2, y + eiluteH - 9, String(v), 12, INK, i === 0 ? 400 : 600)
    })
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Laiko juosta ────────────────────────────────────────────────────────────

/**
 * Laiko juosta su vienodais tarpais tarp metų.
 *
 * Metai išdėstomi proporcingai — tarpas tarp 1500 ir 1700 dvigubai ilgesnis už
 * tarpą tarp 1900 ir 2000. Trūkstama data pažymima klaustuku.
 */
export function laikoJuosta(metai: readonly number[], trukstamas?: number): string {
  const nuo = Math.min(...metai)
  const iki = Math.max(...metai)
  // Kraštinė atsarga didesnė už rodyklės ilgį: kitaip paskutinė data atsiduria
  // po pačiu ašies smaigaliu ir su juo susilieja.
  const krastas = 62
  const plotis = 560
  const asis = 60
  const aukstis = asis + 40
  const x = (m: number) => krastas + ((m - nuo) / (iki - nuo)) * (plotis - 2 * krastas)

  let t = `<line x1="${krastas - 18}" y1="${asis}" x2="${plotis - krastas + 18}" y2="${asis}" stroke="${INK}" stroke-width="1.8"/>`
  t += `<path d="M${plotis - krastas + 18} ${asis} l-9 -4.5 v9 z" fill="${INK}"/>`
  for (const m of metai) {
    const paslepta = m === trukstamas
    t += `<line x1="${x(m)}" y1="${asis - 10}" x2="${x(m)}" y2="${asis + 10}" stroke="${INK}" stroke-width="1.6"/>`
    t += `<circle cx="${x(m)}" cy="${asis}" r="5" fill="${paslepta ? 'none' : ORANGE}" stroke="${INK}" stroke-width="1.4"${
      paslepta ? ' stroke-dasharray="3 3"' : ''
    }/>`
    t += txt(x(m), asis + 28, paslepta ? '?' : String(m), 12, paslepta ? MUTED : INK, 700)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Tinklelis algoritmams ───────────────────────────────────────────────────

/**
 * Tinklelis su startu, tikslu ir, jei reikia, kliūtimi.
 *
 * Kelias nepiešiamas: kaip tik jį mokinys ir turi sugalvoti. Langeliai vienodo
 * dydžio, tad komandų skaičių galima suskaičiuoti tiksliai.
 */
export function algoritmoTinklelis(
  stulpeliu: number,
  eiluciu: number,
  startas: { x: number; y: number },
  tikslas: { x: number; y: number },
  kliutys: readonly { x: number; y: number }[] = [],
): string {
  const L = 34
  const krastas = 12
  const plotis = krastas * 2 + stulpeliu * L
  const aukstis = krastas * 2 + eiluciu * L
  const c = (v: number) => krastas + v * L + L / 2

  let t = ''
  for (let i = 0; i <= stulpeliu; i += 1) {
    t += `<line x1="${krastas + i * L}" y1="${krastas}" x2="${krastas + i * L}" y2="${
      krastas + eiluciu * L
    }" stroke="${LINE}" stroke-width="1"/>`
  }
  for (let j = 0; j <= eiluciu; j += 1) {
    t += `<line x1="${krastas}" y1="${krastas + j * L}" x2="${krastas + stulpeliu * L}" y2="${
      krastas + j * L
    }" stroke="${LINE}" stroke-width="1"/>`
  }
  for (const k of kliutys) {
    t += `<rect x="${krastas + k.x * L + 3}" y="${krastas + k.y * L + 3}" width="${L - 6}" height="${
      L - 6
    }" fill="${MUTED}" fill-opacity="0.45" stroke="${INK}" stroke-width="1.2"/>`
  }
  t += `<circle cx="${c(startas.x)}" cy="${c(startas.y)}" r="11" fill="${ORANGE}" fill-opacity="0.4" stroke="${INK}" stroke-width="1.6"/>`
  t += txt(c(startas.x), c(startas.y) + 5, 'A', 13, INK, 700)
  t += `<rect x="${krastas + tikslas.x * L + 6}" y="${krastas + tikslas.y * L + 6}" width="${
    L - 12
  }" height="${L - 12}" fill="none" stroke="${INK}" stroke-width="2"/>`
  t += txt(c(tikslas.x), c(tikslas.y) + 5, 'B', 13, INK, 700)
  return svgRemas(plotis, aukstis, t)
}

/** Vėžliuko nubrėžtas kelias — XLogo komandų rezultatas. */
export function vezliukoKelias(atkarpos: readonly { dx: number; dy: number }[]): string {
  const L = 26
  const krastas = 26
  const taskai = [{ x: 0, y: 0 }]
  for (const a of atkarpos) {
    const p = taskai[taskai.length - 1]
    taskai.push({ x: p.x + a.dx, y: p.y + a.dy })
  }
  const minX = Math.min(...taskai.map((p) => p.x))
  const minY = Math.min(...taskai.map((p) => p.y))
  const maksX = Math.max(...taskai.map((p) => p.x))
  const maksY = Math.max(...taskai.map((p) => p.y))
  const plotis = krastas * 2 + (maksX - minX) * L
  const aukstis = krastas * 2 + (maksY - minY) * L
  const px = (v: number) => krastas + (v - minX) * L
  const py = (v: number) => krastas + (v - minY) * L

  let t = `<path d="${taskai
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p.x)} ${py(p.y)}`)
    .join(' ')}" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`
  // Vėžliukas pradžioje — trikampis, nukreiptas į pirmojo žingsnio pusę.
  const pirmas = atkarpos[0] ?? { dx: 1, dy: 0 }
  const kampas = Math.atan2(pirmas.dy, pirmas.dx)
  const g = 9
  t += `<path d="M${(px(0) + g * Math.cos(kampas)).toFixed(1)} ${(py(0) + g * Math.sin(kampas)).toFixed(
    1,
  )} L${(px(0) + g * Math.cos(kampas + 2.4)).toFixed(1)} ${(
    py(0) +
    g * Math.sin(kampas + 2.4)
  ).toFixed(1)} L${(px(0) + g * Math.cos(kampas - 2.4)).toFixed(1)} ${(
    py(0) +
    g * Math.sin(kampas - 2.4)
  ).toFixed(1)} Z" fill="${ORANGE}" stroke="${INK}" stroke-width="1.2"/>`
  return svgRemas(plotis, aukstis, t)
}
