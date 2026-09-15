import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import DienynoPrisijungimas from '@/components/DienynoPrisijungimas'
import { Logotipas } from '@/components/Logotipas'
import { kontaktai } from '@/lib/kontaktai'
import { dienynoKelias, prisijungesAdministratorius, prisijungusiPaskyra } from '@/lib/dienynas'

export const metadata: Metadata = { title: 'Prisijungimas' }

export default async function PrisijungimoPuslapis() {
  const saknis = await dienynoKelias('/')
  if (await prisijungusiPaskyra()) redirect(saknis)

  /**
   * Prisijungusios prie CMS korepetitorės čia NEPERMETAM į suvestinę: kitaip ji
   * negalėtų išbandyti vaiko paskyros tame pačiame naršyklės lange.
   */
  const administratorius = await prisijungesAdministratorius()

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-5 py-12">
      <div className="mb-8">
        <Logotipas kaipNuoroda={false} />
        <h1 className="t-h2 mt-6">Dienynas</h1>
        <p className="t-small mt-1 text-muted">Namų darbai, temos ir kita pamoka.</p>
      </div>

      {administratorius && (
        <p className="t-small mb-6 rounded-[6px] bg-orange-soft px-3.5 py-2.5">
          Esate prisijungę prie CMS.{' '}
          <a href={saknis} className="font-semibold underline underline-offset-4">
            Atidaryti suvestinę →
          </a>
        </p>
      )}

      <DienynoPrisijungimas />

      <p className="t-small mt-8 text-muted">
        Pamiršote vardą ar slaptažodį? Parašykite ar paskambinkite{' '}
        <a href={`tel:${kontaktai.telefonasNuoroda}`} className="whitespace-nowrap text-ink underline underline-offset-4">
          {kontaktai.telefonas}
        </a>{' '}
        — gausite naują.
      </p>

      {!administratorius && (
        <p className="t-small mt-4 text-muted">
          <a
            href={`/admin/login?redirect=${encodeURIComponent(saknis)}`}
            className="underline underline-offset-4 hover:text-ink"
          >
            Korepetitorei — prisijungti per CMS
          </a>
        </p>
      )}
    </main>
  )
}
