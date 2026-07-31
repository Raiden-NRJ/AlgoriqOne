/**
 * Security pages (docs/07).
 *
 * The highest-risk content on the site. Every line here obeys the honesty
 * contract in docs/07 §1: mechanisms, not adjectives; "ready", never
 * "certified"; no number we have not measured.
 */

import type { PageContent } from '@/components/page/page-template';

export type SecurityPageId = 'permissions' | 'compliance' | 'infrastructure';

export const SECURITY_PAGES: Record<SecurityPageId, PageContent> = {
  permissions: {
    eyebrow: 'Permissions',
    title: 'How authorization actually works here.',
    intro:
      'Every link in the deal-to-cash chain has an approval on it, and a chain is worth exactly as much as those approvals are. This is the deepest page on the site, written for the reviewer who wants to break the claim. If you find a hole in it, we would genuinely like to hear about it.',
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
        body: 'Authorization is enforced server-side in every one of the thirty services, deny by default. A route either declares the permission it requires or is explicitly marked public; there is no third state. The interface gates on the same permissions, but that gating is a convenience, not a security boundary — and we say so plainly, because a vendor who is vague about this usually has a reason.',
        bullets: [
          'Every controller route carries a permission requirement or an explicit public marker',
          'Denied requests return 403 with the standard response envelope, not filtered data',
          'The frontend permission check is a UX layer and is documented as one',
        ],
      },
      {
        id: 'catalog',
        title: 'One catalog, one convention',
        body: 'Permissions are keys of the form module.resource.action, held in a single catalog shared by every service and every application. Wildcards expand at check time, so a role can hold crm.lead.* or crm.* or, for a superadmin, *.',
        bullets: [
          'A single global catalog — no per-module dialects',
          'Wildcard expansion at check time',
          'A standard action set per module: read, create, update, delete, approve, assign, export, import, manage',
          'Keys are verified against the catalog in continuous integration',
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
        body: 'Roles alone do not survive contact with a real organisation. The engine also carries per-user overrides with expiry, time-bounded delegation, approval-based access requests, and scoped assignments. This combination is uncommon at this size, and it is the part of the platform we are most confident about.',
        bullets: [
          'Per-user ALLOW and DENY overrides, each with an optional expiry date',
          'Out-of-office delegation, bounded by a start and end time',
          'Access requests that route to an approver rather than a direct grant',
          'Scoped assignments: global, org unit, or a single record',
        ],
      },
      {
        id: 'resolution',
        title: 'The resolution order, published',
        body: 'We publish the algorithm because a permission engine you cannot reason about is one you cannot trust. Deny always wins, and the default is deny.',
        chain: [
          'DENY override — wins over everything',
          'ALLOW override — if unexpired',
          'Role grants — nearest scope wins',
          'Delegation — only within its window',
          'Default: deny',
        ],
        bullets: [
          'Licence and feature-flag checks run before permission checks, so a disabled module hides rather than returning 403',
          'Every grant, revoke and delegation is written to the audit trail',
        ],
      },
      {
        id: 'revocation',
        title: 'Revocation, and why it is immediate',
        body: 'Sessions carry a permission version. When a role or override changes, the version is bumped and every session re-resolves its grants on the next request. A revoked permission does not wait for the user to log out and back in — which is the failure mode that makes most offboarding processes fictional.',
        bullets: [
          'Permission-version invalidation propagates without a re-login',
          'One revoke reaches every service, not one system at a time',
          'The session cookie’s cached permissions are display-only and documented as such',
        ],
      },
      {
        id: 'verification',
        title: 'How we test that it holds',
        body: 'Guard contract tests per service assert that an unauthorized call fails, and an end-to-end sweep generated from the live gateway route table checks routes as they actually are rather than as documentation claims. Testing that unauthorized calls fail is a sentence very few vendors can write.',
        bullets: [
          'Per-service tests asserting 403 without the grant',
          'An authorization sweep generated from the real route table',
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
        body: 'The architecture is SOC 2-ready and GDPR data-subject request flows are implemented. We are not certified, and no certification badge appears anywhere on this site. When an audit completes, the report will be available under NDA and this page will say so with a date on it.',
        bullets: [
          'SOC 2-ready architecture — controls implemented, audit not yet performed',
          'GDPR DSR flows implemented: export and erasure',
          'No certification claimed, and no badge rendered, until a report exists',
        ],
      },
      {
        id: 'audit',
        title: 'The audit trail',
        body: 'Append-only, with per-field change diffs, covering every mutation across every module. Entries are hash-chained so tampering is detectable rather than merely discouraged, and a record’s history can be viewed and restored from the diffs it captured.',
        bullets: [
          'Append-only log with per-field change diffs',
          'Hash-chain tamper evidence',
          'Login logs alongside change logs',
          'Per-record history with restore, permission-gated',
          'Export for evidence gathering',
        ],
        panel: {
          label: 'Permissions in this area',
          items: ['audit.log.read', 'audit.log.export', 'compliance.dsr.read'],
          mono: true,
        },
      },
      {
        id: 'dsr',
        title: 'Data-subject requests',
        body: 'Intake, verification, then export or erasure, with the evidence written back into the audit trail. Reconciling erasure with an append-only log is the hard part; we solve it with crypto-shredding and tombstones rather than by quietly deleting audit history, which would defeat the point of having it.',
        chain: ['Request received', 'Identity verified', 'Scope resolved', 'Export or erase', 'Evidence recorded'],
        bullets: [
          'Export and right-to-erasure flows across services',
          'Retention policies with enforcement jobs',
          'Legal hold, which suspends retention deletion',
          'Consent records',
        ],
      },
      {
        id: 'access-review',
        title: 'Access reviews',
        body: 'Who has what, as a report rather than an archaeology exercise. Because there is one permission catalog, an access review is a query instead of a reconciliation across three systems.',
        bullets: [
          'Effective permissions per user, including overrides and delegations',
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
      'Hosting, tenant isolation, backups, disaster recovery and portability. The last of those is the one most vendors leave out, and the one you will care about most if this relationship ever ends.',
    jobs: [
      'Know where the data is and who can reach it',
      'Understand the recovery story before you need it',
      'Confirm you can leave with your data',
    ],
    blocks: [
      {
        id: 'isolation',
        title: 'Tenant isolation',
        body: 'Every service owns its own database, and every query in a tenant-owned model is filtered by the tenant identifier the gateway stamped — not one the caller supplied. In-cluster network policies restrict which pods can talk to which, and services additionally verify an internal-auth header.',
        bullets: [
          'Database per service; no shared schema across modules',
          'Tenant identifier stamped at the gateway, never accepted from the client',
          'Default-deny network policies between services',
          'Internal-auth header verified on every service as defence in depth',
        ],
      },
      {
        id: 'hosting',
        title: 'Hosting and residency',
        body: 'Azure is the primary target — managed Kubernetes, managed PostgreSQL, managed secrets, managed telemetry. Region selection is available at deployment. Self-hosting is a supported path rather than a grudging concession.',
        bullets: [
          'Primary: managed Kubernetes with Helm charts and Terraform',
          'Managed PostgreSQL with configured backup retention and geo-redundancy',
          'Secrets from a managed vault, not from environment files',
          'Self-hosted via Helm or Docker Compose',
        ],
      },
      {
        id: 'recovery',
        title: 'Backups and recovery',
        body: 'Automated backups with geo-redundant retention are configured in infrastructure code rather than set by hand. We do not publish an RPO or RTO number yet, because we have not completed and documented a restore drill — and a recovery objective you have not tested is a guess with a decimal point.',
        bullets: [
          'Automated backups, 35-day retention, geo-redundant, configured in Terraform',
          'Staged deploys with post-deploy smoke tests and automatic rollback',
          'A documented failover runbook with verify and rollback scripts',
        ],
      },
      {
        id: 'portability',
        title: 'Getting out',
        body: 'No cloud-provider SDK appears in application code. Every dependency is reachable over a standard protocol through an environment variable, adapters select their driver the same way, and a Compose stack boots the whole platform. If you want to leave, the path exists and is written down.',
        bullets: [
          'Storage driver selectable: azure-blob, s3-compatible, or local disk',
          'Documented failover matrix from managed services to free-tier equivalents',
          'CSV export on every list, and a REST API for everything else',
          'A Compose stack that runs all thirty services on one machine',
        ],
      },
      {
        id: 'disclosure',
        title: 'Reporting a vulnerability',
        body: 'If you find something, tell us and we will respond. We publish a contact and a response expectation rather than making you hunt for one.',
        bullets: [
          'security@algoryq.com',
          'A security.txt at the well-known location',
          'We will acknowledge within two business days',
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
