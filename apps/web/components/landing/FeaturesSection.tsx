const FEATURES = [
  {
    icon: '⚡',
    title: 'Upload Super Cepat',
    desc: 'Teknologi chunked upload dan CDN Cloudflare memastikan file kamu diunggah secepat mungkin, bahkan di koneksi lambat.',
  },
  {
    icon: '🔒',
    title: 'Keamanan Tingkat Tinggi',
    desc: 'Enkripsi at-rest dan in-transit. Link berbagi bisa diproteksi password dan punya tanggal kadaluarsa.',
  },
  {
    icon: '🇮🇩',
    title: 'Dibuat untuk Indonesia',
    desc: 'Antarmuka Bahasa Indonesia, support GoPay, DANA, OVO, ShopeePay, dan QRIS. Harga dalam Rupiah.',
  },
  {
    icon: '📱',
    title: 'App Mobile Premium',
    desc: 'Aplikasi iOS dan Android yang ringan, cepat, dan elegan. Dark mode bawaan. Preview foto & video langsung di app.',
  },
  {
    icon: '🗑️',
    title: 'Recycle Bin 30 Hari',
    desc: 'File yang dihapus masuk sampah selama 30 hari. Bisa dipulihkan kapan saja sebelum dihapus permanen.',
  },
  {
    icon: '🔗',
    title: 'Berbagi Mudah & Aman',
    desc: 'Bagikan file via link. Atur password, batas waktu akses, dan jumlah maksimal unduhan sesuai kebutuhan.',
  },
  {
    icon: '📊',
    title: 'Pantau Storage Kamu',
    desc: 'Dashboard storage yang jelas menampilkan penggunaan per kategori: foto, video, dokumen, dan lainnya.',
  },
  {
    icon: '🎁',
    title: 'Program Referral',
    desc: 'Undang teman dan dapatkan bonus storage ekstra. Semakin banyak yang kamu ajak, semakin besar bonusnya.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Semua yang kamu butuhkan,
            <br />
            <span className="text-cyan-400">dalam satu aplikasi</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Didesain dari nol untuk pengguna Indonesia. Simple, cepat, dan tidak norak.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="group rounded-2xl bg-[#0F172A] border border-white/5 p-6 hover:border-blue-500/30 hover:bg-[#111827] transition-all"
            >
              <div className="text-4xl mb-4">{feat.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{feat.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
