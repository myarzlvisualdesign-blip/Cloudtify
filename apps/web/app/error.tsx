'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16, textAlign: 'center', padding: '0 24px', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Terjadi Kesalahan</h2>
      <p style={{ color: '#888', margin: 0 }}>Silakan coba lagi.</p>
      <button onClick={() => reset()} style={{ background: '#1A56DB', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>Coba Lagi</button>
      <a href="/" style={{ color: '#888', textDecoration: 'none' }}>Kembali ke Beranda</a>
    </div>
  )
}
