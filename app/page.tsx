import Link from 'next/link'
import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import Mygtukas from '@/components/Mygtukas'
import Trupmena from '@/components/Trupmena'

const priezastys = [
  {
    antraste: 'Mokykla mato simptomą',
    tekstas:
      'Kontroliniame dvejetas iš lygčių. Mokytoja aiškina lygtis dar kartą. Vaikas vėl nesupranta, nes trūksta ne to.',
  },
  {
    antraste: 'Matematika sluoksniuota',
    tekstas:
      'Kiekviena tema remiasi ankstesnėmis. Viena spraga penktoje klasėje blokuoja viską, kas ant jos statoma.',
  },
  {
    antraste: 'Diagnostika kapstosi žemyn',
    tekstas:
      'Testas atseka temas atgal, kol randa vietą, kur vaikas dar tvirtas. Ten ir prasideda darbas.',
  },
]

const zingsniai = [
  'Nurodote vaiko klasę',
  'Vaikas sprendžia uždavinius — testas prisitaiko prie atsakymų',
  'Neišlaikius temos, testas nusileidžia į ankstesnes',
  'Gaunate ataskaitą: kurioje klasėje spraga, ką ji blokuoja, kiek laiko taisyti',
]

const ataskaitosDalys = [
  {
    antraste: 'Spraga paprastais žodžiais',
    pavyzdys: 'Vaikas nemoka bendravardiklinti trupmenų. Tai 5 klasės tema.',
  },
  {
    antraste: 'Ką ji blokuoja',
    pavyzdys:
      'Dėl to neįmanomos lygtys, procentai ir proporcijos — visa ši mokslo metų dalis.',
  },
  {
    antraste: 'Kiek laiko taisyti',
    pavyzdys: 'Apie 6 savaites, vieną kartą per savaitę.',
  },
]

export default function Pradzia() {
  return (
    <>
      {/* Hero */}
      <section className="turinys pt-16 pb-20 md:pt-24 md:pb-28">
        <h1 className="display-xl max-w-[15ch]">
          Dvejetas septintoje klasėje beveik visada prasidėjo penktoje.
        </h1>

        <p className="tekstas mt-7 t-body text-muted">
          Nemokama diagnostika parodo, kurioje klasėje vaikui iš tikrųjų nutrūko matematika — ir
          kiek laiko užtrunka tai sutaisyti.
        </p>

        {/* Signature trupmena — produkto tezė, ne dekoracija (5.3) */}
        <div className="mt-14 md:mt-16">
          <Trupmena
            dydis="hero"
            bruksnys="orange"
            animuotas
            skaitiklis={
              <span className="t-body text-muted md:text-xl">dvejetas 7 klasėje</span>
            }
            vardiklis={
              <span className="font-display text-2xl font-semibold tracking-[-0.02em] md:text-4xl">
                bendravardiklinimas, 5 klasė
              </span>
            }
          />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Mygtukas href="/testas" dydis="didelis">
            Pradėti diagnostiką
          </Mygtukas>
          <Mygtukas href="#kaip-veikia" variantas="tekstinis" dydis="didelis">
            Kaip tai veikia
          </Mygtukas>
        </div>

        <p className="mt-5 t-small text-muted">Trunka apie 15 minučių. Registruotis nereikia.</p>
      </section>

      {/* Kodėl kartoti tą pačią temą nepadeda */}
      <section className="border-y border-line bg-paper-2">
        <div className="turinys sekcija">
          <Antraste lygis={2} dydis="display-l">
            Kodėl kartoti tą pačią temą nepadeda
          </Antraste>

          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {priezastys.map((p) => (
              <li
                key={p.antraste}
                className="rounded-[8px] border border-line bg-paper p-6 md:p-7"
              >
                <h3 className="t-h3">{p.antraste}</h3>
                <p className="mt-3 t-body text-muted">{p.tekstas}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Kaip veikia diagnostika */}
      <section id="kaip-veikia" className="scroll-mt-20">
        <div className="turinys sekcija">
          <Antraste lygis={2} dydis="display-l" suSkirtuku>
            Kaip veikia diagnostika
          </Antraste>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-[8px] border border-line bg-line md:grid-cols-4">
            {zingsniai.map((z, i) => (
              <li key={z} className="bg-paper p-6 md:p-7">
                <span className="font-mono text-xl font-semibold tabular-nums" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 t-body">{z}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Ką gausite ataskaitoje */}
      <section className="border-y border-line bg-paper-2">
        <div className="turinys sekcija">
          <Antraste lygis={2} dydis="display-l">
            Ką gausite ataskaitoje
          </Antraste>

          <ul className="mt-12 flex flex-col gap-8">
            {ataskaitosDalys.map((d) => (
              <li key={d.antraste} className="md:grid md:grid-cols-[16rem_1fr] md:gap-10">
                <h3 className="t-h3">{d.antraste}</h3>
                <p className="mt-3 border-l-2 border-orange pl-5 t-body md:mt-0">
                  „{d.pavyzdys}“
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Modesta */}
      <section>
        <div className="turinys sekcija">
          <BruksnysDivider className="mb-12" />
          <div className="md:grid md:grid-cols-[1fr_1fr] md:items-start md:gap-16">
            <Antraste lygis={2} dydis="display-l">
              Kas yra Modesta
            </Antraste>

            <div className="mt-8 md:mt-0">
              <p className="tekstas t-body text-muted">
                Modesta — matematikos korepetitorė, dirbanti su 1–10 klasių mokiniais. Prie kiekvieno
                vaiko ji pradeda ne nuo šios savaitės temos, o nuo klausimo, kurioje vietoje
                grandinė nutrūko. Diagnostika, kurią matote šioje svetainėje, yra tas pats metodas,
                kurį ji taiko pirmoje pamokoje.
              </p>
              <p className="mt-6">
                <Link
                  href="/apie"
                  className="t-body font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
                >
                  Plačiau apie Modestą ir metodiką
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Baigiamasis CTA */}
      <section className="border-t border-line bg-paper-2">
        <div className="turinys sekcija">
          <h2 className="display-l max-w-[22ch]">
            Pradėkite nuo to, kad sužinosite, kur iš tikrųjų problema.
          </h2>
          <div className="mt-10">
            <Mygtukas href="/testas" dydis="didelis">
              Pradėti diagnostiką
            </Mygtukas>
          </div>
          <p className="mt-5 t-small text-muted">
            Nemokama. Trunka apie 15 minučių. Registruotis nereikia.
          </p>
        </div>
      </section>
    </>
  )
}
