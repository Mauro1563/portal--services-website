import HeroSection from '@/components/marketing/HeroSection';
import PortalsSection from '@/components/marketing/PortalsSection';
import AirbnbModeSection from '@/components/marketing/AirbnbModeSection';
import PricingSection from '@/components/marketing/PricingSection';
import TestimonialsSection from '@/components/marketing/TestimonialsSection';
import FaqSection from '@/components/marketing/FaqSection';
import FooterSection from '@/components/marketing/FooterSection';

export default function LocaleHome() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <HeroSection />
      <PortalsSection />
      <AirbnbModeSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <FooterSection />
    </main>
  );
}
