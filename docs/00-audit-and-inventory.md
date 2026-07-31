# 00 — Product Audit & Feature Inventory

**Purpose:** establish, from the codebase alone, exactly what RocketCRM *is* — so every word on the
website traces to something that exists. This document is the fact base every other doc cites.
**Method:** direct source inspection on 2026-07-31. No claim here is inferred from documentation alone;
counts were produced by enumerating files.

---

## 1. Verified platform shape

| Fact | Value | How verified |
|---|---|---|
| Microservices | **30** | `ls services` |
| Prisma models across services | **254** | `grep -rh '^model ' services/*/prisma/schema.prisma \| wc -l` |
| Database strategy | database-per-service | one `schema.prisma` + migrations dir per service |
| API gateway | single public entry, port 8080 | `apps/gateway` |
| Frontends | 4 Next.js BFFs | `apps/{portal,admin,customer,marketing}` |
| Portal routes | 56 pages | `find apps/portal/src/app -name page.tsx` |
| Admin routes | 55 pages | same, `apps/admin` |
| Customer portal routes | 17 pages | same, `apps/customer` |
| Marketing routes | **7 pages** | same, `apps/marketing` — the surface we are rebuilding |
| Design system | 31 primitives + 34 pattern components | `packages/ui/src/components/{ui,patterns}` |
| Test files | 269 spec files + Playwright `e2e/` project | `find … -name '*.spec.ts*'` |
| Infra | Docker Compose, GitHub Actions, AKS Helm, Terraform (Azure) | `infrastructure/`, `docker-compose.full.yml` |

**Website implication:** the "30 services / 254 models / 4 apps" numbers are real and defensible. They
are the single most credible differentiator we own — most CRM sites cannot show their architecture.
Use them literally; never round them up.

---

## 2. Service inventory (the true module map)

Enumerated from `services/` and cross-checked against the gateway route table and both nav registries.

### Platform foundation
| Service | Responsibility | Website relevance |
|---|---|---|
| `identity-service` | Argon2id auth, lockout, TOTP MFA, refresh rotation, invitations, password reset, **SSO (OIDC/SAML) + SCIM** | Security page hero proof |
| `tenant-service` | Multi-tenancy, org hierarchy, branding, translations, password/session policies | Multi-tenant + white-label story |
| `authorization-service` | RBAC engine: catalog (`module.resource.action`), roles, wildcards, per-user overrides, delegations, access requests, scopes | **The permissions page** — deepest moat |
| `audit-service` | Append-only audit + login logs, change diffs, restore-from-diff, hash-chain tamper evidence | Compliance/trust proof |
| `notification-service` | Multi-channel (email/in-app), templates, BullMQ queue + retry + DLQ, preferences, digests | Automation story |
| `feature-flags-service` | Flags + per-tenant overrides + licenses | Modularity story |
| `search-service` | Cross-entity denormalized index, permission-trimmed results | Global search demo |
| `assistant-service` | AI assistant: chat + smart search (Claude default, offline engine fallback) | AI section |
| `metadata-service` | **Custom fields platform**: entity/field/layout/picklist definitions, JSONB values | Customization page |
| `workflow-service` | Workflow definitions/versions/triggers/steps/instances, approval engine + designer | Workflow builder page |
| `reporting-service` | Report definitions, runs, schedules, dashboards, widgets | Analytics/reports page |
| `ops-service` | Background jobs + runs, storage buckets/objects, notes, log query (Loki/Azure) | Ops/reliability proof |
| `api-management-service` | API clients, hashed API keys (one-time reveal, rotate/revoke), **webhooks** | Developer platform page |
| `releases-service` | Releases, changelog, deployments | Changelog surface (public!) |
| `knowledge-base-service` | Categories + articles | **Powers the site's blog/resources feed today** |
| `billing-service` | Plans, subscriptions, invoices, payments, credit notes, metering, dunning, metrics SQL | **Powers the live pricing page today** |

### Business modules (CRM / PSA)
| Service | Modules |
|---|---|
| `crm-service` | Leads, Contacts, Companies, Activities |
| `sales-service` | Deals, pipeline, governance/approvals, forecast |
| `project-service` | Projects, internal projects, project requests, clients |
| `wbs-service` | Work breakdown structures, plans, approvals |
| `task-service` | Work items, Kanban boards, sprints, epics, hierarchy |
| `timesheet-service` | Time entry, week editor, submission, approvals, calendar |
| `employee-service` | People directory, engagements, capacity planning, org chart |
| `talentory-service` | Skills & Learning (skills matrix, L&D, certifications) |
| `help-service` | Support tickets, replies, SLA |

