import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div
          className="relative rounded-3xl overflow-hidden px-8 py-16 md:px-16 md:py-20"
          style={{ background: 'linear-gradient(140deg, #0F2D8A 0%, #1A56DB 45%, #2B9FD4 100%)' }}>

          {/* Decorative rings — rgba white, NOT transparent */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-white/[0.08]"/>
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full border border-white/[0.06]"/>
          <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full border border-white/[0.06]"/>

          {/* Subtle dot pattern — rgba */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 1px)', backgroundSize: '28px 28px' }}/>

          <div className="relative max-w-xl">
            <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase mb-5">Mulai Sekarang</p>
            <h2 className="font-display font-extrabold text-white text-3xl md:text-4xl leading-tight tracking-tight mb-5">
              Simpan file kamu dengan<br/>aman — 15 GB gratis.
            </h2>
            <p className="text-blue-100/80 text-base mb-10 leading-relaxed max-w-sm">
              Tidak butuh kartu kredit. Upgrade kapan saja bila butuh lebih banyak ruang.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1A56DB] font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5 duration-200">
                Daftar Gratis Sekarang
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link href="/#pricing"
                className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white/50 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all duration-200">
                Lihat Paket
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
