'use client';

/**
 * P3 — "Video, with the gaps named". Deck slide 05:
 *
 *   OVERLAYS   200ms · 500ms apart
 *   DRIVER     timeupdate, not setTimeout
 *   LIST       70ms stagger, in parallel
 *   FALLBACK   poster + static callouts
 *
 * ── Why this drives the list beside the video, not overlays on top of it ───
 * The deck's composition puts callouts over the footage. This section already
 * names the same four gaps as text in the adjacent column, so overlaying them
 * would state the section's one idea twice *simultaneously* — a stronger
 * version of the duplication that removed `home.jpg` on 2026-08-10. Moving the
 * list onto the video instead would put body copy over moving footage and cost
 * the contrast guarantee the copy has where it is.
 *
 * So the redline that actually matters here is the **driver**, and it is
 * implemented literally: the four lines are revealed off the video element's
 * own clock, 500ms apart, as it plays.
 *
 * ── Why `timeupdate` and not setTimeout ───────────────────────────────────
 * This is the deck's one correctness requirement, and it is easy to get
 * subtly wrong. A timer chain starts drifting the moment the video does
 * anything other than play smoothly — buffering, a decode stall, or a
 * background tab, where browsers throttle timers to once a second or stop
 * them. The labels then describe a frame that is no longer on screen. Reading
 * `currentTime` cannot drift, because it *is* the position.
 *
 * ── Degradation, in order ─────────────────────────────────────────────────
 *  - No JS: every line is rendered and visible. The server output is the
 *    finished state; this component only ever *adds* the timed reveal.
 *  - Reduced motion: all lines shown at once, no observer, no listener.
 *  - Video missing, blocked, or never playing: a failsafe shows every line
 *    after the last cue would have passed, so a stalled video can never
 *    withhold copy. Same principle as Reveal's 2s failsafe.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Deck: 500ms apart. First cue at 0 so the opening line is not held back. */
const CUE_MS = 500;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export function GapCallouts({ count, children }: { count: number; children: ReactNode }) {
  /*
    Starts at `count` — every line shown. The timed reveal is an enhancement
    layered on top, never a gate in front of the copy, so a failure anywhere
    below leaves the list complete rather than empty.
  */
  const [shown, setShown] = useState(count);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION).matches) return;

    const root = ref.current;
    if (!root) return;

    // The video is a sibling in the same section; find it rather than prop-drill
    // a ref across a server/client boundary.
    const video = root.closest('section')?.querySelector('video');
    if (!video) return;

    setShown(0);

    const onTime = () => {
      const due = Math.min(count, Math.floor((video.currentTime * 1000) / CUE_MS) + 1);
      setShown((prev) => (due > prev ? due : prev));
    };

    // Failsafe: if the video never reaches the last cue — blocked autoplay, a
    // stall, a decode error — show everything anyway.
    const failsafe = setTimeout(() => setShown(count), count * CUE_MS + 2000);

    video.addEventListener('timeupdate', onTime);
    onTime();

    return () => {
      video.removeEventListener('timeupdate', onTime);
      clearTimeout(failsafe);
    };
  }, [count]);

  return (
    <div ref={ref} data-gap-callouts="" style={{ ['--shown' as string]: shown }}>
      {children}
    </div>
  );
}
