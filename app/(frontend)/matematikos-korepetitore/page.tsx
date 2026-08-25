import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import modestaNuotrauka from '@/public/Modesta.jpg'
import Antraste from '@/components/Antraste'
import Atsiliepimai from '@/components/Atsiliepimai'
import BruksnysDivider from '@/components/BruksnysDivider'
import JsonLd from '@/components/JsonLd'
import Mygtukas from '@/components/Mygtukas'
import RegistracijosForma from '@/components/RegistracijosForma'
import Trupmena from '@/components/Trupmena'
import { temos } from '@/lib/diagnostikos-temos'
import { kainos, kontaktai, nuolaidaPirmajai, svetaine } from '@/lib/kontaktai'
import { PATIKRINIMAI } from '@/lib/patikrinimai'

// `absolute` — antraštę nurodė užsakovė, tad `layout.tsx` šablono
// („%s — Vardiklis") čia netaikom.
export const metadata: Metadata = {
  title: { absolute: 'Matematikos korepetitorė internetu | 1-10 klasė | Vardiklis' },
  description:
    'Matematikos korepetitorė internetu 1–10 klasių mokiniams: individualios ir grupinės pamokos, pasiruošimas NMPP ir PUPP. Pamoka pradedama nuo diagnostikos — nuo spragos, o ne nuo šios savaitės temos.',
  alternates: { canonical: '/matematikos-korepetitore' },
  openGraph: {
    title: 'Matematikos korepetitorė internetu 1–10 klasėms — Vardiklis',
    description:
      'Individualios ir grupinės pamokos nuotoliu, pasiruošimas NMPP ir PUPP. Kaina, metodika ir registracija.',
  },
}

const pamokuTipai = [
  {
    id: 'individualios',
    antraste: 'Individualios pamokos',
    tekstas:
      'Vienas mokinys, visas dėmesys jam. Tempas ir turinys derinami prie to, ką parodė diagnostika — jei reikia, pamokos skiriamos spragoms užpildyti, o ne einamoms mokyklos temoms.',
    punktai: [
      'Visa pamoka — vienam mokiniui',
      'Planas sudaromas pagal rastas spragas',
      'Namų darbai ir kontrolinių pasiruošimas',
    ],
  },
  {
    id: 'grupines',
    antraste: 'Grupinės pamokos',
    tekstas:
      'Iki 3 mokinių, panašaus lygio ir tos pačios klasės. Pigiau nei individualiai, o vaikus labai motyvuoja darbas kartu – juk kur kas drąsiau užduoti klausimus, kai mokaisi ne vienas.',
    punktai: ['Iki 3 mokinių grupėje', 'Ta pati klasė', 'Mažesnė kaina vienam mokiniui'],
  },
]

const pakopos = [
  {
    klases: '1–4 klasė',
    tekstas:
      'Skaičiavimas, daugybos lentelė, tekstiniai uždaviniai, matavimo vienetai. Pradinėse klasėse pagrindinė problema dažnai yra ne žinių trūkumas, o nepakankamas jų įtvirtinimas. Jei skaičiavimo įgūdžiai formuojasi per lėtai, vaikui darosi sunku suspėti perprasti naujas, sudėtingesnes temas.',
  },
  {
    klases: '5–6 klasė',
    tekstas:
      'Trupmenos, dešimtainiai skaičiai, procentai, veiksmų tvarka. Tai kritinis etapas, kuriame dažniausiai atsiranda pirmosios žinių spragos, išryškėjančios tik po kelerių metų. Būtent todėl prie šių temų kartojimo nuolat sugrįžtame ir dirbdami su vyresniais mokiniais.',
  },
  {
    klases: '7–8 klasė',
    tekstas:
      'Reiškiniai su raidėmis, lygtys, laipsniai, plotai ir tūriai, Pitagoro teorema. Šiame etape prasidėjusi algebra reikalauja ypač tvirtų aritmetikos pagrindų. Jei jų trūksta, greitai išryškėja ankstesnėse klasėse atsiradusios spragos, kurias mes padedame ištaisyti.',
  },
  {
    klases: '9–10 klasė',
    tekstas:
      'Kvadratinės lygtys ir nelygybės, funkcijos, trigonometrija, statistika. Šalia einamųjų temų vyksta ir intensyvus pasiruošimas PUPP: sprendžiame pilnus egzaminų variantus, mokomės planuoti laiką ir strategiškai vertinti užduočių taškus.',
  },
]

