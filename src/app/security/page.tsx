import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  CtaBand,
  PageHero,
  RelatedLinks,
} from '@/components/page/page-template';
import { Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { CERTIFICATIONS, COMPLIANCE_STATEMENT, SECURITY_CONTROLS } from '@/content/proof';

export const metadata: Metadata = {
  title: 'Security & trust centre',
  description:
    'Deny-by-default authorization in all 30 services, an append-only audit trail, tenant isolation, SSO and SCIM — published, not gated behind an NDA.',
  alternates: { canonical: '/security' },
};

/**
 * The trust centre hub (docs/07 §2).
 *
 * A posture table with three honest statuses — Implemented, In progress,
 * Planned. No green tick that implies certification, and no badge unless a
 * report is on file (content/proof.ts).
 */

const POSTURE: { area: string; implemented: string; status: 'Implemented' | 'In progress' | 'Planned' }[] = [
  { area: 'Server-side authorization', implemented: 'Deny-by-default guards in all 30 services', status: 'Implemented' },
  { area: 'SSO (OIDC / SAML)', implemented: 'Connection config per tenant, JIT provisioning', status: 'Implemented' },
  { area: 'SCIM v2 provisioning', implemented: 'Users and groups', status: 'Implemented' },
  { area: 'MFA', implemented: 'TOTP with enrolment and recovery', status: 'Implemented' },
  { area: 'Audit trail', implemented: 'Append-only, change diffs, hash-chain tamper evidence', status: 'Implemented' },
  { area: 'Tenant isolation', implemented: 'Database per service, tenant-stamped queries, network policy', status: 'Implemented' },
  { area: 'GDPR data-subject requests', implemented: 'Export and erasure flows, retention, legal hold', status: 'Implemented' },
  { area: 'Observability', implemented: 'Structured logs, metrics, distributed traces', status: 'Implemented' },
  { area: 'Backups', implemented: '35-day retention, geo-redundant, configured in Terraform', status: 'Implemented' },
  { area: 'Documented restore drill (RPO/RTO)', implemented: 'Runbook written; drill not yet completed and published', status: 'In progress' },
  { area: 'SOC 2 Type II', implemented: 'Architecture ready; audit not yet performed', status: 'Planned' },
  { area: 'ISO 27001', implemented: 'Not started', status: 'Planned' },
];

const STATUS_STYLE = {
  Implemented: 'border-[var(--color-success)]/30 bg-[var(--color-success)]/10 text-[var(--color-success)]',
  'In progress': 'border-[var(--color-warning)]/35 bg-[var(--color-warning)]/12 text-[var(--color-warning)]',
  Planned: 'border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] text-[var(--color-fg-subtle)]',
} as const;

export default function SecurityHubPage() {
  const certified = CERTIFICATIONS.filter((c) => c.reportOnFile);

  return (
    <>
      <PageHero
        eyebrow="Trust centre"
        title="Security you can verify, not just read about."
        intro="Three things are unusual here: authorization is enforced in every service rather than in the interface, there is one audit trail rather than three, and you can take the platform with you. The detail below is published because a security posture you cannot inspect is a claim, not a control."
        jobs={[
          'Read the controls without signing anything',
          'Check the posture table, including what is not done',
          'Send one link to your security reviewer',
        ]}
      />

      <Section>
        <Container width="wide" className="flex flex-col gap-14">
          <Reveal className="flex flex-col gap-6">
            <h2 className="text-h2">Control areas</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SECURITY_CONTROLS.map((control) => (
                <li
                  key={control.area}
                  className="flex flex-col gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-e1)]"
                >
                  <h3 className="text-sm font-semibold">{control.area}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {control.statement}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-h2">Posture, including what is not done</h2>
              <p className="max-w-[min(68ch,100%)] text-[var(--color-fg-muted)]">
                Three statuses only. A row saying “Planned” is worth more to you than a green tick we
                cannot support.
              </p>
            </div>

            {/* tabIndex makes the scroll container reachable by keyboard —
                without it a keyboard user cannot scroll to the right-hand
                columns on a narrow screen (axe: scrollable-region-focusable). */}
            <div
              tabIndex={0}
              role="region"
              aria-label="Security and compliance posture, scrollable table"
              className="overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--color-border)]"
            >
              <table className="w-full min-w-[40rem] border-collapse text-left">
                <caption className="sr-only">
                  Algoryq One security and compliance posture by control area.
                </caption>
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                    <th scope="col" className="px-5 py-3 text-label text-[var(--color-fg-subtle)]">
                      Control area
                    </th>
                    <th scope="col" className="px-5 py-3 text-label text-[var(--color-fg-subtle)]">
                      What exists
                    </th>
                    <th scope="col" className="px-5 py-3 text-label text-[var(--color-fg-subtle)]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {POSTURE.map((row) => (
                    <tr key={row.area} className="border-b border-[var(--color-border)] last:border-b-0">
                      <th scope="row" className="px-5 py-3.5 text-sm font-medium">
                        {row.area}
                      </th>
                      <td className="px-5 py-3.5 text-sm text-[var(--color-fg-muted)]">
                        {row.implemented}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[row.status]}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {certified.length > 0 ? (
              <ul className="flex flex-wrap items-center gap-4">
                {certified.map((cert) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <li key={cert.name}>
                    <img src={cert.badge} alt={cert.name} className="h-12 w-auto" />
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="max-w-[min(72ch,100%)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {COMPLIANCE_STATEMENT}
            </p>
          </Reveal>

          <Reveal className="flex flex-col gap-4">
            <h2 className="text-h2">Reporting a vulnerability</h2>
            <p className="max-w-[min(62ch,100%)] text-[var(--color-fg-muted)]">
              Send it to{' '}
              <a
                href="mailto:security@algoryq.com"
                className="font-medium text-[var(--color-brand-700)] underline decoration-[var(--color-brand-300)] underline-offset-4"
              >
                security@algoryq.com
              </a>
              . We acknowledge within two business days and will keep you updated until it is closed.
              We will not take legal action against good-faith research.
            </p>
            <Link
              href="/security/permissions"
              className="inline-flex min-h-6 w-fit items-center gap-1.5 py-1 text-sm font-medium text-[var(--color-brand-700)] underline decoration-[var(--color-brand-300)] underline-offset-4"
            >
              Start with how authorization works
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </Container>
      </Section>

      <RelatedLinks
        links={[
          { label: 'Permissions', href: '/security/permissions', description: 'The deepest page on this site.' },
          { label: 'Compliance', href: '/security/compliance', description: 'Audit, retention, DSR.' },
          { label: 'Infrastructure', href: '/security/infrastructure', description: 'Hosting, backups, portability.' },
        ]}
      />
      <CtaBand
        title="Send this to your security reviewer."
        body="Everything above is published. If they need more, we will provide architecture documentation and the RBAC catalog under NDA."
      />
    </>
  );
}
