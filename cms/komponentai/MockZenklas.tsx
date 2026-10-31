import { arMock } from '@/lib/mock'

/**
 * Ženklas meniu viršuje, kai CMS sukasi su netikrais duomenimis
 * (`npm run dev:mock`). Kad mock bazės niekada nesupainiotum su tikra.
 * Kitu atveju — nieko.
 */
export function MockZenklas() {
  if (!arMock()) return null
  return (
    <div className="mock-zenklas">
      <strong>MOCK</strong>
      <span>Netikri duomenys. Laiškai neišeina — jie spausdinami terminale.</span>
    </div>
  )
}
