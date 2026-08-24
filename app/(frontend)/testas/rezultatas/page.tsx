import type { Metadata } from 'next'
import Rezultatas from './Rezultatas'

export const metadata: Metadata = {
  title: 'Diagnostikos ataskaita',
  // Ataskaita yra asmeninė ir gyvuoja tik naršyklėje — paieškos sistemoms
  // čia nėra ko indeksuoti (9 skyrius).
  robots: { index: false, follow: false },
}

export default function RezultatoPuslapis() {
  return (
    <div className="turinys sekcija">
      <Rezultatas />
    </div>
  )
}
