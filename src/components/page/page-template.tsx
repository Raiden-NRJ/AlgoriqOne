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
  BulletList,
  Button,
  Container,
  Eyebrow,
  Section,
  cn,
} from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { stagger } from '@/components/site/motion';
import { Illustration } from '@/components/site/illustration';
import { HeroPhoto } from '@/components/site/hero-photo';

/* ─────────────────────────────── Types ───────────────────────────────── */

export interface PageBlock {
  /** Stable anchor id, used by the rail. */
  id: string;
  title: string;
  /**
   * A *lead*, not a paragraph: one short line that frames the bullets under it.
   *
   * It used to be a 30–50 word body paragraph that, on most blocks, restated
   * the bullets it sat above (content pass 2026-08-10). Anything enumerable
   * belongs in `bullets`; anything that only frames belongs here, in one line.
   * The 52ch measure below is deliberately too narrow to hold a paragraph — if
   * a lead wraps past two lines it is doing the bullets' job.
   */
  body?: string;
  bullets?: string[];
  /** Optional side panel: a labelled list, e.g. real permission keys. */
  panel?: { label: string; items: string[]; mono?: boolean };
  /** An ordered chain rendered as a connected sequence. */
  chain?: string[];
  /**
   * Subsection illustration, rendered in the side column above any panel or
   * chain. `alt` must describe *this* block's content — see Illustration.
   */
  image?: { src: string; alt: string; chrome?: boolean };
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
  /**
   * The hero photograph, right-hand column. Distinct from `PageBlock.image`:
   * that one is a product diagram inside a section, this is the page's single
   * establishing visual. See HeroPhoto for why they are different components.
   */
  image?: { src: string; alt: string };
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
      {/*
        Stagger, 2026-09-02. `as="ol"` rather than a wrapper: an ordered list
        loses its numbering semantics to an intervening <div>, and here the
        order *is* the content — Deal → Project → Plan → Time → Invoice is the
        positioning, not a layout choice.

        This is the one group on a deep page that is above the fold, so the
        <Reveal> resolves on mount through its "already on screen" path and
        never arms its own rise. The children still animate, because they key
        off `.reveal-seen` rather than `.reveal-in` — the same behaviour the
        jobs grid a few lines below has had since it was converted.
      */}
      <Reveal as="ol" className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {CHAIN_STAGES.map((stage, index) => (
          <li
            key={stage}
            data-rise-item=""
            style={{ animationDelay: `${stagger(index)}ms` }}
            className="flex items-center gap-1.5"
          >
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium',
                activeSet.has(stage)
                  ? 'bg-[var(--color-action)] text-[var(--color-fg-inverse)]'
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
      </Reveal>
      <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{note}</p>
    </div>
  );
}

/**
 * The page hero.
 *
 * ── Two columns, and what goes in which ───────────────────────────────────
 * With a photograph (2026-08-10) the hero splits: the *pitch* — eyebrow,
 * headline, intro, CTAs — sits left against the photo on the right, and the
 * ChainStrip and jobs row drop **below** the split at full width.
 *
 * That placement is the whole reason the result stays uncluttered. Both of
 * those blocks are wide, bordered, card-like objects; beside a photograph they
 * read as a second and third competing visual, and the jobs grid is
 * `sm:grid-cols-3`, which in a half-width column becomes three cramped
 * ~150px cards. Below the fold-line they are a calm secondary row and the
 * photo has only the headline for company.
 *
 * Without a photo the layout collapses to the single column it always was —
 * the grid's second track simply does not exist — so pages that never get an
 * image are untouched.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  jobs,
  chain,
  image,
}: Pick<PageContent, 'eyebrow' | 'title' | 'intro' | 'jobs' | 'chain' | 'image'>) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-aurora">
      {/*
        The grid pattern is masked away from the right-hand column when a photo
        is there, so the photograph sits on clean ground rather than on ruled
        lines. `.bg-grid` already carries a radial mask; `mask-composite:
        intersect` combines this linear one with it instead of replacing it, so
        the original top-centre falloff survives. Below lg the columns stack and
        the extra mask is dropped — the grid is behind text again at that width.
      */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 bg-grid',
          image &&
            'lg:[mask-image:radial-gradient(58rem_30rem_at_50%_0%,#000_20%,transparent_78%),linear-gradient(to_right,#000_0%,#000_42%,transparent_66%)] lg:[mask-composite:intersect]',
        )}
      />
      <Container width="wide" className="relative">
        {/* section-y, not raw py-*: PageHero and the homepage Hero are the same
            block in the design's terms and must scale together (audit A2). */}
        <div className="section-y flex flex-col gap-10">
          <div
            className={cn(
              'grid items-center',
              // 64px column gap at lg — the top of the brief's 48–64px range,
              // because the photo has a hard edge and the text does not.
              image && 'gap-10 lg:grid-cols-[1fr_minmax(0,46%)] lg:gap-16',
            )}
          >
            <div className="flex min-w-0 flex-col gap-6">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h1 className="text-display-2 max-w-[min(20ch,100%)]">{title}</h1>
              {/* 58ch, matching SectionHeading's description measure. PageHero
                  and SectionHeading are the same block in the design's terms and
                  sat at 62 and 58 — a visible mismatch once the intros were cut
                  short enough for the measure to actually bind. */}
              <p className="text-body-lg max-w-[min(58ch,100%)] text-[var(--color-fg-muted)]">
                {intro}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button href="/signup">
                  Start free
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
                <Button href="/company/contact" variant="secondary">
                  Talk to us
                </Button>
              </div>
            </div>

            {/* Order: the headline reads first on a stacked layout. */}
            {image ? <HeroPhoto src={image.src} alt={image.alt} className="lg:order-last" /> : null}
          </div>

          {chain ? (
            <div className="max-w-[46rem]">
              <ChainStrip {...chain} />
            </div>
          ) : null}

          {jobs?.length ? (
            /* One observer on the grid; the items carry their own delay. */
            <Reveal as="ul" className="grid gap-3 sm:grid-cols-3">
              {jobs.map((job, i) => (
                <li
                  key={job}
                  data-rise-item=""
                  style={{ animationDelay: `${stagger(i)}ms` }}
                  className="flex items-start gap-2.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-relaxed"
                >
                  <Check
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-[var(--color-link)]"
                  />
                  <span className="text-[var(--color-fg-muted)]">{job}</span>
                </li>
              ))}
            </Reveal>
          ) : null}
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

  // With the content pass done, a block is usually title + lead + bullets and
  // nothing in the side column. Five single-line bullets in a 7fr column is a
  // tall thin ladder with a half-empty row beside it, so those wrap into two
  // columns from sm up. Blocks that *do* carry a panel or a chain keep one
  // column — the 5fr side already balances them.
  // An illustration counts as side content: it fills the 5fr column, so the
  // bullets keep one column and the row balances the same way a panel does.
  const hasAside = Boolean(block.panel || block.chain || block.image);
  const wrapBullets = !hasAside && (block.bullets?.length ?? 0) > 3;

  /*
    Padding follows content, 2026-08-11.

    Every block used to pad 128px regardless of what was in it. Measured across
    four pages, that made dense blocks read correctly — "Pipeline and deals"
    667px of content, 16% padding — while short ones were mostly air:

      Data and API                117px content, 128px padding  = 52% padding
      How we test that it holds   162px content, 128px padding  = 44%
      API keys you control        150px content, 128px padding  = 46%
      The handoff that breaks     208px content, 128px padding  = 38%

    Only an illustration or a chain earns the full rhythm. Bullet count was
    tried as a density signal and dropped: the tallest bullets-only block
    measured 234px, so five bullets do not make a block that needs 128px of
    padding — with `bullets > 4` counting as dense, "How it holds up" and
    "Observability and deploys" stayed at 37% padding. `panel` does not count
    either; it is a row of short chips, and several of the worst offenders
    above have one.

    Note the measured column heights were already equal on every block, so the
    "under-filled sidebar leaves a blank rectangle" half of the report did not
    reproduce: the grid stretches both tracks and the aside simply sits at the
    top of its own. Nothing to fix there.
  */
  const dense = Boolean(block.image || block.chain);

  return (
    <Reveal
      as="section"
      className={cn(
        'scroll-mt-28 border-t border-[var(--color-border)] first:border-t-0 first:pt-0',
        dense ? 'py-12 lg:py-16' : 'py-8 lg:py-10',
      )}
    >
      <div id={block.id} className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:gap-12">
        <div className={cn('flex flex-col gap-5', flip && 'lg:order-2')}>
          <h2 className="text-h2">{block.title}</h2>
          {block.body ? (
            <p className="max-w-[min(52ch,100%)] leading-relaxed text-[var(--color-fg-muted)]">{block.body}</p>
          ) : null}

          {block.bullets?.length ? (
            <BulletList items={block.bullets} columns={wrapBullets} />
          ) : null}
        </div>

        {hasAside ? (
          // min-w-0: the illustration and the panel are wide children of a grid
          // column, which defaults to min-width:auto (CLAUDE.md).
          <div className={cn('flex min-w-0 flex-col gap-4', flip && 'lg:order-1')}>
            {block.image ? (
              <Illustration
                src={block.image.src}
                alt={block.image.alt}
                chrome={block.image.chrome}
                // The 5fr of a 7fr/5fr split inside a 90rem container.
                sizes="(min-width: 1024px) 38vw, 100vw"
              />
            ) : null}
            {block.chain ? <Chain steps={block.chain} /> : null}
            {block.panel ? <Panel {...block.panel} /> : null}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

/**
 * The pipeline. Animated 2026-09-02 — dots stagger in and the segment between
 * each pair grows `scaleY` from the top, so the sequence assembles downwards
 * instead of arriving as a finished ladder.
 *
 * This is the same composition the ClusterSwitcher renders on the homepage and
 * `/demo`, and it deliberately shares that component's CSS
 * (`[data-pipe-dot]` / `[data-pipe-line]` in globals.css) rather than
 * reimplementing it: this one is a server component and could not use framer
 * even if it wanted to. It costs no observer — the enclosing `Block` is
 * already wrapped in a `<Reveal>`, and the animation keys off the
 * `.reveal-seen` marker that supplies.
 *
 * It reaches every `PageBlock` with a `chain`, which today is 12 blocks across
 * the product, platform, security and solutions routes.
 */
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
                data-pipe-dot=""
                style={{ animationDelay: `${stagger(i)}ms` }}
                className={cn(
                  'mt-1.5 size-2.5 shrink-0 rounded-full',
                  i === steps.length - 1
                    ? 'bg-[var(--color-accent-line)]'
                    : 'bg-[var(--color-link)]/40',
                )}
              />
              {i < steps.length - 1 ? (
                <span
                  aria-hidden
                  data-pipe-line=""
                  style={{ animationDelay: `${stagger(i)}ms` }}
                  className="w-px flex-1 bg-[var(--color-border-strong)]"
                />
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
        {/* Stagger, off the Block's existing <Reveal> — a wrapping row of real
            permission keys is exactly the composition the pattern is for, and
            it is the same treatment §4's shared-spine chips already get. No
            new observer: the marker comes from the ancestor. */}
        {items.map((item, i) => (
          <li
            key={item}
            data-rise-item=""
            style={{ animationDelay: `${stagger(i)}ms` }}
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
    <Section tone="tint">
      <Container width="wide" className="flex flex-col gap-12">
        <h2 className="text-h2">Related</h2>
        <Reveal as="ul" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link, i) => (
            <li key={link.href} data-rise-item="" style={{ animationDelay: `${stagger(i)}ms` }}>
              <Link
                href={link.href}
                // See capabilities.tsx: `lift` is the shared hover pattern.
                className="group lift flex h-full flex-col gap-1.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-border-strong)]"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-medium">{link.label}</span>
                  <ArrowRight
                    aria-hidden
                    /*
                      --color-link, not --color-brand-600. This was the last
                      raw ramp step reaching past the semantic layer for a
                      *foreground* colour on a live surface, and on the azure
                      ground it is the exact failure globals.css warns about:
                      brand-600 is a fill colour there, and as an icon on a
                      card it measures ~2.3:1 — a hover state that makes the
                      arrow harder to see than before it was hovered.
                    */
                    className="size-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform duration-[var(--duration-lift)] group-hover:translate-x-0.5 group-hover:text-[var(--color-link)]"
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
        </Reveal>
      </Container>
    </Section>
  );
}

/* ─────────────────────────────── CTA band ──────────────────────────────
 *
 * Deliberately has no border-t. RelatedLinks above it is tone="tint" and
 * already draws a sand-200 bottom border; a cool --color-border here stacked a
 * second hairline against it — two 1px lines in different hues, which reads as
 * a muddy 2px seam on every page that has a Related section. Only visible in a
 * zoomed screenshot, which is why it is written down. When there is no Related
 * section the aurora wash carries the boundary on its own.
 */

export function CtaBand({
  title = 'See it on your own data.',
  body = 'Spin up a workspace in minutes, or talk to us about migrating from what you run today.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-aurora">
      <Container className="relative">
        {/* section-y: CtaBand (deep pages) and FinalCta (homepage) are the same
            closing ask and used to render 67% apart — 96px against 160px — so a
            visitor moving homepage → product page felt the page shrink (A2). */}
        <div className="section-y flex flex-col items-center gap-6 text-center">
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
        image={content.image}
      />

      <Section>
        <Container width="wide">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_15rem] xl:gap-16">
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
