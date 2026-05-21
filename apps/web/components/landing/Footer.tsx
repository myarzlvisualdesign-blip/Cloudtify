import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                ☁️
              </div>
              <span className="text-[#0F172A]">Cloud<span className="text-blue-500">tify</span></span>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
              Cloud storage premium untuk Indonesia dan Asia Tenggara.
            </p>
            <div className="flex gap-3">
              {['📱', '🐦', '📘', '📸'].map((icon, i) => (
                <div key={i} className="w-9 h-9 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-base hover:bg-[#EFF6FF] cursor-pointer transition-colors">
                  {icon}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[#0F172A] font-bold text-sm mb-4">Produk</h4>
            <ul className="space-y-3 text-[#64748B] text-sm">
              {[['Fitur', '/#features'], ['Harga', '/#pricing'], ['Unduh App', '/download'], ['Roadmap', '/roadmap']].map(([label, href]) => (
                <li key={label}><Link href={href!} className="hover:text-blue-500 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#0F172A] font-bold text-sm mb-4">Bantuan</h4>
            <ul className="space-y-3 text-[#64748B] text-sm">
              {[['Pusat Bantuan', '/help'], ['FAQ', '/#faq'], ['Hubungi Kami', '/contact'], ['Status', '#']].map(([label, href]) => (
                <li key={label}><Link href={href!} className="hover:text-blue-500 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#0F172A] font-bold text-sm mb-4">Legal</h4>
            <ul className="space-y-3 text-[#64748B] text-sm">
              {[['Kebijakan Privasi', '/privacy'], ['Syarat & Ketentuan', '/terms'], ['Kebijakan Cookie', '#'], ['Hapus Data', '#']].map(([label, href]) => (
                <li key={label}><Link href={href!} className="hover:text-blue-500 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#94A3B8] text-sm">
            © {new Date().getFullYear()} Cloudtify. Dibuat dengan ❤️ untuk Indonesia 🇮🇩
          </p>
          <div className="flex gap-4 text-[#94A3B8] text-sm">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Semua sistem normal</span>
            <span>·</span>
            <span>Pembayaran aman via OJK</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
