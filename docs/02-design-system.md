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

### 2.4 Aurora cyan ramp — the third brand colour

**Added 2026-08-09** when the palette collapsed from 8 non-semantic hues to 3 (client-approved). Hue
**200**, Algoryq's "aurora" family. Cyan replaces the single-value `--color-accent`, promoted to a
full ramp. All ratios below are computed by `check:contrast`, not estimated.

```
--cyan-50   oklch(0.975 0.018 200)  #EAFBFC   ← tinted section surface (tone="tint")
--cyan-100  oklch(0.945 0.038 200)  #D0F5F7   ← tinted card / hover
--cyan-300  oklch(0.835 0.088 200)  #7FDBDF   ← text on dark band 12.08:1; tint section border
--cyan-400  oklch(0.775 0.115 200)  #43CCD3   ← accents on dark band
--cyan-500  oklch(0.720 0.140 200)  #00BEC7   ← LARGE FILLS ONLY — see §2.5
--cyan-600  oklch(0.620 0.125 200)  #009CA4   ← borders / icons on white 3.35:1
--cyan-700  oklch(0.520 0.105 200)  #007A81   ← text on white 5.11:1
```

### 2.5 The cyan contrast rules — non-negotiable

**`--color-cyan-500` (#00BEC7) is 2.29:1 on white.** It fails the 4.5:1 text threshold *and* the 3:1
non-text threshold.

> The old comment on `--color-accent` claimed this value "holds 3:1 as a non-text accent on white."
> **That was false** — it was never measured. It is recorded here so nobody reinstates it.

| Need | Use | Ratio |
|---|---|---|
| Cyan as a **large decorative fill** on white, ink text on top | `cyan-500` | ink on it = **7.74:1** ✓ |
| Cyan as **text** on white | `cyan-700` | **5.11:1** ✓ |
| Cyan as a **border or icon** on white | `cyan-600` | **3.35:1** ✓ |
| Cyan on the **dark band** | `cyan-300` / `cyan-400` | **12.08:1** / 9.97:1 ✓ |

`cyan-500` is never a border, never a meaning-carrying icon, never text.

**This is enforced, not documented.** `check:contrast` carries a `FILL_ONLY` list that asserts *both*
halves for `cyan-500`: that ink on it clears 4.5:1 (what makes the fill legal), **and** that it stays
*below* 3:1 on white (the reason for the restriction). If the second assertion ever starts passing,
someone changed the ramp and the fill-only rule needs a deliberate revisit — so the checker fails.

### 2.6 The three-colour system

| | Token | Value | Role |
|---|---|---|---|
| **INK** | `--color-neutral-*` (hue 265) | `#111826` at 900 | All text; the dark band at `#080D18` |
| **BLUE** | `--color-brand-*` (hue 259/260) | `#044CB6` at 600 | Every action, link, primary accent |
| **CYAN** | `--color-cyan-*` (hue 200) | `#00BEC7` at 500 | Secondary accent, tinted surfaces |

**Deleted in the collapse:** `--color-info` (hue 250, zero usages) and `--color-bg-warm` (hue 85 —
warm parchment would have been a fourth hue). The four app-identity colours were re-hued off violet
onto blue, cyan and ink (§2.8). Migration record with the full blast radius and every replacement
decision: [palette-migration.md](palette-migration.md).

### 2.7 Semantic — QUARANTINED, functional use only

`--color-success oklch(0.53 0.15 152)` · `--color-success-band oklch(0.75 0.16 152)` ·
`--color-warning oklch(0.72 0.16 70)` · `--color-danger oklch(0.58 0.22 27)`.

These four survive the collapse because form validation genuinely needs them, but **as of 2026-08-08
they are functional-only.** Permitted, exhaustively:

- form validation (invalid fields, error messages)
- error and empty states
- destructive confirmations
- genuine status indicators — e.g. the Implemented / In progress / Planned pills on `/security`

**Not permitted:** decoration, marketing emphasis, diagram mood, or "this bit is bad" colouring in a
comparison. A red rule beside a marketing bullet (`problem.tsx`) and a red dashed box around the
competitor diagram (`three-systems.tsx`) were both removed in this pass. Reach for cyan or the neutral
ramp instead. The rule is restated in `globals.css` so it is visible at the point of use.

**One exemption:** `--color-success` marking a *settled* step in the chain diagram and the hero wires
is product semantics — the record really is settled — not decoration. It stays.

**Why success has two values.** No single lightness clears 4.5:1 against *both* white and the
near-black band: at 0.53 it passes on white (4.87) and fails on the band (3.69); at 0.62 it fails on
white (3.36). Rather than accept a failure on one surface, there are two tokens — `--color-success`
for light surfaces, `--color-success-band` for the dark band. Any future semantic colour used on both
surfaces needs the same treatment; `check:contrast` will tell you.

### 2.8 App identity colours

Four dots in the architecture diagram, on blue steps + cyan + ink — **no fifth hue**. Violet (hue 285)
is gone.

| App | Token | Value | On white |
|---|---|---|---|
| Portal | `--color-app-portal` | `oklch(0.275 0.100 260)` = brand-900 | 15.02:1 |
| Admin | `--color-app-admin` | `oklch(0.450 0.180 260)` = brand-600 | 7.71:1 |
| Platform | `--color-app-platform` | `oklch(0.545 0.019 265)` = neutral-500 (ink) | 4.96:1 |
| Customer | `--color-app-customer` | `oklch(0.620 0.125 200)` = **cyan-600** | 3.35:1 |

Separation is two-dimensional, which is what makes four legible at 8px: Portal and Admin differ by
lightness (0.275 / 0.450), Platform by chroma (0.019 — reads grey), Customer by hue (200 vs 260 —
reads cyan).

**Customer is cyan-600, not cyan-500.** A bare dot is a mark, not a fill, so it is held to 3:1;
cyan-500 would be 2.29:1. This is the fill-only rule doing its job at a real call site.

Every dot is paired with its app name in text, so colour is never the sole carrier (WCAG 1.4.1).

### 2.9 Surface tokens

Semantic names only — components never reference a ramp step directly. Implemented in
`src/app/globals.css`.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `--neutral-0` | Page background |
| `--color-bg-subtle` | `--neutral-50` | Alternating section bands |
| `--color-cyan-50` | hue 200 | Alternating section bands, tinted (`<Section tone="tint">`) |
| `--color-surface` | `--neutral-0` | Cards, raised panels (elevation carries them) |
| `--color-border` | `--neutral-200` | Default hairline |
| `--color-border-strong` | `--neutral-300` | Hover, emphasis |
| `--color-fg` | `--neutral-900` | Body text |
| `--color-fg-muted` | `--neutral-600` | Secondary text |
| `--color-fg-subtle` | `--neutral-500` | Captions, meta |

**Band tokens** — the dark tonal device only:
`--color-band` (`--neutral-950`) · `--color-band-surface` · `--color-band-border` ·
`--color-band-fg` · `--color-band-fg-muted`.

### 2.10 Section rhythm — tone

This section covers the *tonal* half of section rhythm: which background a section gets, and in what
order. The *vertical* half — the `.section-y` / `.section-y-lg` clamps, retuned 2026-08-13 — is
specified in §4. The two are independent levers and both are needed: tone says "new idea", space says
how big an idea.

The site alternated only white against one cool grey, so every section read the same and the page felt
flat. The cyan tint is the fix. `<Section tone="tint">` renders `--color-cyan-50` with a
`--color-cyan-300` border — a cool `--color-border` hairline against a tinted surface reads as a seam.

> The border is cyan-300, not cyan-100. cyan-100 measured **1.09:1** against cyan-50 — fainter than
> the neutral border it replaces, i.e. an invisible section boundary. `check:contrast` caught it.

**Three rules, binding:**

1. **Never two tinted sections adjacent.** The tint is the accent in the rhythm, not the default.
2. **A tinted section never directly abuts the dark band.** Put a white or subtle section between
   them — cyan against near-black is the one pairing in this palette that looks like a mistake.
3. **The dark band stays exclusive to permissions and security.** It is a tonal device, not a theme
   (rule 10).

Homepage as rendered — Testimonials is gated and returns `null`:

```
aurora · subtle · TINT · white · TINT · white · subtle · BAND ·
white · TINT · white · subtle · BAND · white · TINT · white · aurora
```

Shared page template (~40 routes): `aurora → white → TINT (Related) → aurora (CtaBand)`.

### 2.11 Contrast contract (enforced, not aspirational)

- Body text ≥ **7:1** (AAA). Headlines and large text ≥ 4.5:1.
- `--color-fg-muted` on `--color-bg` ≥ **4.5:1** — the token values above were chosen to satisfy this.
- The band tokens carry the same contract against `--color-band`.
- Interactive text ≥ 4.5:1; focus ring ≥ 3:1 against both the component and the adjacent background.
- **No gradient body text.** Gradients are backgrounds only (§2.7) — a gradient headline cannot hold
  a contrast guarantee at every stop.
- Enforcement: port `scripts/check-dark-contrast.mjs` from the platform repo (already CI-gated there,
  already caught a real AA failure) to cover this token set.

### 2.12 Gradients — a strict, small vocabulary

Three permitted gradients, nothing else:
1. **Aurora wash** — two low-chroma radials, background only, behind the hero, the page heroes, the
   final CTA and 404. Never behind body copy. **Blue top-right (`brand-500` at 0.11 alpha), cyan
   top-left (`cyan-500` at 0.07).** This is `cyan-500`'s sanctioned role: a large decorative fill at
   low alpha with ink text on top, never a border or an icon (§2.5).
2. **Surface lift** — 2% lightness delta top-to-bottom on elevated cards. Almost subliminal.
3. **Edge light** — a 1px border gradient on the primary CTA and on featured cards only.

Banned: full-bleed multi-stop hero gradients, gradient body text, gradient icons, blob shapes.

### 2.13 Text over video — the scrim contract

Added 2026-08-31 with the full-bleed hero. One utility, `.hero-scrim` in `globals.css`, and four
rules that are not negotiable because §2.11 does not stop applying just because the background is
moving.

1. **Never a light or white layer over footage.** A light wash behind or over a video is what
   produced the white halo the full-bleed hero was built to fix. The veil is always
   `--color-band`.
2. **Flat, never a gradient — and no shadow or glow behind the text.** The scrim shipped as a
   gradient first: vertical below lg, a 95deg left-anchored wipe above it, so the footage opened
   up on the right. It measured fine and it still failed in use.
   > A gradient guarantees contrast at the points you sampled. A hero video is 30 seconds of
   > moving picture, so a bright highlight only has to drift into the light end of the ramp to
   > take the copy with it — text that measured 8:1 visibly dropped out at some moments. This is
   > not fixable by re-tuning stops: every ramp has a light end, and anything can move into it.
   > A flat veil has no light end, so the worst case is the same everywhere and at every frame.
3. **Opacity is measured, not chosen.** Footage has no single background colour, so the ratio is
   computed against the *frames*: sample across the video's full length, composite against the
   scrim **in gamma-encoded sRGB** — which is what the browser does — and take the **brightest
   pixel found**, not a percentile, because flat means one number has to cover everything.
   > Compositing in linear light is the trap. It is the intuitive model, it is wrong, and it
   > overstates the required alpha by ~0.15 — enough to turn a veil that shows the footage into
   > one that hides it. The first pass on this hero did exactly that.
4. **`--color-band-fg-muted` is unavailable over video.** It measures ~3.0:1 there. Secondary copy
   uses `--color-band-fg` and reads as secondary through size and weight instead.

At the shipped **0.74**, measured on the rendered page at the brightest pixel of the whole video —
identical for the nav strip and the copy column, at 1280 and 1920, because the veil is flat:

| Role | Token | Ratio | Rule |
|---|---|---|---|
| Nav, headline, body, proof points | `--color-band-fg` | **7.89:1** | §2.11 body ≥7:1 ✓ |
| Headline accent | `--color-brand-300` | **4.92:1** | §2.11 headline ≥4.5:1 ✓ |

`--color-brand-600`, the accent on light surfaces, measures **2.3:1** over the scrim and is not
used there; `--color-brand-400` was the closer match to the requested colour and was rejected at
2.95:1. `Button` gained a `ghostOnBand` variant for the same reason — plain `ghost` is
`--color-fg-muted`.

Do not lighten below 0.72. Re-run the measurement after any change to the footage: a new cut is a
new background and none of these numbers transfer.

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
- **Section rhythm** (the Apple-spacing lever): two fluid tokens in `src/app/globals.css`, applied
  only through `<Section size>`, plus the five blocks that apply the class directly because they are
  not `<Section>`s: the homepage `Hero` and `FinalCta`, the template's `PageHero` and `CtaBand`, and
  `not-found.tsx`. Adjacent sections never share a rhythm value if they share a background — space is
  how we signal "new idea".

  | Class | `<Section>` | Value | Renders (375 / 1280 / 1920) |
  |---|---|---|---|
  | `.section-y` | `size="default"` | `clamp(3.5rem, 6vw, 6rem)` | 56 / 77 / 96px |
  | `.section-y-lg` | `size="lg"` | `clamp(4.5rem, 8vw, 8rem)` | 72 / 102 / 128px |

  **Retuned 2026-08-13** from `clamp(5rem, 9vw, 9rem)` / `clamp(6rem, 11vw, 12rem)`. Section padding
  is paid twice at every boundary, and measured against the rendered page it was **24% of the
  homepage's total height at 1920px** (20% at 1280) — boundary gaps of 256px at 1280 and 336px at
  1920. The new values cut that ~30–35% across the range while keeping both tokens fluid clamps and
  keeping `lg` the rarer, roomier one (ceiling ratio unchanged at 1.333). Both now leave their floor
  at ~900px and reach their ceiling at 1600px, so the two scale over the same window.

  > The previous entry here read `clamp(5rem, 10vw, 12rem)` — a single value that matched neither
  > token as shipped. The table above is measured from the running site, not aspirational.

- **Internal section spacing** comes from the Tailwind scale above, never a new class. The
  heading-block-to-content gap is `gap-12`; two-column feature splits are `gap-10 lg:gap-16` (the
  `lg` value is a column gutter, not vertical rhythm). Same 2026-08-13 pass moved every off-scale
  value in the section components onto the scale — `gap-14`, `gap-7` and `mt-14` were the only
  offenders and were also the loosest, so tightening and conforming were the same edit.
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
