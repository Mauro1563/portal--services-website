/**
 * FlippableCleanerCard — a 3D Y-axis card flip that reveals the
 * "cómo trabaja" side of a cleaner profile. Front shows the existing
 * avatar + rating + recent jobs; back shows a short personality note,
 * favorite-room icons, and a subtle kintsugi-style gold accent line.
 *
 * Pure CSS transform: perspective on the outer wrapper, the inner
 * card uses transform-style: preserve-3d and rotates rotateY(180deg)
 * to flip. Front/back are absolutely positioned with
 * backface-visibility: hidden. 600ms cubic-bezier(0.22, 1, 0.36, 1) —
 * a single confident flip, not a wobble. Reduced motion → cross-fade
 * the two panels instead.
 */
'use client';

import { Bath, Bed, ChefHat, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function FlippableCleanerCard({
  front,
  cleanerName,
}: {
  /** The existing avatar + rating + recent-jobs block. */
  front: React.ReactNode;
  cleanerName: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const [reduced, setReduced] = useState(false);
  // We need the back panel's natural height so the wrapper sizes
  // correctly when the back is taller than the front.
  const frontRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);
  const [minH, setMinH] = useState<number | undefined>(undefined);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    const fh = frontRef.current?.offsetHeight ?? 0;
    const bh = backRef.current?.offsetHeight ?? 0;
    setMinH(Math.max(fh, bh));
  }, [front]);

  const firstName = cleanerName.split(' ')[0] ?? cleanerName;

  return (
    <div className="relative" style={{ perspective: '1200px' }}>
      {/* "Conócela" toggle chip — discreet, top-right corner. */}
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        title={
          flipped
            ? `Volver a los datos de ${firstName}`
            : `Conocer a ${firstName} — cómo trabaja`
        }
        aria-pressed={flipped}
        className="ps-mono absolute -top-1 right-0 z-20 inline-flex items-center gap-1 rounded-full border border-[#1414141A] px-2.5 py-1 text-[10px] text-[#141414] backdrop-blur transition"
        style={{ backgroundColor: 'rgba(244, 239, 230, 0.92)', transitionDuration: '160ms' }}
      >
        <Sparkles className="h-3 w-3" style={{ color: '#FF5B1F' }} />
        {flipped ? 'datos' : 'conócela'}
      </button>

      {reduced ? (
        // Reduced-motion: cross-fade the two panels stacked.
        <div className="relative" style={{ minHeight: minH }}>
          <div
            ref={frontRef}
            className="transition-opacity duration-200"
            style={{ opacity: flipped ? 0 : 1, position: flipped ? 'absolute' : 'static', inset: 0 }}
          >
            {front}
          </div>
          <div
            ref={backRef}
            className="transition-opacity duration-200"
            style={{ opacity: flipped ? 1 : 0, position: flipped ? 'static' : 'absolute', inset: 0 }}
          >
            <CleanerBack cleanerName={firstName} />
          </div>
        </div>
      ) : (
        <div
          className={`client-card-flip relative ${flipped ? 'client-card-flipped' : ''}`}
          style={{ minHeight: minH }}
        >
          <div ref={frontRef} className="client-card-face">
            {front}
          </div>
          <div
            ref={backRef}
            className="client-card-face client-card-back absolute inset-0"
          >
            <CleanerBack cleanerName={firstName} />
          </div>
        </div>
      )}
    </div>
  );
}

function CleanerBack({ cleanerName }: { cleanerName: string }) {
  return (
    <div
      className="relative h-full rounded-[12px] border border-[#1414141A] p-5"
      style={{ backgroundColor: '#E8C8C0' }}
    >
      <p className="ps-mono text-[11px] text-[#54524D]">
        <span
          style={{
            backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 1px',
            backgroundPosition: '0 calc(100% + 3px)',
            paddingBottom: '3px',
          }}
        >
          cómo trabaja {cleanerName.toLowerCase()}
        </span>
      </p>
      <p className="ps-serif mt-3 text-[18px] leading-snug tracking-[-0.015em] text-[#141414]">
        Empieza por la cocina, usa productos eco, y le encanta dejar las
        almohadas como en hotel.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <RoomIcon icon={ChefHat} label="Cocina" />
        <RoomIcon icon={Bath} label="Baño" />
        <RoomIcon icon={Bed} label="Dormitorio" />
      </div>

      {/* Kintsugi-style accent — re-skinned to mandarin per the design
          brief (the per-portal delight uses only the portal's secondary
          color + mandarin; here we lean on mandarin against petal so the
          stitch reads as "repaired with gold" without literal gold). */}
      <svg
        aria-hidden
        className="absolute inset-x-3 bottom-2 h-2"
        viewBox="0 0 200 8"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="kint-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="#FF5B1F" stopOpacity="0" />
            <stop offset="35%"  stopColor="#FF5B1F" stopOpacity="1" />
            <stop offset="65%"  stopColor="#FF5B1F" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF5B1F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M2,4 Q40,1 80,4 T140,5 T198,3"
          fill="none"
          stroke="url(#kint-grad)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function RoomIcon({
  icon: Icon,
  label,
}: {
  icon: typeof ChefHat;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-[#141414]">
      <span
        className="grid h-10 w-10 place-items-center rounded-[12px] border border-[#1414141A]"
        style={{ backgroundColor: '#F4EFE6' }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="ps-mono text-[10px] text-[#54524D]">{label.toLowerCase()}</span>
    </div>
  );
}
