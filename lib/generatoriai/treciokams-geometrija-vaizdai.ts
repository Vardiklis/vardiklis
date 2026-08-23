import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 3 klasės temai „Geometrinės figūros“.
 *
 * Visa ši tema yra apie tai, ką matai: statmenos ar lygiagrečios tiesės,
 * apskritimo spindulys ir skersmuo, figūrų tarpusavio padėtis, simetrija ir
 * postūmis. Nė vieno iš šių klausimų neįmanoma pateikti vien žodžiais — todėl
 * brėžinys čia yra uždavinio sąlyga, o ne priedas.
 *
 * Piešiama tiksliai: statmenos tiesės kertasi būtent 90° kampu ir gauna
 * kampo ženkliuką, lygiagrečios visur išlaiko tą patį atstumą, o simetriška
 * figūra yra tikras savo poros veidrodinis atvaizdas. Spalvos rašomos
 * kintamaisiais, kad išspausdinus juodai baltai viskas liktų atpažįstama.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

function txt(x: number, y: number, t: string, dydis = 12, spalva = MUTED, storis = 600): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

export type Taskas = { x: number; y: number }

/** Visi šios temos brėžinukai piešiami vienodo dydžio langelyje. */
const LANGELIS = 132
const KRASTAS = 10

/** Vienas brėžinukas be numerio — kai variantų nėra. */
export function vienasBrezinys(turinys: string): string {
  return svgRemas(LANGELIS, LANGELIS, turinys)
}

/** Keli brėžinukai greta, sunumeruoti — „kuriame brėžinyje…?“ uždaviniams. */
export function brezinukuEile(brezinukai: readonly string[]): string {
  const turinys = brezinukai
    .map(
      (b, i) =>
        `<g transform="translate(${KRASTAS + i * LANGELIS} 0)">${b}` +
        txt(LANGELIS / 2, LANGELIS + 16, String(i + 1), 13, MUTED, 700) +
        '</g>',
    )
    .join('')
  return svgRemas(KRASTAS * 2 + brezinukai.length * LANGELIS, LANGELIS + 26, turinys)
}

// ── Tiesių tarpusavio padėtis ───────────────────────────────────────────────

export type TiesiuPadetis = 'lygiagrecios' | 'statmenos' | 'susikertancios'

/**
 * Dvi tiesės viename langelyje.
 *
 * Statmenų sankirtoje piešiamas stačiojo kampo ženkliukas — kvadratėlis, kaip
 * vadovėlyje. Susikertančios braižomos aiškiai smailiu kampu, kad jų nebūtų
 * galima palaikyti statmenomis: skirtumas turi būti matomas, o ne spėjamas.
 */
export function tiesiuPora(padetis: TiesiuPadetis, pasukimas = 0): string {
  const c = LANGELIS / 2
  const ilgis = 58
  const linija = (kampas: number, dx: number, dy: number) => {
    const r = (kampas * Math.PI) / 180
    const x1 = c + dx - ilgis * Math.cos(r)
    const y1 = c + dy + ilgis * Math.sin(r)
    const x2 = c + dx + ilgis * Math.cos(r)
    const y2 = c + dy - ilgis * Math.sin(r)
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(
      1,
    )}" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`
  }

  if (padetis === 'lygiagrecios') {
    // Vienodas atstumas per visą ilgį gaunamas paslenkant tą pačią tiesę
    // statmena kryptimi.
    const r = (pasukimas * Math.PI) / 180
    const nx = 17 * Math.sin(r)
    const ny = 17 * Math.cos(r)
    return linija(pasukimas, nx, ny) + linija(pasukimas, -nx, -ny)
  }
  if (padetis === 'statmenos') {
    const zenklas = staciojoKampoZenklas(c, c, pasukimas)
    return linija(pasukimas, 0, 0) + linija(pasukimas + 90, 0, 0) + zenklas
  }
  return linija(pasukimas, 0, 0) + linija(pasukimas + 42, 0, 0)
}

