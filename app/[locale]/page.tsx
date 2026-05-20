import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { TwoPortals } from '@/components/TwoPortals';
import { LogoCloud } from '@/components/LogoCloud';
import { FeatureShowcase } from '@/components/FeatureShowcase';
import { Segments } from '@/components/Segments';
import { HowItWorks } from '@/components/HowItWorks';
import { PortalsGrid } from '@/components/PortalsGrid';
import { StructuredData } from '@/components/StructuredData';
import { LiveDashboard } from '@/components/LiveDashboard';
import { Integrations } from '@/components/Integrations';
import { Security } from '@/components/Security';
import { Pricing } from '@/components/Pricing';
import { FAQ } from '@/components/FAQ';
import { CTABanner } from '@/components/CTABanner';
import { Footer } from '@/components/Footer';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="relative overflow-hidden">
      <StructuredData locale={locale} />
      <Nav />
      <Hero />
      <TwoPortals />
      <LogoCloud />
      <FeatureShowcase />
      <Segments />
      <HowItWorks />
      <PortalsGrid />
      <LiveDashboard />
      <Integrations />
      <Security />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}
