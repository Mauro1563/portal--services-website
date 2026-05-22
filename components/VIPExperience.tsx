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
      accent: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Star,
      title: t('feedback_title'),
      desc: t('feedback_desc'),
      accent: 'from-amber-500 to-orange-500',
    },
    {
      icon: Users,
      title: t('reviews_title'),
      desc: t('reviews_desc'),
      accent: 'from-violet-500 to-fuchsia-500',
    },
    {
      icon: Gift,
      title: t('refer_title'),
      desc: t('refer_desc'),
      accent: 'from-rose-500 to-pink-500',
    },
    {
      icon: Clock4,
      title: t('history_title'),
      desc: t('history_desc'),
      accent: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Bell,
      title: t('notifications_title'),
      desc: t('notifications_desc'),
      accent: 'from-blue-500 to-indigo-500',
    },
  ];

  return (
    <section id="vip" className="relative bg-cloud py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            <Crown className="h-3 w-3" /> {t('eyebrow')}
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-graphite-1 sm:text-5xl">
            {t('title')}{' '}
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-brand-500 bg-clip-text text-transparent">
              {t('title_accent')}
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-graphite-3">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, title, desc, accent }) => (
            <article
              key={title}
              className="rounded-2xl bg-paper p-6 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-20px_rgba(15,23,42,0.15)]"
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)]`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-graphite-1">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-3">
                {desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
