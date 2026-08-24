import { generuokTemosRinkini, type Uzdavinys } from './generatoriai'
import { klasesTemos, tema, temos, type Tema } from './diagnostikos-temos'

/**
 * Adaptyvi diagnostika (8.2).
 *
 * Gryna logika — jokio React. Būsena nekintama: kiekviena funkcija grąžina
 * naują objektą, kad ją būtų galima laikyti `useState`.
 *
 * Uždaviniai imami iš tos pačios bibliotekos, kurią mokinys mato uždavinių
 * puslapyje: tikrinimo vienetas yra programos tema, o trys jos uždaviniai —
 * iš skirtingų tos temos potemių. Todėl testas niekada neparodo turinio, kurio
 * vaiko programoje nėra.
 */

const UZDAVINIU_TEMAI = 3
const REIKIA_TEISINGU = 2
/**
 * Kiek klasių leidžiama nusileisti nuo pradinės temos.
 *
 * Vienas žingsnis dabar yra visa klasė, tad devynių pakanka keliui nuo
 * dešimtos klasės iki pirmos. Anksčiau grafe buvo vienuolika stambių temų ir
 * keturių žingsnių užtekdavo; su programos temomis toks limitas nusileidimą
 * nutraukdavo dar prieš pasiekiant tikrąją priežastį.
 */
const MAKS_GYLIS = 9
/**
 * Testas visada duoda lygiai tiek uždavinių. Anksčiau skaičius buvo vertinamas
 * ir augdavo eigos metu (18 → 21 → 24), o tėvui tai atrodė kaip klaida.
 * Dabar jis fiksuotas: jei adaptyvi eilė išsemiama anksčiau, ji papildoma
 * dar nepatikrintomis temomis.
 */
const IS_VISO_UZDAVINIU = 25

/** Diagnostikoje visos temos tikrinamos vidutiniu lygiu — kitaip nepalyginama. */
const TIKRINIMO_LYGIS = 2

export type TemosRezultatas = 'islaikyta' | 'neislaikyta'

export type Busena = {
  klase: number
  /** Temų id, laukiančių tikrinimo. */
  eile: string[]
  /** Kaip giliai nuo pradinės temos nusileista. */
  gyliai: Record<string, number>
  rezultatai: Record<string, TemosRezultatas>
  dabartine: {
    temaId: string
    uzdaviniai: Uzdavinys[]
    indeksas: number
    teisingi: number
  } | null
  isVisoUzdaviniu: number
  baigta: boolean
}

/**
 * Pradinės temos — visos vaiko klasės temos programos tvarka.
 *
 * Anksčiau į pradžią būdavo dedama ir viena klasė žemiau, bet dabar vienetų
 * yra tiek pat, kiek programos temų, tad žemesnė klasė vis tiek nebūtų
 * pasiekta: ji pasiekiama tik leidžiantis nuo neišlaikytos temos, o būtent to
 * diagnostika ir ieško.
 */
function pradinesTemos(klase: number): string[] {
  const savos = klasesTemos(klase)
  if (savos.length > 0) return savos.map((t) => t.id)

  const zemesnes = temos.filter((t) => t.klase <= klase)
  if (zemesnes.length > 0) {
    const auksciausia = Math.max(...zemesnes.map((t) => t.klase))
    return zemesnes.filter((t) => t.klase === auksciausia).map((t) => t.id)
  }

  const zemiausia = Math.min(...temos.map((t) => t.klase))
  return temos.filter((t) => t.klase === zemiausia).map((t) => t.id)
}

/**
 * Papildo eilę dar nepatikrintomis temomis, artimiausiomis vaiko klasei.
 * Reikalinga tam, kad testas pasiektų fiksuotą uždavinių skaičių net tada,
 * kai adaptyvus nusileidimas baigiasi anksčiau.
 */
function papildykEile(b: Busena, eile: string[]): string[] {
  const jau = new Set([...eile, ...Object.keys(b.rezultatai)])
  const papildomos = temos
    .filter((t) => !jau.has(t.id))
    .sort((a, c) => Math.abs(a.klase - b.klase) - Math.abs(c.klase - b.klase))
    .map((t) => t.id)
  return [...eile, ...papildomos]
}

