/**
 * Decorative full-bleed background: floating soap bubbles. Pure CSS,
 * absolute-positioned, pointer-events-none. Drop into a relative
 * container — for example, behind a dashboard hero — to add the
 * "cleaning" theme without competing with content.
 */
export function BubbleBg({ density = 'normal' }: { density?: 'sparse' | 'normal' | 'dense' }) {
  const bubbles =
    density === 'sparse'
      ? BUBBLES.slice(0, 4)
      : density === 'dense'
      ? BUBBLES
      : BUBBLES.slice(0, 8);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-clean-aqua-glow/15 ring-1 ring-inset ring-white/30 animate-float"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

const BUBBLES = [
  { left: '8%', top: '18%', size: 16, delay: 0, duration: 6 },
  { left: '78%', top: '12%', size: 22, delay: 1.5, duration: 7 },
  { left: '45%', top: '65%', size: 14, delay: 0.8, duration: 5 },
  { left: '88%', top: '78%', size: 18, delay: 2.4, duration: 8 },
  { left: '12%', top: '72%', size: 12, delay: 3.1, duration: 6 },
  { left: '62%', top: '25%', size: 10, delay: 0.3, duration: 9 },
  { left: '32%', top: '40%', size: 8, delay: 1.9, duration: 7 },
  { left: '70%', top: '58%', size: 20, delay: 2.8, duration: 6 },
  { left: '22%', top: '88%', size: 11, delay: 4.0, duration: 8 },
  { left: '92%', top: '40%', size: 15, delay: 3.5, duration: 7 },
];
