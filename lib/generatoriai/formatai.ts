import { normalizuok, sumaisyk } from '../matematika'
import type { Pora, Uzdavinys, Variantas } from './tipai'

/**
 * Atsakymų formatai, kurių reikalauja PUPP programa.
 *
 * Programoje numatyti trys pateikimo būdai; variklis mokėjo tik įvedimą.
 * I dalis (10 iš 50 taškų) yra vien pasirenkamojo atsakymo, tad be jų
 * egzamino lapas struktūriškai neatitiktų tikrovės.
 *
 * Pasirinkimas daromas APVALKALU aplink jau sugeneruotą uždavinį — taip
 * bet kuris iš šešiasdešimties generatorių tampa pasirenkamojo atsakymo
 * uždaviniu be nė vienos eilutės pakeitimo juose. Porų susiejimui ir
 * eiliškumui apvalkalo neužtenka: tokie uždaviniai kuriami tikslingai.
 */

const RAIDES = ['A', 'B', 'C', 'D', 'E'] as const

// ── Pasirenkamasis atsakymas ────────────────────────────────────────────────

/**
 * Distraktoriai iš tipinių mokinių klaidų.
 *
 * Atsitiktinis skaičius netinka: mokinys jį atmeta nesuskaičiavęs, ir uždavinys
 * virsta spėjimu. Klaidos parenkamos tos, kurios iš tikrųjų daromos —
 * suklysta ženklu, skyriumi, nukrypstama per vienetą, sumaišoma su tarpiniu
 * rezultatu.
 */
export function skaitiniaiDistraktoriai(atsakymas: string, kiek = 3): string[] {
  const trupmena = atsakymas.match(/^(-?\d+)\/(\d+)$/)
  if (trupmena) {
    const sk = Number(trupmena[1])
    const vd = Number(trupmena[2])
    return atrink(
      [
        // Apversta trupmena netinka, kai skaitiklis 1 — „3/1" nėra trupmena.
        ...(sk > 1 ? [`${vd}/${sk}`] : []),
        `${sk + 1}/${vd}`,
        `${sk}/${vd + 1}`,
        `${sk - 1}/${vd}`,
        `${sk}/${vd - 1}`,
      ].filter((t) => !t.endsWith('/1') && !t.startsWith('0/')),
      atsakymas,
      kiek,
    )
  }

  const n = Number(atsakymas)
  if (!Number.isFinite(n)) return []

  const kandidatai = [
    n + 1,
    n - 1,
    -n,
    n * 2,
    n / 2,
    n * 10,
    n / 10,
    n + 10,
    n - 10,
    sukeiskSkaitmenis(n),
  ]
  return atrink(
    kandidatai
      .filter((k) => Number.isFinite(k) && Number.isInteger(k) && (n < 0 || k > 0))
      .map(String),
    atsakymas,
    kiek,
  )
}

/** Sukeičia du gretimus skaitmenis — dažna nurašymo klaida. */
function sukeiskSkaitmenis(n: number): number {
  const s = String(Math.abs(Math.trunc(n)))
  if (s.length < 2) return NaN
  const a = s.split('')
  ;[a[0], a[1]] = [a[1], a[0]]
  if (a[0] === '0') return NaN
  return Math.sign(n) * Number(a.join(''))
}

/** Unikalūs kandidatai be teisingo atsakymo, ne daugiau kaip `kiek`. */
function atrink(kandidatai: string[], teisingas: string, kiek: number): string[] {
  const matyti = new Set([normalizuok(teisingas)])
  const rez: string[] = []
  for (const k of sumaisyk(kandidatai)) {
    const n = normalizuok(k)
    if (n === '' || matyti.has(n)) continue
    matyti.add(n)
    rez.push(k)
    if (rez.length === kiek) break
  }
  return rez
}

/**
 * Paverčia įvedimo uždavinį pasirenkamojo atsakymo uždaviniu.
 *
 * `netiesos` — klaidingų atsakymų tekstai rodymui. Jų nepakakus, uždavinys
 * grąžinamas nepakeistas: geriau įvedimas, nei pasirinkimas iš dviejų, kur
 * spėjimo tikimybė yra pusė.
 */
/**
 * Nurodymai, kaip įrašyti atsakymą.
 *
 * Virtus pasirenkamojo atsakymo uždaviniu jie tampa melagingi: „Įrašyk
 * trupmena" prie A/B/C/D variantų prieštarauja pačiam formatui.
 */
