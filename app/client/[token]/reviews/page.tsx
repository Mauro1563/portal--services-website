import { notFound } from 'next/navigation';
import { Star, Quote } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientByToken } from '@/lib/client-auth';
import { getUnreadOwnerMessageCount } from '@/lib/client-messages';
import { ClientShell } from '@/components/client/ClientShell';

type ReviewRow = {
  task_id: string;
  stars: number;
  comment: string | null;
  created_at: string;
  client: { name: string } | null;
  cleaner: { name: string } | null;
};

export default async function ClientReviews({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const ctx = await getClientByToken(token);
  if (!ctx) notFound();

  const admin = createAdminClient();
  const [reviewsRes, unread] = await Promise.all([
    admin
      .from('task_ratings')
      .select(
        'task_id, stars, comment, created_at, client:clients (name), cleaner:cleaners (name)',
      )
      .eq('owner_id', ctx.client.owner_id)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(50),
    getUnreadOwnerMessageCount(ctx.client.id),
  ]);

  const reviews = (reviewsRes.data ?? []) as unknown as ReviewRow[];
  const avg =
    reviews.length === 0
      ? null
      : reviews.reduce((s, r) => s + r.stars, 0) / reviews.length;
  const businessName = ctx.owner.business_name ?? 'este servicio';

  return (
    <ClientShell
      ctx={ctx}
      token={token}
      activeTab="reviews"
      title="Valoraciones"
      unreadMessages={unread}
    >
      {/* Headline */}
      <section className="rounded-3xl border border-surface-2 bg-gradient-to-br from-amber-50 via-surface-0 to-surface-0 p-6 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
          Lo que dicen los clientes
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-text-1">
          La confianza de quienes aman su hogar impecable.
        </h1>
        {avg != null ? (
          <div className="mt-3 flex items-end gap-2">
            <span className="font-display text-4xl font-bold tabular-nums text-text-1">
              {avg.toFixed(1)}
            </span>
            <div className="pb-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-4 w-4 ${
                      n <= Math.round(avg)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-surface-2'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-text-3">
                Según {reviews.length} valoración{reviews.length === 1 ? '' : 'es'}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-text-2">
            Sé el primero en dejar una valoración pública de {businessName}.
          </p>
        )}
      </section>

      {/* Wall of reviews */}
      <section className="mt-6 space-y-3">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-2 bg-surface-0 p-6 text-center">
            <Star className="mx-auto h-6 w-6 text-amber-400" />
            <p className="mt-2 font-display text-sm font-semibold text-text-1">
              Aún no hay valoraciones públicas
            </p>
            <p className="mt-1 text-xs text-text-2">
              Cuando otros clientes compartan su opinión, la verás aquí.
            </p>
          </div>
        ) : (
          reviews.map((r) => <ReviewCard key={r.task_id} review={r} />)
        )}
      </section>
    </ClientShell>
  );
}

function ReviewCard({ review }: { review: ReviewRow }) {
  const firstName = review.client?.name?.split(/\s+/)[0] ?? 'Un cliente';
  const initial = firstName.charAt(0).toUpperCase();
  return (
    <article className="rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
      <header className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600/10 text-sm font-semibold text-brand-700">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-text-1">
            {firstName}
          </p>
          <p className="text-[10px] text-text-3">
            {new Date(review.created_at).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            {review.cleaner?.name ? ` · Limpiador/a: ${review.cleaner.name}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`h-3.5 w-3.5 ${
                n <= review.stars
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-surface-2'
              }`}
            />
          ))}
        </div>
      </header>
      {review.comment ? (
        <div className="mt-3 flex gap-2">
          <Quote className="h-3.5 w-3.5 shrink-0 text-text-3" />
          <p className="text-sm text-text-1">{review.comment}</p>
        </div>
      ) : null}
    </article>
  );
}
