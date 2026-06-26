import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientByToken } from '@/lib/client-auth';
import { getUnreadOwnerMessageCount } from '@/lib/client-messages';
import { ClientShell } from '@/components/client/ClientShell';
import { requestBooking } from './actions';

type ServiceType = {
  id: string;
  name: string;
  description: string | null;
  default_duration_min: number | null;
  price_pence: number | null;
  hourly_rate_pence: number | null;
};

type SearchParams = Promise<{
  service?: string;
  error?: string;
  date?: string;
}>;

const ERROR_TEXT: Record<string, string> = {
  missing: 'Te falta elegir servicio o fecha.',
  date: 'La fecha no tiene un formato válido.',
  past: 'No puedes reservar en una fecha pasada.',
  service: 'Ese servicio ya no está disponible. Elige otro.',
};

function formatPrice(pence: number | null, hourly: number | null): string {
  if (pence) return `£${(pence / 100).toFixed(2)} fijo`;
  if (hourly) return `£${(hourly / 100).toFixed(2)} / hora`;
  return 'Precio a confirmar';
}

function formatDuration(min: number | null): string | null {
  if (!min) return null;
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${min}m`;
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: SearchParams;
}) {
  const { token } = await params;
  const { service: preselectedId, error, date } = await searchParams;

  const ctx = await getClientByToken(token);
  if (!ctx) notFound();

  const admin = createAdminClient();
  const [{ data: servicesData }, unread] = await Promise.all([
    admin
      .from('service_types')
      .select('id, name, description, default_duration_min, price_pence, hourly_rate_pence')
      .eq('owner_id', ctx.client.owner_id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    getUnreadOwnerMessageCount(ctx.client.id),
  ]);

  const services = (servicesData ?? []) as ServiceType[];

  // Min date = today; max = ~90 days out so the date picker stays sane.
  const today = new Date().toISOString().slice(0, 10);
  const maxDate = new Date(Date.now() + 90 * 86_400_000)
    .toISOString()
    .slice(0, 10);
  const defaultDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : today;
  const preselected =
    services.find((s) => s.id === preselectedId) ?? services[0] ?? null;

  return (
    <ClientShell
      ctx={ctx}
      token={token}
      activeTab="reservas"
      title="Reservar limpieza"
      showBack
      backHref={`/client/${token}`}
      unreadMessages={unread}
    >
      <div className="mx-auto max-w-md">
        <header>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            <Sparkles className="h-3 w-3" /> Nueva reserva
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-slate-900">
            Pídela en un minuto
          </h1>
          <p className="mt-1 text-[13px] text-slate-600">
            Elige el servicio y el día. Tu equipo confirma y te avisa por chat.
          </p>
        </header>

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {ERROR_TEXT[error] ?? error}
          </p>
        ) : null}

        {services.length === 0 ? (
          <section className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-slate-400" />
            <p className="mt-2 font-display text-base font-semibold text-slate-900">
              Tu equipo aún no publicó su catálogo
            </p>
            <p className="mt-1 text-[12px] text-slate-600">
              Mientras tanto puedes pedir la limpieza por chat — te
              responden directo.
            </p>
            <Link
              href={`/client/${token}/messages?prefill=${encodeURIComponent(
                'Hola, me gustaría reservar una limpieza.',
              )}`}
              className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-[12px] font-bold text-white hover:bg-emerald-700"
            >
              Abrir chat <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        ) : (
          <form action={requestBooking} className="mt-6 space-y-5">
            <input type="hidden" name="token" value={token} />

            {/* Service picker — radio cards */}
            <fieldset>
              <legend className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                Servicio
              </legend>
              <ul className="mt-2 space-y-2">
                {services.map((s) => {
                  const defaultChecked = preselected?.id === s.id;
                  const dur = formatDuration(s.default_duration_min);
                  return (
                    <li key={s.id}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-emerald-300 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/40 has-[:checked]:shadow-[0_8px_24px_-12px_rgba(5,150,105,0.45)]">
                        <input
                          type="radio"
                          name="service_id"
                          value={s.id}
                          defaultChecked={defaultChecked}
                          required
                          className="mt-1 h-4 w-4 accent-emerald-600"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="font-display text-sm font-semibold text-slate-900">
                              {s.name}
                            </p>
                            <p className="shrink-0 text-[12px] font-bold text-emerald-700">
                              {formatPrice(s.price_pence, s.hourly_rate_pence)}
                            </p>
                          </div>
                          {s.description ? (
                            <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-600">
                              {s.description}
                            </p>
                          ) : null}
                          {dur ? (
                            <p className="mt-1 inline-flex items-center gap-1 text-[10.5px] text-slate-500">
                              <Clock className="h-3 w-3" /> aprox. {dur}
                            </p>
                          ) : null}
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            {/* Date + time */}
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Fecha
                </span>
                <div className="relative mt-1.5">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    name="scheduled_for"
                    required
                    defaultValue={defaultDate}
                    min={today}
                    max={maxDate}
                    className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Hora <span className="font-normal normal-case text-slate-400">(opcional)</span>
                </span>
                <div className="relative mt-1.5">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="time"
                    name="start_time"
                    className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </label>
            </div>

            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                Notas <span className="font-normal normal-case text-slate-400">(opcional)</span>
              </span>
              <textarea
                name="notes"
                rows={3}
                maxLength={500}
                placeholder="Algún detalle especial, llaves, hora preferida…"
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold uppercase tracking-wider text-white shadow-[0_14px_30px_-12px_rgba(5,150,105,0.6)] transition hover:brightness-110 active:scale-[0.99]"
            >
              Enviar solicitud
            </button>

            <p className="text-center text-[10.5px] text-slate-500">
              Tu equipo recibe la solicitud y confirma desde su panel. Te
              avisamos por chat cuando esté agendada.
            </p>
          </form>
        )}
      </div>
    </ClientShell>
  );
}
