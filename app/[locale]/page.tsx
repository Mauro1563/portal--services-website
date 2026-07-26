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

// Kept dynamic while we're iterating on the landing so Vercel's edge
// doesn't keep serving stale versions to visitors. Combined with the
// visible BUILD_STAMP so we can verify which build a user is actually
// hitting via view-source.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BUILD_STAMP = 'psd-landing-full-redesign-2026-07-26';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations('psdSite.nav');

  return (
    <div
      className="min-h-screen bg-white font-sans text-psd-text antialiased"
      data-build={BUILD_STAMP}
    >
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
