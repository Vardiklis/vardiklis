import Script from 'next/script'

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
 * `afterInteractive` — Next'o rekomendacija analitikai: kraunama anksti, bet po
 * pirmojo puslapio atvaizdavimo, kad nestabdytų turinio.
 *
 * Vietinėje aplinkoje neįjungiam, kad kūrimo metu negadintume statistikos.
 */
export function Analitika() {
  if (process.env.NODE_ENV !== 'production') return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      {/* Inline skriptui `id` privalomas — kitaip Next'as jo neatseka. */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  )
}

export default Analitika
