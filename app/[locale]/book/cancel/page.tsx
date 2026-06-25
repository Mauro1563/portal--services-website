import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

type LocaleParam = { locale: 'en' | 'es' | 'pt' };
type Search = { booking_id?: string };

export default async function BookCancelPage({
  params,
  searchParams,
}: {
  params: Promise<LocaleParam>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  const { booking_id } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'book' });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500">
            <XCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            {t('cancel.title')}
          </h1>
          <p className="mt-1 text-slate-600">{t('cancel.subtitle')}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-110"
            >
              {t('cancel.retry')}
            </Link>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
            >
              {t('cancel.home')}
            </Link>
          </div>

          {booking_id && (
            <p className="mt-6 text-[11px] text-slate-500">
              {t('cancel.refId')}: <span className="font-mono">{booking_id}</span>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
