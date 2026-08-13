import { ArrowRight } from 'lucide-react';
import { platform } from '@/content/homepage';
import { APPS } from '@/content/demo-tenant';
import { Container, Eyebrow, Section, TextLink } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { ClusterSwitcher } from '@/components/interactive/cluster-switcher';

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
              {APPS.map((app) => (
                <div
                  key={app.name}
                  className="flex flex-col gap-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3"
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

            {/* Gateway */}
            <div className="flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-4 py-4 text-center">
              <span className="text-sm font-semibold text-[var(--color-brand-900)]">
                {platform.gateway.title}
              </span>
              <span className="max-w-[min(60ch,100%)] text-xs leading-relaxed text-[var(--color-brand-800)]">
                {platform.gateway.detail}
              </span>
            </div>

            {/* Shared spine */}
            <div className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] px-4 py-4">
              <span className="text-label text-[var(--color-fg-subtle)]">
                {platform.spineLabel}
              </span>
              <span className="flex flex-wrap gap-1.5">
                {SPINE.map((service) => (
                  <span
                    key={service}
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
