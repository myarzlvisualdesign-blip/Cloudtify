import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-24 text-center">
      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          Cloud storage premium mulai Rp15.000/bulan
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Simpan semua file
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            lebih murah & lebih cepat
          </span>
        </h1>

        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Cloudtify adalah cloud storage modern yang dibuat untuk Indonesia.
          15 GB gratis selamanya. Upgrade kapan saja. Bayar pakai GoPay, DANA, atau QRIS.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/auth/register"
            className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 text-lg transition-all hover:scale-105"
          >
            Mulai Gratis — 15 GB
          </Link>
          <Link
            href="/#pricing"
            className="rounded-2xl border border-white/10 hover:border-white/30 text-white/80 hover:text-white font-medium px-8 py-4 text-lg transition-all"
          >
            Lihat Harga
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-white/40 text-sm">
          <span>✓ Tidak perlu kartu kredit</span>
          <span>✓ Bayar pakai e-wallet</span>
          <span>✓ Batalkan kapan saja</span>
          <span>✓ Server Asia Tenggara</span>
        </div>

        {/* App screenshot mockup */}
        <div className="mt-20 mx-auto max-w-3xl">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0F172A] shadow-2xl">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 bg-[#1E293B] rounded-lg h-7 flex items-center px-3">
                <span className="text-white/30 text-xs">app.cloudtify.com</span>
              </div>
            </div>
            <div className="p-8 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">☁️</div>
                <div className="text-white/60 text-sm">Dashboard Preview</div>
                <div className="mt-6 grid grid-cols-3 gap-3 max-w-xs mx-auto">
                  {['📸 Foto', '🎬 Video', '📄 Dokumen'].map((item) => (
                    <div key={item} className="bg-[#1E293B] rounded-xl p-3 text-center">
                      <div className="text-white/70 text-xs">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
