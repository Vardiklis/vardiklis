'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DIENYNO_SLAPUKAS, dienynoKelias, prisijunk } from '@/lib/dienynas'
import { perDaznai } from '@/lib/greicio-riba'

/**
 * Dienyno serverio veiksmai.
 *
 * Bandymai ribojami dviem sluoksniais: Payload užrakina PASKYRĄ po 10 nesėkmių
 * (`cms/DienynoPaskyros.ts`), o čia ribojamas ADRESAS — kad vienas botas
 * negalėtų po truputį bandyti visų vardų iš eilės.
 */

export type PrisijungimoBusena = { klaida: string | null; vardas: string }

export async function prisijungti(
  _ankstesne: PrisijungimoBusena,
  forma: FormData,
): Promise<PrisijungimoBusena> {
  const vardas = String(forma.get('vardas') ?? '').slice(0, 100)
  const slaptazodis = String(forma.get('slaptazodis') ?? '').slice(0, 200)

  if (!vardas.trim() || !slaptazodis) {
    return { klaida: 'Įrašykite vardą ir slaptažodį.', vardas }
  }

  const h = await headers()
  const adresas = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'nezinomas'
  if (perDaznai('dienynas-prisijungimas', adresas, 20, 15 * 60 * 1000)) {
    return { klaida: 'Per daug bandymų. Pabandykite po 15 minučių.', vardas }
  }

  const rezultatas = await prisijunk(vardas, slaptazodis)
  if (!rezultatas.pavyko) {
    return {
      klaida:
        rezultatas.klaida === 'uzrakinta'
          ? 'Per daug neteisingų bandymų. Pabandykite po 15 minučių.'
          : 'Neteisingas vardas arba slaptažodis.',
      vardas,
    }
  }

  ;(await cookies()).set(DIENYNO_SLAPUKAS, rezultatas.slapukas, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: rezultatas.galiojaS,
  })

  redirect(await dienynoKelias('/'))
}

export async function atsijungti(): Promise<void> {
  ;(await cookies()).delete(DIENYNO_SLAPUKAS)
  redirect(await dienynoKelias('/prisijungti'))
}
