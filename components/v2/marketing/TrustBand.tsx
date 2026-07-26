import { getTranslations } from 'next-intl/server';
import { Radio, Smartphone, Building2, Languages } from 'lucide-react';

export async function TrustBand() {
  const t = await getTranslations('psdSite.trust');

  const items = [
    { title: t('v1Title'), body: t('v1Body'), Icon: Radio },
    { title: t('v2Title'), body: t('v2Body'), Icon: Smartphone },
    { title: t('v3Title'), body: t('v3Body'), Icon: Building2 },
    { title: t('v4Title'), body: t('v4Body'), Icon: Languages },
  ];

  return (
    <section className="border-b border-psd-border bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-psd-textSoft">
          {t('label')}
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ title, body, Icon }) => (
            <div
              key={title}
              className="group flex items-start gap-3 rounded-2xl border border-psd-border bg-psd-bg p-5 transition hover:border-psd-blue/40 hover:bg-white"
            >
              <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-gradient-to-br from-psd-blue to-psd-navy text-white shadow-[0_10px_20px_-10px_rgba(37,99,235,0.6)] transition group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-psd-navy">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-psd-textSoft">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
