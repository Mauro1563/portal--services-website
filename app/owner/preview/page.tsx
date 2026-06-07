/**
 * Public preview of the Owner dashboard (mock data).
 */
import Link from 'next/link';
import {
  BarChart3,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  CreditCard,
  ListChecks,
  MapPin,
  MessageSquare,
  Plus,
  Settings,
  Sun,
  Users,
  UserPlus,
} from 'lucide-react';
import {
  CorporateBanner,
  PortalHero,
  PortalShell,
  StatRow,
  ToolCard,
  ToolGrid,
} from '@/components/portal/PortalDashboardShell';

export const metadata = {
  title: 'Vista previa · Portal del Owner',
  robots: { index: false, follow: false },
};

type Task = {
  id: string;
  start_time: string;
  status: 'pending' | 'in_progress' | 'completed';
  property: string;
  cleaner: string;
  client: string;
};

const tasks: Task[] = [
  { id: '1', start_time: '09:00', status: 'in_progress', property: 'Apto Centro 4B', cleaner: 'Carmen R.', client: 'María G.' },
  { id: '2', start_time: '11:30', status: 'completed', property: 'Casa Sol', cleaner: 'Lucía V.', client: 'Sin cliente' },
  { id: '3', start_time: '14:00', status: 'pending', property: 'Loft Goya', cleaner: 'Pedro K.', client: 'Ana R.' },
  { id: '4', start_time: '17:00', status: 'pending', property: 'Estudio Salamanca', cleaner: 'María R.', client: 'Sin cliente' },
];

const quickActions = [
  { href: '#', label: 'Nueva limpieza', Icon: Plus, primary: true },
  { href: '#', label: 'Nuevo cliente', Icon: UserPlus },
  { href: '#', label: 'Nueva propiedad', Icon: Building2 },
  { href: '#', label: 'Nueva limpiadora', Icon: Users },
];

const statusChip: Record<Task['status'], { label: string; cls: string; Icon: typeof Circle }> = {
  pending: { label: 'Pendiente', cls: 'bg-slate-100 text-slate-700', Icon: Circle },
  in_progress: { label: 'En curso', cls: 'bg-amber-100 text-amber-800', Icon: Clock },
  completed: { label: 'Hecha', cls: 'bg-emerald-100 text-emerald-800', Icon: CheckCircle2 },
};

export default function OwnerPreview() {
  return (
    <PortalShell badge={{ label: 'Owner portal', icon: Briefcase }}>
      <PortalHero
        portalLabel="Owner portal"
        portalIcon={Briefcase}
        topRightChip={{ label: 'Day', icon: Sun }}
        greeting="Good afternoon"
        displayName="María"
        chips={[
          { kind: 'text', label: 'Limpiezas Premium', icon: Building2 },
          { kind: 'status', status: 'online', label: 'online' },
        ]}
      />

      <section className="my-5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
          Acciones rápidas
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {quickActions.map((a) => {
            const Icon = a.Icon;
            return (
              <Link
                key={a.label}
                href={a.href}
                className={`group flex items-center gap-2 rounded-2xl px-3.5 py-3 text-sm font-semibold transition ${
                  a.primary
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_10px_28px_-12px_rgba(37,99,235,0.6)]'
                    : 'border border-surface-2 bg-surface-0 text-text-1 hover:border-brand-300'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{a.label}</span>
                <ChevronRight
                  className={`ml-auto h-4 w-4 shrink-0 ${a.primary ? 'text-white/80' : 'text-text-3'}`}
                />
              </Link>
            );
          })}
        </div>
      </section>

      <StatRow
        items={[
          { label: 'Today', value: tasks.length, sub: 'cleanings' },
          { label: 'Pending', value: 3, sub: 'to complete' },
          { label: 'Revenue', value: '£3,420', sub: 'this month' },
          { label: 'Rating', value: '4.8', sub: '18 this month' },
        ]}
      />

      <section className="mt-5 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-text-1">Hoy</h2>
            <p className="text-[11px] text-text-3">{tasks.length} tareas en agenda</p>
          </div>
          <Link href="#" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
            Ver todas <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <ul className="mt-4 space-y-2">
          {tasks.map((t) => {
            const st = statusChip[t.status];
            const Icon = st.Icon;
            return (
              <li key={t.id}>
                <Link
                  href="#"
                  className="group flex items-center gap-3 rounded-xl border border-surface-2 px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow"
                >
                  <div className="flex h-10 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50">
                    <span className="text-[10px] font-bold text-brand-700">{t.start_time}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-1">{t.property}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-text-3">
                      <MapPin className="h-3 w-3 shrink-0" /> {t.cleaner} · {t.client}
                    </p>
                  </div>
                  <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.cls}`}>
                    <Icon className="h-3 w-3" /> {st.label}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-text-3" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <ToolGrid>
        <ToolCard href="#" icon={ListChecks} title="Cleanings" subtitle="4 today" accent="brand" />
        <ToolCard href="#" icon={Building2} title="Properties" subtitle="24 total" accent="emerald" />
        <ToolCard href="#" icon={Users} title="Cleaners" subtitle="8 team" accent="amber" />
        <ToolCard href="#" icon={MessageSquare} title="Clients" subtitle="32 active" accent="navy" />
        <ToolCard href="#" icon={CalendarDays} title="Calendar" subtitle="Schedule view" accent="brand" />
        <ToolCard href="#" icon={BarChart3} title="Analytics" subtitle="Ops dashboard" accent="emerald" />
        <ToolCard href="#" icon={CreditCard} title="Billing" subtitle="Plan & invoices" accent="rose" />
        <ToolCard href="#" icon={Settings} title="Settings" subtitle="Business profile" accent="navy" />
      </ToolGrid>

      <CorporateBanner
        href="#"
        eyebrow="Live operations"
        title="Today's run-rate · Team status"
        subtitle="Real-time view of jobs, cleaners and map"
      />
    </PortalShell>
  );
}
