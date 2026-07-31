import type { Metadata } from 'next';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { Container, Section } from '@/components/site/primitives';
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
        <Container width="wide" className="flex flex-col gap-14">
          <Reveal className="flex flex-col gap-5">
            <h2 className="text-h2">What the work is actually like</h2>
            <div className="flex max-w-[min(68ch,100%)] flex-col gap-4 leading-relaxed text-[var(--color-fg-muted)]">
              <p>
                Thirty services, four applications, one design system, and a rule that no module
                ships until it sits on the shared authorization engine. That constraint is the job:
                it makes shortcuts visible and it makes the platform coherent.
              </p>
              <p>
                Accessibility checks fail the build. Contrast is verified by script. Permission keys
                are validated in continuous integration. None of that is decoration — it is how a
                small team keeps a large surface honest.
              </p>
            </div>
          </Reveal>

          <Reveal className="flex flex-col gap-5">
            <h2 className="text-h2">Reach out anyway</h2>
            <p className="max-w-[min(62ch,100%)] leading-relaxed text-[var(--color-fg-muted)]">
              Send something you have built and what you would want to work on here. We read all of
              it, and we reply — including when the answer is no.
            </p>
            <p>
              <a
                href="mailto:careers@rocketcrm.app"
                className="font-medium text-[var(--color-brand-700)] underline decoration-[var(--color-brand-300)] underline-offset-4"
              >
                careers@rocketcrm.app
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
