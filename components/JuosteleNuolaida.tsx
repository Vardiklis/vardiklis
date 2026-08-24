'use client'

import { useSyncExternalStore } from 'react'
import { nuolaidaPirmajai } from '@/lib/kontaktai'

/**
 * Oranžinė juostelė po navigacija su akcijos pranešimu.
 *
 * Uždarymas įsimenamas `localStorage` — ne seanse, o visam laikui, nes juostelė,
 * grįžtanti po kiekvieno naršyklės perkrovimo, erzina labiau nei padeda.
 * Į serverį nieko nesiunčiam: tai tik vietinė žymė „šis žmogus jau uždarė“.
 *
 * Skaitom per `useSyncExternalStore`, kaip ir `lib/seansas.ts` — taip būsena
 * gaunama jau pirmo atvaizdavimo metu, be `setState` efekte ir be hidratacijos
 * neatitikimo: serveris visada laiko juostelę matoma, o naršyklė iškart
 * pasitaiso, jei žyma jau įrašyta.
 */
const RAKTAS = 'vardiklis-juostele-nuolaida'

const klausytojai = new Set<() => void>()

function pranesk() {
  for (const f of klausytojai) f()
}

function prenumeruok(f: () => void): () => void {
  klausytojai.add(f)
  // `storage` įvykis ateina iš kitų kortelių — uždarius vienoje, dingsta visose.
  window.addEventListener('storage', f)
  return () => {
    klausytojai.delete(f)
    window.removeEventListener('storage', f)
  }
}

function arUzdaryta(): boolean {
  try {
    return localStorage.getItem(RAKTAS) === 'uzdaryta'
  } catch {
    // Privatus režimas gali neleisti skaityti — tada juostelė tiesiog lieka.
    return false
  }
}

/** Serveryje `localStorage` nėra, tad statiniame HTML juostelė visada matoma. */
function serveryjeMatoma(): boolean {
  return false
}

export function JuosteleNuolaida() {
  const uzdaryta = useSyncExternalStore(prenumeruok, arUzdaryta, serveryjeMatoma)

  function uzdaryk() {
    try {
      localStorage.setItem(RAKTAS, 'uzdaryta')
    } catch {
      // Neįrašius juostelė grįš kitą kartą — tai nemalonu, bet ne klaida.
    }
    pranesk()
  }

  if (uzdaryta) return null

  return (
    // `juostele-nuolaida` — už šios klasės kabinasi CSS taisyklė, slepianti
    // juostelę dar prieš piešimą (žr. `globals.css` galą ir maketo skriptą).
    //
    // Baltas tekstas ant #FF5C00 duoda 3.09:1. Mažam tekstui to nepakaktų, bet
    // nuo 19px ir `font-semibold` WCAG jį laiko „dideliu“, o tam riba yra 3:1 —
    // todėl juostelės padidinimas kartu išsprendžia ir kontrasto klausimą.
    // Sumažinus šriftą žemiau 19px kontrastas nustotų atitikti AA.
    <div className="juostele-nuolaida be-spausdinimo bg-orange text-white">
      <div className="turinys relative flex items-center justify-center gap-3 py-4 md:py-5">
        {/* Simetriškas paddingas palieka vietos mygtukui ir išlaiko tekstą centre —
            siaurame telefone jis verčiau persilauš į dvi eilutes nei palįs po X. */}
        <p className="px-12 text-center text-[1.1875rem] leading-snug font-semibold md:px-25 md:text-xl">
          {nuolaidaPirmajai} eurų nuolaida pirmajai pamokai!
        </p>
        <button
          type="button"
          onClick={uzdaryk}
          aria-label="Uždaryti pranešimą"
          // Absoliutus dėl to, kad tekstas liktų tiksliai centre, o ne pastumtas
          // mygtuko pločiu. Taikinys 44×44 — tiek reikia pirštui.
          className="absolute right-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] transition-colors hover:bg-white/20"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M1 1L13 13M13 1L1 13" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default JuosteleNuolaida
