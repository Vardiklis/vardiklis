import type { ReactNode } from 'react'
import { Logotipas } from '@/components/Logotipas'
import type { DienynoFailas, KitaPamoka, VaikoDienynas } from '@/lib/dienynas'
import { dataZodziais, dienaGalininku, MENESIAI, pridekDienas } from '@/lib/laikas'

/**
 * Vieno vaiko dienynas — tai, ką mato vaikas ir tėvai.
 *
 * Atskirame komponente, nes tą patį vaizdą rodo ir korepetitorės peržiūra
 * „Kaip mato vaikas“ (`?mokinys=…`). Dvi kopijos anksčiau ar vėliau
 * išsiskirtų, ir peržiūra rodytų ne tai, ką iš tikrųjų mato vaikas.
 */

export const didziaja = (tekstas: string) => tekstas.charAt(0).toUpperCase() + tekstas.slice(1)

/** `Šiandien` / `Rytoj` / `Ketvirtadienį, rugsėjo 17 d.` */
export function kada(dataISO: string, siandien: string): string {
  if (dataISO === siandien) return 'Šiandien'
  if (dataISO === pridekDienas(siandien, 1)) return 'Rytoj'
  const [, menuo, diena] = dataISO.split('-').map(Number)
  return `${didziaja(dienaGalininku(dataISO))}, ${MENESIAI[menuo - 1]} ${diena} d.`
}

/** `Ketvirtadienį, rugsėjo 17 d., 17:00–18:00` */
export const kitosPamokosLaikas = (kita: KitaPamoka, siandien: string) =>
  `${kada(kita.dataISO, siandien)}, ${kita.laikas}–${kita.pabaiga}`

/** `/dienynas/failas/7` arba subdomene `/failas/7`. */
export function failoAdresas(dienynoSaknis: string, failas: DienynoFailas, perziura = false): string {
  const pradzia = dienynoSaknis === '/' ? '' : dienynoSaknis
  return `${pradzia}/failas/${failas.id}${perziura && failas.perziura ? '?dydis=perzvalga' : ''}`
}

/** `darbas.pdf` → `PDF`. Ženkliukas prie failo, kuris nėra paveikslėlis. */
const pletinys = (vardas: string) => (vardas.split('.').pop() ?? '').slice(0, 4).toUpperCase() || 'FAILAS'

/**
 * Prisegti failai: nuotraukos — miniatiūromis, kiti — nuorodomis.
 *
 * Paveikslėliai atidaromi naujame lange pilno dydžio. `<img>`, o ne
 * `next/image`: failas atiduodamas tik prisijungusiam, o Next'o paveikslėlių
 * optimizatorius slapuko neperduotų.
 */
