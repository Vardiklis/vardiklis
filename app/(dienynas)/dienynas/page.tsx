import { redirect } from 'next/navigation'
import { Logotipas } from '@/components/Logotipas'
import {
  dienynoKelias,
  prisijungusiPaskyra,
  vaikoDienynas,
  type KitaPamoka,
  type VaikoDienynas,
} from '@/lib/dienynas'
import { data as dataVilniuje, dataZodziais, dienaGalininku, MENESIAI, pridekDienas } from '@/lib/laikas'
import { atsijungti } from './veiksmai'

/**
 * Dienyno pradžia: kiekvienam paskyros vaikui — kita pamoka, mygtukas į ją
 * ir paskutinių pamokų temos su namų darbais.
 *
 * Vaikų sąrašas imamas TIK iš prisijungusios paskyros, tad svetimo vaiko
 * dienyno čia pamatyti neįmanoma — adrese jokio vaiko numerio nėra.
 */

const didziaja = (tekstas: string) => tekstas.charAt(0).toUpperCase() + tekstas.slice(1)

function kada(dataISO: string, siandien: string): string {
  if (dataISO === siandien) return 'Šiandien'
  if (dataISO === pridekDienas(siandien, 1)) return 'Rytoj'
  const [, menuo, diena] = dataISO.split('-').map(Number)
  return `${didziaja(dienaGalininku(dataISO))}, ${MENESIAI[menuo - 1]} ${diena} d.`
}

export default async function DienynoPuslapis() {
  const paskyra = await prisijungusiPaskyra()
  if (!paskyra) redirect(await dienynoKelias('/prisijungti'))

  const dabar = new Date()
  const siandien = dataVilniuje(dabar)
  const vaikai = (await Promise.all(paskyra.mokiniai.map((id) => vaikoDienynas(id, dabar)))).filter(
    (v): v is VaikoDienynas => v !== null,
  )

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pb-16">
      <header className="flex items-center justify-between gap-4 border-b border-line py-5">
        <div className="flex items-end gap-3">
          <Logotipas kaipNuoroda={false} />
          <span className="t-small pb-0.5 text-muted">dienynas</span>
        </div>
        <form action={atsijungti}>
          <button type="submit" className="t-small text-muted underline-offset-4 hover:text-ink hover:underline">
            Atsijungti
          </button>
        </form>
      </header>

      <main>
        {vaikai.length === 0 && (
          <p className="t-body mt-10 text-muted">
            Šiai paskyrai dar nepriskirtas nė vienas mokinys. Parašykite korepetitorei.
          </p>
        )}

        {vaikai.map((vaikas) => (
          <section key={vaikas.id} className="mt-10" aria-labelledby={`vaikas-${vaikas.id}`}>
            <h1 id={`vaikas-${vaikas.id}`} className="t-h2">
              {vaikai.length === 1 ? `Labas, ${vaikas.vardas}!` : vaikas.vardas}
            </h1>

            <KitosPamokosKortele kita={vaikas.kita} nuoroda={vaikas.nuoroda} siandien={siandien} />

            <h2 className="t-h3 mt-10">Pamokos</h2>
            {vaikas.pamokos.length === 0 ? (
              <p className="t-small mt-2 text-muted">Kai pamoka įvyks, čia atsiras jos tema ir namų darbai.</p>
            ) : (
              <ol className="mt-3 divide-y divide-line border-y border-line">
                {vaikas.pamokos.map((p) => (
                  <li key={p.id} className="py-4">
                    <p className="t-small text-muted">
                      {didziaja(dataZodziais(p.dataISO))}
                      {p.laikas ? ` · ${p.laikas}` : ''}
                    </p>
                    <p className="mt-1 font-semibold">{p.tema ?? <span className="font-normal text-muted">Tema neįrašyta</span>}</p>
                    <div className="mt-2 rounded-[6px] bg-paper-2 px-3.5 py-2.5">
                      <p className="t-small font-semibold">Namų darbai</p>
                      <p className="t-body whitespace-pre-line">
                        {p.namuDarbai ?? <span className="text-muted">Namų darbų nėra</span>}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        ))}
      </main>
    </div>
  )
}

function KitosPamokosKortele({
  kita,
  nuoroda,
  siandien,
}: {
  kita: KitaPamoka | null
  nuoroda: string | null
  siandien: string
}) {
  return (
    <div className="mt-5 rounded-[8px] border border-line bg-white p-5">
      <p className="t-small font-semibold text-muted">{kita?.vyksta ? 'Pamoka vyksta dabar' : 'Kita pamoka'}</p>
      {kita ? (
        <p className="mt-1 font-display text-[1.5rem] leading-tight font-semibold tracking-[-0.01em]">
          {kada(kita.dataISO, siandien)}, {kita.laikas}–{kita.pabaiga}
          {kita.grupine && <span className="t-small ml-2 align-middle font-sans font-normal text-muted">grupinė</span>}
        </p>
      ) : (
        <p className="t-body mt-1">Artimiausių pamokų nesuplanuota.</p>
      )}

      {nuoroda && (
        <a
          href={nuoroda}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-orange bg-orange px-6 py-3.5 text-[1.0625rem] font-semibold text-ink transition-colors duration-150 hover:bg-[#F05600] sm:w-auto"
        >
          Prisijungti į pamoką →
        </a>
      )}
    </div>
  )
}
