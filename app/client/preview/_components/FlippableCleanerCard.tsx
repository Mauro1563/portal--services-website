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
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';

const COPY = {
  en: {
    backTitle: (firstName: string) => `Back to ${firstName}'s details`,
    meetTitle: (firstName: string) => `Meet ${firstName} — how she works`,
    backLabel: 'Details',
    meetLabel: 'Meet her',
    howWorks: (firstName: string) => `How ${firstName} works`,
    description:
      'Starts with the kitchen, uses eco products, and loves leaving the pillows hotel-style.',
    kitchen: 'Kitchen',
    bathroom: 'Bathroom',
    bedroom: 'Bedroom',
  },
  es: {
    backTitle: (firstName: string) => `Volver a los datos de ${firstName}`,
    meetTitle: (firstName: string) => `Conocer a ${firstName} — cómo trabaja`,
    backLabel: 'Datos',
    meetLabel: 'Conócela',
    howWorks: (firstName: string) => `Cómo trabaja ${firstName}`,
    description:
      'Empieza por la cocina, usa productos eco, y le encanta dejar las almohadas como en hotel.',
    kitchen: 'Cocina',
    bathroom: 'Baño',
    bedroom: 'Dormitorio',
  },
  pt: {
    backTitle: (firstName: string) => `Voltar aos dados de ${firstName}`,
    meetTitle: (firstName: string) => `Conhecer ${firstName} — como trabalha`,
    backLabel: 'Dados',
    meetLabel: 'Conhecê-la',
    howWorks: (firstName: string) => `Como trabalha ${firstName}`,
    description:
      'Começa pela cozinha, usa produtos eco e adora deixar as almofadas como num hotel.',
    kitchen: 'Cozinha',
    bathroom: 'Casa de banho',
    bedroom: 'Quarto',
  },
} as const satisfies Record<ClientLocale, unknown>;

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
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
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
            ? t.backTitle(firstName)
            : t.meetTitle(firstName)
        }
        aria-pressed={flipped}
        className="absolute -top-1 right-0 z-20 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 ring-1 ring-inset ring-slate-200 backdrop-blur transition hover:bg-white"
      >
        {/* Sparkle glyph: teal #00D8C7 — a tiny accent dot, no amber. */}
        <Sparkles className="h-3 w-3 text-[#00D8C7]" />
        {flipped ? t.backLabel : t.meetLabel}
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
            <CleanerBack cleanerName={firstName} t={t} />
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
            <CleanerBack cleanerName={firstName} t={t} />
          </div>
        </div>
      )}
    </div>
  );
}

function CleanerBack({
  cleanerName,
  t,
}: {
  cleanerName: string;
  t: (typeof COPY)['en'];
}) {
  // Back face: was an amber→gold "kintsugi" surface; now a clean white card
  // with a slate ring and a single teal eyebrow dot — on-palette.
  return (
    <div className="relative h-full rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-[#00D8C7]" />
        {t.howWorks(cleanerName)}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-700">
        {t.description}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <RoomIcon icon={ChefHat} label={t.kitchen} />
        <RoomIcon icon={Bath} label={t.bathroom} />
        <RoomIcon icon={Bed} label={t.bedroom} />
      </div>

      {/* Hairline accent across the bottom — kept as the same
          compositional flourish but recoloured from kintsugi gold to a
          single teal #00D8C7 stroke that fades at both ends. Sparse,
          per rule 7. */}
      <svg
        aria-hidden
        className="absolute inset-x-3 bottom-2 h-2"
        viewBox="0 0 200 8"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="kint-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="#00D8C7" stopOpacity="0" />
            <stop offset="50%"  stopColor="#00D8C7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00D8C7" stopOpacity="0" />
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
    /* Room icon: slate ink on white, slate hairline ring — no amber. */
    <div className="flex flex-col items-center gap-1 text-slate-700">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-inset ring-slate-200">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-[10px] font-semibold text-slate-600">{label}</span>
    </div>
  );
}
