import Link from 'next/link'
import { kontaktai, svetaine } from '@/lib/kontaktai'
import { nuorodos } from '@/lib/nuorodos'
import Logotipas from './Logotipas'

export function Poraste() {
  const metai = new Date().getFullYear()

  return (
    <footer className="be-spausdinimo border-t border-line bg-paper-2">
      <div className="turinys grid gap-10 py-14 md:grid-cols-[1fr_auto_auto] md:gap-16">
        <div>
          <Logotipas suPrierasu dydis="didelis" />
          <p className="mt-5 max-w-xs t-small text-muted">
            Matematikos diagnostika ir korepetitoriaus pagalba 1–10 klasių mokiniams.
          </p>
        </div>

        <nav aria-label="Poraštė">
          <h2 className="t-small font-semibold">Svetainė</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {nuorodos.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="t-small text-muted hover:text-orange">
                  {n.tekstas}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privatumas" className="t-small text-muted hover:text-orange">
                Privatumas
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="t-small font-semibold">Kontaktai</h2>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <a
                href={`mailto:${kontaktai.elPastas}`}
                className="t-small text-muted hover:text-orange"
              >
                {kontaktai.elPastas}
              </a>
            </li>
            <li>
              <a
                href={`tel:${kontaktai.telefonasNuoroda}`}
                className="t-small text-muted hover:text-orange"
              >
                {kontaktai.telefonas}
              </a>
            </li>
            <li className="t-small text-muted">{kontaktai.vietove}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="turinys flex flex-col gap-2 py-5 t-small text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {metai} {svetaine.pavadinimas}
          </p>
          <p>Rezultatų nesaugome. Testas gyvuoja tik jūsų naršyklėje.</p>
        </div>
      </div>
    </footer>
  )
}

export default Poraste
