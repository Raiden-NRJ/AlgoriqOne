# 11 — Frontend Architecture

**Depends on:** `02` (design system), `03` (routes).
**Purpose:** how the site is built inside `apps/marketing`, so 45 pages stay as maintainable as 7.

---

## 1. Stack (unchanged where it works)

Next.js 16 App Router · React 19 · Tailwind CSS v4 (CSS-first `@theme`) · TypeScript strict ·
`lucide-react` · Nx targets (`build`/`serve`/`typecheck`/`lint`). All already in place — this is an
extension, not a rewrite. The `NODE_ENV=production` pin on the build target stays (nx dotenv loading
poisons `next build` without it).

**Additions, each justified:**

| Addition | Why | Cost |
|---|---|---|
| `next/font/local` | Self-hosted brand fonts, zero third-party requests, metrics-matched fallback | 0 runtime |
| `next-intl` | i18n runtime already used by the other three apps — consistency, and the product ships translations | ~14KB, lazy |
| `@vercel/og` (satori) | Build/edge-time OG images | build-time only |
| `zod` | Content-file schema validation at build time | build-time only |
| A spring/motion micro-lib | **Only** inside the interactive-demo island, dynamically imported | counted against that island |

| `gsap` + `@gsap/react` | Scroll-scrubbed, pinned sequences. **Islands only** — see the carve-out below | counted against those islands |

**Rejected:** a global animation library (CSS still covers ~90% of the motion spec), a CMS (see §5),
a component library (we have our own), any analytics or chat script that blocks rendering.

**GSAP/ScrollTrigger — carve-out, owner instruction 2026-09-03.** This table previously read
"Rejected: … GSAP/ScrollTrigger (scrolljacking is banned anyway)". The parenthetical was the whole
argument, and docs/09 §1 rule 7 no longer bans pinning outright — it bounds it. GSAP is now a
dependency, under these limits:

