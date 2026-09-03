# Animation Implementation Matrix

**Status:** **All 7 choreographed beats built, 2026-09-02.** Parallax shipped the same day, so
**6 of 6 patterns are built** and nothing in the deck's vocabulary is outstanding. The azure dark
ground is applied and rule 10 rewritten. **2026-09-02, second pass:** the two remaining
*composition* gaps named by `MOTION_GRAPHICS_BRIEF.md` §1.1–1.2 are closed — the architecture
diagram has connectors, and the pipeline animates — and the vocabulary was carried onto the deep
routes that had inherited only Rise + Stagger (§6b below).
**Source of truth:** `ANIMATION_SPEC_FROM_VIDEO.md` (Phase 1), which is transcribed from
the M5 motion deck. Where this matrix and that spec disagree, the spec wins.

Section files are `src/components/sections/*.tsx` unless noted.

---

## 1. The matrix

Beat order is the deck's (slide 11), which matches `src/app/page.tsx`.
**Bold** = specified by a dedicated deck slide. Plain = inherits the six patterns only.

| # | Beat | File | Patterns | Deck redline | Effort |
|---|---|---|---|---|---|
| 1 | Hero | `hero.tsx` | — | **LOCKED · reference only** | none |
| 2 | Chain | `chain.tsx` | **Draw + Transit + Stagger** | 800 ms draw · 70 ms nodes · 1400 ms transit | ✅ **done** |
| 3 | Problem | `problem.tsx` | **Timed cues + Stagger** | 500 ms apart · `timeupdate` driver · 70 ms list | ✅ **done** — driver built; cues drive the adjacent list, not overlays |
| 4 | Platform | `platform.tsx` | **Stagger + Lift + Draw** | 320 ms/card · 70 ms × 6 at cap · lift −2 px/120 ms · one observer | ✅ **done** — connectors added 2026-09-02, see §6b |
| 5 | Permissions | `permissions.tsx` | Rise + Stagger | inherits (60–80 ms) | ✅ **done** |
| 6 | Capabilities | `capabilities.tsx` | **Stagger + Sweep + Lift** | 320 ms · 80 ms · rule 480 ms scaleX origin-left · observer @ 25% | ✅ **done** |
| 7 | Intelligence | `intelligence.tsx` | **Bars + Halo + Annotation** | scaleY 320 ms · 70 ms apart · halo 320 ms one KPI · annotation 200 ms | ✅ **done** — chart built as DOM, B11 retired |
| 8 | Developers | `developers.tsx` | **Chrome → Rows** | chrome rise · rows 220 ms/180 ms apart, capped | ✅ **done** — code panel built as DOM; no invented status line |
| 9 | Security | `security.tsx` | Rise + Stagger | inherits | ✅ **done** |
| 10 | FAQ | `faq.tsx` | Rise + Stagger + accordion `0fr→1fr` | inherits · M6 slide 08 | ✅ **done** |
| 11 | Final CTA | `final-cta.tsx` | Rise + Stagger | inherits | ✅ **done** |

`Testimonials` (`testimonials.tsx`) is absent from the deck's eleven beats because it is
content-gated and renders `null`. It keeps its existing 60 ms stagger; no work.

## 2. Shared work, before any section

These are prerequisites, not a section each. Doing a section first would mean writing
against tokens that do not exist yet.

**All done, 2026-09-01.** Owner decision: rise adopted at **320 ms site-wide**, deck is authority.

| Item | File | Outcome |
|---|---|---|
| Motion tokens | `globals.css` | ✅ 6 durations + 2 stagger steps; `--duration-rise` 480 → **320 ms** |
| Stagger cap of 6 | **`src/components/site/motion.ts`** (new) | ✅ `STAGGER_CAP` + `stagger()` |
| Observer threshold | `reveal.tsx` | ✅ 0.2 → **0.25** |
| Lift as one class | `globals.css` | ✅ `.lift`, 120 ms, `hover: hover` guarded |
| Cross-fade as one class | `globals.css` | ✅ `.cross-fade` / `.cross-fade-in` |
| Stagger drift | 7 section files | ✅ 50/60/70/80/260 → only 70/80 multiples; **no literal delays left** |

