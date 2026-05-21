import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="id">
      <body style={{ backgroundColor: '#0A0F1E', color: 'white', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, flexDirection: 'column', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>☁️</div>
        <h1 style={{ fontSize: '64px', fontWeight: 'bold', margin: '0 0 16px' }}>404</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '20px', marginBottom: '40px' }}>
          Halaman tidak ditemukan
        </p>
        <Link
          href="/"
          style={{ backgroundColor: '#2563EB', color: 'white', padding: '12px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '16px' }}
        >
          Kembali ke Beranda
        </Link>
      </body>
    </html>
  )
}
