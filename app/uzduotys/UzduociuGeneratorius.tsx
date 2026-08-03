'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import Mygtukas from '@/components/Mygtukas'
import { generuokRinkini, type Lygis, type Uzdavinys } from '@/lib/generatoriai'
import { temos } from '@/lib/temos'

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

const laukoStilius =
  'w-full rounded-[6px] border border-line bg-paper px-3 py-2.5 t-body text-ink'

export function UzduociuGeneratorius() {
  const [temaId, setTemaId] = useState(temos[0].id)
  const [lygis, setLygis] = useState<Lygis>(2)
  const [kiekis, setKiekis] = useState<number>(10)
  const [uzdaviniai, setUzdaviniai] = useState<Uzdavinys[]>([])
  const [rodytiAtsakymus, setRodytiAtsakymus] = useState(false)

  const tema = temos.find((t) => t.id === temaId) ?? temos[0]

  function generuok() {
    setUzdaviniai(generuokRinkini(tema.generatorius, lygis, kiekis))
    setRodytiAtsakymus(false)
  }

  return (
    <>
      <div className="be-spausdinimo mt-10 rounded-[8px] border border-line bg-paper-2 p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
          <div>
            <label htmlFor="tema" className="block t-small font-semibold">
              Tema
            </label>
            <select
              id="tema"
              value={temaId}
              onChange={(e) => setTemaId(e.target.value)}
              className={`${laukoStilius} mt-2`}
            >
              {temos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.pavadinimas} · {t.klase} kl.
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="lygis" className="block t-small font-semibold">
              Sunkumas
            </label>
            <select
              id="lygis"
              value={lygis}
              onChange={(e) => setLygis(Number(e.target.value) as Lygis)}
              className={`${laukoStilius} mt-2`}
            >
              {LYGIAI.map((l) => (
                <option key={l.reiksme} value={l.reiksme}>
                  {l.reiksme} — {l.etikete}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="kiekis" className="block t-small font-semibold">
              Kiek uždavinių
            </label>
            <select
              id="kiekis"
              value={kiekis}
              onChange={(e) => setKiekis(Number(e.target.value))}
              className={`${laukoStilius} mt-2`}
            >
              {KIEKIAI.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <Mygtukas onClick={generuok} dydis="didelis" className="w-full md:w-auto">
            Generuoti
          </Mygtukas>
        </div>
      </div>

      {uzdaviniai.length > 0 && (
        <section className="mt-12" aria-labelledby="rinkinys">
          {/* Antraštė lapui — matoma tik spausdinant. */}
          <div className="hidden print:block">
            <h2 className="t-h2">
              {tema.pavadinimas} · {LYGIAI[lygis - 1].etikete.toLowerCase()} lygis
            </h2>
            <p className="mt-6 t-small">Vardas, pavardė: ______________________ Data: ____________</p>
          </div>

          <div className="be-spausdinimo flex flex-wrap items-center justify-between gap-4">
            <h2 id="rinkinys" className="t-h2">
              {tema.pavadinimas}
              <span className="ml-2 t-small font-normal text-muted">
                {uzdaviniai.length} uždaviniai · {LYGIAI[lygis - 1].etikete.toLowerCase()} lygis
              </span>
            </h2>

            <div className="flex flex-wrap gap-3">
              <Mygtukas
                variantas="konturas"
                onClick={() => setRodytiAtsakymus((v) => !v)}
                aria-pressed={rodytiAtsakymus}
              >
                {rodytiAtsakymus ? 'Slėpti atsakymus' : 'Rodyti atsakymus'}
              </Mygtukas>
              <Mygtukas variantas="konturas" onClick={() => window.print()}>
                Spausdinti
              </Mygtukas>
            </div>
          </div>

          <ol className="mt-6 flex flex-col gap-4 print:gap-3">
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

      {uzdaviniai.length === 0 && (
        <p className="be-spausdinimo mt-12 rounded-[8px] border border-dashed border-line px-6 py-12 text-center t-body text-muted">
          Pasirinkite temą ir spauskite „Generuoti“.
        </p>
      )}
    </>
  )
}

export default UzduociuGeneratorius