**Verified in-browser:** rise applies `0.32s` to `opacity, transform`; delays measured at
70/80/140/160/210/240/280 ms; `.lift` runs `0.12s` and yields exactly `translateY(-2px)`; on touch
`hover: hover` is false and the transform stays `none`; under `prefers-reduced-motion` **0 of 1008
elements faded** and `.lift` keeps only its shadow step. Plus typecheck, build (48 routes), 48/48
contrast, 42 content routes, 48 links. **The 13-viewport axe audit has not been run yet.**

> **`motion.ts` exists because of a real failure, worth knowing before adding to it.** The helper was
> first exported from `reveal.tsx`, which opens with `'use client'`. That makes even a pure function
> a client binding, and every section here is a server component — so the prerender died with
> "Attempted to call stagger() from the server but stagger is on the client". **`tsc` passes; only
> `next build` catches it.** Anything a server component calls at render time must live outside a
> client module.

## 3. What already agrees, and must not be "fixed"

Checked against the shipped code, so the diff stays honest about what is actually new:

- **Rise transform** is already `translateY(16px)` — matches the deck exactly.
- **Lift distance** is already −2 px (`hover:-translate-y-0.5`) at four call sites — only
  the duration drifts (200 ms vs 120 ms).
- **Reduced motion** already resolves to the shown state and never arms the transform.
  Slide 10's principle is already the repo's contract; it needs *extending* to Draw,
  Transit and Halo, not replacing.
- **Beat order** already matches slide 11. No resequencing.
- **`Reveal`'s three-path resolve** (observer + scroll re-check + 2000 ms failsafe) exists
  because loading `/#chain` once left **37 blocks at `opacity: 0`**. See §5.

## 4. Stagger drift — reconciled 2026-09-01

What was there, and what it became. **No component holds a delay literal any more** — every
one is `stagger(i)` or a named band constant, which is what stops the drift recurring.

| Call site | Was | Now |
|---|---|---|
| `capabilities.tsx` | `i * 70` | `stagger(i, 80)` — P5 specifies 80 ms |
| `problem.tsx` items | `i * 60` | `stagger(i)` (70 ms) |
| `problem.tsx` change rows | `i * 50` | `stagger(i)` |
| `problem.tsx` conclusion | `delay={260}` | `stagger(problem.items.length)` → 280 ms, derived |
| `security.tsx` | `i * 50` | `stagger(i)` |
| `testimonials.tsx` | `i * 60` | `stagger(i)` |
| `developers.tsx`, `intelligence.tsx`, `problem.tsx` aside | `delay={70}` | `STAGGER_TIGHT` |
| `permissions.tsx` | `delay={80}` | `STAGGER_WIDE` |

The `260` was the interesting one: not a stagger at all but a "land after the list" beat, so it is
now `stagger(items.length)` — the delay the next child would have had. Derived, so it tracks the
band instead of being a number someone once liked.

**The cap is latent and that is why it is enforced.** Every list is under six items today
(`capabilities` 4, `security` 3, `testimonials` 3, `problem` 4), so `STAGGER_CAP` changes no
current output. It exists for the person who adds a seventh card, whom nothing else would warn.

## 5. Do not adopt the brief's `Reveal` rewrite

The brief's Phase 5 §5.2 offers a "simplified Reveal component logic" using a
`data-reveal` attribute and CSS `@keyframes`. **Implementing it would reintroduce a fixed
bug.**

The shipped `Reveal` resolves through three independent paths — IntersectionObserver, a
passive scroll re-check, and a 2000 ms failsafe — any one sufficient. That redundancy was
added on 2026-08-11 because a single-observer implementation left **37 blocks at
`opacity: 0`** when `/#chain` was loaded directly, which is a URL this site ships itself
from the hero button and from the ChainStrip on every deep page. The brief's version has
one path.

