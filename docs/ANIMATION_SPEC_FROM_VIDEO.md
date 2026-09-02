# Animation Specification Extracted from the Motion System Video

**Status:** Phase 1 complete — extraction only. No code changed by this document.
**Extracted:** 2026-09-01.
**Source:** `~/Downloads/Motion System Video.mp4` (not in the repo; 13.9 MB, untracked).

---

## 0. What this video actually is — read this first

It is **not** generic reference footage to imitate. It is a **purpose-built motion
specification deck for this site**, headed `ALGORYQ ONE · MOTION CHOREOGRAPHY`, tagged
**M5**, eleven slides, each carrying **written redlines** — durations, offsets, easings,
token names and asset names.

That changes the method. Phase 1 as briefed says to watch, estimate timings and infer
easing curves. There is nothing to infer: every number is printed on the slide. The values
below are **read off the deck**, not measured from pixel motion, so they are exact rather
than ±50ms. Where the deck is silent, this document says so instead of guessing.

Two scope facts, both stated by the deck itself:

- Slide 01 subtitle: **"Every non-hero beat, its choreography and its redlines."**
- Slide 03: **`P1 / HERO — LOCKED`**, `STATUS: reference only`.

**The hero is out of scope.** The brief asks to implement "across all 11 homepage
sections"; the source of truth excludes one of them. The deck wins — and this is
convenient, because the hero was rebuilt as a full-bleed video on 2026-08-31 and its
`900ms · 3 beats` mount choreography is already shipped and unrelated to scroll motion.

### Video metadata

| | |
|---|---|
| Container / codec | MP4 / H.264, no audio track |
| Resolution | 1280 × 720 |
| Frame rate | 30 fps constant |
| Duration | **56.5 s** (1695 frames) |
| Structure | 11 slides, cross-faded, page counter top-right |
| Background | flat `#f1f1f1`-family light grey; ink text; brand blue / cyan / violet accents |

### Slide index (from the page counter, verified frame by frame)

Scene detection finds nothing here — the transitions are cross-fades, so the scene score
never spikes. The counter in the top-right corner is the reliable index and was read for
all 56 seconds.

| Slide | Seconds | Title | Beat |
|---|---|---|---|
| 01 | 0–3 | Motion system | — (cover) |
| 02 | 4–8 | Six patterns. Nothing else. | — (vocabulary) |
| 03 | 9–13 | The rhythm everything inherits | P1 Hero — **LOCKED** |
| 04 | 14–20 | Draw, then travel | P2 Chain |
| 05 | 21–25 | Video, with the gaps named | P3 Problem |
| 06 | 26–30 | Six cards, one cadence | P4 Platform |
| 07 | 31–35 | Four proofs, one claim | P5 Capabilities |
| 08 | 36–40 | Chrome first, then the code | P6 Developers |
| 09 | 41–46 | Static base, live overlay | P7 Intelligence |
| 10 | 47–51 | Reduced motion is the same design, held still. | — (a11y contract) |
| 11 | 52–55 | Eleven beats, one scroll. | — (beat order) |

---

## 1. The vocabulary — slide 02, "Six patterns. Nothing else."

The title is a constraint, not a description: six patterns, and nothing outside them.

| Pattern | Redline | Value |
|---|---|---|
| **Rise** | `translateY(16px)` + opacity | **320 ms** |
| **Stagger** | rise, **60–80 ms per child** | **cap 6** |
| **Draw** | `stroke-dashoffset 100→0` | **800 ms** |
| **Cross-fade** | opacity + **8 px** slide | **200 ms** |
| **Lift** | `translateY(-2px)`, `e1→e2` | **120 ms** |
| **Parallax** | max **±8 px**, fine pointer | desktop only |

Notes read off the slide, not added here:

- `cap 6` on Stagger is a **hard cap on staggered children**, not a duration. A seventh
  child gets the sixth child's delay. Slide 06 confirms it: `70ms × 6 — at cap`.
- Lift's `e1→e2` is the elevation ramp — `--shadow-e1` → `--shadow-e2`, which already
  exist.
- Parallax is gated on **fine pointer**, so it is a `(hover: hover) and (pointer: fine)`
  concern, not a width breakpoint.

---

## 2. Per-beat choreography

Each block below is transcribed verbatim from its slide's redline table, then annotated.

### P1 — Hero · slide 03 · **LOCKED, reference only**

```
DURATION   900ms · 3 beats
STAGGER    80ms between cards
TRIGGER    on mount, no observer
STATUS     reference only
```

