import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
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
 * NUMATYTASIS MĖNUO — EINAMASIS. Iki mėnesio pabaigos sąskaitos dar niekas
 * neišrašo, bet matyti, kiek pamokų jau susikaupė ir kaip atrodytų juodraščiai,
 * reikia bet kurią dieną. Praėjęs mėnuo yra už vieno paspaudimo sąraše, o
 * adresas keičiasi į `?menuo=2026-08`, tad langą galima įsidėti į žymes.
 *
 * MAKETĄ PIEŠIA PATS LANGAS. Payload savo langus apvynioja `DefaultTemplate`
 * (šoninė navigacija, viršus, „breadcrumb“), bet SAVO langams jo neprideda:
 * `getRouteData` tokiam maršrutui palieka `templateType` neapibrėžtą, ir
 * `Root` tada atiduoda gryną komponentą be jokio rėmo. Todėl šablonas
 * iškviečiamas čia rankomis, o reikšmės jam imamos iš `initPageResult` —
 * lygiai tos pačios, kurias Payload paduoda savo langams.
 */

export async function SaskaituVaizdas({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult

  const menesiai = menesiuSarasas(new Date(), 18)
  const prasytas = typeof searchParams?.menuo === 'string' ? searchParams.menuo : null
  const pasirinktas =
    prasytas && menesiai.some((m) => m.raktas === prasytas)
      ? prasytas
      : // Sąrašas prasideda einamuoju mėnesiu; jei sąrašas tuščias — jis pats.
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
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={req.user ?? undefined}
      /**
       * Laukai perduodami po vieną, o ne visas `visibleEntities` objektas:
       * React 19 jį laiko tik skaitomu, ir atidavus kaip yra šablonas nulūžta
       * su „Cannot assign to read only property“. Taip daro ir pats Payload.
       */
      visibleEntities={{
        collections: visibleEntities?.collections,
        globals: visibleEntities?.globals,
      }}
    >
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
    </DefaultTemplate>
  )
}
