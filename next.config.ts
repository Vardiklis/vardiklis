import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Aiškiai nurodom šaknį — aukščiau esantis package-lock.json klaidina Turbopack.
  turbopack: {
    root: fileURLToPath(new URL('.', import.meta.url)),
  },
}

export default nextConfig
