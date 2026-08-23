import type { Metadata } from 'next'
import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import PasiruosimoRinkinys from './PasiruosimoRinkinys'

export const metadata: Metadata = {
  title: 'NMPP ir PUPP matematika — kas tai ir kaip pasiruošti',
  description:
    'Kas yra NMPP ir PUPP matematikos patikrinimai, kada vyksta, kokia struktūra ir ką reiškia pasiekimų lygiai. Nemokamas pasiruošimo uždavinių rinkinys su laikmačiu.',
  openGraph: {
    title: 'NMPP ir PUPP matematika — Vardiklis',
    description:
      'Kas yra NMPP ir PUPP, kokia struktūra ir ką reiškia lygiai. Pasiruošimo rinkinys su laikmačiu.',
  },
}

const NSA_NMPP =
  'https://www.nsa.smsm.lt/pasiekimu-departamentas/egzaminai-ir-pasiekimu-patikrinimai/nacionaliniai-mokiniu-pasiekimu-patikrinimai/'
const NSA_TVARKARASCIAI =
  'https://www.nsa.smsm.lt/pasiekimu-departamentas/egzaminai-ir-pasiekimu-patikrinimai/nacionaliniai-mokiniu-pasiekimu-patikrinimai/nmpp-tvarkarasciai/'
const NSA_PUPP =
  'https://www.nsa.smsm.lt/pasiekimu-departamentas/egzaminai-ir-pasiekimu-patikrinimai/pagrindinio-ugdymo-pasiekimu-patikrinimai/pupp-uzduociu-pavyzdziai/'

const nuorodosStilius =
  't-body font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange'

function Faktas({ pavadinimas, children }: { pavadinimas: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-4 md:grid md:grid-cols-[12rem_1fr] md:gap-8">
      <dt className="t-small font-semibold">{pavadinimas}</dt>
      <dd className="mt-1 t-body text-muted md:mt-0">{children}</dd>
    </div>
  )
}

