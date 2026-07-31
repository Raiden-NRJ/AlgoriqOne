# 02 — Website Design System

**Depends on:** `01-brand-and-positioning.md`.
**Scope:** the complete token set, type scale, grid, elevation, motion vocabulary and component
inventory for `apps/marketing`. Implemented in `apps/marketing/src/app/globals.css` (Tailwind v4
`@theme`) plus `src/components/site/`.

---

## 1. Relationship to `@algoryq/ui`

**Decision: the marketing site keeps its own standalone theme. It does not import `@algoryq/ui`.**

Rationale — three reasons, in order:
1. **Different job.** The product system optimizes for density, scanability and 8-hour sessions. The
   site optimizes for narrative, drama and a 90-second visit. Forcing one system to do both degrades
   both.
2. **Weight.** `@algoryq/ui` pulls Radix, dnd-kit, chart libs and the admin shell. A marketing page
   must ship a fraction of that (`12-performance-and-seo.md` budgets).
3. **Release independence.** A product design-system bump must never be able to break the homepage.

**But they must not drift.** The bridge is a shared *brand* layer: both systems derive from the same
brand hue and semantic intent, and the site's "product surface" components (the ones that frame real
screenshots and mimic product chrome) mirror the product's radii, borders and elevation exactly, so
screenshots sit in frames that feel native. Contract: brand hue, semantic color intent, radius scale
and focus-ring treatment are shared; everything else is free to diverge.

---

## 2. Color system

**Light mode only** (decision 2026-07-31, user). No dark theme, no toggle, no
`prefers-color-scheme` branch. Enterprise buyers browse in light, and committing to one theme means
every surface gets designed once, properly, instead of twice, adequately.

**The dark bands are not a theme.** §8 (permissions) and §13 (security) render on a near-black band
using the `--color-band-*` tokens. That is a deliberate tonal device inside a light design — it marks
the serious, technical part of the page — and it is the only place dark surfaces appear.

Color space is **oklch**, matching the product system — perceptually uniform lightness makes
programmatic contrast guarantees possible.

### 2.1 Brand ramp

Brand hue **259 (Algoryq blue)** — adopted from the parent brand (2026-07-31 rebrand) so Algoryq One
and `algoryq.com` are visibly the same company.

**Steps 500 and 600 are Algoryq's own values, copied unmodified** from the parent stylesheet
(`--color-brand-500: oklch(58% .17 258)`, `--color-brand-600: oklch(45% .18 260)`). The rest of the
ramp is interpolated around those two anchors, so a swatch lifted from either site matches. Re-hue
only alongside the parent.

```
--brand-50   oklch(0.977 0.012 259)
--brand-100  oklch(0.945 0.028 259)
--brand-200  oklch(0.898 0.055 259)
--brand-300  oklch(0.822 0.096 259)
--brand-400  oklch(0.702 0.145 259)
--brand-500  oklch(0.580 0.170 258)   ← Algoryq --color-brand-500, verbatim
--brand-600  oklch(0.450 0.180 260)   ← Algoryq --color-brand-600, verbatim; our primary
--brand-700  oklch(0.390 0.158 260)
--brand-800  oklch(0.330 0.128 260)
--brand-900  oklch(0.275 0.100 260)
--brand-950  oklch(0.205 0.072 261)
```

The move from the old indigo (hue 277, `--brand-600: oklch(0.546 0.215 277)`) *improved* the primary
action colour's contrast on white, from 5.32:1 to **7.71:1** — the new 600 is darker as well as
bluer. Nothing regressed; see the table in §2.3.

### 2.2 Neutral ramp

Tinted to the parent's ink hue **265** (`algoryq.com --color-ink-950: oklch(13% .012 265)`), chroma
0.002–0.03, so neutrals harmonise with brand instead of fighting it. Twelve steps `--neutral-0`
(white) through `--neutral-1000`. The rebrand moved these from hue 274 → 265; lightness was left
alone, so every contrast ratio held to within 0.02.

**Steps 500 and 600 are contrast-derived, not eyeballed.** They back `--color-fg-subtle` and
`--color-fg-muted`, which carry most of the secondary text on the site. The first browser audit found
the original values failing at 3.3:1 on white, so they were recomputed against a real sRGB conversion:

