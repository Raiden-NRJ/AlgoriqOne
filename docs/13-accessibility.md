# 13 — Accessibility & Responsive Quality

**Depends on:** `02` (contrast contract), `09` (reduced motion), `11` (CI gates).
**Standard:** WCAG 2.2 **AA** as the floor, AAA on text contrast. EN 301 549 / Section 508 aligned.
**Purpose:** make the site verifiably accessible — and make that verifiability a selling point, since
we sell to organisations with accessibility procurement requirements.

The platform already treats a11y as CI (axe-gated Storybook, a real contrast script that caught a
genuine AA failure). The site inherits that standard rather than inventing a lower one.

---

## 1. Non-negotiables

1. **Keyboard-complete.** Every interactive element reachable and operable by keyboard, in a logical
   order, with a visible focus indicator. No keyboard traps. This includes the mega-menu, the
   interactive demo, the permission matrix, the pricing toggle, and the theme switcher.
2. **Focus visible, always.** 2px `--brand-600` ring, 2px offset, ≥3:1 against both the component and
   the adjacent background, in both themes. `:focus-visible`, never `outline: none` without a
   replacement.
3. **Semantic structure.** Real landmarks, one `<h1>`, no skipped levels, lists as lists, buttons as
   `<button>` and links as `<a>` — decided by behaviour (navigates vs. acts), not by appearance.
4. **Text alternatives.** Every informative image has a substantive `alt` describing *what it shows*
   ("Sales pipeline board with five stages and a deal being moved to Proposal"), not its filename.
   Decorative composition is `alt=""` + `aria-hidden`.
5. **Contrast.** Body text ≥ 7:1, all text ≥ 4.5:1, UI boundaries and focus ≥ 3:1 — both themes,
   verified by script (`02` §2.6), not by eye.
6. **Motion.** `prefers-reduced-motion` honoured globally, with the reduced experience designed, not
   stripped (`09` §6).
7. **Zoom & reflow.** Usable at 400% zoom / 320px equivalent with no horizontal scroll and no content
   loss. Text spacing overrides (WCAG 1.4.12) don't break layout.
8. **No colour-only meaning.** Every state carries a second signal — icon, text, or shape.
9. **Live regions.** Async state (form submit, copy, demo transitions, calculator results) announces
   politely. Nothing important changes silently.
10. **Target size.** Interactive targets ≥ 24×24 CSS px (WCAG 2.2 AA), ≥ 44×44 for primary mobile
    actions.

---

## 2. Component-level requirements

| Component | Requirement |
|---|---|
| Header mega-menu | Disclosure pattern: `aria-expanded`, `aria-controls`. Opens on click/Enter/Space **and** hover. `Escape` closes + returns focus to trigger. Arrow keys navigate items. Hover-intent delay must not prevent keyboard use. |
| Mobile sheet | Focus trapped while open, background inert, `Escape` closes, focus returns, body scroll locked without shifting layout |
| Tabs (§6, §7) | `role="tablist"`, roving tabindex, arrow-key navigation, `aria-selected`, panels labelled by their tab |
| Interactive demo board | Drag is **never the only path** — a "Move to…" menu is the guaranteed keyboard route (same pattern the product ships). Moves announce via live region. |
| Permission matrix | A real `<table>` with `<caption>`, `scope`d headers, and a text summary of the current selection for screen readers |
| Accordion / FAQ | Native `<details>`/`<summary>` progressively enhanced. Works fully without JS. |
| Pricing table | `<table>` with proper headers; mobile card collapse keeps the header/value association |
| Forms | `<label>` for every field (never placeholder-as-label), `autocomplete`, errors linked via `aria-describedby` and announced, error summary at the top with links to fields |
| ROI calculator | Inputs labelled with units; results in a live region; keyboard-operable sliders with text-input equivalents |
| Carousel / marquee | Pause control, no autoplay of essential content, static under reduced motion |
| Theme toggle | A real toggle with `aria-pressed` and an accessible name that states the target state |
| Scroll progress | `aria-hidden` — decorative |
| Video (if ever added) | Captions, transcript, no autoplay with sound, visible controls |

---

## 3. Screen-reader testing matrix

Automated tools catch roughly 30–40% of real issues. Manual passes are mandatory before each release:

| Reader | Browser | OS | Scope |
|---|---|---|---|
| NVDA | Firefox + Chrome | Windows | Full site |
| JAWS | Chrome | Windows | Homepage, pricing, security, forms |
| VoiceOver | Safari | macOS | Full site |
| VoiceOver | Safari | iOS | Homepage, pricing, forms, mobile nav |
| TalkBack | Chrome | Android | Homepage, pricing, forms |

