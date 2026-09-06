'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Mygtukas from '@/components/Mygtukas'
import type { Kalendorius } from '@/lib/tvarkarastis'
import { rezervuok } from '@/lib/rezervacija'
import { PRADINE_REZERVACIJA } from '@/lib/rezervacijos-busena'

type Props = {
  kalendorius: Kalendorius
  /** Iš kurio puslapio ateita — kad Modesta matytų, kas žmogų atvedė. */
  saltinis?: string
}

type Pasirinktas = { data: string; laikas: string; pilnas: string }

const laukas = 'w-full rounded-[6px] border border-line bg-paper px-3 py-2.5 t-body text-ink'
const klaidosTekstas = 'mt-2 t-small font-semibold text-klaidinga'

/** Kiek savaičių rodoma vienu metu. */
const RODOMA = 2

/**
 * Kalendorius su tikromis datomis ir registracija į laisvą langą.
 *
 * SAVAITĖS VERČIAMOS KLIENTE. Visos savaitės atsiunčiamos iš karto vienu
 * masyvu raidžių (`l`/`u`/`p`), tad vartymas nereikalauja nei užklausos, nei
 * laukimo, o į HTML vis tiek nepatenka niekas, ko lankytojui nevalia matyti.
 *
 * MODALAS — tikras `<dialog>`: fokusą uždaro naršyklė pati, `Esc` veikia be
 * jokio kodo, o už lango esantis turinys tampa nepasiekiamas skaitytuvui.
 *
 * Po sėkmingo užsakymo kviečiamas `router.refresh()` — serveris perskaičiuoja
 * lentelę ir ką tik užimtas langelis iškart tampa oranžinis. Be to lankytojas
 * matytų savo laiką vis dar laisvą ir bandytų užsakyti antrą kartą.
 */
