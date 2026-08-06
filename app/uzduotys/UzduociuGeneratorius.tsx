'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import Mygtukas from '@/components/Mygtukas'
import { generuokRinkini, type Lygis, type Uzdavinys } from '@/lib/generatoriai'
import { uzdaviniuKiekis } from '@/lib/lietuviu'
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

/** Vienas sugeneruotas rinkinys. Kiekviena tema ar potemė turi savąjį. */
type Rinkinys = {
  antraste: string
  temosPavadinimas: string
  generatorius: string
  lygis: Lygis
  kiekis: number
  uzdaviniai: Uzdavinys[]
  rodytiAtsakymus: boolean
}

export function UzduociuGeneratorius() {
  const [klase, setKlase] = useState(6)
  const [isskleista, setIsskleista] = useState<number | null>(null)

  /**
   * Rinkiniai laikomi pagal raktą, o ne po vieną. Todėl atidarius kitą temą
   * ankstesnės uždaviniai ir į juos įrašyti atsakymai nedingsta — jie lieka
   * tol, kol paspaudžiama atnaujinimo rodyklė.
   */
  const [rinkiniai, setRinkiniai] = useState<Record<string, Rinkinys>>({})
  /** Atsakymai pagal uždavinio id. Uždavinio id nesikeičia, kol negeneruojama iš naujo. */
  const [atsakymai, setAtsakymai] = useState<Record<string, string>>({})
  /** Kuris rinkinys šiuo metu matomas. Vienu metu atidarytas tik vienas. */
  const [atidarytas, setAtidarytas] = useState<string | null>(null)

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

  function raktas(temosNumeris: number, potemesNumeris: string | null): string {
    return `${klase}-${temosNumeris}-${potemesNumeris ?? 'visa'}`
  }

  function sukurk(
    key: string,
    pagrindas: Omit<Rinkinys, 'uzdaviniai' | 'rodytiAtsakymus'>,
    isvalytiAtsakymus: boolean,
  ) {
    // Klasė lemia skaičių mastą — be jos dešimtokas gautų penktoko skaičius.
    const uzdaviniai = generuokRinkini(
      pagrindas.generatorius,
      pagrindas.lygis,
      pagrindas.kiekis,
      klase,
    )

    if (isvalytiAtsakymus) {
      const senas = rinkiniai[key]
      if (senas) {
        setAtsakymai((esami) => {
          const nauji = { ...esami }
          for (const u of senas.uzdaviniai) delete nauji[u.id]
          return nauji
        })
      }
    }

    setRinkiniai((esami) => ({
      ...esami,
      [key]: { ...pagrindas, uzdaviniai, rodytiAtsakymus: false },
    }))
  }

  /**
   * Paspaudus temą ar potemę uždaviniai atsidaro, o temų sąrašas susiskleidžia.
   * Paspaudus tą pačią dar kartą — uždaviniai užsidaro. Vienu metu matomas tik
   * vienas rinkinys, bet uždaryti rinkiniai lieka atmintyje kartu su atsakymais.
   */
  function perjunk(
    key: string,
    pagrindas: Omit<Rinkinys, 'uzdaviniai' | 'rodytiAtsakymus'>,
  ) {
    if (atidarytas === key) {
      setAtidarytas(null)
      return
    }
    if (!rinkiniai[key]) sukurk(key, pagrindas, false)
    setAtidarytas(key)
    setIsskleista(null)
  }

  function pasirinkTema(tema: ProgramosTema) {
    if (!tema.generatorius) return
    perjunk(raktas(tema.numeris, null), {
      antraste: `${tema.numeris}. ${tema.pavadinimas}`,
      temosPavadinimas: tema.pavadinimas,
      generatorius: tema.generatorius,
      lygis: tema.lygis ?? 2,
      kiekis: 10,
    })
  }

  function pasirinkPotema(tema: ProgramosTema, p: IsskleistaPotema) {
    if (!p.generatorius) return
    perjunk(raktas(tema.numeris, p.numeris), {
      antraste: `${p.numeris}. ${p.pavadinimas}`,
      temosPavadinimas: tema.pavadinimas,
      generatorius: p.generatorius,
      lygis: p.lygis,
      kiekis: 10,
    })
  }

  function keiskKlase(nauja: number) {
    setKlase(nauja)
    setIsskleista(null)
  }

  /** Ar atidarytas rinkinys priklauso šiai temai. */
  function temosRinkinys(temosNumeris: number, sarasas: IsskleistaPotema[]) {
    if (!atidarytas) return null
    const raktai = [raktas(temosNumeris, null), ...sarasas.map((p) => raktas(temosNumeris, p.numeris))]
    if (!raktai.includes(atidarytas)) return null
    const r = rinkiniai[atidarytas]
    return r ? ([atidarytas, r] as const) : null
  }

  /**
   * Sugeneruotas rinkinys. Rodomas po ta tema, iš kurios buvo iškviestas,
   * ir lieka net susiskleidus sąrašui.
   */
  function rinkinioBlokas(key: string, r: Rinkinys) {
    const keisk = (naujas: Partial<Pick<Rinkinys, 'lygis' | 'kiekis'>>) =>
      sukurk(key, { ...r, ...naujas }, true)

    return (
      <div
        key={key}
        className="mt-3 rounded-[8px] border border-line bg-paper p-4 md:p-5 print:mt-0 print:border-0 print:p-0"
      >
        {/* Antraštė lapui — matoma tik spausdinant. */}
        <div className="hidden print:block">
          <h3 className="t-h2">
            {klase} kl. · {r.antraste}
          </h3>
          <p className="mt-6 t-small">
            Vardas, pavardė: ______________________ Data: ____________
          </p>
        </div>

        <div className="be-spausdinimo">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="t-h3">{r.antraste}</h3>
              <p className="mt-1 t-small text-muted">
                {klase} klasė · {uzdaviniuKiekis(r.uzdaviniai.length)}
              </p>
            </div>

            {/* Atnaujinimo rodyklė — sugeneruoja tos pačios temos uždavinius iš naujo. */}
            <button
              type="button"
              onClick={() => sukurk(key, r, true)}
              aria-label={`Generuoti naujus uždavinius: ${r.antraste}`}
              title="Nauji uždaviniai"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-line bg-paper text-lg leading-none transition-colors hover:border-ink"
            >
              <span aria-hidden="true">↻</span>
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-5">
            <div>
              <span className="block t-small font-semibold">Sunkumas</span>
              <div className="mt-2 flex gap-2">
                {LYGIAI.map((l) => (
                  <button
                    key={l.reiksme}
                    type="button"
                    onClick={() => keisk({ lygis: l.reiksme })}
                    aria-pressed={l.reiksme === r.lygis}
                    className={`rounded-[6px] border px-4 py-2 t-small transition-colors ${
                      l.reiksme === r.lygis
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
                    onClick={() => keisk({ kiekis: k })}
                    aria-pressed={k === r.kiekis}
                    className={`rounded-[6px] border px-4 py-2 font-mono t-small transition-colors ${
                      k === r.kiekis
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
            <Mygtukas
              variantas="konturas"
              onClick={() =>
                setRinkiniai((esami) => ({
                  ...esami,
                  [key]: { ...r, rodytiAtsakymus: !r.rodytiAtsakymus },
                }))
              }
            >
              {r.rodytiAtsakymus ? 'Slėpti atsakymus' : 'Rodyti atsakymus'}
            </Mygtukas>
            <Mygtukas variantas="konturas" onClick={() => window.print()}>
              Spausdinti
            </Mygtukas>
          </div>
        </div>

        <ol className="mt-6 flex flex-col gap-4 print:gap-3">
          {r.uzdaviniai.map((u, i) => (
            <UzdavinioKortele
              key={u.id}
              uzdavinys={u}
              numeris={i + 1}
              rodytiAtsakyma={r.rodytiAtsakymus}
              ivestis={atsakymai[u.id] ?? ''}
              onIvestis={(nauja) => setAtsakymai((esami) => ({ ...esami, [u.id]: nauja }))}
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
              ? 'Spustelėkite temą — ji išsiskleis į potemes. Pasirinkus potemę, sąrašas susiskleidžia, o uždaviniai lieka žemiau. Rodyklė ↻ sugeneruoja naujus.'
              : 'Šios klasės programoje temos į potemes neskirstomos. Spustelėjus temą uždaviniai atsiranda čia pat, o rodyklė ↻ sugeneruoja naujus.'}
          </p>
        </div>

        <ol className="mt-6 divide-y divide-line rounded-[8px] border border-line print:divide-y-0 print:rounded-none print:border-0">
          {klasesTemos.map(({ tema, sarasas }) => {
            const skirstoma = sarasas.length > 0
            const atidaryta = skirstoma && isskleista === tema.numeris
            const atidarytasRinkinys = temosRinkinys(tema.numeris, sarasas)

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
                  className={`be-spausdinimo flex w-full items-baseline gap-4 px-5 py-4 text-left transition-colors ${
                    atidarytasRinkinys ? 'bg-orange-soft' : 'hover:bg-paper-2'
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
                    {skirstoma ? (atidaryta ? '–' : '+') : atidarytasRinkinys ? '–' : '+'}
                  </span>
                </button>

                {atidaryta && (
                  <div className="be-spausdinimo border-t border-line bg-paper-2 px-5 py-3">
                    <ol className="flex flex-col">
                      {sarasas.map((p) => {
                        const turi = atidarytas === raktas(tema.numeris, p.numeris)
                        return (
                          <li key={p.numeris}>
                            <button
                              type="button"
                              onClick={() => pasirinkPotema(tema, p)}
                              disabled={!p.generatorius}
                              className={`flex w-full items-baseline gap-3 rounded-[6px] px-3 py-2.5 text-left transition-colors ${
                                turi
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
                          </li>
                        )
                      })}
                    </ol>

                    <div className="mt-2 border-t border-line px-3 pt-3">
                      <button
                        type="button"
                        onClick={() => pasirinkTema(tema)}
                        className="t-small font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
                      >
                        Uždaviniai iš visos temos
                      </button>
                    </div>
                  </div>
                )}

                {/* Atidarytas rinkinys lieka matomas ir susiskleidus temų sąrašui. */}
                {atidarytasRinkinys && (
                  <div className="border-t border-line bg-paper-2 px-5 py-4 print:border-0 print:bg-transparent print:p-0">
                    {rinkinioBlokas(atidarytasRinkinys[0], atidarytasRinkinys[1])}
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