- **Four consumers, all islands:** `use-card-spread.ts` (shared by §3 The chain and §6 Built to
  fit), `chain-stepper.tsx` (core tween engine only, no plugin, no scroll coupling) and
  `architecture-draw.tsx` (§4's architecture diagram). Nothing else imports it.
- **CSS stays the default.** A new animation reaches for GSAP only when CSS demonstrably cannot do
  it — scroll-position-driven progress and pinning are the two cases so far. `framer-motion`'s
  `useScroll` was considered first for both and cannot pin.
- **Every consumer keeps the site's resting-state contract:** the server output is the finished
  state, and the island only ever winds it back once it has confirmed it can run. No-JS, failed
  hydration and reduced motion all render complete.
- **Not on the critical path.** It ships in the client chunks those islands already create, and the
  §4 budget in `12-` is the gate.

---

## 2. Directory structure

```
apps/marketing/src/
  app/
    (marketing)/                    route group — shares header/footer layout
      page.tsx                      homepage
      product/[cluster]/page.tsx    5 cluster pages, one template
      platform/…                    6 pages
      security/…                    4 pages
      developers/…                  4 pages
      solutions/…                   industries + by-role/[role]
      pricing, roi, demo, faq, compare/[competitor], customers
      resources/{blog,guides,changelog}
      company/{about,careers,contact}, legal/[doc]
    api/
      leads/route.ts                exists — CRM lead capture
      consent/route.ts              exists
      og/route.tsx                  dynamic OG images
    globals.css                     tokens (02)
    layout.tsx, sitemap.ts, robots.ts, manifest.ts
  components/
    site/                           layout + typography + actions primitives (exists, extended)
    sections/                       one file per homepage/page section (04, 05)
    product/                        DeviceFrame, ScreenshotFrame, ProductWindow, demos
    diagrams/                       SVG diagram components (10 §7)
    interactive/                    client islands only — every file starts 'use client'
  content/                          typed, schema-validated content modules
  lib/
    api.ts                          exists — server-only, tolerant loaders
    config.ts, content.ts, format.ts, types.ts   exist
    seo.ts, schema.ts, analytics.ts, experiments.ts
```

**The `interactive/` boundary is a hard rule:** `'use client'` appears only in that directory. If a
component elsewhere needs client state, it is refactored so the interactive part moves into an island.
This is the single most effective structural guard against bundle creep.

---

## 3. Rendering strategy

| Content | Strategy | Rationale |
|---|---|---|
| All static marketing pages | Static (SSG) | Fastest possible TTFB, CDN-cacheable |
| `/pricing` | ISR, `revalidate: 300` | Live plans, but not per-request |
| `/blog`, `/blog/[slug]` | ISR, `revalidate: 60` | Already the existing behaviour |
| `/changelog` | ISR, `revalidate: 300` | From `releases-service` |
| `/roi`, `/demo` | Static shell + client island | Computation is client-side |
| OG images | Edge runtime, cached | Per-page titles without build-time explosion |
| Forms | Route handlers (server) | Secrets never reach the client |

**Tolerance is mandatory.** Every backend loader keeps the existing pattern: `server-only`, a 4s
timeout, try/catch to a null/empty fallback, envelope unwrapping. **The site must build green with
zero services running** — that is already true today and must never regress. Add a CI job that builds
with all service URLs pointing at a closed port.

---

## 4. Component conventions

- Server component by default. `'use client'` requires a one-line comment justifying it.
- Props are explicit TypeScript interfaces. No `any`, no untyped spread.
- Styling is Tailwind utilities over design tokens. **A hex literal or raw px value in a component is
  a lint error** — add an ESLint rule for it; this is the mechanism that actually keeps a design
  system alive.
- Every section component takes its content as props from a `content/` module, so copy changes never
  require touching layout code (and so translation and A/B testing are possible later).
- Every interactive component ships a keyboard path and a Storybook story.
- No component reads `window` at module scope. No layout-affecting logic inside `useEffect` (CLS).

---

## 5. Content architecture — no CMS

**Decision: content lives in typed TypeScript/MDX modules in the repo, not a headless CMS.**

Rationale: the team editing this content is the team that ships the code; a CMS adds a network hop, a
cache layer, a schema-drift surface, and a monthly bill to solve a coordination problem we don't have.
Content-in-repo gives us code review on copy, atomic deploys, type safety, and zero runtime cost.

Structure:
```
content/
  homepage.ts        section copy, typed
  clusters.ts        the six clusters (single source for nav, homepage §7, product pages)
  faq.ts             questions, with a `homepage: boolean` flag
  customers.json     GATED — logos, requires permissionGranted: true
  testimonials.json  GATED
  case-studies.json  GATED
  certifications.json GATED — controls badge rendering
  controls.json      security control table (always renders)
  comparisons/*.ts   one per competitor, each with a `verifiedAt` date
```

All validated with zod at build time. A malformed entry **fails the build**. The gated files are
empty arrays today, and the build must be green with them empty — that is the honesty mechanism from
`07` enforced in code rather than by discipline.

Blog stays live from `knowledge-base-service` (already built, already working).

**Revisit if:** non-technical marketers need to publish weekly without a deploy. Then add a CMS for
`/resources` only, never for product/security pages.

---

## 6. Bundle discipline

- **Budgets** (extending `bundle-budgets.json`, already CI-gated for the other apps):
  homepage first-load JS ≤ 95KB gzip; any other page ≤ 80KB; the interactive-demo island ≤ 60KB gzip,
  loaded on interaction/visibility only; total CSS ≤ 40KB gzip.
- Every client island is `next/dynamic`, most with `ssr: false` and a server-rendered static fallback.
- Icons imported individually (`lucide-react` tree-shakes only with named imports — verify in the
  analyzer, don't assume).
- `@next/bundle-analyzer` is already a devDependency — wire it to a `nx analyze @algoryq/marketing`
  target and review it before every release.
- **No third-party script in the critical path.** Analytics loads after first interaction or on idle
  (`16-`). No chat widget on load — if one is ever added, it is behind a button.

---

## 7. Theming

- Light default, `.dark` class (matching `packages/ui`), `prefers-color-scheme` respected on first
  visit, choice persisted in `localStorage`.
- **No-flash script:** a tiny blocking inline script in `<head>` sets the class before paint. This is
  the one place a render-blocking script is correct.
- `color-scheme` CSS property set so native form controls and scrollbars follow.
- Every screenshot has a dark variant; `ScreenshotFrame` swaps on theme.

---

## 8. Quality gates (CI)

Added to the existing pipeline for `@algoryq/marketing`:

1. `typecheck` — strict, zero errors
2. `lint` — including the no-hex/no-magic-number rule
3. **Build with services unreachable** — proves the tolerance path
4. Bundle budgets — fail on regression
5. Lighthouse CI on 5 key routes, mobile + desktop profiles (`12-`)
6. Playwright: smoke journey × 3 viewports + axe scan per page template (`13-`)
7. Contrast script over marketing tokens, both themes
8. Link check (internal 404s + external dead links)
9. Screenshot staleness warning (>90 days)

## Completion Status

- [ ] Directory structure + route group established
- [ ] `interactive/` client boundary enforced by lint
- [ ] Content modules + zod validation, green with gated files empty
- [ ] Rendering strategy per route implemented
- [ ] Bundle budgets added to `bundle-budgets.json` and CI
- [ ] Theme system with no-flash script
- [ ] All nine CI gates wired
