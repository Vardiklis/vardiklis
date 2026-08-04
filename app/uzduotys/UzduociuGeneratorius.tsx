'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import Mygtukas from '@/components/Mygtukas'
import { generuokRinkini, type Lygis, type Uzdavinys } from '@/lib/generatoriai'
import { programa, type ProgramosTema } from '@/lib/programa'

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
}

export function UzduociuGeneratorius() {
  const [klase, setKlase] = useState(6)
  const [pasirinkta, setPasirinkta] = useState<Pasirinkta | null>(null)
  const [lygis, setLygis] = useState<Lygis | null>(null)
  const [kiekis, setKiekis] = useState<number>(10)
  const [uzdaviniai, setUzdaviniai] = useState<Uzdavinys[]>([])
  const [rodytiAtsakymus, setRodytiAtsakymus] = useState(false)

  const klasesTemos = programa.find((k) => k.klase === klase)?.temos ?? []
  const galiojantisLygis = lygis ?? pasirinkta?.tema.lygis ?? 2

  function pasirink(tema: ProgramosTema) {
    if (!tema.generatorius) return
    setPasirinkta({ klase, tema })
    setLygis(tema.lygis ?? 2)
    setUzdaviniai(generuokRinkini(tema.generatorius, tema.lygis ?? 2, kiekis))
    setRodytiAtsakymus(false)
  }

  function pergeneruok(naujasLygis = galiojantisLygis, naujasKiekis = kiekis) {
    if (!pasirinkta?.tema.generatorius) return
    setUzdaviniai(generuokRinkini(pasirinkta.tema.generatorius, naujasLygis, naujasKiekis))
    setRodytiAtsakymus(false)
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
              onClick={() => setKlase(k.klase)}
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

      {/* ── Temų sąrašas ────────────────────────────────────────────────── */}
      <div className="be-spausdinimo mt-10">
        <h2 className="t-h3">{klase} klasės temos</h2>
        <p className="mt-2 t-small text-muted">
          Spustelėkite temą — uždaviniai sugeneruojami iš karto. Pilkos temos kol kas be
          uždavinių: jos yra programoje, bet jų neįmanoma sugeneruoti be brėžinio ar
          duomenų rinkinio.
        </p>

        <ol className="mt-6 divide-y divide-line rounded-[8px] border border-line">
          {klasesTemos.map((tema) => {
            const yra = Boolean(tema.generatorius)
            const aktyvi = pasirinkta?.klase === klase && pasirinkta.tema.numeris === tema.numeris

            return (
              <li key={tema.numeris}>
                <button
                  type="button"
                  onClick={() => pasirink(tema)}
                  disabled={!yra}
                  aria-current={aktyvi ? 'true' : undefined}
                  className={`flex w-full gap-4 px-5 py-4 text-left transition-colors ${
                    yra ? 'hover:bg-paper-2' : 'cursor-default'
                  } ${aktyvi ? 'bg-orange-soft' : ''}`}
                >
                  {/* Stambieji punktai paryškinti — tai programos skyriai. */}
                  <span
                    className={`shrink-0 font-mono text-[0.9375rem] font-semibold tabular-nums ${
                      yra ? 'text-ink' : 'text-muted'
                    }`}
                  >
                    {tema.numeris}.
                  </span>

                  <span className="min-w-0 grow">
                    <span
                      className={`block t-body font-semibold ${yra ? 'text-ink' : 'text-muted'}`}
                    >
                      {tema.pavadinimas}
                    </span>

                    {tema.potemes && tema.potemes.length > 0 && (
                      <span className="mt-1 block t-small text-muted">
                        {tema.potemes.map((p, i) => (
                          <span key={p}>
                            {tema.numeris}.{i + 1}. {p}
                            {i < tema.potemes!.length - 1 ? ' · ' : ''}
                          </span>
                        ))}
                      </span>
                    )}
                  </span>

                  {!yra && (
                    <span className="shrink-0 self-start t-small text-muted">netrukus</span>
                  )}
                </button>
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
              {pasirinkta.klase} kl. · {pasirinkta.tema.pavadinimas}
            </h2>
            <p className="mt-6 t-small">
              Vardas, pavardė: ______________________ Data: ____________
            </p>
          </div>

          <div className="be-spausdinimo">
            <h2 id="rinkinys" className="t-h2">
              {pasirinkta.tema.pavadinimas}
            </h2>
            <p className="mt-2 t-small text-muted">
              {pasirinkta.klase} klasė · {uzdaviniai.length} uždaviniai
            </p>

            <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-5">
              <div>
                <span className="block t-small font-semibold">Sunkumas</span>
                <div className="mt-2 flex gap-2">
                  {LYGIAI.map((l) => (
                    <button
                      key={l.reiksme}
                      type="button"
                      onClick={() => {
                        setLygis(l.reiksme)
                        pergeneruok(l.reiksme)
                      }}
                      aria-pressed={l.reiksme === galiojantisLygis}
                      className={`rounded-[6px] border px-4 py-2 t-small transition-colors ${
                        l.reiksme === galiojantisLygis
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
                      onClick={() => {
                        setKiekis(k)
                        pergeneruok(galiojantisLygis, k)
                      }}
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
              <Mygtukas onClick={() => pergeneruok()}>Nauji uždaviniai</Mygtukas>
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
