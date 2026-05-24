'use client'
import { motion } from 'framer-motion'

/* ── Icons ────────────────────────────────────────────────────────── */
const icon = (path: JSX.Element) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
)
const ICO = {
  bolt:    icon(<polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>),
  shield:  icon(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>),
  globe:   icon(<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>),
  device:  icon(<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>),
  refresh: icon(<><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>),
  share:   icon(<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>),
  bar:     icon(<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>),
  gift:    icon(<><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></>),
  lock:    icon(<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>),
}

/* ── In-cell visuals ─────────────────────────────────────────────── */
function SpeedViz() {
  return (
    <div className="mt-6 relative h-32 rounded-xl bg-gradient-to-br from-[#0B0F1E] to-[#14378E] overflow-hidden p-4">
      {/* Speedometer arc */}
      <svg viewBox="0 0 200 100" className="w-full">
        <defs>
          <linearGradient id="speedG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        <path d="M20,90 A70,70 0 0 1 180,90" stroke="rgba(255,255,255,0.10)" strokeWidth="10" fill="none" strokeLinecap="round" />
        <motion.path
          d="M20,90 A70,70 0 0 1 180,90"
          stroke="url(#speedG)" strokeWidth="10" fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 0.78 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
        <text x="100" y="78" textAnchor="middle" fill="white" fontFamily="Inter" fontWeight="700" fontSize="22">
          120 <tspan fontSize="11" fill="rgba(255,255,255,0.55)">MB/s</tspan>
        </text>
      </svg>
      <div className="absolute inset-x-4 bottom-3 flex justify-between text-[10px] font-mono text-white/40">
        <span>0</span><span>50</span><span>100</span><span>150 MB/s</span>
      </div>
    </div>
  )
}

function StorageViz() {
  const bars = [
    { h: 60, c: '#1A56DB' },
    { h: 38, c: '#3D6FE8' },
    { h: 24, c: '#6589F2' },
    { h: 14, c: '#BFD0FC' },
  ]
  return (
    <div className="mt-6 flex items-end gap-3 h-32 px-2">
      {bars.map((b, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: b.h * 1.6 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
          className="flex-1 rounded-t-md"
          style={{ background: b.c, minHeight: 8 }}
        />
      ))}
      <div className="ml-3 leading-tight self-end">
        <div className="font-display font-bold text-[#141110] text-lg">3,5 GB</div>
        <div className="text-[10px] text-[#A8A29E]">dari 15 GB</div>
      </div>
    </div>
  )
}

function PaymentLogos() {
  const logos = [
    { l: 'GoPay', c: '#00AED6' },
    { l: 'DANA',  c: '#118EEA' },
    { l: 'OVO',   c: '#4C2A86' },
    { l: 'QRIS',  c: '#E11D48' },
    { l: 'BCA',   c: '#0064C2' },
  ]
  return (
    <div className="mt-6 grid grid-cols-5 gap-2">
      {logos.map((p) => (
        <div key={p.l} className="aspect-[2/1] rounded-lg border border-[#E5E2DD] bg-white flex items-center justify-center text-[10px] font-display font-bold tracking-tight" style={{ color: p.c }}>
          {p.l}
        </div>
      ))}
    </div>
  )
}

function DeviceViz() {
  return (
    <div className="mt-6 flex items-end gap-3 justify-center">
      {/* Phone */}
      <div className="w-12 h-20 rounded-lg border-2 border-[#141110] bg-gradient-to-br from-[#FAFAF8] to-[#EBF0FF] p-1">
        <div className="w-full h-full rounded bg-white" />
      </div>
      {/* Tablet */}
      <div className="w-14 h-18 rounded border-2 border-[#141110] bg-gradient-to-br from-[#FAFAF8] to-[#EBF0FF] p-1">
        <div className="w-full h-full rounded bg-white" />
      </div>
      {/* Laptop */}
      <div className="w-24 h-16 rounded-t-md border-2 border-[#141110] bg-gradient-to-br from-[#FAFAF8] to-[#EBF0FF] p-1.5">
        <div className="w-full h-full rounded bg-white" />
      </div>
    </div>
  )
}

/* ── Bento cell ──────────────────────────────────────────────────── */
interface Cell {
  span: string
  icon?: keyof typeof ICO
  title: string
  desc: string
  accent?: string
  bg?: string
  children?: React.ReactNode
  dark?: boolean
}

