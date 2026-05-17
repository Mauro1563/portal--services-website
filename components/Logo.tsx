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
    mark: 'h-10 w-10',
    wordmark: 'text-[13px]',
    digital: 'text-[10px]',
    tagline: 'text-[9px]',
    gap: 'gap-2.5',
    defaultTagline: false,
  },
  md: {
    mark: 'h-14 w-14',
    wordmark: 'text-base',
    digital: 'text-xs',
    tagline: 'text-[10px]',
    gap: 'gap-3',
    defaultTagline: true,
  },
  lg: {
    mark: 'h-24 w-24 sm:h-28 sm:w-28',
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
            <span className="text-slate-200">ONE PLATFORM.</span>{' '}
            <span className="text-cyan-300">ONE PLACE.</span>{' '}
            <span className="text-slate-400">EVERYONE CONNECTED.</span>
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
          id="psd-p-back"
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#1E5BE0" />
          <stop offset="1" stopColor="#0F2D78" />
        </linearGradient>
        <linearGradient
          id="psd-p-front"
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#5EC9FF" />
          <stop offset="1" stopColor="#2C8DEF" />
        </linearGradient>
      </defs>

      {/* Back P (darker, offset down-right) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 14 H40 C49 14 55 20 55 28 C55 36 49 42 40 42 H30 V60 H18 Z M30 22 V34 H38 C41 34 43 32 43 28 C43 24 41 22 38 22 Z"
        fill="url(#psd-p-back)"
      />

      {/* Front P (brighter cyan-blue gradient, offset up-left) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 4 H32 C41 4 47 10 47 18 C47 26 41 32 32 32 H22 V50 H10 Z M22 12 V24 H30 C33 24 35 22 35 18 C35 14 33 12 30 12 Z"
        fill="url(#psd-p-front)"
      />
    </svg>
  );
}
