import { Navbar } from '../../../components/landing/Navbar'
import { FaqSection } from '../../../components/landing/FaqSection'
import { Footer } from '../../../components/landing/Footer'

export const metadata = {
  title: 'Pusat Bantuan — Cloudtify',
}

const TOPICS = [
  { icon: '🚀', title: 'Mulai Menggunakan', items: ['Cara daftar akun', 'Upload file pertama', 'Membuat folder', 'Berbagi file'], color: '#F0FDF4' },
  { icon: '💳', title: 'Pembayaran & Langganan', items: ['Cara upgrade paket', 'Metode pembayaran', 'Batalkan langganan', 'Minta refund'], color: '#EFF6FF' },
  { icon: '📁', title: 'Kelola File', items: ['Upload file besar', 'Download file', 'Pindahkan file', 'Pulihkan dari sampah'], color: '#FFF7ED' },
  { icon: '🔗', title: 'Berbagi & Privasi', items: ['Buat link berbagi', 'Password link', 'Atur kadaluarsa link', 'Cabut akses link'], color: '#F5F3FF' },
  { icon: '🔒', title: 'Akun & Keamanan', items: ['Ganti password', 'Logout semua perangkat', 'Hapus akun', 'Lapor akun mencurigakan'], color: '#FEFCE8' },
  { icon: '📱', title: 'Aplikasi Mobile', items: ['Download iOS app', 'Download Android app', 'Login di HP baru', 'Notifikasi push'], color: '#FFF1F2' },
]

export default function HelpPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20" style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #E0F2FE 100%)' }}>
        <div className="pt-12 pb-12 px-6 text-center max-w-3xl mx-auto">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Pusat Bantuan</span>
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Ada yang bisa kami bantu?</h1>
          <p className="text-[#64748B] text-base mb-8 max-w-md mx-auto">
            Temukan jawaban di sini atau hubungi tim kami langsung.
          </p>
          <div className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-2xl px-5 py-3.5 max-w-lg mx-auto shadow-sm">
            <span className="text-[#94A3B8]">🔍</span>
            <input type="text" placeholder="Cari bantuan..." className="bg-transparent text-[#0F172A] placeholder-[#CBD5E1] flex-1 outline-none text-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {TOPICS.map((topic) => (
            <div key={topic.title} className="card-hover p-6" style={{ background: topic.color }}>
              <div className="text-3xl mb-3">{topic.icon}</div>
              <h3 className="text-[#0F172A] font-bold text-base mb-3">{topic.title}</h3>
              <ul className="space-y-2">
                {topic.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-blue-500 hover:text-blue-700 text-sm transition-colors hover:underline">
                      {item} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center card p-10" style={{ background: 'linear-gradient(135deg, #EEF2FF, #E0F2FE)' }}>
          <p className="text-[#64748B] text-base mb-6">Tidak menemukan jawaban yang dicari?</p>
          <a href="mailto:support@cloudtify.com" className="inline-block text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:scale-105" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
            📧 Hubungi Support
          </a>
          <p className="text-[#94A3B8] text-xs mt-4">Rata-rata respons: 1–4 jam di hari kerja</p>
        </div>
      </div>

      <FaqSection />
      <Footer />
    </main>
  )
}
