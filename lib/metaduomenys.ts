import type { Metadata } from 'next'
import { svetaine } from './kontaktai'

/**
 * Vienoda puslapių metaduomenų gamykla.
 *
 * Kam jos reikia. Next'as `openGraph` NESULIEJA su maketo reikšmėmis — puslapiui
 * aprašius nors vieną `openGraph` lauką, visas maketo blokas pakeičiamas.
 * Dėl to kiekvienas puslapis, nurodęs vien `openGraph.title`, tyliai prarasdavo
 * `og:image`, `og:site_name`, `og:locale` ir `og:url`: dalijantis nuoroda
 * Messenger'yje ar Facebook'e vietoj paveikslėlio likdavo tuščia.
 *
 * Antra bėda — `title` ir `og:title` buvo rašomi ranka atskirai, tad ilgainiui
 * ėmė skirtis. Čia jie sudaromi iš to paties `antraste`, tad išsiskirti nebegali.
 *
 * Naudojimas:
 *   export const metadata = meta({
 *     antraste: 'Susisiekti',
 *     aprasymas: '…',
 *     kelias: '/susisiekti',
 *   })
 */
type Args = {
  /**
   * Antraštė BE „— Vardiklis" — priesagą pridedam patys, kad visur ji
   * atrodytų vienodai. Pilną, savo pačių sudarytą antraštę duok per `pilna`.
   */
  antraste?: string
  /** Pilna antraštė, kai jos forma svarbi (pvz. užsakovės nurodyta pradiniam). */
  pilna?: string
  aprasymas: string
  /** Kanoninis kelias, pvz. `/susisiekti`. Pradiniam puslapiui — `/`. */
  kelias: string
  /** OG aprašymas, jei socialiniams tinklams jis turi būti kitoks nei paieškai. */
  ogAprasymas?: string
  /** `article` straipsniams; kitur numatytasis `website`. */
  tipas?: 'website' | 'article'
  /** Straipsnio paskelbimo laikas ISO formatu. */
  paskelbta?: string
  /** Paveikslėlis, jei puslapis turi savo. Nenurodžius imamas `/og.png`. */
  paveikslelis?: string
}

const NUMATYTASIS_PAVEIKSLELIS = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: svetaine.pavadinimas,
}

export function meta({
  antraste,
  pilna,
  aprasymas,
  kelias,
  ogAprasymas,
  tipas = 'website',
  paskelbta,
  paveikslelis,
}: Args): Metadata {
  const pilnaAntraste = pilna ?? `${antraste} — ${svetaine.pavadinimas}`

  return {
    // `absolute` — kitaip maketo šablonas („%s — Vardiklis") pridėtų priesagą
    // antrą kartą ir antraštė baigtųsi „— Vardiklis — Vardiklis".
    title: { absolute: pilnaAntraste },
    description: aprasymas,
    alternates: { canonical: kelias },
    openGraph: {
      // Ta pati eilutė kaip `<title>` — dvi rankomis rašytos versijos anksčiau
      // ėmė skirtis, o dabar išsiskirti fiziškai negali.
      title: pilnaAntraste,
      description: ogAprasymas ?? aprasymas,
      type: tipas,
      locale: 'lt_LT',
      siteName: svetaine.pavadinimas,
      url: `${svetaine.url}${kelias === '/' ? '' : kelias}`,
      images: [paveikslelis ? { url: paveikslelis } : NUMATYTASIS_PAVEIKSLELIS],
      ...(tipas === 'article' && paskelbta ? { publishedTime: paskelbta } : {}),
    },
  }
}
