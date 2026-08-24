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
