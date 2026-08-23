import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 2 klasės temai „Plokščiosios figūros“.
 *
 * Šioje temoje beveik nieko neskaičiuojama — atpažįstama. „Kuri laužtė
 * uždaroji?“, „Kur pažymėtas kampas?“, „Kuri figūra simetriška?“ yra klausimai
 * apie tai, ką mokinys mato, tad brėžinys čia yra pati sąlyga.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

function txt(x: number, y: number, t: string, dydis = 12, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

export type Taskas = { x: number; y: number }

/** Laužtės ir figūros brėžiamos viename langelyje — vienodo dydžio, sunumeruotos. */
const LANGELIS = 116
const KRASTAS = 10

function langelioTurinys(vidus: string, nr: number, dx: number): string {
  return (
    `<g transform="translate(${dx} 0)">${vidus}` +
    txt(LANGELIS / 2, LANGELIS + 16, String(nr), 13, MUTED, 700) +
    '</g>'
  )
}

/** Laužtė iš duotų taškų; uždaroji sujungiama atgal į pradžią. */
function lauztesKelias(taskai: readonly Taskas[], uzdara: boolean): string {
  const d = taskai.map((t, i) => `${i === 0 ? 'M' : 'L'}${t.x} ${t.y}`).join(' ')
  return (
    `<path d="${d}${uzdara ? ' Z' : ''}" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>` +
    taskai
      .map((t) => `<circle cx="${t.x}" cy="${t.y}" r="3" fill="${INK}"/>`)
      .join('')
  )
}

/**
 * Kelios laužtės greta, sunumeruotos.
 *
 * Uždaroji laužtė nuo atvirosios skiriasi tik tuo, ar pradžios ir pabaigos
 * taškai sutampa — todėl galai piešiami ryškiais taškais, kaip vadovėlyje.
 */
export function lauztes(variantai: readonly { taskai: readonly Taskas[]; uzdara: boolean }[]): string {
  const turinys = variantai
    .map((v, i) => langelioTurinys(lauztesKelias(v.taskai, v.uzdara), i + 1, KRASTAS + i * LANGELIS))
    .join('')
  return svgRemas(KRASTAS * 2 + variantai.length * LANGELIS, LANGELIS + 26, turinys)
}

/** Atsitiktinė laužtė iš `atkarpu` atkarpų, telpanti į langelį. */
export function lauztesTaskai(atkarpu: number, uzdara: boolean, sekla: number): Taskas[] {
  const c = LANGELIS / 2
  const r = 40
  const virsuniu = uzdara ? atkarpu : atkarpu + 1
  const taskai: Taskas[] = []
  for (let i = 0; i < virsuniu; i += 1) {
    if (uzdara) {
      // Uždaroji laužtė — taisyklingas daugiakampis: taip ji visada be
      // susikirtimų, o mokiniui matyti, kad galas sutampa su pradžia.
      const kampas = (i / virsuniu) * 2 * Math.PI - Math.PI / 2
      taskai.push({
        x: Math.round(c + r * Math.cos(kampas)),
        y: Math.round(c + r * Math.sin(kampas)),
      })
    } else {
      // Atviroji — zigzagas: viršūnės pakaitomis viršuje ir apačioje.
      const zingsnis = (2 * r) / (virsuniu - 1)
      taskai.push({
        x: Math.round(c - r + i * zingsnis),
        y: Math.round(c + (i % 2 === 0 ? -1 : 1) * (18 + ((sekla + i) % 3) * 6)),
      })
    }
  }
  return taskai
}

// ── Kampas ──────────────────────────────────────────────────────────────────

/**
 * Kampas: du bendrą pradžią turintys spinduliai.
 *
 * Viršūnė pažymima tašku ir raide, o pats kampas — lankeliu, kaip vadovėlyje.
 * `suLankeliu = false` piešia figūrą be kampo žymės — tokia reikalinga
 * uždaviniams „kuriame brėžinyje pažymėtas kampas?“.
 */
export function kampas(laipsniai: number, raide = 'A', suLankeliu = true): string {
  const dydis = LANGELIS
  // Bukojo kampo antroji kraštinė krypsta į kairę, tad prie pastovios viršūnės
  // ji išlįsdavo į kaimyninį langelį ir du gretimi kampai susilipdydavo į vieną
  // figūrą. Todėl kraštinės ilgis ir viršūnės vieta skaičiuojami taip, kad
  // abi kraštinės tilptų į savo langelį.
  const paraste = 10
  const laisva = dydis - 2 * paraste
  const kaireja = Math.max(0, -Math.cos((laipsniai * Math.PI) / 180))
  const ilgis = Math.min(74, laisva / (1 + kaireja))
  const v = { x: paraste + ilgis * kaireja, y: dydis - 26 }
  const kraštine = (kampasLaipsniais: number) => ({
    x: v.x + ilgis * Math.cos((-kampasLaipsniais * Math.PI) / 180),
    y: v.y + ilgis * Math.sin((-kampasLaipsniais * Math.PI) / 180),
  })
  const a = kraštine(0)
  const b = kraštine(laipsniai)

  let t = ''
  for (const p of [a, b]) {
    t += `<line x1="${v.x}" y1="${v.y}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`
  }
  if (suLankeliu) {
    const r = 22
    const a1 = { x: v.x + r, y: v.y }
    const b1 = {
      x: v.x + r * Math.cos((-laipsniai * Math.PI) / 180),
      y: v.y + r * Math.sin((-laipsniai * Math.PI) / 180),
    }
    t += `<path d="M${a1.x} ${a1.y} A ${r} ${r} 0 0 0 ${b1.x.toFixed(1)} ${b1.y.toFixed(1)}" fill="none" stroke="${ORANGE}" stroke-width="2"/>`
  }
  t += `<circle cx="${v.x}" cy="${v.y}" r="3.5" fill="${INK}"/>`
  t += txt(v.x - 9, v.y + 4, raide, 12, INK)
  return t
}

/** Keli brėžiniai greta viename paveiksle, sunumeruoti. */
export function brezinuEile(brezinukai: readonly string[]): string {
  const turinys = brezinukai
    .map((b, i) => langelioTurinys(b, i + 1, KRASTAS + i * LANGELIS))
    .join('')
  return svgRemas(KRASTAS * 2 + brezinukai.length * LANGELIS, LANGELIS + 26, turinys)
}

// ── Daugiakampiai ───────────────────────────────────────────────────────────

/**
 * Daugiakampis su `n` kampų.
 *
 * `taisyklingas` reiškia, kad visos kraštinės ir visi kampai lygūs — tokį
 * gauname iš apskritimo. Netaisyklingam spinduliai kaitaliojami, tad kraštinės
 * išeina skirtingo ilgio, bet figūra lieka be susikirtimų.
 */
export function daugiakampis(n: number, taisyklingas: boolean, sekla = 0): string {
  const c = LANGELIS / 2
  const taskai: Taskas[] = []
  // Lyginio kraštinių skaičiaus figūros pasukamos per pusę žingsnio: be to
  // kvadratas atsistotų ant kampo ir atrodytų kaip rombas, o antrokas jo
  // nebeatpažintų.
  const posukis = n % 2 === 0 ? Math.PI / n : 0
  for (let i = 0; i < n; i += 1) {
    const kampasRad = (i / n) * 2 * Math.PI - Math.PI / 2 + posukis
    const r = taisyklingas ? 42 : 30 + ((sekla + i * 3) % 4) * 6
    taskai.push({
      x: Math.round(c + r * Math.cos(kampasRad)),
      y: Math.round(c + r * Math.sin(kampasRad)),
    })
  }
  return lauztesKelias(taskai, true)
}

/** Ne daugiakampis — apskritimas arba atviroji laužtė. */
export function neDaugiakampis(kas: 'apskritimas' | 'lauzte'): string {
  const c = LANGELIS / 2
  if (kas === 'apskritimas') {
    return `<circle cx="${c}" cy="${c}" r="40" fill="none" stroke="${INK}" stroke-width="2.2"/>`
  }
  return lauztesKelias(lauztesTaskai(3, false, 1), false)
}

// ── Simetrija ───────────────────────────────────────────────────────────────

/**
 * Figūra su nubrėžta simetrijos ašimi.
 *
 * Ašis piešiama oranžine linija, kaip raudona vadovėlyje. `teisinga` nurodo,
 * ar ašis padėta ten, kur figūra iš tikrųjų dalijasi į dvi veidrodines dalis —
 * uždaviniams „kurioje vietoje ašis nubrėžta teisingai?“.
 */
export function suAsimi(
  figura: 'kvadratas' | 'trikampis' | 'staciakampis' | 'sirdis',
  asis: 'vertikali' | 'horizontali' | 'istriza' | 'nera',
  teisinga = true,
): string {
  const c = LANGELIS / 2
  let t = ''
  if (figura === 'kvadratas') {
    t += `<rect x="${c - 34}" y="${c - 34}" width="68" height="68" fill="none" stroke="${INK}" stroke-width="2.2"/>`
  } else if (figura === 'staciakampis') {
    t += `<rect x="${c - 42}" y="${c - 24}" width="84" height="48" fill="none" stroke="${INK}" stroke-width="2.2"/>`
  } else if (figura === 'trikampis') {
    t += `<path d="M${c} ${c - 38} L${c + 38} ${c + 30} L${c - 38} ${c + 30} Z" fill="none" stroke="${INK}" stroke-width="2.2"/>`
  } else {
    // Nesimetriška figūra — laisvos formos keturkampis.
    t += `<path d="M${c - 36} ${c - 20} L${c + 30} ${c - 34} L${c + 38} ${c + 26} L${c - 22} ${c + 32} Z" fill="none" stroke="${INK}" stroke-width="2.2"/>`
  }

  const poslinkis = teisinga ? 0 : 18
  if (asis === 'vertikali') {
    t += `<line x1="${c + poslinkis}" y1="6" x2="${c + poslinkis}" y2="${LANGELIS - 6}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="6 4"/>`
  } else if (asis === 'horizontali') {
    t += `<line x1="6" y1="${c + poslinkis}" x2="${LANGELIS - 6}" y2="${c + poslinkis}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="6 4"/>`
  } else if (asis === 'istriza') {
    t += `<line x1="10" y1="${LANGELIS - 10}" x2="${LANGELIS - 10}" y2="10" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="6 4"/>`
  }
  return t
}

// ── Planas su komandomis ────────────────────────────────────────────────────

export type PlanoLangelis = { x: number; y: number; zyme: string }

/**
 * Paprastas plano tinklelis su objektais ir, jei reikia, keliu.
 *
 * Objektai žymimi raidėmis, o ne paveikslėliais: plane svarbu vieta, ne tai,
 * kaip objektas atrodo, o raidė aiškiai perskaitoma ir išspausdinta.
 */
export function planas(
  stulpeliu: number,
  eiluciu: number,
  langeliai: readonly PlanoLangelis[],
  kelias?: readonly Taskas[],
): string {
  const L = 40
  const krastas = 10
  const plotis = krastas * 2 + stulpeliu * L
  const aukstis = krastas * 2 + eiluciu * L
  const centras = (c: number) => krastas + c * L + L / 2

  let t = ''
  for (let i = 0; i <= stulpeliu; i += 1) {
    const x = krastas + i * L
    t += `<line x1="${x}" y1="${krastas}" x2="${x}" y2="${krastas + eiluciu * L}" stroke="${LINE}" stroke-width="1"/>`
  }
  for (let i = 0; i <= eiluciu; i += 1) {
    const y = krastas + i * L
    t += `<line x1="${krastas}" y1="${y}" x2="${krastas + stulpeliu * L}" y2="${y}" stroke="${LINE}" stroke-width="1"/>`
  }

  if (kelias && kelias.length > 1) {
    const takas = kelias.map((k) => `${centras(k.x)} ${centras(k.y)}`).join(' L')
    t += `<path d="M${takas}" fill="none" stroke="${ORANGE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
    // Taškas ties kiekvienos komandos pabaiga. Be jų tiesus kelias per tris
    // langelius atrodo kaip viena ilga linija, ir komandų suskaičiuoti
    // neįmanoma — o kaip tik to uždavinys ir prašo.
    for (const k of kelias.slice(1, -1)) {
      t += `<circle cx="${centras(k.x)}" cy="${centras(k.y)}" r="4" fill="${ORANGE}" stroke="${INK}" stroke-width="1.2"/>`
    }
    const pries = kelias[kelias.length - 2]
    const galas = kelias[kelias.length - 1]
    const dx = Math.sign(galas.x - pries.x)
    const dy = Math.sign(galas.y - pries.y)
    t += `<path d="M${centras(galas.x)} ${centras(galas.y)} l${-9 * dx - 5 * dy} ${-9 * dy + 5 * dx} l${10 * dy} ${-10 * dx} z" fill="${ORANGE}"/>`
  }

  // Raidė pasukama į langelio viršutinį kairįjį kampą: langelio viduryje ji
  // atsidurtų tiesiai ant nubrėžto kelio ir abu susilietų.
  for (const l of langeliai) {
    t += txt(centras(l.x) - 11, centras(l.y) - 7, l.zyme, 15, INK, 700)
  }
  return svgRemas(plotis, aukstis, t)
}
