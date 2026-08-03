import type { Busena } from './diagnostika'

/**
 * Testo rezultatas perduodamas iš `/testas` į `/testas/rezultatas` per
 * `sessionStorage` — tai naršyklės atmintis vieno seanso metu (2 skyrius).
 *
 * Į serverį nieko nesiunčiam, nieko nesaugom, ir uždarius kortelę viskas dingsta.
 * Saugoma tik būsena su temų id ir teisingų atsakymų skaičiais — jokių
 * vaiko duomenų čia nėra ir negali atsirasti.
 */
const RAKTAS = 'vardiklis-diagnostika'

export function irasykSeansa(busena: Busena): void {
  try {
    sessionStorage.setItem(RAKTAS, JSON.stringify(busena))
  } catch {
    // Privatus naršymo režimas gali neleisti rašyti — tada rezultatas tiesiog
    // nepasieks kito puslapio, o vartotojas pamatys pranešimą pradėti iš naujo.
  }
}

/**
 * Kešas reikalingas, kad `useSyncExternalStore` gautų tą pačią nuorodą —
 * kitaip kiekvienas `JSON.parse` kurtų naują objektą ir React ciklintųsi.
 */
let kesas: { tekstas: string; busena: Busena } | null = null

export function skaitykSeansa(): Busena | null {
  try {
    const tekstas = sessionStorage.getItem(RAKTAS)
    if (!tekstas) return null
    if (kesas && kesas.tekstas === tekstas) return kesas.busena
    const busena = JSON.parse(tekstas) as Busena
    kesas = { tekstas, busena }
    return busena
  } catch {
    return null
  }
}

/** `useSyncExternalStore` sąsaja — seanso duomenys puslapio gyvavimo metu nesikeičia. */
export function prenumeruokSeansa(): () => void {
  return () => {}
}

export function isvalykSeansa(): void {
  try {
    sessionStorage.removeItem(RAKTAS)
  } catch {
    // nesvarbu
  }
}
