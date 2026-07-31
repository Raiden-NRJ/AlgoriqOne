import { Check } from 'lucide-react';
import { intelligence } from '@/content/homepage';
import { Container, SampleDataNote, Section, SectionHeading } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/** §10 Analytics & reporting — beat 6. */
export function Intelligence() {
  return (
    <Section tone="subtle">
      <Container width="wide" className="grid gap-12 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-16">
        <Reveal>
          <ReportMiniature />
        </Reveal>

        <Reveal delay={70} className="flex flex-col gap-6">
          <SectionHeading
            eyebrow={intelligence.eyebrow}
            title={intelligence.headline}
            description={intelligence.sub}
          />
          <ul className="flex flex-col gap-2.5">
            {intelligence.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-600)]" aria-hidden />
                <span className="text-[var(--color-fg-muted)]">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}

/**
 * A report surface built from DOM. The bars use the product's categorical chart
 * hues so a visitor who signs up sees the same colour language.
 */
function ReportMiniature() {
  const bars = [
    { label: 'Atlas CRM Rollout', billable: 82, internal: 18 },
    { label: 'Vertex ERP Integration', billable: 64, internal: 36 },
    { label: 'Orbit Health Discovery', billable: 71, internal: 29 },
    { label: 'Beacon Employee Experience', billable: 12, internal: 88 },
  ];

  return (
    <figure className="flex flex-col gap-3">
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e2)] sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--color-border)] pb-4">
          <div>
            <h3 className="text-sm font-semibold">Billable utilisation by project</h3>
            <p className="mt-0.5 text-xs text-[var(--color-fg-subtle)]">
              Quarter to date · scheduled monthly to Finance
            </p>
          </div>
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2.5 py-1 text-xs text-[var(--color-fg-muted)]">
            reporting.report.read
          </span>
        </div>

        <ul className="flex flex-col gap-4 pt-5">
          {bars.map((bar) => (
            <li key={bar.label} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-xs font-medium">{bar.label}</span>
                <span className="shrink-0 font-mono text-xs text-[var(--color-fg-muted)]">
                  {bar.billable}%
                </span>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                <span
                  className="h-full bg-[var(--color-brand-600)]"
                  style={{ width: `${bar.billable}%` }}
                />
                <span
                  className="h-full bg-[var(--color-accent)]/45"
                  style={{ width: `${bar.internal}%` }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-fg-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-full bg-[var(--color-brand-600)]" />
            Billable
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-full bg-[var(--color-accent)]/45" />
            Internal
          </span>
        </div>
      </div>
      <figcaption>
        <SampleDataNote />
      </figcaption>
    </figure>
  );
}
