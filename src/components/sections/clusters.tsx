import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { ClusterSwitcher } from '@/components/interactive/cluster-switcher';

/** §7 Module clusters — beat 6 (depth). */
export function Clusters() {
  return (
    <Section id="overview">
      <Container width="wide" className="flex flex-col gap-14">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>Behind each link</Eyebrow>
          <h2 className="text-display-2 max-w-[min(24ch,100%)]">
            Each step in that chain is a full product, not a tab.
          </h2>
          <p className="text-body-lg max-w-[min(58ch,100%)] text-[var(--color-fg-muted)]">
            The chain only works if every link is genuinely good on its own. Pick a cluster to see the
            modules it contains and where it connects to the rest.
          </p>
        </Reveal>

        <Reveal>
          <ClusterSwitcher />
        </Reveal>
      </Container>
    </Section>
  );
}
