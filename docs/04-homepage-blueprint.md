# 04 — Homepage Blueprint

**Depends on:** `01` (spine), `02` (tokens), `03` (section budget).
**Purpose:** the section-by-section build spec for `apps/marketing/src/app/page.tsx`. This is the
single most important document in the folder.

Each section below specifies: the **beat** it serves (from `01` §8), the **one idea**, layout, visual,
motion, copy direction, data source, and the a11y/performance note. Copy shown is production-intent,
not placeholder — it is written to the voice rules in `01` §6.

---

## §1 — Hero  ·  Beat 1 (Recognition)  ·  `HeroSection`

**One idea:** three systems, one permission model.

**Layout.** Full-viewport-minus-header, 12-col. Left 6 cols: eyebrow, headline, sub, CTA pair, trust
row. Right 6 cols (≥1024px): the live product surface. Below 1024px the surface moves under the copy
and crops to 70% height. Vertical centring with `min-height: min(100svh - 68px, 900px)` — never
`100vh` (mobile browser-chrome bug).

**Headline.** `display-1`, max 22ch, `text-wrap: balance`:
> **Revenue, delivery, and people.**
> **One permission model.**

Line 2 in `--brand-600`. No gradient text in the hero — the contrast contract (`02` §2.6) and the
brand-attribute "substantiated" both argue against it.

**Sub** (`body-lg`, `--fg-muted`, max 52ch):
> Algoryq One runs your CRM, projects, and HR on one platform where every module shares the same
> authorization engine, audit trail, and API — so your systems finally agree.

**CTAs.** Primary `Start free` → `/signup`. Secondary `See it working` → smooth-scrolls to §6 (not an
external nav — it keeps the visitor in the story). Below: three `Check`-marked micro-proofs —
*Free 14-day trial · No credit card · Self-hosted option available*. Each is verifiable.

**The visual — decision.** Not a video (weight, CLS, no control), not 3D (bundle cost, a11y). It is an
**orchestrated product composition**: a `ProductWindow` showing a real dashboard screenshot, with three
floating `--surface-raised` cards docked at its edges, each representing a different cluster:

- an **approval inbox row** (Delivery) — "Timesheet · 38h · Approve",
- a **pipeline card** (Revenue) — "Acme Corp · $84,000 · Proposal",
- a **permission chip** (Trust) — `timesheet.approve` with a green check.

The permission chip is the payload: it visually links the other two cards to the wedge. On desktop the
three cards drift on a 2.5° parallax tied to pointer position (max 8px translate). No tilt, no
perspective distortion of the screenshot — that reads as a template.

**Motion.** A 900ms `--dur-cinematic` orchestration on load: window fades + rises 16px (0ms), cards
stagger in at 120/220/320ms with a 12px rise, permission chip's check draws at 520ms. Runs **once**,
never loops. Under `prefers-reduced-motion` everything is a 150ms opacity fade in place. The hero is
server-rendered complete; motion is a `Reveal` enhancement, so LCP is unaffected.

**Performance.** The dashboard screenshot is the LCP element: AVIF + WebP, `priority`, explicit
`width`/`height`, `fetchpriority="high"`, and a matched blur placeholder. Target LCP < 1.6s on 4G.

**A11y.** `<h1>` is the headline. Floating cards are `aria-hidden` (decorative composition; their
content is repeated in real sections). Screenshot has a substantive `alt` describing the dashboard.

---

## §2 — Trust bar  ·  Beat 1  ·  `TrustBar`  ·  **GATED**

**One idea:** other people rely on this.

**Reality check (`00` §7):** we have no customer logos and no permission to display any. Fabricating
them is banned by working rule #1 and is legally hazardous.

**Behaviour:** the component reads from `website/content/customers.json`. If it has ≥6 entries with
`permissionGranted: true`, it renders a monochrome, uniform-optical-size logo row (grayscale, 60%
opacity → full on hover, `Marquee` on mobile with pause-on-hover). If not, it renders the fallback:

