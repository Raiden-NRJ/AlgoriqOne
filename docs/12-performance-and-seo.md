# 12 — Performance & SEO

**Depends on:** `11` (architecture), `10` (images).
**Purpose:** the measurable gates. Performance and SEO are not a polish phase here — they are build
constraints applied from the first commit, because both are far cheaper to hold than to recover.

---

## 1. On "Lighthouse 100 across the board"

The brief asks for 100/100/100/100. Stating this precisely, because it affects what we commit to:

- **Accessibility 100, Best Practices 100, SEO 100** — genuinely achievable and non-negotiable. These
  are gated in CI and any regression fails the build.
- **Performance 100** — achievable on the lab profile for static pages, and it is our target. But
  Lighthouse Performance is a *sampled lab score* with run-to-run variance of several points; a hard
  "must equal 100" gate produces flaky builds and, worse, incentivises gaming the metric instead of
  serving users.

**What we actually gate on:** field-realistic Core Web Vitals thresholds (§2) plus a Lighthouse
Performance floor of **≥ 97 (mobile) and ≥ 99 (desktop)**, measured as the median of 3 runs. We aim
for 100 and will usually hit it; we don't ship a flaky pipeline to be able to say so. Real-user
(field) data from `web-vitals` is the score that actually matters and is tracked continuously (`16-`).

---

## 2. Core Web Vitals budgets

Measured on a simulated mid-tier mobile over 4G (Lighthouse mobile profile) — the honest condition,
not desktop-on-fibre.

| Metric | Budget | Stretch | Primary lever |
|---|---|---|---|
| LCP | < 1.8s | < 1.4s | Hero image (AVIF, priority, preloaded), self-hosted fonts, static HTML |
| INP | < 150ms | < 100ms | Minimal JS, islands, no long tasks in the reveal path |
| CLS | < 0.03 | < 0.01 | Explicit image dimensions from the manifest, `size-adjust` font fallbacks, no late-injected banners |
| TTFB | < 400ms | < 200ms | Static/ISR + CDN |
| FCP | < 1.2s | < 0.9s | Critical CSS inline, no render-blocking third parties |
| TBT | < 150ms | < 80ms | Code splitting, deferred analytics |

**Asset budgets** (`11` §6): homepage first-load JS ≤ 95KB gzip · CSS ≤ 40KB gzip · homepage images
≤ 900KB · any single screenshot ≤ 120KB · fonts ≤ 90KB total (2 woff2 subsets).

---

## 3. Performance techniques (in priority order)

1. **Ship less JavaScript.** Server components by default; the `interactive/` boundary (`11` §2) is the
   enforcement mechanism. This single decision outweighs every other optimisation combined.
2. **Static-first rendering.** SSG/ISR everywhere; no per-request rendering for marketing content.
3. **Font strategy.** Self-hosted variable woff2, latin subset, `display: swap`, preloaded, with
   `size-adjust`/`ascent-override` fallback metrics tuned so the swap causes zero layout shift.
4. **Image strategy.** `10` §5 — AVIF/WebP, responsive `srcset`, lazy below fold, tiny blur
   placeholders, explicit dimensions.
5. **Critical CSS.** Tailwind v4 emits only used utilities; above-the-fold CSS inlined, the rest
   deferred. Total CSS stays under budget because the token system prevents utility sprawl.
6. **Preconnect/preload discipline.** Only what's on the critical path: the hero image and the two font
   files. Over-preloading is a common self-inflicted regression.
7. **Third parties.** Analytics deferred to idle/first-interaction. No chat widget on load. No tag
   manager (it defeats every budget above). Any new third party requires a documented budget impact.
8. **Caching.** Immutable `Cache-Control` on hashed assets; `stale-while-revalidate` on ISR pages;
   CDN edge caching for all static routes.
9. **No layout thrash.** Reveals batch reads/writes; `will-change` applied and removed (`09` §3).

---

## 4. SEO

### 4.1 Technical
- Semantic HTML: one `<h1>` per page, no heading-level skips, `<nav>`/`<main>`/`<article>`/`<footer>`
  landmarks. (Correct headings serve both SEO and screen readers — one fix, two gates.)
- `sitemap.ts` — generated from the route manifest, includes all ~45 routes plus dynamic blog and
  changelog entries, with `lastModified`.
- `robots.ts` — permissive, sitemap referenced, no accidental staging indexation (staging sends
  `X-Robots-Tag: noindex` via env check).
- Canonical URL on every page. Trailing-slash policy enforced by redirect, one canonical form only.
- Legacy redirects: `/features` → `/product/revenue` (301). Every URL that ever shipped keeps working.
- `hreflang` once locales ship (the i18n runtime already exists in the platform).
- Clean, keyword-relevant, human-readable URLs. No query-string-driven content.

### 4.2 Structured data (JSON-LD)
| Schema | Where |
|---|---|
| `Organization` + `logo` + `sameAs` | site-wide (footer) |
| `SoftwareApplication` + `offers` | homepage, `/pricing` |
| `WebSite` + `SearchAction` | site-wide |
| `BreadcrumbList` | every page below root |
| `FAQPage` | `/faq`, homepage §18 |
| `Article` + `author` + `datePublished` | `/blog/[slug]` |
| `Product` / `AggregateRating` | **only when real reviews exist** — never fabricated |

Validated in CI against the Rich Results schema.

### 4.3 Content SEO
- **Target intents, one page each:** "professional services CRM", "CRM with project management",
  "CRM with HR", "role-based access control CRM", "self-hosted CRM", "Zoho One alternative",
  "PSA software", "timesheet approval software".
- Comparison pages carry the highest commercial intent — build them well (`06` §4) and keep them
  dated.
- Title ≤ 60 chars, description ≤ 155, both unique per page, both written for a human first.
- Internal linking: every product page links to its cluster siblings, its platform dependencies, and
  its security surface. The footer makes every page reachable in one click from anywhere.
- **No keyword stuffing, no doorway pages, no AI-generated filler.** Content quality is the ranking
  strategy; the technical layer just removes obstacles.

### 4.4 Social
Dynamic per-page OG images (`10` §8), `twitter:card=summary_large_image`, and correct
`og:title`/`og:description`/`og:url`/`og:type` on every route.

---

## 5. Measurement

- **Lab:** Lighthouse CI in the pipeline on 5 representative routes (`/`, `/product/delivery`,
  `/pricing`, `/security`, `/blog/[slug]`), mobile + desktop, median of 3. Fails the build below the
  §1 floors.
- **Field:** `web-vitals` reporting real LCP/INP/CLS per route to the analytics endpoint (`16-`),
  segmented by device class. **Field data overrides lab data in any disagreement.**
- **Budgets:** `bundle-budgets.json` extended to marketing, enforced on every build.
- **Regression triage:** a budget failure blocks merge. The fix is to remove weight, not to raise the
  budget — raising a budget requires an explicit, recorded decision.

## Completion Status

- [ ] Font pipeline with metrics-matched fallbacks (CLS = 0 on swap)
- [ ] Image pipeline + manifest dimensions wired
- [ ] Bundle + asset budgets in CI
- [ ] Lighthouse CI on 5 routes, both profiles, median-of-3
- [ ] `sitemap.ts`, `robots.ts`, canonicals, legacy redirects
- [ ] All JSON-LD schemas emitted and validated
- [ ] Dynamic OG images
- [ ] `web-vitals` field reporting live
