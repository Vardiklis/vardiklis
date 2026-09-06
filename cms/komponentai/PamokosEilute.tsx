'use client'

import { useRowLabel } from '@payloadcms/ui'
import { santrauka, type Pamoka } from '@/lib/pamokos'

/**
 * Pamokos eilutės antraštė mokinio kortelėje.
 *
 * Numatytai Payload rašo „Pamoka 01“, „Pamoka 02“ — o su pasikartojimais tai
 * jau nieko nepasako. Čia rodoma tai, ką žmogus ir nori pamatyti suskleistoje
 * eilutėje: „Kas 2 sav., pirmadieniais 17:00“.
 */
export function PamokosEilute() {
  const { data, rowNumber } = useRowLabel<Pamoka>()
  return <span>{data?.laikas ? santrauka(data) : `Pamoka ${(rowNumber ?? 0) + 1}`}</span>
}
