type Props = {
  className?: string
}

/**
 * Sekcijų skirtukas (5.3, punktas 2).
 * Pirmi 48px oranžiniai ir 2px storio, toliau 1px `--line` iki galo —
 * skaitosi kaip trupmenos brūkšnys, kuris prasideda.
 */
export function BruksnysDivider({ className = '' }: Props) {
  return (
    <div className={`flex items-center ${className}`} role="separator" aria-hidden="true">
      <span className="h-0.5 w-12 shrink-0 bg-orange" />
      <span className="h-px grow bg-line" />
    </div>
  )
}

export default BruksnysDivider
