import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, MapPin, Navigation2 } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { CheckInButton } from './CheckInButton';
import { PhotoUploadButton } from './PhotoUploadButton';
import { AgendaHeader } from '@/components/operative/AgendaHeader';
import { AgendaTimeline, type AgendaTask } from '@/components/operative/AgendaTimeline';
import { EarningsStrip } from '@/components/operative/EarningsStrip';
import { BottomTabBar } from '@/components/operative/BottomTabBar';
import { getUnreadOwnerMessagesForCleaner } from '@/lib/cleaner-messages';
import { PWAInstall } from '@/components/operative/PWAInstall';
import { routeUrl, singleStopUrl, telUrl, type Stop } from '@/lib/maps';

type OperativeTask = {
  id: string;
  scheduled_for: string;
  start_time: string | null;
  status: string;
  notes: string | null;
  checked_in_at: string | null;
  completed_at: string | null;
  estimated_duration_min: number | null;
  price_pence: number | null;
  property: { name: string | null; address: string | null } | null;
  client: {
    name: string | null;
    address: string | null;
    postcode: string | null;
    phone: string | null;
  } | null;
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

function startOfWeek(d = new Date()): string {
  const day = d.getUTCDay();
  const diff = (day + 6) % 7;
  const monday = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - diff),
  );
  return monday.toISOString().slice(0, 10);
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
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const weekStartIso = startOfWeek(now);

  const [{ data }, unreadChat] = await Promise.all([
    admin
      .from('tasks')
      .select(
        'id, scheduled_for, start_time, status, notes, checked_in_at, completed_at, estimated_duration_min, price_pence, property:properties (name, address), client:clients (name, address, postcode, phone)',
      )
      .eq('cleaner_id', cleanerId)
      .gte('scheduled_for', weekStartIso)
      .order('scheduled_for', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false }),
    getUnreadOwnerMessagesForCleaner(cleanerId),
  ]);

  const tasks = (data ?? []) as unknown as OperativeTask[];
  const todayTasks = tasks.filter((t) => t.scheduled_for === today);
  const todayInProgress = todayTasks.filter((t) => t.status === 'in_progress');
  const todayPending = todayTasks.filter((t) => t.status === 'scheduled');
  const todayCompleted = todayTasks.filter((t) => t.status === 'completed');
  const heroTask = todayInProgress[0] ?? todayPending[0] ?? null;

  // Earnings — today vs week.
  const todayEarnings = todayCompleted.reduce(
    (sum, t) => sum + (t.price_pence ?? 0),
    0,
  );
  const weekCompleted = tasks.filter((t) => t.status === 'completed');
  const weekEarnings = weekCompleted.reduce(
    (sum, t) => sum + (t.price_pence ?? 0),
    0,
  );

  // Multi-stop "Open route" — only for non-completed stops.
  const remaining = todayTasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'cancelled',
  );
  const stops: Stop[] = remaining.flatMap((t) => {
    const address = t.client?.address ?? t.property?.address ?? null;
    const postcode = t.client?.postcode ?? null;
    return address ? [{ address, postcode }] : [];
  });
  const route = routeUrl(stops);

  // Hero-task accessory data.
  const heroAddress =
    heroTask?.client?.address ?? heroTask?.property?.address ?? null;
  const heroPostcode = heroTask?.client?.postcode ?? null;
  const heroMapsUrl = heroAddress
    ? singleStopUrl({ address: heroAddress, postcode: heroPostcode })
    : null;
  const heroTel = telUrl(heroTask?.client?.phone);

  const agendaTasks: AgendaTask[] = todayTasks.map((t) => ({
    id: t.id,
    start_time: t.start_time,
    status: t.status,
    estimated_duration_min: t.estimated_duration_min,
    property: t.property,
    client: t.client,
  }));

  return (
    <main className="min-h-screen bg-canvas pb-24">
      <div className="mx-auto max-w-md px-4 py-5">
        <AgendaHeader
          cleanerName={cleaner.name}
          now={now}
          doneCount={todayCompleted.length}
          totalCount={todayTasks.length}
        />

        <EarningsStrip
          todayPence={todayEarnings}
          weekPence={weekEarnings}
        />

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        ) : null}

        {/* Hero — the "what's next right now" card */}
        {heroTask ? (
          <section className="mt-5 rounded-2xl border border-brand-600/30 bg-gradient-to-br from-white via-brand-50/40 to-cyan-50/40 p-4 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
                {heroTask.status === 'in_progress' ? 'En curso ahora' : 'Siguiente parada'}
              </p>
              {heroTask.start_time ? (
                <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold tabular-nums text-white">
                  {heroTask.start_time.slice(0, 5)}
                </span>
              ) : null}
            </div>
            <h2 className="mt-2 font-display text-lg font-semibold text-text-1">
              {heroTask.client?.name ?? heroTask.property?.name ?? 'Sin destino'}
            </h2>
            {heroAddress ? (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-2">
                <MapPin className="h-3.5 w-3.5 text-brand-600" />
                {heroAddress}
                {heroPostcode ? ` · ${heroPostcode}` : ''}
              </p>
            ) : null}

            {heroTask.status === 'in_progress' && heroTask.checked_in_at ? (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="h-3 w-3" />
                Checked in{' '}
                {new Date(heroTask.checked_in_at).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            ) : null}

            {/* Quick row: maps + call */}
            {(heroMapsUrl || heroTel) ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {heroMapsUrl ? (
                  <a
                    href={heroMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2.5 text-[12px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.5)]"
                  >
                    <Navigation2 className="h-3.5 w-3.5" /> Ir
                  </a>
                ) : null}
                {heroTel ? (
                  <a
                    href={heroTel}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-surface-2 bg-surface-0 px-3 py-2.5 text-[12px] font-bold text-text-1"
                  >
                    Llamar
                  </a>
                ) : null}
              </div>
            ) : null}

            <div className="mt-3">
              {heroTask.status === 'in_progress' ? (
                <PhotoUploadButton taskId={heroTask.id} />
              ) : (
                <CheckInButton taskId={heroTask.id} />
              )}
            </div>
          </section>
        ) : null}

        {/* Agenda timeline */}
        {todayTasks.length > 0 ? (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
                Agenda de hoy
              </h2>
              {route ? (
                <a
                  href={route.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 hover:text-brand-800"
                >
                  <Navigation2 className="h-3 w-3" /> Abrir ruta
                </a>
              ) : null}
            </div>
            {route?.truncated ? (
              <p className="mt-1 text-[10px] text-amber-700">
                Google Maps acepta máximo 10 paradas — la ruta abre las primeras.
              </p>
            ) : null}
            <AgendaTimeline tasks={agendaTasks} />
          </section>
        ) : (
          <section className="mt-6 rounded-2xl border border-dashed border-surface-2 bg-surface-0 px-4 py-10 text-center">
            <Clock className="mx-auto h-7 w-7 text-text-3" />
            <p className="mt-3 font-display text-base font-semibold text-text-1">
              Día tranquilo
            </p>
            <p className="mt-1 text-xs text-text-3">
              No hay tareas asignadas para hoy. Tu manager las agendará y
              aparecerán aquí automáticamente.
            </p>
          </section>
        )}

        {/* Próximos días (resumen) */}
        {tasks.filter((t) => t.scheduled_for > today).length > 0 ? (
          <section className="mt-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
              Próximos días
            </h2>
            <ul className="mt-3 space-y-2">
              {tasks
                .filter((t) => t.scheduled_for > today)
                .slice(0, 5)
                .map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/operative/tasks/${t.id}`}
                      className="flex items-center gap-3 rounded-xl border border-surface-2 bg-surface-0 px-3 py-2.5 transition hover:border-brand-400"
                    >
                      <span className="grid h-9 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-50 text-center text-[10px] font-bold uppercase text-brand-700">
                        {new Date(t.scheduled_for + 'T00:00:00Z').toLocaleDateString(
                          'es-ES',
                          { weekday: 'short', timeZone: 'UTC' },
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text-1">
                          {t.client?.name ?? t.property?.name ?? '—'}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-text-3">
                          {new Date(t.scheduled_for + 'T00:00:00Z').toLocaleDateString(
                            'es-ES',
                            { day: 'numeric', month: 'short', timeZone: 'UTC' },
                          )}
                          {t.start_time ? ` · ${t.start_time.slice(0, 5)}` : ''}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ) : null}

        <PWAInstall />
      </div>

      <BottomTabBar active="agenda" unreadChat={unreadChat} />
    </main>
  );
}
