'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Button, toast } from '@payloadcms/ui'
import type { Apzvalga, Laikotarpis } from '@/lib/saskaitos'
import { suformatuok } from '@/lib/pinigai'
import {
  anuliuokVeiksmas,
  isafIkelkVeiksmas,
  isafPateikVeiksmas,
  isafTikrinkVeiksmas,
  ismeskVeiksmas,
  israsykVeiksmas,
  israsykVisusVeiksmas,
  siuskVeiksmas,
  siuskVisusVeiksmas,
  sugeneruokVeiksmas,
  zymekApmoketaVeiksmas,
  type Rezultatas,
} from './veiksmai'

/**
 * Mėnesio langas: ką žurnalas jau uždirbo ir kas iš to jau išrašyta.
 *
 * SĄSKAITOS TAISOMOS ĮPRASTU PAYLOAD REDAKTORIUM — mygtukas „Taisyti“ veda į
 * `/admin/collections/saskaitos/<id>`. Savos formos nedarom sąmoningai:
 * Payload jau turi eilučių masyvą, patvirtinimą prieš išeinant ir dokumento
 * rakinimą, o sumos persiskaičiuoja kolekcijos kabliuke.
 *
 * VEIKSMAI VYKSTA PO VIENĄ. Kol vienas dirba, kiti mygtukai užrakinami:
 * paspaudus „Išrašyti visus“ dukart, antras paspaudimas duotų dvi numeracijos
 * eiles ir sąskaitas su tais pačiais numeriais.
 */

type Props = {
  apzvalga: Apzvalga
  menesiai: Laikotarpis[]
  isaf: {
    rodyti: boolean
    arSertifikatas: boolean
    aplinka: string
    saskaitu: number
    klaidos: string[]
    busena: string
  }
}

const BUSENU_VARDAI: Record<string, string> = {
  juodrastis: 'Juodraštis',
  israsyta: 'Išrašyta',
  issiusta: 'Išsiųsta',
  apmoketa: 'Apmokėta',
  anuliuota: 'Anuliuota',
}

const ISAF_VARDAI: Record<string, string> = {
  neteikta: 'neteikta',
  ikelta: 'įkelta',
  pateikta: 'pateikta',
  klaida: 'klaida',
}