/** Kvadratėlis sankirtoje — stačiojo kampo žymė. */
function staciojoKampoZenklas(x: number, y: number, pasukimas: number): string {
  const d = 13
  const r = (pasukimas * Math.PI) / 180
  const u = { x: d * Math.cos(r), y: -d * Math.sin(r) }
  const v = { x: -d * Math.sin(r), y: -d * Math.cos(r) }
  return `<path d="M${(x + u.x).toFixed(1)} ${(y + u.y).toFixed(1)} L${(x + u.x + v.x).toFixed(
    1,
  )} ${(y + u.y + v.y).toFixed(1)} L${(x + v.x).toFixed(1)} ${(y + v.y).toFixed(
    1,
  )}" fill="none" stroke="${ORANGE}" stroke-width="1.8"/>`
}

// ── Apskritimas ─────────────────────────────────────────────────────────────

export type ApskritimoElementas = 'spindulys' | 'skersmuo' | 'centras'

/**
 * Apskritimas su pažymėtu elementu.
 *
 * Centras visada yra taškas su raide O; spindulys eina nuo jo iki apskritimo,
 * skersmuo — per centrą nuo krašto iki krašto. Elemento pavadinimas brėžinyje
 * nerašomas: jį ir reikia atpažinti.
 */
export function apskritimoBrezinys(elementas: ApskritimoElementas, r = 46): string {
  const c = LANGELIS / 2
  let t = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${INK}" stroke-width="2.2"/>`
  t += `<circle cx="${c}" cy="${c}" r="3.5" fill="${INK}"/>`
  t += txt(c - 11, c + 15, 'O', 13, INK, 700)

  if (elementas === 'spindulys') {
    t += `<line x1="${c}" y1="${c}" x2="${c + r}" y2="${c}" stroke="${ORANGE}" stroke-width="2.4"/>`
    t += `<circle cx="${c + r}" cy="${c}" r="3.5" fill="${INK}"/>`
    t += txt(c + r + 10, c - 6, 'A', 13, INK, 700)
  } else if (elementas === 'skersmuo') {
    t += `<line x1="${c - r}" y1="${c}" x2="${c + r}" y2="${c}" stroke="${ORANGE}" stroke-width="2.4"/>`
    t += `<circle cx="${c - r}" cy="${c}" r="3.5" fill="${INK}"/>`
    t += `<circle cx="${c + r}" cy="${c}" r="3.5" fill="${INK}"/>`
    t += txt(c - r - 10, c - 6, 'A', 13, INK, 700)
    t += txt(c + r + 10, c - 6, 'B', 13, INK, 700)
  }
  return t
}

/** Apskritimas su pasirašytu spindulio arba skersmens ilgiu. */
export function apskritimasSuMatu(matas: 'spindulys' | 'skersmuo', cm: number): string {
  const c = LANGELIS / 2
  const r = 46
  let t = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${INK}" stroke-width="2.2"/>`
  t += `<circle cx="${c}" cy="${c}" r="3.5" fill="${INK}"/>`
  if (matas === 'spindulys') {
    t += `<line x1="${c}" y1="${c}" x2="${c + r}" y2="${c}" stroke="${ORANGE}" stroke-width="2.4"/>`
    t += txt(c + r / 2, c - 8, `${cm} cm`, 12, INK, 700)
  } else {
    t += `<line x1="${c - r}" y1="${c}" x2="${c + r}" y2="${c}" stroke="${ORANGE}" stroke-width="2.4"/>`
    t += txt(c, c - 8, `${cm} cm`, 12, INK, 700)
  }
  return svgRemas(LANGELIS, LANGELIS, t)
}

// ── Figūrų tarpusavio padėtis ───────────────────────────────────────────────

export type Padetis = 'viduje' | 'isore' | 'kertasi' | 'liecia'

