/**
 * Public preview: HQ → Companies/Tenants list. Mocked data.
 * Lives outside /hq so it doesn't require admin auth.
 */
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

export const metadata = {
  title: 'Preview · HQ Companies',
  robots: { index: false, follow: false },
};

type Plan = 'starter' | 'professional' | 'premium';
type Company = {
  id: string;
  name: string;
  owner: string;
  cleaners: number;
  properties: number;
  cleanings_month: number;
  plan: Plan;
  status: 'active' | 'trial' | 'paused';
  signed: string;
};

const companies: Company[] = [
  { id: '1', name: 'Limpiezas Premium', owner: 'María García', cleaners: 8, properties: 24, cleanings_month: 142, plan: 'professional', status: 'active', signed: 'Hace 4 meses' },
  { id: '2', name: 'CleanHome Madrid', owner: 'Pedro Ruiz', cleaners: 3, properties: 12, cleanings_month: 58, plan: 'starter', status: 'trial', signed: 'Hace 2 sem.' },
  { id: '3', name: 'EcoClean Barcelona', owner: 'Laura Vidal', cleaners: 15, properties: 48, cleanings_month: 312, plan: 'premium', status: 'active', signed: 'Hace 8 meses' },
  { id: '4', name: 'AirbnbPro Sevilla', owner: 'Carlos Mendoza', cleaners: 5, properties: 18, cleanings_month: 96, plan: 'starter', status: 'active', signed: 'Hace 1 mes' },
  { id: '5', name: 'Sparkle Co.', owner: 'Ana Romero', cleaners: 2, properties: 6, cleanings_month: 22, plan: 'starter', status: 'paused', signed: 'Hace 6 meses' },
];

const planChip: Record<Plan, string> = {
  starter: 'bg-slate-100 text-slate-700 ring-slate-200',
  professional: 'bg-blue-100 text-blue-800 ring-blue-200',
  premium: 'bg-amber-100 text-amber-800 ring-amber-200',
};

const statusChip: Record<Company['status'], { label: string; cls: string }> = {
  active: { label: 'Activa', cls: 'bg-emerald-100 text-emerald-800' },
  trial: { label: 'Trial', cls: 'bg-cyan-100 text-cyan-800' },
  paused: { label: 'Pausada', cls: 'bg-slate-100 text-slate-600' },
};

export default function HQCompaniesPreview() {
  const totalCleanings = companies.reduce((s, c) => s + c.cleanings_month, 0);
  const totalCleaners = companies.reduce((s, c) => s + c.cleaners, 0);
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/hq/vistas" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Vistas
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Preview · HQ Companies</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Companies / Tenants</h1>
            <p className="mt-1 text-sm text-slate-500">Empresas registradas en la plataforma</p>
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]">
            <Plus className="h-4 w-4" /> Nueva empresa
          </button>
        </div>

        {/* KPIs */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KPI label="Total empresas" value={companies.length} icon={Building2} />
          <KPI label="Cleaners totales" value={totalCleaners} icon={Users} />
          <KPI label="Limpiezas/mes" value={totalCleanings.toLocaleString()} icon={Sparkles} />
          <KPI label="Activas" value={companies.filter((c) => c.status === 'active').length} icon={CheckCircle2} accent="emerald" />
        </div>

        <div className="mt-6 relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, owner o ciudad…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Empresa</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-right">Cleaners</th>
                <th className="px-4 py-3 text-right">Sitios</th>
                <th className="px-4 py-3 text-right">Limpiezas/mes</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3" aria-label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((c) => {
                const st = statusChip[c.status];
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.signed}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{c.owner}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">{c.cleaners}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">{c.properties}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900">{c.cleanings_month}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${planChip[c.plan]}`}>
                        {c.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.cls}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ExternalLink className="ml-auto h-4 w-4 text-slate-400" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function KPI({
  label,
  value,
  icon: Icon,
  accent = 'blue',
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: 'blue' | 'emerald';
}) {
  const grad = accent === 'emerald'
    ? 'from-emerald-100 to-teal-50 text-emerald-700'
    : 'from-cyan-100 to-blue-50 text-blue-700';
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${grad}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
