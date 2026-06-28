import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientRowByToken, getOwnerContext } from '@/lib/client-auth';
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
import { telUrl } from '@/lib/maps';
import { waUrl } from '@/lib/phone';

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
  // First hop: just the clients row. Everything else depends on
  // client.id / client.owner_id — once we have those we fire
  // owner-context (profile + auth.email) IN PARALLEL with the page's
  // own 5 queries instead of waiting for it sequentially.
  const client = await getClientRowByToken(token);
  if (!client) notFound();

  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    upcomingRes,
    pastRes,
    ratingsRes,
    servicesRes,
    unread,
    ownerCtx,
  ] = await Promise.all([
    admin
      .from('tasks')
      .select(
        'id, scheduled_for, status, cleaner_id, cleaner:cleaners (id, name), property:properties (name)',
      )
      .eq('client_id', client.id)
      .gte('scheduled_for', today)
      .order('scheduled_for', { ascending: true })
      .limit(5),
    admin
      .from('tasks')
      .select(
        'id, scheduled_for, status, cleaner_id, cleaner:cleaners (id, name), property:properties (name)',
      )
      .eq('client_id', client.id)
      .lt('scheduled_for', today)
      .order('scheduled_for', { ascending: false })
      .limit(10),
    admin
      .from('task_ratings')
      .select('stars, cleaner_id')
      .eq('client_id', client.id),
    admin
      .from('service_types')
      .select('id, name')
      .eq('owner_id', client.owner_id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(8),
    getUnreadOwnerMessageCount(client.id),
    getOwnerContext(client.owner_id),
  ]);

  const ctx = { client, owner: ownerCtx };

  const services = (servicesRes.data ?? []) as CatalogService[];
  const upcoming = (upcomingRes.data ?? []) as unknown as TaskRow[];
  const past = (pastRes.data ?? []) as unknown as TaskRow[];
  const ratings = (ratingsRes.data ?? []) as RatingRow[];

  const next = upcoming[0] ?? null;
  const lastDone = past.find((t) => t.status === 'completed') ?? null;

  // Aggregate stats so the client can glance their relationship with
  // this team — visits done, avg rating across all their reviews.
  const visitsDone = past.filter((t) => t.status === 'completed').length;
  const avgStarsAll =
    ratings.length === 0
      ? null
      : ratings.reduce((s, r) => s + r.stars, 0) / ratings.length;
  const upcomingCount = upcoming.length;

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

  // Quick-contact links for the owner — phone may sit in user_metadata,
  // email always comes from auth.users.
  const ownerEmail = ctx.owner.email ?? null;
  const ownerPhone = null; // owner_profiles doesn't store phone yet
  const ownerTel = telUrl(ownerPhone);
  const ownerWa = waUrl(
    ownerPhone,
    `Hola, soy ${firstName}, cliente de ${ctx.owner.business_name ?? 'Zapli'}.`,
  );

  return (
    <ClientShell ctx={ctx} token={token} activeTab="home" unreadMessages={unread}>
      <EcoGreeting
        firstName={firstName}
        businessName={ctx.owner.business_name ?? 'Tu equipo'}
        searchAction={`/client/${token}/messages`}
      />

      <PromoBanner token={token} />

      {/* Primary CTA — never let the client forget the main action */}
      <section className="mt-4">
        <Link
          href={`/client/${token}/book`}
          className="group flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary px-5 py-4 text-on-brand shadow-[0_14px_30px_-12px_rgba(15,23,42,0.45)] transition hover:brightness-110 active:scale-[0.99]"
        >
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">
              Pídelo ahora
            </p>
            <p className="mt-1 font-display text-base font-bold">
              Reservar limpieza
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 text-on-brand transition group-hover:translate-x-0.5">
            <ChevronRight className="h-5 w-5" />
          </span>
        </Link>
      </section>

      {/* Quick stats — keeps "your relationship" visible at a glance */}
      <section className="mt-3 grid grid-cols-3 gap-2">
        <StatChip
          label="Próximas"
          value={String(upcomingCount)}
          Icon={CalendarCheck}
        />
        <StatChip
          label="Hechas"
          value={String(visitsDone)}
          Icon={CheckCircle2}
        />
        <StatChip
          label="Rating"
          value={avgStarsAll == null ? '—' : avgStarsAll.toFixed(1)}
          Icon={Star}
        />
      </section>

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

      {/* Quick contact with the owner — chat is always live, the other
          two only show when we have phone numbers on file. */}
      <section className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-100">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          Contacta a {ctx.owner.business_name ?? 'tu equipo'}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Link
            href={`/client/${token}/messages`}
            className="flex flex-col items-center gap-1 rounded-xl bg-blue-50 px-2 py-2.5 text-blue-700 transition hover:bg-blue-100"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-[10.5px] font-semibold">Chat</span>
          </Link>
          {ownerWa ? (
            <a
              href={ownerWa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 rounded-xl bg-emerald-50 px-2 py-2.5 text-emerald-700 transition hover:bg-emerald-100"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-[10.5px] font-semibold">WhatsApp</span>
            </a>
          ) : ownerEmail ? (
            <a
              href={`mailto:${ownerEmail}`}
              className="flex flex-col items-center gap-1 rounded-xl bg-slate-100 px-2 py-2.5 text-slate-700 transition hover:bg-slate-200"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-[10.5px] font-semibold">Email</span>
            </a>
          ) : (
            <span className="flex flex-col items-center gap-1 rounded-xl bg-slate-100 px-2 py-2.5 text-slate-400">
              <MessageCircle className="h-4 w-4" />
              <span className="text-[10.5px] font-semibold">—</span>
            </span>
          )}
          {ownerTel ? (
            <a
              href={ownerTel}
              className="flex flex-col items-center gap-1 rounded-xl bg-amber-50 px-2 py-2.5 text-amber-700 transition hover:bg-amber-100"
            >
              <Phone className="h-4 w-4" />
              <span className="text-[10.5px] font-semibold">Llamar</span>
            </a>
          ) : (
            <Link
              href={`/client/${token}/profile`}
              className="flex flex-col items-center gap-1 rounded-xl bg-slate-100 px-2 py-2.5 text-slate-600 transition hover:bg-slate-200"
            >
              <Phone className="h-4 w-4" />
              <span className="text-[10.5px] font-semibold">Mi perfil</span>
            </Link>
          )}
        </div>
      </section>
    </ClientShell>
  );
}

function StatChip({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 ring-1 ring-inset ring-slate-100">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="font-display text-sm font-bold tabular-nums text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}