No work. Recorded for completeness and because `TRIGGER: on mount, no observer` is the one
place in the deck where motion is not scroll-driven — worth knowing before someone
"fixes" the hero to use an observer for consistency.

### P2 — Chain · slide 04 · "Draw, then travel" · **signature moment**

```
DRAW       800ms · dashoffset 520→0
NODES      70ms stagger
TRANSIT    1400ms ease-inout
TOKENS     --ease-out · --color-cyan-500
```

The slide shows a five-node rail — `CRM → WBS → Tasks → Time → Invoice` — with the line
drawing first, then a **cyan token travelling along it** and parking on `Invoice`. Below
it, three chips: `One record`, `No re-entry`, `Audit intact`. Above: `ONE WORK ITEM · NO
HANDOFF`.

- `dashoffset 520→0` is a concrete path length, so the rail is **one path** of length ~520
  user units, not five segments.
- **`TRANSIT 1400ms` is the only ease-inout in the deck** and the only value above 900ms.
  It is the travelling token, not the draw.
- This is the deck's declared **signature moment**. If only one thing gets built, it is
  this.

### P3 — Problem · slide 05 · "Video, with the gaps named" · `DECISION 2 → C`

```
OVERLAYS   200ms · 500ms apart
DRIVER     timeupdate, not setTimeout
LIST       70ms stagger, in parallel
FALLBACK   poster + static callouts
```

Panel is captioned `SYSTEM_ARCH_1080P` — i.e. the existing
`Software_integration_system_arch….mp4`, which §3 already renders via `SystemArchVideo`.

- **`DRIVER: timeupdate, not setTimeout` is the load-bearing line.** Callouts must be
  driven off the video element's own clock. A `setTimeout` chain drifts the moment the
  video stalls, buffers or is throttled in a background tab, and then the labels describe
  the wrong frame. This is a correctness requirement, not a preference.
- `LIST ... in parallel` means the bullet stagger runs **alongside** the overlay sequence,
  not chained after it.
- `DECISION 2 → C` is a reference to a decision log this deck does not include.

### P4 — Platform · slide 06 · "Six cards, one cadence" · stagger at cap

```
DURATION   320ms per card
STAGGER    70ms × 6 — at cap
HOVER      lift −2px · 120ms
OBSERVER   one, on the grid
```

Cards shown: `CRM`, `Work breakdown`, `Tasks`, `Timesheets`, `Invoicing`, `Reporting`.

- **`OBSERVER: one, on the grid`** — a single IntersectionObserver on the grid container,
  not one per card. Six observers where one will do is the wasteful pattern this line
  exists to forbid.
- Exactly 6 cards, exactly at the `cap 6`.

### P5 — Capabilities · slide 07 · "Four proofs, one claim" · stagger + sweep

```
CARDS      320ms · 80ms stagger
RULE       480ms scaleX, origin left
TRIGGER    observer @ 25%
TOKENS     --color-brand-600
```

Cards shown: `Role-aware access`, `Server-first delivery`, `Audit trail`, `Typed API`,
with a brand-blue rule sweeping in under the grid.

- The **sweep** is a new element: a horizontal rule that scales in from the left at
  `480ms`. It is the "one claim" under the four proofs.
- `TRIGGER: observer @ 25%` — this is the only slide that states a threshold, and it is
  **0.25**. The repo's `Reveal` currently uses `0.2`.
- `80ms` here vs `70ms` on P4/P2/P3 is deliberate: four cards can afford the slower
  cadence, six at cap cannot.

### P6 — Developers · slide 08 · "Chrome first, then the code" · video reframed

```
CHROME     rise 320ms
ROWS       220ms · 180ms apart
OUTPUT     cross-fade 200ms
FALLBACK   poster + output shown
```

Panel is a terminal titled `createInvoice.ts` with a status line
`invoice.created  ok 142ms`, and three bullets: `Typed end to end`, `Idempotent by
design`, `Webhooks on every state`.

- **Three-stage sequence:** the window chrome rises first, then code rows arrive
  `180ms` apart at `220ms` each, then the output line cross-fades in.
- `ROWS 180ms apart` is well outside the `60–80ms` stagger band — this is a *typing*
  cadence, not a stagger, which is why the deck gives it its own row rather than calling
  it Stagger.
- `FALLBACK: poster + output shown` — the fallback must show the **result**, not just the
  first frame. The point of the block is that the call succeeded.

### P7 — Intelligence · slide 09 · "Static base, live overlay" · `DECISION 1 → C`

```
BARS         scaleY 320ms · 70ms apart
HALO         320ms, one KPI only
ANNOTATION   cross-fade 200ms
ASSET        kpi-highlight.svg
```

