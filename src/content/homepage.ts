/**
 * Homepage copy. Every claim traces to docs/00-audit-and-inventory.md.
 * Voice rules and banned words: docs/01 §6. Section specs: docs/04.
 *
 * Positioning (chosen 2026-07-31): deal → delivery → cash. The operational
 * chain is the promise; the shared permission model is the reason the promise
 * is credible, and appears as proof rather than as the headline (docs/01 §3).
 *
 * ── Restructure, 2026-08-10 ────────────────────────────────────────────────
 * Reworked to a Zoho-style shape at the client's request: fewer sections, one
 * idea each, headers over paragraphs, and subtext converted to scannable lines.
 * Sixteen rendered sections became twelve. Four merged away as standalone
 * beats — `thesis` into `problem`, `architecture` into `platform`, `devices`
 * into `capabilities` — and `solutionsIntro` / `solutions` were deleted with
 * their section.
 *
 * **All four homepage videos were kept and none moved.** Hero, Problem,
 * Intelligence and Developers each host one, so those four sections were
 * off-limits for removal regardless of what the section arithmetic wanted.
 * See docs/homepage-section-reduction-proposal.md for the version of this plan
 * that did not have that constraint.
 */

export const hero = {
  eyebrow: 'CRM · Projects · Time · Billing — one chain',
  /*
   * Two segments because the second is set in the accent colour, not because
   * of where the line breaks. The separator moved from a comma to an em dash
   * on 2026-08-31: with the halves in two different colours on footage, a
   * comma at the end of the first line read as a stray mark rather than as
   * punctuation joining them.
   */
  headline: ['From won deal to paid invoice —', 'without leaving the platform.'],
  // Tightened from 30 words. Deliberately still echoes SITE.description — one
  // is the H1 subhead, one is the meta description, and the overlap is good
  // for SEO (spacing-content-audit B9).
  sub: 'Pipeline, delivery and billing on one platform — so the hours your team logs are the hours you invoice.',
  primaryCta: { label: 'Start free', href: '/signup' },
  secondaryCta: { label: 'See the chain', href: '#chain' },
  proofPoints: ['14-day free trial', 'No credit card', 'Self-hosted option available'],
  /*
   * Rule 1 disclosure for the background footage, which shows an interface
   * carrying invented deals, clients and amounts. Deliberately does *not* say
   * "Demo tenant": this is not that dataset, and claiming it would be the
   * fabricated-provenance problem rather than a fix for it.
   */
  visualNote: 'Background footage. Any interface shown is illustrative, not a product screenshot.',
} as const;

/**
 * §1 hero visual — the integration web: the portal in the middle, the modules
 * that feed it wired around the outside.
 *
 * This is the fallback for the hero video, and the reason blocker B10 has a
 * workable interim option: every string below is rendered from data, so it
 * cannot be misspelled the way the video's baked-in text is.
 *
 * Node labels confirmed against the product by the owner (2026-07-31), Payroll
 * and HRIS included. Payroll is the one to watch: the solutions page carried a
 * "there is no payroll" line until that same date, so if the module is ever
 * pulled back, this node and pages-solutions.ts `payroll` move together or the
 * site contradicts itself.
 *
 * The activity rows are Demo-tenant sample data and are labelled as such
 * underneath the illustration (CLAUDE.md rule 1).
 */
export const heroVisual = {
  /** Text equivalent — the illustration itself is aria-hidden. */
  alt: 'An illustration of the Algoryq One portal at the centre of seven wired modules — CRM, HRMS, Payroll, Sales, Timesheet, HRIS and Projects Gantt — with the portal showing a “My actions” feed of recent events: a new lead, a raised invoice, a project milestone, logged time and an approved timesheet.',
  nodes: [
    { id: 'crm', label: 'CRM' },
    { id: 'hrms', label: 'HRMS' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'sales', label: 'Sales' },
    { id: 'timesheet', label: 'Timesheet' },
    { id: 'hris', label: 'HRIS' },
    { id: 'projects', label: 'Projects Gantt' },
  ],
  portal: {
    url: 'portal.one.algoryq.com/actions',
    nav: ['Dashboard', 'CRM', 'Projects', 'Time & Work', 'People', 'Business'],
    heading: 'My actions',
    /*
     * Titles are the reference's, verbatim where they were coherent. Its
     * subtitles were not — every row repeated its own title back, and two named
     * a "Project X" — so the metas are written against the demo tenant instead.
     */
    items: [
      { icon: 'lead', title: 'New Lead Added', meta: 'Orbit Health · qualified', tone: 'success' },
      { icon: 'payroll', title: 'Payroll Run for Q2', meta: 'Awaiting finance approval', tone: 'brandStrong' },
      { icon: 'milestone', title: 'Milestone Achieved', meta: 'Atlas CRM Rollout · phase 2', tone: 'neutral' },
      { icon: 'time', title: 'Time Logged by A. Kapoor', meta: '8h · Atlas CRM Rollout', tone: 'brand' },
      { icon: 'time', title: 'Timesheet Approved', meta: 'A. Kapoor · 38h · week 30', tone: 'brand' },
    ],
  },
} as const;