export function Priedai({ failai, dienynoSaknis }: { failai: DienynoFailas[]; dienynoSaknis: string }) {
  if (failai.length === 0) return null
  const paveiksleliai = failai.filter((f) => f.paveikslelis)
  const kiti = failai.filter((f) => !f.paveikslelis)

  return (
    <div className="mt-3 space-y-2">
      {paveiksleliai.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {paveiksleliai.map((f) => (
            <a key={f.id} href={failoAdresas(dienynoSaknis, f)} target="_blank" rel="noopener" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element -- žr. komentarą virš komponento */}
              <img
                src={failoAdresas(dienynoSaknis, f, true)}
                alt={f.pavadinimas}
                loading="lazy"
                className="h-28 w-28 rounded-[6px] border border-line bg-white object-cover transition-opacity hover:opacity-85"
              />
            </a>
          ))}
        </div>
      )}
      {kiti.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {kiti.map((f) => (
            <li key={f.id}>
              <a
                href={failoAdresas(dienynoSaknis, f)}
                target="_blank"
                rel="noopener"
                className="t-small inline-flex max-w-full items-center gap-2 rounded-[6px] border border-line bg-white px-3 py-2 hover:border-ink"
              >
                <span className="rounded-[3px] bg-paper-2 px-1.5 py-0.5 text-[0.6875rem] font-semibold tracking-wide">
                  {pletinys(f.pavadinimas)}
                </span>
                <span className="truncate">{f.pavadinimas}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function DienynoAntraste({ children }: { children: ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-line py-5">
      <div className="flex items-end gap-3">
        <Logotipas kaipNuoroda={false} />
        <span className="t-small pb-0.5 text-muted">dienynas</span>
      </div>
      <div className="t-small flex items-center gap-5">{children}</div>
    </header>
  )
}

export function VaikoSkiltis({
  vaikas,
  siandien,
  dienynoSaknis,
  pasisveikinti,
  perziura = false,
}: {
  vaikas: VaikoDienynas
  siandien: string
  /** `/dienynas` arba subdomene `/` — failų adresams. */
  dienynoSaknis: string
  /** „Labas, Kate!“ — kai paskyroje vienas vaikas. Keliems rodomas tik vardas. */
  pasisveikinti: boolean
  /**
   * Korepetitorės peržiūra. Mygtukas į pamoką tada neveikia: paspaudus jį
   * pamokos metu, žurnale užsidėtų „Atidarė nuorodą“, lyg vaikas būtų atėjęs.
   */
  perziura?: boolean
}) {
  return (
    <section className="mt-10" aria-labelledby={`vaikas-${vaikas.id}`}>
      <h1 id={`vaikas-${vaikas.id}`} className="t-h2">
        {pasisveikinti ? `Labas, ${vaikas.vardas}!` : vaikas.vardas}
      </h1>

      <div className="mt-5 rounded-[8px] border border-line bg-white p-5">
        <p className="t-small font-semibold text-muted">{vaikas.kita?.vyksta ? 'Pamoka vyksta dabar' : 'Kita pamoka'}</p>
        {vaikas.kita ? (
          <p className="mt-1 font-display text-[1.5rem] leading-tight font-semibold tracking-[-0.01em]">
            {kitosPamokosLaikas(vaikas.kita, siandien)}
            {vaikas.kita.grupine && (
              <span className="t-small ml-2 align-middle font-sans font-normal text-muted">grupinė</span>
            )}
          </p>
        ) : (
          <p className="t-body mt-1">Artimiausių pamokų nesuplanuota.</p>
        )}

        {vaikas.nuoroda && (
          <a
            href={perziura ? undefined : vaikas.nuoroda}
            aria-disabled={perziura || undefined}
            title={perziura ? 'Peržiūroje neveikia — kitaip žurnale užsidėtų „Atidarė nuorodą“' : undefined}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-orange bg-orange px-6 py-3.5 text-[1.0625rem] font-semibold text-ink transition-colors duration-150 sm:w-auto ${
              perziura ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#F05600]'
            }`}
          >
            Prisijungti į pamoką →
          </a>
        )}
      </div>

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
              <p className="mt-1 font-semibold">
                {p.tema ?? <span className="font-normal text-muted">Tema neįrašyta</span>}
              </p>
              <div className="mt-2 rounded-[6px] bg-paper-2 px-3.5 py-2.5">
                <p className="t-small font-semibold">Namų darbai</p>
                {p.namuDarbai ? (
                  <p className="t-body whitespace-pre-line">{p.namuDarbai}</p>
                ) : (
                  p.namuDarbuFailai.length === 0 && <p className="t-body text-muted">Namų darbų nėra</p>
                )}
                <Priedai failai={p.namuDarbuFailai} dienynoSaknis={dienynoSaknis} />
              </div>

              {(p.atsiliepimas || p.atsiliepimoFailai.length > 0) && (
                <div className="mt-2 rounded-[6px] border-l-[3px] border-orange bg-white px-3.5 py-2.5">
                  <p className="t-small font-semibold">Mokytojo atsiliepimas</p>
                  {p.atsiliepimas && <p className="t-body whitespace-pre-line">{p.atsiliepimas}</p>}
                  <Priedai failai={p.atsiliepimoFailai} dienynoSaknis={dienynoSaknis} />
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
