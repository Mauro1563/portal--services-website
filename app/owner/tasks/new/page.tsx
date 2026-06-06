import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  MapPin,
  Sparkles,
  Tag,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { getT } from '@/lib/i18n';
import { addTask } from '@/app/owner/actions';

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewTaskPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const t = await getT();

  const [propertiesRes, cleanersRes, clientsRes, servicesRes] = await Promise.all([
    supabase.from('properties').select('id, name').order('name'),
    supabase.from('cleaners').select('id, name').order('name'),
    supabase.from('clients').select('id, name').order('name'),
    supabase
      .from('service_types')
      .select('id, name, price_pence, hourly_rate_pence, default_duration_min')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ]);

  const properties = propertiesRes.data ?? [];
  const cleaners = cleanersRes.data ?? [];
  const clients = clientsRes.data ?? [];
  const services = servicesRes.data ?? [];
  const { error } = await searchParams;

  const noResources = properties.length === 0;
  const today = new Date().toISOString().split('T')[0];

  const inputCls =
    'mt-1.5 block h-11 w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 text-sm text-text-1 placeholder:text-text-3 transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/25';
  const textareaCls =
    'mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-3 text-sm text-text-1 placeholder:text-text-3 transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/25';
  const labelTitle = 'text-xs font-medium text-text-2';

  return (
    <LightLayout
      activeTab="tasks"
      title={t('tasks.newTitle')}
      showBack
      backHref="/owner/tasks"
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-6 text-white shadow-[0_24px_60px_-20px_rgba(37,99,235,0.45)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-cyan-300/30 blur-3xl"
        />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-1 ring-inset ring-white/30">
            <Sparkles className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
              {t('tasks.newTitle')}
            </p>
            <h1 className="mt-1 font-display text-xl font-semibold tracking-tight sm:text-2xl">
              Programa una limpieza en segundos.
            </h1>
            <p className="mt-1.5 text-sm text-white/85">
              Elige la propiedad, asigna a alguien y deja anotado el cobro —
              todo en una pantalla.
            </p>
          </div>
        </div>
      </section>

      {noResources ? (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <MapPin className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="font-display font-semibold">
              Aún no tienes propiedades.
            </p>
            <p className="mt-0.5 text-xs">
              Necesitas al menos una propiedad para crear limpiezas.{' '}
              <Link
                href="/owner/properties/new"
                className="font-semibold underline underline-offset-2 hover:text-amber-900"
              >
                Añadir propiedad →
              </Link>
            </p>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      <form action={addTask} className="mt-6 space-y-5 pb-28">
        {/* ───────── Quién y dónde ───────── */}
        <SectionCard
          accent="cyan"
          icon={MapPin}
          title="Quién y dónde"
          desc="Propiedad, limpiadora y cliente (si aplica)."
        >
          <label className="block">
            <span className={labelTitle}>
              Propiedad
              <span className="ml-0.5 text-rose-500">*</span>
            </span>
            <select
              name="property_id"
              required
              disabled={noResources}
              className={`${inputCls} disabled:opacity-50`}
            >
              <option value="">{t('tasks.pickProperty')}…</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelTitle}>Limpiadora (opcional)</span>
              <select name="cleaner_id" className={inputCls}>
                <option value="">Sin asignar</option>
                {cleaners.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelTitle}>Cliente (opcional)</span>
              <select name="client_id" className={inputCls}>
                <option value="">Sin cliente / huésped Airbnb</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </SectionCard>

        {/* ───────── Fecha y hora ───────── */}
        <SectionCard
          accent="violet"
          icon={CalendarClock}
          title="Fecha y hora"
          desc="Cuándo se hace y cuánto se estima que dure."
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelTitle}>
                Fecha
                <span className="ml-0.5 text-rose-500">*</span>
              </span>
              <input
                type="date"
                name="scheduled_for"
                required
                defaultValue={today}
                min={today}
                className={inputCls}
              />
            </label>

            <label className="block">
              <span className={labelTitle}>Hora de inicio</span>
              <input
                type="time"
                name="start_time"
                className={inputCls}
              />
            </label>
          </div>

          <label className="block">
            <span className={labelTitle}>Duración estimada (minutos)</span>
            <input
              type="number"
              name="estimated_duration_min"
              min="15"
              step="15"
              placeholder="90"
              className={inputCls}
            />
            <span className="mt-1 block text-[11px] text-text-3">
              Si dejas el servicio rellenado abajo, se autocompleta desde ahí.
            </span>
          </label>
        </SectionCard>

        {/* ───────── Servicio y precio ───────── */}
        <SectionCard
          accent="emerald"
          icon={Tag}
          title="Servicio y precio"
          desc="Tipo de servicio y precio. El manual gana sobre el del servicio."
        >
          <label className="block">
            <span className={labelTitle}>Tipo de servicio (opcional)</span>
            <select name="service_type_id" className={inputCls}>
              <option value="">Sin tipo de servicio</option>
              {services.map((s) => {
                const price = s.price_pence
                  ? `£${(s.price_pence / 100).toFixed(2)}`
                  : s.hourly_rate_pence
                  ? `£${(s.hourly_rate_pence / 100).toFixed(2)}/h`
                  : '';
                return (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {price ? ` — ${price}` : ''}
                  </option>
                );
              })}
            </select>
            <span className="mt-1 block text-[11px] text-text-3">
              El nombre y el precio se guardan en este momento, así el histórico
              no cambia si luego editas el servicio.
            </span>
          </label>

          <label className="block">
            <span className={labelTitle}>Precio (£) — opcional</span>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-text-3">
                £
              </span>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={`${inputCls} mt-0 pl-7`}
              />
            </div>
          </label>
        </SectionCard>

        {/* ───────── Pago ───────── */}
        <SectionCard
          accent="amber"
          icon={CreditCard}
          title="Pago"
          desc="Registra cómo y cuándo se cobró este servicio."
        >
          <label className="block">
            <span className={labelTitle}>Estado del pago</span>
            <select
              name="payment_status"
              defaultValue="pending"
              className={inputCls}
            >
              <option value="pending">⏳ Pendiente</option>
              <option value="paid">✅ Pagado</option>
              <option value="partial">⚖️ Pago parcial</option>
              <option value="waived">🆓 No se cobra</option>
            </select>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={labelTitle}>Método</span>
              <select name="payment_method" className={inputCls}>
                <option value="">—</option>
                <option value="cash">💵 Efectivo</option>
                <option value="card">💳 Tarjeta</option>
                <option value="transfer">🏦 Transferencia</option>
                <option value="bacs">📮 BACS</option>
                <option value="apple_pay">🍎 Apple Pay</option>
                <option value="google_pay">🔵 Google Pay</option>
                <option value="other">📋 Otro</option>
              </select>
            </label>

            <label className="block">
              <span className={labelTitle}>Cantidad cobrada (£)</span>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-text-3">
                  £
                </span>
                <input
                  type="number"
                  name="paid_amount"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={`${inputCls} mt-0 pl-7`}
                />
              </div>
            </label>
          </div>
        </SectionCard>

        {/* ───────── Notas ───────── */}
        <SectionCard accent="slate" icon={ArrowLeft} title="Notas internas" hideIcon>
          <label className="block">
            <span className={labelTitle}>Cualquier instrucción extra</span>
            <textarea
              name="notes"
              rows={3}
              placeholder="Clave wifi, ubicación de llaves, instrucciones especiales…"
              className={textareaCls}
            />
          </label>
        </SectionCard>

        {/* Sticky save bar */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-surface-2 bg-surface-0/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <Link
              href="/owner/tasks"
              className="flex h-12 shrink-0 items-center justify-center rounded-2xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-2 hover:bg-surface-1"
            >
              {t('common.cancel')}
            </Link>
            <button
              type="submit"
              disabled={noResources}
              className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 transition group-hover:rotate-12" />
              {t('tasks.createBtn')}
            </button>
          </div>
        </div>
      </form>
    </LightLayout>
  );
}

// ───────────────────────────── helpers ─────────────────────────────

const accentMap = {
  cyan: {
    stripe: 'from-cyan-400 to-blue-500',
    icon: 'bg-cyan-50 text-cyan-600 ring-cyan-200',
  },
  violet: {
    stripe: 'from-violet-400 to-fuchsia-500',
    icon: 'bg-violet-50 text-violet-600 ring-violet-200',
  },
  emerald: {
    stripe: 'from-emerald-400 to-teal-500',
    icon: 'bg-emerald-50 text-emerald-600 ring-emerald-200',
  },
  amber: {
    stripe: 'from-amber-400 to-orange-500',
    icon: 'bg-amber-50 text-amber-600 ring-amber-200',
  },
  slate: {
    stripe: 'from-slate-300 to-slate-400',
    icon: 'bg-slate-100 text-slate-500 ring-slate-200',
  },
} as const;

type Accent = keyof typeof accentMap;

function SectionCard({
  accent,
  icon: Icon,
  title,
  desc,
  hideIcon,
  children,
}: {
  accent: Accent;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc?: string;
  hideIcon?: boolean;
  children: React.ReactNode;
}) {
  const a = accentMap[accent];
  return (
    <section className="relative overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card">
      <div className={`h-1 bg-gradient-to-r ${a.stripe}`} />
      <div className="p-5">
        <header className="mb-5 flex items-start gap-3">
          {hideIcon ? null : (
            <span
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${a.icon}`}
            >
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base font-semibold text-text-1">
              {title}
            </h2>
            {desc ? <p className="mt-0.5 text-xs text-text-3">{desc}</p> : null}
          </div>
        </header>
        <div className="space-y-4">{children}</div>
      </div>
    </section>
  );
}
