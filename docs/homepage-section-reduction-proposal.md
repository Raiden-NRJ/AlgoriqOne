# Homepage Section Reduction — Proposal

> ## Status — partly executed 2026-08-10, under a constraint this document did not have
>
> The client approved a reduction but added a hard requirement: **every video stays.** That single
> constraint invalidates three of this document's four merges, because Hero, Problem, Intelligence
> and Developers each host one and therefore cannot be merged away or folded into a card.
>
> **What shipped: 16 rendered sections → 12.**
>
> | This document proposed | What shipped | Why it differs |
> |---|---|---|
> | Problem + Thesis fold **into Chain** (§3.1) | **Thesis folded into Problem** | Problem hosts `SystemArchVideo`. Folding it into Chain would have removed that video's home, so the merge ran the other way: Problem absorbed Thesis and kept the video. Problem's four `items` still became scannable lines, which was most of the density win. |
> | Clusters + Architecture merge (§3.2) | **Shipped as written** | No video involved. `sections/platform.tsx`. |
> | Capabilities + Intelligence + Devices + Developers → one 4-card block (§3.3) | **Only Capabilities + Devices merged** | Intelligence hosts `GraphVideo` and Developers hosts `TerminalVideo`. Both remain full sections. Devices became the fourth capability card. |
> | Solutions cut (§3.4) | **Shipped as written** | It also exposed a live defect — see below. |
>
> **Cutting Solutions orphaned a route, and revealed three already orphaned.** The premise in §3.4 —
> "all six destinations are already in the header mega-menu" — was **wrong**. The mega-menu listed
> five of the eight solutions pages, and a nav group with children renders as a `<button>` in
> `header.tsx`, so a group-level `href` is inert: nothing on the site linked to `/solutions` at all.
> That left the index plus `by-role/{hr,sales}` unreachable by crawl **before** this work, and
> removing the homepage section orphaned `by-role/delivery` as well. Fixed by adding
> "For delivery leaders" and "All solutions" to the Solutions nav group. The crawl went 45 → 48 URLs
> with **zero orphans**, so the site is better connected than before the section was cut.
>
> **Option D is now unreachable** and Option A is only partly reachable while the video requirement
> holds. The realistic floor with four videos in four separate sections is **11–12**, not 9.
>
> Superseded in practice by the change-log entry in `MASTER_PROGRESS.md` for 2026-08-10.

---

**Date:** 2026-08-10 · **Status:** 🟡 Written as a proposal, before the keep-all-videos constraint.
**Requested by:** the client — *"too many sections and too much content; make it closer to how
Zoho/HubSpot run their homepage."*
**Prerequisite:** Phase 2 of `spacing-content-audit.md` is landed. This proposal is written against
the post-Phase-2 homepage, not the one the audit described.

> **Binding constraint on everything below.** Rule 3 — *claims trace to code* — means a capability
> may move off the homepage but may never become unreachable. Every row in §3 names the destination
> that holds the claim in full, and every one of those destinations was checked against the content
> modules before this document was written. Rule 1 is untouched: nothing here adds a proof element,
> and no honesty statement is cut without its replacement being named.

---

## 1. Where the homepage is now

Phase 2 removed duplication but deliberately kept the section list intact. After it, the homepage
renders **16 sections** (17 declared; `Testimonials` correctly returns `null`):

| # | Section | Tone / size | Carries |
|---|---|---|---|
| 1 | Hero | aurora, `section-y-lg` | Positioning, CTAs, 3 micro-proofs, hero visual |
| 2 | Chain | tint, **lg** | 5 stages × module × service — the centrepiece |
| 3 | Problem | default | 4 failure items + conclusion |
| 4 | Thesis | tint | Before/after, 3 rows (was 6) |
| 5 | Clusters | default | ClusterSwitcher: 6 clusters × modules, chain, permissions |
| 6 | Architecture | subtle | 4 apps, gateway, 6 clusters × services, 8-service spine |
| 7 | Permissions | band, **lg** | The wedge + PermissionMatrix |
| 8 | Capabilities | default | 3 cards: workflows, custom fields, AI |
| 9 | Intelligence | tint | 5 reporting bullets |
| 10 | Devices | default | Responsive web + PWA |
| 11 | Developers | subtle | REST, SDK, webhooks, 10 standards, portability |
| 12 | Security | band, **lg** | 3 control teasers + compliance statement |
| 13 | Solutions | default | 6 routing links (3 industries, 3 roles) |
| — | ~~Testimonials~~ | — | Gated — renders nothing |
| 14 | Roi | tint | Interactive calculator |
| 15 | Faq | default | 6 questions |
| 16 | FinalCta | aurora, `section-y-lg` | The ask |

