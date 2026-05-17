import { useTranslations } from 'next-intl';
import { Card } from './ui';
import { Building2, Briefcase, ClipboardCheck, HardHat } from 'lucide-react';

export function PortalsGrid() {
  const t = useTranslations('portals');
  const portals = [
    { icon: Building2, title: t('hq_title'), description: t('hq_desc'), color: 'from-cyan-400 to-blue-500' },
    { icon: Briefcase, title: t('manager_title'), description: t('manager_desc'), color: 'from-blue-400 to-indigo-500' },
    { icon: ClipboardCheck, title: t('supervisor_title'), description: t('supervisor_desc'), color: 'from-indigo-400 to-violet-500' },
    { icon: HardHat, title: t('operative_title'), description: t('operative_desc'), color: 'from-violet-400 to-fuchsia-500' },
  ];
  return (
    <section id="product" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight">{t('title')}</h2>
          <p className="mt-4 text-slate-400">{t('subtitle')}</p>
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
