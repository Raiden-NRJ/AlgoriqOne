import { ArrowRight } from 'lucide-react';
import { developers } from '@/content/homepage';
import { Container, Section, SectionHeading, TextLink } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { STAGGER_CAP, STAGGER_TIGHT } from '@/components/site/motion';

/**
 * §8 Integrations & API — beat 7. One idea: open by default.
 *
 * The "logos" here are standards we implement, not partner marks — labelled as
 * such, because a wall of borrowed logos implying partnerships we don't have is
 * the same lie as a fake customer wall.
 *
 * The code panel went inline <pre> → video (2026-08-09) → back to DOM
 * (2026-09-02), and the round trip is the point: P6's redlines are about rows,
 * and an mp4 has none. See CodeSample below for what building it as markup
 * fixed beyond the animation.
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
        <Reveal delay={STAGGER_TIGHT} className="min-w-0">
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

/**
 * P6's composition, built as DOM (2026-09-02).
 *
 * Was `TerminalVideo` — an mp4 of code being typed. The deck's redlines are
 * CHROME rise 320ms · ROWS 220ms · 180ms apart, and none of them could be
 * applied to pixels: there were no rows to stagger. Building the panel as
 * markup makes all of it addressable, and fixes three other things at once:
 *
 *  1. **The video typed the wrong environment variable.** It rendered
 *     `process.env.ALGORYQ_ONE_ONE_KEY`; the real key, and the one in SAMPLE
 *     below, is `ALGORYQ_ONE_KEY`. A wrong env var in the developer section is
 *     copy-pasteable, which makes it worse than the cosmetic text defects in
 *     the other assets (B10/B11).
 *  2. The code is now selectable, searchable and copyable, and screen readers
 *     get it as text. An mp4 gave none of that.
 *  3. It drops a 4.1MB video off this section and the client bundle with it —
 *     this renders on the server, with no island and no framer.
 *
 * The video file stays in `public/media/`, unreferenced, exactly as GraphVideo
 * was left when §7 moved to a static image: the standing instruction is that
 * videos are not deleted from the repo, not that they must all render.
 *
 * No status line. The deck's mock closes with `invoice.created  ok 142ms`;
 * that latency is invented and nothing measures it, so it is not rendered
 * (rule 1 has no decorative exemption).
 */
function CodeSample() {
  const rows = SAMPLE.split('\n');

  return (
    <div className="min-w-0 w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-band-border)] bg-black shadow-[var(--shadow-e3)]">
      {/*
        Chrome first, per the redline. Neutral dots, matching
        site/illustration.tsx — the palette migration quarantined the semantic
        colours, so a decorative red/amber/green traffic light is the
        borrowed-semantics case that rule exists to stop. The label names the
        package the sample imports; the deck's `createInvoice.ts` is not a file
        that exists here.
      */}
      <div
        aria-hidden
        data-rise-item=""
        className="flex items-center gap-1.5 border-b border-[var(--color-band-border)] bg-[var(--color-band-surface)] px-3.5 py-2.5"
      >
        <span className="size-2.5 rounded-full bg-[var(--color-band-border)]" />
        <span className="size-2.5 rounded-full bg-[var(--color-band-border)]" />
        <span className="size-2.5 rounded-full bg-[var(--color-band-border)]" />
        <span className="ml-2 font-mono text-xs text-[var(--color-band-fg-muted)]">
          @algoryq/one-sdk
        </span>
      </div>

      {/*
        One <pre> holding one text node, so selection and copy get the whole
        sample rather than 15 fragments. The rows are <span>s inside it — they
        carry the animation without breaking the text.
      */}
      <pre
        tabIndex={0}
        role="region"
        aria-label="Code sample, scrollable"
        className="overflow-x-auto p-5 font-mono text-[0.8125rem] leading-relaxed text-[var(--color-band-fg-muted)]"
      >
        <code>
          {rows.map((line, i) => (
            <span
              key={i}
              data-code-row=""
              style={{ animationDelay: `${Math.min(i, STAGGER_CAP - 1) * 180}ms` }}
              className="block min-h-[1lh]"
            >
              {line}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
