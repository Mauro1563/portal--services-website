# Zapli Brand Tokens

Exact color tokens for the Zapli brand. Defined under `theme.extend.colors.zapli`
in `tailwind.config.ts` so they're accessible via Tailwind utilities.

## Tokens

| Token              | Hex       | Role                    |
| ------------------ | --------- | ----------------------- |
| `zapli.midnight`   | `#0D0D11` | background              |
| `zapli.neon`       | `#00D8C7` | electric cyan accent    |
| `zapli.platinum`   | `#F8F9FA` | text white              |

## Usage examples

### Backgrounds

```tsx
// Page-level dark canvas
<main className="bg-zapli-midnight min-h-screen text-zapli-platinum">
  {/* ... */}
</main>
```

### Accents (buttons, links, focus rings)

```tsx
<button className="bg-zapli-neon text-zapli-midnight hover:opacity-90">
  Get started
</button>

<a className="text-zapli-neon underline underline-offset-4">Learn more</a>

<input className="focus:ring-2 focus:ring-zapli-neon focus:outline-none" />
```

### Text

```tsx
<h1 className="text-zapli-platinum font-display text-5xl">Zapli</h1>
<p className="text-zapli-platinum/70">Subtle secondary text via opacity.</p>
```

### Borders / dividers

```tsx
<div className="border border-zapli-neon/30 rounded-2xl p-6 bg-zapli-midnight">
  Bordered neon card
</div>
```

### Arbitrary properties

Use the token names with `[]` syntax for properties Tailwind doesn't have first-class utilities for:

```tsx
<div className="shadow-[0_0_40px_-8px_theme(colors.zapli.neon)]" />
```

## Rules

- Do not modify existing palettes (`brand`, `accent`, `ink`, `navy`, `clean`, etc.).
- Only the three Zapli tokens above are canonical — no shade ramps yet.
- For opacity variants, prefer Tailwind's `/` syntax (e.g. `bg-zapli-neon/20`)
  over introducing new hex values.
