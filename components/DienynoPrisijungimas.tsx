'use client'

import { useActionState } from 'react'
import { prisijungti, type PrisijungimoBusena } from '@/app/(dienynas)/dienynas/veiksmai'

const PRADINE: PrisijungimoBusena = { klaida: null, vardas: '' }

const laukelis =
  'mt-1.5 block w-full rounded-[6px] border border-line bg-white px-3.5 py-3 text-[1.0625rem] text-ink outline-none transition-colors focus:border-ink'

/**
 * Prisijungimo forma.
 *
 * Kliento komponentas tik dėl klaidos pranešimo ir įvesto vardo išlaikymo —
 * pati patikra vyksta serveryje (`veiksmai.ts`). Be JavaScript forma vis tiek
 * veikia: serverio veiksmas priima įprastą POST.
 */
export default function DienynoPrisijungimas() {
  const [busena, veiksmas, siunciama] = useActionState(prisijungti, PRADINE)

  return (
    <form action={veiksmas} className="space-y-5">
      <label className="block">
        <span className="t-small font-semibold">Vardas</span>
        <input
          name="vardas"
          type="text"
          required
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          defaultValue={busena.vardas}
          className={laukelis}
        />
      </label>

      <label className="block">
        <span className="t-small font-semibold">Slaptažodis</span>
        <input
          name="slaptazodis"
          type="password"
          required
          autoComplete="current-password"
          className={laukelis}
        />
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
        {siunciama ? 'Jungiamasi…' : 'Prisijungti'}
      </button>
    </form>
  )
}
