import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { hero } from '@/content/homepage';
import { Button, Container, SampleDataNote } from '@/components/site/primitives';
import { HeroVideo } from '@/components/interactive/hero-video';

/**
 * §1 Hero — beat 1 (recognition). One idea: the chain runs inside one product.
 *
 * ── Full-bleed rebuild, 2026-08-31 ────────────────────────────────────────
 * The hero was a two-column grid: copy left, a boxed loop right, on a light
 * `.bg-aurora` wash. The video is now the section's *background* — edge to
 * edge, behind everything — and the copy sits on it.
 *
 * Three things went with that change, and each is a fix rather than a
 * restyle:
 *
 *  1. `.bg-aurora` is gone from this section. A light radial wash behind a
 *     boxed video is what produced the white halo around it; with the video
 *     full-bleed there is nothing for a light background to do except bleed
 *     at the edges. Every other `.bg-aurora` user (CtaBand, FinalCta,
 *     PageHero, 404) still has a light background and keeps it.
 *  2. `.bg-grid` is gone too. It was drawn for a plain surface — over
 *     footage it reads as moiré, and its radial mask fights the scrim's
 *     falloff. Removed rather than dimmed; there is no opacity at which it
 *     was adding anything.
 *  3. The copy is on a dark scrim now, so every colour in here changed to a
 *     band token. `.hero-scrim`'s opacity is measured against sampled frames
 *     — see globals.css. The one rule that matters: no light or white layer
 *     goes over the video, ever.
 *
 * The grid survives, but only as alignment for the copy: the right-hand track
 * is now empty space that lets the footage through, which is why the copy
 * column is capped rather than the grid being dropped. Below lg the copy runs
 * full width and the scrim turns vertical to match.
 *
 * The old boxed visual — the integration web — moved to §2 (the chain), where
 * it draws that section's own subject. components/diagrams/integration-web.tsx
 * is still the zero-byte fallback for it if the video is ever pulled.
 */
export function Hero() {
  return (
    /*
      -mt pulls the section up by exactly the sticky header's height so the
      video runs behind it; the matching pt gives the copy that height back, so
      nothing lands under the navbar. Both read --header-h, so the header and
      the hero can never disagree about the offset (globals.css).

      The header renders transparent here — see OVERLAY_HEADER_ROUTES in
      header.tsx. Its nav sits on this section's scrim and nothing else, which
      is why the scrim is flat: a gradient would have shaded the nav strip
      differently from the copy below it and put a visible seam across the join.
    */
    <section className="relative isolate -mt-[var(--header-h)] overflow-hidden pt-[var(--header-h)]">
      {/*
        Layer 1 — the footage. Absolutely positioned inside an `isolate`
        section, so it can never escape or paint over the header.
      */}
      <HeroVideo />

      {/*
        Layer 2 — the scrim. Its own element between the video and the copy,
        never a background on either: as a background it would sit under the
        video, and as a pseudo-element on the copy it would move with the text.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hero-scrim" />

      {/* Layer 3 — the copy. `relative` puts it above both layers. */}
      <Container width="wide" className="relative">
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

          min-h keeps the footage a hero rather than a letterbox strip when the
          copy is short; svh (not vh) so mobile browser chrome cannot make the
          section taller than the screen it is measured against.
        */}
        <div className="section-y-lg grid min-h-[min(38rem,88svh)] items-center [&>*]:min-w-0 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          {/*
            The copy column, capped at 42rem for measure — 52ch of subhead is
            the readable line length, not a contrast constraint. It used to be
            a contrast constraint: the scrim was a left-anchored gradient and
            this kept the text out of its light end. The scrim is flat now, so
            copy is legible at any x and this cap is purely typographic.
          */}
          <div className="flex max-w-[min(42rem,100%)] flex-col items-start gap-6">
            {/*
              The eyebrow is a local glass pill rather than <Pill tone="brand">.
              Pill's three tones are all light-surface — brand-50, bg-subtle,
              band-surface — and none of them survive being put on footage. It
              is two lines of tokens, so it lives here rather than becoming a
              fourth tone that only one call site could ever use.
            */}
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-band-border)] bg-[color-mix(in_srgb,var(--color-band)_40%,transparent)] px-3 py-1 text-xs font-medium text-[var(--color-band-fg)] backdrop-blur-sm">
              <ShieldCheck className="size-3.5" aria-hidden />
              {hero.eyebrow}
            </span>

            <h1 className="text-display-1 max-w-[min(18ch,100%)] text-[var(--color-band-fg)]">
              <span className="block">{hero.headline[0]}</span>
              {/*
                brand-300, not brand-600. The saturated blue was chosen against
                white and measures 2.3:1 over the scrim; brand-300 measures
                4.93:1 against the 95th-percentile frame, which clears the
                §2.11 headline rule. brand-400 was the closer match to the
                brief's colour and was rejected at 2.95:1 — see globals.css.
              */}
              <span className="block text-[var(--color-brand-300)]">{hero.headline[1]}</span>
            </h1>

            {/*
              band-fg at 7.91:1, not band-fg-muted. The muted token is the
              natural choice for a subhead and it measures 3.0:1 over footage,
              so it is not used anywhere on this section. The subhead reads as
              secondary through size and weight instead of through opacity.
            */}
            <p className="text-body-lg max-w-[min(52ch,100%)] text-[var(--color-band-fg)]/90">
              {hero.sub}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              {/*
                variant="onBand", not "secondary". The secondary button is a
                white surface with a neutral border — a light card sitting on
                the footage, which is the same halo problem in miniature.
                onBand is the existing glass treatment for exactly this: a
                translucent fill and a light border, already used on the two
                dark band sections.
              */}
              <Button href={hero.secondaryCta.href} variant="onBand" size="lg">
                {hero.secondaryCta.label}
              </Button>
            </div>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--color-band-fg)]">
              {hero.proofPoints.map((point) => (
                <li key={point} className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-[var(--color-brand-300)]" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>

            {/*
              Rule 1. The footage shows an interface with invented deals,
              clients and amounts in it, and a screen of fictional product data
              is fictional product data whether it is a <table> or a video.
              `children` is overridden because this is *not* the Demo tenant
              set — the default line would claim a provenance it does not have,
              which is the exact case that override exists for.
            */}
            <SampleDataNote tone="band">{hero.visualNote}</SampleDataNote>
          </div>
        </div>
      </Container>
    </section>
  );
}
