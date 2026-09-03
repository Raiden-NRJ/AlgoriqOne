'use client';

/**
 * The scroll-driven card spread — §6 Built to fit.
 *
 * A row of cards starts as an overlapped deck and fans out into its real
 * layout positions as the section is scrolled through. Progress is bound to
 * the scrollbar (`scrub`), so scrolling back up runs the whole thing in
 * reverse.
 *
 * Extracted from `chain-spread.tsx` on 2026-09-03, when §6 was asked for the
 * same gesture (owner instruction). It is a hook rather than a second island
 * with the same body because everything below — the deck geometry, the
 * measurement rule, the three-way `matchMedia` split, the pin, the font-load
 * refresh, the teardown — is section-independent, and a caller differs only in
 * *which extra things ride the timeline*: the `decorate` callback.
 *
 * ── One caller, as of later the same day ──────────────────────────────────
 * §3 The chain was the other one and no longer is: owner instruction replaced
 * its spread with an IntersectionObserver and a CSS transition because the
 * pinned scrub was janky under scroll (see `chain-spread.tsx`). The hook is
 * kept generic rather than folded back into `capabilities-spread.tsx` — the
 * split is a day old and the `decorate` seam is what makes the file readable —
 * but a reader should know it is currently a one-caller abstraction.
 *
 * ── Why this is the one place the site uses GSAP ──────────────────────────
 * The rest of the site animates with CSS keyframes gated on `.reveal-seen`, and
 * two islands use framer-motion. Neither can do this: a CSS animation cannot be
 * driven by scroll position on the browsers we support, and framer's
 * `useScroll` has no pinning — pinning the section for the duration is the
 * requirement that pulled ScrollTrigger in. GSAP is scoped to this module and
 * its caller; do not reach for it elsewhere without a reason this specific.
 *
 * This is a documented exception to docs/11 §1, which rejects GSAP outright
 * ("scrolljacking is banned anyway"). The ban stands for the rest of the site.
 *
 * ── The layout contract (the important part) ──────────────────────────────
 * **The animation only ever writes transforms and opacity.** The cards' resting
 * state is their ordinary flex/grid layout, and every tween ends at
 * `x:0 y:0 scale:1 opacity:1` — i.e. at exactly the position CSS already puts
 * them in. Consequences worth keeping:
 *
 *  - With JavaScript off, or before hydration, the row renders finished and
 *    correct. This replaced a `<Reveal>` wrapper (which hid the row until an
 *    observer fired), so the no-JS path is strictly better than it was.
 *  - Nothing in the section's height depends on the animation, so the unpin is
 *    invisible: the pin-spacer hands back exactly the space the section
 *    occupied going in.
 *  - `offsetLeft` / `offsetWidth` are read to place the deck, never
 *    `getBoundingClientRect`. Offsets are layout values and ignore transforms,
 *    so a refresh mid-animation measures the same numbers as a refresh at rest.
 *    A rect would measure the *transformed* card and the deck would walk left a
 *    little on every resize.
 *
 * ── Where it runs ─────────────────────────────────────────────────────────
 * `gsap.matchMedia` splits three ways, and each branch is reverted for us when
 * its query stops matching:
 *
 *  1. `xl` and up + motion allowed → the pinned spread. xl is the breakpoint at
 *     which the section turns its column into a horizontal row (§6's
 *     `xl:grid-cols-4`); a horizontal spread of a vertical stack is nonsense,
 *     so the query is tied to that same 1280px.
 *  2. below xl + motion allowed → a plain per-card fade/rise, fired once. This
 *     is the fallback for the layout the spread cannot describe, and it is also
 *     what the removed `<Reveal>` used to do for the row as a whole — now per
 *     card, which is what the column shape wants anyway.
 *  3. reduced motion → neither branch matches, so not a single tween is
 *     created and the cards are simply left in their final layout.
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ──────────────────────────── Redlines ─────────────────────────────────── */

/**
 * Timeline units, not seconds. Under `scrub` the timeline is normalised across
 * the scroll distance, so only the *ratios* between these matter — a card takes
 * about a fifth of the spread, and the next one starts when the previous is a
 * fifth of the way through.
 *
 * Exported because `decorate` callbacks cue their own tweens against them; a
 * caller that hardcoded 0.13 would drift the moment this changed.
 */
export const CARD_DURATION = 0.6;
export const CARD_STAGGER = 0.13;

/**
 * Pinned scroll distance, as a fraction of the viewport height. 1.2 is a little
 * over one flick of a trackpad: long enough that the spread is legible at
 * scrolling speed, short enough that nobody feels held. Above ~1.5 it starts to
 * read as scroll-jacking.
 */
const PIN_VH = 1.2;

/** Per-card offset within the deck, in px — enough to read as a stack. */
const STACK_STEP_X = 16;
const STACK_STEP_Y = 10;

const STACK_SCALE = 0.85;
/** Cards *behind* the front one. The front card stays fully opaque throughout. */
const STACK_OPACITY = 0.4;

/** Rise distance for the below-xl fallback, in px. */
const FALLBACK_RISE = 24;

