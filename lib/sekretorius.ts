import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import {
  Atmintis,
  klausk,
  Pasiulymas,
  suderinamasModelis,
  type Irankis,
  type Modelis,
} from '@/lib/agentas/agentas'
import { html, telegrama, type Atnaujinimas, type Mygtukas, type Telegrama } from '@/lib/agentas/telegrama'
import { irasykPamoka, perkelkPamoka, type Vieta } from '@/lib/kalendorius'
import { svetaine } from '@/lib/kontaktai'
import {
  arLaikas,
  data as dataVilniuje,
  dataZodziais,
  dienuSkirtumas,
  laikas as laikasVilniuje,
  momentas,
  pridekDienas,
  SAVAITES_DIENOS,
  savaitesDiena,
} from '@/lib/laikas'
import { arMock } from '@/lib/mock'
import type { Pamoka } from '@/lib/pamokos'
import { irasuSalyga, PLANO_LAUKAI, suplanuok, type Planuota, type PlanoIrasas } from '@/lib/pamoku-planas'

/**
 * Telegram sekretorius: pranešimas prieš pamoką ir pokalbis.
 *
 * DU ATSKIRI DARBAI.
 *   1. Pranešimas prieš pamoką (`praneskPriesPamokas`) — be jokio kalbos
 *      modelio. Tekstas sudaromas iš žurnalo, tad nekainuoja nieko ir išeina
 *      net tada, kai OpenRouter neveikia. Jį kviečia tas pats cron'as, kaip ir
 *      priminimus tėvams (`/vidus/priminimai`).
 *   2. Pokalbis (`apdorokTelegrama`) — modelis su įrankiais. Skaityti jis gali
 *      pats, o perkelti, atšaukti ir įrašyti temą — tik pasiūlyti: pakeičiama
 *      paspaudus „Taip“ (žr. `lib/agentas/agentas.ts`).
 *
 * NIEKO NESKAIČIUOJA SAVAIP. Pamokos — iš `suplanuok()`, perkėlimas — per
 * `perkelkPamoka()`, įrašai — per `irasykPamoka()`, kaip CMS kalendoriuje. Tad
 * botas perkelia lygiai taip pat, kaip nutempus pelė: su grupe, pauzės
 * patikra ir priminimu tėvams naujuoju laiku.
 *
 * MODELIUI — TIK TAI, KO REIKIA. Vardas, klasė, laikas, tema, namų darbai.
 * Tėvų pašto, Meet nuorodų ir kainų įrankiai negrąžina.
 *
 * PRIEIGA. Botas atviras visam Telegram'ui, todėl atsakoma tik pokalbiui
 * `TELEGRAM_CHAT_ID`, o maršrutas priima tik užklausas su Telegram'ui duotu
 * slaptažodžiu (`/vidus/telegrama`).
 */

type Payloadas = Awaited<ReturnType<typeof getPayload>>

/**
 * Numatytasis modelis — pigus ir gerai kviečiantis įrankius. Keičiamas
 * `ASISTENTO_MODELIS` (galima keli per kablelį — kiti atsarginiai).
 */
const NUMATYTAS_MODELIS = 'deepseek/deepseek-v4.1-flash'

export type Aplinka = {
  tg: Telegrama | null
  /** Vienintelis pokalbis, kuriam botas atsako ir siunčia pranešimus. */
  pokalbis: string | null
  modelis: Modelis | null
}

function aplinka(): Aplinka {
  const zetonas = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const raktas = process.env.OPENROUTER_API_KEY?.trim()
  const modeliai = (process.env.ASISTENTO_MODELIS || NUMATYTAS_MODELIS)
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean)

  return {
    // Mock režime žinutės neišeina net su tikru žetonu — kaip ir laiškai (`lib/pastas.ts`).
    tg: zetonas ? telegrama({ zetonas, bandomasis: arMock() }) : null,
    pokalbis: process.env.TELEGRAM_CHAT_ID?.trim() || null,
    modelis: raktas
      ? suderinamasModelis({
          adresas: 'https://openrouter.ai/api/v1',
          raktas,
          modeliai,
          // Tik tiekėjai, kurie užklausų nenaudoja mokymui: pokalbyje — vaikų vardai ir pažanga.
          papildomai: { provider: { data_collection: 'deny' } },
        })
      : null,
  }
}

type Mokinys = {
  id: number
  vardas: string
  klase?: string | null
  aktyvus?: boolean | null
  pauzeIki?: string | null
  pirmaPamoka?: boolean | null
  meetNuoroda?: string | null
  pamokos?: Pamoka[] | null
}

type Grupe = {
  id: number
  pavadinimas?: string | null
  aktyvi?: boolean | null
  nariai?: (number | string)[] | null
  pauzeIki?: string | null
  meetNuoroda?: string | null
  pamokos?: Pamoka[] | null
}

type Irasas = PlanoIrasas & { pranestaSau?: string | null }

type Rezervacija = {
  id: number
  data: string
  laikas: string
  vaikoVardas?: string | null
  klase?: string | null
  busena?: string | null
}

/**
 * Viena pamoka taip, kaip ją mato korepetitorė: grupinė — vienas įvykis su
 * nariais, nors žurnale guli po įrašą kiekvienam vaikui.
 */
type Ivykis = {
  /** `m12/2026-11-05/17:00` arba `g3/…` — juo pamoką nurodo modelis. */
  raktas: string
  vieta: Vieta
  dataISO: string
  laikas: string
  trukme: number
  grupine: boolean
  grupesPavadinimas: string | null
  nariai: Planuota<Mokinys, Grupe>[]
  meet: string | null
  perkeltaIs: { data: string; laikas: string } | null
}

