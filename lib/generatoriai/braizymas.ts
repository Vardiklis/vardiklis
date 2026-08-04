import { atsitiktinis, atsitiktinisBe, pasirink } from '../matematika'
import { suBandymais, uzdavinys } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Braižymas, transformacijos, figūros, vektoriai, algoritmai ir diagramos.
 *
 * Brėžiniai piešiami savu SVG — jokios geometrijos bibliotekos. Taip nereikia
 * nei papildomų 200 kB, nei trečiųjų šalių skriptų, o spalvos ateina iš tų
 * pačių kintamųjų, tad spausdinant viskas savaime virsta juoda ant balto.
 *
 * Klausimai visada turi vieną skaitinį atsakymą — brėžinys yra sąlyga, o ne
 * atsakymo forma. Vaikas nieko nebraižo ekrane; jis skaito brėžinį.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

/** SVG rėmelis su vienodais nustatymais visiems brėžiniams. */
function svg(plotis: number, aukstis: number, turinys: string): string {
  return `<svg viewBox="0 0 ${plotis} ${aukstis}" width="${plotis}" height="${aukstis}" role="img" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto">${turinys}</svg>`
}

/** Koordinačių tinklelis su ašimis. Grąžina ir funkciją taškams į pikselius. */
function tinklelis(nuo: number, iki: number, zingsnis = 26) {
  const n = iki - nuo
  const kraštas = 22
  const dydis = n * zingsnis + kraštas * 2
  const x = (v: number) => kraštas + (v - nuo) * zingsnis
  const y = (v: number) => kraštas + (iki - v) * zingsnis

  let piesinys = ''
  for (let i = nuo; i <= iki; i += 1) {
    piesinys += `<line x1="${x(i)}" y1="${kraštas}" x2="${x(i)}" y2="${dydis - kraštas}" stroke="${LINE}" stroke-width="1"/>`
    piesinys += `<line x1="${kraštas}" y1="${y(i)}" x2="${dydis - kraštas}" y2="${y(i)}" stroke="${LINE}" stroke-width="1"/>`
  }
  // Ašys
  piesinys += `<line x1="${kraštas}" y1="${y(0)}" x2="${dydis - kraštas}" y2="${y(0)}" stroke="${INK}" stroke-width="1.5"/>`
  piesinys += `<line x1="${x(0)}" y1="${kraštas}" x2="${x(0)}" y2="${dydis - kraštas}" stroke="${INK}" stroke-width="1.5"/>`
  // Padalos
  for (let i = nuo; i <= iki; i += 1) {
    if (i === 0) continue
    piesinys += `<text x="${x(i)}" y="${y(0) + 14}" font-size="10" fill="${MUTED}" text-anchor="middle">${i}</text>`
    piesinys += `<text x="${x(0) - 7}" y="${y(i) + 3}" font-size="10" fill="${MUTED}" text-anchor="end">${i}</text>`
  }

  return { piesinys, x, y, dydis }
}

function taskas(cx: number, cy: number, spalva: string, etikete?: string): string {
  const zyme = etikete
    ? `<text x="${cx + 8}" y="${cy - 8}" font-size="12" font-weight="600" fill="${spalva}">${etikete}</text>`
    : ''
  return `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${spalva}"/>${zyme}`
}

// ── Koordinatės plokštumoje ─────────────────────────────────────────────────

const A_KOORDINATES = [
  {
    klausimas: 'Kokia taško A abscisė (x koordinatė)?',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Nuo taško leidžiamės žemyn iki x ašies ir nuskaitome 3.',
  },
] as const

export const koordinates: Generatorius = (lygis) =>
  suBandymais(() => kurkKoordinates(lygis), A_KOORDINATES, 'koordinates')

