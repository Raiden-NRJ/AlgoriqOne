import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { hero, heroVisual } from '@/content/homepage';
import { DEMO_TENANT } from '@/content/demo-tenant';
import { Button, Container, Pill } from '@/components/site/primitives';
import { HeroVideo } from '@/components/interactive/hero-video';

/**
 * §1 Hero — beat 1 (recognition). One idea: the chain runs inside one product.
 *
 * The copy states it and the visual is the same sentence drawn: the portal in
 * the middle, wired directly to the modules that feed it.
 *
 * That visual was the DOM/SVG composition in components/diagrams/
 * integration-web.tsx until 2026-08-09, when it was replaced by a looping
 * video (components/interactive/hero-video.tsx). The diagram is deliberately
 * kept in the repo: it renders the same picture from content/homepage.ts at
 * zero bytes and is the fallback if the video is ever pulled.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-aurora">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid" />

      <Container width="wide" className="relative">
        {/*
          [&>*]:min-w-0 is load-bearing. The composition below has a wide
          min-content width; without this, grid's default min-width: auto pushes
          the shared column past the viewport at phone widths and the copy runs
          off. The section's overflow-hidden then *clips* it silently —
          scrollWidth stays correct while the text is cut off mid-word. Only a
          screenshot catches that.
        */}
        {/*
          The column ratio flips at 2xl. Up to then the composition is bleeding
          into a narrow gutter and the display type is the thing under pressure,
          so the copy takes the larger track; past 90rem the bleed alone gives
          the visual all the width it needs and the balance can invert.
        */}
        {/*
          section-y-lg, not raw py-*. The hero is the block that should feel
          most generous, and fixed Tailwind steps made it the tightest on the
          page: 96px against .section-y's 129.6px at 1440px, and 96 against 144
          at 2560 — the rhythm inverted as the screen got wider. The utility is
          fluid, so it scales with everything below it and a retune of the token
          reaches the hero too (docs/spacing-content-audit.md A2).

          Those two figures are the pre-2026-08-10 state, kept because they are
          why this is a utility and not a py-*. The tokens were retuned on
          2026-08-13 and .section-y is 86.4px at 1440 now, not 129.6 — which is
          the point: this line did not have to change for the hero to follow.
        */}
        <div className="section-y-lg grid items-center gap-12 [&>*]:min-w-0 lg:grid-cols-2 lg:gap-16 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] xl:gap-10 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.06fr)]">
          {/* Copy */}
          <div className="flex flex-col items-start gap-6">
            <Pill tone="brand">
              <ShieldCheck className="size-3.5" aria-hidden />
              {hero.eyebrow}
            </Pill>

            <h1 className="text-display-1 max-w-[min(16ch,100%)]">
              <span className="block">{hero.headline[0]}</span>
              <span className="block text-[var(--color-brand-600)]">{hero.headline[1]}</span>
            </h1>

            <p className="text-body-lg max-w-[min(52ch,100%)] text-[var(--color-fg-muted)]">{hero.sub}</p>

            <div className="flex flex-wrap items-center gap-3">
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary" size="lg">
                {hero.secondaryCta.label}
              </Button>
            </div>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--color-fg-subtle)]">
              {hero.proofPoints.map((point) => (
                <li key={point} className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-[var(--color-brand-600)]" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/*
            The composition runs to the right viewport edge from xl up, which is
            the width at which the outer nodes are legible at all. bleed-r is
            safe here only because the section clips overflow — see globals.css.
          */}
          <div className="xl:bleed-r">
            {/*
              max-w + ml-auto: the bleed keeps widening past 90rem but the
              composition's fluid type is clamped, so beyond ~56rem the nodes
              shrink against their own box and the feed rows drift apart.
              Capped and pushed right, 2560 renders what 1728 renders.
            */}
            <div className="relative xl:ml-auto xl:max-w-[56rem]">
              {/*
                The text equivalent. It used to live inside IntegrationWeb; the
                video replaced the diagram but not its meaning, and a <video>
                is not a text alternative — so the description moves up here and
                stays server-rendered, while HeroVideo itself is aria-hidden.
              */}
              <p className="sr-only">{heroVisual.alt}</p>
              <HeroVideo />

              {/* Outside the illustration's aria-hidden subtree: the sample-data
                  disclosure is not decorative (CLAUDE.md rule 1). */}
              <p className="mt-4 text-xs text-[var(--color-fg-subtle)] xl:absolute xl:bottom-0 xl:left-0 xl:mt-0">
                Sample data · {DEMO_TENANT.name}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