function uzkraukTema(b: Busena): Busena {
  let eile = [...b.eile]
  if (eile.every((id) => b.rezultatai[id])) eile = papildykEile(b, eile)

  while (eile.length > 0) {
    const temaId = eile.shift() as string
    if (b.rezultatai[temaId]) continue // temos netikrinam du kartus
    const t = tema(temaId)
    if (!t) continue

    return {
      ...b,
      eile,
      dabartine: {
        temaId,
        // Klasė imama temos, o ne vaiko: leidžiantis į trečios klasės daugybą
        // uždaviniai turi būti trečios klasės masto, nors testą laiko
        // septintokas. Sritis — temos riba iš programos.
        uzdaviniai: generuokTemosRinkini(
          t.generatoriai,
          TIKRINIMO_LYGIS,
          UZDAVINIU_TEMAI,
          t.klase,
          t.skaiciuSritis,
        ),
        indeksas: 0,
        teisingi: 0,
      },
    }
  }

  return { ...b, eile, dabartine: null, baigta: true }
}

export function pradek(klase: number): Busena {
  const pradines = pradinesTemos(klase)
  const gyliai: Record<string, number> = {}
  for (const id of pradines) gyliai[id] = 0

  return uzkraukTema({
    klase,
    eile: pradines,
    gyliai,
    rezultatai: {},
    dabartine: null,
    isVisoUzdaviniu: 0,
    baigta: false,
  })
}

export function dabartinisUzdavinys(b: Busena): Uzdavinys | null {
  if (!b.dabartine) return null
  return b.dabartine.uzdaviniai[b.dabartine.indeksas] ?? null
}

/** Užregistruoja atsakymą ir pastumia testą į priekį. */
export function atsakyk(b: Busena, teisinga: boolean): Busena {
  if (!b.dabartine || b.baigta) return b

  const teisingi = b.dabartine.teisingi + (teisinga ? 1 : 0)
  const indeksas = b.dabartine.indeksas + 1
  const isVisoUzdaviniu = b.isVisoUzdaviniu + 1

  // Riba pasiekta — testas baigiamas net vidury temos. Nebaigta tema tiesiog
  // negauna rezultato, nes trijų atsakymų reikalavimas neįvykdytas.
  if (isVisoUzdaviniu >= IS_VISO_UZDAVINIU && indeksas < UZDAVINIU_TEMAI) {
    return { ...b, isVisoUzdaviniu, dabartine: null, baigta: true }
  }

  // Tema dar nebaigta — rodom kitą jos uždavinį.
  if (indeksas < UZDAVINIU_TEMAI) {
    return {
      ...b,
      isVisoUzdaviniu,
      dabartine: { ...b.dabartine, indeksas, teisingi },
    }
  }

  const temaId = b.dabartine.temaId
  const islaikyta = teisingi >= REIKIA_TEISINGU
  const rezultatai: Record<string, TemosRezultatas> = {
    ...b.rezultatai,
    [temaId]: islaikyta ? 'islaikyta' : 'neislaikyta',
  }

  const eile = [...b.eile]
  const gyliai = { ...b.gyliai }

  // Neišlaikius temos, leidžiamės į jos prielaidas. Išlaikius — netikrinam,
  // nes prielaidos akivaizdžiai tvarkoje.
  //
  // Prielaida dedama į eilės PRADŽIĄ, o ne pabaigą. Eilėje laukia visos vaiko
  // klasės temos, tad į pabaigą įdėtos prielaidos nebūtų pasiektos per
  // dvidešimt penkis uždavinius — o būtent jų diagnostika ir ieško. Dabar,
  // temai nepavykus, iškart nusileidžiama prie jos priežasties ir tik paskui
  // grįžtama prie likusių klasės temų.
  if (!islaikyta) {
    const gylis = (b.gyliai[temaId] ?? 0) + 1
    if (gylis <= MAKS_GYLIS) {
      for (const prielaidaId of tema(temaId)?.priklausoNuo ?? []) {
        if (rezultatai[prielaidaId]) continue
        if (eile.includes(prielaidaId)) continue
        eile.unshift(prielaidaId)
        gyliai[prielaidaId] = Math.min(gyliai[prielaidaId] ?? gylis, gylis)
      }
    }
  }

  const kitas: Busena = {
    ...b,
    eile,
    gyliai,
    rezultatai,
    isVisoUzdaviniu,
    dabartine: null,
  }

  if (isVisoUzdaviniu >= IS_VISO_UZDAVINIU) {
    return { ...kitas, baigta: true }
  }

  return uzkraukTema(kitas)
}

/** Kiek uždavinių atlikta ir kiek jų bus iš viso. Antrasis skaičius fiksuotas. */
export function progresoSkaiciai(b: Busena): { atlikta: number; numatoma: number } {
  return { atlikta: b.isVisoUzdaviniu, numatoma: IS_VISO_UZDAVINIU }
}

