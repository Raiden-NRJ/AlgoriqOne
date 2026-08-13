/**
 * Platform pages (docs/05 §7).
 *
 * ── Content pass, 2026-08-10 ──────────────────────────────────────────────
 * Bullet-first, Zoho shape (see the note at the top of pages-product.ts).
 *
 * One deliberate de-duplication: `architecture.portability` and
 * `infrastructure.portability` (pages-security.ts) were near-verbatim twins —
 * same storage-driver line, same Compose-stack line, same failover runbook —
 * and `solutions/by-role/it → exit` said it a third time. The canonical version
 * now lives on `/security/infrastructure` ("Getting out"), because a buyer
 * looking for exit terms goes to the trust centre. This page keeps only the
 * *engineering* half of the argument — that portability is a build-time
 * constraint, not a migration service — and links across.
 */

import type { PageContent } from '@/components/page/page-template';

export type PlatformPageId =
  | 'architecture'
  | 'customization'
  | 'workflows'
  | 'ai'
  | 'mobile'
  | 'white-label';

export const PLATFORM_PAGES: Record<PlatformPageId, PageContent> = {
  architecture: {
    eyebrow: 'Architecture',
    title: 'Thirty services, one gateway, and a trust boundary you can inspect.',
    intro:
      'Written for the person who has to own this after the contract is signed — including the parts that are unglamorous.',
    image: {
      src: '/hero/platform-architecture.jpg',
      alt: 'An engineer standing between server racks in a data centre, checking a handheld terminal.',
    },
    jobs: [
      'Understand what you would be operating',
      'Check the trust boundary before the security review',
      'See how it scales, and where the limits are',
    ],
    blocks: [
      {
        id: 'shape',
        title: 'The shape of it',
        bullets: [
          'Four Next.js applications, each a backend-for-frontend',
          'One public entry point — the gateway on port 8080',
          'Thirty NestJS services, each owning its own PostgreSQL database',
          '254 data models; contract events instead of shared tables',
          'Shared packages: design system, typed SDK, contracts, common, authz',
        ],
        image: {
          src: '/illustrations/platform-architecture.jpg',
          alt: 'A hub-and-spoke diagram: a single central gateway hexagon with connector lines radiating out to fifteen surrounding service tiles, showing every service reached through one entry point rather than called directly.',
        },
        panel: {
          label: 'Platform spine',
          items: ['identity', 'authorization', 'audit', 'notification', 'search', 'tenant', 'workflow', 'reporting'],
          mono: true,
        },
      },
      {
        id: 'boundary',
        title: 'The trust boundary',
        body: 'A service will not answer a request that did not come through the front door.',
        bullets: [
          'Spoofable identity headers stripped at the edge, not trusted',
          'Tenant and user stamped by the gateway, never by the caller',
          'Redis-backed rate limiting, stricter on auth routes',
          'Network policies plus an internal-auth header, as defence in depth',
        ],
      },
      {
        id: 'scale',
        title: 'How it holds up',
        bullets: [
          'Stateless services behind horizontal pod autoscaling',
          'Keyset cursor pagination on audit and notification feeds',
          'Reporting reads from read models fed by events',
          'Short-TTL caching on facet lists',
          'Index coverage checked against real query plans, not assumed',
        ],
      },
      {
        id: 'operations',
        title: 'Observability and deploys',
        bullets: [
          'pino structured logs, Prometheus /metrics, OpenTelemetry traces',
          'Correlation IDs threaded end to end',
          'Health aggregation across the fleet at the gateway',
          'Build once, deploy to staging, smoke, approve, production',
          'Automatic rollback when the post-deploy smoke test fails',
        ],
      },
      {
        id: 'portability',
        title: 'Portability is a design constraint',
        body: 'Enforced at build time, not offered as a migration service.',
        bullets: [
          'No cloud-provider SDK imported anywhere in application code',
          'Every infrastructure binding is an env var over a standard protocol',
          'Adapters select their driver the same way',
          'A Compose stack boots all thirty services on one machine',
        ],
      },
    ],
    related: [
      { label: 'Security', href: '/security', description: 'The controls, stated as mechanisms.' },
      { label: 'Developers', href: '/developers', description: 'API, SDK and webhooks.' },
      { label: 'Infrastructure', href: '/security/infrastructure', description: 'Hosting, backups, and the exit path.' },
    ],
  },

  customization: {
    eyebrow: 'Customization',
    title: 'Your terminology, carried the whole way down the chain.',
    intro:
      'Practice, region, engagement type, cost centre. Whatever your business tracks has to survive from the deal to the invoice — so a custom field behaves like a native one everywhere it appears.',
    image: {
      src: '/hero/platform-customization.jpg',
      alt: 'Someone configuring software on a laptop at a desk, a colour and settings panel open on screen.',
    },
    chain: {
      note: 'A field defined once is available at every step, in forms, tables, filters and the API — including on the reports that read across the whole chain.',
    },
    jobs: [
      'Model your own data without a vendor ticket',
      'Save the views your team actually works from',
      'Keep it consistent as the tenant grows',
    ],
    blocks: [
      {
        id: 'fields',
        title: 'Custom fields',
        bullets: [
          'Define a field on any entity, per tenant',
          'Field types with validation compiled from the definition',
          'Layouts and picklists, also per tenant',
          'Values stored with the record and indexed for filtering',
          'Per-tenant limits, so one workspace cannot degrade another',
        ],
        chain: ['Define field', 'Appears in the form', 'In the table', 'In filters', 'In the API'],
        image: {
          src: '/illustrations/platform-customization.jpg',
          // This source already has window chrome painted into it, so the
          // card's own traffic-light bar is suppressed to avoid stacking two.
          chrome: false,
          alt: 'A field-type palette listing Text, Dropdown, Date and Number beside a form being edited, with a new field mid-drag into a highlighted drop zone between two existing fields.',
        },
      },
      {
        id: 'views',
        title: 'Saved views and filters',
        bullets: [
          'AND/OR filter groups on any field, custom ones included',
          'Saved views, shareable with a team',
          'Column preferences, density toggle, page size — per user',
          'Bulk actions with a selection model, and CSV export',
        ],
        panel: {
          label: 'Permissions in this area',
          items: ['platform.fields.manage', 'platform.config.manage'],
          mono: true,
        },
      },
      {
        id: 'import',
        title: 'Getting your data in',
        body: 'The dry run is the part that matters: errors before anything is written.',
        bullets: [
          'CSV and Excel with column mapping',
          'Validation and a dry run before commit',
          'An error report you can fix and re-upload',
          'Or use the API, which runs the same checks',
        ],
      },
    ],
    related: [
      { label: 'Workflows', href: '/platform/workflows', description: 'Act on the fields you added.' },
      { label: 'Developers', href: '/developers', description: 'Custom fields through the API.' },
      { label: 'White label', href: '/platform/white-label', description: 'Brand it as your own.' },
    ],
  },

  workflows: {
    eyebrow: 'Workflows',
    title: 'The approvals along the chain, designed by you.',
    intro:
      'A discount threshold, a project request, a timesheet, a leave day. Every link has a decision point, and yours are not the same as anyone else’s.',
    image: {
      src: '/hero/platform-workflows.jpg',
      alt: 'A person sketching a process flow of connected boxes and arrows on a whiteboard, marker in hand.',
    },
    chain: {
      active: ['Deal', 'Project', 'Time'],
      note: 'Most decision points in the chain are approvals. This is where you encode your actual policy instead of approximating it.',
    },
    jobs: [
      'Encode your real approval policy instead of approximating it',
      'Give approvers one inbox instead of four',
      'Change the policy without waiting for a release',
    ],
    blocks: [
      {
        id: 'designer',
        title: 'The approval designer',
        bullets: [
          'Build a chain visually',
          'Sequential and parallel steps',
          'Approvers by role, org unit, or named person',
          'Escalation timers with SLA semantics',
          'Out-of-office delegation, bounded by a window',
        ],
        chain: ['Trigger', 'Condition', 'Approval step', 'Escalation timer', 'Notify', 'Complete'],
        image: {
          src: '/illustrations/platform-workflows.jpg',
          alt: 'An approval chain laid out as a flow diagram: a submitted request passing through manager approval to a budget-review decision diamond, which branches in parallel to department-head and HR review before rejoining for a final review and completion.',
        },
      },
      {
        id: 'inbox',
        title: 'One inbox',
        bullets: [
          'Timesheets, deals, WBS plans, project requests and leave',
          'Module tabs, oldest first, a live pending count in the nav',
          'Optimistic approve and reject, rolled back if the server disagrees',
          'One failing module degrades to a section error — the rest still render',
        ],
        panel: {
          label: 'Permissions in this area',
          items: ['platform.workflow.read', 'platform.workflow.manage', 'timesheet.timesheet.approve'],
          mono: true,
        },
      },
      {
        id: 'engine',
        title: 'The engine underneath',
        bullets: [
          'Versioned definitions; running instances keep their version',
          'Changing a policy does not rewrite history already in flight',
          'Timers and retries on a durable queue',
          'Every transition emits an event to audit and notification',
        ],
      },
    ],
    scopeNote:
      'The approval designer, the engine and the unified inbox are live. Fully automatic event-driven triggers are partially delivered — some events currently log rather than start an instance — and the last of the older hard-coded approval chains are still being migrated onto the engine. We would rather tell you that than let you discover it in month two.',
    related: [
      { label: 'Delivery', href: '/product/delivery', description: 'The approvals that matter most.' },
      { label: 'Customization', href: '/platform/customization', description: 'Fields to branch on.' },
      { label: 'Permissions', href: '/security/permissions', description: 'Who can approve what.' },
    ],
  },

  ai: {
    eyebrow: 'AI',
    title: 'An assistant that cannot show you what you are not allowed to see.',
    intro:
      'It answers over your own modules, scoped by the asker’s permissions, with every action recorded. It can also run offline, where no external call is acceptable.',
    image: {
      src: '/hero/platform-ai.jpg',
      alt: 'A professional walking through an office atrium, glancing down at their phone mid-stride.',
    },
    jobs: [
      'Ask across the platform in plain language',
      'Keep the answer inside the asker’s permissions',
      'Satisfy the governance questions before they are asked',
    ],
    blocks: [
      {
        id: 'capability',
        title: 'What it does',
        bullets: [
          'Conversational queries over CRM, projects, time and people data',
          'Answers cite the records they came from',
          'Smart search as a lighter path to the same index',
          'Replaces the three-reports-and-a-spreadsheet question',
        ],
        chain: ['Ask', 'Scope to permissions', 'Retrieve', 'Answer with sources'],
        image: {
          src: '/illustrations/platform-ai.jpg',
          alt: 'An assistant conversation: a user asks how to safely access custom user metrics, and the answer explains that access is controlled by permission scopes, with two source citations attached beneath it and a padlock marking the scoped retrieval.',
        },
      },
      {
        id: 'governance',
        title: 'AI governance — the part vendors skip',
        body: 'What is sent where, what is retained, and how to turn it off.',
        bullets: [
          'Retrieval scoped by the platform-wide permission catalog',
          'Assistant actions recorded in the audit trail',
          'An offline engine where no external call is acceptable',
          'Disable the whole capability per tenant with a feature flag',
        ],
        panel: {
          label: 'Permissions in this area',
          items: ['assistant.chat.use', 'platform.config.manage'],
          mono: true,
        },
      },
    ],
    related: [
      { label: 'Intelligence', href: '/product/intelligence', description: 'Reports and search.' },
      { label: 'Security', href: '/security', description: 'The wider control set.' },
      { label: 'Permissions', href: '/security/permissions', description: 'What scopes retrieval.' },
    ],
  },

  mobile: {
    eyebrow: 'Mobile',
    title: 'Approve from the queue at the airport. Nothing to install, unless you want to.',
    intro:
      'Responsive web at every breakpoint, plus an installable progressive web app. There is no native app, and the honest version is still good.',
    image: {
      src: '/hero/platform-mobile.jpg',
      alt: 'A person approving a request on their phone while standing in a departure lounge, bag at their feet.',
    },
    jobs: [
      'Clear approvals without opening a laptop',
      'Fill a timesheet on a phone without fighting a desktop grid',
      'Install it to a home screen if you want an app icon',
    ],
    blocks: [
      {
        id: 'responsive',
        title: 'Genuinely responsive, not merely shrunk',
        body: 'Layouts are designed at each size rather than scaled down.',
        bullets: [
          'Verified from 320px to ultrawide',
          'Timesheet week editor stacks per day below 400px',
          'Touch board interactions, with a menu path as well',
          'Tap targets sized for hands, not pointers',
        ],
        image: {
          src: '/illustrations/platform-mobile.jpg',
          alt: 'A phone showing the timesheet laid out as a stacked list of days rather than a squeezed seven-column grid, each row carrying its project and hours, with an install prompt offering to add the app to the home screen.',
        },
      },
      {
        id: 'pwa',
        title: 'Installable PWA',
        bullets: [
          'Install to a home screen on iOS and Android',
          'Offline-tolerant reads',
          'Updates ship with the deploy, not through a store queue',
        ],
      },
      {
        id: 'honesty',
        title: 'What this is not',
        bullets: [
          'No native iOS or Android application',
          'No App Store or Play Store listing',
          'No push notification through a native shell',
          'If native is a hard requirement, say so early and we will be straight with you',
        ],
      },
    ],
    related: [
      { label: 'Delivery', href: '/product/delivery', description: 'Timesheets and approvals.' },
      { label: 'Workflows', href: '/platform/workflows', description: 'What lands in the inbox.' },
    ],
  },

  'white-label': {
    eyebrow: 'White label',
    title: 'Your brand, your domain, per tenant.',
    intro:
      'For partners, resellers and anyone putting a client-facing portal in front of their own customers. Branding is configuration, not a services engagement.',
    image: {
      src: '/hero/platform-white-label.jpg',
      alt: 'A founder turning a laptop around to show a client their own branded portal across a café table.',
    },
    jobs: [
      'Put your brand on the product your clients see',
      'Provision a new tenant without an implementation project',
      'Run different brands from one platform',
    ],
    blocks: [
      {
        id: 'branding',
        title: 'Theme and branding',
        bullets: [
          'Theme builder with a live preview',
          'Colour and logo per tenant, applied live',
          'Custom domains',
          'Locale, currency and translations per tenant',
          'Applies to the customer portal your clients log into',
        ],
        image: {
          src: '/illustrations/platform-white-label.jpg',
          alt: 'A theme builder with a row of brand colour swatches and a logo upload target, beside a live preview pane showing a tenant dashboard already re-rendered in the selected brand colour.',
        },
      },
      {
        id: 'provisioning',
        title: 'Tenant provisioning',
        bullets: [
          'A wizard that creates tenant and subscription together',
          'Partial failure tells you which step failed, not nothing',
          'Feature flags and licences decide which modules are on',
          'Suspend, resume and archive as lifecycle operations',
        ],
        panel: {
          label: 'Permissions in this area',
          items: ['platform.config.manage', 'platform.tenant.read', 'platform.enterprise.read'],
          mono: true,
        },
      },
    ],
    related: [
      { label: 'Service', href: '/product/service', description: 'The customer portal itself.' },
      { label: 'Architecture', href: '/platform/architecture', description: 'How tenants are isolated.' },
    ],
  },
};

export const PLATFORM_PAGE_IDS = Object.keys(PLATFORM_PAGES) as PlatformPageId[];
