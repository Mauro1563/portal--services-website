'use client';

import { useRef, useState, useTransition } from 'react';
import { Palette, RotateCcw, Save, Upload } from 'lucide-react';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { resetBranding, saveColors, uploadLogo } from './actions';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: { saving: 'Saving…' },
  es: { saving: 'Guardando…' },
  pt: { saving: 'A guardar…' },
} as const;

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const DEFAULT_PRIMARY = '#22d3ee';
const DEFAULT_SECONDARY = '#2563eb';

type Props = {
  initialLogoUrl: string | null;
  initialPrimary: string;
  initialSecondary: string;
  businessName: string;
};

/**
 * Branding form with split server actions:
 *  - logo uploads use a native form post (file streams cleanly to the server
 *    action via FormData; we don't try to recreate a multipart body by hand)
 *  - color edits go through useOptimistic + a server action so the live
 *    preview updates the instant the user moves a swatch, even before the
 *    DB round-trip completes.
 */
export function BrandingForm({
  initialLogoUrl,
  initialPrimary,
  initialSecondary,
  businessName,
}: Props) {
  const t = pickCopy(COPY, useClientLocale());
  const [savedPrimary, setSavedPrimary] = useState(initialPrimary);
  const [savedSecondary, setSavedSecondary] = useState(initialSecondary);
  const [primary, setPrimary] = useOptimisticHex(savedPrimary);
  const [secondary, setSecondary] = useOptimisticHex(savedSecondary);
  const [isPending, startTransition] = useTransition();
  const [logoPreview, setLogoPreview] = useState<string | null>(initialLogoUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const logoFormRef = useRef<HTMLFormElement>(null);

  const colorsDirty =
    primary.toLowerCase() !== savedPrimary.toLowerCase() ||
    secondary.toLowerCase() !== savedSecondary.toLowerCase();

  function onSaveColors() {
    if (!HEX.test(primary) || !HEX.test(secondary)) return;
    const fd = new FormData();
    fd.set('primary', primary);
    fd.set('secondary', secondary);
    // Commit the new values into the "saved" state immediately so the
    // dirty indicator clears and the user gets instant feedback. If the
    // server action redirects with an error the page reload will
    // overwrite this state with what the DB actually has.
    setSavedPrimary(primary);
    setSavedSecondary(secondary);
    startTransition(() => {
      void saveColors(fd);
    });
  }

  function onReset() {
    setPrimary(DEFAULT_PRIMARY);
    setSecondary(DEFAULT_SECONDARY);
    setSavedPrimary(DEFAULT_PRIMARY);
    setSavedSecondary(DEFAULT_SECONDARY);
    startTransition(() => {
      void resetBranding();
    });
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show local preview immediately; the form below submits to the server
    // action which persists the file to storage + DB.
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      {/* Edit column */}
      <div className="space-y-6">
        {/* Logo */}
        <section className="rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
          <header className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-1">
              <Upload className="h-5 w-5 text-brand-600" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold text-text-1">
                Logo
              </h2>
              <p className="text-[11px] text-text-2">
                PNG o SVG · máx. 1 MB · cuadrado recomendado.
              </p>
            </div>
          </header>

          <form
            ref={logoFormRef}
            action={uploadLogo}
            encType="multipart/form-data"
            className="mt-4 flex flex-wrap items-center gap-4"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-surface-2 bg-surface-1">
              {logoPreview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <Palette className="h-6 w-6 text-text-3" />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1">
                <Upload className="h-4 w-4" />
                Elegir imagen
                <input
                  ref={fileRef}
                  type="file"
                  name="logo"
                  accept="image/png,image/svg+xml"
                  className="hidden"
                  onChange={onFileChange}
                />
              </label>
              <SubmitButton
                pendingLabel="Subiendo…"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand-glow disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                Subir logo
              </SubmitButton>
            </div>
          </form>
        </section>

        {/* Colors */}
        <section className="rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
          <header className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-1">
              <Palette className="h-5 w-5 text-brand-600" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold text-text-1">
                Colores de marca
              </h2>
              <p className="text-[11px] text-text-2">
                Se aplican al portal que ven tus clientes.
              </p>
            </div>
          </header>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ColorField
              label="Color primario"
              value={primary}
              onChange={setPrimary}
            />
            <ColorField
              label="Color secundario"
              value={secondary}
              onChange={setSecondary}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onSaveColors}
              disabled={!colorsDirty || isPending}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand-glow disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={onReset}
              disabled={isPending}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Restaurar default
            </button>
            {isPending ? (
              <span className="text-[11px] text-text-3">{t.saving}</span>
            ) : null}
          </div>
        </section>
      </div>

      {/* Preview column */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-3">
          Vista previa del portal del cliente
        </p>
        <ClientPortalPreview
          logoUrl={logoPreview}
          primary={HEX.test(primary) ? primary : DEFAULT_PRIMARY}
          secondary={HEX.test(secondary) ? secondary : DEFAULT_SECONDARY}
          businessName={businessName}
        />
      </aside>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const valid = HEX.test(value);
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-2">{label}</span>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="color"
          value={valid ? normaliseHex(value) : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-surface-2 bg-surface-0 p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          maxLength={7}
          spellCheck={false}
          autoCapitalize="none"
          className="block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2 font-mono text-sm uppercase tracking-wider text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          placeholder="#22D3EE"
        />
      </div>
      {!valid ? (
        <p className="mt-1 text-[11px] text-rose-600">
          Hex no válido. Usa #RGB o #RRGGBB.
        </p>
      ) : null}
    </label>
  );
}

// Mini client-portal mock so the owner can see logo + colors in context.
function ClientPortalPreview({
  logoUrl,
  primary,
  secondary,
  businessName,
}: {
  logoUrl: string | null;
  primary: string;
  secondary: string;
  businessName: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-surface-2 bg-surface-0 shadow-card-lg">
      {/* Phone bezel */}
      <div className="bg-slate-100 p-3">
        <div className="overflow-hidden rounded-2xl bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            {logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logoUrl}
                alt={businessName}
                className="h-6 w-auto max-w-[140px] object-contain"
              />
            ) : (
              <span
                className="text-sm font-semibold"
                style={{ color: secondary }}
              >
                {businessName}
              </span>
            )}
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: primary }}
            />
          </div>

          {/* Hero card with gradient using both colors */}
          <div className="p-4">
            <div
              className="rounded-2xl p-4 text-white"
              style={{
                background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
              }}
            >
              <p className="text-[11px] uppercase tracking-wider opacity-80">
                Próxima limpieza
              </p>
              <p className="mt-1 font-display text-lg font-semibold">
                Viernes · 10:00
              </p>
              <p className="text-xs opacity-90">Apartamento centro</p>
            </div>

            {/* Service tiles */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-200 p-3">
                <span
                  className="inline-block h-6 w-6 rounded-lg"
                  style={{ background: primary }}
                />
                <p className="mt-2 text-[11px] font-medium text-slate-900">
                  Regular
                </p>
                <p className="text-[10px] text-slate-500">$45</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <span
                  className="inline-block h-6 w-6 rounded-lg"
                  style={{ background: secondary }}
                />
                <p className="mt-2 text-[11px] font-medium text-slate-900">
                  Profunda
                </p>
                <p className="text-[10px] text-slate-500">$95</p>
              </div>
            </div>

            {/* Primary button */}
            <button
              type="button"
              className="mt-3 h-10 w-full rounded-xl text-sm font-semibold text-white"
              style={{ background: primary }}
              tabIndex={-1}
            >
              Reservar
            </button>
            <button
              type="button"
              className="mt-2 h-10 w-full rounded-xl border text-sm font-semibold"
              style={{ color: secondary, borderColor: secondary }}
              tabIndex={-1}
            >
              Ver historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// useState wrapped so the input value can be set freely while still typing
// (we don't validate on every keystroke — only at save time).
function useOptimisticHex(initial: string): [string, (v: string) => void] {
  const [value, setValue] = useState(initial);
  return [value, setValue];
}

function normaliseHex(v: string): string {
  // <input type="color"> requires #rrggbb (not #rgb shorthand).
  const c = v.replace('#', '');
  if (c.length === 3) {
    return (
      '#' +
      c
        .split('')
        .map((x) => x + x)
        .join('')
    );
  }
  return v;
}