The brief is also wrong that the current implementation uses CSS animations: it uses a
class swap (`.reveal` → `.reveal-in`) with a **transition**. That distinction matters for
Draw — `stroke-dashoffset` under a transition needs the end value applied by class, not a
`forwards` animation.

**Extend `Reveal`; do not replace it.** Its delay prop, once-only semantics and
reduced-motion branch are all still correct.

## 6. Build order

Sequenced by dependency and by the deck's own emphasis, not by the brief's suggested
order.

**Stage 0 — shared foundation.** ✅ **Done 2026-09-01.** See §2.

**Stage 1 — Chain (P2).** ✅ **Done 2026-09-01.** `ChainRail` in `chain-steps.tsx`, rendered by
`chain.tsx` beneath the card row, xl only. Full write-up: `09` §5.1.

Measured: draw `0.8s` ease-out-quint; node delays 0/70/140/210/280 ms; transit `1.4s`
ease-in-out-quint at +500 ms; token **0 px** from the last node at 1280/1440/1728/2560; nodes
**±0.2 px** from their card centres at every width; reduced motion → animations `none`, rail
painted, token parked. `role="presentation"`, `aria-hidden`, nothing focusable, no text.

Three things went differently from the plan, all recorded in `09` §5.1:

1. **No measurement needed.** `pathLength="100"` normalises the path, so `getTotalLength()` and the
   hard-coded `520` both turned out to be unnecessary — and `100→0` is what deck slide 02 specifies
   anyway. This also means editing `d` cannot break the draw.
2. **The rail could not go behind the cards.** `ChainCurrent` already holds that band and is
   deliberately transparent across the middle, so a token running along it would vanish for two
   thirds of the journey — the one part that has to be seen. It went below the row instead.
3. **Evenly spacing the nodes across the container was wrong.** The connector slot sits *after* each
   card, so card centres are not at 10/30/50/70/90% and the rail visibly drifted from the row it
   describes. Fixed structurally with a CSS inset to the first and last card centres.

**Stage 2 — the card beats: Platform (P4), Capabilities (P5).** ✅ **Done 2026-09-01.**

The load-bearing find was P4's `OBSERVER: one, on the grid`, which **the whole site was
violating**: stagger was one `<Reveal>` per child, so each grid carried one
IntersectionObserver per item — four on the capability grid, seven across Problem, three on
Security. Generalised the container-level pattern first used for ChainRail's nodes into
`[data-rise-item]`: one `<Reveal>` on the group, children delayed in CSS off `.reveal-seen`.
**Homepage observers 39 → 32**, same visual result, and the rule now holds everywhere.

`<Reveal>` gained `as="ul"` for this, and it is required rather than convenient — a wrapper
`<div>` between `<ul>` and `<li>` breaks the list relationship and the items stop being
announced as a list of N. Verified: all four staggered lists still render `ul > li` with
4/3/4/3 direct children.

Also landed: P5's **sweep** (`[data-sweep]`, 480 ms `scaleX` from origin-left, `--color-brand-600`,
1px tall so it is a transform and never a width) — "four proofs, one claim", measured 1344 px
wide under the grid; `.lift` on the Platform app cards, which were static boxes; and the
ClusterSwitcher's panel transition reconciled from **180 ms / framer `easeOut`** to
**200 ms / `[0.16, 1, 0.3, 1]`**, matching the deck's Cross-fade. It stays a keyed remount, so
it does not use the `.cross-fade` class — that needs both panels in the DOM at once, and an
AnimatePresence version was already abandoned here over a React 19 exit-callback bug.

**The cap bit for the first time.** Platform's shared spine is eight chips against a cap of six,
so measured delays are `0/70/140/210/280/350/350/350` — the last three arrive with `search`
instead of trailing to 490 ms. Until now every list was under six items and `STAGGER_CAP`
changed nothing.

Measured: `rise-item 0.32s`; capabilities `0/80/160/240 ms`; sweep `0.48s`; reduced motion
0/1025 faded with every animation `none`. Plus typecheck, build, 48/48 contrast, 42 content
routes, 48 links.

