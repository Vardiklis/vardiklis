'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import { atsiliepimai, type Atsiliepimas } from '@/lib/atsiliepimai'
import BruksnysDivider from './BruksnysDivider'

/**
 * Kiek komplektų takelyje po hidratacijos. Trys — mažiausias skaičius, su
 * kuriuo ratas veikia į abi puses: vidurinis rodomas, kraštiniai yra atsarga,
 * per kurią peršokama.
 */
const KOPIJOS = 3

/** `gap-5` tarp kortelių — reikalingas skaičiuojant komplekto plotį. */
const TARPAS = 20

/**
 * „Ar jau hidratuota?“ per `useSyncExternalStore`: serveryje ir per pačią
 * hidrataciją grąžina `false`, po jos — `true`. Būtent tam ši funkcija ir
 * skirta, todėl, skirtingai nei `setState` efekte, nekelia kaskadinio piešimo.
 */
const NESIKEICIA = () => () => {}
const KLIENTE = () => true
const SERVERYJE = () => false

function Zvaigzdutes({ kiek }: { kiek: number }) {
  return (
    <div className="flex gap-0.5 text-orange" role="img" aria-label={`${kiek} iš 5`}>
      {Array.from({ length: kiek }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  )
}

/** „Ieva Buzaitė“ → „IB“, „Rugilė“ → „R“. */
function inicialai(vardas: string) {
  const dalys = vardas.trim().split(/\s+/)
  return `${dalys[0]?.[0] ?? ''}${dalys[1]?.[0] ?? ''}`.toUpperCase()
}

/**
 * Apvalus profilio ženklas. Nuotraukos neturint piešiam inicialus, o ne tuščią
 * siluetą: raidės bent susieja ženklą su vardu šalia.
 *
 * `alt=""`, nes vardas parašytas čia pat — ekrano skaitytuvui pakartoti jį dar
 * kartą paveikslėlio vardu būtų tik triukšmas.
 */
function Avataras({ atsiliepimas }: { atsiliepimas: Atsiliepimas }) {
  const bendra = 'h-11 w-11 shrink-0 rounded-full border border-line'

  if (atsiliepimas.nuotrauka) {
    return (
      <Image
        src={atsiliepimas.nuotrauka}
        alt=""
        width={44}
        height={44}
        className={`${bendra} object-cover`}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`${bendra} flex items-center justify-center bg-orange-soft font-display text-sm font-semibold`}
    >
      {inicialai(atsiliepimas.vardas)}
    </span>
  )
}

/** `2026-08-25` arba `2026-08` → „2026 08“. Diena nieko nesako, mėnuo — sako. */
function menuo(data: string) {
  const [metai, men] = data.split('-')
  return `${metai} ${men}`
}

/**
 * Atsiliepimai iš paslaugos.lt — horizontali karuselė, sukama ratu.
 *
 * Serveris atiduoda VIENĄ komplektą kortelių: tiek, kiek yra unikalaus teksto.
 * Taip Google mato kiekvieną atsiliepimą po vieną kartą, o be JS puslapis lieka
 * paprastu slenkamu sąrašu. Po hidratacijos komplektų tampa trys ir takelis ima
 * suktis be galo — žr. `suk()`.
 */
export function Atsiliepimai({ className = '' }: { className?: string }) {
  const takelis = useRef<HTMLUListElement>(null)

  // Komplektus dauginam tik po hidratacijos: pirmas kliento piešimas turi
  // sutapti su serverio HTML, kitaip React skųstųsi neatitikimu.
  const hidratuota = useSyncExternalStore(NESIKEICIA, KLIENTE, SERVERYJE)
  const kopijos = hidratuota ? KOPIJOS : 1

  /** Vienos kortelės plotis su tarpu. */
  const kortelesPlotis = useCallback(() => {
    const t = takelis.current
    const k = t?.querySelector<HTMLElement>('[data-kortele]')
    return k ? k.offsetWidth + TARPAS : 0
  }, [])

  /** Vieno komplekto plotis — tiek reikia peršokti, kad vaizdas nepasikeistų. */
  const periodas = useCallback(() => atsiliepimai.length * kortelesPlotis(), [kortelesPlotis])

  // Atsistojam ties viduriniu komplektu — nuo čia galima slinkti į abi puses.
  useEffect(() => {
    const t = takelis.current
    if (!t || kopijos === 1) return
    t.scrollLeft = periodas()
  }, [kopijos, periodas])

  /**
   * Ratas. Išėjus iš vidurinio komplekto, tyliai peršokam per vieną komplektą
   * atgal. Turinys kartojasi būtent tuo periodu, tad po šuolio po akimis lieka
   * lygiai tas pats vaizdas — siūlės nesimato, o slinkti galima be galo.
   */
  const suk = useCallback(() => {
    const t = takelis.current
    if (!t || kopijos === 1) return
    const p = periodas()
    if (p <= 0) return
    // Po šuolio pozicija visada lieka [p, 2p), tad sąlyga iškart nebegalioja ir
    // ciklo iš `scroll` įvykių nesusidaro.
    if (t.scrollLeft < p) t.scrollLeft += p
    else if (t.scrollLeft >= 2 * p) t.scrollLeft -= p
  }, [kopijos, periodas])

  useEffect(() => {
    const t = takelis.current
    if (!t) return
    t.addEventListener('scroll', suk, { passive: true })
    window.addEventListener('resize', suk)
    return () => {
      t.removeEventListener('scroll', suk)
      window.removeEventListener('resize', suk)
    }
  }, [suk])

  function slink(kryptis: 1 | -1) {
    const t = takelis.current
    if (!t) return
    // `behavior: 'smooth'` CSS'o nepaiso, tad reduced-motion tikrinam patys.
    const svelnus = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    t.scrollBy({ left: kryptis * kortelesPlotis(), behavior: svelnus ? 'smooth' : 'auto' })
  }

  const rodyklesStilius =
    'flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-ink'

  // Tikrasis komplektas — tas, kurį skaito ekrano skaitytuvas. Kiti du yra
  // vizualinė atsarga ratui, todėl jiems `aria-hidden`.
  const tikrasis = kopijos === 1 ? 0 : 1
  const korteles = Array.from({ length: kopijos }, (_, k) =>
    atsiliepimai.map((a) => ({ a, k })),
  ).flat()

  return (
    <section id="atsiliepimai" className={className} aria-labelledby="atsiliepimai-antraste">
      <BruksnysDivider className="mb-8" />

      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="atsiliepimai-antraste" className="display-l">
          Ką sako tėvai ir mokiniai
        </h2>

        {/* Rodyklės — pagalbinės. Takelis slenkasi ir pele, ir pirštu, ir
            klaviatūra, tad telefone jų nerodom, kad neužimtų vietos. */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => slink(-1)}
            aria-label="Ankstesnis atsiliepimas"
            className={rodyklesStilius}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => slink(1)}
            aria-label="Kitas atsiliepimas"
            className={rodyklesStilius}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* `-mx-5 px-5` — takelis nusidriekia iki konteinerio krašto, bet pirma
          kortelė lieka ties tuo pačiu paraštės kraštu, kaip ir antraštė.

          `items-start` telefone: matosi viena kortelė, tad tempti ją iki
          ilgiausio atsiliepimo aukščio reikštų pusę ekrano tuštumos. Nuo `md`
          kortelės stovi greta — ten vienodas aukštis jau atrodo tvarkingai.

          `snap-proximity`, ne `mandatory`: ratas kartais pastumia `scrollLeft`
          ranka, o griežtas snap tokį šuolį bandytų persverti. */}
      <ul
        ref={takelis}
        tabIndex={0}
        role="region"
        aria-label="Atsiliepimai, slenkami į šoną"
        className="slinktis-be-juostos -mx-5 mt-10 flex snap-x snap-proximity items-start gap-5 overflow-x-auto px-5 pb-2 md:items-stretch"
      >
        {korteles.map(({ a, k }) => (
          <li
            key={`${k}-${a.id}`}
            data-kortele
            aria-hidden={k === tikrasis ? undefined : true}
            className="w-[min(85vw,22rem)] shrink-0 snap-start md:w-[24rem]"
          >
            <figure className="flex h-full flex-col rounded-[8px] border border-line bg-paper-2 p-6 md:p-7">
              <Zvaigzdutes kiek={a.ivertinimas} />

              <blockquote className="mt-5 grow t-body">„{a.tekstas}“</blockquote>

              {/* Data šalia paslaugos — PASLAUGOS, ne atsiliepimo: kitaip
                  „Papildomas matematikos mokymas · 2026 08" skaitytųsi taip,
                  lyg tada ir vyko pamokos, nors tai tik atsiliepimo data.
                  Atsiliepimo data lieka struktūriniuose duomenyse. */}
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <Avataras atsiliepimas={a} />
                <span className="min-w-0">
                  <span className="block t-body font-semibold">{a.vardas}</span>
                  <span className="mt-0.5 block t-small text-muted">
                    {a.paslauga} ·{' '}
                    <time dateTime={a.paslaugosData}>{menuo(a.paslaugosData)}</time>
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <p className="mt-4 t-small text-muted md:hidden">Slinkite į šoną →</p>
    </section>
  )
}

export default Atsiliepimai
