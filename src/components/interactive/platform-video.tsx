'use client';

/**
 * §4 The platform — the integration web, relocated from the hero on 2026-08-31.
 *
 * This is the old hero visual: the portal wired to CRM, HRMS, Payroll, Sales
 * and Timesheet, with a "My actions" feed carrying events from all of them.
 *
 * It spent one day in §2 (the chain) before landing here, and that detour is
 * worth recording: §2 is about a *sequence*, and this draws a *hub*. §4's
 * thesis — one gateway, one shared spine, every module on it — is the idea the
 * picture actually contains, so it opens that section at full container width.
 *
 * Playback rules, all three of which exist to stop it looking choppy:
 *
 *  1. `preload="metadata"` — the dimensions arrive early so the box is right,
 *     but the 270KB body is not on the critical path behind the hero video.
 *  2. Playback starts on *view*, not on load. An autoplaying loop that has been
 *     running since page load is mid-cycle and mid-buffer by the time it is
 *     scrolled to, which is exactly what reads as choppy. IntersectionObserver
 *     plays on enter and pauses on leave, so it is always seen from a settled
 *     state and costs nothing while off-screen.
 *  3. The aspect box is reserved from the intrinsic ratio, so first paint,
 *     poster and first frame all occupy the same rectangle — starting playback
 *     cannot move the layout.
 *
 * Reduced motion (rule 5): no observer is attached and the poster is shown.
 * With JavaScript off the poster shows and nothing plays, which is correct for
 * a decorative loop — the section is complete without it (rule 6), and its
 * meaning is in the cards, not here.
 */

import { useEffect, useRef, useState } from 'react';

const POSTER = '/media/hero-loop-poster.jpg';
const WEBM = '/media/hero-loop.webm';
const MP4 = '/media/hero-loop.mp4';

/** Intrinsic size of the encoded asset. Ratio is exactly 960:820. */
const W = 1152;
const H = 984;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** Reserved box. aspect-[960/820] is what makes this cost zero CLS. */
const FRAME = 'aspect-[960/820] w-full object-cover';

export function PlatformVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // play() rejects if the element is detached or the browser blocks
            // it. Nothing to recover — the poster is already the right picture.
            void node.play().catch(() => {});
          } else {
            node.pause();
          }
        }
      },
      // A quarter visible is enough to be worth playing; the negative bottom
      // margin stops it starting while it is still only just clipping the fold.
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      // Decorative: the description lives in the sr-only paragraph beside it,
      // and a <video> is not a text alternative (rule 5).
      aria-hidden="true"
      muted
      playsInline
      loop
      // No autoPlay: the observer owns playback. See note 2 above.
      preload="metadata"
      poster={POSTER}
      width={W}
      height={H}
      className={FRAME}
    >
      <source src={WEBM} type="video/webm" />
      <source src={MP4} type="video/mp4" />
    </video>
  );
}
