import type { GrandinesZingsnis } from '@/lib/diagnostika'

type Props = {
  grandine: GrandinesZingsnis[]
}

/**
 * Vertikali grandinė nuo simptomo iki šaknies (6.3).
 *
 * Kiekviena tema stovi virš tos, kuria remiasi, o tarp jų — brūkšnys.
 * Perskaityta iš viršaus žemyn tai yra viena gili trupmena: tai, ką mato
 * tėvai, yra skaitiklis, o tikroji priežastis — vardiklis.
 */
export function TemuGrandine({ grandine }: Props) {
  if (grandine.length === 0) return null

  return (
    <ol className="mt-8">
      {grandine.map((z, i) => {
        const kitas = grandine[i + 1]
        const neislaikyta = z.rezultatas === 'neislaikyta'

        return (
          <li key={z.tema.id}>
            <div
              className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-[8px] px-4 py-4 ${
                z.saknis ? 'bg-orange-soft' : ''
              }`}
            >
              <span
                className={`t-body ${
                  z.saknis ? 'font-semibold' : neislaikyta ? '' : 'text-muted'
                }`}
              >
                {z.tema.pavadinimas}
              </span>

              <span className="flex items-baseline gap-3 t-small">
                <span className="text-muted">{z.tema.klase} kl.</span>
                <span
                  className={`font-semibold ${neislaikyta ? 'text-ink' : 'text-muted'}`}
                >
                  {z.saknis
                    ? 'čia prasideda darbas'
                    : neislaikyta
                      ? 'nepavyko'
                      : z.rezultatas === 'islaikyta'
                        ? 'tvirta'
                        : 'netikrinta'}
                </span>
              </span>
            </div>

            {/* Trupmenos brūkšnys tarp temos ir to, kuo ji remiasi. */}
            {kitas && (
              <div
                className={
                  kitas.rezultatas === 'neislaikyta' ? 'h-0.5 bg-orange' : 'h-px bg-line'
                }
                aria-hidden="true"
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default TemuGrandine
