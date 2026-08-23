import type { Metadata } from 'next'
import Link from 'next/link'
import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import Mygtukas from '@/components/Mygtukas'
import { egzaminaiGrupei } from '@/lib/egzaminai'
import { minuciuKiekis, taskuKiekis } from '@/lib/lietuviu'
import { NMPP, PUPP, type Patikrinimas } from '@/lib/patikrinimai'

export const metadata: Metadata = {
  title: 'NMPP ir PUPP matematika — kas tai, kada vyksta ir kaip pasiruošti',
  description:
    'Kas yra NMPP ir PUPP matematikos patikrinimai, kurioms klasėms, kada vyksta, kiek trunka, kokia struktūra ir ką reiškia pasiekimų lygiai. Nemokamos pasiruošimo užduotys PDF.',
  openGraph: {
    title: 'NMPP ir PUPP matematika — Vardiklis',
    description:
      'Kas yra NMPP ir PUPP, kurioms klasėms, kada vyksta ir ką reiškia lygiai. Pasiruošimo užduotys PDF.',
  },
}

const nuorodosStilius =
  't-body font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange'

function Faktas({ pavadinimas, children }: { pavadinimas: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-4 md:grid md:grid-cols-[14rem_1fr] md:gap-8">
      <dt className="t-small font-semibold">{pavadinimas}</dt>
      <dd className="mt-1 t-body text-muted md:mt-0">{children}</dd>
    </div>
  )
}

function Tvarkarastis({ p }: { p: Patikrinimas }) {
  return (
    <>
      <h3 className="mt-10 t-h3">Kada vyksta</h3>
      <p className="mt-2 t-small text-muted">{p.tvarkarastis.metai}</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pr-4 t-small font-semibold">Kam</th>
              <th className="py-3 pr-4 t-small font-semibold">Dalykas</th>
              <th className="py-3 t-small font-semibold">Data</th>
            </tr>
          </thead>
          <tbody>
            {p.tvarkarastis.eilutes.map((e) => (
              <tr key={`${e.klase}-${e.dalykas}`} className="border-b border-line">
                <td className="py-3 pr-4 t-small text-muted">{e.klase}</td>
                <td className="py-3 pr-4 t-body">{e.dalykas}</td>
                <td className="py-3 t-body font-semibold whitespace-nowrap">{e.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 t-small text-muted">{p.tvarkarastis.pastaba}</p>
    </>
  )
}

/** Viena patikrinimo skiltis. Faktai imami iš to paties šaltinio kaip PDF puslapiuose. */
function Skiltis({ p }: { p: Patikrinimas }) {
  const egzaminai = egzaminaiGrupei(p.grupe)

  return (
    <section className="mt-24 first:mt-16">
      <BruksnysDivider className="mb-8" />
      <h2 className="t-h2">
        {p.trumpai} — {p.pilnas.toLowerCase()}
      </h2>

      {p.ivadas.map((pastraipa) => (
        <p key={pastraipa.slice(0, 40)} className="tekstas mt-4 t-body text-muted">
          {pastraipa}
        </p>
      ))}

      <dl className="mt-8">
        {p.faktai.map((f) => (
          <Faktas key={f.pavadinimas} pavadinimas={f.pavadinimas}>
            {f.tekstas}
          </Faktas>
        ))}
      </dl>

      <div className="mt-8 rounded-[8px] border-l-2 border-orange bg-paper-2 px-6 py-5">
        <h3 className="t-h3">{p.demesio.antraste}</h3>
        <p className="mt-3 t-body text-muted">{p.demesio.tekstas}</p>
      </div>

      <Tvarkarastis p={p} />

      <h3 className="mt-10 t-h3">Kaip atrodo mūsų pasiruošimo lapai</h3>
      <ul className="mt-4 flex flex-col gap-2">
        {egzaminai.map((e) => (
          <li key={e.id} className="flex justify-between gap-4 border-t border-line py-3">
            <span className="t-body">{e.pavadinimas}</span>
            <span className="t-small whitespace-nowrap text-muted">
              {minuciuKiekis(e.trukmeMin)} · {taskuKiekis(e.taskai)} ·{' '}
              {e.dalys.reduce((s, d) => s + d.uzdaviniu, 0)} užd.
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6">
        <a href={p.nuorodos[0].url} className={nuorodosStilius} target="_blank" rel="noopener">
          {p.nuorodos[0].tekstas}
        </a>
      </p>
    </section>
  )
}

export default function Testai() {
  return (
    <div className="turinys sekcija">
      <Antraste
        lygis={1}
        dydis="display-l"
        paantraste="Du valstybiniai matematikos patikrinimai, apie kuriuos tėvai dažniausiai klausia. Žemiau — kas tai yra, kurioms klasėms, kada vyksta, kiek trunka ir ką iš tikrųjų reiškia pasiekimų lygiai."
      >
        NMPP ir PUPP
      </Antraste>

      {/* ── Du mygtukai į PDF bibliotekas ──────────────────────────────── */}
      <div className="mt-10 rounded-[8px] border border-line bg-paper-2 p-6 md:p-8">
        <h2 className="t-h3">Pasiruošimo užduotys</h2>
        <p className="tekstas mt-3 t-body text-muted">
          Nemokami PDF lapai su ta pačia trukme ir tomis pačiomis turinio sritimis. Kiekvienas
          variantas — su atsakymais.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Mygtukas href="/egzaminai/nmpp" dydis="didelis">
            NMPP užduotys (4 ir 8 kl.)
          </Mygtukas>
          <Mygtukas href="/egzaminai/pupp" variantas="konturas" dydis="didelis">
            PUPP užduotys (10 kl.)
          </Mygtukas>
        </div>
      </div>

      <Skiltis p={NMPP} />
      <Skiltis p={PUPP} />

      {/* ── Diagnostika ────────────────────────────────────────────────── */}
      <section className="mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="t-h2">Jei jau žinote, kad taškų trūksta</h2>
        <p className="tekstas mt-4 t-body text-muted">
          Prieš kalant temas iš eilės, verta išsiaiškinti, kurioje klasėje nutrūko grandinė.
          Diagnostika tai parodo per 15 minučių.
        </p>
        <p className="mt-6">
          <Link href="/testas" className={nuorodosStilius}>
            Pradėti diagnostiką
          </Link>
        </p>
      </section>
    </div>
  )
}
