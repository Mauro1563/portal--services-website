import { useTranslations } from 'next-intl';
import { BrowserFrame } from './ui/DeviceFrame';
import { HQDashboardMockup } from './mockups/HQDashboardMockup';

export function ProductShowcase() {
  const t = useTranslations('showcase');

  const bullets = [
    t('bullet_real_time'),
    t('bullet_mobile_first'),
    t('bullet_branded'),
  ];

  return (
    <section className="relative bg-paper py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-graphite-1 sm:text-5xl">
              {t('title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-graphite-3">
              {t('subtitle')}
            </p>

            <ul className="mt-10 space-y-4 border-l border-line pl-6">
              {bullets.map((b) => (
                <li key={b} className="text-base text-graphite-2">
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <BrowserFrame url="hq.portalservices.digital">
              <HQDashboardMockup />
            </BrowserFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
