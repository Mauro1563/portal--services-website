'use client';

import { useRef, useState, useTransition } from 'react';
import { Save, Upload, Loader2 } from 'lucide-react';
import { saveMarketingSection } from '@/app/hq/actions';
import { uploadLogo } from '@/app/hq/branding/upload';

type Branding = {
  accent: string;
  accent2: string;
  accentSoft: string;
  ink: string;
  bg: string;
  logoUrl: string;
};

const SWATCHES: { key: keyof Branding; label: string; hint: string }[] = [
  { key: 'accent', label: 'Acento principal', hint: 'Botones, enlaces, énfasis.' },
  { key: 'accent2', label: 'Acento secundario', hint: 'Cian / detalles en tiempo real.' },
  { key: 'accentSoft', label: 'Acento suave', hint: 'Fondos de íconos y chips.' },
  { key: 'ink', label: 'Tinta (texto)', hint: 'Títulos y texto principal.' },
  { key: 'bg', label: 'Fondo', hint: 'Lienzo del sitio.' },
];

const PRESETS: { name: string; accent: string; accent2: string; accentSoft: string }[] = [
  { name: 'Azul marca', accent: '#2563EB', accent2: '#06B6D4', accentSoft: '#EFF6FF' },
  { name: 'Cian', accent: '#06B6D4', accent2: '#2563EB', accentSoft: '#ECFEFF' },
  { name: 'Esmeralda', accent: '#059669', accent2: '#06B6D4', accentSoft: '#ECFDF5' },
  { name: 'Violeta', accent: '#7C3AED', accent2: '#06B6D4', accentSoft: '#F5F3FF' },
  { name: 'Naranja', accent: '#EA580C', accent2: '#F59E0B', accentSoft: '#FFF7ED' },
];

export function BrandingEditor({ initial }: { initial: Branding }) {
  const [data, setData] = useState<Branding>(initial);
  const [saving, startSaving] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof Branding, v: string) => setData({ ...data, [k]: v });

  async function handleLogoFile(file: File) {
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set('file', file);
      const url = await uploadLogo(fd);
      setData((d) => ({ ...d, logoUrl: url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="space-y-6 rounded-2xl bg-paper p-6 ring-1 ring-line">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Paletas rápidas</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setData({ ...data, accent: p.accent, accent2: p.accent2, accentSoft: p.accentSoft })}
                  className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium text-graphite-2 ring-1 ring-inset ring-line hover:bg-slate-50"
                >
                  <span className="flex">
                    <span className="h-4 w-4 rounded-l-full" style={{ background: p.accent }} />
                    <span className="h-4 w-4 rounded-r-full" style={{ background: p.accent2 }} />
                  </span>
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SWATCHES.map((s) => (
              <div key={s.key}>
                <span className="text-[11px] font-medium text-graphite-3">{s.label}</span>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={data[s.key]}
                    onChange={(e) => set(s.key, e.target.value)}
                    className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-line bg-white p-1"
                  />
                  <input
                    type="text"
                    value={data[s.key]}
                    onChange={(e) => set(s.key, e.target.value)}
                    className="h-10 w-full rounded-xl bg-white px-3 font-mono text-sm uppercase text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>
                <span className="mt-1 block text-[10px] text-graphite-4">{s.hint}</span>
              </div>
            ))}
          </div>

          <div className="block">
            <span className="text-[11px] font-medium text-graphite-3">Logo</span>
            <div className="mt-1 flex items-stretch gap-2">
              <input
                type="text"
                value={data.logoUrl}
                onChange={(e) => set('logoUrl', e.target.value)}
                placeholder="/mi-logo.png o https://…"
                className="h-10 w-full rounded-xl bg-white px-3 text-sm text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? 'Subiendo…' : 'Subir'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleLogoFile(f);
                  e.target.value = '';
                }}
              />
            </div>
            {uploadError && (
              <span className="mt-1 block text-[10px] text-rose-600">{uploadError}</span>
            )}
            <span className="mt-1 block text-[10px] text-graphite-4">
              PNG, JPG, SVG o WebP (máx 2 MB). Se guarda automáticamente al subir; pulsa &quot;Guardar branding&quot; para publicarlo.
            </span>
          </div>
        </section>

        {/* Live preview */}
        <section className="rounded-2xl p-6 ring-1 ring-line" style={{ background: data.bg }}>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Vista previa</p>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.logoUrl} alt="logo" style={{ height: 40, width: 'auto' }} onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
            <h3 className="mt-4 text-2xl font-semibold tracking-tight" style={{ color: data.ink }}>
              Una plataforma. Un lugar.
            </h3>
            <p className="mt-2 text-sm" style={{ color: '#64748B' }}>
              Controla equipos, edificios y calidad desde un solo lugar.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-white" style={{ background: data.accent }}>
                Solicitar demo
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: data.accentSoft, color: data.accent }}>
                ★
              </span>
              <span className="text-sm font-medium" style={{ color: data.accent2 }}>● LIVE</span>
            </div>
          </div>
        </section>
      </div>

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl bg-paper px-5 py-3 ring-1 ring-line shadow-[0_10px_40px_-20px_rgba(15,23,42,0.18)]">
        <p className="text-xs text-graphite-3">
          {savedAt
            ? `Guardado a las ${savedAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}. Recarga el sitio para verlo.`
            : 'Los colores y el logo se aplican al sitio público al guardar.'}
        </p>
        <button
          type="button"
          onClick={() => startSaving(async () => { await saveMarketingSection('branding', data); setSavedAt(new Date()); })}
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? 'Guardando…' : 'Guardar branding'}
        </button>
      </div>
    </div>
  );
}
