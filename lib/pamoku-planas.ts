import type { PamokosTipas } from '@/lib/kainos'
import { arVyksta, pauzuoja, trukme, type Pamoka } from '@/lib/pamokos'

/**
 * Konkrečios pamokos konkrečiomis dienomis: pasikartojimai PLIUS žurnalas.
 *
 * KAM TO REIKIA. `arVyksta()` žino tik taisyklę („antradieniais 17:00“), bet ne
 * išimtis: šį antradienį pamoka perkelta į trečiadienį, kitą — atšaukta, o
 * penktadienį prieš kontrolinį yra papildoma. Išimtys gyvena žurnale, ir jei
 * jas taikytų kiekvienas vartotojas savaip, perkelta pamoka priminimą gautų
 * senu laiku, kalendoriuje liktų abiejose vietose, o vienkartinė — niekur.
 * Todėl ir priminimai, ir svetainės kalendorius, ir dienynas, ir CMS
 * kalendorius klausia čia.
 *
 * KAIP ŽURNALAS NURUNGIA PASIKARTOJIMĄ. Kiekvienas įrašas užima vieną
 * pasikartojimo VIETĄ — mokinys, data, laikas. Vieta yra `pradineData` ir
 * `pradinisLaikas`, jei pamoka perkelta, kitaip — tiesiog `data` ir `laikas`.
 * Radus įrašą toje vietoje, sprendžia jis: atšauktas — pamokos nėra, perkeltas
 * — ji vyksta ten, kur jis rodo, ne čia. Vieta be įrašo — pamoka pagal taisyklę.
 * Taip pat elgiasi Google kalendorius su pasikartojančio įvykio išimtimis.
 *
 * Įrašas, neužimantis jokios pasikartojimo vietos, yra vienkartinė pamoka ir
 * vyksta tiesiog todėl, kad jis yra.
 *
 * „AKTYVUS“ IR „PAUZĖ IKI“ GALIOJA IR ĮRAŠAMS. Kortelėje tėvams pažadėta:
 * nuėmus varnelę ar įrašius pauzę, priminimai nebeina. Iš kalendoriaus atidaryta
 * ateities pamoka jau turi įrašą — jei jis apeitų varnelę, pažadas tyliai
 * nustotų galioti. Papildomai pamokai per atostogas pauzę reikia sutrumpinti.
 * Grupinis įrašas, kurio grupės nėra tarp paduotų (neaktyvi), — taip pat.
 *
 * KĄ PADUOTI. Įrašus, kurių `data` ARBA `pradineData` patenka į `datos`, visus
 * aktyvius mokinius ir visas aktyvias grupes.
 *
 * Gryna funkcija — be bazės, tad ją tikrina `npm run patikra:pamokos`.
 */

type Id = number | string

/** Ryšio laukas ateina ir numeriu, ir dokumentu — priklauso nuo gylio. */
type Rysys = Id | { id: Id } | null | undefined

export type PlanoMokinys = {
  id: Id
  aktyvus?: boolean | null
  pauzeIki?: string | null
  pamokos?: Pamoka[] | null
}

export type PlanoGrupe = {
  id: Id
  aktyvi?: boolean | null
  pauzeIki?: string | null
  nariai?: Rysys[] | null
  pamokos?: Pamoka[] | null
}

export type PlanoIrasas = {
  id: Id
  mokinys?: Rysys
  grupe?: Rysys
  tipas?: string | null
  data: string
  laikas?: string | null
  trukmeMin?: number | null
  busena?: string | null
  pradineData?: string | null
  pradinisLaikas?: string | null
}

export type Planuota<M, G> = {
  mokinys: M
  dataISO: string
  laikas: string
  /** Minutėmis. */
  trukme: number
  tipas: PamokosTipas
  /** Tuščia, kai pamoka individuali arba grupė ištrinta. */
  grupe: G | null
  grupesId: string | null
  /** Žurnalo įrašas, jei pamoka jame jau yra. */
  irasas: PlanoIrasas | null
  /** Iš kur perkelta, jei perkelta. */
  perkeltaIs: { data: string; laikas: string } | null
}

