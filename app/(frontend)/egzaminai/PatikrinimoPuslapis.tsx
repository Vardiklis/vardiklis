import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import { egzaminaiGrupei } from '@/lib/egzaminai'
import type { Patikrinimas } from '@/lib/patikrinimai'
import { minuciuKiekis, taskuKiekis, uzdaviniuKiekis } from '@/lib/lietuviu'
import { failaiIsCms, variantaiIsKatalogo, type Kortele } from '@/lib/pdf-biblioteka'

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

function PdfKortele({ k }: { k: Kortele }) {
  return (
    <li className="flex flex-col rounded-[8px] border border-line bg-paper p-5 transition-colors hover:border-ink">
      <h4 className="t-h3">{k.antraste}</h4>
      <p className="mt-1 t-small text-muted">{k.poantraste}</p>

      <div className="mt-4 flex flex-col gap-2">
        <a
          href={k.lapas}
          download
          className="rounded-[6px] border border-ink bg-orange px-4 py-2 text-center t-small font-semibold text-ink transition-colors hover:bg-orange-soft"
        >
          Atsisiųsti užduotį
        </a>
        {k.atsakymai && (
          <a
            href={k.atsakymai}
            download
            className="rounded-[6px] border border-line bg-paper px-4 py-2 text-center t-small transition-colors hover:border-ink"
          >
            Atsakymai
          </a>
        )}
      </div>
    </li>
  )
}

function Tinklelis({ korteles }: { korteles: Kortele[] }) {
  if (korteles.length === 0) {
    return <p className="mt-4 t-small text-muted">Variantų kol kas nėra.</p>
  }
  return (
    <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {korteles.map((k) => (
        <PdfKortele key={k.raktas} k={k} />
      ))}
    </ul>
  )
}

export default async function PatikrinimoPuslapis({ p }: { p: Patikrinimas }) {
  const egzaminai = egzaminaiGrupei(p.grupe)
  const isCms = await failaiIsCms(p.grupe)

  // Įkeltas failas prisiriša prie egzamino pagal klasę. Kas nesutampa —
  // atsiduria bendroje skiltyje, o ne dingsta.
  const klases = new Set(egzaminai.map((e) => e.klase))
  const likusieji = isCms.filter((k) => k.klase === null || !klases.has(k.klase))

  return (
    <div className="turinys sekcija">
      <Antraste lygis={1} dydis="display-l" paantraste={p.paantraste}>
        {p.pavadinimas}
      </Antraste>

      {/* ── Kuo tai nėra ───────────────────────────────────────────────── */}
      <div className="mt-10 rounded-[8px] border border-line bg-paper-2 p-5 md:p-6">
        <h2 className="t-h3">Tai ne NŠA užduotys</h2>
        <p className="tekstas mt-3 t-body text-muted">
          Nacionalinės švietimo agentūros parengtos užduotys saugomos autorių teisių, todėl jų čia
          nekeliame ir neperrašinėjame. Šie lapai sudaryti iš originalių, mūsų generatoriaus
          sukurtų uždavinių.
        </p>
        <p className="tekstas mt-3 t-body text-muted">{p.kasKartojama}</p>
        <p className="tekstas mt-3 t-body text-muted">
          Oficialius užduočių pavyzdžius rasite NŠA svetainėje — nuorodos puslapio apačioje.
        </p>
      </div>

      {/* ── Kas tai per patikrinimas ───────────────────────────────────── */}
      <section className="mt-16">
        <BruksnysDivider className="mb-8" />
        <Antraste dydis="h2">{p.pilnas}</Antraste>
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
      </section>

      {/* ── Tvarkaraštis ───────────────────────────────────────────────── */}
      <section className="mt-16">
        <BruksnysDivider className="mb-8" />
        <Antraste dydis="h2">Tvarkaraštis</Antraste>
        <p className="mt-3 t-small text-muted">{p.tvarkarastis.metai}</p>

        <div className="mt-6 overflow-x-auto">
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
      </section>

      {/* ── Variantai pagal egzaminą ───────────────────────────────────── */}
      {egzaminai.map((e) => {
        const korteles = [
          ...isCms.filter((k) => k.klase === e.klase),
          ...variantaiIsKatalogo(e),
        ]
        return (
          <section key={e.id} className="mt-16">
            <BruksnysDivider className="mb-8" />
            <Antraste dydis="h2">{e.pavadinimas}</Antraste>

            <dl className="mt-6">
              <Faktas pavadinimas="Trukmė">{minuciuKiekis(e.trukmeMin)}</Faktas>
              <Faktas pavadinimas="Taškai">{e.taskai}</Faktas>
              {e.dalys.map((d) => (
                <Faktas key={d.numeris} pavadinimas={`${d.numeris} dalis`}>
                  {d.pavadinimas} — {uzdaviniuKiekis(d.uzdaviniu)}, {taskuKiekis(d.taskai)}
                </Faktas>
              ))}
              <Faktas pavadinimas="Turinio sritys">
                {e.sritys.map((s) => `${s.pavadinimas} ${Math.round(s.dalis * 100)} %`).join(' · ')}
              </Faktas>
            </dl>

            <h3 className="mt-10 t-h3">Variantai</h3>
            <p className="mt-2 t-small text-muted">
              Kiekvienas sugeneruotas variantas nekintantis — nuoroda visada atiduos tą patį lapą,
              tad ją galima dalintis su klase.
            </p>
            <Tinklelis korteles={korteles} />
          </section>
        )
      })}

      {/* ── Įkelta per CMS be klasės ───────────────────────────────────── */}
      {likusieji.length > 0 && (
        <section className="mt-16">
          <BruksnysDivider className="mb-8" />
          <Antraste dydis="h2">Kitos užduotys</Antraste>
          <Tinklelis korteles={likusieji} />
        </section>
      )}

      {/* ── Oficialūs šaltiniai ────────────────────────────────────────── */}
      <section className="mt-16">
        <BruksnysDivider className="mb-8" />
        <h2 className="t-h3">Oficialūs šaltiniai</h2>
        <p className="tekstas mt-3 t-body text-muted">
          Tikrųjų užduočių pavyzdžių, programų ir naujausių tvarkaraščių ieškokite Nacionalinės
          švietimo agentūros svetainėje.
        </p>
        <ul className="mt-5 flex flex-col gap-3">
          {p.nuorodos.map((n) => (
            <li key={n.url}>
              <a
                href={n.url}
                className={nuorodosStilius}
                target="_blank"
                rel="noopener noreferrer"
              >
                {n.tekstas}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