const IVEDIMO_NURODYMAI =
  /\s*(?:Įrašyk|Rašyk|Atsakyk|Užrašyk)\b[^.?!]*[.?!]\s*$/u

function beIvedimoNurodymo(klausimas: string): string {
  const trumpesnis = klausimas.replace(IVEDIMO_NURODYMAI, '').trim()
  // Nurodymas galėjo būti vienintelis sakinys — tada geriau palikti kaip buvo.
  return trumpesnis.length > 10 ? trumpesnis : klausimas
}

export function suPasirinkimu(u: Uzdavinys, netiesos: string[]): Uzdavinys {
  if (netiesos.length < 2) return u

  const visi = sumaisyk([
    { tekstas: u.atsakymasRodymui, teisingas: true },
    ...netiesos.slice(0, RAIDES.length - 1).map((t) => ({ tekstas: t, teisingas: false })),
  ])

  const variantai: Variantas[] = visi.map((v, i) => ({ raide: RAIDES[i], tekstas: v.tekstas }))
  const teisingoRaide = RAIDES[visi.findIndex((v) => v.teisingas)]

  return {
    ...u,
    klausimas: beIvedimoNurodymo(u.klausimas),
    formatas: 'pasirinkimas',
    variantai,
    atsakymas: normalizuok(teisingoRaide),
    atsakymasRodymui: `${teisingoRaide} — ${u.atsakymasRodymui}`,
    sprendimas: u.sprendimas,
  }
}

/**
 * Šablonas distraktorių rodymui pagal teisingo atsakymo pavidalą.
 *
 * Be jo pasirinkimas subyra: jei teisingas atsakymas rodomas kaip „$99$ €",
 * o distraktoriai kaip „109", mokinys teisingą atpažįsta iš euro ženklo
 * nieko neskaičiavęs. Todėl distraktorius rašome į tą patį rėmą — keičiame
 * tik skaitinį branduolį.
 *
 * Grąžina `null`, kai branduolio vienareikšmiškai nerandame; tada uždavinys
 * lieka įvedimo formato, o ne tampa blogu pasirinkimu.
 */
