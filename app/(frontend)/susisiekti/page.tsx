import type { Metadata } from 'next'
import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import Mygtukas from '@/components/Mygtukas'
import { kontaktai } from '@/lib/kontaktai'

export const metadata: Metadata = {
  title: 'Susisiekti',
  description:
    'Modestos, matematikos korepetitorės, telefonas ir el. paštas. Parašykite arba paskambinkite — atsakoma tą pačią dieną.',
  openGraph: {
    title: 'Susisiekti — Vardiklis',
    description:
      'Matematikos korepetitorės Modestos telefonas ir el. paštas. Pamokos 1–10 klasių mokiniams.',
  },
}

// Visa kortelė yra viena nuoroda — telefone pataikyti į patį numerį sunku,
// tad taikinys yra visas plotas, o ne tekstas.
const kortele =
  'group flex items-center justify-between gap-6 rounded-[8px] border border-line bg-paper px-6 py-6 transition-colors hover:border-ink focus-visible:border-ink md:px-8 md:py-7'

export default function Susisiekti() {
  return (
    <div className="turinys sekcija">
      <Antraste
        lygis={1}
        dydis="display-l"
        paantraste="Parašykite arba paskambinkite. Pirmas pokalbis nieko nekainuoja ir niekur neįpareigoja."
      >
        Susisiekti
      </Antraste>

      {/* ── Telefonas ir el. paštas ────────────────────────────────────────── */}
      <ul className="mt-12 flex max-w-2xl flex-col gap-4">
        <li>
          {/* `tel:` be tarpų — su tarpais dalis telefonų numerio nesurenka. */}
          <a href={`tel:${kontaktai.telefonasNuoroda}`} className={kortele}>
            <span className="flex flex-col gap-1">
              <span className="t-small text-muted">Telefonu</span>
              <span className="font-display text-xl font-semibold tracking-[-0.01em] group-hover:text-orange md:text-2xl">
                {kontaktai.telefonas}
              </span>
            </span>
            <span className="t-small shrink-0 text-muted">Skambinti</span>
          </a>
        </li>

        <li>
          <a href={`mailto:${kontaktai.elPastas}`} className={kortele}>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="t-small text-muted">El. paštu</span>
              {/* `break-all` — ilgas adresas siaurame telefone kitaip išverčia kortelę. */}
              <span className="font-display text-lg font-semibold tracking-[-0.01em] break-all group-hover:text-orange md:text-2xl">
                {kontaktai.elPastas}
              </span>
            </span>
            <span className="t-small shrink-0 text-muted">Rašyti</span>
          </a>
        </li>
      </ul>

      <p className="mt-6 t-small text-muted">{kontaktai.vietove}</p>

      {/* ── Ko tikėtis ─────────────────────────────────────────────────────── */}
      <section className="mt-20">
        <BruksnysDivider className="mb-8" />
        <h2 className="t-h2">Ko tikėtis</h2>

        <div className="tekstas mt-6 flex flex-col gap-4 t-body text-muted">
          <p>
            Rašydami trumpai parašykite, kelintoje klasėje vaikas ir kas konkrečiai nesiseka —
            taip pirmas atsakymas bus konkretesnis už „susitarkim dėl pamokos“.
          </p>
          <p>
            Jei norite, prieš rašydami galite atlikti nemokamą diagnostiką. Ji parodo, kurioje
            klasėje spraga prasidėjo, ir tą ataskaitą galėsime aptarti iš karto.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Mygtukas href="/testas">Pradėti diagnostiką</Mygtukas>
          <Mygtukas href="/apie" variantas="konturas">
            Apie Modestą
          </Mygtukas>
        </div>
      </section>
    </div>
  )
}
