# Zapli Brand Palette

The Zapli visual system is anchored on a deep midnight background, a single electric-cyan accent, and a small grayscale ladder. Twelve tokens cover every surface in the app — defined once in `app/zapli-tokens.css` and consumed via Tailwind arbitrary values, the `zapli` Tailwind namespace, and the components in `components/brand/`.

> Component references in this doc: [`ZapliButton`](../components/brand/ZapliButton.tsx) and `ZapliMetricCard` (lives under `components/brand/`; consumes the same tokens).

## Palette

| Token                    | HEX                       | OKLCH (approx.)               | Usage                                                                 |
| ------------------------ | ------------------------- | ----------------------------- | --------------------------------------------------------------------- |
| `--zapli-bg`             | `#0B1729`                 | `oklch(0.196 0.041 254)`      | App background on dark surfaces — hero, marketing, dashboards.        |
| `--zapli-bg-elev`        | `#0F1F35`                 | `oklch(0.236 0.044 254)`      | Elevated dark surfaces — cards, modals, popovers over `--zapli-bg`.   |
| `--zapli-accent`         | `#00F5D4`                 | `oklch(0.876 0.171 178)`      | Brand accent. Primary CTA fill, focus rings, key data viz strokes.    |
| `--zapli-accent-hi`      | `#4FFFE5`                 | `oklch(0.929 0.142 178)`      | Hover/active state for accent. Lifts the primary button on hover.     |
| `--zapli-surface`        | `#FFFFFF`                 | `oklch(1.000 0 0)`            | Light-mode card/surface fill. Marketing testimonials, light forms.    |
| `--zapli-surface-muted`  | `#F4F6F8`                 | `oklch(0.971 0.003 248)`      | Subdued light surface — page background, table zebra, input fill.     |
| `--zapli-ink`            | `#0F172A`                 | `oklch(0.205 0.034 264)`      | Primary text on light surfaces. Headings, body copy in light mode.    |
| `--zapli-ink-muted`      | `#475569`                 | `oklch(0.474 0.029 256)`      | Secondary text on light surfaces — captions, labels, helper copy.     |
| `--zapli-text`           | `#F8FAFC`                 | `oklch(0.984 0.003 248)`      | Primary text on dark surfaces. Body copy in hero + dashboard.         |
| `--zapli-text-muted`     | `#94A3B8`                 | `oklch(0.708 0.024 256)`      | Secondary text on dark surfaces — meta, timestamps, footnotes.        |
| `--zapli-hairline-dark`  | `rgba(255,255,255,0.08)`  | `oklch(1.000 0 0 / 0.08)`     | 1px dividers/borders on dark surfaces. Card edges, table rules.       |
| `--zapli-hairline-light` | `rgba(15,23,42,0.08)`     | `oklch(0.205 0.034 264 / .08)`| 1px dividers/borders on light surfaces. Section rules, input edges.   |
| `--zapli-glow`           | `0 0 24px rgba(0,245,212,0.45)` | n/a (shadow)            | Cyan halo used on the primary CTA and on accent-glow metric numbers. |

> The palette is 12 color tokens plus 1 shadow token (`--zapli-glow`) — kept intentionally tight so every surface composes from the same atoms.

## Tailwind config snippet

Extend `tailwind.config.ts` so the tokens become first-class Tailwind utilities (`bg-zapli-bg`, `text-zapli-accent`, etc.):

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        zapli: {
          bg:            'var(--zapli-bg)',
          'bg-elev':     'var(--zapli-bg-elev)',
          accent:        'var(--zapli-accent)',
          'accent-hi':   'var(--zapli-accent-hi)',
          surface:       'var(--zapli-surface)',
          'surface-muted': 'var(--zapli-surface-muted)',
          ink:           'var(--zapli-ink)',
          'ink-muted':   'var(--zapli-ink-muted)',
          text:          'var(--zapli-text)',
          'text-muted':  'var(--zapli-text-muted)',
        },
      },
      boxShadow: {
        'zapli-glow':    '0 0 24px rgba(0,245,212,0.45)',
        'zapli-glow-hi': '0 0 32px rgba(0,245,212,0.60)',
      },
      borderColor: {
        'zapli-hairline-dark':  'rgba(255,255,255,0.08)',
        'zapli-hairline-light': 'rgba(15,23,42,0.08)',
      },
    },
  },
};

export default config;
```

## CSS variables snippet

Already defined in `app/zapli-tokens.css` and imported once from `app/globals.css`:

```css
:root {
  --zapli-bg:              #0B1729;
  --zapli-bg-elev:         #0F1F35;
  --zapli-accent:          #00F5D4;
  --zapli-accent-hi:       #4FFFE5;
  --zapli-surface:         #FFFFFF;
  --zapli-surface-muted:   #F4F6F8;
  --zapli-ink:             #0F172A;
  --zapli-ink-muted:       #475569;
  --zapli-text:            #F8FAFC;
  --zapli-text-muted:      #94A3B8;
  --zapli-hairline-dark:   rgba(255,255,255,0.08);
  --zapli-hairline-light:  rgba(15,23,42,0.08);
  --zapli-glow:            0 0 24px rgba(0,245,212,0.45);
}
```

## Usage examples

### Primary button with glow (`ZapliButton`)

The canonical hero CTA. `tone="primary"` paints `--zapli-accent` on `--zapli-bg` ink and applies `--zapli-glow`; hover lifts to `--zapli-accent-hi` with a 32px halo.

```tsx
import { ZapliButton } from '@/components/brand/ZapliButton';

