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

/*
  DEMO_COMPANIES, DEMO_PROJECTS and DEMO_PEOPLE (with their DemoCompany and
  DemoPerson interfaces) were deleted on 2026-08-10 as dead code (audit B10):
  38 lines of fixture records with zero readers anywhere in the tree.

  Unlike the gated arrays in content/proof.ts, these were not scaffolding for a
  blocked milestone — the names they held are still used, but they are written
  where they render: the hero feed rows in `heroVisual` (content/homepage.ts),
  the report bars in sections/intelligence.tsx, and the device miniatures in
  sections/devices.tsx. That duplication is worth noting if the demo dataset is
  ever centralised again; the Figma "Demo Tenant Context" frame remains the
  source for all of them.
*/

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
