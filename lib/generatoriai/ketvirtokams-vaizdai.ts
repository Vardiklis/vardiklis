import { tekstu } from './ketvirtokams-bendra'
import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 4 klasės skaičiavimo temoms (1 ir 4 temos).
 *
 * Taisyklė ta pati kaip trečioje klasėje: brėžinys pateikia duomenis, bet
 * neišduoda atsakymo. Skyrių lentelėje ieškomas skaitmuo lieka klaustuku,
 * skaičių tiesėje ieškomas taškas — be užrašo, o daugybos stulpelyje
 * neužrašoma nei tarpinė sandauga, nei rezultatas.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 400): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Skyrių lentelė iki šimtų tūkstančių ─────────────────────────────────────

/** Skyrių santrumpos nuo vienetų į kairę. */
const SKYRIAI = ['V', 'D', 'Š', 'T', 'DT', 'ŠT'] as const

const SKYRIU_PAAISKINIMAI = [
  'V — vienetai',
  'D — dešimtys',
  'Š — šimtai',
  'T — tūkstančiai',
  'DT — dešimtys tūkstančių',
  'ŠT — šimtai tūkstančių',
] as const

/**
 * Skaičiaus skyrių lentelė. `slepiami` — skyrių numeriai nuo dešinės (0 —
 * vienetai), kurių skaitmuo uždengiamas klaustuku.
 *
 * Skyriai yra pati potemės esmė: iš eilutės „45 208“ nematyti, kad tas pats
 * skaitmuo 4 čia reiškia keturias dešimtis tūkstančių, o kitur — keturis
 * vienetus. Lentelė tai parodo, o klaustukas paverčia skaitymą samprotavimu.
 */
export function skyriuLentele(skaicius: number, slepiami: readonly number[] = []): string {
  const s = String(skaicius)
  const n = s.length
  const stulpelis = n > 4 ? 54 : 62
  const antraste = 24
  const langelis = 40
  const plotis = stulpelis * n + 4
  const aukstis = antraste + langelis + 22

  let t = ''
  for (let i = 0; i < n; i += 1) {
    const skyrius = n - 1 - i
    const x = 2 + i * stulpelis
    const slepiamas = slepiami.includes(skyrius)
    t += `<rect x="${x}" y="2" width="${stulpelis}" height="${antraste}" fill="${ORANGE}" fill-opacity="0.25" stroke="${INK}" stroke-width="1.4"/>`
    t += txt(x + stulpelis / 2, antraste - 6, SKYRIAI[skyrius], 12, INK, 700)
    t += `<rect x="${x}" y="${antraste + 2}" width="${stulpelis}" height="${langelis}" fill="none" stroke="${INK}" stroke-width="1.4"${
      slepiamas ? ' stroke-dasharray="5 4"' : ''
    }/>`
    t += txt(
      x + stulpelis / 2,
      antraste + langelis / 2 + 9,
      slepiamas ? '?' : s[i],
      20,
      slepiamas ? MUTED : INK,
      600,
    )
  }
  t += txt(plotis / 2, aukstis - 4, SKYRIU_PAAISKINIMAI.slice(0, n).reverse().join(', '), 10, MUTED)
  return svgRemas(plotis, aukstis, t)
}

// ── Skaičių tiesė dideliems skaičiams ───────────────────────────────────────

export type TieseTaskas = {
  reiksme: number
  /** Raidė virš taško. Be jos taškas lieka neįvardytas — jo reikšmę reikia rasti. */
  raide?: string
}

/**
 * Skaičių tiesė nuo `nuo` iki `iki` su padalomis kas `zingsnis`.
 *
 * Pasirašomos tik kas `zymetiKas` padalos: pasirašius visas, taško reikšmę
 * tektų ne nustatyti, o nurašyti nuo gretimo užrašo.
 */
