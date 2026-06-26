import { notFound } from 'next/navigation';
import {
  Gift,
  Home,
  ListChecks,
  MessageCircle,
  Moon,
  Sparkles,
  Star,
  Sun,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientByToken } from '@/lib/client-auth';
import { getUnreadOwnerMessageCount } from '@/lib/client-messages';
import { ClientShell } from '@/components/client/ClientShell';
import {
  CorporateBanner,
  PortalHero,
  StatRow,
  ToolCard,
  ToolGrid,
} from '@/components/portal/PortalDashboardShell';

type TaskRow = {
  id: string;
  scheduled_for: string;
  status: string;
};

type RatingRow = { stars: number };

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

  const [upcomingRes, pastRes, ratingsRes, unread] = await Promise.all([
    admin
      .from('tasks')
      .select('id, scheduled_for, status')
      .eq('client_id', ctx.client.id)
      .gte('scheduled_for', today)
      .order('scheduled_for', { ascending: true })
      .limit(10),
    admin
      .from('tasks')
      .select('id, scheduled_for, status')
      .eq('client_id', ctx.client.id)
      .lt('scheduled_for', today)
      .order('scheduled_for', { ascending: false }),
    admin
      .from('task_ratings')
      .select('stars')
      .eq('client_id', ctx.client.id),
    getUnreadOwnerMessageCount(ctx.client.id),
  ]);

  const upcoming = (upcomingRes.data ?? []) as TaskRow[];
  const past = (pastRes.data ?? []) as TaskRow[];
  const ratings = (ratingsRes.data ?? []) as RatingRow[];

  const next = upcoming[0];
  const visitsTotal = past.length;
  const avgRating =
    ratings.length === 0
      ? null
      : (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length).toFixed(1);

  const firstName = ctx.client.name.split(/\s+/)[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
  const isDay = hour < 18;

  const nextLabel = next
    ? formatRelative(next.scheduled_for)
    : 'No agendada';

  return (
    <ClientShell ctx={ctx} token={token} activeTab="home" unreadMessages={unread}>
      <PortalHero
        portalLabel="Client portal"
        portalIcon={Home}
        topRightChip={{ label: isDay ? 'Day' : 'Night', icon: isDay ? Sun : Moon }}
        greeting={greeting}
        displayName={firstName}
        chips={[
          {
            kind: 'text',
            label: ctx.owner.business_name ?? 'Tu equipo',
            icon: Sparkles,
          },
        ]}
      />

      <StatRow
        items={[
          { label: 'Next visit', value: nextLabel, sub: 'agendada' },
          { label: 'Visits', value: visitsTotal, sub: 'completadas' },
          {
            label: 'Rating',
            value: avgRating ?? '—',
            sub: ratings.length > 0 ? `${ratings.length} valoraciones` : 'sin datos',
          },
        ]}
      />

      <ToolGrid>
        <ToolCard
          href={`/client/${token}/cleanings`}
          icon={ListChecks}
          title="Mis limpiezas"
          subtitle={
            upcoming.length > 0
              ? `${upcoming.length} próximas · ${visitsTotal} históricas`
              : `${visitsTotal} históricas`
          }
          accent="brand"
        />
        <ToolCard
          href={`/client/${token}/messages`}
          icon={MessageCircle}
          title="Mensajes"
          subtitle={unread > 0 ? `${unread} sin leer` : 'Chat con tu equipo'}
          accent="emerald"
        />
        <ToolCard
          href={`/client/${token}/reviews`}
          icon={Star}
          title="Valoraciones"
          subtitle={avgRating ? `Media ${avgRating} ★` : 'Tus opiniones'}
          accent="amber"
        />
        <ToolCard
          href={`/client/${token}/refer`}
          icon={Gift}
          title="Refer & Earn"
          subtitle="Invita y gana"
          accent="rose"
        />
      </ToolGrid>

      <CorporateBanner
        href={`/client/${token}/messages`}
        eyebrow="Tu cleaning hub"
        title="Mensajes · Valoraciones · Referidos"
        subtitle="Todo lo que necesitas con tu equipo"
      />
    </ClientShell>
  );
}

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
