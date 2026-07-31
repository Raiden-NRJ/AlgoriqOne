import { problem } from '@/content/homepage';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { ThreeSystemsDiagram } from '@/components/diagrams/three-systems';

/**
 * §3 The problem — beats 2 and 3 (the cost, and why it stayed broken).
 * One idea: disconnected systems cost you a reconciliation tax, and
 * integrations don't fix it.
 */
export function Problem() {
  return (
    <Section tone="subtle">
      <Container width="wide" className="flex flex-col gap-14">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>{problem.eyebrow}</Eyebrow>
          <h2 className="text-display-2 max-w-[min(26ch,100%)]">{problem.headline}</h2>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-center">
          <ul className="flex flex-col gap-4">
            {problem.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 60}>
                <div className="flex gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <span
                    aria-hidden
                    className="mt-1 h-full w-0.5 shrink-0 rounded-full bg-[var(--color-danger)]/35"
                  />
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <ThreeSystemsDiagram />
          </Reveal>
        </div>

        <Reveal className="mx-auto max-w-[min(62ch,100%)] text-center">
          <p className="text-body-lg text-[var(--color-fg-muted)]">{problem.conclusion}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
