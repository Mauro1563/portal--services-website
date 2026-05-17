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
  CalendarSync,
} from 'lucide-react';

export function FeatureShowcase() {
  const t = useTranslations('features');
  const features = [
    { icon: CalendarClock, title: t('shift_title'), desc: t('shift_desc') },
    { icon: Inbox, title: t('inbox_title'), desc: t('inbox_desc') },
    { icon: Plane, title: t('absence_title'), desc: t('absence_desc') },
    { icon: Users, title: t('community_title'), desc: t('community_desc') },
    { icon: MessageSquare, title: t('comms_title'), desc: t('comms_desc') },
    { icon: MapPin, title: t('geo_title'), desc: t('geo_desc') },
    { icon: Camera, title: t('photo_title'), desc: t('photo_desc') },
    { icon: CalendarSync, title: t('airbnb_title'), desc: t('airbnb_desc') },
  ];
  return (
    <section id="solutions" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight">{t('title')}</h2>
          <p className="mt-4 text-slate-400">{t('subtitle')}</p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} hover className="p-6">
              <Icon className="mb-4 h-6 w-6 text-cyan-300" />
              <h3 className="font-display text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
