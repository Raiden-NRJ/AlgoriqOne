import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';
import { PRODUCT_PAGE_IDS } from '@/content/pages-product';
import { PLATFORM_PAGE_IDS } from '@/content/pages-platform';
import { SECURITY_PAGE_IDS } from '@/content/pages-security';
import { DEVELOPER_PAGE_IDS } from '@/content/pages-developers';
import { INDUSTRY_IDS, ROLE_IDS } from '@/content/pages-solutions';
import { LEGAL_DOC_IDS } from '@/content/legal';

/**
 * Generated from the same route manifests the pages are built from, so a new
 * page cannot be added without appearing here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-07-31');

  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority,
  });

  return [
    entry('/', 1),
    entry('/pricing', 0.9),
    entry('/security', 0.9),
    entry('/demo', 0.8),
    entry('/developers', 0.8),
    entry('/roi', 0.7),
    entry('/faq', 0.7),
    ...PRODUCT_PAGE_IDS.map((id) => entry(`/product/${id}`, 0.8)),
    ...PLATFORM_PAGE_IDS.map((id) => entry(`/platform/${id}`, 0.8)),
    ...SECURITY_PAGE_IDS.map((id) => entry(`/security/${id}`, 0.8)),
    ...DEVELOPER_PAGE_IDS.map((id) => entry(`/developers/${id}`, 0.7)),
    ...INDUSTRY_IDS.map((id) => entry(`/solutions/${id}`, 0.7)),
    ...ROLE_IDS.map((id) => entry(`/solutions/by-role/${id}`, 0.6)),
    entry('/resources/blog', 0.6),
    entry('/resources/guides', 0.6),
    entry('/resources/changelog', 0.6),
    entry('/company/about', 0.5),
    entry('/company/careers', 0.4),
    entry('/company/contact', 0.6),
    ...LEGAL_DOC_IDS.map((id) => entry(`/legal/${id}`, 0.3)),
  ];
}
