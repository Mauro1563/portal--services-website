import { PSDNavbar } from '@/components/nav/PSDNavbar';
import PSDHeroSection from '@/components/marketing/PSDHeroSection';
import PSDTrustBar from '@/components/marketing/PSDTrustBar';
import PSDWorkforceSection from '@/components/marketing/PSDWorkforceSection';
import PSDHomeSection from '@/components/marketing/PSDHomeSection';
import PSDComparisonSection from '@/components/marketing/PSDComparisonSection';
import PSDFeaturesGrid from '@/components/marketing/PSDFeaturesGrid';
import PSDDemosSection from '@/components/marketing/PSDDemosSection';
import PSDContactSection from '@/components/marketing/PSDContactSection';
import PSDFooter from '@/components/marketing/PSDFooter';
import PricingSection from '@/components/marketing/PricingSection';
import FaqSection from '@/components/marketing/FaqSection';

export default function LocaleHome() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <PSDNavbar />
      <PSDHeroSection />
      <PSDTrustBar />
      <PSDWorkforceSection />
      <PSDHomeSection />
      <PSDComparisonSection />
      <PSDFeaturesGrid />
      <PSDDemosSection />
      <PricingSection />
      <FaqSection />
      <PSDContactSection />
      <PSDFooter />
    </main>
  );
}
