type Size = 'sm' | 'md' | 'lg' | 'xl';

const LOGO_URL =
  'https://raw.githubusercontent.com/Mauro1563/portal--services-website/main/logo%20png%20portal%20.PNG';

const sizeConfig: Record<
  Size,
  { h: string; pad: string; rounded: string }
> = {
  sm: { h: 'h-7', pad: 'px-2.5 py-1', rounded: 'rounded-lg' },
  md: { h: 'h-9', pad: 'px-3 py-1.5', rounded: 'rounded-xl' },
  lg: { h: 'h-12 sm:h-14', pad: 'px-4 py-2', rounded: 'rounded-2xl' },
  xl: { h: 'h-28 sm:h-36 lg:h-44', pad: 'px-6 py-3', rounded: 'rounded-3xl' },
};

/**
 * The logo PNG has a navy backdrop baked in.
 * - `wrap` (default) puts the PNG inside a navy pill so it reads as a
 *   brand badge against the light marketing canvas (nav, footer, etc).
 * - When `wrap={false}` we drop the pill so the PNG can sit directly
 *   on a navy background (hero) where its baked-in dark bg blends in.
 */
export function Logo({
  size = 'sm',
  className = '',
  wrap = true,
}: {
  size?: Size;
  className?: string;
  wrap?: boolean;
}) {
  const cfg = sizeConfig[size];

  if (!wrap) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={LOGO_URL}
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
        src={LOGO_URL}
        alt="Portal Services Digital"
        className={`block w-auto ${cfg.h}`}
      />
    </span>
  );
}
