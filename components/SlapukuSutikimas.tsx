'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import Mygtukas from '@/components/Mygtukas'
import {
  atsaukSutikima,
  irasykSutikima,
  prenumeruokSutikima,
  serveryjeNeatsakyta,
  skaitykSutikima,
} from '@/lib/slapukai'

/**
 * Pranešimas apie slapukus su tikru pasirinkimu.
 *
 * Kol žmogus neatsakė, `Analitika` neįdeda NĖ VIENO trečiosios šalies skripto —
 * nei Google, nei Microsoft. Todėl juosta nėra dekoracija: „Tik būtini“ iš tikrųjų
 * reiškia, kad niekur neiškeliauja jokia užklausa ir slapukų neatsiranda.
 *
 * Tekste minimas ir reklamos matavimas, ir Microsoft Clarity: sutikus įsijungia
 * ne tik Analytics, bet ir Google Ads konversija bei Clarity seansų peržiūros
 * (žr. `Analitika`). Sutikimas galioja tik tam, apie ką čia parašyta, tad tylėti
 * apie reklamą ar peržiūras būtų negalima.
 *
 * „Būtini“ šioje svetainėje — tik pačios naršyklės atmintis: testo eiga
 * (`sessionStorage`), uždaryta nuolaidos juostelė ir šis pats atsakymas.
 * Jie sutikimo nereikalauja, nes be jų puslapis tiesiog neveiktų.
 *
 * Skaitom per `useSyncExternalStore`, kaip ir `JuosteleNuolaida`: būsena
 * gaunama jau pirmo atvaizdavimo metu, be `setState` efekte ir be hidratacijos
 * neatitikimo. Serveris visada laiko, kad neatsakyta, o naršyklė pasitaiso.
 */
export function SlapukuSutikimas() {
  const sutikimas = useSyncExternalStore(
    prenumeruokSutikima,
    skaitykSutikima,
    serveryjeNeatsakyta,
  )

  if (sutikimas !== null) return null

  return (
    // `juosta-slapukai` — už šios klasės kabinasi CSS taisyklė, slepianti juostą
    // dar prieš piešimą tiems, kas jau atsakė (žr. `globals.css` galą ir maketo
    // blokuojantį skriptą). Be jos juosta sublyksėtų kas kartą.
    //
    // `role="region"`, o ne dialogas: nieko neblokuojam, fokusas negaudomas —
    // svetainę galima skaityti ir neatsakius, o skaitytuvas juostą randa kaip
    // atskirą sritį.
    <section
      aria-label="Pranešimas apie slapukus"
      className="juosta-slapukai be-spausdinimo fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper"
    >
      <div className="turinys flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between md:gap-8">
        <p className="t-small text-muted md:max-w-2xl">
          Svetainėje naudojame tik būtinus slapukus. Su jūsų sutikimu papildomai
          įjungtume Google Analytics — jis apibendrintai suskaičiuoja, kiek žmonių
          apsilanko ir kurie puslapiai naudingiausi — Google Ads matavimą, kuris
          parodo, ar užklausa atėjo per reklamą, ir Microsoft Clarity, rodantį, kur
          puslapyje spaudžiama ir kiek nuslenkama. Testo atsakymai, rezultatai ir
          formos turinys ten nepatenka niekada.{' '}
          <Link
            href="/privatumas"
            className="font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
          >
            Plačiau apie privatumą
          </Link>
          .
        </p>

        <div className="flex shrink-0 gap-3">
          {/* Abu mygtukai vienodo svorio ir vienodo dydžio — atmesti turi būti
              lygiai taip pat lengva, kaip sutikti. To reikalauja ir GDPR. */}
          <Mygtukas variantas="konturas" onClick={() => irasykSutikima('atmesta')}>
            Tik būtini
          </Mygtukas>
          <Mygtukas onClick={() => irasykSutikima('sutikta')}>Sutinku</Mygtukas>
        </div>
      </div>
    </section>
  )
}

/**
 * Mygtukas atsiimti sutikimą — stovi „Privatumo“ puslapyje.
 *
 * GDPR reikalauja, kad atšaukti būtų taip pat paprasta, kaip duoti. Paspaudus
 * žymė ištrinama ir juosta grįžta — žmogus atsako iš naujo. Analitika po to
 * neveiks iki kito puslapio perkrovimo, nes gtag'as jau įkrautas; sekantis
 * atidarymas jo nebeįdės.
 */
export function SlapukuPasirinkimas() {
  const sutikimas = useSyncExternalStore(
    prenumeruokSutikima,
    skaitykSutikima,
    serveryjeNeatsakyta,
  )

  const busena =
    sutikimas === 'sutikta'
      ? 'Dabar esate sutikę su analitikos, reklamos matavimo ir Clarity slapukais.'
      : sutikimas === 'atmesta'
        ? 'Dabar veikia tik būtini slapukai.'
        : 'Kol neatsakėte — veikia tik būtini slapukai.'

  return (
    <div className="mt-4 flex flex-col items-start gap-3">
      <p className="t-small text-muted">{busena}</p>
      {sutikimas !== null && (
        <Mygtukas variantas="konturas" onClick={atsaukSutikima}>
          Pakeisti pasirinkimą
        </Mygtukas>
      )}
    </div>
  )
}

export default SlapukuSutikimas
