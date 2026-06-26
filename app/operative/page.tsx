import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Hammer,
  MapPin,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  UserCog,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { EmptyState } from '@/components/EmptyState';
import { getT } from '@/lib/i18n';
import {
  CorporateBanner,
  PortalHero,
  PortalShell,
  StatRow,
  ToolCard,
  ToolGrid,
} from '@/components/portal/PortalDashboardShell';
import { signOutOperative } from './actions';
import { CheckInButton } from './CheckInButton';
import { PhotoUploadButton } from './PhotoUploadButton';
import { ThemeToggle } from '@/components/operative/ThemeToggle';

type OperativeTask = {
  id: string;
  scheduled_for: string;
  status: string;
  notes: string | null;
  checked_in_at: string | null;
  photo_url: string | null;
  property: { name: string; address: string | null } | null;
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

function greeting(t: (k: string) => string) {
  const hour = new Date().getHours();
  if (hour < 12) return { text: t('operative.greetingMorning'), icon: Sunrise };
  if (hour < 18) return { text: t('operative.greetingAfternoon'), icon: Sun };
  return { text: t('operative.greetingEvening'), icon: Sunset };
}

export default async function OperativeHome({ searchParams }: Props) {
  const cookieStore = await cookies();
  const cleanerId = cookieStore.get('cleaner_session')?.value;
  if (!cleanerId) redirect('/operative/login');

  const admin = createAdminClient();
  const { data: cleaner } = await admin
    .from('cleaners')
    .select('id, name')
    .eq('id', cleanerId)
    .maybeSingle();
  if (!cleaner) redirect('/operative/login');

  const { error } = await searchParams;
  const t = await getT();
  const today = new Date().toISOString().split('T')[0];

  const { data } = await admin
    .from('tasks')
    .select(
      'id, scheduled_for, status, notes, checked_in_at, photo_url, property:properties (name, address)',
    )
    .eq('cleaner_id', cleanerId)
    .gte('scheduled_for', today)
    .order('scheduled_for', { ascending: true });

  const tasks = (data ?? []) as unknown as OperativeTask[];
  const todayTasks = tasks.filter((task) => task.scheduled_for === today);
  const upcomingTasks = tasks.filter((task) => task.scheduled_for > today);
  const todayInProgress = todayTasks.filter((task) => task.status === 'in_progress');
  const todayPending = todayTasks.filter((task) => task.status === 'scheduled');
  const todayCompleted = todayTasks.filter((task) => task.status === 'completed');
  const heroTask = todayInProgress[0] ?? todayPending[0] ?? null;
  const doneToday = todayCompleted.length;
  const totalToday = todayTasks.length;

  const g = greeting(t);
  const firstName = cleaner.name.split(' ')[0];
  const isCover = todayInProgress.length > 0;

  return (
    <PortalShell
      badge={{ label: 'Cleaner portal', icon: Hammer }}
      settingsHref="/operative/profile"
      rightSlot={
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <form action={signOutOperative}>
            <button
              type="submit"
              className="text-[11px] font-semibold text-text-3 hover:text-text-1"
            >
              {t('operative.signOut')}
            </button>
          </form>
        </div>
      }
    >
      <PortalHero
        portalLabel="Cleaner portal"
        portalIcon={Hammer}
        topRightChip={{
          label: new Date().getHours() < 18 ? 'Day' : 'Night',
          icon: new Date().getHours() < 18 ? Sun : Moon,
        }}
        greeting={g.text}
        displayName={firstName}
        chips={[
          { kind: 'text', label: isCover ? 'Cover Operative' : 'On duty' },
          { kind: 'status', status: 'online', label: 'online' },
        ]}
      />

      <StatRow
        items={[
          { label: 'Today', value: totalToday, sub: 'tasks scheduled' },
          { label: 'Done', value: doneToday, sub: 'completed' },
          { label: 'Upcoming', value: upcomingTasks.length, sub: 'next days' },
        ]}
      />

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      <ToolGrid>
        <ToolCard
          href="/operative/week"
          icon={CalendarDays}
          title="My week"
          subtitle={`Schedule · earnings · rating`}
          accent="brand"
        />
        <ToolCard
          href="/operative/profile"
          icon={UserCog}
          title="My profile"
          subtitle="Name · contact"
          accent="navy"
        />
      </ToolGrid>

      {heroTask ? (
        <section className="relative mt-6 animate-fade-up overflow-hidden rounded-3xl border border-clean-aqua/30 bg-gradient-to-br from-clean-aqua-soft/40 via-white to-brand-50 p-5 shadow-sparkle-glow">
          <span
            aria-hidden
            className="pointer-events-none absolute right-3 top-3 text-[12px] text-clean-aqua-glow animate-sparkle"
          >
            ✦
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute right-7 top-6 text-[9px] text-clean-aqua animate-sparkle"
            style={{ animationDelay: '0.7s' }}
          >
            ✦
          </span>
          <p className="relative text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
            {heroTask.status === 'in_progress'
              ? t('operative.inProgress')
              : t('operative.nextUp')}
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold text-text-1">
            {heroTask.property?.name ?? 'Property removed'}
          </h2>
          {heroTask.property?.address ? (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-2">
              <MapPin className="h-3.5 w-3.5 text-brand-600" />
              {heroTask.property.address}
            </p>
          ) : null}
          {heroTask.notes ? (
            <p className="mt-3 rounded-xl border border-surface-2 bg-surface-0 px-3 py-2 text-xs leading-relaxed text-text-2">
              <span className="font-semibold text-brand-700">
                {t('operative.noteFromManager')}{' '}
              </span>
              {heroTask.notes}
            </p>
          ) : null}
          {heroTask.status === 'in_progress' && heroTask.checked_in_at ? (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-600/10 px-3 py-1.5 text-[11px] text-brand-700">
              <CheckCircle2 className="h-3 w-3" />
              Checked in at{' '}
              {new Date(heroTask.checked_in_at).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          ) : null}
          <div className="mt-5">
            {heroTask.status === 'in_progress' ? (
              <PhotoUploadButton taskId={heroTask.id} />
            ) : (
              <CheckInButton taskId={heroTask.id} />
            )}
          </div>
        </section>
      ) : null}

      {totalToday === 0 && upcomingTasks.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-surface-2 bg-surface-0">
          <EmptyState
            icon={Clock}
            tone="neutral"
            title={t('operative.noAssignmentsYet')}
            description="Cuando tu manager te asigne una limpieza, vas a verla acá. También te llega notificación si tenés la app instalada."
          />
        </div>
      ) : null}

      {/* The hero card highlights one task; the rest of today's queue would
          otherwise be invisible until that one is finished. */}
      {heroTask && todayTasks.length > 1 ? (
        <section className="mt-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
            More today ({todayTasks.length - 1})
          </h2>
          <ul className="mt-3 space-y-2">
            {todayTasks
              .filter((task) => task.id !== heroTask.id)
              .map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/operative/tasks/${task.id}`}
                    className="flex items-center gap-3 rounded-2xl border border-surface-2 bg-surface-0 px-4 py-3 shadow-card transition hover:border-brand-600/30 hover:shadow-card-lg"
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        task.status === 'completed'
                          ? 'bg-emerald-500'
                          : task.status === 'in_progress'
                          ? 'bg-amber-500'
                          : 'bg-brand-600/40'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-semibold text-text-1">
                        {task.property?.name ?? 'Property removed'}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-text-3">
                        {task.property?.address ?? 'No address on file'}
                      </p>
                    </div>
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : null}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      <CorporateBanner
        href="/operative/week"
        eyebrow="Cleaner hub"
        title="Schedule · Hours · Updates"
        subtitle="Everything you need this week"
      />

      {upcomingTasks.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
            {t('operative.comingUp').replace('{n}', String(upcomingTasks.length))}
          </h2>
          <ul className="mt-3 space-y-2">
            {upcomingTasks.slice(0, 6).map((task) => (
              <li key={task.id}>
                <Link
                  href={`/operative/tasks/${task.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-surface-2 bg-surface-0 px-4 py-3 shadow-card transition hover:border-brand-600/30 hover:shadow-card-lg"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600/40" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-text-1">
                      {task.property?.name ?? 'Property removed'}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-text-3">
                      {new Date(task.scheduled_for).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </PortalShell>
  );
}

