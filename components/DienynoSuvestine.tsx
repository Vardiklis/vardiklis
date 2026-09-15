import { didziaja, kitosPamokosLaikas } from '@/components/DienynoVaikas'
import { DIENYNO_PASKYROS } from '@/cms/DienynoPaskyros'
import type { SuvestinesVaikas } from '@/lib/dienynas'
import { dataTrumpai } from '@/lib/pamokos'
import { dataZodziais } from '@/lib/laikas'

/**
 * Korepetitorės suvestinė: visi aktyvūs mokiniai viename puslapyje.
 *
 * Skirta ne redaguoti, o PAMATYTI — kas kada turi pamoką, kur dar neįrašyta
 * tema ir kas neturi dienyno paskyros. Kiekvienas taisymas veda į tą patį CMS
 * dokumentą, kurį atidarytumėte ir iš žurnalo sąrašo, tad antros redagavimo
 * vietos, kuri galėtų elgtis kitaip, nėra.
 */

const BUSENOS: Record<string, string> = {
  suplanuota: 'Nepažymėta',
  atidare: 'Atidarė nuorodą',
  ivyko: 'Įvyko',
  neivyko: 'Neįvyko',
}

const cms = (kolekcija: string, id?: string) => `/admin/collections/${kolekcija}/${id ?? 'create'}`

const nuorodosStilius = 'text-ink underline underline-offset-4 decoration-line hover:decoration-ink'

function skaicius(kiek: number, vienas: string, keli: string, daug: string): string {
  const pask = kiek % 10
  const du = kiek % 100
  if (pask === 1 && du !== 11) return `${kiek} ${vienas}`
  if (pask === 0 || (du >= 11 && du <= 19)) return `${kiek} ${daug}`
  return `${kiek} ${keli}`
}

/** ` · 2 failai` — kad būtų matyti, jog kažkas prisegta, neatidarant įrašo. */
function FailuKiekis({ failai }: { failai: unknown[] }) {
  if (failai.length === 0) return null
  return <span className="whitespace-nowrap"> · {skaicius(failai.length, 'failas', 'failai', 'failų')}</span>
}