/**
 * Kvadratas ir apskritimas skirtingose tarpusavio padėtyse.
 *
 * Piešiama tiksliai pagal pavadinimą: „liečiasi“ reiškia lygiai vieną bendrą
 * tašką, tad apskritimo kraštas sutampa su kvadrato kraštine, o „kertasi“ —
 * kad kontūrai iš tikrųjų persikerta.
 */
export function figuruPadetis(padetis: Padetis): string {
  const c = LANGELIS / 2
  const kv = 40
  const r = 22
  const kvadratas = (x: number, y: number) =>
    `<rect x="${x - kv / 2}" y="${y - kv / 2}" width="${kv}" height="${kv}" fill="none" stroke="${INK}" stroke-width="2.2"/>`
  const apskritimas = (x: number, y: number) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${ORANGE}" stroke-width="2.2"/>`

  if (padetis === 'viduje') {
    return `<rect x="${c - 34}" y="${c - 34}" width="68" height="68" fill="none" stroke="${INK}" stroke-width="2.2"/>${apskritimas(
      c,
      c,
    )}`
  }
  if (padetis === 'isore') return kvadratas(c - 30, c) + apskritimas(c + 34, c)
  if (padetis === 'liecia') return kvadratas(c - 24, c) + apskritimas(c - 24 + kv / 2 + r, c)
  return kvadratas(c - 20, c) + apskritimas(c + 14, c)
}

// ── Figūros suskaidymas ─────────────────────────────────────────────────────

/**
 * Stačiakampis, suskaidytas į dalis brūkšninėmis linijomis.
 *
 * Skaidymo linijos brėžiamos punktyru, o pačios dalys nespalvinamos: klausimas
 * yra apie tai, kiek ir kokių figūrų gaunasi, o ne apie spalvas.
 */
export function suskaidytasStaciakampis(kaip: 'per-istrizaine' | 'per-vidurio-linija' | 'i-keturis'): string {
  const x = 18
  const y = 36
  const p = 96
  const a = 60
  let t = `<rect x="${x}" y="${y}" width="${p}" height="${a}" fill="none" stroke="${INK}" stroke-width="2.2"/>`
  const punktyras = (x1: number, y1: number, x2: number, y2: number) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ORANGE}" stroke-width="1.8" stroke-dasharray="6 4"/>`

  if (kaip === 'per-istrizaine') t += punktyras(x, y, x + p, y + a)
  else if (kaip === 'per-vidurio-linija') t += punktyras(x + p / 2, y, x + p / 2, y + a)
  else t += punktyras(x + p / 2, y, x + p / 2, y + a) + punktyras(x, y + a / 2, x + p, y + a / 2)
  return t
}

/** Dvi figūros, kurias sudėjus gaunama viena — sujungimo uždaviniams. */
export function dviDalys(kaip: 'du-trikampiai' | 'du-staciakampiai'): string {
  const x = 18
  const y = 40
  const p = 96
  const a = 56
  if (kaip === 'du-trikampiai') {
    return (
      `<path d="M${x} ${y} L${x + p} ${y} L${x} ${y + a} Z" fill="${ORANGE}" fill-opacity="0.35" stroke="${INK}" stroke-width="2"/>` +
      `<path d="M${x + p + 12} ${y + a} L${x + 12} ${y + a} L${x + p + 12} ${y} Z" fill="none" stroke="${INK}" stroke-width="2"/>`
    )
  }
  return (
    `<rect x="${x}" y="${y}" width="${p / 2}" height="${a}" fill="${ORANGE}" fill-opacity="0.35" stroke="${INK}" stroke-width="2"/>` +
    `<rect x="${x + p / 2 + 12}" y="${y}" width="${p / 2}" height="${a}" fill="none" stroke="${INK}" stroke-width="2"/>`
  )
}

// ── Tinklelis: simetrija ir postūmis ────────────────────────────────────────

const L = 22

