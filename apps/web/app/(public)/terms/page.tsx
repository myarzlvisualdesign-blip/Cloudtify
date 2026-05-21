import { Navbar } from '../../../components/landing/Navbar'
import { Footer } from '../../../components/landing/Footer'

export const metadata = {
  title: 'Syarat & Ketentuan — Cloudtify',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl font-bold mb-2">Syarat & Ketentuan</h1>
        <p className="text-white/40 text-sm mb-12">Terakhir diperbarui: 1 Januari 2026</p>

        {[
          {
            title: '1. Penerimaan Syarat',
            content: 'Dengan menggunakan Cloudtify, kamu menyetujui syarat dan ketentuan ini. Jika tidak setuju, harap berhenti menggunakan layanan kami.',
          },
          {
            title: '2. Penggunaan Layanan',
            content: 'Layanan ini hanya boleh digunakan untuk tujuan yang sah. Dilarang menyimpan atau membagikan konten ilegal, melanggar hak cipta, mengandung malware, atau konten yang melanggar hukum Indonesia.',
          },
          {
            title: '3. Akun dan Keamanan',
            content: 'Kamu bertanggung jawab atas keamanan akun dan semua aktivitas yang terjadi di bawah akunmu. Segera laporkan akses tidak sah ke support@cloudtify.com.',
          },
          {
            title: '4. Pembayaran dan Langganan',
            content: 'Langganan berbayar diperbarui secara otomatis kecuali dibatalkan. Pembatalan dapat dilakukan kapan saja melalui halaman pengaturan. Refund tidak tersedia untuk periode yang sudah berjalan, kecuali diwajibkan oleh hukum.',
          },
          {
            title: '5. Kepemilikan Konten',
            content: 'Kamu mempertahankan hak penuh atas file yang kamu unggah. Cloudtify tidak mengklaim kepemilikan atas konten pengguna. Kami hanya mengakses file ketika diperlukan untuk menyediakan layanan.',
          },
          {
            title: '6. Batasan Layanan',
            content: 'Cloudtify berhak membatasi, menangguhkan, atau menghentikan akun yang melanggar syarat ini. Kami tidak bertanggung jawab atas kehilangan data akibat penggunaan yang tidak sesuai.',
          },
          {
            title: '7. Perubahan Layanan',
            content: 'Cloudtify berhak mengubah harga, fitur, atau syarat dengan pemberitahuan 30 hari sebelumnya. Penggunaan lanjutan setelah perubahan dianggap sebagai penerimaan syarat baru.',
          },
          {
            title: '8. Hukum yang Berlaku',
            content: 'Syarat ini diatur oleh hukum Republik Indonesia. Sengketa diselesaikan melalui Badan Arbitrase Nasional Indonesia (BANI) di Jakarta.',
          },
        ].map((section) => (
          <section key={section.title} className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
            <p className="text-white/60 leading-relaxed">{section.content}</p>
          </section>
        ))}

        <div className="mt-12 p-4 bg-[#0F172A] rounded-xl border border-white/5">
          <p className="text-white/40 text-sm">Pertanyaan? Hubungi kami di <a href="mailto:legal@cloudtify.com" className="text-blue-400">legal@cloudtify.com</a></p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
