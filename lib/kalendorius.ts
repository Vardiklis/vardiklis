import { getPayload } from 'payload'
import config from '@payload-config'
import {
  arLaikas,
  dalys,
  data as dataVilniuje,
  dataZodziais,
  MENESIAI,
  pridekDienas,
  savaitesDiena,
} from '@/lib/laikas'
import { pauzuoja, type Pamoka } from '@/lib/pamokos'
import {
  irasuSalyga,
  PLANO_LAUKAI,
  rysioId,
  suplanuok,
  type Planuota,
  type PlanoIrasas,
} from '@/lib/pamoku-planas'

/**
 * CMS kalendorius (`/admin/kalendorius`): savaitė su visomis pamokomis.
 *
 * NIEKO NESKAIČIUOJA SAVAIP. Pamokos imamos iš `suplanuok()` — tos pačios
 * funkcijos, pagal kurią išeina priminimai ir dažomas svetainės kalendorius.
 * Kalendoriuje matoma pamoka yra būtent ta, apie kurią tėvai gaus laišką.
 *
 * ĮRAŠAI KURIAMI TIK PRIREIKUS. Pasikartojanti pamoka žurnale atsiranda
 * priminimo dieną, tad kitos savaitės pamokos įrašo dar neturi. Paspaudus ją
 * (ar nutempus), įrašas sukuriamas tą pačią akimirką — lygiai toks, kokį vėliau
 * būtų sukūręs priminimas, tad šis jį ras ir antro nebekurs. Kainos jame dar
 * nėra: ji fiksuojama siunčiant priminimą, kaip ir visada.
 *
 * GRUPINĖ PAMOKA — VIENAS LANGELIS. Žurnale ji guli po įrašą kiekvienam vaikui,
 * bet kalendoriuje tai vienas įvykis, ir perkeliama ji visa. Todėl prieš
 * perkeliant įrašai sukuriami IŠKART VISIEMS nariams: perkėlimas pasiekia tik
 * tuos, kurie jau turi įrašą (`cms/Zurnalas.ts`, `afterChange`).
 */

type Mokinys = {
  id: number
  vardas?: string | null
  klase?: string | null
  aktyvus?: boolean | null
  pauzeIki?: string | null
  pamokos?: Pamoka[] | null
}

type Grupe = {
  id: number
  pavadinimas?: string | null
  aktyvi?: boolean | null
  nariai?: (number | string)[] | null
  pauzeIki?: string | null
  pamokos?: Pamoka[] | null
}

type Rezervacija = {
  id: number
  data: string
  laikas: string
  vaikoVardas?: string | null
  klase?: string | null
  busena?: string | null
}

/** Kur pamoka yra dabar — pagal tai ją atpažįsta veiksmai. */
export type Vieta = {
  data: string
  laikas: string
  /** Individualiai pamokai. */
  mokinys: string | null
  /** Grupinei — visa grupė. */
  grupe: string | null
}

export type Ivykis = {
  raktas: string
  dataISO: string
  laikas: string
  /** Minutės nuo vidurnakčio. */
  pradzia: number
  trukme: number
  rusis: 'individuali' | 'grupine' | 'rezervacija'
  pavadinimas: string
  smulkiai: string | null
  busena: string
  /** `An 11-03 17:00`, jei perkelta. */
  perkeltaIs: string | null
  /** Įrašo adresas CMS'e; tuščia — pamoka kol kas tik tvarkaraštyje. */
  nuoroda: string | null
  irasoId: string | null
  /** Tuščia — pamokos tvarkaraštyje nėra (atšaukta, rezervacija). */
  vieta: Vieta | null
  /** Persidengiantys įvykiai stovi greta: kelintas ir iš kelių. */
  stulpelis: number
  stulpeliu: number
}

export type KalendoriausDiena = {
  data: string
  trumpas: string
  diena: number
  siandien: boolean
}

export type Pasirinkimas = { reiksme: string; pavadinimas: string }

export type KalendoriausSavaite = {
  pirmadienis: string
  etikete: string
  ankstesne: string
  kita: string
  dienos: KalendoriausDiena[]
  ivykiai: Ivykis[]
  /** Tinklelio ribos minutėmis nuo vidurnakčio. */
  nuo: number
  iki: number
  /** Raudonai linijai. Tuščia, jei šiandiena ne šioje savaitėje. */
  dabar: { data: string; min: number } | null
  /** Kam galima įrašyti papildomą pamoką: `m:<id>` arba `g:<id>`. */
  kam: Pasirinkimas[]
}