export type HeroVisualNodeId = (typeof heroVisual)['nodes'][number]['id'];

/** §2 The chain — the centrepiece. Each link names the module that owns it. */
export const chain = {
  eyebrow: 'The chain',
  headline: 'One record, five handoffs, no re-keying.',
  // Was 30 words and opened by describing itself ("This is the sequence a
  // services business actually runs"). Cut to the contrast that matters.
  sub: 'In most stacks every arrow is an export, an email, or somebody retyping. Here each one is a database relationship.',
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
    'Every step is a permission check and an audit entry. That is why the number at the end can be trusted.',
} as const;

/**
 * §3 Where it breaks — now carries what was §4 Thesis as well.
 *
 * Two changes, both density:
 *
 * 1. `items` were `{ title, body }` pairs — a bold line plus two sentences,
 *    four times over. They are now single scannable lines. Nothing here is a
 *    capability claim; these describe the visitor's current stack, not our
 *    product, so rule 3 does not attach. The long-form versions are on
 *    /solutions/professional-services and /solutions/agencies.
 * 2. `rows` moved here from `thesis`. Problem stated the failures and Thesis
 *    answered them one section later, which meant the answer arrived after a
 *    section break and a video. They now sit in one beat: the failures, then
 *    what replaces them.
 *
 * The section keeps SystemArchVideo. That is why the merge went this way round
 * rather than folding Problem into Chain.
 */
export const problem = {
  eyebrow: 'Where it breaks',
  headline: 'The tools were never the problem. The handoffs were.',
  items: [
    'Sales closes, emails delivery, and the client gets typed in a second time.',
    'Resourcing plans from a spreadsheet that does not know who booked leave.',
    'Timesheets arrive in four channels, so approving means chasing.',
    'Finance rebuilds the month by hand — every month, by the person you can least afford to lose.',
  ],
  conclusion:
    'A CRM stops at the closed deal. A PSA starts after it. Nobody built the gap, so somebody in your business owns it manually — and that person is the integration.',
  /** The "and here is what replaces it" half. Was §4 Thesis. */
  change: {
    label: 'What changes',
    rows: [
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
      {
        aspect: 'Everything above',
        before: 'Integrated after the fact',
        after: 'One record, one permission model, one trail',
      },
    ],
  },
} as const;

/**
 * §4 The platform — was §5 Clusters and §6 Architecture, two adjacent sections
 * that both enumerated the same six clusters from the same array (audit B5).
 *
 * The ClusterSwitcher carries the six clusters — modules, per-cluster chain,
 * permission keys — so it stays as the body. Architecture's genuinely distinct
 * material is the layer diagram underneath it: four applications, one gateway,
 * a shared spine. Its cluster cards were the duplicated half and are gone; each
 * cluster's full service list is on its own /product/{cluster} page.
 */
export const platform = {
  eyebrow: 'The platform',
  headline: 'Six clusters. Thirty services. One gateway.',
  // Was three clauses in one 34-word sentence. The gateway detail moved to the
  // diagram, where it labels the thing it describes.
  sub: 'Every step in the chain is a full product, not a tab — and all of them sit on one gateway and one shared spine.',
  srDescription:
    'Architecture: four applications call a single API gateway, which routes to thirty services grouped into six clusters, over a shared platform spine of identity, authorization, audit, notification, search, tenant, workflow and reporting services.',
  diagramLabel: 'How it fits together',
  gateway: {
    title: 'API gateway',
    detail:
      'Validates the JWT · strips spoofable identity headers · stamps tenant and user · rate limits · routes',
  },
  spineLabel: 'Shared platform spine — every cluster uses these',
  cta: 'Read how the architecture holds up',
} as const;

/** §5 Permissions — the wedge, on the dark band. */
export const permissions = {
  eyebrow: 'Why the chain holds',
  headline: 'Every approval in that chain is enforced. Not implied.',
  // Was 57 words across three sentences. The "if approved just means somebody
  // clicked a button" argument is made better and at the right length on
  // /security/permissions, which this section links to.
  sub: 'A chain is worth exactly what its approvals are worth. All 30 services check a permission before they act — deny by default, verified in tests, recorded in the audit trail.',
  /*
    Two bullets, not four (audit B3). The two cut — "One catalog, one
    convention: module.resource.action, with wildcard expansion." and "Scoped
    assignments: global, org-unit, or a single record." — were restatements of
    /security/permissions' own block titles, the second verbatim but for a
    hyphen. Both claims are stated in full there, one click away via the link at
    the foot of this section, so no capability lost its evidence (rule 3).
  */
  points: [
    'Per-user grants and denies, with an expiry date. Deny always wins.',
    'Out-of-office delegation, so an absent approver does not stall the chain.',
  ],
  note: 'Hiding a button is not access control. The 403 comes from the service, so a direct call to the same endpoint gets the same answer the interface did.',
} as const;

