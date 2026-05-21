const TESTIMONIALS = [
  {
    name: 'Budi Santoso',
    role: 'Mahasiswa UI',
    avatar: 'BS',
    text: 'Akhirnya ada cloud storage yang murah dan bayarnya bisa pakai GoPay. Upload tugas jadi gampang banget, UI-nya juga bersih.',
  },
  {
    name: 'Dewi Rahayu',
    role: 'Fotografer Freelance',
    avatar: 'DR',
    text: 'Saya pakai paket Pro untuk backup foto klien. 500 GB sangat cukup dan harganya jauh lebih murah dari kompetitor. Highly recommended!',
  },
  {
    name: 'Agus Pratama',
    role: 'Owner UMKM',
    avatar: 'AP',
    text: 'Cloudtify bantu saya berbagi file ke klien dengan link yang bisa diproteksi password. Professional banget kesannya.',
  },
  {
    name: 'Sari Indah',
    role: 'Guru SD',
    avatar: 'SI',
    text: 'Gratis 15 GB sudah lebih dari cukup untuk saya. Backup foto keluarga aman, bisa diakses dari mana saja. Makasih Cloudtify!',
  },
]

export function TestimonialsSection() {
  return (
    <section className="px-6 py-24 bg-[#060B14]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Dipercaya pengguna Indonesia</h2>
          <p className="text-white/60">Bergabunglah dengan ribuan pengguna yang sudah menikmati Cloudtify</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl bg-[#0F172A] border border-white/5 p-6">
              <p className="text-white/80 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.role}</div>
                </div>
                <div className="ml-auto text-yellow-400 text-sm">★★★★★</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
