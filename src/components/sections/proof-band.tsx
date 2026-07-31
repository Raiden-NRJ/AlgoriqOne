import Link from 'next/link';
import { CUSTOMER_LOGOS, hasLogos } from '@/content/proof';
import { PLATFORM_FACTS } from '@/content/site';
import { Container } from '@/components/site/primitives';

/**
 * §2 Trust bar — GATED (docs/04 §2).
 *
 * RocketCRM has no customer logos on file and no permission to display any, so
 * the logo state does not render. The fallback is not a placeholder: it is four
 * facts that are true, checkable, and more persuasive to a technical buyer than
 * a row of grey rectangles would be.
 *
 * Both states occupy the same height, so adding real logos causes no layout
 * regression — it is a content change to content/proof.ts, nothing more.
 */
export function ProofBand() {
  if (hasLogos()) {
    return (
      <section aria-label="Customers" className="border-y border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-10">
        <Container width="wide">
          <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {CUSTOMER_LOGOS.filter((l) => l.permissionGranted).map((logo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <li key={logo.name}>
                <img
                  src={logo.logo}
                  alt={logo.name}
                  className="h-7 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    );
  }

  return (
    <section
      aria-label="Platform facts"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-10"
    >
      <Container width="wide">
        <div className="flex flex-col gap-6">
          <p className="text-label text-center text-[var(--color-fg-subtle)]">
            What the platform actually is
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {PLATFORM_FACTS.map((fact) => (
              <div key={fact.label} className="flex flex-col items-center gap-1 text-center">
                <dt className="sr-only">{fact.label}</dt>
                <dd className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-semibold tracking-[-0.03em] text-[var(--color-fg)]">
                    {fact.value}
                  </span>
                  <span className="max-w-[min(18ch,100%)] text-sm leading-snug text-[var(--color-fg-muted)]">
                    {fact.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-center text-xs text-[var(--color-fg-subtle)]">
            We are early, and we would rather show you the engineering than a logo wall we haven’t
            earned yet.{' '}
            <Link
              href="/platform/architecture"
              className="underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-fg-muted)]"
            >
              See how it’s built
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
