'use client';

import { useState, useTransition } from 'react';
import { Save } from 'lucide-react';
import { saveSitePatch } from '@/app/hq/actions';

export type Portal = {
  name: string;
  sub: string;
  title: string;
  tag: string;
  for: string;
  features: string[];
};

type Lists = Record<string, Portal[]>;
const LOCALES: { code: string; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
];

export function PortalsEditor({ initial }: { initial: Lists }) {
  const [lists, setLists] = useState<Lists>(initial);
  const [locale, setLocale] = useState('es');
  const [saving, startSaving] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const list = lists[locale] ?? [];

  const update = (i: number, key: keyof Portal, value: string) => {
    const next = list.map((p, idx) =>
      idx === i
        ? { ...p, [key]: key === 'features' ? value.split('\n').filter((x) => x.trim()) : value }
        : p,
    );
    setLists({ ...lists, [locale]: next });
  };

  const save = () =>
    startSaving(async () => {
      await saveSitePatch(locale, { portals: { list } });
      setSavedAt(new Date());
    });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLocale(l.code)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                locale === l.code ? 'bg-white text-graphite-1 shadow-sm' : 'text-graphite-3 hover:text-graphite-1'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-graphite-3">
          {savedAt
            ? `Guardado (${locale.toUpperCase()}) a las ${savedAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}.`
            : `${list.length} portales en ${locale.toUpperCase()}.`}
        </p>
      </div>

      <div className="space-y-4">
        {list.map((p, i) => (
          <div key={i} className="rounded-2xl bg-paper p-5 ring-1 ring-line">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[11px] font-medium text-graphite-3">Etiqueta (chip)</span>
                <input value={p.name} onChange={(e) => update(i, 'name', e.target.value)} className="mt-1 h-10 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
              </label>
              <label className="block">
                <span className="text-[11px] font-medium text-graphite-3">Subtítulo corto</span>
                <input value={p.sub} onChange={(e) => update(i, 'sub', e.target.value)} className="mt-1 h-10 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[11px] font-medium text-graphite-3">Título</span>
                <input value={p.title} onChange={(e) => update(i, 'title', e.target.value)} className="mt-1 h-10 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[11px] font-medium text-graphite-3">Frase destacada</span>
                <input value={p.tag} onChange={(e) => update(i, 'tag', e.target.value)} className="mt-1 h-10 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[11px] font-medium text-graphite-3">Para quién</span>
                <input value={p.for} onChange={(e) => update(i, 'for', e.target.value)} className="mt-1 h-10 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[11px] font-medium text-graphite-3">Funciones (una por línea)</span>
                <textarea rows={5} value={(p.features ?? []).join('\n')} onChange={(e) => update(i, 'features', e.target.value)} className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl bg-paper px-5 py-3 ring-1 ring-line shadow-[0_10px_40px_-20px_rgba(15,23,42,0.18)]">
        <p className="text-xs text-graphite-3">Editas el idioma <b>{locale.toUpperCase()}</b>. Guarda cada idioma por separado.</p>
        <button onClick={save} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? 'Guardando…' : `Guardar ${locale.toUpperCase()}`}
        </button>
      </div>
    </div>
  );
}
