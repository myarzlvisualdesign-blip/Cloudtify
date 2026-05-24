import { HeroSection } from '../components/landing/HeroSection'
import { ScrollStory } from '../components/landing/ScrollStory'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { PricingSection } from '../components/landing/PricingSection'
import { TestimonialsSection } from '../components/landing/TestimonialsSection'
import { FaqSection } from '../components/landing/FaqSection'
import { CtaSection } from '../components/landing/CtaSection'
import { Footer } from '../components/landing/Footer'
import { Navbar } from '../components/landing/Navbar'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#141110]">
      <Navbar />
      <HeroSection />
      <ScrollStory />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
