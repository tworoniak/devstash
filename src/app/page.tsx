import Navbar from '@/components/homepage/Navbar';
import HeroSection from '@/components/homepage/HeroSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import AISection from '@/components/homepage/AISection';
import PricingSection from '@/components/homepage/PricingSection';
import CTASection from '@/components/homepage/CTASection';
import Footer from '@/components/homepage/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AISection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
