import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Antraste from '@/components/Antraste'
import { data, visiStraipsniai } from '@/lib/straipsniai'

export const metadata: Metadata = {
  title: 'Straipsniai apie matematikos mokymąsi',
  description:
    'Praktiniai patarimai tėvams ir mokytojams: kaip padėti vaikui su matematika, ką reiškia pasiekimų lygiai, kaip ruoštis NMPP ir PUPP.',
  openGraph: {
    title: 'Straipsniai — Vardiklis',
    description: 'Praktiniai patarimai apie matematikos mokymąsi, NMPP ir PUPP.',
  },
}

/**
 * Atvaizduojama užklausos metu, nes turinys ateina iš Payload.
 * Paskelbtas straipsnis atsiranda iš karto, be naujo diegimo.
 */
export const dynamic = 'force-dynamic'

export default async function Straipsniai() {
  const straipsniai = await visiStraipsniai()

  return (
    <div className="turinys sekcija">
      <Antraste
        lygis={1}
        dydis="display-l"
        paantraste="Praktiniai patarimai tėvams ir mokytojams — apie tai, kur matematikoje dažniausiai nutrūksta grandinė ir ką su tuo daryti."
      >
        Straipsniai
      </Antraste>

      {straipsniai.length === 0 ? (
        <p className="mt-12 t-body text-muted">Straipsnių kol kas nėra.</p>
      ) : (
        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {straipsniai.map((s) => (
            <li key={s.id}>
              <Link
                href={`/straipsniai/${s.nuoroda}`}
                className="flex h-full flex-col overflow-hidden rounded-[8px] border border-line bg-paper transition-colors hover:border-ink"
              >
                {s.virselis && (
                  <div className="relative aspect-[16/9] w-full border-b border-line bg-paper-2">
                    <Image
                      src={s.virselis.url}
                      alt={s.virselis.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  {s.paskelbta && (
                    <time dateTime={s.paskelbta} className="font-mono t-small text-muted">
                      {data(s.paskelbta)}
                    </time>
                  )}
                  <h2 className="mt-2 t-h3">{s.pavadinimas}</h2>
                  <p className="tekstas mt-3 t-body text-muted">{s.santrauka}</p>
                  <span className="mt-auto pt-5 t-small font-semibold underline decoration-orange decoration-2 underline-offset-4">
                    Skaityti
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
