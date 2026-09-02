'use client'

import Script from 'next/script'
import { useSyncExternalStore } from 'react'
import { ADS_ID, GA_ID } from '@/lib/analitika'
import { prenumeruokSutikima, serveryjeNeatsakyta, skaitykSutikima } from '@/lib/slapukai'

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
 * Sutikus leidžiam `analytics_storage`, `ad_storage` ir `ad_user_data`. Pastarųjų
 * dviejų reikia todėl, kad svetainė reklamuojasi Google Ads: be jų konversija
 * (užpildyta registracijos forma) lieka nepriskirta jokiam paspaudimui, ir už
 * reklamą mokama nematant, kuris skelbimas atveda žmones.
 *
 * Kaina žinoma ir priimta sąmoningai: būtent šie raktai verčia gtag'ą kviesti
 * `www.google.com/ccm/collect` ir atsitempti Google paskyros slapukų puokštę
 * (`__Secure-3PSID`, `NID`, `COMPASS` ir kt.). Iki sutikimo jų nėra nė vieno.
 *
 * `ad_personalization` lieka `denied` — jo reikia tik remarketingo auditorijoms,
 * o jų nenaudojam. Prašom tik to, be ko konversijų matavimas neveiktų.
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
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'denied',
  analytics_storage: 'granted'
});
gtag('js', new Date());
gtag('config', '${GA_ID}');
gtag('config', '${ADS_ID}');`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  )
}

export default Analitika
