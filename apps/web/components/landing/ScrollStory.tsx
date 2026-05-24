'use client'
import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'

/*
 * ScrollStory — sticky scroll-driven section that scrubs through a product
 * journey: upload → encrypt → sync → share. Similar to the viral Apple/Linear
 * scroll-to-reveal experience. Pure SVG + transforms, no video file needed.
 */

const STEPS = [
  {
    key: 'upload',
    title: 'Upload tanpa drama',
    blurb: 'Drag & drop file apa pun — foto, video 4K, dokumen. Chunked upload otomatis pakai ulang koneksi yang sedang aktif.',
    pill: '01 · Upload',
  },
  {
    key: 'encrypt',
    title: 'Dienkripsi di sisi server',
    blurb: 'AES-256 end-to-end + TLS in-transit. Provider penyimpanan pun tidak bisa baca isi file kamu.',
    pill: '02 · Enkripsi',
  },
  {
    key: 'sync',
    title: 'Sinkron di semua perangkat',
    blurb: 'iOS, Android, web — file kamu muncul instan di mana pun. Versi history 30 hari untuk Pro.',
    pill: '03 · Sinkron',
  },
  {
    key: 'share',
    title: 'Bagikan dalam 1 klik',
    blurb: 'Link short branded, expiry custom, viewer/editor permission. Atau langsung ke WhatsApp.',
    pill: '04 · Bagikan',
  },
] as const

/* ── Pure helper: progress [0..1] → step index ──────────────────── */
function progressToStep(progress: number): number {
  const n = STEPS.length
  if (progress <= 0.04) return 0
  if (progress >= 0.96) return n - 1
  const slice = (progress - 0.04) / 0.92
  return Math.min(n - 1, Math.floor(slice * n))
}

