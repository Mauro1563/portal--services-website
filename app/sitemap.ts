import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://portalservices.digital';
  const locales = ['en', 'es', 'pt'];
  const paths = ['', '/docs', '/privacy', '/terms'];

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1.0 : 0.5,
    })),
  );
}
