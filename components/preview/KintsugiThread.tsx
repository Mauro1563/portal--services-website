'use client';

/**
 * KintsugiThread
 * --------------
 * A single hairline moss thread that grows under the cleaner's name as
 * tasks get completed. The path is an irregular, calligraphic stroke
 * (not a generic progress bar) segmented at task fractions. We animate
 * stroke-dashoffset from 100 → 100 - progress*100 with a CSS transition;
 * when progress reaches 100% the stroke briefly blooms in width and
 * picks up a mandarin glint, then settles, and a tiny mono caption
 * fades in once.
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
            <stop offset="0%" stopColor="#3F5B3A" />
            <stop offset="50%" stopColor="#3F5B3A" />
            <stop offset="100%" stopColor="#3F5B3A" />
          </linearGradient>
          <linearGradient id="kintsugiBloom" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3F5B3A" />
            <stop offset="50%" stopColor="#FF5B1F" />
            <stop offset="100%" stopColor="#3F5B3A" />
          </linearGradient>
        </defs>
        {/* Faint baseline so a 0/totalCount day still has a hint of the form. */}
        <path
          d={PATH_D}
          stroke="rgba(20,20,20,0.10)"
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
              'stroke-dashoffset var(--dur-base) var(--ease), stroke-width var(--dur-slow) var(--ease), stroke var(--dur-slow) var(--ease)',
            filter: bloomed
              ? 'drop-shadow(0 0 4px rgba(255, 91, 31, 0.40))'
              : 'none',
          }}
        />
      </svg>
      <p
        className={`ps-mono mt-1 text-[12px] text-[#3F5B3A] transition-opacity ${
          showCaption ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDuration: 'var(--dur-slow)', transitionTimingFunction: 'var(--ease)' }}
        aria-live="polite"
      >
        {showCaption ? 'jornada completa' : ' '}
      </p>
    </div>
  );
}
