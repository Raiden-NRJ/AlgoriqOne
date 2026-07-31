# Website Workstream — Master Progress

**Check this file first, every session.** It is authoritative for status; the numbered docs are
authoritative for content.

**Opened:** 2026-07-31 · **Current state:** plan complete (docs 00–17) · **M0–M4 built: the full
~45-route site is live, building green, with zero broken internal links** · **Next action:** confirm
positioning (`01` §2), then M5 (analytics, Lighthouse CI, real screenshots).

**Scope change (2026-07-31, user):** the site is built **from scratch in `website/`**, not by
rebuilding `apps/marketing`. `website/` is now plan *and* code — a self-contained Next.js 16 app on
port 3500, outside the root npm workspace. `apps/marketing` is untouched.

**Theme decision (2026-07-31, user): light mode only.** No dark theme, no toggle. The dark bands on
§8 and §13 are a tonal device using `--color-band-*`, not a theme.

## What is built

**47 routes, all building green.** `npm run build` succeeds with zero services running.

| Area | State |
|---|---|
| App scaffold (Next 16, Tailwind v4, TS strict, own lockfile, port 3500) | ✅ |
| Token system — light only, oklch, brand hue 277 | ✅ `src/app/globals.css` |
| Content modules (typed, copy out of JSX) | ✅ 12 modules incl. per-page SEO map |
| Chrome — header w/ mega-menu + mobile sheet, footer, logo, skip link | ✅ |
| Homepage — 20 sections in narrative order | ✅ server-rendered |
| Product cluster pages ×5 | ✅ shared template, real modules/permissions/services |
| Platform pages ×6 | ✅ incl. an honest scope note on workflow triggers |
| Security hub + 3 deep pages | ✅ posture table with Implemented/In progress/Planned |
| Developer pages ×4 | ✅ |
| Solutions: index + 3 industries + 5 roles | ✅ |
| Pricing, ROI, FAQ, demo | ✅ live plan data with a degradation path built first |
| Company ×3, legal ×3, resources ×3 | ✅ |
| Interactive islands ×4 | ✅ cluster switcher, permission matrix, ROI calculator, contact form |
| Diagrams | ✅ three-systems + architecture, with text equivalents |
| SEO infra | ✅ sitemap from route manifests, robots (noindex unless `SITE_INDEXABLE`), canonicals, JSON-LD, security headers, legacy redirects |
| Verification scripts | ✅ `check:links` (crawler) + `check:content` (fabrication/vocab/headings/metadata/alt) |

### Verified this session

| Check | Result |
|---|---|
| `tsc --noEmit` strict | Clean |
| `npm run build` | Clean, 48 routes |
| Build with all service URLs unreachable | **Green** — the tolerance requirement holds |
| Internal link crawl | **44 URLs, zero broken**; `/signup` and `/login` 307 to the portal as designed |
| Content guard over 42 routes | **Zero failures, zero warnings** |
| Contrast, by arithmetic | **26/26 token pairs meet target** |
| **Browser audit: 43 routes × 13 viewports = 559 page loads** | **No findings.** Zero horizontal overflow, zero serious/critical axe violations, zero undersized tap targets, zero sub-12px content text, zero console errors — at every width from 320px to 2560px, including landscape phone |
| Degradation paths, live | Pricing → quote path (no invented prices); blog + changelog → honest empty states; contact → fallback email, not a fake success |
| Screenshots | 52 captured across 4 routes × 13 viewports (`audit-shots/`, gitignored) |

### Not yet done

Lighthouse CI, bundle budgets, a **manual screen-reader pass** (automated tooling catches roughly a
third of real issues — this is the largest remaining accessibility gap and is disclosed on
`/legal/accessibility`), forced-colors mode, `eslint-plugin-jsx-a11y`, real product screenshots
(needs the platform booted — doc 10 §4), the full five-tab product tour from `04` §6, comparison
pages (`/compare/*`, needs legal review), and `/customers`.

---

## Documents

