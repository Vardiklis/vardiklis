import { atsitiktinis, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * 1 klasė, tema „Žingsnis į pirmąją klasę", potemė „Kur yra daiktas?".
 *
 * Potemės tikslas — nusakyti vieno daikto vietą kito daikto ar kelių daiktų
 * atžvilgiu. Tai vienintelis dalykas, kurį šis generatorius tikrina:
 *
 * - jokios sudėties, atimties, daugybos ar dalybos;
 * - daiktų skaičiavimas niekada nėra uždavinio tikslas;
 * - jokių figūrų savybių, kampų, koordinačių ar mastelio;
 * - kairė ir dešinė visada žiūrovo, o ne priešais stovinčio žmogaus, atžvilgiu;
 * - paveikslėlis niekada neminimas, jei kartu nepateikiamas brėžinys.
 *
 * Sunkumo lygiai atitinka užduoties profilį: 1 — lengvas (2–3 daiktai, vienas
 * vietos ryšys, vienas žingsnis), 2 — vidutinis (3–4 daiktai, 1–2 ryšiai),
 * 3 — sunkus (4–5 daiktai, 2–3 ryšiai). Daiktų niekada nebūna daugiau nei
 * penki, o sąlyga — ne ilgesnė nei trys sakiniai.
 *
 * Kiekvienas daiktas surašytas keturiais linksniais, nes lietuviški vietos
 * žodžiai valdo skirtingus linksnius: „nuo knygos" (kilm.), „po knyga"
 * (įnag.), „prieš knygą" (gal.). Be to sąlygos skambėtų kaip vertimas.
 */

const INK = 'var(--ink)'
const ORANGE = 'var(--orange)'
const LINE = 'var(--line)'
const MUTED = 'var(--muted)'

type Zodis = {
  /** Vardininkas: „knyga". */
  v: string
  /** Kilmininkas: „nuo knygos", „virš knygos", „tarp knygos ir ...". */
  k: string
  /** Galininkas: „prieš knygą". */
  g: string
  /** Įnagininkas: „po knyga". */
  i: string
}

/** Pirmokui pažįstami daiktai. Vienas žodis, kad tilptų į brėžinį. */
const DAIKTAI: readonly Zodis[] = [
  { v: 'obuolys', k: 'obuolio', g: 'obuolį', i: 'obuoliu' },
  { v: 'kamuolys', k: 'kamuolio', g: 'kamuolį', i: 'kamuoliu' },
  { v: 'knyga', k: 'knygos', g: 'knygą', i: 'knyga' },
  { v: 'pieštukas', k: 'pieštuko', g: 'pieštuką', i: 'pieštuku' },
  { v: 'puodelis', k: 'puodelio', g: 'puodelį', i: 'puodeliu' },
  { v: 'kepurė', k: 'kepurės', g: 'kepurę', i: 'kepure' },
  { v: 'lėlė', k: 'lėlės', g: 'lėlę', i: 'lėle' },
  { v: 'mašinėlė', k: 'mašinėlės', g: 'mašinėlę', i: 'mašinėle' },
  { v: 'gėlė', k: 'gėlės', g: 'gėlę', i: 'gėle' },
  { v: 'kriaušė', k: 'kriaušės', g: 'kriaušę', i: 'kriauše' },
  { v: 'žvakė', k: 'žvakės', g: 'žvakę', i: 'žvake' },
  { v: 'segtukas', k: 'segtuko', g: 'segtuką', i: 'segtuku' },
  { v: 'kastuvėlis', k: 'kastuvėlio', g: 'kastuvėlį', i: 'kastuvėliu' },
  { v: 'saldainis', k: 'saldainio', g: 'saldainį', i: 'saldainiu' },
  { v: 'pušis', k: 'pušies', g: 'pušį', i: 'pušimi' },
]

/** Vardai eilės uždaviniams. */
const VARDAI: readonly Zodis[] = [
  { v: 'Ugnė', k: 'Ugnės', g: 'Ugnę', i: 'Ugne' },
  { v: 'Matas', k: 'Mato', g: 'Matą', i: 'Matu' },
  { v: 'Rūta', k: 'Rūtos', g: 'Rūtą', i: 'Rūta' },
  { v: 'Jonas', k: 'Jono', g: 'Joną', i: 'Jonu' },
  { v: 'Elena', k: 'Elenos', g: 'Eleną', i: 'Elena' },
]

/**
 * Vietos žodis ir linksnis, kurio jis reikalauja. `nuo` reiškia, kad prieš
 * daiktą dar rašomas prielinksnis „nuo" („kairėje nuo knygos").
 */
type Vieta = { zodis: string; linksnis: 'k' | 'g' | 'i'; suNuo?: boolean }

const KAIREJE: Vieta = { zodis: 'kairėje', linksnis: 'k', suNuo: true }
const DESINEJE: Vieta = { zodis: 'dešinėje', linksnis: 'k', suNuo: true }
const VIRS: Vieta = { zodis: 'virš', linksnis: 'k' }
const PO: Vieta = { zodis: 'po', linksnis: 'i' }
const PRIES: Vieta = { zodis: 'prieš', linksnis: 'g' }
const UZ: Vieta = { zodis: 'už', linksnis: 'k' }

/** Priešingos vietos poros — jomis tikrinamas atvirkštinis ryšys. */
const PRIESINGI: readonly (readonly [Vieta, Vieta])[] = [
  [KAIREJE, DESINEJE],
  [VIRS, PO],
  [PRIES, UZ],
]

/** „kairėje nuo knygos", „po knyga", „prieš Rūtą". */
function frazė(vieta: Vieta, z: Zodis): string {
  const daiktas = z[vieta.linksnis]
  return vieta.suNuo ? `${vieta.zodis} nuo ${daiktas}` : `${vieta.zodis} ${daiktas}`
}

function didzioji(tekstas: string): string {
  return tekstas[0].toUpperCase() + tekstas.slice(1)
}

function svg(plotis: number, aukstis: number, turinys: string): string {
  return `<svg viewBox="0 0 ${plotis} ${aukstis}" width="${plotis}" height="${aukstis}" role="img" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto">${turinys}</svg>`
}

/** Vienas daiktas brėžinyje — dėžutė su užrašu. Paryškinta, jei apie ją klausiama. */
function dezute(x: number, y: number, tekstas: string, paryskinta = false): string {
  const p = 100
  const a = 40
  return (
    `<rect x="${x}" y="${y}" width="${p}" height="${a}" rx="8" fill="none" stroke="${
      paryskinta ? ORANGE : INK
    }" stroke-width="${paryskinta ? 2.5 : 1.5}"/>` +
    `<text x="${x + p / 2}" y="${y + a / 2 + 5}" font-size="14" text-anchor="middle" fill="${INK}">${tekstas}</text>`
  )
}

/** Daiktai viena eile iš kairės į dešinę. */
function eile(daiktai: readonly Zodis[], paryskintas?: Zodis): string {
  const tarpas = 12
  const plotis = daiktai.length * (100 + tarpas) + tarpas
  let turinys =
    `<text x="${tarpas}" y="16" font-size="11" fill="${MUTED}">kairė</text>` +
    `<text x="${plotis - tarpas}" y="16" font-size="11" text-anchor="end" fill="${MUTED}">dešinė</text>`
  daiktai.forEach((d, i) => {
    turinys += dezute(tarpas + i * (100 + tarpas), 26, d.v, d.v === paryskintas?.v)
  })
  return svg(plotis, 82, turinys)
}

/** Daiktai vienas ant kito — brėžinys uždaviniams su „virš" ir „po". */
function stulpelis(daiktai: readonly Zodis[], paryskintas?: Zodis): string {
  const tarpas = 10
  const aukstis = daiktai.length * (40 + tarpas) + tarpas
  let turinys = ''
  daiktai.forEach((d, i) => {
    turinys += dezute(16, tarpas + i * (40 + tarpas), d.v, d.v === paryskintas?.v)
  })
  return svg(132, aukstis, turinys)
}

/** Daiktai apskritimo viduje ir išorėje. */
function ratas(viduje: readonly Zodis[], isoreje: readonly Zodis[]): string {
  let turinys = `<circle cx="110" cy="82" r="68" fill="none" stroke="${LINE}" stroke-width="2"/>`
  const nuo = (n: number) => 82 - ((n - 1) * 22) / 2
  viduje.forEach((d, i) => {
    turinys += `<text x="110" y="${nuo(viduje.length) + i * 22 + 5}" font-size="14" text-anchor="middle" fill="${INK}">${d.v}</text>`
  })
  isoreje.forEach((d, i) => {
    turinys += `<text x="240" y="${nuo(isoreje.length) + i * 22 + 5}" font-size="14" text-anchor="middle" fill="${INK}">${d.v}</text>`
  })
  return svg(320, 164, turinys)
}

/** Keli skirtingi daiktai iš sąrašo. */
function parinkDaiktus(kiek: number): Zodis[] {
  const likę = [...DAIKTAI]
  const rez: Zodis[] = []
  for (let i = 0; i < kiek; i += 1) {
    rez.push(likę.splice(atsitiktinis(0, likę.length - 1), 1)[0])
  }
  return rez
}

/** Kiek daiktų leidžia sunkumo lygis. Niekada daugiau nei penki. */
function kiekDaiktu(lygis: Lygis): number {
  if (lygis === 1) return atsitiktinis(2, 3)
  if (lygis === 2) return atsitiktinis(3, 4)
  return atsitiktinis(4, 5)
}

const ATSARGINIAI = [
  {
    klausimas:
      'Iš kairės į dešinę stovi knyga, puodelis ir gėlė. Kuris daiktas yra tarp knygos ir gėlės?',
    atsakymas: 'puodelis',
    atsakymasRodymui: 'puodelis',
    sprendimas: 'Puodelis stovi viduryje — knyga jam iš kairės, gėlė iš dešinės.',
  },
  {
    klausimas:
      'Obuolys yra kairėje nuo kamuolio. Kur yra kamuolys obuolio atžvilgiu? Rašyk „kairėje" arba „dešinėje".',
    atsakymas: 'dešinėje',
    atsakymasRodymui: 'dešinėje',
    sprendimas: 'Šie žodžiai priešingi: jei vienas daiktas kairėje, tai kitas — dešinėje.',
  },
] as const

export const vieta: Generatorius = (lygis) => suBandymais(() => kurk(lygis), ATSARGINIAI, 'vieta')

function kurk(lygis: Lygis): Uzdavinys | null {
  const daiktai = parinkDaiktus(kiekDaiktu(lygis))

  const visos = [
    // 1. Įrašyti trūkstamą vietos žodį
    () => {
      if (daiktai.length < 2) return null
      const i = atsitiktinis(0, daiktai.length - 2)
      const kairysis = daiktai[i]
      const desinysis = daiktai[i + 1]
      const apieKairį = Math.random() < 0.5
      const kas = apieKairį ? kairysis : desinysis
      const kito = apieKairį ? desinysis : kairysis
      return uzdavinys('vieta', {
        klausimas: `Daiktai sustatyti iš kairės į dešinę. Įrašyk trūkstamą žodį: ${
          kas.v
        } yra ... nuo ${kito.k}. Rašyk „kairėje" arba „dešinėje".`,
        atsakymas: apieKairį ? 'kairėje' : 'dešinėje',
        atsakymasRodymui: apieKairį ? 'kairėje' : 'dešinėje',
        sprendimas: `Brėžinyje ${kairysis.v} yra kairiau, o ${desinysis.v} — dešiniau.`,
        brezinys: eile(daiktai, kas),
      })
    },

    // 2. Nustatyti daikto vietą kito atžvilgiu
    () => {
      if (daiktai.length < 2) return null
      const i = atsitiktinis(0, daiktai.length - 1)
      const j = i === 0 ? daiktai.length - 1 : 0
      const atsakymas = i < j ? 'kairėje' : 'dešinėje'
      return uzdavinys('vieta', {
        klausimas: `Pažiūrėk į brėžinį. Kur yra ${daiktai[i].v} ${
          daiktai[j].k
        } atžvilgiu? Rašyk „kairėje" arba „dešinėje".`,
        atsakymas,
        atsakymasRodymui: atsakymas,
        sprendimas: `Žiūrime iš kairės: ${daiktai[i].v} stovi ${
          i < j ? 'anksčiau' : 'vėliau'
        } nei ${daiktai[j].v}, tad jis yra ${atsakymas}.`,
        brezinys: eile(daiktai, daiktai[i]),
      })
    },

    // 3. Rasti daiktą pagal vietos aprašymą — „tarp"
    () => {
      if (daiktai.length < 3) return null
      const i = atsitiktinis(1, daiktai.length - 2)
      return uzdavinys('vieta', {
        klausimas: `Daiktai sustatyti iš kairės į dešinę. Kuris daiktas yra tarp ${
          daiktai[i - 1].k
        } ir ${daiktai[i + 1].k}?`,
        atsakymas: daiktai[i].v,
        atsakymasRodymui: daiktai[i].v,
        sprendimas: `Tarp ${daiktai[i - 1].k} ir ${daiktai[i + 1].k} stovi ${daiktai[i].v}.`,
        brezinys: eile(daiktai),
      })
    },

    // 4. Priešingas vietos ryšys
    () => {
      const [a, b] = parinkDaiktus(2)
      const pora = pasirink(PRIESINGI)
      const pirmas = Math.random() < 0.5
      const duota = pirmas ? pora[0] : pora[1]
      const atsakymas = pirmas ? pora[1] : pora[0]
      return uzdavinys('vieta', {
        klausimas: `${didzioji(a.v)} yra ${frazė(duota, b)}. Kur yra ${b.v} ${
          a.k
        } atžvilgiu? Rašyk vieną žodį.`,
        atsakymas: atsakymas.zodis,
        atsakymasRodymui: atsakymas.zodis,
        sprendimas: `Šie vietos žodžiai priešingi: jei vienas daiktas yra „${duota.zodis}", tai kitas — „${atsakymas.zodis}".`,
      })
    },

    // 5. Virš ir po
    () => {
      if (daiktai.length < 2) return null
      const i = atsitiktinis(0, daiktai.length - 2)
      const virsutinis = daiktai[i]
      const apatinis = daiktai[i + 1]
      const apieVirsutinį = Math.random() < 0.5
      return uzdavinys('vieta', {
        klausimas: apieVirsutinį
          ? `Daiktai sudėti vienas ant kito. Kur yra ${virsutinis.v} — virš ${apatinis.k} ar po ${apatinis.i}? Rašyk „virš" arba „po".`
          : `Daiktai sudėti vienas ant kito. Kur yra ${apatinis.v} — virš ${virsutinis.k} ar po ${virsutinis.i}? Rašyk „virš" arba „po".`,
        atsakymas: apieVirsutinį ? 'virš' : 'po',
        atsakymasRodymui: apieVirsutinį ? 'virš' : 'po',
        sprendimas: `Brėžinyje ${virsutinis.v} yra aukščiau, o ${apatinis.v} — žemiau.`,
        brezinys: stulpelis(daiktai, apieVirsutinį ? virsutinis : apatinis),
      })
    },

    // 6. Viduje ir išorėje
    () => {
      if (daiktai.length < 3) return null
      const riba = atsitiktinis(1, daiktai.length - 1)
      const viduje = daiktai.slice(0, riba)
      const isoreje = daiktai.slice(riba)
      const apieVidų = Math.random() < 0.5
      const ieskomas = apieVidų ? viduje[0] : isoreje[0]
      return uzdavinys('vieta', {
        klausimas: `Pažiūrėk į brėžinį. Kur yra ${ieskomas.v} — apskritimo viduje ar išorėje? Rašyk „viduje" arba „išorėje".`,
        atsakymas: apieVidų ? 'viduje' : 'išorėje',
        atsakymasRodymui: apieVidų ? 'viduje' : 'išorėje',
        sprendimas: `Apskritimo viduje nupiešta: ${viduje
          .map((d) => d.v)
          .join(', ')}. Išorėje: ${isoreje.map((d) => d.v).join(', ')}.`,
        brezinys: ratas(viduje, isoreje),
      })
    },

    // 7. Pasirinkti teisingą teiginį
    () => {
      if (daiktai.length < 2) return null
      const i = atsitiktinis(0, daiktai.length - 2)
      const teisingas = `${daiktai[i].v} yra kairėje nuo ${daiktai[i + 1].k}`
      const klaidingas = `${daiktai[i + 1].v} yra kairėje nuo ${daiktai[i].k}`
      const teisingasPirmas = Math.random() < 0.5
      return uzdavinys('vieta', {
        klausimas: `Daiktai sustatyti iš kairės į dešinę. Kuris teiginys teisingas? A: ${
          teisingasPirmas ? teisingas : klaidingas
        }. B: ${teisingasPirmas ? klaidingas : teisingas}. Rašyk „a" arba „b".`,
        atsakymas: teisingasPirmas ? 'a' : 'b',
        atsakymasRodymui: teisingasPirmas ? 'A' : 'B',
        sprendimas: `Brėžinyje ${daiktai[i].v} stovi kairiau nei ${
          daiktai[i + 1].v
        }, tad teisingas teiginys yra „${teisingas}".`,
        brezinys: eile(daiktai),
      })
    },

    // 8. Eilė: prieš ir už
    () => {
      if (lygis === 1) return null
      const vaikai = VARDAI.slice(0, Math.min(daiktai.length, VARDAI.length))
      if (vaikai.length < 3) return null
      const i = atsitiktinis(1, vaikai.length - 2)
      const apiePriesą = Math.random() < 0.5
      const atsakymas = apiePriesą ? vaikai[i - 1] : vaikai[i + 1]
      return uzdavinys('vieta', {
        klausimas: `Eilėje prie durų vaikai stovi tokia tvarka: ${vaikai
          .map((z) => z.v)
          .join(', ')}. Kas stovi ${
          apiePriesą ? `prieš ${vaikai[i].g}` : `už ${vaikai[i].k}`
        }?`,
        atsakymas: atsakymas.v.toLowerCase(),
        atsakymasRodymui: atsakymas.v,
        sprendimas: `Eilėje ${vaikai[i - 1].v} stovi prieš ${vaikai[i].g}, o ${
          vaikai[i + 1].v
        } — už ${vaikai[i].k}.`,
      })
    },

    // 9. Rasti daiktą pagal dvi sąlygas
    () => {
      if (lygis === 1) return null
      if (daiktai.length < 3) return null
      const i = atsitiktinis(1, daiktai.length - 2)
      return uzdavinys('vieta', {
        klausimas: `Daiktai sustatyti iš kairės į dešinę. Kuris daiktas yra dešinėje nuo ${
          daiktai[i - 1].k
        } ir kairėje nuo ${daiktai[i + 1].k}?`,
        atsakymas: daiktai[i].v,
        atsakymasRodymui: daiktai[i].v,
        sprendimas: `Abi sąlygas tenkina tik ${daiktai[i].v}: jis stovi iškart po ${
          daiktai[i - 1].k
        } ir prieš ${daiktai[i + 1].g}.`,
        brezinys: eile(daiktai),
      })
    },

    // 10. Pirmas arba paskutinis iš kairės
    () => {
      if (lygis === 1) return null
      const pirmas = Math.random() < 0.5
      const atsakymas = pirmas ? daiktai[0] : daiktai[daiktai.length - 1]
      return uzdavinys('vieta', {
        klausimas: `Daiktai sustatyti iš kairės į dešinę. Kuris daiktas yra ${
          pirmas ? 'pirmas' : 'paskutinis'
        } iš kairės?`,
        atsakymas: atsakymas.v,
        atsakymasRodymui: atsakymas.v,
        sprendimas: `Iš kairės į dešinę stovi: ${daiktai.map((d) => d.v).join(', ')}. ${
          pirmas ? 'Pirmasis' : 'Paskutinis'
        } yra ${atsakymas.v}.`,
        brezinys: eile(daiktai, atsakymas),
      })
    },

    // 11. Išdėstyti daiktus pagal nurodymus
    () => {
      if (lygis === 1) return null
      if (daiktai.length < 3) return null
      const [a, b, c] = daiktai
      return uzdavinys('vieta', {
        klausimas: `Ant lentynos reikia sudėti tris daiktus: ${a.v}, ${b.v} ir ${c.v}. ${didzioji(
          b.g,
        )} padėk viduryje, ${a.g} — kairėje nuo ${b.k}. Kuris daiktas lieka dešinėje?`,
        atsakymas: c.v,
        atsakymasRodymui: c.v,
        sprendimas: `Viduryje — ${b.v}, kairėje — ${a.v}, tad dešinėje lieka ${c.v}.`,
      })
    },

    // 12. Rasti klaidingą teiginį
    () => {
      if (lygis === 1) return null
      if (daiktai.length < 4) return null
      const teiginiai = [
        `${daiktai[0].v} yra kairėje nuo ${daiktai[1].k}`,
        `${daiktai[1].v} yra tarp ${daiktai[0].k} ir ${daiktai[2].k}`,
        `${daiktai[3].v} yra kairėje nuo ${daiktai[0].k}`, // klaidingas
      ]
      const tvarka = [0, 1, 2].sort(() => Math.random() - 0.5)
      const raides = ['a', 'b', 'c']
      const klaidingoVieta = tvarka.indexOf(2)
      return uzdavinys('vieta', {
        klausimas: `Daiktai sustatyti iš kairės į dešinę. Kuris teiginys klaidingas? ${tvarka
          .map((t, i) => `${raides[i].toUpperCase()}: ${teiginiai[t]}`)
          .join('. ')}. Rašyk raidę.`,
        atsakymas: raides[klaidingoVieta],
        atsakymasRodymui: raides[klaidingoVieta].toUpperCase(),
        sprendimas: `Brėžinyje ${daiktai[3].v} stovi dešiniau nei ${
          daiktai[0].v
        }, tad klaidingas yra teiginys „${teiginiai[2]}".`,
        brezinys: eile(daiktai),
      })
    },

    // 13. Du susiję vietos ryšiai
    () => {
      if (lygis === 1) return null
      if (daiktai.length < 4) return null
      const [a, b, c, d] = daiktai
      const dešiniausias = Math.random() < 0.5
      return uzdavinys('vieta', {
        klausimas: `${didzioji(a.v)} yra kairėje nuo ${b.k}. ${didzioji(
          c.v,
        )} yra dešinėje nuo ${b.k}, o ${d.v} — dešinėje nuo ${c.k}. Kuris daiktas yra pats ${
          dešiniausias ? 'dešiniausias' : 'kairiausias'
        }?`,
        atsakymas: dešiniausias ? d.v : a.v,
        atsakymasRodymui: dešiniausias ? d.v : a.v,
        sprendimas: `Iš kairės į dešinę gaunasi ${a.v}, ${b.v}, ${c.v}, ${d.v} — ${
          dešiniausias ? `dešiniausias yra ${d.v}` : `kairiausias yra ${a.v}`
        }.`,
      })
    },
  ]

  // Lengvesniam lygiui — tik pirmieji 7 pavidalai; sunkesniam visi.
  return variacija(lygis === 1 ? visos.slice(0, 7) : visos)
}
