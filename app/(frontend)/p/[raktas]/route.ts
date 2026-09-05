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
 * Atsakymas — permetimas, be jokio turinio: pašalinis, atspėjęs raktą, iš čia
 * neišpeš nei vardo, nei el. pašto.
 */

const BE_KESO = { 'Cache-Control': 'no-store' }

/** Kiek nuo pamokos pradžios paspaudimas dar laikomas atėjimu į pamoką. */
const PRIES_MIN = 60
const PO_MIN = 120

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

  // Įrašom prieš permetant, bet klaida čia neturi sugriauti prisijungimo:
  // vaikui svarbu patekti į pamoką, o žurnalas yra mano patogumas.
  try {
    await zymekAtidaryma(payload, mokinys.id)
  } catch (klaida) {
    console.error('[p] žurnalo įrašyti nepavyko:', klaida)
  }

  return Response.redirect(mokinys.meetNuoroda, 302)
}

async function zymekAtidaryma(
  payload: Awaited<ReturnType<typeof getPayload>>,
  mokinysId: number | string,
): Promise<void> {
  const dabar = new Date()
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
    depth: 0,
    overrideAccess: true,
  })

  /**
   * Vakare gautą laišką tėvai neretai atsidaro iš karto — tai dar ne
   * atėjimas į rytojaus pamoką. Todėl žymim tik tada, kai paspaudimas
   * patenka į pamokos langą.
   */
  const irasas = (
    docs as unknown as {
      id: string | number
      data: string
      laikas?: string | null
      busena?: string | null
    }[]
  ).find((d) => {
    if (!d.laikas) return false
    const pradzia = momentas(d.data, d.laikas).getTime()
    const skirtumas = (dabar.getTime() - pradzia) / 60000
    return skirtumas >= -PRIES_MIN && skirtumas <= PO_MIN
  })

  if (!irasas || irasas.busena !== 'suplanuota') return

  await payload.update({
    collection: 'zurnalas',
    id: irasas.id,
    overrideAccess: true,
    data: { busena: 'atidare', atidaryta: dabar.toISOString() },
  })
}
