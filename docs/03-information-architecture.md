# 03 — Information Architecture & Sitemap

**Depends on:** `01` (narrative spine), `00` (module map).
**Purpose:** resolve the requested 37-section homepage into a structure that stays a keynote, and
define the full site map, navigation, and URL contract.

---

## 1. The central IA decision

The brief asks for **37 homepage sections** *and* for an Apple-keynote scroll with "one idea per
section, no information overload". Taken literally, those two requirements are contradictory: 37
sections at enterprise section-height is a ~45,000px page, roughly 12 minutes of scrolling, and every
section past ~18 is read by under 5% of visitors.

**Resolution: all 37 topics ship. Sixteen live on the homepage; twenty-one become destination pages
that the homepage explicitly routes to.** Nothing is dropped — depth is *promoted* out of the scroll
into pages that rank in search, can be linked in a procurement email, and can be sent to one
stakeholder without the other 30 sections.

This is how Stripe, Linear and Vercel actually do it, and it converts better because a CISO can be
sent `/security` directly instead of being asked to scroll past the ROI calculator.

### Topic disposition table

| # | Requested topic | Disposition |
|---|---|---|
| 1 | Hero | **Homepage §1** |
| 2 | Trusted by | **Homepage §2** — gated; renders "engineering proof" band until real logos exist (`07-`) |
| 3 | Pain points | **Homepage §3** |
| 4 | Why current CRMs fail | **Homepage §3** (merged — same idea, two halves) |
| 5 | Why our CRM exists | **Homepage §4** |
| 6 | Product introduction | **Homepage §5** |
| 7 | Interactive CRM overview | **Homepage §6** (the centrepiece) |
| 8 | Key modules | **Homepage §7** (cluster switcher) |
| 9 | Smart automation | `/platform/workflows` · homepage §9 teaser |
| 10 | AI features | `/platform/ai` · homepage §9 teaser |
| 11 | Lead management | `/product/revenue` |
| 12 | Sales pipeline | `/product/revenue` · homepage §7 tab |
| 13 | Customer management | `/product/revenue` |
| 14 | Team collaboration | `/product/delivery` |
| 15 | Analytics | `/product/intelligence` · homepage §10 |
| 16 | Reports | `/product/intelligence` |
| 17 | Mobile app | **Homepage §11** (device showcase) + `/platform/mobile` |
| 18 | Workflow builder | `/platform/workflows` |
| 19 | Integrations | `/developers/integrations` · homepage §12 |
| 20 | API | `/developers` · homepage §12 |
| 21 | Security | **Homepage §13** → `/security` |
| 22 | Permissions | **Homepage §8** (our wedge — gets full homepage treatment) → `/security/permissions` |
| 23 | Multi-role support | `/security/permissions` · homepage §8 |
| 24 | Performance | `/platform/architecture` |
| 25 | Cloud infrastructure | `/platform/architecture` · homepage §13 |
| 26 | Customization | `/platform/customization` · homepage §9 |
| 27 | Industry solutions | `/solutions/*` · homepage §14 |
| 28 | Case studies | `/customers` — **gated on real content** |
| 29 | Customer success stories | `/customers` — gated |
| 30 | Testimonials | **Homepage §15** — gated; omitted, never faked |
| 31 | ROI calculator | `/roi` · homepage §16 entry |
| 32 | Before vs after | **Homepage §4** (integrated into "why we exist") |
| 33 | Feature comparison | `/compare`, `/compare/[competitor]` |
| 34 | Pricing preview | **Homepage §17** |
| 35 | FAQ | **Homepage §18** (top 6) → `/faq` (full) |
| 36 | Final CTA | **Homepage §19** |
| 37 | Footer | **Homepage §20** |

**Homepage final count: 20 sections** (16 narrative + trust bar + testimonials slot + CTA + footer).
Target page height ~22,000px at desktop, ~4.5 minutes of engaged scroll. Section-by-section spec:
`04-homepage-blueprint.md`.

---

## 2. Sitemap

