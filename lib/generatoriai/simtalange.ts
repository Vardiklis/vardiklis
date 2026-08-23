import { derink } from '../lietuviu'
import { atsitiktinis, pasirink, sumaisyk } from '../matematika'
import { atsitiktinumas } from '../sekla'
import { suBandymais, uzdavinys, variacija } from './bendra'
import type { Generatorius, Lygis, Sritis, Uzdavinys } from './tipai'

/**
 * 1 klasė, tema „Skaičiai nuo 0 iki 100“ — trys potemės, kurios iki šiol
 * dalijosi vienu `skaiciu-palyginimas` generatoriumi ir todėl nė viena
 * negaudavo savo turinio:
 *
 *   `simtalange`       — „Kaip skaičiai išrikiuoti šimtalangėje?“
 *   `skaiciu-tiese`    — „Kaip skaičiai išrikiuoti skaičių tiesėje?“
 *   `gretimi-skaiciai` — „Kas yra gretimi skaičiai?“ (3 tema)
 *
 * Kiekvienas tikrina savo gebėjimą ir sąmoningai NEDARO to, ką daro kaimynai:
 *
 * - šimtalangė yra 10×10 lentelės sandara: dešinėn +1, žemyn +10, eilutės
 *   paskutinis skaičius — pilna dešimtis. Klausimai be nuorodos į eilutę,
 *   stulpelį ar langelį čia netinka — tai gretimų skaičių potemė;
 * - skaičių tiesė yra viena eilė su padalomis, ne tinklelis;
 * - gretimi skaičiai yra seka be jokios lentelės ir be jokios tiesės.
 *
 * Nė vienoje potemėje sudėtis ir atimtis nėra uždavinio tikslas — lentelė ir
 * tiesė čia yra tyrimo objektas, o ne skaičiavimo įrankis.
 */

const INK = 'var(--ink)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

const LANG = 32
const KRASTAS = 26

/** „1 langeliu“, „2 langeliais“, „10 langelių“. */
function langeliuZodis(n: number): string {
  return derink(n, { vns: 'langeliu', dgs: 'langeliais', kilm: 'langelių' })
}

/** Eilutė, kurioje stovi skaičius: 1–10 imtinai (47 → 5). */
function eilute(n: number): number {
  return Math.ceil(n / 10)
}

/** Stulpelis, kuriame stovi skaičius: 1–10 imtinai (47 → 7, 30 → 10). */
function stulpelis(n: number): number {
  return ((n - 1) % 10) + 1
}

/** Skaičius pagal eilutę ir stulpelį. */
function langelis(e: number, s: number): number {
  return (e - 1) * 10 + s
}

type Piesinys = {
  eiluteNuo: number
  eiluteIki: number
  stulpNuo?: number
  stulpIki?: number
  /** Apvesti oranžine — langelis, apie kurį klausiama. */
  pazymeti?: readonly number[]
  /** Rodomi tušti su klaustuku. */
  slepti?: readonly number[]
  /** Vietoj tikrojo skaičiaus įrašyta kita reikšmė — klaidos radimo užduotims. */
  pakeisti?: Readonly<Record<number, number>>
  /** Eilučių ir stulpelių numeriai paraštėse. */
  etiketes?: boolean
}

/**
 * Šimtalangė arba jos fragmentas.
 *
 * Piešiama pati lentelė, o ne jos aprašymas: potemė yra apie lentelės
 * sandarą, tad be brėžinio užduotis virstų atmintinai mokamos sekos
 * klausimu.
 */
