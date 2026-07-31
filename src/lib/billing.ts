/**
 * SERVER-ONLY public data access.
 *
 * Every loader is tolerant: on any failure it resolves to an empty fallback so
 * the site still builds and renders when the platform is not reachable. This is
 * a hard requirement — `npm run build` must be green with zero services running
 * (website/CLAUDE.md rule 7).
 *
 * Nothing here reaches the client bundle: no service URL, no internal-auth
 * secret, no tenant identifier.
 */
import 'server-only';

export interface Plan {
  id: string;
  name: string;
  description?: string;
  /** Integer cents, never floats (platform rule 8). */
  amountCents: number;
  currency: string;
  interval: 'month' | 'year';
  features?: string[];
  isPublic: boolean;
  isPopular?: boolean;
  sortOrder: number;
}

const BILLING_URL = process.env.BILLING_SERVICE_URL;
const INTERNAL_AUTH = process.env.INTERNAL_AUTH_SECRET;

/**
 * Live plans from the billing service, so published pricing cannot drift from
 * what the billing system will actually charge. Returns [] when the service is
 * not configured or not reachable — the pricing page renders a capability
 * comparison and a "talk to us" path in that case, never an invented price.
 */
export async function getPlans(): Promise<Plan[]> {
  if (!BILLING_URL) return [];

  try {
    const res = await fetch(
      `${BILLING_URL}/api/v1/billing/plans?status=active&pageSize=50&sort=sortOrder`,
      {
        headers: {
          Accept: 'application/json',
          ...(INTERNAL_AUTH ? { 'x-internal-auth': INTERNAL_AUTH } : {}),
        },
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!res.ok) return [];

    const body = (await res.json()) as { data?: { items?: Plan[] } | Plan[] };
    const data = body?.data;
    const items = Array.isArray(data) ? data : (data?.items ?? []);

    return items
      .filter((plan) => plan.isPublic)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return [];
  }
}

export function formatPrice(plan: Plan): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: plan.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(plan.amountCents / 100);
}
