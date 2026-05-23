import { useTranslations } from 'next-intl';
import {
  Bell,
  Clock4,
  Gift,
  MessageCircle,
  Star,
  Users,
} from 'lucide-react';

export function VIPExperience() {
  const t = useTranslations('vip');

  const cards = [
    { icon: MessageCircle, title: t('chat_title'), desc: t('chat_desc') },
    { icon: Star, title: t('feedback_title'), desc: t('feedback_desc') },
    { icon: Users, title: t('reviews_title'), desc: t('reviews_desc') },
    { icon: Gift, title: t('refer_title'), desc: t('refer_desc') },
    { icon: Clock4, title: t('history_title'), desc: t('history_desc') },
    { icon: Bell, title: t('notifications_title'), desc: t('notifications_desc') },
  ];

  return (
    <section id="vip" className="relative bg-canvas py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-graphite-1 sm:text-5xl lg:text-6xl">
            {t('title')} {t('title_accent')}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-graphite-3">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-20 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <Icon
                className="h-6 w-6 text-graphite-1"
                strokeWidth={1.5}
              />
              <h3 className="mt-6 font-display text-lg font-semibold text-graphite-1">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-3">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
