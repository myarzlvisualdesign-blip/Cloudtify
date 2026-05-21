import { Navbar } from '../../../components/landing/Navbar'
import { PricingSection } from '../../../components/landing/PricingSection'
import { FaqSection } from '../../../components/landing/FaqSection'
import { Footer } from '../../../components/landing/Footer'

export const metadata = {
  title: 'Harga Cloudtify — Murah, Transparan, Fleksibel',
  description: 'Pilih paket cloud storage yang sesuai kebutuhanmu. Mulai gratis 15 GB. Upgrade mulai Rp15.000/bulan.',
}

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <div className="text-center py-16 px-6" style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #E0F2FE 100%)' }}>
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Paket Harga</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            Harga yang <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>Jujur & Transparan</span>
          </h1>
          <p className="text-[#64748B] text-lg max-w-xl mx-auto">
            Tidak ada biaya tersembunyi. Bayar pakai e-wallet favorit kamu.
          </p>
        </div>
        <PricingSection />
        <FaqSection />
      </div>
      <Footer />
    </main>
  )
}
