import { atsiliepimai, atsiliepimuSaltinis, vidutinisIvertinimas } from '@/lib/atsiliepimai'
import { kainos, kontaktai, svetaine } from '@/lib/kontaktai'

/**
 * Struktūrinti duomenys landing puslapiui (9 skyrius).
 * `LocalBusiness` — korepetitorė dirba konkrečioje vietovėje ir nuotoliu.
 *
 * ATSILIEPIMAI IR ŽVAIGŽDUTĖS. `aggregateRating` ir `review` čia palikti, nes
 * jie teisingi ir naudingi kitiems duomenų skaitytojams, BET Google žvaigždučių
 * iš jų nerodys ir nerodys niekada. Google taisyklė: jei atsiliepimus apie save
 * valdo pati įmonė, jos puslapiai su `LocalBusiness` (ar bet kuriuo kitu
 * `Organization` potipiu) yra „ineligible for star review feature“. `publisher:
 * paslaugos.lt` to NEIŠSPRENDŽIA — taisyklė aiškiai apima ir per trečiąją šalį
 * surinktus atsiliepimus, perkeltus į savo svetainę.
 * https://developers.google.com/search/docs/appearance/structured-data/review-snippet
 *
 * Tikros žvaigždutės paieškoje ateina iš Google Verslo Profilio, ne iš čia.
 */
export function JsonLd() {
  const duomenys = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${svetaine.url}/#vardiklis`,
    name: svetaine.pavadinimas,
    description:
      'Matematikos korepetitorė internetu 1–10 klasių mokiniams: individualios ir grupinės pamokos, pasiruošimas NMPP ir PUPP. Nemokamas testas parodo, kurioje klasėje vaikui nutrūko matematika.',
    url: svetaine.url,
    email: kontaktai.elPastas,
    telephone: kontaktai.telefonas,
    image: `${svetaine.url}/og.png`,
    // Kvadratinis ženklas žinių skydeliui — Google reikalauja bent 112×112 ir
    // kad gerai atrodytų ant balto fono. Imamas iš `public/`, o ne `app/icon.png`,
    // nes Next'as prie `app/` ikonų prikabina turinio maišą (`?abc123`), o Google
    // prašo stabilaus adreso.
    logo: `${svetaine.url}/logotipas.png`,
    priceRange: `${Math.min(...kainos.map((k) => k.eurai))}–${Math.max(
      ...kainos.map((k) => k.eurai),
    )} €`,
    areaServed: { '@type': 'Country', name: 'Lietuva' },
    address: {
      '@type': 'PostalAddress',
      ...(kontaktai.miestas ? { addressLocality: kontaktai.miestas } : {}),
      addressCountry: 'LT',
    },
    founder: {
      '@type': 'Person',
      name: kontaktai.vardas,
      jobTitle: kontaktai.pareigos,
    },
    knowsLanguage: 'lt',
    sameAs: [kontaktai.facebook, atsiliepimuSaltinis.url],
    makesOffer: kainos.map((k) => ({
      '@type': 'Offer',
      price: k.eurai,
      priceCurrency: 'EUR',
      itemOffered: {
        '@type': 'Service',
        name: `${k.pavadinimas} — matematika 1–10 klasių mokiniams`,
        description: k.paaiskinimas,
      },
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      // `toFixed(1)` — kitaip 4.888888888888889 keliauja į HTML.
      ratingValue: Number(vidutinisIvertinimas.toFixed(1)),
      reviewCount: atsiliepimai.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: atsiliepimai.map((a) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: a.vardas },
      datePublished: a.data,
      reviewBody: a.tekstas,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: a.ivertinimas,
        bestRating: 5,
        worstRating: 1,
      },
      publisher: {
        '@type': 'Organization',
        name: atsiliepimuSaltinis.pavadinimas,
        url: atsiliepimuSaltinis.url,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(duomenys) }}
    />
  )
}

export default JsonLd