**Fallback — "Engineering proof" band.** Four real, checkable facts in a hairline-bordered row:
`30 independently deployable services` · `254 data models` · `Deny-by-default authorization in every
service` · `Open API + typed SDK`. Each links to the page that proves it. This converts a weakness
into an on-brand strength and is strictly better than a grid of grey rectangles labelled
"Your logo here".

Height is identical in both states, so no layout shift and no design regression when logos arrive.

---

## §3 — The problem  ·  Beat 2 + 3 (Cost, Why it stayed broken)  ·  `ProblemSection`

**One idea:** disconnected systems cost you a reconciliation tax — and integrations don't fix it.

**Layout.** Centred `display-2` opener, then an asymmetric 5/7 split.

**Opener:**
> **Your CRM doesn't know who's billable. Your PSA doesn't know who's on leave.**
> **Your HRMS doesn't know either.**

**Left (5 cols) — the tax, four line items.** Each is a `Callout` with an icon, a claim, and a
concrete consequence:
1. **Duplicate records** — the same client exists three times, spelled three ways.
2. **Permission drift** — someone who left in March still has access in one of the three.
3. **Month-end archaeology** — reconciling time, invoices and headcount by hand.
4. **Approvals in four inboxes** — timesheets in one tool, deals in another, leave in email.

**Right (7 cols) — the diagram.** An animated SVG: three labelled system boxes (CRM / PSA / HRMS), six
brittle integration arrows between them, each arrow carrying a small failure tag ("nightly sync",
"CSV export", "manual"). On scroll into view, arrows draw in and two of them turn `--danger` and
dash — the visual argument that the integration layer is the failure, not the tools.

**Why it stayed broken** (closing paragraph under the diagram, `body-lg`):
> Suites solve this at the interface. They share a nav bar and a login, then keep three permission
> models, three audit trails, and three definitions of "customer" underneath. That's why the
> reconciliation never ends — you integrated the screens, not the data.

**Motion.** SVG stroke-dashoffset draw, staggered, `--dur-slow`, triggered once at 40% viewport.
Reduced motion: fully drawn on mount.

**Copy discipline.** This section names a real, expensive, familiar pain without naming a competitor.
Never mention Zoho/Salesforce by name outside `/compare` — punching down reads as insecure.

---

## §4 — Why Algoryq One exists  ·  Beat 4 (The claim)  ·  `ThesisSection`

**One idea:** built as one system from day one — here's the before/after.

**Layout.** Full-bleed `--bg-subtle` band. Centred thesis statement in `display-2`, max 26ch, then a
before/after comparison.

**Thesis:**
> **We didn't integrate three products. We built one.**
> Every Algoryq One module — leads, projects, timesheets, leave, payroll-adjacent HR — sits on the same
> authorization engine, emits into the same audit trail, and answers to the same API gateway.

**Before/After.** Two columns sharing a row scale, so differences are read across, not down. Six rows:

| | Three systems | Algoryq One |
|---|---|---|
| Permissions | Three models, manual reconciliation | One catalog, `module.resource.action`, enforced in every service |
| Approvals | Four inboxes | One inbox (`/actions`) |
| Audit | Three partial trails | One append-only trail with change diffs |
| Offboarding | Three tickets, weeks of drift | One revoke, propagated by permission version |
| Reporting | Export, merge, reconcile | One reporting service over shared read models |
| Adding a field | Vendor ticket × 3 | Self-serve, per tenant, no code |

Every "Algoryq One" cell is true and traceable (`00` §2). The left column uses `--fg-muted`; the right
uses `--fg` with a brand left-edge — the eye is pulled right without a garish colour block.

**Motion.** Rows reveal on a 60ms stagger. The right column's brand edge wipes down as the section
enters.

---

## §5 — Product introduction  ·  Beat 5  ·  `PlatformOverviewSection`

**One idea:** here is the whole platform, on one screen.

**Layout.** Centred heading, then a full-width architecture visual on `--container-wide`.

**Heading:** *"One gateway. Thirty services. Six clusters you actually care about."*

**The visual — `ArchitectureDiagram`.** A precise, non-decorative schematic of the real architecture:
client apps → API gateway (labelled with what it does: authenticates, stamps tenant + user, rate
limits) → six cluster groups, each showing its real service names. Below, the shared spine: identity ·
authorization · audit · notification · search.

