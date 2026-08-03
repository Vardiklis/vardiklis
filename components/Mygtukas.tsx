import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variantas = 'pilnas' | 'konturas' | 'tekstinis'
type Dydis = 'normalus' | 'didelis'

const variantai: Record<Variantas, string> = {
  pilnas: 'border border-orange bg-orange text-white hover:bg-[#E65300]',
  konturas: 'border border-line bg-paper text-ink hover:border-ink',
  tekstinis:
    'border border-transparent bg-transparent text-ink underline-offset-4 hover:text-orange hover:underline',
}

const dydziai: Record<Dydis, string> = {
  normalus: 'px-5 py-2.5 text-[0.9375rem]',
  didelis: 'px-6 py-3.5 text-[1.0625rem]',
}

const baze =
  'inline-flex items-center justify-center gap-2 rounded-[6px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40'

type BendriProps = {
  variantas?: Variantas
  dydis?: Dydis
  className?: string
  children: ReactNode
}

type NuorodosProps = BendriProps & { href: string }

type MygtukoProps = BendriProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

export function Mygtukas({
  variantas = 'pilnas',
  dydis = 'normalus',
  className = '',
  children,
  ...likusieji
}: NuorodosProps | MygtukoProps) {
  const stilius = `${baze} ${variantai[variantas]} ${dydziai[dydis]} ${className}`

  if ('href' in likusieji && typeof likusieji.href === 'string') {
    return (
      <Link href={likusieji.href} className={stilius}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" {...(likusieji as ButtonHTMLAttributes<HTMLButtonElement>)} className={stilius}>
      {children}
    </button>
  )
}

export default Mygtukas
