import Image from 'next/image'
import Link from 'next/link'
import modestaNuotrauka from '@/public/Modesta.jpg'
import heroNuotrauka from '@/public/heronew.avif'
import Antraste from '@/components/Antraste'
import Atsiliepimai from '@/components/Atsiliepimai'
import BruksnysDivider from '@/components/BruksnysDivider'
import JsonLd from '@/components/JsonLd'
import Mygtukas from '@/components/Mygtukas'
import { meta } from '@/lib/metaduomenys'
import Trupmena from '@/components/Trupmena'

/**
 * Pradinis taikosi į DIAGNOSTIKĄ, ne į „matematikos korepetitorę".
 *
 * Anksčiau ir šis, ir `/matematikos-korepetitore` taikėsi į tą pačią frazę,
 * todėl Google negalėdavo apsispręsti, kurį rodyti, ir nukentėdavo abu. Kadangi
 * `/matematikos-korepetitore` turi kur kas daugiau turinio apie pamokas
 * (kainos, metodika, atsiliepimai, registracija), korepetitorės užklausos
 * paliktos jam, o pradinis paimtas unikaliam dalykui, kurio neturi nė vienas
 * konkurentas — spragos paieškai. Keičiant čia antraštę bendrinti su tuo
 * puslapiu nebeverta: tada konkurencija tarp savų puslapių grįžtų.
 */
export const metadata = meta({
  // 42 ženklai. Ties ~60 Google antraštę nukerpa, o nukirsta antraštė paieškoje
  // atrodo kaip klaida — likusi mintis perkelta į aprašymą.
  pilna: 'Matematikos spragos 1–10 klasei | Vardiklis',
  aprasymas:
    'Nemokamas testas 1–10 klasių mokiniams parodo, kurioje klasėje pradėjo formuotis matematikos spragos — ir kiek laiko prireiks jas pašalinti. Be registracijos, apie 15 minučių.',
  kelias: '/',
  ogAprasymas:
    'Nemokama diagnostika parodo, kurioje klasėje vaikui iš tikrųjų nutrūko matematika. Trunka apie 15 minučių.',
})

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

/**
 * Apatinė hero juosta. Pozicijos surašytos ranka, o ne generuojamos:
 * `Math.random()` serveryje ir naršyklėje duotų skirtingus kampus, ir React
 * skųstųsi hidratacijos neatitikimu. Reikšmės: k — kairė (%), a — apačia (px,
 * neigiama reiškia, kad ženklas nurėžtas sekcijos krašto), p — posūkis (°),
 * d — dydis (em nuo juostos), r — ryškumas, o — oranžinis vietoj rašalo,
 * w — rodomas tik nuo planšetės (telefone ženklai suliptų).
 */
const dekoras = [
  { z: '+', k: 2, a: 26, p: -16, d: 1.6, r: 0.22 },
  { z: '7', k: 7, a: -10, p: 12, d: 2.8, r: 0.14 },
  { z: '×', k: 12, a: 34, p: 24, d: 2.1, r: 0.26, o: true, w: true },
  { z: '√', k: 17, a: 4, p: -8, d: 2.6, r: 0.18 },
  { z: '=', k: 23, a: 40, p: 18, d: 1.5, r: 0.21, w: true },
  { z: '12', k: 27, a: -6, p: -14, d: 2.2, r: 0.15 },
  { z: '÷', k: 34, a: 30, p: 8, d: 1.9, r: 0.24, w: true },
  { z: '6', k: 39, a: 2, p: 22, d: 2.4, r: 0.17 },
  { z: '3', k: 44, a: 38, p: -22, d: 1.7, r: 0.24, o: true, w: true },
  { z: '+', k: 49, a: -12, p: 14, d: 2.9, r: 0.14 },
  { z: '%', k: 55, a: 28, p: -6, d: 1.8, r: 0.21, w: true },
  { z: '√', k: 60, a: 6, p: 20, d: 2.3, r: 0.17 },
  { z: '45', k: 65, a: 36, p: -18, d: 1.6, r: 0.2, w: true },
  { z: '×', k: 71, a: -8, p: 10, d: 2.7, r: 0.16, o: true },
  { z: '=', k: 76, a: 32, p: 26, d: 1.7, r: 0.22, w: true },
  { z: '8', k: 81, a: 0, p: -12, d: 2.5, r: 0.17 },
  { z: '÷', k: 87, a: 30, p: 16, d: 2, r: 0.24, w: true },
  { z: '9', k: 92, a: -10, p: -20, d: 2.6, r: 0.14 },
  { z: '+', k: 97, a: 24, p: 6, d: 1.7, r: 0.21, w: true },
]