export function skaiciuTiese(
  nuo: number,
  iki: number,
  zingsnis: number,
  taskai: readonly TieseTaskas[] = [],
  zymetiKas = 1,
): string {
  const padalu = Math.round((iki - nuo) / zingsnis)
  // Užrašai pločio nuo 12 iki 46 px, tad tarpas tarp pasirašytų padalų turi
  // būti bent 52 px — antraip „45 000“ ir „50 000“ susilipdytų į vieną dėmę.
  const tarpas = Math.max(Math.min(54 / zymetiKas, 60), Math.min(60, Math.round(640 / Math.max(padalu, 1))))
  const krastas = 34
  const asis = 62
  const plotis = krastas * 2 + padalu * tarpas
  const aukstis = asis + 32

  const x = (v: number) => krastas + ((v - nuo) / zingsnis) * tarpas

  let t = `<line x1="${krastas - 16}" y1="${asis}" x2="${plotis - krastas + 16}" y2="${asis}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<path d="M${plotis - krastas + 16} ${asis} l-9 -4.5 v9 z" fill="${INK}"/>`

  for (let i = 0; i <= padalu; i += 1) {
    const v = nuo + i * zingsnis
    const zymeti = i % zymetiKas === 0
    t += `<line x1="${x(v)}" y1="${asis - (zymeti ? 7 : 4)}" x2="${x(v)}" y2="${asis + (zymeti ? 7 : 4)}" stroke="${INK}" stroke-width="${zymeti ? 1.4 : 1}"/>`
    if (zymeti) t += txt(x(v), asis + 22, tekstu(v), 11, INK)
  }

  for (const p of taskai) {
    t += `<circle cx="${x(p.reiksme)}" cy="${asis}" r="5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
    if (p.raide) t += txt(x(p.reiksme), asis - 16, p.raide, 13, INK, 700)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Daugyba stulpeliu iš dviženklio ─────────────────────────────────────────

/**
 * Daugyba stulpeliu su tarpinėmis sandaugomis.
 *
 * Dviženklio daugiklio atveju tarpinių sandaugų poslinkis ir yra tai, ko
 * mokomasi: antroji eilutė rašoma pastumta per vieną skiltį, nes dauginama ne
 * iš 2, o iš 20. Eilutėje `348 \cdot 27` to nė nematyti.
 *
 * `rodyti`: `viskas` — visos eilutės; `be-atsakymo` — tarpinės yra, sumos nėra;
 * `tuscias` — tik veiksmas.
 */
export function daugybaStulpeliu(
  a: number,
  b: number,
  rodyti: 'viskas' | 'be-atsakymo' | 'tuscias' = 'tuscias',
): string {
  const skaitmuo = 24
  const dvizenklis = b >= 10
  const sandauga = a * b
  const pirma = a * (b % 10)
  const antra = a * Math.floor(b / 10)

  const ilgis = String(sandauga).length
  const desinysis = 46 + ilgis * skaitmuo
  const plotis = desinysis + 26
  const eiluciu = dvizenklis && rodyti !== 'tuscias' ? 5 : 3
  const aukstis = 22 + eiluciu * 34 + 16

  const eilute = (n: number, y: number, postumis = 0, spalva = INK) => {
    const s = String(n)
    let r = ''
    for (let i = 0; i < s.length; i += 1) {
      const x = desinysis - (s.length - 1 - i + postumis) * skaitmuo
      r += `<text x="${x}" y="${y}" font-size="22" fill="${spalva}" text-anchor="middle">${s[i]}</text>`
    }
    return r
  }

  const kairysis = desinysis - (ilgis - 1) * skaitmuo
  const bruksnys = (y: number) =>
    `<line x1="${kairysis - skaitmuo - 10}" y1="${y}" x2="${desinysis + 14}" y2="${y}" stroke="${INK}" stroke-width="2"/>`
  const langelis = (y: number) =>
    `<rect x="${kairysis - 14}" y="${y}" width="${ilgis * skaitmuo + 4}" height="28" rx="4" fill="none" stroke="${MUTED}" stroke-width="1.4" stroke-dasharray="5 4"/>` +
    txt((kairysis + desinysis) / 2, y + 20, '?', 18, MUTED, 700)

  let t = eilute(a, 34)
  t += `<text x="${kairysis - skaitmuo}" y="68" font-size="22" fill="${INK}" text-anchor="middle">×</text>`
  t += eilute(b, 68)
  t += bruksnys(80)

  if (!dvizenklis || rodyti === 'tuscias') {
    t += rodyti === 'viskas' ? eilute(sandauga, 108) : langelis(88)
    return svgRemas(plotis, aukstis, t)
  }

  t += eilute(pirma, 108)
  t += `<text x="${kairysis - skaitmuo}" y="142" font-size="22" fill="${INK}" text-anchor="middle">+</text>`
  t += eilute(antra, 142, 1)
  t += bruksnys(154)
  t += rodyti === 'viskas' ? eilute(sandauga, 182) : langelis(162)
  return svgRemas(plotis, aukstis, t)
}

// ── Dalyba kampu ────────────────────────────────────────────────────────────

/**
 * Dalyba kampu su visais žingsniais.
 *
 * Kiekvienas žingsnis rašomas atskira eilute — nuleidžiamas skaitmuo, atimama
 * sandauga, lieka liekana. Dalmuo virš kampo užrašomas tik tada, kai jo
 * neieškoma; kitaip brėžinys pats atsakytų į klausimą.
 */
export function dalybaKampu(dalinys: number, daliklis: number, rodytiDalmeni = false): string {
  const s = String(dalinys)
  const skaitmuo = 20
  const kaire = 22
  const dalmuo = Math.floor(dalinys / daliklis)

  // Žingsniai: kaupiama likutis, kol nuleidžiami visi skaitmenys.
  const zingsniai: { nuo: number; sandauga: number; liekana: number; skiltis: number }[] = []
  let einamas = 0
  for (let i = 0; i < s.length; i += 1) {
    einamas = einamas * 10 + Number(s[i])
    const skaitmenysDalmens = Math.floor(einamas / daliklis)
    if (skaitmenysDalmens === 0 && zingsniai.length === 0) continue
    const sandauga = skaitmenysDalmens * daliklis
    zingsniai.push({ nuo: einamas, sandauga, liekana: einamas - sandauga, skiltis: i })
    einamas -= sandauga
  }

  const eiluciu = zingsniai.length
  const kampas = kaire + s.length * skaitmuo + 8
  const plotis = kampas + 8 + Math.max(String(daliklis).length, String(dalmuo).length) * skaitmuo + 20
  const aukstis = 40 + eiluciu * 40 + 10

  const skaitmenys = (n: number, y: number, pabaigosSkiltis: number, spalva = INK, dydis = 20) => {
    const t = String(n)
    let r = ''
    for (let i = 0; i < t.length; i += 1) {
      const skiltis = pabaigosSkiltis - (t.length - 1 - i)
      const x = kaire + skiltis * skaitmuo + skaitmuo / 2
      r += `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" text-anchor="middle">${t[i]}</text>`
    }
    return r
  }

  let t = skaitmenys(dalinys, 30, s.length - 1)
  t += `<line x1="${kampas}" y1="8" x2="${kampas}" y2="44" stroke="${INK}" stroke-width="2"/>`
  t += `<line x1="${kampas}" y1="44" x2="${plotis - 10}" y2="44" stroke="${INK}" stroke-width="2"/>`
  t += `<text x="${kampas + 10}" y="30" font-size="20" fill="${INK}" text-anchor="start">${daliklis}</text>`

  if (rodytiDalmeni) {
    t += `<text x="${kampas + 10}" y="70" font-size="20" fill="${INK}" text-anchor="start">${dalmuo}</text>`
  } else {
    t += `<rect x="${kampas + 8}" y="52" width="${String(dalmuo).length * skaitmuo + 10}" height="26" rx="4" fill="none" stroke="${MUTED}" stroke-width="1.4" stroke-dasharray="5 4"/>`
    t += txt(kampas + 13 + (String(dalmuo).length * skaitmuo) / 2, 71, '?', 17, MUTED, 700)
  }

  zingsniai.forEach((z, i) => {
    const y = 56 + i * 40
    const sandaugosPlotis = String(z.sandauga).length * skaitmuo
    const desine = kaire + (z.skiltis + 1) * skaitmuo
    t += `<text x="${desine - sandaugosPlotis - 12}" y="${y}" font-size="18" fill="${MUTED}" text-anchor="middle">−</text>`
    t += skaitmenys(z.sandauga, y, z.skiltis, MUTED, 18)
    t += `<line x1="${desine - sandaugosPlotis - 4}" y1="${y + 6}" x2="${desine}" y2="${y + 6}" stroke="${MUTED}" stroke-width="1.2"/>`
    // Liekana rašoma su nuleistu kitu skaitmeniu, kaip ir sąsiuvinyje.
    const kitas = z.skiltis + 1 < s.length ? s[z.skiltis + 1] : ''
    t += skaitmenys(Number(`${z.liekana}${kitas}`), y + 26, z.skiltis + (kitas ? 1 : 0), MUTED, 18)
  })

  return svgRemas(plotis, aukstis, t)
}

