'use client'

import { useState } from 'react'
import Mygtukas from '@/components/Mygtukas'
import type { Ataskaita } from '@/lib/diagnostika'
import { kontaktai } from '@/lib/kontaktai'

type Props = {
  ataskaita: Ataskaita
}

/** Ataskaitos santrauka paprastu tekstu — ji keliauja į laiško turinį. */
function laiskoTekstas(a: Ataskaita, vardas: string, kontaktas: string): string {
  const eilutes: string[] = []
  eilutes.push(`Vaiko klasė: ${a.klase}`)
  eilutes.push('')

  if (a.saknines.length > 0) {
    const pagrindine = [...a.saknines].sort((x, y) => x.klase - y.klase)[0]
    eilutes.push(`Rasta spraga: ${pagrindine.pavadinimas} (${pagrindine.klase} klasė)`)
    if (a.saknines.length > 1) {
      eilutes.push(
        `Kitos savarankiškos spragos: ${a.saknines
          .filter((t) => t.id !== pagrindine.id)
          .map((t) => `${t.pavadinimas} (${t.klase} kl.)`)
          .join('; ')}`,
      )
    }
    eilutes.push('')
    eilutes.push(`Neišlaikytos temos: ${a.neislaikytos.map((t) => t.pavadinimas).join('; ')}`)
    eilutes.push(`Tvirtos temos: ${a.islaikytos.map((t) => t.pavadinimas).join('; ') || '—'}`)
    eilutes.push('')
    eilutes.push(`Ką spraga blokuoja: ${a.blokuojamos.map((t) => t.pavadinimas).join('; ') || '—'}`)
    eilutes.push(`Numatomas laikas: apie ${a.savaites} savaites, kartą per savaitę.`)
  } else {
    eilutes.push('Spragų ankstesnėse klasėse nerasta — pagrindai tvirti.')
    eilutes.push(`Patikrinta temų: ${a.islaikytos.length}.`)
  }

  eilutes.push('')
  eilutes.push(`Duota uždavinių: ${a.isVisoUzdaviniu}.`)
  eilutes.push('')
  eilutes.push('—')
  eilutes.push(`Siunčia: ${vardas}`)
  eilutes.push(`Susisiekti: ${kontaktas}`)
  eilutes.push('Patvirtinta, kad siuntėjui yra 16 metų arba sutinka tėvai.')
  eilutes.push('')
  eilutes.push('Ataskaitą sugeneravo vardiklis.lt')

  return eilutes.join('\n')
}

/**
 * Ką daryti su ataskaita: atsispausdinti, išsaugoti PDF arba nusiųsti Modestai.
 *
 * Laiškas atidaromas vartotojo pašto programoje (`mailto:`) — svetainė nieko
 * nesiunčia ir nieko neįrašo. Taip lieka teisinga tai, kas parašyta privatumo
 * puslapyje, ir nereikia nei serverio, nei vaiko duomenų tvarkymo.
 */
export function AtaskaitosVeiksmai({ ataskaita }: Props) {
  const [forma, setForma] = useState(false)
  const [vardas, setVardas] = useState('')
  const [kontaktas, setKontaktas] = useState('')
  const [sutinku, setSutinku] = useState(false)

  const galimaSiusti = vardas.trim() !== '' && kontaktas.trim() !== '' && sutinku

  function siusk() {
    if (!galimaSiusti) return
    const tema = ataskaita.saknines.length
      ? `Diagnostikos ataskaita — ${ataskaita.klase} klasė`
      : `Diagnostikos ataskaita — ${ataskaita.klase} klasė, spragų nerasta`
    const url = `mailto:${kontaktai.elPastas}?subject=${encodeURIComponent(
      tema,
    )}&body=${encodeURIComponent(laiskoTekstas(ataskaita, vardas.trim(), kontaktas.trim()))}`
    window.location.href = url
  }

  const laukas =
    'w-full rounded-[6px] border border-line bg-paper px-3 py-2.5 t-body text-ink sm:w-72'

  return (
    <section className="be-spausdinimo mt-16">
      <h2 className="t-h2">Ką daryti su šia ataskaita</h2>
      <p className="tekstas mt-3 t-body text-muted">
        Ataskaita niekur neišsaugota. Kad ji neprapultų, atsispausdinkite, išsaugokite PDF
        failu arba nusiųskite Modestai.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Mygtukas variantas="konturas" onClick={() => window.print()}>
          Spausdinti arba išsaugoti PDF
        </Mygtukas>
        <Mygtukas onClick={() => setForma((v) => !v)} aria-expanded={forma}>
          {forma ? 'Nesiųsti' : 'Siųsti Modestai'}
        </Mygtukas>
      </div>

      {forma && (
        <div className="mt-6 max-w-xl rounded-[8px] border border-line bg-paper-2 p-6">
          <p className="t-small text-muted">
            Paspaudus mygtuką atsidarys jūsų pašto programa su paruoštu laišku. Svetainė
            laiško nesiunčia ir jūsų duomenų neįrašo — juos matys tik Modesta, kai laišką
            išsiųsite patys.
          </p>

          <div className="mt-5 flex flex-col gap-4">
            <div>
              <label htmlFor="vardas" className="block t-small font-semibold">
                Jūsų vardas
              </label>
              <input
                id="vardas"
                type="text"
                autoComplete="name"
                value={vardas}
                onChange={(e) => setVardas(e.target.value)}
                className={`${laukas} mt-2`}
              />
            </div>

            <div>
              <label htmlFor="kontaktas" className="block t-small font-semibold">
                El. paštas arba telefono numeris
              </label>
              <input
                id="kontaktas"
                type="text"
                autoComplete="email"
                value={kontaktas}
                onChange={(e) => setKontaktas(e.target.value)}
                placeholder="vardas@pastas.lt arba +370 6XX XXXXX"
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
          </div>

          <div className="mt-6">
            <Mygtukas onClick={siusk} disabled={!galimaSiusti} dydis="didelis">
              Atidaryti laišką
            </Mygtukas>
            {!galimaSiusti && (
              <p className="mt-3 t-small text-muted">
                Užpildykite vardą, kontaktą ir pažymėkite patvirtinimą.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default AtaskaitosVeiksmai
