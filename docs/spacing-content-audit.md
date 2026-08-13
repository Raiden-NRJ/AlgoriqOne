# Spacing / Rhythm and Content-Reduction Audit

> ## Status — Phase 2 landed 2026-08-10
>
> **All twelve items in the Phase 2 work plan are implemented.** Verified green: `tsc --noEmit`
> strict, `next build` (48 routes, zero services running), `check:links` (45 URLs, zero broken),
> `check:content` (42 routes, zero failures, zero warnings), `check:contrast` (48/48 pairs plus the
> `FILL_ONLY` assertion), and the full Playwright + axe browser audit at 13 viewports.
>
> **B1 was verified the way this document asked for** — the homepage HTML before and after the copy
> move is byte-identical apart from Next's per-build hash.
>
> **Four deviations from the plan as written, all deliberate, all recorded at the finding:**
>
> | Finding | Plan said | What was done | Why |
> |---|---|---|---|
> | A3 item 2 | `Clusters → tone="subtle"` | **Not applied** | The palette migration landed the day after this audit and dissolved the §5–§7 run on its own. Clusters now sits between a tint section and a subtle one; making it subtle would create a subtle/subtle pair and erase the boundary between the two sections B5 already calls the page's weakest adjacency. Recorded in `sections/clusters.tsx`. |
> | A2, A5, B1 (ProofBand) | Six raw-padding blocks; eight copy blocks | **Five and seven** | `proof-band.tsx` was deleted on 2026-08-09 at the client's request, before this work started. Its rows are moot. |
> | A5 (`demo:67`) | `gap-4 → gap-14` | Restructured instead | That container holds `h2` + prose + `SampleDataNote` — a heading cluster, not sibling major blocks. `gap-14` would have put 56px between a heading and its own paragraph. Wrapped as one block in the `Reveal` the section was missing, matching the two sections above it. |
> | B7 | Cut the `/company/about` "no logo wall" caveat as a duplicate | **Kept**; only the positional bug fixed | Its homepage twin lived in `proof-band.tsx` and no longer exists, so this is now the only place on the site that explains the absent logo wall. Cutting it would remove an honesty statement rather than a repetition (rule 1). The `"the second principle below"` reference — the real defect — is fixed and now reads the same object the grid renders. |
>
> **Two items from this audit remain open by instruction, not oversight:**
> `/solutions` metadata still repeats its own H1 (B2, last bullet) — the brief scoped B2 to homepage
> copy only, since destination pages are canonical. And `homepage.ts:223` ↔ `pages-product.ts:318`
> (B9, row 1) was not cut, as B9 was not in the Phase 2 plan.
>
> **Next:** `homepage-section-reduction-proposal.md` — Phase 2 removed duplication but kept all the
> sections. Cutting the section *count* is a separate, approval-gated decision.

---

**Date:** 2026-08-08 · **Phase:** 1 — audit only, nothing changed.
**Scope:** every `<Section>` and section-level wrapper in `src/app` and `src/components`, and every
copy module in `src/content`.
**Method:** full read of all 18 homepage sections, the shared page template and all 20 route files;
plus three scripted passes — exact-sentence duplicate detection, 3-shingle near-duplicate detection
(Jaccard ≥ 0.45) over every string literal in `src/`, and an unused-export sweep across
`src/content`, `src/lib` and the two shared component modules.

> **Note on the repo layout.** `CLAUDE.md` describes the app as living in `website/`. It does not —
> the Next app is at the repository root (`src/`, `docs/`, `package.json`, port 3500). There is no
> `website/` directory. Every path in this report is repo-root-relative. Worth correcting in
> `CLAUDE.md` separately; it is not part of this task.

---

## Summary

| | Certain | Judgement call |
|---|---|---|
| **A. Spacing** | 9 findings | 5 findings |
| **B. Content** | 11 findings | 6 findings |

The two highest-impact items are not the ones the brief predicted:

1. **A1 — the homepage's most important blocks have its *tightest* vertical rhythm.** Hero, ProofBand
   and both CTA bands bypass `.section-y` entirely with raw `py-*`. At 1440px the hero pads 96px
   while every section under it pads 129.6px; at 2560px it is 96px against 144px. The page opens
   cramped and loosens as it goes, which is backwards.
2. **B1 — seven of eighteen homepage sections keep their copy inline in JSX**, against the stated
   architecture ("no copy lives in JSX", `CLAUDE.md`). This is upstream of most of the duplication
   below: half the homepage's headline copy is invisible to anyone reading `src/content/`, which is
   how four headlines came to be duplicated word-for-word with their own destination pages.

The literal test asked for in A1 of the brief — *runs of 3+ consecutive sections with identical size
**and** tone* — fires exactly **once** (§5–§7). The flat-rhythm problem is real but it is carried by
two other variables: **heading alignment** (11 of 14 rendered sections are centred, including five in
a row) and **`size`** (`size="lg"` is used **once in the entire codebase**).

---

# A. SPACING

## A.1 — Every `<Section>`, with `size` and `tone`

### Homepage — `src/app/page.tsx`

Rendered order. "bespoke" = a raw `<section>` that does not use the `Section` primitive and therefore
has no `size`/`tone` at all.

