import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav } from '@payloadcms/ui'
import { arData, savaitesKalendorius, savaitesPirmadienis } from '@/lib/kalendorius'
import { data as dataVilniuje } from '@/lib/laikas'
import { KalendoriausSavaite } from './KalendoriausSavaite'

/**
 * Skydelio langas `/admin/kalendorius` — visų pamokų savaitė, kaip Google
 * kalendoriuje. Paspaudus pamoką atsidaro jos žurnalo įrašas, nutempus —
 * pamoka perkeliama, paspaudus tuščią vietą — įrašoma papildoma.
 *
 * Duomenys surenkami serveryje (`lib/kalendorius.ts`), o naršyklė gauna tik
 * tai, kas rodoma: vardus, laikus ir nuorodas į įrašus.
 *
 * Savaitė — adrese (`?savaite=2026-11-02`), tad ją galima įsidėti į žymes, o
 * „atgal“ naršyklėje grąžina į ankstesnę. Bet kuri data virsta savo savaitės
 * pirmadieniu.
 *
 * Maketas — `DefaultTemplate` rankomis, dėl tų pačių priežasčių kaip
 * `SaskaituVaizdas.tsx`.
 */
export async function KalendoriausVaizdas({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult

  const prasyta = searchParams?.savaite
  const diena = arData(prasyta) ? prasyta : dataVilniuje(new Date())
  const savaite = await savaitesKalendorius(savaitesPirmadienis(diena))

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
      visibleEntities={{
        collections: visibleEntities?.collections,
        globals: visibleEntities?.globals,
      }}
    >
      <SetStepNav nav={[{ label: 'Kalendorius' }]} />
      <Gutter>
        <h1>Kalendorius</h1>
        <KalendoriausSavaite savaite={savaite} />
      </Gutter>
    </DefaultTemplate>
  )
}
