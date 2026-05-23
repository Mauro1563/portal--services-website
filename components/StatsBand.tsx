import { useTranslations } from 'next-intl';
import { Building2, ShieldCheck, Sparkles, Users } from 'lucide-react';

export function StatsBand() {
  const t = useTranslations('stats');

  const items = [
    { value: '7', label: t('portals'), Icon: Sparkles, tone: 'cyan' },
    { value: '99.9%', label: t('uptime'), Icon: ShieldCheck, tone: 'emerald' },
    { value: '30 d', label: t('trial'), Icon: Building2, tone: 'violet' },
    { value: '3 idiomas', label: t('languages'), Icon: Users, tone: 'amber' },
  ] as const;

  const toneCls: Record<string, string> = {
    cyan: 'from-cyan-400 to-blue-500',
    emerald: 'from-emerald-400 to-teal-500',
    violet: 'from-violet-400 to-fuchsia-500',
    amber: 'from-amber-400 to-orange-500',
  };

  return (
    <section className="relative bg-canvas">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-4 rounded-3xl bg-paper p-6 ring-1 ring-line shadow-[0_24px_60px_-30px_rgba(15,23,42,0.18)] sm:p-8 lg:grid-cols-4">
          {items.map(({ value, label, Icon, tone }) => (
            <div
              key={label}
              className="flex items-start gap-3 sm:flex-col sm:items-start sm:gap-4"
            >
              <span
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${toneCls[tone]} text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.4)]`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-3xl font-bold tabular-nums text-graphite-1 sm:text-4xl">
                  {value}
                </p>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-graphite-3">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
