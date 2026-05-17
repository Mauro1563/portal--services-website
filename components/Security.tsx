import { ShieldCheck, Lock, FileKey, Server } from 'lucide-react';

const items = [
  { icon: ShieldCheck, title: 'SOC 2 Type II', subtitle: 'Pursuing certification — controls in place' },
  { icon: Lock, title: 'GDPR-ready', subtitle: 'EU data residency available' },
  { icon: FileKey, title: 'RBAC + SSO', subtitle: 'Granular roles, SAML, OAuth, MFA enforced' },
  { icon: Server, title: '99.9% uptime', subtitle: 'Multi-region, encrypted at rest and in transit' },
];

export function Security() {
  return (
    <section id="security" className="relative border-y border-white/[0.06] bg-ink-1/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-semibold tracking-tight">Enterprise security, by default.</h2>
            <p className="mt-4 text-slate-400">Designed from the ground up for organisations that take data, compliance and uptime seriously.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {items.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <Icon className="mb-3 h-5 w-5 text-cyan-300" />
                <p className="font-display text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
