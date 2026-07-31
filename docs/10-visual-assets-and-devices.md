# 10 — Visual Assets, Screenshots & Device Showcase

**Depends on:** `00` §6 (existing assets), `02` §6 (illustration system).
**Purpose:** the asset pipeline. The current site ships **zero product imagery** while 35 real
screenshots sit unused in `screens/`. Fixing that is the highest-value visual work on the project.

---

## 1. Principle: show the real product

No mockups of a product that doesn't exist, no idealised "designer's version" of a screen, no fake
data that flatters. We show the actual interface with realistic-but-fictional sample data.

**Why this is a strategic choice, not a constraint:** the product is genuinely well-designed (31
primitives + 34 patterns, axe-gated, oklch tokens, light *and* dark). Most SaaS companies retouch
screenshots because their product can't survive being shown. Ours can, and showing it unretouched is
itself a trust signal — the visitor who signs up sees exactly what the site promised.

---

## 2. Sample-data standard

Every screenshot uses one consistent fictional world, so a visitor moving between pages sees a
coherent company rather than three different fake datasets.

> **Superseded 2026-07-31.** The "Northwind Consulting" fixture below was invented before the Figma
> file was available. The Figma deck ships a canonical demo dataset ("Demo Tenant Context", node
> `4:26`), which is now the standard and is implemented in `src/content/demo-tenant.ts`:
> **tenant** Algoryq One Demo · **companies** Nimbus Retail Group, Vertex Manufacturing, Orbit Health ·
> **projects** Atlas CRM Rollout, Beacon Employee Experience · **people** Demo Admin, Ava Kapoor,
> Noah Chen, Mia Rivera, Lena Sorenson, Priya Oberoi, Jordan Wells.
> Read the rules below with those names substituted.

- **The company:** ~~"Northwind Consulting"~~ → the Algoryq One Demo tenant, per the note above.
- **People:** the seven named people from the Figma deck, with consistent roles across every screen.
  The same person approving a timesheet appears in the org chart.
- **Clients:** the three Figma companies, extended only if a screen genuinely needs more.
- **Money:** realistic deal sizes ($12k–$180k), realistic invoice amounts, integer cents, one currency
  per screenshot.
- **Dates:** relative and recent; no screenshot shows a date more than 90 days from capture. Stale
  dates in screenshots are a common, avoidable credibility leak.
- **Rules:** no lorem ipsum, ever. No real customer names. No real people's photos — avatars are
  generated and consistent. Nothing that could be mistaken for a real company's data.

Implemented as a seed fixture so screenshots are **reproducible**: `scripts/seed-marketing-demo.mjs`
populates a throwaway tenant, and captures are automated (§4). Re-shooting after a UI change becomes a
command, not a project. This is the difference between screenshots that stay current and screenshots
that quietly rot.

---

## 3. Screenshot inventory

### 3.1 Existing (`screens/`, 35 files) — usable now
Login · client projects · internal projects (+ request, + request form) · project details · resource
engagement · Kanban task management · Kanban add-epic · my sales (active / won / lost / details /
details-tasks / my-tasks) · timesheets (my, calendar, not-submitted, pending, pending-expanded,
approved, approved-expanded, request, request-status) · employee details · employee feedback · total
employees (+ variant, + filter) · reportees (+ projects, + timesheet, + skill matrix) · sticky notes.

**Caveat:** these predate the current UI state and are desktop-only, light-mode-only. Treat them as
proof that the assets exist, then **re-capture all of them** through the automated pipeline so the
site never shows a stale interface.

### 3.2 Required new captures

| Set | Screens | Priority |
|---|---|---|
| **Homepage hero** | Dashboard, light + dark | P0 |
| Approvals | `/actions` unified inbox, all four module tabs | P0 |
| Permissions | Admin RBAC UI, role editor, permission matrix | P0 |
| Reporting | Report builder, dashboard with widgets, chart detail | P0 |
| Platform | Workflow designer canvas, custom-field editor, feature flags | P1 |
| People Ops | Leave request + balance, attendance, performance goals, recruitment pipeline, org chart | P1 |
| Service | Ticket detail with reply thread, knowledge base, **customer portal** | P1 |
| Admin | Platform dashboard, tenant management, audit log feed, system health | P1 |
| Intelligence | Global search results, Cmd-K palette, AI assistant conversation | P1 |
| **Mobile** | Approvals, timesheet week editor (<400px stacked), pipeline, dashboard | P0 — the device section is worthless without real mobile crops |
| Tablet | Dashboard, project detail, Kanban | P2 |

