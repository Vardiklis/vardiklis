import type { Metadata } from 'next'
import Antraste from '@/components/Antraste'
import UzduociuGeneratorius from './UzduociuGeneratorius'

export const metadata: Metadata = {
  title: 'Uždavinių generatorius',
  description:
    'Nemokamas matematikos uždavinių generatorius 3–9 klasėms: trupmenos, lygtys, procentai, laipsniai. Kiekvieną kartą nauji uždaviniai su tvarkingais atsakymais.',
  openGraph: {
    title: 'Uždavinių generatorius — Vardiklis',
    description:
      'Nemokamas matematikos uždavinių generatorius 3–9 klasėms. Sugeneruok, atsispausdink, spręsk.',
  },
}

export default function Uzduotys() {
  return (
    <div className="turinys sekcija">
      <Antraste
        lygis={1}
        dydis="display-l"
        paantraste="Kiekvieną kartą sugeneruojami nauji uždaviniai su tais pačiais principais. Skaičiai parenkami taip, kad atsakymai būtų tvarkingi, o ne bjaurios trupmenos."
        className="be-spausdinimo"
      >
        Uždavinių generatorius
      </Antraste>

      <UzduociuGeneratorius />
    </div>
  )
}