**The structural problem, stated precisely.** It is not 16 sections in the abstract — it is that
**§8–§13 are six consecutive "and we also have this" beats**. Capabilities, Intelligence, Devices,
Developers, Security and Solutions each open with a centred heading and a grid, and none of them
advances the argument; they enumerate. That stretch is the datasheet rule 9 exists to prevent, and
it is where a skimmer leaves.

A Zoho or HubSpot homepage handles exactly this material in **one** block — a card grid titled
something like "Explore the platform" — because the job of that part of the page is *routing*, not
*persuasion*. The persuasion happened above it.

---

## 2. The recommended shape — 9 sections

| # | Section | Status | Note |
|---|---|---|---|
| 1 | **Hero** | keep | Unchanged |
| 2 | **Chain** | keep + absorb | Becomes the "why" as well as the "what" — see §3.1 |
| 3 | **The platform** | **merge** Clusters + Architecture | §3.2 |
| 4 | **Permissions** | keep | The wedge. Non-negotiable (`docs/01` §3) |
| 5 | **What else it does** | **merge** Capabilities + Intelligence + Devices + Developers | §3.3 |
| 6 | **Security & trust** | keep | Already trimmed to 3 teasers in Phase 2 |
| 7 | **ROI** | keep | This is the pricing-teaser slot; the calculator is a real differentiator |
| 8 | **FAQ** | keep | Standard on both reference sites; genuine objection handling |
| 9 | **Final CTA** | keep | Unchanged |
| — | Testimonials | keep gated | Still renders `null`; unblocks the moment real quotes exist |

**16 → 9.** Seven sections removed as standalone beats; **zero capability claims removed from the
site**, and only one claim category moves off the homepage entirely (§3.3, all of it one click away).

### Why this ordering still tells the story

Hero states the promise → Chain shows it and names the cost of not having it → The platform proves
there is a real system underneath → Permissions proves it can be trusted → What else it does routes
the curious → Security clears procurement → ROI puts it in their currency → FAQ removes the last
objections → CTA asks. That is still the nine-beat spine from `docs/01` §8; no beat is lost, three
of them just stop having a section each.

---

## 3. The three merges, in detail

### 3.1 — Problem + Thesis fold into Chain as its lead-in

**Today:** §3 Problem is four failure cards plus a conclusion; §4 Thesis is a three-row before/after
table. Phase 2 already cut Thesis from six rows to three because four of them restated Problem.

**Proposed:** Chain keeps its five-stage centrepiece. Above it, `problem.conclusion` runs as the
section's own sub — *"A CRM stops at the closed deal. A PSA starts after it… somebody in your
business owns the gap manually, and that person is the integration."* Below the stages, the
three-row before/after table stays as the resolution.

| Claim today | After | Where it lives |
|---|---|---|
| `problem.items` ×4 (Sales emails delivery; stale resourcing; four timesheet channels; finance rebuilds the month) | **Cut from the homepage** | Not capability claims — they describe the visitor's current stack, not our product. Rule 3 does not attach. The same four failures are still stated on `/solutions/professional-services` and `/solutions/agencies`, and their *resolved* form is what the five Chain stages depict. |
| `problem.conclusion` | Kept, promoted to Chain's sub | Homepage |
| `thesis.rows` ×3 (Audit, Offboarding, summary) | Kept, below the stages | Homepage |
| `thesis.headline` / `sub` | Kept as the table's caption | Homepage |

**Saves 2 sections.** **Risk: medium** — this is the largest copy change in the proposal and it
removes the page's most emotional passage. It is also the change that most moves the page towards
the reference sites, neither of which spends a full section on the customer's pain.

