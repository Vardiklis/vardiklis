'use client'

import Formule from '@/components/Formule'
import type { Uzdavinys } from '@/lib/generatoriai'

/**
 * Pasirenkamojo atsakymo variantai, porų sąrašai ir rikiuojami elementai.
 *
 * Iškelta į atskirą komponentą todėl, kad anksčiau tai mokėjo tik uždavinių
 * kortelė. Diagnostikos ekrane pasirenkamojo atsakymo uždavinys atrodė kaip
 * klausimas be atsakymų, o atskleidus rodydavo „B“ — raidę, kurios vaikas
 * niekur nematė. Dabar abu ekranai piešia tą patį.
 *
 * Kai perduodamas `onPasirinkti`, variantai virsta mygtukais: teste vaikas
 * raidę paspaudžia, o ne rašo ranka.
 */

type Props = {
  uzdavinys: Uzdavinys
  /** Teksto dydžio klasė — kortelėje smulkiau, teste stambiau. */
  dydis?: string
  /** Raidės (A, B, C) dydžio klasė. */
  raidesDydis?: string
  /** Perdavus variantai tampa mygtukais. */
  onPasirinkti?: (raide: string) => void
  /** Pasirinkta raidė — pažymima. */
  pasirinkta?: string
  /** Atsakius mygtukai užrakinami, kad atsakymo nebūtų galima keisti. */
  isjungta?: boolean
}

export function UzdavinioFormatas({
  uzdavinys,
  dydis = 'text-[1.0625rem]',
  raidesDydis = 'text-[0.9375rem]',
  onPasirinkti,
  pasirinkta,
  isjungta = false,
}: Props) {
  if (uzdavinys.formatas === 'pasirinkimas' && uzdavinys.variantai) {
    if (onPasirinkti) {
      return (
        <ul className="mb-4 flex flex-col gap-2">
          {uzdavinys.variantai.map((v) => {
            const zymeta = pasirinkta === v.raide
            return (
              <li key={v.raide}>
                <button
                  type="button"
                  onClick={() => onPasirinkti(v.raide)}
                  disabled={isjungta}
                  aria-pressed={zymeta}
                  className={`flex w-full items-baseline gap-3 rounded-[6px] border px-4 py-3 text-left transition-colors disabled:cursor-default ${
                    zymeta
                      ? 'border-ink bg-paper-2'
                      : 'border-line bg-paper hover:border-ink disabled:hover:border-line'
                  }`}
                >
                  <span className={`font-mono font-semibold ${raidesDydis}`}>{v.raide})</span>
                  <Formule tekstas={v.tekstas} className={dydis} />
                </button>
              </li>
            )
          })}
        </ul>
      )
    }

    return (
      <ul className="mb-4 flex flex-col gap-2">
        {uzdavinys.variantai.map((v) => (
          <li key={v.raide} className="flex items-baseline gap-2">
            <span className={`font-mono font-semibold ${raidesDydis}`}>{v.raide})</span>
            <Formule tekstas={v.tekstas} className={dydis} />
          </li>
        ))}
      </ul>
    )
  }

  if (uzdavinys.formatas === 'poros' && uzdavinys.poros) {
    return (
      <div className="mb-4 grid grid-cols-2 gap-x-6 gap-y-2">
        <ul className="flex flex-col gap-2">
          {uzdavinys.poros.map((p, i) => (
            <li key={`k-${i}`} className="flex items-baseline gap-2">
              <span className={`font-mono font-semibold ${raidesDydis}`}>
                {String.fromCharCode(65 + i)})
              </span>
              <Formule tekstas={p.kaire} className={dydis} />
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-2">
          {uzdavinys.poros.map((p, i) => (
            <li key={`d-${i}`} className="flex items-baseline gap-2">
              <span className={`font-mono font-semibold ${raidesDydis}`}>{i + 1})</span>
              <Formule tekstas={p.desine} className={dydis} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (uzdavinys.formatas === 'eiliskumas' && uzdavinys.elementai) {
    return (
      <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
        {uzdavinys.elementai.map((e, i) => (
          <li key={i} className="flex items-baseline gap-2">
            <span className={`font-mono font-semibold ${raidesDydis}`}>
              {String.fromCharCode(65 + i)})
            </span>
            <Formule tekstas={e} className={dydis} />
          </li>
        ))}
      </ul>
    )
  }

  return null
}

/**
 * Kaip užrašyti atsakymą, kai jis raidinis.
 *
 * Porų ir eiliškumo uždaviniuose atsakymas yra raidžių eilutė („A2 B1 C3“),
 * ir be užuominos vaikas nežino, ko iš jo prašoma.
 */
export function atsakymoUzuomina(uzdavinys: Uzdavinys): string | null {
  if (uzdavinys.formatas === 'poros') {
    return 'Atsakymą užrašyk poromis, pavyzdžiui: A2 B1 C3'
  }
  if (uzdavinys.formatas === 'eiliskumas') {
    return 'Atsakymą užrašyk raidėmis teisinga tvarka, pavyzdžiui: C A B'
  }
  return null
}

export default UzdavinioFormatas