This is the "trust the CTO instantly" moment. It is honest — it depicts the actual system — and no
competitor's homepage shows one. Hovering a cluster highlights it and dims the rest; clicking navigates
to that cluster's product page. Fully keyboard-navigable (each cluster is a `<a>` in a list; the SVG is
`role="img"` with a text description and an adjacent visually-hidden `<ul>` of the same links).

**Motion.** Nodes fade+scale in by layer (gateway → clusters → spine), 80ms stagger.

---

## §6 — Interactive product overview  ·  Beat 5  ·  `InteractiveOverview`  ·  **CENTREPIECE**

**One idea:** don't take our word for it — click through the actual product.

This is the section that replaces a sales call, and it gets the largest engineering budget on the site.

**Layout.** `--container-wide`, a `ProductWindow` with real browser chrome, sized 16:10, with a left
rail that mirrors the real portal's navigation (`apps/portal/src/lib/navigation.ts` sections: CRM,
Projects, Time & Work, People, Business).

**Behaviour.** Five tabs, each swapping the window content:
1. **Pipeline** — a genuinely interactive board built on the same `AccessibleBoard` interaction model
   as the product: drag a deal between stages, or use the "Move to…" menu (the guaranteed keyboard
   path). The value updates. This proves both usability *and* accessibility in one gesture.
2. **Approvals** — the `/actions` unified inbox: four module tabs, approve/reject with optimistic
   update and rollback. Demonstrates the wedge viscerally.
3. **Project → WBS → Timesheet** — a chain animation showing one project request becoming a WBS
   becoming logged, approved hours.
4. **People** — org chart + capacity heat, with leave overlaid. Shows CRM and HR sharing one surface.
5. **Permissions** — a live permission matrix: toggle a role, watch nav items and buttons disappear
   in the mock UI in real time. **This is the single most persuasive interaction on the site.**

**Implementation.** One client island, code-split, `next/dynamic` with `ssr: false` **only for the
interactive layer** — a static, server-rendered screenshot of tab 1 is the initial paint and the
fallback, so the section is complete and meaningful with JS disabled and contributes nothing to LCP
regression. State is local; **no backend calls** — the data is a fixture module, honestly labelled
"Sample data" in the window chrome.

**A11y.** Tabs are a real ARIA tablist with roving tabindex. Every drag has a menu equivalent. Every
state change announces via a polite live region. Autoplay-free: tabs only change on user action
(auto-rotating demos are banned — they steal control and hurt comprehension).

**Below the window:** one line — *"This is the real interface. Sample data."* Honesty is the brand.

---

## §7 — Module clusters  ·  Beat 6 (Depth)  ·  `ClusterSection`

**One idea:** each of these is a full product, not a tab.

**Layout.** A six-item cluster switcher (Revenue · Delivery · People · Service · Intelligence ·
Platform), rendered as a horizontal segmented control on desktop and a scroll-snap carousel on mobile.
Selecting a cluster reveals: a 7/5 split with a real screenshot from `screens/` on one side, and on
the other: cluster name, one-sentence value prop, the real module list, and a "Explore <cluster> →"
link to its product page.

**Content per cluster** — sourced from `00` §3, verbatim module names so nothing is invented:

| Cluster | Value prop | Modules shown |
|---|---|---|
| Revenue | Pipeline, deals and approvals without a spreadsheet on the side. | Leads · Contacts · Companies · Activities · Deals · Forecast · Deal governance |
| Delivery | Project request → WBS → task → timesheet. One chain, one approval inbox. | Projects · Internal projects · Requests · WBS · Tasks & sprints · Timesheets · Capacity |
| People | HR on the same permission model as your pipeline. | Employees · Org chart · Skills & Learning · Leave · Attendance · Performance · Recruitment · Workplace |
| Service | Tickets, SLAs and a knowledge base your customers can actually reach. | Help desk · SLA · Knowledge base · Customer portal |
| Intelligence | Reports built on read models, not screenshots of your data. | Reports · Dashboards · Global search · AI assistant |
| Platform | Add a field, build an approval flow, subscribe a webhook. No code. | Custom fields · Workflow designer · Feature flags · API & webhooks · i18n · White label |

