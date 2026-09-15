import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { DienynoAntraste, VaikoSkiltis } from '@/components/DienynoVaikas'
import { DienynoSuvestine } from '@/components/DienynoSuvestine'
import {
  dienynoKelias,
  korepetitoresSuvestine,
  prisijungesAdministratorius,
  prisijungusiPaskyra,
  vaikoDienynas,
  type VaikoDienynas,
} from '@/lib/dienynas'
import { data as dataVilniuje } from '@/lib/laikas'
import { atsijungti } from './veiksmai'

/**
 * Dienyno pradžia. Kas rodoma, priklauso nuo to, kas atėjo:
 *
 *   • VAIKAS AR TĖVAI (dienyno slapukas) — savo vaikų kita pamoka ir temos.
 *     Vaikų sąrašas imamas TIK iš paskyros, o `?mokinys=` jiems ignoruojamas,
 *     tad svetimo vaiko dienyno pamatyti neįmanoma.
 *   • KOREPETITORĖ (prisijungusi prie `/admin`) — visų mokinių suvestinė, o su
 *     `?mokinys=…` — konkretaus vaiko dienynas taip, kaip jį mato vaikas.
 *
 * Dienyno slapukas laimi: prisijungus bandomąja vaiko paskyra, matosi vaiko
 * vaizdas, o ne suvestinė. Atsijungus nuo jos — vėl suvestinė.
 */

type Props = { searchParams: Promise<{ mokinys?: string | string[] }> }

export default async function DienynoPuslapis({ searchParams }: Props) {
  const dabar = new Date()
  const siandien = dataVilniuje(dabar)

  const saknis = await dienynoKelias('/')

  const paskyra = await prisijungusiPaskyra()
  if (paskyra?.keistiSlaptazodi) redirect(await dienynoKelias('/slaptazodis'))
  if (paskyra) {
    const vaikai = (await Promise.all(paskyra.mokiniai.map((id) => vaikoDienynas(id, dabar)))).filter(
      (v): v is VaikoDienynas => v !== null,
    )
    return (
      <div className="mx-auto w-full max-w-2xl px-5 pb-16">
        <DienynoAntraste>
          <form action={atsijungti}>
            <button type="submit" className="text-muted underline-offset-4 hover:text-ink hover:underline">
              Atsijungti
            </button>
          </form>
        </DienynoAntraste>
        <main>
          {vaikai.length === 0 && (
            <p className="t-body mt-10 text-muted">
              Šiai paskyrai dar nepriskirtas nė vienas mokinys. Parašykite korepetitorei.
            </p>
          )}
          {vaikai.map((vaikas) => (
            <VaikoSkiltis
              key={vaikas.id}
              vaikas={vaikas}
              siandien={siandien}
              dienynoSaknis={saknis}
              pasisveikinti={vaikai.length === 1}
            />
          ))}
        </main>
      </div>
    )
  }

  if (!(await prisijungesAdministratorius())) redirect(await dienynoKelias('/prisijungti'))

  const { mokinys } = await searchParams

  if (typeof mokinys === 'string') {
    const vaikas = await vaikoDienynas(mokinys, dabar)
    if (!vaikas) notFound()
    return (
      <div className="mx-auto w-full max-w-2xl px-5 pb-16">
        <DienynoAntraste>
          <a href={saknis} className="text-muted underline-offset-4 hover:text-ink hover:underline">
            ← Suvestinė
          </a>
        </DienynoAntraste>
        <p className="t-small mt-6 rounded-[6px] bg-orange-soft px-3.5 py-2.5">
          Taip dienyną mato <strong>{vaikas.vardas}</strong> ir tėvai. Mygtukas į pamoką peržiūroje neveikia.
        </p>
        <VaikoSkiltis vaikas={vaikas} siandien={siandien} dienynoSaknis={saknis} pasisveikinti perziura />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16">
      <DienynoAntraste>
        <Link href="/admin" prefetch={false} className="text-muted underline-offset-4 hover:text-ink hover:underline">
          Į CMS
        </Link>
      </DienynoAntraste>
      <DienynoSuvestine vaikai={await korepetitoresSuvestine(dabar)} siandien={siandien} dienynoSaknis={saknis} />
    </div>
  )
}
