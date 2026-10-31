'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type DragEvent,
  type MouseEvent,
} from 'react'
import { Button, toast } from '@payloadcms/ui'
import type { Ivykis, KalendoriausSavaite as Savaite } from '@/lib/kalendorius'
import {
  atidarykVeiksmas,
  perkelkVeiksmas,
  sukurkVeiksmas,
  type KalendoriausRezultatas,
} from './kalendoriaus-veiksmai'

/**
 * Savaitės tinklelis: dienos stulpeliais, valandos eilutėmis.
 *
 * TRYS VEIKSMAI, KAIP GOOGLE KALENDORIUJE:
 *   - paspaudus pamoką — jos žurnalo įrašas (tema, namų darbai, būsena);
 *   - nutempus — perkėlimas, su patvirtinimu;
 *   - paspaudus tuščią vietą — papildoma pamoka tuo laiku.
 *
 * Pamoka, kuri kol kas tik tvarkaraštyje, įrašo dar neturi — jis sukuriamas
 * paspaudus (`atidarykVeiksmas`), todėl ji yra mygtukas, o ne nuoroda.
 *
 * Laikas tempiant pritraukiamas prie 15 min.: tikslesnio niekam nereikia, o
 * „17:07“ tik apsunkintų gyvenimą tėvams.
 */

const ZINGSNIS = 15

const BUSENOS: Record<string, string> = {
  suplanuota: '',
  atidare: 'atidarė nuorodą',
  ivyko: 'įvyko',
  neivyko: 'neįvyko',
  atsaukta: 'atšaukta',
  nauja: 'nauja',
  patvirtinta: 'patvirtinta',
}

/** Įvykius su šiomis būsenomis tempti nėra prasmės — jie jau istorija. */
const NETEMPIAMI = ['ivyko', 'neivyko']

const laikas = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

const trumpai = (savaite: Savaite, dataISO: string) => {
  const d = savaite.dienos.find((x) => x.data === dataISO)
  return d ? `${d.trumpas} ${dataISO.slice(5)}` : dataISO
}

type Naujai = { data: string; laikas: string }

