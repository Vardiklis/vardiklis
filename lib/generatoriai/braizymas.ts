import { atsitiktinis, atsitiktinisBe, pasirink } from '../matematika'
import { sk, suBandymais, uzdavinys, variacija } from './bendra'
import { didink, vyresne } from './mastas'
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

export const figuros: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkFigura(lygis, klase), A_FIGUROS, 'figuros')

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

function kurkFigura(lygis: Lygis, klase?: number): Uzdavinys | null {
  const f = pasirink(FIGUROS)
  const n = f.krastines
  const brezinys = svg(180, 180, daugiakampis(n, 68, 90))
  const a = atsitiktinis(2, didink(12, klase))

  const visos = [
    // 1. Kraštinių arba viršūnių skaičius
    () => {
      const klausiaKrastiniu = Math.random() < 0.5
      return uzdavinys('figuros', {
        klausimas: klausiaKrastiniu
          ? 'Kiek kraštinių turi ši figūra?'
          : 'Kiek viršūnių turi ši figūra?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Tai ${f.pavadinimas}: kraštinių ir viršūnių tiek pat — ${n}.`,
        brezinys,
      })
    },

    // 2. Kampų skaičius
    () =>
      uzdavinys('figuros', {
        klausimas: 'Kiek kampų turi ši figūra?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Tai ${f.pavadinimas} — kampų tiek pat, kiek kraštinių: ${n}.`,
        brezinys,
      }),

    // 3. Taisyklingosios figūros perimetras
    () =>
      uzdavinys('figuros', {
        klausimas: `Ši figūra taisyklinga, kiekvienos jos kraštinės ilgis ${a} cm. Koks jos perimetras?`,
        atsakymas: String(n * a),
        atsakymasRodymui: `$${n * a}$ cm`,
        sprendimas: `$P = ${n} \\cdot ${a} = ${n * a}$ cm.`,
      }),

    // 4. Įstrižainės iš vienos viršūnės
    () => {
      const istrizaines = n - 3
      if (istrizaines < 1) return null
      return uzdavinys('figuros', {
        klausimas: 'Kiek įstrižainių galima nubrėžti iš vienos šios figūros viršūnės?',
        atsakymas: String(istrizaines),
        atsakymasRodymui: `$${istrizaines}$`,
        sprendimas: `Iš viršūnės įstrižainės eina į visas viršūnes, išskyrus ją pačią ir dvi gretimas: $${n} - 3 = ${istrizaines}$.`,
        brezinys,
      })
    },

    // 5. Vidaus kampų suma
    () => {
      if (lygis === 1) return null
      const suma = (n - 2) * 180
      return uzdavinys('figuros', {
        klausimas: 'Kokia šios figūros vidaus kampų suma laipsniais?',
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}°$`,
        sprendimas: `$(n - 2) \\cdot 180 = (${n} - 2) \\cdot 180 = ${suma}$°.`,
        brezinys,
      })
    },

    // 6. Kraštinė iš perimetro
    () =>
      uzdavinys('figuros', {
        klausimas: `Šios taisyklingosios figūros perimetras ${n * a} cm. Koks vienos kraštinės ilgis?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ cm`,
        sprendimas: `Kraštinių ${n}, tad $${n * a} : ${n} = ${a}$ cm.`,
        brezinys,
      }),

    // 7. Visos įstrižainės
    () => {
      if (lygis === 1) return null
      const visosIstrizaines = (n * (n - 3)) / 2
      if (visosIstrizaines < 1) return null
      return uzdavinys('figuros', {
        klausimas: 'Kiek iš viso įstrižainių turi ši figūra?',
        atsakymas: String(visosIstrizaines),
        atsakymasRodymui: `$${visosIstrizaines}$`,
        sprendimas: `$\\dfrac{n(n-3)}{2} = \\dfrac{${n} \\cdot ${n - 3}}{2} = ${visosIstrizaines}$.`,
        brezinys,
      })
    },

    // 8. Taisyklingosios figūros vienas kampas
    () => {
      if (!vyresne(klase) && lygis !== 3) return null
      const kampas = ((n - 2) * 180) / n
      if (!Number.isInteger(kampas)) return null
      return uzdavinys('figuros', {
        klausimas: 'Ši figūra taisyklinga. Koks yra vienas jos vidaus kampas laipsniais?',
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: `$\\dfrac{(${n} - 2) \\cdot 180}{${n}} = ${kampas}$°.`,
        brezinys,
      })
    },

    // 9. Simetrijos ašys
    () => {
      if (lygis === 1) return null
      return uzdavinys('figuros', {
        klausimas: 'Kiek simetrijos ašių turi ši taisyklingoji figūra?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Taisyklingasis ${n} kraštinių daugiakampis turi tiek pat simetrijos ašių, kiek kraštinių — ${n}.`,
        brezinys,
      })
    },
  ]

  if (lygis === 1) return variacija(visos.slice(0, 4))
  if (lygis === 2) return variacija(visos.slice(0, 7))
  return variacija(visos)
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

