import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { TopBanner } from '@/components/v2/marketing/TopBanner';
import { Nav } from '@/components/v2/marketing/Nav';
import { Hero } from '@/components/v2/marketing/Hero';
import { TrustBand } from '@/components/v2/marketing/TrustBand';
import { PortalsGrid } from '@/components/v2/marketing/PortalsGrid';
import { ModulesGrid } from '@/components/v2/marketing/ModulesGrid';
import { CorporateHubFeature } from '@/components/v2/marketing/CorporateHubFeature';
import { RealtimeMobile } from '@/components/v2/marketing/RealtimeMobile';
import { Metrics } from '@/components/v2/marketing/Metrics';
import { Cta } from '@/components/v2/marketing/Cta';
import { Footer } from '@/components/v2/marketing/Footer';
import { StructuredData } from '@/components/StructuredData';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations('psdSite.nav');

  return (
    <div className="min-h-screen bg-white font-sans text-psd-text antialiased">
      <StructuredData locale={locale} />
      <TopBanner />
      <Nav
        links={{
          product: tNav('product'),
          roles: tNav('roles'),
          modules: tNav('modules'),
          contact: tNav('contact'),
        }}
        ctaPrimary={tNav('cta')}
        ctaSecondary={tNav('login')}
      />
      <main>
        <Hero />
        <TrustBand />
        <PortalsGrid />
        <ModulesGrid />
        <CorporateHubFeature />
        <RealtimeMobile />
        <Metrics />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
