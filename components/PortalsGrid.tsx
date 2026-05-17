import { Card } from './ui';
import { Building2, Briefcase, ClipboardCheck, HardHat } from 'lucide-react';

const portals = [
  { icon: Building2, title: 'HQ Portal', description: 'Global operations overview, multi-site analytics, role permissions, billing.', color: 'from-cyan-400 to-blue-500' },
  { icon: Briefcase, title: 'Manager Portal', description: 'Team management, staff performance, task assignment, incident oversight.', color: 'from-blue-400 to-indigo-500' },
  { icon: ClipboardCheck, title: 'Supervisor Portal', description: 'Live supervision, audits, site inspections, real-time task tracking.', color: 'from-indigo-400 to-violet-500' },
  { icon: HardHat, title: 'Operative Portal', description: 'Mobile-first PWA. Clock-in, tasks, incident reports, photo evidence.', color: 'from-violet-400 to-fuchsia-500' },
];

export function PortalsGrid() {
  return (
    <section id="product" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight">Built for every layer of operations.</h2>
          <p className="mt-4 text-slate-400">Four purpose-built portals, one shared source of truth — from C-suite dashboards to frontline mobile apps.</p>
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {portals.map(({ icon: Icon, title, description, color }) => (
            <Card key={title} hover className="group p-6">
              <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
