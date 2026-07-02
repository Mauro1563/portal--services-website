import { redirect } from 'next/navigation';
import { Sparkles, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { addService, deleteService, toggleService } from './actions';
import { getT } from '@/lib/i18n';

type Props = {
  searchParams: Promise<{ error?: string; created?: string }>;
};

function formatPrice(pence: number | null, hourly: number | null): string {
  if (pence) return `£${(pence / 100).toFixed(2)}`;
  if (hourly) return `£${(hourly / 100).toFixed(2)}/h`;
  return '—';
}

export default async function ServicesPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');
  const t = await getT();

  const { error, created } = await searchParams;

  const { data: services } = await supabase
    .from('service_types')
    .select('id, name, description, default_duration_min, price_pence, hourly_rate_pence, is_active, created_at')
    .order('created_at', { ascending: true });

  return (
    <LightLayout activeTab="more" title="Servicios" showBack backHref="/owner/more">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text-1">Catálogo de servicios</h1>
        <p className="mt-1 text-xs text-text-2">
          Define cada tipo de limpieza que ofreces — Regular, Profunda, Mudanza,
          Fin de contrato, Rotación de Airbnb, etc. — con su duración y precio.
        </p>
      </div>

      {created ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          Servicio añadido.
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      {/* Add form */}
      <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
          <Sparkles className="h-4 w-4 text-brand-600" /> {t('common.addService')}
        </h2>
        <form action={addService} className="mt-4 space-y-3">
          <Field label="Nombre" name="name" required placeholder="ej. Limpieza regular" />
          <Field
            label="Descripción"
            name="description"
            placeholder="Todo el piso, baño, cocina, dormitorios…"
          />
          <Field
            label="Duración aproximada (minutos)"
            name="default_duration_min"
            type="number"
            min={15}
            placeholder="120"
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Precio fijo (£)"
              name="price_pounds"
              type="number"
              placeholder="60"
              hint="Usa este O el precio por hora"
            />
            <Field
              label="Precio por hora (£/h)"
              name="hourly_rate_pounds"
              type="number"
              placeholder="15"
              hint="Si no usas precio fijo"
            />
          </div>
          <SubmitButton
            pendingLabel="Añadiendo…"
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand-glow disabled:opacity-70"
          >
            Añadir servicio
          </SubmitButton>
        </form>
      </section>

      {/* List */}
      <section className="mt-6 mb-4">
        <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-text-3">
          Tus servicios ({services?.length ?? 0})
        </h2>
        {!services || services.length === 0 ? (
          <p className="mt-2 text-sm text-text-2">
            Aún no tienes servicios. Añade el primero arriba — por ejemplo
            «Limpieza profunda — £25/h» o «Fin de contrato — £180».
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {services.map((s) => (
              <li
                key={s.id}
                className="rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-text-1">
                      {s.name}
                    </p>
                    {s.description ? (
                      <p className="mt-0.5 text-[11px] text-text-3">{s.description}</p>
                    ) : null}
                    <p className="mt-2 inline-flex items-center gap-3 text-[11px] text-text-2">
                      <span className="font-mono font-semibold text-brand-700">
                        {formatPrice(s.price_pence, s.hourly_rate_pence)}
                      </span>
                      {s.default_duration_min ? (
                        <span>{s.default_duration_min} min</span>
                      ) : null}
                      {!s.is_active ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold uppercase tracking-wider text-amber-700">
                          Inactivo
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={toggleService}>
                      <input type="hidden" name="service_id" value={s.id} />
                      <input type="hidden" name="active" value={s.is_active ? '1' : '0'} />
                      <SubmitButton
                        pendingLabel="…"
                        className="inline-flex items-center gap-1 rounded-lg border border-surface-2 bg-surface-0 px-2.5 py-1 text-[11px] text-text-2 hover:bg-surface-1 disabled:opacity-60"
                      >
                        {s.is_active ? 'Desactivar' : 'Activar'}
                      </SubmitButton>
                    </form>
                    <form action={deleteService}>
                      <input type="hidden" name="service_id" value={s.id} />
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
    </LightLayout>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  hint,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  min?: number;
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
        min={min}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
      />
      {hint ? <span className="mt-1 block text-[11px] text-text-3">{hint}</span> : null}
    </label>
  );
}