const CELLS: Cell[] = [
  {
    span: 'lg:col-span-2 lg:row-span-2',
    icon: 'bolt',
    title: 'Upload secepat kilat.',
    desc: 'Chunked multipart via Cloudflare R2. Pause & resume otomatis kalau koneksi drop. Rata-rata 120 MB/s pada 4G.',
    accent: '#1A56DB',
    children: <SpeedViz />,
  },
  {
    span: 'lg:col-span-2',
    icon: 'shield',
    title: 'Enkripsi end-to-end',
    desc: 'AES-256-GCM at-rest. TLS 1.3 in-transit. Link share bisa pakai password + expiry.',
    accent: '#1A56DB',
  },
  {
    span: 'lg:col-span-2',
    icon: 'globe',
    title: 'Server di Asia Tenggara',
    desc: 'Jakarta & Singapura — latensi <50ms untuk pengguna Indonesia. Patuh UU PDP.',
    accent: '#059669',
  },
  {
    span: 'lg:col-span-2',
    icon: 'gift',
    title: 'Bayar pakai e-wallet',
    desc: 'Tanpa kartu kredit. Top-up GoPay, DANA, OVO, atau scan QRIS dari rekening apapun.',
    accent: '#1A56DB',
    children: <PaymentLogos />,
  },
  {
    span: 'lg:col-span-2',
    icon: 'device',
    title: 'Multi-perangkat',
    desc: 'Aplikasi native iOS & Android + web. Sinkron real-time tanpa "loading dulu".',
    accent: '#0EA5E9',
    children: <DeviceViz />,
  },
  {
    span: 'lg:col-span-2',
    icon: 'bar',
    title: 'Storage analytics',
    desc: 'Lihat berapa GB dipakai per tipe file, file mana terbesar, kapan terakhir diakses.',
    accent: '#1A56DB',
    children: <StorageViz />,
  },
  {
    span: 'lg:col-span-4',
    icon: 'share',
    title: 'Share Google Drive-style — tapi lebih cepat',
    desc: 'Link short branded. Pilih akses viewer / editor. Allow-download toggle. Expiry custom (24 jam, 7 hari, 30 hari, atau permanen).',
    accent: '#1A56DB',
    dark: true,
  },
  {
    span: 'lg:col-span-2',
    icon: 'refresh',
    title: 'Version history',
    desc: 'Rollback ke versi sebelumnya — 30 hari untuk Pro, 90 hari untuk Business.',
    accent: '#1A56DB',
  },
]

/* ── Section ─────────────────────────────────────────────────────── */
export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-[#FAFAF8] py-24 sm:py-32 px-5">
      <div className="section-inner-wide">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#1A56DB]">
            <span className="w-6 h-px bg-[#1A56DB]" /> Fitur lengkap
          </span>
          <h2 className="font-display font-extrabold text-[#141110] tracking-super-tight mt-4 text-4xl sm:text-5xl lg:text-6xl leading-[1.04]">
            Semua yang kamu butuh,<br/>
            <span className="gradient-text">tanpa harus install ekstensi.</span>
          </h2>
          <p className="mt-5 text-[#494440] text-lg max-w-xl mx-auto">
            Dibangun ulang dari nol untuk Indonesia — pakai best practice tools yang biasanya cuma ada di produk global.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 auto-rows-[minmax(220px,auto)]">
          {CELLS.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative ${c.span} rounded-3xl p-7 border transition-all duration-300 ${
                c.dark
                  ? 'bg-[#0B0F1E] border-white/10 text-white hover:border-white/20'
                  : 'bg-white border-[#E5E2DD] hover:border-[#C2D0F8] hover:-translate-y-1 hover:shadow-elev-3'
              }`}
            >
              {c.icon && (
                <span
                  className={`inline-flex w-11 h-11 rounded-2xl items-center justify-center mb-4 ${c.dark ? 'bg-white/10 text-[#93B4FA]' : ''}`}
                  style={!c.dark ? { background: `${c.accent}14`, color: c.accent } : {}}
                >
                  {ICO[c.icon]}
                </span>
              )}
              <h3 className={`font-display font-bold text-xl sm:text-2xl tracking-tight leading-tight mb-2 ${c.dark ? 'text-white' : 'text-[#141110]'}`}>
                {c.title}
              </h3>
              <p className={`text-sm leading-relaxed ${c.dark ? 'text-white/65' : 'text-[#6B6560]'}`}>
                {c.desc}
              </p>
              {c.children}
              {/* Hover shimmer */}
              <span className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: c.dark ? 'radial-gradient(800px circle at var(--x,50%) var(--y,30%), rgba(96,165,250,0.06), transparent 40%)' : 'radial-gradient(600px circle at var(--x,50%) var(--y,30%), rgba(26,86,219,0.05), transparent 40%)' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
