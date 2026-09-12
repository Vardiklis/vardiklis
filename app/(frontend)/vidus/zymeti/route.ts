import { getPayload } from 'payload'
import config from '@payload-config'
import { arTeisingasParasas } from '@/lib/priminimai'
import { svetaine } from '@/lib/kontaktai'
import { vidausNuoroda, vidausPuslapis } from '@/lib/vidaus-puslapis'

/**
 * „Buvo / Nebuvo“ iš dienos santraukos laiško.
 *
 * Tikslas — kad žurnalo nereikėtų pildyti rankomis CMS'e: paspaudi nuorodą
 * laiške ir viskas. Todėl tai `GET`, o ne forma; apsauga — parašas, kurį
 * moka sudaryti tik serveris (žr. `zymejimoParasas`), tad atspėjęs įrašo
 * numerį pašalinis nieko nepakeis.
 *
 * Pažymėjus „Buvo“, mokiniui nusiimama pirmos pamokos varnelė: nuolaida
 * galioja vienai pamokai, o rankinis varnelės nuėmimas anksčiau ar vėliau
 * būtų pamirštas.
 */

export const dynamic = 'force-dynamic'

/** Tik šios dvi būsenos keičiamos iš laiško — „suplanuota“ ir „atidarė“ užsideda pačios. */
const BUSENOS = {
  ivyko: 'Įvyko',
  neivyko: 'Neįvyko',
} as const

type Busena = keyof typeof BUSENOS

const arBusena = (reiksme: string): reiksme is Busena => reiksme in BUSENOS

export async function GET(uzklausa: Request) {
  const url = new URL(uzklausa.url)
  const id = url.searchParams.get('id') ?? ''
  const busena = url.searchParams.get('b') ?? ''
  const parasas = url.searchParams.get('p') ?? ''

  if (!id || !arBusena(busena) || !arTeisingasParasas(id, busena, parasas)) {
    return puslapis('Nuoroda negalioja', 'Patikrinkite, ar ji nebuvo perkirpta laiške.', 400)
  }

  const payload = await getPayload({ config })

  let irasas
  try {
    irasas = (await payload.findByID({
      collection: 'zurnalas',
      id,
      depth: 0,
      overrideAccess: true,
    })) as unknown as { id: string | number; pirmaPamoka?: boolean | null; mokinys?: unknown }
  } catch {
    return puslapis('Įrašo nebėra', 'Pamoka ištrinta iš žurnalo.', 404)
  }

  await payload.update({
    collection: 'zurnalas',
    id,
    overrideAccess: true,
    data: { busena },
  })

  // Nuolaida galioja vienai pamokai — po jos varnelė nusiima pati.
  if (busena === 'ivyko' && irasas.pirmaPamoka && irasas.mokinys) {
    const mokinysId =
      typeof irasas.mokinys === 'object' && irasas.mokinys !== null
        ? (irasas.mokinys as { id: number | string }).id
        : (irasas.mokinys as number | string)
    try {
      await payload.update({
        collection: 'mokiniai',
        id: mokinysId,
        overrideAccess: true,
        data: { pirmaPamoka: false },
      })
    } catch (klaida) {
      console.error('[zymeti] pirmos pamokos varnelės nuimti nepavyko:', klaida)
    }
  }

  return puslapis(
    `Pažymėta: ${BUSENOS[busena]}`,
    'Langą galima uždaryti.',
    200,
    `${svetaine.url}/admin/collections/zurnalas`,
  )
}

/** Vietinis vardas bendram puslapiui — kad iškvietimai liktų trumpi. */
function puslapis(
  antraste: string,
  tekstas: string,
  statusas: number,
  nuoroda?: string,
): Response {
  return vidausPuslapis(
    antraste,
    tekstas,
    statusas,
    nuoroda ? vidausNuoroda(nuoroda, 'Atidaryti žurnalą') : undefined,
  )
}
