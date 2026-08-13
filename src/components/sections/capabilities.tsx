import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { capabilities } from '@/content/homepage';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/**
 * §6 Built to fit — beat 7. One idea: it bends to your process without a
 * rebuild.
 *
 * Absorbed §9 Devices on 2026-08-10 as the fourth card. Devices was a whole
 * section carrying one claim — approvals and timesheets happen away from a
 * desk, and there is a responsive web app plus an installable PWA — wrapped in
 * three CSS device frames. The claim is intact in the card; the desktop and
 * tablet frames were cut as decoration and /platform/mobile keeps the detail,
 * including both copies of the explicit no-native-app negation.
 *
 * Each card carries a miniature of the thing it describes rather than an icon,
 * so the section shows the capability instead of asserting it.
 */
export function Capabilities() {
  return (
    <Section>
      <Container width="wide" className="flex flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>{capabilities.eyebrow}</Eyebrow>
          <h2 className="text-display-2 max-w-[min(22ch,100%)]">{capabilities.headline}</h2>
        </Reveal>

        {/* 2-up at md so four cards never leave a single orphan on a row. */}
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.cards.map((card, i) => (
            <Reveal as="li" key={card.title} delay={i * 70}>
              <Link
                href={card.href}
                className="group flex h-full flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e1)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-e2)]"
              >
                {/* The miniature */}
                <div className="flex flex-wrap items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3">
                  {card.steps.map((step, index) => (
                    <span key={step} className="flex items-center gap-1.5">
                      <span
                        className={
                          index === card.steps.length - 1
                            ? 'rounded-[var(--radius-sm)] bg-[var(--color-brand-600)] px-2 py-1 text-xs font-medium text-white'
                            : 'rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs font-medium text-[var(--color-fg-muted)]'
                        }
                      >
                        {step}
                      </span>
                      {index < card.steps.length - 1 ? (
                        <ChevronRight
                          aria-hidden
                          className="size-3 text-[var(--color-fg-subtle)]"
                        />
                      ) : null}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {card.body}
                  </p>
                </div>

                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand-700)]">
                  Learn more
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
