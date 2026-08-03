import Antraste from '@/components/Antraste'
import BruksnysDivider from '@/components/BruksnysDivider'
import Mygtukas from '@/components/Mygtukas'
import Trupmena from '@/components/Trupmena'

// Laikinas Fazės 1 priėmimo kriterijaus puslapis. Prieš Fazę 2 ištrinamas.
const abecele = 'ą č ę ė į š ų ū ž Ą Č Ę Ė Į Š Ų Ū Ž'
const sakinys = 'Įžūlūs šešėliai grąžino ąžuolą — dvejetas septintoje klasėje.'

export default function Patikra() {
  return (
    <div className="turinys sekcija">
      <h1 className="display-xl">Šriftų patikra</h1>

      <div className="mt-12 flex flex-col gap-10">
        <section>
          <h2 className="t-h3 text-muted">Display — Bricolage Grotesque</h2>
          <p className="mt-2 font-display text-4xl font-semibold">{abecele}</p>
          <p className="mt-2 font-display text-2xl">{sakinys}</p>
        </section>

        <section>
          <h2 className="t-h3 text-muted">Tekstas — Instrument Sans</h2>
          <p className="mt-2 font-sans text-2xl">{abecele}</p>
          <p className="mt-2 t-body">{sakinys}</p>
          <p className="mt-2 t-body font-semibold">{sakinys}</p>
        </section>

        <section>
          <h2 className="t-h3 text-muted">Mono — JetBrains Mono</h2>
          <p className="mt-2 font-mono text-2xl">{abecele}</p>
          <p className="mt-2 t-mono">{sakinys}</p>
          <p className="mt-2 t-mono">0123456789 × ÷ − + = ≈ ≠ ≥ ≤</p>
        </section>
      </div>

      <BruksnysDivider className="my-12" />

      <Antraste lygis={2} dydis="h2" paantraste="Skirtukas viršuje, trupmenos ir mygtukai žemiau.">
        Komponentai
      </Antraste>

      <div className="mt-8 flex flex-wrap items-end gap-10">
        <Trupmena skaitiklis="3" vardiklis="4" dydis="normalus" etikete="trys ketvirtadaliai" />
        <Trupmena skaitiklis="7" vardiklis="12" dydis="didelis" bruksnys="orange" />
        <Trupmena
          dydis="hero"
          bruksnys="orange"
          skaitiklis={<span className="text-muted">dvejetas 7 klasėje</span>}
          vardiklis="bendravardiklinimas, 5 klasė"
          vardiklisRyskus
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Mygtukas variantas="pilnas">Pradėti diagnostiką</Mygtukas>
        <Mygtukas variantas="konturas">Kontūras</Mygtukas>
        <Mygtukas variantas="tekstinis">Kaip tai veikia</Mygtukas>
        <Mygtukas variantas="pilnas" dydis="didelis">
          Didelis mygtukas
        </Mygtukas>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <span className="rounded-[8px] border border-line bg-paper-2 px-4 py-3 t-small">
          paper-2 kortelė
        </span>
        <span className="rounded-[8px] bg-orange-soft px-4 py-3 t-small">orange-soft kortelė</span>
      </div>
    </div>
  )
}
