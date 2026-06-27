'use client';

/**
 * Public, no-auth preview of the Cleaner /profile page. Mock data only.
 *
 * Inline-edit demo: fields are read-only until you tap "Editar". Editing
 * swaps the inputs to real <input> elements and a "Guardar" button writes
 * back to local state so the new values render immediately. UK phone +
 * London address used to stay consistent with the rest of the demo.
 */
import { useState } from 'react';
import { HelpCircle, Mail, MapPin, Pencil, Phone, User } from 'lucide-react';
import { PreviewBottomTabBar } from '@/components/preview/PreviewBottomTabBar';

type Profile = {
  name: string;
  pin: string;
  phone: string;
  email: string;
  address: string;
};

const INITIAL_PROFILE: Profile = {
  name: 'Carmen López',
  pin: '•••326',
  phone: '+44 7700 900123',
  email: 'carmen.lopez@ejemplo.com',
  address: '14 Queens Gate Mews, London SW7 5QN',
};

export default function OperativePreviewProfile() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [draft, setDraft] = useState<Profile>(INITIAL_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  function startEditing() {
    setDraft(profile);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraft(profile);
    setIsEditing(false);
  }

  function saveChanges() {
    setProfile(draft);
    setIsEditing(false);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1800);
  }

  return (
    <main className="min-h-screen bg-canvas pb-24">
      <div className="mx-auto max-w-md px-4 py-6">
        <header className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
              Mi perfil
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-text-1">
              {profile.name}
            </h1>
          </div>
          {!isEditing ? (
            <button
              type="button"
              onClick={startEditing}
              title="Editar tus datos personales — nombre, teléfono, email y dirección"
              className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-3 py-1.5 text-[11px] font-semibold text-text-1 hover:border-brand-400"
            >
              <Pencil className="h-3 w-3" />
              Editar
            </button>
          ) : null}
        </header>

        {savedFlash ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-semibold text-emerald-800">
            Cambios guardados.
          </div>
        ) : null}

        <section className="rounded-3xl border border-surface-2 bg-surface-0 p-5 shadow-card">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
            PIN de acceso
            <span
              title="Tu PIN te identifica al hacer login en la app. Solo HQ puede cambiarlo."
              className="grid h-3.5 w-3.5 cursor-help place-items-center text-text-3"
            >
              <HelpCircle className="h-3 w-3" />
            </span>
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tracking-[0.4em] text-text-1">
            {profile.pin}
          </p>
          <p className="mt-2 text-[11px] text-text-3">
            Tu PIN lo configura HQ. Pídele a tu manager que lo cambie si es necesario.
          </p>
        </section>

        <div className="mt-6 space-y-4">
          <Field
            label="Nombre completo"
            icon={<User className="h-4 w-4" />}
            value={isEditing ? draft.name : profile.name}
            editable={isEditing}
            type="text"
            onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
            title="Tu nombre como aparece para los clientes y en los recibos"
          />

          <Field
            label="Teléfono"
            icon={<Phone className="h-4 w-4" />}
            value={isEditing ? draft.phone : profile.phone}
            editable={isEditing}
            type="tel"
            onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
            title="Número UK para que clientes y manager te llamen"
          />

          <Field
            label="Email"
            icon={<Mail className="h-4 w-4" />}
            value={isEditing ? draft.email : profile.email}
            editable={isEditing}
            type="email"
            onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
            title="Email donde recibir asignaciones y notificaciones"
          />

          <Field
            label="Dirección"
            icon={<MapPin className="h-4 w-4" />}
            value={isEditing ? draft.address : profile.address}
            editable={isEditing}
            type="text"
            onChange={(v) => setDraft((d) => ({ ...d, address: v }))}
            title="Dirección base para calcular distancias y tiempos a las propiedades"
          />

          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={cancelEditing}
                title="Descartar los cambios y volver a los valores actuales"
                className="flex h-11 w-full items-center justify-center rounded-xl border border-line bg-paper text-sm font-bold uppercase tracking-[0.16em] text-text-1 transition hover:bg-surface-2"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveChanges}
                title="Guardar los cambios en tu perfil"
                className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110"
              >
                Guardar
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <PreviewBottomTabBar active="perfil" />
    </main>
  );
}

function Field({
  label,
  icon,
  value,
  editable,
  type,
  onChange,
  title,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  editable: boolean;
  type: 'text' | 'tel' | 'email';
  onChange: (v: string) => void;
  title?: string;
}) {
  return (
    <label className="block" title={title}>
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-3">
        {label}
      </span>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-3">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          readOnly={!editable}
          onChange={(e) => onChange(e.target.value)}
          className={`block h-11 w-full rounded-xl border pl-9 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-2 ${
            editable
              ? 'border-brand-400 bg-surface-0 focus:border-brand-600 focus:ring-brand-600/20'
              : 'border-surface-2 bg-surface-1/60 focus:border-brand-600 focus:ring-brand-600/20'
          }`}
        />
      </div>
    </label>
  );
}
