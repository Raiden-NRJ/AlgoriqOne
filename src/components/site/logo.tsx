import { PARENT } from '@/content/site';
import { cn } from './primitives';

/**
 * The Algoryq One lockup.
 *
 * The mark is the Algoryq Technologies glyph, used verbatim from the parent
 * brand (algoryq.com header + /icon.svg): an angular "A" whose right leg is cut
 * away, crossed by a gradient bar, with the detached foot that completes the Q.
 * Path geometry is not ours to redraw — it is copied exactly so the two brands
 * are the same mark at any size.
 *
 * The wordmark differs from the parent by one segment: algoryq.com sets
 * "algoryq" + ".tech", we set "Algoryq" + "One". Same structure, same colour
 * split — the second segment always carries the brand blue.
 *
 * Rendered as markup rather than an image: crisp at any DPI, inherits the
 * surrounding tone, and adds ~0 bytes to the bundle.
 */

/**
 * One shared gradient id, as on algoryq.com. Every instance defines identical
 * stops in the same user-space coordinates, so collisions are a no-op — and a
 * per-instance counter would desync between the server render and hydration.
 */
const BAR_GRADIENT_ID = 'aq-logo-bar';

export function Logo({
  size = 'md',
  tone = 'default',
  withWordmark = true,
}: {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'band';
  withWordmark?: boolean;
}) {
  const mark = size === 'lg' ? 'size-11' : size === 'sm' ? 'size-7' : 'size-9';
  const word =
    size === 'lg' ? 'text-[1.375rem]' : size === 'sm' ? 'text-[1rem]' : 'text-[1.0625rem]';

  // On the dark band the glyph flips to the band foreground; the gradient bar
  // is legible on both surfaces and is left alone.
  const glyph = tone === 'band' ? 'var(--color-band-fg)' : 'var(--color-fg)';

  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={cn('shrink-0', mark)}>
        <defs>
          <linearGradient
            id={BAR_GRADIENT_ID}
            x1="41.5"
            y1="75"
            x2="95"
            y2="75"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="var(--color-brand-700)" />
            <stop offset="0.72" stopColor="var(--color-brand-500)" />
            <stop offset="1" stopColor="var(--color-brand-300)" />
          </linearGradient>
        </defs>
        {/* stroke + paint-order keeps the joints crisp at 28px, as on algoryq.com */}
        <g strokeLinejoin="round" paintOrder="stroke" strokeWidth="4">
          <path fill={glyph} stroke={glyph} d="M50 8 L76.4 63.5 L59.75 63.5 L50 44 L26 92 L10 92 Z" />
          <path
            fill={`url(#${BAR_GRADIENT_ID})`}
            stroke={`url(#${BAR_GRADIENT_ID})`}
            d="M42.55 69 L87.05 69 L93.65 81 L46.15 81 Z"
          />
          <path fill={glyph} stroke={glyph} d="M72 86.5 L86 86.5 L90 92 L76 92 Z" />
        </g>
      </svg>

      {withWordmark ? (
        <span
          className={cn(
            'font-semibold tracking-[-0.02em]',
            word,
            tone === 'band' ? 'text-[var(--color-band-fg)]' : 'text-[var(--color-fg)]',
          )}
        >
          Algoryq{' '}
          <span
            className={
              tone === 'band' ? 'text-[var(--color-brand-300)]' : 'text-[var(--color-brand-600)]'
            }
          >
            One
          </span>
        </span>
      ) : null}
    </span>
  );
}

/**
 * The parent-brand attribution. Rendered wherever we need to say who builds
 * this — the footer today, potentially an about-page byline later.
 *
 * Deliberately a plain external link with no logo of its own: the mark above
 * already carries the family resemblance, and a second glyph here would read
 * as a partner badge rather than an authorship line.
 */
export function PoweredBy({ tone = 'default' }: { tone?: 'default' | 'band' }) {
  const onBand = tone === 'band';
  return (
    <p className={cn('text-sm', onBand ? 'text-[var(--color-band-fg-muted)]' : 'text-[var(--color-fg-subtle)]')}>
      Powered by{' '}
      <a
        href={PARENT.url}
        className={cn(
          'font-medium underline decoration-transparent underline-offset-4 transition-colors',
          onBand
            ? 'text-[var(--color-band-fg)] hover:decoration-[var(--color-brand-300)]'
            : 'text-[var(--color-fg)] hover:decoration-[var(--color-brand-600)]',
        )}
      >
        {PARENT.wordmark.lead}
        {/* brand-600 is 7.7:1 on white but far too dark on the band, where the
            300 step is the legible end of the ramp (docs/02 §2.3). */}
        <span className={onBand ? 'text-[var(--color-brand-300)]' : 'text-[var(--color-brand-600)]'}>
          {PARENT.wordmark.accent}
        </span>
      </a>
    </p>
  );
}
