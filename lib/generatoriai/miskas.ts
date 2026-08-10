import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, normalizuok, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys } from './formatai'
import { daiktas } from './ikonos'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * 1 klasė, tema „Tyrinėju reiškinį „Miškas““ — trys potemės.
 *
 * Anksčiau visos trys naudojo bendrus generatorius: sėklos ir medžio aukštis
 * — `matavimo-vienetai`, o medžio amžius — `sudetis-atimtis`. Todėl potemėje
 * „Kaip apskaičiuoti medžio amžių?“ atsirasdavo uždavinių apie žuvytes
 * akvariume. Miškas neturi nieko bendra nei su akvariumu, nei su kilometrais.
 *
 * Dabar kiekviena potemė turi savo turinį ir savo piešinį:
 *   `misko-sekla`  — svarstyklės su sėklomis, gramai;
 *   `medzio-aukstis` — medžiai su matavimo juostelėmis, metrai;
 *   `medzio-amzius`  — kelmo skerspjūvis su rievėmis.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const MUTED = 'var(--muted)'
const LINE = 'var(--line)'

function remas(plotis: number, aukstis: number, turinys: string): string {
  return `<svg viewBox="0 0 ${plotis} ${aukstis}" width="${plotis}" height="${aukstis}" role="img" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto">${turinys}</svg>`
}

// ── 10.1 Kokia medžio sėklos masė? ──────────────────────────────────────────

/**
 * Svarstyklės su sėklomis ant lėkštės ir rodmeniu gramais.
 *
 * Piešiamos pačios, ne imamos iš ikonų rinkinio: uždavinio esmė yra rodmuo,
 * o jo nė viename ikonų rinkinyje nėra.
 */
function svarstykles(gramai: number, seklu: number): string {
  const plotis = 200
  const aukstis = 150
  let t = ''

  // Sėklos ant lėkštės
  for (let i = 0; i < Math.min(seklu, 6); i += 1) {
    t += daiktas('gile', 34 + (i % 3) * 44, 8 + Math.floor(i / 3) * 30, 30)
  }

  // Lėkštė, stovas ir korpusas
  t += `<path d="M28 76h144" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`
  t += `<path d="M100 76v14" stroke="${INK}" stroke-width="3"/>`
  t += `<rect x="46" y="90" width="108" height="46" rx="8" fill="none" stroke="${INK}" stroke-width="2.5"/>`
  t += `<rect x="62" y="100" width="76" height="26" rx="4" fill="none" stroke="${LINE}" stroke-width="1.5"/>`
  t += `<text x="100" y="119" font-size="17" font-weight="700" fill="${ORANGE}" text-anchor="middle">${gramai} g</text>`

  return remas(plotis, aukstis, t)
}

const A_SEKLA = [
  {
    klausimas: 'Kiek gramų sveria sėklos?',
    atsakymas: '5',
    atsakymasRodymui: '$5$ g',
    sprendimas: 'Svarstyklės rodo 5 g.',
  },
] as const

export const miskoSekla: Generatorius = (lygis) =>
  suBandymais(() => kurkSekla(lygis), A_SEKLA, 'misko-sekla')

