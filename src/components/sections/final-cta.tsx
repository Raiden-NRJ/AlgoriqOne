import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { finalCta } from '@/content/homepage';
import { Button, Container } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { stagger } from '@/components/site/motion';

/**
 * §19 Final CTA — beat 9 (the ask).
 *
 * The third line is aimed squarely at the CTO. Offering "read the architecture
 * first" instead of pushing a signup is the most on-brand sentence on the page:
 * it says we expect to be evaluated, and we are comfortable with that.
 */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-aurora">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid" />
      <Container className="relative">
        <Reveal className="section-y-lg flex flex-col items-center gap-6 text-center">
          {/*
            Staggered rather than one block. The closing beat inherits Rise +
            Stagger (it has no choreography slide in either deck), and the
            headline landing before the buttons is what makes the ask read as
            an ask rather than as a slab arriving. stagger() so it stays in the
            band and cannot drift.
          */}
          <h2
            data-rise-item=""
            style={{ animationDelay: `${stagger(0)}ms` }}
            className="text-display-2 max-w-[min(18ch,100%)]"
          >
            {finalCta.headline}
          </h2>
          <p
            data-rise-item=""
            style={{ animationDelay: `${stagger(1)}ms` }}
            className="text-body-lg max-w-[min(46ch,100%)] text-[var(--color-fg-muted)]"
          >
            {finalCta.sub}
          </p>

          <div
            data-rise-item=""
            style={{ animationDelay: `${stagger(2)}ms` }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Button href={finalCta.primaryCta.href} size="lg">
              {finalCta.primaryCta.label}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button href={finalCta.secondaryCta.href} variant="secondary" size="lg">
              {finalCta.secondaryCta.label}
            </Button>
          </div>

          <Link
            href={finalCta.tertiary.href}
            data-rise-item=""
            style={{ animationDelay: `${stagger(3)}ms` }}
            className="inline-flex min-h-6 items-center py-1 text-sm text-[var(--color-fg-subtle)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:text-[var(--color-fg-muted)]"
          >
            {finalCta.tertiary.label}
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