const TRUMPINIAI = ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk']

/** Rezervacija — bandomoji pamoka, tad tiek pat, kiek ir svetainės kalendoriuje. */
const REZERVACIJOS_MIN = 60

/** Tinklelis rodo bent šias valandas, net jei pamokų jose nėra. */
const NUO_MIN = 10 * 60
const IKI_MIN = 22 * 60

const DATOS_FORMATAS = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

export const arData = (reiksme: unknown): reiksme is string =>
  typeof reiksme === 'string' && DATOS_FORMATAS.test(reiksme)

export const savaitesPirmadienis = (dataISO: string): string =>
  pridekDienas(dataISO, -(savaitesDiena(dataISO) - 1))

/** `Jonas pauzėje iki 2026-11-30.` — kodėl pamokos tą dieną negali būti. */
function pauzesKlaida(kas: string, pauzeIki: string | null | undefined, dataISO: string): string | null {
  if (!pauzuoja(pauzeIki, dataISO)) return null
  return `${kas} pauzėje iki ${dataVilniuje(new Date(pauzeIki!))} — tą dieną nei priminimo, nei pamokos kalendoriuje nebūtų. Pirma sutrumpinkite pauzę kortelėje.`
}

const minutes = (laikas: string): number => {
  const [v, m] = laikas.split(':').map(Number)
  return v * 60 + m
}

/** `An 11-03 17:00` */
const trumpai = (dataISO: string, laikas: string): string =>
  `${TRUMPINIAI[savaitesDiena(dataISO) - 1]} ${dataISO.slice(5)} ${laikas}`

/** `2026 m. lapkričio 2–8 d.` arba `2026 m. spalio 26 d. – lapkričio 1 d.` */
function etikete(pirmadienis: string): string {
  const sekmadienis = pridekDienas(pirmadienis, 6)
  const [metai, m1, d1] = pirmadienis.split('-').map(Number)
  const [, m2, d2] = sekmadienis.split('-').map(Number)
  if (m1 === m2) return `${metai} m. ${MENESIAI[m1 - 1]} ${d1}–${d2} d.`
  return `${metai} m. ${MENESIAI[m1 - 1]} ${d1} d. – ${MENESIAI[m2 - 1]} ${d2} d.`
}

/** Aktyvūs mokiniai, aktyvios grupės ir žurnalas datoms — viskas, ko reikia `suplanuok()`. */
async function surink(nuo: string, iki: string) {
  const payload = await getPayload({ config })

  const [{ docs: irasuDokai }, { docs: mokiniuDokai }, { docs: grupiuDokai }] = await Promise.all([
    payload.find({
      collection: 'zurnalas',
      where: irasuSalyga(nuo, iki),
      limit: 2000,
      depth: 0,
      overrideAccess: true,
      select: PLANO_LAUKAI,
    }),
    payload.find({
      collection: 'mokiniai',
      where: { aktyvus: { equals: true } },
      limit: 1000,
      depth: 0,
      overrideAccess: true,
      select: { vardas: true, klase: true, aktyvus: true, pauzeIki: true, pamokos: true },
    }),
    payload.find({
      collection: 'grupes',
      where: { aktyvi: { equals: true } },
      limit: 500,
      depth: 0,
      overrideAccess: true,
      select: { pavadinimas: true, aktyvi: true, nariai: true, pauzeIki: true, pamokos: true },
    }),
  ])
  const irasai = irasuDokai as unknown as PlanoIrasas[]

  return {
    payload,
    irasai,
    mokiniai: mokiniuDokai as unknown as Mokinys[],
    grupes: grupiuDokai as unknown as Grupe[],
  }
}

/**
 * Grupės būsena iš narių būsenų. Narys be įrašo — „suplanuota“.
 * „Neįvyko“ tik tada, kai neįvyko VISIEMS: vienas praleidęs grupės neatšaukia.
 */
function bendraBusena(busenos: (string | null | undefined)[], nariu: number): string {
  if (busenos.includes('ivyko')) return 'ivyko'
  if (busenos.includes('atidare')) return 'atidare'
  if (busenos.length === nariu && busenos.every((b) => b === 'neivyko')) return 'neivyko'
  return 'suplanuota'
}

