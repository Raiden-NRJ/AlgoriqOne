'use client';

/**
 * Entrance wrapper — the "Rise" motion pattern (docs/09 §2).
 *
 * Rules encoded here:
 *  - Content is visible by default; the "before" state is only applied once JS
 *    confirms it can run, so a failed observer never leaves a blank section.
 *  - Fires once, then unobserves. Re-animating on scroll-back is the classic
 *    cheap-site tell.
 *  - Elements already in or above the viewport skip straight to the end state,
 *    so fast scrollers never see a late animation.
 *  - Reduced motion: the class does nothing (handled in globals.css).
 *
 * ── The scroll-jump fix, 2026-08-11 ───────────────────────────────────────
 * Three independent paths can reveal a block, and **any one of them is enough**.
 * That redundancy is the point: an entrance animation is decoration, and
 * decoration must never be the thing standing between a visitor and the copy.
 *
 *   1. IntersectionObserver — the normal case, and the only one that usually runs.
 *   2. A passive scroll listener that re-checks geometry — covers the case the
 *      observer misses.
 *   3. A failsafe timer — covers everything else, including bugs not yet found.
 *
 * Why it needed fixing: loading `/#chain` directly left **37 blocks at opacity
 * 0**, and that is a URL the site ships itself — the hero's "See the chain"
 * button and the ChainStrip on every deep page both point at it. Same result
 * after any instant scroll change, which is what browser back/forward scroll
 * restoration and a fast flick both look like. The old code decided once, on
 * mount, whether a block was near the fold; on a hash navigation the mount
 * happens while the page is still at scroll 0, so everything below was armed
 * and then depended entirely on path 1 firing.
 *
 * The arming test also changed. It was `rect.top < innerHeight * 0.6`, which
 * armed anything in the bottom 40% of the viewport — visible content, waiting
 * on an observer. It is now `rect.top < innerHeight`: if any part of the block
 * is on screen, it renders, full stop.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from './primitives';

/** Last-resort reveal, if neither the observer nor the scroll check fires. */
const FAILSAFE_MS = 2000;

export function Reveal({
  children,
  delay = 0,
  className,
  id,
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Anchor target. Pair with a `scroll-mt-*` so the sticky header clears it. */
  id?: string;
  /*
    'ul' is here for grid-level stagger (deck slide 06, "one observer on the
    grid"): the observer has to go on the list itself, because a wrapper <div>
    between <ul> and <li> breaks the list relationship and the items stop being
    announced as a list of N.

    'ol' joined it 2026-09-02 for the same reason and with one addition: an
    ordered list also loses its *numbering* semantics to a wrapper, and the
    sequences that use it here — the ChainStrip's Deal → … → Invoice — are
    ordered precisely because the order is the content.
  */
  as?: 'div' | 'li' | 'ul' | 'ol' | 'section';
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(true);
      return;
    }

    // Any part of it on screen, or scrolled past — no animation, just show it.
    const onScreen = () => node.getBoundingClientRect().top < window.innerHeight;
    if (onScreen()) {
      setShown(true);
      return;
    }

    setArmed(true);

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setShown(true);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      clearTimeout(failsafe);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) reveal();
      },
      // 0.25, not 0.2: P5 is the only slide in the deck that states a
      // threshold and it says "observer @ 25%". The rootMargin stays — it is
      // not in the deck either way, and it is what stops a block arming while
      // it is still only just clipping the fold.
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(node);

    // Backup for scroll changes the observer does not resolve — hash
    // navigation, scroll restoration, a fast flick past the block.
    const onScroll = () => {
      if (onScreen()) reveal();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const failsafe = setTimeout(reveal, FAILSAFE_MS);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <Tag
      ref={ref as never}
      id={id}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      /*
        `reveal-seen` is a stable "this block is in view" marker, and it is set
        whenever `shown` is — including the two cases where `armed` is false and
        no rise ever runs: reduced motion, and a block that was already on
        screen at mount.

        It exists so a nested pattern can key its own animation off being in
        view without needing its own observer. `.reveal-in` cannot be used for
        that: it only appears when the block armed, so a section reached by a
        direct /#chain navigation would never get it. That is the same
        false-negative the three-path resolve above exists to prevent, and it
        would have reintroduced it one level down.
      */
      className={cn(
        armed && 'reveal',
        armed && shown && 'reveal-in',
        shown && 'reveal-seen',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
