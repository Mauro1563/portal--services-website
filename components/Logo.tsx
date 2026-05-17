type Size = 'sm' | 'md' | 'lg';

const LOGO_URL =
  'https://raw.githubusercontent.com/Mauro1563/portal--services-website/main/logo%20png%20portal%20.PNG';

// Aspect ratio used to crop the embedded tagline out of the PNG.
// The image includes a tagline strip at the bottom; this ratio shows
// the full mark + wordmark (incl. DIGITAL) while hiding the tagline.
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
        <p
          className={`text-center font-semibold tracking-[0.2em] ${cfg.tagline}`}
        >
          <span className="text-slate-200">ONE PLATFORM.</span>{' '}
          <span className="text-cyan-300">ONE PLACE.</span>{' '}
          <span className="text-slate-400">EVERYONE CONNECTED.</span>
        </p>
      )}
    </div>
  );
}
