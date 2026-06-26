import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  User,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientByToken } from '@/lib/client-auth';
import { ClientShell } from '@/components/client/ClientShell';
import { submitRating } from '../../actions';

type Props = {
  params: Promise<{ token: string; taskId: string }>;
  searchParams: Promise<{ rated?: string; error?: string }>;
};

type TaskRow = {
  id: string;
  scheduled_for: string;
  status: string;
  notes: string | null;
  checked_in_at: string | null;
  completed_at: string | null;
  photo_url: string | null;
  service_name: string | null;
  price_pence: number | null;
  client_id: string | null;
  property: { name: string | null; address: string | null } | null;
  cleaner: { id: string; name: string } | null;
};

type RatingRow = {
  stars: number;
  comment: string | null;
  created_at: string;
};

export default async function ClientTaskPage({ params, searchParams }: Props) {
  const { token, taskId } = await params;
  const { rated, error } = await searchParams;

  const ctx = await getClientByToken(token);
  if (!ctx) notFound();

  const admin = createAdminClient();
  const { data } = await admin
    .from('tasks')
    .select(
      'id, scheduled_for, status, notes, checked_in_at, completed_at, photo_url, service_name, price_pence, client_id, property:properties (name, address), cleaner:cleaners (id, name)',
    )
    .eq('id', taskId)
    .maybeSingle();

  const task = data as unknown as TaskRow | null;
  if (!task || task.client_id !== ctx.client.id) notFound();

  const [{ data: ratingData }, { data: photosData }] = await Promise.all([
    admin
      .from('task_ratings')
      .select('stars, comment, created_at')
      .eq('task_id', taskId)
      .maybeSingle(),
    admin
      .from('task_photos')
      .select('id, url')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true }),
  ]);
  const existingRating = ratingData as RatingRow | null;
  const photos = (photosData ?? []) as { id: string; url: string }[];

  const isCompleted = task.status === 'completed';

  return (
    <ClientShell
      ctx={ctx}
      title="Limpieza"
      showBack
      backHref={`/client/${token}`}
    >
      <section className="rounded-3xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                : task.status === 'in_progress'
                ? 'bg-sky-50 text-sky-700 ring-sky-200'
                : 'bg-amber-50 text-amber-700 ring-amber-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {task.status === 'in_progress'
              ? 'En curso'
              : task.status === 'completed'
              ? 'Completada'
              : 'Programada'}
          </span>
          <span className="text-[11px] text-text-3">
            {new Date(task.scheduled_for).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </span>
        </div>

        <h1 className="mt-3 font-display text-xl font-semibold text-text-1">
          {task.service_name ?? 'Limpieza'}
        </h1>
        {task.property?.address ? (
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-2">
            <MapPin className="h-3 w-3" /> {task.property.address}
          </p>
        ) : null}

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-surface-2 pt-4">
          <Timeline
            label="Check-in"
            value={
              task.checked_in_at
                ? new Date(task.checked_in_at).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—'
            }
          />
          <Timeline
            label="Check-out"
            value={
              task.completed_at
                ? new Date(task.completed_at).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—'
            }
          />
          <Timeline
            label="Precio"
            value={task.price_pence ? `£${(task.price_pence / 100).toFixed(2)}` : '—'}
          />
        </div>
      </section>

      {rated ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          ¡Gracias por tu valoración!
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      {/* Cleaner */}
      {task.cleaner ? (
        <section className="mt-5 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-3">
            Tu limpiador/a
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/10 text-sm font-semibold text-brand-700">
              {task.cleaner.name
                .split(/\s+/)
                .map((p: string) => p.charAt(0))
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </span>
            <p className="font-display text-sm font-semibold text-text-1">
              {task.cleaner.name}
            </p>
          </div>
        </section>
      ) : null}

      {/* Photo gallery */}
      <section className="mt-5">
        <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-text-3">
          Fotos ({photos.length || (task.photo_url ? 1 : 0)})
        </h2>
        {photos.length > 0 ? (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {photos.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="overflow-hidden rounded-xl border border-surface-2 bg-surface-0 shadow-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt="Cleaning" className="block aspect-square w-full object-cover" />
              </a>
            ))}
          </div>
        ) : task.photo_url ? (
          <a
            href={task.photo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={task.photo_url} alt="Cleaning evidence" className="block w-full" />
          </a>
        ) : (
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-dashed border-surface-2 bg-surface-0 p-5 text-sm text-text-2">
            <Camera className="h-5 w-5 text-text-3" />
            <span>El limpiador/a subirá una foto cuando termine el trabajo.</span>
          </div>
        )}
      </section>

      {/* Rating */}
      {isCompleted ? (
        <section className="relative mt-5 mb-4 animate-fade-up overflow-hidden rounded-3xl border border-clean-aqua/30 bg-gradient-to-br from-clean-aqua-soft/30 via-white to-amber-50/40 p-5 shadow-sparkle-glow">
          <span
            aria-hidden
            className="pointer-events-none absolute right-3 top-3 text-[12px] text-clean-aqua-glow animate-sparkle"
          >
            ✦
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute right-8 top-6 text-[9px] text-amber-400 animate-sparkle"
            style={{ animationDelay: '0.7s' }}
          >
            ✦
          </span>
          <h2 className="relative inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
            <Star className="h-4 w-4 text-amber-500" />
            Valora esta limpieza
          </h2>
          {existingRating ? (
            <>
              <p className="mt-2 text-xs text-text-2">
                Ya valoraste esta limpieza. Puedes enviar una nueva valoración
                abajo para reemplazarla.
              </p>
              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-4 w-4 ${
                      n <= existingRating.stars
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-surface-2'
                    }`}
                  />
                ))}
              </div>
              {existingRating.comment ? (
                <p className="mt-2 rounded-xl border border-surface-2 bg-surface-1 p-3 text-xs text-text-1">
                  {existingRating.comment}
                </p>
              ) : null}
            </>
          ) : (
            <p className="mt-1 text-xs text-text-2">
              Tu opinión nos ayuda a mantener la calidad. Es opcional — pero se
              agradece 🙏
            </p>
          )}
          <RatingForm token={token} taskId={taskId} initialStars={existingRating?.stars ?? 0} />
        </section>
      ) : null}

      {task.notes ? (
        <section className="mt-5 mb-4 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-3">
            Notas del responsable
          </h2>
          <p className="mt-2 text-sm text-text-1">{task.notes}</p>
        </section>
      ) : null}
    </ClientShell>
  );
}

function Timeline({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-text-3">
        {label}
      </p>
      <p className="mt-1 font-display text-sm font-semibold tabular-nums text-text-1">
        {value}
      </p>
    </div>
  );
}

function RatingForm({
  token,
  taskId,
  initialStars,
}: {
  token: string;
  taskId: string;
  initialStars: number;
}) {
  return (
    <form action={submitRating} className="mt-4 space-y-3">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="task_id" value={taskId} />

      {/* Radio-driven 5-star picker — pure HTML, no JS */}
      <fieldset>
        <legend className="text-xs font-medium text-text-2">Tu valoración</legend>
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer p-1 transition hover:scale-110"
            >
              <input
                type="radio"
                name="stars"
                value={n}
                required
                defaultChecked={n === initialStars}
                className="peer sr-only"
              />
              <Star className="h-7 w-7 text-surface-2 peer-checked:fill-amber-400 peer-checked:text-amber-400" />
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-xs font-medium text-text-2">
          Comentario (opcional)
        </span>
        <textarea
          name="comment"
          rows={3}
          placeholder="¿Qué estuvo bien? ¿Qué se podría mejorar?"
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      </label>

      <label className="flex items-start gap-2 rounded-xl border border-surface-2 bg-surface-1 p-3 text-xs text-text-2 has-[:checked]:border-brand-600/50 has-[:checked]:bg-brand-600/[0.04]">
        <input
          type="checkbox"
          name="make_public"
          value="1"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-surface-2 text-brand-600 focus:ring-brand-600/30"
        />
        <span>
          <span className="font-medium text-text-1">
            Compartir mi valoración públicamente
          </span>
          <span className="block text-[11px] text-text-3">
            Ayuda a que otros clientes confíen en este servicio. Nunca se muestra
            tu nombre completo — solo tu nombre de pila.
          </span>
        </span>
      </label>

      <button
        type="submit"
        className="flex h-11 w-full items-center justify-center rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow"
      >
        Enviar valoración
      </button>
    </form>
  );
}
