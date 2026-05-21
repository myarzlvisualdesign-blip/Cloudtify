import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',           // Static export for Cloudflare Pages
  trailingSlash: true,
  images: {
    unoptimized: true,        // Required for static export
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudtify.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
  // Security headers (enforced via Cloudflare, but good to have)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
