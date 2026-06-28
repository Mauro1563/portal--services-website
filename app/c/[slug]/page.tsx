import { notFound } from 'next/navigation';
import {
  Check,
  Globe,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from 'lucide-react';
import { ZapliLogo } from '@/components/brand/ZapliLogo';
import { createAdminClient } from '@/lib/supabase/admin';

export const revalidate = 60; // ISR — refresh public pages every minute

type Profile = {
  owner_id: string;
  business_name: string | null;
  business_logo_url: string | null;
  tagline: string | null;
  about: string | null;
  service_area: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  slug: string | null;
};

type ServiceRow = {
  id: string;
  name: string;
  description: string | null;
  default_duration_min: number | null;
  price_pence: number | null;
  hourly_rate_pence: number | null;
};

type ReviewRow = {
  task_id: string;
  stars: number;
  comment: string | null;
  created_at: string;
  client: { name: string | null } | null;
};

type PhotoRow = {
  id: string;
  url: string;
};

function formatPrice(pence: number | null, hourly: number | null): string {
  if (pence) return `£${(pence / 100).toFixed(2)}`;
  if (hourly) return `£${(hourly / 100).toFixed(2)}/h`;
  return '—';
}

function formatDuration(min: number | null): string {
  if (!min) return '';
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const r = min % 60;
    return r ? `${h}h ${r}m` : `${h}h`;
  }
  return `${min} min`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data } = await admin
    .from('owner_profiles')
    .select('business_name, tagline')
    .eq('slug', slug)
    .eq('is_public_profile', true)
    .maybeSingle();

  if (!data) return { title: 'Cleaning service · Zapli' };
  return {
    title: `${data.business_name ?? 'Cleaning service'} · Zapli`,
    description: data.tagline ?? undefined,
  };
}

