import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 3 klasės temai „Sudėtis ir atimtis iki 10 000“.
 *
 * Tema yra apie skyrius: tūkstančius, šimtus, dešimtis, vienetus — ir apie tai,
 * kas nutinka jiems susidedant arba ardantis. Vien tekstu to parodyti negalima:
 * `4 8 0 6` mokiniui yra tik keturi skaitmenys, o skyrių lentelėje ar stulpelyje
 * matyti, kuris kuriam priklauso ir kuris kurį veikia. Todėl šie brėžiniai yra
 * uždavinio sąlygos dalis, o ne iliustracija.
 *
 * Spalvos rašomos kintamaisiais, kad išspausdinus juodai baltai uždavinys
 * liktų sprendžiamas.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 400): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Skyrių lentelė ──────────────────────────────────────────────────────────

export type Skyriai = {
  tukstanciai: number | null
  simtai: number | null
  desimtys: number | null
  vienetai: number | null
}

/**
 * Keturių skyrių lentelė T | Š | D | V.
 *
 * `null` reikšmė piešiama brūkšniniu langeliu su klaustuku — tai vieta, kurią
 * mokinys turi užpildyti. Antraštės rašomos santrumpomis, kaip vadovėlyje, o
 * po lentele — jų paaiškinimas, kad santrumpa nebūtų mįslė.
 */
export function skyriuLentele4(s: Skyriai): string {
  const stulpelis = 62
  const antraste = 24
  const langelis = 40
  const plotis = stulpelis * 4 + 4
  const aukstis = antraste + langelis + 22

  const stulp = (x: number, zyme: string, reiksme: number | null) =>
    `<rect x="${x}" y="2" width="${stulpelis}" height="${antraste}" fill="${ORANGE}" fill-opacity="0.25" stroke="${INK}" stroke-width="1.4"/>` +
    txt(x + stulpelis / 2, antraste - 6, zyme, 12, INK, 700) +
    `<rect x="${x}" y="${antraste + 2}" width="${stulpelis}" height="${langelis}" fill="none" stroke="${INK}" stroke-width="1.4"${
      reiksme === null ? ' stroke-dasharray="5 4"' : ''
    }/>` +
    txt(
      x + stulpelis / 2,
      antraste + langelis / 2 + 9,
      reiksme === null ? '?' : String(reiksme),
      20,
      reiksme === null ? MUTED : INK,
      600,
    )

  let t = ''
  t += stulp(2, 'T', s.tukstanciai)
  t += stulp(stulpelis + 2, 'Š', s.simtai)
  t += stulp(stulpelis * 2 + 2, 'D', s.desimtys)
  t += stulp(stulpelis * 3 + 2, 'V', s.vienetai)
  t += txt(plotis / 2, aukstis - 4, 'T — tūkstančiai, Š — šimtai, D — dešimtys, V — vienetai', 10, MUTED)
  return svgRemas(plotis, aukstis, t)
}

// ── Veiksmas stulpeliu su uždengtais skaitmenimis ───────────────────────────

/** Kurioje eilutėje slepiamas skaitmuo. */
export type Eilute = 'pirma' | 'antra' | 'atsakymas'

export type Slepiamas = {
  eilute: Eilute
  /** Skyriaus numeris nuo dešinės: 0 — vienetai, 1 — dešimtys, 2 — šimtai, 3 — tūkstančiai. */
  skyrius: number
}

/**
 * Sudėtis arba atimtis stulpeliu; nurodyti skaitmenys uždengiami langeliu.
 *
 * Būtent stulpelis ir yra šios temos turinys: kad vienetai stovėtų po vienetais,
 * o iš dešimčių pasiskolintas šimtas keliautų į kitą skiltį, mokinys turi
 * matyti. Uždengus vieną skaitmenį uždavinys iš skaičiavimo virsta samprotavimu
 * — kokio skaitmens ten trūksta, kad veiksmas išeitų.
 */
