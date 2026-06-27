import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Calendar, FileText, Home, Info, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { getT } from '@/lib/i18n';
import { addProperty } from '@/app/owner/actions';

type Props = {
  searchParams: Promise<{ error?: string; client_id?: string }>;
};

export default async function NewPropertyPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const t = await getT();
  const { error, client_id: preselectClientId } = await searchParams;

  // Load clients so the owner can attach this property to an existing
  // client instead of re-typing contact info. If the owner has none
  // yet, the picker is hidden and the legacy inline contact fields are
  // shown as a fallback.
  const { data: clientsRaw } = await supabase
    .from('clients')
    .select('id, name')
    .order('name');
  const clientOptions = clientsRaw ?? [];

  return (
    <LightLayout
      activeTab="properties"
      title={t('properties.newTitle')}
      showBack
      backHref="/owner/properties"
    >
      <p className="text-sm text-text-2">{t('properties.newSubtitle')}</p>

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      <form action={addProperty} className="mt-5 space-y-5">
        {/* ── Datos básicos ─────────────────────────────────────────── */}
        <Section icon={Home} title="Datos básicos">
          <Field
            label={t('onboarding.propertyName')}
            name="name"
            required
            placeholder={t('onboarding.propertyNamePh')}
            hint="Algo corto que reconozcas (ej. «Flat 3 — Camden»)."
          />
          <Field
            label={t('onboarding.address')}
            name="address"
            placeholder={t('onboarding.addressPh')}
          />
        </Section>

        {/* ── Vinculación al cliente o contacto manual ─────────────── */}
        <Section
          icon={User}
          title="Cliente / contacto"
          subtitle={
            clientOptions.length > 0
              ? 'Vinculá con un cliente existente — sus datos pasan a ser la fuente de verdad. O cargá un contacto suelto abajo.'
              : 'Todavía no tenés clientes registrados. Cargá un contacto suelto o creá un cliente primero.'
          }
        >
          {clientOptions.length > 0 ? (
            <label className="block">
              <span className="text-xs font-medium text-text-2">
                Cliente vinculado
              </span>
              <select
                name="client_id"
                defaultValue={preselectClientId ?? ''}
                className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              >
                <option value="">— Sin cliente vinculado —</option>
                {clientOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-[11px] text-text-3">
                Si elegís uno, los campos de contacto de abajo se ignoran.
              </span>
            </label>
          ) : null}
          <Field
            label="Nombre (si no vinculaste cliente)"
            name="contact_name"
            placeholder="Ej. María García"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Teléfono / WhatsApp"
              name="contact_phone"
              type="tel"
              placeholder="+34 600 000 000"
            />
            <Field
              label="Email"
              name="contact_email"
              type="email"
              placeholder="maria@email.com"
            />
          </div>
        </Section>

        {/* ── Detalles de la propiedad ──────────────────────────────── */}
        <Section icon={Info} title="Detalles de la propiedad">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Plataforma"
              name="platform"
              options={[
                { value: '', label: '—' },
                { value: 'airbnb', label: 'Airbnb' },
                { value: 'booking', label: 'Booking.com' },
                { value: 'direct', label: 'Directo' },
                { value: 'other', label: 'Otra' },
              ]}
            />
            <Field
              label="Huéspedes"
              name="guests"
              type="number"
              min={1}
              placeholder="2"
            />
          </div>
          <Field
            label="Superficie (m²)"
            name="floor_area_sqm"
            type="number"
            min={1}
            placeholder="45"
          />
        </Section>

        {/* ── Integración Airbnb / Booking ──────────────────────────── */}
        <Section
          icon={Calendar}
          title="Sincronización de calendario"
          subtitle="Opcional. Si la propiedad está en Airbnb / Booking, pegá la URL iCal y las reservas aparecen solas."
        >
          <Field
            label={t('onboarding.icalUrl')}
            name="airbnb_ical_url"
            type="url"
            placeholder={t('onboarding.icalUrlPh')}
            hint={t('onboarding.icalHint')}
          />
        </Section>

        {/* ── Notas ─────────────────────────────────────────────────── */}
        <Section icon={FileText} title="Notas">
          <Field
            label={t('properties.notes')}
            name="notes"
            textarea
            placeholder="Clave wifi, ubicación de llaves, instrucciones especiales..."
          />
        </Section>

        <div className="flex gap-3 pt-2">
          <SubmitButton
            pendingLabel="Creando…"
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow disabled:opacity-80"
          >
            {t('properties.createBtn')}
          </SubmitButton>
          <Link
            href="/owner/properties"
            className="flex h-11 items-center justify-center rounded-2xl border border-surface-2 bg-surface-0 px-5 text-sm font-medium text-text-2 hover:bg-surface-1"
          >
            {t('common.cancel')}
          </Link>
        </div>
      </form>
    </LightLayout>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
      <header className="mb-3 flex items-start gap-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600/10 text-brand-700">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-sm font-semibold text-text-1">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-[11px] text-text-3">{subtitle}</p>
          ) : null}
        </div>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  hint,
  textarea,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  textarea?: boolean;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-2">
        {label}
        {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          placeholder={placeholder}
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          min={min}
          placeholder={placeholder}
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      )}
      {hint ? <span className="mt-1 block text-[11px] text-text-3">{hint}</span> : null}
    </label>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-2">{label}</span>
      <select
        name={name}
        defaultValue=""
        className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