function kurkKoordinates(lygis: Lygis): Uzdavinys | null {
  const ribos = lygis === 1 ? { nuo: 0, iki: 6 } : { nuo: -5, iki: 5 }
  const t = tinklelis(ribos.nuo, ribos.iki)

  const ax = atsitiktinisBe(ribos.nuo + 1, ribos.iki, [0])
  const ay = atsitiktinisBe(ribos.nuo + 1, ribos.iki, [0])

  const brezinys = svg(t.dydis, t.dydis, t.piesinys + taskas(t.x(ax), t.y(ay), ORANGE, 'A'))

  if (lygis === 3) {
    // Atstumas iki ašies — reikia suprasti, ką reiškia koordinatė.
    return uzdavinys('koordinates', {
      klausimas: 'Per kiek langelių taškas A nutolęs nuo $y$ ašies?',
      atsakymas: String(Math.abs(ax)),
      atsakymasRodymui: `$${Math.abs(ax)}$`,
      sprendimas: `Taško A abscisė yra ${ax}, tad atstumas iki $y$ ašies — ${Math.abs(ax)} langeliai.`,
      brezinys,
    })
  }

  const klausiamX = lygis === 1 ? true : Math.random() < 0.5
  return uzdavinys('koordinates', {
    klausimas: klausiamX
      ? 'Kokia taško A abscisė (pirmoji koordinatė)?'
      : 'Kokia taško A ordinatė (antroji koordinatė)?',
    atsakymas: String(klausiamX ? ax : ay),
    atsakymasRodymui: `$${klausiamX ? ax : ay}$`,
    sprendimas: klausiamX
      ? `Nuo taško leidžiamės iki $x$ ašies ir nuskaitome ${ax}.`
      : `Nuo taško einame iki $y$ ašies ir nuskaitome ${ay}.`,
    brezinys,
  })
}

// ── Simetrija ir transformacijos ────────────────────────────────────────────

const A_SIMETRIJA = [
  {
    klausimas: 'Taškas A atspindimas $y$ ašies atžvilgiu. Kokia bus atspindėto taško abscisė?',
    atsakymas: '-3',
    atsakymasRodymui: '$-3$',
    sprendimas: 'Atspindint $y$ ašies atžvilgiu abscisė keičia ženklą: $3 \\to -3$.',
  },
] as const

export const simetrija: Generatorius = (lygis) =>
  suBandymais(() => kurkSimetrija(lygis), A_SIMETRIJA, 'simetrija')

function kurkSimetrija(lygis: Lygis): Uzdavinys | null {
  const t = tinklelis(-5, 5)
  const ax = atsitiktinisBe(-5, 5, [0])
  const ay = atsitiktinisBe(-5, 5, [0])

  const asisY = lygis === 1 ? true : Math.random() < 0.5
  const piesinys =
    t.piesinys +
    // Simetrijos ašis paryškinama oranžine.
    (asisY
      ? `<line x1="${t.x(0)}" y1="14" x2="${t.x(0)}" y2="${t.dydis - 14}" stroke="${ORANGE}" stroke-width="2.5"/>`
      : `<line x1="14" y1="${t.y(0)}" x2="${t.dydis - 14}" y2="${t.y(0)}" stroke="${ORANGE}" stroke-width="2.5"/>`) +
    taskas(t.x(ax), t.y(ay), INK, 'A')

  const brezinys = svg(t.dydis, t.dydis, piesinys)

  if (lygis === 3) {
    // Postūmis — kita transformacija, bet tas pats skaitymas iš brėžinio.
    const poslinkis = atsitiktinisBe(-4, 4, [0])
    const nauja = ax + poslinkis
    if (Math.abs(nauja) > 9) return null
    return uzdavinys('simetrija', {
      klausimas: `Taškas A pastumiamas ${
        poslinkis > 0 ? 'į dešinę' : 'į kairę'
      } per ${Math.abs(poslinkis)} langelius. Kokia bus jo abscisė?`,
      atsakymas: String(nauja),
      atsakymasRodymui: `$${nauja}$`,
      sprendimas: `Prie abscisės pridedame poslinkį: $${ax} ${
        poslinkis > 0 ? '+' : '-'
      } ${Math.abs(poslinkis)} = ${nauja}$.`,
      brezinys,
    })
  }

  const atsakymas = asisY ? -ax : -ay
  return uzdavinys('simetrija', {
    klausimas: asisY
      ? 'Taškas A atspindimas oranžinės ašies atžvilgiu. Kokia bus atspindėto taško abscisė?'
      : 'Taškas A atspindimas oranžinės ašies atžvilgiu. Kokia bus atspindėto taško ordinatė?',
    atsakymas: String(atsakymas),
    atsakymasRodymui: `$${atsakymas}$`,
    sprendimas: `Atspindint ašies atžvilgiu ta koordinatė keičia ženklą: $${
      asisY ? ax : ay
    } \\to ${atsakymas}$, o kita lieka ta pati.`,
    brezinys,
  })
}

