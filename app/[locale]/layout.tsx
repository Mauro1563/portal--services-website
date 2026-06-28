import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '../../i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const OG_LOCALE: Record<string, string> = {
  en: 'en_GB',
  es: 'es_ES',
  pt: 'pt_PT',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const title = t('title');
  const description = t('description');
  return {
    // Use absolute so the root layout's "| Zapli" template doesn't
    // double up with the "Zapli —" prefix already in metadata.title.
    title: { absolute: title },
    description,
    keywords: t('keywords'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      locale: OG_LOCALE[locale] ?? 'en_GB',
      type: 'website',
      images: [{ url: '/og.png', alt: t('ogImageAlt') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
    },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
