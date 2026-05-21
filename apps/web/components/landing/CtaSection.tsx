import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20 border border-blue-500/20 p-12 md:p-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Mulai simpan file kamu
            <br />
            <span className="text-blue-400">sekarang, gratis</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            15 GB gratis selamanya. Tidak butuh kartu kredit. Bisa upgrade kapan saja kalau perlu lebih banyak ruang.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 text-lg transition-all hover:scale-105"
            >
              Daftar Gratis Sekarang
            </Link>
            <Link
              href="/download"
              className="rounded-2xl border border-white/10 hover:border-white/30 text-white/80 hover:text-white font-medium px-10 py-4 text-lg transition-all"
            >
              📱 Download App
            </Link>
          </div>
          <p className="text-white/30 text-sm mt-6">
            Sudah tersedia di App Store dan Google Play
          </p>
        </div>
      </div>
    </section>
  )
}
