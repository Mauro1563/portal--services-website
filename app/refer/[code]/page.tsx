import { notFound } from 'next/navigation';
import {
  Check,
  CheckCircle2,
  Gift,
  MapPin,
  MessageCircle,
  Sparkles,
  Star,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { createAdminClient } from '@/lib/supabase/admin';
import { submitReferralLead } from './actions';

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const admin = createAdminClient();
  const { data } = await admin
    .from('clients')
    .select('owner_id')
    .eq('referral_code', code)
    .maybeSingle();
  if (!data) return { title: 'Invitación · Portal Services Digital' };
  const { data: profile } = await admin
    .from('owner_profiles')
    .select('business_name')
    .eq('owner_id', (data as { owner_id: string }).owner_id)
    .maybeSingle();
  return {
    title: `Te invitaron a ${profile?.business_name ?? 'un servicio de limpieza'}`,
  };
}

export default async function ReferralLanding({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { code } = await params;
  const { sent, error } = await searchParams;
  const admin = createAdminClient();

  const { data: referrerData } = await admin
    .from('clients')
    .select('id, name, owner_id')
    .eq('referral_code', code)
    .maybeSingle();
  if (!referrerData) notFound();
  const referrer = referrerData as { id: string; name: string; owner_id: string };

  const [{ data: profileData }, { data: rewardsData }] = await Promise.all([
    admin
      .from('owner_profiles')
      .select('business_name, business_logo_url, tagline, service_area, phone')
      .eq('owner_id', referrer.owner_id)
      .maybeSingle(),
    admin
      .from('referral_rewards')
      .select('title, description, kind, percent')
      .eq('owner_id', referrer.owner_id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ]);

  const profile = (profileData ?? {}) as {
    business_name?: string | null;
    business_logo_url?: string | null;
    tagline?: string | null;
    service_area?: string | null;
    phone?: string | null;
  };
  const rewards = (rewardsData ?? []) as Reward[];
  const businessName = profile.business_name ?? 'nuestro servicio de limpieza';
  const referrerFirst = referrer.name.split(/\s+/)[0];

  const phoneClean = profile.phone?.replace(/[^0-9]/g, '') ?? '';
  const waUrl = phoneClean
    ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(
        `Hola ${businessName}, ${referrerFirst} me recomendó. Me gustaría reservar una limpieza.`,
      )}`
    : null;

  return (
    <main className="min-h-screen bg-surface-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 bg-mesh-1 opacity-90" />
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative mx-auto max-w-md px-6 py-12">
          <div className="flex items-center gap-3">
            {profile.business_logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.business_logo_url}
                alt={businessName}
                className="h-14 w-14 shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] object-contain p-1.5"
              />
            ) : (
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-300">
                <Logo size="sm" />
              </span>
            )}
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-inset ring-amber-400/20">
                <Gift className="h-3 w-3" /> Invitación personal
              </p>
              <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                {referrerFirst} te invita a {businessName}
              </h1>
            </div>
          </div>

          {profile.tagline ? (
            <p className="mt-4 text-sm text-slate-300">{profile.tagline}</p>
          ) : null}
          {profile.service_area ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-cyan-300" />
              {profile.service_area}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-md px-6">
        {/* Rewards on offer */}
        {rewards.length > 0 ? (
          <section className="-mt-6 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-surface-0 p-5 shadow-card-lg">
            <h2 className="inline-flex items-center gap-2 font-display text-sm font-semibold text-text-1">
              <Sparkles className="h-4 w-4 text-amber-600" /> Reserva tu primera limpieza y ganan los dos
            </h2>
            <ul className="mt-3 space-y-2">
              {rewards.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 rounded-2xl border border-surface-2 bg-surface-0 p-3"
                >
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

        {/* Lead form / thank-you */}
        {sent ? (
          <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-card">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
            <h2 className="mt-3 font-display text-lg font-semibold text-text-1">
              ¡Gracias!
            </h2>
            <p className="mt-1 text-sm text-text-2">
              {businessName} ya tiene tus datos y te contactará en breve.
            </p>
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-card hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" /> Escríbeles ahora
              </a>
            ) : null}
          </section>
        ) : (
          <section className="mt-6 rounded-3xl border border-surface-2 bg-surface-0 p-6 shadow-card">
            <h2 className="font-display text-base font-semibold text-text-1">
              Déjanos tus datos
            </h2>
            <p className="mt-1 text-xs text-text-2">
              {businessName} te contactará para coordinar tu primera limpieza.
            </p>
            {error ? (
              <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error === 'notfound'
                  ? 'Este enlace de invitación ya no es válido.'
                  : 'Pon tu nombre y un teléfono o correo de contacto.'}
              </p>
            ) : null}
            <form action={submitReferralLead} className="mt-4 space-y-3">
              <input type="hidden" name="code" value={code} />
              <label className="block">
                <span className="text-xs font-medium text-text-2">Tu nombre</span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="María García"
                  className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-text-2">Teléfono o correo</span>
                <input
                  type="text"
                  name="contact"
                  required
                  placeholder="600… o tu@correo.com"
                  className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </label>
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow active:scale-[0.99]"
              >
                Solicitar mi primera limpieza
              </button>
            </form>
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
              >
                <MessageCircle className="h-4 w-4" /> O escribe por WhatsApp
              </a>
            ) : null}
          </section>
        )}

        {/* Trust bar */}
        <section className="mt-6 mb-10">
          <ul className="grid grid-cols-1 gap-2">
            {[
              'Registro de entrada con GPS',
              'Foto de cada limpieza terminada',
              'Valora cada visita',
            ].map((p) => (
              <li
                key={p}
                className="inline-flex items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 py-2.5 text-sm text-text-1 shadow-card"
              >
                <Check className="h-4 w-4 text-emerald-600" /> {p}
              </li>
            ))}
          </ul>
          <p className="mt-5 inline-flex w-full items-center justify-center gap-1 text-center text-[10px] text-text-3">
            <Star className="h-3 w-3 text-amber-500" /> Con tecnología de Portal Services Digital
          </p>
        </section>
      </div>
    </main>
  );
}