/**
 * NMPP ir PUPP aprašymai ŠIAM puslapiui.
 *
 * `lib/patikrinimai.ts` `ivadas[0]` sako tą patį, bet kitais žodžiais, ir jį
 * naudoja `/egzaminai` puslapiai. Laikom atskirai, kad perrašius tekstą čia
 * nepersirašytų ir tie trys puslapiai.
 */
const APRASYMAI: Record<'nmpp' | 'pupp', string> = {
  nmpp:
    'NMPP nėra įprastas egzaminas – tai diagnostinis įrankis. Jo tikslas yra padėti mokiniui, tėvams ir mokytojams pamatyti, kurios žinios yra tvirtos, o kurias sritis dar reikėtų tobulinti. Šio patikrinimo rezultatai neturi įtakos perėjimui į aukštesnę klasę ir nėra įskaičiuojami į metinį įvertinimą.',
  pupp:
    'PUPP laikomas baigiant pagrindinio ugdymo programą, 10-oje (II gimnazijos) klasėje. Skirtingai nei NMPP, tai yra oficialus žinių patikrinimas, kurio įvertinimas įrašomas į mokinio pasiekimų pažymėjimą.',
}

const pamokosEiga = [
  {
    antraste: 'Prieš pirmą pamoką',
    tekstas:
      'Trumpai susirašom: kelinta klasė, kas konkrečiai nesiseka, ar artėja kontrolinis. Jei jau atlikta nemokama diagnostika — atsinešate ataskaitą ir pamoka prasideda nuo konkretaus taško.',
  },
  {
    antraste: 'Pirmoji pamoka',
    tekstas:
      'Ne nuo šios savaitės temos, o nuo klausimo, kurioje vietoje grandinė nutrūko. Kelios patikros atgal parodo, kur žinios dar tvirtos — nuo tos vietos ir pradedam.',
  },
  {
    antraste: 'Kaip atrodo pamoka',
    tekstas:
      'Nuotoliu, vaizdo skambučiu su bendra lenta. Mokinys sprendžia pats, aš matau kiekvieną žingsnį ir stabdau ten, kur klaida atsiranda, o ne tada, kai atsakymas jau neteisingas.',
  },
  {
    antraste: 'Po pamokos',
    tekstas:
      'Užduotys įtvirtinimui ir trumpa žinutė tėvams: ką padarėm, kas dar strigo, ką kartoti iki kito karto.',
  },
]