**Motion.** Cross-fade + 8px slide on cluster change, `--dur-base`. Screenshot swaps with a
`ScreenshotFrame` that preloads the next-likely image on hover.

---

## §8 — Permissions  ·  Beat 6/8 (The wedge)  ·  `PermissionsSection`

**One idea:** authorization is enforced in every service, not hidden in the UI.

This section exists because it is our defensible moat. It gets full-section treatment while
"Multi-role support" (topic 23) folds into it.

**Layout.** Dark band (`--neutral-950` in light mode too — a deliberate tonal shift that marks the
"serious" part of the page), 5/7 split.

**Left — the argument:**
> **Most CRMs hide the buttons. We deny the request.**
> A hidden button is not a security control. In Algoryq One, every one of the 30 services checks a
> permission before it acts — deny by default, verified in tests, logged in the audit trail.

Four proof bullets: one permission catalog (`module.resource.action`) · per-user grants **and denies**,
with expiry · out-of-office delegation · scoped assignments (global, org-unit, record).

**Right — `PermissionMatrix`.** An interactive grid: rows = roles (Sales Rep, Delivery Lead, HR
Partner, Finance, Admin), columns = actions (`crm.lead.read`, `timesheet.approve`, `employee.read`,
`billing.invoice.refund`, `platform.workflow.manage`). Clicking a role filters, and a small mock UI
beside it shows exactly which nav items and buttons that role sees. Real permission keys throughout —
copied from the actual catalog, not invented.

**Link out:** "How authorization works →" `/security/permissions`.

---

## §9 — Automation, AI & customization  ·  Beat 7 (Platform)  ·  `PlatformCapabilitiesSection`

**One idea:** it bends to your process without a rebuild.

**Layout.** Three-up cards, each with a live micro-demo, not a static icon:

1. **Workflow designer** — a miniature canvas: trigger → condition → approval → notify, with a token
   animating along the path once on reveal. Copy: *"Build approval chains without code. Sequential or
   parallel, role- or org-unit-based, with escalation SLAs."* → `/platform/workflows`
2. **Custom fields** — a form that gains a field as you watch (a real `dynamic-field` render), with
   the field type picker visible. Copy: *"Add a field to any entity, per tenant. It appears in the
   form, the table, the filters, and the API."* → `/platform/customization`
3. **AI assistant** — a chat exchange where the assistant answers over the visitor's own module data
   and the response shows a permission-trimmed source list. Copy: *"Ask across everything you're
   allowed to see — and only that."* The RBAC-scoping point is what makes our AI claim credible when
   every competitor claims AI. → `/platform/ai`

**Honesty note:** the AI demo is a scripted fixture and is labelled as such. It must not imply live
inference on the marketing site.

---

## §10 — Analytics & reporting  ·  Beat 6  ·  `IntelligenceSection`

**One idea:** the numbers come from the system of record, so they're the same numbers everywhere.

**Layout.** 7/5 split, dashboard screenshot left (dark-mode variant — the one place dark UI reads as
premium), copy right.

**Copy:**
> **One report, one number, one meaning.**
> Reports and dashboards run on read models fed by the same events that drive the audit trail. Build a
> report, schedule it, deliver it — no export-and-merge step.

Bullets: report builder with filters and columns · scheduled delivery through the notification service
· dashboards with per-widget permissions · CSV export on every list · cursor pagination so large data
sets stay fast. All real (`reporting-service`, doc 25).

**Chart treatment.** Any chart rendered on the site follows the `dataviz` conventions and the
product's five categorical chart hues — so site charts and product charts are visibly the same family.

---

## §11 — Works everywhere  ·  Beat 5  ·  `DeviceShowcaseSection`

**One idea:** the same platform, on every screen your team actually uses.

**Layout.** Full-bleed, `--container-full`. A staged composition: 27" desktop centre, laptop left,
tablet three-quarter right, phone front-right — each in a real `DeviceFrame` with a real, correctly
cropped screenshot for that viewport (not one desktop image squeezed into a phone).

