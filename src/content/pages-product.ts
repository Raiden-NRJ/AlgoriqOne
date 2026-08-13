/**
 * Product cluster pages (docs/05 §2–6).
 *
 * Every module name, permission key and service name is copied from the
 * codebase. Where a capability is partially delivered, the scopeNote says so
 * rather than blurring it.
 *
 * ── Content pass, 2026-08-10 ──────────────────────────────────────────────
 * Bullet-first, Zoho shape. `body` is now a *lead* — one short line that frames
 * the block — and is omitted entirely where it only paraphrased the bullets
 * under it. Everything enumerable is a bullet: concrete noun first, ~10 words,
 * five per group at most. Nothing was cut that made a claim the bullets do not;
 * claims that were only in prose were promoted, not dropped (rule 3).
 */

import type { PageContent } from '@/components/page/page-template';
import type { ClusterId } from './clusters';

type ProductPageId = Exclude<ClusterId, 'platform'>;

export const PRODUCT_PAGES: Record<ProductPageId, PageContent> = {
  revenue: {
    eyebrow: 'Revenue',
    title: 'Where the chain starts: the deal that becomes the work.',
    intro:
      'Leads, contacts, companies and activities, feeding a pipeline with real deal governance. Most CRMs treat the closed deal as the finish line. Here it is step one.',
    image: {
      src: '/hero/product-revenue.jpg',
      alt: 'A salesperson standing at a bright office window, phone to their ear and a notebook in hand, mid-conversation with a prospect.',
    },
    chain: {
      active: ['Deal'],
      note: 'This page covers the first link. A deal closed here becomes a project on the next one, with no re-keying in between.',
    },
    jobs: [
      'Qualify inbound and outbound demand without losing the trail',
      'Run a pipeline review from one source, not three exports',
      'Approve discounts against a threshold, not a hallway conversation',
    ],
    blocks: [
      {
        id: 'leads',
        title: 'Leads, contacts, companies, activities',
        body: 'The relationship graph every other module reads from.',
        bullets: [
          'Capture from the web, import in bulk, or create by API',
          'Contacts and companies linked by one shared timeline',
          'Calls, meetings and notes attached to the record itself',
          'History lives in the record, not in an inbox',
          'Global search, trimmed to what you are allowed to see',
        ],
        panel: {
          label: 'Permissions in this area',
          items: ['crm.lead.read', 'crm.lead.create', 'crm.contact.update', 'crm.activity.read'],
          mono: true,
        },
      },
      {
        id: 'pipeline',
        title: 'Pipeline and deals',
        bullets: [
          'Stages, values and a weighted forecast',
          'Discount thresholds route to an approver automatically',
          'Won deals hand off to delivery with client and terms',
          'Drag between stages, or use the “Move to…” menu',
          'Keyboard path on every board — most rivals cannot claim it',
        ],
        chain: ['Lead', 'Qualified', 'Deal', 'Governance approval', 'Won', 'Project created'],
        image: {
          src: '/illustrations/product-revenue.jpg',
          alt: 'A Kanban pipeline board with Lead, Qualified, Deal and Won columns, deal cards showing values and stage progress, one card mid-drag between columns, and a weighted-forecast chart comparing revenue against closed.',
        },
      },
      {
        id: 'handoff',
        title: 'The handoff that usually breaks',
        body: 'In a stitched stack, a won deal becomes an email to delivery.',
        bullets: [
          'Here it becomes a project record with value and approvals intact',
          'Client and company records are the ones delivery already uses',
          'Capacity reflects approved leave, with no nightly sync',
          'Billable hours reconcile against the invoice',
        ],
      },
      {
        id: 'api',
        title: 'Data and API',
        bullets: [
          'Every entity reachable through the public gateway',
          'The same permission checks the interface goes through',
        ],
        panel: {
          label: 'Services behind this cluster',
          items: ['crm-service', 'sales-service', 'search-service', 'audit-service'],
          mono: true,
        },
      },
    ],
    related: [
      { label: 'Delivery', href: '/product/delivery', description: 'Where a won deal goes next.' },
      { label: 'Intelligence', href: '/product/intelligence', description: 'Forecast and reporting.' },
      { label: 'Permissions', href: '/security/permissions', description: 'How access is enforced.' },
    ],
  },

  delivery: {
    eyebrow: 'Delivery',
    title: 'The middle three links, where most margin is lost.',
    intro:
      'Project, plan and time — the stretch between a signed deal and an invoice you can defend. Exactly where a CRM vendor stops and a PSA vendor starts.',
    image: {
      src: '/hero/product-delivery.jpg',
      alt: 'Two colleagues at a desk talking over a project timeline on a laptop screen, one pointing at a milestone.',
    },
    chain: {
      active: ['Project', 'Plan', 'Time'],
      note: 'Three links in one cluster. The project arrives with its client and terms already attached, and the hours leave it ready to invoice.',
    },
    jobs: [
      'Take in work through a real intake with an approval chain',
      'Break delivery down and track it where the work actually happens',
      'Close the month without chasing timesheets in four channels',
    ],
    blocks: [
      {
        id: 'intake',
        title: 'Clients, projects and project requests',
        bullets: [
          'Client and internal projects tracked identically',
          'Utilisation becomes a real number, not an estimate',
          'Requests arrive through a form with an approval chain',
          'Attachments, comments and a timeline on every project',
          'A customer portal showing the client their own status',
        ],
        panel: {
          label: 'Permissions in this area',
          items: ['project.read', 'project.request', 'project.update', 'wbs.read'],
          mono: true,
        },
      },
      {
        id: 'breakdown',
        title: 'WBS, tasks, sprints and epics',
        body: 'A breakdown structure for planning, a board for execution.',
        bullets: [
          'WBS plans with their own submission and approval flow',
          'Work items with parent/child hierarchy and rollups',
          'Sprints, epics, backlog and a Kanban board',
          'A plain board for teams that do not work in sprints',
        ],
        chain: ['Request', 'Approved', 'WBS', 'Tasks', 'Time logged', 'Timesheet approved', 'Billable'],
        image: {
          src: '/illustrations/product-delivery.jpg',
          alt: 'A work breakdown structure expanded as a nested tree of programmes, campaigns and features beside a weekly timesheet grid of hours logged per work item from Monday to Sunday, with an approved stamp over the week.',
        },
      },
      {
        id: 'time',
        title: 'Timesheets and capacity',
        bullets: [
          'Week editor, submission, approval and a calendar view',
          'Stacked per-day layout on phones below 400px',
          'Capacity planning that accounts for approved leave',
          'Resource engagement across projects, per person',
          'Approved hours reconcile against invoices in billing',
        ],
      },
      {
        id: 'accessibility',
        title: 'Accessible by construction',
        body: 'Send this section to procurement if accessibility is scored.',
        bullets: [
          'A “Move to…” menu beside every drag interaction',
          'Storybook accessibility checks fail the build on violation',
          'Contrast verified by script, not by eye',
        ],
      },
    ],
    related: [
      { label: 'People', href: '/product/people', description: 'Capacity, leave and the org.' },
      { label: 'Revenue', href: '/product/revenue', description: 'Where the work comes from.' },
      { label: 'Workflows', href: '/platform/workflows', description: 'Design the approval chains.' },
    ],
  },

  people: {
    eyebrow: 'People',
    title: 'The layer that keeps the chain honest about who is actually available.',
    intro:
      'A delivery plan built on a stale picture of your team is wrong before it starts. Leave, attendance, performance and hiring feed capacity directly.',
    image: {
      src: '/hero/product-people.jpg',
      alt: 'An HR professional shaking hands with a new hire in a bright office, welcoming them on their first day.',
    },
    chain: {
      active: ['Plan'],
      note: 'Capacity and approved leave feed the planning step directly. There is no sync window in which resourcing and HR disagree.',
    },
    jobs: [
      'Run the employee record, the org and the skills matrix in one place',
      'Approve leave where you approve everything else',
      'Provision and deprovision access as part of the people process',
    ],
    blocks: [
      {
        id: 'directory',
        title: 'Employees, org chart and skills',
        bullets: [
          'Employee directory with engagements and reportees',
          'Org chart built on first-class org units',
          'Org units the permission engine can scope access by',
          'Skills matrix, learning and certifications',
          'Capacity and utilisation, shared with delivery',
        ],
        image: {
          src: '/illustrations/product-people.jpg',
          alt: 'An org chart branching from a chief executive through vice presidents to managers and team leads, overlaid with a leave calendar showing booked days and a skills matrix listing each role against its recorded skills and levels.',
        },
        panel: {
          label: 'Permissions in this area',
          items: ['employee.read', 'employee.capacity', 'talentory.read', 'leave.request.read'],
          mono: true,
        },
      },
      {
        id: 'leave-attendance',
        title: 'Leave and attendance',
        bullets: [
          'Leave types, policies, balances and requests',
          'Check-in and check-out, shifts, holiday calendars',
          'Regularisation requests with an approval path',
          'One approval engine and one inbox, as everywhere else',
          'Approved leave changes capacity immediately — nothing to sync',
        ],
      },
      {
        id: 'performance-hiring',
        title: 'Performance and recruitment',
        bullets: [
          'Goals and OKRs with check-ins',
          'Review cycles and forms',
          'Requisitions, candidate pipeline, interview feedback, offers',
          'Hire-to-onboarding as a workflow, not a spreadsheet',
          'Announcements, policies, assets and expenses',
        ],
        chain: [
          'Requisition',
          'Hire',
          'Onboarding checklist',
          'Access provisioned',
          'Capacity updated',
          'Review cycle',
        ],
      },
      {
        id: 'offboarding',
        title: 'The offboarding story',
        body: 'The strongest security argument the platform has.',
        bullets: [
          'One revoke reaches every module, not one system at a time',
          'Permission-version invalidation — no re-login required',
          'Every grant and revoke lands in the append-only audit log',
          'Compare: three tickets and weeks of drift in a stitched stack',
        ],
      },
    ],
    related: [
      { label: 'Delivery', href: '/product/delivery', description: 'Capacity and timesheets.' },
      { label: 'Permissions', href: '/security/permissions', description: 'The engine underneath.' },
      { label: 'Workflows', href: '/platform/workflows', description: 'Onboarding and exit flows.' },
    ],
  },

  service: {
    eyebrow: 'Service',
    title: 'What happens after the invoice — and the portal your client sees it in.',
    intro:
      'The chain does not end at billing; it loops. A help desk, a knowledge base, and a portal where your client watches their own project and pays their own invoice.',
    image: {
      src: '/hero/product-service.jpg',
      alt: 'A support agent laughing at their desk while wearing a headset, mid-call with a customer.',
    },
    chain: {
      active: ['Invoice'],
      note: 'Your client sees the end of the chain from their side: project status, the invoice, and a way to ask about either without emailing an account manager.',
    },
    jobs: [
      'Take a ticket and actually reply to it in the product',
      'Publish answers once, in a knowledge base both sides can read',
      'Give clients a login that shows their projects, invoices and tickets',
    ],
    blocks: [
      {
        id: 'tickets',
        title: 'Tickets, replies and SLA',
        bullets: [
          'Reply threads with rich text and mentions',
          'Assignment and SLA timers',
          'Notifications through the shared multi-channel service',
          'Full history in the audit trail',
          'Without a reply thread the record becomes fiction',
        ],
        image: {
          src: '/illustrations/product-service.jpg',
          alt: 'A support ticket reply thread alternating between a customer reporting an API error and an agent responding, with an SLA countdown badge above it, beside a customer portal panel showing project status at 75% complete and a paid invoice.',
        },
        panel: {
          label: 'Permissions in this area',
          items: ['help.ticket.read', 'help.ticket.comment', 'knowledgebase.article.read'],
          mono: true,
        },
      },
      {
        id: 'knowledge',
        title: 'Knowledge base',
        bullets: [
          'Categories, articles, drafts and publishing',
          'Version history with restore',
          'One set of content, permission-trimmed per audience',
          'Also powers the public resources feed on this site',
        ],
      },
      {
        id: 'customer-portal',
        title: 'The customer portal',
        body: 'A separate application for your clients, scoped server-side to their tenant.',
        bullets: [
          'Projects and delivery status, from the same project records',
          'Invoices, with a payment journey',
          'Tickets and replies',
          'Branding and domain configurable per tenant',
        ],
        chain: ['Ticket raised', 'Assigned', 'SLA timer', 'Reply thread', 'Resolved'],
      },
    ],
    related: [
      { label: 'White label', href: '/platform/white-label', description: 'Your brand on their portal.' },
      { label: 'Delivery', href: '/product/delivery', description: 'What the client is watching.' },
      { label: 'Workflows', href: '/platform/workflows', description: 'Escalation and SLA rules.' },
    ],
  },

  intelligence: {
    eyebrow: 'Intelligence',
    title: 'Read the whole chain at once, without exporting any of it.',
    intro:
      'Utilisation, billable ratio and forecast span every link, which is why a stitched stack cannot answer them. Here they are queries over the records the work was done in.',
    image: {
      src: '/hero/product-intelligence.jpg',
      alt: 'An analyst studying charts on a large monitor in a dim office, reading a utilisation trend.',
    },
    chain: {
      note: 'Reporting reads across every step. Because the pipeline, the hours and the invoices are the same records, utilisation is a query rather than a reconstruction.',
    },
    jobs: [
      'Build a report without exporting three systems into a spreadsheet',
      'Find anything, without seeing what you should not',
      'Ask a question in plain language and get a cited answer',
    ],
    blocks: [
      {
        id: 'reports',
        title: 'Report builder and dashboards',
        bullets: [
          'Entity, columns, filters — saved as a definition',
          'Scheduled delivery through the notification service',
          'Dashboards and widgets, each with its own permission',
          'CSV export on every list, cursor pagination on hot ones',
          'Reports and audit entries read the same events, so they cannot disagree',
        ],
        image: {
          src: '/illustrations/product-intelligence.jpg',
          alt: 'A report builder with a row of filter selectors above a dashboard of saved widgets — a bar chart, a line chart, a donut chart and a single stat number — alongside an assistant panel summarising the trend in the current data.',
        },
        panel: {
          label: 'Permissions in this area',
          items: ['reporting.report.read', 'reporting.dashboard.read', 'assistant.chat.use'],
          mono: true,
        },
      },
      {
        id: 'search',
        title: 'Permission-trimmed global search',
        body: 'The difference between a search box and a data leak.',
        bullets: [
          'One index across leads, contacts, projects, tasks, tickets, people',
          'Results trimmed at query time by the same permission catalog',
          'Command palette for keyboard navigation',
        ],
      },
      {
        id: 'assistant',
        title: 'The assistant',
        body: 'Every vendor claims AI. Ask whether theirs can surface a record you may not read.',
        bullets: [
          'Retrieval scoped to the asker’s permissions',
          'AI actions recorded in the audit trail',
          'An offline engine where no external call is acceptable',
          'Can be turned off per tenant',
        ],
        chain: ['Ask', 'Scope to permissions', 'Retrieve', 'Answer with sources'],
      },
    ],
    related: [
      { label: 'AI governance', href: '/platform/ai', description: 'What is sent where, and how to disable it.' },
      { label: 'Permissions', href: '/security/permissions', description: 'What scopes the results.' },
      { label: 'Developers', href: '/developers', description: 'Get the same data by API.' },
    ],
  },
};

export const PRODUCT_PAGE_IDS = Object.keys(PRODUCT_PAGES) as ProductPageId[];
