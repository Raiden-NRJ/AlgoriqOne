import { Check } from 'lucide-react';
import { intelligence } from '@/content/homepage';
import { cn, Container, SampleDataNote, Section, SectionHeading } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
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
 * Fully server-rendered — no island, no next/image, no raster.
 */

export function Intelligence() {
  return (
    <Section tone="tint">
      <Container width="wide" className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-16">
        {/* min-w-0: a wide child of a grid column (CLAUDE.md). */}
        <Reveal className="min-w-0">
          <figure className="flex flex-col gap-3">
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-e2)] sm:p-6">
              <UtilisationChart />
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
            P7's "70ms apart" (deck slide 09). The slide applies it to bars in a
            chart; this section's chart is a raster screenshot, so the closest
            honest target is the points list — five items, one observer on the
            <ul>, delays from stagger(). The screenshot itself rises with the
            enclosing Reveal, which is P7's "static base".

            The halo, the bars and the annotation all landed once the chart
            became DOM — see UtilisationChart below.
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

/**
 * P7's composition, built as DOM (2026-09-02).
 *
 * Deck slide 09 redlines BARS `scaleY 320ms · 70ms apart`, HALO `320ms, one KPI
 * only` and ANNOTATION `cross-fade 200ms`. None of them could be applied while
 * this section was a raster: there were no bars to scale and no KPI to halo —
 * "the composition is missing, not the technique", as the deck itself puts it.
 *
 * Height comes from an inline custom property on the track; the animation only
 * ever scales what is already sized, so the axis never moves and no layout
 * property is animated.
 *
 * The peak bar is derived from the data (`chart.peakWeek`), not marked up by
 * hand, which is what makes "one KPI only" a property of the content rather
 * than a styling convention someone can break later.
 */
function UtilisationChart() {
  const { chart } = intelligence;
  const max = Math.max(...chart.weeks.map((w) => w.capacity));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-label text-[var(--color-fg-subtle)]">{chart.label}</p>

      <div className="flex items-end gap-2 sm:gap-3">
        {chart.weeks.map((w, i) => {
          const pct = Math.round((w.logged / w.capacity) * 100);
          const peak = w.week === chart.peakWeek;

          return (
            <div key={w.week} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              {/* Track: fixed height, so the axis is stable before anything animates. */}
              <div className="relative flex h-40 w-full items-end justify-center">
                {peak ? (
                  <span
                    aria-hidden
                    data-kpi-halo=""
                    style={{ animationDelay: `${stagger(i)}ms` }}
                    className="pointer-events-none absolute inset-x-[-30%] bottom-0 h-[60%]"
                  />
                ) : null}
                <span
                  data-bar=""
                  style={{ height: `${(w.logged / max) * 100}%`, animationDelay: `${stagger(i)}ms` }}
                  className={cn(
                    'relative w-full rounded-t-[var(--radius-sm)]',
                    peak ? 'bg-[var(--color-cyan-500)]' : 'bg-[var(--color-link)]/35',
                  )}
                />
              </div>
              <span className="text-xs text-[var(--color-fg-subtle)]">w{w.week}</span>
              <span
                className={cn(
                  'text-xs font-medium',
                  peak ? 'text-[var(--color-accent-text)]' : 'text-[var(--color-fg-muted)]',
                )}
              >
                {pct}
                {chart.unit}
              </span>
            </div>
          );
        })}
      </div>

      <p
        data-annotation=""
        style={{ animationDelay: `${stagger(chart.weeks.length)}ms` }}
        className="w-fit rounded-full border border-[var(--color-tint-border)] bg-[var(--color-tint)] px-3 py-1 text-xs font-medium text-[var(--color-accent-text)]"
      >
        {chart.annotation}
      </p>
    </div>
  );
}
