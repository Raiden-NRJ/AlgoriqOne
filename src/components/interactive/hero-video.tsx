'use client';

/**
 * §1 Hero backdrop — a silent, looping, full-bleed background video.
 *
 * Was a boxed visual in the hero's right column until 2026-08-31. It is now the
 * section's background layer: absolutely positioned, object-cover, no frame, no
 * radius, no max-width. The copy sits on top of it behind `.hero-scrim`.
 *
 * Lives under interactive/ rather than site/ because the reduced-motion and
 * small-screen rules below genuinely need JavaScript: no CSS media query can
 * stop a <video autoplay> from playing, it can only hide it. CLAUDE.md's
 * 'use client' boundary is absolute, so the island goes here.
 *
 * Rendering contract (unchanged from the boxed version):
 *  - The server renders the <video>, so with JavaScript disabled the hero is
 *    complete and the loop plays on its own (rule 6).
 *  - On mount the effect *downgrades* to the poster in the two cases where the
 *    video must not play: prefers-reduced-motion (rule 5), and below lg.
 *  - Both branches fill the same absolutely-positioned box, so the swap moves
 *    nothing. Being out of flow, neither can contribute layout shift at all —
 *    the hero's height comes from the copy column, not from this.
 *
 * Small screens: below lg (1024px) the poster is shown instead of the video.
 * This follows the same trade the boxed version made and that the rest of the
 * site makes — the loop is decorative, and 5MB of it is the wrong spend on a
 * phone against the Lighthouse mobile gate (rule 4). The poster is the same
 * frame, and the scrim and copy treatment are identical over either, so the
 * small-screen hero is the same design rather than a degraded one.
 *
 * Known cost of keeping rule 6 literal: because the *server* renders the
 * <video autoplay>, a small-screen browser may begin fetching it before this
 * effect swaps in the poster. `preload="none"` limits that to a metadata-less
 * request in practice, but the hole is real and is flagged rather than hidden.
 *
 * The asset is the 2026-08-31 office/dashboard montage, re-encoded from the
 * 18.6MB 1080p master (kept at media/hero-office-master.mp4): audio stripped,
 * since it is muted and the track was pure weight, then VP9 3.1MB + H.264
 * 5.1MB. Both are the native 1920×1080 — the source resolution is preserved
 * and never upscaled by CSS; object-cover only ever crops it.
 *
 * ⚠ The footage's baked-in interface text is garbled — "Milsstone", "Fanding",
 * "Bh Logged", "Frer 3, 2023" and a nonsense URL, among others — and at full
 * bleed it is far more legible than it was in the old boxed treatment. This is
 * the same class of defect as blockers B11/B12. It ships at the owner's
 * explicit instruction; the copy carries a rule-1 disclosure that the
 * interface is illustrative. The clean remedy is a trim: the garbled UI is
 * confined to 0–7s and 20–22s of the master, so a loop cut from 23–30s (or
 * 9–19s + 23–30s) is all human footage and carries none of it.
 */

import { useEffect, useState } from 'react';
import Image from 'next/image';

/*
  The `poster` attribute keeps this raw path deliberately. `poster` takes a
  plain URL the media element fetches itself — it cannot point at a next/image
  render, because that endpoint negotiates format from the request's Accept
  header and a <video> poster fetch does not participate in that. The
  poster-only branch below *is* routed through the optimizer, which is the
  branch small screens take and therefore the one where the bytes matter.
*/
const POSTER = '/media/hero-office-poster.jpg';
/*
  Order matters: a browser takes the first <source> it can play, so the webm
  is only listed first because it is measurably the smaller file.

  Both were encoded and compared rather than assumed. VP9 at CRF 37 came out
  *larger* than H.264 (5.53MB vs 5.14MB) and was rejected; at CRF 44 it lands
  at 3.14MB, a 39% saving, and the extra quantisation is invisible here —
  the footage sits under a 72–86% scrim on the copy side, and the least-veiled
  strip at the right edge was checked frame-against-frame against the master
  for blocking before this was taken. mp4 stays as the universal fallback.
*/
const WEBM = '/media/hero-office.webm';
const MP4 = '/media/hero-office.mp4';

/** Intrinsic size of the encoded asset. Native 1080p, 16:9. */
const W = 1920;
const H = 1080;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
/** Tailwind's lg. Same gate the boxed hero video used — see the note above. */
const WIDE = '(min-width: 64rem)';

/** Shared by both branches: the full-bleed layer itself. */
const LAYER = 'absolute inset-0 h-full w-full object-cover';

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
      next/image, not a bare <img>: this branch is what phones and
      reduced-motion users get, so it is the one that most deserves AVIF/WebP
      negotiation and a responsive srcset. `priority` because it is the hero and
      the LCP candidate on every viewport that takes this branch.

      `fill` rather than width/height — the layer is absolutely positioned and
      sized by its parent, which is exactly what fill is for.
    */
    return (
      <Image
        src={POSTER}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        priority
        className="object-cover"
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
      className={LAYER}
    >
      <source src={WEBM} type="video/webm" />
      <source src={MP4} type="video/mp4" />
    </video>
  );
}
