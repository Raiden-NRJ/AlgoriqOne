/** Site-wide chrome: navigation, footer, and the verified platform facts. */

import { CLUSTERS } from './clusters';

export const SITE = {
  name: 'RocketCRM',
  tagline: 'From won deal to paid invoice, in one platform',
  description:
    'RocketCRM connects your pipeline, delivery team and billing — so the hours your team logs are the hours you invoice, with no reconciliation in between.',
  url: 'https://rocketcrm.app',
  appUrl: 'https://portal.rocketcrm.app',
} as const;

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  href?: string;
  links?: NavLink[];
}

export const NAV: NavGroup[] = [
  {
    label: 'Product',
    links: CLUSTERS.map((c) => ({
      label: c.name,
      href: c.href,
      description: c.valueProp,
    })),
  },
  {
    label: 'Platform',
    links: [
      { label: 'Architecture', href: '/platform/architecture', description: 'Thirty services behind one gateway.' },
      { label: 'Customization', href: '/platform/customization', description: 'Custom fields, layouts, saved views.' },
      { label: 'Workflows', href: '/platform/workflows', description: 'Visual approval designer and automation.' },
      { label: 'AI assistant', href: '/platform/ai', description: 'Permission-scoped answers across your data.' },
      { label: 'Mobile & PWA', href: '/platform/mobile', description: 'Approve from anywhere. Nothing to deploy.' },
      { label: 'White label', href: '/platform/white-label', description: 'Your brand, your domain, per tenant.' },
    ],
  },
  {
    label: 'Security',
    links: [
      { label: 'Trust centre', href: '/security', description: 'Controls, isolation, operations.' },
      { label: 'Permissions', href: '/security/permissions', description: 'How authorization is actually enforced.' },
      { label: 'Compliance', href: '/security/compliance', description: 'GDPR requests, retention, audit.' },
      { label: 'Infrastructure', href: '/security/infrastructure', description: 'Hosting, backups, portability.' },
    ],
  },
  { label: 'Developers', href: '/developers' },
  { label: 'Pricing', href: '/pricing' },
];

export const FOOTER_COLUMNS: NavGroup[] = [
  {
    label: 'Product',
    links: CLUSTERS.map((c) => ({ label: c.name, href: c.href })),
  },
  {
    label: 'Platform',
    links: [
      { label: 'Architecture', href: '/platform/architecture' },
      { label: 'Customization', href: '/platform/customization' },
      { label: 'Workflows', href: '/platform/workflows' },
      { label: 'AI assistant', href: '/platform/ai' },
      { label: 'Mobile & PWA', href: '/platform/mobile' },
      { label: 'White label', href: '/platform/white-label' },
    ],
  },
  {
    label: 'Solutions',
    links: [
      { label: 'Professional services', href: '/solutions/professional-services' },
      { label: 'Agencies', href: '/solutions/agencies' },
      { label: 'Technology', href: '/solutions/technology' },
      { label: 'For IT & security', href: '/solutions/by-role/it' },
      { label: 'For finance', href: '/solutions/by-role/finance' },
    ],
  },
  {
    label: 'Developers',
    links: [
      { label: 'Overview', href: '/developers' },
      { label: 'API reference', href: '/developers/api' },
      { label: 'Webhooks', href: '/developers/webhooks' },
      { label: 'Integrations', href: '/developers/integrations' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'Interactive demo', href: '/demo' },
      { label: 'Blog', href: '/resources/blog' },
      { label: 'Guides', href: '/resources/guides' },
      { label: 'Changelog', href: '/resources/changelog' },
      { label: 'ROI calculator', href: '/roi' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    label: 'Company',
    links: [
      { label: 'About', href: '/company/about' },
      { label: 'Careers', href: '/company/careers' },
      { label: 'Contact', href: '/company/contact' },
      { label: 'Security', href: '/security' },
      { label: 'Accessibility', href: '/legal/accessibility' },
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
    ],
  },
];

/**
 * Verified platform facts. Each is checkable in the repository — see
 * website/docs/00-audit-and-inventory.md §1. Do not round these up.
 *
 * Note: the Figma cover says "24 microservices"; the codebase has 30. Code is
 * authoritative (docs/14 §1), so 30 is what we publish.
 */
export const PLATFORM_FACTS = [
  { value: '30', label: 'independently deployable services' },
  { value: '254', label: 'data models, database per service' },
  { value: '4', label: 'applications on one design system' },
  { value: '1', label: 'permission catalog, enforced server-side' },
] as const;
