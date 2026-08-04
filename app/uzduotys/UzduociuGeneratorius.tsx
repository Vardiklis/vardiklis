'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import Mygtukas from '@/components/Mygtukas'
import { generuokRinkini, type Lygis, type Uzdavinys } from '@/lib/generatoriai'
import { potemes, programa, type IsskleistaPotema, type ProgramosTema } from '@/lib/programa'

// KaTeX (JS + CSS) užkraunamas tik tada, kai uždaviniai iš tikrųjų sugeneruoti —
// kitaip jis blokuotų tuščio puslapio piešimą.
const UzdavinioKortele = dynamic(() => import('@/components/UzdavinioKortele'), {
  ssr: false,
})

const KIEKIAI = [5, 10, 20] as const

const LYGIAI: { reiksme: Lygis; etikete: string }[] = [
  { reiksme: 1, etikete: 'Lengvas' },
  { reiksme: 2, etikete: 'Vidutinis' },
  { reiksme: 3, etikete: 'Sunkus' },
]

type Pasirinkta = {
  klase: number
  tema: ProgramosTema
  potema: IsskleistaPotema | null
  generatorius: string
  antraste: string
}

export function UzduociuGeneratorius() {
  const [klase, setKlase] = useState(6)
  const [isskleista, setIsskleista] = useState<number | null>(null)
  const [pasirinkta, setPasirinkta] = useState<Pasirinkta | null>(null)
  const [lygis, setLygis] = useState<Lygis>(2)
  const [kiekis, setKiekis] = useState<number>(10)
  const [uzdaviniai, setUzdaviniai] = useState<Uzdavinys[]>([])
  const [rodytiAtsakymus, setRodytiAtsakymus] = useState(false)

  const klasesTemos = programa.find((k) => k.klase === klase)?.temos ?? []

  function keiskKlase(nauja: number) {
    setKlase(nauja)
    setIsskleista(null)
  }

  function generuok(p: Pasirinkta, naujasLygis: Lygis, naujasKiekis: number) {
    setPasirinkta(p)
    setLygis(naujasLygis)
    setKiekis(naujasKiekis)
    setUzdaviniai(generuokRinkini(p.generatorius, naujasLygis, naujasKiekis))
    setRodytiAtsakymus(false)
  }

  /** Visos temos uždaviniai — kai norima ne vienos potemės, o viso skyriaus. */
  function pasirinkTema(tema: ProgramosTema) {
    if (!tema.generatorius) return
    generuok(
      {
        klase,
        tema,
        potema: null,
        generatorius: tema.generatorius,
        antraste: `${tema.numeris}. ${tema.pavadinimas}`,
      },
      tema.lygis ?? 2,
      kiekis,
    )
  }

  function pasirinkPotema(tema: ProgramosTema, p: IsskleistaPotema) {
    if (!p.generatorius) return
    generuok(
      {
        klase,
        tema,
        potema: p,
        generatorius: p.generatorius,
        antraste: `${p.numeris}. ${p.pavadinimas}`,
      },
      p.lygis,
      kiekis,
    )
  }

  return (
    <>
      {/* ── Klasės pasirinkimas ─────────────────────────────────────────── */}
      <div className="be-spausdinimo mt-10">
        <h2 className="t-small font-semibold">Klasė</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {programa.map((k) => (
            <button
              key={k.klase}
              type="button"
              onClick={() => keiskKlase(k.klase)}
              aria-pressed={k.klase === klase}
              className={`h-11 w-11 rounded-[6px] border font-mono text-[0.9375rem] transition-colors ${
                k.klase === klase
                  ? 'border-orange bg-orange font-semibold text-ink'
                  : 'border-line bg-paper text-ink hover:border-ink'
              }`}
            >
              {k.klase}
            </button>
          ))}
        </div>
      </div>

      {/* ── Temų akordeonas ─────────────────────────────────────────────── */}
      <div className="be-spausdinimo mt-10">
        <h2 className="t-h3">{klase} klasės temos</h2>
        <p className="mt-2 t-small text-muted">
          {klasesTemos.some((t) => potemes(t).length > 0)
            ? 'Spustelėkite temą — ji išsiskleis į potemes. Paspaudus potemę, iš karto sugeneruojami jos uždaviniai.'
            : 'Šios klasės programoje temos į potemes neskirstomos, tad spustelėjus temą uždaviniai sugeneruojami iš karto.'}
        </p>

        <ol className="mt-6 divide-y divide-line rounded-[8px] border border-line">
          {klasesTemos.map((tema) => {
            const sarasas = potemes(tema)
            const skirstoma = sarasas.length > 0
            const atidaryta = skirstoma && isskleista === tema.numeris
            // 5–7 klasių programoje potemių nėra — ten stambusis punktas ir yra
            // smulkiausias dalykas, tad paspaudus iškart generuojami uždaviniai.
            const aktyviTema = !skirstoma && pasirinkta?.tema.numeris === tema.numeris &&
              pasirinkta.klase === klase

            return (
              <li key={tema.numeris}>
                <button
                  type="button"
                  onClick={() =>
                    skirstoma
                      ? setIsskleista(atidaryta ? null : tema.numeris)
                      : pasirinkTema(tema)
                  }
                  aria-expanded={skirstoma ? atidaryta : undefined}
                  aria-current={aktyviTema ? 'true' : undefined}
                  className={`flex w-full items-baseline gap-4 px-5 py-4 text-left transition-colors hover:bg-paper-2 ${
                    aktyviTema ? 'bg-orange-soft' : ''
                  }`}
                >
                  {/* Stambieji punktai paryškinti — tai programos skyriai. */}
                  <span className="shrink-0 font-mono text-[0.9375rem] font-semibold tabular-nums">
                    {tema.numeris}.
                  </span>
                  <span className="grow t-body font-semibold">{tema.pavadinimas}</span>
                  <span
                    className="shrink-0 font-mono text-[0.9375rem] text-muted"
                    aria-hidden="true"
                  >
                    {skirstoma ? (atidaryta ? '–' : '+') : '→'}
                  </span>
                </button>

                {atidaryta && (
                  <div className="border-t border-line bg-paper-2 px-5 py-3">
                    <ol className="flex flex-col">
                        {sarasas.map((p) => {
                          const aktyvi = pasirinkta?.potema?.numeris === p.numeris
                          return (
                            <li key={p.numeris}>
                              <button
                                type="button"
                                onClick={() => pasirinkPotema(tema, p)}
                                disabled={!p.generatorius}
                                aria-current={aktyvi ? 'true' : undefined}
                                className={`flex w-full items-baseline gap-3 rounded-[6px] px-3 py-2.5 text-left transition-colors ${
                                  p.generatorius ? 'hover:bg-paper' : 'cursor-default'
                                } ${aktyvi ? 'bg-orange-soft' : ''}`}
                              >
                                <span className="shrink-0 font-mono t-small tabular-nums text-muted">
                                  {p.numeris}.
                                </span>
                                <span
                                  className={`grow t-body ${
                                    p.generatorius ? 'text-ink' : 'text-muted'
                                  }`}
                                >
                                  {p.pavadinimas}
                                </span>
                                {!p.generatorius && (
                                  <span className="shrink-0 t-small text-muted">netrukus</span>
                                )}
                              </button>
                            </li>
                          )
                        })}
                    </ol>

                    <div className="mt-2 border-t border-line px-3 pt-3">
                      <button
                        type="button"
                        onClick={() => pasirinkTema(tema)}
                        className="t-small font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
                      >
                        Uždaviniai iš visos temos
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      {/* ── Sugeneruotas rinkinys ───────────────────────────────────────── */}
      {pasirinkta && uzdaviniai.length > 0 && (
        <section className="mt-14" aria-labelledby="rinkinys">
          {/* Antraštė lapui — matoma tik spausdinant. */}
          <div className="hidden print:block">
            <h2 className="t-h2">
              {pasirinkta.klase} kl. · {pasirinkta.antraste}
            </h2>
            <p className="mt-6 t-small">
              Vardas, pavardė: ______________________ Data: ____________
            </p>
          </div>

          <div className="be-spausdinimo">
            <h2 id="rinkinys" className="t-h2">
              {pasirinkta.antraste}
            </h2>
            <p className="mt-2 t-small text-muted">
              {pasirinkta.klase} klasė
              {pasirinkta.potema && ` · ${pasirinkta.tema.pavadinimas}`} ·{' '}
              {uzdaviniai.length} uždaviniai
            </p>

            <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-5">
              <div>
                <span className="block t-small font-semibold">Sunkumas</span>
                <div className="mt-2 flex gap-2">
                  {LYGIAI.map((l) => (
                    <button
                      key={l.reiksme}
                      type="button"
                      onClick={() => generuok(pasirinkta, l.reiksme, kiekis)}
                      aria-pressed={l.reiksme === lygis}
                      className={`rounded-[6px] border px-4 py-2 t-small transition-colors ${
                        l.reiksme === lygis
                          ? 'border-ink bg-paper font-semibold'
                          : 'border-line bg-paper text-muted hover:border-ink'
                      }`}
                    >
                      {l.etikete}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block t-small font-semibold">Kiek uždavinių</span>
                <div className="mt-2 flex gap-2">
                  {KIEKIAI.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => generuok(pasirinkta, lygis, k)}
                      aria-pressed={k === kiekis}
                      className={`rounded-[6px] border px-4 py-2 font-mono t-small transition-colors ${
                        k === kiekis
                          ? 'border-ink bg-paper font-semibold'
                          : 'border-line bg-paper text-muted hover:border-ink'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Mygtukas onClick={() => generuok(pasirinkta, lygis, kiekis)}>
                Nauji uždaviniai
              </Mygtukas>
              <Mygtukas variantas="konturas" onClick={() => setRodytiAtsakymus((v) => !v)}>
                {rodytiAtsakymus ? 'Slėpti atsakymus' : 'Rodyti atsakymus'}
              </Mygtukas>
              <Mygtukas variantas="konturas" onClick={() => window.print()}>
                Spausdinti
              </Mygtukas>
            </div>
          </div>

          <ol className="mt-8 flex flex-col gap-4 print:gap-3">
            {uzdaviniai.map((u, i) => (
              <UzdavinioKortele
                key={u.id}
                uzdavinys={u}
                numeris={i + 1}
                rodytiAtsakyma={rodytiAtsakymus}
              />
            ))}
          </ol>
        </section>
      )}

      {!pasirinkta && (
        <p className="be-spausdinimo mt-10 rounded-[8px] border border-dashed border-line px-6 py-10 text-center t-body text-muted">
          Pasirinkite temą iš sąrašo.
        </p>
      )}
    </>
  )
}

export default UzduociuGeneratorius
