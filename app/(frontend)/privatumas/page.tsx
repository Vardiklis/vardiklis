import type { Metadata } from 'next'
import Antraste from '@/components/Antraste'
import { SlapukuPasirinkimas } from '@/components/SlapukuSutikimas'
import { kontaktai } from '@/lib/kontaktai'

export const metadata: Metadata = {
  title: 'Privatumas',
  description:
    'Vardiklis neturi duomenų bazės apie lankytojus ir nereikalauja registracijos. Testo rezultatai lieka tik jūsų naršyklėje, registracijos forma duomenis tik persiunčia laišku. Google Analytics, Ads matavimas ir Microsoft Clarity įsijungia tik jums sutikus.',
}

export default function Privatumas() {
  return (
    <div className="turinys sekcija">
      <Antraste
        lygis={1}
        dydis="display-l"
        paantraste="Trumpai: jokios duomenų bazės apie jus nėra. Ką parašote formoje, ateina Modestai į paštą ir lieka tik ten."
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
            Neprašome vaiko vardo, amžiaus, mokyklos ar bet kokių kitų asmens duomenų. Darant
            diagnostiką klausiama tik klasės, ir ji naudojama tik uždaviniams parinkti — iš
            naršyklės ji niekur neiškeliauja. Į laišką klasė patenka tik tuo atveju, jei patys ją
            nurodote registracijos formoje.
          </p>
        </section>

        <section>
          <h2 className="t-h3">Slapukai ir analitika</h2>
          <p className="mt-3 t-body text-muted">
            Būtini slapukai — tai tik pačios naršyklės atmintis: nebaigto testo eiga, uždaryta
            nuolaidos juostelė ir jūsų atsakymas dėl slapukų. Jie niekur nesiunčiami, be jų
            svetainė paprasčiausiai neveiktų, todėl sutikimo nereikalauja.
          </p>
          <p className="mt-3 t-body text-muted">
            Analitikos slapukai įsijungia tik jums paspaudus „Sutinku“ apatinėje juostoje. Tada
            pradeda veikti Google Analytics — jis skaičiuoja, kiek žmonių apsilanko ir kurie
            puslapiai naudingiausi. Renkami tik apibendrinti lankomumo duomenys: puslapio adresas,
            apytikslė vietovė, naršyklė ir įrenginio tipas. Nei vardas, nei testo atsakymai, nei
            rezultatai ten nepatenka.
          </p>
          <p className="mt-3 t-body text-muted">
            Sutikus įsijungia ir Microsoft Clarity. Jis parodo, kur puslapyje spaudžiama, kiek
            nuslenkama ir kurioje vietoje žmonės pasimeta — kad būtų aišku, ką svetainėje
            taisyti. Clarity įrašo ir apibendrintą apsilankymo peržiūrą, tačiau diagnostikos
            puslapis, ataskaita ir registracijos forma jame yra uždengti: nei uždaviniai, nei
            vaiko atsakymai, nei formos laukelių turinys į įrašą nepatenka.
          </p>
          <p className="mt-3 t-body text-muted">
            Kol nesutinkate, nei į Google, nei į Microsoft neiškeliauja nė viena užklausa ir
            jokių jų slapukų jūsų naršyklėje neatsiranda.
          </p>
          <p className="mt-3 t-body text-muted">
            Sutikus veikia ir Google Ads konversijų matavimas. Jis reikalingas todėl, kad
            svetainė reklamuojasi Google paieškoje: užpildžius registracijos formą į Google
            iškeliauja žinutė, kad forma buvo užpildyta. Taip matyti, ar reklama tikrai atveda
            žmones. Pats užklausos turinys — vardas, kontaktas, klasė ir žinutė — į Google
            nepatenka niekada; jis keliauja tik į Modestos pašto dėžutę.
          </p>
          <p className="mt-3 t-body text-muted">
            Personalizuotos reklamos funkcijos lieka išjungtos: remarketingo auditorijų
            nekuriame, reklamų pačioje svetainėje nėra ir duomenų niekam neparduodame.
          </p>
          <SlapukuPasirinkimas />
        </section>

        <section>
          <h2 className="t-h3">Registracija</h2>
          <p className="mt-3 t-body text-muted">
            Paskyrų nėra. Prisijungti ar registruotis nereikia ir negalima. Registracijos į pamoką
            formoje įrašytus duomenis — vardą, kontaktą, klasę ir žinutę — svetainės serveris
            išsiunčia el. laišku Modestai ir daugiau su jais nedaro nieko: į duomenų bazę jie
            nepatenka, rinkmenose neįrašomi, tretiesiems asmenims neperduodami. Vienintelė vieta,
            kur jie lieka, yra Modestos pašto dėžutė, ir naudojami jie tik tam, kad būtų galima
            atsakyti.
          </p>
        </section>

        <section>
          <h2 className="t-h3">Apsauga nuo šlamšto</h2>
          <p className="mt-3 t-body text-muted">
            Kad formos nespamintų automatiniai skriptai, serverio atmintyje dešimčiai minučių
            lieka siuntėjo IP adresas ir siuntimų skaičius. Daugiau nieko prie jo neprisegama, į
            diską jis nerašomas ir perkrovus serverį dingsta.
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
