/**
 * Mock režimas — vietinis CMS su netikrais duomenimis (`npm run dev:mock`).
 *
 * KAM. Pažiūrėti, kaip atrodo kalendorius, žurnalas ar sąskaitos su gyvais
 * duomenimis, neturint tikrų mokinių vietinėje bazėje ir nerizikuojant, kad
 * kas nors gaus laišką.
 *
 * KAS JĮ ĮJUNGIA. Tik `scripts/mock.mjs`, nustatydamas `VARDIKLIS_MOCK=1` ir
 * nukreipdamas bazę bei failus į `mock/` katalogą (jis git'e ignoruojamas).
 * Serveryje šio kintamojo nėra, tad visa, kas čia, ten neegzistuoja.
 *
 * KĄ UŽRAKINA — kodu, ne vien aplinkos kintamaisiais, kad užraktas laikytųsi
 * ir tada, jei `.env` kada nors atsirastų tikras SMTP slaptažodis:
 *   - paštas (`lib/pastas.ts`) — laiškai neišeina, tik spausdinami terminale;
 *   - i.SAF (`lib/isaf.ts`) — į VMI nesijungiama.
 */

export function arMock(): boolean {
  return process.env.VARDIKLIS_MOCK === '1' && process.env.NODE_ENV !== 'production'
}

/** Netikras administratorius. `.invalid` domenas laiškų negauna niekada (RFC 6761). */
export const MOCK_ADMINAS = {
  vardas: 'Mock',
  email: 'mock@example.invalid',
  password: 'mock-mock-123',
} as const

/** Vaiko paskyra dienynui (`/dienynas`). */
export const MOCK_DIENYNAS = { username: 'ugne', password: 'ugne-1234' } as const

/** `PRIMINIMU_RAKTAS` mock režime — kad priminimus būtų galima paleisti ranka. */
export const MOCK_PRIMINIMU_RAKTAS = 'mock'
