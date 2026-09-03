import { Check } from 'lucide-react';
import { intelligence } from '@/content/homepage';
import { Container, SampleDataNote, Section, SectionHeading } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { UtilisationChart } from '@/components/interactive/utilisation-chart';
import { stagger, STAGGER_TIGHT } from '@/components/site/motion';

/**
 * §7 Analytics & reporting — beat 6.
 *
 * The visual has been three things: a `GraphVideo` loop (2026-08-09), a static
 * screenshot (2026-08-10), and — since 2026-09-02 — a DOM chart. Each step
 * traded a picture of the product for something the repo can actually hold.
 *
 * The screenshot went because of blocker B11, not because of the motion work:
 * its x-axis read Jan 1, 13, 9, 16, 22, 25, 27, 29, **33** — out of sequence,
 * with a date that does not exist — and its member table repeated one row five
 * times. That is unfixable from a content module when it is pixels. As data
 * the same chart is correct by construction and every figure is checkable
 * arithmetic. It is still sample data and still labelled as such (rule 1).
 *
 * It also made P7's redlines applicable for the first time: bars can scale,
 * one KPI can be haloed, the annotation can cross-fade. `reporting-utilisation
 * -dashboard.jpg` stays in `public/images/`, unreferenced.
 *
 * No next/image and no raster. One island, as of 2026-09-03: the chart's own
 * reveal moved to `interactive/utilisation-chart.tsx` so the bars could stop
 * keying off `.reveal-seen` — `<Reveal>`'s 2s failsafe fires whether or not the
 * block is on screen, and on a section this far down the page that meant the
 * bars had finished growing before anyone scrolled to them. The counting
 * percentages needed JS regardless. Everything else here stays server-rendered.
 */

export function Intelligence() {
  return (
    <Section tone="tint">
      <Container width="wide" className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-16">
        {/* min-w-0: a wide child of a grid column (CLAUDE.md). */}
        <Reveal className="min-w-0">
          <figure className="flex flex-col gap-3">
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-e2)] sm:p-6">
              <UtilisationChart chart={intelligence.chart} />
            </div>
            <figcaption>
              {/*
                Still sample data, still labelled — but coherent now. The
                screenshot this replaces carried blocker B11: an x-axis reading
                Jan 1, 13, 9, 16, 22, 25, 27, 29, 33, and a table repeating one
                member five times. Neither was fixable from a content module,
                because it was pixels. See content/homepage.ts `chart`.
              */}
              <SampleDataNote>
                Sample utilisation for one team. Percentages are logged ÷ capacity.
              </SampleDataNote>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={STAGGER_TIGHT} className="flex flex-col gap-6">
          <SectionHeading
            eyebrow={intelligence.eyebrow}
            title={intelligence.headline}
            description={intelligence.sub}
          />
          {/*
            P7's "70ms apart" (deck slide 09) applied to the points list — five
            items, one observer on the <ul>, delays from stagger(). Left on the
            CSS pipeline on purpose: this is the plain Stagger pattern, it needs
            no measurement and no counter, so it has no reason to become JS. The
            heading above it rises with the enclosing Reveal, which is P7's
            "static base".

            The same redline drives the bars, but from the island — see
            interactive/utilisation-chart.tsx for why that one had to move.
          */}
          <ul className="flex flex-col gap-2.5">
            {intelligence.points.map((point, i) => (
              <li
                key={point}
                data-rise-item=""
                style={{ animationDelay: `${stagger(i)}ms` }}
                className="flex items-start gap-2.5 text-sm"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-link)]" aria-hidden />
                <span className="text-[var(--color-fg-muted)]">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
