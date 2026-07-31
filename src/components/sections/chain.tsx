import { ArrowRight, ArrowDown, CornerDownRight } from 'lucide-react';
import { chain } from '@/content/homepage';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/**
 * §3 The chain — the centrepiece of the site (docs/01 §8, beat 1).
 *
 * One idea: a services business runs deal → project → plan → time → invoice,
 * and here that whole sequence is one record rather than four systems.
 *
 * Layout note: the "what survives the handoff" label lives *inside the
 * receiving card* rather than on the connector. Putting it on the connector
 * needed ~152px per gap, which left roughly 64px per card at 1024px and
 * overflowed the container. Inside the card it also reads better — each step
 * states what it was handed, which is exactly the thing a stitched stack makes
 * somebody re-type.
 *
 * Server-rendered, no client JavaScript. Below xl the row becomes a column and
 * the arrows rotate; the sequence reads the same either way.
 */
export function Chain() {
  return (
    <Section id="chain" tone="subtle">
      <Container width="wide" className="flex flex-col gap-14">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>{chain.eyebrow}</Eyebrow>
          <h2 className="text-display-2 max-w-[min(24ch,100%)]">{chain.headline}</h2>
          <p className="text-body-lg max-w-[min(62ch,100%)] text-[var(--color-fg-muted)]">{chain.sub}</p>
        </Reveal>

        <Reveal>
          <ol className="flex flex-col gap-2 xl:flex-row xl:items-stretch xl:gap-0">
            {chain.links.map((link, index) => {
              const previous = index > 0 ? chain.links[index - 1] : null;

              return (
                <li
                  key={link.stage}
                  className="flex flex-col xl:min-w-0 xl:flex-1 xl:flex-row xl:items-stretch"
                >
                  <article className="flex flex-1 flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-e1)]">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-label text-[var(--color-fg-subtle)]">
                        Step {index + 1}
                      </span>
                      <span className="rounded-full bg-[var(--color-brand-50)] px-2 py-0.5 text-xs font-medium text-[var(--color-brand-800)]">
                        {link.module}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold">{link.stage}</h3>

                    {/* What arrived from the previous step — the argument. */}
                    <p className="flex items-start gap-1.5 text-xs leading-tight text-[var(--color-fg-subtle)]">
                      <CornerDownRight
                        aria-hidden
                        className="mt-px size-3 shrink-0 text-[var(--color-brand-400)]"
                      />
                      <span>
                        {previous ? (
                          <>
                            Arrives with{' '}
                            <span className="text-[var(--color-fg-muted)]">
                              {previous.carries.toLowerCase()}
                            </span>
                          </>
                        ) : (
                          'Where the chain starts'
                        )}
                      </span>
                    </p>

                    <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                      {link.detail}
                    </p>

                    <code className="mt-auto pt-2 font-mono text-xs break-words text-[var(--color-fg-subtle)]">
                      {link.service}
                    </code>
                  </article>

                  {/* Connector: an icon only, so cards keep their width. */}
                  {index < chain.links.length - 1 ? (
                    <div
                      aria-hidden
                      className="flex shrink-0 items-center justify-center py-1 xl:px-2 xl:py-0"
                    >
                      <ArrowDown className="size-4 text-[var(--color-brand-400)] xl:hidden" />
                      <ArrowRight className="hidden size-4 text-[var(--color-brand-400)] xl:block" />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </Reveal>

        <Reveal className="mx-auto max-w-[min(64ch,100%)] text-center">
          <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{chain.footnote}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
