# Algoryq One Website — Operating Guide

**Workstream:** a flagship, enterprise-grade product website, **built from scratch in this repo**.
**Owner folder:** the repository root — plan *and* code. **Port:** 3500. **Theme:** light mode only.
**Opened:** 2026-07-31. **Status:** M0 + M1 homepage built and building green.

> **Path correction (2026-08-10).** Earlier revisions of this file described the app as living in a
> `website/` subdirectory. It does not, and never did in this repository: `src/`, `docs/`,
> `package.json`, `next.config.mjs` and `scripts/` are all at the **repository root**, and there is
> no `website/` directory. Every path in this file is repo-root-relative. Historical references to
> `website/docs/...` inside source comments mean `docs/...`.

> **Scope decision (2026-07-31, user):** the existing `apps/marketing` site is **not** the starting
> point and is not touched by this workstream. This is a self-contained Next.js application with its
> own `package.json` and `node_modules` — it does not participate in the root npm workspace and does
> not pull the 30-service monorepo into an install.

> **Rebrand (2026-07-31, user):** the product was renamed **RocketCRM → Algoryq One** and placed
> under the Algoryq Technologies brand, "powered by Algoryq.tech". The mark, the brand hue (259) and
> the ink neutrals (265) now come from `algoryq.com`; the site is at `one.algoryq.com`. Rule 12
> below is the binding version. Nothing about the product's *capabilities* changed — every claim
> still traces to the same code, so `00-audit-and-inventory.md` stands as written.

---

## What this folder is

The repo root holds both the plan (`docs/`) and the site itself (`src/`). It is a standalone Next.js
16 app: `npm install && npm run dev` at the root is the whole setup.

```
.                                 ← repository root
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
    00-audit-and-inventory.md     ← what Algoryq One actually is (verified against code)
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
2. **Compliance language is precise.** Algoryq One's architecture is SOC 2 *ready* and has GDPR DSR
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
10. **Dark ground only — "Azure".** *(Owner instruction 2026-09-02, applied the same day,
    superseding the light-only rule recorded below.)* From the M6 Azure motion deck: "Dark ground.
    Light on the line." Still **one** ground — no toggle, no `prefers-color-scheme` branch, no light
    variant. Committing to a single ground is the part of the original rule that was load-bearing
    and it is unchanged; only which ground changed.

    - Surfaces read from the **dark end of the same ink ramp** (hue 265). Nothing was re-hued: the
      ground was sampled from the deck (`#030a1b`–`#050d21`) and lands within a hair of
      `--color-neutral-950`, so this is a re-point, not a new palette. Rule 12 is untouched.
    - **Actions and links go through the semantic layer, never a raw ramp step.** `--color-action`
      is the fill, `--color-link` the text, `--color-chip*` the soft panels, `--color-tint*` the
      tinted sections, `--color-accent-*` the cyan roles. That split exists because on white,
      `brand-600` was both the button fill and the link colour; on the ground it is still a fine
      fill (light text on it is 7.7:1) but as *text* it is 2.3:1. Reaching past these tokens for
      text is the one easy way to reintroduce a contrast failure here.
    - `--color-fg-inverse` stays **light** — the name invites the opposite conclusion, but the
      primary action is still a dark blue, so text on it is light on either ground. Setting it dark
      measured 2.5:1 and the gate caught it.
    - **The band device inverted rather than being deleted.** On a dark ground a dark band is
      invisible, so `--color-band` is now a *raised* panel. Re-pointing that one token kept every
      `tone="band"` call site and all its `band-fg` text working untouched.
    - **The cyan fill-only rule is retired, and its premise is what changed.** cyan-500 was 2.29:1
      on white and therefore fill-only; on the ground it is 8.5:1 and is a legitimate border and
      icon colour (`--color-accent-line`). The trap flipped rather than vanishing: text on a cyan
      fill must now be dark.
    - Enforcement is unchanged in spirit and rewritten in fact: `npm run check:contrast` covers 48
      pairs against the dark ground and is the arbiter, not the eye.

    > **Superseded:** *"Light mode only. No dark theme… The dark bands on §8 and §13 are a tonal
    > device within the light design."* That rule stood from 2026-07-31 to 2026-09-02. It is
    > recorded here rather than deleted because a great many comments in this repo were written
    > under it, and a reader hitting one needs to know when it stopped applying.
    - Surfaces come from the ink ramp (hue 265) at the dark end. `--color-bg` is the ground,
      `--color-bg-subtle` the alternating band, `--color-surface` the raised card.
    - **Actions and links use semantic tokens, never a raw ramp step.** `--color-action` is the
      fill, `--color-link` the text. On a dark ground `brand-600` is a fill colour and no longer a
      text colour — that inversion is why the semantic layer exists, and reaching past it to a ramp
      step is how contrast silently breaks.
    - `--color-fg-inverse` is the only light surface left, and it exists for text *on* a filled
      action.
    - Every pair is still enforced by `npm run check:contrast`, which was rewritten for the dark
      ground in the same pass. It is the arbiter, not the eye.
    - The former dark *band* device is gone: on a dark ground a dark band is invisible. Sections
      that need emphasis use `--color-bg-subtle` or the tint.

    > **Superseded:** *"Light mode only. No dark theme… The dark bands on §8 and §13 are a tonal
    > device within the light design."* That rule stood from 2026-07-31 to 2026-09-02. It is
    > recorded here rather than deleted because most of the repo's comments were written under it,
    > and a reader hitting one of those needs to know when it stopped applying.
