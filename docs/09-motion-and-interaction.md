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

| Pattern | Spec | Where |
|---|---|---|
| **Rise** | `translateY(16px)` + `opacity 0→1`, `--dur-slow`, `--ease-out` | Default section/element entrance |
| **Stagger** | Rise with 60–80ms per-child delay, capped at 6 children (then all together) | Card grids, lists, bullets |
| **Draw** | SVG `stroke-dashoffset` 100%→0, 800ms, `--ease-out` | Architecture diagrams, workflow chains, the problem diagram |
| **Cross-fade** | `opacity` + 8px directional slide, `--dur-base` | Tab/cluster switches |
| **Lift** | `translateY(-2px)` + elevation e1→e2, `--dur-fast` | Card hover |
| **Parallax** | Max ±8px translate, pointer- or scroll-driven, desktop + fine-pointer only | Hero composition, device showcase |

**Explicitly banned:** rotation on scroll, scale > 1.05, blur transitions, letter-by-letter text
reveals, marquees that can't be paused, autoplaying carousels, elements that animate every time they
re-enter the viewport (once only, always), parallax on touch devices.

---

## 3. Scroll choreography

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
| Text link | Underline draws left→right, `--dur-fast`, using `background-size` on a gradient (no layout shift) |
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
3. **The workflow chain** (`05`, cluster pages) — a token travelling from project request → WBS → task
   → timesheet → invoice, drawing the connection the entire positioning rests on.

Everything else is quiet on purpose, so these three land.

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
