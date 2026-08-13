/**
 * Pricing page content (docs/08 §1).
 *
 * Note what is NOT here: invented tier names and invented prices. Prices come
 * from the billing service at request time (src/lib/billing.ts) or they do not
 * appear at all. What we can state honestly without them is the capability
 * comparison below — which is the part a buyer actually needs to reason about.
 */

export interface CapabilityGroup {
  group: string;
  items: { capability: string; note?: string }[];
}

/**
 * The consolidation calculator's heading block.
 *
 * Was `roiIntro` in content/homepage.ts, titling a homepage section, until
 * 2026-08-10. The calculator moved here because this is the page where the
 * question it answers actually gets asked — the visitor has just read a
 * per-seat price and is doing the arithmetic anyway.
 *
 * The `RoiTeaser` island itself is unchanged and is still shared with /roi,
 * which remains the full calculator this one links out to.
 */
export const CALCULATOR = {
  heading: 'What consolidating is worth',
  sub: 'Run it on your numbers, not ours. No email, no hidden multipliers — every assumption is on screen where you can argue with it.',
} as const;

export const INCLUDED_EVERYWHERE = [
  'Single sign-on (OIDC and SAML) and SCIM provisioning',
  'The full audit trail, with change diffs',
  'The complete REST API, typed SDK and webhooks',
  'Server-side authorization with the full permission model',
  'CSV export on every list',
  'The mobile web experience and installable PWA',
];

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    group: 'Revenue',
    items: [
      { capability: 'Leads, contacts, companies, activities' },
      { capability: 'Deals, pipeline and forecast' },
      { capability: 'Deal governance and discount approvals' },
    ],
  },
  {
    group: 'Delivery',
    items: [
      { capability: 'Projects, internal projects and project requests' },
      { capability: 'Work breakdown structures' },
      { capability: 'Tasks, sprints, epics and boards' },
      { capability: 'Timesheets, approvals and capacity' },
    ],
  },
  {
    group: 'People',
    items: [
      { capability: 'Employee directory, org chart, skills' },
      { capability: 'Leave and attendance' },
      { capability: 'Performance and recruitment' },
      { capability: 'Workplace: announcements, policies, assets, expenses' },
    ],
  },
  {
    group: 'Service',
    items: [
      { capability: 'Help desk with reply threads and SLA' },
      { capability: 'Knowledge base' },
      { capability: 'Customer portal', note: 'Your clients log in — no per-client seat' },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      { capability: 'Report builder and scheduled delivery' },
      { capability: 'Dashboards with per-widget permissions' },
      { capability: 'Permission-trimmed global search' },
      { capability: 'AI assistant', note: 'Can be disabled per tenant' },
    ],
  },
  {
    group: 'Platform',
    items: [
      { capability: 'Custom fields, layouts and picklists' },
      { capability: 'Visual workflow and approval designer' },
      { capability: 'Feature flags and per-tenant module licensing' },
      { capability: 'White label: branding, custom domains, localisation' },
    ],
  },
];

export const PRICING_FAQS = [
  {
    question: 'What counts as a seat?',
    answer:
      'A person who signs in to the internal portal or the admin console. Your clients using the customer portal are not seats — charging you for your own customers to see their own invoices would be a strange way to run a business.',
  },
  {
    question: 'Can we turn modules on and off?',
    answer:
      'Yes. Modules are gated by feature flags and licences at the tenant level, so you can start with Revenue and Delivery and add People later without a migration.',
  },
  {
    question: 'What happens at the end of the trial?',
    answer:
      'The workspace keeps your data and becomes read-only rather than being deleted. You can export everything, or subscribe and carry on where you left off.',
  },
  {
    question: 'How do we cancel, and what happens to our data?',
    answer:
      'Cancel from the console. Your data stays exportable through the API and CSV export for the retention window, and we will not hold it hostage to a renewal conversation.',
  },
  {
    question: 'Do you offer self-hosting?',
    answer:
      'The platform ships as Helm charts and a Docker Compose stack that boots all thirty services, so self-hosting is technically supported today. What that costs and what support looks like is a conversation rather than a published number — talk to us.',
  },
  {
    question: 'Is anything held back for an enterprise tier?',
    answer:
      'SSO, audit logs, the full API and the permission model are not withheld. Holding security features hostage to a higher tier is a pattern we have decided not to copy.',
  },
];
