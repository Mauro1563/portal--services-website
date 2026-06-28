# Zapli Brand Palette

The Zapli visual system is anchored on a deep midnight background, a single electric-cyan accent, a platinum white, and a tight grayscale ladder. Nine color tokens plus a glow shadow cover every surface in the app — defined once in `app/zapli-tokens.css` and consumed via Tailwind arbitrary values, the `zapli` Tailwind namespace, and the components in `components/brand/`.

> Component references in this doc: [`ZapliButton`](../components/brand/ZapliButton.tsx) and `ZapliMetricCard` (lives under `components/brand/`; consumes the same tokens).

## Palette

| Token                       | HEX        | Usage                                                                          |
| --------------------------- | ---------- | ------------------------------------------------------------------------------ |
| `--zapli-primary-accent`    | `#00D8C7`  | Cyan del rayo. Brand accent — primary CTA fill, focus rings, accent text.      |
| `--zapli-accent-hi`         | `#2BF0DE`  | Brighter cyan for hover/active states on the primary accent.                   |
| `--zapli-bg-deep`           | `#0A0D18`  | Azul medianoche. App background on dark surfaces — hero, marketing, app shell. |
| `--zapli-bg-surface`        | `#FFFFFF`  | Blanco puro. Light-mode card/surface fill.                                     |
| `--zapli-bg-card`           | `#A1A6BA`  | Gris claro de placa. Tinted card / chip surface on light backgrounds.          |
| `--zapli-text-on-dark`      | `#FFFFFF`  | Primary text on dark surfaces. Body copy + headlines in dark mode.             |
| `--zapli-text-on-light`     | `#1A1A1A`  | Primary text on light surfaces. Headings + body copy in light mode.            |
| `--zapli-text-subtle`       | `#A1A6BA`  | Secondary text — captions, labels, helper copy on either surface.              |
| `--zapli-border`            | `#81869D`  | 1px dividers / borders. Card edges, input outlines, section rules.             |
| `--zapli-glow`              | `0 0 24px rgba(0,216,199,0.45)` | Cyan halo for the primary CTA and accent-glow KPI numbers. |

> The palette is 9 color tokens plus 1 shadow token (`--zapli-glow`) — intentionally tight so every surface composes from the same atoms.

## Tailwind config snippet

Extend `tailwind.config.ts` so the tokens become first-class Tailwind utilities (`bg-zapli-bgDeep`, `text-zapli-primary`, etc.):

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        zapli: {
          primary:      '#00D8C7',
          primaryHi:    '#2BF0DE',
          bgDeep:       '#0A0D18',
          bgSurface:    '#FFFFFF',
          bgCard:       '#A1A6BA',
          textOnDark:   '#FFFFFF',
          textOnLight:  '#1A1A1A',
          textSubtle:   '#A1A6BA',
          border:       '#81869D',
        },
      },
      boxShadow: {
        'zapli-glow': '0 0 24px rgba(0,216,199,0.45)',
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
  --zapli-primary-accent: #00D8C7;   /* Cyan del rayo */
  --zapli-accent-hi:      #2BF0DE;   /* Hover variant */
  --zapli-bg-deep:        #0A0D18;   /* Azul medianoche */
  --zapli-bg-surface:     #FFFFFF;   /* Blanco puro */
  --zapli-bg-card:        #A1A6BA;   /* Gris claro de placa */
  --zapli-text-on-dark:   #FFFFFF;
  --zapli-text-on-light:  #1A1A1A;
  --zapli-text-subtle:    #A1A6BA;
  --zapli-border:         #81869D;
  --zapli-glow:           0 0 24px rgba(0,216,199,0.45);
}
```

## Usage examples

### Primary button with glow (`ZapliButton`)

The canonical hero CTA. `tone="primary"` paints `--zapli-primary-accent` on `--zapli-bg-deep` ink and applies `--zapli-glow`; hover lifts to `--zapli-accent-hi` with a 32px halo.

```tsx
import { ZapliButton } from '@/components/brand/ZapliButton';

