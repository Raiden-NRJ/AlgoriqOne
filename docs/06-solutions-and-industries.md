# 06 — Solutions, Industries & Comparison Pages

**Depends on:** `01` (ICP + buying committee), `05` (module template).
**Purpose:** the pages that let a visitor see themselves. Product pages answer *what it does*;
solutions pages answer *what it does for me*, which is what actually converts a non-technical buyer.

---

## 1. Two axes, one template

Solutions split by **industry** (the company's shape) and by **role** (the reader's job). Both use one
template so we can add either kind cheaply:

1. **Hero** — "Algoryq One for <X>", the outcome sentence, one screenshot configured for X.
2. **"A week in your role/industry"** — a narrative timeline, not a feature list. The single most
   effective device on a solutions page: it makes the product concrete before it makes it impressive.
3. **The three problems X has** — named specifically enough that the reader thinks "how do they know".
4. **How Algoryq One handles each** — module + screenshot + the mechanism.
5. **The configuration** — which clusters, which roles, which permission set, which workflows. This
   is where our modularity (feature flags + licenses) becomes a selling point: *"turn on what you need".*
6. **What you'd replace** — a plain list of tool categories consolidated, feeding the ROI calculator.
7. **Migration path** — how data comes in (import wizard, API), how long, what's manual.
8. **CTA** — start free / talk to us.

**Copy discipline:** no invented customer stories, no "companies like yours see X%". Where a number
would normally go, we use a *mechanism* instead ("one approval inbox instead of four") — which is both
honest and more persuasive to a skeptical reader.

---

## 2. Industry pages

### `/solutions/professional-services` — the primary ICP
Consultancies, systems integrators, IT services. The one industry where the CRM + PSA + HRMS overlap
is not a nice-to-have but the core operating problem: a deal's outcome depends on staffing, which
depends on capacity, which depends on leave, which depends on HR.

Week-narrative beats: pipeline review Monday → resourcing conflict Tuesday → project request approval
Wednesday → timesheet chase Thursday → month-end billing Friday. Every beat maps to a real module.
Replaces: CRM + PSA + time tracking + resource planning + HRMS + approval email.

### `/solutions/agencies`
Creative and marketing agencies. Emphasis: client portal (real, shipping), retainer vs project work,
utilization, billable ratio, client-visible project status. Strongest single hook: *"your client logs
in and sees their own projects and invoices"* — the customer portal is a differentiator here.

### `/solutions/technology`
Product companies with delivery/services arms. Emphasis: sprints, epics, work-item hierarchy,
engineering-adjacent workflows, API-first extensibility, SSO/SCIM for a security-literate buyer.

**Deferred industries** (build only when there's demand evidence): financial services, healthcare,
manufacturing, education, non-profit. Each would need compliance claims we can't yet make (HIPAA,
FINRA). Listing them now with thin content would hurt credibility more than the traffic is worth.

---

## 3. Role pages — `/solutions/by-role/[role]`

Five roles, each mapped from `01` §4's buying committee. The page opens with the reader's actual
question, answered in the first 80 words.

| Route | Opens with | Leads to |
|---|---|---|
| `/by-role/sales` | "Will my reps actually use it?" | Pipeline, mobile, activity capture, forecast |
| `/by-role/delivery` | "Can it handle real project structure?" | WBS, capacity, timesheets, approvals |
| `/by-role/hr` | "Is the HR side real?" | Leave, attendance, performance, recruitment, org chart |
| `/by-role/it` | "What am I inheriting?" | Architecture, SSO/SCIM, API, deployment, portability |
| `/by-role/finance` | "Where do the numbers come from?" | Billing, invoices, billable hours, reporting, audit |

The IT page is effectively a second homepage for our highest-value visitor and should be built with
the same care as `/platform/architecture` — they will be read together.

---

## 4. Comparison pages — `/compare/[competitor]`

High commercial intent, high SEO value, high credibility risk. Rules that keep them an asset:

1. **Accuracy over advantage.** Every competitor claim is dated, sourced to their public documentation,
   and linked. A single wrong claim discredits the whole page.
2. **Concede real strengths.** Every page includes a "Where <competitor> is the better choice" block.
   This is not modesty — it is the highest-converting element on a comparison page, because it makes
   every other claim believable.
3. **Compare on structure, not checkboxes.** Our advantage is architectural (one permission model, one
   audit trail, portability), not feature count. A feature-count war against Salesforce is unwinnable.
4. **Quarterly review cadence.** Stale comparisons are worse than none. Each page carries a visible
   "verified <date>" stamp.
5. **No competitor logos or trademarks** beyond nominative text use. Legal review before publish.

| Page | Our honest angle | Their honest strength |
|---|---|---|
| `/compare/zoho-one` | Zoho is many apps sharing a login; our modules share a permission model and audit trail | Breadth, price, ecosystem maturity |
| `/compare/salesforce` | Consolidation without a systems-integrator project; delivery + HR included | Ecosystem, AppExchange, enterprise track record |
| `/compare/hubspot` | Delivery and people, not just go-to-market; deeper permissions | Marketing automation, ease, brand |
| `/compare/monday` | A real system of record with server-enforced permissions, not a flexible board | Flexibility, onboarding speed, UX polish |
| `/compare/odoo` | Modern service architecture, first-class RBAC, managed or self-hosted | Open source, ERP/manufacturing depth, module count |

Each page ends with a **switching section**: what migrates cleanly (via the import wizard and API),
what needs manual work, and a realistic timeline. Naming the manual work is a trust move.

---

## 5. `/customers` — gated

Case-study template is built and tested now, content-gated exactly like §15 of the homepage. Each case
study, when real content exists, requires: named company, named person with title, written approval on
file, at least one metric the customer states themselves, and a "verified" date.

**Until then the route renders a "Founding customers" page** — an honest, deliberate offer: early
partners get implementation support and roadmap influence in exchange for a public reference. That is
a real program, not a placeholder, and it is the correct answer to "we have no logos yet" for a
platform at this stage.

## Completion Status

- [ ] Shared solutions template built
- [ ] 3 industry pages
- [ ] 5 role pages (IT page held to architecture-page quality bar)
- [ ] 5 comparison pages, each legal-reviewed and date-stamped
- [ ] `/customers` shipped in founding-customers state, case-study template tested