function tinklas(o: Piesinys): string {
  const sNuo = o.stulpNuo ?? 1
  const sIki = o.stulpIki ?? 10
  const eiluciu = o.eiluteIki - o.eiluteNuo + 1
  const stulpeliu = sIki - sNuo + 1

  const krastas = o.etiketes ? KRASTAS : 8
  const plotis = stulpeliu * LANG + krastas + 8
  const aukstis = eiluciu * LANG + krastas + 8

  const x = (s: number) => krastas + (s - sNuo) * LANG
  const y = (e: number) => krastas + (e - o.eiluteNuo) * LANG

  let turinys = ''

  if (o.etiketes) {
    for (let s = sNuo; s <= sIki; s += 1) {
      turinys += `<text x="${x(s) + LANG / 2}" y="${krastas - 8}" font-size="10" fill="${MUTED}" text-anchor="middle">${s}</text>`
    }
    for (let e = o.eiluteNuo; e <= o.eiluteIki; e += 1) {
      turinys += `<text x="${krastas - 8}" y="${y(e) + LANG / 2 + 4}" font-size="10" fill="${MUTED}" text-anchor="end">${e}</text>`
    }
  }

  for (let e = o.eiluteNuo; e <= o.eiluteIki; e += 1) {
    for (let s = sNuo; s <= sIki; s += 1) {
      const n = langelis(e, s)
      const pazymetas = o.pazymeti?.includes(n) ?? false
      const paslėptas = o.slepti?.includes(n) ?? false
      const rodoma = o.pakeisti?.[n] ?? n

      // Pažymėtas langelis skiriamas storesne juoda linija, ne spalva —
      // spausdinant oranžinė virsta juoda ir žymė dingtų.
      turinys += `<rect x="${x(s)}" y="${y(e)}" width="${LANG}" height="${LANG}" fill="none" stroke="${
        pazymetas ? INK : LINE
      }" stroke-width="${pazymetas ? 2.5 : 1}"/>`

      turinys += `<text x="${x(s) + LANG / 2}" y="${y(e) + LANG / 2 + 4}" font-size="13" text-anchor="middle" fill="${
        paslėptas ? MUTED : INK
      }" font-weight="${pazymetas ? 600 : 400}">${paslėptas ? '?' : rodoma}</text>`
    }
  }

  return `<svg viewBox="0 0 ${plotis} ${aukstis}" width="${plotis}" height="${aukstis}" role="img" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto">${turinys}</svg>`
}

/** Atsitiktinis fragmento kairysis viršutinis langelis, kad fragmentas tilptų. */
function fragmentoPradzia(plotis: number, aukstis: number): { e: number; s: number } {
  return {
    e: atsitiktinis(1, 10 - aukstis + 1),
    s: atsitiktinis(1, 10 - plotis + 1),
  }
}

// ── Šimtalangė ──────────────────────────────────────────────────────────────

const A_SIMTALANGE = [
  {
    klausimas: 'Koks skaičius šimtalangėje yra 5 eilutėje ir 7 stulpelyje?',
    atsakymas: '47',
    atsakymasRodymui: '$47$',
    sprendimas: 'Penktoje eilutėje skaičiai nuo 41 iki 50, o septintas iš jų — 47.',
  },
] as const

export const simtalange: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkSimtalange(lygis, sritis ?? null), A_SIMTALANGE, 'simtalange')