/**
 * §6 Built to fit — was §7 Capabilities plus §9 Devices.
 *
 * Devices was a full section carrying one idea (approvals and timesheets happen
 * away from a desk) and three CSS device frames. It is now the fourth card
 * here, keeping the claim and the phone frame; the desktop and tablet frames
 * were cut as decoration. /platform/mobile keeps the detail, including both
 * copies of the explicit no-native-app negation (rule 1 — the homepage still
 * makes no native-app claim, it describes the PWA that exists).
 *
 * Card bodies were cut to one line each. The `steps` chips carry the mechanism
 * visually, so a sentence explaining the same four words was doing nothing.
 */
export const capabilities = {
  eyebrow: 'Built to fit',
  headline: 'Your process, not our idea of it.',
  cards: [
    {
      title: 'Workflow designer',
      body: 'Your approval policy encoded, not approximated — sequential or parallel, with escalation timers.',
      href: '/platform/workflows',
      steps: ['Trigger', 'Condition', 'Approval', 'Notify'],
    },
    {
      title: 'Custom fields',
      body: 'Add a field to any entity, per tenant. It shows up everywhere, including the API.',
      href: '/platform/customization',
      steps: ['Define', 'Form', 'Table', 'API'],
    },
    {
      title: 'AI assistant',
      body: 'Ask across everything you are allowed to see, and only that. Retrieval is permission-scoped.',
      href: '/platform/ai',
      steps: ['Ask', 'Scope', 'Retrieve', 'Cite'],
    },
    {
      title: 'Mobile & offline',
      body: 'The two steps that stall happen away from a desk. Responsive web plus an installable PWA.',
      href: '/platform/mobile',
      steps: ['Approve', 'Log time', 'Offline read', 'Install'],
    },
  ],
} as const;

/** §7 Reporting. Visual is a static screenshot as of 2026-08-10. */
export const intelligence = {
  eyebrow: 'Reporting',
  headline: 'Utilisation you can believe before the month ends.',
  // Was 28 words. The bullets below already say what the reporting does, so the
  // sub now only has to say why the numbers can be trusted.
  sub: 'Hours, projects and invoices are the same records — so utilisation is a query, not a reconstruction.',
  points: [
    'Report builder with columns, filters and saved definitions',
    'Scheduled delivery through the notification service',
    'Dashboards with per-widget permissions',
    'CSV export on every list',
    'Cursor pagination, so large data sets stay fast',
  ],
} as const;

/** §8 Open by default. Keeps TerminalVideo. */
export const developers = {
  eyebrow: 'Open by default',
  headline: 'You own your data, and you can extend anything.',
  sub: 'A REST API for every module, a typed SDK, HMAC-signed webhooks — the same gateway our own applications use.',
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
  // Was 26 words. Kept as a single claim; the failover runbook and the Compose
  // stack are detailed on /platform/architecture §portability.
  portability: 'A documented failover off our primary cloud, and a Docker Compose stack that boots the whole platform.',
} as const;

/**
 * §9 Security & trust — the homepage teaser only. The control statements
 * themselves live in content/proof.ts and are canonical on /security.
 *
 * The headline used to be “Security you can verify, not just read about.” —
 * word-for-word the H1 of /security, under a grid of the same six cards that
 * page opens with, so the click delivered nothing (audit B2.1/B2.4). This side
 * now teases and routes; /security keeps its copy, which is the canonical
 * version of the claim (rule 3).
 */
export const security = {
  eyebrow: 'Security & trust',
  headline: 'Built to survive a security review.',
  sub: 'The three areas a reviewer opens with. All six, the posture table, and where we stand on SOC 2 are published — no NDA.',
  teaserAreas: ['Authorization', 'Audit', 'Isolation'],
  cta: 'Open the trust centre',
} as const;

/** §10 Testimonials — heading only; the section is gated on content/proof.ts. */
export const testimonialsIntro = {
  eyebrow: 'In their words',
  headline: 'What teams say after they consolidate.',
} as const;

/*
  `roiIntro` moved to content/pricing.ts as `CALCULATOR` on 2026-08-10, with the
  section it titled. The consolidation calculator now lives on /pricing, between
  "What you can switch on" and the pricing FAQ, where a visitor is already
  reasoning about per-seat cost. The full version stays at /roi.
*/

/**
 * §11 FAQ. Was the verbatim H1 of /faq (audit B2.2); the count differentiates
 * it and signals that /faq holds more. HOMEPAGE_FAQS is six items — if that
 * filter ever changes, this number changes with it.
 */
export const faqIntro = {
  eyebrow: 'Before you ask',
  headline: 'Six questions, answered before the call.',
  cta: 'All questions',
} as const;

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
