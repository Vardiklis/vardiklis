import type { Metadata } from 'next'
import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import Mygtukas from '@/components/Mygtukas'
import { kainos, kontaktai, nuolaidaPirmajai } from '@/lib/kontaktai'

export const metadata: Metadata = {
  title: 'Susisiekti',
  description:
    'Matematikos korepetitorės Modestos telefonas ir el. paštas. Individuali pamoka — 25 €/60 min, grupinė — 20 €/60 min.',
  openGraph: {
    title: 'Susisiekti — Vardiklis',
    description:
      'Matematikos korepetitorės Modestos kontaktai ir pamokų kainos. 1–10 klasių mokiniams.',
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

      {/* ── Kaina ──────────────────────────────────────────────────────────── */}
      <section className="mt-20">
        <BruksnysDivider className="mb-8" />
        <h2 className="t-h2">Pamokos kaina</h2>

        {/* Akcijos blokas virš kainų — kad pamačius sumas iškart būtų aišku,
            jog pirmoji pamoka kainuos mažiau, ir nereikėtų skaičiuoti pačiam. */}
        <div className="mt-8 max-w-2xl rounded-[8px] border border-orange bg-orange-soft px-6 py-5">
          <p className="t-body font-semibold">
            {nuolaidaPirmajai} eurų nuolaida pirmajai pamokai
          </p>
          <p className="mt-2 t-small text-muted">
            Galioja abiem pamokų tipams:{' '}
            {kainos.map((k, i) => (
              <span key={k.id}>
                {i > 0 && ', '}
                {k.pavadinimas.toLowerCase()} — {k.eurai - nuolaidaPirmajai} € vietoje {k.eurai} €
              </span>
            ))}
            .
          </p>
        </div>

        <ul className="mt-8 max-w-2xl">
          {kainos.map((k, i) => (
            <li key={k.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-6">
                <span className="flex flex-col gap-1">
                  <span className="t-body font-semibold">{k.pavadinimas}</span>
                  <span className="t-small text-muted">{k.paaiskinimas}</span>
                </span>
                <span className="font-display text-xl font-semibold tracking-[-0.01em] whitespace-nowrap md:text-2xl">
                  {k.eurai} €
                  <span className="t-small font-normal text-muted"> / {k.trukmeMin} min</span>
                </span>
              </div>
              {i < kainos.length - 1 && <div className="h-px bg-line" aria-hidden="true" />}
            </li>
          ))}
        </ul>

        <p className="tekstas mt-6 t-small text-muted">
          Diagnostika svetainėje yra nemokama ir jos atlikimas nieko neįpareigoja.
        </p>
      </section>

      {/* ── Ko tikėtis ─────────────────────────────────────────────────────── */}
      <section className="mt-20">
        <BruksnysDivider className="mb-8" />
        <h2 className="t-h2">Susisiekiant</h2>

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
