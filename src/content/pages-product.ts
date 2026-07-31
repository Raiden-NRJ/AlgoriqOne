/**
 * Product cluster pages (docs/05 §2–6).
 *
 * Every module name, permission key and service name is copied from the
 * codebase. Where a capability is partially delivered, the scopeNote says so
 * rather than blurring it.
 */

import type { PageContent } from '@/components/page/page-template';
import type { ClusterId } from './clusters';

type ProductPageId = Exclude<ClusterId, 'platform'>;

export const PRODUCT_PAGES: Record<ProductPageId, PageContent> = {
  revenue: {
    eyebrow: 'Revenue',
    title: 'Where the chain starts: the deal that becomes the work.',
    intro:
      'Leads, contacts, companies and activities feed a pipeline with real deal governance. Most CRMs treat the closed deal as the finish line. Here it is step one — the won deal becomes a project, carrying the client record and the commercial terms with it.',
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
        body: 'The relationship graph the rest of the platform reads from. Every entity carries an activity timeline, so the history is in the record rather than in somebody’s memory or inbox.',
        bullets: [
          'Capture from the web, import in bulk, or create by API',
          'Contacts and companies linked, with a shared timeline per entity',
          'Activities — calls, meetings, notes — attached to the record they belong to',
          'Global search across every entity, trimmed to what you are allowed to see',
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
        body: 'A board you can work with a pointer, a touch screen, or a keyboard. Drag a deal between stages, or use the “Move to…” menu — the guaranteed keyboard path, present on every board in the platform.',
        bullets: [
          'Stages, values and weighted forecast built on the shared chart system',
          'Deal governance: discount thresholds route to an approver automatically',
          'Won deals hand off to delivery, carrying the client and the commercial terms',
          'Accessible drag-and-drop, which most competitors cannot claim',
        ],
        chain: ['Lead', 'Qualified', 'Deal', 'Governance approval', 'Won', 'Project created'],
      },
      {
        id: 'handoff',
        title: 'The handoff that usually breaks',
        body: 'In a stitched stack, a won deal becomes an email to delivery. Here it becomes a project record, with the client, the value and the approval history intact — and the resourcing view already knows who is available, because capacity and leave live on the same platform.',
        bullets: [
          'Client and company records are the same records delivery uses',
          'Capacity reflects approved leave without a nightly sync',
          'Billable hours logged against the project reconcile to the invoice',
        ],
      },
      {
        id: 'api',
        title: 'Data and API',
        body: 'Every entity in this cluster is available through the same gateway your own applications use, with the same permission checks applied.',
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
      'Project, plan and time — the stretch between a signed deal and an invoice you can defend. This is exactly where a CRM-only vendor stops and a PSA vendor starts, and the seam between them is the gap somebody in your business currently owns by hand.',
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
        body: 'Client-facing and internal work are tracked the same way, so utilisation is a real number rather than an estimate. Requests come in through a form with an approval chain, not a direct message.',
        bullets: [
          'Client projects and internal projects, side by side',
          'Project requests with a configurable approval chain',
          'Attachments, comments and an activity timeline on every project',
          'A customer portal where the client sees their own project status',
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
        body: 'A work breakdown structure for planning and a board for execution, with the hierarchy that connects them. Sprints and epics for teams that work that way; a plain board for teams that do not.',
        bullets: [
          'WBS plans with their own submission and approval flow',
          'Work items with parent/child hierarchy and rollups',
          'Sprints, epics, backlog and a Kanban board',
          'Keyboard-accessible board interactions throughout',
        ],
        chain: ['Request', 'Approved', 'WBS', 'Tasks', 'Time logged', 'Timesheet approved', 'Billable'],
      },
      {
        id: 'time',
        title: 'Timesheets and capacity',
        body: 'A week editor built for the way people actually fill timesheets — including on a phone at the end of the week, where a stacked layout replaces the desktop grid below 400px. Approvals land in the same inbox as deals and leave.',
        bullets: [
          'Week editor, submission, approval and a calendar view',
          'Capacity planning that accounts for approved leave',
          'Resource engagement across projects, per person',
          'Approved hours reconcile against invoices in billing',
        ],
      },
      {
        id: 'accessibility',
        title: 'Accessible by construction',
        body: 'Every board in the platform ships a “Move to…” menu alongside drag-and-drop, so a keyboard or screen-reader user has a guaranteed path. If your procurement process includes an accessibility requirement, this is the section to send.',
        bullets: [
          'Keyboard path for every drag interaction',
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
      'A delivery plan built on a stale picture of your team is wrong before it starts. Leave, attendance, performance and hiring are not a separate system bolted on here — they feed capacity directly, which is what makes the plan and the forecast worth reading.',
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
        body: 'The people record that capacity, projects and reporting all read from. Reporting lines are org units, which the permission engine can also scope access by.',
        bullets: [
          'Employee directory with engagements and reportees',
          'Org chart built on first-class org units',
          'Skills & Learning: skills matrix, learning, certifications',
          'Capacity and utilisation, shared with delivery',
        ],
        panel: {
          label: 'Permissions in this area',
          items: ['employee.read', 'employee.capacity', 'talentory.read', 'leave.request.read'],
          mono: true,
        },
      },
      {
        id: 'leave-attendance',
        title: 'Leave and attendance',
        body: 'Policies, accrual and balances, with requests that route through the same approval engine as everything else — and land in the same inbox. Approved leave changes capacity immediately, because there is nothing to sync.',
        bullets: [
          'Leave types, policies, balances and requests',
          'Check-in and check-out, shifts, holiday calendars',
          'Regularisation requests with an approval path',
          'Capacity and project planning reflect both automatically',
        ],
      },
      {
        id: 'performance-hiring',
        title: 'Performance and recruitment',
        body: 'Goals and review cycles for the people you have; requisitions, pipeline and offers for the people you are hiring. The handoff between them is an onboarding workflow rather than a spreadsheet.',
        bullets: [
          'Goals and OKRs with check-ins',
          'Review cycles and forms',
          'Requisitions, candidate pipeline, interview feedback, offers',
          'Announcements, policies with acknowledgements, assets and expenses',
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
        body: 'This is the strongest security argument the platform has. In a three-system stack, revoking access means three tickets and weeks of drift. Here it is one revoke, propagated by permission version, across every service — and recorded in the audit trail with a change diff.',
        bullets: [
          'One revoke reaches every module, not one system at a time',
          'Permission-version invalidation, so it takes effect without a re-login',
          'Every grant and revoke lands in the append-only audit log',
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
      'The chain does not end at billing; it loops. A help desk with real reply threads, a knowledge base, and a customer-facing portal where your client watches their own project, pays their own invoice and raises their own ticket. It is a shipping product, not a roadmap item.',
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
        body: 'Tickets carry a reply thread, assignment and SLA timers. The reply thread matters more than it sounds: without it, the conversation leaves the system and the record becomes fiction.',
        bullets: [
          'Reply threads with rich text and mentions',
          'Assignment and SLA timers',
          'Notifications through the shared multi-channel service',
          'Full history in the audit trail',
        ],
        panel: {
          label: 'Permissions in this area',
          items: ['help.ticket.read', 'help.ticket.comment', 'knowledgebase.article.read'],
          mono: true,
        },
      },
      {
        id: 'knowledge',
        title: 'Knowledge base',
        body: 'Categories and articles with a publishing workflow, readable by staff in the portal and by clients in the customer portal — the same content, permission-trimmed.',
        bullets: [
          'Categories, articles, drafts and publishing',
          'Version history with restore',
          'Also powers the public resources feed on this site',
        ],
      },
      {
        id: 'customer-portal',
        title: 'The customer portal',
        body: 'A separate application for your clients: project status, invoices and payment, support tickets and the knowledge base. Scoped to their own tenant and enforced server-side, not just filtered in the interface.',
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
      'Utilisation, billable ratio and forecast are questions that span every link — which is exactly why they are so hard to answer in a stitched stack. Here they are queries over the same records the work was done in, with the same permissions applied.',
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
        body: 'Definitions you save, runs you schedule, dashboards with per-widget permissions. Reports run against read models fed by the same events that drive the audit trail, so a report and an audit entry cannot disagree.',
        bullets: [
          'Entity, columns, filters — saved as a definition',
          'Scheduled delivery through the notification service',
          'Dashboards and widgets, each with its own permission',
          'CSV export on every list, cursor pagination on the hot ones',
        ],
        panel: {
          label: 'Permissions in this area',
          items: ['reporting.report.read', 'reporting.dashboard.read', 'assistant.chat.use'],
          mono: true,
        },
      },
      {
        id: 'search',
        title: 'Permission-trimmed global search',
        body: 'One search across leads, contacts, companies, projects, tasks, tickets and people — returning only records the searcher is allowed to see. Trimming results by permission at query time is uncommon at this size, and it is the difference between a search box and a data leak.',
        bullets: [
          'Cross-entity index over every module',
          'Results trimmed by the same permission catalog',
          'Command palette for keyboard navigation',
        ],
      },
      {
        id: 'assistant',
        title: 'The assistant',
        body: 'Chat and smart search over your own modules, with retrieval scoped by the asker’s permissions and the interaction recorded. Every vendor claims AI; the useful question is whether their assistant can surface a record you are not allowed to read. Ours cannot.',
        bullets: [
          'Retrieval scoped to the asker’s permissions',
          'AI actions recorded in the audit trail',
          'An offline engine for environments that cannot call an external model',
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
