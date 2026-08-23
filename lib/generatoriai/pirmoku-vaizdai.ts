import { daiktas, type Daiktas } from './ikonos'
import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 1–2 klasių matavimo, braižymo, pinigų, duomenų ir daugybos
 * potemėms.
 *
 * Visi šie uždaviniai be piešinio neturi prasmės: „Koks atkarpos ilgis?“ arba
 * „Kur yra spindulys?“ mokiniui yra klausimas apie tai, ką jis mato, o ne apie
 * tai, ką prisimena. Todėl brėžiniai čia nėra papuošimas — jie yra sąlyga.
 *
 * Spalvos rašomos kintamaisiais (`var(--ink)` ir kt.), kad spausdinant viskas
 * liktų juoda ir uždavinys išliktų sprendžiamas nespalvotame lape.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

function txt(
  x: number,
  y: number,
  t: string,
  dydis = 11,
  spalva = MUTED,
  storis = 400,
): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Liniuotė ────────────────────────────────────────────────────────────────

/** Vienas centimetras piešinyje. */
const CM = 22

/**
 * Liniuotė su padalomis ir, jei reikia, daiktu ant jos.
 *
 * `daiktas` nurodomas centimetrais nuo liniuotės pradžios. Uždavinys „nuo 2 cm
 * iki 6 cm“ yra sunkesnis už „nuo 0“, nes ilgio nebegalima nuskaityti tiesiai
 * iš padalos — jį reikia suskaičiuoti.
 */
export function liniuote(
  cm: number,
  ant?: { nuo: number; iki: number; vardas?: string },
): string {
  // Krašto atsarga didesnė už pusę skaitmens pločio: 0 ir paskutinė padala
  // rašomos ties pačiais liniuotės galais, tad be jos jos nukerpamos.
  const krastas = 20
  const virsus = ant ? 44 : 12
  const plotis = krastas * 2 + cm * CM + 2
  const aukstis = virsus + 36 + 8

  let t = ''
  if (ant) {
    const x1 = krastas + ant.nuo * CM
    const x2 = krastas + ant.iki * CM
    t += `<rect x="${x1}" y="12" width="${x2 - x1}" height="22" rx="4" fill="${ORANGE}" fill-opacity="0.3" stroke="${INK}" stroke-width="1.5"/>`
    if (ant.vardas) t += txt((x1 + x2) / 2, 27, ant.vardas, 10, INK)
  }

  // Liniuotės korpusas prasideda anksčiau už nulinę padalą — kaip tikroje
  // liniuotėje. Be to atsargos skaitmuo „0“ atsidurtų ant pačios briaunos ir
  // susilietų su ja.
  t += `<rect x="${krastas - 9}" y="${virsus}" width="${cm * CM + 18}" height="34" fill="none" stroke="${INK}" stroke-width="1.5"/>`
  for (let i = 0; i <= cm; i += 1) {
    const x = krastas + i * CM
    // Padalos brūkšnys iš liniuotės viršaus žemyn — taip, kaip tikroje liniuotėje.
    t += `<line x1="${x}" y1="${virsus}" x2="${x}" y2="${virsus + 9}" stroke="${INK}" stroke-width="1.2"/>`
    t += txt(x, virsus + 24, String(i), 11, INK)
  }
  return svgRemas(plotis, aukstis, t)
}

