type Size = 'sm' | 'md' | 'lg' | 'xl';

const LOGO_DARK_URL =
  'https://raw.githubusercontent.com/Mauro1563/portal--services-website/main/logo%20png%20portal%20.PNG';

/** Light-canvas brand mark with the tagline baked in. Stored in /public. */
const LOGO_FULL_URL = '/Photoroom_20260522_163830.png';

const sizeConfig: Record<
  Size,
  { h: string; pad: string; rounded: string }
> = {
  sm: { h: 'h-7', pad: 'px-2.5 py-1', rounded: 'rounded-lg' },
  md: { h: 'h-9', pad: 'px-3 py-1.5', rounded: 'rounded-xl' },
  lg: { h: 'h-12 sm:h-14', pad: 'px-4 py-2', rounded: 'rounded-2xl' },
  xl: { h: 'h-40 sm:h-52 lg:h-64', pad: 'px-6 py-3', rounded: 'rounded-3xl' },
};

/**
 * Two-variant logo:
 * - default: the small dark-bg PNG (great for nav / footer). Wrap in a
 *   navy pill on light backgrounds (`wrap`), or render raw on dark
 *   sections (`wrap={false}`).
 * - variant="full": the white-bg brand mark with the tagline baked in.
 *   Used for the hero centrepiece. Sits naturally on the light canvas.
 */
export function Logo({
  size = 'sm',
  className = '',
  wrap = true,
  variant = 'default',
}: {
  size?: Size;
  className?: string;
  wrap?: boolean;
  variant?: 'default' | 'full';
}) {
  const cfg = sizeConfig[size];

  if (variant === 'full') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={LOGO_FULL_URL}
        alt="Portal Services Digital — One platform. One place. Everyone connected."
        className={`block w-auto ${cfg.h} ${className}`}
      />
    );
  }

  if (!wrap) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={LOGO_DARK_URL}
        alt="Portal Services Digital"
        className={`block w-auto ${cfg.h} ${className}`}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center bg-ink-0 ${cfg.pad} ${cfg.rounded} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_DARK_URL}
        alt="Portal Services Digital"
        className={`block w-auto ${cfg.h}`}
      />
    </span>
  );
}
