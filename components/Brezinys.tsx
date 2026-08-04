type Props = {
  /** SVG žymėjimas, sukurtas generatoriaus. */
  svg: string
  className?: string
}

/**
 * Brėžinys prie uždavinio.
 *
 * SVG ateina iš mūsų pačių generatorių `lib/generatoriai/braizymas.ts`, ne iš
 * vartotojo įvesties ir ne iš tinklo, todėl įterpiamas tiesiogiai. Spalvos
 * jame nurodytos kintamaisiais, tad spausdinant brėžinys pats virsta juodu.
 */
export function Brezinys({ svg, className = '' }: Props) {
  return (
    <div
      className={`spausdinimo-blokas overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default Brezinys