**Alternative if you want the pain kept:** keep Problem as its own section and merge only Thesis into
Chain. That lands at **10 sections** instead of 9.

### 3.2 — Clusters + Architecture merge into "The platform"

**Today:** two adjacent sections that both enumerate the same six clusters from the same array.
Phase 2 (B5) already stripped `valueProp` from the Architecture cards to stop the second pitch, which
confirmed the diagnosis rather than fixing it — the sections are still 90% the same content.

**Proposed:** one section. The `ClusterSwitcher` stays as the body (it is the richer of the two — it
carries modules, the per-cluster chain and the permission keys). Architecture's genuinely distinct
material becomes a compact strip beneath it: the four apps, the gateway line, the eight-service
spine, and the existing link to `/platform/architecture`.

| Claim today | After | Where it lives |
|---|---|---|
| 6 clusters × name, valueProp, modules, chain, permissions | Kept (ClusterSwitcher) | Homepage + `/product/*` ×5 |
| 4 applications + hosts | Kept (strip) | Homepage + `/platform/architecture` |
| Gateway: validates JWT, strips spoofable headers, stamps tenant, rate limits, routes | Kept (strip) | Homepage + `/platform/architecture` |
| 8-service shared spine | Kept (strip) | Homepage + `/platform/architecture` |
| Per-cluster service chips (first 3 + overflow) | **Cut from the homepage** | `/product/{cluster}` lists every service in full |
| `architecture.srDescription` text equivalent | Kept, retargeted at the strip | Homepage |

**Saves 1 section.** **Risk: low** — everything except the service chips stays on the page, and the
chips are the one element the ClusterSwitcher already covers better.

### 3.3 — Capabilities + Intelligence + Devices + Developers merge into "What else it does"

This is the section-count win and the one that most changes how the page reads.

**Proposed:** a single section, four cards, each a capability area with a one-line statement and a
link to the page that owns it. No section headings, no per-area grids, no code sample, no device
frames, no bar chart.

| Card | Absorbs | Destination that holds the full claim |
|---|---|---|
| **Automation, fields and AI** | §8 Capabilities (3 cards) | `/platform/workflows`, `/platform/customization`, `/platform/ai` |
| **Reporting you can schedule** | §9 Intelligence (5 bullets) | `/product/intelligence` — verified: report builder, scheduled delivery via notification service, per-widget dashboard permissions, CSV export, cursor pagination are all stated there |
| **Works on the devices they carry** | §10 Devices | `/platform/mobile` — responsive-by-breakpoint, PWA, and the explicit "no native app" negation, stated twice |
| **Open API, your data** | §11 Developers | `/developers`, `/developers/api`, `/developers/webhooks`, `/developers/integrations`; portability is on `/platform/architecture` §portability |

**What actually leaves the homepage,** stated honestly:

- The **10-item standards list** (REST, OAuth 2.0/OIDC, SAML, SCIM v2, HMAC webhooks, Prometheus,
  OpenTelemetry, S3-compatible, SMTP, PostgreSQL) and its honesty note *"Standards we implement —
  not partner logos."* → `pages-developers.ts` §standards carries the identical list **and** a
  stronger version of the note: *"These are protocols and standards implemented in the platform —
  not partner integrations, and not logos we have borrowed."* **Rule 1 is safe** — the anti-fake-logo
  disclaimer survives at its destination, and the homepage will no longer show anything that could be
  mistaken for a partner wall, so the disclaimer has nothing left to disclaim.
- The **TypeScript SDK code sample**. Nothing else on the site shows code on the homepage; the sample
  is reproduced on `/developers/api`.
- The **three device frames** and the **report miniature**. Both are illustrations, not claims.
- The **portability paragraph** → `/platform/architecture` §portability, verbatim in substance.

**Saves 3 sections.** **Risk: medium** — four sections' worth of proof becomes four cards, so the
homepage asserts less and links more. That is precisely the Zoho/HubSpot trade and precisely what
the client asked for, but it is a positioning decision, not a refactor, which is why it is here
rather than in a commit.

### 3.4 — Solutions is cut outright

**Today:** §13 is six links with no body copy — a pure routing section.

