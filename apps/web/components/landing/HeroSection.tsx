import Link from 'next/link'

function StorageRing({ used, total }: { used: number; total: number }) {
  const radius = 72
  const stroke = 10
  const normalizedRadius = radius - stroke / 2
  const circumference = 2 * Math.PI * normalizedRadius
  const percent = used / total
  const offset = circumference * (1 - percent)

  return (
    <div className="relative inline-flex items-center justify-center w-44 h-44">
      <svg width="176" height="176" viewBox="0 0 176 176" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx="88" cy="88" r={normalizedRadius} fill="none" stroke="#E8F0FF" strokeWidth={stroke} />
        <circle
          cx="88" cy="88" r={normalizedRadius} fill="none"
          stroke="url(#ringGrad)" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-[#0F172A]">{used} <span className="text-sm font-normal text-[#64748B]">GB</span></div>
        <div className="text-xs text-[#94A3B8]">/ {total} GB</div>
      </div>
    </div>
  )
}

function PhoneMockup() {
  return (
    <div className="relative w-[280px] rounded-[40px] overflow-hidden shadow-2xl shadow-blue-500/20 border-4 border-white" style={{ background: 'linear-gradient(160deg, #2563EB 0%, #0EA5E9 55%, #06B6D4 100%)' }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <span className="text-white/80 text-xs font-medium">Cloudtify</span>
        <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20 flex items-center justify-center text-xs">👤</div>
      </div>

      {/* Greeting */}
      <div className="px-6 pb-4">
        <p className="text-white/70 text-xs">Selamat datang kembali,</p>
        <h3 className="text-white text-lg font-bold">Hi Zels! 👋</h3>
      </div>

      {/* Storage card */}
      <div className="mx-4 bg-white/15 backdrop-blur-sm rounded-3xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white/70 text-xs">Paket Free</p>
            <p className="text-white text-sm font-semibold">Aktif selamanya</p>
          </div>
          <Link href="/auth/register" className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl">
            Upgrade
          </Link>
        </div>
        <div className="flex items-center justify-center py-2">
          <StorageRing used={3.5} total={15} />
        </div>
        <div className="flex justify-between text-center mt-2">
          {[['📸', '2.1 GB', 'Foto'], ['🎬', '0.9 GB', 'Video'], ['📄', '0.5 GB', 'Dok']].map(([icon, size, label]) => (
            <div key={label}>
              <div className="text-lg mb-0.5">{icon}</div>
              <div className="text-white text-xs font-semibold">{size}</div>
              <div className="text-white/60 text-[10px]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 mb-4">
        <p className="text-white/80 text-xs font-semibold mb-2">Aksi Cepat</p>
        <div className="grid grid-cols-3 gap-2">
          {[['⬆️', 'Upload'], ['🔗', 'Bagikan'], ['📥', 'Unduh']].map(([icon, label]) => (
            <div key={label} className="bg-white/10 rounded-2xl p-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-white/80 text-[10px] font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent files */}
      <div className="bg-white rounded-t-[32px] px-4 pt-4 pb-6">
        <p className="text-[#0F172A] text-xs font-bold mb-3">File Terbaru</p>
        {[
          { name: 'foto_liburan.jpg', size: '4.2 MB', icon: '📸', color: '#F0F4FF' },
          { name: 'proposal.pdf', size: '1.8 MB', icon: '📄', color: '#FFF7ED' },
          { name: 'video_keluarga.mp4', size: '38 MB', icon: '🎬', color: '#F0FDF4' },
        ].map((file) => (
          <div key={file.name} className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: file.color }}>
              {file.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#0F172A] text-[11px] font-medium truncate">{file.name}</p>
              <p className="text-[#94A3B8] text-[10px]">{file.size}</p>
            </div>
            <div className="text-[#CBD5E1] text-xs">›</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-40" style={{ background: 'radial-gradient(ellipse, #BFDBFE, transparent 70%)' }} />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full opacity-30" style={{ background: 'radial-gradient(ellipse, #BAE6FD, transparent 70%)' }} />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-600 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              Cloud storage premium mulai Rp15.000/bln
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 text-[#0F172A]">
              Simpan semua file
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                lebih murah & cepat
              </span>
            </h1>

            <p className="text-[#64748B] text-lg max-w-lg mb-8 leading-relaxed">
              Cloud storage modern untuk Indonesia. 15 GB gratis selamanya.
              Bayar pakai GoPay, DANA, OVO, atau QRIS. Tersedia di iOS & Android.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Link href="/auth/register" className="text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                Mulai Gratis — 15 GB
              </Link>
              <Link href="/#pricing" className="bg-white text-[#2563EB] font-semibold px-8 py-4 rounded-2xl text-lg border-2 border-blue-200 transition-all hover:border-blue-400 hover:shadow-sm">
                Lihat Harga
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[#94A3B8] text-sm">
              {['✓ Tanpa kartu kredit', '✓ Bayar e-wallet', '✓ Batalkan kapan saja', '✓ Server SEA'].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-[#64748B]">{item}</span>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10">
              {[['50K+', 'Pengguna Aktif'], ['99.9%', 'Uptime'], ['4.8★', 'Rating App']].map(([val, lbl]) => (
                <div key={lbl} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-[#0F172A]">{val}</div>
                  <div className="text-xs text-[#94A3B8]">{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="flex-shrink-0 lg:block">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[50px] blur-2xl opacity-20" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }} />
              <PhoneMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
