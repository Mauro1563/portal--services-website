/**
 * Small visual flourish — three twinkling sparkles arranged at the
 * corners of whatever the parent is. Pure CSS / decorative, no
 * interactivity. Used on dashboard hero cards / completion screens to
 * lean into the cleaning theme without being noisy.
 */
export function Sparkle({
  className = '',
  intensity = 'soft',
}: {
  className?: string;
  intensity?: 'soft' | 'bright';
}) {
  const color = intensity === 'bright' ? 'text-clean-aqua-glow' : 'text-clean-aqua-soft';

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <span
        className={`absolute left-[8%] top-[20%] text-[10px] ${color} animate-sparkle`}
        style={{ animationDelay: '0s' }}
      >
        ✦
      </span>
      <span
        className={`absolute right-[12%] top-[30%] text-[14px] ${color} animate-sparkle`}
        style={{ animationDelay: '0.7s' }}
      >
        ✦
      </span>
      <span
        className={`absolute right-[18%] bottom-[18%] text-[11px] ${color} animate-sparkle`}
        style={{ animationDelay: '1.4s' }}
      >
        ✦
      </span>
    </div>
  );
}