export const erdvinesFiguros: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkErdvine(lygis, klase), A_ERDVINES, 'erdvines-figuros')

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

function kurkErdvine(lygis: Lygis, klase?: number): Uzdavinys | null {
  const k = pasirink(KUNAI)
  const brezinys = k.pavadinimas === 'kubas' ? kuboBrezinys() : undefined
  const a = atsitiktinis(2, didink(9, klase))
  const b = atsitiktinis(2, didink(9, klase))
  const c = atsitiktinis(2, didink(9, klase))

  const visos = [
    // 1. Sienų skaičius
    () =>
      uzdavinys('erdvines-figuros', {
        klausimas: `Kiek sienų turi ${k.pavadinimas}?`,
        atsakymas: String(k.sienos),
        atsakymasRodymui: `$${k.sienos}$`,
        sprendimas: `${k.pavadinimas[0].toUpperCase()}${k.pavadinimas.slice(1)} turi ${
          k.sienos
        } sienas.`,
        brezinys,
      }),

    // 2. Briaunų arba viršūnių skaičius
    () => {
      const dalis = pasirink(['briaunų', 'viršūnių'] as const)
      const atsakymas = dalis === 'briaunų' ? k.briaunos : k.virsunes
      return uzdavinys('erdvines-figuros', {
        klausimas: `Kiek ${dalis} turi ${k.pavadinimas}?`,
        atsakymas: String(atsakymas),
        atsakymasRodymui: `$${atsakymas}$`,
        sprendimas: `${k.pavadinimas[0].toUpperCase()}${k.pavadinimas.slice(1)} turi ${
          k.sienos
        } sienas, ${k.briaunos} briaunas ir ${k.virsunes} viršūnes.`,
        brezinys,
      })
    },

    // 3. Kubo tūris
    () =>
      uzdavinys('erdvines-figuros', {
        klausimas: `Kubo briauna ${a} cm. Koks jo tūris?`,
        atsakymas: String(a ** 3),
        atsakymasRodymui: `$${a ** 3}$ cm³`,
        sprendimas: `$V = ${a}^3 = ${a ** 3}$ cm³.`,
        brezinys: kuboBrezinys(),
      }),

    // 4. Kubo paviršiaus plotas
    () =>
      uzdavinys('erdvines-figuros', {
        klausimas: `Kubo briauna ${a} cm. Koks jo paviršiaus plotas?`,
        atsakymas: String(6 * a * a),
        atsakymasRodymui: `$${6 * a * a}$ cm²`,
        sprendimas: `Kubą sudaro 6 vienodi kvadratai: $6 \\cdot ${a}^2 = ${6 * a * a}$ cm².`,
        brezinys: kuboBrezinys(),
      }),

    // 5. Gretasienio tūris
    () =>
      uzdavinys('erdvines-figuros', {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm. Koks jo tūris?`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$ cm³`,
        sprendimas: `$V = ${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$ cm³.`,
      }),

    // 6. Visų briaunų ilgių suma
    () => {
      if (lygis === 1) return null
      const suma = 4 * (a + b + c)
      return uzdavinys('erdvines-figuros', {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm. Kokia visų jo briaunų ilgių suma?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$ cm`,
        sprendimas: `Kiekvieno matmens briaunų po keturias: $4 \\cdot (${a} + ${b} + ${c}) = ${suma}$ cm.`,
      })
    },

    // 7. Oilerio formulė
    () => {
      if (lygis === 1) return null
      return uzdavinys('erdvines-figuros', {
        klausimas: `Daugiasienis turi ${k.sienos} sienas ir ${k.virsunes} viršūnes. Kiek jis turi briaunų? (Naudok $S + V - B = 2$.)`,
        atsakymas: String(k.briaunos),
        atsakymasRodymui: `$${k.briaunos}$`,
        sprendimas: `$B = S + V - 2 = ${k.sienos} + ${k.virsunes} - 2 = ${k.briaunos}$.`,
      })
    },

    // 8. Gretasienio paviršiaus plotas
    () => {
      if (lygis === 1) return null
      const S = 2 * (a * b + a * c + b * c)
      return uzdavinys('erdvines-figuros', {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm. Koks jo paviršiaus plotas?`,
        atsakymas: String(S),
        atsakymasRodymui: `$${S}$ cm²`,
        sprendimas: `$S = 2(${a} \\cdot ${b} + ${a} \\cdot ${c} + ${b} \\cdot ${c}) = ${S}$ cm².`,
      })
    },

    // 9. Briauna iš tūrio
    () => {
      if (!vyresne(klase) && lygis !== 3) return null
      return uzdavinys('erdvines-figuros', {
        klausimas: `Kubo tūris ${a ** 3} cm³. Kokia jo briauna?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ cm`,
        sprendimas: `$a = \\sqrt[3]{${a ** 3}} = ${a}$ cm.`,
        brezinys: kuboBrezinys(),
      })
    },

    // 10. Prizmės tūris
    () => {
      if (lygis === 1) return null
      const pagrindas = a * b
      return uzdavinys('erdvines-figuros', {
        klausimas: `Prizmės pagrindo plotas ${pagrindas} cm², aukštinė ${c} cm. Koks jos tūris?`,
        atsakymas: String(pagrindas * c),
        atsakymasRodymui: `$${pagrindas * c}$ cm³`,
        sprendimas: `$V = S_{pagr} \\cdot h = ${pagrindas} \\cdot ${c} = ${pagrindas * c}$ cm³.`,
      })
    },
  ]

  if (lygis === 1) return variacija(visos.slice(0, 5))
  if (lygis === 2) return variacija(visos.slice(0, 8))
  return variacija(visos)
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

export const vektoriai: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkVektoriu(lygis, klase), A_VEKTORIAI, 'vektoriai')

