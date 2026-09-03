'use client';

/**
 * §7 Analytics — the utilisation chart's entrance (owner request, 2026-09-03).
 *
 * Moved out of `sections/intelligence.tsx` and made an island. The markup, the
 * data, the classes and the palette are unchanged, byte for byte — the only
 * new things are a GSAP timeline that owns the reveal and a `<span>` around
 * each percentage so a counter has something to write to.
 *
 * ── Why this stopped being CSS ────────────────────────────────────────────
 *
 * The bars already animated. `[data-bar]` in globals.css did `scaleY 0→1` from
 * `transform-origin: bottom`, 320ms, `--ease-out-quint`, 70ms apart — the deck
 * slide 09 redline, implemented correctly. Two things broke it:
 *
 *  1. **It was gated on `.reveal-seen`, and `<Reveal>` has a 2s failsafe that
 *     fires whether or not the block is on screen** (reveal.tsx FAILSAFE_MS,
 *     added for the `/#chain` blank-section bug). This section is ninth on the
 *     homepage, so on any normal read the chart had finished animating,
 *     off-screen, well before it was scrolled to. The bug was never in the
 *     animation; it was that the trigger could not distinguish "in view" from
 *     "two seconds have passed". That failsafe is load-bearing across ~48
 *     routes and is deliberately left alone — this chart opts out of it
 *     instead, which is the narrower fix.
 *
 *  2. **The count-up is not expressible in CSS.** A percentage has to be
 *     interpolated and written to a text node. That alone forces an island,
 *     and once there is a timeline it is worse to have two engines splitting
 *     one gesture — the bar in CSS and its own label in JS — than to give the
 *     whole composition to one.
 *
 * The CSS blocks this replaces (`[data-bar]`, `.reveal-seen [data-kpi-halo]`,
 * `[data-annotation]`) are retired in the same pass. `@keyframes grow-y` stays
 * — `[data-pipe-line]` still uses it — and so does `[data-kpi-halo]`'s
 * radial-gradient, which is the canonical `--color-cyan-500` read (rule 8) and
 * is referenced as such by the comment on the chain-stepper block.
 *
 * ── The rules this inherits ───────────────────────────────────────────────
 *
 *  - **Resting state is the finished state.** The server renders every bar at
 *    its real height and every label at its real number. No-JS, pre-hydration
 *    and reduced-motion all get a complete, correct chart by doing nothing
 *    (rules 5 and 6). Nothing here can leave a bar at zero or a label at "0"
 *    if the timeline never runs.
 *  - **Reduced motion via `gsap.matchMedia`**, exactly as chain-spread.tsx
 *    does it: the query carries `prefers-reduced-motion: no-preference`, so
 *    under reduce not one tween is created.
 *  - **Once, never on scroll-back** (`once: true`) — the site's behaviour for
 *    every one-shot entrance, and re-growing bars on scroll-up is the
 *    cheap-site tell `<Reveal>` was written to avoid.
 *  - **Transforms and text only.** Heights are CSS percentages set at render
 *    time from the data; the timeline scales what is already sized, so the
 *    axis never moves and no layout property is animated.
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  DURATION_CROSS_FADE_S,
  DURATION_LIFT_S,
  DURATION_RISE_S,
  GSAP_EASE_OUT,
  staggerS,
} from '@/components/site/motion';
import { cn } from '@/components/site/primitives';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ──────────────────────────── Redlines ─────────────────────────────────── */

/**
 * Where the reveal fires. Chart top at 80% of the viewport — the section is
 * entering, not centred, so the bars draw as it arrives rather than after it
 * has settled. chain-spread.tsx's one-shot fallback uses 85%; within a hair,
 * and the difference is not worth a third value.
 */
const TRIGGER_START = 'top 80%';