Panel shows three KPI chips — `MARGIN`, `UTILISATION`, `DSO` — with **`UTILISATION`
haloed in cyan**, a seven-bar chart with the fourth bar cyan, and a callout reading
`peak week 34`.

- **`HALO ... one KPI only`** is a rule: exactly one KPI may be haloed. Two is a bug.
- **`ASSET: kpi-highlight.svg` does not exist in this repo.** It is a named deliverable,
  not something to improvise. See §5.
- "Static base, live overlay" is the architecture: §7's static screenshot stays the base
  layer and the motion is an overlay on top — so this does **not** mean replacing the
  2026-08-10 static screenshot decision.

### Beats with no dedicated slide

Slide 11 lists eleven beats, but only P1–P7 get choreography slides. These four appear in
the beat order and nowhere else:

| Beat | Deck guidance |
|---|---|
| Permissions | none beyond the six patterns |
| Security | none beyond the six patterns |
| FAQ | none beyond the six patterns |
| Final CTA | none beyond the six patterns |

They inherit Rise + Stagger at `60–80ms` and nothing more. **Do not invent choreography
for them** — "Six patterns. Nothing else." is the constraint, and a bespoke flourish on
the FAQ would violate the deck as surely as a seventh pattern would.

---

## 3. Reduced motion — slide 10, and it is a design, not a fallback

Title: **"Reduced motion is the same design, held still."** Footer chip:
`@media (prefers-reduced-motion: reduce)`.

| Beat | Reduced-motion end state |
|---|---|
| Chain | `path painted, token parked on Invoice` |
| Problem | `poster frame, all callouts drawn` |
| Intelligence | `halo and annotation static` |

The principle is exact and worth stating plainly: reduced motion is **the final frame of
the animation, rendered immediately** — not the pre-animation state, and not a stripped
version. Every one of the three examples names an *end* state: the path painted, the token
already parked, every callout already drawn, the halo already on.

This matches the repo's existing `Reveal` contract, which shows content and never arms
the transform under `reduce`. It also means the Draw and Transit work must be built so
that "skip to end" is a real state, not merely "don't animate".

---

## 4. Beat order — slide 11, "Eleven beats, one scroll."

A Gantt of eleven staggered bars, in scroll order:

```
Hero · Chain · Problem · Platform · Permissions · Capabilities
     · Intelligence · Developers · Security · FAQ · Final CTA
```

**This matches the shipped homepage exactly**, in order, once `Testimonials` — which is
content-gated and returns `null` — is discounted. Verified against `src/app/page.tsx`.
No resequencing is implied by the deck.

---

## 5. Token reconciliation — the conflicts that must be settled before code

The deck's numbers and the repo's tokens **do not currently agree**. This is the single
most important output of Phase 1.

### 5a. What the repo actually has

`src/app/globals.css`, verified:

```css
--ease-out-quint:    cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out-quint: cubic-bezier(0.65, 0, 0.35, 1);
--duration-rise:     480ms;   /* backs .reveal-in */
--duration-scan:     900ms;   /* backs .code-scan */
```

> **The brief's "Current System" block is wrong and must not be coded against.** It lists
> `--dur-fast: 120ms`, `--dur-base: 200ms`, `--dur-slow: 320ms`, `--ease-out`, `--ease-in`,
> `--ease-inout`. **None of those tokens exist in this repo.** An invalid `var()` fails
> silently in CSS — the declaration is simply dropped — so following that block would have
> produced animations that quietly do nothing, on every section, with a green build.
> The `--ease-out` *value* it quotes does match `--ease-out-quint`; the `--ease-inout`
> value it quotes (`0.4, 0, 0.2, 1`) does **not** match `--ease-in-out-quint`.

### 5b. Deck value vs shipped value

| Pattern | Deck | Repo today | Verdict |
|---|---|---|---|
| Rise duration | **320 ms** | `--duration-rise: 480ms` | **CONFLICT** — see 5c |
| Rise transform | `translateY(16px)` | `translateY(16px)` | agrees |
| Cross-fade | **200 ms** + 8 px | no token; not implemented as a pattern | add |
| Lift distance | **−2 px** | `hover:-translate-y-0.5` = −2 px | agrees |
| Lift duration | **120 ms** | `duration-200` at all call sites | **drift** |
| Draw | **800 ms**, dashoffset | **not implemented anywhere** | build |
| Stagger band | **60–80 ms**, cap 6 | 50/60/70/80/260 ms, no cap | **drift** |
| Observer threshold | **0.25** (P5) | `0.2` in `Reveal` | drift |
| Parallax | ±8 px, fine pointer | not implemented | build |

