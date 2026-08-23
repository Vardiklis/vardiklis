import { svgRemas } from './vaizdai'

/**
 * Brėžiniai 3 klasės skaičių ir trupmenų temoms.
 *
 * Taisyklė, kurios laikomasi visur: brėžinys pateikia duomenis, o mokinio
 * tekstas neišduoda to, ką reikia iš jo nustatyti. Todėl skaičių tiesėje
 * ieškomas taškas lieka be užrašo, o trupmenos modelyje nerašoma pati
 * trupmena.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

function txt(x: number, y: number, t: string, dydis = 11, spalva = MUTED, storis = 400): string {
  return `<text x="${x}" y="${y}" font-size="${dydis}" fill="${spalva}" font-weight="${storis}" text-anchor="middle">${t}</text>`
}

// ── Skaičių tiesė ───────────────────────────────────────────────────────────

export type TieseTaskas = {
  reiksme: number
  /** Raidė virš taško. Be jos taškas lieka neįvardytas — jo reikšmę reikia nustatyti. */
  raide?: string
  /** Ar po tašku rašyti jo skaitinę reikšmę. */
  rodytiReiksme?: boolean
}

/**
 * Skaičių tiesė su padalomis ir pažymėtais taškais.
 *
 * Pasirašomos tik kas `zymetiKas` padalos — kitaip tiesė nuo 500 iki 700 su
 * padalomis kas 20 virstų skaičių eile, ir ieškoti nieko nebereikėtų.
 */
