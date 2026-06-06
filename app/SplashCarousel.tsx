'use client';

import { useEffect, useState } from 'react';

type Slide = {
  eyebrow: string;
  accent: string;
  tail: string;
};

export function SplashCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[index];

  return (
    <div className="text-center">
      <div className="min-h-[88px] space-y-1 text-[11px] font-semibold tracking-[0.18em] sm:text-xs">
        <p className="text-slate-300">{slide.eyebrow}</p>
        <p className="bg-brand-gradient bg-clip-text text-transparent">
          {slide.accent}
        </p>
        <p className="text-slate-300">{slide.tail}</p>
      </div>
      <div className="mt-8 flex items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={
              'h-1.5 rounded-full transition-all ' +
              (i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50')
            }
          />
        ))}
      </div>
    </div>
  );
}
