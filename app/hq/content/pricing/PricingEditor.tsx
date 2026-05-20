'use client';

import { useState, useTransition } from 'react';
import { Plus, Save, Trash2, Star } from 'lucide-react';

type Tier = {
  name: string;
  range: string;
  price: string;
  period: string;
  cta: string;
  features: string[];
  featured?: boolean;
};

type Addon = {
  name: string;
  desc: string;
  price: string;
};

export type PricingContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  trial_note: string;
  footnote: string;
  popular: string;
  corporate_eyebrow: string;
  corporate: Tier[];
  addons: Addon[];
  home_eyebrow: string;
  home: Tier[];
  home_enterprise: {
    name: string;
    range: string;
    price: string;
    period: string;
    cta: string;
  };
};

export function PricingEditor({
  initial,
  saveAction,
}: {
  initial: PricingContent;
  saveAction: (content: PricingContent) => Promise<void>;
}) {
  const [data, setData] = useState<PricingContent>(initial);
  const [saving, startSaving] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  function updateTier(
    line: 'corporate' | 'home',
    index: number,
    patch: Partial<Tier>,
  ) {
    setData((d) => ({
      ...d,
      [line]: d[line].map((t, i) => (i === index ? { ...t, ...patch } : t)),
    }));
  }

  function setFeaturedExclusive(
    line: 'corporate' | 'home',
    index: number,
  ) {
    setData((d) => ({
      ...d,
      [line]: d[line].map((t, i) => ({ ...t, featured: i === index })),
    }));
  }

  function addFeature(line: 'corporate' | 'home', tierIdx: number) {
    setData((d) => ({
      ...d,
      [line]: d[line].map((t, i) =>
        i === tierIdx ? { ...t, features: [...t.features, ''] } : t,
      ),
    }));
  }

  function removeFeature(
    line: 'corporate' | 'home',
    tierIdx: number,
    fIdx: number,
  ) {
    setData((d) => ({
      ...d,
      [line]: d[line].map((t, i) =>
        i === tierIdx
          ? { ...t, features: t.features.filter((_, j) => j !== fIdx) }
          : t,
      ),
    }));
  }

  function updateFeature(
    line: 'corporate' | 'home',
    tierIdx: number,
    fIdx: number,
    value: string,
  ) {
    setData((d) => ({
      ...d,
      [line]: d[line].map((t, i) =>
        i === tierIdx
          ? {
              ...t,
              features: t.features.map((f, j) => (j === fIdx ? value : f)),
            }
          : t,
      ),
    }));
  }

  function updateAddon(idx: number, patch: Partial<Addon>) {
    setData((d) => ({
      ...d,
      addons: d.addons.map((a, i) => (i === idx ? { ...a, ...patch } : a)),
    }));
  }

  function save() {
    startSaving(async () => {
      await saveAction(data);
      setSavedAt(new Date());
    });
  }

  return (
    <div className="space-y-10">
      {/* Header / intro copy */}
      <Section title="Encabezado de la sección">
        <Grid>
          <Field
            label="Eyebrow"
            value={data.eyebrow}
            onChange={(v) => setData({ ...data, eyebrow: v })}
          />
          <Field
            label="Título"
            value={data.title}
            onChange={(v) => setData({ ...data, title: v })}
          />
          <Field
            label="Subtítulo"
            value={data.subtitle}
            onChange={(v) => setData({ ...data, subtitle: v })}
            multiline
            span={2}
          />
          <Field
            label="Nota de prueba gratuita"
            value={data.trial_note}
            onChange={(v) => setData({ ...data, trial_note: v })}
          />
          <Field
            label="Etiqueta de plan popular"
            value={data.popular}
            onChange={(v) => setData({ ...data, popular: v })}
          />
          <Field
            label="Nota al pie de la sección"
            value={data.footnote}
            onChange={(v) => setData({ ...data, footnote: v })}
            multiline
            span={2}
          />
        </Grid>
      </Section>

      {/* Corporate line */}
      <Section
        title="Línea Corporativo"
        subtitle="3 planes + add-ons. Marca un plan como destacado para resaltarlo."
      >
        <Field
          label="Eyebrow de la línea corporativa"
          value={data.corporate_eyebrow}
          onChange={(v) => setData({ ...data, corporate_eyebrow: v })}
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {data.corporate.map((tier, i) => (
            <TierCard
              key={i}
              tier={tier}
              onChange={(p) => updateTier('corporate', i, p)}
              onFeaturedClick={() => setFeaturedExclusive('corporate', i)}
              onAddFeature={() => addFeature('corporate', i)}
              onRemoveFeature={(fIdx) => removeFeature('corporate', i, fIdx)}
              onUpdateFeature={(fIdx, v) =>
                updateFeature('corporate', i, fIdx, v)
              }
            />
          ))}
        </div>

        {/* Add-ons */}
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Add-ons
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {data.addons.map((a, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3"
              >
                <Grid cols={2}>
                  <Field
                    label="Nombre"
                    value={a.name}
                    onChange={(v) => updateAddon(i, { name: v })}
                  />
                  <Field
                    label="Precio"
                    value={a.price}
                    onChange={(v) => updateAddon(i, { price: v })}
                  />
                  <Field
                    label="Descripción"
                    value={a.desc}
                    onChange={(v) => updateAddon(i, { desc: v })}
                    span={2}
                  />
                </Grid>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Home line */}
      <Section
        title="Línea Limpiezas de Hogar"
        subtitle="3 planes principales + un plan Enterprise resumido."
      >
        <Field
          label="Eyebrow de la línea de hogar"
          value={data.home_eyebrow}
          onChange={(v) => setData({ ...data, home_eyebrow: v })}
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {data.home.map((tier, i) => (
            <TierCard
              key={i}
              tier={tier}
              onChange={(p) => updateTier('home', i, p)}
              onFeaturedClick={() => setFeaturedExclusive('home', i)}
              onAddFeature={() => addFeature('home', i)}
              onRemoveFeature={(fIdx) => removeFeature('home', i, fIdx)}
              onUpdateFeature={(fIdx, v) =>
                updateFeature('home', i, fIdx, v)
              }
              accent="emerald"
            />
          ))}
        </div>

        {/* Home enterprise */}
        <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.03] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Plan Enterprise (línea de hogar)
          </p>
          <div className="mt-3">
            <Grid cols={2}>
              <Field
                label="Nombre"
                value={data.home_enterprise.name}
                onChange={(v) =>
                  setData({
                    ...data,
                    home_enterprise: { ...data.home_enterprise, name: v },
                  })
                }
              />
              <Field
                label="Rango"
                value={data.home_enterprise.range}
                onChange={(v) =>
                  setData({
                    ...data,
                    home_enterprise: { ...data.home_enterprise, range: v },
                  })
                }
              />
              <Field
                label="Precio"
                value={data.home_enterprise.price}
                onChange={(v) =>
                  setData({
                    ...data,
                    home_enterprise: { ...data.home_enterprise, price: v },
                  })
                }
              />
              <Field
                label="Período"
                value={data.home_enterprise.period}
                onChange={(v) =>
                  setData({
                    ...data,
                    home_enterprise: { ...data.home_enterprise, period: v },
                  })
                }
              />
              <Field
                label="Texto del botón"
                value={data.home_enterprise.cta}
                onChange={(v) =>
                  setData({
                    ...data,
                    home_enterprise: { ...data.home_enterprise, cta: v },
                  })
                }
                span={2}
              />
            </Grid>
          </div>
        </div>
      </Section>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-ink-0/85 px-5 py-3 backdrop-blur-xl">
        <p className="text-xs text-slate-400">
          {savedAt
            ? `Guardado a las ${savedAt.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}.`
            : 'Los cambios se guardan en Supabase y aparecen al instante en el sitio.'}
        </p>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_30px_-10px_rgba(56,189,248,0.6)] transition hover:brightness-110 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}

// ───────────────────── helpers ─────────────────────

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <header className="mb-5">
        <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function Grid({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: 2 | 3;
}) {
  return (
    <div
      className={`grid gap-4 ${
        cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
      }`}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
  span,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  span?: number;
}) {
  const className =
    'block w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20';
  return (
    <label className={`block ${span === 2 ? 'sm:col-span-2' : ''}`}>
      <span className="text-[11px] font-medium text-slate-400">{label}</span>
      {multiline ? (
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`mt-1 ${className}`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`mt-1 h-10 ${className}`}
        />
      )}
    </label>
  );
}

