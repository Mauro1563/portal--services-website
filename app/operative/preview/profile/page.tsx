'use client';

/**
 * Public, no-auth preview of the Cleaner /profile page. Mock data only.
 *
 * Inline-edit demo: fields are read-only until you tap "Editar". Editing
 * swaps the inputs to real <input> elements and a "Guardar" button writes
 * back to local state so the new values render immediately. UK phone +
 * London address used to stay consistent with the rest of the demo.
 *
 * Additional functional bits: avatar cycler, notification + dark-mode +
 * language toggles, and a fake "Cerrar sesión" that pops a demo toast.
 */
import { useState } from 'react';
import {
  Bell,
  Camera,
  Globe,
  HelpCircle,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Pencil,
  Phone,
  RotateCcw,
  User,
} from 'lucide-react';
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';
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

// Cycleable avatar pool (Unsplash portraits, plain <img>, no domain config).
const AVATAR_POOL = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=200&h=200&auto=format&fit=crop&q=70',
];

type FieldErrors = Partial<Record<keyof Profile, string>>;

const COPY = {
  en: {
    errNameRequired: 'Name is required.',
    errPhoneRequired: 'Phone is required.',
    errEmailRequired: 'Email is required.',
    errEmailInvalid: 'Invalid email.',
    errAddressRequired: 'Address is required.',
    photoAlt: (name: string) => `Profile photo of ${name}`,
    avatarTitle: 'Change profile photo — cycles through the available options',
    myProfile: 'My profile',
    editTitle: 'Edit your personal details — name, phone, email and address',
    edit: 'Edit',
    changesSaved: 'Changes saved.',
    accessPin: 'Access PIN',
    pinHelpTitle: 'Your PIN identifies you when you log in. Only HQ can change it.',
    pinInfo: 'Your PIN is set by HQ. Ask your manager to change it if needed.',
    fieldName: 'Full name',
    fieldNameTitle: 'Your name as it appears to clients and on receipts',
    fieldPhone: 'Phone',
    fieldPhoneTitle: 'UK number so clients and managers can call you',
    fieldEmail: 'Email',
    fieldEmailTitle: 'Email for assignments and notifications',
    fieldAddress: 'Address',
    fieldAddressTitle: 'Home base for calculating distances and journey times to properties',
    cancel: 'Cancel',
    cancelTitle: 'Discard changes and return to the current values',
    save: 'Save',
    saveTitle: 'Save the changes to your profile',
    preferences: 'Preferences',
    pushNotifications: 'Push notifications',
    pushDescription: 'Get alerts when a new task is assigned to you',
    pushToggleTitle: 'Turn mobile push notifications on or off',
    darkMode: 'Dark mode',
    darkDescription: 'Dark theme for evening use',
    darkToggleTitle: 'Switch between light and dark theme',
    language: 'Language',
    languageDescription: 'App interface language',
    languageToggleTitle: (target: string) => `Change the app language to ${target}`,
    notifOn: 'Notifications enabled',
    notifOff: 'Notifications disabled',
    darkOn: 'Dark mode enabled',
    darkOff: 'Dark mode disabled',
    languageSet: (label: string) => `Language: ${label}`,
    resetDemo: 'Reset demo',
    resetDemoTitle: 'Reset the demo — returns the profile to its initial state',
    signOut: 'Sign out',
    signOutTitle: 'Sign out — in the real app this takes you to the login screen',
    avatarUpdated: 'Profile photo updated',
    signOutDemo: 'Demo · this would sign you out in the real app',
    sampleName: 'Carmen López',
    sampleEmail: 'carmen.lopez@example.com',
    sampleAddress: '14 Queens Gate Mews, London SW7 5QN',
  },
  es: {
    errNameRequired: 'El nombre es obligatorio.',
    errPhoneRequired: 'El teléfono es obligatorio.',
    errEmailRequired: 'El email es obligatorio.',
    errEmailInvalid: 'Email no válido.',
    errAddressRequired: 'La dirección es obligatoria.',
    photoAlt: (name: string) => `Foto de perfil de ${name}`,
    avatarTitle: 'Cambiar foto de perfil — cicla por las opciones disponibles',
    myProfile: 'Mi perfil',
    editTitle: 'Editar tus datos personales — nombre, teléfono, email y dirección',
    edit: 'Editar',
    changesSaved: 'Cambios guardados.',
    accessPin: 'PIN de acceso',
    pinHelpTitle: 'Tu PIN te identifica al hacer login en la app. Solo HQ puede cambiarlo.',
    pinInfo: 'Tu PIN lo configura HQ. Pídele a tu manager que lo cambie si es necesario.',
    fieldName: 'Nombre completo',
    fieldNameTitle: 'Tu nombre como aparece para los clientes y en los recibos',
    fieldPhone: 'Teléfono',
    fieldPhoneTitle: 'Número UK para que clientes y manager te llamen',
    fieldEmail: 'Email',
    fieldEmailTitle: 'Email donde recibir asignaciones y notificaciones',
    fieldAddress: 'Dirección',
    fieldAddressTitle: 'Dirección base para calcular distancias y tiempos a las propiedades',
    cancel: 'Cancelar',
    cancelTitle: 'Descartar los cambios y volver a los valores actuales',
    save: 'Guardar',
    saveTitle: 'Guardar los cambios en tu perfil',
    preferences: 'Preferencias',
    pushNotifications: 'Notificaciones push',
    pushDescription: 'Recibe avisos cuando te asignen una nueva tarea',
    pushToggleTitle: 'Activar o desactivar las notificaciones push del móvil',
    darkMode: 'Modo oscuro',
    darkDescription: 'Tema oscuro para usar la app de noche',
    darkToggleTitle: 'Cambiar entre tema claro y oscuro',
    language: 'Idioma',
    languageDescription: 'Idioma de la interfaz de la app',
    languageToggleTitle: (target: string) => `Cambiar el idioma de la app a ${target}`,
    notifOn: 'Notificaciones activadas',
    notifOff: 'Notificaciones desactivadas',
    darkOn: 'Modo oscuro activado',
    darkOff: 'Modo oscuro desactivado',
    languageSet: (label: string) => `Idioma: ${label}`,
    resetDemo: 'Reiniciar demo',
    resetDemoTitle: 'Reiniciar la demo — devuelve el perfil al estado inicial',
    signOut: 'Cerrar sesión',
    signOutTitle: 'Cerrar sesión — en la app real te lleva a la pantalla de login',
    avatarUpdated: 'Foto de perfil actualizada',
    signOutDemo: 'Demo · esto cerraría sesión en la app real',
    sampleName: 'Carmen López',
    sampleEmail: 'carmen.lopez@ejemplo.com',
    sampleAddress: '14 Queens Gate Mews, London SW7 5QN',
  },
  pt: {
    errNameRequired: 'O nome é obrigatório.',
    errPhoneRequired: 'O telefone é obrigatório.',
    errEmailRequired: 'O email é obrigatório.',
    errEmailInvalid: 'Email inválido.',
    errAddressRequired: 'A morada é obrigatória.',
    photoAlt: (name: string) => `Foto de perfil de ${name}`,
    avatarTitle: 'Mudar foto de perfil — alterna pelas opções disponíveis',
    myProfile: 'O meu perfil',
    editTitle: 'Editar os seus dados pessoais — nome, telefone, email e morada',
    edit: 'Editar',
    changesSaved: 'Alterações guardadas.',
    accessPin: 'PIN de acesso',
    pinHelpTitle: 'O seu PIN identifica-o ao iniciar sessão na app. Apenas a sede pode alterá-lo.',
    pinInfo: 'O seu PIN é configurado pela sede. Peça ao seu gestor para o alterar, se necessário.',
    fieldName: 'Nome completo',
    fieldNameTitle: 'O seu nome tal como aparece aos clientes e nos recibos',
    fieldPhone: 'Telefone',
    fieldPhoneTitle: 'Número do Reino Unido para clientes e gestor o contactarem',
    fieldEmail: 'Email',
    fieldEmailTitle: 'Email onde recebe atribuições e notificações',
    fieldAddress: 'Morada',
    fieldAddressTitle: 'Morada base para calcular distâncias e tempos até às propriedades',
    cancel: 'Cancelar',
    cancelTitle: 'Descartar as alterações e voltar aos valores atuais',
    save: 'Guardar',
    saveTitle: 'Guardar as alterações ao seu perfil',
    preferences: 'Preferências',
    pushNotifications: 'Notificações push',
    pushDescription: 'Receba avisos quando lhe atribuírem uma nova tarefa',
    pushToggleTitle: 'Ativar ou desativar as notificações push do telemóvel',
    darkMode: 'Modo escuro',
    darkDescription: 'Tema escuro para usar a app à noite',
    darkToggleTitle: 'Alternar entre tema claro e escuro',
    language: 'Idioma',
    languageDescription: 'Idioma da interface da app',
    languageToggleTitle: (target: string) => `Mudar o idioma da app para ${target}`,
    notifOn: 'Notificações ativadas',
    notifOff: 'Notificações desativadas',
    darkOn: 'Modo escuro ativado',
    darkOff: 'Modo escuro desativado',
    languageSet: (label: string) => `Idioma: ${label}`,
    resetDemo: 'Reiniciar demo',
    resetDemoTitle: 'Reiniciar a demo — devolve o perfil ao estado inicial',
    signOut: 'Terminar sessão',
    signOutTitle: 'Terminar sessão — na app real leva-o ao ecrã de início de sessão',
    avatarUpdated: 'Foto de perfil atualizada',
    signOutDemo: 'Demo · isto terminaria sessão na app real',
    sampleName: 'Carmen López',
    sampleEmail: 'carmen.lopez@exemplo.com',
    sampleAddress: '14 Queens Gate Mews, London SW7 5QN',
  },
} as const satisfies Record<ClientLocale, unknown>;

