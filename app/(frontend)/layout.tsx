import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from 'next/font/google'
import Analitika from '@/components/Analitika'
import Navigacija from '@/components/Navigacija'
import Poraste from '@/components/Poraste'
import { svetaine } from '@/lib/kontaktai'
import '../globals.css'

// `latin-ext` privalomas — be jo lūžta ą č ę ė į š ų ū ž.
// Display naudojamas tik 600 svoriu — 400 nekraunam.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  weight: ['600'],
  display: 'swap',
  variable: '--font-bricolage',
})

const instrument = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-instrument',
})

// Mono nenaudojamas virš lanksto — nepreloadinam, kad neužimtų juostos nuo LCP.
const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'],
  display: 'swap',
  preload: false,
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  metadataBase: new URL(svetaine.url),
  title: {
    default: 'Vardiklis — matematikos diagnostika 1–10 klasių mokiniams',
    template: '%s — Vardiklis',
  },
  description:
    'Nemokama diagnostika parodo, kurioje klasėje pradėjo formuotis matematikos spragos — ir kiek laiko prireiks jas pašalinti.',
  openGraph: {
    type: 'website',
    locale: 'lt_LT',
    siteName: 'Vardiklis',
    url: svetaine.url,
    title: 'Vardiklis — matematikos diagnostika 1–10 klasių mokiniams',
    description:
      'Nemokama diagnostika parodo, kurioje klasėje vaikui iš tikrųjų nutrūko matematika.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Vardiklis' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="lt"
      // Glotnus slinkimas galioja tik nuorodoms puslapio viduje („Kaip tai veikia").
      // Šis atributas leidžia Next'ui jį išjungti pereinant į kitą puslapį —
      // kitaip naršyklė lėtai nuslenka į viršų vietoj to, kad tiesiog atidarytų.
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-dvh bg-paper text-ink antialiased">
        <a
          href="#turinys"
          className="be-spausdinimo sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-[6px] focus:border focus:border-line focus:bg-paper focus:px-4 focus:py-2"
        >
          Pereiti prie turinio
        </a>
        <Navigacija />
        <main id="turinys" className="pt-16">
          {children}
        </main>
        <Poraste />
        <Analitika />
      </body>
    </html>
  )
}
