import { PARENT } from '@/content/site';
import { cn } from './primitives';

/**
 * The Algoryq One lockup.
 *
 * The mark is the Algoryq One emblem: a blue rounded square tile featuring a
 * crisp white delta "A" peak.
 *
 * The wordmark sets "Algoryq" in dark ink and "One" in vibrant brand blue.
 */

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

  /*
    The tile stays a *fill*, so it keeps the brand's own 500/600 values — rule
    12 says those are Algoryq's and unmodified, and a fill is exactly where they
    still work on the dark ground. Only text moved to the semantic layer.
  */
  const tileBg = tone === 'band' ? 'var(--color-brand-500)' : 'var(--color-brand-600)';

  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={cn('shrink-0 shadow-sm rounded-[22%]', mark)}>
        <rect width="100" height="100" rx="22" fill={tileBg} />
        <path
          fill="#FFFFFF"
          d="M50 23 L80 75 L66.5 75 L50 46 L33.5 75 L20 75 Z"
        />
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
              tone === 'band' ? 'text-[var(--color-link)]' : 'text-[var(--color-link)]'
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
 * The parent-brand attribution. Rendered in footer and legal sections.
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
            ? 'text-[var(--color-band-fg)] hover:decoration-[var(--color-link)]'
            : 'text-[var(--color-fg)] hover:decoration-[var(--color-link)]',
        )}
      >
        {PARENT.wordmark.lead}
        <span className="text-[var(--color-link)]">
          {PARENT.wordmark.accent}
        </span>
      </a>
    </p>
  );
}
