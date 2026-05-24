'use client';

import { useState, useTransition } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { saveSitePatch } from '@/app/hq/actions';

type Hero = Record<string, string>;
type Plan = {
  name: string;
  scope: string;
  price: string;
  features: string[];
  cta: string;
  featured?: boolean;
  from?: boolean;
};
type Pricing = {
  eyebrow: string;
  title_a: string;
  title_b: string;
  sub: string;
  trial: string;
  toggle_corp: string;
  toggle_home: string;
  footer_note: string;
  popular: string;
  month: string;
  from: string;
  corp_plans: Plan[];
  home_plans: Plan[];
  addons: { name: string; desc: string; price: string }[];
};
type SiteData = { hero: Hero; pricing: Pricing };
type ByLocale = Record<string, SiteData>;

const LOCALES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
];

const HERO_FIELDS: { key: string; label: string; full?: boolean }[] = [
  { key: 'eyebrow', label: 'Eyebrow', full: true },
  { key: 'title_a', label: 'Título línea 1' },
  { key: 'title_b', label: 'Título línea 2 (cursiva)' },
  { key: 'title_c', label: 'Título línea 3' },
  { key: 'sub', label: 'Subtítulo', full: true },
  { key: 'cta_primary', label: 'Botón primario' },
  { key: 'cta_secondary', label: 'Botón secundario' },
  { key: 'trust_a', label: 'Confianza 1' },
  { key: 'trust_b', label: 'Confianza 2' },
  { key: 'trust_c', label: 'Confianza 3' },
  { key: 'stat_portals', label: 'Stat — portales' },
  { key: 'stat_uptime', label: 'Stat — uptime' },
  { key: 'stat_trial', label: 'Stat — prueba' },
  { key: 'stat_lang', label: 'Stat — idiomas' },
];

const PRICING_TEXT_FIELDS: { key: keyof Pricing; label: string; full?: boolean }[] = [
  { key: 'eyebrow', label: 'Eyebrow' },
  { key: 'popular', label: 'Etiqueta "más popular"' },
  { key: 'title_a', label: 'Título línea 1' },
  { key: 'title_b', label: 'Título línea 2 (cursiva)' },
  { key: 'sub', label: 'Subtítulo', full: true },
  { key: 'trial', label: 'Nota de prueba', full: true },
  { key: 'toggle_corp', label: 'Toggle — corporativo' },
  { key: 'toggle_home', label: 'Toggle — hogar' },
  { key: 'month', label: 'Sufijo precio (/mes)' },
  { key: 'from', label: 'Prefijo "desde"' },
  { key: 'footer_note', label: 'Nota al pie', full: true },
];

const input = 'mt-1 h-10 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40';
const area = 'mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40';