| # | Document | Purpose | Status |
|---|---|---|---|
| — | [CLAUDE.md](../CLAUDE.md) | Operating guide, working rules, input list | ✅ Written |
| 00 | [Audit & Inventory](00-audit-and-inventory.md) | What RocketCRM actually is, verified against code | ✅ Written · Figma sub-task blocked |
| 01 | [Brand & Positioning](01-brand-and-positioning.md) | Wedge, ICP, voice, narrative spine, objection map | ✅ Written · needs GTM sign-off |
| 02 | [Design System](02-design-system.md) | Tokens, type, color, space, elevation, motion, components | ✅ Written |
| 03 | [Information Architecture](03-information-architecture.md) | Sitemap, nav, 37→20 section resolution, URL contract | ✅ Written |
| 04 | [Homepage Blueprint](04-homepage-blueprint.md) | All 20 sections, spec'd to build level | ✅ Written |
| 05 | [Module Showcase Pages](05-module-showcase-pages.md) | 5 cluster + 6 platform pages | ✅ Written |
| 06 | [Solutions & Industries](06-solutions-and-industries.md) | Industry, role, comparison, customers | ✅ Written |
| 07 | [Security, Trust & Compliance](07-security-trust-compliance.md) | Trust centre + the honesty contract | ✅ Written · needs security + legal sign-off |
| 08 | [Pricing, ROI & Conversion](08-pricing-roi-and-conversion.md) | Money pages + conversion discipline | ✅ Written |
| 09 | [Motion & Interaction](09-motion-and-interaction.md) | Choreography system, reduced motion | ✅ Written |
| 10 | [Visual Assets & Devices](10-visual-assets-and-devices.md) | Screenshot pipeline, device showcase, diagrams | ✅ Written |
| 11 | [Frontend Architecture](11-frontend-architecture.md) | Stack, structure, rendering, budgets, CI | ✅ Written |
| 12 | [Performance & SEO](12-performance-and-seo.md) | Budgets, CWV, structured data | ✅ Written |
| 13 | [Accessibility](13-accessibility.md) | WCAG 2.2 AA, testing matrix, responsive matrix | ✅ Written |
| 14 | [Figma Deliverables](14-figma-deliverables.md) | Design-file output, sync direction | ✅ Written · **blocked on file URL** |
| 15 | [Content & Copy System](15-content-and-copy-system.md) | Copy standard, content model, review | ✅ Written |
| 16 | [Analytics & Experimentation](16-analytics-and-experimentation.md) | Events, funnel, A/B, privacy | ✅ Written |
| 17 | [Implementation Roadmap](17-implementation-roadmap.md) | Milestones, effort, risks, DoD | ✅ Written |

---

## Milestones

| Milestone | Docs | Status | Exit criterion |
|---|---|---|---|
| M0 Foundations | 02, 11 | 🟢 Built | Tokens, primitives, chrome, content modules, green build. Storybook outstanding. |
| M1 Homepage | 04, 09, 10, 15 | 🟢 Built | All 20 sections live. Outstanding: screenshots, `04` §6 full product tour. |
| M2 Trust & conversion | 07, 08 | 🟢 Built | Security hub + 3 deep pages, pricing, ROI, demo, contact. A CISO and a CFO can both self-serve. |
| M3 Product depth | 05, 10 | 🟢 Built | 5 cluster + 6 platform pages on one template. Screenshots outstanding. |
| M4 Market surfaces | 06, 15 | 🟢 Built | Solutions, developers, resources, company, legal. `/compare/*` and `/customers` deferred — both need input we do not have. |
| M5 Measure & tune | 12, 16 | ⬜ Not started | Funnel instrumented, leaks visible |
| M6 Design artifacts | 14 | ⬜ Not started | Figma Foundations + Components generated |

---

## Blockers & open inputs

