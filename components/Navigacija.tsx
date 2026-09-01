'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { kontaktai } from '@/lib/kontaktai'
import { nuorodos } from '@/lib/nuorodos'
import Logotipas from './Logotipas'
import Mygtukas from './Mygtukas'

export function Navigacija() {
  const kelias = usePathname()
  const [atidarytas, setAtidarytas] = useState(false)

  useEffect(() => {
    if (!atidarytas) return
    const uzdaryk = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAtidarytas(false)
    }
    document.addEventListener('keydown', uzdaryk)
    return () => document.removeEventListener('keydown', uzdaryk)
  }, [atidarytas])

  return (
    <header className="be-spausdinimo fixed inset-x-0 top-0 z-50 border-b border-line bg-paper">
      <nav
        className="turinys flex h-16 items-center justify-between gap-3 md:gap-6"
        aria-label="Pagrindinė"
      >
        <Logotipas />

        <div className="hidden items-center gap-7 md:flex">
          <ul className="flex items-center gap-7">
            {nuorodos.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={kelias === n.href ? 'page' : undefined}
                  className={`t-small transition-colors hover:text-orange ${
                    kelias === n.href ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {n.tekstas}
                </Link>
              </li>
            ))}
          </ul>
          <Mygtukas href="/testas">Pradėti diagnostiką</Mygtukas>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {/* Mobiliajame greitkelis skambučiui — kad nereikėtų eiti per „Susisiekti".
              `tel:` be tarpų: su tarpais dalis telefonų numerio nesurenka. */}
          <a
            href={`tel:${kontaktai.telefonasNuoroda}`}
            aria-label={`Paskambinti ${kontaktai.telefonas}`}
            className="inline-flex h-11 items-center justify-center rounded-[6px] border border-orange bg-orange px-4 text-[0.9375rem] font-semibold text-ink transition-colors hover:bg-[#F05600]"
          >
            Paskambinti
          </a>

          <button
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center"
            aria-expanded={atidarytas}
            aria-controls="mobilus-meniu"
            aria-label={atidarytas ? 'Uždaryti meniu' : 'Atidaryti meniu'}
            onClick={() => setAtidarytas((v) => !v)}
          >
            <span className="flex w-6 flex-col gap-[5px]" aria-hidden="true">
              <span className="h-0.5 w-full bg-ink" />
              <span className="h-0.5 w-full bg-ink" />
              <span className="h-0.5 w-2/3 bg-orange" />
            </span>
          </button>
        </div>
      </nav>

      {atidarytas && (
        <div id="mobilus-meniu" className="border-t border-line bg-paper md:hidden">
          <ul className="turinys flex flex-col py-2">
            {nuorodos.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={kelias === n.href ? 'page' : undefined}
                  onClick={() => setAtidarytas(false)}
                  className="block border-b border-line py-3.5 t-body last:border-0"
                >
                  {n.tekstas}
                </Link>
              </li>
            ))}
          </ul>
          <div className="turinys pb-5">
            <Mygtukas href="/testas" onClick={() => setAtidarytas(false)} className="w-full">
              Pradėti diagnostiką
            </Mygtukas>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navigacija
