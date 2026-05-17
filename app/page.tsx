import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { LogoCloud } from '@/components/LogoCloud';
import { FeatureShowcase } from '@/components/FeatureShowcase';
import { Segments } from '@/components/Segments';
import { PortalsGrid } from '@/components/PortalsGrid';
import { LiveDashboard } from '@/components/LiveDashboard';
import { Integrations } from '@/components/Integrations';
import { Security } from '@/components/Security';
import { Pricing } from '@/components/Pricing';
import { CTABanner } from '@/components/CTABanner';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Nav />
      <Hero />
      <LogoCloud />
      <FeatureShowcase />
      <Segments />
      <PortalsGrid />
      <LiveDashboard />
      <Integrations />
      <Security />
      <Pricing />
      <CTABanner />
      <Footer />
    </main>
  );
}