### HRMS track (Phase 5 — built)
| Service | Modules |
|---|---|
| `leave-service` | Leave types, policies, balances, requests + approvals |
| `attendance-service` | Check-in/out, shifts, holiday calendars, regularization |
| `performance-service` | Goals/OKRs, check-ins, review cycles, forms |
| `recruitment-service` | Requisitions, pipeline, interview feedback, offers |
| `workplace-service` | Announcements, policies + acknowledgements, assets, expenses |

**Website implication:** RocketCRM is not "a CRM". It is a **CRM + PSA + HRMS suite on one permission
model**. That is the positioning wedge — see `01-brand-and-positioning.md`.

---

## 3. Feature clusters (derived, for site IA)

Collapsing 30 services into buyer-legible clusters. This is the map the navigation and module pages use.

1. **Revenue** — CRM (leads/contacts/companies/activities), Sales pipeline + deal governance, forecast,
   quotes-adjacent billing. *Buyer: CRO / Sales Director.*
2. **Delivery** — Projects, internal projects, project requests, WBS, Tasks/Kanban/sprints, Timesheets,
   capacity. *Buyer: COO / Delivery Head / PMO.*
3. **People** — Employees, org chart, Skills & Learning, Leave, Attendance, Performance, Recruitment,
   Workplace. *Buyer: CHRO / HR Head.*
4. **Service** — Help Center tickets, SLA, Knowledge Base, Customer Portal. *Buyer: Support Head.*
5. **Intelligence** — Reporting + dashboards, global search, AI assistant, analytics. *Buyer: CEO / RevOps.*
6. **Platform** — Custom fields, workflow builder, feature flags/licenses, API + webhooks + SDK,
   integrations, i18n, white-label. *Buyer: CTO / Platform lead.*
7. **Trust** — RBAC + overrides/delegations, SSO/SCIM, audit + hash chain, GDPR DSR, observability,
   multi-tenant isolation, DR. *Buyer: CISO / Procurement.*

Each cluster gets: a homepage section (one idea), a dedicated page (`05-module-showcase-pages.md`), and
a role-targeted entry in Solutions (`06-`).

---

## 4. Design system inventory (`packages/ui`)

- **Tokens:** oklch color space, CSS-first Tailwind v4 `@theme`, light default + `.dark` variant.
  Brand indigo `oklch(0.546 0.215 277)`. Semantic set: destructive / success / warning / info. Five
  categorical chart hues. Dedicated sidebar token group. Radius base `0.625rem`.
  Source: `packages/ui/src/styles/globals.css`.
- **Primitives (31):** accordion, alert, avatar, badge, breadcrumb, button, calendar, card, chart,
  checkbox, chip, command, dialog, dropdown-menu, input, label, popover, radio-group, scroll-area,
  select, separator, sheet, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, tooltip.
- **Patterns (34):** accessible-board (dnd-kit), attachment-list, bulk-action-bar, combobox,
  command-palette, data-table (+selection), date-picker, density-toggle, diff-viewer, dynamic-field,
  empty-state, file-upload, filter-builder, flags-provider, grid, import-wizard, kanban, list-pager,
  locale-switcher, mention-input, onboarding-checklist, page-container, page-header, permission-gate,
  rich-text-editor, saved-view-switcher, section, segmented-tabs, session-expiry-watcher, timeline,
  underline-tabs, user-avatar-picker, virtual-list, org-chart.
- **Quality gates:** Storybook with axe failing-on-violation; jest coverage ~99% on the doc-scoped
  surface; a real WCAG contrast script (`scripts/check-dark-contrast.mjs`) is CI-gated.

**Website implication:** the product genuinely looks good and is genuinely accessible. Screenshots can
be shown at full fidelity without retouching — which is rare and is itself a trust signal.

---

## 5. Existing marketing site — honest assessment

Current state (`apps/marketing`, 23 source files, 7 pages: home, features, pricing, about, contact,
blog, blog/[slug]):

