import { getPayload } from 'payload'
import config from '@payload-config'
import { data as dataVilniuje, momentas, pridekDienas } from '@/lib/laikas'

/**
 * Pamokos nuoroda, siunčiama tėvams: `vardiklis.lt/p/<raktas>`.
 *
 * KODĖL NE TIESIOG MEET NUORODA. Nemokamoje Google paskyroje sužinoti, kas
 * prisijungė prie skambučio, neįmanoma: Meet REST API dirba tik su Workspace
 * paskyrų vedamais skambučiais, o dalyvavimo ataskaitos yra mokamuose planuose.
 * Tad artimiausias pasiekiamas dalykas — užfiksuoti, kad nuoroda atidaryta.
 *
 * Raktas PASTOVUS, o ne vienkartinis: vaikas nuorodą įsideda į žymes, ir taip
 * sekimas veikia toliau, o pakeitus Meet kambarį Payload'e sena žyma pati
 * atveda į naują — tėvams nieko pranešinėti nereikia.
 *
 * VIENAS RAKTAS, DU KAMBARIAI. Tas pats vaikas gali turėti ir individualių, ir
 * grupinių pamokų, o kambariai jiems skirtingi. Todėl nuoroda vedama ne pagal
 * kortelę, o pagal ARTIMIAUSIĄ žurnalo įrašą: grupinei pamokai atiduodamas
 * grupės kambarys, individualiai — vaiko. Taip tėvams lieka viena nuoroda
 * visam laikui, o ne dvi, kurias reikėtų nepainioti.
 *
 * Atsakymas — permetimas, be jokio turinio: pašalinis, atspėjęs raktą, iš čia
 * neišpeš nei vardo, nei el. pašto.
 */

const BE_KESO = { 'Cache-Control': 'no-store' }

/** Kiek nuo pamokos pradžios paspaudimas dar laikomas atėjimu į pamoką. */
const PRIES_MIN = 60
const PO_MIN = 120

type ZurnaloIrasas = {
  id: string | number
  data: string
  laikas?: string | null
  busena?: string | null
  grupe?: { meetNuoroda?: string | null } | number | string | null
}

export async function GET(_uzklausa: Request, ctx: RouteContext<'/p/[raktas]'>) {
  const { raktas } = await ctx.params

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'mokiniai',
    where: { raktas: { equals: raktas } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const mokinys = docs[0] as unknown as
    | { id: number | string; meetNuoroda?: string | null }
    | undefined

  if (!mokinys?.meetNuoroda) {
    return new Response('Nuoroda nerasta.', { status: 404, headers: BE_KESO })
  }

  const dabar = new Date()

  /**
   * Žurnalo klaida neturi sugriauti prisijungimo: vaikui svarbu patekti į
   * pamoką, o žurnalas yra mano patogumas. Todėl nepavykus einam toliau su
   * vaiko kambariu — jis visada užpildytas.
   */
  let artimiausia: ZurnaloIrasas | null = null
  try {
    artimiausia = await artimiausiaPamoka(payload, mokinys.id, dabar)
    if (artimiausia) await zymekAtidaryma(payload, artimiausia, dabar)
  } catch (klaida) {
    console.error('[p] žurnalo įrašyti nepavyko:', klaida)
  }

  return Response.redirect(kambarys(artimiausia) ?? mokinys.meetNuoroda, 302)
}

/**
 * Grupės kambarys, jei pamoka grupinė.
 *
 * `depth: 1` grąžina grupės dokumentą, bet ryšys gali būti ir vien numeris
 * (grupė ištrinta arba gylis kitoks) — tada grįžtam prie vaiko kambario.
 */
function kambarys(irasas: ZurnaloIrasas | null): string | null {
  const grupe = irasas?.grupe
  if (!grupe || typeof grupe !== 'object') return null
  return grupe.meetNuoroda?.trim() || null
}

/**
 * Šios dienos ar rytojaus pamoka, laike arčiausia dabarties.
 *
 * Į kurį kambarį vesti, sprendžiama PLAČIAI: tėvai neretai spusteli likus
 * valandoms, o nusiuntus juos į ne tą kambarį vaikas liktų vienas tuščiame
 * skambutyje. Ar tai jau laikyti atėjimu į pamoką — atskiras, siauresnis
 * klausimas (žr. `zymekAtidaryma`).
 */
async function artimiausiaPamoka(
  payload: Awaited<ReturnType<typeof getPayload>>,
  mokinysId: number | string,
  dabar: Date,
): Promise<ZurnaloIrasas | null> {
  const siandien = dataVilniuje(dabar)

  const { docs } = await payload.find({
    collection: 'zurnalas',
    where: {
      and: [
        { mokinys: { equals: mokinysId } },
        { data: { in: [siandien, pridekDienas(siandien, 1)] } },
      ],
    },
    limit: 10,
    // Reikia grupės Meet nuorodos, tad vienas lygis gilyn.
    depth: 1,
    overrideAccess: true,
  })

  let arciausia: ZurnaloIrasas | null = null
  let maziausias = Infinity
  for (const d of docs as unknown as ZurnaloIrasas[]) {
    if (!d.laikas) continue
    const skirtumas = Math.abs(momentas(d.data, d.laikas).getTime() - dabar.getTime())
    if (skirtumas < maziausias) {
      maziausias = skirtumas
      arciausia = d
    }
  }
  return arciausia
}

/**
 * Vakare gautą laišką tėvai neretai atsidaro iš karto — tai dar ne atėjimas į
 * rytojaus pamoką. Todėl žymim tik tada, kai paspaudimas patenka į pamokos
 * langą.
 */
async function zymekAtidaryma(
  payload: Awaited<ReturnType<typeof getPayload>>,
  irasas: ZurnaloIrasas,
  dabar: Date,
): Promise<void> {
  if (!irasas.laikas || irasas.busena !== 'suplanuota') return

  const pradzia = momentas(irasas.data, irasas.laikas).getTime()
  const skirtumas = (dabar.getTime() - pradzia) / 60000
  if (skirtumas < -PRIES_MIN || skirtumas > PO_MIN) return

  await payload.update({
    collection: 'zurnalas',
    id: irasas.id,
    overrideAccess: true,
    data: { busena: 'atidare', atidaryta: dabar.toISOString() },
  })
}
