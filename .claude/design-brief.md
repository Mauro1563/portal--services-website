# Portal Services — 2026 Visual Direction

**One system. Four surfaces.** Marketing site + Owner / Cleaner / Client portals share a single visual language so the demos feel like one product, not three. Bold, opinionated, editorial. Built to look unmistakable next to a Jobber or ServiceTitan screenshot.

> **North star:** if a designer at Linear, Vercel, or Arc looked at this and said "huh — who made that?", we win. If they say "Tailwind UI template," we lose. The current cyan→blue gradient hero is a Tailwind UI template. Replace it.

---

## Paleta

A warm-paper canvas, a near-black ink, and one **electric mandarin** that does ALL the heavy lifting. No cyan. No purple. No "trust blue." The accent is the brand — it shows up once per screen and earns the whole identity.

| Token            | HEX       | OKLCH                    | Role |
|------------------|-----------|--------------------------|------|
| `--paper`        | `#F4EFE6` | `oklch(94% 0.018 78)`    | Page canvas. Warm bone, slightly creamier than `#F5F5F4`, never `#FFFFFF`. Replaces `bg-slate-50` and `bg-white` everywhere. |
| `--ink`          | `#141414` | `oklch(18% 0.005 60)`    | Headings + body. Near-black, very slight warm tint so it sits on `--paper`. Replaces `text-slate-900`. |
| `--graphite`     | `#54524D` | `oklch(45% 0.008 80)`    | Secondary copy, meta. Replaces every `text-slate-600/500`. |
| `--mandarin`     | `#FF5B1F` | `oklch(68% 0.21 38)`     | THE accent. Primary CTA fill, hero punctuation, focus rings, active states. Used at ~5-8% of pixels — when it appears, it leads. |
| `--mandarin-ink` | `#1A0A04` | `oklch(15% 0.05 38)`     | Text on mandarin surfaces (better than white at this hue — gives the brand a hand-set print feel). |
| `--moss`         | `#3F5B3A` | `oklch(45% 0.06 135)`    | Reserved utility: success states + a single per-portal accent variant. Never decorative. |
| `--clay`         | `#E4DACA` | `oklch(88% 0.022 82)`    | Card surface when it must sit on `--paper`. The "second paper." Replaces every `bg-white` card. |
| `--hairline`     | `#1414141A` | `rgb(20 20 20 / 0.10)` | The only border color. 1px, full perimeter, no exceptions. |

**Rules.** Mandarin appears AT MOST once per viewport as a fill. After that it's allowed as a 1px underline, a focus ring, or a 6% tinted wash on a single card. The blue-to-cyan gradient tile on the marketing landing is a kill. The amber/emerald/sky stat chips on the client portal are a kill. State semantics (success/error/warning) collapse to: moss / mandarin / mandarin — yes, we use the same accent for warning and for CTA, because state is communicated by **shape and copy** (icon + label), not by chromatic hierarchy.

---

## Tipografía

