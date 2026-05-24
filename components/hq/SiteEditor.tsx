'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useTransition } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { saveSitePatch } from '@/app/hq/actions';
import { FieldGrid, ListEditor, StringListEditor, inputCls, areaCls, type Spec } from './fields';

type Any = Record<string, any>;
type ByLocale = Record<string, Any>;

const LOCALES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
];

const SECTIONS: { id: string; label: string }[] = [
  { id: 'nav', label: 'Navegación' },
  { id: 'hero', label: 'Hero' },
  { id: 'logos', label: 'Logos' },
  { id: 'portals', label: 'Portales (encabezado)' },
  { id: 'platform', label: 'Plataforma' },
  { id: 'vip', label: 'Experiencia VIP' },
  { id: 'loyalty', label: 'Fidelización' },
  { id: 'pay', label: 'Pagos' },
  { id: 'tst', label: 'Testimonios' },
  { id: 'pricing', label: 'Precios' },
  { id: 'cmp', label: 'Comparativa' },
  { id: 'sec', label: 'Seguridad' },
  { id: 'faq', label: 'FAQ' },
  { id: 'cta', label: 'CTA final' },
  { id: 'footer', label: 'Footer' },
];

const HEADER: Spec[] = [
  { key: 'eyebrow', label: 'Eyebrow', full: true },
  { key: 'title_a', label: 'Título (parte 1)' },
  { key: 'title_b', label: 'Título (cursiva)' },
  { key: 'sub', label: 'Subtítulo', area: true },
];

function PlanList({ title, plans, onChange }: { title: string; plans: any[]; onChange: (n: any[]) => void }) {
  const set = (i: number, k: string, v: unknown) => onChange(plans.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-graphite-1">{title}</h4>
        <button onClick={() => onChange([...plans, { name: 'Nuevo plan', scope: '', price: '£0', features: [], cta: 'Empezar' }])} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-brand-600 ring-1 ring-inset ring-line hover:bg-slate-50">
          <Plus className="h-3.5 w-3.5" /> Plan
        </button>
      </div>
      {plans.map((p, i) => (
        <div key={i} className="rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-line">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block"><span className="text-[11px] text-graphite-3">Nombre</span><input value={p.name ?? ''} onChange={(e) => set(i, 'name', e.target.value)} className={inputCls} /></label>
            <label className="block"><span className="text-[11px] text-graphite-3">Precio</span><input value={p.price ?? ''} onChange={(e) => set(i, 'price', e.target.value)} className={inputCls} /></label>
            <label className="block"><span className="text-[11px] text-graphite-3">Texto botón</span><input value={p.cta ?? ''} onChange={(e) => set(i, 'cta', e.target.value)} className={inputCls} /></label>
            <label className="block sm:col-span-3"><span className="text-[11px] text-graphite-3">Alcance</span><input value={p.scope ?? ''} onChange={(e) => set(i, 'scope', e.target.value)} className={inputCls} /></label>
            <label className="block sm:col-span-3"><span className="text-[11px] text-graphite-3">Funciones (una por línea)</span><textarea rows={4} value={(p.features ?? []).join('\n')} onChange={(e) => set(i, 'features', e.target.value.split('\n').filter((x: string) => x.trim()))} className={areaCls} /></label>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-graphite-2">
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!p.featured} onChange={(e) => set(i, 'featured', e.target.checked)} /> Destacado</label>
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!p.from} onChange={(e) => set(i, 'from', e.target.checked)} /> "desde"</label>
            </div>
            <button onClick={() => onChange(plans.filter((_, idx) => idx !== i))} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-graphite-3 hover:bg-rose-50 hover:text-rose-600">
              <Trash2 className="h-3.5 w-3.5" /> Quitar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComparisonRows({ rows, onChange }: { rows: any[][]; onChange: (n: any[][]) => void }) {
  const setLabel = (i: number, v: string) => onChange(rows.map((r, idx) => (idx === i ? [v, r[1], r[2], r[3]] : r)));
  const toggle = (i: number, c: number) => onChange(rows.map((r, idx) => (idx === i ? r.map((cell, ci) => (ci === c ? !cell : cell)) : r)));
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-graphite-4">
        <span>Función</span><span>Starter</span><span>Pro</span><span>Premium</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2">
          <input value={String(r[0] ?? '')} onChange={(e) => setLabel(i, e.target.value)} className="h-9 w-full rounded-lg bg-white px-2.5 text-sm ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          {[1, 2, 3].map((c) => (
            <input key={c} type="checkbox" checked={!!r[c]} onChange={() => toggle(i, c)} className="mx-3 h-4 w-4" />
          ))}
        </div>
      ))}
      <button onClick={() => onChange([...rows, ['Nueva función', false, false, false]])} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-brand-600 ring-1 ring-inset ring-line hover:bg-slate-50">
        <Plus className="h-3.5 w-3.5" /> Fila
      </button>
    </div>
  );
}