type BeVietos = Omit<Ivykis, 'stulpelis' | 'stulpeliu'>

function pamokosIvykis(raktas: string, nariai: Planuota<Mokinys, Grupe>[]): BeVietos {
  const pirma = nariai[0]
  const grupesId = pirma.tipas === 'grupine' ? pirma.grupesId : null
  const irasai = nariai
    .map((p) => p.irasas)
    .filter((z): z is PlanoIrasas => z != null)
    .sort((a, b) => Number(a.id) - Number(b.id))
  const irasas = irasai[0] ?? null

  return {
    raktas,
    dataISO: pirma.dataISO,
    laikas: pirma.laikas,
    pradzia: minutes(pirma.laikas),
    trukme: Math.max(...nariai.map((p) => p.trukme)),
    rusis: grupesId ? 'grupine' : 'individuali',
    pavadinimas: grupesId
      ? pirma.grupe?.pavadinimas || 'Grupė'
      : pirma.mokinys.vardas || '(be vardo)',
    smulkiai: grupesId
      ? nariai.map((p) => p.mokinys.vardas).filter(Boolean).join(', ')
      : pirma.mokinys.klase
        ? `${pirma.mokinys.klase} kl.`
        : null,
    busena: bendraBusena(
      irasai.map((z) => z.busena),
      nariai.length,
    ),
    perkeltaIs: pirma.perkeltaIs ? trumpai(pirma.perkeltaIs.data, pirma.perkeltaIs.laikas) : null,
    nuoroda: irasas ? `/admin/collections/zurnalas/${irasas.id}` : null,
    irasoId: irasas ? String(irasas.id) : null,
    vieta: {
      data: pirma.dataISO,
      laikas: pirma.laikas,
      mokinys: grupesId ? null : String(pirma.mokinys.id),
      grupe: grupesId,
    },
  }
}

/**
 * Persidengiantys įvykiai — greta, kaip Google kalendoriuje. Kiekvienas gauna
 * pirmą laisvą stulpelį, o visa persidengiančių grupė — vienodą jų skaičių,
 * kad plotis nešokinėtų per vidurį.
 */
function isdestyk(ivykiai: BeVietos[]): Ivykis[] {
  const rezultatas: Ivykis[] = []
  const dienos = new Map<string, BeVietos[]>()
  for (const i of ivykiai) dienos.set(i.dataISO, [...(dienos.get(i.dataISO) ?? []), i])

  for (const sarasas of dienos.values()) {
    sarasas.sort((a, b) => a.pradzia - b.pradzia || b.trukme - a.trukme)

    let grupe: Ivykis[] = []
    let grupesGalas = -1
    let aktyvus: { galas: number; stulpelis: number }[] = []
    const uzbaik = () => {
      const stulpeliu = Math.max(1, ...grupe.map((i) => i.stulpelis + 1))
      for (const i of grupe) i.stulpeliu = stulpeliu
      grupe = []
    }

    for (const i of sarasas) {
      if (i.pradzia >= grupesGalas) {
        uzbaik()
        aktyvus = []
      }
      aktyvus = aktyvus.filter((a) => a.galas > i.pradzia)
      let stulpelis = 0
      while (aktyvus.some((a) => a.stulpelis === stulpelis)) stulpelis++

      const isdestytas: Ivykis = { ...i, stulpelis, stulpeliu: 1 }
      aktyvus.push({ galas: i.pradzia + i.trukme, stulpelis })
      grupe.push(isdestytas)
      rezultatas.push(isdestytas)
      grupesGalas = Math.max(grupesGalas, i.pradzia + i.trukme)
    }
    uzbaik()
  }
  return rezultatas
}