**Stage 3 — the inheriting beats: Permissions, Security, FAQ, Final CTA.** Pure
reconciliation to the 60–80 ms band plus the cap. Cheap, low risk, and it makes the
site consistent before the hard sections.

**Stage 4 — Intelligence (P7).** ⚠️ **Partial, 2026-09-01. The `70ms apart` is built; the halo is
blocked on the asset, not on technique.**

Done: the five points stagger at 70 ms off the Reveal that already wrapped that column, so it cost
**zero extra observers**; the screenshot rises with that same Reveal, which is P7's "static base".

**Not done, deliberately — and the CSS-halo decision is not what blocks it.** P7's redlines assume
the slide's composition: three KPI chips (MARGIN / UTILISATION / DSO), a seven-bar chart, and a
`peak week 34` annotation. §7 has none of those in the DOM — it is one raster screenshot plus a
bullet list. So `HALO 320ms, one KPI only` has **no element to attach to**, and `BARS scaleY` has
no bars.

The stronger reason to stop: **the halo's whole job is to send the eye to one metric, and this
asset carries blocker B11.** Its x-axis reads `Jan 1, Jan 13, Jan 9, Jan 16, Jan 22, Jan 25,
Jan 27, Jan 29, Jan 33` — out of sequence, with a date that does not exist — and the member table
repeats one row five times. Animating attention onto that is worse than leaving it still.

Two ways forward, both needing a decision:
1. **Re-cut the screenshot** (clears B11), then attach the CSS halo to the corrected chart.
2. **Build the deck's composition natively** — KPI chips, bars and annotation as DOM — which makes
   every redline applicable, removes the raster and its baked-in defects, and would let the bars
   animate `scaleY`. Larger, and it supersedes the 2026-08-10 static-screenshot decision.

**Stage 5 — Problem (P3) and Developers (P6).** ⚠️ **Assessed 2026-09-01. Neither is buildable as
specified, and in both cases the reason is the asset, not the technique.**

**P6 Developers — all three redlines resolve to "already there" or "must not".**
- `CHROME rise 320ms` — **already satisfied by the asset.** The video has a framed terminal painted
  into it, tabs and all. A title bar was built and reverted within the hour: the screenshot showed
  two nested windows. `site/illustration.tsx` carries a `chrome={false}` prop for exactly this.
- `ROWS 220ms · 180ms apart` — **no DOM rows exist.** The code is pixels inside an mp4, so the rows
  cannot be staggered without replacing the video with real markup. That is an asset decision, not
  a motion one.
- `OUTPUT cross-fade 200ms` — the deck's line is `invoice.created  ok 142ms`. **That latency is
  invented and nothing measures it**, so it is not rendered. Rule 1 has no decorative exemption.

> **New asset defect found while checking this.** The video types
> `process.env.ALGORYQ_ONE_ONE_KEY`; the real sample in `developers.tsx` is `ALGORYQ_ONE_KEY`.
> Same family as B10/B11/B12, but worse in kind — this is a **wrong environment-variable name in
> the developer-facing section**, and it is copy-pasteable. Verified by extracting the frame.

**P3 Problem — the overlays would duplicate what is already on screen.** The redline is
`OVERLAYS 200ms · 500ms apart` with a `timeupdate` driver, i.e. callouts naming the gaps *over* the
video. This section already names the four gaps as text in the adjacent column. Overlaying them
would state the section's one idea twice **simultaneously** — a stronger version of the duplication
that removed `home.jpg`. There is no other source content for callouts, and inventing copy to
satisfy a motion spec is the wrong direction. The part that does apply — `LIST 70ms stagger` — is
built (and now with one observer).

**The systemic finding, stated once.** Five of the seven choreographed beats specify motion for a
composition the built site does not have: P2's labelled rail, P4's six module cards, P7's KPI chips
and bars, P6's DOM code rows, P3's video overlays. The **vocabulary** transferred cleanly — Rise,
Stagger, Draw, Cross-fade, Lift and Sweep are all built and measured — but the per-beat
choreography assumes the deck's own layouts. So the remaining work is not animation work; it is a
decision about whether the sections adopt the deck's compositions. That decision covers P3, P6 and
P7 together.

