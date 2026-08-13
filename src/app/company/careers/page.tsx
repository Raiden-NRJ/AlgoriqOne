import type { Metadata } from 'next';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { CONTACT } from '@/content/site';
import { BulletList, Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'No open roles listed right now. What working here looks like, and how to reach us anyway if you think you should.',
  alternates: { canonical: '/company/careers' },
};

/**
 * No invented job listings. An empty careers page that says so is worth more
 * than four fake postings, and a candidate who emails anyway is exactly the
 * candidate worth talking to.
 */
export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="No open roles listed today."
        intro="We would rather say that plainly than pad this page with postings we are not actively hiring for. If you read the architecture page and thought “I would like to work on that”, the last section here is for you."
      />

      <Section>
        {/* Default width, not wide. This section is two 68ch/62ch prose blocks
            and a mailto — a 90rem field around a 68ch column left the headings
            floating with nothing on the right to balance them (audit A6). */}
        <Container className="flex flex-col gap-12">
          <Reveal className="flex flex-col gap-5">
            <h2 className="text-h2">What the work is actually like</h2>
            <p className="max-w-[min(52ch,100%)] leading-relaxed text-[var(--color-fg-muted)]">
              How a small team keeps a large surface honest.
            </p>
            <BulletList
              items={[
                'Thirty services, four applications, one design system',
                'No module ships until it sits on the shared authorization engine',
                'Accessibility checks fail the build',
                'Contrast verified by script, not by eye',
                'Permission keys validated in continuous integration',
              ]}
            />
          </Reveal>

          <Reveal className="flex flex-col gap-5">
            <h2 className="text-h2">Reach out anyway</h2>
            <BulletList
              items={[
                'Send something you have built',
                'Tell us what you would want to work on here',
                'We read all of it, and we reply — including when the answer is no',
              ]}
            />

            <p>
              <a
                href={`mailto:${CONTACT.careers}`}
                className="font-medium text-[var(--color-brand-700)] underline decoration-[var(--color-brand-300)] underline-offset-4"
              >
                {CONTACT.careers}
              </a>
            </p>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title="Curious what you would be working on?"
        body="The architecture page is the most honest description of this codebase we have written."
      />
    </>
  );
}
