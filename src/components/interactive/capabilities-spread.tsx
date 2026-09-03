'use client';

/**
 * §6 Built to fit — the scroll-driven spread (owner instruction, 2026-09-03).
 *
 * The gesture §3 The chain had when this was written, asked for here for
 * consistency: the four capability cards start as an overlapped deck and fan
 * out into their real grid positions as the section is scrolled through, bound
 * to the scrollbar so scrolling back up runs it in reverse.
 *
 * §3 no longer runs it — later the same day its pinned scrub was replaced with
 * an IntersectionObserver and a CSS transition for scroll jank (owner
 * instruction; see `chain-spread.tsx`). So this is now the site's only pinned
 * section, and `useCardSpread`'s only caller.
 *
 * Everything structural — the deck geometry, the pin, the three-way matchMedia
 * split, the teardown — lives in `useCardSpread`. Read that file first; it
 * carries the layout contract and the reasoning for GSAP being here at all.
 * What is left below is the part that is only true of this section: the
 * per-card inner content.
 *
 * ── What this replaced ────────────────────────────────────────────────────
 * The grid used to animate through the CSS `[data-rise-item]` pattern, keyed
 * off the container `<Reveal>`'s `.reveal-seen` marker with an inline
 * `animation-delay` per card. That had to go rather than sit alongside this:
 * both systems write `transform` and `opacity` on the same `<li>`, and a CSS
 * animation wins over an inline style, so the rise would have overridden the
 * scrub for its first 320ms. The `[data-sweep]` rule below the grid still uses
 * the CSS pattern and still has its own `<Reveal>` — it is not a card and
 * nothing here touches it.
 */

import type { ReactNode } from 'react';
import gsap from 'gsap';
import { CARD_DURATION, CARD_STAGGER, useCardSpread } from './use-card-spread';

/**
 * The deck's centre, as a fraction of the row's width.
 *
 * Four equal columns, so card centres sit at 12.5 / 37.5 / 62.5 / 87.5%. At
 * 0.25 the deck lands just under the first card's right shoulder, so card 1
 * barely moves and 2–4 peel off to the right — the same outward opening as §3,
 * measured for four columns instead of five.
 */
const STACK_ANCHOR = 0.25;

/**
 * How far into a card's arrival its own chips and copy firm up. At 0.5 they
 * finish a shade before the card itself settles, so the card arrives
 * *carrying* its content rather than arriving empty and then filling in.
 */
const INNER_CUE = 0.5;

/**
 * Deliberately short — a third of a card tween. This is punctuation on the
 * main gesture, and anything longer competes with the card it belongs to.
 */
const INNER_DURATION = 0.2;

/** Gap between a card's chip row and its heading/description, in timeline units. */
const INNER_STAGGER = 0.06;

/** Rise distance for the inner content, in px. Half the card-level rise. */
const INNER_RISE = 8;

/**
 * The floor this content fades *from* — not 0, and that is the whole point.
 *
 * A `fromTo` holds its from-state for the whole timeline before its start, so
 * a 0→1 fade leaves every card blank for the entire stacked phase. The cards
 * behind are at 0.4 and get away with it, but the front card sits at full
 * opacity and rendered as an empty white rectangle — the deck stopped reading
 * as a stack of cards and started reading as a stack of placeholders.
 *
 * At 0.5 the content is legible in the deck and resolves as the card lands,
 * which is the effect that was actually wanted. Measured, not guessed: the
 * first pass shipped 0 and the browser check caught it.
 */
const INNER_FLOOR = 0.5;

export function CapabilitiesSpread({ children }: { children: ReactNode }) {
  const root = useCardSpread({
    cardSelector: '[data-cap-card]',
    stackAnchor: STACK_ANCHOR,
    decorate: ({ timeline, cards }) => {
      cards.forEach((card, i) => {
        // Chip row first, then heading + description. Queried per card rather
        // than across the row so each group stays tied to the card it rides.
        const parts = gsap.utils.toArray<HTMLElement>(
          '[data-cap-chips], [data-cap-copy]',
          card,
        );
        if (parts.length === 0) return;

        const landed = i * CARD_STAGGER + CARD_DURATION * INNER_CUE;

        parts.forEach((part, index) => {
          timeline.fromTo(
            part,
            { opacity: INNER_FLOOR, y: INNER_RISE },
            {
              opacity: 1,
              y: 0,
              duration: INNER_DURATION,
              // power2.out, not back.out: the cards already overshoot, and a
              // second overshoot inside one that is still settling reads as
              // wobble rather than polish.
              ease: 'power2.out',
            },
            landed + index * INNER_STAGGER,
          );
        });
      });
    },
  });

  // A plain block wrapper, in the position the removed <Reveal> div held — the
  // <ul> keeps the same box and the same flex parent.
  return <div ref={root}>{children}</div>;
}