// ── Plokščiosios figūros ────────────────────────────────────────────────────

const FIGUROS = [
  { pavadinimas: 'trikampis', krastines: 3 },
  { pavadinimas: 'keturkampis', krastines: 4 },
  { pavadinimas: 'penkiakampis', krastines: 5 },
  { pavadinimas: 'šešiakampis', krastines: 6 },
  { pavadinimas: 'aštuoniakampis', krastines: 8 },
] as const

const A_FIGUROS = [
  {
    klausimas: 'Kiek viršūnių turi ši figūra?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Viršūnių tiek pat, kiek kraštinių — 5.',
  },
] as const

export const figuros: Generatorius = (lygis) =>
  suBandymais(() => kurkFigura(lygis), A_FIGUROS, 'figuros')

/** Taisyklingas daugiakampis apskritime — paprasčiausias būdas nupiešti figūrą. */
function daugiakampis(n: number, spindulys: number, centras: number): string {
  const taskai: string[] = []
  for (let i = 0; i < n; i += 1) {
    const kampas = (Math.PI * 2 * i) / n - Math.PI / 2
    taskai.push(
      `${(centras + spindulys * Math.cos(kampas)).toFixed(1)},${(
        centras +
        spindulys * Math.sin(kampas)
      ).toFixed(1)}`,
    )
  }
  const virsunes = taskai
    .map((p) => {
      const [cx, cy] = p.split(',')
      return `<circle cx="${cx}" cy="${cy}" r="3.5" fill="${ORANGE}"/>`
    })
    .join('')
  return `<polygon points="${taskai.join(' ')}" fill="none" stroke="${INK}" stroke-width="2"/>${virsunes}`
}

function kurkFigura(lygis: Lygis): Uzdavinys | null {
  const f = pasirink(FIGUROS)
  const brezinys = svg(180, 180, daugiakampis(f.krastines, 68, 90))

  if (lygis === 1) {
    const klausiaKrastiniu = Math.random() < 0.5
    return uzdavinys('figuros', {
      klausimas: klausiaKrastiniu ? 'Kiek kraštinių turi ši figūra?' : 'Kiek viršūnių turi ši figūra?',
      atsakymas: String(f.krastines),
      atsakymasRodymui: `$${f.krastines}$`,
      sprendimas: `Tai ${f.pavadinimas}: kraštinių ir viršūnių tiek pat — ${f.krastines}.`,
      brezinys,
    })
  }

  if (lygis === 2) {
    return uzdavinys('figuros', {
      klausimas: 'Kiek kampų turi ši figūra?',
      atsakymas: String(f.krastines),
      atsakymasRodymui: `$${f.krastines}$`,
      sprendimas: `Tai ${f.pavadinimas} — kampų tiek pat, kiek kraštinių: ${f.krastines}.`,
      brezinys,
    })
  }

  // 3 lygis — įstrižainės iš vienos viršūnės.
  const istrizaines = f.krastines - 3
  if (istrizaines < 1) return null
  return uzdavinys('figuros', {
    klausimas: 'Kiek įstrižainių galima nubrėžti iš vienos šios figūros viršūnės?',
    atsakymas: String(istrizaines),
    atsakymasRodymui: `$${istrizaines}$`,
    sprendimas: `Iš viršūnės įstrižainės eina į visas viršūnes, išskyrus ją pačią ir dvi gretimas: $${f.krastines} - 3 = ${istrizaines}$.`,
    brezinys,
  })
}

// ── Laužės ──────────────────────────────────────────────────────────────────

const A_LAUZE = [
  {
    klausimas: 'Kokio ilgio yra ši laužė? Atsakyk langeliais.',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: 'Sudedame visų atkarpų ilgius.',
  },
] as const

export const lauzes: Generatorius = (lygis) =>
  suBandymais(() => kurkLauze(lygis), A_LAUZE, 'lauzes')

