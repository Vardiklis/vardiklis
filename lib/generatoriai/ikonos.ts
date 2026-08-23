import { IKONU_KELIAI, type IkonosVardas } from './ikonu-duomenys'
import { SPALVOTU_PIESINIAI } from './spalvoti-duomenys'

/**
 * Daiktų paveikslėliai pirmos klasės uždaviniams.
 *
 * Uždavinių sąlygų banke daug vietų, kur reikia ne schemos, o daikto: „3
 * raudoni ir 2 geltoni balionai", „katė dėžėje", „7 obuoliai, 2 nubraukti".
 * Tokių piešti patiems neverta, todėl imamos Lucide ikonos — jos yra
 * vienspalvės linijos su `currentColor`, tad paveldi `var(--ink)` ir
 * spausdinant lieka juodos, lygiai kaip visi kiti brėžiniai.
 *
 * Ko Lucide neturi (balionas, kriaušė), piešiama čia pat — jos paprastos.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const MUTED = 'var(--muted)'

export type Daiktas = IkonosVardas | 'balionas' | 'stalasBaldas' | 'suoliukasBaldas' | 'dezeAtvira'

/** Ar toks daiktas iš viso piešiamas. */
export function arYraDaiktas(vardas: string): vardas is Daiktas {
  return vardas === 'balionas' || vardas in IKONU_KELIAI
}

/**
 * Vienas daiktas 24×24 langelyje, perkeltas ir sumažintas iki `dydis`.
 *
 * Grąžinama `<g>`, ne visas SVG — kad kelis daiktus būtų galima sudėti į
 * vieną piešinį.
 */
export function daiktas(
  vardas: Daiktas,
  x: number,
  y: number,
  dydis = 40,
  spalva = INK,
): string {
  // Spalvotas Twemoji paveikslėlis, jei toks daiktui yra: pirmokui medis ar
  // katė atpažįstami daug greičiau nei ta pati forma viena linija. Spalvos
  // įrašytos pačiame piešinyje, tad `spalva` jam netaikoma.
  // Spalvotas paveikslėlis rodomas toks, koks yra: jokių apvedimų. Klausimas
  // pats nurodo, apie kurį daiktą kalbama, tad rėmelis buvo tik triukšmas.
  const spalvotas = SPALVOTU_PIESINIAI[vardas]
  if (spalvotas) {
    return `<g transform="translate(${x} ${y}) scale(${dydis / 36})">${spalvotas}</g>`
  }

  const vidus = SAVI[vardas] ?? IKONU_KELIAI[vardas]
  return `<g transform="translate(${x} ${y}) scale(${dydis / 24})" fill="none" stroke="${spalva}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${vidus}</g>`
}

/**
 * Daiktai, kurių Lucide neturi arba kurių atitikmuo klaidina.
 *
 * `table` Lucide'e yra duomenų lentelė, ne baldas — pirmokui tai ne stalas,
 * po kuriuo galėtų būti kamuolys. Tokius piešiam patys; jie paprasti.
 */
const SAVI: Record<string, string> = {
  balionas:
    '<path d="M12 2c3.3 0 6 2.9 6 6.5S15.3 16 12 16s-6-3.9-6-7.5S8.7 2 12 2Z"/>' +
    '<path d="M12 16v1.5"/><path d="M10.5 17.5h3l-1 1.5 1 1.5-1 1.5"/>',
  stalasBaldas:
    '<path d="M2 8h20"/><path d="M4 8v12"/><path d="M20 8v12"/><path d="M2 8l2-3h16l2 3"/>',
  suoliukasBaldas:
    '<path d="M2 11h20"/><path d="M5 11v8"/><path d="M19 11v8"/><path d="M2 15h20"/>',
  // Lucide `box` yra uždaras kubas — jo viduje daikto pavaizduoti neįmanoma,
  // o „katė dėžėje" kaip tik to ir reikalauja. Todėl atvira dėžė iš šono.
  dezeAtvira: '<path d="M3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7"/><path d="M1 7h22"/>',
}

/** Kryžius ant daikto — „nubraukta", kai skaičiuojama, kiek liko. */
function nubraukimas(x: number, y: number, dydis: number): string {
  const p = dydis * 0.12
  return (
    `<line x1="${x + p}" y1="${y + p}" x2="${x + dydis - p}" y2="${y + dydis - p}" stroke="${MUTED}" stroke-width="2.5" stroke-linecap="round"/>` +
    `<line x1="${x + dydis - p}" y1="${y + p}" x2="${x + p}" y2="${y + dydis - p}" stroke="${MUTED}" stroke-width="2.5" stroke-linecap="round"/>`
  )
}

