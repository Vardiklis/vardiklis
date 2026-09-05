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
  // Clarity testo nefilmuoja: `data-clarity-mask` uždengia visą šią šaką seansų
  // peržiūrose, tad į įrašą nepatenka nei uždaviniai, nei vaiko atsakymai.
  return (
    <div className="turinys sekcija" data-clarity-mask="true">
      <Antraste lygis={1} dydis="display-l">
        Diagnostika
      </Antraste>

      <Testas />
    </div>
  )
}
