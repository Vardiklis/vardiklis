'use client'

import katex from 'katex'
import { useMemo } from 'react'
import 'katex/dist/katex.min.css'

type Props = {
  /**
   * Tekstas su matematika tarp `$...$`.
   * Pvz.: 'Apskaičiuok $\\dfrac{2}{3} + \\dfrac{3}{4}$'
   */
  tekstas: string
  className?: string
}

/**
 * Atvaizduoja mišrų tekstą: paprastas lietuviškas tekstas lieka teksto šriftu,
 * o `$...$` fragmentai surenkami KaTeX'u.
 *
 * Uždaviniai generuojami naršyklėje, todėl ir renderinimas vyksta kliente.
 */
export function Formule({ tekstas, className = '' }: Props) {
  const dalys = useMemo(() => {
    const gabalai = tekstas.split('$')
    return gabalai.map((gabalas, i) => {
      if (i % 2 === 0) return { matematika: false, turinys: gabalas }
      return {
        matematika: true,
        turinys: katex.renderToString(gabalas, {
          throwOnError: false,
          displayMode: false,
          strict: false,
        }),
      }
    })
  }, [tekstas])

  return (
    <span className={className}>
      {dalys.map((d, i) =>
        d.matematika ? (
           
          <span key={i} dangerouslySetInnerHTML={{ __html: d.turinys }} />
        ) : (
          <span key={i}>{d.turinys}</span>
        ),
      )}
    </span>
  )
}

export default Formule
