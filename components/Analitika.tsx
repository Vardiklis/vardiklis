'use client'

import Script from 'next/script'
import { useSyncExternalStore } from 'react'
import { prenumeruokSutikima, serveryjeNeatsakyta, skaitykSutikima } from '@/lib/slapukai'

/** Google Analytics 4 matavimo ID. Viešas — jį matyti ir naršyklės kode. */
export const GA_ID = 'G-YTHQ4HB2G4'

/**
 * Google tag (gtag.js) visai svetainei.
 *
 * Įdėtas į `app/(frontend)/layout.tsx`, todėl automatiškai galioja KIEKVIENAM
 * puslapiui — ir tiems, kurie dar bus sukurti, ir straipsniams, kurie atsiranda
 * per Payload CMS (`/straipsniai/[nuoroda]`). Naujam puslapiui nieko pridėti
 * nereikia: pakanka, kad jis būtų po `(frontend)` maketu.
 *
 * SVARBU — skriptai įdedami TIK tada, kai žmogus paspaudė „Sutinku“ juostoje
 * (`SlapukuSutikimas`). Neatsakius arba atmetus į Google neiškeliauja nė vienas
 * užklausimas, tad ir slapukų neatsiranda. Todėl:
 *   • sutikimas yra tikras, o ne dekoratyvinis — GDPR reikalauja būtent tokio;
 *   • „Lighthouse“ ir „PageSpeed“ svetainę mato be sutikimo, tad trečiųjų šalių
 *     slapukų sąraše nebelieka nieko ir „Best practices“ įspėjimas dingsta.
 *
 * Sutikus leidžiam TIK `analytics_storage`. Reklamos raktai lieka `denied`, nes
 * svetainėje reklamos nėra — o būtent jie versdavo gtag'ą kviesti
 * `www.google.com/ccm/collect` ir tempti visą Google paskyros slapukų puokštę
 * (`__Secure-3PSID`, `NID`, `COMPASS` ir kt.). Su `denied` to skambučio nebėra.
 *
 * `afterInteractive` — Next'o rekomendacija analitikai: kraunama anksti, bet po
 * pirmojo puslapio atvaizdavimo, kad nestabdytų turinio.
 *
 * Vietinėje aplinkoje neįjungiam, kad kūrimo metu negadintume statistikos.
 */
export function Analitika() {
  const sutikimas = useSyncExternalStore(
    prenumeruokSutikima,
    skaitykSutikima,
    serveryjeNeatsakyta,
  )

  if (process.env.NODE_ENV !== 'production') return null
  if (sutikimas !== 'sutikta') return null

  return (
    <>
      {/* Sutikimo režimas turi būti `dataLayer`'yje PRIEŠ gtag.js, todėl inline
          skriptas eina pirmas — Next'as `afterInteractive` skriptus paleidžia
          ta pačia tvarka, kokia jie surašyti. Inline skriptui `id` privalomas:
          kitaip Next'as jo neatseka. */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted'
});
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  )
}

export default Analitika
