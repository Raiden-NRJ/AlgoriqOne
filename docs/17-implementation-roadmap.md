# 17 — Implementation Roadmap

**Depends on:** all preceding documents.
**Purpose:** the order of work, the shippable milestones, and the honest effort picture.

---

## 1. Sequencing principle

The site is built **narrative-first, depth-second**. At every milestone the site is coherent and
shippable — never a half-built homepage plus 20 empty pages. The first milestone alone (a genuinely
excellent homepage on a real design system) is worth more than 45 mediocre pages, and it de-risks
everything after it by proving the design language works.

Work follows the repo's proven convention: numbered docs, strictly in order, one at a time, 100%
complete before the next (`CLAUDE.md`).

---

## 2. Milestones

### M0 — Foundations (docs 02, 11)
Design tokens implemented in `globals.css` (light + dark), fonts self-hosted with metrics-matched
fallbacks, type scale, the site component library, directory structure, the `interactive/` client
boundary, content modules with zod validation, CI gates wired (typecheck, lint, no-hex rule,
build-with-services-down, bundle budgets, contrast, axe).

*Exit:* a Storybook of site components, both themes, and a green pipeline. Nothing user-visible yet —
and that is correct.

### M1 — The homepage (docs 04, 09, 10 partial, 15 partial)
All 20 sections, the three signature motion moments, the interactive product overview (§6), the
permission matrix (§8), P0 screenshots captured through the automated pipeline, homepage copy written
and truth-checked, full a11y and responsive pass.

*Exit:* **the site could launch on this alone.** Homepage + the existing pricing/blog/contact pages is
a legitimate, high-quality site. This is the true de-risking milestone.

### M2 — Trust & conversion (docs 07, 08)
`/security` hub + permissions + compliance + infrastructure. `/pricing` rebuilt on live plan data with
the degradation path. `/roi`. `/demo`. `security.txt`, `/changelog` wired to `releases-service`, and
the accessibility statement.

*Exit:* a CISO can evaluate us and a CFO can price us, both without contacting anyone. This unblocks
enterprise deals more than any other milestone.

### M3 — Product depth (docs 05, 10 remainder)
The five cluster pages and six platform pages, on one shared template. All P1 screenshots. The
workflow-chain animations.

*Exit:* every module in the platform has a page that does it justice.

### M4 — Market surfaces (docs 06, 15 remainder)
Three industry pages, five role pages, five comparison pages (legal-reviewed, date-stamped),
`/customers` in founding-customers state, `/faq`, guides, company pages, legal pages.

*Exit:* the full ~45-route sitemap is live and internally linked.

### M5 — Measure & tune (docs 12 remainder, 16)
Analytics, field Core Web Vitals, funnel dashboard, the experiment framework, first experiments,
Lighthouse CI on all key routes, final performance tuning.

*Exit:* we know where the funnel leaks and can act on it.

### M6 — Design system artifacts (doc 14)
Figma Foundations + Components files generated from the shipped implementation, with Code Connect
mappings. Page and prototype files after that, if still wanted.

---

## 3. Effort — stated honestly

This is a substantial build, and the plan should not pretend otherwise. Rough ranges for a small
senior team (1 design engineer, 1 frontend engineer, part-time designer, part-time writer):

| Milestone | Range | Dominated by |
|---|---|---|
| M0 | 1–2 weeks | Token system, component library, CI |
| M1 | 3–5 weeks | §6 interactive demo and §8 permission matrix are the long poles |
| M2 | 2–3 weeks | Security content accuracy + legal review, not code |
| M3 | 3–4 weeks | Screenshot capture and per-module copy, not layout |
| M4 | 2–4 weeks | Comparison research and legal review |
| M5 | 1–2 weeks | Mostly wiring; tuning is ongoing |
| M6 | 2–3 weeks | Design time, off the critical path |

**Total to a launchable, excellent site (M0–M2): ~6–10 weeks.** Full scope: ~14–23 weeks.

Two levers if that's too long:
1. **Launch after M1 + a cut-down M2** (security hub + pricing only). Genuinely viable — the site
   would already be better than most enterprise CRM sites.
2. **Drop M6 entirely** unless a design team needs the files. `02`/`04`/`05` are build specs; the
   Figma files are documentation of what was built.

What should **not** be cut: the truth-checking process, the a11y gates, the performance budgets, or
the honesty rules on trust content. Those are the things that make this site credible, and they are
also the things that are impossible to retrofit.

---

## 4. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| **No social proof at launch** | The trust sections are structurally weak | Engineering-proof band + architecture transparency + founding-customer program (`04` §2, `06` §5). Gated components ship complete so real content is a data change. |
| **Screenshots go stale after a product release** | Site silently misrepresents the product | Automated capture pipeline + 90-day staleness check in CI (`10` §4) |
| **Scope creep from 20 → 30 homepage sections** | The keynote becomes a datasheet | The section budget in `03` §1 is a contract. New topics get a page, not a section. |
| **Interactive demo (§6) overruns** | M1 slips | Build behind a flag; the static screenshot fallback is shipped first and is a legitimate section on its own |
| **A compliance claim is overstated** | Legal/contractual exposure | The honesty contract in `07` §1 + mandatory security and legal sign-off on those pages |
| **Comparison pages become inaccurate** | Credibility damage | Quarterly review, visible `verifiedAt` date, sourced claims, honest concessions |
| **Performance regresses as sections are added** | Loses the premium feel | Budgets fail the build; the fix is removing weight, never raising the budget |
| **Figma file surfaces late and contradicts the build** | Rework | Reconciliation pass is a defined task (`14` §1), code is authoritative by default |
| **Content becomes the bottleneck** | Pages ship empty or with filler | Copy ships in the same PR as its layout; no page merges without truth-checked copy |

---

## 5. Definition of done (per milestone)

1. All acceptance criteria in the owning doc(s) checked.
2. `nx typecheck`, `nx lint`, `nx build` green for `@rocketcrm/marketing`.
3. Build green **with all service URLs unreachable**.
4. Bundle budgets pass.
5. Lighthouse: Performance ≥ 97 mobile / ≥ 99 desktop, Accessibility / Best Practices / SEO = 100.
6. axe: zero serious or critical violations, both themes, three viewports.
7. Responsive matrix verified (`13` §5), no horizontal scroll at any width.
8. Keyboard traverse + one screen-reader pass.
9. `prefers-reduced-motion` pass.
10. Every claim truth-checked against `00`; zero fabricated proof.
11. Doc Completion Status marked; `MASTER_PROGRESS.md` updated.

---

## 6. Immediate next actions

1. **Confirm the positioning wedge** (`01` §2) with whoever owns go-to-market. Everything downstream
   assumes it. This is the one decision worth pausing for.
2. **Answer the input list** in `CLAUDE.md` — especially the Figma URL and whether any customer will
   go on record.
3. **Decide the font licence** (Inter-only vs a licensed display face) — it gates M0.
4. **Start M0.** Tokens and the component library are unblocked by every open question above.

## Completion Status

- [ ] Positioning confirmed with go-to-market owner
- [ ] Business inputs supplied or explicitly deferred
- [ ] Font decision made
- [ ] M0 → M6 executed in order, each meeting the definition of done