**Display:** swap Poppins for **Instrument Serif** (Google Fonts) for h1–h2. Poppins is the AI-default friendly geometric — Instrument Serif is what 2026 looks like: high-contrast serif with character, free, performant. Pair with **Geist Sans** (or keep Inter if Geist isn't installed) for body. Tabular numerals come from Geist Mono / Inter's `tnum` feature for KPI digits.

**Scale (Tailwind classes, mobile → desktop).** Aggressive, committed jumps. No `text-3xl sm:text-5xl lg:text-6xl` mush.

| Role           | Mobile          | Desktop         | Font / weight                              | Notes |
|----------------|-----------------|-----------------|--------------------------------------------|-------|
| Hero h1        | `text-[44px]`   | `text-[112px]`  | Instrument Serif, weight 400, italic optional on last word | `leading-[0.92]`, `tracking-[-0.04em]`. NO gradient text. NO uppercase. |
| Section h2     | `text-[32px]`   | `text-[64px]`   | Instrument Serif 400                       | `leading-[0.95]`, `tracking-[-0.03em]`. |
| Card title h3  | `text-[20px]`   | `text-[24px]`   | Geist Sans 600                             | `tracking-[-0.015em]`. |
| Body lead      | `text-[18px]`   | `text-[22px]`   | Geist Sans 400                             | `leading-[1.45]`, `text-graphite`. Max measure 62ch. |
| Body           | `text-[15px]`   | `text-[16px]`   | Geist Sans 400                             | `leading-[1.55]`. |
| Micro / meta   | `text-[12px]`   | `text-[13px]`   | Geist Mono 500                             | `tracking-[0]` (NOT widely tracked). Used for timestamps, KPI labels. |
| KPI numeral    | `text-[40px]`   | `text-[72px]`   | Instrument Serif 400 + `tabular-nums`      | Hero-scale numbers in dashboards. |

**Kerning + weight.** Hero/section heads at `tracking-[-0.04em]` to `-0.03em` — display serifs need to be set TIGHT to feel modern. Body at default. We use weight contrast 400-vs-600 only; no 700, no 900 — the serif provides drama, the sans stays clean.

**Eyebrow rule.** Eyebrows die. The 10px UPPERCASE TRACKED 0.22EM blue pill is the most overused 2020 SaaS pattern in this codebase. Replace with a mono micro-line: `Geist Mono, 12px, sentence case, mandarin underline 1px offset 4px`. Example: `today's earnings` (with mandarin underline) — not `TODAY'S EARNINGS` in a pill.

---

## Surface language

**Signature radius: `12px` (Tailwind: `rounded-[12px]`).** Specific, unambiguous, neither sharp-brutalist nor SaaS-pillowy. Used on EVERY card. Pills/chips get `rounded-full`. Buttons get `rounded-full`. Inputs get `rounded-[12px]`. NOTHING gets `rounded-2xl` or `rounded-3xl` anymore.

**Border style: hairline, no shadows.** Every card gets `border border-[--hairline]` (`#1414141A`, 1px). NO `shadow-sm`. NO `shadow-[0_18px_34px_-18px_rgba(...)]` blurry shelf-shadows. Depth comes from surface contrast (`--clay` card on `--paper` ground), not blur.

**Card paradigm: editorial paper.** Cards behave like postcards laid on a desk — flat, hairline-bordered, occasional slight rotation (`-rotate-[0.4deg]` on hover for a felt-tip wobble). No glass, no gradient, no inner highlight. The KPI block on a dashboard reads like a printed receipt: bordered, dense, calmly authoritative. The card paradigm IS the brand.

**Three card variants only:**
1. **Standard** — `bg-clay border border-hairline rounded-[12px]`. The default.
2. **Highlight** — `bg-ink text-paper border-0 rounded-[12px]`. For "the one important card per screen" (today's hero stat, primary CTA card). High contrast inversion replaces every gradient card in the codebase.
3. **Mandarin** — `bg-mandarin text-mandarin-ink border-0 rounded-[12px]`. Reserved for the SINGLE primary CTA card per portal (e.g. "Reservar limpieza" on client home).

---

## Densidad

**Breathier on marketing, denser on dashboards.** Two density modes, explicitly named, never mixed.

### Brand density (marketing site, hero, portal landing pages)
- Section vertical padding: `py-32 md:py-48` (currently `py-10 sm:py-24` — too small).
- Container max-width: `max-w-[1280px]` with `px-6 md:px-12`.
- Vertical rhythm between blocks: `space-y-24 md:space-y-40`.
- Card padding: `p-10 md:p-14`.
- Generous space is the brand statement. The hero should breathe like a magazine spread.

### Product density (Owner / Cleaner / Client preview pages)
- Page top padding: `pt-6 md:pt-10`.
- Section gap: `space-y-6 md:space-y-8` (currently `mt-4`/`mt-6` — too cramped, no rhythm).
- Card padding: `p-5 md:p-6` (currently `p-3`/`p-4` — too dense at body size; bumped one notch for breathability without losing the dashboard feel).
- List row min-height: `min-h-[64px]` on mobile so thumb targets clear.
- Tab bar height: `h-16` with `safe-area-inset-bottom` padding.

**Rule of one big thing per viewport.** Each screen has exactly ONE dominant element (hero stat, primary card, headline). Everything else recedes to graphite. The current owner dashboard has 6 elements competing for attention — kill that.

---

## Motion

**One easing curve, three durations. That's it.**

```css
--ease: cubic-bezier(0.2, 0.8, 0.2, 1);     /* ease-out-quint, slightly snappier */
--dur-fast: 160ms;    /* hover state changes, focus rings */
--dur-base: 280ms;    /* card lifts, sheet transitions, page-internal moves */
--dur-slow: 520ms;    /* hero reveal, completion celebrations, route changes */
```

**Signature move: the "set."** When a card enters or a sheet opens, it doesn't fade — it **settles into place** with a 4px Y-translate + opacity, like a piece of paper being laid down. No bounce, no elastic, no scale. The mandarin underline on links draws in from left at `--dur-base`. The KPI numeral roll uses `--ease` with `--dur-slow`.

**Respect `prefers-reduced-motion`.** Replace all motion with instant `opacity` swap. The completion seal becomes a static stamp. No exceptions.

**Kill the existing motion debt:** every `hover:-translate-y-0.5`, every `transition` without a named duration, every `active:scale-[0.99]` button squish. Pick from `--dur-fast / --dur-base / --dur-slow` or don't animate.

---

## Acento por portal

The mandarin is shared across all four surfaces (it IS the brand). Each portal gets ONE additional **secondary tint** used sparingly — for the active nav indicator, the portal-specific status dot, and the inverted highlight card on that portal's home. The three secondaries are chromatically distinct from each other AND from mandarin.

| Surface     | Secondary             | HEX       | OKLCH                  | Where it shows up |
|-------------|-----------------------|-----------|------------------------|-------------------|
| Marketing   | (mandarin only)       | `#FF5B1F` | —                      | Hero punctuation, primary CTA. No secondary needed — marketing is the "pure brand" surface. |
| **Owner**   | **Ultramarine**       | `#1B2D6B` | `oklch(28% 0.13 268)`  | A deep, expensive blue — closer to a Parker fountain pen than to SaaS-trust-blue. Used on the highlight card background for "today's revenue," active nav, ownership badge. Conveys "command center" without falling into navy SaaS cliché. |
| **Cleaner** | **Moss**              | `#3F5B3A` | `oklch(45% 0.06 135)`  | Earthy green — field-worn, not Slack-green. Highlight card for "today's earnings," check-in confirmations, the kintsugi thread. Replaces all `emerald-*` and `amber-*` in the operative app. |
| **Client**  | **Petal**             | `#E8C8C0` | `oklch(85% 0.04 28)`   | Soft warm rose — appears as the inverted highlight card background for "next visit," the avatar gradient, the wax-seal celebration. Calm + human, opposite of the blue-tech vibe the current portal projects. |

**Per-portal rule:** the secondary appears as a single highlight-card background per screen + the nav active indicator. NEVER as decorative gradients, NEVER on borders, NEVER as a chip background outside the one highlight. Mandarin remains the only "action" color across all three portals — secondary is identity, not action.

---

## Kill (patterns to remove site-wide)

- **The cyan→blue gradient brand mark** (`from-cyan-400 to-blue-600` square in the nav). Replace with set-type wordmark in Instrument Serif at 18px + small mandarin period.
- **Gradient text on headlines** (`bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 bg-clip-text text-transparent`). Always tacky. Solid `--ink`, period.
- **Hero blob blurs** (the three `blur-3xl` cyan/blue/emerald circles in `HeroSection.tsx`). 2019 dribbble cliché.
- **Every `rounded-3xl`** (referral card, primary CTA card on client home, stat chips). Down to `rounded-[12px]` or `rounded-full`.
- **Every `rounded-2xl` on cards.** Same.
- **Drop shadows on rounded rectangles** — every `shadow-[0_*_*_*_rgba(...)]`. Replaced by hairline border + surface contrast.
- **The 10px UPPERCASE TRACKED `0.22em` blue pill eyebrow** (used in hero, in portal labels, in section heads). Replaced by lowercase Geist Mono with mandarin underline.
- **`bg-slate-50` page backgrounds** on Owner + Cleaner previews. Replaced by `--paper`.
- **`bg-white` cards everywhere**. Replaced by `--clay` (or `--ink` for highlight, `--mandarin` for primary CTA).
- **Three competing tonal chip colors on the client portal** (blue Próximas, emerald Hechas, amber Rating). Collapse to three neutral chips with one mandarin "live" pulse on the accent metric.
- **The cyan check-in icon button + emerald complete button** on the operative app. Both go mandarin (action) — moss only for the success badge AFTER completion.
- **The Sparkles icon in the eyebrow** ("Plataforma todo en uno ✨"). Sparkles + eyebrow = AI slop sandwich. Both die.
- **`from-blue-600 to-blue-700` primary buttons.** Solid `--mandarin`, no gradient.
- **The `from-slate-800 via-slate-900 to-blue-900` Owner card** in the marketing hero. Solid `--ink` highlight card with mandarin chip.
- **Three different button shapes** (full-rounded pill, rounded-xl, rounded-2xl). Pick one: `rounded-full` for all buttons.
- **The `text-[9.5px] font-medium uppercase tracking-[0.18em]`** subtitle under the brand mark. Just write "Cleaning & Facilities" in `--graphite` at 13px.
- **The hand-wave emoji** next to "Sofía" greeting in client portal. Replaced by a small mandarin underline on the name.
- **Auto-fading scroll reveals on every section.** Per `bolder.md`: this IS the AI default. Hero gets ONE reveal, nothing else.

## Add (patterns to introduce site-wide)

- **Magazine-grade typographic hero.** Instrument Serif at 112px desktop, tight `tracking-[-0.04em]`, occasional **italic word** for emphasis (`Run your cleaning business *without* paperwork.`). The italic word gets the mandarin underline.
- **Two-column asymmetric hero on marketing** — 7/5 split (not 50/50). Big type left, three portal cards stacked vertically right with one expanded showing live demo data.
- **Editorial number setting.** Big KPI numerals in Instrument Serif italic at 72px — the dashboard's hero stat reads like a *Monocle* feature opener, not a Stripe widget.
- **Mandarin underline as the only link affordance.** 1px solid, 4px offset, draws in left-to-right on hover at `--dur-base`. Replaces every blue-text link + every hover-color-change.
- **Hairline divider system.** A single 1px `--hairline` rule between sections, sometimes interrupted by a small mandarin notch ▌— a typographic seam, not a card gap.
- **The "set" card entrance** (4px Y + opacity, `--ease`, `--dur-base`) on every card that mounts. Quiet, consistent, replaces all the various current transitions.
- **Per-portal highlight card.** Each portal home has ONE inverted card (mandarin / ultramarine / moss / petal background, `--paper` or `--mandarin-ink` text) that anchors the screen. Everything else is `--clay` on `--paper`.
- **Mono-set metadata** with mandarin underlines on key tokens (timestamps, statuses, addresses). Reads like terminal output framed in editorial layout — distinct, unmistakable.
- **Tabular numerals everywhere a number lives** (`font-variant-numeric: tabular-nums`). Already partly done; make it universal so columns of figures align like ledger.
- **Optical alignment on the wordmark.** `Portal·Services` with a mandarin mid-dot (period color), Instrument Serif, no boxed letter mark.
- **Press-print KPI cards** — each stat card looks like a printed receipt: hairline border, mono micro-label top-left, large serif numeral, optional mandarin delta. No icons.
- **One signature delight per portal.** Owner: the "set" stamp when a job completes (mandarin ink-press on the day's column). Cleaner: the kintsugi thread (already exists — re-skinned to moss). Client: the wax seal on completion (re-skinned petal + mandarin). Each delight uses ONLY the portal's secondary color + mandarin. No confetti, no rainbow.
- **Cursor-following spotlight on the marketing hero** — extremely subtle (4% mandarin radial gradient, 600px radius). The only motion in the hero besides the type-in headline.
- **Paper grain texture.** A 0.02 opacity noise SVG on `--paper` surfaces only (not on highlight cards). Gives the bone canvas a tactile feel that pure flat color can't.
