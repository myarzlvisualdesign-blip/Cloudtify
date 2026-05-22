import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="id">
      <body style={{ backgroundColor: '#FAFAF8', color: '#141110', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, flexDirection: 'column', textAlign: 'center', padding: '0 24px' }}>
        <svg width="64" height="64" viewBox="0 0 40 40" fill="none" style={{ marginBottom: 28 }} aria-hidden="true">
          <defs>
            <linearGradient id="nf" x1="8" y1="30" x2="32" y2="10" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E6FE0" /><stop offset="1" stopColor="#5BB8FF" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="11" fill="#0B1530" />
          <path d="M14.2 27.5h12.4a5.2 5.2 0 0 0 1.1-10.28 7.2 7.2 0 0 0-13.3-1.86 5.5 5.5 0 0 0-.2 12.14Z" fill="none" stroke="url(#nf)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 style={{ fontSize: 64, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.03em' }}>404</h1>
        <p style={{ color: '#A8A29E', fontSize: 18, marginBottom: 36 }}>Halaman yang kamu cari tidak ditemukan.</p>
        <Link href="/" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)', color: 'white', padding: '13px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
          Kembali ke Beranda
        </Link>
      </body>
    </html>
  )
}
