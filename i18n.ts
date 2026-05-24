import { getRequestConfig } from 'next-intl/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { deepMerge, isObject, type Json } from '@/lib/deep-merge';

export const locales = ['en', 'es', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/**
 * CMS overrides for the public site live in marketing_content under
 * section `site_<locale>` as a partial of the `psd` namespace. Merging them
 * here means every server + client component picks up edits automatically.
 */
async function loadSiteOverride(locale: string): Promise<Json | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('marketing_content')
      .select('content')
      .eq('section', `site_${locale}`)
      .maybeSingle();
    return (data?.content as Json) ?? null;
  } catch {
    return null;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  const base = (await import(`./messages/${locale}.json`)).default as unknown as Json;

  const override = await loadSiteOverride(locale);
  // Clone (don't mutate the cached JSON module) and merge the CMS override
  // into the `psd` namespace so server + client components pick it up.
  const messages =
    override && isObject(base.psd)
      ? { ...base, psd: deepMerge(base.psd as Json, override) }
      : base;

  // next-intl's AbstractIntlMessages is stricter than our generic Json shape.
  return { locale, messages: messages as Record<string, never> };
});
