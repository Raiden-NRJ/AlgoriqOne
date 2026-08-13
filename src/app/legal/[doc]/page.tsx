import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { PageHero } from '@/components/page/page-template';
import { Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { LEGAL_DOCS, LEGAL_DOC_IDS, type LegalDocId } from '@/content/legal';

type Params = { doc: string };

export function generateStaticParams() {
  return LEGAL_DOC_IDS.map((doc) => ({ doc }));
}

export const dynamicParams = false;

function resolve(doc: string) {
  return LEGAL_DOC_IDS.includes(doc as LegalDocId) ? LEGAL_DOCS[doc as LegalDocId] : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { doc } = await params;
  const content = resolve(doc);
  if (!content) return {};
  return {
    title: content.title,
    description: content.intro.slice(0, 155),
    alternates: { canonical: `/legal/${doc}` },
  };
}

export default async function LegalPage({ params }: { params: Promise<Params> }) {
  const { doc } = await params;
  const content = resolve(doc);
  if (!content) notFound();

  return (
    <>
      <PageHero eyebrow="Legal" title={content.title} intro={content.intro} />

      <Section>
        <Container className="flex flex-col gap-12">
          {content.draft ? (
            <Reveal>
              <div className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10 p-5">
                <AlertTriangle
                  aria-hidden
                  className="mt-0.5 size-5 shrink-0 text-[var(--color-warning)]"
                />
                <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  <span className="font-medium text-[var(--color-fg)]">
                    This is a plain-language summary, not a counsel-reviewed document.
                  </span>{' '}
                  It describes how we intend to operate and is published so you can see our position
                  before a contract exists. The binding document is the agreement you sign. We would
                  rather flag this than let a summary be mistaken for a legal instrument.
                </p>
              </div>
            </Reveal>
          ) : null}

          {content.sections.map((section) => (
            <Reveal key={section.heading} className="flex flex-col gap-3">
              <h2 className="text-h2">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-[var(--color-fg-muted)]">
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="mt-1 flex list-disc flex-col gap-1.5 pl-5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="leading-relaxed text-[var(--color-fg-muted)]">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          ))}
        </Container>
      </Section>
    </>
  );
}
