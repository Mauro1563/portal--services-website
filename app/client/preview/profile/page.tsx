/**
 * Public preview: Client → Profile. Editable in the demo so a
 * prospect can tap "Editar", change a field, tap "Guardar" to see
 * the new value persist (in component state only), cycle the avatar,
 * and toggle their notification preferences.
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Bell,
  Check,
  Copy,
  Edit3,
  Gift,
  Globe,
  Mail,
  MapPin,
  Moon,
  Phone,
  Smartphone,
  User,
  X,
} from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { DemoToast } from '@/components/preview/DemoSheet';
import { LONDON_PROPERTIES, MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

type Profile = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const INITIAL: Profile = {
  name: 'Sofía Martín',
  email: 'sofia@example.com',
  phone: '+44 20 7946 0123',
  address: LONDON_PROPERTIES.soho.address,
};

// Avatar gradients to cycle through when the user taps "Cambiar foto".
const AVATAR_GRADIENTS = [
  'from-blue-600 to-blue-800',
  'from-rose-500 to-pink-700',
  'from-amber-500 to-orange-700',
  'from-emerald-500 to-teal-700',
  'from-violet-500 to-purple-800',
];

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
  error,
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-inset ${
        error ? 'ring-rose-300' : 'ring-blue-200'
      }`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
            error ? 'text-rose-600' : 'text-blue-600'
          }`}
        >
          {label}
        </p>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-0.5 block w-full border-0 bg-transparent p-0 text-[13.5px] font-semibold text-slate-900 focus:outline-none"
        />
        {error && (
          <p className="mt-1 text-[10.5px] text-rose-600">{error}</p>
        )}
      </div>
    </label>
  );
}

function Toggle({
  on,
  onChange,
  title,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      title={title}
      aria-pressed={on}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        on ? 'bg-blue-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
          on ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function PrefRow({
  icon: Icon,
  label,
  description,
  on,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  description: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-inset ring-slate-100">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
      </div>
      <Toggle
        on={on}
        onChange={onChange}
        title={`${on ? 'Desactivar' : 'Activar'} ${label.toLowerCase()}`}
      />
    </div>
  );
}

export default function ClientProfilePreview() {
  const [profile, setProfile] = useState<Profile>(INITIAL);
  const [draft, setDraft] = useState<Profile>(INITIAL);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>({});
  const [copied, setCopied] = useState(false);
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  // Notification + display preferences (real local state, real toggles).
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefSMS, setPrefSMS] = useState(false);
  const [prefReminders, setPrefReminders] = useState(true);
  const [prefDark, setPrefDark] = useState(false);
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function startEditing() {
    setDraft(profile);
    setErrors({});
    setEditing(true);
  }

  function save() {
    const next: Partial<Record<keyof Profile, string>> = {};
    if (!draft.name.trim()) next.name = 'El nombre es obligatorio';
    if (!draft.email.trim()) next.email = 'El email es obligatorio';
    else if (!/.+@.+\..+/.test(draft.email)) next.email = 'Email inválido';
    if (!draft.phone.trim()) next.phone = 'El teléfono es obligatorio';
    if (!draft.address.trim()) next.address = 'La dirección es obligatoria';
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setProfile(draft);
    setEditing(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
    showToast('Datos guardados');
  }

  function cycleAvatar() {
    setAvatarIdx((i) => (i + 1) % AVATAR_GRADIENTS.length);
    showToast('Avatar actualizado');
  }

  function copyCode() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('PREVIEW').catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const initial = profile.name.charAt(0).toUpperCase() || 'S';

  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="profile"
      title="Mi perfil"
    >
      <section
        className={`rounded-3xl bg-gradient-to-br ${AVATAR_GRADIENTS[avatarIdx]} p-5 text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)] transition`}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={cycleAvatar}
            title="Cambiar foto de perfil (cicla un avatar de demo)"
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/15 text-xl font-bold backdrop-blur hover:bg-white/25"
          >
            {initial}
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold">{profile.name}</p>
            <p className="mt-0.5 text-[12px] text-white/80">Cliente desde 2024</p>
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
        <button
          type="button"
          onClick={cycleAvatar}
          title="Probar otro avatar de demo"
          className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur hover:bg-white/25"
        >
          Cambiar foto
        </button>
      </section>

      <section className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-slate-900">Datos</h2>
          {savedFlash && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-100">
              <Check className="h-3 w-3" /> Guardado
            </span>
          )}
        </div>

        {editing ? (
          <>
            <div className="mt-3 flex flex-col gap-2.5">
              <EditField
                icon={User}
                label="Nombre"
                value={draft.name}
                error={errors.name}
                onChange={(v) => setDraft({ ...draft, name: v })}
              />
              <EditField
                icon={Mail}
                label="Email"
                type="email"
                value={draft.email}
                error={errors.email}
                onChange={(v) => setDraft({ ...draft, email: v })}
              />
              <EditField
                icon={Phone}
                label="Teléfono"
                type="tel"
                value={draft.phone}
                error={errors.phone}
                onChange={(v) => setDraft({ ...draft, phone: v })}
              />
              <EditField
                icon={MapPin}
                label="Dirección"
                value={draft.address}
                error={errors.address}
                onChange={(v) => setDraft({ ...draft, address: v })}
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setErrors({});
                }}
                title="Cancelar los cambios y volver"
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

      {/* Preferences */}
      <section className="mt-6">
        <h2 className="text-[13px] font-bold text-slate-900">Preferencias</h2>
        <div className="mt-3 flex flex-col gap-2.5">
          <PrefRow
            icon={Mail}
            label="Notificaciones por email"
            description="Recibe confirmaciones y resúmenes en tu inbox"
            on={prefEmail}
            onChange={(v) => {
              setPrefEmail(v);
              showToast(v ? 'Email activado' : 'Email desactivado');
            }}
          />
          <PrefRow
            icon={Smartphone}
            label="Notificaciones SMS"
            description="Un mensaje breve antes de cada visita"
            on={prefSMS}
            onChange={(v) => {
              setPrefSMS(v);
              showToast(v ? 'SMS activado' : 'SMS desactivado');
            }}
          />
          <PrefRow
            icon={Bell}
            label="Recordatorios"
            description="Te avisamos 1 día y 1 hora antes"
            on={prefReminders}
            onChange={(v) => {
              setPrefReminders(v);
              showToast(v ? 'Recordatorios activados' : 'Recordatorios desactivados');
            }}
          />
          <PrefRow
            icon={Moon}
            label="Modo oscuro"
            description="Tema oscuro en la próxima visita (demo)"
            on={prefDark}
            onChange={(v) => {
              setPrefDark(v);
              showToast(v ? 'Modo oscuro activado' : 'Modo oscuro desactivado');
            }}
          />

          <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-inset ring-slate-100">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
              <Globe className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-slate-900">Idioma</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Cómo ves la app y los mensajes
              </p>
            </div>
            <div className="flex shrink-0 gap-1 rounded-full bg-slate-100 p-0.5">
              {(['es', 'en'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setLanguage(l);
                    showToast(l === 'es' ? 'Español' : 'English');
                  }}
                  title={l === 'es' ? 'Cambiar a Español' : 'Switch to English'}
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                    language === l
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-100">
        <p className="text-[11px] text-slate-500">
          ¿Necesitas ayuda? Escríbele a{' '}
          <Link
            href="/client/preview/messages"
            title="Abrir el chat con London Sparkle Cleaning Co."
            className="font-semibold text-blue-700 underline-offset-2 hover:underline"
          >
            London Sparkle Cleaning Co.
          </Link>{' '}
          desde el chat y lo resolvemos al instante.
        </p>
      </section>

      <DemoToast show={toast != null} message={toast ?? ''} />
    </ClientShell>
  );
}
