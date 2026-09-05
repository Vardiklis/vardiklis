import KalendoriausTinklelis from '@/components/KalendoriausTinklelis'
import { gautiKalendoriu } from '@/lib/tvarkarastis'

type Props = {
  /** Iš kurio puslapio ateita — patenka į rezervacijos įrašą CMS'e. */
  saltinis?: string
}

/**
 * Laisvų laikų kalendorius po registracijos forma.
 *
 * Serverio pusė: paima tvarkaraštį (`lib/tvarkarastis.ts`) ir atiduoda jį
 * klientui jau paverstą į „laisva / užimta / praėjo“. Mokinių vardai, tėvų
 * kontaktai ir kitų žmonių rezervacijos lieka serveryje.
 *
 * Nieko nerodo, jei kalendorius išjungtas CMS'e arba bazė neatsakė.
 */
export default async function PamokuKalendorius({ saltinis }: Props) {
  const kalendorius = await gautiKalendoriu()
  if (!kalendorius) return null

  return (
    <section className="mt-12" aria-labelledby="laisvi-laikai">
      <h3 id="laisvi-laikai" className="t-h3">
        {kalendorius.antraste}
      </h3>

      {kalendorius.registracija && (
        <p className="mt-3 t-body text-muted">
          Pasirinkite laisvą laiką — atsidarys trumpa registracijos forma.
        </p>
      )}

      <KalendoriausTinklelis kalendorius={kalendorius} saltinis={saltinis} />

      {(kalendorius.pastabaLaikai || kalendorius.pastabaGrupine) && (
        <div className="tekstas mt-6 flex flex-col gap-3 t-small text-muted">
          {kalendorius.pastabaLaikai && <p>{kalendorius.pastabaLaikai}</p>}
          {kalendorius.pastabaGrupine && <p>{kalendorius.pastabaGrupine}</p>}
        </div>
      )}
    </section>
  )
}