function remas(plotis: number, aukstis: number, turinys: string): string {
  return `<svg viewBox="0 0 ${plotis} ${aukstis}" width="${plotis}" height="${aukstis}" role="img" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto">${turinys}</svg>`
}

// ── Skaičiavimo eilės ───────────────────────────────────────────────────────

export type Grupe = {
  daiktas: Daiktas
  kiek: number
  /** Oranžine spalva pažymima grupė, apie kurią klausiama. */
  akcentas?: boolean
  /** Kiek paskutinių daiktų perbraukiama — „kiek liko" uždaviniams. */
  nubraukta?: number
}

/**
 * Viena ar kelios daiktų grupės vienoje eilėje.
 *
 * Grupės skiriamos tarpu, o ne spalva: spausdinant oranžinė virsta juoda, tad
 * spalva vienintele skiriamąja žyme būti negali.
 */
export function daiktuEile(grupes: readonly Grupe[], dydis = 40): string {
  const tarpas = Math.round(dydis * 0.28)
  // Tarpas tarp grupių turi būti aiškiai didesnis už tarpą tarp daiktų —
  // kitaip, kai daiktų daug, trys grupės susilieja į vieną ilgą eilę.
  const grupiuTarpas = Math.round(dydis * 1.8)
  const krastas = 8

  let x = krastas
  let turinys = ''
  grupes.forEach((g, gi) => {
    for (let i = 0; i < g.kiek; i += 1) {
      turinys += daiktas(g.daiktas, x, krastas, dydis, g.akcentas ? ORANGE : INK)
      if (g.nubraukta && i >= g.kiek - g.nubraukta) {
        turinys += nubraukimas(x, krastas, dydis)
      }
      x += dydis + tarpas
    }
    if (gi < grupes.length - 1) x += grupiuTarpas - tarpas
  })

  return remas(x - tarpas + krastas, dydis + 2 * krastas, turinys)
}

/**
 * Daiktai dviem eilėmis, kai jų daug.
 *
 * Vienoje eilėje daugiau nei šeši daiktai pirmokui pasidaro sunkūs suskaičiuoti,
 * o lape jie netelpa.
 */
export function daiktuLentele(grupes: readonly Grupe[], eileje = 5, dydis = 40): string {
  const tarpas = Math.round(dydis * 0.28)
  const krastas = 8
  const visi: { d: Daiktas; spalva: string; nubraukti: boolean }[] = []
  for (const g of grupes) {
    for (let i = 0; i < g.kiek; i += 1) {
      visi.push({
        d: g.daiktas,
        spalva: g.akcentas ? ORANGE : INK,
        nubraukti: Boolean(g.nubraukta) && i >= g.kiek - (g.nubraukta ?? 0),
      })
    }
  }

  const eiluciu = Math.ceil(visi.length / eileje)
  let turinys = ''
  visi.forEach((v, i) => {
    const x = krastas + (i % eileje) * (dydis + tarpas)
    const y = krastas + Math.floor(i / eileje) * (dydis + tarpas)
    turinys += daiktas(v.d, x, y, dydis, v.spalva)
    if (v.nubraukti) turinys += nubraukimas(x, y, dydis)
  })

  return remas(
    Math.min(visi.length, eileje) * (dydis + tarpas) - tarpas + 2 * krastas,
    eiluciu * (dydis + tarpas) - tarpas + 2 * krastas,
    turinys,
  )
}

// ── Erdvinės scenos ─────────────────────────────────────────────────────────

export type Vieta = { daiktas: Daiktas; x: number; y: number; dydis?: number; akcentas?: boolean }

/**
 * Daiktai nurodytose vietose — erdvinių santykių uždaviniams („kamuolys po
 * stalu", „katė dėžėje").
 *
 * Vietas skaičiuoja generatorius: tik jis žino, ką reiškia „po" ar „už“.
 */
export function scena(vietos: readonly Vieta[], plotis = 260, aukstis = 150): string {
  const turinys = vietos
    .map((v) => daiktas(v.daiktas, v.x, v.y, v.dydis ?? 44, v.akcentas ? ORANGE : INK))
    .join('')
  return remas(plotis, aukstis, turinys)
}

/**
 * Atvira dėžė iš šono ir daiktai joje.
 *
 * Nulio uždaviniui reikia dėžės, į kurią matyti. Uždara dėžė vaikui reiškia
 * „nežinau, kas viduje“, o ne „tuščia“, tad atsakymas 0 atrodydavo kaip
 * spėjimas.
 *
 * Dėžė brėžiama tiesiai piešinio koordinatėmis, o ne didinama ikona: ikonos
 * linija didinama kartu su ja, ir tokio pločio dėžė išeidavo storesnė už pačius
 * daiktus. Telpa iki keturių daiktų — tiek ir reikia skaičiams iki 4.
 */
