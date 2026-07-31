/** Platform pages (docs/05 §7). */

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
      'This page exists for the person who has to own the thing after the contract is signed. It describes what the platform actually is, including the parts that are unglamorous.',
    jobs: [
      'Understand what you would be operating',
      'Check the trust boundary before the security review',
      'See how it scales, and where the limits are',
    ],
    blocks: [
      {
        id: 'shape',
        title: 'The shape of it',
        body: 'Four applications, one API gateway, thirty independently deployable services, database per service. 254 data models in total. Services communicate over contract events rather than shared tables, so one module’s schema change cannot break another’s queries.',
        bullets: [
          'Four Next.js applications, each a backend-for-frontend',
          'One public entry point — the gateway on port 8080',
          'Thirty NestJS services, each owning its own PostgreSQL database',
          'Shared packages: design system, typed SDK, contracts, common, authz',
        ],
        panel: {
          label: 'Platform spine',
          items: ['identity', 'authorization', 'audit', 'notification', 'search', 'tenant', 'workflow', 'reporting'],
          mono: true,
        },
      },
      {
        id: 'boundary',
        title: 'The trust boundary',
        body: 'The gateway validates the JWT, strips any identity headers the client tried to set, stamps the user and tenant itself, applies rate limiting, and only then proxies. Downstream services additionally verify an internal-auth header and are restricted by in-cluster network policy, so a service will not answer a request that did not come through the front door.',
        bullets: [
          'Spoofable identity headers stripped at the edge, not trusted',
          'Tenant and user stamped by the gateway, never by the caller',
          'Redis-backed rate limiting, with a stricter class for auth routes',
          'Network policies plus an internal-auth header as defence in depth',
        ],
      },
      {
        id: 'scale',
        title: 'How it holds up',
        body: 'Stateless services behind horizontal autoscaling, keyset cursor pagination on the hot list endpoints, read models for reporting rather than synchronous cross-service aggregation, and short-TTL caching for facet lists.',
        bullets: [
          'Horizontal pod autoscaling on the cluster',
          'Cursor pagination on audit and notification feeds',
          'Reporting reads from read models fed by events',
          'Index coverage verified against real query plans, not assumed',
        ],
      },
      {
        id: 'operations',
        title: 'Observability and deploys',
        body: 'Structured JSON logs, Prometheus metrics and OpenTelemetry traces on every service and the gateway, with correlation IDs threaded end to end. Deploys go through staging with a post-deploy smoke test and automatic rollback on failure.',
        bullets: [
          'pino structured logging, Prometheus /metrics, OpenTelemetry traces',
          'Health aggregation across the fleet at the gateway',
          'Staged pipeline: build once, deploy to staging, smoke, manual approval, production',
          'Automatic rollback when the post-deploy smoke test fails',
        ],
      },
      {
        id: 'portability',
        title: 'Portability is a design constraint',
        body: 'No cloud-provider SDK is imported in application code. Every infrastructure binding is an environment variable over a standard protocol, and adapters select their driver the same way. Failover from the primary cloud to free-tier equivalents is a documented connection-string swap, and a Docker Compose stack boots the entire platform.',
        bullets: [
          'Storage driver selected by env: azure-blob, s3-compatible, or local disk',
          'Postgres, Redis and SMTP over standard wire protocols',
          'A documented failover runbook with a verify and a rollback script',
          'Compose stack that boots all thirty services — the ultimate fallback',
        ],
      },
    ],
    related: [
      { label: 'Security', href: '/security', description: 'The controls, stated as mechanisms.' },
      { label: 'Developers', href: '/developers', description: 'API, SDK and webhooks.' },
      { label: 'Infrastructure', href: '/security/infrastructure', description: 'Hosting, backups, DR.' },
    ],
  },

  customization: {
    eyebrow: 'Customization',
    title: 'Your terminology, carried the whole way down the chain.',
    intro:
      'Practice, region, engagement type, cost centre — whatever your business actually tracks needs to survive from the deal to the invoice. A metadata service holds entity, field, layout and picklist definitions per tenant, and values are stored alongside the record, so a custom field behaves like a native one everywhere it appears.',
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
        body: 'Define a field on any entity, per tenant, with a type and validation rules. The form renderer, the table, the filter builder and the API all read the same definition, so there is no surface where the field is missing.',
        bullets: [
          'Field types with validation compiled from the definition',
          'Layouts and picklists, also per tenant',
          'Values stored with the record and indexed for filtering',
          'Per-tenant limits, so one workspace cannot degrade another',
        ],
        chain: ['Define field', 'Appears in the form', 'In the table', 'In filters', 'In the API'],
      },
      {
        id: 'views',
        title: 'Saved views and filters',
        body: 'A filter builder with AND/OR groups, saved as a named view that can be shared with a team. Column choice, density and page size are per-user preferences that persist.',
        bullets: [
          'AND/OR filter groups on any field, including custom ones',
          'Saved views, shareable with a team',
          'Column preferences, density toggle, page size',
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
        body: 'An import wizard: upload, map columns, validate, dry run, then commit. The dry run is the part that matters — you see the errors before anything is written, not after.',
        bullets: [
          'CSV and Excel with column mapping',
          'Validation and a dry run before commit',
          'An error report you can fix and re-upload',
          'Or use the API, which does the same checks',
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
      'A discount threshold, a project request, a timesheet, a leave day — every link in the chain has a decision point, and yours are not the same as anyone else’s. A workflow service holds definitions, versions, triggers, steps and running instances; the approval designer is the first-class use of it.',
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
        body: 'Build a chain visually. Approvers can be a role, an org unit, or a named person; steps can run in sequence or in parallel; timers escalate when nobody acts; delegation covers absence with a bounded time window.',
        bullets: [
          'Sequential and parallel steps',
          'Role-, org-unit- or person-based approvers',
          'Escalation timers with SLA semantics',
          'Out-of-office delegation, bounded by a window',
        ],
        chain: ['Trigger', 'Condition', 'Approval step', 'Escalation timer', 'Notify', 'Complete'],
      },
      {
        id: 'inbox',
        title: 'One inbox',
        body: 'Timesheets, deal governance, WBS plans, project requests and leave all surface in a single approvals inbox with module tabs and oldest-first ordering. Approve or reject with an optimistic update that rolls back if the server disagrees.',
        bullets: [
          'One inbox across every module that needs a decision',
          'A live pending count in the navigation',
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
        body: 'Definitions are versioned, so changing a policy does not rewrite the history of instances already running. State lives in the workflow service, and business records carry only an instance reference.',
        bullets: [
          'Versioned definitions; running instances keep their version',
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
      'The assistant answers over your own modules, with retrieval scoped by the asker’s permissions and every action recorded. It can also run on an offline engine for environments that cannot call an external model at all.',
    jobs: [
      'Ask across the platform in plain language',
      'Keep the answer inside the asker’s permissions',
      'Satisfy the governance questions before they are asked',
    ],
    blocks: [
      {
        id: 'capability',
        title: 'What it does',
        body: 'Chat and smart search over live module data, returning answers with the records they came from. Useful for the questions that would otherwise require three reports and a spreadsheet.',
        bullets: [
          'Conversational queries over CRM, projects, time and people data',
          'Answers cite the records they used',
          'Smart search as a lighter-weight path to the same index',
        ],
        chain: ['Ask', 'Scope to permissions', 'Retrieve', 'Answer with sources'],
      },
      {
        id: 'governance',
        title: 'AI governance — the part vendors skip',
        body: 'What is sent where, what is retained, and how to turn it off. Enterprise buyers ask this first now, and a straight answer is a conversion event rather than a compliance chore.',
        bullets: [
          'Retrieval is scoped by the same permission catalog as the rest of the platform',
          'Assistant actions are recorded in the audit trail',
          'An offline engine is available where no external call is acceptable',
          'The whole capability can be disabled per tenant with a feature flag',
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
      'Responsive web across every breakpoint, plus an installable progressive web app. We are precise about this because the honest version is still good: there is no native app, and there is a fast web app that works on every device your team already carries.',
    jobs: [
      'Clear approvals without opening a laptop',
      'Fill a timesheet on a phone without fighting a desktop grid',
      'Install it to a home screen if you want an app icon',
    ],
    blocks: [
      {
        id: 'responsive',
        title: 'Genuinely responsive, not merely shrunk',
        body: 'Layouts are designed at mobile, tablet and desktop rather than scaled down. The timesheet week editor, for example, switches to a stacked per-day layout below 400px instead of forcing a seven-column grid onto a phone.',
        bullets: [
          'Verified from 320px to ultrawide',
          'Timesheet week editor stacks per day on small screens',
          'Touch-accessible board interactions, with a menu path as well',
          'Tap targets sized for hands, not pointers',
        ],
      },
      {
        id: 'pwa',
        title: 'Installable PWA',
        body: 'A web app manifest, installable to a home screen on iOS and Android, with offline tolerance for reads. It updates when you deploy — there is no store review between you and a fix.',
        bullets: [
          'Install to home screen on iOS and Android',
          'Offline-tolerant reads',
          'Updates ship with the deploy, not through a store queue',
        ],
      },
      {
        id: 'honesty',
        title: 'What this is not',
        body: 'There is no native iOS or Android application, no App Store or Play Store listing, and no push notification via a native shell. If a native app is a hard requirement for you, say so early and we will tell you honestly where that sits rather than implying it exists.',
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
      'Built for partners, resellers and anyone who puts a client-facing portal in front of their own customers. Branding is tenant-level configuration, not a services engagement.',
    jobs: [
      'Put your brand on the product your clients see',
      'Provision a new tenant without an implementation project',
      'Run different brands from one platform',
    ],
    blocks: [
      {
        id: 'branding',
        title: 'Theme and branding',
        body: 'A theme builder with a live preview that pushes branding to the tenant: colours, logo, and the surfaces your clients see. Locale and currency are tenant settings too.',
        bullets: [
          'Colour and logo configuration per tenant, applied live',
          'Custom domains',
          'Locale and translations per tenant',
          'Applies to the customer portal your clients log into',
        ],
      },
      {
        id: 'provisioning',
        title: 'Tenant provisioning',
        body: 'A wizard that creates the tenant and its subscription together, with honest partial-failure handling — if one step fails you are told which, rather than being left with a half-created workspace and no message.',
        bullets: [
          'Tenant and subscription orchestrated together',
          'Feature flags and licences decide which modules are on',
          'Suspend, resume and archive as tenant lifecycle operations',
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
