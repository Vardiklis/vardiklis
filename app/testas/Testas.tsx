'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Mygtukas from '@/components/Mygtukas'
import Trupmena from '@/components/Trupmena'
import {
  atsakyk,
  dabartinisUzdavinys,
  pradek,
  progresas,
  type Busena,
} from '@/lib/diagnostika'
import { arTeisingas } from '@/lib/matematika'
import { irasykSeansa, isvalykSeansa } from '@/lib/seansas'

const Formule = dynamic(() => import('@/components/Formule'), { ssr: false })

const KLASES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

type GriztamasisRysys = {
  teisinga: boolean
  teisingasAtsakymas: string
  sprendimas?: string
}

export function Testas() {
  const router = useRouter()
  const [klase, setKlase] = useState(7)
  const [busena, setBusena] = useState<Busena | null>(null)
  const [ivestis, setIvestis] = useState('')
  const [rysys, setRysys] = useState<GriztamasisRysys | null>(null)
  const laukas = useRef<HTMLInputElement>(null)

  const uzdavinys = busena ? dabartinisUzdavinys(busena) : null

  // Naujam uždaviniui fokusas grąžinamas į laukelį — kad nereikėtų spausti pele.
  useEffect(() => {
    if (uzdavinys && !rysys) laukas.current?.focus()
  }, [uzdavinys, rysys])

  function pradekTesta() {
    isvalykSeansa()
    setBusena(pradek(klase))
    setIvestis('')
    setRysys(null)
  }

  function tikrink(e: React.FormEvent) {
    e.preventDefault()
    if (!uzdavinys || rysys || ivestis.trim() === '') return
    setRysys({
      teisinga: arTeisingas(ivestis, uzdavinys.atsakymas),
      teisingasAtsakymas: uzdavinys.atsakymasRodymui,
      sprendimas: uzdavinys.sprendimas,
    })
  }

  function toliau() {
    if (!busena || !rysys) return
    const kita = atsakyk(busena, rysys.teisinga)
    setIvestis('')
    setRysys(null)

    if (kita.baigta) {
      irasykSeansa(kita)
      router.push('/testas/rezultatas')
      return
    }

    setBusena(kita)
  }

  // ── Ekranas 1: įvadas ────────────────────────────────────────────────────
  if (!busena) {
    return (
      <div className="tekstas">
        <div className="mt-8 flex flex-col gap-4 t-body text-muted">
          <p>Testas parodys, kurioje klasėje vaikui nutrūko matematika.</p>
          <p>
            Uždavinius sprendžia vaikas, bet testą pradeda ir ataskaitą gauna tėvai.
          </p>
          <p>Trunka apie 15 minučių. Nieko neįrašome ir nesaugome.</p>
        </div>

        <div className="mt-10 rounded-[8px] border border-line bg-paper-2 p-6">
          <label htmlFor="klase" className="block t-small font-semibold">
            Kurioje klasėje vaikas mokosi?
          </label>
          <select
            id="klase"
            value={klase}
            onChange={(e) => setKlase(Number(e.target.value))}
            className="mt-3 w-full rounded-[6px] border border-line bg-paper px-3 py-2.5 t-body text-ink sm:w-56"
          >
            {KLASES.map((k) => (
              <option key={k} value={k}>
                {k} klasė
              </option>
            ))}
          </select>

          <div className="mt-6">
            <Mygtukas onClick={pradekTesta} dydis="didelis">
              Pradėti
            </Mygtukas>
          </div>
        </div>
      </div>
    )
  }

  // ── Ekranas 2: uždaviniai ────────────────────────────────────────────────
  if (!uzdavinys) return null

  const dalis = Math.round(progresas(busena) * 100)

  return (
    <div className="mt-8 max-w-2xl">
      <div
        className="h-0.5 w-full bg-line"
        role="progressbar"
        aria-valuenow={dalis}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Testo eiga"
      >
        <div
          className="h-full bg-orange transition-[width] duration-300"
          style={{ width: `${dalis}%` }}
        />
      </div>

      <p className="mt-3 t-small text-muted">
        {busena.isVisoUzdaviniu + 1} uždavinys
      </p>

      <form onSubmit={tikrink} className="mt-8">
        <Formule
          tekstas={uzdavinys.klausimas}
          className="block font-mono text-xl leading-relaxed md:text-2xl"
        />

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <label htmlFor="atsakymas" className="sr-only">
            Atsakymas
          </label>
          <input
            id="atsakymas"
            ref={laukas}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={ivestis}
            readOnly={rysys !== null}
            onChange={(e) => setIvestis(e.target.value)}
            placeholder="Atsakymas"
            className="w-full rounded-[6px] border border-line bg-paper px-4 py-3 font-mono text-lg text-ink read-only:bg-paper-2 sm:w-56"
          />

          {rysys ? (
            <Mygtukas onClick={toliau} dydis="didelis">
              Toliau
            </Mygtukas>
          ) : (
            <Mygtukas type="submit" dydis="didelis" disabled={ivestis.trim() === ''}>
              Tikrinti
            </Mygtukas>
          )}
        </div>
      </form>

      <div aria-live="polite" className="mt-6">
        {rysys && (
          <div
            className={`rounded-[8px] border p-5 ${
              rysys.teisinga ? 'border-line bg-paper-2' : 'border-orange bg-orange-soft'
            }`}
          >
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="t-h3">{rysys.teisinga ? 'Teisingai' : 'Neteisingai'}</span>
              {!rysys.teisinga && (
                <span className="flex items-baseline gap-2 t-small text-muted">
                  Teisingas atsakymas:
                  <Formule
                    tekstas={rysys.teisingasAtsakymas}
                    className="font-mono font-semibold text-ink"
                  />
                </span>
              )}
            </p>
            {!rysys.teisinga && rysys.sprendimas && (
              <Formule tekstas={rysys.sprendimas} className="mt-3 block t-small text-muted" />
            )}
          </div>
        )}
      </div>

      {/* Priminimas, kodėl klaidos čia nėra blogai. */}
      <div className="mt-12 border-t border-line pt-6">
        <Trupmena
          dydis="normalus"
          bruksnys="line"
          skaitiklis={<span className="t-small text-muted">ką matote dabar</span>}
          vardiklis={<span className="t-small text-muted">ką parodys ataskaita</span>}
        />
        <p className="mt-3 max-w-md t-small text-muted">
          Klaidos čia yra naudingos — būtent jos parodo, kur ieškoti tikrosios priežasties.
        </p>
      </div>
    </div>
  )
}

export default Testas
