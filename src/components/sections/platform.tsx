import { ArrowRight } from 'lucide-react';
import { heroVisual, platform } from '@/content/homepage';
import { APPS } from '@/content/demo-tenant';
import { Container, Eyebrow, SampleDataNote, Section, TextLink } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { stagger } from '@/components/site/motion';
import { ClusterSwitcher } from '@/components/interactive/cluster-switcher';
import { PlatformVideo } from '@/components/interactive/platform-video';
import { ArchitectureFan, ArchitectureRail } from '@/components/diagrams/architecture-rail';

/**
 * §4 The platform — beat 5. One idea: the whole system on one screen.
 *
 * Merged from §5 Clusters and §6 Architecture on 2026-08-10. Those were two
 * adjacent sections that both enumerated the same six clusters from the same
 * array, so `cluster.name` and `cluster.href` rendered twice back to back and
 * doubled the number of links to the same six destinations within one screen
 * (spacing-content-audit B5).
 *
 * What survived from each:
 *  - Clusters → the ClusterSwitcher, which is the richer of the two. It carries
 *    modules, the per-cluster chain and the real permission keys.
 *  - Architecture → the layer diagram only: four applications, one gateway, the
 *    shared spine. Its cluster cards were the duplicated half and are gone;
 *    each cluster's full service list is on its own /product/{cluster} page.
 */

const SPINE = [
  'identity',
  'authorization',
  'audit',
  'notification',
  'search',
  'tenant',
  'workflow',
  'reporting',
];

const APP_TONE: Record<string, string> = {
  portal: 'var(--color-app-portal)',
  admin: 'var(--color-app-admin)',
  customer: 'var(--color-app-customer)',
  platform: 'var(--color-app-platform)',
};

export function Platform() {
  return (
    <Section id="overview" tone="subtle">
      <Container width="wide" className="flex flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>{platform.eyebrow}</Eyebrow>
          <h2 className="text-display-2 max-w-[min(24ch,100%)]">{platform.headline}</h2>
          <p className="text-body-lg max-w-[min(58ch,100%)] text-[var(--color-fg-muted)]">
            {platform.sub}
          </p>
        </Reveal>

        {/*
          The integration web, moved here 2026-08-31.

          It was the hero visual until the hero went full-bleed video, then
          spent a day in §2 (the chain) — which was the wrong home: §2 is about
          a *sequence* (Deal → Project → Plan → Time → Invoice) and this draws a
          *hub* (one portal, seven modules wired to it, one feed carrying all of
          their events). That is this section's thesis — "all of them sit on one
          gateway and one shared spine" — so it belongs here.

          It opens the section rather than closing it, and the architecture
          diagram still closes it. The two are not the same picture and the
          order is the point: this is what the platform *looks like* to someone
          using it, the diagram at the foot is how it is *built*. The
          ClusterSwitcher sits between them, so they never read as one artefact
          restating the other (rule 9, and the `home.jpg` precedent).

          Capped at 56rem and centred, not the container's 90rem. It ran at
          full container width until 2026-09-02 and was simply too big: at
          1440px the browser chrome and the "My actions" list were rendering
          far above their native 1152px, so an illustrative screen was reading
          as the page's main event and pushing §4's actual content — the
          ClusterSwitcher and the architecture diagram — below the fold. 56rem
          is under the asset's own 1152px, so it is never upscaled now.

          Its text equivalent and Demo-tenant disclosure travel with it — the
          "My actions" feed is sample data (rule 1), and a <video> is not a
          text alternative (rule 5).
        */}
        <Reveal>
          {/* min-w-0: a capped flex child holding a wide element (CLAUDE.md). */}
          <figure className="mx-auto flex w-full min-w-0 max-w-4xl flex-col gap-3">
            <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-e2)]">
              <p className="sr-only">{heroVisual.alt}</p>
              <PlatformVideo />
            </div>
            <figcaption>
              <SampleDataNote />
            </figcaption>
          </figure>
        </Reveal>

        <Reveal>
          <ClusterSwitcher />
        </Reveal>

        <Reveal className="flex flex-col gap-5">
          <h3 className="text-label text-[var(--color-fg-subtle)]">{platform.diagramLabel}</h3>

          {/*
            Not role="img": this container holds a real link, and an image role
            around interactive controls hides them from assistive technology
            (axe: nested-interactive). It is a labelled group with a
            visually-hidden description instead.
          */}
          <div
            role="group"
            aria-labelledby="platform-description"
            className="flex flex-col gap-5 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8"
          >
            <p id="platform-description" className="sr-only">
              {platform.srDescription}
            </p>

            {/* Apps */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {APPS.map((app, i) => (
                <div
                  key={app.name}
                  data-rise-item=""
                  style={{ animationDelay: `${stagger(i)}ms` }}
                  // lift: P4's hover redline, −2px / 120ms. These are cards in
                  // a grid and behaved like static boxes.
                  className="lift flex flex-col gap-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 hover:border-[var(--color-border-strong)]"
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="size-2 rounded-full"
                      style={{ backgroundColor: APP_TONE[app.tone] }}
                    />
                    <span className="text-sm font-semibold">{app.name}</span>
                  </span>
                  <span className="font-mono text-xs text-[var(--color-fg-subtle)]">
                    {app.host}
                  </span>
                </div>
              ))}
            </div>

            {/*
              The connectors. Added 2026-09-02 — until then this diagram drew
              three stacked boxes and no relationship at all, which is the one
              thing the section's own copy asks it to show: "all of them sit on
              one gateway and one shared spine."

              Both rails are decoration in the accessibility sense and nothing
              else: the group's `srDescription` above already states the
              structure in words, so a screen reader loses nothing to their
              `aria-hidden`. They inherit this block's <Reveal> for their draw.
            */}
            <ArchitectureFan />

            {/* Gateway */}
            <div className="flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-chip-border)] bg-[var(--color-chip)] px-4 py-4 text-center">
              <span className="text-sm font-semibold text-[var(--color-chip-fg)]">
                {platform.gateway.title}
              </span>
              <span className="max-w-[min(60ch,100%)] text-xs leading-relaxed text-[var(--color-chip-fg)]">
                {platform.gateway.detail}
              </span>
            </div>

            {/*
              Gateway → spine. `columns={1}` is a single straight drop, because
              both boxes are full width and their centres are the same point —
              the connector's cubic degenerates to a vertical line on its own,
              with no special case in the component.
            */}
            <ArchitectureRail columns={1} />

            {/* Shared spine */}
            <div className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] px-4 py-4">
              <span className="text-label text-[var(--color-fg-subtle)]">
                {platform.spineLabel}
              </span>
              <span className="flex flex-wrap gap-1.5">
                {/*
                  Eight chips against a cap of six, so this is the first place
                  on the site where STAGGER_CAP actually changes the output:
                  `search` (index 5) is the last to get its own delay, and
                  `tenant`, `workflow` and `reporting` arrive with it rather
                  than trailing to 490ms. That is the rule working — past six
                  children a stagger stops reading as one gesture and starts
                  reading as a queue.
                */}
                {SPINE.map((service, i) => (
                  <span
                    key={service}
                    data-rise-item=""
                    style={{ animationDelay: `${stagger(i)}ms` }}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-xs text-[var(--color-fg-muted)]"
                  >
                    {service}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal className="text-center">
          <TextLink href="/platform/architecture">
            {platform.cta}
            <ArrowRight className="size-4" aria-hidden />
          </TextLink>
        </Reveal>
      </Container>
    </Section>
  );
}
