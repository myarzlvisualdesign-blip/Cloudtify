'use client'
import { useState } from 'react'

interface ToggleProps {
  value: boolean
  onChange: (v: boolean) => void
}

function Toggle({ value, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${value ? 'bg-blue-500' : 'bg-[#E2E8F0]'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  )
}

interface InputRowProps {
  label: string
  description?: string
  children: React.ReactNode
}

function InputRow({ label, description, children }: InputRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-[#F1F5F9] last:border-0">
      <div className="min-w-0">
        <div className="text-[#0F172A] text-sm font-semibold">{label}</div>
        {description && <div className="text-[#94A3B8] text-xs mt-0.5">{description}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="card p-6">
      <h2 className="text-[#0F172A] font-bold text-sm mb-4 pb-3 border-b border-[#F1F5F9]">{title}</h2>
      <div>{children}</div>
    </div>
  )
}

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)

  const [general, setGeneral] = useState({
    appName: 'Cloudtify',
    supportEmail: 'support@cloudtify.id',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
  })

  const [storage, setStorage] = useState({
    freeStorageGB: 5,
    maxFileSizeMB: 500,
    allowedExtensions: 'jpg,jpeg,png,gif,webp,mp4,mov,mp3,wav,pdf,docx,xlsx,pptx,zip,rar',
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    storageWarningPct: 80,
    inactivityDays: 90,
  })

  const [security, setSecurity] = useState({
    maxLoginAttempts: 5,
    sessionTimeoutHours: 24,
    twoFactorAuth: false,
    ipRateLimiting: true,
  })

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Pengaturan</h1>
        <p className="text-[#64748B] text-sm">Konfigurasi platform Cloudtify</p>
      </div>

      <Section title="Umum">
        <InputRow label="Nama Aplikasi">
          <input
            value={general.appName}
            onChange={(e) => setGeneral((g) => ({ ...g, appName: e.target.value }))}
            className="bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-blue-400 w-48"
          />
        </InputRow>
        <InputRow label="Email Support" description="Email yang tampil di halaman bantuan">
          <input
            value={general.supportEmail}
            onChange={(e) => setGeneral((g) => ({ ...g, supportEmail: e.target.value }))}
            className="bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-blue-400 w-56"
          />
        </InputRow>
        <InputRow label="Mode Maintenance" description="Nonaktifkan akses pengguna sementara">
          <Toggle value={general.maintenanceMode} onChange={(v) => setGeneral((g) => ({ ...g, maintenanceMode: v }))} />
        </InputRow>
        <InputRow label="Izinkan Registrasi" description="Aktifkan pendaftaran pengguna baru">
          <Toggle value={general.allowRegistration} onChange={(v) => setGeneral((g) => ({ ...g, allowRegistration: v }))} />
        </InputRow>
        <InputRow label="Verifikasi Email Wajib">
          <Toggle value={general.requireEmailVerification} onChange={(v) => setGeneral((g) => ({ ...g, requireEmailVerification: v }))} />
        </InputRow>
      </Section>

      <Section title="Storage & Upload">
        <InputRow label="Storage Gratis (GB)" description="Kapasitas default paket Free">
          <input
            type="number"
            value={storage.freeStorageGB}
            onChange={(e) => setStorage((s) => ({ ...s, freeStorageGB: Number(e.target.value) }))}
            className="bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-blue-400 w-24"
          />
        </InputRow>
        <InputRow label="Maks. Ukuran File (MB)">
          <input
            type="number"
            value={storage.maxFileSizeMB}
            onChange={(e) => setStorage((s) => ({ ...s, maxFileSizeMB: Number(e.target.value) }))}
            className="bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-blue-400 w-24"
          />
        </InputRow>
        <InputRow label="Ekstensi yang Diizinkan" description="Pisahkan dengan koma (tanpa titik)">
          <textarea
            value={storage.allowedExtensions}
            onChange={(e) => setStorage((s) => ({ ...s, allowedExtensions: e.target.value }))}
            rows={3}
            className="bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-blue-400 w-64 resize-none"
          />
        </InputRow>
      </Section>

      <Section title="Notifikasi">
        <InputRow label="Email Notifikasi" description="Kirim notifikasi via email">
          <Toggle value={notifications.emailNotifications} onChange={(v) => setNotifications((n) => ({ ...n, emailNotifications: v }))} />
        </InputRow>
        <InputRow label="Push Notifikasi" description="Kirim notifikasi ke aplikasi mobile">
          <Toggle value={notifications.pushNotifications} onChange={(v) => setNotifications((n) => ({ ...n, pushNotifications: v }))} />
        </InputRow>
        <InputRow label="Peringatan Storage (%)" description="Kirim peringatan saat storage mencapai persentase ini">
          <input
            type="number"
            min={50}
            max={95}
            value={notifications.storageWarningPct}
            onChange={(e) => setNotifications((n) => ({ ...n, storageWarningPct: Number(e.target.value) }))}
            className="bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-blue-400 w-24"
          />
        </InputRow>
      </Section>

      <Section title="Keamanan">
        <InputRow label="Maks. Percobaan Login" description="Akun dikunci setelah N kali gagal">
          <input
            type="number"
            value={security.maxLoginAttempts}
            onChange={(e) => setSecurity((s) => ({ ...s, maxLoginAttempts: Number(e.target.value) }))}
            className="bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-blue-400 w-24"
          />
        </InputRow>
        <InputRow label="Timeout Sesi (jam)">
          <input
            type="number"
            value={security.sessionTimeoutHours}
            onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeoutHours: Number(e.target.value) }))}
            className="bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-blue-400 w-24"
          />
        </InputRow>
        <InputRow label="Autentikasi 2 Faktor" description="Wajibkan 2FA untuk semua admin">
          <Toggle value={security.twoFactorAuth} onChange={(v) => setSecurity((s) => ({ ...s, twoFactorAuth: v }))} />
        </InputRow>
        <InputRow label="Rate Limiting IP" description="Batasi permintaan berdasarkan IP">
          <Toggle value={security.ipRateLimiting} onChange={(v) => setSecurity((s) => ({ ...s, ipRateLimiting: v }))} />
        </InputRow>
      </Section>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}
        >
          Simpan Pengaturan
        </button>
        {saved && (
          <span className="text-emerald-600 text-sm font-medium flex items-center gap-1.5">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" stroke="#16A34A" strokeWidth={2.5} />
            </svg>
            Tersimpan!
          </span>
        )}
      </div>
    </div>
  )
}