/** Tinklelis su figūra; jei nurodyta, ir ašis arba antra figūra. */
function tinklelis(stulpeliu: number, eiluciu: number, turinys: string): string {
  const krastas = 12
  const plotis = krastas * 2 + stulpeliu * L
  const aukstis = krastas * 2 + eiluciu * L
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
  return svgRemas(plotis, aukstis, t + turinys)
}

function daugiakampioKelias(taskai: readonly Taskas[], uzpildyta: boolean): string {
  const krastas = 12
  const d = taskai
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${krastas + p.x * L} ${krastas + p.y * L}`)
    .join(' ')
  return `<path d="${d} Z" fill="${uzpildyta ? ORANGE : 'none'}" fill-opacity="${
    uzpildyta ? 0.35 : 1
  }" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`
}

/**
 * Figūra tinklelyje su simetrijos ašimi.
 *
 * `atspindys` piešiamas tik tada, kai uždavinys jo prašo: kai klausiama, kur
 * atsidurs simetriška figūra, nupieštas atspindys atsakymą atiduotų veltui.
 */
export function simetrijaTinklelyje(
  stulpeliu: number,
  eiluciu: number,
  taskai: readonly Taskas[],
  asisX: number,
  atspindys = false,
): string {
  const krastas = 12
  let t = daugiakampioKelias(taskai, true)
  t += `<line x1="${krastas + asisX * L}" y1="${krastas}" x2="${krastas + asisX * L}" y2="${
    krastas + eiluciu * L
  }" stroke="${ORANGE}" stroke-width="2.2" stroke-dasharray="6 4"/>`
  if (atspindys) {
    t += daugiakampioKelias(
      taskai.map((p) => ({ x: 2 * asisX - p.x, y: p.y })),
      false,
    )
  }
  return tinklelis(stulpeliu, eiluciu, t)
}

/** Figūra tinklelyje ir jos postūmis rodykle. */
export function postumisTinklelyje(
  stulpeliu: number,
  eiluciu: number,
  taskai: readonly Taskas[],
  dx: number,
  dy: number,
  rodytiRezultata = false,
): string {
  const krastas = 12
  let t = daugiakampioKelias(taskai, true)
  if (rodytiRezultata) {
    t += daugiakampioKelias(
      taskai.map((p) => ({ x: p.x + dx, y: p.y + dy })),
      false,
    )
  }
  // Rodyklė rodoma nuo pirmosios viršūnės — ji nurodo postūmio kryptį ir ilgį.
  const p0 = taskai[0]
  const x1 = krastas + p0.x * L
  const y1 = krastas + p0.y * L
  const x2 = krastas + (p0.x + dx) * L
  const y2 = krastas + (p0.y + dy) * L
  t += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="5 4"/>`
  const kampas = Math.atan2(y2 - y1, x2 - x1)
  const g = 9
  t += `<path d="M${x2} ${y2} L${(x2 - g * Math.cos(kampas - 0.4)).toFixed(1)} ${(
    y2 -
    g * Math.sin(kampas - 0.4)
  ).toFixed(1)} L${(x2 - g * Math.cos(kampas + 0.4)).toFixed(1)} ${(
    y2 -
    g * Math.sin(kampas + 0.4)
  ).toFixed(1)} Z" fill="${ORANGE}"/>`
  return tinklelis(stulpeliu, eiluciu, t)
}

// ── Erdvės figūros ──────────────────────────────────────────────────────────

/**
 * Stačiakampis gretasienis, braižomas kaip vadovėlyje.
 *
 * Nematomos briaunos — punktyru: būtent iš jų matyti, kad briaunų yra dvylika,
 * o ne septynios, ir kad viršūnių aštuonios. Be to skaičiuoti nebūtų ko.
 */
