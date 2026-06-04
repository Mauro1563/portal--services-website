import { getTranslations } from 'next-intl/server';

export async function TrustBand() {
  const t = await getTranslations('trusted');
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
          {t('label')}
        </p>
      </div>
    </section>
  );
}
