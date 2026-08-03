import { kontaktai, svetaine } from '@/lib/kontaktai'

/**
 * Struktūrinti duomenys landing puslapiui (9 skyrius).
 * `LocalBusiness` — korepetitorė dirba konkrečioje vietovėje ir nuotoliu.
 */
export function JsonLd() {
  const duomenys = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${svetaine.url}/#vardiklis`,
    name: svetaine.pavadinimas,
    description:
      'Matematikos diagnostika ir korepetitoriaus pagalba 1–10 klasių mokiniams. Nemokamas testas parodo, kurioje klasėje vaikui nutrūko matematika.',
    url: svetaine.url,
    email: kontaktai.elPastas,
    telephone: kontaktai.telefonas,
    image: `${svetaine.url}/og.png`,
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
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Matematikos korepetitoriaus pamokos 1–10 klasių mokiniams',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
       
      dangerouslySetInnerHTML={{ __html: JSON.stringify(duomenys) }}
    />
  )
}

export default JsonLd
