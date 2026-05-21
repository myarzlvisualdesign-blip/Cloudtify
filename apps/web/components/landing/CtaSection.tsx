import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 60%, #06B6D4 100%)' }}>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4" style={{ background: 'white' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 translate-y-1/2 -translate-x-1/4" style={{ background: 'white' }} />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Mulai simpan file kamu
              <br />
              sekarang, gratis!
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-lg mx-auto">
              15 GB gratis selamanya. Tidak butuh kartu kredit.
              Upgrade kapan saja kalau perlu lebih banyak ruang.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="bg-white text-blue-600 font-bold px-10 py-4 rounded-2xl text-lg transition-all hover:shadow-2xl hover:scale-105">
                Daftar Gratis Sekarang
              </Link>
              <Link href="/download" className="border-2 border-white/40 hover:border-white text-white font-semibold px-10 py-4 rounded-2xl text-lg transition-all">
                📱 Download App
              </Link>
            </div>
            <p className="text-blue-200 text-sm mt-6">Sudah tersedia di App Store dan Google Play</p>
          </div>
        </div>
      </div>
    </section>
  )
}
