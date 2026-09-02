# 09 — Motion & Interaction Design

**Depends on:** `02` §7 (motion tokens).
**Purpose:** the choreography system. Motion is the difference between a competent site and one that
feels like a flagship — and it is also the fastest way to make a site feel cheap, slow, or hostile.
This document is as much about restraint as about animation.

---

## 1. Principles

1. **Motion explains, or it doesn't ship.** Every animation answers one of: where did this come from,
   what changed, what is related to what, what can I do here. Decoration is cut.
2. **The page is complete before motion runs.** Everything is server-rendered and readable; motion is
   enhancement. Nothing is invisible-until-animated — a failed IntersectionObserver must never leave a
   section blank. (Implementation: content starts visible; the `Reveal` wrapper applies the "before"
   state only after JS confirms it can run.)
3. **Fast in, slow out.** Entrances 280–480ms. Exits 150–200ms. Nothing waits on an animation.
4. **One focal motion per viewport.** Two competing animations halve the attention each gets.
5. **60fps or don't.** `transform` and `opacity` only. Never animate `width`, `height`, `top`, `left`,
   `box-shadow`, or `filter` on scroll.
6. **Reduced motion is a first-class design**, not a degraded one — see §6.
7. **Never hijack the scroll.** No scrolljacking, no forced pinning that traps the user, no
   "keep scrolling to continue" that ignores a fast flick. The user owns the scrollbar.

---

## 2. Motion vocabulary

Six patterns. Everything on the site is one of these; a seventh requires a decision recorded here.

> **Reconciled against the M5 motion deck, 2026-09-01.** This table was already the right system —
> same six names, the 60–80ms band, cap 6, `translateY(16px)`, 800ms draw, 8px slide, −2px lift,
> ±8px parallax. The deck agrees with all of it. Only two things were wrong and both are fixed
> below: the **token names never existed** (`--dur-slow`, `--dur-base`, `--dur-fast`, `--ease-out`
> — see `02` §7), and the table implied everything was built. Draw shipped 2026-09-01 (§5.1);
> **Parallax is still the one unbuilt pattern**.
> Exact redlines and provenance: `ANIMATION_SPEC_FROM_VIDEO.md`.

| Pattern | Spec | Token | Where | Built |
|---|---|---|---|---|
| **Rise** | `translateY(16px)` + `opacity 0→1` | `--duration-rise` **320ms** · `--ease-out-quint` | Default section/element entrance | ✅ `.reveal` / `.reveal-in` |
| **Stagger** | Rise with 60–80ms per-child delay, **capped at 6** children (then the delay holds) | `--stagger-tight` 70ms · `--stagger-wide` 80ms | Card grids, lists, bullets | ✅ `[data-rise-item]` + `stagger()` — **one observer per grid** |
| **Draw** | SVG `stroke-dashoffset` 100%→0, via `pathLength="100"` | `--duration-draw` 800ms · `--ease-out-quint` | The chain (P2, signature moment) | ✅ `ChainRail` — see §5.1 |
| **Cross-fade** | `opacity` + 8px directional slide, out-left / in-right | `--duration-cross-fade` 200ms | Tab/cluster switches | ✅ `.cross-fade` |
| **Lift** | `translateY(-2px)` + elevation e1→e2 | `--duration-lift` 120ms | Card hover | ✅ `.lift` |
| **Parallax** | Max ±8px translate, **fine pointer only** | `--duration-*` n/a; rAF-driven | Hero backdrop | ✅ `hero-video.tsx` |

Two patterns in the deck have no entry above because they are one-offs, not vocabulary — recorded
here so they are not mistaken for a seventh pattern:

- **Transit** (P2): the token travelling the chain rail after it draws. `--duration-transit`
  **1400ms**, `--ease-in-out-quint`. The deck's only ease-in-out and its only value above 900ms.
- **Sweep** (P5): the rule under the four capability cards, `scaleX` from origin-left.
  `--duration-sweep` 480ms. ✅ built — `[data-sweep]`, 1px tall so it is a transform, never a width.

