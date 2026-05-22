'use client'
import { useState } from 'react'

/* ── SVG icons ─────────────────────────────────────────────────────── */
const si = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function IcoUpload()   { return <svg {...si} stroke="currentColor"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg> }
function IcoDownload() { return <svg {...si} stroke="currentColor"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg> }
function IcoLink()     { return <svg {...si} stroke="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> }
function IcoTrash()    { return <svg {...si} stroke="currentColor"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> }
function IcoArrowUp()  { return <svg {...si} stroke="currentColor"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> }
function IcoChevron()  { return <svg {...si} stroke="currentColor"><polyline points="6 9 12 15 18 9"/></svg> }
function IcoTrendUp()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> }

const MONTHS = ['Ags', 'Sep', 'Okt', 'Nov', 'Des', 'Jan']
const CHART_DATA = [8.2, 9.1, 10.5, 11.8, 12.4, 13.7]

/* ── Smooth area chart ─────────────────────────────────────────────── */
function AreaChart() {
  const max = 16
  const W = 400
  const H = 130
  const pad = { l: 0, r: 0, t: 14, b: 0 }

  const pts = CHART_DATA.map((v, i) => {
    const x = (i / (CHART_DATA.length - 1)) * W
    const y = pad.t + ((max - v) / max) * (H - pad.t)
    return [x, y] as [number, number]
  })

  // Smooth cubic bezier path
  function smooth(points: [number, number][]): string {
    if (points.length < 2) return ''
    let d = `M ${points[0]![0]} ${points[0]![1]}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]!
      const curr = points[i]!
      const cpx = (prev[0] + curr[0]) / 2
      d += ` C ${cpx} ${prev[1]} ${cpx} ${curr[1]} ${curr[0]} ${curr[1]}`
    }
    return d
  }

  const linePath = smooth(pts)
  const last = pts[pts.length - 1]!
  const first = pts[0]!
  const areaPath = `${linePath} L ${last[0]} ${H} L ${first[0]} ${H} Z`

  return (
    <div className="mt-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ height: 130 }}>
        <defs>
          <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A56DB" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#1A56DB" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="lG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A56DB"/>
            <stop offset="100%" stopColor="#60A5FA"/>
          </linearGradient>
        </defs>

        {/* Horizontal guide lines */}
        {[0, 0.33, 0.66, 1].map((t) => (
          <line key={t}
            x1="0" y1={pad.t + t * (H - pad.t)}
            x2={W} y2={pad.t + t * (H - pad.t)}
            stroke="#E5E2DD" strokeWidth="1" strokeDasharray="4 4"/>
        ))}

        <path d={areaPath} fill="url(#aG)"/>
        <path d={linePath} fill="none" stroke="url(#lG)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Dots */}
        {pts.map(([x, y], i) => {
          const isLast = i === pts.length - 1
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={isLast ? 5 : 3.5}
                fill={isLast ? '#1A56DB' : 'white'}
                stroke={isLast ? '#1A56DB' : '#D4D0CB'}
                strokeWidth={isLast ? 0 : 1.5}/>
              {isLast && <circle cx={x} cy={y} r={9} fill="#1A56DB" fillOpacity="0.12"/>}
            </g>
          )
        })}

        {/* Tooltip on last point */}
        <g>
          <rect x={last[0] - 30} y={last[1] - 38} width="60" height="24" rx="7" fill="#141110"/>
          <text x={last[0]} y={last[1] - 21} textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">13,7 GB</text>
        </g>
      </svg>

      {/* X labels */}
      <div className="flex justify-between mt-2">
        {MONTHS.map((m, i) => (
          <span key={m} className={`text-[10px] font-medium ${i === MONTHS.length - 1 ? 'text-[#1A56DB]' : 'text-[#A8A29E]'}`}>
            {m}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Activity list ─────────────────────────────────────────────────── */
const ACTIVITY = [
  {
    title: 'Upload Foto Liburan.zip',
    subtitle: 'Batch upload · 21 Mei 2026',
    size: '+254 MB',
    Icon: IcoUpload,
    accent: '#D97706',
    bg: '#FFF7ED',
    positive: true,
  },
  {
    title: 'Berbagi Proposal Q2.pdf',
    subtitle: 'Link dibuat · 20 Mei 2026',
    size: '1,8 MB',
    Icon: IcoLink,
    accent: '#1A56DB',
    bg: '#EBF0FF',
    positive: true,
  },
  {
    title: 'Download Video.mp4',
    subtitle: 'Diunduh · 19 Mei 2026',
    size: '38,5 MB',
    Icon: IcoDownload,
    accent: '#059669',
    bg: '#ECFDF5',
    positive: false,
  },
  {
    title: 'Hapus Duplikat Files',
    subtitle: 'Ke recycle bin · 18 Mei 2026',
    size: '−45 MB',
    Icon: IcoTrash,
    accent: '#DC2626',
    bg: '#FFF1F2',
    positive: false,
  },
  {
    title: 'Upgrade ke Plus',
    subtitle: 'Langganan diaktifkan · 17 Mei 2026',
    size: 'Rp15.000',
    Icon: IcoArrowUp,
    accent: '#7C3AED',
    bg: '#F5F3FF',
    positive: true,
  },
]

/* ── Stats ──────────────────────────────────────────────────────────── */
const STATS = [
  { label: 'Total Upload',   value: '13,7 GB', accent: '#1A56DB', bg: '#EBF0FF', Icon: IcoUpload },
  { label: 'Total Download', value: '4,2 GB',  accent: '#059669', bg: '#ECFDF5', Icon: IcoDownload },
  { label: 'Link Dibuat',    value: '8 link',  accent: '#7C3AED', bg: '#F5F3FF', Icon: IcoLink },
]

export default function HistoryPage() {
  const [period, setPeriod] = useState('6 Bulan')

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-start justify-between pt-2 gap-4">
        <div>
          <h1 className="font-display font-bold text-[#141110] text-xl tracking-tight">Riwayat Penggunaan</h1>
          <p className="text-[#A8A29E] text-sm mt-0.5">Pantau aktivitas storage kamu</p>
        </div>
        <button
          onClick={() => setPeriod(period === '6 Bulan' ? '12 Bulan' : '6 Bulan')}
          className="flex items-center gap-1.5 bg-white border border-[#E5E2DD] rounded-xl px-4 py-2.5 text-sm font-medium text-[#6B6560] shadow-sm hover:border-[#C2BDB8] transition-all flex-shrink-0">
          {period}
          <IcoChevron />
        </button>
      </div>

      {/* ── Chart card ───────────────────────────────────────────── */}
      <div className="bg-white border border-[#E5E2DD] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-semibold text-[#141110] text-sm">Penggunaan Storage</h3>
          <span className="flex items-center gap-1 text-[#059669] text-xs font-semibold">
            <IcoTrendUp />+1,3 GB bulan ini
          </span>
        </div>
        <p className="text-[#A8A29E] text-xs mb-4">{period} terakhir</p>
        <AreaChart />
      </div>

      {/* ── Stats row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {STATS.map(({ label, value, accent, bg, Icon }) => (
          <div key={label} className="bg-white border border-[#E5E2DD] rounded-xl p-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ background: bg, color: accent }}>
              <Icon />
            </div>
            <p className="font-display font-bold text-[#141110] text-base leading-none">{value}</p>
            <p className="text-[#A8A29E] text-[10px] mt-1.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Activity log ─────────────────────────────────────────── */}
      <div>
        <h2 className="font-display font-semibold text-[#141110] text-sm mb-3">Aktivitas Terbaru</h2>
        <div className="bg-white border border-[#E5E2DD] rounded-2xl overflow-hidden">
          {ACTIVITY.map((item, i) => (
            <div key={item.title}
              className={`flex items-center gap-3.5 px-5 py-4 hover:bg-[#FAFAF8] transition-colors ${
                i < ACTIVITY.length - 1 ? 'border-b border-[#F2F0ED]' : ''
              }`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: item.bg, color: item.accent }}>
                <item.Icon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#141110] text-sm truncate">{item.title}</p>
                <p className="text-[#A8A29E] text-xs mt-0.5">{item.subtitle}</p>
              </div>
              <span className={`text-xs font-bold flex-shrink-0 ${
                item.accent === '#DC2626' ? 'text-red-500' :
                item.positive ? 'text-[#059669]' : 'text-[#6B6560]'
              }`}>
                {item.size}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
