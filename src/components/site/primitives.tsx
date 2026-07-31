/**
 * Site primitives. Server-safe, no client state.
 * Tokens only — a hex literal or magic pixel value in here is a bug (docs/11 §4).
 */
import Link from 'next/link';
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
  tone?: 'default' | 'subtle' | 'band';
  size?: 'default' | 'lg';
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<'section'>, 'children' | 'className' | 'id'>) {
  const tones = {
    default: 'bg-[var(--color-bg)]',
    subtle: 'bg-[var(--color-bg-subtle)] border-y border-[var(--color-border)]',
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

export function Card({
  className,
  children,
  tone = 'default',
  interactive = false,
}: {
  className?: string;
  children: ReactNode;
  tone?: 'default' | 'band';
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-xl)] border p-6',
        tone === 'band'
          ? 'border-[var(--color-band-border)] bg-[var(--color-band-surface)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-e1)]',
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-e2)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

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

/** Sample-data disclosure. Used anywhere fictional data is shown. */
export function SampleDataNote({ tone = 'default' }: { tone?: 'default' | 'band' }) {
  return (
    <p
      className={cn(
        'text-xs',
        tone === 'band' ? 'text-[var(--color-band-fg-muted)]' : 'text-[var(--color-fg-subtle)]',
      )}
    >
      Sample data from the Algoryq One Demo tenant.
    </p>
  );
}