**Explicitly banned:** rotation on scroll, scale > 1.05, blur transitions, letter-by-letter text
reveals, marquees that can't be paused, autoplaying carousels, elements that animate every time they
re-enter the viewport (once only, always), parallax on touch devices.

---

## 3. Scroll choreography

**One observer per group, never one per child.** Deck slide 06: "OBSERVER: one, on the grid".
A staggered group gets a single `<Reveal>` on its container; the children carry
`data-rise-item` and their own `animation-delay` from `stagger(i)`, and animate off the
`.reveal-seen` marker the container sets. The site did the opposite until 2026-09-01 — one
`Reveal` per child — which put four observers on the capability grid alone (homepage total
39 → 32 after the conversion).

> Use `<Reveal as="ul">` when the container is a list. A wrapper `<div>` between `<ul>` and
> `<li>` breaks the list relationship, and the items stop being announced as a list of N.

- **Trigger:** `IntersectionObserver`, `threshold` tuned so the element is ~25% visible;
  `rootMargin: '0px 0px -10% 0px'` so animation completes before the element is centred.
- **Once only.** `unobserve` after firing. Re-animating on scroll-back is the single most common
  "cheap site" tell.
- **Fast scrollers get the end state.** If scroll velocity exceeds a threshold, or if the element is
  already past centre on first observation, skip to final state immediately.
- **No `will-change` left on.** Applied on the frame before animation, removed on `transitionend`.
- **Scroll progress bar:** 2px, `transform: scaleX()` driven, `requestAnimationFrame`-throttled, or
  native `animation-timeline: scroll()` where supported with a JS fallback.

---

## 4. Micro-interactions

| Element | Interaction |
|---|---|
| Primary button | Background lightens 4% + lift 1px, 100ms. Active: 0px lift, 60ms. **Focus-visible ring is 2px offset 2px — always, in every theme.** |
| Text link | Underline draws left→right, `--duration-lift` (120ms), using `background-size` on a gradient (no layout shift) |
| Card | Lift + border strengthens to `--border-strong`. Whole card is one link, not a nested-link trap. |
| Nav mega-menu | Fade + 6px rise, 160ms. 120ms open-intent delay, 200ms close delay to survive diagonal pointer travel. |
| Tabs | Active indicator slides between tabs (shared-element style), 240ms |
| Accordion | Height animated via grid-template-rows `0fr → 1fr` (the only correct CSS-only height animation), content fades at 60% |
| Form field | Border → `--brand-600` on focus, 120ms. Error shakes **only once**, 200ms, ≤4px amplitude — and never under reduced motion. |
| Copy-to-clipboard | Icon morph + "Copied" label, 1.2s, with an `aria-live` announcement |
| Theme toggle | Cross-fade the whole document over 200ms via a `color-scheme` transition class, disabled under reduced motion |

---

## 5. The three signature moments

A site is remembered for two or three moments, not for uniform polish. Ours, and their budgets:

1. **The hero settle** (`04` §1) — the 900ms orchestration where the product window and three cluster
   cards assemble and the permission check draws. Sets the register in the first second.
2. **The permission reveal** (`04` §8) — toggling a role and watching the mock UI's nav items and
   buttons disappear in real time. This is the most persuasive interaction on the site because it
   makes an abstract architectural claim physically visible. Highest engineering budget after §6.
3. **The workflow chain** — a token travelling the chain and parking on the last stage, drawing the
   connection the entire positioning rests on. **Built 2026-09-01** on the homepage §2 (not the
   cluster pages as originally planned); the M5 deck names it P2 and calls it *the* signature moment.

Everything else is quiet on purpose, so these three land.

### 5.1 The chain transit — as built

**Component:** `ChainRail` in `components/diagrams/chain-steps.tsx`, rendered by §2 `chain.tsx`.
**Spec:** deck slide 04 — `DRAW 800ms · NODES 70ms stagger · TRANSIT 1400ms ease-inout ·
TOKENS --ease-out, --color-cyan-500`. Five nodes, matching the five stages in `content/homepage.ts`.

