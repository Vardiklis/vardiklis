import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import DienynoSlaptazodis from '@/components/DienynoSlaptazodis'
import { Logotipas } from '@/components/Logotipas'
import { dienynoKelias, prisijungusiPaskyra, SLAPTAZODZIO_ILGIS } from '@/lib/dienynas'
import { atsijungti } from '../veiksmai'

export const metadata: Metadata = { title: 'Naujas slaptažodis' }

/**
 * Pirmas prisijungimas: laikiną korepetitorės slaptažodį vaikas pakeičia savu.
 *
 * Kol neįvykdyta, dienyno pradžia permeta čia. Pasikeitusiam — atgal į
 * dienyną: savo slaptažodžio čia pakeisti nebegalima (žr. `keistiSlaptazodi`).
 */
export default async function SlaptazodzioPuslapis() {
  const paskyra = await prisijungusiPaskyra()
  if (!paskyra) redirect(await dienynoKelias('/prisijungti'))
  if (!paskyra.keistiSlaptazodi) redirect(await dienynoKelias('/'))

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-5 py-12">
      <div className="mb-8">
        <Logotipas kaipNuoroda={false} />
        <h1 className="t-h2 mt-6">Susikurkite savo slaptažodį</h1>
        <p className="t-small mt-1 text-muted">
          Gavote laikiną slaptažodį. Sugalvokite savo — juo jungsitės nuo šiol. Vardas lieka tas pats:{' '}
          <strong className="text-ink">{paskyra.vardas}</strong>.
        </p>
      </div>

      <DienynoSlaptazodis ilgis={SLAPTAZODZIO_ILGIS} />

      <form action={atsijungti} className="mt-8">
        <button type="submit" className="t-small text-muted underline underline-offset-4 hover:text-ink">
          Atsijungti
        </button>
      </form>
    </main>
  )
}