**Copy — deliberately honest** (`00` §7): *"Responsive web on every modern browser, plus an installable
PWA. macOS, Windows, Linux, iOS, Android — nothing to deploy."* We do **not** claim native apps.

**Motion.** Devices rise into place on a 100ms stagger with a very slight scale (0.98→1). Desktop-only
parallax of ±6px on scroll. Reduced-motion: static composition.

**Performance.** This is the heaviest section. All images lazy, AVIF-first, responsive `srcset` per
frame, total section budget ≤ 320KB. Below-fold, so no LCP impact.

---

## §12 — Integrations & API  ·  Beat 7  ·  `DevelopersSection`

**One idea:** open by default — you own your data and can extend anything.

**Layout.** 5/7. Left: copy + a logo grid of protocol/standard marks we genuinely speak (REST, OAuth
2.0/OIDC, SAML, SCIM, Webhooks, Prometheus, OpenTelemetry, S3-compatible storage, SMTP, Postgres).
**These are standards we implement, not partner logos — no fabrication.** Right: a syntax-highlighted
tabbed code block (cURL / TypeScript SDK / webhook payload) using real endpoints from `docs/openapi`.

**Copy:** *"A REST API for every module, a typed SDK, HMAC-signed webhooks, and API keys you rotate
yourself. The same gateway your own apps use."*

**Portability line — a real differentiator, stated plainly:** *"Azure-first, with a documented failover
to free-tier equivalents and a Docker Compose stack that boots the entire platform. No lock-in you
can't undo."*

---

## §13 — Security & trust  ·  Beat 8  ·  `SecuritySection`

**One idea:** you can get this through procurement.

**Layout.** Dark band (continuous with §8's tonal family). A 3×2 grid of control cards, each stating a
*mechanism*, not an adjective:

| Card | Statement |
|---|---|
| Authorization | Deny-by-default in all 30 services. Guards, not just UI gating. |
| Identity | Argon2id, TOTP MFA, refresh rotation, SSO (OIDC/SAML), SCIM provisioning. |
| Audit | Append-only log with change diffs and hash-chain tamper evidence. |
| Isolation | Database-per-service, tenant-stamped queries, in-cluster network policies. |
| Privacy | GDPR data-subject requests: export and erasure flows, retention policies, consent records. |
| Operations | Structured logs, Prometheus metrics, OpenTelemetry traces, staged deploys with rollback. |

**Compliance treatment — strict.** A single line, precisely worded:
> *SOC 2-ready architecture with GDPR data-subject request flows implemented. Certification reports are
> available under NDA when complete — [see our security controls →](/security).*

**No badge graphics until an auditor's report exists** (`CLAUDE.md` rule 2). A row of unearned
compliance shields is the fastest way to lose a CISO who checks.

---

## §14 — Built for how you work  ·  Beat 6  ·  `SolutionsSection`

**One idea:** pick your shape and see the relevant configuration.

Compact section: six cards, three by industry (Professional services · Agencies · Technology) and
three by role (Sales leader · Delivery leader · HR leader), each linking to its `/solutions/*` page.
Deliberately light on the homepage — this is a routing section, not a story section.

---

## §15 — Testimonials  ·  Beat 8  ·  `TestimonialsSection`  ·  **GATED**

Reads `website/content/testimonials.json`. Renders a three-up `QuoteCard` grid (photo, name, role,
company, verbatim quote, optional metric) **only** when ≥3 approved entries exist. Otherwise the
section does not render at all — no skeleton, no "coming soon", no invented quotes.

Until then, the adjacent credibility load is carried by §2's engineering proof, §5's architecture
diagram, and the public changelog. The component ships complete and tested so the first real
testimonial is a content change, not an engineering task.

---

## §16 — ROI  ·  Beat 8  ·  `ROITeaser`

**One idea:** the consolidation math, on your numbers.

A compact three-input teaser (team size · number of systems replaced · average per-seat spend) that
computes a conservative annual figure client-side and links to the full `/roi` calculator.

**Integrity rules:** all inputs are the visitor's own; every assumption is shown inline and editable;
the output states its formula; no "average customer sees 312% ROI" claim — we have no such data.
Under-promise deliberately: the calculator's default assumptions are the pessimistic end.

---

## §17 — Pricing preview  ·  Beat 9  ·  `PricingPreview`

Live plans from `billing-service` via the existing `getPlans()` loader (`apps/marketing/src/lib/api.ts`)
— already built, already tolerant. Three-up `PriceCard`s, monthly/annual toggle, the middle plan
marked "Most popular" **only if** the plan data says so. Below: *"All plans include SSO, audit logs,
and the full API. No feature held hostage to the enterprise tier."* (Verify against real plan data
before shipping this line.) Link: "Compare all plans →".