/**
 * The peak bar's emphasis: one out-and-back pulse of its halo, each leg
 * `--duration-lift`.
 *
 * **Deliberately not the overshoot the brief offered as the alternative.** A
 * `back.out` on `scaleY` would carry the tallest bar visibly past its own
 * value — week 34 is 95% of capacity and the bar is 95% of the track, so an
 * ~8% overshoot paints a bar reading over 100% for a few frames. On a chart
 * whose whole claim is "every figure is checkable arithmetic" that is a wrong
 * number on screen, not a flourish. The halo is the deck's own device for this
 * ("HALO 320ms, one KPI only", slide 09) and it can be pushed without
 * misstating the data.
 */
const HALO_PULSE_SCALE = 1.18;

/* ──────────────────────────── Types ────────────────────────────────────── */

/**
 * Spelled out rather than taken as `typeof intelligence.chart`, because
 * importing the content module here would pull the whole homepage copy set
 * into the client bundle. The data still arrives from `content/homepage.ts` via
 * props — this is a shape, not a second copy of the numbers.
 */
export type UtilisationChartData = {
  readonly label: string;
  readonly unit: string;
  readonly peakWeek: number;
  readonly annotation: string;
  readonly weeks: readonly { readonly week: number; readonly logged: number; readonly capacity: number }[];
};

/* ──────────────────────────── The island ───────────────────────────────── */

