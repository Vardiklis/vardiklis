import type { Metadata } from 'next'
import Link from 'next/link'
import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import { egzaminaiGrupei } from '@/lib/egzaminai'
import { PATIKRINIMAI } from '@/lib/patikrinimai'

export const metadata: Metadata = {
  title: 'NMPP ir PUPP pasiruošimo užduotys — PDF biblioteka',
  description:
    'Nemokamos pasiruošimo užduotys NMPP (4 ir 8 klasė) ir PUPP matematikai. Tokia pati trukmė ir tos pačios turinio sritys, PDF su atsakymais.',
  openGraph: {
    title: 'NMPP ir PUPP pasiruošimo užduotys — Vardiklis',
    description: 'PDF biblioteka: NMPP 4 ir 8 klasei bei PUPP matematikai, su atsakymais.',
  },
}

export default function Egzaminai() {
  return (
    <div className="turinys sekcija">
      <Antraste
        lygis={1}
        dydis="display-l"
        paantraste="Pasiruošimo užduotys, sudarytos pagal tą pačią trukmę ir tas pačias turinio sritis kaip valstybiniai matematikos patikrinimai. Kiekvienas variantas — su atsakymais."
      >
        Pasiruošimo užduotys
      </Antraste>

      <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        {PATIKRINIMAI.map((p) => {
          const egzaminai = egzaminaiGrupei(p.grupe)
          return (
            <li key={p.grupe}>
              <Link
                href={`/egzaminai/${p.grupe}`}
                className="flex h-full flex-col rounded-[8px] border border-line bg-paper p-6 transition-colors hover:border-ink md:p-8"
              >
                <span className="font-mono t-small text-muted">{p.trumpai}</span>
                <h2 className="mt-2 t-h2">{p.pilnas}</h2>
                <p className="tekstas mt-3 t-body text-muted">{p.ivadas[0]}</p>

                <dl className="mt-6 flex flex-col gap-2">
                  {egzaminai.map((e) => (
                    <div key={e.id} className="flex justify-between gap-4 border-t border-line pt-2">
                      <dt className="t-small">{e.pavadinimas}</dt>
                      <dd className="t-small whitespace-nowrap text-muted">
                        {e.trukmeMin} min · {e.taskai} t.
                      </dd>
                    </div>
                  ))}
                </dl>

                <span className="mt-6 t-small font-semibold underline decoration-orange decoration-2 underline-offset-4">
                  Atidaryti {p.trumpai} užduotis
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      <section className="mt-16">
        <BruksnysDivider className="mb-8" />
        <h2 className="t-h3">Kuo šie lapai nėra NŠA užduotys</h2>
        <p className="tekstas mt-3 t-body text-muted">
          Nacionalinės švietimo agentūros parengtos užduotys saugomos autorių teisių, todėl jų čia
          nekeliame ir neperrašinėjame. Kartojama tik tai, kas skelbiama viešai ir kas nėra kūrinys
          — trukmė, turinio sritys, o PUPP atveju ir dalių struktūra. Patys uždaviniai originalūs.
        </p>
        <p className="mt-6">
          <Link
            href="/testai"
            className="t-body font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
          >
            Plačiau apie abu patikrinimus
          </Link>
        </p>
      </section>
    </div>
  )
}
