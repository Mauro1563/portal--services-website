import { useTranslations } from 'next-intl';

type Size = 'sm' | 'md' | 'lg';

const sizeConfig: Record<Size, {
  mark: string;
  wordmark: string;
  digital: string;
  tagline: string;
  gap: string;
  defaultTagline: boolean;
}> = {
  sm: {
    mark: 'h-9 w-9',
    wordmark: 'text-[13px]',
    digital: 'text-[10px]',
    tagline: 'text-[9px]',
    gap: 'gap-2.5',
    defaultTagline: false,
  },
  md: {
    mark: 'h-12 w-12',
    wordmark: 'text-base',
    digital: 'text-xs',
    tagline: 'text-[10px]',
    gap: 'gap-3',
    defaultTagline: true,
  },
  lg: {
    mark: 'h-20 w-20 sm:h-24 sm:w-24',
    wordmark: 'text-2xl sm:text-3xl',
    digital: 'text-sm sm:text-base',
    tagline: 'text-xs sm:text-sm',
    gap: 'gap-4 sm:gap-5',
    defaultTagline: true,
  },
};

export function Logo({
  size = 'sm',
  showTagline,
  className = '',
}: {
  size?: Size;
  showTagline?: boolean;
  className?: string;
}) {
  const t = useTranslations('footer');
  const cfg = sizeConfig[size];
  const tagline = showTagline ?? cfg.defaultTagline;

  return (
    <div className={`flex items-center ${cfg.gap} ${className}`}>
      <LogoMark className={cfg.mark} />
      <div className="flex flex-col leading-tight">
        <span
          className={`font-display ${cfg.wordmark} font-semibold tracking-[0.18em] text-white`}
        >
          PORTAL SERVICES
        </span>
        <span
          className={`${cfg.digital} font-semibold tracking-[0.32em] text-cyan-300`}
        >
          DIGITAL
        </span>
        {tagline && (
          <span className={`mt-1.5 ${cfg.tagline} font-semibold tracking-[0.18em]`}>
            <span className="text-slate-200">{t('tagline_a')}</span>{' '}
            <span className="text-cyan-300">{t('tagline_b')}</span>{' '}
            <span className="text-slate-400">{t('tagline_c')}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="psd-mark-grad"
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#psd-mark-grad)" />
      <rect x="13" y="13" width="15" height="15" rx="3" fill="#0B1220" fillOpacity="0.35" />
      <rect x="32" y="13" width="19" height="15" rx="3" fill="#0B1220" fillOpacity="0.7" />
      <rect x="13" y="32" width="19" height="19" rx="3" fill="#0B1220" fillOpacity="0.7" />
      <rect x="36" y="32" width="15" height="19" rx="3" fill="#0B1220" fillOpacity="0.35" />
    </svg>
  );
}