/** The breakpoint the section becomes a horizontal row at (Tailwind `xl`). */
const SPREAD_QUERY = '(min-width: 80rem) and (prefers-reduced-motion: no-preference)';
const FALLBACK_QUERY = '(max-width: 79.999rem) and (prefers-reduced-motion: no-preference)';

/* ──────────────────────────── The hook ─────────────────────────────────── */

/** Handed to `decorate` so a caller can layer its own tweens onto the spread. */
export type SpreadContext = {
  /** The pinned, scrubbed timeline. Add to it with an absolute position. */
  timeline: gsap.core.Timeline;
  /** The cards, in document order. */
  cards: HTMLElement[];
  /** The row element — the hook's own root, and `gsap.utils.toArray` scope. */
  row: HTMLElement;
};

export type CardSpreadOptions = {
  /** Attribute selector for the cards, resolved within the row. */
  cardSelector: string;
  /**
   * The deck's centre, as a fraction of the row's width.
   *
   * Tuned per section because it depends on how many cards there are and where
   * their centres fall. The row should open *outward* from a point rather than
   * unspooling from its left edge — that is the difference between a deck
   * being dealt and a train leaving a station.
   */
  stackAnchor: number;
  /**
   * Extra tweens for the pinned branch — connector arrows, inner content.
   * Runs inside the `matchMedia` scope, so anything it creates is reverted
   * with the rest of the branch.
   */
  decorate?: (context: SpreadContext) => void;
};

export function useCardSpread({ cardSelector, stackAnchor, decorate }: CardSpreadOptions) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const row = root.current;
      if (!row) return;

      /*
        The pin has to be the whole section — pinning the row alone would leave
        the heading scrolling away above a stationary deck. Reached by `closest`
        rather than by prop so the calling section keeps its server-rendered
        <Section> and the island stays a leaf.
      */
      const section = row.closest('section');
      if (!section) return;

      const cards = gsap.utils.toArray<HTMLElement>(cardSelector, row);
      if (cards.length === 0) return;

      const mm = gsap.matchMedia();

      /* ── 1. xl and up: the pinned, scrubbed spread ────────────────────── */
      mm.add(SPREAD_QUERY, () => {
        /*
          Paint order for the deck: card 1 on top, the last card at the back.
          z-index works here without `position` because each card is a flex or
          grid item, and both honour z-index. Harmless once spread — the cards
          no longer overlap.
        */
        cards.forEach((card, i) => {
          gsap.set(card, { zIndex: cards.length - i, transformOrigin: 'center center' });
        });

        /**
         * Where card `i` sits in the deck, in px relative to its own resting
         * position. Read live (function-based tween values) so a resize between
         * refreshes measures the new column widths.
         */
        const deckX = (card: HTMLElement, i: number) => {
          // Both offsets resolve against the same offsetParent, so the
          // subtraction is the card's centre within the row regardless of how
          // deeply it is nested.
          const centre = card.offsetLeft + card.offsetWidth / 2 - row.offsetLeft;
          return row.offsetWidth * stackAnchor - centre + i * STACK_STEP_X;
        };

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            /*
              Sits the section under the sticky header rather than behind it, so
              the eyebrow and headline are readable for the whole pin. Measured
              rather than hardcoded — the header is one element and it knows its
              own height.
            */
            start: () => `top ${document.querySelector('header')?.offsetHeight ?? 0}px`,
            end: () => `+=${window.innerHeight * PIN_VH}`,
            scrub: true,
            pin: section,
            pinSpacing: true,
            anticipatePin: 1,
            // Re-evaluates every function-based value above on resize. Safe
            // here precisely because the tweens are fromTo, not from: both ends
            // are stated outright, so an invalidate cannot capture a
            // mid-animation transform as the resting state.
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, i) => {
          timeline.fromTo(
            card,
            {
              x: () => deckX(card, i),
              y: i * STACK_STEP_Y,
              scale: STACK_SCALE,
              opacity: i === 0 ? 1 : STACK_OPACITY,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              duration: CARD_DURATION,
              // Slight overshoot as the card settles. The scale overshoots to
              // ~1.02 and opacity past 1, which the browser clamps.
              ease: 'back.out(1.2)',
            },
            i * CARD_STAGGER,
          );
        });

        decorate?.({ timeline, cards, row });

        /*
          Web fonts land after first paint and change the cards' heights, which
          moves the section's top and therefore the pin's start. ScrollTrigger
          refreshes itself on `load` and on resize but not on this, and the
          drift is a few dozen pixels of the pin starting early.
        */
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      });

      /* ── 2. below xl: the cards are a column, so just rise them ───────── */
      mm.add(FALLBACK_QUERY, () => {
        // No pin and no scrub: a one-shot entrance, matching every other
        // section on the site at these widths.
        gsap.from(cards, {
          opacity: 0,
          y: FALLBACK_RISE,
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.07,
          scrollTrigger: { trigger: row, start: 'top 85%', once: true },
        });
      });

      /* ── 3. reduced motion: nothing was added, nothing runs. ──────────── */

      // useGSAP's context reverts this too; kept explicit because the pin
      // mutates the DOM (it wraps the section in a spacer) and a leaked spacer
      // on route change is a layout bug rather than a stray tween.
      return () => {
        mm.revert();
      };
    },
    { scope: root },
  );

  return root;
}
