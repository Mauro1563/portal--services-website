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
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';
import { LONDON_PROPERTIES, MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

const COPY = {
  en: {
    title: 'My profile',
    clientSince: 'Client since 2024',
    edit: 'Edit',
    editTitle: 'Edit your personal details',
    changePhoto: 'Change photo',
    changePhotoTitle: 'Change profile photo (cycles a demo avatar)',
    avatarToggleTitle: 'Change profile photo (cycles a demo avatar)',
    avatarToggleTry: 'Try another demo avatar',
    data: 'Details',
    saved: 'Saved',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email',
    phoneRequired: 'Phone is required',
    addressRequired: 'Address is required',
    saveTitle: 'Save the new details',
    cancelTitle: 'Cancel changes and go back',
    cancel: 'Cancel',
    save: 'Save',
    referralCode: 'Referral code',
    copyTitle: 'Copy referral code to clipboard',
    copied: 'Copied',
    copy: 'Copy',
    preferences: 'Preferences',
    emailNotif: 'Email notifications',
    emailNotifDesc: 'Receive confirmations and summaries in your inbox',
    smsNotif: 'SMS notifications',
    smsNotifDesc: 'A short text before each visit',
    reminders: 'Reminders',
    remindersDesc: 'We ping you 1 day and 1 hour before',
    darkMode: 'Dark mode',
    darkModeDesc: 'Dark theme on the next visit (demo)',
    language: 'Language',
    languageDesc: 'How you see the app and messages',
    switchToEs: 'Switch to Spanish',
    switchToEn: 'Switch to English',
    helpLine1: 'Need help? Message ',
    helpLine2: ' from chat and we sort it instantly.',
    openChatTitle: 'Open the chat with London Sparkle Cleaning Co.',
    savedToast: 'Details saved',
    avatarUpdated: 'Avatar updated',
    emailOn: 'Email on',
    emailOff: 'Email off',
    smsOn: 'SMS on',
    smsOff: 'SMS off',
    remindersOn: 'Reminders on',
    remindersOff: 'Reminders off',
    darkModeOn: 'Dark mode on',
    darkModeOff: 'Dark mode off',
    spanishToast: 'Spanish',
    englishToast: 'English',
    toggleEnable: 'Enable',
    toggleDisable: 'Disable',
  },
  es: {
    title: 'Mi perfil',
    clientSince: 'Cliente desde 2024',
    edit: 'Editar',
    editTitle: 'Editar tus datos personales',
    changePhoto: 'Cambiar foto',
    changePhotoTitle: 'Cambiar foto de perfil (cicla un avatar de demo)',
    avatarToggleTitle: 'Cambiar foto de perfil (cicla un avatar de demo)',
    avatarToggleTry: 'Probar otro avatar de demo',
    data: 'Datos',
    saved: 'Guardado',
    name: 'Nombre',
    email: 'Email',
    phone: 'Teléfono',
    address: 'Dirección',
    nameRequired: 'El nombre es obligatorio',
    emailRequired: 'El email es obligatorio',
    emailInvalid: 'Email inválido',
    phoneRequired: 'El teléfono es obligatorio',
    addressRequired: 'La dirección es obligatoria',
    saveTitle: 'Guardar los nuevos datos',
    cancelTitle: 'Cancelar los cambios y volver',
    cancel: 'Cancelar',
    save: 'Guardar',
    referralCode: 'Código de referido',
    copyTitle: 'Copiar código de referido al portapapeles',
    copied: 'Copiado',
    copy: 'Copiar',
    preferences: 'Preferencias',
    emailNotif: 'Notificaciones por email',
    emailNotifDesc: 'Recibe confirmaciones y resúmenes en tu inbox',
    smsNotif: 'Notificaciones SMS',
    smsNotifDesc: 'Un mensaje breve antes de cada visita',
    reminders: 'Recordatorios',
    remindersDesc: 'Te avisamos 1 día y 1 hora antes',
    darkMode: 'Modo oscuro',
    darkModeDesc: 'Tema oscuro en la próxima visita (demo)',
    language: 'Idioma',
    languageDesc: 'Cómo ves la app y los mensajes',
    switchToEs: 'Cambiar a Español',
    switchToEn: 'Switch to English',
    helpLine1: '¿Necesitas ayuda? Escríbele a ',
    helpLine2: ' desde el chat y lo resolvemos al instante.',
    openChatTitle: 'Abrir el chat con London Sparkle Cleaning Co.',
    savedToast: 'Datos guardados',
    avatarUpdated: 'Avatar actualizado',
    emailOn: 'Email activado',
    emailOff: 'Email desactivado',
    smsOn: 'SMS activado',
    smsOff: 'SMS desactivado',
    remindersOn: 'Recordatorios activados',
    remindersOff: 'Recordatorios desactivados',
    darkModeOn: 'Modo oscuro activado',
    darkModeOff: 'Modo oscuro desactivado',
    spanishToast: 'Español',
    englishToast: 'English',
    toggleEnable: 'Activar',
    toggleDisable: 'Desactivar',
  },
  pt: {
    title: 'O meu perfil',
    clientSince: 'Cliente desde 2024',
    edit: 'Editar',
    editTitle: 'Editar os seus dados pessoais',
    changePhoto: 'Mudar foto',
    changePhotoTitle: 'Mudar foto de perfil (cicla um avatar demo)',
    avatarToggleTitle: 'Mudar foto de perfil (cicla um avatar demo)',
    avatarToggleTry: 'Experimentar outro avatar demo',
    data: 'Dados',
    saved: 'Guardado',
    name: 'Nome',
    email: 'Email',
    phone: 'Telefone',
    address: 'Morada',
    nameRequired: 'O nome é obrigatório',
    emailRequired: 'O email é obrigatório',
    emailInvalid: 'Email inválido',
    phoneRequired: 'O telefone é obrigatório',
    addressRequired: 'A morada é obrigatória',
    saveTitle: 'Guardar os novos dados',
    cancelTitle: 'Cancelar as alterações e voltar',
    cancel: 'Cancelar',
    save: 'Guardar',
    referralCode: 'Código de referência',
    copyTitle: 'Copiar código de referência para a área de transferência',
    copied: 'Copiado',
    copy: 'Copiar',
    preferences: 'Preferências',
    emailNotif: 'Notificações por email',
    emailNotifDesc: 'Receba confirmações e resumos na sua caixa de entrada',
    smsNotif: 'Notificações SMS',
    smsNotifDesc: 'Uma mensagem breve antes de cada visita',
    reminders: 'Lembretes',
    remindersDesc: 'Avisamos 1 dia e 1 hora antes',
    darkMode: 'Modo escuro',
    darkModeDesc: 'Tema escuro na próxima visita (demo)',
    language: 'Idioma',
    languageDesc: 'Como vê a app e as mensagens',
    switchToEs: 'Mudar para Espanhol',
    switchToEn: 'Switch to English',
    helpLine1: 'Precisa de ajuda? Escreva a ',
    helpLine2: ' a partir do chat e resolvemos no momento.',
    openChatTitle: 'Abrir o chat com a London Sparkle Cleaning Co.',
    savedToast: 'Dados guardados',
    avatarUpdated: 'Avatar atualizado',
    emailOn: 'Email ativado',
    emailOff: 'Email desativado',
    smsOn: 'SMS ativado',
    smsOff: 'SMS desativado',
    remindersOn: 'Lembretes ativados',
    remindersOff: 'Lembretes desativados',
    darkModeOn: 'Modo escuro ativado',
    darkModeOff: 'Modo escuro desativado',
    spanishToast: 'Espanhol',
    englishToast: 'English',
    toggleEnable: 'Ativar',
    toggleDisable: 'Desativar',
  },
} as const satisfies Record<ClientLocale, unknown>;

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
  toggleEnable,
  toggleDisable,
}: {
  icon: typeof Bell;
  label: string;
  description: string;
  on: boolean;
  onChange: (v: boolean) => void;
  toggleEnable: string;
  toggleDisable: string;
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
        title={`${on ? toggleDisable : toggleEnable} ${label.toLowerCase()}`}
      />
    </div>
  );
}

