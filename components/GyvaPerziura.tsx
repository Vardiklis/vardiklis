'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Tiltas tarp CMS gyvos peržiūros ir šio puslapio.
 *
 * Payload peržiūros langas laukia žinutės „ready“ — kol jos negauna, nieko
 * nesiunčia. Išsaugojus (o straipsniai saugomi automatiškai kas sekundę) jis
 * atsiunčia `payload-document-event`, ir puslapis persikrauna iš serverio.
 *
 * Persikraunama tik po išsaugojimo, o ne po kiekvieno klavišo paspaudimo:
 * puslapį atvaizduoja serveris, tad dažnesnis atnaujinimas jį tik kankintų.
 *
 * Tikro `@payloadcms/live-preview-react` paketo neįsidiegiam sąmoningai —
 * čia jo reikėtų tik dėl šitų dešimties eilučių.
 */
export function GyvaPerziura() {
  const router = useRouter()

  useEffect(() => {
    const tikslas: Window | null = window.opener ?? (window.parent !== window ? window.parent : null)
    if (!tikslas) return

    tikslas.postMessage({ type: 'payload-live-preview', ready: true }, window.location.origin)

    const klausyk = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type === 'payload-document-event') router.refresh()
    }

    window.addEventListener('message', klausyk)
    return () => window.removeEventListener('message', klausyk)
  }, [router])

  return null
}

export default GyvaPerziura
