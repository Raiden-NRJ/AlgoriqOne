/**
 * Solutions pages (docs/06).
 *
 * Two axes: industry (the company's shape) and role (the reader's job).
 * No invented customer stories and no "companies like yours see X%" — where a
 * number would normally go, we state a mechanism instead, which is both honest
 * and harder to argue with.
 */

import type { PageContent } from '@/components/page/page-template';

export type IndustryId = 'professional-services' | 'agencies' | 'technology';
export type RoleId = 'sales' | 'delivery' | 'hr' | 'it' | 'finance';

export const INDUSTRY_PAGES: Record<IndustryId, PageContent> = {
  'professional-services': {
    eyebrow: 'Professional services',
    title: 'Your business is the chain. So is this platform.',
    intro:
      'Consultancies, systems integrators and IT services firms live and die on the sequence from won deal to paid invoice. Whether you can win the work depends on who can staff it, which depends on capacity, which depends on leave — and three systems cannot answer that without a human in the middle doing it by hand.',
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
        body: 'This is the loop the platform is shaped around. Every step below is a real module, and every arrow between them is a database relationship rather than an integration.',
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
          'Utilisation is an estimate because internal and billable work live in different tools',
          'Resourcing decisions are made without knowing who is on leave next month',
          'Month-end billing is reconstructed from exports rather than read from a record',
        ],
      },
      {
        id: 'configuration',
        title: 'How it is usually configured',
        body: 'Most firms turn on Revenue, Delivery and People first, add Service when they open a client portal, and enable the platform layer as their process outgrows the defaults.',
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
          'A CRM',
          'A project or PSA tool',
          'A separate time-tracking tool',
          'A resource-planning spreadsheet',
          'An HR system for leave and reviews',
          'Approvals currently living in email',
        ],
      },
      {
        id: 'migration',
        title: 'Getting your data across',
        body: 'Companies, contacts, employees and projects import cleanly through the wizard. Historical activity and anything custom-shaped needs a mapping pass — we will tell you which is which before you start, not after.',
        bullets: [
          'Import wizard with mapping, validation and a dry run',
          'API for anything the wizard does not cover',
          'Run in parallel during the first month if you want a safety net',
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
      'Creative and marketing agencies run the same chain, with retainers and projects side by side and a utilisation number that decides whether the month worked. The differentiator here is the last link: your client logs in and watches their own projects and invoices, so “what’s the status?” stops being an email.',
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
        body: 'A separate application your clients log into: their projects and status, their invoices with a payment journey, their support tickets, and a knowledge base. Branded as you, on your domain.',
        bullets: [
          'Project status straight from the delivery records',
          'Invoices and payment',
          'Tickets with a real reply thread',
          'Your branding and your domain, configured per tenant',
        ],
      },
      {
        id: 'retainers',
        title: 'Retainers and projects together',
        body: 'Both are projects; the difference is how time is budgeted against them. Because internal work is tracked the same way, the utilisation number includes the hours that usually go missing.',
        bullets: [
          'Client and internal projects tracked identically',
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
      'You already have engineering tooling. What you usually do not have is one place where the commercial pipeline, the delivery org and the people data agree — with an API good enough that your team will actually build against it.',
    jobs: [
      'Run services delivery next to product work',
      'Give a security-literate buyer a straight answer',
      'Extend the platform rather than work around it',
    ],
    blocks: [
      {
        id: 'work',
        title: 'Work management that engineers will tolerate',
        body: 'Work items with hierarchy, sprints, epics and a backlog, on a board with keyboard paths. It is not a replacement for your issue tracker — it is where delivery, time and commercial context meet.',
        bullets: [
          'Work-item hierarchy with rollups',
          'Sprints, epics and a backlog',
          'Time logged against items, feeding utilisation and billing',
        ],
      },
      {
        id: 'platform',
        title: 'Extensible on purpose',
        body: 'Custom fields, a workflow designer, webhooks, a typed SDK and an open REST API. If your process needs something we did not build, you can build it without asking us.',
        bullets: [
          'Custom fields on any entity, per tenant',
          'HMAC-signed webhooks with a delivery log',
          'API keys you rotate yourself',
          'Self-hosting via Helm or Compose if you want it in your own cluster',
        ],
      },
      {
        id: 'security',
        title: 'For the security review',
        body: 'Deny-by-default authorization in every service, SSO and SCIM, an append-only audit trail with hash-chain tamper evidence, and network isolation between services. The detail is published rather than gated behind an NDA.',
        bullets: [
          'SSO through OIDC or SAML, SCIM for provisioning',
          'Server-side permission checks in all thirty services',
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
      'Fair question, and the honest answer is that adoption follows friction. Activity capture sits on the record rather than in a separate log, the pipeline works with a pointer or a keyboard, and approvals happen in one inbox instead of a chase. The bonus: what your team closes is what delivery receives, so the handover stops being an argument.',
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
          'A weighted forecast built from the same records they work in',
          'Capacity beside the pipeline, so commitments are informed',
          'Approval history on every discount, in the audit trail',
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
      'Intake with an approval chain, a work breakdown structure with its own approvals, execution on a board, and time that reconciles to an invoice. You own the middle of the chain — the part where a deal that sounded profitable either stays that way or quietly does not.',
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
        body: 'Capacity accounts for approved leave, because leave is a module on the same platform. There is no sync window in which the two disagree.',
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
          'Exports on every list when someone insists on a spreadsheet',
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
      'Five services back it: leave, attendance, performance, recruitment and workplace, alongside the employee directory, org chart and skills. It is not a form bolted onto a CRM.',
    blocks: [
      {
        id: 'modules',
        title: 'What is actually built',
        bullets: [
          'Leave: types, policies, balances, requests, approvals',
          'Attendance: check-in and out, shifts, holiday calendars, regularisation',
          'Performance: goals and OKRs, check-ins, review cycles and forms',
          'Recruitment: requisitions, pipeline, interview feedback, offers',
          'Workplace: announcements, policies with acknowledgements, assets, expenses',
        ],
      },
      {
        id: 'advantage',
        title: 'The advantage of sharing a platform',
        body: 'Because HR sits on the same permission model as the rest of the business, joiner-mover-leaver is one process rather than three. Onboarding provisions access; offboarding revokes it everywhere at once, recorded in the audit trail.',
        bullets: [
          'Onboarding checklists that provision access',
          'One revoke on exit, propagated across every service',
          'Approved leave visible to resourcing without a sync',
        ],
      },
      {
        id: 'payroll',
        title: 'What is not here',
        body: 'There is no payroll. It is compliance-heavy, jurisdiction-specific, and deliberately last on the roadmap. Timesheets and leave export cleanly to whatever you run today.',
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
      'This page is written for you, and it is built to the same standard as the architecture page — because you will read them together, and because you are the visitor most able to check whether we are telling the truth.',
    jobs: [
      'Understand the operational footprint before you own it',
      'Verify the security posture without an NDA',
      'Confirm you can leave with your data',
    ],
    blocks: [
      {
        id: 'footprint',
        title: 'The operational footprint',
        body: 'Thirty stateless services behind one gateway, database per service, deployed by Helm onto managed Kubernetes with Terraform-managed infrastructure — or by Docker Compose onto a single machine if you would rather.',
        bullets: [
          'Managed Kubernetes with autoscaling, or self-hosted',
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
          'Permission-version invalidation, so revocation does not wait for a re-login',
          'Argon2id password hashing, lockout, TOTP MFA, refresh rotation',
        ],
      },
      {
        id: 'isolation',
        title: 'Isolation and blast radius',
        body: 'Database per service means one module’s incident is not another module’s outage. Network policies default to deny between services, and the gateway strips any identity header the client tried to set.',
        bullets: [
          'Default-deny network policy between services',
          'Internal-auth header verified downstream',
          'Tenant identifier stamped at the edge, never accepted from a caller',
        ],
      },
      {
        id: 'exit',
        title: 'The exit plan',
        body: 'We would rather you evaluate this now than discover it later. No cloud SDK in application code, adapters selected by environment variable, CSV export on every list, a REST API for everything else, and a Compose stack that runs the whole platform.',
      },
    ],
    related: [
      { label: 'Architecture', href: '/platform/architecture', description: 'The full picture.' },
      { label: 'Permissions', href: '/security/permissions', description: 'The deepest page here.' },
      { label: 'Infrastructure', href: '/security/infrastructure', description: 'Hosting and recovery.' },
    ],
  },

  finance: {
    eyebrow: 'For finance',
    title: 'Where do the numbers come from?',
    intro:
      'From the records the business works in, not from an export that was correct on Tuesday. You sit at the end of the chain, which is the worst place to discover that the hours and the invoice disagree — so here they are the same records, and every change carries an audit entry.',
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
          'Access reviews from one permission catalog rather than three systems',
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