function validate(p: Profile, t: (typeof COPY)['en']): FieldErrors {
  const errors: FieldErrors = {};
  if (!p.name.trim()) errors.name = t.errNameRequired;
  if (!p.phone.trim()) errors.phone = t.errPhoneRequired;
  if (!p.email.trim()) {
    errors.email = t.errEmailRequired;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) {
    errors.email = t.errEmailInvalid;
  }
  if (!p.address.trim()) errors.address = t.errAddressRequired;
  return errors;
}

export default function OperativePreviewProfile() {
  const [resetKey, setResetKey] = useState(0);
  return <ProfileBody key={resetKey} onReset={() => setResetKey((k) => k + 1)} />;
}

function ProfileBody({ onReset }: { onReset: () => void }) {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const initial: Profile = {
    ...INITIAL_PROFILE,
    name: t.sampleName,
    email: t.sampleEmail,
    address: t.sampleAddress,
  };
  const [profile, setProfile] = useState<Profile>(initial);
  const [draft, setDraft] = useState<Profile>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isEditing, setIsEditing] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'es' | 'en'>(locale === 'es' ? 'es' : 'en');
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  function startEditing() {
    setDraft(profile);
    setErrors({});
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraft(profile);
    setErrors({});
    setIsEditing(false);
  }

  function saveChanges() {
    const e = validate(draft, t);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setProfile(draft);
    setIsEditing(false);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1800);
  }

  function cycleAvatar() {
    setAvatarIdx((i) => (i + 1) % AVATAR_POOL.length);
    showToast(t.avatarUpdated);
  }

  function fakeSignOut() {
    showToast(t.signOutDemo);
  }

  return (
    <main className="min-h-screen bg-canvas pb-24">
      <div className="mx-auto max-w-md px-4 py-6">
        <header className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AVATAR_POOL[avatarIdx]}
                alt={t.photoAlt(profile.name)}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-brand-500/30"
              />
              <button
                type="button"
                onClick={cycleAvatar}
                title={t.avatarTitle}
                className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-white shadow ring-2 ring-canvas hover:bg-brand-700"
              >
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
                {t.myProfile}
              </p>
              <h1 className="mt-0.5 font-display text-xl font-semibold text-text-1">
                {profile.name}
              </h1>
            </div>
          </div>
          {!isEditing ? (
            <button
              type="button"
              onClick={startEditing}
              title={t.editTitle}
              className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-3 py-1.5 text-[11px] font-semibold text-text-1 hover:border-brand-400"
            >
              <Pencil className="h-3 w-3" />
              {t.edit}
            </button>
          ) : null}
        </header>

        {savedFlash ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-semibold text-emerald-800">
            ✓ {t.changesSaved}
          </div>
        ) : null}

        <section className="rounded-3xl border border-surface-2 bg-surface-0 p-5 shadow-card">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
            {t.accessPin}
            <span
              title={t.pinHelpTitle}
              className="grid h-3.5 w-3.5 cursor-help place-items-center text-text-3"
            >
              <HelpCircle className="h-3 w-3" />
            </span>
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tracking-[0.4em] text-text-1">
            {profile.pin}
          </p>
          <p className="mt-2 text-[11px] text-text-3">
            {t.pinInfo}
          </p>
        </section>

        <div className="mt-6 space-y-4">
          <Field
            label={t.fieldName}
            icon={<User className="h-4 w-4" />}
            value={isEditing ? draft.name : profile.name}
            editable={isEditing}
            type="text"
            onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
            title={t.fieldNameTitle}
            error={errors.name}
          />

          <Field
            label={t.fieldPhone}
            icon={<Phone className="h-4 w-4" />}
            value={isEditing ? draft.phone : profile.phone}
            editable={isEditing}
            type="tel"
            onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
            title={t.fieldPhoneTitle}
            error={errors.phone}
          />

          <Field
            label={t.fieldEmail}
            icon={<Mail className="h-4 w-4" />}
            value={isEditing ? draft.email : profile.email}
            editable={isEditing}
            type="email"
            onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
            title={t.fieldEmailTitle}
            error={errors.email}
          />

          <Field
            label={t.fieldAddress}
            icon={<MapPin className="h-4 w-4" />}
            value={isEditing ? draft.address : profile.address}
            editable={isEditing}
            type="text"
            onChange={(v) => setDraft((d) => ({ ...d, address: v }))}
            title={t.fieldAddressTitle}
            error={errors.address}
          />

          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={cancelEditing}
                title={t.cancelTitle}
                className="flex h-11 w-full items-center justify-center rounded-xl border border-line bg-paper text-sm font-bold uppercase tracking-[0.16em] text-text-1 transition hover:bg-surface-2"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={saveChanges}
                title={t.saveTitle}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110"
              >
                {t.save}
              </button>
            </div>
          ) : null}
        </div>

        {/* Preferences */}
        <section className="mt-8 rounded-3xl border border-surface-2 bg-surface-0 p-5 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
            {t.preferences}
          </p>

          <ToggleRow
            icon={<Bell className="h-4 w-4 text-brand-600" />}
            label={t.pushNotifications}
            description={t.pushDescription}
            on={notifications}
            onToggle={() => {
              setNotifications((v) => !v);
              showToast(!notifications ? t.notifOn : t.notifOff);
            }}
            title={t.pushToggleTitle}
          />

          <ToggleRow
            icon={<Moon className="h-4 w-4 text-brand-600" />}
            label={t.darkMode}
            description={t.darkDescription}
            on={darkMode}
            onToggle={() => {
              setDarkMode((v) => !v);
              showToast(!darkMode ? t.darkOn : t.darkOff);
            }}
            title={t.darkToggleTitle}
          />

          <div className="mt-4">
            <p className="inline-flex items-center gap-2 text-[12px] font-semibold text-text-1">
              <Globe className="h-4 w-4 text-brand-600" />
              {t.language}
            </p>
            <p className="ml-6 text-[11px] text-text-3">
              {t.languageDescription}
            </p>
            <div className="ml-6 mt-2 inline-flex rounded-full border border-line bg-paper p-0.5">
              {(['es', 'en'] as const).map((lng) => {
                const label = lng === 'es' ? 'Español' : 'English';
                return (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => {
                      setLanguage(lng);
                      showToast(t.languageSet(label));
                    }}
                    title={t.languageToggleTitle(label)}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                      language === lng
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-text-3 hover:text-text-1'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onReset}
            title={t.resetDemoTitle}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-paper text-[12px] font-bold uppercase tracking-[0.14em] text-text-3 transition hover:text-text-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t.resetDemo}
          </button>
          <button
            type="button"
            onClick={fakeSignOut}
            title={t.signOutTitle}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-[12px] font-bold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-100"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t.signOut}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast ? (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] mx-auto flex max-w-md justify-center px-4"
          aria-live="polite"
        >
          <div className="rounded-full bg-slate-900/95 px-4 py-2 text-[12px] font-semibold text-white shadow-lg backdrop-blur">
            {toast}
          </div>
        </div>
      ) : null}

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
  error,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  editable: boolean;
  type: 'text' | 'tel' | 'email';
  onChange: (v: string) => void;
  title?: string;
  error?: string;
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
            error
              ? 'border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-500/20'
              : editable
                ? 'border-brand-400 bg-surface-0 focus:border-brand-600 focus:ring-brand-600/20'
                : 'border-surface-2 bg-surface-1/60 focus:border-brand-600 focus:ring-brand-600/20'
          }`}
        />
      </div>
      {error ? (
        <p className="mt-1 text-[11px] font-semibold text-red-600">{error}</p>
      ) : null}
    </label>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  on,
  onToggle,
  title,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  on: boolean;
  onToggle: () => void;
  title?: string;
}) {
  return (
    <div className="mt-4 flex items-start justify-between gap-3" title={title}>
      <div className="min-w-0 flex-1">
        <p className="inline-flex items-center gap-2 text-[12px] font-semibold text-text-1">
          {icon}
          {label}
        </p>
        <p className="ml-6 text-[11px] text-text-3">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        title={title}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
          on ? 'bg-blue-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            on ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
