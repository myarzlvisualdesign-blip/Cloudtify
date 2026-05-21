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
  webpack: (config) => {
    // Pastikan hanya ada SATU instance React di seluruh build
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    }
    return config
  },
}

export default nextConfig
