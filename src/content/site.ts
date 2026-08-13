/** Site-wide chrome: navigation, footer, and the verified platform facts. */

import { CLUSTERS } from './clusters';

export const SITE = {
  name: 'Algoryq One',
  tagline: 'From won deal to paid invoice, in one platform',
  description:
    'Algoryq One connects your pipeline, delivery team and billing — so the hours your team logs are the hours you invoice, with no reconciliation in between.',
  url: 'https://one.algoryq.com',
  appUrl: 'https://portal.one.algoryq.com',
} as const;

/**
 * The parent brand. Algoryq One is an Algoryq Technologies product, and the
 * site says so rather than implying an independent vendor — the footer
 * attribution, the legal entity in the terms, and the contact domain all
 * resolve here. Kept as data so a single edit moves every mention.
 */
export const PARENT = {
  name: 'Algoryq Technologies',
  /**
   * The byline wordmark, split so the accent segment can be coloured — the same
   * two-part treatment as our own lockup and as algoryq.com's header.
   */
  wordmark: { lead: 'Algoryq', accent: '.tech' },
  url: 'https://algoryq.tech',
  siteUrl: 'https://algoryq.com',
} as const;

/**
 * Routes that `next.config.mjs` redirects straight off-site to the portal.
 *
 * They look internal but always leave, so components must render them as plain
 * anchors rather than `<Link>`. Next prefetches Link targets, which follows the
 * 307 cross-origin to the portal host — a wasted request per page at best, and
 * a console error on every page load when that host is not yet provisioned.
 * The audit caught exactly that: 715 findings, all of them this one prefetch.
 *
 * Keep in sync with the `redirects()` block in `next.config.mjs`.
 */
export const OFFSITE_ROUTES: readonly string[] = ['/signup', '/login'];

/** One place for every published address, so none drifts to an old domain. */
export const CONTACT = {
  general: 'hello@algoryq.com',
  security: 'security@algoryq.com',
  privacy: 'privacy@algoryq.com',
  careers: 'careers@algoryq.com',
  accessibility: 'accessibility@algoryq.com',
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
    /*
      The last two entries are load-bearing for reachability, not decoration.

      A group with `links` renders as a <button> in header.tsx, so a group-level
      `href` is inert — the only way to link an index page is to list it. Until
      2026-08-10 nothing on the site linked to `/solutions` at all, which left
      the index and the three by-role pages it alone links to
      (delivery, hr, sales) unreachable by crawl. "All solutions" fixes that in
      one link: the index carries all five roles.

      "For delivery leaders" restores a direct path the homepage used to
      provide. Its §13 routing section was deleted in the same pass, and it was
      the only thing linking that page from outside /solutions.

      Keep this group in sync with what `/solutions` actually offers, and re-run
      `npm run check:links` after touching it — an orphaned route stays green in
      every other check.
    */
    label: 'Solutions',
    links: [
      { label: 'Professional services', href: '/solutions/professional-services' },
      { label: 'Agencies', href: '/solutions/agencies' },
      { label: 'Technology', href: '/solutions/technology' },
      { label: 'For IT & security', href: '/solutions/by-role/it' },
      { label: 'For finance', href: '/solutions/by-role/finance' },
      { label: 'For delivery leaders', href: '/solutions/by-role/delivery' },
      { label: 'All solutions', href: '/solutions' },
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
