import { ArrowRight, ArrowDown } from 'lucide-react';
import { chain } from '@/content/homepage';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { CHAIN_PLATES, ChainCurrent } from '@/components/diagrams/chain-steps';

/**
 * §3 The chain — the centrepiece of the site (docs/01 §8, beat 1).
 *
 * One idea: a services business runs deal → project → plan → time → invoice,
 * and here that whole sequence is one record rather than four systems.
 *
 * The card is deliberately terse — step, module, stage, illustration, service.
 * The per-step prose that used to sit here (`link.carries` / `link.detail`) is
 * still in content/homepage.ts and is still true; it was cut from the card
 * because five columns of body copy at 1280px is a datasheet, and §3 is the
 * keynote slide. Depth belongs on the module pages, one click away (rule 9).
 *
 * Server-rendered, no client JavaScript beyond <Reveal>. Below xl the row
 * becomes a column and the arrows rotate; the sequence reads the same.
 */
export function Chain() {
  return (
    <Section id="chain" tone="warm" className="relative overflow-hidden">
      {/* The current runs behind the cards, edge to edge. Sits under the whole
          section, not inside the Container, so it can leave the viewport. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-64 -translate-y-8 xl:block"
      >
        <ChainCurrent />
      </div>

      <Container width="wide" className="relative flex flex-col gap-14">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>{chain.eyebrow}</Eyebrow>
          <h2 className="text-display-2 max-w-[min(24ch,100%)]">{chain.headline}</h2>
          <p className="text-body-lg max-w-[min(62ch,100%)] text-[var(--color-fg-muted)]">{chain.sub}</p>
        </Reveal>

        <Reveal>
          <ol className="flex flex-col gap-2 xl:flex-row xl:items-stretch xl:gap-0">
            {chain.links.map((link, index) => {
              const Plate = CHAIN_PLATES[link.stage];

              return (
                <li
                  key={link.stage}
                  className="flex flex-col xl:min-w-0 xl:flex-1 xl:flex-row xl:items-stretch"
                >
                  <article className="flex flex-1 flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-e1)]">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-label text-[var(--color-fg-subtle)]">
                        Step {index + 1}
                      </span>
                      <span className="rounded-full bg-[var(--color-brand-50)] px-2 py-0.5 text-xs font-medium text-[var(--color-brand-800)]">
                        {link.module}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold">{link.stage}</h3>

                    {/*
                      aspect-[10/7] + mt-auto: the plates all share one viewBox,
                      so fixing the ratio here keeps the five illustrations on a
                      common baseline even though the titles above them are
                      different lengths. Without it a two-word module tag wraps
                      and drags one plate 20px out of line with its neighbours.

                      max-w-64 below xl: once the row becomes a column the card
                      is the full container, and a full-width plate at that
                      ratio is ~650px tall — five of them turned the section
                      into a 4,500px scroll on a tablet.
                    */}
                    <div className="mt-auto aspect-[10/7] w-full max-w-64 self-center xl:max-w-none">
                      {Plate ? <Plate /> : null}
                    </div>

                    {/*
                      min-h reserves two lines whether or not this one wraps.
                      "wbs-service · task-service" is the only two-line value,
                      and without the reservation it pushed that single card's
                      illustration ~16px above the other four — visible as a
                      broken baseline across the row, and only in a screenshot.
                    */}
                    <code className="pt-1 font-mono text-xs break-words text-[var(--color-fg-subtle)] xl:min-h-8">
                      {link.service}
                    </code>
                  </article>

                  {/*
                    Connector: an icon only, so cards keep their width. The slot
                    is rendered after the last card too, just empty — every li is
                    flex-1, so a card whose li has no connector to pay for is
                    ~50px wider than its neighbours. Reserving the space is what
                    keeps the five equal.
                  */}
                  <div
                    aria-hidden
                    className={
                      index < chain.links.length - 1
                        ? 'flex shrink-0 items-center justify-center py-1 xl:px-2 xl:py-0'
                        : 'hidden shrink-0 xl:block xl:px-2'
                    }
                  >
                    {index < chain.links.length - 1 ? (
                      <span className="grid size-7 place-items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-brand-600)] shadow-[var(--shadow-e1)]">
                        <ArrowDown className="size-4 xl:hidden" />
                        <ArrowRight className="hidden size-4 xl:block" />
                      </span>
                    ) : (
                      <span className="block size-7" />
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>

        <Reveal className="mx-auto flex max-w-[min(72ch,100%)] items-center gap-4">
          <span aria-hidden="true" className="hidden shrink-0 sm:block">
            <FootnoteStack />
          </span>
          <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{chain.footnote}</p>
        </Reveal>
      </Container>
    </Section>
  );
}

/** The same record-stack motif as the plates, restating what the footnote says. */
function FootnoteStack() {
  return (
    <svg
      viewBox="0 0 44 44"
      className="size-11"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="presentation"
      aria-hidden="true"
    >
      <path
        d="M9 12v20c0 3.3 5.8 6 13 6s13-2.7 13-6V12Z"
        fill="var(--color-brand-100)"
        stroke="var(--color-brand-600)"
        strokeWidth={2}
      />
      <path
        d="M9 22c0 3.3 5.8 6 13 6s13-2.7 13-6"
        fill="none"
        stroke="var(--color-brand-600)"
        strokeWidth={1.7}
      />
      <ellipse
        cx="22"
        cy="12"
        rx="13"
        ry="6"
        fill="var(--color-surface)"
        stroke="var(--color-brand-600)"
        strokeWidth={2}
      />
    </svg>
  );
}
