/**
 * Public preview: Owner → Branding tool. Mocked state.
 * Mirrors /owner/branding but with no Supabase / no server actions —
 * everything lives in local useState so the demo round-trips instantly
 * and resets on reload.
 */
'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Info,
  Palette,
  RotateCcw,
  Save,
  Upload,
} from 'lucide-react';
import { DemoBottomTabBar } from '../_components/DemoBottomTabBar';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: {
    dashboard: 'Dashboard',
    demoLabel: 'Demo · Branding',
    demoBanner: 'Demo · Changes are not saved on reload',
    branding: 'Branding',
    brandingSubtitle: 'Customise the name, logo and colours of the portal your clients see.',
    businessName: 'Business name',
    businessNameHint: 'Appears in the header of each client’s portal.',
    logo: 'Logo',
    logoHint: 'PNG or SVG · max 1 MB · square recommended.',
    chooseImage: 'Choose image',
    removeLogo: 'Remove logo',
    brandColours: 'Brand colours',
    brandColoursHint: 'Applied to the portal your clients see.',
    primary: 'Primary colour',
    secondary: 'Secondary colour',
    save: 'Save',
    restoreDefault: 'Restore default',
    portalPreview: 'Client portal preview',
    saved: 'Saved',
    invalidHex: 'Invalid hex. Use #RGB or #RRGGBB.',
    nextClean: 'Next clean',
    fridayTime: 'Friday · 10:00',
    centreApartment: 'Centre apartment',
    regular: 'Regular',
    deep: 'Deep',
    book: 'Book',
    seeHistory: 'See history',
  },
  es: {
    dashboard: 'Dashboard',
    demoLabel: 'Demo · Branding',
    demoBanner: 'Demo · Los cambios no se guardan al recargar',
    branding: 'Branding',
    brandingSubtitle: 'Personaliza nombre, logo y colores del portal que ven tus clientes.',
    businessName: 'Nombre del negocio',
    businessNameHint: 'Aparece en la cabecera del portal de cada cliente.',
    logo: 'Logo',
    logoHint: 'PNG o SVG · máx. 1 MB · cuadrado recomendado.',
    chooseImage: 'Elegir imagen',
    removeLogo: 'Quitar logo',
    brandColours: 'Colores de marca',
    brandColoursHint: 'Se aplican al portal que ven tus clientes.',
    primary: 'Color primario',
    secondary: 'Color secundario',
    save: 'Guardar',
    restoreDefault: 'Restaurar default',
    portalPreview: 'Vista previa del portal del cliente',
    saved: 'Guardado',
    invalidHex: 'Hex no válido. Usa #RGB o #RRGGBB.',
    nextClean: 'Próxima limpieza',
    fridayTime: 'Viernes · 10:00',
    centreApartment: 'Apartamento centro',
    regular: 'Regular',
    deep: 'Profunda',
    book: 'Reservar',
    seeHistory: 'Ver historial',
  },
  pt: {
    dashboard: 'Dashboard',
    demoLabel: 'Demo · Branding',
    demoBanner: 'Demo · As alterações não são guardadas ao recarregar',
    branding: 'Branding',
    brandingSubtitle: 'Personaliza nome, logótipo e cores do portal que os teus clientes vêem.',
    businessName: 'Nome do negócio',
    businessNameHint: 'Aparece no cabeçalho do portal de cada cliente.',
    logo: 'Logótipo',
    logoHint: 'PNG ou SVG · máx. 1 MB · quadrado recomendado.',
    chooseImage: 'Escolher imagem',
    removeLogo: 'Remover logótipo',
    brandColours: 'Cores da marca',
    brandColoursHint: 'Aplicam-se ao portal que os teus clientes vêem.',
    primary: 'Cor primária',
    secondary: 'Cor secundária',
    save: 'Guardar',
    restoreDefault: 'Repor predefinição',
    portalPreview: 'Pré-visualização do portal do cliente',
    saved: 'Guardado',
    invalidHex: 'Hex inválido. Usa #RGB ou #RRGGBB.',
    nextClean: 'Próxima limpeza',
    fridayTime: 'Sexta-feira · 10:00',
    centreApartment: 'Apartamento centro',
    regular: 'Regular',
    deep: 'Profunda',
    book: 'Reservar',
    seeHistory: 'Ver histórico',
  },
} as const;

type BrandingCopy = (typeof COPY)['en'];

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const DEFAULT_BUSINESS_NAME = 'Alan Cleaners';
const DEFAULT_PRIMARY = '#22d3ee';
const DEFAULT_SECONDARY = '#2563eb';