// ── Dvi sekos, surašytos pakaitomis ─────────────────────────────────────────

/**
 * Dvi sekos, surašytos į vieną eilutę pakaitomis.
 *
 * Būtent tai ir yra potemės sunkumas: eilutė „3, 10, 6, 20, 9, 30“ atrodo be
 * dėsnio, kol nepamatai, kad tai dvi sekos. Vienos nariai piešiami tamsesniu
 * fonu, kitos — šviesesniu, bet ta pati eilė lieka viena.
 */
export function pintosSekos(nariai: readonly (number | null)[]): string {
  const langelis = 54
  const tarpas = 8
  const aukstis = 62
  const plotis = nariai.length * (langelis + tarpas) + tarpas

  let t = ''
  nariai.forEach((n, i) => {
    const x = tarpas + i * (langelis + tarpas)
    const pirmoji = i % 2 === 0
    t += `<rect x="${x}" y="10" width="${langelis}" height="40" rx="6" fill="${pirmoji ? ORANGE : LINE}" fill-opacity="${pirmoji ? 0.28 : 0.5}" stroke="${INK}" stroke-width="1.3"${
      n === null ? ' stroke-dasharray="5 4"' : ''
    }/>`
    t += txt(x + langelis / 2, 38, n === null ? '?' : tekstu(n), 17, n === null ? MUTED : INK, 600)
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Veiksmų eilė reiškinyje ─────────────────────────────────────────────────

/**
 * Reiškinys su sunumeruotais veiksmais.
 *
 * `zingsniai` — veiksmų ženklai jų atlikimo eile; virš kiekvieno rašomas
 * numeris. Naudojama tada, kai klausiama ne rezultato, o tvarkos, arba
 * tikrinamas kito mokinio sprendimas.
 */
export function reiskinioTvarka(
  dalys: readonly string[],
  numeriai: readonly (number | null)[],
): string {
  const tarpas = 10
  const plotis = dalys.reduce((s, d) => s + d.length * 12 + tarpas, 0) + 24
  const aukstis = 62

  let t = ''
  let x = 12
  dalys.forEach((d, i) => {
    const w = d.length * 12
    t += `<text x="${x + w / 2}" y="46" font-size="20" fill="${INK}" text-anchor="middle">${d}</text>`
    const n = numeriai[i]
    if (n !== null && n !== undefined) {
      t += `<circle cx="${x + w / 2}" cy="20" r="11" fill="${ORANGE}" fill-opacity="0.3" stroke="${INK}" stroke-width="1.2"/>`
      t += txt(x + w / 2, 25, String(n), 12, INK, 700)
    }
    x += w + tarpas
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Odometras ───────────────────────────────────────────────────────────────

/**
 * Automobilio odometras — šeši būgneliai su skaitmenimis.
 *
 * Pirmieji nuliai čia yra ne pagražinimas, o pati potemės esmė: rodmuo
 * `045 620` mokiniui atrodo kaip keturženklis, kol jis nesupranta, kad visos
 * skiltys visada užpildytos. Todėl skaitmenys piešiami vienodais langeliais.
 */
export function odometras(kilometrai: number, etikete?: string): string {
  const skaitmenys = String(kilometrai).padStart(6, '0').split('')
  const langelis = 30
  const aukstis = 46 + (etikete ? 18 : 0)
  const krastas = 10
  const plotis = krastas * 2 + skaitmenys.length * langelis + 30

  let t = `<rect x="${krastas - 4}" y="6" width="${skaitmenys.length * langelis + 8}" height="34" rx="5" fill="${LINE}" fill-opacity="0.25" stroke="${INK}" stroke-width="1.6"/>`
  skaitmenys.forEach((c, i) => {
    const x = krastas + i * langelis
    if (i > 0) {
      t += `<line x1="${x}" y1="8" x2="${x}" y2="38" stroke="${INK}" stroke-width="0.8"/>`
    }
    t += `<text x="${x + langelis / 2}" y="31" font-size="20" fill="${INK}" font-weight="600" text-anchor="middle">${c}</text>`
  })
  t += `<text x="${krastas + skaitmenys.length * langelis + 8}" y="31" font-size="13" fill="${MUTED}" text-anchor="start">km</text>`
  if (etikete) t += txt(plotis / 2, aukstis - 4, etikete, 12, MUTED, 600)
  return svgRemas(plotis, aukstis, t)
}

/** Kelių odometrų eilė su raidėmis — palyginimui. */
export function odometruEile(rodmenys: readonly { raide: string; km: number }[]): string {
  const vienas = 6 * 30 + 50
  const tarpas = 14
  const plotis = rodmenys.length * (vienas + tarpas) + tarpas
  const aukstis = 64

  let t = ''
  rodmenys.forEach((r, i) => {
    const x = tarpas + i * (vienas + tarpas)
    const vidus = odometras(r.km)
      .replace(/^<svg[^>]*>/, '')
      .replace(/<\/svg>$/, '')
    t += `<g transform="translate(${x}, 0)">${vidus}</g>`
    t += txt(x + vienas / 2, 60, r.raide, 13, INK, 700)
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Juostinė schema tekstiniam uždaviniui ───────────────────────────────────

export type Juosta = {
  vardas: string
  /** Santykinis ilgis — kiek dalių iš `daliu`. */
  dalys: number
  /** Užrašas ant juostos; be jo juosta lieka nežinoma. */
  uzrasas?: string
}

/**
 * Dviejų ar trijų juostų schema su bendra skale.
 *
 * Kelių žingsnių uždavinyje sunkiausia ne suskaičiuoti, o pamatyti, kas su kuo
 * lyginama. Juostos parodo santykį: „dvigubai daugiau“ yra dvigubai ilgesnė
 * juosta, o ne žodis sąlygoje.
 */
export function juostuSchema(juostos: readonly Juosta[], visasUzrasas?: string): string {
  const maks = Math.max(...juostos.map((j) => j.dalys))
  const vardoPlotis = 96
  const juostosPlotis = 380
  const eilute = 44
  const plotis = vardoPlotis + juostosPlotis + 30
  const aukstis = juostos.length * eilute + (visasUzrasas ? 42 : 16)

  let t = ''
  juostos.forEach((j, i) => {
    const y = 10 + i * eilute
    const w = (j.dalys / maks) * juostosPlotis
    t += `<text x="${vardoPlotis - 8}" y="${y + 22}" font-size="13" fill="${INK}" text-anchor="end">${j.vardas}</text>`
    t += `<rect x="${vardoPlotis}" y="${y}" width="${w}" height="30" rx="4" fill="${ORANGE}" fill-opacity="${0.18 + i * 0.12}" stroke="${INK}" stroke-width="1.3"/>`
    t += txt(vardoPlotis + w / 2, y + 20, j.uzrasas ?? '?', 14, j.uzrasas ? INK : MUTED, 700)
  })

  if (visasUzrasas) {
    const y = juostos.length * eilute + 14
    t += `<line x1="${vardoPlotis}" y1="${y}" x2="${vardoPlotis + juostosPlotis}" y2="${y}" stroke="${MUTED}" stroke-width="1.2"/>`
    t += `<line x1="${vardoPlotis}" y1="${y - 5}" x2="${vardoPlotis}" y2="${y + 5}" stroke="${MUTED}" stroke-width="1.2"/>`
    t += `<line x1="${vardoPlotis + juostosPlotis}" y1="${y - 5}" x2="${vardoPlotis + juostosPlotis}" y2="${y + 5}" stroke="${MUTED}" stroke-width="1.2"/>`
    t += txt(vardoPlotis + juostosPlotis / 2, y + 18, visasUzrasas, 12, MUTED, 600)
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Judėjimo schema ─────────────────────────────────────────────────────────

export type JudejimoDalis = {
  /** Užrašas po atkarpa: nuvažiuotas kelias arba klaustukas. */
  kelias: string
  /** Užrašas virš atkarpos: trukmė arba greitis. */
  virsuje?: string
  /** Santykinis atkarpos ilgis. */
  dalis: number
}

/**
 * Kelio atkarpa su pažymėtais duomenimis.
 *
 * Judėjimo uždavinyje sunkiausia ne padauginti, o pamatyti, kas duota: ar
 * atkarpos ilgis, ar jos įveikimo laikas. Schema tai išskiria — laikas rašomas
 * virš rodyklės, kelias po ja, o ieškomas dydis lieka klaustuku.
 */
export function judejimoSchema(dalys: readonly JudejimoDalis[], pradzia = 'Pradžia', pabaiga = 'Pabaiga'): string {
  const viso = dalys.reduce((s, d) => s + d.dalis, 0)
  const juostosPlotis = 480
  const krastas = 44
  const asis = 62
  const plotis = juostosPlotis + krastas * 2
  const aukstis = 106

  let t = `<line x1="${krastas}" y1="${asis}" x2="${krastas + juostosPlotis}" y2="${asis}" stroke="${INK}" stroke-width="2"/>`
  t += `<path d="M${krastas + juostosPlotis} ${asis} l-10 -5 v10 z" fill="${INK}"/>`
  t += txt(krastas, asis + 24, pradzia, 11, MUTED, 600)
  t += txt(krastas + juostosPlotis, asis + 24, pabaiga, 11, MUTED, 600)

  let x = krastas
  for (const d of dalys) {
    const w = (d.dalis / viso) * juostosPlotis
    t += `<line x1="${x}" y1="${asis - 9}" x2="${x}" y2="${asis + 9}" stroke="${INK}" stroke-width="1.6"/>`
    if (d.virsuje) t += txt(x + w / 2, asis - 18, d.virsuje, 12, INK, 600)
    t += `<path d="M${x + 6} ${asis - 30} h${w - 12}" stroke="${MUTED}" stroke-width="1" stroke-dasharray="4 3"/>`
    t += txt(x + w / 2, asis + 42, d.kelias, 13, INK, 700)
    x += w
  }
  t += `<line x1="${x}" y1="${asis - 9}" x2="${x}" y2="${asis + 9}" stroke="${INK}" stroke-width="1.6"/>`
  return svgRemas(plotis, aukstis, t)
}

// ── Programos langas ────────────────────────────────────────────────────────

/**
 * Komandų sąrašas — programos vaizdas.
 *
 * Programavimo potemėse svarbu ne tik kas parašyta, bet ir kelinta eilutė: be
 * numerių klausimas „kurioje eilutėje klaida?“ neturi atsakymo.
 */
export function programosLangas(eilutes: readonly string[], pazymeta?: number): string {
  const eilute = 26
  const plotis = 24 + Math.max(...eilutes.map((e) => e.length)) * 8.4 + 40
  const aukstis = eilutes.length * eilute + 20
  // Programose pasitaiko `<` ir `>` — SVG tekste jie turi būti pakeisti.
  const saugu = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  let t = `<rect x="1" y="1" width="${plotis - 2}" height="${aukstis - 2}" rx="6" fill="${LINE}" fill-opacity="0.28" stroke="${INK}" stroke-width="1.2"/>`
  eilutes.forEach((e, i) => {
    const y = 14 + i * eilute
    if (pazymeta === i + 1) {
      t += `<rect x="4" y="${y + 2}" width="${plotis - 8}" height="${eilute - 4}" rx="4" fill="${ORANGE}" fill-opacity="0.28"/>`
    }
    t += `<text x="16" y="${y + 18}" font-size="12" fill="${MUTED}" text-anchor="end">${i + 1}</text>`
    t += `<text x="26" y="${y + 18}" font-size="13" fill="${INK}" font-family="ui-monospace, monospace" text-anchor="start">${saugu(e)}</text>`
  })
  return svgRemas(plotis, aukstis, t)
}
