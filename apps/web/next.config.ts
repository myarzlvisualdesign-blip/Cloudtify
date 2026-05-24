import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudtify.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  // Fix: paksa root workspace ke Cloudtify, bukan /Users/a1
  outputFileTracingRoot: path.join(__dirname, '../../'),
}

export default nextConfig
