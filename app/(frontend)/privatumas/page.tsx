import type { Metadata } from 'next'
import Antraste from '@/components/Antraste'
import { kontaktai } from '@/lib/kontaktai'

export const metadata: Metadata = {
  title: 'Privatumas',
  description:
    'Vardiklis nerenka asmens duomenų ir nereikalauja registracijos. Testo rezultatai lieka tik jūsų naršyklėje. Lankomumui matuoti naudojama Google Analytics.',
}

export default function Privatumas() {
  return (
    <div className="turinys sekcija">
      <Antraste
        lygis={1}
        dydis="display-l"
        paantraste="Trumpai: nieko nerenkame ir nieko nesaugome."
      >
        Privatumas
      </Antraste>

      <div className="tekstas mt-12 flex flex-col gap-8">
        <section>
          <h2 className="t-h3">Diagnostikos rezultatai</h2>
          <p className="mt-3 t-body text-muted">
            Testas veikia tik jūsų naršyklėje. Atsakymai ir ataskaita niekur nesiunčiami ir į
            jokią duomenų bazę nepatenka. Rezultatas laikomas naršyklės seanso atmintyje
            (<code className="t-mono">sessionStorage</code>) tam, kad būtų galima parodyti
            ataskaitą kitame puslapyje. Uždarius kortelę jis dingsta.
          </p>
        </section>

        <section>
          <h2 className="t-h3">Vaikų duomenys</h2>
          <p className="mt-3 t-body text-muted">
            Neprašome vaiko vardo, amžiaus, mokyklos ar bet kokių kitų asmens duomenų. Vienintelis
            klausiamas dalykas — klasė, ir ji naudojama tik uždaviniams parinkti. Ji taip pat
            niekur nesiunčiama.
          </p>
        </section>

        <section>
          <h2 className="t-h3">Slapukai ir analitika</h2>
          <p className="mt-3 t-body text-muted">
            Svetainėje veikia Google Analytics — jis skaičiuoja, kiek žmonių apsilanko ir kurie
            puslapiai naudingiausi. Renkami tik apibendrinti lankomumo duomenys: puslapio adresas,
            apytikslė vietovė, naršyklė ir įrenginio tipas. Nei vardas, nei testo atsakymai, nei
            rezultatai ten nepatenka.
          </p>
          <p className="mt-3 t-body text-muted">
            Šiam skaičiavimui Google naudoja slapukus. Reklamos tinklų svetainėje nėra ir duomenų
            niekam neparduodame. Nenorintys būti skaičiuojami gali įjungti naršyklės sekimo
            blokavimą arba naudoti privatų langą.
          </p>
        </section>

        <section>
          <h2 className="t-h3">Registracija</h2>
          <p className="mt-3 t-body text-muted">
            Paskyrų nėra. Prisijungti ar registruotis nereikia ir negalima. Straipsnių apačioje
            esanti registracijos į pamoką forma duomenų niekur nesiunčia ir neįrašo: paspaudus
            mygtuką atsidaro jūsų pašto programa su paruoštu laišku, o išsiunčiate jį patys.
          </p>
        </section>

        <section>
          <h2 className="t-h3">Susisiekimas</h2>
          <p className="mt-3 t-body text-muted">
            Jei parašote el. paštu ar paskambinate, jūsų kontaktus mato tik Modesta ir naudoja
            juos tik atsakyti. Klausimai apie privatumą —{' '}
            <a
              href={`mailto:${kontaktai.elPastas}`}
              className="font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
            >
              {kontaktai.elPastas}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
