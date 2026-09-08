import Link from 'next/link'

/**
 * Nuoroda į `/admin/saskaitos` kairiajame meniu.
 *
 * Payload į meniu pats surašo tik kolekcijas ir globalus — savų langų jis apie
 * juos nežino. Be šitos nuorodos į sąskaitų langą būtų galima patekti tik
 * ranka įrašius adresą.
 *
 * Klasės — Payload'o `nav` klasės, kad nuoroda atrodytų kaip visos kitos ir
 * paveldėtų jų būsenas.
 */
export function SaskaituNuoroda() {
  return (
    <Link className="nav__link" href="/admin/saskaitos" prefetch={false}>
      <span className="nav__link-label">Sąskaitos</span>
    </Link>
  )
}
