const TESTIMONIALS = [
  {
    name: 'Budi Santoso',
    role: 'Mahasiswa UI',
    avatar: 'BS',
    color: '#EFF6FF',
    text: 'Akhirnya ada cloud storage yang murah dan bayarnya bisa pakai GoPay. Upload tugas jadi gampang banget, UI-nya juga bersih dan responsif.',
  },
  {
    name: 'Dewi Rahayu',
    role: 'Fotografer Freelance',
    avatar: 'DR',
    color: '#F5F3FF',
    text: 'Saya pakai Pro untuk backup foto klien. 500 GB sangat cukup dan harganya jauh lebih murah dari kompetitor. Highly recommended!',
  },
  {
    name: 'Agus Pratama',
    role: 'Owner UMKM',
    avatar: 'AP',
    color: '#F0FDF4',
    text: 'Cloudtify bantu saya berbagi file ke klien dengan link yang bisa diproteksi password. Terkesan profesional dan klien pun puas.',
  },
  {
    name: 'Sari Indah',
    role: 'Guru SD',
    avatar: 'SI',
    color: '#FEFCE8',
    text: 'Gratis 15 GB sudah lebih dari cukup untuk saya. Backup foto keluarga aman, bisa diakses dari mana saja. Makasih Cloudtify!',
  },
]

export function TestimonialsSection() {
  return (
    <section className="px-6 py-20 bg-[#F8FAFF]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-50 text-amber-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Testimoni</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3">Dipercaya pengguna Indonesia</h2>
          <p className="text-[#64748B]">Bergabunglah dengan ribuan pengguna yang sudah menikmati Cloudtify</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card p-6 hover:shadow-md transition-shadow" style={{ background: t.color }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-[#374151] text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-[#0F172A] font-semibold text-sm">{t.name}</div>
                  <div className="text-[#94A3B8] text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
