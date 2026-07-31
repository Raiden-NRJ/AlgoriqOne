/** Developer platform pages (docs/03 sitemap, docs/04 §12). */

import type { PageContent } from '@/components/page/page-template';

export type DeveloperPageId = 'api' | 'webhooks' | 'integrations';

export const DEVELOPER_OVERVIEW: PageContent = {
  eyebrow: 'Developers',
  title: 'The same gateway our own applications use.',
  intro:
    'There is no private API. The four Algoryq One applications call the platform through the same REST gateway, with the same authentication and the same permission checks that your integration will hit.',
  jobs: [
    'Integrate without waiting for a vendor to expose an endpoint',
    'Automate the things your process needs and ours does not',
    'Get your data out whenever you want it',
  ],
  blocks: [
    {
      id: 'api',
      title: 'REST API for every module',
      body: 'Consistent resources, a standard response envelope, correlation identifiers on every request, and cursor pagination on the endpoints where it matters. Versioned under /api/v1 with a deprecation policy rather than silent breakage.',
      bullets: [
        'Standard envelope: success, message, data, errors, meta',
        'Cursor pagination on high-volume feeds',
        'Correlation identifiers threaded end to end for tracing',
        'Versioned paths and a published deprecation header policy',
      ],
      panel: {
        label: 'Auth methods',
        items: ['API key (hashed, rotatable)', 'OAuth 2.0 / OIDC', 'SAML SSO', 'SCIM v2'],
      },
    },
    {
      id: 'sdk',
      title: 'A typed SDK',
      body: 'One client for every service, with token refresh, retry, correlation and tenant headers handled for you. It is the same SDK the product applications use, so it does not lag behind the API.',
      bullets: [
        'Typed clients per service',
        'Automatic refresh and retry',
        'Interceptors for correlation and tenant context',
      ],
    },
    {
      id: 'keys',
      title: 'API keys you control',
      body: 'Keys are stored hashed and shown exactly once, at creation. Rotate or revoke them yourself from the admin console — no support ticket, no waiting.',
      bullets: [
        'Hashed at rest, revealed once at creation',
        'Rotate and revoke without contacting us',
        'Scoped by the same permission catalog as everything else',
      ],
    },
    {
      id: 'events',
      title: 'Webhooks',
      body: 'Subscribe to platform events, verify them with an HMAC signature, and inspect the delivery log when something does not arrive. Retries are automatic.',
      bullets: [
        'Endpoint and subscription management',
        'HMAC-signed payloads',
        'Delivery log with attempt history',
        'Automatic retries with backoff',
      ],
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
        body: 'Every endpoint returns the same shape, so error handling is written once. success is a boolean, data carries the payload, errors carries structured failures, and meta carries pagination and correlation.',
        panel: {
          label: 'Envelope keys',
          items: ['success', 'message', 'data', 'errors', 'meta'],
          mono: true,
        },
      },
      {
        id: 'auth',
        title: 'Authentication and tenancy',
        body: 'Send an API key or a bearer token. The gateway resolves your identity and tenant and stamps them downstream — you never send a tenant identifier yourself, and a request that tries to is stripped, not honoured.',
        bullets: [
          'Authorization header with a bearer token, or an API key header',
          'Tenant context is resolved server-side, never accepted from the caller',
          'Every call is permission-checked against the same catalog as the interface',
        ],
      },
      {
        id: 'pagination',
        title: 'Pagination, filtering and sorting',
        body: 'Offset pagination on ordinary lists, keyset cursor pagination on high-volume feeds such as audit and notifications. Sorting is server-side and constrained to an allowlist per resource, so a sort parameter either works or errors — it never silently returns unsorted data.',
        bullets: [
          'page and pageSize, or cursor on high-volume feeds',
          'sort with a per-resource allowlist',
          'Filters, including on custom fields',
        ],
      },
      {
        id: 'errors',
        title: 'Errors and rate limits',
        body: 'Standard status codes with structured error bodies. 403 means the permission check failed — it is a real answer, not a filtered empty list. Rate limits are applied at the gateway with a stricter class on authentication routes.',
        bullets: [
          '403 on a failed permission check, with the failing key identified',
          '429 with retry guidance when rate limited',
          'Correlation identifier on every response for support',
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
      'Rather than polling for change, subscribe to events. Every delivery is HMAC-signed so you can verify it came from us, and every attempt is logged so you can see what happened when it did not.',
    blocks: [
      {
        id: 'subscribe',
        title: 'Endpoints and subscriptions',
        body: 'Register an endpoint, subscribe it to the events you care about, and send a test delivery before you rely on it.',
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
        body: 'Each payload carries an HMAC signature computed with a secret only you and the platform hold. Verify before you act — an unverified webhook endpoint is an open door.',
        bullets: [
          'HMAC signature header on every delivery',
          'A timestamp to reject replays',
          'Secret rotation without downtime',
        ],
      },
      {
        id: 'delivery',
        title: 'Delivery and retries',
        body: 'Failed deliveries retry with backoff, and the attempt history is visible so you can distinguish "we never sent it" from "your endpoint was down".',
        bullets: [
          'Automatic retries with exponential backoff',
          'Per-delivery attempt log with response codes',
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
      'We are early, and we would rather be honest about the connector catalogue than pad it. What we do have is the thing that makes connectors possible: an open API, signed webhooks, and identity standards that your existing stack already speaks.',
    blocks: [
      {
        id: 'standards',
        title: 'What is supported today',
        body: 'These are protocols and standards implemented in the platform — not partner integrations, and not logos we have borrowed.',
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
        body: 'Most integrations at this stage are built against the API and webhooks rather than installed from a catalogue. That is slower to start and considerably more durable — you are not waiting on our roadmap for a field you need.',
        bullets: [
          'API keys you create and rotate yourself',
          'Webhooks for the push direction',
          'Custom fields so external identifiers have a home',
        ],
      },
      {
        id: 'honesty',
        title: 'What does not exist yet',
        body: 'There is no public app marketplace and no one-click connector directory. If a specific integration is a requirement for you, ask — we will tell you whether it is a morning of work against the API or genuinely not there.',
      },
    ],
    related: [
      { label: 'Developers', href: '/developers', description: 'API and SDK.' },
      { label: 'Security', href: '/security', description: 'SSO and SCIM detail.' },
    ],
  },
};

export const DEVELOPER_PAGE_IDS = Object.keys(DEVELOPER_PAGES) as DeveloperPageId[];
