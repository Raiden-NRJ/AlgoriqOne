# Motion Graphics Brief — for Claude Code, run inside this repo

**Target repo:** the Algoryq One website (`C:\Users\Dell\algoryq\Algoryq-One`, `npm run dev` → `localhost:3500`).
**How this brief was produced:** by reading the live source (`src/`), the existing motion
docs (`docs/09-motion-and-interaction.md`, `docs/ANIMATION_SPEC_FROM_VIDEO.md`,
`docs/ANIMATION_IMPLEMENTATION_MATRIX.md`, `docs/MASTER_PROGRESS.md`, `CLAUDE.md`), and by
frame-extracting the user's `Motion Reference M6 Azure.mp4` (1280×720, 42s, 12 slides) — the
same file `MASTER_PROGRESS.md`'s 2026-09-02 entry already analysed. Nothing below invents a
pattern, a value, or a composition that isn't already either shipped in this repo or specified
in one of those sources.

**Two independent pieces of work follow. Do Part 1 first — it is small, low-risk, and ground-
agnostic. Do Part 2 second — it is the larger structural change and Part 1's new components
should already be built on semantic tokens by the time it lands, so the dark-ground flip in
Part 2 doesn't force a rewrite of what Part 1 just built.**

Before touching any file: read `CLAUDE.md` in full, then `docs/MASTER_PROGRESS.md`, then
`docs/09-motion-and-interaction.md`, `docs/ANIMATION_SPEC_FROM_VIDEO.md` and
`docs/ANIMATION_IMPLEMENTATION_MATRIX.md`. Follow the repo's own workflow loop for each part:
read fully → implement everything → verify (`npm run typecheck`, `npm run build`,
`npm run check:contrast`, and `npm run audit:shots` for touched routes) → fix all findings →
update `docs/ANIMATION_IMPLEMENTATION_MATRIX.md` and `docs/MASTER_PROGRESS.md` → only then move
on. Never write repo files via `echo`/`printf`/`node -e` (CLAUDE.md — it has corrupted
committed files twice here); use the editor. `'use client'` only appears under
`src/components/interactive/`. No fabricated data, ever (rule 1) — every new visual element
must be either real content already in `src/content/*.ts` or an honest decoration with no
claim attached (like `ChainCurrent` or `ChainRail`, which carry no text).

---

## Part 1 — Close the remaining motion-graphics gaps (current, light ground)

The six-pattern vocabulary — Rise, Stagger, Draw, Cross-fade, Lift, Sweep — is already fully
built and tokenised (`src/components/site/motion.ts`, `src/components/site/reveal.tsx`,
`globals.css`). Do not invent a seventh pattern. The gap in every case below is that a
section's *composition* has no element to attach the existing vocabulary to yet — the same
finding the implementation matrix already made about P3/P6/P7. Build the missing composition,
then attach the existing pattern to it.

### 1.1 — The architecture diagram has no connectors at all

**File:** `src/components/sections/platform.tsx`, the block under
`platform.diagramLabel` ("How it fits together" — Apps grid → Gateway → Shared spine).

Right now this renders as three stacked boxes (App cards, Gateway, Spine chips) with only
`Rise`+`Stagger`+`Lift` on each tier. There is no visual connector between them at all —
no line, no arrow — despite the section's own copy stating the thesis: *"all of them sit on
one gateway and one shared spine."* This is the single biggest gap on the homepage: the
diagram doesn't yet draw the relationship it's there to show.

Build a `Draw`-pattern SVG connector, following the exact technique already proven in
`src/components/diagrams/chain-steps.tsx`'s `ChainRail`:
- `pathLength="100"` + `stroke-dasharray/dashoffset 100→0` so nothing needs measuring.
- Gated on the ancestor `.reveal-seen` class only — no new `IntersectionObserver`, this
  inherits the enclosing `<Reveal>`'s three-path resolve.
