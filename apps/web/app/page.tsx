import { HeroSection } from '../components/landing/HeroSection'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { PricingSection } from '../components/landing/PricingSection'
import { TestimonialsSection } from '../components/landing/TestimonialsSection'
import { FaqSection } from '../components/landing/FaqSection'
import { CtaSection } from '../components/landing/CtaSection'
import { Footer } from '../components/landing/Footer'
import { Navbar } from '../components/landing/Navbar'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
