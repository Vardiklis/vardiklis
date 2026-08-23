import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Aiškiai nurodom šaknį — aukščiau esantis package-lock.json klaidina Turbopack.
  turbopack: {
    root: fileURLToPath(new URL('.', import.meta.url)),
  },
}

export default withPayload(nextConfig)
