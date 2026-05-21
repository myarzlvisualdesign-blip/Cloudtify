import Link from 'next/link'

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { label: 'Pengguna', href: '/admin/users', icon: '👥' },
  { label: 'Langganan', href: '/admin/subscriptions', icon: '💳' },
  { label: 'File & Laporan', href: '/admin/files', icon: '📁' },
  { label: 'Analitik', href: '/admin/analytics', icon: '📈' },
  { label: 'Pengaturan', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060B14] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <span className="text-xl font-bold text-white">
            ☁️ <span className="text-blue-400">Admin</span>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="text-white/30 text-xs text-center">Cloudtify Admin v1.0</div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="h-16 border-b border-white/5 flex items-center justify-end px-6 gap-4">
          <span className="text-white/50 text-sm">Admin</span>
          <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-sm">
            👤
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
