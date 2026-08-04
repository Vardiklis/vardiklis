'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import Mygtukas from '@/components/Mygtukas'
import { generuokRinkini, type Lygis, type Uzdavinys } from '@/lib/generatoriai'
import { potemes, programa, type IsskleistaPotema, type ProgramosTema } from '@/lib/programa'

// KaTeX (JS + CSS) užkraunamas tik tada, kai uždaviniai iš tikrųjų sugeneruoti —
// kitaip jis blokuotų tuščio puslapio piešimą.
const UzdavinioKortele = dynamic(() => import('@/components/UzdavinioKortele'), {
  ssr: false,
})

const KIEKIAI = [5, 10, 20] as const

const LYGIAI: { reiksme: Lygis; etikete: string }[] = [
  { reiksme: 1, etikete: 'Lengvas' },
  { reiksme: 2, etikete: 'Vidutinis' },
  { reiksme: 3, etikete: 'Sunkus' },
]

type Pasirinkta = {
  klase: number
  temosNumeris: number
  potemesNumeris: string | null
  temosPavadinimas: string
  generatorius: string
  antraste: string
}

export function UzduociuGeneratorius() {
  const [klase, setKlase] = useState(6)
  const [isskleista, setIsskleista] = useState<number | null>(null)
  const [pasirinkta, setPasirinkta] = useState<Pasirinkta | null>(null)
  const [lygis, setLygis] = useState<Lygis>(2)
  const [kiekis, setKiekis] = useState<number>(10)
  const [uzdaviniai, setUzdaviniai] = useState<Uzdavinys[]>([])
  const [rodytiAtsakymus, setRodytiAtsakymus] = useState(false)

  // Potemės išskleidžiamos kartą pakeitus klasę, o ne kiekvieno perpiešimo metu —
  // kiekvienas paspaudimas sąraše perpiešia visą akordeoną.
  const klasesTemos = useMemo(
    () =>
      (programa.find((k) => k.klase === klase)?.temos ?? []).map((tema) => ({
        tema,
        sarasas: potemes(tema),
      })),
    [klase],
  )
  const skirstomaIPotemes = klasesTemos.some((t) => t.sarasas.length > 0)

  function keiskKlase(nauja: number) {
    setKlase(nauja)
    setIsskleista(null)
    setPasirinkta(null)
    setUzdaviniai([])
  }

  function generuok(p: Pasirinkta, naujasLygis: Lygis, naujasKiekis: number) {
    setPasirinkta(p)
    setLygis(naujasLygis)
    setKiekis(naujasKiekis)
    setUzdaviniai(generuokRinkini(p.generatorius, naujasLygis, naujasKiekis))
    setRodytiAtsakymus(false)
  }

  /** Visos temos uždaviniai — kai norima ne vienos potemės, o viso skyriaus. */
  function pasirinkTema(tema: ProgramosTema) {
    if (!tema.generatorius) return
    generuok(
      {
        klase,
        temosNumeris: tema.numeris,
        potemesNumeris: null,
        temosPavadinimas: tema.pavadinimas,
        generatorius: tema.generatorius,
        antraste: `${tema.numeris}. ${tema.pavadinimas}`,
      },
      tema.lygis ?? 2,
      kiekis,
    )
  }

  function pasirinkPotema(tema: ProgramosTema, p: IsskleistaPotema) {
    if (!p.generatorius) return
    generuok(
      {
        klase,
        temosNumeris: tema.numeris,
        potemesNumeris: p.numeris,
        temosPavadinimas: tema.pavadinimas,
        generatorius: p.generatorius,
        antraste: `${p.numeris}. ${p.pavadinimas}`,
      },
      p.lygis,
      kiekis,
    )
  }

  /** Ar rinkinys priklauso būtent šiai vietai sąraše. */
  function cia(temosNumeris: number, potemesNumeris: string | null): boolean {
    return (
      pasirinkta !== null &&
      uzdaviniai.length > 0 &&
      pasirinkta.klase === klase &&
      pasirinkta.temosNumeris === temosNumeris &&
      pasirinkta.potemesNumeris === potemesNumeris
    )
  }

  /**
   * Sugeneruotas rinkinys. Rodomas iškart po pasirinkta tema ar poteme —
   * taip matyti, iš kur uždaviniai atsirado, ir nereikia slinkti į puslapio galą.
   */
  function rinkinys() {
    if (!pasirinkta) return null

    return (
      <div className="mt-3 rounded-[8px] border border-line bg-paper p-4 md:p-5 print:border-0 print:p-0">
        {/* Antraštė lapui — matoma tik spausdinant. */}
        <div className="hidden print:block">
          <h3 className="t-h2">
            {pasirinkta.klase} kl. · {pasirinkta.antraste}
          </h3>
          <p className="mt-6 t-small">
            Vardas, pavardė: ______________________ Data: ____________
          </p>
        </div>

        <div className="be-spausdinimo">
          <h3 className="t-h3">{pasirinkta.antraste}</h3>
          <p className="mt-1 t-small text-muted">
            {pasirinkta.klase} klasė · {uzdaviniai.length} uždaviniai
          </p>

          <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-5">
            <div>
              <span className="block t-small font-semibold">Sunkumas</span>
              <div className="mt-2 flex gap-2">
                {LYGIAI.map((l) => (
                  <button
                    key={l.reiksme}
                    type="button"
                    onClick={() => generuok(pasirinkta, l.reiksme, kiekis)}
                    aria-pressed={l.reiksme === lygis}
                    className={`rounded-[6px] border px-4 py-2 t-small transition-colors ${
                      l.reiksme === lygis
                        ? 'border-ink bg-paper font-semibold'
                        : 'border-line bg-paper text-muted hover:border-ink'
                    }`}
                  >
                    {l.etikete}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block t-small font-semibold">Kiek uždavinių</span>
              <div className="mt-2 flex gap-2">
                {KIEKIAI.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => generuok(pasirinkta, lygis, k)}
                    aria-pressed={k === kiekis}
                    className={`rounded-[6px] border px-4 py-2 font-mono t-small transition-colors ${
                      k === kiekis
                        ? 'border-ink bg-paper font-semibold'
                        : 'border-line bg-paper text-muted hover:border-ink'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Mygtukas onClick={() => generuok(pasirinkta, lygis, kiekis)}>
              Nauji uždaviniai
            </Mygtukas>
            <Mygtukas variantas="konturas" onClick={() => setRodytiAtsakymus((v) => !v)}>
              {rodytiAtsakymus ? 'Slėpti atsakymus' : 'Rodyti atsakymus'}
            </Mygtukas>
            <Mygtukas variantas="konturas" onClick={() => window.print()}>
              Spausdinti
            </Mygtukas>
          </div>
        </div>

        <ol className="mt-6 flex flex-col gap-4 print:gap-3">
          {uzdaviniai.map((u, i) => (
            <UzdavinioKortele
              key={u.id}
              uzdavinys={u}
              numeris={i + 1}
              rodytiAtsakyma={rodytiAtsakymus}
            />
          ))}
        </ol>
      </div>
    )
  }

  return (
    <>
      {/* ── Klasės pasirinkimas ─────────────────────────────────────────── */}
      <div className="be-spausdinimo mt-10">
        <h2 className="t-small font-semibold">Klasė</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {programa.map((k) => (
            <button
              key={k.klase}
              type="button"
              onClick={() => keiskKlase(k.klase)}
              aria-pressed={k.klase === klase}
              className={`h-11 w-11 rounded-[6px] border font-mono text-[0.9375rem] transition-colors ${
                k.klase === klase
                  ? 'border-orange bg-orange font-semibold text-ink'
                  : 'border-line bg-paper text-ink hover:border-ink'
              }`}
            >
              {k.klase}
            </button>
          ))}
        </div>
      </div>

      {/* ── Temų akordeonas ─────────────────────────────────────────────── */}
      <div className="mt-10">
        <div className="be-spausdinimo">
          <h2 className="t-h3">{klase} klasės temos</h2>
          <p className="mt-2 t-small text-muted">
            {skirstomaIPotemes
              ? 'Spustelėkite temą — ji išsiskleis į potemes. Paspaudus potemę, uždaviniai atsiranda čia pat, po ja.'
              : 'Šios klasės programoje temos į potemes neskirstomos, tad spustelėjus temą uždaviniai atsiranda čia pat, po ja.'}
          </p>
        </div>

        <ol className="mt-6 divide-y divide-line rounded-[8px] border border-line print:divide-y-0 print:rounded-none print:border-0">
          {klasesTemos.map(({ tema, sarasas }) => {
            const skirstoma = sarasas.length > 0
            const atidaryta = skirstoma && isskleista === tema.numeris
            // 5–7 klasių programoje potemių nėra — ten stambusis punktas ir yra
            // smulkiausias dalykas, tad paspaudus iškart generuojami uždaviniai.
            const rinkinysCia = cia(tema.numeris, null)

            return (
              <li key={tema.numeris}>
                <button
                  type="button"
                  onClick={() =>
                    skirstoma
                      ? setIsskleista(atidaryta ? null : tema.numeris)
                      : pasirinkTema(tema)
                  }
                  aria-expanded={skirstoma ? atidaryta : undefined}
                  aria-current={rinkinysCia ? 'true' : undefined}
                  className={`be-spausdinimo flex w-full items-baseline gap-4 px-5 py-4 text-left transition-colors ${
                    rinkinysCia ? 'bg-orange-soft' : 'hover:bg-paper-2'
                  }`}
                >
                  {/* Stambieji punktai paryškinti — tai programos skyriai. */}
                  <span className="shrink-0 font-mono text-[0.9375rem] font-semibold tabular-nums">
                    {tema.numeris}.
                  </span>
                  <span className="grow t-body font-semibold">{tema.pavadinimas}</span>
                  <span
                    className="shrink-0 font-mono text-[0.9375rem] text-muted"
                    aria-hidden="true"
                  >
                    {skirstoma ? (atidaryta ? '–' : '+') : '→'}
                  </span>
                </button>

                {/* Tema be potemių — rinkinys tiesiai po ja. */}
                {!skirstoma && rinkinysCia && (
                  <div className="border-t border-line bg-paper-2 px-5 py-4 print:border-0 print:bg-transparent print:p-0">
                    {rinkinys()}
                  </div>
                )}

                {atidaryta && (
                  <div className="border-t border-line bg-paper-2 px-5 py-3 print:border-0 print:bg-transparent print:p-0">
                    <ol className="flex flex-col">
                      {sarasas.map((p) => {
                        const aktyvi = cia(tema.numeris, p.numeris)
                        return (
                          <li key={p.numeris}>
                            <button
                              type="button"
                              onClick={() => pasirinkPotema(tema, p)}
                              disabled={!p.generatorius}
                              aria-current={aktyvi ? 'true' : undefined}
                              // Užvedus pelę ant jau pasirinktos potemės oranžinis
                              // pažymėjimas turi likti — kitaip dingsta nuoroda,
                              // iš kur uždaviniai atsirado.
                              className={`be-spausdinimo flex w-full items-baseline gap-3 rounded-[6px] px-3 py-2.5 text-left transition-colors ${
                                aktyvi
                                  ? 'bg-orange-soft'
                                  : p.generatorius
                                    ? 'hover:bg-paper'
                                    : 'cursor-default'
                              }`}
                            >
                              <span className="shrink-0 font-mono t-small tabular-nums text-muted">
                                {p.numeris}.
                              </span>
                              <span
                                className={`grow t-body ${
                                  p.generatorius ? 'text-ink' : 'text-muted'
                                }`}
                              >
                                {p.pavadinimas}
                              </span>
                              {!p.generatorius && (
                                <span className="shrink-0 t-small text-muted">netrukus</span>
                              )}
                            </button>

                            {/* Rinkinys išsiskleidžia po ta poteme, kurią paspaudė. */}
                            {aktyvi && rinkinys()}
                          </li>
                        )
                      })}
                    </ol>

                    <div className="be-spausdinimo mt-2 border-t border-line px-3 pt-3">
                      <button
                        type="button"
                        onClick={() => pasirinkTema(tema)}
                        className="t-small font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
                      >
                        Uždaviniai iš visos temos
                      </button>
                    </div>

                    {/* Visos temos rinkinys — po nuoroda, kuri jį iškvietė. */}
                    {rinkinysCia && rinkinys()}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </>
  )
}

export default UzduociuGeneratorius
