import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientByToken } from '@/lib/client-auth';
import { getUnreadOwnerMessageCount } from '@/lib/client-messages';
import { ClientShell } from '@/components/client/ClientShell';
import { EmptyState } from '@/components/EmptyState';

type TaskRow = {
  id: string;
  scheduled_for: string;
  status: string;
  service_name: string | null;
  price_pence: number | null;
  property: { name: string | null } | null;
};

const STATUS_META: Record<string, { label: string; cls: string }> = {
  scheduled: { label: 'Agendada', cls: 'bg-amber-100 text-amber-800' },
  in_progress: { label: 'En curso', cls: 'bg-sky-100 text-sky-800' },
  completed: { label: 'Completada', cls: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Cancelada', cls: 'bg-rose-100 text-rose-700' },
};

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setUTCHours(0, 0, 0, 0);
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  if (days === -1) return 'Ayer';
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

function money(pence: number | null): string | null {
  return pence ? `£${(pence / 100).toFixed(2)}` : null;
}

export default async function ClientCleaningsList({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const ctx = await getClientByToken(token);
  if (!ctx) notFound();

  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const [upcomingRes, pastRes, unread] = await Promise.all([
    admin
      .from('tasks')
      .select(
        'id, scheduled_for, status, service_name, price_pence, property:properties (name)',
      )
      .eq('client_id', ctx.client.id)
      .gte('scheduled_for', today)
      .order('scheduled_for', { ascending: true }),
    admin
      .from('tasks')
      .select(
        'id, scheduled_for, status, service_name, price_pence, property:properties (name)',
      )
      .eq('client_id', ctx.client.id)
      .lt('scheduled_for', today)
      .order('scheduled_for', { ascending: false })
      .limit(50),
    getUnreadOwnerMessageCount(ctx.client.id),
  ]);

  const upcoming = (upcomingRes.data ?? []) as unknown as TaskRow[];
  const past = (pastRes.data ?? []) as unknown as TaskRow[];

  return (
    <ClientShell ctx={ctx} token={token} activeTab="reservas" unreadMessages={unread}>
      <div className="mx-auto max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          Mis limpiezas
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-text-1">
          Agenda e historial
        </h1>
        <p className="mt-1 text-xs text-text-2">
          Aquí ves todo lo que viene y todo lo que ya pasó.
        </p>

        {/* Upcoming */}
        <section className="mt-6">
          <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
            <Calendar className="h-3 w-3" /> Próximas ({upcoming.length})
          </h2>
          {upcoming.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-dashed border-surface-2 bg-surface-0">
              <EmptyState
                icon={Clock}
                tone="neutral"
                title="No tienes limpiezas agendadas todavía"
                description="Tu equipo te avisará por aquí en cuanto programe una."
              />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {upcoming.map((t) => (
                <TaskItem key={t.id} task={t} token={token} />
              ))}
            </ul>
          )}
        </section>

        {/* Past */}
        {past.length > 0 ? (
          <section className="mt-8 mb-4">
            <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
              <CheckCircle2 className="h-3 w-3" /> Historial ({past.length})
            </h2>
            <ul className="mt-3 space-y-2">
              {past.map((t) => (
                <TaskItem key={t.id} task={t} token={token} past />
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </ClientShell>
  );
}

function TaskItem({
  task,
  token,
  past,
}: {
  task: TaskRow;
  token: string;
  past?: boolean;
}) {
  const status = STATUS_META[task.status] ?? STATUS_META.scheduled;
  const price = money(task.price_pence);
  return (
    <li>
      <Link
        href={`/client/${token}/cleanings/${task.id}`}
        className="flex items-center gap-3 rounded-2xl border border-surface-2 bg-surface-0 px-4 py-3 shadow-card transition hover:border-brand-600/30 hover:shadow-card-lg"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold text-text-1">
            {task.property?.name ?? 'Limpieza'}
          </p>
          <p className="mt-0.5 text-[11px] text-text-3">
            {formatDate(task.scheduled_for)}
            {task.service_name ? ` · ${task.service_name}` : ''}
            {price ? ` · ${price}` : ''}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            past && task.status === 'completed' ? STATUS_META.completed.cls : status.cls
          }`}
        >
          {status.label}
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-text-3" />
      </Link>
    </li>
  );
}
