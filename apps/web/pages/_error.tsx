// Custom error page to prevent Next.js legacy _error.js from using HeadManagerContext
// (which breaks static export prerender). This minimal override avoids useContext calls.
import type { NextPageContext } from 'next'

interface ErrorProps {
  statusCode?: number
}

export default function Error({ statusCode }: ErrorProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', textAlign: 'center', padding: '0 24px', fontFamily: 'sans-serif', background: '#FAFAF8' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 10px' }}>
        {statusCode === 404 ? '404 — Halaman Tidak Ditemukan' : 'Terjadi Kesalahan'}
      </h2>
      <p style={{ color: '#888', marginBottom: 24 }}>Silakan kembali ke beranda.</p>
      <a href="/" style={{ background: '#1A56DB', color: 'white', textDecoration: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600 }}>Beranda</a>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? (err as NodeJS.ErrnoException & { statusCode?: number }).statusCode : 404
  return { statusCode }
}
