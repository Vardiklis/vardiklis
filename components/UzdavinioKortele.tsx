'use client'

import { useState } from 'react'
import type { Uzdavinys } from '@/lib/generatoriai'
import { arTeisingas } from '@/lib/matematika'
import Brezinys from './Brezinys'
import Formule from './Formule'
import Klaviatura from './Klaviatura'

type Props = {
  uzdavinys: Uzdavinys
  numeris: number
  rodytiAtsakyma: boolean
}

/**
 * Viena uždavinio kortelė uždavinių sąraše.
 *
 * Langelis atsakymui yra tikras įvesties laukas — jame galima spręsti ekrane,
 * o atspausdintame lape jis lieka tuščias langelis rašymui ranka.
 * Spausdinant kortelė nelaužoma per puslapio ribą (`spausdinimo-blokas`).
 */
export function UzdavinioKortele({ uzdavinys, numeris, rodytiAtsakyma }: Props) {
  const [ivestis, setIvestis] = useState('')
  const [klaviatura, setKlaviatura] = useState(false)

  const kazkasIvesta = ivestis.trim() !== ''
  const teisinga = kazkasIvesta && arTeisingas(ivestis, uzdavinys.atsakymas)

  return (
    <li className="spausdinimo-blokas rounded-[8px] border border-line bg-paper p-5 md:p-6">
      <div className="flex gap-4">
        <span
          className="shrink-0 font-mono text-[0.9375rem] font-semibold tabular-nums text-muted"
          aria-hidden="true"
        >
          {String(numeris).padStart(2, '0')}
        </span>

        <div className="min-w-0 grow">
          {uzdavinys.brezinys && <Brezinys svg={uzdavinys.brezinys} className="mb-4" />}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
            <Formule
              tekstas={uzdavinys.klausimas}
              className="font-mono text-[1.0625rem] leading-relaxed"
            />

            <span className="inline-flex items-center gap-2">
              <label htmlFor={`atsakymas-${uzdavinys.id}`} className="sr-only">
                Uždavinio {numeris} atsakymas
              </label>
              <input
                id={`atsakymas-${uzdavinys.id}`}
                type="text"
                // Atidarius savą klaviatūrą, telefono klaviatūros nekviečiam.
                inputMode={klaviatura ? 'none' : 'decimal'}
                autoComplete="off"
                value={ivestis}
                onChange={(e) => setIvestis(e.target.value)}
                placeholder="?"
                aria-describedby={
                  rodytiAtsakyma && kazkasIvesta ? `vertinimas-${uzdavinys.id}` : undefined
                }
                className={`w-28 rounded-[6px] border bg-paper px-3 py-2 text-center font-mono text-[1.0625rem] text-ink placeholder:text-muted/50 print:h-9 print:w-32 ${
                  rodytiAtsakyma && kazkasIvesta
                    ? teisinga
                      ? 'border-green'
                      : 'border-red bg-red-soft'
                    : 'border-line'
                }`}
              />

              <button
                type="button"
                onClick={() => setKlaviatura((v) => !v)}
                aria-expanded={klaviatura}
                aria-controls={`klaviatura-${uzdavinys.id}`}
                aria-label={
                  klaviatura ? 'Slėpti matematikos klaviatūrą' : 'Rodyti matematikos klaviatūrą'
                }
                title="Matematikos klaviatūra su trupmenomis"
                className="be-spausdinimo flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-line bg-paper font-mono text-base leading-none transition-colors hover:border-ink"
              >
                <span aria-hidden="true">⌨</span>
              </button>

              {/* Vertinimas rodomas tik atskleidus atsakymus — kitaip langelis
                  virstų viktorina ir uždaviniai nustotų būti darbo lapu. */}
              {rodytiAtsakyma && kazkasIvesta && (
                <span
                  id={`vertinimas-${uzdavinys.id}`}
                  className={`be-spausdinimo t-small font-semibold ${
                    teisinga ? 'text-green' : 'text-red'
                  }`}
                >
                  {teisinga ? 'Teisingai' : 'Neteisingai'}
                </span>
              )}
            </span>
          </div>

          {klaviatura && (
            <div id={`klaviatura-${uzdavinys.id}`}>
              <Klaviatura
                reiksme={ivestis}
                onKeisti={setIvestis}
                onUzdaryti={() => setKlaviatura(false)}
              />
            </div>
          )}

          {rodytiAtsakyma && (
            <div className="mt-4 border-t border-line pt-3">
              <p className="flex flex-wrap items-baseline gap-2">
                <span className="t-small text-muted">Atsakymas:</span>
                <Formule
                  tekstas={uzdavinys.atsakymasRodymui}
                  className="font-mono text-[1.0625rem] font-semibold"
                />
              </p>
              {uzdavinys.sprendimas && (
                <Formule
                  tekstas={uzdavinys.sprendimas}
                  className="mt-2 block t-small text-muted"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

export default UzdavinioKortele