function kurkVektoriu(lygis: Lygis, klase?: number): Uzdavinys | null {
  const trejetai = [
    [3, 4, 5],
    [6, 8, 10],
    [5, 12, 13],
    [8, 15, 17],
    [9, 12, 15],
    [12, 16, 20],
    [7, 24, 25],
    [20, 21, 29],
  ] as const
  const riba = didink(6, klase)
  const a1 = atsitiktinisBe(-riba, riba, [0])
  const a2 = atsitiktinisBe(-riba, riba, [0])
  const b1 = atsitiktinisBe(-riba, riba, [0])
  const b2 = atsitiktinisBe(-riba, riba, [0])
  const [t1, t2, t3] = pasirink(trejetai)

  const visos = [
    // 1. Koordinatė iš brėžinio
    () => {
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
    },

    // 2. Vektoriaus ilgis
    () =>
      uzdavinys('vektoriai', {
        klausimas: `Vektorius $\\vec{a}$ turi koordinates $(${t1}; ${t2})$. Koks jo ilgis?`,
        atsakymas: String(t3),
        atsakymasRodymui: `$${t3}$`,
        sprendimas: `$|\\vec{a}| = \\sqrt{${t1}^2 + ${t2}^2} = \\sqrt{${
          t1 * t1 + t2 * t2
        }} = ${t3}$.`,
      }),

    // 3. Vektorių sudėtis
    () => {
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
    },

    // 4. Vektorių atimtis
    () => {
      if (lygis === 1) return null
      const klausiamX = Math.random() < 0.5
      const skirtumas = klausiamX ? a1 - b1 : a2 - b2
      if (skirtumas === 0) return null
      return uzdavinys('vektoriai', {
        klausimas: `Duoti vektoriai $\\vec{a} = (${a1}; ${a2})$ ir $\\vec{b} = (${b1}; ${b2})$. Kokia skirtumo $\\vec{a} - \\vec{b}$ ${
          klausiamX ? 'pirmoji' : 'antroji'
        } koordinatė?`,
        atsakymas: String(skirtumas),
        atsakymasRodymui: `$${skirtumas}$`,
        sprendimas: `Atimant vektorius, atimamos atitinkamos koordinatės: $${
          klausiamX ? a1 : a2
        } - (${klausiamX ? b1 : b2}) = ${skirtumas}$.`,
      })
    },

    // 5. Daugyba iš skaičiaus
    () => {
      if (lygis === 1) return null
      const k = atsitiktinisBe(-5, 5, [0, 1])
      const klausiamX = Math.random() < 0.5
      const rez = k * (klausiamX ? a1 : a2)
      return uzdavinys('vektoriai', {
        klausimas: `Vektorius $\\vec{a} = (${a1}; ${a2})$. Kokia vektoriaus $${k}\\vec{a}$ ${
          klausiamX ? 'pirmoji' : 'antroji'
        } koordinatė?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Dauginant iš skaičiaus, dauginamos abi koordinatės: $${k} \\cdot (${
          klausiamX ? a1 : a2
        }) = ${rez}$.`,
      })
    },

    // 6. Vektorius iš dviejų taškų
    () => {
      if (lygis === 1) return null
      const klausiamX = Math.random() < 0.5
      const rez = klausiamX ? b1 - a1 : b2 - a2
      if (rez === 0) return null
      return uzdavinys('vektoriai', {
        klausimas: `Taškai $A(${a1}; ${a2})$ ir $B(${b1}; ${b2})$. Kokia vektoriaus $\\vec{AB}$ ${
          klausiamX ? 'pirmoji' : 'antroji'
        } koordinatė?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$\\vec{AB} = (x_B - x_A; y_B - y_A)$, tad ieškoma koordinatė $${
          klausiamX ? b1 : b2
        } - (${klausiamX ? a1 : a2}) = ${rez}$.`,
      })
    },

    // 7. Skaliarinė sandauga
    () => {
      if (!vyresne(klase) && lygis !== 3) return null
      const rez = a1 * b1 + a2 * b2
      return uzdavinys('vektoriai', {
        klausimas: `Vektoriai $\\vec{a} = (${a1}; ${a2})$ ir $\\vec{b} = (${b1}; ${b2})$. Kam lygi jų skaliarinė sandauga?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$\\vec{a} \\cdot \\vec{b} = ${sk(a1)} \\cdot ${sk(b1)} + ${sk(
          a2,
        )} \\cdot ${sk(b2)} = ${sk(a1 * b1)} + ${sk(a2 * b2)} = ${rez}$.`,
      })
    },

    // 8. Atkarpos vidurio taškas
    () => {
      if (lygis === 1) return null
      const klausiamX = Math.random() < 0.5
      const suma = klausiamX ? a1 + b1 : a2 + b2
      if (suma % 2 !== 0) return null
      return uzdavinys('vektoriai', {
        klausimas: `Atkarpos galai $A(${a1}; ${a2})$ ir $B(${b1}; ${b2})$. Kokia jos vidurio taško ${
          klausiamX ? 'abscisė' : 'ordinatė'
        }?`,
        atsakymas: String(suma / 2),
        atsakymasRodymui: `$${suma / 2}$`,
        sprendimas: `Vidurio taško koordinatė — galų vidurkis: $\\dfrac{${
          klausiamX ? a1 : a2
        } + (${klausiamX ? b1 : b2})}{2} = ${suma / 2}$.`,
      })
    },
  ]

  if (lygis === 1) return variacija(visos.slice(0, 3))
  if (lygis === 2) return variacija(visos.slice(0, 6))
  return variacija(visos)
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

export const algoritmai: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkAlgoritma(lygis, klase), A_ALGORITMAI, 'algoritmai')

