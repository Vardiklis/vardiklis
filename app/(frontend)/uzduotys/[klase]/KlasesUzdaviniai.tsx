'use client'

import { useState } from 'react'
import Mygtukas from '@/components/Mygtukas'
import UzdavinioKortele from '@/components/UzdavinioKortele'
import type { Uzdavinys } from '@/lib/generatoriai/tipai'
import { uzdaviniuKiekis } from '@/lib/lietuviu'
import { arTeisingas } from '@/lib/matematika'
import { UZDAVINIU_TEMAI, type TemosPavyzdziai } from '@/lib/uzduotys-tipai'

type Props = {
  klase: number
  /** Serverio sugeneruotos temos — jos ir yra pirmasis, indeksuojamas turinys. */
  temos: TemosPavyzdziai[]
}

/** Vienos temos kintanti būsena. Uždaviniai pradžioje — serverio. */
type TemosBusena = {
  uzdaviniai: Uzdavinys[]
  /** Ar atsakymai matomi. Pradžioje TAIP — dėl to puslapis ir vadinasi „su atsakymais". */
  rodytiAtsakymus: boolean
  /** Ar paspausta „Patikrinti atsakymus". */
  patikrinta: boolean
  /** Kol naršyklė kraunasi generatorių — mygtukai neaktyvūs. */
  kraunasi: boolean
}

export function KlasesUzdaviniai({ klase, temos }: Props) {
  const [busenos, setBusenos] = useState<Record<number, TemosBusena>>(() =>
    Object.fromEntries(
      temos.map((t) => [
        t.numeris,
        { uzdaviniai: t.uzdaviniai, rodytiAtsakymus: true, patikrinta: false, kraunasi: false },
      ]),
    ),
  )

  /** Atsakymai pagal uždavinio id — bendri visoms temoms, kaip ir generatoriuje. */
  const [atsakymai, setAtsakymai] = useState<Record<string, string>>({})

  function keisk(numeris: number, dalis: Partial<TemosBusena>) {
    setBusenos((esami) => ({ ...esami, [numeris]: { ...esami[numeris], ...dalis } }))
  }

  /**
   * Nauji uždaviniai vienai temai.
   *
   * Generatorių biblioteka didelė, o šiam puslapiui ji reikalinga tik tada, kai
   * kas nors iš tikrųjų paspaudžia mygtuką. Todėl importuojam čia, o ne failo
   * viršuje: iki paspaudimo naršyklė jos nesisiunčia visai ir puslapis lieka
   * greitas tam, kas atėjo tiesiog pasižiūrėti uždavinių.
   */
  async function atnaujink(tema: TemosPavyzdziai) {
    keisk(tema.numeris, { kraunasi: true })
    try {
      const { generuokTemosRinkini } = await import('@/lib/generatoriai')
      const nauji = generuokTemosRinkini(
        tema.generatoriai,
        tema.lygis,
        UZDAVINIU_TEMAI,
        klase,
        tema.sritis,
      )
      // Seni atsakymai priklausė seniems uždaviniams — paliktų juos kaboti
      // prie naujų id niekada nepataikytume, bet atmintį šiukšlintų.
      setAtsakymai((esami) => {
        const svarus = { ...esami }
        for (const u of busenos[tema.numeris].uzdaviniai) delete svarus[u.id]
        return svarus
      })
      keisk(tema.numeris, { uzdaviniai: nauji, patikrinta: false, kraunasi: false })
    } catch {
      // Neužsikrovus bibliotekai lieka seni uždaviniai — tai geriau nei tuščia.
      keisk(tema.numeris, { kraunasi: false })
    }
  }

  /** Visos klasės temos iš naujo — tai daro antraštės mygtukas. */
  async function atnaujinkVisas() {
    await Promise.all(temos.map(atnaujink))
  }

  const kraunasiKazkas = Object.values(busenos).some((b) => b.kraunasi)

  return (
    <>
      <div className="be-spausdinimo mt-8 flex flex-wrap gap-3">
        <Mygtukas onClick={atnaujinkVisas} disabled={kraunasiKazkas}>
          {kraunasiKazkas ? 'Generuojama…' : `Generuoti naujus ${klase} klasės uždavinius`}
        </Mygtukas>
        <Mygtukas href="/testas" variantas="konturas">
          Nemokama diagnostika
        </Mygtukas>
      </div>

      {temos.map((tema) => {
        const b = busenos[tema.numeris]
        const atsakyta = b.uzdaviniai.filter((u) => (atsakymai[u.id] ?? '').trim() !== '')
        const teisingu = atsakyta.filter((u) => arTeisingas(atsakymai[u.id], u.atsakymas)).length

        return (
          <section key={tema.numeris} id={`tema-${tema.numeris}`} className="mt-20 scroll-mt-24">
            <h2 className="t-h2">
              {tema.pavadinimas} — {klase} klasė
            </h2>

            {tema.potemiuPavadinimai.length > 0 && (
              <p className="tekstas mt-3 t-small text-muted">
                Potemės: {tema.potemiuPavadinimai.join(', ')}.
              </p>
            )}

            <div className="be-spausdinimo mt-6 flex flex-wrap items-center gap-3">
              <Mygtukas
                variantas="konturas"
                onClick={() => keisk(tema.numeris, { patikrinta: true })}
                disabled={atsakyta.length === 0}
              >
                Patikrinti atsakymus
              </Mygtukas>

              <Mygtukas
                variantas="konturas"
                onClick={() =>
                  keisk(tema.numeris, { rodytiAtsakymus: !b.rodytiAtsakymus })
                }
              >
                {b.rodytiAtsakymus ? 'Slėpti atsakymus' : 'Rodyti atsakymus'}
              </Mygtukas>

              <button
                type="button"
                onClick={() => atnaujink(tema)}
                disabled={b.kraunasi}
                aria-label={`Generuoti naujus uždavinius: ${tema.pavadinimas}`}
                title="Nauji uždaviniai"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-line bg-paper text-lg leading-none transition-colors hover:border-ink disabled:opacity-40"
              >
                <span aria-hidden="true">↻</span>
              </button>

              {/* `aria-live` — rezultatas atsiranda be perkrovimo, tad ekrano
                  skaitytuvui apie jį reikia pranešti atskirai. */}
              {b.patikrinta && (
                <p aria-live="polite" className="t-small font-semibold">
                  {teisingu} iš {uzdaviniuKiekis(atsakyta.length)} teisingai
                </p>
              )}
            </div>

            {!b.rodytiAtsakymus && !b.patikrinta && (
              <p className="be-spausdinimo mt-3 t-small text-muted">
                Atsakymai paslėpti — įrašykite savo ir spauskite „Patikrinti atsakymus“.
              </p>
            )}

            <ol className="mt-6 flex max-w-3xl flex-col gap-4">
              {b.uzdaviniai.map((u, i) => (
                <UzdavinioKortele
                  key={u.id}
                  uzdavinys={u}
                  numeris={i + 1}
                  rodytiAtsakyma={b.rodytiAtsakymus}
                  patikrinta={b.patikrinta}
                  ivestis={atsakymai[u.id] ?? ''}
                  onIvestis={(nauja) => setAtsakymai((esami) => ({ ...esami, [u.id]: nauja }))}
                />
              ))}
            </ol>
          </section>
        )
      })}
    </>
  )
}

export default KlasesUzdaviniai
