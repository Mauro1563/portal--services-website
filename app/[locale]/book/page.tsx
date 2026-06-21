import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { loadPricingConfig, type Frequency } from '@/lib/pricing';
import { BookConfigurator } from './BookConfigurator';

export const dynamic = 'force-dynamic';

type LocaleParam = { locale: 'en' | 'es' | 'pt' };

function pickI18n(
  obj: Record<string, string> | null | undefined,
  locale: string,
): string {
  if (!obj) return '';
  return obj[locale] ?? obj.en ?? obj.es ?? Object.values(obj)[0] ?? '';
}

export default async function BookPage({
  params,
}: {
  params: Promise<LocaleParam>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/${locale}/book`);

  const t = await getTranslations({ locale, namespace: 'book' });

  // Pull catalog + pricing config in parallel.
  const [{ data: serviceRows }, { data: extraRows }, pricing] =
    await Promise.all([
      supabase
        .from('booking_services')
        .select('key, name_i18n, description_i18n, base_price, sort')
        .eq('active', true)
        .order('sort'),
      supabase
        .from('booking_extras')
        .select('key, label_i18n, price, sort')
        .eq('active', true)
        .order('sort'),
      loadPricingConfig(supabase),
    ]);

  const services = (serviceRows ?? []).map((s) => ({
    key: s.key as string,
    name: pickI18n(s.name_i18n as Record<string, string>, locale),
    description: pickI18n(
      s.description_i18n as Record<string, string>,
      locale,
    ),
    base_price: Number(s.base_price),
  }));

  const extras = (extraRows ?? []).map((e) => ({
    key: e.key as string,
    label: pickI18n(e.label_i18n as Record<string, string>, locale),
    price: Number(e.price),
  }));

  // Shape PricingConfig so calcPrice on the client matches server.
  const pricingForClient = {
    ...pricing,
    freqDiscount: pricing.freqDiscount as Record<Frequency, number>,
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {t('eyebrow')}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-2 max-w-xl text-slate-600">{t('subtitle')}</p>
        </header>

        <BookConfigurator
          services={services}
          extras={extras}
          pricing={pricingForClient}
        />
      </div>
    </main>
  );
}