export default async function PublicBusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: profileData } = await admin
    .from('owner_profiles')
    .select(
      'owner_id, business_name, business_logo_url, tagline, about, service_area, phone, website, instagram, slug',
    )
    .eq('slug', slug)
    .eq('is_public_profile', true)
    .maybeSingle();

  const profile = profileData as Profile | null;
  if (!profile) notFound();

  const [servicesRes, reviewsRes, photosRes] = await Promise.all([
    admin
      .from('service_types')
      .select(
        'id, name, description, default_duration_min, price_pence, hourly_rate_pence',
      )
      .eq('owner_id', profile.owner_id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    admin
      .from('task_ratings')
      .select(
        'task_id, stars, comment, created_at, client:clients (name)',
      )
      .eq('owner_id', profile.owner_id)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(12),
    admin
      .from('task_photos')
      .select('id, url')
      .eq('owner_id', profile.owner_id)
      .eq('is_public_portfolio', true)
      .order('created_at', { ascending: false })
      .limit(12),
  ]);

  const services = (servicesRes.data ?? []) as ServiceRow[];
  const reviews = (reviewsRes.data ?? []) as unknown as ReviewRow[];
  const photos = (photosRes.data ?? []) as PhotoRow[];

  const businessName = profile.business_name ?? 'Cleaning service';

  const avg =
    reviews.length === 0
      ? null
      : reviews.reduce((s, r) => s + r.stars, 0) / reviews.length;

  const phoneClean = profile.phone?.replace(/[^0-9]/g, '') ?? '';
  const waUrl = phoneClean
    ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(`Hi ${businessName}, I'd like to book a cleaning.`)}`
    : null;

  return (
    <main className="min-h-screen bg-surface-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 bg-mesh-1 opacity-90" />
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative mx-auto max-w-3xl px-6 py-12">
          <div className="flex flex-wrap items-start gap-5">
            {profile.business_logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.business_logo_url}
                alt={businessName}
                className="h-20 w-20 shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] object-contain p-2"
              />
            ) : (
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-300">
                <ZapliLogo size="sm" mono />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {businessName}
              </h1>
              {profile.tagline ? (
                <p className="mt-2 text-sm text-slate-300 sm:text-base">
                  {profile.tagline}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-slate-300">
                {profile.service_area ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-cyan-300" />
                    {profile.service_area}
                  </span>
                ) : null}
                {avg != null ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {avg.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? '' : 's'}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-wrap gap-2">
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-500 px-5 text-sm font-semibold text-white shadow-lg hover:bg-emerald-600"
              >
                <MessageCircle className="h-4 w-4" /> Book on WhatsApp
              </a>
            ) : null}
            {profile.phone ? (
              <a
                href={`tel:${profile.phone}`}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-5 text-sm font-medium text-white hover:bg-white/[0.08]"
              >
                <Phone className="h-4 w-4" /> {profile.phone}
              </a>
            ) : null}
            {profile.instagram ? (
              <a
                href={`https://instagram.com/${profile.instagram.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-5 text-sm font-medium text-white hover:bg-white/[0.08]"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            ) : null}
            {profile.website ? (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-5 text-sm font-medium text-white hover:bg-white/[0.08]"
              >
                <Globe className="h-4 w-4" /> Website
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* About */}
      {profile.about ? (
        <section className="mx-auto max-w-3xl px-6 py-10">
          <h2 className="font-display text-xl font-semibold text-text-1">About us</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-2">
            {profile.about}
          </p>
        </section>
      ) : null}

      {/* Services */}
      {services.length > 0 ? (
        <section className="mx-auto max-w-3xl px-6 pb-10">
          <h2 className="font-display text-xl font-semibold text-text-1">
            Services &amp; pricing
          </h2>
          <ul className="mt-4 space-y-3">
            {services.map((s) => (
              <li
                key={s.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-semibold text-text-1">
                    {s.name}
                  </p>
                  {s.description ? (
                    <p className="mt-1 text-xs text-text-2">{s.description}</p>
                  ) : null}
                  {s.default_duration_min ? (
                    <p className="mt-1.5 text-[11px] text-text-3">
                      Approx. {formatDuration(s.default_duration_min)}
                    </p>
                  ) : null}
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-lg font-bold text-brand-700">
                    {formatPrice(s.price_pence, s.hourly_rate_pence)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Photo portfolio */}
      {photos.length > 0 ? (
        <section className="mx-auto max-w-3xl px-6 pb-10">
          <h2 className="font-display text-xl font-semibold text-text-1">
            Recent work
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {photos.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="overflow-hidden rounded-xl border border-surface-2 bg-surface-0 shadow-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt="Cleaning work"
                  className="block aspect-square w-full object-cover transition hover:scale-105"
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* Reviews */}
      {reviews.length > 0 ? (
        <section className="mx-auto max-w-3xl px-6 pb-10">
          <h2 className="font-display text-xl font-semibold text-text-1">
            What our customers say
          </h2>
          {avg != null ? (
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-text-2">
              <span className="inline-flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={
                      n <= Math.round(avg)
                        ? 'h-4 w-4 fill-amber-400 text-amber-400'
                        : 'h-4 w-4 text-surface-2'
                    }
                  />
                ))}
              </span>
              <span className="font-semibold text-text-1">
                {avg.toFixed(1)} / 5
              </span>
              <span className="text-text-3">· {reviews.length} reviews</span>
            </p>
          ) : null}
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {reviews.map((r) => (
              <li
                key={r.task_id}
                className="rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card"
              >
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={
                        n <= r.stars
                          ? 'h-3.5 w-3.5 fill-amber-400 text-amber-400'
                          : 'h-3.5 w-3.5 text-surface-2'
                      }
                    />
                  ))}
                </div>
                {r.comment ? (
                  <p className="mt-2 text-sm text-text-1">&ldquo;{r.comment}&rdquo;</p>
                ) : null}
                <p className="mt-2 text-[11px] text-text-3">
                  — {r.client?.name ?? 'Customer'},{' '}
                  {new Date(r.created_at).toLocaleDateString('en-GB', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Why choose us / proof bar */}
      <section className="mx-auto max-w-3xl px-6 pb-10">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            'Insured cleaners',
            'GPS-verified check-in',
            'Photo evidence on every cleaning',
            'Rate every visit',
          ].map((p) => (
            <li
              key={p}
              className="inline-flex items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 py-3 text-sm text-text-1 shadow-card"
            >
              <Check className="h-4 w-4 text-emerald-600" /> {p}
            </li>
          ))}
        </ul>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <div className="rounded-3xl border border-brand-600/30 bg-gradient-to-br from-brand-600/[0.06] to-brand-400/[0.04] p-6 text-center shadow-card">
          <h2 className="font-display text-xl font-semibold text-text-1">
            Ready to book?
          </h2>
          <p className="mt-2 text-sm text-text-2">
            Get in touch and we&apos;ll arrange your first cleaning.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-card hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" /> Book on WhatsApp
              </a>
            ) : null}
            {profile.phone ? (
              <a
                href={`tel:${profile.phone}`}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-brand-600/30 bg-surface-0 px-5 text-sm font-medium text-brand-700 hover:bg-brand-600/[0.04]"
              >
                <Phone className="h-4 w-4" /> Call {profile.phone}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-3xl px-6 pb-6 text-center text-[10px] text-text-3">
        Powered by Zapli
      </footer>
    </main>
  );
}
