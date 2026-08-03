'use client'

import { useSyncExternalStore } from 'react'
import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import Mygtukas from '@/components/Mygtukas'
import TemuGrandine from '@/components/TemuGrandine'
import Trupmena from '@/components/Trupmena'
import { ataskaita } from '@/lib/diagnostika'
import { kontaktai } from '@/lib/kontaktai'
import { prenumeruokSeansa, skaitykSeansa } from '@/lib/seansas'

/** Pirmą raidę į mažąją — pavadinimas eina po dvitaškio. */
function mazaja(tekstas: string): string {
  return tekstas.charAt(0).toLowerCase() + tekstas.slice(1)
}

export function Rezultatas() {
  const busena = useSyncExternalStore(prenumeruokSeansa, skaitykSeansa, () => null)

  // Serveryje ir tol, kol seanso duomenų nėra — nuoroda pradėti iš naujo.
  if (!busena) {
    return (
      <div className="tekstas">
        <Antraste lygis={1} dydis="display-l">
          Ataskaitos nėra
        </Antraste>
        <p className="mt-6 t-body text-muted">
          Rezultatai gyvuoja tik naršyklės atmintyje vieno seanso metu ir niekur nesaugomi.
          Uždarius kortelę arba atsivertus šį puslapį tiesiogiai, ataskaitos nebėra.
        </p>
        <div className="mt-8">
          <Mygtukas href="/testas" dydis="didelis">
            Pradėti diagnostiką
          </Mygtukas>
        </div>
      </div>
    )
  }

  const a = ataskaita(busena)
  const pagrindine = [...a.saknines].sort((x, y) => x.klase - y.klase)[0] ?? null

  // ── Spragų nerasta ────────────────────────────────────────────────────────
  if (!pagrindine) {
    return (
      <>
        <Antraste lygis={1} dydis="display-l" className="tekstas">
          Spragų ankstesnėse klasėse nerasta
        </Antraste>

        <p className="tekstas mt-6 t-body text-muted">
          Vaiko pagrindai tvirti. Sunkumai greičiausiai susiję su šios klasės medžiaga, ne su
          ankstesnėmis spragomis.
        </p>

        <p className="tekstas mt-4 t-small text-muted">
          Patikrinta temų: {a.islaikytos.length}. Duota uždavinių: {a.isVisoUzdaviniu}.
        </p>

        <Kontaktai savaites={null} />
      </>
    )
  }

  // ── Rasta spraga ──────────────────────────────────────────────────────────
  return (
    <>
      <Antraste lygis={1} dydis="display-l" className="max-w-4xl">
        Rasta spraga: {mazaja(pagrindine.pavadinimas)}, {pagrindine.klase} klasė
      </Antraste>

      {a.saknines.length > 1 && (
        <p className="tekstas mt-6 t-body text-muted">
          Rastos ir kitos savarankiškos spragos:{' '}
          {a.saknines
            .filter((t) => t.id !== pagrindine.id)
            .map((t) => `${mazaja(t.pavadinimas)} (${t.klase} kl.)`)
            .join(', ')}
          .
        </p>
      )}

      {/* Ta pati mintis viena trupmena: simptomas viršuje, priežastis apačioje. */}
      <div className="mt-10">
        <Trupmena
          dydis="hero"
          bruksnys="orange"
          skaitiklis={
            <span className="t-body text-muted">
              sunkumai {a.klase} klasėje
            </span>
          }
          vardiklis={
            <span className="font-display text-xl font-semibold tracking-[-0.01em] md:text-2xl">
              {mazaja(pagrindine.pavadinimas)}, {pagrindine.klase} klasė
            </span>
          }
        />
      </div>

      <section className="mt-16">
        <Antraste lygis={2} dydis="h2" suSkirtuku>
          Kaip tai atrodo grandinėje
        </Antraste>
        <p className="tekstas mt-4 t-body text-muted">
          Kiekviena tema remiasi ta, kuri po ja. Oranžinė žymi vietas, kur nepavyko.
        </p>
        <TemuGrandine grandine={a.grandine} />
      </section>

      {a.blokuojamos.length > 0 && (
        <section className="mt-16">
          <Antraste lygis={2} dydis="h2" suSkirtuku>
            Ką ši spraga blokuoja
          </Antraste>
          <p className="tekstas mt-4 t-body text-muted">
            Šios temos grafe remiasi į rastą spragą. Kol ji neištaisyta, jos vaikui bus
            sunkios arba neįmanomos.
          </p>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {a.blokuojamos.map((t) => (
              <li
                key={t.id}
                className="flex items-baseline justify-between gap-4 rounded-[8px] border border-line px-5 py-4"
              >
                <span className="t-body">{t.pavadinimas}</span>
                <span className="t-small text-muted">{t.klase} kl.</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16">
        <Antraste lygis={2} dydis="h2" suSkirtuku>
          Kiek laiko užtrunka tai sutaisyti
        </Antraste>
        <p className="tekstas mt-4 t-body">
          Apie {a.savaites} savaites, vieną kartą per savaitę.
        </p>
        <p className="tekstas mt-3 t-small text-muted">
          Skaičiuojama pagal rastų spragų kiekį ({a.neislaikytos.length}). Tai orientacinis
          įvertis — tikslesnį pasakys Modesta, pamačiusi, kaip vaikas dirba.
        </p>
      </section>

      <Kontaktai savaites={a.savaites} />
    </>
  )
}

function Kontaktai({ savaites }: { savaites: number | null }) {
  return (
    <section className="mt-20">
      <BruksnysDivider className="mb-10" />
      <h2 className="display-l max-w-[20ch]">Aptarti ataskaitą su Modesta</h2>
      <p className="tekstas mt-6 t-body text-muted">
        {savaites === null
          ? 'Jei sunkumai išlieka, verta pažiūrėti, kaip vaikas dirba su šios klasės medžiaga.'
          : 'Parodykite šią ataskaitą arba tiesiog parašykite, ką matote pažymiuose.'}
      </p>

      <ul className="mt-8 flex flex-col gap-3">
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
      </ul>

      <div className="mt-10 flex flex-wrap gap-3">
        <Mygtukas href="/testas" variantas="konturas">
          Kartoti testą
        </Mygtukas>
        <Mygtukas href="/uzduotys" variantas="konturas">
          Uždavinių treniruotei
        </Mygtukas>
      </div>

      <p className="mt-8 t-small text-muted">
        Ši ataskaita niekur neišsaugota. Uždarius kortelę ji dingsta.
      </p>
    </section>
  )
}

export default Rezultatas
