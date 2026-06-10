'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { BRAND_COLOR_PRESETS, DEFAULT_BRAND_COLOR } from '@/lib/brand-colors';

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function BrandColorPicker({ defaultValue }: { defaultValue: string | null }) {
  const initial =
    defaultValue && HEX.test(defaultValue) ? defaultValue : DEFAULT_BRAND_COLOR;
  const [color, setColor] = useState(initial);

  const valid = HEX.test(color);

  return (
    <div className="space-y-3">
      <input type="hidden" name="brand_color" value={valid ? color : ''} />

      {/* Live preview swatch + hex */}
      <div className="flex items-center gap-3">
        <div
          className="h-14 w-14 shrink-0 rounded-xl shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)]"
          style={{
            background: valid
              ? `linear-gradient(135deg, ${color}E6 0%, ${color} 60%, ${shade(color, -18)} 100%)`
              : '#e2e8f0',
          }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <label className="block text-xs font-medium text-text-2">
            Hex
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value.trim())}
              maxLength={7}
              spellCheck={false}
              autoCapitalize="none"
              className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2 font-mono text-sm uppercase tracking-wider text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              placeholder="#2563EB"
            />
          </label>
          {!valid ? (
            <p className="mt-1 text-[11px] text-rose-600">
              Formato no válido. Usa #RGB o #RRGGBB.
            </p>
          ) : null}
        </div>
      </div>

      {/* Presets */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-3">
          Presets
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {BRAND_COLOR_PRESETS.map((preset) => {
            const active = preset.value.toLowerCase() === color.toLowerCase();
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => setColor(preset.value)}
                title={preset.label}
                aria-label={preset.label}
                aria-pressed={active}
                className="relative h-9 w-9 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgba(15,23,42,0.10)] transition hover:scale-110"
                style={{ background: preset.value }}
              >
                {active ? (
                  <Check
                    className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
                    style={{ color: contrast(preset.value) }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Darken/lighten a hex by `pct` percent (negative = darker).
function shade(hex: string, pct: number): string {
  const c = hex.replace('#', '');
  const full =
    c.length === 3
      ? c
          .split('')
          .map((x) => x + x)
          .join('')
      : c;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const adj = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v + (pct / 100) * (pct < 0 ? v : 255 - v))));
  return (
    '#' +
    [adj(r), adj(g), adj(b)].map((v) => v.toString(16).padStart(2, '0')).join('')
  );
}

// Pick black or white text depending on hex brightness for readable checkmark.
function contrast(hex: string): string {
  const c = hex.replace('#', '');
  const full =
    c.length === 3
      ? c
          .split('')
          .map((x) => x + x)
          .join('')
      : c;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  // YIQ luma
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? '#0f172a' : '#ffffff';
}
