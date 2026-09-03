'use client';

/**
 * §4 Platform — the architecture diagram draws itself on scroll (owner
 * instruction, 2026-09-03).
 *
 * The four app cards rise, their connectors draw down into the collector point
 * above the gateway, the gateway acknowledges the arrival with a one-beat
 * activation, the spine chips rise, and the last line drops from the gateway
 * into them. Progress is bound to the scrollbar (`scrub`), so scrolling back up
 * runs the whole thing in reverse.
 *
 * The lines were already `<path>` elements drawn with
 * `stroke-dasharray/dashoffset` — see `diagrams/architecture-rail.tsx`. What
 * this adds is *when*: the same six paths, moved off a fixed 800ms CSS
 * entrance and onto the scroll position, and sequenced against each other
 * instead of all leaving at once 70ms apart.
 *
 * ── Two rules this deliberately breaks, and the authority for it ──────────
 *
 * 1. **docs/09 §1 rule 7 — "no forced pinning that traps the user."** This
 *    pins. The rule is superseded by owner instruction for this beat and for
 *    §3's ChainSpread, and the mitigation the rule was protecting is kept
 *    rather than dropped: the pin is bounded at `PIN_VH` (1.2 viewports, one
 *    trackpad flick), it never waits on the animation to release, and a fast
 *    flick straight through leaves the diagram complete rather than half-drawn,
 *    because `scrub` means scroll position *is* the progress. Both docs are
 *    updated with the supersession recorded, per the CLAUDE.md rule-10
 *    convention.
 * 2. **docs/11 §1 — "GSAP/ScrollTrigger rejected."** `use-card-spread.ts`
 *    already took this carve-out, on the same grounds and by the same
 *    authority: a CSS animation cannot be driven by scroll position on the
 *    browsers we support, and framer's `useScroll` cannot pin. This is a third
 *    consumer of a plugin that is now in the bundle either way, not a new
 *    dependency.
 *
 * ── Why this does not use `useCardSpread` ─────────────────────────────────
 *
 * That hook is the site's other pinned, scrubbed island, and it was checked
 * first. It is not the shared primitive this needs, because what it factors out
 * is the *deck-to-row spread* — `deckX`, the stack offsets, `STACK_SCALE`, the
 * z-index paint order — and layers a caller's extra tweens on top via
 * `decorate`. There is no deck here and no spread; the app cards do not move
 * horizontally at all. Adopting it would mean passing a `stackAnchor` for a
 * gesture this diagram must not perform, and then suppressing it.
 *
 * Two of its structural choices are also wrong for this beat, which is the
 * clearer half of the reason:
 *
 *  - It pins `row.closest('section')`. That is right for §3 and §6, whose
 *    sections are a heading and a row. §4 is not: it carries the platform
 *    video, the ClusterSwitcher and this diagram, so pinning the section would
 *    hold ~3000px of content still and leave the diagram off-screen for most of
 *    the pin. The pinned element here is the diagram box itself.
 *  - Its breakpoint is `xl`, where those two sections turn a column into a row.
 *    This diagram reflows at `sm` and `lg` instead, because that is where the
 *    app grid changes column count and therefore how many curves exist.
 *
 * What genuinely is common between the two is about fifteen lines — the
 * ScrollTrigger pin block, the `document.fonts.ready` refresh and the
 * `mm.revert()` teardown. Those are duplicated here deliberately rather than
 * hoisted, because hoisting them would mean reshaping `useCardSpread` (a
 * configurable pin target and configurable queries) while it is the live
 * dependency of two other sections. Worth doing as its own change, with all
 * three callers in view; not worth doing as a side effect of this one.
 *
 * ── The contract, which is the same one as everywhere else here ───────────
 *
 * **The resting state is the finished state.** Every tween is a `fromTo` whose
 * end is exactly where CSS already puts the element — `strokeDashoffset: 0`,
 * `opacity: 1`, `y: 0`, `scale: 1`, glow at `opacity: 0`. Consequences worth
 * keeping:
 *
 *  - No JavaScript, a failed hydration, or this island reverted → the diagram
 *    renders complete and correct. The server output is already the finished
 *    state; nothing here hides anything until GSAP has confirmed it can run.
 *  - Nothing in the diagram's height depends on the animation, so the unpin is
 *    invisible — the pin-spacer hands back exactly the space that went in.
 *  - Only `transform`, `opacity` and `stroke-dashoffset` are ever written.
 *    docs/09 rule 5 forbids animating `box-shadow` or `filter` on scroll, which
 *    is why the gateway's glow is a separate absolutely-positioned element
 *    carrying a static shadow whose *opacity* is tweened, rather than a shadow
 *    that is animated in place.
 *
 * ── Nothing is measured, and that is what makes it resize-proof ───────────
 *
 * The obvious way to write a path-draw is `getTotalLength()` on mount, then
 * re-measure every path on resize because the length changes with the layout.
 * There is none of that here, because the rails declare `pathLength="100"`:
 * the SVG spec then treats every path as being 100 user units long whatever its
 * real geometry, so `stroke-dasharray: 100` covers it exactly at every width
 * and the tween endpoints (100 → 0) are literals that no resize can invalidate.
 * Resize handling is therefore ScrollTrigger's own refresh — recomputing where
 * the pin starts and ends — and nothing more. `invalidateOnRefresh` is not set
 * because there is no measured value for it to re-read.
 *
 * ── Where it runs ─────────────────────────────────────────────────────────
 *
 * `gsap.matchMedia` splits it, and each branch is reverted for us when its
 * query stops matching — which is what makes crossing a breakpoint safe, since
 * a different one of the three fans is the rendered one on each side of it.
 *
 *  1. `lg` and up + motion allowed → the pinned sequence against the 4-column
 *     fan.
 *  2. `sm` to `lg` + motion allowed → the same sequence against the 2-column
 *     fan. The app grid is 2×2 here, so the fan is two curves, not four.
 *  3. below `sm` → **not taken over at all.** The grid is a single stacked
 *     column and the "fan" is one straight vertical line, so there is no
 *     convergence left to draw; pinning a phone for 1.2 viewports to watch one
 *     line grow would be the scroll-jacking rule 7 is actually about. These
 *     widths keep the existing one-shot CSS entrance, untouched, which is both
 *     the simpler fallback the brief asks for and the thing that already ships.
 *  4. reduced motion → no branch matches, so not a single tween is created and
 *     the CSS entrance is suppressed by its own `prefers-reduced-motion` block.
 *     The diagram is simply complete and static.
 */

