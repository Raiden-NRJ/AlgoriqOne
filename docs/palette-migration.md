# Palette Migration — 8 hues → 3 (Ink · Blue · Sand)

**Date:** 2026-08-08 · **Approved by:** client · **Status:** Step 1 inventory (written before any edit)

Target: **INK** `#111826` `oklch(0.21 0.03 265)` · **BLUE** `#044CB6` `oklch(0.45 0.18 260)` ·
**SAND** `#F8F5EF` `oklch(0.972 0.009 85)`.

Blue and Ink are unchanged — the brand ramp (hue 259/260) and neutral ramp (hue 265) are not touched.
`CLAUDE.md` rule 12 still binds on the blue.

---

## 0. Blast radius at a glance

| Token | Hue | Usages in `src/` | Verdict |
|---|---|---|---|
| `--color-bg-warm` | 85 | **1** | → renamed `--color-sand-50`, promoted to a 6-step ramp |
| `--color-info` | 250 | **0** | **DELETE** — confirmed zero references |
| `--color-accent` | 200 | **6** (5 `var()` + 1 raw oklch + 1 favicon hex) | **DELETE** — each usage replaced individually |
| `--color-app-customer` | 200 | 1 | RE-HUE |
| `--color-app-platform` | 285 | 1 | RE-HUE |
| `--color-app-portal` | 265 | 1 | RE-HUE (for separability) |
| `--color-app-admin` | 260 | 1 | keep = brand-600 |
| `--color-danger` | 27 | **8** | SURVIVES, quarantined — 3 decorative usages move off |
| `--color-warning` | 70 | 3 | SURVIVES, quarantined — 0 move (all functional) |
| `--color-success` | 152 | 9 | SURVIVES, quarantined — 0 move (all product semantics / exempt) |
| `--color-success-band` | 152 | 1 | SURVIVES, quarantined — 0 move |

**Hue count before:** 259/260 (brand) · 265 (ink) · 85 (warm) · 200 (accent) · 200 (app-customer) ·
285 (app-platform) · 250 (info) · 152 (success) · 70 (warning) · 27 (danger) = **10 distinct hues**,
of which 8 are non-semantic.

**Hue count after:** 259/260 (blue) · 265 (ink) · 85 (sand) = **3 brand hues**, plus 152 / 70 / 27
quarantined to functional-only use.

---

## 1. `--color-bg-warm` → the sand ramp

Declared once, consumed once.

