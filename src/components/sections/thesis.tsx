import { ArrowRight } from 'lucide-react';
import { thesis } from '@/content/homepage';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/**
 * §4 Why Algoryq One exists — beat 4 (the claim), with before/after folded in
 * (requested topic 32). Rows are read across, not down, so the difference is
 * the thing the eye compares.
 */
export function Thesis() {
  return (
    <Section>
      <Container width="wide" className="flex flex-col gap-14">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>{thesis.eyebrow}</Eyebrow>
          <h2 className="text-display-2 max-w-[min(24ch,100%)]">{thesis.headline}</h2>
          <p className="text-body-lg max-w-[min(62ch,100%)] text-[var(--color-fg-muted)]">{thesis.sub}</p>
        </Reveal>

        <Reveal>
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-e1)]">
            {/* Column headers */}
            <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.15fr)] gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 sm:px-6">
              <span className="text-label text-[var(--color-fg-subtle)]">Area</span>
              <span className="text-label text-[var(--color-fg-subtle)]">Three systems</span>
              <span className="text-label text-[var(--color-brand-700)]">Algoryq One</span>
            </div>

            <ul>
              {thesis.rows.map((row, i) => (
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