/** Progresas 0..1. */
export function progresas(b: Busena): number {
  if (b.baigta) return 1
  const { atlikta, numatoma } = progresoSkaiciai(b)
  return Math.min(1, atlikta / Math.max(numatoma, 1))
}

// ---------------------------------------------------------------------------
// Ataskaita
// ---------------------------------------------------------------------------

export type GrandinesZingsnis = {
  tema: Tema
  rezultatas: TemosRezultatas | 'netikrinta'
  /** Ar tai šakninė spraga — vieta, nuo kurios pradedamas darbas. */
  saknis: boolean
}

export type Ataskaita = {
  klase: number
  /** Neišlaikytos temos, po kuriomis nieko sugedusio nebėra. */
  saknines: Tema[]
  neislaikytos: Tema[]
  islaikytos: Tema[]
  /** Temos, kurios grafe remiasi į rastas spragas. */
  blokuojamos: Tema[]
  /** Vertikali grandinė nuo simptomo iki šaknies. */
  grandine: GrandinesZingsnis[]
  savaites: number
  isVisoUzdaviniu: number
}

/** Visos temos, kurios tranzityviai remiasi į nurodytas. */
function priklausantys(saknuId: Set<string>): Tema[] {
  const rasta = new Set<string>()
  let augo = true

  while (augo) {
    augo = false
    for (const t of temos) {
      if (rasta.has(t.id) || saknuId.has(t.id)) continue
      const remiasi = t.priklausoNuo.some((p) => saknuId.has(p) || rasta.has(p))
      if (remiasi) {
        rasta.add(t.id)
        augo = true
      }
    }
  }

  return temos.filter((t) => rasta.has(t.id))
}

/**
 * Grandinė nuo simptomo iki šaknies: kelias neišlaikytomis temomis nuo
 * aukščiausios klasės iki šakninės spragos, o po ja — tvirtas pagrindas.
 */
function sudarykGrandine(
  b: Busena,
  saknis: Tema | null,
  neislaikytos: Tema[],
): GrandinesZingsnis[] {
  if (!saknis) return []

  // Kelias ieškomas atgal: nuo šaknies aukštyn per neišlaikytas temas.
  const kelias: Tema[] = [saknis]
  let dabartine = saknis

  for (;;) {
    const virsuje = neislaikytos.find(
      (t) => t.priklausoNuo.includes(dabartine.id) && !kelias.includes(t),
    )
    if (!virsuje) break
    kelias.unshift(virsuje)
    dabartine = virsuje
  }

  const zingsniai: GrandinesZingsnis[] = kelias.map((t) => ({
    tema: t,
    rezultatas: b.rezultatai[t.id] ?? 'netikrinta',
    saknis: t.id === saknis.id,
  }))

  // Po šaknimi — jos prielaidos, kurios pasirodė tvirtos.
  for (const prielaidaId of saknis.priklausoNuo) {
    const t = tema(prielaidaId)
    if (!t) continue
    zingsniai.push({
      tema: t,
      rezultatas: b.rezultatai[t.id] ?? 'netikrinta',
      saknis: false,
    })
  }

  return zingsniai
}

export function ataskaita(b: Busena): Ataskaita {
  const neislaikytos = temos.filter((t) => b.rezultatai[t.id] === 'neislaikyta')
  const islaikytos = temos.filter((t) => b.rezultatai[t.id] === 'islaikyta')

  // Šakninė spraga — neišlaikyta tema, po kuria nieko sugedusio nebėra.
  // Netikrintos prielaidos (pasiekus gylio ar uždavinių ribą) šaknies neatšaukia.
  const saknines = neislaikytos.filter(
    (t) => !t.priklausoNuo.some((p) => b.rezultatai[p] === 'neislaikyta'),
  )

  const pagrindine =
    [...saknines].sort((a, c) => a.klase - c.klase)[0] ?? null

  return {
    klase: b.klase,
    saknines,
    neislaikytos,
    islaikytos,
    // Rodomos tik tos temos, kurias vaikas jau turėtų mokėti. Grandinė kyla
    // iki dešimtos klasės, bet trečiokui pranešti, kad spraga blokuoja
    // trigonometriją, būtų daugiau gąsdinimas nei informacija.
    blokuojamos: priklausantys(new Set(saknines.map((t) => t.id))).filter(
      (t) => t.klase <= b.klase,
    ),
    grandine: sudarykGrandine(b, pagrindine, neislaikytos),
    // Specifikacijos 6.3 formulė: savaitės = spragų skaičius × 3.
    savaites: neislaikytos.length * 3,
    isVisoUzdaviniu: b.isVisoUzdaviniu,
  }
}
