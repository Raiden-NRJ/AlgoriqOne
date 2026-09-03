'use client';

/**
 * §7 module clusters — the "End to end" stepper, with a token that travels it.
 *
 * Extracted from cluster-switcher.tsx on 2026-09-03 (owner request). The list,
 * the step data and the permission chips below it are unchanged; the only new
 * thing is the entrance: a cyan token rides the connector from the first stage
 * to the last, and each stage's dot lands as the token passes its y-position.
 *
 * ── Why GSAP here, when docs/11 §1 rejects it ─────────────────────────────
 *
 * That rejection reads "GSAP/ScrollTrigger (scrolljacking is banned anyway)",
 * and the objection is to ScrollTrigger, not to the tween engine. This is the
 * opposite kind of animation: a fixed-length sequence fired imperatively on a
 * tab change, with no scroll coupling at all. Owner instruction 2026-09-03,
 * with the plugin explicitly excluded. What survives of the rejection is the
 * bundle rule — GSAP core only, no plugins, imported inside this island and
 * nowhere else, so it lands in the one chunk that is already client-side.
 *
 * ── Why not the CSS pipeline it replaces ──────────────────────────────────
 *
 * The `[data-pipe-dot]` / `[data-pipe-line]` block in globals.css still drives
 * the server-rendered `Chain` in page-template.tsx and is untouched. It cannot
 * do *this*, though, and the reason is worth keeping: the per-stage landing
 * moments have to be derived from **measured** dot positions, because the
 * stagger that syncs a 5-stage tab is wrong for a 7-stage one, and the stage
 * spacing is set by wrapped label text rather than by a constant. A CSS
 * `animation-delay` is a number written at render time; it cannot read a
 * `getBoundingClientRect()`.
 *
 * ── The three things that are easy to get wrong ───────────────────────────
 *
 * 1. **The travel is linear (`ease: 'none'`) on purpose.** Every landing is
 *    placed on the timeline at `TRANSIT × (yᵢ − y₀) / (yₗₐₛₜ − y₀)`, which is
 *    only the moment the token is visually over stage *i* while position is
 *    linear in time. Easing the travel would slide every landing out of sync
 *    with the thing it is supposed to be landing on, worst at the ends.
 *
 * 2. **The resting state is the finished state, as everywhere on this site.**
 *    The markup renders every stage filled and every label at full strength;
 *    the dim start is applied by `gsap.set` in a *layout* effect, before paint.
 *    That is why GSAP is imported statically rather than lazily — a dynamic
 *    import resolves after the first paint, which would flash the finished
 *    list and then dim it. It also means no-JS and reduced-motion both get a
 *    complete stepper by doing nothing (rules 5 and 6).
 *
 * 3. **Total duration is fixed, not per-stage.** A 5-stage tab and a 7-stage
 *    tab both traverse in `--duration-transit`; only the gaps between landings
 *    change. Multiplying a per-stage delay by the count would make Delivery
 *    visibly slower than Service for no reason the reader can see.
 */

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  DURATION_LIFT_S,
  DURATION_RISE_S,
  DURATION_TRANSIT_S,
  GSAP_EASE_OUT,
} from '@/components/site/motion';
import { cn } from '@/components/site/primitives';

/** The state a stage waits in before the token reaches it. */
const DIM_CORE = { opacity: 0, scale: 0.4 } as const;
/** Muted, not invisible: the stage names are content and must stay legible
 *  the whole way through — this is a brightening, not a reveal. */
const DIM_LABEL_OPACITY = 0.45;
/** Last-resort play, mirroring Reveal's failsafe for the same reason. */
const FAILSAFE_MS = 2000;

