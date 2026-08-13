/**
 * The illustration card — one container for all 18 subsection illustrations.
 *
 * Server-safe, no client state. Tokens only.
 *
 * ── Why a shared component ────────────────────────────────────────────────
 * Eighteen call sites across fourteen routes. Written inline they would drift
 * within a release, and the brief's actual requirement is that they "read as
 * part of the same design system, not a bolt-on" — which is a single component,
 * not eighteen copies of the same class list.
 *
 * ── The frame ─────────────────────────────────────────────────────────────
 * Radius, border and shadow are the homepage video card's exactly
 * (`rounded-[var(--radius-xl)]`, `--color-border`, `--shadow-e2`), so an
 * illustration and a video loop are the same object in the design's terms. The
 * thin chrome bar on top is the one addition.
 *
 * The chrome dots are **neutral, not red/amber/green**. The palette migration
 * quarantined `--color-danger` / `--color-warning` / `--color-success` to
 * functional use only — form validation, error states, genuine status — and a
 * decorative traffic light is exactly the kind of borrowed semantic colour that
 * rule was written to stop. Three neutral dots read as window chrome without
 * spending a status colour on decoration.
 *
 * ── Sizing ────────────────────────────────────────────────────────────────
 * Every source is 1376×768 (1.792). The box is declared at that ratio and the
 * image fills it with `object-cover`, so the frame reserves its height before
 * the bytes arrive — no layout shift — and a future asset at a different ratio
 * crops rather than stretches.
 *
 * ── Captions ──────────────────────────────────────────────────────────────
 * `caption` is optional and **off by default, deliberately**. The obvious line
 * to reach for is `SampleDataNote`'s "Sample data from the Algoryq One Demo
 * tenant", and on these it would be false: they are abstract illustrations, not
 * renders of that fixture set. Pass a caption only where there is something
 * true to say about the image.
 */

import Image from 'next/image';
import { cn } from './primitives';

/** Intrinsic ratio of the illustration set. */
const RATIO = '1376/768';

export function Illustration({
  src,
  alt,
  caption,
  className,
  sizes = '(min-width: 1024px) 40vw, 100vw',
  priority = false,
  chrome = true,
}: {
  /** Path under /public, e.g. `/illustrations/product-revenue.jpg`. */
  src: string;
  /**
   * Describe *this subsection's* content. These illustrations are the only
   * information some users get about the shape of a screen, so a generic
   * "product illustration" wastes the alt attribute.
   */
  alt: string;
  caption?: string;
  className?: string;
  /** Override when the card is wider than the default aside column. */
  sizes?: string;
  priority?: boolean;
  /**
   * Set false when the source already has window chrome painted into it —
   * `platform-customization.jpg` does. Two sets of traffic lights stacked on
   * one card is the tell that the frame was applied without looking.
   */
  chrome?: boolean;
}) {
  return (
    <figure className={cn('flex flex-col gap-3', className)}>
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-e2)]">
        {/* Window chrome. Decorative — the figure's meaning is in the alt text. */}
        {chrome ? (
          <div
            aria-hidden
            className="flex items-center gap-1.5 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-2.5"
          >
            <span className="size-2.5 rounded-full bg-[var(--color-neutral-300)]" />
            <span className="size-2.5 rounded-full bg-[var(--color-neutral-200)]" />
            <span className="size-2.5 rounded-full bg-[var(--color-neutral-200)]" />
          </div>
        ) : null}

        <div className="relative" style={{ aspectRatio: RATIO }}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        </div>
      </div>

      {caption ? (
        <figcaption className="text-xs text-[var(--color-fg-subtle)]">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