export function UtilisationChart({ chart }: { chart: UtilisationChartData }) {
  const root = useRef<HTMLDivElement>(null);
  const max = Math.max(...chart.weeks.map((w) => w.capacity));

  useGSAP(
    () => {
      const node = root.current;
      if (!node) return;

      const mm = gsap.matchMedia();

      /* Reduced motion matches nothing below, so no tween is created and the
         chart is simply left as the server rendered it. */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const bars = gsap.utils.toArray<HTMLElement>('[data-bar]', node);
        const labels = gsap.utils.toArray<HTMLElement>('[data-bar-value]', node);
        const halo = node.querySelector<HTMLElement>('[data-kpi-halo]');
        const badge = node.querySelector<HTMLElement>('[data-annotation]');
        if (bars.length === 0) return;

        gsap.set(bars, { transformOrigin: 'bottom' });

        const timeline = gsap.timeline({
          scrollTrigger: { trigger: node, start: TRIGGER_START, once: true },
        });

        /*
          Each bar and its own label are placed at the same position on the
          timeline with the same duration and the same ease, which is what
          "the number finishes counting exactly as its bar finishes growing"
          means in practice — and, because the ease matches too, the digits
          decelerate with the bar rather than drifting ahead of it.
        */
        bars.forEach((bar, i) => {
          const at = staggerS(i);

          timeline.fromTo(
            bar,
            { scaleY: 0 },
            { scaleY: 1, duration: DURATION_RISE_S, ease: GSAP_EASE_OUT },
            at,
          );

          const label = labels[i];
          if (!label) return;

          /*
            The target is read back off the DOM rather than closed over, so the
            number that counts up is provably the number the server rendered —
            there is no second derivation of `pct` that could drift from the
            bar's height. `counter` is a throwaway object; GSAP interpolates
            its one property and we write the rounded value out on each tick.
          */
          const target = Number(label.dataset.value);
          if (!Number.isFinite(target)) return;

          const counter = { value: 0 };
          timeline.fromTo(
            counter,
            { value: 0 },
            {
              value: target,
              duration: DURATION_RISE_S,
              ease: GSAP_EASE_OUT,
              onUpdate: () => {
                label.textContent = String(Math.round(counter.value));
              },
              // The last tick lands on `target` exactly, but say so anyway:
              // a timeline killed mid-flight (revert, route change) must not
              // leave a partial figure on a chart (rule 1).
              onComplete: () => {
                label.textContent = String(target);
              },
            },
            at,
          );

          /*
            `fromTo`'s from-state renders when the tween is built — inside a
            layout effect, so before paint — but `onUpdate` is not guaranteed
            to fire on that pass. Without this the label would show its final
            number until the trigger fired and then snap back to 0, which is
            visible at the bottom of the viewport as the section arrives.
          */
          label.textContent = '0';
        });

        const peakIndex = chart.weeks.findIndex((w) => w.week === chart.peakWeek);
        const peakLands = staggerS(Math.max(peakIndex, 0)) + DURATION_RISE_S;

        if (halo) {
          // Fades with its bar, then pulses once as it lands. `yoyo` + one
          // repeat is out-and-back; scaling about the bottom keeps the glow
          // seated on the axis instead of lifting off it.
          timeline.fromTo(
            halo,
            { opacity: 0 },
            { opacity: 1, duration: DURATION_RISE_S, ease: GSAP_EASE_OUT },
            staggerS(Math.max(peakIndex, 0)),
          );
          timeline.to(
            halo,
            {
              scale: HALO_PULSE_SCALE,
              transformOrigin: 'center bottom',
              duration: DURATION_LIFT_S,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1,
            },
            peakLands,
          );
        }

        if (badge) {
          // After the pulse, not with it: the badge is a callout confirming a
          // result, so it has to arrive once there is a result to confirm.
          // Cross-fade with an 8px slide — the same gesture the retired
          // `annotation-in` keyframe had, so the badge still reads as before.
          timeline.fromTo(
            badge,
            { opacity: 0, x: 8 },
            {
              opacity: 1,
              x: 0,
              duration: DURATION_CROSS_FADE_S,
              ease: GSAP_EASE_OUT,
            },
            peakLands + DURATION_LIFT_S * 2,
          );
        }

        /*
          Restore the finished state if this branch is reverted — the user
          turning on reduced motion mid-session, or a route change. GSAP winds
          its own tweens back; the text nodes are ours, so they are ours to
          put right.
        */
        return () => {
          labels.forEach((label) => {
            label.textContent = label.dataset.value ?? label.textContent;
          });
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="flex flex-col gap-4">
      <p className="text-label text-[var(--color-fg-subtle)]">{chart.label}</p>

      <div className="flex items-end gap-2 sm:gap-3">
        {chart.weeks.map((w) => {
          const pct = Math.round((w.logged / w.capacity) * 100);
          const peak = w.week === chart.peakWeek;

          return (
            <div key={w.week} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              {/* Track: fixed height, so the axis is stable before anything animates. */}
              <div className="relative flex h-40 w-full items-end justify-center">
                {peak ? (
                  <span
                    aria-hidden
                    data-kpi-halo=""
                    className="pointer-events-none absolute inset-x-[-30%] bottom-0 h-[60%]"
                  />
                ) : null}
                <span
                  data-bar=""
                  style={{ height: `${(w.logged / max) * 100}%` }}
                  className={cn(
                    'relative w-full rounded-t-[var(--radius-sm)]',
                    peak ? 'bg-[var(--color-cyan-500)]' : 'bg-[var(--color-link)]/35',
                  )}
                />
              </div>
              <span className="text-xs text-[var(--color-fg-subtle)]">w{w.week}</span>
              <span
                className={cn(
                  'text-xs font-medium',
                  peak ? 'text-[var(--color-accent-text)]' : 'text-[var(--color-fg-muted)]',
                )}
              >
                {/*
                  The number is its own element so the counter can rewrite it
                  without touching the unit, and `data-value` is the figure the
                  count-up is aiming at — same `pct`, so the two cannot drift.
                */}
                <span data-bar-value="" data-value={pct}>
                  {pct}
                </span>
                {chart.unit}
              </span>
            </div>
          );
        })}
      </div>

      <p
        data-annotation=""
        className="w-fit rounded-full border border-[var(--color-tint-border)] bg-[var(--color-tint)] px-3 py-1 text-xs font-medium text-[var(--color-accent-text)]"
      >
        {chart.annotation}
      </p>
    </div>
  );
}
