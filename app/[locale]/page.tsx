import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { StatsBand } from '@/components/StatsBand';
import { TrustedBy } from '@/components/TrustedBy';
import { PortalsGrid } from '@/components/PortalsGrid';
import { ProductShowcase } from '@/components/ProductShowcase';
import { VIPExperience } from '@/components/VIPExperience';
import { LoyaltyClub } from '@/components/LoyaltyClub';
import { PaymentsSection } from '@/components/PaymentsSection';
import { Testimonials } from '@/components/Testimonials';
import { Security } from '@/components/Security';
import { Pricing } from '@/components/Pricing';
import { FeatureComparison } from '@/components/FeatureComparison';
import { FAQ } from '@/components/FAQ';
import { CTABanner } from '@/components/CTABanner';
import { Footer } from '@/components/Footer';
import { StructuredData } from '@/components/StructuredData';

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
      <StatsBand />
      <TrustedBy />
      <PortalsGrid />
      <ProductShowcase />
      <VIPExperience />
      <LoyaltyClub />
      <PaymentsSection />
      <Testimonials />
      <Pricing />
      <FeatureComparison />
      <Security />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}