| Token | Was | Now | Ratio on white |
|---|---|---|---|
| `--neutral-500` → `--color-fg-subtle` | `oklch(0.62 0.018 274)` | `oklch(0.545 0.019 265)` | 3.34 → **4.96** |
| `--neutral-600` → `--color-fg-muted` | `oklch(0.5 0.02 274)` | `oklch(0.47 0.02 265)` | 6.1 → **6.83** |

Do not lighten either without re-running `npm run check:contrast`.

### 2.3 How the palette is verified

`npm run check:contrast` **parses `src/app/globals.css`** and computes real oklch → sRGB → WCAG
ratios for all 26 pairs the site actually renders. It resolves `var(--color-*)` aliases, so it tests
the same values the browser receives.

It did not always. Until the rebrand it held a hand-copied token table under a "must mirror
globals.css" comment, and when the ramp was re-hued it reported *all 26 pairs meet target* — for the
violet tokens that had just been deleted. A checker that can pass against colours the site no longer
ships is worse than no checker, because it is trusted. Do not reintroduce a mirrored copy.

### 2.3 Accent — used sparingly, with intent

`--accent: oklch(0.72 0.14 195)` (restrained teal). **Rule: accent appears at most twice per viewport**,
and only to mark the single most important thing in a section (a highlighted data point, an active
node in a diagram). The current site's violet→cyan gradient-on-everything is the exact failure mode
we are correcting.

### 2.4 Semantic

`--color-success oklch(0.53 0.15 152)` · `--color-success-band oklch(0.75 0.16 152)` ·
`--color-warning oklch(0.72 0.16 70)` · `--color-danger oklch(0.58 0.22 27)` ·
`--color-info oklch(0.62 0.17 250)`.

**Why success has two values.** No single lightness clears 4.5:1 against *both* white and the
near-black band: at 0.53 it passes on white (4.87) and fails on the band (3.69); at 0.62 it fails on
white (3.36). Rather than accept a failure on one surface, there are two tokens — `--color-success`
for light surfaces, `--color-success-band` for the dark band. Any future semantic colour used on both
surfaces needs the same treatment; `check:contrast` will tell you.

### 2.5 Surface tokens

Semantic names only — components never reference a ramp step directly. Implemented in
`src/app/globals.css`.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `--neutral-0` | Page background |
| `--color-bg-subtle` | `--neutral-50` | Alternating section bands |
| `--color-surface` | `--neutral-0` | Cards, raised panels (elevation carries them) |
| `--color-border` | `--neutral-200` | Default hairline |
| `--color-border-strong` | `--neutral-300` | Hover, emphasis |
| `--color-fg` | `--neutral-900` | Body text |
| `--color-fg-muted` | `--neutral-600` | Secondary text |
| `--color-fg-subtle` | `--neutral-500` | Captions, meta |

**Band tokens** — the dark tonal device only:
`--color-band` (`--neutral-950`) · `--color-band-surface` · `--color-band-border` ·
`--color-band-fg` · `--color-band-fg-muted`.

### 2.6 Contrast contract (enforced, not aspirational)

- Body text ≥ **7:1** (AAA). Headlines and large text ≥ 4.5:1.
- `--color-fg-muted` on `--color-bg` ≥ **4.5:1** — the token values above were chosen to satisfy this.
- The band tokens carry the same contract against `--color-band`.
- Interactive text ≥ 4.5:1; focus ring ≥ 3:1 against both the component and the adjacent background.
- **No gradient body text.** Gradients are backgrounds only (§2.7) — a gradient headline cannot hold
  a contrast guarantee at every stop.
- Enforcement: port `scripts/check-dark-contrast.mjs` from the platform repo (already CI-gated there,
  already caught a real AA failure) to cover this token set.

### 2.7 Gradients — a strict, small vocabulary

Three permitted gradients, nothing else:
1. **Aurora wash** — a very low-chroma brand→accent radial at ≤12% opacity, background only, behind the
   hero and the final CTA. Never behind body copy.
2. **Surface lift** — 2% lightness delta top-to-bottom on elevated cards. Almost subliminal.
3. **Edge light** — a 1px border gradient on the primary CTA and on featured cards only.

Banned: full-bleed multi-stop hero gradients, gradient body text, gradient icons, blob shapes.

---

## 3. Typography

**Typography is the single largest upgrade over the current site**, which ships the OS system stack.

### 3.1 Families