export function SaskaituValdiklis({ apzvalga, menesiai, isaf }: Props) {
  const router = useRouter()
  const [dirba, pradek] = useTransition()
  const [vykdomas, nustatykVykdoma] = useState<string | null>(null)

  const paleisk = (raktas: string, darbas: () => Promise<Rezultatas>) => {
    nustatykVykdoma(raktas)
    pradek(async () => {
      try {
        const r = await darbas()
        // Klaidų sąrašas svarbesnis už bendrą žinutę: jame parašyta, KĄ taisyti.
        const tekstas = r.klaidos?.length ? `${r.zinute}\n${r.klaidos.join('\n')}` : r.zinute
        if (r.pavyko) toast.success(tekstas)
        else toast.error(tekstas)
      } catch (klaida) {
        toast.error(String(klaida))
      } finally {
        nustatykVykdoma(null)
        router.refresh()
      }
    })
  }

  const l = apzvalga.laikotarpis
  const juodrasciu = apzvalga.saskaitos.filter((s) => s.busena === 'juodrastis').length
  const neissiustu = apzvalga.saskaitos.filter((s) => s.busena === 'israsyta').length
  const siandien = new Date().toISOString().slice(0, 10)

  return (
    <div className="saskaitos">
      <div className="saskaitos__virsus">
        <select
          className="saskaitos__menuo"
          value={l.raktas}
          disabled={dirba}
          onChange={(i) => router.push(`/admin/saskaitos?menuo=${i.target.value}`)}
          aria-label="Mėnuo"
        >
          {menesiai.map((m) => (
            <option key={m.raktas} value={m.raktas}>
              {m.pavadinimas}
            </option>
          ))}
        </select>
      </div>

      <div className="saskaitos__suvestine">
        <div className="saskaitos__kortele">
          <span className="saskaitos__skaicius">{apzvalga.laukiaPamoku}</span>
          <span className="saskaitos__etikete">
            įvykusios pamokos laukia sąskaitos
            {apzvalga.laukiaSeimu > 0 ? ` · ${apzvalga.laukiaSeimu} šeim.` : ''}
          </span>
          <span className="saskaitos__suma">{suformatuok(apzvalga.laukiaSuma)}</span>
        </div>
        <div className="saskaitos__kortele">
          <span className="saskaitos__skaicius">{apzvalga.saskaitos.length}</span>
          <span className="saskaitos__etikete">
            sąskaitos už šį mėnesį
            {juodrasciu > 0 ? ` · ${juodrasciu} juodr.` : ''}
          </span>
          <span className="saskaitos__suma">{suformatuok(apzvalga.israsytaSuma)}</span>
        </div>
      </div>

      <div className="saskaitos__veiksmai">
        <Button
          size="small"
          disabled={dirba}
          onClick={() => paleisk('gen', () => sugeneruokVeiksmas(l.raktas))}
        >
          {vykdomas === 'gen' ? 'Generuojama…' : 'Sugeneruoti juodraščius'}
        </Button>
        <Button
          size="small"
          buttonStyle="secondary"
          disabled={dirba || juodrasciu === 0}
          onClick={() => paleisk('isr', () => israsykVisusVeiksmas(l.raktas))}
        >
          {vykdomas === 'isr' ? 'Išrašoma…' : `Išrašyti visus (${juodrasciu})`}
        </Button>
        <Button
          size="small"
          buttonStyle="secondary"
          disabled={dirba || neissiustu === 0}
          onClick={() => paleisk('siu', () => siuskVisusVeiksmas(l.raktas))}
        >
          {vykdomas === 'siu' ? 'Siunčiama…' : `Siųsti tėvams (${neissiustu})`}
        </Button>
      </div>

      {apzvalga.saskaitos.length === 0 ? (
        <p className="saskaitos__tuscia">
          Už {l.pavadinimas} sąskaitų dar nėra.{' '}
          {apzvalga.laukiaPamoku > 0
            ? 'Paspauskite „Sugeneruoti juodraščius“.'
            : 'Žurnale nėra pamokų, pažymėtų kaip įvykusios.'}
        </p>
      ) : (
        <table className="saskaitos__lentele">
          <thead>
            <tr>
              <th>Numeris</th>
              <th>Tėvai</th>
              <th>Vaikai</th>
              <th className="saskaitos--desine">Pamokų</th>
              <th className="saskaitos--desine">Suma</th>
              <th>Būsena</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {apzvalga.saskaitos.map((s) => (
              <tr key={s.id} className={s.busena === 'anuliuota' ? 'saskaitos--anuliuota' : ''}>
                <td>{s.numeris ?? '—'}</td>
                <td>
                  {s.pirkejoVardas || s.pirkejoPastas}
                  {s.pirkejoVardas && s.pirkejoPastas ? (
                    <span className="saskaitos__smulkiai">{s.pirkejoPastas}</span>
                  ) : null}
                </td>
                <td>{s.vaikai || '—'}</td>
                <td className="saskaitos--desine">{s.pamoku}</td>
                <td className="saskaitos--desine">{suformatuok(s.sumaIsViso)}</td>
                <td>
                  <span className={`saskaitos__zyma saskaitos__zyma--${s.busena}`}>
                    {BUSENU_VARDAI[s.busena] ?? s.busena}
                  </span>
                  {s.isafBusena !== 'neteikta' ? (
                    <span className="saskaitos__smulkiai">
                      i.SAF: {ISAF_VARDAI[s.isafBusena] ?? s.isafBusena}
                    </span>
                  ) : null}
                </td>
                <td className="saskaitos__mygtukai">
                  <a href={`/vidus/saskaita/${s.id}`} target="_blank" rel="noopener noreferrer">
                    Peržiūrėti
                  </a>
                  <a href={`/admin/collections/saskaitos/${s.id}`}>Taisyti</a>
                  {s.busena === 'juodrastis' ? (
                    <>
                      <button
                        type="button"
                        disabled={dirba}
                        onClick={() => paleisk(`i${s.id}`, () => israsykVeiksmas(s.id))}
                      >
                        Išrašyti
                      </button>
                      <button
                        type="button"
                        disabled={dirba}
                        className="saskaitos--pavojinga"
                        onClick={() => {
                          if (!confirm('Išmesti juodraštį? Pamokos grįš į eilę.')) return
                          paleisk(`x${s.id}`, () => ismeskVeiksmas(s.id))
                        }}
                      >
                        Išmesti
                      </button>
                    </>
                  ) : null}
                  {s.busena === 'israsyta' || s.busena === 'issiusta' ? (
                    <button
                      type="button"
                      disabled={dirba}
                      onClick={() => paleisk(`s${s.id}`, () => siuskVeiksmas(s.id))}
                    >
                      {s.issiusta ? 'Siųsti dar kartą' : 'Siųsti'}
                    </button>
                  ) : null}
                  {s.busena === 'issiusta' ? (
                    <button
                      type="button"
                      disabled={dirba}
                      onClick={() => paleisk(`a${s.id}`, () => zymekApmoketaVeiksmas(s.id, siandien))}
                    >
                      Apmokėta
                    </button>
                  ) : null}
                  {s.busena !== 'juodrastis' && s.busena !== 'anuliuota' ? (
                    <button
                      type="button"
                      disabled={dirba}
                      className="saskaitos--pavojinga"
                      onClick={() => {
                        if (!confirm('Anuliuoti sąskaitą? Numeris liks, pamokos grįš į eilę.')) {
                          return
                        }
                        paleisk(`an${s.id}`, () => anuliuokVeiksmas(s.id))
                      }}
                    >
                      Anuliuoti
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isaf.rodyti ? (
        <section className="saskaitos__isaf">
          <h3>i.SAF · išrašomų PVM sąskaitų faktūrų registras</h3>
          <p className="saskaitos__smulkiai">
            Į registrą patenka sąskaitos, <strong>išrašytos</strong> {l.pavadinimas} mėnesį — ne
            tos, kurios apmokestina to mėnesio pamokas. Teikiama iki kito mėnesio 20 d.
            {isaf.arSertifikatas ? ` Aplinka: ${isaf.aplinka}.` : ''}
          </p>

          {!isaf.arSertifikatas ? (
            <p className="saskaitos__ispejimas">
              Sertifikatas nesukonfigūruotas. Susigeneruokite jį i.MAS portale ir nurodykite kelią
              per <code>ISAF_SERTIFIKATAS</code>. Rinkmeną tuo tarpu galima atsisiųsti ir įkelti
              ranka per imas.vmi.lt.
            </p>
          ) : null}

          {isaf.klaidos.length > 0 ? (
            <ul className="saskaitos__ispejimas">
              {isaf.klaidos.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          ) : null}

          <p>
            Rinkmenoje: <strong>{isaf.saskaitu}</strong> sąsk. · būsena:{' '}
            <strong>{ISAF_VARDAI[isaf.busena] ?? isaf.busena}</strong>
          </p>

          <div className="saskaitos__veiksmai">
            <Button
              size="small"
              buttonStyle="secondary"
              el="anchor"
              url={`/vidus/isaf/${l.raktas}`}
              newTab
            >
              Peržiūrėti XML
            </Button>
            <Button
              size="small"
              buttonStyle="secondary"
              disabled={dirba || !isaf.arSertifikatas || isaf.saskaitu === 0}
              onClick={() => paleisk('isaf1', () => isafIkelkVeiksmas(l.raktas))}
            >
              {vykdomas === 'isaf1' ? 'Keliama…' : 'Įkelti į i.SAF'}
            </Button>
            <Button
              size="small"
              buttonStyle="secondary"
              disabled={dirba || !isaf.arSertifikatas || isaf.busena === 'neteikta'}
              onClick={() => paleisk('isaf2', () => isafTikrinkVeiksmas(l.raktas))}
            >
              {vykdomas === 'isaf2' ? 'Tikrinama…' : 'Tikrinti būseną'}
            </Button>
            <Button
              size="small"
              disabled={dirba || !isaf.arSertifikatas || isaf.busena !== 'ikelta'}
              onClick={() => {
                if (!confirm('Pateikti registrą VMI? Tai jau deklaracija.')) return
                paleisk('isaf3', () => isafPateikVeiksmas(l.raktas))
              }}
            >
              {vykdomas === 'isaf3' ? 'Pateikiama…' : 'Pateikti registrą'}
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  )
}
