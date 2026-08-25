import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BruksnysDivider from '@/components/BruksnysDivider'
import GyvaPerziura from '@/components/GyvaPerziura'
import PoStraipsnio from '@/components/PoStraipsnio'
import StraipsnioTurinys from '@/components/StraipsnioTurinys'
import { svetaine } from '@/lib/kontaktai'
import { data, rastStraipsni } from '@/lib/straipsniai'

type Props = {
  params: Promise<{ nuoroda: string }>
  /** `?perziura=1` ateina iš CMS — rodo juodraštį prisijungusiam redaktoriui. */
  searchParams: Promise<{ [raktas: string]: string | string[] | undefined }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nuoroda } = await params
  const s = await rastStraipsni(nuoroda)
  if (!s) return { title: 'Straipsnis nerastas' }

  // SEO įskiepio laukai turi pirmenybę; jei tušti — imam straipsnio duomenis.
  const antraste = s.meta.title || `${s.pavadinimas} · Vardiklis`
  const aprasymas = s.meta.description || s.santrauka
  const paveikslelis = s.meta.image || s.virselis?.url

  return {
    title: antraste,
    description: aprasymas,
    alternates: { canonical: `${svetaine.url}/straipsniai/${s.nuoroda}` },
    openGraph: {
      type: 'article',
      title: antraste,
      description: aprasymas,
      url: `${svetaine.url}/straipsniai/${s.nuoroda}`,
      ...(s.paskelbta ? { publishedTime: s.paskelbta } : {}),
      ...(paveikslelis ? { images: [{ url: paveikslelis }] } : {}),
    },
  }
}

export default async function StraipsnioPuslapis({ params, searchParams }: Props) {
  const { nuoroda } = await params
  const perziura = (await searchParams).perziura === '1'
  const s = await rastStraipsni(nuoroda, perziura)
  if (!s) notFound()

  const struktura = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: s.pavadinimas,
    description: s.santrauka,
    inLanguage: 'lt',
    mainEntityOfPage: `${svetaine.url}/straipsniai/${s.nuoroda}`,
    ...(s.paskelbta ? { datePublished: s.paskelbta } : {}),
    ...(s.virselis ? { image: `${svetaine.url}${s.virselis.url}` } : {}),
    publisher: { '@type': 'Organization', name: svetaine.pavadinimas, url: svetaine.url },
  }

  return (
    <article className="straipsnio-lapas">
      <div className="straipsnio-stulpelis sekcija">
        {perziura && <GyvaPerziura />}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(struktura) }}
        />

        <p className="t-small text-muted">
          <Link href="/straipsniai" className="underline underline-offset-4 hover:text-orange">
            Straipsniai
          </Link>
        </p>

        <h1 className="mt-4 display-l">{s.pavadinimas}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          {s.paskelbta && (
            <time dateTime={s.paskelbta} className="font-mono t-small text-muted">
              {data(s.paskelbta)}
            </time>
          )}
          {s.klases.length > 0 && (
            <span className="t-small text-muted">
              {s.klases.length === 1 ? `${s.klases[0]} klasei` : `${s.klases.join(', ')} klasėms`}
            </span>
          )}
        </div>

        <p className="straipsnio-santrauka mt-6">{s.santrauka}</p>

        {s.virselis && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[8px] border border-line bg-paper-2">
            <Image
              src={s.virselis.url}
              alt={s.virselis.alt}
              fill
              sizes="(min-width: 768px) 46rem, 100vw"
              priority
              className="object-cover"
            />
          </div>
        )}

        <BruksnysDivider className="my-10" />

        <StraipsnioTurinys turinys={s.turinys} />

        <PoStraipsnio saltinis={`${svetaine.url}/straipsniai/${s.nuoroda}`} />

        <BruksnysDivider className="mt-14 mb-8" />
        <p>
          <Link
            href="/straipsniai"
            className="t-body font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
          >
            Visi straipsniai
          </Link>
        </p>
      </div>
    </article>
  )
}
