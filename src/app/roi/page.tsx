import type { Metadata } from 'next';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { RoiTeaser } from '@/components/interactive/roi-teaser';

export const metadata: Metadata = {
  title: 'ROI calculator',
  description:
    'Estimate the licence overlap you would remove by consolidating. Every assumption is editable, the formula is shown, and no email is required.',
  alternates: { canonical: '/roi' },
};

export default function RoiPage() {
  return (
    <>
      <PageHero
        eyebrow="ROI"
        title="Run the consolidation maths on your own numbers."
        intro="Most vendor ROI calculators are a lead-capture form with arithmetic attached. This one shows its formula, defaults to the pessimistic end of every range, and does not ask for your email before it gives you the answer."
        jobs={[
          'Enter your own figures, not our assumptions',
          'See the formula, and argue with it',
          'Get the number without handing over an email address',
        ]}
      />

      <Section>
        <Container width="wide" className="flex flex-col gap-12">
          <Reveal>
            <RoiTeaser />
          </Reveal>

          <Reveal className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="text-lg font-semibold">What this counts</h2>
              <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                Only licence overlap: the per-seat cost of the tools you would stop paying for, minus
                one platform, discounted by 40% because consolidation is never total. It is
                arithmetic you can check, not a model with a coefficient we chose.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="text-lg font-semibold">What this deliberately ignores</h2>
              <ul className="flex flex-col gap-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                <li>
                  Time spent reconciling systems each month — usually the larger number, but it is
                  yours to value, not ours to assume.
                </li>
                <li>Integration build and maintenance cost.</li>
                <li>The cost of a permission that should have been revoked and was not.</li>
                <li>Implementation effort on our side of the ledger, which is a real cost too.</li>
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <p className="mx-auto max-w-[min(68ch,100%)] text-center text-sm leading-relaxed text-[var(--color-fg-subtle)]">
              We do not publish an industry-average return figure, because we do not have the
              customer base to support one. When we do, it will appear here with the sample size
              printed next to it.
            </p>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title="Want this checked against your actual stack?"
        body="Send us the tools you run and the team shape. We will tell you where consolidation helps and where it honestly does not."
      />
    </>
  );
}
