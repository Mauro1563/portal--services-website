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
    <section id="security" className="relative bg-paper py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-graphite-1 sm:text-5xl">
              {t('title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-graphite-3">
              {t('subtitle')}
            </p>
          </div>
          <div className="grid gap-y-10 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, sub }) => (
              <div key={title}>
                <Icon
                  className="h-5 w-5 text-graphite-1"
                  strokeWidth={1.5}
                />
                <p className="mt-5 font-display text-sm font-semibold text-graphite-1">
                  {title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-graphite-3">
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