export function stulpelis4(
  a: number,
  b: number,
  zenklas: '+' | '−',
  atsakymas: number | null,
  slepiami: readonly Slepiamas[] = [],
): string {
  const skaitmuo = 26
  const ilgis = Math.max(String(a).length, String(b).length, String(atsakymas ?? 0).length)
  const desinysis = 40 + ilgis * skaitmuo
  const plotis = desinysis + 26
  const aukstis = 132

  const paslepta = (eilute: Eilute, skyrius: number) =>
    slepiami.some((s) => s.eilute === eilute && s.skyrius === skyrius)

  const eiluteSvg = (n: number, y: number, kuri: Eilute) => {
    const s = String(n)
    let r = ''
    for (let i = 0; i < s.length; i += 1) {
      const skyrius = s.length - 1 - i
      const x = desinysis - skyrius * skaitmuo
      if (paslepta(kuri, skyrius)) {
        r += `<rect x="${x - 12}" y="${y - 20}" width="24" height="26" rx="4" fill="none" stroke="${MUTED}" stroke-width="1.4" stroke-dasharray="5 4"/>`
        r += txt(x, y, '?', 18, MUTED, 700)
      } else {
        r += `<text x="${x}" y="${y}" font-size="22" fill="${INK}" text-anchor="middle">${s[i]}</text>`
      }
    }
    return r
  }

  // Ženklas atitraukiamas viso skaitmens pločiu — antraip prilimptų prie
  // ilgiausios eilutės pirmojo skaitmens.
  const kairysis = desinysis - (ilgis - 1) * skaitmuo

  let t = ''
  t += eiluteSvg(a, 36, 'pirma')
  t += `<text x="${kairysis - skaitmuo}" y="70" font-size="22" fill="${INK}" text-anchor="middle">${zenklas}</text>`
  t += eiluteSvg(b, 70, 'antra')
  t += `<line x1="${kairysis - skaitmuo - 10}" y1="82" x2="${desinysis + 14}" y2="82" stroke="${INK}" stroke-width="2"/>`
  if (atsakymas === null) {
    t += `<rect x="${kairysis - 14}" y="90" width="${ilgis * skaitmuo + 4}" height="30" rx="4" fill="none" stroke="${MUTED}" stroke-width="1.4" stroke-dasharray="5 4"/>`
    t += txt((kairysis + desinysis) / 2, 111, '?', 18, MUTED, 700)
  } else {
    t += eiluteSvg(atsakymas, 112, 'atsakymas')
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Apvalinimo tiesė ────────────────────────────────────────────────────────

/**
 * Atkarpa tarp dviejų gretimų apvalių skaičių su pažymėtu skaičiumi.
 *
 * Apvalinimas yra ne taisyklė apie penketą, o klausimas „prie kurio galo
 * arčiau?“. Vidurys pažymimas atskirai — jis ir yra riba, pagal kurią
 * sprendžiama, o be brėžinio mokiniui tenka tik įsiminti.
 */
export function apvalinimoTiese(skaicius: number, tikslumas: number): string {
  const zemiau = Math.floor(skaicius / tikslumas) * tikslumas
  const auksciau = zemiau + tikslumas
  const vidurys = zemiau + tikslumas / 2

  const krastas = 46
  const plotis = 520
  const asis = 64
  const aukstis = asis + 44
  const x = (v: number) => krastas + ((v - zemiau) / tikslumas) * (plotis - 2 * krastas)

  let t = `<line x1="${krastas}" y1="${asis}" x2="${plotis - krastas}" y2="${asis}" stroke="${INK}" stroke-width="1.6"/>`

  for (let i = 0; i <= 10; i += 1) {
    const v = zemiau + (i * tikslumas) / 10
    const stambi = i === 0 || i === 5 || i === 10
    t += `<line x1="${x(v)}" y1="${asis - (stambi ? 8 : 4)}" x2="${x(v)}" y2="${asis + (stambi ? 8 : 4)}" stroke="${
      stambi ? INK : LINE
    }" stroke-width="${stambi ? 1.4 : 1}"/>`
  }
  t += txt(x(zemiau), asis + 24, String(zemiau), 12, INK, 600)
  t += txt(x(auksciau), asis + 24, String(auksciau), 12, INK, 600)
  t += txt(x(vidurys), asis + 24, String(vidurys), 11, MUTED)

  t += `<circle cx="${x(skaicius)}" cy="${asis}" r="5.5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
  t += txt(x(skaicius), asis - 16, String(skaicius), 13, INK, 700)
  return svgRemas(plotis, aukstis, t)
}

// ── Kainoraštis ─────────────────────────────────────────────────────────────

export type Preke = { pavadinimas: string; kaina: number }

/**
 * Elektroninės parduotuvės kainoraštis.
 *
 * Potemė prašo uždavinio pagal parduotuvės duomenis, tad duomenys ir turi būti
 * pateikti kaip parduotuvėje — lentele. Klausime kainos nekartojamos: jas
 * reikia susirasti pačiam, o tai jau pirmas uždavinio žingsnis.
 */
export function kainorastis(prekes: readonly Preke[]): string {
  const eilute = 30
  const plotis = 300
  const aukstis = eilute * (prekes.length + 1) + 4

  let t = `<rect x="2" y="2" width="${plotis - 4}" height="${eilute}" fill="${ORANGE}" fill-opacity="0.25" stroke="${INK}" stroke-width="1.3"/>`
  t += `<text x="14" y="${eilute - 9}" font-size="12" fill="${INK}" font-weight="700">Prekė</text>`
  t += `<text x="${plotis - 14}" y="${eilute - 9}" font-size="12" fill="${INK}" font-weight="700" text-anchor="end">Kaina</text>`

  prekes.forEach((p, i) => {
    const y = eilute * (i + 1) + 2
    t += `<rect x="2" y="${y}" width="${plotis - 4}" height="${eilute}" fill="none" stroke="${LINE}" stroke-width="1.1"/>`
    t += `<text x="14" y="${y + eilute - 10}" font-size="13" fill="${INK}">${p.pavadinimas}</text>`
    t += `<text x="${plotis - 14}" y="${y + eilute - 10}" font-size="13" fill="${INK}" font-weight="600" text-anchor="end">${p.kaina} eur</text>`
  })
  return svgRemas(plotis, aukstis, t)
}
