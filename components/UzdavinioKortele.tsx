'use client'

import type { Uzdavinys } from '@/lib/generatoriai'
import Formule from './Formule'

type Props = {
  uzdavinys: Uzdavinys
  numeris: number
  rodytiAtsakyma: boolean
}

/**
 * Viena uždavinio kortelė uždavinių sąraše.
 * Spausdinant kortelė nelaužoma per puslapio ribą (`spausdinimo-blokas`).
 */
export function UzdavinioKortele({ uzdavinys, numeris, rodytiAtsakyma }: Props) {
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
          <Formule
            tekstas={uzdavinys.klausimas}
            className="block font-mono text-[1.0625rem] leading-relaxed"
          />

          {rodytiAtsakyma ? (
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
          ) : (
            // Vieta atsakymui ranka — kad išspausdintas lapas būtų naudingas.
            <div className="mt-5 h-8 border-b border-line print:mt-6" aria-hidden="true" />
          )}
        </div>
      </div>
    </li>
  )
}

export default UzdavinioKortele