export function skaiciuTiese(
  nuo: number,
  iki: number,
  zingsnis: number,
  taskai: readonly TieseTaskas[] = [],
  zymetiKas = 1,
): string {
  const padalu = Math.round((iki - nuo) / zingsnis)
  const tarpas = Math.max(26, Math.min(60, Math.round(560 / Math.max(padalu, 1))))
  const krastas = 30
  const asis = 60
  const plotis = krastas * 2 + padalu * tarpas
  const aukstis = asis + 30

  const x = (v: number) => krastas + ((v - nuo) / zingsnis) * tarpas

  let t = `<line x1="${krastas - 14}" y1="${asis}" x2="${plotis - krastas + 14}" y2="${asis}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<path d="M${plotis - krastas + 14} ${asis} l-9 -4.5 v9 z" fill="${INK}"/>`

  for (let i = 0; i <= padalu; i += 1) {
    const v = nuo + i * zingsnis
    const zymeti = i % zymetiKas === 0
    t += `<line x1="${x(v)}" y1="${asis - (zymeti ? 7 : 4)}" x2="${x(v)}" y2="${asis + (zymeti ? 7 : 4)}" stroke="${INK}" stroke-width="${zymeti ? 1.4 : 1}"/>`
    if (zymeti) t += txt(x(v), asis + 21, String(v), 11, INK)
  }

  for (const p of taskai) {
    t += `<circle cx="${x(p.reiksme)}" cy="${asis}" r="5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
    if (p.raide) t += txt(x(p.reiksme), asis - 16, p.raide, 13, INK, 700)
    if (p.rodytiReiksme) t += txt(x(p.reiksme), asis + 21, String(p.reiksme), 11, INK, 700)
  }
  return svgRemas(plotis, aukstis, t)
}

/**
 * Skaičių tiesė su šuoliais — sudėties ar atimties būdui parodyti.
 *
 * Kiekvienas šuolis pasirašomas („+100“, „−50“), o pradžios ir pabaigos
 * reikšmės — ne: kaip tik jas mokinys ir turi nustatyti.
 */
export function tieseSuSuoliais(
  nuo: number,
  iki: number,
  norimasZingsnis: number,
  pradzia: number,
  suoliai: readonly number[],
): string {
  // Prašomas žingsnis yra tik pageidavimas. Tiesė nuo 0 iki 800 su padalomis
  // kas 10 būtų aštuoniasdešimt brūkšnelių — atspausdinta ji virstų pilka
  // juostele, tad retiname, kol telpa ne daugiau kaip dvidešimt keturios.
  let zingsnis = norimasZingsnis
  for (const kandidatas of [10, 20, 25, 50, 100]) {
    if (kandidatas < zingsnis) continue
    zingsnis = kandidatas
    if ((iki - nuo) / zingsnis <= 24) break
  }
  const padalu = Math.round((iki - nuo) / zingsnis)
  const tarpas = Math.max(24, Math.min(46, Math.round(620 / Math.max(padalu, 1))))
  const krastas = 30
  const asis = 96
  const plotis = krastas * 2 + padalu * tarpas
  const aukstis = asis + 44
  const x = (v: number) => krastas + ((v - nuo) / zingsnis) * tarpas

  let t = `<line x1="${krastas - 14}" y1="${asis}" x2="${plotis - krastas + 14}" y2="${asis}" stroke="${INK}" stroke-width="1.6"/>`
  t += `<path d="M${plotis - krastas + 14} ${asis} l-9 -4.5 v9 z" fill="${INK}"/>`

  // Pasirašomos ne kas n-toji padala, o apvalios reikšmės: kitaip tiesė nuo 0
  // su padalomis kas 25 būtų pasirašyta 0, 75, 150, 225 — trečiokui tokia
  // skalė neskaitoma.
  const zymesZingsnis =
    [25, 50, 100, 200, 250, 500].find((z) => z >= zingsnis && (iki - nuo) / z <= 9) ?? 500
  for (let i = 0; i <= padalu; i += 1) {
    const v = nuo + i * zingsnis
    const zymeti = v % zymesZingsnis === 0
    t += `<line x1="${x(v)}" y1="${asis - (zymeti ? 6 : 3)}" x2="${x(v)}" y2="${asis + (zymeti ? 6 : 3)}" stroke="${LINE}" stroke-width="1"/>`
    if (zymeti) t += txt(x(v), asis + 20, String(v), 10, MUTED)
  }

  let dabar = pradzia
  t += `<circle cx="${x(dabar)}" cy="${asis}" r="4.5" fill="${ORANGE}" stroke="${INK}" stroke-width="1.4"/>`
  // Pradžia pasirašoma visada: ji retai pataiko į pasirašytą padalą, o
  // nenuskaitęs, nuo kur šokama, mokinys uždavinio išspręsti negalėtų.
  // Pabaiga lieka be užrašo — kaip tik ją reikia apskaičiuoti.
  // Rašoma eilute žemiau nei padalų reikšmės, kad neužsidėtų ant jų.
  t += `<line x1="${x(dabar)}" y1="${asis + 6}" x2="${x(dabar)}" y2="${asis + 24}" stroke="${ORANGE}" stroke-width="1.2"/>`
  t += txt(x(dabar), asis + 36, String(pradzia), 12, INK, 700)
  for (const s of suoliai) {
    const kitas = dabar + s
    const x1 = x(dabar)
    const x2 = x(kitas)
    // Lanko aukštis pagal šuolio plotį: kitaip trumpas šuolis pasislepia po
    // ilgojo lanku ir jų rodyklės susilieja.
    const aukstisLanko = 12 + Math.min(24, Math.abs(x2 - x1) * 0.16)
    t += `<path d="M${x1} ${asis - 6} Q ${(x1 + x2) / 2} ${asis - 6 - aukstisLanko * 2} ${x2} ${asis - 6}" fill="none" stroke="${ORANGE}" stroke-width="2"/>`
    const kryptis = x2 > x1 ? 1 : -1
    t += `<path d="M${x2} ${asis - 6} l${-8 * kryptis} -7 l1 9 z" fill="${ORANGE}"/>`
    t += txt((x1 + x2) / 2, asis - 6 - aukstisLanko - 4, `${s > 0 ? '+' : '−'}${Math.abs(s)}`, 11, INK, 600)
    dabar = kitas
  }
  return svgRemas(plotis, aukstis, t)
}

// ── Trupmenos modelis ───────────────────────────────────────────────────────

/**
 * Juosta, padalyta į lygias dalis; dalis jų nuspalvinta.
 *
 * Trupmena po piešiniu nerašoma — mokinys ją turi užrašyti pats.
 */
export function trupmenosJuosta(daliu: number, nuspalvinta: number, plotisPx = 300): string {
  const aukstis = 44
  const krastas = 8
  const dalis = plotisPx / daliu

  let t = ''
  for (let i = 0; i < daliu; i += 1) {
    t += `<rect x="${krastas + i * dalis}" y="6" width="${dalis}" height="${aukstis - 12}" fill="${
      i < nuspalvinta ? ORANGE : 'none'
    }" fill-opacity="${i < nuspalvinta ? 0.45 : 1}" stroke="${INK}" stroke-width="1.5"/>`
  }
  return svgRemas(plotisPx + 2 * krastas, aukstis, t)
}

