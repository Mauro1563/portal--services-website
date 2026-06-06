import { notFound } from 'next/navigation';
import { Gift, Sparkles, Users, Award } from 'lucide-react';
import { getClientByToken } from '@/lib/client-auth';
import { getUnreadOwnerMessageCount } from '@/lib/client-messages';
import { createAdminClient } from '@/lib/supabase/admin';
import { ClientShell } from '@/components/client/ClientShell';
import { ReferShareButton } from '../ReferShareButton';

type Reward = {
  title: string;
  description: string | null;
  kind: string;
  percent: number | null;
};

function rewardLine(r: Reward): string {
  if (r.kind === 'free_cleaning') return 'Una limpieza gratis';
  if (r.kind === 'percent_discount' && r.percent) return `${r.percent}% de descuento`;
  return r.title;
}

export default async function ClientRefer({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const ctx = await getClientByToken(token);
  if (!ctx) notFound();

  const unread = await getUnreadOwnerMessageCount(ctx.client.id);
  const businessName = ctx.owner.business_name ?? 'este servicio de limpieza';
  const code = ctx.client.referral_code ?? '';

  const admin = createAdminClient();
  const { data: rewardsData } = await admin
    .from('referral_rewards')
    .select('title, description, kind, percent')
    .eq('owner_id', ctx.client.owner_id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  const rewards = (rewardsData ?? []) as Reward[];

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hq.portalservices.digital';
  const signupUrl = code ? `${base}/refer/${code}` : base;

  return (
    <ClientShell
      ctx={ctx}
      token={token}
      activeTab="refer"
      title="Recomienda a un amigo"
      unreadMessages={unread}
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-amber-50/50 to-surface-0 p-6 shadow-card">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-400/30 blur-3xl"
        />
        <div className="relative">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-card">
            <Gift className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-text-1">
            Comparte.
            <br />
            Gana premios.
          </h1>
          <p className="mt-2 text-sm text-text-2">
            Invita a un amigo a {businessName}. Cuando reserve su primera
            limpieza, los dos ganan un premio.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-6 grid grid-cols-3 gap-2">
        <Step icon={Sparkles} label="Comparte tu enlace" />
        <Step icon={Users} label="Tu amigo reserva" />
        <Step icon={Award} label="Ganan los dos" />
      </section>

      {/* Rewards on offer */}
      {rewards.length > 0 ? (
        <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-3">
            Lo que puedes ganar
          </p>
          <ul className="mt-3 space-y-2">
            {rewards.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700">
                  <Gift className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-1">{rewardLine(r)}</p>
                  {r.description ? (
                    <p className="mt-0.5 text-[11px] text-text-3">{r.description}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Personal code */}
      {code ? (
        <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-3">
            Tu código personal
          </p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-text-1">
            {code.toUpperCase()}
          </p>
          <p className="mt-2 break-all rounded-lg bg-surface-1 px-3 py-2 text-[11px] text-text-2">
            {signupUrl}
          </p>
        </section>
      ) : null}

      {/* Share controls */}
      <section className="mt-5">
        <ReferShareButton
          businessName={businessName}
          clientName={ctx.client.name}
          ownerEmail={ctx.owner.email ?? null}
          signupUrl={signupUrl}
        />
      </section>

      <p className="mt-6 text-center text-[11px] text-text-3">
        El premio se aplica después de la primera limpieza completada de tu
        amigo. Condiciones definidas por {businessName}.
      </p>
    </ClientShell>
  );
}

function Step({
  icon: Icon,
  label,
}: {
  icon: typeof Gift;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-surface-2 bg-surface-0 p-3 text-center shadow-card">
      <span className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600/10 text-brand-700">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-2 text-[11px] font-medium text-text-1">{label}</p>
    </div>
  );
}
