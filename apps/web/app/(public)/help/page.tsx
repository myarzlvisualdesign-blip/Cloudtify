import { Navbar } from '../../../components/landing/Navbar'
import { FaqSection } from '../../../components/landing/FaqSection'
import { Footer } from '../../../components/landing/Footer'
import { Card } from '../../../components/ui/Card'
import { Icon, type IconKey } from '../../../components/ui/icons'

export const metadata = { title: 'Pusat Bantuan' }

const TOPICS: { icon: IconKey; title: string; items: string[]; accent: string }[] = [
  { icon: 'upload', title: 'Mulai Menggunakan', items: ['Cara daftar akun', 'Upload file pertama', 'Membuat folder', 'Berbagi file'], accent: '#059669' },
  { icon: 'card', title: 'Pembayaran & Langganan', items: ['Cara upgrade paket', 'Metode pembayaran', 'Batalkan langganan', 'Minta refund'], accent: '#1A56DB' },
  { icon: 'folder', title: 'Kelola File', items: ['Upload file besar', 'Download file', 'Pindahkan file', 'Pulihkan dari sampah'], accent: '#D97706' },
  { icon: 'share', title: 'Berbagi & Privasi', items: ['Buat link berbagi', 'Password link', 'Atur kadaluarsa link', 'Cabut akses link'], accent: '#7C3AED' },
  { icon: 'shield', title: 'Akun & Keamanan', items: ['Ganti password', 'Logout semua perangkat', 'Hapus akun', 'Lapor akun mencurigakan'], accent: '#DC2626' },
  { icon: 'download', title: 'Aplikasi Mobile', items: ['Download iOS app', 'Download Android app', 'Login di HP baru', 'Notifikasi push'], accent: '#0891B2' },
]

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <div className="pt-20" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(26,86,219,0.08) 0%, rgba(250,250,248,0) 70%)' }}>
        <div className="pt-14 pb-12 px-6 text-center max-w-3xl mx-auto">
          <p className="text-[#1A56DB] text-xs font-semibold tracking-widest uppercase mb-3">Pusat Bantuan</p>
          <h1 className="font-display font-extrabold text-[#141110] text-3xl md:text-4xl tracking-tight mb-4">Ada yang bisa kami bantu?</h1>
          <p className="text-[#6B6560] text-base mb-8 max-w-md mx-auto">Temukan jawaban di sini atau hubungi tim kami langsung.</p>
          <div className="flex items-center gap-3 bg-white border border-[#E5E2DD] rounded-2xl px-5 py-3.5 max-w-lg mx-auto shadow-sm">
            <span className="text-[#A8A29E]"><Icon.search size={18} /></span>
            <input type="text" placeholder="Cari bantuan…" className="bg-transparent text-[#141110] placeholder-[#C2BDB8] flex-1 outline-none text-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {TOPICS.map((topic) => {
            const IconCmp = Icon[topic.icon]
            return (
              <Card key={topic.title} hover className="p-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: topic.accent + '14', color: topic.accent }}>
                  <IconCmp size={20} />
                </div>
                <h3 className="font-display font-bold text-[#141110] text-base mb-3">{topic.title}</h3>
                <ul className="space-y-2">
                  {topic.items.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-[#6B6560] hover:text-[#1A56DB] text-sm transition-colors">{item} →</a>
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>

        <div className="text-center rounded-2xl border border-[#E5E2DD] p-10" style={{ background: 'linear-gradient(135deg, #EBF0FF, #F2F0ED)' }}>
          <p className="text-[#6B6560] text-base mb-6">Tidak menemukan jawaban yang dicari?</p>
          <a href="mailto:support@cloudtify.com" className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-[#1A56DB]/25" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
            <Icon.file size={16} /> Hubungi Support
          </a>
          <p className="text-[#A8A29E] text-xs mt-4">Rata-rata respons: 1–4 jam di hari kerja</p>
        </div>
      </div>

      <FaqSection />
      <Footer />
    </main>
  )
}