- SVG positioned in user units so it holds at every viewport width without JS measurement
  (see `ChainRail`'s node-position comment for why that matters).
- `role="presentation" aria-hidden="true"`, nothing focusable, no text — the boxes already
  carry the real content, the line carries only the relationship.
- Respects `prefers-reduced-motion`: the same CSS branch `reveal.tsx`/`globals.css` already
  use (paint the connector fully drawn, no animation).

Draw four lines from the four app cards converging down into the Gateway box, then one line
from the Gateway down into the Spine block. If `motion.ts` doesn't yet export a shared `DRAW`
duration/easing pair (check — `ChainRail` currently has `800ms`/`1400ms` hard-coded in CSS),
extend `motion.ts` and `globals.css`'s duration tokens rather than hard-coding a new literal
(rule 8: every duration is a token, a literal in a component is a bug).

Put the new component in `src/components/diagrams/` (e.g. `architecture-rail.tsx`) next to
`chain-steps.tsx`, not inline in `platform.tsx` — matches the existing file boundary between
"section" and "diagram."

### 1.2 — The cluster pipeline has no motion at all

**File:** `src/components/interactive/cluster-switcher.tsx`, the "End to end" `<ol>` (the
stage list — e.g. Revenue's Lead → Qualified → Deal → Governance approval → Won → Project
created).

This already has a real vertical connector (a plain `bg-[var(--color-border-strong)]` line
between the dots) but it is fully static — no stagger on the dots, no draw on the line. It
sits directly beside the tablist whose indicator *does* animate (the `layoutId` sliding pill),
so switching clusters currently reads as "the label changed" rather than "the pipeline
rebuilt" — the weaker of the two available readings for a section whose whole point is "every
step in the chain is a full product."

This is already a client component (`'use client'`, already imports `motion` and
`useReducedMotion` from framer-motion), so implement with framer variants keyed off
`cluster.id` (it already remounts the panel on `key={cluster.id}` — reuse that same key so the
pipeline animates in step with the rest of the panel's cross-fade, not out of sync with it):
- Stagger the dots in at the same 70ms band the rest of the site uses (`stagger()` from
  `motion.ts` — it's a plain function, safe to call from a client component too).
- Grow the connecting segments with a `scaleY` transform from `transform-origin: top`, never
  a height or a `stroke-dashoffset` reveal on a `<div>` border — this list is HTML, not SVG,
  and the sweep pattern (`capabilities.tsx`, "a transform, never a width") is the precedent to
  follow for the same reason: animating `height` is a layout property and janks.
- `useReducedMmotion()` is already destructured in this file — branch exactly the way the
  tab indicator already does two blocks below (`reduced ? { duration: 0 } : {...}`).

### 1.3 — Audit every route beyond the homepage

Every page under `src/app/` other than `/` renders through
`src/components/page/page-template.tsx` and today inherits **only** generic Rise + Stagger —
none of the bespoke choreography (Draw, Sweep, Bars, Cross-fade-as-two-panels) that the
homepage sections got. Routes to check: `product/[cluster]` (×6 clusters), `platform/[topic]`,
`solutions`, `solutions/[industry]`, `solutions/by-role/[role]`, `security`,
`security/[topic]`, `pricing`, `roi`, `developers`, `developers/[topic]`, `company/about`,
`company/careers`, `company/contact`, `resources/blog`, `resources/changelog`,
`resources/guides`, `demo`, `faq`, `legal/[doc]`.

For each: open the page and its data in `src/content/pages-*.ts`. `PageBlock` already supports
`chain` (an ordered sequence), `panel` (a labelled list) and `image` — wherever a page uses
`chain`, that's a real composition the existing `Draw`/`Stagger` vocabulary can attach to
exactly the way 1.2 does; wherever it's a plain bullet list, it already gets `Stagger` for
free from the template and needs nothing new. Also check the client islands under
`src/components/interactive/` that these deeper pages use — `permission-matrix.tsx`,
`gap-callouts.tsx`, `roi-teaser.tsx`, `code-scan.tsx`, `terminal-video.tsx`,
`system-arch-video.tsx`, `graph-video.tsx` — for the same gap 1.1 describes: a diagram or
matrix with real relationships and zero connector motion.

**Constraint, stated once so it isn't rediscovered the hard way:** the matrix's own §6 finding
was that "the vocabulary transferred cleanly... the remaining work is a decision about whether
the sections adopt the deck's compositions" — so add motion **only** where a page's existing,
real composition supports it. Do not invent overlay copy, a KPI that isn't in the content
module, or a diagram element with no data behind it (this is exactly what sank P3's overlay
idea and P7's raster chart in the matrix — read §5–6 of `ANIMATION_IMPLEMENTATION_MATRIX.md`
before adding anything speculative). If a route has nothing to attach motion to beyond what
the template already gives it, say so and move on rather than manufacturing a reason.

### 1.4 — Parallax is still open; this one needs a decision, not a guess

M6 slide 07 confirms it's still "specified, not shipped": hero layers move against the
pointer, `±8px max`, gated on `(hover: hover) and (pointer: fine)`, never on touch. It targets
a *layered* hero composition, and the hero has been a full-bleed video since 2026-08-31 — so
there's currently nothing to layer. **Do not build a new layered hero to force this through.**
Instead, stop and present two options to the person running this brief: (a) reintroduce a
layered hero composition specifically to carry parallax, or (b) formally record parallax as
"will not implement, composition retired" in the matrix and close it out. Either is a design
decision, not a motion one.

### 1.5 — Verify and record

`npm run typecheck && npm run build && npm run check:contrast`, then `npm run audit:shots` for
every route you touched. Confirm every new animation collapses to its shown/painted end-state
under `prefers-reduced-motion`. Update `docs/ANIMATION_IMPLEMENTATION_MATRIX.md`'s table and
append an entry to `docs/MASTER_PROGRESS.md` the same way the existing entries are written —
dated, with what was measured, not estimated.

---

## Part 2 — Ship the Azure dark-ground migration (already decided, staged, not applied)

This is not a new ask: `CLAUDE.md` rule 10 already records *"One ground, and it is moving from
light to dark ('Azure')... decision taken, migration staged and NOT yet applied — the site
still renders light today."* `globals.css` already stages the exact dark values, commented
out, sampled directly from the same `Motion Reference M6 Azure.mp4` the user just supplied
(ground `#030a1b`–`#050d21`, text `#dfecfa` — read `globals.css` lines ~51–95 for the staged
block and the exact reasoning already written there). Your job is to **finish executing the
migration this repo already planned**, in the order it already specified, not to redesign it.

Watch the video (or the deck's 12 slides) once yourself before starting, specifically for the
*presentation* details a static token dump can't carry: the ground is not flat — there's a
faint grid texture across the whole background; the `Draw` line on slide 04 carries a soft
blue glow, not a hard stroke; the `Halo` reference on slide 10 is a soft blurred cyan blob, not
a hard-edged circle. None of that changes a token value, but it's the difference between
"technically dark mode" and "really professional," which is what was asked for. Reproduce
those qualities only using the existing token system (a CSS `filter: drop-shadow(...)` or
`blur()` using an existing color token) — do not introduce a new hard-coded color to chase the
look.

**Do not build a light/dark toggle, a `prefers-color-scheme` branch, or a light variant.**
Rule 10 is explicit that the single-ground commitment is unchanged; only which ground is
changing. "Mix of themes" in this context means the brand hue blended tastefully into the one
new dark ground — not two themes to maintain.

### Stage 1 — semantic layer (audit only, likely already done)

The azure values are already staged as a commented block in `globals.css`. Confirm the block
is complete and matches the deck (ground, surface, border, the four `fg-*` steps) — this is a
verification pass against what's already written, not new design work.

### Stage 2 — call sites (the actual blocking work)

`globals.css` already names the problem precisely: **26 component files reference ramp steps
directly for text** (`--color-brand-700` on links, `--color-brand-800` on chip labels,
`--color-cyan-700` on accents, and siblings) instead of the semantic layer. On the current
light ground these happen to be legible; on the staged dark ground they resolve to 2–3:1
contrast. Grep for every direct `--color-{brand,cyan,neutral}-{700,800,900}` (and any other
ramp step used for foreground/text color, as opposed to a fill) across `src/components` and
`src/app`, and replace each with the correct semantic token (`--color-link` for link text,
`--color-fg`/`--color-fg-muted`/`--color-fg-subtle` for body text, `--color-fg-inverse` only
for text on a filled action). Do this file by file and verify after each one that the site
**still renders identically on the current light ground** — the semantic tokens must resolve
to the same light values the raw ramp steps did, so this stage alone should produce zero
visual change. That's what proves it's safe to flip next.

### Stage 3 — flip the ground

Once Stage 2 is clean, uncomment the staged azure block in `globals.css` and comment out (or
delete) the light block above it — the six `--color-bg*`/`--color-surface`/`--color-border*`/
`--color-fg*` lines `globals.css` itself already points to.

### Stage 4 — rewrite the contrast gate

`npm run check:contrast` currently asserts the light pairs. `globals.css` documents a known
gotcha here: the script parses the file with a regex that doesn't skip comments, so the
commented-out azure block must stay in a form that regex won't misread as a live declaration
(read the exact note in `globals.css` around the azure block before touching this — it
explains the format that already avoided crashing the gate once). Rewrite the script's
asserted pairs for the dark ground's actual values and get all 48 pairs green — the script is
the arbiter here per rule 5, not a visual check.

### Stage 5 — verify like a full visual release, because it is one

Per rule 13's definition of done: implementation + a full responsive pass (320→2560px) + an
accessibility pass + a motion/reduced-motion pass + a copy review + a Lighthouse/bundle check.
Concretely: `npm run typecheck && npm run build`, the rewritten `npm run check:contrast`, and
`npm run audit` (Playwright + axe across all 13 viewports and every route — this is the one
the matrix flagged as "not run yet" even for the current light build, so budget the ~20
minutes it takes and wait on the process rather than polling `pgrep`, per CLAUDE.md's own
warning about that). Update `docs/MASTER_PROGRESS.md` and mark rule 10's migration section
done, dated and with the same kind of measured evidence (not estimated) every other entry in
that file already carries.

---

## Sequencing and non-negotiables, restated

Run Part 1 to completion first (verified, matrix updated) before starting Part 2 — Part 1's
new SVG connector and the pipeline's animated line should already be written against semantic
tokens, so Part 2's ground flip changes their colors for free instead of requiring a second
pass. Within each part, follow the repo's own rule: one unit of work fully verified before the
next, nothing marked done without the actual command output confirming it (`npm run typecheck`
passing is not the same claim as `npm run build` passing — the matrix's own history records a
`stagger()` bug that only `next build` caught, not `tsc`).

Across both parts: every duration, color and easing comes from the existing token set — a
literal in a new component is a bug, not a shortcut. No new client islands outside
`src/components/interactive/`. No fabricated copy, data, or KPI to give a diagram something to
point at. Extend `Reveal`; do not replace it or its three-path resolve. Nothing here overrides
CLAUDE.md, `docs/09`, or the implementation matrix — where this brief and those disagree, they
win, and it's worth re-reading them before resolving the conflict rather than guessing which
one is stale.
