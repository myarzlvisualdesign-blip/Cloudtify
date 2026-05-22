import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'

const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Cloudtify — Cloud Storage Premium untuk Indonesia',
    template: '%s | Cloudtify',
  },
  description:
    'Cloud storage modern yang lebih murah, lebih cepat, dan lebih aman. 15 GB gratis. Bayar pakai GoPay, DANA, OVO, QRIS. Tersedia di iOS dan Android.',
  keywords: ['cloud storage', 'penyimpanan cloud', 'Indonesia', 'murah', 'GoPay', 'DANA'],
  authors: [{ name: 'Cloudtify' }],
  metadataBase: new URL('https://cloudtify.com'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://cloudtify.com',
    siteName: 'Cloudtify',
    title: 'Cloudtify — Cloud Storage Premium untuk Indonesia',
    description: 'Cloud storage modern yang lebih murah dan lebih cepat. 15 GB gratis selamanya.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloudtify',
    description: 'Cloud storage premium mulai Rp15.000/bulan',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${displayFont.variable} ${bodyFont.variable}`} style={{ background: '#FAFAF8' }}>
      <body className="bg-[#FAFAF8] antialiased font-sans">{children}</body>
    </html>
  )
}
