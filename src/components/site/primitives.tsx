/**
 * Site primitives. Server-safe, no client state.
 * Tokens only — a hex literal or magic pixel value in here is a bug (docs/11 §4).
 */
import Link from 'next/link';
import { Check } from 'lucide-react';
import type { ComponentProps, ElementType, ReactNode } from 'react';
import { OFFSITE_ROUTES } from '@/content/site';

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/* ────────────────────────────── Layout ────────────────────────────────── */

export function Container({
  className,
  children,
  width = 'default',
}: {
  className?: string;
  children: ReactNode;
  width?: 'prose' | 'default' | 'wide';
}) {
  const widths = {
    prose: 'max-w-[min(68ch,100%)]',
    default: 'max-w-[75rem]',
    wide: 'max-w-[90rem]',
  } as const;
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-8 lg:px-12', widths[width], className)}>
      {children}
    </div>
  );
}

export function Section({
  id,
  tone = 'default',
  size = 'default',
  className,
  children,
  ...rest
}: {
  id?: string;
  tone?: 'default' | 'subtle' | 'tint' | 'band';
  size?: 'default' | 'lg';
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<'section'>, 'children' | 'className' | 'id'>) {
  const tones = {
    default: 'bg-[var(--color-bg)]',
    subtle: 'bg-[var(--color-bg-subtle)] border-y border-[var(--color-border)]',
    // Aurora-cyan tint. Renamed from `warm` when the third brand colour moved
    // from parchment to cyan.
    //
    // Border is cyan-300, not the cool --color-border (a neutral hairline
    // against a tinted surface reads as a seam) and not cyan-100, which
    // check-contrast measured at 1.09:1 against cyan-50 — fainter than the
    // neutral border it replaces, i.e. an invisible section boundary.
    // cyan-300 measures 1.61:1 on white, comparable to --color-border-strong
    // (1.51).
    // Not cyan-500: this is a border, and cyan-500 is fill-only.
    tint: 'bg-[var(--color-cyan-50)] border-y border-[var(--color-cyan-300)]',
    band: 'bg-[var(--color-band)] text-[var(--color-band-fg)]',
  } as const;
  return (
    <section
      id={id}
      className={cn(tones[tone], size === 'lg' ? 'section-y-lg' : 'section-y', className)}
      {...rest}
    >
      {children}
    </section>
  );
}

/* ──────────────────────────── Typography ──────────────────────────────── */

export function Eyebrow({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'band';
}) {
  return (
    <span
      className={cn(
        // w-fit: as a flex child the default `align-items: stretch` would pull
        // this pill to the full column width, which looks like a bug.
        'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
        tone === 'band'
          ? 'border-[var(--color-band-border)] bg-[var(--color-band-surface)] text-[var(--color-band-fg-muted)]'
          : 'border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]',
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'default',
  as: Tag = 'h2',
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'default' | 'band';
  as?: ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <Tag className={cn('text-display-2 max-w-[min(22ch,100%)]', align === 'center' && 'mx-auto')}>
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            'text-body-lg max-w-[min(58ch,100%)]',
            tone === 'band' ? 'text-[var(--color-band-fg-muted)]' : 'text-[var(--color-fg-muted)]',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

/* ────────────────────────────── Actions ───────────────────────────────── */

type ButtonProps = {
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'onBand';
  size?: 'md' | 'lg';
  children: ReactNode;
  className?: string;
};

export function Button({
  href,
  variant = 'primary',
  size = 'md',
  children,
  className,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,color,border-color,transform,box-shadow] duration-150 ease-out active:translate-y-0';
  const sizes = size === 'lg' ? 'px-7 py-3.5 text-base' : 'px-5 py-2.5 text-sm';
  const variants = {
    primary:
      'bg-[var(--color-brand-600)] text-white shadow-[var(--shadow-e2)] hover:bg-[var(--color-brand-500)] hover:-translate-y-px',
    secondary:
      'border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)] hover:-translate-y-px',
    ghost: 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]',
    onBand:
      'border border-[var(--color-band-border)] bg-[var(--color-band-surface)] text-[var(--color-band-fg)] hover:bg-[var(--color-band-border)]',
  } as const;

  const classes = cn(base, sizes, variants[variant], className);
  // OFFSITE_ROUTES are internal-looking paths that redirect to the portal, so
  // they get the plain-anchor treatment too — see the note on the constant.
  const leavesSite = href.startsWith('http') || OFFSITE_ROUTES.includes(href);

  if (leavesSite) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        // min-h-6 meets the WCAG 2.2 target-size minimum (24px). A standalone
        // link is not covered by the "inline in a sentence" exception, and a
        // 20px-tall tap target is a real miss on a phone.
        'inline-flex min-h-6 items-center gap-1.5 py-1 font-medium text-[var(--color-brand-700)]',
        'underline decoration-[var(--color-brand-300)] decoration-1 underline-offset-4',
        'transition-colors hover:decoration-[var(--color-brand-600)]',
        className,
      )}
    >
      {children}
    </Link>
  );
}

/* ─────────────────────────────── Content ──────────────────────────────── */

/**
 * The site's one bullet treatment.
 *
 * Added in the 2026-08-10 content pass, when the deep-page paragraphs became
 * bullets. `DetailPage`'s Block already rendered checked bullets exactly like
 * this; the bespoke pages (about, careers, demo, roi, pricing, guides) had
 * nothing, so their converted prose would have arrived as plain `<li>` and the
 * two halves of the site would have listed things differently on facing pages.
 *
 * `columns` wraps into two from sm up. Use it for four or more single-line
 * items with nothing beside them — the same rule Block applies internally.
 *
 * Note `min-w-0` on the item: a long bullet in a grid cell would otherwise take
 * its min-content width and drag the column (CLAUDE.md, and it has bitten here
 * twice before).
 */
export function BulletList({
  items,
  columns = false,
  tone = 'default',
  className,
}: {
  items: string[];
  columns?: boolean;
  tone?: 'default' | 'band';
  className?: string;
}) {
  return (
    <ul
      className={cn(
        'gap-2.5',
        columns ? 'grid sm:grid-cols-2 sm:gap-x-8' : 'flex flex-col',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item} className="flex min-w-0 items-start gap-2.5 text-sm leading-relaxed">
          <Check
            aria-hidden
            className={cn(
              'mt-0.5 size-4 shrink-0',
              tone === 'band' ? 'text-[var(--color-cyan-300)]' : 'text-[var(--color-brand-600)]',
            )}
          />
          <span
            className={
              tone === 'band'
                ? 'text-[var(--color-band-fg-muted)]'
                : 'text-[var(--color-fg-muted)]'
            }
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/*
  `Card` lived here until 2026-08-10 and was deleted as dead code (audit B10):
  a fully styled 27-line component with zero call sites anywhere in the tree.
  Every card-shaped surface on the site is written inline in its own section,
  because they differ in padding, hover behaviour and whether they wrap a link.
  If a real shared card is wanted, write it from those call sites rather than
  restoring this one — it never matched any of them.
*/

export function Pill({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'band' | 'brand';
}) {
  const tones = {
    default: 'border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]',
    band: 'border-[var(--color-band-border)] bg-[var(--color-band-surface)] text-[var(--color-band-fg-muted)]',
    brand: 'border-[var(--color-brand-200)] bg-[var(--color-brand-50)] text-[var(--color-brand-800)]',
  } as const;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Monospaced permission key / code token. */
export function Code({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'band' }) {
  return (
    <code
      className={cn(
        'rounded-[var(--radius-sm)] border px-1.5 py-0.5 font-mono text-[0.8125em]',
        tone === 'band'
          ? 'border-[var(--color-band-border)] bg-[var(--color-band)] text-[var(--color-band-fg-muted)]'
          : 'border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]',
      )}
    >
      {children}
    </code>
  );
}

/**
 * Sample-data disclosure. Used anywhere fictional data is shown.
 *
 * The default names the Demo tenant, which is the canonical fixture set shared
 * by the site, the Figma deck and the screenshots. **Only use the default when
 * the data really is that dataset** — `children` exists for surfaces showing
 * fictional data from somewhere else, so they can disclose honestly instead of
 * claiming a provenance they do not have (rule 1). The styling is fixed either
 * way so the disclosure always reads the same.
 */
export function SampleDataNote({
  tone = 'default',
  children,
}: {
  tone?: 'default' | 'band';
  children?: ReactNode;
}) {
  return (
    <p
      className={cn(
        'text-xs',
        tone === 'band' ? 'text-[var(--color-band-fg-muted)]' : 'text-[var(--color-fg-subtle)]',
      )}
    >
      {children ?? 'Sample data from the Algoryq One Demo tenant.'}
    </p>
  );
}
