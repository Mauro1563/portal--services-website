/**
 * Public preview: Client → Profile. Editable in the demo so a
 * prospect can tap "Editar", change a field, and tap "Guardar" to
 * see the new value persist (in component state only).
 */
'use client';

import { useState } from 'react';
import { Check, Copy, Edit3, Gift, Mail, MapPin, Phone, User, X } from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { LONDON_PROPERTIES, MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

type Profile = {
  email: string;
  phone: string;
  address: string;
};

const INITIAL: Profile = {
  email: 'sofia@example.com',
  phone: '+44 20 7946 0123',
  address: LONDON_PROPERTIES.soho.address,
};

function ReadField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-inset ring-slate-100">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 text-[13.5px] font-semibold text-slate-900 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function EditField({
  icon: Icon,
  label,
  value,
  onChange,
  type = 'text',
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-inset ring-blue-200">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
          {label}
        </p>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-0.5 block w-full border-0 bg-transparent p-0 text-[13.5px] font-semibold text-slate-900 focus:outline-none"
        />
      </div>
    </label>
  );
}

export default function ClientProfilePreview() {
  const [profile, setProfile] = useState<Profile>(INITIAL);
  const [draft, setDraft] = useState<Profile>(INITIAL);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  function startEditing() {
    setDraft(profile);
    setEditing(true);
  }

  function save() {
    setProfile(draft);
    setEditing(false);
  }

  function copyCode() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('PREVIEW').catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="profile"
      title="Mi perfil"
    >
      <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)]">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/15 text-xl font-bold backdrop-blur">
            S
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold">Sofía Martín</p>
            <p className="mt-0.5 text-[12px] text-blue-100">
              Cliente desde 2024
            </p>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              title="Editar tus datos personales"
              className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white backdrop-blur hover:bg-white/25"
            >
              <Edit3 className="h-3 w-3" /> Editar
            </button>
          )}
        </div>
      </section>

      <section className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-slate-900">Datos</h2>
          <span
            className="text-[10px] text-slate-400"
            title="Tu equipo usa estos datos para contactarte y planificar las visitas"
          >
            ?
          </span>
        </div>

        {editing ? (
          <>
            <div className="mt-3 flex flex-col gap-2.5">
              <EditField
                icon={Mail}
                label="Email"
                type="email"
                value={draft.email}
                onChange={(v) => setDraft({ ...draft, email: v })}
              />
              <EditField
                icon={Phone}
                label="Teléfono"
                type="tel"
                value={draft.phone}
                onChange={(v) => setDraft({ ...draft, phone: v })}
              />
              <EditField
                icon={MapPin}
                label="Dirección"
                value={draft.address}
                onChange={(v) => setDraft({ ...draft, address: v })}
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                title="Cancelar los cambios"
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-2xl bg-slate-100 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
              >
                <X className="h-3.5 w-3.5" /> Cancelar
              </button>
              <button
                type="button"
                onClick={save}
                title="Guardar los nuevos datos"
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-2xl bg-blue-600 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.6)] hover:bg-blue-700"
              >
                <Check className="h-3.5 w-3.5" /> Guardar
              </button>
            </div>
          </>
        ) : (
          <div className="mt-3 flex flex-col gap-2.5">
            <ReadField icon={Mail} label="Email" value={profile.email} />
            <ReadField icon={Phone} label="Teléfono" value={profile.phone} />
            <ReadField icon={MapPin} label="Dirección" value={profile.address} />
            <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-inset ring-slate-100">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
                <Gift className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Código de referido
                </p>
                <p className="mt-0.5 text-[13.5px] font-semibold text-slate-900">
                  PREVIEW
                </p>
              </div>
              <button
                type="button"
                onClick={copyCode}
                title="Copiar código de referido al portapapeles"
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white hover:bg-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copiar
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-100">
        <p className="text-[11px] text-slate-500">
          ¿Necesitas ayuda? Escríbele a{' '}
          <span className="font-semibold text-slate-900">London Sparkle Cleaning Co.</span>{' '}
          desde el chat y lo resolvemos al instante.
        </p>
      </section>
    </ClientShell>
  );
}