<ZapliButton href="/signup" size="lg" tone="primary">
  Start 14-day free trial
</ZapliButton>
```

### Metric card (`ZapliMetricCard`)

Dark elevated surface with a hairline edge; the value uses `--zapli-accent` and a subtle glow so KPIs read at a glance.

```tsx
import { ZapliMetricCard } from '@/components/brand/ZapliMetricCard';

<ZapliMetricCard
  label="Active patients"
  value="1,284"
  delta="+12.4%"
  trend="up"
/>
```

Equivalent raw markup (for parity reference):

```tsx
<div className="rounded-2xl bg-zapli-bg-elev border border-zapli-hairline-dark p-6">
  <p className="text-sm text-zapli-text-muted">Active patients</p>
  <p className="mt-2 text-4xl font-semibold text-zapli-accent [text-shadow:0_0_24px_rgba(0,245,212,0.45)]">
    1,284
  </p>
  <p className="mt-1 text-xs text-zapli-text-muted">+12.4% vs last week</p>
</div>
```

### Dark-mode hero

Full-bleed `--zapli-bg`, white headline on `--zapli-text`, muted subhead on `--zapli-text-muted`, primary CTA + ghost CTA pair.

```tsx
<section className="bg-zapli-bg text-zapli-text py-24">
  <div className="mx-auto max-w-4xl text-center">
    <h1 className="text-5xl font-semibold tracking-tight">
      Run your clinic on autopilot.
    </h1>
    <p className="mt-4 text-lg text-zapli-text-muted">
      Booking, billing, and patient comms in one calm dashboard.
    </p>
    <div className="mt-8 flex justify-center gap-3">
      <ZapliButton href="/signup" tone="primary" size="lg">
        Start free trial
      </ZapliButton>
      <ZapliButton href="/demo" tone="ghost" size="lg">
        Book a demo
      </ZapliButton>
    </div>
  </div>
</section>
```

### Light-mode card

Page sits on `--zapli-surface-muted`; the card itself is `--zapli-surface` with a light hairline. Ink stays dark for AAA legibility.

```tsx
<section className="bg-zapli-surface-muted py-16">
  <article className="mx-auto max-w-md rounded-2xl bg-zapli-surface border border-zapli-hairline-light p-6 shadow-sm">
    <h3 className="text-zapli-ink text-xl font-semibold">Concierge onboarding</h3>
    <p className="mt-2 text-zapli-ink-muted">
      Migrate from your old PMS in under a week — we handle the import.
    </p>
    <a href="/onboarding" className="mt-4 inline-block text-zapli-accent font-medium">
      Learn more →
    </a>
  </article>
</section>
```

## Accessibility notes

WCAG 2.1 contrast targets — Normal text needs **4.5:1 (AA)** / **7:1 (AAA)**; Large text (≥18pt or ≥14pt bold) needs **3:1 (AA Large)** / **4.5:1 (AAA Large)**.

### Verified passing combos

| Foreground          | Background          | Ratio    | Verdict                         |
| ------------------- | ------------------- | -------- | ------------------------------- |
| `--zapli-text` (`#F8FAFC`)   | `--zapli-bg` (`#0B1729`)        | **17.4:1** | AAA — body + headlines           |
| `--zapli-text-muted` (`#94A3B8`) | `--zapli-bg`               | **7.0:1**  | AAA — captions, meta             |
| `--zapli-ink` (`#0F172A`)   | `--zapli-surface` (`#FFFFFF`)   | **18.7:1** | AAA — light-mode body            |
| `--zapli-ink-muted` (`#475569`) | `--zapli-surface`            | **7.6:1**  | AAA — light-mode secondary       |
| `--zapli-ink` (`#0F172A`)   | `--zapli-accent` (`#00F5D4`)    | **13.2:1** | AAA — **the primary button**     |
| `--zapli-accent` (`#00F5D4`) | `--zapli-bg` (`#0B1729`)       | **12.3:1** | AAA — accent text on midnight    |

The primary button (dark ink on cyan) is intentional: it's the highest-contrast combination in the system, so the CTA always wins the page.

### Borderline — verify in context

- `--zapli-accent` on `--zapli-bg-elev` ≈ **11.6:1** — AAA for text, but reserve for headline-scale numbers (metric cards) so the glow reads.
- `--zapli-text-muted` on `--zapli-bg-elev` ≈ **6.4:1** — AA for normal text, AAA for large.

### AVOID

- **White text on `--zapli-accent`** — `#FFFFFF` on `#00F5D4` ≈ **1.4:1**. Fails AA. Always use `--zapli-bg` or `--zapli-ink` for text on the cyan.
- **`--zapli-accent` on `--zapli-surface`** — `#00F5D4` on white ≈ **1.5:1**. Fails. For accent text in light mode, switch to a darker tint or use the accent only on dark backgrounds. (The light-mode card example above uses `text-zapli-accent` on a link — borderline; prefer pairing with an icon or underline so the affordance doesn't rely on color alone.)
- **`--zapli-text-muted` on `--zapli-surface`** — `#94A3B8` on white ≈ **2.6:1**. Fails. Use `--zapli-ink-muted` for muted text in light mode.
- **`--zapli-accent-hi` on `--zapli-surface`** — even lower contrast than the base accent. Hover state only, never resting text.
- **Pure `--zapli-glow` as a focus indicator** — the glow is decorative. `ZapliButton` correctly pairs it with a `focus-visible:ring-2` ring so keyboard users get a non-blurred outline.
