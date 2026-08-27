/**
 * Slapukų sutikimo būsena.
 *
 * Kodėl atskiras modulis, o ne būsena komponente: tą patį atsakymą turi matyti
 * DU nesusiję medžio taškai — juosta apačioje (`SlapukuSutikimas`) ir analitika
 * maketo gale (`Analitika`). Konteksto dėl to statyti neverta: pasirinkimas
 * gyvena `localStorage`, o `useSyncExternalStore` iš jo skaito taip pat, kaip
 * `JuosteleNuolaida` skaito uždarytą juostelę.
 *
 * Į serverį nieko nesiunčiam. Tai tik vietinė žymė „šis žmogus jau atsakė“.
 */
const RAKTAS = 'vardiklis-slapuku-sutikimas'

export type Sutikimas = 'sutikta' | 'atmesta'

const klausytojai = new Set<() => void>()

function pranesk() {
  for (const f of klausytojai) f()
}

export function prenumeruokSutikima(f: () => void): () => void {
  klausytojai.add(f)
  // `storage` įvykis ateina iš kitų kortelių — atsakius vienoje, juosta dingsta
  // ir kitose, o analitika ten įsijungia be perkrovimo.
  window.addEventListener('storage', f)
  return () => {
    klausytojai.delete(f)
    window.removeEventListener('storage', f)
  }
}

export function skaitykSutikima(): Sutikimas | null {
  try {
    const reiksme = localStorage.getItem(RAKTAS)
    return reiksme === 'sutikta' || reiksme === 'atmesta' ? reiksme : null
  } catch {
    // Privatus režimas gali neleisti skaityti — tada laikom, kad neatsakyta:
    // juosta parodoma, analitika neįsijungia. Saugesnė pusė.
    return null
  }
}

/**
 * Serveryje `localStorage` nėra, tad statiniame HTML juosta VISADA yra, o
 * analitikos VISADA nėra. Naršyklė iškart pasitaiso pagal įrašytą atsakymą.
 */
export function serveryjeNeatsakyta(): null {
  return null
}

export function irasykSutikima(sutikimas: Sutikimas): void {
  try {
    localStorage.setItem(RAKTAS, sutikimas)
  } catch {
    // Neįrašius juosta grįš kitą kartą — nemalonu, bet ne klaida.
  }
  // Ta pati žymė, kurią įkeliant uždeda blokuojantis maketo skriptas. Be jos
  // atšaukus ir vėl atsakius juosta liktų paslėpta CSS taisyklės.
  document.documentElement.dataset.slapukai = 'atsakyta'
  pranesk()
}

/** Atšaukimas — juosta grįžta ir žmogus gali atsakyti kitaip. */
export function atsaukSutikima(): void {
  try {
    localStorage.removeItem(RAKTAS)
  } catch {
    // nesvarbu
  }
  delete document.documentElement.dataset.slapukai
  pranesk()
}
