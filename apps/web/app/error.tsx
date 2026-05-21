'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="id">
      <body style={{ backgroundColor: '#0A0F1E', color: 'white', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, flexDirection: 'column', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 12px' }}>Terjadi Kesalahan</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
          Maaf, terjadi masalah teknis. Silakan coba lagi.
        </p>
        <button
          onClick={() => reset()}
          style={{ backgroundColor: '#2563EB', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', marginRight: '12px' }}
        >
          Coba Lagi
        </button>
        <a
          href="/"
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '16px', display: 'block' }}
        >
          Kembali ke Beranda
        </a>
      </body>
    </html>
  )
}