| Aspect | Today | Verdict |
|---|---|---|
| Homepage | 113 lines, 4 sections (hero, stats, features, CTA band) | A competent placeholder. Not a product story. |
| Theme | Standalone Tailwind v4, **dark-only**, violet `#7c5cff` → cyan `#22d3ee` | Generic 2021-era SaaS gradient. No light mode. |
| Typography | `ui-sans-serif` system stack | No brand voice; the #1 upgrade opportunity |
| Motion | None (one `scroll-behavior: smooth`) | Zero |
| Imagery | None — **not one product screenshot** | The single biggest miss: 35 real screens sit unused in `screens/` |
| Proof | 4 stat cards, 3 of which are architectural | Honest but thin |
| Live data | Pricing ← billing-service; blog ← knowledge-base-service; leads → crm-service | **Genuinely good** — keep and extend |
| Resilience | All loaders tolerant, `server-only`, timeouts, revalidate 60 | Excellent; preserve exactly |
| A11y | Focus rings present, semantic headings | Baseline OK, unaudited |
| SEO | Basic metadata in `layout.tsx` | No OG images, no schema.org, no sitemap |

**Keep:** the server-only data layer, tolerant fallbacks, live pricing/blog/lead wiring, the
`primitives.tsx` component discipline, the Nx target setup.
**Replace:** theme, typography, every page's composition, and the complete absence of product imagery
and motion.

---

## 6. Visual assets that already exist

`screens/` holds **35 real product screenshots** at desktop fidelity, including: login, client &
internal projects, project details, project requests + form, resource engagement, Kanban task
management + add-epic, my-sales (active/won/lost/details/tasks), timesheets (7 states: not submitted,
pending, approved, expanded, calendar, request, status), employee details/feedback/directory + filters,
reportees (projects, timesheet, skill matrix), sticky notes.

These map cleanly onto the Revenue / Delivery / People clusters and are the raw material for the
device showcase and module pages (`10-visual-assets-and-devices.md`). Gaps needing fresh capture:
admin console, dashboards/reports, workflow designer, custom fields, mobile viewports, dark mode.

---

## 7. What does NOT exist (do not claim, do not fake)

| Requested by brief | Reality | Plan |
|---|---|---|
| Customer logos | None in repo, no permissions on file | Component built, gated on real input (`07-`) |
| Testimonials / case studies / success stories | None | Sections built as data-driven, render only with real content |
| Awards | None | Omitted |
| SOC 2 / ISO certification | Architecture is *ready*; doc 28 built GDPR DSR + retention + hash-chain. **No audit performed.** | "Ready architecture" + control list. No badge. |
| Published uptime SLA | Not legally approved | Architectural claim only ("HPA, health aggregation, rollback pipeline"), no % |
| Native mobile apps | Responsive web + PWA manifest only | Say "responsive web + installable PWA" — accurate and still strong |
| Public app marketplace | Not built | Roadmap section, honestly labelled |
| Figma design file | Not present in repo; MCP connected but no file URL supplied | `screens/` + `packages/ui` are the design source; Figma is an *output* (`14-`) |

---

## 8. Competitive frame

Benchmarked against Zoho One, Salesforce, HubSpot, Monday, Odoo (feature suites) and Stripe, Linear,
Vercel, Notion (site craft).

**Where RocketCRM genuinely wins and the site must say so:**
1. **One permission model across CRM + PSA + HRMS.** Competitors bolt suites together; RBAC here is one
   catalog, deny-by-default in all 30 services, with overrides, delegations, and time-limited grants.
2. **Architectural transparency.** We can publish the service map, the gateway trust boundary, the
   audit hash chain. Almost no competitor does.
3. **Modularity without a rebuild.** Feature flags + licenses turn modules on per tenant.
4. **No cloud lock-in.** Azure-first with a documented free-tier failover runbook and a compose stack
   that boots the entire platform. This is a procurement-grade differentiator.
5. **Customization without code.** Custom fields metadata service + visual workflow designer, both built.

**Where we are weaker and the site must not overreach:** brand recognition, ecosystem/marketplace,
customer proof, native mobile. Strategy: convert architectural credibility into trust, and route the
missing social proof into a "founding customers" program rather than faking it (`08-`).

---

## Completion Status

- [x] Service, model, route, component and test counts verified by enumeration
- [x] Module map derived from `services/` + both nav registries
- [x] Feature clusters defined for IA
- [x] Existing marketing site audited
- [x] Existing visual assets catalogued
- [x] Non-existent assets explicitly listed to prevent fabrication
- [ ] Figma file analysed — **blocked, no file URL supplied**
