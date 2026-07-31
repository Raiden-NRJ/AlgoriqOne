/**
 * Homepage copy. Every claim traces to website/docs/00-audit-and-inventory.md.
 * Voice rules and banned words: docs/01 §6. Section specs: docs/04.
 *
 * Positioning (chosen 2026-07-31): deal → delivery → cash. The operational
 * chain is the promise; the shared permission model is the reason the promise
 * is credible, and appears as proof rather than as the headline (docs/01 §3).
 */

export const hero = {
  eyebrow: 'CRM · Projects · Time · Billing — one chain',
  headline: ['From won deal to paid invoice,', 'without leaving the platform.'],
  sub: 'Algoryq One connects your pipeline, your delivery team and your billing — so the hours your team logs are the hours you invoice, and nobody reconciles three systems to find out.',
  primaryCta: { label: 'Start free', href: '/signup' },
  secondaryCta: { label: 'See the chain', href: '#chain' },
  proofPoints: ['14-day free trial', 'No credit card', 'Self-hosted option available'],
} as const;

/** §3 The chain — the centrepiece. Each link names the module that owns it. */
export const chain = {
  eyebrow: 'The chain',
  headline: 'One record, five handoffs, no re-keying.',
  sub: 'This is the sequence a services business actually runs. In most stacks each arrow is an export, an email, or somebody retyping. Here each one is a database relationship.',
  links: [
    {
      stage: 'Deal',
      module: 'Sales',
      carries: 'Client, value, discount approval',
      detail:
        'A deal moves through stages with real governance — a discount past your threshold routes to an approver instead of being argued in a corridor.',
      service: 'sales-service',
    },
    {
      stage: 'Project',
      module: 'Projects',
      carries: 'The same client record, commercial terms',
      detail:
        'The won deal becomes a project. The client is the same record sales worked in, so there is no second spelling of the customer’s name.',
      service: 'project-service',
    },
    {
      stage: 'Plan',
      module: 'WBS & Tasks',
      carries: 'Scope, structure, owners',
      detail:
        'Break the work down, put it on a board, assign it. Resourcing draws on capacity that already accounts for approved leave.',
      service: 'wbs-service · task-service',
    },
    {
      stage: 'Time',
      module: 'Timesheets',
      carries: 'Hours against the work item',
      detail:
        'People log time against the thing they actually did, submit a week, and it is approved once — in the same inbox as every other decision.',
      service: 'timesheet-service',
    },
    {
      stage: 'Invoice',
      module: 'Billing',
      carries: 'Approved billable hours',
      detail:
        'Approved hours reconcile to the invoice. There is no export step in the middle, which is where the number usually stops being true.',
      service: 'billing-service',
    },
  ],
  footnote:
    'Every step is a permission check and an audit entry. That is why the number at the end can be trusted — see “Why the chain holds” below.',
} as const;

export const problem = {
  eyebrow: 'Where it breaks',
  headline: 'The problem was never the tools. It was the handoffs between them.',
  items: [
    {
      title: 'Sales closes and emails delivery',
      body: 'The client gets typed in again, slightly differently. Two records, one customer, no way to tell which is authoritative.',
    },
    {
      title: 'Delivery staffs from a stale picture',
      body: 'The resourcing spreadsheet does not know who booked leave in the HR system last week, so the plan is wrong before it starts.',
    },
    {
      title: 'Timesheets arrive in four channels',
      body: 'Some in the PSA, some in a spreadsheet, some in a message. Approval means chasing rather than deciding.',
    },
    {
      title: 'Finance rebuilds the month by hand',
      body: 'Export, merge, reconcile, query the differences, invoice late. Every month, forever, by the person you can least afford to lose.',
    },
  ],
  conclusion:
    'A CRM stops at the closed deal. A PSA starts after it. An HR system sits to one side of both. Nobody built the gap, so somebody in your business owns it manually — and that person is the integration.',
} as const;

export const thesis = {
  eyebrow: 'What changes',
  headline: 'We didn’t integrate the chain. We built it as one thing.',
  sub: 'Every step above runs on the same records, the same permission model and the same audit trail — so the handoffs stop being events that can fail.',
  rows: [
    {
      aspect: 'Deal → project',
      before: 'An email and a re-typed client',
      after: 'The same client record, carried forward',
    },
    {
      aspect: 'Resourcing',
      before: 'A spreadsheet that does not know about leave',
      after: 'Capacity that reflects approved leave immediately',
    },
    {
      aspect: 'Approvals',
      before: 'Four inboxes and a chase',
      after: 'One inbox, oldest first',
    },
    {
      aspect: 'Hours → invoice',
      before: 'Export, merge, reconcile',
      after: 'Approved hours attach to the invoice',
    },
    {
      aspect: 'Audit',
      before: 'Three partial trails',
      after: 'One append-only trail with change diffs',
    },
    {
      aspect: 'Offboarding',
      before: 'Three tickets, weeks of drift',
      after: 'One revoke, propagated everywhere',
    },
  ],
} as const;

