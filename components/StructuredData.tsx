import { getTranslations } from 'next-intl/server';

const SITE_URL = 'https://portalservices.digital';

export async function StructuredData({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'faq' });

  // Keep these in sync with messages/{locale}.json → faq.items.*
  // and with the FAQ rendered on the homepage (app/[locale]/page.tsx).
  const faqQuestions = (['install', 'import', 'offline', 'branding'] as const).map(
    (key) => ({
      '@type': 'Question',
      name: t(`items.${key}.q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`items.${key}.a`),
      },
    }),
  );

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Portal Services Digital',
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    sameAs: [] as string[],
    description:
      'Operational OS for cleaning, facilities and Airbnb teams. Replace WhatsApp and Excel with one platform.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    },
  };

  const softwareApplication = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Portal Services Digital',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Operational platform for cleaning, facilities and Airbnb teams: shift control, supervisor inbox, GPS check-in, photo evidence, iCal sync.',
    offers: {
      '@type': 'Offer',
      price: '49',
      priceCurrency: 'GBP',
    },
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqQuestions,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
