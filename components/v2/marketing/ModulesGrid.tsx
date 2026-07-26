import { getTranslations } from 'next-intl/server';
import {
  Clock,
  MapPin,
  FileWarning,
  MessageSquare,
  ShoppingCart,
  Repeat,
  QrCode,
  CalendarDays,
  Megaphone,
  Phone,
  Database,
  ToggleRight,
  Shield,
  Building2,
  FileText,
  Globe2,
  type LucideIcon,
} from 'lucide-react';
import { SectionHeader } from './PortalsGrid';

export async function ModulesGrid() {
  const t = await getTranslations('psdSite.modules');

  const modules: Array<{
    key: string;
    title: string;
    body: string;
    Icon: LucideIcon;
    tone: 'blue' | 'orange' | 'green' | 'teal' | 'purple' | 'amber' | 'cyan' | 'navy';
  }> = [
    { key: 'ts', title: t('timesheetsTitle'), body: t('timesheetsBody'), Icon: Clock, tone: 'blue' },
    { key: 'att', title: t('attendanceTitle'), body: t('attendanceBody'), Icon: MapPin, tone: 'teal' },
    { key: 'rec', title: t('recordsTitle'), body: t('recordsBody'), Icon: FileWarning, tone: 'orange' },
    { key: 'req', title: t('requestsTitle'), body: t('requestsBody'), Icon: MessageSquare, tone: 'purple' },
    { key: 'ord', title: t('ordersTitle'), body: t('ordersBody'), Icon: ShoppingCart, tone: 'amber' },
    { key: 'cov', title: t('coverTitle'), body: t('coverBody'), Icon: Repeat, tone: 'cyan' },
    { key: 'sur', title: t('surveysTitle'), body: t('surveysBody'), Icon: QrCode, tone: 'green' },
    { key: 'hol', title: t('holidaysTitle'), body: t('holidaysBody'), Icon: CalendarDays, tone: 'blue' },
    { key: 'hub', title: t('hubTitle'), body: t('hubBody'), Icon: Megaphone, tone: 'orange' },
    { key: 'chat', title: t('chatTitle'), body: t('chatBody'), Icon: Phone, tone: 'teal' },
    { key: 'reg', title: t('registryTitle'), body: t('registryBody'), Icon: Database, tone: 'navy' },
    { key: 'tpl', title: t('templatesTitle'), body: t('templatesBody'), Icon: ToggleRight, tone: 'purple' },
    { key: 'sec', title: t('securityTitle'), body: t('securityBody'), Icon: Shield, tone: 'navy' },
    { key: 'mt', title: t('tenantTitle'), body: t('tenantBody'), Icon: Building2, tone: 'blue' },
    { key: 'rep', title: t('reportsTitle'), body: t('reportsBody'), Icon: FileText, tone: 'green' },
    { key: 'i18n', title: t('i18nTitle'), body: t('i18nBody'), Icon: Globe2, tone: 'cyan' },
  ];

  const toneMap: Record<
    (typeof modules)[number]['tone'],
    { bg: string; text: string }
  > = {
    blue: { bg: 'bg-psd-blue/10', text: 'text-psd-blue' },
    orange: { bg: 'bg-psd-orange/10', text: 'text-psd-orange' },
    green: { bg: 'bg-psd-green/10', text: 'text-psd-green' },
    teal: { bg: 'bg-psd-teal/10', text: 'text-psd-teal' },
    purple: { bg: 'bg-psd-purple/10', text: 'text-psd-purple' },
    amber: { bg: 'bg-psd-amber/10', text: 'text-psd-amber' },
    cyan: { bg: 'bg-psd-cyan/10', text: 'text-psd-cyan' },
    navy: { bg: 'bg-psd-navy/10', text: 'text-psd-navy' },
  };

  return (
    <section id="modules" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => {
            const tone = toneMap[m.tone];
            return (
              <article
                key={m.key}
                className="group relative rounded-2xl border border-psd-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-psd-navy/20 hover:shadow-[0_20px_40px_-24px_rgba(15,32,68,0.35)] motion-reduce:hover:translate-y-0"
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition group-hover:scale-105 ${tone.bg} ${tone.text}`}
                >
                  <m.Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[15px] font-extrabold leading-tight text-psd-navy">
                  {m.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-psd-textSoft">
                  {m.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
