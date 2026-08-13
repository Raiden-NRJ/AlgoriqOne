/**
 * Developer platform pages (docs/03 sitemap, docs/04 §12).
 *
 * ── Content pass, 2026-08-10 ──────────────────────────────────────────────
 * Bullet-first, Zoho shape (see the note at the top of pages-product.ts).
 *
 * The overview's `events` block is a deliberate teaser for `/developers/webhooks`
 * rather than a duplicate: it was cut to three lines and the detail — signing,
 * replay windows, secret rotation, redelivery — lives only on the deep page.
 */

import type { PageContent } from '@/components/page/page-template';

export type DeveloperPageId = 'api' | 'webhooks' | 'integrations';

export const DEVELOPER_OVERVIEW: PageContent = {
  eyebrow: 'Developers',
  title: 'The same gateway our own applications use.',
  intro:
    'There is no private API. All four Algoryq One applications go through the same REST gateway, the same authentication and the same permission checks your integration will hit.',
  jobs: [
    'Integrate without waiting for a vendor to expose an endpoint',
    'Automate the things your process needs and ours does not',
    'Get your data out whenever you want it',
  ],
  blocks: [
    {
      id: 'api',
      title: 'REST API for every module',
      bullets: [
        'Standard envelope: success, message, data, errors, meta',
        'Cursor pagination on high-volume feeds',
        'Correlation identifiers threaded end to end for tracing',
        'Versioned under /api/v1',
        'A published deprecation policy instead of silent breakage',
      ],
      panel: {
        label: 'Auth methods',
        items: ['API key (hashed, rotatable)', 'OAuth 2.0 / OIDC', 'SAML SSO', 'SCIM v2'],
      },
    },
    {
      id: 'sdk',
      title: 'A typed SDK',
      body: 'The same client the product applications use, so it cannot lag the API.',
      bullets: [
        'Typed clients per service',
        'Automatic token refresh and retry',
        'Interceptors for correlation and tenant context',
      ],
    },
    {
      id: 'keys',
      title: 'API keys you control',
      bullets: [
        'Hashed at rest, revealed once at creation',
        'Rotate and revoke yourself — no support ticket',
        'Scoped by the same permission catalog as everything else',
      ],
    },
    {
      id: 'events',
      title: 'Webhooks',
      bullets: [
        'Subscribe to platform events instead of polling',
        'HMAC-signed payloads with automatic retries',
        'A delivery log for when something does not arrive',
      ],
      image: {
        src: '/illustrations/developers.jpg',
        alt: 'A webhook delivery log listing deliveries by event type, timestamp, status and endpoint URL, with successful and failed rows and a retry control on each, beside the JSON payload shape being posted.',
      },
    },
  ],
  related: [
    { label: 'API reference', href: '/developers/api', description: 'Resources and conventions.' },
    { label: 'Webhooks', href: '/developers/webhooks', description: 'Events and signing.' },
    { label: 'Integrations', href: '/developers/integrations', description: 'What connects today.' },
  ],
};

