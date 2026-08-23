import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 4 klasės temoms „Konstravimas ir transformacijos“ ir
 * „Erdvės figūros ir tūris“.
 *
 * Abi temos yra apie tai, ką matai: kur langelis tinklelyje, į kurią pusę
 * pasukta figūra, kiek kubelių sudaro statinį, kuri išklotinė sulankstoma į
 * kubą. Nė vieno tokio klausimo be piešinio užduoti neįmanoma, tad brėžinys
 * čia yra pati sąlyga.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'
/** Nepermatomas pagrindas po spalvotomis sienomis; spausdinant — baltas. */
const PAPER = 'var(--paper)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Koordinačių tinklelis ───────────────────────────────────────────────────

export type TinklelioObjektas = { x: number; y: number; zyme: string }

/**
 * Tinklelis su pasirašytomis ašimis.
 *
 * `raidesStulpeliams` renkasi tarp dviejų būdų, kurių abu vartojami: langelio
 * vieta gali būti nusakoma raidės ir skaičiaus pora (A3) arba dviejų skaičių
 * pora (3; 2). Tai dvi atskiros potemės, ir jos turi atrodyti skirtingai.
 *
 * Eilutės numeruojamos iš apačios į viršų, kaip žemėlapyje.
 */
export function koordinaciuTinklelis(
  stulpeliu: number,
  eiluciu: number,
  objektai: readonly TinklelioObjektas[],
  raidesStulpeliams = true,
): string {
  const L = 38
  const kaire = 26
  const apacia = 24
  const plotis = kaire + stulpeliu * L + 12
  const aukstis = eiluciu * L + apacia + 12

  const cx = (x: number) => kaire + x * L + L / 2
  const cy = (y: number) => 8 + (eiluciu - 1 - y) * L + L / 2

  let t = ''
  for (let i = 0; i <= stulpeliu; i += 1) {
    t += `<line x1="${kaire + i * L}" y1="8" x2="${kaire + i * L}" y2="${8 + eiluciu * L}" stroke="${LINE}" stroke-width="1"/>`
  }
  for (let j = 0; j <= eiluciu; j += 1) {
    t += `<line x1="${kaire}" y1="${8 + j * L}" x2="${kaire + stulpeliu * L}" y2="${8 + j * L}" stroke="${LINE}" stroke-width="1"/>`
  }

  for (let i = 0; i < stulpeliu; i += 1) {
    t += txt(cx(i), aukstis - 8, raidesStulpeliams ? String.fromCharCode(65 + i) : String(i + 1), 12, INK, 700)
  }
  for (let j = 0; j < eiluciu; j += 1) {
    t += `<text x="${kaire - 9}" y="${cy(j) + 4}" font-size="12" fill="${INK}" font-weight="700" text-anchor="middle">${j + 1}</text>`
  }

  for (const o of objektai) {
    t += `<circle cx="${cx(o.x)}" cy="${cy(o.y)}" r="13" fill="${ORANGE}" fill-opacity="0.35" stroke="${INK}" stroke-width="1.5"/>`
    t += txt(cx(o.x), cy(o.y) + 5, o.zyme, 13, INK, 700)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Krypčių rožė ir judėjimas kryptimis ─────────────────────────────────────

export type Kryptis = 'Š' | 'P' | 'R' | 'V'

const KRYPCIU_POSLINKIS: Record<Kryptis, { dx: number; dy: number }> = {
  Š: { dx: 0, dy: 1 },
  P: { dx: 0, dy: -1 },
  R: { dx: 1, dy: 0 },
  V: { dx: -1, dy: 0 },
}

/** Kur atsidurs objektas nuėjęs nurodytus žingsnius. */
export function pagalKryptis(
  pradzia: { x: number; y: number },
  zingsniai: readonly { kryptis: Kryptis; kiek: number }[],
): { x: number; y: number } {
  let { x, y } = pradzia
  for (const z of zingsniai) {
    x += KRYPCIU_POSLINKIS[z.kryptis].dx * z.kiek
    y += KRYPCIU_POSLINKIS[z.kryptis].dy * z.kiek
  }
  return { x, y }
}

/**
 * Tinklelis su krypčių rože kampe.
 *
 * Be rožės klausimas „kur atsidursi nuėjęs 3 langelius į šiaurę“ neturi
 * atsakymo: mokinys turi matyti, kuri lapo pusė yra šiaurė.
 */
export function krypciuTinklelis(
  stulpeliu: number,
  eiluciu: number,
  objektai: readonly TinklelioObjektas[],
): string {
  const L = 38
  const kaire = 12
  const rozesPlotis = 62
  const plotis = kaire + stulpeliu * L + rozesPlotis + 12
  const aukstis = Math.max(eiluciu * L + 20, 92)

  const cx = (x: number) => kaire + x * L + L / 2
  const cy = (y: number) => 10 + (eiluciu - 1 - y) * L + L / 2

  let t = ''
  for (let i = 0; i <= stulpeliu; i += 1) {
    t += `<line x1="${kaire + i * L}" y1="10" x2="${kaire + i * L}" y2="${10 + eiluciu * L}" stroke="${LINE}" stroke-width="1"/>`
  }
  for (let j = 0; j <= eiluciu; j += 1) {
    t += `<line x1="${kaire}" y1="${10 + j * L}" x2="${kaire + stulpeliu * L}" y2="${10 + j * L}" stroke="${LINE}" stroke-width="1"/>`
  }
  for (const o of objektai) {
    t += `<circle cx="${cx(o.x)}" cy="${cy(o.y)}" r="13" fill="${ORANGE}" fill-opacity="0.35" stroke="${INK}" stroke-width="1.5"/>`
    t += txt(cx(o.x), cy(o.y) + 5, o.zyme, 13, INK, 700)
  }

  // Krypčių rožė dešinėje.
  const rx = kaire + stulpeliu * L + rozesPlotis / 2 + 6
  const ry = aukstis / 2
  const r = 22
  t += `<line x1="${rx}" y1="${ry - r}" x2="${rx}" y2="${ry + r}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<line x1="${rx - r}" y1="${ry}" x2="${rx + r}" y2="${ry}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<path d="M${rx} ${ry - r - 4} l-5 8 h10 z" fill="${INK}"/>`
  t += txt(rx, ry - r - 10, 'Š', 12, INK, 700)
  t += txt(rx, ry + r + 16, 'P', 12, INK, 700)
  t += txt(rx + r + 10, ry + 4, 'R', 12, INK, 700)
  t += txt(rx - r - 10, ry + 4, 'V', 12, INK, 700)
  return svgRemas(plotis, aukstis, t)
}

// ── Posūkis ─────────────────────────────────────────────────────────────────

/**
 * Figūra ir jos posūkis apie pažymėtą tašką.
 *
 * Sukimo centras piešiamas kryželiu — be jo posūkio nuo postūmio neatskirsi.
 * `rodytiRezultata` valdo, ar pasukta figūra jau nupiešta: kai klausiama, į
 * kurią pusę pasukta, abi padėtys būtinos, o kai klausiama, kur figūra
 * atsidurs, antroji būtų atsakymas.
 */
export function posukioBrezinys(
  laipsniai: 90 | 180 | 270,
  pagalLaikrodi: boolean,
  rodytiRezultata = true,
): string {
  const dydis = 200
  const c = dydis / 2
  const forma = [
    { x: 0, y: 0 },
    { x: 62, y: 0 },
    { x: 62, y: 22 },
    { x: 22, y: 22 },
    { x: 22, y: 52 },
    { x: 0, y: 52 },
  ]

  const suk = (p: { x: number; y: number }) => {
    const a = ((pagalLaikrodi ? laipsniai : -laipsniai) * Math.PI) / 180
    return { x: p.x * Math.cos(a) - p.y * Math.sin(a), y: p.x * Math.sin(a) + p.y * Math.cos(a) }
  }

  const kelias = (taskai: readonly { x: number; y: number }[], punktyras: boolean) =>
    `<polygon points="${taskai
      .map((p) => `${(c + p.x).toFixed(1)},${(c + p.y).toFixed(1)}`)
      .join(' ')}" fill="${punktyras ? 'none' : ORANGE}" fill-opacity="${punktyras ? 1 : 0.22}" stroke="${INK}" stroke-width="1.8"${
      punktyras ? ' stroke-dasharray="6 4"' : ''
    } stroke-linejoin="round"/>`

  let t = kelias(forma, false)
  if (rodytiRezultata) t += kelias(forma.map(suk), true)
  // Sukimo centras.
  t += `<line x1="${c - 7}" y1="${c}" x2="${c + 7}" y2="${c}" stroke="${INK}" stroke-width="1.8"/>`
  t += `<line x1="${c}" y1="${c - 7}" x2="${c}" y2="${c + 7}" stroke="${INK}" stroke-width="1.8"/>`
  t += txt(c - 14, c - 10, 'O', 12, INK, 700)
  return svgRemas(dydis, dydis, t)
}

// ── Ornamentas languotame popieriuje ────────────────────────────────────────

/**
 * Juosta iš besikartojančių languotų elementų.
 *
 * Ornamento taisyklė yra tai, kas kartojasi, ir kaip: postūmiu ar apvertimu.
 * Todėl elementai piešiami vienodo dydžio langeliuose, o kartojimas matomas
 * iš karto.
 */
export function ornamentoJuosta(elementai: readonly ('L' | 'T' | 'apversta-L')[], klaustuku = 0): string {
  const L = 40
  const krastas = 10
  const plotis = krastas * 2 + (elementai.length + klaustuku) * L
  const aukstis = krastas * 2 + 2 * L

  let t = ''
  for (let i = 0; i <= elementai.length + klaustuku; i += 1) {
    t += `<line x1="${krastas + i * L}" y1="${krastas}" x2="${krastas + i * L}" y2="${krastas + 2 * L}" stroke="${LINE}" stroke-width="0.8"/>`
  }
  for (let j = 0; j <= 2; j += 1) {
    t += `<line x1="${krastas}" y1="${krastas + j * L}" x2="${krastas + (elementai.length + klaustuku) * L}" y2="${krastas + j * L}" stroke="${LINE}" stroke-width="0.8"/>`
  }

  elementai.forEach((e, i) => {
    const x = krastas + i * L
    const y = krastas
    const uzp = `fill="${ORANGE}" fill-opacity="0.35" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"`
    if (e === 'L') {
      t += `<polygon points="${x + 6},${y + 6} ${x + 6},${y + 2 * L - 6} ${x + L - 6},${y + 2 * L - 6} ${x + L - 6},${y + 2 * L - 16} ${x + 16},${y + 2 * L - 16} ${x + 16},${y + 6}" ${uzp}/>`
    } else if (e === 'apversta-L') {
      t += `<polygon points="${x + L - 6},${y + 6} ${x + L - 6},${y + 2 * L - 6} ${x + 6},${y + 2 * L - 6} ${x + 6},${y + 2 * L - 16} ${x + L - 16},${y + 2 * L - 16} ${x + L - 16},${y + 6}" ${uzp}/>`
    } else {
      t += `<polygon points="${x + 6},${y + 6} ${x + L - 6},${y + 6} ${x + L - 6},${y + 16} ${x + L / 2 + 5},${y + 16} ${x + L / 2 + 5},${y + 2 * L - 6} ${x + L / 2 - 5},${y + 2 * L - 6} ${x + L / 2 - 5},${y + 16} ${x + 6},${y + 16}" ${uzp}/>`
    }
  })

  for (let k = 0; k < klaustuku; k += 1) {
    const x = krastas + (elementai.length + k) * L
    t += txt(x + L / 2, krastas + L + 8, '?', 22, MUTED, 700)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Stačiakampis gretasienis su matmenimis ──────────────────────────────────

/**
 * Gretasienis su pasirašytais trimis matmenimis.
 *
 * Tūriui apskaičiuoti reikia visų trijų, o iš plokščio piešinio jų nematyti,
 * tad kiekvienas užrašomas prie savo briaunos. Nematomos briaunos — punktyru.
 */
export function gretasienisSuMatais(a: number, b: number, c: number, rodytiMatus = true): string {
  const mastelis = Math.min(26, 150 / Math.max(a, b, c))
  const A = a * mastelis
  const B = b * mastelis
  const gylis = c * mastelis * 0.55
  const krastas = 30
  // Šoniniai kraštai platesni: juose rašomi matmenys, o su 30 px paraštėmis
  // užrašas „3 cm“ išlįsdavo už brėžinio ir būdavo nukirptas.
  const salis = 52
  const plotis = salis * 2 + A + gylis
  const aukstis = krastas * 2 + B + gylis

  const x0 = salis
  const y0 = krastas + gylis

  let t = ''
  // Nematomos briaunos.
  t += `<path d="M${x0 + gylis} ${y0 - gylis + B} h${A} M${x0 + gylis} ${y0 - gylis + B} v${-B} M${x0 + gylis} ${y0 - gylis + B} l${-gylis} ${gylis}" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="5 4" fill="none"/>`
  // Priekinė siena.
  t += `<rect x="${x0}" y="${y0}" width="${A}" height="${B}" fill="${ORANGE}" fill-opacity="0.14" stroke="${INK}" stroke-width="1.8"/>`
  // Viršus ir šonas.
  t += `<path d="M${x0} ${y0} l${gylis} ${-gylis} h${A} l${-gylis} ${gylis} Z" fill="${ORANGE}" fill-opacity="0.22" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`
  t += `<path d="M${x0 + A} ${y0} l${gylis} ${-gylis} v${B} l${-gylis} ${gylis} Z" fill="${ORANGE}" fill-opacity="0.08" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`

  if (rodytiMatus) {
    t += txt(x0 + A / 2, y0 + B + 16, `${a} cm`, 12, INK, 600)
    t += `<text x="${x0 - 8}" y="${y0 + B / 2 + 4}" font-size="12" fill="${INK}" font-weight="600" text-anchor="end">${b} cm</text>`
    // Gylio matmuo rašomas už dešiniosios briaunos, o ne ant jos — kitaip
    // užrašas gula tiesiai ant kūno kontūro.
    t += txt(x0 + A + gylis + 22, y0 - gylis / 2 + 4, `${c} cm`, 12, INK, 600)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Erdvės figūros ──────────────────────────────────────────────────────────

export type ErdvesKunas = 'ritinys' | 'kugis' | 'rutulys' | 'kubas' | 'gretasienis' | 'piramide' | 'prizme'

/** Vienas kūnas, braižomas taip, kaip vadovėlyje. */
export function erdvesKunas(kas: ErdvesKunas): string {
  const plotis = 120
  const aukstis = 130
  const uzp = `fill="${ORANGE}" fill-opacity="0.16" stroke="${INK}" stroke-width="1.8"`
  let t = ''

  if (kas === 'ritinys') {
    t += `<path d="M22 34 v62 a38 14 0 0 0 76 0 v-62" ${uzp} stroke-linejoin="round"/>`
    t += `<ellipse cx="60" cy="34" rx="38" ry="14" ${uzp}/>`
    t += `<path d="M22 96 a38 14 0 0 0 76 0" fill="none" stroke="${INK}" stroke-width="1.8"/>`
    t += `<path d="M22 96 a38 14 0 0 1 76 0" fill="none" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="5 4"/>`
  } else if (kas === 'kugis') {
    t += `<path d="M60 16 L98 100 a38 14 0 0 1 -76 0 Z" ${uzp} stroke-linejoin="round"/>`
    t += `<path d="M22 100 a38 14 0 0 1 76 0" fill="none" stroke="${INK}" stroke-width="1.8"/>`
    t += `<path d="M22 100 a38 14 0 0 0 76 0" fill="none" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="5 4"/>`
  } else if (kas === 'rutulys') {
    t += `<circle cx="60" cy="66" r="42" ${uzp}/>`
    t += `<ellipse cx="60" cy="66" rx="42" ry="14" fill="none" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="5 4"/>`
  } else if (kas === 'kubas' || kas === 'gretasienis') {
    const A = kas === 'kubas' ? 62 : 76
    const B = kas === 'kubas' ? 62 : 46
    const g = 26
    t += `<path d="M14 ${34 + g} l${g} ${-g} h${A} v${B} l${-g} ${g} Z" fill="none" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="5 4"/>`
    t += `<rect x="14" y="${34 + g}" width="${A}" height="${B}" ${uzp}/>`
    t += `<path d="M14 ${34 + g} l${g} ${-g} h${A} l${-g} ${g} Z" ${uzp} stroke-linejoin="round"/>`
    t += `<path d="M${14 + A} ${34 + g} l${g} ${-g} v${B} l${-g} ${g} Z" ${uzp} stroke-linejoin="round"/>`
  } else if (kas === 'piramide') {
    // Keturkampė piramidė: pagrindas — įstrižai matomas kvadratas, o ne
    // atkarpa. Iš plokščio trikampio pagrindo formos neatpažintum, o kaip tik
    // jos šioje potemėje ir klausiama.
    const A = { x: 18, y: 100 }
    const B = { x: 96, y: 100 }
    const C = { x: 112, y: 82 }
    const Dv = { x: 34, y: 82 }
    const virsune = { x: 60, y: 14 }
    // Užpakalinė viršūnė ir į ją einančios briaunos — punktyru.
    t += `<path d="M${Dv.x} ${Dv.y} L${A.x} ${A.y} M${Dv.x} ${Dv.y} L${C.x} ${C.y} M${Dv.x} ${Dv.y} L${virsune.x} ${virsune.y}" fill="none" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="5 4"/>`
    // Dvi matomos šoninės sienos.
    t += `<path d="M${virsune.x} ${virsune.y} L${A.x} ${A.y} L${B.x} ${B.y} Z" ${uzp} stroke-linejoin="round"/>`
    t += `<path d="M${virsune.x} ${virsune.y} L${B.x} ${B.y} L${C.x} ${C.y} Z" ${uzp} stroke-linejoin="round"/>`
  } else {
    // Trikampė prizmė. Piešiama vertikaliai: viršuje ir apačioje po vienodą
    // trikampį, o tarp jų — trys vertikalios briaunos. Suplotas gretasienis su
    // dviem įstrižomis linijomis atrodytų kaip keturkampė prizmė, ir pagrindo
    // formos — to, ko čia ir klausiama — atpažinti nebeliktų iš ko.
    const kaireX = 20
    const desineX = 100
    const galX = 62
    const virsus = 30
    const apacia = 96
    const gylis = 16

    // Užpakalinė viršūnė ir į ją einančios briaunos — punktyru.
    t += `<path d="M${galX} ${apacia - gylis} L${kaireX} ${apacia} M${galX} ${apacia - gylis} L${desineX} ${apacia} M${galX} ${virsus - gylis} L${galX} ${apacia - gylis}" fill="none" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="5 4"/>`
    // Priekinė siena — stačiakampis.
    t += `<path d="M${kaireX} ${virsus} L${desineX} ${virsus} L${desineX} ${apacia} L${kaireX} ${apacia} Z" ${uzp} stroke-linejoin="round"/>`
    // Viršutinis pagrindas — trikampis su užpakaline viršūne.
    t += `<path d="M${kaireX} ${virsus} L${desineX} ${virsus} L${galX} ${virsus - gylis} Z" ${uzp} stroke-linejoin="round"/>`
  }
  return svgRemas(plotis, aukstis, t)
}

/** Kelių kūnų eilė su raidėmis. */
export function kunuEile(kunai: readonly ErdvesKunas[]): string {
  const vienas = 120
  const tarpas = 10
  const plotis = kunai.length * (vienas + tarpas) + tarpas
  const aukstis = 156

  let t = ''
  kunai.forEach((k, i) => {
    const x = tarpas + i * (vienas + tarpas)
    const vidus = erdvesKunas(k).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
    t += `<g transform="translate(${x}, 0)">${vidus}</g>`
    t += txt(x + vienas / 2, aukstis - 8, String.fromCharCode(65 + i), 13, INK, 700)
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Išklotinės ──────────────────────────────────────────────────────────────

export type Isklotine = 'kubas' | 'gretasienis' | 'piramide' | 'ne-kubas'

/**
 * Erdvės figūros išklotinė languotame lape.
 *
 * `ne-kubas` yra šešių kvadratų figūra, kurios sulankstyti į kubą neįmanoma —
 * ji reikalinga tam, kad klausimas „ar iš šios išklotinės gaunamas kubas“
 * turėtų ir neigiamą atsakymą.
 */
export function isklotine(kas: Isklotine): string {
  const L = 34
  const krastas = 12

  const langeliai: { x: number; y: number }[] =
    kas === 'kubas'
      ? [
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
          { x: 3, y: 1 },
          { x: 1, y: 2 },
        ]
      : kas === 'ne-kubas'
        ? [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
          ]
        : kas === 'gretasienis'
          ? [
              { x: 1, y: 0 },
              { x: 0, y: 1 },
              { x: 1, y: 1 },
              { x: 2, y: 1 },
              { x: 3, y: 1 },
              { x: 1, y: 2 },
            ]
          : [
              { x: 1, y: 1 },
              { x: 0, y: 1 },
              { x: 2, y: 1 },
              { x: 1, y: 0 },
              { x: 1, y: 2 },
            ]

  const maksX = Math.max(...langeliai.map((l) => l.x)) + 1
  const maksY = Math.max(...langeliai.map((l) => l.y)) + 1
  const plotis = krastas * 2 + maksX * L
  const aukstis = krastas * 2 + maksY * L

  let t = ''
  for (const l of langeliai) {
    const x = krastas + l.x * L
    const y = krastas + l.y * L
    if (kas === 'piramide' && (l.x !== 1 || l.y !== 1)) {
      // Šoninės sienos — trikampiai aplink kvadratinį pagrindą.
      const kryptis = l.y === 0 ? 'virsus' : l.y === 2 ? 'apacia' : l.x === 0 ? 'kaire' : 'desine'
      const taskai =
        kryptis === 'virsus'
          ? `${x},${y + L} ${x + L},${y + L} ${x + L / 2},${y}`
          : kryptis === 'apacia'
            ? `${x},${y} ${x + L},${y} ${x + L / 2},${y + L}`
            : kryptis === 'kaire'
              ? `${x + L},${y} ${x + L},${y + L} ${x},${y + L / 2}`
              : `${x},${y} ${x},${y + L} ${x + L},${y + L / 2}`
      t += `<polygon points="${taskai}" fill="${ORANGE}" fill-opacity="0.2" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`
    } else {
      const w = kas === 'gretasienis' && (l.x === 0 || l.x === 2 || l.x === 3) ? L : L
      const h = kas === 'gretasienis' && l.y !== 1 ? L * 0.7 : L
      const dy = kas === 'gretasienis' && l.y === 0 ? L - h : 0
      t += `<rect x="${x}" y="${y + dy}" width="${w}" height="${h}" fill="${ORANGE}" fill-opacity="0.2" stroke="${INK}" stroke-width="1.6"/>`
    }
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Statinys iš kubelių ir jo vaizdai ───────────────────────────────────────

/**
 * Statinys iš kubelių, žiūrint iš viršaus.
 *
 * Kiekviename langelyje užrašoma, kiek kubelių tame stulpelyje. Toks vaizdas
 * yra atskira potemė: iš jo tūrį galima suskaičiuoti nematant paties statinio.
 */
export function vaizdasIsVirsaus(stulpeliai: readonly (readonly number[])[]): string {
  const L = 38
  const krastas = 12
  const eiluciu = stulpeliai.length
  const stulpeliuKiek = Math.max(...stulpeliai.map((e) => e.length))
  // Paaiškinimas po tinkleliu yra platesnis už patį tinklelį, tad plotį lemia
  // jis — antraip tekstas nukirstas ir uždavinio sąlyga liktų nesuprantama.
  const plotis = Math.max(krastas * 2 + stulpeliuKiek * L, 250)
  const aukstis = krastas * 2 + eiluciu * L + 18

  let t = ''
  const nuoKaires = (plotis - stulpeliuKiek * L) / 2
  stulpeliai.forEach((eile, i) => {
    eile.forEach((kiek, j) => {
      const x = nuoKaires + j * L
      const y = krastas + i * L
      t += `<rect x="${x}" y="${y}" width="${L}" height="${L}" fill="${kiek > 0 ? ORANGE : 'none'}" fill-opacity="${kiek > 0 ? 0.18 : 1}" stroke="${INK}" stroke-width="1.4"/>`
      if (kiek > 0) t += txt(x + L / 2, y + L / 2 + 6, String(kiek), 16, INK, 700)
    })
  })
  t += txt(plotis / 2, aukstis - 5, 'skaičius langelyje — kubelių aukštis', 10, MUTED)
  return svgRemas(plotis, aukstis, t)
}

/**
 * Statinys iš kubelių, piešiamas nepermatomas.
 *
 * Trys dalykai čia lemia, ar statinį apskritai galima suskaičiuoti:
 *
 * 1. Sienos užpildomos nepermatomai — po spalvota siena dedamas popieriaus
 *    spalvos pagrindas. Permatomos sienos leidžia matyti už jų esančias
 *    briaunas, ir statinys virsta optine apgaule, kurioje kubelių skaičių
 *    galima suskaičiuoti keliais būdais.
 * 2. Kubeliai piešiami griežtai iš tolimiausio į artimiausią, t. y. mažėjant
 *    `i + j`. Anksčiau eilutė buvo piešiama iš eilės, tad artimesnis kubelis
 *    atsidurdavo po tolimesniu.
 * 3. Šoninė siena piešiama tik tada, kai už jos nieko nėra. Kairioji siena
 *    remiasi į kaimyną `(i, j - 1)`, dešinioji — į `(i - 1, j)`; anksčiau
 *    dešinioji buvo tikrinama pagal `(i, j + 1)`, t. y. pagal kaimyną
 *    priešingoje pusėje, todėl sienos atsirasdavo ne ten, kur reikia.
 */
export function kubeliuStatinys4(stulpeliai: readonly (readonly number[])[]): string {
  const w = 30
  const h = 18
  const auksis = 26
  const eiluciu = stulpeliai.length
  const stulpeliuKiek = Math.max(...stulpeliai.map((e) => e.length))
  const maksAukstis = Math.max(...stulpeliai.flat())

  const plotis = (stulpeliuKiek + eiluciu) * w + 40
  const aukstis = (stulpeliuKiek + eiluciu) * h + maksAukstis * auksis + 40
  const x0 = 20 + eiluciu * w
  const y0 = aukstis - 20 - eiluciu * h

  /** Kubelių stulpelio aukštis; už tinklelio ribų — nulis. */
  const kiekAukstyje = (i: number, j: number) => stulpeliai[i]?.[j] ?? 0

  /** Siena: nepermatomas pagrindas ir ant jo spalvotas atspalvis. */
  const siena = (kelias: string, tonas: number) =>
    `<path d="${kelias}" fill="${PAPER}" stroke="none"/>` +
    `<path d="${kelias}" fill="${ORANGE}" fill-opacity="${tonas}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`

  let t = ''
  // Gylis `i + j`: kuo didesnis, tuo kubelis toliau. Piešiama nuo tolimiausio,
  // kad artimesni uždengtų tai, kas už jų.
  const giliausias = eiluciu - 1 + stulpeliuKiek - 1
  for (let gylis = giliausias; gylis >= 0; gylis -= 1) {
    for (let i = 0; i < eiluciu; i += 1) {
      const j = gylis - i
      if (j < 0 || j >= stulpeliai[i].length) continue
      for (let k = 0; k < stulpeliai[i][j]; k += 1) {
        const bx = x0 + (j - i) * w
        const by = y0 - (j + i) * h - k * auksis
        if (kiekAukstyje(i, j - 1) <= k) {
          t += siena(`M${bx} ${by} l${w} ${h} v${auksis} l${-w} ${-h} Z`, 0.34)
        }
        if (kiekAukstyje(i - 1, j) <= k) {
          t += siena(`M${bx + w} ${by + h} l${w} ${-h} v${auksis} l${-w} ${h} Z`, 0.18)
        }
        if (k === stulpeliai[i][j] - 1) {
          t += siena(`M${bx} ${by} l${w} ${h} l${w} ${-h} l${-w} ${-h} Z`, 0.5)
        }
      }
    }
  }
  return svgRemas(plotis, aukstis, t)
}
