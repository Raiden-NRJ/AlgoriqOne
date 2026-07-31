import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CLUSTERS } from '@/content/clusters';
import { APPS } from '@/content/demo-tenant';
import { Container, Eyebrow, Section, TextLink } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/**
 * §5 Product introduction — beat 5. One idea: here is the whole platform on one
 * screen.
 *
 * This is the "trust the CTO instantly" moment. It depicts the real
 * architecture — four apps, one gateway, thirty services grouped into the six
 * clusters, over a shared platform spine. Every cluster links to its page, so
 * the diagram is also navigation.
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

export function Architecture() {
  return (
    <Section id="architecture">
      <Container width="wide" className="flex flex-col gap-14">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>The platform</Eyebrow>
          <h2 className="text-display-2 max-w-[min(26ch,100%)]">
            One gateway. Thirty services. Six clusters you actually care about.
          </h2>
          <p className="text-body-lg max-w-[min(60ch,100%)] text-[var(--color-fg-muted)]">
            Four applications share one design system, one typed SDK, and one API gateway that
            authenticates every request, strips spoofable identity headers, and stamps the tenant
            before anything downstream sees it.
          </p>
        </Reveal>

        <Reveal>
          {/*
            Not role="img": this container holds real links, and an image role
            around interactive controls hides them from assistive technology
            (axe: nested-interactive). It is a labelled group with a
            visually-hidden description instead.
          */}
          <div
            role="group"
            aria-labelledby="architecture-description"
            className="flex flex-col gap-5 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 sm:p-8"
          >
            <p id="architecture-description" className="sr-only">
              Architecture: four applications call a single API gateway, which routes to thirty
              services grouped into six clusters, over a shared platform spine of identity,
              authorization, audit, notification, search, tenant, workflow and reporting services.
            </p>

            {/* Apps */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {APPS.map((app) => (
                <div
                  key={app.name}
                  className="flex flex-col gap-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
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
                API gateway
              </span>
              <span className="max-w-[min(60ch,100%)] text-xs leading-relaxed text-[var(--color-brand-800)]">
                Validates the JWT · strips spoofable identity headers · stamps tenant and user ·
                rate limits · routes
              </span>
            </div>

            {/* Clusters */}
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CLUSTERS.map((cluster) => (
                <li key={cluster.id}>
                  <Link
                    href={cluster.href}
                    className="group flex h-full flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-e2)]"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{cluster.name}</span>
                      <ArrowRight
                        aria-hidden
                        className="size-4 text-[var(--color-fg-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--color-brand-600)]"
                      />
                    </span>
                    <span className="text-xs leading-relaxed text-[var(--color-fg-muted)]">
                      {cluster.valueProp}
                    </span>
                    <span className="mt-auto flex flex-wrap gap-1 pt-1">
                      {cluster.services.slice(0, 3).map((service) => (
                        <span
                          key={service}
                          className="rounded-full bg-[var(--color-bg-subtle)] px-2 py-0.5 font-mono text-xs text-[var(--color-fg-subtle)]"
                        >
                          {service}
                        </span>
                      ))}
                      {cluster.services.length > 3 ? (
                        <span className="px-1 py-0.5 font-mono text-xs text-[var(--color-fg-subtle)]">
                          +{cluster.services.length - 3}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Shared spine */}
            <div className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] px-4 py-4">
              <span className="text-label text-[var(--color-fg-subtle)]">
                Shared platform spine — every cluster uses these
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
            Read how the architecture holds up
            <ArrowRight className="size-4" aria-hidden />
          </TextLink>
        </Reveal>
      </Container>
    </Section>
  );
}