```
/                                  Homepage
/product
  /revenue                         CRM, pipeline, deals, forecast, activities
  /delivery                        Projects, WBS, tasks, timesheets, capacity
  /people                          Employees, leave, attendance, performance, recruitment, workplace
  /service                         Help desk, SLA, knowledge base, customer portal
  /intelligence                    Reports, dashboards, search, AI assistant
/platform
  /architecture                    30 services, gateway, isolation, scale, observability
  /customization                   Custom fields, layouts, picklists, saved views
  /workflows                       Workflow engine + approval designer + automation
  /ai                              Assistant, smart search, AI governance
  /mobile                          Responsive + PWA, honestly scoped
  /white-label                     Branding, custom domains, tenant provisioning
/security                          Trust centre (hub)
  /permissions                     RBAC deep dive — the wedge page
  /compliance                      GDPR/DSR, audit, retention, data residency
  /infrastructure                  Hosting, isolation, backups, DR, portability
/developers                        API overview, SDK, auth, quickstart
  /api                             Endpoint reference (from docs/openapi)
  /webhooks                        Events, HMAC signing, delivery log
  /integrations                    Integration hub + what's possible today
/solutions
  /professional-services
  /agencies
  /technology
  /by-role/[role]                  sales | delivery | hr | it | finance
/pricing                           Live plans from billing-service
/roi                               ROI calculator
/compare
  /[competitor]                    zoho-one | salesforce | hubspot | monday | odoo
/customers                         Case studies — gated on real content
/resources
  /blog + /blog/[slug]             knowledge-base-service (exists today)
  /guides/[slug]
  /changelog                       releases-service — public, live, high-trust
  /docs                            → external docs
/company
  /about                           (exists today)
  /careers
  /contact                         (exists today)
  /legal/{privacy,terms,dpa,subprocessors,security-policy}
/demo                              Self-serve interactive product tour
/signup  /login                    → portal (3100)
```

**Route count: ~45 pages** (from 7 today). Templated routes (`/compare/[competitor]`,
`/solutions/by-role/[role]`, `/blog/[slug]`) keep the component count manageable.

---

## 3. Navigation

### 3.1 Header

Sticky, 68px, backdrop-blurred at scroll > 24px, hairline bottom border that fades in. Contents:
logo · **Product** (mega) · **Platform** (mega) · **Security** · **Developers** · **Pricing** ·
**Resources** (mega) · [theme toggle] · **Sign in** (text) · **Start free** (primary).

**Mega-menu spec** (Product): 3 columns — cluster list with icon + one-line value prop; a "By role"
column; a featured card (changelog entry or a product screenshot). Opens on hover *with a 120ms intent
delay* and on click/Enter for keyboard and touch. Full keyboard model: `Escape` closes and returns
focus to the trigger, arrow keys move within, `Tab` exits. Implemented as a client island; the links
exist in the DOM for crawlers and no-JS users.

Mobile: full-screen sheet, accordion sections, `Start free` pinned at the bottom, focus trapped, body
scroll locked.

### 3.2 Footer

Six columns: Product · Platform · Solutions · Developers · Resources · Company. Plus: theme toggle,
locale switcher (i18n runtime exists — doc 21), status link, security link, legal row, social.
The footer is a genuine navigation surface and an SEO asset — every page in the sitemap is reachable
from it.

### 3.3 In-page navigation

- **Scroll progress bar** — 2px, brand, top edge, homepage and long pages only.
- **Section anchor rail** — desktop ≥1280px on `/security`, `/platform/architecture`, `/faq`: a right-
  aligned dot rail with labels on hover, `aria-current` on the active section.
- **Mobile sticky CTA** — appears after the visitor passes the hero, dismissible, never covers content
  (bottom padding reserved on `<body>`).

---

## 4. URL & metadata contract

- Lowercase, hyphenated, no trailing slash, no `.html`. Stable forever — every URL that ships gets a
  permanent redirect if it ever moves.
- Existing URLs `/features`, `/pricing`, `/about`, `/contact`, `/blog` **must keep working**:
  `/features` → 301 `/product/revenue`; the rest stay in place.
- Every page defines: `title` (≤60ch), `description` (≤155ch), canonical, OG image (generated —
  `12-`), `twitter:card`, and a JSON-LD block. No page ships with inherited-only metadata.

## 5. Conversion path architecture

Three intent lanes, and every page belongs to exactly one primary lane:

| Lane | Visitor | Primary CTA | Secondary |
|---|---|---|---|
| **Self-serve** | Practitioner, evaluating | Start free | Interactive demo |
| **Technical** | CTO/CISO, verifying | Read the architecture | API docs / changelog |
| **Enterprise** | Procurement/exec | Talk to us | Pricing / ROI |

Rules: exactly **one primary CTA per viewport**. Never two competing primaries. Every page has a
terminal CTA band. No modal interrupts, no exit-intent popups, no auto-opening chat — these violate
brand attribute #2 (composed) and measurably annoy enterprise buyers.

## Completion Status

- [x] 37 requested topics dispositioned with zero drops
- [x] Homepage bounded to 20 sections with rationale
- [x] Full sitemap (~45 routes) defined
- [x] Header/mega-menu/footer/in-page nav specified with keyboard models
- [x] URL contract + legacy redirect plan
- [x] Conversion lanes and CTA discipline defined