/** Apskritimas, padalytas į lygias dalis — „pica“ trupmenoms. */
export function trupmenosApskritimas(daliu: number, nuspalvinta: number, r = 52): string {
  const c = r + 10
  const dydis = 2 * c

  const taskas = (i: number) => {
    const kampas = ((i / daliu) * 2 * Math.PI) - Math.PI / 2
    return [c + r * Math.cos(kampas), c + r * Math.sin(kampas)]
  }

  let t = ''
  for (let i = 0; i < daliu; i += 1) {
    const [x1, y1] = taskas(i)
    const [x2, y2] = taskas(i + 1)
    const didelis = daliu === 1 ? 1 : 0
    t += `<path d="M${c} ${c} L${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${didelis} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${
      i < nuspalvinta ? ORANGE : 'none'
    }" fill-opacity="${i < nuspalvinta ? 0.45 : 1}" stroke="${INK}" stroke-width="1.5"/>`
  }
  return svgRemas(dydis, dydis, t)
}

/** Dvi vienodo ilgio juostos greta — trupmenoms palyginti. */
export function dviJuostos(
  a: { daliu: number; nuspalvinta: number },
  b: { daliu: number; nuspalvinta: number },
): string {
  const plotisPx = 280
  const krastas = 24
  const juostosAukstis = 34
  const tarpas = 18
  const aukstis = 2 * juostosAukstis + tarpas + 16

  const juosta = (o: { daliu: number; nuspalvinta: number }, y: number, zyme: string) => {
    const dalis = plotisPx / o.daliu
    let r = txt(krastas - 12, y + juostosAukstis / 2 + 4, zyme, 12, MUTED, 700)
    for (let i = 0; i < o.daliu; i += 1) {
      r += `<rect x="${krastas + i * dalis}" y="${y}" width="${dalis}" height="${juostosAukstis}" fill="${
        i < o.nuspalvinta ? ORANGE : 'none'
      }" fill-opacity="${i < o.nuspalvinta ? 0.45 : 1}" stroke="${INK}" stroke-width="1.5"/>`
    }
    return r
  }

  return svgRemas(
    plotisPx + krastas + 12,
    aukstis,
    juosta(a, 8, '1') + juosta(b, 8 + juostosAukstis + tarpas, '2'),
  )
}

// ── Figūrų sekos ────────────────────────────────────────────────────────────

export type Figura = 'trikampis' | 'kvadratas' | 'apskritimas'

/** Viena figūra, įpiešta į `dydis × dydis` langelį su viršutiniu kairiuoju kampu (x, y). */
function figura(f: Figura, x: number, y: number, dydis: number, pilna: boolean): string {
  const uzpildas = pilna ? `fill="${ORANGE}" fill-opacity="0.45"` : 'fill="none"'
  const c = dydis / 2
  if (f === 'apskritimas') {
    return `<circle cx="${x + c}" cy="${y + c}" r="${c - 1}" ${uzpildas} stroke="${INK}" stroke-width="1.5"/>`
  }
  if (f === 'kvadratas') {
    return `<rect x="${x + 1}" y="${y + 1}" width="${dydis - 2}" height="${dydis - 2}" ${uzpildas} stroke="${INK}" stroke-width="1.5"/>`
  }
  return `<path d="M${x + c} ${y + 1} L${x + dydis - 1} ${y + dydis - 1} L${x + 1} ${y + dydis - 1} Z" ${uzpildas} stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`
}

/**
 * Besikartojanti figūrų eilė; gale — klaustuku pažymėtos vietos.
 *
 * Pati besikartojanti grupė piešinyje niekaip neišskiriama — mokinys ją turi
 * pastebėti, todėl uždavinio tekste taisyklė irgi neįvardijama.
 */
