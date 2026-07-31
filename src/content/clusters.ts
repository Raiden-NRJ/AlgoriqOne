/**
 * The six product clusters — the single source of truth for the nav, the
 * homepage cluster section, and the product pages (docs/00 §3, docs/11 §5).
 *
 * Every module name below is copied from the codebase (services/* and the
 * portal/admin navigation registries). Nothing here is invented.
 */

export type ClusterId =
  | 'revenue'
  | 'delivery'
  | 'people'
  | 'service'
  | 'intelligence'
  | 'platform';

export interface Cluster {
  id: ClusterId;
  name: string;
  href: string;
  /** One sentence: the outcome, not the feature list. */
  valueProp: string;
  /** Real module names, as they appear in the product. */
  modules: string[];
  /** The services that back it — used for the architecture diagram. */
  services: string[];
  /** The end-to-end chain that proves it is one system. */
  chain: string[];
  /** Real permission-catalog keys (module.resource.action). */
  permissions: string[];
}

export const CLUSTERS: Cluster[] = [
  {
    id: 'revenue',
    name: 'Revenue',
    href: '/product/revenue',
    valueProp: 'Pipeline, deals and approvals without a spreadsheet on the side.',
    modules: ['Leads', 'Contacts', 'Companies', 'Activities', 'Deals', 'Forecast', 'Deal governance'],
    services: ['crm-service', 'sales-service'],
    chain: ['Lead', 'Qualified', 'Deal', 'Governance approval', 'Won', 'Project created'],
    permissions: ['crm.lead.read', 'crm.contact.update', 'sales.deal.approve'],
  },
  {
    id: 'delivery',
    name: 'Delivery',
    href: '/product/delivery',
    valueProp: 'Project request to approved timesheet. One chain, one approval inbox.',
    modules: [
      'Clients',
      'Projects',
      'Internal projects',
      'Project requests',
      'WBS',
      'Tasks, sprints & epics',
      'Timesheets',
      'Capacity',
    ],
    services: ['project-service', 'wbs-service', 'task-service', 'timesheet-service'],
    chain: ['Request', 'Approved', 'WBS', 'Tasks', 'Time logged', 'Timesheet approved', 'Billable'],
    permissions: ['project.read', 'wbs.read', 'task.read', 'timesheet.approve'],
  },
  {
    id: 'people',
    name: 'People',
    href: '/product/people',
    valueProp: 'HR on the same permission model as your pipeline.',
    modules: [
      'Employees',
      'Org chart',
      'Skills & Learning',
      'Leave',
      'Attendance',
      'Performance',
      'Recruitment',
      'Workplace',
    ],
    services: [
      'employee-service',
      'talentory-service',
      'leave-service',
      'attendance-service',
      'performance-service',
      'recruitment-service',
      'workplace-service',
    ],
    chain: ['Requisition', 'Hire', 'Onboarding', 'Access provisioned', 'Capacity updated', 'Review cycle'],
    permissions: ['employee.read', 'leave.request.read', 'performance.goal.read'],
  },
  {
    id: 'service',
    name: 'Service',
    href: '/product/service',
    valueProp: 'Support your customers can reach, on a portal that already exists.',
    modules: ['Help desk tickets', 'Ticket replies & SLA', 'Knowledge base', 'Customer portal'],
    services: ['help-service', 'knowledge-base-service', 'notification-service'],
    chain: ['Ticket raised', 'Assigned', 'SLA timer', 'Reply thread', 'Resolved'],
    permissions: ['help.ticket.read', 'help.ticket.comment', 'knowledgebase.article.read'],
  },
  {
    id: 'intelligence',
    name: 'Intelligence',
    href: '/product/intelligence',
    valueProp: 'Reports built on read models, not screenshots of your data.',
    modules: ['Report builder', 'Dashboards & widgets', 'Global search', 'AI assistant'],
    services: ['reporting-service', 'search-service', 'assistant-service'],
    chain: ['Event', 'Read model', 'Report', 'Schedule', 'Delivered'],
    permissions: ['reporting.report.read', 'reporting.dashboard.read', 'assistant.chat.use'],
  },
  {
    id: 'platform',
    name: 'Platform',
    href: '/platform/customization',
    valueProp: 'Add a field, build an approval flow, subscribe a webhook. No code.',
    modules: [
      'Custom fields',
      'Workflow designer',
      'Feature flags & licenses',
      'API, SDK & webhooks',
      'Localization',
      'White label',
    ],
    services: [
      'metadata-service',
      'workflow-service',
      'feature-flags-service',
      'api-management-service',
      'tenant-service',
    ],
    chain: ['Define field', 'Appears in form', 'In the table', 'In filters', 'In the API'],
    permissions: ['platform.fields.manage', 'platform.workflow.read', 'apimanagement.client.read'],
  },
];

export const CLUSTER_BY_ID = Object.fromEntries(
  CLUSTERS.map((c) => [c.id, c]),
) as Record<ClusterId, Cluster>;