function rodymoSablonas(rodymui: string): ((naujas: string) => string) | null {
  // Mišrusis skaičius („1\dfrac{1}{12}") turi dvi dalis, o normalizuotas
  // atsakymas — vieną trupmeną. Perrašius vien trupmeną gautųsi nerišlūs
  // variantai tipo „1\dfrac{12}{12}", tad tokių nekeičiam visai.
  if (/\d\s*\\d?frac\{/.test(rodymui)) return null

  const trupmena = rodymui.match(/^(.*?)\\d?frac\{-?\d+\}\{\d+\}(.*)$/)
  if (trupmena) {
    const [, priesagaKaire, priesagaDesine] = trupmena
    return (naujas) => {
      const t = naujas.match(/^(-?\d+)\/(\d+)$/)
      const vidus = t ? `\\dfrac{${t[1]}}{${t[2]}}` : naujas
      return `${priesagaKaire}${vidus}${priesagaDesine}`
    }
  }

  // Vienas skaitinis branduolys — pakeičiam jį, rėmą paliekam.
  const skaiciai = [...rodymui.matchAll(/-?\d+(?:\{,\}\d+|[.,]\d+)?/g)]
  if (skaiciai.length !== 1) return null
  const m = skaiciai[0]
  const pries = rodymui.slice(0, m.index)
  const po = rodymui.slice(m.index + m[0].length)
  return (naujas) => `${pries}${naujas.replace(',', '{,}')}${po}`
}

/**
 * Uždavinį paverčia pasirenkamojo atsakymo uždaviniu, distraktorius išvesdama
 * iš paties atsakymo arba imdama generatoriaus paduotus.
 *
 * Tekstiniams atsakymams („taip", „dešinėje") prasmingų klaidų automatiškai
 * neišvesi, tad tokie uždaviniai lieka įvedimo formato.
 */
export function iPasirinkima(u: Uzdavinys): Uzdavinys {
  // Generatoriaus paduoti distraktoriai visada teisingesni už išvestinius:
  // tik jis žino savo srities ribas.
  if (u.distraktoriai?.length) return suPasirinkimu(u, u.distraktoriai)

  const sablonas = rodymoSablonas(u.atsakymasRodymui)
  if (!sablonas) return u
  const netiesos = skaitiniaiDistraktoriai(u.atsakymas)
  if (netiesos.length < 3) return u
  return suPasirinkimu(u, netiesos.map(sablonas))
}

/**
 * Pasirenkamojo atsakymo uždavinys, kuriamas tiesiogiai.
 *
 * Variantų privalo būti bent trys. Iš dviejų atsakymą galima atspėti pusę
 * kartų, tad uždavinys nustotų matuoti mokėjimą — mesti klaidą čia geriau,
 * nei tyliai paleisti tokį uždavinį į lapą.
 */
export function pasirinkimoUzdavinys(
  id: string,
  temaId: string,
  o: {
    klausimas: string
    variantai: string[]
    /** Indeksas `variantai` masyve. */
    teisingas: number
    sprendimas?: string
    brezinys?: string
  },
): Uzdavinys {
  if (o.variantai.length < 3) {
    throw new Error(
      `Pasirenkamojo atsakymo uždaviniui reikia bent trijų variantų, gauta ${o.variantai.length}: ${o.klausimas}`,
    )
  }
  const sumaisyta = sumaisyk(o.variantai.map((tekstas, i) => ({ tekstas, i })))
  const vieta = sumaisyta.findIndex((v) => v.i === o.teisingas)
  const raide = RAIDES[vieta]

  return {
    id,
    temaId,
    klausimas: o.klausimas,
    atsakymas: normalizuok(raide),
    atsakymasRodymui: `${raide} — ${o.variantai[o.teisingas]}`,
    sprendimas: o.sprendimas,
    brezinys: o.brezinys,
    formatas: 'pasirinkimas',
    variantai: sumaisyta.map((v, i) => ({ raide: RAIDES[i], tekstas: v.tekstas })),
  }
}

// ── Porų susiejimas ─────────────────────────────────────────────────────────

/**
 * Susiejimo uždavinys.
 *
 * Kairė pusė numeruojama raidėmis ir lieka vietoje, dešinė sumaišoma ir
 * numeruojama skaičiais. Atsakymas — raidės su savo numeriais: „A2 B1 C3".
 */
export function poruUzdavinys(
  id: string,
  temaId: string,
  o: { klausimas: string; poros: Pora[]; sprendimas?: string; brezinys?: string },
): Uzdavinys {
  const sumaisyta = sumaisyk(o.poros.map((p, i) => ({ p, i })))
  const numeriai = new Map(sumaisyta.map((x, naujas) => [x.i, naujas + 1]))

  const atsakymas = o.poros.map((_, i) => `${RAIDES[i]}${numeriai.get(i)}`).join(' ')

  return {
    id,
    temaId,
    klausimas: o.klausimas,
    atsakymas: normalizuok(atsakymas),
    atsakymasRodymui: atsakymas,
    sprendimas: o.sprendimas,
    brezinys: o.brezinys,
    formatas: 'poros',
    // Kairė — pradine tvarka; dešinė — sumaišyta, tokia, kokią mato mokinys.
    poros: o.poros.map((p, i) => ({ kaire: p.kaire, desine: sumaisyta[i].p.desine })),
  }
}

// ── Eiliškumo nustatymas ────────────────────────────────────────────────────

/**
 * Rikiavimo uždavinys.
 *
 * `teisingaEile` — elementai jau teisinga tvarka. Mokiniui jie rodomi
 * sumaišyti ir sunumeruoti raidėmis; atsakymas — raidės teisinga eile.
 */
export function eiliskumoUzdavinys(
  id: string,
  temaId: string,
  o: { klausimas: string; teisingaEile: string[]; sprendimas?: string; brezinys?: string },
): Uzdavinys {
  const sumaisyta = sumaisyk(o.teisingaEile.map((t, i) => ({ t, i })))
  // Raidė kiekvienam elementui pagal jo vietą mokiniui rodomame sąraše.
  const raidePagalTvarka = new Map(sumaisyta.map((x, vieta) => [x.i, RAIDES[vieta]]))
  const atsakymas = o.teisingaEile.map((_, i) => raidePagalTvarka.get(i)).join(' ')

  return {
    id,
    temaId,
    klausimas: o.klausimas,
    atsakymas: normalizuok(atsakymas),
    atsakymasRodymui: atsakymas,
    sprendimas: o.sprendimas,
    brezinys: o.brezinys,
    formatas: 'eiliskumas',
    elementai: sumaisyta.map((x, vieta) => `${RAIDES[vieta]}) ${x.t}`),
  }
}

/** Ar uždavinys reikalauja daugiau nei įrašyti skaičių. */
export function arSudetingasFormatas(u: Uzdavinys): boolean {
  return u.formatas !== undefined && u.formatas !== 'ivedimas'
}