| Role | Family | Why | Loading |
|---|---|---|---|
| Display + headings | **Inter Display** (or licensed alt: Söhne / Neue Haas Grotesk) | Optical sizing for large type, tight apertures, enterprise-neutral | `next/font/local`, woff2, subset latin, `display: swap`, preloaded |
| Body + UI | **Inter** (variable) | Matches product chrome, exceptional legibility at 16–18px | variable woff2, single file |
| Mono | **JetBrains Mono** | Code samples, API docs, permission keys, service names | subset, lazy — only on pages with code |

Fallback stack always: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
Fallback metrics matched via `size-adjust` to keep CLS at 0.

*If licensing budget is unavailable:* Inter alone across all roles, with `font-feature-settings: "cv11", "ss01"` and optical-size tuning. Still a large improvement. **Never** ship the raw system stack.

### 3.2 Type scale

Fluid, `clamp()`-based, 1.25 minor-third ratio at small sizes opening to 1.333 at display sizes.

| Token | Min (320px) | Max (1440px+) | Weight | Tracking | Leading | Use |
|---|---|---|---|---|---|---|
| `display-1` | 2.75rem | 5.25rem | 600 | -0.035em | 0.98 | Hero headline only |
| `display-2` | 2.25rem | 3.75rem | 600 | -0.03em | 1.03 | Section openers |
| `h1` | 2rem | 3rem | 600 | -0.025em | 1.08 | Page titles |
| `h2` | 1.625rem | 2.25rem | 600 | -0.02em | 1.15 | Sub-sections |
| `h3` | 1.25rem | 1.5rem | 600 | -0.015em | 1.25 | Card titles |
| `body-lg` | 1.0625rem | 1.25rem | 400 | -0.005em | 1.6 | Hero sub, section intros |
| `body` | 1rem | 1.0625rem | 400 | 0 | 1.65 | Default |
| `body-sm` | 0.875rem | 0.9375rem | 400 | 0 | 1.6 | Captions, meta |
| `label` | 0.75rem | 0.8125rem | 500 | 0.06em | 1.4 | Eyebrows, UPPERCASE |
| `mono` | 0.8125rem | 0.875rem | 400 | 0 | 1.7 | Code |

**Rules:** measure 60–75ch for body, ≤ 22ch for display headlines (forces the natural line break).
`text-wrap: balance` on all headings, `text-wrap: pretty` on all paragraphs. Never centre more than
three lines of body text. Never set body below 16px on mobile.

---

## 4. Space, grid, layout

- **Base unit 4px.** Scale: 0, 1(4), 2(8), 3(12), 4(16), 5(20), 6(24), 8(32), 10(40), 12(48), 16(64),
  20(80), 24(96), 32(128), 40(160), 48(192).
- **Section rhythm** (the Apple-spacing lever): vertical padding `clamp(5rem, 10vw, 12rem)`. Adjacent
  sections never share a rhythm value if they share a background — space is how we signal "new idea".
- **Containers:** `--container-prose` 68ch · `--container-default` 1200px · `--container-wide` 1440px ·
  `--container-full` 1600px (device showcases only). Gutters: 20px mobile, 32px tablet, 48px desktop.
- **Grid:** 12-column, 24px gutter desktop; 8-column tablet; 4-column mobile. Asymmetric 7/5 and 5/7
  splits for feature sections — 6/6 reads static and is avoided.
- **Breakpoints:** 375 / 480 / 640 / 768 / 1024 / 1280 / 1440 / 1728 / 2160. Design at 390, 768, 1440;
  verify at all nine plus 320 and ultrawide (`13-` and `12-` list the full matrix).

## 5. Radius, border, elevation

- Radius: `sm 6px` · `md 10px` (= product `--radius`) · `lg 14px` · `xl 20px` · `2xl 28px` · `full`.
  Product-surface frames use `md`/`lg` so embedded screenshots look native.
- Borders: 1px `--border` default. Hairline discipline — no 2px borders anywhere except focus rings.
- **Elevation is light, not shadow-stacking.** Five levels, each = a subtle ring + a soft shadow:
  `e0` flat · `e1` cards · `e2` hover/raised · `e3` popovers · `e4` modals/floating device frames.
  In dark mode, elevation is expressed as *lightness increase* with a much softer shadow — copying
  light-mode shadows into dark is the classic failure and is banned.

## 6. Iconography & illustration

- **Icons:** `lucide-react` (already a dependency, matches the product exactly). 1.5px stroke, 20/24px,
  never scaled below 16. Icons are functional, never decorative filler.
