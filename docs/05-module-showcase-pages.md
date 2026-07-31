# 05 — Module Showcase Pages

**Depends on:** `00` §2–3 (real module map), `03` (sitemap), `02` (components).
**Purpose:** the template and per-page content spec for the five product-cluster pages and the six
platform pages. These carry the depth the homepage deliberately refuses to carry.

---

## 1. The shared template

Every module page uses one composition. Consistency is the point: a visitor who reads two of them
should feel the same hand, and we should be able to add a twelfth page without a design cycle.

| Slot | Content | Notes |
|---|---|---|
| **1. Page hero** | Eyebrow (cluster) · headline (the outcome, not the feature) · sub · primary CTA · one real screenshot in a `DeviceFrame` | Half-height of the homepage hero |
| **2. The job** | 3 bullets: what this cluster is responsible for in a real week | Written as jobs-to-be-done, not features |
| **3. Anchor rail** | Sticky sub-nav of the sections below, desktop ≥1280px | `aria-current`, smooth scroll |
| **4. Module deep-dives** | One block per module in the cluster: name, purpose, business value, real screenshot or interactive demo, key capabilities list | Alternating 7/5 / 5/7 to avoid rhythm fatigue |
| **5. The workflow** | An animated end-to-end chain showing how the modules connect | The section that proves it's one system |
| **6. Permissions for this cluster** | The real catalog keys this cluster uses, and which roles typically hold them | Reinforces the wedge on every page |
| **7. Data & API** | The entities involved, the endpoints, a code sample | Aimed at the technical evaluator |
| **8. Integrations & extensibility** | Custom fields available here, workflow triggers this cluster emits, webhook events | Real capability, real names |
| **9. Related clusters** | 2–3 cards | Keeps depth-readers moving laterally |
| **10. CTA band** | Start free / talk to us | Same on every page |

**Content sourcing rule:** every module name, entity name, permission key and endpoint on these pages
is copied from the codebase — `services/*/prisma/schema.prisma`, the nav registries, the permission
catalog, and `docs/openapi`. No paraphrasing that could drift into a claim we don't ship.

---

## 2. `/product/revenue`

**Headline:** *"Every deal, every touch, every approval — in one place your finance team also trusts."*

| Module | Purpose | Business value | Asset |
|---|---|---|---|
| Leads | Capture and qualify inbound + outbound | Nothing falls through; web-to-lead already feeds from this site | `screens/` (capture new) |
| Contacts & Companies | The relationship graph | One customer record the whole company shares | new capture |
| Activities | Calls, meetings, notes, timeline per entity | Real history, not memory | new capture |
| Deals & Pipeline | Stages, values, forecast | `my_sales_active/won/lost/details` — **real screens exist** | `screens/my_sales_*.png` |
| Deal governance | Discount/approval thresholds | Deal desk without a spreadsheet | live demo |
| Forecast | Weighted pipeline over time | Uses the shared `ChartContainer` | chart |

**Workflow chain (slot 5):** Lead → qualified → Deal → governance approval → won → **project created,
delivery team allocated, timesheets billable**. That last hop is the whole thesis and no CRM-only
competitor can draw it.

**Permissions (slot 6):** `crm.lead.*`, `crm.contact.*`, `crm.company.*`, `crm.activity.*`,
`sales.deal.*`, `sales.deal.approve`.

---

## 3. `/product/delivery`

**Headline:** *"From a project request to an approved timesheet, without leaving the platform."*

| Module | Purpose | Asset |
|---|---|---|
| Clients & Projects | Client-facing delivery portfolio | `screens/client_projects.png`, `project_details.png` |
| Internal projects | Non-billable work, tracked the same way | `screens/internal_projects.png` |
| Project requests | Intake with an approval chain | `screens/internal_projects_request*.png` |
| WBS | Structured breakdown, plans, approvals | new capture |
| Tasks, sprints, epics | Kanban with keyboard-accessible drag | `screens/project_task_management_kanban.png`, `kanban_add_epic.png` |
| Timesheets | Week editor, submit, approve, calendar | **7 real screens** — the richest asset set we own |
| Capacity | Who's available, who's over-allocated | `screens/project_resource_engagement.png` |

**Workflow chain:** Request → approve → project → WBS → tasks → time logged → timesheet submitted →
approved → **billable hours to an invoice, and capacity that already knows about approved leave**.

**Accessibility callout on this page:** the Kanban's "Move to…" menu is a *selling point* for
enterprise buyers with accessibility procurement requirements. Say so explicitly — few competitors can.

**Permissions:** `project.*`, `project.request`, `wbs.*`, `task.*`, `timesheet.*`, `timesheet.approve`,
`employee.capacity`.

---

## 4. `/product/people`

**Headline:** *"HR that shares a permission model with the rest of your business."*

