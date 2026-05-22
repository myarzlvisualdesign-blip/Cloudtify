'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatBytes } from '@cloudtify/utils'
import { supabase } from '../../../lib/supabase/client'
import { useUser, displayName, initials } from '../../../lib/auth'
import { Icon } from '../../../components/ui/icons'

const si = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
function IcoImage() { return <svg {...si} stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg> }
function IcoVideo() { return <svg {...si} stroke="currentColor"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg> }
function IcoDoc() { return <svg {...si} stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg> }

const FILE_TYPES: Record<string, { Icon: () => React.ReactElement; accent: string; bg: string }> = {
  image: { Icon: IcoImage, accent: '#D97706', bg: '#FFF7ED' },
  video: { Icon: IcoVideo, accent: '#059669', bg: '#ECFDF5' },
  document: { Icon: IcoDoc, accent: '#1A56DB', bg: '#EBF0FF' },
}

function catOf(mime: string): keyof typeof FILE_TYPES {
  if (mime?.startsWith('image/')) return 'image'
  if (mime?.startsWith('video/')) return 'video'
  return 'document'
}

function StorageRing({ usedGb, totalGb }: { usedGb: number; totalGb: number }) {
  const r = 76, stroke = 11, ri = r - stroke / 2, circ = 2 * Math.PI * ri
  const offset = circ * (1 - Math.min(usedGb / totalGb, 1))
  const size = r * 2
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" /><stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx={r} cy={r} r={ri} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={stroke} />
        <circle cx={r} cy={r} r={ri} fill="none" stroke="url(#ringG)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute text-center">
        <div className="font-display font-bold text-white leading-none" style={{ fontSize: 30 }}>
          {usedGb.toFixed(1)}<span className="text-base font-normal text-white/60 ml-0.5">GB</span>
        </div>
        <div className="text-white/50 text-xs mt-0.5">/ {totalGb} GB</div>
      </div>
    </div>
  )
}

interface FileRow { id: string; name: string; size_bytes: number; mime_type: string }

const QUICK = [
  { Icon: Icon.upload, label: 'Upload', href: '/files' },
  { Icon: Icon.share, label: 'Bagikan', href: '/files' },
  { Icon: Icon.download, label: 'Unduh', href: '/files' },
]

export default function UserDashboard() {
  const { user, profile } = useUser({ redirectTo: '/auth/login/' })
  const [usage, setUsage] = useState({ usedGb: 0, totalGb: 15, image: 0, video: 0, document: 0 })
  const [files, setFiles] = useState<FileRow[]>([])
  const [planName, setPlanName] = useState('Free')

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('storage_usage').select('used_bytes, image_bytes, video_bytes, document_bytes').eq('user_id', user.id).maybeSingle(),
      supabase.from('user_active_subscription').select('plan_name, total_storage_gb').eq('user_id', user.id).maybeSingle(),
      supabase.from('files').select('id, name, size_bytes, mime_type').eq('user_id', user.id).eq('is_deleted', false).order('created_at', { ascending: false }).limit(6),
    ]).then(([s, sub, f]) => {
      setUsage({
        usedGb: ((s.data?.used_bytes ?? 0) as number) / 1e9,
        totalGb: (sub.data?.total_storage_gb as number) ?? 15,
        image: (s.data?.image_bytes ?? 0) as number,
        video: (s.data?.video_bytes ?? 0) as number,
        document: (s.data?.document_bytes ?? 0) as number,
      })
      if (sub.data?.plan_name) setPlanName(String(sub.data.plan_name).replace(/^\w/, (c) => c.toUpperCase()))
      setFiles((f.data ?? []) as FileRow[])
    })
  }, [user])

  const name = displayName(user, profile)
  const avatar = profile?.avatar_url ?? (user?.user_metadata?.avatar_url as string | undefined)
  const usedBytes = usage.usedGb * 1e9
  const cats = [
    { Icon: IcoImage, label: 'Foto', bytes: usage.image, accent: '#38BDF8' },
    { Icon: IcoVideo, label: 'Video', bytes: usage.video, accent: '#34D399' },
    { Icon: IcoDoc, label: 'Dok', bytes: usage.document, accent: '#A78BFA' },
  ]

  return (
    <div className="-m-4 md:-m-8 flex flex-col min-h-screen" style={{ background: 'linear-gradient(160deg, #0F2D8A 0%, #1A56DB 55%, #2B9FD4 100%)' }}>
      <div className="px-5 pt-7 pb-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/55 text-sm">Selamat datang kembali,</p>
            <h1 className="font-display font-bold text-white text-2xl tracking-tight mt-0.5">Hi, {name}</h1>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-display font-bold" style={{ background: 'rgba(255,255,255,0.18)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : initials(name)}
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.14)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/55 text-xs">Paket {planName}</p>
              <p className="text-white font-display font-semibold text-sm mt-0.5">Aktif selamanya</p>
            </div>
            <Link href="/settings" className="bg-white text-[#1A56DB] text-xs font-bold px-4 py-2 rounded-full hover:shadow-lg hover:shadow-black/20 hover:-translate-y-px transition-all duration-200">
              Upgrade
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <StorageRing usedGb={usage.usedGb} totalGb={usage.totalGb} />
            <div className="flex-1 w-full space-y-3">
              {cats.map(({ Icon: I, label, bytes, accent }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.12)', color: accent }}><I /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">{label}</span>
                      <span className="text-white font-medium">{formatBytes(bytes)}</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <div className="h-full rounded-full" style={{ width: `${usedBytes > 0 ? Math.min((bytes / usedBytes) * 100, 100) : 0}%`, background: accent }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">Aksi Cepat</p>
          <div className="grid grid-cols-3 gap-3">
            {QUICK.map(({ Icon: I, label, href }) => (
              <Link key={label} href={href} className="rounded-xl py-4 flex flex-col items-center gap-2.5 hover:-translate-y-0.5 hover:bg-white/25 transition-all duration-200" style={{ background: 'rgba(255,255,255,0.16)' }}>
                <div className="text-white"><I size={20} /></div>
                <span className="text-white/80 text-xs font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#FAFAF8] rounded-t-[28px] px-5 pt-6 pb-8 mt-2 md:rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-[#141110] text-base">File Terbaru</h2>
          <Link href="/files" className="text-[#1A56DB] text-sm font-semibold hover:opacity-75 transition-opacity">Lihat Semua</Link>
        </div>

        {files.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF0FF] flex items-center justify-center mx-auto mb-4 text-[#1A56DB]"><Icon.upload size={24} /></div>
            <p className="text-[#141110] text-sm font-semibold mb-1">Belum ada file</p>
            <p className="text-[#A8A29E] text-xs mb-5">Mulai upload file pertama kamu ke Cloudtify.</p>
            <Link href="/files" className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
              <Icon.upload size={16} /> Upload File
            </Link>
          </div>
        ) : (
          <div className="space-y-0.5">
            {files.map((file) => {
              const meta = FILE_TYPES[catOf(file.mime_type)]
              const { Icon: I, accent, bg } = meta
              return (
                <div key={file.id} className="flex items-center gap-3.5 py-3 rounded-xl hover:bg-[#F2F0ED] transition-colors cursor-pointer px-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg, color: accent }}><I /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#141110] text-sm truncate">{file.name}</p>
                    <p className="text-[#A8A29E] text-xs mt-0.5">{formatBytes(file.size_bytes)}</p>
                  </div>
                  <span className="text-[#D4CFC9] flex-shrink-0"><Icon.arrowRight size={14} /></span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
