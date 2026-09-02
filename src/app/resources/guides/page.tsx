import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { stagger } from '@/components/site/motion';

export const metadata: Metadata = {
  title: 'Guides',
  description:
    'Practical guides for evaluating and rolling out Algoryq One: designing a permission model, planning a migration, and rolling out approvals.',
  alternates: { canonical: '/resources/guides' },
};

/**
 * Guides that exist today are the deep pages already published on this site.
 * Rather than invent a separate guide library and leave it half-full, this page
 * routes to the real material and is honest about what is planned.
 */
/**
 * Card descriptions were 22–25 word sentences that re-summarised the page they
 * link to. Cut to the reader-facing hook plus who it is for — a card is a
 * signpost, not an abstract (content pass 2026-08-10).
 */
const AVAILABLE = [
  {
    title: 'How authorization actually works',
    body: 'Catalog, overrides, delegation, resolution order. For whoever signs off access control.',
    href: '/security/permissions',
  },
  {
    title: 'What you would be operating',
    body: 'Thirty services, the trust boundary, scale and observability. For whoever inherits it.',
    href: '/platform/architecture',
  },
  {
    title: 'Designing your approval chains',
    body: 'Steps, approvers, escalation timers — and what is still moving onto the engine.',
    href: '/platform/workflows',
  },
  {
    title: 'Planning the consolidation',
    body: 'Your own numbers, every assumption visible, the formula shown.',
    href: '/roi',
  },
];

const PLANNED = [
  'Migrating from a three-system stack, step by step',
  'Modelling roles for a services organisation',
  'Rolling out timesheet approvals without a revolt',
  'Setting up SSO and SCIM against a common identity provider',
];

export default function GuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Guides"
        title="Practical material, not a content library."
        intro="We publish a guide when we have something specific to say. The most useful material already lives on the product and security pages, so this page routes you there."
      />

      <Section>
        <Container width="wide" className="flex flex-col gap-12">
          <Reveal className="flex flex-col gap-6">
            <h2 className="text-h2">Available now</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {AVAILABLE.map((guide, i) => (
                <li key={guide.href} data-rise-item="" style={{ animationDelay: `${stagger(i)}ms` }}>
                  <Link
                    href={guide.href}
                    className="group flex h-full flex-col gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e1)] lift hover:border-[var(--color-border-strong)]"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-base font-semibold">{guide.title}</span>
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform duration-[var(--duration-lift)] group-hover:translate-x-0.5 group-hover:text-[var(--color-link)]"
                      />
                    </span>
                    <span className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                      {guide.body}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="flex flex-col gap-4">
            <h2 className="text-h2">Being written</h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              {PLANNED.map((item) => (
                <li key={item} className="leading-relaxed text-[var(--color-fg-muted)]">
                  {item}
                </li>
              ))}
            </ul>
            <p className="max-w-[min(52ch,100%)] text-sm text-[var(--color-fg-subtle)]">
              Need one now? Ask, and we will write it for your situation rather than in the abstract.
            </p>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title="Need something specific?"
        body="Tell us what you are trying to work out. We would rather answer your actual question than publish a guide adjacent to it."
      />
    </>
  );
}
