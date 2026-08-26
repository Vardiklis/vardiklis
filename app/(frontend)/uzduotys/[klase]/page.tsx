import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import Mygtukas from '@/components/Mygtukas'
import { uzdaviniuKiekis } from '@/lib/lietuviu'
import { meta } from '@/lib/metaduomenys'
import {
  KLASES,
  klaseIsNuorodos,
  klasesNuoroda,
  klasesPavyzdziai,
  isViso,
} from '@/lib/uzduotys-klasems'
import KlasesUzdaviniai from './KlasesUzdaviniai'

type Props = { params: Promise<{ klase: string }> }

/** Visos dešimt klasių sugeneruojamos statymo metu — vėliau jos nesikeičia. */
export function generateStaticParams() {
  return KLASES.map((klase) => ({ klase: klasesNuoroda(klase) }))
}

/** Nežinomas adresas neturi sukurti puslapio iš oro — 404 aiškesnis ir Google'ui. */
export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const klase = klaseIsNuorodos((await params).klase)
  if (klase === null) return {}

  const temos = klasesPavyzdziai(klase)
  const kiek = isViso(temos)
  // Į aprašymą surašom pirmas temas — jos ir yra tai, ko žmonės ieško
  // („trupmenos", „procentai"), o ne bendri žodžiai apie uždavinius.
  const temuSantrauka = temos
    .slice(0, 4)
    .map((t) => t.pavadinimas.toLowerCase())
    .join(', ')

  return meta({
    antraste: `${klase} klasės matematikos uždaviniai su atsakymais`,
    aprasymas: `${uzdaviniuKiekis(kiek)} ${klase} klasės matematikos uždavinių su atsakymais: ${temuSantrauka}. Nemokama, be registracijos — galima spręsti ekrane arba atsispausdinti.`,
    kelias: `/uzduotys/${klasesNuoroda(klase)}`,
    ogAprasymas: `Nemokami ${klase} klasės uždaviniai su atsakymais pagal visas programos temas.`,
  })
}

export default async function KlasesUzduotys({ params }: Props) {
  const klase = klaseIsNuorodos((await params).klase)
  if (klase === null) notFound()

  const temos = klasesPavyzdziai(klase)
  const suUzdaviniais = temos.filter((t) => t.uzdaviniai.length > 0)
  const kiek = isViso(temos)

  const ankstesne = KLASES.includes(klase - 1) ? klase - 1 : null
  const kita = KLASES.includes(klase + 1) ? klase + 1 : null

  return (
    <div className="turinys sekcija">
      <nav aria-label="Kelias" className="be-spausdinimo t-small text-muted">
        <Link href="/uzduotys" className="hover:text-orange">
          Uždavinių biblioteka
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{klase} klasė</span>
      </nav>

      <Antraste
        lygis={1}
        dydis="display-l"
        className="mt-6"
        paantraste={`${uzdaviniuKiekis(kiek)} su atsakymais pagal visas ${klase} klasės programos temas. Galima spręsti ekrane, pasitikrinti arba atsispausdinti. Prireikus — sugeneruoti naujus.`}
      >
        {klase} klasės matematikos uždaviniai
      </Antraste>

      {/* Temų sąrašas viršuje — ir skaitytojui navigacija, ir Google'ui
          santrauka, kokios temos puslapyje aprašytos. */}
      {suUzdaviniais.length > 1 && (
        <nav aria-label="Temos" className="be-spausdinimo mt-12">
          <h2 className="t-small font-semibold">Temos šiame puslapyje</h2>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {suUzdaviniais.map((t) => (
              <li key={t.numeris}>
                <a href={`#tema-${t.numeris}`} className="t-small text-muted hover:text-orange">
                  {t.pavadinimas}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Uždaviniai atvaizduojami ir serveryje — kliento komponentas čia
          įterptas be `ssr: false`, tad statiniame HTML lieka visas turinys su
          atsakymais. Naršyklė jį tik atgaivina: prideda įvedimo laukus,
          klaviatūrą ir tikrinimą. */}
      <KlasesUzdaviniai klase={klase} temos={suUzdaviniais} />

      {/* ── Kitos klasės ───────────────────────────────────────────────────── */}
      <section className="be-spausdinimo mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="t-h2">Kitų klasių uždaviniai</h2>

        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
          {KLASES.map((k) => (
            <li key={k}>
              {k === klase ? (
                <span className="t-body font-semibold text-orange">{k} klasė</span>
              ) : (
                <Link href={`/uzduotys/${klasesNuoroda(k)}`} className="t-body hover:text-orange">
                  {k} klasė
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          {ankstesne !== null && (
            <Mygtukas href={`/uzduotys/${klasesNuoroda(ankstesne)}`} variantas="konturas">
              ← {ankstesne} klasė
            </Mygtukas>
          )}
          {kita !== null && (
            <Mygtukas href={`/uzduotys/${klasesNuoroda(kita)}`} variantas="konturas">
              {kita} klasė →
            </Mygtukas>
          )}
        </div>
      </section>
    </div>
  )
}
