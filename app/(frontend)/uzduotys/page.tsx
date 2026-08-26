import Link from 'next/link'
import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import { meta } from '@/lib/metaduomenys'
import { KLASES, klasesNuoroda } from '@/lib/uzduotys-klasems'
import UzduociuGeneratorius from './UzduociuGeneratorius'

export const metadata = meta({
  antraste: 'Uždavinių generatorius',
  aprasymas:
    'Nemokamas matematikos uždavinių generatorius 1–10 klasėms: trupmenos, lygtys, procentai, laipsniai. Kiekvieną kartą nauji uždaviniai su tvarkingais atsakymais.',
  kelias: '/uzduotys',
  ogAprasymas:
    'Nemokamas matematikos uždavinių generatorius 1–10 klasėms. Sugeneruok, atsispausdink, spręsk.',
})

export default function Uzduotys() {
  return (
    <div className="turinys sekcija">
      <Antraste
        lygis={1}
        dydis="display-l"
        paantraste="Visos 1–10 klasių programos temos vienoje vietoje. Kiekvieną kartą sugeneruojami nauji uždaviniai su tais pačiais principais. Skaičiai parenkami taip, kad atsakymai būtų tvarkingi, o ne bjaurios trupmenos."
        className="be-spausdinimo"
      >
        Uždavinių biblioteka
      </Antraste>

      {/* Nuorodos į klasių puslapius. Generatorius turinį kuria naršyklėje ir
          jokio adreso nepalieka, tad be šių nuorodų klasių puslapių nerastų nei
          žmogus, nei Google — nuoroda iš čia yra vienintelis kelias į juos. */}
      <nav aria-label="Uždaviniai pagal klasę" className="be-spausdinimo mt-10">
        <h2 className="t-small font-semibold">Paruošti uždaviniai su atsakymais</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {KLASES.map((k) => (
            <li key={k}>
              <Link
                href={`/uzduotys/${klasesNuoroda(k)}`}
                className="inline-flex rounded-[6px] border border-line px-3.5 py-1.5 t-small transition-colors hover:border-ink hover:text-orange"
              >
                {k} klasė
              </Link>
            </li>
          ))}
        </ul>
        <p className="tekstas mt-3 t-small text-muted">
          Nesikeičiantys lapai, kuriuos galima išsisaugoti ar duoti vaikui. Žemiau esantis
          generatorius kaskart sukuria naujus.
        </p>
      </nav>

      <BruksnysDivider className="be-spausdinimo mt-12 mb-12" />

      <UzduociuGeneratorius />
    </div>
  )
}
