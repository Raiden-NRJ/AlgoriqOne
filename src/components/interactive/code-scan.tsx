'use client';

/**
 * §12 code sample — the "Scan" entrance (docs/09 §2).
 *
 * This is components/site/reveal.tsx's contract, applied to a different motion.
 * The rules it encodes are deliberately identical, because they are the house
 * rules rather than this component's preferences:
 *
 *  - Content is visible by default. The clipping class is only applied once JS
 *    has confirmed it can run, so a failed observer — or no JS at all — leaves
 *    the full sample on screen (rule 6).
 *  - Fires once, then unobserves. Re-animating on scroll-back is the classic
 *    cheap-site tell.
 *  - Anything already at or past the fold on first observation skips straight
 *    to the end state and is never armed, so a fast scroller never sees a late
 *    animation and an above-fold block never flashes.
 *  - Reduced motion: the class does nothing (handled in globals.css).
 *
 * Why the code lives here as a string rather than as children: the sample must
 * be one unbroken text node. Splitting it into per-line elements to animate
 * them individually would put block boxes between the lines, which changes what
 * a user actually copies out of the block. The animation therefore clips the
 * painted result and never touches the text.
 */

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/components/site/primitives';

export function CodeScan({ code }: { code: string }) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /*
      Observe the <pre>, not the <code>.

      This is the one place this component cannot copy Reveal verbatim. Reveal
      hides with opacity, which has no effect on intersection geometry. We hide
      with clip-path, which does: a fully clipped element reports an
      intersection area of 0, so its ratio never reaches the 0.2 threshold and
      the observer that is supposed to un-clip it can never fire. The block
      stays invisible forever, with the text present in the DOM the whole time —
      green in every automated check, blank on screen.

      The parent <pre> is never clipped, so it is the honest thing to watch.
    */
    const target = node.parentElement ?? node;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(true);
      return;
    }

    /*
      Any part of it on screen, or scrolled past — never arm, so it cannot
      flash. Was `innerHeight * 0.6`, which armed blocks that were already
      visible in the bottom 40% of the viewport and left them clipped until an
      observer fired. Same fix, and same reasoning, as components/site/reveal.tsx.
    */
    const onScreen = () => target.getBoundingClientRect().top < window.innerHeight;
    if (onScreen()) {
      setShown(true);
      return;
    }

    setArmed(true);

    /*
      Three independent paths, any one of which is enough. A clipped block is
      invisible copy, so revealing it must not depend on one mechanism firing —
      see the note in reveal.tsx for what that cost on `/#chain`.
    */
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
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(target);

    const onScroll = () => {
      if (onScreen()) reveal();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const failsafe = setTimeout(reveal, 2000);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <code
      ref={ref}
      // block: clip-path needs a block box to resolve against. Inside <pre> it
      // is visually inert — the pre already governs whitespace and wrapping.
      className={cn('block', armed && 'code-scan', armed && shown && 'code-scan-in')}
    >
      {code}
    </code>
  );
}
