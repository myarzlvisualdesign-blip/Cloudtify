'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { formatBytes, formatIDR } from '@cloudtify/utils'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']

interface BarChartProps {
  data: number[]
  color?: string
}

function BarChart({ data, color = '#2563EB' }: BarChartProps) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-lg transition-all duration-500"
          style={{
            height: `${Math.max((v / max) * 100, 4)}%`,
            background: i === data.length - 1
              ? `linear-gradient(180deg, ${color}, ${color}88)`
              : '#E8F0FF',
            minHeight: 4,
          }}
        />
      ))}
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string
  change: string
  positive: boolean
  icon: React.ReactNode
  bg: string
}

function MetricCard({ label, value, change, positive, icon, bg }: MetricCardProps) {
  return (
    <div className="card p-5" style={{ background: bg }}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center">{icon}</div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${positive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-[#0F172A] mb-0.5">{value}</div>
      <div className="text-[#94A3B8] text-xs">{label}</div>
    </div>
  )
}

const MOCK_UPLOADS = [280, 340, 410, 530, 620, 780, 910, 1050, 1120, 1240, 1380, 1560]
const MOCK_REVENUE = [0, 450000, 820000, 1380000, 1990000, 2800000, 3450000, 4280000, 5120000, 5900000, 7250000, 8600000]
const MOCK_DAU = [42, 65, 88, 115, 148, 190, 224, 267, 303, 340, 387, 452]

const CATEGORY_DATA = [
  { label: 'Gambar', pct: 42, bytes: 1.2 * 1024 ** 3, color: '#3B82F6' },
  { label: 'Video', pct: 28, bytes: 0.8 * 1024 ** 3, color: '#8B5CF6' },
  { label: 'Dokumen', pct: 18, bytes: 0.5 * 1024 ** 3, color: '#06B6D4' },
  { label: 'Audio', pct: 8, bytes: 0.22 * 1024 ** 3, color: '#F59E0B' },
  { label: 'Lainnya', pct: 4, bytes: 0.11 * 1024 ** 3, color: '#6B7280' },
]

export default function AdminAnalyticsPage() {
  const [totalFiles, setTotalFiles] = useState(0)
  const [totalStorage, setTotalStorage] = useState(0)

  useEffect(() => {
    async function fetchData() {
      const [filesRes, storageRes] = await Promise.all([
        supabase.from('files').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
        supabase.from('storage_usage').select('used_bytes'),
      ])
      setTotalFiles(filesRes.count ?? 0)
      const total = ((storageRes.data ?? []) as { used_bytes: number }[]).reduce((a, r) => a + (r.used_bytes ?? 0), 0)
      setTotalStorage(total)
    }
    fetchData()
  }, [])

  const METRICS = [
    {
      label: 'Total File Diunggah',
      value: totalFiles.toLocaleString('id-ID'),
      change: '+18%',
      positive: true,
      bg: '#EFF6FF',
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#2563EB" strokeWidth={2} />
          <polyline points="14 2 14 8 20 8" stroke="#2563EB" strokeWidth={2} />
        </svg>
      ),
    },
    {
      label: 'Storage Terpakai',
      value: formatBytes(totalStorage),
      change: '+24%',
      positive: true,
      bg: '#F5F3FF',
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#7C3AED" strokeWidth={2} />
        </svg>
      ),
    },
    {
      label: 'Pendapatan Bulan Ini',
      value: formatIDR(MOCK_REVENUE[MOCK_REVENUE.length - 1]!),
      change: '+15%',
      positive: true,
      bg: '#F0FDF4',
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
          <line x1={12} y1={1} x2={12} y2={23} stroke="#16A34A" strokeWidth={2} />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="#16A34A" strokeWidth={2} />
        </svg>
      ),
    },
    {
      label: 'DAU (Rata-rata)',
      value: MOCK_DAU[MOCK_DAU.length - 1]!.toLocaleString('id-ID'),
      change: '+22%',
      positive: true,
      bg: '#FFF7ED',
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#EA580C" strokeWidth={2} />
          <circle cx={9} cy={7} r={4} stroke="#EA580C" strokeWidth={2} />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#EA580C" strokeWidth={2} />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Analitik</h1>
        <p className="text-[#64748B] text-sm">Performa dan tren penggunaan Cloudtify</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#0F172A] font-bold text-sm">Upload per Bulan</h3>
              <p className="text-[#94A3B8] text-xs">12 bulan terakhir</p>
            </div>
            <span className="tag-blue">2026</span>
          </div>
          <BarChart data={MOCK_UPLOADS} color="#2563EB" />
          <div className="flex justify-between mt-2">
            {MONTHS.map((m) => (
              <span key={m} className="text-[10px] text-[#CBD5E1] flex-1 text-center">{m}</span>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#0F172A] font-bold text-sm">Pendapatan Kumulatif</h3>
              <p className="text-[#94A3B8] text-xs">12 bulan terakhir (IDR)</p>
            </div>
            <span className="tag-active">Live</span>
          </div>
          <BarChart data={MOCK_REVENUE.map((v, i) => i === 0 ? 1 : v)} color="#16A34A" />
          <div className="flex justify-between mt-2">
            {MONTHS.map((m) => (
              <span key={m} className="text-[10px] text-[#CBD5E1] flex-1 text-center">{m}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="text-[#0F172A] font-bold text-sm mb-4">Distribusi Tipe File</h3>
          <div className="space-y-3">
            {CATEGORY_DATA.map((cat) => (
              <div key={cat.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                    <span className="text-[#0F172A] font-medium">{cat.label}</span>
                  </div>
                  <span className="text-[#64748B]">{formatBytes(cat.bytes)} ({cat.pct}%)</span>
                </div>
                <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${cat.pct}%`, background: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#0F172A] font-bold text-sm">Pengguna Aktif Harian</h3>
              <p className="text-[#94A3B8] text-xs">12 bulan terakhir</p>
            </div>
          </div>
          <BarChart data={MOCK_DAU} color="#06B6D4" />
          <div className="flex justify-between mt-2">
            {MONTHS.map((m) => (
              <span key={m} className="text-[10px] text-[#CBD5E1] flex-1 text-center">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