export async function savaitesKalendorius(
  pirmadienis: string,
  dabar = new Date(),
): Promise<KalendoriausSavaite> {
  const datos = Array.from({ length: 7 }, (_, i) => pridekDienas(pirmadienis, i))
  const [nuo, iki] = [datos[0], datos[6]]
  const { payload, irasai, mokiniai, grupes } = await surink(nuo, iki)

  const ivykiai: BeVietos[] = []

  const pamokos = new Map<string, Planuota<Mokinys, Grupe>[]>()
  for (const p of suplanuok(mokiniai, grupes, irasai, datos)) {
    const raktas =
      p.tipas === 'grupine' && p.grupesId
        ? `g|${p.grupesId}|${p.dataISO}|${p.laikas}`
        : `m|${p.mokinys.id}|${p.dataISO}|${p.laikas}`
    pamokos.set(raktas, [...(pamokos.get(raktas) ?? []), p])
  }
  for (const [raktas, nariai] of pamokos) ivykiai.push(pamokosIvykis(raktas, nariai))

  /**
   * Atšauktos rodomos perbrauktos: kitaip po savaitės neliktų pėdsako, kodėl
   * tas laikas tuščias. Nutempus atšauktą, ji vėl tampa suplanuota.
   */
  const mokiniaiPagalId = new Map(mokiniai.map((m) => [String(m.id), m]))
  const grupesPagalId = new Map(grupes.map((g) => [String(g.id), g]))
  const atsauktos = new Map<string, PlanoIrasas[]>()
  for (const z of irasai) {
    if (z.busena !== 'atsaukta' || !z.laikas || z.data < nuo || z.data > iki) continue
    if (!mokiniaiPagalId.has(rysioId(z.mokinys) ?? '')) continue
    const grupe = z.tipas === 'grupine' ? rysioId(z.grupe) : null
    const raktas = grupe
      ? `x|g|${grupe}|${z.data}|${z.laikas}`
      : `x|m|${rysioId(z.mokinys)}|${z.data}|${z.laikas}`
    atsauktos.set(raktas, [...(atsauktos.get(raktas) ?? []), z])
  }
  for (const [raktas, sarasas] of atsauktos) {
    const z = sarasas[0]
    const grupe = z.tipas === 'grupine' ? grupesPagalId.get(rysioId(z.grupe) ?? '') : undefined
    const vardai = sarasas.map((n) => mokiniaiPagalId.get(rysioId(n.mokinys) ?? '')?.vardas)
    ivykiai.push({
      raktas,
      dataISO: z.data,
      laikas: z.laikas!,
      pradzia: minutes(z.laikas!),
      trukme: z.trukmeMin || 60,
      rusis: z.tipas === 'grupine' ? 'grupine' : 'individuali',
      pavadinimas:
        z.tipas === 'grupine' ? grupe?.pavadinimas || 'Grupė' : vardai[0] || '(be vardo)',
      smulkiai: z.tipas === 'grupine' ? vardai.filter(Boolean).join(', ') : null,
      busena: 'atsaukta',
      perkeltaIs: null,
      nuoroda: `/admin/collections/zurnalas/${z.id}`,
      irasoId: String(z.id),
      vieta: null,
    })
  }

  const { docs: rezervacijos } = await payload.find({
    collection: 'rezervacijos',
    where: {
      and: [
        { data: { greater_than_equal: nuo } },
        { data: { less_than_equal: iki } },
        { busena: { not_equals: 'atmesta' } },
      ],
    },
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })
  for (const r of rezervacijos as unknown as Rezervacija[]) {
    if (!arLaikas(r.laikas)) continue
    ivykiai.push({
      raktas: `r|${r.id}`,
      dataISO: r.data,
      laikas: r.laikas,
      pradzia: minutes(r.laikas),
      trukme: REZERVACIJOS_MIN,
      rusis: 'rezervacija',
      pavadinimas: r.vaikoVardas || 'Rezervacija',
      smulkiai: `Rezervacija${r.busena === 'nauja' ? ' · nauja' : ''}${r.klase ? ` · ${r.klase} kl.` : ''}`,
      busena: r.busena || 'nauja',
      perkeltaIs: null,
      nuoroda: `/admin/collections/rezervacijos/${r.id}`,
      irasoId: null,
      vieta: null,
    })
  }

  const pradzios = ivykiai.map((i) => i.pradzia)
  const pabaigos = ivykiai.map((i) => i.pradzia + i.trukme)
  const siandien = dataVilniuje(dabar)
  const { valanda, minute } = dalys(dabar)

  return {
    pirmadienis,
    etikete: etikete(pirmadienis),
    ankstesne: pridekDienas(pirmadienis, -7),
    kita: pridekDienas(pirmadienis, 7),
    dienos: datos.map((d) => ({
      data: d,
      trumpas: TRUMPINIAI[savaitesDiena(d) - 1],
      diena: Number(d.slice(8, 10)),
      siandien: d === siandien,
    })),
    ivykiai: isdestyk(ivykiai),
    nuo: Math.max(0, Math.min(NUO_MIN, Math.floor(Math.min(...pradzios) / 60) * 60)),
    iki: Math.min(24 * 60, Math.max(IKI_MIN, Math.ceil(Math.max(...pabaigos) / 60) * 60)),
    dabar: datos.includes(siandien) ? { data: siandien, min: valanda * 60 + minute } : null,
    kam: [
      ...mokiniai
        .filter((m) => m.aktyvus !== false)
        .map((m) => ({
          reiksme: `m:${m.id}`,
          pavadinimas: `${m.vardas ?? '(be vardo)'}${m.klase ? `, ${m.klase} kl.` : ''}`,
        }))
        .sort((a, b) => a.pavadinimas.localeCompare(b.pavadinimas, 'lt')),
      ...grupes
        .filter((g) => g.aktyvi !== false)
        .map((g) => ({ reiksme: `g:${g.id}`, pavadinimas: `Grupė: ${g.pavadinimas ?? g.id}` }))
        .sort((a, b) => a.pavadinimas.localeCompare(b.pavadinimas, 'lt')),
    ],
  }
}

