'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase/client'
import { useUser, displayName, initials, signOut } from '../../../lib/auth'

const si = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
function IcoBell() { return <svg {...si} stroke="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg> }
function IcoRefresh() { return <svg {...si} stroke="currentColor"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg> }
function IcoShield() { return <svg {...si} stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> }
function IcoKey() { return <svg {...si} stroke="currentColor"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg> }
function IcoPhone() { return <svg {...si} stroke="currentColor"><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="17" r="1" fill="currentColor" /></svg> }
function IcoGift() { return <svg {...si} stroke="currentColor"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg> }
function IcoHelp() { return <svg {...si} stroke="currentColor"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> }
function IcoChevronR() { return <svg {...si} stroke="currentColor"><polyline points="9 18 15 12 9 6" /></svg> }
function IcoEdit() { return <svg {...si} stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> }
function IcoTrash() { return <svg {...si} stroke="currentColor"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg> }
function IcoLogout() { return <svg {...si} stroke="currentColor"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg> }
function IcoCopy() { return <svg {...si} stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg> }

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0" style={{ background: value ? '#1A56DB' : '#E5E2DD' }}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${value ? 'left-5' : 'left-0.5'}`} />
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E5E2DD] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F2F0ED]"><h3 className="font-display font-semibold text-[#141110] text-sm">{title}</h3></div>
      <div className="p-5">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const { user, profile } = useUser({ redirectTo: '/auth/login/' })
  const [notifications, setNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [usage, setUsage] = useState({ usedBytes: 0, totalGb: 15 })
  const [planName, setPlanName] = useState('Free')
  const [pwMsg, setPwMsg] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('storage_usage').select('used_bytes').eq('user_id', user.id).maybeSingle(),
      supabase.from('user_active_subscription').select('plan_name, total_storage_gb').eq('user_id', user.id).maybeSingle(),
    ]).then(([s, sub]) => {
      setUsage({ usedBytes: (s.data?.used_bytes ?? 0) as number, totalGb: (sub.data?.total_storage_gb as number) ?? 15 })
      if (sub.data?.plan_name) setPlanName(String(sub.data.plan_name).replace(/^\w/, (c) => c.toUpperCase()))
    })
  }, [user])

  const name = displayName(user, profile)
  const totalBytes = usage.totalGb * 1e9
  const pct = Math.min((usage.usedBytes / totalBytes) * 100, 100)
  const usedGb = (usage.usedBytes / 1e9).toFixed(1)
  const remainingGb = Math.max(usage.totalGb - usage.usedBytes / 1e9, 0).toFixed(1)

  async function handleResetPassword() {
    if (!user?.email) return
    setPwMsg('Mengirim…')
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo: `${window.location.origin}/auth/login/` })
    setPwMsg(error ? 'Gagal mengirim email.' : 'Email reset password terkirim ✓')
  }

  function copyReferral() {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="pt-2">
        <h1 className="font-display font-bold text-[#141110] text-xl tracking-tight">Pengaturan</h1>
        <p className="text-[#A8A29E] text-sm mt-0.5">Kelola akun dan preferensi kamu</p>
      </div>

      <Section title="Profil">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-display font-bold text-xl shadow-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
            {initials(name)}
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-[#141110] text-base leading-none truncate">{name}</h2>
            <p className="text-[#A8A29E] text-sm mt-1 truncate">{user?.email ?? '—'}</p>
            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-[#EBF0FF] text-[#1A56DB] text-[11px] font-semibold">Paket {planName}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-white border-2 border-[#E5E2DD] text-[#141110] font-semibold rounded-xl px-4 py-2.5 text-sm hover:border-[#1A56DB]/30 transition-all"><IcoEdit /> Edit Profil</button>
          <Link href="/#pricing" className="flex items-center justify-center gap-2 text-white font-semibold rounded-xl px-4 py-2.5 text-sm text-center hover:opacity-90 hover:shadow-md hover:shadow-[#1A56DB]/20 transition-all" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>Upgrade Paket</Link>
        </div>
      </Section>

      <Section title="Storage">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-[#141110] font-semibold text-sm">{usedGb} GB</span>
          <span className="text-[#A8A29E] text-xs">dari {usage.totalGb} GB</span>
        </div>
        <div className="h-2.5 bg-[#F2F0ED] rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #1A56DB, #60A5FA)' }} />
        </div>
        <div className="flex justify-between text-xs text-[#A8A29E]">
          <span>{remainingGb} GB tersisa</span>
          <span>{pct.toFixed(0)}% terpakai</span>
        </div>
      </Section>

      {profile?.referral_code && (
        <Section title="Kode Referral">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[#6B6560] text-xs mb-1.5">Ajak teman, dapat bonus storage</p>
              <code className="font-display font-bold text-[#1A56DB] text-lg tracking-wider">{profile.referral_code}</code>
            </div>
            <button onClick={copyReferral} className="flex items-center gap-2 bg-[#EBF0FF] text-[#1A56DB] font-semibold rounded-xl px-4 py-2.5 text-sm hover:bg-[#dde7fb] transition-all">
              <IcoCopy /> {copied ? 'Tersalin!' : 'Salin'}
            </button>
          </div>
        </Section>
      )}

      <Section title="Preferensi">
        <div className="space-y-5">
          {[
            { label: 'Notifikasi Push', desc: 'Terima notifikasi upload & berbagi', Icon: IcoBell, value: notifications, onChange: setNotifications },
            { label: 'Backup Otomatis', desc: 'Backup foto dari galeri secara otomatis', Icon: IcoRefresh, value: autoBackup, onChange: setAutoBackup },
            { label: 'Verifikasi 2 Langkah', desc: 'Tingkatkan keamanan akun kamu', Icon: IcoShield, value: twoFactor, onChange: setTwoFactor },
          ].map(({ label, desc, Icon: IconCmp, value, onChange }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#F2F0ED] text-[#6B6560]"><IconCmp /></div>
                <div className="min-w-0">
                  <p className="font-medium text-[#141110] text-sm leading-none">{label}</p>
                  <p className="text-[#A8A29E] text-xs mt-1">{desc}</p>
                </div>
              </div>
              <Toggle value={value} onChange={onChange} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Akun">
        <div className="space-y-1.5">
          <button onClick={handleResetPassword} className="w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-[#FAFAF8] border border-transparent hover:border-[#E5E2DD] transition-all duration-150 text-left group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#EBF0FF] text-[#1A56DB]"><IcoKey /></div>
            <span className="font-medium text-[#141110] text-sm flex-1">Ganti Password {pwMsg && <span className="text-[#059669] text-xs font-normal ml-1">{pwMsg}</span>}</span>
            <span className="text-[#D4CFC9] group-hover:text-[#A8A29E] transition-colors"><IcoChevronR /></span>
          </button>
          {[
            { label: 'Kelola Perangkat', Icon: IcoPhone, accent: '#059669', bg: '#ECFDF5' },
            { label: 'Referral & Bonus', Icon: IcoGift, accent: '#7C3AED', bg: '#F5F3FF' },
            { label: 'Pusat Bantuan', Icon: IcoHelp, accent: '#D97706', bg: '#FFF7ED', href: '/help' },
          ].map(({ label, Icon: IconCmp, accent, bg, href }) => {
            const inner = (
              <>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg, color: accent }}><IconCmp /></div>
                <span className="font-medium text-[#141110] text-sm flex-1">{label}</span>
                <span className="text-[#D4CFC9] group-hover:text-[#A8A29E] transition-colors"><IcoChevronR /></span>
              </>
            )
            const cls = 'w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-[#FAFAF8] border border-transparent hover:border-[#E5E2DD] transition-all duration-150 text-left group'
            return href
              ? <Link key={label} href={href} className={cls}>{inner}</Link>
              : <button key={label} className={cls}>{inner}</button>
          })}
          <button onClick={() => signOut()} className="w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-[#FAFAF8] border border-transparent hover:border-[#E5E2DD] transition-all duration-150 text-left group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#F2F0ED] text-[#6B6560]"><IcoLogout /></div>
            <span className="font-medium text-[#141110] text-sm flex-1">Keluar</span>
            <span className="text-[#D4CFC9] group-hover:text-[#A8A29E] transition-colors"><IcoChevronR /></span>
          </button>
        </div>
      </Section>

      <div className="bg-[#FFF1F2] border border-red-100 rounded-2xl p-5">
        <h3 className="font-display font-semibold text-red-500 text-sm mb-1">Zona Berbahaya</h3>
        <p className="text-red-400/70 text-xs mb-4">Tindakan ini tidak bisa dibatalkan.</p>
        <button className="w-full flex items-center justify-center gap-2 text-red-500 font-semibold text-sm py-3 rounded-xl bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"><IcoTrash /> Hapus Akun</button>
      </div>
    </div>
  )
}
