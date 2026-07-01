import { PSDNavbar } from '@/components/nav/PSDNavbar';
import PSDHeroSection from '@/components/marketing/PSDHeroSection';
import PSDTrustBar from '@/components/marketing/PSDTrustBar';
import PSDWorkforceSection from '@/components/marketing/PSDWorkforceSection';
import PSDHomeSection from '@/components/marketing/PSDHomeSection';
import PricingSection from '@/components/marketing/PricingSection';
import TestimonialsSection from '@/components/marketing/TestimonialsSection';
import FaqSection from '@/components/marketing/FaqSection';
import FooterSection from '@/components/marketing/FooterSection';

export default function LocaleHome() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <PSDNavbar />
      <PSDHeroSection />
      <PSDTrustBar />
      <PSDWorkforceSection />
      <PSDHomeSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <FooterSection />
    </main>
  );
}
