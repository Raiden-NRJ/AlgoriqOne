import { ArrowRight } from 'lucide-react';
import { problem } from '@/content/homepage';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { SystemArchVideo } from '@/components/interactive/system-arch-video';

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
            <ul className="flex flex-col gap-3">
              {problem.items.map((item, i) => (
                <Reveal as="li" key={item} delay={i * 60} className="flex gap-3.5">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-strong)]"
                  />
                  <span className="text-[var(--color-fg-muted)]">{item}</span>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={260}>
              <p className="border-l-2 border-[var(--color-border-strong)] pl-4 leading-relaxed text-[var(--color-fg)]">
                {problem.conclusion}
              </p>
            </Reveal>
          </div>

          {/* min-w-0: the video is a wide child of a grid column (CLAUDE.md). */}
          <Reveal delay={70} className="min-w-0">
            <SystemArchVideo />
          </Reveal>
        </div>

        <Reveal className="flex flex-col gap-5">
          <h3 className="text-label text-[var(--color-fg-subtle)]">{problem.change.label}</h3>

          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-e1)]">
            <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.15fr)] gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 sm:px-6">
              <span className="text-label text-[var(--color-fg-subtle)]">Area</span>
              <span className="text-label text-[var(--color-fg-subtle)]">Three systems</span>
              <span className="text-label text-[var(--color-brand-700)]">Algoryq One</span>
            </div>

            <ul>
              {problem.change.rows.map((row, i) => (
                <Reveal
                  as="li"
                  key={row.aspect}
                  delay={i * 50}
                  className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.15fr)] items-start gap-2 border-b border-[var(--color-border)] px-4 py-4 last:border-b-0 sm:px-6"
                >
                  <span className="text-sm font-medium text-[var(--color-fg)]">{row.aspect}</span>
                  <span className="text-sm leading-snug text-[var(--color-fg-subtle)]">
                    {row.before}
                  </span>
                  <span className="flex items-start gap-2 text-sm leading-snug text-[var(--color-fg)]">
                    <ArrowRight
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-600)]"
                    />
                    <span className="font-medium">{row.after}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
