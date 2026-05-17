type Size = 'sm' | 'md' | 'lg';

const LOGO_URL =
  'https://raw.githubusercontent.com/Mauro1563/portal--services-website/main/logo%20png.PNG';

const sizeClasses: Record<Size, string> = {
  sm: 'h-12 w-auto sm:h-14',
  md: 'h-auto w-full max-w-[280px]',
  lg: 'h-auto w-full max-w-md sm:max-w-lg',
};

export function Logo({
  size = 'sm',
  className = '',
}: {
  size?: Size;
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <>
      {/* SVG filter that turns near-white pixels transparent */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute h-0 w-0"
      >
        <filter id="psd-logo-keyout" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 3 0"
          />
        </filter>
      </svg>

      <img
        src={LOGO_URL}
        alt="Portal Services Digital — One platform. One place. Everyone connected."
        className={`${sizeClasses[size]} ${className}`}
        style={{ filter: 'url(#psd-logo-keyout)' }}
      />
    </>
  );
}
