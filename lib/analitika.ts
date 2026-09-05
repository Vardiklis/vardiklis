/**
 * Google žymės identifikatoriai ir įvykiai.
 *
 * Atskirai nuo `components/Analitika.tsx`, nes tas komponentas yra `'use client'`
 * ir jį importuoti iš kitų vietų vien dėl konstantos būtų brangiau, nei verta.
 */

/** Google Analytics 4 matavimo ID. Viešas — jį matyti ir naršyklės kode. */
export const GA_ID = 'G-YTHQ4HB2G4'

/**
 * Google Ads paskyra. Be `gtag('config', ADS_ID)` konversijos žymė niekur
 * nenukeliauja: `send_to` nurodo, KURIAI paskyrai, bet pačios paskyros gtag'as
 * turi būti sukonfigūruotas atskirai.
 */
export const ADS_ID = 'AW-18408490184'

/**
 * Microsoft Clarity projekto ID. Taip pat viešas — matyti naršyklės kode.
 *
 * Clarity įrašo seansų peržiūras ir šilumos žemėlapius, tad be sutikimo jo
 * neįdedam lygiai taip pat, kaip ir Google žymės (žr. `components/Analitika.tsx`).
 *
 * Tuščia eilutė = išjungta: skriptas neįkeliamas ir niekas nelūžta. Taip galima
 * laikinai išjungti Clarity nekarpant komponento.
 */
export const CLARITY_ID: string = 'ydhy7gbpr5'

/** Konkreti konversija — „užpildyta registracijos forma“. */
export const UZKLAUSOS_KONVERSIJA = `${ADS_ID}/jIn0CMiA4-ocEMiJ7clE`

declare global {
  interface Window {
    gtag?: (...argumentai: unknown[]) => void
  }
}

/**
 * Praneša Google Ads, kad forma užpildyta.
 *
 * Kviečiama TIK gavus serverio patvirtinimą, kad laiškas išsiųstas — ne
 * paspaudus mygtuką. Antraip į statistiką patektų ir tos užklausos, kurios
 * niekada nepasiekė Modestos pašto dėžutės.
 *
 * `gtag`'o gali ir nebūti: kūrimo aplinkoje jis neįdedamas, o gyvoje svetainėje
 * atsiranda tik žmogui sutikus su slapukais. Tada tyliai praleidžiam —
 * konversija yra statistika, o ne funkcija, dėl kurios verta lūžti formai.
 */
export function praneskUzklausosKonversija(): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'conversion', { send_to: UZKLAUSOS_KONVERSIJA })
}
