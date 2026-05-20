import { useTranslations } from 'next-intl';
import { Card } from './ui';
import {
  CalendarClock,
  Inbox,
  Plane,
  Users,
  MessageSquare,
  Camera,
  MapPin,
  CalendarCheck,
} from 'lucide-react';

export function FeatureShowcase() {
  const t = useTranslations('features');
  const features = [
    { icon: CalendarClock, title: t('shift_title'), description: t('shift_desc') },
    { icon: Inbox, title: t('inbox_title'), description: t('inbox_desc') },
    { icon: Plane, title: t('absence_title'), description: t('absence_desc') },
    { icon: Users, title: t('community_title'), description: t('community_desc') },
    { icon: MessageSquare, title: t('comms_title'), description: t('comms_desc') },
    { icon: MapPin, title: t('geo_title'), description: t('geo_desc') },
    { icon: Camera, title: t('photo_title'), description: t('photo_desc') },
    { icon: CalendarCheck, title: t('airbnb_title'), description: t('airbnb_desc') },
  ];
  return (
    <section id="solutions" className="relative bg-white/[0.03] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-white">
            {t('title')}
          </h2>
          <p className="mt-4 text-slate-300">{t('subtitle')}</p>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} hover className="p-6">
              <Icon className="mb-4 h-6 w-6 text-cyan-300" />
              <h3 className="font-display text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