const RAKTAS = /^([mg])(\d+)\/(\d{4}-\d{2}-\d{2})\/(\d{2}:\d{2})$/

/** `Eva (8 kl.)` */
const vaikas = (m: { vardas?: string | null; klase?: string | null }): string =>
  `${m.vardas || '(be vardo)'}${m.klase ? ` (${m.klase} kl.)` : ''}`

/** `Eva (8 kl.)` arba `grupė „8 klasė, penktadieniais“`. */
const kas = (i: Ivykis): string =>
  i.grupine ? `grupė „${i.grupesPavadinimas || 'be pavadinimo'}“` : vaikas(i.nariai[0].mokinys)

/** `lapkričio 5 d. (ketvirtadienis) 17:00` */
const kada = (dataISO: string, laikas: string): string => `${dataZodziais(dataISO)} ${laikas}`

const minutes = (laikas: string): number => {
  const [v, m] = laikas.split(':').map(Number)
  return v * 60 + m
}

/** Visos dienos nuo `nuo` iki `iki` imtinai. */
const dienos = (nuo: string, iki: string): string[] =>
  Array.from({ length: dienuSkirtumas(nuo, iki) + 1 }, (_, i) => pridekDienas(nuo, i))

/** Aktyvūs mokiniai, grupės, žurnalas ir rezervacijos datoms — viskas, ko reikia `suplanuok()`. */
async function surink(payload: Payloadas, nuo: string, iki: string) {
  const [irasai, mokiniai, grupes, rezervacijos] = await Promise.all([
    payload.find({
      collection: 'zurnalas',
      where: irasuSalyga(nuo, iki),
      limit: 2000,
      depth: 0,
      overrideAccess: true,
      select: { ...PLANO_LAUKAI, pranestaSau: true },
    }),
    payload.find({
      collection: 'mokiniai',
      where: { aktyvus: { equals: true } },
      limit: 1000,
      depth: 0,
      overrideAccess: true,
      select: {
        vardas: true,
        klase: true,
        aktyvus: true,
        pauzeIki: true,
        pirmaPamoka: true,
        meetNuoroda: true,
        pamokos: true,
      },
    }),
    payload.find({
      collection: 'grupes',
      where: { aktyvi: { equals: true } },
      limit: 500,
      depth: 0,
      overrideAccess: true,
      select: {
        pavadinimas: true,
        aktyvi: true,
        nariai: true,
        pauzeIki: true,
        meetNuoroda: true,
        pamokos: true,
      },
    }),
    payload.find({
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
      select: { data: true, laikas: true, vaikoVardas: true, klase: true, busena: true },
    }),
  ])

  return {
    irasai: irasai.docs as unknown as Irasas[],
    mokiniai: mokiniai.docs as unknown as Mokinys[],
    grupes: grupes.docs as unknown as Grupe[],
    rezervacijos: (rezervacijos.docs as unknown as Rezervacija[]).filter((r) => arLaikas(r.laikas)),
  }
}

/** Pamokos ir rezervacijos `nuo`–`iki` — tvarkaraštis su žurnalo išimtimis. */
async function pamokuIvykiai(payload: Payloadas, nuo: string, iki: string) {
  const { irasai, mokiniai, grupes, rezervacijos } = await surink(payload, nuo, iki)

  // Tas pats sugrupavimas, kaip `lib/kalendorius.ts`: grupė pagal id, kitaip — vaikas.
  const pagalRakta = new Map<string, Planuota<Mokinys, Grupe>[]>()
  for (const p of suplanuok(mokiniai, grupes, irasai, dienos(nuo, iki))) {
    const grupine = p.tipas === 'grupine' && p.grupesId != null
    const raktas = `${grupine ? `g${p.grupesId}` : `m${p.mokinys.id}`}/${p.dataISO}/${p.laikas}`
    pagalRakta.set(raktas, [...(pagalRakta.get(raktas) ?? []), p])
  }

  const ivykiai: Ivykis[] = [...pagalRakta].map(([raktas, nariai]) => {
    const p = nariai[0]
    const grupine = raktas.startsWith('g')
    return {
      raktas,
      vieta: {
        data: p.dataISO,
        laikas: p.laikas,
        mokinys: grupine ? null : String(p.mokinys.id),
        grupe: grupine ? p.grupesId : null,
      },
      dataISO: p.dataISO,
      laikas: p.laikas,
      trukme: Math.max(...nariai.map((n) => n.trukme)),
      grupine,
      grupesPavadinimas: grupine ? p.grupe?.pavadinimas || null : null,
      nariai,
      meet: (grupine ? p.grupe?.meetNuoroda : p.mokinys.meetNuoroda) || null,
      perkeltaIs: p.perkeltaIs,
    }
  })

  return { ivykiai, rezervacijos }
}

/** Pamoka pagal modelio duotą raktą — iš naujo, nes nuo jo gavimo ji galėjo pasikeisti. */
async function raskIvyki(payload: Payloadas, raktas: unknown): Promise<Ivykis> {
  const svarus = typeof raktas === 'string' ? raktas.trim() : ''
  const dalys = RAKTAS.exec(svarus)
  if (!dalys) throw new Error('Netinkamas pamokos raktas — paimk jį iš įrankio „pamokos“.')

  const { ivykiai } = await pamokuIvykiai(payload, dalys[3], dalys[3])
  const ivykis = ivykiai.find((i) => i.raktas === svarus)
  if (!ivykis) {
    throw new Error('Tokios pamokos nėra (gal jau perkelta ar atšaukta) — pasižiūrėk „pamokos“ tai dienai iš naujo.')
  }
  return ivykis
}

