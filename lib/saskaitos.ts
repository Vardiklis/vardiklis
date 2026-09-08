import { getPayload } from 'payload'
import config from '@payload-config'
import {
  gautiAtsiskaitymus,
  pamokosKaina,
  type AtsiskaitymuNustatymai,
  type PamokosTipas,
} from '@/lib/kainos'
import { data as dataVilniuje, MENESIAI, MENESIU_VARDAI, pridekDienas } from '@/lib/laikas'
import { centai } from '@/lib/pinigai'
import { suskaiciuok } from '@/lib/saskaitos-sumos'

/**
 * Sąskaitos iš pamokų žurnalo.
 *
 * PRINCIPAS: JUODRAŠTIS YRA ŽURNALO IŠVESTINĖ. Į sąskaitą patenka tik tos
 * pamokos, kurios pažymėtos „Įvyko“ ir dar niekur neapmokestintos; kiekvienai
 * jų įrašoma, į kurią sąskaitą ji nuėjo (`zurnalas.saskaita`). Būtent tas
 * įrašas, o ne datų palyginimas, neleidžia tos pačios pamokos apmokestinti
 * dukart — net jei generavimas paleidžiamas dešimt kartų iš eilės.
 *
 * PAKARTOTINIS GENERAVIMAS PERRAŠO JUODRAŠTĮ. Įprastas kelias yra toks:
 * sugeneruoji, po dienos prisimeni dar vieną įvykusią pamoką, pažymi ją ir
 * generuoji vėl. Tada juodraštis persidaro iš VISŲ prie jo prikabintų pamokų
 * plius naujų — o ne atsiranda antras tos pačios šeimos juodraštis. Jau
 * išrašytos sąskaitos neliečiamos: jos turi numerį, o numeruotas dokumentas
 * atgaline data nebesikeičia.
 *
 * VIENA SĄSKAITA VIENAI ŠEIMAI. Grupuojama pagal tėvų el. paštą, ne pagal
 * vaiką: du vaikai — viena sąskaita su dviem eilučių grupėmis, o ne du laiškai
 * ir du pavedimai.
 */

export type Laikotarpis = {
  /** `2026-08` — toks pat raktas keliauja ir adreso eilutėje. */
  raktas: string
  nuo: string
  iki: string
  pavadinimas: string
}

const RAKTAS = /^(\d{4})-(0[1-9]|1[0-2])$/

/** `2026-08` → mėnesio ribos ir pavadinimas. Netinkamas raktas — `null`. */
export function menuo(raktas: string): Laikotarpis | null {
  const dalys = RAKTAS.exec(raktas)
  if (!dalys) return null
  const metai = Number(dalys[1])
  const men = Number(dalys[2])
  // Nulinė kito mėnesio diena yra paskutinė šito — veikia ir keliamaisiais metais.
  const paskutine = new Date(Date.UTC(metai, men, 0)).getUTCDate()
  return {
    raktas,
    nuo: `${raktas}-01`,
    iki: `${raktas}-${String(paskutine).padStart(2, '0')}`,
    pavadinimas: `${metai} m. ${MENESIU_VARDAI[men - 1].toLowerCase()}`,
  }
}

/** Mėnesio raktas iš datos. */
export function menesioRaktas(dataISO: string): string {
  return dataISO.slice(0, 7)
}

/**
 * Paskutiniai mėnesiai, naujausias pirmas.
 *
 * Pirmas sąraše — PRAĖJĘS mėnuo, ne einamasis: sąskaita išrašoma už tai, kas
 * jau įvyko, tad būtent jo skydelis turi pasiūlyti pirmiausia.
 */
