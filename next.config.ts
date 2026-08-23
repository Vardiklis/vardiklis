import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

// Aiškiai nurodom šaknį — aukščiau esantis package-lock.json klaidina Turbopack.
const saknis = fileURLToPath(new URL('.', import.meta.url))

const nextConfig: NextConfig = {
  turbopack: { root: saknis },
  // Savarankiškas serveris: `next build` sukuria .next/standalone/server.js.
  // Hostinger „Other“ režimui reikia būtent tokio įėjimo failo.
  output: 'standalone',
  outputFileTracingRoot: saknis,
}

export default withPayload(nextConfig)