function kurkSekla(lygis: Lygis): Uzdavinys | null {
  return variacija([
    // 1. Perskaityk rodmenį
    () => {
      const g = atsitiktinis(2, 9)
      const seklu = atsitiktinis(3, 6)
      return uzdavinys('misko-sekla', {
        klausimas: 'Kiek gramų sveria sėklos?',
        atsakymas: String(g),
        atsakymasRodymui: `$${g}$ g`,
        sprendimas: `Svarstyklės rodo ${g} g.`,
        brezinys: svarstykles(g, seklu),
      })
    },

    // 2. Kuris maišelis sunkesnis
    () => {
      const masiai = sumaisyk([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3)
      const maks = Math.max(...masiai)
      return pasirinkimoUzdavinys(naujasId('misko-sekla'), 'misko-sekla', {
        klausimas: `Trys sėklų maišeliai sveria ${masiai.join(' g, ')} g. Kuris sunkiausias?`,
        variantai: masiai.map((m) => `${m} g maišelis`),
        teisingas: masiai.indexOf(maks),
        sprendimas: `Daugiausia sveria ${maks} g maišelis.`,
      })
    },

    // 3. Bendra masė
    () => {
      const a = atsitiktinis(1, 5)
      const b = atsitiktinis(1, 4)
      return uzdavinys('misko-sekla', {
        klausimas: `Vienas sėklų maišelis sveria ${a} g, kitas — ${b} g. Kiek jie sveria kartu?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$ g`,
        sprendimas: `$${a} + ${b} = ${a + b}$ g.`,
      })
    },

    // 4. Surikiuok maišelius
    () => {
      if (lygis === 1) return null
      const masiai = sumaisyk([1, 2, 3, 4].slice(0, 3))
      const raides = ['A', 'B', 'C']
      const teisinga = [...masiai].sort((x, y) => x - y).map((m) => raides[masiai.indexOf(m)])
      return {
        id: naujasId('misko-sekla'),
        temaId: 'misko-sekla',
        klausimas: 'Sudėk maišelius nuo lengviausio iki sunkiausio. Įrašyk raides iš eilės.',
        atsakymas: normalizuok(teisinga.join(' ')),
        atsakymasRodymui: teisinga.join(' '),
        sprendimas: `Masės: ${masiai.map((m, i) => `${raides[i]} — ${m} g`).join(', ')}.`,
        formatas: 'eiliskumas' as const,
        elementai: masiai.map((m, i) => `${raides[i]}) ${m} g`),
      }
    },
  ])
}

// ── 10.2 Kaip išmatuoti medžio aukštį? ──────────────────────────────────────

/**
 * Medžiai su matavimo skale.
 *
 * Skalė kairėje yra pati uždavinio esmė: mokinys aukštį nuskaito, o ne
 * atsimena. Medžiai piešiami spalvoti — pirmokui taip atpažįstamiau.
 */
function medziuScena(aukstiai: readonly number[], suSkale = true): string {
  const maks = Math.max(...aukstiai, 8)
  const pikseliaiMetrui = 13
  const pagrindas = maks * pikseliaiMetrui + 24
  const krastas = suSkale ? 42 : 14
  const TARPAS = 16

  // Medžio piešinys yra kvadratas, tad platesnis medis yra ir aukštesnis.
  // Fiksuotas 74 px žingsnis aukštus medžius suguldydavo vieną ant kito, todėl
  // vietos kiekvienam skiriama pagal jo paties plotį.
  const plociai = aukstiai.map((a) => a * pikseliaiMetrui)
  const pradzios: number[] = []
  let x = krastas
  for (const pl of plociai) {
    pradzios.push(x)
    x += pl + TARPAS
  }
  const plotis = x - TARPAS + 14
  const aukstis = pagrindas + 26

  let t = ''

  if (suSkale) {
    t += `<line x1="${krastas - 12}" y1="18" x2="${krastas - 12}" y2="${pagrindas}" stroke="${INK}" stroke-width="1.5"/>`
    for (let m = 0; m <= maks; m += 2) {
      const y = pagrindas - m * pikseliaiMetrui
      t += `<line x1="${krastas - 17}" y1="${y}" x2="${krastas - 7}" y2="${y}" stroke="${INK}" stroke-width="1.5"/>`
      t += `<text x="${krastas - 21}" y="${y + 4}" font-size="10" fill="${MUTED}" text-anchor="end">${m}</text>`
    }
    t += `<text x="${krastas - 21}" y="14" font-size="10" fill="${MUTED}" text-anchor="end">m</text>`
  }

  // Žemės linija
  t += `<line x1="${krastas - 18}" y1="${pagrindas}" x2="${plotis - 8}" y2="${pagrindas}" stroke="${INK}" stroke-width="2"/>`

  aukstiai.forEach((a, i) => {
    const h = plociai[i]
    const px = pradzios[i]
    t += daiktas('medis', px, pagrindas - h, h)
    t += `<text x="${px + h / 2}" y="${pagrindas + 18}" font-size="11" fill="${MUTED}" text-anchor="middle">${String.fromCharCode(65 + i)}</text>`
  })

  return remas(plotis, aukstis, t)
}

const A_AUKSTIS = [
  {
    klausimas: 'Koks medžio aukštis?',
    atsakymas: '6',
    atsakymasRodymui: '$6$ m',
    sprendimas: 'Pagal skalę medžio viršūnė yra ties 6 m.',
  },
] as const

export const medzioAukstis: Generatorius = (lygis) =>
  suBandymais(() => kurkAuksti(lygis), A_AUKSTIS, 'medzio-aukstis')

function kurkAuksti(lygis: Lygis): Uzdavinys | null {
  return variacija([
    // 1. Nuskaityk aukštį iš skalės
    () => {
      const a = atsitiktinis(2, 9)
      return uzdavinys('medzio-aukstis', {
        klausimas: 'Koks medžio aukštis?',
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ m`,
        sprendimas: `Pagal skalę medžio viršūnė yra ties ${a} m.`,
        brezinys: medziuScena([a]),
      })
    },

    // 2. Kuris medis aukščiausias
    () => {
      const trys = sumaisyk([3, 5, 8, 9, 6]).slice(0, 3)
      if (new Set(trys).size < 3) return null
      const maks = Math.max(...trys)
      return pasirinkimoUzdavinys(naujasId('medzio-aukstis'), 'medzio-aukstis', {
        klausimas: 'Kuris medis aukščiausias?',
        variantai: trys.map((_, i) => String.fromCharCode(65 + i)),
        teisingas: trys.indexOf(maks),
        sprendimas: `Aukščiai: ${trys.map((a, i) => `${String.fromCharCode(65 + i)} — ${a} m`).join(', ')}.`,
        brezinys: medziuScena(trys),
      })
    },

    // 3. Keliais metrais aukštesnis
    () => {
      const a = atsitiktinis(5, 9)
      const b = atsitiktinis(2, a - 1)
      return uzdavinys('medzio-aukstis', {
        klausimas: 'Keliais metrais medis A aukštesnis už medį B?',
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$ m`,
        sprendimas: `$${a} - ${b} = ${a - b}$ m.`,
        brezinys: medziuScena([a, b]),
      })
    },

    // 4. Kiek juostelių aukščio
    () => {
      const juostele = 2
      const juosteliu = atsitiktinis(2, 4)
      const a = juostele * juosteliu
      return uzdavinys('medzio-aukstis', {
        klausimas: `Medis matuojamas ${juostele} m ilgio juostelėmis. Kiek juostelių aukščio yra medis?`,
        atsakymas: String(juosteliu),
        atsakymasRodymui: `$${juosteliu}$`,
        sprendimas: `Medis ${a} m aukščio: $${a} : ${juostele} = ${juosteliu}$ juostelės.`,
        brezinys: medziuScena([a]),
      })
    },

    // 5. Kuris žemesnis
    () => {
      if (lygis === 1) return null
      const trys = sumaisyk([2, 3, 4, 6, 7, 9]).slice(0, 3)
      if (new Set(trys).size < 3) return null
      const min = Math.min(...trys)
      return pasirinkimoUzdavinys(naujasId('medzio-aukstis'), 'medzio-aukstis', {
        klausimas: 'Kuris medis žemiausias?',
        variantai: trys.map((_, i) => String.fromCharCode(65 + i)),
        teisingas: trys.indexOf(min),
        sprendimas: trys.map((a, i) => `${String.fromCharCode(65 + i)} — ${a} m`).join(', ') + '.',
        brezinys: medziuScena(trys),
      })
    },
  ])
}

// ── 10.3 Kaip apskaičiuoti medžio amžių? ────────────────────────────────────

/**
 * Kelmo skerspjūvis su rievėmis.
 *
 * Rievių skaičius ir yra medžio amžius — tai visos potemės esmė, tad jos
 * privalo būti suskaičiuojamos akimis. Todėl rievės piešiamos tolygiai
 * išdėstytais apskritimais, o ne tikroviškai netaisyklingos.
 */
function kelmas(rieviu: number, pazymetos = false): string {
  const r = 12 + (rieviu - 1) * 8
  const dydis = 2 * r + 24
  const c = dydis / 2

  // Visos rievės brėžiamos vienodai. Anksčiau kraštinė buvo juoda, o vidinės
  // oranžinės — vaikas galėjo suskaičiuoti tik spalvotąsias ir suklysti vienetu.
  const spalva = pazymetos ? ORANGE : INK
  let t = ''
  for (let i = rieviu; i >= 1; i -= 1) {
    t += `<circle cx="${c}" cy="${c}" r="${12 + (i - 1) * 8}" fill="none" stroke="${spalva}" stroke-width="2"/>`
  }
  t += `<circle cx="${c}" cy="${c}" r="4" fill="${INK}"/>`
  return remas(dydis, dydis, t)
}

/** Keli kelmai greta — palyginimui. Kiekvienas pažymimas raide. */
function keliKelmai(rieviai: readonly number[]): string {
  const TARPAS = 20
  const plociai = rieviai.map((r) => 2 * (12 + (r - 1) * 8) + 24)
  let x = 0
  let turinys = ''

  rieviai.forEach((r, i) => {
    const vienas = kelmas(r)
    const pl = plociai[i]
    turinys +=
      `<g transform="translate(${x},0)">` +
      vienas.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') +
      `<text x="${pl / 2}" y="${pl + 14}" font-size="11" fill="${MUTED}" text-anchor="middle">${String.fromCharCode(65 + i)}</text></g>`
    x += pl + TARPAS
  })

  return remas(x - TARPAS, Math.max(...plociai) + 22, turinys)
}

const A_AMZIUS = [
  {
    klausimas: 'Kiek rievių matai kelme?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Suskaičiavus rieves gaunama 6 — tiek metų buvo medžiui.',
  },
] as const

export const medzioAmzius: Generatorius = (lygis) =>
  suBandymais(() => kurkAmziu(lygis), A_AMZIUS, 'medzio-amzius')

function kurkAmziu(lygis: Lygis): Uzdavinys | null {
  return variacija([
    // 1. Suskaičiuok rieves
    () => {
      const n = atsitiktinis(3, 8)
      return uzdavinys('medzio-amzius', {
        klausimas: 'Kiek rievių matai kelme?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Rievių yra ${n}.`,
        brezinys: kelmas(n, true),
      })
    },

    // 2. Kiek metų buvo medžiui
    () => {
      const n = atsitiktinis(3, 9)
      return uzdavinys('medzio-amzius', {
        klausimas: 'Kiek metų buvo medžiui? Suskaičiuok rieves.',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$ ${derink(n, { vns: 'metai', dgs: 'metai', kilm: 'metų' })}`,
        sprendimas: `Kiekviena rievė — vieni metai. Rievių ${n}, tad medžiui buvo ${n} metai.`,
        brezinys: kelmas(n, true),
      })
    },

    // 3. Kuris medis vyresnis
    () => {
      const trys = sumaisyk([2, 3, 4, 5, 6, 7, 8]).slice(0, 3)
      if (new Set(trys).size < 3) return null
      const maks = Math.max(...trys)
      return pasirinkimoUzdavinys(naujasId('medzio-amzius'), 'medzio-amzius', {
        klausimas: 'Kuris medis buvo vyriausias?',
        variantai: trys.map((_, i) => String.fromCharCode(65 + i)),
        teisingas: trys.indexOf(maks),
        sprendimas:
          trys.map((r, i) => `${String.fromCharCode(65 + i)} — ${r} rievės`).join(', ') +
          '. Vyriausias tas, kuris turi daugiausia rievių.',
        brezinys: keliKelmai(trys),
      })
    },

    // 4. Keliais metais vyresnis
    () => {
      if (lygis === 1) return null
      const a = atsitiktinis(5, 9)
      const b = atsitiktinis(2, a - 1)
      return uzdavinys('medzio-amzius', {
        klausimas: 'Keliais metais medis A vyresnis už medį B?',
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$`,
        sprendimas: `A turi ${a} rieves, B — ${b}: $${a} - ${b} = ${a - b}$.`,
        brezinys: keliKelmai([a, b]),
      })
    },

    // 5. Kiek rievių bus po kelerių metų
    () => {
      if (lygis === 1) return null
      const n = atsitiktinis(3, 7)
      const po = atsitiktinis(2, 4)
      return uzdavinys('medzio-amzius', {
        klausimas: `Medis turi tiek rievių, kiek matai. Kiek rievių jis turės po ${po} metų?`,
        atsakymas: String(n + po),
        atsakymasRodymui: `$${n + po}$`,
        sprendimas: `Dabar ${n} rievės, kasmet priauga po vieną: $${n} + ${po} = ${n + po}$.`,
        brezinys: kelmas(n, true),
      })
    },
  ])
}