**Proposed:** delete it. All six destinations are already in the header mega-menu under *Solutions*,
which is present on every route including the homepage, and `/solutions` is one click from there.
A section whose entire content is duplicated navigation is the cheapest section on the page to lose.

| Claim today | After | Where it lives |
|---|---|---|
| 3 industries + 3 roles, each linking to its page | **Cut from the homepage** | Header mega-menu (every route) + `/solutions` index + footer |

**Saves 1 section.** **Risk: low.** The only cost is a homepage-to-solutions conversion path for a
visitor who never opens the nav; if that matters, the six links can be appended to the Final CTA
section as a one-line "Built for: …" row at no section cost.

---

## 4. What is deliberately *not* cut, and why

| Section | Why it stays |
|---|---|
| **Chain** | The centrepiece and the chosen wedge (`MASTER_PROGRESS` decision, 2026-07-31). Cutting it would undo the positioning decision, not tighten the page. |
| **Permissions** | The deepest moat and the reason the chain's numbers can be defended. `docs/01` §3 demotes it from headline to proof layer — proof layer still means a section. |
| **Security** | Procurement is a real gate for this buyer, and Phase 2 already reduced it to three teasers. |
| **ROI** | The reference sites' "pricing teaser" slot. Ours is better than a pricing teaser because it is interactive and takes no email. |
| **FAQ** | Both reference sites carry one; it handles the six objections that block deals (`docs/01` §10). |
| **Testimonials (gated)** | Costs nothing — renders `null` — and is the mechanism that stops a fake quote shipping (rule 1). Leave the gate in place. |

---

## 5. Answers to the three candidates the brief raised

1. **"Can Capabilities fold into Architecture or Clusters?"** — Not into either. Capabilities is
   *"it bends to your process"*; Clusters and Architecture are *"here is what exists"*. Folding it
   there would put a mutable-configuration argument inside a system diagram. It folds naturally into
   the new §5 instead, alongside the other three "and also" beats — see §3.3.
2. **"Is Devices (mobile/PWA) homepage-worthy?"** — As a full section with three device frames, no.
   As a card, yes — *"approvals and timesheets happen away from a desk"* is a real buying reason for
   a services business, and it is the one line of the section that earns its place. `/platform/mobile`
   keeps the detail and both copies of the no-native-app negation.
3. **"Does Developers need a section, or just a nav link?"** — More than a nav link, less than a
   section. "You own your data and can extend anything" answers a lock-in objection that a CTO
   raises before signing; burying it in nav loses that. A card with the portability line and a link
   to `/developers` keeps the answer visible at a tenth of the height.

---

## 6. Options summary — pick one

| Option | Sections | What differs from the recommendation | Risk |
|---|---|---|---|
| **A — recommended** | **9** | As written above | Medium |
| B — keep the pain | 10 | Problem stays a standalone section; only Thesis folds into Chain (§3.1 alternative) | Low–medium |
| C — conservative | 12 | Only §3.2 (Clusters+Architecture) and §3.4 (Solutions) land; §3.1 and §3.3 are deferred | Low |
| D — aggressive | 8 | A, plus FAQ moves entirely to `/faq` with a link from the Final CTA | Medium–high — FAQ is objection handling at the point of decision |

---

## 7. If Option A is approved, the execution order

One concern per commit, same discipline as Phase 2, verifying `typecheck` + `build` + `check:links`
+ `check:content` after each, and the full `audit` at the end:

1. Merge Clusters + Architecture (§3.2) — lowest risk, largest structural gain.
2. Cut Solutions (§3.4).
3. Merge Capabilities + Intelligence + Devices + Developers (§3.3).
4. Fold Problem + Thesis into Chain (§3.1) — highest copy risk, done last so it can be reverted alone.
5. Delete the orphaned section components and any content keys that lose their last reader.
6. Rewrite `docs/04-homepage-blueprint.md` against the new list — it currently specifies 20 sections
   and describes a page that no longer exists (it still names `apps/marketing` and the superseded
   "three systems, one permission model" positioning).
7. Re-run the full browser audit at 13 viewports and **read the screenshots** — three of the four
   merges change section adjacency, so the tone alternation needs checking by eye, not by table.

---

**Nothing in `src/` has been changed by this document.**
