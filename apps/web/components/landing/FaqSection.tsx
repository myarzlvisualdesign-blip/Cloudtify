'use client'
import { useState } from 'react'

const FAQS = [
  { q: 'Apakah Cloudtify benar-benar gratis?', a: 'Ya! Paket Free memberikan 15 GB storage secara gratis selamanya. Tidak perlu kartu kredit untuk mendaftar.' },
  { q: 'Metode pembayaran apa yang tersedia?', a: 'Kami mendukung GoPay, DANA, OVO, ShopeePay, QRIS, Transfer Bank, Virtual Account (BCA, Mandiri, BNI, BRI), dan kartu kredit/debit. Semua diproses secara aman via Midtrans yang terdaftar di OJK.' },
  { q: 'Apakah file saya aman?', a: 'Ya. Semua file dienkripsi saat disimpan (at-rest) dan saat ditransfer (in-transit). Kami menggunakan Cloudflare R2 sebagai storage, yang memiliki tingkat keamanan enterprise.' },
  { q: 'Apa yang terjadi jika storage saya penuh?', a: 'Kamu tidak bisa upload file baru. File yang sudah ada tetap aman dan bisa diakses. Kamu perlu upgrade paket atau hapus beberapa file untuk bisa upload lagi.' },
  { q: 'Bisakah saya berbagi file dengan orang yang tidak punya akun?', a: 'Ya! Buat link berbagi yang bisa diakses siapa saja tanpa login. Atur password dan tanggal kadaluarsa untuk link tersebut (fitur Plus ke atas).' },
  { q: 'Bagaimana cara membatalkan langganan?', a: 'Batalkan kapan saja dari menu Pengaturan > Langganan. Kamu masih bisa menggunakan layanan premium hingga akhir periode yang sudah dibayar.' },
  { q: 'Apakah ada aplikasi mobile?', a: 'Ya! Cloudtify tersedia di App Store (iOS) dan Play Store (Android). Aplikasinya ringan, cepat, dan mendukung dark mode.' },
  { q: 'Apakah ada bonus untuk mengajak teman?', a: 'Ada! Setiap teman yang kamu ajak dan berhasil daftar, kamu dan temanmu mendapat bonus storage ekstra. Cek menu Referral untuk detail lengkapnya.' },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3">Pertanyaan Umum</h2>
          <p className="text-[#64748B]">Ada pertanyaan lain? Hubungi kami di <a href="mailto:support@cloudtify.com" className="text-blue-500 hover:underline">support@cloudtify.com</a></p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#F8FAFF] transition-colors"
              >
                <span className="text-[#0F172A] font-semibold pr-4 text-sm">{faq.q}</span>
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-blue-500 font-bold text-lg transition-transform"
                  style={{ background: '#EFF6FF', transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  +
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-[#64748B] text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
