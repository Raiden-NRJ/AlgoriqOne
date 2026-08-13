/**
 * Solutions pages (docs/06).
 *
 * Two axes: industry (the company's shape) and role (the reader's job).
 * No invented customer stories and no "companies like yours see X%" — where a
 * number would normally go, we state a mechanism instead, which is both honest
 * and harder to argue with.
 *
 * ── Content pass, 2026-08-10 ──────────────────────────────────────────────
 * Bullet-first, Zoho shape (see the note at the top of pages-product.ts).
 *
 * `by-role/it → exit` was the third copy of the portability argument on this
 * site. It now carries only what an inheriting IT owner needs on this page and
 * links to `/security/infrastructure`, which is canonical. See the note in
 * pages-platform.ts.
 */

import type { PageContent } from '@/components/page/page-template';

export type IndustryId = 'professional-services' | 'agencies' | 'technology';
export type RoleId = 'sales' | 'delivery' | 'hr' | 'it' | 'finance';

export const INDUSTRY_PAGES: Record<IndustryId, PageContent> = {
  'professional-services': {
    eyebrow: 'Professional services',
    title: 'Your business is the chain. So is this platform.',
    intro:
      'Whether you can win the work depends on who can staff it, which depends on capacity, which depends on leave. Three systems cannot answer that without a human in the middle.',
    chain: {
      active: ['Deal', 'Project', 'Plan', 'Time', 'Invoice'],
      note: 'This is the industry the whole chain was shaped around. Every link maps to something you already do on a Tuesday.',
    },
    jobs: [
      'Know whether you can staff a deal before you commit to it',
      'Track billable and internal work the same way',
      'Close the month without a reconciliation project',
    ],
    blocks: [
      {
        id: 'week',
        title: 'A week in a services firm',
        body: 'Every step is a real module. Every arrow is a database relationship, not an integration.',
        chain: [
          'Monday — pipeline review, with real capacity beside each deal',
          'Tuesday — resourcing conflict surfaces because leave is already known',
          'Wednesday — project request approved, WBS drafted',
          'Thursday — timesheets nudged, approvals cleared in one inbox',
          'Friday — approved hours reconcile to the invoice',
        ],
      },
      {
        id: 'problems',
        title: 'The three problems this solves',
        bullets: [
          'Utilisation is an estimate, because internal and billable work sit in different tools',
          'Resourcing is decided without knowing who is on leave next month',
          'Month-end billing is reconstructed from exports, not read from a record',
        ],
      },
      {
        id: 'configuration',
        title: 'How it is usually configured',
        body: 'Revenue, Delivery and People first; Service when a client portal opens.',
        panel: {
          label: 'Typical module set',
          items: ['CRM', 'Sales', 'Projects', 'WBS', 'Tasks', 'Timesheets', 'Capacity', 'Leave', 'Reporting'],
        },
        bullets: [
          'Roles: sales, delivery lead, consultant, people partner, finance, admin',
          'Approval chains: project request, timesheet, discount threshold, leave',
          'Custom fields for practice, region and engagement type',
        ],
      },
      {
        id: 'replace',
        title: 'What you would consolidate',
        bullets: [
          'A CRM, and a separate PSA or project tool',
          'A standalone time-tracking tool',
          'A resource-planning spreadsheet',
          'An HR system for leave and reviews',
          'Approvals currently living in email',
        ],
      },
      {
        id: 'migration',
        title: 'Getting your data across',
        body: 'We tell you which parts are clean and which need mapping before you start.',
        bullets: [
          'Companies, contacts, employees and projects import cleanly',
          'Historical activity and custom shapes need a mapping pass',
          'Import wizard with mapping, validation and a dry run',
          'API for anything the wizard does not cover',
          'Run in parallel for the first month if you want a safety net',
        ],
      },
    ],
    related: [
      { label: 'Delivery', href: '/product/delivery', description: 'Projects, WBS, timesheets.' },
      { label: 'People', href: '/product/people', description: 'Capacity and leave.' },
      { label: 'ROI calculator', href: '/roi', description: 'Run the consolidation maths.' },
    ],
  },

  agencies: {
    eyebrow: 'Agencies',
    title: 'Retainers, projects and a client who can see both.',
    intro:
      'The same chain, with retainers and projects side by side. The differentiator is the last link: your client logs in and watches their own projects and invoices.',
    chain: {
      active: ['Project', 'Plan', 'Time', 'Invoice'],
      note: 'Retainers and projects run the same links. The client sees the end of the chain from their own portal.',
    },
    jobs: [
      'Run retainers and projects without two systems',
      'Show clients their own status without a weekly deck',
      'Keep the billable ratio visible before the month ends',
    ],
    blocks: [
      {
        id: 'portal',
        title: 'The client portal is the hook',
        body: 'A separate application your clients log into. “What’s the status?” stops being an email.',
        bullets: [
          'Project status straight from the delivery records',
          'Invoices, with a payment journey',
          'Tickets with a real reply thread',
          'A knowledge base they can read themselves',
          'Your branding and your domain, per tenant',
        ],
      },
      {
        id: 'retainers',
        title: 'Retainers and projects together',
        body: 'Both are projects; only the time budget differs.',
        bullets: [
          'Client and internal projects tracked identically',
          'Utilisation includes the hours that usually go missing',
          'Time logged against work items, not free text',
          'Capacity and engagement views per person',
        ],
      },
      {
        id: 'configuration',
        title: 'How it is usually configured',
        panel: {
          label: 'Typical module set',
          items: ['CRM', 'Projects', 'Tasks', 'Timesheets', 'Capacity', 'Customer portal', 'Billing', 'Reporting'],
        },
        bullets: [
          'Custom fields for client, brand and campaign',
          'Approval chains on timesheets and scope changes',
          'A saved view per account team',
        ],
      },
    ],
    related: [
      { label: 'Service', href: '/product/service', description: 'The client portal.' },
      { label: 'White label', href: '/platform/white-label', description: 'Make it yours.' },
      { label: 'Delivery', href: '/product/delivery', description: 'The work itself.' },
    ],
  },

  technology: {
    eyebrow: 'Technology',
    title: 'For product companies with a delivery organisation attached.',
    intro:
      'You already have engineering tooling. What you do not have is one place where the commercial pipeline, the delivery org and the people data agree.',
    jobs: [
      'Run services delivery next to product work',
      'Give a security-literate buyer a straight answer',
      'Extend the platform rather than work around it',
    ],
    blocks: [
      {
        id: 'work',
        title: 'Work management engineers will tolerate',
        body: 'Not a replacement for your issue tracker — where delivery, time and commercial context meet.',
        bullets: [
          'Work-item hierarchy with rollups',
          'Sprints, epics and a backlog',
          'A board with real keyboard paths',
          'Time logged against items, feeding utilisation and billing',
        ],
      },
      {
        id: 'platform',
        title: 'Extensible on purpose',
        body: 'If your process needs something we did not build, build it without asking us.',
        bullets: [
          'Custom fields on any entity, per tenant',
          'A workflow designer and a typed SDK',
          'HMAC-signed webhooks with a delivery log',
          'API keys you rotate yourself',
          'Self-hosting via Helm or Compose, in your own cluster',
        ],
      },
      {
        id: 'security',
        title: 'For the security review',
        body: 'Published rather than gated behind an NDA.',
        bullets: [
          'Deny-by-default authorization in all thirty services',
          'SSO through OIDC or SAML, SCIM for provisioning',
          'Append-only audit trail with hash-chain tamper evidence',
          'Default-deny network isolation between services',
          'Structured logs, metrics and traces you can ingest yourself',
        ],
      },
    ],
    related: [
      { label: 'Architecture', href: '/platform/architecture', description: 'What you would run.' },
      { label: 'Developers', href: '/developers', description: 'API, SDK, webhooks.' },
      { label: 'Security', href: '/security', description: 'The control set.' },
    ],
  },
};

