'use client'
import { useEffect, useState } from 'react'
import { formatBytes, formatRelativeDate } from '@cloudtify/utils'
import { supabase } from '../../../lib/supabase/client'
import { useUser } from '../../../lib/auth'

const si = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
function IcoUpload() { return <svg {...si} stroke="currentColor"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg> }
function IcoLink() { return <svg {...si} stroke="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg> }
function IcoTrash() { return <svg {...si} stroke="currentColor"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg> }
function IcoArrowUp() { return <svg {...si} stroke="currentColor"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg> }
function IcoFile() { return <svg {...si} stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg> }
function IcoLogin() { return <svg {...si} stroke="currentColor"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg> }
function IcoEdit() { return <svg {...si} stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']

const ACTION_META: Record<string, { label: string; Icon: () => React.ReactElement; accent: string; bg: string }> = {
  file_upload: { label: 'Upload file', Icon: IcoUpload, accent: '#D97706', bg: '#FFF7ED' },
  file_delete: { label: 'Hapus file', Icon: IcoTrash, accent: '#DC2626', bg: '#FFF1F2' },
  file_rename: { label: 'Ganti nama file', Icon: IcoEdit, accent: '#6B6560', bg: '#F2F0ED' },
  file_move: { label: 'Pindah file', Icon: IcoFile, accent: '#6B6560', bg: '#F2F0ED' },
  folder_create: { label: 'Buat folder', Icon: IcoFile, accent: '#1A56DB', bg: '#EBF0FF' },
  share_create: { label: 'Buat link berbagi', Icon: IcoLink, accent: '#1A56DB', bg: '#EBF0FF' },
  share_revoke: { label: 'Cabut link', Icon: IcoLink, accent: '#DC2626', bg: '#FFF1F2' },
  subscription_upgrade: { label: 'Upgrade paket', Icon: IcoArrowUp, accent: '#7C3AED', bg: '#F5F3FF' },
  login: { label: 'Masuk', Icon: IcoLogin, accent: '#059669', bg: '#ECFDF5' },
  logout: { label: 'Keluar', Icon: IcoLogin, accent: '#6B6560', bg: '#F2F0ED' },
}
const defaultMeta = { label: 'Aktivitas', Icon: IcoFile, accent: '#6B6560', bg: '#F2F0ED' }

interface Activity { id: string; action: string; resource_name: string | null; created_at: string }

function AreaChart({ data, labels, maxGb }: { data: number[]; labels: string[]; maxGb: number }) {
  const max = Math.max(maxGb, 1)
  const W = 400, H = 130, pad = { t: 14 }
  const pts = data.map((v, i) => [(i / Math.max(data.length - 1, 1)) * W, pad.t + ((max - v) / max) * (H - pad.t)] as [number, number])
  function smooth(p: [number, number][]) {
    if (p.length < 2) return ''
    let d = `M ${p[0]![0]} ${p[0]![1]}`
    for (let i = 1; i < p.length; i++) { const a = p[i - 1]!, b = p[i]!, cx = (a[0] + b[0]) / 2; d += ` C ${cx} ${a[1]} ${cx} ${b[1]} ${b[0]} ${b[1]}` }
    return d
  }
  const line = smooth(pts), last = pts[pts.length - 1]!, first = pts[0]!
  return (
    <div className="mt-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ height: 130 }}>
        <defs>
          <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1A56DB" stopOpacity="0.15" /><stop offset="100%" stopColor="#1A56DB" stopOpacity="0" /></linearGradient>
          <linearGradient id="lG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1A56DB" /><stop offset="100%" stopColor="#60A5FA" /></linearGradient>
        </defs>
        {[0, 0.33, 0.66, 1].map((t) => <line key={t} x1="0" y1={pad.t + t * (H - pad.t)} x2={W} y2={pad.t + t * (H - pad.t)} stroke="#E5E2DD" strokeWidth="1" strokeDasharray="4 4" />)}
        <path d={`${line} L ${last[0]} ${H} L ${first[0]} ${H} Z`} fill="url(#aG)" />
        <path d={line} fill="none" stroke="url(#lG)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], i) => { const isLast = i === pts.length - 1; return <circle key={i} cx={x} cy={y} r={isLast ? 5 : 3.5} fill={isLast ? '#1A56DB' : 'white'} stroke={isLast ? '#1A56DB' : '#D4D0CB'} strokeWidth={isLast ? 0 : 1.5} /> })}
      </svg>
      <div className="flex justify-between mt-2">
        {labels.map((m, i) => <span key={i} className={`text-[10px] font-medium ${i === labels.length - 1 ? 'text-[#1A56DB]' : 'text-[#A8A29E]'}`}>{m}</span>)}
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const { user } = useUser({ redirectTo: '/auth/login/' })
  const [chart, setChart] = useState<{ data: number[]; labels: string[]; maxGb: number }>({ data: [], labels: [], maxGb: 1 })
  const [stats, setStats] = useState({ uploadBytes: 0, fileCount: 0, links: 0 })
  const [activity, setActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('files').select('size_bytes, created_at').eq('user_id', user.id).eq('is_deleted', false),
      supabase.from('shares').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
      supabase.from('activity_logs').select('id, action, resource_name, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(12),
    ]).then(([f, sh, act]) => {
      const rows = (f.data ?? []) as { size_bytes: number; created_at: string }[]
      const now = new Date()
      const labels: string[] = [], keys: string[] = []
      for (let i = 5; i >= 0; i--) { const m = new Date(now.getFullYear(), now.getMonth() - i, 1); labels.push(MONTHS[m.getMonth()]!); keys.push(`${m.getFullYear()}-${m.getMonth()}`) }
      const monthlyBytes = keys.map(() => 0)
      rows.forEach((r) => { const d = new Date(r.created_at); const idx = keys.indexOf(`${d.getFullYear()}-${d.getMonth()}`); if (idx >= 0) monthlyBytes[idx]! += r.size_bytes ?? 0 })
      let cum = 0
      const cumGb = monthlyBytes.map((b) => { cum += b; return cum / 1e9 })
      const uploadBytes = rows.reduce((a, r) => a + (r.size_bytes ?? 0), 0)
      setChart({ data: cumGb, labels, maxGb: Math.max(...cumGb, 1) })
      setStats({ uploadBytes, fileCount: rows.length, links: sh.count ?? 0 })
      setActivity((act.data ?? []) as Activity[])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  const STATS = [
    { label: 'Total Upload', value: formatBytes(stats.uploadBytes), accent: '#1A56DB', bg: '#EBF0FF', Icon: IcoUpload },
    { label: 'Total File', value: stats.fileCount.toLocaleString('id-ID'), accent: '#059669', bg: '#ECFDF5', Icon: IcoFile },
    { label: 'Link Dibuat', value: `${stats.links} link`, accent: '#7C3AED', bg: '#F5F3FF', Icon: IcoLink },
  ]
  const empty = chart.data.every((v) => v === 0)

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <h1 className="font-display font-bold text-[#141110] text-xl tracking-tight">Riwayat penggunaan</h1>
        <p className="text-[#A8A29E] text-sm mt-0.5">Pantau aktivitas penyimpanan dan tren penggunaan Anda</p>
      </div>

      <div className="bg-white border border-[#E5E2DD] rounded-2xl p-6">
        <h3 className="font-display font-semibold text-[#141110] text-sm mb-1">Konsumsi penyimpanan</h3>
        <p className="text-[#A8A29E] text-xs mb-4">Akumulasi enam bulan terakhir</p>
        {loading ? <div className="py-10 text-center text-[#A8A29E] text-sm">Memuat…</div> : <AreaChart data={chart.data} labels={chart.labels} maxGb={chart.maxGb} />}
        {!loading && empty && <p className="text-center text-[#A8A29E] text-xs mt-2">Belum ada data penggunaan.</p>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {STATS.map(({ label, value, accent, bg, Icon: IconCmp }) => (
          <div key={label} className="bg-white border border-[#E5E2DD] rounded-xl p-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: bg, color: accent }}><IconCmp /></div>
            <p className="font-display font-bold text-[#141110] text-base leading-none">{loading ? '—' : value}</p>
            <p className="text-[#A8A29E] text-[10px] mt-1.5">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display font-semibold text-[#141110] text-sm mb-3">Aktivitas terbaru</h2>
        <div className="bg-white border border-[#E5E2DD] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-[#A8A29E] text-sm">Memuat aktivitas…</div>
          ) : activity.length === 0 ? (
            <div className="py-12 text-center text-[#A8A29E] text-sm">Belum ada aktivitas tercatat.</div>
          ) : activity.map((item, i) => {
            const meta = ACTION_META[item.action] ?? defaultMeta
            const IconCmp = meta.Icon
            return (
              <div key={item.id} className={`flex items-center gap-3.5 px-5 py-4 hover:bg-[#FAFAF8] transition-colors ${i < activity.length - 1 ? 'border-b border-[#F2F0ED]' : ''}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg, color: meta.accent }}><IconCmp /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#141110] text-sm truncate">{meta.label}{item.resource_name ? `: ${item.resource_name}` : ''}</p>
                  <p className="text-[#A8A29E] text-xs mt-0.5">{formatRelativeDate(item.created_at)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