/** Kelios atkarpos viena po kita — palyginimui „kuri ilgesnė?“. */
export function atkarpuEile(ilgiai: readonly number[]): string {
  const krastas = 18
  const tarpas = 34
  const plotis = krastas * 2 + Math.max(...ilgiai) * CM + 24
  const aukstis = krastas + ilgiai.length * tarpas

  let t = ''
  ilgiai.forEach((ilgis, i) => {
    const y = krastas + i * tarpas
    const x2 = krastas + 20 + ilgis * CM
    t += txt(krastas + 6, y + 4, String(i + 1), 12, MUTED, 600)
    t += `<line x1="${krastas + 20}" y1="${y}" x2="${x2}" y2="${y}" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`
    for (const x of [krastas + 20, x2]) {
      t += `<circle cx="${x}" cy="${y}" r="3.5" fill="${INK}"/>`
    }
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Taškas, atkarpa, tiesė, spindulys ───────────────────────────────────────

export type GeometrijosZenklas = 'taskas' | 'atkarpa' | 'tiese' | 'spindulys'

/**
 * Keturios sąvokos vienu brėžiniu, sunumeruotos.
 *
 * Braižoma taip, kaip vadovėlyje, o skiriamasis požymis yra pažymėti galai:
 *
 *   taškas    — vienas taškas su didžiąja raide;
 *   atkarpa   — abu galai pažymėti taškais A ir B;
 *   spindulys — pažymėta tik pradžia A, kita kryptimi linija išeina iš lauko;
 *   tiesė     — nepažymėtas nė vienas galas, o pati tiesė vadinama mažąja
 *               raide (a) — ji tęsiasi į abi puses.
 *
 * Rodyklių nebėra sąmoningai: vadovėlyje tiesė ir spindulys braižomi
 * paprasčiausia linija, o vaikas juos skiria iš pažymėtų taškų, ne iš rodyklių.
 * Todėl tiesės ir spindulio linijos vedamos iki pat piešinio krašto — matyti,
 * kad jos niekur nesibaigia.
 */
export function zenkluBrezinys(zenklai: readonly GeometrijosZenklas[]): string {
  // Viršuje ir apačioje paliekama vietos raidėms — jos rašomos virš linijos.
  const krastas = 30
  const tarpas = 44
  const plotis = 230
  const aukstis = krastas + zenklai.length * tarpas

  /** Pažymėtas taškas su raide virš jo. */
  const zymė = (x: number, y: number, raide: string) =>
    `<circle cx="${x}" cy="${y}" r="4.5" fill="${INK}"/>` + txt(x, y - 11, raide, 13, INK, 600)

  let t = ''
  zenklai.forEach((z, i) => {
    const y = krastas + i * tarpas
    t += txt(14, y + 4, String(i + 1), 12, MUTED, 600)
    // Atkarpos galai lieka piešinio viduje, o tiesė ir spindulys nubėga už jo.
    const vidusKaire = 44
    const vidusDesine = plotis - 30
    const linija = (nuo: number, iki: number) =>
      `<line x1="${nuo}" y1="${y}" x2="${iki}" y2="${y}" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`

    if (z === 'taskas') {
      t += zymė((vidusKaire + vidusDesine) / 2, y, 'A')
    } else if (z === 'atkarpa') {
      t += linija(vidusKaire, vidusDesine)
      t += zymė(vidusKaire, y, 'A')
      t += zymė(vidusDesine, y, 'B')
    } else if (z === 'spindulys') {
      t += linija(vidusKaire, plotis)
      t += zymė(vidusKaire, y, 'A')
    } else {
      t += linija(30, plotis)
      t += txt((30 + plotis) / 2, y - 11, 'a', 13, INK, 600)
    }
  })
  return svgRemas(plotis, aukstis, t)
}

/**
 * Piešinys ir brėžinys greta.
 *
 * Skirtumas turi matytis iš karto: piešinys yra spalvotas ir apvalus, brėžinys
 * — plonos tiesios linijos, kokias nubrėžia liniuotė.
 */
export function piesinysIrBrezinys(pirmas: 'piesinys' | 'brezinys', kas: Daiktas): string {
  const plotis = 230
  const aukstis = 118

  const piesinys = (x: number) => daiktas(kas, x, 22, 68)
  const brezinys = (x: number) =>
    `<g fill="none" stroke="${INK}" stroke-width="1.6">` +
    `<rect x="${x + 10}" y="46" width="48" height="40"/>` +
    `<path d="M${x + 4} 46 L${x + 34} 20 L${x + 64} 46"/>` +
    `<rect x="${x + 26}" y="64" width="16" height="22"/>` +
    '</g>'

  const kaire = 22
  const desine = 132
  let t = ''
  t += pirmas === 'piesinys' ? piesinys(kaire) + brezinys(desine) : brezinys(kaire) + piesinys(desine)
  t += txt(kaire + 34, aukstis - 6, '1', 13, MUTED, 600)
  t += txt(desine + 34, aukstis - 6, '2', 13, MUTED, 600)
  return svgRemas(plotis, aukstis, t)
}

// ── Tinklelis su keliu ──────────────────────────────────────────────────────

export type Langelis = { x: number; y: number; kas: Daiktas }

/**
 * Tinklelis su veikėju ir daiktais — kelio uždaviniams.
 *
 * Langeliai skaičiuojami nuo kairiojo viršutinio kampo: `x` didėja į dešinę,
 * `y` — žemyn, kaip ir rodyklės ↓. Kelias piešiamas tik tada, kai jo prašo
 * uždavinys: kai klausiama „kur atsidursi?“, nupieštas kelias atsakymą
 * atiduotų veltui.
 */
export function tinkleliuZemelapis(
  stulpeliu: number,
  eiluciu: number,
  langeliai: readonly Langelis[],
  kelias?: readonly { x: number; y: number }[],
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
    // Vientisa laužtė, o ne atskiros rodyklės tarp langelių: langelis yra 40
    // px, tad atskira rodyklė būtų vos keliolikos taškų ilgio ir kelio nesimatytų.
    // Rodyklė piešiama viena — kelio gale, kad būtų aišku, kur einama.
    const takas = kelias.map((k) => `${centras(k.x)} ${centras(k.y)}`).join(' L')
    t += `<path d="M${takas}" fill="none" stroke="${ORANGE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
    // Taškas ties kiekvienos komandos pabaiga — kitaip tiesus kelias per kelis
    // langelius atrodo kaip viena linija ir komandų nesuskaičiuosi.
    for (const k of kelias.slice(1, -1)) {
      t += `<circle cx="${centras(k.x)}" cy="${centras(k.y)}" r="4" fill="${ORANGE}" stroke="${INK}" stroke-width="1.2"/>`
    }
    const pries = kelias[kelias.length - 2]
    const galas = kelias[kelias.length - 1]
    const dx = Math.sign(galas.x - pries.x)
    const dy = Math.sign(galas.y - pries.y)
    const gx = centras(galas.x)
    const gy = centras(galas.y)
    t += `<path d="M${gx} ${gy} l${-9 * dx - 5 * dy} ${-9 * dy + 5 * dx} l${10 * dy} ${-10 * dx} z" fill="${ORANGE}"/>`
  }

  for (const l of langeliai) {
    t += daiktas(l.kas, krastas + l.x * L + 6, krastas + l.y * L + 6, L - 12)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Pinigai ─────────────────────────────────────────────────────────────────

/** Monetos vertė centais — 1 € yra 100. */
export type Moneta = 1 | 2 | 5 | 10 | 20 | 50 | 100 | 200

/** Monetos užrašas: iki 50 — centai, nuo 100 — eurai. */
export function monetosUzrasas(centai: Moneta): string {
  return centai >= 100 ? `${centai / 100} €` : `${centai} ct`
}

/**
 * Monetų eilė.
 *
 * Eurų monetos piešiamos didesnės ir su užpildu, centų — mažesnės ir tuščios.
 * Vaikas jas skiria pirmiausia iš dydžio, tad brėžinys turi tai išlaikyti;
 * vertė vis tiek užrašoma, kad uždavinys būtų sprendžiamas ir nespalvotai.
 */
export function monetos(vertes: readonly Moneta[]): string {
  const krastas = 10
  const tarpas = 6
  const spinduliai = vertes.map((v) => (v >= 100 ? 24 : v >= 10 ? 21 : 18))
  const plotis =
    krastas * 2 + spinduliai.reduce((s, r) => s + r * 2, 0) + tarpas * (vertes.length - 1)
  const aukstis = 62

  let t = ''
  let x = krastas
  vertes.forEach((v, i) => {
    const r = spinduliai[i]
    const cx = x + r
    t += `<circle cx="${cx}" cy="31" r="${r}" fill="${v >= 100 ? ORANGE : 'none'}" fill-opacity="0.25" stroke="${INK}" stroke-width="1.5"/>`
    t += txt(cx, 35, monetosUzrasas(v), v >= 100 ? 12 : 10, INK, 600)
    x += r * 2 + tarpas
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Skaičiaus skyrių lentelė ────────────────────────────────────────────────

/**
 * Skyrių lentelė „Dešimtys | Vienetai“, kaip vadovėlyje.
 *
 * Lentelė parodo tai, ko atskiri kubeliai neparodo: kad skaitmens reikšmę
 * lemia jo vieta. Todėl ji rodoma greta blokų, o ne vietoj jų.
 *
 * `null` reiškia tuščią langelį, kurį įrašo mokinys.
 */
export function skyriuLentele(desimtys: number | null, vienetai: number | null): string {
  const stulpelis = 84
  const plotis = stulpelis * 2 + 4
  const antrastesAukstis = 26
  const langelis = 38
  const aukstis = antrastesAukstis + langelis + 4

  const stulp = (x: number, antraste: string, reiksme: number | null) =>
    `<rect x="${x}" y="2" width="${stulpelis}" height="${antrastesAukstis}" fill="${ORANGE}" fill-opacity="0.25" stroke="${INK}" stroke-width="1.4"/>` +
    txt(x + stulpelis / 2, antrastesAukstis - 6, antraste, 12, INK, 600) +
    `<rect x="${x}" y="${antrastesAukstis + 2}" width="${stulpelis}" height="${langelis}" fill="none" stroke="${INK}" stroke-width="1.4"${
      reiksme === null ? ' stroke-dasharray="5 4"' : ''
    }/>` +
    txt(
      x + stulpelis / 2,
      antrastesAukstis + langelis / 2 + 9,
      reiksme === null ? '?' : String(reiksme),
      20,
      reiksme === null ? MUTED : INK,
      600,
    )

  return svgRemas(plotis, aukstis, stulp(2, 'Dešimtys', desimtys) + stulp(stulpelis + 2, 'Vienetai', vienetai))
}

// ── Veiksmas stulpeliu ──────────────────────────────────────────────────────

/**
 * Sudėtis arba atimtis, užrašyta stulpeliu.
 *
 * Potemė vadinasi „stulpeliu“, tad stulpelis ir turi būti matomas: vienetai po
 * vienetais, dešimtys po dešimtimis, brūkšnys ir po juo — atsakymo vieta.
 * Vien tekstinis „58 + 7“ tos tvarkos neparodo, o kaip tik ji ir yra mokoma.
 *
 * `atsakymas` paliekamas tuščias, kai jį turi įrašyti mokinys.
 */
export function stulpeliuVeiksmas(
  a: number,
  b: number,
  zenklas: '+' | '−',
  atsakymas?: number,
): string {
  const plotis = 132
  const aukstis = 118
  const desinysis = 96
  const skaitmuo = 22

  /** Skaičius rašomas dešiniuoju kraštu — kad skyriai atsidurtų vienas po kitu. */
  const eilute = (n: number, y: number) => {
    const s = String(n)
    let r = ''
    for (let i = 0; i < s.length; i += 1) {
      const x = desinysis - (s.length - 1 - i) * skaitmuo
      r += `<text x="${x}" y="${y}" font-size="22" fill="${INK}" text-anchor="middle">${s[i]}</text>`
    }
    return r
  }

  // Ženklas statomas viso skaitmens pločiu kairiau už ilgiausią eilutę: prie
  // trijų skaitmenų skaičių jis kitaip užlipdavo ant pirmojo skaitmens.
  const ilgis = Math.max(String(a).length, String(b).length)
  const kairysis = desinysis - (ilgis - 1) * skaitmuo

  let t = ''
  t += eilute(a, 34)
  t += `<text x="${kairysis - skaitmuo}" y="66" font-size="22" fill="${INK}" text-anchor="middle">${zenklas}</text>`
  t += eilute(b, 66)
  t += `<line x1="${kairysis - skaitmuo - 10}" y1="78" x2="${desinysis + 12}" y2="78" stroke="${INK}" stroke-width="2"/>`
  if (atsakymas === undefined) {
    // Tuščios vietos brūkšninis langelis — mokiniui aišku, kur rašyti.
    t += `<rect x="${desinysis - 1.5 * skaitmuo}" y="86" width="${2 * skaitmuo}" height="26" rx="4" fill="none" stroke="${MUTED}" stroke-width="1.4" stroke-dasharray="5 4"/>`
    t += txt(desinysis - skaitmuo / 2, 105, '?', 18, MUTED, 700)
  } else {
    t += eilute(atsakymas, 106)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Skaičių tiesė su šuoliu ─────────────────────────────────────────────────

/**
 * Skaičių tiesės atkarpa su lanku nuo vieno skaičiaus iki kito.
 *
 * Vadovėlis būtent taip parodo, ką reiškia „pridėti“ ir „atimti“: šuolis
 * pirmyn arba atgal. Prie nežinomo skaičiaus uždavinių tai vienintelis būdas
 * pamatyti, kodėl $12 + \square = 20$ sprendžiama atimtimi.
 */
export function tieseSuSuoliu(
  nuo: number,
  iki: number,
  pradzia: number,
  pabaiga: number,
  zyme?: string,
): string {
  const zingsnis = 26
  const krastas = 20
  const virsus = 34
  const asis = virsus + 22
  const plotis = krastas * 2 + (iki - nuo) * zingsnis
  const aukstis = asis + 24

  const x = (n: number) => krastas + (n - nuo) * zingsnis

  let t = `<line x1="${krastas - 10}" y1="${asis}" x2="${plotis - krastas + 10}" y2="${asis}" stroke="${INK}" stroke-width="1.5"/>`
  t += `<path d="M${plotis - krastas + 10} ${asis} l-8 -4 v8 z" fill="${INK}"/>`
  for (let n = nuo; n <= iki; n += 1) {
    t += `<line x1="${x(n)}" y1="${asis - 5}" x2="${x(n)}" y2="${asis + 5}" stroke="${INK}" stroke-width="1.2"/>`
    t += txt(x(n), asis + 18, String(n), 10, INK)
  }

  // Lankas nuo pradžios iki pabaigos. Krypties rodyklė rodo, ar pridedama, ar
  // atimama — be jos šuolis atrodytų vienodai abiem atvejais.
  const x1 = x(pradzia)
  const x2 = x(pabaiga)
  const aukstisLanko = Math.min(26, 10 + Math.abs(x2 - x1) / 4)
  t += `<path d="M${x1} ${asis - 7} Q ${(x1 + x2) / 2} ${asis - 7 - aukstisLanko * 2} ${x2} ${asis - 7}" fill="none" stroke="${ORANGE}" stroke-width="2.2"/>`
  const kryptis = x2 > x1 ? 1 : -1
  t += `<path d="M${x2} ${asis - 7} l${-9 * kryptis} -7 l2 9 z" fill="${ORANGE}"/>`
  t += txt((x1 + x2) / 2, virsus - 4, zyme ?? String(Math.abs(pabaiga - pradzia)), 13, INK, 600)

  return svgRemas(plotis, aukstis, t)
}

// ── Juostinė schema ─────────────────────────────────────────────────────────

/**
 * Juostinė schema: visuma viršuje, dvi dalys apačioje.
 *
 * Schema parodo, kas uždavinyje žinoma, o ko ieškoma: sudėties uždavinyje
 * tuščias langelis yra visuma, atimties — viena dalis. `null` reiškia tą
 * nežinomąjį.
 */
export function juostineSchema(
  visuma: number | null,
  dalis1: number | null,
  dalis2: number | null,
): string {
  const plotis = 260
  const aukstis = 96
  const krastas = 14
  const juostosPlotis = plotis - 2 * krastas
  const zyme = (v: number | null) => (v === null ? '?' : String(v))
  const puse = juostosPlotis / 2

  let t = `<rect x="${krastas}" y="16" width="${juostosPlotis}" height="28" rx="4" fill="${ORANGE}" fill-opacity="0.2" stroke="${INK}" stroke-width="1.5"/>`
  t += txt(plotis / 2, 35, zyme(visuma), 14, INK, 600)
  t += `<rect x="${krastas}" y="56" width="${puse}" height="28" rx="4" fill="none" stroke="${INK}" stroke-width="1.5"/>`
  t += `<rect x="${krastas + puse}" y="56" width="${puse}" height="28" rx="4" fill="none" stroke="${INK}" stroke-width="1.5"/>`
  t += txt(krastas + puse / 2, 75, zyme(dalis1), 14, INK)
  t += txt(krastas + puse + puse / 2, 75, zyme(dalis2), 14, INK)
  return svgRemas(plotis, aukstis, t)
}

// ── Liniuotė su milimetrais ─────────────────────────────────────────────────

/**
 * Liniuotė, kurioje matyti ir milimetrai.
 *
 * Antrokui milimetras yra naujas vienetas, ir jį galima suprasti tik pamačius:
 * tarp dviejų centimetro padalų yra dešimt smulkių brūkšnelių. Todėl smulkios
 * padalos piešiamos, o ne aprašomos žodžiais.
 */
export function liniuoteMm(cm: number, ant?: { nuo: number; iki: number }): string {
  const VIENETAS = 26
  const krastas = 20
  const virsus = ant ? 44 : 12
  const plotis = krastas * 2 + cm * VIENETAS + 2
  const aukstis = virsus + 40 + 8

  let t = ''
  if (ant) {
    const x1 = krastas + ant.nuo * VIENETAS
    const x2 = krastas + ant.iki * VIENETAS
    t += `<rect x="${x1}" y="12" width="${x2 - x1}" height="22" rx="4" fill="${ORANGE}" fill-opacity="0.3" stroke="${INK}" stroke-width="1.5"/>`
  }
  t += `<rect x="${krastas - 9}" y="${virsus}" width="${cm * VIENETAS + 18}" height="38" fill="none" stroke="${INK}" stroke-width="1.5"/>`

  for (let i = 0; i <= cm * 10; i += 1) {
    const x = krastas + (i / 10) * VIENETAS
    const stambus = i % 10 === 0
    const vidutinis = i % 5 === 0
    t += `<line x1="${x}" y1="${virsus}" x2="${x}" y2="${virsus + (stambus ? 12 : vidutinis ? 8 : 5)}" stroke="${stambus ? INK : MUTED}" stroke-width="${stambus ? 1.4 : 0.8}"/>`
    if (stambus) t += txt(x, virsus + 28, String(i / 10), 11, INK)
  }
  t += txt(krastas + cm * VIENETAS + 2, virsus - 4, 'cm', 9, MUTED)
  return svgRemas(plotis, aukstis, t)
}

// ── Svarstyklės su ciferblatu ───────────────────────────────────────────────

/**
 * Virtuvinės svarstyklės su rodykle.
 *
 * Rodmenį reikia nuskaityti iš skalės, o ne perskaityti sąlygoje — tam ši
 * potemė ir skirta. Skalė eina nuo 0 iki `maks` gramų, o didžiosios padalos
 * pasirašomos.
 */
/** Ciferblato spindulys ir lėkštelės aukštis — bendri visiems svarstyklių vaizdams. */
const CIFERBLATO_R = 58
const LEKSTES_AUKSTIS = 20

/**
 * Vienos svarstyklės turinys nurodytoje vietoje.
 *
 * Išskirta atskirai, nes tą patį ciferblatą reikia nupiešti ir vieną, ir porą
 * greta — o skalė, padalos ir rodyklė abiem atvejais yra tos pačios.
 */
function ciferblatoTurinys(cx: number, cy: number, gramai: number, maks: number): string {
  const r = CIFERBLATO_R
  const kampas = (v: number) => -90 + (360 * v) / maks
  const taskas = (laipsniai: number, ilgis: number) => [
    cx + ilgis * Math.cos((laipsniai * Math.PI) / 180),
    cy + ilgis * Math.sin((laipsniai * Math.PI) / 180),
  ]

  // Lėkštelė virš ciferblato.
  let t = `<path d="M${cx - 44} ${cy - r - LEKSTES_AUKSTIS + 6} h88 l-14 10 h-60 z" fill="${ORANGE}" fill-opacity="0.25" stroke="${INK}" stroke-width="1.6"/>`
  t += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="2"/>`

  const zingsnis = maks / 10
  for (let v = 0; v < maks; v += zingsnis / 2) {
    const stambus = v % zingsnis === 0
    const [x1, y1] = taskas(kampas(v), r - (stambus ? 11 : 6))
    const [x2, y2] = taskas(kampas(v), r - 2)
    t += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${stambus ? INK : LINE}" stroke-width="${stambus ? 1.6 : 1}"/>`
    if (stambus) {
      const [tx, ty] = taskas(kampas(v), r - 22)
      t += txt(tx, ty + 3, String(v), 9, MUTED)
    }
  }

  const [nx, ny] = taskas(kampas(Math.max(0, Math.min(maks, gramai))), r - 18)
  t += `<line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${ORANGE}" stroke-width="3" stroke-linecap="round"/>`
  t += `<circle cx="${cx}" cy="${cy}" r="4" fill="${INK}"/>`
  // Vieneto žymė po nuliu, ciferblato viršuje — kaip vadovėlio svarstyklėse.
  t += txt(cx, cy - r + 34, 'g', 11, MUTED, 600)
  return t
}

/**
 * Pilnas ratas su nuliu viršuje, kaip vadovėlio svarstyklėse: 0 ties 12
 * valandų, o toliau pagal laikrodžio rodyklę 100, 200 … 900. Tūkstantis
 * sutampa su nuliu, tad rašomas tik vienas.
 */
export function svarstykliuCiferblatas(gramai: number, maks = 1000): string {
  const c = CIFERBLATO_R + 16
  const dydis = 2 * c
  const aukstis = dydis + LEKSTES_AUKSTIS
  return svgRemas(dydis, aukstis, ciferblatoTurinys(c, c + LEKSTES_AUKSTIS, gramai, maks))
}

/**
 * Dvejos svarstyklės greta su daiktais ant lėkštelių ir langeliu palyginimui.
 *
 * Vadovėlio užduotis „Nustatyk, kiek kas sveria. Palygink“ remiasi būtent tokiu
 * vaizdu: mokinys nuskaito abu rodmenis ir tarp jų įrašo ženklą. Todėl langelis
 * tarp ciferblatų yra brėžinio dalis, o ne papuošimas.
 */
export function dviSvarstykles(
  kaire: { kas: Daiktas; gramai: number },
  desine: { kas: Daiktas; gramai: number },
  maks = 1000,
): string {
  const r = CIFERBLATO_R
  const daiktoDydis = 46
  const virsus = daiktoDydis + 6
  const vienetoPlotis = 2 * (r + 10)
  const tarpas = 52
  const plotis = 2 * vienetoPlotis + tarpas
  const cy = virsus + LEKSTES_AUKSTIS + r
  const aukstis = cy + r + 12

  const kaireX = vienetoPlotis / 2
  const desineX = vienetoPlotis + tarpas + vienetoPlotis / 2

  let t = ''
  for (const [x, pusė] of [
    [kaireX, kaire],
    [desineX, desine],
  ] as const) {
    t += daiktas(pusė.kas, x - daiktoDydis / 2, 2, daiktoDydis)
    t += ciferblatoTurinys(x, cy, pusė.gramai, maks)
  }

  // Tuščias langelis ženklui — tarp ciferblatų, jų aukštyje.
  const lx = vienetoPlotis + tarpas / 2
  t += `<rect x="${lx - 15}" y="${cy - 15}" width="30" height="30" rx="4" fill="none" stroke="${MUTED}" stroke-width="1.5" stroke-dasharray="5 4"/>`

  return svgRemas(plotis, aukstis, t)
}

// ── Matavimo indas ──────────────────────────────────────────────────────────

/**
 * Matavimo indas su padalomis ir skysčiu.
 *
 * Talpa matuojama žiūrint, iki kurios padalos pakilęs skystis — tad indas
 * turi turėti ir padalas, ir matomą skysčio lygį.
 */
export function matavimoIndas(kiek: number, talpa: number, vienetas = 'l'): string {
  const plotis = 96
  const aukstis = 168
  const krastas = 18
  const virsus = 16
  const dugnas = aukstis - 22
  const indoPlotis = 52
  const x = krastas

  const y = (v: number) => dugnas - ((dugnas - virsus) * v) / talpa

  let t = ''
  // Skystis — nuo dugno iki rodmens.
  const lygis = y(Math.max(0, Math.min(talpa, kiek)))
  t += `<rect x="${x}" y="${lygis}" width="${indoPlotis}" height="${dugnas - lygis}" fill="${ORANGE}" fill-opacity="0.35"/>`
  t += `<rect x="${x}" y="${virsus}" width="${indoPlotis}" height="${dugnas - virsus}" fill="none" stroke="${INK}" stroke-width="2"/>`

  for (let v = 0; v <= talpa; v += 1) {
    const stambus = talpa <= 10 || v % 2 === 0
    if (!stambus) continue
    t += `<line x1="${x + indoPlotis}" y1="${y(v)}" x2="${x + indoPlotis + 6}" y2="${y(v)}" stroke="${INK}" stroke-width="1.2"/>`
    t += `<text x="${x + indoPlotis + 10}" y="${y(v) + 4}" font-size="10" fill="${MUTED}" text-anchor="start">${v}</text>`
  }
  t += txt(x + indoPlotis / 2, virsus - 5, vienetas, 10, MUTED, 600)
  return svgRemas(plotis, aukstis, t)
}

// ── Dalyba kampu ────────────────────────────────────────────────────────────

/**
 * Dalyba, užrašyta kampu.
 *
 * Kampas yra pati potemės esmė: dalinys rašomas kairėje, daliklis — už
 * vertikalaus brūkšnio, o dalmuo — po horizontaliu brūkšniu dešinėje. Vien
 * tekstinis „36 : 4“ tos sandaros neparodo.
 *
 * `dalmuo` paliekamas tuščias, kai jį turi įrašyti mokinys.
 */
export function dalybaKampu(dalinys: number, daliklis: number, dalmuo?: number): string {
  const plotis = 152
  const aukstis = 84
  const x = 26
  const kampas = x + 46

  let t = `<text x="${x}" y="32" font-size="22" fill="${INK}" text-anchor="start">${dalinys}</text>`
  // Vertikalus ir horizontalus brūkšniai — pats „kampas“.
  t += `<line x1="${kampas}" y1="8" x2="${kampas}" y2="46" stroke="${INK}" stroke-width="2"/>`
  t += `<line x1="${kampas}" y1="46" x2="${kampas + 60}" y2="46" stroke="${INK}" stroke-width="2"/>`
  t += `<text x="${kampas + 10}" y="32" font-size="22" fill="${INK}" text-anchor="start">${daliklis}</text>`

  if (dalmuo === undefined) {
    t += `<rect x="${kampas + 8}" y="54" width="44" height="26" rx="4" fill="none" stroke="${MUTED}" stroke-width="1.4" stroke-dasharray="5 4"/>`
    t += txt(kampas + 30, 73, '?', 18, MUTED, 700)
  } else {
    t += `<text x="${kampas + 10}" y="74" font-size="22" fill="${INK}" text-anchor="start">${dalmuo}</text>`
  }

  // Po daliniu — sandauga ir atimties brūkšnys, kaip mokoma vadovėlyje.
  const sandauga = daliklis * (dalmuo ?? Math.round(dalinys / daliklis))
  t += `<text x="${x - 12}" y="60" font-size="20" fill="${MUTED}" text-anchor="start">−</text>`
  t += `<text x="${x}" y="60" font-size="20" fill="${MUTED}" text-anchor="start">${sandauga}</text>`
  t += `<line x1="${x - 4}" y1="66" x2="${x + 34}" y2="66" stroke="${MUTED}" stroke-width="1.4"/>`
  t += `<text x="${x}" y="82" font-size="18" fill="${MUTED}" text-anchor="start">${dalinys - sandauga}</text>`

  return svgRemas(plotis, aukstis, t)
}

// ── Termometras ─────────────────────────────────────────────────────────────

/**
 * Termometras su padalomis ir stulpeliu.
 *
 * Skalė eina nuo −10 iki 30 °C — tiek, kiek reikia orų stebėjimui. Nulis
 * pažymimas storesniu brūkšniu: nuo jo skaičiuojamas ir šaltis, ir šiluma, ir
 * būtent jį vaikas turi rasti pirmiausia.
 */
export function termometras(laipsniai: number, nuo = -10, iki = 30): string {
  const zingsnis = 7
  const krastas = 14
  const virsus = 12
  const plotis = 74
  const aukstis = virsus + (iki - nuo) * zingsnis + 34
  const x = 40
  const y = (t: number) => virsus + (iki - t) * zingsnis

  let t = ''
  // Vamzdelis ir rezervuaras apačioje.
  t += `<rect x="${x - 7}" y="${virsus - 6}" width="14" height="${(iki - nuo) * zingsnis + 10}" rx="7" fill="none" stroke="${INK}" stroke-width="1.6"/>`
  t += `<circle cx="${x}" cy="${aukstis - 16}" r="11" fill="${ORANGE}" fill-opacity="0.5" stroke="${INK}" stroke-width="1.6"/>`
  // Stulpelis nuo rezervuaro iki rodmens.
  const rodmuo = Math.max(nuo, Math.min(iki, laipsniai))
  t += `<rect x="${x - 4}" y="${y(rodmuo)}" width="8" height="${aukstis - 16 - y(rodmuo)}" fill="${ORANGE}" fill-opacity="0.75"/>`

  for (let v = nuo; v <= iki; v += 1) {
    const nulis = v === 0
    const stambus = v % 5 === 0
    if (!stambus && !nulis) continue
    t += `<line x1="${x + 8}" y1="${y(v)}" x2="${x + (nulis ? 16 : 13)}" y2="${y(v)}" stroke="${INK}" stroke-width="${nulis ? 2 : 1.2}"/>`
    t += `<text x="${x + 20}" y="${y(v) + 4}" font-size="10" fill="${nulis ? INK : MUTED}" font-weight="${nulis ? 700 : 400}" text-anchor="start">${v}</text>`
  }
  t += txt(x - 16, virsus + 4, '°C', 10, MUTED, 600)

  return svgRemas(plotis + krastas, aukstis, t)
}

// ── Daugybos lentelė ────────────────────────────────────────────────────────

/**
 * Daugybos lentelė nuo 0 iki 10.
 *
 * Potemė vadinasi „Kaip naudotis daugybos lentele?“, tad lentelė ir turi būti
 * prieš akis: mokinys mokosi rasti langelį eilutės ir stulpelio sankirtoje, o
 * ne atsiminti sandaugą. Pažymėtas langelis rodomas storesniu rėmeliu, o jei
 * `slepti`, jo reikšmė pakeičiama klaustuku.
 */
export function daugybosLentele(pazymeta?: { e: number; s: number; slepti?: boolean }): string {
  const L = 30
  const krastas = 4
  const dydis = krastas * 2 + 11 * L

  let t = ''
  for (let e = 0; e <= 10; e += 1) {
    for (let s = 0; s <= 10; s += 1) {
      const x = krastas + s * L
      const y = krastas + e * L
      const antraste = e === 0 || s === 0
      const zyme = pazymeta && pazymeta.e === e && pazymeta.s === s
      const reiksme = e === 0 && s === 0 ? '×' : antraste ? String(e + s) : String(e * s)
      t += `<rect x="${x}" y="${y}" width="${L}" height="${L}" fill="${
        antraste ? ORANGE : 'none'
      }" fill-opacity="${antraste ? 0.22 : 1}" stroke="${zyme ? INK : LINE}" stroke-width="${zyme ? 2.5 : 1}"/>`
      t += txt(
        x + L / 2,
        y + L / 2 + 4,
        zyme && pazymeta?.slepti ? '?' : reiksme,
        11,
        INK,
        antraste || zyme ? 700 : 400,
      )
    }
  }
  return svgRemas(dydis, dydis, t)
}

// ── „Kartus daugiau“ schema ─────────────────────────────────────────────────

/**
 * Juostinė schema veiksmui „kelis kartus daugiau“.
 *
 * Būtent čia antrokai klysta: „3 taškais daugiau“ ir „3 kartus daugiau“
 * skamba panašiai, o veiksmai skirtingi. Schema skirtumą parodo — kartus
 * didesnė juosta sudaryta iš tiek pat vienodų dalių, kiek yra kartų.
 */
export function kartuSchema(vienetas: number, kartai: number): string {
  const dalis = 46
  const krastas = 16
  const aukstis = 104
  const plotis = krastas * 2 + Math.max(dalis * kartai, dalis) + 60

  let t = `<rect x="${krastas}" y="18" width="${dalis}" height="26" rx="3" fill="${ORANGE}" fill-opacity="0.25" stroke="${INK}" stroke-width="1.5"/>`
  t += txt(krastas + dalis / 2, 36, String(vienetas), 13, INK, 600)

  for (let i = 0; i < kartai; i += 1) {
    const x = krastas + i * dalis
    t += `<rect x="${x}" y="60" width="${dalis}" height="26" rx="3" fill="none" stroke="${INK}" stroke-width="1.5"/>`
  }
  t += txt(krastas + (dalis * kartai) / 2, 78, '?', 15, MUTED, 700)
  t += `<text x="${krastas + dalis * kartai + 8}" y="78" font-size="11" fill="${MUTED}" text-anchor="start">${kartai} kartus daugiau</text>`
  return svgRemas(plotis, aukstis, t)
}

// ── Svarstyklės ─────────────────────────────────────────────────────────────

/**
 * Dvilėkštės svarstyklės. `pusve` nurodo, kuri lėkštė nusileidusi.
 *
 * Sunkesnis daiktas nusileidžia žemiau — tai vienintelis dalykas, kurį vaikas
 * turi nuskaityti, tad lėkščių aukščių skirtumas daromas ryškus.
 */
export function svarstykles(kaire: Daiktas, desine: Daiktas, pusve: 'kaire' | 'desine' | 'lygu'): string {
  const plotis = 220
  const aukstis = 132
  const centras = 110
  const kampas = pusve === 'lygu' ? 0 : pusve === 'kaire' ? 14 : -14
  const kY = 44 + kampas
  const dY = 44 - kampas

  let t = ''
  t += `<line x1="${centras}" y1="34" x2="${centras}" y2="104" stroke="${INK}" stroke-width="2.5"/>`
  t += `<path d="M${centras - 22} 118 h44 l-8 -14 h-28 z" fill="none" stroke="${INK}" stroke-width="2"/>`
  t += `<line x1="30" y1="${kY}" x2="190" y2="${dY}" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`
  for (const [x, y] of [
    [30, kY],
    [190, dY],
  ]) {
    t += `<path d="M${x - 24} ${y + 10} h48 l-10 16 h-28 z" fill="none" stroke="${INK}" stroke-width="1.8"/>`
  }
  t += daiktas(kaire, 30 - 15, kY - 24, 30)
  t += daiktas(desine, 190 - 15, dY - 24, 30)
  return svgRemas(plotis, aukstis, t)
}

// ── Duomenų vaizdai ─────────────────────────────────────────────────────────

export type Eilute = { vardas: string; kiek: number; kas?: Daiktas }

/**
 * Piktograma — kiekvienas paveikslėlis reiškia vieną vienetą.
 *
 * Pirmokui piktograma yra pirmoji diagrama: skaičiuoti paveikslėlius jis moka,
 * o stulpelio aukštį nuskaityti iš ašies — dar ne.
 */
export function piktograma(eilutes: readonly Eilute[], kas: Daiktas): string {
  const etiketesPlotis = 76
  const langelis = 26
  const krastas = 10
  const maks = Math.max(...eilutes.map((e) => e.kiek))
  const plotis = krastas * 2 + etiketesPlotis + maks * langelis
  const aukstis = krastas * 2 + eilutes.length * langelis

  let t = ''
  eilutes.forEach((e, i) => {
    const y = krastas + i * langelis
    t += `<text x="${krastas + etiketesPlotis - 8}" y="${y + 18}" font-size="11" fill="${INK}" text-anchor="end">${e.vardas}</text>`
    for (let k = 0; k < e.kiek; k += 1) {
      t += daiktas(e.kas ?? kas, krastas + etiketesPlotis + k * langelis + 3, y + 3, langelis - 6)
    }
  })
  return svgRemas(plotis, aukstis, t)
}

/**
 * Stulpelinė diagrama su padalomis po vieną.
 *
 * Ašies padalos rašomos kas vienetą, o ne kas penkis: pirmokas stulpelio vertę
 * nuskaito skaičiuodamas padalas, tad praleistos padalos uždavinį paverčia
 * spėjimu.
 */
export function stulpeliai(eilutes: readonly Eilute[], klaidingas?: number): string {
  const krastas = 12
  const asisPlotis = 22
  const stulpelis = 44
  const tarpas = 14
  const vienetas = 18
  const maks = Math.max(...eilutes.map((e) => e.kiek)) + 1
  const plotis = krastas * 2 + asisPlotis + eilutes.length * (stulpelis + tarpas)
  const dugnas = krastas + maks * vienetas
  const aukstis = dugnas + 26

  let t = ''
  for (let i = 0; i <= maks; i += 1) {
    const y = dugnas - i * vienetas
    t += `<line x1="${krastas + asisPlotis}" y1="${y}" x2="${plotis - krastas}" y2="${y}" stroke="${LINE}" stroke-width="1"/>`
    t += `<text x="${krastas + asisPlotis - 6}" y="${y + 4}" font-size="10" fill="${MUTED}" text-anchor="end">${i}</text>`
  }
  t += `<line x1="${krastas + asisPlotis}" y1="${krastas}" x2="${krastas + asisPlotis}" y2="${dugnas}" stroke="${INK}" stroke-width="1.5"/>`

  eilutes.forEach((e, i) => {
    const x = krastas + asisPlotis + tarpas / 2 + i * (stulpelis + tarpas)
    const h = e.kiek * vienetas
    t += `<rect x="${x}" y="${dugnas - h}" width="${stulpelis}" height="${h}" fill="${
      klaidingas === i ? ORANGE : ORANGE
    }" fill-opacity="0.35" stroke="${INK}" stroke-width="1.5"/>`
    t += txt(x + stulpelis / 2, dugnas + 16, e.vardas, 11, INK)
  })
  return svgRemas(plotis, aukstis, t)
}