/**
 * Pamokos žurnalo įrašai — sukuriami, jei jų dar nėra. Grąžina jų id.
 *
 * Grupinei — visiems tą dieną dalyvaujantiems nariams (aktyviems ir be
 * pauzės), lygiai tiems, kuriems priminimas būtų sukūręs įrašą pats.
 */
export async function irasykPamoka(vieta: Vieta): Promise<string[]> {
  const { payload, irasai, mokiniai, grupes } = await surink(vieta.data, vieta.data)

  const tos = suplanuok(mokiniai, grupes, irasai, [vieta.data]).filter(
    (p) =>
      p.laikas === vieta.laikas &&
      (vieta.grupe
        ? p.tipas === 'grupine' && p.grupesId === vieta.grupe
        : p.tipas === 'individuali' && String(p.mokinys.id) === vieta.mokinys),
  )
  if (tos.length === 0) throw new Error('Šios pamokos nebėra — atnaujinkite kalendorių.')

  const ids: string[] = []
  for (const p of tos) {
    if (p.irasas) {
      ids.push(String(p.irasas.id))
      continue
    }
    const naujas = await payload.create({
      collection: 'zurnalas',
      overrideAccess: true,
      data: {
        data: p.dataISO,
        laikas: p.laikas,
        trukmeMin: p.trukme,
        mokinys: p.mokinys.id,
        tipas: p.tipas,
        grupe: p.grupesId == null ? null : Number(p.grupesId),
        busena: 'suplanuota',
      },
    })
    ids.push(String(naujas.id))
  }
  // Ta pati tvarka, kaip `pamokosIvykis` — kad atsidarytų vis tas pats nario įrašas.
  return ids.sort((a, b) => Number(a) - Number(b))
}

/**
 * Perkelia pamoką. Pats perkėlimas — įprastas datos ir laiko pakeitimas
 * žurnale; ką tai reiškia (pradinė vieta, priminimas iš naujo, grupė), sprendžia
 * `cms/Zurnalas.ts` kabliukai. Taip perkelta per kalendorių ir perkelta ranka
 * pamokos lango laukuose elgiasi vienodai.
 */
export async function perkelkPamoka(
  kas: { vieta: Vieta | null; irasoId: string | null },
  naujaData: string,
  naujasLaikas: string,
): Promise<string> {
  if (!arData(naujaData) || !arLaikas(naujasLaikas)) throw new Error('Netinkama data ar laikas.')

  const id = kas.vieta ? (await irasykPamoka(kas.vieta))[0] : kas.irasoId
  if (!id) throw new Error('Nežinau, kurią pamoką perkelti.')

  const payload = await getPayload({ config })

  // Į pauzę perkelta pamoka tyliai dingtų iš visur — geriau pasakyti iškart.
  const irasas = (await payload.findByID({
    collection: 'zurnalas',
    id,
    depth: 1,
    overrideAccess: true,
  })) as unknown as {
    tipas?: string | null
    mokinys?: { vardas?: string | null; pauzeIki?: string | null } | null
    grupe?: { pavadinimas?: string | null; pauzeIki?: string | null } | null
  }
  const pauze =
    (irasas.tipas === 'grupine' && irasas.grupe
      ? pauzesKlaida(irasas.grupe.pavadinimas || 'Grupė', irasas.grupe.pauzeIki, naujaData)
      : null) ??
    (irasas.tipas !== 'grupine' && irasas.mokinys
      ? pauzesKlaida(irasas.mokinys.vardas || 'Mokinys', irasas.mokinys.pauzeIki, naujaData)
      : null)
  if (pauze) throw new Error(pauze)

  await payload.update({
    collection: 'zurnalas',
    id,
    overrideAccess: true,
    data: { data: naujaData, laikas: naujasLaikas },
  })
  return `Perkelta į ${dataZodziais(naujaData)} ${naujasLaikas}.`
}