Plus: keyboard-only traverse of every page, 400% zoom pass, Windows High Contrast Mode check, and a
forced-colors-mode pass (`forced-colors: active` — diagrams must remain legible).

---

## 4. Automated gates — **built and running**

| Gate | Command | What it does |
|---|---|---|
| **Browser audit** | `npm run audit` | Playwright + axe-core over every route × 13 viewports. Checks horizontal overflow (with the offending element named), axe violations at serious/critical, tap-target size on touch widths, sub-12px text, and console errors. `--quick` runs 3 viewports; `--shots` writes screenshots. |
| **Contrast** | `npm run check:contrast` | Converts every oklch token to sRGB and computes real WCAG ratios for the 26 pairs the site actually renders. Fails the build below target. |
| **Content** | `npm run check:content` | Fabricated-claim guard, banned vocabulary, one `<h1>`, heading order, unique titles/descriptions within length, image alt. |
| **Links** | `npm run check:links` | Crawls every internal link; fails on any non-200. |

Still to add: `eslint-plugin-jsx-a11y` at error level, HTML validation, and Lighthouse CI.

### What the first real audit found (2026-07-31)

Running it for the first time produced **207 findings across 3 viewports** — worth recording,
because every one was invisible to the static checks that were already passing:

| Finding | Cause | Fix |
|---|---|---|
| Horizontal overflow on `/` at 390px | The cluster tablist used a `-mx-5` bleed with `overflow-x-auto`; the negative margin grew the flex parent past the viewport instead of scrolling inside it | Tablist wraps instead of scrolling — six short labels fit two lines and need no scroll affordance |
| `color-contrast` on 20+ routes | `--color-fg-subtle` (used by every `.text-label`) was 3.3:1 on white, and `--color-success` was 3.4:1 | Recomputed the neutral ramp: `fg-subtle` 0.62 → 0.545, `fg-muted` 0.5 → 0.47. Split success into `--color-success` (light) and `--color-success-band` (dark band) — **no single lightness clears 4.5:1 against both white and near-black** |
| `nested-interactive` on the homepage | The architecture diagram had `role="img"` wrapping six real links, hiding them from assistive tech | Now `role="group"` + `aria-labelledby` with a visually-hidden description |
| `scrollable-region-focusable` ×3 | Overflow containers (posture table, permission matrix, code sample) were unreachable by keyboard | `tabIndex={0}` + `role="region"` + label |
| Tap target 638×6 on `/roi` | Range sliders were 6px tall | Control box raised to 24px with the visible track drawn on the track pseudo-element, so it still looks 6px |
| 10–11px text on 18 routes | Arbitrary `text-[0.625rem]` / `text-[0.6875rem]` | All content text raised to 12px. The hero and device mockups keep small type but are now `aria-hidden` with a text alternative — the same treatment a screenshot gets, because that is what they are |

**Lesson worth keeping:** the content and link checkers were green the whole time. Contrast,
overflow and nested-interactive are simply not detectable without a real browser and a real layout.

### Second pass (same day) — 207 → 82 → clean

The second run surfaced three more classes of problem, two real and one an artefact of the audit
itself:

| Finding | Verdict | Resolution |
|---|---|---|
| Horizontal overflow on `/` at 320–480px | **Real, and the first diagnosis was wrong.** The audit named the heading as the offending element, so `max-w-[Nch]` looked like the cause — but capping all 55 of them at `min(Nch,100%)` changed nothing. The real cause was in the *other* grid cell: a `<pre>` code block. Grid and flex items default to `min-width: auto`, so the `<pre>` contributed its full unwrapped min-content width (499px) to the column, and its sibling stretched to match. `overflow-x-auto` does not reduce min-content. | `min-w-0` on the grid items containing scrollable content (code sample, permission matrix). The `min(Nch,100%)` change was kept — it is correct defensively — but it was not the fix. |
| 56 tap-target failures on standalone links | **Real.** Inline text links rendered 20px tall. WCAG 2.2's "inline in a sentence" exception does not cover a standalone call-to-action. | `min-h-6` + `py-1` on `TextLink` and the ad-hoc inline links. |
| 21 `color-contrast` violations across routes | **Artefact.** Entrance reveals start at `opacity: 0`; auditing without scrolling measures below-fold text pre-animation, where axe correctly computes zero contrast. | The audit now scrolls the full page before measuring, so every observer has fired. Confirmed by probing the same routes directly — all clean. |

Two traps worth remembering from this:

1. **An audit that does not exercise the page's own progressive enhancement will report the
   un-enhanced state as broken.** The reveal animation produced 21 phantom contrast failures.
