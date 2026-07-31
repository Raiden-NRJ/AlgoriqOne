# 14 — Figma Deliverables

**Depends on:** `02` (tokens), `04`/`05` (page specs).
**Purpose:** the design-file deliverable, and the direction of truth between design and code.

---

## 1. The Figma file — analysed 2026-07-31

File: **RocketCRM Enterprise Suite** (`c0PVNJPrpbWm2bx8ewzyKc`), supplied by the user.

**What it actually is:** a one-page product-story deck, not a set of website designs. Four frames:

| Node | Frame | Contents |
|---|---|---|
| `3:2` | Cover | Brand mark (violet rounded-square "R"), wordmark, title, capability chips, a 6px violet accent bar, benchmark list (Salesforce · Zoho One · Jira · Workday · Dynamics 365) |
| `4:2` | Product Overview | The four applications with hosts and ports, and a paragraph describing the platform end-to-end |
| `4:26` | Demo Tenant Context | **The canonical demo dataset** — companies, projects, and seven named people with roles |
| `20:2` | Module Map | 13 suites grouped by app, colour-coded: portal (navy), admin (indigo), customer (teal), platform (violet) |

There are **no published Figma variables** (`get_variable_defs` returned `{}`), no component library,
and no page layouts. So it cannot serve as a design source for the site — but it is valuable for
three things, all of which have been adopted:

1. **Brand.** The violet mark and the accent bar are implemented in `src/components/site/logo.tsx`
   and the header. The brand hue matches the product system's `--primary` (hue 277), confirming the
   two were always meant to be the same family.
2. **Canonical demo data.** `src/content/demo-tenant.ts` now carries the Figma dataset verbatim —
   Nimbus Retail Group, Vertex Manufacturing, Orbit Health, Atlas CRM Rollout, Beacon Employee
   Experience, and the seven named people. **This replaced the "Northwind Consulting" fixture
   invented in `10-visual-assets-and-devices.md` §2**; that section should be read with these names
   substituted.
3. **The four-app framing**, used directly in the homepage architecture diagram.

### Reconciliation: one discrepancy

The Figma cover says **"24 microservices"**. The codebase has **30** (`ls services` — see `00` §1).
The Figma file is dated July 2026 and predates the later services. **Code wins**, per the rule below;
the site publishes 30.

**Decision (unchanged, now confirmed): code is the source of truth; Figma is a generated output.**
Design files drift from code within weeks — this file already had — while a design system with 269
spec files and CI-gated contrast checks does not. We generate the Figma library *from* the implemented
tokens and components, so the file is accurate on the day it is created.

---

## 2. Deliverable structure

One Figma project, four files:

### File 1 — `RocketCRM Web · Foundations`
- **Variables** imported from `website/docs/tokens.json` (`02` §9): color (light + dark modes as Figma
  variable modes), spacing, radius, elevation, duration, easing.
- Type styles for all ten scale steps, at three breakpoint modes (mobile/tablet/desktop) so fluid
  `clamp()` values are representable.
- Grid styles: 12/8/4 column layouts with correct gutters and margins.
- Effect styles: the five elevation levels, light and dark.
- Documentation frames: color usage rules, the contrast contract, the gradient vocabulary (`02` §2.7),
  the motion vocabulary (`09` §2).

### File 2 — `RocketCRM Web · Components`
Every component from `02` §8 as a Figma component set with variants matching the code props exactly
(`variant`, `size`, `state`). Auto Layout everywhere; no absolute positioning except in the hero
composition. Component descriptions carry the code import path so a developer can jump from a frame to
the file.

Hard rule: **if a variant exists in Figma it must exist in code, and vice versa.** A variant that
can't be built is a bug in the design file, not a request to the engineer.

### File 3 — `RocketCRM Web · Pages`
Full-fidelity designs at three breakpoints (390 / 768 / 1440) for:
homepage (all 20 sections) · the product-page template + all five clusters · the six platform pages ·
the four security pages · pricing · ROI · demo · solutions template · comparison template · blog index
and article · contact · about · 404 · footer/header states.

Both themes for the homepage, pricing, and all security pages. Every frame uses Auto Layout so
responsive intent is legible rather than implied.

### File 4 — `RocketCRM Web · Prototype`
A clickable prototype covering the three conversion lanes end-to-end (`03` §5): self-serve
(home → demo → signup), technical (home → architecture → security → API), enterprise (home → solutions
→ pricing → ROI → contact). Plus the mega-menu, mobile nav sheet, theme toggle, and the interactive
demo's five tabs as smart-animate transitions.

---

## 3. Developer annotations

Because code leads, annotations describe *deltas and intent*, not measurements (measurements come from
the code):
- Component name + import path on every instance.
- Content source: which `content/` module supplies the copy.
- Motion note referencing the `09` §2 pattern by name (e.g. "Rise, stagger 60ms").
- Responsive behaviour note where it isn't obvious from Auto Layout.
- A11y note on every interactive element: role, keyboard path, announcement.
- **"Not yet built" tags** on anything designed ahead of implementation, so nothing is mistaken for
  shipped.

---

## 4. Workflow & sync

1. Tokens are implemented in `apps/marketing/src/app/globals.css`, exported to
   `website/docs/tokens.json`, imported into Figma as variables. **Never edited in Figma first.**
2. Components are built in code with Storybook stories, then represented in Figma.
3. Page designs may be explored in Figma first — that's where composition thinking belongs — but the
   spec of record for what ships is `04`/`05`.
4. When the two disagree, code wins and the Figma file is corrected. Log the divergence.
5. **Code Connect** mappings link Figma components to their source files so the design file stays
   navigable from either direction.

**Regeneration cadence:** foundations file re-synced whenever tokens change; component file reviewed
each release; page files updated when a section's composition changes materially.

---

## 5. Scope honesty

Producing all four files at the fidelity described is a substantial design effort (multiple weeks of
dedicated design time), and it is **not on the critical path to shipping the website**. The site can
be built entirely from `02`, `04` and `05`, which are written as build specs, not mood boards.

Recommended sequencing (reflected in `17-implementation-roadmap.md`):
- **Phase 1 (with implementation):** File 1 (Foundations) and File 2 (Components) — these have direct
  engineering value as a shared reference.
- **Phase 2 (after launch):** File 3 (Pages), generated from the shipped site rather than drawn ahead
  of it, so it is accurate by construction.
- **Phase 3 (as needed):** File 4 (Prototype), primarily for stakeholder review and user testing.

Building 40+ page designs at three breakpoints *before* writing code would delay launch by weeks and
produce artifacts that are stale on arrival. That is the trade being made here, deliberately.

## Completion Status

- [x] Figma file supplied and analysed (2026-07-31); it is a product-story deck, not page designs
- [x] Brand mark + accent bar adopted in code
- [x] Canonical demo dataset adopted (`src/content/demo-tenant.ts`), superseding the invented fixture
- [x] "24 vs 30 services" discrepancy reconciled in favour of code
- [ ] `tokens.json` exported from implemented CSS
- [ ] File 1 — Foundations, with variable modes for light/dark and three breakpoints
- [ ] File 2 — Components, variants matching code props 1:1
- [ ] Code Connect mappings
- [ ] File 3 — Pages (post-launch)
- [ ] File 4 — Prototype (post-launch)
