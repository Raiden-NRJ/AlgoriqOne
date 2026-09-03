import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { capabilities } from '@/content/homepage';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { stagger } from '@/components/site/motion';
import { CapabilitiesSpread } from '@/components/interactive/capabilities-spread';

/**
 * §6 Built to fit — beat 7. One idea: it bends to your process without a
 * rebuild.
 *
 * Absorbed §9 Devices on 2026-08-10 as the fourth card. Devices was a whole
 * section carrying one claim — approvals and timesheets happen away from a
 * desk, and there is a responsive web app plus an installable PWA — wrapped in
 * three CSS device frames. The claim is intact in the card; the desktop and
 * tablet frames were cut as decoration and /platform/mobile keeps the detail,
 * including both copies of the explicit no-native-app negation.
 *
 * Each card carries a miniature of the thing it describes rather than an icon,
 * so the section shows the capability instead of asserting it.
 */
export function Capabilities() {
  return (
    <Section>
      <Container width="wide" className="flex flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>{capabilities.eyebrow}</Eyebrow>
          <h2 className="text-display-2 max-w-[min(22ch,100%)]">{capabilities.headline}</h2>
        </Reveal>

        {/*
          The card grid is the only block in this section that is *not* wrapped
          in <Reveal>. CapabilitiesSpread owns its motion instead — a scrubbed,
          section-pinned spread at xl and a per-card rise below it, shared with
          §3 via useCardSpread — and it does so entirely in transforms, leaving
          the grid rendered and finished without JavaScript. That is a strictly
          better no-JS story than the Reveal it replaced, which started the grid
          at opacity 0.

          This also retired the cards' [data-rise-item] stagger (deck slide 06's
          "OBSERVER: one, on the grid", 80ms per P5). It could not stay: that
          CSS animation writes transform and opacity on the same <li> the scrub
          does, and a CSS animation beats an inline style, so it would have
          overridden the spread for its first 320ms. The one observer the deck
          asked for is still one — it is now a ScrollTrigger rather than a
          Reveal.
        */}
        <CapabilitiesSpread>
          {/* 2-up at md so four cards never leave a single orphan on a row. */}
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.cards.map((card) => (
              // data-cap-card is CapabilitiesSpread's handle on this element.
              // The animation writes transform and opacity only, so the class
              // lists below are the resting state in every case.
              <li key={card.title} data-cap-card="">
              <Link
                href={card.href}
                // `lift` is the deck's hover pattern: -2px, e1→e2, 120ms
                // (globals.css). This used to hand-roll it at duration-200 —
                // right distance, wrong speed. Only the border colour is
                // per-card now.
                className="group lift flex h-full flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e1)] hover:border-[var(--color-border-strong)]"
              >
                {/* The miniature */}
                <div
                  data-cap-chips=""
                  className="flex flex-wrap items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3"
                >
                  {card.steps.map((step, index) => (
                    <span key={step} className="flex items-center gap-1.5">
                      <span
                        className={
                          index === card.steps.length - 1
                            ? 'rounded-[var(--radius-sm)] bg-[var(--color-action)] px-2 py-1 text-xs font-medium text-[var(--color-fg-inverse)]'
                            : 'rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs font-medium text-[var(--color-fg-muted)]'
                        }
                      >
                        {step}
                      </span>
                      {index < card.steps.length - 1 ? (
                        <ChevronRight
                          aria-hidden
                          className="size-3 text-[var(--color-fg-subtle)]"
                        />
                      ) : null}
                    </span>
                  ))}
                </div>

                <div data-cap-copy="" className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {card.body}
                  </p>
                </div>

                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-link)]">
                  Learn more
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-[var(--duration-lift)] group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
              </li>
            ))}
          </ul>
        </CapabilitiesSpread>

        {/*
          P5's "one claim": the rule under the four proofs, scaling in from
          the left over 480ms. It is the only thing on the card grid that is
          not a card, which is the point — four proofs, one line under them.

          Its own Reveal, so `.reveal-seen` lands on this block when the rule
          itself is in view rather than when the heading is — the same split
          chain.tsx makes for its rail, and necessary now that the grid no
          longer carries a Reveal for this to inherit the marker from.

          aria-hidden: it is a rule, not a separator with meaning. h-px +
          scaleX so the animation is a transform, never a width.

          The `mt-12` this used to carry is gone: it was a sibling inside the
          grid's Reveal, and it is now a flex item of the Container, whose
          `gap-12` supplies exactly the same 3rem.
        */}
        <Reveal>
          <div
            aria-hidden="true"
            data-sweep=""
            style={{ animationDelay: `${stagger(capabilities.cards.length, 80)}ms` }}
            className="h-px w-full bg-[var(--color-link)]"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