export default function KalendoriausTinklelis({ kalendorius, saltinis }: Props) {
  const router = useRouter()

  const paskutine = Math.max(0, kalendorius.savaites.length - RODOMA)

  /**
   * Pradedama nuo pirmos savaitės, kurioje dar yra laisvo laiko.
   *
   * Šios savaitės pabaigoje visi einamosios savaitės langeliai jau būna
   * praėję, ir atsidaręs puslapį žmogus matytų vien pilką lentelę — atrodytų,
   * kad laisvų laikų nėra visai, nors kitą savaitę jų pilna.
   */
  const [savaite, setSavaite] = useState(() => {
    const su = kalendorius.savaites.findIndex((s) => s.langeliai.some((e) => e.includes('l')))
    return Math.min(su === -1 ? 0 : su, Math.max(0, kalendorius.savaites.length - RODOMA))
  })
  const [pasirinktas, setPasirinktas] = useState<Pasirinktas | null>(null)
  const dialogas = useRef<HTMLDialogElement>(null)

  const [busena, veiksmas, vykdoma] = useActionState(rezervuok, PRADINE_REZERVACIJA)

  useEffect(() => {
    if (busena.bukle === 'pavyko') router.refresh()
  }, [busena.bukle, router])

  const rodomos = kalendorius.savaites.slice(savaite, savaite + RODOMA)

  /**
   * Abi savaitės suplakamos į vieną lentelę: stulpelių dvigubai, o eilučių
   * tiek pat. `riba` žymi antros savaitės pirmadienį — ties juo paliekamas
   * platesnis tarpas, kad savaitės neatrodytų kaip viena ilga juosta.
   */
  const stulpeliai = rodomos.flatMap((sav, si) =>
    sav.dienos.map((d, di) => ({ ...d, riba: si > 0 && di === 0 })),
  )

  /** `[eilutė][stulpelis]` abiem savaitėms iš karto — suskaičiuojama kartą. */
  const langeliai = kalendorius.laikai.map((_, ei) => rodomos.flatMap((s) => s.langeliai[ei]))

  /** Mėnesiai sąrašui: po vieną įrašą ir iškart žinomas savaitės numeris. */
  const menesiai: { raktas: string; vardas: string; indeksas: number }[] = []
  for (const [i, sav] of kalendorius.savaites.entries()) {
    if (!menesiai.some((m) => m.raktas === sav.menuoRaktas)) {
      menesiai.push({ raktas: sav.menuoRaktas, vardas: sav.menuoVardas, indeksas: i })
    }
  }

  function atidaryk(p: Pasirinktas) {
    setPasirinktas(p)
    dialogas.current?.showModal()
  }

  function uzdaryk() {
    dialogas.current?.close()
    setPasirinktas(null)
    // Sėkmės žinutė lieka būsenoje; kad kitą kartą modalas atsidarytų švarus,
    // puslapis vis tiek perkraunamas `router.refresh()`.
    if (busena.bukle === 'pavyko') router.refresh()
  }

  return (
    <>
      {/* ── Legenda ─────────────────────────────────────────────────────────── */}
      <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 t-small text-muted">
        <li className="flex items-center gap-2">
          <span
            className="inline-block size-3 rounded-[3px] border border-line bg-paper-2"
            aria-hidden="true"
          />
          Laisva
        </li>
        <li className="flex items-center gap-2">
          <span
            className="inline-block size-3 rounded-[3px] border border-orange bg-orange"
            aria-hidden="true"
          />
          Užimta
        </li>
      </ul>

      {/* ── Mėnuo ir savaičių vartymas ──────────────────────────────────────── */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Mygtukas
          variantas="konturas"
          onClick={() => setSavaite((s) => Math.max(0, s - RODOMA))}
          disabled={savaite === 0}
          aria-label="Ankstesnės savaitės"
        >
          ‹
        </Mygtukas>

        <label className="sr-only" htmlFor="kal-menuo">
          Mėnuo
        </label>
        <select
          id="kal-menuo"
          value={rodomos[0].menuoRaktas}
          onChange={(e) => {
            const rastas = menesiai.find((m) => m.raktas === e.target.value)
            if (rastas) setSavaite(Math.min(rastas.indeksas, paskutine))
          }}
          className="rounded-[6px] border border-line bg-paper px-3 py-2 t-body font-semibold text-ink"
        >
          {menesiai.map((m) => (
            <option key={m.raktas} value={m.raktas}>
              {m.vardas}
            </option>
          ))}
        </select>

        <Mygtukas
          variantas="konturas"
          onClick={() => setSavaite((s) => Math.min(paskutine, s + RODOMA))}
          disabled={savaite >= paskutine}
          aria-label="Kitos savaitės"
        >
          ›
        </Mygtukas>

        <span className="t-small text-muted" aria-live="polite">
          {rodomos.map((s) => s.etikete).join(' · ')}
        </span>
      </div>

      {/* ── Lentelė ─────────────────────────────────────────────────────────── */}
      {/* Keturiolika stulpelių (dvi savaitės po septynias dienas) į `max-w-2xl`
          nebetelpa net kompiuteryje, tad lentelei leidžiama būti platesnei nei
          šalia esantis tekstas. Siaurame ekrane ji vis tiek slenkasi savyje. */}
      <div className="mt-4 max-w-4xl overflow-x-auto">
        {/* `w-auto`, o ne `w-full`: langeliai turi likti kvadratiniai, o ne
            išsitempti per visą plotį iki plokščių juostelių. */}
        <table className="w-auto border-separate border-spacing-1">
          <caption className="sr-only">
            {kalendorius.registracija
              ? 'Savaitės laikai. Paspaudus laisvą laiką atsidaro registracijos langas.'
              : 'Savaitės laikai.'}
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Laikas</span>
              </th>
              {stulpeliai.map((d) => (
                <th key={d.data} scope="col" className={`pb-1 ${d.riba ? 'pl-4' : ''}`}>
                  <span className="block t-small font-semibold">{d.trumpas}</span>
                  <span className="block text-xs text-muted">{d.diena}</span>
                  <span className="sr-only">{d.pilnas}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kalendorius.laikai.map((laikas, eilute) => (
              <tr key={laikas}>
                <th
                  scope="row"
                  className="pr-2 text-right font-mono text-xs font-normal whitespace-nowrap text-muted"
                >
                  {laikas}
                </th>
                {stulpeliai.map((d, stulpelis) => {
                  const b = langeliai[eilute][stulpelis]
                  const galimaSpausti = b === 'l' && kalendorius.registracija

                  return (
                    <td key={d.data} className={`p-0 ${d.riba ? 'pl-4' : ''}`}>
                      {galimaSpausti ? (
                        <button
                          type="button"
                          onClick={() =>
                            atidaryk({ data: d.data, laikas, pilnas: `${d.pilnas}, ${laikas}` })
                          }
                          className="size-10 rounded-[4px] border border-line bg-paper-2 transition-colors hover:border-ink hover:bg-orange-soft focus-visible:border-ink md:size-11"
                        >
                          <span className="sr-only">{`${d.pilnas}, ${laikas} — laisva, registruotis`}</span>
                        </button>
                      ) : (
                        <span
                          className={`block size-10 rounded-[4px] border md:size-11 ${
                            b === 'u'
                              ? 'border-orange bg-orange'
                              : b === 'n'
                                ? // Tą dieną tokių pamokų nebūna — langelis
                                  // paliekamas visai tuščias, be rėmelio.
                                  'border-transparent'
                                : b === 'p'
                                  ? 'border-line bg-paper opacity-40'
                                  : 'border-line bg-paper-2'
                          }`}
                        >
                          <span className="sr-only">
                            {b === 'u'
                              ? 'Užimta'
                              : b === 'n'
                                ? 'Tuo metu pamokų nebūna'
                                : b === 'p'
                                  ? 'Praėjęs laikas'
                                  : 'Laisva'}
                          </span>
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Registracijos langas ────────────────────────────────────────────── */}
      <dialog
        ref={dialogas}
        onClose={() => setPasirinktas(null)}
        aria-labelledby="rez-antraste"
        className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-[8px] border border-line bg-paper p-0 text-ink backdrop:bg-ink/40"
      >
        <div className="p-6 md:p-8" data-clarity-mask="true">
          {busena.bukle === 'pavyko' ? (
            <div role="status">
              <h3 id="rez-antraste" className="t-h3">
                Ačiū!
              </h3>
              <p className="mt-3 t-body text-muted">{busena.pranesimas}</p>
              <div className="mt-6">
                <Mygtukas onClick={uzdaryk}>Uždaryti</Mygtukas>
              </div>
            </div>
          ) : (
            <>
              <h3 id="rez-antraste" className="t-h3">
                Registracija į pamoką
              </h3>
              <p className="mt-2 t-small text-muted">
                Pasirinktas laikas: <strong className="text-ink">{pasirinktas?.pilnas}</strong>
              </p>

              <form action={veiksmas} className="mt-6 flex flex-col gap-4">
                <input type="hidden" name="data" value={pasirinktas?.data ?? ''} />
                <input type="hidden" name="laikas" value={pasirinktas?.laikas ?? ''} />
                {saltinis && <input type="hidden" name="saltinis" value={saltinis} />}

                {/* Botų spąstai — kaip ir registracijos formoje. */}
                <div
                  className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
                  aria-hidden="true"
                >
                  <label htmlFor="rez-miestas">Miestas</label>
                  <input
                    id="rez-miestas"
                    name="miestas"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="rez-tevas" className="block t-small font-semibold">
                      Tėvo / globėjo vardas
                    </label>
                    <input
                      id="rez-tevas"
                      name="tevoVardas"
                      type="text"
                      required
                      autoComplete="name"
                      className={`${laukas} mt-2`}
                      aria-invalid={busena.laukai?.tevoVardas ? true : undefined}
                    />
                    {busena.laukai?.tevoVardas && (
                      <p className={klaidosTekstas}>{busena.laukai.tevoVardas}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rez-vaikas" className="block t-small font-semibold">
                      Vaiko vardas
                    </label>
                    <input
                      id="rez-vaikas"
                      name="vaikoVardas"
                      type="text"
                      required
                      className={`${laukas} mt-2`}
                      aria-invalid={busena.laukai?.vaikoVardas ? true : undefined}
                    />
                    {busena.laukai?.vaikoVardas && (
                      <p className={klaidosTekstas}>{busena.laukai.vaikoVardas}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="rez-pastas" className="block t-small font-semibold">
                      El. paštas
                    </label>
                    <input
                      id="rez-pastas"
                      name="elPastas"
                      type="email"
                      required
                      autoComplete="email"
                      className={`${laukas} mt-2`}
                      aria-invalid={busena.laukai?.elPastas ? true : undefined}
                    />
                    {busena.laukai?.elPastas && (
                      <p className={klaidosTekstas}>{busena.laukai.elPastas}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rez-telefonas" className="block t-small font-semibold">
                      Telefonas <span className="font-normal text-muted">(nebūtina)</span>
                    </label>
                    <input
                      id="rez-telefonas"
                      name="telefonas"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+370 6XX XXXXX"
                      className={`${laukas} mt-2`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="rez-klase" className="block t-small font-semibold">
                    Vaiko klasė <span className="font-normal text-muted">(nebūtina)</span>
                  </label>
                  <select id="rez-klase" name="klase" className={`${laukas} mt-2 sm:w-56`}>
                    <option value="">Nepasirinkta</option>
                    {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((k) => (
                      <option key={k} value={k}>
                        {k} klasė
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="sutinku"
                      required
                      className="mt-1 h-5 w-5 shrink-0 accent-[var(--orange)]"
                    />
                    <span className="t-small">
                      Esu vaiko tėvas ar globėjas ir sutinku, kad būtų susisiekta nurodytais
                      kontaktais.
                    </span>
                  </label>
                  {busena.laukai?.sutikimas && (
                    <p className={klaidosTekstas}>{busena.laukai.sutikimas}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Mygtukas type="submit" disabled={vykdoma}>
                    {vykdoma ? 'Siunčiama…' : 'Rezervuoti laiką'}
                  </Mygtukas>
                  <Mygtukas variantas="tekstinis" onClick={uzdaryk}>
                    Atšaukti
                  </Mygtukas>
                </div>

                <p
                  aria-live="polite"
                  className={`t-small ${
                    busena.bukle === 'klaida' ? 'font-semibold text-klaidinga' : 'text-muted'
                  }`}
                >
                  {busena.bukle === 'klaida'
                    ? busena.pranesimas
                    : 'Laikas rezervuojamas iš karto, o Modesta susisieks ir patvirtins.'}
                </p>
              </form>
            </>
          )}
        </div>
      </dialog>
    </>
  )
}
