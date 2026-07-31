# RocketCRM Website — Operating Guide

**Workstream:** a flagship, enterprise-grade product website, **built from scratch in this folder**.
**Owner folder:** `website/` — plan *and* code. **Port:** 3500. **Theme:** light mode only.
**Opened:** 2026-07-31. **Status:** M0 + M1 homepage built and building green.

> **Scope decision (2026-07-31, user):** the existing `apps/marketing` site is **not** the starting
> point and is not touched by this workstream. `website/` is a self-contained Next.js application
> with its own `package.json` and `node_modules` — it does not participate in the root npm workspace
> and does not pull the 30-service monorepo into an install.

---

## What this folder is

`website/` holds both the plan (`docs/`) and the site itself (`src/`). It is a standalone Next.js 16
app: `npm install && npm run dev` inside this folder is the whole setup.

```
website/
  package.json  next.config.mjs  tsconfig.json  postcss.config.mjs
  src/
    app/          layout, globals.css (tokens), page.tsx (homepage)
    content/      typed copy + data modules — no copy lives in JSX
    components/
      site/       primitives, header, footer, logo, reveal
      sections/   one file per homepage section
      diagrams/   SVG system diagrams
      interactive/  client islands ONLY — every file starts 'use client'
  docs/           the plan (00–17 + MASTER_PROGRESS)
```

The plan follows the same convention that got the product from doc 01 to doc 30: **numbered docs,
worked strictly in order, one at a time, 100% complete before the next.**

```
  CLAUDE.md                       ← you are here
  docs/
    MASTER_PROGRESS.md            ← check this first every session
    00-audit-and-inventory.md     ← what RocketCRM actually is (verified against code)
    01-brand-and-positioning.md   ← story, ICP, messaging spine, objection map
    02-design-system.md           ← tokens, type, color, spacing, elevation, motion
    03-information-architecture.md← sitemap, URL map, homepage narrative resolution
    04-homepage-blueprint.md      ← section-by-section spec (the core deliverable)
    05-module-showcase-pages.md   ← per-module product pages from the real module map
    06-solutions-and-industries.md
    07-security-trust-compliance.md
    08-pricing-roi-and-conversion.md
    09-motion-and-interaction.md
    10-visual-assets-and-devices.md
    11-frontend-architecture.md
    12-performance-and-seo.md
    13-accessibility.md
    14-figma-deliverables.md
    15-content-and-copy-system.md
    16-analytics-and-experimentation.md
    17-implementation-roadmap.md
```

---

## Non-negotiable working rules

These are inherited from the root `CLAUDE.md` and tightened for a public-facing surface.

1. **No fabricated data, ever.** This is the hardest rule on this workstream. The site must not ship
   invented customer logos, testimonials, case studies, awards, revenue figures, customer counts, or
   compliance certifications. Every trust element is a data-driven component that renders only when
   real content exists (see `07-security-trust-compliance.md`). An honest empty slot beats a fake logo
   wall — and a fake SOC 2 badge is a legal problem, not a design choice.
2. **Compliance language is precise.** RocketCRM's architecture is SOC 2 *ready* and has GDPR DSR
   flows built (doc 28). It is **not certified**. Copy says "SOC 2-ready architecture", never "SOC 2
   certified", and no certification badge renders until an auditor's report exists.
3. **Claims trace to code.** Every capability statement on the site maps to a file path in
   `00-audit-and-inventory.md`. If it isn't built, it isn't claimed — or it's labelled on the roadmap.
4. **Performance is a gate, not a goal.** Bundle budgets in `bundle-budgets.json` extend to marketing;
   CI fails the build on regression. Targets and how they're measured: `12-performance-and-seo.md`.
5. **Accessibility is verified in a browser, not asserted.** WCAG 2.2 AA minimum.
   `npm run audit` runs Playwright + axe over every route at 13 widths; `npm run check:contrast`
   computes real WCAG ratios from the oklch tokens. Both must be clean before a change ships.
   `prefers-reduced-motion` is honoured globally; every interaction has a keyboard path.
   **Static checks are not sufficient** — the first browser audit found 207 issues while the content
   and link checkers were green (docs/13 §4).