function kurkSimtalange(lygis: Lygis, sritis: Sritis | null): Uzdavinys | null {
  // Šimtalangė yra 1–100; siauresnė sritis reikštų nepilną lentelę.
  if (sritis && (sritis.max < 100 || sritis.min > 1)) return null

  return variacija([
    // 1. Skaičius pagal eilutę ir stulpelį
    () => {
      const e = atsitiktinis(2, 10)
      const s = atsitiktinis(1, 10)
      const n = langelis(e, s)
      return uzdavinys('simtalange', {
        klausimas: `Koks skaičius šimtalangėje yra ${e} eilutėje ir ${s} stulpelyje?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `${e} eilutėje yra skaičiai nuo ${langelis(e, 1)} iki ${langelis(e, 10)}, o ${s} stulpelyje stovi ${n}.`,
        brezinys: tinklas({ eiluteNuo: 1, eiluteIki: 10, etiketes: true }),
      })
    },

    // 2. Eilutė, kurioje stovi skaičius
    () => {
      const n = atsitiktinis(11, 100)
      return uzdavinys('simtalange', {
        klausimas: `Kurioje šimtalangės eilutėje yra skaičius ${n}?`,
        atsakymas: String(eilute(n)),
        atsakymasRodymui: `$${eilute(n)}$`,
        sprendimas: `Kiekvienoje eilutėje po 10 skaičių, o ${n} patenka tarp ${langelis(eilute(n), 1)} ir ${langelis(eilute(n), 10)} — tai ${eilute(n)} eilutė.`,
        brezinys: tinklas({ eiluteNuo: 1, eiluteIki: 10, pazymeti: [n], etiketes: true }),
      })
    },

    // 3. Kaimyninis langelis nurodyta kryptimi
    () => {
      const kryptys = [
        { zodis: 'tiesiai po', poslinkis: 10, kaip: 'Einant eilute žemyn skaičius padidėja 10' },
        { zodis: 'tiesiai virš', poslinkis: -10, kaip: 'Einant eilute aukštyn skaičius sumažėja 10' },
        { zodis: 'iš dešinės nuo', poslinkis: 1, kaip: 'Einant langeliu dešinėn skaičius padidėja 1' },
        { zodis: 'iš kairės nuo', poslinkis: -1, kaip: 'Einant langeliu kairėn skaičius sumažėja 1' },
      ] as const
      const k = pasirink(kryptys)
      const n = atsitiktinis(12, 89)
      const rez = n + k.poslinkis
      if (rez < 1 || rez > 100) return null
      // Horizontalus žingsnis negali peršokti į kitą eilutę.
      if (Math.abs(k.poslinkis) === 1 && eilute(rez) !== eilute(n)) return null

      const e = eilute(n)
      return uzdavinys('simtalange', {
        klausimas: `Koks skaičius šimtalangėje yra ${k.zodis} ${n}?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `${k.kaip}, tad ${rez}.`,
        brezinys: tinklas({
          eiluteNuo: Math.max(1, e - 1),
          eiluteIki: Math.min(10, e + 1),
          pazymeti: [n],
          etiketes: true,
        }),
      })
    },

    // 4. Trūkstamas fragmento langelis
    () => {
      const plotis = atsitiktinis(3, 4)
      const aukstis = atsitiktinis(2, 3)
      const p = fragmentoPradzia(plotis, aukstis)
      const e = atsitiktinis(p.e, p.e + aukstis - 1)
      const s = atsitiktinis(p.s, p.s + plotis - 1)
      const n = langelis(e, s)

      return uzdavinys('simtalange', {
        klausimas: 'Šis langelis iškirptas iš šimtalangės. Koks skaičius turi būti vietoj klaustuko?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Kaimynas iš kairės yra ${n - 1}, o skaičius virš — ${n - 10}. Vadinasi, klaustuko vietoje ${n}.`,
        brezinys: tinklas({
          eiluteNuo: p.e,
          eiluteIki: p.e + aukstis - 1,
          stulpNuo: p.s,
          stulpIki: p.s + plotis - 1,
          slepti: [n],
        }),
      })
    },

    // 4b. Pilna šimtalangė su uždengtais langeliais
    () => {
      // Vadovėlyje kelis langelius uždengia paveikslėliai, o vaikas atkuria,
      // kokie skaičiai po jais slepiasi. Uždengiami keli, o klausiama apie
      // storesniu rėmeliu pažymėtą — taip uždavinys lieka vienareikšmis, bet
      // aplinkinių skaičių atrama nebėra visa.
      const uzdengti = new Set<number>()
      while (uzdengti.size < 5) uzdengti.add(atsitiktinis(12, 99))
      const visi = [...uzdengti]
      const n = visi[0]
      return uzdavinys('simtalange', {
        klausimas: 'Keli šimtalangės langeliai uždengti. Koks skaičius slepiasi pažymėtame langelyje?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Eilutėje skaičiai didėja po 1, stulpelyje — po 10. Pažymėtame langelyje turi būti ${n}.`,
        brezinys: tinklas({
          eiluteNuo: 1,
          eiluteIki: 10,
          slepti: visi,
          pazymeti: [n],
          etiketes: true,
        }),
      })
    },

    // 5. Eilutės pirmas arba paskutinis skaičius
    () => {
      const n = atsitiktinis(11, 100)
      const e = eilute(n)
      const pabaiga = atsitiktinumas() < 0.5
      const rez = pabaiga ? langelis(e, 10) : langelis(e, 1)
      if (rez === n) return null

      return uzdavinys('simtalange', {
        klausimas: `Kuris skaičius yra tos šimtalangės eilutės, kurioje stovi ${n}, ${
          pabaiga ? 'paskutinis' : 'pirmas'
        }?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: pabaiga
          ? `Kiekvienos eilutės paskutinis skaičius yra pilna dešimtis — čia ${rez}.`
          : `Kiekviena eilutė prasideda skaičiumi, kurio vienetų skaitmuo yra 1 — čia ${rez}.`,
        brezinys: tinklas({ eiluteNuo: e, eiluteIki: e, pazymeti: [n] }),
      })
    },

    // 6. Du susiję judesiai (vidutinis ir sunkus)
    () => {
      if (lygis === 1) return null
      const zemyn = atsitiktinis(1, 2)
      const desinen = atsitiktinis(1, 3)
      const n = atsitiktinis(1, 70)
      const rez = n + zemyn * 10 + desinen
      if (rez > 100) return null
      if (stulpelis(n) + desinen > 10) return null

      return uzdavinys('simtalange', {
        klausimas: `Žetonas stovi ant šimtalangės langelio ${n}. Jį pastumia ${zemyn} ${langeliuZodis(zemyn)} žemyn ir ${desinen} ${langeliuZodis(desinen)} dešinėn. Ant kokio skaičiaus jis atsidurs?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Žemyn — po 10: $${n} + ${zemyn * 10} = ${n + zemyn * 10}$. Dešinėn — po 1: $${n + zemyn * 10} + ${desinen} = ${rez}$.`,
        brezinys: tinklas({ eiluteNuo: 1, eiluteIki: 10, pazymeti: [n], etiketes: true }),
      })
    },

    // 7. Klaidingai įrašytas skaičius fragmente (sunkus)
    () => {
      if (lygis === 1) return null
      const plotis = 3
      const aukstis = 2
      const p = fragmentoPradzia(plotis, aukstis)
      const e = atsitiktinis(p.e, p.e + aukstis - 1)
      const s = atsitiktinis(p.s, p.s + plotis - 1)
      const n = langelis(e, s)
      // Tipinė klaida: einant žemyn pridedamas 1, o ne 10.
      const klaidinga = n + pasirink([9, 11, -9, -11] as const)
      if (klaidinga < 1 || klaidinga > 100) return null
      // Klaidinga reikšmė negali sutapti su kitu fragmento langeliu — antraip
      // fragmente atsirastų du vienodi skaičiai ir sąlyga taptų dviprasmiška.
      const fragmentas: number[] = []
      for (let e2 = p.e; e2 < p.e + aukstis; e2 += 1) {
        for (let s2 = p.s; s2 < p.s + plotis; s2 += 1) fragmentas.push(langelis(e2, s2))
      }
      if (fragmentas.includes(klaidinga)) return null

      return uzdavinys('simtalange', {
        klausimas:
          'Vienas skaičius šiame šimtalangės fragmente įrašytas klaidingai. Kuris skaičius ten turi būti?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Įrašyta ${klaidinga}, bet kaimynas iš kairės yra ${n - 1}, o skaičius virš — ${n - 10}. Tame langelyje turi būti ${n}.`,
        brezinys: tinklas({
          eiluteNuo: p.e,
          eiluteIki: p.e + aukstis - 1,
          stulpNuo: p.s,
          stulpIki: p.s + plotis - 1,
          pakeisti: { [n]: klaidinga },
        }),
      })
    },
  ])
}