## 6b. The composition gaps, closed — 2026-09-02

`MOTION_GRAPHICS_BRIEF.md` Part 1. §6's systemic finding was that the remaining work was *not*
animation work but a decision about whether the sections adopt the deck's compositions. Three of
those decisions were taken here, and one turned out to have been taken already.

### 6b.1 The architecture diagram now draws its own thesis (brief §1.1)

**New:** `components/diagrams/architecture-rail.tsx`. **Wired in:** `sections/platform.tsx`.

§4's "How it fits together" rendered three stacked boxes — four app cards, a gateway, a shared
spine — with **no line or arrow between them at all**, while the copy above it claimed *"all of
them sit on one gateway and one shared spine."* The diagram enumerated the parts and drew none of
the relationship. It now draws four connectors from the app-card centres into the gateway, and one
from the gateway into the spine.

Technique is ChainRail's, reused rather than re-derived: `pathLength="100"` with
`stroke-dasharray/dashoffset 100 → 0`, so nothing is measured and editing a `d` cannot break the
draw; gated on a `.reveal-seen` ancestor so it inherits `<Reveal>`'s three-path resolve instead of
adding a fourth way to fail; `role="presentation"`, `aria-hidden`, nothing focusable, no text.

**One deliberate difference from ChainRail: it is one path per line, not one path total.** Each
carries its own `stagger(i)` delay, so the fan arrives in the 70 ms band. A single multi-subpath
path was tried on paper first and rejected — the dash progresses through subpaths in `d` order, and
with the collector line being ~84% of the total length the whole gesture reads as one wire being
pulled sideways rather than as four things converging. Draw and Stagger composed; no seventh
pattern.

**Alignment is structural, and it is exact.** For an N-column grid of width `W` and gap `g`, the
first column's centre is `W/2N − (N−1)g/2N`; inset the rail by that on both sides and its viewBox
`0 → 1000` spans exactly first-centre to last-centre, so the inner drops land on exact fractions
and `x=500` is the container centre where the gateway sits. Nothing is measured at runtime. One
rail is rendered per breakpoint (1 / 2 / 4 columns) because a converging fan under a single stacked
column is not a fan.

> **The bug this cost, worth not repeating.** The first version put the inset margins on the `<svg>`
> itself, which also carried `w-full`. A block-level flex item with `width: auto` is stretched to
> the container *minus its margins* — which is the geometry above — but `w-full` pins it to the full
> container width and the margins then push it outward. Measured at 1280 px: drops spaced
> **372.7 px** against card centres **282.5 px** apart, with only the first one landing correctly,
> because only its inset had been applied before the width resolved. The fix is a wrapper `<div>`
> carrying the margins. **The first drop being exactly right is what made this look correct at a
> glance** — it is the kind of thing the screenshot pass exists for.

`preserveAspectRatio="none"` with `vector-effect="non-scaling-stroke"`: the rail is 40 px tall and
up to ~1200 px wide, so uniform scaling would grow its height with the viewport. There are no
circles here, only lines, so non-uniform scaling costs only stroke weight, and the vector-effect
puts that back. Same trade `ChainCurrent` already takes.

**Measured**, 8 widths — 375 / 640 / 768 / 1024 / 1280 / 1440 / 1728 / 2560:

| | |
|---|---|
| Drop x vs. app-card centre | **Δ = 0.00 px at every width and every column count** |
| Stroke weight | **1.50 px at every width** (non-scaling-stroke holds) |
| Gap to the boxes above/below | **0.00 px** — the `-my-5` cancels the flex `gap-5` exactly |
| Animation | `draw-in 0.8s ease-out-quint`, delays **0 / 70 / 140 / 210 ms**, 5 paths at `lg` |
| At rest | `stroke-dashoffset: 0` — painted, which is the default state |
| Reduced motion | `animation: none`, dashoffset still 0 → **drawn, held still** |

