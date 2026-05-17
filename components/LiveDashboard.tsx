import { useTranslations } from 'next-intl';
import { Badge, Card } from './ui';
import { Activity, MapPin, TrendingUp } from 'lucide-react';

export function LiveDashboard() {
  const t = useTranslations('dashboard');
  const bullets = [
    { icon: MapPin, text: t('bullet_geo') },
    { icon: TrendingUp, text: t('bullet_metrics') },
    { icon: Activity, text: t('bullet_stream') },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge tone="info" className="mb-5"><Activity className="h-3 w-3" /> {t('badge')}</Badge>
            <h2 className="font-display text-4xl font-semibold tracking-tight">{t('title')}</h2>
            <p className="mt-4 text-slate-400">{t('body')}</p>
            <ul className="mt-8 space-y-4">
              {bullets.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-300"><Icon className="h-3.5 w-3.5" /></span>
                  <span className="text-sm text-slate-300">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="overflow-hidden p-0">
            <div className="border-b border-white/[0.06] px-5 py-3"><p className="text-xs uppercase tracking-wider text-slate-400">{t('live_label')}</p></div>
            <div className="grid grid-cols-2 gap-4 p-5">
              {[
                { label: 'On-shift', value: '892', delta: '+12' },
                { label: 'Tasks done', value: '94%', delta: '+3%' },
                { label: 'Open incidents', value: '4', delta: '-2' },
                { label: 'Audit score', value: '4.8', delta: '+0.2' },
              ].map((k) => (
                <div key={k.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">{k.label}</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-white">{k.value}</p>
                  <p className="mt-1 text-xs text-emerald-400">↑ {k.delta}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