function kurkLauze(lygis: Lygis): Uzdavinys | null {
  const kiek = lygis === 1 ? 3 : lygis === 2 ? 4 : 5
  const t = tinklelis(0, 8, 24)

  let x = atsitiktinis(0, 3)
  let y = atsitiktinis(0, 3)
  const taskai: [number, number][] = [[x, y]]
  let ilgis = 0

  for (let i = 0; i < kiek; i += 1) {
    const horizontaliai = i % 2 === 0
    const zingsnis = atsitiktinis(1, 4) * (Math.random() < 0.5 ? 1 : -1)
    const nx = horizontaliai ? x + zingsnis : x
    const ny = horizontaliai ? y : y + zingsnis
    if (nx < 0 || nx > 8 || ny < 0 || ny > 8) return null
    ilgis += Math.abs(zingsnis)
    x = nx
    y = ny
    taskai.push([x, y])
  }

  const kelias = taskai.map(([px, py]) => `${t.x(px)},${t.y(py)}`).join(' ')
  const virsunes = taskai
    .map(([px, py]) => `<circle cx="${t.x(px)}" cy="${t.y(py)}" r="3.5" fill="${ORANGE}"/>`)
    .join('')
  const brezinys = svg(
    t.dydis,
    t.dydis,
    `${t.piesinys}<polyline points="${kelias}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>${virsunes}`,
  )

  return uzdavinys('lauzes', {
    klausimas:
      lygis === 3
        ? 'Kiek atkarpų turi ši laužė?'
        : 'Kokio ilgio yra ši laužė? Atsakyk langeliais.',
    atsakymas: String(lygis === 3 ? kiek : ilgis),
    atsakymasRodymui: `$${lygis === 3 ? kiek : ilgis}$`,
    sprendimas:
      lygis === 3
        ? `Laužę sudaro ${kiek} atkarpos.`
        : `Sudedame visų ${kiek} atkarpų ilgius — iš viso ${ilgis} langeliai.`,
    brezinys,
  })
}

// ── Erdvinės figūros ────────────────────────────────────────────────────────

const KUNAI = [
  { pavadinimas: 'kubas', sienos: 6, briaunos: 12, virsunes: 8 },
  { pavadinimas: 'stačiakampis gretasienis', sienos: 6, briaunos: 12, virsunes: 8 },
  { pavadinimas: 'trikampė prizmė', sienos: 5, briaunos: 9, virsunes: 6 },
  { pavadinimas: 'keturkampė piramidė', sienos: 5, briaunos: 8, virsunes: 5 },
  { pavadinimas: 'trikampė piramidė', sienos: 4, briaunos: 6, virsunes: 4 },
  { pavadinimas: 'šešiakampė prizmė', sienos: 8, briaunos: 18, virsunes: 12 },
] as const

const A_ERDVINES = [
  {
    klausimas: 'Kiek sienų turi kubas?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Kubą sudaro 6 vienodi kvadratai.',
  },
] as const

export const erdvinesFiguros: Generatorius = (lygis) =>
  suBandymais(() => kurkErdvine(lygis), A_ERDVINES, 'erdvines-figuros')

/** Kubo brėžinys perspektyvoje — paaiškina klausimą be papildomų žodžių. */
function kuboBrezinys(): string {
  const p = 30
  const g = 34
  const priekis = `<rect x="${p}" y="${p + g}" width="90" height="90" fill="none" stroke="${INK}" stroke-width="2"/>`
  const galas = `<rect x="${p + g}" y="${p}" width="90" height="90" fill="none" stroke="${LINE}" stroke-width="2"/>`
  const jungtys = [
    [p, p + g, p + g, p],
    [p + 90, p + g, p + g + 90, p],
    [p, p + g + 90, p + g, p + 90],
    [p + 90, p + g + 90, p + g + 90, p + 90],
  ]
    .map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${LINE}" stroke-width="2"/>`)
    .join('')
  return svg(190, 190, `${galas}${jungtys}${priekis}`)
}