// ── Skaičių tiesė ───────────────────────────────────────────────────────────

const A_TIESE = [
  {
    klausimas: 'Koks skaičius pažymėtas skaičių tiesėje?',
    atsakymas: '30',
    atsakymasRodymui: '$30$',
    sprendimas: 'Taškas stovi ties trečiąja padala po 10, tai yra ties 30.',
  },
] as const

export const skaiciuTiese: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkTiese(lygis, sritis ?? null), A_TIESE, 'skaiciu-tiese')

/**
 * Skaičių tiesė su padalomis.
 *
 * Tiesė visada prasideda apvaliu skaičiumi ir turi vienodas padalas — kitaip
 * uždavinys virstų padalos vertės skaičiavimu, o tai jau kita potemė.
 */
type Zyme = { reiksme: number; etikete: string }

function tiesesSvg(nuo: number, iki: number, zingsnis: number, zymes: readonly Zyme[] = []): string {
  const padalu = (iki - nuo) / zingsnis
  const tarpas = Math.min(52, Math.max(30, Math.round(520 / padalu)))
  const krastas = 26
  const plotis = padalu * tarpas + krastas * 2
  const aukstis = 62
  const asis = 30
  const x = (v: number) => krastas + ((v - nuo) / zingsnis) * tarpas

  let turinys = `<line x1="${krastas - 12}" y1="${asis}" x2="${plotis - krastas + 12}" y2="${asis}" stroke="${INK}" stroke-width="1.5"/>`
  turinys += `<path d="M${plotis - krastas + 12} ${asis} l-7 -4 v8 z" fill="${INK}"/>`

  for (let v = nuo; v <= iki; v += zingsnis) {
    turinys += `<line x1="${x(v)}" y1="${asis - 6}" x2="${x(v)}" y2="${asis + 6}" stroke="${INK}" stroke-width="1.5"/>`
    turinys += `<text x="${x(v)}" y="${asis + 22}" font-size="11" fill="${MUTED}" text-anchor="middle">${v}</text>`
  }

  for (const z of zymes) {
    turinys += `<circle cx="${x(z.reiksme)}" cy="${asis}" r="5.5" fill="${INK}"/>`
    turinys += `<text x="${x(z.reiksme)}" y="${asis - 13}" font-size="13" font-weight="600" fill="${INK}" text-anchor="middle">${z.etikete}</text>`
  }

  return `<svg viewBox="0 0 ${plotis} ${aukstis}" width="${plotis}" height="${aukstis}" role="img" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto">${turinys}</svg>`
}