/* ── Per-step content (rendered exclusively, no overlap) ──────────── */
function UploadPanel() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A56DB] to-[#3D6FE8] flex items-center justify-center text-white mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <div className="text-white text-sm font-display font-bold mb-1">Drop file di sini</div>
        <div className="text-white/60 text-xs">atau klik untuk pilih · maks 5 GB per file</div>
      </div>
      <div className="mt-5 space-y-2">
        {[
          { n: 'liburan-2026.jpg', p: 100, c: 'bg-emerald-500' },
          { n: 'rapat-Q4.pdf',      p:  72, c: 'bg-[#60A5FA]' },
          { n: 'webinar-final.mp4', p:  34, c: 'bg-[#60A5FA]' },
        ].map((f) => (
          <div key={f.n} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <span className="font-mono text-[11px] text-white/70 flex-1 truncate">{f.n}</span>
            <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full rounded-full ${f.c}`} style={{ width: `${f.p}%` }} />
            </div>
            <span className="text-[10px] text-white/60 font-mono w-8 text-right">{f.p}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EncryptPanel() {
  return (
    <div className="relative w-72 h-72">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-[#60A5FA]/40"
          animate={{ scale: [0.6, 1.4], opacity: [0.8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#1A56DB] to-[#3D6FE8] flex items-center justify-center shadow-2xl shadow-[#1A56DB]/60">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      </div>
      <div className="absolute -bottom-4 -left-6 font-mono text-[10px] text-[#60A5FA]/60 select-none">4af3 d12c 9b00 e7f1</div>
      <div className="absolute -top-2 -right-8 font-mono text-[10px] text-[#60A5FA]/60 select-none">AES-256-GCM</div>
    </div>
  )
}

function SyncPanel() {
  return (
    <div className="relative">
      <div className="flex items-end gap-4 sm:gap-6">
        <div className="w-24 h-44 rounded-[18px] border border-white/15 bg-[#0B0F1E] p-1.5 shadow-2xl shadow-black/60">
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#FAFAF8] to-[#EBF0FF] flex items-center justify-center text-[#1A56DB] text-[10px] font-display font-bold">
            Cloudtify
          </div>
        </div>
        <div className="w-56 h-36 sm:w-64 sm:h-40 rounded-t-xl border border-white/15 bg-[#0B0F1E] p-1.5 shadow-2xl shadow-black/60">
          <div className="w-full h-full rounded-md bg-gradient-to-br from-[#FAFAF8] to-[#EBF0FF] grid grid-cols-3 gap-1.5 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-md bg-white/80" />
            ))}
          </div>
        </div>
        <div className="w-28 h-40 rounded-[14px] border border-white/15 bg-[#0B0F1E] p-1.5 shadow-2xl shadow-black/60">
          <div className="w-full h-full rounded-md bg-gradient-to-br from-[#FAFAF8] to-[#EBF0FF]" />
        </div>
      </div>
      <svg className="absolute -inset-10 w-[calc(100%+5rem)] h-[calc(100%+5rem)] pointer-events-none" viewBox="0 0 400 300" fill="none">
        <motion.circle
          cx="200" cy="150" r="160"
          stroke="rgba(96,165,250,0.30)" strokeWidth="1" strokeDasharray="4 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 150px' }}
        />
      </svg>
    </div>
  )
}

function SharePanel() {
  return (
    <div className="w-[88%] max-w-md rounded-2xl bg-white p-5 shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[#141110] font-display font-bold text-sm">Bagikan file</div>
        <span className="text-[#A8A29E] text-xs">presentation.pptx</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-lg border border-[#E5E2DD] bg-[#FAFAF8] px-3 py-2 text-center text-[11px] text-[#494440]">Hanya saya</div>
        <div className="rounded-lg border-2 border-[#1A56DB] bg-[#EBF0FF] px-3 py-2 text-center text-[11px] text-[#1A56DB] font-semibold">Siapa pun dgn link</div>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-[#0B0F1E] px-3 py-2.5 mb-3">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        <span className="font-mono text-[11px] text-white/80 flex-1 truncate">cloudtify.com/s/k8mz2x</span>
        <button className="bg-[#1A56DB] text-white text-[10px] font-semibold px-2.5 py-1 rounded-md">Salin</button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5">
          {['#FB7185', '#22D3EE', '#FBBF24', '#A78BFA'].map((c) => (
            <span key={c} className="w-6 h-6 rounded-full border-2 border-white" style={{ background: c }} />
          ))}
        </div>
        <span className="text-[#6B6560] text-xs">4 orang melihat dalam 5 menit terakhir</span>
      </div>
    </div>
  )
}

function StepVisual({ step }: { step: number }) {
  const panels = [<UploadPanel key="0" />, <EncryptPanel key="1" />, <SyncPanel key="2" />, <SharePanel key="3" />]
  return (
    <div className="relative w-full h-full">
      <div
        aria-hidden
        className="absolute inset-0 rounded-[28px] blur-3xl opacity-50"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(61,111,232,0.4), rgba(11,15,30,0) 65%)' }}
      />
      <div className="relative h-full rounded-[28px] border border-white/10 glass-dark overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            {panels[step]}
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-white' : 'w-3 bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Main section ─────────────────────────────────────────────────── */
export function ScrollStory() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.3 })
  const [step, setStep] = useState(0)
  useMotionValueEvent(smooth, 'change', (v) => setStep(progressToStep(v)))

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#070912] text-white"
      style={{ height: '320vh' }} // long scroll for 4 steps
    >
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0 bg-mesh-dark" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      {/* Sticky frame */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="section-inner-wide grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Left: copy */}
          <motion.div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-[#60A5FA] uppercase tracking-[0.18em] mb-5">
              <span className="w-6 h-px bg-[#60A5FA]" />
              How it works
            </span>
            <div className="space-y-1 mb-8">
              {STEPS.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  className={`block text-left transition-opacity duration-500 ${i === step ? 'opacity-100' : 'opacity-30'}`}
                >
                  <div className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1.5 ${i === step ? 'text-[#60A5FA]' : 'text-white/40'}`}>
                    {s.pill}
                  </div>
                  <h3 className="font-display font-bold text-4xl sm:text-5xl tracking-super-tight leading-[1.04] mb-3">
                    {s.title}
                  </h3>
                  {i === step && (
                    <motion.p
                      key={s.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-white/70 text-base max-w-md leading-relaxed"
                    >
                      {s.blurb}
                    </motion.p>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: stage */}
          <div className="order-1 lg:order-2 aspect-[4/5] sm:aspect-square w-full max-w-xl mx-auto">
            <StepVisual step={step} />
          </div>
        </div>
      </div>
    </section>
  )
}
