'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import Mygtukas from '@/components/Mygtukas'
import { generuok, type Uzdavinys } from '@/lib/generatoriai'
import { pasirink } from '@/lib/matematika'
import { temos } from '@/lib/temos'

const UzdavinioKortele = dynamic(() => import('@/components/UzdavinioKortele'), {
  ssr: false,
})

type Props = {
  /** Iki kurios klasės temos įtraukiamos į rinkinį. */
  ikiKlases: number
  /** Kiek minučių trunka tikrasis patikrinimas. */
  minutes: number
  /** Kiek uždavinių dėti į rinkinį. */
  kiek: number
  id: string
}

function laikas(sekundes: number): string {
  const m = Math.floor(sekundes / 60)
  const s = sekundes % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function PasiruosimoRinkinys({ ikiKlases, minutes, kiek, id }: Props) {
  const [uzdaviniai, setUzdaviniai] = useState<Uzdavinys[]>([])
  const [rodytiAtsakymus, setRodytiAtsakymus] = useState(false)
  const [liko, setLiko] = useState<number | null>(null)
  const [eina, setEina] = useState(false)
  const laikrodis = useRef<ReturnType<typeof setInterval> | null>(null)

  // Laikrodis sustoja pats, kai `liko` pasiekia nulį — atskiro efekto nereikia.
  useEffect(() => {
    if (!eina || liko === null || liko <= 0) return
    laikrodis.current = setInterval(() => {
      setLiko((v) => (v === null ? v : Math.max(0, v - 1)))
    }, 1000)
    return () => {
      if (laikrodis.current) clearInterval(laikrodis.current)
    }
  }, [eina, liko])

  function generuokRinkini() {
    const tinkamos = temos.filter((t) => t.klase <= ikiKlases)
    const nauji: Uzdavinys[] = []
    const matyti = new Set<string>()

    // Temos maišomos, kad rinkinys nebūtų sugrupuotas pagal temą — tikrame
    // patikrinime uždaviniai taip pat eina pramaišiui.
    for (let i = 0; nauji.length < kiek && i < kiek * 10; i += 1) {
      const t = pasirink(tinkamos)
      // Senesnės klasės temos duodamos sunkesniu lygiu — jos jau turi būti tvirtos.
      const lygis = t.klase >= ikiKlases - 1 ? 2 : 3
      const u = generuok(t.generatorius, lygis)
      if (matyti.has(u.klausimas)) continue
      matyti.add(u.klausimas)
      nauji.push(u)
    }

    setUzdaviniai(nauji)
    setRodytiAtsakymus(false)
    setLiko(minutes * 60)
    setEina(true)
  }

  const baigesi = liko === 0

  return (
    <div className="mt-8">
      <div className="be-spausdinimo flex flex-wrap items-center gap-3">
        <Mygtukas onClick={generuokRinkini}>Generuoti pasiruošimo rinkinį</Mygtukas>

        {liko !== null && (
          <span
            className={`font-mono text-lg tabular-nums ${baigesi ? 'text-orange' : 'text-muted'}`}
            aria-live="off"
          >
            {baigesi ? 'Laikas baigėsi' : laikas(liko)}
          </span>
        )}

        {liko !== null && !baigesi && (
          <button
            type="button"
            onClick={() => setEina((v) => !v)}
            className="t-small text-muted underline underline-offset-4 hover:text-orange"
          >
            {eina ? 'Pristabdyti' : 'Tęsti'}
          </button>
        )}
      </div>

      {uzdaviniai.length === 0 ? (
        <p className="mt-4 t-small text-muted">
          Rinkinys iš {kiek} uždavinių, laikmatis — {minutes} min., tiek pat, kiek skiriama
          tikrajam patikrinimui.
        </p>
      ) : (
        <>
          <div className="be-spausdinimo mt-6 flex flex-wrap gap-3">
            <Mygtukas variantas="konturas" onClick={() => setRodytiAtsakymus((v) => !v)}>
              {rodytiAtsakymus ? 'Slėpti atsakymus' : 'Rodyti atsakymus'}
            </Mygtukas>
            <Mygtukas variantas="konturas" onClick={() => window.print()}>
              Spausdinti
            </Mygtukas>
          </div>

          <ol className="mt-6 flex flex-col gap-4" aria-labelledby={id}>
            {uzdaviniai.map((u, i) => (
              <UzdavinioKortele
                key={u.id}
                uzdavinys={u}
                numeris={i + 1}
                rodytiAtsakyma={rodytiAtsakymus}
              />
            ))}
          </ol>
        </>
      )}
    </div>
  )
}

export default PasiruosimoRinkinys