export const ROLE_PAGES: Record<RoleId, PageContent> = {
  sales: {
    eyebrow: 'For sales leaders',
    title: 'Will my reps actually use it?',
    intro:
      'Adoption follows friction. Activity capture sits on the record, the pipeline works with a pointer or a keyboard, and approvals happen in one inbox instead of a chase.',
    chain: {
      active: ['Deal'],
      note: 'You own the first link. What closes here arrives in delivery complete, which is why nobody re-types your client’s name.',
    },
    blocks: [
      {
        id: 'daily',
        title: 'What a rep touches daily',
        bullets: [
          'A pipeline board that works on a laptop and on a phone',
          'Activity logged against the contact, not into a void',
          'Deal governance that routes a discount instead of blocking it',
          'Search that finds the record without knowing where it lives',
        ],
      },
      {
        id: 'leader',
        title: 'What you get that they do not see',
        bullets: [
          'A weighted forecast built from the records they work in',
          'Capacity beside the pipeline, so commitments are informed',
          'Approval history on every discount, in the audit trail',
          'What your team closes is what delivery receives',
        ],
      },
    ],
    related: [
      { label: 'Revenue', href: '/product/revenue', description: 'The full cluster.' },
      { label: 'Mobile', href: '/platform/mobile', description: 'What it looks like on a phone.' },
    ],
  },

  delivery: {
    eyebrow: 'For delivery leaders',
    title: 'Can it handle real project structure?',
    intro:
      'You own the middle of the chain — the part where a deal that sounded profitable either stays that way or quietly does not.',
    chain: {
      active: ['Project', 'Plan', 'Time'],
      note: 'The three links you are accountable for, with a project that arrives complete and hours that leave ready to invoice.',
    },
    blocks: [
      {
        id: 'structure',
        title: 'Structure, not just a board',
        bullets: [
          'Project requests with a configurable approval chain',
          'WBS plans with submission and approval',
          'Work items with hierarchy, sprints and epics',
          'Client and internal projects tracked the same way',
        ],
      },
      {
        id: 'people',
        title: 'Resourcing that knows about people',
        body: 'Leave is a module on the same platform, so there is no sync window.',
        bullets: [
          'Capacity and engagement per person',
          'Approved leave reflected immediately',
          'Skills matrix for who can actually do the work',
        ],
      },
      {
        id: 'month-end',
        title: 'Month end',
        bullets: [
          'One approvals inbox for timesheets, requests and plans',
          'Approved hours reconcile against invoices',
          'Exports on every list, when someone insists on a spreadsheet',
        ],
      },
    ],
    related: [
      { label: 'Delivery', href: '/product/delivery', description: 'The full cluster.' },
      { label: 'Workflows', href: '/platform/workflows', description: 'Design your approvals.' },
    ],
  },

  hr: {
    eyebrow: 'For people leaders',
    title: 'Is the HR side real, or a checkbox?',
    intro:
      'Five services back it — leave, attendance, performance, recruitment and workplace — alongside the directory, org chart and skills. It is not a form bolted onto a CRM.',
    blocks: [
      {
        id: 'modules',
        title: 'What is actually built',
        bullets: [
          'Leave: types, policies, balances, requests, approvals',
          'Attendance: check-in and out, shifts, calendars, regularisation',
          'Performance: goals and OKRs, check-ins, review cycles, forms',
          'Recruitment: requisitions, pipeline, interview feedback, offers',
          'Workplace: announcements, policies, assets, expenses',
        ],
      },
      {
        id: 'advantage',
        title: 'The advantage of sharing a platform',
        body: 'Joiner-mover-leaver is one process rather than three.',
        bullets: [
          'HR sits on the same permission model as the rest of the business',
          'Onboarding checklists that provision access',
          'One revoke on exit, propagated across every service',
          'Approved leave visible to resourcing without a sync',
        ],
      },
      {
        id: 'payroll',
        title: 'Payroll',
        body: 'Payroll is jurisdiction-specific by nature — ask which are live before planning around it.',
        bullets: [
          'Runs on the platform, on the same permission model as HR',
          'Approved leave and attendance reach a pay run as records',
          'Not a spreadsheet exported on the last Friday of the month',
        ],
      },
    ],
    related: [
      { label: 'People', href: '/product/people', description: 'The full cluster.' },
      { label: 'Permissions', href: '/security/permissions', description: 'Joiner, mover, leaver.' },
    ],
  },

  it: {
    eyebrow: 'For IT and security',
    title: 'What exactly would I be inheriting?',
    intro:
      'Written for you, to the same standard as the architecture page — because you will read them together, and you are the visitor most able to check whether we are telling the truth.',
    jobs: [
      'Understand the operational footprint before you own it',
      'Verify the security posture without an NDA',
      'Confirm you can leave with your data',
    ],
    blocks: [
      {
        id: 'footprint',
        title: 'The operational footprint',
        bullets: [
          'Thirty stateless services behind one gateway',
          'Managed Kubernetes with autoscaling, or Compose on one machine',
          'PostgreSQL per service; migrations applied by a deploy job',
          'Structured logs, Prometheus metrics, OpenTelemetry traces',
          'Staged deploys with smoke tests and automatic rollback',
        ],
      },
      {
        id: 'identity',
        title: 'Identity and access',
        bullets: [
          'SSO through OIDC or SAML',
          'SCIM v2 for provisioning and deprovisioning',
          'Deny-by-default authorization enforced in every service',
          'Permission-version invalidation — revocation does not wait for a re-login',
          'Argon2id hashing, lockout, TOTP MFA, refresh rotation',
        ],
      },
      {
        id: 'isolation',
        title: 'Isolation and blast radius',
        body: 'Database per service means one module’s incident is not another module’s outage.',
        bullets: [
          'Default-deny network policy between services',
          'Internal-auth header verified downstream',
          'Tenant identifier stamped at the edge, never accepted from a caller',
        ],
      },
      {
        id: 'exit',
        title: 'The exit plan',
        body: 'Evaluate it now rather than discover it later.',
        bullets: [
          'No cloud SDK in application code; adapters selected by env var',
          'CSV export on every list, a REST API for everything else',
          'Full terms and the failover matrix: /security/infrastructure',
        ],
      },
    ],
    related: [
      { label: 'Architecture', href: '/platform/architecture', description: 'The full picture.' },
      { label: 'Permissions', href: '/security/permissions', description: 'The deepest page here.' },
      { label: 'Infrastructure', href: '/security/infrastructure', description: 'Hosting, recovery, exit.' },
    ],
  },

  finance: {
    eyebrow: 'For finance',
    title: 'Where do the numbers come from?',
    intro:
      'From the records the business works in, not an export that was correct on Tuesday. You sit at the end of the chain — the worst place to find that hours and invoice disagree.',
    chain: {
      active: ['Time', 'Invoice'],
      note: 'You own the last two links. Both read from the same records the work was done in, so month end is a query rather than a reconstruction.',
    },
    blocks: [
      {
        id: 'chain',
        title: 'From logged hour to invoice',
        chain: [
          'Time logged against a work item',
          'Timesheet submitted',
          'Approved by the delivery lead',
          'Billable hours attributed to the project',
          'Invoice raised',
          'Payment recorded',
        ],
      },
      {
        id: 'billing',
        title: 'Billing',
        bullets: [
          'Plans, subscriptions, invoices, payments and credit notes',
          'Money as integer cents with an explicit currency — never floats',
          'Usage metering and dunning',
          'A payment journey in the customer portal',
        ],
      },
      {
        id: 'controls',
        title: 'Controls your auditor will ask about',
        bullets: [
          'Append-only audit trail with per-field change diffs',
          'Approval history on discounts, timesheets and refunds',
          'Access reviews from one permission catalog, not three systems',
          'Retention policies and legal hold',
        ],
      },
    ],
    related: [
      { label: 'Intelligence', href: '/product/intelligence', description: 'Reporting.' },
      { label: 'Compliance', href: '/security/compliance', description: 'Audit and retention.' },
      { label: 'ROI calculator', href: '/roi', description: 'The consolidation maths.' },
    ],
  },
};

export const INDUSTRY_IDS = Object.keys(INDUSTRY_PAGES) as IndustryId[];
export const ROLE_IDS = Object.keys(ROLE_PAGES) as RoleId[];