export type PlanoNuostatos<M> = {
  /**
   * Ar taikyti „Pauzė iki“. Svetainės kalendorius jų netaiko: per atostogas
   * vaiko laikas lieka jo, ir svetimam jo siūlyti nereikia.
   */
  pauzes?: boolean
  /** Papildoma sąlyga mokiniui — pvz. priminimams reikia tėvų pašto. */
  tinka?: (mokinys: M, dataISO: string) => boolean
}

export const rysioId = (reiksme: Rysys): string | null => {
  if (reiksme == null) return null
  if (typeof reiksme === 'object') return reiksme.id == null ? null : String(reiksme.id)
  return String(reiksme)
}

const vieta = (mokinys: Id, dataISO: string, laikas: string) => `${mokinys}|${dataISO}|${laikas}`

/** Vieta pasikartojime, kurią įrašas užima. Perkeltam — pradinė. */
function irasoVieta(z: PlanoIrasas): string | null {
  const mokinys = rysioId(z.mokinys)
  const data = z.pradineData || z.data
  const laikas = z.pradineData ? z.pradinisLaikas : z.laikas
  if (mokinys == null || !data || !laikas) return null
  return vieta(mokinys, data, laikas)
}

export function suplanuok<M extends PlanoMokinys, G extends PlanoGrupe>(
  mokiniai: M[],
  grupes: G[],
  irasai: PlanoIrasas[],
  datos: string[],
  nuostatos: PlanoNuostatos<M> = {},
): Planuota<M, G>[] {
  const pauzes = nuostatos.pauzes !== false
  const tinka = nuostatos.tinka ?? (() => true)
  const mokiniaiPagalId = new Map(mokiniai.map((m) => [String(m.id), m]))
  const grupesPagalId = new Map(grupes.map((g) => [String(g.id), g]))
  const datuAibe = new Set(datos)

  /**
   * Toje pačioje vietoje gali gulėti du įrašai: pamoka atšaukta, o paskui tuo
   * pačiu laiku vis dėlto įrašyta iš naujo. Tada laimi neatšauktas — jis
   * naujesnis sprendimas.
   */
  const pagalVieta = new Map<string, PlanoIrasas>()
  for (const z of irasai) {
    const v = irasoVieta(z)
    if (!v) continue
    const esamas = pagalVieta.get(v)
    if (!esamas || esamas.busena === 'atsaukta') pagalVieta.set(v, z)
  }

  /**
   * RAKTAS `mokinys|data|laikas` neleidžia dviejų pamokų tam pačiam vaikui tuo
   * pačiu metu. Toks sutapimas įmanomas (vaikas dviejose grupėse arba turi ir
   * individualią, ir grupinę tuo pačiu laiku) ir be šito duotų DU laiškus bei
   * DVI eilutes sąskaitoje. Pirmas laimi, tad tvarka: žurnalas (aiškiai
   * įrašyta), individualios (paties vaiko laikas), grupinės.
   */
  const rezultatas = new Map<string, Planuota<M, G>>()
  const idek = (p: Planuota<M, G>) => {
    const raktas = vieta(p.mokinys.id, p.dataISO, p.laikas)
    if (!rezultatas.has(raktas)) rezultatas.set(raktas, p)
  }

  const ilsisi = (m: M, dataISO: string) =>
    m.aktyvus === false || (pauzes && pauzuoja(m.pauzeIki, dataISO)) || !tinka(m, dataISO)
  const grupeIlsisi = (g: G | undefined, dataISO: string) =>
    !g || g.aktyvi === false || (pauzes && pauzuoja(g.pauzeIki, dataISO))

  // 1. Žurnalas: vienkartinės, perkeltos ir jau sukurti pasikartojimų įrašai.
  for (const z of irasai) {
    if (z.busena === 'atsaukta' || !z.laikas || !datuAibe.has(z.data)) continue
    const mokinys = mokiniaiPagalId.get(rysioId(z.mokinys) ?? '')
    if (!mokinys || ilsisi(mokinys, z.data)) continue
    const grupesId = rysioId(z.grupe)
    const grupe = grupesId ? grupesPagalId.get(grupesId) : undefined
    if (z.tipas === 'grupine' && grupesId && grupeIlsisi(grupe, z.data)) continue
    idek({
      mokinys,
      dataISO: z.data,
      laikas: z.laikas,
      trukme: trukme({ trukmeMin: z.trukmeMin }),
      tipas: z.tipas === 'grupine' ? 'grupine' : 'individuali',
      grupe: grupe ?? null,
      grupesId,
      irasas: z,
      perkeltaIs:
        z.pradineData && z.pradinisLaikas ? { data: z.pradineData, laikas: z.pradinisLaikas } : null,
    })
  }

  /**
   * Pasikartojimo vieta, kurioje jau guli įrašas, praleidžiama: įrašas arba
   * jau pridėtas aukščiau, arba atšauktas, arba perkeltas kitur. Senesni
   * įrašai trukmės neturi — tada ją pasiima iš pamokos eilutės.
   */
  const isTaisykles = (
    mokinys: M,
    dataISO: string,
    pamoka: Pamoka,
    tipas: PamokosTipas,
    grupe: G | null,
  ) => {
    const v = vieta(mokinys.id, dataISO, pamoka.laikas!)
    if (pagalVieta.has(v)) {
      const esama = rezultatas.get(v)
      if (esama?.irasas && !esama.irasas.trukmeMin) esama.trukme = trukme(pamoka)
      return
    }
    idek({
      mokinys,
      dataISO,
      laikas: pamoka.laikas!,
      trukme: trukme(pamoka),
      tipas,
      grupe,
      grupesId: grupe ? String(grupe.id) : null,
      irasas: null,
      perkeltaIs: null,
    })
  }

  for (const dataISO of datos) {
    // 2. Individualios.
    for (const mokinys of mokiniai) {
      if (ilsisi(mokinys, dataISO)) continue
      for (const pamoka of mokinys.pamokos ?? []) {
        if (!pamoka.laikas || !arVyksta(pamoka, dataISO)) continue
        isTaisykles(mokinys, dataISO, pamoka, 'individuali', null)
      }
    }

    // 3. Grupinės — kiekvienam nariui atskirai, nes lankomumas ir priminimas pervaikis.
    for (const grupe of grupes) {
      if (grupeIlsisi(grupe, dataISO)) continue
      for (const pamoka of grupe.pamokos ?? []) {
        if (!pamoka.laikas || !arVyksta(pamoka, dataISO)) continue
        for (const narys of grupe.nariai ?? []) {
          const mokinys = mokiniaiPagalId.get(rysioId(narys) ?? '')
          if (!mokinys || ilsisi(mokinys, dataISO)) continue
          isTaisykles(mokinys, dataISO, pamoka, 'grupine', grupe)
        }
      }
    }
  }

  return [...rezultatas.values()].sort((a, b) =>
    `${a.dataISO} ${a.laikas}`.localeCompare(`${b.dataISO} ${b.laikas}`),
  )
}

/**
 * Žurnalo užklausos sąlyga: įrašai, kuriuos `suplanuok()` reikia matyti šioms
 * datoms — esantys jose IR perkelti iš jų.
 */
export function irasuSalyga(nuo: string, iki: string) {
  return {
    or: [
      { and: [{ data: { greater_than_equal: nuo } }, { data: { less_than_equal: iki } }] },
      {
        and: [
          { pradineData: { greater_than_equal: nuo } },
          { pradineData: { less_than_equal: iki } },
        ],
      },
    ],
  }
}

/** Žurnalo laukai, kurių reikia planui — užklausos `select`. */
export const PLANO_LAUKAI = {
  mokinys: true,
  grupe: true,
  tipas: true,
  data: true,
  laikas: true,
  trukmeMin: true,
  busena: true,
  pradineData: true,
  pradinisLaikas: true,
} as const