<ZapliButton href="/signup" size="lg" tone="primary">
  Start 14-day free trial
</ZapliButton>
```

### Metric card (`ZapliMetricCard`)

White surface with a soft border (`--zapli-border`) and a cyan brand-dot anchoring the top-left. Text uses `--zapli-text-on-light` for AAA legibility.

```tsx
import { ZapliMetricCard } from '@/components/brand/ZapliMetricCard';

<ZapliMetricCard
  label="Active patients"
  value="1,284"
  delta={{ value: '+12.4%', positive: true }}
/>
```

### Dark-mode hero

Full-bleed `--zapli-bg-deep`, white headline on `--zapli-text-on-dark`, muted subhead on `--zapli-text-subtle`, primary CTA + ghost CTA pair.

```tsx
<section className="bg-zapli-bgDeep text-zapli-textOnDark py-24">
  <div className="mx-auto max-w-4xl text-center">
    <h1 className="text-5xl font-semibold tracking-tight">
      Run your clinic on autopilot.
    </h1>
    <p className="mt-4 text-lg text-zapli-textSubtle">
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

Page sits on `--zapli-bg-surface`; the card uses the same white with a `--zapli-border` hairline. Ink stays dark for AAA legibility.

```tsx
<section className="bg-zapli-bgSurface py-16">
  <article className="mx-auto max-w-md rounded-2xl bg-white border border-zapli-border p-6 shadow-sm">
    <h3 className="text-zapli-textOnLight text-xl font-semibold">Concierge onboarding</h3>
    <p className="mt-2 text-zapli-textSubtle">
      Migrate from your old PMS in under a week — we handle the import.
    </p>
  </article>
</section>
```

## Accessibility notes

WCAG 2.1 contrast targets — Normal text needs **4.5:1 (AA)** / **7:1 (AAA)**; Large text (≥18pt or ≥14pt bold) needs **3:1 (AA Large)** / **4.5:1 (AAA Large)**.

### Verified passing combos

| Foreground                                    | Background                              | Verdict                          |
| --------------------------------------------- | --------------------------------------- | -------------------------------- |
| `--zapli-text-on-dark` (`#FFFFFF`)            | `--zapli-bg-deep` (`#0A0D18`)           | AAA — body + headlines           |
| `--zapli-text-on-light` (`#1A1A1A`)           | `--zapli-bg-surface` (`#FFFFFF`)        | AAA — light-mode body            |
| `--zapli-text-on-light` (`#1A1A1A`)           | `--zapli-primary-accent` (`#00D8C7`)    | AAA — **the primary button**     |
| `--zapli-primary-accent` (`#00D8C7`)          | `--zapli-bg-deep` (`#0A0D18`)           | AAA — accent text on midnight    |

The primary button (dark ink on cyan) is intentional: it's the highest-contrast combination in the system, so the CTA always wins the page.

### AVOID

- **White text on `--zapli-primary-accent`** — `#FFFFFF` on `#00D8C7` fails AA. Always use `--zapli-bg-deep` or `--zapli-text-on-light` for text on the cyan.
- **`--zapli-primary-accent` on `--zapli-bg-surface`** — `#00D8C7` on white fails. For accent text in light mode, switch to a darker tint or use the accent only on dark backgrounds.
- **`--zapli-text-subtle` on `--zapli-bg-surface`** — `#A1A6BA` on white is borderline; pair with iconography or use `--zapli-text-on-light` for body copy.
- **`--zapli-accent-hi` on `--zapli-bg-surface`** — even lower contrast than the base accent. Hover state only, never resting text.
- **Pure `--zapli-glow` as a focus indicator** — the glow is decorative. `ZapliButton` correctly pairs it with a `focus-visible:ring-2` ring so keyboard users get a non-blurred outline.