**Every P0/P1 screen is captured in both light and dark mode.** The `ScreenshotFrame` component swaps
automatically with the site theme — a small detail that reads as very high craft.

---

## 4. Capture pipeline (automated)

`scripts/capture-marketing-screens.mjs`, built on the existing Playwright `e2e` project (which already
has auth helpers and a viewport matrix — reuse it rather than building a second harness).

Spec:
- Boot the stack (Compose), seed the Northwind fixture, log in as the appropriate role per screen.
- Deterministic viewports: 1440×900 (desktop), 1024×768 (tablet), 390×844 (mobile).
- `deviceScaleFactor: 2` for retina output.
- Freeze time and disable animations before capture (`prefers-reduced-motion` + a capture class) so
  output is byte-stable.
- Mask any element flagged `data-capture-mask` (avatars from real accounts, ids, tokens).
- Emit to `apps/marketing/public/screens/<set>/<name>-<theme>-<viewport>.png`, then run the
  optimisation step (§5).
- A manifest (`screens.manifest.json`) records dimensions, theme, viewport and capture date so
  components get correct `width`/`height` (zero CLS) and we can detect stale assets in CI.

**CI check:** warn when any screenshot is older than 90 days.

---

## 5. Image optimisation

- **Formats:** AVIF primary, WebP fallback, PNG last resort. `<picture>` with explicit `type` sources.
- **Responsive:** `srcset` at 1×/2× for each of three widths per frame; `sizes` matched to the layout.
- **Loading:** `priority` + `fetchpriority="high"` on the hero image only. Everything else `loading="lazy"`
  `decoding="async"`.
- **Placeholders:** a tiny blurred base64 (≤ 200 bytes) generated at build time. Never a grey box.
- **Dimensions always explicit** — from the manifest. CLS budget is 0.02 for the whole page.
- **Budgets:** hero image ≤ 180KB (AVIF), any single screenshot ≤ 120KB, device-showcase section total
  ≤ 320KB, homepage total image weight ≤ 900KB.

---

## 6. Device showcase

`DeviceFrame` renders accurate, minimal device chrome as **CSS/SVG, not images** — so frames are
resolution-independent, theme-aware, and cost ~2KB instead of ~200KB.

| Frame | Chrome | Screenshot source |
|---|---|---|
| `browser` | Minimal window bar, three dots, a URL pill reading the real app URL | 1440 desktop capture |
| `laptop` | Thin bezel, subtle base | 1440 capture, scaled |
| `tablet` | Uniform bezel, portrait or landscape | 1024 capture |
| `phone` | Rounded corners, notch/island, no carrier UI | 390 capture |

**Composition rule (`04` §11):** each frame shows the screen *that device is actually used for* —
phone shows approvals (the real mobile job), tablet shows a dashboard, desktop shows the full working
interface. Showing the same desktop screenshot in a phone frame is the classic tell and is banned.

**Honesty:** the section says "responsive web + installable PWA" (`00` §7). Device frames must not
imply App Store / Play Store distribution — no store badges.

---

## 7. Illustration & diagram assets

Per `02` §6, illustration = precise system diagrams + animated product abstractions, both authored as
SVG/DOM, not raster.

| Asset | Used in |
|---|---|
| `architecture-full` | `04` §5, `/platform/architecture` |
| `trust-boundary` | `07` `/security` |
| `problem-three-systems` | `04` §3 |
| `workflow-chain-<cluster>` | `05` cluster pages |
| `permission-resolution` | `/security/permissions` |
| `data-flow-residency` | `/security/compliance` |

Each ships as an inline React SVG component with: a `<title>`/`<desc>` pair, `role="img"`, a
visually-hidden text equivalent, theme-aware `currentColor` strokes, and a static (undrawn-animation)
variant for reduced motion and print.

---

## 8. OG & social images

Generated at build time with `next/og` (satori) — one template, brand-consistent, per-page dynamic
title. 1200×630. Never a single generic OG image for the whole site: a shared link to `/security`
should show "Security" in the card. Cheap to build, disproportionate effect on link CTR.

## Completion Status

- [ ] Northwind sample-data seed script
- [ ] Automated capture pipeline + manifest
- [ ] All P0 screens captured, light + dark, three viewports
- [ ] Image optimisation + budgets enforced in CI
- [ ] `DeviceFrame` set built as CSS/SVG
- [ ] Six diagram components with accessible text equivalents
- [ ] Dynamic OG image generation
- [ ] Staleness check (>90 days) wired to CI
