'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: 'Apakah Cloudtify benar-benar gratis?',
    a: 'Ya! Paket Free memberikan 15 GB storage secara gratis selamanya. Tidak perlu kartu kredit untuk mendaftar.',
  },
  {
    q: 'Metode pembayaran apa yang tersedia?',
    a: 'Kami mendukung GoPay, DANA, OVO, ShopeePay, QRIS, Transfer Bank, Virtual Account (BCA, Mandiri, BNI, BRI), dan kartu kredit/debit. Semua diproses secara aman via Midtrans yang terdaftar di OJK.',
  },
  {
    q: 'Apakah file saya aman?',
    a: 'Ya. Semua file dienkripsi saat disimpan (at-rest) dan saat ditransfer (in-transit). Kami menggunakan Cloudflare R2 sebagai storage, yang memiliki tingkat keamanan enterprise.',
  },
  {
    q: 'Apa yang terjadi jika storage saya penuh?',
    a: 'Kamu tidak bisa upload file baru. File yang sudah ada tetap aman dan bisa diakses. Kamu perlu upgrade paket atau hapus beberapa file untuk bisa upload lagi.',
  },
  {
    q: 'Bisakah saya berbagi file dengan orang yang tidak punya akun Cloudtify?',
    a: 'Ya! Kamu bisa membuat link berbagi yang bisa diakses siapa saja tanpa login. Kamu juga bisa mengatur password dan tanggal kadaluarsa untuk link tersebut (fitur Plus ke atas).',
  },
  {
    q: 'Bagaimana cara membatalkan langganan?',
    a: 'Kamu bisa membatalkan kapan saja dari menu Pengaturan > Langganan. Kamu masih bisa menggunakan layanan premium hingga akhir periode yang sudah dibayar.',
  },
  {
    q: 'Apakah ada aplikasi mobile?',
    a: 'Ya! Cloudtify tersedia di App Store (iOS) dan Play Store (Android). Aplikasinya ringan, cepat, dan mendukung dark mode.',
  },
  {
    q: 'Apakah ada bonus untuk mengajak teman?',
    a: 'Ada! Setiap teman yang kamu ajak dan berhasil daftar, kamu dan temanmu mendapat bonus storage ekstra. Cek menu Referral untuk detail lengkapnya.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Pertanyaan Umum</h2>
          <p className="text-white/60">Ada pertanyaan lain? Hubungi kami di support@cloudtify.com</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#0F172A] border border-white/5 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-white font-medium pr-4">{faq.q}</span>
                <span className={`text-white/40 text-xl transition-transform flex-shrink-0 ${openIndex === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