function kurkErdvine(lygis: Lygis): Uzdavinys | null {
  const k = pasirink(KUNAI)
  const dalis =
    lygis === 1 ? 'sienų' : lygis === 2 ? pasirink(['briaunų', 'viršūnių'] as const) : 'briaunų'

  const atsakymas =
    dalis === 'sienų' ? k.sienos : dalis === 'briaunų' ? k.briaunos : k.virsunes

  if (lygis === 3) {
    // Oilerio formulė — patikrina ryšį, o ne įsiminimą.
    return uzdavinys('erdvines-figuros', {
      klausimas: `Daugiasienis turi ${k.sienos} sienas ir ${k.virsunes} viršūnes. Kiek jis turi briaunų? (Naudok $S + V - B = 2$.)`,
      atsakymas: String(k.briaunos),
      atsakymasRodymui: `$${k.briaunos}$`,
      sprendimas: `$B = S + V - 2 = ${k.sienos} + ${k.virsunes} - 2 = ${k.briaunos}$.`,
    })
  }

  return uzdavinys('erdvines-figuros', {
    klausimas: `Kiek ${dalis} turi ${k.pavadinimas}?`,
    atsakymas: String(atsakymas),
    atsakymasRodymui: `$${atsakymas}$`,
    sprendimas: `${k.pavadinimas[0].toUpperCase()}${k.pavadinimas.slice(1)} turi ${
      k.sienos
    } sienas, ${k.briaunos} briaunas ir ${k.virsunes} viršūnes.`,
    brezinys: k.pavadinimas === 'kubas' ? kuboBrezinys() : undefined,
  })
}

// ── Vektoriai ───────────────────────────────────────────────────────────────

const A_VEKTORIAI = [
  {
    klausimas: 'Vektorius $\\vec{a}$ turi koordinates $(3; 4)$. Koks jo ilgis?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: '$|\\vec{a}| = \\sqrt{3^2 + 4^2} = 5$.',
  },
] as const

export const vektoriai: Generatorius = (lygis) =>
  suBandymais(() => kurkVektoriu(lygis), A_VEKTORIAI, 'vektoriai')

function kurkVektoriu(lygis: Lygis): Uzdavinys | null {
  const trejetai = [
    [3, 4, 5],
    [6, 8, 10],
    [5, 12, 13],
    [8, 15, 17],
    [9, 12, 15],
  ] as const

  if (lygis === 1) {
    const t = tinklelis(0, 6)
    const x = atsitiktinis(1, 5)
    const y = atsitiktinis(1, 5)
    const brezinys = svg(
      t.dydis,
      t.dydis,
      `${t.piesinys}<line x1="${t.x(0)}" y1="${t.y(0)}" x2="${t.x(x)}" y2="${t.y(
        y,
      )}" stroke="${ORANGE}" stroke-width="2.5"/>${taskas(t.x(x), t.y(y), ORANGE)}`,
    )
    const klausiamX = Math.random() < 0.5
    return uzdavinys('vektoriai', {
      klausimas: `Vektorius nubrėžtas iš pradžios taško. Kokia jo ${
        klausiamX ? 'pirmoji' : 'antroji'
      } koordinatė?`,
      atsakymas: String(klausiamX ? x : y),
      atsakymasRodymui: `$${klausiamX ? x : y}$`,
      sprendimas: `Vektoriaus koordinatės yra $(${x}; ${y})$.`,
      brezinys,
    })
  }

  if (lygis === 2) {
    const [a, b, c] = pasirink(trejetai)
    return uzdavinys('vektoriai', {
      klausimas: `Vektorius $\\vec{a}$ turi koordinates $(${a}; ${b})$. Koks jo ilgis?`,
      atsakymas: String(c),
      atsakymasRodymui: `$${c}$`,
      sprendimas: `$|\\vec{a}| = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = ${c}$.`,
    })
  }

  // 3 lygis — vektorių sudėtis.
  const a1 = atsitiktinisBe(-6, 6, [0])
  const a2 = atsitiktinisBe(-6, 6, [0])
  const b1 = atsitiktinisBe(-6, 6, [0])
  const b2 = atsitiktinisBe(-6, 6, [0])
  const klausiamX = Math.random() < 0.5
  const suma = klausiamX ? a1 + b1 : a2 + b2
  if (suma === 0) return null

  return uzdavinys('vektoriai', {
    klausimas: `Duoti vektoriai $\\vec{a} = (${a1}; ${a2})$ ir $\\vec{b} = (${b1}; ${b2})$. Kokia sumos $\\vec{a} + \\vec{b}$ ${
      klausiamX ? 'pirmoji' : 'antroji'
    } koordinatė?`,
    atsakymas: String(suma),
    atsakymasRodymui: `$${suma}$`,
    sprendimas: `Sudedant vektorius, sudedamos atitinkamos koordinatės: $${
      klausiamX ? a1 : a2
    } + (${klausiamX ? b1 : b2}) = ${suma}$.`,
  })
}

// ── Algoritmai ir programavimas ─────────────────────────────────────────────

