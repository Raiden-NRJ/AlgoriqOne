import { cn } from './primitives';

/**
 * The RocketCRM mark — a violet rounded square with an "R", matching the
 * Figma cover (node 3:5). Rendered as markup, not an image: crisp at any DPI,
 * themeable, and ~0 bytes.
 */
export function Logo({
  size = 'md',
  tone = 'default',
  withWordmark = true,
}: {
  size?: 'sm' | 'md';
  tone?: 'default' | 'band';
  withWordmark?: boolean;
}) {
  const box = size === 'sm' ? 'size-8 text-base' : 'size-10 text-lg';
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={cn(
          'grid place-items-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)] font-semibold text-white',
          box,
        )}
      >
        R
      </span>
      {withWordmark ? (
        <span
          className={cn(
            'text-[1.0625rem] font-semibold tracking-[-0.01em]',
            tone === 'band' ? 'text-[var(--color-band-fg)]' : 'text-[var(--color-fg)]',
          )}
        >
          RocketCRM
        </span>
      ) : null}
    </span>
  );
}
