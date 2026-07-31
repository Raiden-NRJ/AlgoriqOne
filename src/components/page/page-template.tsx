/**
 * The shared page template (docs/05 §1).
 *
 * Every page below the homepage uses this one composition. Consistency is the
 * point: a visitor who reads two of them should feel the same hand, and we
 * should be able to add a twelfth page without a design cycle.
 */

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import {
  Button,
  Container,
  Eyebrow,
  Section,
  cn,
} from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/* ─────────────────────────────── Types ───────────────────────────────── */

export interface PageBlock {
  /** Stable anchor id, used by the rail. */
  id: string;
  title: string;
  body?: string;
  bullets?: string[];
  /** Optional side panel: a labelled list, e.g. real permission keys. */
  panel?: { label: string; items: string[]; mono?: boolean };
  /** An ordered chain rendered as a connected sequence. */
  chain?: string[];
}

/** The five stages of the homepage chain (docs/01 §8). */
export const CHAIN_STAGES = ['Deal', 'Project', 'Plan', 'Time', 'Invoice'] as const;
export type ChainStage = (typeof CHAIN_STAGES)[number];

export interface PageContent {
  eyebrow: string;
  title: string;
  intro: string;
  /**
   * Where this page sits in the deal → delivery → cash chain. Present on every
   * page that is part of, or supports, the chain — so a visitor who arrived
   * from search rather than the homepage still gets the story.
   */
  chain?: { active?: ChainStage[]; note: string };
  /** Three jobs-to-be-done. What this page is responsible for in a real week. */
  jobs?: string[];
  blocks: PageBlock[];
  /** Cross-links at the foot of the page. */
  related?: { label: string; href: string; description?: string }[];
  /** Optional honest scope note — what is live vs. what is next. */
  scopeNote?: string;
}

/* ─────────────────────────────── Hero ────────────────────────────────── */

/**
 * Shows where this page sits in the deal → delivery → cash chain.
 *
 * It exists because most visitors arrive on a deep page from search, not from
 * the homepage — so the positioning has to be re-established here rather than
 * assumed. Links back to the homepage chain section.
 */
