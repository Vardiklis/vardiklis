import { generuokRinkini, type Uzdavinys } from './generatoriai'
import { temos, type Tema } from './temos'

/**
 * Adaptyvi diagnostika (8.2).
 *
 * Gryna logika — jokio React. Būsena nekintama: kiekviena funkcija grąžina
 * naują objektą, kad ją būtų galima laikyti `useState`.
 */

const UZDAVINIU_TEMAI = 3
const REIKIA_TEISINGU = 2
const MAKS_GYLIS = 4
const MAKS_UZDAVINIU = 24

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

function tema(id: string): Tema | undefined {
  return temos.find((t) => t.id === id)
}

/**
 * Pradinės temos — vaiko klasės ir vienos klasės anksčiau.
 * Jei tokių nėra (grafas prasideda nuo 3 klasės), imamos žemiausios turimos.
 */
function pradinesTemos(klase: number): string[] {
  const savos = temos.filter((t) => t.klase === klase || t.klase === klase - 1)
  if (savos.length > 0) {
    return [...savos].sort((a, b) => b.klase - a.klase).map((t) => t.id)
  }

  const zemesnes = temos.filter((t) => t.klase <= klase)
  if (zemesnes.length > 0) {
    const auksciausia = Math.max(...zemesnes.map((t) => t.klase))
    return zemesnes.filter((t) => t.klase === auksciausia).map((t) => t.id)
  }

  const zemiausia = Math.min(...temos.map((t) => t.klase))
  return temos.filter((t) => t.klase === zemiausia).map((t) => t.id)
}

function uzkraukTema(b: Busena): Busena {
  const eile = [...b.eile]

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
        uzdaviniai: generuokRinkini(t.generatorius, TIKRINIMO_LYGIS, UZDAVINIU_TEMAI),
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
  if (!islaikyta) {
    const gylis = (b.gyliai[temaId] ?? 0) + 1
    if (gylis <= MAKS_GYLIS) {
      for (const prielaidaId of tema(temaId)?.priklausoNuo ?? []) {
        if (rezultatai[prielaidaId]) continue
        if (eile.includes(prielaidaId)) continue
        eile.push(prielaidaId)
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

  // Riba tikrinama tik baigus temą — pusiau ištirta tema ataskaitai netinka.
  if (isVisoUzdaviniu >= MAKS_UZDAVINIU) {
    return { ...kitas, baigta: true }
  }

  return uzkraukTema(kitas)
}

/** Progresas 0..1. Bendras uždavinių skaičius iš anksto nežinomas, tad vertinamas. */
export function progresas(b: Busena): number {
  if (b.baigta) return 1
  const laukia = b.eile.filter((id) => !b.rezultatai[id]).length
  const numatoma = Math.min(
    MAKS_UZDAVINIU,
    (Object.keys(b.rezultatai).length + laukia + (b.dabartine ? 1 : 0)) * UZDAVINIU_TEMAI,
  )
  return Math.min(1, b.isVisoUzdaviniu / Math.max(numatoma, 1))
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
    blokuojamos: priklausantys(new Set(saknines.map((t) => t.id))),
    grandine: sudarykGrandine(b, pagrindine, neislaikytos),
    // Specifikacijos 6.3 formulė: savaitės = spragų skaičius × 3.
    savaites: neislaikytos.length * 3,
    isVisoUzdaviniu: b.isVisoUzdaviniu,
  }
}