function kurkTiese(lygis: Lygis, sritis: Sritis | null): Uzdavinys | null {
  const max = sritis ? Math.min(sritis.max, 100) : 100
  const zingsnis = max <= 20 ? 2 : 10
  const galas = Math.floor(max / zingsnis) * zingsnis
  if (galas < zingsnis * 4) return null

  return variacija([
    // 1. Koks skaičius pažymėtas
    () => {
      const n = atsitiktinis(1, galas / zingsnis - 1) * zingsnis
      return uzdavinys('skaiciu-tiese', {
        klausimas: 'Koks skaičius pažymėtas skaičių tiesėje?',
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Nuo 0 iki taško yra ${n / zingsnis} ${derink(n / zingsnis, { vns: 'padala', dgs: 'padalos', kilm: 'padalų' })} po ${zingsnis}, tad tai ${n}.`,
        brezinys: tiesesSvg(0, galas, zingsnis, [{ reiksme: n, etikete: '?' }]),
      })
    },

    // 2. Judesys padalomis
    () => {
      const zingsniu = atsitiktinis(2, 4)
      const kairen = atsitiktinumas() < 0.4
      const n = atsitiktinis(kairen ? zingsniu : 1, galas / zingsnis - (kairen ? 1 : zingsniu)) * zingsnis
      const rez = kairen ? n - zingsniu * zingsnis : n + zingsniu * zingsnis
      if (rez < 0 || rez > galas) return null

      return uzdavinys('skaiciu-tiese', {
        klausimas: `Skaičių tiesėje nuo ${n} pajudėk ${zingsniu} ${derink(zingsniu, { vns: 'padala', dgs: 'padalomis', kilm: 'padalų' })} į ${
          kairen ? 'kairę' : 'dešinę'
        }. Prie kokio skaičiaus atsidursi?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Viena padala — ${zingsnis}, tad ${zingsniu} ${derink(zingsniu, { vns: 'padala', dgs: 'padalos', kilm: 'padalų' })} yra ${zingsniu * zingsnis}. Gauname ${rez}.`,
        brezinys: tiesesSvg(0, galas, zingsnis, [{ reiksme: n, etikete: String(n) }]),
      })
    },

    // 3. Tarp kurių padalų stovi skaičius
    () => {
      const n = atsitiktinis(1, galas - 1)
      if (n % zingsnis === 0) return null
      const kaire = Math.floor(n / zingsnis) * zingsnis
      const desine = kaire + zingsnis
      const arciau = n - kaire < desine - n ? kaire : desine
      if (n - kaire === desine - n) return null

      return uzdavinys('skaiciu-tiese', {
        klausimas: `Skaičių tiesėje pažymėtos padalos po ${zingsnis}. Prie kurios padalos — ${kaire} ar ${desine} — skaičius ${n} yra arčiau?`,
        atsakymas: String(arciau),
        atsakymasRodymui: `$${arciau}$`,
        sprendimas: `Iki ${kaire} yra ${n - kaire}, iki ${desine} — ${desine - n}. Arčiau ${arciau}.`,
        brezinys: tiesesSvg(0, galas, zingsnis, [{ reiksme: n, etikete: String(n) }]),
      })
    },

    // 4. Kuris iš dviejų yra kairiau (vidutinis ir sunkus)
    () => {
      if (lygis === 1) return null
      const [a, b] = sumaisyk([atsitiktinis(1, galas), atsitiktinis(1, galas)])
      if (a === b) return null
      const kairiau = Math.min(a, b)
      return uzdavinys('skaiciu-tiese', {
        klausimas: `Skaičių tiesėje pažymėti ${a} ir ${b}. Kuris iš jų yra kairiau?`,
        atsakymas: String(kairiau),
        atsakymasRodymui: `$${kairiau}$`,
        sprendimas: `Skaičių tiesėje kairiau stovi mažesnis skaičius — ${kairiau}.`,
        brezinys: tiesesSvg(0, galas, zingsnis, [
          { reiksme: a, etikete: String(a) },
          { reiksme: b, etikete: String(b) },
        ]),
      })
    },

    // 5. Padalos vertė iš tiesės (sunkus)
    () => {
      if (lygis === 1) return null
      const padalu = galas / zingsnis
      return uzdavinys('skaiciu-tiese', {
        klausimas: `Skaičių tiesė nuo 0 iki ${galas} padalyta į ${padalu} ${derink(padalu, { vns: 'vienodą dalį', dgs: 'vienodas dalis', kilm: 'vienodų dalių' })}. Kiek vienetų yra vienoje padaloje?`,
        atsakymas: String(zingsnis),
        atsakymasRodymui: `$${zingsnis}$`,
        sprendimas: `$${galas} : ${padalu} = ${zingsnis}$.`,
        brezinys: tiesesSvg(0, galas, zingsnis),
      })
    },
  ])
}

// ── Gretimi skaičiai ────────────────────────────────────────────────────────

const A_GRETIMI = [
  {
    klausimas: 'Koks skaičius eina prieš pat 18?',
    atsakymas: '17',
    atsakymasRodymui: '$17$',
    sprendimas: 'Prieš 18 eina vienetu mažesnis skaičius: 17.',
  },
] as const

export const gretimiSkaiciai: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkGretimus(lygis, sritis ?? null), A_GRETIMI, 'gretimi-skaiciai')

/**
 * Gretimi skaičiai — seka be lentelės ir be tiesės.
 *
 * Būtent šis pavidalas anksčiau būdavo generuojamas vietoj šimtalangės, nes
 * jis dažnesnis; dabar jis turi savo potemę ir savo ribas.
 */
function kurkGretimus(lygis: Lygis, sritis: Sritis | null): Uzdavinys | null {
  const min = Math.max(1, sritis?.min ?? 1)
  const max = sritis?.max ?? 100
  if (max - min < 6) return null
  const n = () => atsitiktinis(min + 1, max - 1)

  return variacija([
    // 1. Prieš pat
    () => {
      const x = n()
      return uzdavinys('gretimi-skaiciai', {
        klausimas: `Koks skaičius eina prieš pat ${x}?`,
        atsakymas: String(x - 1),
        atsakymasRodymui: `$${x - 1}$`,
        sprendimas: `Prieš ${x} eina vienetu mažesnis skaičius: ${x - 1}.`,
      })
    },

    // 2. Tuoj po
    () => {
      const x = n()
      return uzdavinys('gretimi-skaiciai', {
        klausimas: `Koks skaičius eina tuoj po ${x}?`,
        atsakymas: String(x + 1),
        atsakymasRodymui: `$${x + 1}$`,
        sprendimas: `Po ${x} eina vienetu didesnis skaičius: ${x + 1}.`,
      })
    },

    // 3. Skaičius tarp dviejų
    () => {
      const x = n()
      if (x - 1 < min || x + 1 > max) return null
      return uzdavinys('gretimi-skaiciai', {
        klausimas: `Koks skaičius yra tarp ${x - 1} ir ${x + 1}?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Tarp ${x - 1} ir ${x + 1} yra vienintelis skaičius — ${x}.`,
      })
    },

    // 4. Trūkstamas sekos narys
    () => {
      const x = atsitiktinis(min + 2, max - 2)
      return uzdavinys('gretimi-skaiciai', {
        klausimas: `Įrašyk trūkstamą skaičių: ${x - 2}, ${x - 1}, $\\square$, ${x + 1}.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Skaičiai eina iš eilės po vieną, tad trūksta ${x}.`,
      })
    },

    // 5. Skaičius pagal abu kaimynus (vidutinis ir sunkus)
    () => {
      if (lygis === 1) return null
      const x = atsitiktinis(min + 2, max - 2)
      return uzdavinys('gretimi-skaiciai', {
        klausimas: `Skaičiaus kaimynai yra ${x - 1} ir ${x + 1}. Koks tas skaičius?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Skaičius stovi tarp savo kaimynų, tad tai ${x}.`,
      })
    },

    // 6. Klaidos radimas (sunkus)
    () => {
      if (lygis === 1) return null
      const x = atsitiktinis(min + 3, max - 3)
      const klaida = x + 2
      return uzdavinys('gretimi-skaiciai', {
        klausimas: `Eilutėje ${x - 1}, ${x}, ${klaida}, ${x + 2} vienas skaičius netinka. Koks skaičius turi būti jo vietoje?`,
        atsakymas: String(x + 1),
        atsakymasRodymui: `$${x + 1}$`,
        sprendimas: `Skaičiai turi eiti iš eilės, tad po ${x} eina ${x + 1}, o ne ${klaida}.`,
      })
    },
  ])
}