function TierCard({
  tier,
  onChange,
  onFeaturedClick,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  accent = 'brand',
}: {
  tier: Tier;
  onChange: (p: Partial<Tier>) => void;
  onFeaturedClick: () => void;
  onAddFeature: () => void;
  onRemoveFeature: (i: number) => void;
  onUpdateFeature: (i: number, v: string) => void;
  accent?: 'brand' | 'emerald';
}) {
  const ring =
    accent === 'emerald'
      ? 'ring-emerald-400/30'
      : 'ring-cyan-400/30';
  const featuredStyles = tier.featured
    ? `ring-2 ${ring}`
    : 'ring-1 ring-inset ring-white/[0.06]';
  return (
    <div
      className={`relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 ${featuredStyles}`}
    >
      <button
        type="button"
        onClick={onFeaturedClick}
        className={`absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition ${
          tier.featured
            ? accent === 'emerald'
              ? 'bg-emerald-500 text-white'
              : 'bg-cyan-500 text-white'
            : 'bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white'
        }`}
        title="Marcar este plan como destacado"
      >
        <Star className="h-3 w-3" /> {tier.featured ? 'Destacado' : 'Destacar'}
      </button>

      <Grid cols={2}>
        <Field
          label="Nombre"
          value={tier.name}
          onChange={(v) => onChange({ name: v })}
        />
        <Field
          label="Rango"
          value={tier.range}
          onChange={(v) => onChange({ range: v })}
        />
        <Field
          label="Precio"
          value={tier.price}
          onChange={(v) => onChange({ price: v })}
        />
        <Field
          label="Período"
          value={tier.period}
          onChange={(v) => onChange({ period: v })}
        />
        <Field
          label="Texto del botón"
          value={tier.cta}
          onChange={(v) => onChange({ cta: v })}
          span={2}
        />
      </Grid>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Features
          </p>
          <button
            type="button"
            onClick={onAddFeature}
            className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[11px] text-slate-200 hover:bg-white/[0.12]"
          >
            <Plus className="h-3 w-3" /> Añadir
          </button>
        </div>
        <ul className="mt-2 space-y-2">
          {tier.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                value={f}
                onChange={(e) => onUpdateFeature(i, e.target.value)}
                className="h-9 flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
              <button
                type="button"
                onClick={() => onRemoveFeature(i)}
                aria-label="Eliminar"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
