'use client'

import { useState } from 'react'
import Mygtukas from '@/components/Mygtukas'
import { kontaktai } from '@/lib/kontaktai'

type Props = {
  /** Iš kurio straipsnio ateita — kad Modesta matytų, kas žmogų atvedė. */
  saltinis?: string
}

/**
 * Registracija į pamoką.
 *
 * Laiškas atidaromas lankytojo pašto programoje (`mailto:`) — lygiai kaip
 * diagnostikos ataskaitoje. Svetainė nieko nesiunčia ir nieko neįrašo, tad
 * lieka teisinga tai, kas parašyta privatumo puslapyje, ir nereikia tvarkyti
 * vaikų duomenų.
 */
export function RegistracijosForma({ saltinis }: Props) {
  const [vardas, setVardas] = useState('')
  const [kontaktas, setKontaktas] = useState('')
  const [klase, setKlase] = useState('')
  const [zinute, setZinute] = useState('')
  const [sutinku, setSutinku] = useState(false)

  const galimaSiusti = vardas.trim() !== '' && kontaktas.trim() !== '' && sutinku

  function siusk() {
    if (!galimaSiusti) return

    const eilutes = [
      `Vardas: ${vardas.trim()}`,
      `Susisiekti: ${kontaktas.trim()}`,
      klase ? `Klasė: ${klase}` : null,
      '',
      zinute.trim() || '(žinutės nėra)',
      '',
      '—',
      'Patvirtinta, kad siuntėjui yra 16 metų arba sutinka tėvai.',
      saltinis ? `Užklausa iš straipsnio: ${saltinis}` : null,
      'vardiklis.lt',
    ].filter((e): e is string => e !== null)

    const tema = klase ? `Registracija į pamoką — ${klase} klasė` : 'Registracija į pamoką'
    window.location.href = `mailto:${kontaktai.elPastas}?subject=${encodeURIComponent(
      tema,
    )}&body=${encodeURIComponent(eilutes.join('\n'))}`
  }

  const laukas = 'w-full rounded-[6px] border border-line bg-paper px-3 py-2.5 t-body text-ink'

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-vardas" className="block t-small font-semibold">
            Jūsų vardas
          </label>
          <input
            id="reg-vardas"
            type="text"
            autoComplete="name"
            value={vardas}
            onChange={(e) => setVardas(e.target.value)}
            className={`${laukas} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="reg-kontaktas" className="block t-small font-semibold">
            El. paštas arba telefonas
          </label>
          <input
            id="reg-kontaktas"
            type="text"
            autoComplete="email"
            value={kontaktas}
            onChange={(e) => setKontaktas(e.target.value)}
            placeholder="vardas@pastas.lt arba +370 6XX XXXXX"
            className={`${laukas} mt-2`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="reg-klase" className="block t-small font-semibold">
          Vaiko klasė
        </label>
        <select
          id="reg-klase"
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
          rows={3}
          value={zinute}
          onChange={(e) => setZinute(e.target.value)}
          placeholder="Pvz. „strigo lygtys, artėja kontrolinis“"
          className={`${laukas} mt-2`}
        />
      </div>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={sutinku}
          onChange={(e) => setSutinku(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-[var(--orange)]"
        />
        <span className="t-small">
          Man yra 16 metų arba daugiau, arba mano tėvai sutinka, kad būtų susisiekta.
        </span>
      </label>

      <div>
        <Mygtukas onClick={siusk} disabled={!galimaSiusti} dydis="didelis">
          Siųsti užklausą
        </Mygtukas>
        <p className="mt-3 t-small text-muted">
          {galimaSiusti
            ? 'Atsidarys jūsų pašto programa su paruoštu laišku — svetainė duomenų neįrašo.'
            : 'Užpildykite vardą, kontaktą ir pažymėkite patvirtinimą.'}
        </p>
      </div>
    </div>
  )
}

export default RegistracijosForma
