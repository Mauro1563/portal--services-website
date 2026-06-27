import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { updateCleaner } from '../actions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditCleanerPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { data: cleaner } = await supabase
    .from('cleaners')
    .select('id, name, phone, email, default_hourly_pay_pence')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!cleaner) notFound();

  return (
    <LightLayout
      activeTab="cleaners"
      title="Editar operativo"
      showBack
      backHref={`/owner/cleaners/${id}`}
    >
      <p className="text-sm text-text-2">
        El PIN no se cambia aquí. Para rotarlo, usa el botón Regenerar en la
        ficha del operativo.
      </p>

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      <form action={updateCleaner} className="mt-5 space-y-4">
        <input type="hidden" name="cleaner_id" value={cleaner.id} />

        <Field
          label="Nombre completo"
          name="name"
          defaultValue={cleaner.name}
          required
        />
        <Field
          label="Teléfono"
          name="phone"
          type="tel"
          defaultValue={cleaner.phone ?? ''}
          placeholder="+44 7700 900000"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          defaultValue={cleaner.email ?? ''}
          placeholder="maria@example.com"
        />

        <label className="block">
          <span className="text-xs font-medium text-text-2">
            Pago por hora a este cleaner (£/h)
          </span>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-text-3">
              £
            </span>
            <input
              type="number"
              name="default_hourly_pay"
              step="0.01"
              min="0"
              defaultValue={
                cleaner.default_hourly_pay_pence != null &&
                cleaner.default_hourly_pay_pence > 0
                  ? (cleaner.default_hourly_pay_pence / 100).toFixed(2)
                  : ''
              }
              placeholder="0.00"
              className="block w-full rounded-xl border border-surface-2 bg-surface-0 py-2.5 pl-7 pr-4 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
          <span className="mt-1 block text-[11px] text-text-3">
            Es la tarifa por defecto que le pagás. Puede ser sobreescrita en
            cada tarea.
          </span>
        </label>

        <div className="flex gap-3 pt-2">
          <SubmitButton
            pendingLabel="Guardando…"
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow active:scale-[0.99] disabled:opacity-80"
          >
            Guardar cambios
          </SubmitButton>
          <Link
            href={`/owner/cleaners/${id}`}
            className="flex h-11 items-center justify-center rounded-2xl border border-surface-2 bg-surface-0 px-5 text-sm font-medium text-text-2 hover:bg-surface-1"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </LightLayout>
  );
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-2">
        {label}
        {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
      />
    </label>
  );
}