const A_ALGORITMAI = [
  {
    klausimas: 'Vėžliukas vykdo komandas: pirmyn 3, pirmyn 2. Per kiek langelių jis nukeliavo?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: '$3 + 2 = 5$ langeliai.',
  },
] as const

export const algoritmai: Generatorius = (lygis) =>
  suBandymais(() => kurkAlgoritma(lygis), A_ALGORITMAI, 'algoritmai')

function kurkAlgoritma(lygis: Lygis): Uzdavinys | null {
  if (lygis === 1) {
    const a = atsitiktinis(1, 6)
    const b = atsitiktinis(1, 6)
    const c = atsitiktinis(1, 6)
    return uzdavinys('algoritmai', {
      klausimas: `Vėžliukas vykdo komandas: pirmyn ${a}, pirmyn ${b}, pirmyn ${c}. Per kiek langelių jis nukeliavo iš viso?`,
      atsakymas: String(a + b + c),
      atsakymasRodymui: `$${a + b + c}$`,
      sprendimas: `$${a} + ${b} + ${c} = ${a + b + c}$ langeliai.`,
    })
  }

  if (lygis === 2) {
    // Kartojimo komanda.
    const kartai = atsitiktinis(3, 8)
    const zingsnis = atsitiktinis(2, 6)
    return uzdavinys('algoritmai', {
      klausimas: `Vėžliukas vykdo komandą: kartok ${kartai} kartus { pirmyn ${zingsnis} }. Per kiek langelių jis nukeliavo?`,
      atsakymas: String(kartai * zingsnis),
      atsakymasRodymui: `$${kartai * zingsnis}$`,
      sprendimas: `$${kartai} \\cdot ${zingsnis} = ${kartai * zingsnis}$ langeliai.`,
    })
  }

  // 3 lygis — kartojimas su posūkiu: uždara figūra.
  const krastines = pasirink([3, 4, 5, 6] as const)
  const zingsnis = atsitiktinis(2, 9)
  return uzdavinys('algoritmai', {
    klausimas: `Vėžliukas vykdo: kartok ${krastines} kartus { pirmyn ${zingsnis}, pasuk } ir grįžta į pradžią. Koks nubrėžtos figūros perimetras langeliais?`,
    atsakymas: String(krastines * zingsnis),
    atsakymasRodymui: `$${krastines * zingsnis}$`,
    sprendimas: `Nubrėžtos ${krastines} vienodos kraštinės po ${zingsnis}: $${krastines} \\cdot ${zingsnis} = ${
      krastines * zingsnis
    }$.`,
  })
}

// ── Diagramos ir duomenys ───────────────────────────────────────────────────

const KATEGORIJOS = ['Pr', 'An', 'Tr', 'Kt', 'Pn'] as const

const A_DIAGRAMOS = [
  {
    klausimas: 'Kiek iš viso knygų perskaityta per visas dienas?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: 'Sudedame visų stulpelių aukščius.',
  },
] as const

export const diagramos: Generatorius = (lygis) =>
  suBandymais(() => kurkDiagrama(lygis), A_DIAGRAMOS, 'diagramos')

