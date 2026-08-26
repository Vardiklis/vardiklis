import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

// Aiškiai nurodom šaknį — aukščiau esantis package-lock.json klaidina Turbopack.
const saknis = fileURLToPath(new URL('.', import.meta.url))

// Statiniams puslapiams Next'as pats uždeda `s-maxage=31536000` (metus). Hostinger CDN
// tai gerbia, todėl po naujo diegimo krašte lieka SENAS HTML, rodantis į jau nebeegzuo-
// jančius `/_next/static/chunks/*` failus — iš to gaunam 404, dingusį dizainą ir
// ChunkLoadError. Trumpinam iki minutės, kad kešas pats atsistatytų.
const PUSLAPIO_KESAS = 'public, max-age=0, s-maxage=60, must-revalidate'

const nextConfig: NextConfig = {
  turbopack: { root: saknis },
  outputFileTracingRoot: saknis,
  images: {
    // Numatytoje eilėje tarp 384 ir 640 nieko nėra, o telefone hero nuotraukai
    // reikia ~420 px (≈210 CSS px × 2 DPR). Naršyklė tada šoka į 640 ir parsiunčia
    // beveik dvigubai daugiau pikselių, nei rodo. 480 tą tarpą užpildo.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 480],
    // Numatytai Next atiduoda tik WebP. AVIF tą patį kadrą supakuoja maždaug
    // trečdaliu mažiau; naršyklė, jo nemokanti, `Accept` antraštėje jo
    // neprašo ir gauna WebP, tad rizikos nėra.
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // `/apie` gyveno sitemap'e ir yra išdalintas nuorodomis. 308 (permanent)
      // perduoda visą surinktą svorį naujam adresui ir nepalieka 404.
      { source: '/apie', destination: '/matematikos-korepetitore', permanent: true },
    ]
  },
  async headers() {
    return [
      { source: '/', headers: [{ key: 'Cache-Control', value: PUSLAPIO_KESAS }] },
      {
        // Viskas, išskyrus statiką, Payload API ir admin skydelį.
        source: '/:kelias((?!_next/|api/|admin).+)',
        headers: [{ key: 'Cache-Control', value: PUSLAPIO_KESAS }],
      },
    ]
  },
}

export default withPayload(nextConfig)
