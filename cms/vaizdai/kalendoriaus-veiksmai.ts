'use server'

import { headers as gautiAntrastes } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { irasykPamoka, perkelkPamoka, sukurkPamoka, type Vieta } from '@/lib/kalendorius'
import { arAdministratorius } from '@/cms/prieiga'

/**
 * Kalendoriaus veiksmai.
 *
 * Tos pačios taisyklės kaip sąskaitų lange (`./veiksmai.ts`): kiekvienas
 * veiksmas tikrina prisijungimą, nes serverio veiksmas yra viešas galinis
 * taškas, o klaida grąžinama tekstu, kad ją būtų galima parodyti pranešimu.
 */

export type KalendoriausRezultatas = {
  pavyko: boolean
  zinute: string
  /** Įrašas, kurį atidaryti. */
  id?: string
}

const KELIAS = '/admin/kalendorius'

async function butinaPrisijungti(): Promise<void> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await gautiAntrastes() })
  if (!arAdministratorius(user)) throw new Error('Neprisijungta.')
}

async function veiksmas(
  darbas: () => Promise<KalendoriausRezultatas>,
): Promise<KalendoriausRezultatas> {
  try {
    await butinaPrisijungti()
    const rezultatas = await darbas()
    revalidatePath(KELIAS)
    return rezultatas
  } catch (klaida) {
    console.error('[kalendorius] veiksmas nulūžo:', klaida)
    return { pavyko: false, zinute: String(klaida).replace(/^Error:\s*/, '').slice(0, 300) }
  }
}

/** Iš naršyklės ateina bet kas — paliekam tik tai, ką `Vieta` gali turėti. */
function vieta(reiksme: unknown): Vieta | null {
  const v = reiksme as Partial<Record<keyof Vieta, unknown>> | null
  if (!v || typeof v.data !== 'string' || typeof v.laikas !== 'string') return null
  const id = (x: unknown) => (typeof x === 'string' && /^\d+$/.test(x) ? x : null)
  return { data: v.data, laikas: v.laikas, mokinys: id(v.mokinys), grupe: id(v.grupe) }
}

/** Pamoka, kuri kol kas tik tvarkaraštyje, gauna įrašą — ir jį galima atidaryti. */
export async function atidarykVeiksmas(kur: Vieta): Promise<KalendoriausRezultatas> {
  return veiksmas(async () => {
    const v = vieta(kur)
    if (!v) throw new Error('Nežinau, kurią pamoką atidaryti.')
    const [id] = await irasykPamoka(v)
    return { pavyko: true, zinute: '', id }
  })
}

export async function perkelkVeiksmas(
  kas: { vieta: Vieta | null; irasoId: string | null },
  data: string,
  laikas: string,
): Promise<KalendoriausRezultatas> {
  return veiksmas(async () => {
    const irasoId =
      typeof kas?.irasoId === 'string' && /^\d+$/.test(kas.irasoId) ? kas.irasoId : null
    const zinute = await perkelkPamoka({ vieta: vieta(kas?.vieta), irasoId }, data, laikas)
    return { pavyko: true, zinute }
  })
}

export async function sukurkVeiksmas(
  kam: string,
  data: string,
  laikas: string,
  trukme: number,
): Promise<KalendoriausRezultatas> {
  return veiksmas(async () => ({
    pavyko: true,
    zinute: await sukurkPamoka(String(kam), String(data), String(laikas), Number(trukme)),
  }))
}