function kurkAlgoritma(lygis: Lygis, klase?: number): Uzdavinys | null {
  const a = atsitiktinis(1, didink(6, klase))
  const b = atsitiktinis(1, didink(6, klase))
  const c = atsitiktinis(1, didink(6, klase))
  const kartai = atsitiktinis(3, didink(8, klase))
  const zingsnis = atsitiktinis(2, didink(6, klase))

  const visos = [
    // 1. Komandos iš eilės
    () =>
      uzdavinys('algoritmai', {
        klausimas: `Vėžliukas vykdo komandas: pirmyn ${a}, pirmyn ${b}, pirmyn ${c}. Per kiek langelių jis nukeliavo iš viso?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$`,
        sprendimas: `$${a} + ${b} + ${c} = ${a + b + c}$ langeliai.`,
      }),

    // 2. Pirmyn ir atgal
    () => {
      const rez = a + b - c
      if (rez <= 0) return null
      return uzdavinys('algoritmai', {
        klausimas: `Vėžliukas vykdo: pirmyn ${a}, pirmyn ${b}, atgal ${c}. Per kiek langelių jis nutolo nuo pradžios?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${a} + ${b} - ${c} = ${rez}$ langeliai.`,
      })
    },

    // 3. Kartojimo komanda
    () =>
      uzdavinys('algoritmai', {
        klausimas: `Vėžliukas vykdo komandą: kartok ${kartai} kartus { pirmyn ${zingsnis} }. Per kiek langelių jis nukeliavo?`,
        atsakymas: String(kartai * zingsnis),
        atsakymasRodymui: `$${kartai * zingsnis}$`,
        sprendimas: `$${kartai} \\cdot ${zingsnis} = ${kartai * zingsnis}$ langeliai.`,
      }),

    // 4. Uždara figūra
    () => {
      const krastines = pasirink([3, 4, 5, 6, 8] as const)
      return uzdavinys('algoritmai', {
        klausimas: `Vėžliukas vykdo: kartok ${krastines} kartus { pirmyn ${zingsnis}, pasuk } ir grįžta į pradžią. Koks nubrėžtos figūros perimetras langeliais?`,
        atsakymas: String(krastines * zingsnis),
        atsakymasRodymui: `$${krastines * zingsnis}$`,
        sprendimas: `Nubrėžtos ${krastines} vienodos kraštinės po ${zingsnis}: $${krastines} \\cdot ${zingsnis} = ${
          krastines * zingsnis
        }$.`,
      })
    },

    // 5. Posūkio kampas
    () => {
      if (lygis === 1) return null
      const krastines = pasirink([3, 4, 5, 6, 8, 9, 10, 12] as const)
      return uzdavinys('algoritmai', {
        klausimas: `Vėžliukas turi nubrėžti taisyklingą ${krastines} kraštinių figūrą: kartok ${krastines} kartus { pirmyn ${zingsnis}, pasuk ${'□'}° }. Koks posūkio kampas?`,
        atsakymas: String(360 / krastines),
        atsakymasRodymui: `$${360 / krastines}°$`,
        sprendimas: `Apeidamas figūrą vėžliukas pasisuka 360°: $360 : ${krastines} = ${
          360 / krastines
        }$°.`,
      })
    },

    // 6. Sąlyga cikle
    () => {
      if (lygis === 1) return null
      const pradine = atsitiktinis(2, didink(20, klase))
      const kiek = atsitiktinis(2, 6)
      return uzdavinys('algoritmai', {
        klausimas: `Kintamasis $n$ pradžioje lygus ${pradine}. Komanda „$n = n + ${zingsnis}$“ įvykdoma ${kiek} kartus. Kokia bus $n$ reikšmė?`,
        atsakymas: String(pradine + kiek * zingsnis),
        atsakymasRodymui: `$${pradine + kiek * zingsnis}$`,
        sprendimas: `$${pradine} + ${kiek} \\cdot ${zingsnis} = ${pradine + kiek * zingsnis}$.`,
      })
    },

    // 7. Dvigubinimo ciklas
    () => {
      if (lygis === 1) return null
      const pradine = atsitiktinis(1, 5)
      const kiek = atsitiktinis(2, vyresne(klase) ? 8 : 5)
      const rez = pradine * 2 ** kiek
      if (rez > 10000) return null
      return uzdavinys('algoritmai', {
        klausimas: `Kintamasis $n$ pradžioje lygus ${pradine}. Komanda „$n = n \\cdot 2$“ įvykdoma ${kiek} kartus. Kokia bus $n$ reikšmė?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${pradine} \\cdot 2^{${kiek}} = ${pradine} \\cdot ${2 ** kiek} = ${rez}$.`,
      })
    },

    // 8. Įdėtieji ciklai
    () => {
      if (!vyresne(klase) && lygis !== 3) return null
      const isorinis = atsitiktinis(2, didink(6, klase))
      const vidinis = atsitiktinis(2, didink(6, klase))
      return uzdavinys('algoritmai', {
        klausimas: `Programoje: kartok ${isorinis} kartus { kartok ${vidinis} kartus { pirmyn ${zingsnis} } }. Per kiek langelių nukeliauta iš viso?`,
        atsakymas: String(isorinis * vidinis * zingsnis),
        atsakymasRodymui: `$${isorinis * vidinis * zingsnis}$`,
        sprendimas: `$${isorinis} \\cdot ${vidinis} \\cdot ${zingsnis} = ${
          isorinis * vidinis * zingsnis
        }$ langeliai.`,
      })
    },
  ]

  if (lygis === 1) return variacija(visos.slice(0, 4))
  if (lygis === 2) return variacija(visos.slice(0, 7))
  return variacija(visos)
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

export const konstravimas: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkKonstravima(lygis, klase), A_KONSTRAVIMAS, 'konstravimas')

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

