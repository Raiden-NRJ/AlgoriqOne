'use client';

/**
 * §1 Hero visual — a silent, looping background video.
 *
 * Lives under interactive/ rather than site/ because the reduced-motion and
 * small-screen rules below genuinely need JavaScript: no CSS media query can
 * stop a <video autoplay> from playing, it can only hide it. CLAUDE.md's
 * 'use client' boundary is absolute, so the island goes here.
 *
 * Rendering contract:
 *  - The server renders the <video>. With JavaScript disabled the hero is
 *    therefore complete and the loop plays on its own (rule 6).
 *  - On mount the effect *downgrades* to the poster in the two cases where the
 *    video must not play: prefers-reduced-motion (rule 5), and below the lg
 *    breakpoint (see "Small screens" below).
 *  - Both states occupy an aspect-[960/820] box, so the slot is reserved before
 *    any bytes arrive and the swap costs zero layout shift.
 *
 * Small screens: below lg (1024px) the poster is shown instead of the video.
 * The loop is purely decorative — it duplicates the description already in the
 * sr-only paragraph that hero.tsx renders — so spending ~272KB on a phone to
 * animate it is the wrong trade against the Lighthouse mobile gate (rule 4).
 * The poster is 74KB and carries the same picture.
 *
 * Known cost of keeping rule 6 literal: because the *server* renders the
 * <video autoplay>, a small-screen browser may begin fetching it before this
 * effect swaps in the poster, so the saving is not absolute. Removing autoplay
 * from the server output would close that hole but would also stop the loop
 * playing with JS disabled, which rule 6 explicitly asks for. Flagged rather
 * than silently traded.
 *
 * preload="none" keeps the video off the critical path; the poster is the only
 * thing fetched until playback is actually wanted.
 *
 * ⚠ The video's baked-in interface text does not match content/homepage.ts —
 * it misspells the portal domain and several demo-tenant strings. Shipped at
 * the owner's explicit instruction; see docs/palette-migration.md notes and the
 * hand-off report. Re-cut the master rather than "fixing" it here — text inside
 * an mp4 cannot be corrected from a content module.
 */

import { useEffect, useState } from 'react';
import Image from 'next/image';

/*
  The `poster` attribute on the <video> below keeps this raw path deliberately.
  `poster` takes a plain URL that the media element fetches itself — it cannot
  point at a next/image render, because that endpoint negotiates format from the
  request's Accept header and a <video> poster fetch does not participate in
  that. The poster-only branch above *is* routed through the optimizer, which is
  the branch that serves small screens and therefore the one where the bytes
  matter.
*/
const POSTER = '/media/hero-loop-poster.jpg';
const WEBM = '/media/hero-loop.webm';
const MP4 = '/media/hero-loop.mp4';

/** Intrinsic size of the encoded asset. Ratio is exactly 960:820. */
const W = 1152;
const H = 984;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
/**
 * Tailwind's lg (1024px), not xl.
 *
 * The point of the gate is to keep ~272KB of decorative video off phones and
 * portrait tablets, and lg already does that — the widest phone landscape here
 * is 844px and portrait tablets are 768px. Gating at xl (1280px) also caught
 * ordinary laptop windows, so a desktop visitor at 1200px got a still image
 * and no motion at all. That was the wrong trade: it cost the animation on real
 * desktops to save bytes nobody was spending.
 */
const WIDE = '(min-width: 64rem)';

/**
 * Shared by both branches: the reserved box. aspect-[960/820] is what makes
 * CLS 0 — the height is known from the ratio before the poster or the video
 * has loaded a single byte.
 */
const FRAME =
  'aspect-[960/820] w-full rounded-[var(--radius-xl)] object-cover';

export function HeroVideo() {
  const [posterOnly, setPosterOnly] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_MOTION);
    const wide = window.matchMedia(WIDE);

    const sync = () => setPosterOnly(reduced.matches || !wide.matches);
    sync();

    reduced.addEventListener('change', sync);
    wide.addEventListener('change', sync);
    return () => {
      reduced.removeEventListener('change', sync);
      wide.removeEventListener('change', sync);
    };
  }, []);

  if (posterOnly) {
    /*
      next/image, not a bare <img> (2026-08-11).

      This branch is what phones and portrait tablets actually get, so it is the
      one that most deserves AVIF/WebP negotiation and a responsive srcset — the
      raw JPEG is 74KB at 1152px wide, served identically to a 390px screen.
      `priority` because it is the hero: it is the LCP candidate on every
      viewport that takes this branch, and lazy-loading the LCP element is a
      measurable regression.

      `sizes` matches the hero grid: full width below lg, and this branch never
      renders above lg — but the value is stated in full so it stays correct if
      the gate ever moves.
    */
    return (
      <Image
        src={POSTER}
        alt=""
        aria-hidden="true"
        width={W}
        height={H}
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority
        className={FRAME}
      />
    );
  }

  return (
    <video
      // Decorative: the meaning is carried by the sr-only paragraph in
      // hero.tsx, and a <video> is not a text alternative (rule 5).
      aria-hidden="true"
      muted
      playsInline
      loop
      autoPlay
      preload="none"
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
