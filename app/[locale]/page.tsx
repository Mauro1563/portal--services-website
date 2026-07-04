import { PSDNavbar } from '@/components/nav/PSDNavbar';
import PSDHeroSection from '@/components/marketing/PSDHeroSection';

// Kept dynamic while we chase down cache staleness reports from
// the field. Static rendering was letting old versions of the hero
// linger on Vercel's edge for some visitors.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Build stamp — visible in view-source so we can verify which build
// a user is actually loading. Bumped whenever a deploy needs to be
// confirmed reaching the wild.
const BUILD_STAMP = 'dark-cards-v2-2026-07-04';

import PSDTrustBar from '@/components/marketing/PSDTrustBar';
import PSDWorkforceSection from '@/components/marketing/PSDWorkforceSection';
import PSDChatSection from '@/components/marketing/PSDChatSection';
import PSDHomeSection from '@/components/marketing/PSDHomeSection';
import PSDComparisonSection from '@/components/marketing/PSDComparisonSection';
import PSDFeaturesGrid from '@/components/marketing/PSDFeaturesGrid';
import PSDDemosSection from '@/components/marketing/PSDDemosSection';
import PSDContactSection from '@/components/marketing/PSDContactSection';
import PSDFooter from '@/components/marketing/PSDFooter';

export default function LocaleHome() {
  return (
    <main
      className="min-h-screen bg-white text-slate-900"
      data-build={BUILD_STAMP}
    >
      <PSDNavbar />
      <PSDHeroSection />
      <PSDTrustBar />
      <PSDWorkforceSection />
      <PSDChatSection />
      <PSDHomeSection />
      <PSDComparisonSection />
      <PSDFeaturesGrid />
      <PSDDemosSection />
      <PSDContactSection />
      <PSDFooter />
    </main>
  );
}
