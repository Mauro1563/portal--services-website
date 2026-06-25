import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { CheckCircle2, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type LocaleParam = { locale: 'en' | 'es' | 'pt'; id: string };

export default async function BookSuccessPage({
  params,
}: {
  params: Promise<LocaleParam>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/${locale}/book`);

  // RLS on bookings already restricts to the user's own rows.
  const { data: booking } = await supabase
    .from('bookings')
    .select(
      'id, price_total, currency, status, date, slot, frequency, size, baths, created_at, booking_services(key, name_i18n)',
    )
    .eq('id', id)
    .single();
  if (!booking) notFound();

  const t = await getTranslations({ locale, namespace: 'book' });

  const svcRel = booking.booking_services as unknown as
    | { key: string; name_i18n: Record<string, string> }
    | { key: string; name_i18n: Record<string, string> }[]
    | null;
  const svc = Array.isArray(svcRel) ? svcRel[0] ?? null : svcRel;
  const svcName =
    svc?.name_i18n?.[locale] ?? svc?.name_i18n?.en ?? svc?.key ?? '';

  const isPaid = booking.status === 'paid';

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div
            className={`grid h-12 w-12 place-items-center rounded-full ${
              isPaid
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-amber-100 text-amber-600'
            }`}
          >
            {isPaid ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <Clock className="h-6 w-6" />
            )}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            {isPaid ? t('success.titlePaid') : t('success.title')}
          </h1>
          <p className="mt-1 text-slate-600">
            {isPaid ? t('success.subtitlePaid') : t('success.subtitle')}
          </p>

          <dl className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm">
            <Row label={t('summary.service')} value={svcName} />
            <Row label={t('summary.frequency')} value={t(`freqs.${booking.frequency}`)} />
            {booking.date && (
              <Row label={t('summary.date')} value={booking.date} />
            )}
            {booking.slot && (
              <Row label={t('summary.slot')} value={t(`slots.${booking.slot}`)} />
            )}
            <Row label={t('summary.size')} value={t(`sizes.${booking.size}`)} />
            <Row label={t('summary.baths')} value={String(booking.baths)} />
            <Row
              label={t('total.eyebrow')}
              value={`${booking.currency === 'EUR' ? '€' : booking.currency} ${Number(booking.price_total)}`}
              emphasis
            />
            <Row label={t('summary.status')} value={booking.status} />
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
            >
              {t('success.newBooking')}
            </Link>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-110"
            >
              {t('success.home')}
            </Link>
          </div>

          <p className="mt-6 text-[11px] text-slate-500">
            {t('success.refId')}: <span className="font-mono">{booking.id}</span>
          </p>
        </div>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={
          emphasis
            ? 'font-bold text-slate-900 tabular-nums'
            : 'font-medium text-slate-800'
        }
      >
        {value}
      </dd>
    </div>
  );
}