export function menesiuSarasas(dabar: Date, kiek = 12): Laikotarpis[] {
  const [metai, men] = dataVilniuje(dabar).split('-').map(Number)
  const sarasas: Laikotarpis[] = []
  for (let i = 1; i <= kiek; i++) {
    const d = new Date(Date.UTC(metai, men - 1 - i, 1))
    const l = menuo(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`)
    if (l) sarasas.push(l)
  }
  return sarasas
}

type ZurnaloEilute = {
  id: number
  data: string
  laikas?: string | null
  mokinys?: number | null
  tipas?: string | null
  pirmaPamoka?: boolean | null
  kaina?: number | null
  saskaita?: number | null
}

type MokinioDok = {
  id: number
  vardas: string
  klase?: string | null
  tevoVardas?: string | null
  tevoPastas?: string | null
}

export type SaskaitosEilute = {
  aprasymas: string
  detales: string
  kiekis: number
  matoVnt: string
  kaina: number
  pvmKodas: string
  pvmProc: number
}

export type SaskaitosSantrauka = {
  id: number
  numeris: string | null
  busena: string
  pirkejoVardas: string | null
  pirkejoPastas: string | null
  vaikai: string
  pamoku: number
  sumaIsViso: number
  issiusta: string | null
  isafBusena: string
}

export type Apzvalga = {
  laikotarpis: Laikotarpis
  /** Įvykusios, bet dar niekur neįtrauktos pamokos. */
  laukiaPamoku: number
  laukiaSeimu: number
  /** Centais. */
  laukiaSuma: number
  saskaitos: SaskaitosSantrauka[]
  /** Centais — tik neanuliuotos. */
  israsytaSuma: number
}

type Payload = Awaited<ReturnType<typeof getPayload>>

/** `['2026-08-04','2026-08-11']` → `rugpjūčio 4, 11 d.` */
function datosZodziais(datos: string[]): string {
  const surusiuotos = [...datos].sort()
  const men = Number(surusiuotos[0]?.slice(5, 7) ?? 0)
  const dienos = surusiuotos.map((d) => Number(d.slice(8, 10)))
  return `${MENESIAI[men - 1] ?? ''} ${dienos.join(', ')} d.`
}

const rusis = (tipas: string): string => (tipas === 'grupine' ? 'grupinė' : 'individuali')

/**
 * Pamokos kaina sąskaitai.
 *
 * Pirmiausia — ta, kuri užfiksuota žurnale pamokos metu: pakėlus kainas
 * rugsėjį, rugpjūčio sąskaita turi likti rugpjūčio. Tušti seni įrašai
 * (sukurti dar iki kainų fiksavimo) kainuoja tiek, kiek nustatymuose šiandien
 * — kitaip jie kainuotų nulį ir tyliai dingtų iš sumos.
 */
function eilutesKaina(z: ZurnaloEilute, n: AtsiskaitymuNustatymai): number {
  if (typeof z.kaina === 'number' && Number.isFinite(z.kaina)) return z.kaina
  const tipas: PamokosTipas = z.tipas === 'grupine' ? 'grupine' : 'individuali'
  return pamokosKaina(n, tipas, Boolean(z.pirmaPamoka))
}

/**
 * Žurnalo eilutės → sąskaitos eilutės.
 *
 * Sudedama pagal vaiką, rūšį, „pirmumą“ ir kainą. Pirma pamoka su nuolaida
 * savaime atsiskiria į atskirą eilutę su kitokia vieneto kaina — būtent to ir
 * reikia, kad tėvai galėtų sąskaitą perskaičiuoti galvoje.
 */
function sudarykEilutes(
  zurnalas: ZurnaloEilute[],
  mokiniai: Map<number, MokinioDok>,
  n: AtsiskaitymuNustatymai,
): SaskaitosEilute[] {
  const grupes = new Map<
    string,
    { vardas: string; tipas: string; pirma: boolean; kaina: number; datos: string[] }
  >()

  for (const z of zurnalas) {
    const mokinys = z.mokinys == null ? undefined : mokiniai.get(z.mokinys)
    const vardas = mokinys?.vardas ?? '(ištrintas mokinys)'
    const tipas = z.tipas === 'grupine' ? 'grupine' : 'individuali'
    const pirma = Boolean(z.pirmaPamoka)
    const kaina = eilutesKaina(z, n)

    const raktas = `${vardas}|${tipas}|${pirma}|${kaina}`
    const esama = grupes.get(raktas)
    if (esama) esama.datos.push(z.data)
    else grupes.set(raktas, { vardas, tipas, pirma, kaina, datos: [z.data] })
  }

  return [...grupes.values()]
    // Vaiko vardu, o po to pigesnės (pirmos) pamokos apačioje — kad eilutės
    // eitų ta pačia tvarka kiekvieną mėnesį ir sąskaitas būtų galima lyginti.
    .sort((a, b) => a.vardas.localeCompare(b.vardas, 'lt') || b.kaina - a.kaina)
    .map((g) => ({
      aprasymas: `${g.pirma ? 'Pirmoji matematikos pamoka' : 'Matematikos pamoka'} (${rusis(
        g.tipas,
      )}) · ${g.vardas}`,
      detales: datosZodziais(g.datos),
      kiekis: g.datos.length,
      matoVnt: 'vnt.',
      kaina: g.kaina,
      pvmKodas: n.pvmKodas,
      pvmProc: n.pvmProc,
    }))
}

/** Įvykusios ir dar neapmokestintos pamokos per laikotarpį. */
async function neapmokestintos(payload: Payload, l: Laikotarpis): Promise<ZurnaloEilute[]> {
  const { docs } = await payload.find({
    collection: 'zurnalas',
    where: {
      and: [
        { data: { greater_than_equal: l.nuo } },
        { data: { less_than_equal: l.iki } },
        { busena: { equals: 'ivyko' } },
      ],
    },
    limit: 2000,
    depth: 0,
    sort: ['data', 'laikas'],
    overrideAccess: true,
  })
  // Filtruojam čia, o ne užklausoje: `exists` elgesys ryšiams skiriasi tarp
  // adapterių, o įrašų per mėnesį yra dešimtys, ne milijonai.
  return (docs as unknown as ZurnaloEilute[]).filter((z) => !z.saskaita)
}

/** Mokinių kortelės pagal id — vardams ir tėvų adresams. */
async function mokiniuZemelapis(
  payload: Payload,
  id: (number)[],
): Promise<Map<number, MokinioDok>> {
  if (id.length === 0) return new Map()
  const { docs } = await payload.find({
    collection: 'mokiniai',
    where: { id: { in: id } },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })
  return new Map((docs as unknown as MokinioDok[]).map((m) => [m.id, m]))
}

export type GeneravimoAtaskaita = {
  sukurta: number
  papildyta: number
  pamoku: number
  praleistaBePasto: number
  zinute: string
}

/**
 * Juodraščiai už mėnesį.
 *
 * Grąžina ataskaitą, o ne meta klaidą, kai nieko nerado: „nieko naujo“ yra
 * visiškai normalus atsakymas mėnesio viduryje, o ne gedimas.
 */
export async function sugeneruokJuodrascius(raktas: string): Promise<GeneravimoAtaskaita> {
  const l = menuo(raktas)
  if (!l) throw new Error('Netinkamas laikotarpis.')

  const payload = await getPayload({ config })
  const n = await gautiAtsiskaitymus()

  const naujos = await neapmokestintos(payload, l)

  const visiId = [...new Set(naujos.map((z) => z.mokinys).filter((x) => x != null))] as number[]
  const mokiniai = await mokiniuZemelapis(payload, visiId)

  /** Šeima = tėvų el. paštas. Be jo sąskaitos nėra kam siųsti. */
  const pagalSeima = new Map<string, ZurnaloEilute[]>()
  let praleistaBePasto = 0
  for (const z of naujos) {
    const pastas = (z.mokinys == null ? undefined : mokiniai.get(z.mokinys))?.tevoPastas
      ?.trim()
      .toLowerCase()
    if (!pastas) {
      praleistaBePasto++
      continue
    }
    const esamos = pagalSeima.get(pastas)
    if (esamos) esamos.push(z)
    else pagalSeima.set(pastas, [z])
  }

  let sukurta = 0
  let papildyta = 0
  let pamoku = 0

  for (const [pastas, eilutes] of pagalSeima) {
    // Juodraštis tai šeimai už tą mėnesį jau gali būti — tada jį persidarom
    // iš visų prie jo prikabintų pamokų plius naujų.
    const { docs: juodrasciai } = await payload.find({
      collection: 'saskaitos',
      where: {
        and: [
          { pirkejoPastas: { equals: pastas } },
          { laikotarpisNuo: { equals: l.nuo } },
          { busena: { equals: 'juodrastis' } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const juodrastis = juodrasciai[0] as unknown as { id: number } | undefined

    let visos = eilutes
    if (juodrastis) {
      const { docs: senos } = await payload.find({
        collection: 'zurnalas',
        where: { saskaita: { equals: juodrastis.id } },
        limit: 2000,
        depth: 0,
        sort: ['data', 'laikas'],
        overrideAccess: true,
      })
      visos = [...(senos as unknown as ZurnaloEilute[]), ...eilutes]
    }

    const trukstami = [...new Set(visos.map((z) => z.mokinys).filter((x) => x != null))] as number[]
    for (const id of trukstami) {
      if (!mokiniai.has(id)) {
        const papildomi = await mokiniuZemelapis(payload, [id])
        for (const [k, v] of papildomi) mokiniai.set(k, v)
      }
    }

    const vaikai = [...new Set(visos.map((z) => z.mokinys).filter((x) => x != null))] as number[]
    const pirmasVaikas = vaikai.map((id) => mokiniai.get(id)).find(Boolean)

    const duomenys = {
      busena: 'juodrastis' as const,
      laikotarpisNuo: l.nuo,
      laikotarpisIki: l.iki,
      mokiniai: vaikai,
      pirkejoVardas: pirmasVaikas?.tevoVardas ?? null,
      pirkejoPastas: pastas,
      kainosSuPvm: n.kainosSuPvm,
      eilutes: sudarykEilutes(visos, mokiniai, n),
      pastaba: `Už ${l.pavadinimas} mėnesio pamokas.`,
    }

    let saskaitosId: number
    if (juodrastis) {
      await payload.update({
        collection: 'saskaitos',
        id: juodrastis.id,
        overrideAccess: true,
        data: duomenys,
      })
      saskaitosId = juodrastis.id
    } else {
      const sukurtas = await payload.create({
        collection: 'saskaitos',
        overrideAccess: true,
        data: duomenys,
      })
      saskaitosId = sukurtas.id
    }

    // Prikabinam TIK naujas: senosios jau turi šį patį ryšį.
    for (const z of eilutes) {
      await payload.update({
        collection: 'zurnalas',
        id: z.id,
        overrideAccess: true,
        data: { saskaita: saskaitosId },
      })
    }

    if (juodrastis) papildyta++
    else sukurta++
    pamoku += eilutes.length
  }

  const dalys: string[] = []
  if (sukurta) dalys.push(`sukurta ${sukurta}`)
  if (papildyta) dalys.push(`papildyta ${papildyta}`)
  if (praleistaBePasto) dalys.push(`praleista be tėvų el. pašto: ${praleistaBePasto}`)

  return {
    sukurta,
    papildyta,
    pamoku,
    praleistaBePasto,
    zinute: dalys.length
      ? `${dalys.join(', ')} (${pamoku} pamokos).`
      : 'Naujų neapmokestintų pamokų nerasta.',
  }
}

/**
 * Numerio suteikimas ir išrašymas.
 *
 * Numeris duodamas TIK ČIA. Juodraštį galima ištrinti, o numeruotos sąskaitos
 * — ne: jei numerį gautų kiekvienas juodraštis, numeracijoje liktų skylių,
 * kurių per patikrinimą niekas nepaaiškintų.
 *
 * Susidūrus su jau užimtu numeriu (rankinis įrašas, atsukta skaičiuoklė)
 * bandoma kelis kartus iš eilės — unikalus indeksas yra paskutinis sargas,
 * neleidžiantis dviem sąskaitoms turėti to paties numerio.
 */
export async function israsyk(id: number): Promise<{ numeris: string }> {
  const payload = await getPayload({ config })
  const n = await gautiAtsiskaitymus()

  const dok = (await payload.findByID({
    collection: 'saskaitos',
    id,
    depth: 0,
    overrideAccess: true,
  })) as unknown as { busena?: string | null; numeris?: string | null }

  if (dok.numeris) return { numeris: dok.numeris }
  if (dok.busena === 'anuliuota') throw new Error('Anuliuotos sąskaitos išrašyti negalima.')

  const siandien = dataVilniuje(new Date())
  const terminas = pridekDienas(siandien, Math.max(0, n.terminoDienos))

  let eilesNr = n.kitasNumeris
  for (let bandymas = 0; bandymas < 20; bandymas++) {
    const numeris = `${n.serija}-${String(eilesNr).padStart(4, '0')}`
    try {
      await payload.update({
        collection: 'saskaitos',
        id,
        overrideAccess: true,
        data: {
          numeris,
          busena: 'israsyta',
          data: siandien,
          terminas,
          // Rekvizitai užrakinami būtent dabar: nuo šios akimirkos dokumentas
          // nebeturi keistis dėl to, kad kažkas pataisė nustatymus.
          kainosSuPvm: n.kainosSuPvm,
        },
      })
      await payload.updateGlobal({
        slug: 'atsiskaitymai',
        overrideAccess: true,
        data: { kitasNumeris: eilesNr + 1 },
      })
      return { numeris }
    } catch (klaida) {
      if (!/unique|constraint/i.test(String(klaida))) throw klaida
      eilesNr++
    }
  }
  throw new Error('Nepavyko rasti laisvo sąskaitos numerio.')
}

/**
 * Anuliavimas.
 *
 * Sąskaita lieka — numeruotas dokumentas neišnyksta, o i.SAF anuliuotą
 * sąskaitą reikia parodyti atskirai (`AN`). Pamokos atlaisvinamos: jos vėl
 * laukia eilėje ir pateks į kitą juodraštį.
 */
export async function anuliuok(id: number): Promise<void> {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'zurnalas',
    where: { saskaita: { equals: id } },
    limit: 2000,
    depth: 0,
    overrideAccess: true,
  })
  for (const z of docs as unknown as { id: number }[]) {
    await payload.update({
      collection: 'zurnalas',
      id: z.id,
      overrideAccess: true,
      data: { saskaita: null },
    })
  }

  await payload.update({
    collection: 'saskaitos',
    id,
    overrideAccess: true,
    data: { busena: 'anuliuota' },
  })
}

/**
 * Ištrynimas — tik juodraščiui.
 *
 * Atskiras nuo anuliavimo sąmoningai: juodraštis numerio neturi, tad jo
 * pėdsakų saugoti nereikia, o klaidingai sugeneruotą sąrašą turi būti galima
 * tiesiog išmesti.
 */
export async function ismeskJuodrasti(id: number): Promise<void> {
  const payload = await getPayload({ config })
  const dok = (await payload.findByID({
    collection: 'saskaitos',
    id,
    depth: 0,
    overrideAccess: true,
  })) as unknown as { busena?: string | null }

  if (dok.busena !== 'juodrastis') {
    throw new Error('Išmesti galima tik juodraštį. Išrašyta sąskaita anuliuojama.')
  }

  const { docs } = await payload.find({
    collection: 'zurnalas',
    where: { saskaita: { equals: id } },
    limit: 2000,
    depth: 0,
    overrideAccess: true,
  })
  for (const z of docs as unknown as { id: number }[]) {
    await payload.update({
      collection: 'zurnalas',
      id: z.id,
      overrideAccess: true,
      data: { saskaita: null },
    })
  }

  await payload.delete({ collection: 'saskaitos', id, overrideAccess: true })
}

/** Mėnesio langas skydeliui. */
export async function menesioApzvalga(raktas: string): Promise<Apzvalga> {
  const l = menuo(raktas)
  if (!l) throw new Error('Netinkamas laikotarpis.')

  const payload = await getPayload({ config })
  const n = await gautiAtsiskaitymus()

  const laukia = await neapmokestintos(payload, l)
  const laukiaId = [...new Set(laukia.map((z) => z.mokinys).filter((x) => x != null))] as number[]
  const laukiaMokiniai = await mokiniuZemelapis(payload, laukiaId)

  const seimos = new Set<string>()
  let laukiaSuma = 0
  for (const z of laukia) {
    const m = z.mokinys == null ? undefined : laukiaMokiniai.get(z.mokinys)
    if (m?.tevoPastas) seimos.add(m.tevoPastas.trim().toLowerCase())
    laukiaSuma += centai(eilutesKaina(z, n))
  }

  const { docs } = await payload.find({
    collection: 'saskaitos',
    where: { laikotarpisNuo: { equals: l.nuo } },
    limit: 500,
    depth: 1,
    sort: ['numeris', 'createdAt'],
    overrideAccess: true,
  })

  const saskaitos = (
    docs as unknown as {
      id: number
      numeris?: string | null
      busena?: string | null
      pirkejoVardas?: string | null
      pirkejoPastas?: string | null
      mokiniai?: ({ vardas?: string } | number)[] | null
      eilutes?: { kiekis?: number | null }[] | null
      sumaIsViso?: number | null
      issiusta?: string | null
      isafBusena?: string | null
    }[]
  ).map((d) => ({
    id: d.id,
    numeris: d.numeris ?? null,
    busena: d.busena ?? 'juodrastis',
    pirkejoVardas: d.pirkejoVardas ?? null,
    pirkejoPastas: d.pirkejoPastas ?? null,
    vaikai: (d.mokiniai ?? [])
      .map((m) => (typeof m === 'object' && m ? (m.vardas ?? '') : ''))
      .filter(Boolean)
      .join(', '),
    pamoku: (d.eilutes ?? []).reduce((s, e) => s + Number(e.kiekis ?? 0), 0),
    sumaIsViso: centai(Number(d.sumaIsViso ?? 0)),
    issiusta: d.issiusta ?? null,
    isafBusena: d.isafBusena ?? 'neteikta',
  }))

  return {
    laikotarpis: l,
    laukiaPamoku: laukia.length,
    laukiaSeimu: seimos.size,
    laukiaSuma,
    saskaitos,
    israsytaSuma: saskaitos
      .filter((s) => s.busena !== 'anuliuota')
      .reduce((s, x) => s + x.sumaIsViso, 0),
  }
}

/** Sumos perskaičiavimas iš dokumento — PDF'ui ir i.SAF rinkmenai. */
export function saskaitosSumos(dok: {
  eilutes?: { kiekis?: number | null; kaina?: number | null; pvmKodas?: string | null; pvmProc?: number | null }[] | null
  kainosSuPvm?: boolean | null
}) {
  return suskaiciuok(dok.eilutes ?? [], dok.kainosSuPvm !== false)
}