> **Superseded in part, same day.** A later 2026-09-03 pass (owner instruction) kept this component
> and its geometry but changed its *driver*: at `sm` and up the draw is now scroll-scrubbed by
> `interactive/architecture-draw.tsx` rather than run as a one-shot CSS entrance. The measurements
> above were taken against the CSS driver and still describe the geometry, the stroke and the
> reduced-motion path — none of which that change touches — but **the homepage no longer shows
> `draw-in 0.8s`**; scrubbed, the paths sit at `stroke-dashoffset: 100` until the scroll advances
> them. Verified after the change: the offsets do run 100 → 0 across the section and end at 0, with
> no console errors, and reduced motion still resolves to 0 (drawn) immediately.
>
> One consequence is worth stating plainly, because it inverts a contract this file has defended
> twice: with the island active the resting state below the trigger is **undrawn**, not drawn. The
> CSS default is still drawn and the no-JS path is still complete — the island only winds it back —
> but that now depends on the island behaving, where before it depended on nothing.

### 6b.2 The pipeline rebuilds instead of redrawing (brief §1.2)

The "End to end" stage list — a dot per stage with a hairline segment between — was fully static in
**two** places: `interactive/cluster-switcher.tsx` (homepage §4 and `/demo`) and `page-template.tsx`'s
`Chain` (12 blocks across the product / platform / security / solutions routes). On the switcher it
mattered most: it sits beside a tablist whose indicator *does* animate, so a cluster change read as
"the label changed" rather than "the pipeline rebuilt".

Dots stagger in on `fade-in`; the segments grow `scaleY` from `transform-origin: top` — never a
height, which is a layout property that janks (docs/09 principle 5). The Sweep in `capabilities.tsx`
is the same trade for the same reason: "a transform, never a width".

> **Deviation from the brief, stated.** The brief specifies framer variants keyed off `cluster.id`.
> This is CSS. The reason only shows up once both call sites are in view: `Chain` is a **server
> component and cannot use framer at all**, so a framer implementation meant two implementations of
> one pattern with the durations written out twice. docs/09 §7 is "CSS-first — most of this site's
> motion needs no JS". The brief's actual requirement, *keyed to cluster switching*, is satisfied
> for free: the panel already remounts on `key={cluster.id}`, and a CSS animation restarts whenever
> its element is inserted. Same trigger, one implementation, no numbers duplicated into JS.

**Measured:** dots `fade-in 0.32s` at **0 / 70 / 140 / 210 / 280 / 350 ms** — the cap biting on
Revenue's six-stage chain; segments `grow-y 0.32s` with `transform-origin` y = **0px**. **60 ms
after clicking a different cluster tab**, the first segment is at `scaleY 0.766` and the first dot
at `opacity 0.766` — i.e. mid-animation, which is the direct evidence that the keyed remount
restarts them. Under reduced motion the same click reads `scaleY 1.000` / `opacity 1` immediately.

> **Superseded on the ClusterSwitcher, same day.** A later 2026-09-03 pass replaced the switcher's
> inline pipeline with the `interactive/chain-stepper.tsx` island (`data-step-*` rather than
> `data-pipe-*`). The cluster-switch measurement above therefore describes the CSS implementation
> that was there when it was taken, not what the homepage and `/demo` render now — re-checked
> after the change: 6 steps, all resolved at `opacity: 1`, no console errors.
>
> **`page-template.tsx`'s `Chain` is untouched and still runs this**, which is the larger half of
> the work: 12 blocks across the product / platform / security / solutions routes. Re-verified
> against the current tree — `/product/revenue` shows 6 dots at `fade-in` 0/70/140/210/280/350 ms,
> `animation: none` under reduced motion, and **0 elements left at opacity 0** in either mode.

### 6b.3 The deep routes (brief §1.3)

Applied only where a page's **existing, real** composition supported it — no overlay copy, no
invented KPI, nothing manufactured to give motion something to point at.