| # | Section | File | `size` | `tone` | Heading |
|---|---|---|---|---|---|
| 1 | Hero | [hero.tsx:16](../src/components/sections/hero.tsx#L16) | *bespoke* `py-16 sm:py-20 lg:py-24 xl:py-16` | *bespoke* aurora | left |
| 2 | ProofBand | [proof-band.tsx:40](../src/components/sections/proof-band.tsx#L40) | *bespoke* `py-10` | *bespoke* subtle | centred |
| 3 | Chain | [chain.tsx:24](../src/components/sections/chain.tsx#L24) | default | **warm** | centred |
| 4 | Problem | [problem.tsx:13](../src/components/sections/problem.tsx#L13) | default | subtle | centred |
| 5 | Thesis | [thesis.tsx:13](../src/components/sections/thesis.tsx#L13) | default | default | centred |
| 6 | Clusters | [clusters.tsx:8](../src/components/sections/clusters.tsx#L8) | default | default | centred |
| 7 | Architecture | [architecture.tsx:38](../src/components/sections/architecture.tsx#L38) | default | default | centred |
| 8 | Permissions | [permissions.tsx:15](../src/components/sections/permissions.tsx#L15) | **lg** | band | left |
| 9 | Capabilities | [capabilities.tsx:16](../src/components/sections/capabilities.tsx#L16) | default | default | centred |
| 10 | Intelligence | [intelligence.tsx:9](../src/components/sections/intelligence.tsx#L9) | default | subtle | left |
| 11 | Devices | [devices.tsx:19](../src/components/sections/devices.tsx#L19) | default | default | centred |
| 12 | Developers | [developers.tsx:15](../src/components/sections/developers.tsx#L15) | default | subtle | left |
| 13 | Security | [security.tsx:19](../src/components/sections/security.tsx#L19) | default | band | centred |
| 14 | Solutions | [solutions.tsx:13](../src/components/sections/solutions.tsx#L13) | default | default | centred |
| — | ~~Testimonials~~ | [testimonials.tsx:19](../src/components/sections/testimonials.tsx#L19) | default | subtle | — **returns `null`** (gated, correct) |
| 15 | Roi | [roi.tsx:8](../src/components/sections/roi.tsx#L8) | default | subtle | centred |
| 16 | Faq | [faq.tsx:26](../src/components/sections/faq.tsx#L26) | default | default | centred |
| 17 | FinalCta | [final-cta.tsx:16](../src/components/sections/final-cta.tsx#L16) | *bespoke* `py-24 sm:py-32 lg:py-40` | *bespoke* aurora | centred |

### Deep pages — `src/components/page/page-template.tsx` (≈40 of 47 routes)

| Block | File | `size` | `tone` |
|---|---|---|---|
| PageHero | [page-template.tsx:108](../src/components/page/page-template.tsx#L108) | *bespoke* `py-16 sm:py-20 lg:py-24` | *bespoke* aurora |
| Body | [page-template.tsx:359](../src/components/page/page-template.tsx#L359) | default | default |
| RelatedLinks | [page-template.tsx:285](../src/components/page/page-template.tsx#L285) | default | subtle |
| CtaBand | [page-template.tsx:326](../src/components/page/page-template.tsx#L326) | *bespoke* `py-20 sm:py-24` | *bespoke* aurora |

### Standalone route pages

| Route | File | `size` | `tone` |
|---|---|---|---|
| `/pricing` | [pricing/page.tsx:31](../src/app/pricing/page.tsx#L31) | default | default |
| `/security` | [security/page.tsx:65](../src/app/security/page.tsx#L65) | default | default |
| `/roi` | [roi/page.tsx:28](../src/app/roi/page.tsx#L28) | default | default |
| `/faq` | [faq/page.tsx:42](../src/app/faq/page.tsx#L42) | default | default |
| `/solutions` | [solutions/page.tsx:28](../src/app/solutions/page.tsx#L28) | default | default |
| `/demo` ×3 | [demo/page.tsx:35](../src/app/demo/page.tsx#L35), [:50](../src/app/demo/page.tsx#L50), [:66](../src/app/demo/page.tsx#L66) | default | default / **band** / default |
| `/company/about` | [about/page.tsx:42](../src/app/company/about/page.tsx#L42) | default | default |
| `/company/careers` | [careers/page.tsx:27](../src/app/company/careers/page.tsx#L27) | default | default |
| `/company/contact` | [contact/page.tsx:49](../src/app/company/contact/page.tsx#L49) | default | default |
| `/resources/blog` | [blog/page.tsx:31](../src/app/resources/blog/page.tsx#L31) | default | default |
| `/resources/changelog` | [changelog/page.tsx:32](../src/app/resources/changelog/page.tsx#L32) | default | default |
| `/resources/guides` | [guides/page.tsx:59](../src/app/resources/guides/page.tsx#L59) | default | default |
| `/legal/[doc]` ×3 | [legal/[doc]/page.tsx:45](../src/app/legal/[doc]/page.tsx#L45) | default | default |
| `/not-found` | [not-found.tsx:7](../src/app/not-found.tsx#L7) | *bespoke* `py-24 sm:py-32` | *bespoke* aurora |

---

### 🔴 A1 — CERTAIN — `size="lg"` is used exactly once site-wide; `size` is a dead prop

`Section` offers `size: 'default' | 'lg'`
([primitives.tsx:47](../src/components/site/primitives.tsx#L47)) and `globals.css` defines a whole
second rhythm step for it:

```css
.section-y    { padding-block: clamp(5rem, 9vw, 9rem); }   /* 80 → 144px */
.section-y-lg { padding-block: clamp(6rem, 11vw, 12rem); } /* 96 → 192px */
```

`size="lg"` appears at exactly one call site in the entire repository —
[permissions.tsx:15](../src/components/sections/permissions.tsx#L15). Every other `<Section>` on 47
routes is `default`.

**Why it's a problem.** The design system's only vertical-rhythm lever is unused, which is
mechanically *why* the page reads as one undifferentiated block. Two tones alternating over a single
padding value gives the eye a colour change but no change in *weight* — and weight is what signals
"new chapter" versus "next paragraph".

**Proposed fix.** Promote the three structural pivots of the homepage narrative to `size="lg"`:
§3 Chain (the centrepiece), §8 Permissions (already lg) and §13 Security. Nothing else changes.
That gives the page three breathing points at the three beats that deserve them.

---

### 🔴 A2 — CERTAIN — The four most important blocks on the site bypass `.section-y` with raw `py-*`

Direct violation of rule 8 (tokens, not magic numbers) at section level.

| File:line | Value | Computed at 1440px | vs `.section-y` (129.6px) |
|---|---|---|---|
| [hero.tsx:34](../src/components/sections/hero.tsx#L34) | `py-16 sm:py-20 lg:py-24 xl:py-16` | **96px** | **−26%** |
| [proof-band.tsx:20](../src/components/sections/proof-band.tsx#L20) & [:42](../src/components/sections/proof-band.tsx#L42) | `py-10` | **40px** | −69% |
| [page-template.tsx:111](../src/components/page/page-template.tsx#L111) (PageHero) | `py-16 sm:py-20 lg:py-24` | **96px** | −26% |
| [page-template.tsx:328](../src/components/page/page-template.tsx#L328) (CtaBand) | `py-20 sm:py-24` | **96px** | −26% |
| [final-cta.tsx:19](../src/components/sections/final-cta.tsx#L19) | `py-24 sm:py-32 lg:py-40` | **160px** | +23% |
| [not-found.tsx:10](../src/app/not-found.tsx#L10) | `py-24 sm:py-32` | 128px | ≈ parity |

**Why it's a problem.** Three compounding issues:

1. **The rhythm inverts at width.** These are fixed Tailwind steps; `.section-y` is fluid (`9vw`). At
   2560px the hero still pads 96px while every section below it pads the full 144px. The hero — the
   single block that should feel most generous — is the tightest on the page, and it gets *relatively*
   tighter the wider the screen.
2. **The two closing CTAs disagree with each other.** `FinalCta` (homepage) computes 160px; `CtaBand`
   (all ~40 deep pages) computes 96px. They are the same component in the design's terms — the closing
   ask — rendered 67% apart. A visitor moving homepage → product page feels the page "shrink".
3. **A token change cannot reach them.** Retuning `.section-y` in `globals.css` moves 40+ sections and
   silently leaves these six behind, which is the exact failure mode rule 8 exists to prevent.

**Proposed fix.** These sections legitimately cannot use `<Section>` — they need `overflow-hidden` +
`bg-aurora` + an absolutely-positioned `bg-grid` child. But they do not need raw padding. Apply the
utility class directly to the inner wrapper:

- Hero → `section-y-lg` (replacing `py-16 sm:py-20 lg:py-24 xl:py-16`)
- PageHero → `section-y` (replacing `py-16 sm:py-20 lg:py-24`)
- FinalCta → `section-y-lg` (replacing `py-24 sm:py-32 lg:py-40`)
- CtaBand → `section-y` (replacing `py-20 sm:py-24`)
- not-found → `section-y-lg`
- ProofBand → leave as `py-10`. It is a *rule*, not a section — a 40px band that deliberately reads as
  chrome attached to the hero. Forcing it to `section-y` would detach it and cost the hero its base.
  Recommend converting the literal to a token only if a `--space-band` token is introduced; otherwise
  it is the one defensible raw value here.

This also removes the `xl:py-16` regression on the hero, where padding currently *decreases* at the
xl breakpoint.

---

### 🟠 A3 — CERTAIN — Only one run of 3+ identical `size`+`tone`, but the flat rhythm is real

**The literal finding.** Exactly one run meets the brief's test:

> **§5 Thesis → §6 Clusters → §7 Architecture** — three consecutive `size="default" tone="default"`
> sections, [thesis.tsx:13](../src/components/sections/thesis.tsx#L13),
> [clusters.tsx:8](../src/components/sections/clusters.tsx#L8),
> [architecture.tsx:38](../src/components/sections/architecture.tsx#L38).

That is ~390px of identical white padding on identical white background across three sections, each
opening with an identically-styled centred heading. It reads as one very long section.

**The larger finding the test misses.** Two other variables are flatter than `tone`:

- **Heading alignment.** 11 of the 14 rendered `<Section>`s centre their heading. §3→§7 is **five
  consecutive centred headings** (Chain, Problem, Thesis, Clusters, Architecture) and §14→§16 is
  **three more** (Solutions, Roi, Faq). Only Permissions, Intelligence and Developers break left.
- **Section body gap.** 8 of 14 use `gap-14`, 4 use `gap-12` (see A5) — so even the internal spacing
  is near-uniform.

Combined with A1 (`size` never varies), the page has effectively **one** rhythm signal — background
colour — doing all the work.

**Proposed fix (spacing only; the content fix is B4):**
1. Take A1's `size="lg"` on Chain and Security.
2. Break the §5–§7 run by giving **§6 Clusters `tone="subtle"`**. That yields
   warm → subtle → default → subtle → default → band, a genuine alternation, and it visually separates
   the interactive cluster switcher from the static Thesis table above it.
3. Left-align **§5 Thesis**. Its content is a three-column comparison table read left-to-right; a
   centred heading over a left-aligned table is already a mismatch, and it breaks the five-in-a-row.

---

### 🟠 A4 — CERTAIN — `Reveal` wrappers duplicate `SectionHeading`'s own layout

Four sections wrap `SectionHeading` in a `Reveal` that re-declares the layout `SectionHeading` already
applies internally ([primitives.tsx:110-116](../src/components/site/primitives.tsx#L110-L116) —
`flex flex-col gap-5` + `items-center text-center` when `align="center"`).

| File:line | Wrapper class | Problem |
|---|---|---|
| [devices.tsx:21](../src/components/sections/devices.tsx#L21) | `flex flex-col items-center gap-5 text-center` | wraps `<SectionHeading align="center">` — every class is redundant |
| [testimonials.tsx:21](../src/components/sections/testimonials.tsx#L21) | `<Reveal>` (bare) | correct — keep as the model |
| [roi.tsx:10](../src/components/sections/roi.tsx#L10) | `<Reveal>` (bare) | correct |
| [faq.tsx:28](../src/components/sections/faq.tsx#L28) | `<Reveal>` (bare) | correct |

Only `devices.tsx:21` is actually wrong, but it is wrong in a way that will be copy-pasted: `gap-5`
on a wrapper containing a single child does nothing, and `items-center` on a flex parent whose only
child is already `items-center` is noise that reads as intentional.

**Proposed fix.** `devices.tsx:21` → `<Reveal>`. Matches the other three.

---

### 🟠 A5 — CERTAIN — Three competing gap scales for the same structural role

**Role: section heading block → section body** (the `Container className="flex flex-col gap-N"`
pattern). Two values in use on the homepage:

| Value | Count | Files |
|---|---|---|
| **`gap-14`** | 8 | [chain.tsx:34](../src/components/sections/chain.tsx#L34), [problem.tsx:14](../src/components/sections/problem.tsx#L14), [thesis.tsx:14](../src/components/sections/thesis.tsx#L14), [clusters.tsx:9](../src/components/sections/clusters.tsx#L9), [architecture.tsx:39](../src/components/sections/architecture.tsx#L39), [capabilities.tsx:17](../src/components/sections/capabilities.tsx#L17), [devices.tsx:20](../src/components/sections/devices.tsx#L20), [security.tsx:20](../src/components/sections/security.tsx#L20) |
| `gap-12` | 4 | [solutions.tsx:14](../src/components/sections/solutions.tsx#L14), [testimonials.tsx:20](../src/components/sections/testimonials.tsx#L20), [roi.tsx:9](../src/components/sections/roi.tsx#L9), [faq.tsx:27](../src/components/sections/faq.tsx#L27) |

**Role: two-column split section** (`grid gap-N lg:gap-16`):

| Value | File |
|---|---|
| **`gap-12 lg:gap-16`** | [intelligence.tsx:10](../src/components/sections/intelligence.tsx#L10), [developers.tsx:16](../src/components/sections/developers.tsx#L16) |
| `gap-14 lg:gap-16` | [permissions.tsx:16](../src/components/sections/permissions.tsx#L16) ← deviation |

**Role: eyebrow → title → description cluster.** `SectionHeading` hardcodes `gap-5`
([primitives.tsx:112](../src/components/site/primitives.tsx#L112)) and nine hand-rolled sections match
it. Three do not:

| Value | File:line | Context |
|---|---|---|
| **`gap-5`** | `SectionHeading` + 9 sections | the standard |
| `gap-6` | [permissions.tsx:17](../src/components/sections/permissions.tsx#L17) | Eyebrow / h2 / p — same role, different gap |
| `gap-6` | [page-template.tsx:112](../src/components/page/page-template.tsx#L112) | PageHero eyebrow / h1 / intro |
| `gap-7` | [hero.tsx:36](../src/components/sections/hero.tsx#L36), [final-cta.tsx:19](../src/components/sections/final-cta.tsx#L19), [not-found.tsx:10](../src/app/not-found.tsx#L10) | same role again |

**Role: sibling major sub-blocks inside one `Section`** (route pages). **Six different values across
twelve pages:**

| Value | Files |
|---|---|
| `gap-16` | [about/page.tsx:43](../src/app/company/about/page.tsx#L43), [pricing/page.tsx:32](../src/app/pricing/page.tsx#L32) |
| **`gap-14`** | [careers:28](../src/app/company/careers/page.tsx#L28), [faq:43](../src/app/faq/page.tsx#L43), [guides:60](../src/app/resources/guides/page.tsx#L60), [security:66](../src/app/security/page.tsx#L66), [solutions:29](../src/app/solutions/page.tsx#L29) |
| `gap-12` | [roi/page.tsx:29](../src/app/roi/page.tsx#L29), [contact/page.tsx:50](../src/app/company/contact/page.tsx#L50) |
| `gap-10` | [legal/[doc]/page.tsx:46](../src/app/legal/[doc]/page.tsx#L46) |
| `gap-8` | [demo:36](../src/app/demo/page.tsx#L36), [demo:51](../src/app/demo/page.tsx#L51), [changelog:33](../src/app/resources/changelog/page.tsx#L33), [page-template.tsx:286](../src/components/page/page-template.tsx#L286) |
| `gap-4` | [demo/page.tsx:67](../src/app/demo/page.tsx#L67) |

**Why it's a problem.** These are the same structural relationship rendered at six different
distances. `/demo` at `gap-8` and `gap-4` reads visibly cramped next to `/security` at `gap-14`, and
nothing in the design system justifies the difference — it is drift, not intent.

**Proposed single scale.** Four steps, mapped to structural role:

| Role | Value (as landed 2026-08-10) | **Superseded 2026-08-13** |
|---|---|---|
| Eyebrow → title → description | `gap-5` | unchanged |
| Heading block → section body | `gap-14` | **`gap-12`** |
| Two-column split (base → lg) | `gap-12 lg:gap-16` | **`gap-10 lg:gap-16`** |
| Sibling major blocks in one Section | `gap-14` | **`gap-12`** |

> **Superseded by the 2026-08-13 whitespace pass.** The unification this item performed still
> stands — one value per structural role, applied everywhere — and that is the part that mattered.
> Only the *magnitudes* changed. Two reasons: `gap-14` and `gap-7` are not on the 4px scale that
> `02` §4 defines (it has 12 and 16 but no 14, 6 and 8 but no 7), so this table standardised the
> site onto two off-scale values; and with `.section-y` retuned ~35% tighter, a 56px header gap no
> longer sat in proportion to its own section's padding. The judgement call below on `gap-7` was
> re-decided for the same reason — `hero.tsx`, `final-cta.tsx` and `not-found.tsx` are now `gap-6`.
> Current spec: `02` §4. Change log: `MASTER_PROGRESS.md`, 2026-08-13.

**Deviations to correct (14):** `solutions.tsx:14`, `testimonials.tsx:20`, `roi.tsx:9`, `faq.tsx:27`
(→ `gap-14`); `permissions.tsx:16` (→ `gap-12 lg:gap-16`); `permissions.tsx:17` (→ `gap-5`);
`about:43`, `pricing:32` (→ `gap-14`); `roi/page:29`, `legal:46`, `demo:36`, `demo:51`, `demo:67`,
`changelog:33`, `page-template:286` (→ `gap-14`).

> **Judgement call within this item:** `hero.tsx:36` / `final-cta.tsx:19` / `not-found.tsx:10` at
> `gap-7` and `PageHero` at `gap-6`. These are display-type contexts where the type itself is much
> larger, so a proportionally larger gap is defensible. **Recommend leaving them** and documenting
> `gap-7` as the display-scale variant rather than flattening everything to `gap-5`.

---

### 🟠 A6 — CERTAIN — `width="wide"` on two text-only sections

`Container width="wide"` is `max-w-[90rem]` (1440px);
[primitives.tsx:24-28](../src/components/site/primitives.tsx#L24-L28).

| File:line | Contents | Problem |
|---|---|---|
| [careers/page.tsx:28](../src/app/company/careers/page.tsx#L28) | Two prose blocks capped at `max-w-[min(68ch,100%)]` and `max-w-[min(62ch,100%)]`, plus one mailto link. **Nothing else.** | A 90rem container holding a 68ch column. The prose hugs the far-left of a 1440px field; the h2s float in whitespace with no right-hand content to balance them. |
| [demo/page.tsx:67](../src/app/demo/page.tsx#L67) | `<h2>` + one `max-w-[min(68ch,100%)]` paragraph + `<SampleDataNote>` | Same. The two sections above it are legitimately wide (cluster switcher, permission matrix); this third one is a closing note and inherits `wide` by copy-paste. |

The `max-w-[min(Nch,100%)]` caps mean **the measure itself is not over-long** — the bug is the
asymmetric field around it, not line length. Worth stating precisely because it changes the fix.

**Proposed fix.** Both → `<Container>` (default, `max-w-[75rem]`). Not `prose`: `careers` still wants
its heading hierarchy to sit on the same left edge as the rest of the site's `default` pages, and
dropping to 68ch would misalign it against `PageHero` above, which is `wide`.

> ⚠️ **PageHero is `width="wide"`** ([page-template.tsx:110](../src/components/page/page-template.tsx#L110)).
> Any body `Container` narrower than `wide` creates a left-edge step between hero and body. This is
> **already true today** on `/faq`, `/legal/*` and `/resources/changelog`, which use default-width
> bodies under a wide hero. Worth confirming in screenshots before changing more pages — see
> "Needs a human decision", item 3.

---

### 🟡 A7 — JUDGEMENT — `width="wide"` on four mixed-content sections

Defensible, listed for completeness; **recommend leaving all four**.

| File:line | Why it's borderline | Recommendation |
|---|---|---|
| [about/page.tsx:43](../src/app/company/about/page.tsx#L43) | 3 of 5 blocks are 68ch prose; 2 are grids (`grid-cols-4` stats, `grid-cols-2` principles) | **Leave.** The 4-up stat row needs the width. |
| [contact/page.tsx:50](../src/app/company/contact/page.tsx#L50) | `6fr/5fr` split — the form gets ~48rem, wide for input fields | **Leave.** Two-column split justifies `wide`; narrow the form's own `max-w` instead if it looks wrong in screenshots. |
| [roi/page.tsx:29](../src/app/roi/page.tsx#L29) | Calculator + 2-col grid + a centred 68ch paragraph | **Leave.** |
| [blog/page.tsx:32](../src/app/resources/blog/page.tsx#L32) | 3-col grid when populated; currently renders only a 62ch empty-state card | **Leave.** Correct for the populated state, which is the state that matters. |

---

### 🟡 A8 — JUDGEMENT — `mt-12` and `py-12 lg:py-16` inside the page template

- [page-template.tsx:368](../src/components/page/page-template.tsx#L368) — `mt-12` on the scope note.
- [page-template.tsx:189](../src/components/page/page-template.tsx#L189) — `py-12 lg:py-16` on each
  content block.
- [footer.tsx:11](../src/components/site/footer.tsx#L11) — `py-16 lg:py-20`;
  [:42](../src/components/site/footer.tsx#L42) — `mt-14 pt-8`.

These are *intra*-section rhythm, not section rhythm, so `.section-y` is genuinely the wrong tool.
**Recommend leaving all of them.** Flagged only so a future reader does not mistake the omission for
an oversight. If intra-block rhythm is ever tokenised, these are the four call sites.

---

# B. CONTENT

## 🔴 B1 — CERTAIN — Seven homepage sections keep copy inline in JSX

`CLAUDE.md` and `docs/11 §5`: *"content/ — typed copy + data modules — no copy lives in JSX."*

| Section | File:line | Copy hardcoded in the component |
|---|---|---|
| Architecture | [architecture.tsx:41-49](../src/components/sections/architecture.tsx#L41-L49) | eyebrow "The platform", headline "One gateway. Thirty services. Six clusters you actually care about.", 3-line description |
| Clusters | [clusters.tsx:11-18](../src/components/sections/clusters.tsx#L11-L18) | eyebrow "Behind each link", headline, 2-sentence description |
| Security | [security.tsx:22-29](../src/components/sections/security.tsx#L22-L29) | eyebrow, headline "Security you can verify, not just read about.", description |
| Solutions | [solutions.tsx:16-17](../src/components/sections/solutions.tsx#L16-L17) | eyebrow, headline "Find the version of this that fits you." |
| Faq | [faq.tsx:31-32](../src/components/sections/faq.tsx#L31-L32) | eyebrow "Before you ask", title "The questions that actually decide this." |
| Roi | [roi.tsx:13-15](../src/components/sections/roi.tsx#L13-L15) | eyebrow, title, description |
| Testimonials | [testimonials.tsx:24-25](../src/components/sections/testimonials.tsx#L24-L25) | eyebrow, title |

Plus [proof-band.tsx:64-74](../src/components/sections/proof-band.tsx#L64-L74) — the "We are early…"
footnote.

**Why it's a problem.** Not a style preference — it is the **root cause of B2**. Four of these seven
headlines are duplicated verbatim with their own destination page, and that survived review precisely
because a copy reviewer reading `src/content/homepage.ts` cannot see them. It also means
`check:content`'s vocabulary rules run against rendered HTML only, with no reviewable source of truth.

**Proposed fix.** Move all eight into `src/content/homepage.ts` as `architecture`, `clusters`,
`security`, `solutionsIntro`, `faqIntro`, `roiIntro`, `testimonialsIntro`, `proofBand`, matching the
existing shape of `hero` / `chain` / `problem`. Pure refactor — **zero rendered-output change**, so it
should be its own commit and can be verified by diffing rendered HTML before and after.

---

## 🔴 B2 — CERTAIN — Four homepage headlines are word-for-word identical to their destination page

Exactly the pattern the brief asked about.

**B2.1 — Security.** Identical.

> Homepage [security.tsx:23-25](../src/components/sections/security.tsx#L23-L25):
> `Security you can verify, not just read about.`
>
> Destination [security/page.tsx:56](../src/app/security/page.tsx#L56):
> `title="Security you can verify, not just read about."`

**B2.2 — FAQ.** Identical.

> Homepage [faq.tsx:32](../src/components/sections/faq.tsx#L32): `The questions that actually decide this.`
>
> Destination [faq/page.tsx:38](../src/app/faq/page.tsx#L38): `The questions that actually decide this.`

**B2.3 — Solutions.** Near-identical (three words differ).

> Homepage [solutions.tsx:17](../src/components/sections/solutions.tsx#L17): `Find the version of this that fits you.`
>
> Destination [solutions/page.tsx:24](../src/app/solutions/page.tsx#L24): `Find the version of this written for you.`
>
> …and the destination repeats *itself* at [solutions/page.tsx:12](../src/app/solutions/page.tsx#L12)
> (metadata description) — the same sentence three times across two pages.

**B2.4 — The six security control cards render twice, from the same array.**

> Homepage [security.tsx:32-45](../src/components/sections/security.tsx#L32-L45) maps
> `SECURITY_CONTROLS` into six cards.
> Destination [security/page.tsx:69-81](../src/app/security/page.tsx#L69-L81) maps **the same
> `SECURITY_CONTROLS`** into six cards with the same `area` + `statement` shape.
>
> `COMPLIANCE_STATEMENT` also renders on both — [security.tsx:60](../src/components/sections/security.tsx#L60)
> and [security/page.tsx:153](../src/app/security/page.tsx#L153).

A visitor who clicks "See the security controls" arrives at a page whose first screen is the six cards
they just read, under the identical headline. The click delivered nothing.

**Why it's a problem.** Rule 9 — the homepage should *route* to depth, not pre-empt it. A duplicated
headline makes the destination feel like a failed navigation.

**Proposed fix.** Change the **homepage** side only; the destination pages are the canonical home for
this material and must keep their copy (rule 3 — the claims stay traceable).

- §13 Security headline → something that promises the page rather than replacing it. The section's
  own existing subhead already does this job: *"Six control areas, stated as mechanisms."*
- §13 Security card grid → cut from six cards to **three `area` labels** (Authorization, Audit,
  Isolation) as a teaser row; the full six stay on `/security`. Preserves the claim, removes the
  duplication.
- §18 FAQ heading → differentiate from `/faq` (e.g. lead with the count: "Six questions that decide
  this"), keeping `/faq` as written.
- §14 Solutions heading → differentiate; `/solutions` keeps "Find the version of this written for you."
- `/solutions` metadata at [:12](../src/app/solutions/page.tsx#L12) → stop repeating the H1 verbatim.

⚠️ **Constraint honoured:** none of this touches `COMPLIANCE_STATEMENT`, the "SOC 2-ready
architecture" wording, or `CERTIFICATIONS` gating.

---

## 🔴 B3 — CERTAIN — All four homepage permission bullets are restatements of `/security/permissions`

The homepage's §8 is the wedge, so this overlap is the most consequential.

| Homepage `permissions.points` | Destination |
|---|---|
| [homepage.ts:184](../src/content/homepage.ts#L184) `One catalog, one convention: module.resource.action, with wildcard expansion.` | [pages-security.ts:41](../src/content/pages-security.ts#L41) block title `One catalog, one convention` + [:42](../src/content/pages-security.ts#L42) `Permissions are keys of the form module.resource.action` + [:45](../src/content/pages-security.ts#L45) `Wildcard expansion at check time` |
| [homepage.ts:185](../src/content/homepage.ts#L185) `Per-user grants and denies, with an expiry date. Deny always wins.` | [pages-security.ts:68](../src/content/pages-security.ts#L68) `Per-user ALLOW and DENY overrides, each with an optional expiry date` + [:77](../src/content/pages-security.ts#L77) `Deny always wins` |
| [homepage.ts:186](../src/content/homepage.ts#L186) `Out-of-office delegation, so an absent approver does not stall the chain.` | [pages-security.ts:69](../src/content/pages-security.ts#L69) `Out-of-office delegation, bounded by a start and end time` |
| [homepage.ts:187](../src/content/homepage.ts#L187) `Scoped assignments: global, org-unit, or a single record.` | [pages-security.ts:71](../src/content/pages-security.ts#L71) `Scoped assignments: global, org unit, or a single record` — **verbatim but for one hyphen** |

Two more in the same section:

| Homepage | Destination |
|---|---|
| [homepage.ts:189](../src/content/homepage.ts#L189) `The interface gates on the same permissions — but as a convenience, not a boundary. We are explicit about that because a vendor who is vague about it usually has something to be vague about.` | [pages-security.ts:32](../src/content/pages-security.ts#L32) `The interface gates on the same permissions, but that gating is a convenience, not a security boundary — and we say so plainly, because a vendor who is vague about this usually has a reason.` |
| [homepage.ts:113](../src/content/homepage.ts#L113) `Every step is a permission check and an audit entry. That is why the number at the end can be trusted` | [pages-security.ts:21](../src/content/pages-security.ts#L21) `Every step is permission-checked in the service, not in the browser. That is why the number at the end of the chain can be defended.` |
| [homepage.ts:182](../src/content/homepage.ts#L182) `A chain is only worth as much as the approvals along it.` | [pages-security.ts:18](../src/content/pages-security.ts#L18) `a chain is worth exactly as much as those approvals are` |

**Why it's a problem.** Seven overlaps in one section pair, one of them verbatim. The homepage
section is *supposed* to be the teaser for the deepest page on the site; instead it delivers the same
four facts in shorter words, so the page it links to has nothing new in its first screen.

**Proposed fix.** Keep §8 Permissions — it is the wedge and must stay. Cut `permissions.points` from
four bullets to **two**, keeping the two that are genuinely differentiating and least duplicated
(*"Per-user grants and denies, with an expiry date. Deny always wins."* and *"Out-of-office
delegation, so an absent approver does not stall the chain."*). Drop the two that are near-verbatim
restatements of the destination's own block titles.

Rewrite `permissions.note` ([homepage.ts:189](../src/content/homepage.ts#L189)) so it does not
reproduce the destination's rhetorical move — or cut it, since
[pages-security.ts:32](../src/content/pages-security.ts#L32) states it better and at the right depth.

⚠️ **Rule 3 check:** every capability cut here remains stated in full on `/security/permissions`, one
click away, and the homepage section still links there at
[permissions.tsx:40-46](../src/components/sections/permissions.tsx#L40-L46). No claim loses its
evidence.

---

## 🟠 B4 — CERTAIN — §5 Thesis is §4 Problem, restated as a table

Rule 9 — one idea per section. These two adjacent sections carry **one** idea between them.

| §4 Problem `items` | §5 Thesis `rows` — `before` column |
|---|---|
| [homepage.ts:121](../src/content/homepage.ts#L121) "Sales closes and emails delivery" — *"The client gets typed in again, slightly differently."* | [homepage.ts:148](../src/content/homepage.ts#L148) Deal → project: *"An email and a re-typed client"* |
| [homepage.ts:125](../src/content/homepage.ts#L125) "Delivery staffs from a stale picture" — *"The resourcing spreadsheet does not know who booked leave"* | [homepage.ts:153](../src/content/homepage.ts#L153) Resourcing: *"A spreadsheet that does not know about leave"* |
| [homepage.ts:129](../src/content/homepage.ts#L129) "Timesheets arrive in four channels" — *"Approval means chasing rather than deciding."* | [homepage.ts:158](../src/content/homepage.ts#L158) Approvals: *"Four inboxes and a chase"* |
| [homepage.ts:133](../src/content/homepage.ts#L133) "Finance rebuilds the month by hand" — *"Export, merge, reconcile, query the differences"* | [homepage.ts:163](../src/content/homepage.ts#L163) Hours → invoice: *"Export, merge, reconcile"* |

**All four** Problem items reappear as the `before` column of Thesis, in compressed form. Thesis adds
two genuinely new rows (Audit, Offboarding). The visitor reads the same four failures twice, ~500px
apart, with a diagram in between.

**Why it's a problem.** This is the strongest redundant-section finding on the site, and it sits in
the narrative's most fragile stretch — the beats where a skimmer decides whether to keep scrolling.

**Proposed fix — two options, both preserve every claim.** *Recommend option A.*

- **Option A (lower risk):** keep both sections, cut the four duplicated rows from `thesis.rows`,
  leaving **Audit** and **Offboarding** — the two that Problem does *not* cover — plus one summary
  row. Thesis becomes the "and here is what else changes" beat instead of a recap. Removes ~4 rows of
  reading with no capability lost (all four are still stated in §4 and, in resolved form, in §3 Chain).
- **Option B (higher risk, better page):** cut §4 Problem's `items` list to two, keep `conclusion`, and
  let Thesis's before/after table carry the failure catalogue. Fewer sections, one idea each. Larger
  copy change; would want a fresh copy review.

**Needs your call — see "Needs a human decision", item 1.**

---

## 🟠 B5 — CERTAIN — §7 Clusters and §5/6 Architecture both enumerate the same six clusters

Both render `CLUSTERS` ([clusters.ts:33](../src/content/clusters.ts#L33)), adjacently:

- [clusters.tsx:22](../src/components/sections/clusters.tsx#L22) → `ClusterSwitcher`
  ([cluster-switcher.tsx:55](../src/components/interactive/cluster-switcher.tsx#L55)) maps all six to
  tabs, showing `name` + `valueProp` + `modules` + `chain` + `permissions` + a link to `cluster.href`.
- [architecture.tsx:104-139](../src/components/sections/architecture.tsx#L104-L139) maps **the same
  six** to cards showing `name` + `valueProp` + first 3 `services`, each linking to the same
  `cluster.href`.

So `cluster.name`, `cluster.valueProp` and `cluster.href` render **twice, back to back**.

**Why it's a problem.** Rule 9. The clusters get two consecutive sections; the second adds only
`services` and the gateway/spine framing. It also doubles the number of links to the same six
destinations within one screen, which dilutes each.

**Proposed fix — judgement, recommend the conservative one.** Keep both sections (Architecture's real
idea is the *gateway + spine*, which is not duplicated), but drop `valueProp` from the Architecture
cluster cards ([architecture.tsx:118-120](../src/components/sections/architecture.tsx#L118-L120)),
leaving `name` + service chips. The card becomes an architecture node rather than a second product
pitch, and §7 keeps sole ownership of "what each cluster is for".

---

## 🟠 B6 — CERTAIN — The "no native app" disclaimer appears three times

| Location | Text |
|---|---|
| Homepage §11 [homepage.ts:234](../src/content/homepage.ts#L234) | `No native app store download, because there isn't one. There is a fast web app that works offline for reads and installs to a home screen.` |
| `/platform/mobile` intro [pages-platform.ts:266](../src/content/pages-platform.ts#L266) | `…there is no native app, and there is a fast web app that works on every device your team already carries.` |
| `/platform/mobile` block "What this is not" [pages-platform.ts:296](../src/content/pages-platform.ts#L296) | `There is no native iOS or Android application, no App Store or Play Store listing…` |

Also duplicated within `homepage.ts` itself: `devices.sub`
([:233](../src/content/homepage.ts#L233)) already says *"plus an installable PWA"*, and
`devices.honesty` ([:234](../src/content/homepage.ts#L234)) then says *"installs to a home screen"*.

**Proposed fix.** Cut `devices.honesty` from the homepage; `devices.sub` already carries the honest
claim ("Responsive web on every modern browser, plus an installable PWA"), and the full disclaimer
lives twice on `/platform/mobile`.

⚠️ **Rule 1 / rule 3 check:** this *removes* a disclaimer, so it needs care. The homepage would still
make **no native-app claim** — `devices.sub` says "responsive web … plus an installable PWA", which is
accurate and complete. The explicit negation stays on the destination page. **If you would rather
keep the negation on the homepage, say so and I will cut the redundant clause from `devices.sub`
instead.** Also removes the JSX at [devices.tsx:44-46](../src/components/sections/devices.tsx#L44-L46).

---

## 🟠 B7 — CERTAIN — "We are early / no logo wall" appears on the homepage and `/company/about`

| Location | Text |
|---|---|
| Homepage [proof-band.tsx:65-66](../src/components/sections/proof-band.tsx#L65-L66) | `We are early, and we would rather show you the engineering than a logo wall we haven't earned yet.` |
| `/company/about` [about/page.tsx:106-109](../src/app/company/about/page.tsx#L106-L109) | `We are early. There is no logo wall on this site because we have not earned one yet, and inventing one would contradict the second principle below on the day we published it.` |

Both sit directly under a render of the **same** `PLATFORM_FACTS` array
([site.ts:165](../src/content/site.ts#L165)) — [proof-band.tsx:50](../src/components/sections/proof-band.tsx#L50)
and [about/page.tsx:93](../src/app/company/about/page.tsx#L93). Same four stats, same caveat, two pages.

**Secondary bug in the same sentence:** *"the second principle below"* is a positional reference into a
`sm:grid-cols-2` grid ([about/page.tsx:114](../src/app/company/about/page.tsx#L114)). "Second" is
ambiguous in a 2-column grid and wrong if `PRINCIPLES` is ever reordered.

**Proposed fix.** Keep the homepage version (it is load-bearing there — it explains an absent logo
wall in the trust slot). On `/company/about`, cut the duplicated caveat and replace the positional
reference with the principle's name: *"…would contradict **'No fabricated data'** below."*

---

## 🟡 B8 — CERTAIN — Filler: sentences that survive deletion

| # | File:line | Text | Why it's filler |
|---|---|---|---|
| 1 | [clusters.tsx:16-18](../src/components/sections/clusters.tsx#L16-L18) | `The chain only works if every link is genuinely good on its own. Pick a cluster to see the modules it contains and where it connects to the rest.` | Sentence 1 restates the heading directly above it ("Each step in that chain is a full product, not a tab"). Sentence 2 is a UI instruction for a tab strip that is self-evident. **Cut both.** |
| 2 | [security.tsx:27](../src/components/sections/security.tsx#L27) | `Six control areas, stated as mechanisms.` | Describes the section's own structure; the six cards below demonstrate it. **Keep** — see B2, where this becomes the headline. |
| 3 | [roi/page.tsx:40-41](../src/app/roi/page.tsx#L40-L41) | `It is arithmetic you can check, not a model with a coefficient we chose.` | The preceding sentence already gives the full formula and the 40% discount. Pure rhetorical restatement. **Cut.** |
| 4 | [demo/page.tsx:27](../src/app/demo/page.tsx#L27) | `Both are below, both are interactive, and neither asks for your email address first.` | "Both are below" is navigational throat-clearing. The no-email point is already in the page `<title>` ([:9](../src/app/demo/page.tsx#L9)) and repeated again at [:31](../src/app/demo/page.tsx#L31). **Trim to the email clause.** |
| 5 | [about/page.tsx:59-62](../src/app/company/about/page.tsx#L59-L62) | `It is also why this website spends so much time on permissions. It is not a feature we are proud of; it is the structural decision the rest of the platform depends on.` | Meta-commentary about the website rather than the product. **Cut** — judgement, see below. |
| 6 | [pricing/page.tsx:97-99](../src/app/pricing/page.tsx#L97-L99) | `They are not being served right now, and we would rather show you nothing than a number this page invented.` | Only renders in the degraded state; the honesty *is* the point there. **Keep.** Listed so it isn't cut by mistake. |

**Recommend acting on 1, 3 and 4.** Item 5 is a judgement call — it is characteristic voice, and
`/company/about` is where voice is allowed to be expensive.

---

## 🟡 B9 — CERTAIN — Cross-content near-duplicates outside the homepage

From the shingle pass. Lower impact — different pages, different audiences — but worth a decision.

| Pair | Verdict |
|---|---|
| [homepage.ts:223](../src/content/homepage.ts#L223) `Scheduled delivery through the notification service` ↔ [pages-product.ts:318](../src/content/pages-product.ts#L318) — **verbatim** | Homepage §10 bullet vs its own destination `/product/intelligence`. **Cut from the homepage** — same pattern as B3. |
| [legal.ts:135](../src/content/legal.ts#L135) ↔ [pages-security.ts:247](../src/content/pages-security.ts#L247) `We will acknowledge within two business days` — verbatim | **Leave.** Two different disclosure contexts (accessibility vs security); each needs its own SLA statement. |
| [about/page.tsx:29](../src/app/company/about/page.tsx#L29) ↔ [pages-solutions.ts:372](../src/content/pages-solutions.ts#L372) — portability sentence, ~50% overlap | **Leave.** Different audiences (company story vs IT buyer). |
| [pages-product.ts:107](../src/content/pages-product.ts#L107) ↔ [pages-solutions.ts:255](../src/content/pages-solutions.ts#L255) `Project requests with a configurable approval chain` — verbatim | **Leave.** Two destination pages, neither linked from the other. |
| [pages-security.ts:194](../src/content/pages-security.ts#L194) ↔ [pages-solutions.ts:334](../src/content/pages-solutions.ts#L334) `Confirm you can leave with your data` — verbatim `jobs` entry | **Leave.** |
| [site.ts:82](../src/content/site.ts#L82) nav description ↔ [pages-platform.ts:308](../src/content/pages-platform.ts#L308) page title `Your brand, your domain, per tenant.` | **Leave — intentional.** A nav description matching its destination's H1 is good IA. |
| [homepage.ts:13](../src/content/homepage.ts#L13) `hero.sub` ↔ [site.ts:9](../src/content/site.ts#L9) `SITE.description` — ~85% overlap, both render on `/` | **Leave.** One is the H1 subhead, one is the meta description; consistency between them is deliberate and good for SEO. |

---

## 🔴 B10 — CERTAIN — Orphans: verified by grep, not assumption

Method: for every `export` in `src/content`, `src/lib`, `primitives.tsx` and `page-template.tsx`, a
full-tree grep for the identifier, excluding the defining file, then a second grep including it to
separate "used internally" from "genuinely dead".

### Genuinely dead — zero references anywhere, including their own file

| Symbol | File:line | Note |
|---|---|---|
| **`CONTACT`** | [site.ts:45](../src/content/site.ts#L45) | **The important one — see below.** |
| `Card` | [primitives.tsx:213](../src/components/site/primitives.tsx#L213) | A full styled component, never rendered. 27 lines. |
| `CASE_STUDIES` | [proof.ts:48](../src/content/proof.ts#L48) | Empty array; no component reads it, and there is no `hasCaseStudies()` to match `hasLogos()` / `hasTestimonials()`. |
| `CLUSTER_BY_ID` | [clusters.ts:135](../src/content/clusters.ts#L135) | Derived lookup map, never queried. |
| `DEMO_COMPANIES` | [demo-tenant.ts:22](../src/content/demo-tenant.ts#L22) | 3 records, 17 lines |
| `DEMO_PROJECTS` | [demo-tenant.ts:40](../src/content/demo-tenant.ts#L40) | 2 records, 12 lines |
| `DEMO_PEOPLE` | [demo-tenant.ts:59](../src/content/demo-tenant.ts#L59) | 7 records, 9 lines |

### 🔴 `CONTACT` is dead **while five components hardcode the addresses it holds**

`CONTACT` ([site.ts:45-51](../src/content/site.ts#L45-L51)) exists specifically to satisfy rule 12
— *"Never hardcode a domain or an email in a component."* It has zero importers. Meanwhile:

| File:line | Hardcoded |
|---|---|
| [careers/page.tsx:53](../src/app/company/careers/page.tsx#L53), [:56](../src/app/company/careers/page.tsx#L56) | `careers@algoryq.com` (twice — `href` and label) |
| [security/page.tsx:162](../src/app/security/page.tsx#L162), [:165](../src/app/security/page.tsx#L165) | `security@algoryq.com` (twice) |
| [contact/page.tsx:35](../src/app/company/contact/page.tsx#L35) | `security@algoryq.com` in prose |
| [api/contact/route.ts:15](../src/app/api/contact/route.ts#L15) | `hello@algoryq.com` |
| [legal.ts:61](../src/content/legal.ts#L61), [:135](../src/content/legal.ts#L135) | `privacy@algoryq.com`, `accessibility@algoryq.com` |
| [pages-security.ts:245](../src/content/pages-security.ts#L245) | `security@algoryq.com` |

Eight literals across seven files, all duplicating a constant written to prevent exactly this. A
domain change breaks the site in seven places while `CONTACT` stays correct and unused.

**Proposed fix.** Wire the four JSX call sites to `CONTACT`. Leave the `src/content/*.ts` occurrences
for a separate pass (they are inside prose sentences, so substitution changes the strings
`check:content` sees). Strictly this is outside "spacing + content reduction" — **flagging for your
call**, see "Needs a human decision", item 4.

### Dead *fields* on live objects

| Field | File | Note |
|---|---|---|
| `chain.links[].carries` and `.detail` | [homepage.ts:73-109](../src/content/homepage.ts#L73-L109) | **10 dead strings, ~1.4KB of prose.** [chain.tsx:14-17](../src/components/sections/chain.tsx#L14-L17) documents this as deliberate: cut from the card because "five columns of body copy at 1280px is a datasheet". |
| `APPS[].description`, `APPS[].port` | [demo-tenant.ts:70-102](../src/content/demo-tenant.ts#L70-L102) | [architecture.tsx:72-88](../src/components/sections/architecture.tsx#L72-L88) reads only `name`, `host`, `tone`. |

### Not orphans — flagged by the sweep, confirmed used

`CHAIN_STAGES`, `ChainStage`, `PageBlock`, `MIN_LOGOS`, `MIN_TESTIMONIALS`, `NavLink`, `NavGroup`,
`Cluster`, `FaqItem`, `LegalDoc`, `CapabilityGroup`, `Seo`, `Article`, `Release`, `CustomerLogo`,
`Testimonial`, `CaseStudy`, `Certification`, `DemoCompany`, `DemoPerson` — all used within their own
file or as exported type surface. **No component in `src/components/` is unrendered** except `Card`.

**Proposed fix.** Delete `Card`, `CLUSTER_BY_ID`, `CASE_STUDIES`, `DEMO_COMPANIES`, `DEMO_PROJECTS`,
`DEMO_PEOPLE`. **Keep** `chain.links[].carries`/`.detail` and `APPS[].description` — see B11.

---

## 🟡 B11 — JUDGEMENT — Dead content that is deliberately dead

Two of the orphans above are documented as intentional and I **recommend leaving them**:

- `chain.links[].carries` / `.detail` — [chain.tsx:14-17](../src/components/sections/chain.tsx#L14-L17)
  explains the removal and says the prose "is still true". It is the drafted material for the per-step
  detail that would land on the module pages. Deleting it destroys work that has a known destination.
- `proof.ts` empty arrays + interfaces — the entire gating mechanism. Correct as-is (rule 1).
  `CASE_STUDIES` is the exception: unlike `CUSTOMER_LOGOS` and `TESTIMONIALS`, nothing reads it and
  there is no `hasCaseStudies()`. It is scaffolding for `/customers`, which is deferred (B2/B3 in
  MASTER_PROGRESS). **Recommend keeping it** and adding a comment, rather than deleting scaffolding
  that a blocked milestone will need.

Revising B10: delete only **`Card`**, **`CLUSTER_BY_ID`**, and the three `DEMO_*` arrays.

---

## 🟡 B12 — JUDGEMENT — Structural observations, no action proposed

1. **`'use client'` outside `src/components/interactive/`.**
   [reveal.tsx:1](../src/components/site/reveal.tsx#L1) is a client component in `src/components/site/`,
   against the boundary rule in `CLAUDE.md`. It is imported by **30 files** — the most-used component
   after `primitives`. Moving it is a 30-file change with real regression surface and **no user-visible
   benefit**. Recommend amending the rule to name `reveal.tsx` as the one sanctioned exception, rather
   than moving it. **Out of scope for this task either way.**
2. **Section numbering in comments has drifted.**
   [architecture.tsx:9](../src/components/sections/architecture.tsx#L9) says "§5 Product introduction"
   but renders 7th; [problem.tsx:7](../src/components/sections/problem.tsx#L7) says "§3" but renders
   4th; [chain.tsx:8](../src/components/sections/chain.tsx#L8) says "§3" and renders 3rd. Two
   components claim §3. Cosmetic; cheap to fix alongside B1 if you want it.
3. **`docs/04-homepage-blueprint.md` specifies 20 sections; 18 exist and 17 render.** Not a defect —
   Testimonials correctly returns `null` — but the docs and code disagree on the count.

---

# Proposed work plan for Phase 2

Ordered by impact, one concern per commit, spacing and content never mixed.

| # | Commit | Type | Findings | Risk |
|---|---|---|---|---|
| 1 | Move inline section copy into `content/homepage.ts` | refactor | B1 | **None** — zero rendered change; verify by HTML diff |
| 2 | Replace raw section padding with `.section-y` / `.section-y-lg` | spacing | A2 | Low |
| 3 | Apply the single gap scale | spacing | A5, A4 | Low |
| 4 | Vary `size` and `tone`; break the §5–§7 run | spacing | A1, A3 | Low — visual, needs screenshots |
| 5 | Narrow two text-only containers | spacing | A6 | Low — needs screenshots (hero edge alignment) |
| 6 | De-duplicate homepage ↔ destination headlines | content | B2 | **Medium — needs approval** |
| 7 | Trim the permissions bullets | content | B3 | **Medium — rule 3 sensitive** |
| 8 | Resolve Problem/Thesis overlap | content | B4 | **Medium — needs your option A/B call** |
| 9 | Cut filler sentences | content | B8 (1, 3, 4) | Low |
| 10 | Drop duplicate mobile disclaimer + about caveat | content | B6, B7 | **Medium — rule 1 sensitive** |
| 11 | Delete `Card`, `CLUSTER_BY_ID`, `DEMO_*` | cleanup | B10 | Low |
| 12 | Trim Architecture cluster cards | content | B5 | Low |

Commits 1–5 and 9, 11, 12 I would proceed with on approval. **6, 7, 8, 10 touch claim-bearing copy
and I want explicit sign-off on each.**

---

# Needs a human decision

1. **B4 — Problem/Thesis overlap: option A or B?** A trims Thesis to its two novel rows (low risk).
   B restructures both sections (better page, larger copy change). **I recommend A.**
2. **B2 — new headlines for §13 Security, §18 FAQ, §14 Solutions.** I can draft replacements, but
   headline copy on the homepage is a positioning decision (`docs/01`), not a refactor. Do you want me
   to draft them for review, or will you supply them?
3. **A6 — hero/body left-edge alignment.** `PageHero` is `width="wide"`; narrowing a body container
   creates a visible step. This is **already the case** on `/faq`, `/legal/*` and
   `/resources/changelog`. Is that intentional? If it is a known defect I would rather fix the pattern
   once than propagate it to two more pages.
4. **B10 — `CONTACT` wiring.** Wiring the four hardcoded emails to the existing constant fixes a live
   rule-12 violation but is outside "spacing + content reduction". Include it, or leave it for a
   separate task?
5. **B6 — the mobile disclaimer.** Cutting `devices.honesty` removes an explicit honesty statement
   from the homepage. My reading is that `devices.sub` keeps the homepage fully accurate and the
   negation belongs on `/platform/mobile` — but rule 1 says an honest statement beats a tidy one, so
   this is yours to confirm.
6. **`docs/MASTER_PROGRESS.md`** has no entry for this workstream. Should Phase 2 add a change-log row
   and a `spacing-content-audit` line to the Documents table, per the rule-13 definition of done?

---

**Phase 1 complete. Nothing in `src/` has been modified. Awaiting approval before Phase 2.**
