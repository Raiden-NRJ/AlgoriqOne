import { ArrowRight, ArrowDown } from 'lucide-react';
import { chain } from '@/content/homepage';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import Image from 'next/image';
import { CHAIN_PHOTOS, ChainCurrent } from '@/components/diagrams/chain-steps';

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
    <Section id="chain" tone="tint" size="lg" className="relative overflow-hidden">
      {/* The current runs behind the cards, edge to edge. Sits under the whole
          section, not inside the Container, so it can leave the viewport. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-64 -translate-y-8 xl:block"
      >
        <ChainCurrent />
      </div>

      <Container width="wide" className="relative flex flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>{chain.eyebrow}</Eyebrow>
          <h2 className="text-display-2 max-w-[min(24ch,100%)]">{chain.headline}</h2>
          <p className="text-body-lg max-w-[min(62ch,100%)] text-[var(--color-fg-muted)]">
            {chain.sub}
          </p>
        </Reveal>

        <Reveal>
          <ol className="flex flex-col gap-2 xl:flex-row xl:items-stretch xl:gap-0">
            {chain.links.map((link, index) => {
              const photo = CHAIN_PHOTOS[link.stage];

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
                      Photographic thumbnail, replacing the flat line plate
                      (2026-08-11). Deliberately small and square rather than a
                      full-bleed illustration:

                      - `mt-auto` still pins it to a common baseline across the
                        five cards, which is what stopped a wrapped two-word
                        module tag dragging one graphic out of line with its
                        neighbours. That was the original reason for the fixed
                        ratio and it still applies.
                      - A square at 88px keeps the card the same shape at every
                        breakpoint. The old plate was `aspect-[10/7] w-full`,
                        which at full container width below xl rendered ~650px
                        tall — the reason it needed a `max-w-64` clamp. A fixed
                        square has no such failure mode.
                      - `object-cover` on a fixed box: these are 880px squares,
                        so they downscale rather than stretch.
                    */}
                    {/* Guarded like the plate it replaced: the map is keyed by
                        a content string, so a renamed stage yields undefined
                        rather than a crash. */}
                    <div className="mt-auto pt-1">
                      {photo ? (
                        <Image
                          src={photo}
                          // Empty by design — the <h3> above names the stage, so
                          // a description would announce it twice. See CHAIN_PHOTOS.
                          alt=""
                          width={88}
                          height={88}
                          sizes="88px"
                          className="size-22 rounded-[var(--radius-lg)] border border-[var(--color-border)] object-cover"
                        />
                      ) : null}
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
                        {/* Already inside an aria-hidden wrapper; marked
                            individually too so the intent survives a refactor
                            that moves them out of it. */}
                        <ArrowDown aria-hidden className="size-4 xl:hidden" />
                        <ArrowRight aria-hidden className="hidden size-4 xl:block" />
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

        {/*
          No illustration here. `public/illustrations/home.jpg` was placed under
          this grid on 2026-08-10 and removed the same day: it draws the same
          five stages — Deal, Project, Plan, Time, Invoice — immediately below
          the cards that already draw them, so the section stated its one idea
          twice in a row.

          The grid above is the better artefact and is not replaceable by a
          picture of itself: it carries the real service names, the per-stage
          plates, the connectors, and it is live DOM that reflows into a column
          on narrow screens. The image is a flat 1376×768 render of the same
          concept. The file is kept in the repo for a future non-duplicate use;
          it just has no home on this page.
        */}
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
