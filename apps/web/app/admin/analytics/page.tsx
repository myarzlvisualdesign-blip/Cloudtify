'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { formatBytes } from '@cloudtify/utils'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/icons'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']

export default function AdminAnalyticsPage() {
  const [byType, setByType] = useState<{ label: string; bytes: number; color: string }[]>([])
  const [uploads, setUploads] = useState<{ labels: string[]; counts: number[] }>({ labels: [], counts: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [storageRows, fileRows] = await Promise.all([
        supabase.from('storage_usage').select('image_bytes, video_bytes, document_bytes, audio_bytes, other_bytes'),
        supabase.from('files').select('created_at').eq('is_deleted', false).limit(5000),
      ])
      const sum = (k: string) => ((storageRows.data ?? []) as Record<string, number>[]).reduce((a, r) => a + (r[k] ?? 0), 0)
      setByType([
        { label: 'Foto', bytes: sum('image_bytes'), color: '#1A56DB' },
        { label: 'Video', bytes: sum('video_bytes'), color: '#7C3AED' },
        { label: 'Dokumen', bytes: sum('document_bytes'), color: '#059669' },
        { label: 'Audio', bytes: sum('audio_bytes'), color: '#D97706' },
        { label: 'Lainnya', bytes: sum('other_bytes'), color: '#A8A29E' },
      ])

      const now = new Date()
      const labels: string[] = []
      const keys: string[] = []
      for (let i = 5; i >= 0; i--) {
        const m = new Date(now.getFullYear(), now.getMonth() - i, 1)
        labels.push(MONTHS[m.getMonth()]!)
        keys.push(`${m.getFullYear()}-${m.getMonth()}`)
      }
      const counts = keys.map(() => 0)
      ;((fileRows.data ?? []) as { created_at: string }[]).forEach((f) => {
        const d = new Date(f.created_at)
        const idx = keys.indexOf(`${d.getFullYear()}-${d.getMonth()}`)
        if (idx >= 0) counts[idx]!++
      })
      setUploads({ labels, counts })
      setLoading(false)
    }
    load().catch(() => setLoading(false))
  }, [])

  const totalBytes = byType.reduce((a, t) => a + t.bytes, 0)
  const maxUpload = Math.max(...uploads.counts, 1)

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Storage by type */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-[#141110] text-sm mb-1">Storage per Kategori</h3>
          <p className="text-[#A8A29E] text-xs mb-5">Total {formatBytes(totalBytes)} di seluruh akun</p>
          {totalBytes === 0 ? (
            <div className="py-10 text-center text-[#A8A29E] text-sm">Belum ada file diunggah.</div>
          ) : (
            <div className="space-y-3.5">
              {byType.map((t) => (
                <div key={t.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#141110] font-semibold">{t.label}</span>
                    <span className="text-[#6B6560]">{formatBytes(t.bytes)}</span>
                  </div>
                  <div className="h-2 bg-[#F2F0ED] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(t.bytes / totalBytes) * 100}%`, background: t.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Uploads over time */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-[#141110] text-sm mb-1">Aktivitas Upload</h3>
          <p className="text-[#A8A29E] text-xs mb-5">File baru, 6 bulan terakhir</p>
          <div className="flex items-end gap-2 h-32">
            {uploads.counts.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                <div className="w-full rounded-t-md transition-all" style={{ height: `${(v / maxUpload) * 100}%`, minHeight: v > 0 ? 6 : 2, background: i === uploads.counts.length - 1 ? 'linear-gradient(180deg,#1A56DB,#2B7FD4)' : '#DCE6FB' }} />
                <span className="text-[10px] text-[#A8A29E]">{uploads.labels[i]}</span>
              </div>
            ))}
          </div>
          {uploads.counts.every((v) => v === 0) && <p className="text-center text-[#A8A29E] text-xs mt-3">Belum ada aktivitas upload.</p>}
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Icon.trend size={16} />
          <h3 className="font-display font-bold text-[#141110] text-sm">Ringkasan</h3>
        </div>
        <p className="text-[#6B6560] text-sm leading-relaxed mt-2">
          {loading
            ? 'Memuat analitik real-time dari database…'
            : 'Semua metrik di halaman ini ditarik langsung dari database Supabase (live). Angka akan terisi otomatis seiring pengguna mengunggah file dan berlangganan.'}
        </p>
      </Card>
    </div>
  )
}
