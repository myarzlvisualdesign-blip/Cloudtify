'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { formatBytes, formatRelativeDate } from '@cloudtify/utils'

interface FileRow {
  id: string
  name: string
  size_bytes: number
  mime_type: string
  visibility: string
  created_at: string
  is_deleted: boolean
  report_count: number
  owner: { full_name: string | null; username: string | null } | null
}

interface ReportRow {
  id: string
  status: string
  reason: string
  created_at: string
  file: { id: string; name: string } | null
  reporter: { full_name: string | null; username: string | null } | null
}

const VISIBILITY_TAGS: Record<string, string> = {
  private: 'bg-[#F1F5F9] text-[#64748B]',
  shared: 'bg-blue-50 text-blue-600',
  public: 'bg-green-50 text-green-600',
}

const REPORT_STATUS_TAGS: Record<string, string> = {
  pending: 'tag-expired',
  reviewed: 'bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full',
  resolved: 'tag-active',
  dismissed: 'bg-[#F1F5F9] text-[#64748B] text-xs font-bold px-2.5 py-1 rounded-full',
}

const REPORT_STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu',
  reviewed: 'Ditinjau',
  resolved: 'Diselesaikan',
  dismissed: 'Diabaikan',
}

type Tab = 'files' | 'reports'

export default function AdminFilesPage() {
  const [tab, setTab] = useState<Tab>('files')
  const [files, setFiles] = useState<FileRow[]>([])
  const [reports, setReports] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (tab === 'files') fetchFiles()
    else fetchReports()
  }, [tab, search])

  async function fetchFiles() {
    setLoading(true)
    try {
      let query = supabase
        .from('files')
        .select('id, name, size_bytes, mime_type, visibility, created_at, is_deleted, owner:profiles(full_name, username)')
        .order('created_at', { ascending: false })
        .limit(100)
      if (search) query = query.ilike('name', `%${search}%`)
      const { data } = await query
      if (data) setFiles(data.map((f) => ({ ...f, report_count: 0, owner: f.owner as FileRow['owner'] })))
    } finally {
      setLoading(false)
    }
  }

  async function fetchReports() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('file_reports')
        .select('id, status, reason, created_at, file:files(id, name), reporter:profiles(full_name, username)')
        .order('created_at', { ascending: false })
        .limit(100)
      if (data) setReports(data as unknown as ReportRow[])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">File & Laporan</h1>
        <p className="text-[#64748B] text-sm">Kelola file dan tinjau laporan pengguna</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          {(['files', 'reports'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t ? 'text-white shadow-sm' : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F1F5F9]'
              }`}
              style={tab === t ? { background: 'linear-gradient(135deg, #2563EB, #06B6D4)' } : undefined}
            >
              {t === 'files' ? 'Semua File' : 'Laporan'}
            </button>
          ))}
        </div>
        {tab === 'files' && (
          <input
            type="search"
            placeholder="Cari nama file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-[#E2E8F0] rounded-2xl px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm w-56 transition-all"
          />
        )}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'files' ? (
          files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#CBD5E1" strokeWidth={1.5} />
                <polyline points="14 2 14 8 20 8" stroke="#CBD5E1" strokeWidth={1.5} />
              </svg>
              <p className="text-[#64748B] text-sm">Tidak ada file ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F1F5F9]">
                    {['Nama File', 'Pemilik', 'Ukuran', 'Visibilitas', 'Diunggah', 'Status'].map((h) => (
                      <th key={h} className="text-left px-5 py-4 text-[#94A3B8] text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-[#F8FAFF]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, i) => (
                    <tr key={file.id} className={`border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFF] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFBFF]'}`}>
                      <td className="px-5 py-4 max-w-[200px]">
                        <div className="text-[#0F172A] text-sm font-semibold truncate">{file.name}</div>
                        <div className="text-[#94A3B8] text-xs truncate">{file.mime_type}</div>
                      </td>
                      <td className="px-5 py-4 text-[#64748B] text-sm">{file.owner?.full_name ?? 'Unknown'}</td>
                      <td className="px-5 py-4 text-[#64748B] text-sm whitespace-nowrap">{formatBytes(file.size_bytes)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${VISIBILITY_TAGS[file.visibility] ?? ''}`}>
                          {file.visibility === 'private' ? 'Privat' : file.visibility === 'shared' ? 'Dibagikan' : 'Publik'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#94A3B8] text-xs whitespace-nowrap">{formatRelativeDate(file.created_at)}</td>
                      <td className="px-5 py-4">
                        {file.is_deleted
                          ? <span className="tag-expired">Dihapus</span>
                          : <span className="tag-active">Aktif</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
                <circle cx={12} cy={12} r={10} stroke="#CBD5E1" strokeWidth={1.5} />
                <line x1={12} y1={8} x2={12} y2={12} stroke="#CBD5E1" strokeWidth={1.5} />
                <line x1={12} y1={16} x2={12.01} y2={16} stroke="#CBD5E1" strokeWidth={2} />
              </svg>
              <p className="text-[#64748B] text-sm">Tidak ada laporan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F1F5F9]">
                    {['File', 'Pelapor', 'Alasan', 'Status', 'Waktu'].map((h) => (
                      <th key={h} className="text-left px-5 py-4 text-[#94A3B8] text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-[#F8FAFF]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, i) => (
                    <tr key={r.id} className={`border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFF] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFBFF]'}`}>
                      <td className="px-5 py-4 max-w-[180px]">
                        <div className="text-[#0F172A] text-sm font-semibold truncate">{r.file?.name ?? 'File tidak diketahui'}</div>
                      </td>
                      <td className="px-5 py-4 text-[#64748B] text-sm">{r.reporter?.full_name ?? 'Anonim'}</td>
                      <td className="px-5 py-4 text-[#64748B] text-sm capitalize">
                        {r.reason === 'illegal_content' ? 'Konten Ilegal' : r.reason === 'spam' ? 'Spam' : r.reason === 'copyright' ? 'Hak Cipta' : r.reason === 'malware' ? 'Malware' : 'Lainnya'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={REPORT_STATUS_TAGS[r.status] ?? ''}>{REPORT_STATUS_LABELS[r.status] ?? r.status}</span>
                      </td>
                      <td className="px-5 py-4 text-[#94A3B8] text-xs whitespace-nowrap">{formatRelativeDate(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  )
}
