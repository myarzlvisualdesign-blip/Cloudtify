const FEATURES = [
  { icon: '⚡', title: 'Upload Super Cepat', desc: 'Teknologi chunked upload & CDN Cloudflare. Kencang bahkan di koneksi lambat.', color: '#FFF7ED', iconBg: '#FED7AA' },
  { icon: '🔒', title: 'Keamanan Tinggi', desc: 'Enkripsi at-rest & in-transit. Link berbagi bisa diproteksi password.', color: '#F0FDF4', iconBg: '#BBF7D0' },
  { icon: '🇮🇩', title: 'Made for Indonesia', desc: 'Bahasa Indonesia, GoPay, DANA, OVO, ShopeePay, QRIS. Harga dalam Rupiah.', color: '#EFF6FF', iconBg: '#BFDBFE' },
  { icon: '📱', title: 'App Mobile Premium', desc: 'iOS & Android ringan, cepat, elegan. Dark mode. Preview foto & video langsung.', color: '#F5F3FF', iconBg: '#DDD6FE' },
  { icon: '🗑️', title: 'Recycle Bin 30 Hari', desc: 'File terhapus aman di sampah 30 hari. Pulihkan kapan saja.', color: '#FFF1F2', iconBg: '#FECDD3' },
  { icon: '🔗', title: 'Berbagi Mudah & Aman', desc: 'Buat link berbagi. Atur password, batas waktu, & max unduhan.', color: '#F0FDF4', iconBg: '#BBF7D0' },
  { icon: '📊', title: 'Pantau Storage', desc: 'Dashboard storage jelas per kategori: foto, video, dokumen.', color: '#EFF6FF', iconBg: '#BFDBFE' },
  { icon: '🎁', title: 'Program Referral', desc: 'Ajak teman, dapat bonus storage ekstra. Semakin banyak semakin besar.', color: '#FEFCE8', iconBg: '#FEF08A' },
]

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Fitur Unggulan</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            Semua yang kamu butuhkan,
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
              dalam satu aplikasi
            </span>
          </h2>
          <p className="text-[#64748B] text-base max-w-md mx-auto">
            Didesain dari nol untuk pengguna Indonesia. Simple, cepat, dan tidak ribet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feat) => (
            <div key={feat.title} className="card-hover p-6 group cursor-default" style={{ background: feat.color }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110" style={{ background: feat.iconBg }}>
                {feat.icon}
              </div>
              <h3 className="text-[#0F172A] font-bold text-base mb-2">{feat.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