function kurkKonstravima(lygis: Lygis, klase?: number): Uzdavinys | null {
  const kampas = atsitiktinis(2, 16) * 5
  const ilgis = atsitiktinis(2, didink(20, klase)) * 2

  const visos = [
    // 1. Pusiaukampinė
    () => {
      const k = atsitiktinis(3, 17) * 10
      if (k % 20 !== 0) return null
      return uzdavinys('konstravimas', {
        klausimas: `Nubrėžta ${k}° kampo pusiaukampinė (punktyrinė linija). Koks kampas tarp jos ir kampo kraštinės?`,
        atsakymas: String(k / 2),
        atsakymasRodymui: `$${k / 2}°$`,
        sprendimas: `Pusiaukampinė dalija kampą pusiau: $${k} : 2 = ${k / 2}$°.`,
        brezinys: kampoBrezinys(k, true),
      })
    },

    // 2. Statmuo
    () =>
      uzdavinys('konstravimas', {
        klausimas: `Prie tiesės nubrėžtas statmuo. Vienas kampas tarp spindulio ir tiesės yra ${kampas}°. Koks kampas lieka iki statmens?`,
        atsakymas: String(90 - kampas),
        atsakymasRodymui: `$${90 - kampas}°$`,
        sprendimas: `Statmuo sudaro 90°, tad $90 - ${kampas} = ${90 - kampas}$°.`,
        brezinys: kampoBrezinys(kampas, false),
      }),

    // 3. Atkarpos dalijimas
    () => {
      const dalys = pasirink([2, 4] as const)
      return uzdavinys('konstravimas', {
        klausimas: `Atkarpa, kurios ilgis ${ilgis} cm, padalyta į ${dalys} lygias dalis. Kokio ilgio viena dalis?`,
        atsakymas: String(ilgis / dalys),
        atsakymasRodymui: `$${ilgis / dalys}$ cm`,
        sprendimas: `$${ilgis} : ${dalys} = ${ilgis / dalys}$ cm.`,
      })
    },

    // 4. Gretutinis kampas
    () =>
      uzdavinys('konstravimas', {
        klausimas: `Nubrėžtas ${kampas}° kampas prie tiesės. Koks jo gretutinis kampas?`,
        atsakymas: String(180 - kampas),
        atsakymasRodymui: `$${180 - kampas}°$`,
        sprendimas: `Gretutinių kampų suma 180°: $180 - ${kampas} = ${180 - kampas}$°.`,
        brezinys: kampoBrezinys(kampas, false),
      }),

    // 5. Vidurio statmuo — atstumas nuo vidurio taško
    () => {
      if (lygis === 1) return null
      return uzdavinys('konstravimas', {
        klausimas: `Atkarpai, kurios ilgis ${ilgis} cm, nubrėžtas vidurio statmuo. Kokiu atstumu nuo atkarpos galo jis kerta atkarpą?`,
        atsakymas: String(ilgis / 2),
        atsakymasRodymui: `$${ilgis / 2}$ cm`,
        sprendimas: `Vidurio statmuo eina per atkarpos vidurį: $${ilgis} : 2 = ${
          ilgis / 2
        }$ cm.`,
      })
    },

    // 6. Kampo dalijimas į keturias dalis
    () => {
      if (lygis === 1) return null
      const k = atsitiktinis(1, 11) * 20
      if (k % 4 !== 0) return null
      return uzdavinys('konstravimas', {
        klausimas: `${k}° kampas dviem pusiaukampinėmis padalytas į keturias lygias dalis. Koks kiekvienos dalies kampas?`,
        atsakymas: String(k / 4),
        atsakymasRodymui: `$${k / 4}°$`,
        sprendimas: `$${k} : 4 = ${k / 4}$°.`,
        brezinys: kampoBrezinys(k, true),
      })
    },

    // 7. Apibrėžtinio apskritimo spindulys
    () => {
      if (lygis === 1) return null
      return uzdavinys('konstravimas', {
        klausimas: `Apie kvadratą, kurio įstrižainė ${ilgis} cm, apibrėžtas apskritimas. Koks jo spindulys?`,
        atsakymas: String(ilgis / 2),
        atsakymasRodymui: `$${ilgis / 2}$ cm`,
        sprendimas: `Įstrižainė yra apskritimo skersmuo: $${ilgis} : 2 = ${ilgis / 2}$ cm.`,
      })
    },

    // 8. Trikampio pusiaukraštinė
    () => {
      if (!vyresne(klase) && lygis !== 3) return null
      return uzdavinys('konstravimas', {
        klausimas: `Trikampio kraštinė ${ilgis} cm. Į kokias dvi dalis ją padalija pusiaukraštinė? Įrašyk vienos dalies ilgį.`,
        atsakymas: String(ilgis / 2),
        atsakymasRodymui: `$${ilgis / 2}$ cm`,
        sprendimas: `Pusiaukraštinė jungia viršūnę su priešingos kraštinės viduriu: $${ilgis} : 2 = ${
          ilgis / 2
        }$ cm.`,
      })
    },
  ]

  if (lygis === 1) return variacija(visos.slice(0, 4))
  if (lygis === 2) return variacija(visos.slice(0, 7))
  return variacija(visos)
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

export const ornamentai: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkOrnamenta(lygis, klase), A_ORNAMENTAI, 'ornamentai')

