'use client'

import { useState } from 'react'
import type { Uzdavinys } from '@/lib/generatoriai'
import { arTeisingas } from '@/lib/matematika'
import Formule from './Formule'

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
                inputMode="decimal"
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
                      ? 'border-ink'
                      : 'border-orange bg-orange-soft'
                    : 'border-line'
                }`}
              />

              {/* Vertinimas rodomas tik atskleidus atsakymus — kitaip langelis
                  virstų viktorina ir uždaviniai nustotų būti darbo lapu. */}
              {rodytiAtsakyma && kazkasIvesta && (
                <span
                  id={`vertinimas-${uzdavinys.id}`}
                  className={`be-spausdinimo t-small font-semibold ${
                    teisinga ? 'text-ink' : 'text-orange'
                  }`}
                >
                  {teisinga ? 'gerai' : 'ne'}
                </span>
              )}
            </span>
          </div>

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