export const DEVELOPER_PAGES: Record<DeveloperPageId, PageContent> = {
  api: {
    eyebrow: 'API reference',
    title: 'Conventions first, then endpoints.',
    intro:
      'Learn the four conventions below and most of the API stops needing documentation. The generated reference is published from the platform’s OpenAPI export.',
    blocks: [
      {
        id: 'envelope',
        title: 'The response envelope',
        body: 'One shape everywhere, so error handling is written once.',
        bullets: [
          'success — a boolean',
          'data — the payload',
          'errors — structured failures',
          'meta — pagination and correlation',
        ],
        panel: {
          label: 'Envelope keys',
          items: ['success', 'message', 'data', 'errors', 'meta'],
          mono: true,
        },
      },
      {
        id: 'auth',
        title: 'Authentication and tenancy',
        bullets: [
          'A bearer token in Authorization, or an API key header',
          'The gateway resolves your identity and tenant and stamps them downstream',
          'Tenant context is never accepted from the caller — it is stripped',
          'Every call is permission-checked against the catalog the interface uses',
        ],
      },
      {
        id: 'pagination',
        title: 'Pagination, filtering and sorting',
        bullets: [
          'page and pageSize on ordinary lists',
          'Keyset cursors on audit, notifications and other high-volume feeds',
          'sort against a per-resource allowlist — it works or it errors',
          'Filters, including on custom fields',
        ],
      },
      {
        id: 'errors',
        title: 'Errors and rate limits',
        bullets: [
          '403 on a failed permission check, with the failing key named',
          'A real answer, never a filtered empty list',
          '429 with retry guidance when rate limited',
          'Stricter rate-limit class on authentication routes',
          'A correlation identifier on every response, for support',
        ],
      },
    ],
    related: [
      { label: 'Developers', href: '/developers', description: 'Overview and SDK.' },
      { label: 'Webhooks', href: '/developers/webhooks', description: 'Push instead of poll.' },
    ],
  },

  webhooks: {
    eyebrow: 'Webhooks',
    title: 'Push, signed and retried.',
    intro:
      'Subscribe to events rather than polling for change. Every delivery is HMAC-signed, and every attempt is logged so you can see what happened when it did not arrive.',
    blocks: [
      {
        id: 'subscribe',
        title: 'Endpoints and subscriptions',
        bullets: [
          'Endpoint management with a test-send',
          'Per-event subscriptions',
          'Separate endpoints per environment',
        ],
        panel: {
          label: 'Example events',
          items: [
            'sales.deal.won',
            'timesheet.timesheet.approved',
            'project.request.approved',
            'leave.request.approved',
            'help.ticket.created',
          ],
          mono: true,
        },
      },
      {
        id: 'signing',
        title: 'Verification',
        body: 'An unverified webhook endpoint is an open door.',
        bullets: [
          'HMAC signature header on every delivery',
          'A shared secret only you and the platform hold',
          'A timestamp to reject replays',
          'Secret rotation without downtime',
        ],
      },
      {
        id: 'delivery',
        title: 'Delivery and retries',
        bullets: [
          'Automatic retries with exponential backoff',
          'Per-delivery attempt log with response codes',
          'Tells "we never sent it" apart from "your endpoint was down"',
          'Manual redelivery from the console',
        ],
      },
    ],
    related: [
      { label: 'API reference', href: '/developers/api', description: 'The REST surface.' },
      { label: 'Workflows', href: '/platform/workflows', description: 'Act on events internally.' },
    ],
  },

  integrations: {
    eyebrow: 'Integrations',
    title: 'Standards first, connectors second.',
    intro:
      'We are early, and we would rather be honest about the connector catalogue than pad it. What we do have is what makes connectors possible.',
    blocks: [
      {
        id: 'standards',
        title: 'What is supported today',
        body: 'Protocols implemented in the platform — not partner logos we have borrowed.',
        panel: {
          label: 'Implemented standards',
          items: [
            'REST',
            'OAuth 2.0 / OIDC',
            'SAML',
            'SCIM v2',
            'Webhooks (HMAC)',
            'Prometheus',
            'OpenTelemetry',
            'S3-compatible storage',
            'SMTP',
            'PostgreSQL',
          ],
        },
        bullets: [
          'Single sign-on through your existing identity provider',
          'User provisioning and deprovisioning through SCIM',
          'Telemetry into whatever you already run',
          'Email through your own SMTP relay',
        ],
      },
      {
        id: 'building',
        title: 'Building your own',
        body: 'Slower to start, considerably more durable.',
        bullets: [
          'API keys you create and rotate yourself',
          'Webhooks for the push direction',
          'Custom fields so external identifiers have a home',
          'No waiting on our roadmap for a field you need',
        ],
      },
      {
        id: 'honesty',
        title: 'What does not exist yet',
        bullets: [
          'No public app marketplace',
          'No one-click connector directory',
          'Ask about a specific integration and we will tell you: a morning of API work, or genuinely not there',
        ],
      },
    ],
    related: [
      { label: 'Developers', href: '/developers', description: 'API and SDK.' },
      { label: 'Security', href: '/security', description: 'SSO and SCIM detail.' },
    ],
  },
};

export const DEVELOPER_PAGE_IDS = Object.keys(DEVELOPER_PAGES) as DeveloperPageId[];
