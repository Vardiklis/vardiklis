import type { ReactNode } from 'react'

type Dydis = 'inline' | 'normalus' | 'didelis' | 'hero'

type Props = {
  skaitiklis: ReactNode
  vardiklis: ReactNode
  dydis?: Dydis
  /** Brūkšnio spalva. Oranžinė — tik ten, kur trupmena yra akcentas. */
  bruksnys?: 'ink' | 'orange' | 'line'
  /** Vardiklis išryškinamas — naudojama hero'juje ir ataskaitoje. */
  vardiklisRyskus?: boolean
  /** Vardiklis atsiranda ~400 ms vėliau nei skaitiklis (5.3). */
  animuotas?: boolean
  /** Ką ekrano skaitytuvas perskaito vietoj stackuoto turinio. */
  etikete?: string
  className?: string
}

const dydziai: Record<Dydis, { tekstas: string; tarpas: string; storis: string }> = {
  inline: { tekstas: 'text-[0.85em] leading-tight', tarpas: 'px-1', storis: 'h-px' },
  normalus: { tekstas: 'text-base leading-tight', tarpas: 'px-1.5 py-0.5', storis: 'h-px' },
  didelis: { tekstas: 'text-xl leading-tight', tarpas: 'px-2 py-1', storis: 'h-0.5' },
  hero: {
    tekstas: 'leading-snug',
    tarpas: 'px-2 py-3 md:py-4',
    storis: 'h-0.5',
  },
}

const bruksnioSpalvos = {
  ink: 'bg-ink',
  orange: 'bg-orange',
  line: 'bg-line',
} as const

/**
 * Stackuota trupmena — signature elementas (5.3).
 * Trupmenos niekur nerašomos kaip `3/4`; įstrižas brūkšnys tik įterptas į tekstą.
 */
export function Trupmena({
  skaitiklis,
  vardiklis,
  dydis = 'normalus',
  bruksnys = 'ink',
  vardiklisRyskus = false,
  animuotas = false,
  etikete,
  className = '',
}: Props) {
  const d = dydziai[dydis]
  const turinysPaslepias = etikete ? true : undefined

  return (
    <span
      className={`inline-flex flex-col items-center align-middle ${d.tekstas} ${className}`}
      role={etikete ? 'img' : undefined}
      aria-label={etikete}
    >
      <span className={`${d.tarpas} text-center`} aria-hidden={turinysPaslepias}>
        {skaitiklis}
      </span>
      <span
        className={`w-full self-stretch ${d.storis} ${bruksnioSpalvos[bruksnys]}`}
        aria-hidden="true"
      />
      <span
        className={[
          d.tarpas,
          'text-center',
          vardiklisRyskus ? 'font-semibold' : '',
          animuotas ? 'animacija-vardiklis' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={turinysPaslepias}
      >
        {vardiklis}
      </span>
    </span>
  )
}

export default Trupmena
