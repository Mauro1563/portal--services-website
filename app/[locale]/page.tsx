import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/psd/Nav';
import { Hero, LogoStrip } from '@/components/psd/Hero';
import { Portals } from '@/components/psd/Portals';
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
      <Nav logoUrl={branding.logoUrl} />
      <main>
        <Hero />
        <LogoStrip />
        <Portals />
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
