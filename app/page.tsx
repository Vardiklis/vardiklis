import Image from 'next/image'
import Link from 'next/link'
import modestaNuotrauka from '@/public/Modesta.jpg'
import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import JsonLd from '@/components/JsonLd'
import Mygtukas from '@/components/Mygtukas'
import Trupmena from '@/components/Trupmena'

const priezastys = [
  {
    antraste: 'Pažymys parodo tik pasekmę',
    tekstas:
      'Kontroliniame – dvejetas. Tačiau dar kartą paaiškinti tą pačią temą ne visada pakanka, nes sunkumą gali lemti anksčiau likusi žinių spraga.',
  },
  {
    antraste: 'Matematika sluoksniuota',
    tekstas:
      'Kiekviena nauja tema remiasi tuo, kas išmokta anksčiau. Jei vienas pagrindas neįtvirtintas, vėliau gali pradėti strigti kelios skirtingos temos.',
  },
  {
    antraste: 'Diagnostika randa pradžios tašką',
    tekstas:
      'Testas grįžta prie ankstesnių temų ir nustato, kur žinios dar tvirtos, o kur atsirado pirmoji spraga. Nuo tos vietos pradedamas mokymasis.',
  },
]

const zingsniai = [
  'Nurodote vaiko klasę',
  'Vaikas sprendžia testą — testas prisitaiko prie atsakymų',
  'Aptikęs spragą, testas grįžta prie ankstesnių temų ir ieško jos pradžios',
  'Gaunate ataskaitą: kur atsirado spraga, ką ji veikia, ir kiek laiko reikės ją užpildyti',
]

const ataskaitosDalys = [
  {
    antraste: 'Kur yra spraga',
    pavyzdys: 'Vaikui sunku laikytis veiksmų atlikimo tvarkos ir teisingai atlikti veiksmus su skliaustais. Ši spraga siekia 5 klasės temas.',
  },
  {
    antraste: 'Kur ji trukdo',
    pavyzdys:
      'Dėl to kyla sunkumų skaičiuojant reiškinius ir sprendžiant lygtis 7 klasėje.',
  },
  {
    antraste: 'Rekomenduojamas mokymosi planas',
    pavyzdys: 'Numatomas laikas spragai užpildyti – apie 6 savaites, mokantis kartą per savaitę.',
  },
]

export default function Pradzia() {
  return (
    <>
      <JsonLd />

      {/* Hero */}
      <section className="turinys pt-16 pb-20 md:pt-24 md:pb-28">
        <h1 className="display-xl max-w-[15ch]">
          Šiandienos dvejetas – nepašalinta spraga prieš dvejus metus.
          </h1>
        <p className="tekstas mt-7 t-body text-muted">
           Nemokama diagnostika parodo, kurioje klasėje pradėjo formuotis matematikos spragos — ir kiek laiko prireiks jas pašalinti
        </p>

        {/* Signature trupmena — produkto tezė, ne dekoracija (5.3) */}
        <div className="mt-14 md:mt-16">
          <Trupmena
            dydis="hero"
            bruksnys="orange"
            animuotas
            skaitiklis={
              <span className="t-body text-muted md:text-xl">Sunkumai skaičiuojant plotą ir tūrį 7 klasėje</span>
            }
            vardiklis={
              <span className="font-display text-2xl font-semibold tracking-[-0.02em] md:text-4xl">
                 Neįtvirtintas matavimo vienetų keitimas 5 klasėje
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
            <div>
              <Antraste lygis={2} dydis="display-l">
                Apie mane
              </Antraste>

              <Image
                src={modestaNuotrauka}
                alt="Modesta, matematikos korepetitorė"
                className="mt-8 w-full max-w-xs rounded-[8px] border border-line"
                sizes="(min-width: 768px) 20rem, 100vw"
                placeholder="blur"
              />
            </div>

            <div className="mt-8 md:mt-0">
              <p className="tekstas t-body text-muted">
                Aš esu Modesta — matematikos korepetitorė, dirbanti su 1–10 klasių mokiniais. Prie kiekvieno
                vaiko pradedu ne nuo šios savaitės temos, o nuo klausimo, kurioje vietoje
                grandinė nutrūko. Diagnostika, kurią matote šioje svetainėje, yra tas pats metodas,
                kurį taikau pirmoje pamokoje.
              </p>
              <p className="mt-6">
                <Link
                  href="/apie"
                  className="t-body font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
                >
                  Plačiau apie mane ir metodiką
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
