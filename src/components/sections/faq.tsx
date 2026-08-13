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
                      className="size-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform duration-200 group-open:rotate-45"
                    />
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {item.answer}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="text-center">
          <Link
            href="/faq"
            className="inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-medium text-[var(--color-brand-700)] underline decoration-[var(--color-brand-300)] underline-offset-4 hover:decoration-[var(--color-brand-600)]"
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