/** Grupės būsena iš narių. „Neįvyko“ — tik jei neįvyko visiems: vienas praleidęs grupės neatšaukia. */
function busena(i: Ivykis): string {
  const busenos = i.nariai.map((p) => p.irasas?.busena || 'suplanuota')
  if (busenos.includes('ivyko')) return 'ivyko'
  if (busenos.every((b) => b === 'neivyko')) return 'neivyko'
  if (busenos.includes('atidare')) return 'atidare'
  return 'suplanuota'
}

type ZurnaloEilute = {
  id: number | string
  data: string
  laikas?: string | null
  busena?: string | null
  tipas?: string | null
  tema?: string | null
  namuDarbai?: string | null
  atsiliepimas?: string | null
}

/**
 * Jau prasidėjusios mokinio ar grupės pamokos, naujausia pirma.
 *
 * Grupė žurnale palieka po įrašą kiekvienam nariui — čia iš jų lieka po vieną
 * pamoką. Rūšiuojama čia, ne užklausoje: tą pačią dieną pamokų gali būti kelios.
 */
async function praejusios(
  payload: Payloadas,
  kam: { mokinys: number } | { grupe: number },
  n: { kiek: number; dabar: Date; suTema?: boolean },
): Promise<ZurnaloEilute[]> {
  const salygos: Where[] = [
    'grupe' in kam ? { grupe: { equals: kam.grupe } } : { mokinys: { equals: kam.mokinys } },
    { data: { less_than_equal: dataVilniuje(n.dabar) } },
  ]
  if (n.suTema) salygos.push({ tema: { exists: true } })

  const { docs } = await payload.find({
    collection: 'zurnalas',
    where: { and: salygos },
    sort: '-data',
    // Grupei — po įrašą nariui; ir šiandienos dar neprasidėjusios iškrenta.
    limit: n.kiek * 4 + 10,
    depth: 0,
    overrideAccess: true,
    select: { data: true, laikas: true, busena: true, tipas: true, tema: true, namuDarbai: true, atsiliepimas: true },
  })

  const matyta = new Set<string>()
  return (docs as unknown as ZurnaloEilute[])
    .filter((z) => !z.laikas || momentas(z.data, z.laikas) <= n.dabar)
    .filter((z) => !n.suTema || z.tema?.trim())
    .sort((a, b) => `${b.data} ${b.laikas ?? ''}`.localeCompare(`${a.data} ${a.laikas ?? ''}`))
    .filter((z) => {
      const raktas = `${z.data} ${z.laikas}`
      if (matyta.has(raktas)) return false
      matyta.add(raktas)
      return true
    })
    .slice(0, n.kiek)
}

const kamIvykis = (i: Ivykis) =>
  i.grupine ? { grupe: Number(i.vieta.grupe) } : { mokinys: Number(i.vieta.mokinys) }

export type PranesimuAtaskaita = { pranesta: number; eilutes: string[] }

/**
 * Žinutė į Telegram likus `telegramPries` minučių iki pamokos.
 *
 * KAS 5 MIN. kviečiama kartu su priminimais tėvams. Kiekvieną kartą ieškoma
 * pamokų, kurios prasidės per artimiausias `telegramPries` minutes ir apie
 * kurias dar nepranešta. Prasidėjusiai pamokai pranešimas nebesiunčiamas.
 *
 * DUKART NEIŠSIUNČIA žurnalo `pranestaSau`. Pamokai, kuri kol kas tik
 * tvarkaraštyje, įrašas sukuriamas — lygiai toks, kokį sukurtų priminimai ar
 * kalendorius. Grupinė — viena žinutė, bet pažymimi visi nariai.
 *
 * NEPAVYKUS žymė neužsideda, ir kitas badymas bando dar kartą.
 */
