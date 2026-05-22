type Size = 'sm' | 'md' | 'lg';

const LOGO_URL =
  'https://raw.githubusercontent.com/Mauro1563/portal--services-website/main/logo%20png%20portal%20.PNG';

const sizeConfig: Record<Size, { h: string; pad: string; rounded: string }> = {
  sm: { h: 'h-7', pad: 'px-2.5 py-1', rounded: 'rounded-lg' },
  md: { h: 'h-9', pad: 'px-3 py-1.5', rounded: 'rounded-xl' },
  lg: { h: 'h-12 sm:h-14', pad: 'px-4 py-2', rounded: 'rounded-2xl' },
};

/**
 * The logo PNG has a navy backdrop baked in. We present it inside a
 * matching navy pill so on the light marketing canvas it reads as a
 * proper brand badge instead of a hard rectangle. Height-driven sizing
 * with `w-auto` preserves the full wordmark — no more cropping.
 */
export function Logo({
  size = 'sm',
  className = '',
}: {
  size?: Size;
  className?: string;
}) {
  const cfg = sizeConfig[size];
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