export function SiteEditor({ initial }: { initial: ByLocale }) {
  const [data, setData] = useState<ByLocale>(initial);
  const [locale, setLocale] = useState('es');
  const [section, setSection] = useState('hero');
  const [saving, startSaving] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const psd: Any = data[locale];
  const merge = (sec: string, patch: Any) =>
    setData({ ...data, [locale]: { ...psd, [sec]: { ...psd[sec], ...patch } } });
  const setField = (sec: string) => (key: string, v: string) => merge(sec, { [key]: v });
  const setList = (sec: string, key: string) => (next: any) => merge(sec, { [key]: next });

  const save = () =>
    startSaving(async () => {
      // Don't clobber the per-portal cards edited in /hq/portals.
      const patch: Any = { ...psd, portals: { ...psd.portals } };
      delete patch.portals.list;
      await saveSitePatch(locale, patch);
      setSavedAt(new Date());
    });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          {LOCALES.map((l) => (
            <button key={l.code} onClick={() => setLocale(l.code)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${locale === l.code ? 'bg-white text-graphite-1 shadow-sm' : 'text-graphite-3 hover:text-graphite-1'}`}>
              {l.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-graphite-3">
          {savedAt ? `Guardado (${locale.toUpperCase()}) ${savedAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}.` : `Editando ${locale.toUpperCase()}.`}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
        <nav className="flex gap-1 overflow-x-auto rounded-2xl bg-paper p-2 ring-1 ring-line lg:flex-col lg:overflow-visible">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm font-medium transition ${section === s.id ? 'bg-brand-500/10 text-brand-700 ring-1 ring-inset ring-brand-500/20' : 'text-graphite-3 hover:bg-slate-100 hover:text-graphite-1'}`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <section className="space-y-6 rounded-2xl bg-paper p-6 ring-1 ring-line">
          {section === 'nav' && (
            <FieldGrid schema={[
              { key: 'portals', label: 'Enlace: Portales' }, { key: 'platform', label: 'Enlace: Plataforma' },
              { key: 'pricing', label: 'Enlace: Precios' }, { key: 'security', label: 'Enlace: Seguridad' },
              { key: 'login', label: 'Acceso' }, { key: 'demo', label: 'Botón demo' },
            ]} value={psd.nav} onChange={setField('nav')} />
          )}

          {section === 'hero' && (
            <FieldGrid schema={[
              { key: 'eyebrow', label: 'Eyebrow', full: true },
              { key: 'title_a', label: 'Título línea 1' }, { key: 'title_b', label: 'Título línea 2 (cursiva)' }, { key: 'title_c', label: 'Título línea 3' },
              { key: 'sub', label: 'Subtítulo', area: true },
              { key: 'cta_primary', label: 'Botón primario' }, { key: 'cta_secondary', label: 'Botón secundario' },
              { key: 'trust_a', label: 'Confianza 1' }, { key: 'trust_b', label: 'Confianza 2' }, { key: 'trust_c', label: 'Confianza 3' },
              { key: 'stat_portals', label: 'Stat: portales' }, { key: 'stat_uptime', label: 'Stat: uptime' },
              { key: 'stat_trial', label: 'Stat: prueba' }, { key: 'stat_lang', label: 'Stat: idiomas' },
            ]} value={psd.hero} onChange={setField('hero')} />
          )}

          {section === 'logos' && (
            <FieldGrid schema={[{ key: 'head', label: 'Texto sobre los logos', full: true }]} value={psd.logos} onChange={setField('logos')} />
          )}

          {section === 'portals' && (
            <>
              <FieldGrid schema={HEADER} value={psd.portals} onChange={setField('portals')} />
              <p className="rounded-xl bg-cyan-50 p-3 text-xs text-graphite-2 ring-1 ring-inset ring-cyan-200">
                Las 7 tarjetas de portal se editan en <b>Portales</b> (menú lateral).
              </p>
            </>
          )}

          {section === 'platform' && (
            <>
              <FieldGrid schema={[
                { key: 'eyebrow', label: 'Eyebrow', full: true }, { key: 'title_a', label: 'Título (parte 1)' }, { key: 'title_b', label: 'Título (cursiva)' },
                { key: 'sub', label: 'Subtítulo', area: true },
                { key: 'f1', label: 'Bullet 1' }, { key: 'f2', label: 'Bullet 2' }, { key: 'f3', label: 'Bullet 3' },
                { key: 'activity', label: 'Etiqueta actividad' }, { key: 'buildings_active', label: 'Etiqueta edificios' },
                { key: 'shift', label: 'Estado: en turno' }, { key: 'inspection', label: 'Estado: inspección' },
              ]} value={psd.platform} onChange={setField('platform')} />
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Etiquetas de KPI</p>
                <FieldGrid schema={[
                  { key: 'buildings', label: 'KPI: edificios' }, { key: 'ops', label: 'KPI: operativos' },
                  { key: 'quality', label: 'KPI: calidad' }, { key: 'uptime', label: 'KPI: uptime' },
                ]} value={psd.platform.kpi} onChange={(k, v) => merge('platform', { kpi: { ...psd.platform.kpi, [k]: v } })} />
              </div>
            </>
          )}

          {section === 'vip' && (
            <>
              <FieldGrid schema={HEADER} value={psd.vip} onChange={setField('vip')} />
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Tarjetas (6)</p>
                <ListEditor items={psd.vip.items} schema={[{ key: 't', label: 'Título' }, { key: 'd', label: 'Descripción', area: true }]} onChange={setList('vip', 'items')} blank={() => ({ t: '', d: '' })} addLabel="Añadir tarjeta" />
              </div>
            </>
          )}

          {section === 'loyalty' && (
            <>
              <FieldGrid schema={[...HEADER, { key: 'earn', label: 'Título "ganar"' }, { key: 'redeem', label: 'Título "canjear"' }]} value={psd.loyalty} onChange={setField('loyalty')} />
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Cómo ganar puntos</p>
                <ListEditor items={psd.loyalty.earn_items} schema={[{ key: 't', label: 'Acción' }, { key: 'p', label: 'Puntos' }]} onChange={setList('loyalty', 'earn_items')} blank={() => ({ t: '', p: '' })} addLabel="Añadir acción" />
              </div>
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Qué canjear</p>
                <StringListEditor items={psd.loyalty.redeem_items} onChange={setList('loyalty', 'redeem_items')} addLabel="Añadir recompensa" />
              </div>
            </>
          )}

          {section === 'pay' && (
            <>
              <FieldGrid schema={[...HEADER, { key: 'methods', label: 'Etiqueta métodos' }, { key: 'note', label: 'Nota de seguridad', area: true }]} value={psd.pay} onChange={setField('pay')} />
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Tarjetas de pago</p>
                <ListEditor items={psd.pay.items} schema={[{ key: 'tag', label: 'Etiqueta' }, { key: 't', label: 'Título' }, { key: 'd', label: 'Descripción', area: true }]} onChange={setList('pay', 'items')} blank={() => ({ tag: '', t: '', d: '' })} addLabel="Añadir tarjeta" />
              </div>
            </>
          )}

          {section === 'tst' && (
            <>
              <FieldGrid schema={[{ key: 'eyebrow', label: 'Eyebrow', full: true }, { key: 'title_a', label: 'Título (parte 1)' }, { key: 'title_b', label: 'Título (cursiva)' }]} value={psd.tst} onChange={setField('tst')} />
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Testimonios</p>
                <ListEditor items={psd.tst.items} schema={[{ key: 'q', label: 'Cita', area: true }, { key: 'n', label: 'Nombre' }, { key: 'c', label: 'Ciudad' }]} onChange={setList('tst', 'items')} blank={() => ({ q: '', n: '', c: '' })} addLabel="Añadir testimonio" />
              </div>
            </>
          )}

          {section === 'pricing' && (
            <>
              <FieldGrid schema={[
                { key: 'eyebrow', label: 'Eyebrow' }, { key: 'popular', label: 'Etiqueta "más popular"' },
                { key: 'title_a', label: 'Título (parte 1)' }, { key: 'title_b', label: 'Título (cursiva)' },
                { key: 'sub', label: 'Subtítulo', area: true }, { key: 'trial', label: 'Nota de prueba', area: true },
                { key: 'toggle_corp', label: 'Toggle corporativo' }, { key: 'toggle_home', label: 'Toggle hogar' },
                { key: 'month', label: 'Sufijo (/mes)' }, { key: 'from', label: 'Prefijo "desde"' },
                { key: 'footer_note', label: 'Nota al pie', area: true },
              ]} value={psd.pricing} onChange={setField('pricing')} />
              <PlanList title="Planes corporativos" plans={psd.pricing.corp_plans ?? []} onChange={setList('pricing', 'corp_plans')} />
              <PlanList title="Planes limpiezas de hogar" plans={psd.pricing.home_plans ?? []} onChange={setList('pricing', 'home_plans')} />
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Add-ons</p>
                <ListEditor items={psd.pricing.addons ?? []} schema={[{ key: 'name', label: 'Nombre' }, { key: 'desc', label: 'Descripción' }, { key: 'price', label: 'Precio' }]} onChange={setList('pricing', 'addons')} blank={() => ({ name: '', desc: '', price: '' })} addLabel="Añadir add-on" />
              </div>
            </>
          )}

          {section === 'cmp' && (
            <>
              <FieldGrid schema={HEADER} value={psd.cmp} onChange={setField('cmp')} />
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Encabezados de columna</p>
                <StringListEditor items={psd.cmp.headers} onChange={setList('cmp', 'headers')} addLabel="Añadir columna" />
              </div>
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Filas de funciones</p>
                <ComparisonRows rows={psd.cmp.rows} onChange={setList('cmp', 'rows')} />
              </div>
            </>
          )}

          {section === 'sec' && (
            <>
              <FieldGrid schema={HEADER} value={psd.sec} onChange={setField('sec')} />
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Items de seguridad (4)</p>
                <ListEditor items={psd.sec.items} schema={[{ key: 't', label: 'Título' }, { key: 'd', label: 'Descripción', area: true }]} onChange={setList('sec', 'items')} blank={() => ({ t: '', d: '' })} addLabel="Añadir item" />
              </div>
            </>
          )}

          {section === 'faq' && (
            <>
              <FieldGrid schema={[{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'title', label: 'Título' }]} value={psd.faq} onChange={setField('faq')} />
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Preguntas</p>
                <ListEditor items={psd.faq.items} schema={[{ key: 'q', label: 'Pregunta' }, { key: 'a', label: 'Respuesta', area: true }]} onChange={setList('faq', 'items')} blank={() => ({ q: '', a: '' })} addLabel="Añadir pregunta" />
              </div>
            </>
          )}

          {section === 'cta' && (
            <FieldGrid schema={[
              { key: 'title_a', label: 'Título (parte 1)' }, { key: 'title_b', label: 'Título (cursiva)' },
              { key: 'sub', label: 'Subtítulo', area: true }, { key: 'primary', label: 'Botón primario' }, { key: 'secondary', label: 'Botón secundario' },
            ]} value={psd.cta} onChange={setField('cta')} />
          )}

          {section === 'footer' && (
            <>
              <FieldGrid schema={[
                { key: 'tag', label: 'Tagline', area: true }, { key: 'platform', label: 'Columna: Plataforma' },
                { key: 'company', label: 'Columna: Compañía' }, { key: 'legal', label: 'Columna: Legal' },
                { key: 'copyright', label: 'Copyright', full: true },
              ]} value={psd.footer} onChange={setField('footer')} />
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Enlaces</p>
                <FieldGrid schema={[
                  { key: 'portals', label: 'Portales' }, { key: 'pricing', label: 'Precios' }, { key: 'security', label: 'Seguridad' },
                  { key: 'contact', label: 'Contacto' }, { key: 'login', label: 'Acceso' }, { key: 'privacy', label: 'Privacidad' }, { key: 'terms', label: 'Términos' },
                ]} value={psd.footer.links} onChange={(k, v) => merge('footer', { links: { ...psd.footer.links, [k]: v } })} />
              </div>
            </>
          )}
        </section>
      </div>

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl bg-paper px-5 py-3 ring-1 ring-line shadow-[0_10px_40px_-20px_rgba(15,23,42,0.18)]">
        <p className="text-xs text-graphite-3">Guarda cada idioma por separado. Se publica al recargar el sitio.</p>
        <button onClick={save} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? 'Guardando…' : `Guardar ${locale.toUpperCase()}`}
        </button>
      </div>
    </div>
  );
}
