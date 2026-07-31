import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { solutions } from '@/content/homepage';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/**
 * §14 Built for how you work — a routing section, deliberately light. It exists
 * to move the visitor to the page written for them, not to tell a story here.
 */
export function Solutions() {
  return (
    <Section>
      <Container width="wide" className="flex flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>Built for how you work</Eyebrow>
          <h2 className="text-display-2 max-w-[min(20ch,100%)]">Find the version of this that fits you.</h2>
        </Reveal>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((item, i) => (
            <Reveal as="li" key={item.href} delay={i * 45}>
              <Link
                href={item.href}
                className="group flex h-full items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-e2)]"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="text-label text-[var(--color-fg-subtle)]">{item.kind}</span>
                  <span className="text-base font-medium">{item.label}</span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="size-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--color-brand-600)]"
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
