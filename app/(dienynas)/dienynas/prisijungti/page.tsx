import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import DienynoPrisijungimas from '@/components/DienynoPrisijungimas'
import { Logotipas } from '@/components/Logotipas'
import { kontaktai } from '@/lib/kontaktai'
import { dienynoKelias, prisijungusiPaskyra } from '@/lib/dienynas'

export const metadata: Metadata = { title: 'Prisijungimas' }

export default async function PrisijungimoPuslapis() {
  if (await prisijungusiPaskyra()) redirect(await dienynoKelias('/'))

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-5 py-12">
      <div className="mb-8">
        <Logotipas kaipNuoroda={false} />
        <h1 className="t-h2 mt-6">Dienynas</h1>
        <p className="t-small mt-1 text-muted">Namų darbai, temos ir kita pamoka.</p>
      </div>

      <DienynoPrisijungimas />

      <p className="t-small mt-8 text-muted">
        Pamiršote vardą ar slaptažodį? Parašykite ar paskambinkite{' '}
        <a href={`tel:${kontaktai.telefonasNuoroda}`} className="whitespace-nowrap text-ink underline underline-offset-4">
          {kontaktai.telefonas}
        </a>{' '}
        — gausite naują.
      </p>
    </main>
  )
}