export function figuruSeka(figuros: readonly Figura[], klaustuku: number): string {
  const dydis = 26
  const tarpas = 10
  const krastas = 8
  const viso = figuros.length + klaustuku
  const plotis = krastas * 2 + viso * (dydis + tarpas) - tarpas
  const aukstis = dydis + 16

  let t = ''
  figuros.forEach((f, i) => {
    t += figura(f, krastas + i * (dydis + tarpas), 8, dydis, false)
  })
  for (let i = 0; i < klaustuku; i += 1) {
    const x = krastas + (figuros.length + i) * (dydis + tarpas)
    t += `<rect x="${x + 1}" y="9" width="${dydis - 2}" height="${dydis - 2}" rx="4" fill="none" stroke="${LINE}" stroke-width="1.2" stroke-dasharray="4 3"/>`
    t += txt(x + dydis / 2, 8 + dydis / 2 + 5, '?', 14, MUTED, 700)
  }
  return svgRemas(plotis, aukstis, t)
}

/**
 * Auganti figūrų seka: kiekvienas narys — savo langelių stulpelis su numeriu.
 *
 * Rodomi tik pirmieji nariai, o klausiama apie tolimesnį, kurio piešinyje nėra:
 * taisyklę reikia įžvelgti, o ne suskaičiuoti.
 */
export function augantiSeka(nariai: readonly number[]): string {
  const langelis = 18
  const tarpas = 22
  const krastas = 10
  const pagrindas = 10 + Math.max(...nariai) * langelis
  const plotis = krastas * 2 + nariai.length * (langelis + tarpas) - tarpas
  const aukstis = pagrindas + 24

  let t = ''
  nariai.forEach((kiek, i) => {
    const x = krastas + i * (langelis + tarpas)
    for (let j = 0; j < kiek; j += 1) {
      t += `<rect x="${x}" y="${pagrindas - (j + 1) * langelis}" width="${langelis}" height="${langelis}" fill="${ORANGE}" fill-opacity="0.45" stroke="${INK}" stroke-width="1.3"/>`
    }
    t += txt(x + langelis / 2, pagrindas + 18, `${i + 1}`, 11, MUTED, 700)
  })
  return svgRemas(plotis, aukstis, t)
}

// ── Objektų grupės ──────────────────────────────────────────────────────────

/**
 * Vienodos objektų grupės — daugybai ir dalybai.
 *
 * Grupės atskiriamos rėmeliais, o ne vien tarpu: taip aišku, kad grupių yra
 * būtent tiek, kiek jų nubrėžta, ir kad kiekvienoje po tiek pat.
 */
export function grupes(grupiu: number, kiekvienoje: number): string {
  const r = 7
  const tarpas = 6
  const grupesPlotis = kiekvienoje * (2 * r + tarpas) + 10
  const krastas = 8
  const grupiuTarpas = 10
  const eileje = Math.min(grupiu, 4)
  const eiluciu = Math.ceil(grupiu / eileje)
  const grupesAukstis = 2 * r + 16
  const plotis = krastas * 2 + eileje * (grupesPlotis + grupiuTarpas)
  const aukstis = krastas * 2 + eiluciu * (grupesAukstis + grupiuTarpas)

  let t = ''
  for (let g = 0; g < grupiu; g += 1) {
    const gx = krastas + (g % eileje) * (grupesPlotis + grupiuTarpas)
    const gy = krastas + Math.floor(g / eileje) * (grupesAukstis + grupiuTarpas)
    t += `<rect x="${gx}" y="${gy}" width="${grupesPlotis}" height="${grupesAukstis}" rx="6" fill="none" stroke="${LINE}" stroke-width="1.2"/>`
    for (let i = 0; i < kiekvienoje; i += 1) {
      t += `<circle cx="${gx + 5 + r + i * (2 * r + tarpas)}" cy="${gy + grupesAukstis / 2}" r="${r}" fill="${ORANGE}" fill-opacity="0.5" stroke="${INK}" stroke-width="1.2"/>`
    }
  }
  return svgRemas(plotis, aukstis, t)
}
