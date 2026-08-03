import Link from 'next/link'
import { svetaine } from '@/lib/kontaktai'

type Props = {
  /** Su lotynišku prierašu — hero'juje ir poraštėje. Navigacijoje be. */
  suPrierasu?: boolean
  dydis?: 'nav' | 'didelis'
  /** Poraštėje ir hero'juje logotipas nėra nuoroda į patį save. */
  kaipNuoroda?: boolean
  className?: string
}

/**
 * Logotipas (6.1): žodis `Vardiklis` display šriftu, virš jo 1px oranžinis
 * brūkšnys, kurio plotis lygus žodžio pločiui. Žodis yra vardiklis — brūkšnys
 * virš jo, ne po juo.
 */
export function Logotipas({
  suPrierasu = false,
  dydis = 'nav',
  kaipNuoroda = true,
  className = '',
}: Props) {
  const zodis = (
    <span className="inline-flex flex-col items-start">
      <span className="h-px w-full bg-orange" aria-hidden="true" />
      <span
        className={`font-display font-semibold tracking-[-0.02em] ${
          dydis === 'nav' ? 'text-[1.25rem] leading-tight' : 'text-[1.75rem] leading-tight'
        }`}
      >
        {svetaine.pavadinimas}
      </span>
    </span>
  )

  return (
    <span className={`inline-flex flex-col items-start ${className}`}>
      {kaipNuoroda ? (
        <Link href="/" className="inline-flex" aria-label={`${svetaine.pavadinimas} — į pradžią`}>
          {zodis}
        </Link>
      ) : (
        zodis
      )}
      {suPrierasu && (
        <span className="mt-1.5 t-small text-muted">{svetaine.prierasas}</span>
      )}
    </span>
  )
}

export default Logotipas
