import type { Metadata } from 'next'
import Antraste from '@/components/Antraste'
import Testas from './Testas'

export const metadata: Metadata = {
  title: 'Nemokama matematikos diagnostika',
  description:
    'Nemokamas testas parodo, kurioje klasėje vaikui iš tikrųjų nutrūko matematika. Trunka apie 15 minučių, registruotis nereikia.',
  openGraph: {
    title: 'Nemokama matematikos diagnostika — Vardiklis',
    description:
      'Testas atseka temas atgal, kol randa vietą, kur vaikas dar tvirtas. Trunka apie 15 minučių.',
  },
}

export default function TestoPuslapis() {
  return (
    <div className="turinys sekcija">
      <Antraste lygis={1} dydis="display-l">
        Diagnostika
      </Antraste>

      <Testas />
    </div>
  )
}