export default function Testai() {
  return (
    <div className="turinys sekcija">
      <Antraste
        lygis={1}
        dydis="display-l"
        paantraste="Du valstybiniai matematikos patikrinimai, apie kuriuos tėvai dažniausiai klausia. Žemiau — kas tai yra, kaip atrodo užduotis ir ką iš tikrųjų reiškia pasiekimų lygiai."
      >
        NMPP ir PUPP
      </Antraste>

      {/* ── NMPP ───────────────────────────────────────────────────────────── */}
      <section className="mt-16">
        <BruksnysDivider className="mb-8" />
        <h2 className="t-h2">NMPP — nacionaliniai mokinių pasiekimų patikrinimai</h2>

        <p className="tekstas mt-4 t-body text-muted">
          Tai ne egzaminas. NMPP skirti grįžtamajam ryšiui: parodyti mokiniui, tėvams ir
          mokytojui, kur pasiekimai stiprūs, o kur yra spragų.
        </p>

        <dl className="mt-8">
          <Faktas pavadinimas="Kam">4 ir 8 klasių mokiniams.</Faktas>
          <Faktas pavadinimas="Dalykai">
            Matematika ir lietuvių kalba (skaitymas). Aštuntokams gali būti ir kitų dalykų.
          </Faktas>
          <Faktas pavadinimas="Trukmė">Matematikos patikrinimui skiriama 60 minučių.</Faktas>
          <Faktas pavadinimas="Kaip vyksta">
            Elektroniniu būdu; užduotys vertinamos automatiškai, preliminarų taškų įvertinimą
            mokinys mato iškart.
          </Faktas>
          <Faktas pavadinimas="Kada">
            Pavasarį. Tikslus tvarkaraštis kiekvienais metais skelbiamas atskirai —{' '}
            <a href={NSA_TVARKARASCIAI} className="underline underline-offset-2" target="_blank" rel="noopener">
              NŠA tvarkaraščiai
            </a>
            .
          </Faktas>
          <Faktas pavadinimas="Vertinimas">
            Keturi pasiekimų lygiai: slenkstinis, patenkinamas, pagrindinis, aukštesnysis.
          </Faktas>
        </dl>

        <div className="mt-8 rounded-[8px] border-l-2 border-orange bg-paper-2 px-6 py-5">
          <h3 className="t-h3">Ką reiškia lygiai</h3>
          <p className="mt-3 t-body text-muted">
            Nei surinkti taškai, nei priskirtas lygis neverčiami pažymiu ir neturi įtakos
            kėlimui į kitą klasę. Lygis rodo, kiek savarankiškai vaikas geba taikyti tai, ko
            išmoko: slenkstinis — tik su pagalba ir paprasčiausiose situacijose; aukštesnysis
            — savarankiškai ir nepažįstamame kontekste. Tėvui naudingiausia ne pati raidė, o
            klausimas, <em>kurių temų</em> uždaviniai nepavyko.
          </p>
        </div>

        <p className="mt-6">
          <a href={NSA_NMPP} className={nuorodosStilius} target="_blank" rel="noopener">
            NMPP informacija ir oficialūs užduočių pavyzdžiai NŠA svetainėje
          </a>
        </p>

        <h3 className="mt-12 t-h3">Pasiruošimo rinkinys, panašus į 8 klasės NMPP</h3>
        <p className="tekstas mt-3 t-body text-muted">
          Tai ne NMPP užduotis ir ne jos kopija — oficialias užduotis skelbia tik NŠA. Tai mūsų
          generuotas rinkinys iš temų, kurias 8 klasės mokinys jau turėtų mokėti, su tokiu
          pačiu laikmačiu.
        </p>
        <PasiruosimoRinkinys id="nmpp-rinkinys" ikiKlases={8} minutes={60} kiek={12} />
      </section>

      {/* ── PUPP ───────────────────────────────────────────────────────────── */}
      <section className="mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="t-h2">PUPP — pagrindinio ugdymo pasiekimų patikrinimas</h2>

        <p className="tekstas mt-4 t-body text-muted">
          PUPP laikomas baigiant pagrindinio ugdymo programą. Skirtingai nei NMPP, tai jau
          patikrinimas, kurio rezultatas fiksuojamas ir turi svorio.
        </p>

        <dl className="mt-8">
          <Faktas pavadinimas="Kam">II gimnazijos (10) klasės mokiniams.</Faktas>
          <Faktas pavadinimas="Trukmė">Matematikai — 150 minučių.</Faktas>
          <Faktas pavadinimas="Taškai">Iš viso galima surinkti 50 taškų.</Faktas>
          <Faktas pavadinimas="Struktūra">
            Trijų tipų uždaviniai: pasirenkamojo atsakymo (8–10 uždavinių, iš viso 10 taškų),
            trumpojo atsakymo (17–19 uždavinių, 24 taškai) ir pilnojo sprendimo (5–6
            uždaviniai, 16 taškų).
          </Faktas>
          <Faktas pavadinimas="Turinys">
            Visas I gimnazijos (9) klasės matematikos turinys ir II gimnazijos (10) klasės
            turinys, išskyrus sritį „Duomenys ir tikimybės“.
          </Faktas>
          <Faktas pavadinimas="Kada">
            Gegužę; numatyta ir pakartotinė sesija. Tikslias datas skelbia NŠA.
          </Faktas>
        </dl>

        <div className="mt-8 rounded-[8px] border-l-2 border-orange bg-paper-2 px-6 py-5">
          <h3 className="t-h3">Kur dažniausiai prarandami taškai</h3>
          <p className="mt-3 t-body text-muted">
            Pilnojo sprendimo uždaviniai duoda 16 taškų iš 50 — beveik trečdalį. Juose
            vertinamas ne tik atsakymas, bet ir surašytas sprendimas. Tačiau praktikoje
            didžioji dalis prarandamų taškų ateina ne iš dešimtos klasės medžiagos, o iš
            trupmenų, procentų ir neigiamų skaičių, kurie tyliai kartojasi kiekviename
            uždavinyje.
          </p>
        </div>

        <p className="mt-6">
          <a href={NSA_PUPP} className={nuorodosStilius} target="_blank" rel="noopener">
            PUPP užduočių pavyzdžiai NŠA svetainėje
          </a>
        </p>

        <h3 className="mt-12 t-h3">Pasiruošimo rinkinys, panašus į PUPP</h3>
        <p className="tekstas mt-3 t-body text-muted">
          Mūsų generuotas rinkinys iš temų, kuriomis PUPP remiasi labiausiai. Laikmatis — kaip
          tikrajame patikrinime.
        </p>
        <PasiruosimoRinkinys id="pupp-rinkinys" ikiKlases={10} minutes={150} kiek={20} />
      </section>

      <section className="mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="t-h2">Jei jau žinote, kad taškų trūksta</h2>
        <p className="tekstas mt-4 t-body text-muted">
          Prieš kalant temas iš eilės, verta išsiaiškinti, kurioje klasėje nutrūko grandinė.
          Diagnostika tai parodo per 15 minučių.
        </p>
        <p className="mt-6">
          <a href="/testas" className={nuorodosStilius}>
            Pradėti diagnostiką
          </a>
        </p>
      </section>
    </div>
  )
}