export function dezeSuDaiktais(vardas: Daiktas, kiek: number): string {
  const dydis = 32
  const tarpas = 6
  const eile = kiek * dydis + Math.max(0, kiek - 1) * tarpas
  const pradzia = 95 - eile / 2

  const deze =
    `<g fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">` +
    '<path d="M16 24V74a6 6 0 0 0 6 6h146a6 6 0 0 0 6-6V24"/>' +
    '<path d="M6 24h178"/>' +
    '</g>'

  let turinys = ''
  for (let i = 0; i < kiek; i += 1) {
    turinys += daiktas(vardas, pradzia + i * (dydis + tarpas), 46, dydis)
  }

  return remas(190, 96, deze + turinys)
}

/**
 * Daiktai su numeriais virš jų.
 *
 * „Trečias iš kairės“ pirmokui yra du uždaviniai viename: pirma reikia
 * atsiminti, kur kairė, ir tik paskui skaičiuoti. Numeriai virš daiktų kairės
 * klausimą nuima — lieka eilės tvarka, apie kurią potemė ir yra.
 *
 * Numeriai rašomi vienoje aukštumoje, o ne virš kiekvieno daikto viršaus: kai
 * daiktai skirtingo dydžio, banguojanti skaičių eilė skaitosi sunkiau nei
 * lygi.
 */
export function suNumeriais(
  vietos: readonly Vieta[],
  plotis = 260,
  aukstis = 150,
  numeriuY = 15,
): string {
  const turinys = vietos
    .map((v, i) => {
      const d = v.dydis ?? 44
      const numeris = `<text x="${v.x + d / 2}" y="${numeriuY}" font-size="13" font-weight="600" fill="${MUTED}" text-anchor="middle">${i + 1}</text>`
      return numeris + daiktas(v.daiktas, v.x, v.y, d, v.akcentas ? ORANGE : INK)
    })
    .join('')
  return remas(plotis, aukstis, turinys)
}

/** Daikto pavadinimas po piešiniu — kai scenoje reikia įvardyti, kas yra kas. */
export function suEtiketemis(
  vietos: readonly (Vieta & { etikete?: string })[],
  plotis = 260,
  aukstis = 168,
): string {
  const turinys = vietos
    .map((v) => {
      const d = v.dydis ?? 44
      const zyme = v.etikete
        ? `<text x="${v.x + d / 2}" y="${v.y + d + 13}" font-size="11" fill="${MUTED}" text-anchor="middle">${v.etikete}</text>`
        : ''
      return daiktas(v.daiktas, v.x, v.y, d, v.akcentas ? ORANGE : INK) + zyme
    })
    .join('')
  return remas(plotis, aukstis, turinys)
}

// ── Daiktų žodynas ──────────────────────────────────────────────────────────

/**
 * Daiktai su linksniais — sąlygų tekstams.
 *
 * Be linksnių sakiniai skambėtų kaip vertimas: reikia „po stalu“ (įnag.),
 * „prie knygos“ (kilm.), „į dėžę“ (gal.).
 */
export type DaiktoZodis = {
  daiktas: Daiktas
  /**
   * Giminė: „v“ — vyriškoji, „m“ — moteriškoji.
   *
   * Be jos klausimai išeidavo su klaida: „kelinta kubelis“, „kelintas dėžė“.
   * Būdvardis ir kelintinis skaitvardis derinami su daikto gimine, tad
   * generatorius turi ją žinoti.
   */
  gimine: 'v' | 'm'
  /** Vardininkas: „kamuolys“. */
  v: string
  /** Kilmininkas: „kamuolio“. */
  k: string
  /** Galininkas: „kamuolį“. */
  g: string
  /** Įnagininkas: „kamuoliu“. */
  i: string
  /** Vardininkas daugiskaita: „kamuoliai“. */
  dgs: string
  /** Kilmininkas daugiskaita: „kamuolių“. */
  dgsK: string
  /** Galininkas daugiskaita: „kamuolius“ — „Sudėk kamuolius…“. */
  dgsG: string
}

