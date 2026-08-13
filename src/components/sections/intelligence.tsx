import Image from 'next/image';
import { Check } from 'lucide-react';
import { intelligence } from '@/content/homepage';
import { Container, SampleDataNote, Section, SectionHeading } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/**
 * §7 Analytics & reporting — beat 6.
 *
 * The visual is a static screenshot as of 2026-08-10, replacing the
 * `GraphVideo` loop that ran here from 2026-08-09. Only this section changed —
 * the hero keeps its own video, which is a different asset entirely
 * (`hero-loop.webm/mp4` + poster, not the workflow loop this section used).
 *
 * `next/image` rather than a bare <img>: the source is a 2752×1536 JPEG, and
 * next.config.mjs already asks for AVIF/WebP, so this gets format negotiation
 * and a responsive srcset for free. Passing the intrinsic width/height reserves
 * the box before the bytes land, so the swap costs no CLS — the video it
 * replaced reserved its box the same way, via aspect ratio.
 *
 * Removing the video also takes a client island off the homepage; this section
 * is now fully server-rendered.
 */

/** Intrinsic size of the source file. Keeps the reserved box exact. */
const SHOT = {
  src: '/images/reporting-utilisation-dashboard.jpg',
  width: 2752,
  height: 1536,
  alt: 'The Algoryq One reporting surface: a “Reporting & Utilisation Analytics” page with a saved-view selector and CSV export, a “Utilisation vs. Capacity” bar chart comparing logged hours against capacity across the current month, a weekly-schedule badge, and a filtered table of members showing role, project, logged hours, capacity hours and utilisation percentage.',
} as const;

export function Intelligence() {
  return (
    <Section tone="tint">
      <Container width="wide" className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-16">
        {/* min-w-0: a wide child of a grid column (CLAUDE.md). */}
        <Reveal className="min-w-0">
          <figure className="flex flex-col gap-3">
            {/*
              Same frame the video had — rounded-xl, hairline border, e2 shadow,
              overflow-hidden so the corners actually clip. `bg-black` is gone
              with it: that was backing a letterboxed video, and this source is
              opaque edge to edge.
            */}
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-e2)]">
              <Image
                src={SHOT.src}
                alt={SHOT.alt}
                width={SHOT.width}
                height={SHOT.height}
                /* 7 of 12 columns inside a 90rem container above lg, full width below. */
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="block h-auto w-full"
              />
            </div>
            <figcaption>
              {/*
                Not the default Demo-tenant line. This mockup shows names and
                projects that are not in content/demo-tenant.ts, so claiming it
                came from that dataset would be false (rule 1).
              */}
              <SampleDataNote>Illustration of the reporting surface. Sample data.</SampleDataNote>
            </figcaption>
          </figure>
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