export function DienynoSuvestine({
  vaikai,
  siandien,
  dienynoSaknis,
}: {
  vaikai: SuvestinesVaikas[]
  siandien: string
  /** `/dienynas` — peržiūros „Kaip mato vaikas“ nuorodoms. */
  dienynoSaknis: string
}) {
  const beTemos = vaikai.reduce((s, v) => s + v.beTemos, 0)
  const bePaskyros = vaikai.filter((v) => v.paskyros.length === 0).length

  return (
    <main className="mt-10">
      <h1 className="t-h2">Suvestinė</h1>
      <p className="t-small mt-1 text-muted">
        {skaicius(vaikai.length, 'aktyvus mokinys', 'aktyvūs mokiniai', 'aktyvių mokinių')}
        {beTemos > 0 && ` · ${skaicius(beTemos, 'pamoka', 'pamokos', 'pamokų')} be temos`}
        {bePaskyros > 0 && ` · ${bePaskyros} be dienyno paskyros`}
      </p>

      {vaikai.length === 0 && (
        <p className="t-body mt-8 text-muted">
          Aktyvių mokinių nėra. Jie pridedami CMS&apos;e, skiltyje „Mokiniai“.
        </p>
      )}

      <div className="mt-6 space-y-5">
        {vaikai.map((v) => (
          <article key={v.id} className="rounded-[8px] border border-line bg-white p-5" aria-labelledby={`s-${v.id}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 id={`s-${v.id}`} className="t-h3">
                {v.vardas}
                {v.klase && <span className="t-small ml-2 font-sans font-normal text-muted">{v.klase} klasė</span>}
                {v.beTemos > 0 && (
                  <span className="t-small ml-2 rounded-[4px] bg-orange-soft px-1.5 py-0.5 font-sans font-normal whitespace-nowrap">
                    {v.beTemos} be temos
                  </span>
                )}
              </h2>
              <div className="t-small flex gap-4">
                <a href={`${dienynoSaknis}?mokinys=${v.id}`} className={nuorodosStilius}>
                  Kaip mato vaikas
                </a>
                <a href={cms('mokiniai', v.id)} className={nuorodosStilius}>
                  Kortelė
                </a>
              </div>
            </div>

            <dl className="t-small mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              <dt className="text-muted">Kita pamoka</dt>
              <dd>
                {v.kita ? (
                  <>
                    {kitosPamokosLaikas(v.kita, siandien)}
                    {v.kita.grupine && <span className="text-muted"> · grupinė</span>}
                    {v.kita.vyksta && <span className="text-teisinga"> · vyksta dabar</span>}
                  </>
                ) : (
                  <span className="text-muted">nesuplanuota</span>
                )}
                {v.pauzeIki && <span className="text-muted"> · pauzė iki {dataTrumpai(v.pauzeIki)}</span>}
              </dd>

              <dt className="text-muted">Paskyra</dt>
              <dd>
                {v.paskyros.length > 0 ? (
                  v.paskyros.map((p, i) => (
                    <span key={p.id}>
                      {i > 0 && ', '}
                      <a href={cms(DIENYNO_PASKYROS, p.id)} className={nuorodosStilius}>
                        {p.vardas}
                      </a>
                      {p.keistiSlaptazodi && <span className="text-muted"> (dar nepasikeitė slaptažodžio)</span>}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="text-klaidinga">nėra</span> ·{' '}
                    <a href={cms(DIENYNO_PASKYROS)} className={nuorodosStilius}>
                      sukurti
                    </a>
                  </>
                )}
              </dd>
            </dl>

            {v.pamokos.length === 0 ? (
              <p className="t-small mt-4 border-t border-line pt-3 text-muted">Žurnale pamokų dar nėra.</p>
            ) : (
              <ol className="mt-4 divide-y divide-line border-t border-line">
                {v.pamokos.map((p) => (
                  <li key={p.id} className={`flex items-start justify-between gap-4 py-3 ${p.busena === 'neivyko' ? 'opacity-60' : ''}`}>
                    <div className="min-w-0">
                      <p className="t-small text-muted">
                        {didziaja(dataZodziais(p.dataISO))}
                        {p.laikas ? ` · ${p.laikas}` : ''}
                        {p.busena && ` · ${BUSENOS[p.busena] ?? p.busena}`}
                      </p>
                      <p className="mt-0.5 font-semibold">
                        {p.tema ??
                          (p.busena === 'neivyko' ? (
                            <span className="font-normal text-muted">—</span>
                          ) : (
                            <span className="t-small rounded-[4px] bg-orange-soft px-1.5 py-0.5 font-normal">
                              Tema neįrašyta
                            </span>
                          ))}
                      </p>
                      {(p.namuDarbai || p.namuDarbuFailai.length > 0) && (
                        <p className="t-small mt-1 line-clamp-3 whitespace-pre-line text-muted">
                          <span className="font-semibold text-ink">Namų darbai:</span> {p.namuDarbai}
                          <FailuKiekis failai={p.namuDarbuFailai} />
                        </p>
                      )}
                      {(p.atsiliepimas || p.atsiliepimoFailai.length > 0) && (
                        <p className="t-small mt-1 line-clamp-3 whitespace-pre-line text-muted">
                          <span className="font-semibold text-ink">Atsiliepimas:</span> {p.atsiliepimas}
                          <FailuKiekis failai={p.atsiliepimoFailai} />
                        </p>
                      )}
                    </div>
                    <a
                      href={cms('zurnalas', p.id)}
                      className="t-small shrink-0 rounded-[6px] border border-line px-3 py-1.5 font-semibold transition-colors hover:border-ink"
                    >
                      Taisyti
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </article>
        ))}
      </div>
    </main>
  )
}
