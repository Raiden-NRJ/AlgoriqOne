import { ArrowRight } from 'lucide-react';
import { developers } from '@/content/homepage';
import { Container, Section, SectionHeading, TextLink } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/**
 * §8 Integrations & API — beat 7. One idea: open by default.
 *
 * The "logos" here are standards we implement, not partner marks — labelled as
 * such, because a wall of borrowed logos implying partnerships we don't have is
 * the same lie as a fake customer wall.
 *
 * Keeps TerminalVideo. The unused `CodeScan` import was removed 2026-08-10 —
 * the island stopped being rendered when the video replaced the inline <pre>,
 * but the import stayed behind. `TerminalVideo` still takes `fallbackCode`, so
 * the sample text below is what reduced-motion users and no-video browsers get.
 */
export function Developers() {
  return (
    <Section tone="subtle">
      <Container width="wide" className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-16">
        <Reveal className="flex flex-col gap-6">
          <SectionHeading
            eyebrow={developers.eyebrow}
            title={developers.headline}
            description={developers.sub}
          />

          <div className="flex flex-col gap-3">
            <ul className="flex flex-wrap gap-1.5">
              {developers.standards.map((standard) => (
                <li
                  key={standard}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs font-medium text-[var(--color-fg-muted)]"
                >
                  {standard}
                </li>
              ))}
            </ul>
            <p className="text-xs text-[var(--color-fg-subtle)]">{developers.standardsNote}</p>
          </div>

          <p className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            <span className="font-medium text-[var(--color-fg)]">Portability. </span>
            {developers.portability}
          </p>

          <TextLink href="/developers">
            Explore the developer platform
            <ArrowRight className="size-4" aria-hidden />
          </TextLink>
        </Reveal>

        {/*
          min-w-0 is load-bearing. Grid and flex items default to
          min-width: auto, so the <pre> below contributes its full unwrapped
          min-content width to the column — which pushed the whole grid to
          499px and put the page into horizontal scroll from 320px to 480px.
          overflow-x-auto alone does not reduce min-content; min-w-0 does.
        */}
        <Reveal delay={70} className="min-w-0">
          <CodeSample />
        </Reveal>
      </Container>
    </Section>
  );
}

/**
 * The sample, verbatim. Lifted out of the JSX unchanged so it can be handed to
 * the CodeScan island as a single string — every character, including the blank
 * lines, is the same text that was inline here before.
 */
const SAMPLE = `import { AlgoryqOne } from '@algoryq/one-sdk';

const one = new AlgoryqOne({ apiKey: process.env.ALGORYQ_ONE_KEY });

// Every call is permission-checked server-side.
const { data } = await one.crm.leads.list({
  status: 'qualified',
  pageSize: 50,
});

await one.webhooks.create({
  event: 'sales.deal.won',
  url: 'https://example.com/hooks/deal-won',
  // Deliveries are HMAC-signed and retried.
});`;

import { TerminalVideo } from '@/components/interactive/terminal-video';

function CodeSample() {
  return <TerminalVideo fallbackCode={SAMPLE} />;
}