/**
 * Papildoma (vienkartinė) pamoka iš kalendoriaus.
 *
 * Tai tiesiog žurnalo įrašas be pasikartojimo — priminimą jis gauna tokį pat,
 * kaip ir tvarkaraščio pamoka (`lib/pamoku-planas.ts`).
 *
 * Tą patį laiką turinčiam vaikui antros pamokos neleidžiam: tėvai gautų du
 * laiškus, o sąskaitoje atsirastų dvi eilutės.
 */
export async function sukurkPamoka(
  kam: string,
  dataISO: string,
  laikas: string,
  trukmeMin: number,
): Promise<string> {
  if (!arData(dataISO) || !arLaikas(laikas)) throw new Error('Netinkama data ar laikas.')
  const trukme = Math.round(Number(trukmeMin))
  if (!(trukme >= 15 && trukme <= 240)) throw new Error('Trukmė — nuo 15 iki 240 min.')

  const [rusis, id] = kam.split(':')
  if (!/^\d+$/.test(id ?? '')) throw new Error('Pasirinkite mokinį ar grupę.')

  const { payload, irasai, mokiniai, grupes } = await surink(dataISO, dataISO)

  let nariai: Mokinys[]
  let grupe: Grupe | null = null
  if (rusis === 'g') {
    grupe = grupes.find((g) => String(g.id) === id) ?? null
    if (!grupe) throw new Error('Tokios aktyvios grupės nėra.')
    const pauze = pauzesKlaida(grupe.pavadinimas || 'Grupė', grupe.pauzeIki, dataISO)
    if (pauze) throw new Error(pauze)
    const ids = new Set((grupe.nariai ?? []).map(String))
    nariai = mokiniai.filter(
      (m) => ids.has(String(m.id)) && m.aktyvus !== false && !pauzuoja(m.pauzeIki, dataISO),
    )
    if (nariai.length === 0) throw new Error('Grupėje tą dieną nėra dalyvaujančių narių.')
  } else if (rusis === 'm') {
    const mokinys = mokiniai.find((m) => String(m.id) === id)
    if (!mokinys) throw new Error('Tokio aktyvaus mokinio nėra.')
    const pauze = pauzesKlaida(mokinys.vardas || 'Mokinys', mokinys.pauzeIki, dataISO)
    if (pauze) throw new Error(pauze)
    nariai = [mokinys]
  } else {
    throw new Error('Pasirinkite mokinį ar grupę.')
  }

  const pradzia = minutes(laikas)
  const ids = new Set(nariai.map((m) => String(m.id)))
  const uzimta = suplanuok(mokiniai, grupes, irasai, [dataISO]).find((p) => {
    if (!ids.has(String(p.mokinys.id))) return false
    const kita = minutes(p.laikas)
    return kita < pradzia + trukme && kita + p.trukme > pradzia
  })
  if (uzimta) {
    throw new Error(`${uzimta.mokinys.vardas ?? 'Mokinys'} tuo metu jau turi pamoką (${uzimta.laikas}).`)
  }

  for (const m of nariai) {
    await payload.create({
      collection: 'zurnalas',
      overrideAccess: true,
      data: {
        data: dataISO,
        laikas,
        trukmeMin: trukme,
        mokinys: m.id,
        tipas: grupe ? 'grupine' : 'individuali',
        grupe: grupe?.id ?? null,
        busena: 'suplanuota',
      },
    })
  }

  const kieno = grupe ? grupe.pavadinimas || 'Grupei' : nariai[0].vardas
  return `${kieno}: pamoka įrašyta ${dataZodziais(dataISO)} ${laikas}. Priminimas išeis kaip įprastai.`
}
