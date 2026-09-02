# Animation Implementation Matrix

**Status:** **All 7 choreographed beats built, 2026-09-02**, and the patterns now run site-wide
through `page-template.tsx` (~40 routes). Outstanding: parallax (deck: "specified, not shipped"),
and the azure dark-ground direction, which conflicts with rule 10 and needs a decision.
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
| 4 | Platform | `platform.tsx` | **Stagger + Lift** | 320 ms/card · 70 ms × 6 at cap · lift −2 px/120 ms · one observer | ✅ **done** |
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
