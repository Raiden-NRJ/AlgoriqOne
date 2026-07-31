# 08 — Pricing, ROI & Conversion Architecture

**Depends on:** `03` (conversion lanes), `01` (objection map).
**Purpose:** the money pages, and the conversion discipline that applies site-wide.

---

## 1. `/pricing`

**Advantage we already have:** pricing is **live** — `getPlans()` reads active, public plans from
`billing-service` and sorts by `sortOrder` (`apps/marketing/src/lib/api.ts`). The pricing page cannot
drift from what the billing system will actually charge. Preserve that wiring exactly; it is rarer
than it sounds.

**Structure:**
1. **Header** — "Pricing that doesn't punish you for consolidating." Monthly/annual toggle showing the
   annual saving as a real computed figure from plan data, never a hardcoded "save 20%".
2. **Plan cards** — from live data. "Most popular" renders only if the plan record says so.
3. **What's in every plan** — the anti-tier-shaming block. SSO, audit logs, API access and the mobile
   experience should not be enterprise-tier hostages; if the plan data says otherwise, we change the
   plans or delete this block. **Verify against real plan data before shipping the claim.**
4. **Full comparison table** — every feature × every plan. Sticky header row and sticky first column;
   on mobile it collapses to one card per plan with the same rows (never a horizontally scrolling
   table on a phone). Rows are grouped by the six clusters.
5. **Per-module / license note** — feature flags and licenses are real, so "turn on the modules you
   need" is a truthful and attractive statement. Explain how it works.
6. **Self-hosting** — an honest line about the Compose/Helm path and what support looks like for it.
   This will be asked; answering it publicly saves sales cycles.
7. **Pricing FAQ** — billing cycle, seat definition, overages, what happens at trial end, cancellation,
   data export on cancellation. **The export answer is a selling point** — say it plainly.
8. **CTA band** — start free / talk to us.

**Degradation:** if `billing-service` is unreachable, render plan *names* and a "Talk to us" CTA. Never
a hardcoded price, never a broken grid. The existing loader already returns `[]` on failure — build
the UI for that path first, then the happy path.

**Anti-patterns, banned:** fake scarcity, countdown timers, "price increases soon", pre-checked
upsells, hidden per-seat minimums, an enterprise column that is only a "Contact us" button with no
information at all.

---

## 2. `/roi` — the calculator

**Purpose:** convert the consolidation thesis into the visitor's own currency.

**Inputs (all visitor-supplied, all editable):**
- Team size, split into sales / delivery / people-ops seats
- Current tools being replaced (multi-select from a list of categories) and their per-seat cost
- Average fully-loaded hourly cost of an employee
- Hours per month currently spent on reconciliation/reporting (with a conservative default, clearly
  labelled as an assumption)
- Approval cycle time today

**Outputs:**
- Direct licence saving (arithmetic — indisputable)
- Time recovered, valued at the visitor's own hourly figure
- Integration/maintenance cost avoided (only if the visitor enters a figure; **no default**)
- Payback period
- A shareable permalink encoding the inputs, and a PDF export

**Integrity rules — non-negotiable:**
1. Every assumption is visible and editable. No hidden multipliers.
2. Defaults sit at the **pessimistic** end of any plausible range.
3. The formula is shown. A CFO who can see the arithmetic trusts the arithmetic.
4. No "average customer sees X%" — we have no customer data. Saying so builds more trust than
   inventing a number.
5. Results are labelled an estimate based on the visitor's inputs, not a promise.
6. Email is **not** required to see the result. Gating the number behind a form is the single most
   common ROI-calculator mistake; it converts worse and reads as manipulative. Offer the PDF and the
   permalink as optional email captures *after* the result is visible.

---

## 3. Conversion architecture (site-wide)

### 3.1 CTA discipline
- One primary CTA per viewport. Ever.
- Primary is always `Start free`, except on `/security`, `/platform/architecture` and
  `/solutions/by-role/it`, where the technical lane's primary is `Read the architecture` /
  `View the API` — pushing a signup at a CISO mid-evaluation is a mismatch.
- Every page ends with a CTA band. No page is a dead end.
- Header CTA is persistent; mobile gets a `StickyCTA` after the hero, dismissible, with reserved body
  padding so it never covers content.

### 3.2 Forms
`LeadForm` extends the existing `contact-form.tsx`, which already posts to `/api/leads` → crm-service.

- **Progressive disclosure:** work email first. Everything else appears after it validates. A 7-field
  form above the fold is the highest-friction element on most B2B sites.
- Real-time inline validation, never on-blur-only, never a red wall on submit.
- Honeypot + timing check + rate limit. **No CAPTCHA** unless abuse is actually observed — it costs
  measurable conversion and is an accessibility burden.
- Success state is specific and useful: what happens next, when, and a link to something worth reading
  meanwhile. Never a bare "Thanks!".
- Failure state is honest and recoverable, with the submitted data preserved.
- Every field has a real `<label>`, correct `autocomplete`, and a described error via `aria-describedby`.
- Consent checkbox is unchecked by default, with a plain-language purpose statement (`/api/consent`
  already exists).

### 3.3 The demo path — `/demo`
The self-serve alternative to a sales call, and the direct answer to the brief's core goal.
A guided, five-scene interactive tour reusing the homepage §6 engine: pipeline → approval → project
chain → permissions → reports. Progress is saved to `localStorage`; the exit CTA is `Start free`.
No email required to start. Email is offered at the end, to save progress or receive a summary.

### 3.4 Friction audit
A recurring checklist run before each release:
- Can a visitor understand the product without clicking? (homepage §1–6)
- Can they see pricing without a form? (yes — hard requirement)
- Can they try it without talking to sales? (`/demo`, `Start free`)
- Can they evaluate security without an NDA? (`/security`)
- Can they get an ROI number without an email? (yes — hard requirement)
- Can they leave with our data? (export + API, stated on `/pricing` FAQ)

Every "no" is a conversion bug and is triaged as such.

## Completion Status

- [ ] `/pricing` on live plan data, degradation path built first
- [ ] Comparison table with mobile card collapse
- [ ] `/roi` calculator with visible formula, no email gate
- [ ] `LeadForm` progressive disclosure + accessible validation
- [ ] `/demo` guided tour
- [ ] CTA lane rules applied and verified page-by-page
- [ ] Friction audit checklist run
