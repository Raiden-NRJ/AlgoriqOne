/**
 * Per-page SEO titles and descriptions for the templated routes.
 *
 * These live in one place rather than being derived from page headlines,
 * because a headline optimised for a reader mid-scroll and a title optimised
 * for a search result are different sentences. Titles are ≤ 48 characters so
 * that the " · Algoryq One" suffix keeps the whole thing under 60; descriptions
 * are ≤ 155.
 *
 * Both limits are enforced by scripts/check-content.mjs.
 */

export interface Seo {
  title: string;
  description: string;
}

export const PRODUCT_SEO: Record<string, Seo> = {
  revenue: {
    title: 'CRM & sales pipeline',
    description:
      'Leads, contacts, companies and a pipeline with real discount governance — where a won deal becomes a project without anyone re-typing the client.',
  },
  delivery: {
    title: 'Projects, WBS & timesheets',
    description:
      'Project intake, work breakdown, boards and timesheets in one chain, with one approvals inbox and capacity that already knows about approved leave.',
  },
  people: {
    title: 'HR: leave, attendance & performance',
    description:
      'Employees, org chart, skills, leave, attendance, performance and recruitment — feeding capacity directly, so your delivery plan reflects reality.',
  },
  service: {
    title: 'Help desk & customer portal',
    description:
      'Tickets with real reply threads, SLA timers, a knowledge base, and a client portal where your customers watch their own projects and invoices.',
  },
  intelligence: {
    title: 'Reports, dashboards & AI',
    description:
      'Utilisation and billable ratio as queries rather than reconstructions, plus permission-trimmed search and an assistant scoped by what you may see.',
  },
};

export const PLATFORM_SEO: Record<string, Seo> = {
  architecture: {
    title: 'Architecture: 30 services, one gateway',
    description:
      'The trust boundary, database-per-service isolation, scale mechanics, observability and the portability story — written for whoever will operate it.',
  },
  customization: {
    title: 'Custom fields & saved views',
    description:
      'Add a field to any entity per tenant and it appears in the form, the table, the filters and the API. Plus saved views, imports and bulk actions.',
  },
  workflows: {
    title: 'Workflow & approval designer',
    description:
      'Design approval chains visually: sequential or parallel, role- or org-unit-based approvers, escalation timers and delegation. One unified inbox.',
  },
  ai: {
    title: 'AI assistant & governance',
    description:
      'Retrieval scoped by the asker’s permissions, actions recorded in the audit trail, an offline engine option, and a per-tenant off switch.',
  },
  mobile: {
    title: 'Mobile web & installable PWA',
    description:
      'Responsive from 320px up plus an installable PWA for approvals and timesheets. No native app, and we do not pretend otherwise.',
  },
  'white-label': {
    title: 'White label & tenant provisioning',
    description:
      'Your brand, your domain, per tenant — with a theme builder, custom domains, localisation and a provisioning wizard for partners and resellers.',
  },
};

export const SECURITY_SEO: Record<string, Seo> = {
  permissions: {
    title: 'How authorization works',
    description:
      'Deny-by-default checks in all 30 services, one permission catalog, per-user overrides with expiry, delegation, and a published resolution order.',
  },
  compliance: {
    title: 'Audit, retention & GDPR requests',
    description:
      'Append-only audit with hash-chain tamper evidence, retention policies, legal hold, and GDPR export and erasure flows. SOC 2-ready, not certified.',
  },
  infrastructure: {
    title: 'Hosting, backups & portability',
    description:
      'Tenant isolation, network policy, managed hosting or self-hosted, backup retention, and a documented path to take your data and leave.',
  },
};

export const DEVELOPER_SEO: Record<string, Seo> = {
  api: {
    title: 'API reference & conventions',
    description:
      'One response envelope, gateway-resolved tenancy, cursor pagination, allowlisted sorting, and 403s that mean what they say.',
  },
  webhooks: {
    title: 'Webhooks: signed and retried',
    description:
      'Subscribe to platform events with HMAC-signed payloads, automatic retries with backoff, and a per-delivery attempt log you can inspect.',
  },
  integrations: {
    title: 'Integrations & standards',
    description:
      'OIDC, SAML, SCIM, webhooks, Prometheus, OpenTelemetry, S3-compatible storage and SMTP. Standards we implement — not borrowed partner logos.',
  },
};

export const INDUSTRY_SEO: Record<string, Seo> = {
  'professional-services': {
    title: 'CRM + PSA + HR for services firms',
    description:
      'For consultancies and integrators where winning the work depends on who can staff it. Pipeline, delivery, capacity and leave on one platform.',
  },
  agencies: {
    // Not "Algoryq One for agencies" — the template already appends
    // " · Algoryq One", and the brand twice in one SERP line reads as spam.
    title: 'Retainers, utilisation & client portal',
    description:
      'Retainers and projects tracked the same way, utilisation you can see before month end, and a client portal your customers log into.',
  },
  technology: {
    title: 'Services delivery for tech companies',
    description:
      'Services delivery alongside product work, an API your team will actually build against, and a security posture that survives review.',
  },
};

export const ROLE_SEO: Record<string, Seo> = {
  sales: {
    title: 'For sales leaders',
    description:
      'Will your reps use it? Pipeline on any device, activity captured on the record, discounts routed rather than blocked, forecast from the same data.',
  },
  delivery: {
    title: 'For delivery leaders',
    description:
      'Project intake, work breakdown, boards and timesheets in one chain — with resourcing that already accounts for approved leave.',
  },
  hr: {
    title: 'For people leaders',
    description:
      'Five HR services, not a checkbox: leave, attendance, performance, recruitment and workplace — plus offboarding that revokes access everywhere.',
  },
  it: {
    title: 'For IT & security teams',
    description:
      'What you would be operating: 30 services, the trust boundary, SSO and SCIM, deny-by-default authorization, and a documented exit path.',
  },
  finance: {
    title: 'For finance teams',
    description:
      'From a logged hour to an approved timesheet to an invoice, in one system of record — with the approval history your auditor will ask for.',
  },
};