| Module | Purpose | Asset |
|---|---|---|
| Employee directory | The people record | `screens/total_employees*.png`, `employee_details.png` |
| Org chart | Structure, reporting lines, org-unit scopes | `org-chart` pattern |
| Skills & Learning | Skills matrix, L&D, certifications | `screens/reportees_skill_matrix.png` |
| Leave | Types, policies, balances, requests, approvals | new capture |
| Attendance | Check-in/out, shifts, holidays, regularization | new capture |
| Performance | Goals/OKRs, check-ins, review cycles, forms | `screens/employee_feedback.png` |
| Recruitment | Requisitions, pipeline, feedback, offers | new capture |
| Workplace | Announcements, policies + acknowledgements, assets, expenses | new capture |

**Naming rule:** "Skills & Learning" everywhere. "Talentory" is an internal service name and never
appears on the site.

**Workflow chain:** Requisition → hire → onboarding checklist → **access provisioned through the same
RBAC engine** → capacity updated → leave accrues → performance cycle. The offboarding mirror is the
strongest security story on the site: one revoke, propagated by permission version, across all 30
services.

**Permissions:** `employee.*`, `leave.request.*`, `attendance.record.*`, `performance.goal.*`,
`recruitment.requisition.*`, `workplace.announcement.*`.

---

## 5. `/product/service`

**Headline:** *"Support your customers can reach, on a portal they don't need an account request for."*

Modules: Help desk tickets (replies, SLA, assignment) · Knowledge base (categories, articles,
publishing) · **Customer portal** (17 real routes — projects, invoices, support, KB, profile) ·
Notifications (multi-channel, queue + retry + DLQ).

**Distinct angle:** the customer portal is a *shipping product*, not a promise. Show it. Most CRMs
charge for the customer-facing layer or don't have one.

**Permissions:** `help.ticket.*`, `help.ticket.comment`, `knowledgebase.article.*`.

---

## 6. `/product/intelligence`

**Headline:** *"One set of numbers, because there's one system of record."*

Modules: Report builder (definitions, runs, schedules) · Dashboards + widgets (per-widget permissions) ·
Global search (cross-entity, permission-trimmed — a genuinely rare capability, say it loudly) ·
AI assistant (chat + smart search, RBAC-scoped retrieval).

**The section that wins this page:** permission-trimmed search and RBAC-scoped AI. Every competitor
claims AI; almost none can say their assistant cannot surface a record the asker isn't allowed to see.

---

## 7. Platform pages

### `/platform/architecture`
The technical trust page. The full service map, the gateway trust boundary (JWT validation, header
stripping, tenant/user stamping, rate limiting), database-per-service isolation, event contracts,
observability (pino / Prometheus / OpenTelemetry), scale mechanics (HPA, cursor pagination, read
models, Redis-backed rate limiting), and the deploy pipeline with automatic rollback. Includes real
performance characteristics from `docs/perf-baseline.md` — **cited as measured, with the conditions
stated**, never as a marketing round number.

### `/platform/customization`
Custom fields metadata service: entity/field/layout/picklist definitions, JSONB storage with GIN
indexes, dynamic form and table rendering, per-tenant limits. Live demo: add a field, watch it appear
in a form, a table, a filter, and an API response. Also: saved views, filter builder, density and
column preferences, white-label branding.

### `/platform/workflows`
The workflow engine: definitions → versions → triggers → steps → instances, the visual approval
designer, sequential/parallel chains, role- and org-unit-based approvers, escalation SLAs, delegation.
The unified `/actions` inbox as the payoff. Honest scope note: auto-trigger from events is partially
delivered (doc 24) — say what's live and what's next rather than blurring it.

### `/platform/ai`
Assistant capability, the offline-engine fallback (a real differentiator for air-gapped/regulated
buyers), RBAC-scoped retrieval, audit of AI actions, and an explicit **AI governance** block: what
data is sent where, what is retained, how to turn it off per tenant. Enterprise buyers ask this
first now; answering it plainly is a conversion event.

### `/platform/mobile`
Honest scope: responsive web across all breakpoints, installable PWA, offline-tolerant reads,
touch-accessible drag-and-drop, mobile-optimised timesheet week editor and approvals. **No native-app
claim.** Frame it as "approve from your phone in the queue at the airport" — the real job.

### `/platform/white-label`
Branding, theme builder with live push, custom domains, tenant provisioning wizard. Aimed at partners
and resellers — a distinct, high-value audience most competitors' sites ignore entirely.

---

## Completion Status

- [ ] Shared template component built and used by all 11 pages
- [ ] 5 product-cluster pages built with real module/permission/endpoint data
- [ ] 6 platform pages built
- [ ] Every screenshot either sourced from `screens/` or newly captured per `10-`
- [ ] Workflow-chain animations built per cluster
- [ ] All permission keys verified against the live catalog before publish
