import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CalendarCheck,
  ChevronRight,
  Gift,
  Sparkles,
  Star,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientByToken } from '@/lib/client-auth';
import { getUnreadOwnerMessageCount } from '@/lib/client-messages';
import { ClientShell } from '@/components/client/ClientShell';
import { EcoGreeting } from '@/components/client/EcoGreeting';
import { ServiceCatalog } from '@/components/client/ServiceCatalog';
import {
  FeaturedCleaners,
  type CleanerCard,
} from '@/components/client/FeaturedCleaners';
import type { CatalogService } from '@/components/client/ServiceCatalog';

type TaskRow = {
  id: string;
  scheduled_for: string;
  status: string;
  cleaner_id: string | null;
  cleaner: { id: string; name: string } | null;
  property: { name: string | null } | null;
};

type RatingRow = { stars: number; cleaner_id: string | null };

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  if (days < 7)
    return target.toLocaleDateString('es-ES', { weekday: 'long' });
  return target.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
}

export default async function ClientHome({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const ctx = await getClientByToken(token);
  if (!ctx) notFound();

  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const [upcomingRes, pastRes, ratingsRes, servicesRes, unread] =
    await Promise.all([
      admin
        .from('tasks')
        .select(
          'id, scheduled_for, status, cleaner_id, cleaner:cleaners (id, name), property:properties (name)',
        )
        .eq('client_id', ctx.client.id)
        .gte('scheduled_for', today)
        .order('scheduled_for', { ascending: true })
        .limit(5),
      admin
        .from('tasks')
        .select(
          'id, scheduled_for, status, cleaner_id, cleaner:cleaners (id, name), property:properties (name)',
        )
        .eq('client_id', ctx.client.id)
        .lt('scheduled_for', today)
        .order('scheduled_for', { ascending: false })
        .limit(10),
      admin
        .from('task_ratings')
        .select('stars, cleaner_id')
        .eq('client_id', ctx.client.id),
      admin
        .from('service_types')
        .select('id, name')
        .eq('owner_id', ctx.client.owner_id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(4),
      getUnreadOwnerMessageCount(ctx.client.id),
    ]);

  const services = (servicesRes.data ?? []) as CatalogService[];

  const upcoming = (upcomingRes.data ?? []) as unknown as TaskRow[];
  const past = (pastRes.data ?? []) as unknown as TaskRow[];
  const ratings = (ratingsRes.data ?? []) as RatingRow[];

  const next = upcoming[0] ?? null;
  const lastDone = past.find((t) => t.status === 'completed') ?? null;

  // "Tu equipo" — every cleaner who's worked for this client, dedup'd,
  // with their average rating (overall, not client-scoped, since we
  // only store the client's own ratings against them anyway).
  const cleanerMap = new Map<string, { id: string; name: string }>();
  for (const t of [...upcoming, ...past]) {
    if (t.cleaner?.id && t.cleaner.name && !cleanerMap.has(t.cleaner.id)) {
      cleanerMap.set(t.cleaner.id, { id: t.cleaner.id, name: t.cleaner.name });
    }
  }
  const cleaners: CleanerCard[] = Array.from(cleanerMap.values()).map((c) => {
    const own = ratings.filter((r) => r.cleaner_id === c.id);
    return {
      id: c.id,
      name: c.name,
      avgStars:
        own.length === 0
          ? null
          : own.reduce((s, r) => s + r.stars, 0) / own.length,
      ratingCount: own.length,
    };
  });

  const firstName = ctx.client.name.split(/\s+/)[0] ?? ctx.client.name;

  return (
    <ClientShell ctx={ctx} token={token} activeTab="home" unreadMessages={unread}>
      <EcoGreeting
        firstName={firstName}
        businessName={ctx.owner.business_name ?? 'Tu equipo'}
        searchAction={`/client/${token}/messages`}
      />

      {/* Reservar Ahora — primary CTA */}
      <section className="mt-5">
        <Link
          href={`/client/${token}/book`}
          className="group flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-4 text-white shadow-[0_14px_30px_-12px_rgba(5,150,105,0.6)] transition hover:brightness-110 active:scale-[0.99]"
        >
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100">
              Pídelo ahora
            </p>
            <p className="mt-1 font-display text-base font-bold">
              Reservar limpieza
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 text-white transition group-hover:translate-x-0.5">
            <ChevronRight className="h-5 w-5" />
          </span>
        </Link>
      </section>

      <ServiceCatalog token={token} services={services} />

      <FeaturedCleaners cleaners={cleaners} />

      {/* Próxima visita */}
      {next ? (
        <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">
            <CalendarCheck className="h-3 w-3" /> Próxima visita
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold text-slate-900">
            {formatRelative(next.scheduled_for)}
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-600">
            {next.cleaner?.name ?? 'Cleaner por asignar'}
            {next.property?.name ? ` · ${next.property.name}` : ''}
          </p>
          <Link
            href={`/client/${token}/cleanings`}
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Ver todas las reservas <ChevronRight className="h-3 w-3" />
          </Link>
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/30 p-5 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-emerald-500" />
          <p className="mt-2 text-sm font-semibold text-slate-900">
            Sin limpiezas agendadas
          </p>
          <p className="mt-1 text-[12px] text-slate-600">
            Reserva una arriba o avisa a tu equipo por chat.
          </p>
        </section>
      )}

      {/* Servicio reciente */}
      {lastDone ? (
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Servicio reciente
          </p>
          <div className="mt-2 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-display text-[14px] font-semibold text-slate-900">
                {lastDone.cleaner?.name ?? 'Cleaner'}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {new Date(lastDone.scheduled_for + 'T00:00:00').toLocaleDateString(
                  'es-ES',
                  { day: 'numeric', month: 'short', year: 'numeric' },
                )}
                {lastDone.property?.name ? ` · ${lastDone.property.name}` : ''}
              </p>
            </div>
            <Link
              href={`/client/${token}/cleanings/${lastDone.id}`}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              <Star className="h-3 w-3" /> Valorar
            </Link>
          </div>
        </section>
      ) : null}

      {/* Refer link */}
      <section className="mt-4">
        <Link
          href={`/client/${token}/refer`}
          className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 transition hover:border-amber-300"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500 text-white">
            <Gift className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-slate-900">
              Recomienda y gana
            </p>
            <p className="mt-0.5 truncate text-[11px] text-slate-600">
              Comparte tu link e invita a un amigo
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-amber-700" />
        </Link>
      </section>
    </ClientShell>
  );
}