function kurkDiagrama(lygis: Lygis): Uzdavinys | null {
  const kiek = lygis === 1 ? 4 : 5
  const reiksmes = Array.from({ length: kiek }, () => atsitiktinis(1, 9))
  if (new Set(reiksmes).size < 3) return null

  const maks = Math.max(...reiksmes)
  const plotis = 46
  const aukstis = 150
  // Aukščiausias stulpelis paliekamas žemesnis už rėmelį, kad virš jo tilptų
  // reikšmės užrašas — kitaip skaičius nukerpamas.
  const grafikas = aukstis - 18
  const dydisX = kiek * plotis + 40
  const dydisY = aukstis + 46

  let stulpeliai = ''
  reiksmes.forEach((v, i) => {
    const h = (v / maks) * grafikas
    const x = 32 + i * plotis
    stulpeliai += `<rect x="${x}" y="${aukstis + 10 - h}" width="${plotis - 16}" height="${h}" fill="${
      v === maks ? ORANGE : LINE
    }" stroke="${INK}" stroke-width="1"/>`
    stulpeliai += `<text x="${x + (plotis - 16) / 2}" y="${aukstis + 28}" font-size="11" fill="${MUTED}" text-anchor="middle">${
      KATEGORIJOS[i]
    }</text>`
    stulpeliai += `<text x="${x + (plotis - 16) / 2}" y="${aukstis + 4 - h}" font-size="11" font-weight="600" fill="${INK}" text-anchor="middle">${v}</text>`
  })
  // Pagrindo ašis
  stulpeliai += `<line x1="20" y1="${aukstis + 10}" x2="${dydisX - 10}" y2="${aukstis + 10}" stroke="${INK}" stroke-width="1.5"/>`

  const brezinys = svg(dydisX, dydisY, stulpeliai)
  const suma = reiksmes.reduce((a, b) => a + b, 0)
  const maksIndeksas = reiksmes.indexOf(maks)
  const minReiksme = Math.min(...reiksmes)

  if (lygis === 1) {
    return uzdavinys('diagramos', {
      klausimas: 'Kiek knygų perskaityta daugiausiai per vieną dieną?',
      atsakymas: String(maks),
      atsakymasRodymui: `$${maks}$`,
      sprendimas: `Aukščiausias stulpelis yra ${KATEGORIJOS[maksIndeksas]} — ${maks} knygos.`,
      brezinys,
    })
  }

  if (lygis === 2) {
    return uzdavinys('diagramos', {
      klausimas: 'Kiek iš viso knygų perskaityta per visas dienas?',
      atsakymas: String(suma),
      atsakymasRodymui: `$${suma}$`,
      sprendimas: `$${reiksmes.join(' + ')} = ${suma}$ knygos.`,
      brezinys,
    })
  }

  return uzdavinys('diagramos', {
    klausimas: 'Kiek knygų perskaityta daugiau geriausią dieną nei prasčiausią?',
    atsakymas: String(maks - minReiksme),
    atsakymasRodymui: `$${maks - minReiksme}$`,
    sprendimas: `Daugiausia ${maks}, mažiausia ${minReiksme}: $${maks} - ${minReiksme} = ${
      maks - minReiksme
    }$.`,
    brezinys,
  })
}

// ── Konstravimas (braižymas) ────────────────────────────────────────────────

const A_KONSTRAVIMAS = [
  {
    klausimas: 'Nubrėžta 80° kampo pusiaukampinė. Koks kampas tarp jos ir kampo kraštinės?',
    atsakymas: '40',
    atsakymasRodymui: '$40°$',
    sprendimas: 'Pusiaukampinė dalija kampą pusiau: $80 : 2 = 40$°.',
  },
] as const

export const konstravimas: Generatorius = (lygis) =>
  suBandymais(() => kurkKonstravima(lygis), A_KONSTRAVIMAS, 'konstravimas')

/** Kampas su viena paryškinta spinduliu — pakanka sąlygai suprasti. */
function kampoBrezinys(laipsniai: number, suPusiaukampine: boolean): string {
  const cx = 30
  const cy = 150
  const r = 130
  const rad = (laipsniai * Math.PI) / 180
  const x2 = cx + r * Math.cos(-rad)
  const y2 = cy + r * Math.sin(-rad)
  const pusiau = (laipsniai / 2) * (Math.PI / 180)
  const px = cx + r * 0.8 * Math.cos(-pusiau)
  const py = cy + r * 0.8 * Math.sin(-pusiau)

  return svg(
    200,
    180,
    `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${INK}" stroke-width="2"/>` +
      `<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${INK}" stroke-width="2"/>` +
      (suPusiaukampine
        ? `<line x1="${cx}" y1="${cy}" x2="${px.toFixed(1)}" y2="${py.toFixed(
            1,
          )}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="5 4"/>`
        : '') +
      `<path d="M ${cx + 34} ${cy} A 34 34 0 0 0 ${(cx + 34 * Math.cos(-rad)).toFixed(1)} ${(
        cy +
        34 * Math.sin(-rad)
      ).toFixed(1)}" fill="none" stroke="${MUTED}" stroke-width="1.5"/>` +
      `<text x="${cx + 46}" y="${cy - 14}" font-size="12" fill="${MUTED}">${laipsniai}°</text>`,
  )
}

