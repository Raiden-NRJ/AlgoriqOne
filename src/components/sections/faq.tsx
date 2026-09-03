import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import { faqIntro } from '@/content/homepage';
import { HOMEPAGE_FAQS } from '@/content/faq';
import { Container, Section, SectionHeading } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/**
 * §18 FAQ — beat 8. The six questions that actually block deals.
 *
 * Native <details>/<summary>: fully functional with JavaScript disabled,
 * keyboard-operable for free, and announced correctly by screen readers.
 * FAQPage structured data is emitted for rich results (docs/12 §4.2).
 */
export function Faq() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOMEPAGE_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={faqIntro.eyebrow}
            title={faqIntro.headline}
          />
        </Reveal>

        <Reveal>
          <ul className="flex flex-col gap-2">
            {HOMEPAGE_FAQS.map((item) => (
              <li key={item.question}>
                <details className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors open:border-[var(--color-border-strong)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <Plus
                      aria-hidden
                      className="size-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform duration-[var(--duration-lift)] group-open:rotate-45"
                    />
                  </summary>
                  {/* accordion-body: grid-template-rows 0fr → 1fr, the deck's
                      height animation (globals.css). The inner div carries the
                      padding so the row can collapse to a true zero. */}
                  <div className="accordion-body">
                    <div>
                      <div className="px-5 pb-5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="text-center">
          <Link
            href="/faq"
            /* hover:decoration was --color-brand-600, which on the azure ground
               is a dark-blue underline on a dark surface — the hover state made
               the affordance *less* visible than at rest. All four of the
               site's "read more" links now carry this one semantic recipe. */
            className="inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-medium text-[var(--color-link)] underline decoration-[var(--color-link)]/50 underline-offset-4 transition-colors hover:decoration-[var(--color-link-strong)]"
          >
            {faqIntro.cta}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </Container>

      <script
        type="application/ld+json"
        // Structured data only; no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
