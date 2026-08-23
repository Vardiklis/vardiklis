import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import type { Metadata } from 'next'
import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import { EGZAMINAI } from '@/lib/egzaminai'

export const metadata: Metadata = {
  title: 'PUPP matematikos pasiruošimo užduotys — PDF biblioteka',
  description:
    'Nemokamos pasiruošimo užduotys PUPP matematikai: tos pačios struktūros kaip patikrinime — trys dalys, 50 taškų, 150 minučių. Atsisiųsk PDF su atsakymais ir sprendimais.',
  openGraph: {
    title: 'PUPP matematikos pasiruošimo užduotys — Vardiklis',
    description:
      'Pasiruošimo užduotys su ta pačia struktūra kaip PUPP: trys dalys, 50 taškų, 150 minučių. PDF su atsakymais.',
  },
}

const NSA_PUPP =
  'https://www.nsa.smsm.lt/pasiekimu-departamentas/egzaminai-ir-pasiekimu-patikrinimai/pagrindinio-ugdymo-pasiekimu-patikrinimai/pupp-uzduociu-pavyzdziai/'
const NSA_PROGRAMOS =
  'https://www.nsa.smsm.lt/pasiekimu-departamentas/egzaminai-ir-pasiekimu-patikrinimai/pagrindinio-ugdymo-pasiekimu-patikrinimai/'
const NSA_PAGRINDINIS = 'https://www.nsa.smsm.lt/'

const nuorodosStilius =
  't-body font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange'

type Variantas = {
  numeris: number
  lapas: string
  atsakymai: string | null
  dydisKb: number
}

/**
 * Variantai skaitomi iš katalogo, o ne rašomi ranka.
 *
 * PDF gaminami scenarijumi `npm run egzaminai`, tad sąrašas kode neišvengiamai
 * imtų skirtis nuo failų. Katalogo perskaitymas vyksta statinio generavimo
 * metu, todėl naršyklė jokio failų sistemos darbo nedaro.
 */
function variantai(egzaminoId: string): Variantas[] {
  const katalogas = join(process.cwd(), 'public', 'egzaminai')
  let failai: string[]
  try {
    failai = readdirSync(katalogas)
  } catch {
    return []
  }

  return failai
    .filter((f) => f.startsWith(`${egzaminoId}-`) && f.endsWith('.pdf') && !f.includes('-atsakymai'))
    .map((f) => {
      const numeris = Number(f.replace(`${egzaminoId}-`, '').replace('.pdf', ''))
      const atsakymai = `${egzaminoId}-${String(numeris).padStart(2, '0')}-atsakymai.pdf`
      return {
        numeris,
        lapas: `/egzaminai/${f}`,
        atsakymai: failai.includes(atsakymai) ? `/egzaminai/${atsakymai}` : null,
        dydisKb: Math.round(statSync(join(katalogas, f)).size / 1024),
      }
    })
    .sort((a, b) => a.numeris - b.numeris)
}

function Faktas({ pavadinimas, children }: { pavadinimas: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-4 md:grid md:grid-cols-[12rem_1fr] md:gap-8">
      <dt className="t-small font-semibold">{pavadinimas}</dt>
      <dd className="mt-1 t-body text-muted md:mt-0">{children}</dd>
    </div>
  )
}

function Kortele({ v, egzaminas }: { v: Variantas; egzaminas: string }) {
  return (
    <li className="flex flex-col rounded-[8px] border border-line bg-paper p-5 transition-colors hover:border-ink">
      <span className="font-mono t-small text-muted">{String(v.numeris).padStart(2, '0')}</span>
      <h3 className="mt-1 t-h3">{v.numeris} variantas</h3>
      <p className="mt-1 t-small text-muted">{egzaminas} · PDF, {v.dydisKb} KB</p>

      <div className="mt-4 flex flex-col gap-2">
        <a
          href={v.lapas}
          download
          className="rounded-[6px] border border-ink bg-orange px-4 py-2 text-center t-small font-semibold text-ink transition-colors hover:bg-orange-soft"
        >
          Atsisiųsti užduotį
        </a>
        {v.atsakymai && (
          <a
            href={v.atsakymai}
            download
            className="rounded-[6px] border border-line bg-paper px-4 py-2 text-center t-small transition-colors hover:border-ink"
          >
            Atsakymai ir sprendimai
          </a>
        )}
      </div>
    </li>
  )
}