| # | Item | Blocks | Owner | Status |
|---|---|---|---|---|
| B1 | ~~No Figma file URL~~ | Doc 14 | — | ✅ **Closed 2026-07-31.** File supplied and analysed: a product-story deck, not page designs. Brand mark, accent bar, four-app framing and the canonical demo dataset adopted; "24 services" reconciled to 30 in favour of code. |
| B2 | **No customer logos or written permission.** | Homepage §2 logo state, `/customers` | Business | 🟡 Open — engineering-proof fallback ships regardless |
| B3 | **No testimonials or case studies.** | Homepage §15, `/customers` | Business | 🟡 Open — sections gated, never faked |
| B4 | **No SOC 2 / ISO certification.** Architecture is ready; no audit performed. | Compliance badges | Business | 🟡 Open — "ready architecture" language only; badge rule is absolute |
| B5 | **No legally approved uptime SLA.** | Any % availability claim | Legal | 🟡 Open — architectural claims only |
| B6 | ~~Positioning wedge not confirmed~~ | Everything downstream of doc 01 | — | ✅ **Closed 2026-07-31.** "Deal → delivery → cash" chosen. Doc 01, the homepage copy, the section order and the site metadata were rewritten to match; a new `Chain` centrepiece section was built. The three unchosen options and the previous wedge are retained as A/B variants in `01` §9. |
| B7 | **Font licence undecided** (Inter-only vs licensed display face). | M0 | Design/Business | 🟠 Open — Inter-only fallback is specified and acceptable |
| B8 | **Pricing model decision** (public tiers vs contact-sales). | `/pricing` copy | Business | 🟡 Open — live plan data works either way |
| B9 | **Security + legal sign-off process** for `/security` and `/compare` not yet established. | M2, M4 | Security/Legal | 🟠 Open |

Legend: 🔴 hard blocker · 🟠 needs a decision soon · 🟡 has a working fallback

---

## Decisions on record

| Date | Decision | Rationale |
|---|---|---|
| 2026-07-31 | ~~Positioning wedge = "one permission model, three departments"~~ — **superseded same day** | See row below |
| 2026-07-31 | **Positioning wedge = "deal → delivery → cash"** (chosen by the user from four costed options) | The operational chain is concrete, demonstrable in one screen-share, and closest to the money — it speaks to the COO/CFO who signs. The permission model is demoted from headline to *proof layer*: it is the deepest moat but a governance argument, and governance wins the CISO rather than the budget holder. Accepted cost: this puts us in the PSA category against Kantata/Certinia rather than against Salesforce, and the HR modules become supporting cast (`01` §3). |
| 2026-07-31 | Homepage = **20 sections**; the other 21 requested topics become destination pages | 37 sections contradicts the keynote requirement; nothing is dropped (`03` §1) |
| 2026-07-31 | Site keeps a **standalone theme**, does not import `@rocketcrm/ui` | Different job, bundle weight, release independence (`02` §1) |
| 2026-07-31 | **Built from scratch in `website/`**, `apps/marketing` untouched | User instruction; also gives a self-contained install with no monorepo coupling |
| 2026-07-31 | **Light mode only.** Dark bands are a tonal device, not a theme | User instruction; one theme designed properly beats two designed adequately |
| 2026-07-31 | **Code is the source of truth; Figma is a generated output** | Confirmed on inspection — the supplied file already understated the service count (`14` §1) |
| 2026-07-31 | **Canonical demo data comes from Figma**, replacing the invented "Northwind" fixture | One dataset shared by site, deck and screenshots (`10` §2, `14` §1) |
| 2026-07-31 | Hero visual is **DOM/CSS, not a screenshot** | Crisp at any DPI, ~0 bytes, and cannot go stale when the product ships a release. Real screenshots land in §6 and the module pages. |
| 2026-07-31 | **Content in typed repo modules, no CMS** | Type safety, code review on copy, zero runtime cost (`11` §5) |
| 2026-07-31 | Trust content is **gated on real data, never fabricated** | Working rule #1; a fake SOC 2 badge is a legal problem, not a design choice |
| 2026-07-31 | Lighthouse Performance gated at **≥97 mobile / ≥99 desktop** (median of 3), not a hard 100 | Lab-score variance makes a hard 100 gate flaky; field CWV is the real metric (`12` §1) |
| 2026-07-31 | Interactive demo (§6) uses **fixture data, labelled "Sample data"**, no backend calls | Honesty + performance + no coupling to service availability |
| 2026-07-31 | **No native mobile app claim** — responsive web + PWA only | It's what exists (`00` §7) |

