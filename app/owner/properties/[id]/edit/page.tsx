import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { updateProperty } from '../actions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditPropertyPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { data: property } = await supabase
    .from('properties')
    .select(
      'id, name, address, notes, airbnb_ical_url, platform, guests, floor_area_sqm',
    )
    .eq('id', id)
    .maybeSingle();

  if (!property) notFound();

  return (
    <LightLayout
      activeTab="properties"
      title="Editar propiedad"
      showBack
      backHref={`/owner/properties/${id}`}
    >
      {error && (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}

      <form action={updateProperty} className="space-y-4">
        <input type="hidden" name="property_id" value={property.id} />

        <Field
          label="Nombre"
          name="name"
          defaultValue={property.name}
          required
        />
        <Field
          label="Dirección"
          name="address"
          defaultValue={property.address ?? ''}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Plataforma"
            name="platform"
            defaultValue={property.platform ?? ''}
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
            defaultValue={property.guests?.toString() ?? ''}
            placeholder="2"
          />
        </div>

        <Field
          label="Superficie (m²)"
          name="floor_area_sqm"
          type="number"
          min={1}
          defaultValue={property.floor_area_sqm?.toString() ?? ''}
          placeholder="45"
        />

        <Field
          label="URL iCal Airbnb / Booking"
          name="airbnb_ical_url"
          type="url"
          defaultValue={property.airbnb_ical_url ?? ''}
          placeholder="https://www.airbnb.com/calendar/ical/..."
          hint="Airbnb: Calendario → Configuración de disponibilidad → Sincronizar."
        />

        <Field
          label="Notas"
          name="notes"
          textarea
          defaultValue={property.notes ?? ''}
          placeholder="Clave wifi, ubicación de llaves, instrucciones especiales..."
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow active:scale-[0.99]"
          >
            Guardar cambios
          </button>
          <Link
            href={`/owner/properties/${id}`}
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
  hint,
  textarea,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
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
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      ) : (
        <input
          name={name}
          type={type}
          min={min}
          required={required}
          defaultValue={defaultValue}
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
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-2">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
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
