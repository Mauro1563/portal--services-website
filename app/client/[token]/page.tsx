import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarCheck, ChevronRight, Sparkles, Star } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientByToken } from '@/lib/client-auth';
import { getUnreadOwnerMessageCount } from '@/lib/client-messages';
import { ClientShell } from '@/components/client/ClientShell';
import { EcoGreeting } from '@/components/client/EcoGreeting';
import { PromoBanner } from '@/components/client/PromoBanner';
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
        .limit(8),
      getUnreadOwnerMessageCount(ctx.client.id),
    ]);

  const services = (servicesRes.data ?? []) as CatalogService[];
  const upcoming = (upcomingRes.data ?? []) as unknown as TaskRow[];
  const past = (pastRes.data ?? []) as unknown as TaskRow[];
  const ratings = (ratingsRes.data ?? []) as RatingRow[];

  const next = upcoming[0] ?? null;
  const lastDone = past.find((t) => t.status === 'completed') ?? null;

  // "Tu equipo" — dedup cleaners across all this client's tasks, with
  // their average rating from the same client.
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

      <PromoBanner token={token} />

      <ServiceCatalog token={token} services={services} />

      <FeaturedCleaners cleaners={cleaners} token={token} />

      {/* Próxima visita */}
      {next ? (
        <section className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-100">
          <div className="flex items-center justify-between gap-2">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-700">
              <CalendarCheck className="h-3 w-3" /> Próxima visita
            </p>
            <Link
              href={`/client/${token}/cleanings`}
              className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-blue-700 hover:text-blue-800"
            >
              Ver todas <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <h2 className="mt-2 font-display text-lg font-semibold text-slate-900">
            {formatRelative(next.scheduled_for)}
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-600">
            {next.cleaner?.name ?? 'Cleaner por asignar'}
            {next.property?.name ? ` · ${next.property.name}` : ''}
          </p>
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-blue-500" />
          <p className="mt-2 text-sm font-semibold text-slate-900">
            Sin limpiezas agendadas
          </p>
          <p className="mt-1 text-[12px] text-slate-500">
            Pulsa una categoría arriba o reserva desde tu calendario.
          </p>
          <Link
            href={`/client/${token}/book`}
            className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-[12px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.55)] hover:bg-blue-700"
          >
            Reservar ahora
          </Link>
        </section>
      )}

      {/* Servicio reciente */}
      {lastDone ? (
        <section className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-100">
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
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 transition hover:bg-blue-100"
            >
              <Star className="h-3 w-3" /> Valorar
            </Link>
          </div>
        </section>
      ) : null}
    </ClientShell>
  );
}
