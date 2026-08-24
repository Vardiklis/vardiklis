'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Brezinys from '@/components/Brezinys'
import Klaviatura from '@/components/Klaviatura'
import Mygtukas from '@/components/Mygtukas'
import Trupmena from '@/components/Trupmena'
import UzdavinioFormatas, { atsakymoUzuomina } from '@/components/UzdavinioFormatas'
import {
  atsakyk,
  dabartinisUzdavinys,
  pradek,
  progresas,
  progresoSkaiciai,
  type Busena,
} from '@/lib/diagnostika'
import { arTeisingas } from '@/lib/matematika'
import { irasykSeansa, isvalykSeansa } from '@/lib/seansas'

// KaTeX užkraunamas tik pradėjus testą — įvado ekranui jo nereikia.
// `loading` rezervuoja eilutės aukštį, kad uždaviniui atsiradus nešoktų maketas.
const Formule = dynamic(() => import('@/components/Formule'), {
  ssr: false,
  loading: () => <span className="block h-8 md:h-9" aria-hidden="true" />,
})

const KLASES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

type GriztamasisRysys = {
  teisinga: boolean
  teisingasAtsakymas: string
  sprendimas?: string
}

export function Testas() {
  const router = useRouter()
  const [klase, setKlase] = useState(7)
  const [busena, setBusena] = useState<Busena | null>(null)
  const [ivestis, setIvestis] = useState('')
  const [rysys, setRysys] = useState<GriztamasisRysys | null>(null)
  const [klaviatura, setKlaviatura] = useState(false)
  const laukas = useRef<HTMLInputElement>(null)

  const uzdavinys = busena ? dabartinisUzdavinys(busena) : null

  // Naujam uždaviniui fokusas grąžinamas į laukelį — kad nereikėtų spausti pele.
  useEffect(() => {
    if (uzdavinys && !rysys) laukas.current?.focus()
  }, [uzdavinys, rysys])

  function pradekTesta() {
    isvalykSeansa()
    setBusena(pradek(klase))
    setIvestis('')
    setRysys(null)
  }

  /**
   * Vienas formos veiksmas dviem žingsniams: pirmas patikrina atsakymą, antras
   * pereina prie kito uždavinio.
   *
   * Todėl `Enter` veikia visą testą be pelės: įrašai atsakymą, spaudi `Enter` —
   * pamatai, ar teisingai; spaudi dar kartą — gauni kitą uždavinį.
   */
  function tikrink(e: React.FormEvent) {
    e.preventDefault()
    if (!uzdavinys) return
    if (rysys) {
      toliau()
      return
    }
    if (ivestis.trim() === '') return
    setRysys({
      teisinga: arTeisingas(ivestis, uzdavinys.atsakymas),
      teisingasAtsakymas: uzdavinys.atsakymasRodymui,
      sprendimas: uzdavinys.sprendimas,
    })
  }

  function toliau() {
    if (!busena || !rysys) return
    const kita = atsakyk(busena, rysys.teisinga)
    setIvestis('')
    setRysys(null)

    if (kita.baigta) {
      irasykSeansa(kita)
      router.push('/testas/rezultatas')
      return
    }

    setBusena(kita)
  }

  // ── Ekranas 1: įvadas ────────────────────────────────────────────────────
  if (!busena) {
    return (
      <div className="tekstas">
        <div className="mt-8 flex flex-col gap-4 t-body text-muted">
          <p>Testas parodys, kurioje klasėje vaikui nutrūko matematika.</p>
          <p>
            Uždavinius sprendžia vaikas, bet testą pradeda ir ataskaitą gauna tėvai.
          </p>
          <p>Trunka apie 15 minučių. Nieko neįrašome ir nesaugome.</p>
        </div>

        <div className="mt-10 rounded-[8px] border border-line bg-paper-2 p-6">
          <label htmlFor="klase" className="block t-small font-semibold">
            Kurioje klasėje vaikas mokosi?
          </label>
          <select
            id="klase"
            value={klase}
            onChange={(e) => setKlase(Number(e.target.value))}
            className="mt-3 w-full rounded-[6px] border border-line bg-paper px-3 py-2.5 t-body text-ink sm:w-56"
          >
            {KLASES.map((k) => (
              <option key={k} value={k}>
                {k} klasė
              </option>
            ))}
          </select>

          <div className="mt-6">
            <Mygtukas onClick={pradekTesta} dydis="didelis">
              Pradėti
            </Mygtukas>
          </div>
        </div>
      </div>
    )
  }

  // ── Ekranas 2: uždaviniai ────────────────────────────────────────────────
  if (!uzdavinys) return null

  const dalis = Math.round(progresas(busena) * 100)
  const { atlikta, numatoma } = progresoSkaiciai(busena)
  const dabartinis = atlikta + 1

  /** Atsakymas raidėmis — pasirinkimas, poros ir rikiavimas. */
  const raidinis = uzdavinys.formatas !== undefined && uzdavinys.formatas !== 'ivedimas'
  const pasirinkimas = uzdavinys.formatas === 'pasirinkimas' && Boolean(uzdavinys.variantai)
  const uzuomina = atsakymoUzuomina(uzdavinys)

  return (
    <div className="mt-8 max-w-2xl">
      <div className="flex items-baseline justify-between gap-4">
        <p className="t-small text-muted">Testo eiga</p>
        {/* Vardiklis gali paaugti: neišlaikius temos, testas prideda naujų. */}
        <p className="font-mono text-[0.9375rem] tabular-nums">
          <span className="font-semibold">{dabartinis}</span>
          <span className="text-muted"> / {Math.max(numatoma, dabartinis)}</span>
        </p>
      </div>

      <div
        className="mt-2 h-0.5 w-full bg-line"
        role="progressbar"
        aria-valuenow={dalis}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Testo eiga: ${dabartinis} uždavinys iš ${Math.max(numatoma, dabartinis)}`}
      >
        <div
          className="h-full bg-orange transition-[width] duration-300"
          style={{ width: `${dalis}%` }}
        />
      </div>

      <form onSubmit={tikrink} className="mt-8">
        {uzdavinys.brezinys && <Brezinys svg={uzdavinys.brezinys} className="mb-6" />}

        <Formule
          tekstas={uzdavinys.klausimas}
          className="block font-mono text-xl leading-relaxed md:text-2xl"
        />

        {/* Variantai, poros ir rikiuojami elementai. Be jų pasirenkamojo
            atsakymo uždavinys buvo neįmanomas: klausimas rodomas, o raidės,
            kurios prašoma atsakyme, niekur nėra. */}
        <div className="mt-6">
          <UzdavinioFormatas
            uzdavinys={uzdavinys}
            dydis="text-lg"
            raidesDydis="text-base"
            onPasirinkti={pasirinkimas ? setIvestis : undefined}
            pasirinkta={ivestis}
            isjungta={rysys !== null}
          />
        </div>

        {uzuomina && !pasirinkimas && <p className="mt-2 t-small text-muted">{uzuomina}</p>}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {/* Pasirinkus raidę mygtuku, teksto laukelio nebereikia — jis tik
              kviestų vaiką rašyti tai, ką jau paspaudė. */}
          {!pasirinkimas && (
            <>
              <label htmlFor="atsakymas" className="sr-only">
                Atsakymas
              </label>
              <input
                id="atsakymas"
                ref={laukas}
                type="text"
                // Kai atidaryta sava klaviatūra, telefono klaviatūros nekviečiam —
                // kitaip abi grumtųsi dėl ekrano. Raidiniam atsakymui skaitinė
                // klaviatūra irgi netinka.
                inputMode={klaviatura || raidinis ? 'none' : 'decimal'}
                autoComplete="off"
                value={ivestis}
                readOnly={rysys !== null}
                onChange={(e) => setIvestis(e.target.value)}
                placeholder="Atsakymas"
                className="w-full rounded-[6px] border border-line bg-paper px-4 py-3 font-mono text-lg text-ink read-only:bg-paper-2 sm:w-56"
              />
            </>
          )}

          {/* Abu mygtukai — `submit`, tad formą pasiunčia ir pelė, ir `Enter`.
              Skirtingi `key` reikalingi tam, kad React sukurtų naują mygtuką,
              o ne perpieštų senąjį: tik naujai atsiradęs elementas gauna
              `autoFocus`, o be jo `Enter` po atsakymo neturėtų kur nukristi —
              pasirenkamojo atsakymo uždavinyje fokusas lieka ant varianto. */}
          {rysys ? (
            <Mygtukas key="toliau" type="submit" dydis="didelis" autoFocus>
              Toliau
            </Mygtukas>
          ) : (
            <Mygtukas
              key="tikrinti"
              type="submit"
              dydis="didelis"
              disabled={ivestis.trim() === ''}
            >
              Tikrinti
            </Mygtukas>
          )}

          {!raidinis && (
            <button
              type="button"
              onClick={() => setKlaviatura((v) => !v)}
              aria-expanded={klaviatura}
              aria-controls="matematikos-klaviatura"
              className="inline-flex items-center gap-2 rounded-[6px] border border-line bg-paper px-4 py-3 t-small transition-colors hover:border-ink"
            >
              <span aria-hidden="true" className="font-mono text-base leading-none">
                ⌨
              </span>
              Klaviatūra
            </button>
          )}
        </div>

        {klaviatura && !raidinis && (
          <div id="matematikos-klaviatura">
            <Klaviatura
              reiksme={ivestis}
              onKeisti={setIvestis}
              onUzdaryti={() => setKlaviatura(false)}
              isjungta={rysys !== null}
            />
          </div>
        )}
      </form>

      <div aria-live="polite" className="mt-6">
        {rysys && (
          <div
            className={`rounded-[8px] border p-5 ${
              rysys.teisinga ? 'border-line bg-paper-2' : 'border-orange bg-orange-soft'
            }`}
          >
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="t-h3">{rysys.teisinga ? 'Teisingai' : 'Neteisingai'}</span>
              {!rysys.teisinga && (
                <span className="flex items-baseline gap-2 t-small text-muted">
                  Teisingas atsakymas:
                  <Formule
                    tekstas={rysys.teisingasAtsakymas}
                    className="font-mono font-semibold text-ink"
                  />
                </span>
              )}
            </p>
            {!rysys.teisinga && rysys.sprendimas && (
              <Formule tekstas={rysys.sprendimas} className="mt-3 block t-small text-muted" />
            )}
          </div>
        )}
      </div>

      {/* Priminimas, kodėl klaidos čia nėra blogai. */}
      <div className="mt-12 border-t border-line pt-6">
        <Trupmena
          dydis="normalus"
          bruksnys="line"
          skaitiklis={<span className="t-small text-muted">ką matote dabar</span>}
          vardiklis={<span className="t-small text-muted">ką parodys ataskaita</span>}
        />
        <p className="mt-3 max-w-md t-small text-muted">
          Klaidos čia yra naudingos — būtent jos parodo, kur ieškoti tikrosios priežasties.
        </p>
      </div>
    </div>
  )
}

export default Testas