export default function BrandingPreviewPage() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const [businessName, setBusinessName] = useState<string>(DEFAULT_BUSINESS_NAME);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primary, setPrimary] = useState<string>(DEFAULT_PRIMARY);
  const [secondary, setSecondary] = useState<string>(DEFAULT_SECONDARY);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function onSave() {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setSavedAt(Date.now());
    toastTimer.current = setTimeout(() => setSavedAt(null), 1500);
  }

  function onReset() {
    setBusinessName(DEFAULT_BUSINESS_NAME);
    setLogoUrl(null);
    setPrimary(DEFAULT_PRIMARY);
    setSecondary(DEFAULT_SECONDARY);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5">
          <Link
            href="/owner/preview"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> {t.dashboard}
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {t.demoLabel}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-6">
        {/* Demo banner */}
        <div
          role="status"
          className="mb-5 inline-flex w-full items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] font-medium text-amber-900"
        >
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>
            <span aria-hidden>🎨 </span>
            {t.demoBanner}
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {t.branding}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {t.brandingSubtitle}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Edit column */}
          <div className="space-y-6">
            {/* Business name */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <header className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Palette className="h-5 w-5 text-blue-600" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {t.businessName}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {t.businessNameHint}
                  </p>
                </div>
              </header>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Alan Cleaners"
                className="mt-4 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </section>

            {/* Logo */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <header className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Upload className="h-5 w-5 text-blue-600" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {t.logo}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {t.logoHint}
                  </p>
                </div>
              </header>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                  {logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="h-16 w-16 object-contain"
                    />
                  ) : (
                    <Palette className="h-6 w-6 text-slate-300" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50">
                    <Upload className="h-4 w-4" />
                    {t.chooseImage}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/svg+xml,image/jpeg"
                      className="hidden"
                      onChange={onFileChange}
                    />
                  </label>
                  {logoUrl ? (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoUrl(null);
                        if (fileRef.current) fileRef.current.value = '';
                      }}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      {t.removeLogo}
                    </button>
                  ) : null}
                </div>
              </div>
            </section>

            {/* Colors */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <header className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Palette className="h-5 w-5 text-blue-600" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {t.brandColours}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {t.brandColoursHint}
                  </p>
                </div>
              </header>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ColorField
                  label={t.primary}
                  invalidHex={t.invalidHex}
                  value={primary}
                  onChange={setPrimary}
                />
                <ColorField
                  label={t.secondary}
                  invalidHex={t.invalidHex}
                  value={secondary}
                  onChange={setSecondary}
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onSave}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  {t.save}
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t.restoreDefault}
                </button>
              </div>
            </section>
          </div>

          {/* Preview column */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {t.portalPreview}
            </p>
            <ClientPortalPreview
              logoUrl={logoUrl}
              primary={HEX.test(primary) ? primary : DEFAULT_PRIMARY}
              secondary={HEX.test(secondary) ? secondary : DEFAULT_SECONDARY}
              businessName={businessName || DEFAULT_BUSINESS_NAME}
              t={t}
            />
          </aside>
        </div>
      </div>

      {/* Toast */}
      {savedAt !== null ? (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4"
        >
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            <CheckCircle2 className="h-4 w-4" />
            {t.saved}
          </div>
        </div>
      ) : null}

      <DemoBottomTabBar active="more" />
    </main>
  );
}

function ColorField({
  label,
  value,
  onChange,
  invalidHex,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  invalidHex: string;
}) {
  const valid = HEX.test(value);
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="color"
          value={valid ? normaliseHex(value) : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          maxLength={7}
          spellCheck={false}
          autoCapitalize="none"
          className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-mono text-sm uppercase tracking-wider text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="#22D3EE"
        />
      </div>
      {!valid ? (
        <p className="mt-1 text-[11px] text-rose-600">
          {invalidHex}
        </p>
      ) : null}
    </label>
  );
}

function ClientPortalPreview({
  logoUrl,
  primary,
  secondary,
  businessName,
  t,
}: {
  logoUrl: string | null;
  primary: string;
  secondary: string;
  businessName: string;
  t: BrandingCopy;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
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
                {t.nextClean}
              </p>
              <p className="mt-1 text-lg font-semibold">{t.fridayTime}</p>
              <p className="text-xs opacity-90">{t.centreApartment}</p>
            </div>

            {/* Service tiles */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-200 p-3">
                <span
                  className="inline-block h-6 w-6 rounded-lg"
                  style={{ background: primary }}
                />
                <p className="mt-2 text-[11px] font-medium text-slate-900">
                  {t.regular}
                </p>
                <p className="text-[10px] text-slate-500">$45</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <span
                  className="inline-block h-6 w-6 rounded-lg"
                  style={{ background: secondary }}
                />
                <p className="mt-2 text-[11px] font-medium text-slate-900">
                  {t.deep}
                </p>
                <p className="text-[10px] text-slate-500">$95</p>
              </div>
            </div>

            {/* Buttons */}
            <button
              type="button"
              className="mt-3 h-10 w-full rounded-xl text-sm font-semibold text-white"
              style={{ background: primary }}
              tabIndex={-1}
            >
              {t.book}
            </button>
            <button
              type="button"
              className="mt-2 h-10 w-full rounded-xl border text-sm font-semibold"
              style={{ color: secondary, borderColor: secondary }}
              tabIndex={-1}
            >
              {t.seeHistory}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
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
