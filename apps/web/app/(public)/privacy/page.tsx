import { Navbar } from '../../../components/landing/Navbar'
import { Footer } from '../../../components/landing/Footer'

export const metadata = {
  title: 'Kebijakan Privasi — Cloudtify',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl font-bold mb-2">Kebijakan Privasi</h1>
        <p className="text-white/40 text-sm mb-12">Terakhir diperbarui: 1 Januari 2026</p>

        {[
          {
            title: '1. Data yang Kami Kumpulkan',
            content: `Kami mengumpulkan data yang kamu berikan secara langsung saat mendaftar (nama, alamat email) dan data yang dihasilkan saat menggunakan layanan (file yang diunggah, aktivitas akun, log teknis). Kami tidak menjual data kamu kepada pihak ketiga.`,
          },
          {
            title: '2. Bagaimana Kami Menggunakan Data',
            content: `Data digunakan untuk: menyediakan layanan penyimpanan cloud, memproses pembayaran, mengirim notifikasi penting, meningkatkan layanan, dan mematuhi kewajiban hukum. Kami tidak membagikan data pribadi kepada pihak ketiga kecuali yang diperlukan untuk menjalankan layanan (payment gateway, layanan email).`,
          },
          {
            title: '3. Keamanan Data',
            content: `File kamu dienkripsi saat disimpan (AES-256 at-rest) dan saat ditransfer (TLS 1.3 in-transit). Akses ke data dibatasi menggunakan Row Level Security (RLS) — hanya kamu yang bisa mengakses file milikmu. Token autentikasi disimpan secara aman di perangkatmu.`,
          },
          {
            title: '4. Retensi Data',
            content: `File aktif disimpan selama akun masih aktif. File yang dihapus masuk ke Recycle Bin selama 30 hari sebelum dihapus permanen. Log aktivitas disimpan selama 90 hari. Jika kamu menghapus akun, semua data dihapus permanen dalam 30 hari.`,
          },
          {
            title: '5. Hak Kamu',
            content: `Kamu berhak untuk: mengakses data yang kami simpan, mengunduh salinan datamu, mengkoreksi data yang tidak akurat, dan menghapus akun beserta semua datamu. Untuk menggunakan hak ini, kunjungi halaman Pengaturan > Privasi atau hubungi privacy@cloudtify.com.`,
          },
          {
            title: '6. Cookie',
            content: `Kami menggunakan cookie yang diperlukan untuk autentikasi dan keamanan. Kami juga menggunakan cookie analitik (PostHog) untuk memahami cara pengguna menggunakan layanan kami. Kamu dapat menolak cookie analitik melalui pengaturan browser.`,
          },
          {
            title: '7. Hubungi Kami',
            content: `Pertanyaan seputar privasi dapat dikirimkan ke: privacy@cloudtify.com\nAlamat: Jakarta, Indonesia`,
          },
        ].map((section) => (
          <section key={section.title} className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
            <p className="text-white/60 leading-relaxed whitespace-pre-line">{section.content}</p>
          </section>
        ))}
      </div>
      <Footer />
    </main>
  )
}
