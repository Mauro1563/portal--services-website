import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/psd/Nav';
import { Ticker } from '@/components/psd/Ticker';
import { Hero } from '@/components/psd/Hero';
import { StatsBand } from '@/components/psd/StatsBand';
import { Portals } from '@/components/psd/Portals';
import { TechSection } from '@/components/psd/TechSection';
import { Platform, VIP, Loyalty, Payments, Testimonials } from '@/components/psd/Showcase';
import { Pricing, FAQ } from '@/components/psd/Pricing';
import { Comparison, Security } from '@/components/psd/Lower';
import { CTA, Footer } from '@/components/psd/Footer';
import { StructuredData } from '@/components/StructuredData';
import { getBranding, brandingStyle } from '@/lib/branding';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const branding = await getBranding();

  return (
    <div className="psd">
      <style dangerouslySetInnerHTML={{ __html: brandingStyle(branding) }} />
      <StructuredData locale={locale} />
      <Ticker />
      <Nav logoUrl={branding.logoUrl} />
      <main>
        <Hero />
        <StatsBand />
        <Portals />
        <TechSection />
        <Platform />
        <VIP />
        <Loyalty />
        <Payments />
        <Testimonials />
        <Pricing />
        <Comparison />
        <Security />
        <FAQ />
        <CTA />
        <Footer logoUrl={branding.logoUrl} />
      </main>
    </div>
  );
}
