import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TopBanner } from '@/components/v2/marketing/TopBanner';
import { Nav } from '@/components/v2/marketing/Nav';
import { Hero } from '@/components/v2/marketing/Hero';
import { TrustBand } from '@/components/v2/marketing/TrustBand';
import { PortalsGrid } from '@/components/v2/marketing/PortalsGrid';
import { HowItWorks } from '@/components/v2/marketing/HowItWorks';
import { Pricing } from '@/components/v2/marketing/Pricing';
import { Faq } from '@/components/v2/marketing/Faq';
import { Cta } from '@/components/v2/marketing/Cta';
import { Footer } from '@/components/v2/marketing/Footer';
import { StructuredData } from '@/components/StructuredData';
import { getBranding } from '@/lib/branding';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const branding = await getBranding();

  const [tNav, tFaq] = await Promise.all([
    getTranslations('nav'),
    getTranslations('faq'),
  ]);

  const navLinks = {
    product: tNav('product'),
    portals: tNav('solutions'),
    pricing: tNav('pricing'),
    security: tNav('security'),
  };

  const faqItems = [
    { q: tFaq('q1'), a: tFaq('a1') },
    { q: tFaq('q2'), a: tFaq('a2') },
    { q: tFaq('q3'), a: tFaq('a3') },
    { q: tFaq('q4'), a: tFaq('a4') },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <StructuredData locale={locale} />
      <TopBanner />
      <Nav
        logoUrl={branding.logoUrl}
        ctaPrimary={tNav('cta')}
        ctaSecondary={tNav('login')}
        links={navLinks}
      />
      <main>
        <Hero />
        <TrustBand />
        <PortalsGrid />
        <HowItWorks />
        <Pricing />
        <Faq title={tFaq('title')} items={faqItems} />
        <Cta />
      </main>
      <Footer logoUrl={branding.logoUrl} />
    </div>
  );
}
