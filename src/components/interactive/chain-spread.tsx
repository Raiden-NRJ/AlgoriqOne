'use client';

/**
 * §3 the chain — the card slide-in (owner instruction, 2026-09-03).
 *
 * The five cards slide in from the left and the connector arrows pop in behind
 * them, staggered so the row assembles left to right. One IntersectionObserver
 * for the whole row; every pixel of motion is a CSS transition on `transform`
 * and `opacity`. The rules live in globals.css under "§3 The chain — the card
 * slide-in", and that block carries the styling reasoning.
 *
 * ── What this replaced, and why ───────────────────────────────────────────
 * Earlier the same day this was a GSAP ScrollTrigger spread: the cards started
 * as an overlapped deck, the section **pinned** for 1.2 viewport heights, and
 * the fan-out was `scrub`bed against scroll position. It was janky under
 * scroll, and structurally so rather than by tuning:
 *
 *  - A scrubbed timeline does work on every scroll event, and a pin rewrites
 *    the document's layout around a spacer element while that is happening.
 *  - The deck positions were function-based tween values with
 *    `invalidateOnRefresh`, so a refresh re-read `offsetLeft` / `offsetWidth`
 *    on all five cards — forced layout, on the scroll path.
 *  - `anticipatePin` exists precisely because pinning has a visible hitch at
 *    the handover. It reduces it; it cannot remove it.
 *
 * None of that survives here. Scroll position is sampled by the observer, off
 * the main thread, exactly once per card; after that the compositor owns the
 * animation and this island does nothing at all. The pin is gone, so the
 * section scrolls at the same rate as the rest of the page.
 *
 * §6 Built to fit still runs the GSAP spread through `use-card-spread.ts` —
 * this instruction named §3's cards. That hook no longer has a second caller.
 *
 * ── The three-path resolve, kept ──────────────────────────────────────────
 * Deliberately the same shape as `site/reveal.tsx`, for the reason recorded
 * there: loading `/#chain` directly once left 37 blocks at `opacity: 0`, and
 * **this is the section that URL points at** — the hero's "See the chain"
 * button and the ChainStrip on every deep page both target it. An entrance
 * animation must never be the thing standing between a visitor and the copy,
 * so three independent paths can reveal a card and any one is enough:
 *
 *   1. The IntersectionObserver — the normal case, and the only one that
 *      usually runs.
 *   2. One passive scroll listener that re-checks geometry. This is the single
 *      exception to "no scroll listeners in this section": it is one listener
 *      for the whole row rather than one per element, it only measures cards
 *      that are still pending, and it removes itself the moment the last one
 *      lands — which in practice is the first time the row is anywhere near
 *      the viewport.
 *   3. A failsafe timer, for everything else — narrowed to cards that are on
 *      screen when it fires, for the reason recorded at its call site.
 *
 * Cards already on screen at mount are never armed at all, so a fast scroller
 * or a hash navigation sees them finished rather than animating late — and it
 * is also what keeps arming invisible: `useEffect` runs after paint, so arming
 * an *on-screen* card would flash it out and back.
 */

import { useEffect, useRef, type ReactNode } from 'react';

/** Wound-back state. Added by this island only; see globals.css. */
const ARMED = 'chain-slide';
/** Resting state. What the transition runs towards. */
const VISIBLE = 'is-visible';
/** Post-transition marker; its only job is to drop `will-change`. */
const SETTLED = 'is-settled';

/** Last-resort reveal for an on-screen card, if neither the observer nor the
 *  scroll check fires. Same 2000ms as <Reveal>'s — one failsafe budget across
 *  the site, even though the condition differs (see the call site). */
const FAILSAFE_MS = 2000;

export function ChainSpread({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = root.current;
    if (!row) return;

    // Reduced motion: nothing is armed, so the cards are simply left in the
    // layout position CSS already put them in. No observer is created either.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(row.querySelectorAll<HTMLElement>('[data-chain-card]'));
    if (cards.length === 0) return;

    // Any part of it on screen, or scrolled past — show it, don't animate it.
    const onScreen = (card: HTMLElement) => card.getBoundingClientRect().top < window.innerHeight;

    const pending = new Set(cards.filter((card) => !onScreen(card)));
    if (pending.size === 0) return;

    for (const card of pending) card.classList.add(ARMED);

    let stopped = false;

    const stop = () => {
      if (stopped) return;
      stopped = true;
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      clearTimeout(failsafe);
    };

    const reveal = (card: HTMLElement) => {
      if (!pending.delete(card)) return;
      card.classList.add(VISIBLE);
      // Requirement, not tidiness: an element left under observation keeps
      // costing the browser an intersection check on every scroll frame, which
      // is the class of overhead this rewrite exists to remove.
      observer.unobserve(card);
      if (pending.size === 0) stop();
    };

    /*
      One observer for all five cards, not one per card — the same "OBSERVER:
      one, on the grid" rule the CSS stagger patterns follow (deck slide 06).
      rootMargin pulls the trigger line 10% up from the bottom edge so a card
      is properly in the frame before it moves rather than animating while it
      is still clipping the fold; threshold 0.15 is low enough that a card
      taller than the viewport still fires.
    */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
    for (const card of pending) observer.observe(card);

    // Path 2. Passive, so it can never block scrolling, and removed by stop().
    const onScroll = () => {
      for (const card of [...pending]) if (onScreen(card)) reveal(card);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /*
      Path 3, and the one place this deliberately differs from <Reveal>.

      <Reveal>'s failsafe is unconditional — at 2000ms it reveals, wherever the
      block is. That is right for a wrapper used ~48 routes deep where the cost
      of being wrong is a blank section, but applied here it would mean the
      slide never runs at all in the common case: the row sits well below the
      fold, so a visitor who takes more than two seconds to reach it would find
      the cards already placed. The animation would be dead code on most visits.

      So the timer only resolves cards that are *actually on screen* — which is
      the case it exists for (scroll restoration or a hash navigation that
      completes after mount, with no scroll event to follow it). Anything still
      genuinely below the fold stays armed, and the observer and the scroll
      listener stay live for it. The safety property is unchanged: no card that
      a visitor can see is ever left invisible.
    */
    const failsafe = setTimeout(() => {
      for (const card of [...pending]) if (onScreen(card)) reveal(card);
    }, FAILSAFE_MS);

    return stop;
  }, []);

  /*
    `will-change` is a promise to the compositor that costs a layer for as long
    as it stands, so it is dropped as soon as each element has actually landed.

    One delegated listener rather than a per-element one: transitionend bubbles,
    and both the cards and their arrows are inside this wrapper. Arrows are
    covered here for the same reason they have no observer of their own —
    everything in this section rides one mechanism.

    Cheap by construction: it fires twice per element (opacity and transform)
    and then never again, since nothing else in the row transitions.
  */
  const settle = (event: React.TransitionEvent) => {
    const target = event.target as HTMLElement;
    if (target.matches?.('[data-chain-card], [data-chain-arrow]')) {
      target.classList.add(SETTLED);
    }
  };

  // A plain block wrapper, in the position the removed <Reveal> div held — the
  // <ol> keeps the same box and the same flex parent.
  return (
    <div ref={root} onTransitionEnd={settle}>
      {children}
    </div>
  );
}
