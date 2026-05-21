import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-24">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-50"
          style={{ background: 'radial-gradient(ellipse, #BFDBFE, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(ellipse, #BAE6FD, transparent 70%)' }} />
        <div className="absolute top-60 -left-20 w-[300px] h-[300px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #C7D2FE, transparent 70%)' }} />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-600 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          Cloud storage premium mulai Rp15.000/bln
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 text-[#0F172A]">
          Simpan semua file<br />
          <span className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
            lebih murah &amp; cepat
          </span>
        </h1>

        <p className="text-[#64748B] text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Cloud storage modern untuk Indonesia. 15 GB gratis selamanya.
          Bayar pakai GoPay, DANA, OVO, atau QRIS.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link href="/auth/register"
            className="text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
            Mulai Gratis — 15 GB
          </Link>
          <Link href="/#pricing"
            className="bg-white text-[#2563EB] font-semibold px-8 py-4 rounded-2xl text-lg border-2 border-blue-200 transition-all hover:border-blue-400 hover:shadow-sm">
            Lihat Harga
          </Link>
        </div>

        {/* Checkmarks */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[#64748B] text-sm mb-12">
          {['✓ Tanpa kartu kredit', '✓ Bayar e-wallet', '✓ Batalkan kapan saja', '✓ Server SEA'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10">
          {[['50K+', 'Pengguna Aktif'], ['99.9%', 'Uptime'], ['4.8★', 'Rating App'], ['15 GB', 'Gratis Selamanya']].map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <div className="text-2xl font-bold text-[#0F172A]">{val}</div>
              <div className="text-xs text-[#94A3B8] mt-0.5">{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
