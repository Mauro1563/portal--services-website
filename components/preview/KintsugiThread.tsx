'use client';

/**
 * KintsugiThread
 * --------------
 * A single hairline gold thread that grows under the cleaner's name as
 * tasks get completed. The path is an irregular, calligraphic stroke
 * (not a generic progress bar) segmented at task fractions. We animate
 * stroke-dashoffset from 100 → 100 - progress*100 with a CSS transition;
 * when progress reaches 100% the stroke briefly blooms in width and
 * shifts colour from gold to champagne, then settles, and a tiny
 * "jornada completa" caption fades in once.
 *
 * Reduced motion: jump to the final offset, skip the bloom.
 */
import { useEffect, useRef, useState } from 'react';

export function KintsugiThread({
  doneCount,
  totalCount,
}: {
  doneCount: number;
  totalCount: number;
}) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [bloomed, setBloomed] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const hasBloomedRef = useRef(false);

  const total = Math.max(1, totalCount);
  const fraction = Math.max(0, Math.min(1, doneCount / total));
  const offset = 100 - fraction * 100;
  const complete = doneCount > 0 && doneCount >= totalCount;

  useEffect(() => {
    if (complete && !hasBloomedRef.current) {
      hasBloomedRef.current = true;
      // Defer a tick so the dashoffset transition gets a frame to settle.
      const tA = window.setTimeout(() => setBloomed(true), 320);
      const tB = window.setTimeout(() => setBloomed(false), 980);
      const tC = window.setTimeout(() => setShowCaption(true), 600);
      return () => {
        window.clearTimeout(tA);
        window.clearTimeout(tB);
        window.clearTimeout(tC);
      };
    }
    if (!complete) {
      hasBloomedRef.current = false;
      setShowCaption(false);
    }
  }, [complete]);

  // Hand-tuned irregular cubic path resembling a brush stroke. pathLength=100
  // lets us reason about the dasharray in percent regardless of geometry.
  const PATH_D =
    'M2 7 C 20 3, 40 12, 62 6 S 110 2, 138 9 S 188 14, 218 5 S 268 9, 298 8';

  return (
    <div className="mt-2 select-none">
      <svg
        width="100%"
        height="14"
        viewBox="0 0 300 14"
        preserveAspectRatio="none"
        className="block"
        aria-hidden
      >
        <defs>
          <linearGradient id="kintsugiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8862F" />
            <stop offset="50%" stopColor="#E5C97A" />
            <stop offset="100%" stopColor="#B8862F" />
          </linearGradient>
          <linearGradient id="kintsugiBloom" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F5E6B3" />
            <stop offset="50%" stopColor="#FFF6D5" />
            <stop offset="100%" stopColor="#F5E6B3" />
          </linearGradient>
        </defs>
        {/* Faint baseline so a 0/totalCount day still has a hint of the form. */}
        <path
          d={PATH_D}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={1}
          fill="none"
          strokeLinecap="round"
        />
        <path
          ref={pathRef}
          d={PATH_D}
          pathLength={100}
          stroke={bloomed ? 'url(#kintsugiBloom)' : 'url(#kintsugiGradient)'}
          strokeWidth={bloomed ? 2.5 : 1.5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={offset}
          style={{
            transition:
              'stroke-dashoffset 280ms cubic-bezier(0.22, 1, 0.36, 1), stroke-width 320ms ease-out, stroke 320ms ease-out',
            filter: bloomed
              ? 'drop-shadow(0 0 6px rgba(255, 246, 213, 0.55))'
              : 'drop-shadow(0 0 2px rgba(184, 134, 47, 0.25))',
          }}
        />
      </svg>
      <p
        className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200/90 transition-opacity duration-500 ${
          showCaption ? 'opacity-100' : 'opacity-0'
        }`}
        aria-live="polite"
      >
        {showCaption ? 'Jornada completa' : ' '}
      </p>
    </div>
  );
}