12. **The brand is Algoryq's, not ours to redraw.** The product is **Algoryq One**, a product of
    **Algoryq Technologies**, and the site says so — the footer carries a "Powered by Algoryq.tech"
    attribution and the copyright names the parent entity. Specifics:
    - The mark in `src/components/site/logo.tsx` is the parent glyph copied path-for-path from
      `algoryq.com`. **Do not redraw, re-proportion, or "clean up" those path `d` attributes** — the
      two brands must be the same mark at every size.
    - The wordmark is `Algoryq` + `One`, with the second segment in `--color-brand-600`. This mirrors
      the parent's `algoryq` + `.tech` colour split. In prose the product is "Algoryq One" (two
      words); `AlgoryqOne` is the code identifier only (SDK class, package name).
    - Brand hue is **259** and the ramp's 500/600 stops are Algoryq's own values, unmodified. Re-hue
      the ramp only alongside the parent.
    - The parent is dark-first and we are not. Only the hue family crosses over; rule 10 still holds.
    - Every published name, URL and address lives in `SITE` / `PARENT` / `CONTACT` in
      `src/content/site.ts`. Never hardcode a domain or an email in a component.
13. **Definition of done per doc:** implementation + responsive pass (320→2560px) + a11y pass +
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
# from the repository root
npm install      # ~48 packages, self-contained
npm run dev      # http://localhost:3500
npm run build    # static prerender
npm run typecheck
```

- This app is **not** in the root npm workspace. It has its own lockfile, and `turbopack.root` is
  pinned in `next.config.mjs` so Next doesn't walk up into the monorepo looking for one.
- It deliberately does **not** import `@algoryq/ui`: different audience, different brand register,
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
- **A route that redirects off-site must be a plain `<a>`, not a `<Link>`.** Next prefetches `<Link>`
  targets and follows the redirect cross-origin, so every page load fires a request at the portal
  host — a console error on every route when that host isn't provisioned yet. `Button` already
  handles this via `OFFSITE_ROUTES` in `src/content/site.ts`; add a route there whenever you add a
  redirect to `next.config.mjs`.
- **`npm run audit` needs a running server** (`npm run start`) and takes ~20 minutes. Don't poll for
  it with `pgrep -f audit.mjs` — that pattern matches the polling shell's own command line and
  reports the audit as finished while it is still going. Wait on the PID.

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
