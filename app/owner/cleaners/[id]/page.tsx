import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  KeyRound,
  Pencil,
  RefreshCw,
  Trash2,
  XCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { cleanerLoginUrl } from '@/lib/cleaner-link';
import { getLocale } from '@/lib/i18n';
import { getOwnerProfile } from '@/lib/owner-profile';
import { deleteCleaner, regeneratePin } from './actions';
import { PinShareActions, type ShareLang } from './PinShareActions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

type TaskHistory = {
  id: string;
  scheduled_for: string;
  status: string;
  checked_in_at: string | null;
  completed_at: string | null;
  property: { name: string } | null;
};

export default async function CleanerDetail({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const [{ data: cleaner }, { data: rawTasks }, { data: rawRatings }] =
    await Promise.all([
      supabase
        .from('cleaners')
        .select('id, name, phone, email, pin, created_at')
        .eq('id', id)
        .maybeSingle(),
      supabase
        .from('tasks')
        .select(
          'id, scheduled_for, status, checked_in_at, completed_at, property:properties (name)',
        )
        .eq('cleaner_id', id)
        .order('scheduled_for', { ascending: false })
        .limit(10),
      supabase
        .from('task_ratings')
        .select('stars, comment, created_at')
        .eq('cleaner_id', id)
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

  if (!cleaner) notFound();

  // Owner profile drives the welcome message branding ("equipo de X").
  // Locale seeds the language picker on the share panel; owner can flip.
  const [profile, locale] = await Promise.all([
    getOwnerProfile(user.id),
    getLocale(),
  ]);
  const defaultLang: ShareLang =
    locale === 'es' || locale === 'pt' ? locale : 'en';

  const tasks = (rawTasks ?? []) as unknown as TaskHistory[];

  const completed = tasks.filter((t) => t.status === 'completed');
  const cancelled = tasks.filter((t) => t.status === 'cancelled');
  const withDuration = completed.filter((t) => t.checked_in_at && t.completed_at);
  const avgMinutes =
    withDuration.length === 0
      ? null
      : Math.round(
          withDuration.reduce((sum, t) => {
            const start = new Date(t.checked_in_at!).getTime();
            const end = new Date(t.completed_at!).getTime();
            return sum + Math.max(0, (end - start) / 60000);
          }, 0) / withDuration.length,
        );

  const lastCompleted = completed[0]?.completed_at ?? null;

  type RatingItem = { stars: number; comment: string | null; created_at: string };
  const ratings = (rawRatings ?? []) as RatingItem[];
  const avgStars =
    ratings.length === 0
      ? null
      : ratings.reduce((s, r) => s + r.stars, 0) / ratings.length;

  return (
    <LightLayout
      activeTab="cleaners"
      title={cleaner.name}
      showBack
      backHref="/owner/cleaners"
      rightSlot={
        <Link
          href={`/owner/cleaners/${cleaner.id}/edit`}
          aria-label="Edit"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/[0.06]"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
        Cleaner
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-text-1">
        {cleaner.name}
      </h1>
      <p className="mt-1 text-sm text-text-2">
        {[cleaner.phone, cleaner.email].filter(Boolean).join(' · ') ||
          'No contact info on file.'}
      </p>

      {error && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}

      {/* PIN + share — brand-tinted card */}
      <section className="mt-6 rounded-2xl border border-brand-600/30 bg-brand-600/[0.04] p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
              Operative PIN
            </p>
            <p className="mt-2 inline-flex items-center gap-2 font-display text-2xl font-bold tracking-[0.3em] text-brand-700">
              <KeyRound className="h-5 w-5" />
              {cleaner.pin ?? 'NO PIN'}
            </p>
            <p className="mt-2 text-[11px] text-text-2">
              Cleaner uses it at{' '}
              <span className="text-text-1">hq.portalservices.digital</span> →{' '}
              <em>I&apos;m a cleaner</em>.
            </p>
          </div>
          <form action={regeneratePin}>
            <input type="hidden" name="cleaner_id" value={cleaner.id} />
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1"
            >
              <RefreshCw className="h-4 w-4" /> Regenerate
            </button>
          </form>
        </div>
        {cleaner.pin && (
          <div className="mt-4 border-t border-brand-600/20 pt-4">
            <PinShareActions
              cleanerName={cleaner.name}
              pin={cleaner.pin}
              phone={cleaner.phone ?? null}
              email={cleaner.email ?? null}
              loginUrl={cleanerLoginUrl(cleaner.pin)}
              businessName={profile?.business_name ?? null}
              defaultLang={defaultLang}
            />
          </div>
        )}
      </section>

      {/* Performance snapshot */}
      <section className="mt-6">
        <h2 className="font-display text-base font-semibold text-text-1">
          Performance snapshot
        </h2>
        <p className="mt-0.5 text-[11px] text-text-3">
          Based on the last 10 cleanings.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            label="Completed"
            value={String(completed.length)}
          />
          <StatCard
            icon={<XCircle className="h-4 w-4 text-rose-600" />}
            label="Cancelled"
            value={String(cancelled.length)}
          />
          <StatCard
            icon={<Clock className="h-4 w-4 text-brand-600" />}
            label="Avg. time on site"
            value={avgMinutes === null ? '—' : avgMinutes + ' min'}
          />
          <StatCard
            icon={<CheckCircle2 className="h-4 w-4 text-brand-600" />}
            label="Last completed"
            value={
              lastCompleted
                ? new Date(lastCompleted).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })
                : '—'
            }
          />
        </div>
      </section>

      {/* Client ratings */}
      {avgStars != null && (
        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-card">
          <h2 className="font-display text-base font-semibold text-text-1">
            ⭐ Client ratings
          </h2>
          <p className="mt-2 font-display text-3xl font-bold tabular-nums text-text-1">
            {avgStars.toFixed(1)}
            <span className="ml-1 text-sm font-medium text-text-3">
              / 5 · {ratings.length} review{ratings.length === 1 ? '' : 's'}
            </span>
          </p>
          <ul className="mt-4 space-y-2">
            {ratings.slice(0, 5).map((r, i) => (
              <li
                key={i}
                className="rounded-xl border border-amber-200 bg-surface-0 p-3 text-xs"
              >
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={
                        n <= r.stars ? 'text-amber-500' : 'text-surface-2'
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-[10px] text-text-3">
                    {new Date(r.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                {r.comment ? (
                  <p className="mt-1.5 text-text-1">{r.comment}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recent activity */}
      <section className="mt-6">
        <h2 className="font-display text-base font-semibold text-text-1">
          Recent activity
        </h2>
        {tasks.length === 0 ? (
          <p className="mt-2 text-sm text-text-2">
            No cleanings yet.{' '}
            <Link
              href="/owner/tasks/new"
              className="text-brand-600 hover:text-brand-700"
            >
              Schedule one →
            </Link>
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-surface-2 overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card">
            {tasks.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/owner/tasks/${t.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-surface-1"
                >
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-text-1">
                      {t.property?.name ?? 'Property removed'}
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-3">
                      {new Date(t.scheduled_for).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                  <StatusPill status={t.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Danger zone */}
      <section className="mt-6 mb-4 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <h2 className="text-xs font-semibold text-rose-700">Danger zone</h2>
        <p className="mt-1 text-[11px] text-rose-700/80">
          Deleting {cleaner.name} unassigns them from any future cleanings.
          Past cleanings keep their record. This can&apos;t be undone.
        </p>
        <form action={deleteCleaner} className="mt-3">
          <input type="hidden" name="cleaner_id" value={cleaner.id} />
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-300 bg-white px-3 text-xs font-medium text-rose-700 hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete cleaner
          </button>
        </form>
      </section>
    </LightLayout>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-wider text-text-3">
          {label}
        </p>
        {icon}
      </div>
      <p className="mt-2 font-display text-xl font-bold text-text-1 tabular-nums">
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    scheduled: {
      label: 'Pending',
      cls: 'bg-amber-50 text-amber-700 ring-amber-200',
    },
    in_progress: {
      label: 'In progress',
      cls: 'bg-sky-50 text-sky-700 ring-sky-200',
    },
    completed: {
      label: 'Completed',
      cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    },
    cancelled: {
      label: 'Cancelled',
      cls: 'bg-rose-50 text-rose-700 ring-rose-200',
    },
  };
  const it = map[status] ?? map.scheduled;
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${it.cls}`}
    >
      {it.label}
    </span>
  );
}
