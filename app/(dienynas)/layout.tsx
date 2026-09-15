import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google'
import { svetaine } from '@/lib/kontaktai'
import '../globals.css'

/**
 * Dienyno šakninis išdėstymas — atskiras nuo svetainės.
 *
 * KODĖL NE `(frontend)`. Ten gyvena navigacija, nuolaidos juostelė, slapukų
 * sutikimas ir analitika (MS Clarity). Vaiko namų darbų puslapyje reklamos
 * juostelė nereikalinga, o seanso įrašymas būtų tiesiog netinkamas: jame
 * matytųsi vaiko vardas ir pamokos. Todėl dienynas turi savo `<html>`.
 */

// `latin-ext` privalomas — be jo lūžta ą č ę ė į š ų ū ž.
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

export const metadata: Metadata = {
  metadataBase: new URL(svetaine.url),
  title: { default: 'Dienynas — Vardiklis', template: '%s — Vardiklis dienynas' },
  // Asmeninis puslapis: paieškoje jam ne vieta.
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#FBF8F2',
}

export default function DienynoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt" className={`${bricolage.variable} ${instrument.variable}`}>
      <body className="min-h-dvh bg-paper text-ink antialiased">{children}</body>
    </html>
  )
}
