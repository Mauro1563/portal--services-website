import { Card } from './ui';
import { CheckSquare, ShieldAlert, ClipboardList, Boxes, BarChart3, MessageSquare } from 'lucide-react';

const features = [
  { icon: CheckSquare, title: 'Tasks & Checklists', description: 'Recurring tasks, templates, photo evidence, and signatures. Real-time completion tracking across every site.' },
  { icon: ClipboardList, title: 'Live Audits', description: 'Configurable audit templates with weighted scoring, evidence capture and instant SLA flags.' },
  { icon: ShieldAlert, title: 'Incident Center', description: 'Report, triage and resolve incidents collaboratively with full audit trail and notifications.' },
  { icon: Boxes, title: 'Inventory', description: 'Stock per site, low-stock alerts, requests workflow, transfer tracking.' },
  { icon: BarChart3, title: 'Analytics', description: 'Performance, SLA compliance, financials. Saved views, scheduled reports, export to PDF/CSV.' },
  { icon: MessageSquare, title: 'Chat & Notifications', description: 'Multi-channel messaging tied to sites and incidents. Email, SMS, push, in-app.' },
];

export function FeatureShowcase() {
  return (
    <section id="solutions" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight">One platform, every workflow.</h2>
          <p className="mt-4 text-slate-400">Replace 5+ tools with a unified operational system designed for the modern enterprise.</p>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} hover className="p-6">
              <Icon className="mb-4 h-6 w-6 text-cyan-300" />
              <h3 className="font-display text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
