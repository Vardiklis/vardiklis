import Antraste from '@/components/Antraste'
import { meta } from '@/lib/metaduomenys'
import Testas from './Testas'

export const metadata = meta({
  antraste: 'Nemokama matematikos diagnostika',
  aprasymas:
    'Nemokamas testas parodo, kurioje klasėje vaikui iš tikrųjų nutrūko matematika. Trunka apie 15 minučių, registruotis nereikia.',
  kelias: '/testas',
  ogAprasymas:
    'Testas atseka temas atgal, kol randa vietą, kur vaikas dar tvirtas. Trunka apie 15 minučių.',
})

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
