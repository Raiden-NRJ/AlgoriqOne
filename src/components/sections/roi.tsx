import { Container, Section, SectionHeading } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { RoiTeaser } from '@/components/interactive/roi-teaser';

/** §16 ROI — beat 8. The consolidation thesis, in the visitor's own currency. */
export function Roi() {
  return (
    <Section tone="subtle">
      <Container width="wide" className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="The consolidation maths"
            title="Run it on your numbers, not ours."
            description="No email required, no hidden multipliers, and every assumption is on screen where you can argue with it."
          />
        </Reveal>

        <Reveal>
          <RoiTeaser />
        </Reveal>
      </Container>
    </Section>
  );
}
