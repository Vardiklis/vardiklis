import Link from 'next/link'

/**
 * Nuoroda į `/admin/kalendorius` kairiojo meniu viršuje.
 *
 * Viršuje, o ne po kolekcijomis kaip „Sąskaitos“: kalendorius yra tai, nuo ko
 * prasideda kiekviena diena. Klasės — Payload'o, kaip `SaskaituNuoroda.tsx`.
 */
export function KalendoriausNuoroda() {
  return (
    <Link className="nav__link" href="/admin/kalendorius" prefetch={false}>
      <span className="nav__link-label">Kalendorius</span>
    </Link>
  )
}
