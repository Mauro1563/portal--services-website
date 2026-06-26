import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Home, KeyRound, MapPin, User, Wifi } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { addClient } from '../actions';

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewClientPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { error } = await searchParams;

  return (
    <LightLayout activeTab="more" title="Nuevo cliente" showBack backHref="/owner/clients">
      <p className="text-sm text-text-2">
        Cliente + casa en una sola pantalla. Lo que cargues acá es lo que el
        limpiador va a ver en su app — dirección con código postal para el GPS,
        instrucciones de llaves y wifi.
      </p>

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      <form action={addClient} className="mt-5 space-y-5">
        {/* ── Datos del cliente ───────────────────────────────────── */}
        <Section icon={User} title="Datos del cliente">
          <Field
            label="Nombre"
            name="name"
            required
            placeholder="Ej. María García"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Teléfono / WhatsApp"
              name="phone"
              type="tel"
              placeholder="+34 600 000 000"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="maria@email.com"
            />
          </div>
        </Section>

        {/* ── Datos de la casa ────────────────────────────────────── */}
        <Section
          icon={Home}
          title="Datos de la casa"
          subtitle="Para que el limpiador llegue sin perderse y entre sin problemas."
        >
          <Field
            label="Dirección"
            name="address"
            placeholder="C/ Mayor 12, 3.º B"
            icon={MapPin}
            hint="Calle, número y piso si aplica."
          />
          <Field
            label="Código postal"
            name="postcode"
            placeholder="28013"
            hint="Lo usa el limpiador para abrir Google Maps con el destino exacto."
          />
        </Section>

        {/* ── Acceso e instrucciones ──────────────────────────────── */}
        <Section
          icon={KeyRound}
          title="Llaves y wifi"
          subtitle="Opcional. Si tu limpiador necesita esto en sitio, lo ve sin tener que pedírtelo."
        >
          <Field
            label="Llaves / acceso"
            name="key_info"
            textarea
            placeholder="Ej. Caja con código 4821 a la izquierda del portal."
            icon={KeyRound}
          />
          <Field
            label="Wifi"
            name="wifi_info"
            placeholder="Ej. CasaMaria · clave 12345678"
            icon={Wifi}
          />
        </Section>

        {/* ── Notas libres ────────────────────────────────────────── */}
        <Section icon={Home} title="Notas">
          <Field
            label="Cualquier cosa más"
            name="notes"
            textarea
            placeholder="Alergias, mascotas, productos preferidos, horarios sensibles…"
          />
        </Section>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow"
          >
            Crear cliente
          </button>
          <Link
            href="/owner/clients"
            className="flex h-11 items-center justify-center rounded-2xl border border-surface-2 bg-surface-0 px-5 text-sm font-medium text-text-2 hover:bg-surface-1"
          >
            Cancelar
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  textarea?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
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
          rows={2}
          placeholder={placeholder}
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      )}
      {hint ? (
        <span className="mt-1 block text-[11px] text-text-3">{hint}</span>
      ) : null}
    </label>
  );
}