function PlanList({
  title,
  plans,
  onChange,
}: {
  title: string;
  plans: Plan[];
  onChange: (next: Plan[]) => void;
}) {
  const set = (i: number, key: keyof Plan, value: unknown) =>
    onChange(plans.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)));
  const add = () =>
    onChange([...plans, { name: 'Nuevo plan', scope: '', price: '£0', features: [], cta: 'Empezar' }]);
  const remove = (i: number) => onChange(plans.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-graphite-1">{title}</h4>
        <button onClick={add} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-brand-600 ring-1 ring-inset ring-line hover:bg-slate-50">
          <Plus className="h-3.5 w-3.5" /> Plan
        </button>
      </div>
      {plans.map((p, i) => (
        <div key={i} className="rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-line">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block"><span className="text-[11px] text-graphite-3">Nombre</span><input value={p.name} onChange={(e) => set(i, 'name', e.target.value)} className={input} /></label>
            <label className="block"><span className="text-[11px] text-graphite-3">Precio</span><input value={p.price} onChange={(e) => set(i, 'price', e.target.value)} className={input} /></label>
            <label className="block"><span className="text-[11px] text-graphite-3">Texto botón</span><input value={p.cta} onChange={(e) => set(i, 'cta', e.target.value)} className={input} /></label>
            <label className="block sm:col-span-3"><span className="text-[11px] text-graphite-3">Alcance</span><input value={p.scope} onChange={(e) => set(i, 'scope', e.target.value)} className={input} /></label>
            <label className="block sm:col-span-3"><span className="text-[11px] text-graphite-3">Funciones (una por línea)</span><textarea rows={4} value={(p.features ?? []).join('\n')} onChange={(e) => set(i, 'features', e.target.value.split('\n').filter((x) => x.trim()))} className={area} /></label>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-graphite-2">
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!p.featured} onChange={(e) => set(i, 'featured', e.target.checked)} /> Destacado</label>
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!p.from} onChange={(e) => set(i, 'from', e.target.checked)} /> Mostrar "desde"</label>
            </div>
            <button onClick={() => remove(i)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-graphite-3 hover:bg-rose-50 hover:text-rose-600">
              <Trash2 className="h-3.5 w-3.5" /> Quitar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SiteEditor({ initial }: { initial: ByLocale }) {
  const [data, setData] = useState<ByLocale>(initial);
  const [locale, setLocale] = useState('es');
  const [saving, startSaving] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const d = data[locale];
  const setHero = (k: string, v: string) => setData({ ...data, [locale]: { ...d, hero: { ...d.hero, [k]: v } } });
  const setPricing = (k: keyof Pricing, v: unknown) => setData({ ...data, [locale]: { ...d, pricing: { ...d.pricing, [k]: v } } });

  const save = () =>
    startSaving(async () => {
      await saveSitePatch(locale, { hero: d.hero, pricing: d.pricing });
      setSavedAt(new Date());
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          {LOCALES.map((l) => (
            <button key={l.code} onClick={() => setLocale(l.code)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${locale === l.code ? 'bg-white text-graphite-1 shadow-sm' : 'text-graphite-3 hover:text-graphite-1'}`}>
              {l.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-graphite-3">
          {savedAt ? `Guardado (${locale.toUpperCase()}) a las ${savedAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}.` : `Editando ${locale.toUpperCase()}.`}
        </p>
      </div>

      <section className="rounded-2xl bg-paper p-6 ring-1 ring-line">
        <h3 className="mb-4 font-display text-base font-semibold text-graphite-1">Hero</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {HERO_FIELDS.map((f) => (
            <label key={f.key} className={`block ${f.full ? 'sm:col-span-2' : ''}`}>
              <span className="text-[11px] font-medium text-graphite-3">{f.label}</span>
              {f.full ? (
                <textarea rows={2} value={d.hero[f.key] ?? ''} onChange={(e) => setHero(f.key, e.target.value)} className={area} />
              ) : (
                <input value={d.hero[f.key] ?? ''} onChange={(e) => setHero(f.key, e.target.value)} className={input} />
              )}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-paper p-6 ring-1 ring-line">
        <h3 className="mb-4 font-display text-base font-semibold text-graphite-1">Precios — textos</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {PRICING_TEXT_FIELDS.map((f) => (
            <label key={f.key} className={`block ${f.full ? 'sm:col-span-2' : ''}`}>
              <span className="text-[11px] font-medium text-graphite-3">{f.label}</span>
              {f.full ? (
                <textarea rows={2} value={String(d.pricing[f.key] ?? '')} onChange={(e) => setPricing(f.key, e.target.value)} className={area} />
              ) : (
                <input value={String(d.pricing[f.key] ?? '')} onChange={(e) => setPricing(f.key, e.target.value)} className={input} />
              )}
            </label>
          ))}
        </div>

        <div className="mt-6 space-y-6">
          <PlanList title="Planes corporativos" plans={d.pricing.corp_plans ?? []} onChange={(next) => setPricing('corp_plans', next)} />
          <PlanList title="Planes limpiezas de hogar" plans={d.pricing.home_plans ?? []} onChange={(next) => setPricing('home_plans', next)} />
        </div>
      </section>

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl bg-paper px-5 py-3 ring-1 ring-line shadow-[0_10px_40px_-20px_rgba(15,23,42,0.18)]">
        <p className="text-xs text-graphite-3">Guarda cada idioma por separado. Aparece en vivo al recargar el sitio.</p>
        <button onClick={save} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? 'Guardando…' : `Guardar ${locale.toUpperCase()}`}
        </button>
      </div>
    </div>
  );
}