export default function ClientProfilePreview() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
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
    if (!draft.name.trim()) next.name = t.nameRequired;
    if (!draft.email.trim()) next.email = t.emailRequired;
    else if (!/.+@.+\..+/.test(draft.email)) next.email = t.emailInvalid;
    if (!draft.phone.trim()) next.phone = t.phoneRequired;
    if (!draft.address.trim()) next.address = t.addressRequired;
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setProfile(draft);
    setEditing(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
    showToast(t.savedToast);
  }

  function cycleAvatar() {
    setAvatarIdx((i) => (i + 1) % AVATAR_GRADIENTS.length);
    showToast(t.avatarUpdated);
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
      title={t.title}
    >
      <section
        className={`rounded-3xl bg-gradient-to-br ${AVATAR_GRADIENTS[avatarIdx]} p-5 text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)] transition`}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={cycleAvatar}
            title={t.avatarToggleTitle}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/15 text-xl font-bold backdrop-blur hover:bg-white/25"
          >
            {initial}
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold">{profile.name}</p>
            <p className="mt-0.5 text-[12px] text-white/80">{t.clientSince}</p>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              title={t.editTitle}
              className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white backdrop-blur hover:bg-white/25"
            >
              <Edit3 className="h-3 w-3" /> {t.edit}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={cycleAvatar}
          title={t.avatarToggleTry}
          className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur hover:bg-white/25"
        >
          {t.changePhoto}
        </button>
      </section>

      <section className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-slate-900">{t.data}</h2>
          {savedFlash && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-100">
              <Check className="h-3 w-3" /> {t.saved}
            </span>
          )}
        </div>

        {editing ? (
          <>
            <div className="mt-3 flex flex-col gap-2.5">
              <EditField
                icon={User}
                label={t.name}
                value={draft.name}
                error={errors.name}
                onChange={(v) => setDraft({ ...draft, name: v })}
              />
              <EditField
                icon={Mail}
                label={t.email}
                type="email"
                value={draft.email}
                error={errors.email}
                onChange={(v) => setDraft({ ...draft, email: v })}
              />
              <EditField
                icon={Phone}
                label={t.phone}
                type="tel"
                value={draft.phone}
                error={errors.phone}
                onChange={(v) => setDraft({ ...draft, phone: v })}
              />
              <EditField
                icon={MapPin}
                label={t.address}
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
                title={t.cancelTitle}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-2xl bg-slate-100 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
              >
                <X className="h-3.5 w-3.5" /> {t.cancel}
              </button>
              <button
                type="button"
                onClick={save}
                title={t.saveTitle}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-2xl bg-blue-600 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.6)] hover:bg-blue-700"
              >
                <Check className="h-3.5 w-3.5" /> {t.save}
              </button>
            </div>
          </>
        ) : (
          <div className="mt-3 flex flex-col gap-2.5">
            <ReadField icon={Mail} label={t.email} value={profile.email} />
            <ReadField icon={Phone} label={t.phone} value={profile.phone} />
            <ReadField icon={MapPin} label={t.address} value={profile.address} />
            <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-inset ring-slate-100">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
                <Gift className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {t.referralCode}
                </p>
                <p className="mt-0.5 text-[13.5px] font-semibold text-slate-900">
                  PREVIEW
                </p>
              </div>
              <button
                type="button"
                onClick={copyCode}
                title={t.copyTitle}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white hover:bg-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" /> {t.copied}
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> {t.copy}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Preferences */}
      <section className="mt-6">
        <h2 className="text-[13px] font-bold text-slate-900">{t.preferences}</h2>
        <div className="mt-3 flex flex-col gap-2.5">
          <PrefRow
            icon={Mail}
            label={t.emailNotif}
            description={t.emailNotifDesc}
            on={prefEmail}
            onChange={(v) => {
              setPrefEmail(v);
              showToast(v ? t.emailOn : t.emailOff);
            }}
            toggleEnable={t.toggleEnable}
            toggleDisable={t.toggleDisable}
          />
          <PrefRow
            icon={Smartphone}
            label={t.smsNotif}
            description={t.smsNotifDesc}
            on={prefSMS}
            onChange={(v) => {
              setPrefSMS(v);
              showToast(v ? t.smsOn : t.smsOff);
            }}
            toggleEnable={t.toggleEnable}
            toggleDisable={t.toggleDisable}
          />
          <PrefRow
            icon={Bell}
            label={t.reminders}
            description={t.remindersDesc}
            on={prefReminders}
            onChange={(v) => {
              setPrefReminders(v);
              showToast(v ? t.remindersOn : t.remindersOff);
            }}
            toggleEnable={t.toggleEnable}
            toggleDisable={t.toggleDisable}
          />
          <PrefRow
            icon={Moon}
            label={t.darkMode}
            description={t.darkModeDesc}
            on={prefDark}
            onChange={(v) => {
              setPrefDark(v);
              showToast(v ? t.darkModeOn : t.darkModeOff);
            }}
            toggleEnable={t.toggleEnable}
            toggleDisable={t.toggleDisable}
          />

          <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-inset ring-slate-100">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
              <Globe className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-slate-900">{t.language}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {t.languageDesc}
              </p>
            </div>
            <div className="flex shrink-0 gap-1 rounded-full bg-slate-100 p-0.5">
              {(['es', 'en'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setLanguage(l);
                    showToast(l === 'es' ? t.spanishToast : t.englishToast);
                  }}
                  title={l === 'es' ? t.switchToEs : t.switchToEn}
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
          {t.helpLine1}
          <Link
            href="/client/preview/messages"
            title={t.openChatTitle}
            className="font-semibold text-blue-700 underline-offset-2 hover:underline"
          >
            London Sparkle Cleaning Co.
          </Link>
          {t.helpLine2}
        </p>
      </section>

      <DemoToast show={toast != null} message={toast ?? ''} />
    </ClientShell>
  );
}