- **Illustration system:** no stock art, no generic 3D blobs. Two custom families:
  1. **System diagrams** — the gateway/service/permission architecture drawn as precise, isometric-free
     line schematics in brand + neutral. These *are* the illustration language, and they are honest
     because they depict the real architecture.
  2. **Product abstractions** — simplified, animated re-creations of real UI (a pipeline column, an
     approval inbox row, a permission matrix cell) built as DOM/SVG, not images, so they animate
     cheaply and stay crisp at any DPI.
- **Photography:** used only for the About page (real team, if available) and never as section decoration.

## 7. Motion tokens

Full choreography in `09-motion-and-interaction.md`; the tokens live here.

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances (the workhorse) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | State changes |
| `--ease-spring` | `linear(…)` spring approximation | Playful accents, rare |
| `--dur-instant` | 100ms | Hover color |
| `--dur-fast` | 180ms | Buttons, small state |
| `--dur-base` | 280ms | Cards, reveals |
| `--dur-slow` | 480ms | Section entrances |
| `--dur-cinematic` | 900ms | Hero orchestration only |

**Global rule:** every motion token collapses to `0.01ms` under `prefers-reduced-motion: reduce`, and
transform-based animations are replaced by opacity-only fades. Enforced in a single base-layer media
query, not per-component.

## 8. Component inventory (site-level)

Built in `apps/marketing/src/components/site/`. Existing primitives (`Container`, `Eyebrow`,
`SectionHeading`, `Button`, `Card`) are kept as the seed and extended.

**Layout:** `Container` · `Section` (background variant + rhythm) · `Grid` · `Split` (7/5, 5/7) ·
`Divider` · `StickyNav`.
**Typography:** `Display` · `Heading` · `Prose` · `Eyebrow` · `Kicker` · `GradientAccent` (contrast-safe).
**Actions:** `Button` (primary/secondary/ghost/link × sm/md/lg, loading, icon slots) · `ButtonGroup` ·
`TextLink` (animated underline) · `StickyCTA` (mobile bottom bar).
**Content:** `Card` (default/raised/interactive/featured) · `FeatureCard` · `StatCard` · `QuoteCard` ·
`LogoWall` (gated) · `Accordion` (FAQ, native `<details>` progressively enhanced) · `Tabs` ·
`Timeline` · `ComparisonTable` (sticky header, mobile card collapse) · `PriceCard` · `Callout`.
**Product surfaces:** `DeviceFrame` (browser/laptop/tablet/phone chrome) · `ScreenshotFrame`
(light/dark auto-swap, `<picture>` + AVIF/WebP) · `ProductWindow` (chrome + tabs, houses live demos) ·
`InteractiveDemo` (client island) · `ArchitectureDiagram` · `PermissionMatrix` · `PipelineDemo` ·
`ApprovalInboxDemo` · `WorkflowCanvasDemo`.
**Conversion:** `CTABand` · `LeadForm` (extends the existing `contact-form.tsx`) · `ROICalculator` ·
`PlanSelector` · `TrustBar` (gated) · `NewsletterForm`.
**Utility:** `ThemeToggle` · `ScrollProgress` · `Reveal` (IntersectionObserver wrapper) · `Marquee`
(pause-on-hover, reduced-motion-static) · `CountUp` (real numbers only, never arbitrary).

Every component ships: TypeScript props, both themes, all breakpoints, keyboard path, and a Storybook
story. Site components live in the marketing app's own Storybook target, not `packages/ui`'s.

## 9. Token implementation

Single source of truth: `apps/marketing/src/app/globals.css`, Tailwind v4 `@theme` block, mirroring how
`packages/ui/src/styles/globals.css` does it. Dark mode via `.dark` class (matching the product) plus
`prefers-color-scheme` default and a no-flash inline script. Tokens are additionally exported as
`website/docs/tokens.json` for the Figma variable import (`14-figma-deliverables.md`).

## Completion Status

- [ ] Fonts licensed/self-hosted, metrics-matched fallbacks in place
- [ ] Full token set implemented in `globals.css` (light + dark)
- [ ] Contrast script extended to marketing tokens, both themes, CI-gated
- [ ] Type scale + fluid clamps implemented and verified 320→2560px
- [ ] Component inventory built with Storybook stories
- [ ] `tokens.json` exported for Figma