export const DAIKTU_ZODYNAS: readonly DaiktoZodis[] = [
  { daiktas: 'obuolys', gimine: 'v', v: 'obuolys', k: 'obuolio', g: 'obuolį', i: 'obuoliu', dgs: 'obuoliai', dgsK: 'obuolių' , dgsG: 'obuolius' },
  { daiktas: 'kamuolys', gimine: 'v', v: 'kamuolys', k: 'kamuolio', g: 'kamuolį', i: 'kamuoliu', dgs: 'kamuoliai', dgsK: 'kamuolių' , dgsG: 'kamuolius' },
  { daiktas: 'kriause', gimine: 'm', v: 'kriaušė', k: 'kriaušės', g: 'kriaušę', i: 'kriauše', dgs: 'kriaušės', dgsK: 'kriaušių' , dgsG: 'kriaušes' },
  { daiktas: 'knyga', gimine: 'm', v: 'knyga', k: 'knygos', g: 'knygą', i: 'knyga', dgs: 'knygos', dgsK: 'knygų' , dgsG: 'knygas' },
  { daiktas: 'piestukas', gimine: 'v', v: 'pieštukas', k: 'pieštuko', g: 'pieštuką', i: 'pieštuku', dgs: 'pieštukai', dgsK: 'pieštukų' , dgsG: 'pieštukus' },
  { daiktas: 'kubelis', gimine: 'v', v: 'kubelis', k: 'kubelio', g: 'kubelį', i: 'kubeliu', dgs: 'kubeliai', dgsK: 'kubelių' , dgsG: 'kubelius' },
  { daiktas: 'zvaigzde', gimine: 'm', v: 'žvaigždė', k: 'žvaigždės', g: 'žvaigždę', i: 'žvaigžde', dgs: 'žvaigždės', dgsK: 'žvaigždžių' , dgsG: 'žvaigždes' },
  { daiktas: 'sausainis', gimine: 'v', v: 'sausainis', k: 'sausainio', g: 'sausainį', i: 'sausainiu', dgs: 'sausainiai', dgsK: 'sausainių' , dgsG: 'sausainius' },
  { daiktas: 'balionas', gimine: 'v', v: 'balionas', k: 'baliono', g: 'balioną', i: 'balionu', dgs: 'balionai', dgsK: 'balionų' , dgsG: 'balionus' },
  { daiktas: 'gele', gimine: 'm', v: 'gėlė', k: 'gėlės', g: 'gėlę', i: 'gėle', dgs: 'gėlės', dgsK: 'gėlių' , dgsG: 'gėles' },
  { daiktas: 'paukstis', gimine: 'v', v: 'paukštis', k: 'paukščio', g: 'paukštį', i: 'paukščiu', dgs: 'paukščiai', dgsK: 'paukščių' , dgsG: 'paukščius' },
  { daiktas: 'kate', gimine: 'm', v: 'katė', k: 'katės', g: 'katę', i: 'kate', dgs: 'katės', dgsK: 'kačių' , dgsG: 'kates' },
  { daiktas: 'deze', gimine: 'm', v: 'dėžė', k: 'dėžės', g: 'dėžę', i: 'dėže', dgs: 'dėžės', dgsK: 'dėžių' , dgsG: 'dėžes' },
  { daiktas: 'medis', gimine: 'v', v: 'medis', k: 'medžio', g: 'medį', i: 'medžiu', dgs: 'medžiai', dgsK: 'medžių' , dgsG: 'medžius' },
  { daiktas: 'dviratis', gimine: 'v', v: 'dviratis', k: 'dviračio', g: 'dviratį', i: 'dviračiu', dgs: 'dviračiai', dgsK: 'dviračių' , dgsG: 'dviračius' },
  { daiktas: 'stalasBaldas', gimine: 'v', v: 'stalas', k: 'stalo', g: 'stalą', i: 'stalu', dgs: 'stalai', dgsK: 'stalų' , dgsG: 'stalus' },
  { daiktas: 'suoliukasBaldas', gimine: 'v', v: 'suoliukas', k: 'suoliuko', g: 'suoliuką', i: 'suoliuku', dgs: 'suoliukai', dgsK: 'suoliukų' , dgsG: 'suoliukus' },
  { daiktas: 'namas', gimine: 'v', v: 'namas', k: 'namo', g: 'namą', i: 'namu', dgs: 'namai', dgsK: 'namų', dgsG: 'namus' },
  { daiktas: 'lele', gimine: 'm', v: 'lėlė', k: 'lėlės', g: 'lėlę', i: 'lėle', dgs: 'lėlės', dgsK: 'lėlių' , dgsG: 'lėles' },
]

/** Daiktas pagal vardą — kai generatorius nori konkretaus. */
export function zodis(daiktas: Daiktas): DaiktoZodis {
  const rastas = DAIKTU_ZODYNAS.find((z) => z.daiktas === daiktas)
  if (!rastas) throw new Error(`Nėra žodyno įrašo daiktui: ${daiktas}`)
  return rastas
}
