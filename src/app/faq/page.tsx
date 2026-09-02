import type { Metadata } from 'next';
import { Plus } from 'lucide-react';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { FAQS } from '@/content/faq';
import { PRICING_FAQS } from '@/content/pricing';

export const metadata: Metadata = {
  title: 'Frequently asked questions',
  description:
    'Migration, adoption, security sign-off, data ownership, customization limits, implementation time and pricing — answered directly.',
  alternates: { canonical: '/faq' },
};

const SECTIONS = [
  { heading: 'Evaluating the platform', items: FAQS },
  { heading: 'Pricing and commercials', items: PRICING_FAQS },
];

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SECTIONS.flatMap((section) =>
      section.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    ),
  };

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="The questions that actually decide this."
        intro="Written to be useful rather than reassuring. Where the honest answer is “not yet”, that is what it says."
      />

      <Section>
        <Container className="flex flex-col gap-12">
          {SECTIONS.map((section) => (
            <Reveal key={section.heading} className="flex flex-col gap-5">
              <h2 className="text-h2">{section.heading}</h2>
              <ul className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <li key={item.question}>
                    <details className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] open:border-[var(--color-border-strong)]">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-medium [&::-webkit-details-marker]:hidden">
                        {item.question}
                        <Plus
                          aria-hidden
                          className="size-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform duration-[var(--duration-lift)] group-open:rotate-45"
                        />
                      </summary>
                      {/* accordion-body: the deck's 0fr → 1fr height animation. */}
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
          ))}
        </Container>
      </Section>

      <CtaBand
        title="Question not answered?"
        body="Ask it directly. We would rather have the awkward conversation now than in month three."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
