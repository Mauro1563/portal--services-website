import { useTranslations } from 'next-intl';

type Size = 'sm' | 'md' | 'lg';

const LOGO_URL =
  'https://raw.githubusercontent.com/Mauro1563/portal--services-website/main/logo%20png%20portal%20.PNG';

const CROP_ASPECT = '2.6 / 1';

const sizeConfig: Record<Size, {
  imgWrap: string;
  tagline: string;
  showTagline: boolean;
}> = {
  sm: {
    imgWrap: 'h-10 sm:h-12 w-auto',
    tagline: '',
    showTagline: false,
  },
  md: {
    imgWrap: 'mx-auto w-full max-w-[280px]',
    tagline: 'mt-3 text-[10px]',
    showTagline: true,
  },
  lg: {
    imgWrap: 'mx-auto w-full max-w-md sm:max-w-lg',
    tagline: 'mt-5 text-xs sm:text-sm',
    showTagline: true,
  },
};

export function Logo({
  size = 'sm',
  className = '',
}: {
  size?: Size;
  showTagline?: boolean;
  className?: string;
}) {
  const t = useTranslations('footer');
  const cfg = sizeConfig[size];

  return (
    <div className={className}>
      <div
        className={`${cfg.imgWrap} overflow-hidden`}
        style={{ aspectRatio: CROP_ASPECT }}
      >
        <img
          src={LOGO_URL}
          alt="Portal Services Digital"
          className="block h-auto w-full"
        />
      </div>
      {cfg.showTagline && (
        <p className={`text-center font-semibold tracking-[0.2em] ${cfg.tagline}`}>
          <span className="text-slate-200">{t('tagline_a')}</span>{' '}
          <span className="text-cyan-300">{t('tagline_b')}</span>{' '}
          <span className="text-slate-400">{t('tagline_c')}</span>
        </p>
      )}
    </div>
  );
}