export default function Pradzia() {
  return (
    <>
      <JsonLd />

      {/* Hero */}
      <section className="hero-fonas">
        <div className="hero-dekoras" aria-hidden="true">
          {dekoras.map((d) => (
            <span
              key={`${d.z}-${d.k}`}
              className={d.w ? 'hero-dekoras__platus' : undefined}
              style={{
                left: `${d.k}%`,
                bottom: `${d.a}px`,
                fontSize: `${d.d}em`,
                transform: `rotate(${d.p}deg)`,
                color: d.o ? 'var(--orange)' : 'var(--ink)',
                opacity: d.r,
              }}
            >
              {d.z}
            </span>
          ))}
        </div>

        <div className="turinys relative pt-14 pb-24 md:pt-20 md:pb-32">
          <div className="hero-tekstas">
            {/* H1 apie diagnostiką, ne apie korepetitorę — kitaip jis vėl konkuruotų
                su `/matematikos-korepetitore`. Žr. `metadata` komentarą aukščiau. */}
            <h1 className="display-xl max-w-[16ch] md:max-w-none">
              Matematikos diagnostika 1 – 10 klasių mokiniams
            </h1>
          </div>

          {/* Vieta sraute — tarp H1 ir šūkio: mobiliajame nuotrauka plaukioja
              dešinėje ir šūkis ją apgaubia, todėl ji privalo eiti PRIEŠ tą
              tekstą, kurį nori paveikti. Nuo `md` CSS ją iškelia absoliučiai į
              dešinį kraštą ir sraute vietos nebelieka. Vienas <img>, ne du
              variantai: antras su `hidden` vis tiek būtų parsiųstas. */}
          <div className="hero-foto" aria-hidden="true">
            <div className="hero-foto__silueta">
              <Image
                src={heroNuotrauka}
                alt=""
                // Next iš šio AVIF matmenų neperskaito ir statiniam importui
                // prikiša atsarginius — todėl tikri duodami ranka. Jie privalo
                // atitikti failą: `h-auto` aukštį skaičiuoja iš tikros
                // nuotraukos, o vietą iš anksto rezervuoja pagal ŠIUOS skaičius,
                // tad neatitikimas duotų šuolį (CLS) pasibaigus krovimui.
                width={1024}
                height={1024}
                // Hero nuotrauka yra LCP kandidatė — be `priority` Next jos
                // nepreloadintų ir ji atkeliautų po pirmo piešimo. `priority`
                // vienas `fetchpriority="high"` ant preload'o NEUŽDEDA — jį
                // reikia perduoti atskirai, kitaip užklausa startuoja bendroje
                // eilėje su viskuo kitu.
                priority
                fetchPriority="high"
                // Be `placeholder` sąmoningai: Next'o blur'as permatomą sritį
                // užpildo `feFlood` dėme, ir po iškirpta figūra atsirastų
                // blyški plėmė. `priority` nuotrauką preloadina, tad užpildo
                // vis tiek nebereikia.
                //
                // Konteineris niekada neplatesnis nei 68rem, todėl virš to
                // procentai tik priverstų siųsti per didelį failą.
                sizes="(min-width: 1088px) 460px, (min-width: 768px) 40vw, calc(56vw - 22.4px)"
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="hero-tekstas">
            {/* Ne antraštė, o šūkis: `display-l` duoda dydį, bet hierarchijos
                nekuria — h2 čia atimtų svorį iš tikrųjų sekcijų antraščių. */}
            {/* Mobiliajame nei pločio ribos, nei `text-balance` — abu neleistų
                tekstui išnaudoti viso ploto virš galvos ir apgaubimas
                nesusidarytų. Nuo `md` nuotrauka jau ne sraute, tad grįžta. */}
            <p className="display-l mt-6 md:max-w-[26ch] md:text-balance">
              Šiandienos dvejetas gali būti nepašalinta spraga prieš dvejus metus.
            </p>

            <p className="tekstas mt-7 t-body text-muted">
              Nemokama diagnostika parodo, kurioje klasėje pradėjo formuotis matematikos spragos — ir
              kiek laiko prireiks jas pašalinti
            </p>

            {/* Signature trupmena — produkto tezė, ne dekoracija (5.3) */}
            <div className="hero-nuo-naujo mt-14 md:mt-16">
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
          </div>
        </div>
      </section>

      {/* Kodėl kartoti tą pačią temą nepadeda */}
      {/* Viršutinio rėmelio nebėra: per jį varva hero dažai, ir linija po
          lašais atrodytų kaip klaida. */}
      <section className="border-b border-line bg-paper-2">
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
                  {d.pavyzdys}
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
                  href="/matematikos-korepetitore"
                  className="t-body font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
                >
                  Plačiau apie mane ir metodiką
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Atsiliepimai */}
      <section>
        <div className="turinys sekcija pt-0">
          <Atsiliepimai />
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