---

## Change log

| Date | Change |
|---|---|
| 2026-07-31 | Workstream opened. Codebase audited (30 services, 254 models, 4 apps, 65 UI components verified by enumeration). `website/` created with CLAUDE.md + docs 00–17. Implementation not started. |
| 2026-07-31 | Figma file supplied and analysed. Scope changed to build-from-scratch in `website/`; theme fixed to light-only. M0 + M1 built: self-contained Next 16 app, light-only oklch token system, typed content modules, header/footer chrome, 20-section homepage with three interactive islands and two diagrams. Typecheck and build green; rendered HTML verified for content and for the no-fabricated-proof rule. |
| 2026-07-31 | **First real browser audit, and the fixes it forced.** Added `scripts/audit.mjs` (Playwright + axe over every route × 13 viewports, checking overflow, a11y, tap targets, sub-12px text and console errors) and `scripts/check-contrast.mjs` (oklch → sRGB → real WCAG ratios for the 26 pairs the site renders). First run: **207 findings** while the content and link checkers were green. Fixed: contrast — recomputed `--neutral-500`/`--neutral-600` and split `--color-success` into light and band variants because no single lightness clears 4.5:1 on both white and near-black; horizontal overflow at 390px from a negative-margin tablist bleed; `role="img"` wrapping six real links (nested-interactive); three keyboard-unreachable scroll regions; a 6px-tall range slider; and 10–11px text on 18 routes. Second run: **82 findings** → all 55 `max-w-[Nch]` became `max-w-[min(Nch,100%)]` (ch units ignore the container and overflowed at 320–480px), standalone inline links raised to a 24px target, and the audit itself was corrected to scroll before measuring — reveals sit at `opacity: 0` until observed, which axe correctly read as zero contrast. |
| 2026-07-31 | **Chain alignment pass across the deep pages.** Added a `ChainStrip` to the shared page template — a five-stage Deal→Project→Plan→Time→Invoice indicator with the page's own links highlighted, a one-line note on its role, and a link back to `/#chain`. It exists because most visitors land on a deep page from search rather than the homepage, so the positioning has to be re-established there rather than assumed. Rewrote the hero headline and intro on all 5 product pages to name their position in the chain, and wired chain context into `/platform/workflows`, `/platform/customization`, `/security/permissions`, `/solutions/professional-services`, `/solutions/agencies`, `/solutions/by-role/{sales,delivery,finance}`. SEO descriptions updated to match. Verified: 42 routes clean, 44 links clean, strip renders on all 10 target pages. |
| 2026-07-31 | **Repositioned to "deal → delivery → cash"** after the user chose it from four costed options. Rewrote doc 01 (positioning statement, wedge table with the cost of the choice stated, nine-beat spine, headline and section claims), rewrote `content/homepage.ts`, added a new `Chain` centrepiece section (five linked stages, each labelled with what survives the handoff), resequenced the homepage, and updated the site tagline and metadata. Permissions kept its full section but is now framed as "why the chain holds" rather than as the headline. Rebuilt and re-verified: 42 routes clean, 44 links clean. |
| 2026-07-31 | M2–M4 built in the same session: shared page template, 5 product cluster pages, 6 platform pages, security hub + 3 deep pages, 4 developer pages, solutions index + 3 industries + 5 roles, pricing (live plan data, degradation path first), ROI, FAQ, demo, contact with a real API route, 3 company pages, 3 legal pages, 3 resources pages, 404, sitemap, robots, security headers and legacy redirects. Two verification scripts added and run: `check:links` (45 URLs, zero broken) and `check:content` (42 routes, zero failures, zero warnings). Build verified green with every service URL pointing at a closed port. |
