import type { Metadata } from 'next'
import Image from 'next/image'
import modestaNuotrauka from '@/public/Modesta.jpg'
import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import Mygtukas from '@/components/Mygtukas'
import Trupmena from '@/components/Trupmena'
import { kontaktai, svetaine } from '@/lib/kontaktai'
import { temos } from '@/lib/temos'

export const metadata: Metadata = {
  title: 'Apie Modestą ir metodiką',
  description:
    'Matematikos korepetitorė Modesta dirba su 1–10 klasių mokiniais. Kaip veikia prielaidų grafas ir kodėl spragos ieškoma atgal, o ne kartojama ta pati tema.',
  openGraph: {
    title: 'Apie Modestą ir metodiką — Vardiklis',
    description:
      'Kodėl spragos ieškoma atgal, o ne kartojama ta pati tema. Metodika paprastais žodžiais.',
  },
}

export default function Apie() {
  const pavyzdys = temos.filter((t) =>
    ['tiesines-lygtys', 'trupmenu-sudetis', 'bendravardiklinimas', 'dalumas'].includes(t.id),
  )

  return (
    <div className="turinys sekcija">
      <Antraste lygis={1} dydis="display-l">
        Apie
      </Antraste>

      {/* ── Modesta ────────────────────────────────────────────────────────── */}
      <section className="mt-14 md:grid md:grid-cols-[18rem_1fr] md:gap-14">
        <div>
          <Image
            src={modestaNuotrauka}
            alt="Modesta, matematikos korepetitorė"
            className="w-full rounded-[8px] border border-line"
            sizes="(min-width: 768px) 18rem, 100vw"
            placeholder="blur"
            priority
          />
        </div>

        <div className="mt-8 md:mt-0">
          <h2 className="t-h2">Modesta</h2>
          <div className="tekstas mt-4 flex flex-col gap-4 t-body text-muted">
            <p>
              Matematikos korepetitorė, dirbanti su 1–10 klasių mokiniais Lietuvoje. Individualiai
              ir nuotoliu.
            </p>
            <p>
              Pirma pamoka su nauju mokiniu beveik niekada neprasideda nuo tos temos, dėl kurios
              tėvai paskambino. Ji prasideda nuo klausimo, kurioje vietoje grandinė nutrūko —
              nes septintos klasės dvejetas beveik visada turi penktos klasės priežastį.
            </p>
            <p>
              Diagnostika šioje svetainėje yra tas pats metodas, tik automatizuotas ir nemokamas.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Mygtukas href={`mailto:${kontaktai.elPastas}`}>Parašyti Modestai</Mygtukas>
            <Mygtukas href="/testas" variantas="konturas">
              Pradėti diagnostiką
            </Mygtukas>
          </div>
        </div>
      </section>

      {/* ── Metodika ───────────────────────────────────────────────────────── */}
      <section className="mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="display-l max-w-[20ch]">Kodėl kartoti tą pačią temą nepadeda</h2>

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
            Todėl taisyti reikia pradėti ne nuo to, ką matai, o nuo to, kas po tuo yra.
          </p>
        </div>
      </section>

      {/* ── Prielaidų grafas ───────────────────────────────────────────────── */}
      <section className="mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="display-l max-w-[20ch]">Kas yra prielaidų grandinė</h2>

        <p className="tekstas mt-8 t-body text-muted">
          Kiekviena tema turi sąrašą temų, kurias reikia mokėti prieš ją. Sudėliojus visas temas
          pagal šiuos ryšius, gaunamas žemėlapis. Diagnostika juo vaikšto žemyn: neišlaikius
          temos, ji tikrina tai, kuo ta tema remiasi, ir taip tol, kol randa vietą, kur vaikas
          dar tvirtas.
        </p>

        <p className="tekstas mt-5 t-body text-muted">
          Pavyzdžiui, viena grandinės atkarpa atrodo taip — iš viršaus į apačią, nuo to, ką mato
          tėvai, iki to, kas iš tikrųjų sugedę:
        </p>

        <ol className="mt-8 max-w-xl">
          {pavyzdys
            .sort((a, b) => b.klase - a.klase)
            .map((t, i, masyvas) => (
              <li key={t.id}>
                <div className="flex items-baseline justify-between gap-4 px-4 py-4">
                  <span className="t-body">{t.pavadinimas}</span>
                  <span className="t-small text-muted">{t.klase} kl.</span>
                </div>
                {i < masyvas.length - 1 && (
                  <div className="h-px bg-line" aria-hidden="true" />
                )}
              </li>
            ))}
        </ol>

        <p className="tekstas mt-8 t-body text-muted">
          Šis žemėlapis nėra užšaldytas. Modesta jį pildo ir tikslina pagal tai, ką mato dirbdama
          su mokiniais.
        </p>
      </section>

      {/* ── Vardas ─────────────────────────────────────────────────────────── */}
      <section className="mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="display-l max-w-[20ch]">Kodėl „{svetaine.pavadinimas}“</h2>

        <div className="mt-10">
          <Trupmena
            dydis="hero"
            bruksnys="orange"
            skaitiklis={<span className="t-body text-muted">tai, ką matote</span>}
            vardiklis={
              <span className="font-display text-xl font-semibold tracking-[-0.01em] md:text-2xl">
                tai, kas po tuo
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

      {/* ── Kontaktai ──────────────────────────────────────────────────────── */}
      <section className="mt-24">
        <BruksnysDivider className="mb-8" />
        <h2 className="t-h2">Kontaktai</h2>
        <ul className="mt-6 flex flex-col gap-3">
          <li>
            <a
              href={`mailto:${kontaktai.elPastas}`}
              className="t-body font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
            >
              {kontaktai.elPastas}
            </a>
          </li>
          <li>
            <a
              href={`tel:${kontaktai.telefonasNuoroda}`}
              className="t-body font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
            >
              {kontaktai.telefonas}
            </a>
          </li>
          <li className="t-body text-muted">{kontaktai.vietove}</li>
        </ul>
      </section>
    </div>
  )
}
