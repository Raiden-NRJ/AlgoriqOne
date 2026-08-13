/**
 * Security pages (docs/07).
 *
 * The highest-risk content on the site. Every line here obeys the honesty
 * contract in docs/07 §1: mechanisms, not adjectives; "ready", never
 * "certified"; no number we have not measured.
 *
 * ── Content pass, 2026-08-10 ──────────────────────────────────────────────
 * Bullet-first, Zoho shape (see the note at the top of pages-product.ts), with
 * one extra rule applied to this file only: **a trimmed paragraph may not cost
 * a disclosure.** Where prose carried a limit rather than a claim — "we are not
 * certified", "we do not publish an RPO because we have not drilled a restore",
 * "the frontend check is not a security boundary" — it was promoted to a bullet
 * so it reads *more* prominently than it did buried mid-paragraph, never cut.
 *
 * `infrastructure.portability` is now the canonical exit-path statement for the
 * whole site; `/platform/architecture` and `/solutions/by-role/it` were reduced
 * to their own halves of the argument and link here. See the note in
 * pages-platform.ts.
 */

import type { PageContent } from '@/components/page/page-template';
import { CONTACT } from './site';

export type SecurityPageId = 'permissions' | 'compliance' | 'infrastructure';

export const SECURITY_PAGES: Record<SecurityPageId, PageContent> = {
  permissions: {
    eyebrow: 'Permissions',
    title: 'How authorization actually works here.',
    intro:
      'The deepest page on this site, written for the reviewer who wants to break the claim. A chain is worth exactly what its approvals are worth. If you find a hole, we would like to hear about it.',
    chain: {
      active: ['Deal', 'Project', 'Plan', 'Time', 'Invoice'],
      note: 'Every step is permission-checked in the service, not in the browser. That is why the number at the end of the chain can be defended.',
    },
    jobs: [
      'Verify that access control is server-side, not cosmetic',
      'Understand the resolution order before you model your roles',
      'Check how revocation propagates before you sign off offboarding',
    ],
    blocks: [
      {
        id: 'claim',
        title: 'The claim, stated precisely',
        body: 'Enforced server-side in all thirty services, deny by default.',
        bullets: [
          'Every route declares a permission or an explicit public marker',
          'There is no third state',
          'Denied requests return 403, not quietly filtered data',
          'The frontend check is a UX convenience, not a security boundary',
          'We say that plainly because vagueness here usually has a reason',
        ],
      },
      {
        id: 'catalog',
        title: 'One catalog, one convention',
        body: 'Keys take the form module.resource.action, shared by every service and app.',
        bullets: [
          'A single global catalog — no per-module dialects',
          'Wildcard expansion at check time: crm.lead.*, crm.*, or *',
          'Standard actions: read, create, update, delete, approve, assign, export, import, manage',
          'Keys verified against the catalog in continuous integration',
        ],
        panel: {
          label: 'Real keys from the catalog',
          items: [
            'crm.lead.read',
            'sales.deal.approve',
            'timesheet.timesheet.approve',
            'employee.employee.read',
            'billing.invoice.refund',
            'platform.workflow.manage',
            'audit.log.read',
          ],
          mono: true,
        },
      },
      {
        id: 'beyond-roles',
        title: 'Beyond roles',
        body: 'Roles alone do not survive contact with a real organisation.',
        bullets: [
          'Per-user ALLOW and DENY overrides, each with an optional expiry',
          'Out-of-office delegation, bounded by a start and end time',
          'Access requests that route to an approver, not a direct grant',
          'Scoped assignments: global, org unit, or a single record',
        ],
      },
      {
        id: 'resolution',
        title: 'The resolution order, published',
        body: 'A permission engine you cannot reason about is one you cannot trust.',
        chain: [
          'DENY override — wins over everything',
          'ALLOW override — if unexpired',
          'Role grants — nearest scope wins',
          'Delegation — only within its window',
          'Default: deny',
        ],
        bullets: [
          'Deny always wins, and the default is deny',
          'Licence and flag checks run first, so a disabled module hides rather than 403s',
          'Every grant, revoke and delegation is written to the audit trail',
        ],
        image: {
          src: '/illustrations/security-permissions.jpg',
          alt: 'The permission resolution order as a single downward path through five stacked stages — deny override, allow override, role grants, delegation, and a default of deny — with one arrow entering at the top and leaving at the bottom.',
        },
      },
      {
        id: 'revocation',
        title: 'Revocation, and why it is immediate',
        bullets: [
          'Sessions carry a permission version, bumped on any change',
          'Grants re-resolve on the next request — no re-login needed',
          'One revoke reaches every service, not one system at a time',
          'The cookie’s cached permissions are display-only, and documented as such',
        ],
      },
      {
        id: 'verification',
        title: 'How we test that it holds',
        bullets: [
          'Per-service guard tests asserting 403 without the grant',
          'An authorization sweep generated from the live gateway route table',
          'Routes checked as they are, not as documentation claims',
          'Permission-key verification in continuous integration',
        ],
      },
    ],
    related: [
      { label: 'Security', href: '/security', description: 'The full control set.' },
      { label: 'Compliance', href: '/security/compliance', description: 'Audit, retention, DSR.' },
      { label: 'People', href: '/product/people', description: 'Joiner, mover, leaver.' },
    ],
  },

  compliance: {
    eyebrow: 'Compliance',
    title: 'Audit, retention and data-subject requests.',
    intro:
      'What is implemented, what is in progress, and what we do not claim. We would rather lose a deal on an honest answer than win one on a badge we have not earned.',
    jobs: [
      'Answer a GDPR request without an engineering project',
      'Prove who changed what, and when',
      'Give your auditor something real to work from',
    ],
    blocks: [
      {
        id: 'posture',
        title: 'Our actual posture',
        bullets: [
          'SOC 2-ready architecture — controls implemented, audit not yet performed',
          'We are not certified, and no badge appears anywhere on this site',
          'GDPR DSR flows implemented: export and erasure',
          'When an audit completes, the report goes under NDA and this page gets a date',
        ],
      },
      {
        id: 'audit',
        title: 'The audit trail',
        body: 'Append-only, covering every mutation across every module.',
        bullets: [
          'Per-field change diffs on every entry',
          'Hash-chained, so tampering is detectable rather than discouraged',
          'Login logs alongside change logs',
          'Per-record history with restore, permission-gated',
          'Export for evidence gathering',
        ],
        image: {
          src: '/illustrations/security-compliance.jpg',
          alt: 'An audit trail drawn as a hash chain — a row of entries joined by link icons, each one bound to the entry before it — above a four-step data-subject request flow of request, verify, export and erase.',
        },
        panel: {
          label: 'Permissions in this area',
          items: ['audit.log.read', 'audit.log.export', 'compliance.dsr.read'],
          mono: true,
        },
      },
      {
        id: 'dsr',
        title: 'Data-subject requests',
        body: 'Reconciling erasure with an append-only log is the hard part.',
        chain: ['Request received', 'Identity verified', 'Scope resolved', 'Export or erase', 'Evidence recorded'],
        bullets: [
          'Export and right-to-erasure flows across services',
          'Crypto-shredding and tombstones, not quiet deletion of audit history',
          'Retention policies with enforcement jobs',
          'Legal hold, which suspends retention deletion',
          'Consent records',
        ],
      },
      {
        id: 'access-review',
        title: 'Access reviews',
        body: 'One catalog makes a review a query, not an archaeology exercise.',
        bullets: [
          'Effective permissions per user, overrides and delegations included',
          'Grant and revoke history from the audit trail',
          'Expiring overrides surface before they lapse',
        ],
      },
    ],
    related: [
      { label: 'Permissions', href: '/security/permissions', description: 'The engine underneath.' },
      { label: 'Infrastructure', href: '/security/infrastructure', description: 'Where data lives.' },
      { label: 'Privacy policy', href: '/legal/privacy', description: 'The legal document.' },
    ],
  },

  infrastructure: {
    eyebrow: 'Infrastructure',
    title: 'Where your data lives, how it is isolated, and how you get it back.',
    intro:
      'Hosting, tenant isolation, backups, disaster recovery and portability. The last one is what most vendors leave out, and what you will care about most if this ever ends.',
    jobs: [
      'Know where the data is and who can reach it',
      'Understand the recovery story before you need it',
      'Confirm you can leave with your data',
    ],
    blocks: [
      {
        id: 'isolation',
        title: 'Tenant isolation',
        bullets: [
          'Database per service; no shared schema across modules',
          'Tenant identifier stamped at the gateway, never accepted from the client',
          'Every tenant-owned query filtered by that stamped identifier',
          'Default-deny network policies between services',
          'Internal-auth header verified downstream as defence in depth',
        ],
      },
      {
        id: 'hosting',
        title: 'Hosting and residency',
        body: 'Azure is the primary target. Self-hosting is a supported path, not a concession.',
        bullets: [
          'Managed Kubernetes, deployed by Helm charts and Terraform',
          'Managed PostgreSQL with backup retention and geo-redundancy',
          'Secrets from a managed vault, not environment files',
          'Region selection at deployment time',
          'Self-hosted via Helm or Docker Compose',
        ],
      },
      {
        id: 'recovery',
        title: 'Backups and recovery',
        bullets: [
          'Automated backups, 35-day retention, geo-redundant, set in Terraform',
          'Staged deploys with smoke tests and automatic rollback',
          'A documented failover runbook with verify and rollback scripts',
          'No published RPO or RTO — we have not completed a restore drill',
          'A recovery objective you have not tested is a guess with a decimal point',
        ],
        image: {
          src: '/illustrations/security-infrastructure.jpg',
          alt: 'A cluster orchestrator at the top connected down to a row of separate database cylinders, one per service, with a single backup and restore process attached beneath the whole row.',
        },
      },
      {
        id: 'portability',
        title: 'Getting out',
        body: 'The path exists and is written down. This is the canonical version of it.',
        bullets: [
          'No cloud-provider SDK in application code',
          'Storage driver selectable: azure-blob, s3-compatible, or local disk',
          'Documented failover matrix to free-tier equivalents',
          'CSV export on every list, and a REST API for the rest',
          'A Compose stack that runs all thirty services on one machine',
        ],
      },
      {
        id: 'disclosure',
        title: 'Reporting a vulnerability',
        bullets: [
          CONTACT.security,
          'A security.txt at the well-known location',
          'We acknowledge within two business days',
          'No legal action against good-faith research',
        ],
      },
    ],
    related: [
      { label: 'Architecture', href: '/platform/architecture', description: 'The system itself.' },
      { label: 'Compliance', href: '/security/compliance', description: 'Audit and DSR.' },
      { label: 'Permissions', href: '/security/permissions', description: 'Who can reach what.' },
    ],
  },
};

export const SECURITY_PAGE_IDS = Object.keys(SECURITY_PAGES) as SecurityPageId[];