| Where | What | Observers added |
|---|---|---|
| `primitives.tsx` `BulletList` | Stagger. The widest single application on the site — it renders on nearly every route | **0** — every call site is already inside a `<Reveal>` |
| `page-template.tsx` `Chain` | The pipeline above, on 12 blocks | 0 |
| `page-template.tsx` `Panel` | Stagger on the permission-key chips | 0 |
| `page-template.tsx` `ChainStrip` | Stagger on Deal → … → Invoice; `<Reveal as="ol">` | 1 per deep page |
| `/security` | Stagger + Lift on the six control cards | 0 |
| `/company/about` | Stagger on the platform-facts row and the four principles | 0 |
| `/faq` | Stagger on the question list | 0 |
| `/company/contact` | Stagger on the contact routes | 0 |
| `/resources/blog`, `/resources/changelog` | **One observer on the list, not one per card** | −N per list |

`Reveal` gained `'ol'` alongside `'ul'`, for the same reason and one more: an ordered list also
loses its numbering semantics to a wrapper `<div>`, and in the ChainStrip the order *is* the
content.

> **The blog/changelog find.** Both were still `<Reveal as="li">` per item — the one-observer-per-child
> pattern the rest of the site was converted off on 2026-09-01, and the exact thing deck slide 06
> forbids. They were missed because both lists render from a live content service that is
> unreachable, so they render empty and contributed **zero** observers to any count. The bug would
> have arrived with the first published article. Fixed on both.

**Declined, with reasons, rather than manufactured:**

- **`permission-matrix.tsx`** — the brief asks for "a diagram or matrix with real relationships and
  zero connector motion". It is a `<table>`; it has no connectors. Adding some would mean inventing
  a diagram. It already animates its badge and its consequence list.
- **P3's video overlays** — unchanged and for the unchanged reason (§5): the four gaps are already
  named as text beside the video.
- **`/legal/[doc]`, `/roi`, `/demo`, `/developers/*`** — already covered by the `BulletList` change
  or by the template; nothing further that is real.

### 6b.4 Parallax (brief §1.4) — the question was already answered

**No decision needed, and no layered hero was built.** The brief records parallax as "specified,
not shipped" and asks for a choice between rebuilding a layered hero and formally retiring it. That
premise is **stale**: parallax shipped on **2026-09-02**, in the same session that produced the M6
analysis the brief was written from — `interactive/hero-video.tsx`, applied to the hero video's own
backdrop layer, moving *against* the pointer, capped at the specified ±8 px, gated on
`(hover: hover) and (pointer: fine)`, off entirely under reduced motion. Measured then at
`−7.56px / +6.22px` and exactly inverted at the opposite corner.

So the full-bleed hero did not need to be un-retired to carry it: the video layer *is* the layer.
**6 of 6 patterns built.** No work, and nothing to record as "will not implement".

## 6c. Token discipline in this pass

- `--duration-row: 220ms` added. It was the **last hard-coded duration in `globals.css`** (P6's
  code rows), so rule 8 now holds there without exception.
- Three keyframes renamed from their first call site to the pattern they implement, because each
  now has a second user: `chain-draw` → **`draw-in`** (ChainRail + ArchitectureRail),
  `chain-node` → **`fade-in`** (chain nodes + pipeline dots + code rows), `bar-grow` → **`grow-y`**
  (P7 bars + pipeline segments). Naming a pattern after whichever beat built it first is how the
  second beat ends up copying the three lines instead of reusing them.
- `motion.ts` gained a **framer mirror** — `EASE_OUT_QUINT`, `DURATION_RISE_S`,
  `DURATION_CROSS_FADE_S`, `DURATION_LIFT_S`, `DURATION_INDICATOR_S`, `staggerS()`. framer takes
  numbers and cannot read a custom property, so the islands each carried their own copy of `0.2`
  and `[0.16, 1, 0.3, 1]`. `globals.css` stays authoritative; these exist because framer cannot
  reach it.

## 6d. Semantic-token tail (brief Part 2, Stage 2)

