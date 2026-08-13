import type { Metadata } from 'next';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { BulletList, Container, Section } from '@/components/site/primitives';
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
        intro="Most vendor ROI calculators are a lead-capture form with arithmetic attached. This one shows its formula, defaults pessimistic, and answers before it asks anything."
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
              {/* The closing sentence — "It is arithmetic you can check, not a
                  model with a coefficient we chose." — was cut (audit B8, item
                  3). The formula and the 40% discount are stated in full right
                  here, so it restated the sentence before it. */}
              <BulletList
                items={[
                  'Licence overlap only',
                  'Per-seat cost of the tools you would stop paying for',
                  'Minus one platform',
                  'Discounted 40%, because consolidation is never total',
                ]}
              />
            </div>

            <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="text-lg font-semibold">What this deliberately ignores</h2>
              <BulletList
                items={[
                  'Monthly reconciliation time — usually larger, but yours to value',
                  'Integration build and maintenance cost',
                  'The cost of a permission that should have been revoked',
                  'Implementation effort on our side of the ledger',
                ]}
              />
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