export function ChainStepper({ steps }: { steps: string[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const tokenRef = useRef<HTMLSpanElement>(null);

  /*
    Layout effect, and `steps` in the deps for belt and braces.

    The trigger this hooks into is the remount: the panel in
    cluster-switcher.tsx carries `key={cluster.id}`, so a tab change tears this
    subtree down and builds a new one, and the effect below is a *mount* effect
    from its point of view. That is also most of the cleanup story — there is
    no stale timeline to reconcile against a new one, because the elements the
    old timeline held are gone with it. The teardown below still kills the
    timeline and drops the three triggers, which is what keeps fast tab
    clicking from leaving GSAP's ticker writing to a detached node, or an
    observer alive on a list that no longer exists.
  */
  useLayoutEffect(() => {
    const list = listRef.current;
    const token = tokenRef.current;
    if (!list || !token) return;

    /*
      Reduced motion: return before the `gsap.set` that dims anything. The
      markup is already in its final state, so "skip the animation" is
      literally "do nothing" — there is no separate final-state pass to write
      and keep in sync with the classes. Read from matchMedia rather than
      framer's useReducedMotion() because this has to be correct during
      layout, not after a subscription settles.
    */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dots = Array.from(list.querySelectorAll<HTMLElement>('[data-step-dot]'));
    const cores = dots
      .map((dot) => dot.querySelector<HTMLElement>('[data-step-core]'))
      .filter((el): el is HTMLElement => el !== null);
    const halos = dots
      .map((dot) => dot.querySelector<HTMLElement>('[data-step-halo]'))
      .filter((el): el is HTMLElement => el !== null);
    const labels = Array.from(list.querySelectorAll<HTMLElement>('[data-step-label]'));
    if (dots.length === 0) return;

    /** The finished stepper, which is also what the markup renders unaided. */
    const settle = () => {
      gsap.set(cores, { opacity: 1, scale: 1 });
      gsap.set(labels, { opacity: 1 });
      gsap.set(halos, { opacity: 0 });
      gsap.set(token, { opacity: 0 });
    };

    // The dim start, in the same tick as the mount and therefore before
    // paint — no frame of the finished list before it dims.
    gsap.set(cores, DIM_CORE);
    gsap.set(labels, { opacity: DIM_LABEL_OPACITY });
    gsap.set(halos, { opacity: 0, scale: 0.5 });
    gsap.set(token, { opacity: 0, scale: 0.5, y: 0 });

    let tl: gsap.core.Timeline | null = null;

    const play = () => {
      /*
        Measured at play time, not at mount. For the off-screen case those are
        different moments, and anything above this card — a font swap, an
        image landing, a label rewrapping — moves the stages in between.
      */
      const listRect = list.getBoundingClientRect();
      const centreOf = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return {
          y: rect.top - listRect.top + rect.height / 2,
          x: rect.left - listRect.left + rect.width / 2,
        };
      };
      const centres = dots.map(centreOf);
      const start = centres[0]!;
      const travel = centres[centres.length - 1]!.y - start.y;

      /*
        A single stage, or a list measured while collapsed: there is no line to
        travel, so resolve to the finished state instead of animating. This is
        the branch that must never be a bare `return` — the stages are already
        dimmed by the time we get here, and a stuck dim stepper is a worse
        failure than a missing animation (Reveal's `/#chain` lesson, one level
        down).
      */
      if (travel <= 0) {
        settle();
        return;
      }

      /*
        A local binding, assigned out to `tl` for the teardown. The forEach
        below closes over it, and TypeScript cannot prove a `let tl: … | null`
        is still non-null inside a callback — the alias is the fix, not a
        non-null assertion on every line.
      */
      const timeline = gsap.timeline();
      tl = timeline;

      // The token is 10px like the dots, so the halves cancel; measuring both
      // anyway keeps this correct if either size changes. Positioned rather
      // than translated, so `y` stays a pure "distance travelled" and the
      // landing arithmetic below reads as geometry.
      gsap.set(token, {
        top: start.y - token.offsetHeight / 2,
        left: start.x - token.offsetWidth / 2,
        y: 0,
      });

      // Arrive and travel both start at 0 — the token is already moving as it
      // appears, so it never reads as sitting on stage one waiting for a cue.
      timeline.to(token, { opacity: 1, scale: 1, duration: DURATION_LIFT_S, ease: GSAP_EASE_OUT }, 0);
      timeline.to(token, { y: travel, duration: DURATION_TRANSIT_S, ease: 'none' }, 0);

      dots.forEach((_, i) => {
        // The landing moment: see note 1 in the header for why this is only
        // valid against a linear travel.
        const at = (DURATION_TRANSIT_S * (centres[i]!.y - start.y)) / travel;
        const core = cores[i];
        const halo = halos[i];
        const label = labels[i];

        if (core) {
          timeline.to(
            core,
            { opacity: 1, scale: 1, duration: DURATION_RISE_S, ease: GSAP_EASE_OUT },
            at,
          );
        }
        if (label) {
          timeline.to(label, { opacity: 1, duration: DURATION_RISE_S, ease: GSAP_EASE_OUT }, at);
        }
        if (halo) {
          // The pulse. Scales past the dot and fades out, so the glow reads as
          // a consequence of the token passing rather than a state the dot
          // holds afterwards.
          timeline.fromTo(
            halo,
            { opacity: 0.55, scale: 0.5 },
            { opacity: 0, scale: 2.4, duration: DURATION_RISE_S, ease: GSAP_EASE_OUT },
            at,
          );
        }
      });

      /*
        Hand-off. The fade starts slightly *before* the token reaches the last
        stage and finishes just after it, so the token dissolves into the dot
        it is landing on rather than parking on top of it and then blinking
        out. It also keeps the whole sequence inside ~1.5s.
      */
      timeline.to(
        token,
        { opacity: 0, scale: 0.6, duration: DURATION_RISE_S, ease: 'power2.in' },
        DURATION_TRANSIT_S - DURATION_LIFT_S,
      );
    };

    /*
      ── When to play ────────────────────────────────────────────────────────
      On a tab click the card is on screen and the answer is "now", measured
      synchronously so the dim state is never painted. On first load this
      section is below the fold, so playing on mount would spend the animation
      off screen and the visitor would scroll down to an already-finished
      stepper.

      The three paths are Reveal's, deliberately, and for the reason its header
      records: an entrance is decoration, and any one path resolving is enough.
      The failsafe matters more here than it does there — this island dims real
      content, so a trigger that never fires is a stepper stuck at 45% forever.
      Firing it while still off screen costs nothing: the timeline ends in the
      finished state either way.
    */
    const onScreen = () => list.getBoundingClientRect().top < window.innerHeight;

    if (onScreen()) {
      play();
      return () => {
        tl?.kill();
      };
    }

    let done = false;
    const start = () => {
      if (done) return;
      done = true;
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      clearTimeout(failsafe);
      play();
    };

    // Same threshold and rootMargin as Reveal, so the stepper and the block it
    // sits in resolve on the same geometry rather than a few pixels apart.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) start();
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(list);

    const onScroll = () => {
      if (onScreen()) start();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const failsafe = setTimeout(start, FAILSAFE_MS);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      clearTimeout(failsafe);
      tl?.kill();
    };
  }, [steps]);

  return (
    <ol ref={listRef} className="relative flex flex-col gap-0">
      {/*
        The travelling token. Absolutely positioned against the <ol> and placed
        from the measurement above, so it needs no knowledge of the dot
        column's width or of the label wrapping that sets the row heights.

        Its glow, and the halo's fill, are the `[data-step-token]` /
        `[data-step-halo]` rules in globals.css rather than arbitrary Tailwind
        values: both are a `color-mix` of --color-cyan-500, matching
        [data-kpi-halo], and the stylesheet is where a palette read belongs
        (rule 8).
      */}
      <span
        ref={tokenRef}
        aria-hidden
        data-step-token=""
        className="pointer-events-none absolute z-10 size-2.5 rounded-full bg-[var(--color-cyan-500)] opacity-0"
      />

      {steps.map((step, i) => (
        <li key={step} className="flex items-start gap-3">
          <span className="flex flex-col items-center self-stretch">
            {/*
              Three layers, so the landing is opacity and transform only — no
              colour interpolation. GSAP would have to parse `var(--color-…)`
              to tween a background-color, which is both slower and a second
              place the palette could drift to.

              Bottom: the unlit ring, always painted, so a stage that has not
              landed yet still has a shape. Middle: the halo. Top: the filled
              core, which is the dot the design already had.
            */}
            <span aria-hidden data-step-dot="" className="relative mt-1.5 size-2.5 shrink-0">
              <span className="absolute inset-0 rounded-full border border-[var(--color-border-strong)]" />
              <span data-step-halo="" className="absolute inset-0 rounded-full opacity-0" />
              <span
                data-step-core=""
                className={cn(
                  'absolute inset-0 rounded-full',
                  i === steps.length - 1
                    ? 'bg-[var(--color-action)]'
                    : 'bg-[var(--color-brand-300)]',
                )}
              />
            </span>
            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className="w-px flex-1 bg-[var(--color-border-strong)]"
              />
            ) : null}
          </span>
          <span data-step-label="" className="pb-4 text-sm font-medium">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