| File:line | Usage |
|---|---|
| [globals.css:67](../src/app/globals.css#L67) | `--color-bg-warm: oklch(0.972 0.009 85);` — declaration |
| [primitives.tsx:53](../src/components/site/primitives.tsx#L53) | `warm: 'bg-[var(--color-bg-warm)] border-y border-[var(--color-border)]'` — the `Section` tone map |

Reached by exactly one call site today:

| File:line | Usage |
|---|---|
| [chain.tsx:24](../src/components/sections/chain.tsx#L24) | `<Section id="chain" tone="warm" …>` |

**Plan.** Promote to a 6-step ramp using the supplied values verbatim. `--color-bg-warm` is deleted
and `primitives.tsx:53` repointed at `--color-sand-50`, with the border moving from
`--color-border` (cool, `neutral-200`) to `--color-sand-200` — that is the step the brief designates
"borders on sand". The `warm` tone **key name is kept** so no call site has to be renamed.

---

## 2. `--color-info` — zero usages, delete outright

| File:line | Usage |
|---|---|
| [globals.css:88](../src/app/globals.css#L88) | `--color-info: oklch(0.62 0.17 250);` — declaration only |

Grep across `src/` for `--color-info` returns **the declaration and nothing else**. The only other
mention anywhere is the prose in [02-design-system.md:111](02-design-system.md#L111), which is updated
as part of this task. Zero risk.

---

## 3. `--color-accent` — 6 usages, each decided individually

The brief says: *"Replace each usage with `--color-brand-400` or a sand tone, whichever reads
correctly in context. Show me each decision."*

| # | File:line | Current | Context | Decision |
|---|---|---|---|---|
| 1 | [chain-steps.tsx:349](../src/components/diagrams/chain-steps.tsx#L349) | `stopColor="var(--color-accent)" stopOpacity="0"` | Middle stop of the `chain-current` gradient | → `--color-brand-500`. **`stopOpacity` is `0` — this colour is literally invisible.** Matching the neighbouring stops is a no-op visually and removes a phantom dependency. |
| 2 | [chain-steps.tsx:350](../src/components/diagrams/chain-steps.tsx#L350) | same, `stopOpacity="0"` | same gradient | → `--color-brand-500`. Same reasoning. |
| 3 | [intelligence.tsx:77](../src/components/sections/intelligence.tsx#L77) | `bg-[var(--color-accent)]/45` | The **"Internal"** segment of the billable-utilisation bar chart | → `--color-brand-300`. This is a **data series**, so it must stay distinguishable from "Billable" (`brand-600`). `brand-300` L=0.822 vs `brand-600` L=0.45 is a large lightness separation within one hue. Sand rejected: sand is a surface family, never a data accent. |
| 4 | [intelligence.tsx:91](../src/components/sections/intelligence.tsx#L91) | `bg-[var(--color-accent)]/45` | Legend swatch for the same series | → `--color-brand-300`. Must match #3 exactly or the legend lies. |
| 5 | [header.tsx:82](../src/components/site/header.tsx#L82) | `to-[var(--color-accent)]` in `from-brand-600 via-brand-400 to-accent` | The 4px brand accent bar under the header, `aria-hidden` | → `--color-brand-300`. Keeps a three-stop blue ramp that still reads as a gradient rather than a flat bar. Sand rejected: a blue→sand gradient goes muddy through the olive midpoint. |
| 6 | [globals.css:222](../src/app/globals.css#L222) | `oklch(0.72 0.14 200 / 0.07)` — **raw literal, not a `var()`** | Second radial of `.bg-aurora`, behind hero / final CTA / page heroes / 404 | → sand. **This is the one that grep for `--color-accent` misses** and the reason the inventory was worth doing. Becomes `oklch(0.900 0.030 85 / 0.45)` (sand-200). Alpha rises from 0.07 → 0.45 because sand's chroma is 0.030 against cyan's 0.14 — at 0.07 it would be invisible. **Verify in screenshots.** |
| 7 | [icon.svg:28-29](../src/app/icon.svg#L28-L29) | `#00BEC7` → `#9FF0F4` hex | Favicon crossbar | → sand `#D8C9AA` → `#F2ECE0`. **See §3.1 — this is a judgement call.** |

`.bg-aurora` is consumed at 5 call sites, so change #6 is the widest-reaching edit in this task:

| File:line |
|---|
| [hero.tsx:16](../src/components/sections/hero.tsx#L16) |
| [final-cta.tsx:16](../src/components/sections/final-cta.tsx#L16) |
| [page-template.tsx:108](../src/components/page/page-template.tsx#L108) (PageHero — ~40 routes) |
| [page-template.tsx:326](../src/components/page/page-template.tsx#L326) (CtaBand — ~40 routes) |
| [not-found.tsx:7](../src/app/not-found.tsx#L7) |

### 3.1 The favicon — flagged, not silently changed

[icon.svg](../src/app/icon.svg) paints its crossbar in the accent cyan as literal hex (an SVG served
as a static asset gets no CSS custom properties). Its own comment says the cyan is *"--color-accent,
the same hue the site already uses… so this reads as our palette rather than an arbitrary second
colour."*

Deleting `--color-accent` **invalidates that comment**. Leaving the file alone would make the favicon
the only cyan in a three-colour system — precisely the competing hue this task removes.

The favicon's job (per `MASTER_PROGRESS`) is to be non-confusable with the parent's at 16px:

| | Tile | Glyph | Bar |
|---|---|---|---|
| `algoryq.com` | ink | white | blue |
| Algoryq One, today | blue | white | **cyan** |
| Algoryq One, proposed | blue | white | **sand** |

Blue tile + sand bar is still unambiguously distinct from ink tile + blue bar. **Only the two `stop-color`
values change — no path `d` attribute is touched, so rule 12 holds.** `logo.tsx` is not modified.

---

## 4. App colours — re-hue onto blue + ink

Consumed only by the `APP_TONE` map in the architecture diagram, as 8px dots beside each app name:

| File:line | Token |
|---|---|
| [architecture.tsx:30](../src/components/sections/architecture.tsx#L30) | `portal: 'var(--color-app-portal)'` |
| [architecture.tsx:31](../src/components/sections/architecture.tsx#L31) | `admin: 'var(--color-app-admin)'` |
| [architecture.tsx:32](../src/components/sections/architecture.tsx#L32) | `customer: 'var(--color-app-customer)'` |
| [architecture.tsx:33](../src/components/sections/architecture.tsx#L33) | `platform: 'var(--color-app-platform)'` |

Rendered at [architecture.tsx:78-82](../src/components/sections/architecture.tsx#L78-L82) as
`size-2 rounded-full` with `style={{ backgroundColor: APP_TONE[app.tone] }}`, always paired with the
app's name in text.

**Are four separable on blue + ink alone? Yes — via lightness, which is what oklch makes reliable.**

| App | Was | Hue | Becomes | L | Separation |
|---|---|---|---|---|---|
| Portal | `oklch(0.42 0.12 265)` | 265 | `oklch(0.275 0.100 260)` = brand-900 | **0.275** | darkest |
| Admin | `oklch(0.45 0.18 260)` | 260 | `oklch(0.450 0.180 260)` = brand-600 — **unchanged** | **0.450** | +0.175 |
| Platform | `oklch(0.55 0.19 285)` ← violet | 285 | `oklch(0.545 0.019 265)` = neutral-500 (**ink**) | **0.545** | +0.095, *and* chroma 0.019 vs 0.180 — reads grey, not blue |
| Customer | `oklch(0.66 0.12 200)` ← cyan | 200 | `oklch(0.702 0.145 259)` = brand-400 | **0.702** | +0.157 |

Four values at L = 0.275 / 0.450 / 0.545 / 0.702 — minimum gap 0.095 in perceptual lightness, and the
one pair that is closest (Admin 0.450 / Platform 0.545) is additionally separated by a 9.5× chroma
difference. **No fifth hue invented.**

Accessibility note: the dots are decorative — every one sits next to its app name in text, so colour
is never the sole carrier of information (WCAG 1.4.1 satisfied independently of these values).

---

## 5. Semantic colours — quarantine audit

All four survive. Each usage classified against the permitted list: **form validation · error/empty
states · destructive confirmations · genuine status indicators**, plus the brief's explicit exemption
for `--color-success` marking a *settled* step in the chain diagram and hero wires.

### `--color-danger` — 8 usages, **3 move off**

| File:line | Usage | Classification | Action |
|---|---|---|---|
| [contact-form.tsx:179](../src/components/interactive/contact-form.tsx#L179) | consent field error text | form validation | ✅ keep |
| [contact-form.tsx:225](../src/components/interactive/contact-form.tsx#L225) | submit status when `error` | error state | ✅ keep |
| [contact-form.tsx:258](../src/components/interactive/contact-form.tsx#L258) | invalid field border | form validation | ✅ keep |
| [contact-form.tsx:291](../src/components/interactive/contact-form.tsx#L291) | field error message | form validation | ✅ keep |
| [problem.tsx:27](../src/components/sections/problem.tsx#L27) | `bg-[var(--color-danger)]/35` on a 2px rule beside each marketing "where it breaks" item | **DECORATIVE / MARKETING** | ❌ → `--color-border-strong` |
| [three-systems.tsx:57](../src/components/diagrams/three-systems.tsx#L57) | red dashed integration stroke | **MARKETING** — colouring a competitor diagram red | ❌ → `--color-sand-600` |
| [three-systems.tsx:65](../src/components/diagrams/three-systems.tsx#L65) | red dashed integration stroke | **MARKETING** | ❌ → `--color-sand-600` |
| [three-systems.tsx:84](../src/components/diagrams/three-systems.tsx#L84) | `border-danger/40 bg-danger/6` callout: "Three permission models. Three audit trails." | **MARKETING** — not an error the user can act on | ❌ → `--color-sand-200` border / `--color-sand-50` bg |

### `--color-warning` — 3 usages, **0 move**

| File:line | Usage | Classification |
|---|---|---|
| [legal/[doc]/page.tsx:49](../src/app/legal/[doc]/page.tsx#L49), [:52](../src/app/legal/[doc]/page.tsx#L52) | "plain-language summary, not a counsel-reviewed document" notice | ✅ genuine status/warning |
| [security/page.tsx:45](../src/app/security/page.tsx#L45) | `In progress` posture pill | ✅ genuine status indicator |

### `--color-success` — 9 usages, **0 move**

| File:line | Usage | Classification |
|---|---|---|
| [security/page.tsx:44](../src/app/security/page.tsx#L44) | `Implemented` posture pill | ✅ genuine status indicator |
| [contact-form.tsx:98](../src/components/interactive/contact-form.tsx#L98), [:99](../src/components/interactive/contact-form.tsx#L99) | submitted-successfully panel | ✅ form success state |
| [chain-steps.tsx:116](../src/components/diagrams/chain-steps.tsx#L116), [:193](../src/components/diagrams/chain-steps.tsx#L193), [:252](../src/components/diagrams/chain-steps.tsx#L252) | settled/paid markers in the chain plates | ✅ **brief's explicit exemption** |
| [integration-web.tsx:168](../src/components/diagrams/integration-web.tsx#L168), [:183](../src/components/diagrams/integration-web.tsx#L183), [:232](../src/components/diagrams/integration-web.tsx#L232), [:573](../src/components/diagrams/integration-web.tsx#L573) | `wire.flow === 'settled'` colouring + the `success` activity-row tone | ✅ **brief's explicit exemption** (hero wires) |

### `--color-success-band` — 1 usage, **0 moves**

| File:line | Usage | Classification |
|---|---|---|
| [permission-matrix.tsx:153](../src/components/interactive/permission-matrix.tsx#L153) | "allowed" indicator in the live permission matrix | ✅ genuine status indicator |

> ⚠️ `permission-matrix.tsx` and `cluster-switcher.tsx` have **uncommitted changes from another
> session** in the working tree. Neither needs editing for this migration, so neither is touched.

---

## 6. Section rhythm — current vs proposed

**Rules applied:** never two sand adjacent · sand never directly abuts the dark band · band reserved
for permissions/security.

### Homepage (`src/app/page.tsx`), as rendered — Testimonials returns `null`

| # | Section | Tone today | Tone after |
|---|---|---|---|
| 1 | Hero | aurora | aurora |
| 2 | ProofBand | subtle | subtle |
| 3 | Chain | **warm** | **SAND** |
| 4 | Problem | subtle | white |
| 5 | Thesis | white | **SAND** |
| 6 | Clusters | white | white |
| 7 | Architecture | white | subtle |
| 8 | Permissions | **band** | **band** |
| 9 | Capabilities | white | white |
| 10 | Intelligence | subtle | **SAND** |
| 11 | Devices | white | white |
| 12 | Developers | subtle | subtle |
| 13 | Security | **band** | **band** |
| 14 | Solutions | white | white |
| 15 | Roi | subtle | **SAND** |
| 16 | Faq | white | white |
| 17 | FinalCta | aurora | aurora |

**Before:** `aurora · grey · warm · grey · white · white · white · BAND · white · grey · white · grey ·
BAND · white · grey · white · aurora` — three consecutive whites at 5–7, and one warm section in the
whole page.

**After:** `aurora · grey · SAND · white · SAND · white · grey · BAND · white · SAND · white · grey ·
BAND · white · SAND · white · aurora`

Rule check: sand at 3, 5, 10, 15 — every neighbour is white or grey ✅ · band at 8, 13 — preceded by
grey/subtle, followed by white ✅ · band only on Permissions and Security ✅ · the 5–7 flat run is
broken ✅

### Shared page template (~40 routes)

| Block | Tone today | Tone after |
|---|---|---|
| PageHero | aurora | aurora |
| Body `<Section>` | white | white |
| `RelatedLinks` | subtle | **SAND** |
| `CtaBand` | aurora | aurora |

`/demo` keeps its `tone="band"` section — it hosts the permission matrix, which is within the
band's reserved use.

---

## 7. Contrast pairs to add to `scripts/check-contrast.mjs`

The checker parses `globals.css` and tests a fixed list. Sand pairs must be **in the list** or the
migration is unverified. `bg-warm` currently contributes 4 pairs; those are renamed and the list is
extended to cover every sand surface the site actually renders:

| Pair | Min |
|---|---|
| `fg on sand-50` | 7 |
| `fg-muted on sand-50` | 4.5 |
| `fg-subtle on sand-50` | 4.5 |
| `brand-700 on sand-50` | 4.5 |
| `fg on sand-25` | 7 |
| `fg on sand-100` | 7 |
| `fg-muted on sand-100` | 4.5 |
| `brand-600 on sand-50` | 4.5 |
| `sand-200 border on sand-50` | 1.2 (non-text boundary) |
| `sand-300 on bg` | 1.3 (non-text boundary) |
| `sand-600 on bg` | 3 (non-text: diagram strokes) |
| `sand-600 on sand-50` | 3 (non-text) |
| `app-portal / admin / platform / customer on surface` | 3 each (non-text dots) |

`--color-info` is removed from the token map. Ratios are reported by the run in the final verification
section, not asserted here.

---

## 8. Out of scope / not touched

- `logo.tsx` — untouched, per the brief.
- Brand ramp `--color-brand-50…950` and neutral ramp `--color-neutral-0…1000` — values untouched.
- `--shadow-e1…e4` and `.bg-grid` use raw `oklch(0.21 0.03 265 / …)` — that is **ink**, already
  inside the target palette. Left as-is.
- [layout.tsx:41](../src/app/layout.tsx#L41) `themeColor: '#ffffff'` — a browser-chrome metadata
  value, not a component style. Not a rule-8 violation; left as-is.
- The paused spacing/content work in [spacing-content-audit.md](spacing-content-audit.md). Its
  section-rhythm findings (A3) are resolved by §6 above; the `size="lg"` finding (A1) remains open.

---

## 9. Verification — actual output

All run against a production server (`npm run start`), 2026-08-08/09.

| Check | Result |
|---|---|
| `npm run typecheck` | Clean |
| `npm run build` | Clean, 48 routes |
| `npm run check:contrast` | **All 44 pairs meet target** (was 26) |
| `npm run check:content` | 42 routes, no content or accessibility failures |
| `npm run check:links` | 45 internal URLs, no broken links |
| `npm run audit` | **559 page loads × 13 viewports — no findings** (run twice: once after the migration, again after the seam fix in §10) |
| `npm run audit:shots` | 52 images captured and read |

Sand renders at exactly the specified hex. From the shipped CSS bundle:

```
--color-sand-50:#f8f5ef   --color-sand-200:#e7ddc8   --color-sand-600:#8f7e5a
--color-app-portal:#052457  --color-app-admin:#044cb6
--color-app-platform:#6b707c --color-app-customer:#3177dc
.bg-aurora → radial-gradient(…,#3177dc1c,…), radial-gradient(…,#e7ddc873,…)
```

`--color-accent`, `--color-info` and `--color-bg-warm`: **absent from the shipped bundle.** A regex
sweep for oklch hues 190–210 (cyan), 245–255 and 280–290 (violet) over the built CSS returns nothing.

> `sand-25`, `sand-100` and `sand-300` are declared but not yet referenced by a component, so Tailwind
> tree-shakes them out of the bundle. They are still **verified** — `check-contrast` reads
> `globals.css`, not the bundle — and exist as ramp steps for future use.

Section rhythm confirmed from `getComputedStyle`, not by eye. Homepage, in DOM order:

```
0 transparent(aurora) · 1 subtle · 2 SAND · 3 white · 4 SAND · 5 white · 6 subtle ·
7 BAND · 8 white · 9 SAND · 10 white · 11 subtle · 12 BAND · 13 white · 14 SAND ·
15 white · 16 transparent(aurora)
```

Sand at 2/4/9/14, band at 7/12 — no sand adjacent to sand, none adjacent to band, band only on
Permissions and Security. ✅

## 10. One bug the screenshots caught

Every automated check was green — 44 contrast pairs, 559 page loads, zero findings — and there was
still a visual defect.

`RelatedLinks` became `tone="warm"`, which draws `border-y border-[var(--color-sand-200)]`. `CtaBand`
sits directly below it and carried its own `border-t border-[var(--color-border)]` (cool,
`neutral-200`). Two 1px hairlines in **different hues**, stacked: a muddy two-tone 2px seam on every
one of the ~40 pages that has a Related section.

Invisible at 1×. Only found by clipping the boundary at 3× device scale and looking at it.

**Fix:** dropped `border-t` from `CtaBand`
([page-template.tsx:326](../src/components/page/page-template.tsx#L326)) — the warm section above
already provides the rule, and where there is no Related section the aurora wash carries the boundary.
Re-verified: single clean sand hairline, and the full audit re-run came back with no findings.

This is the third visual bug in this repo to pass a fully green audit. The note in `CLAUDE.md` about
reading the screenshots holds.

## 11. Needs a human decision

1. **The favicon (§3.1).** Changed from a cyan crossbar to sand. It follows from deleting
   `--color-accent`, but it is brand output and the client approved a palette, not a favicon.
   Trivially revertible — two `stop-color` values in `icon.svg`.
2. **`--color-bg-subtle` still exists** and now sits alongside sand as a second alternating surface.
   It is ink-family (hue 265) so it is inside the three-colour system, and it is doing real work: it
   is the only tone allowed to touch the dark band, since sand may not. But if you want a strict
   two-surface alternation (white ↔ sand only), the band adjacency rule needs rethinking first.
3. **`--color-sand-25/100/300` are unused.** Declared per the brief and verified, but nothing renders
   them yet. Keep as ramp steps, or trim to the three that ship?

---

**Steps 1–5 complete and verified.**

---

# ADDENDUM — 2026-08-09: a second, conflicting palette brief

A brief arrived specifying **Ink + Blue + Aurora Cyan**, with cyan promoted to a full 7-step ramp and
`--color-bg-warm` deleted on the grounds that *"warm parchment would be a 4th hue."*

**It directly reverses the migration recorded above, and both briefs claim client approval.** No code
has been written against it. This addendum is the Step 1 inventory it asked for, plus the reason work
stopped.

## A. The brief describes the pre-sand codebase

Every factual premise about current state is now false — which is the clearest evidence the brief was
written before the sand migration landed:

| Brief says | Actual state |
|---|---|
| "`--color-accent` is currently ONE value used ~5 times" | **Does not exist.** Deleted; its 7 usages were individually reassigned (§3) |
| "`--color-info` … ZERO usages … DELETE outright" | **Already deleted** |
| "`--color-bg-warm` (hue 85, 1 usage) … DELETE" | **Already deleted**, promoted to the 6-step sand ramp |
| "`--color-app-customer` (hue 200) … Already cyan" | **Now `oklch(0.58 0.17 258)` = brand-500**, re-hued off cyan |
| "the existing comment on `--color-accent` claims it 'holds 3:1 as a non-text accent on white'" | **That comment no longer exists** — it was deleted with the token |
| "`<Section>` already accepts `tone="warm"`" | True, but it now resolves to `--color-sand-50`, not `--color-bg-warm` |

**The brief is right about the contrast bug, and it was a real one.** The old comment did claim 3:1
for `oklch(0.72 0.14 200)`, and that value computes to **2.29:1** on white. That claim is gone because
the token is gone — but it is worth recording that it was false, since the same value returns as
`cyan-500` under the new brief.

## B. Step 1 inventory — current state

Three of the seven tokens the brief asks about no longer exist. The rest:

### `--color-app-*` — 4 usages, all in one map

All four are consumed only by `APP_TONE` in
[architecture.tsx:30-33](../src/components/sections/architecture.tsx#L30-L33), rendered as `size-2`
**dot fills** at [architecture.tsx:78-82](../src/components/sections/architecture.tsx#L78-L82), each
paired with its app name in text.

| Token | Current value | Role | On white |
|---|---|---|---|
| `--color-app-portal` | `oklch(0.275 0.100 260)` brand-900 | dot fill | 15.02:1 |
| `--color-app-admin` | `oklch(0.450 0.180 260)` brand-600 | dot fill | 7.71:1 |
| `--color-app-platform` | `oklch(0.545 0.019 265)` neutral-500 | dot fill | 4.96:1 |
| `--color-app-customer` | `oklch(0.580 0.170 258)` brand-500 | dot fill | 4.36:1 |

> Violet (hue 285) is **already gone** — the new brief's Step 4 request to re-hue it is already done,
> just onto ink rather than cyan.

### `--color-danger` — 5 live usages, all functional (3 decorative already removed)

| File:line | Role |
|---|---|
| [contact-form.tsx:179](../src/components/interactive/contact-form.tsx#L179) | error message **text** |
| [contact-form.tsx:225](../src/components/interactive/contact-form.tsx#L225) | submit status **text** |
| [contact-form.tsx:258](../src/components/interactive/contact-form.tsx#L258) | invalid field **border** |
| [contact-form.tsx:291](../src/components/interactive/contact-form.tsx#L291) | field error **text** |
| ~~problem.tsx:27~~, ~~three-systems.tsx:57/65/84~~ | **already moved off** in the sand pass |

### `--color-warning` — 3 usages, all functional

| File:line | Role |
|---|---|
| [legal/[doc]/page.tsx:49](../src/app/legal/[doc]/page.tsx#L49) | draft-notice **border + background** |
| [legal/[doc]/page.tsx:52](../src/app/legal/[doc]/page.tsx#L52) | alert **icon** |
| [security/page.tsx:45](../src/app/security/page.tsx#L45) | "In progress" status pill — border, bg, **text** |

### `--color-success` / `--color-success-band` — 10 usages, all functional or exempt

| File:line | Role | Status |
|---|---|---|
| [security/page.tsx:44](../src/app/security/page.tsx#L44) | "Implemented" pill — border, bg, text | status indicator |
| [contact-form.tsx:98](../src/components/interactive/contact-form.tsx#L98), [:99](../src/components/interactive/contact-form.tsx#L99) | success panel border/bg + **text** | form success |
| [chain-steps.tsx:116](../src/components/diagrams/chain-steps.tsx#L116), [:193](../src/components/diagrams/chain-steps.tsx#L193), [:252](../src/components/diagrams/chain-steps.tsx#L252) | settled-step **fill** | **exempt** |
| [integration-web.tsx:168](../src/components/diagrams/integration-web.tsx#L168), [:183](../src/components/diagrams/integration-web.tsx#L183), [:232](../src/components/diagrams/integration-web.tsx#L232), [:573](../src/components/diagrams/integration-web.tsx#L573) | settled-wire **stroke** + row tone | **exempt** |
| [permission-matrix.tsx:153](../src/components/interactive/permission-matrix.tsx#L153) | "allowed" indicator **text** on band | status indicator |

> The Step 6 quarantine the new brief asks for is **already implemented** — same rule, same exemption,
> already commented in `globals.css`. It needs no rework under either palette.

### `--color-sand-*` — what cyan would displace

| File:line | Role |
|---|---|
| [primitives.tsx:55](../src/components/site/primitives.tsx#L55) | `Section tone="warm"` **surface + border** |
| [three-systems.tsx:62](../src/components/diagrams/three-systems.tsx#L62), [:69](../src/components/diagrams/three-systems.tsx#L69) | diagram **strokes** (ex-danger) |
| [three-systems.tsx:87](../src/components/diagrams/three-systems.tsx#L87) | callout **border + background** (ex-danger) |
| [globals.css:222](../src/app/globals.css#L222) | `.bg-aurora` second radial **fill** |
| [icon.svg:28-29](../src/app/icon.svg#L28-L29) | favicon crossbar **gradient** |
| 4 homepage sections + `RelatedLinks` | `tone="warm"` call sites |

## C. Why this is blocking

Switching to cyan is not additive — it **overwrites** uncommitted, verified work. Specifically it would
revert: the sand ramp, the aurora's warm radial, the favicon crossbar, the two ex-danger diagram
treatments (which would need a third colour decision), and the `tone="warm"` → `tone="tint"` rename
touching every call site.

Both briefs are labelled client-approved and they are mutually exclusive: one says warm parchment *is*
the third colour, the other says warm parchment *would be a fourth hue*. That is a product decision,
not an implementation detail.

**Nothing has been changed for the cyan brief. Awaiting a decision.**
