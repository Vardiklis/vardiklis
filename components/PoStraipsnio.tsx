import BruksnysDivider from '@/components/BruksnysDivider'
import Mygtukas from '@/components/Mygtukas'
import RegistracijosForma from '@/components/RegistracijosForma'
import { kontaktai } from '@/lib/kontaktai'
import { gautiNustatymus } from '@/lib/nustatymai'

/**
 * Kvietimas, atsirandantis po KIEKVIENU straipsniu automatiškai.
 *
 * Trys dalykai iš eilės, nuo lengviausio žingsnio prie sunkiausio:
 *   1. kainos su nuolaidos užrašu — kad nereikėtų klausti „o kiek kainuoja“;
 *   2. telefonas ir el. paštas — vienu paspaudimu, be jokios formos;
 *   3. registracijos forma tiems, kam patogiau parašyti.
 *
 * Turinys imamas iš Payload globalo „Kainos ir kvietimas“, tad kainą pakeisti
 * galima be diegimo. Neužpildžius nė vienos kainos, lentelė praleidžiama.
 */
export async function PoStraipsnio({ saltinis }: { saltinis?: string }) {
  const n = await gautiNustatymus()
  if (!n.rodyti) return null

  return (
    <section className="be-spausdinimo mt-16" aria-labelledby="kvietimas">
      <BruksnysDivider className="mb-10" />

      {n.kainos.length > 0 && (
        <div className="mb-14">
          <div className="flex flex-wrap items-center gap-4">
            <h2 id="kvietimas" className="t-h2">
              {n.kainuAntraste}
            </h2>
            {n.nuolaida && (
              <span className="rounded-full bg-orange-soft px-3 py-1 t-small font-semibold text-ink">
                {n.nuolaida}
              </span>
            )}
          </div>

          <ul className="mt-6 max-w-2xl border-t border-line">
            {n.kainos.map((k, i) => (
              <li
                key={`${k.pavadinimas}-${i}`}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-4"
              >
                <span className="t-body">
                  {k.pavadinimas}
                  {k.trukme && <span className="text-muted"> · {k.trukme}</span>}
                  {k.prierasas && (
                    <span className="block t-small text-muted">{k.prierasas}</span>
                  )}
                </span>
                <span className="t-mono font-semibold whitespace-nowrap">{k.kaina}</span>
              </li>
            ))}
          </ul>

          {n.kainuPastaba && (
            <p className="tekstas mt-4 t-small text-muted">{n.kainuPastaba}</p>
          )}
        </div>
      )}

      <div className="rounded-[8px] border border-line bg-paper-2 p-6 md:p-8">
        <h2 className="t-h2">{n.formosAntraste}</h2>
        <p className="tekstas mt-3 t-body text-muted">{n.formosTekstas}</p>

        {/* Greitasis kelias — be formos, iš karto į telefoną arba paštą. */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Mygtukas href={`tel:${kontaktai.telefonasNuoroda}`}>{kontaktai.telefonas}</Mygtukas>
          <Mygtukas href={`mailto:${kontaktai.elPastas}`} variantas="konturas">
            {kontaktai.elPastas}
          </Mygtukas>
        </div>

        <p className="mt-4 t-small text-muted">
          {kontaktai.vardas}, {kontaktai.pareigos}. {kontaktai.vietove}.
        </p>

        <hr className="my-8 border-0 border-t border-line" />

        <p className="t-small font-semibold">Arba palikite žinutę — atrašysiu pati</p>
        <RegistracijosForma saltinis={saltinis} />
      </div>
    </section>
  )
}

export default PoStraipsnio
