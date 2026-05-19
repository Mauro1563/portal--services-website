import { useTranslations } from 'next-intl';
import { ShieldCheck, Lock, FileKey, Server } from 'lucide-react';

export function Security() {
  const t = useTranslations('security');
  const items = [
    { icon: ShieldCheck, title: t('soc2_title'), sub: t('soc2_sub') },
    { icon: Lock, title: t('gdpr_title'), sub: t('gdpr_sub') },
    { icon: FileKey, title: t('rbac_title'), sub: t('rbac_sub') },
    { icon: Server, title: t('uptime_title'), sub: t('uptime_sub') },
  ];
  return (
    <section id="security" className="relative border-y border-surface-2 bg-surface-1/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-semibold tracking-tight">{t('title')}</h2>
            <p className="mt-4 text-text-2">{t('subtitle')}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {items.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="rounded-xl border border-surface-2 bg-surface-1 p-5">
                <Icon className="mb-3 h-5 w-5 text-brand-600" />
                <p className="font-display text-sm font-semibold text-text-1">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-text-2">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
