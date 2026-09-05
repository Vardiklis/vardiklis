'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import Mygtukas from '@/components/Mygtukas'
import { praneskUzklausosKonversija } from '@/lib/analitika'
import { kontaktai } from '@/lib/kontaktai'
import { siuskUzklausa } from '@/lib/uzklausa'
import { PRADINE_BUSENA } from '@/lib/uzklausos-busena'

type Props = {
  /** Iš kurio puslapio ar straipsnio ateita — kad Modesta matytų, kas žmogų atvedė. */
  saltinis?: string
}

/**
 * Registracija į pamoką.
 *
 * Laišką išsiunčia SERVERIS (žr. `lib/uzklausa.ts`) — lankytojui nereikia nieko
 * daryti savo pašto programoje, o užklausa nedingsta dėl to, kad telefone nėra
 * sukonfigūruoto pašto kliento. Anksčiau čia buvo `mailto:`, kuris dalyje
 * įrenginių tiesiog nieko neatidarydavo.
 *
 * Duomenys niekur neįrašomi: jie gyvuoja tik tiek, kiek trunka siuntimas, ir
 * lieka tik Modestos pašto dėžutėje.
 */
export function RegistracijosForma({ saltinis }: Props) {
  const [busena, veiksmas, vykdoma] = useActionState(siuskUzklausa, PRADINE_BUSENA)

  // Laukai valdomi būsena, kad po serverio klaidos įrašytas tekstas neišgaruotų.
  const [vardas, setVardas] = useState('')
  const [kontaktas, setKontaktas] = useState('')
  const [klase, setKlase] = useState('')
  const [zinute, setZinute] = useState('')
  const [sutinku, setSutinku] = useState(false)

  /**
   * Konversija pranešama tik pavykus, ir tik kartą.
   *
   * Ne mygtuko paspaudimas: jis dar nieko nereiškia — užklausa gali nepraeiti
   * patikrinimų arba gali nulūžti siuntimas. Būsena `pavyko` reiškia, kad
   * laiškas jau Modestos dėžutėje.
   *
   * `useRef` sargas — griežtame režime efektas paleidžiamas du kartus, o
   * dviguba konversija iškraipytų reklamos statistiką.
   */
  const konversijaPranesta = useRef(false)

  useEffect(() => {
    if (busena.bukle !== 'pavyko' || konversijaPranesta.current) return
    konversijaPranesta.current = true
    praneskUzklausosKonversija()
  }, [busena.bukle])

  const laukas = 'w-full rounded-[6px] border border-line bg-paper px-3 py-2.5 t-body text-ink'
  const klaidosTekstas = 'mt-2 t-small font-semibold text-klaidinga'

  if (busena.bukle === 'pavyko') {
    return (
      <div
        className="mt-6 rounded-[8px] border border-orange bg-orange-soft px-6 py-5"
        role="status"
      >
        <p className="t-body font-semibold">{busena.pranesimas}</p>
        <p className="mt-2 t-small text-muted">
          Jei atsakymo nesulauktumėte — paskambinkite{' '}
          <a
            href={`tel:${kontaktai.telefonasNuoroda}`}
            className="font-semibold underline decoration-orange decoration-2 underline-offset-4"
          >
            {kontaktai.telefonas}
          </a>
          .
        </p>
      </div>
    )
  }

  // `data-clarity-mask` — Clarity seansų peržiūroje visa forma lieka uždengta,
  // tad į įrašą nepatenka nei vardas, nei kontaktas, nei žinutės tekstas.
  return (
    <form
      action={veiksmas}
      className="mt-6 flex flex-col gap-4"
      data-clarity-mask="true"
    >
      {saltinis && <input type="hidden" name="saltinis" value={saltinis} />}

      {/* Botų spąstai: žmogus šio laukelio nemato ir nepasiekia tabuliatoriumi,
          tad užpildytas jis būna tik skripto. Ne `display:none` — dalis botų
          paslėptus laukus praleidžia. */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="reg-miestas">Miestas</label>
        <input id="reg-miestas" name="miestas" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-vardas" className="block t-small font-semibold">
            Jūsų vardas
          </label>
          <input
            id="reg-vardas"
            name="vardas"
            type="text"
            required
            autoComplete="name"
            value={vardas}
            onChange={(e) => setVardas(e.target.value)}
            aria-invalid={busena.laukai?.vardas ? true : undefined}
            aria-describedby={busena.laukai?.vardas ? 'reg-vardas-klaida' : undefined}
            className={`${laukas} mt-2`}
          />
          {busena.laukai?.vardas && (
            <p id="reg-vardas-klaida" className={klaidosTekstas}>
              {busena.laukai.vardas}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="reg-kontaktas" className="block t-small font-semibold">
            El. paštas arba telefonas
          </label>
          <input
            id="reg-kontaktas"
            name="kontaktas"
            type="text"
            required
            autoComplete="email"
            value={kontaktas}
            onChange={(e) => setKontaktas(e.target.value)}
            placeholder="vardas@pastas.lt arba +370 6XX XXXXX"
            aria-invalid={busena.laukai?.kontaktas ? true : undefined}
            aria-describedby={busena.laukai?.kontaktas ? 'reg-kontaktas-klaida' : undefined}
            className={`${laukas} mt-2`}
          />
          {busena.laukai?.kontaktas && (
            <p id="reg-kontaktas-klaida" className={klaidosTekstas}>
              {busena.laukai.kontaktas}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="reg-klase" className="block t-small font-semibold">
          Vaiko klasė
        </label>
        <select
          id="reg-klase"
          name="klase"
          value={klase}
          onChange={(e) => setKlase(e.target.value)}
          className={`${laukas} mt-2 sm:w-56`}
        >
          <option value="">Nepasirinkta</option>
          {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((k) => (
            <option key={k} value={k}>
              {k} klasė
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="reg-zinute" className="block t-small font-semibold">
          Kas nesiseka (nebūtina)
        </label>
        <textarea
          id="reg-zinute"
          name="zinute"
          rows={3}
          maxLength={2000}
          value={zinute}
          onChange={(e) => setZinute(e.target.value)}
          placeholder="Pvz. „strigo lygtys, artėja kontrolinis“"
          className={`${laukas} mt-2`}
        />
      </div>

      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="sutinku"
            required
            checked={sutinku}
            onChange={(e) => setSutinku(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-[var(--orange)]"
          />
          <span className="t-small">
            Man yra 16 metų arba daugiau, arba mano tėvai sutinka, kad būtų susisiekta.
          </span>
        </label>
        {busena.laukai?.sutikimas && <p className={klaidosTekstas}>{busena.laukai.sutikimas}</p>}
      </div>

      <div>
        <Mygtukas type="submit" disabled={vykdoma} dydis="didelis">
          {vykdoma ? 'Siunčiama…' : 'Siųsti užklausą'}
        </Mygtukas>

        {/* `aria-live` — ekrano skaitytuvas praneša atsakymą nepajudinus fokuso. */}
        <p
          aria-live="polite"
          className={`mt-3 t-small ${
            busena.bukle === 'klaida' ? 'font-semibold text-klaidinga' : 'text-muted'
          }`}
        >
          {busena.bukle === 'klaida'
            ? busena.pranesimas
            : 'Užklausa ateis tiesiai Modestai į paštą. Svetainė duomenų neįrašo.'}
        </p>
      </div>
    </form>
  )
}

export default RegistracijosForma