export const permissions = {
  eyebrow: 'Why the chain holds',
  headline: 'Every approval in that chain is enforced. Not implied.',
  sub: 'A chain is only worth as much as the approvals along it. If “approved” means somebody clicked a button the interface happened to show them, the number at the end is a guess. In Algoryq One every one of the 30 services checks a permission before it acts — deny by default, verified in tests, recorded in the audit trail.',
  points: [
    'One catalog, one convention: module.resource.action, with wildcard expansion.',
    'Per-user grants and denies, with an expiry date. Deny always wins.',
    'Out-of-office delegation, so an absent approver does not stall the chain.',
    'Scoped assignments: global, org-unit, or a single record.',
  ],
  note: 'The interface gates on the same permissions — but as a convenience, not a boundary. We are explicit about that because a vendor who is vague about it usually has something to be vague about.',
} as const;

export const capabilities = {
  eyebrow: 'It bends to your process',
  headline: 'Your chain, not our idea of it.',
  cards: [
    {
      title: 'Workflow designer',
      body: 'Your approval policy, encoded rather than approximated. Sequential or parallel, role- or org-unit-based, with escalation timers.',
      href: '/platform/workflows',
      steps: ['Trigger', 'Condition', 'Approval', 'Notify'],
    },
    {
      title: 'Custom fields',
      body: 'Add a field to any entity, per tenant. It appears in the form, the table, the filters, and the API — so your data model can carry your terminology.',
      href: '/platform/customization',
      steps: ['Define', 'Form', 'Table', 'API'],
    },
    {
      title: 'AI assistant',
      body: 'Ask across everything you are allowed to see — and only that. Retrieval is permission-scoped and audited.',
      href: '/platform/ai',
      steps: ['Ask', 'Scope', 'Retrieve', 'Cite'],
    },
  ],
} as const;

export const intelligence = {
  eyebrow: 'Reporting',
  headline: 'Utilisation you can believe before the month ends.',
  sub: 'Because the hours, the projects and the invoices are the same records, billable ratio and utilisation are queries rather than reconstructions. Build a report, schedule it, deliver it.',
  points: [
    'Report builder with columns, filters and saved definitions',
    'Scheduled delivery through the notification service',
    'Dashboards with per-widget permissions',
    'CSV export on every list',
    'Cursor pagination, so large data sets stay fast',
  ],
} as const;

export const devices = {
  eyebrow: 'Everywhere your team works',
  headline: 'Approvals and timesheets, from wherever they are.',
  sub: 'The two steps in the chain that stall are the two that happen away from a desk. Responsive web on every modern browser, plus an installable PWA — macOS, Windows, Linux, iOS and Android.',
  honesty:
    'No native app store download, because there isn’t one. There is a fast web app that works offline for reads and installs to a home screen.',
} as const;

export const developers = {
  eyebrow: 'Open by default',
  headline: 'You own your data, and you can extend anything.',
  sub: 'A REST API for every module, a typed SDK, HMAC-signed webhooks, and API keys you rotate yourself — the same gateway our own applications use.',
  standards: [
    'REST',
    'OAuth 2.0 / OIDC',
    'SAML',
    'SCIM v2',
    'Webhooks (HMAC)',
    'Prometheus',
    'OpenTelemetry',
    'S3-compatible storage',
    'SMTP',
    'PostgreSQL',
  ],
  standardsNote: 'Standards we implement — not partner logos.',
  portability:
    'Azure-first, with a documented failover to free-tier equivalents and a Docker Compose stack that boots the entire platform. No lock-in you can’t undo.',
} as const;

export const solutions = [
  { label: 'Professional services', href: '/solutions/professional-services', kind: 'Industry' },
  { label: 'Agencies', href: '/solutions/agencies', kind: 'Industry' },
  { label: 'Technology', href: '/solutions/technology', kind: 'Industry' },
  { label: 'Delivery leaders', href: '/solutions/by-role/delivery', kind: 'Role' },
  { label: 'Finance', href: '/solutions/by-role/finance', kind: 'Role' },
  { label: 'IT & security', href: '/solutions/by-role/it', kind: 'Role' },
] as const;

export const finalCta = {
  headline: 'Stop reconciling. Start invoicing.',
  sub: 'Spin up a workspace in minutes. Bring your data when you’re ready.',
  primaryCta: { label: 'Start free', href: '/signup' },
  secondaryCta: { label: 'Talk to us', href: '/company/contact' },
  tertiary: {
    label: 'Or read the architecture first — we’d respect that too.',
    href: '/platform/architecture',
  },
} as const;
