import { redirect } from 'next/navigation';
import { Trash2, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { RewardForm } from './RewardForm';
import { toggleReward, deleteReward, setReferralStatus } from './actions';

type Props = {
  searchParams: Promise<{ error?: string; created?: string }>;
};

type Reward = {
  id: string;
  title: string;
  description: string | null;
  kind: string;
  percent: number | null;
  is_active: boolean;
};

type Referral = {
  id: string;
  code: string;
  recipient_name: string | null;
  recipient_contact: string | null;
  status: string;
  reward_id: string | null;
  created_at: string;
  referrer: { name: string | null } | null;
};

function rewardLine(r: Reward): string {
  if (r.kind === 'free_cleaning') return 'Limpieza gratis';
  if (r.kind === 'percent_discount' && r.percent) return `${r.percent}% de descuento`;
  return 'Premio personalizado';
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  booked: { label: 'Reservó', cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
  rewarded: { label: 'Premiado', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
};

export default async function ReferralsPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { error, created } = await searchParams;

  const [{ data: rewardsData }, { data: referralsData }] = await Promise.all([
    supabase
      .from('referral_rewards')
      .select('id, title, description, kind, percent, is_active')
      .eq('owner_id', user.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('referrals')
      .select(
        'id, code, recipient_name, recipient_contact, status, reward_id, created_at, referrer:clients (name)',
      )
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false }),
  ]);

  const rewards = (rewardsData ?? []) as Reward[];
  const referrals = (referralsData ?? []) as unknown as Referral[];
  const activeRewards = rewards.filter((r) => r.is_active);

  return (
    <LightLayout activeTab="more" title="Referidos" showBack backHref="/owner/more">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text-1">
              Referidos y premios
            </h1>
            <p className="mt-1 text-xs text-text-2">
              Define los premios que ganan tus clientes al recomendarte. Los
              activos aparecen en el portal del cliente; aquí ves quién te
              recomendó y marcas a quién ya premiaste.
            </p>
          </div>
        </div>

        {created ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            Premio añadido.
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        ) : null}

        <RewardForm />

        {/* Reward options list */}
        <section className="mt-6">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-text-3">
            Tus premios ({rewards.length})
          </h2>
          {rewards.length === 0 ? (
            <p className="mt-2 text-sm text-text-2">
              Aún no tienes premios. Crea el primero arriba — por ejemplo
              &ldquo;Una limpieza gratis&rdquo; o &ldquo;20% de descuento&rdquo;.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {rewards.map((r) => (
                <li
                  key={r.id}
                  className="rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-semibold text-text-1">
                        {r.title}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-2 text-[11px]">
                        <span className="rounded-full bg-brand-600/10 px-2 py-0.5 font-semibold text-brand-700">
                          {rewardLine(r)}
                        </span>
                        {!r.is_active ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold uppercase tracking-wider text-amber-700">
                            Inactivo
                          </span>
                        ) : null}
                      </p>
                      {r.description ? (
                        <p className="mt-1.5 text-[11px] text-text-3">{r.description}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <form action={toggleReward}>
                        <input type="hidden" name="reward_id" value={r.id} />
                        <input type="hidden" name="active" value={r.is_active ? '1' : '0'} />
                        <SubmitButton
                          pendingLabel="…"
                          className="inline-flex items-center gap-1 rounded-lg border border-surface-2 bg-surface-0 px-2.5 py-1 text-[11px] text-text-2 hover:bg-surface-1 disabled:opacity-60"
                        >
                          {r.is_active ? 'Desactivar' : 'Activar'}
                        </SubmitButton>
                      </form>
                      <form action={deleteReward}>
                        <input type="hidden" name="reward_id" value={r.id} />
                        <SubmitButton
                          ariaLabel="Eliminar"
                          pendingLabel=""
                          className="inline-flex items-center rounded-lg border border-rose-200 bg-white px-2 py-1 text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </SubmitButton>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Incoming referrals */}
        <section className="mt-8 mb-4">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-text-3">
            Recomendaciones recibidas ({referrals.length})
          </h2>
          {referrals.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-dashed border-surface-2 bg-surface-0 p-6 text-center">
              <Users className="mx-auto h-6 w-6 text-text-3" />
              <p className="mt-2 text-sm text-text-2">
                Todavía nadie te ha recomendado. Cuando un amigo de tu cliente
                deje sus datos desde el enlace de invitación, aparecerá aquí.
              </p>
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {referrals.map((ref) => {
                const meta = STATUS_META[ref.status] ?? STATUS_META.pending;
                return (
                  <li
                    key={ref.id}
                    className="rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-sm font-semibold text-text-1">
                          {ref.recipient_name || 'Nuevo interesado'}
                        </p>
                        <p className="mt-0.5 text-[11px] text-text-3">
                          {ref.recipient_contact ? `${ref.recipient_contact} · ` : ''}
                          Recomendado por {ref.referrer?.name ?? 'un cliente'}
                        </p>
                        <p className="mt-0.5 text-[11px] text-text-3">
                          {new Date(ref.created_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${meta.cls}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <form
                      action={setReferralStatus}
                      className="mt-3 flex flex-wrap items-center gap-2 border-t border-surface-2 pt-3"
                    >
                      <input type="hidden" name="referral_id" value={ref.id} />
                      <select
                        name="status"
                        defaultValue={ref.status}
                        className="h-9 rounded-lg border border-surface-2 bg-surface-0 px-2.5 text-[12px] text-text-1 focus:border-brand-600 focus:outline-none"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="booked">Reservó</option>
                        <option value="rewarded">Premiado</option>
                      </select>
                      <select
                        name="reward_id"
                        defaultValue={ref.reward_id ?? ''}
                        className="h-9 min-w-0 flex-1 rounded-lg border border-surface-2 bg-surface-0 px-2.5 text-[12px] text-text-1 focus:border-brand-600 focus:outline-none"
                      >
                        <option value="">Premio otorgado (opcional)…</option>
                        {activeRewards.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title}
                          </option>
                        ))}
                      </select>
                      <SubmitButton
                        pendingLabel="Guardando…"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600/10 px-3 text-[12px] font-medium text-brand-700 ring-1 ring-inset ring-brand-600/30 hover:bg-brand-600/15 disabled:opacity-60"
                      >
                        Guardar
                      </SubmitButton>
                    </form>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </LightLayout>
  );
}
