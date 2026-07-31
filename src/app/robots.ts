import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';

/**
 * Staging must never be indexed. The guard is an explicit env flag rather than
 * a hostname check, so a new environment defaults to "not indexable" instead of
 * accidentally competing with production in search results.
 */
export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.SITE_INDEXABLE === 'true';

  if (!indexable) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
