'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="id">
      <body style={{ backgroundColor: '#FAFAF8', color: '#141110', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, flexDirection: 'column', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: '#DC2626' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.02em' }}>Terjadi Kesalahan</h2>
        <p style={{ color: '#A8A29E', fontSize: 15, marginBottom: 32 }}>Maaf, terjadi masalah teknis. Silakan coba lagi.</p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => reset()} style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)', color: 'white', border: 'none', padding: '13px 32px', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>
            Coba Lagi
          </button>
          <a href="/" style={{ color: '#6B6560', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Kembali ke Beranda</a>
        </div>
      </body>
    </html>
  )
}