import { useRef, type ComponentPropsWithoutRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ──────────────────────────── Redlines ─────────────────────────────────── */

/**
 * Timeline units, not seconds. Under `scrub` the timeline is normalised across
 * the scroll distance, so only the *ratios* between these matter — doubling
 * every number below would produce an identical animation.
 */

/** Rise distance for the cards and chips, in px. The brief's "~10px". */
const RISE = 10;

/**
 * Opacity the cards and chips *start* at — not 0, and this is load-bearing.
 *
 * A scrubbed timeline sits at progress 0 for the whole approach, which here is
 * the ~830px of scrolling between the diagram entering the viewport from the
 * bottom and its top reaching the header, where the pin starts. Fading from 0
 * meant that during all of it the reader saw a box containing a gateway, an
 * empty dashed spine and three invisible app cards — a diagram that looks
 * broken rather than one that has not started yet. Caught in a screenshot, not
 * in the assertions, which is the third time that has happened on this repo
 * (CLAUDE.md, "Read the screenshots").
 *
 * At 0.4 the whole structure is legible on approach and still visibly firms up
 * as its own connector leaves it, so the sequence the brief asks for survives.
 * Same value and same reasoning as `STACK_OPACITY` in `use-card-spread.ts`,
 * whose backgrounded cards are never fully transparent either.
 */
const PENDING_OPACITY = 0.4;

const CARD_DURATION = 0.4;
/** The site's tight stagger band (70ms), as a ratio. See site/motion.ts. */
const CARD_STAGGER = 0.07;

/**
 * How far into the cards' arrival the connectors start leaving them.
 *
 * At 0.6 the first curve starts while the last card is still settling, so the
 * cards read as the *source* of the lines rather than as a separate animation
 * that happens to finish first.
 */
const FAN_CUE = 0.6;

const FAN_DURATION = 1;
/** Left-to-right, inside the brief's 0.05–0.08 window and on the same 70ms. */
const FAN_STAGGER = 0.07;

/**
 * The gateway's activation. Deliberately asymmetric — a fast snap up and a
 * slower settle back, which is the site's "fast in, slow out" (docs/09 rule 3)
 * at the only scale this gesture has room for.
 */
const PULSE_SCALE = 1.02;
const PULSE_IN = 0.16;
const PULSE_OUT = 0.26;
/** The ring lingers a little past the scale, so the box stops moving first. */
const GLOW_OUT = 0.34;

const CHIP_DURATION = 0.3;
const CHIP_STAGGER = 0.045;
/**
 * How far ahead of the drop the chips start. Small and positive on purpose:
 * the destination exists just before the line reaches for it, per the brief.
 */
const CHIP_LEAD = 0.12;

const DROP_DURATION = 0.7;

/**
 * Pinned scroll distance, as a fraction of the viewport height. Matches
 * ChainSpread's 1.2 — a little over one flick of a trackpad, and the value that
 * island already landed on as the point above which a pin starts to read as
 * scroll-jacking. The brief's ~100–150vh window agrees.
 */
const PIN_VH = 1.2;

/**
 * The two widths the fan reflows at — Tailwind's `sm` (40rem) and `lg` (64rem),
 * which are the breakpoints `platform.tsx`'s `grid sm:grid-cols-2
 * lg:grid-cols-4` uses and that `ArchitectureFan` mirrors. **These must move
 * with that grid**, because the column count is how many curves exist.
 *
 * Written out as three non-overlapping queries rather than composed from two
 * bare widths. `(min-width: 64rem)` and `(max-width: 64rem)` both match at
 * exactly 1024px, which would build two timelines over the same paths and
 * double-tween every dashoffset; the `.999rem` upper bound is what stops that.
 * `use-card-spread.ts` states its pair the same way, for the same reason.
 */
const WIDE_QUERY = '(min-width: 64rem) and (prefers-reduced-motion: no-preference)';
const NARROW_QUERY =
  '(min-width: 40rem) and (max-width: 63.999rem) and (prefers-reduced-motion: no-preference)';

/* ──────────────────────────── The island ───────────────────────────────── */

/**
 * Takes the full `<div>` prop set and spreads it, because this island *is* the
 * diagram box rather than a wrapper around it: platform.tsx swaps its
 * `<div role="group">` for `<ArchitectureDraw role="group">` and changes
 * nothing else. That keeps the styling, the `role` and the `aria-labelledby`
 * at the call site where they are readable, adds no node to the DOM, and
 * leaves the pinned element and the styled element as one box — so the pin
 * cannot disagree with the border it is supposed to be holding still.
 */
export function ArchitectureDraw({ children, ...rest }: ComponentPropsWithoutRef<'div'>) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const box = root.current;
      if (!box) return;

      const cards = gsap.utils.toArray<HTMLElement>('[data-arch-app]', box);
      const chips = gsap.utils.toArray<HTMLElement>('[data-arch-chip]', box);
      const gateway = box.querySelector<HTMLElement>('[data-arch-gateway]');
      const glow = box.querySelector<HTMLElement>('[data-arch-glow]');
      const drop = box.querySelector<SVGPathElement>('[data-arch-rail="drop"]');
      if (!gateway || !drop) return;

      const mm = gsap.matchMedia();

      /**
       * The pinned sequence, against whichever fan is the rendered one at this
       * width. Identical either side of `lg` apart from that selector — the
       * beats, the cues and the pin are the same animation, so they are written
       * once and the breakpoint only chooses its subject.
       */
      const build = (columns: 2 | 4) => () => {
        const fan = gsap.utils.toArray<SVGPathElement>(
          `[data-arch-cols="${columns}"] [data-arch-rail="fan"]`,
          box,
        );
        if (fan.length === 0) return;

        /*
          The marker that hands ownership to this timeline. Until it is set, the
          `.reveal-seen` CSS entrance in globals.css is what animates these
          elements; the `[data-arch-draw='scrub']` rules there switch that off.
          Both drivers write `stroke-dashoffset` and `opacity`, and a CSS
          `animation` beats an inline style for as long as it runs, so leaving
          both live would let the CSS entrance stamp over the scrub for its
          first 800ms. It is set here rather than on mount so that branch 3 and
          reduced motion — which create no timeline — never disown the CSS.
        */
        box.dataset.archDraw = 'scrub';

        gsap.set(gateway, { transformOrigin: 'center center' });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: box,
            /*
              Sits the diagram under the sticky header rather than behind it, so
              the whole thing is readable for the duration of the pin. Measured
              rather than hardcoded — the header is one element and it knows its
              own height. Same expression as ChainSpread.
            */
            start: () => `top ${document.querySelector('header')?.offsetHeight ?? 0}px`,
            end: () => `+=${window.innerHeight * PIN_VH}`,
            scrub: true,
            pin: box,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });

        /* ── 1. The apps arrive ─────────────────────────────────────────── */
        timeline.fromTo(
          cards,
          { opacity: PENDING_OPACITY, y: RISE },
          {
            opacity: 1,
            y: 0,
            duration: CARD_DURATION,
            stagger: CARD_STAGGER,
            ease: 'power2.out',
          },
          0,
        );

        /* ── 2. Their connectors draw down into the collector point ─────── */
        const fanAt = CARD_DURATION * FAN_CUE;
        timeline.fromTo(
          fan,
          { strokeDashoffset: 100 },
          {
            strokeDashoffset: 0,
            duration: FAN_DURATION,
            stagger: FAN_STAGGER,
            // Linear, because this is a line being extended at a constant
            // rate. An eased draw reads as a line being flicked into place,
            // which is a different gesture and fights the scrub — under
            // `scrub` the user's own scroll speed is already the easing.
            ease: 'none',
          },
          fanAt,
        );

        /* ── 3. The gateway acknowledges the landing ────────────────────── */
        const landed = fanAt + FAN_DURATION + FAN_STAGGER * (fan.length - 1);
        timeline
          .to(gateway, { scale: PULSE_SCALE, duration: PULSE_IN, ease: 'power2.out' }, landed)
          .to(gateway, { scale: 1, duration: PULSE_OUT, ease: 'power2.inOut' }, landed + PULSE_IN);

        if (glow) {
          timeline
            .fromTo(glow, { opacity: 0 }, { opacity: 1, duration: PULSE_IN, ease: 'none' }, landed)
            .to(glow, { opacity: 0, duration: GLOW_OUT, ease: 'none' }, landed + PULSE_IN);
        }

        /* ── 4. The spine, then the line that reaches it ────────────────── */
        const chipsAt = landed + PULSE_IN + PULSE_OUT;
        timeline.fromTo(
          chips,
          { opacity: PENDING_OPACITY, y: RISE },
          {
            opacity: 1,
            y: 0,
            duration: CHIP_DURATION,
            stagger: CHIP_STAGGER,
            ease: 'power2.out',
          },
          chipsAt,
        );

        timeline.fromTo(
          drop,
          { strokeDashoffset: 100 },
          { strokeDashoffset: 0, duration: DROP_DURATION, ease: 'none' },
          chipsAt + CHIP_LEAD,
        );

        /*
          Web fonts land after first paint and change the cards' heights, which
          moves the diagram's top and therefore the pin's start. ScrollTrigger
          refreshes itself on `load` and on resize but not on this, and the
          drift is the pin starting a few dozen pixels early.
        */
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        // Hand the CSS entrance back when this branch stops matching, so the
        // marker cannot outlive the timeline that justified it.
        return () => {
          delete box.dataset.archDraw;
        };
      };

      /* ── 1. lg and up: the four-column fan ──────────────────────────────── */
      mm.add(WIDE_QUERY, build(4));

      /* ── 2. sm to lg: the same sequence, two curves ─────────────────────── */
      mm.add(NARROW_QUERY, build(2));

      /* ── 3. below sm, and 4. reduced motion: nothing added, nothing runs. ─ */

      // useGSAP's context reverts this too; kept explicit because the pin
      // mutates the DOM (it wraps the box in a spacer) and a leaked spacer on
      // route change is a layout bug rather than a stray tween.
      return () => {
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} {...rest}>
      {children}
    </div>
  );
}