export async function praneskPriesPamokas(
  dabar = new Date(),
  a: Aplinka = aplinka(),
): Promise<PranesimuAtaskaita> {
  const ataskaita: PranesimuAtaskaita = { pranesta: 0, eilutes: [] }
  if (!a.tg || !a.pokalbis) {
    ataskaita.eilutes.push('Telegram nesukonfigūruotas.')
    return ataskaita
  }

  const payload = await getPayload({ config })
  const n = (await payload.findGlobal({ slug: 'priminimai', overrideAccess: true })) as {
    telegramPries?: number | null
  }
  // Tuščias — stulpelis atsirado vėliau už įrašą; tada numatytasis.
  const pries = Number(n.telegramPries ?? 15)
  if (!(pries > 0)) {
    ataskaita.eilutes.push('Išjungta nustatymuose.')
    return ataskaita
  }

  // Ir rytojus: 23:55 reikia pranešti apie 00:05 pamoką.
  const siandien = dataVilniuje(dabar)
  const { ivykiai } = await pamokuIvykiai(payload, siandien, pridekDienas(siandien, 1))

  for (const i of ivykiai) {
    const liko = momentas(i.dataISO, i.laikas).getTime() - dabar.getTime()
    if (liko <= 0 || liko > pries * 60_000) continue
    if (i.nariai.every((p) => (p.irasas as Irasas | null)?.pranestaSau)) continue

    // „Neįvyko“ iš anksto — vaikas šįkart neateina.
    const ateis = i.nariai.filter((p) => p.irasas?.busena !== 'neivyko')
    if (ateis.length === 0) continue

    try {
      const ids = await irasykPamoka(i.vieta)
      const paskutine = (await praejusios(payload, kamIvykis(i), { kiek: 1, dabar, suTema: true }))[0]

      const eilutes = [
        `<b>Po ${Math.round(liko / 60_000)} min. — ${html(kas(i))}, ${i.laikas}</b>`,
        i.grupine ? html(ateis.map((p) => vaikas(p.mokinys)).join(', ')) : null,
        ateis.some((p) => p.mokinys.pirmaPamoka) ? 'Pirma pamoka' : null,
        i.perkeltaIs ? `Perkelta iš ${html(kada(i.perkeltaIs.data, i.perkeltaIs.laikas))}` : null,
        paskutine
          ? `Paskutinė tema: ${html(paskutine.tema!.trim())} (${html(dataZodziais(paskutine.data))})`
          : 'Temų žurnale dar nėra.',
        paskutine?.namuDarbai?.trim() ? `Namų darbai: ${html(paskutine.namuDarbai.trim())}` : null,
      ].filter((e): e is string => e !== null)

      const mygtukai: Mygtukas[] = []
      if (i.meet && /^https:\/\//.test(i.meet)) mygtukai.push({ tekstas: 'Meet', nuoroda: i.meet })
      mygtukai.push({ tekstas: 'Žurnalas', nuoroda: `${svetaine.url}/admin/collections/zurnalas/${ids[0]}` })

      await a.tg.siusk(a.pokalbis, eilutes.join('\n'), [mygtukai])
      await payload.update({
        collection: 'zurnalas',
        where: { id: { in: ids } },
        overrideAccess: true,
        data: { pranestaSau: new Date().toISOString() },
      })
      ataskaita.pranesta++
      ataskaita.eilutes.push(`✓ ${kas(i)} ${i.dataISO} ${i.laikas}`)
    } catch (klaida) {
      ataskaita.eilutes.push(`✗ ${kas(i)} ${i.dataISO} ${i.laikas}: ${String(klaida).slice(0, 200)}`)
      console.error('[sekretorius] pranešimo išsiųsti nepavyko:', klaida)
    }
  }

  return ataskaita
}

/** Kas tuo metu jau vyksta — perspėjimui prieš perkeliant. */
async function kasTuoMetu(
  payload: Payloadas,
  dataISO: string,
  laikas: string,
  trukme: number,
  isskyrus: string,
): Promise<string[]> {
  const { ivykiai, rezervacijos } = await pamokuIvykiai(payload, dataISO, dataISO)
  const pradzia = minutes(laikas)
  const persidengia = (l: string, t: number) => minutes(l) < pradzia + trukme && pradzia < minutes(l) + t
  return [
    ...ivykiai
      .filter((i) => i.raktas !== isskyrus && persidengia(i.laikas, i.trukme))
      .map((i) => `${kas(i)} ${i.laikas}`),
    // Rezervacija — bandomoji pamoka, tad valanda, kaip ir kalendoriuje.
    ...rezervacijos
      .filter((r) => persidengia(r.laikas, 60))
      .map((r) => `rezervacija ${r.vaikoVardas || ''} ${r.laikas}`.replace(/\s+/g, ' ')),
  ]
}

const DATA = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

function tikraData(reiksme: unknown, laukas: string): string {
  if (typeof reiksme !== 'string' || !DATA.test(reiksme.trim())) {
    throw new Error(`„${laukas}“ — data kaip 2026-11-05.`)
  }
  return reiksme.trim()
}

function tikrasLaikas(reiksme: unknown): string {
  // „9:00“ modeliai rašo dažnai — tai ne klaida, o tiesiog be nulio.
  const laikas = typeof reiksme === 'string' ? reiksme.trim().replace(/^(\d):/, '0$1:') : ''
  if (!arLaikas(laikas)) throw new Error('Laikas — kaip 17:00.')
  return laikas
}

function tikrasId(reiksme: unknown, laukas: string): number {
  const id = Number(reiksme)
  if (!Number.isInteger(id) || id <= 0) throw new Error(`„${laukas}“ — skaičius iš sąrašo sistemos tekste.`)
  return id
}

const tekstas = (reiksme: unknown): string | null =>
  typeof reiksme === 'string' && reiksme.trim() ? reiksme.trim() : null

const RAKTO_LAUKAS = {
  type: 'string',
  description: 'Pamokos raktas iš įrankio „pamokos“, pvz. m12/2026-11-05/17:00.',
} as const

/** Ar pamoka jau prasidėjo — tokios botas neperkelia ir neatšaukia, ją taiso CMS'e. */
const prasidejo = (i: Ivykis, dabar: Date) => momentas(i.dataISO, i.laikas) <= dabar

function irankiai(payload: Payloadas, dabar: Date): Irankis[] {
  return [
    {
      pavadinimas: 'pamokos',
      aprasymas:
        'Pamokos nurodytomis dienomis: laikas, su kuo, būsena (suplanuota, atidare — tėvai atidarė nuorodą, ivyko, neivyko) ir raktas, kuriuo pamoka nurodoma kitiems įrankiams. Taip pat rezervacijos — bandomosios pamokos iš svetainės (jas keisti tik CMS’e). Ne daugiau kaip 31 diena.',
      parametrai: {
        type: 'object',
        properties: {
          nuo: { type: 'string', description: 'Pirma diena, YYYY-MM-DD.' },
          iki: { type: 'string', description: 'Paskutinė diena imtinai, YYYY-MM-DD. Nenurodžius — ta pati diena.' },
        },
        required: ['nuo'],
      },
      vykdyk: async (arg) => {
        const nuo = tikraData(arg.nuo, 'nuo')
        const iki = arg.iki ? tikraData(arg.iki, 'iki') : nuo
        if (iki < nuo) throw new Error('„iki“ ankstesnė už „nuo“.')
        if (dienuSkirtumas(nuo, iki) > 30) throw new Error('Daugiausia 31 diena vienu kartu.')

        const { ivykiai, rezervacijos } = await pamokuIvykiai(payload, nuo, iki)
        return {
          pamokos: ivykiai.map((i) => ({
            raktas: i.raktas,
            data: i.dataISO,
            diena: SAVAITES_DIENOS[savaitesDiena(i.dataISO) - 1],
            laikas: i.laikas,
            trukme_min: i.trukme,
            kas: kas(i),
            ...(i.grupine
              ? {
                  grupes_id: Number(i.vieta.grupe),
                  nariai: i.nariai.map(
                    (p) => `${vaikas(p.mokinys)}${p.irasas?.busena === 'neivyko' ? ' — neateis' : ''}`,
                  ),
                }
              : { mokinio_id: Number(i.vieta.mokinys) }),
            busena: busena(i),
            ...(i.perkeltaIs ? { perkelta_is: `${i.perkeltaIs.data} ${i.perkeltaIs.laikas}` } : {}),
            ...(prasidejo(i, dabar) ? { jau_prasidejo: true } : {}),
          })),
          rezervacijos: rezervacijos.map((r) => ({
            data: r.data,
            laikas: r.laikas,
            vaikas: vaikas({ vardas: r.vaikoVardas, klase: r.klase }),
            busena: r.busena || 'nauja',
          })),
        }
      },
    },
    {
      pavadinimas: 'zurnalas',
      aprasymas:
        'Praėjusios mokinio arba grupės pamokos, naujausia pirma: tema, namų darbai, atsiliepimas ir būsena. Naudok, kai klausiama, ką veikė, kokios buvo temos ar ar pamoka įvyko.',
      parametrai: {
        type: 'object',
        properties: {
          mokinio_id: { type: 'integer', description: 'Mokinio id iš sąrašo sistemos tekste.' },
          grupes_id: { type: 'integer', description: 'Grupės id — grupės pamokoms.' },
          kiek: { type: 'integer', description: 'Kiek pamokų. Numatyta 5, daugiausia 20.' },
        },
      },
      vykdyk: async (arg) => {
        const kiek = Math.min(20, Math.max(1, Math.round(Number(arg.kiek)) || 5))
        const grupe = arg.grupes_id != null
        if (!grupe && arg.mokinio_id == null) throw new Error('Nurodyk mokinio_id arba grupes_id.')
        const kam = grupe
          ? { grupe: tikrasId(arg.grupes_id, 'grupes_id') }
          : { mokinys: tikrasId(arg.mokinio_id, 'mokinio_id') }

        const eilutes = await praejusios(payload, kam, { kiek, dabar })
        if (eilutes.length === 0) return { pamokos: [], pastaba: 'Praėjusių pamokų žurnale nėra.' }
        return {
          pamokos: eilutes.map((z) => ({
            data: z.data,
            laikas: z.laikas ?? null,
            busena: z.busena || 'suplanuota',
            ...(z.tipas === 'grupine' ? { grupine: true } : {}),
            tema: z.tema?.trim() || null,
            namu_darbai: z.namuDarbai?.trim() || null,
            // Grupėje atsiliepimas — vieno vaiko, ne pamokos.
            ...(grupe ? {} : { atsiliepimas: z.atsiliepimas?.trim() || null }),
          })),
        }
      },
    },
    {
      pavadinimas: 'perkelti',
      aprasymas:
        'Pasiūlo perkelti dar neprasidėjusią pamoką į kitą datą ir laiką. Grupinė perkeliama visa. Pakeičiama tik korepetitorei paspaudus „Taip“.',
      parametrai: {
        type: 'object',
        properties: {
          raktas: RAKTO_LAUKAS,
          data: { type: 'string', description: 'Nauja data, YYYY-MM-DD.' },
          laikas: { type: 'string', description: 'Nauja pradžia, HH:MM.' },
        },
        required: ['raktas', 'data', 'laikas'],
      },
      vykdyk: async (arg) => {
        const ivykis = await raskIvyki(payload, arg.raktas)
        const naujaData = tikraData(arg.data, 'data')
        const naujasLaikas = tikrasLaikas(arg.laikas)
        if (prasidejo(ivykis, dabar)) throw new Error('Ši pamoka jau prasidėjo — praėjusią taisyk CMS’e.')
        if (momentas(naujaData, naujasLaikas) <= dabar) throw new Error('Naujas laikas jau praėjęs.')
        if (naujaData === ivykis.dataISO && naujasLaikas === ivykis.laikas) {
          throw new Error('Pamoka jau ir yra tuo laiku.')
        }

        const sutampa = await kasTuoMetu(payload, naujaData, naujasLaikas, ivykis.trukme, ivykis.raktas)
        return new Pasiulymas(
          [
            `Perkelti: ${kas(ivykis)}`,
            `${kada(ivykis.dataISO, ivykis.laikas)} → ${kada(naujaData, naujasLaikas)}?`,
            sutampa.length ? `⚠ Tuo metu jau yra: ${sutampa.join('; ')}` : null,
            'Priminimas tėvams eis pagal naują laiką.',
          ]
            .filter((e): e is string => e !== null)
            .join('\n'),
          () => perkelkPamoka({ vieta: ivykis.vieta, irasoId: null }, naujaData, naujasLaikas),
        )
      },
    },
    {
      pavadinimas: 'atsaukti',
      aprasymas:
        'Pasiūlo atšaukti dar neprasidėjusią pamoką: laikas atsilaisvina, priminimas tėvams neišeina. Grupinė atšaukiama visa. Pakeičiama tik paspaudus „Taip“. Jei neateis tik vienas grupės vaikas — tai ne atšaukimas: pasakyk, kad CMS’e jo įraše pažymėtų „Neįvyko“.',
      parametrai: {
        type: 'object',
        properties: { raktas: RAKTO_LAUKAS },
        required: ['raktas'],
      },
      vykdyk: async (arg) => {
        const ivykis = await raskIvyki(payload, arg.raktas)
        if (prasidejo(ivykis, dabar)) throw new Error('Ši pamoka jau prasidėjo — žurnale pažymėk „Neįvyko“.')

        return new Pasiulymas(
          [
            `Atšaukti: ${kas(ivykis)}, ${kada(ivykis.dataISO, ivykis.laikas)}?`,
            'Laikas atsilaisvins. Tėvams laiško sistema nesiunčia — jiems parašyk atskirai.',
          ].join('\n'),
          async () => {
            // Grupės nariams atšaukimą nukopijuoja `Zurnalas` kabliukas.
            const [id] = await irasykPamoka(ivykis.vieta)
            await payload.update({
              collection: 'zurnalas',
              id,
              overrideAccess: true,
              data: { busena: 'atsaukta' },
            })
            return `Atšaukta: ${kas(ivykis)}, ${kada(ivykis.dataISO, ivykis.laikas)}.`
          },
        )
      },
    },
    {
      pavadinimas: 'irasyti_tema',
      aprasymas:
        'Pasiūlo įrašyti į žurnalą, ką pamokoje veikė: temą, namų darbus ir (tik individualiai pamokai) atsiliepimą. Tai mato mokinys ir tėvai dienyne. Naudok, kai prašoma užpildyti žurnalą ar sukurti pamokos juodraštį. Laukų, apie kuriuos korepetitorė nieko nesakė, nepildyk. Įrašoma tik paspaudus „Taip“.',
      parametrai: {
        type: 'object',
        properties: {
          raktas: RAKTO_LAUKAS,
          tema: { type: 'string', description: 'Trumpai, pvz. „Trupmenų daugyba“.' },
          namu_darbai: { type: 'string' },
          atsiliepimas: { type: 'string', description: 'Kaip sekėsi — rašoma vaikui ir tėvams.' },
        },
        required: ['raktas'],
      },
      vykdyk: async (arg) => {
        const ivykis = await raskIvyki(payload, arg.raktas)
        const tema = tekstas(arg.tema)
        const namuDarbai = tekstas(arg.namu_darbai)
        const atsiliepimas = tekstas(arg.atsiliepimas)
        if (!tema && !namuDarbai && !atsiliepimas) throw new Error('Nėra ką įrašyti.')
        if (atsiliepimas && ivykis.grupine) {
          throw new Error(
            'Grupinei pamokai atsiliepimas rašomas kiekvienam vaikui atskirai, CMS’e. Temą ir namų darbus įrašyti galima.',
          )
        }

        return new Pasiulymas(
          [
            `Įrašyti į žurnalą — ${kas(ivykis)}, ${kada(ivykis.dataISO, ivykis.laikas)}:`,
            tema ? `Tema: ${tema}` : null,
            namuDarbai ? `Namų darbai: ${namuDarbai}` : null,
            atsiliepimas ? `Atsiliepimas: ${atsiliepimas}` : null,
            'Prasidėjus pamokai, tai matys mokinys ir tėvai dienyne.',
          ]
            .filter((e): e is string => e !== null)
            .join('\n'),
          async () => {
            // Grupės nariams temą ir namų darbus nukopijuoja `Zurnalas` kabliukas.
            const [id] = await irasykPamoka(ivykis.vieta)
            await payload.update({
              collection: 'zurnalas',
              id,
              overrideAccess: true,
              data: {
                ...(tema ? { tema } : {}),
                ...(namuDarbai ? { namuDarbai } : {}),
                ...(atsiliepimas ? { atsiliepimas } : {}),
              },
            })
            return `Įrašyta. Pataisyti: ${svetaine.url}/admin/collections/zurnalas/${id}`
          },
        )
      },
    },
  ]
}

/**
 * Sistemos tekstas modeliui — kiekvienai žinutei iš naujo, nes jame šiandiena.
 *
 * DIENOS SURAŠYTOS. Pigūs modeliai prastai skaičiuoja datas: „kitą
 * penktadienį“ jie paverčia į bet ką. Su sąrašu tai tampa paieška, ne
 * skaičiavimu.
 *
 * MOKINIAI SURAŠYTI, o ne ieškomi įrankiu: jų keliasdešimt, o vardai sakinyje
 * linksniuojami („su Eva“, „Evos“) — modelis juos susieja pats.
 */
async function sistema(payload: Payloadas, dabar: Date): Promise<string> {
  const [{ docs: mokiniai }, { docs: grupes }] = await Promise.all([
    payload.find({
      collection: 'mokiniai',
      where: { aktyvus: { equals: true } },
      sort: 'vardas',
      limit: 1000,
      depth: 0,
      overrideAccess: true,
      select: { vardas: true, klase: true },
    }),
    payload.find({
      collection: 'grupes',
      where: { aktyvi: { equals: true } },
      limit: 500,
      depth: 0,
      overrideAccess: true,
      select: { pavadinimas: true, nariai: true },
    }),
  ])
  const vardai = new Map(mokiniai.map((m) => [String(m.id), m.vardas]))

  const siandien = dataVilniuje(dabar)
  const zyme: Record<string, string> = {
    [pridekDienas(siandien, -1)]: ' (vakar)',
    [siandien]: ' (šiandien)',
    [pridekDienas(siandien, 1)]: ' (rytoj)',
  }

  return [
    'Tu — matematikos korepetitorės asistentas Telegram’e. Kalbi su pačia korepetitore, ne su tėvais.',
    'Atsakyk lietuviškai, trumpai, be Markdown — tekstas rodomas toks, koks yra.',
    '',
    `Dabar ${siandien} ${laikasVilniuje(dabar)}, Lietuvos laiku.`,
    'Dienos — pagal jas versk „rytoj“, „penktadienį“, „kitą savaitę“ į datas:',
    ...Array.from({ length: 22 }, (_, i) => pridekDienas(siandien, i - 7)).map(
      (d) => `${d} ${SAVAITES_DIENOS[savaitesDiena(d) - 1]}${zyme[d] ?? ''}`,
    ),
    '',
    'Mokiniai (id: vardas, klasė):',
    ...mokiniai.map((m) => `${m.id}: ${vaikas(m)}`),
    '',
    grupes.length ? 'Grupės (id: pavadinimas — nariai):' : 'Grupių nėra.',
    ...grupes.map(
      (g) =>
        `${g.id}: ${g.pavadinimas} — ${(g.nariai ?? [])
          .map((n) => vardai.get(String(typeof n === 'object' ? n.id : n)))
          .filter(Boolean)
          .join(', ')}`,
    ),
    '',
    'Taisyklės:',
    '- Pamokas, temas ir laikus imk tik iš įrankių. Nieko neišgalvok.',
    '- Vardus susiek su sąrašu, net jei jie linksniuoti („su Eva“, „Evos“). Jei tinka keli mokiniai — paklausk, kurio.',
    '- Prieš perkeldamas, atšaukdamas ar įrašydamas temą, rask pamoką įrankiu „pamokos“ ir naudok jos raktą.',
    '- Perkelti, atšaukti ir įrašyti temą gali tik įrankiais. Jie patys parodo mygtukus „Taip / Ne“ — tekstu patvirtinimo neklausk ir nesakyk, kad jau padaryta.',
    '- Prašant pamokos juodraščio: temą ir namų darbus imk iš to, ką parašė korepetitorė. Ko ji nesakė, nepildyk.',
    `- Ko negali padaryti, pasakyk tiesiai ir nurodyk CMS: ${svetaine.url}/admin`,
  ].join('\n')
}

/** `/siandien`, `/rytoj` — be modelio, tad veikia ir be OpenRouter rakto. */
async function dienosSarasas(payload: Payloadas, dataISO: string): Promise<string> {
  const { ivykiai, rezervacijos } = await pamokuIvykiai(payload, dataISO, dataISO)
  const eilutes = [
    ...ivykiai.map((i) => ({
      laikas: i.laikas,
      tekstas: `${i.laikas}  ${kas(i)}${i.grupine ? `: ${i.nariai.map((p) => p.mokinys.vardas).join(', ')}` : ''}`,
    })),
    ...rezervacijos.map((r) => ({
      laikas: r.laikas,
      tekstas: `${r.laikas}  rezervacija: ${vaikas({ vardas: r.vaikoVardas, klase: r.klase })}`,
    })),
  ].sort((a, b) => a.laikas.localeCompare(b.laikas))

  return [
    `<b>${html(dataZodziais(dataISO))}</b>`,
    ...(eilutes.length ? eilutes.map((e) => html(e.tekstas)) : ['Pamokų nėra.']),
  ].join('\n')
}

const PAGALBA = [
  'Galiu:',
  '• pranešti prieš pamoką su paskutine tema;',
  '• parodyti pamokas ir žurnalą („ką veikėm su Eva?“);',
  '• perkelti ar atšaukti pamoką („perkelk Evos rytojaus pamoką į 16:00“);',
  '• įrašyti temą ir namų darbus („Evai: daugyba, ND 45 psl. 3–7“).',
  '',
  'Prieš ką nors keisdamas visada paklausiu mygtukais.',
  '/siandien, /rytoj — pamokos be pokalbio',
  '/is_naujo — pamiršti pokalbį',
].join('\n')

const atmintis = new Atmintis()

/** Telegram, negavęs atsakymo laiku, tą patį atnaujinimą atsiunčia dar kartą. */
const matyti = new Set<number>()

/** Vienas Telegram atnaujinimas: žinutė arba mygtuko paspaudimas. */
export async function apdorokTelegrama(
  atnaujinimas: Atnaujinimas,
  a: Aplinka = aplinka(),
  dabar = new Date(),
): Promise<void> {
  if (!a.tg) return
  if (matyti.has(atnaujinimas.update_id)) return
  matyti.add(atnaujinimas.update_id)
  if (matyti.size > 200) matyti.delete(matyti.values().next().value!)

  const pokalbis = atnaujinimas.message?.chat.id ?? atnaujinimas.callback_query?.message?.chat.id
  if (pokalbis == null) return

  // Dar nenustatytam botui — tik pokalbio numeris: kitaip `TELEGRAM_CHAT_ID` nėra iš kur sužinoti.
  if (!a.pokalbis) {
    if (atnaujinimas.message) {
      await a.tg.siusk(
        pokalbis,
        `Šio pokalbio ID: <code>${pokalbis}</code>\nĮrašyk jį į TELEGRAM_CHAT_ID ir perkrauk serverį.`,
      )
    }
    return
  }
  // Svetimiems — tyla.
  if (String(pokalbis) !== a.pokalbis) return

  if (atnaujinimas.callback_query) return mygtukas(atnaujinimas.callback_query, a.tg, a.pokalbis)
  if (atnaujinimas.message) return zinute(atnaujinimas.message, a.tg, a.pokalbis, a.modelis, dabar)
}

async function zinute(
  z: NonNullable<Atnaujinimas['message']>,
  tg: Telegrama,
  pokalbis: string,
  modelis: Modelis | null,
  dabar: Date,
): Promise<void> {
  const klausimas = z.text?.trim()
  if (!klausimas) return tg.siusk(pokalbis, 'Kol kas suprantu tik tekstą.')

  // `/rytoj@vardiklio_bot` — taip komandą atsiunčia, paspaudus ją meniu.
  const komanda = klausimas.startsWith('/') ? klausimas.split(/[\s@]/)[0].toLowerCase() : null
  if (komanda === '/start' || komanda === '/pagalba') return tg.siusk(pokalbis, html(PAGALBA))
  if (komanda === '/is_naujo') {
    atmintis.pamirsk(pokalbis)
    return tg.siusk(pokalbis, 'Pradedam iš naujo.')
  }

  const payload = await getPayload({ config })
  if (komanda === '/siandien' || komanda === '/rytoj') {
    const siandien = dataVilniuje(dabar)
    return tg.siusk(pokalbis, await dienosSarasas(payload, komanda === '/rytoj' ? pridekDienas(siandien, 1) : siandien))
  }

  if (!modelis) {
    return tg.siusk(pokalbis, 'Pokalbiui reikia OPENROUTER_API_KEY. Kol kas veikia /siandien ir /rytoj.')
  }

  await tg.rasau(pokalbis).catch(() => {})
  try {
    const atsakymas = await klausk({
      modelis,
      sistema: await sistema(payload, dabar),
      irankiai: irankiai(payload, dabar),
      istorija: atmintis.istorija(pokalbis),
      klausimas,
    })
    atmintis.papildyk(pokalbis, atsakymas.nauji)

    if (atsakymas.pasiulymas) {
      const raktas = atmintis.idek(atsakymas.pasiulymas)
      await tg.siusk(pokalbis, html(atsakymas.tekstas), [
        [
          { tekstas: 'Taip', duomenys: `t:${raktas}` },
          { tekstas: 'Ne', duomenys: `n:${raktas}` },
        ],
      ])
    } else {
      await tg.siusk(pokalbis, html(atsakymas.tekstas))
    }
  } catch (klaida) {
    console.error('[sekretorius] atsakyti nepavyko:', klaida)
    const priezastis = klaida instanceof Error ? klaida.message : String(klaida)
    await tg.siusk(pokalbis, `Nepavyko: ${html(priezastis.slice(0, 500))}`)
  }
}

/** „Taip / Ne“ po pasiūlymu. Tik čia, paspaudus „Taip“, kas nors pakeičiama. */
async function mygtukas(
  q: NonNullable<Atnaujinimas['callback_query']>,
  tg: Telegrama,
  pokalbis: string,
): Promise<void> {
  const [veiksmas, raktas] = (q.data ?? '').split(':')
  const pasiulymas = raktas ? atmintis.paimk(raktas) : null

  // Mygtukai nuimami — pasiūlymo tekstas lieka, o po juo parašoma, kuo baigėsi.
  const baik = async (pabaiga: string, trumpai: string) => {
    await tg.atsakykMygtukui(q.id, trumpai).catch(() => {})
    if (q.message) {
      await tg.redaguok(pokalbis, q.message.message_id, `${html(q.message.text ?? '')}\n\n${pabaiga}`)
    }
  }

  if (!pasiulymas) return baik('Nebegalioja — paprašyk iš naujo.', 'Nebegalioja')

  if (veiksmas !== 't') {
    atmintis.papildyk(pokalbis, [
      { role: 'user', content: '(Paspaudžiau „Ne“.)' },
      { role: 'assistant', content: 'Nieko nepakeista.' },
    ])
    return baik('✗ Nieko nepakeista.', 'Nieko nepakeista')
  }

  try {
    const rezultatas = await pasiulymas.vykdyk()
    atmintis.papildyk(pokalbis, [
      { role: 'user', content: '(Paspaudžiau „Taip“.)' },
      { role: 'assistant', content: rezultatas },
    ])
    await baik(`✓ ${html(rezultatas)}`, 'Atlikta')
  } catch (klaida) {
    console.error('[sekretorius] veiksmas nepavyko:', klaida)
    await baik(`✗ Nepavyko: ${html(klaida instanceof Error ? klaida.message : String(klaida))}`, 'Nepavyko')
  }
}