Graceful degradation: if the service is unreachable, render tier *names* and "Talk to us", never a
broken grid or a hardcoded price.

---

## §18 — FAQ  ·  Beat 8  ·  `FAQSection`

Six questions, the exact six that block deals — drawn from `01` §10's objection map: migration, team
adoption, security sign-off, data ownership/export, customization limits, implementation time. Native
`<details>`/`<summary>`, progressively enhanced with height animation. `FAQPage` JSON-LD emitted.
"All questions →" `/faq`.

---

## §19 — Final CTA  ·  Beat 9  ·  `FinalCTA`

Full-bleed, aurora wash, generous vertical space (`clamp(7rem, 12vw, 14rem)`).

> **Stop reconciling. Start running.**
> Spin up a workspace in minutes. Bring your data when you're ready.

`Start free` (primary) · `Talk to us` (secondary) · a quiet third line: *"Or read the architecture
first — we'd respect that too."* → `/platform/architecture`. That line is aimed squarely at the CTO
and is the most on-brand sentence on the page.

---

## §20 — Footer  ·  `SiteFooter`

Per `03` §3.2. Six navigation columns, theme + locale switchers, status, security, legal, social,
`Organization` + `SoftwareApplication` JSON-LD.

---

## Build order & acceptance

Sections are built in narrative order (§1 → §20) so the page is always a coherent, shippable story at
every commit. §6 (interactive overview) is the long pole and starts in parallel behind a flag.

