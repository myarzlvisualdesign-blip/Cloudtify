'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Apakah benar 15 GB gratis selamanya?',
    a: 'Iya, 100% benar. Tidak ada trial dengan deadline, tidak ada kartu kredit dibutuhkan. Selama akun aktif (login min. 1× per 12 bulan), 15 GB tetap milikmu.',
  },
  {
    q: 'Bagaimana cara bayar pakai GoPay / DANA / QRIS?',
    a: 'Di halaman upgrade, pilih paket lalu metode pembayaran. Kami pakai integrasi langsung ke Midtrans, jadi proses bayar selesai dalam <60 detik. Saldo storage langsung naik begitu pembayaran berhasil.',
  },
  {
    q: 'Server-nya di mana? Aman tidak?',
    a: 'Primary di Jakarta (Cloudflare R2 region SEA) + replica di Singapura untuk redundansi. Semua file dienkripsi at-rest pakai AES-256-GCM dan in-transit pakai TLS 1.3. Patuh UU PDP & GDPR.',
  },
  {
    q: 'Bisa upload file besar (>1 GB)?',
    a: 'Paket Pro & Business pakai multipart upload, jadi bisa sampai 50 GB / file (Pro) atau unlimited (Business). Upload otomatis di-pause kalau koneksi drop, lalu resume setelah online.',
  },
  {
    q: 'Apakah file saya akan dihapus kalau saya tidak login lama?',
    a: 'Free: tidak dihapus selama login min. 1× per 12 bulan. Pro & Business: tidak ada batasan inaktivitas. Kalau akun mau dihentikan, kami selalu kasih notifikasi via email 60 hari sebelumnya.',
  },
  {
    q: 'Bisa cancel kapan saja?',
    a: 'Bisa. Tidak ada commitment, tidak ada early-termination fee. Cancel, dan akun otomatis turun ke Free pada akhir billing period. File tetap aman, hanya quota mengecil.',
  },
  {
    q: 'Bagaimana dengan tim besar atau enterprise?',
    a: 'Untuk team >10 user atau kebutuhan custom (SSO, dedicated infra, kontrak tahunan, custom SLA), email enterprise@cloudtify.com — biasanya kami balas dalam 1 hari kerja.',
  },
  {
    q: 'Apa bedanya Cloudtify dengan Google Drive / Dropbox?',
    a: 'Tiga hal: (1) Harga jauh lebih murah — Pro Cloudtify Rp15.000/bln, Google One setara Rp45.000/bln. (2) Server di Asia Tenggara, latensi <50ms vs Google ~120ms. (3) Bayar pakai e-wallet — tidak perlu kartu kredit internasional.',
  },
]

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-[#FAFAF8] py-24 sm:py-32 px-5">
      <div className="section-inner max-w-3xl">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#1A56DB]">
            <span className="w-6 h-px bg-[#1A56DB]" /> FAQ
          </span>
          <h2 className="font-display font-extrabold text-[#141110] tracking-super-tight mt-4 text-4xl sm:text-5xl lg:text-6xl leading-[1.04]">
            Pertanyaan yang <span className="gradient-text">sering ditanya.</span>
          </h2>
          <p className="mt-5 text-[#494440] text-lg">
            Tidak nemu jawabannya?{' '}
            <a href="mailto:halo@cloudtify.com" className="text-[#1A56DB] font-semibold hover:underline">
              Email kami →
            </a>
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border transition-all ${
                  isOpen ? 'border-[#1A56DB]/30 shadow-elev-2' : 'border-[#E5E2DD] hover:border-[#CCC8C1]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-[#141110] text-base sm:text-lg leading-tight">
                    {f.q}
                  </span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isOpen ? 'bg-[#EBF0FF] text-[#1A56DB]' : 'bg-[#F2F0ED] text-[#6B6560]'}`}>
                    <ChevronIcon open={isOpen} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-[#494440] text-[15px] leading-relaxed">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
