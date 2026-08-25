import Link from 'next/link'
import { kontaktai, svetaine } from '@/lib/kontaktai'
import { nuorodos } from '@/lib/nuorodos'
import Logotipas from './Logotipas'

export function Poraste() {
  const metai = new Date().getFullYear()

  return (
    <footer className="be-spausdinimo border-t border-line bg-paper-2">
      <div className="turinys grid gap-10 py-14 md:grid-cols-[1fr_auto_auto_auto] md:gap-14">
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

        <div>
          <h2 className="t-small font-semibold">Socialiniai tinklai</h2>
          <ul className="mt-3 flex gap-3">
            <li>
              <a
                href={kontaktai.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vardiklis Facebook'e"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-orange"
              >
                {/* Facebook „f" — vienas kelias, dažomas `currentColor`,
                    tad spausdinant pajuoduoja kartu su visu kitu. */}
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
                </svg>
              </a>
            </li>
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
