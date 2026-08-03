import type { ReactNode } from 'react'
import BruksnysDivider from './BruksnysDivider'

type Props = {
  children: ReactNode
  /** Paantraštė po antrašte, `--muted`, iki 40rem. */
  paantraste?: ReactNode
  /** HTML lygis. Hierarchija be praleidimų — 10 skyrius. */
  lygis?: 1 | 2 | 3
  /** Vizualus dydis nepriklauso nuo lygio. */
  dydis?: 'display-xl' | 'display-l' | 'h2' | 'h3'
  /** Skirtukas virš antraštės — sekcijų kaita. */
  suSkirtuku?: boolean
  className?: string
}

export function Antraste({
  children,
  paantraste,
  lygis = 2,
  dydis = 'h2',
  suSkirtuku = false,
  className = '',
}: Props) {
  const Zyme = lygis === 1 ? 'h1' : lygis === 2 ? 'h2' : 'h3'
  const dydzioKlase =
    dydis === 'display-xl'
      ? 'display-xl'
      : dydis === 'display-l'
        ? 'display-l'
        : dydis === 'h2'
          ? 't-h2'
          : 't-h3'

  return (
    <div className={className}>
      {suSkirtuku && <BruksnysDivider className="mb-8" />}
      <Zyme className={dydzioKlase}>{children}</Zyme>
      {paantraste && <p className="tekstas mt-4 t-body text-muted">{paantraste}</p>}
    </div>
  )
}

export default Antraste
