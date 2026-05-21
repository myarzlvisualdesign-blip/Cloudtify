import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <span>☁️</span>
              <span className="text-white">Cloud<span className="text-blue-400">tify</span></span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Cloud storage premium untuk Indonesia dan Asia Tenggara.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Produk</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              {[['Fitur', '/#features'], ['Harga', '/#pricing'], ['Unduh App', '/download'], ['Roadmap', '/roadmap']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href!} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Bantuan</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              {[['Pusat Bantuan', '/help'], ['FAQ', '/#faq'], ['Hubungi Kami', '/contact'], ['Status', 'https://status.cloudtify.com']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href!} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              {[['Kebijakan Privasi', '/privacy'], ['Syarat & Ketentuan', '/terms'], ['Kebijakan Cookie', '/cookies'], ['Hapus Data', '/data-deletion']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href!} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Cloudtify. Dibuat dengan ❤️ untuk Indonesia 🇮🇩
          </p>
          <div className="flex gap-4 text-white/30 text-sm">
            <span>Terdaftar Kominfo</span>
            <span>·</span>
            <span>Pembayaran aman via OJK</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