6. **The site is server-first.** Next.js App Router, RSC by default, `'use client'` only where an
   interaction genuinely requires it. Motion is progressive enhancement — the page must be complete,
   readable, and convertible with JavaScript disabled.
7. **Public surface, zero trust.** When backend loaders are added, they are `server-only` with a
   timeout and a tolerant fallback. No service URL, internal-auth secret, or tenant id ever reaches
   the client bundle, and the site must build green with zero services running.
8. **Design tokens, not magic numbers.** Every color, space, radius, duration and easing comes from
   the token set in `src/app/globals.css`. A hex literal in a component is a bug.
9. **One idea per section.** The homepage is a keynote, not a datasheet. Depth lives on dedicated
   pages, reachable in one click. See the narrative-resolution decision in `03-`.
10. **Light mode only.** No dark theme, no theme toggle, no `prefers-color-scheme` branch. The dark
    bands on §8 (permissions) and §13 (security) are a *tonal device* within the light design, using
    the `--color-band-*` tokens — not a theme. Do not reintroduce a dark variant without changing
    this rule first.
11. **Definition of done per doc:** implementation + responsive pass (320→2560px) + a11y pass +
    motion/reduced-motion pass + copy review + Lighthouse/bundle check + doc's Completion Status
    marked + `MASTER_PROGRESS.md` updated.

---

## Implementation workflow (binding)

1. Read `docs/MASTER_PROGRESS.md` first, every session.
2. Work numbered docs **strictly in order**. Never two at once.
3. Per-document loop: read fully → implement everything → verify (`npm run typecheck`,
   `npm run build`, Playwright + axe once wired) → fix all findings → mark Completion Status →
   update `MASTER_PROGRESS.md` → only then open the next doc.
4. Blocked? Record it in MASTER_PROGRESS Blockers. Do not skip ahead.

## Build & environment notes

```bash
cd website
npm install      # ~48 packages, self-contained
npm run dev      # http://localhost:3500
npm run build    # static prerender
npm run typecheck
```

- This app is **not** in the root npm workspace. It has its own lockfile, and `turbopack.root` is
  pinned in `next.config.mjs` so Next doesn't walk up into the monorepo looking for one.
- It deliberately does **not** import `@rocketcrm/ui`: different audience, different brand register,
  and none of the admin-shell bundle weight. `02-design-system.md` explains the trade and the
  brand-level contract that keeps the two from drifting.
- Never write repo files via `echo`/`printf`/`node -e` — it has silently corrupted committed files
  twice in this repository. Use the editor tools.
- `'use client'` appears **only** under `src/components/interactive/`. If something elsewhere needs
  state, refactor the interactive part into an island. This boundary is the main defence against
  bundle creep.
- **Any grid or flex parent holding a wide child needs `min-w-0` on its items** — a `<pre>`, a wide
  table, an `overflow-x-auto` container, or a fixed-width composition. Children default to
  `min-width: auto`, so the widest one drags the whole column to its unwrapped min-content width.
  This bit twice: once as a visible sideways scroll, once *invisibly* where an `overflow: hidden`
  ancestor clipped the text instead (docs/13 §4).
- **Read the screenshots.** `npm run audit:shots` writes every viewport to `audit-shots/`. Two real
  bugs shipped past a fully green audit and were only caught by looking at the images.

## Inputs still needed from the business

Recorded here so they are never silently invented:

| Input | Blocks | Fallback until supplied |
|---|---|---|
| ~~Figma file URL~~ — **supplied 2026-07-31**, see `14-` §1 | — | Analysed: it is a product-story deck, not page designs. Code remains authoritative. |
| Real customer logos + written permission | Trust bar | Section renders "engineering proof" band instead (see `07-`) |
| Testimonials / case studies with named attribution | Sections 28–30 | Sections omitted from render, not faked |
| Audit reports (SOC 2 Type II, ISO 27001) | Certification badges | "Ready architecture" language + control list only |
| Legal-approved uptime SLA number | SLA claim | Architectural claim only, no percentage |
| Pricing decision (public vs. contact-sales tiers) | `08-` | Live plans from billing-service, as today |
