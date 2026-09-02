import { ArrowRight } from 'lucide-react';
import { problem } from '@/content/homepage';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { stagger, STAGGER_TIGHT } from '@/components/site/motion';
import { SystemArchVideo } from '@/components/interactive/system-arch-video';
import { GapCallouts } from '@/components/interactive/gap-callouts';

/**
 * §3 Where it breaks — beats 2, 3 and 4.
 *
 * One idea: the handoffs between systems are the failure, and replacing the
 * handoffs is what this platform actually does.
 *
 * Absorbed §4 Thesis on 2026-08-10. The two sections were one argument split
 * across a section break and a video: Problem listed four failures, Thesis
 * answered them. They now read as failures → resolution in a single beat.
 *
 * The merge went this way round — Thesis into Problem, not Problem into Chain —
 * because this section hosts SystemArchVideo and every video keeps its home.
 */
export function Problem() {
  return (
    <Section>
      <Container width="wide" className="flex flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>{problem.eyebrow}</Eyebrow>
          <h2 className="text-display-2 max-w-[min(26ch,100%)]">{problem.headline}</h2>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-6">
            {/*
              Scannable lines, not cards. These were `{ title, body }` pairs —
              a bold line plus two sentences, four times — which is the densest
              block on the page for content that is only setting up the problem.
            */}
            {/*
              One observer on the list, not one per line (deck slide 06), and
              the reveal itself is driven off the video's clock rather than a
              timer — deck slide 05, "DRIVER: timeupdate, not setTimeout". See
              interactive/gap-callouts.tsx for why the callouts stayed in this
              column instead of going over the footage.

              Both mechanisms coexist: Rise + stagger is the entrance, and the
              cue only gates opacity afterwards.
            */}
            <GapCallouts count={problem.items.length}>
            <Reveal as="ul" className="flex flex-col gap-3">
              {problem.items.map((item, i) => (
                <li
                  key={item}
                  data-rise-item=""
                  data-cue=""
                  style={{
                    animationDelay: `${stagger(i)}ms`,
                    // Shown once the video has passed this line's cue.
                    opacity: `calc(min(1, max(0, var(--shown, ${problem.items.length}) - ${i})))`,
                  }}
                  className="flex gap-3.5"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-strong)]"
                  />
                  <span className="text-[var(--color-fg-muted)]">{item}</span>
                </li>
              ))}
            </Reveal>
            </GapCallouts>

            {/* Sequenced after the four items above, not a stagger of its own:
                stagger(4) is the delay the fifth child would have had, so the
                conclusion lands one beat behind the last failure. Derived, so
                it tracks the band instead of being a 260ms literal. */}
            <Reveal delay={stagger(problem.items.length)}>
              <p className="border-l-2 border-[var(--color-border-strong)] pl-4 leading-relaxed text-[var(--color-fg)]">
                {problem.conclusion}
              </p>
            </Reveal>
          </div>

          {/* min-w-0: the video is a wide child of a grid column (CLAUDE.md). */}
          <Reveal delay={STAGGER_TIGHT} className="min-w-0">
            <SystemArchVideo />
          </Reveal>
        </div>

        <Reveal className="flex flex-col gap-5">
          <h3 className="text-label text-[var(--color-fg-subtle)]">{problem.change.label}</h3>

          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-e1)]">
            <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.15fr)] gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 sm:px-6">
              <span className="text-label text-[var(--color-fg-subtle)]">Area</span>
              <span className="text-label text-[var(--color-fg-subtle)]">Three systems</span>
              <span className="text-label text-[var(--color-link)]">Algoryq One</span>
            </div>

            {/* One observer on the table body, not one per row. */}
            <Reveal as="ul">
              {problem.change.rows.map((row, i) => (
                <li
                  key={row.aspect}
                  data-rise-item=""
                  style={{ animationDelay: `${stagger(i)}ms` }}
                  className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.15fr)] items-start gap-2 border-b border-[var(--color-border)] px-4 py-4 last:border-b-0 sm:px-6"
                >
                  <span className="text-sm font-medium text-[var(--color-fg)]">{row.aspect}</span>
                  <span className="text-sm leading-snug text-[var(--color-fg-subtle)]">
                    {row.before}
                  </span>
                  <span className="flex items-start gap-2 text-sm leading-snug text-[var(--color-fg)]">
                    <ArrowRight
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-[var(--color-link)]"
                    />
                    <span className="font-medium">{row.after}</span>
                  </span>
                </li>
              ))}
            </Reveal>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