2. **The element an overflow report names is usually the victim, not the cause.** A stretched sibling
   is what you see; the item with an unconstrained `min-content` is what did it. When a layout
   overflows inside a grid or flex container, check `min-width: auto` on every child before touching
   the element the tool pointed at.

**The standing rule that falls out of this:** any `overflow-x-auto` container, `<pre>`, or wide table
that lives inside a grid or flex parent needs `min-w-0` on the item. There is a check for this in the
audit, but the habit is cheaper than the check.

### Third pass — what only a screenshot could find

With the audit reporting clean, reviewing the captured screenshots turned up **two real bugs the
tooling had no way to see**:

1. **The hero's floating card was cutting an approval row's name in half.** Valid markup, correct
   layout, obviously wrong to a human. Fixed by showing two rows instead of three and reserving space
   for the card to overlap.
2. **At 320px the hero copy was clipped mid-word.** This one matters more, because it exposed a hole
   in the audit itself: the hero section has `overflow: hidden`, so a `min-width: auto` blowout on
   the grid pushed content past the viewport and the ancestor silently *clipped* it. `scrollWidth`
   stayed exactly 320 — the document never scrolled — so the overflow check passed while text was
   being cut off. Fixed with `[&>*]:min-w-0` on the hero grid.

**The audit now checks for this class of failure directly:** any element whose right edge lands past
the viewport is reported as `clipped-overflow` even when the document does not scroll. An
`overflow: hidden` ancestor turns a layout bug into an invisible one, and `scrollWidth` alone will
never catch it.

### Final result

**559 page loads — 43 routes × 13 viewports (320px to 2560px, including landscape phone) — no
findings.** Zero horizontal overflow, zero clipped overflow, zero serious or critical axe violations,
zero undersized tap targets, zero sub-12px content text, zero console errors.

Screenshots are written by `npm run audit:shots` to `audit-shots/` (gitignored).
**Look at them. The audit proves correctness, not that it looks right** — both bugs above passed
every automated check.

---

## 5. Responsive matrix

Designed at 390 / 768 / 1440. **Verified** at every width below, in both themes and both orientations:

| Width | Class | Watch for |
|---|---|---|
| 320 | Small phone (floor) | No horizontal scroll anywhere; hero headline still ≤3 lines |
| 375 / 390 / 414 | Phones | Sticky CTA doesn't cover content; tap targets ≥44px |
| 480 | Large phone / small foldable | Two-col grids collapse cleanly |
| 640 | Phablet | Section rhythm doesn't collapse to cramped |
| 768 | Tablet portrait | Nav switches to sheet; device showcase reflows |
| 1024 | Tablet landscape / small laptop | Hero goes side-by-side; mega-menu returns |
| 1280 | Laptop | Anchor rails appear |
| 1440 | Desktop (design width) | Reference |
| 1728 | Large desktop | Containers cap; no stretched line lengths |
| 2160+ / ultrawide | 4K, 21:9 | Max-width holds; hero composition stays centred, doesn't grow unbounded |
| Foldables | Surface Duo, Fold | No content lost across the hinge; test at 540 and 720 |

**Rules:** no horizontal scroll at any width (an automated check per breakpoint in the Playwright
suite); measure never exceeds 75ch; no content is hidden on mobile that exists on desktop — layout
adapts, information doesn't disappear. Landscape phone (e.g. 844×390) is explicitly checked, since
short viewports break vertically-centred heroes.

---

## 6. Accessibility as a selling point

Once verified, publish it: an **accessibility statement** page (`/legal/accessibility`) stating the
conformance target, the testing method, known limitations, and a contact for issues. Enterprise and
public-sector procurement frequently requires this, and having a real one — including honest known
limitations — is a differentiator. A VPAT can follow when a customer asks.

The product's keyboard-accessible drag-and-drop ("Move to…" menus on every board) is a genuine
capability worth naming on `/product/delivery` — few competitors can claim it.

## Completion Status

- [x] Browser audit script built (`npm run audit`) — every route × 13 viewports
- [x] Contrast verified by arithmetic (`npm run check:contrast`), 26 pairs
- [x] Responsive matrix verified at all 13 listed widths, including 320px and landscape phone
- [x] Overflow, tap-target, tiny-text and console-error checks automated
- [x] Accessibility statement published at `/legal/accessibility`, including known limitations
- [ ] Manual screen-reader matrix (NVDA / JAWS / VoiceOver / TalkBack) — **not yet run**
- [ ] `eslint-plugin-jsx-a11y` at error level
- [ ] HTML validation + Lighthouse CI
- [ ] Forced-colors mode pass
