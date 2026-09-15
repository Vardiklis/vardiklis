'use client'

import { useActionState } from 'react'
import { keistiSlaptazodi, type KeitimoBusena } from '@/app/(dienynas)/dienynas/veiksmai'

const PRADINE: KeitimoBusena = { klaida: null }

const laukelis =
  'mt-1.5 block w-full rounded-[6px] border border-line bg-white px-3.5 py-3 text-[1.0625rem] text-ink outline-none transition-colors focus:border-ink'

/** Laikino slaptažodžio keitimo forma. Patikra — serveryje (`veiksmai.ts`). */
export default function DienynoSlaptazodis({ ilgis }: { ilgis: number }) {
  const [busena, veiksmas, siunciama] = useActionState(keistiSlaptazodi, PRADINE)

  return (
    <form action={veiksmas} className="space-y-5">
      <label className="block">
        <span className="t-small font-semibold">Naujas slaptažodis</span>
        <input
          name="naujas"
          type="password"
          required
          minLength={ilgis}
          autoComplete="new-password"
          className={laukelis}
        />
        <span className="t-small mt-1 block text-muted">Bent {ilgis} simboliai.</span>
      </label>

      <label className="block">
        <span className="t-small font-semibold">Pakartokite</span>
        <input name="pakartotas" type="password" required autoComplete="new-password" className={laukelis} />
      </label>

      {busena.klaida && (
        <p role="alert" className="t-small rounded-[6px] bg-klaidinga-soft px-3.5 py-2.5 text-klaidinga">
          {busena.klaida}
        </p>
      )}

      <button
        type="submit"
        disabled={siunciama}
        className="inline-flex w-full items-center justify-center rounded-[6px] border border-orange bg-orange px-6 py-3.5 text-[1.0625rem] font-semibold text-ink transition-colors duration-150 hover:bg-[#F05600] disabled:cursor-wait disabled:opacity-60"
      >
        {siunciama ? 'Išsaugoma…' : 'Išsaugoti ir atidaryti dienyną'}
      </button>
    </form>
  )
}