/** Ornamento brėžinys: trys figūros iš eilės, kiekvienoje po `zingsnis` daugiau. */
function ornamentoBrezinys(pradzia: number, zingsnis: number): { brezinys: string } {
  const lang = 14
  const tarpas = 26
  let x = 12
  let piesinys = ''
  for (let f = 0; f < 3; f += 1) {
    const kiek = pradzia + f * zingsnis
    for (let i = 0; i < kiek; i += 1) {
      piesinys += `<rect x="${x + (i % 5) * lang}" y="${20 + Math.floor(i / 5) * lang}" width="${
        lang - 2
      }" height="${lang - 2}" fill="${ORANGE}" stroke="${INK}" stroke-width="1"/>`
    }
    piesinys += `<text x="${x}" y="${14}" font-size="11" fill="${MUTED}">${f + 1}.</text>`
    x += 5 * lang + tarpas
  }
  return {
    brezinys: svg(x, 20 + Math.ceil((pradzia + 2 * zingsnis) / 5) * lang + 10, piesinys),
  }
}

function kurkOrnamenta(lygis: Lygis, klase?: number): Uzdavinys | null {
  const zingsnis = lygis === 1 ? atsitiktinis(1, 3) : atsitiktinis(2, didink(5, klase))
  const pradzia = atsitiktinis(1, didink(4, klase))
  const { brezinys } = ornamentoBrezinys(pradzia, zingsnis)
  const virsus = didink(60, klase)

  const visos = [
    // 1. Kelinta figūra
    () => {
      const kelinta = 3 + (lygis === 3 ? atsitiktinis(2, 6) : atsitiktinis(1, 3))
      const atsakymas = pradzia + (kelinta - 1) * zingsnis
      if (atsakymas > virsus) return null
      return uzdavinys('ornamentai', {
        klausimas: `Ornamentas tęsiamas pagal tą patį dėsnį. Kiek langelių bus ${kelinta}-oje figūroje?`,
        atsakymas: String(atsakymas),
        atsakymasRodymui: `$${atsakymas}$`,
        sprendimas: `Kiekvienoje figūroje ${zingsnis} langeliais daugiau: pradedame nuo ${pradzia} ir pridedame ${zingsnis} dar ${
          kelinta - 1
        } kartus — gauname ${atsakymas}.`,
        brezinys,
      })
    },

    // 2. Koks dėsnis
    () =>
      uzdavinys('ornamentai', {
        klausimas: 'Keliais langeliais kiekviena ornamento figūra didesnė už ankstesnę?',
        atsakymas: String(zingsnis),
        atsakymasRodymui: `$${zingsnis}$`,
        sprendimas: `Antroje figūroje ${pradzia + zingsnis}, pirmoje ${pradzia}: skirtumas ${zingsnis}.`,
        brezinys,
      }),

    // 3. Kiek langelių iš viso
    () => {
      const kiekFiguru = atsitiktinis(3, lygis === 1 ? 5 : 8)
      const suma =
        kiekFiguru * pradzia + (zingsnis * kiekFiguru * (kiekFiguru - 1)) / 2
      if (suma > virsus * 4) return null
      return uzdavinys('ornamentai', {
        klausimas: `Ornamentas tęsiamas tuo pačiu dėsniu. Kiek iš viso langelių sunaudota pirmoms ${kiekFiguru} figūroms?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Figūrose po ${Array.from(
          { length: kiekFiguru },
          (_, i) => pradzia + i * zingsnis,
        ).join(', ')} langelius — iš viso ${suma}.`,
        brezinys,
      })
    },

    // 4. Kelinta figūra turės duotą kiekį
    () => {
      if (lygis === 1) return null
      const kelinta = atsitiktinis(4, 12)
      const kiek = pradzia + (kelinta - 1) * zingsnis
      if (kiek > virsus) return null
      return uzdavinys('ornamentai', {
        klausimas: `Ornamentas tęsiamas tuo pačiu dėsniu. Kelintoje figūroje bus ${kiek} langeliai?`,
        atsakymas: String(kelinta),
        atsakymasRodymui: `$${kelinta}$`,
        sprendimas: `$(${kiek} - ${pradzia}) : ${zingsnis} + 1 = ${kelinta}$.`,
        brezinys,
      })
    },

    // 5. Bendrasis narys
    () => {
      if (lygis === 1) return null
      const n = atsitiktinis(5, 15)
      const atsakymas = pradzia + (n - 1) * zingsnis
      if (atsakymas > virsus * 2) return null
      return uzdavinys('ornamentai', {
        klausimas: `Ornamento figūrų langelių skaičius sudaro seką $a_n = ${pradzia} + (n - 1) \cdot ${zingsnis}$. Kam lygus $a_{${n}}$?`,
        atsakymas: String(atsakymas),
        atsakymasRodymui: `$${atsakymas}$`,
        sprendimas: `$a_{${n}} = ${pradzia} + ${n - 1} \cdot ${zingsnis} = ${atsakymas}$.`,
        brezinys,
      })
    },

    // 6. Ornamento apsukos
    () => {
      if (!vyresne(klase) && lygis !== 3) return null
      const kartai = atsitiktinis(3, didink(8, klase))
      const viena = pradzia + 2 * zingsnis
      return uzdavinys('ornamentai', {
        klausimas: `Juostoje ornamentas iš ${viena} langelių kartojamas ${kartai} kartus. Kiek langelių sunaudota juostai?`,
        atsakymas: String(viena * kartai),
        atsakymasRodymui: `$${viena * kartai}$`,
        sprendimas: `$${viena} \cdot ${kartai} = ${viena * kartai}$ langeliai.`,
        brezinys,
      })
    },
  ]

  if (lygis === 1) return variacija(visos.slice(0, 3))
  if (lygis === 2) return variacija(visos.slice(0, 5))
  return variacija(visos)
}
