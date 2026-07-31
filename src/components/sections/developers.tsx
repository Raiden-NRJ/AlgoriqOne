import { ArrowRight } from 'lucide-react';
import { developers } from '@/content/homepage';
import { Container, Section, SectionHeading, TextLink } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/**
 * §12 Integrations & API — beat 7. One idea: open by default.
 *
 * The "logos" here are standards we implement, not partner marks — labelled as
 * such, because a wall of borrowed logos implying partnerships we don't have is
 * the same lie as a fake customer wall.
 */
export function Developers() {
  return (
    <Section tone="subtle">
      <Container width="wide" className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-16">
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

function CodeSample() {
  return (
    <div className="min-w-0 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-band-border)] bg-[var(--color-band)] shadow-[var(--shadow-e3)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-band-border)] px-4 py-2.5">
        <span className="rounded-[var(--radius-sm)] bg-[var(--color-band-surface)] px-2.5 py-1 text-xs font-medium text-[var(--color-band-fg)]">
          TypeScript SDK
        </span>
        <span className="px-2.5 py-1 text-xs text-[var(--color-band-fg-muted)]">cURL</span>
        <span className="px-2.5 py-1 text-xs text-[var(--color-band-fg-muted)]">
          Webhook
        </span>
      </div>

      <pre
        tabIndex={0}
        role="region"
        aria-label="Code sample, scrollable"
        className="overflow-x-auto p-5 font-mono text-[0.8125rem] leading-relaxed text-[var(--color-band-fg-muted)]"
      >
        <code>
          {`import { AlgoryqOne } from '@algoryq/one-sdk';

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
});`}
        </code>
      </pre>
    </div>
  );
}