**Acceptance criteria for this document:**
- [ ] All 20 sections implemented, server-rendered, complete with JS disabled (except §6's interactive layer, which has a static fallback)
- [ ] One primary CTA per viewport, verified by scroll-through at 390 / 768 / 1440
- [ ] Gated sections (§2, §15) verified in both states, no layout shift between them
- [ ] Every claim traced to `00-audit-and-inventory.md`; zero fabricated proof
- [ ] Full keyboard traverse of the page, including §6's demo and §8's matrix
- [ ] `prefers-reduced-motion` pass: no transform animation anywhere
- [ ] LCP < 1.6s (4G, mid-tier mobile), CLS < 0.02, INP < 150ms
- [ ] Copy reviewed against `01` §6 banned-word list

---

## Completion Status

**🟡 Built and verified, but this document is out of date against the code. Updated 2026-08-10.**

| | |
|---|---|
| **Implemented** | ✅ Yes — the homepage is live and building green |
| **Sections spec'd here** | 20 |
| **Sections that exist** | 12 declared, **11 render** (`Testimonials` returns `null` by design) — restructured 2026-08-10, see below |
| **Responsive pass, 320→2560** | ✅ 13 viewports, Playwright |
| **A11y pass** | ✅ axe, zero serious/critical; ⬜ manual screen-reader pass still outstanding (site-wide gap, disclosed on `/legal/accessibility`) |
| **Motion / reduced-motion** | ✅ honoured globally |
| **Copy review** | ✅ `check:content` clean, banned-word list included |
| **Lighthouse / bundle** | ⬜ Not started — M5 |

### Where this document and the code disagree

Recorded rather than silently corrected, because rewriting this spec is a task in its own right and
is listed as step 6 of the section-reduction proposal.

1. **It targets `apps/marketing/src/app/page.tsx`.** That is not where the site lives. The homepage
   is `src/app/page.tsx` at the repository root.
2. **The §1 hero spec is superseded.** It specifies the headline *"Revenue, delivery, and people. One
   permission model."* — the wedge that was **replaced on 2026-07-31** by "deal → delivery → cash"
   (`MASTER_PROGRESS`, decisions). It also specifies a screenshot-based composition; the hero visual
   is a looping video with a poster, and the DOM diagram it replaced is kept as the fallback in
   `components/diagrams/integration-web.tsx`.
3. **The §2 trust bar does not exist.** Removed 2026-08-09 at the client's request, component
   deleted. The homepage now carries no proof element between hero and chain.
4. **§3 Chain is not in this document at all.** It was added on 2026-07-31 as the new centrepiece
   when the wedge changed, and it is now the most important section on the page.
5. **Section numbering in this document no longer matches render order.** The component comments
   drifted too; several are off by one or two and two of them both claim "§3".

### Changed by the spacing / content audit's Phase 2, 2026-08-10

Full record and the four documented deviations: `spacing-content-audit.md`. Summary of what a reader
of this spec would otherwise find surprising:

- **All homepage copy is now in `content/homepage.ts`.** Seven sections held theirs inline in JSX,
  against the stated architecture; that was the root cause of four homepage headlines being
  word-for-word identical to their own destination page.
- **Three homepage headlines were rewritten** (Security, FAQ, Solutions) so they tease their
  destination instead of repeating it. The destination pages are canonical and were not touched.
- **§13 Security shows three control-area teasers, not six cards.** All six statements stay on
  `/security`.
- **§8 Permissions carries two bullets, not four**; the two cut were near-verbatim restatements of
  `/security/permissions` block titles, one of them identical but for a hyphen.
- **§5 Thesis carries three before/after rows, not six.** Four duplicated §4 Problem.
- **Vertical rhythm is now tokens everywhere.** Hero, PageHero, FinalCta, CtaBand and 404 no longer
  use raw `py-*`; Chain and Security joined Permissions at `size="lg"`.

### Restructured to 12 sections, 2026-08-10

Client brief: fewer sections, tighter headers, less text — **and every video stays.** The rendered
list is now, in order:

| # | Section | Tone / size | Video |
|---|---|---|---|
| 1 | Hero | aurora, `section-y-lg` | `hero-loop` (gated ≥1024px, poster below) |
| 2 | Chain | tint, **lg** | — |
| 3 | Problem | default | `system-arch` |
| 4 | Platform | subtle | — |
| 5 | Permissions | band, **lg** | — |
| 6 | Capabilities | default | — |
| 7 | Intelligence | tint | `graph` |
| 8 | Developers | subtle | `terminal` |
| 9 | Security | band, **lg** | — |
| — | ~~Testimonials~~ | subtle | gated, renders `null` |
| 10 | Faq | default | — |
| 11 | FinalCta | aurora, `section-y-lg` | — |

Tone alternates on every boundary; the three structural pivots carry `size="lg"`. Check both before
adding a section.

**Gone as standalone sections:** Thesis (→ Problem), Clusters and Architecture (→ Platform), Devices
(→ Capabilities' fourth card), Solutions (deleted — six links, no copy; its destinations now resolve
through a repaired Solutions nav group), Roi (→ **`/pricing`**, see below).

**The consolidation calculator moved to `/pricing`** on the same day. It sits between "What you can
switch on" and the pricing FAQ, as a sibling `Reveal` block rather than its own `Section` — that page
keeps everything inside one `Section` with a `gap-12` Container, so transplanting the homepage's
`tone="tint"` wrapper would have nested a Section in a Section. The `RoiTeaser` island, its state and
its arithmetic are byte-for-byte unchanged and still shared with `/roi`, which remains the full
calculator it links out to. Its heading copy moved from `homepage.ts` `roiIntro` to `pricing.ts`
`CALCULATOR`. Nothing anchored to it on the homepage — it had no `id` — so no link needed updating;
the new block carries `id="calculator"` so it can be linked to in future.

**The video constraint drove the shape.** Four sections host a video, so four sections were
un-mergeable. That is why Thesis folded into Problem rather than Problem into Chain, and why
Intelligence and Developers are still full sections instead of cards. Full reasoning and the options
that are no longer reachable: `homepage-section-reduction-proposal.md`.
