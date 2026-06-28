/**
 * Zapli brand mark.
 *
 * The visual hook: the dot of the "i" in "zapli" IS a lightning glyph in
 * electric cyan (#00D8C7). The wordmark is rendered as `zapl` + dotless `ı`
 * (U+0131) so we can position a crisp inline-SVG bolt where the tittle would
 * otherwise sit. Pure inline SVG — no network fetches, no external assets.
 *
 * `tone`:
 *   - "onLight" (default): slate-900 wordmark on a light background. Most
 *     surfaces in the product are light (paper, white cards, surface-0), so
 *     defaulting here keeps the wordmark visible when the prop is omitted.
 *   - "onDark":  white wordmark on a midnight background — pass this
 *     explicitly when placing the mark on bg-ink-0, bg-navy-900, bg-zapli-bg
 *     or any other dark surface.
 *
 * `mono` collapses the lightning to currentColor so the mark can sit on an
 * unknown background (e.g. inside a colored chip). When `mono` is set the
 * wordmark inherits `currentColor` too.
 */

type Size = 'sm' | 'md' | 'lg' | 'xl';
type Tone = 'onDark' | 'onLight';

export type ZapliLogoProps = {
  size?: Size;
  mono?: boolean;
  tone?: Tone;
  className?: string;
};

// Brand palette — keep these in sync with the design tokens.
const CYAN = '#00D8C7'; // electric cyan / turquoise neon
const WHITE = '#F8F9FA'; // platinum white
const DARK = '#1A1A1A'; // near-black for onLight wordmark

// Overall mark height in px (drives both wordmark + lightning).
const SIZE_PX: Record<Size, number> = {
  sm: 24,
  md: 32,
  lg: 44,
  xl: 64,
};

// Wordmark sizing. Cap height is tuned so the bolt-as-tittle sits cleanly
// above the "ı" stem at every size.
const TEXT_CLASS: Record<Size, string> = {
  sm: 'text-[18px] leading-none',
  md: 'text-[24px] leading-none',
  lg: 'text-[34px] leading-none',
  xl: 'text-[48px] leading-none',
};

// Bolt glyph height (replaces the tittle of "ı"). Scales with overall size.
const BOLT_PX: Record<Size, number> = {
  sm: 8,
  md: 11,
  lg: 15,
  xl: 22,
};

// Vertical offset of the bolt above the "ı" baseline-stem. Negative values
// lift the bolt into the tittle slot. Tuned per-size to keep optical balance.
const BOLT_TOP_PX: Record<Size, number> = {
  sm: -3,
  md: -4,
  lg: -6,
  xl: -9,
};

// Horizontal nudge so the bolt centers over the stem of the "ı". Poppins
// renders the dotless i slightly narrow, so a small left offset reads true.
const BOLT_LEFT_PX: Record<Size, number> = {
  sm: -0.5,
  md: -0.5,
  lg: -1,
  xl: -1,
};

export function ZapliLogo({
  size = 'md',
  mono = false,
  tone = 'onLight',
  className = '',
}: ZapliLogoProps) {
  const px = SIZE_PX[size];
  const boltSize = BOLT_PX[size];

  // Wordmark color: mono inherits, otherwise tone decides.
  const wordmarkColor = mono
    ? 'currentColor'
    : tone === 'onDark'
      ? WHITE
      : DARK;

  // Lightning fill: mono inherits, otherwise always electric cyan.
  const boltFill = mono ? 'currentColor' : CYAN;

  return (
    <span
      role="img"
      aria-label="Zapli"
      className={`inline-flex items-center font-display font-semibold tracking-tight ${TEXT_CLASS[size]} ${className}`}
      style={{ height: px, color: wordmarkColor }}
    >
      {/* zapl + dotless ı; the bolt below provides the tittle. */}
      <span aria-hidden="true">zapl</span>
      <span
        aria-hidden="true"
        className="relative inline-block"
        // The dotless i character (U+0131) renders without a tittle so the
        // lightning bolt can stand in as the dot without overlap artifacts.
      >
        {'ı'}
        <svg
          viewBox="0 0 24 32"
          height={boltSize}
          aria-hidden="true"
          focusable="false"
          className="absolute block"
          style={{
            top: BOLT_TOP_PX[size],
            left: `calc(50% + ${BOLT_LEFT_PX[size]}px)`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Minimalist bolt — sharp chevron with the classic notch. The
              viewBox is taller than wide so the glyph reads as a bolt at
              very small sizes without clipping the points. */}
          <path
            d="M14 0 2 18h8l-4 14L22 12h-8l4-12H14Z"
            fill={boltFill}
          />
        </svg>
      </span>
    </span>
  );
}

export default ZapliLogo;
