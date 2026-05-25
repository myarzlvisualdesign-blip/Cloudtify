'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Apakah benar 15 GB gratis selamanya?',
    a: 'Benar. Tidak ada masa uji coba berbatas waktu dan kami tidak meminta kartu kredit saat Anda mendaftar. Selama akun masih aktif (minimal sekali masuk dalam 12 bulan), kuota 15 GB tetap menjadi milik Anda.',
  },
  {
    q: 'Bagaimana proses pembayaran menggunakan e-wallet dan QRIS?',
    a: 'Pada halaman langganan, pilih paket dan metode pembayaran yang Anda inginkan. Transaksi diproses melalui mitra pembayaran resmi kami dan biasanya selesai dalam waktu kurang dari 60 detik. Kuota Anda diperbarui otomatis setelah pembayaran terkonfirmasi.',
  },
  {
    q: 'Di mana data saya disimpan dan bagaimana keamanannya?',
    a: 'Penyimpanan utama berada di Jakarta dengan replika di Singapura untuk redundansi. Setiap berkas dienkripsi menggunakan AES-256-GCM saat disimpan dan TLS 1.3 saat ditransfer. Operasi kami patuh pada Undang-Undang Pelindungan Data Pribadi Indonesia.',
  },
  {
    q: 'Berapa ukuran berkas maksimum yang dapat diunggah?',
    a: 'Paket Pro mendukung berkas hingga 50 GB per unggahan, sementara paket Business tidak memiliki batasan ukuran. Sistem unggah kami otomatis menjeda saat koneksi terputus dan melanjutkan dari titik terakhir setelah jaringan tersedia kembali.',
  },
  {
    q: 'Apakah berkas saya bisa terhapus karena akun tidak aktif?',
    a: 'Pada paket gratis, akun perlu masuk minimal sekali dalam 12 bulan. Paket Pro dan Business tidak memiliki batasan keaktifan. Sebelum tindakan apa pun, kami akan mengirimkan pemberitahuan melalui surel 60 hari sebelumnya.',
  },
  {
    q: 'Apakah saya dapat membatalkan langganan kapan saja?',
    a: 'Tentu. Tidak ada kontrak jangka panjang dan tidak ada biaya pemutusan dini. Setelah pembatalan, akun Anda akan kembali ke paket gratis pada akhir siklus penagihan, dan seluruh berkas tetap utuh.',
  },
  {
    q: 'Bagaimana untuk kebutuhan tim atau perusahaan?',
    a: 'Untuk tim dengan lebih dari 10 pengguna atau kebutuhan khusus seperti SSO, infrastruktur khusus, kontrak tahunan, dan SLA kustom, silakan hubungi enterprise@cloudtify.com. Tim kami biasanya merespons dalam satu hari kerja.',
  },
  {
    q: 'Apa yang membedakan Cloudtify?',
    a: 'Tiga hal yang konsisten kami prioritaskan: (1) Harga dalam mata uang Rupiah dengan struktur transparan yang sesuai kantong pengguna Indonesia. (2) Infrastruktur lokal di Asia Tenggara untuk latensi rendah dan kepatuhan pada UU PDP. (3) Pembayaran melalui e-wallet, transfer bank, dan QRIS — tanpa membutuhkan kartu kredit internasional.',
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
            Pertanyaan yang <span className="gradient-text">sering kami terima.</span>
          </h2>
          <p className="mt-5 text-[#494440] text-lg">
            Belum menemukan jawabannya?{' '}
            <a href="mailto:halo@cloudtify.com" className="text-[#1A56DB] font-semibold hover:underline">
              Kirim surel kepada kami →
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
