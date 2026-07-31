import type { Metadata } from 'next';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { Container, SampleDataNote, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { ClusterSwitcher } from '@/components/interactive/cluster-switcher';
import { PermissionMatrix } from '@/components/interactive/permission-matrix';

export const metadata: Metadata = {
  title: 'Interactive demo — no email required',
  description:
    'Click through the platform: the module clusters, the chain that connects them, and a live permission model showing exactly what each role can see.',
  alternates: { canonical: '/demo' },
};

/**
 * The self-serve alternative to a sales call (docs/08 §3.3).
 *
 * No email gate, no form before the value. Everything on this page runs on
 * fixture data from the Algoryq One Demo tenant and says so.
 */
export default function DemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Interactive demo"
        title="Look around before you talk to anyone."
        intro="Two of the most useful things to understand about this platform are how the modules connect and how permissions actually work. Both are below, both are interactive, and neither asks for your email address first."
        jobs={[
          'Explore the six clusters and the chain between them',
          'Switch roles and watch the interface change',
          'Start a real workspace when you have seen enough',
        ]}
      />

      <Section>
        <Container width="wide" className="flex flex-col gap-8">
          <Reveal className="flex flex-col gap-3">
            <h2 className="text-h2">The modules, and how they connect</h2>
            <p className="max-w-[min(62ch,100%)] text-[var(--color-fg-muted)]">
              Pick a cluster. The chain on the right is the sequence a real record travels — and each
              hop is a database relationship, not an integration.
            </p>
          </Reveal>
          <Reveal>
            <ClusterSwitcher />
          </Reveal>
        </Container>
      </Section>

      <Section tone="band">
        <Container width="wide" className="flex flex-col gap-8">
          <Reveal className="flex flex-col gap-3">
            <h2 className="text-h2">Permissions, live</h2>
            <p className="max-w-[min(62ch,100%)] text-[var(--color-band-fg-muted)]">
              Select a role and watch the navigation change. Those keys are real keys from the
              platform’s catalog, and the hidden items are refused at the API too — a direct call
              returns 403, not data.
            </p>
          </Reveal>
          <Reveal>
            <PermissionMatrix />
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container width="wide" className="flex flex-col gap-4">
          <h2 className="text-h2">What this demo is not</h2>
          <p className="max-w-[min(68ch,100%)] leading-relaxed text-[var(--color-fg-muted)]">
            It runs on fixture data and does not call the platform. It shows the model and the
            interaction design honestly, but it is not a substitute for a real workspace with your
            own records in it — which takes minutes to create and costs nothing for fourteen days.
          </p>
          <SampleDataNote />
        </Container>
      </Section>

      <CtaBand
        title="Seen enough?"
        body="Create a workspace and put your own data in it. No card, and an export path if you change your mind."
      />
    </>
  );
}
