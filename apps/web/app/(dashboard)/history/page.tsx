'use client'
import { useState } from 'react'

const MONTHS = ['Ags', 'Sep', 'Okt', 'Nov', 'Des', 'Jan']
const CHART_DATA = [8.2, 9.1, 10.5, 11.8, 12.4, 13.7]

function AreaChart() {
  const max = 25
  const w = 360
  const h = 140
  const pts = CHART_DATA.map((v, i) => {
    const x = (i / (CHART_DATA.length - 1)) * (w - 40) + 20
    const y = h - (v / max) * (h - 20) - 10
    return [x, y] as [number, number]
  })

  const linePath = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ')
  const areaPath = `${linePath} L ${pts[pts.length - 1]![0]} ${h} L ${pts[0]![0]} ${h} Z`

  return (
    <div className="relative">
      {/* Y labels */}
      <div className="flex flex-col justify-between absolute left-0 top-2 bottom-6 text-[10px] text-[#CBD5E1]">
        {['25 GB', '20 GB', '15 GB', '10 GB', '5 GB', '0 GB'].map((l) => <span key={l}>{l}</span>)}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible ml-8" style={{ height: 140 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 5 : 3} fill={i === pts.length - 1 ? '#2563EB' : 'white'} stroke={i === pts.length - 1 ? '#2563EB' : '#CBD5E1'} strokeWidth="1.5" />
        ))}
        {/* Tooltip on last point */}
        <g>
          <rect x={pts[pts.length - 1]![0] - 28} y={pts[pts.length - 1]![1] - 32} width="56" height="24" rx="8" fill="#0F172A" />
          <text x={pts[pts.length - 1]![0]} y={pts[pts.length - 1]![1] - 15} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">13.7 GB</text>
        </g>
      </svg>
      {/* X labels */}
      <div className="flex justify-between text-[10px] text-[#94A3B8] ml-8 mt-1">
        {MONTHS.map((m, i) => (
          <span key={m} className={`flex-1 text-center ${i === MONTHS.length - 1 ? 'text-blue-500 font-bold' : ''}`}>{m}</span>
        ))}
      </div>
    </div>
  )
}

const ACTIVITY = [
  { title: 'Upload Foto Liburan.zip', subtitle: 'Batch upload · 21 Mei 2026', size: '+254 MB', icon: '📸', color: '#FFF7ED', status: 'success' },
  { title: 'Berbagi Proposal Q2.pdf', subtitle: 'Link dibuat · 20 Mei 2026', size: '1.8 MB', icon: '🔗', color: '#EFF6FF', status: 'share' },
  { title: 'Download Video.mp4', subtitle: 'Diunduh oleh teman · 19 Mei 2026', size: '38.5 MB', icon: '📥', color: '#F0FDF4', status: 'download' },
  { title: 'Hapus Duplikat Files', subtitle: 'Ke recycle bin · 18 Mei 2026', size: '-45 MB', icon: '🗑️', color: '#FFF1F2', status: 'delete' },
  { title: 'Upgrade ke Plus', subtitle: 'Langganan diaktifkan · 17 Mei 2026', size: 'Rp15.000', icon: '⬆️', color: '#F5F3FF', status: 'upgrade' },
]

export default function HistoryPage() {
  const [period, setPeriod] = useState('6 Bulan')

  return (
    <div className="space-y-5 max-w-2xl mx-auto md:max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Riwayat Penggunaan</h1>
          <p className="text-[#94A3B8] text-sm">Pantau aktivitas storage kamu</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-2xl px-4 py-2 text-sm font-medium text-[#64748B] shadow-sm" onClick={() => setPeriod(period === '6 Bulan' ? '12 Bulan' : '6 Bulan')}>
          {period} ▾
        </button>
      </div>

      {/* Usage chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#0F172A] font-bold text-sm">Penggunaan Storage</h3>
          <span className="tag-blue">{period}</span>
        </div>
        <AreaChart />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Upload', value: '13.7 GB', icon: '📤', color: '#EFF6FF' },
          { label: 'Total Download', value: '4.2 GB', icon: '📥', color: '#F0FDF4' },
          { label: 'Link Dibuat', value: '8 link', icon: '🔗', color: '#F5F3FF' },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center" style={{ background: s.color }}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-[#0F172A] font-bold text-base">{s.value}</div>
            <div className="text-[#94A3B8] text-[10px]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-[#0F172A] font-bold mb-3">Aktivitas Terbaru</h2>
        <div className="card overflow-hidden">
          {ACTIVITY.map((item, i) => (
            <div key={item.title} className={`flex items-center gap-3 px-4 py-4 ${i < ACTIVITY.length - 1 ? 'border-b border-[#F1F5F9]' : ''} hover:bg-[#F8FAFF] transition-colors`}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: item.color }}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#0F172A] text-sm font-semibold truncate">{item.title}</p>
                <p className="text-[#94A3B8] text-xs">{item.subtitle}</p>
              </div>
              <div className={`text-xs font-bold flex-shrink-0 ${
                item.status === 'delete' ? 'text-red-500' :
                item.status === 'success' ? 'text-emerald-500' :
                item.status === 'upgrade' ? 'text-purple-500' :
                'text-blue-500'
              }`}>
                {item.size}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
