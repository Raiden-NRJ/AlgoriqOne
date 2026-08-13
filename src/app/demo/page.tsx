import type { Metadata } from 'next';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { BulletList, Container, SampleDataNote, Section } from '@/components/site/primitives';
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
        // "Both are below, both are interactive, and" was cut (audit B8, item
        // 4): navigational throat-clearing for two sections the visitor is
        // already scrolling towards. The no-email point is kept once here; it
        // is the page's actual differentiator.
        intro="Two of the most useful things to understand about this platform are how the modules connect and how permissions actually work. Neither asks for your email address first."
        jobs={[
          'Explore the six clusters and the chain between them',
          'Switch roles and watch the interface change',
          'Start a real workspace when you have seen enough',
        ]}
      />

      <Section>
        <Container width="wide" className="flex flex-col gap-12">
          <Reveal className="flex flex-col gap-3">
            <h2 className="text-h2">The modules, and how they connect</h2>
            <p className="max-w-[min(52ch,100%)] text-[var(--color-fg-muted)]">
              Pick a cluster. The chain on the right is the route a real record travels — each hop a
              database relationship, not an integration.
            </p>
          </Reveal>
          <Reveal>
            <ClusterSwitcher />
          </Reveal>
        </Container>
      </Section>

      <Section tone="band">
        <Container width="wide" className="flex flex-col gap-12">
          <Reveal className="flex flex-col gap-3">
            <h2 className="text-h2">Permissions, live</h2>
            <p className="max-w-[min(52ch,100%)] text-[var(--color-band-fg-muted)]">
              Select a role and watch the navigation change.
            </p>
            <BulletList
              tone="band"
              items={[
                'Real keys from the platform’s permission catalog',
                'Hidden items are refused at the API too',
                'A direct call returns 403, not data',
              ]}
            />
          </Reveal>
          <Reveal>
            <PermissionMatrix />
          </Reveal>
        </Container>
      </Section>

      <Section>
        {/* Default width: the two sections above are legitimately wide (cluster
            switcher, permission matrix); this closing note inherited `wide` by
            copy-paste and is a single 68ch paragraph (audit A6). */}
        <Container className="flex flex-col gap-12">
          {/*
            One block, not three siblings — so the container gap is inert here
            and the h2/prose/note cluster keeps its own tight rhythm. This also
            gives the section the Reveal the other two on this page already had
            (docs/spacing-content-audit.md A5).
          */}
          <Reveal className="flex flex-col gap-3">
            <h2 className="text-h2">What this demo is not</h2>
            <BulletList
              items={[
                'Fixture data — it does not call the platform',
                'An honest picture of the model and the interaction design',
                'Not a substitute for a workspace with your own records in it',
                'A real one takes minutes, and costs nothing for fourteen days',
              ]}
            />
            <SampleDataNote />
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title="Seen enough?"
        body="Create a workspace and put your own data in it. No card, and an export path if you change your mind."
      />
    </>
  );
}