| t | What |
|---|---|
| 0–800 ms | Rail draws, `stroke-dashoffset 100→0`, `--ease-out-quint` |
| 0–280 ms | Five nodes fade in, 70 ms apart (`stagger()`, so the cap applies) |
| 500–1900 ms | Cyan token travels the rail, `--ease-in-out-quint`, and parks on the last node |

**Trigger:** none of its own. The animations are gated on a `.reveal-seen` ancestor, which the
enclosing `<Reveal>` supplies — so the rail inherits the three-path resolve instead of adding a
fourth way to fail.

**Reduced motion:** rail painted, nodes shown, token parked on the last stage. Deck slide 10 says
"path painted, token parked on Invoice" and that is literally the base state here.

Three implementation notes that are easy to get wrong and expensive to rediscover:

- **`pathLength="100"` normalises the path**, so the draw needs no measurement and cannot drift when
  `d` is edited. It is also exactly what slide 02 specifies (`stroke-dashoffset 100→0`); slide 04's
  `520` is *that deck's* path length, not a number to copy into ours.
- **The token moves by an SVG transform in user units, never CSS pixels.** A fixed `translateX(420px)`
  lands on the rail at exactly one viewport width and drifts off it everywhere else. Measured: 0 px
  from the last node at 1280, 1440, 1728 and 2560.
- **The rail is inset to the first and last *card centres*** (`ms-[calc(10%-1.375rem)]` /
  `me-[calc(10%+1.375rem)]`), because the connector slot sits *after* each card, so card centres are
  not at 10/30/50/70/90%. Evenly spacing across the container drifted visibly from the row it
  describes. Measured after the fix: ±0.2 px at every width.

**Unlabelled, deliberately.** The cards above already name Deal → Project → Plan → Time → Invoice;
repeating them on the rail would state the section's one idea twice in a row, which is what removed
`home.jpg` from this same section on 2026-08-10. The rail carries the motion, the cards carry the
content — and the rail is `aria-hidden`/`role="presentation"` with nothing focusable, so it adds no
information that is not already text.

---

## 6. Reduced motion

`prefers-reduced-motion: reduce` is honoured globally in the base layer, not per component:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Plus deliberate design decisions beyond the blanket rule:
- Reveals become instant-visible (not a 0.01ms transform, which can still flash).
- Parallax is disabled at the JS level — the listener is never attached.
- SVG draws render fully drawn on mount.
- The hero composition renders in its final arrangement.
- Marquees become static rows.
- **The reduced-motion experience must be complete and beautiful, not visibly stripped.** It is
  reviewed as its own design pass, at the same quality bar.

Additionally: `prefers-reduced-data` disables the device-showcase parallax and drops to lower-resolution
image variants.

---

## 7. Implementation

- **CSS-first.** Scroll-driven animations, `@starting-style`, `view-transition` and
  `animation-timeline` where supported, with graceful fallback. Most of this site's motion needs no JS.
- **JS only where CSS can't reach:** the hero orchestration, the interactive demo, the permission
  matrix, pointer parallax. Each is an isolated, code-split client island.
- **No animation library on the critical path.** If a spring engine is needed for §6, it is dynamically
  imported inside that island only, and counted against that island's budget (`12-`).
- **Performance gate:** a Playwright trace on the homepage must show no long task > 50ms during a
  scripted full-page scroll, and no layout thrash (forced reflow) in the reveal path.

## Completion Status

- [ ] Motion tokens implemented in `globals.css`
- [ ] `Reveal` wrapper (once-only, fast-scroll skip, no-JS-safe)
- [ ] Six motion patterns implemented and documented in Storybook
- [ ] Three signature moments built
- [ ] Reduced-motion pass reviewed as its own design
- [ ] Scroll-performance trace gate added to CI
