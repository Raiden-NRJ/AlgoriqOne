import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

export const metadata: Metadata = {
  title: 'Guides',
  description:
    'Practical guides for evaluating and rolling out RocketCRM: designing a permission model, planning a migration, and rolling out approvals.',
  alternates: { canonical: '/resources/guides' },
};

/**
 * Guides that exist today are the deep pages already published on this site.
 * Rather than invent a separate guide library and leave it half-full, this page
 * routes to the real material and is honest about what is planned.
 */
const AVAILABLE = [
  {
    title: 'How authorization actually works',
    body: 'The permission catalog, overrides, delegation, scoped assignments, and the published resolution order. Start here if you are the person signing off access control.',
    href: '/security/permissions',
  },
  {
    title: 'What you would be operating',
    body: 'Thirty services, the gateway trust boundary, scale mechanics, observability, and the portability story. Written for whoever inherits this after the contract.',
    href: '/platform/architecture',
  },
  {
    title: 'Designing your approval chains',
    body: 'Sequential and parallel steps, role- or org-unit-based approvers, escalation timers and delegation — and honestly, what is still being migrated onto the engine.',
    href: '/platform/workflows',
  },
  {
    title: 'Planning the consolidation',
    body: 'The maths on your own numbers, with every assumption visible and the formula shown.',
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
        intro="We publish guides when we have something specific to say. Right now the most useful material lives on the product and security pages themselves, so this page routes you there rather than duplicating it."
      />

      <Section>
        <Container width="wide" className="flex flex-col gap-14">
          <Reveal className="flex flex-col gap-6">
            <h2 className="text-h2">Available now</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {AVAILABLE.map((guide) => (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    className="group flex h-full flex-col gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e1)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-e2)]"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-base font-semibold">{guide.title}</span>
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--color-brand-600)]"
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
            <p className="max-w-[min(62ch,100%)] text-sm text-[var(--color-fg-subtle)]">
              If one of these would be useful to you now, ask and we will write it for your situation
              rather than in the abstract.
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