### 5c. The one decision that needs a human

**Rise is specified at 320 ms; the site ships 480 ms.**

`--duration-rise` backs `.reveal-in`, which is used by every `Reveal` on **all ~48
routes** — not just the homepage. Retuning it to 320 ms is a site-wide motion change,
and it is a 33% speed-up of every entrance on the site.

Three options, in order of preference:

1. **Adopt 320 ms site-wide.** The deck is the newer artefact, authored for this site, and
   slide 03 is titled "the rhythm everything inherits" — which reads as an explicit claim
   to global authority. Cleanest, one value, no split-brain.
2. Adopt 320 ms for the seven choreographed beats and leave 480 ms elsewhere. Two rise
   speeds on one site; the shared-page-template routes would visibly differ from the
   homepage. Not recommended.
3. Keep 480 ms and treat the deck's 320 ms as approximate. Contradicts the brief's own
   50 ms tolerance, so this would need to be a stated deviation.

**Recommendation: option 1**, recorded as a dated decision in `02` §7 and
`MASTER_PROGRESS`. It is not applied by this document.

### 5d. Tokens to add if the deck is adopted

Names follow the repo's existing convention (`--duration-*`, `--ease-*-quint`), **not**
the brief's invented `--dur-*`:

```css
--duration-rise:       320ms;  /* retuned from 480ms — see 5c */
--duration-cross-fade: 200ms;
--duration-lift:       120ms;
--duration-draw:       800ms;
--duration-sweep:      480ms;  /* P5 rule scaleX */
--duration-transit:    1400ms; /* P2 token travel — the only ease-in-out */
--stagger-tight:       70ms;   /* P2, P3, P4, P7 */
--stagger-wide:        80ms;   /* P1, P5 */
--stagger-cap:         6;      /* hard cap on staggered children */
```

`--duration-scan: 900ms` is superseded for §8 by P6's three-stage
chrome/rows/output breakdown, but the token is still referenced by `.code-scan` and must
not be deleted until that section is rebuilt.

---

## 6. Missing assets and open questions

| Item | Status |
|---|---|
| `kpi-highlight.svg` (P7, named on slide 09) | **does not exist in the repo.** Needs to be produced or the halo built in DOM/CSS instead. Not improvisable — the deck names a specific asset. |
| `DECISION 1 → C` (P7), `DECISION 2 → C` (P3) | reference a decision log not included in the deck. Both slides are self-sufficient without it, but the log would confirm intent. |
| Permissions / Security / FAQ / Final CTA | no choreography slide. Treated as Rise + Stagger only (§2). |
| P2 path length `520` | the deck's chain rail is a single path of ~520 units. The repo's `ChainCurrent` is a different composition; its real `getTotalLength()` must be measured rather than hard-coding 520. |

---

## 7. Performance and a11y notes

- Every pattern in the deck animates **`transform` and `opacity` only**, except Draw
  (`stroke-dashoffset`) and the P5 sweep (`scaleX`, which is a transform). Nothing
  animates layout. This is compatible with the 60 fps gate as specified.
- `stroke-dashoffset` is not GPU-composited and repaints the path each frame. At 800 ms
  on one path this is fine; it must not be applied to many paths at once.
- Parallax is `fine pointer` only per the deck, which satisfies the "no parallax on touch"
  requirement without a width query.
- Nothing in the deck flashes or strobes; the fastest repeat is the 180 ms row cadence in
  P6, far below the 3 Hz seizure threshold.
- No pattern conveys information that is not also in text, so the "motion must not be the
  sole carrier" rule holds — with one caveat: **P7's `peak week 34` annotation and the
  haloed KPI are content**, and must exist in the DOM as text regardless of motion state.

---

## 8. Frame evidence

Slide stills extracted for this analysis (one per slide, taken at the last second of each
slide's range so every progressive build is complete):

```
ffmpeg -ss <t> -i "Motion System Video.mp4" -frames:v 1 -q:v 2 s<NN>.png
t = 3.5, 8.6, 13.6, 20.4, 21.6, 30.6, 34.4, 40.6, 46.4, 51.2, 56.2
```

Three of the first-pass timestamps (35.6, 46.6, 51.6) landed mid-cross-fade and produced
half-faded frames; they were re-taken by picking the densest candidate in a ±0.8 s window.
Anyone re-running this should verify against the page counter rather than trusting a
seconds-to-slide assumption — the cross-fades make the naive mapping off by up to a
second.
