/**
 * The hero photograph — one component for all 18 page heroes.
 *
 * Server-safe, no client state. Tokens only.
 *
 * ── Why it is not `Illustration` ──────────────────────────────────────────
 * `Illustration` frames *product diagrams*, and its window-chrome bar is the
 * reason: a title bar with traffic lights says "this is a screen". These are
 * photographs of people, and a browser frame around a photo of somebody on the
 * phone is a category error. Same radius, same border, same `--shadow-e2`, so
 * the two read as one system — chrome is the only difference, and it is the
 * difference that matters.
 *
 * ── Sizing ────────────────────────────────────────────────────────────────
 * Sources are 1216×679 after the watermark crop (scripts/prepare-images.mjs).
 * The box is declared at that ratio so it reserves its height before any bytes
 * arrive — CLS 0 — and `object-cover` means a future asset at a different ratio
 * crops rather than stretches.
 *
 * `max-h` on the stacked layout is the brief's height cap. At 390px the ratio
 * alone yields ~195px so the cap is inert; it binds from roughly 500px up,
 * where an uncapped 1.79 box would run to 393px on a tablet and push the CTAs
 * under the fold. Above `lg` the cap is released and the photo sizes to its
 * column.
 *
 * ── Priority ──────────────────────────────────────────────────────────────
 * Always above the fold on these pages, so `priority` is the default rather
 * than a per-call-site decision somebody will forget. That opts it out of
 * lazy-loading deliberately: it is the page's LCP candidate.
 */

import Image from 'next/image';
import { cn } from './primitives';

/** Intrinsic ratio of the photography set, post-crop. */
const RATIO = '1216/679';

export function HeroPhoto({
  src,
  alt,
  className,
  sizes = '(min-width: 1024px) 45vw, 100vw',
  priority = true,
}: {
  /** Path under /public, e.g. `/hero/product-revenue.jpg`. */
  src: string;
  /**
   * Describe the photograph — who is in it and what they are doing. It carries
   * the only impression of the image a screen-reader user gets, and these are
   * the page's single largest visual, so "office photo" wastes it.
   */
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        'rounded-[var(--radius-xl)] shadow-[var(--shadow-e2)]',
        // The hairline keeps a light-cornered photo from dissolving into the
        // aurora wash behind it — the same border the illustration cards use.
        'border border-[var(--color-border)]',
        'max-h-[17.5rem] lg:max-h-none',
        className,
      )}
      style={{ aspectRatio: RATIO }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
