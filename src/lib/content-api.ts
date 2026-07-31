/**
 * SERVER-ONLY loaders for editorial content published by the platform itself:
 * the knowledge-base service (articles) and the releases service (changelog).
 *
 * Tolerant by construction — a failure resolves to an empty list and the page
 * renders an honest empty state. The build must be green with zero services
 * running (website/CLAUDE.md rule 7).
 */
import 'server-only';

const KB_URL = process.env.KNOWLEDGE_BASE_SERVICE_URL;
const RELEASES_URL = process.env.RELEASES_SERVICE_URL;
const INTERNAL_AUTH = process.env.INTERNAL_AUTH_SECRET;

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  category?: string;
}

export interface Release {
  id: string;
  version: string;
  title?: string;
  notes?: string;
  releasedAt?: string;
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        ...(INTERNAL_AUTH ? { 'x-internal-auth': INTERNAL_AUTH } : {}),
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: T } | T;
    return ((body as { data?: T })?.data ?? (body as T)) ?? null;
  } catch {
    return null;
  }
}

function items<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  return ((data as { items?: T[] } | null)?.items ?? []) as T[];
}

export async function getArticles(): Promise<Article[]> {
  if (!KB_URL) return [];
  const data = await getJson<{ items: Article[] }>(
    `${KB_URL}/api/v1/knowledge-base/articles?status=published&pageSize=50&sort=-publishedAt`,
  );
  return items<Article>(data);
}

export async function getReleases(): Promise<Release[]> {
  if (!RELEASES_URL) return [];
  const data = await getJson<{ items: Release[] }>(
    `${RELEASES_URL}/api/v1/releases?pageSize=30&sort=-releasedAt`,
  );
  return items<Release>(data);
}

export function formatDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
