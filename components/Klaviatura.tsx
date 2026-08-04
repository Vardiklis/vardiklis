'use client'

import Trupmena from './Trupmena'

type Props = {
  reiksme: string
  onKeisti: (nauja: string) => void
  onUzdaryti: () => void
  /** Rodoma tik tada, kai atsakymo dar galima keisti. */
  isjungta?: boolean
}

type Klavisas = {
  zenklas: string
  /** Ką įrašo į lauką. Jei nenurodyta — tą patį, ką rodo. */
  iraso?: string
  veiksmas?: 'trinti' | 'valyti'
  akcentas?: boolean
  aprasas?: string
}

const SKAICIAI: Klavisas[][] = [
  [
    { zenklas: '7' },
    { zenklas: '8' },
    { zenklas: '9' },
    { zenklas: '⌫', veiksmas: 'trinti', aprasas: 'Trinti paskutinį ženklą' },
  ],
  [
    { zenklas: '4' },
    { zenklas: '5' },
    { zenklas: '6' },
    // Trupmenos brūkšnys — dėl jo ši klaviatūra ir egzistuoja.
    { zenklas: '/', akcentas: true, aprasas: 'Trupmenos brūkšnys' },
  ],
  [
    { zenklas: '1' },
    { zenklas: '2' },
    { zenklas: '3' },
    { zenklas: ',', aprasas: 'Kablelis' },
  ],
  [
    { zenklas: '0' },
    { zenklas: '−', iraso: '-', aprasas: 'Minusas' },
    { zenklas: 'tarpas', iraso: ' ', aprasas: 'Tarpas mišriajam skaičiui' },
    { zenklas: 'Valyti', veiksmas: 'valyti', aprasas: 'Išvalyti lauką' },
  ],
]

const SIMBOLIAI: Klavisas[][] = [
  [
    { zenklas: '√', aprasas: 'Kvadratinė šaknis' },
    { zenklas: 'x²', iraso: '^2', aprasas: 'Kėlimas kvadratu' },
    { zenklas: '(', aprasas: 'Skliaustas atidaromas' },
    { zenklas: ')', aprasas: 'Skliaustas uždaromas' },
  ],
  [
    { zenklas: 'x' },
    { zenklas: 'y' },
    { zenklas: 'a' },
    { zenklas: 'b' },
  ],
  [
    { zenklas: 'c' },
    { zenklas: 'd' },
    { zenklas: '=', aprasas: 'Lygybės ženklas' },
    { zenklas: '·', iraso: '*', aprasas: 'Daugybos ženklas' },
  ],
]

/** Ką rodyti peržiūroje: trupmeną, mišrųjį skaičių ar tiesiog tekstą. */
function perziura(
  reiksme: string,
): { skaitiklis: string; vardiklis: string; sveikas?: string } | null {
  const svarus = reiksme.trim()
  const misrus = svarus.match(/^(-?\d+)\s+(\d+)\/(\d*)$/)
  if (misrus) {
    return { sveikas: misrus[1], skaitiklis: misrus[2], vardiklis: misrus[3] || '?' }
  }
  const trupmena = svarus.match(/^(-?\d+)\/(\d*)$/)
  if (trupmena) {
    return { skaitiklis: trupmena[1], vardiklis: trupmena[2] || '?' }
  }
  return null
}

/**
 * Matematikos klaviatūra.
 *
 * Pagrindinė priežastis, kodėl ji reikalinga — trupmenos: telefone `/` yra
 * paslėptas, o vaikas neranda, kaip įvesti `3/4`. Antra eilė skirta tam, ko
 * nėra nė vienoje skaičių klaviatūroje: šaknies, kvadrato, skliaustų ir raidžių.
 *
 * Įvestis normalizuojama prieš lyginant, tad `x = 5`, `√16` ir `2^3` skaitomi
 * teisingai — žr. `normalizuok` faile `lib/matematika.ts`.
 */
export function Klaviatura({ reiksme, onKeisti, onUzdaryti, isjungta = false }: Props) {
  const p = perziura(reiksme)

  function spausk(k: Klavisas) {
    if (isjungta) return
    if (k.veiksmas === 'valyti') return onKeisti('')
    if (k.veiksmas === 'trinti') return onKeisti(reiksme.slice(0, -1))
    onKeisti(reiksme + (k.iraso ?? k.zenklas))
  }

  function mygtukas(k: Klavisas, aukstis: string) {
    return (
      <button
        key={k.zenklas}
        type="button"
        disabled={isjungta}
        onClick={() => spausk(k)}
        aria-label={k.aprasas ?? k.zenklas}
        className={`${aukstis} rounded-[6px] border font-mono text-lg transition-colors disabled:opacity-40 ${
          k.akcentas
            ? 'border-orange bg-orange font-semibold text-ink'
            : 'border-line bg-paper text-ink hover:border-ink'
        } ${k.zenklas.length > 2 ? 'text-[0.8125rem]' : ''}`}
      >
        {k.zenklas}
      </button>
    )
  }

  return (
    <div className="be-spausdinimo mt-5 max-w-sm rounded-[8px] border border-line bg-paper-2 p-3">
      <div className="flex min-h-14 items-center justify-between gap-4 px-2 pb-3">
        <span className="t-small text-muted">
          {p ? (
            <Trupmena
              dydis="didelis"
              bruksnys="ink"
              skaitiklis={
                <span className="text-ink">
                  {p.sveikas && <span className="mr-1">{p.sveikas}</span>}
                  {p.skaitiklis}
                </span>
              }
              vardiklis={<span className="text-ink">{p.vardiklis}</span>}
            />
          ) : reiksme === '' ? (
            'Įveskite atsakymą'
          ) : (
            <span className="font-mono text-lg text-ink">{reiksme}</span>
          )}
        </span>

        <button
          type="button"
          onClick={onUzdaryti}
          className="shrink-0 t-small text-muted underline underline-offset-4 hover:text-orange"
        >
          Slėpti
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {SKAICIAI.map((eilute, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">
            {eilute.map((k) => mygtukas(k, 'h-12'))}
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-line pt-3">
        <div className="flex flex-col gap-2">
          {SIMBOLIAI.map((eilute, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              {eilute.map((k) => mygtukas(k, 'h-11'))}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 px-2 t-small text-muted">
        Trupmena rašoma su brūkšniu:{' '}
        <span className="font-mono whitespace-nowrap text-ink">3/4</span>. Mišrusis skaičius —
        su tarpu: <span className="font-mono whitespace-nowrap text-ink">1&nbsp;1/2</span>.
        Galima rašyti ir <span className="font-mono whitespace-nowrap text-ink">x&nbsp;=&nbsp;5</span>.
      </p>
    </div>
  )
}

export default Klaviatura
