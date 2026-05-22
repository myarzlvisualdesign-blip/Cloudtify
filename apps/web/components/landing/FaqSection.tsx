'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const FAQS = [
  { q: 'Apakah Cloudtify benar-benar gratis?', a: 'Ya. Paket Free memberikan 15 GB storage secara gratis selamanya. Tidak perlu kartu kredit untuk mendaftar.' },
  { q: 'Metode pembayaran apa yang tersedia?', a: 'Kami mendukung GoPay, DANA, OVO, ShopeePay, QRIS, Virtual Account (BCA, Mandiri, BNI, BRI), serta kartu kredit dan debit. Semua diproses aman via Midtrans terdaftar OJK.' },
  { q: 'Apakah file saya aman?', a: 'Ya. Semua file dienkripsi AES-256 saat disimpan (at-rest) dan TLS saat ditransfer (in-transit). Infrastruktur berjalan di atas Cloudflare R2 dengan standar keamanan enterprise.' },
  { q: 'Apa yang terjadi jika storage penuh?', a: 'Kamu tidak bisa upload file baru, namun semua file yang sudah ada tetap aman dan bisa diakses. Upgrade paket atau hapus beberapa file untuk dapat mengupload lagi.' },
  { q: 'Bisakah saya berbagi file tanpa akun penerima?', a: 'Ya. Buat link berbagi yang bisa diakses siapa saja tanpa login. Tambahkan password dan tanggal kadaluarsa untuk keamanan ekstra (tersedia di paket Plus ke atas).' },
  { q: 'Bagaimana cara membatalkan langganan?', a: 'Batalkan kapan saja dari Pengaturan › Langganan. Akses premium tetap aktif hingga akhir periode yang sudah dibayar, tanpa biaya tambahan.' },
  { q: 'Apakah ada aplikasi mobile?', a: 'Ya. Cloudtify tersedia di App Store (iOS) dan Google Play (Android). Ringan, responsif, dan mendukung dark mode.' },
  { q: 'Ada bonus untuk mengajak teman?', a: 'Ada. Setiap teman yang mendaftar lewat referral kamu, kamu dan temanmu masing-masing mendapat bonus storage tambahan. Detail di halaman Referral.' },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-[#FAFAF8] px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12">
          <p className="text-[#1A56DB] text-xs font-semibold tracking-widest uppercase mb-3">FAQ</p>
          <h2 className="font-display font-extrabold text-[#141110] text-3xl md:text-4xl leading-tight tracking-tight mb-4">
            Pertanyaan yang sering ditanyakan
          </h2>
          <p className="text-[#A8A29E] text-sm">
            Tidak menemukan jawaban?{' '}
            <a href="mailto:support@cloudtify.com" className="text-[#1A56DB] hover:underline font-medium">
              Email kami
            </a>
          </p>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={false}
              className="bg-white rounded-2xl border border-[#E5E2DD] overflow-hidden transition-colors"
              style={{ borderColor: open === i ? '#C2D0F8' : undefined }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-[#FAFAF8] transition-colors">
                <span className="font-display font-semibold text-[#141110] text-sm leading-snug">{faq.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="flex-shrink-0 w-6 h-6 rounded-full border border-[#E5E2DD] flex items-center justify-center text-[#A8A29E]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.26, ease: "easeOut" }}>
                    <div className="px-6 pb-5">
                      <p className="text-[#6B6560] text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