Stages 2–4 had already landed before this pass: the azure ground is applied, and `check:contrast`
was rewritten for it and passes 48/48. What was left was a genuine tail, and one of it was a live
bug:

- **`page-template.tsx` `RelatedLinks`** — `group-hover:text-[var(--color-brand-600)]` on the arrow.
  On the azure ground brand-600 is a *fill* colour measuring ~2.3:1 as an icon on a card, so the
  hover state made the affordance **less** visible than at rest. → `--color-link`.
- **`sections/faq.tsx`** — `hover:decoration-[var(--color-brand-600)]`: a dark-blue underline on a
  dark surface, the same failure. → `--color-link-strong`.
- **`sections/permissions.tsx`, `sections/security.tsx`** — link text and underline on raw ramp
  steps. All four of the site's "read more" links now carry one semantic recipe.

**Left alone, deliberately, and each for a reason:**

- **`sections/hero.tsx`** keeps `--color-brand-300` at two call sites. It is not a link colour
  reaching past the semantic layer — it is a **measured-against-video** choice (4.93:1 against the
  95th-percentile frame, with brand-400 rejected at 2.95:1) and it carries that measurement in a
  comment. `--color-link` currently *equals* brand-300, so the swap would be value-identical today
  and would silently break the day `--color-link` is re-pointed. The literal is the correct thing
  here.
- **`sections/permissions.tsx`** keeps `brand-400` on one Check icon: an icon fill on the band, and
  `check:contrast` already asserts `brand-400 on band-surface` at 5.38:1. (It is a hand-rolled
  `BulletList tone="band"`; converging the two would change the tick from blue to cyan, which is a
  design change, not a migration.)
- **`diagrams/integration-web.tsx`** is now the **only** file in `src/` still using raw ramp steps
  for a foreground colour — four call sites on brand-600/700/800 as text plus pale chip fills that
  assume a light surface. It is **unrendered**: kept as blocker B10's option (b). It was skipped on
  purpose, because a component that renders nowhere cannot be verified by looking at it and a blind
  token swap would have produced confidence rather than correctness. A warning block was added to
  its header instead: reinstating it is a dark-ground design pass, not a find-and-replace.

Also corrected: `check-contrast.mjs`'s `FILL_ONLY` note claimed an `fg-inverse on cyan-500` pair was
"asserted as a normal pair above". **No such row has ever existed.** The comment now says why there
isn't one — nothing on the site renders text on a cyan fill — and notes that `--color-fg-inverse` is
light on this ground, so it is not the escape hatch its name suggests.

## 7. Blockers

| # | Blocker | Blocks | Owner |
|---|---|---|---|
| ~~A1~~ | ~~Rise 480 → 320 ms site-wide~~ | — | **resolved 2026-09-01: adopt 320 ms, deck is authority** |
| ~~A2~~ | ~~`kpi-highlight.svg` does not exist~~ | — | **resolved 2026-09-01: CSS radial-gradient instead** |
| A3 | `DECISION 1 → C` / `DECISION 2 → C` logs not supplied | confirmation only, not blocking | — |

## 8. Deviations from the brief, and why

Recorded so they are choices rather than drift:

1. **Hero excluded.** The brief says all 11 sections; the deck says
   `HERO — LOCKED · reference only` and "every **non-hero** beat". Source of truth wins.
2. **Values read, not estimated.** The brief's Phase 1 asks for frame-by-frame estimation
   to ±50 ms. The deck prints exact numbers, so estimation would add error rather than
   remove it.
3. **Token names follow the repo.** The brief's `--dur-fast` / `--dur-base` / `--dur-slow`
   do not exist here (spec §5a); new tokens use the existing `--duration-*` convention.
4. **`Reveal` extended, not rewritten** (§5).
5. **No choreography invented** for the four beats the deck leaves at Rise + Stagger.
   "Six patterns. Nothing else."
6. **Contrast pair count.** The brief's checklist says "all 26 colour pairs";
   `check:contrast` covers **48** pairs plus a fill-only assertion. The gate is the script,
   not the number in the brief.
