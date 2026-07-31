/**
 * The canonical demo dataset — taken verbatim from the Algoryq One Enterprise
 * Suite Figma file ("Demo Tenant Context", node 4:26) so the website, the Figma
 * deck and any product screenshots tell the same story.
 *
 * This is fictional sample data. It is labelled as such wherever it is shown
 * (docs/CLAUDE.md rule 1 — nothing on this site pretends to be a real customer).
 */

export const DEMO_TENANT = {
  name: 'Algoryq One Demo',
  domain: 'demo.one.algoryq.com',
  note: 'Sample data',
} as const;

export interface DemoCompany {
  name: string;
  kind: string;
  detail: string;
}

export const DEMO_COMPANIES: DemoCompany[] = [
  {
    name: 'Nimbus Retail Group',
    kind: 'Customer company',
    detail: 'Retail chain, 4,200 employees. Active client project, open deal, support tickets.',
  },
  {
    name: 'Vertex Manufacturing',
    kind: 'Customer company',
    detail: 'Industrial manufacturer. Deal in negotiation, ERP integration project in delivery.',
  },
  {
    name: 'Orbit Health',
    kind: 'Customer company',
    detail: 'Healthcare network. New lead qualified this quarter; compliance-sensitive engagement.',
  },
];

export const DEMO_PROJECTS = [
  {
    name: 'Atlas CRM Rollout',
    kind: 'Client project',
    detail: 'Flagship delivery for Nimbus Retail Group — sprints, WBS, timesheets and approvals all reference it.',
  },
  {
    name: 'Beacon Employee Experience',
    kind: 'Internal program',
    detail: 'HRMS initiative — onboarding workflows, announcements, performance cycle.',
  },
] as const;

export interface DemoPerson {
  initials: string;
  name: string;
  role: string;
}

export const DEMO_PEOPLE: DemoPerson[] = [
  { initials: 'DA', name: 'Demo Admin', role: 'Owner · VP Customer Operations' },
  { initials: 'AK', name: 'Ava Kapoor', role: 'Senior Project Manager' },
  { initials: 'NC', name: 'Noah Chen', role: 'CRM Consultant' },
  { initials: 'MR', name: 'Mia Rivera', role: 'People Partner' },
  { initials: 'LS', name: 'Lena Sorenson', role: 'Finance / Billing Admin' },
  { initials: 'PO', name: 'Priya Oberoi', role: 'Platform Ops Admin' },
  { initials: 'JW', name: 'Jordan Wells', role: 'Customer · Nimbus Retail' },
];

/** The four applications, from the Figma "Product Overview" frame. */
export const APPS = [
  {
    name: 'Portal',
    host: 'portal.one.algoryq.com',
    port: '3100',
    tone: 'portal',
    description:
      'Where the tenant’s teams work — CRM, sales, projects, tasks, timesheets, HR self-service, approvals, reports.',
  },
  {
    name: 'Admin Console',
    host: 'admin.one.algoryq.com',
    port: '3200',
    tone: 'admin',
    description:
      'Platform operations — tenants, RBAC, billing, feature flags, monitoring, compliance, SSO/SCIM, workflows.',
  },
  {
    name: 'Customer Portal',
    host: 'my.one.algoryq.com',
    port: '3400',
    tone: 'customer',
    description:
      'External clients — project status, invoices and payment, support tickets, knowledge base.',
  },
  {
    name: 'Marketing Site',
    host: 'one.algoryq.com',
    port: '3300',
    tone: 'platform',
    description: 'Public site — product story, features, pricing, blog, lead capture.',
  },
] as const;
