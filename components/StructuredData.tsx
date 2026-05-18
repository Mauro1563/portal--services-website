import { getTranslations } from 'next-intl/server';

const SITE_URL = 'https://portalservices.digital';

export async function StructuredData({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'faq' });

  const faqQuestions = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
    '@type': 'Question',
    name: t(`q${i}` as 'q1'),
    acceptedAnswer: {
      '@type': 'Answer',
      text: t(`a${i}` as 'a1'),
    },
  }));

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