function ChainStrip({ active, note }: NonNullable<PageContent['chain']>) {
  const activeSet = new Set(active ?? []);

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
      <p className="text-label text-[var(--color-fg-subtle)]">
        <Link href="/#chain" className="underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-fg-muted)]">
          Deal → delivery → cash
        </Link>
      </p>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {CHAIN_STAGES.map((stage, index) => (
          <li key={stage} className="flex items-center gap-1.5">
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium',
                activeSet.has(stage)
                  ? 'bg-[var(--color-brand-600)] text-white'
                  : 'bg-[var(--color-bg-subtle)] text-[var(--color-fg-subtle)]',
              )}
            >
              {stage}
            </span>
            {index < CHAIN_STAGES.length - 1 ? (
              <ArrowRight aria-hidden className="size-3 text-[var(--color-fg-subtle)]" />
            ) : null}
          </li>
        ))}
      </ol>
      <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{note}</p>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  jobs,
  chain,
}: Pick<PageContent, 'eyebrow' | 'title' | 'intro' | 'jobs' | 'chain'>) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-aurora">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid" />
      <Container width="wide" className="relative">
        <div className="flex flex-col gap-8 py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col gap-6">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="text-display-2 max-w-[min(20ch,100%)]">{title}</h1>
            <p className="text-body-lg max-w-[min(62ch,100%)] text-[var(--color-fg-muted)]">{intro}</p>
          </div>

          {chain ? (
            <div className="max-w-[46rem]">
              <ChainStrip {...chain} />
            </div>
          ) : null}

          {jobs?.length ? (
            <ul className="grid gap-3 sm:grid-cols-3">
              {jobs.map((job) => (
                <li
                  key={job}
                  className="flex items-start gap-2.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-relaxed"
                >
                  <Check
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-600)]"
                  />
                  <span className="text-[var(--color-fg-muted)]">{job}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button href="/signup">
              Start free
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button href="/company/contact" variant="secondary">
              Talk to us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────────────── Anchor rail ───────────────────────────── */

function AnchorRail({ blocks }: { blocks: PageBlock[] }) {
  return (
    <nav aria-label="On this page" className="hidden xl:block">
      <div className="sticky top-28 flex flex-col gap-2 border-l border-[var(--color-border)] pl-5">
        <p className="text-label text-[var(--color-fg-subtle)]">On this page</p>
        <ul className="flex flex-col gap-1.5">
          {blocks.map((block) => (
            <li key={block.id}>
              <a
                href={`#${block.id}`}
                className="block text-sm leading-snug text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
              >
                {block.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/* ─────────────────────────────── Blocks ──────────────────────────────── */

function Block({ block, index }: { block: PageBlock; index: number }) {
  const flip = index % 2 === 1;

  return (
    <Reveal
      as="section"
      className={cn(
        'scroll-mt-28 border-t border-[var(--color-border)] py-12 first:border-t-0 first:pt-0 lg:py-16',
      )}
    >
      <div id={block.id} className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:gap-14">
        <div className={cn('flex flex-col gap-5', flip && 'lg:order-2')}>
          <h2 className="text-h2">{block.title}</h2>
          {block.body ? (
            <p className="max-w-[min(62ch,100%)] leading-relaxed text-[var(--color-fg-muted)]">{block.body}</p>
          ) : null}

          {block.bullets?.length ? (
            <ul className="flex flex-col gap-2.5">
              {block.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <Check
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-600)]"
                  />
                  <span className="text-[var(--color-fg-muted)]">{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {block.panel || block.chain ? (
          <div className={cn('flex flex-col gap-4', flip && 'lg:order-1')}>
            {block.chain ? <Chain steps={block.chain} /> : null}
            {block.panel ? <Panel {...block.panel} /> : null}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

function Chain({ steps }: { steps: string[] }) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e1)]">
      <p className="text-label mb-4 text-[var(--color-fg-subtle)]">End to end</p>
      <ol className="flex flex-col">
        {steps.map((step, i) => (
          <li key={step} className="flex items-start gap-3">
            <span className="flex flex-col items-center self-stretch">
              <span
                aria-hidden
                className={cn(
                  'mt-1.5 size-2.5 shrink-0 rounded-full',
                  i === steps.length - 1
                    ? 'bg-[var(--color-brand-600)]'
                    : 'bg-[var(--color-brand-300)]',
                )}
              />
              {i < steps.length - 1 ? (
                <span aria-hidden className="w-px flex-1 bg-[var(--color-border-strong)]" />
              ) : null}
            </span>
            <span className="pb-4 text-sm font-medium">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Panel({ label, items, mono }: { label: string; items: string[]; mono?: boolean }) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
      <p className="text-label mb-4 text-[var(--color-fg-subtle)]">{label}</p>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              'rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs',
              mono
                ? 'font-mono text-xs text-[var(--color-fg-muted)]'
                : 'font-medium text-[var(--color-fg-muted)]',
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────── Related ─────────────────────────────── */

export function RelatedLinks({
  links,
}: {
  links: NonNullable<PageContent['related']>;
}) {
  return (
    <Section tone="subtle">
      <Container width="wide" className="flex flex-col gap-8">
        <h2 className="text-h2">Related</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col gap-1.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-e2)]"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-medium">{link.label}</span>
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--color-brand-600)]"
                  />
                </span>
                {link.description ? (
                  <span className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {link.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/* ─────────────────────────────── CTA band ────────────────────────────── */

export function CtaBand({
  title = 'See it on your own data.',
  body = 'Spin up a workspace in minutes, or talk to us about migrating from what you run today.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)] bg-aurora">
      <Container className="relative">
        <div className="flex flex-col items-center gap-6 py-20 text-center sm:py-24">
          <h2 className="text-display-2 max-w-[min(20ch,100%)]">{title}</h2>
          <p className="max-w-[min(48ch,100%)] text-[var(--color-fg-muted)]">{body}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="/signup" size="lg">
              Start free
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button href="/company/contact" variant="secondary" size="lg">
              Talk to us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ──────────────────────────── The template ───────────────────────────── */

export function DetailPage({ content }: { content: PageContent }) {
  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        intro={content.intro}
        jobs={content.jobs}
        chain={content.chain}
      />

      <Section>
        <Container width="wide">
          <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_15rem] xl:gap-16">
            <div className="min-w-0">
              {content.blocks.map((block, i) => (
                <Block key={block.id} block={block} index={i} />
              ))}

              {content.scopeNote ? (
                <Reveal className="mt-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                  <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    <span className="font-medium text-[var(--color-fg)]">Where this stands. </span>
                    {content.scopeNote}
                  </p>
                </Reveal>
              ) : null}
            </div>

            <AnchorRail blocks={content.blocks} />
          </div>
        </Container>
      </Section>

      {content.related?.length ? <RelatedLinks links={content.related} /> : null}
      <CtaBand />
    </>
  );
}
