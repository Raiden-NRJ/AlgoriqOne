# Algoryq One website

The public product website. A self-contained Next.js 16 application — it is **not** part of the root
npm workspace and does not require the 30-service monorepo to be installed.

```bash
cd website
npm install          # ~48 packages
npm run dev          # http://localhost:3500
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on port 3500 |
| `npm run build` | Production build — must be green with **zero services running** |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit`, strict |
| `npm run check:contrast` | Converts every oklch token to sRGB and computes real WCAG ratios. No server needed. |
| `npm run check:links` | Crawls every internal link; fails on any non-200 |
| `npm run check:content` | Fabricated-claim guard, banned vocabulary, heading structure, metadata, image alt |
| `npm run audit` | **Playwright + axe over every route × 13 viewports** — overflow, a11y violations, tap targets, tiny text, console errors |
| `npm run audit:quick` | Same, at 390 / 768 / 1440 only |
| `npm run audit:shots` | Also writes screenshots to `audit-shots/` |
| `npm run verify` | typecheck + contrast + build |

The link, content and audit scripts need a running server:

```bash
npm run build
npm run start &
npm run check:links
npm run check:content
npm run audit          # ~560 page loads; use audit:quick while iterating
```

First run of `npm run audit` (before browsers were involved) turned up 207 findings that the static
checks could not see — contrast failures, a horizontal overflow at 390px, and an `role="img"` wrapper
hiding six links from assistive tech. Details in [docs/13](docs/13-accessibility.md) §4.

## Environment

Every backend loader is optional and tolerant. With none of these set, the site builds and renders
completely — pricing shows a quote path instead of prices, the blog and changelog show honest empty
states, and the contact form returns a fallback email address rather than silently dropping the
message.

| Variable | Effect when set |
|---|---|
| `BILLING_SERVICE_URL` | `/pricing` renders live plans from the billing service |
| `KNOWLEDGE_BASE_SERVICE_URL` | `/resources/blog` renders the published article feed |
| `RELEASES_SERVICE_URL` | `/resources/changelog` renders real releases |
| `CRM_SERVICE_URL` + `LEAD_TENANT_ID` | The contact form creates a real lead |
| `INTERNAL_AUTH_SECRET` | Sent as `x-internal-auth` to services that require it |
| `PORTAL_URL` | Where `/signup` and `/login` redirect (default `https://portal.one.algoryq.com`) |
| `SITE_INDEXABLE` | Must be `"true"` for `robots.txt` to allow indexing — staging is noindex by default |

Nothing above reaches the client bundle. All loaders are `import 'server-only'`.

## Structure

```
src/
  app/            routes; globals.css holds the whole token system
  content/        typed copy and data — no copy lives in JSX
  components/
    site/         primitives, header, footer, logo, reveal
    sections/     one file per homepage section
    page/         the shared template every non-home page uses
    diagrams/     SVG system diagrams
    interactive/  client islands ONLY — every file starts 'use client'
  lib/            server-only data loaders
scripts/          link and content verification
docs/             the plan (00–17 + MASTER_PROGRESS)
```

## The rules this site is built on

Read [CLAUDE.md](CLAUDE.md) before changing anything. The short version:

1. **No fabricated proof.** No invented customer logos, testimonials, case studies or certifications.
   Trust components read `src/content/proof.ts` and render an honest alternative — or nothing — when
   it is empty. `npm run check:content` enforces this.
2. **Light mode only.** The dark bands on the permissions and security sections are a tonal device
   using `--color-band-*`, not a theme.
3. **Claims trace to code.** Every capability statement maps to something in
   [docs/00-audit-and-inventory.md](docs/00-audit-and-inventory.md).
4. **`'use client'` only under `components/interactive/`.**
5. **Tokens, not magic numbers.** A hex literal in a component is a bug.