export function gretasienis(zymetiViena: 'briauna' | 'virsune' | 'siena' | 'nieko' = 'nieko'): string {
  const x = 24
  const y = 42
  const p = 84
  const a = 52
  const g = 26

  const priekis = `<rect x="${x}" y="${y}" width="${p}" height="${a}" fill="none" stroke="${INK}" stroke-width="2"/>`
  const gilyn = `<path d="M${x} ${y} l${g} ${-g} h${p} l${-g} ${g}" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` +
    `<path d="M${x + p} ${y + a} l${g} ${-g} v${-a}" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`
  // Trys briaunos, einančios per užpakalinę viršūnę, nematomos.
  const paslepta = `<path d="M${x + g} ${y + a - g} h${p} M${x + g} ${y + a - g} v${-a} M${x + g} ${
    y + a - g
  } l${-g} ${g}" fill="none" stroke="${MUTED}" stroke-width="1.4" stroke-dasharray="5 4"/>`

  let t = paslepta + priekis + gilyn
  if (zymetiViena === 'briauna') {
    t += `<line x1="${x}" y1="${y + a}" x2="${x + p}" y2="${y + a}" stroke="${ORANGE}" stroke-width="3.4"/>`
  } else if (zymetiViena === 'virsune') {
    t += `<circle cx="${x + p}" cy="${y}" r="5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
  } else if (zymetiViena === 'siena') {
    t += `<rect x="${x}" y="${y}" width="${p}" height="${a}" fill="${ORANGE}" fill-opacity="0.3" stroke="none"/>`
  }
  return t
}

/**
 * Prizmė arba piramidė su trikampiu ar keturkampiu pagrindu.
 *
 * Braižoma įstriža projekcija — taip pat, kaip gretasienis: priekinė figūra
 * tikru pavidalu, o gilumas gaunamas paslinkus kopiją įstrižai. Suplotas
 * daugiakampis to nepakeistų: keturkampė prizmė virstų vien stačiakampiu su
 * dviem linijomis, o pagrindo formos — to, ko čia ir klausiama — atpažinti
 * nebeliktų iš ko.
 *
 * Nematomos briaunos — punktyru: iš jų suskaičiuojamos visos briaunos ir
 * viršūnės, ne vien tos, kurios atsuktos į mus.
 */
export function erdvesFigura(kas: 'prizme' | 'piramide', n: 3 | 4): string {
  const x = 18
  const p = 72
  const g = 26
  const apacia = 108
  const virsus = 44

  const linija = (a: Taskas, b: Taskas, nematoma: boolean) =>
    `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(
      1,
    )}" stroke="${nematoma ? MUTED : INK}" stroke-width="${nematoma ? 1.4 : 2}"${
      nematoma ? ' stroke-dasharray="5 4"' : ''
    }/>`

  if (kas === 'prizme') {
    // Prizmė braižoma stačia: apačioje — pagrindas, matomas iš viršaus (tolimoji
    // viršūnė pakelta aukštyn), viršuje — toks pat pagrindas, o tarp jų —
    // vertikalios šoninės briaunos.
    //
    // Anksčiau priekinė siena buvo pats pagrindas, o gilumas gaunamas pastūmus
    // ją įstrižai; tada trikampė prizmė atrodė kaip dėžė su įstrižaine, ir nuo
    // keturkampės jos atskirti nebuvo galima. Dabar pagrindo forma matyti
    // viršutinėje sienoje — kaip tik ji ir yra klausimo objektas.
    const pagrindas: Taskas[] =
      n === 3
        ? [
            { x, y: apacia },
            { x: x + p, y: apacia },
            { x: x + p / 2 + g / 2, y: apacia - g },
          ]
        : [
            { x, y: apacia },
            { x: x + p, y: apacia },
            { x: x + p + g, y: apacia - g },
            { x: x + g, y: apacia - g },
          ]
    const aukstis = apacia - g - virsus
    const virsutinis = pagrindas.map((t) => ({ x: t.x, y: t.y - aukstis }))
    // Tolimoji apatinio pagrindo viršūnė lieka už prizmės — ji ir visos į ją
    // einančios briaunos punktyru. Viršutinis pagrindas matomas visas.
    const tolimoji = n === 3 ? 2 : 3

    let t = ''
    for (let i = 0; i < pagrindas.length; i += 1) {
      const kitas = (i + 1) % pagrindas.length
      t += linija(pagrindas[i], pagrindas[kitas], i === tolimoji || kitas === tolimoji)
      t += linija(virsutinis[i], virsutinis[kitas], false)
      t += linija(pagrindas[i], virsutinis[i], i === tolimoji)
    }
    return t
  }

  // Piramidės pagrindas gulì, tad jis piešiamas kaip lygiagretainis (keturkampis)
  // arba trikampis, kurio tolimoji viršūnė pasislinkusi gilyn.
  const pagrindas: Taskas[] =
    n === 3
      ? [
          { x, y: apacia },
          { x: x + p, y: apacia },
          { x: x + p / 2 + g, y: apacia - g },
        ]
      : [
          { x, y: apacia },
          { x: x + p, y: apacia },
          { x: x + p + g, y: apacia - g },
          { x: x + g, y: apacia - g },
        ]
  const tolimoji = n === 3 ? 2 : 3
  const virsune: Taskas = {
    x: pagrindas.reduce((s, t) => s + t.x, 0) / pagrindas.length,
    y: virsus,
  }

  let t = ''
  for (let i = 0; i < pagrindas.length; i += 1) {
    const kitas = (i + 1) % pagrindas.length
    const briaunaPaslepta = n === 4 ? i === tolimoji || kitas === tolimoji : i === tolimoji
    t += linija(pagrindas[i], pagrindas[kitas], briaunaPaslepta)
    t += linija(pagrindas[i], virsune, i === tolimoji)
  }
  t += `<circle cx="${virsune.x.toFixed(1)}" cy="${virsus}" r="3" fill="${INK}"/>`
  return t
}

/**
 * Kubelių statinys — erdvės figūrų sudėjimo ir skaidymo uždaviniams.
 *
 * Kubeliai yra nepermatomi: piešiamos tik tos sienelės, kurios iš tikrųjų
 * matomos. Viršutinė — tik aukščiausiam stulpelio kubeliui, šoninė — tik ten,
 * kur į dešinę nieko nestovi. Anksčiau kiekvienas kubelis buvo piešiamas
 * visas, tad užpakaliniai persišviesdavo pro priekinius, briaunos susiliedavo
 * ir suskaičiuoti, kiek jų yra, būdavo neįmanoma.
 */
export function kubeliuStatinys(stulpeliai: readonly number[]): string {
  const w = 26
  const h = 20
  const g = 10
  const krastas = 16
  const aukstis = krastas * 2 + Math.max(...stulpeliai) * h + g
  const plotis = krastas * 2 + stulpeliai.length * w + g

  let t = ''
  stulpeliai.forEach((kiek, i) => {
    const desineje = stulpeliai[i + 1] ?? 0
    for (let j = 0; j < kiek; j += 1) {
      const x = krastas + i * w
      const y = aukstis - krastas - (j + 1) * h
      // Viršų uždengia ant jo stovintis kubelis, šoną — kaimyninio stulpelio
      // kubelis, esantis tame pačiame aukšte.
      if (j === kiek - 1) {
        t += `<path d="M${x} ${y} l${g} ${-g} h${w} l${-g} ${g} z" fill="${ORANGE}" fill-opacity="0.28" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`
      }
      if (j >= desineje) {
        t += `<path d="M${x + w} ${y} l${g} ${-g} v${h} l${-g} ${g} z" fill="${ORANGE}" fill-opacity="0.45" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`
      }
      t += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${ORANGE}" fill-opacity="0.12" stroke="${INK}" stroke-width="1.4"/>`
    }
  })
  return svgRemas(plotis, aukstis, t)
}