export default function Egzaminai() {
  return (
    <div className="turinys sekcija">
      <Antraste
        lygis={1}
        dydis="display-l"
        paantraste="Pasiruošimo užduotys, sudarytos pagal tą pačią struktūrą kaip pagrindinio ugdymo pasiekimų patikrinimas: trys dalys, 50 taškų, 150 minučių. Kiekvienas variantas — su atsakymais ir sprendimais."
      >
        PUPP matematikos pasiruošimo užduotys
      </Antraste>

      {/* ── Kuo tai nėra ───────────────────────────────────────────────── */}
      <div className="mt-10 rounded-[8px] border border-line bg-paper-2 p-5 md:p-6">
        <h2 className="t-h3">Tai ne NŠA užduotys</h2>
        <p className="tekstas mt-3 t-body text-muted">
          Nacionalinės švietimo agentūros parengtos užduotys yra saugomos autorių teisių, todėl jų
          čia nekeliame ir neperrašinėjame. Šie lapai sudaryti iš originalių, mūsų generatoriaus
          sukurtų uždavinių. Pakartota tik tai, kas skelbiama viešai ir kas nėra kūrinys —
          patikrinimo <b>struktūra</b>: dalių skaičius, uždavinių tipai, taškų pasiskirstymas,
          trukmė ir turinio sritys.
        </p>
        <p className="tekstas mt-3 t-body text-muted">
          Oficialius užduočių pavyzdžius rasite NŠA svetainėje — nuorodos puslapio apačioje.
        </p>
      </div>

      {/* ── Struktūra ──────────────────────────────────────────────────── */}
      {EGZAMINAI.map((e) => (
        <section key={e.id} className="mt-14">
          <Antraste suSkirtuku dydis="h2">
            {e.pavadinimas}
          </Antraste>

          <dl className="mt-6">
            <Faktas pavadinimas="Trukmė">{e.trukmeMin} minutės</Faktas>
            <Faktas pavadinimas="Taškai">{e.taskai}</Faktas>
            {e.dalys.map((d) => (
              <Faktas key={d.numeris} pavadinimas={`${d.numeris} dalis`}>
                {d.pavadinimas} — {d.uzdaviniu} uždaviniai, {d.taskai} taškai
              </Faktas>
            ))}
            <Faktas pavadinimas="Turinio sritys">
              {e.sritys.map((s) => `${s.pavadinimas} ${Math.round(s.dalis * 100)} %`).join(' · ')}
            </Faktas>
          </dl>

          {/* ── Variantų tinklelis ───────────────────────────────────── */}
          <h3 className="mt-10 t-h3">Variantai</h3>
          <p className="mt-2 t-small text-muted">
            Kiekvienas variantas nekintantis — nuoroda visada atiduos tą patį lapą, tad ją galima
            dalintis su klase.
          </p>

          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {variantai(e.id).map((v) => (
              <Kortele key={v.numeris} v={v} egzaminas={e.pavadinimas} />
            ))}
          </ul>
        </section>
      ))}

      {/* ── Oficialūs šaltiniai ────────────────────────────────────────── */}
      <section className="mt-16">
        <BruksnysDivider className="mb-8" />
        <h2 className="t-h3">Oficialūs šaltiniai</h2>
        <p className="tekstas mt-3 t-body text-muted">
          Tikrųjų užduočių pavyzdžių, programų ir tvarkaraščių ieškokite Nacionalinės švietimo
          agentūros svetainėje.
        </p>
        <ul className="mt-5 flex flex-col gap-3">
          <li>
            <a href={NSA_PUPP} className={nuorodosStilius} target="_blank" rel="noopener noreferrer">
              PUPP užduočių pavyzdžiai
            </a>
          </li>
          <li>
            <a
              href={NSA_PROGRAMOS}
              className={nuorodosStilius}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pagrindinio ugdymo pasiekimų patikrinimai ir programos
            </a>
          </li>
          <li>
            <a
              href={NSA_PAGRINDINIS}
              className={nuorodosStilius}
              target="_blank"
              rel="noopener noreferrer"
            >
              Nacionalinė švietimo agentūra
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