export default function MatematikosKorepetitore() {
  // Grandinė iš tikrųjų egzistuoja duomenyse: 7.4 remiasi į 6.8, 6.8 — į 5.5,
  // o 5.5 — į 5.3. Todėl pavyzdys puslapyje ir diagnostikos elgesys sutampa.
  // Rikiuojam ir pagal `numeris`: dvi tos pačios klasės temos kitaip liktų
  // masyvo tvarka, ir „Dalumas" (5.3) atsistotų VIRŠ „Veiksmų su trupmenomis"
  // (5.5), nors kaip tik trupmenos remiasi į dalumą, o ne atvirkščiai.
  const pavyzdys = temos
    .filter((t) => ['7.4', '6.8', '5.5', '5.3'].includes(t.id))
    .sort((a, b) => b.klase - a.klase || b.numeris - a.numeris)

  return (
    <div className="turinys sekcija">
      <JsonLd />

      <Antraste
        lygis={1}
        dydis="display-l"
        paantraste="Individualios ir grupinės pamokos nuotoliu, pasiruošimas NMPP ir PUPP."
      >
        Matematikos korepetitorė internetu 1-10 klasėms
      </Antraste>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Mygtukas href="#registracija" dydis="didelis">
          Registruotis pamokai
        </Mygtukas>
        <Mygtukas href="/testas" variantas="konturas" dydis="didelis">
          Nemokama diagnostika
        </Mygtukas>
      </div>

      {/* Trumpas turinys — puslapis ilgas, o žmonės ateina su vienu klausimu:
          arba „kiek kainuoja", arba „ar ruošiat PUPP". */}
      <nav aria-label="Puslapio turinys" className="mt-12">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {[
            ['#apie-mane', 'Apie mane'],
            ['#pamokos', 'Pamokos'],
            ['#klases', '1–10 klasė'],
            ['#egzaminai', 'NMPP ir PUPP'],
            ['#eiga', 'Kaip vyksta pamoka'],
            ['#metodas', 'Diagnostikos metodas'],
            ['#kaina', 'Kaina'],
            ['#atsiliepimai', 'Atsiliepimai'],
            ['#registracija', 'Registracija'],
          ].map(([nuoroda, tekstas]) => (
            <li key={nuoroda}>
              <Link href={nuoroda} className="t-small text-muted hover:text-orange">
                {tekstas}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Apie mane ──────────────────────────────────────────────────────── */}
      <section id="apie-mane" className="mt-24 scroll-mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="display-l max-w-[20ch]">Apie mane</h2>

        <div className="mt-10 md:grid md:grid-cols-[18rem_1fr] md:gap-14">
          <div>
            <Image
              src={modestaNuotrauka}
              alt="Modesta, matematikos korepetitorė"
              className="w-full rounded-[8px] border border-line"
              sizes="(min-width: 768px) 18rem, 100vw"
              placeholder="blur"
            />
          </div>

          <div className="mt-8 md:mt-0">
            <h3 className="t-h2">{kontaktai.vardas}</h3>
            <div className="tekstas mt-4 flex flex-col gap-4 t-body text-muted">
              <p>
                Matematikos korepetitorė, dirbanti su 1–10 klasių mokiniais Lietuvoje.
                Individualiai ir nuotoliu.
              </p>
              <p>
                Pirma pamoka su nauju mokiniu beveik niekada neprasideda nuo tos temos, dėl kurios
                tėvai paskambino. Ji prasideda nuo klausimo, kurioje vietoje grandinė nutrūko —
                nes septintos klasės dvejetas beveik visada turi penktos klasės priežastį.
              </p>
              <p>
                Diagnostika šioje svetainėje yra tas pats metodas, tik automatizuotas ir nemokamas.
                Žemėlapis, kuriuo ji vaikšto, nėra užšaldytas — pildau ir tikslinu jį pagal tai, ką
                matau dirbdama su mokiniais.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Mygtukas href={`mailto:${kontaktai.elPastas}`}>Parašyk man!</Mygtukas>
              <Mygtukas href={`tel:${kontaktai.telefonasNuoroda}`} variantas="konturas">
                {kontaktai.telefonas}
              </Mygtukas>
            </div>
          </div>
        </div>

        {/* ── Vardas ─────────────────────────────────────────────────────── */}
        <h3 className="t-h2 mt-16">Kodėl „{svetaine.pavadinimas}“</h3>

        <div className="mt-8">
          <Trupmena
            dydis="hero"
            bruksnys="orange"
            skaitiklis={<span className="t-body text-muted">tai, ką matote</span>}
            vardiklis={
              <span className="font-display text-xl font-semibold tracking-[-0.01em] md:text-2xl">
                tai, kas paslėpta
              </span>
            }
          />
        </div>

        <div className="tekstas mt-10 flex flex-col gap-5 t-body text-muted">
          <p>
            Lotyniškas žodis <em>denominare</em> reiškia „įvardyti“. Iš jo kilęs
            <em> denominator</em> — vardiklis. Vardiklis yra tas, kuris pasako, <em>kokios</em>{' '}
            dalys: ar tai trečdaliai, ar dešimtosios.
          </p>
          <p>
            Tą patį daro diagnostika. Ji neduoda pažymio ir nesako, kad vaikas silpnas — ji
            įvardija, kas konkrečiai sugedę ir kurioje klasėje. Ir, kaip trupmenoje, tikroji
            atsakymo dalis yra po brūkšniu.
          </p>
        </div>
      </section>

      {/* ── Pamokų tipai ───────────────────────────────────────────────────── */}
      <section id="pamokos" className="mt-24 scroll-mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="display-l max-w-[20ch]">Individualios ir grupinės pamokos</h2>

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {pamokuTipai.map((p) => (
            <li key={p.id} className="rounded-[8px] border border-line bg-paper-2 p-6 md:p-8">
              <h3 className="t-h2">{p.antraste}</h3>
              <p className="mt-4 t-body text-muted">{p.tekstas}</p>
              <ul className="mt-6 flex flex-col gap-2">
                {p.punktai.map((punktas) => (
                  <li key={punktas} className="border-t border-line pt-2 t-small">
                    {punktas}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="tekstas mt-6 t-small text-muted">
          Kainos —{' '}
          <Link
            href="#kaina"
            className="underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
          >
            skiltyje „Kaina“
          </Link>
          .
        </p>
      </section>

      {/* ── 1–10 klasė ─────────────────────────────────────────────────────── */}
      <section id="klases" className="mt-24 scroll-mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="display-l max-w-[20ch]">Su kuo dirbama 1–10 klasėje</h2>

        <p className="tekstas mt-8 t-body text-muted">
          Visų dešimties klasių matematika – tai viena nuosekli grandinė, o ne atskiros programos.
          Todėl mokantis su devintokais neretai tenka sugrįžti prie penktos klasės temų. Tai nėra
          žingsnis atgal: be tvirto pagrindo sudėtingesnės naujos žinios tiesiog neužsifiksuos.
        </p>

        <ul className="mt-10 flex flex-col gap-8">
          {pakopos.map((p) => (
            <li key={p.klases} className="md:grid md:grid-cols-[10rem_1fr] md:gap-10">
              <h3 className="t-h3">{p.klases}</h3>
              <p className="mt-2 border-l-2 border-orange pl-5 t-body text-muted md:mt-0">
                {p.tekstas}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── NMPP ir PUPP ───────────────────────────────────────────────────── */}
      <section id="egzaminai" className="mt-24 scroll-mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="display-l max-w-[20ch]">Pasiruošimas NMPP ir PUPP</h2>

        <p className="tekstas mt-8 t-body text-muted">
          Pasiruošimas patikrinimui yra kur kas daugiau nei vien išeitų temų kartojimas. Neužtenka
          tik suprasti matematiką – svarbu gebėti užduotis atlikti laiku, taisyklingai užrašyti
          sprendimo eigą ir neprarasti vertingų taškų ten, kur jie skiriami už patį procesą. Būtent
          todėl pamokose sprendžiame pilnus egzaminų variantus, mokomės valdyti laiką ir detaliai
          analizuojame vertinimo schemas.
        </p>

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {PATIKRINIMAI.map((p) => (
            <li key={p.grupe}>
              <Link
                href={`/egzaminai/${p.grupe}`}
                className="flex h-full flex-col rounded-[8px] border border-line bg-paper-2 p-6 transition-colors hover:border-ink md:p-8"
              >
                <span className="font-mono t-small text-muted">{p.trumpai}</span>
                <h3 className="mt-2 t-h2">{p.pilnas}</h3>
                <p className="mt-3 t-body text-muted">{APRASYMAI[p.grupe]}</p>
                <span className="mt-6 t-small font-semibold underline decoration-orange decoration-2 underline-offset-4">
                  Nemokamos pasiruošimo užduotys
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Kaip vyksta pamoka ─────────────────────────────────────────────── */}
      <section id="eiga" className="mt-24 scroll-mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="display-l max-w-[20ch]">Kaip vyksta pamoka</h2>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-[8px] border border-line bg-line md:grid-cols-2">
          {pamokosEiga.map((z, i) => (
            <li key={z.antraste} className="bg-paper p-6 md:p-8">
              <span className="font-mono text-xl font-semibold tabular-nums" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 t-h3">{z.antraste}</h3>
              <p className="mt-2 t-body text-muted">{z.tekstas}</p>
            </li>
          ))}
        </ol>

        <p className="tekstas mt-6 t-small text-muted">
          Pamokos trukmė — {kainos[0].trukmeMin} min. {kontaktai.vietove}.
        </p>
      </section>

      {/* ── Diagnostikos metodas ───────────────────────────────────────────── */}
      <section id="metodas" className="mt-24 scroll-mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="display-l max-w-[20ch]">Diagnostikos metodas</h2>

        <div className="tekstas mt-8 flex flex-col gap-5 t-body text-muted">
          <p>
            Matematika nėra sąrašas temų, kurias galima mokytis bet kokia tvarka. Tai statinys,
            kur kiekvienas aukštas remiasi į žemesnį. Lygtis su trupmenomis reikalauja mokėti
            sudėti trupmenas. Sudėti trupmenas galima tik suvedus jas į bendrą vardiklį. O
            bendrą vardiklį rasti galima tik mokant dalumą.
          </p>
          <p>
            Kai vaikas gauna dvejetą iš lygčių, mokykla mato lygtis ir aiškina lygtis. Bet jei
            iš tikrųjų sugedęs yra bendravardiklinimas, tas aiškinimas krenta į tuštumą. Vaikas
            išmoksta atkartoti veiksmus, bet nesupranta, ir po dviejų savaičių viskas grįžta.
          </p>
          <p>
            Todėl kiekviena tema turi sąrašą temų, kurias reikia mokėti prieš ją. Sudėliojus visas
            temas pagal šiuos ryšius, gaunamas žemėlapis. Diagnostika juo vaikšto žemyn: neišlaikius
            temos, ji tikrina tai, kuo ta tema remiasi, ir taip tol, kol randa vietą, kur vaikas
            dar tvirtas. Nuo tos vietos ir prasideda mokymasis.
          </p>
        </div>

        <p className="tekstas mt-8 t-body text-muted">
          Pavyzdžiui, viena grandinės atkarpa atrodo taip — iš viršaus į apačią, nuo to, ką mato
          tėvai, iki to, kas iš tikrųjų sugedę:
        </p>

        <ol className="mt-8 max-w-xl">
          {pavyzdys.map((t, i) => (
            <li key={t.id}>
              <div className="flex items-baseline justify-between gap-4 px-4 py-4">
                <span className="t-body">{t.pavadinimas}</span>
                <span className="t-small text-muted">{t.klase} kl.</span>
              </div>
              {i < pavyzdys.length - 1 && <div className="h-px bg-line" aria-hidden="true" />}
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Mygtukas href="/testas" dydis="didelis">
            Atlikti nemokamą diagnostiką
          </Mygtukas>
          <p className="mt-4 t-small text-muted">
            Trunka apie 15 minučių. Registruotis nereikia, rezultatai niekur nesaugomi.
          </p>
        </div>
      </section>

      {/* ── Kaina ──────────────────────────────────────────────────────────── */}
      <section id="kaina" className="mt-24 scroll-mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="display-l max-w-[20ch]">Kaina</h2>

        <div className="mt-8 max-w-2xl rounded-[8px] border border-orange bg-orange-soft px-6 py-5">
          <p className="t-body font-semibold">
            {nuolaidaPirmajai} eurų nuolaida pirmajai pamokai
          </p>
          <p className="mt-2 t-small text-muted">
            Galioja abiem pamokų tipams:{' '}
            {kainos.map((k, i) => (
              <span key={k.id}>
                {i > 0 && ', '}
                {k.pavadinimas.toLowerCase()} — {k.eurai - nuolaidaPirmajai} € vietoje {k.eurai} €
              </span>
            ))}
            .
          </p>
        </div>

        <ul className="mt-8 max-w-2xl">
          {kainos.map((k, i) => (
            <li key={k.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-6">
                <span className="flex flex-col gap-1">
                  <span className="t-body font-semibold">{k.pavadinimas}</span>
                  <span className="t-small text-muted">{k.paaiskinimas}</span>
                </span>
                <span className="font-display text-xl font-semibold tracking-[-0.01em] whitespace-nowrap md:text-2xl">
                  {k.eurai} €
                  <span className="t-small font-normal text-muted"> / {k.trukmeMin} min</span>
                </span>
              </div>
              {i < kainos.length - 1 && <div className="h-px bg-line" aria-hidden="true" />}
            </li>
          ))}
        </ul>

        <p className="tekstas mt-6 t-small text-muted">
          Diagnostika svetainėje yra nemokama ir jos atlikimas nieko neįpareigoja.
        </p>
      </section>

      {/* ── Atsiliepimai ───────────────────────────────────────────────────── */}
      <Atsiliepimai className="mt-24 scroll-mt-24" />

      {/* ── Registracija ───────────────────────────────────────────────────── */}
      <section id="registracija" className="mt-24 scroll-mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="display-l max-w-[20ch]">Registracija į pamoką</h2>

        <p className="tekstas mt-8 t-body text-muted">
          Parašykite, kelintoje klasėje vaikas ir kas konkrečiai nesiseka — taip pirmas atsakymas
          bus konkretesnis už „susitarkim dėl pamokos“. Susisiekti galima ir tiesiogiai:{' '}
          <a
            href={`tel:${kontaktai.telefonasNuoroda}`}
            className="font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
          >
            {kontaktai.telefonas}
          </a>{' '}
          arba{' '}
          <a
            href={`mailto:${kontaktai.elPastas}`}
            className="font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
          >
            {kontaktai.elPastas}
          </a>
          .
        </p>

        <div className="max-w-2xl">
          <RegistracijosForma saltinis="Matematikos korepetitorė" />
        </div>
      </section>
    </div>
  )
}