export function KalendoriausSavaite({ savaite }: { savaite: Savaite }) {
  const router = useRouter()
  const [dirba, pradek] = useTransition()
  const [tempiamas, nustatykTempiama] = useState<Ivykis | null>(null)
  const [perziura, nustatykPerziura] = useState<{ data: string; min: number } | null>(null)
  const [naujai, nustatykNaujai] = useState<Naujai | null>(null)
  const pagriebta = useRef(0)
  const dialogas = useRef<HTMLDialogElement>(null)

  const { nuo, iki } = savaite
  const viso = iki - nuo
  const procentai = (min: number) => `${((min - nuo) / viso) * 100}%`
  const valandos = Array.from({ length: viso / 60 }, (_, i) => nuo + i * 60)

  const paleisk = (darbas: () => Promise<KalendoriausRezultatas>, poSekmes?: (r: KalendoriausRezultatas) => void) => {
    pradek(async () => {
      try {
        const r = await darbas()
        if (!r.pavyko) {
          toast.error(r.zinute)
          return
        }
        if (r.zinute) toast.success(r.zinute)
        poSekmes?.(r)
      } catch (klaida) {
        toast.error(String(klaida))
      } finally {
        router.refresh()
      }
    })
  }

  /** Pelės aukštis stulpelyje → minutės, pritrauktos prie žingsnio. */
  const minutesPagalPele = (e: { clientY: number; currentTarget: HTMLElement }, trukme: number, atimti = 0) => {
    const r = e.currentTarget.getBoundingClientRect()
    const min = nuo + ((e.clientY - r.top - atimti) / r.height) * viso
    const pritraukta = Math.round(min / ZINGSNIS) * ZINGSNIS
    return Math.min(Math.max(pritraukta, nuo), iki - trukme)
  }

  const atidaryk = (i: Ivykis) => {
    if (!i.vieta) return
    paleisk(
      () => atidarykVeiksmas(i.vieta!),
      (r) => r.id && router.push(`/admin/collections/zurnalas/${r.id}`),
    )
  }

  const numesk = (e: DragEvent<HTMLDivElement>, dataISO: string) => {
    e.preventDefault()
    const i = tempiamas
    nustatykTempiama(null)
    nustatykPerziura(null)
    if (!i) return

    const min = minutesPagalPele(e, i.trukme, pagriebta.current)
    const naujasLaikas = laikas(min)
    if (dataISO === i.dataISO && naujasLaikas === i.laikas) return

    // Persidengimą matom ir čia: kalendoriuje yra visa savaitė, o tempiama tik joje.
    const greta = savaite.ivykiai.filter(
      (k) =>
        k.raktas !== i.raktas &&
        k.dataISO === dataISO &&
        k.busena !== 'atsaukta' &&
        k.pradzia < min + i.trukme &&
        k.pradzia + k.trukme > min,
    )
    const klausimas = [
      `Perkelti „${i.pavadinimas}“ iš ${trumpai(savaite, i.dataISO)} ${i.laikas} į ${trumpai(savaite, dataISO)} ${naujasLaikas}?`,
      i.rusis === 'grupine' ? 'Grupinė pamoka perkeliama visiems nariams.' : null,
      greta.length
        ? `Dėmesio: tuo metu jau yra ${greta.map((k) => `${k.pavadinimas} ${k.laikas}`).join(', ')}.`
        : null,
    ]
      .filter(Boolean)
      .join('\n\n')
    if (!window.confirm(klausimas)) return

    paleisk(() =>
      perkelkVeiksmas({ vieta: i.vieta, irasoId: i.irasoId }, dataISO, naujasLaikas),
    )
  }

  const pradekNauja = (reiksme: Naujai) => {
    nustatykNaujai(reiksme)
    dialogas.current?.showModal()
  }

  const isaugokNauja = (forma: HTMLFormElement) => {
    const d = new FormData(forma)
    paleisk(
      () =>
        sukurkVeiksmas(
          String(d.get('kam') ?? ''),
          String(d.get('data') ?? ''),
          String(d.get('laikas') ?? ''),
          Number(d.get('trukme') ?? 60),
        ),
      () => dialogas.current?.close(),
    )
  }

  return (
    <div className="kalendorius">
      <div className="kalendorius__irankiai">
        <Button el="link" url={`/admin/kalendorius?savaite=${savaite.ankstesne}`} size="small" buttonStyle="secondary" margin={false}>
          ‹
        </Button>
        <Button el="link" url="/admin/kalendorius" size="small" buttonStyle="secondary" margin={false}>
          Ši savaitė
        </Button>
        <Button el="link" url={`/admin/kalendorius?savaite=${savaite.kita}`} size="small" buttonStyle="secondary" margin={false}>
          ›
        </Button>
        <strong className="kalendorius__etikete">{savaite.etikete}</strong>
        <input
          type="date"
          className="kalendorius__data"
          aria-label="Peršokti į savaitę"
          value={savaite.pirmadienis}
          onChange={(e) => e.target.value && router.push(`/admin/kalendorius?savaite=${e.target.value}`)}
        />
        <span className="kalendorius__tarpas" />
        <Button
          size="small"
          margin={false}
          disabled={dirba}
          onClick={() =>
            pradekNauja({
              data: savaite.dabar?.data ?? savaite.pirmadienis,
              laikas: '17:00',
            })
          }
        >
          + Papildoma pamoka
        </Button>
      </div>

      <ul className="kalendorius__legenda">
        <li className="kalendorius__ivykis">Individuali</li>
        <li className="kalendorius__ivykis kalendorius__ivykis--grupine">Grupinė</li>
        <li className="kalendorius__ivykis kalendorius__ivykis--rezervacija">Rezervacija</li>
        <li className="kalendorius__ivykis kalendorius__ivykis--atsaukta">Atšaukta</li>
        <li>↪ perkelta</li>
        <li>Paspauskite pamoką — atsidarys jos langas; nutempkite — perkelsite.</li>
      </ul>

      <div className={`kalendorius__slinktis${dirba ? ' kalendorius__slinktis--dirba' : ''}`}>
        <div className="kalendorius__tinklelis" style={{ ['--valandu' as string]: viso / 60 }}>
          <div className="kalendorius__kampas" />
          {savaite.dienos.map((d) => (
            <div
              key={d.data}
              className={`kalendorius__antraste${d.siandien ? ' kalendorius__antraste--siandien' : ''}`}
            >
              <span>{d.trumpas}</span>
              <b>{d.diena}</b>
            </div>
          ))}

          <div className="kalendorius__laikai">
            {valandos.map((v) => (
              <span key={v} style={{ top: procentai(v) }}>
                {laikas(v)}
              </span>
            ))}
          </div>

          {savaite.dienos.map((d) => (
            <div
              key={d.data}
              className={`kalendorius__diena${d.siandien ? ' kalendorius__diena--siandien' : ''}`}
              style={{ backgroundSize: `100% ${100 / (viso / 60)}%` }}
              onDragOver={(e) => {
                if (!tempiamas) return
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                nustatykPerziura({ data: d.data, min: minutesPagalPele(e, tempiamas.trukme, pagriebta.current) })
              }}
              onDrop={(e) => numesk(e, d.data)}
              onClick={(e: MouseEvent<HTMLDivElement>) => {
                if (e.target !== e.currentTarget || dirba) return
                pradekNauja({ data: d.data, laikas: laikas(minutesPagalPele(e, 60)) })
              }}
            >
              {savaite.ivykiai
                .filter((i) => i.dataISO === d.data)
                .map((i) => (
                  <IvykioLangelis
                    key={i.raktas}
                    ivykis={i}
                    stilius={{
                      top: procentai(i.pradzia),
                      height: `${(i.trukme / viso) * 100}%`,
                      left: `${(i.stulpelis / i.stulpeliu) * 100}%`,
                      width: `${100 / i.stulpeliu}%`,
                    }}
                    tempiamas={tempiamas?.raktas === i.raktas}
                    galimaTempti={!dirba && i.rusis !== 'rezervacija' && !NETEMPIAMI.includes(i.busena)}
                    onAtidaryk={() => atidaryk(i)}
                    onPradekTempti={(e) => {
                      pagriebta.current = e.clientY - e.currentTarget.getBoundingClientRect().top
                      e.dataTransfer.effectAllowed = 'move'
                      e.dataTransfer.setData('text/plain', i.raktas)
                      nustatykTempiama(i)
                    }}
                    onBaikTempti={() => {
                      nustatykTempiama(null)
                      nustatykPerziura(null)
                    }}
                  />
                ))}

              {perziura?.data === d.data && tempiamas && (
                <div
                  className="kalendorius__perziura"
                  style={{
                    top: procentai(perziura.min),
                    height: `${(tempiamas.trukme / viso) * 100}%`,
                  }}
                >
                  {laikas(perziura.min)}
                </div>
              )}

              {savaite.dabar?.data === d.data && savaite.dabar.min >= nuo && savaite.dabar.min <= iki && (
                <div className="kalendorius__dabar" style={{ top: procentai(savaite.dabar.min) }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <dialog ref={dialogas} className="kalendorius__dialogas" onClose={() => nustatykNaujai(null)}>
        {naujai && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              isaugokNauja(e.currentTarget)
            }}
          >
            <h3>Papildoma pamoka</h3>
            <p className="kalendorius__pastaba">
              Vienkartinė — tvarkaraštis nesikeičia. Priminimą tėvai gaus kaip įprastai.
            </p>
            <label>
              Kam
              <select name="kam" required defaultValue="">
                <option value="" disabled>
                  Pasirinkite…
                </option>
                {savaite.kam.map((k) => (
                  <option key={k.reiksme} value={k.reiksme}>
                    {k.pavadinimas}
                  </option>
                ))}
              </select>
            </label>
            <div className="kalendorius__eilute">
              <label>
                Data
                <input type="date" name="data" required defaultValue={naujai.data} />
              </label>
              <label>
                Pradžia
                <input type="time" name="laikas" required step={ZINGSNIS * 60} defaultValue={naujai.laikas} />
              </label>
              <label>
                Trukmė (min.)
                <input type="number" name="trukme" required min={15} max={240} step={5} defaultValue={60} />
              </label>
            </div>
            <div className="kalendorius__mygtukai">
              <Button type="button" buttonStyle="secondary" size="small" margin={false} onClick={() => dialogas.current?.close()}>
                Atšaukti
              </Button>
              <Button type="submit" size="small" margin={false} disabled={dirba}>
                {dirba ? 'Įrašoma…' : 'Įrašyti'}
              </Button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  )
}

function IvykioLangelis({
  ivykis: i,
  stilius,
  tempiamas,
  galimaTempti,
  onAtidaryk,
  onPradekTempti,
  onBaikTempti,
}: {
  ivykis: Ivykis
  stilius: CSSProperties
  tempiamas: boolean
  galimaTempti: boolean
  onAtidaryk: () => void
  onPradekTempti: (e: DragEvent<HTMLElement>) => void
  onBaikTempti: () => void
}) {
  const busena = BUSENOS[i.busena] ?? i.busena
  const klase = [
    'kalendorius__ivykis',
    `kalendorius__ivykis--${i.rusis}`,
    `kalendorius__ivykis--${i.busena}`,
    tempiamas ? 'kalendorius__ivykis--tempiamas' : '',
  ]
    .filter(Boolean)
    .join(' ')
  const pavadinimas = [
    `${i.laikas} ${i.pavadinimas}`,
    i.smulkiai,
    busena,
    i.perkeltaIs ? `perkelta iš ${i.perkeltaIs}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  const turinys = (
    <>
      <span className="kalendorius__laikas">
        {i.busena === 'ivyko' ? '✓ ' : i.busena === 'neivyko' ? '✗ ' : ''}
        {i.laikas}
      </span>{' '}
      <span className="kalendorius__vardas">{i.pavadinimas}</span>
      {i.smulkiai && <span className="kalendorius__smulkiai">{i.smulkiai}</span>}
      {i.perkeltaIs && <span className="kalendorius__smulkiai">↪ iš {i.perkeltaIs}</span>}
    </>
  )

  const bendra = {
    className: klase,
    style: stilius,
    title: pavadinimas,
    draggable: galimaTempti,
    onDragStart: galimaTempti ? onPradekTempti : undefined,
    onDragEnd: onBaikTempti,
  }

  if (i.nuoroda) {
    return (
      <Link href={i.nuoroda} prefetch={false} {...bendra}>
        {turinys}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onAtidaryk} {...bendra}>
      {turinys}
    </button>
  )
}
