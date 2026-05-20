import { useTranslations } from 'next-intl';
import {
  Bell,
  Clock4,
  Crown,
  Gift,
  MessageCircle,
  Star,
  Users,
} from 'lucide-react';

export function VIPExperience() {
  const t = useTranslations('vip');

  const cards = [
    {
      icon: MessageCircle,
      title: t('chat_title'),
      desc: t('chat_desc'),
      accent: 'from-cyan-400 to-blue-500',
    },
    {
      icon: Star,
      title: t('feedback_title'),
      desc: t('feedback_desc'),
      accent: 'from-amber-400 to-orange-500',
    },
    {
      icon: Users,
      title: t('reviews_title'),
      desc: t('reviews_desc'),
      accent: 'from-violet-400 to-fuchsia-500',
    },
    {
      icon: Gift,
      title: t('refer_title'),
      desc: t('refer_desc'),
      accent: 'from-rose-400 to-pink-500',
    },
    {
      icon: Clock4,
      title: t('history_title'),
      desc: t('history_desc'),
      accent: 'from-emerald-400 to-teal-500',
    },
    {
      icon: Bell,
      title: t('notifications_title'),
      desc: t('notifications_desc'),
      accent: 'from-blue-400 to-indigo-500',
    },
  ];

  return (
    <section id="vip" className="relative bg-white/[0.02] py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-inset ring-amber-400/30">
            <Crown className="h-3 w-3" /> {t('eyebrow')}
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            {t('title')}{' '}
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 bg-clip-text text-transparent">
              {t('title_accent')}
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-300">{t('subtitle')}</p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, title, desc, accent }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition hover:border-white/[0.16] hover:bg-white/[0.05]"
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${accent} opacity-15 blur-2xl transition group-hover:opacity-25`}
              />
              <div className="relative">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
