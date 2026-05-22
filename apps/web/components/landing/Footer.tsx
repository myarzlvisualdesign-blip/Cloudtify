import Link from 'next/link'
import { Logo } from '../brand/Logo'

const SOCIALS = [
  {
    label: 'Twitter',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03A12.83 12.83 0 0 1 2.16.83a4.52 4.52 0 0 0 1.4 6.03A4.49 4.49 0 0 1 1.5 6.3v.06a4.52 4.52 0 0 0 3.62 4.43 4.54 4.54 0 0 1-2.04.08 4.53 4.53 0 0 0 4.22 3.14A9.07 9.07 0 0 1 1 19.54a12.8 12.8 0 0 0 6.95 2.04c8.34 0 12.9-6.91 12.9-12.9 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 23 3z"/></svg>,
  },
  {
    label: 'Instagram',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0"/></svg>,
  },
  {
    label: 'GitHub',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
  },
]

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E2DD] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-flex items-center mb-4">
              <Logo size={30} />
            </Link>
            <p className="text-[#A8A29E] text-sm leading-relaxed mb-5 max-w-[220px]">
              Cloud storage premium untuk Indonesia dan Asia Tenggara.
            </p>
            <div className="flex gap-2">
              {SOCIALS.map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-[#E5E2DD] flex items-center justify-center text-[#A8A29E] hover:text-[#141110] hover:border-[#C5C1BB] hover:bg-[#F2F0ED] transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Produk */}
          <div>
            <h4 className="font-display font-bold text-[#141110] text-sm mb-4 tracking-tight">Produk</h4>
            <ul className="space-y-2.5">
              {[['Fitur', '/#features'], ['Harga', '/#pricing'], ['Unduh App', '/download'], ['Roadmap', '/roadmap']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href!} className="text-[#A8A29E] text-sm hover:text-[#1A56DB] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-display font-bold text-[#141110] text-sm mb-4 tracking-tight">Bantuan</h4>
            <ul className="space-y-2.5">
              {[['Pusat Bantuan', '/help'], ['FAQ', '/#faq'], ['Hubungi Kami', '/contact'], ['Status Sistem', '#']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href!} className="text-[#A8A29E] text-sm hover:text-[#1A56DB] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold text-[#141110] text-sm mb-4 tracking-tight">Legal</h4>
            <ul className="space-y-2.5">
              {[['Kebijakan Privasi', '/privacy'], ['Syarat & Ketentuan', '/terms'], ['Kebijakan Cookie', '#'], ['Hapus Data', '#']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href!} className="text-[#A8A29E] text-sm hover:text-[#1A56DB] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#E5E2DD] pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#A8A29E] text-sm">
            © {new Date().getFullYear()} Cloudtify. Dibuat dengan sepenuh hati untuk Indonesia.
          </p>
          <div className="flex items-center gap-4 text-[#A8A29E] text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"/>
              Semua sistem normal
            </span>
            <span className="text-[#E5E2DD]">|</span>
            <span>Pembayaran aman via OJK</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
