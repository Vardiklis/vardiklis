import type { AdminViewServerProps } from 'payload'
import { Gutter, SetStepNav } from '@payloadcms/ui'
import { gautiAtsiskaitymus } from '@/lib/kainos'
import { isafNustatymai } from '@/lib/isaf'
import { isafRinkmena } from '@/lib/isaf-xml'
import { data as dataVilniuje } from '@/lib/laikas'
import { menesiuSarasas, menesioApzvalga } from '@/lib/saskaitos'
import { SaskaituValdiklis } from './SaskaituValdiklis'

/**
 * Skydelio langas `/admin/saskaitos`.
 *
 * SERVERIO KOMPONENTAS: visi duomenys surenkami čia ir paduodami klientui
 * jau paruošti. Taip naršyklė negauna nei mokinių sąrašo, nei kainų
 * skaičiavimo — tik tai, kas rodoma ekrane.
 *
 * NUMATYTASIS MĖNUO — PRAĖJĘS. Sąskaita išrašoma už tai, kas jau įvyko, tad
 * atsidarius langą rugsėjį pirmiausia rūpi rugpjūtis. Kitą mėnesį pasirenkant
 * adresas keičiasi į `?menuo=2026-07`, tad langą galima įsidėti į žymes.
 */

export async function SaskaituVaizdas({ searchParams }: AdminViewServerProps) {
  const menesiai = menesiuSarasas(new Date(), 18)
  const prasytas = typeof searchParams?.menuo === 'string' ? searchParams.menuo : null
  const pasirinktas =
    prasytas && menesiai.some((m) => m.raktas === prasytas)
      ? prasytas
      : // Sąrašas prasideda praėjusiu mėnesiu; jei jo kažkodėl nėra — šis.
        (menesiai[0]?.raktas ?? dataVilniuje(new Date()).slice(0, 7))

  const apzvalga = await menesioApzvalga(pasirinktas)
  const nustatymai = await gautiAtsiskaitymus()

  /**
   * i.SAF skydelis rodomas tik įjungus jį nustatymuose. Kol sertifikato nėra,
   * keturi neveikiantys mygtukai tik trukdytų — o rinkmeną vis tiek galima
   * atsisiųsti ir įkelti ranka.
   */
  const rinkmena = nustatymai.isafIjungta ? await isafRinkmena(pasirinktas) : null
  const isafBusena =
    apzvalga.saskaitos.find((s) => s.isafBusena !== 'neteikta')?.isafBusena ?? 'neteikta'

  return (
    <>
      <SetStepNav nav={[{ label: 'Sąskaitos' }]} />
      <Gutter>
        <h1>Sąskaitos</h1>
        <SaskaituValdiklis
          apzvalga={apzvalga}
          menesiai={menesiai}
          isaf={{
            rodyti: Boolean(nustatymai.isafIjungta),
            arSertifikatas: isafNustatymai() !== null,
            aplinka: process.env.ISAF_APLINKA?.trim() === 'prod' ? 'gyva' : 'demo',
            saskaitu: rinkmena?.saskaitos.length ?? 0,
            klaidos: rinkmena?.klaidos ?? [],
            busena: isafBusena,
          }}
        />
      </Gutter>
    </>
  )
}