function kurkKonstravima(lygis: Lygis): Uzdavinys | null {
  if (lygis === 1) {
    const kampas = atsitiktinis(3, 17) * 10
    if (kampas % 20 !== 0) return null // pusė turi būti sveikas skaičius
    return uzdavinys('konstravimas', {
      klausimas: `Nubrėžta ${kampas}° kampo pusiaukampinė (punktyrinė linija). Koks kampas tarp jos ir kampo kraštinės?`,
      atsakymas: String(kampas / 2),
      atsakymasRodymui: `$${kampas / 2}°$`,
      sprendimas: `Pusiaukampinė dalija kampą pusiau: $${kampas} : 2 = ${kampas / 2}$°.`,
      brezinys: kampoBrezinys(kampas, true),
    })
  }

  if (lygis === 2) {
    // Statmuo ir gretimas kampas.
    const kampas = atsitiktinis(2, 16) * 5
    return uzdavinys('konstravimas', {
      klausimas: `Prie tiesės nubrėžtas statmuo. Vienas kampas tarp spindulio ir tiesės yra ${kampas}°. Koks kampas lieka iki statmens?`,
      atsakymas: String(90 - kampas),
      atsakymasRodymui: `$${90 - kampas}°$`,
      sprendimas: `Statmuo sudaro 90°, tad $90 - ${kampas} = ${90 - kampas}$°.`,
      brezinys: kampoBrezinys(kampas, false),
    })
  }

  // 3 lygis — atkarpos vidurio statmuo ir dalybos į lygias dalis.
  const ilgis = atsitiktinis(2, 20) * 2
  const dalys = pasirink([2, 4] as const)
  return uzdavinys('konstravimas', {
    klausimas: `Atkarpa, kurios ilgis ${ilgis} cm, padalyta į ${dalys} lygias dalis. Kokio ilgio viena dalis?`,
    atsakymas: String(ilgis / dalys),
    atsakymasRodymui: `$${ilgis / dalys}$ cm`,
    sprendimas: `$${ilgis} : ${dalys} = ${ilgis / dalys}$ cm.`,
  })
}

// ── Ornamentai ir sekos plokštumoje ─────────────────────────────────────────

const A_ORNAMENTAI = [
  {
    klausimas: 'Kiek langelių bus nuspalvinta penktoje figūroje?',
    atsakymas: '9',
    atsakymasRodymui: '$9$',
    sprendimas: 'Kiekvienoje figūroje langelių skaičius didėja pagal tą patį dėsnį.',
  },
] as const

export const ornamentai: Generatorius = (lygis) =>
  suBandymais(() => kurkOrnamenta(lygis), A_ORNAMENTAI, 'ornamentai')

function kurkOrnamenta(lygis: Lygis): Uzdavinys | null {
  const zingsnis = lygis === 1 ? atsitiktinis(1, 3) : atsitiktinis(2, 5)
  const pradzia = atsitiktinis(1, 4)
  const kiekFiguru = 3
  const kelinta = kiekFiguru + (lygis === 3 ? 3 : 1)
  const atsakymas = pradzia + (kelinta - 1) * zingsnis
  if (atsakymas > 60) return null

  // Kiekviena figūra — eilutė kvadratėlių; taip dėsnis matomas iš karto.
  const lang = 14
  const tarpas = 26
  let x = 12
  let piesinys = ''
  for (let f = 0; f < kiekFiguru; f += 1) {
    const kiek = pradzia + f * zingsnis
    for (let i = 0; i < kiek; i += 1) {
      piesinys += `<rect x="${x + (i % 5) * lang}" y="${20 + Math.floor(i / 5) * lang}" width="${
        lang - 2
      }" height="${lang - 2}" fill="${ORANGE}" stroke="${INK}" stroke-width="1"/>`
    }
    piesinys += `<text x="${x}" y="${14}" font-size="11" fill="${MUTED}">${f + 1}.</text>`
    x += 5 * lang + tarpas
  }

  return uzdavinys('ornamentai', {
    klausimas: `Ornamentas tęsiamas pagal tą patį dėsnį. Kiek langelių bus ${kelinta}-oje figūroje?`,
    atsakymas: String(atsakymas),
    atsakymasRodymui: `$${atsakymas}$`,
    sprendimas: `Kiekvienoje figūroje ${zingsnis} langeliais daugiau: pradedame nuo ${pradzia} ir pridedame ${zingsnis} dar ${
      kelinta - 1
    } kartus — gauname ${atsakymas}.`,
    brezinys: svg(x, 20 + Math.ceil((pradzia + 2 * zingsnis) / 5) * lang + 10, piesinys),
  })
}
